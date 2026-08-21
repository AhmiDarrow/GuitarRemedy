import { describe, expect, it } from 'vitest'
import {
  beatDurationSec,
  beatsToSeconds,
  clampPracticeBpm,
  BPM_MAX,
  BPM_MIN,
  tabSongToScore,
} from './tabScore'
import type { TabSong } from '../data/library'

describe('tabScore', () => {
  it('clampPracticeBpm enforces shared 30–300 policy', () => {
    expect(BPM_MIN).toBe(30)
    expect(BPM_MAX).toBe(300)
    expect(clampPracticeBpm(10)).toBe(30)
    expect(clampPracticeBpm(400)).toBe(300)
    expect(clampPracticeBpm(120.4)).toBe(120)
  })

  it('beatDurationSec at 60 BPM is 1 second', () => {
    expect(beatDurationSec(60, 1)).toBeCloseTo(1, 5)
  })

  it('beatDurationSec at 120 BPM is 0.5 seconds', () => {
    expect(beatDurationSec(120, 1)).toBeCloseTo(0.5, 5)
  })

  it('speed 2 halves duration', () => {
    expect(beatDurationSec(60, 2)).toBeCloseTo(0.5, 5)
  })

  it('beatsToSeconds scales linearly', () => {
    expect(beatsToSeconds(4, 120, 1)).toBeCloseTo(2, 5)
  })

  it('preserves in-measure start offsets (rests/gaps)', () => {
    const song: TabSong = {
      title: 'gap',
      tempo: 100,
      timeSig: [4, 4],
      measures: [
        {
          notes: [
            { string: 0, fret: 0, duration: 1, start: 0 },
            { string: 0, fret: 3, duration: 1, start: 2 }, // beat 2 — rest on beat 1
          ],
        },
      ],
    }
    const score = tabSongToScore(song)
    expect(score.notes).toHaveLength(2)
    expect(score.notes[0].time).toBeCloseTo(0, 5)
    expect(score.notes[1].time).toBeCloseTo(2, 5)
    // open high-e = MIDI 64
    expect(score.notes[0].midi).toBe(64)
  })

  it('legacy notes without start still pack left-to-right', () => {
    const song: TabSong = {
      title: 'legacy',
      tempo: 90,
      timeSig: [4, 4],
      measures: [
        {
          notes: [
            { string: 0, fret: 0, duration: 1 },
            { string: 0, fret: 2, duration: 1 },
          ],
        },
      ],
    }
    const score = tabSongToScore(song)
    expect(score.notes[0].time).toBeCloseTo(0, 5)
    expect(score.notes[1].time).toBeCloseTo(1, 5)
  })

  it('import score beats play at score tempo via beatDurationSec', () => {
    // Mimic midiToBreakdown score: times in beats, tempo 100
    const scoreTempo = 100
    const noteBeat = 2
    const sec = beatsToSeconds(noteBeat, scoreTempo, 1)
    expect(sec).toBeCloseTo(1.2, 5) // 2 beats * 0.6s
    expect(beatDurationSec(scoreTempo, 1)).toBeCloseTo(0.6, 5)
  })
})
