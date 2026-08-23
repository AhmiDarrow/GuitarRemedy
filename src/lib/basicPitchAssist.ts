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
export function thinToGuitarLead(notes: DetectedNote[], maxSimul = 4): DetectedNote[] {
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

/**
 * Keep playable multipitch (up to maxVoices simultaneous) instead of collapsing to one line.
 * Clusters near-simultaneous onsets into guitar-register chords; drops bass thump / ghosts.
 * This is the quality jump past pure monophonic extract for Basic Pitch drafts.
 */
export function extractPlayableVoices(
  notes: DetectedNote[],
  opts?: { maxVoices?: number; clusterSec?: number; minConf?: number },
): DetectedNote[] {
  if (notes.length === 0) return notes
  const maxVoices = Math.max(1, Math.min(6, opts?.maxVoices ?? 4))
  const clusterSec = opts?.clusterSec ?? 0.045
  const minConf = opts?.minConf ?? 0.22

  const sorted = [...notes]
    .filter((n) => (n.confidence ?? 0.5) >= minConf * 0.7)
    .sort(
      (a, b) =>
        a.timeSec - b.timeSec ||
        b.pitch - a.pitch ||
        (b.confidence ?? 0) - (a.confidence ?? 0),
    )
  if (sorted.length === 0) return []

  const scoreVoice = (n: DetectedNote): number =>
    guitarRegisterScore(n.pitch) * 2.1 +
    (n.confidence ?? 0.5) * 1.5 +
    Math.min(1.0, n.durationSec * 1.8)

  const out: DetectedNote[] = []
  let i = 0
  while (i < sorted.length) {
    const t0 = sorted[i].timeSec
    const cluster: DetectedNote[] = []
    while (i < sorted.length && sorted[i].timeSec <= t0 + clusterSec) {
      cluster.push(sorted[i])
      i++
    }
    // Unique pitches in cluster (keep strongest per pitch)
    const byPitch = new Map<number, DetectedNote>()
    for (const n of cluster) {
      const prev = byPitch.get(n.pitch)
      if (!prev || scoreVoice(n) > scoreVoice(prev)) byPitch.set(n.pitch, n)
    }
    let voices = [...byPitch.values()].sort((a, b) => scoreVoice(b) - scoreVoice(a))
    // Drop low-register thump when stronger guitar-register voices exist
    if (voices.length > 1) {
      const top = voices[0]
      voices = voices.filter(
        (v) =>
          v === top ||
          guitarRegisterScore(v.pitch) >= 0.55 ||
          scoreVoice(v) >= scoreVoice(top) * 0.55,
      )
    }
    voices = voices.slice(0, maxVoices).sort((a, b) => a.pitch - b.pitch)
    // Align chord onsets to the cluster start for clean fretting/MIDI
    const startSec = Math.min(...voices.map((v) => v.timeSec))
    const maxEnd = Math.max(...voices.map((v) => v.timeSec + v.durationSec))
    const durSec = Math.max(0.06, maxEnd - startSec)
    for (const v of voices) {
      const conf = v.confidence ?? 0.5
      if (conf < minConf && voices.length > 1 && scoreVoice(v) < scoreVoice(voices[voices.length - 1]) * 0.9) {
        continue
      }
      const ratio =
        v.durationSec > 0 && v.duration > 0 ? v.duration / v.durationSec : 480 / 0.5
      out.push({
        ...v,
        timeSec: startSec,
        durationSec: Math.max(0.06, Math.min(v.durationSec + 0.02, durSec)),
        start: Math.max(0, Math.round(v.start + ((startSec - v.timeSec) * ratio))),
        duration: Math.max(1, Math.round(Math.max(0.06, Math.min(v.durationSec + 0.02, durSec)) * ratio)),
      })
    }
  }

  // Drop exact pitch duplicates that fully overlap after align
  const cleaned: DetectedNote[] = []
  for (const n of out.sort((a, b) => a.timeSec - b.timeSec || a.pitch - b.pitch)) {
    const dup = cleaned.find(
      (c) =>
        c.pitch === n.pitch &&
        Math.abs(c.timeSec - n.timeSec) < clusterSec &&
        c.timeSec + c.durationSec > n.timeSec,
    )
    if (dup) {
      if ((n.confidence ?? 0) > (dup.confidence ?? 0)) {
        cleaned[cleaned.indexOf(dup)] = n
      }
      continue
    }
    cleaned.push(n)
  }
  return cleaned
}

/** True when a draft has simultaneous fretted voices worth keeping. */
export function hasMultipitchContent(notes: DetectedNote[], clusterSec = 0.05): boolean {
  if (notes.length < 2) return false
  const sorted = [...notes].sort((a, b) => a.timeSec - b.timeSec)
  for (let i = 0; i < sorted.length; i++) {
    let simul = 1
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[j].timeSec - sorted[i].timeSec > clusterSec) break
      if (sorted[j].pitch !== sorted[i].pitch) simul++
      if (simul >= 2) return true
    }
  }
  return false
}

/**
 * Collapse multipitch spray into one playable monophonic lead line.
 * Prefers guitar-register continuity over hopping to every simultaneous voice.
 * Use after thinToGuitarLead when fretting a single melody tab.
 */
export function extractMonophonicMelody(
  notes: DetectedNote[],
  opts?: { maxJump?: number; minGapSec?: number },
): DetectedNote[] {
  if (notes.length === 0) return notes
  const maxJump = opts?.maxJump ?? 7
  const minGapSec = opts?.minGapSec ?? 0.04
  const sorted = [...notes].sort(
    (a, b) => a.timeSec - b.timeSec || b.pitch - a.pitch || (b.confidence ?? 0) - (a.confidence ?? 0),
  )

  const scorePick = (n: DetectedNote, prev: number | null): number => {
    const reg = guitarRegisterScore(n.pitch)
    const conf = n.confidence ?? 0.5
    let s = reg * 2.2 + conf * 1.4 + Math.min(1.2, n.durationSec * 2)
    if (prev != null) {
      const jump = Math.abs(n.pitch - prev)
      if (jump === 0) s += 0.35
      else if (jump <= 2) s += 0.55
      else if (jump <= 5) s += 0.15
      else if (jump <= maxJump) s -= (jump - 5) * 0.12
      else s -= (jump - maxJump) * 0.45 + 0.8
      // Prefer staying in the same octave neighborhood on full-band spray
      const oct = Math.abs(Math.round((n.pitch - prev) / 12))
      if (oct >= 1) s -= oct * 0.55
    }
    return s
  }

  const melody: DetectedNote[] = []
  let i = 0
  while (i < sorted.length) {
    const t0 = sorted[i].timeSec
    // Cluster notes that start together (chord / multipitch frame)
    const cluster: DetectedNote[] = []
    while (i < sorted.length && sorted[i].timeSec <= t0 + minGapSec) {
      cluster.push(sorted[i])
      i++
    }
    const prev = melody.length ? melody[melody.length - 1].pitch : null
    // If still overlapping previous sustain, only take a new note if it's a clear lead
    if (melody.length) {
      const last = melody[melody.length - 1]
      const lastEnd = last.timeSec + last.durationSec
      if (t0 < lastEnd - 0.02) {
        const best = cluster.reduce((a, b) =>
          scorePick(a, prev) >= scorePick(b, prev) ? a : b,
        )
        // Replace only if clearly better lead and not a bass grab
        if (
          scorePick(best, prev) > scorePick(last, melody.length > 1 ? melody[melody.length - 2].pitch : null) + 0.35 &&
          guitarRegisterScore(best.pitch) >= guitarRegisterScore(last.pitch) - 0.15
        ) {
          // Shorten previous note to make room
          const cut = Math.max(0.05, t0 - last.timeSec)
          const secPerBeat =
            last.durationSec > 0 && last.duration > 0
              ? last.durationSec / (last.duration / 480)
              : 0.5
          melody[melody.length - 1] = {
            ...last,
            durationSec: cut,
            duration: Math.max(1, Math.round((cut / Math.max(0.05, last.durationSec)) * last.duration)),
          }
          void secPerBeat
          melody.push(best)
        }
        continue
      }
    }
    const pick = cluster.reduce((a, b) => (scorePick(a, prev) >= scorePick(b, prev) ? a : b))
    melody.push(pick)
  }

  // Merge immediate same-pitch neighbors
  const merged: DetectedNote[] = []
  for (const n of melody) {
    const prev = merged[merged.length - 1]
    if (
      prev &&
      prev.pitch === n.pitch &&
      n.timeSec <= prev.timeSec + prev.durationSec + 0.08
    ) {
      const end = Math.max(prev.timeSec + prev.durationSec, n.timeSec + n.durationSec)
      const durSec = end - prev.timeSec
      const ratio = prev.durationSec > 0 ? durSec / prev.durationSec : 1
      merged[merged.length - 1] = {
        ...prev,
        durationSec: durSec,
        duration: Math.max(1, Math.round(prev.duration * ratio)),
        confidence: Math.max(prev.confidence ?? 0, n.confidence ?? 0),
        velocity: Math.max(prev.velocity, n.velocity),
      }
    } else {
      merged.push({ ...n })
    }
  }
  return merged
}

/** Quality score for ranking pitch engines / stems (higher = better fretting draft). */
export function scoreDetectedMelody(notes: DetectedNote[]): number {
  if (!notes || notes.length < 2) return 0
  const sorted = [...notes].sort((a, b) => a.timeSec - b.timeSec || a.pitch - b.pitch)
  let conf = 0
  let reg = 0
  let jumps = 0
  let dur = 0
  let chordBonus = 0
  let lastMelody: DetectedNote | null = null
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i]
    conf += n.confidence ?? 0.5
    reg += guitarRegisterScore(n.pitch)
    dur += n.durationSec
    if (lastMelody) {
      const dt = n.timeSec - lastMelody.timeSec
      if (dt <= 0.05) {
        // Same chord cluster — reward playable multipitch, don't jump-penalize
        chordBonus += 0.35
      } else {
        const d = Math.abs(n.pitch - lastMelody.pitch)
        jumps += d > 7 ? d * 1.4 : d * 0.2
        lastMelody = n
      }
    } else {
      lastMelody = n
    }
    // Track highest note in cluster as melody continuity anchor
    if (lastMelody && Math.abs(n.timeSec - lastMelody.timeSec) <= 0.05 && n.pitch > lastMelody.pitch) {
      lastMelody = n
    }
  }
  const n = sorted.length
  const span = Math.max(
    0.5,
    sorted[n - 1].timeSec + sorted[n - 1].durationSec - sorted[0].timeSec,
  )
  const density = Math.min(1.6, n / Math.max(4, span * 2.2))
  return (
    (conf / n) * 90 +
    (reg / n) * 40 +
    Math.min(30, dur * 3) +
    density * 18 -
    jumps * 0.4 +
    Math.min(20, n * 0.55) +
    Math.min(12, chordBonus * 2.5)
  )
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
  // Multipitch → thin spray → keep up to 4 playable simultaneous voices (not mono collapse)
  notes = thinToGuitarLead(notes, 4)
  notes = extractPlayableVoices(notes, { maxVoices: 4, clusterSec: 0.045, minConf: 0.2 })

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
