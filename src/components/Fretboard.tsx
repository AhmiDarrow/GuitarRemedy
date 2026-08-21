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
}

export function Fretboard({
  scale,
  root,
  position = null,
  showDegrees = true,
  interactive = true,
  className,
}: Props) {
  const lefty = useAppStore((s) => s.lefty)
  const getTuning = useAppStore((s) => s.getTuning)
  const tuning = getTuning()
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

  const markers = [3, 5, 7, 9, 12]

  return (
    <div
      className={clsx(
        'overflow-x-auto rounded-2xl border border-[var(--border)]',
        className,
      )}
      style={{
        background:
          'linear-gradient(180deg, #0c1a14 0%, #07110c 55%, #030705 100%)',
      }}
    >
      <div className="min-w-[720px] p-3 md:p-4">
        <div className="flex mb-1 pl-10">
          {fretOrder.map((f) => (
            <div key={f} className="flex-1 text-center text-[10px] text-[var(--text-muted)] font-mono">
              {f === 0 ? '' : f}
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 pointer-events-none flex pl-10">
            {fretOrder.map((f) => (
              <div key={f} className="flex-1 relative">
                {f > 0 && <div className="absolute left-0 top-0 bottom-0 w-px bg-mint/20" />}
                {markers.includes(f) && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-lime/30 ring-1 ring-mint/20" />
                )}
              </div>
            ))}
          </div>

          {strings.map((row) => {
            const openMidi = row[0].midi
            const openName = midiToNoteName(openMidi).replace(/\d+$/, '')
            return (
              <div key={row[0].string} className="flex items-center h-9 md:h-10 relative">
                <div className="w-10 shrink-0 text-xs font-mono text-mint/90 font-medium">
                  {openName}
                </div>
                <div className="flex-1 flex relative h-full items-center">
                  <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-mint/40 via-soft/20 to-moss/50" />
                  {fretOrder.map((fret) => {
                    const cell = row[fret]
                    const deg = cell.inScale ? degreeOf(cell.pc, root, scale) : null
                    const isRoot = cell.isRoot
                    const dim = !inPosition(fret)
                    return (
                      <button
                        key={fret}
                        type="button"
                        disabled={!interactive || !cell.inScale}
                        onClick={() => {
                          if (cell.inScale) void playNote(cell.midi)
                        }}
                        className={clsx(
                          'flex-1 h-full flex items-center justify-center relative z-10',
                          interactive && cell.inScale && 'cursor-pointer',
                        )}
                        aria-label={cell.inScale ? `${NOTE_NAMES[cell.pc]} fret ${fret}` : undefined}
                      >
                        {cell.inScale && (
                          <span
                            className={clsx(
                              'min-w-[1.75rem] h-7 md:min-w-[2rem] md:h-8 px-1 rounded-full flex items-center justify-center text-[11px] md:text-xs font-bold tracking-tight transition-transform border',
                              isRoot
                                ? 'bg-lime text-[var(--color-ink)] border-lime shadow-[0_0_14px_rgba(200,245,96,0.55)] ring-2 ring-mint/70'
                                : 'bg-mint text-[var(--color-ink)] border-mint/80 shadow-[0_0_12px_rgba(93,255,176,0.4)] ring-1 ring-white/25',
                              dim && 'opacity-40',
                              interactive && 'hover:scale-110 active:scale-95',
                            )}
                          >
                            {showDegrees && deg != null ? deg : NOTE_NAMES[cell.pc]}
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
      </div>
    </div>
  )
}
