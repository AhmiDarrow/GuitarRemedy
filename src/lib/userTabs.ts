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

  const sorted = [...(score.notes || [])].sort((a, b) => a.time - b.time || a.string - b.string)
  if (!sorted.length) {
    return { title, tempo, timeSig, measures: [{ notes: [] }] }
  }

  const firstMeasure = Math.max(0, Math.floor(sorted[0].time / beatsPer))
  const lastBeat = sorted.reduce((m, n) => Math.max(m, n.time + (n.duration || 0)), 0)
  const lastMeasure = Math.max(firstMeasure, Math.floor(Math.max(0, lastBeat - 1e-9) / beatsPer))
  const measures: TabMeasure[] = []

  for (let mi = firstMeasure; mi <= lastMeasure; mi++) {
    const measureStart = mi * beatsPer
    const measureEnd = measureStart + beatsPer
    const measureNotes: TabNote[] = []
    for (const n of sorted) {
      if (n.time + 1e-9 < measureStart) continue
      if (n.time >= measureEnd - 1e-9) continue
      measureNotes.push({
        string: Math.max(0, Math.min(5, n.string)),
        fret: Math.max(0, n.fret),
        duration: Math.max(0.125, n.duration || 1),
        start: Math.max(0, n.time - measureStart),
      })
    }
    measures.push({ notes: measureNotes })
  }
  if (!measures.length) measures.push({ notes: [] })
  return { title, tempo, timeSig, measures }
}

export function breakdownToTabSong(b: RemedyBreakdown): TabSong {
  const tempo = b.tempoBpm || b.score?.tempo || 100
  const title = b.title || 'Converted tab'
  const timeSig: [number, number] = b.timeSig?.length === 2
    ? [Math.max(1, b.timeSig[0] || 4), b.timeSig[1] || 4]
    : [4, 4]
  const beatsPer = timeSig[0] || BEATS_PER_MEASURE

  if (b.tab?.length) {
    const sorted = [...b.tab].sort((a, c) => a.startBeat - c.startBeat || a.string - c.string)
    const firstMeasure = sorted.length
      ? Math.max(0, Math.floor(sorted[0].startBeat / beatsPer))
      : 0
    const lastBeat = sorted.reduce(
      (m, ev) => Math.max(m, ev.startBeat + (ev.durationBeats || 0)),
      0,
    )
    const lastMeasure = Math.max(
      firstMeasure,
      Math.floor(Math.max(0, lastBeat - 1e-9) / beatsPer),
    )
    const measures: TabMeasure[] = []
    for (let mi = firstMeasure; mi <= lastMeasure; mi++) {
      const measureStart = mi * beatsPer
      const measureEnd = measureStart + beatsPer
      const measureNotes: TabNote[] = []
      for (const ev of sorted) {
        if (ev.startBeat + 1e-9 < measureStart) continue
        if (ev.startBeat >= measureEnd - 1e-9) continue
        // TabEvent.string is low-E=0; library TabSong uses high-e=0
        measureNotes.push({
          string: Math.max(0, Math.min(5, 5 - ev.string)),
          fret: ev.fret,
          duration: Math.max(0.125, ev.durationBeats || 1),
          start: Math.max(0, ev.startBeat - measureStart),
        })
      }
      measures.push({ notes: measureNotes })
    }
    if (!measures.length) measures.push({ notes: [] })
    return { title, tempo, timeSig, measures }
  }

  return scoreToTabSong(b.score ?? { notes: b.tabNotes || [], tempo, title }, {
    title,
    tempo,
    timeSig,
  })
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
  // Never persist GP/binary placeholders as if they were real songs
  if (b.isPlaceholder) return null
  const notes = b.score?.notes?.length ? b.score.notes : b.tabNotes
  if (!notes?.length && !b.tab?.length) return null

  const tab = breakdownToTabSong(b)
  const timeSig: [number, number] =
    b.timeSig?.length === 2
      ? [Math.max(1, b.timeSig[0] || 4), b.timeSig[1] || 4]
      : b.score?.timeSig?.length === 2
        ? [Math.max(1, b.score.timeSig[0] || 4), b.score.timeSig[1] || 4]
        : tab.timeSig?.length === 2
          ? tab.timeSig
          : [4, 4]
  const score: TabScore = b.score?.notes?.length
    ? {
        ...b.score,
        title: b.title,
        tempo: b.tempoBpm || b.score.tempo,
        timeSig: b.score.timeSig ?? timeSig,
        key: b.score.key || b.keyLabel,
      }
    : {
        title: b.title,
        tempo: b.tempoBpm || 100,
        key: b.keyLabel,
        strings: 6,
        timeSig,
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

/**
 * Pure ASCII tab text (testable). Display order: e B G D A E.
 * Preserves groove via `start` onsets — rests become `-` columns (not left-packed).
 */
export function userTabToAscii(tab: UserTab, opts?: { colsPerBeat?: number }): string {
  const colsPerBeat = Math.max(1, Math.min(8, Math.round(opts?.colsPerBeat ?? 2)))
  const beatsPer = Math.max(1, tab.tab.timeSig?.[0] || BEATS_PER_MEASURE)
  const colsPerMeasure = Math.max(colsPerBeat, Math.round(beatsPer * colsPerBeat))
  const lines = ['e|', 'B|', 'G|', 'D|', 'A|', 'E|']

  for (const measure of tab.tab.measures) {
    // One slot per subdivision column × 6 strings (null = rest dash)
    const grid: (string | null)[][] = Array.from({ length: 6 }, () =>
      Array.from({ length: colsPerMeasure }, () => null),
    )
    const ordered = [...(measure.notes || [])].sort(
      (a, b) => (a.start ?? 0) - (b.start ?? 0) || a.string - b.string,
    )
    for (const n of ordered) {
      const s = Math.max(0, Math.min(5, Math.round(Number(n.string) || 0)))
      const start = typeof n.start === 'number' && Number.isFinite(n.start) ? n.start : 0
      const col = Math.max(0, Math.min(colsPerMeasure - 1, Math.round(start * colsPerBeat)))
      const fretLabel = String(Math.max(0, Math.min(24, Math.round(Number(n.fret) || 0))))
      // Prefer earlier note if two land on same cell
      if (grid[s][col] == null) grid[s][col] = fretLabel
    }
    for (let i = 0; i < 6; i++) {
      let row = ''
      for (let c = 0; c < colsPerMeasure; c++) {
        const cell = grid[i][c]
        row += cell != null ? cell.padStart(2, '-').padEnd(2, '-') : '--'
      }
      lines[i] += row + '|'
    }
  }

  const ts = tab.tab.timeSig
  const meter =
    Array.isArray(ts) && ts.length >= 2 ? `${ts[0]}/${ts[1]}` : `${beatsPer}/4`
  const header = `${tab.title}\nTempo: ${tab.tempoBpm} · ${meter}${tab.keyLabel ? ` · ${tab.keyLabel}` : ''}\n\n`
  return header + lines.join('\n') + '\n'
}

export function downloadAsciiTab(tab: UserTab, filename?: string) {
  const text = userTabToAscii(tab)
  const blob = new Blob([text], { type: 'text/plain' })
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
