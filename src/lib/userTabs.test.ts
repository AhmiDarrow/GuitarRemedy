import { describe, expect, it, beforeEach } from 'vitest'
import {
  breakdownToUserTab,
  loadUserTabs,
  parseGrTabFile,
  removeUserTab,
  saveUserTabs,
  scoreToTabSong,
  upsertUserTab,
  userTabToExportPayload,
  type UserTab,
} from './userTabs'
import type { RemedyBreakdown } from './breakdown'

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

  it('breakdownToUserTab + persist roundtrip', () => {
    const tab = breakdownToUserTab(sampleBreakdown(), { sourceName: 't.mid' })
    expect(tab).not.toBeNull()
    const list = upsertUserTab([], tab!)
    saveUserTabs(list)
    const loaded = loadUserTabs()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].title).toBe('Test Melody')
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
})
