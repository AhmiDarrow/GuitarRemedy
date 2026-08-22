import { describe, expect, it, beforeEach } from 'vitest'
import {
  getGuitarProOpenTuning,
  parseGpif,
  parseGuitarPro,
  setGuitarProOpenTuning,
} from './guitarpro'
import { guitarProToBreakdown } from './breakdown'
import { TUNINGS } from './theory'
import { openMidiHighToLow } from './tabScore'

describe('guitarpro', () => {
  beforeEach(() => {
    setGuitarProOpenTuning(null)
  })

  it('returns a stub result for empty buffer without throwing', async () => {
    const result = await parseGuitarPro(new ArrayBuffer(0), 'empty.gp')
    expect(result).toBeTruthy()
    expect(typeof result.title).toBe('string')
    expect(Array.isArray(result.notes)).toBe(true)
    expect(Array.isArray(result.warnings)).toBe(true)
    expect(result.warnings.length + result.notes.length).toBeGreaterThan(0)
  })

  it('accepts a tiny fake GP header without throwing', async () => {
    const bytes = new Uint8Array(64)
    bytes.set(new TextEncoder().encode('FICHIER GUITAR PRO'))
    const result = await parseGuitarPro(bytes.buffer, 'demo.gp5')
    expect(typeof result.title).toBe('string')
    expect(result.source === 'binary-header' || result.source === 'stub' || result.notes).toBeTruthy()
  })

  it('GPIF parses time signature 3/4 and breakdown preserves it', () => {
    const xml = `<?xml version="1.0"?>
      <GPIF>
        <title>Waltz</title>
        <tempo>90</tempo>
        <time>3/4</time>
        <note><string>1</string><fret>0</fret><duration>1</duration></note>
      </GPIF>`
    const parsed = parseGpif(xml)
    expect(parsed.timeSignature).toEqual({ numerator: 3, denominator: 4 })
    expect(parsed.tempoBpm).toBe(90)
    const b = guitarProToBreakdown(parsed, 'waltz.gpif')
    expect(b.timeSig).toEqual([3, 4])
    expect(b.warnings.some((w) => w.includes('3/4'))).toBe(true)
  })

  it('GPIF string+fret uses session Drop D opens (low open = 38)', () => {
    setGuitarProOpenTuning(TUNINGS.drop_d.midi)
    const opens = getGuitarProOpenTuning()
    expect(opens[5]).toBe(38) // display low E
    expect(opens[0]).toBe(64) // high e

    // Minimal GPIF: string 6 (low E) fret 0 → Drop D open
    const xml = `<?xml version="1.0"?>
      <GPIF>
        <title>Drop D open</title>
        <tempo>100</tempo>
        <note><string>6</string><fret>0</fret><duration>1</duration></note>
        <note><string>1</string><fret>0</fret><duration>1</duration></note>
      </GPIF>`
    const parsed = parseGpif(xml)
    expect(parsed.notes.length).toBeGreaterThanOrEqual(2)
    const low = parsed.notes.find((n) => n.string === 6)
    const high = parsed.notes.find((n) => n.string === 1)
    expect(low?.midi).toBe(38)
    expect(high?.midi).toBe(64)
    // reset
    setGuitarProOpenTuning(null)
    expect(getGuitarProOpenTuning()).toEqual(openMidiHighToLow(TUNINGS.standard.midi))
  })
})
