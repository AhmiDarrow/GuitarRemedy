/**
 * Lesson diagrams — theory-backed specs for Learn UI.
 *
 * Policy (hard):
 * - No stock photos, no freeform AI fretting art (too easy to mislabel frets/strings).
 * - Every diagram is generated from `src/lib/theory.ts` at resolve time.
 * - Accuracy is enforced by unit tests against the theory engine.
 * - Learn UI only shows neck-quality kinds (chord chart + live Fretboard).
 * - Text-only kinds (posture / rhythm_grid / caged_map / finger_numbers) stay in data
 *   for tests but are filtered out of the gallery — better empty than ugly.
 */

import {
  CHORDS,
  NOTE_NAMES,
  STANDARD_TUNING,
  chordPitchClasses,
  frettingForPcs,
  getScale,
  intervalName,
  noteToPc,
  parseChordSymbol,
  pcToName,
  resolveChordId,
  scalePitchClasses,
  type ChordId,
  type NoteName,
} from '../lib/theory'

/** Diagram kinds the Learn UI knows how to render. */
export type LessonDiagramKind =
  | 'open_strings'
  | 'chord_shape'
  | 'scale_tones'
  | 'interval'
  | 'posture'
  | 'rhythm_grid'
  | 'caged_map'
  | 'power_chord'
  | 'finger_numbers'

export interface LessonDiagramSpec {
  /** Stable id for tests + analytics */
  id: string
  kind: LessonDiagramKind
  /** Short title above the figure */
  title: string
  /** Optional one-line teaching note (plain language, no license claims) */
  caption?: string
  /** Optional root note name (C, G, Em root, …) */
  root?: string
  /** Scale id (snake_case) when kind needs scale tones */
  scaleId?: string
  /** Chord symbol or quality id when kind is chord_shape / power_chord */
  chord?: string
  /** Interval in semitones (interval diagrams) */
  semitones?: number
  /** Max frets to draw (default 5 for shapes, 12 for scales) */
  frets?: number
  /** Optional internal stamp for tests only — never shown in UI */
  license?: string
  /** Optional internal stamp for tests only — never shown in UI */
  verifiedBy?: 'theory-engine'
}

export interface DiagramDot {
  /** Theory string index: 0 = low E … 5 = high e */
  string: number
  fret: number
  label: string
  isRoot?: boolean
  muted?: boolean
}

export interface ResolvedLessonDiagram {
  spec: LessonDiagramSpec
  /** Open-string labels low→high for the neck header */
  openLabels: string[]
  dots: DiagramDot[]
  /** Extra text rows (intervals, posture tips, etc.) */
  notes: string[]
  /** Pitch classes the figure claims — used by accuracy tests */
  claimedPcs: number[]
  /** Plain monospace figure for the Learn UI (high→low e…E) */
  ascii: string
}

/** Display order high e → low E (tab convention). */
const ASCII_STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E'] as const

/**
 * Build a monospace chord/tab block from theory-string dots (0 = low E).
 * Open = 0, mute = x, fretted = fret number (multi-digit ok).
 */
export function dotsToAsciiTab(dots: DiagramDot[], title?: string): string {
  const byTheory = new Map<number, DiagramDot>()
  for (const d of dots) byTheory.set(d.string, d)
  const lines: string[] = []
  if (title) lines.push(title)
  for (let display = 0; display < 6; display++) {
    const theory = 5 - display
    const lab = ASCII_STRING_LABELS[display]
    const d = byTheory.get(theory)
    let cell = '-'
    if (d?.muted) cell = 'x'
    else if (d) cell = d.fret === 0 ? '0' : String(d.fret)
    // pad frets to keep columns readable
    const body = cell.length === 1 ? `-${cell}-` : `-${cell}`
    lines.push(`${lab}|${body.padEnd(5, '-')}|`)
  }
  return lines.join('\n')
}

/** Horizontal fret slice for scales / intervals (high e → low E). */
export function dotsToAsciiFretMap(
  dots: DiagramDot[],
  frets = 5,
  title?: string,
): string {
  const maxF = Math.max(frets, ...dots.filter((d) => !d.muted).map((d) => d.fret), 0)
  const end = Math.min(12, Math.max(maxF, 3))
  const lines: string[] = []
  if (title) lines.push(title)
  const header = ['  ', ...Array.from({ length: end + 1 }, (_, f) => String(f).padStart(2, ' '))].join(
    ' ',
  )
  lines.push(header)
  for (let display = 0; display < 6; display++) {
    const theory = 5 - display
    const lab = ASCII_STRING_LABELS[display]
    const cells: string[] = []
    for (let f = 0; f <= end; f++) {
      const hit = dots.find((d) => d.string === theory && !d.muted && d.fret === f)
      if (!hit) cells.push(' .')
      else if (hit.isRoot) cells.push(' R')
      else if (hit.label && hit.label !== '·' && hit.label !== '●' && hit.label.length <= 2)
        cells.push(hit.label.padStart(2, ' '))
      else cells.push(' o')
    }
    lines.push(`${lab} ${cells.join(' ')}`)
  }
  return lines.join('\n')
}

export function notesToAsciiBlock(notes: string[], title?: string): string {
  const lines: string[] = []
  if (title) lines.push(title)
  for (const n of notes) {
    // Full sentences — never truncate mid-thought for display data
    lines.push(`· ${n}`)
  }
  return lines.join('\n')
}

export function rhythmToAscii(beats = 4, title?: string): string {
  const n = Math.max(2, Math.min(8, beats))
  const cells = Array.from({ length: n }, (_, i) => (i === 0 ? '[1]' : ` ${i + 1} `))
  const lines = [
    title ?? 'Beat grid',
    cells.join(' '),
    'Accent beat 1 · count out loud',
  ]
  return lines.join('\n')
}

/** Attach ascii field from dots/notes/kind. */
export function buildDiagramAscii(resolved: Omit<ResolvedLessonDiagram, 'ascii'>): string {
  const { spec, dots, notes } = resolved
  switch (spec.kind) {
    case 'chord_shape':
    case 'open_strings':
    case 'power_chord':
      return dotsToAsciiTab(dots, spec.title)
    case 'scale_tones':
    case 'interval':
      return dotsToAsciiFretMap(dots, spec.frets ?? (spec.kind === 'interval' ? 12 : 5), spec.title)
    case 'rhythm_grid':
      return rhythmToAscii(spec.semitones ?? 4, spec.title)
    case 'posture':
    case 'finger_numbers':
    case 'caged_map':
    default:
      return notesToAsciiBlock(notes, spec.title)
  }
}

const OPEN_LABELS_LOW_TO_HIGH = ['E', 'A', 'D', 'G', 'B', 'e'] as const

/** Canonical open-position chord shapes (theory string 0 = low E). Verified in tests. */
export const OPEN_CHORD_SHAPES: Record<
  string,
  { frets: (number | 'x')[]; fingers?: (number | null)[]; rootString: number }
> = {
  // frets[0] = low E … frets[5] = high e
  Em: { frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null], rootString: 0 },
  E: { frets: [0, 2, 2, 1, 0, 0], fingers: [null, 2, 3, 1, null, null], rootString: 0 },
  Am: { frets: ['x', 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null], rootString: 1 },
  A: { frets: ['x', 0, 2, 2, 2, 0], fingers: [null, null, 1, 2, 3, null], rootString: 1 },
  Dm: { frets: ['x', 'x', 0, 2, 3, 1], fingers: [null, null, null, 2, 3, 1], rootString: 2 },
  D: { frets: ['x', 'x', 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2], rootString: 2 },
  G: { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, null, null, null, 3], rootString: 0 },
  C: { frets: ['x', 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null], rootString: 1 },
  F: { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], rootString: 0 }, // mini barre shape
  B7: { frets: ['x', 2, 1, 2, 0, 2], fingers: [null, 2, 1, 3, null, 4], rootString: 1 },
  // Common open dominants (theory-checked)
  G7: { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, null, null, null, 1], rootString: 0 },
  D7: { frets: ['x', 'x', 0, 2, 1, 2], fingers: [null, null, null, 2, 1, 3], rootString: 2 },
  A7: { frets: ['x', 0, 2, 0, 2, 0], fingers: [null, null, 2, null, 3, null], rootString: 1 },
  E7: { frets: [0, 2, 0, 1, 0, 0], fingers: [null, 2, null, 1, null, null], rootString: 0 },
  C7: { frets: ['x', 3, 2, 3, 1, 0], fingers: [null, 3, 2, 4, 1, null], rootString: 1 },
}

function openShapePcs(shapeKey: string): number[] {
  const shape = OPEN_CHORD_SHAPES[shapeKey]
  if (!shape) return []
  const pcs: number[] = []
  shape.frets.forEach((f, s) => {
    if (f === 'x') return
    const midi = STANDARD_TUNING[s] + f
    pcs.push(((midi % 12) + 12) % 12)
  })
  return [...new Set(pcs)].sort((a, b) => a - b)
}

function chordSymbolToShapeKey(chord: string): string | null {
  const parsed = parseChordSymbol(chord)
  if (!parsed) {
    // bare quality keys like Em already in table
    if (OPEN_CHORD_SHAPES[chord]) return chord
    return null
  }
  const { root, chordId } = parsed
  const sym = CHORDS[chordId as ChordId]?.symbol ?? ''
  // Prefer exact open-shape keys: Em, G, C, …
  const candidates = [
    `${root}${sym}`,
    `${root}${chordId === 'min' ? 'm' : sym}`,
    root + (chordId === 'maj' ? '' : chordId === 'min' ? 'm' : sym),
  ]
  for (const c of candidates) {
    if (OPEN_CHORD_SHAPES[c]) return c
  }
  // Try enharmonic-free common names
  if (chordId === 'min' && OPEN_CHORD_SHAPES[`${root}m`]) return `${root}m`
  if (chordId === 'maj' && OPEN_CHORD_SHAPES[root]) return root
  if (chordId === '7' && OPEN_CHORD_SHAPES[`${root}7`]) return `${root}7`
  return OPEN_CHORD_SHAPES[chord] ? chord : null
}

/** Resolve a diagram spec into drawable dots + claimed pitch classes. */
export function resolveLessonDiagram(spec: LessonDiagramSpec): ResolvedLessonDiagram {
  const openLabels = [...OPEN_LABELS_LOW_TO_HIGH]
  const frets = spec.frets ?? (spec.kind === 'scale_tones' ? 12 : 5)
  const notes: string[] = []
  let dots: DiagramDot[] = []
  let claimedPcs: number[] = []

  switch (spec.kind) {
    case 'open_strings': {
      dots = STANDARD_TUNING.map((midi, s) => ({
        string: s,
        fret: 0,
        label: OPEN_LABELS_LOW_TO_HIGH[s],
        isRoot: false,
      }))
      claimedPcs = STANDARD_TUNING.map((m) => ((m % 12) + 12) % 12)
      notes.push('Standard tuning low→high: E2 A2 D3 G3 B3 E4')
      notes.push('String numbers in tab: 6 = low E, 1 = high e')
      break
    }
    case 'finger_numbers': {
      notes.push('1 = index · 2 = middle · 3 = ring · 4 = pinky · T = thumb (rare)')
      notes.push('Fretting hand: keep thumb behind the neck, not over the top (beginner default).')
      notes.push('Pick hand: rest-stroke or free-stroke — stay loose in the wrist.')
      dots = []
      claimedPcs = []
      break
    }
    case 'posture': {
      notes.push('Sit tall — guitar body on the leg matching your fretting hand side for classical, or casual across the right leg for folk.')
      notes.push('Neck angle slightly up; wrist straight enough that fretting fingers approach from above.')
      notes.push('If anything hurts, stop — pain is not a practice badge.')
      dots = []
      claimedPcs = []
      break
    }
    case 'rhythm_grid': {
      const beats = spec.semitones && spec.semitones > 0 ? spec.semitones : 4
      notes.push(`${beats}/4 grid: each cell is one beat. Count out loud: ${Array.from({ length: beats }, (_, i) => i + 1).join(' · ')}`)
      notes.push('Subdivision: 1 & 2 & = eighths · 1 e & a = sixteenths')
      dots = []
      claimedPcs = []
      break
    }
    case 'interval': {
      const st = ((spec.semitones ?? 7) % 12 + 12) % 12
      const root = spec.root ?? 'C'
      const rootPc = noteToPc(root)
      const otherPc = (rootPc + st) % 12
      claimedPcs = [rootPc, otherPc]
      notes.push(`${root} → ${pcToName(otherPc)} = ${intervalName(st)} (${st} semitone${st === 1 ? '' : 's'})`)
      notes.push('On one string: each fret = 1 semitone.')
      // Show on low E string for clarity
      dots = [
        { string: 0, fret: 0, label: pcToName(rootPc), isRoot: true },
        { string: 0, fret: st, label: pcToName(otherPc) },
      ]
      break
    }
    case 'chord_shape': {
      const chordRaw = spec.chord ?? 'Em'
      const shapeKey = chordSymbolToShapeKey(chordRaw) ?? (OPEN_CHORD_SHAPES[chordRaw] ? chordRaw : null)
      if (shapeKey && OPEN_CHORD_SHAPES[shapeKey]) {
        const shape = OPEN_CHORD_SHAPES[shapeKey]
        dots = shape.frets.map((f, s) => {
          if (f === 'x') return { string: s, fret: 0, label: '×', muted: true }
          const finger = shape.fingers?.[s]
          const fretNum = f as number
          return {
            string: s,
            fret: fretNum,
            label: finger != null ? String(finger) : fretNum === 0 ? 'o' : '●',
            isRoot: s === shape.rootString,
          }
        })
        claimedPcs = openShapePcs(shapeKey)
        const parsed = parseChordSymbol(shapeKey) ?? parseChordSymbol(chordRaw)
        if (parsed) {
          const expect = chordPitchClasses(parsed.root, parsed.chordId).slice().sort((a, b) => a - b)
          notes.push(`${shapeKey}: pitch classes ${claimedPcs.map(pcToName).join(' · ')}`)
          notes.push(`Theory chord tones: ${expect.map(pcToName).join(' · ')}`)
        } else {
          notes.push(`${shapeKey} open shape (standard tuning)`)
        }
      } else {
        // Fall back to fretting engine from chord tones (may be movable shape)
        const parsed = parseChordSymbol(chordRaw)
        if (parsed) {
          const pcs = chordPitchClasses(parsed.root, parsed.chordId)
          const rootPc = noteToPc(parsed.root)
          claimedPcs = [...pcs].sort((a, b) => a - b)
          const fretsFound = frettingForPcs(pcs, [...STANDARD_TUNING], 0, frets)
          dots = fretsFound
            .filter((d): d is NonNullable<typeof d> => d != null)
            .map((d) => {
              const pc = ((d.midi % 12) + 12) % 12
              const isRoot = pc === rootPc
              return {
                string: d.string,
                fret: d.fret,
                label: isRoot ? 'R' : '●',
                isRoot,
              }
            })
          notes.push(`${chordRaw}: engine fretting (standard tuning, frets 0–${frets})`)
          notes.push(`Tones: ${claimedPcs.map(pcToName).join(' · ')}`)
        } else {
          notes.push(`Unknown chord “${chordRaw}” — no diagram dots.`)
        }
      }
      break
    }
    case 'power_chord': {
      const root = spec.root ?? 'E'
      const rootPc = noteToPc(root)
      // Root on A string (theory string 1) movable power: root + 2 frets on D = fifth
      const rootFret = (rootPc - noteToPc('A') + 12) % 12
      const fifthFret = rootFret + 2
      dots = [
        { string: 1, fret: rootFret, label: 'R', isRoot: true },
        { string: 2, fret: fifthFret, label: '5' },
      ]
      claimedPcs = [rootPc, (rootPc + 7) % 12].sort((a, b) => a - b)
      notes.push(`Power chord ${root}5 = root + perfect fifth (no 3rd → not major/minor).`)
      notes.push('Shape moves as a block; keep one-finger barre or 1+3 fingering.')
      break
    }
    case 'scale_tones': {
      const root = spec.root ?? 'C'
      // Never invent minor pentatonic — that scared Day-1 students when specs were incomplete.
      // Prefer explicit scaleId; fall back to major (neutral teaching default).
      const scaleId = spec.scaleId ?? 'major'
      const scale = getScale(scaleId)
      const pcs = scalePitchClasses(root, scaleId)
      claimedPcs = [...pcs].sort((a, b) => a - b)
      const rootPc = noteToPc(root)
      const maxFret = frets
      for (let s = 0; s < 6; s++) {
        for (let f = 0; f <= maxFret; f++) {
          const midi = STANDARD_TUNING[s] + f
          const pc = ((midi % 12) + 12) % 12
          if (!pcs.includes(pc)) continue
          // Prefer first position cluster for readability when frets <= 5
          if (maxFret <= 5 && f > maxFret) continue
          dots.push({
            string: s,
            fret: f,
            label: pc === rootPc ? 'R' : '·',
            isRoot: pc === rootPc,
          })
        }
      }
      notes.push(`${root} ${scale.name}: ${claimedPcs.map(pcToName).join(' · ')}`)
      notes.push(`Degrees: ${scale.degrees.join(' ')}`)
      break
    }
    case 'caged_map': {
      const root = spec.root ?? 'C'
      const rootPc = noteToPc(root)
      // Show five CAGED root frets on the appropriate strings as text map
      notes.push(`CAGED for ${root} major — five connected shapes across the neck.`)
      const forms = [
        { name: 'C form', open: noteToPc('C') },
        { name: 'A form', open: noteToPc('A') },
        { name: 'G form', open: noteToPc('G') },
        { name: 'E form', open: noteToPc('E') },
        { name: 'D form', open: noteToPc('D') },
      ]
      for (const f of forms) {
        const fret = (rootPc - f.open + 12) % 12
        notes.push(`${f.name}: root near fret ${fret === 0 ? 'open / 12' : fret}`)
      }
      claimedPcs = [rootPc]
      dots = []
      break
    }
    default:
      notes.push('No diagram data.')
  }

  const base = { spec, openLabels, dots, notes, claimedPcs }
  return { ...base, ascii: buildDiagramAscii(base) }
}

/** Map library item ids → neck diagrams (source of truth for lesson links). */
const LIBRARY_DIAGRAMS: Record<string, Omit<LessonDiagramSpec, 'id'>> = {
  'ch-em': { kind: 'chord_shape', title: 'Open Em', chord: 'Em', caption: 'Two-finger home base.' },
  'ch-e': { kind: 'chord_shape', title: 'Open E', chord: 'E', caption: 'Full six-string major.' },
  'ch-am': { kind: 'chord_shape', title: 'Open Am', chord: 'Am', caption: 'Open A minor.' },
  'ch-a': { kind: 'chord_shape', title: 'Open A', chord: 'A', caption: 'Open A major.' },
  'ch-dm': { kind: 'chord_shape', title: 'Open Dm', chord: 'Dm', caption: 'Open D minor.' },
  'ch-d': { kind: 'chord_shape', title: 'Open D', chord: 'D', caption: 'Triangle on top four strings.' },
  'ch-g': { kind: 'chord_shape', title: 'Open G', chord: 'G', caption: 'Open G major.' },
  'ch-c': { kind: 'chord_shape', title: 'Open C', chord: 'C', caption: 'Five-string open C.' },
  'ch-f': { kind: 'chord_shape', title: 'F shape', chord: 'F', caption: 'Mini barre gateway.' },
  'ch-g7': { kind: 'chord_shape', title: 'Open G7', chord: 'G7', caption: 'Dominant pull to C.' },
  'ch-d7': { kind: 'chord_shape', title: 'Open D7', chord: 'D7', caption: 'Dominant pull to G.' },
  'ch-a7': { kind: 'chord_shape', title: 'Open A7', chord: 'A7', caption: 'Blues / country dominant.' },
  'ch-e7': { kind: 'chord_shape', title: 'Open E7', chord: 'E7', caption: 'Blues in A dominant.' },
  'ch-c7': { kind: 'chord_shape', title: 'Open C7', chord: 'C7', caption: 'Blues turnaround color.' },
  'ch-b7': { kind: 'chord_shape', title: 'Open B7', chord: 'B7', caption: 'Open B7 shape.' },
  'sc-pent-min': {
    kind: 'scale_tones',
    title: 'A minor pentatonic',
    root: 'A',
    scaleId: 'minor_pentatonic',
    caption: 'Core lead box — roots marked.',
    frets: 12,
  },
  'sc-pent-maj': {
    kind: 'scale_tones',
    title: 'C major pentatonic',
    root: 'C',
    scaleId: 'major_pentatonic',
    caption: 'Major pent tones — roots marked.',
    frets: 12,
  },
  'sc-major': {
    kind: 'scale_tones',
    title: 'C major scale',
    root: 'C',
    scaleId: 'major',
    caption: 'Ionian tones on the neck.',
    frets: 12,
  },
  'sc-nat-min': {
    kind: 'scale_tones',
    title: 'A natural minor',
    root: 'A',
    scaleId: 'natural_minor',
    caption: 'Aeolian — relative minor of C.',
    frets: 12,
  },
  'sc-harm-min': {
    kind: 'scale_tones',
    title: 'A harmonic minor',
    root: 'A',
    scaleId: 'harmonic_minor',
    caption: 'Raised 7 — classical / metal pull.',
    frets: 12,
  },
  'sc-blues': {
    kind: 'scale_tones',
    title: 'A blues scale',
    root: 'A',
    scaleId: 'blues',
    caption: 'Minor pent + blue note.',
    frets: 12,
  },
  'sc-dorian': {
    kind: 'scale_tones',
    title: 'D Dorian',
    root: 'D',
    scaleId: 'dorian',
    caption: 'Minor with raised 6.',
    frets: 12,
  },
  'sc-mixo': {
    kind: 'scale_tones',
    title: 'G Mixolydian',
    root: 'G',
    scaleId: 'mixolydian',
    caption: 'Major with flat 7.',
    frets: 12,
  },
  'sc-lydian': {
    kind: 'scale_tones',
    title: 'F Lydian',
    root: 'F',
    scaleId: 'lydian',
    caption: 'Major with raised 4.',
    frets: 12,
  },
  'sc-phrygian': {
    kind: 'scale_tones',
    title: 'E Phrygian',
    root: 'E',
    scaleId: 'phrygian',
    caption: 'Minor with flat 2.',
    frets: 12,
  },
  'sc-locrian': {
    kind: 'scale_tones',
    title: 'B Locrian',
    root: 'B',
    scaleId: 'locrian',
    caption: 'Diminished tonic color.',
    frets: 12,
  },
}

/** Normalize lesson blob for chord/scale matching. */
export function normalizeLessonMatchText(lessonText: string): string {
  return lessonText.toLowerCase().replace(/[–—]/g, '-')
}

/**
 * True when lesson copy actually teaches this open-chord symbol as a shape to form.
 * Rejects triad spellings alone (e.g. "E G B" must not unlock Open G).
 */
/** Space/slash/arrow chord lists like "Em G C D A Am E" (not English prose). */
const CHORD_LIST_TOKEN =
  'em|am|dm|bm|f#m|bb|eb|ab|db|gb|g7|d7|a7|e7|c7|b7|fmaj7|maj7|em7|am7|dm7|g|c|d|a|e|f|b'
const CHORD_LIST_RE = new RegExp(
  `\\b(?:${CHORD_LIST_TOKEN})(?:\\s*[|→>/,-]\\s*|\\s+)(?:${CHORD_LIST_TOKEN})(?:(?:\\s*[|→>/,-]\\s*|\\s+)(?:${CHORD_LIST_TOKEN}))+\\b`,
  'i',
)

function chordAppearsInChordList(key: string, lessonNorm: string): boolean {
  // Only treat multi-chord runs as lists when at least one token is a multi-letter
  // chord symbol (em/am/g7/…). Bare "e g b" triad spellings must not qualify.
  const multiLetter = 'em|am|dm|bm|f#m|bb|eb|ab|db|gb|g7|d7|a7|e7|c7|b7|fmaj7|maj7|em7|am7|dm7'
  const anyTok = CHORD_LIST_TOKEN
  const sep = '(?:\\s*[|→>/,-]\\s*|\\s+)'
  const listRe = new RegExp(
    `\\b(?:${anyTok})(?:${sep}(?:${anyTok})){2,}\\b`,
    'gi',
  )
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const keyRe = new RegExp(`(^|[^a-z0-9#])${esc}([^a-z0-9#]|$)`, 'i')
  const multiRe = new RegExp(`(?:^|[^a-z0-9#])(?:${multiLetter})(?:[^a-z0-9#]|$)`, 'i')
  let m: RegExpExecArray | null
  while ((m = listRe.exec(lessonNorm)) !== null) {
    const run = m[0]
    if (!multiRe.test(run)) continue
    if (keyRe.test(run)) return true
  }
  return false
}

export function lessonTeachesOpenChord(symbol: string, lessonText: string): boolean {
  const n = normalizeLessonMatchText(lessonText)
  const sym = symbol.trim()
  const key = sym.toLowerCase()

  // Minors / sevenths — unique tokens (never bare English "am" / "i am")
  if (key === 'em') {
    return (
      /\be minor\b/.test(n) ||
      /(^|[^a-z])open em\b/.test(n) ||
      /(^|[^a-z])em chord\b/.test(n) ||
      /(^|[^a-z])em shape\b/.test(n) ||
      /\bem\s*(?:[|→>,/-]+|\s+to\s+)\s*(g|am|c|d|a|e)\b/.test(n) ||
      /\b(g|am|c|d|a|e)\s*(?:[|→>,/-]+|\s+to\s+)\s*em\b/.test(n) ||
      /\bform (a clear |an? )?em\b/.test(n) ||
      /\bbuild em\b/.test(n) ||
      /\bfret em\b/.test(n) ||
      /\brank em\b/.test(n) ||
      chordAppearsInChordList('em', n) ||
      // Chord symbol Em survives lowercasing as "em" — require neighbor chord/context
      (/(^|[^a-z])em\b/.test(n) &&
        (/chord|shape|open|change|campfire|strum|progression|grip|rank/.test(n) ||
          /\bem\s*(?:[|→>,/-]+|\s+to\s+)/.test(n) ||
          /(?:[|→>,/-]+|\s+to\s+)\s*em\b/.test(n)))
    )
  }
  if (key === 'am') {
    // Do NOT use bare /\bam\b/ — matches English "I am / you am" after lowercasing.
    return (
      /\ba minor\b/.test(n) ||
      /(^|[^a-z])open am\b/.test(n) ||
      /(^|[^a-z])am chord\b/.test(n) ||
      /(^|[^a-z])am shape\b/.test(n) ||
      /\bam7\b/.test(n) ||
      /\bam\s*(?:[|→>,/-]+|\s+to\s+)\s*(g|f|e|dm|c|d|em|g7|e7)\b/.test(n) ||
      /\b(g|f|e|dm|c|d|em)\s*(?:[|→>,/-]+|\s+to\s+)\s*am\b/.test(n) ||
      /\bform (a clear |an? )?am\b/.test(n) ||
      /\bbuild am\b/.test(n) ||
      /\bandalusian\b/.test(n) ||
      chordAppearsInChordList('am', n)
    )
  }
  if (key === 'dm') {
    return (
      /\bd minor\b/.test(n) ||
      /(^|[^a-z])open dm\b/.test(n) ||
      /(^|[^a-z])dm chord\b/.test(n) ||
      /(^|[^a-z])dm shape\b/.test(n) ||
      /\bdm\s*(?:[|→>,/-]+|\s+to\s+)\s*(g|g7|c|am|a|e|em)\b/.test(n) ||
      /\b(g|g7|c|am|a|e|em)\s*(?:[|→>,/-]+|\s+to\s+)\s*dm\b/.test(n) ||
      /\bform (a clear |an? )?dm\b/.test(n) ||
      /\bbuild dm\b/.test(n) ||
      chordAppearsInChordList('dm', n) ||
      // bare dm is rare in English prose
      (/(^|[^a-z])dm\b/.test(n) && /chord|shape|open|ii|jazz|change|progression/.test(n))
    )
  }
  if (key === 'g7') return /\bg7\b/.test(n)
  if (key === 'd7') return /\bd7\b/.test(n)
  if (key === 'a7') return /\ba7\b/.test(n)
  if (key === 'e7') return /\be7\b/.test(n)
  if (key === 'c7') return /\bc7\b/.test(n)
  if (key === 'b7') return /\bb7\b/.test(n)

  // Open majors — require shape language, not a letter inside "notes E G B"
  // Never match bare "a chord" / "e chord" as English "a chord" (any chord).
  if (key === 'e') {
    return (
      /\be major\b/.test(n) ||
      /(^|[^a-z])open e\b/.test(n) ||
      /(^|[^a-z])e maj\b/.test(n) ||
      /(?<![a-z0-9/#])e shape\b/.test(n) ||
      /(^|[^a-z])open e chord\b/.test(n) ||
      /(^|[^a-z])e major chord\b/.test(n) ||
      /\be\s*[|→>]+\s*[ad]\b/.test(n) ||
      /\b[ad]\s*[|→>]+\s*e\b/.test(n) ||
      /\b(a|d|am|em)\s*(?:[|→>,/-]+|\s+to\s+)\s*e\b/.test(n) ||
      /\be\s*(?:[|→>,/-]+|\s+to\s+)\s*(a|d|am|em)\b/.test(n) ||
      /\bform (a clear |an? )?e\b/.test(n) ||
      /\bbuild open e\b/.test(n) ||
      chordAppearsInChordList('e', n)
    )
  }
  if (key === 'a') {
    return (
      /\ba major\b/.test(n) ||
      /(^|[^a-z])open a\b/.test(n) ||
      /(^|[^a-z])a maj\b/.test(n) ||
      /(?<![a-z0-9/#])a shape\b/.test(n) ||
      /(^|[^a-z])open a chord\b/.test(n) ||
      /(^|[^a-z])a major chord\b/.test(n) ||
      /\ba-d-e\b/.test(n) ||
      /\ba d e\b/.test(n) ||
      /(^|[^a-z])a\s*&\s*e\b/.test(n) ||
      /\ba\s*[|→>]+\s*[de]\b/.test(n) ||
      /\b[de]\s*[|→>]+\s*a\b/.test(n) ||
      /\b(d|e|em|am|g)\s*(?:[|→>,/-]+|\s+to\s+)\s*a\b/.test(n) ||
      /\ba\s*(?:[|→>,/-]+|\s+to\s+)\s*(d|e|em|am|g)\b/.test(n) ||
      /\bform (an? )?open a\b/.test(n) ||
      /\bbuild open a\b/.test(n) ||
      chordAppearsInChordList('a', n)
    )
  }
  if (key === 'd') {
    return (
      /\bd major\b/.test(n) ||
      /(^|[^a-z])open d\b/.test(n) ||
      /(^|[^a-z])d maj\b/.test(n) ||
      /(?<![a-z0-9/#])d shape\b/.test(n) ||
      /(^|[^a-z])open d chord\b/.test(n) ||
      /(^|[^a-z])d major chord\b/.test(n) ||
      /\bd triangle\b/.test(n) ||
      /\bg-c-d\b/.test(n) ||
      /(^|[^a-z])em g c d\b/.test(n) ||
      /\bg c d\b/.test(n) ||
      // campfire set mentions — not bare "c d" in prose
      /\b(g|c|em|a)\s*(?:[|→>,/-]+|\s+to\s+)\s*d\b/.test(n) ||
      /\bd\s*(?:[|→>,/-]+|\s+to\s+)\s*(em|g|c|a)\b/.test(n) ||
      /\bform (a clear |an? )?d\b/.test(n) ||
      /\bbuild open d\b/.test(n) ||
      chordAppearsInChordList('d', n)
    )
  }
  if (key === 'g') {
    return (
      /\bg major\b/.test(n) ||
      /(^|[^a-z])open g\b/.test(n) ||
      /(^|[^a-z])g maj\b/.test(n) ||
      /(?<![a-z0-9/#])g shape\b/.test(n) ||
      /(^|[^a-z])open g chord\b/.test(n) ||
      /(^|[^a-z])g major chord\b/.test(n) ||
      // Real changes / campfire sets — not "notes E G B" or bare "g chord"
      /\bem\s*(?:[|→>,/-]+|\s+to\s+)\s*g\b/.test(n) ||
      /\bg\s*(?:[|→>,/-]+|\s+to\s+)\s*(em|c|d|am|e7|a7|d7)\b/.test(n) ||
      /(^|[^a-z])em g c d\b/.test(n) ||
      /\bg-c-d\b/.test(n) ||
      /\bg c d\b/.test(n) ||
      /\bform (a clear |an? )?g\b/.test(n) ||
      /\bbuild (open )?g\b/.test(n) ||
      /\bsecond chord[^\n.]{0,40}\bg\b/.test(n) ||
      // Pair drills: "E7→G", "Focus E7/G", "E7 and G", "swap E7 and G"
      /\be7\s*(?:→|->|\/|,)\s*g\b/.test(n) ||
      /\bg\s*(?:→|->|\/|,)\s*e7\b/.test(n) ||
      /\be7\s+and\s+g\b/.test(n) ||
      /\bg\s+and\s+e7\b/.test(n) ||
      /\bshape e7 and g\b/.test(n) ||
      /\bswap e7 and g\b/.test(n) ||
      /\bfocus e7\s*\/\s*g\b/.test(n) ||
      chordAppearsInChordList('g', n)
    )
  }
  if (key === 'c') {
    return (
      /\bc major\b/.test(n) ||
      /(^|[^a-z])open c\b/.test(n) ||
      /(^|[^a-z])c maj\b/.test(n) ||
      /(?<![a-z0-9/#])c shape\b/.test(n) ||
      /(^|[^a-z])open c chord\b/.test(n) ||
      /(^|[^a-z])c major chord\b/.test(n) ||
      /\bg-c-d\b/.test(n) ||
      /\bg-c\b/.test(n) ||
      /\bc-d\b/.test(n) ||
      /(^|[^a-z])em g c d\b/.test(n) ||
      /\bg c d\b/.test(n) ||
      /\b(g|d|em|am|f)\s*(?:[|→>,/-]+|\s+to\s+)\s*c\b/.test(n) ||
      /\bc\s*(?:[|→>,/-]+|\s+to\s+)\s*(g|d|em|am|f)\b/.test(n) ||
      /\bform (a clear |an? )?c\b/.test(n) ||
      /\bbuild (open )?c\b/.test(n) ||
      chordAppearsInChordList('c', n)
    )
  }
  if (key === 'f') {
    return (
      /\bf major\b/.test(n) ||
      /(^|[^a-z])open f\b/.test(n) ||
      /(^|[^a-z])f maj\b/.test(n) ||
      /(?<![a-z0-9/#])f shape\b/.test(n) ||
      /(^|[^a-z])open f chord\b/.test(n) ||
      /(^|[^a-z])f major chord\b/.test(n) ||
      /mini.?barre f/.test(n) ||
      /(^|[^a-z])full f\b/.test(n) ||
      /\bform (a clear |an? )?f\b/.test(n) ||
      /\bbuild (open |full )?f\b/.test(n) ||
      chordAppearsInChordList('f', n)
    )
  }

  // Fallback: full symbol as its own token (e.g. future shapes)
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`).test(n)
}

/**
 * True when lesson copy actually teaches this library neck item.
 * Prevents Day-1-style junk (e.g. sc-pent-min on open-string day).
 */
export function libraryDiagramMatchesLesson(libraryId: string, lessonText: string): boolean {
  const n = normalizeLessonMatchText(lessonText)
  const chordLib: Record<string, string> = {
    'ch-em': 'Em',
    'ch-e': 'E',
    'ch-am': 'Am',
    'ch-a': 'A',
    'ch-dm': 'Dm',
    'ch-d': 'D',
    'ch-g': 'G',
    'ch-c': 'C',
    'ch-f': 'F',
    'ch-g7': 'G7',
    'ch-d7': 'D7',
    'ch-a7': 'A7',
    'ch-e7': 'E7',
    'ch-c7': 'C7',
    'ch-b7': 'B7',
  }
  const chordSym = chordLib[libraryId]
  if (chordSym) return lessonTeachesOpenChord(chordSym, n)

  const scaleRules: Record<string, RegExp> = {
    'sc-pent-min': /minor pent|pentatonic minor|pent box|box 1|a minor pent/,
    'sc-pent-maj': /major pent|pentatonic major|bright twin/,
    'sc-major': /major scale|ionian|seven-note map/,
    'sc-nat-min': /natural minor|aeolian|relative minor/,
    'sc-harm-min': /harmonic minor/,
    'sc-blues': /blues scale|blue note/,
    'sc-dorian': /\bdorian\b(?!-ish)/,
    'sc-mixo': /\bmixolydian\b(?!-ish)|\bmixo\b/,
    'sc-lydian': /\blydian\b(?!-ish)/,
    'sc-phrygian': /\bphrygian\b(?!-ish)/,
    'sc-locrian': /\blocrian\b(?!-ish)/,
  }
  const re = scaleRules[libraryId]
  if (!re) return false
  return re.test(n)
}

/**
 * Pick diagrams for a curriculum day from phase + title/goals keywords.
 * Library neck figures only when the lesson text actually teaches them.
 * Always returns at least one plain figure per day (fallback by phase).
 */
export function diagramsForLesson(input: {
  day: number
  phase: string
  title: string
  goals: string[]
  drills: string[]
  theoryBite: string
  libraryIds?: string[]
}): LessonDiagramSpec[] {
  // Teaching copy only — never join libraryIds (ids like ch-a7 self-match).
  const text = [input.title, ...input.goals, ...input.drills, input.theoryBite]
    .join(' ')
    .toLowerCase()
  const out: LessonDiagramSpec[] = []
  const add = (spec: LessonDiagramSpec) => {
    out.push(spec)
  }

  // --- Library-linked neck figures only when lesson copy matches ---
  for (const lid of input.libraryIds ?? []) {
    const base = LIBRARY_DIAGRAMS[lid]
    if (!base) continue
    if (!libraryDiagramMatchesLesson(lid, text)) continue
    add({
      ...base,
      id: `day${input.day}-lib-${lid}`,
      frets: base.frets ?? (base.kind === 'scale_tones' ? 12 : 5),
    })
  }

  // --- Universal early foundations ---
  if (input.day <= 3 || /open string|string name|tuning|which string/.test(text)) {
    add({
      id: `day${input.day}-open-strings`,
      kind: 'open_strings',
      title: 'Open strings (standard)',
      caption: 'Low E through high e in standard tuning.',
    })
  }
  if (input.day <= 5 || /finger|posture|sit|thumb|hand/.test(text)) {
    add({
      id: `day${input.day}-posture`,
      kind: 'posture',
      title: 'Posture checklist',
      caption: 'Comfort first — no pain.',
    })
  }
  if (input.day <= 7 || /finger number|index|pinky|fretting hand/.test(text)) {
    add({
      id: `day${input.day}-fingers`,
      kind: 'finger_numbers',
      title: 'Finger numbers',
      caption: '1 = index · 2 = middle · 3 = ring · 4 = pinky.',
    })
  }

  // --- Named open chords (shape language only — not triad spellings like "E G B") ---
  const chordHits: Array<{ chord: string; title: string }> = [
    { chord: 'Em', title: 'Open Em' },
    { chord: 'E', title: 'Open E' },
    { chord: 'Am', title: 'Open Am' },
    { chord: 'A', title: 'Open A' },
    { chord: 'Dm', title: 'Open Dm' },
    { chord: 'D', title: 'Open D' },
    { chord: 'G', title: 'Open G' },
    { chord: 'C', title: 'Open C' },
    { chord: 'F', title: 'F shape' },
    { chord: 'B7', title: 'Open B7' },
    { chord: 'G7', title: 'Open G7' },
    { chord: 'D7', title: 'Open D7' },
    { chord: 'A7', title: 'Open A7' },
    { chord: 'E7', title: 'Open E7' },
    { chord: 'C7', title: 'Open C7' },
  ]
  for (const hit of chordHits) {
    if (!lessonTeachesOpenChord(hit.chord, text)) continue
    add({
      id: `day${input.day}-chord-${hit.chord}`,
      kind: 'chord_shape',
      title: hit.title,
      caption: `${hit.chord} open shape · standard tuning.`,
      chord: hit.chord,
      frets: 5,
    })
  }

  // --- Power chords (need explicit power-chord teaching — not mute drills that say "E5") ---
  const teachesPower =
    /power\s*chords?/.test(text) ||
    /movable\s+power/.test(text) ||
    /root\s*\+?\s*fifth/.test(text) ||
    (/\b5\s*chords?\b/.test(text) && !/palm\s*mute|mute craft|silence/.test(text))
  if (teachesPower) {
    const rootMatch =
      /\b([A-G](?:#|b)?)\s*5\b/.exec(input.title) ||
      /\b([A-G](?:#|b)?)\s*5\b/.exec(input.theoryBite) ||
      /\b([a-g](?:#|b)?)\s*5\b/.exec(text)
    let rootNote = 'A'
    if (rootMatch) {
      const r = rootMatch[1]
      rootNote = r.charAt(0).toUpperCase() + r.slice(1)
    }
    add({
      id: `day${input.day}-power`,
      kind: 'power_chord',
      title: `Power chord ${rootNote}5`,
      caption: 'Root + fifth only — movable shape.',
      root: rootNote,
      frets: 12,
    })
  }

  // --- Scales / modes (only when the lesson actually teaches that map) ---
  // Reject "-ish" flavor mentions (e.g. "phrygian-ish top notes" on a chord day).
  const scaleHits: Array<{ re: RegExp; scaleId: string; root: string; title: string }> = [
    { re: /minor pent|pentatonic minor|pent box|box 1/, scaleId: 'minor_pentatonic', root: 'A', title: 'A minor pentatonic' },
    { re: /major pent|pentatonic major/, scaleId: 'major_pentatonic', root: 'C', title: 'C major pentatonic' },
    { re: /blues scale|\bblue note\b/, scaleId: 'blues', root: 'A', title: 'A blues scale' },
    { re: /natural minor|\baeolian\b/, scaleId: 'natural_minor', root: 'A', title: 'A natural minor' },
    { re: /harmonic minor/, scaleId: 'harmonic_minor', root: 'A', title: 'A harmonic minor' },
    { re: /melodic minor/, scaleId: 'melodic_minor', root: 'A', title: 'A melodic minor (jazz)' },
    { re: /major scale|\bionian\b/, scaleId: 'major', root: 'C', title: 'C major scale' },
    { re: /\bdorian\b(?!-ish)/, scaleId: 'dorian', root: 'D', title: 'D Dorian' },
    { re: /\bmixolydian\b(?!-ish)|\bmixo\b/, scaleId: 'mixolydian', root: 'G', title: 'G Mixolydian' },
    { re: /\blydian\b(?!-ish)/, scaleId: 'lydian', root: 'F', title: 'F Lydian' },
    { re: /\bphrygian\b(?!-ish)/, scaleId: 'phrygian', root: 'E', title: 'E Phrygian' },
    { re: /\blocrian\b(?!-ish)/, scaleId: 'locrian', root: 'B', title: 'B Locrian' },
  ]
  for (const hit of scaleHits) {
    if (!hit.re.test(text)) continue
    // Basics phase: only allow scale necks when the day is clearly a scale/lead-map lesson
    if (input.phase === 'basics' || input.day < 76) {
      const teachesScale =
        /pent|scale|mode|box\s*1|lead map|fretboard map|blues scale|harmonic minor|dorian|mixo|lydian|phrygian|locrian|aeolian|ionian/.test(
          text,
        )
      if (!teachesScale) continue
    }
    // Chord-phase days: don't drop a full mode neck for a one-word flavor aside
    if (input.phase === 'chords' && /dorian|mixo|lydian|phrygian|locrian|aeolian|ionian|pent|harmonic|melodic|blues scale|major scale|natural minor/.test(hit.re.source)) {
      const modeLesson =
        /mode|scale|box|map|tones|lead/.test(text) ||
        new RegExp(hit.scaleId.replace('_', ' ')).test(text) ||
        hit.re.test(input.title.toLowerCase())
      // Title-primary: if title is a progression (Am G F E) without mode name, skip mode necks
      if (!hit.re.test(input.title.toLowerCase()) && !/scale|mode|box|pent|lead map/.test(text)) {
        continue
      }
      if (!modeLesson && !hit.re.test(input.title.toLowerCase())) continue
    }
    add({
      id: `day${input.day}-scale-${hit.scaleId}`,
      kind: 'scale_tones',
      title: hit.title,
      caption: `${hit.root} ${getScale(hit.scaleId).name} — roots marked R.`,
      root: hit.root,
      scaleId: hit.scaleId,
      frets: input.phase === 'scales' || input.phase === 'lead' ? 12 : 5,
    })
  }

  // --- Intervals ---
  if (/interval|semitone|whole step|half step|octave|perfect fifth|third/.test(text)) {
    let st = 7
    if (/half step|semitone|minor 2/.test(text)) st = 1
    else if (/whole step|major 2/.test(text)) st = 2
    else if (/minor 3|b3/.test(text)) st = 3
    else if (/major 3/.test(text)) st = 4
    else if (/fourth|perfect 4/.test(text)) st = 5
    else if (/tritone|#4|b5/.test(text)) st = 6
    else if (/fifth|perfect 5/.test(text)) st = 7
    else if (/octave/.test(text)) st = 12
    add({
      id: `day${input.day}-interval-${st}`,
      kind: 'interval',
      title: intervalName(st % 12 === 0 && st > 0 ? 0 : st),
      caption: 'Measured on one string — each fret is one semitone.',
      root: 'E',
      semitones: st === 12 ? 12 : st,
      frets: 12,
    })
  }

  // --- Rhythm ---
  if (input.phase === 'rhythm' || /tempo|metronome|eighth|sixteenth|strum|downstroke|upstroke|groove/.test(text)) {
    add({
      id: `day${input.day}-rhythm`,
      kind: 'rhythm_grid',
      title: 'Beat grid',
      caption: 'Count cells out loud before you speed up.',
      semitones: 4,
    })
  }

  // --- CAGED ---
  if (/caged|barre|movable shape|cage /.test(text)) {
    add({
      id: `day${input.day}-caged`,
      kind: 'caged_map',
      title: 'CAGED map',
      caption: 'Five major forms and where the root sits.',
      root: 'C',
    })
  }

  // Fallbacks only when nothing matched — never invent unmentioned scales/chords.
  // Empty visual gallery is better than a scary pentatonic on Day 1.
  if (out.length === 0) {
    if (input.phase === 'basics' || input.day <= 30) {
      add({
        id: `day${input.day}-open-fallback`,
        kind: 'open_strings',
        title: 'Open strings',
        caption: 'Orientation neck — standard tuning.',
      })
    } else if (input.phase === 'rhythm') {
      add({
        id: `day${input.day}-rhythm-fallback`,
        kind: 'rhythm_grid',
        title: 'Beat grid',
        caption: 'Time before speed.',
        semitones: 4,
      })
    } else {
      // chords / scales / lead / repertoire: posture card only (filtered from Learn UI)
      add({
        id: `day${input.day}-session-fallback`,
        kind: 'posture',
        title: 'Session focus',
        caption: 'Follow the drills — no extra neck map today.',
      })
    }
  }

  // De-dupe by id, then by visual topic (prefer library-linked ids)
  const seenId = new Set<string>()
  const seenTopic = new Set<string>()
  const ranked = [...out].sort((a, b) => {
    const al = a.id.includes('-lib-') ? 0 : 1
    const bl = b.id.includes('-lib-') ? 0 : 1
    return al - bl
  })
  return ranked.filter((d) => {
    if (seenId.has(d.id)) return false
    seenId.add(d.id)
    const topic =
      d.kind === 'chord_shape' || d.kind === 'power_chord'
        ? `${d.kind}:${(d.chord ?? d.root ?? d.title).toLowerCase()}`
        : d.kind === 'scale_tones'
          ? `scale:${d.root ?? ''}:${d.scaleId ?? ''}`
          : d.kind === 'open_strings'
            ? 'open_strings'
            : d.kind === 'interval'
              ? `interval:${d.semitones ?? ''}`
              : d.id
    if (seenTopic.has(topic)) return false
    seenTopic.add(topic)
    return true
  })
}

/** Every open chord shape’s sounding PCs must match theory chord tones (subset OK for omitted strings). */
export function assertOpenShapeAccurate(shapeKey: string): { ok: boolean; detail: string } {
  const shape = OPEN_CHORD_SHAPES[shapeKey]
  if (!shape) return { ok: false, detail: `missing shape ${shapeKey}` }
  const parsed = parseChordSymbol(shapeKey)
  if (!parsed) return { ok: false, detail: `cannot parse ${shapeKey}` }
  const expect = new Set(chordPitchClasses(parsed.root, parsed.chordId).map((p) => p % 12))
  const got = openShapePcs(shapeKey)
  // Every sounded PC must be a chord tone
  for (const pc of got) {
    if (!expect.has(pc)) {
      return {
        ok: false,
        detail: `${shapeKey}: fretboard sounds ${pcToName(pc)} which is not in ${[...expect].map(pcToName).join(',')}`,
      }
    }
  }
  // Must include the root
  const rootPc = noteToPc(parsed.root)
  if (!got.includes(rootPc)) {
    return { ok: false, detail: `${shapeKey}: root ${parsed.root} not present in shape` }
  }
  return { ok: true, detail: `${shapeKey} OK` }
}

export function allOpenShapeKeys(): string[] {
  return Object.keys(OPEN_CHORD_SHAPES)
}

/** Convenience: resolve diagrams for a curriculum day number. */
export function diagramsForLessonDay(day: number): LessonDiagramSpec[] {
  // Lazy import avoided — callers pass curriculum fields when possible.
  // This thin wrapper is filled by LearnPage via getLesson to keep data layer free of cycles.
  return diagramsForLesson({
    day,
    phase: '',
    title: '',
    goals: [],
    drills: [],
    theoryBite: '',
  })
}

/** Accuracy audit for a resolved diagram (used in tests + optional runtime). */
export function analyzeDiagramAccuracy(resolved: ResolvedLessonDiagram): {
  ok: boolean
  issues: string[]
} {
  const issues: string[] = []
  const { spec, dots, claimedPcs } = resolved
  const claim = new Set(claimedPcs.map((p) => ((p % 12) + 12) % 12))

  for (const d of dots) {
    if (d.muted) continue
    if (d.string < 0 || d.string > 5) {
      issues.push(`string out of range: ${d.string}`)
      continue
    }
    if (d.fret < 0 || d.fret > 24) {
      issues.push(`fret out of range: ${d.fret}`)
      continue
    }
    const midi = STANDARD_TUNING[d.string] + d.fret
    const pc = ((midi % 12) + 12) % 12
    if (claim.size && !claim.has(pc)) {
      issues.push(
        `${spec.id}: s${d.string}f${d.fret} sounds pc ${pc} not in claimed [${[...claim].join(',')}]`,
      )
    }
    if (d.isRoot && claim.size) {
      // root label must be a claimed PC; for chords/scales root is first intent
      if (!claim.has(pc)) issues.push(`${spec.id}: root mark not a claimed PC`)
    }
  }

  if (spec.kind === 'chord_shape' && spec.chord) {
    const key = chordSymbolToShapeKey(spec.chord)
    if (key) {
      const a = assertOpenShapeAccurate(key)
      if (!a.ok) issues.push(a.detail)
    }
  }

  if (spec.kind === 'open_strings') {
    for (const d of dots) {
      if (d.fret !== 0) issues.push('open_strings must be fret 0')
    }
    if (dots.length !== 6) issues.push('open_strings needs 6 dots')
  }

  return { ok: issues.length === 0, issues }
}

export const OPEN_STRING_LABELS_LOW_TO_HIGH = OPEN_LABELS_LOW_TO_HIGH

export { NOTE_NAMES, resolveChordId }
