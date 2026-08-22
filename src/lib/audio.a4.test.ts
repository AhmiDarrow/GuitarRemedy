import { afterEach, describe, expect, it } from 'vitest'
import { getPlaybackA4, midiNoteHz, setPlaybackA4 } from './audio'
import { midiToHz } from './audioToMidi'

describe('playback A4 concert pitch', () => {
  afterEach(() => {
    setPlaybackA4(440)
  })

  it('defaults to 440 Hz', () => {
    setPlaybackA4(440)
    expect(getPlaybackA4()).toBe(440)
    expect(midiNoteHz(69)).toBeCloseTo(440, 5)
  })

  it('midiNoteHz follows Profile A4 (432)', () => {
    setPlaybackA4(432)
    expect(getPlaybackA4()).toBe(432)
    expect(midiNoteHz(69)).toBeCloseTo(432, 5)
    expect(midiNoteHz(69, 432)).toBeCloseTo(midiToHz(69, 432), 8)
    // MIDI 69 at 432 is not 440
    expect(Math.abs(midiNoteHz(69) - 440)).toBeGreaterThan(5)
  })

  it('rejects out-of-range A4 and falls back to 440', () => {
    setPlaybackA4(300)
    expect(getPlaybackA4()).toBe(440)
  })
})
