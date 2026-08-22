import { describe, expect, it, beforeEach } from 'vitest'
import {
  breakdownToTabSong,
  breakdownToUserTab,
  loadUserTabs,
  parseGrTabFile,
  removeUserTab,
  saveUserTabs,
  scoreToTabSong,
  upsertUserTab,
  userTabToAscii,
  userTabToExportPayload,
  type UserTab,
} from './userTabs'
import type { RemedyBreakdown } from './breakdown'
import { tabSongToScore } from './tabScore'
import { theoryStringToDisplay } from './breakdown'
import { TUNINGS } from './theory'

const mem = new Map<string, string>()
const ls = {
  getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k: string, v: string) => {
    mem.set(k, v)
  },
  removeItem: (k: string) => {
    mem.delete(k)
  },
}
// @ts-expect-error test polyfill
globalThis.localStorage = ls

function sampleBreakdown(): RemedyBreakdown {
  return {
    kind: 'midi',
    title: 'Test Melody',
    keyLabel: 'C major',
    tempoBpm: 100,
    confidence: 0.9,
    score: {
      title: 'Test Melody',
      tempo: 100,
      strings: 6,
      notes: [
        { string: 0, fret: 0, time: 0, duration: 1, midi: 64 },
        { string: 0, fret: 2, time: 1, duration: 1, midi: 66 },
      ],
    },
    tabNotes: [],
    tab: [],
    summary: 'ok',
    practicePlan: [],
    scaleMap: [],
  } as unknown as RemedyBreakdown
}

describe('userTabs', () => {
  beforeEach(() => {
    mem.clear()
  })

  it('scoreToTabSong packs notes into measures', () => {
    const song = scoreToTabSong({
      notes: [
        { string: 0, fret: 0, time: 0, duration: 1, midi: 64 },
        { string: 0, fret: 3, time: 5, duration: 1, midi: 67 },
      ],
      tempo: 90,
      title: 'x',
    })
    expect(song.measures.length).toBeGreaterThanOrEqual(2)
    expect(song.tempo).toBe(90)
  })

  it('scoreToTabSong respects 3/4 timeSig bar length', () => {
    const song = scoreToTabSong(
      {
        notes: [
          { string: 0, fret: 0, time: 0, duration: 1, midi: 64 },
          { string: 0, fret: 2, time: 3, duration: 1, midi: 66 },
        ],
        tempo: 100,
        title: 'waltz',
      },
      { timeSig: [3, 4] },
    )
    expect(song.timeSig).toEqual([3, 4])
    expect(song.measures).toHaveLength(2)
    expect(song.measures[1].notes[0].start).toBeCloseTo(0, 5)
  })

  it('breakdownToTabSong preserves timeSig and flips theory→display strings', () => {
    const b = {
      ...sampleBreakdown(),
      timeSig: [3, 4] as [number, number],
      tab: [
        {
          string: 0, // theory low E
          fret: 0,
          midi: 40,
          startBeat: 0,
          durationBeats: 1,
          noteName: 'E2',
        },
        {
          string: 5, // theory high e
          fret: 0,
          midi: 64,
          startBeat: 1,
          durationBeats: 1,
          noteName: 'E4',
        },
      ],
      score: { notes: [], tempo: 100, title: 't' },
    } as unknown as RemedyBreakdown
    const song = breakdownToTabSong(b)
    expect(song.timeSig).toEqual([3, 4])
    // library display: 0 = high e, 5 = low E
    const lowE = song.measures[0].notes.find((n) => n.string === 5)
    const highE = song.measures[0].notes.find((n) => n.string === 0)
    expect(lowE?.fret).toBe(0)
    expect(highE?.fret).toBe(0)

    // Round-trip: theory event → song → score → expected MIDI (standard)
    const score = tabSongToScore(song)
    const lowNote = score.notes.find((n) => n.string === 5)
    const highNote = score.notes.find((n) => n.string === 0)
    expect(lowNote?.midi).toBe(40)
    expect(highNote?.midi).toBe(64)
    expect(score.timeSig).toEqual([3, 4])
    expect(theoryStringToDisplay(0)).toBe(5)
    expect(theoryStringToDisplay(5)).toBe(0)
  })

  it('Drop D round-trip: theory low open → song → score MIDI 38', () => {
    const drop = TUNINGS.drop_d.midi
    const b = {
      ...sampleBreakdown(),
      timeSig: [4, 4] as [number, number],
      tab: [
        {
          string: 0, // theory low E string (Drop D open = 38)
          fret: 0,
          midi: 38,
          startBeat: 0,
          durationBeats: 1,
          noteName: 'D2',
        },
        {
          string: 5, // theory high e
          fret: 0,
          midi: 64,
          startBeat: 1,
          durationBeats: 1,
          noteName: 'E4',
        },
      ],
      score: { notes: [], tempo: 100, title: 'drop' },
    } as unknown as RemedyBreakdown
    const song = breakdownToTabSong(b)
    // display: 5 = low, 0 = high
    expect(song.measures[0].notes.find((n) => n.string === 5)?.fret).toBe(0)
    expect(song.measures[0].notes.find((n) => n.string === 0)?.fret).toBe(0)
    const score = tabSongToScore(song, { tuning: drop })
    expect(score.notes.find((n) => n.string === 5)?.midi).toBe(38)
    expect(score.notes.find((n) => n.string === 0)?.midi).toBe(64)
    expect(score.timeSig).toEqual([4, 4])
    // dual index safety
    expect(theoryStringToDisplay(0)).toBe(5)
    expect(theoryStringToDisplay(5)).toBe(0)
  })

  it('scoreToTabSong keeps onset gaps via start', () => {
    const song = scoreToTabSong({
      notes: [
        { string: 0, fret: 0, time: 0, duration: 1, midi: 64 },
        { string: 0, fret: 3, time: 2.5, duration: 0.5, midi: 67 },
      ],
      tempo: 100,
      title: 'gaps',
    })
    expect(song.measures[0].notes).toHaveLength(2)
    expect(song.measures[0].notes[0].start).toBeCloseTo(0, 5)
    expect(song.measures[0].notes[1].start).toBeCloseTo(2.5, 5)
  })

  it('breakdownToUserTab + persist roundtrip', () => {
    const tab = breakdownToUserTab(sampleBreakdown(), { sourceName: 't.mid' })
    expect(tab).not.toBeNull()
    const list = upsertUserTab([], tab!)
    saveUserTabs(list)
    const loaded = loadUserTabs()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].title).toBe('Test Melody')
  })

  it('refuses placeholder GP stubs', () => {
    const b = {
      ...sampleBreakdown(),
      kind: 'guitarpro' as const,
      isPlaceholder: true,
    }
    expect(breakdownToUserTab(b)).toBeNull()
  })

  it('parseGrTabFile accepts export payload', () => {
    const tab = breakdownToUserTab(sampleBreakdown())!
    const payload = userTabToExportPayload(tab)
    const parsed = parseGrTabFile(JSON.stringify(payload))
    expect(parsed?.id).toBe(tab.id)
  })

  it('removeUserTab drops by id', () => {
    const a = { id: 'a' } as UserTab
    const b = { id: 'b' } as UserTab
    expect(removeUserTab([a, b], 'a').map((t) => t.id)).toEqual(['b'])
  })

  it('userTabToAscii includes frets without throwing', () => {
    const tab = breakdownToUserTab(sampleBreakdown())!
    const ascii = userTabToAscii(tab)
    expect(ascii).toContain('Test Melody')
    expect(ascii).toMatch(/e\|/)
    // open high-e fret 0 and fret 2 should appear as labels
    expect(ascii).toMatch(/0/)
    expect(ascii).toMatch(/2/)
    expect(ascii).not.toContain('undefined')
    expect(ascii).not.toContain('token')
  })
})
