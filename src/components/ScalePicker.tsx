import { NOTE_NAMES, SCALES, type ScaleDefinition } from '../lib/theory'
import clsx from 'clsx'

type Props = {
  root: number
  scaleId: string
  onRootChange: (pc: number) => void
  onScaleChange: (id: string) => void
  scales?: ScaleDefinition[]
  className?: string
}

export function ScalePicker({
  root,
  scaleId,
  onRootChange,
  onScaleChange,
  scales = Object.values(SCALES),
  className,
}: Props) {
  return (
    <div className={clsx('flex flex-wrap gap-3', className)}>
      <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
        Root
        <select
          className="input !py-2 !text-sm min-w-[5rem]"
          value={root}
          onChange={(e) => onRootChange(Number(e.target.value))}
        >
          {NOTE_NAMES.map((n, i) => (
            <option key={n} value={i}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)] flex-1 min-w-[10rem]">
        Scale / mode
        <select
          className="input !py-2 !text-sm"
          value={scaleId}
          onChange={(e) => onScaleChange(e.target.value)}
        >
          {scales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
