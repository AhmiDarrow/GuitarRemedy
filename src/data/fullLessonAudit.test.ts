/**
 * Full 365-day accuracy + quality + imagery audit.
 * Fails on real theory/diagram errors; reports quality gaps as expectations.
 */
import { describe, expect, it } from 'vitest'
import {
  CHORDS,
  STANDARD_TUNING,
  chordPitchClasses,
  getScale,
  noteToPc,
  parseChordSymbol,
  scalePitchClasses,
} from '../lib/theory'
import { CURRICULUM, getLesson, type Lesson } from './curriculum'
import { getLibraryItem } from './library'
import {
  OPEN_CHORD_SHAPES,
  analyzeDiagramAccuracy,
  diagramsForLesson,
  lessonTeachesOpenChord,
  libraryDiagramMatchesLesson,
  resolveLessonDiagram,
  type LessonDiagramSpec,
} from './lessonImagery'
import { isVisualDiagram } from '../components/LessonDiagram'

/** Neck kinds Learn actually paints (mirror LessonDiagram). */
const NECK_KINDS = new Set([
  'chord_shape',
  'open_strings',
  'scale_tones',
  'power_chord',
  'interval',
])

function specsFor(lesson: Lesson): LessonDiagramSpec[] {
  return diagramsForLesson({
    day: lesson.day,
    phase: lesson.phase,
    title: lesson.title,
    goals: lesson.goals,
    drills: lesson.drills,
    theoryBite: lesson.theoryBite,
    libraryIds: lesson.libraryIds,
  })
}

/** Known triad / seventh tone checks embedded in early theory bites. */
const THEORY_SPOTS: Array<{ day: number; mustMatch: RegExp; label: string }> = [
  { day: 3, mustMatch: /E\s*[·,]?\s*G\s*[·,]?\s*B/i, label: 'Em = E G B' },
  { day: 4, mustMatch: /G\s*[·,]?\s*B\s*[·,]?\s*D/i, label: 'G = G B D' },
  { day: 5, mustMatch: /C\s*[·,]?\s*E\s*[·,]?\s*G/i, label: 'C = C E G' },
  // ASCII # only (Unicode ♯ banned — theory engine uses #)
  { day: 6, mustMatch: /D\s*[·,]?\s*F#\s*[·,]?\s*A/i, label: 'D = D F# A' },
  { day: 10, mustMatch: /A\s*[·,]?\s*C#\s*[·,]?\s*E/i, label: 'A = A C# E' },
]

describe('full lesson + imagery audit', () => {
  it('every open chord shape is pitch-accurate vs theory', () => {
    for (const key of Object.keys(OPEN_CHORD_SHAPES)) {
      const shape = OPEN_CHORD_SHAPES[key]
      const parsed = parseChordSymbol(key)
      expect(parsed, `parse ${key}`).toBeTruthy()
      if (!parsed) continue
      const expectPcs = new Set(chordPitchClasses(parsed.root, parsed.chordId))
      const rootPc = noteToPc(parsed.root)
      let hasRoot = false
      shape.frets.forEach((f, s) => {
        if (f === 'x') return
        const pc = (((STANDARD_TUNING[s] + (f as number)) % 12) + 12) % 12
        expect(expectPcs.has(pc), `${key} s${s}f${f} → pc ${pc} not in chord`).toBe(true)
        if (pc === rootPc) hasRoot = true
      })
      expect(hasRoot, `${key} missing root`).toBe(true)
      expect(shape.rootString).toBeGreaterThanOrEqual(0)
      expect(shape.rootString).toBeLessThanOrEqual(5)
      // rootString must actually sound the root
      const rf = shape.frets[shape.rootString]
      expect(rf).not.toBe('x')
      const rootPcAt = (((STANDARD_TUNING[shape.rootString] + (rf as number)) % 12) + 12) % 12
      expect(rootPcAt, `${key} rootString does not sound root`).toBe(rootPc)
    }
  })

  it('every day 1–365: structure, uniqueness, library, private lesson', () => {
    expect(CURRICULUM).toHaveLength(365)
    const titles = new Set<string>()
    const mastery = new Set<string>()
    const goals = new Set<string>()
    const drills = new Set<string>()
    const bites = new Set<string>()

    for (let day = 1; day <= 365; day++) {
      const L = getLesson(day)
      expect(L, `missing day ${day}`).toBeTruthy()
      if (!L) continue
      expect(L.day).toBe(day)
      expect(L.title.trim().length).toBeGreaterThan(6)
      expect(L.goals.length).toBeGreaterThanOrEqual(2)
      expect(L.drills.length).toBeGreaterThanOrEqual(3)
      expect(L.theoryBite.trim().length).toBeGreaterThanOrEqual(24)
      expect(L.masteryCheck.trim().length).toBeGreaterThanOrEqual(15)
      expect(L.libraryIds.length).toBeGreaterThan(0)
      expect(L.privateLesson.segments.length).toBeGreaterThanOrEqual(5)
      expect(L.privateLesson.durationMin).toBeGreaterThanOrEqual(25)
      expect(L.durationMin).toBeGreaterThanOrEqual(20)

      // no Day-N chrome
      const blob = [L.title, L.theoryBite, L.masteryCheck, ...L.goals, ...L.drills].join('\n')
      expect(blob).not.toMatch(/—\s*Day\s+\d+/i)
      expect(blob).not.toMatch(/tangible repertoire outcome today/i)
      expect(blob).not.toMatch(/Day\s+\d+\s+focus\s*—/i)

      for (const id of L.libraryIds) {
        expect(getLibraryItem(id), `day ${day} bad library id ${id}`).toBeTruthy()
      }

      expect(titles.has(L.title), `dup title day ${day}: ${L.title}`).toBe(false)
      titles.add(L.title)
      expect(mastery.has(L.masteryCheck), `dup mastery day ${day}`).toBe(false)
      mastery.add(L.masteryCheck)
      const gk = L.goals.join('|')
      const dk = L.drills.join('|')
      expect(goals.has(gk), `dup goals day ${day}`).toBe(false)
      goals.add(gk)
      expect(drills.has(dk), `dup drills day ${day}`).toBe(false)
      drills.add(dk)
      expect(bites.has(L.theoryBite.trim()), `dup theory day ${day}`).toBe(false)
      bites.add(L.theoryBite.trim())
    }
    expect(titles.size).toBe(365)
  })

  it('phase boundaries match day numbers', () => {
    for (let d = 1; d <= 30; d++) expect(getLesson(d)!.phase).toBe('basics')
    for (let d = 31; d <= 75; d++) expect(getLesson(d)!.phase).toBe('chords')
    for (let d = 76; d <= 120; d++) expect(getLesson(d)!.phase).toBe('scales')
    for (let d = 121; d <= 180; d++) expect(getLesson(d)!.phase).toBe('rhythm')
    for (let d = 181; d <= 260; d++) expect(getLesson(d)!.phase).toBe('lead')
    for (let d = 261; d <= 365; d++) expect(getLesson(d)!.phase).toBe('repertoire')
  })

  it('early theory spot-checks stay accurate', () => {
    for (const spot of THEORY_SPOTS) {
      const bite = getLesson(spot.day)!.theoryBite
      expect(spot.mustMatch.test(bite), `day ${spot.day} ${spot.label}: ${bite}`).toBe(true)
    }
  })

  it('keeps easy-path anchors and teachable theory depth', () => {
    // Music before abstract overload; power before full F; no stub theory
    expect(getLesson(11)!.day).toBe(11)
    expect(getLesson(11)!.title).toMatch(/Pentatonic/i)
    expect(getLesson(14)!.libraryIds).toContain('rf-power')
    expect(getLesson(42)!.title).toMatch(/F Maj7|Gateway/i)
    expect(getLesson(43)!.title).toMatch(/Full F|Strength|Mercy/i)
    expect(getLesson(88)!.title).toMatch(/Lydian|Raised 4/i)
    expect(getLesson(88)!.libraryIds).toContain('sc-lydian')
    for (const L of CURRICULUM) {
      expect(L.theoryBite.trim().length, `day ${L.day} thin theory`).toBeGreaterThanOrEqual(80)
      expect(L.title.trim().endsWith('\u2014'), `day ${L.day} truncated title`).toBe(false)
    }
  })

  it('every diagram on every day is theory-accurate (resolve + analyze)', () => {
    const fails: string[] = []
    let total = 0
    let neck = 0
    let visual = 0
    for (let day = 1; day <= 365; day++) {
      const L = getLesson(day)!
      const list = specsFor(L)
      if (!list.length) fails.push(`day ${day}: zero diagrams`)
      for (const spec of list) {
        total++
        if (NECK_KINDS.has(spec.kind)) neck++
        if (isVisualDiagram(spec)) visual++
        try {
          const resolved = resolveLessonDiagram(spec)
          const report = analyzeDiagramAccuracy(resolved)
          if (!report.ok) fails.push(`day ${day} ${spec.id}: ${report.issues.join('; ')}`)
          // chrome must never appear in learner ascii
          if (/\b(verified|theory-engine|\bmit\b)\b/i.test(resolved.ascii)) {
            fails.push(`day ${day} ${spec.id}: chrome in ascii`)
          }
          // scale diagrams: every dot in scale
          if (spec.kind === 'scale_tones' && spec.root && spec.scaleId) {
            const pcs = new Set(scalePitchClasses(spec.root, spec.scaleId))
            const rootPc = noteToPc(spec.root)
            let roots = 0
            for (const d of resolved.dots) {
              if (d.muted) continue
              const pc = (((STANDARD_TUNING[d.string] + d.fret) % 12) + 12) % 12
              if (!pcs.has(pc)) fails.push(`day ${day} ${spec.id}: out-of-scale pc ${pc}`)
              if (d.isRoot) {
                if (pc !== rootPc) fails.push(`day ${day} ${spec.id}: bad root mark`)
                roots++
              }
            }
            if (roots === 0) fails.push(`day ${day} ${spec.id}: no root marks`)
            // scale id must exist
            expect(getScale(spec.scaleId).id).toBeTruthy()
          }
          // chord diagrams: claimed pcs ⊆ chord tones when parseable
          if (spec.kind === 'chord_shape' && spec.chord) {
            const parsed = parseChordSymbol(spec.chord)
            if (parsed) {
              const expectPcs = new Set(chordPitchClasses(parsed.root, parsed.chordId))
              for (const pc of resolved.claimedPcs) {
                if (!expectPcs.has(pc)) {
                  fails.push(`day ${day} ${spec.id}: claimed ${pc} not in ${spec.chord}`)
                }
              }
            }
          }
          // power chord: only root + fifth
          if (spec.kind === 'power_chord') {
            const root = noteToPc(spec.root ?? 'A')
            const fifth = (root + 7) % 12
            for (const d of resolved.dots) {
              if (d.muted) continue
              const pc = (((STANDARD_TUNING[d.string] + d.fret) % 12) + 12) % 12
              if (pc !== root && pc !== fifth) {
                fails.push(`day ${day} ${spec.id}: power has non R/5 pc ${pc}`)
              }
            }
          }
        } catch (e) {
          fails.push(`day ${day} ${spec.id}: throw ${e}`)
        }
      }
    }
    expect(total).toBeGreaterThan(400)
    expect(neck).toBeGreaterThan(180)
    expect(visual).toBe(neck)
    expect(fails.slice(0, 40), fails.slice(0, 40).join('\n') || 'ok').toEqual([])
  })

  it('rhythm/lead drills stay fat enough for a real session', () => {
    const thin: string[] = []
    for (const L of CURRICULUM) {
      if (L.phase !== 'rhythm' && L.phase !== 'lead') continue
      const avg = L.drills.reduce((n, d) => n + d.length, 0) / L.drills.length
      if (avg < 36) thin.push(`day ${L.day} avg drill ${avg.toFixed(1)}`)
      if (L.drills.some((d) => d.trim().length < 20)) thin.push(`day ${L.day} stub drill`)
    }
    expect(thin, thin.join('; ')).toEqual([])
  })

  it('repertoire days are not slot-fill skeletons', () => {
    const bad: string[] = []
    const masterySnips = new Map<string, number>()
    for (const L of CURRICULUM) {
      if (L.phase !== 'repertoire') continue
      // mastery should mention something concrete, not generic outcome spam
      if (/tangible (repertoire )?outcome/i.test(L.masteryCheck)) bad.push(`day ${L.day} stencil mastery`)
      if (/Advance your vehicle song/i.test(L.goals.join(' '))) bad.push(`day ${L.day} vehicle stencil`)
      const snip = L.masteryCheck.slice(0, 48).toLowerCase()
      masterySnips.set(snip, (masterySnips.get(snip) ?? 0) + 1)
    }
    for (const [snip, n] of masterySnips) {
      if (n >= 8) bad.push(`mastery prefix reused ${n}×: ${snip}`)
    }
    expect(bad.slice(0, 20), bad.join('\n')).toEqual([])
  })

  it('diagram keyword hits match lesson topic when a named open chord is the focus', () => {
    // If title clearly is about Em/G/C/D/Am, a matching chord_shape must appear
    const checks: Array<{ day: number; chord: string }> = []
    for (const L of CURRICULUM) {
      const t = L.title
      const m = /\b(Em|Am|Dm|B7)\b/.exec(t) || /\b([ACDEFG])\s+major\b/i.exec(t)
      if (!m) continue
      let chord = m[1]
      if (/major/i.test(t) && chord.length === 1) {
        /* keep */
      } else if (['Em', 'Am', 'Dm', 'B7'].includes(chord)) {
        /* keep */
      } else continue
      // normalize "G major" → G
      if (/major/i.test(m[0]) && chord.length === 1) chord = chord.toUpperCase()
      checks.push({ day: L.day, chord })
    }
    const fails: string[] = []
    for (const { day, chord } of checks.slice(0, 80)) {
      const list = specsFor(getLesson(day)!)
      const hit = list.some(
        (s) => s.kind === 'chord_shape' && (s.chord === chord || s.title.includes(chord)),
      )
      if (!hit) fails.push(`day ${day} title wants ${chord} but diagrams: ${list.map((s) => s.kind + ':' + (s.chord ?? s.title)).join(', ')}`)
    }
    expect(fails.slice(0, 25), fails.join('\n')).toEqual([])
  })

  it('visual gallery coverage by phase is honest (report thresholds)', () => {
    const byPhase: Record<string, { days: number; withVisual: number }> = {}
    for (const L of CURRICULUM) {
      const b = (byPhase[L.phase] ??= { days: 0, withVisual: 0 })
      b.days++
      const list = specsFor(L)
      if (list.some((s) => isVisualDiagram(s))) b.withVisual++
    }
    // Basics: open strings / early chords — most days get a neck figure
    expect(byPhase.basics.withVisual / byPhase.basics.days).toBeGreaterThan(0.7)
    // Chords/scales/lead: only when the lesson actually names a shape/scale (no fake fallbacks)
    expect(byPhase.chords.withVisual / byPhase.chords.days).toBeGreaterThan(0.35)
    expect(byPhase.scales.withVisual / byPhase.scales.days).toBeGreaterThan(0.35)
    expect(byPhase.rhythm.withVisual).toBeGreaterThan(5)
    expect(byPhase.lead.withVisual / byPhase.lead.days).toBeGreaterThan(0.25)
  })

  it('no diagram claims CHORDS catalog mismatch for common symbols', () => {
    for (const sym of ['maj', 'min', '7', 'maj7', 'min7', 'dim', 'aug', 'sus2', 'sus4', '5'] as const) {
      expect(CHORDS[sym], sym).toBeTruthy()
    }
  })

  it('bans unicode accidentals and mechanical drill chrome in curriculum', () => {
    for (const L of CURRICULUM) {
      const blob = [L.title, L.theoryBite, L.masteryCheck, ...L.goals, ...L.drills].join('\n')
      expect(blob.includes('♯') || blob.includes('♭'), `day ${L.day} unicode accidental`).toBe(false)
      expect(/do it slowly for 60 seconds/i.test(blob), `day ${L.day} drill chrome`).toBe(false)
    }
  })

  it('library-linked diagrams appear only when lesson copy matches the link', () => {
    let linked = 0
    const bad: string[] = []
    for (const L of CURRICULUM) {
      const neckIds = (L.libraryIds ?? []).filter(
        (id) => id.startsWith('ch-') || id.startsWith('sc-'),
      )
      if (!neckIds.length) continue
      const list = specsFor(L)
      // Match against teaching copy only — never libraryIds (ids self-match ch-a7 etc.)
      const blob = [L.title, ...L.goals, ...L.drills, L.theoryBite, L.masteryCheck].join(' ')
      for (const id of neckIds) {
        const hasLibFig = list.some((s) => s.id.includes(`-lib-${id}`))
        const should = libraryDiagramMatchesLesson(id, blob)
        if (!should) {
          bad.push(`day ${L.day} keeps unmatched library id ${id}`)
          continue
        }
        if (!hasLibFig) {
          bad.push(`day ${L.day} should show lib diagram for ${id}`)
          continue
        }
        linked++
      }
    }
    expect(bad.slice(0, 15), bad.slice(0, 15).join(' | ')).toEqual([])
    expect(linked).toBeGreaterThan(30)
  })

  it('day 1 has no scale diagram and no sc-pent-min link', () => {
    const L = getLesson(1)!
    expect(L.libraryIds).not.toContain('sc-pent-min')
    const list = specsFor(L)
    expect(list.some((s) => s.kind === 'scale_tones')).toBe(false)
    expect(list.some((s) => /pent/i.test(s.title))).toBe(false)
  })

  it('every day 1–365: neck diagrams only when the lesson teaches them', () => {
    const bad: string[] = []
    for (const L of CURRICULUM) {
      const blob = [L.title, L.theoryBite, ...L.goals, ...L.drills, L.masteryCheck]
        .join('\n')
        .toLowerCase()
        .replace(/[–—]/g, '-')
      const list = specsFor(L)

      for (const s of list) {
        if (s.kind === 'scale_tones') {
          const teaches =
            /pent|scale|mode|box\s*1|lead map|blues scale|harmonic minor|melodic minor|dorian|mixo|lydian|phrygian(?!-ish)|locrian|aeolian|ionian|natural minor|major scale/.test(
              blob,
            )
          if (!teaches) bad.push(`day ${L.day} scale "${s.title}" without scale teaching`)
          // Never show mode necks for "-ish" flavor asides only
          if (/phrygian-ish|dorian-ish|lydian-ish/.test(blob) && !/\bphrygian\b(?!-ish)/.test(blob)) {
            if (/phrygian/i.test(s.title)) bad.push(`day ${L.day} phrygian neck from -ish aside`)
          }
        }
        if (s.kind === 'power_chord') {
          const teachesPower =
            /power\s*chord|movable\s+power|root\s*\+?\s*fifth/.test(blob) ||
            (/\b5\s*chords?\b/.test(blob) && !/palm\s*mute|mute craft/.test(blob))
          if (!teachesPower) bad.push(`day ${L.day} power chord without power-chord teaching`)
        }
        if (s.kind === 'chord_shape' && s.chord) {
          // Must teach the shape — letter inside "notes E G B" is not enough
          if (!lessonTeachesOpenChord(s.chord, blob)) {
            bad.push(`day ${L.day} chord ${s.chord} not taught as a shape`)
          }
        }
      }

      // Stale ch-/sc- library links that fail the match gate
      for (const id of L.libraryIds) {
        if (!/^(ch-|sc-)/.test(id)) continue
        const teachText = [L.title, ...L.goals, ...L.drills, L.theoryBite, L.masteryCheck].join(' ')
        if (!libraryDiagramMatchesLesson(id, teachText)) {
          bad.push(`day ${L.day} stale library link ${id}`)
        }
      }
    }
    expect(bad.slice(0, 40), bad.slice(0, 40).join('\n')).toEqual([])
  })

  it('day 24 mute craft is not a power-chord diagram day', () => {
    const list = specsFor(getLesson(24)!)
    expect(list.some((s) => s.kind === 'power_chord')).toBe(false)
  })

  it('day 48 Andalusian shows chords not Phrygian scale', () => {
    const list = specsFor(getLesson(48)!)
    expect(list.some((s) => s.kind === 'scale_tones')).toBe(false)
    expect(list.some((s) => s.kind === 'chord_shape' && s.chord === 'Am')).toBe(true)
  })
})
