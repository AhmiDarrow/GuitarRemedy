import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2, Save, Sparkles, X } from 'lucide-react'
import type { TabScore } from '../lib/breakdown'
import {
  cleanUpScore,
  deleteScoreNote,
  insertScoreNote,
  setScoreTempo,
  updateScoreNote,
  type NotePatch,
} from '../lib/tabEdit'
import { TabView } from './TabView'

type Props = {
  score: TabScore
  title?: string
  onSave: (score: TabScore) => void
  onCancel?: () => void
  className?: string
}

const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E']

export function TabEditor({ score: initial, title, onSave, onCancel, className }: Props) {
  const [draft, setDraft] = useState<TabScore>(() => ({
    ...initial,
    notes: initial.notes.map((n) => ({ ...n })),
  }))
  const [selected, setSelected] = useState(0)

  const noteCount = draft.notes.length
  const safeIndex = noteCount === 0 ? -1 : Math.min(selected, noteCount - 1)
  const current = safeIndex >= 0 ? draft.notes[safeIndex] : null

  const preview = useMemo(() => draft, [draft])

  const patchSelected = (patch: NotePatch) => {
    if (safeIndex < 0) return
    setDraft((s) => updateScoreNote(s, safeIndex, patch))
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
            title="Drop ghosts, quantize to 8ths, merge dups, re-fret for playability"
            onClick={() => {
              setDraft((s) => cleanUpScore(s))
              setSelected(0)
            }}
            disabled={noteCount === 0}
          >
            <Sparkles className="w-3.5 h-3.5" /> Clean up
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
          Fix frets, strings, beat time, and duration after convert. <strong className="text-mint font-medium">Clean up</strong> snaps
          timing, drops blips, and re-maps frets for a playable hand path — then save to Your tabs.
        </p>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_220px] gap-4">
          <div className="overflow-x-auto max-h-56 overflow-y-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-xs font-mono">
              <thead className="sticky top-0 bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                <tr>
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Str</th>
                  <th className="text-left p-2">Fret</th>
                  <th className="text-left p-2">Beat</th>
                  <th className="text-left p-2">Dur</th>
                  <th className="text-left p-2">MIDI</th>
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
                    onClick={() => setSelected(i)}
                  >
                    <td className="p-2 text-[var(--text-muted)]">{i + 1}</td>
                    <td className="p-2">{STRING_LABELS[n.string] ?? n.string}</td>
                    <td className="p-2 text-mint">{n.fret}</td>
                    <td className="p-2">{n.time.toFixed(2)}</td>
                    <td className="p-2">{n.duration.toFixed(2)}</td>
                    <td className="p-2 text-[var(--text-muted)]">{n.midi ?? '—'}</td>
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
                    <td colSpan={7} className="p-4 text-[var(--text-muted)]">
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
