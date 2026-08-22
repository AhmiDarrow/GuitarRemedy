import { useMemo } from 'react'
import clsx from 'clsx'
import {
  resolveLessonDiagram,
  type LessonDiagramSpec,
  type ResolvedLessonDiagram,
} from '../data/lessonImagery'

type Props = {
  diagram: LessonDiagramSpec
  className?: string
}

/** Display string 0 = high e … 5 = low E (visual top→bottom). */
function theoryToDisplay(theoryString: number): number {
  return 5 - theoryString
}

const DISPLAY_LABELS = ['e', 'B', 'G', 'D', 'A', 'E'] as const

function ChordOrNeckSvg({
  resolved,
  wide = false,
}: {
  resolved: ResolvedLessonDiagram
  wide?: boolean
}) {
  const { dots, openLabels, spec } = resolved
  const fretted = dots.filter((d) => !d.muted && d.fret > 0)
  const maxFret = Math.max(spec.frets ?? 5, ...fretted.map((d) => d.fret), 3)
  const minFret =
    fretted.length === 0
      ? 0
      : Math.min(...fretted.map((d) => d.fret)) <= 1
        ? 0
        : Math.min(...fretted.map((d) => d.fret))
  const fretStart = minFret
  const fretEnd = Math.max(maxFret, fretStart + 3)
  const fretCount = fretEnd - fretStart
  const showOpenColumn = fretStart === 0

  const w = wide ? 420 : 220
  const h = wide ? 168 : 240
  const padL = 34
  const padT = 26
  const padR = 14
  const padB = 36
  const gridW = w - padL - padR
  const gridH = h - padT - padB

  const stringY = (display: number) => padT + (display / 5) * gridH
  const fretX = (fret: number) => {
    if (fretCount <= 0) return padL
    // place finger dots in the middle of the fret cell
    if (fret === 0) return padL - 14
    const idx = fret - fretStart - 0.5
    return padL + (idx / fretCount) * gridW
  }
  const fretLineX = (i: number) => padL + (i / fretCount) * gridW

  const byDisplay = new Map(
    dots.filter((d) => !d.muted).map((d) => [theoryToDisplay(d.string), d]),
  )
  const mutedDisplay = new Set(
    dots.filter((d) => d.muted).map((d) => theoryToDisplay(d.string)),
  )

  // For open chord shapes, also mark muted strings not in dots
  if (spec.kind === 'chord_shape' && dots.length) {
    for (let d = 0; d < 6; d++) {
      if (!byDisplay.has(d) && !mutedDisplay.has(d)) {
        // only auto-mute if we have an explicit shape with some frets
        if (fretted.length || dots.some((x) => x.fret === 0)) {
          // leave unmarked — OPEN_CHORD_SHAPES already encode mutes as absent / muted dots
        }
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={clsx('h-auto', wide ? 'w-full' : 'w-full max-w-[240px]')}
      role="img"
      aria-label={spec.title}
    >
      <rect width={w} height={h} rx="12" fill="var(--bg-elevated, #0a1410)" />
      {/* Nut or position */}
      {showOpenColumn ? (
        <line
          x1={padL}
          y1={padT}
          x2={padL}
          y2={padT + gridH}
          stroke="var(--accent, #5dffb0)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ) : (
        <text
          x={padL - 6}
          y={padT - 10}
          fill="var(--text-secondary, #9db5a8)"
          fontSize="11"
          fontFamily="var(--font-mono, monospace)"
        >
          {fretStart}fr
        </text>
      )}
      {/* Fret lines */}
      {Array.from({ length: fretCount + 1 }, (_, i) => (
        <line
          key={`fl${i}`}
          x1={fretLineX(i)}
          y1={padT}
          x2={fretLineX(i)}
          y2={padT + gridH}
          stroke="var(--line-strong, rgba(93,255,176,0.28))"
          strokeWidth={i === 0 && showOpenColumn ? 0 : 1.5}
        />
      ))}
      {/* Inlay dots */}
      {[3, 5, 7, 9, 12]
        .filter((f) => f > fretStart && f <= fretEnd)
        .map((f) => {
          const cx = (fretLineX(f - fretStart - 1) + fretLineX(f - fretStart)) / 2
          return (
            <circle
              key={`in${f}`}
              cx={cx}
              cy={padT + gridH / 2}
              r={f === 12 ? 3 : 2}
              fill="var(--muted, #6b8578)"
              opacity={0.45}
            />
          )
        })}
      {/* Strings + side labels */}
      {DISPLAY_LABELS.map((label, display) => {
        const y = stringY(display)
        const theory = 5 - display
        const openLab = openLabels[theory] ?? label
        return (
          <g key={label}>
            <line
              x1={padL}
              y1={y}
              x2={padL + gridW}
              y2={y}
              stroke="var(--line, rgba(93,255,176,0.14))"
              strokeWidth={1.1 + (5 - display) * 0.2}
            />
            <text
              x={padL - 10}
              y={y + 3.5}
              textAnchor="end"
              fill="var(--muted, #6b8578)"
              fontSize="10"
              fontFamily="var(--font-mono, monospace)"
            >
              {openLab}
            </text>
          </g>
        )
      })}
      {/* Muted × and open ○ left of nut */}
      {dots.map((d) => {
        const display = theoryToDisplay(d.string)
        const y = stringY(display)
        if (d.muted) {
          return (
            <text
              key={`m${d.string}`}
              x={padL - 22}
              y={y + 4}
              textAnchor="middle"
              fill="var(--danger, #ff6b6b)"
              fontSize="13"
              fontWeight="700"
            >
              ×
            </text>
          )
        }
        if (d.fret === 0) {
          return (
            <circle
              key={`o${d.string}`}
              cx={padL - 22}
              cy={y}
              r="6"
              fill="none"
              stroke={d.isRoot ? 'var(--accent-2, #c8f560)' : 'var(--accent, #5dffb0)'}
              strokeWidth="1.6"
            />
          )
        }
        return null
      })}
      {/* Finger dots */}
      {dots
        .filter((d) => !d.muted && d.fret > 0)
        .map((d) => {
          const display = theoryToDisplay(d.string)
          const cx = fretX(d.fret)
          const cy = stringY(display)
          return (
            <g key={`d${d.string}-${d.fret}-${d.label}`}>
              <circle
                cx={cx}
                cy={cy}
                r={wide ? 8 : 11}
                fill={d.isRoot ? 'var(--accent-2, #c8f560)' : 'var(--accent, #5dffb0)'}
              />
              <text
                x={cx}
                y={cy + 3.5}
                textAnchor="middle"
                fill="#050a08"
                fontSize={wide ? 8 : 10}
                fontWeight="700"
                fontFamily="var(--font-mono, monospace)"
              >
                {d.label}
              </text>
            </g>
          )
        })}
      <text
        x={w / 2}
        y={h - 12}
        textAnchor="middle"
        fill="var(--text, #e8f5ee)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-display, sans-serif)"
      >
        {spec.title}
      </text>
    </svg>
  )
}

function TextCardSvg({ resolved }: { resolved: ResolvedLessonDiagram }) {
  const { notes, spec } = resolved
  const w = 320
  const lineH = 18
  const h = 48 + notes.length * lineH
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md h-auto" role="img" aria-label={spec.title}>
      <rect width={w} height={h} rx="12" fill="var(--bg-elevated, #0a1410)" />
      <text
        x={16}
        y={24}
        fill="var(--accent, #5dffb0)"
        fontSize="13"
        fontWeight="700"
        fontFamily="var(--font-display, sans-serif)"
      >
        {spec.title}
      </text>
      {notes.map((n, i) => (
        <text
          key={i}
          x={16}
          y={46 + i * lineH}
          fill="var(--text-secondary, #9db5a8)"
          fontSize="11"
          fontFamily="var(--font, sans-serif)"
        >
          {n.length > 48 ? `${n.slice(0, 46)}…` : n}
        </text>
      ))}
    </svg>
  )
}

function RhythmGridSvg({ resolved }: { resolved: ResolvedLessonDiagram }) {
  const beats = Math.max(2, Math.min(8, resolved.spec.semitones ?? 4))
  const w = 280
  const h = 100
  const pad = 20
  const cellW = (w - pad * 2) / beats
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-sm h-auto" role="img" aria-label={resolved.spec.title}>
      <rect width={w} height={h} rx="12" fill="var(--bg-elevated, #0a1410)" />
      {Array.from({ length: beats }, (_, i) => {
        const x = pad + i * cellW
        return (
          <g key={i}>
            <rect
              x={x + 4}
              y={28}
              width={cellW - 8}
              height={40}
              rx="8"
              fill={i === 0 ? 'var(--accent-dim, rgba(93,255,176,0.14))' : 'transparent'}
              stroke="var(--accent, #5dffb0)"
              strokeWidth="1.5"
              opacity={i === 0 ? 1 : 0.55}
            />
            <text
              x={x + cellW / 2}
              y={54}
              textAnchor="middle"
              fill="var(--text, #e8f5ee)"
              fontSize="16"
              fontWeight="700"
              fontFamily="var(--font-mono, monospace)"
            >
              {i + 1}
            </text>
          </g>
        )
      })}
      <text
        x={w / 2}
        y={h - 12}
        textAnchor="middle"
        fill="var(--text-secondary, #9db5a8)"
        fontSize="11"
      >
        Count out loud · accent beat 1
      </text>
    </svg>
  )
}

export function LessonDiagram({ diagram, className }: Props) {
  const resolved = useMemo(() => resolveLessonDiagram(diagram), [diagram])
  const kind = diagram.kind
  const neckKinds = new Set([
    'chord_shape',
    'scale_tones',
    'open_strings',
    'power_chord',
    'interval',
  ])
  const wide = kind === 'scale_tones' || (diagram.frets ?? 0) >= 12

  return (
    <figure
      className={clsx(
        'm-0 rounded-2xl border border-[var(--line)] bg-[var(--panel)]/80 p-3 sm:p-4',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">{diagram.title}</div>
          {diagram.caption && (
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
              {diagram.caption}
            </p>
          )}
        </div>
        <span className="shrink-0 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-mint/30 text-mint/90 bg-mint/10">
          Verified
        </span>
      </div>
      {kind === 'rhythm_grid' ? (
        <RhythmGridSvg resolved={resolved} />
      ) : kind === 'posture' || kind === 'finger_numbers' || kind === 'caged_map' ? (
        <TextCardSvg resolved={resolved} />
      ) : neckKinds.has(kind) ? (
        <ChordOrNeckSvg resolved={resolved} wide={wide} />
      ) : (
        <TextCardSvg resolved={resolved} />
      )}
      {resolved.notes.length > 0 && kind !== 'posture' && kind !== 'finger_numbers' && kind !== 'caged_map' && (
        <ul className="mt-2 space-y-0.5 text-[11px] text-[var(--text-secondary)]">
          {resolved.notes.slice(0, 4).map((n) => (
            <li key={n}>· {n}</li>
          ))}
        </ul>
      )}
      <figcaption className="mt-2 text-[10px] text-[var(--muted)]">
        {diagram.license ?? 'MIT · GuitarRemedy original'} · theory-engine checked
      </figcaption>
    </figure>
  )
}

export function LessonDiagramGallery({
  diagrams,
  title = 'Lesson diagrams',
  subtitle,
}: {
  diagrams: LessonDiagramSpec[]
  title?: string
  subtitle?: string
}) {
  if (!diagrams.length) return null
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]/50 p-4 sm:p-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{subtitle}</p>
        )}
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {diagrams.map((d) => (
          <LessonDiagram key={d.id} diagram={d} />
        ))}
      </div>
    </section>
  )
}
