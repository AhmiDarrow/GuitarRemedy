import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Download, FileUp, Heart, Pencil, Search, Trash2, Upload } from 'lucide-react'
import clsx from 'clsx'
import {
  LIBRARY,
  searchLibrary,
  type LibraryItem,
  type LibraryKind,
  type SkillLevel,
} from '../data/library'
import { useAppStore } from '../store/appStore'
import { useUserTabsStore } from '../store/userTabsStore'
import {
  downloadAsciiTab,
  downloadUserTabFile,
  downloadUserTabMidi,
  parseImportedTabFile,
  userTabToLibraryItem,
} from '../lib/userTabs'
import { applyScoreToUserTab } from '../lib/tabEdit'
import type { TabScore } from '../lib/breakdown'
import { TabView } from '../components/TabView'
import { TabEditor } from '../components/TabEditor'
import { SCALES, type ScaleId } from '../lib/theory'
import { Fretboard } from '../components/Fretboard'
import { tabSongToScore } from '../lib/tabScore'

const KINDS: Array<LibraryKind | 'all'> = ['all', 'scale', 'chord', 'riff', 'song', 'progression']
const SKILLS: Array<SkillLevel | 'all'> = ['all', 'beginner', 'intermediate', 'advanced']

export function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const mineParam = searchParams.get('mine') === '1'
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<LibraryKind | 'all'>('all')
  const [skill, setSkill] = useState<SkillLevel | 'all'>('all')
  const [favOnly, setFavOnly] = useState(false)
  const [mineOnly, setMineOnly] = useState(mineParam)
  const hydrate = useUserTabsStore((s) => s.hydrate)
  const userTabs = useUserTabsStore((s) => s.tabs)
  const removeTab = useUserTabsStore((s) => s.removeTab)
  const getTuning = useAppStore((s) => s.getTuning)
  const upsertTab = useUserTabsStore((s) => s.upsertTab)
  const activeTabId = useUserTabsStore((s) => s.activeTabId)
  const setActiveTabId = useUserTabsStore((s) => s.setActiveTabId)
  const [selectedId, setSelectedId] = useState<string | null>(activeTabId || LIBRARY[0]?.id || null)
  const [importMsg, setImportMsg] = useState<string | null>(null)
  const [editingMine, setEditingMine] = useState(false)
  const grtabInputRef = useRef<HTMLInputElement>(null)
  const favorites = useAppStore((s) => s.favorites)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const showDegrees = useAppStore((s) => s.showDegrees)

  useEffect(() => { hydrate() }, [hydrate])
  useEffect(() => { if (mineParam) setMineOnly(true) }, [mineParam])
  useEffect(() => { if (activeTabId) setSelectedId(activeTabId) }, [activeTabId])

  const importGrtab = async (file: File) => {
    setImportMsg(null)
    try {
      const text = await file.text()
      const tab = parseImportedTabFile(text)
      if (!tab?.tab?.measures) {
        setImportMsg('Not a valid .grtab.json file.')
        return
      }
      const now = new Date().toISOString()
      const imported = {
        ...tab,
        id: tab.id?.startsWith('user-') ? tab.id : `user-import-${Date.now().toString(36)}`,
        updatedAt: now,
        createdAt: tab.createdAt || now,
        tags: Array.from(new Set([...(tab.tags || []), 'imported', 'user'])),
      }
      upsertTab(imported)
      setMineOnly(true)
      setSearchParams({ mine: '1' })
      setSelectedId(imported.id)
      setActiveTabId(imported.id)
      setImportMsg(`Imported "${imported.title}" into Your tabs.`)
    } catch {
      setImportMsg('Could not read that file.')
    }
  }

  const userItems = useMemo(() => userTabs.map(userTabToLibraryItem), [userTabs])

  const items = useMemo(() => {
    if (mineOnly) {
      const qn = q.trim().toLowerCase()
      return userItems.filter((item) => {
        if (!qn) return true
        const hay = [item.title, item.description, item.key, ...item.tags]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return hay.includes(qn)
      })
    }
    const builtin = searchLibrary(q, {
      kind,
      skill,
      favoritesOnly: favOnly,
      favoriteIds: favorites,
    })
    const qn = q.trim().toLowerCase()
    const users = userItems.filter((item) => {
      if (kind !== 'all' && kind !== 'song') return false
      if (favOnly && !favorites.includes(item.id)) return false
      if (!qn) return true
      const hay = [item.title, item.description, item.key, ...item.tags]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(qn)
    })
    const ids = new Set(users.map((u) => u.id))
    return [...users, ...builtin.filter((b) => !ids.has(b.id))]
  }, [q, kind, skill, favOnly, favorites, mineOnly, userItems])

  const selected: LibraryItem | null =
    items.find((i) => i.id === selectedId) ?? items[0] ?? null
  const selectedUser = selected ? userTabs.find((t) => t.id === selected.id) : undefined

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] p-5 md:p-6">
        <img
          src="/assets/hero-dark-forest.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/92 to-[var(--bg)]/70" />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-2xl md:text-3xl font-bold">Library</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {userTabs.length} saved converts · {LIBRARY.length} open items
              (public domain / traditional / original).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={grtabInputRef}
              type="file"
              accept=".json,.grtab.json,application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void importGrtab(f)
                e.target.value = ''
              }}
            />
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={() => grtabInputRef.current?.click()}
            >
              <FileUp className="w-3.5 h-3.5" />
              Import .grtab
            </button>
            <Link to="/upload" className="btn-primary text-xs">
              <Upload className="w-3.5 h-3.5" />
              Convert song
            </Link>
          </div>
        </div>
      </header>

      {importMsg ? <p className="text-sm text-mint px-1">{importMsg}</p> : null}

      <div className="flex flex-col lg:flex-row gap-5">
        <aside className="lg:w-96 shrink-0 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              className="input pl-9"
              placeholder="Search library"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              className={clsx('btn-ghost text-xs', mineOnly && 'text-mint')}
              onClick={() => {
                setMineOnly(true)
                setSearchParams({ mine: '1' })
              }}
            >
              Your tabs
            </button>
            <button
              type="button"
              className={clsx('btn-ghost text-xs', !mineOnly && 'text-mint')}
              onClick={() => {
                setMineOnly(false)
                setSearchParams({})
              }}
            >
              Built-in
            </button>
            <button
              type="button"
              className={clsx('btn-ghost text-xs', favOnly && 'text-mint')}
              onClick={() => setFavOnly((v) => !v)}
            >
              <Heart className="w-3 h-3" /> Favorites
            </button>
          </div>
          {!mineOnly && (
            <>
              <div className="flex flex-wrap gap-1">
                {KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={clsx('btn-ghost text-[10px] capitalize', kind === k && 'text-mint')}
                    onClick={() => setKind(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {SKILLS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={clsx('btn-ghost text-[10px] capitalize', skill === s && 'text-mint')}
                    onClick={() => setSkill(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
          <ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
            {items.map((item) => {
              const active = selected?.id === item.id
              const fav = favorites.includes(item.id)
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id)
                      setActiveTabId(item.id.startsWith('user-') ? item.id : null)
                      setEditingMine(false)
                    }}
                    className={clsx(
                      'w-full text-left rounded-xl border px-3 py-2.5 transition-colors',
                      active
                        ? 'border-mint/40 bg-mint/10'
                        : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-mint/25',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{item.title}</div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate">
                          {item.kind} · {item.skill}
                          {item.key ? ` · ${item.key}` : ''}
                        </div>
                      </div>
                      <span
                        role="button"
                        tabIndex={0}
                        className={clsx('shrink-0 p-1', fav ? 'text-mint' : 'text-[var(--text-muted)]')}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleFavorite(item.id)
                          }
                        }}
                      >
                        <Heart className="w-3.5 h-3.5" fill={fav ? 'currentColor' : 'none'} />
                      </span>
                    </div>
                  </button>
                </li>
              )
            })}
            {items.length === 0 && (
              <li className="text-sm text-[var(--text-muted)] px-2 py-6 text-center">No matches.</li>
            )}
          </ul>
        </aside>

        <section className="flex-1 min-w-0 space-y-4">
          {selected ? (
            <>
              <div className="card p-4 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-bold">{selected.title}</h2>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{selected.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedUser && (
                    <>
                      <button
                        type="button"
                        className="btn-secondary text-xs"
                        onClick={() => setEditingMine((v) => !v)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        {editingMine ? 'Close editor' : 'Edit tab'}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary text-xs"
                        onClick={() => downloadUserTabFile(selectedUser)}
                      >
                        <Download className="w-3.5 h-3.5" />
                        .grtab
                      </button>
                      <button
                        type="button"
                        className="btn-secondary text-xs"
                        onClick={() => downloadAsciiTab(selectedUser)}
                      >
                        ASCII
                      </button>
                      <button
                        type="button"
                        className="btn-secondary text-xs"
                        onClick={() => downloadUserTabMidi(selectedUser)}
                        title="MIDI with embedded tempo (rebuilds from score if needed)"
                      >
                        MIDI
                      </button>
                      <button
                        type="button"
                        className="btn-ghost text-xs text-red-400"
                        onClick={() => {
                          removeTab(selectedUser.id)
                          setSelectedId(null)
                          setImportMsg('Removed from Your tabs.')
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {selected.scaleId && SCALES[selected.scaleId as ScaleId] ? (
                <Fretboard
                  scale={SCALES[selected.scaleId as ScaleId]}
                  root={0}
                  showDegrees={showDegrees}
                />
              ) : null}

              {editingMine && selectedUser ? (
                <TabEditor
                  score={selectedUser.score}
                  title={selectedUser.title}
                  onCancel={() => setEditingMine(false)}
                  onSave={(score: TabScore) => {
                    const next = applyScoreToUserTab(selectedUser, score)
                    upsertTab(next)
                    setEditingMine(false)
                    setImportMsg(`Saved edits · "${next.title}"`)
                  }}
                />
              ) : selectedUser?.score?.notes?.length ? (
                <TabView title={selectedUser.title} score={selectedUser.score} />
              ) : selected.tab ? (
                <TabView
                  title={selected.tab.title}
                  score={tabSongToScore(selected.tab, { tuning: getTuning() })}
                />
              ) : null}
            </>
          ) : (
            <div className="card p-8 text-center text-[var(--text-muted)] space-y-3">
              <p>{mineOnly ? 'No saved converts yet.' : 'Select an item'}</p>
              {mineOnly ? (
                <Link to="/upload" className="btn-primary text-xs inline-flex">
                  <Upload className="w-3.5 h-3.5" />
                  Drop an MP3 to convert
                </Link>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
