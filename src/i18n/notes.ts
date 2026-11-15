import { NOTE_NAMES } from '../lib/theory'

/** Display-only pitch spelling. Theory, tabs, and tests keep letter names. */
export type NoteSpelling = 'letters' | 'solfege' | 'german'

export const NOTE_SPELLINGS: NoteSpelling[] = ['letters', 'solfege', 'german']

export function isNoteSpelling(value: unknown): value is NoteSpelling {
  return value === 'letters' || value === 'solfege' || value === 'german'
}

/** Fixed-do solfège (Do–Si). Sharps keep a # so the pitch class stays unambiguous. */
const SOLFEGE = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'] as const

/** German: B is H, A# is Ais. Sharps use the -is suffix. */
const GERMAN = ['C', 'Cis', 'D', 'Dis', 'E', 'F', 'Fis', 'G', 'Gis', 'A', 'Ais', 'H'] as const

const LETTER_INDEX: Record<string, number> = {
  C: 0, 'C#': 1, DB: 1, D: 2, 'D#': 3, EB: 3, E: 4, FB: 4, F: 5, 'F#': 6, GB: 6,
  G: 7, 'G#': 8, AB: 8, A: 9, 'A#': 10, BB: 10, B: 11, CB: 11,
}

export function displayPitchClass(pc: number, spelling: NoteSpelling): string {
  const i = ((pc % 12) + 12) % 12
  if (spelling === 'solfege') return SOLFEGE[i]
  if (spelling === 'german') return GERMAN[i]
  return NOTE_NAMES[i]
}

/**
 * Spell a note token for the fretboard / tuner readout.
 * Octave digits stay. Unknown tokens (—, Hz) pass through.
 */
export function spellNoteToken(token: string, spelling: NoteSpelling): string {
  if (spelling === 'letters' || !token) return token
  const match = /^([A-Ga-g])([#b])?(\d*)$/.exec(token.trim())
  if (!match) return token
  const letter = match[1].toUpperCase()
  const acc = match[2] ?? ''
  const octave = match[3] ?? ''
  const idx = LETTER_INDEX[`${letter}${acc.toUpperCase()}`]
  if (idx === undefined) return token
  return `${displayPitchClass(idx, spelling)}${octave}`
}
