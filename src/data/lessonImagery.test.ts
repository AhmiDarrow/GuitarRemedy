import { describe, expect, it } from 'vitest'
import {
  CHORDS,
  STANDARD_TUNING,
  chordPitchClasses,
  getScale,
  noteToPc,
  scalePitchClasses,
} from '../lib/theory'
import { CURRICULUM, getLesson } from './curriculum'
import {
  OPEN_CHORD_SHAPES,
  OPEN_STRING_LABELS_LOW_TO_HIGH,
  allOpenShapeKeys,
  analyzeDiagramAccuracy,
  assertOpenShapeAccurate,
  diagramsForLesson,
  dotsToAsciiTab,
  lessonTeachesOpenChord,
  libraryDiagramMatchesLesson,
  resolveLessonDiagram,
} from './lessonImagery'

describe('lesson imagery — free license + accuracy', () => {
  it('open-string labels match STANDARD_TUNING pitch classes (low→high)', () => {
    expect([...OPEN_STRING_LABELS_LOW_TO_HIGH]).toEqual(['E', 'A', 'D', 'G', 'B', 'e'])
    const namePc: Record<string, number> = {
      C: 0,
      D: 2,
      E: 4,
      F: 5,
      G: 7,
      A: 9,
      B: 11,
    }
    for (let s = 0; s < 6; s++) {
      const pc = ((STANDARD_TUNING[s] % 12) + 12) % 12
      const label = OPEN_STRING_LABELS_LOW_TO_HIGH[s]
      const expected = label === 'e' ? 'E' : label
      expect(pc).toBe(namePc[expected])
    }
  })

  it('open-strings diagram frets are all open and pitch-accurate', () => {
    const resolved = resolveLessonDiagram({
      id: 'test-open',
      kind: 'open_strings',
      title: 'Open strings',
    })
    expect(resolved.dots.every((m) => m.fret === 0)).toBe(true)
    expect(resolved.dots).toHaveLength(6)
    expect(resolved.ascii).toMatch(/e\|/)
    expect(resolved.ascii).toMatch(/E\|/)
    const report = analyzeDiagramAccuracy(resolved)
    expect(report.ok, report.issues.join('; ')).toBe(true)
  })

  it('Em open shape renders a plain ASCII tab block', () => {
    const resolved = resolveLessonDiagram({
      id: 'test-em-ascii',
      kind: 'chord_shape',
      title: 'Em',
      chord: 'Em',
    })
    const ascii = dotsToAsciiTab(resolved.dots, 'Em')
    expect(ascii).toContain('e|-0')
    expect(ascii).toContain('E|-0')
    expect(resolved.ascii).toContain('e|')
    // no license chrome in ascii payload
    expect(resolved.ascii.toLowerCase()).not.toMatch(/mit|verified|theory-engine/)
  })

  it('every catalog open shape is theory-accurate', () => {
    for (const key of allOpenShapeKeys()) {
      const a = assertOpenShapeAccurate(key)
      expect(a.ok, a.detail).toBe(true)
      const shape = OPEN_CHORD_SHAPES[key]
      expect(shape.frets).toHaveLength(6)
    }
  })

  it('Em / G / C / D open shapes match chord pitch classes', () => {
    for (const chord of ['Em', 'G', 'C', 'D', 'Am', 'A', 'E', 'Dm'] as const) {
      const resolved = resolveLessonDiagram({
        id: `test-${chord}`,
        kind: 'chord_shape',
        title: chord,
        chord,
      })
      const report = analyzeDiagramAccuracy(resolved)
      expect(report.ok, `${chord}: ${report.issues.join('; ')}`).toBe(true)
      // sounded frets only
      const sounded = resolved.dots.filter((d) => !d.muted)
      expect(sounded.length).toBeGreaterThan(0)
    }
  })

  it('scale_tones without scaleId never invents minor pentatonic', () => {
    const resolved = resolveLessonDiagram({
      id: 'scale-missing-id',
      kind: 'scale_tones',
      title: 'Unspecified scale',
      root: 'C',
      frets: 5,
    })
    expect(resolved.spec.scaleId ?? 'major').not.toBe('minor_pentatonic')
    // Default teaching fallback is major — not the rock box
    const majorPcs = new Set(scalePitchClasses('C', 'major'))
    for (const d of resolved.dots) {
      if (d.muted) continue
      const midi = STANDARD_TUNING[d.string] + d.fret
      const pc = ((midi % 12) + 12) % 12
      expect(majorPcs.has(pc)).toBe(true)
    }
  })

  it('scale tone diagrams only place in-scale tones and mark roots', () => {
    for (const [root, scaleId] of [
      ['A', 'minor_pentatonic'],
      ['C', 'major'],
      ['E', 'blues'],
      ['G', 'major_pentatonic'],
      ['A', 'natural_minor'],
    ] as const) {
      const resolved = resolveLessonDiagram({
        id: `scale-${root}-${scaleId}`,
        kind: 'scale_tones',
        title: `${root} ${scaleId}`,
        root,
        scaleId,
        frets: 5,
      })
      const report = analyzeDiagramAccuracy(resolved)
      expect(report.ok, `${root} ${scaleId}: ${report.issues.join('; ')}`).toBe(true)
      const pcs = new Set(scalePitchClasses(root, scaleId))
      const rootPc = noteToPc(root)
      let roots = 0
      for (const m of resolved.dots) {
        const midi = STANDARD_TUNING[m.string] + m.fret
        const pc = ((midi % 12) + 12) % 12
        expect(pcs.has(pc)).toBe(true)
        if (m.isRoot) {
          expect(pc).toBe(rootPc)
          roots++
        }
      }
      expect(roots).toBeGreaterThan(0)
      expect(getScale(scaleId).id).toBeTruthy()
    }
  })

  it('posture / finger / rhythm / caged resolve without false frets', () => {
    for (const kind of ['posture', 'finger_numbers', 'rhythm_grid', 'caged_map'] as const) {
      const resolved = resolveLessonDiagram({
        id: `t-${kind}`,
        kind,
        title: kind,
        root: 'C',
        semitones: 4,
      })
      const report = analyzeDiagramAccuracy(resolved)
      expect(report.ok, `${kind}: ${report.issues.join('; ')}`).toBe(true)
    }
  })

  it('every curriculum day resolves accurate diagrams; neck kinds cover most days', () => {
    expect(CURRICULUM).toHaveLength(365)
    const neckKinds = new Set([
      'chord_shape',
      'open_strings',
      'scale_tones',
      'power_chord',
      'interval',
    ])
    let withArt = 0
    let withNeck = 0
    for (let day = 1; day <= 365; day++) {
      const lesson = getLesson(day)!
      const list = diagramsForLesson({
        day: lesson.day,
        phase: lesson.phase,
        title: lesson.title,
        goals: lesson.goals,
        drills: lesson.drills,
        theoryBite: lesson.theoryBite,
        libraryIds: lesson.libraryIds,
      })
      for (const d of list) {
        const resolved = resolveLessonDiagram(d)
        expect(resolved.ascii.toLowerCase()).not.toMatch(/\bverified\b|theory-engine/)
        const report = analyzeDiagramAccuracy(resolved)
        expect(report.ok, `day ${day} ${d.id}: ${report.issues.join('; ')}`).toBe(true)
      }
      if (list.length) withArt++
      if (list.some((d) => neckKinds.has(d.kind))) withNeck++
    }
    expect(withArt).toBe(365)
    // Neck figures only when taught — empty gallery beats wrong pentatonic
    expect(withNeck).toBeGreaterThan(100)
  })

  it('day 1–7 include posture or open-string or Em chord art', () => {
    const L1 = getLesson(1)!
    const d1specs = diagramsForLesson({
      day: 1,
      phase: 'basics',
      title: L1.title,
      goals: L1.goals,
      drills: L1.drills,
      theoryBite: L1.theoryBite,
      libraryIds: L1.libraryIds,
    })
    const d1 = d1specs.map((d) => d.kind)
    expect(d1).toContain('open_strings')
    expect(d1).toContain('posture')
    // Never scare day-1 with unmentioned scales (even if a bad library id sneaks in)
    expect(d1specs.some((d) => d.kind === 'scale_tones')).toBe(false)
    expect(d1specs.some((d) => /pent/i.test(d.title))).toBe(false)
    expect(L1.libraryIds).not.toContain('sc-pent-min')

    const L3 = getLesson(3)!
    const d3 = diagramsForLesson({
      day: 3,
      phase: 'basics',
      title: L3.title,
      goals: L3.goals,
      drills: L3.drills,
      theoryBite: L3.theoryBite,
      libraryIds: L3.libraryIds,
    })
    expect(d3.some((d) => d.kind === 'chord_shape' && /em/i.test(d.chord ?? d.title))).toBe(true)
    // Triad spelling "E G B" must not unlock Open G on the Em day
    expect(d3.some((d) => d.kind === 'chord_shape' && /^g$/i.test(d.chord ?? ''))).toBe(false)
    expect(d3.some((d) => /open g/i.test(d.title))).toBe(false)
  })

  it('triad spelling alone does not teach Open G / Open C', () => {
    expect(libraryDiagramMatchesLesson('ch-g', 'E minor is the notes E G B. Open Em chord.')).toBe(
      false,
    )
    expect(libraryDiagramMatchesLesson('ch-g', 'Form a clear open G and change Em to G')).toBe(true)
    expect(libraryDiagramMatchesLesson('ch-c', 'notes C E G in the triad')).toBe(false)
    expect(libraryDiagramMatchesLesson('ch-c', 'Form open C without choking')).toBe(true)
  })

  it('English am / a chord never unlock Am or Open A', () => {
    // "I am" / "you are" style prose after lowercasing
    expect(lessonTeachesOpenChord('Am', 'I am learning bends today. Target pitch.')).toBe(false)
    expect(lessonTeachesOpenChord('Am', 'you am not a chord day')).toBe(false)
    expect(lessonTeachesOpenChord('Am', 'Form open Am and change Am to G')).toBe(true)
    expect(lessonTeachesOpenChord('Am', 'A minor shape — two fingers')).toBe(true)
    expect(lessonTeachesOpenChord('Am', 'Andalusian cadence Am G F E')).toBe(true)

    // Bare "a chord" means any chord, not Open A major
    expect(lessonTeachesOpenChord('A', 'Play a chord cleanly and hold it')).toBe(false)
    expect(lessonTeachesOpenChord('A', '1 e & a subdivision clinic')).toBe(false)
    expect(lessonTeachesOpenChord('A', 'Form open A and change A to D')).toBe(true)
    expect(lessonTeachesOpenChord('A', 'A major shape on frets 0–2')).toBe(true)

    // Same class of bug for E / G / C bare "x chord"
    expect(lessonTeachesOpenChord('E', 'mute a chord with the palm')).toBe(false)
    expect(lessonTeachesOpenChord('G', 'notes E G B only')).toBe(false)
    expect(lessonTeachesOpenChord('C', 'notes C E G in the triad')).toBe(false)
  })

  it('no false Am / Open A necks across the full curriculum', () => {
    const bad: string[] = []
    for (const L of CURRICULUM) {
      const list = diagramsForLesson({
        day: L.day,
        phase: L.phase,
        title: L.title,
        goals: L.goals,
        drills: L.drills,
        theoryBite: L.theoryBite,
        libraryIds: L.libraryIds,
      })
      const blob = [L.title, ...L.goals, ...L.drills, L.theoryBite, L.masteryCheck].join(' ')
      for (const d of list) {
        if (d.kind !== 'chord_shape' || !d.chord) continue
        if (!lessonTeachesOpenChord(d.chord, blob)) {
          bad.push(`day ${L.day} ${d.chord} :: ${L.title}`)
        }
      }
    }
    expect(bad.slice(0, 20), bad.slice(0, 20).join('\n')).toEqual([])
  })

  it('library neck diagrams require matching lesson copy', () => {
    expect(libraryDiagramMatchesLesson('sc-pent-min', 'open strings only')).toBe(false)
    expect(libraryDiagramMatchesLesson('sc-pent-min', 'minor pentatonic box 1')).toBe(true)
    expect(libraryDiagramMatchesLesson('ch-em', 'first clean sounds')).toBe(false)
    expect(libraryDiagramMatchesLesson('ch-em', 'form open Em with two fingers')).toBe(true)

    // Even with a bad library id, day 1 must not show pentatonic
    const sneaky = diagramsForLesson({
      day: 1,
      phase: 'basics',
      title: 'Meet the Guitar',
      goals: ['Name open strings'],
      drills: ['Pluck open strings'],
      theoryBite: 'Standard tuning E A D G B E',
      libraryIds: ['sc-pent-min', 'rf-spider'],
    })
    expect(sneaky.some((d) => d.id.includes('sc-pent-min'))).toBe(false)
    expect(sneaky.some((d) => d.kind === 'scale_tones')).toBe(false)
  })

  it('chord catalog intervals stay consistent with CHORDS table', () => {
    expect(CHORDS.min.intervals).toEqual([0, 3, 7])
    expect(CHORDS.maj.intervals).toEqual([0, 4, 7])
    expect(chordPitchClasses('E', 'min').sort((a, b) => a - b)).toEqual([4, 7, 11])
    expect(chordPitchClasses('G', 'maj').sort((a, b) => a - b)).toEqual([2, 7, 11])
  })

  it('power chord is root + fifth only', () => {
    const resolved = resolveLessonDiagram({
      id: 'p5',
      kind: 'power_chord',
      title: 'A5',
      root: 'A',
    })
    const report = analyzeDiagramAccuracy(resolved)
    expect(report.ok, report.issues.join('; ')).toBe(true)
    const pcs = new Set(
      resolved.dots.map((d) => ((STANDARD_TUNING[d.string] + d.fret) % 12 + 12) % 12),
    )
    expect(pcs.has(noteToPc('A'))).toBe(true)
    expect(pcs.has((noteToPc('A') + 7) % 12)).toBe(true)
    expect(pcs.size).toBe(2)
  })
})
