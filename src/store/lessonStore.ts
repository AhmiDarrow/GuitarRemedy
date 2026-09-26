import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Confidence = 'building' | 'steady' | 'ready'
export interface LessonSession {
  segment: number
  checked: Record<string, boolean>
  note: string
  confidence?: Confidence
  reviewedAt?: string
  reviewDue?: string
}
export const EMPTY_SESSION: LessonSession = { segment: 0, checked: {}, note: '' }

export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function nextReview(confidence: Confidence, now = new Date()): string {
  const date = new Date(now)
  date.setDate(date.getDate() + ({ building: 1, steady: 3, ready: 7 }[confidence]))
  return localDate(date)
}

export function dueLessons(sessions: Record<number, LessonSession>, today = localDate()): number[] {
  return Object.keys(sessions).map(Number)
    .filter(day => day >= 1 && day <= 365 && sessions[day].reviewDue && sessions[day].reviewDue! <= today)
    .sort((a, b) => sessions[a].reviewDue!.localeCompare(sessions[b].reviewDue!) || a - b)
}

interface LessonState {
  sessions: Record<number, LessonSession>
  update: (day: number, patch: Partial<LessonSession>) => void
  assess: (day: number, confidence: Confidence) => void
}

export const useLessonStore = create<LessonState>()(persist((set) => ({
  sessions: {},
  update: (day, patch) => set(s => ({ sessions: {
    ...s.sessions, [day]: { ...EMPTY_SESSION, ...s.sessions[day], ...patch },
  } })),
  assess: (day, confidence) => set(s => ({ sessions: {
    ...s.sessions, [day]: {
      ...EMPTY_SESSION, ...s.sessions[day], confidence,
      reviewedAt: localDate(), reviewDue: nextReview(confidence),
    },
  } })),
}), { name: 'guitar-remedy-lessons-v1', partialize: s => ({ sessions: s.sessions }) }))
