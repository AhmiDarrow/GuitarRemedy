import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Fretboard } from '../components/Fretboard'
import { ScalePicker } from '../components/ScalePicker'
import { MetronomePanel } from '../components/MetronomePanel'
import { TunerPanel } from '../components/TunerPanel'
import { playScale } from '../lib/audio'
import { SCALE_LIST, SCALES, type ScaleId } from '../lib/theory'
import { useAppStore } from '../store/appStore'
import { Play, RotateCcw } from 'lucide-react'
import clsx from 'clsx'

type PracticeTab = 'tools' | 'fretboard' | 'metronome' | 'tuner'

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
  const showDegrees = useAppStore((s) => s.showDegrees)
  const setShowDegrees = useAppStore((s) => s.setShowDegrees)
  const bpm = useAppStore((s) => s.bpm)
  const setBpm = useAppStore((s) => s.setBpm)
  const recordPractice = useAppStore((s) => s.recordPractice)
  const lefty = useAppStore((s) => s.lefty)

  const scale = useMemo(() => SCALES[scaleId as ScaleId] ?? SCALES.minor_pentatonic, [scaleId])
  const rootName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][root]

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <p className="text-xs uppercase tracking-widest text-mint/80 font-semibold">Practice</p>
        <h1 className="font-display text-3xl font-bold mt-1">Practice room</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Full metronome, chromatic tuner, and fretboard lab. Left-handed: {lefty ? 'on' : 'off'}{' '}
          (Profile).
        </p>
      </div>

      <div className="flex flex-wrap gap-2 p-1 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] w-fit">
        {(
          [
            { id: 'tools' as const, label: 'Both tools' },
            { id: 'metronome' as const, label: 'Metronome' },
            { id: 'tuner' as const, label: 'Tuner' },
            { id: 'fretboard' as const, label: 'Fretboard' },
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
          <div className="card p-4 md:p-5 space-y-4">
            <ScalePicker
              root={root}
              scaleId={scale.id}
              onRootChange={setRoot}
              onScaleChange={setScaleId}
              scales={SCALE_LIST}
            />
            <div className="flex flex-wrap gap-3 items-end">
              <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
                Position box
                <select
                  className="input !py-2 !text-sm"
                  value={position ?? ''}
                  onChange={(e) =>
                    setPosition(e.target.value === '' ? null : Number(e.target.value))
                  }
                >
                  <option value="">All frets</option>
                  {[0, 1, 3, 5, 7, 9, 12].map((p) => (
                    <option key={p} value={p}>
                      From fret {p}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
                BPM
                <input
                  type="number"
                  className="input !py-2 !text-sm w-24"
                  value={bpm}
                  min={30}
                  max={300}
                  onChange={(e) => setBpm(Number(e.target.value))}
                />
              </label>
              <label className="flex items-center gap-2 text-sm pb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDegrees}
                  onChange={(e) => setShowDegrees(e.target.checked)}
                  className="accent-mint"
                />
                Show degrees
              </label>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  recordPractice()
                  void playScale(rootName, scale.id, { bpm, octaves: 1 })
                }}
              >
                <Play className="w-4 h-4" /> Play scale
              </button>
              <button type="button" className="btn-ghost" onClick={() => setPosition(null)}>
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          <Fretboard scale={scale} root={root} position={position} showDegrees={showDegrees} />

          <div className="grid sm:grid-cols-3 gap-3">
            {['Ascend slowly', 'Skip strings', 'Root only then fill'].map((tip) => (
              <div key={tip} className="card p-4 text-sm text-[var(--text-muted)]">
                <span className="text-mint font-medium">Drill · </span>
                {tip}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
