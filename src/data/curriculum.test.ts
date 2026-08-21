import { describe, expect, it } from 'vitest'
import { CURRICULUM, getLesson, getPhaseMeta } from './curriculum'
import { LIBRARY, getLibraryItem, searchLibrary } from './library'

describe('curriculum', () => {
  it('has 365 days', () => {
    expect(CURRICULUM).toHaveLength(365)
    expect(getLesson(1)?.title).toBeTruthy()
    expect(getLesson(365)?.day).toBe(365)
    expect(getLesson(0)).toBeUndefined()
  })

  it('deepens early days', () => {
    expect(getLesson(1)?.title).toMatch(/Meet the Guitar/i)
    expect(getLesson(30)?.goals.length).toBeGreaterThan(0)
  })

  it('hand-authors days 91–150', () => {
    expect(getLesson(91)?.title).toMatch(/Connect|Box/i)
    expect(getLesson(120)?.title).toMatch(/Capstone|Scales/i)
    expect(getLesson(121)?.title).toMatch(/Rhythm/i)
    expect(getLesson(150)?.title).toMatch(/Checkpoint|Rhythm/i)
    expect(getLesson(91)?.drills.length).toBeGreaterThanOrEqual(3)
    expect(getLesson(150)?.libraryIds.length).toBeGreaterThan(0)
  })

  it('hand-authors full path through day 365', () => {
    expect(getLesson(151)?.title).toMatch(/Rhythm|Groove|Pocket|Feel|Meter|Style/i)
    expect(getLesson(180)?.title).toMatch(/Checkpoint|Rhythm|Bridge|Lead/i)
    expect(getLesson(181)?.title).toMatch(/Lead|Phrase|Bend|Motif|Target|Solo/i)
    expect(getLesson(260)?.title).toMatch(/Checkpoint|Lead|Bridge|Repertoire|Solo/i)
    expect(getLesson(261)?.title).toMatch(/Repertoire|Song|Arrange|Setlist|Perform|Record|Vehicle/i)
    expect(getLesson(365)?.title).toMatch(/Year|Capstone|365|Finale|Mastery|Performance/i)
    for (const day of [151, 180, 200, 240, 280, 320, 365]) {
      const lesson = getLesson(day)
      expect(lesson?.drills.length).toBeGreaterThanOrEqual(3)
      expect(lesson?.goals.length).toBeGreaterThanOrEqual(2)
      expect(lesson?.libraryIds.length).toBeGreaterThan(0)
      expect(lesson?.theoryBite.length).toBeGreaterThan(20)
      expect(lesson?.masteryCheck.length).toBeGreaterThan(10)
      // no generic template titles
      expect(lesson?.title).not.toMatch(/— Day \d+$/)
    }
    // unique titles across deep band
    const titles = CURRICULUM.map((l) => l.title)
    expect(new Set(titles).size).toBe(365)
  })

  it('covers all phases', () => {
    const phases = new Set(CURRICULUM.map((l) => l.phase))
    expect(phases.has('basics')).toBe(true)
    expect(phases.has('repertoire')).toBe(true)
    expect(getPhaseMeta().length).toBe(6)
  })
})

describe('library', () => {
  it('seeds open content only', () => {
    expect(LIBRARY.length).toBeGreaterThan(25)
    expect(LIBRARY.every((i) => i.openLicense)).toBe(true)
  })

  it('includes a large free-license tab pack', () => {
    const tabbed = LIBRARY.filter((i) => i.tab && (i.kind === 'song' || i.kind === 'riff'))
    expect(tabbed.length).toBeGreaterThan(40)
    expect(tabbed.every((i) => i.openLicense && i.tab!.measures.length > 0)).toBe(true)
    const ids = new Set(LIBRARY.map((i) => i.id))
    expect(ids.size).toBe(LIBRARY.length)
    expect(getLibraryItem('sg-amazing-grace')?.tab).toBeTruthy()
    expect(getLibraryItem('sg-greensleeves')?.tags).toContain('public-domain')
  })

  it('searches and filters', () => {
    const scales = searchLibrary('pentatonic', { kind: 'scale' })
    expect(scales.length).toBeGreaterThan(0)
    expect(scales.every((s) => s.kind === 'scale')).toBe(true)
    const pd = searchLibrary('public-domain', { kind: 'song' })
    expect(pd.length).toBeGreaterThan(10)
  })
})
