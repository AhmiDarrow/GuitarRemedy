import { describe, expect, it } from 'vitest'
import {
  centsOffPitch,
  detectPitchMpm,
  detectPitchYin,
  downsampleFrame,
  estimateNoiseFloorGate,
  frameRms,
  fusePitchDetectors,
  medianFilter,
  nearestGuitarString,
  noteNameFromMidi,
  openStringLabels,
  openStringMidis,
  parabolicOffset,
  phaseVsTarget,
  pushHistory,
  readingFromHz,
  shouldAnalyzeFrame,
  smoothCents,
  smoothCentsAdaptive,
  steelInharmonicityCents,
  stringHzBand,
  DEFAULT_CENTS_IN_TUNE,
  DEFAULT_RMS_GATE,
  TUNER_ANALYSIS_SR,
} from './tuner'
import { midiToHz } from './audioToMidi'
import { TUNINGS } from './theory'

/** Synthesize a pure sine at hz into a mono buffer. */
function sineFrame(hz: number, sampleRate: number, seconds = 0.12, amp = 0.35): Float32Array {
  const n = Math.floor(sampleRate * seconds)
  const out = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    out[i] = amp * Math.sin((2 * Math.PI * hz * i) / sampleRate)
  }
  return out
}

describe('tuner', () => {
  it('names MIDI notes', () => {
    expect(noteNameFromMidi(69)).toEqual({ name: 'A', octave: 4 })
    expect(noteNameFromMidi(40)).toEqual({ name: 'E', octave: 2 })
    expect(noteNameFromMidi(64)).toEqual({ name: 'E', octave: 4 })
  })

  it('measures cents at exact A4', () => {
    const r = centsOffPitch(440, 440)
    expect(r.midi).toBe(69)
    expect(Math.abs(r.cents)).toBeLessThan(0.5)
  })

  it('detects sharp and flat', () => {
    const sharp = centsOffPitch(midiToHz(69) * 2 ** (10 / 1200), 440)
    expect(sharp.cents).toBeGreaterThan(8)
    const flat = centsOffPitch(midiToHz(69) * 2 ** (-10 / 1200), 440)
    expect(flat.cents).toBeLessThan(-8)
  })

  it('maps open strings', () => {
    expect(nearestGuitarString(40)).toBe(0)
    expect(nearestGuitarString(45)).toBe(1)
    expect(nearestGuitarString(64)).toBe(5)
    expect(nearestGuitarString(72)).toBeNull()
  })

  it('maps open strings under Drop D tuning', () => {
    const drop = TUNINGS.drop_d.midi
    expect(openStringMidis(drop)[0]).toBe(38)
    expect(nearestGuitarString(38, 2, drop)).toBe(0)
    // Standard low E (40) is only 2 st from Drop D open — still tags string 0.
    expect(nearestGuitarString(40, 2, drop)).toBe(0)
    // Far from all Drop D opens → null
    expect(nearestGuitarString(72, 2, drop)).toBeNull()
    expect(openStringLabels(drop)[0]).toMatch(/^D/)
    const band = stringHzBand(0, 440, 4, drop)
    expect(band.minHz).toBeLessThan(midiToHz(38, 440))
    expect(band.maxHz).toBeGreaterThan(midiToHz(38, 440))
  })

  it('builds a full reading', () => {
    const r = readingFromHz(440, 0.9, 440)
    expect(r.noteName).toBe('A')
    expect(r.octave).toBe(4)
    expect(r.inTune).toBe(true)
    expect(r.stringIndex).toBeNull()
  })

  it('rejects silence', () => {
    const r = readingFromHz(0, 0.1, 440)
    expect(r.noteName).toBe('—')
    expect(r.hz).toBe(0)
  })

  it('smooths cents', () => {
    expect(smoothCents(0, 10, 0.5)).toBe(5)
  })

  it('adaptive smooth is snappier on large jumps', () => {
    const big = smoothCentsAdaptive(0, 30)
    const small = smoothCentsAdaptive(0, 2)
    expect(Math.abs(big)).toBeGreaterThan(Math.abs(small))
  })

  it('parabolic offset peaks at center', () => {
    expect(Math.abs(parabolicOffset(1, 2, 1))).toBeLessThan(0.01)
  })

  it('median filter kills spikes', () => {
    expect(medianFilter([100, 440, 441, 439, 9000])).toBe(440)
    expect(medianFilter([])).toBe(0)
  })

  it('pushHistory caps length', () => {
    let h: number[] = []
    for (let i = 0; i < 10; i++) h = pushHistory(h, i, 5)
    expect(h).toHaveLength(5)
    expect(h[0]).toBe(5)
    expect(h[4]).toBe(9)
  })

  it('frameRms is low on silence and higher on signal', () => {
    const silent = new Float32Array(512)
    const loud = sineFrame(440, 44100, 0.05, 0.5)
    expect(frameRms(silent)).toBe(0)
    expect(frameRms(loud)).toBeGreaterThan(0.1)
  })

  it('YIN detects A4 within a few cents', () => {
    const sr = 44100
    const frame = sineFrame(440, sr, 0.2, 0.4)
    const { hz, confidence } = detectPitchYin(frame, sr)
    expect(confidence).toBeGreaterThan(0.5)
    expect(hz).toBeGreaterThan(437)
    expect(hz).toBeLessThan(443)
    const { cents } = centsOffPitch(hz, 440)
    expect(Math.abs(cents)).toBeLessThan(8)
  })

  it('YIN detects open low E (~82.4 Hz)', () => {
    const sr = 44100
    const e2 = midiToHz(40, 440)
    const frame = sineFrame(e2, sr, 0.2, 0.45)
    const { hz, confidence } = detectPitchYin(frame, sr, { minHz: 70, maxHz: 1200 })
    expect(confidence).toBeGreaterThan(0.4)
    expect(hz).toBeGreaterThan(e2 * 0.98)
    expect(hz).toBeLessThan(e2 * 1.02)
  })

  it('YIN detects open high E (~329.6 Hz)', () => {
    const sr = 44100
    const e4 = midiToHz(64, 440)
    const frame = sineFrame(e4, sr, 0.12, 0.4)
    const { hz, confidence } = detectPitchYin(frame, sr)
    expect(confidence).toBeGreaterThan(0.45)
    const { midi, cents } = centsOffPitch(hz, 440)
    expect(midi).toBe(64)
    expect(Math.abs(cents)).toBeLessThan(8)
  })

  it('YIN rejects near-silence', () => {
    const frame = sineFrame(440, 44100, 0.1, 0.0005)
    const { hz } = detectPitchYin(frame, 44100)
    expect(hz).toBe(0)
  })

  it('in-tune threshold defaults to tight ±5¢', () => {
    expect(DEFAULT_CENTS_IN_TUNE).toBe(5)
    const almost = readingFromHz(midiToHz(69) * 2 ** (4 / 1200), 0.9, 440)
    expect(almost.inTune).toBe(true)
    const off = readingFromHz(midiToHz(69) * 2 ** (12 / 1200), 0.9, 440)
    expect(off.inTune).toBe(false)
  })

  it('MPM detects A4', () => {
    const sr = 44100
    const frame = sineFrame(440, sr, 0.2, 0.4)
    const { hz, confidence } = detectPitchMpm(frame, sr)
    expect(confidence).toBeGreaterThan(0.4)
    expect(hz).toBeGreaterThan(430)
    expect(hz).toBeLessThan(450)
  })

  it('fuse prefers fundamental on octave disagreement', () => {
    const high = { hz: 440, confidence: 0.9 }
    const low = { hz: 220, confidence: 0.4 }
    // Octave pair → lower (fundamental)
    expect(fusePitchDetectors(high, low).hz).toBe(220)
    expect(fusePitchDetectors(low, high).hz).toBe(220)
  })

  it('fuse prefers higher confidence when not octave-related', () => {
    const a = { hz: 440, confidence: 0.9 }
    const b = { hz: 300, confidence: 0.4 }
    expect(fusePitchDetectors(a, b).hz).toBe(440)
    expect(fusePitchDetectors(b, a).hz).toBe(440)
  })

  it('downsample reduces rate toward analysis SR', () => {
    const sr = 48000
    const frame = sineFrame(440, sr, 0.05, 0.3)
    const { frame: ds, sampleRate } = downsampleFrame(frame, sr)
    expect(sampleRate).toBeLessThanOrEqual(TUNER_ANALYSIS_SR * 1.05)
    expect(ds.length).toBeLessThan(frame.length)
  })

  it('stringHzBand clamps around open string', () => {
    const band = stringHzBand(0, 440, 4)
    const e2 = midiToHz(40, 440)
    expect(band.minHz).toBeLessThan(e2)
    expect(band.maxHz).toBeGreaterThan(e2)
    expect(band.maxHz).toBeLessThan(midiToHz(50, 440))
  })

  it('steel inharmonicity is stronger on high strings', () => {
    expect(steelInharmonicityCents(64)).toBeGreaterThan(steelInharmonicityCents(40))
  })

  it('phaseVsTarget is finite for a sine on pitch', () => {
    const sr = 44100
    const frame = sineFrame(440, sr, 0.1, 0.4)
    const p = phaseVsTarget(frame, sr, 440)
    expect(Number.isFinite(p)).toBe(true)
    expect(Math.abs(p)).toBeLessThanOrEqual(0.5)
  })

  it('estimateNoiseFloorGate rises with louder floor', () => {
    const quiet = new Float32Array(8000)
    const noisy = sineFrame(120, 16000, 0.5, 0.02)
    const gQ = estimateNoiseFloorGate(quiet)
    const gN = estimateNoiseFloorGate(noisy)
    expect(gQ).toBeGreaterThanOrEqual(0.002)
    expect(gN).toBeGreaterThanOrEqual(gQ)
    expect(gN).toBeLessThanOrEqual(0.04)
  })

  it('shouldAnalyzeFrame rejects silence', () => {
    const silent = new Float32Array(1024)
    expect(shouldAnalyzeFrame(silent, DEFAULT_RMS_GATE).ok).toBe(false)
  })

  it('shouldAnalyzeFrame accepts steady tone', () => {
    const tone = sineFrame(440, 44100, 0.08, 0.35)
    expect(shouldAnalyzeFrame(tone, DEFAULT_RMS_GATE).ok).toBe(true)
  })

  it('guitar temperament shifts cents slightly', () => {
    const plain = readingFromHz(midiToHz(64, 440), 0.9, 440, 5, { guitarTemperament: false })
    const steel = readingFromHz(midiToHz(64, 440), 0.9, 440, 5, { guitarTemperament: true })
    // Exact ET high-E with steel bias should read slightly flat of 0
    expect(steel.cents).toBeLessThan(plain.cents)
  })
})
