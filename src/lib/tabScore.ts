/** Shared tab timing helpers + open-string MIDI for display index (high-e = 0). */

import type { TabSong } from '../data/library'
import type { TabNote, TabScore } from './breakdown'
import { STANDARD_TUNING } from './theory'

/** Practice / metronome / UI BPM range — single policy everywhere. */
export const BPM_MIN = 30
export const BPM_MAX = 300
export const BPM_DEFAULT = 80

/** Clamp BPM to the shared practice range (30–300). */
export function clampPracticeBpm(n: number, fallback = BPM_DEFAULT): number {
  if (!Number.isFinite(n)) return fallback
  return Math.max(BPM_MIN, Math.min(BPM_MAX, Math.round(n)))
}

/**
 * Clamp imported score tempos. Same 30–300 policy as practice —
 * extreme MIDI tempos are folded so playback and UI never disagree.
 */
export function clampImportBpm(n: number, fallback = 100): number {
  return clampPracticeBpm(n, fallback)
}

/** Seconds per beat at tempo (BPM), scaled by playback speed. */
export function beatDurationSec(tempoBpm: number, speed = 1): number {
  const bpm = clampPracticeBpm(tempoBpm, 100)
  const sp = Math.max(0.25, Math.min(4, speed || 1))
  return 60 / bpm / sp
}

/** Convert a beat position to wall-clock seconds. */
export function beatsToSeconds(beats: number, tempoBpm: number, speed = 1): number {
  return beats * beatDurationSec(tempoBpm, speed)
}

/** Standard open strings, display order: index 0 = high e … 5 = low E. */
export const STANDARD_OPEN_MIDI_HIGH_TO_LOW = [64, 59, 55, 50, 45, 40] as const

/**
 * Open-string MIDI for TabView / library display index (0 = high e … 5 = low E).
 * `tuning` is theory order (0 = low E … 5 = high e), matching getTuning() / STANDARD_TUNING.
 */
export function openMidiHighToLow(
  tuning: number[] = [...STANDARD_TUNING],
): number[] {
  const t =
    Array.isArray(tuning) && tuning.length === 6 ? tuning : [...STANDARD_TUNING]
  // theory [lowE…highE] → display [highE…lowE]
  return [t[5], t[4], t[3], t[2], t[1], t[0]]
}

/** MIDI pitch for a display-string + fret under the given theory tuning. */
export function midiFromDisplayStringFret(
  stringHighE0: number,
  fret: number,
  tuning: number[] = [...STANDARD_TUNING],
): number {
  const open = openMidiHighToLow(tuning)
  const s = Math.max(0, Math.min(5, Math.round(stringHighE0)))
  const fr = Math.max(0, Math.min(24, Math.round(fret)))
  return (open[s] ?? 64) + fr
}

/** Expand library TabSong measures into a timed TabScore for TabView. */
export function tabSongToScore(
  song: TabSong,
  opts?: { tuning?: number[] },
): TabScore {
  const tempo = clampImportBpm(song.tempo || 100)
  const beatsPer = song.timeSig?.[0] || 4
  const open = openMidiHighToLow(opts?.tuning)
  const notes: TabNote[] = []
  let measureBeat = 0
  for (const measure of song.measures || []) {
    // Cursor for legacy notes that omit `start` (pack left-to-right).
    let packCursor = 0
    for (const n of measure.notes || []) {
      const string = Math.max(0, Math.min(5, n.string))
      const fret = Math.max(0, n.fret)
      const duration = Math.max(0.125, n.duration || 1)
      const hasStart = typeof n.start === 'number' && Number.isFinite(n.start)
      const onsetInMeasure = hasStart
        ? Math.max(0, Math.min(beatsPer - 0.001, n.start as number))
        : packCursor
      const time = measureBeat + onsetInMeasure
      notes.push({
        string,
        fret,
        time,
        duration,
        midi: open[string] + fret,
      })
      if (!hasStart) packCursor = onsetInMeasure + duration
      else packCursor = Math.max(packCursor, onsetInMeasure + duration)
    }
    measureBeat += beatsPer
  }
  const ts = song.timeSig
  const timeSig: [number, number] | undefined =
    Array.isArray(ts) && ts.length >= 2
      ? [Math.max(1, Math.round(ts[0]) || 4), Math.max(1, Math.round(ts[1]) || 4)]
      : undefined
  return {
    title: song.title,
    tempo,
    strings: 6,
    timeSig: timeSig ?? [4, 4],
    notes,
  }
}
