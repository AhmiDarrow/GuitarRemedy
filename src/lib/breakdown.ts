/** Remedy breakdown — song import analysis (MIDI / MusicXML / GP / audio→tabs) */

import {
  detectKeyFromPcs,
  frettingForMidi,
  frettingForPcs,
  frettingSequence,
  midiToName,
  SCALES,
  scaleNoteNames,
  smoothFrettingRun,
  STANDARD_TUNING,
  type ScaleId,
} from './theory'
import { clampImportBpm } from './tabScore'
import { parseMidi, ticksToBeatsWarped, type MidiParseResult } from './midi'
import { parseMusicXml, type MusicXmlParseResult } from './musicxml'
import { convertArrayBufferToMidi, type AudioToMidiResult } from './audioToMidi'
import { applyScoreToBreakdown, cleanUpAfterConvert } from './tabEdit'
import {
  GP_EXPORT_HINT,
  isGuitarProName,
  parseGuitarPro,
  setGuitarProOpenTuning,
  type GuitarProParseResult,
} from './guitarpro'

export type ImportKind = 'midi' | 'musicxml' | 'guitarpro' | 'audio' | 'unknown'

export interface TabEvent {
  string: number
  fret: number
  midi: number
  startBeat: number
  durationBeats: number
  noteName: string
  time?: number
  duration?: number
}

/** Alias shapes used by TabView */
export type TabNote = {
  string: number
  fret: number
  time: number
  duration: number
  midi?: number
}

export type TabScore = {
  title?: string
  tempo?: number
  key?: string
  strings?: number
  /** Meter [numerator, denominator] when known (e.g. [3, 4]). */
  timeSig?: [number, number]
  notes: TabNote[]
}

export interface RemedyBreakdown {
  kind: ImportKind
  title: string
  tempoBpm: number
  /** Onset-estimated tempo before user override (audio path). */
  detectedTempoBpm?: number
  /** Meter from MIDI/MusicXML when present; default 4/4. */
  timeSig?: [number, number]
  key: { root: string; scaleId: ScaleId | string; scaleName: string }
  keyLabel: string
  scaleId: string
  pitchClasses: number[]
  scaleNotes: string[]
  tab: TabEvent[]
  tabNotes: TabNote[]
  explanation: string[]
  practicePlan: string[]
  /**
   * Heuristic 0–1 for ranking / UI only — not a guarantee of fret or rhythm accuracy.
   * Structured imports get a floor; audio is capped lower.
   */
  confidence: number
  editable: boolean
  warnings: string[]
  score: TabScore
  /** Optional SMF bytes (MIDI import or MP3→MIDI) for download */
  midiBytes?: ArrayBuffer
  statusMessage?: string
  /** Seconds analyzed after trim (audio). */
  analyzedSec?: number
  /** Per-note confidences 0..1 aligned with score.notes when available. */
  noteConfidences?: number[]
  /**
   * True when notes are a placeholder (e.g. GP binary stub), not a real parse.
   * Callers must not auto-save these into Your tabs.
   */
  isPlaceholder?: boolean
}

/**
 * TabEvent.string is fretting/theory index: 0 = low E … 5 = high e.
 * TabNote / TabView / library use display index: 0 = high e … 5 = low E.
 * Score time/duration are always in **beats** (TabView multiplies by 60/tempo).
 *
 * MusicXML / Guitar Pro technical string numbers are 1 = high e … 6 = low E.
 */
export function theoryStringToDisplay(stringLowE0: number): number {
  return Math.max(0, Math.min(5, 5 - stringLowE0))
}

export function displayStringToTheory(stringHighE0: number): number {
  return Math.max(0, Math.min(5, 5 - stringHighE0))
}

/** MusicXML/GP 1=high-e … 6=low-E → TabEvent theory 0=low-E … 5=high-e */
export function musicXmlStringToTheory(string1to6: number): number {
  const s = Math.round(string1to6)
  if (s >= 1 && s <= 6) return 6 - s
  // Already 0–5 display? treat as high-e=0 display → theory
  if (s >= 0 && s <= 5) return displayStringToTheory(s)
  return 0
}

/** MusicXML/GP 1=high-e … 6=low-E → display 0=high-e … 5=low-E */
export function musicXmlStringToDisplay(string1to6: number): number {
  return theoryStringToDisplay(musicXmlStringToTheory(string1to6))
}

function eventsToNotes(tab: TabEvent[]): TabNote[] {
  return tab.map((t) => ({
    string: theoryStringToDisplay(t.string),
    fret: t.fret,
    time: t.startBeat,
    duration: Math.max(0.125, t.durationBeats || 1),
    midi: t.midi,
  }))
}

function toScore(
  title: string,
  tempo: number,
  keyLabel: string,
  tab: TabEvent[],
  timeSig?: [number, number],
): TabScore {
  return {
    title,
    tempo,
    key: keyLabel,
    strings: 6,
    timeSig: timeSig ?? [4, 4],
    notes: eventsToNotes(tab),
  }
}

function fifthsToRoot(fifths: number, mode: string): { root: string; scaleId: ScaleId } {
  const major = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'][Math.min(Math.max(fifths, 0), 6)]
  const flatMajor = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'][Math.min(Math.max(-fifths, 0), 6)]
  const root = fifths >= 0 ? major : flatMajor
  if (mode.toLowerCase().startsWith('min')) {
    const minors: Record<string, string> = {
      C: 'A', G: 'E', D: 'B', A: 'F#', E: 'C#', B: 'G#', 'F#': 'D#',
      F: 'D', Bb: 'G', Eb: 'C', Ab: 'F', Db: 'Bb', Gb: 'Eb',
    }
    return { root: minors[root] || 'A', scaleId: 'natural_minor' }
  }
  return { root, scaleId: 'major' }
}

function finish(
  partial: Omit<RemedyBreakdown, 'keyLabel' | 'scaleId' | 'tabNotes' | 'score'>,
): RemedyBreakdown {
  const keyLabel = `${partial.key.root} ${partial.key.scaleName}`
  const tabNotes = eventsToNotes(partial.tab)
  const timeSig: [number, number] = partial.timeSig ?? [4, 4]
  return {
    ...partial,
    timeSig,
    keyLabel,
    scaleId: String(partial.key.scaleId),
    tabNotes,
    score: toScore(partial.title, partial.tempoBpm, keyLabel, partial.tab, timeSig),
  }
}

/**
 * Active fretting tuning (theory low-E=0).
 * Prefer passing `tuning` into *ToBreakdown / breakdownFile — session is a fallback
 * for call sites that only set it once (Upload still does both).
 */
let sessionTuning: number[] = [...STANDARD_TUNING]

/** Use Profile / appStore tuning for fretting when an entry point omits opts.tuning. */
export function setSessionTuning(tuning: number[] | null | undefined): void {
  if (Array.isArray(tuning) && tuning.length === 6) {
    sessionTuning = tuning.map((n) => Math.max(0, Math.min(127, Math.round(Number(n) || 0))))
  } else {
    sessionTuning = [...STANDARD_TUNING]
  }
}

export function getSessionTuning(): number[] {
  return [...sessionTuning]
}

function activeTuning(override?: number[]): number[] {
  // Explicit per-call tuning always wins over module session state.
  if (Array.isArray(override) && override.length === 6) {
    return override.map((n) => Math.max(0, Math.min(127, Math.round(Number(n) || 0))))
  }
  return sessionTuning.length === 6 ? [...sessionTuning] : [...STANDARD_TUNING]
}

/**
 * Dual string-index guards (theory low-E=0 vs display high-e=0).
 * Strict: throw on out-of-range (tests + new boundary code).
 * Everyday mappers still clamp via theoryStringToDisplay / displayStringToTheory.
 */
export function assertTheoryString(s: number, label = 'string'): number {
  const n = Math.round(Number(s))
  if (!Number.isFinite(n) || n < 0 || n > 5) {
    throw new Error(`${label}: expected theory string 0..5 (low E=0), got ${s}`)
  }
  return n
}

export function assertDisplayString(s: number, label = 'string'): number {
  const n = Math.round(Number(s))
  if (!Number.isFinite(n) || n < 0 || n > 5) {
    throw new Error(`${label}: expected display string 0..5 (high e=0), got ${s}`)
  }
  return n
}

function fretMelody(
  midis: number[],
  tuning?: number[],
): Array<{ string: number; fret: number; midi: number }> {
  const t = activeTuning(tuning)
  return smoothFrettingRun(frettingSequence(midis, t), t)
}

export function analyzeNotes(
  midis: number[],
  title = 'Untitled',
  opts?: { tempoBpm?: number; tuning?: number[]; timeSig?: [number, number] },
): RemedyBreakdown {
  const pcs = midis.map((m) => ((m % 12) + 12) % 12)
  const detected = detectKeyFromPcs(pcs)
  const tuning = activeTuning(opts?.tuning)
  const frets = fretMelody(midis, tuning)
  const tab: TabEvent[] = midis.map((midi, i) => {
    const f = frets[i] || frettingForMidi(midi, tuning) || { string: 0, fret: 0, midi }
    return {
      string: f.string,
      fret: f.fret,
      midi,
      startBeat: i,
      durationBeats: 1,
      noteName: midiToName(midi),
    }
  })
  const scaleNotes = scaleNoteNames(detected.root, detected.scaleId)
  const tempoBpm = clampImportBpm(
    typeof opts?.tempoBpm === 'number' && opts.tempoBpm > 0 ? opts.tempoBpm : 100,
  )
  const timeSig: [number, number] =
    Array.isArray(opts?.timeSig) && opts!.timeSig!.length >= 2
      ? [
          Math.max(1, Math.min(16, Math.round(opts!.timeSig![0]) || 4)),
          Math.max(1, Math.min(16, Math.round(opts!.timeSig![1]) || 4)),
        ]
      : [4, 4]
  return finish({
    kind: 'midi',
    title,
    tempoBpm,
    timeSig,
    key: {
      root: detected.root,
      scaleId: detected.scaleId,
      scaleName: SCALES[detected.scaleId as ScaleId]?.name || String(detected.scaleId),
    },
    pitchClasses: [...new Set(pcs)],
    scaleNotes,
    tab,
    explanation: [
      `Analyzed ${midis.length} notes.`,
      `Detected tonal center ≈ ${detected.root} ${SCALES[detected.scaleId as ScaleId]?.name || detected.scaleId}.`,
      `Scale tones: ${scaleNotes.join(', ')}.`,
      'Fretting uses your session tuning (always editable).',
    ],
    practicePlan: [
      `Drone the root ${detected.root}, then ascend the scale slowly.`,
      'Loop the first four notes at 70% tempo with a metronome.',
      'Mark any stretch frets and isolate them for 2 minutes.',
      'Play full phrase, then improvise using only scale tones.',
    ],
    confidence: estimateNoteConfidence(midis),
    editable: true,
    warnings: [],
  })
}

/**
 * Heuristic ranking score only — NOT rhythmic/fret accuracy.
 * MIDI/MusicXML get a floor; audio is capped. Always treat tabs as editable.
 */
export function estimateNoteConfidence(
  midis: number[],
  opts?: { avgFrameConf?: number; source?: 'midi' | 'audio' | 'musicxml' | 'gp' },
): number {
  if (!midis.length) return 0.15
  const pcs = new Set(midis.map((m) => ((m % 12) + 12) % 12))
  const sorted = [...midis].sort((a, b) => a - b)
  const span = sorted[sorted.length - 1]! - sorted[0]!
  // Prefer moderate register spans (melody-like) over noise sprays.
  const spanScore = span <= 0 ? 0.2 : span <= 24 ? 0.35 : span <= 36 ? 0.28 : 0.18
  const pcScore = Math.min(0.35, pcs.size * 0.04)
  const lengthScore = Math.min(0.2, Math.log10(midis.length + 1) * 0.12)
  let base = 0.25 + spanScore + pcScore + lengthScore
  if (opts?.avgFrameConf != null && Number.isFinite(opts.avgFrameConf)) {
    base = base * 0.45 + Math.max(0, Math.min(1, opts.avgFrameConf)) * 0.55
  }
  if (opts?.source === 'musicxml' || opts?.source === 'midi') base = Math.max(base, 0.72)
  if (opts?.source === 'audio') base = Math.min(base, 0.82)
  if (opts?.source === 'gp') base = Math.min(base, 0.9)
  return Math.max(0.12, Math.min(0.95, base))
}

export function remedyExplanation(result: RemedyBreakdown): string {
  return [...result.explanation, '', 'Practice plan:', ...result.practicePlan.map((p, i) => `${i + 1}. ${p}`)].join(
    '\n',
  )
}

export { frettingForMidi }

export function midiToBreakdown(
  parsed: MidiParseResult,
  title: string,
  opts?: { midiBytes?: ArrayBuffer; cleanUp?: boolean; tuning?: number[] },
): RemedyBreakdown {
  const tpq = parsed.ticksPerQuarter || 480
  const tempoBpm = clampImportBpm(parsed.tempoBpm || 120)
  const tempoMap = parsed.tempoMap?.length
    ? parsed.tempoMap
    : [{ tick: 0, bpm: tempoBpm }]
  const warp = Boolean(parsed.hasTempoChanges)
  const tuning = activeTuning(opts?.tuning)
  const timeSig: [number, number] = [
    Math.max(1, Math.min(16, parsed.timeSignature?.numerator || 4)),
    parsed.timeSignature?.denominator || 4,
  ]

  const raw = parsed.notes.map(
    (n: {
      midi?: number
      pitch?: number
      startTick?: number
      durationTicks?: number
      time?: number
      duration?: number
    }, i) => {
      const midi = n.midi ?? n.pitch ?? 60
      let startBeat: number
      let durationBeats: number
      if (n.startTick != null) {
        if (warp) {
          const startSecBeat = ticksToBeatsWarped(n.startTick, tpq, tempoMap, tempoBpm)
          const endTick = n.startTick + Math.max(1, n.durationTicks ?? tpq)
          const endSecBeat = ticksToBeatsWarped(endTick, tpq, tempoMap, tempoBpm)
          startBeat = startSecBeat
          durationBeats = Math.max(0.125, endSecBeat - startSecBeat)
        } else {
          startBeat = n.startTick / tpq
          durationBeats =
            n.durationTicks != null ? n.durationTicks / tpq : (n.duration ?? 1)
        }
      } else {
        startBeat = n.time ?? i
        durationBeats = n.duration ?? 1
      }
      return { midi, startBeat, durationBeats }
    },
  )
  const frets = fretMelody(raw.map((n) => n.midi), tuning)
  const notes = raw.map((n, i) => {
    const f = frets[i] || frettingForMidi(n.midi, tuning) || { string: 0, fret: 0, midi: n.midi }
    return {
      string: f.string,
      fret: f.fret,
      midi: n.midi,
      startBeat: n.startBeat,
      durationBeats: Math.max(0.125, n.durationBeats),
      noteName: midiToName(n.midi),
    } as TabEvent
  })
  const pcs = notes.map((n) => n.midi % 12)
  const detected = detectKeyFromPcs(pcs)
  const scaleNotes = scaleNoteNames(detected.root, detected.scaleId)
  const warnings: string[] = []
  if (parsed.hasTempoChanges) {
    const bpms = (parsed.tempoMap || []).map((e) => e.bpm)
    const uniq = [...new Set(bpms)]
    warnings.push(
      `MIDI has multiple tempos (${uniq.join(', ')} BPM). Note spacing is tempo-map warped so wall-clock feel is preserved at opening tempo ${tempoBpm} BPM.`,
    )
  }
  if (parsed.smpteDivision) {
    warnings.push(
      'MIDI used SMPTE time division; tick grid was normalized to 480 PPQ (timing may be approximate).',
    )
  }
  if (timeSig[0] !== 4 || timeSig[1] !== 4) {
    warnings.push(`Time signature ${timeSig[0]}/${timeSig[1]} preserved from MIDI.`)
  }
  let result = finish({
    kind: 'midi',
    title,
    tempoBpm,
    timeSig,
    key: {
      root: detected.root,
      scaleId: detected.scaleId,
      scaleName: SCALES[detected.scaleId as ScaleId]?.name || String(detected.scaleId),
    },
    pitchClasses: [...new Set(pcs)],
    scaleNotes,
    tab: notes,
    explanation: [
      `Imported MIDI with ${notes.length} notes.`,
      `Detected ≈ ${detected.root} ${SCALES[detected.scaleId as ScaleId]?.name || detected.scaleId}.`,
      `Scale tones: ${scaleNotes.join(', ')}.`,
      'Fretting uses hand-continuity mapping (always editable).',
      parsed.hasTempoChanges
        ? `Opening tempo ${tempoBpm} BPM — mid-song tempo changes warped into beat positions.`
        : `Tempo ${tempoBpm} BPM.`,
    ],
    practicePlan: [
      `Play root ${detected.root} drone, then scale at 60% tempo.`,
      `Isolate early measures at ${Math.round(tempoBpm * 0.7)} BPM.`,
      'Highlight chord tones (1–3–5) in the tab.',
      'Slow full run, then mark sticky frets.',
    ],
    confidence: estimateNoteConfidence(
      notes.map((n) => n.midi),
      { source: 'midi' },
    ),
    editable: true,
    warnings,
  })
  if (opts?.cleanUp) {
    const cleaned = cleanUpAfterConvert(result.score)
    result = applyScoreToBreakdown(result, cleaned)
    result.warnings = [
      ...result.warnings,
      'Auto-cleaned timing (8th grid) and re-fretted for playable positions.',
    ]
  }
  if (opts?.midiBytes) result.midiBytes = opts.midiBytes
  return result
}

function musicXmlToBreakdown(
  parsed: MusicXmlParseResult,
  opts?: { tuning?: number[] },
): RemedyBreakdown {
  const warnings: string[] = []
  let root: string
  let scaleId: ScaleId | string
  const hasWrittenKey = parsed.keyFifths !== undefined && parsed.keyFifths !== null
  if (hasWrittenKey) {
    const k = fifthsToRoot(parsed.keyFifths || 0, parsed.mode || 'major')
    root = k.root
    scaleId = k.scaleId
  } else {
    const d = detectKeyFromPcs(parsed.pitchClasses || [])
    root = d.root
    scaleId = d.scaleId
  }
  // Prefer written key; only surface detect when it disagrees (do not override chart).
  if (hasWrittenKey && (parsed.pitchClasses || []).length >= 3) {
    const d = detectKeyFromPcs(parsed.pitchClasses)
    const writtenLabel = `${root} ${SCALES[scaleId as ScaleId]?.name || scaleId}`
    const detectedLabel = `${d.root} ${SCALES[d.scaleId as ScaleId]?.name || d.scaleId}`
    if (d.score > 2 && (d.root !== root || d.scaleId !== scaleId)) {
      warnings.push(
        `Written key is ${writtenLabel}; pitch content leans ${detectedLabel}. Keeping the written key for practice labels.`,
      )
    }
  }
  const tuning = activeTuning(opts?.tuning)
  // Prefer parser-computed startBeat/durationBeats; fall back to voice cursors
  // for older MusicXmlNote payloads that omit onsets.
  const voiceCursor = new Map<number, number>()
  const voiceLastOnset = new Map<number, number>()
  const tab: TabEvent[] = []
  let parserOnsetCount = 0
  for (const n of parsed.notes) {
    const voice = n.voice || 1
    const durFallback = (n.duration || 1) / Math.max(parsed.divisions || 1, 1)
    const dur =
      typeof n.durationBeats === 'number' && n.durationBeats > 0
        ? n.durationBeats
        : durFallback
    const hasParserOnset = typeof n.startBeat === 'number' && Number.isFinite(n.startBeat)
    const onset = hasParserOnset
      ? (n.startBeat as number)
      : n.chord
        ? (voiceLastOnset.get(voice) ?? voiceCursor.get(voice) ?? 0)
        : (voiceCursor.get(voice) ?? 0)
    if (hasParserOnset) parserOnsetCount += 1

    if (n.pitch == null) {
      if (!n.chord && !hasParserOnset) {
        voiceCursor.set(voice, onset + dur)
        voiceLastOnset.set(voice, onset)
      } else if (!n.chord) {
        voiceLastOnset.set(voice, onset)
        voiceCursor.set(voice, onset + dur)
      }
      continue
    }
    const midi = n.pitch
    // TabEvent uses theory index (0=low E). MusicXML string 1=high e … 6=low E.
    let s = n.string != null ? musicXmlStringToTheory(n.string) : 0
    let f = n.fret ?? 0
    if (n.string == null || n.fret == null) {
      const fr = frettingForMidi(midi, tuning)
      if (fr) {
        s = fr.string
        f = fr.fret
      } else {
        const frets = frettingForPcs([midi % 12], tuning, 5)
        if (frets[0]) {
          s = frets[0].string
          f = frets[0].fret
        }
      }
    }
    tab.push({
      string: s,
      fret: f,
      midi,
      startBeat: onset,
      durationBeats: dur,
      noteName: midiToName(midi),
    })
    voiceLastOnset.set(voice, onset)
    if (!n.chord) voiceCursor.set(voice, onset + dur)
  }
  if (parserOnsetCount === 0 && tab.length > 0) {
    warnings.push('MusicXML notes lacked parser onsets — rebuilt voice cursors.')
  }
  const scaleNotes = scaleNoteNames(root, scaleId)
  const xmlTempo = clampImportBpm(
    typeof parsed.tempoBpm === 'number' && parsed.tempoBpm > 0 ? parsed.tempoBpm : 100,
  )
  const timeSig: [number, number] = [
    Math.max(1, Math.min(16, parsed.timeSignature?.numerator || 4)),
    parsed.timeSignature?.denominator || 4,
  ]
  if (timeSig[0] !== 4 || timeSig[1] !== 4) {
    warnings.push(`Time signature ${timeSig[0]}/${timeSig[1]} preserved from MusicXML.`)
  }
  return finish({
    kind: 'musicxml',
    title: parsed.title || 'MusicXML',
    tempoBpm: xmlTempo,
    timeSig,
    key: {
      root,
      scaleId,
      scaleName: SCALES[scaleId as ScaleId]?.name || String(scaleId),
    },
    pitchClasses: parsed.pitchClasses || [],
    scaleNotes,
    tab,
    explanation: [
      `Parsed MusicXML “${parsed.title || 'score'}” with ${tab.length} pitched notes.`,
      `Key context: ${root} ${SCALES[scaleId as ScaleId]?.name || scaleId} (written key preferred).`,
      `Scale tones: ${scaleNotes.join(', ')}.`,
      'Tab from MusicXML string/fret when present; otherwise fretted with your session tuning.',
    ],
    practicePlan: [
      'Clap the rhythm away from the guitar once.',
      'Play open-string rhythm skeleton, then add frets.',
      'Loop any two-bar cell at slow tempo.',
      'Name scale degrees while playing the melody.',
    ],
    confidence: estimateNoteConfidence(
      tab.map((t) => t.midi),
      { source: 'musicxml' },
    ),
    editable: true,
    warnings,
  })
}

/** @deprecated Prefer breakdownGuitarPro / parseGuitarPro — kept for tests */
export function breakdownGuitarProStub(fileName: string): RemedyBreakdown {
  return guitarProToBreakdown(
    {
      title: fileName.replace(/\.\w+$/, '') || 'GP import',
      tempoBpm: 100,
      notes: [
        { midi: 64, startBeat: 0, durationBeats: 1 },
        { midi: 67, startBeat: 1, durationBeats: 1 },
        { midi: 69, startBeat: 2, durationBeats: 1 },
        { midi: 71, startBeat: 3, durationBeats: 1 },
        { midi: 72, startBeat: 4, durationBeats: 1 },
        { midi: 71, startBeat: 5, durationBeats: 1 },
        { midi: 69, startBeat: 6, durationBeats: 1 },
        { midi: 67, startBeat: 7, durationBeats: 1 },
      ],
      source: 'stub',
      warnings: [
        'Guitar Pro binary parse fell back to a placeholder melody.',
        GP_EXPORT_HINT,
      ],
    },
    fileName,
  )
}

/** Map a Guitar Pro parse result into Remedy tabs + scale analysis. */
export function guitarProToBreakdown(
  parsed: GuitarProParseResult,
  fileName: string,
  opts?: { tuning?: number[] },
): RemedyBreakdown {
  if (parsed.musicXml && (parsed.musicXml.notes?.length || 0) > 0) {
    const mx = musicXmlToBreakdown(parsed.musicXml, opts)
    return finish({
      ...mx,
      kind: 'guitarpro',
      title: parsed.title || mx.title || fileName.replace(/\.\w+$/, '') || 'GP import',
      timeSig: mx.timeSig ?? [4, 4],
      warnings: [...(parsed.warnings || []), ...(mx.warnings || [])],
      explanation: [
        `Guitar Pro package “${fileName}” contained MusicXML (${parsed.source}).`,
        ...mx.explanation,
      ],
      statusMessage: 'Guitar Pro → MusicXML → tabs · ready',
    })
  }

  const tuning = activeTuning(opts?.tuning)
  const midis = parsed.notes.map((n) => n.midi)
  const frets =
    midis.length > 0
      ? frettingSequence(midis, tuning)
      : []

  const tab: TabEvent[] = parsed.notes.map((n, i) => {
    let s = 0
    let f = 0
    if (n.string != null && n.fret != null) {
      // GP strings are often 1=high-e … 6=low-E. TabEvent uses 0=low E … 5=high e.
      s = musicXmlStringToTheory(n.string)
      f = Math.max(0, n.fret)
    } else if (frets[i]) {
      s = frets[i].string
      f = frets[i].fret
    } else {
      const fr = frettingForMidi(n.midi, tuning)
      if (fr) {
        s = fr.string
        f = fr.fret
      }
    }
    return {
      string: s,
      fret: f,
      midi: n.midi,
      startBeat: n.startBeat,
      durationBeats: Math.max(0.125, n.durationBeats || 1),
      noteName: midiToName(n.midi),
    }
  })

  const pcs = tab.map((t) => ((t.midi % 12) + 12) % 12)
  const detected = detectKeyFromPcs(pcs)
  const scaleNotes = scaleNoteNames(detected.root, detected.scaleId)
  const isStub = parsed.source === 'stub' || parsed.source === 'binary-header'
  const conf = isStub
    ? 0.2
    : estimateNoteConfidence(
        tab.map((t) => t.midi),
        { source: 'gp' },
      )

  const gpTimeSig: [number, number] = parsed.timeSignature
    ? [
        Math.max(1, Math.min(16, parsed.timeSignature.numerator || 4)),
        parsed.timeSignature.denominator || 4,
      ]
    : [4, 4]
  const gpTimeWarnings =
    gpTimeSig[0] !== 4 || gpTimeSig[1] !== 4
      ? [`Time signature ${gpTimeSig[0]}/${gpTimeSig[1]} preserved from Guitar Pro.`]
      : []

  return finish({
    kind: 'guitarpro',
    title: parsed.title || fileName.replace(/\.\w+$/, '') || 'GP import',
    tempoBpm: clampImportBpm(parsed.tempoBpm || 120),
    timeSig: gpTimeSig,
    key: {
      root: detected.root,
      scaleId: detected.scaleId,
      scaleName: SCALES[detected.scaleId as ScaleId]?.name || String(detected.scaleId),
    },
    pitchClasses: [...new Set(pcs)],
    scaleNotes,
    tab,
    explanation: [
      tab.length
        ? `Guitar Pro “${parsed.title || fileName}” → ${tab.length} notes (${parsed.source}${parsed.versionHint ? ', ' + parsed.versionHint : ''}).`
        : `Guitar Pro “${fileName}” opened but no pitched notes were readable (${parsed.source}).`,
      `Key context ≈ ${detected.root} ${SCALES[detected.scaleId as ScaleId]?.name || detected.scaleId}.`,
      scaleNotes.length ? `Scale tones: ${scaleNotes.join(', ')}.` : '',
      isStub
        ? 'PLACEHOLDER only — binary GP was not decoded. Export MIDI or MusicXML for real tabs. Not saved to Your tabs.'
        : 'GPIF/zip best-effort parse. Complex multi-voice scores may still need MIDI/MusicXML export.',
    ].filter(Boolean),
    practicePlan: isStub
      ? [
          'Re-export this score as MIDI (.mid) or MusicXML from Guitar Pro / TuxGuitar.',
          'Upload the export here for accurate fretting and timing.',
          'Do not practice the placeholder melody as if it were the song.',
        ]
      : [
          'Check fretting against the original GP score if you have it open.',
          `Loop the first four bars at ${Math.round((parsed.tempoBpm || 120) * 0.7)} BPM.`,
          'Mark any stretch frets and isolate them for 2 minutes.',
          'Save to Your tabs once the candidate looks right.',
        ],
    confidence: conf,
    editable: true,
    isPlaceholder: isStub,
    warnings: [
      ...gpTimeWarnings,
      ...(parsed.warnings || []),
      ...(isStub
        ? [
            GP_EXPORT_HINT,
            'Placeholder melody — not auto-saved. Export MIDI/MusicXML for a real tab.',
          ]
        : []),
    ],
    statusMessage: isStub
      ? 'Guitar Pro · placeholder (not saved) — export MIDI/MusicXML'
      : `Guitar Pro → tabs · ${tab.length} notes · ready`,
  })
}

export async function breakdownGuitarPro(
  buffer: ArrayBuffer,
  fileName: string,
  opts?: { tuning?: number[] },
): Promise<RemedyBreakdown> {
  // GPIF string+fret → MIDI must use the same opens as fretting/session.
  setGuitarProOpenTuning(opts?.tuning ?? getSessionTuning())
  try {
    const parsed = await parseGuitarPro(buffer, fileName)
    return guitarProToBreakdown(parsed, fileName, opts)
  } finally {
    // Leave opens aligned with session for any follow-up parse in this tab.
    setGuitarProOpenTuning(getSessionTuning())
  }
}

export function breakdownAudioAssist(
  fileName: string,
  pitchHints: number[] = [],
): RemedyBreakdown {
  const pitches =
    pitchHints.length > 0
      ? pitchHints
      : [57, 60, 62, 64, 67, 64, 62, 60] // A minor-ish demo hints
  const base = analyzeNotes(pitches, fileName.replace(/\.\w+$/, '') || 'Audio sketch')
  return finish({
    ...base,
    kind: 'audio',
    confidence: pitchHints.length ? 0.45 : 0.25,
    editable: true,
    warnings: [
      'Audio path is light-assisted monophonic pitch-track — not multi-voice auto-tab.',
      'Always edit candidate fretting before saving to your library.',
    ],
    explanation: [
      `Audio assist for “${fileName}”.`,
      pitchHints.length
        ? `Using ${pitchHints.length} pitch hints → candidate fretting.`
        : 'No pitch tracker data yet — showing an editable candidate sketch.',
      'Confirm every note on the fretboard; Remedy will not claim perfect transcription in v1.',
      ...base.explanation.slice(1),
    ],
    practicePlan: [
      'Verify each candidate note against what you hear.',
      'Delete false positives before practicing.',
      'Once edited, treat it like any MIDI-derived tab.',
      'Save only after human confirm.',
    ],
  })
}

/** Pipeline stages for the audio converter (shown in Upload UI). */
export type ConvertStage =
  | 'idle'
  | 'decode'
  | 'audio_to_midi'
  | 'midi_to_tabs'
  | 'done'
  | 'error'

export type ConvertProgress = (stage: ConvertStage, message: string) => void

/**
 * Common consumer audio formats we route through decode → MIDI → tabs.
 * Browser Web Audio usually handles: mp3, wav, ogg/opus, m4a/aac/mp4, flac, webm, aiff (varies by engine).
 * wma/caf accepted when the runtime can decode; otherwise the user gets a clear error.
 */
export const AUDIO_EXTENSIONS = [
  'mp3',
  'wav',
  'wave',
  'ogg',
  'oga',
  'opus',
  'm4a',
  'aac',
  'mp4',
  'flac',
  'webm',
  'aiff',
  'aif',
  'caf',
  'wma',
] as const

const AUDIO_EXT = new RegExp(
  `\\.(${AUDIO_EXTENSIONS.join('|')})$`,
  'i',
)

/** MIME types treated as audio even if the filename extension is missing/odd. */
const AUDIO_MIME =
  /^(audio\/(mpeg|mp3|wav|x-wav|wave|ogg|opus|mp4|m4a|aac|flac|webm|x-m4a|aiff|x-aiff|x-caf|x-ms-wma)(\s*;.*)?|video\/(webm|mp4)(\s*;.*)?)$/i

export function isAudioUploadName(name: string): boolean {
  return AUDIO_EXT.test(name || '')
}

export function isAudioUploadMime(mime: string | undefined | null): boolean {
  if (!mime) return false
  return AUDIO_MIME.test(mime.trim())
}

/** True when name or MIME says this is an audio file for the convert pipeline. */
export function isAudioUpload(
  file: { name?: string; type?: string } | string,
): boolean {
  if (typeof file === 'string') return isAudioUploadName(file)
  return isAudioUploadName(file.name || '') || isAudioUploadMime(file.type)
}

/** `<input accept>` value: audio + structured tab sources. */
export const UPLOAD_ACCEPT =
  [
    ...AUDIO_EXTENSIONS.map((e) => `.${e}`),
    'audio/*',
    '.mid',
    '.midi',
    '.xml',
    '.musicxml',
    '.gp',
    '.gp3',
    '.gp4',
    '.gp5',
    '.gpx',
    '.gp7',
  ].join(',')

export const AUDIO_FORMATS_LABEL = 'MP3, WAV, M4A, OGG, FLAC, AAC, WebM, AIFF'

/**
 * MIDI bytes → guitar tabs + Remedy breakdown.
 * Shared by direct .mid upload and MP3→MIDI output.
 */
export function midiBytesToGuitarTabs(
  midiBytes: ArrayBuffer,
  title: string,
  extra?: {
    warnings?: string[]
    kind?: ImportKind
    statusMessage?: string
    confidence?: number
    cleanUp?: boolean
    /** Theory-order opens (0 = low E). Prefer over module sessionTuning. */
    tuning?: number[]
  },
): RemedyBreakdown {
  if (extra?.tuning) setSessionTuning(extra.tuning)
  const parsed = parseMidi(midiBytes)
  const base = midiToBreakdown(parsed, title.replace(/\.\w+$/, '') || title, {
    midiBytes,
    cleanUp: extra?.cleanUp,
    tuning: extra?.tuning,
  })
  if (extra?.kind) base.kind = extra.kind
  if (extra?.warnings?.length) base.warnings = [...extra.warnings, ...base.warnings]
  if (extra?.statusMessage) base.statusMessage = extra.statusMessage
  if (extra?.confidence != null) base.confidence = extra.confidence
  base.midiBytes = midiBytes
  return base
}

/** Build breakdown from a completed MP3/WAV→MIDI conversion (steps 2→3). */
export function audioMidiToBreakdown(
  converted: AudioToMidiResult,
  fileName: string,
  opts?: { tuning?: number[] },
): RemedyBreakdown {
  if (opts?.tuning) setSessionTuning(opts.tuning)
  const title = fileName.replace(/\.\w+$/, '') || 'Audio convert'
  if (!converted.notes.length) {
    const empty = breakdownAudioAssist(fileName, [])
    const result = finish({
      ...empty,
      kind: 'audio',
      title,
      tempoBpm: converted.tempoBpm,
      confidence: 0.15,
      warnings: [
        ...converted.warnings,
        'No pitches locked — try a cleaner monophonic clip or paste MIDI instead.',
      ],
      explanation: [
        `1) Decoded “${fileName}” (${converted.durationSec.toFixed(1)}s).`,
        '2) MP3→MIDI found no stable notes.',
        '3) Tabs skipped — use a dry single-note melody, or upload MIDI/MusicXML.',
        ...empty.explanation.slice(2),
      ],
    })
    result.midiBytes = converted.midiBytes
    result.statusMessage = 'MP3→MIDI found no notes'
    return result
  }

  const confidences = converted.notes.map((n) => n.confidence ?? n.velocity / 127)
  const avgFrameConf =
    confidences.length > 0
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : undefined
  const audioConf = estimateNoteConfidence(
    converted.notes.map((n) => n.pitch),
    { avgFrameConf, source: 'audio' },
  )

  // Step 3: MIDI → guitar tabs with playable fretting + auto cleanup
  const tabs = midiBytesToGuitarTabs(converted.midiBytes, title, {
    kind: 'audio',
    cleanUp: true,
    confidence: audioConf,
    tuning: opts?.tuning,
    warnings: [
      ...converted.warnings,
      'Converted via monophonic pitch-track — use Clean up / Edit tab if anything is off.',
    ],
    statusMessage: `Audio → MIDI → tabs · ${converted.notes.length} notes (cleaned)`,
  })

  const cleaned = cleanUpAfterConvert(tabs.score)
  const polished = applyScoreToBreakdown(
    {
      ...tabs,
      kind: 'audio',
      title,
      tempoBpm: converted.tempoBpm || tabs.tempoBpm,
      detectedTempoBpm: converted.detectedTempoBpm ?? converted.tempoBpm,
      analyzedSec: converted.analyzedSec ?? converted.durationSec,
      noteConfidences: confidences,
      confidence: estimateNoteConfidence(
        cleaned.notes.map((n) => n.midi).filter((m): m is number => typeof m === 'number'),
        { avgFrameConf, source: 'audio' },
      ),
      editable: true,
      warnings: [
        ...converted.warnings,
        'Pipeline: audio → MIDI → tabs → auto clean (quantize + playable frets).',
        'Still monophonic assist — full-band mixes need ear checks.',
      ],
      explanation: [
        `1) Decoded “${fileName}” (${converted.durationSec.toFixed(1)}s @ ${converted.sampleRate} Hz${
          converted.analyzedSec && converted.analyzedSec + 0.2 < converted.durationSec
            ? `, analyzed ${converted.analyzedSec.toFixed(0)}s`
            : ''
        }).`,
        `2) Audio→MIDI locked ${converted.notes.length} notes @ ~${converted.tempoBpm} BPM (detected ≈ ${converted.detectedTempoBpm ?? converted.tempoBpm}; lead emphasis + octave repair).`,
        `3) MIDI→tabs: ${cleaned.notes.length} notes after cleanup · key ≈ ${tabs.key.root} ${tabs.key.scaleName}.`,
        `Scale tones: ${tabs.scaleNotes.join(', ')}. Confirm the first phrase against the recording.`,
      ],
      practicePlan: [
        'Play the recording and check the first 8 tab notes by ear.',
        `Loop sticky spots at ~${Math.round((converted.tempoBpm || 100) * 0.7)} BPM.`,
        'Use Edit tab → Clean up again, or fix frets by hand, then save to Your tabs.',
        'Download the MIDI if you want to edit further in a DAW.',
      ],
    },
    cleaned,
  )
  polished.midiBytes = converted.midiBytes
  polished.detectedTempoBpm = converted.detectedTempoBpm ?? converted.tempoBpm
  polished.analyzedSec = converted.analyzedSec ?? converted.durationSec
  polished.noteConfidences = confidences
  polished.statusMessage =
    tabs.statusMessage ?? `Audio → MIDI → tabs · ${cleaned.notes.length} notes`
  return polished
}

/**
 * Full audio pipeline: user MP3/WAV → MIDI bytes → guitar tabs.
 * Progress callbacks power the Upload stepper UI.
 */
export async function convertAudioToGuitarTabs(
  file: File | { name: string; arrayBuffer: () => Promise<ArrayBuffer> },
  opts?: {
    tempoBpm?: number
    /** Concert A4 Hz from Profile (default 440). */
    a4?: number
    /** Analyze only first N seconds (0/omit = full). */
    maxSec?: number
    /** HPSS stem: auto (default · races lead/harmonic/mix) | lead | harmonic | mix | percussive */
    stem?: 'auto' | 'lead' | 'harmonic' | 'mix' | 'percussive'
    skipHpss?: boolean
    onProgress?: ConvertProgress
    /** Theory-order opens (0 = low E). Prefer over module sessionTuning. */
    tuning?: number[]
  },
): Promise<RemedyBreakdown> {
  const name = file.name || 'audio.mp3'
  const onProgress = opts?.onProgress
  if (opts?.tuning) setSessionTuning(opts.tuning)
  onProgress?.('decode', '1/3 Decoding audio…')
  try {
    const buf = await file.arrayBuffer()
    onProgress?.('audio_to_midi', '2/3 Converting audio → MIDI…')
    // Omit tempo unless user set one — lets detectTempoBpm run
    const converted = await convertArrayBufferToMidi(buf, {
      tempoBpm: opts?.tempoBpm,
      a4: opts?.a4,
      maxSec: opts?.maxSec,
      stem: opts?.stem ?? 'auto',
      skipHpss: opts?.skipHpss,
      onProgress: (pct, message) => {
        onProgress?.('audio_to_midi', `2/3 ${message} (${pct}%)`)
      },
    })
    onProgress?.('midi_to_tabs', '3/3 MIDI → guitar tabs…')
    const result = audioMidiToBreakdown(converted, name, { tuning: opts?.tuning })
    onProgress?.('done', result.statusMessage ?? 'Done · audio → MIDI → tabs')
    return result
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'decode failed'
    onProgress?.('error', `Converter failed: ${msg}`)
    const fallback = breakdownAudioAssist(name)
    return finish({
      ...fallback,
      warnings: [`MP3→MIDI could not decode this file (${msg}).`, ...fallback.warnings],
      explanation: [
        `Audio “${name}” failed the MP3→MIDI→tabs pipeline.`,
        'Showing an editable sketch — or re-export as MIDI/MusicXML for the solid path.',
        ...fallback.explanation.slice(2),
      ],
      statusMessage: `Converter error: ${msg}`,
    })
  }
}

export async function breakdownFile(
  file: File | { name: string; arrayBuffer: () => Promise<ArrayBuffer>; text?: () => Promise<string> },
  opts?: {
    onProgress?: ConvertProgress
    tempoBpm?: number
    /** Concert A4 Hz from Profile (audio convert). */
    a4?: number
    maxSec?: number
    stem?: 'auto' | 'lead' | 'harmonic' | 'mix' | 'percussive'
    skipHpss?: boolean
    /** Theory-order opens (0 = low E). Overrides session when set. */
    tuning?: number[]
  },
): Promise<RemedyBreakdown> {
  const name = file.name
  const lower = name.toLowerCase()

  // Prefer explicit opts.tuning over module session side-effect alone.
  if (opts?.tuning) setSessionTuning(opts.tuning)

  // Direct MIDI → tabs (skip audio stage)
  if (lower.endsWith('.mid') || lower.endsWith('.midi')) {
    opts?.onProgress?.('midi_to_tabs', 'MIDI → guitar tabs…')
    const buf = await file.arrayBuffer()
    const result = midiBytesToGuitarTabs(buf, name, {
      statusMessage: 'MIDI → tabs · ready',
      tuning: opts?.tuning,
    })
    opts?.onProgress?.('done', result.statusMessage ?? 'Done')
    return result
  }

  if (lower.endsWith('.xml') || lower.endsWith('.musicxml')) {
    opts?.onProgress?.('midi_to_tabs', 'Parsing MusicXML → tabs…')
    const textXml = file.text
      ? await file.text()
      : new TextDecoder().decode(await file.arrayBuffer())
    const result = musicXmlToBreakdown(parseMusicXml(textXml), { tuning: opts?.tuning })
    result.statusMessage = 'MusicXML → tabs · ready'
    opts?.onProgress?.('done', result.statusMessage)
    return result
  }

  if (isGuitarProName(name) || lower.endsWith('.gpif')) {
    opts?.onProgress?.('midi_to_tabs', 'Guitar Pro → tabs (best-effort)…')
    const buf = await file.arrayBuffer()
    // Explicit opts.tuning (or session) drives GPIF open strings + fretting.
    const result = await breakdownGuitarPro(buf, name, { tuning: opts?.tuning })
    if (result.isPlaceholder) {
      result.warnings = [
        ...(result.warnings || []),
        'Guitar Pro binary is best-effort — placeholder notes are never auto-saved. Prefer MIDI/MusicXML export from your editor.',
      ]
    }
    opts?.onProgress?.('done', result.statusMessage ?? 'Done')
    return result
  }

  // Primary user path: audio (mp3/wav/m4a/…) → MIDI → guitar tabs
  const mime = 'type' in file ? (file as File).type : undefined
  if (isAudioUpload({ name: lower, type: mime })) {
    return convertAudioToGuitarTabs(file, {
      onProgress: opts?.onProgress,
      tempoBpm: opts?.tempoBpm,
      a4: opts?.a4,
      maxSec: opts?.maxSec,
      stem: opts?.stem ?? 'auto',
      skipHpss: opts?.skipHpss,
      tuning: opts?.tuning,
    })
  }

  // try midi parse anyway
  try {
    opts?.onProgress?.('midi_to_tabs', 'Trying MIDI parse…')
    const buf = await file.arrayBuffer()
    return midiBytesToGuitarTabs(buf, name, { tuning: opts?.tuning })
  } catch {
    opts?.onProgress?.('error', 'Unknown format')
    return finish({
      kind: 'unknown',
      title: name,
      tempoBpm: 100,
      timeSig: [4, 4],
      isPlaceholder: true,
      key: { root: 'C', scaleId: 'major', scaleName: 'Major (Ionian)' },
      pitchClasses: [],
      scaleNotes: scaleNoteNames('C', 'major'),
      tab: [],
      explanation: [
        `Could not detect format for “${name}”.`,
        `Upload audio (${AUDIO_FORMATS_LABEL}) for convert → MIDI → tabs, or a .mid / MusicXML file.`,
      ],
      practicePlan: [
        'Re-export from your DAW as MIDI or MusicXML, or try a clean monophonic MP3/WAV.',
      ],
      confidence: 0,
      editable: true,
      warnings: ['Unknown format'],
      statusMessage: 'Unknown format',
    })
  }
}

/**
 * Debug/sample ASCII from theory-index TabEvent[] (0 = low E).
 * Onset-aware (not left-packed). Prefer `userTabToAscii` for product Export TXT.
 */
export function tabToAscii(
  tab: TabEvent[],
  measures = 4,
  opts?: { beatsPerMeasure?: number; colsPerBeat?: number },
): string {
  const beatsPer = Math.max(1, Math.min(16, Math.round(opts?.beatsPerMeasure ?? 4)))
  const colsPerBeat = Math.max(1, Math.min(8, Math.round(opts?.colsPerBeat ?? 2)))
  const colsPerMeasure = Math.max(colsPerBeat, beatsPer * colsPerBeat)
  const maxBeat = Math.max(0, measures * beatsPer)
  const lines = ['e|', 'B|', 'G|', 'D|', 'A|', 'E|']

  for (let m = 0; m < measures; m++) {
    const grid: (string | null)[][] = Array.from({ length: 6 }, () =>
      Array.from({ length: colsPerMeasure }, () => null),
    )
    const m0 = m * beatsPer
    const m1 = m0 + beatsPer
    for (const t of tab) {
      const start = typeof t.startBeat === 'number' && Number.isFinite(t.startBeat) ? t.startBeat : 0
      if (start < m0 || start >= m1 || start >= maxBeat) continue
      const row = theoryStringToDisplay(t.string)
      const col = Math.max(
        0,
        Math.min(colsPerMeasure - 1, Math.round((start - m0) * colsPerBeat)),
      )
      const fretLabel = String(Math.max(0, Math.min(24, Math.round(Number(t.fret) || 0))))
      if (grid[row][col] == null) grid[row][col] = fretLabel
    }
    for (let r = 0; r < 6; r++) {
      let cell = ''
      for (let c = 0; c < colsPerMeasure; c++) {
        const v = grid[r][c]
        cell += v != null ? v.padStart(2, '-').padEnd(2, '-') : '--'
      }
      lines[r] += cell + '|'
    }
  }
  return lines.join('\n')
}

/** Alias used by Upload page — must stay after breakdownFile */
export const parseUploadedFile = breakdownFile
