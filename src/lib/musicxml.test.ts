/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import { buildSimpleMusicXml, parseMusicXml } from './musicxml'
import { breakdownFile } from './breakdown'

describe('musicxml', () => {
  it('parses a simple melody with pitches and frets', () => {
    const xml = buildSimpleMusicXml({
      title: 'Open E sketch',
      notes: [
        { step: 'E', octave: 4, duration: 1, string: 1, fret: 0 },
        { step: 'G', octave: 4, duration: 1, string: 2, fret: 0 },
        { step: 'B', octave: 4, duration: 1, string: 3, fret: 0 },
        { step: 'E', octave: 5, duration: 2, string: 1, fret: 12 },
      ],
    })
    const parsed = parseMusicXml(xml)
    expect(parsed.title).toBe('Open E sketch')
    expect(parsed.notes.length).toBe(4)
    expect(parsed.notes[0].pitch).toBe(64) // E4
    expect(parsed.notes[0].string).toBe(1)
    expect(parsed.notes[0].fret).toBe(0)
    expect(parsed.pitchClasses.length).toBeGreaterThan(0)
  })

  it('rejects invalid XML', () => {
    expect(() => parseMusicXml('<not-musicxml')).toThrow(/Invalid MusicXML/i)
  })

  it('breakdownFile maps MusicXML into tabs', async () => {
    const xml = buildSimpleMusicXml({
      title: 'C walk',
      notes: [
        { step: 'C', octave: 4, duration: 1 },
        { step: 'E', octave: 4, duration: 1 },
        { step: 'G', octave: 4, duration: 1 },
        { step: 'C', octave: 5, duration: 2 },
      ],
    })
    const bytes = new TextEncoder().encode(xml)
    const result = await breakdownFile({
      name: 'c-walk.musicxml',
      arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      text: async () => xml,
    })
    expect(result.kind).toBe('musicxml')
    expect(result.tab.length).toBeGreaterThanOrEqual(4)
    expect(result.tabNotes.length).toBe(result.tab.length)
    expect(result.editable).toBe(true)
    expect(result.confidence).toBeGreaterThan(0.5)
  })
})
