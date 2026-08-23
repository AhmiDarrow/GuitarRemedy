import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Fretboard } from '../components/Fretboard'
import { ScalePicker } from '../components/ScalePicker'
import { MetronomePanel } from '../components/MetronomePanel'
import { TunerPanel } from '../components/TunerPanel'
import {
  midisToPitchClasses,
  playScale,
  stopAllNotes,
} from '../lib/audio'
import {
  NOTE_NAMES,
  SCALES,
  type ScaleId,
} from '../lib/theory'
import { useAppStore } from '../store/appStore'
import {
  ArrowDownUp,
  Gauge,
  Play,
  RotateCcw,
  Square,
} from 'lucide-react'
import clsx from 'clsx'

type PracticeTab = 'tools' | 'fretboard' | 'metronome' | 'tuner'

const POSITION_PRESETS: { fret: number | null; label: string; hint: string }[] = [
  { fret: null, label: 'All', hint: 'Full neck' },
  { fret: 0, label: 'Open', hint: 'Open position' },
  { fret: 3, label: '3', hint: 'From fret 3' },
  { fret: 5, label: '5', hint: 'From fret 5' },
  { fret: 7, label: '7', hint: 'From fret 7' },
  { fret: 9, label: '9', hint: 'From fret 9' },
  { fret: 12, label: '12', hint: 'From fret 12' },
]

export function PracticePage() {
  const location = useLocation()
  const [tab, setTab] = useState<PracticeTab>('tools')

  useEffect(() => {
    const tool = (location.state as { tool?: string } | null)?.tool
    if (tool === 'metronome' || tool === 'tuner') setTab(tool)
    else if (tool === 'fretboard') setTab('fretboard')
    else if (tool === 'tools') setTab('tools')
  }, [location.state])

  const [root, setRoot] = useState(9) // A
  const [scaleId, setScaleId] = useState<string>('minor_pentatonic')
  const [position, setPosition] = useState<number | null>(null)
  const [octaves, setOctaves] = useState(1)
  const [playDown, setPlayDown] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [activePcs, setActivePcs] = useState<number[]>([])
  const playGen = useRef(0)

  const showDegrees = useAppStore((s) => s.showDegrees)
  const setShowDegrees = useAppStore((s) => s.setShowDegrees)
  const bpm = useAppStore((s) => s.bpm)
  const setBpm = useAppStore((s) => s.setBpm)
  const a4 = useAppStore((s) => s.a4)
  const recordPractice = useAppStore((s) => s.recordPractice)
  const lefty = useAppStore((s) => s.lefty)
  const tuningName = useAppStore((s) => s.tuningName)
  const getTuning = useAppStore((s) => s.getTuning)
  const tuning = useMemo(() => getTuning(), [getTuning, tuningName])

  const scale = useMemo(
    () => SCALES[scaleId as ScaleId] ?? SCALES.minor_pentatonic,
    [scaleId],
  )
  const rootName = NOTE_NAMES[root] ?? 'A'

  const stopLab = useCallback(() => {
    playGen.current += 1
    stopAllNotes()
    setPlaying(false)
    setActivePcs([])
  }, [])

  // Hard-stop when the lab selection changes mid-play.
  useEffect(() => {
    stopLab()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when scale/root/position change
  }, [root, scaleId, position, octaves])

  useEffect(() => () => stopLab(), [stopLab])

  const onPlay = useCallback(async () => {
    if (playing) {
      stopLab()
      return
    }
    const gen = ++playGen.current
    setPlaying(true)
    setActivePcs([])
    recordPractice()
    try {
      await playScale(rootName, scale.id, {
        bpm,
        octaves,
        reverse: playDown,
        a4,
        onNotes: (ev) => {
          if (gen !== playGen.current) return
          setActivePcs(midisToPitchClasses(ev.midis))
        },
      })
    } finally {
      if (gen === playGen.current) {
        setPlaying(false)
        setActivePcs([])
      }
    }
  }, [
    playing,
    stopLab,
    recordPractice,
    rootName,
    scale.id,
    bpm,
    octaves,
    playDown,
    a4,
  ])

  const resetLab = () => {
    stopLab()
    setPosition(null)
    setOctaves(1)
    setPlayDown(true)
    setRoot(9)
    setScaleId('minor_pentatonic')
  }

  const openNames = useMemo(() => {
    const t = tuning?.length === 6 ? tuning : [40, 45, 50, 55, 59, 64]
    // theory low→high; display high→low labels for the legend
    return [...t]
      .reverse()
      .map((m) => (NOTE_NAMES[((m % 12) + 12) % 12] ?? '?'))
      .join(' ')
  }, [tuning])

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <p className="text-xs uppercase tracking-widest text-mint/80 font-semibold">
          Practice
        </p>
        <h1 className="font-display text-3xl font-bold mt-1">Practice room</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Metronome, chromatic tuner, and fretboard lab. Left-handed:{' '}
          {lefty ? 'on' : 'off'} (Profile).
        </p>
      </div>

      <div className="flex flex-wrap gap-2 p-1 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] w-fit">
        {(
          [
            { id: 'tools' as const, label: 'Both tools' },
            { id: 'metronome' as const, label: 'Metronome' },
            { id: 'tuner' as const, label: 'Tuner' },
            { id: 'fretboard' as const, label: 'Fretboard lab' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            className={clsx(
              'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              tab === t.id
                ? 'bg-mint/20 text-mint border border-mint/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]',
            )}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(tab === 'tools' || tab === 'metronome' || tab === 'tuner') && (
        <div
          className={clsx(
            'grid gap-4',
            tab === 'tools' ? 'lg:grid-cols-2' : 'max-w-xl',
          )}
        >
          {(tab === 'tools' || tab === 'metronome') && <MetronomePanel />}
          {(tab === 'tools' || tab === 'tuner') && <TunerPanel />}
        </div>
      )}

      {tab === 'fretboard' && (
        <>
          <div className="card p-4 md:p-5 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-mint/70 font-semibold">
                  Fretboard lab
                </p>
                <h2 className="font-display text-xl font-bold mt-0.5">
                  {rootName} {scale.name}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xl">
                  {scale.category === 'mode'
                    ? 'Mode colors — tap frets or Play to walk the pattern.'
                    : scale.category === 'pentatonic'
                      ? 'Five-note box shapes. Tap frets or Play to walk the neck.'
                      : scale.category === 'scale'
                        ? 'Full diatonic map. Tap frets or Play to walk the neck.'
                        : 'Tap a lit fret to hear it. Play walks the scale on the neck.'}
                </p>
              </div>
              <div className="text-right text-[11px] font-mono text-mint/80 space-y-0.5">
                <div>
                  Degrees:{' '}
                  <span className="text-[var(--text)]">
                    {scale.degrees.join(' · ')}
                  </span>
                </div>
                <div className="text-[var(--text-muted)]">
                  Open (high→low): {openNames}
                </div>
              </div>
            </div>

            <ScalePicker
              root={root}
              scaleId={scale.id}
              onRoot={setRoot}
              onScale={setScaleId}
            />

            <div className="space-y-2">
              <p className="text-xs text-[var(--text-muted)]">Position box</p>
              <div className="flex flex-wrap gap-1.5">
                {POSITION_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    title={p.hint}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                      position === p.fret
                        ? 'bg-mint/20 text-mint border-mint/40'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:border-mint/30 hover:text-[var(--text)]',
                    )}
                    onClick={() => setPosition(p.fret)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Dims frets outside a 5-fret window (open strings stay lit). Good for box practice.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-end">
              <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
                BPM
                <div className="flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5 text-mint/70" />
                  <input
                    type="number"
                    className="input !py-2 !text-sm w-20"
                    value={bpm}
                    min={30}
                    max={300}
                    onChange={(e) => setBpm(Number(e.target.value))}
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
                Octaves
                <select
                  className="input !py-2 !text-sm w-24"
                  value={octaves}
                  onChange={(e) => setOctaves(Number(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </label>

              <label className="flex items-center gap-2 text-sm pb-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showDegrees}
                  onChange={(e) => setShowDegrees(e.target.checked)}
                  className="accent-mint"
                />
                Degrees
              </label>

              <label className="flex items-center gap-2 text-sm pb-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={playDown}
                  onChange={(e) => setPlayDown(e.target.checked)}
                  className="accent-mint"
                />
                <ArrowDownUp className="w-3.5 h-3.5 text-mint/80" />
                Up then down
              </label>

              <button
                type="button"
                className={clsx(playing ? 'btn-ghost border border-mint/40' : 'btn-primary')}
                onClick={() => void onPlay()}
              >
                {playing ? (
                  <>
                    <Square className="w-4 h-4" /> Stop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Play scale
                  </>
                )}
              </button>

              <button type="button" className="btn-ghost" onClick={resetLab}>
                <RotateCcw className="w-4 h-4" /> Defaults
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-[11px] text-[var(--text-muted)] border-t border-[var(--border)] pt-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-lime ring-2 ring-mint/70" />
                Root
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-mint" />
                Scale tone
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-lime ring-2 ring-white fret-dot-active" />
                Sounding
              </span>
              <span className="text-[var(--text-muted)]/80">
                A4={a4} · Profile tuning · click any lit fret
              </span>
            </div>
          </div>

          <Fretboard
            scale={scale}
            root={root}
            position={position}
            showDegrees={showDegrees}
            activePcs={playing ? activePcs : undefined}
            dimInactiveWhilePlaying
          />
        </>
      )}
    </div>
  )
}
