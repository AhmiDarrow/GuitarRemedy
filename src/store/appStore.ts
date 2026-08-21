import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TuningName } from '../lib/theory'
import { STANDARD_TUNING, TUNINGS } from '../lib/theory'

export type Handedness = 'right' | 'left'

interface AppState {
  displayName: string
  lefty: boolean
  handedness: Handedness
  tuningName: TuningName
  customTuning: number[]
  a4: number
  showDegrees: boolean
  metronomeOn: boolean
  bpm: number
  /** Beats per bar for metronome (2–8). */
  timeSignatureBeats: number
  /** Subdivision: 1=quarter, 2=eighth, 3=triplet, 4=sixteenth. */
  metronomeSubdivision: number
  /** Accent beat 1. */
  metronomeAccent: boolean
  /** Soft count-in bars before main loop (0–4). */
  metronomeCountInBars: number
  /** True after first-run onboarding completes (single source of truth). */
  onboarded: boolean
  favorites: string[]
  completedLessons: number[]
  currentDay: number
  streak: number
  lastPracticeDate: string | null
  setDisplayName: (name: string) => void
  setLefty: (v: boolean) => void
  setHandedness: (h: Handedness) => void
  setTuningName: (t: TuningName) => void
  setCustomTuning: (notes: number[]) => void
  setA4: (hz: number) => void
  setShowDegrees: (v: boolean) => void
  setMetronomeOn: (v: boolean) => void
  setBpm: (n: number) => void
  setTimeSignatureBeats: (n: number) => void
  setMetronomeSubdivision: (n: number) => void
  setMetronomeAccent: (v: boolean) => void
  setMetronomeCountInBars: (n: number) => void
  completeOnboarding: (name?: string, lefty?: boolean) => void
  toggleFavorite: (id: string) => void
  completeLesson: (day: number) => void
  setCurrentDay: (day: number) => void
  recordPractice: () => void
  getTuning: () => number[]
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayISO() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      displayName: 'Player',
      lefty: false,
      handedness: 'right',
      tuningName: 'standard',
      customTuning: [...STANDARD_TUNING],
      a4: 440,
      showDegrees: true,
      metronomeOn: false,
      bpm: 80,
      timeSignatureBeats: 4,
      metronomeSubdivision: 1,
      metronomeAccent: true,
      metronomeCountInBars: 1,
      onboarded: false,
      favorites: [],
      completedLessons: [],
      currentDay: 1,
      streak: 0,
      lastPracticeDate: null,

      setDisplayName: (name) => set({ displayName: name || 'Player' }),
      setLefty: (v) => set({ lefty: v, handedness: v ? 'left' : 'right' }),
      setHandedness: (h) => set({ handedness: h, lefty: h === 'left' }),
      setTuningName: (t) => set({ tuningName: t }),
      setCustomTuning: (notes) => {
        if (!Array.isArray(notes) || notes.length !== 6) return
        const midi = notes.map((n) => Math.max(0, Math.min(127, Math.round(Number(n) || 0))))
        set({ customTuning: midi, tuningName: 'custom' })
      },
      setA4: (hz) => set({ a4: hz }),
      setShowDegrees: (v) => set({ showDegrees: v }),
      setMetronomeOn: (v) => set({ metronomeOn: v }),
      // Keep in sync with metronome.clampBpm (30–300) so scale play and click share one tempo.
      setBpm: (n) => set({ bpm: Math.max(30, Math.min(300, Math.round(n) || 80)) }),
      setTimeSignatureBeats: (n) =>
        set({ timeSignatureBeats: Math.max(2, Math.min(8, Math.round(n) || 4)) }),
      setMetronomeSubdivision: (n) =>
        set({ metronomeSubdivision: [1, 2, 3, 4].includes(n) ? n : 1 }),
      setMetronomeAccent: (v) => set({ metronomeAccent: v }),
      setMetronomeCountInBars: (n) =>
        set({ metronomeCountInBars: Math.max(0, Math.min(4, Math.round(n) || 0)) }),
      completeOnboarding: (name, leftyFlag) =>
        set((s) => ({
          onboarded: true,
          displayName: name?.trim() || s.displayName || 'Player',
          lefty: leftyFlag ?? s.lefty,
          handedness: (leftyFlag ?? s.lefty) ? 'left' : 'right',
        })),

      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((x) => x !== id)
            : [...s.favorites, id],
        })),

      completeLesson: (day) =>
        set((s) => {
          if (s.completedLessons.includes(day)) return s
          const completed = [...s.completedLessons, day].sort((a, b) => a - b)
          const next = Math.min(365, Math.max(s.currentDay, day + 1))
          return { completedLessons: completed, currentDay: next }
        }),

      setCurrentDay: (day) => set({ currentDay: Math.max(1, Math.min(365, day)) }),

      recordPractice: () => {
        const today = todayISO()
        const { lastPracticeDate, streak } = get()
        if (lastPracticeDate === today) return
        const nextStreak =
          lastPracticeDate === yesterdayISO() ? streak + 1 : lastPracticeDate ? 1 : 1
        set({ lastPracticeDate: today, streak: nextStreak })
      },

      getTuning: () => {
        const s = get()
        // Custom tuning wins when selected (or when name is custom).
        if (s.tuningName === 'custom' && s.customTuning?.length === 6) {
          return [...s.customTuning]
        }
        const def = TUNINGS[s.tuningName]
        if (def?.midi?.length === 6) return [...def.midi]
        if (s.customTuning?.length === 6) return [...s.customTuning]
        return [...STANDARD_TUNING]
      },
    }),
    {
      name: 'guitar-remedy-v1',
      partialize: (s) => ({
        displayName: s.displayName,
        lefty: s.lefty,
        handedness: s.handedness,
        tuningName: s.tuningName,
        customTuning: s.customTuning,
        a4: s.a4,
        showDegrees: s.showDegrees,
        bpm: s.bpm,
        timeSignatureBeats: s.timeSignatureBeats,
        metronomeSubdivision: s.metronomeSubdivision,
        metronomeAccent: s.metronomeAccent,
        metronomeCountInBars: s.metronomeCountInBars,
        onboarded: s.onboarded,
        favorites: s.favorites,
        completedLessons: s.completedLessons,
        currentDay: s.currentDay,
        streak: s.streak,
        lastPracticeDate: s.lastPracticeDate,
      }),
      // Migrate older persists that used dual onboarding flags.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Record<string, unknown>
        const legacyDone = Boolean(p.onboardingDone)
        const onboarded = Boolean(p.onboarded || legacyDone || current.onboarded)
        const rest = { ...p }
        delete rest.onboardingDone
        return {
          ...current,
          ...rest,
          onboarded,
        } as AppState
      },
    },
  ),
)
