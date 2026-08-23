import { describe, expect, it } from 'vitest'
import { CURRICULUM, getLesson } from './curriculum'
import {
  diagramsForLesson,
  lessonTeachesOpenChord,
  libraryDiagramMatchesLesson,
} from './lessonImagery'

function teachBlob(L: (typeof CURRICULUM)[0]) {
  return [L.title, ...L.goals, ...L.drills, L.theoryBite, L.masteryCheck].join('\n')
}

function specsFor(L: (typeof CURRICULUM)[0]) {
  return diagramsForLesson({
    day: L.day,
    phase: L.phase,
    title: L.title,
    goals: L.goals,
    drills: L.drills,
    theoryBite: L.theoryBite,
    libraryIds: L.libraryIds,
  })
}

describe('chord diagram truth — no untaught open shapes', () => {
  it('every chord_shape passes lessonTeachesOpenChord on teaching copy', () => {
    const bad: string[] = []
    for (const L of CURRICULUM) {
      const blob = teachBlob(L)
      for (const s of specsFor(L)) {
        if (s.kind !== 'chord_shape' || !s.chord) continue
        if (!lessonTeachesOpenChord(s.chord, blob)) {
          bad.push(`day ${L.day} shows ${s.chord} (${s.id}) but gate is false — "${L.title}"`)
        }
      }
      for (const id of L.libraryIds ?? []) {
        if (!id.startsWith('ch-')) continue
        if (!libraryDiagramMatchesLesson(id, blob)) {
          bad.push(`day ${L.day} stale library chord link ${id}`)
        }
      }
    }
    expect(bad.slice(0, 40), bad.slice(0, 40).join('\n')).toEqual([])
  })

  it('does not unlock Open G from E7-only copy or glued "/g shape" token', () => {
    // Regression: "...e7/g shape" used to match the bare "g shape" rule via a weak boundary.
    expect(lessonTeachesOpenChord('G', 'Practice the E7 shape today. Stay on dominant color only.')).toBe(false)
    expect(lessonTeachesOpenChord('G', 'notes E G B make an Em triad — not a major-G fretting day.')).toBe(
      false,
    )
    // Real pair teaching still unlocks G (Focus E7/G, E7→G, E7 and G)
    expect(
      lessonTeachesOpenChord(
        'G',
        'Change Speed Ladder — Focus E7/G. Shape E7 and G from memory. E7→G in half notes.',
      ),
    ).toBe(true)
  })

  it('day 3 is Em only — no Open G/C/D from triad letters', () => {
    const list = specsFor(getLesson(3)!)
    const chords = list.filter((s) => s.kind === 'chord_shape').map((s) => s.chord)
    expect(chords).toContain('Em')
    expect(chords).not.toContain('G')
    expect(chords).not.toContain('C')
    expect(chords).not.toContain('D')
    expect(chords).not.toContain('E')
  })

  it('day 1–2 have no chord_shape diagrams', () => {
    for (const d of [1, 2]) {
      const list = specsFor(getLesson(d)!)
      expect(
        list.filter((s) => s.kind === 'chord_shape'),
        `day ${d}`,
      ).toEqual([])
    }
  })

  it('day 74 teaches E7 and G together', () => {
    const list = specsFor(getLesson(74)!)
    const chords = list.filter((s) => s.kind === 'chord_shape').map((s) => s.chord)
    expect(chords).toContain('E7')
    expect(chords).toContain('G')
  })
})
