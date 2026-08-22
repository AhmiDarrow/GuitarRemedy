import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import type { TabScore } from '../lib/breakdown'
import { beatDurationSec, openMidiHighToLow } from '../lib/tabScore'
import {
  audioNow,
  cancelDraw,
  claimAudioSession,
  playNote,
  releaseAudioSession,
  scheduleDraw,
  stopAllNotes,
} from '../lib/audio'
import { useAppStore } from '../store/appStore'
import { Pause, Play, RotateCcw, Gauge, Square } from 'lucide-react'

type Props = {
  score: TabScore
  className?: string
  title?: string
}

function groupByTime(notes: TabScore['notes']) {
  const map = new Map<number, typeof notes>()
  for (const n of notes) {
    const t = Math.round(n.time * 1000)
    const list = map.get(t) ?? []
    list.push(n)
    map.set(t, list)
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v)
}

export function TabView({ score, className, title }: Props) {
  const [speed, setSpeed] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [cursor, setCursor] = useState(-1)
  const stopRef = useRef(false)
  const runIdRef = useRef(0)
  const endTimerRef = useRef<number | null>(null)
  // Subscribe to tuning fields so open-string fallbacks refresh when Profile changes.
  const tuningName = useAppStore((s) => s.tuningName)
  const customTuning = useAppStore((s) => s.customTuning)
  const getTuning = useAppStore((s) => s.getTuning)
  const a4 = useAppStore((s) => s.a4)
  const openMidi = useMemo(
    () => openMidiHighToLow(getTuning()),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getTuning closes over tuningName/customTuning
    [tuningName, customTuning, score],
  )

  const columns = useMemo(() => groupByTime(score.notes), [score.notes])
  const strings = score.strings || 6
  const tempo = score.tempo || 100

  const clearEndTimer = () => {
    if (endTimerRef.current != null) {
      window.clearTimeout(endTimerRef.current)
      endTimerRef.current = null
    }
  }

  const stop = () => {
    stopRef.current = true
    runIdRef.current += 1
    clearEndTimer()
    void cancelDraw(0)
    stopAllNotes()
    releaseAudioSession('tabs')
    setPlaying(false)
    setCursor(-1)
  }

  // Stop if the score changes mid-play
  useEffect(() => {
    stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score])

  useEffect(() => () => stop(), [])

  const play = async () => {
    if (playing || columns.length === 0) return
    stopRef.current = false
    const runId = ++runIdRef.current
    clearEndTimer()
    void cancelDraw(0)
    setPlaying(true)
    setCursor(0)

    await claimAudioSession('tabs')
    if (stopRef.current || runId !== runIdRef.current) return

    // Fresh opens at play-start (Profile may have changed while stopped).
    const opens = openMidiHighToLow(getTuning())
    const secPerBeat = beatDurationSec(tempo, speed)
    const base = columns[0]?.[0]?.time ?? 0
    // Schedule notes + cursor on the audio clock (Tone.now / Tone.Draw).
    const t0 = await audioNow()
    if (stopRef.current || runId !== runIdRef.current) return

    let lastOffset = 0
    for (let i = 0; i < columns.length; i++) {
      if (stopRef.current || runId !== runIdRef.current) return
      const col = columns[i]
      const offsetSec = (col[0].time - base) * secPerBeat
      lastOffset = Math.max(lastOffset, offsetSec)
      const when = t0 + 0.05 + offsetSec
      const colIndex = i
      // Cursor locked to audio schedule (Draw = rAF nearest to Tone time).
      void scheduleDraw(() => {
        if (stopRef.current || runId !== runIdRef.current) return
        setCursor(colIndex)
      }, when)

      for (const n of col) {
        // Prefer stored midi (correct absolute pitch). Fallback uses session tuning opens.
        const midi =
          typeof n.midi === 'number' && n.midi > 0
            ? n.midi
            : (opens[n.string] ?? 64) + n.fret
        const durSec = Math.max(0.08, (n.duration || 1) * secPerBeat * 0.9)
        void playNote(midi, durSec, when, { a4 })
      }
    }

    const endAt = t0 + 0.05 + lastOffset + secPerBeat
    void scheduleDraw(() => {
      if (runId !== runIdRef.current || stopRef.current) return
      stopAllNotes()
      releaseAudioSession('tabs')
      setPlaying(false)
      setCursor(-1)
    }, endAt)
    // Safety net if Draw is delayed (tab blur / background).
    const endDelay = Math.max(0, (0.05 + lastOffset + secPerBeat) * 1000 + 80)
    endTimerRef.current = window.setTimeout(() => {
      if (runId !== runIdRef.current || stopRef.current) return
      stopAllNotes()
      releaseAudioSession('tabs')
      setPlaying(false)
      setCursor(-1)
    }, endDelay)
  }

  const toggle = () => {
    if (playing) stop()
    else void play()
  }

  return (
    <div className={clsx('card overflow-hidden', className)}>
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]/50">
        <div className="font-display font-semibold text-sm flex-1 min-w-0 truncate">
          {title || score.title || 'Tablature'}
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-mint"
            aria-label="Playback speed"
            disabled={playing}
          />
          <span className="text-xs font-mono text-[var(--text-muted)] w-10">
            {Math.round(speed * 100)}%
          </span>
        </div>
        <button
          type="button"
          className="btn-secondary !py-1.5 !px-3 text-xs"
          onClick={() => void toggle()}
          disabled={columns.length === 0}
          aria-label={playing ? 'Stop playback' : 'Play tab'}
        >
          {playing ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {playing ? 'Stop' : 'Play'}
        </button>
        {playing ? (
          <button
            type="button"
            className="btn-ghost !py-1.5 !px-2"
            onClick={stop}
            aria-label="Pause"
            title="Stop"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : null}
        <button
          type="button"
          className="btn-ghost !py-1.5 !px-2"
          onClick={stop}
          aria-label="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto p-4 font-mono text-sm leading-7 select-none">
        {columns.length === 0 ? (
          <p className="text-[var(--text-muted)] text-sm">No notes to display.</p>
        ) : (
          <div className="inline-block min-w-full">
            {Array.from({ length: strings }, (_, s) => (
              <div key={s} className="flex items-center whitespace-nowrap">
                <span className="w-6 text-[var(--text-muted)] text-xs shrink-0">
                  {['e', 'B', 'G', 'D', 'A', 'E'][s] ?? s + 1}
                </span>
                <span className="text-[rgba(93,255,176,0.22)]">|</span>
                {columns.map((col, ci) => {
                  const note = col.find((n) => n.string === s)
                  const active = ci === cursor
                  return (
                    <span
                      key={ci}
                      className={clsx(
                        'inline-block w-8 text-center border-b border-[rgba(93,255,176,0.18)]',
                        active && 'bg-mint/20 text-mint rounded',
                      )}
                    >
                      {note ? note.fret : '—'}
                    </span>
                  )
                })}
                <span className="text-mint/25">|</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-3 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
        {score.tempo ? <span>♩ = {score.tempo}</span> : null}
        {score.timeSig ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-mint/25 bg-mint/10 px-1.5 py-0.5 font-mono text-[11px] text-mint">
            {score.timeSig[0]}/{score.timeSig[1]}
          </span>
        ) : null}
        {score.key ? <span>· Key hint: {score.key}</span> : null}
        <span>
          · {columns.length} hits · ~
          {Math.max(
            1,
            Math.round(((columns[columns.length - 1]?.[0]?.time ?? 0) + 1) * (60 / tempo)),
          )}
          s
        </span>
      </div>
    </div>
  )
}
