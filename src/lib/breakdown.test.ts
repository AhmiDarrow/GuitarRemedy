import { describe, expect, it } from 'vitest'
import {
  breakdownAudioAssist,
  breakdownGuitarPro,
  estimateNoteConfidence,
  midiToBreakdown,
  tabToAscii,
} from './breakdown'
import { buildSimpleMidi, parseMidi } from './midi'

describe('breakdown', () => {
  it('analyzes a MIDI melody into tab + key', () => {
    const buf = buildSimpleMidi([
      { pitch: 64, start: 0, duration: 240 }, // E4
      { pitch: 67, start: 240, duration: 240 }, // G4
      { pitch: 71, start: 480, duration: 240 }, // B4
      { pitch: 74, start: 720, duration: 480 }, // D5
    ])
    const parsed = parseMidi(buf)
    const result = midiToBreakdown(parsed, 'Em sketch')
    expect(result.tab.length).toBeGreaterThan(0)
    expect(result.tabNotes.length).toBe(result.tab.length)
    expect(result.score.notes.length).toBeGreaterThan(0)
    expect(result.explanation.length).toBeGreaterThan(0)
    expect(result.practicePlan.length).toBeGreaterThan(0)
    expect(result.confidence).toBeGreaterThan(0)
    expect(result.key.root).toBeTruthy()
  })

  it('stores score time in beats (not seconds-at-120bpm)', () => {
    const buf = buildSimpleMidi([
      { pitch: 60, start: 0, duration: 480 },
      { pitch: 64, start: 480, duration: 480 },
      { pitch: 67, start: 960, duration: 480 },
    ])
    const parsed = parseMidi(buf)
    const result = midiToBreakdown(parsed, 'beat grid')
    expect(result.score.tempo).toBeGreaterThan(0)
    // ticksPerQuarter 480 → start beats 0, 1, 2
    const times = result.score.notes.map((n) => n.time).sort((a, b) => a - b)
    expect(times[0]).toBeCloseTo(0, 5)
    expect(times[1]).toBeCloseTo(1, 5)
    expect(times[2]).toBeCloseTo(2, 5)
    // display string is high-e=0; theory low-E=0 is flipped once
    for (const n of result.score.notes) {
      expect(n.string).toBeGreaterThanOrEqual(0)
      expect(n.string).toBeLessThanOrEqual(5)
      expect(n.duration).toBeGreaterThan(0)
    }
  })

  it('marks audio assist as editable and low confidence', () => {
    const r = breakdownAudioAssist('jam.wav', [57, 60, 62, 64])
    expect(r.kind).toBe('audio')
    expect(r.editable).toBe(true)
    expect(r.confidence).toBeLessThan(0.6)
    expect(r.warnings.some((w) => /assist|monophonic|editable/i.test(w))).toBe(true)
  })

  it('estimateNoteConfidence prefers quality over raw length', () => {
    expect(estimateNoteConfidence([])).toBeLessThan(0.2)
    const melody = [60, 62, 64, 65, 67, 69, 71, 72]
    const longNoise = Array.from({ length: 200 }, (_, i) => 40 + (i % 48))
    const m = estimateNoteConfidence(melody, { source: 'midi' })
    const n = estimateNoteConfidence(longNoise, { source: 'audio', avgFrameConf: 0.2 })
    expect(m).toBeGreaterThan(0.7)
    expect(n).toBeLessThan(m)
    expect(estimateNoteConfidence(melody, { source: 'audio', avgFrameConf: 0.9 })).toBeLessThanOrEqual(
      0.82,
    )
  })

  it('renders ascii tab', () => {
    const ascii = tabToAscii([
      { string: 0, fret: 0, midi: 64, startBeat: 0, durationBeats: 1, noteName: 'E4' },
      { string: 1, fret: 2, midi: 62, startBeat: 1, durationBeats: 1, noteName: 'D4' },
    ])
    expect(ascii).toContain('e|')
    expect(ascii).toContain('E|')
  })

  it('Guitar Pro empty buffer stays editable with honest fallback', async () => {
    const r = await breakdownGuitarPro(new ArrayBuffer(0), 'empty.gp')
    expect(r.kind).toBe('guitarpro')
    expect(r.editable).toBe(true)
    expect(r.tab.length).toBeGreaterThan(0)
    expect(r.isPlaceholder).toBe(true)
    expect(r.warnings.length + r.explanation.length).toBeGreaterThan(0)
    expect(
      [...r.warnings, ...r.explanation, r.statusMessage || ''].some((t) =>
        /MIDI|MusicXML|best-effort|fallback|binary|placeholder/i.test(t),
      ),
    ).toBe(true)
  })

  it('warns when MIDI has multiple tempos and warps beat positions', () => {
    // Minimal multi-tempo via parse result shape
    const parsed = {
      format: 0,
      ticksPerQuarter: 480,
      trackCount: 1,
      notes: [
        { pitch: 60, startTick: 0, durationTicks: 480, velocity: 80, channel: 0, track: 0 },
        { pitch: 64, startTick: 480, durationTicks: 480, velocity: 80, channel: 0, track: 0 },
      ],
      tempoBpm: 100,
      tempoMap: [
        { tick: 0, bpm: 100 },
        { tick: 480, bpm: 140 },
      ],
      hasTempoChanges: true,
      timeSignature: { numerator: 4, denominator: 4 },
      pitchClasses: [0, 4],
    }
    const result = midiToBreakdown(parsed as never, 'tempo map')
    expect(result.tempoBpm).toBe(100)
    expect(result.warnings.some((w) => /multiple tempos|tempo changes|warped/i.test(w))).toBe(true)
    // Second note starts after 1 beat at 100 BPM wall-clock; warped start > pure tick/tpq only if tempos differ mid-note —
    // at the tempo change boundary startBeat for note 2 equals 1.0 still (change at same tick).
    const times = result.score.notes.map((n) => n.time).sort((a, b) => a - b)
    expect(times[0]).toBeCloseTo(0, 5)
    expect(times[1]).toBeCloseTo(1, 5)
  })

  it('warps later notes when tempo speeds up mid-file', () => {
    const parsed = {
      format: 0,
      ticksPerQuarter: 480,
      trackCount: 1,
      notes: [
        { pitch: 60, startTick: 0, durationTicks: 480, velocity: 80, channel: 0, track: 0 },
        // After 1 quarter at 60 BPM then 1 quarter at 120 BPM → wall 1.5s → 1.5 beats at ref 60
        { pitch: 64, startTick: 960, durationTicks: 480, velocity: 80, channel: 0, track: 0 },
      ],
      tempoBpm: 60,
      tempoMap: [
        { tick: 0, bpm: 60 },
        { tick: 480, bpm: 120 },
      ],
      hasTempoChanges: true,
      timeSignature: { numerator: 4, denominator: 4 },
      pitchClasses: [0, 4],
    }
    const result = midiToBreakdown(parsed as never, 'warp')
    const times = result.score.notes.map((n) => n.time).sort((a, b) => a - b)
    expect(times[0]).toBeCloseTo(0, 5)
    // Without warp: 960/480 = 2 beats. With warp at ref 60: 1.5 beats.
    expect(times[1]).toBeCloseTo(1.5, 5)
  })
})
