/** Tone.js play-along helpers — lazy import to keep tests light */

import type { ScaleId } from './theory'
import { nameToMidi, scalePitchClasses, STANDARD_TUNING } from './theory'

let toneModule: typeof import('tone') | null = null
let synth: import('tone').PolySynth | null = null
let started = false

async function tone() {
  if (!toneModule) toneModule = await import('tone')
  return toneModule
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

export async function playMidiNote(midi: number, duration: number | string = '8n', time?: number) {
  await ensureAudio()
  const Tone = await tone()
  const name = Tone.Frequency(midi, 'midi').toNote()
  if (time != null) synth!.triggerAttackRelease(name, duration, time)
  else synth!.triggerAttackRelease(name, duration)
}

/**
 * Play a MIDI note. When `duration` is a number it is seconds.
 * Optional `time` is an absolute AudioContext/Tone time (Tone.now()-based).
 */
export async function playNote(midi: number, duration: number | string = 0.4, time?: number) {
  const dur =
    typeof duration === 'number' && Number.isFinite(duration)
      ? Math.max(0.05, duration)
      : duration
  await playMidiNote(midi, dur, time)
}

/** Current audio clock time (Tone.now), after ensureAudio. */
export async function audioNow(): Promise<number> {
  await ensureAudio()
  const Tone = await tone()
  return Tone.now()
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
  opts?: { bpm?: number; octaves?: number; reverse?: boolean },
) {
  await ensureAudio()
  const Tone = await tone()
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

  const now = Tone.now() + 0.05
  const step = 60 / bpm / 2
  notes.forEach((m, i) => {
    const name = Tone.Frequency(m, 'midi').toNote()
    synth!.triggerAttackRelease(name, step * 0.9, now + i * step)
  })
  return notes.length * step
}

export async function playMetronomeClick(accent = false) {
  await ensureAudio()
  const Tone = await tone()
  const click = new Tone.MembraneSynth({
    pitchDecay: 0.008,
    octaves: 2,
    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 },
  }).toDestination()
  click.volume.value = accent ? -4 : -12
  click.triggerAttackRelease(accent ? 'C2' : 'G1', '32n')
  setTimeout(() => click.dispose(), 300)
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
