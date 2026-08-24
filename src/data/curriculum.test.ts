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
    // theory accuracy spot-checks
    expect(getLesson(3)?.theoryBite).toMatch(/E\s*G\s*B/i)
    expect(getLesson(4)?.theoryBite).toMatch(/G\s*B\s*D/i)
    expect(getLesson(5)?.theoryBite).toMatch(/C\s*E\s*G/i)
    expect(getLesson(6)?.theoryBite).toMatch(/D\s*F/i)
  })

  it('aligns phase boundaries with titles', () => {
    expect(getLesson(30)?.phase).toBe('basics')
    expect(getLesson(31)?.phase).toBe('chords')
    expect(getLesson(76)?.phase).toBe('scales')
    expect(getLesson(120)?.phase).toBe('scales')
    expect(getLesson(121)?.phase).toBe('rhythm')
    expect(getLesson(121)?.title).toMatch(/Rhythm|Pocket|Groove/i)
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
      expect(lesson?.title).not.toMatch(/- Day \d+$/)
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
    expect(mastery.some((m) => /tangible outcome:\s*a cleaner target section/i.test(m))).toBe(false)
    // review rework: doubled prefix / double period / autofill drill tail
    expect(mastery.some((m) => /On your song,\s*On your song/i.test(m))).toBe(false)
    expect(mastery.some((m) => /keeping\.\./i.test(m))).toBe(false)
    expect(mastery.some((m) => /^On your song,/i.test(m))).toBe(false)
  })

  it('bans bare keep-it-slow-and-clean drill tails', () => {
    for (const lesson of CURRICULUM) {
      for (const d of lesson.drills) {
        expect(d, `day ${lesson.day} drill`).not.toMatch(/keep it slow and clean/i)
      }
    }
  })

  it('uses per-day session coach without ego or speed stencil', () => {
    const teachCoaches: string[] = []
    const guidedCoaches: string[] = []
    const jamCoaches: string[] = []
    const arriveCoaches: string[] = []
    const warmCoaches: string[] = []
    const coolCoaches: string[] = []

    for (const lesson of CURRICULUM) {
      const segs = lesson.privateLesson.segments
      const blob = segs.map((s) => s.coach).join('\n')
      expect(blob.toLowerCase().includes('slower than your ego wants')).toBe(false)
      expect(blob.toLowerCase().includes('speed is a reward')).toBe(false)
      teachCoaches.push(segs.find((s) => s.id === 'teach')?.coach ?? '')
      guidedCoaches.push(segs.find((s) => s.id === 'guided')?.coach ?? '')
      jamCoaches.push(segs.find((s) => s.id === 'jam')?.coach ?? '')
      arriveCoaches.push(segs.find((s) => s.id === 'arrive')?.coach ?? '')
      warmCoaches.push(segs.find((s) => s.id === 'warmup')?.coach ?? '')
      coolCoaches.push(segs.find((s) => s.id === 'cooldown')?.coach ?? '')
    }

    expect(new Set(teachCoaches).size).toBe(365)
    expect(new Set(guidedCoaches).size).toBe(365)
    expect(new Set(jamCoaches).size).toBe(365)
    expect(new Set(arriveCoaches).size).toBeGreaterThan(100)
    expect(new Set(warmCoaches).size).toBeGreaterThan(100)
    expect(new Set(coolCoaches).size).toBeGreaterThan(100)

    const teach1 = getLesson(1)?.privateLesson.segments.find((s) => s.id === 'teach')?.coach ?? ''
    const teach3 = getLesson(3)?.privateLesson.segments.find((s) => s.id === 'teach')?.coach ?? ''
    const guided365 =
      getLesson(365)?.privateLesson.segments.find((s) => s.id === 'guided')?.coach ?? ''
    expect(/E A D G B E|open string/i.test(teach1)).toBe(true)
    expect(/E minor|Em|E G B/i.test(teach3)).toBe(true)
    expect(/Capstone|Path Performance|Year/i.test(guided365)).toBe(true)
  })

  it('expands private-lesson GOLD hooks across the year', () => {
    const hooks = CURRICULUM.map((l) => l.privateLesson.hook.trim())
    expect(new Set(hooks).size).toBeGreaterThan(110)
    // weekly checkpoints should not all share one phase template line
    const weekly = [7, 35, 70, 98, 140, 182, 266, 322, 357].map((d) => getLesson(d)!)
    const weeklyHooks = new Set(weekly.map((l) => l.privateLesson.hook))
    expect(weeklyHooks.size).toBe(weekly.length)
    // hand hooks on early teaching days (not phase-template only)
    expect(getLesson(2)?.privateLesson.hook).toMatch(/pressure|day two/i)
    expect(getLesson(6)?.privateLesson.hook).toMatch(/D|campfire|loop/i)
    expect(getLesson(155)?.privateLesson.hook).toMatch(/click|honest|judge/i)
    expect(getLesson(263)?.masteryCheck).not.toMatch(/On your song/i)
    expect(getLesson(6)?.drills.join(' ')).not.toMatch(/keep it slow and clean/i)
  })

  it('resolves every libraryIds reference', () => {
    for (const lesson of CURRICULUM) {
      expect(lesson.libraryIds.length).toBeGreaterThan(0)
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
    expect(new Set(goals).size).toBe(365)
    expect(new Set(drills).size).toBe(365)
  })

  it('keeps theory bites unique enough (no mass clone pedagogy)', () => {
    const bites = CURRICULUM.map((l) => l.theoryBite.trim())
    expect(new Set(bites).size).toBe(365)
    expect(bites.every((b) => b.length >= 40)).toBe(true)
    // no stiff courseware openers
    expect(bites.some((b) => /^Demonstrate\b/i.test(b))).toBe(false)
    expect(CURRICULUM.some((l) => l.goals.some((g) => /^Prove\b/i.test(g)))).toBe(false)
    const hooks = CURRICULUM.map((l) => l.privateLesson.hook.trim())
    expect(new Set(hooks).size).toBeGreaterThan(110)
  })

  it('strips mechanical Day-N chrome from learner-facing strings', () => {
    const em = '\u2014'
    const en = '\u2013'
    const chrome = [
      /day\s+\d+\s+step\s+\d+/i,
      new RegExp(String.raw`Day\s+\d+\s+focus\s*` + em, 'i'),
      /^Day\s+\d+:\s*/m,
      /\(D\d+\.\d+\)/,
      new RegExp(em + String.raw`\s*Repertoire Day\b`, 'i'),
      /Advance your vehicle song through:/i,
      /Keep one measurable win \(cleaner bar, stabler tempo, or clearer form\)/i,
      /End the session with a performance-shaped take, not only drills/i,
      /Motor learning favors slow accurate loops of the sticky bar/i,
      new RegExp(String.raw`Section work aimed at .+\(5` + en + String.raw`8 focused minutes\)`, 'i'),
      /do it slowly for 60 seconds/i,
      /restart if time slips/i,
      // title-echo injections (review fix 1)
      /keep it slow and clean on /i,
      /keep it about /i,
      /finish the drills for /i,
      /\([^()]*day\s+\d+\)/i,
      /\(Week\s+\d+\)/i,
      new RegExp(String.raw`\(([^)]+)\)\s*\(\1\s*day\s+\d+\)`, 'i'),
    ]
    for (const lesson of CURRICULUM) {
      const blob = [
        lesson.title,
        lesson.theoryBite,
        lesson.masteryCheck,
        ...lesson.goals,
        ...lesson.drills,
      ].join('\n')
      for (const re of chrome) {
        expect(re.test(blob), `day ${lesson.day} matched ${re}`).toBe(false)
      }
    }
  })

  it('bans AI title-paste chrome and stiff courseware openers', () => {
    const guillemet = '\u00ab'
    const bans = [
      /Today'?s angle/i,
      new RegExp(String.raw`lens\s*` + guillemet, 'i'),
      new RegExp(String.raw`applied to\s*` + guillemet, 'i'),
      new RegExp(String.raw`focus\s*` + guillemet, 'i'),
      new RegExp(String.raw`Demonstrate\s*` + guillemet, 'i'),
      /pedagogical/i,
      /research shows/i,
      /research on ensemble/i,
      /motor learning favors/i,
    ]
    for (const lesson of CURRICULUM) {
      const blob = [
        lesson.title,
        lesson.theoryBite,
        lesson.masteryCheck,
        ...lesson.goals,
        ...lesson.drills,
        lesson.privateLesson.hook,
        lesson.privateLesson.teacherIntro,
        lesson.privateLesson.winCondition,
      ].join('\n')
      for (const re of bans) {
        expect(re.test(blob), `day ${lesson.day} matched voice ban ${re}`).toBe(false)
      }
      const body = [lesson.theoryBite, lesson.masteryCheck, ...lesson.goals, ...lesson.drills].join(
        '\n',
      )
      expect(/\(\d{1,3}\)/.test(body), `day ${lesson.day} has parenthetical day numbers`).toBe(
        false,
      )
    }
  })

  it('keeps Batch A days 1-30 in plain teacher voice', () => {
    const em = '\u2014'
    for (let day = 1; day <= 30; day++) {
      const lesson = getLesson(day)!
      expect(lesson.theoryBite.length).toBeGreaterThan(40)
      expect(lesson.masteryCheck.length).toBeGreaterThan(20)
      expect(lesson.masteryCheck).not.toMatch(/^Demonstrate\b/)
      const titleStem = lesson.title.split(em)[0].trim()
      if (titleStem.length >= 12) {
        expect(lesson.theoryBite.startsWith(titleStem)).toBe(false)
      }
      expect(lesson.privateLesson.teacherIntro).not.toMatch(/Private lesson \u2014 Day \d+/i)
    }
    expect(getLesson(3)?.theoryBite).toMatch(/E\s*G\s*B/i)
    expect(getLesson(4)?.theoryBite).toMatch(/G\s*B\s*D/i)
    expect(getLesson(5)?.theoryBite).toMatch(/C\s*E\s*G/i)
    expect(getLesson(6)?.theoryBite).toMatch(/D\s*F/i)
    expect(getLesson(1)?.libraryIds).not.toContain('sc-pent-min')
    expect(getLesson(11)?.libraryIds).toContain('sc-pent-min')
  })

  it('fattens rhythm and lead drills into observable multi-step actions', () => {
    for (const lesson of CURRICULUM) {
      if (lesson.phase !== 'rhythm' && lesson.phase !== 'lead') continue
      expect(lesson.drills.length, `day ${lesson.day} drill count`).toBeGreaterThanOrEqual(3)
      // average drill text should not be one-word stubs
      const avg =
        lesson.drills.reduce((n, d) => n + d.length, 0) / Math.max(1, lesson.drills.length)
      expect(avg, `day ${lesson.day} thin drills`).toBeGreaterThanOrEqual(36)
      expect(lesson.drills.every((d) => d.length >= 18), `day ${lesson.day} stub drill`).toBe(
        true,
      )
    }
  })

  it('writes unique repertoire lessons instead of slot-fill skeletons', () => {
    const rep = CURRICULUM.filter((l) => l.phase === 'repertoire')
    expect(rep.length).toBe(105)
    expect(rep.every((l) => !/Repertoire Day/i.test(l.title))).toBe(true)
    expect(new Set(rep.map((l) => l.goals.join('|'))).size).toBe(rep.length)
    expect(new Set(rep.map((l) => l.drills.join('|'))).size).toBe(rep.length)
    expect(new Set(rep.map((l) => l.theoryBite)).size).toBe(rep.length)
    // no mass shared mastery skeleton
    const skeletonHits = rep.filter((l) =>
      /cleaner target section, a stabler tempo map, or a keepable take slice/i.test(l.masteryCheck),
    )
    expect(skeletonHits.length).toBe(0)
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

  it('follows research-backed easy path order (music before overload)', () => {
    // First chord is Em (easy win), not F barre
    expect(getLesson(3)?.title).toMatch(/E Minor|Em/i)
    // Campfire set before first lead map
    expect(getLesson(6)?.title).toMatch(/D Major|Campfire/i)
    expect(getLesson(7)?.title).toMatch(/Jam|Em|G|C|D/i)
    // Pentatonic map after a week of chords/songs - not day 1
    expect(getLesson(11)?.title).toMatch(/Pentatonic/i)
    // Power chords before full F barre pressure
    expect(getLesson(14)?.title).toMatch(/Power/i)
    expect(getLesson(14)?.libraryIds).toContain('rf-power')
    expect(getLesson(14)?.libraryIds).not.toContain('sg-mary-had-a-little-lamb')
    // Fmaj7 gateway before full F heroics
    expect(getLesson(42)?.title).toMatch(/F Maj7|Fmaj7|Gateway/i)
    expect(getLesson(43)?.title).toMatch(/Full F|Barre|Strength/i)
    // No truncated titles
    const em = '\u2014'
    for (const lesson of CURRICULUM) {
      expect(lesson.title.trim().endsWith(em), `truncated title day ${lesson.day}`).toBe(false)
      expect(lesson.title).not.toMatch(new RegExp(em + '\\s*Raised\\s*$', 'i'))
    }
  })

  it('keeps theory bites teachably deep (not stub length)', () => {
    for (const lesson of CURRICULUM) {
      expect(
        lesson.theoryBite.trim().length,
        `day ${lesson.day} thin theory`,
      ).toBeGreaterThanOrEqual(80)
    }
    // Power / lydian accuracy anchors
    expect(getLesson(14)?.theoryBite).toMatch(/root|fifth|5th/i)
    expect(getLesson(88)?.title).toMatch(/Raised 4|Lydian/i)
    expect(getLesson(88)?.theoryBite).toMatch(/#4|raised 4/i)
    expect(getLesson(88)?.libraryIds).toContain('sc-lydian')
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

