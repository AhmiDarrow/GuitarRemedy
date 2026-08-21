/** Shared tab timing helpers */

import type { TabSong } from '../data/library'
import type { TabNote, TabScore } from './breakdown'

/** Seconds per beat at tempo (BPM), scaled by playback speed. */
export function beatDurationSec(tempoBpm: number, speed = 1): number {
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
  let beat = 0
  for (const measure of song.measures || []) {
    let t = beat
    for (const n of measure.notes || []) {
      const string = Math.max(0, Math.min(5, n.string))
      const fret = Math.max(0, n.fret)
      const duration = Math.max(0.125, n.duration || 1)
      notes.push({
        string,
        fret,
        time: t,
        duration,
        midi: OPEN_MIDI[string] + fret,
      })
      t += duration
    }
    beat += beatsPer
  }
  return {
    title: song.title,
    tempo,
    strings: 6,
    notes,
  }
}
