/** Eternal user-converted tabs — local-first list + export helpers */

import type { LibraryItem, TabMeasure, TabNote, TabSong } from '../data/library'
import type { RemedyBreakdown, TabNote as ScoreNote, TabScore } from './breakdown'

export interface UserTab {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  sourceKind: RemedyBreakdown['kind']
  sourceName?: string
  keyLabel?: string
  tempoBpm: number
  confidence?: number
  tab: TabSong
  score: TabScore
  midiBase64?: string
  tags: string[]
}

const BEATS_PER_MEASURE = 4
const STORAGE_KEY = 'guitarremedy.userTabs.v1'

function slugId(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/\.\w+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : `${Date.now().toString(36)}`
  return `user-${base || 'tab'}-${rand}`
}

export function scoreToTabSong(
  score: TabScore,
  opts?: { title?: string; tempo?: number; timeSig?: [number, number] },
): TabSong {
  const tempo = opts?.tempo ?? score.tempo ?? 100
  const title = opts?.title ?? score.title ?? 'Converted tab'
  const timeSig: [number, number] = opts?.timeSig ?? [4, 4]
  const beatsPer = timeSig[0] || BEATS_PER_MEASURE

  const sorted = [...(score.notes || [])].sort((a, b) => a.time - b.time)
  if (!sorted.length) {
    return { title, tempo, timeSig, measures: [{ notes: [] }] }
  }

  const measures: TabMeasure[] = []
  let measureNotes: TabNote[] = []
  let measureStart = Math.floor(sorted[0].time / beatsPer) * beatsPer

  const flush = () => {
    measures.push({ notes: measureNotes })
    measureNotes = []
  }

  for (const n of sorted) {
    while (n.time >= measureStart + beatsPer) {
      flush()
      measureStart += beatsPer
    }
    measureNotes.push({
      string: Math.max(0, Math.min(5, n.string)),
      fret: Math.max(0, n.fret),
      duration: Math.max(0.125, n.duration || 1),
    })
  }
  flush()
  if (!measures.length) measures.push({ notes: [] })
  return { title, tempo, timeSig, measures }
}

export function breakdownToTabSong(b: RemedyBreakdown): TabSong {
  const tempo = b.tempoBpm || b.score?.tempo || 100
  const title = b.title || 'Converted tab'
  const timeSig: [number, number] = [4, 4]
  const beatsPer = 4

  if (b.tab?.length) {
    const measures: TabMeasure[] = []
    let measureNotes: TabNote[] = []
    const sorted = [...b.tab].sort((a, c) => a.startBeat - c.startBeat)
    let measureStart = sorted.length
      ? Math.floor(sorted[0].startBeat / beatsPer) * beatsPer
      : 0
    const flush = () => {
      measures.push({ notes: measureNotes })
      measureNotes = []
    }
    for (const ev of sorted) {
      while (ev.startBeat >= measureStart + beatsPer) {
        flush()
        measureStart += beatsPer
      }
      const displayString = Math.max(0, Math.min(5, 5 - ev.string))
      measureNotes.push({
        string: displayString,
        fret: ev.fret,
        duration: Math.max(0.125, ev.durationBeats || 1),
      })
    }
    flush()
    if (!measures.length) measures.push({ notes: [] })
    return { title, tempo, timeSig, measures }
  }

  return scoreToTabSong(b.score ?? { notes: b.tabNotes || [], tempo, title }, { title, tempo })
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

export function breakdownToUserTab(
  b: RemedyBreakdown,
  opts?: { sourceName?: string; id?: string },
): UserTab | null {
  const notes = b.score?.notes?.length ? b.score.notes : b.tabNotes
  if (!notes?.length && !b.tab?.length) return null

  const tab = breakdownToTabSong(b)
  const score: TabScore = b.score?.notes?.length
    ? { ...b.score, title: b.title, tempo: b.tempoBpm || b.score.tempo }
    : {
        title: b.title,
        tempo: b.tempoBpm || 100,
        key: b.keyLabel,
        strings: 6,
        notes: notes || [],
      }

  const now = new Date().toISOString()
  return {
    id: opts?.id ?? slugId(b.title || opts?.sourceName || 'tab'),
    title: b.title || opts?.sourceName || 'Converted tab',
    createdAt: now,
    updatedAt: now,
    sourceKind: b.kind,
    sourceName: opts?.sourceName,
    keyLabel: b.keyLabel,
    tempoBpm: b.tempoBpm || score.tempo || 100,
    confidence: b.confidence,
    tab,
    score,
    midiBase64: b.midiBytes ? arrayBufferToBase64(b.midiBytes) : undefined,
    tags: ['user', 'converted', b.kind, ...(b.kind === 'audio' ? ['mp3-to-midi'] : [])],
  }
}

export interface GrTabFile {
  format: 'guitar-remedy-tab'
  version: 1
  exportedAt: string
  tab: UserTab
}

export function userTabToExportPayload(tab: UserTab): GrTabFile {
  return {
    format: 'guitar-remedy-tab',
    version: 1,
    exportedAt: new Date().toISOString(),
    tab: { ...tab },
  }
}

export function downloadUserTabFile(tab: UserTab, filename?: string) {
  const payload = userTabToExportPayload(tab)
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const base = (filename || tab.title || 'tab').replace(/[^\w\-]+/g, '_').slice(0, 48)
  a.href = url
  a.download = base.endsWith('.grtab.json') ? base : `${base}.grtab.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadAsciiTab(tab: UserTab, filename?: string) {
  const lines = ['e|', 'B|', 'G|', 'D|', 'A|', 'E|']
  for (const measure of tab.tab.measures) {
    const cells: string[][] = [[], [], [], [], [], []]
    for (const n of measure.notes) {
      const s = Math.max(0, Math.min(5, n.string))
      const token = String(Math.max(0, n.fret))
      for (let i = 0; i < 6; i++) {
        cells[i].push(i === s ? token.padStart(2, '-') : '--')
      }
      for (let i = 0; i < 6; i++) cells[i].push('-')
    }
    for (let i = 0; i < 6; i++) {
      lines[i] += cells[i].join('') + '|'
    }
  }
  const header = `${tab.title}\nTempo: ${tab.tempoBpm} · ${tab.keyLabel || ''}\n\n`
  const body = lines.join('\n')
  const blob = new Blob([header + body + '\n'], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const base = (filename || tab.title || 'tab').replace(/[^\w\-]+/g, '_').slice(0, 48)
  a.href = url
  a.download = `${base}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImportedTabFile(text: string): UserTab | null {
  try {
    const data = JSON.parse(text) as GrTabFile | UserTab
    if (data && typeof data === 'object' && 'format' in data && data.format === 'guitar-remedy-tab') {
      const t = data.tab
      if (t?.id && t?.tab?.measures) return t as UserTab
    }
    if (
      data &&
      typeof data === 'object' &&
      'id' in data &&
      'tab' in data &&
      (data as UserTab).tab?.measures
    ) {
      return data as UserTab
    }
  } catch {
    return null
  }
  return null
}

/** Alias used by store / Library import UI */
export function parseGrTabFile(text: string): UserTab | null {
  return parseImportedTabFile(text)
}

export function loadUserTabs(): UserTab[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as UserTab[]
    return Array.isArray(data) ? data.filter((t) => t?.id && t?.tab?.measures) : []
  } catch {
    return []
  }
}

export function saveUserTabs(tabs: UserTab[]): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs))
  } catch {
    // quota / private mode
  }
}

export function upsertUserTab(tabs: UserTab[], tab: UserTab): UserTab[] {
  const idx = tabs.findIndex((t) => t.id === tab.id)
  if (idx === -1) return [tab, ...tabs]
  const next = tabs.slice()
  next[idx] = { ...tab, updatedAt: new Date().toISOString() }
  return next
}

export function removeUserTab(tabs: UserTab[], id: string): UserTab[] {
  return tabs.filter((t) => t.id !== id)
}

export function userTabToLibraryItem(t: UserTab): LibraryItem {
  return {
    id: t.id,
    title: t.title,
    kind: 'song',
    skill: 'beginner',
    key: t.keyLabel,
    genre: 'User convert',
    tags: t.tags,
    description: `Saved ${t.sourceKind} convert · ${t.score.notes?.length ?? 0} notes · ${new Date(t.createdAt).toLocaleString()}`,
    tab: t.tab,
    openLicense: true,
  }
}

export function mergeLibraryWithUserTabs(
  builtin: LibraryItem[],
  userTabs: UserTab[],
): LibraryItem[] {
  const userItems = userTabs.map(userTabToLibraryItem)
  const ids = new Set(userItems.map((u) => u.id))
  return [...userItems, ...builtin.filter((b) => !ids.has(b.id))]
}

export function scoreNotesCount(score: TabScore | undefined): number {
  return score?.notes?.length ?? 0
}

export function isPlayableScore(score: TabScore | undefined): score is TabScore {
  return !!score && Array.isArray(score.notes) && score.notes.length > 0
}

export type { ScoreNote }
