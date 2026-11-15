import clsx from 'clsx'
import {
  NOTE_NAMES,
  SCALE_LIST,
  resolveScaleId,
  type ScaleDefinition,
} from '../lib/theory'
import { displayPitchClass } from '../i18n/notes'
import { presentScaleName } from '../i18n/present'
import { useI18n } from '../i18n/useI18n'
import { useAppStore } from '../store/appStore'

const CATEGORY_ORDER = ['pentatonic', 'scale', 'mode', 'other'] as const

type Props = {
  root: number
  scaleId: string
  onRoot: (n: number) => void
  onScale: (id: string) => void
  className?: string
}

export function ScalePicker({ root, scaleId, onRoot, onScale, className }: Props) {
  const noteSpelling = useAppStore((s) => s.noteSpelling)
  const { tx } = useI18n()
  const categoryLabel = (cat: (typeof CATEGORY_ORDER)[number]) => {
    switch (cat) {
      case 'pentatonic':
        return tx('Pentatonic')
      case 'scale':
        return tx('Diatonic')
      case 'mode':
        return tx('Modes')
      default:
        return tx('Other')
    }
  }
  const resolved = resolveScaleId(scaleId) ?? scaleId
  const byCat = CATEGORY_ORDER.map((cat) => ({
    cat,
    scales: SCALE_LIST.filter((s: ScaleDefinition) => s.category === cat),
  })).filter((g) => g.scales.length > 0)

  return (
    <div className={clsx('space-y-4', className)}>
      <div>
        <p className="section-title mb-2">{tx('Root')}</p>
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
              {noteSpelling === 'letters' ? n : displayPitchClass(i, noteSpelling)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="section-title mb-2">{tx('Scale / mode')}</p>
        <div className="space-y-3">
          {byCat.map(({ cat, scales }) => (
            <div key={cat}>
              <p className="text-[10px] uppercase tracking-widest text-mint/70 mb-1.5 font-semibold">
                {categoryLabel(cat)}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {scales.map((s) => {
                  const active = resolved === s.id
                  const name = presentScaleName(s.id, s.name)
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onScale(s.id)}
                      title={name}
                      className={clsx(
                        'px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                        active
                          ? 'bg-mint/20 text-mint border-mint/45 shadow-[0_0_10px_rgba(93,255,176,0.2)]'
                          : 'border-line/70 text-soft hover:border-mint/30 hover:text-bright bg-ink-2/40',
                      )}
                    >
                      {name}
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
