/** Shared tab timing helpers */

import type { TabSong } from '../data/library'
import type { TabNote, TabScore } from './breakdown'

/** Practice / metronome / UI BPM range — single policy everywhere. */
export const BPM_MIN = 30
export const BPM_MAX = 300
export const BPM_DEFAULT = 80

/** Clamp BPM to the shared practice range (30–300). */
export function clampPracticeBpm(n: number, fallback = BPM_DEFAULT): number {
  if (!Number.isFinite(n)) return fallback
  return Math.max(BPM_MIN, Math.min(BPM_MAX, Math.round(n)))
}

/** Seconds per beat at tempo (BPM), scaled by playback speed. */
export function beatDurationSec(tempoBpm: number, speed = 1): number {
  // Allow slightly wider range for imported scores; UI still clamps to 30–300.
  const bpm = Math.max(20, Math.min(400, tempoBpm || 100))
  const sp = Math.max(0.25, Math.min(4, speed || 1))
  return (60 / bpm) / sp
}

/** Convert a beat position to wall-clock seconds. */
export function beatsToSeconds(beats: number, tempoBpm: number, speed = 1): number {
  return beats * beatDurationSec(tempoBpm, speed)
}

const OPEN_MIDI = [64, 59, 55, 50, 45, 40]

/** Expand library TabSong measures into a timed TabScore for TabView. */
export function tabSongToScore(song: TabSong): TabScore {
  const tempo = song.tempo || 100
  const beatsPer = song.timeSig?.[0] || 4
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
        midi: OPEN_MIDI[string] + fret,
      })
      if (!hasStart) packCursor = onsetInMeasure + duration
      else packCursor = Math.max(packCursor, onsetInMeasure + duration)
    }
    measureBeat += beatsPer
  }
  return {
    title: song.title,
    tempo,
    strings: 6,
    notes,
  }
}
