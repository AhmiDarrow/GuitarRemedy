import { describe, expect, it } from 'vitest'
import { buildSimpleMidi, parseMidi } from './midi'

describe('midi', () => {
  it('round-trips a simple melody', () => {
    // start/duration are in quarter-note beats for buildSimpleMidi
    const bytes = buildSimpleMidi([
      { pitch: 60, start: 0, duration: 1 },
      { pitch: 64, start: 1, duration: 1 },
      { pitch: 67, start: 2, duration: 2 },
    ])
    const parsed = parseMidi(bytes)
    expect(parsed.notes.length).toBeGreaterThanOrEqual(3)
    expect(parsed.notes[0].pitch).toBe(60)
    expect(parsed.ticksPerQuarter).toBeGreaterThan(0)
  })

  it('handles empty note list', () => {
    const bytes = buildSimpleMidi([])
    const parsed = parseMidi(bytes)
    expect(parsed.notes).toEqual([])
  })
})
