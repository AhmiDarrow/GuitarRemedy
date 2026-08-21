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
    <div className={clsx('overflow-x-auto rounded-2xl border border-[var(--border)] bg-[#0a0d12]', className)}>
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
                {f > 0 && <div className="absolute left-0 top-0 bottom-0 w-px bg-mint/15" />}
                {markers.includes(f) && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-mint/25" />
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
                  <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-mint/35 via-soft/25 to-moss/40" />
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
                              'w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[10px] md:text-[11px] font-semibold transition-transform',
                              isRoot
                                ? 'bg-amber-400 text-black shadow-md shadow-amber-500/40'
                                : 'bg-sky-500/90 text-white shadow-md shadow-sky-500/20',
                              dim && 'opacity-25',
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
