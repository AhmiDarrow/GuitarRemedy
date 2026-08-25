/** Tone.js play-along helpers — lazy import to keep tests light */

import type { ScaleId } from './theory'
import {
  CHORDS,
  chordNotes,
  nameToMidi,
  noteToPc,
  parseChordSymbol,
  scalePitchClasses,
  STANDARD_TUNING,
} from './theory'
import { midiToHz } from './audioToMidi'
// audio ↔ metronome cycle is call-time-only (function bodies), safe for ESM;
// static imports keep Vite from faking lazy splits it cannot honor.
import { playOneShotClick, stopMetronome } from './metronome'

let toneModule: typeof import('tone') | null = null
let synth: import('tone').PolySynth | null = null
let started = false
let unlockBound = false
/** Active concert pitch for playback (Profile A4). Tone's MIDI map is always A4=440. */
let playbackA4 = 440

async function tone() {
  if (!toneModule) toneModule = await import('tone')
  return toneModule
}

/**
 * WebView2 / desktop shells often keep AudioContext suspended until a real
 * user gesture. Bind once so the first click/key/touch resumes Tone.
 */
export function bindAudioUnlock(): void {
  if (unlockBound || typeof window === 'undefined') return
  unlockBound = true
  const unlock = () => {
    void ensureAudio().catch(() => {
      /* first gesture may still race; play paths retry */
    })
  }
  const opts: AddEventListenerOptions = { capture: true, passive: true }
  for (const ev of ['pointerdown', 'keydown', 'touchstart', 'mousedown'] as const) {
    window.addEventListener(ev, unlock, opts)
  }
}

/** Set concert A used for MIDI→Hz when playing notes/tabs/refs. */
export function setPlaybackA4(hz: number): void {
  if (Number.isFinite(hz) && hz >= 400 && hz <= 480) playbackA4 = hz
  else playbackA4 = 440
}

export function getPlaybackA4(): number {
  return playbackA4
}

/** Absolute frequency for a MIDI note at the active (or override) A4. */
export function midiNoteHz(midi: number, a4 = playbackA4): number {
  const a = Number.isFinite(a4) && a4 > 0 ? a4 : 440
  return midiToHz(midi, a)
}

export async function ensureAudio(): Promise<void> {
  bindAudioUnlock()
  const Tone = await tone()
  // Always try to resume — WebView2 often re-suspends after focus loss.
  try {
    await Tone.start()
    const ctx = Tone.getContext()?.rawContext as AudioContext | undefined
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume()
    }
    started = true
  } catch {
    started = false
    throw new Error('Audio context could not start — click the app once, then play again')
  }
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.18, sustain: 0.35, release: 0.6 },
    }).toDestination()
    synth.volume.value = -6
  }
  // Nudge destination gain in case the shell muted the graph.
  try {
    Tone.getDestination().volume.value = 0
  } catch {
    /* older tone builds */
  }
}

/**
 * Play a MIDI note. Duration: Tone notation (`8n`) or seconds (number).
 * Uses Profile A4 via setPlaybackA4 / opts.a4 — not Tone's fixed 440 MIDI map.
 */
export async function playMidiNote(
  midi: number,
  duration: number | string = '8n',
  time?: number,
  opts?: { a4?: number },
) {
  await ensureAudio()
  const a4 = opts?.a4 ?? playbackA4
  const hz = midiNoteHz(midi, a4)
  // Frequency in Hz so A4≠440 is truthful (Tone.Frequency(midi,'midi') is always 440-based).
  if (time != null) synth!.triggerAttackRelease(hz, duration, time)
  else synth!.triggerAttackRelease(hz, duration)
}

/**
 * Play a MIDI note. When `duration` is a number it is seconds.
 * Optional `time` is an absolute AudioContext/Tone time (Tone.now()-based).
 */
export async function playNote(
  midi: number,
  duration: number | string = 0.4,
  time?: number,
  opts?: { a4?: number },
) {
  const dur =
    typeof duration === 'number' && Number.isFinite(duration)
      ? Math.max(0.05, duration)
      : duration
  await playMidiNote(midi, dur, time, opts)
}

/** Current audio clock time (Tone.now), after ensureAudio. */
export async function audioNow(): Promise<number> {
  await ensureAudio()
  const Tone = await tone()
  return Tone.now()
}

/**
 * Schedule a UI callback on the animation frame nearest to an audio-clock time.
 * Keeps tab cursor / transport chrome locked to Tone's clock (not wall setTimeout drift).
 */
export async function scheduleDraw(callback: () => void, time: number): Promise<void> {
  await ensureAudio()
  const Tone = await tone()
  Tone.Draw.schedule(() => {
    try {
      callback()
    } catch {
      /* ignore UI errors mid-draw */
    }
  }, time)
}

/** Cancel pending Draw callbacks at/after `time` (default: all future). */
export async function cancelDraw(time = 0): Promise<void> {
  try {
    const Tone = await tone()
    Tone.Draw.cancel(time)
  } catch {
    /* Tone not loaded */
  }
}

export async function playFret(
  stringIndex: number,
  fret: number,
  tuning: number[] = [...STANDARD_TUNING],
  opts?: { a4?: number },
) {
  const midi = (tuning[stringIndex] ?? STANDARD_TUNING[stringIndex]) + fret
  await playMidiNote(midi, '8n', undefined, opts)
}

/** Bump generation so in-flight schedulers abandon after stop. */
let playGeneration = 0

export function getPlayGeneration(): number {
  return playGeneration
}

/** UI callback when notes fire — midis sounding together (scale step or full chord). */
export type PlayNotesEvent = {
  midis: number[]
  /** Step index in the sequence (scale degree walk / chord index). */
  index: number
  /** Audio-clock time the notes start. */
  time: number
}

/** Map sounding MIDI notes → unique pitch classes 0–11 (fretboard highlight). */
export function midisToPitchClasses(midis: number[]): number[] {
  if (!midis.length) return []
  return Array.from(new Set(midis.map((m) => ((m % 12) + 12) % 12))).sort(
    (a, b) => a - b,
  )
}

function schedulePlayNotes(
  Tone: typeof import('tone'),
  gen: number,
  time: number,
  midis: number[],
  index: number,
  onNotes?: (ev: PlayNotesEvent) => void,
) {
  if (!onNotes || !midis.length) return
  const payload: PlayNotesEvent = { midis: [...midis], index, time }
  Tone.Draw.schedule(() => {
    if (gen !== playGeneration) return
    try {
      onNotes(payload)
    } catch {
      /* ignore UI errors mid-draw */
    }
  }, time)
}

/**
 * Schedule MIDI notes on the audio clock. Returns duration (sec) and generation.
 * If stopAllNotes() runs mid-sequence, the disposed synth + generation kill the rest.
 * Optional onNotes fires on Tone.Draw locked to each note (for fretboard animation).
 */
export async function playMidiSequence(
  midis: number[],
  opts?: {
    bpm?: number
    /** Note length in beats (default 0.5 = eighth at bpm) */
    noteBeats?: number
    gapBeats?: number
    a4?: number
    /** Hold each note this many seconds (overrides noteBeats for duration only) */
    holdSec?: number
    session?: Exclude<AudioSessionOwner, 'idle'>
    /** Fired per note on the audio clock (UI highlight). */
    onNotes?: (ev: PlayNotesEvent) => void
  },
): Promise<{ durationSec: number; generation: number }> {
  const session = opts?.session ?? 'scale'
  // Kill any prior scheduled sequence before arming a new one.
  stopAllNotes()
  await claimAudioSession(session)
  await ensureAudio()
  const Tone = await tone()
  const gen = playGeneration
  const bpm = opts?.bpm ?? 80
  const a4 = opts?.a4 ?? playbackA4
  const noteBeats = opts?.noteBeats ?? 0.5
  const gapBeats = opts?.gapBeats ?? noteBeats
  const step = (60 / bpm) * gapBeats
  const hold =
    opts?.holdSec != null
      ? Math.max(0.05, opts.holdSec)
      : Math.max(0.05, (60 / bpm) * noteBeats * 0.9)
  if (!midis.length || !synth) return { durationSec: 0, generation: gen }
  const now = Tone.now() + 0.05
  for (let i = 0; i < midis.length; i++) {
    if (gen !== playGeneration || !synth) break
    const t = now + i * step
    const hz = midiNoteHz(midis[i], a4)
    try {
      synth.triggerAttackRelease(hz, hold, t)
      schedulePlayNotes(Tone, gen, t, [midis[i]], i, opts?.onNotes)
    } catch {
      break
    }
  }
  return { durationSec: Math.max(0, midis.length * step), generation: gen }
}

export async function playScale(
  root: string,
  scaleId: ScaleId | string,
  opts?: {
    bpm?: number
    octaves?: number
    reverse?: boolean
    a4?: number
    onNotes?: (ev: PlayNotesEvent) => void
  },
): Promise<number> {
  const bpm = opts?.bpm ?? 80
  const octaves = opts?.octaves ?? 1
  const pcs = scalePitchClasses(root, scaleId)
  const rootMidi = nameToMidi(root.match(/\d/) ? root : `${root}3`)
  const notes: number[] = []
  for (let o = 0; o < octaves; o++) {
    for (const pc of pcs) {
      let m = rootMidi + o * 12 + ((pc - (rootMidi % 12) + 12) % 12)
      if (m < rootMidi) m += 12
      notes.push(m)
    }
  }
  notes.push(rootMidi + octaves * 12)
  if (opts?.reverse) notes.push(...[...notes].reverse().slice(1))

  const { durationSec } = await playMidiSequence(notes, {
    bpm,
    noteBeats: 0.5,
    a4: opts?.a4,
    session: 'scale',
    onNotes: opts?.onNotes,
  })
  return durationSec
}

/** Strum / arpeggiate a chord (root + quality or ChordId). */
export async function playChord(
  root: string,
  qualityOrId: string,
  opts?: {
    a4?: number
    arpeggio?: boolean
    bpm?: number
    onNotes?: (ev: PlayNotesEvent) => void
  },
): Promise<number> {
  // chordNotes expects quality text; resolveChordId inside handles ChordIds too.
  const midis = chordNotes(root.replace(/\d/g, '') || root, qualityOrId)
  if (!midis.length) return 0
  if (opts?.arpeggio) {
    const { durationSec } = await playMidiSequence(midis, {
      bpm: opts?.bpm ?? 90,
      noteBeats: 0.5,
      a4: opts?.a4,
      session: 'scale',
      onNotes: opts?.onNotes,
    })
    return durationSec
  }
  stopAllNotes()
  await claimAudioSession('scale')
  await ensureAudio()
  const gen = playGeneration
  const a4 = opts?.a4 ?? playbackA4
  const Tone = await tone()
  const when = Tone.now() + 0.05
  if (gen !== playGeneration || !synth) return 0
  for (let i = 0; i < midis.length; i++) {
    if (gen !== playGeneration || !synth) break
    const hz = midiNoteHz(midis[i], a4)
    // Slight roll so the chord isn't a click
    synth.triggerAttackRelease(hz, 1.2, when + i * 0.03)
  }
  // One highlight for the full strum (all chord tones together).
  schedulePlayNotes(Tone, gen, when, midis, 0, opts?.onNotes)
  return 1.4
}

/** Play a progression of chord symbols (e.g. G, Em, C, D) one bar each. */
export async function playProgression(
  symbols: string[],
  opts?: {
    bpm?: number
    beatsPerChord?: number
    a4?: number
    onNotes?: (ev: PlayNotesEvent) => void
  },
): Promise<number> {
  const bpm = opts?.bpm ?? 80
  const beats = opts?.beatsPerChord ?? 2
  const a4 = opts?.a4 ?? playbackA4
  const beatSec = 60 / bpm
  const hold = Math.max(0.2, beats * beatSec * 0.85)
  const gap = beats * beatSec

  // Restart cleanly if something was already playing.
  stopAllNotes()
  await claimAudioSession('scale')
  await ensureAudio()
  const Tone = await tone()
  const gen = playGeneration
  const t0 = Tone.now() + 0.05
  let i = 0
  for (const sym of symbols) {
    if (gen !== playGeneration || !synth) break
    const parsed = parseChordSymbol(sym)
    if (!parsed) continue
    const chord = CHORDS[parsed.chordId]
    if (!chord) continue
    const rootMidi = nameToMidi(`${parsed.root}3`)
    const rootPc = noteToPc(parsed.root)
    const when = t0 + i * gap
    const chordMidis: number[] = []
    for (let v = 0; v < chord.intervals.length; v++) {
      if (gen !== playGeneration || !synth) break
      const pc = (rootPc + (chord.intervals[v] % 12)) % 12
      let midi = rootMidi + ((pc - (rootMidi % 12) + 12) % 12)
      if (midi < rootMidi) midi += 12
      chordMidis.push(midi)
      const hz = midiNoteHz(midi, a4)
      try {
        synth.triggerAttackRelease(hz, hold, when + v * 0.025)
      } catch {
        break
      }
    }
    schedulePlayNotes(Tone, gen, when, chordMidis, i, opts?.onNotes)
    i += 1
  }
  return Math.max(0, i * gap + hold)
}

/**
 * @deprecated Prefer metronome.ts startMetronome — kept as a thin one-shot
 * that reuses the shared click voice (no leaked MembraneSynth per call).
 */
export async function playMetronomeClick(accent = false) {
  await playOneShotClick(accent ? 'accent' : 'beat')
}

export function disposeAudio() {
  synth?.dispose()
  synth = null
  started = false
}

/**
 * Hard-stop playback: cancel Draw callbacks, bump generation, and dispose the
 * synth so already-scheduled Tone events cannot keep firing after Stop.
 * (releaseAll alone only quiets currently sounding voices.)
 */
export function stopAllNotes() {
  playGeneration += 1
  try {
    void cancelDraw(0)
  } catch {
    /* ignore */
  }
  try {
    if (synth) {
      try {
        synth.releaseAll()
      } catch {
        /* ignore */
      }
      try {
        synth.dispose()
      } catch {
        /* ignore */
      }
      synth = null
    }
  } catch {
    // ignore if Tone not loaded
  }
}

/**
 * Single audio-session owner so metronome Transport and tab poly synth
 * don't fight. Call before starting tab playback or metronome.
 */
export type AudioSessionOwner = 'idle' | 'metronome' | 'tabs' | 'scale'

let sessionOwner: AudioSessionOwner = 'idle'
const sessionListeners = new Set<(owner: AudioSessionOwner) => void>()

export function getAudioSessionOwner(): AudioSessionOwner {
  return sessionOwner
}

export function onAudioSessionChange(cb: (owner: AudioSessionOwner) => void): () => void {
  sessionListeners.add(cb)
  return () => {
    sessionListeners.delete(cb)
  }
}

function setSessionOwner(owner: AudioSessionOwner) {
  if (sessionOwner === owner) return
  sessionOwner = owner
  for (const cb of sessionListeners) {
    try {
      cb(owner)
    } catch {
      /* ignore */
    }
  }
}

/** Claim the audio session; stops the previous owner when switching. */
export async function claimAudioSession(owner: Exclude<AudioSessionOwner, 'idle'>): Promise<void> {
  if (sessionOwner === owner) return
  const prev = sessionOwner
  if (prev === 'metronome' && owner !== 'metronome') {
    try {
      await stopMetronome({ skipSession: true })
    } catch {
      /* ignore */
    }
  }
  // Leaving tabs/scale (or switching between them) must hard-stop scheduled notes.
  if (prev === 'tabs' || prev === 'scale') {
    stopAllNotes()
  }
  setSessionOwner(owner)
}

export function releaseAudioSession(owner: AudioSessionOwner): void {
  if (sessionOwner === owner) setSessionOwner('idle')
}
