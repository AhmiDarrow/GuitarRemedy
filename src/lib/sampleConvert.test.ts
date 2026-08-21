/**
 * Real-file conversion smoke: public/samples/*.wav → PCM → MIDI → guitar tabs.
 * (Browser Web Audio decodes MP3/M4A the same way after decodeAudioData.)
 * Full-band user mixes stay local/gitignored — not required for CI.
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { pcmToMidi } from './audioToMidi'
import { audioMidiToBreakdown, tabToAscii } from './breakdown'
import { breakdownToUserTab, userTabToExportPayload } from './userTabs'

const samplesDir = join(process.cwd(), 'public', 'samples')
const outDir = join(process.cwd(), '.remedy-build', 'tmp', 'convert-out')

/** Minimal PCM WAV reader (mono/stereo 16-bit or 32-bit float). */
function readWavPcm(path: string): { samples: Float32Array; sampleRate: number } {
  const buf = readFileSync(path)
  const u8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength)
  if (String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== 'RIFF') {
    throw new Error(`Not RIFF: ${path}`)
  }
  let offset = 12
  let sampleRate = 44100
  let channels = 1
  let bits = 16
  let audioFormat = 1
  let dataOffset = -1
  let dataSize = 0
  while (offset + 8 <= u8.length) {
    const id = String.fromCharCode(u8[offset], u8[offset + 1], u8[offset + 2], u8[offset + 3])
    const size = view.getUint32(offset + 4, true)
    const body = offset + 8
    if (id === 'fmt ') {
      audioFormat = view.getUint16(body, true)
      channels = view.getUint16(body + 2, true)
      sampleRate = view.getUint32(body + 4, true)
      bits = view.getUint16(body + 14, true)
    } else if (id === 'data') {
      dataOffset = body
      dataSize = size
      break
    }
    offset = body + size + (size % 2)
  }
  if (dataOffset < 0) throw new Error(`No data chunk: ${path}`)

  const frameCount = Math.floor(dataSize / ((bits / 8) * channels))
  const mono = new Float32Array(frameCount)

  if (audioFormat === 3 && bits === 32) {
    for (let i = 0; i < frameCount; i++) {
      let sum = 0
      for (let c = 0; c < channels; c++) {
        sum += view.getFloat32(dataOffset + (i * channels + c) * 4, true)
      }
      mono[i] = sum / channels
    }
  } else if (bits === 16) {
    for (let i = 0; i < frameCount; i++) {
      let sum = 0
      for (let c = 0; c < channels; c++) {
        sum += view.getInt16(dataOffset + (i * channels + c) * 2, true) / 32768
      }
      mono[i] = sum / channels
    }
  } else {
    throw new Error(`Unsupported WAV format ${audioFormat}/${bits}`)
  }
  return { samples: mono, sampleRate }
}

const required = ['a4_tone.wav', 'c_major_scale.wav', 'ode_to_joy_melody.wav', 'twinkle_melody.wav']

describe('sample WAV → MIDI → guitar tabs', () => {
  it('has free sample files on disk', () => {
    expect(existsSync(samplesDir)).toBe(true)
    const names = readdirSync(samplesDir)
    for (const f of required) {
      expect(names).toContain(f)
    }
  })

  it.each(required)('converts %s to MIDI bytes + tab events', (file) => {
    mkdirSync(outDir, { recursive: true })
    const path = join(samplesDir, file)
    const { samples, sampleRate } = readWavPcm(path)
    expect(samples.length).toBeGreaterThan(1000)

    const converted = pcmToMidi(samples, sampleRate, { tempoBpm: 100, title: file })
    expect(converted.midiBytes.byteLength).toBeGreaterThan(20)
    const head = new Uint8Array(converted.midiBytes.slice(0, 4))
    expect(String.fromCharCode(...head)).toBe('MThd')
    expect(converted.notes.length).toBeGreaterThan(0)

    const breakdown = audioMidiToBreakdown(converted, file)
    expect(breakdown.kind).toBe('audio')
    expect(breakdown.tab.length).toBeGreaterThan(0)
    expect(breakdown.tabNotes.length).toBe(breakdown.tab.length)
    expect(breakdown.midiBytes?.byteLength).toBeGreaterThan(20)
    expect(breakdown.editable).toBe(true)

    const stem = file.replace(/\.wav$/i, '')
    writeFileSync(join(outDir, `${stem}.mid`), Buffer.from(converted.midiBytes))
    writeFileSync(join(outDir, `${stem}.txt`), tabToAscii(breakdown.tab, 16))
    writeFileSync(
      join(outDir, `${stem}.grtab.json`),
      JSON.stringify(
        {
          title: breakdown.title,
          tempoBpm: breakdown.tempoBpm,
          key: breakdown.keyLabel,
          tab: breakdown.tab,
          notes: breakdown.tabNotes,
        },
        null,
        2,
      ),
    )
  })

  it('A4 tone maps near MIDI 69', () => {
    const { samples, sampleRate } = readWavPcm(join(samplesDir, 'a4_tone.wav'))
    const converted = pcmToMidi(samples, sampleRate, { tempoBpm: 100 })
    expect(converted.notes.length).toBeGreaterThan(0)
    const avg =
      converted.notes.reduce((s, n) => s + n.pitch, 0) / Math.max(1, converted.notes.length)
    expect(Math.abs(avg - 69)).toBeLessThanOrEqual(1)
  })

  it('C major scale yields multiple ascending pitches', () => {
    const { samples, sampleRate } = readWavPcm(join(samplesDir, 'c_major_scale.wav'))
    const converted = pcmToMidi(samples, sampleRate, { tempoBpm: 90 })
    expect(converted.notes.length).toBeGreaterThanOrEqual(5)
    const pitches = converted.notes.map((n) => n.pitch)
    // Should span more than a third
    expect(Math.max(...pitches) - Math.min(...pitches)).toBeGreaterThanOrEqual(5)
  })
})
