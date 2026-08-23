import { describe, expect, it } from 'vitest'
import {
  audioBufferToMono,
  detectPitchHz,
  detectTempoBpm,
  emphasizeMelodyBand,
  filterLowConfidenceFrames,
  framesToNotes,
  guitarRegisterScore,
  hzToMidi,
  medianFilterMidiFrames,
  midiToHz,
  pcmToMidi,
  quantizeDetectedNotes,
  repairOctaveFrames,
  snapTempoBpm,
  synthesizeTonePcm,
  trackPitchFrames,
  type PitchFrame,
} from './audioToMidi'

describe('audioToMidi', () => {
  it('pcmToMidiAsync with pitchEngine=autocorr matches classic path', async () => {
    const { pcmToMidiAsync } = await import('./audioToMidi')
    const pcm = synthesizeTonePcm(
      [
        { hz: 440, startSec: 0, durationSec: 0.35 },
        { hz: 494, startSec: 0.4, durationSec: 0.35 },
      ],
      22050,
      1.0,
    )
    const classic = pcmToMidi(pcm, 22050, {
      tempoBpm: 100,
      skipHpss: true,
      skipMelodyBand: true,
    })
    const asyncPath = await pcmToMidiAsync(pcm, 22050, {
      tempoBpm: 100,
      skipHpss: true,
      skipMelodyBand: true,
      pitchEngine: 'autocorr',
    })
    expect(asyncPath.notes.length).toBeGreaterThan(0)
    expect(asyncPath.tempoBpm).toBe(classic.tempoBpm)
    expect(asyncPath.midiBytes.byteLength).toBeGreaterThan(20)
  })

  it('racePitchEngines picks the higher-scoring monophonic draft', async () => {
    const { racePitchEngines } = await import('./audioToMidi')
    const solid = [
      { pitch: 69, start: 0, duration: 240, velocity: 90, timeSec: 0, durationSec: 0.3, confidence: 0.85 },
      { pitch: 71, start: 240, duration: 240, velocity: 88, timeSec: 0.3, durationSec: 0.3, confidence: 0.82 },
      { pitch: 72, start: 480, duration: 240, velocity: 86, timeSec: 0.6, durationSec: 0.3, confidence: 0.8 },
      { pitch: 74, start: 720, duration: 240, velocity: 84, timeSec: 0.9, durationSec: 0.3, confidence: 0.78 },
    ]
    const jumpy = [
      { pitch: 40, start: 0, duration: 120, velocity: 60, timeSec: 0, durationSec: 0.15, confidence: 0.35 },
      { pitch: 88, start: 200, duration: 80, velocity: 50, timeSec: 0.25, durationSec: 0.1, confidence: 0.3 },
      { pitch: 45, start: 400, duration: 100, velocity: 55, timeSec: 0.5, durationSec: 0.12, confidence: 0.32 },
    ]
    const win = racePitchEngines([
      { engine: 'autocorr', notes: jumpy },
      { engine: 'basic-pitch', notes: solid },
    ])
    expect(win).not.toBeNull()
    expect(win!.engine).toBe('basic-pitch')
    expect(win!.notes.length).toBe(4)
  })

  it('audioBufferToMidSide returns side only for stereo with energy', async () => {
    const { audioBufferToMidSide } = await import('./audioToMidi')
    const n = 512
    const L = new Float32Array(n)
    const R = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      L[i] = 0.4
      R[i] = -0.2 // strong side energy
    }
    const stereo = {
      numberOfChannels: 2,
      length: n,
      getChannelData: (c: number) => (c === 0 ? L : R),
    }
    const { mid, side } = audioBufferToMidSide(stereo)
    expect(mid.length).toBe(n)
    expect(side).toBeDefined()
    expect(side!.length).toBe(n)

    const mono = {
      numberOfChannels: 1,
      length: n,
      getChannelData: () => L,
    }
    const m = audioBufferToMidSide(mono)
    expect(m.side).toBeUndefined()
  })

  it('converts hz ↔ midi around A4', () => {
    expect(hzToMidi(440)).toBe(69)
    expect(Math.round(midiToHz(69))).toBe(440)
    expect(hzToMidi(0)).toBe(-1)
  })

  it('hzToMidi respects Profile A4 (432 Hz)', () => {
    // 432 Hz is A4 when a4=432 → MIDI 69
    expect(hzToMidi(432, 432)).toBe(69)
    // 440 Hz with a4=432 is slightly sharp of A4
    expect(hzToMidi(440, 432)).toBeGreaterThanOrEqual(69)
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

  it('mixes multi-channel buffers to mono (mid default + average)', () => {
    const L = new Float32Array([1, 1, 1])
    const R = new Float32Array([0, 0, 0])
    const buf = {
      numberOfChannels: 2,
      length: 3,
      getChannelData: (c: number) => (c === 0 ? L : R),
    }
    const mid = audioBufferToMono(buf)
    expect(mid.length).toBe(3)
    expect(mid[0]).toBeCloseTo(0.5) // (L+R)/2
    const avg = audioBufferToMono(buf, { mode: 'average' })
    expect(avg[0]).toBeCloseTo(0.5)
    const side = audioBufferToMono(buf, { mode: 'side' })
    expect(side[0]).toBeCloseTo(0.5) // (1-0)/2
  })

  it('guitarRegisterScore prefers lead range over bass/air', () => {
    expect(guitarRegisterScore(64)).toBeGreaterThan(guitarRegisterScore(40))
    expect(guitarRegisterScore(69)).toBeGreaterThan(guitarRegisterScore(88))
    expect(guitarRegisterScore(60)).toBe(1)
  })

  it('medianFilterMidiFrames kills single-frame octave blips', () => {
    const frames: PitchFrame[] = [
      { timeSec: 0, hz: 440, midi: 69, confidence: 0.8 },
      { timeSec: 0.05, hz: 880, midi: 81, confidence: 0.5 },
      { timeSec: 0.1, hz: 440, midi: 69, confidence: 0.8 },
    ]
    const m = medianFilterMidiFrames(frames)
    expect(m[1].midi).toBe(69)
  })

  it('snapTempoBpm keeps a sane BPM in range', () => {
    const sr = 8000
    const pcm = new Float32Array(sr * 2)
    // weak click every 0.5s → ~120 BPM
    for (let i = 0; i < pcm.length; i++) {
      pcm[i] = i % Math.floor(sr * 0.5) < 20 ? 0.9 : 0.02
    }
    const snapped = snapTempoBpm(118, pcm, sr)
    expect(snapped).toBeGreaterThanOrEqual(60)
    expect(snapped).toBeLessThanOrEqual(180)
    // half/double of out-of-band raw still clamps
    expect(snapTempoBpm(40, pcm, sr)).toBeGreaterThanOrEqual(60)
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
    // SMF must carry tempo — not rely on parser default 120 after download/re-import
    expect(result.midi.tempoBpm).toBe(100)
    expect(result.tempoBpm).toBe(100)
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

  it('scorePitchFrames rewards stable high-confidence runs', async () => {
    const { scorePitchFrames } = await import('./audioToMidi')
    expect(scorePitchFrames([])).toBe(0)
    expect(
      scorePitchFrames([
        { timeSec: 0, hz: 440, midi: 69, confidence: 0.8 },
        { timeSec: 0.05, hz: 440, midi: 69, confidence: 0.8 },
      ]),
    ).toBe(0) // need ≥3 frames
    const stable: PitchFrame[] = Array.from({ length: 12 }, (_, i) => ({
      timeSec: i * 0.05,
      hz: 440,
      midi: 69,
      confidence: 0.85,
    }))
    const jumpy: PitchFrame[] = Array.from({ length: 12 }, (_, i) => ({
      timeSec: i * 0.05,
      hz: 200 + i * 80,
      midi: 50 + i * 4,
      confidence: 0.4,
    }))
    expect(scorePitchFrames(stable)).toBeGreaterThan(scorePitchFrames(jumpy))
  })

  it('scorePitchFrames prefers guitar-register pitches over bass thump', async () => {
    const { scorePitchFrames } = await import('./audioToMidi')
    const lead: PitchFrame[] = Array.from({ length: 10 }, (_, i) => ({
      timeSec: i * 0.05,
      hz: 440,
      midi: 69,
      confidence: 0.7,
    }))
    const bass: PitchFrame[] = Array.from({ length: 10 }, (_, i) => ({
      timeSec: i * 0.05,
      hz: 82,
      midi: 40,
      confidence: 0.7,
    }))
    expect(scorePitchFrames(lead)).toBeGreaterThan(scorePitchFrames(bass))
  })

  it('pickBestMelodyStem + auto stem race a mixed tone+click track', async () => {
    const { pickBestMelodyStem, selectStem, pcmToMidi } = await import('./audioToMidi')
    const sr = 16000
    const n = sr * 2
    const pcm = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const t = i / sr
      pcm[i] =
        0.4 * Math.sin(2 * Math.PI * 440 * t) + (i % Math.floor(sr * 0.2) < 30 ? 0.7 : 0)
    }
    const best = pickBestMelodyStem(pcm, sr)
    expect(['lead', 'harmonic', 'mix']).toContain(best.stem)
    expect(best.pcm.length).toBe(n)
    expect(Number.isFinite(best.score)).toBe(true)

    const autoPcm = selectStem(pcm, sr, 'auto')
    expect(autoPcm.length).toBe(n)

    const mid = pcmToMidi(pcm, sr, {
      tempoBpm: 120,
      maxSec: 1.5,
      stem: 'auto',
    })
    expect(mid.midiBytes.byteLength).toBeGreaterThan(20)
    expect(mid.warnings.some((w) => /auto-stem|picked/i.test(w))).toBe(true)
  })

  it('detectPitchYinConvert locks a clean A4 tone', async () => {
    const { detectPitchYinConvert, synthesizeTonePcm } = await import('./audioToMidi')
    const sr = 22050
    const pcm = synthesizeTonePcm([{ hz: 440, startSec: 0, durationSec: 0.4 }], sr, 0.45)
    const frame = pcm.subarray(Math.floor(sr * 0.05), Math.floor(sr * 0.05) + Math.floor(sr * 0.09))
    const { hz, confidence } = detectPitchYinConvert(frame, sr)
    expect(confidence).toBeGreaterThan(0.35)
    expect(hz).toBeGreaterThan(420)
    expect(hz).toBeLessThan(460)
  })

  it('estimateTempoFromNotes + blendTempoEstimates refine energy tempo', async () => {
    const { estimateTempoFromNotes, blendTempoEstimates, retempoDetectedNotes } =
      await import('./audioToMidi')
    // 8 notes on quarter grid @ 120 BPM → IOI 0.5s
    const notes = Array.from({ length: 8 }, (_, i) => ({
      pitch: 60 + (i % 4),
      start: i * 480,
      duration: 400,
      velocity: 90,
      timeSec: i * 0.5,
      durationSec: 0.4,
      confidence: 0.8,
    }))
    const fromNotes = estimateTempoFromNotes(notes, { defaultBpm: 100 })
    expect(fromNotes).toBeGreaterThanOrEqual(100)
    expect(fromNotes).toBeLessThanOrEqual(140)
    const blended = blendTempoEstimates(118, fromNotes)
    expect(blended).toBeGreaterThanOrEqual(100)
    expect(blended).toBeLessThanOrEqual(140)
    const ret = retempoDetectedNotes(notes, 100)
    expect(ret[1].start).not.toBe(notes[1].start) // ticks change with tempo
    expect(ret[0].timeSec).toBe(notes[0].timeSec) // wall clock preserved
  })

  it('snapNotesToOnsets pulls starts toward energy peaks', async () => {
    const { snapNotesToOnsets, synthesizeTonePcm } = await import('./audioToMidi')
    const sr = 22050
    // Tone starts at 0.2s — note claimed at 0.15s should move later
    const pcm = synthesizeTonePcm([{ hz: 440, startSec: 0.2, durationSec: 0.35 }], sr, 0.7)
    const notes = [
      {
        pitch: 69,
        start: 120,
        duration: 240,
        velocity: 90,
        timeSec: 0.15,
        durationSec: 0.3,
        confidence: 0.8,
      },
    ]
    const snapped = snapNotesToOnsets(notes, pcm, sr, {
      tempoBpm: 100,
      strength: 1,
      searchSec: 0.08,
    })
    expect(snapped[0].timeSec).toBeGreaterThan(notes[0].timeSec - 0.01)
    expect(snapped[0].timeSec).toBeLessThan(0.28)
  })

  it('refineDetectedNotes monophonic + quantize path keeps a clean scale', async () => {
    const { refineDetectedNotes } = await import('./audioToMidi')
    const spray = [
      { pitch: 60, start: 0, duration: 200, velocity: 90, timeSec: 0, durationSec: 0.25, confidence: 0.85 },
      { pitch: 48, start: 10, duration: 80, velocity: 50, timeSec: 0.01, durationSec: 0.08, confidence: 0.3 },
      { pitch: 62, start: 240, duration: 200, velocity: 88, timeSec: 0.3, durationSec: 0.25, confidence: 0.82 },
      { pitch: 64, start: 480, duration: 200, velocity: 86, timeSec: 0.6, durationSec: 0.25, confidence: 0.8 },
    ]
    const out = refineDetectedNotes(spray, {
      monophonic: true,
      tempoBpm: 100,
      quantize: true,
    })
    expect(out.length).toBeGreaterThanOrEqual(2)
    expect(out.every((n) => n.pitch >= 55)).toBe(true) // bass grab dropped
  })
})
