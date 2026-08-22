import { describe, expect, it } from 'vitest'
import { buildSimpleMidi, parseMidi, ticksToBeatsWarped, ticksToSeconds } from './midi'

/** Build a Type-0 MIDI with an explicit tempo map (us/qn meta 0x51). */
function buildMidiWithTempos(
  notes: Array<{ pitch: number; start: number; duration: number }>,
  tempos: Array<{ tick: number; bpm: number }>,
  tpq = 480,
): ArrayBuffer {
  type Ev = { tick: number; bytes: number[] }
  const evs: Ev[] = []
  const writeVar = (n: number): number[] => {
    const out: number[] = []
    let v = Math.max(0, n)
    out.unshift(v & 0x7f)
    v >>= 7
    while (v > 0) {
      out.unshift((v & 0x7f) | 0x80)
      v >>= 7
    }
    return out.length ? out : [0]
  }
  for (const t of tempos) {
    const us = Math.round(60_000_000 / t.bpm)
    evs.push({
      tick: t.tick,
      bytes: [0xff, 0x51, 0x03, (us >> 16) & 0xff, (us >> 8) & 0xff, us & 0xff],
    })
  }
  for (const n of notes) {
    evs.push({ tick: n.start, bytes: [0x90, n.pitch, 80] })
    evs.push({ tick: n.start + n.duration, bytes: [0x80, n.pitch, 0] })
  }
  evs.sort((a, b) => a.tick - b.tick)
  const events: number[] = []
  let last = 0
  for (const e of evs) {
    events.push(...writeVar(e.tick - last))
    last = e.tick
    events.push(...e.bytes)
  }
  events.push(0x00, 0xff, 0x2f, 0x00)
  const trackLen = events.length
  const buf = new ArrayBuffer(14 + 8 + trackLen)
  const view = new DataView(buf)
  const u8 = new Uint8Array(buf)
  u8.set([0x4d, 0x54, 0x68, 0x64], 0)
  view.setUint32(4, 6)
  view.setUint16(8, 0)
  view.setUint16(10, 1)
  view.setUint16(12, tpq)
  u8.set([0x4d, 0x54, 0x72, 0x6b], 14)
  view.setUint32(18, trackLen)
  u8.set(events, 22)
  return buf
}

describe('midi', () => {
  it('round-trips a simple melody', () => {
    // start/duration are in **ticks** (ppq=480 → 480 = one quarter)
    const bytes = buildSimpleMidi(
      [
        { pitch: 60, start: 0, duration: 480 },
        { pitch: 64, start: 480, duration: 480 },
        { pitch: 67, start: 960, duration: 960 },
      ],
      { tempoBpm: 100, ticksPerQuarter: 480 },
    )
    const parsed = parseMidi(bytes)
    expect(parsed.notes.length).toBeGreaterThanOrEqual(3)
    expect(parsed.notes[0].pitch).toBe(60)
    expect(parsed.notes[0].durationTicks).toBe(480)
    expect(parsed.ticksPerQuarter).toBe(480)
    expect(parsed.tempoBpm).toBe(100)
    expect(parsed.tempoMap.length).toBeGreaterThanOrEqual(1)
    expect(parsed.tempoMap[0].tick).toBe(0)
  })

  it('handles empty note list', () => {
    const bytes = buildSimpleMidi([])
    const parsed = parseMidi(bytes)
    expect(parsed.notes).toEqual([])
  })

  it('embeds tempo so re-import is not stuck at default 120', () => {
    const bytes = buildSimpleMidi(
      [
        { pitch: 60, start: 0, duration: 480 },
        { pitch: 64, start: 480, duration: 480 },
      ],
      { tempoBpm: 92, ticksPerQuarter: 480 },
    )
    const parsed = parseMidi(bytes)
    expect(parsed.tempoBpm).toBe(92)
    expect(parsed.tempoMap[0]?.bpm).toBe(92)
    expect(parsed.notes).toHaveLength(2)
  })

  it('embeds time signature when provided', () => {
    const bytes = buildSimpleMidi([{ pitch: 60, start: 0, duration: 480 }], {
      tempoBpm: 100,
      timeSig: [3, 4],
    })
    const parsed = parseMidi(bytes)
    expect(parsed.timeSignature.numerator).toBe(3)
    expect(parsed.timeSignature.denominator).toBe(4)
  })

  it('captures multi-tempo map and flags changes', () => {
    const bytes = buildMidiWithTempos(
      [
        { pitch: 60, start: 0, duration: 480 },
        { pitch: 64, start: 480, duration: 480 },
      ],
      [
        { tick: 0, bpm: 100 },
        { tick: 480, bpm: 140 },
      ],
    )
    const parsed = parseMidi(bytes)
    expect(parsed.tempoBpm).toBe(100)
    expect(parsed.hasTempoChanges).toBe(true)
    expect(parsed.tempoMap.some((e) => e.bpm === 140)).toBe(true)
  })

  it('ticksToSeconds respects tempo map segments', () => {
    const map = [
      { tick: 0, bpm: 60 }, // 1 beat/sec
      { tick: 480, bpm: 120 }, // 2 beats/sec after 1 quarter at 480 tpq
    ]
    // 480 ticks at 60 BPM = 1 second
    expect(ticksToSeconds(480, 480, map)).toBeCloseTo(1, 5)
    // +480 ticks at 120 BPM = +0.5s → 1.5s total
    expect(ticksToSeconds(960, 480, map)).toBeCloseTo(1.5, 5)
  })

  it('ticksToBeatsWarped preserves wall-clock at reference BPM', () => {
    const map = [
      { tick: 0, bpm: 60 },
      { tick: 480, bpm: 120 },
    ]
    // 1.5s wall → at ref 60 BPM = 1.5 beats
    expect(ticksToBeatsWarped(960, 480, map, 60)).toBeCloseTo(1.5, 5)
    // at ref 120 BPM = 3 beats
    expect(ticksToBeatsWarped(960, 480, map, 120)).toBeCloseTo(3, 5)
  })
})
