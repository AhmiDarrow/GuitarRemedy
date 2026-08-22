import { describe, expect, it } from 'vitest'
import {
  basicPitchAvailable,
  basicPitchNotesToDetected,
  preferBasicPitchNotes,
  resampleMono,
  thinToGuitarLead,
  type BasicPitchNote,
} from './basicPitchAssist'
import type { DetectedNote } from './audioToMidi'

describe('basicPitchAssist (free Apache-2.0 helpers)', () => {
  it('resampleMono identity at same rate', () => {
    const s = new Float32Array([0, 0.5, 1, 0.5, 0])
    const out = resampleMono(s, 22050, 22050)
    expect(out).toBe(s)
  })

  it('resampleMono changes length when rate changes', () => {
    const s = new Float32Array(22050)
    for (let i = 0; i < s.length; i++) s[i] = Math.sin(i / 20)
    const out = resampleMono(s, 44100, 22050)
    expect(out.length).toBeGreaterThan(10000)
    expect(out.length).toBeLessThan(12000)
  })

  it('basicPitchNotesToDetected maps times to ticks', () => {
    const notes: BasicPitchNote[] = [
      { startTimeSeconds: 0, durationSeconds: 0.5, pitchMidi: 60, amplitude: 0.8 },
      { startTimeSeconds: 0.5, durationSeconds: 0.25, pitchMidi: 64, amplitude: 0.6 },
    ]
    // 120 BPM → 0.5s per beat; 0.5s = 1 beat = 480 ticks
    const det = basicPitchNotesToDetected(notes, 120, 480)
    expect(det).toHaveLength(2)
    expect(det[0].pitch).toBe(60)
    expect(det[0].start).toBe(0)
    expect(det[0].duration).toBe(480)
    expect(det[1].start).toBe(480)
    expect(det[1].duration).toBe(240)
  })

  it('preferBasicPitchNotes rejects empty/sparse weak sets', () => {
    expect(preferBasicPitchNotes([])).toBe(false)
    expect(
      preferBasicPitchNotes([
        {
          pitch: 60,
          start: 0,
          duration: 100,
          velocity: 80,
          timeSec: 0,
          durationSec: 0.2,
          confidence: 0.1,
        },
      ]),
    ).toBe(false)
  })

  it('preferBasicPitchNotes accepts solid sets', () => {
    const notes: DetectedNote[] = Array.from({ length: 8 }, (_, i) => ({
      pitch: 60 + (i % 5),
      start: i * 240,
      duration: 200,
      velocity: 80,
      timeSec: i * 0.25,
      durationSec: 0.2,
      confidence: 0.55,
    }))
    expect(preferBasicPitchNotes(notes)).toBe(true)
  })

  it('thinToGuitarLead caps simultaneous voices', () => {
    const chord: DetectedNote[] = [40, 45, 50, 55, 60, 64].map((p, i) => ({
      pitch: p,
      start: 0,
      duration: 480,
      velocity: 80,
      timeSec: 0,
      durationSec: 0.5,
      confidence: 0.5 + i * 0.05,
    }))
    const out = thinToGuitarLead(chord, 3)
    expect(out.length).toBeLessThanOrEqual(3)
  })

  it('basicPitchAvailable returns boolean without throwing', async () => {
    const ok = await basicPitchAvailable('/models/basic-pitch/model.json')
    expect(typeof ok).toBe('boolean')
  })
})
