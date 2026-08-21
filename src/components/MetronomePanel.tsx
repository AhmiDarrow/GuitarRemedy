import { useCallback, useEffect, useRef, useState } from 'react'
import { Minus, Plus, Play, Square } from 'lucide-react'
import clsx from 'clsx'
import {
  bpmFromTaps,
  clampBpm,
  startMetronome,
  stopMetronome,
  type ClickKind,
  type Subdivision,
  type TimeBeats,
} from '../lib/metronome'
import { useAppStore } from '../store/appStore'

const BEATS: TimeBeats[] = [2, 3, 4, 5, 6, 7]
const SUBS: { v: Subdivision; label: string }[] = [
  { v: 1, label: 'Quarter' },
  { v: 2, label: 'Eighth' },
  { v: 3, label: 'Triplet' },
  { v: 4, label: '16th' },
]

export function MetronomePanel() {
  const bpm = useAppStore((s) => s.bpm)
  const setBpm = useAppStore((s) => s.setBpm)
  const beats = useAppStore((s) => s.timeSignatureBeats) as TimeBeats
  const setBeats = useAppStore((s) => s.setTimeSignatureBeats)
  const sub = useAppStore((s) => s.metronomeSubdivision) as Subdivision
  const setSub = useAppStore((s) => s.setMetronomeSubdivision)
  const accent = useAppStore((s) => s.metronomeAccent)
  const setAccent = useAppStore((s) => s.setMetronomeAccent)
  const countInBars = useAppStore((s) => s.metronomeCountInBars)
  const setCountInBars = useAppStore((s) => s.setMetronomeCountInBars)
  const setMetronomeOn = useAppStore((s) => s.setMetronomeOn)
  const recordPractice = useAppStore((s) => s.recordPractice)

  const [running, setRunning] = useState(false)
  const [pulse, setPulse] = useState(0)
  const [kind, setKind] = useState<ClickKind>('beat')
  const [countingIn, setCountingIn] = useState(false)
  const taps = useRef<number[]>([])

  const stop = useCallback(async () => {
    await stopMetronome()
    setRunning(false)
    setMetronomeOn(false)
    setPulse(0)
    setCountingIn(false)
  }, [setMetronomeOn])

  const start = useCallback(async () => {
    recordPractice()
    await startMetronome(
      {
        bpm: clampBpm(bpm),
        beatsPerBar: ([2, 3, 4, 5, 6, 7].includes(beats) ? beats : 4) as TimeBeats,
        subdivision: ([1, 2, 3, 4].includes(sub) ? sub : 1) as Subdivision,
        accent,
        countInBars: Math.max(0, Math.min(4, countInBars || 0)),
      },
      {
        onBeat: (info) => {
          setPulse(info.barBeat)
          setKind(info.kind)
          setCountingIn(Boolean(info.countingIn))
        },
      },
    )
    setRunning(true)
    setMetronomeOn(true)
  }, [accent, beats, bpm, countInBars, recordPractice, setMetronomeOn, sub])

  // Restart when settings change while running
  useEffect(() => {
    if (!running) return
    void start()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-sync params
  }, [bpm, beats, sub, accent, countInBars])

  useEffect(() => {
    return () => {
      void stopMetronome()
    }
  }, [])

  const tapTempo = () => {
    const now = performance.now()
    taps.current = [...taps.current.filter((t) => now - t < 3000), now].slice(-8)
    const est = bpmFromTaps(taps.current)
    if (est != null) setBpm(est)
  }

  const safeBeats = Math.max(2, Math.min(8, beats || 4))

  return (
    <div className="card p-4 md:p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-mint/80 font-semibold">Metronome</p>
          <h2 className="font-display text-xl font-bold mt-0.5">Keep time</h2>
        </div>
        <button
          type="button"
          className={clsx(running ? 'btn-ghost' : 'btn-primary', 'min-w-[7rem]')}
          onClick={() => void (running ? stop() : start())}
        >
          {running ? (
            <>
              <Square className="w-4 h-4" /> Stop
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: safeBeats }, (_, i) => (
          <div
            key={i}
            className={clsx(
              'h-3 rounded-full transition-all duration-75',
              i === pulse && running
                ? kind === 'accent'
                  ? 'w-8 bg-lime shadow-lg shadow-lime/40'
                  : countingIn
                    ? 'w-6 bg-teal shadow-md shadow-teal/30'
                    : 'w-6 bg-mint shadow-md shadow-mint/30'
                : 'w-4 bg-[var(--border)]',
            )}
          />
        ))}
        {countingIn && running ? (
          <span className="text-[10px] uppercase tracking-wider text-teal font-semibold ml-1">
            Count-in
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[var(--text-muted)]">BPM</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-ghost !px-2 !py-2"
              onClick={() => setBpm(bpm - 1)}
              aria-label="Slower"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              className="input !py-2 !text-lg font-display font-bold w-20 text-center"
              value={bpm}
              min={30}
              max={300}
              onChange={(e) => setBpm(Number(e.target.value))}
            />
            <button
              type="button"
              className="btn-ghost !px-2 !py-2"
              onClick={() => setBpm(bpm + 1)}
              aria-label="Faster"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <input
            type="range"
            min={40}
            max={220}
            value={Math.min(220, Math.max(40, bpm))}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-48 accent-mint mt-1"
          />
        </div>

        <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
          Time
          <select
            className="input !py-2 !text-sm"
            value={safeBeats}
            onChange={(e) => setBeats(Number(e.target.value))}
          >
            {BEATS.map((b) => (
              <option key={b} value={b}>
                {b}/4
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
          Subdivision
          <select
            className="input !py-2 !text-sm"
            value={sub}
            onChange={(e) => setSub(Number(e.target.value))}
          >
            {SUBS.map((s) => (
              <option key={s.v} value={s.v}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm pb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={accent}
            onChange={(e) => setAccent(e.target.checked)}
            className="accent-mint"
          />
          Accent 1
        </label>

        <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
          Count-in
          <select
            className="input !py-2 !text-sm"
            value={countInBars}
            onChange={(e) => setCountInBars(Number(e.target.value))}
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? 'None' : `${n} bar${n > 1 ? 's' : ''}`}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="btn-ghost !py-2" onClick={tapTempo}>
          Tap tempo
        </button>
      </div>
    </div>
  )
}
