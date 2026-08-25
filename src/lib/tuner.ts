/**
 * Chromatic guitar tuner — fast + accurate pitch + live mic analysis.
 * YIN + MPM cross-check · downsample · adaptive window · string clamp ·
 * steel inharmonicity · noise-floor calibrate · phase/strobe.
 */

import { hzToMidi, midiToHz } from './audioToMidi'
import { NOTE_NAMES } from './theory'

export interface TunerReading {
  /** Detected frequency, or 0 if silent/unreliable */
  hz: number
  confidence: number
  /** Nearest MIDI note */
  midi: number
  /** Note name without octave, e.g. "A" */
  noteName: string
  /** Scientific octave */
  octave: number
  /** Cents sharp (+) / flat (−) vs equal temperament at a4 */
  cents: number
  /** Target frequency for nearest note */
  targetHz: number
  /** In tune if |cents| <= threshold */
  inTune: boolean
  /** Standard string index 0=low E … 5=high e, or null if not near open string */
  stringIndex: number | null
  /** Signal level 0..1 (for UI meters) */
  level?: number
  /** How locked the note is 0..1 (stability) */
  lock?: number
  /** Phase error −0.5..0.5 for strobe (fraction of cycle vs target) */
  phase?: number
  /** Spectral clarity / flux gate pass 0..1 */
  clarity?: number
}

export type TunerLiveOptions = {
  a4?: number
  inTuneCents?: number
  /** Clamp pitch search to this open string (± band) */
  focusString?: number | null
  /** RMS gate override (after noise calibrate) */
  rmsGate?: number
  /** Apply slight steel-string inharmonicity bias */
  guitarTemperament?: boolean
  /** Theory-order open MIDI (0=low E). Defaults to standard EADGBE. */
  tuning?: number[] | null
}

/** Standard tuning open-string MIDI (E2 A2 D3 G3 B3 E4) — theory low-E = 0. */
export const GUITAR_OPEN_MIDI = [40, 45, 50, 55, 59, 64] as const
/** Default labels for standard; use openStringLabels(tuning) when Profile tuning differs. */
export const GUITAR_STRING_LABELS = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] as const

export const DEFAULT_CENTS_IN_TUNE = 5
export const DEFAULT_RMS_GATE = 0.008
/** Target analysis rate after downsample (guitar fundamentals). */
export const TUNER_ANALYSIS_SR = 16000
export const TUNER_FFT_HUNT = 8192
export const TUNER_FFT_LOCKED = 4096

export function noteNameFromMidi(midi: number): { name: string; octave: number } {
  const m = Math.round(midi)
  const pc = ((m % 12) + 12) % 12
  const octave = Math.floor(m / 12) - 1
  return { name: NOTE_NAMES[pc], octave }
}

/** Open-string MIDI in theory order (0 = low E … 5 = high e). Falls back to standard. */
export function openStringMidis(tuning?: number[] | null): number[] {
  if (Array.isArray(tuning) && tuning.length === 6) {
    return tuning.map((n) => Math.max(0, Math.min(127, Math.round(Number(n) || 0))))
  }
  return [...GUITAR_OPEN_MIDI]
}

/** Short labels like E2 / A2 for the given theory-order tuning. */
export function openStringLabels(tuning?: number[] | null): string[] {
  return openStringMidis(tuning).map((m) => {
    const { name, octave } = noteNameFromMidi(m)
    return `${name}${octave}`
  })
}

/** Cents deviation of hz from nearest equal-tempered pitch at a4. */
export function centsOffPitch(hz: number, a4 = 440): { midi: number; cents: number; targetHz: number } {
  if (!Number.isFinite(hz) || hz <= 0) {
    return { midi: -1, cents: 0, targetHz: 0 }
  }
  const raw = 69 + 12 * Math.log2(hz / a4)
  const midi = Math.round(raw)
  const targetHz = midiToHz(midi, a4)
  const cents = Math.round(1200 * Math.log2(hz / targetHz) * 10) / 10
  return { midi, cents, targetHz }
}

export function nearestGuitarString(
  midi: number,
  maxSemitones = 2,
  tuning?: number[] | null,
): number | null {
  const opens = openStringMidis(tuning)
  let best: number | null = null
  let bestDist = Infinity
  for (let i = 0; i < opens.length; i++) {
    const d = Math.abs(opens[i] - midi)
    if (d < bestDist) {
      bestDist = d
      best = i
    }
  }
  if (best == null || bestDist > maxSemitones) return null
  return best
}

/** RMS level 0..1 (soft-clipped). */
export function frameRms(frame: Float32Array): number {
  if (!frame.length) return 0
  let s = 0
  for (let i = 0; i < frame.length; i++) s += frame[i] * frame[i]
  return Math.min(1, Math.sqrt(s / frame.length) * 4)
}

/**
 * Cheap spectral flux proxy: mean |Δsample| — high on attacks/noise, low on steady tones.
 * Returns 0..1-ish; steady guitar notes sit lower than broadband noise.
 */
export function spectralFlux(frame: Float32Array): number {
  if (frame.length < 4) return 0
  let s = 0
  for (let i = 1; i < frame.length; i++) {
    s += Math.abs(frame[i] - frame[i - 1])
  }
  return Math.min(1, (s / frame.length) * 8)
}

/**
 * Gate: skip full pitch when too quiet or too noisy (high flux + low RMS structure).
 * Returns true if frame is worth running YIN/MPM.
 */
export function shouldAnalyzeFrame(
  frame: Float32Array,
  rmsGate = DEFAULT_RMS_GATE,
): { ok: boolean; level: number; flux: number } {
  const level = frameRms(frame)
  const flux = spectralFlux(frame)
  // Quiet
  if (level < rmsGate * 4) return { ok: false, level, flux }
  // Loud broadband noise: high flux relative to level
  if (flux > 0.55 && level < 0.15) return { ok: false, level, flux }
  return { ok: true, level, flux }
}

/**
 * Parabolic vertex offset for samples y0,y1,y2 at indices i-1,i,i+1.
 * Works for peaks or troughs (YIN CMND minima).
 * δ = ½ (y0 − y2) / (y0 − 2 y1 + y2)
 */
export function parabolicOffset(y0: number, y1: number, y2: number): number {
  const denom = y0 - 2 * y1 + y2
  if (Math.abs(denom) < 1e-12) return 0
  const delta = (0.5 * (y0 - y2)) / denom
  return Math.abs(delta) < 1.5 ? delta : 0
}

/**
 * Downsample mono PCM with simple box average (anti-alias lite).
 * Speeds YIN τ loops; guitar fundamentals live well under 2 kHz.
 */
export function downsampleFrame(
  frame: Float32Array,
  sampleRate: number,
  targetRate = TUNER_ANALYSIS_SR,
): { frame: Float32Array; sampleRate: number } {
  if (sampleRate <= targetRate * 1.05 || frame.length < 64) {
    return { frame, sampleRate }
  }
  const ratio = sampleRate / targetRate
  const outLen = Math.floor(frame.length / ratio)
  if (outLen < 32) return { frame, sampleRate }
  const out = new Float32Array(outLen)
  for (let i = 0; i < outLen; i++) {
    const start = Math.floor(i * ratio)
    const end = Math.min(frame.length, Math.floor((i + 1) * ratio))
    let s = 0
    let n = 0
    for (let j = start; j < end; j++) {
      s += frame[j]
      n++
    }
    out[i] = n ? s / n : 0
  }
  return { frame: out, sampleRate: targetRate }
}

/**
 * YIN pitch detection (de Cheveigné & Kawahara) with CMNDF + absolute threshold.
 */
export function detectPitchYin(
  frame: Float32Array,
  sampleRate: number,
  opts?: { minHz?: number; maxHz?: number; threshold?: number; rmsGate?: number },
): { hz: number; confidence: number } {
  const minHz = opts?.minHz ?? 70
  const maxHz = opts?.maxHz ?? 1200
  const threshold = opts?.threshold ?? 0.12
  const rmsGate = opts?.rmsGate ?? DEFAULT_RMS_GATE
  const n = frame.length
  if (n < 64 || sampleRate <= 0) return { hz: 0, confidence: 0 }

  let rms = 0
  for (let i = 0; i < n; i++) rms += frame[i] * frame[i]
  rms = Math.sqrt(rms / n)
  if (rms < rmsGate) return { hz: 0, confidence: 0 }

  const tauMin = Math.max(2, Math.floor(sampleRate / maxHz))
  const tauMax = Math.min(Math.floor(n / 2) - 2, Math.floor(sampleRate / minHz))
  if (tauMax <= tauMin + 2) return { hz: 0, confidence: 0 }

  const d = new Float32Array(tauMax + 1)
  for (let tau = 1; tau <= tauMax; tau++) {
    let sum = 0
    const lim = n - tau
    for (let i = 0; i < lim; i++) {
      const delta = frame[i] - frame[i + tau]
      sum += delta * delta
    }
    d[tau] = sum
  }

  const cmnd = new Float32Array(tauMax + 1)
  cmnd[0] = 1
  let running = 0
  for (let tau = 1; tau <= tauMax; tau++) {
    running += d[tau]
    cmnd[tau] = running > 0 ? (d[tau] * tau) / running : 1
  }

  let tauEst = -1
  for (let tau = tauMin; tau <= tauMax; tau++) {
    if (cmnd[tau] < threshold) {
      while (tau + 1 <= tauMax && cmnd[tau + 1] < cmnd[tau]) tau++
      tauEst = tau
      break
    }
  }

  if (tauEst < 0) {
    let best = tauMin
    let bestV = cmnd[tauMin]
    for (let tau = tauMin + 1; tau <= tauMax; tau++) {
      if (cmnd[tau] < bestV) {
        bestV = cmnd[tau]
        best = tau
      }
    }
    if (bestV > 0.45) return { hz: 0, confidence: Math.max(0, 1 - bestV) }
    tauEst = best
  }

  let refined = tauEst
  if (tauEst > tauMin && tauEst < tauMax) {
    refined = tauEst + parabolicOffset(cmnd[tauEst - 1], cmnd[tauEst], cmnd[tauEst + 1])
  }

  let hz = sampleRate / refined
  if (hz < minHz || hz > maxHz) return { hz: 0, confidence: 0 }

  hz = preferFundamental(hz, cmnd, sampleRate, tauMin, tauMax, threshold + 0.05)

  const confAt = cmnd[Math.round(sampleRate / hz)] ?? cmnd[tauEst]
  const confidence = Math.max(0, Math.min(1, 1 - confAt))
  if (confidence < 0.35) return { hz: 0, confidence }

  return { hz, confidence }
}

/** If 2× period looks almost as good, drop an octave (common guitar error). */
function preferFundamental(
  hz: number,
  cmnd: Float32Array,
  sampleRate: number,
  tauMin: number,
  tauMax: number,
  thr: number,
): number {
  const tau = sampleRate / hz
  const tau2 = tau * 2
  if (tau2 > tauMax - 1 || tau2 < tauMin) return hz
  const i = Math.round(tau)
  const j = Math.round(tau2)
  if (j >= cmnd.length || i >= cmnd.length) return hz
  if (cmnd[j] <= cmnd[i] * 1.08 && cmnd[j] < thr + 0.08) {
    return sampleRate / tau2
  }
  const tau3 = tau * 3
  const k = Math.round(tau3)
  if (k < cmnd.length && tau3 <= tauMax && cmnd[k] < cmnd[i] * 0.95 && cmnd[k] < thr) {
    return sampleRate / tau3
  }
  return hz
}

/**
 * McLeod Pitch Method (MPM) — normalized square difference peak pick.
 * Cross-check against YIN to kill octave flips on bright strings.
 */
export function detectPitchMpm(
  frame: Float32Array,
  sampleRate: number,
  opts?: { minHz?: number; maxHz?: number; rmsGate?: number },
): { hz: number; confidence: number } {
  const minHz = opts?.minHz ?? 70
  const maxHz = opts?.maxHz ?? 1200
  const rmsGate = opts?.rmsGate ?? DEFAULT_RMS_GATE
  const n = frame.length
  if (n < 64 || sampleRate <= 0) return { hz: 0, confidence: 0 }

  let rms = 0
  for (let i = 0; i < n; i++) rms += frame[i] * frame[i]
  rms = Math.sqrt(rms / n)
  if (rms < rmsGate) return { hz: 0, confidence: 0 }

  const tauMin = Math.max(2, Math.floor(sampleRate / maxHz))
  const tauMax = Math.min(Math.floor(n / 2) - 2, Math.floor(sampleRate / minHz))
  if (tauMax <= tauMin + 2) return { hz: 0, confidence: 0 }

  // NSDF
  const nsdf = new Float32Array(tauMax + 1)
  for (let tau = 0; tau <= tauMax; tau++) {
    let ac = 0
    let m = 0
    const lim = n - tau
    for (let i = 0; i < lim; i++) {
      const a = frame[i]
      const b = frame[i + tau]
      ac += a * b
      m += a * a + b * b
    }
    nsdf[tau] = m > 0 ? (2 * ac) / m : 0
  }

  // McLeod-style: first strong peak after NSDF crosses below, then rises (fundamental period).
  // Avoid later multiperiod peaks that can outrank the true pitch on short windows.
  const clarityKey = 0.9
  let maxPos = -1
  let maxVal = -1
  let armed = false
  for (let tau = tauMin; tau < tauMax; tau++) {
    if (nsdf[tau] < 0) armed = true
    if (!armed) continue
    if (nsdf[tau] > nsdf[tau - 1] && nsdf[tau] >= nsdf[tau + 1]) {
      // Local peak
      if (nsdf[tau] > maxVal) {
        maxVal = nsdf[tau]
        maxPos = tau
      }
      // First peak past key threshold → take it (fundamental)
      if (nsdf[tau] >= clarityKey * 0.95 && maxPos > 0) {
        maxPos = tau
        maxVal = nsdf[tau]
        break
      }
    }
  }

  // Fallback: global best peak in band if key never hit
  if (maxPos < 0 || maxVal < 0.55) {
    maxPos = tauMin
    maxVal = -1
    for (let tau = tauMin; tau < tauMax; tau++) {
      if (nsdf[tau] > nsdf[tau - 1] && nsdf[tau] >= nsdf[tau + 1] && nsdf[tau] > maxVal) {
        maxVal = nsdf[tau]
        maxPos = tau
      }
    }
  }

  if (maxVal < 0.55 || maxPos < 0) return { hz: 0, confidence: Math.max(0, maxVal) }

  let refined = maxPos
  if (maxPos > tauMin && maxPos < tauMax) {
    refined = maxPos + parabolicOffset(nsdf[maxPos - 1], nsdf[maxPos], nsdf[maxPos + 1])
  }

  let hz = sampleRate / refined
  // Prefer fundamental if 2× period is also a strong peak (octave error)
  const tau2 = refined * 2
  if (tau2 < tauMax - 1) {
    const i2 = Math.round(tau2)
    if (i2 < nsdf.length && nsdf[i2] > maxVal * 0.9 && nsdf[i2] > 0.6) {
      // Actually longer period is stronger-ish — keep shorter (higher hz) only if first peak was clear
    }
  }
  // If we landed on a subharmonic (too low), try half period
  const tauHalf = refined / 2
  if (tauHalf > tauMin + 1) {
    const ih = Math.round(tauHalf)
    if (ih < nsdf.length && nsdf[ih] >= maxVal * 0.92 && nsdf[ih] >= 0.7) {
      hz = sampleRate / (ih + parabolicOffset(
        nsdf[Math.max(1, ih - 1)],
        nsdf[ih],
        nsdf[Math.min(tauMax, ih + 1)],
      ))
      maxVal = nsdf[ih]
    }
  }

  if (hz < minHz || hz > maxHz) return { hz: 0, confidence: 0 }
  return { hz, confidence: Math.min(1, maxVal) }
}

/**
 * Fuse YIN + MPM. Prefer agreement; if octave apart, take lower (fundamental).
 */
export function fusePitchDetectors(
  yin: { hz: number; confidence: number },
  mpm: { hz: number; confidence: number },
): { hz: number; confidence: number } {
  if (yin.hz <= 0 && mpm.hz <= 0) return { hz: 0, confidence: 0 }
  if (yin.hz <= 0) return mpm
  if (mpm.hz <= 0) return yin

  const ratio = yin.hz > mpm.hz ? yin.hz / mpm.hz : mpm.hz / yin.hz
  // Same pitch within ~3%
  if (ratio < 1.03) {
    const wY = yin.confidence
    const wM = mpm.confidence
    const hz = (yin.hz * wY + mpm.hz * wM) / (wY + wM || 1)
    return { hz, confidence: Math.min(1, (yin.confidence + mpm.confidence) / 2 + 0.08) }
  }
  // Octave relationship — prefer lower fundamental
  if (ratio > 1.9 && ratio < 2.15) {
    const low = Math.min(yin.hz, mpm.hz)
    const conf = Math.max(yin.confidence, mpm.confidence) * 0.92
    return { hz: low, confidence: conf }
  }
  // Prefer higher confidence
  return yin.confidence >= mpm.confidence ? yin : mpm
}

/** Hz band for a focused open string (± semitones). */
export function stringHzBand(
  stringIndex: number,
  a4 = 440,
  semitones = 4,
  tuning?: number[] | null,
): { minHz: number; maxHz: number } {
  const opens = openStringMidis(tuning)
  const midi = opens[stringIndex] ?? GUITAR_OPEN_MIDI[stringIndex] ?? 40
  const center = midiToHz(midi, a4)
  const minHz = Math.max(55, center * 2 ** (-semitones / 12))
  const maxHz = Math.min(1400, center * 2 ** (semitones / 12))
  return { minHz, maxHz }
}

/**
 * Slight sharp bias for steel strings (inharmonicity) — cents added to target
 * comparison so the needle reads "in tune" when the string sounds right.
 * Stronger on higher strings / fretted feel; mild open-string defaults.
 */
export function steelInharmonicityCents(midi: number): number {
  // Low wound strings: tiny; plain steels (B, high E): a bit more
  if (midi >= 64) return 1.2 // high E
  if (midi >= 59) return 0.9 // B
  if (midi >= 55) return 0.5 // G
  if (midi >= 50) return 0.25 // D
  return 0.1
}

/**
 * Phase of signal vs targetHz for strobe display (−0.5..0.5 cycle error).
 * Uses zero-crossing / correlation lag against a reference sine.
 */
export function phaseVsTarget(
  frame: Float32Array,
  sampleRate: number,
  targetHz: number,
): number {
  if (!frame.length || sampleRate <= 0 || targetHz <= 0) return 0
  // Correlate against cos/sin at target
  let c = 0
  let s = 0
  const w = (2 * Math.PI * targetHz) / sampleRate
  const n = Math.min(frame.length, Math.floor(sampleRate / targetHz) * 8 || frame.length)
  for (let i = 0; i < n; i++) {
    c += frame[i] * Math.cos(w * i)
    s += frame[i] * Math.sin(w * i)
  }
  const phase = Math.atan2(s, c) / (2 * Math.PI) // −0.5..0.5
  return Math.max(-0.5, Math.min(0.5, phase))
}

/**
 * Estimate noise floor RMS from a quiet buffer (1s room sample).
 * Returns suggested rmsGate for detectPitchYin.
 */
export function estimateNoiseFloorGate(frame: Float32Array): number {
  if (!frame.length) return DEFAULT_RMS_GATE
  // Use lower quartile of short-window RMS as floor
  const win = Math.max(64, Math.floor(frame.length / 32))
  const levels: number[] = []
  for (let i = 0; i + win <= frame.length; i += win) {
    let s = 0
    for (let j = 0; j < win; j++) s += frame[i + j] * frame[i + j]
    levels.push(Math.sqrt(s / win))
  }
  if (!levels.length) return DEFAULT_RMS_GATE
  levels.sort((a, b) => a - b)
  const q = levels[Math.floor(levels.length * 0.25)] ?? levels[0]
  // Gate slightly above floor; clamp to sensible range
  const gate = Math.max(0.002, Math.min(0.04, q * 2.8))
  return gate
}

/**
 * Median of last N finite values (odd window). Used to kill frame spikes.
 */
export function medianFilter(values: number[]): number {
  const v = values.filter((x) => Number.isFinite(x) && x > 0)
  if (!v.length) return 0
  const s = [...v].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

/** Exponential moving average. */
export function smoothCents(prev: number, next: number, alpha = 0.35): number {
  if (!Number.isFinite(next)) return prev
  if (!Number.isFinite(prev)) return next
  return prev * (1 - alpha) + next * alpha
}

/** Adaptive smooth: snappier when far from target, stickier near zero. */
export function smoothCentsAdaptive(prev: number, next: number, locked = false): number {
  const err = Math.abs(next - prev)
  // When locked, track bends faster (shorter effective window)
  if (locked) {
    const alpha = err > 10 ? 0.62 : err > 3 ? 0.42 : 0.28
    return smoothCents(prev, next, alpha)
  }
  const alpha = err > 15 ? 0.55 : err > 5 ? 0.38 : 0.22
  return smoothCents(prev, next, alpha)
}

export function readingFromHz(
  hz: number,
  confidence: number,
  a4 = 440,
  inTuneCents = DEFAULT_CENTS_IN_TUNE,
  extra?: {
    level?: number
    lock?: number
    phase?: number
    clarity?: number
    guitarTemperament?: boolean
    /** Theory-order opens for string tagging */
    tuning?: number[] | null
  },
): TunerReading {
  if (!Number.isFinite(hz) || hz < 60 || confidence < 0.28) {
    return {
      hz: 0,
      confidence,
      midi: -1,
      noteName: '—',
      octave: 0,
      cents: 0,
      targetHz: 0,
      inTune: false,
      stringIndex: null,
      level: extra?.level ?? 0,
      lock: 0,
      phase: 0,
      clarity: extra?.clarity ?? 0,
    }
  }
  let { midi, cents, targetHz } = centsOffPitch(hz, a4)
  if (extra?.guitarTemperament) {
    // Shift cents so slight physical sharpness reads closer to 0
    cents = Math.round((cents - steelInharmonicityCents(midi)) * 10) / 10
  }
  const { name, octave } = noteNameFromMidi(midi)
  return {
    hz,
    confidence,
    midi,
    noteName: name,
    octave,
    cents,
    targetHz,
    inTune: Math.abs(cents) <= inTuneCents,
    stringIndex: nearestGuitarString(midi, 2, extra?.tuning),
    level: extra?.level,
    lock: extra?.lock ?? 0,
    phase: extra?.phase ?? 0,
    clarity: extra?.clarity ?? confidence,
  }
}

/**
 * Full frame analysis: gate → downsample → YIN+MPM fuse → reading.
 */
export function analyzeTunerFrame(
  frame: Float32Array,
  sampleRate: number,
  a4 = 440,
  inTuneCents = DEFAULT_CENTS_IN_TUNE,
  opts?: {
    rmsGate?: number
    focusString?: number | null
    guitarTemperament?: boolean
    locked?: boolean
    tuning?: number[] | null
  },
): TunerReading {
  const rmsGate = opts?.rmsGate ?? DEFAULT_RMS_GATE
  const tuning = opts?.tuning
  const gate = shouldAnalyzeFrame(frame, rmsGate)
  if (!gate.ok) {
    return readingFromHz(0, 0, a4, inTuneCents, {
      level: gate.level,
      clarity: Math.max(0, 1 - gate.flux),
      tuning,
    })
  }

  const { frame: ds, sampleRate: sr } = downsampleFrame(frame, sampleRate)
  let minHz = 70
  let maxHz = 1200
  if (opts?.focusString != null && opts.focusString >= 0 && opts.focusString < 6) {
    const band = stringHzBand(opts.focusString, a4, 5, tuning)
    minHz = band.minHz
    maxHz = band.maxHz
  }

  const yin = detectPitchYin(ds, sr, { minHz, maxHz, threshold: 0.11, rmsGate })
  const mpm = detectPitchMpm(ds, sr, { minHz, maxHz, rmsGate })
  const fused = fusePitchDetectors(yin, mpm)

  const phase =
    fused.hz > 0
      ? phaseVsTarget(ds, sr, fused.hz)
      : 0

  return readingFromHz(fused.hz, fused.confidence, a4, inTuneCents, {
    level: gate.level,
    clarity: Math.max(0, Math.min(1, fused.confidence * (1 - gate.flux * 0.35))),
    phase,
    guitarTemperament: opts?.guitarTemperament,
    tuning,
  })
}

/** Ring buffer helper for cents history sparkline. */
export function pushHistory(hist: number[], value: number, max = 64): number[] {
  const next = hist.length >= max ? hist.slice(hist.length - max + 1) : hist.slice()
  next.push(value)
  return next
}

export type TunerStop = () => void

/** Constraints tuned for guitar pitch (no AEC/NS/AGC smearing). */
export const TUNER_MIC_AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: false,
  channelCount: 1,
}

/**
 * Map getUserMedia / DOMException failures into short player-facing copy.
 * Android: Capacitor WebView needs RECORD_AUDIO + MODIFY_AUDIO_SETTINGS in the
 * manifest, and BridgeWebChromeClient must grant AUDIO_CAPTURE after the OS prompt.
 * OS "Microphone: Allowed" alone is not enough if the WebView grant path fails.
 */
export function formatMicPermissionError(err: unknown): string {
  const name =
    err && typeof err === 'object' && 'name' in err
      ? String((err as { name?: string }).name)
      : ''
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : ''

  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'Microphone blocked for the tuner. On Android: App info → Permissions → Microphone → Allow, force-stop the app, reopen, then tap Listen again. If it is already Allowed, reinstall the latest APK (WebView mic bridge).'
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'No microphone found. Plug one in or check device settings, then try again.'
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'Microphone is busy or blocked by another app. Close other apps using the mic, then try again.'
  }
  if (name === 'SecurityError') {
    return 'Microphone blocked in this context. Use the installed app or HTTPS, allow mic access, then try again.'
  }
  if (name === 'OverconstrainedError') {
    return 'Could not open the microphone with tuner settings. Check mic permissions and try again.'
  }
  if (/permission|not allowed|denied|secure/i.test(msg)) {
    return 'Microphone permission needed. Allow mic access for GuitarRemedy (Android: App info → Permissions → Microphone), force-stop and reopen, then tap Listen again.'
  }
  if (msg.trim()) return msg
  return 'Could not open the microphone. Allow mic access, then tap Listen again.'
}

function isConstraintFailure(err: unknown): boolean {
  const name =
    err && typeof err === 'object' && 'name' in err
      ? String((err as { name?: string }).name)
      : ''
  return name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError'
}

/**
 * Request mic access for the tuner (triggers the OS / browser permission prompt).
 * Call from a user gesture (Listen button).
 * Tries guitar-friendly constraints first, then plain audio (some Android WebViews
 * reject ideal/advanced constraint bags even when permission is granted).
 */
export async function requestTunerMicrophone(): Promise<MediaStream> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error(
      'Microphone not available here. Use the Android app, desktop app, or a browser that supports mic access.',
    )
  }
  const gum = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
  try {
    return await gum({ audio: TUNER_MIC_AUDIO_CONSTRAINTS })
  } catch (first) {
    // Retry plain audio only when constraints were the problem — not on real denies.
    if (isConstraintFailure(first)) {
      try {
        return await gum({ audio: true })
      } catch (second) {
        throw new Error(formatMicPermissionError(second))
      }
    }
    throw new Error(formatMicPermissionError(first))
  }
}


/** Inline AudioWorklet processor source (no separate file — blob URL). */
export const TUNER_WORKLET_CODE = `
class GuitarRemedyTunerProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this._buf = new Float32Array(8192)
    this._pos = 0
    this._fft = 8192
    this.port.onmessage = (e) => {
      if (e.data && e.data.fftSize) {
        const n = e.data.fftSize | 0
        if (n === 2048 || n === 4096 || n === 8192) {
          this._fft = n
          this._buf = new Float32Array(n)
          this._pos = 0
        }
      }
    }
  }
  process(inputs) {
    const input = inputs[0] && inputs[0][0]
    if (!input) return true
    for (let i = 0; i < input.length; i++) {
      this._buf[this._pos++] = input[i]
      if (this._pos >= this._fft) {
        this.port.postMessage(this._buf.slice(0))
        this._pos = 0
      }
    }
    return true
  }
}
registerProcessor('guitarremedy-tuner', GuitarRemedyTunerProcessor)
`

/**
 * Start live mic tuner. Returns stop(). Requires secure context + permission.
 * Prefers AudioWorklet; falls back to AnalyserNode + rAF.
 */
export async function startLiveTuner(
  onReading: (r: TunerReading) => void,
  opts?: TunerLiveOptions,
): Promise<TunerStop> {
  const a4 = opts?.a4 ?? 440
  const inTuneCents = opts?.inTuneCents ?? DEFAULT_CENTS_IN_TUNE
  let rmsGate = opts?.rmsGate ?? DEFAULT_RMS_GATE
  let focusString = opts?.focusString ?? null
  const guitarTemperament = opts?.guitarTemperament !== false
  const tuning = openStringMidis(opts?.tuning)

  // User-gesture entry (Listen) → OS/browser mic prompt (Android needs RECORD_AUDIO).
  const stream = await requestTunerMicrophone()


  const ctx = new AudioContext()
  try {
    await ctx.resume()
  } catch {
    /* ignore */
  }

  const source = ctx.createMediaStreamSource(stream)

  let smoothC = 0
  let hasSmooth = false
  const hzWindow: number[] = []
  let lockedMidi = -1
  let lockCount = 0
  let silenceFrames = 0
  let stopped = false
  let useLockedFft = false

  const handleFrame = (buf: Float32Array, sampleRate: number) => {
    if (stopped) return

    const gate = shouldAnalyzeFrame(buf, rmsGate)
    const level = gate.level

    if (!gate.ok) {
      silenceFrames++
      if (silenceFrames > 14) {
        hzWindow.length = 0
        hasSmooth = false
        lockCount = Math.max(0, lockCount - 2)
        if (lockCount === 0) lockedMidi = -1
        onReading(
          readingFromHz(0, 0, a4, inTuneCents, {
            level,
            lock: Math.min(1, lockCount / 12),
            clarity: Math.max(0, 1 - gate.flux),
            tuning,
          }),
        )
      } else if (hasSmooth && lockedMidi >= 0) {
        const { name, octave } = noteNameFromMidi(lockedMidi)
        onReading({
          hz: 0,
          confidence: Math.max(0.15, 0.5 - silenceFrames * 0.02),
          midi: lockedMidi,
          noteName: name,
          octave,
          cents: Math.round(smoothC * 10) / 10,
          targetHz: midiToHz(lockedMidi, a4),
          inTune: Math.abs(smoothC) <= inTuneCents,
          stringIndex: nearestGuitarString(lockedMidi, 2, tuning),
          level,
          lock: Math.min(1, lockCount / 12) * 0.6,
          phase: 0,
          clarity: Math.max(0, 1 - gate.flux),
        })
      } else {
        onReading(
          readingFromHz(0, 0, a4, inTuneCents, {
            level,
            clarity: Math.max(0, 1 - gate.flux),
            tuning,
          }),
        )
      }
      return
    }

    const { frame: ds, sampleRate: sr } = downsampleFrame(buf, sampleRate)
    let minHz = 70
    let maxHz = 1200
    if (focusString != null && focusString >= 0 && focusString < 6) {
      const band = stringHzBand(focusString, a4, 5, tuning)
      minHz = band.minHz
      maxHz = band.maxHz
    }

    const yin = detectPitchYin(ds, sr, { minHz, maxHz, threshold: 0.11, rmsGate })
    const mpm = detectPitchMpm(ds, sr, { minHz, maxHz, rmsGate })
    const raw = fusePitchDetectors(yin, mpm)

    if (raw.hz > 0 && raw.confidence >= 0.35) {
      silenceFrames = 0
      const locked = lockCount >= 6
      // Longer median while hunting; short while locked (track bends)
      const maxWin = locked ? 3 : 7
      hzWindow.push(raw.hz)
      while (hzWindow.length > maxWin) hzWindow.shift()
      const hzMed = medianFilter(hzWindow)
      const base = readingFromHz(hzMed, raw.confidence, a4, inTuneCents, {
        level,
        guitarTemperament,
        clarity: Math.max(0, Math.min(1, raw.confidence * (1 - gate.flux * 0.35))),
        tuning,
      })

      if (base.midi === lockedMidi) {
        lockCount = Math.min(24, lockCount + 1)
      } else if (lockCount < 3) {
        lockedMidi = base.midi
        lockCount = 1
      } else if (Math.abs(base.midi - lockedMidi) >= 1 && raw.confidence > 0.55) {
        lockedMidi = base.midi
        lockCount = 4
      }

      const displayMidi = lockedMidi >= 0 ? lockedMidi : base.midi
      let targetHz = midiToHz(displayMidi, a4)
      if (guitarTemperament) {
        // Target slightly sharp so physical steel reads centered
        targetHz *= 2 ** (steelInharmonicityCents(displayMidi) / 1200)
      }
      const centsRaw =
        hzMed > 0 && targetHz > 0 ? 1200 * Math.log2(hzMed / targetHz) : base.cents
      const nowLocked = lockCount >= 6
      const c = hasSmooth ? smoothCentsAdaptive(smoothC, centsRaw, nowLocked) : centsRaw
      smoothC = c
      hasSmooth = true
      const { name, octave } = noteNameFromMidi(displayMidi)
      const lock = Math.min(1, lockCount / 12)
      const phase = phaseVsTarget(ds, sr, targetHz)

      useLockedFft = nowLocked

      onReading({
        hz: Math.round(hzMed * 10) / 10,
        confidence: raw.confidence,
        midi: displayMidi,
        noteName: name,
        octave,
        cents: Math.round(c * 10) / 10,
        targetHz: midiToHz(displayMidi, a4),
        inTune: Math.abs(c) <= inTuneCents,
        stringIndex: nearestGuitarString(displayMidi, 2, tuning),
        level,
        lock,
        phase,
        clarity: base.clarity,
      })
    } else {
      silenceFrames++
      if (silenceFrames > 18) {
        hzWindow.length = 0
        hasSmooth = false
        lockCount = Math.max(0, lockCount - 2)
        if (lockCount === 0) lockedMidi = -1
        useLockedFft = false
        onReading(
          readingFromHz(0, raw.confidence, a4, inTuneCents, {
            level,
            lock: Math.min(1, lockCount / 12),
            clarity: Math.max(0, 1 - gate.flux),
            tuning,
          }),
        )
      } else if (hasSmooth && lockedMidi >= 0) {
        const { name, octave } = noteNameFromMidi(lockedMidi)
        onReading({
          hz: 0,
          confidence: Math.max(0.15, 0.5 - silenceFrames * 0.02),
          midi: lockedMidi,
          noteName: name,
          octave,
          cents: Math.round(smoothC * 10) / 10,
          targetHz: midiToHz(lockedMidi, a4),
          inTune: Math.abs(smoothC) <= inTuneCents,
          stringIndex: nearestGuitarString(lockedMidi, 2, tuning),
          level,
          lock: Math.min(1, lockCount / 12) * 0.6,
          phase: 0,
          clarity: Math.max(0, 1 - gate.flux),
        })
      } else {
        onReading(
          readingFromHz(0, raw.confidence, a4, inTuneCents, {
            level,
            clarity: Math.max(0, 1 - gate.flux),
            tuning,
          }),
        )
      }
    }
  }

  // Mutable controls for UI (calibrate / focus string)
  const controls = {
    setRmsGate(g: number) {
      rmsGate = Math.max(0.001, Math.min(0.08, g))
    },
    getRmsGate() {
      return rmsGate
    },
    setFocusString(i: number | null) {
      focusString = i
    },
    getFocusString() {
      return focusString
    },
    async calibrateNoiseFloor(seconds = 1): Promise<number> {
      const n = Math.max(1, Math.floor(seconds * ctx.sampleRate))
      const buf = await collectSamples(ctx, source, n)
      const gate = estimateNoiseFloorGate(buf)
      rmsGate = gate
      return gate
    },
  }

  let cleanupExtra: (() => void) | null = null
  let raf = 0
  let workletNode: AudioWorkletNode | null = null
  let analyser: AnalyserNode | null = null

  // Try AudioWorklet first
  let usedWorklet = false
  try {
    const blob = new Blob([TUNER_WORKLET_CODE], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    await ctx.audioWorklet.addModule(url)
    URL.revokeObjectURL(url)
    workletNode = new AudioWorkletNode(ctx, 'guitarremedy-tuner')
    source.connect(workletNode)
    // Keep graph alive
    const mute = ctx.createGain()
    mute.gain.value = 0
    workletNode.connect(mute)
    mute.connect(ctx.destination)

    workletNode.port.onmessage = (ev: MessageEvent<Float32Array>) => {
      if (stopped) return
      const data = ev.data
      if (data && data.length) handleFrame(data, ctx.sampleRate)
      // Adaptive window size message
      const want = useLockedFft ? TUNER_FFT_LOCKED : TUNER_FFT_HUNT
      workletNode?.port.postMessage({ fftSize: want })
    }
    usedWorklet = true
    cleanupExtra = () => {
      try {
        workletNode?.disconnect()
        mute.disconnect()
      } catch {
        /* ignore */
      }
    }
  } catch {
    usedWorklet = false
  }

  if (!usedWorklet) {
    analyser = ctx.createAnalyser()
    analyser.fftSize = TUNER_FFT_HUNT
    analyser.smoothingTimeConstant = 0
    source.connect(analyser)
    const buf = new Float32Array(TUNER_FFT_HUNT)

    const tick = () => {
      if (stopped) return
      const fft = useLockedFft ? TUNER_FFT_LOCKED : TUNER_FFT_HUNT
      if (analyser && analyser.fftSize !== fft) {
        analyser.fftSize = fft
      }
      const size = analyser?.fftSize ?? TUNER_FFT_HUNT
      if (buf.length !== size) {
        // re-alloc
        const b = new Float32Array(size)
        analyser?.getFloatTimeDomainData(b)
        handleFrame(b, ctx.sampleRate)
      } else {
        analyser?.getFloatTimeDomainData(buf)
        handleFrame(buf.subarray(0, size), ctx.sampleRate)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    cleanupExtra = () => {
      cancelAnimationFrame(raf)
      try {
        analyser?.disconnect()
      } catch {
        /* ignore */
      }
    }
  }

  const stop: TunerStop & {
    setRmsGate?: (g: number) => void
    getRmsGate?: () => number
    setFocusString?: (i: number | null) => void
    calibrateNoiseFloor?: (seconds?: number) => Promise<number>
  } = () => {
    stopped = true
    cleanupExtra?.()
    try {
      source.disconnect()
    } catch {
      /* ignore */
    }
    void ctx.close()
    for (const t of stream.getTracks()) t.stop()
  }

  stop.setRmsGate = controls.setRmsGate
  stop.getRmsGate = controls.getRmsGate
  stop.setFocusString = controls.setFocusString
  stop.calibrateNoiseFloor = controls.calibrateNoiseFloor

  return stop
}

/** Collect N samples from a media source (for noise calibrate). */
async function collectSamples(
  ctx: AudioContext,
  source: MediaStreamAudioSourceNode,
  n: number,
): Promise<Float32Array> {
  const out = new Float32Array(n)
  let offset = 0
  const ac = ctx.createAnalyser()
  ac.fftSize = 4096
  ac.smoothingTimeConstant = 0
  source.connect(ac)
  const tmp = new Float32Array(ac.fftSize)

  return new Promise((resolve) => {
    const step = () => {
      ac.getFloatTimeDomainData(tmp)
      const take = Math.min(tmp.length, n - offset)
      out.set(tmp.subarray(0, take), offset)
      offset += take
      if (offset >= n) {
        try {
          ac.disconnect()
        } catch {
          /* ignore */
        }
        resolve(out)
        return
      }
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
}

/** Reference tone helpers. */
export { hzToMidi, midiToHz }

/** Type guard for enhanced stop handle. */
export type TunerStopHandle = TunerStop & {
  setRmsGate?: (g: number) => void
  getRmsGate?: () => number
  setFocusString?: (i: number | null) => void
  calibrateNoiseFloor?: (seconds?: number) => Promise<number>
}
