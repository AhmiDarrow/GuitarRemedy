/**
/**
 * Best-effort Guitar Pro import (GPIF/zip + binary header detect).
 * GPIF / zip packages when possible; binary GP3-5 header detect + honest MIDI/MusicXML fallback.
 */

import { parseMusicXml, type MusicXmlParseResult } from './musicxml'
import { STANDARD_TUNING } from './theory'
import { openMidiHighToLow } from './tabScore'

export type GuitarProSource =
  | 'gpif'
  | 'gpif-zip'
  | 'musicxml-zip'
  | 'binary-header'
  | 'stub'

export interface GuitarProNote {
  midi: number
  startBeat: number
  durationBeats: number
  string?: number
  fret?: number
}

export interface GuitarProParseResult {
  title: string
  tempoBpm: number
  /** When known from GPIF / embedded MusicXML (numerator, denominator). */
  timeSignature?: { numerator: number; denominator: number }
  notes: GuitarProNote[]
  source: GuitarProSource
  versionHint?: string
  warnings: string[]
  musicXml?: MusicXmlParseResult
}

export const GP_EXPORT_HINT =
  'For accurate tabs, open the file in Guitar Pro / TuxGuitar and export MIDI or MusicXML, then re-upload here.'

/** Display-order opens (0 = high e … 5 = low E). Override with session/Profile tuning. */
const STANDARD_OPEN_HIGH_TO_LOW = openMidiHighToLow([...STANDARD_TUNING])

/** Active opens for GPIF string+fret → MIDI (display index 0 = high e). */
let gpOpenMidiHighToLow: number[] = [...STANDARD_OPEN_HIGH_TO_LOW]

/**
 * Set open-string MIDI used when GPIF only has string+fret (no concert pitch).
 * `tuning` is theory order (0 = low E … 5 = high e), matching getTuning() / session.
 */
export function setGuitarProOpenTuning(tuning?: number[] | null): void {
  if (Array.isArray(tuning) && tuning.length === 6) {
    gpOpenMidiHighToLow = openMidiHighToLow(tuning)
  } else {
    gpOpenMidiHighToLow = [...STANDARD_OPEN_HIGH_TO_LOW]
  }
}

export function getGuitarProOpenTuning(): number[] {
  return [...gpOpenMidiHighToLow]
}

const STEP_PC: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
}

function decodeText(bytes: Uint8Array): string {
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  } catch {
    let s = ''
    const n = Math.min(bytes.length, 2_000_000)
    for (let i = 0; i < n; i++) s += String.fromCharCode(bytes[i])
    return s
  }
}

function asciiAt(bytes: Uint8Array, start: number, len: number): string {
  let s = ''
  for (let i = 0; i < len && start + i < bytes.length; i++) {
    const c = bytes[start + i]
    if (c === 0) break
    s += c >= 32 && c < 127 ? String.fromCharCode(c) : '.'
  }
  return s
}

function isZip(bytes: Uint8Array): boolean {
  return bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b
}

function looksLikeXml(text: string): boolean {
  const t = text.trimStart()
  return t.startsWith('<?xml') || t.startsWith('<')
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array | null> {
  const DS = (globalThis as unknown as { DecompressionStream?: typeof DecompressionStream })
    .DecompressionStream
  if (!DS) return null
  try {
    const stream = new Blob([data]).stream().pipeThrough(new DS('deflate-raw'))
    const ab = await new Response(stream).arrayBuffer()
    return new Uint8Array(ab)
  } catch {
    return null
  }
}

async function extractZipEntries(buffer: ArrayBuffer): Promise<Map<string, Uint8Array>> {
  const bytes = new Uint8Array(buffer)
  const out = new Map<string, Uint8Array>()
  let o = 0
  while (o + 30 <= bytes.length) {
    if (bytes[o] !== 0x50 || bytes[o + 1] !== 0x4b || bytes[o + 2] !== 0x03 || bytes[o + 3] !== 0x04) {
      break
    }
    const view = new DataView(buffer, o)
    const compression = view.getUint16(8, true)
    const compSize = view.getUint32(18, true)
    const nameLen = view.getUint16(26, true)
    const extraLen = view.getUint16(28, true)
    const nameStart = o + 30
    const rawName = decodeText(bytes.subarray(nameStart, nameStart + nameLen))
    const name = rawName.split('\\').join('/')
    const dataStart = nameStart + nameLen + extraLen
    if (dataStart + compSize > bytes.length) break
    const comp = bytes.subarray(dataStart, dataStart + compSize)
    if (compression === 0) out.set(name, comp.slice())
    else if (compression === 8) {
      const inflated = await inflateRaw(comp)
      if (inflated) out.set(name, inflated)
    }
    o = dataStart + compSize
  }
  return out
}

function tagText(xml: string, tag: string): string | null {
  const open = '<' + tag
  const close = '</' + tag + '>'
  let i = 0
  while (i < xml.length) {
    const a = xml.indexOf(open, i)
    if (a < 0) return null
    const gt = xml.indexOf('>', a)
    if (gt < 0) return null
    if (xml[gt - 1] === '/') {
      i = gt + 1
      continue
    }
    const b = xml.indexOf(close, gt + 1)
    if (b < 0) return null
    return xml.slice(gt + 1, b).trim()
  }
  return null
}

function attrOf(openTag: string, name: string): string | null {
  const key = name + '="'
  const i = openTag.indexOf(key)
  if (i < 0) return null
  const start = i + key.length
  const end = openTag.indexOf('"', start)
  if (end < 0) return null
  return openTag.slice(start, end)
}

function eachBlock(xml: string, tag: string, fn: (inner: string, full: string) => void): void {
  const open = '<' + tag
  const close = '</' + tag + '>'
  let i = 0
  while (i < xml.length) {
    const a = xml.toLowerCase().indexOf(open.toLowerCase(), i)
    if (a < 0) break
    const gt = xml.indexOf('>', a)
    if (gt < 0) break
    if (xml[gt - 1] === '/') {
      i = gt + 1
      continue
    }
    const b = xml.toLowerCase().indexOf(close.toLowerCase(), gt + 1)
    if (b < 0) break
    const full = xml.slice(a, b + close.length)
    const inner = xml.slice(gt + 1, b)
    fn(inner, full)
    i = b + close.length
  }
}

function readDurationBeats(noteXml: string): number {
  const figKey = 'figure='
  const figIdx = noteXml.toLowerCase().indexOf(figKey)
  if (figIdx >= 0) {
    let start = figIdx + figKey.length
    const q = noteXml[start]
    if (q === '"' || q === "'") {
      start += 1
      const end = noteXml.indexOf(q, start)
      if (end > start) {
        const f = parseInt(noteXml.slice(start, end), 10)
        if (f === 6) return 4
        if (f === 5) return 2
        if (f === 4) return 1
        if (f === 3) return 0.5
        if (f === 2) return 0.25
        if (f === 1) return 0.125
      }
    }
  }
  const d = tagText(noteXml, 'duration')
  if (d) {
    const n = parseFloat(d)
    if (n > 0 && n <= 16) return n >= 8 ? n / 480 : n
  }
  return 1
}

function midiFromPitchInner(inner: string): number | null {
  const step = tagText(inner, 'step')
  const octave = tagText(inner, 'octave')
  if (!step || !octave) return null
  const s = step.trim().toUpperCase()
  const pc = STEP_PC[s]
  if (pc === undefined) return null
  let alter = 0
  const alt = tagText(inner, 'alter')
  if (alt) alter = parseInt(alt, 10) || 0
  const acc = (tagText(inner, 'accidental') || '').toLowerCase()
  if (acc.includes('sharp')) alter = 1
  if (acc.includes('flat')) alter = -1
  const oct = parseInt(octave, 10)
  return (oct + 1) * 12 + pc + alter
}

function midiFromNoteXml(noteXml: string): number | null {
  let found: number | null = null
  eachBlock(noteXml, 'concertPitch', (inner) => {
    if (found == null) found = midiFromPitchInner(inner)
  })
  if (found != null) return found
  eachBlock(noteXml, 'pitch', (inner) => {
    if (found == null) found = midiFromPitchInner(inner)
  })
  if (found != null) return found

  // property name="midi"
  const key = 'name="midi"'
  const pi = noteXml.toLowerCase().indexOf(key)
  if (pi >= 0) {
    const slice = noteXml.slice(pi, pi + 120)
    const fm = slice.match(/>(\d{2,3})</)
    if (fm) {
      const m = parseInt(fm[1], 10)
      if (m >= 12 && m <= 127) return m
    }
  }
  return null
}

function stringFretFromNoteXml(noteXml: string): { string?: number; fret?: number } {
  let str: number | undefined
  let fret: number | undefined
  const s = tagText(noteXml, 'string')
  const f = tagText(noteXml, 'fret')
  if (s) str = parseInt(s, 10)
  if (f) fret = parseInt(f, 10)
  return { string: str, fret }
}

export function parseGpif(xml: string): GuitarProParseResult {
  const warnings: string[] = []
  let title = 'Guitar Pro import'
  let tempoBpm = 120
  let timeSignature: { numerator: number; denominator: number } | undefined
  const notes: GuitarProNote[] = []

  const t1 = tagText(xml, 'title') || tagText(xml, 'WorkName')
  if (t1) title = t1
  else {
    const scoreIdx = xml.toLowerCase().indexOf('<score')
    if (scoreIdx >= 0) {
      const gt = xml.indexOf('>', scoreIdx)
      if (gt > scoreIdx) {
        const open = xml.slice(scoreIdx, gt + 1)
        const at = attrOf(open, 'title')
        if (at) title = at
      }
    }
  }

  const tempo = tagText(xml, 'tempo')
  if (tempo) {
    const n = parseInt(tempo, 10)
    if (n >= 40 && n <= 280) tempoBpm = n
  }

  // GPIF time: <time>4/4</time> or separate numerator/denominator tags
  const timeText = tagText(xml, 'time') || tagText(xml, 'TimeSignature')
  if (timeText) {
    const m = timeText.trim().match(/^(\d+)\s*\/\s*(\d+)/)
    if (m) {
      const num = parseInt(m[1], 10)
      const den = parseInt(m[2], 10)
      if (num >= 1 && num <= 16 && den >= 1 && den <= 16) {
        timeSignature = { numerator: num, denominator: den }
      }
    }
  }
  if (!timeSignature) {
    const numRaw = tagText(xml, 'numerator') || tagText(xml, 'beats')
    const denRaw = tagText(xml, 'denominator') || tagText(xml, 'beat-type') || tagText(xml, 'beatValue')
    if (numRaw && denRaw) {
      const num = parseInt(numRaw, 10)
      const den = parseInt(denRaw, 10)
      if (num >= 1 && num <= 16 && den >= 1 && den <= 16) {
        timeSignature = { numerator: num, denominator: den }
      }
    }
  }

  let beatCursor = 0
  eachBlock(xml, 'note', (inner, full) => {
    if (notes.length >= 2400) return
    const isRest = full.toLowerCase().includes('<rest') && !full.toLowerCase().includes('<fret')
    const dur = readDurationBeats(full)
    if (isRest) {
      beatCursor += dur
      return
    }
    let midi = midiFromNoteXml(full)
    const sf = stringFretFromNoteXml(full)
    if (midi == null && sf.string != null && sf.fret != null) {
      // GP string 1 = high e … 6 = low E → display index 0…5
      const idx = Math.max(1, Math.min(6, sf.string)) - 1
      const open = gpOpenMidiHighToLow[idx] ?? STANDARD_OPEN_HIGH_TO_LOW[idx] ?? 64
      midi = open + Math.max(0, sf.fret)
    }
    if (midi == null || midi < 12 || midi > 127) {
      beatCursor += dur * 0.25
      return
    }
    notes.push({
      midi,
      startBeat: beatCursor,
      durationBeats: Math.max(0.125, dur),
      string: sf.string,
      fret: sf.fret,
    })
    beatCursor += dur
  })

  if (notes.length === 0) {
    warnings.push('GPIF contained no readable pitched notes.')
  } else {
    warnings.push(
      'Parsed ' +
        notes.length +
        ' notes from GPIF (best-effort — complex multi-voice GP may need MIDI/MusicXML export).',
    )
  }

  return { title, tempoBpm, timeSignature, notes, source: 'gpif', warnings }
}

function detectBinaryVersion(bytes: Uint8Array): string | undefined {
  const head = asciiAt(bytes, 0, 64)
  if (/FICHIER GUITARE PRO/i.test(head) || /GUITAR PRO/i.test(head)) return head.trim()
  if (bytes.length > 30) {
    const len = bytes[1]
    if (len > 0 && len < 40) {
      const s = asciiAt(bytes, 2, len)
      if (/guitar|pro|fichier/i.test(s)) return s.trim()
    }
  }
  return undefined
}

function stubResult(fileName: string, extra: Partial<GuitarProParseResult> = {}): GuitarProParseResult {
  const base = fileName.replace(/\.\w+$/, '') || 'GP import'
  return {
    title: base,
    tempoBpm: 100,
    notes: [
      { midi: 64, startBeat: 0, durationBeats: 1 },
      { midi: 67, startBeat: 1, durationBeats: 1 },
      { midi: 69, startBeat: 2, durationBeats: 1 },
      { midi: 71, startBeat: 3, durationBeats: 1 },
      { midi: 72, startBeat: 4, durationBeats: 1 },
      { midi: 71, startBeat: 5, durationBeats: 1 },
      { midi: 69, startBeat: 6, durationBeats: 1 },
      { midi: 67, startBeat: 7, durationBeats: 1 },
    ],
    source: 'stub',
    warnings: [
      'Guitar Pro binary could not be fully decoded in-browser — showing a placeholder melody so the UI still works.',
      GP_EXPORT_HINT,
    ],
    ...extra,
  }
}

export async function parseGuitarPro(
  buffer: ArrayBuffer,
  fileName: string,
): Promise<GuitarProParseResult> {
  const bytes = new Uint8Array(buffer)
  const lower = fileName.toLowerCase()

  if (bytes.length === 0) {
    return stubResult(fileName, {
      warnings: ['Empty Guitar Pro file.', GP_EXPORT_HINT],
    })
  }

  // Raw GPIF / XML
  if (lower.endsWith('.gpif') || lower.endsWith('.xml')) {
    const text = decodeText(bytes)
    if (looksLikeXml(text)) {
      if (text.includes('score-partwise') || text.includes('score-timewise')) {
        try {
          const mx = parseMusicXml(text)
          return {
            title: mx.title || fileName,
            tempoBpm: 120,
            notes: [],
            source: 'musicxml-zip',
            warnings: ['Embedded MusicXML detected.'],
            musicXml: mx,
          }
        } catch {
          /* fall through */
        }
      }
      const parsed = parseGpif(text)
      if (parsed.notes.length) return parsed
    }
  }

  // ZIP packages (.gpx, .gp7, some .gp)
  if (isZip(bytes) || lower.endsWith('.gpx') || lower.endsWith('.gp7')) {
    try {
      const entries = await extractZipEntries(buffer)
      if (entries.size > 0) {
        const names = [...entries.keys()]
        const low = (n: string) => n.toLowerCase()
        const gpifName =
          names.find((n) => low(n).endsWith('score.gpif')) ||
          names.find((n) => low(n).endsWith('.gpif'))
        if (gpifName) {
          const parsed = parseGpif(decodeText(entries.get(gpifName)!))
          parsed.source = 'gpif-zip'
          parsed.versionHint = 'zip:' + gpifName
          if (parsed.notes.length) return parsed
        }
        const xmlName =
          names.find((n) => low(n).endsWith('.musicxml')) ||
          names.find((n) => low(n).endsWith('score.xml'))
        if (xmlName) {
          try {
            const mx = parseMusicXml(decodeText(entries.get(xmlName)!))
            return {
              title: mx.title || fileName,
              tempoBpm: 120,
              notes: [],
              source: 'musicxml-zip',
              versionHint: 'zip:' + xmlName,
              warnings: ['Found MusicXML inside Guitar Pro package.'],
              musicXml: mx,
            }
          } catch {
            /* fall through */
          }
        }
        return stubResult(fileName, {
          source: 'stub',
          versionHint: 'zip-package',
          warnings: [
            'Guitar Pro zip package opened but no score.gpif / MusicXML notes were readable.',
            GP_EXPORT_HINT,
          ],
        })
      }
    } catch {
      /* fall through to binary/stub */
    }
  }

  // Classic binary GP3–5
  const ver = detectBinaryVersion(bytes)
  if (ver || lower.endsWith('.gp3') || lower.endsWith('.gp4') || lower.endsWith('.gp5') || lower.endsWith('.gp')) {
    return stubResult(fileName, {
      source: 'binary-header',
      versionHint: ver || lower.split('.').pop(),
      warnings: [
        ver
          ? 'Detected Guitar Pro binary (' + ver + '). Full binary decode is not in v1.'
          : 'Guitar Pro binary format — full decode not in v1.',
        GP_EXPORT_HINT,
      ],
    })
  }

  // Last chance: treat as GPIF text
  const text = decodeText(bytes)
  if (looksLikeXml(text) && (text.includes('<note') || text.includes('GPIF') || text.includes('gpif'))) {
    const parsed = parseGpif(text)
    if (parsed.notes.length) return parsed
  }

  return stubResult(fileName)
}

export function isGuitarProName(name: string): boolean {
  const lower = (name || '').toLowerCase()
  return (
    lower.endsWith('.gp') ||
    lower.endsWith('.gp3') ||
    lower.endsWith('.gp4') ||
    lower.endsWith('.gp5') ||
    lower.endsWith('.gpx') ||
    lower.endsWith('.gp7') ||
    lower.endsWith('.gpif')
  )
}
