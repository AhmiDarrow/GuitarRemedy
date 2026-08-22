/** Lightweight SMF (Standard MIDI File) parser for song import */

export interface MidiNote {
  pitch: number
  startTick: number
  durationTicks: number
  velocity: number
  channel: number
  track: number
}

/** Tempo change at an absolute tick (microseconds-per-quarter → BPM). */
export interface MidiTempoEvent {
  tick: number
  bpm: number
}

export interface MidiParseResult {
  format: number
  ticksPerQuarter: number
  trackCount: number
  notes: MidiNote[]
  /** Initial / primary tempo (first map entry, else 120). */
  tempoBpm: number
  /**
   * Full tempo map when the file has mid-song tempo changes.
   * Empty or single-entry files still get one event at tick 0.
   */
  tempoMap: MidiTempoEvent[]
  /** True when more than one distinct tempo appears. */
  hasTempoChanges: boolean
  timeSignature: { numerator: number; denominator: number }
  pitchClasses: number[]
  /** True when division used SMPTE (ticks forced to 480). */
  smpteDivision?: boolean
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
  const smpteDivision = (division & 0x8000) !== 0
  const ticksPerQuarter = smpteDivision ? 480 : division

  let o = 8 + headerLength
  const notes: MidiNote[] = []
  const tempoMap: MidiTempoEvent[] = []
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
          const bpm = Math.max(20, Math.min(400, Math.round(60_000_000 / Math.max(1, us))))
          tempoMap.push({ tick, bpm })
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

  // Normalize tempo map: sort, ensure tick 0, dedupe same-tick (last wins).
  tempoMap.sort((a, b) => a.tick - b.tick)
  const normalized: MidiTempoEvent[] = []
  for (const ev of tempoMap) {
    if (normalized.length && normalized[normalized.length - 1].tick === ev.tick) {
      normalized[normalized.length - 1] = ev
    } else {
      normalized.push(ev)
    }
  }
  if (!normalized.length || normalized[0].tick > 0) {
    normalized.unshift({ tick: 0, bpm: normalized[0]?.bpm ?? 120 })
  }
  const uniqueBpms = new Set(normalized.map((e) => e.bpm))
  const tempoBpm = normalized[0]?.bpm ?? 120

  return {
    format,
    ticksPerQuarter,
    trackCount,
    notes,
    tempoBpm,
    tempoMap: normalized,
    hasTempoChanges: uniqueBpms.size > 1,
    timeSignature,
    pitchClasses,
    smpteDivision: smpteDivision || undefined,
  }
}

/**
 * Wall-clock seconds from tick 0 → `tick` using the tempo map.
 * Between map events, tempo is held constant (SMF default).
 */
export function ticksToSeconds(
  tick: number,
  ticksPerQuarter: number,
  tempoMap: MidiTempoEvent[],
): number {
  const tpq = Math.max(1, ticksPerQuarter || 480)
  const map =
    tempoMap?.length > 0
      ? [...tempoMap].sort((a, b) => a.tick - b.tick)
      : [{ tick: 0, bpm: 120 }]
  if (map[0].tick > 0) map.unshift({ tick: 0, bpm: map[0].bpm })

  const target = Math.max(0, tick)
  let seconds = 0
  let i = 0
  while (i < map.length) {
    const cur = map[i]
    const nextTick = i + 1 < map.length ? map[i + 1].tick : Number.POSITIVE_INFINITY
    const segEnd = Math.min(target, nextTick)
    if (segEnd > cur.tick) {
      const bpm = Math.max(20, Math.min(400, cur.bpm || 120))
      seconds += ((segEnd - cur.tick) / tpq) * (60 / bpm)
    }
    if (target <= nextTick) break
    i += 1
  }
  return seconds
}

/**
 * Convert a tick to **beats at referenceBpm** so single-tempo tab playback
 * preserves wall-clock spacing when the MIDI has mid-song tempo changes.
 * Musical formula: beats_ref = seconds(tick) * (referenceBpm / 60).
 */
export function ticksToBeatsWarped(
  tick: number,
  ticksPerQuarter: number,
  tempoMap: MidiTempoEvent[],
  referenceBpm: number,
): number {
  const seconds = ticksToSeconds(tick, ticksPerQuarter, tempoMap)
  const bpm = Math.max(20, Math.min(400, referenceBpm || 120))
  return seconds * (bpm / 60)
}

function writeVarLen(n: number): number[] {
  const out: number[] = []
  let v = Math.max(0, Math.floor(n))
  out.unshift(v & 0x7f)
  v >>= 7
  while (v > 0) {
    out.unshift((v & 0x7f) | 0x80)
    v >>= 7
  }
  return out.length ? out : [0]
}

export type BuildSimpleMidiOpts = {
  /** PPQ / ticks per quarter (default 480). */
  ticksPerQuarter?: number
  /**
   * Tempo written as SMF meta 0x51 at tick 0.
   * Without this, many players (and our parser default) assume 120 BPM —
   * so exported convert MIDI would re-import at the wrong speed.
   */
  tempoBpm?: number
  /** Optional time signature meta 0x58 at tick 0. */
  timeSig?: [number, number]
}

/**
 * Build a minimal Type-0 MIDI file from note events.
 * `start` / `duration` are in **ticks** (not beats).
 */
export function buildSimpleMidi(
  notes: Array<{ pitch: number; start: number; duration: number; velocity?: number }>,
  ticksPerQuarterOrOpts: number | BuildSimpleMidiOpts = 480,
): ArrayBuffer {
  const opts: BuildSimpleMidiOpts =
    typeof ticksPerQuarterOrOpts === 'number'
      ? { ticksPerQuarter: ticksPerQuarterOrOpts }
      : ticksPerQuarterOrOpts ?? {}
  const ticksPerQuarter = Math.max(1, Math.round(opts.ticksPerQuarter ?? 480))
  const tempoBpm =
    opts.tempoBpm != null && Number.isFinite(opts.tempoBpm)
      ? Math.max(20, Math.min(400, Math.round(opts.tempoBpm)))
      : undefined
  const timeSig = opts.timeSig

  type Ev = { tick: number; bytes: number[] }
  const evs: Ev[] = []

  if (tempoBpm != null) {
    const us = Math.max(1, Math.round(60_000_000 / tempoBpm))
    evs.push({
      tick: 0,
      bytes: [0xff, 0x51, 0x03, (us >> 16) & 0xff, (us >> 8) & 0xff, us & 0xff],
    })
  }
  if (timeSig && timeSig.length === 2) {
    const num = Math.max(1, Math.min(32, Math.round(timeSig[0]) || 4))
    const den = Math.max(1, Math.min(32, Math.round(timeSig[1]) || 4))
    // SMF stores denominator as power-of-two exponent (1→0, 2→1, 4→2, 8→3, 16→4).
    const denExp =
      den === 1 ? 0 : den === 2 ? 1 : den === 4 ? 2 : den === 8 ? 3 : den === 16 ? 4 : 2
    evs.push({
      tick: 0,
      bytes: [0xff, 0x58, 0x04, num, denExp, 24, 8],
    })
  }

  const sorted = [...notes].sort((a, b) => a.start - b.start)
  for (const n of sorted) {
    const start = Math.max(0, Math.round(n.start))
    const dur = Math.max(1, Math.round(n.duration))
    const pitch = Math.max(0, Math.min(127, Math.round(n.pitch)))
    const vel = Math.max(1, Math.min(127, Math.round(n.velocity ?? 80)))
    evs.push({ tick: start, bytes: [0x90, pitch, vel] })
    evs.push({ tick: start + dur, bytes: [0x80, pitch, 0] })
  }
  evs.sort((a, b) => a.tick - b.tick || a.bytes[0] - b.bytes[0])

  const events: number[] = []
  let last = 0
  for (const e of evs) {
    events.push(...writeVarLen(e.tick - last))
    last = e.tick
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
  view.setUint16(8, 0) // format 0
  view.setUint16(10, 1) // one track
  view.setUint16(12, ticksPerQuarter)
  // track
  u8.set([0x4d, 0x54, 0x72, 0x6b], 14)
  view.setUint32(18, trackLen)
  u8.set(events, 22)
  return buf
}
