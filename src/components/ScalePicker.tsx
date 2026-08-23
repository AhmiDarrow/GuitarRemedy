import clsx from 'clsx'
import {
  NOTE_NAMES,
  SCALE_LIST,
  resolveScaleId,
  type ScaleDefinition,
} from '../lib/theory'

const CATEGORY_ORDER = ['pentatonic', 'scale', 'mode', 'other'] as const

const CATEGORY_LABEL: Record<(typeof CATEGORY_ORDER)[number], string> = {
  pentatonic: 'Pentatonic',
  scale: 'Diatonic',
  mode: 'Modes',
  other: 'Other',
}

type Props = {
  root: number
  scaleId: string
  onRoot: (n: number) => void
  onScale: (id: string) => void
  className?: string
}

export function ScalePicker({ root, scaleId, onRoot, onScale, className }: Props) {
  const resolved = resolveScaleId(scaleId) ?? scaleId
  const byCat = CATEGORY_ORDER.map((cat) => ({
    cat,
    scales: SCALE_LIST.filter((s: ScaleDefinition) => s.category === cat),
  })).filter((g) => g.scales.length > 0)

  return (
    <div className={clsx('space-y-4', className)}>
      <div>
        <p className="section-title mb-2">Root</p>
        <div className="flex flex-wrap gap-1.5">
          {NOTE_NAMES.map((n, i) => (
            <button
              key={n}
              type="button"
              onClick={() => onRoot(i)}
              className={clsx(
                'min-w-[2.4rem] px-2.5 py-1.5 rounded-lg text-sm font-semibold border transition-colors',
                root === i
                  ? 'bg-lime/90 text-ink border-lime shadow-[0_0_12px_rgba(200,245,96,0.35)]'
                  : 'border-line/80 text-soft hover:border-mint/40 hover:text-bright bg-ink-2/60',
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="section-title mb-2">Scale / mode</p>
        <div className="space-y-3">
          {byCat.map(({ cat, scales }) => (
            <div key={cat}>
              <p className="text-[10px] uppercase tracking-widest text-mint/70 mb-1.5 font-semibold">
                {CATEGORY_LABEL[cat]}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {scales.map((s) => {
                  const active = resolved === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onScale(s.id)}
                      title={s.name}
                      className={clsx(
                        'px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                        active
                          ? 'bg-mint/20 text-mint border-mint/45 shadow-[0_0_10px_rgba(93,255,176,0.2)]'
                          : 'border-line/70 text-soft hover:border-mint/30 hover:text-bright bg-ink-2/40',
                      )}
                    >
                      {s.name}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
