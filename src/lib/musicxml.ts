/** Minimal MusicXML note extractor for song import */

export interface MusicXmlNote {
  pitch: number | null // MIDI, null = rest
  /** Duration in divisions (MusicXML duration units). */
  duration: number
  measure: number
  voice: number
  /** True when <chord/> — shares onset with previous note in the voice. */
  chord?: boolean
  /**
   * Onset in quarter-note beats from the start of the score (voice-local timeline).
   * Computed in the parser so consumers need not rebuild cursors.
   */
  startBeat?: number
  /** Duration in quarter-note beats (duration / divisions). */
  durationBeats?: number
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
  /**
   * BPM from <sound tempo="…"/> or metronome per-minute, when present.
   * Undefined → callers should pick a sensible default (often 100).
   */
  tempoBpm?: number
  /** Time signature from first <time> (beats / beat-type). Default 4/4 when absent. */
  timeSignature?: { numerator: number; denominator: number }
}

const STEP_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

function textContent(el: Element | null, tag: string): string | null {
  if (!el) return null
  const n = el.getElementsByTagName(tag)[0]
  return n?.textContent?.trim() ?? null
}

export function parseMusicXml(xml: string): MusicXmlParseResult {
  // Strip DOCTYPE — external DTDs trip DOMParser/jsdom even when the body is fine.
  const cleaned = xml.replace(/<!DOCTYPE[\s\S]*?>/i, '')
  const doc = new DOMParser().parseFromString(cleaned, 'application/xml')
  const err = doc.querySelector('parsererror')
  if (err) {
    throw new Error('Invalid MusicXML')
  }

  const title =
    textContent(doc.documentElement, 'work-title') ||
    textContent(doc.documentElement, 'movement-title') ||
    'Untitled'

  const divisions = parseInt(textContent(doc.documentElement, 'divisions') || '1', 10) || 1
  const fifths = parseInt(textContent(doc.documentElement, 'fifths') || '0', 10) || 0
  const mode = textContent(doc.documentElement, 'mode') || 'major'

  // First <time> wins (score-wide or measure attributes).
  let timeNum = 4
  let timeDen = 4
  const timeEl = doc.getElementsByTagName('time')[0]
  if (timeEl) {
    const b = parseInt(textContent(timeEl, 'beats') || '4', 10)
    const bt = parseInt(textContent(timeEl, 'beat-type') || '4', 10)
    if (Number.isFinite(b) && b >= 1 && b <= 16) timeNum = b
    if (Number.isFinite(bt) && [1, 2, 4, 8, 16].includes(bt)) timeDen = bt
  }

  // Tempo: first <sound tempo="…"/> or <per-minute> under metronome.
  let tempoBpm: number | undefined
  const soundEls = Array.from(doc.getElementsByTagName('sound'))
  for (const el of soundEls) {
    const t = el.getAttribute('tempo')
    if (t) {
      const n = parseFloat(t)
      if (Number.isFinite(n) && n >= 20 && n <= 400) {
        tempoBpm = Math.round(n)
        break
      }
    }
  }
  if (tempoBpm == null) {
    const perMin = doc.getElementsByTagName('per-minute')[0]?.textContent?.trim()
    if (perMin) {
      const n = parseFloat(perMin)
      if (Number.isFinite(n) && n >= 20 && n <= 400) tempoBpm = Math.round(n)
    }
  }

  const notes: MusicXmlNote[] = []
  const divSafe = Math.max(1, divisions)
  /** Per-voice cursor in quarter-note beats (score-absolute). */
  const voiceCursor = new Map<number, number>()
  const voiceLastOnset = new Map<number, number>()
  const measures = Array.from(doc.getElementsByTagName('measure'))
  measures.forEach((measure, mi) => {
    const measureNum = parseInt(measure.getAttribute('number') || String(mi + 1), 10)
    // Direction/sound tempo inside a measure (first wins if not set yet)
    if (tempoBpm == null) {
      const localSound = measure.getElementsByTagName('sound')
      for (let i = 0; i < localSound.length; i++) {
        const t = localSound[i].getAttribute('tempo')
        if (t) {
          const n = parseFloat(t)
          if (Number.isFinite(n) && n >= 20 && n <= 400) {
            tempoBpm = Math.round(n)
            break
          }
        }
      }
    }
    const noteEls = Array.from(measure.getElementsByTagName('note'))
    for (const noteEl of noteEls) {
      const isRest = noteEl.getElementsByTagName('rest').length > 0
      const duration = parseInt(textContent(noteEl, 'duration') || '0', 10) || 0
      const voice = parseInt(textContent(noteEl, 'voice') || '1', 10)
      const isChord = noteEl.getElementsByTagName('chord').length > 0
      const durationBeats = duration / divSafe
      const onset = isChord
        ? (voiceLastOnset.get(voice) ?? voiceCursor.get(voice) ?? 0)
        : (voiceCursor.get(voice) ?? 0)
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
        chord: isChord || undefined,
        startBeat: onset,
        durationBeats,
        string,
        fret,
        lyric: textContent(noteEl, 'text') || undefined,
      })

      voiceLastOnset.set(voice, onset)
      if (!isChord) voiceCursor.set(voice, onset + durationBeats)
    }
  })

  const pitchClasses = [
    ...new Set(notes.map((n) => n.pitch).filter((p): p is number => p != null).map((p) => p % 12)),
  ].sort((a, b) => a - b)

  return {
    title,
    notes,
    pitchClasses,
    divisions,
    keyFifths: fifths,
    mode,
    tempoBpm,
    timeSignature: { numerator: timeNum, denominator: timeDen },
  }
}

/** Very small MusicXML builder for tests / demos */
export function buildSimpleMusicXml(opts: {
  title: string
  notes: Array<{
    step: string
    octave: number
    duration: number
    alter?: number
    string?: number
    fret?: number
    chord?: boolean
    voice?: number
  }>
  divisions?: number
  tempoBpm?: number
}): string {
  const div = opts.divisions ?? 1
  const tempoDir =
    opts.tempoBpm != null && opts.tempoBpm > 0
      ? `<direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${Math.round(opts.tempoBpm)}</per-minute></metronome></direction-type><sound tempo="${Math.round(opts.tempoBpm)}"/></direction>`
      : ''
  const noteXml = opts.notes
    .map((n) => {
      const alter = n.alter ? `<alter>${n.alter}</alter>` : ''
      const tech =
        n.string != null && n.fret != null
          ? `<technical><string>${n.string}</string><fret>${n.fret}</fret></technical>`
          : ''
      const chord = n.chord ? '<chord/>' : ''
      const voice = n.voice ?? 1
      return `<note>${chord}<pitch><step>${n.step}</step>${alter}<octave>${n.octave}</octave></pitch><duration>${n.duration}</duration><voice>${voice}</voice>${tech}</note>`
    })
    .join('')
  // No external DOCTYPE — keeps browser + jsdom parsers happy without network DTD fetch.
  return `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <work><work-title>${opts.title}</work-title></work>
  <part-list><score-part id="P1"><part-name>Guitar</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes><divisions>${div}</divisions><key><fifths>0</fifths><mode>major</mode></key><time><beats>4</beats><beat-type>4</beat-type></time></attributes>
      ${tempoDir}
      ${noteXml}
    </measure>
  </part>
</score-partwise>`
}
