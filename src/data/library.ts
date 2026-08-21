import { FREE_LICENSE_TABS } from './freeTabs'

export type LibraryKind = 'scale' | 'chord' | 'riff' | 'song' | 'progression'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export interface LibraryItem {
  id: string
  title: string
  kind: LibraryKind
  skill: SkillLevel
  key?: string
  genre?: string
  tags: string[]
  description: string
  /** scale/mode id from theory, or chord symbol */
  theoryId?: string
  /** alias used by Library fretboard preview */
  scaleId?: string
  /** simple tab JSON for riffs/songs */
  tab?: TabSong
  openLicense: boolean
}

export interface TabNote {
  /** Display index: 0 = high e … 5 = low E */
  string: number
  fret: number
  /** Length in beats */
  duration?: number
  /**
   * Onset within the measure in beats (0 = downbeat).
   * When omitted, notes pack left-to-right (legacy library riffs).
   */
  start?: number
}

export interface TabMeasure {
  notes: TabNote[]
}

export interface TabSong {
  title: string
  tempo: number
  timeSig: [number, number]
  measures: TabMeasure[]
  tuning?: number[]
}

const openRiffAm: TabSong = {
  title: 'Open Am Walk',
  tempo: 90,
  timeSig: [4, 4],
  measures: [
    { notes: [{ string: 1, fret: 0, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 3, duration: 1 }, { string: 2, fret: 0, duration: 1 }] },
    { notes: [{ string: 2, fret: 2, duration: 1 }, { string: 2, fret: 3, duration: 1 }, { string: 3, fret: 0, duration: 1 }, { string: 3, fret: 2, duration: 1 }] },
    { notes: [{ string: 1, fret: 0, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 3, duration: 1 }, { string: 2, fret: 0, duration: 1 }] },
    { notes: [{ string: 2, fret: 2, duration: 1 }, { string: 2, fret: 3, duration: 1 }, { string: 3, fret: 0, duration: 1 }, { string: 3, fret: 2, duration: 1 }] },
    { notes: [{ string: 1, fret: 3, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 2, fret: 3, duration: 1 }] },
    { notes: [{ string: 2, fret: 2, duration: 1 }, { string: 2, fret: 0, duration: 1 }, { string: 3, fret: 2, duration: 1 }, { string: 3, fret: 0, duration: 1 }] },
    { notes: [{ string: 1, fret: 0, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 3, duration: 1 }, { string: 2, fret: 0, duration: 1 }] },
    { notes: [{ string: 2, fret: 2, duration: 1 }, { string: 2, fret: 3, duration: 1 }, { string: 3, fret: 0, duration: 2 }] },
    { notes: [{ string: 1, fret: 0, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 3, duration: 1 }, { string: 2, fret: 0, duration: 1 }] },
    { notes: [{ string: 2, fret: 2, duration: 1 }, { string: 2, fret: 3, duration: 1 }, { string: 3, fret: 0, duration: 1 }, { string: 3, fret: 2, duration: 1 }] },
    { notes: [{ string: 1, fret: 3, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 2, fret: 3, duration: 1 }] },
    { notes: [{ string: 2, fret: 0, duration: 2 }, { string: 2, fret: 0, duration: 2 }] },
  ],
}

const twinkle: TabSong = {
  title: 'Twinkle Twinkle (public domain)',
  tempo: 100,
  timeSig: [4, 4],
  measures: [
    { notes: [{ string: 0, fret: 0, duration: 1 }, { string: 0, fret: 0, duration: 1 }, { string: 0, fret: 2, duration: 1 }, { string: 0, fret: 2, duration: 1 }] },
    { notes: [{ string: 0, fret: 3, duration: 1 }, { string: 0, fret: 3, duration: 1 }, { string: 0, fret: 2, duration: 2 }] },
    { notes: [{ string: 1, fret: 3, duration: 1 }, { string: 1, fret: 3, duration: 1 }, { string: 1, fret: 2, duration: 1 }, { string: 1, fret: 2, duration: 1 }] },
    { notes: [{ string: 1, fret: 0, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 0, fret: 0, duration: 2 }] },
    { notes: [{ string: 0, fret: 2, duration: 1 }, { string: 0, fret: 2, duration: 1 }, { string: 1, fret: 3, duration: 1 }, { string: 1, fret: 3, duration: 1 }] },
    { notes: [{ string: 1, fret: 2, duration: 1 }, { string: 1, fret: 2, duration: 1 }, { string: 1, fret: 0, duration: 2 }] },
    { notes: [{ string: 0, fret: 2, duration: 1 }, { string: 0, fret: 2, duration: 1 }, { string: 1, fret: 3, duration: 1 }, { string: 1, fret: 3, duration: 1 }] },
    { notes: [{ string: 1, fret: 2, duration: 1 }, { string: 1, fret: 2, duration: 1 }, { string: 1, fret: 0, duration: 2 }] },
    { notes: [{ string: 0, fret: 0, duration: 1 }, { string: 0, fret: 0, duration: 1 }, { string: 0, fret: 2, duration: 1 }, { string: 0, fret: 2, duration: 1 }] },
    { notes: [{ string: 0, fret: 3, duration: 1 }, { string: 0, fret: 3, duration: 1 }, { string: 0, fret: 2, duration: 2 }] },
    { notes: [{ string: 1, fret: 3, duration: 1 }, { string: 1, fret: 3, duration: 1 }, { string: 1, fret: 2, duration: 1 }, { string: 1, fret: 2, duration: 1 }] },
    { notes: [{ string: 1, fret: 0, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 0, fret: 0, duration: 2 }] },
  ],
}

const smokeOnWaterStyle: TabSong = {
  title: 'Power Riff Study (original)',
  tempo: 112,
  timeSig: [4, 4],
  measures: [
    { notes: [{ string: 3, fret: 0, duration: 0.75 }, { string: 3, fret: 3, duration: 0.75 }, { string: 3, fret: 5, duration: 1.5 }] },
    { notes: [{ string: 3, fret: 0, duration: 0.75 }, { string: 3, fret: 3, duration: 0.75 }, { string: 3, fret: 6, duration: 0.5 }, { string: 3, fret: 5, duration: 2 }] },
    { notes: [{ string: 3, fret: 0, duration: 0.75 }, { string: 3, fret: 3, duration: 0.75 }, { string: 3, fret: 5, duration: 1.5 }] },
    { notes: [{ string: 3, fret: 0, duration: 0.75 }, { string: 3, fret: 3, duration: 0.75 }, { string: 3, fret: 6, duration: 0.5 }, { string: 3, fret: 5, duration: 2 }] },
    { notes: [{ string: 4, fret: 0, duration: 0.75 }, { string: 4, fret: 3, duration: 0.75 }, { string: 4, fret: 5, duration: 1.5 }] },
    { notes: [{ string: 4, fret: 0, duration: 0.75 }, { string: 4, fret: 3, duration: 0.75 }, { string: 4, fret: 6, duration: 0.5 }, { string: 4, fret: 5, duration: 2 }] },
    { notes: [{ string: 3, fret: 0, duration: 0.75 }, { string: 3, fret: 3, duration: 0.75 }, { string: 3, fret: 5, duration: 1.5 }] },
    { notes: [{ string: 3, fret: 0, duration: 0.75 }, { string: 3, fret: 3, duration: 0.75 }, { string: 3, fret: 6, duration: 0.5 }, { string: 3, fret: 5, duration: 2 }] },
    { notes: [{ string: 3, fret: 5, duration: 0.5 }, { string: 3, fret: 6, duration: 0.5 }, { string: 3, fret: 5, duration: 0.5 }, { string: 3, fret: 3, duration: 0.5 }, { string: 3, fret: 0, duration: 2 }] },
    { notes: [{ string: 3, fret: 0, duration: 0.75 }, { string: 3, fret: 3, duration: 0.75 }, { string: 3, fret: 5, duration: 1.5 }] },
    { notes: [{ string: 3, fret: 0, duration: 0.75 }, { string: 3, fret: 3, duration: 0.75 }, { string: 3, fret: 6, duration: 0.5 }, { string: 3, fret: 5, duration: 2 }] },
    { notes: [{ string: 3, fret: 0, duration: 2 }, { string: 3, fret: 0, duration: 2 }] },
  ],
}

const odeToJoy: TabSong = {
  title: 'Ode to Joy (public domain)',
  tempo: 96,
  timeSig: [4, 4],
  measures: [
    { notes: [{ string: 1, fret: 0, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 3, duration: 1 }] },
    { notes: [{ string: 1, fret: 3, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 2, fret: 3, duration: 1 }] },
    { notes: [{ string: 2, fret: 2, duration: 1 }, { string: 2, fret: 2, duration: 1 }, { string: 2, fret: 0, duration: 1 }, { string: 2, fret: 0, duration: 1 }] },
    { notes: [{ string: 1, fret: 0, duration: 2 }, { string: 1, fret: 0, duration: 2 }] },
    { notes: [{ string: 1, fret: 0, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 3, duration: 1 }] },
    { notes: [{ string: 1, fret: 3, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 2, fret: 3, duration: 1 }] },
    { notes: [{ string: 2, fret: 2, duration: 1 }, { string: 2, fret: 2, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 2, fret: 2, duration: 1 }] },
    { notes: [{ string: 2, fret: 0, duration: 2 }, { string: 2, fret: 0, duration: 2 }] },
    { notes: [{ string: 2, fret: 2, duration: 1 }, { string: 2, fret: 2, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 1, fret: 0, duration: 1 }] },
    { notes: [{ string: 2, fret: 3, duration: 1 }, { string: 2, fret: 3, duration: 1 }, { string: 2, fret: 2, duration: 2 }] },
    { notes: [{ string: 1, fret: 0, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 3, duration: 1 }] },
    { notes: [{ string: 1, fret: 3, duration: 1 }, { string: 1, fret: 1, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 2, fret: 3, duration: 1 }] },
    { notes: [{ string: 2, fret: 2, duration: 1 }, { string: 2, fret: 2, duration: 1 }, { string: 1, fret: 0, duration: 1 }, { string: 2, fret: 2, duration: 1 }] },
    { notes: [{ string: 2, fret: 0, duration: 2 }, { string: 2, fret: 0, duration: 2 }] },
  ],
}

const bluesShuffle: TabSong = {
  title: 'E Blues Shuffle Outline',
  tempo: 88,
  timeSig: [4, 4],
  measures: [
    // 12-bar E blues skeleton
    { notes: [{ string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.7 }] },
    { notes: [{ string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.7 }] },
    { notes: [{ string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.7 }] },
    { notes: [{ string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.7 }] },
    { notes: [{ string: 5, fret: 5, duration: 0.66 }, { string: 5, fret: 7, duration: 0.66 }, { string: 5, fret: 5, duration: 0.66 }, { string: 5, fret: 7, duration: 0.66 }, { string: 5, fret: 5, duration: 0.66 }, { string: 5, fret: 7, duration: 0.7 }] },
    { notes: [{ string: 5, fret: 5, duration: 0.66 }, { string: 5, fret: 7, duration: 0.66 }, { string: 5, fret: 5, duration: 0.66 }, { string: 5, fret: 7, duration: 0.66 }, { string: 5, fret: 5, duration: 0.66 }, { string: 5, fret: 7, duration: 0.7 }] },
    { notes: [{ string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.7 }] },
    { notes: [{ string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.7 }] },
    { notes: [{ string: 5, fret: 7, duration: 0.66 }, { string: 5, fret: 9, duration: 0.66 }, { string: 5, fret: 7, duration: 0.66 }, { string: 5, fret: 9, duration: 0.66 }, { string: 5, fret: 7, duration: 0.66 }, { string: 5, fret: 9, duration: 0.7 }] },
    { notes: [{ string: 5, fret: 5, duration: 0.66 }, { string: 5, fret: 7, duration: 0.66 }, { string: 5, fret: 5, duration: 0.66 }, { string: 5, fret: 7, duration: 0.66 }, { string: 5, fret: 5, duration: 0.66 }, { string: 5, fret: 7, duration: 0.7 }] },
    { notes: [{ string: 5, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.66 }, { string: 5, fret: 0, duration: 0.66 }, { string: 4, fret: 2, duration: 0.66 }, { string: 4, fret: 0, duration: 0.66 }, { string: 5, fret: 2, duration: 0.7 }] },
    { notes: [{ string: 5, fret: 0, duration: 1 }, { string: 5, fret: 2, duration: 1 }, { string: 5, fret: 0, duration: 2 }] },
  ],
}

function scaleItem(
  id: string,
  title: string,
  theoryId: string,
  skill: SkillLevel,
  key: string,
  description: string,
  tags: string[],
): LibraryItem {
  return {
    id,
    title,
    kind: 'scale',
    skill,
    key,
    tags,
    description,
    theoryId,
    openLicense: true,
  }
}

function chordItem(
  id: string,
  title: string,
  theoryId: string,
  skill: SkillLevel,
  description: string,
): LibraryItem {
  return {
    id,
    title,
    kind: 'chord',
    skill,
    tags: ['chord'],
    description,
    theoryId,
    openLicense: true,
  }
}

export const LIBRARY: LibraryItem[] = [
  // Scales
  scaleItem('sc-major', 'Major Scale', 'major', 'beginner', 'C', 'The foundation of Western harmony — seven notes, bright and resolved.', [
    'diatonic',
    'modes',
  ]),
  scaleItem('sc-nat-min', 'Natural Minor', 'naturalMinor', 'beginner', 'A', 'Relative minor of C major — darker color, same notes.', [
    'diatonic',
    'minor',
  ]),
  scaleItem('sc-harm-min', 'Harmonic Minor', 'harmonicMinor', 'intermediate', 'A', 'Raised 7th creates the classic Spanish / metal leading tone.', [
    'minor',
    'exotic',
  ]),
  scaleItem('sc-mel-min', 'Melodic Minor', 'melodicMinor', 'intermediate', 'A', 'Raised 6 and 7 ascending — jazz and classical staple.', ['minor', 'jazz']),
  scaleItem('sc-pent-maj', 'Major Pentatonic', 'majorPentatonic', 'beginner', 'G', 'Five notes that almost always sound good over major chords.', [
    'pentatonic',
    'lead',
  ]),
  scaleItem('sc-pent-min', 'Minor Pentatonic', 'minorPentatonic', 'beginner', 'A', 'The rock and blues box — start here for solos.', [
    'pentatonic',
    'blues',
    'rock',
  ]),
  scaleItem('sc-blues', 'Blues Scale', 'blues', 'beginner', 'A', 'Minor pentatonic plus the flat-5 blue note.', ['blues', 'pentatonic']),
  scaleItem('sc-dorian', 'Dorian Mode', 'dorian', 'intermediate', 'D', 'Minor with a raised 6 — Santana, funk, and modal jazz.', [
    'modes',
    'modal',
  ]),
  scaleItem('sc-phrygian', 'Phrygian Mode', 'phrygian', 'intermediate', 'E', 'Flat 2 gives a Spanish / metal flavor.', ['modes', 'metal']),
  scaleItem('sc-lydian', 'Lydian Mode', 'lydian', 'intermediate', 'F', 'Raised 4 — dreamy, floating major sound.', ['modes', 'cinematic']),
  scaleItem('sc-mixo', 'Mixolydian Mode', 'mixolydian', 'intermediate', 'G', 'Major with flat 7 — rock dominant and jam bands.', [
    'modes',
    'rock',
  ]),
  scaleItem('sc-locrian', 'Locrian Mode', 'locrian', 'advanced', 'B', 'Diminished tonic — unstable and rare as a home base.', ['modes']),
  scaleItem('sc-whole', 'Whole Tone', 'wholeTone', 'advanced', 'C', 'Six equal steps — dreamlike, no leading tone.', ['exotic']),
  scaleItem('sc-hwh', 'Half-Whole Diminished', 'halfWholeDim', 'advanced', 'C', 'Symmetrical diminished — jazz dominant lines.', [
    'jazz',
    'diminished',
  ]),
  scaleItem('sc-whh', 'Whole-Half Diminished', 'wholeHalfDim', 'advanced', 'C', 'Diminished arpeggio highway.', ['jazz', 'diminished']),

  // Chords
  chordItem('ch-c', 'C Major', 'C', 'beginner', 'Open C — ring frets 1–2 cleanly, arch fingers.'),
  chordItem('ch-g', 'G Major', 'G', 'beginner', 'Open G — three-finger or four-finger shapes.'),
  chordItem('ch-d', 'D Major', 'D', 'beginner', 'Open D triangle on the top three strings.'),
  chordItem('ch-em', 'E Minor', 'Em', 'beginner', 'Two fingers — often the first minor chord learned.'),
  chordItem('ch-am', 'A Minor', 'Am', 'beginner', 'Open Am — same shape family as E major moved over.'),
  chordItem('ch-e', 'E Major', 'E', 'beginner', 'Open E — full six-string power.'),
  chordItem('ch-a', 'A Major', 'A', 'beginner', 'Open A — keep frets 2 clean across strings 2–4.'),
  chordItem('ch-f', 'F Major (barre intro)', 'F', 'intermediate', 'Mini or full barre — gateway to movable shapes.'),
  chordItem('ch-bm', 'B Minor (barre)', 'Bm', 'intermediate', 'Barre on fret 2 — Am shape moved up.'),
  chordItem('ch-c7', 'C7', 'C7', 'intermediate', 'Dominant color — blues and folk turnarounds.'),
  chordItem('ch-g7', 'G7', 'G7', 'beginner', 'Open G7 — resolves strongly to C.'),
  chordItem('ch-d7', 'D7', 'D7', 'beginner', 'Open D7 — classic folk dominant.'),
  chordItem('ch-a7', 'A7', 'A7', 'beginner', 'Open A7 — blues in D and country turns.'),
  chordItem('ch-e7', 'E7', 'E7', 'beginner', 'Open E7 — blues in A.'),
  chordItem('ch-dm', 'D Minor', 'Dm', 'beginner', 'Open Dm — sad ballad staple.'),

  // Progressions as library entries
  {
    id: 'pr-145',
    title: 'I–IV–V in G',
    kind: 'progression',
    skill: 'beginner',
    key: 'G',
    genre: 'folk',
    tags: ['progression', 'campfire'],
    description: 'G–C–D — the backbone of countless folk and rock songs.',
    openLicense: true,
  },
  {
    id: 'pr-1645',
    title: 'I–vi–IV–V in C',
    kind: 'progression',
    skill: 'beginner',
    key: 'C',
    genre: 'pop',
    tags: ['progression', 'pop'],
    description: 'C–Am–F–G — 50s progression, endless ballads.',
    openLicense: true,
  },
  {
    id: 'pr-6251',
    title: 'vi–ii–V–I in C',
    kind: 'progression',
    skill: 'intermediate',
    key: 'C',
    genre: 'jazz',
    tags: ['progression', 'jazz'],
    description: 'Am–Dm–G–C — jazz turnaround primer.',
    openLicense: true,
  },
  {
    id: 'pr-12bar',
    title: '12-Bar Blues in A',
    kind: 'progression',
    skill: 'beginner',
    key: 'A',
    genre: 'blues',
    tags: ['progression', 'blues'],
    description: 'A7–D7–E7 form — shuffle or straight eighths.',
    openLicense: true,
  },
  {
    id: 'pr-andalu',
    title: 'Andalusian Cadence',
    kind: 'progression',
    skill: 'intermediate',
    key: 'Am',
    genre: 'flamenco',
    tags: ['progression', 'modal'],
    description: 'Am–G–F–E — Phrygian drama.',
    openLicense: true,
  },

  // Riffs & songs (original / public domain)
  {
    id: 'rf-open-am',
    title: 'Open Am Walk',
    kind: 'riff',
    skill: 'beginner',
    key: 'Am',
    genre: 'practice',
    tags: ['riff', 'fingerstyle'],
    description: 'Single-note walk on the open Am shape — fretting hand warm-up.',
    tab: openRiffAm,
    openLicense: true,
  },
  {
    id: 'sg-twinkle',
    title: 'Twinkle Twinkle Little Star',
    kind: 'song',
    skill: 'beginner',
    key: 'C',
    genre: 'folk',
    tags: ['public-domain', 'melody'],
    description: 'Public-domain melody in simple first-position tab.',
    tab: twinkle,
    openLicense: true,
  },
  {
    id: 'rf-power',
    title: 'Power Riff Study',
    kind: 'riff',
    skill: 'beginner',
    key: 'E',
    genre: 'rock',
    tags: ['riff', 'power-chord'],
    description: 'Original power-note study on the low strings — palm mute optional.',
    tab: smokeOnWaterStyle,
    openLicense: true,
  },
  {
    id: 'sg-ode',
    title: 'Ode to Joy',
    kind: 'song',
    skill: 'beginner',
    key: 'C',
    genre: 'classical',
    tags: ['public-domain', 'melody'],
    description: 'Beethoven theme (public domain) arranged for easy guitar tab.',
    tab: odeToJoy,
    openLicense: true,
  },
  {
    id: 'rf-blues-sh',
    title: 'E Blues Shuffle Outline',
    kind: 'riff',
    skill: 'intermediate',
    key: 'E',
    genre: 'blues',
    tags: ['blues', 'rhythm'],
    description: 'Thumb-friendly E5–E6 shuffle skeleton for 12-bar practice.',
    tab: bluesShuffle,
    openLicense: true,
  },
  {
    id: 'rf-spider',
    title: 'Spider Warm-up',
    kind: 'riff',
    skill: 'beginner',
    key: 'C',
    genre: 'practice',
    tags: ['technique', 'chromatic'],
    description: '1-2-3-4 chromatic crawl across strings — slow and even.',
    tab: {
      title: 'Spider Warm-up',
      tempo: 60,
      timeSig: [4, 4],
      measures: [
        {
          notes: [
            { string: 5, fret: 1, duration: 0.25 },
            { string: 5, fret: 2, duration: 0.25 },
            { string: 5, fret: 3, duration: 0.25 },
            { string: 5, fret: 4, duration: 0.25 },
            { string: 4, fret: 1, duration: 0.25 },
            { string: 4, fret: 2, duration: 0.25 },
            { string: 4, fret: 3, duration: 0.25 },
            { string: 4, fret: 4, duration: 0.25 },
          ],
        },
      ],
    },
    openLicense: true,
  },
  {
    id: 'sg-drums',
    title: 'Yankee Doodle',
    kind: 'song',
    skill: 'beginner',
    key: 'G',
    genre: 'folk',
    tags: ['public-domain'],
    description: 'Public-domain tune in open position.',
    tab: {
      title: 'Yankee Doodle',
      tempo: 110,
      timeSig: [4, 4],
      measures: [
        {
          notes: [
            { string: 2, fret: 0, duration: 0.5 },
            { string: 2, fret: 0, duration: 0.5 },
            { string: 2, fret: 2, duration: 0.5 },
            { string: 1, fret: 0, duration: 0.5 },
            { string: 1, fret: 1, duration: 0.5 },
            { string: 1, fret: 0, duration: 0.5 },
            { string: 2, fret: 2, duration: 0.5 },
            { string: 2, fret: 0, duration: 0.5 },
          ],
        },
      ],
    },
    openLicense: true,
  },
  {
    id: 'rf-caged-c',
    title: 'CAGED C-shape arpeggio',
    kind: 'riff',
    skill: 'intermediate',
    key: 'C',
    genre: 'practice',
    tags: ['caged', 'arpeggio'],
    description: 'C major arpeggio outlining the open C form up the neck.',
    tab: {
      title: 'CAGED C arpeggio',
      tempo: 80,
      timeSig: [4, 4],
      measures: [
        {
          notes: [
            { string: 4, fret: 3, duration: 0.5 },
            { string: 3, fret: 2, duration: 0.5 },
            { string: 2, fret: 0, duration: 0.5 },
            { string: 1, fret: 1, duration: 0.5 },
            { string: 0, fret: 0, duration: 0.5 },
            { string: 0, fret: 3, duration: 0.5 },
          ],
        },
      ],
    },
    openLicense: true,
  },

  // Large free-license song & riff pack (public domain / traditional / original)
  ...FREE_LICENSE_TABS,
]

export function searchLibrary(query: string, filters?: {
  kind?: LibraryKind | 'all'
  skill?: SkillLevel | 'all'
  favoritesOnly?: boolean
  favoriteIds?: string[]
}): LibraryItem[] {
  const q = query.trim().toLowerCase()
  return LIBRARY.filter((item) => {
    if (filters?.kind && filters.kind !== 'all' && item.kind !== filters.kind) return false
    if (filters?.skill && filters.skill !== 'all' && item.skill !== filters.skill) return false
    if (filters?.favoritesOnly && filters.favoriteIds && !filters.favoriteIds.includes(item.id))
      return false
    if (!q) return true
    const hay = [item.title, item.description, item.key, item.genre, ...item.tags]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
}

export function getLibraryItem(id: string): LibraryItem | undefined {
  return LIBRARY.find((x) => x.id === id)
}
