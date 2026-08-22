import { afterEach, describe, expect, it } from 'vitest'
import {
  getPlayGeneration,
  getPlaybackA4,
  midiNoteHz,
  midisToPitchClasses,
  setPlaybackA4,
  stopAllNotes,
} from './audio'

describe('playback hard-stop + pitch helpers', () => {
  afterEach(() => {
    setPlaybackA4(440)
    stopAllNotes()
  })

  it('stopAllNotes bumps play generation so scheduled sequences can abort', () => {
    const before = getPlayGeneration()
    stopAllNotes()
    expect(getPlayGeneration()).toBeGreaterThan(before)
    stopAllNotes()
    expect(getPlayGeneration()).toBeGreaterThan(before + 1)
  })

  it('midiNoteHz respects A4 for truthful playback pitch', () => {
    setPlaybackA4(440)
    expect(midiNoteHz(69)).toBeCloseTo(440, 5)
    setPlaybackA4(432)
    expect(getPlaybackA4()).toBe(432)
    expect(midiNoteHz(69)).toBeCloseTo(432, 5)
  })
})

describe('play-along pitch-class map (fretboard animation)', () => {
  it('midisToPitchClasses collapses octaves and dedupes', () => {
    expect(midisToPitchClasses([])).toEqual([])
    // C4=60, E4=64, G4=67, C5=72 → C, E, G
    expect(midisToPitchClasses([60, 64, 67, 72])).toEqual([0, 4, 7])
  })

  it('midisToPitchClasses normalizes negative / high MIDI', () => {
    // -1 → 11, 13 → 1
    expect(midisToPitchClasses([-1, 13])).toEqual([1, 11])
    expect(midisToPitchClasses([-1])).toEqual([11])
    expect(midisToPitchClasses([13, 25])).toEqual([1])
  })
})
