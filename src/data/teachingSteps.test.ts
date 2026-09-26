import { expect, it } from 'vitest'
import { CURRICULUM, getLesson } from './curriculum'
import { teachingSteps, termsForLesson } from './teachingSteps'

it('breaks the first two weeks into short, individually actionable instructions', () => {
  for (const lesson of CURRICULUM.slice(0, 14)) {
    const steps = teachingSteps(lesson)
    expect(steps).toHaveLength(4)
    expect(new Set(steps.map(s => s.title)).size).toBe(4)
    for (const step of steps) {
      expect(step.instruction.length).toBeGreaterThan(30)
      expect(step.instruction.length).toBeLessThan(330)
    }
  }
})

it('preserves every later lesson drill in its guided steps', () => {
  for (const lesson of CURRICULUM.slice(14)) {
    expect(teachingSteps(lesson).map(s => s.instruction)).toEqual(lesson.drills)
  }
})

it('teaches the three-finger Am-to-E move without the incorrect Em shortcut', () => {
  const lesson = getLesson(8)!
  const allCopy = [lesson.theoryBite, ...lesson.drills, ...lesson.privateLesson.segments.map(s => s.coach), ...teachingSteps(lesson).map(s => s.instruction)].join(' ')
  expect(allCopy).not.toMatch(/Am as Em slid/)
  expect(teachingSteps(lesson)[0].instruction).toContain('index on B fret 1')
  expect(teachingSteps(lesson)[1].instruction).toContain('index to G fret 1')
})

it('explains counting for rhythm and roots for pentatonic lessons', () => {
  expect(termsForLesson(getLesson(9)!).map(t => t.term)).toContain('Bar')
  expect(termsForLesson(getLesson(11)!).map(t => t.term)).toContain('Pentatonic')
  expect(termsForLesson(getLesson(1)!).map(t => t.term)).not.toContain('Power chord')
})
