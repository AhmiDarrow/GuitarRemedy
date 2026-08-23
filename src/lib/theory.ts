/** Guitar theory engine — notes, scales, chords, fretting helpers */

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const
export type NoteName = (typeof NOTE_NAMES)[number]

/** Enharmonic flats/sharps → sharp-side NoteName used by the pitch-class engine. */
export const FLAT_TO_SHARP: Record<string, NoteName> = {
  Cb: 'B',
  Db: 'C#',
  Eb: 'D#',
  Fb: 'E',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
  'E#': 'F',
  'B#': 'C',
}

/** Canonical scale ids (snake_case). CamelCase aliases resolve via `resolveScaleId`. */
export type ScaleId =
  | 'major'
  | 'natural_minor'
  | 'harmonic_minor'
  | 'melodic_minor'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'locrian'
  | 'major_pentatonic'
  | 'minor_pentatonic'
  | 'blues'
  | 'whole_tone'
  | 'half_whole_dim'
  | 'whole_half_dim'
  | 'chromatic'

/** @deprecated Prefer snake_case ScaleId — kept for call-site compatibility */
export type ScaleIdAlias =
  | ScaleId
  | 'naturalMinor'
  | 'harmonicMinor'
  | 'melodicMinor'
  | 'majorPentatonic'
  | 'minorPentatonic'

export interface ScaleDef {
  id: ScaleId
  name: string
  intervals: number[]
  degrees: string[]
  category: 'scale' | 'mode' | 'pentatonic' | 'other'
}

export type ScaleDefinition = ScaleDef

function def(
  id: ScaleId,
  name: string,
  intervals: number[],
  degrees: string[],
  category: ScaleDef['category'],
): ScaleDef {
  return { id, name, intervals, degrees, category }
}

const major = def('major', 'Major (Ionian)', [0, 2, 4, 5, 7, 9, 11], ['1', '2', '3', '4', '5', '6', '7'], 'scale')
const natural_minor = def('natural_minor', 'Natural Minor (Aeolian)', [0, 2, 3, 5, 7, 8, 10], ['1', '2', 'b3', '4', '5', 'b6', 'b7'], 'scale')
const harmonic_minor = def('harmonic_minor', 'Harmonic Minor', [0, 2, 3, 5, 7, 8, 11], ['1', '2', 'b3', '4', '5', 'b6', '7'], 'scale')
// Jazz / ascending form only (raised 6 & 7 both ways). Classical descending = natural minor.
const melodic_minor = def(
  'melodic_minor',
  'Melodic Minor (ascending / jazz)',
  [0, 2, 3, 5, 7, 9, 11],
  ['1', '2', 'b3', '4', '5', '6', '7'],
  'scale',
)
const dorian = def('dorian', 'Dorian', [0, 2, 3, 5, 7, 9, 10], ['1', '2', 'b3', '4', '5', '6', 'b7'], 'mode')
const phrygian = def('phrygian', 'Phrygian', [0, 1, 3, 5, 7, 8, 10], ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'], 'mode')
const lydian = def('lydian', 'Lydian', [0, 2, 4, 6, 7, 9, 11], ['1', '2', '3', '#4', '5', '6', '7'], 'mode')
const mixolydian = def('mixolydian', 'Mixolydian', [0, 2, 4, 5, 7, 9, 10], ['1', '2', '3', '4', '5', '6', 'b7'], 'mode')
const locrian = def('locrian', 'Locrian', [0, 1, 3, 5, 6, 8, 10], ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'], 'mode')
const major_pentatonic = def('major_pentatonic', 'Major Pentatonic', [0, 2, 4, 7, 9], ['1', '2', '3', '5', '6'], 'pentatonic')
const minor_pentatonic = def('minor_pentatonic', 'Minor Pentatonic', [0, 3, 5, 7, 10], ['1', 'b3', '4', '5', 'b7'], 'pentatonic')
const blues = def('blues', 'Blues', [0, 3, 5, 6, 7, 10], ['1', 'b3', '4', 'b5', '5', 'b7'], 'other')
// Whole-tone degrees: six equal steps — label as 1 2 3 #4 #5 #6 (not b7).
const whole_tone = def('whole_tone', 'Whole Tone', [0, 2, 4, 6, 8, 10], ['1', '2', '3', '#4', '#5', '#6'], 'other')
// Symmetrical diminished octatonics (jazz / metal vocabulary).
const half_whole_dim = def(
  'half_whole_dim',
  'Half-Whole Diminished',
  [0, 1, 3, 4, 6, 7, 9, 10],
  ['1', 'b2', 'b3', '3', '#4', '5', '6', 'b7'],
  'other',
)
const whole_half_dim = def(
  'whole_half_dim',
  'Whole-Half Diminished',
  [0, 2, 3, 5, 6, 8, 9, 11],
  ['1', '2', 'b3', '4', 'b5', 'b6', '6', '7'],
  'other',
)
const chromatic = def('chromatic', 'Chromatic', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'], 'other')

export const SCALES: Record<string, ScaleDef> = {
  major,
  natural_minor,
  harmonic_minor,
  melodic_minor,
  dorian,
  phrygian,
  lydian,
  mixolydian,
  locrian,
  major_pentatonic,
  minor_pentatonic,
  blues,
  whole_tone,
  half_whole_dim,
  whole_half_dim,
  chromatic,
  naturalMinor: { ...natural_minor, id: 'natural_minor' },
  harmonicMinor: { ...harmonic_minor, id: 'harmonic_minor' },
  melodicMinor: { ...melodic_minor, id: 'melodic_minor' },
  majorPentatonic: { ...major_pentatonic, id: 'major_pentatonic' },
  minorPentatonic: { ...minor_pentatonic, id: 'minor_pentatonic' },
  halfWholeDim: { ...half_whole_dim, id: 'half_whole_dim' },
  wholeHalfDim: { ...whole_half_dim, id: 'whole_half_dim' },
  wholeTone: { ...whole_tone, id: 'whole_tone' },
}

export const SCALE_CATALOG = SCALES

export const SCALE_LIST: ScaleDef[] = [
  major,
  natural_minor,
  harmonic_minor,
  melodic_minor,
  dorian,
  phrygian,
  lydian,
  mixolydian,
  locrian,
  major_pentatonic,
  minor_pentatonic,
  blues,
  whole_tone,
  half_whole_dim,
  whole_half_dim,
  chromatic,
]

export type ChordId =
  | 'maj'
  | 'min'
  | 'dim'
  | 'aug'
  | 'sus2'
  | 'sus4'
  | '7'
  | 'maj7'
  | 'min7'
  | 'dim7'
  | 'm7b5'
  | '9'
  | 'add9'
  | '6'
  | 'min6'
  | '5'

export interface ChordDef {
  id: ChordId
  name: string
  intervals: number[]
  symbol: string
}

export const CHORDS: Record<ChordId, ChordDef> = {
  maj: { id: 'maj', name: 'Major', intervals: [0, 4, 7], symbol: '' },
  min: { id: 'min', name: 'Minor', intervals: [0, 3, 7], symbol: 'm' },
  dim: { id: 'dim', name: 'Diminished', intervals: [0, 3, 6], symbol: 'dim' },
  aug: { id: 'aug', name: 'Augmented', intervals: [0, 4, 8], symbol: 'aug' },
  sus2: { id: 'sus2', name: 'Sus2', intervals: [0, 2, 7], symbol: 'sus2' },
  sus4: { id: 'sus4', name: 'Sus4', intervals: [0, 5, 7], symbol: 'sus4' },
  '7': { id: '7', name: 'Dominant 7', intervals: [0, 4, 7, 10], symbol: '7' },
  maj7: { id: 'maj7', name: 'Major 7', intervals: [0, 4, 7, 11], symbol: 'maj7' },
  min7: { id: 'min7', name: 'Minor 7', intervals: [0, 3, 7, 10], symbol: 'm7' },
  dim7: { id: 'dim7', name: 'Dim 7', intervals: [0, 3, 6, 9], symbol: 'dim7' },
  m7b5: { id: 'm7b5', name: 'Half-dim', intervals: [0, 3, 6, 10], symbol: 'm7b5' },
  '9': { id: '9', name: 'Dominant 9', intervals: [0, 4, 7, 10, 14], symbol: '9' },
  add9: { id: 'add9', name: 'Add9', intervals: [0, 4, 7, 14], symbol: 'add9' },
  '6': { id: '6', name: 'Major 6', intervals: [0, 4, 7, 9], symbol: '6' },
  min6: { id: 'min6', name: 'Minor 6', intervals: [0, 3, 7, 9], symbol: 'm6' },
  '5': { id: '5', name: 'Power chord', intervals: [0, 7], symbol: '5' },
}

export const STANDARD_TUNING = [40, 45, 50, 55, 59, 64] as const

export type TuningName =
  | 'standard'
  | 'drop_d'
  | 'half_down'
  | 'open_g'
  | 'open_d'
  | 'dadgad'
  | 'custom'

export const TUNINGS: Record<string, { name: string; midi: number[] }> = {
  standard: { name: 'Standard (EADGBE)', midi: [...STANDARD_TUNING] },
  drop_d: { name: 'Drop D', midi: [38, 45, 50, 55, 59, 64] },
  half_down: { name: 'Half Step Down', midi: [39, 44, 49, 54, 58, 63] },
  open_g: { name: 'Open G', midi: [38, 43, 50, 55, 59, 62] },
  open_d: { name: 'Open D', midi: [38, 45, 50, 54, 57, 62] },
  dadgad: { name: 'DADGAD', midi: [38, 45, 50, 55, 57, 62] },
  // Placeholder — real MIDI comes from each store's customTuning when name === 'custom'
  // (appStore = fretboard/convert; tunerStore = chromatic tuner only).
  custom: { name: 'Custom', midi: [...STANDARD_TUNING] },
}

export function resolveScaleId(id: string): string {
  if (SCALES[id]) return SCALES[id].id ?? id
  const map: Record<string, string> = {
    naturalMinor: 'natural_minor',
    harmonicMinor: 'harmonic_minor',
    melodicMinor: 'melodic_minor',
    majorPentatonic: 'major_pentatonic',
    minorPentatonic: 'minor_pentatonic',
    natural_minor: 'natural_minor',
    harmonic_minor: 'harmonic_minor',
    melodic_minor: 'melodic_minor',
    major_pentatonic: 'major_pentatonic',
    minor_pentatonic: 'minor_pentatonic',
    wholeTone: 'whole_tone',
    whole_tone: 'whole_tone',
    halfWholeDim: 'half_whole_dim',
    half_whole_dim: 'half_whole_dim',
    wholeHalfDim: 'whole_half_dim',
    whole_half_dim: 'whole_half_dim',
  }
  return map[id] ?? (SCALES[id] ? id : 'major')
}

export function getScale(id: string): ScaleDef {
  const key = resolveScaleId(id)
  return SCALES[key] ?? SCALES.major
}

export function normalizeNoteName(name: string): NoteName {
  const cleaned = name.trim().replace('♯', '#').replace('♭', 'b')
  if ((NOTE_NAMES as readonly string[]).includes(cleaned)) return cleaned as NoteName
  if (FLAT_TO_SHARP[cleaned]) return FLAT_TO_SHARP[cleaned]
  const upper = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  if ((NOTE_NAMES as readonly string[]).includes(upper)) return upper as NoteName
  if (FLAT_TO_SHARP[upper]) return FLAT_TO_SHARP[upper]
  throw new Error(`Unknown note: ${name}`)
}

export function noteToPc(note: string | number): number {
  if (typeof note === 'number') return ((note % 12) + 12) % 12
  return NOTE_NAMES.indexOf(normalizeNoteName(note))
}

export const pitchClass = noteToPc

export function pcToName(pc: number): NoteName {
  return NOTE_NAMES[((pc % 12) + 12) % 12]
}

export function midiToName(midi: number): string {
  const pc = ((midi % 12) + 12) % 12
  const octave = Math.floor(midi / 12) - 1
  return `${NOTE_NAMES[pc]}${octave}`
}

/**
 * Key-aware MIDI spelling (prefer flats in flat keys, sharps in sharp keys).
 * Root may be a note name ("Bb") or pitch-class 0–11; scaleId selects major/minor flavor.
 */
export function midiToNameInKey(
  midi: number,
  root: string | number = 'C',
  scaleId: string = 'major',
): string {
  const pc = ((midi % 12) + 12) % 12
  const octave = Math.floor(midi / 12) - 1
  const rootPc = noteToPc(root)
  const id = String(scaleId || 'major')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/-/g, '_')
    .toLowerCase()
  // Prefer flats for flat-side keys / natural minor / dorian-ish; sharps otherwise.
  const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const
  const useFlats =
    id.includes('minor') ||
    id.includes('dorian') ||
    id.includes('phrygian') ||
    id.includes('locrian') ||
    id.includes('blues') ||
    [1, 3, 5, 8, 10].includes(rootPc) // Db, Eb, F, Ab, Bb roots
  const name = useFlats ? FLAT_NAMES[pc] : NOTE_NAMES[pc]
  return `${name}${octave}`
}

export const midiToNoteName = midiToName

export function nameToMidi(note: string, defaultOctave = 4): number {
  const m = note.trim().match(/^([A-Ga-g])([#b♯♭]?)(-?\d+)?$/)
  if (!m) throw new Error(`Bad note name: ${note}`)
  const acc = (m[2] || '').replace('♯', '#').replace('♭', 'b')
  const base = normalizeNoteName(m[1].toUpperCase() + acc)
  const oct = m[3] !== undefined ? parseInt(m[3], 10) : defaultOctave
  return (oct + 1) * 12 + NOTE_NAMES.indexOf(base)
}

export function noteToMidi(note: string, octave = 4): number {
  if (/[0-9]/.test(note)) return nameToMidi(note)
  return nameToMidi(note, octave)
}

export function scalePitchClasses(root: string | number, scaleId: string): number[] {
  const rootPc = noteToPc(root)
  const scale = getScale(scaleId)
  return scale.intervals.map((i) => (rootPc + i) % 12)
}

export function scaleNoteNames(root: string, scaleId: string): NoteName[] {
  return scalePitchClasses(root, scaleId).map(pcToName)
}

export function chordPitchClasses(root: string | number, chordId: ChordId | string): number[] {
  const rootPc = noteToPc(root)
  const chord = CHORDS[chordId as ChordId] ?? CHORDS.maj
  return chord.intervals.map((i) => (rootPc + (i % 12)) % 12)
}

/** Map chord-symbol quality text → ChordId (shared by chordNotes + parseChordSymbol). */
export function resolveChordId(quality: string): ChordId {
  const q = (quality || 'maj').trim().toLowerCase()
  if (q === '' || q === 'maj' || q === 'major' || q === '△' || q === 'Δ') return 'maj'
  if (q === 'm' || q === 'min' || q === 'minor' || q === '-') return 'min'
  const map: Record<string, ChordId> = {
    '7': '7',
    dom7: '7',
    maj7: 'maj7',
    major7: 'maj7',
    '△7': 'maj7',
    'Δ7': 'maj7',
    m7: 'min7',
    min7: 'min7',
    mi7: 'min7',
    '-7': 'min7',
    dim: 'dim',
    '°': 'dim',
    o: 'dim',
    dim7: 'dim7',
    '°7': 'dim7',
    o7: 'dim7',
    m7b5: 'm7b5',
    min7b5: 'm7b5',
    'ø': 'm7b5',
    'ø7': 'm7b5',
    halfdim: 'm7b5',
    aug: 'aug',
    '+': 'aug',
    sus2: 'sus2',
    sus4: 'sus4',
    sus: 'sus4',
    '9': '9',
    dom9: '9',
    add9: 'add9',
    '6': '6',
    maj6: '6',
    min6: 'min6',
    m6: 'min6',
    '5': '5',
    power: '5',
  }
  if (map[q]) return map[q]
  // Prefix match for symbols like "maj7#11" → maj7, "m7b9" → min7
  if (q.startsWith('maj7') || q.startsWith('major7')) return 'maj7'
  if (q.startsWith('m7b5') || q.startsWith('min7b5') || q.startsWith('ø')) return 'm7b5'
  if (q.startsWith('m7') || q.startsWith('min7') || q.startsWith('mi7') || q.startsWith('-7'))
    return 'min7'
  if (q.startsWith('dim7') || q.startsWith('°7') || q.startsWith('o7')) return 'dim7'
  if (q.startsWith('dim') || q.startsWith('°')) return 'dim'
  if (q.startsWith('aug') || q.startsWith('+')) return 'aug'
  if (q.startsWith('sus2')) return 'sus2'
  if (q.startsWith('sus')) return 'sus4'
  if (q.startsWith('add9')) return 'add9'
  if (q === '9' || q.startsWith('9')) return '9'
  if (q.startsWith('m6') || q.startsWith('min6')) return 'min6'
  if (q.startsWith('6')) return '6'
  if (q.startsWith('7')) return '7'
  if (q.startsWith('m') || q.startsWith('min') || q.startsWith('-')) return 'min'
  return 'maj'
}

export function chordNotes(root: string, quality: string): number[] {
  const id = resolveChordId(quality)
  const base = 60 + noteToPc(root)
  return CHORDS[id].intervals.map((i) => base + i)
}

export function degreeLabel(root: string | number, note: string | number, scaleId: string): string | null {
  const rootPc = noteToPc(root)
  const notePc = noteToPc(note)
  const interval = (notePc - rootPc + 12) % 12
  const defn = getScale(scaleId)
  const idx = defn.intervals.indexOf(interval)
  return idx >= 0 ? defn.degrees[idx] : null
}

export function degreeOf(pc: number, rootPc: number, scale: ScaleDef | string): string | null {
  const scaleDef = typeof scale === 'string' ? getScale(scale) : scale
  const interval = (pc - rootPc + 12) % 12
  const idx = scaleDef.intervals.indexOf(interval)
  return idx >= 0 ? scaleDef.degrees[idx] : null
}

export interface FretCell {
  string: number
  fret: number
  midi: number
  pc: number
  note: NoteName
  inScale: boolean
  isRoot: boolean
  degree: string | null
}

export function buildFretboard(options: {
  tuning?: number[]
  frets?: number
  root: string | number
  scaleId: string
  lefty?: boolean
}): FretCell[][] {
  const tuning = options.tuning ?? [...STANDARD_TUNING]
  const frets = options.frets ?? 15
  const rootPc = noteToPc(options.root)
  const pcs = new Set(scalePitchClasses(options.root, options.scaleId))
  const strings = options.lefty ? [...tuning].reverse() : tuning

  return strings.map((openMidi, stringIndex) => {
    const row: FretCell[] = []
    for (let fret = 0; fret <= frets; fret++) {
      const midi = openMidi + fret
      const pc = ((midi % 12) + 12) % 12
      row.push({
        string: stringIndex,
        fret,
        midi,
        pc,
        note: pcToName(pc),
        inScale: pcs.has(pc),
        isRoot: pc === rootPc,
        degree: degreeLabel(options.root, pc, options.scaleId),
      })
    }
    return row
  })
}

export function fretboardNotes(
  tuning: number[],
  frets: number,
  scale: ScaleDef | string,
  rootPc: number,
): FretCell[][] {
  const scaleDef = typeof scale === 'string' ? getScale(scale) : scale
  return buildFretboard({
    tuning,
    frets,
    root: rootPc,
    scaleId: scaleDef.id,
  })
}

/** Best fretting for a single MIDI pitch on the given tuning (string 0 = low E). */
export function frettingForMidi(
  midi: number,
  tuning: number[] = [...STANDARD_TUNING],
  preferFret = 0,
  opts?: { preferString?: number; maxFret?: number; positionCenter?: number },
): { string: number; fret: number; midi: number } | null {
  const maxFret = opts?.maxFret ?? 17
  const positionCenter = opts?.positionCenter ?? preferFret
  let best: { string: number; fret: number; midi: number; score: number } | null = null
  for (let s = 0; s < tuning.length; s++) {
    const fret = midi - tuning[s]
    if (fret < 0 || fret > maxFret) continue
    const dist = Math.abs(fret - preferFret)
    const stringJump =
      opts?.preferString != null ? Math.abs(s - opts.preferString) * 1.15 : 0
    // Prefer staying in a hand position (4-fret window) and mid-neck comfort
    const outOfPosition = Math.abs(fret - positionCenter) > 4 ? Math.abs(fret - positionCenter) * 0.55 : 0
    const openBias = fret === 0 && preferFret > 3 ? 0.4 : 0
    const highFretPenalty = fret > 12 ? (fret - 12) * 0.08 : 0
    const score =
      dist * 1.1 +
      stringJump +
      outOfPosition +
      openBias +
      highFretPenalty +
      fret * 0.015 +
      (tuning.length - 1 - s) * 0.02
    if (!best || score < best.score) best = { string: s, fret, midi, score }
  }
  return best ? { string: best.string, fret: best.fret, midi: best.midi } : null
}

/**
 * Map a melody line to playable frets with hand continuity
 * (prefer previous position / nearby string, smooth position shifts).
 * Optional 1-note look-ahead reduces dead-end positions before big leaps.
 *
 * When `onsets` is provided (same length as midis), notes that share an onset
 * are fretted as a chord: unique strings, compact fret span (playable grip).
 */
export type FretPositionPrefer = 'auto' | 'open' | 'mid'

export function frettingSequence(
  midis: number[],
  tuning: number[] = [...STANDARD_TUNING],
  opts?: {
    onsets?: number[]
    onsetEps?: number
    /** Prefer open position (0–5), mid neck (5–7), or continuity-only auto. */
    preferPosition?: FretPositionPrefer
  },
): Array<{ string: number; fret: number; midi: number }> {
  const onsets = opts?.onsets
  const onsetEps = opts?.onsetEps ?? 1e-3
  const preferPosition: FretPositionPrefer = opts?.preferPosition ?? 'auto'
  if (onsets && onsets.length === midis.length && midis.length > 0) {
    return frettingSequenceWithOnsets(midis, onsets, tuning, onsetEps, preferPosition)
  }

  const out: Array<{ string: number; fret: number; midi: number }> = []
  let preferFret = preferPosition === 'open' ? 2 : preferPosition === 'mid' ? 7 : 5
  let preferString: number | undefined
  let positionCenter = preferFret
  for (let i = 0; i < midis.length; i++) {
    const midi = midis[i]
    const next = midis[i + 1]
    const base =
      frettingForMidi(midi, tuning, preferFret, {
        preferString,
        positionCenter,
        maxFret: preferPosition === 'open' ? 12 : 17,
      }) || {
        string: 0,
        fret: Math.max(0, Math.min(17, midi - tuning[0])),
        midi,
      }

    // Look-ahead: if next note is far, prefer a fretting that keeps the hand ready
    let f = base
    if (next != null && Math.abs(next - midi) >= 3) {
      let best = base
      let bestCost = Infinity
      for (let s = 0; s < tuning.length; s++) {
        const fret = midi - tuning[s]
        if (fret < 0 || fret > 17) continue
        const here =
          Math.abs(fret - preferFret) * 1.1 +
          (preferString != null ? Math.abs(s - preferString) * 1.2 : 0) +
          (Math.abs(fret - positionCenter) > 4 ? Math.abs(fret - positionCenter) * 0.5 : 0)
        // Cost of reaching next from this candidate
        let nextCost = 6
        for (let ns = 0; ns < tuning.length; ns++) {
          const nf = next - tuning[ns]
          if (nf < 0 || nf > 17) continue
          const c =
            Math.abs(ns - s) * 1.3 + Math.abs(nf - fret) * 0.55 + (nf > 12 ? (nf - 12) * 0.15 : 0)
          if (c < nextCost) nextCost = c
        }
        const cost = here * 0.65 + nextCost
        if (cost < bestCost) {
          bestCost = cost
          best = { string: s, fret, midi }
        }
      }
      f = best
    }

    out.push(f)
    // Slow hand drift — don't teleport the position every note
    preferFret = Math.round(preferFret * 0.35 + f.fret * 0.65)
    preferString = f.string
    if (f.fret > 0) {
      positionCenter = Math.round(positionCenter * 0.55 + f.fret * 0.45)
    }
  }
  return out
}

/**
 * Fret a simultaneous chord: one string per pitch, compact hand shape.
 * Greedy assign from low pitch → high, preferring unused strings near positionCenter.
 */
export function fretChordVoices(
  midis: number[],
  tuning: number[] = [...STANDARD_TUNING],
  opts?: { positionCenter?: number; maxFret?: number },
): Array<{ string: number; fret: number; midi: number }> {
  const maxFret = opts?.maxFret ?? 17
  const positionCenter = opts?.positionCenter ?? 5
  const order = midis
    .map((midi, idx) => ({ midi, idx }))
    .sort((a, b) => a.midi - b.midi || a.idx - b.idx)

  const used = new Set<number>()
  const placed: Array<{ string: number; fret: number; midi: number; idx: number }> = []

  for (const { midi, idx } of order) {
    let best: { string: number; fret: number; midi: number; score: number } | null = null
    for (let s = 0; s < tuning.length; s++) {
      if (used.has(s)) continue
      const fret = midi - tuning[s]
      if (fret < 0 || fret > maxFret) continue
      const spanPenalty =
        placed.length > 0
          ? Math.max(
              0,
              ...placed.map((p) => Math.abs(fret - p.fret)),
            ) > 4
            ? Math.max(...placed.map((p) => Math.abs(fret - p.fret))) * 0.7
            : 0
          : 0
      const score =
        Math.abs(fret - positionCenter) * 1.1 +
        spanPenalty +
        (fret > 12 ? (fret - 12) * 0.12 : 0) +
        fret * 0.02
      if (!best || score < best.score) best = { string: s, fret, midi, score }
    }
    // Fallback: allow string reuse only if no free string works (rare)
    if (!best) {
      for (let s = 0; s < tuning.length; s++) {
        const fret = midi - tuning[s]
        if (fret < 0 || fret > maxFret) continue
        const score = Math.abs(fret - positionCenter) + (used.has(s) ? 8 : 0)
        if (!best || score < best.score) best = { string: s, fret, midi, score }
      }
    }
    if (!best) {
      best = {
        string: 0,
        fret: Math.max(0, Math.min(maxFret, midi - tuning[0])),
        midi,
        score: 99,
      }
    }
    used.add(best.string)
    placed.push({ string: best.string, fret: best.fret, midi, idx })
  }

  placed.sort((a, b) => a.idx - b.idx)
  return placed.map(({ string, fret, midi }) => ({ string, fret, midi }))
}

function frettingSequenceWithOnsets(
  midis: number[],
  onsets: number[],
  tuning: number[],
  onsetEps: number,
  preferPosition: FretPositionPrefer = 'auto',
): Array<{ string: number; fret: number; midi: number }> {
  const out: Array<{ string: number; fret: number; midi: number }> = new Array(midis.length)
  let preferFret = preferPosition === 'open' ? 2 : preferPosition === 'mid' ? 7 : 5
  let preferString: number | undefined
  let positionCenter = preferFret
  const maxFret = preferPosition === 'open' ? 12 : 17
  let i = 0
  while (i < midis.length) {
    const t0 = onsets[i]
    const groupIdx: number[] = [i]
    let j = i + 1
    while (j < midis.length && Math.abs(onsets[j] - t0) <= onsetEps) {
      groupIdx.push(j)
      j++
    }

    if (groupIdx.length === 1) {
      const midi = midis[i]
      const nextSolo = j < midis.length && Math.abs(onsets[j] - t0) > onsetEps ? midis[j] : undefined
      let f =
        frettingForMidi(midi, tuning, preferFret, {
          preferString,
          positionCenter,
          maxFret,
        }) || {
          string: 0,
          fret: Math.max(0, Math.min(maxFret, midi - tuning[0])),
          midi,
        }
      if (nextSolo != null && Math.abs(nextSolo - midi) >= 3) {
        let best = f
        let bestCost = Infinity
        for (let s = 0; s < tuning.length; s++) {
          const fret = midi - tuning[s]
          if (fret < 0 || fret > 17) continue
          const here =
            Math.abs(fret - preferFret) * 1.1 +
            (preferString != null ? Math.abs(s - preferString) * 1.2 : 0)
          let nextCost = 6
          for (let ns = 0; ns < tuning.length; ns++) {
            const nf = nextSolo - tuning[ns]
            if (nf < 0 || nf > 17) continue
            const c = Math.abs(ns - s) * 1.3 + Math.abs(nf - fret) * 0.55
            if (c < nextCost) nextCost = c
          }
          const cost = here * 0.65 + nextCost
          if (cost < bestCost) {
            bestCost = cost
            best = { string: s, fret, midi }
          }
        }
        f = best
      }
      out[i] = f
      preferFret = Math.round(preferFret * 0.35 + f.fret * 0.65)
      preferString = f.string
      if (f.fret > 0) positionCenter = Math.round(positionCenter * 0.55 + f.fret * 0.45)
    } else {
      const chordMidis = groupIdx.map((k) => midis[k])
      const grip = fretChordVoices(chordMidis, tuning, { positionCenter })
      for (let g = 0; g < groupIdx.length; g++) {
        out[groupIdx[g]] = grip[g]
      }
      const frets = grip.map((x) => x.fret).filter((f) => f > 0)
      if (frets.length) {
        const avg = frets.reduce((a, b) => a + b, 0) / frets.length
        preferFret = Math.round(preferFret * 0.3 + avg * 0.7)
        positionCenter = Math.round(positionCenter * 0.45 + avg * 0.55)
      }
      preferString = grip[Math.floor(grip.length / 2)]?.string
    }
    i = j
  }
  return out
}

/**
 * Second pass: reduce large string jumps when a same-pitch neighbor fretting exists.
 */
export function smoothFrettingRun(
  run: Array<{ string: number; fret: number; midi: number }>,
  tuning: number[] = [...STANDARD_TUNING],
): Array<{ string: number; fret: number; midi: number }> {
  if (run.length < 2) return run.map((r) => ({ ...r }))
  const out = run.map((r) => ({ ...r }))
  for (let i = 1; i < out.length; i++) {
    const prev = out[i - 1]
    const cur = out[i]
    if (Math.abs(cur.string - prev.string) <= 1 && Math.abs(cur.fret - prev.fret) <= 5) continue
    let best = cur
    let bestCost =
      Math.abs(cur.string - prev.string) * 2 + Math.abs(cur.fret - prev.fret) * 0.5
    for (let s = 0; s < tuning.length; s++) {
      const fret = cur.midi - tuning[s]
      if (fret < 0 || fret > 17) continue
      const cost =
        Math.abs(s - prev.string) * 2 +
        Math.abs(fret - prev.fret) * 0.5 +
        (fret > 12 ? (fret - 12) * 0.2 : 0)
      if (cost < bestCost) {
        bestCost = cost
        best = { string: s, fret, midi: cur.midi }
      }
    }
    out[i] = best
  }
  return out
}

export function frettingForPcs(
  pcs: number[],
  tuning: number[] = [...STANDARD_TUNING],
  preferFret = 0,
  window = 4,
): Array<{ string: number; fret: number; midi: number } | null> {
  return pcs.map((pc) => {
    let best: { string: number; fret: number; midi: number; score: number } | null = null
    for (let s = 0; s < tuning.length; s++) {
      for (let f = 0; f <= 15; f++) {
        const midi = tuning[s] + f
        if (((midi % 12) + 12) % 12 !== ((pc % 12) + 12) % 12) continue
        const dist = Math.abs(f - preferFret)
        const inWindow = f >= preferFret && f <= preferFret + window ? 0 : 3
        const score = dist + inWindow + (15 - s) * 0.05
        if (!best || score < best.score) best = { string: s, fret: f, midi, score }
      }
    }
    return best ? { string: best.string, fret: best.fret, midi: best.midi } : null
  })
}

export function scalePositions(
  pcs: number[],
  tuning: number[] = [...STANDARD_TUNING],
  minFret = 0,
  maxFret = 12,
): Array<{ string: number; fret: number; midi: number }> {
  const out: Array<{ string: number; fret: number; midi: number }> = []
  const set = new Set(pcs.map((p) => ((p % 12) + 12) % 12))
  for (let s = 0; s < tuning.length; s++) {
    for (let f = minFret; f <= maxFret; f++) {
      const midi = tuning[s] + f
      if (set.has(((midi % 12) + 12) % 12)) out.push({ string: s, fret: f, midi })
    }
  }
  return out
}

export function detectKeyFromPcs(pcs: number[]): { root: NoteName; scaleId: ScaleId; score: number } {
  const unique = [...new Set(pcs.map((p) => ((p % 12) + 12) % 12))]
  const candidates = [
    'major',
    'natural_minor',
    'dorian',
    'mixolydian',
    'minor_pentatonic',
    'major_pentatonic',
    'blues',
  ]
  let best = { root: 'C' as NoteName, scaleId: 'major' as ScaleId, score: -1 }
  for (const scaleId of candidates) {
    for (let root = 0; root < 12; root++) {
      const set = new Set(scalePitchClasses(root, scaleId))
      let hit = 0
      let miss = 0
      for (const p of unique) {
        if (set.has(p)) hit++
        else miss++
      }
      const coverage = hit / Math.max(set.size, 1)
      const score = hit * 2 - miss * 3 + coverage
      if (score > best.score) best = { root: pcToName(root), scaleId: scaleId as ScaleId, score }
    }
  }
  return best
}

export function detectKeyAndScale(notes: number[]): {
  rootPc: number
  scaleId: string
  root: NoteName
  score: number
} {
  const pcs = notes.map((n) => ((n % 12) + 12) % 12)
  const d = detectKeyFromPcs(pcs)
  return { rootPc: noteToPc(d.root), scaleId: d.scaleId, root: d.root, score: d.score }
}

export function transposePc(pc: number, semitones: number): number {
  return (((pc + semitones) % 12) + 12) % 12
}

export function parseChordSymbol(
  symbol: string,
): { root: string; quality: string; chordId: ChordId } | null {
  const m = symbol.trim().match(/^([A-Ga-g][#b♯♭]?)(.*)$/)
  if (!m) return null
  let rootRaw = m[1].replace('♯', '#').replace('♭', 'b')
  // Capitalize note letter
  rootRaw = rootRaw.charAt(0).toUpperCase() + rootRaw.slice(1)
  let root: string
  try {
    root = normalizeNoteName(rootRaw)
  } catch {
    return null
  }
  const rest = (m[2] || '').trim()
  const chordId = resolveChordId(rest === '' ? 'maj' : rest)
  const quality = rest === '' ? 'maj' : rest
  return { root, quality, chordId }
}

export function cagedShapes(root: string, quality: 'major' | 'minor' = 'major') {
  const rootPc = noteToPc(root)
  const majorForms = [
    { name: 'C form', openRoot: noteToPc('C'), barreHint: false },
    { name: 'A form', openRoot: noteToPc('A'), barreHint: true },
    { name: 'G form', openRoot: noteToPc('G'), barreHint: false },
    { name: 'E form', openRoot: noteToPc('E'), barreHint: true },
    { name: 'D form', openRoot: noteToPc('D'), barreHint: false },
  ]
  return majorForms.map((f) => {
    const fret = (rootPc - f.openRoot + 12) % 12
    return { ...f, fret, quality, root: pcToName(rootPc) }
  })
}

export function intervalName(semitones: number): string {
  const names = [
    'Unison',
    'Minor 2nd',
    'Major 2nd',
    'Minor 3rd',
    'Major 3rd',
    'Perfect 4th',
    'Tritone',
    'Perfect 5th',
    'Minor 6th',
    'Major 6th',
    'Minor 7th',
    'Major 7th',
    'Octave',
  ]
  return names[((semitones % 12) + 12) % 12] ?? `${semitones} st`
}
