import { describe, expect, it } from 'vitest'
import { CURRICULUM, getLesson, getPhaseMeta } from './curriculum'
import { LIBRARY, getLibraryItem, searchLibrary } from './library'

const libraryIds = new Set(LIBRARY.map((i) => i.id))

describe('curriculum', () => {
  it('has 365 days', () => {
    expect(CURRICULUM).toHaveLength(365)
    expect(getLesson(1)?.title).toBeTruthy()
    expect(getLesson(365)?.day).toBe(365)
    expect(getLesson(0)).toBeUndefined()
  })

  it('deepens early days with real beginner wins', () => {
    expect(getLesson(1)?.title).toMatch(/Meet|Guitar|Clean/i)
    expect(getLesson(3)?.title).toMatch(/E Minor|Em/i)
    expect(getLesson(7)?.title).toMatch(/Week 1|Jam/i)
    expect(getLesson(30)?.goals.length).toBeGreaterThan(0)
    expect(getLesson(1)?.privateLesson.segments.length).toBeGreaterThanOrEqual(5)
  })

  it('aligns phase boundaries with titles', () => {
    expect(getLesson(30)?.phase).toBe('basics')
    expect(getLesson(31)?.phase).toBe('chords')
    expect(getLesson(76)?.phase).toBe('scales')
    expect(getLesson(120)?.phase).toBe('scales')
    expect(getLesson(121)?.phase).toBe('rhythm')
    expect(getLesson(121)?.title).toMatch(/Rhythm/i)
    expect(getLesson(181)?.phase).toBe('lead')
    expect(getLesson(261)?.phase).toBe('repertoire')
  })

  it('hand-authors progressive path through day 365', () => {
    expect(getLesson(91)?.drills.length).toBeGreaterThanOrEqual(3)
    expect(getLesson(150)?.libraryIds.length).toBeGreaterThan(0)
    expect(getLesson(151)?.title.length).toBeGreaterThan(8)
    expect(getLesson(180)?.title.length).toBeGreaterThan(8)
    expect(getLesson(181)?.title).toMatch(/Lead|Phrase|Bend|Motif|Solo|Speech/i)
    expect(getLesson(260)?.title.length).toBeGreaterThan(8)
    expect(getLesson(261)?.title).toMatch(/Repertoire|Song|Arrange|Set|Perform|Vehicle/i)
    expect(getLesson(365)?.title).toMatch(/365|Capstone|Year|Finale|Mastery|Performance/i)

    for (const day of [1, 30, 75, 91, 120, 121, 150, 151, 180, 200, 240, 280, 320, 365]) {
      const lesson = getLesson(day)
      expect(lesson?.drills.length).toBeGreaterThanOrEqual(3)
      expect(lesson?.goals.length).toBeGreaterThanOrEqual(2)
      expect(lesson?.libraryIds.length).toBeGreaterThan(0)
      expect(lesson?.theoryBite.length).toBeGreaterThan(20)
      expect(lesson?.masteryCheck.length).toBeGreaterThan(15)
      expect(lesson?.title).not.toMatch(/— Day \d+$/)
      expect(lesson?.privateLesson.durationMin).toBeGreaterThanOrEqual(25)
      expect(lesson?.privateLesson.hook.length).toBeGreaterThan(10)
      expect(lesson?.privateLesson.winCondition.length).toBeGreaterThan(10)
    }
  })

  it('keeps every title and mastery check unique', () => {
    const titles = CURRICULUM.map((l) => l.title)
    expect(new Set(titles).size).toBe(365)
    const mastery = CURRICULUM.map((l) => l.masteryCheck)
    expect(new Set(mastery).size).toBe(365)
    // no late-year stencil mastery
    expect(mastery.some((m) => /tangible repertoire outcome today/i.test(m))).toBe(false)
  })

  it('resolves every libraryIds reference', () => {
    for (const lesson of CURRICULUM) {
      for (const id of lesson.libraryIds) {
        expect(libraryIds.has(id), `day ${lesson.day} missing library id ${id}`).toBe(true)
        expect(getLibraryItem(id)?.id).toBe(id)
      }
    }
  })

  it('keeps goals and drills day-specific (low stencil rate)', () => {
    const goalKey = (g: string[]) => g.join('|')
    const drillKey = (d: string[]) => d.join('|')
    const goals = CURRICULUM.map((l) => goalKey(l.goals))
    const drills = CURRICULUM.map((l) => drillKey(l.drills))
    // Allow some intentional weekly review echoes, but not mass clones
    expect(new Set(goals).size).toBeGreaterThan(300)
    expect(new Set(drills).size).toBeGreaterThan(300)
  })

  it('covers all phases', () => {
    const phases = new Set(CURRICULUM.map((l) => l.phase))
    expect(phases.has('basics')).toBe(true)
    expect(phases.has('chords')).toBe(true)
    expect(phases.has('scales')).toBe(true)
    expect(phases.has('rhythm')).toBe(true)
    expect(phases.has('lead')).toBe(true)
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
