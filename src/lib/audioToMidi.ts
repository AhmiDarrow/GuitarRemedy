/**
 * MP3/WAV/OGG → MIDI converter (light assist).
 * Browser Web Audio decode + autocorrelation pitch track → SMF MIDI.
 * Monophonic / dominant-pitch only — not multi-voice transcription.
 *
 * Quality pipeline (full-band):
 *   stereo mid (center) extract → auto stem race (lead/harmonic/mix via HPSS) →
 *   melody-band → pitch track (guitar register) → octave repair → confidence filter →
 *   note group → tempo snap (½×/2×) → beat quantize → ghost drop → MIDI.
 * Still monophonic assist — not multi-voice transcription.
 */

import { buildSimpleMidi, parseMidi, type MidiNote, type MidiParseResult } from './midi'

export interface PitchFrame {
  timeSec: number
  hz: number
  midi: number
  confidence: number
}

export interface DetectedNote {
  pitch: number
  start: number // ticks
  duration: number // ticks
  velocity: number
  timeSec: number
  durationSec: number
  /** 0..1 average frame confidence when available */
  confidence?: number
}

export interface AudioToMidiResult {
  notes: DetectedNote[]
  midi: MidiParseResult
  midiBytes: ArrayBuffer
  tempoBpm: number
  /** Tempo estimated from onset energy (before user override). */
  detectedTempoBpm: number
  durationSec: number
  sampleRate: number
  warnings: string[]
  /** Seconds of source audio actually analyzed (after trim). */
  analyzedSec?: number
  trimSec?: number
}

const DEFAULT_TPQ = 480

/** Hz → nearest MIDI note (default A4=440; pass Profile a4 when converting). */
export function hzToMidi(hz: number, a4 = 440): number {
  if (!Number.isFinite(hz) || hz <= 0) return -1
  return Math.round(69 + 12 * Math.log2(hz / a4))
}

export function midiToHz(midi: number, a4 = 440): number {
  return a4 * 2 ** ((midi - 69) / 12)
}

/**
 * Autocorrelation pitch estimate for one mono frame.
 * Returns hz + 0..1 confidence (normalized peak).
 */
export function detectPitchHz(
  frame: Float32Array,
  sampleRate: number,
  opts?: { minHz?: number; maxHz?: number },
): { hz: number; confidence: number } {
  const minHz = opts?.minHz ?? 80 // ~E2 guitar
  const maxHz = opts?.maxHz ?? 1200 // ~D6
  const n = frame.length
  if (n < 32 || sampleRate <= 0) return { hz: 0, confidence: 0 }

  // RMS gate — silence
  let rms = 0
  for (let i = 0; i < n; i++) rms += frame[i] * frame[i]
  rms = Math.sqrt(rms / n)
  if (rms < 0.01) return { hz: 0, confidence: 0 }

  const minLag = Math.max(2, Math.floor(sampleRate / maxHz))
  const maxLag = Math.min(n - 2, Math.floor(sampleRate / minHz))
  if (maxLag <= minLag) return { hz: 0, confidence: 0 }

  // Remove mean
  let mean = 0
  for (let i = 0; i < n; i++) mean += frame[i]
  mean /= n

  let bestLag = minLag
  let bestCorr = -Infinity
  let r0 = 0
  for (let i = 0; i < n; i++) {
    const v = frame[i] - mean
    r0 += v * v
  }
  if (r0 < 1e-12) return { hz: 0, confidence: 0 }

  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0
    const lim = n - lag
    for (let i = 0; i < lim; i++) {
      corr += (frame[i] - mean) * (frame[i + lag] - mean)
    }
    if (corr > bestCorr) {
      bestCorr = corr
      bestLag = lag
    }
  }

  const confidence = Math.max(0, Math.min(1, bestCorr / r0))
  if (confidence < 0.25) return { hz: 0, confidence }

  // Parabolic refine around peak
  const lag = bestLag
  const c = (lo: number) => {
    let corr = 0
    const lim = n - lo
    for (let i = 0; i < lim; i++) corr += (frame[i] - mean) * (frame[i + lo] - mean)
    return corr
  }
  let refined = lag
  if (lag > minLag && lag < maxLag) {
    const y0 = c(lag - 1)
    const y1 = bestCorr
    const y2 = c(lag + 1)
    const denom = 2 * (2 * y1 - y2 - y0)
    if (Math.abs(denom) > 1e-12) {
      const delta = (y0 - y2) / denom
      if (Math.abs(delta) < 1) refined = lag + delta
    }
  }

  const hz = sampleRate / refined
  if (hz < minHz || hz > maxHz) return { hz: 0, confidence }
  return { hz, confidence }
}

/** Walk mono PCM and emit pitched frames. */
export function trackPitchFrames(
  samples: Float32Array,
  sampleRate: number,
  opts?: { hopSec?: number; windowSec?: number; minConfidence?: number; a4?: number },
): PitchFrame[] {
  const hopSec = opts?.hopSec ?? 0.046
  const windowSec = opts?.windowSec ?? 0.09
  const minConf = opts?.minConfidence ?? 0.28
  const a4 = Number.isFinite(opts?.a4) && (opts!.a4 as number) > 0 ? (opts!.a4 as number) : 440
  const hop = Math.max(1, Math.floor(sampleRate * hopSec))
  const win = Math.max(64, Math.floor(sampleRate * windowSec))
  const frames: PitchFrame[] = []

  for (let start = 0; start + win < samples.length; start += hop) {
    const slice = samples.subarray(start, start + win)
    const { hz, confidence } = detectPitchHz(slice, sampleRate)
    if (hz > 0 && confidence >= minConf) {
      const midi = hzToMidi(hz, a4)
      if (midi >= 36 && midi <= 88) {
        frames.push({
          timeSec: start / sampleRate,
          hz,
          midi,
          confidence,
        })
      }
    }
  }
  return frames
}

/**
 * Repair common octave / harmonic errors in a pitch frame stream.
 * Prefers continuity with the running median melody register.
 */
export function repairOctaveFrames(frames: PitchFrame[]): PitchFrame[] {
  if (frames.length < 2) return frames.map((f) => ({ ...f }))

  const out: PitchFrame[] = frames.map((f) => ({ ...f }))
  // Seed register from first high-confidence frames
  const seed = out
    .filter((f) => f.confidence >= 0.35)
    .slice(0, 12)
    .map((f) => f.midi)
  let register =
    seed.length > 0
      ? seed.sort((a, b) => a - b)[Math.floor(seed.length / 2)]
      : out[0].midi

  for (let i = 0; i < out.length; i++) {
    let m = out[i].midi
    // Pull toward register by whole octaves
    while (m - register > 7) m -= 12
    while (register - m > 7) m += 12
    // Prefer staying near previous frame
    if (i > 0) {
      const prev = out[i - 1].midi
      let best = m
      let bestDist = Math.abs(m - prev)
      for (const cand of [m - 12, m, m + 12]) {
        if (cand < 36 || cand > 88) continue
        const d = Math.abs(cand - prev) + Math.abs(cand - register) * 0.35
        if (d < bestDist) {
          bestDist = d
          best = cand
        }
      }
      m = best
    }
    out[i] = { ...out[i], midi: m, hz: midiToHz(m) }
    // Slow register chase
    register = register * 0.85 + m * 0.15
  }
  return out
}

/** Drop isolated low-confidence blips that don't form a real note. */
export function filterLowConfidenceFrames(
  frames: PitchFrame[],
  opts?: { minConfidence?: number; minRun?: number },
): PitchFrame[] {
  const minConf = opts?.minConfidence ?? 0.32
  const minRun = opts?.minRun ?? 2
  const strong = frames.filter((f) => f.confidence >= minConf)
  if (strong.length === 0) return []

  const kept: PitchFrame[] = []
  let run: PitchFrame[] = []
  const flush = () => {
    if (run.length >= minRun) kept.push(...run)
    else if (run.length === 1 && run[0].confidence >= 0.55) kept.push(run[0])
    run = []
  }
  for (const f of strong) {
    const prev = run[run.length - 1]
    if (!prev || Math.abs(f.midi - prev.midi) <= 1) {
      run.push(f)
    } else {
      flush()
      run = [f]
    }
  }
  flush()
  return kept
}

/**
 * Snap note onsets/durations to a musical grid (default 16th notes).
 */
export function quantizeDetectedNotes(
  notes: DetectedNote[],
  opts?: {
    tempoBpm?: number
    ticksPerQuarter?: number
    gridDivisions?: number // 4=quarter, 8=8th, 16=16th
    strength?: number // 0..1 blend toward grid
  },
): DetectedNote[] {
  if (notes.length === 0) return []
  const tempoBpm = opts?.tempoBpm ?? 100
  const tpq = opts?.ticksPerQuarter ?? DEFAULT_TPQ
  const div = opts?.gridDivisions ?? 16
  const strength = opts?.strength ?? 0.85
  const grid = Math.max(1, Math.round(tpq / (div / 4)))
  const tickToSec = (t: number) => (t * 60) / (tempoBpm * tpq)

  const snap = (ticks: number) => Math.max(0, Math.round(ticks / grid) * grid)

  return notes.map((n) => {
    const qStart = snap(n.start)
    const blendedStart = Math.round(n.start * (1 - strength) + qStart * strength)
    let qDur = snap(n.duration)
    if (qDur < grid) qDur = grid
    const blendedDur = Math.max(grid, Math.round(n.duration * (1 - strength) + qDur * strength))
    return {
      ...n,
      start: blendedStart,
      duration: blendedDur,
      timeSec: tickToSec(blendedStart),
      durationSec: tickToSec(blendedDur),
    }
  })
}

/** Merge overlapping / back-to-back same-pitch notes after quantize. */
export function mergeAdjacentNotes(
  notes: DetectedNote[],
  opts?: { ticksPerQuarter?: number; samePitchOnly?: boolean },
): DetectedNote[] {
  const tpq = opts?.ticksPerQuarter ?? DEFAULT_TPQ
  const sameOnly = opts?.samePitchOnly ?? true
  const sorted = [...notes].sort((a, b) => a.start - b.start || a.pitch - b.pitch)
  const out: DetectedNote[] = []
  for (const n of sorted) {
    const prev = out[out.length - 1]
    const gap = prev ? n.start - (prev.start + prev.duration) : Infinity
    const same = prev && prev.pitch === n.pitch
    if (prev && gap <= tpq / 8 && (same || !sameOnly)) {
      if (same) {
        const end = Math.max(prev.start + prev.duration, n.start + n.duration)
        prev.duration = end - prev.start
        prev.durationSec = Math.max(
          prev.durationSec,
          n.timeSec + n.durationSec - prev.timeSec,
        )
        prev.velocity = Math.max(prev.velocity, n.velocity)
      }
    } else {
      out.push({ ...n })
    }
  }
  return out
}

/** Drop very short / quiet ghost notes that clutter tabs. */
export function dropGhostNotes(
  notes: DetectedNote[],
  opts?: { minDurationSec?: number; minVelocity?: number },
): DetectedNote[] {
  const minDur = opts?.minDurationSec ?? 0.07
  const minVel = opts?.minVelocity ?? 42
  return notes.filter((n) => n.durationSec >= minDur && n.velocity >= minVel)
}

/** Group stable pitch frames into note events (ticks @ tpq, tempo). */
export function framesToNotes(
  frames: PitchFrame[],
  opts?: {
    tempoBpm?: number
    ticksPerQuarter?: number
    minDurationSec?: number
    maxGapSec?: number
    quantize?: boolean
    gridDivisions?: number
  },
): DetectedNote[] {
  const tempoBpm = opts?.tempoBpm ?? 100
  const tpq = opts?.ticksPerQuarter ?? DEFAULT_TPQ
  const minDur = opts?.minDurationSec ?? 0.09
  const maxGap = opts?.maxGapSec ?? 0.11
  if (frames.length === 0) return []

  const cleaned = filterLowConfidenceFrames(
    repairOctaveFrames(medianFilterMidiFrames(frames)),
  )
  if (cleaned.length === 0) return []

  const secToTicks = (sec: number) => Math.max(1, Math.round((sec * tempoBpm * tpq) / 60))

  type Seg = { midi: number; startSec: number; endSec: number; conf: number; n: number }
  const segs: Seg[] = []
  let cur: Seg | null = null

  for (const f of cleaned) {
    if (!cur) {
      cur = { midi: f.midi, startSec: f.timeSec, endSec: f.timeSec, conf: f.confidence, n: 1 }
      continue
    }
    const gap = f.timeSec - cur.endSec
    const same = f.midi === cur.midi
    if (same && gap <= maxGap) {
      cur.endSec = f.timeSec
      cur.conf += f.confidence
      cur.n++
    } else if (Math.abs(f.midi - cur.midi) === 1 && gap <= maxGap * 0.5 && f.confidence < cur.conf / cur.n) {
      // ignore brief neighbor flicker
      cur.endSec = f.timeSec
    } else {
      segs.push(cur)
      cur = { midi: f.midi, startSec: f.timeSec, endSec: f.timeSec, conf: f.confidence, n: 1 }
    }
  }
  if (cur) segs.push(cur)

  const notes: DetectedNote[] = []
  for (const s of segs) {
    // extend end by ~half hop so short notes survive
    const end = s.endSec + 0.045
    const durSec = Math.max(minDur, end - s.startSec)
    if (durSec < minDur * 0.7) continue
    const avgConf = s.conf / s.n
    if (avgConf < 0.28 && durSec < 0.15) continue
    const vel = Math.max(40, Math.min(110, Math.round(48 + avgConf * 62)))
    notes.push({
      pitch: s.midi,
      start: secToTicks(s.startSec),
      duration: secToTicks(durSec),
      velocity: vel,
      timeSec: s.startSec,
      durationSec: durSec,
      confidence: Math.max(0, Math.min(1, avgConf)),
    })
  }

  let merged = mergeAdjacentNotes(notes, { ticksPerQuarter: tpq })
  merged = dropGhostNotes(merged, { minDurationSec: minDur * 0.85 })

  if (opts?.quantize !== false) {
    merged = quantizeDetectedNotes(merged, {
      tempoBpm,
      ticksPerQuarter: tpq,
      gridDivisions: opts?.gridDivisions ?? 16,
      strength: 0.9,
    })
    merged = mergeAdjacentNotes(merged, { ticksPerQuarter: tpq })
  }
  return merged
}

/**
 * Mix AudioBuffer toward a mono lead track.
 * Stereo default: **mid** (L+R)/2 — center-panned leads/vocals sit here;
 * hard-panned guitars/FX are attenuated vs a plain channel average.
 * Pass `mode: 'average'` for equal-weight multi-channel mix (tests / mono-safe).
 */
export function audioBufferToMono(
  buffer: {
    numberOfChannels: number
    length: number
    getChannelData: (channel: number) => Float32Array
  },
  opts?: { mode?: 'mid' | 'average' | 'side' },
): Float32Array {
  const ch = buffer.numberOfChannels
  const len = buffer.length
  if (ch === 1) return buffer.getChannelData(0).slice()
  const mode = opts?.mode ?? 'mid'

  if (ch >= 2 && (mode === 'mid' || mode === 'side')) {
    const L = buffer.getChannelData(0)
    const R = buffer.getChannelData(1)
    const out = new Float32Array(len)
    if (mode === 'mid') {
      for (let i = 0; i < len; i++) out[i] = 0.5 * (L[i] + R[i])
    } else {
      for (let i = 0; i < len; i++) out[i] = 0.5 * (L[i] - R[i])
    }
    return out
  }

  const out = new Float32Array(len)
  for (let c = 0; c < ch; c++) {
    const data = buffer.getChannelData(c)
    for (let i = 0; i < len; i++) out[i] += data[i]
  }
  const inv = 1 / ch
  for (let i = 0; i < len; i++) out[i] *= inv
  return out
}

/**
 * Guitar / lead register preference for monophonic scoring.
 * MIDI ~50–76 (D3–E5) is the sweet spot; bass thump and airy hiss score lower.
 */
export function guitarRegisterScore(midi: number): number {
  if (!Number.isFinite(midi)) return 0
  if (midi >= 52 && midi <= 76) return 1
  if (midi >= 47 && midi < 52) return 0.75
  if (midi > 76 && midi <= 84) return 0.7
  if (midi >= 40 && midi < 47) return 0.45
  if (midi > 84 && midi <= 88) return 0.35
  return 0.15
}

/**
 * Snap detected BPM toward a musically likely value.
 * Prefers the candidate (raw / ½× / 2×) whose onset grid best matches energy peaks,
 * then lightly rounds to a common practice tempo when very close.
 */
export function snapTempoBpm(
  rawBpm: number,
  samples: Float32Array,
  sampleRate: number,
  opts?: { minBpm?: number; maxBpm?: number },
): number {
  const minBpm = opts?.minBpm ?? 60
  const maxBpm = opts?.maxBpm ?? 180
  if (!Number.isFinite(rawBpm) || rawBpm <= 0) return 100

  const candidates = [rawBpm, rawBpm / 2, rawBpm * 2]
    .map((b) => Math.round(b))
    .filter((b, i, arr) => b >= minBpm && b <= maxBpm && arr.indexOf(b) === i)

  if (candidates.length <= 1) {
    return Math.max(minBpm, Math.min(maxBpm, Math.round(rawBpm)))
  }

  // Cheap onset envelope @ 10ms
  const hop = Math.max(64, Math.floor(sampleRate * 0.01))
  const win = hop * 2
  const onset: number[] = []
  for (let i = hop; i + win < samples.length; i += hop) {
    let e0 = 0
    let e1 = 0
    for (let j = 0; j < hop; j++) {
      const a = samples[i - hop + j]
      const b = samples[i + j]
      e0 += a * a
      e1 += b * b
    }
    const d = e1 - e0
    onset.push(d > 0 ? d : 0)
  }
  if (onset.length < 16) {
    return Math.max(minBpm, Math.min(maxBpm, Math.round(rawBpm)))
  }

  let bestBpm = Math.round(rawBpm)
  let bestScore = -Infinity
  for (const bpm of candidates) {
    const period = (60 / bpm) * (sampleRate / hop) // onset frames per beat
    if (period < 2 || period > onset.length / 2) continue
    let score = 0
    const steps = Math.min(48, Math.floor(onset.length / period))
    for (let k = 1; k <= steps; k++) {
      const idx = Math.round(k * period)
      if (idx >= 0 && idx < onset.length) score += onset[idx]
      // favor downbeats slightly
      const half = Math.round(k * period + period / 2)
      if (half >= 0 && half < onset.length) score += onset[half] * 0.35
    }
    // mild preference for 70–140 (practice range)
    const centerBias = 1 - Math.min(1, Math.abs(bpm - 100) / 120)
    score *= 0.85 + 0.15 * centerBias
    if (score > bestScore) {
      bestScore = score
      bestBpm = bpm
    }
  }

  // Snap to nearby common tempos when within 1.5 BPM
  const common = [60, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 128, 132, 140, 144, 160]
  for (const c of common) {
    if (Math.abs(c - bestBpm) <= 1.5) return c
  }
  return bestBpm
}

/** 3-point median smooth on MIDI stream (kills single-frame pitch flicker). */
export function medianFilterMidiFrames(frames: PitchFrame[]): PitchFrame[] {
  if (frames.length < 3) return frames.map((f) => ({ ...f }))
  const out: PitchFrame[] = frames.map((f) => ({ ...f }))
  for (let i = 1; i < out.length - 1; i++) {
    const a = frames[i - 1].midi
    const b = frames[i].midi
    const c = frames[i + 1].midi
    const mid = a + b + c - Math.min(a, b, c) - Math.max(a, b, c)
    if (mid !== b) {
      out[i] = { ...out[i], midi: mid, hz: midiToHz(mid) }
    }
  }
  return out
}

/**
 * Light harmonic emphasis: envelope-smoothed sustain vs fast residual.
 * O(n) — not a full median HPSS (that was too slow on long mixes).
 */
export function harmonicEmphasis(
  samples: Float32Array,
  sampleRate: number,
  opts?: { smoothMs?: number; mix?: number },
): Float32Array {
  const smoothMs = opts?.smoothMs ?? 45
  const mix = opts?.mix ?? 0.65
  if (samples.length < 16 || sampleRate <= 0) return samples.slice()
  // Fast abs-envelope smooth ≈ sustained/harmonic energy
  const alpha = 1 - Math.exp(-1 / Math.max(1, (smoothMs / 1000) * sampleRate))
  const harm = new Float32Array(samples.length)
  let env = 0
  for (let i = 0; i < samples.length; i++) {
    const x = samples[i]
    const ax = Math.abs(x)
    env += alpha * (ax - env)
    // Soft-gate: keep samples near the slow envelope (lead/sustain), attenuate spikes
    const gate = env > 1e-6 ? Math.min(1, env / (ax + 1e-6)) : 0
    const shaped = x * (0.35 + 0.65 * gate)
    harm[i] = x * (1 - mix) + shaped * mix
  }
  return harm
}

export type StemKind = 'mix' | 'harmonic' | 'percussive' | 'lead' | 'auto'

export interface HpssResult {
  harmonic: Float32Array
  percussive: Float32Array
  /** Lead-oriented blend: harmonic + mild residual for attack. */
  lead: Float32Array
}

/** Quality score for a pitch-frame stream (higher = cleaner monophonic melody). */
export function scorePitchFrames(frames: PitchFrame[]): number {
  if (frames.length < 3) return 0
  let confSum = 0
  let jumps = 0
  let regSum = 0
  for (let i = 0; i < frames.length; i++) {
    confSum += frames[i].confidence
    regSum += guitarRegisterScore(frames[i].midi)
    if (i > 0) {
      const d = Math.abs(frames[i].midi - frames[i - 1].midi)
      // Penalize wild leaps more than stepwise motion
      jumps += d > 7 ? d * 1.5 : d * 0.25
    }
  }
  const avgConf = confSum / frames.length
  const avgReg = regSum / frames.length
  const density = Math.min(1, frames.length / 40)
  // Prefer guitar/lead register over bass thump or airy hiss
  return avgConf * 100 + density * 25 + avgReg * 35 - jumps * 0.35
}

/**
 * Full-band assist: try lead / harmonic / mix stems and keep the cleanest pitch track.
 * Returns the chosen stem PCM + label for warnings/UI.
 */
export function pickBestMelodyStem(
  samples: Float32Array,
  sampleRate: number,
  opts?: {
    candidates?: Array<Exclude<StemKind, 'auto' | 'percussive'>>
    /** Concert A4 for pitch→MIDI during the race (Profile). */
    a4?: number
  },
): { stem: Exclude<StemKind, 'auto'>; pcm: Float32Array; score: number } {
  const candidates = opts?.candidates ?? (['lead', 'harmonic', 'mix'] as const)
  const a4 = Number.isFinite(opts?.a4) && (opts!.a4 as number) > 0 ? (opts!.a4 as number) : 440
  const sep = separateHpss(samples, sampleRate)
  let best: { stem: Exclude<StemKind, 'auto'>; pcm: Float32Array; score: number } = {
    stem: 'lead',
    pcm: sep.lead,
    score: -Infinity,
  }
  for (const kind of candidates) {
    const pcm =
      kind === 'mix' ? samples : kind === 'harmonic' ? sep.harmonic : kind === 'lead' ? sep.lead : sep.percussive
    const prepared = emphasizeMelodyBand(pcm, sampleRate, { leadMode: true })
    // Guitar lead band: slightly raise floor so kick/sub doesn't win the race
    const frames = trackPitchFrames(prepared, sampleRate, {
      minConfidence: 0.34,
      hopSec: 0.042,
      windowSec: 0.09,
      a4,
    })
    const smoothed = medianFilterMidiFrames(frames)
    const repaired = filterLowConfidenceFrames(repairOctaveFrames(smoothed), {
      minConfidence: 0.32,
      minRun: 2,
    })
    const score = scorePitchFrames(repaired)
    if (score > best.score) {
      best = { stem: kind as Exclude<StemKind, 'auto'>, pcm, score }
    }
  }
  return best
}

/**
 * Median-filter HPSS (harmonic–percussive source separation), O(n · win).
 * Softens drums/transients so pitch track locks onto sustained melody.
 * winFrames≈17 @ hop 512 is a good default for full-band mixes.
 */
export function separateHpss(
  samples: Float32Array,
  sampleRate: number,
  opts?: { hop?: number; winFrames?: number; leadMix?: number },
): HpssResult {
  const hop = opts?.hop ?? Math.max(256, Math.floor(sampleRate * 0.012))
  const winFrames = Math.max(5, opts?.winFrames ?? 17) | 1 // odd
  const leadMix = opts?.leadMix ?? 0.82
  const n = samples.length
  if (n < hop * 4 || sampleRate <= 0) {
    const copy = samples.slice()
    return { harmonic: copy, percussive: new Float32Array(n), lead: copy.slice() }
  }

  // Frame RMS magnitudes (cheap spectrogram proxy)
  const nFrames = Math.max(1, Math.floor((n - hop) / hop))
  const mag = new Float32Array(nFrames)
  for (let f = 0; f < nFrames; f++) {
    const start = f * hop
    let e = 0
    const end = Math.min(n, start + hop)
    for (let i = start; i < end; i++) e += samples[i] * samples[i]
    mag[f] = Math.sqrt(e / Math.max(1, end - start))
  }

  // Horizontal median → harmonic mask; residual → percussive
  const half = (winFrames - 1) >> 1
  const harmMag = new Float32Array(nFrames)
  const scratch = new Float32Array(winFrames)
  for (let f = 0; f < nFrames; f++) {
    let k = 0
    for (let d = -half; d <= half; d++) {
      const j = Math.min(nFrames - 1, Math.max(0, f + d))
      scratch[k++] = mag[j]
    }
    // partial sort for median
    for (let a = 0; a <= half; a++) {
      let minI = a
      for (let b = a + 1; b < winFrames; b++) if (scratch[b] < scratch[minI]) minI = b
      const tmp = scratch[a]
      scratch[a] = scratch[minI]
      scratch[minI] = tmp
    }
    harmMag[f] = scratch[half]
  }

  const harmonic = new Float32Array(n)
  const percussive = new Float32Array(n)
  for (let f = 0; f < nFrames; f++) {
    const m = mag[f]
    const hRatio = m > 1e-9 ? Math.min(1, harmMag[f] / m) : 1
    const pRatio = 1 - hRatio
    const start = f * hop
    const end = f === nFrames - 1 ? n : Math.min(n, start + hop)
    for (let i = start; i < end; i++) {
      const x = samples[i]
      harmonic[i] = x * hRatio
      percussive[i] = x * pRatio
    }
  }
  // Tail after last full hop
  const tail = nFrames * hop
  for (let i = tail; i < n; i++) {
    harmonic[i] = samples[i]
    percussive[i] = 0
  }

  const lead = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    // Keep a little percussive for note attacks; mostly harmonic body
    lead[i] = harmonic[i] * leadMix + samples[i] * (1 - leadMix) * 0.35
  }
  // Peak normalize lead so RMS gate still fires
  let peak = 1e-6
  for (let i = 0; i < n; i++) {
    const a = Math.abs(lead[i])
    if (a > peak) peak = a
  }
  if (peak > 1) {
    const inv = 1 / peak
    for (let i = 0; i < n; i++) lead[i] *= inv
  }

  return { harmonic, percussive, lead }
}

/** Pick a stem for pitch tracking (default lead = HPSS harmonic blend). */
export function selectStem(
  samples: Float32Array,
  sampleRate: number,
  stem: StemKind = 'lead',
): Float32Array {
  if (stem === 'mix') return samples
  if (stem === 'auto') return pickBestMelodyStem(samples, sampleRate).pcm
  const sep = separateHpss(samples, sampleRate)
  if (stem === 'harmonic') return sep.harmonic
  if (stem === 'percussive') return sep.percussive
  return sep.lead
}

/**
 * Emphasize mid/high melody band and soften low-end thump (kick/bass)
 * before pitch tracking — light HPSS-style assist, not stem separation.
 */
export function emphasizeMelodyBand(
  samples: Float32Array,
  sampleRate: number,
  opts?: { hpHz?: number; strength?: number; leadMode?: boolean },
): Float32Array {
  const hpHz = opts?.hpHz ?? 180
  const strength = opts?.strength ?? 0.85
  const leadMode = opts?.leadMode !== false
  if (samples.length < 4 || sampleRate <= 0) return samples.slice()

  const source = leadMode ? harmonicEmphasis(samples, sampleRate) : samples

  // One-pole high-pass toward melody band
  const rc = 1 / (2 * Math.PI * hpHz)
  const dt = 1 / sampleRate
  const alpha = rc / (rc + dt)
  const hp = new Float32Array(source.length)
  let prevX = source[0]
  let prevY = 0
  for (let i = 0; i < source.length; i++) {
    const x = source[i]
    const y = alpha * (prevY + x - prevX)
    hp[i] = y
    prevX = x
    prevY = y
  }

  // Soft low-pass ceiling (~3.5kHz) to cut cymbal hiss pulling pitch high
  const lpHz = 3500
  const rcL = 1 / (2 * Math.PI * lpHz)
  const alphaL = dt / (rcL + dt)
  let prevL = hp[0]
  const band = new Float32Array(hp.length)
  for (let i = 0; i < hp.length; i++) {
    prevL = prevL + alphaL * (hp[i] - prevL)
    band[i] = prevL
  }

  // Soft spectral tilt: blend band with original so we don't kill body entirely
  const out = new Float32Array(samples.length)
  let peak = 1e-6
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i] * (1 - strength) + band[i] * strength
    out[i] = v
    const a = Math.abs(v)
    if (a > peak) peak = a
  }
  // Normalize lightly so RMS gate still works
  if (peak > 1) {
    const inv = 1 / peak
    for (let i = 0; i < out.length; i++) out[i] *= inv
  }
  return out
}

/** Trim PCM to first N seconds (0 / undefined = full file). */
export function trimSamples(
  samples: Float32Array,
  sampleRate: number,
  maxSec?: number,
): { samples: Float32Array; trimSec: number } {
  if (!maxSec || maxSec <= 0 || !Number.isFinite(maxSec)) {
    return { samples, trimSec: samples.length / sampleRate }
  }
  const n = Math.min(samples.length, Math.floor(maxSec * sampleRate))
  return { samples: samples.subarray(0, n), trimSec: n / sampleRate }
}

/**
 * Estimate tempo from onset-energy autocorrelation (≈60–180 BPM).
 * Falls back to defaultBpm when the signal is too steady/quiet.
 */
export function detectTempoBpm(
  samples: Float32Array,
  sampleRate: number,
  opts?: { defaultBpm?: number; minBpm?: number; maxBpm?: number },
): number {
  const defaultBpm = opts?.defaultBpm ?? 100
  const minBpm = opts?.minBpm ?? 60
  const maxBpm = opts?.maxBpm ?? 180
  if (samples.length < sampleRate * 0.5) return defaultBpm

  const hop = Math.max(64, Math.floor(sampleRate * 0.01)) // 10ms
  const win = hop * 2
  const env: number[] = []
  for (let i = 0; i + win < samples.length; i += hop) {
    let e = 0
    for (let j = 0; j < win; j++) {
      const v = samples[i + j]
      e += v * v
    }
    env.push(e / win)
  }
  if (env.length < 32) return defaultBpm

  // Onset strength = half-wave rectified flux
  const onset = new Float32Array(env.length)
  for (let i = 1; i < env.length; i++) {
    const d = env[i] - env[i - 1]
    onset[i] = d > 0 ? d : 0
  }

  let mean = 0
  for (let i = 0; i < onset.length; i++) mean += onset[i]
  mean /= onset.length
  if (mean < 1e-10) return defaultBpm

  const minLag = Math.floor((60 / maxBpm) * (sampleRate / hop))
  const maxLag = Math.min(onset.length - 2, Math.floor((60 / minBpm) * (sampleRate / hop)))
  if (maxLag <= minLag) return defaultBpm

  let bestLag = minLag
  let bestCorr = -Infinity
  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0
    const lim = onset.length - lag
    for (let i = 0; i < lim; i++) corr += onset[i] * onset[i + lag]
    if (corr > bestCorr) {
      bestCorr = corr
      bestLag = lag
    }
  }

  const bpm = (60 * sampleRate) / (bestLag * hop)
  if (!Number.isFinite(bpm) || bpm < minBpm || bpm > maxBpm) return defaultBpm
  // Snap to nearest integer BPM
  return Math.round(bpm)
}

const DEFAULT_NOTE_CAP = 2400

/** Core: mono PCM → MIDI bytes + parsed result. */
export function pcmToMidi(
  samples: Float32Array,
  sampleRate: number,
  opts?: {
    tempoBpm?: number
    title?: string
    /** Concert A4 in Hz (Profile). Default 440. */
    a4?: number
    /** Skip melody-band emphasis (tests / already-filtered PCM) */
    skipMelodyBand?: boolean
    /** Skip median HPSS stem split (tests / already separated). */
    skipHpss?: boolean
    /** Which stem to pitch-track after HPSS (default lead). */
    stem?: StemKind
    noteCap?: number
    /** Analyze only the first N seconds (0 = full). */
    maxSec?: number
    onProgress?: (pct: number, message: string) => void
  },
): AudioToMidiResult {
  const a4 = Number.isFinite(opts?.a4) && (opts!.a4 as number) > 0 ? (opts!.a4 as number) : 440
  const warnings: string[] = [
    'Audio→MIDI is monophonic pitch-track assist — not multi-voice transcription.',
    'Full-band path: stereo mid → HPSS stem race → melody band → guitar-register score → tempo snap → quantize.',
    'Edit or Clean up the candidate tab before practicing or saving.',
  ]
  const onProgress = opts?.onProgress

  const fullDuration = samples.length / sampleRate
  const trimmed = trimSamples(samples, sampleRate, opts?.maxSec)
  const work = trimmed.samples
  const durationSec = fullDuration
  const analyzedSec = trimmed.trimSec
  if (opts?.maxSec && opts.maxSec > 0 && analyzedSec + 0.05 < fullDuration) {
    warnings.push(`Analyzed first ${analyzedSec.toFixed(0)}s of ${fullDuration.toFixed(0)}s (trim).`)
  }
  onProgress?.(6, 'Separating lead stem (HPSS)…')

  const stemKind: StemKind = opts?.stem ?? 'auto'
  let stemPcm = work
  let chosenStemLabel = stemKind

  if (!opts?.skipHpss && stemKind === 'auto') {
    onProgress?.(10, 'Comparing lead / harmonic / mix stems…')
    // Compete stems on a short window so full-band mixes stay interactive
    const probe = trimSamples(work, sampleRate, Math.min(12, analyzedSec || 12)).samples
    const best = pickBestMelodyStem(probe, sampleRate, { a4 })
    chosenStemLabel = best.stem
    stemPcm = selectStem(work, sampleRate, best.stem === 'mix' ? 'mix' : best.stem)
    warnings.push(
      `Full-band auto-stem picked “${best.stem}” (score ${best.score.toFixed(1)}) — HPSS lead vs harmonic vs mix.`,
    )
  } else if (!opts?.skipHpss && stemKind !== 'mix') {
    stemPcm = selectStem(work, sampleRate, stemKind)
    chosenStemLabel = stemKind
    warnings.push(
      `Applied median HPSS → ${stemKind} stem to reduce drums/bass before pitch track.`,
    )
  } else {
    chosenStemLabel = 'mix'
  }

  onProgress?.(18, 'Preparing melody band…')

  const prepared = opts?.skipMelodyBand
    ? stemPcm
    : emphasizeMelodyBand(stemPcm, sampleRate, { leadMode: true })
  if (!opts?.skipMelodyBand) {
    warnings.push(
      `Applied lead emphasis (harmonic envelope + melody-band filter) on “${chosenStemLabel}” stem.`,
    )
  }
  onProgress?.(26, 'Detecting tempo…')

  const rawTempo = detectTempoBpm(prepared, sampleRate, {
    defaultBpm: 100,
  })
  const detectedTempo = snapTempoBpm(rawTempo, prepared, sampleRate)
  if (detectedTempo !== rawTempo) {
    warnings.push(
      `Tempo snap ${rawTempo} → ${detectedTempo} BPM (½×/2× + onset grid check).`,
    )
  }
  const tempoBpm = opts?.tempoBpm ?? detectedTempo
  if (opts?.tempoBpm == null) {
    warnings.push(`Estimated tempo ≈ ${detectedTempo} BPM from onset energy.`)
  } else {
    warnings.push(`Using your tempo override: ${tempoBpm} BPM (detected ≈ ${detectedTempo}).`)
  }
  onProgress?.(40, 'Tracking pitch…')

  // Full-band: slightly stricter confidence; pure mono melodies still pass
  const minConf = stemKind === 'mix' && opts?.skipHpss ? 0.3 : 0.36
  const frames = trackPitchFrames(prepared, sampleRate, {
    minConfidence: minConf,
    hopSec: 0.038,
    windowSec: 0.09,
    a4,
  })
  if (a4 !== 440) {
    warnings.push(`Using Profile A4 = ${a4} Hz for pitch → MIDI.`)
  }
  onProgress?.(70, 'Building notes…')
  let notes = framesToNotes(frames, {
    tempoBpm,
    minDurationSec: 0.1,
    maxGapSec: 0.1,
    quantize: true,
    gridDivisions: 16,
  })
  notes = dropGhostNotes(notes, { minDurationSec: 0.09, minVelocity: 45 })
  notes = mergeAdjacentNotes(notes, { ticksPerQuarter: DEFAULT_TPQ })

  // Prefer fewer stable notes over a spray of ghosts on dense mixes
  if (notes.length > 8) {
    const confSorted = [...notes].sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))
    const floor = confSorted[Math.min(confSorted.length - 1, Math.floor(confSorted.length * 0.65))]
      ?.confidence
    if (typeof floor === 'number' && floor > 0.3) {
      const filtered = notes.filter((n) => (n.confidence ?? 0) >= floor * 0.92)
      if (filtered.length >= Math.max(3, Math.floor(notes.length * 0.35))) {
        notes = filtered.sort((a, b) => a.start - b.start)
        warnings.push('Dropped lower-confidence ghost notes after full-band ranking.')
      }
    }
  }

  // Prefer guitar-register notes when the track is dense (full-band spray)
  if (notes.length > 12) {
    const withReg = notes.map((n) => ({
      n,
      r: guitarRegisterScore(n.pitch) * (0.55 + 0.45 * (n.confidence ?? 0.5)),
    }))
    withReg.sort((a, b) => b.r - a.r)
    const keepN = Math.max(8, Math.ceil(notes.length * 0.72))
    const kept = withReg
      .slice(0, keepN)
      .map((x) => x.n)
      .sort((a, b) => a.start - b.start)
    if (kept.length >= 6 && kept.length < notes.length) {
      notes = kept
      warnings.push('Biased note keep toward guitar/lead register (full-band assist).')
    }
  }

  if (notes.length === 0) {
    warnings.push('No stable pitches found — check that the clip has a clear single-note melody.')
  }

  const noteCap = opts?.noteCap ?? DEFAULT_NOTE_CAP
  if (notes.length > noteCap) {
    notes = notes.slice(0, noteCap)
    warnings.push(`Truncated to first ${noteCap} detected notes for performance.`)
  }
  onProgress?.(90, 'Writing MIDI…')

  // Embed detected/override tempo (+ 4/4 meter) so download + re-import stay truthful.
  // Audio path is monophonic assist — no real compound-meter detection yet.
  const midiBytes = buildSimpleMidi(
    notes.map((n) => ({
      pitch: n.pitch,
      start: n.start,
      duration: Math.max(1, n.duration),
      velocity: n.velocity,
    })),
    { ticksPerQuarter: DEFAULT_TPQ, tempoBpm, timeSig: [4, 4] },
  )
  const midi = parseMidi(midiBytes)
  onProgress?.(100, 'Audio → MIDI done')

  return {
    notes,
    midi,
    midiBytes,
    tempoBpm,
    detectedTempoBpm: detectedTempo,
    durationSec,
    sampleRate,
    warnings,
    analyzedSec,
    trimSec: analyzedSec,
  }
}

function getDecodeContext(): { ctx: AudioContext; close: boolean } {
  const AC =
    typeof globalThis !== 'undefined'
      ? (globalThis as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
          .AudioContext ||
        (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      : undefined
  if (!AC) {
    throw new Error('Web Audio API unavailable — cannot decode MP3 in this environment')
  }
  return { ctx: new AC(), close: true }
}

export type AudioConvertOpts = {
  tempoBpm?: number
  /** Concert A4 in Hz from Profile (default 440). */
  a4?: number
  skipMelodyBand?: boolean
  skipHpss?: boolean
  stem?: StemKind
  /** Analyze only first N seconds (0/omit = full track). */
  maxSec?: number
  onProgress?: (pct: number, message: string) => void
}

/** Decode an audio file (mp3/wav/ogg/m4a) via Web Audio, then convert to MIDI. */
export async function convertAudioFileToMidi(
  file: File | { name: string; arrayBuffer: () => Promise<ArrayBuffer> },
  opts?: AudioConvertOpts,
): Promise<AudioToMidiResult> {
  const buf = await file.arrayBuffer()
  return convertArrayBufferToMidi(buf, opts)
}

export async function convertArrayBufferToMidi(
  arrayBuffer: ArrayBuffer,
  opts?: AudioConvertOpts,
): Promise<AudioToMidiResult> {
  const { ctx, close } = getDecodeContext()
  try {
    opts?.onProgress?.(2, 'Decoding audio…')
    const copy = arrayBuffer.slice(0)
    const audio = await ctx.decodeAudioData(copy)
    const mono = audioBufferToMono(audio)
    return pcmToMidi(mono, audio.sampleRate, {
      tempoBpm: opts?.tempoBpm,
      a4: opts?.a4,
      skipMelodyBand: opts?.skipMelodyBand,
      skipHpss: opts?.skipHpss,
      stem: opts?.stem,
      maxSec: opts?.maxSec,
      onProgress: opts?.onProgress,
    })
  } finally {
    if (close && typeof ctx.close === 'function') {
      void ctx.close()
    }
  }
}

/** Convenience: detected notes as MidiNote[] for fretting pipelines. */
export function detectedToMidiNotes(notes: DetectedNote[], tpq = DEFAULT_TPQ): MidiNote[] {
  return notes.map((n, i) => ({
    pitch: n.pitch,
    startTick: n.start,
    durationTicks: n.duration,
    velocity: n.velocity,
    channel: 0,
    track: 0,
    // retain order index for stable sorts
    ...(i >= 0 ? {} : {}),
  }))
}

/** Trigger browser download of converted MIDI. */
export function downloadMidiBytes(bytes: ArrayBuffer, filename = 'converted.mid') {
  if (typeof document === 'undefined') return
  const blob = new Blob([bytes], { type: 'audio/midi' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.mid') ? filename : `${filename}.mid`
  a.click()
  URL.revokeObjectURL(url)
}

/** Synthetic mono tone for tests (no Web Audio needed). */
export function synthesizeTonePcm(
  freqs: Array<{ hz: number; startSec: number; durationSec: number }>,
  sampleRate = 22050,
  totalSec?: number,
): Float32Array {
  const end =
    totalSec ??
    Math.max(0.5, ...freqs.map((f) => f.startSec + f.durationSec)) + 0.05
  const n = Math.floor(end * sampleRate)
  const out = new Float32Array(n)
  for (const note of freqs) {
    const i0 = Math.floor(note.startSec * sampleRate)
    const i1 = Math.min(n, Math.floor((note.startSec + note.durationSec) * sampleRate))
    for (let i = i0; i < i1; i++) {
      const t = (i - i0) / sampleRate
      // simple envelope
      const env = Math.min(1, t * 30) * Math.min(1, (note.durationSec - t) * 20)
      out[i] += 0.35 * env * Math.sin(2 * Math.PI * note.hz * (i / sampleRate))
    }
  }
  return out
}
