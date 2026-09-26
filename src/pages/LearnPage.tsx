import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Guitar,
  Library,
  Lightbulb,
  Sparkles,
  Target,
} from 'lucide-react'
import { getLesson, getPhaseMeta, CURRICULUM, type LessonPhase } from '../data/curriculum'
import { getLibraryItem } from '../data/library'
import { diagramsForLesson } from '../data/lessonImagery'
import { LessonDiagramGallery } from '../components/LessonDiagram'
import { useAppStore } from '../store/appStore'
import clsx from 'clsx'
import { LessonCoach, LessonReflection } from '../components/LessonCoach'
import { EMPTY_SESSION, useLessonStore } from '../store/lessonStore'

const PHASE_TONE: Record<
  LessonPhase,
  { bar: string; chip: string; soft: string; label: string }
> = {
  basics: {
    bar: 'bg-mint',
    chip: 'border-mint/45 bg-mint/15 text-mint',
    soft: 'text-mint',
    label: 'Foundations',
  },
  chords: {
    bar: 'bg-lime',
    chip: 'border-lime/45 bg-lime/15 text-lime',
    soft: 'text-lime',
    label: 'Harmony',
  },
  scales: {
    bar: 'bg-teal',
    chip: 'border-teal/45 bg-teal/20 text-soft',
    soft: 'text-soft',
    label: 'Melody map',
  },
  rhythm: {
    bar: 'bg-moss',
    chip: 'border-moss/50 bg-moss/25 text-soft',
    soft: 'text-soft',
    label: 'Groove',
  },
  lead: {
    bar: 'bg-lime',
    chip: 'border-lime/50 bg-lime/20 text-lime',
    soft: 'text-lime',
    label: 'Lead voice',
  },
  repertoire: {
    bar: 'bg-mint',
    chip: 'border-mint/50 bg-mint/20 text-mint',
    soft: 'text-mint',
    label: 'Songs',
  },
}

const SEG_LABEL: Record<string, string> = {
  arrive: 'Arrive',
  warmup: 'Warm-up',
  teach: 'Teach',
  guided: 'Guided',
  jam: 'Jam',
  cooldown: 'Cool-down',
}

export function LearnPage() {
  const { day: dayParam } = useParams()
  const currentDay = useAppStore((s) => s.currentDay)
  const raw = Number(dayParam ?? currentDay)
  const day = Number.isFinite(raw) ? Math.max(1, Math.min(365, Math.floor(raw))) : 1
  if (dayParam !== String(day)) return <Navigate to={`/learn/${day}`} replace />
  return <LessonContent key={day} day={day} />
}

function LessonContent({ day }: { day: number }) {
  const navigate = useNavigate()
  const completed = useAppStore((s) => s.completedLessons)
  const setCurrentDay = useAppStore((s) => s.setCurrentDay)
  const streak = useAppStore((s) => s.streak)

  const lesson = getLesson(day)!
  const pl = lesson.privateLesson
  const done = completed.includes(day)
  const phases = getPhaseMeta()
  const tone = PHASE_TONE[lesson.phase]
  const phaseMeta = phases.find((p) => p.phase === lesson.phase)!
  const phaseLen = phaseMeta.end - phaseMeta.start + 1
  const phasePos = day - phaseMeta.start + 1
  const completedInPhase = completed.filter((d) => d >= phaseMeta.start && d <= phaseMeta.end).length
  const phasePct = Math.round((completedInPhase / phaseLen) * 100)
  const pathPct = Math.round((completed.length / 365) * 100)

  const session = useLessonStore(s => s.sessions[day] ?? EMPTY_SESSION)
  const updateSession = useLessonStore(s => s.update)
  const activeSeg = session.segment
  const checked = session.checked
  const setActiveSeg = (segment: number) => updateSession(day, { segment })
  const [easyOn, setEasyOn] = useState(false)

  const related = lesson.libraryIds
    .map((id) => getLibraryItem(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const diagrams = useMemo(
    () =>
      diagramsForLesson({
        day: lesson.day,
        phase: lesson.phase,
        title: lesson.title,
        goals: lesson.goals,
        drills: lesson.drills,
        theoryBite: lesson.theoryBite,
        libraryIds: lesson.libraryIds,
      }),
    [lesson],
  )

  const nearby = [-2, -1, 0, 1, 2]
    .map((off) => day + off)
    .filter((d) => d >= 1 && d <= 365)

  const segments = pl?.segments ?? []
  const seg = segments[Math.min(activeSeg, Math.max(0, segments.length - 1))]
  const totalMin = pl?.durationMin || lesson.durationMin

  const elapsedBefore = useMemo(() => {
    let t = 0
    for (let i = 0; i < activeSeg && i < segments.length; i++) t += segments[i].minutes
    return t
  }, [activeSeg, segments])

  const go = (d: number) => {
    const next = Math.max(1, Math.min(365, d))
    setCurrentDay(next)
    navigate(`/learn/${next}`)
  }

  const toggleCheck = (key: string) => {
    updateSession(day, { checked: { ...checked, [key]: !checked[key] } })
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">365-day path</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Private lesson</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Day {day} of 365 · {completed.length} complete · streak {streak}d · ~{totalMin} min
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Previous lesson" className="btn-ghost !px-3" disabled={day <= 1} onClick={() => go(day - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-sm text-[var(--text-muted)] min-w-[7.5rem] text-center">
            Day {day} / 365
          </span>
          <button type="button" aria-label="Next lesson" className="btn-ghost !px-3" disabled={day >= 365} onClick={() => go(day + 1)}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <section className="card p-4 md:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Phase progress</p>
            <p className={clsx('text-sm font-medium capitalize mt-0.5', tone.soft)}>
              {lesson.phase} · {tone.label} · day {phasePos}/{phaseLen}
            </p>
          </div>
          <div className="text-right text-xs text-[var(--text-muted)]">
            <div>{completedInPhase} done in phase</div>
            <div className="font-mono mt-0.5">
              {phasePct}% phase · {pathPct}% path
            </div>
          </div>
        </div>
        <div role="progressbar" aria-label="Phase completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={phasePct} className="h-2 rounded-full bg-ink/60 overflow-hidden border border-[var(--border)]">
          <div
            className={clsx('h-full rounded-full transition-all duration-300', tone.bar)}
            style={{ width: `${phasePct}%` }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scroll-thin">
          {phases.map((p) => {
            const active = day >= p.start && day <= p.end
            const pTone = PHASE_TONE[p.phase]
            const doneCount = completed.filter((d) => d >= p.start && d <= p.end).length
            return (
              <button
                key={p.phase}
                type="button"
                onClick={() => go(p.start)}
                className={clsx(
                  'shrink-0 rounded-2xl px-3 py-2 text-left border transition-colors min-w-[8.5rem]',
                  active ? pTone.chip : 'border-[var(--border)] text-[var(--text-muted)] hover:border-mint/35',
                )}
              >
                <div className="text-[11px] uppercase tracking-wide opacity-80">{pTone.label}</div>
                <div className="text-sm font-semibold capitalize mt-0.5">{p.phase}</div>
                <div className="text-[11px] mt-1 opacity-80">
                  {p.start}–{p.end} · {doneCount}✓
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <article className="card p-5 md:p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={clsx('rounded-full border px-2.5 py-1 capitalize', tone.chip)}>
                Day {lesson.day} · {lesson.phase}
              </span>
              <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--text-muted)] capitalize">
                {lesson.skill}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--text-muted)]">
                <Clock3 className="w-3.5 h-3.5" />
                {totalMin} min private lesson
              </span>
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold mt-3">{lesson.title}</h2>
            {pl?.hook && (
              <p className="mt-2 text-sm text-mint/90 leading-relaxed flex gap-2">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{pl.hook}</span>
              </p>
            )}
          </div>
          {done ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)] text-sm shrink-0">
              <BookOpen className="w-4 h-4" /> In progress
            </span>
          )}
        </div>

        {pl?.teacherIntro && (
          <div className="rounded-2xl border border-mint/30 bg-mint/5 p-4">
            <p className="text-xs uppercase tracking-wide text-mint mb-1.5">Your teacher</p>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{pl.teacherIntro}</p>
          </div>
        )}

        <LessonCoach lesson={lesson} />

        {/* Session timeline */}
        {segments.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                Session flow
              </h3>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                ~{elapsedBefore}–{elapsedBefore + (seg?.minutes || 0)} min
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scroll-thin">
              {segments.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSeg(i)}
                  aria-pressed={i === activeSeg}
                  className={clsx(
                    'shrink-0 rounded-xl border px-3 py-2 text-left min-w-[5.5rem] transition-colors',
                    i === activeSeg
                      ? 'border-mint/50 bg-mint/15 text-mint'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-mint/35',
                  )}
                >
                  <div className="text-[10px] uppercase tracking-wide opacity-80">
                    {SEG_LABEL[s.id] || s.name}
                  </div>
                  <div className="text-xs font-medium mt-0.5">{s.minutes} min · {s.youDo.filter((_, idx) => checked[`${s.id}-${idx}`]).length}/{s.youDo.length} done</div>
                </button>
              ))}
            </div>

            {seg && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/70 p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display text-lg font-semibold">
                    {seg.name}{' '}
                    <span className="text-sm font-normal text-[var(--text-muted)]">· {seg.minutes} min</span>
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn-ghost !px-2 text-xs"
                      disabled={activeSeg <= 0}
                      onClick={() => setActiveSeg(Math.max(0, activeSeg - 1))}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      className="btn-secondary !px-3 text-xs"
                      disabled={activeSeg >= segments.length - 1}
                      onClick={() => setActiveSeg(Math.min(segments.length - 1, activeSeg + 1))}
                    >
                      Next segment
                    </button>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] border-l-2 border-mint/40 pl-3">
                  {seg.coach}
                </p>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">You do</p>
                  <ul className="space-y-2">
                    {seg.youDo.map((step, idx) => {
                      const key = `${seg.id}-${idx}`
                      return (
                        <li key={key}>
                          <label className="flex gap-2.5 items-start cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={!!checked[key]}
                              onChange={() => toggleCheck(key)}
                              className="mt-1 accent-[var(--mint)]"
                            />
                            <span
                              className={clsx(
                                'text-sm leading-relaxed',
                                checked[key]
                                  ? 'text-[var(--text-muted)] line-through'
                                  : 'text-[var(--text-secondary)] group-hover:text-[var(--text)]',
                              )}
                            >
                              {step}
                            </span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                {seg.tip && (
                  <p className="text-xs text-mint/90 flex gap-2 items-start">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{seg.tip}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {diagrams.length > 0 && (
          <LessonDiagramGallery
            diagrams={diagrams}
            title="See it on the guitar"
            subtitle="Match the diagram to your instrument, then try the shape slowly."
          />
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/70 p-4">
            <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-2">
              <Target className="w-4 h-4 text-mint" />
              Goals
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              {lesson.goals.map((g) => (
                <li key={g} className="flex gap-2">
                  <span className="text-mint mt-0.5">▸</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/70 p-4">
            <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">
              Theory bite
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{lesson.theoryBite}</p>
          </div>
        </div>

        {pl?.commonMistakes?.length ? (
          <div className="rounded-2xl border border-lime/25 bg-lime/5 p-4">
            <h3 className="text-sm font-semibold text-lime/90">Watch for these</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--text-secondary)]">
              {pl.commonMistakes.map((m) => (
                <li key={m} className="flex gap-2">
                  <span className="text-lime/80">·</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-2xl border border-mint/25 bg-mint/5 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-mint">Win condition</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {pl?.winCondition || lesson.masteryCheck}
          </p>
          {pl?.encouragement && (
            <p className="text-sm text-mint/80 italic leading-relaxed">{pl.encouragement}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            className={clsx('btn-ghost text-xs', easyOn && 'border-mint/40 text-mint')}
            onClick={() => setEasyOn((v) => !v)}
            aria-expanded={easyOn}
          >
            {easyOn ? 'Easy mode on' : 'Having a hard day? Easy mode'}
          </button>
          {pl?.funBonus && (
            <span className="text-xs text-[var(--text-muted)]">Bonus: {pl.funBonus}</span>
          )}
        </div>
        {easyOn && pl?.easyMode && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-3 text-sm text-[var(--text-secondary)]">
            {pl.easyMode}
          </div>
        )}

        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-2">
                <Library className="w-4 h-4" />
                Related library
              </h3>
              <Link to="/library" className="text-xs text-mint hover:underline">
                Browse all
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/library?item=${encodeURIComponent(item.id)}`}
                  className="rounded-xl border border-[var(--border)] px-3 py-2.5 hover:border-mint/40 transition-colors"
                >
                  <div className="text-sm font-medium truncate">{item.title}</div>
                  <div className="text-[11px] text-[var(--text-muted)] capitalize mt-0.5">
                    {item.kind} · {item.skill}
                    {item.key ? ` · ${item.key}` : ''}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <LessonReflection lesson={lesson} onNext={() => go(day + 1)} />
        <div className="flex flex-wrap gap-2 pt-1">
          <Link to="/practice" className="btn-secondary">
            <Guitar className="w-4 h-4" />
            Open fretboard
          </Link>
          {!done && day < 365 && (
            <button type="button" className="btn-ghost" onClick={() => go(day + 1)}>
              Skip to next day
            </button>
          )}
        </div>
      </article>

      <section className="card p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold">Nearby days</h3>
          <p className="text-xs text-[var(--text-muted)]">Jump around the path</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {nearby.map((d) => {
            const l = CURRICULUM[d - 1]
            const isDone = completed.includes(d)
            const nTone = PHASE_TONE[l.phase]
            return (
              <button
                key={d}
                type="button"
                onClick={() => go(d)}
                className={clsx(
                  'text-left rounded-xl border px-3 py-2.5 transition-colors',
                  d === day ? 'border-mint/50 bg-mint/10' : 'border-[var(--border)] hover:border-mint/35',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-[var(--text-muted)]">Day {d}</div>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </div>
                <div className="text-sm font-medium truncate mt-0.5">{l.title}</div>
                <div className={clsx('text-[11px] capitalize mt-1', nTone.soft)}>{l.phase}</div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
