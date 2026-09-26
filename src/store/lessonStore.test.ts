// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { dueLessons, localDate, nextReview, useLessonStore } from './lessonStore'

beforeEach(() => { useLessonStore.setState({ sessions: {} }); localStorage.clear() })

describe('lesson practice memory', () => {
  it('preserves independent lesson drafts and assessments across hydration', async () => {
    const store = useLessonStore.getState()
    store.update(3, { segment: 2, checked: { 'teach-0': true }, note: 'Clear Em' })
    store.assess(3, 'steady')
    store.update(4, { note: 'Slow G changes' })
    await useLessonStore.persist.rehydrate()
    expect(useLessonStore.getState().sessions[3]).toMatchObject({ segment: 2, checked: { 'teach-0': true }, note: 'Clear Em', confidence: 'steady' })
    expect(useLessonStore.getState().sessions[4].checked).toEqual({})
  })
  it('schedules calendar-day reviews over a month boundary', () => {
    const now = new Date(2026, 8, 30, 23, 30)
    expect(localDate(now)).toBe('2026-09-30')
    expect(nextReview('building', now)).toBe('2026-10-01')
    expect(nextReview('steady', now)).toBe('2026-10-03')
    expect(nextReview('ready', now)).toBe('2026-10-07')
  })
  it('offers oldest due reviews first and excludes future or unfinished sessions', () => {
    const base = { segment: 0, checked: {}, note: '' }
    expect(dueLessons({
      1: { ...base, reviewDue: '2026-09-26' },
      2: { ...base, reviewDue: '2026-09-25' },
      3: { ...base, reviewDue: '2026-09-27' },
      4: base,
    }, '2026-09-26')).toEqual([2, 1])
  })
})
