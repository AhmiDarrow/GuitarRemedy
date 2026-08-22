/** Tone.js play-along helpers — lazy import to keep tests light */

import type { ScaleId } from './theory'
import { nameToMidi, scalePitchClasses, STANDARD_TUNING } from './theory'
import { midiToHz } from './audioToMidi'

let toneModule: typeof import('tone') | null = null
let synth: import('tone').PolySynth | null = null
let started = false
/** Active concert pitch for playback (Profile A4). Tone's MIDI map is always A4=440. */
let playbackA4 = 440

async function tone() {
  if (!toneModule) toneModule = await import('tone')
  return toneModule
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
  const Tone = await tone()
  if (!started) {
    await Tone.start()
    started = true
  }
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.8 },
    }).toDestination()
    synth.volume.value = -8
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
) {
  const midi = (tuning[stringIndex] ?? STANDARD_TUNING[stringIndex]) + fret
  await playMidiNote(midi, '8n')
}

export async function playScale(
  root: string,
  scaleId: ScaleId | string,
  opts?: { bpm?: number; octaves?: number; reverse?: boolean; a4?: number },
) {
  await ensureAudio()
  const Tone = await tone()
  const bpm = opts?.bpm ?? 80
  const octaves = opts?.octaves ?? 1
  const a4 = opts?.a4 ?? playbackA4
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

  const now = Tone.now() + 0.05
  const step = 60 / bpm / 2
  notes.forEach((m, i) => {
    const hz = midiNoteHz(m, a4)
    synth!.triggerAttackRelease(hz, step * 0.9, now + i * step)
  })
  return notes.length * step
}

/**
 * @deprecated Prefer metronome.ts startMetronome — kept as a thin one-shot
 * that reuses the shared click voice (no leaked MembraneSynth per call).
 */
export async function playMetronomeClick(accent = false) {
  const { playOneShotClick } = await import('./metronome')
  await playOneShotClick(accent ? 'accent' : 'beat')
}

export function disposeAudio() {
  synth?.dispose()
  synth = null
  started = false
}

/** Silence any hanging voices (TabView stop). */
export function stopAllNotes() {
  try {
    synth?.releaseAll()
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
      const { stopMetronome } = await import('./metronome')
      await stopMetronome({ skipSession: true })
    } catch {
      /* ignore */
    }
  }
  if ((prev === 'tabs' || prev === 'scale') && owner === 'metronome') {
    stopAllNotes()
  }
  setSessionOwner(owner)
}

export function releaseAudioSession(owner: AudioSessionOwner): void {
  if (sessionOwner === owner) setSessionOwner('idle')
}
