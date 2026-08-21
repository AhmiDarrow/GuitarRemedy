/** Minimal MusicXML note extractor for song import */

export interface MusicXmlNote {
  pitch: number | null // MIDI, null = rest
  duration: number
  measure: number
  voice: number
  string?: number
  fret?: number
  lyric?: string
}

export interface MusicXmlParseResult {
  title: string
  notes: MusicXmlNote[]
  pitchClasses: number[]
  divisions: number
  keyFifths: number
  mode: string
}

const STEP_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

function textContent(el: Element | null, tag: string): string | null {
  if (!el) return null
  const n = el.getElementsByTagName(tag)[0]
  return n?.textContent?.trim() ?? null
}

export function parseMusicXml(xml: string): MusicXmlParseResult {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.querySelector('parsererror')) {
    throw new Error('Invalid MusicXML')
  }

  const title =
    textContent(doc.documentElement, 'work-title') ||
    textContent(doc.documentElement, 'movement-title') ||
    'Untitled'

  const divisions = parseInt(textContent(doc.documentElement, 'divisions') || '1', 10) || 1
  const fifths = parseInt(textContent(doc.documentElement, 'fifths') || '0', 10) || 0
  const mode = textContent(doc.documentElement, 'mode') || 'major'

  const notes: MusicXmlNote[] = []
  const measures = Array.from(doc.getElementsByTagName('measure'))
  measures.forEach((measure, mi) => {
    const measureNum = parseInt(measure.getAttribute('number') || String(mi + 1), 10)
    const noteEls = Array.from(measure.getElementsByTagName('note'))
    for (const noteEl of noteEls) {
      const isRest = noteEl.getElementsByTagName('rest').length > 0
      const duration = parseInt(textContent(noteEl, 'duration') || '0', 10) || 0
      const voice = parseInt(textContent(noteEl, 'voice') || '1', 10)
      let pitch: number | null = null
      let string: number | undefined
      let fret: number | undefined

      if (!isRest) {
        const pitchEl = noteEl.getElementsByTagName('pitch')[0]
        if (pitchEl) {
          const step = textContent(pitchEl, 'step') || 'C'
          const alter = parseInt(textContent(pitchEl, 'alter') || '0', 10)
          const octave = parseInt(textContent(pitchEl, 'octave') || '4', 10)
          pitch = (octave + 1) * 12 + STEP_PC[step] + alter
        }
        const tech = noteEl.getElementsByTagName('technical')[0]
        if (tech) {
          const s = textContent(tech, 'string')
          const f = textContent(tech, 'fret')
          if (s) string = parseInt(s, 10)
          if (f) fret = parseInt(f, 10)
        }
      }

      notes.push({
        pitch,
        duration,
        measure: measureNum,
        voice,
        string,
        fret,
        lyric: textContent(noteEl, 'text') || undefined,
      })
    }
  })

  const pitchClasses = [
    ...new Set(notes.map((n) => n.pitch).filter((p): p is number => p != null).map((p) => p % 12)),
  ].sort((a, b) => a - b)

  return { title, notes, pitchClasses, divisions, keyFifths: fifths, mode }
}

/** Very small MusicXML builder for tests / demos */
export function buildSimpleMusicXml(opts: {
  title: string
  notes: Array<{ step: string; octave: number; duration: number; alter?: number; string?: number; fret?: number }>
  divisions?: number
}): string {
  const div = opts.divisions ?? 1
  const noteXml = opts.notes
    .map((n) => {
      const alter = n.alter ? `<alter>${n.alter}</alter>` : ''
      const tech =
        n.string != null && n.fret != null
          ? `<technical><string>${n.string}</technical>`.replace(
              '</technical>',
              `<fret>${n.fret}</fret></technical>`,
            )
          : ''
      return `<note><pitch><step>${n.step}</step>${alter}<octave>${n.octave}</octave></pitch><duration>${n.duration}</duration><voice>1</voice>${tech}</note>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work><work-title>${opts.title}</work-title></work>
  <part-list><score-part id="P1"><part-name>Guitar</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes><divisions>${div}</divisions><key><fifths>0</fifths><mode>major</mode></key><time><beats>4</beats><beat-type>4</beat-type></time></attributes>
      ${noteXml}
    </measure>
  </part>
</score-partwise>`
}
