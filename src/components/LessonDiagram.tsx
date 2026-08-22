import { useMemo } from 'react'
import clsx from 'clsx'
import {
  resolveLessonDiagram,
  type LessonDiagramSpec,
} from '../data/lessonImagery'

type Props = {
  diagram: LessonDiagramSpec
  className?: string
}

/** Plain monospace lesson figure — no badges, no license chrome. */
export function LessonDiagram({ diagram, className }: Props) {
  const resolved = useMemo(() => resolveLessonDiagram(diagram), [diagram])

  return (
    <figure
      className={clsx(
        'm-0 rounded-2xl border border-[var(--line)] bg-[var(--panel)]/80 p-3 sm:p-4',
        className,
      )}
    >
      <div className="text-sm font-semibold text-[var(--text)]">{diagram.title}</div>
      {diagram.caption && (
        <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{diagram.caption}</p>
      )}
      <pre
        className="mt-3 overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-3 text-[12px] sm:text-[13px] leading-relaxed text-[var(--accent)] font-mono whitespace-pre"
        aria-label={diagram.title}
      >
        {resolved.ascii}
      </pre>
      {resolved.notes.length > 0 &&
        diagram.kind !== 'posture' &&
        diagram.kind !== 'finger_numbers' &&
        diagram.kind !== 'caged_map' &&
        diagram.kind !== 'rhythm_grid' && (
          <ul className="mt-2 space-y-1 text-xs text-[var(--text-secondary)] leading-relaxed">
            {resolved.notes.map((n) => (
              <li key={n}>· {n}</li>
            ))}
          </ul>
        )}
    </figure>
  )
}

export function LessonDiagramGallery({
  diagrams,
  title = 'Diagrams',
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
