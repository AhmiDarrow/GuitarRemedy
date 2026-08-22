import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TuningName } from '../lib/theory'
import { STANDARD_TUNING, TUNINGS } from '../lib/theory'
import { DEFAULT_RMS_GATE } from '../lib/tuner'

/**
 * Standalone tuner prefs — not shared with Profile / fretboard / convert.
 * The chromatic tuner is its own feature with its own A4, open-string map,
 * steel-string bias, and noise floor.
 */
export interface TunerState {
  /** Concert A for pitch detection + reference tones (Hz). */
  a4: number
  tuningName: TuningName
  customTuning: number[]
  /** Slight sharp bias for steel-string inharmonicity. */
  steelStrings: boolean
  /** RMS gate after quiet-room calibrate (or default). */
  rmsGate: number
  setA4: (hz: number) => void
  setTuningName: (t: TuningName) => void
  setCustomTuning: (notes: number[]) => void
  setSteelStrings: (v: boolean) => void
  setRmsGate: (n: number) => void
  /** Open-string MIDI low E → high e for this tuner only. */
  getTuning: () => number[]
}

function clampA4(hz: number): number {
  return Number.isFinite(hz) && hz >= 400 && hz <= 480 ? Math.round(hz) : 440
}

function clampGate(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_RMS_GATE
  return Math.max(0.0005, Math.min(0.05, n))
}

export const useTunerStore = create<TunerState>()(
  persist(
    (set, get) => ({
      a4: 440,
      tuningName: 'standard',
      customTuning: [...STANDARD_TUNING],
      steelStrings: true,
      rmsGate: DEFAULT_RMS_GATE,

      setA4: (hz) => set({ a4: clampA4(hz) }),
      setTuningName: (t) => set({ tuningName: t }),
      setCustomTuning: (notes) => {
        if (!Array.isArray(notes) || notes.length !== 6) return
        const midi = notes.map((n) => Math.max(0, Math.min(127, Math.round(Number(n) || 0))))
        set({ customTuning: midi, tuningName: 'custom' })
      },
      setSteelStrings: (v) => set({ steelStrings: Boolean(v) }),
      setRmsGate: (n) => set({ rmsGate: clampGate(n) }),

      getTuning: () => {
        const s = get()
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
      name: 'guitar-remedy-tuner-v1',
      partialize: (s) => ({
        a4: s.a4,
        tuningName: s.tuningName,
        customTuning: s.customTuning,
        steelStrings: s.steelStrings,
        rmsGate: s.rmsGate,
      }),
    },
  ),
)
