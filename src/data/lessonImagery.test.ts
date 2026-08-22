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
      license: 'MIT · GuitarRemedy original',
      verifiedBy: 'theory-engine',
    })
    expect(resolved.dots.every((m) => m.fret === 0)).toBe(true)
    expect(resolved.dots).toHaveLength(6)
    const report = analyzeDiagramAccuracy(resolved)
    expect(report.ok, report.issues.join('; ')).toBe(true)
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
        license: 'MIT · GuitarRemedy original',
        verifiedBy: 'theory-engine',
      })
      const report = analyzeDiagramAccuracy(resolved)
      expect(report.ok, `${chord}: ${report.issues.join('; ')}`).toBe(true)
      // sounded frets only
      const sounded = resolved.dots.filter((d) => !d.muted)
      expect(sounded.length).toBeGreaterThan(0)
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
        license: 'MIT · GuitarRemedy original',
        verifiedBy: 'theory-engine',
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
        license: 'MIT · GuitarRemedy original',
        verifiedBy: 'theory-engine',
        root: 'C',
        semitones: 4,
      })
      const report = analyzeDiagramAccuracy(resolved)
      expect(report.ok, `${kind}: ${report.issues.join('; ')}`).toBe(true)
    }
  })

  it('every curriculum day resolves only verified, accurate diagrams', () => {
    expect(CURRICULUM).toHaveLength(365)
    let withArt = 0
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
        expect(d.verifiedBy).toBe('theory-engine')
        expect((d.license ?? '').toLowerCase()).toMatch(/mit|cc0|public domain/)
        const resolved = resolveLessonDiagram(d)
        const report = analyzeDiagramAccuracy(resolved)
        expect(report.ok, `day ${day} ${d.id}: ${report.issues.join('; ')}`).toBe(true)
      }
      if (list.length) withArt++
    }
    expect(withArt).toBe(365)
  })

  it('day 1–7 include posture or open-string or Em chord art', () => {
    const d1 = diagramsForLesson({
      day: 1,
      phase: 'basics',
      title: getLesson(1)!.title,
      goals: getLesson(1)!.goals,
      drills: getLesson(1)!.drills,
      theoryBite: getLesson(1)!.theoryBite,
    }).map((d) => d.kind)
    expect(d1).toContain('open_strings')
    expect(d1).toContain('posture')

    const d3 = diagramsForLesson({
      day: 3,
      phase: 'basics',
      title: getLesson(3)!.title,
      goals: getLesson(3)!.goals,
      drills: getLesson(3)!.drills,
      theoryBite: getLesson(3)!.theoryBite,
    })
    expect(d3.some((d) => d.kind === 'chord_shape' && /em/i.test(d.chord ?? d.title))).toBe(true)
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
      license: 'MIT · GuitarRemedy original',
      verifiedBy: 'theory-engine',
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
