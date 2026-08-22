/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import { buildSimpleMusicXml, parseMusicXml } from './musicxml'
import { breakdownFile } from './breakdown'

describe('musicxml', () => {
  it('parses a simple melody with pitches, frets, and beat onsets', () => {
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
    expect(parsed.notes[0].startBeat).toBeCloseTo(0, 5)
    expect(parsed.notes[1].startBeat).toBeCloseTo(1, 5)
    expect(parsed.notes[2].startBeat).toBeCloseTo(2, 5)
    expect(parsed.notes[3].startBeat).toBeCloseTo(3, 5)
    expect(parsed.notes[0].durationBeats).toBeCloseTo(1, 5)
    expect(parsed.notes[3].durationBeats).toBeCloseTo(2, 5)
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

  it('parses sound/metronome tempo into tempoBpm', () => {
    const xml = buildSimpleMusicXml({
      title: 'Tempo 132',
      tempoBpm: 132,
      notes: [{ step: 'C', octave: 4, duration: 1 }],
    })
    const parsed = parseMusicXml(xml)
    expect(parsed.tempoBpm).toBe(132)
  })

  it('parses time signature into timeSignature', () => {
    const xml = `<?xml version="1.0"?>
<score-partwise>
  <work><work-title>Waltz</work-title></work>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths><mode>major</mode></key>
        <time><beats>3</beats><beat-type>4</beat-type></time>
      </attributes>
      <note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><voice>1</voice></note>
    </measure>
  </part>
</score-partwise>`
    const parsed = parseMusicXml(xml)
    expect(parsed.timeSignature).toEqual({ numerator: 3, denominator: 4 })
  })

  it('maps full circle-of-fifths (C# / Cb major)', async () => {
    const sharp7 = `<?xml version="1.0"?>
<score-partwise>
  <work><work-title>C sharp</work-title></work>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>7</fifths><mode>major</mode></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
      </attributes>
      <note><pitch><step>C</step><alter>1</alter><octave>4</octave></pitch><duration>1</duration><voice>1</voice></note>
    </measure>
  </part>
</score-partwise>`
    const flat7 = sharp7
      .replace('C sharp', 'C flat')
      .replace('<fifths>7</fifths>', '<fifths>-7</fifths>')
      .replace('<alter>1</alter>', '<alter>-1</alter>')
    const enc = (xml: string) => {
      const bytes = new TextEncoder().encode(xml)
      return {
        name: 'k.musicxml',
        arrayBuffer: async () =>
          bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
        text: async () => xml,
      }
    }
    const cs = await breakdownFile(enc(sharp7))
    expect(cs.key.root).toBe('C#')
    const cb = await breakdownFile(enc(flat7))
    expect(cb.key.root).toBe('Cb')
  })

  it('keeps written key when pitch detect disagrees', async () => {
    // Written G major (1 sharp) but notes are mostly C major triad — must keep G.
    const xml = `<?xml version="1.0"?>
<score-partwise>
  <work><work-title>Written G</work-title></work>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>1</fifths><mode>major</mode></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
      </attributes>
      <note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><voice>1</voice></note>
      <note><pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><voice>1</voice></note>
      <note><pitch><step>G</step><octave>4</octave></pitch><duration>1</duration><voice>1</voice></note>
      <note><pitch><step>C</step><octave>5</octave></pitch><duration>1</duration><voice>1</voice></note>
    </measure>
  </part>
</score-partwise>`
    const bytes = new TextEncoder().encode(xml)
    const result = await breakdownFile({
      name: 'written-g.musicxml',
      arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      text: async () => xml,
    })
    expect(result.key.root).toBe('G')
    expect(result.timeSig).toEqual([4, 4])
    expect(result.warnings.some((w) => /written key/i.test(w))).toBe(true)
  })

  it('breakdownFile uses MusicXML tempo', async () => {
    const xml = buildSimpleMusicXml({
      title: 'Fast',
      tempoBpm: 144,
      notes: [
        { step: 'C', octave: 4, duration: 1 },
        { step: 'E', octave: 4, duration: 1 },
      ],
    })
    const bytes = new TextEncoder().encode(xml)
    const result = await breakdownFile({
      name: 'fast.musicxml',
      arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      text: async () => xml,
    })
    expect(result.tempoBpm).toBe(144)
    expect(result.score.tempo).toBe(144)
  })

  it('chord tones share onset and multi-voice keeps parallel timelines', async () => {
    const xml = buildSimpleMusicXml({
      title: 'Chord + voice',
      tempoBpm: 100,
      notes: [
        { step: 'E', octave: 2, duration: 1, string: 6, fret: 0, voice: 1 },
        { step: 'B', octave: 3, duration: 1, string: 2, fret: 0, voice: 1, chord: true },
        { step: 'E', octave: 4, duration: 1, string: 1, fret: 0, voice: 2 },
      ],
    })
    const bytes = new TextEncoder().encode(xml)
    const result = await breakdownFile({
      name: 'chord.musicxml',
      arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      text: async () => xml,
    })
    expect(result.tab.length).toBe(3)
    // First two are a chord at beat 0; voice 2 also starts at 0
    const onsets = result.tab.map((t) => t.startBeat).sort((a, b) => a - b)
    expect(onsets[0]).toBeCloseTo(0, 5)
    expect(onsets[1]).toBeCloseTo(0, 5)
    expect(onsets[2]).toBeCloseTo(0, 5)
  })

  it('MusicXML string 1 (high e) maps to theory high-e and display 0', async () => {
    const { musicXmlStringToTheory, musicXmlStringToDisplay, theoryStringToDisplay } =
      await import('./breakdown')
    // MusicXML 1 = high e → theory 5 (high e) → display 0
    expect(musicXmlStringToTheory(1)).toBe(5)
    expect(musicXmlStringToDisplay(1)).toBe(0)
    // MusicXML 6 = low E → theory 0 → display 5
    expect(musicXmlStringToTheory(6)).toBe(0)
    expect(musicXmlStringToDisplay(6)).toBe(5)
    expect(theoryStringToDisplay(musicXmlStringToTheory(1))).toBe(0)

    const xml = buildSimpleMusicXml({
      title: 'Open high e',
      notes: [{ step: 'E', octave: 4, duration: 1, string: 1, fret: 0 }],
    })
    const bytes = new TextEncoder().encode(xml)
    const result = await breakdownFile({
      name: 'open-e.musicxml',
      arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      text: async () => xml,
    })
    // TabEvent theory: high e = 5; score/display: high e = 0
    expect(result.tab[0].string).toBe(5)
    expect(result.tab[0].fret).toBe(0)
    expect(result.score.notes[0].string).toBe(0)
    expect(result.score.notes[0].midi).toBe(64)
  })
})
