/** Lightweight SMF (Standard MIDI File) parser for song import */

export interface MidiNote {
  pitch: number
  startTick: number
  durationTicks: number
  velocity: number
  channel: number
  track: number
}

export interface MidiParseResult {
  format: number
  ticksPerQuarter: number
  trackCount: number
  notes: MidiNote[]
  tempoBpm: number
  timeSignature: { numerator: number; denominator: number }
  pitchClasses: number[]
}

function readU32(view: DataView, o: number) {
  return view.getUint32(o)
}
function readU16(view: DataView, o: number) {
  return view.getUint16(o)
}

function readVarLen(bytes: Uint8Array, offset: { i: number }): number {
  let value = 0
  while (offset.i < bytes.length) {
    const b = bytes[offset.i++]
    value = (value << 7) | (b & 0x7f)
    if ((b & 0x80) === 0) break
  }
  return value
}

export function parseMidi(buffer: ArrayBuffer): MidiParseResult {
  const bytes = new Uint8Array(buffer)
  const view = new DataView(buffer)
  if (bytes.length < 14 || String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) !== 'MThd') {
    throw new Error('Not a MIDI file (missing MThd)')
  }
  const headerLength = readU32(view, 4)
  const format = readU16(view, 8)
  const trackCount = readU16(view, 10)
  const division = readU16(view, 12)
  const ticksPerQuarter = division & 0x8000 ? 480 : division

  let o = 8 + headerLength
  const notes: MidiNote[] = []
  let tempoBpm = 120
  let timeSignature = { numerator: 4, denominator: 4 }

  for (let t = 0; t < trackCount && o + 8 <= bytes.length; t++) {
    const id = String.fromCharCode(bytes[o], bytes[o + 1], bytes[o + 2], bytes[o + 3])
    const length = readU32(view, o + 4)
    o += 8
    if (id !== 'MTrk') {
      o += length
      continue
    }
    const trackEnd = o + length
    const trackBytes = bytes.subarray(0, trackEnd)
    const cur = { i: o }
    let tick = 0
    let running = 0
    const active = new Map<string, { start: number; velocity: number; channel: number }>()

    while (cur.i < trackEnd) {
      tick += readVarLen(trackBytes, cur)
      if (cur.i >= trackEnd) break
      let status = trackBytes[cur.i]
      if (status < 0x80) {
        status = running
      } else {
        cur.i++
        running = status
      }

      const type = status & 0xf0
      const channel = status & 0x0f

      if (status === 0xff) {
        const meta = trackBytes[cur.i++]
        const len = readVarLen(trackBytes, cur)
        if (meta === 0x51 && len === 3) {
          const us =
            (trackBytes[cur.i] << 16) | (trackBytes[cur.i + 1] << 8) | trackBytes[cur.i + 2]
          tempoBpm = Math.round(60_000_000 / us)
        } else if (meta === 0x58 && len >= 2) {
          timeSignature = {
            numerator: trackBytes[cur.i],
            denominator: 2 ** trackBytes[cur.i + 1],
          }
        }
        cur.i += len
      } else if (status === 0xf0 || status === 0xf7) {
        const len = readVarLen(trackBytes, cur)
        cur.i += len
      } else if (type === 0x90 || type === 0x80) {
        const pitch = trackBytes[cur.i++]
        const vel = trackBytes[cur.i++]
        const key = `${channel}:${pitch}`
        if (type === 0x90 && vel > 0) {
          active.set(key, { start: tick, velocity: vel, channel })
        } else {
          const on = active.get(key)
          if (on) {
            notes.push({
              pitch,
              startTick: on.start,
              durationTicks: Math.max(1, tick - on.start),
              velocity: on.velocity,
              channel: on.channel,
              track: t,
            })
            active.delete(key)
          }
        }
      } else if (type === 0xa0 || type === 0xb0 || type === 0xe0) {
        cur.i += 2
      } else if (type === 0xc0 || type === 0xd0) {
        cur.i += 1
      } else {
        break
      }
    }

    // flush hanging notes
    for (const [key, on] of active) {
      const pitch = parseInt(key.split(':')[1], 10)
      notes.push({
        pitch,
        startTick: on.start,
        durationTicks: ticksPerQuarter,
        velocity: on.velocity,
        channel: on.channel,
        track: t,
      })
    }
    o = trackEnd
  }

  notes.sort((a, b) => a.startTick - b.startTick || a.pitch - b.pitch)
  const pitchClasses = [...new Set(notes.map((n) => n.pitch % 12))].sort((a, b) => a - b)

  return {
    format,
    ticksPerQuarter,
    trackCount,
    notes,
    tempoBpm,
    timeSignature,
    pitchClasses,
  }
}

/** Build a minimal Type-0 MIDI file from note events (for tests / export demos) */
export function buildSimpleMidi(
  notes: Array<{ pitch: number; start: number; duration: number; velocity?: number }>,
  ticksPerQuarter = 480,
): ArrayBuffer {
  const events: number[] = []
  const sorted = [...notes].sort((a, b) => a.start - b.start)
  type Ev = { tick: number; bytes: number[] }
  const evs: Ev[] = []
  for (const n of sorted) {
    evs.push({ tick: n.start, bytes: [0x90, n.pitch, n.velocity ?? 80] })
    evs.push({ tick: n.start + n.duration, bytes: [0x80, n.pitch, 0] })
  }
  evs.sort((a, b) => a.tick - b.tick)
  let last = 0
  for (const e of evs) {
    const delta = e.tick - last
    last = e.tick
    // varlen
    const vl: number[] = []
    let v = delta
    vl.unshift(v & 0x7f)
    v >>= 7
    while (v > 0) {
      vl.unshift((v & 0x7f) | 0x80)
      v >>= 7
    }
    if (delta === 0) events.push(0)
    else events.push(...vl)
    events.push(...e.bytes)
  }
  events.push(0x00, 0xff, 0x2f, 0x00) // end of track

  const trackLen = events.length
  const buf = new ArrayBuffer(14 + 8 + trackLen)
  const view = new DataView(buf)
  const u8 = new Uint8Array(buf)
  // header
  u8.set([0x4d, 0x54, 0x68, 0x64], 0)
  view.setUint32(4, 6)
  view.setUint16(8, 0)
  view.setUint16(10, 1)
  view.setUint16(12, ticksPerQuarter)
  // track
  u8.set([0x4d, 0x54, 0x72, 0x6b], 14)
  view.setUint32(18, trackLen)
  u8.set(events, 22)
  return buf
}
