/**
 * Full practice metronome — BPM, time signature, subdivisions, accent, count-in.
 * Schedules on Tone.Transport (audio clock) with one reused click voice.
 */

import { ensureAudio } from './audio'

export type Subdivision = 1 | 2 | 3 | 4
/** Beats per bar (numerator). Denominator is always quarter = 1 beat. */
export type TimeBeats = 2 | 3 | 4 | 5 | 6 | 7

export interface MetronomeConfig {
  bpm: number
  beatsPerBar: TimeBeats
  subdivision: Subdivision
  /** Accent beat 1 louder */
  accent: boolean
  /** Soft count-in bars before main loop (0 = none) */
  countInBars: number
}

export const DEFAULT_METRONOME: MetronomeConfig = {
  bpm: 80,
  beatsPerBar: 4,
  subdivision: 1,
  accent: true,
  countInBars: 0,
}

export function clampBpm(n: number): number {
  if (!Number.isFinite(n)) return 80
  return Math.max(30, Math.min(300, Math.round(n)))
}

export function beatDurationSec(bpm: number): number {
  return 60 / clampBpm(bpm)
}

export function subBeatDurationSec(bpm: number, subdivision: Subdivision): number {
  return beatDurationSec(bpm) / subdivision
}

/** Index of beat within bar (0-based) for a running click index. */
export function beatInBar(
  clickIndex: number,
  beatsPerBar: number,
  subdivision: Subdivision,
): number {
  const cycle = beatsPerBar * subdivision
  const subIndex = ((clickIndex % cycle) + cycle) % cycle
  return Math.floor(subIndex / subdivision)
}

export function isDownbeat(
  clickIndex: number,
  beatsPerBar: number,
  subdivision: Subdivision,
): boolean {
  return beatInBar(clickIndex, beatsPerBar, subdivision) === 0 && clickIndex % subdivision === 0
}

export function isBeatPulse(clickIndex: number, subdivision: Subdivision): boolean {
  return clickIndex % subdivision === 0
}

export type ClickKind = 'accent' | 'beat' | 'sub' | 'count'

export function clickKind(
  clickIndex: number,
  cfg: Pick<MetronomeConfig, 'beatsPerBar' | 'subdivision' | 'accent'>,
  opts?: { countingIn?: boolean },
): ClickKind {
  if (opts?.countingIn) {
    if (isDownbeat(clickIndex, cfg.beatsPerBar, cfg.subdivision)) return 'count'
    if (isBeatPulse(clickIndex, cfg.subdivision)) return 'beat'
    return 'sub'
  }
  if (isDownbeat(clickIndex, cfg.beatsPerBar, cfg.subdivision) && cfg.accent) return 'accent'
  if (isBeatPulse(clickIndex, cfg.subdivision)) return 'beat'
  return 'sub'
}

/** Total sub-clicks for N bars at the given subdivision. */
export function countInClickCount(
  countInBars: number,
  beatsPerBar: number,
  subdivision: Subdivision,
): number {
  const bars = Math.max(0, Math.floor(countInBars || 0))
  return bars * beatsPerBar * subdivision
}

let transportRunning = false
let clickIndex = 0
let countInRemaining = 0
let onBeatCb: ((info: {
  beat: number
  barBeat: number
  kind: ClickKind
  countingIn: boolean
}) => void) | null = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let clickSynth: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let repeatId: number | null = null

async function tone() {
  return import('tone')
}

async function getClickSynth() {
  const Tone = await tone()
  if (!clickSynth) {
    clickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.02 },
    }).toDestination()
    clickSynth.volume.value = -8
  }
  return { Tone, synth: clickSynth }
}

async function playClick(kind: ClickKind, time?: number) {
  await ensureAudio()
  const { Tone, synth } = await getClickSynth()
  const t = time ?? Tone.now()
  const freq = kind === 'accent' || kind === 'count' ? 880 : kind === 'beat' ? 660 : 440
  const dur = kind === 'sub' ? 0.03 : 0.05
  const vol = kind === 'accent' ? -4 : kind === 'count' ? -6 : kind === 'beat' ? -10 : -16
  try {
    synth.volume.value = vol
    synth.triggerAttackRelease(freq, dur, t)
  } catch {
    /* ignore audio glitches */
  }
}

/**
 * Start a looping metronome on Tone.Transport. Safe to call while running (restarts).
 */
export async function startMetronome(
  cfg: MetronomeConfig,
  opts?: {
    onBeat?: (info: {
      beat: number
      barBeat: number
      kind: ClickKind
      countingIn: boolean
    }) => void
  },
): Promise<void> {
  await stopMetronome()
  await ensureAudio()
  const Tone = await tone()
  await getClickSynth()

  const bpm = clampBpm(cfg.bpm)
  const sub = cfg.subdivision
  const beats = cfg.beatsPerBar
  onBeatCb = opts?.onBeat ?? null
  clickIndex = 0
  countInRemaining = countInClickCount(cfg.countInBars, beats, sub)

  Tone.Transport.bpm.value = bpm
  Tone.Transport.cancel(0)
  Tone.Transport.position = 0

  const stepSec = subBeatDurationSec(bpm, sub)

  repeatId = Tone.Transport.scheduleRepeat((time: number) => {
    const countingIn = countInRemaining > 0
    const kind = clickKind(clickIndex, cfg, { countingIn })
    void playClick(kind, time)
    const barBeat = beatInBar(clickIndex, beats, sub)
    onBeatCb?.({ beat: clickIndex, barBeat, kind, countingIn })
    if (countingIn) countInRemaining -= 1
    clickIndex += 1
  }, stepSec)

  Tone.Transport.start()
  transportRunning = true
}

export async function stopMetronome(): Promise<void> {
  transportRunning = false
  clickIndex = 0
  countInRemaining = 0
  onBeatCb = null
  try {
    const Tone = await tone()
    if (repeatId != null) {
      try {
        Tone.Transport.clear(repeatId)
      } catch {
        /* ignore */
      }
      repeatId = null
    }
    Tone.Transport.stop()
    Tone.Transport.cancel(0)
    Tone.Transport.position = 0
  } catch {
    /* tone not loaded */
  }
}

export function isMetronomeRunning(): boolean {
  return transportRunning
}

/** Tap-tempo: estimate BPM from recent tap timestamps (ms). */
export function bpmFromTaps(timestampsMs: number[]): number | null {
  if (timestampsMs.length < 2) return null
  const gaps: number[] = []
  for (let i = 1; i < timestampsMs.length; i++) {
    const g = timestampsMs[i] - timestampsMs[i - 1]
    if (g > 100 && g < 2500) gaps.push(g)
  }
  if (gaps.length === 0) return null
  const sorted = [...gaps].sort((a, b) => a - b)
  const mid = sorted[Math.floor(sorted.length / 2)]
  return clampBpm(60000 / mid)
}
