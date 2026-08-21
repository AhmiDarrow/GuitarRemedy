/** Pure helpers: edit timed tab scores before save / re-export */

import type { TabNote, TabScore, RemedyBreakdown } from './breakdown'
import { frettingSequence, smoothFrettingRun, STANDARD_TUNING } from './theory'
import {
  clampPracticeBpm,
  midiFromDisplayStringFret,
  openMidiHighToLow,
  STANDARD_OPEN_MIDI_HIGH_TO_LOW,
} from './tabScore'
import { scoreToTabSong, type UserTab } from './userTabs'

/** Display string index 0 = high e … 5 = low E (matches TabView). Standard only. */
export const OPEN_MIDI_HIGH_TO_LOW = STANDARD_OPEN_MIDI_HIGH_TO_LOW

/** Active editor tuning (theory low-E=0). Defaults to standard. */
let editorTuning: number[] = [...STANDARD_TUNING]

export function setEditorTuning(tuning: number[] | null | undefined): void {
  if (Array.isArray(tuning) && tuning.length === 6) {
    editorTuning = tuning.map((n) => Math.max(0, Math.min(127, Math.round(Number(n) || 0))))
  } else {
    editorTuning = [...STANDARD_TUNING]
  }
}

export function getEditorTuning(): number[] {
  return [...editorTuning]
}

export function clampString(s: number): number {
  return Math.max(0, Math.min(5, Math.round(s)))
}

export function clampFret(f: number): number {
  return Math.max(0, Math.min(24, Math.round(f)))
}

export function midiFromStringFret(
  string: number,
  fret: number,
  tuning: number[] = editorTuning,
): number {
  return midiFromDisplayStringFret(string, fret, tuning)
}

export function normalizeNote(n: TabNote): TabNote {
  const string = clampString(n.string)
  const fret = clampFret(n.fret)
  const midi =
    typeof n.midi === 'number' && n.midi > 0
      ? Math.round(n.midi)
      : midiFromStringFret(string, fret)
  return {
    string,
    fret,
    time: Math.max(0, Number.isFinite(n.time) ? n.time : 0),
    duration: Math.max(0.05, Number.isFinite(n.duration) ? n.duration : 1),
    midi,
  }
}

export type NotePatch = Partial<Pick<TabNote, 'string' | 'fret' | 'time' | 'duration' | 'midi'>>

/** When string/fret change, recompute midi unless midi is explicitly patched alone. */
export function applyNotePatch(note: TabNote, patch: NotePatch): TabNote {
  const next: TabNote = { ...note, ...patch }
  const touchedFretOrString =
    patch.string !== undefined || patch.fret !== undefined
  if (touchedFretOrString && patch.midi === undefined) {
    next.midi = midiFromStringFret(
      patch.string !== undefined ? patch.string : note.string,
      patch.fret !== undefined ? patch.fret : note.fret,
    )
  } else if (patch.midi !== undefined && patch.string === undefined && patch.fret === undefined) {
    // Snap fretting to nearest open-string position for this midi (session tuning)
    const m = Math.round(patch.midi)
    const open = openMidiHighToLow(editorTuning)
    let bestS = 0
    let bestF = 0
    let bestDist = Infinity
    for (let s = 0; s < 6; s++) {
      const f = m - open[s]
      if (f < 0 || f > 24) continue
      const dist = Math.abs(f - (note.string === s ? note.fret : 5))
      if (dist < bestDist) {
        bestDist = dist
        bestS = s
        bestF = f
      }
    }
    next.string = bestS
    next.fret = bestF
    next.midi = m
  }
  return normalizeNote(next)
}

export function sortScoreNotes(notes: TabNote[]): TabNote[] {
  return [...notes].map(normalizeNote).sort((a, b) => a.time - b.time || a.string - b.string)
}

export function updateScoreNote(score: TabScore, index: number, patch: NotePatch): TabScore {
  if (index < 0 || index >= score.notes.length) return score
  const notes = score.notes.map((n, i) => (i === index ? applyNotePatch(n, patch) : n))
  return { ...score, notes: sortScoreNotes(notes) }
}

export function deleteScoreNote(score: TabScore, index: number): TabScore {
  if (index < 0 || index >= score.notes.length) return score
  return { ...score, notes: sortScoreNotes(score.notes.filter((_, i) => i !== index)) }
}

export function insertScoreNote(score: TabScore, note?: Partial<TabNote>): TabScore {
  const last = score.notes[score.notes.length - 1]
  const base: TabNote = normalizeNote({
    string: note?.string ?? last?.string ?? 0,
    fret: note?.fret ?? last?.fret ?? 0,
    time: note?.time ?? (last ? last.time + (last.duration || 1) : 0),
    duration: note?.duration ?? 1,
    midi: note?.midi,
  })
  return { ...score, notes: sortScoreNotes([...score.notes, base]) }
}

export function setScoreTempo(score: TabScore, tempo: number): TabScore {
  return { ...score, tempo: clampPracticeBpm(tempo, 100) }
}

/** Rebuild UserTab measure tab + score after edits. */
export function applyScoreToUserTab(tab: UserTab, score: TabScore): UserTab {
  const tempo = score.tempo ?? tab.tempoBpm ?? 100
  const titled = {
    ...score,
    title: score.title || tab.title,
    tempo,
    key: score.key || tab.keyLabel,
  }
  const timeSig = tab.tab?.timeSig ?? [4, 4]
  const measures = scoreToTabSong(titled, {
    title: tab.title,
    tempo,
    timeSig: timeSig as [number, number],
  })
  return {
    ...tab,
    tempoBpm: tempo,
    keyLabel: titled.key || tab.keyLabel,
    score: titled,
    tab: measures,
    updatedAt: new Date().toISOString(),
  }
}

export type CleanUpOptions = {
  /** Snap beats to this division (4=quarter … 16=sixteenth). Default 8. */
  gridDivisions?: number
  /** Drop notes shorter than this many beats. Default 0.12 */
  minDurationBeats?: number
  /** Merge same-pitch notes within this beat gap. Default 0.12 */
  mergeGapBeats?: number
  /** Re-map frets with hand continuity. Default true */
  reFret?: boolean
  /** Cap total notes (keeps earliest). Default unlimited */
  maxNotes?: number
}

/**
 * One-click cleanup for messy audio→tab scores:
 * drop ghosts, quantize timing, merge dups, re-fret for playability.
 */
export function cleanUpScore(score: TabScore, opts?: CleanUpOptions): TabScore {
  const gridDiv = opts?.gridDivisions ?? 8
  const minDur = opts?.minDurationBeats ?? 0.12
  const mergeGap = opts?.mergeGapBeats ?? 0.12
  const reFret = opts?.reFret !== false
  const grid = 4 / gridDiv // in beats (quarter = 1)

  const snap = (t: number) => Math.max(0, Math.round(t / grid) * grid)

  let notes = sortScoreNotes(score.notes)
    .filter((n) => n.duration >= minDur * 0.85)
    .map((n) =>
      normalizeNote({
        ...n,
        time: snap(n.time),
        duration: Math.max(grid, snap(n.duration) || grid),
      }),
    )

  // Merge back-to-back same pitch / same string
  const merged: TabNote[] = []
  for (const n of notes) {
    const prev = merged[merged.length - 1]
    if (
      prev &&
      prev.midi === n.midi &&
      prev.string === n.string &&
      n.time <= prev.time + prev.duration + mergeGap
    ) {
      const end = Math.max(prev.time + prev.duration, n.time + n.duration)
      prev.duration = Math.max(grid, end - prev.time)
      continue
    }
    // Drop exact time+pitch duplicates
    if (prev && prev.midi === n.midi && Math.abs(prev.time - n.time) < grid * 0.5) {
      if (n.duration > prev.duration) prev.duration = n.duration
      continue
    }
    merged.push({ ...n })
  }
  notes = merged

  if (reFret && notes.length > 0) {
    const tuning = editorTuning.length === 6 ? editorTuning : [...STANDARD_TUNING]
    const midis = notes.map((n) => n.midi ?? midiFromStringFret(n.string, n.fret, tuning))
    const run = smoothFrettingRun(frettingSequence(midis, tuning), tuning)
    notes = notes.map((n, i) => {
      const f = run[i]
      // theory string 0 = low E → display string 5
      const displayString = clampString(5 - f.string)
      return normalizeNote({
        ...n,
        string: displayString,
        fret: clampFret(f.fret),
        midi: f.midi,
      })
    })
  }

  if (opts?.maxNotes != null && notes.length > opts.maxNotes) {
    notes = notes.slice(0, opts.maxNotes)
  }

  return {
    ...score,
    notes: sortScoreNotes(notes),
    tempo: score.tempo ?? 100,
  }
}

/** Default cleanup used right after audio→MIDI→tabs. */
export function cleanUpAfterConvert(score: TabScore): TabScore {
  return cleanUpScore(score, {
    gridDivisions: 8,
    minDurationBeats: 0.14,
    mergeGapBeats: 0.15,
    reFret: true,
  })
}

/** Push edited score back onto a breakdown (re-save path). */
export function applyScoreToBreakdown(b: RemedyBreakdown, score: TabScore): RemedyBreakdown {
  const tempo = score.tempo ?? b.tempoBpm ?? 100
  const notes = sortScoreNotes(score.notes)
  const tab = notes.map((n) => {
    const displayString = clampString(n.string)
    const theoryString = 5 - displayString // low E = 0 in fretting engine
    return {
      string: theoryString,
      fret: clampFret(n.fret),
      midi: n.midi ?? midiFromStringFret(displayString, n.fret),
      startBeat: n.time,
      durationBeats: n.duration,
      noteName: '',
      time: n.time,
      duration: n.duration,
    }
  })
  return {
    ...b,
    tempoBpm: tempo,
    tabNotes: notes,
    tab,
    score: {
      ...score,
      notes,
      tempo,
      title: score.title || b.title,
      key: score.key || b.keyLabel,
      strings: 6,
    },
    editable: true,
  }
}
