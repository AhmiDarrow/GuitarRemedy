import { describe, expect, it } from 'vitest'
import {
  analyzeNotes,
  assertDisplayString,
  assertTheoryString,
  breakdownAudioAssist,
  breakdownGuitarPro,
  displayStringToTheory,
  estimateNoteConfidence,
  getSessionTuning,
  midiBytesToGuitarTabs,
  midiToBreakdown,
  setSessionTuning,
  tabToAscii,
  theoryStringToDisplay,
  UPLOAD_ACCEPT,
  AUDIO_EXTENSIONS,
  AUDIO_FORMATS_LABEL,
  isAudioUpload,
} from './breakdown'
import { buildSimpleMidi, parseMidi } from './midi'
import { TUNINGS } from './theory'

describe('breakdown', () => {
  it('analyzes a MIDI melody into tab + key', () => {
    const buf = buildSimpleMidi([
      { pitch: 64, start: 0, duration: 240 }, // E4
      { pitch: 67, start: 240, duration: 240 }, // G4
      { pitch: 71, start: 480, duration: 240 }, // B4
      { pitch: 74, start: 720, duration: 480 }, // D5
    ])
    const parsed = parseMidi(buf)
    const result = midiToBreakdown(parsed, 'Em sketch')
    expect(result.tab.length).toBeGreaterThan(0)
    expect(result.tabNotes.length).toBe(result.tab.length)
    expect(result.score.notes.length).toBeGreaterThan(0)
    expect(result.explanation.length).toBeGreaterThan(0)
    expect(result.practicePlan.length).toBeGreaterThan(0)
    expect(result.confidence).toBeGreaterThan(0)
    expect(result.key.root).toBeTruthy()
  })

  it('stores score time in beats (not seconds-at-120bpm)', () => {
    const buf = buildSimpleMidi([
      { pitch: 60, start: 0, duration: 480 },
      { pitch: 64, start: 480, duration: 480 },
      { pitch: 67, start: 960, duration: 480 },
    ])
    const parsed = parseMidi(buf)
    const result = midiToBreakdown(parsed, 'beat grid')
    expect(result.score.tempo).toBeGreaterThan(0)
    // ticksPerQuarter 480 → start beats 0, 1, 2
    const times = result.score.notes.map((n) => n.time).sort((a, b) => a - b)
    expect(times[0]).toBeCloseTo(0, 5)
    expect(times[1]).toBeCloseTo(1, 5)
    expect(times[2]).toBeCloseTo(2, 5)
    // display string is high-e=0; theory low-E=0 is flipped once
    for (const n of result.score.notes) {
      expect(n.string).toBeGreaterThanOrEqual(0)
      expect(n.string).toBeLessThanOrEqual(5)
      expect(n.duration).toBeGreaterThan(0)
    }
  })

  it('marks audio assist as editable and low confidence', () => {
    const r = breakdownAudioAssist('jam.wav', [57, 60, 62, 64])
    expect(r.kind).toBe('audio')
    expect(r.editable).toBe(true)
    expect(r.confidence).toBeLessThan(0.6)
    expect(r.warnings.some((w) => /assist|monophonic|editable/i.test(w))).toBe(true)
  })

  it('estimateNoteConfidence prefers quality over raw length', () => {
    expect(estimateNoteConfidence([])).toBeLessThan(0.2)
    const melody = [60, 62, 64, 65, 67, 69, 71, 72]
    const longNoise = Array.from({ length: 200 }, (_, i) => 40 + (i % 48))
    const m = estimateNoteConfidence(melody, { source: 'midi' })
    const n = estimateNoteConfidence(longNoise, { source: 'audio', avgFrameConf: 0.2 })
    expect(m).toBeGreaterThan(0.7)
    expect(n).toBeLessThan(m)
    expect(estimateNoteConfidence(melody, { source: 'audio', avgFrameConf: 0.9 })).toBeLessThanOrEqual(
      0.82,
    )
  })

  it('renders onset-aware ascii tab (not left-packed)', () => {
    // theory string 5 = high e (display row e|); frets at beat 0 and beat 2
    const ascii = tabToAscii(
      [
        { string: 5, fret: 0, midi: 64, startBeat: 0, durationBeats: 1, noteName: 'E4' },
        { string: 5, fret: 3, midi: 67, startBeat: 2, durationBeats: 1, noteName: 'G4' },
      ],
      1,
      { beatsPerMeasure: 4, colsPerBeat: 2 },
    )
    expect(ascii).toContain('e|')
    expect(ascii).toContain('E|')
    const eLine = ascii.split('\n').find((l) => l.startsWith('e|'))
    expect(eLine).toBeTruthy()
    const body = eLine!.slice(2, eLine!.lastIndexOf('|'))
    // 4 beats × 2 cols × 2 chars = 16
    expect(body.length).toBe(16)
    expect(body).toMatch(/0/)
    expect(body).toMatch(/3/)
    // frets not packed adjacent at start — rest dashes between
    const i0 = body.search(/0/)
    const i3 = body.search(/3/)
    expect(i3).toBeGreaterThan(i0 + 2)
  })

  it('analyzeNotes accepts timeSig override', () => {
    const b = analyzeNotes([60, 64, 67], 'waltz', { timeSig: [3, 4], tempoBpm: 90 })
    expect(b.timeSig).toEqual([3, 4])
    expect(b.tempoBpm).toBe(90)
    expect(b.score.timeSig).toEqual([3, 4])
  })

  it('Guitar Pro empty buffer stays editable with honest fallback', async () => {
    const r = await breakdownGuitarPro(new ArrayBuffer(0), 'empty.gp')
    expect(r.kind).toBe('guitarpro')
    expect(r.editable).toBe(true)
    expect(r.tab.length).toBeGreaterThan(0)
    expect(r.isPlaceholder).toBe(true)
    expect(r.warnings.length + r.explanation.length).toBeGreaterThan(0)
    expect(
      [...r.warnings, ...r.explanation, r.statusMessage || ''].some((t) =>
        /MIDI|MusicXML|best-effort|fallback|binary|placeholder/i.test(t),
      ),
    ).toBe(true)
  })

  it('warns when MIDI has multiple tempos and warps beat positions', () => {
    // Minimal multi-tempo via parse result shape
    const parsed = {
      format: 0,
      ticksPerQuarter: 480,
      trackCount: 1,
      notes: [
        { pitch: 60, startTick: 0, durationTicks: 480, velocity: 80, channel: 0, track: 0 },
        { pitch: 64, startTick: 480, durationTicks: 480, velocity: 80, channel: 0, track: 0 },
      ],
      tempoBpm: 100,
      tempoMap: [
        { tick: 0, bpm: 100 },
        { tick: 480, bpm: 140 },
      ],
      hasTempoChanges: true,
      timeSignature: { numerator: 4, denominator: 4 },
      pitchClasses: [0, 4],
    }
    const result = midiToBreakdown(parsed as never, 'tempo map')
    expect(result.tempoBpm).toBe(100)
    expect(result.warnings.some((w) => /multiple tempos|tempo changes|warped/i.test(w))).toBe(true)
    // Second note starts after 1 beat at 100 BPM wall-clock; warped start > pure tick/tpq only if tempos differ mid-note —
    // at the tempo change boundary startBeat for note 2 equals 1.0 still (change at same tick).
    const times = result.score.notes.map((n) => n.time).sort((a, b) => a - b)
    expect(times[0]).toBeCloseTo(0, 5)
    expect(times[1]).toBeCloseTo(1, 5)
  })

  it('warps later notes when tempo speeds up mid-file', () => {
    const parsed = {
      format: 0,
      ticksPerQuarter: 480,
      trackCount: 1,
      notes: [
        { pitch: 60, startTick: 0, durationTicks: 480, velocity: 80, channel: 0, track: 0 },
        // After 1 quarter at 60 BPM then 1 quarter at 120 BPM → wall 1.5s → 1.5 beats at ref 60
        { pitch: 64, startTick: 960, durationTicks: 480, velocity: 80, channel: 0, track: 0 },
      ],
      tempoBpm: 60,
      tempoMap: [
        { tick: 0, bpm: 60 },
        { tick: 480, bpm: 120 },
      ],
      hasTempoChanges: true,
      timeSignature: { numerator: 4, denominator: 4 },
      pitchClasses: [0, 4],
    }
    const result = midiToBreakdown(parsed as never, 'warp')
    const times = result.score.notes.map((n) => n.time).sort((a, b) => a - b)
    expect(times[0]).toBeCloseTo(0, 5)
    // Without warp: 960/480 = 2 beats. With warp at ref 60: 1.5 beats.
    expect(times[1]).toBeCloseTo(1.5, 5)
  })

  it('dual string index: theory ↔ display round-trip + assert guards', () => {
    for (let t = 0; t <= 5; t++) {
      expect(displayStringToTheory(theoryStringToDisplay(t))).toBe(t)
      expect(assertTheoryString(t)).toBe(t)
      expect(assertDisplayString(t)).toBe(t)
    }
    expect(() => assertTheoryString(-1)).toThrow(/theory string/)
    expect(() => assertDisplayString(6)).toThrow(/display string/)
  })

  it('midiBytesToGuitarTabs honors explicit Drop D tuning over session', () => {
    setSessionTuning(TUNINGS.standard.midi)
    // Low D2 = 38 — only open on Drop D low string
    const buf = buildSimpleMidi([{ pitch: 38, start: 0, duration: 480 }], {
      tempoBpm: 100,
    })
    const drop = midiBytesToGuitarTabs(buf, 'drop-d.mid', {
      tuning: TUNINGS.drop_d.midi,
    })
    expect(drop.tab.length).toBeGreaterThan(0)
    const low = drop.tab.find((n) => n.midi === 38)
    expect(low).toBeTruthy()
    expect(low!.string).toBe(0) // theory low E string
    expect(low!.fret).toBe(0)
    // opts.tuning also updates session for follow-up calls
    expect(getSessionTuning()).toEqual(TUNINGS.drop_d.midi)
    setSessionTuning(TUNINGS.standard.midi)
  })

  it('re-imports exported MIDI at the embedded tempo (not default 120)', () => {
    const buf = buildSimpleMidi(
      [
        { pitch: 60, start: 0, duration: 480 },
        { pitch: 64, start: 480, duration: 480 },
      ],
      { tempoBpm: 88, ticksPerQuarter: 480 },
    )
    const b = midiBytesToGuitarTabs(buf, 'tempo-truth.mid')
    expect(b.tempoBpm).toBe(88)
    expect(b.score.tempo).toBe(88)
  })
})

describe('upload accept extensions', () => {
  it('lists common audio extensions including CAF/WMA', () => {
    for (const ext of ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'webm', 'aiff', 'caf', 'wma', 'opus', 'aac']) {
      expect(AUDIO_EXTENSIONS).toContain(ext)
    }
    expect(AUDIO_FORMATS_LABEL).toMatch(/CAF/i)
    expect(AUDIO_FORMATS_LABEL).toMatch(/WMA/i)
  })

  it('UPLOAD_ACCEPT includes audio + structured tab sources', () => {
    for (const token of ['.mp3', '.wav', '.mid', '.musicxml', '.mxl', '.gp5', '.gpx', '.gpif', '.grtab', 'audio/*']) {
      expect(UPLOAD_ACCEPT).toContain(token)
    }
  })

  it('isAudioUpload detects name and mime', () => {
    expect(isAudioUpload('song.mp3')).toBe(true)
    expect(isAudioUpload('clip.CAF')).toBe(true)
    expect(isAudioUpload({ name: 'x.bin', type: 'audio/mpeg' })).toBe(true)
    expect(isAudioUpload('tab.mid')).toBe(false)
  })
})
