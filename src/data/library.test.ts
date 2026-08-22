import { describe, expect, it } from 'vitest'
import { LIBRARY, getLibraryItem, searchLibrary } from './library'
import { getScale, parseChordSymbol, CHORDS } from '../lib/theory'

describe('library integrity', () => {
  it('has unique ids', () => {
    const ids = LIBRARY.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every scale has canonical scaleId that resolves in theory', () => {
    const scales = LIBRARY.filter((i) => i.kind === 'scale')
    expect(scales.length).toBeGreaterThanOrEqual(10)
    for (const item of scales) {
      const id = item.scaleId || item.theoryId
      expect(id, item.id).toBeTruthy()
      // No camelCase leftovers on scaleId
      expect(id).not.toMatch(/[A-Z]/)
      const scale = getScale(id!)
      expect(scale.id).toBe(id)
      expect(scale.intervals.length).toBeGreaterThan(0)
    }
  })

  it('every chord theoryId parses', () => {
    const chords = LIBRARY.filter((i) => i.kind === 'chord')
    expect(chords.length).toBeGreaterThanOrEqual(10)
    for (const item of chords) {
      const parsed = parseChordSymbol(item.theoryId || '')
      expect(parsed, item.id).toBeTruthy()
      expect(CHORDS[parsed!.chordId]).toBeTruthy()
    }
  })

  it('progressions carry chords[] for fretboard preview', () => {
    const progs = LIBRARY.filter((i) => i.kind === 'progression')
    expect(progs.length).toBeGreaterThanOrEqual(4)
    for (const p of progs) {
      expect(p.chords?.length, p.id).toBeGreaterThan(0)
      for (const sym of p.chords!) {
        expect(parseChordSymbol(sym), `${p.id} ${sym}`).toBeTruthy()
      }
    }
  })

  it('songs and riffs with tabs have measures', () => {
    const withTab = LIBRARY.filter((i) => i.tab)
    expect(withTab.length).toBeGreaterThan(20)
    for (const item of withTab) {
      expect(item.tab!.measures.length, item.id).toBeGreaterThan(0)
      expect(item.tab!.tempo).toBeGreaterThan(0)
    }
  })

  it('getLibraryItem resolves free-license pack', () => {
    expect(getLibraryItem('sg-amazing-grace')?.tab).toBeTruthy()
    expect(searchLibrary('', { kind: 'scale' }).every((i) => i.kind === 'scale')).toBe(true)
  })
})
