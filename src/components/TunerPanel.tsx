import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Mic, MicOff, Volume2, Waves } from 'lucide-react'
import clsx from 'clsx'
import {
  DEFAULT_RMS_GATE,
  GUITAR_OPEN_MIDI,
  GUITAR_STRING_LABELS,
  pushHistory,
  startLiveTuner,
  type TunerReading,
  type TunerStopHandle,
} from '../lib/tuner'
import { playMidiNote } from '../lib/audio'
import { useAppStore } from '../store/appStore'

const empty: TunerReading = {
  hz: 0,
  confidence: 0,
  midi: -1,
  noteName: '—',
  octave: 0,
  cents: 0,
  targetHz: 0,
  inTune: false,
  stringIndex: null,
  level: 0,
  lock: 0,
  phase: 0,
  clarity: 0,
}

/** Map cents (−50..+50) → needle angle (−48..+48 deg). */
function centsToAngle(cents: number): number {
  const c = Math.max(-50, Math.min(50, cents))
  return (c / 50) * 48
}

function sparklinePath(hist: number[], w: number, h: number): string {
  if (hist.length < 2) return ''
  const mid = h / 2
  const step = w / Math.max(1, hist.length - 1)
  return hist
    .map((c, i) => {
      const x = i * step
      const y = mid - (Math.max(-50, Math.min(50, c)) / 50) * (h * 0.42)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

/** Classic strobe bands — drift speed tracks phase error. */
function StrobeDisplay({
  phase,
  cents,
  active,
  inTune,
}: {
  phase: number
  cents: number
  active: boolean
  inTune: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phaseRef = useRef(0)
  const centsRef = useRef(0)
  const rafRef = useRef(0)
  const offsetRef = useRef(0)

  useEffect(() => {
    phaseRef.current = phase
    centsRef.current = cents
  }, [phase, cents])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let alive = true
    let last = performance.now()

    const draw = (now: number) => {
      if (!alive) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const dpr = window.devicePixelRatio || 1
      const cssW = canvas.clientWidth || 280
      const cssH = canvas.clientHeight || 56
      const w = Math.floor(cssW * dpr)
      const h = Math.floor(cssH * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }

      // Drift: phase error + cents pull the pattern (frozen when in tune)
      const err = active ? phaseRef.current + centsRef.current / 200 : 0
      const speed = inTune ? 0 : err * 420
      offsetRef.current = (offsetRef.current + speed * dt * dpr) % (w || 1)

      ctx.clearRect(0, 0, w, h)
      // Forest void base
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, 'rgba(3,12,8,0.95)')
      bg.addColorStop(1, 'rgba(6,22,14,0.98)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      const band = Math.max(6, Math.floor(10 * dpr))
      const shift = offsetRef.current
      for (let x = -band * 2; x < w + band * 2; x += band) {
        const px = x + shift
        const on = Math.floor((x + band * 20) / band) % 2 === 0
        if (!on) continue
        const g = ctx.createLinearGradient(px, 0, px + band, 0)
        if (inTune) {
          g.addColorStop(0, 'rgba(200,245,96,0.05)')
          g.addColorStop(0.5, 'rgba(200,245,96,0.55)')
          g.addColorStop(1, 'rgba(200,245,96,0.05)')
        } else {
          g.addColorStop(0, 'rgba(93,255,176,0.04)')
          g.addColorStop(0.5, 'rgba(93,255,176,0.42)')
          g.addColorStop(1, 'rgba(93,255,176,0.04)')
        }
        ctx.fillStyle = g
        ctx.fillRect(px, 0, band * 0.72, h)
      }

      // Center lock line
      ctx.fillStyle = inTune ? 'rgba(200,245,96,0.85)' : 'rgba(184,212,196,0.35)'
      ctx.fillRect(w / 2 - dpr, 0, dpr * 2, h)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      alive = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [active, inTune])

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1">
          <Waves className="w-3 h-3 text-mint/80" /> Strobe
        </span>
        <span className="tabular-nums normal-case tracking-normal">
          {active
            ? inTune
              ? 'locked'
              : `phase ${(phase >= 0 ? '+' : '')}${(phase * 100).toFixed(0)}%`
            : 'idle'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-14 rounded-xl border border-mint/20 bg-[rgba(3,12,8,0.9)]"
        aria-label="Tuner strobe display"
      />
    </div>
  )
}

function Meter({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  const v = Math.max(0, Math.min(1, value))
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        <span>{label}</span>
        <span className="tabular-nums">{Math.round(v * 100)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[rgba(26,58,44,0.85)] overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-100"
          style={{ width: `${v * 100}%`, background: color }}
        />
      </div>
    </div>
  )
}

export function TunerPanel() {
  const a4 = useAppStore((s) => s.a4)
  const setA4 = useAppStore((s) => s.setA4)
  const recordPractice = useAppStore((s) => s.recordPractice)

  const [reading, setReading] = useState<TunerReading>(empty)
  const [live, setLive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stopFn, setStopFn] = useState<TunerStopHandle | null>(null)
  const [history, setHistory] = useState<number[]>([])
  const [displayCents, setDisplayCents] = useState(0)
  const [focusString, setFocusString] = useState<number | null>(null)
  const [guitarTemp, setGuitarTemp] = useState(true)
  const [rmsGate, setRmsGate] = useState(DEFAULT_RMS_GATE)
  const [calibrating, setCalibrating] = useState(false)
  const [calNote, setCalNote] = useState<string | null>(null)
  const targetCents = useRef(0)
  const rafSmooth = useRef(0)

  useEffect(() => {
    targetCents.current =
      reading.hz > 0 || (reading.lock ?? 0) > 0.2 ? reading.cents : 0
  }, [reading.cents, reading.hz, reading.lock])

  useEffect(() => {
    let active = true
    const loop = () => {
      if (!active) return
      setDisplayCents((prev) => {
        const t = targetCents.current
        const next = prev + (t - prev) * 0.22
        return Math.abs(next - t) < 0.05 ? t : next
      })
      rafSmooth.current = requestAnimationFrame(loop)
    }
    rafSmooth.current = requestAnimationFrame(loop)
    return () => {
      active = false
      cancelAnimationFrame(rafSmooth.current)
    }
  }, [])

  const onReading = useCallback((r: TunerReading) => {
    setReading(r)
    if (r.hz > 0 || (r.lock ?? 0) > 0.15) {
      setHistory((h) => pushHistory(h, r.cents, 72))
    }
  }, [])

  const stop = useCallback(() => {
    stopFn?.()
    setStopFn(null)
    setLive(false)
    setReading(empty)
    setHistory([])
    targetCents.current = 0
    setCalNote(null)
  }, [stopFn])

  const start = useCallback(async () => {
    setError(null)
    setCalNote(null)
    try {
      recordPractice()
      const stopHandle = (await startLiveTuner(onReading, {
        a4,
        rmsGate,
        focusString,
        guitarTemperament: guitarTemp,
      })) as TunerStopHandle
      setStopFn(() => stopHandle)
      setLive(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Microphone permission denied')
      setLive(false)
    }
  }, [a4, focusString, guitarTemp, onReading, recordPractice, rmsGate])

  useEffect(() => {
    return () => {
      stopFn?.()
    }
  }, [stopFn])

  // Push focus / temperament / gate into live session without full restart when possible
  useEffect(() => {
    if (!live || !stopFn) return
    stopFn.setFocusString?.(focusString)
  }, [focusString, live, stopFn])

  useEffect(() => {
    if (!live || !stopFn) return
    stopFn.setRmsGate?.(rmsGate)
  }, [live, rmsGate, stopFn])

  // Restart mic path if A4 or temperament changes while live
  useEffect(() => {
    if (!live) return
    void (async () => {
      stopFn?.()
      try {
        const stopHandle = (await startLiveTuner(onReading, {
          a4,
          rmsGate,
          focusString,
          guitarTemperament: guitarTemp,
        })) as TunerStopHandle
        setStopFn(() => stopHandle)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Mic error')
        setLive(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a4, guitarTemp])

  const calibrate = useCallback(async () => {
    if (!live || !stopFn?.calibrateNoiseFloor) {
      setError('Start the mic first, then calibrate in a quiet room.')
      return
    }
    setCalibrating(true)
    setCalNote(null)
    setError(null)
    try {
      const gate = await stopFn.calibrateNoiseFloor(1)
      setRmsGate(gate)
      setCalNote(`Noise floor set · gate ${gate.toFixed(4)}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calibrate failed')
    } finally {
      setCalibrating(false)
    }
  }, [live, stopFn])

  const angle = centsToAngle(displayCents)
  const inTune =
    Math.abs(displayCents) <= 5 && (reading.hz > 0 || (reading.lock ?? 0) > 0.25)
  const level = reading.level ?? 0
  const lock = reading.lock ?? 0
  const conf = reading.confidence
  const clarity = reading.clarity ?? conf
  const phase = reading.phase ?? 0
  const spark = useMemo(() => sparklinePath(history, 280, 48), [history])
  const strobeActive = live && (reading.hz > 0 || lock > 0.2)

  const statusLabel =
    reading.noteName === '—'
      ? live
        ? calibrating
          ? 'Stay quiet — sampling room…'
          : 'Play a sustained note…'
        : 'Start mic to tune'
      : inTune
        ? 'In tune'
        : displayCents > 0
          ? 'Sharp — ease tension'
          : 'Flat — tighten up'

  return (
    <div className="card p-4 md:p-5 space-y-4 overflow-hidden relative">
      {live && (
        <div
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl transition-opacity duration-500"
          style={{
            opacity: 0.12 + level * 0.35 + (inTune ? 0.2 : 0),
            background: inTune
              ? 'radial-gradient(circle, rgba(200,245,96,0.9), transparent 70%)'
              : 'radial-gradient(circle, rgba(93,255,176,0.75), transparent 70%)',
          }}
        />
      )}

      <div className="flex items-start justify-between gap-3 relative">
        <div>
          <p className="text-xs uppercase tracking-widest text-mint/80 font-semibold">Tuner</p>
          <h2 className="font-display text-xl font-bold mt-0.5">YIN + MPM · strobe</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Worklet · downsample · string clamp · ±5¢ · noise calibrate
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            className="btn-ghost text-xs min-w-[6.5rem]"
            disabled={!live || calibrating}
            onClick={() => void calibrate()}
            title="1s quiet room sample sets the RMS gate"
          >
            {calibrating ? 'Sampling…' : 'Calibrate'}
          </button>
          <button
            type="button"
            className={clsx(live ? 'btn-ghost' : 'btn-primary', 'min-w-[7rem]', live && 'pulse-glow')}
            onClick={() => void (live ? stop() : start())}
          >
            {live ? (
              <>
                <MicOff className="w-4 h-4" /> Stop
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" /> Listen
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-rose/90 bg-rose/10 border border-rose/25 rounded-xl px-3 py-2 relative">
          {error}
          {error.toLowerCase().includes('mic') || error.toLowerCase().includes('permission')
            ? '. Allow microphone access, then try again.'
            : ''}
        </p>
      )}
      {calNote && (
        <p className="text-xs text-mint/90 bg-mint/10 border border-mint/25 rounded-xl px-3 py-2">
          {calNote}
        </p>
      )}

      {/* Arc gauge */}
      <div className="relative flex flex-col items-center pt-1 pb-2">
        <svg viewBox="0 0 240 140" className="w-full max-w-sm drop-shadow-lg" aria-hidden>
          <defs>
            <linearGradient id="tunerArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="35%" stopColor="#5dffb0" />
              <stop offset="50%" stopColor="#c8f560" />
              <stop offset="65%" stopColor="#5dffb0" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
            <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M 28 118 A 92 92 0 0 1 212 118"
            fill="none"
            stroke="rgba(26,58,44,0.95)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 28 118 A 92 92 0 0 1 212 118"
            fill="none"
            stroke="url(#tunerArc)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity={0.55 + conf * 0.35}
          />

          {[-40, -20, -10, 0, 10, 20, 40].map((c) => {
            const deg = (c / 50) * 48
            return (
              <line
                key={c}
                x1={120}
                y1={c === 0 ? 28 : 32}
                x2={120}
                y2={c === 0 ? 42 : 38}
                stroke={c === 0 ? '#c8f560' : 'rgba(184,212,196,0.45)'}
                strokeWidth={c === 0 ? 2.5 : 1.5}
                transform={`rotate(${deg} 120 118)`}
              />
            )
          })}

          <circle
            cx="120"
            cy="118"
            r={18 + level * 22}
            fill={inTune ? 'rgba(200,245,96,0.12)' : 'rgba(93,255,176,0.08)'}
            className="transition-all duration-100"
          />

          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '120px 118px',
              transition: 'transform 0.05s linear',
            }}
            filter="url(#needleGlow)"
          >
            <line
              x1="120"
              y1="118"
              x2="120"
              y2="36"
              stroke={inTune ? '#c8f560' : '#5dffb0'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="120" cy="118" r="8" fill={inTune ? '#c8f560' : '#5dffb0'} />
            <circle cx="120" cy="118" r="3.5" fill="#030705" />
          </g>

          {inTune && (
            <circle
              cx="120"
              cy="70"
              r="26"
              fill="none"
              stroke="#c8f560"
              strokeWidth="2"
              opacity="0.7"
              className="tuner-ring-pulse"
            />
          )}
        </svg>

        <div className="-mt-6 flex flex-col items-center gap-1 z-10">
          <div
            className={clsx(
              'font-display text-6xl md:text-7xl font-bold tracking-tight transition-all duration-200',
              inTune ? 'text-lime scale-105' : 'text-[var(--text)]',
              live && reading.noteName !== '—' && 'tuner-note-breathe',
            )}
            style={{
              textShadow: inTune
                ? '0 0 28px rgba(200,245,96,0.55)'
                : reading.hz > 0
                  ? '0 0 18px rgba(93,255,176,0.25)'
                  : 'none',
            }}
          >
            {reading.noteName}
            {reading.midi >= 0 && (
              <span className="text-2xl md:text-3xl text-[var(--text-muted)] ml-1 font-semibold">
                {reading.octave}
              </span>
            )}
          </div>

          <div
            className={clsx(
              'text-sm font-medium tabular-nums transition-colors',
              inTune
                ? 'text-lime'
                : displayCents > 3
                  ? 'text-rose'
                  : displayCents < -3
                    ? 'text-teal'
                    : 'text-[var(--text-muted)]',
            )}
          >
            {reading.noteName !== '—' ? (
              <>
                {displayCents > 0 ? '+' : ''}
                {displayCents.toFixed(1)} ¢
                {reading.hz > 0 && (
                  <span className="text-[var(--text-muted)] font-normal">
                    {' '}
                    · {reading.hz.toFixed(1)} Hz
                  </span>
                )}
              </>
            ) : (
              statusLabel
            )}
          </div>
          {reading.noteName !== '—' && (
            <p className="text-xs text-[var(--text-muted)]">{statusLabel}</p>
          )}
        </div>
      </div>

      <StrobeDisplay
        phase={phase}
        cents={displayCents}
        active={strobeActive}
        inTune={inTune}
      />

      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto w-full">
        <Meter label="Signal" value={level} color="#5dffb0" />
        <Meter label="Clarity" value={clarity} color="#2dd4a8" />
        <Meter label="Lock" value={lock} color="#c8f560" />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[rgba(3,12,8,0.45)] p-2.5">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1.5">
          Cents history
        </p>
        <svg viewBox="0 0 280 48" className="w-full h-12" aria-hidden>
          <line
            x1="0"
            y1="24"
            x2="280"
            y2="24"
            stroke="rgba(200,245,96,0.25)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {spark && (
            <path
              d={spark}
              fill="none"
              stroke={inTune ? '#c8f560' : '#5dffb0'}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      {/* Open strings + focus clamp */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
            Open strings · tap to hear · hold focus
          </p>
          <button
            type="button"
            className={clsx(
              'text-[10px] px-2 py-0.5 rounded-lg border transition-colors',
              focusString == null
                ? 'border-mint/40 bg-mint/15 text-mint'
                : 'border-[var(--border)] text-[var(--text-muted)] hover:border-mint/30',
            )}
            onClick={() => setFocusString(null)}
          >
            Chromatic
          </button>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {GUITAR_STRING_LABELS.map((label, i) => {
            const active = reading.stringIndex === i
            const focused = focusString === i
            return (
              <button
                key={label}
                type="button"
                className={clsx(
                  'rounded-xl border px-1 py-2 text-center transition-all',
                  focused && 'ring-2 ring-lime/70 border-lime/50 bg-lime/10',
                  !focused && active && inTune && 'border-lime/50 bg-lime/15 text-lime',
                  !focused && active && !inTune && 'border-mint/40 bg-mint/10 text-mint',
                  !focused && !active && 'border-[var(--border)] hover:border-mint/30',
                )}
                onClick={() => {
                  setFocusString((prev) => (prev === i ? null : i))
                  void playMidiNote(GUITAR_OPEN_MIDI[i], a4, 0.45)
                }}
                title={`Focus ${label} (± band) · play reference`}
              >
                <span className="block text-xs font-semibold">{label}</span>
                <span className="block text-[9px] text-[var(--text-muted)] mt-0.5">
                  {i + 1}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[var(--border)]">
        <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          A4
          <input
            type="number"
            min={415}
            max={466}
            value={a4}
            onChange={(e) => setA4(Number(e.target.value) || 440)}
            className="w-16 rounded-lg bg-[rgba(3,12,8,0.6)] border border-[var(--border)] px-2 py-1 text-[var(--text)] tabular-nums"
          />
        </label>
        <label className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer">
          <input
            type="checkbox"
            checked={guitarTemp}
            onChange={(e) => setGuitarTemp(e.target.checked)}
            className="rounded border-mint/40"
          />
          Steel bias
        </label>
        <span className="text-[10px] text-[var(--text-muted)] tabular-nums ml-auto">
          gate {rmsGate.toFixed(4)}
        </span>
        <button
          type="button"
          className="btn-ghost text-xs py-1.5"
          onClick={() => void playMidiNote(69, a4, 0.6)}
          title="Play A4 reference"
        >
          <Volume2 className="w-3.5 h-3.5" /> A4
        </button>
      </div>
    </div>
  )
}
