import { describe, expect, it } from 'vitest'
import {
  NOTE_NAMES,
  SCALES,
  buildFretboard,
  chordNotes,
  degreeLabel,
  frettingSequence,
  fretChordVoices,
  midiToNameInKey,
  nameToMidi,
  noteToPc,
  parseChordSymbol,
  resolveChordId,
  scaleNoteNames,
  scalePitchClasses,
  smoothFrettingRun,
} from './theory'

describe('theory', () => {
  it('maps note names to pitch classes', () => {
    expect(noteToPc('C')).toBe(0)
    expect(noteToPc('C#')).toBe(1)
    expect(noteToPc('Db')).toBe(1)
    expect(noteToPc('Cb')).toBe(11) // enharmonic B
    expect(noteToPc('Fb')).toBe(4) // enharmonic E
    expect(noteToPc(60)).toBe(0)
    expect(NOTE_NAMES).toHaveLength(12)
  })

  it('builds major scale pitch classes', () => {
    expect(scalePitchClasses('C', 'major')).toEqual([0, 2, 4, 5, 7, 9, 11])
    expect(scaleNoteNames('A', 'natural_minor')).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
  })

  it('labels whole-tone degrees without b7 mush', () => {
    expect(SCALES.whole_tone.degrees).toEqual(['1', '2', '3', '#4', '#5', '#6'])
    expect(SCALES.whole_tone.intervals).toEqual([0, 2, 4, 6, 8, 10])
  })

  it('supports camelCase scale aliases', () => {
    expect(SCALES.minorPentatonic.intervals).toEqual([0, 3, 5, 7, 10])
    expect(scalePitchClasses('A', 'minorPentatonic')).toEqual([9, 0, 2, 4, 7])
  })

  it('builds a fretboard with roots highlighted', () => {
    const board = buildFretboard({ root: 'E', scaleId: 'minor_pentatonic', frets: 12 })
    expect(board).toHaveLength(6)
    expect(board[0]).toHaveLength(13)
    const roots = board.flat().filter((c) => c.isRoot)
    expect(roots.length).toBeGreaterThan(0)
    expect(roots.every((r) => r.pc === 4)).toBe(true)
  })

  it('labels scale degrees', () => {
    expect(degreeLabel('C', 'E', 'major')).toBe('3')
    expect(degreeLabel('C', 'F', 'major')).toBe('4')
    expect(degreeLabel('C', 'C#', 'major')).toBeNull()
  })

  it('builds chord note midis', () => {
    const cmaj = chordNotes('C', 'maj')
    expect(cmaj.map((m) => m % 12)).toEqual([0, 4, 7])
    expect(nameToMidi('A4')).toBe(69)
    expect(chordNotes('A', 'm').map((m) => m % 12)).toEqual([9, 0, 4])
    expect(chordNotes('G', '7').map((m) => m % 12)).toEqual([7, 11, 2, 5])
    expect(chordNotes('B', 'm7b5').map((m) => m % 12)).toEqual([11, 2, 5, 9])
  })

  it('parses chord symbols to real ChordIds', () => {
    expect(parseChordSymbol('C')?.chordId).toBe('maj')
    expect(parseChordSymbol('Am')?.chordId).toBe('min')
    expect(parseChordSymbol('G7')?.chordId).toBe('7')
    expect(parseChordSymbol('Fmaj7')?.chordId).toBe('maj7')
    expect(parseChordSymbol('Bm7b5')?.chordId).toBe('m7b5')
    expect(parseChordSymbol('Dsus4')?.chordId).toBe('sus4')
    expect(resolveChordId('dim7')).toBe('dim7')
    expect(resolveChordId('add9')).toBe('add9')
  })

  it('labels melodic minor as ascending/jazz form', () => {
    expect(SCALES.melodic_minor.name.toLowerCase()).toMatch(/jazz|ascending/)
    expect(SCALES.melodic_minor.intervals).toEqual([0, 2, 3, 5, 7, 9, 11])
  })

  it('frettingSequence keeps hand continuity on a rising line', () => {
    // C4 D4 E4 F4 G4 A4
    const midis = [60, 62, 64, 65, 67, 69]
    const run = frettingSequence(midis)
    expect(run).toHaveLength(6)
    expect(run.every((f) => f.fret >= 0 && f.fret <= 17)).toBe(true)
    // average string jump should be small
    let jumps = 0
    for (let i = 1; i < run.length; i++) jumps += Math.abs(run[i].string - run[i - 1].string)
    expect(jumps / (run.length - 1)).toBeLessThanOrEqual(1.5)

    const smoothed = smoothFrettingRun(run)
    expect(smoothed).toHaveLength(run.length)
    expect(smoothed.map((f) => f.midi)).toEqual(midis)
  })

  it('frettingSequence look-ahead keeps midis exact after a leap', () => {
    // small steps then leap up — frets must still match MIDI
    const midis = [60, 62, 64, 72, 74]
    const run = frettingSequence(midis)
    expect(run.map((f) => f.midi)).toEqual(midis)
    expect(run.every((f) => f.fret >= 0 && f.fret <= 17)).toBe(true)
    const lastJump = Math.abs(run[3].string - run[2].string) + Math.abs(run[3].fret - run[2].fret)
    expect(lastJump).toBeLessThan(20)
  })

  it('frettingSequence with shared onsets frets a chord on unique strings', () => {
    // Open-ish C major-ish: C3 E3 G3 C4 at same beat
    const midis = [48, 52, 55, 60]
    const onsets = [0, 0, 0, 0]
    const run = frettingSequence(midis, undefined, { onsets })
    expect(run.map((f) => f.midi)).toEqual(midis)
    const strings = run.map((f) => f.string)
    expect(new Set(strings).size).toBe(strings.length) // no double-stop same string
    const frets = run.map((f) => f.fret)
    const span = Math.max(...frets) - Math.min(...frets.filter((f) => f > 0).concat([Math.max(...frets)]))
    expect(span).toBeLessThanOrEqual(5)
  })

  it('fretChordVoices keeps midis and unique strings', () => {
    const midis = [40, 47, 52, 56] // power-ish shape
    const grip = fretChordVoices(midis)
    expect(grip.map((g) => g.midi)).toEqual(midis)
    expect(new Set(grip.map((g) => g.string)).size).toBe(grip.length)
  })

  it('midiToNameInKey prefers flats in flat keys', () => {
    // MIDI 70 = Bb / A#
    expect(midiToNameInKey(70, 'Bb', 'major')).toMatch(/^Bb/)
    expect(midiToNameInKey(70, 'A', 'major')).toMatch(/^A#/)
  })

  it('frettingSequence preferPosition open stays lower frets', () => {
    const midis = [64, 65, 67, 69, 71, 72]
    const open = frettingSequence(midis, undefined, { preferPosition: 'open' })
    const mid = frettingSequence(midis, undefined, { preferPosition: 'mid' })
    const avg = (run: typeof open) => run.reduce((s, f) => s + f.fret, 0) / run.length
    expect(avg(open)).toBeLessThanOrEqual(avg(mid) + 1.5)
  })
})
