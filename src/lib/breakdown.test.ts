import { describe, expect, it } from 'vitest'
import {
  breakdownAudioAssist,
  breakdownGuitarPro,
  breakdownGuitarProStub,
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

  it('marks audio assist as editable and low confidence', () => {
    const r = breakdownAudioAssist('jam.wav', [57, 60, 62, 64])
    expect(r.kind).toBe('audio')
    expect(r.editable).toBe(true)
    expect(r.confidence).toBeLessThan(0.6)
    expect(r.warnings.some((w) => /assist|monophonic|editable/i.test(w))).toBe(true)
  })

  it('renders ascii tab', () => {
    const ascii = tabToAscii([
      { string: 0, fret: 0, midi: 64, startBeat: 0, durationBeats: 1, noteName: 'E4' },
      { string: 1, fret: 2, midi: 62, startBeat: 1, durationBeats: 1, noteName: 'D4' },
    ])
    expect(ascii).toContain('e|')
    expect(ascii).toContain('E|')
  })
})
