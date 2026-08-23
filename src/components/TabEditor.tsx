import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Pencil,
  Plus,
  Trash2,
  Save,
  Sparkles,
  X,
  Headphones,
  Filter,
  Music2,
  Crosshair,
} from 'lucide-react'
import type { TabScore } from '../lib/breakdown'
import {
  cleanUpScore,
  deleteScoreNote,
  dropLowConfidenceNotes,
  insertScoreNote,
  keepStrongestBars,
  lockLeadMono,
  reFretScore,
  setScoreTempo,
  updateScoreNote,
  type NotePatch,
} from '../lib/tabEdit'
import { TabView } from './TabView'
import type { FretPositionPrefer } from '../lib/theory'

type Props = {
  score: TabScore
  title?: string
  onSave: (score: TabScore) => void
  onCancel?: () => void
  className?: string
  /** Object URL or path of source audio for A/B scrub under the tab. */
  sourceAudioUrl?: string | null
}

const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E']

function confColor(c?: number): string {
  if (typeof c !== 'number') return 'transparent'
  if (c >= 0.65) return 'rgba(93,255,176,0.22)'
  if (c >= 0.4) return 'rgba(232,197,71,0.18)'
  return 'rgba(255,107,107,0.2)'
}

function artLabel(a?: string): string {
  if (!a || a === 'none') return ''
  if (a === 'bend') return 'b'
  if (a === 'slide') return '/'
  if (a === 'hammer') return 'h'
  if (a === 'pull') return 'p'
  return ''
}

export function TabEditor({
  score: initial,
  title,
  onSave,
  onCancel,
  className,
  sourceAudioUrl,
}: Props) {
  const [draft, setDraft] = useState<TabScore>(() => ({
    ...initial,
    notes: initial.notes.map((n) => ({ ...n })),
  }))
  const [selected, setSelected] = useState(0)
  const [preferPos, setPreferPos] = useState<FretPositionPrefer>(
    initial.preferPosition ?? 'auto',
  )
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [abPlaying, setAbPlaying] = useState(false)

  useEffect(() => {
    setDraft({
      ...initial,
      notes: initial.notes.map((n) => ({ ...n })),
    })
    setPreferPos(initial.preferPosition ?? 'auto')
  }, [initial])

  const noteCount = draft.notes.length
  const safeIndex = noteCount === 0 ? -1 : Math.min(selected, noteCount - 1)
  const current = safeIndex >= 0 ? draft.notes[safeIndex] : null

  const preview = useMemo(() => draft, [draft])

  const patchSelected = (patch: NotePatch) => {
    if (safeIndex < 0) return
    setDraft((s) => updateScoreNote(s, safeIndex, patch))
  }

  const scrubToSelected = () => {
    const el = audioRef.current
    if (!el || !current || !sourceAudioUrl) return
    const bpm = draft.tempo || 100
    const sec = (current.time * 60) / bpm
    el.currentTime = Math.max(0, sec)
    void el.play().then(() => setAbPlaying(true)).catch(() => setAbPlaying(false))
  }

  return (
    <div className={className}>
      <div className="card p-4 space-y-4 border-mint/30">
        <div className="flex flex-wrap items-center gap-2">
          <Pencil className="w-4 h-4 text-mint" />
          <h3 className="font-display font-semibold text-sm flex-1">
            Edit tab{title ? ` · ${title}` : ''}
          </h3>
          <label className="text-xs text-[var(--text-muted)] flex items-center gap-2">
            Tempo
            <input
              type="number"
              min={30}
              max={300}
              value={draft.tempo ?? 100}
              onChange={(e) => setDraft((s) => setScoreTempo(s, Number(e.target.value)))}
              className="w-16 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] px-2 py-1 text-[var(--text)]"
            />
          </label>
          <label className="text-xs text-[var(--text-muted)] flex items-center gap-2">
            Position
            <select
              className="rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] px-2 py-1 text-[var(--text)]"
              value={preferPos}
              onChange={(e) => {
                const v = e.target.value as FretPositionPrefer
                setPreferPos(v)
                setDraft((s) => reFretScore(s, v))
              }}
            >
              <option value="auto">Auto</option>
              <option value="open">Open (0–5)</option>
              <option value="mid">Mid (5–7)</option>
            </select>
          </label>
          <button
            type="button"
            className="btn-ghost !py-1.5 !px-2 text-xs"
            onClick={() => {
              setDraft((s) => insertScoreNote(s))
              setSelected(draft.notes.length)
            }}
          >
            <Plus className="w-3.5 h-3.5" /> Note
          </button>
          <button
            type="button"
            className="btn-ghost !py-1.5 !px-2 text-xs"
            title="Drop ghosts, quantize, merge, re-fret"
            onClick={() => {
              setDraft((s) => cleanUpScore(s, { preferPosition: preferPos }))
              setSelected(0)
            }}
            disabled={noteCount === 0}
          >
            <Sparkles className="w-3.5 h-3.5" /> Clean up
          </button>
          <button
            type="button"
            className="btn-ghost !py-1.5 !px-2 text-xs"
            title="Force single lead line (highest conf per onset)"
            onClick={() => {
              setDraft((s) => lockLeadMono(s))
              setSelected(0)
            }}
            disabled={noteCount === 0}
          >
            <Crosshair className="w-3.5 h-3.5" /> Lock lead
          </button>
          <button
            type="button"
            className="btn-ghost !py-1.5 !px-2 text-xs"
            title="Drop low-confidence notes"
            onClick={() => {
              setDraft((s) => dropLowConfidenceNotes(s, 0.38))
              setSelected(0)
            }}
            disabled={noteCount === 0}
          >
            <Filter className="w-3.5 h-3.5" /> Weak notes
          </button>
          <button
            type="button"
            className="btn-ghost !py-1.5 !px-2 text-xs"
            title="Keep strongest 8 bars only"
            onClick={() => {
              setDraft((s) => keepStrongestBars(s, 8, 4))
              setSelected(0)
            }}
            disabled={noteCount === 0}
          >
            <Music2 className="w-3.5 h-3.5" /> Best bars
          </button>
          {onCancel ? (
            <button type="button" className="btn-ghost !py-1.5 !px-2 text-xs" onClick={onCancel}>
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          ) : null}
          <button
            type="button"
            className="btn-primary !py-1.5 !px-3 text-xs"
            onClick={() => onSave(draft)}
            disabled={noteCount === 0}
          >
            <Save className="w-3.5 h-3.5" /> Save edits
          </button>
        </div>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Fix frets, strings, beat time, and duration after convert. Row color = pitch confidence
          (mint strong · amber medium · red weak). Marks: <span className="font-mono">b</span> bend ·{' '}
          <span className="font-mono">/</span> slide · <span className="font-mono">h</span> hammer ·{' '}
          <span className="font-mono">p</span> pull. <strong className="text-mint font-medium">Lock lead</strong>{' '}
          forces mono; <strong className="text-mint font-medium">Clean up</strong> snaps timing and re-frets.
        </p>

        {sourceAudioUrl ? (
          <div className="rounded-xl border border-[var(--border)] p-3 bg-[var(--bg-elevated)]/50 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Headphones className="w-3.5 h-3.5 text-mint" />
              <span className="font-medium text-[var(--text)]">A/B original audio</span>
              <button
                type="button"
                className="btn-ghost !py-1 !px-2 text-xs"
                onClick={scrubToSelected}
                disabled={!current}
                title="Jump source audio to selected note beat"
              >
                Scrub to note
              </button>
              <span className="text-[var(--text-muted)]">
                Play the recording under the tab — ear is the final check.
              </span>
            </div>
            <audio
              ref={audioRef}
              src={sourceAudioUrl}
              controls
              className="w-full h-9"
              onPlay={() => setAbPlaying(true)}
              onPause={() => setAbPlaying(false)}
              onEnded={() => setAbPlaying(false)}
            />
            {abPlaying ? (
              <p className="text-[10px] text-mint/80 font-mono">Source playing — compare with tab preview below.</p>
            ) : null}
          </div>
        ) : null}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_220px] gap-4">
          <div className="overflow-x-auto max-h-56 overflow-y-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-xs font-mono">
              <thead className="sticky top-0 bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                <tr>
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Str</th>
                  <th className="text-left p-2">Fret</th>
                  <th className="text-left p-2">Art</th>
                  <th className="text-left p-2">Beat</th>
                  <th className="text-left p-2">Dur</th>
                  <th className="text-left p-2">MIDI</th>
                  <th className="text-left p-2">Conf</th>
                  <th className="p-2" />
                </tr>
              </thead>
              <tbody>
                {draft.notes.map((n, i) => (
                  <tr
                    key={`${i}-${n.time}-${n.string}-${n.fret}`}
                    className={
                      i === safeIndex
                        ? 'bg-mint/10 cursor-pointer'
                        : 'hover:bg-[var(--bg-elevated)]/80 cursor-pointer'
                    }
                    style={{ backgroundColor: i === safeIndex ? undefined : confColor(n.confidence) }}
                    onClick={() => setSelected(i)}
                  >
                    <td className="p-2 text-[var(--text-muted)]">{i + 1}</td>
                    <td className="p-2">{STRING_LABELS[n.string] ?? n.string}</td>
                    <td className="p-2 text-mint">{n.fret}</td>
                    <td className="p-2 text-lime-300/90">{artLabel(n.articulation)}</td>
                    <td className="p-2">{n.time.toFixed(2)}</td>
                    <td className="p-2">{n.duration.toFixed(2)}</td>
                    <td className="p-2 text-[var(--text-muted)]">{n.midi ?? '—'}</td>
                    <td className="p-2 text-[var(--text-muted)]">
                      {typeof n.confidence === 'number' ? n.confidence.toFixed(2) : '—'}
                    </td>
                    <td className="p-2">
                      <button
                        type="button"
                        className="btn-ghost !p-1"
                        aria-label={`Delete note ${i + 1}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setDraft((s) => deleteScoreNote(s, i))
                          setSelected((sel) => Math.max(0, sel >= i ? sel - 1 : sel))
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
                {noteCount === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-4 text-[var(--text-muted)]">
                      No notes — add one to start editing.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 rounded-xl border border-[var(--border)] p-3 bg-[var(--bg-elevated)]/40">
            <p className="section-title">Selected note</p>
            {current ? (
              <>
                <label className="block text-xs text-[var(--text-muted)]">
                  String
                  <select
                    className="mt-1 w-full rounded-lg bg-[var(--bg)] border border-[var(--border)] px-2 py-1.5 text-[var(--text)]"
                    value={current.string}
                    onChange={(e) => patchSelected({ string: Number(e.target.value) })}
                  >
                    {STRING_LABELS.map((lab, i) => (
                      <option key={lab} value={i}>
                        {lab} ({i === 0 ? 'high' : i === 5 ? 'low' : 'mid'})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs text-[var(--text-muted)]">
                  Fret
                  <input
                    type="number"
                    min={0}
                    max={24}
                    className="mt-1 w-full rounded-lg bg-[var(--bg)] border border-[var(--border)] px-2 py-1.5 text-[var(--text)]"
                    value={current.fret}
                    onChange={(e) => patchSelected({ fret: Number(e.target.value) })}
                  />
                </label>
                <label className="block text-xs text-[var(--text-muted)]">
                  Start beat
                  <input
                    type="number"
                    min={0}
                    step={0.25}
                    className="mt-1 w-full rounded-lg bg-[var(--bg)] border border-[var(--border)] px-2 py-1.5 text-[var(--text)]"
                    value={current.time}
                    onChange={(e) => patchSelected({ time: Number(e.target.value) })}
                  />
                </label>
                <label className="block text-xs text-[var(--text-muted)]">
                  Duration (beats)
                  <input
                    type="number"
                    min={0.05}
                    step={0.25}
                    className="mt-1 w-full rounded-lg bg-[var(--bg)] border border-[var(--border)] px-2 py-1.5 text-[var(--text)]"
                    value={current.duration}
                    onChange={(e) => patchSelected({ duration: Number(e.target.value) })}
                  />
                </label>
                <label className="block text-xs text-[var(--text-muted)]">
                  Articulation
                  <select
                    className="mt-1 w-full rounded-lg bg-[var(--bg)] border border-[var(--border)] px-2 py-1.5 text-[var(--text)]"
                    value={current.articulation ?? 'none'}
                    onChange={(e) =>
                      patchSelected({
                        articulation: e.target.value as TabScore['notes'][0]['articulation'],
                      })
                    }
                  >
                    <option value="none">None</option>
                    <option value="bend">Bend</option>
                    <option value="slide">Slide</option>
                    <option value="hammer">Hammer-on</option>
                    <option value="pull">Pull-off</option>
                  </select>
                </label>
              </>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">Select or add a note.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="section-title mb-2">Preview</p>
        <TabView score={preview} title={title || draft.title} />
      </div>
    </div>
  )
}
