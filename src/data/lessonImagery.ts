/**
 * Lesson imagery — free-license, theory-verified diagrams only.
 *
 * Policy (hard):
 * - No stock photos, no freeform AI fretting art (too easy to mislabel frets/strings).
 * - Every diagram is generated from `src/lib/theory.ts` at render time.
 * - Accuracy is enforced by unit tests against the theory engine, not by eye alone.
 * - License: original GuitarRemedy code (MIT) — diagrams are data/SVG, not third-party assets.
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
  /** Short caption under the figure */
  title: string
  /** One-line accuracy claim the student can trust (optional in tests) */
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
  /** License stamp shown in UI */
  license: 'MIT · GuitarRemedy original'
  /** How this figure was verified */
  verifiedBy: 'theory-engine'
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
      const root = spec.root ?? 'A'
      const scaleId = spec.scaleId ?? 'minor_pentatonic'
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

  return { spec, openLabels, dots, notes, claimedPcs }
}

/**
 * Pick diagrams for a curriculum day from phase + title/goals keywords.
 * Always returns at least one verified figure for days 1–90; lighter after.
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
  const text = [input.title, ...input.goals, ...input.drills, input.theoryBite, input.phase]
    .join(' ')
    .toLowerCase()
  const out: LessonDiagramSpec[] = []
  const add = (spec: Omit<LessonDiagramSpec, 'license' | 'verifiedBy'> & Partial<Pick<LessonDiagramSpec, 'license' | 'verifiedBy'>>) => {
    out.push({
      license: 'MIT · GuitarRemedy original',
      verifiedBy: 'theory-engine',
      ...spec,
    })
  }

  // --- Universal early foundations ---
  if (input.day <= 3 || /open string|string name|tuning|which string/.test(text)) {
    add({
      id: `day${input.day}-open-strings`,
      kind: 'open_strings',
      title: 'Open strings (standard)',
      caption: 'Low E–A–D–G–B–high e — labels match STANDARD_TUNING MIDI.',
    })
  }
  if (input.day <= 5 || /finger|posture|sit|thumb|hand/.test(text)) {
    add({
      id: `day${input.day}-posture`,
      kind: 'posture',
      title: 'Posture checklist',
      caption: 'Comfort first — no pain. Text guidance only (no fake anatomy art).',
    })
  }
  if (input.day <= 7 || /finger number|index|pinky|fretting hand/.test(text)) {
    add({
      id: `day${input.day}-fingers`,
      kind: 'finger_numbers',
      title: 'Finger numbers',
      caption: '1–4 fretting-hand convention used in all GuitarRemedy diagrams.',
    })
  }

  // --- Named open chords ---
  const chordHits: Array<{ re: RegExp; chord: string; title: string }> = [
    { re: /\bem\b|e minor/, chord: 'Em', title: 'Open Em' },
    { re: /\be major\b|(^| )e chord/, chord: 'E', title: 'Open E' },
    { re: /\bam\b|a minor/, chord: 'Am', title: 'Open Am' },
    { re: /\ba major\b|(^| )a chord/, chord: 'A', title: 'Open A' },
    { re: /\bdm\b|d minor/, chord: 'Dm', title: 'Open Dm' },
    { re: /\bd major\b|(^| )d chord/, chord: 'D', title: 'Open D' },
    { re: /\bg major\b|(^| )g chord|\bg\b.*chord/, chord: 'G', title: 'Open G' },
    { re: /\bc major\b|(^| )c chord/, chord: 'C', title: 'Open C' },
    { re: /\bf major\b|f chord|mini.?barre f/, chord: 'F', title: 'F shape' },
    { re: /\bb7\b/, chord: 'B7', title: 'Open B7' },
  ]
  for (const hit of chordHits) {
    if (hit.re.test(text)) {
      add({
        id: `day${input.day}-chord-${hit.chord}`,
        kind: 'chord_shape',
        title: hit.title,
        caption: `${hit.chord} open shape — frets verified against chord tones in standard tuning.`,
        chord: hit.chord,
        frets: 5,
      })
    }
  }

  // --- Power chords / barre language ---
  if (/power chord|root.?fifth|\b5 chord|palm mute/.test(text)) {
    const root = /\b([A-G](?:#|b)?)\s*5\b/.exec(input.title)?.[1] ?? 'A'
    add({
      id: `day${input.day}-power`,
      kind: 'power_chord',
      title: `Power chord ${root}5`,
      caption: 'Root + fifth only — movable shape on A–D strings.',
      root,
      frets: 12,
    })
  }

  // --- Scales / modes ---
  const scaleHits: Array<{ re: RegExp; scaleId: string; root: string; title: string }> = [
    { re: /minor pent|pentatonic minor/, scaleId: 'minor_pentatonic', root: 'A', title: 'A minor pentatonic' },
    { re: /major pent|pentatonic major/, scaleId: 'major_pentatonic', root: 'C', title: 'C major pentatonic' },
    { re: /blues scale|\bblues\b/, scaleId: 'blues', root: 'A', title: 'A blues scale' },
    { re: /natural minor|aeolian/, scaleId: 'natural_minor', root: 'A', title: 'A natural minor' },
    { re: /harmonic minor/, scaleId: 'harmonic_minor', root: 'A', title: 'A harmonic minor' },
    { re: /melodic minor/, scaleId: 'melodic_minor', root: 'A', title: 'A melodic minor (jazz)' },
    { re: /major scale|ionian/, scaleId: 'major', root: 'C', title: 'C major scale' },
    { re: /\bdorian\b/, scaleId: 'dorian', root: 'D', title: 'D Dorian' },
    { re: /\bmixolydian\b/, scaleId: 'mixolydian', root: 'G', title: 'G Mixolydian' },
    { re: /\blydian\b/, scaleId: 'lydian', root: 'F', title: 'F Lydian' },
    { re: /\bphrygian\b/, scaleId: 'phrygian', root: 'E', title: 'E Phrygian' },
    { re: /\blocrian\b/, scaleId: 'locrian', root: 'B', title: 'B Locrian' },
  ]
  for (const hit of scaleHits) {
    if (hit.re.test(text)) {
      add({
        id: `day${input.day}-scale-${hit.scaleId}`,
        kind: 'scale_tones',
        title: hit.title,
        caption: `${hit.root} ${getScale(hit.scaleId).name} tones on the neck — roots marked R.`,
        root: hit.root,
        scaleId: hit.scaleId,
        frets: input.phase === 'scales' || input.phase === 'lead' ? 12 : 5,
      })
    }
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
      caption: 'Five major forms — root frets from theory, not memorized pictures alone.',
      root: 'C',
    })
  }

  // Phase defaults so no early day is blank
  if (out.length === 0) {
    if (input.phase === 'basics' || input.day <= 30) {
      add({
        id: `day${input.day}-open-fallback`,
        kind: 'open_strings',
        title: 'Open strings',
        caption: 'Orientation neck — standard tuning.',
      })
    } else if (input.phase === 'chords') {
      add({
        id: `day${input.day}-em-fallback`,
        kind: 'chord_shape',
        title: 'Open Em',
        caption: 'Home-base minor shape — verified tones.',
        chord: 'Em',
      })
    } else if (input.phase === 'scales' || input.phase === 'lead') {
      add({
        id: `day${input.day}-pent-fallback`,
        kind: 'scale_tones',
        title: 'A minor pentatonic',
        caption: 'Default lead vocabulary — roots marked.',
        root: 'A',
        scaleId: 'minor_pentatonic',
        frets: 12,
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
      add({
        id: `day${input.day}-posture-fallback`,
        kind: 'posture',
        title: 'Session setup',
        caption: 'Comfort + focus before repertoire polish.',
      })
    }
  }

  // De-dupe by id
  const seen = new Set<string>()
  return out.filter((d) => {
    if (seen.has(d.id)) return false
    seen.add(d.id)
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
