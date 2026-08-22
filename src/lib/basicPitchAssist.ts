/**
 * Spotify Basic Pitch assist — Apache-2.0 (free/open).
 * Model weights: public/models/basic-pitch (Apache-2.0).
 * Leaf module (no import from audioToMidi) so convert can call us safely.
 * Uses dynamic import of @spotify/basic-pitch so Node/vitest stays light.
 */

import type { DetectedNote } from './audioToMidi'

const DEFAULT_TPQ = 480
const BP_SR = 22050

/** Bundled free model (Vite static serve from public/). */
export const BASIC_PITCH_MODEL_URL = '/models/basic-pitch/model.json'

export type BasicPitchNote = {
  startTimeSeconds: number
  durationSeconds: number
  pitchMidi: number
  amplitude: number
}

/** Linear resample mono PCM (alias used by audioToMidi). */
export function resampleMono(
  samples: Float32Array,
  fromRate: number,
  toRate: number,
): Float32Array {
  if (!Number.isFinite(fromRate) || fromRate <= 0) return samples
  if (Math.abs(fromRate - toRate) < 0.5) return samples
  const ratio = fromRate / toRate
  const n = Math.max(1, Math.floor(samples.length / ratio))
  const out = new Float32Array(n)
  const last = samples.length - 1
  for (let i = 0; i < n; i++) {
    const src = i * ratio
    const j = Math.floor(src)
    const f = src - j
    const a = samples[Math.min(j, last)] ?? 0
    const b = samples[Math.min(j + 1, last)] ?? 0
    out[i] = a + (b - a) * f
  }
  return out
}

/** @deprecated use resampleMono */
export const resampleLinear = resampleMono

function guitarRegisterScore(midi: number): number {
  if (midi < 36 || midi > 88) return 0
  if (midi >= 45 && midi <= 76) return 1
  if (midi >= 40 && midi < 45) return 0.75
  if (midi > 76 && midi <= 84) return 0.7
  return 0.35
}

/** Map Basic Pitch note events → DetectedNote ticks at tempoBpm. */
export function basicPitchNotesToDetected(
  notes: BasicPitchNote[],
  tempoBpm: number,
  tpq = DEFAULT_TPQ,
  a4 = 440,
): DetectedNote[] {
  const bpm = Math.max(30, Math.min(300, tempoBpm || 100))
  const secPerBeat = 60 / bpm
  const shift =
    Number.isFinite(a4) && a4 > 0 && Math.abs(a4 - 440) > 0.05
      ? Math.round(12 * Math.log2(a4 / 440))
      : 0

  return notes
    .filter(
      (n) =>
        Number.isFinite(n.pitchMidi) &&
        n.durationSeconds > 0.04 &&
        n.pitchMidi + shift >= 36 &&
        n.pitchMidi + shift <= 88,
    )
    .map((n) => {
      const pitch = Math.round(n.pitchMidi) + shift
      const startSec = Math.max(0, n.startTimeSeconds)
      const durSec = Math.max(0.05, n.durationSeconds)
      const conf = Math.max(0, Math.min(1, n.amplitude))
      return {
        pitch,
        start: Math.round((startSec / secPerBeat) * tpq),
        duration: Math.max(1, Math.round((durSec / secPerBeat) * tpq)),
        velocity: Math.max(1, Math.min(127, Math.round(40 + conf * 87))),
        timeSec: startSec,
        durationSec: durSec,
        confidence: conf,
      } satisfies DetectedNote
    })
    .sort((a, b) => a.start - b.start || a.pitch - b.pitch)
}

/** Prefer frettable guitar-register notes when Basic Pitch returns a dense poly spray. */
export function thinToGuitarLead(notes: DetectedNote[], maxSimul = 3): DetectedNote[] {
  if (notes.length === 0) return notes
  // Score + soft drop only when dense; always enforce simultaneous voice cap.
  let kept = notes
  if (notes.length > 8) {
    let scored = notes.map((n) => ({
      n,
      s: guitarRegisterScore(n.pitch) * (0.4 + 0.6 * (n.confidence ?? 0.5)),
    }))
    scored.sort((a, b) => b.s - a.s)
    const floor = scored[Math.min(scored.length - 1, Math.floor(scored.length * 0.7))]?.s ?? 0
    scored = scored.filter((x) => x.s >= floor * 0.85)
    kept = scored.map((x) => x.n).sort((a, b) => a.start - b.start)
  } else {
    // Prefer stronger / in-register notes first when capping a chord
    kept = [...notes].sort((a, b) => {
      const sa = guitarRegisterScore(a.pitch) * (0.4 + 0.6 * (a.confidence ?? 0.5))
      const sb = guitarRegisterScore(b.pitch) * (0.4 + 0.6 * (b.confidence ?? 0.5))
      return sb - sa || a.start - b.start
    })
  }

  const out: DetectedNote[] = []
  for (const n of kept) {
    const active = out.filter(
      (o) => o.start < n.start + n.duration && o.start + o.duration > n.start,
    )
    if (active.length >= maxSimul) {
      const weakest = active.reduce((w, o) =>
        (o.confidence ?? 0) < (w.confidence ?? 0) ? o : w,
      )
      if ((n.confidence ?? 0) > (weakest.confidence ?? 0) + 0.05) {
        const idx = out.indexOf(weakest)
        if (idx >= 0) out.splice(idx, 1)
        out.push(n)
      }
      continue
    }
    out.push(n)
  }
  return out.sort((a, b) => a.start - b.start)
}

/** Whether Basic Pitch output is worth using vs falling back. */
export function preferBasicPitchNotes(notes: DetectedNote[]): boolean {
  if (!notes || notes.length < 3) return false
  const conf =
    notes.reduce((s, n) => s + (n.confidence ?? 0.5), 0) / Math.max(1, notes.length)
  return conf >= 0.2 || notes.length >= 6
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedModel: any = null
let cachedModelUrl: string | null = null
let availableCache: boolean | null = null

export function resetBasicPitchCache(): void {
  cachedModel = null
  cachedModelUrl = null
  availableCache = null
}

async function loadBasicPitchModule() {
  return import('@spotify/basic-pitch')
}

export async function getBasicPitch(modelUrl = BASIC_PITCH_MODEL_URL) {
  if (cachedModel && cachedModelUrl === modelUrl) return cachedModel
  const { BasicPitch } = await loadBasicPitchModule()
  const bp = new BasicPitch(modelUrl)
  await bp.model
  cachedModel = bp
  cachedModelUrl = modelUrl
  return bp
}

/**
 * Probe whether the free model can load.
 * In Node/vitest without a real /models server, returns false quickly.
 */
export async function basicPitchAvailable(modelUrl = BASIC_PITCH_MODEL_URL): Promise<boolean> {
  if (availableCache != null && modelUrl === BASIC_PITCH_MODEL_URL) return availableCache
  try {
    if (typeof fetch !== 'function') {
      availableCache = false
      return false
    }
    // Fail fast in Node/tests when the static model is not served
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timer =
      ctrl && typeof setTimeout === 'function'
        ? setTimeout(() => ctrl.abort(), 1500)
        : null
    try {
      const res = await fetch(modelUrl, {
        method: 'GET',
        signal: ctrl?.signal,
      })
      if (!res.ok) {
        availableCache = false
        return false
      }
    } finally {
      if (timer) clearTimeout(timer)
    }
    await getBasicPitch(modelUrl)
    availableCache = true
    return true
  } catch {
    availableCache = false
    return false
  }
}

/** Run Basic Pitch on mono PCM (any sample rate). */
export async function runBasicPitchOnPcm(
  samples: Float32Array,
  sampleRate: number,
  opts?: {
    modelUrl?: string
    onProgress?: (pct: number) => void
    minHz?: number
    maxHz?: number
  },
): Promise<BasicPitchNote[]> {
  const { addPitchBendsToNoteEvents, noteFramesToTime, outputToNotesPoly } =
    await loadBasicPitchModule()
  const bp = await getBasicPitch(opts?.modelUrl ?? BASIC_PITCH_MODEL_URL)
  const mono = resampleMono(samples, sampleRate, BP_SR)
  const frames: number[][] = []
  const onsets: number[][] = []
  const contours: number[][] = []

  await bp.evaluateModel(
    mono,
    (f: number[][], o: number[][], c: number[][]) => {
      frames.push(...f)
      onsets.push(...o)
      contours.push(...c)
    },
    (p: number) => opts?.onProgress?.(Math.max(0, Math.min(1, p))),
  )

  const poly = outputToNotesPoly(
    frames,
    onsets,
    0.5,
    0.3,
    5,
    true,
    opts?.maxHz ?? 1200,
    opts?.minHz ?? 70,
    true,
  )
  const withBends = addPitchBendsToNoteEvents(contours, poly)
  return noteFramesToTime(withBends).map((n: {
    startTimeSeconds: number
    durationSeconds: number
    pitchMidi: number
    amplitude: number
  }) => ({
    startTimeSeconds: n.startTimeSeconds,
    durationSeconds: n.durationSeconds,
    pitchMidi: n.pitchMidi,
    amplitude: n.amplitude,
  }))
}

/**
 * Full note list for audioToMidi: Basic Pitch → DetectedNote (+ thin + optional A4 shift).
 */
export async function notesFromBasicPitch(
  samples: Float32Array,
  sampleRate: number,
  opts?: {
    tempoBpm?: number
    a4?: number
    modelUrl?: string
    onProgress?: (pct: number) => void
  },
): Promise<DetectedNote[]> {
  const tempoBpm = opts?.tempoBpm ?? 100
  const a4 = opts?.a4 ?? 440
  const bpNotes = await runBasicPitchOnPcm(samples, sampleRate, {
    modelUrl: opts?.modelUrl,
    onProgress: opts?.onProgress,
  })
  let notes = basicPitchNotesToDetected(bpNotes, tempoBpm, DEFAULT_TPQ, a4)
  notes = thinToGuitarLead(notes)

  const secPerBeat = 60 / Math.max(30, Math.min(300, tempoBpm))
  const grid = secPerBeat / 4
  notes = notes.map((n) => {
    const qStart = Math.round(n.timeSec / grid) * grid
    const qEnd = Math.round((n.timeSec + n.durationSec) / grid) * grid
    const durSec = Math.max(grid * 0.5, qEnd - qStart)
    return {
      ...n,
      timeSec: qStart,
      durationSec: durSec,
      start: Math.round((qStart / secPerBeat) * DEFAULT_TPQ),
      duration: Math.max(1, Math.round((durSec / secPerBeat) * DEFAULT_TPQ)),
    }
  })
  return notes
}

export function canAttemptBasicPitch(): boolean {
  return typeof fetch === 'function' || typeof window !== 'undefined'
}
