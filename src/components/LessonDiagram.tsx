import { useMemo } from 'react'
import clsx from 'clsx'
import {
  resolveLessonDiagram,
  type LessonDiagramSpec,
  type ResolvedLessonDiagram,
  type DiagramDot,
} from '../data/lessonImagery'
import { Fretboard } from './Fretboard'
import { getScale, noteToPc, type NoteName } from '../lib/theory'

/** Kinds we render as real neck UI — everything else is omitted from Learn. */
export const VISUAL_DIAGRAM_KINDS = new Set([
  'chord_shape',
  'open_strings',
  'scale_tones',
  'power_chord',
  'interval',
])

export function isVisualDiagram(spec: LessonDiagramSpec): boolean {
  return VISUAL_DIAGRAM_KINDS.has(spec.kind)
}

/** Display order: high e → low E (standard chord-chart convention). */
function displayDots(dots: DiagramDot[]): DiagramDot[] {
  return [...dots].sort((a, b) => b.string - a.string)
}

function chordWindow(dots: DiagramDot[]): { start: number; count: number } {
  const fretted = dots.filter((d) => !d.muted && d.fret > 0).map((d) => d.fret)
  if (!fretted.length) return { start: 1, count: 4 }
  const min = Math.min(...fretted)
  const max = Math.max(...fretted)
  const start = min <= 4 ? 1 : min
  const count = Math.max(4, max - start + 1)
  return { start, count: Math.min(count, 6) }
}

/**
 * Vertical open-position / movable chord chart — Dark Forest tokens, no chrome badges.
 */
function ChordChart({
  resolved,
}: {
  resolved: ResolvedLessonDiagram
}) {
  const { dots, spec } = resolved
  const ordered = displayDots(dots)
  const { start: fretStart, count: fretCount } = chordWindow(dots)
  const frets = Array.from({ length: fretCount }, (_, i) => fretStart + i)
  const showNut = fretStart === 1

  return (
    <div className="flex flex-col items-center gap-3 py-1">
      {/* Open / mute row above nut */}
      <div className="flex w-full max-w-[11rem] justify-between px-1">
        {ordered.map((d) => (
          <span
            key={`top-${d.string}`}
            className={clsx(
              'w-6 text-center font-mono text-xs font-semibold',
              d.muted && 'text-[var(--danger)]',
              !d.muted && d.fret === 0 && 'text-lime',
              !d.muted && d.fret > 0 && 'text-transparent',
            )}
            aria-hidden={d.muted || d.fret === 0 ? undefined : true}
          >
            {d.muted ? '×' : d.fret === 0 ? '○' : '·'}
          </span>
        ))}
      </div>

      <div className="relative w-full max-w-[11rem]">
        {showNut && (
          <div
            className="h-1.5 rounded-sm mb-0.5 bg-gradient-to-r from-mint via-lime to-mint shadow-[0_0_12px_rgba(93,255,176,0.35)]"
            aria-hidden
          />
        )}
        {!showNut && (
          <div className="absolute -left-7 top-3 font-mono text-[10px] text-mint/80 tabular-nums">
            {fretStart}fr
          </div>
        )}

        <div
          className="rounded-lg border border-mint/25 bg-[var(--bg)]/80 overflow-hidden shadow-[inset_0_0_24px_rgba(93,255,176,0.06)]"
          role="img"
          aria-label={spec.title}
        >
          {frets.map((fret, fi) => (
            <div
              key={fret}
              className={clsx(
                'grid grid-cols-6 relative',
                fi === 0 && showNut ? 'border-t-0' : 'border-t border-mint/20',
              )}
              style={{ height: 28 }}
            >
              {ordered.map((d) => {
                const active = !d.muted && d.fret === fret
                return (
                  <div
                    key={`${d.string}-${fret}`}
                    className="relative flex items-center justify-center border-r border-mint/10 last:border-r-0"
                  >
                    {/* string line */}
                    <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-mint/35 to-moss/40" />
                    {active && (
                      <span
                        className={clsx(
                          'relative z-10 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                          d.isRoot
                            ? 'bg-lime text-[var(--color-ink,#050a08)] ring-2 ring-mint/70 shadow-[0_0_12px_rgba(200,245,96,0.55)]'
                            : 'bg-mint text-[var(--color-ink,#050a08)] ring-1 ring-white/20 shadow-[0_0_10px_rgba(93,255,176,0.4)]',
                        )}
                      >
                        {/^\d$/.test(d.label) ? d.label : d.isRoot ? 'R' : ''}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* String names under chart */}
        <div className="mt-2 flex w-full justify-between px-0.5">
          {['e', 'B', 'G', 'D', 'A', 'E'].map((name) => (
            <span key={name} className="w-6 text-center font-mono text-[10px] text-mint/70">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScaleBoard({ resolved }: { resolved: ResolvedLessonDiagram }) {
  const rootName = (resolved.spec.root ?? 'C') as NoteName
  // Match lessonImagery: never default to minor pentatonic (beginner scare / wrong lesson).
  const scaleId = resolved.spec.scaleId ?? 'major'
  const scale = useMemo(() => getScale(scaleId), [scaleId])
  const root = useMemo(() => noteToPc(rootName), [rootName])

  if (!scale) return null

  return (
    <div className="rounded-xl border border-mint/20 bg-[var(--bg)]/50 p-2 md:p-3 overflow-x-auto">
      <Fretboard
        scale={scale}
        root={root}
        showDegrees
        interactive={false}
        className="min-w-[28rem]"
      />
    </div>
  )
}

function IntervalBoard({ resolved }: { resolved: ResolvedLessonDiagram }) {
  // Small chord-chart style for single-string interval dots
  return <ChordChart resolved={resolved} />
}

export function LessonDiagramView({
  spec,
  className,
}: {
  spec: LessonDiagramSpec
  className?: string
}) {
  const resolved = useMemo(() => resolveLessonDiagram(spec), [spec])

  if (!isVisualDiagram(spec)) return null

  const isScale = spec.kind === 'scale_tones'
  const isInterval = spec.kind === 'interval'

  return (
    <figure
      className={clsx(
        'rounded-2xl border border-[var(--line)] bg-[var(--panel)]/90 overflow-hidden',
        'shadow-[0_8px_28px_rgba(0,0,0,0.28)]',
        className,
      )}
    >
      <div className="px-4 pt-4 pb-1 flex flex-wrap items-baseline justify-between gap-2">
        <figcaption className="font-display text-sm font-semibold tracking-wide text-[var(--text)]">
          {spec.title}
        </figcaption>
        {spec.caption && (
          <span className="text-[11px] text-[var(--text-secondary)] max-w-[16rem] text-right leading-snug">
            {spec.caption}
          </span>
        )}
      </div>

      <div className="px-3 pb-4 pt-2">
        {isScale ? (
          <ScaleBoard resolved={resolved} />
        ) : isInterval ? (
          <IntervalBoard resolved={resolved} />
        ) : (
          <ChordChart resolved={resolved} />
        )}
      </div>
    </figure>
  )
}

export function LessonDiagramGallery({
  diagrams,
  title = 'Neck figures',
  subtitle,
  className,
}: {
  diagrams: LessonDiagramSpec[]
  title?: string
  subtitle?: string
  className?: string
}) {
  const visual = diagrams.filter(isVisualDiagram)
  if (!visual.length) return null

  return (
    <section className={clsx('space-y-3', className)}>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          {title}
        </h3>
        {subtitle && <p className="text-xs text-[var(--muted)] mt-0.5">{subtitle}</p>}
      </div>
      <div
        className={clsx(
          'grid gap-3',
          visual.length === 1 && 'grid-cols-1 max-w-xl',
          visual.length === 2 && 'grid-cols-1 sm:grid-cols-2',
          visual.length >= 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {visual.map((d) => (
          <LessonDiagramView key={d.id} spec={d} />
        ))}
      </div>
    </section>
  )
}
