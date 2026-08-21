import { describe, expect, it } from 'vitest'
import { analyzeNotes } from './breakdown'
import {
  applyNotePatch,
  applyScoreToBreakdown,
  applyScoreToUserTab,
  cleanUpAfterConvert,
  cleanUpScore,
  deleteScoreNote,
  insertScoreNote,
  midiFromStringFret,
  setScoreTempo,
  updateScoreNote,
} from './tabEdit'
import { breakdownToUserTab } from './userTabs'

describe('tabEdit', () => {
  it('maps string/fret to midi (high e open = 64)', () => {
    expect(midiFromStringFret(0, 0)).toBe(64)
    expect(midiFromStringFret(5, 0)).toBe(40)
    expect(midiFromStringFret(0, 3)).toBe(67)
  })

  it('updates fret and recomputes midi', () => {
    const note = { string: 0, fret: 0, time: 0, duration: 1, midi: 64 }
    const next = applyNotePatch(note, { fret: 2 })
    expect(next.fret).toBe(2)
    expect(next.midi).toBe(66)
  })

  it('update / delete / insert keep score sorted', () => {
    let score = {
      title: 'Edit me',
      tempo: 100,
      notes: [
        { string: 0, fret: 0, time: 0, duration: 1, midi: 64 },
        { string: 0, fret: 2, time: 1, duration: 1, midi: 66 },
      ],
    } as import('./breakdown').TabScore
    score = updateScoreNote(score, 0, { fret: 3 })
    expect(score.notes[0].fret).toBe(3)
    expect(score.notes[0].midi).toBe(67)

    score = insertScoreNote(score, { string: 1, fret: 0, time: 0.5, duration: 0.5 })
    expect(score.notes.length).toBe(3)
    expect(score.notes[1].time).toBe(0.5)

    score = deleteScoreNote(score, 1)
    expect(score.notes.length).toBe(2)

    score = setScoreTempo(score, 128)
    expect(score.tempo).toBe(128)
  })

  it('applyScoreToUserTab rebuilds measures', () => {
    const b = analyzeNotes([60, 64, 67], 'Edit song')
    b.score = {
      title: b.title,
      tempo: 100,
      notes: [
        { string: 2, fret: 1, time: 0, duration: 1, midi: 60 },
        { string: 1, fret: 0, time: 1, duration: 1, midi: 64 },
        { string: 0, fret: 3, time: 2, duration: 1, midi: 67 },
      ],
    }
    b.tabNotes = b.score.notes
    const tab = breakdownToUserTab(b)!
    const edited = updateScoreNote(tab.score, 0, { fret: 3 })
    const saved = applyScoreToUserTab(tab, edited)
    expect(saved.score.notes[0].fret).toBe(3)
    expect(saved.tab.measures.length).toBeGreaterThan(0)
    const total = saved.tab.measures.reduce((n, m) => n + m.notes.length, 0)
    expect(total).toBe(3)
  })

  it('applyScoreToBreakdown syncs tabNotes', () => {
    const b = analyzeNotes([64, 67], 'B')
    const score = {
      title: 'B',
      tempo: 90,
      notes: [
        { string: 0, fret: 0, time: 0, duration: 1, midi: 64 },
        { string: 0, fret: 3, time: 1, duration: 1, midi: 67 },
      ],
    }
    const next = applyScoreToBreakdown(b, score)
    expect(next.tempoBpm).toBe(90)
    expect(next.tabNotes.length).toBe(2)
    expect(next.score.notes[1].fret).toBe(3)
  })

  it('cleanUpScore drops ghosts, merges, and re-frets', () => {
    const messy = {
      title: 'Messy',
      tempo: 100,
      notes: [
        { string: 0, fret: 0, time: 0.03, duration: 0.5, midi: 64 },
        { string: 0, fret: 0, time: 0.08, duration: 0.05, midi: 64 }, // ghost
        { string: 5, fret: 12, time: 0.55, duration: 0.5, midi: 52 }, // far jump
        { string: 5, fret: 12, time: 0.7, duration: 0.5, midi: 52 }, // merge candidate
        { string: 0, fret: 3, time: 1.02, duration: 0.5, midi: 67 },
      ],
    }
    const cleaned = cleanUpScore(messy)
    expect(cleaned.notes.length).toBeLessThan(messy.notes.length)
    expect(cleaned.notes.every((n) => n.duration >= 0.1)).toBe(true)
    // frets should stay in a playable range after continuity pass
    expect(cleaned.notes.every((n) => n.fret >= 0 && n.fret <= 17)).toBe(true)

    const after = cleanUpAfterConvert(messy)
    expect(after.notes.length).toBeGreaterThan(0)
    expect(after.tempo).toBe(100)
  })
})
