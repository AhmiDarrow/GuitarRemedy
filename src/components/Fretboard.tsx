import { useMemo, useCallback } from 'react'
import clsx from 'clsx'
import {
  NOTE_NAMES,
  STANDARD_TUNING,
  degreeOf,
  fretboardNotes,
  midiToNoteName,
  type ScaleDefinition,
} from '../lib/theory'
import { playNote } from '../lib/audio'
import { useAppStore } from '../store/appStore'

const FRETS = 15

type Props = {
  scale: ScaleDefinition
  root: number
  position?: number | null
  showDegrees?: boolean
  interactive?: boolean
  className?: string
  /**
   * Pitch classes (0–11) currently sounding — all matching in-scale dots pulse.
   * Used by Library / Practice play-along so the neck tracks audio.
   */
  activePcs?: number[]
  /** When true, non-active in-scale dots dim so the sounding tones read clearly. */
  dimInactiveWhilePlaying?: boolean
}

function normPc(pc: number): number {
  return ((pc % 12) + 12) % 12
}

/** Single-dot frets + double at the octave. */
const SINGLE_MARKERS = [3, 5, 7, 9, 15]
const DOUBLE_MARKERS = [12]

export function Fretboard({
  scale,
  root,
  position = null,
  showDegrees = true,
  interactive = true,
  className,
  activePcs,
  dimInactiveWhilePlaying = true,
}: Props) {
  const lefty = useAppStore((s) => s.lefty)
  // Subscribe to tuning fields — getTuning alone is a stable fn and won't re-render.
  const tuningName = useAppStore((s) => s.tuningName)
  const customTuning = useAppStore((s) => s.customTuning)
  const getTuning = useAppStore((s) => s.getTuning)
  const a4 = useAppStore((s) => s.a4)
  const tuning = useMemo(
    () => getTuning(),
    [getTuning, tuningName, customTuning],
  )
  const t = tuning?.length === 6 ? tuning : [...STANDARD_TUNING]

  const board = useMemo(
    () => fretboardNotes(t, FRETS, scale, root),
    [t, scale, root],
  )

  const inPosition = useCallback(
    (fret: number) => {
      if (position == null) return true
      return fret === 0 || (fret >= position && fret <= position + 4)
    },
    [position],
  )

  const strings = lefty ? [...board].reverse() : board
  const fretOrder = lefty
    ? Array.from({ length: FRETS + 1 }, (_, i) => FRETS - i)
    : Array.from({ length: FRETS + 1 }, (_, i) => i)

  const activeSet = useMemo(() => {
    if (!activePcs?.length) return null
    return new Set(activePcs.map(normPc))
  }, [activePcs])
  const playing = !!activeSet && activeSet.size > 0

  /** String visual weight: low E thicker → high e thinner (display order). */
  const stringWeight = (displayIndex: number) => {
    // displayIndex 0 = top of UI = high e when not lefty
    const n = strings.length
    const fromHigh = lefty ? n - 1 - displayIndex : displayIndex
    return 1.5 + (n - 1 - fromHigh) * 0.35
  }

  return (
    <div
      className={clsx(
        'fretboard-lab overflow-x-auto rounded-2xl',
        className,
      )}
      role="img"
      aria-label={`${NOTE_NAMES[root] ?? ''} ${scale.name} fretboard`}
    >
      <div className="min-w-[720px] p-3 md:p-4">
        {/* Fret numbers */}
        <div className="flex mb-1.5 pl-10">
          {fretOrder.map((f) => (
            <div
              key={f}
              className={clsx(
                'flex-1 text-center text-[10px] font-mono tabular-nums',
                f === 0
                  ? 'text-transparent'
                  : DOUBLE_MARKERS.includes(f) || SINGLE_MARKERS.includes(f)
                    ? 'text-mint/70 font-semibold'
                    : 'text-[var(--text-muted)]',
                position != null &&
                  f >= position &&
                  f <= position + 4 &&
                  'text-lime/90',
              )}
            >
              {f === 0 ? '·' : f}
            </div>
          ))}
        </div>

        <div className="relative">
          {/* Position box highlight */}
          {position != null && (
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-0 rounded-md border border-mint/25 bg-mint/[0.04]"
              style={{
                left: lefty
                  ? undefined
                  : `calc(2.5rem + ${(position / (FRETS + 1)) * 100}% * (1 - 2.5rem / 100%))`,
                // simpler: use flex spacer approach via overlay frets
                display: 'none',
              }}
            />
          )}

          {/* Fret wires + inlays */}
          <div className="absolute inset-0 pointer-events-none flex pl-10 z-0">
            {fretOrder.map((f) => {
              const inBox =
                position != null && f >= position && f <= position + 4
              return (
                <div
                  key={f}
                  className={clsx(
                    'flex-1 relative',
                    inBox && 'bg-mint/[0.05]',
                  )}
                >
                  {/* Nut */}
                  {f === 0 && (
                    <div className="absolute right-0 top-1 bottom-1 w-[3px] rounded-sm bg-gradient-to-b from-lime/80 via-mint/70 to-lime/50 shadow-[0_0_8px_rgba(93,255,176,0.35)]" />
                  )}
                  {/* Fret wire */}
                  {f > 0 && (
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-mint/10 via-mint/25 to-mint/10" />
                  )}
                  {/* Inlays */}
                  {SINGLE_MARKERS.includes(f) && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-lime/25 ring-1 ring-mint/30" />
                  )}
                  {DOUBLE_MARKERS.includes(f) && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3">
                      <div className="w-2 h-2 rounded-full bg-lime/30 ring-1 ring-mint/35" />
                      <div className="w-2 h-2 rounded-full bg-lime/30 ring-1 ring-mint/35" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {strings.map((row, displayIndex) => {
            const openMidi = row[0].midi
            const openName = midiToNoteName(openMidi).replace(/\d+$/, '')
            const weight = stringWeight(displayIndex)
            return (
              <div
                key={row[0].string}
                className="flex items-center h-9 md:h-11 relative z-10"
              >
                <div
                  className="w-10 shrink-0 text-xs font-mono text-mint/90 font-semibold tracking-wide"
                  title={`Open ${openName}`}
                >
                  {openName}
                </div>
                <div className="flex-1 flex relative h-full items-center">
                  {/* String line */}
                  <div
                    className="absolute left-0 right-0 rounded-full bg-gradient-to-r from-mint/50 via-soft/25 to-moss/40"
                    style={{
                      height: weight,
                      boxShadow: '0 0 6px rgba(93,255,176,0.12)',
                    }}
                  />
                  {fretOrder.map((fret) => {
                    const cell = row[fret]
                    const deg = cell.inScale
                      ? degreeOf(cell.pc, root, scale)
                      : null
                    const isRoot = cell.isRoot
                    const dim = !inPosition(fret)
                    const isActive = !!activeSet?.has(normPc(cell.pc))
                    const dimForPlay =
                      playing &&
                      dimInactiveWhilePlaying &&
                      cell.inScale &&
                      !isActive
                    const inBox =
                      position != null &&
                      (fret === 0 ||
                        (fret >= position && fret <= position + 4))
                    return (
                      <button
                        key={fret}
                        type="button"
                        disabled={!interactive || !cell.inScale}
                        onClick={() => {
                          if (cell.inScale)
                            void playNote(cell.midi, 0.45, undefined, { a4 })
                        }}
                        className={clsx(
                          'flex-1 h-full flex items-center justify-center relative z-10',
                          interactive && cell.inScale && 'cursor-pointer',
                          !cell.inScale && 'cursor-default',
                        )}
                        aria-label={
                          cell.inScale
                            ? `${NOTE_NAMES[cell.pc]} fret ${fret}${isActive ? ' playing' : ''}`
                            : `Empty fret ${fret}`
                        }
                        aria-current={isActive ? 'true' : undefined}
                      >
                        {/* Soft position wash behind dots */}
                        {inBox && position != null && (
                          <span className="absolute inset-y-1 inset-x-0 bg-mint/[0.03] pointer-events-none rounded-sm" />
                        )}
                        {cell.inScale && (
                          <span
                            className={clsx(
                              'min-w-[1.75rem] h-7 md:min-w-[2rem] md:h-8 px-1 rounded-full flex items-center justify-center text-[11px] md:text-xs font-bold tracking-tight border',
                              isActive
                                ? 'fret-dot-active bg-lime text-[var(--color-ink)] border-white shadow-[0_0_22px_rgba(200,245,96,0.85)] ring-2 ring-mint scale-125 z-20'
                                : isRoot
                                  ? 'bg-lime text-[var(--color-ink)] border-lime shadow-[0_0_14px_rgba(200,245,96,0.55)] ring-2 ring-mint/70'
                                  : 'bg-mint text-[var(--color-ink)] border-mint/80 shadow-[0_0_12px_rgba(93,255,176,0.4)] ring-1 ring-white/25',
                              dim && !isActive && 'opacity-35',
                              dimForPlay && 'opacity-22 scale-90',
                              !isActive &&
                                interactive &&
                                'transition-transform hover:scale-110 active:scale-95',
                              isActive && 'transition-transform duration-75',
                            )}
                          >
                            {showDegrees && deg != null
                              ? deg
                              : NOTE_NAMES[cell.pc]}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-2 text-[10px] text-center text-[var(--text-muted)]/80 font-mono">
          {lefty ? 'Lefty · ' : ''}
          frets 0–{FRETS}
          {position != null ? ` · box ${position}–${position + 4}` : ''}
        </p>
      </div>
    </div>
  )
}
