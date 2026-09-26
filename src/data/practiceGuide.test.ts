import { expect, it } from 'vitest'
import { CURRICULUM } from './curriculum'
import { practiceGuide } from './practiceGuide'

it('gives every lesson a practice example, listening cue, and smaller step', () => {
  for (const lesson of CURRICULUM) {
    const guide = practiceGuide(lesson)
    expect(guide.example.length).toBeGreaterThan(40)
    expect(guide.listen.length).toBeGreaterThan(40)
    expect(guide.rescue.length).toBeGreaterThan(40)
    expect(lesson.privateLesson.segments.reduce((sum, s) => sum + s.minutes, 0)).toBe(lesson.privateLesson.durationMin)
    expect(lesson.privateLesson.segments.every(s => s.minutes > 0)).toBe(true)
    expect(lesson.privateLesson.segments.find(s => s.id === 'teach')?.coach).toContain(lesson.theoryBite)
  }
})

it('keeps day one on open strings before fretting is introduced', () => {
  const day = CURRICULUM[0]
  expect(day.privateLesson.segments.find(s => s.id === 'warmup')?.youDo.join(' ')).not.toContain('frets 1–4')
  expect(day.privateLesson.segments.find(s => s.id === 'jam')?.youDo[0]).toContain('open strings')
})
