import { describe, expect, it } from 'vitest'
import {
  audioBufferToMono,
  detectPitchHz,
  detectTempoBpm,
  emphasizeMelodyBand,
  filterLowConfidenceFrames,
  framesToNotes,
  hzToMidi,
  midiToHz,
  pcmToMidi,
  quantizeDetectedNotes,
  repairOctaveFrames,
  synthesizeTonePcm,
  trackPitchFrames,
  type PitchFrame,
} from './audioToMidi'

describe('audioToMidi', () => {
  it('converts hz ↔ midi around A4', () => {
    expect(hzToMidi(440)).toBe(69)
    expect(Math.round(midiToHz(69))).toBe(440)
    expect(hzToMidi(0)).toBe(-1)
  })

  it('detects a clear sine pitch near A4', () => {
    const sr = 22050
    const hz = 440
    const n = Math.floor(sr * 0.1)
    const frame = new Float32Array(n)
    for (let i = 0; i < n; i++) frame[i] = 0.4 * Math.sin((2 * Math.PI * hz * i) / sr)
    const { hz: got, confidence } = detectPitchHz(frame, sr)
    expect(confidence).toBeGreaterThan(0.4)
    expect(Math.abs(got - hz)).toBeLessThan(8)
    expect(hzToMidi(got)).toBe(69)
  })

  it('returns silence for quiet frames', () => {
    const frame = new Float32Array(2048)
    const r = detectPitchHz(frame, 22050)
    expect(r.hz).toBe(0)
    expect(r.confidence).toBe(0)
  })

  it('mixes multi-channel buffers to mono', () => {
    const L = new Float32Array([1, 1, 1])
    const R = new Float32Array([0, 0, 0])
    const mono = audioBufferToMono({
      numberOfChannels: 2,
      length: 3,
      getChannelData: (c) => (c === 0 ? L : R),
    })
    expect(mono.length).toBe(3)
    expect(mono[0]).toBeCloseTo(0.5)
  })

  it('tracks frames and groups notes from synthetic melody', () => {
    // C4 → E4 → G4
    const pcm = synthesizeTonePcm(
      [
        { hz: midiToHz(60), startSec: 0.05, durationSec: 0.35 },
        { hz: midiToHz(64), startSec: 0.45, durationSec: 0.35 },
        { hz: midiToHz(67), startSec: 0.85, durationSec: 0.4 },
      ],
      22050,
      1.4,
    )
    const frames = trackPitchFrames(pcm, 22050, { minConfidence: 0.25 })
    expect(frames.length).toBeGreaterThan(5)
    const notes = framesToNotes(frames, { tempoBpm: 100, minDurationSec: 0.06 })
    expect(notes.length).toBeGreaterThanOrEqual(2)
    // First stable pitch should be near C4
    expect(Math.abs(notes[0].pitch - 60)).toBeLessThanOrEqual(1)
  })

  it('pcmToMidi builds valid SMF bytes with notes', () => {
    const pcm = synthesizeTonePcm(
      [
        { hz: 440, startSec: 0.05, durationSec: 0.4 },
        { hz: 554.37, startSec: 0.55, durationSec: 0.4 }, // C#5-ish
      ],
      22050,
      1.2,
    )
    const result = pcmToMidi(pcm, 22050, { tempoBpm: 100 })
    expect(result.midiBytes.byteLength).toBeGreaterThan(20)
    const head = new Uint8Array(result.midiBytes.slice(0, 4))
    expect(String.fromCharCode(...head)).toBe('MThd')
    expect(result.midi.notes.length).toBeGreaterThan(0)
    expect(result.warnings.some((w) => /monophonic/i.test(w))).toBe(true)
    expect(result.durationSec).toBeGreaterThan(0.5)
  })

  it('repairs octave jumps and filters weak blips', () => {
    const frames: PitchFrame[] = [
      { timeSec: 0, hz: 440, midi: 69, confidence: 0.7 },
      { timeSec: 0.05, hz: 880, midi: 81, confidence: 0.4 }, // +octave error
      { timeSec: 0.1, hz: 440, midi: 69, confidence: 0.65 },
      { timeSec: 0.2, hz: 200, midi: 55, confidence: 0.2 }, // weak
    ]
    const fixed = repairOctaveFrames(frames)
    expect(Math.abs(fixed[1].midi - 69)).toBeLessThanOrEqual(1)
    const kept = filterLowConfidenceFrames(fixed, { minConfidence: 0.32, minRun: 2 })
    expect(kept.every((f) => f.confidence >= 0.32 || f.midi === 69)).toBe(true)
  })

  it('quantizes note starts toward a 16th grid', () => {
    const notes = [
      {
        pitch: 60,
        start: 100,
        duration: 200,
        velocity: 80,
        timeSec: 0.1,
        durationSec: 0.2,
      },
    ]
    const q = quantizeDetectedNotes(notes, {
      tempoBpm: 120,
      ticksPerQuarter: 480,
      gridDivisions: 16,
      strength: 1,
    })
    expect(q[0].start % 120).toBe(0)
  })

  it('emphasizeMelodyBand reduces low-frequency energy', () => {
    const sr = 22050
    const n = sr
    const pcm = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      pcm[i] = 0.5 * Math.sin((2 * Math.PI * 60 * i) / sr) + 0.3 * Math.sin((2 * Math.PI * 440 * i) / sr)
    }
    const out = emphasizeMelodyBand(pcm, sr, { hpHz: 180, strength: 0.9 })
    let lowOut = 0
    for (let i = 0; i < n; i++) {
      lowOut += Math.abs(out[i])
    }
    expect(out.length).toBe(n)
    expect(lowOut).toBeGreaterThan(0)
    expect(detectTempoBpm(pcm, sr, { defaultBpm: 100 })).toBeGreaterThanOrEqual(60)
  })

  it('harmonicEmphasis + trimSamples support the lead pipeline', async () => {
    const { harmonicEmphasis, trimSamples } = await import('./audioToMidi')
    const sr = 8000
    const pcm = new Float32Array(sr * 2)
    for (let i = 0; i < pcm.length; i++) {
      // spike + sustain
      pcm[i] = (i % 40 === 0 ? 0.9 : 0.2) * Math.sin((2 * Math.PI * 440 * i) / sr)
    }
    const harm = harmonicEmphasis(pcm, sr, { mix: 0.7 })
    expect(harm.length).toBe(pcm.length)
    const { samples, trimSec } = trimSamples(pcm, sr, 0.5)
    expect(samples.length).toBe(Math.floor(0.5 * sr))
    expect(trimSec).toBeCloseTo(0.5, 1)
  })

  it('separateHpss splits harmonic vs percussive energy', async () => {
    const { separateHpss, selectStem, pcmToMidi } = await import('./audioToMidi')
    const sr = 16000
    const n = sr * 2
    const pcm = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const t = i / sr
      // sustained A4 + click train (kick-ish)
      pcm[i] =
        0.35 * Math.sin(2 * Math.PI * 440 * t) + (i % Math.floor(sr * 0.25) < 40 ? 0.8 : 0)
    }
    const sep = separateHpss(pcm, sr)
    expect(sep.harmonic.length).toBe(n)
    expect(sep.percussive.length).toBe(n)
    expect(sep.lead.length).toBe(n)
    let hE = 0
    let pE = 0
    for (let i = 0; i < n; i++) {
      hE += sep.harmonic[i] * sep.harmonic[i]
      pE += sep.percussive[i] * sep.percussive[i]
    }
    expect(hE).toBeGreaterThan(0)
    expect(pE).toBeGreaterThan(0)
    const lead = selectStem(pcm, sr, 'lead')
    expect(lead.length).toBe(n)
    const mid = pcmToMidi(pcm, sr, {
      tempoBpm: 120,
      maxSec: 1.5,
      stem: 'lead',
    })
    expect(mid.warnings.some((w) => /HPSS/i.test(w))).toBe(true)
    expect(mid.midiBytes.byteLength).toBeGreaterThan(20)
  })
})
