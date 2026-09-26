import { useMemo } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { getLesson, getPhaseMeta } from '../data/curriculum'
import { getLibraryItem } from '../data/library'
import { diagramsForLesson } from '../data/lessonImagery'
import { LessonDiagramGallery } from '../components/LessonDiagram'
import { LessonCoach, LessonReflection } from '../components/LessonCoach'
import { useAppStore } from '../store/appStore'
import { EMPTY_SESSION, useLessonStore } from '../store/lessonStore'

const SEG_LABEL: Record<string, string> = {
  arrive: 'Get ready', warmup: 'Warm up', teach: 'Understand',
  guided: 'Practice', jam: 'Make music', cooldown: 'Finish',
}

export function LearnPage() {
  const { day: dayParam } = useParams()
  const currentDay = useAppStore(s => s.currentDay)
  const raw = Number(dayParam ?? currentDay)
  const day = Number.isFinite(raw) ? Math.max(1, Math.min(365, Math.floor(raw))) : 1
  if (dayParam !== String(day)) return <Navigate to={`/learn/${day}`} replace />
  return <LessonContent key={day} day={day} />
}

function LessonContent({ day }: { day: number }) {
  const navigate = useNavigate()
  const completed = useAppStore(s => s.completedLessons)
  const setCurrentDay = useAppStore(s => s.setCurrentDay)
  const lesson = getLesson(day)!
  const pl = lesson.privateLesson
  const done = completed.includes(day)
  const phases = getPhaseMeta()
  const phase = phases.find(p => p.phase === lesson.phase)!
  const completedInPhase = completed.filter(d => d >= phase.start && d <= phase.end).length
  const phasePct = Math.round(completedInPhase / (phase.end - phase.start + 1) * 100)
  const session = useLessonStore(s => s.sessions[day] ?? EMPTY_SESSION)
  const update = useLessonStore(s => s.update)
  const segments = pl.segments
  const activeSeg = Math.max(0, Math.min(segments.length - 1, Math.floor(session.segment) || 0))
  const seg = segments[activeSeg]
  const diagrams = useMemo(() => diagramsForLesson(lesson), [lesson])
  const related = lesson.libraryIds.map(getLibraryItem).filter(item => item != null)
  const nearby = [-2, -1, 0, 1, 2].map(n => day + n).filter(n => n >= 1 && n <= 365)
  const go = (next: number) => {
    setCurrentDay(next)
    navigate(`/learn/${next}`)
  }

  return <div className="lesson-page space-y-5 animate-fade-up">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="coach-eyebrow">Your guitar path</p>
        <h1 className="font-display text-2xl font-bold mt-1">Let’s play.</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Lesson {day} of 365 · Learn at your own pace</p>
      </div>
      <div className="flex gap-2">
        <button type="button" aria-label="Previous lesson" className="btn-ghost !px-3" disabled={day <= 1} onClick={() => go(day - 1)}><ChevronLeft className="w-4 h-4" /></button>
        <button type="button" aria-label="Next lesson" className="btn-ghost !px-3" disabled={day >= 365} onClick={() => go(day + 1)}><ChevronRight className="w-4 h-4" /></button>
      </div>
    </header>

    <article className="space-y-5">
      <div>
        <div className="flex flex-wrap gap-2 text-xs items-center">
          <span className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-mint capitalize">{lesson.phase}</span>
          {done && <span className="inline-flex items-center gap-1 text-mint"><CheckCircle2 className="w-4 h-4" /> Completed · practice again anytime</span>}
        </div>
        <h2 className="text-xl md:text-2xl font-semibold mt-3">{lesson.title}</h2>
        <p className="text-sm leading-relaxed mt-2"><strong className="text-mint">Your goal: </strong>{lesson.masteryCheck}</p>
      </div>

      <LessonCoach lesson={lesson} />

      {diagrams.length > 0 && <div className="card p-4 space-y-3">
        <LessonDiagramGallery diagrams={diagrams} title="Your guitar map" subtitle="Match the string names on the picture to your guitar." />
        <p className="text-sm text-[var(--text-muted)]">○ = play the string open · × = leave it silent · a dot = press at that fret. Read the string labels beneath each chord picture; e is the thinnest E.</p>
      </div>}

      {related.length > 0 && <details className="card lesson-disclosure p-4" open={day === 12 || day === 16}>
        <summary>Lesson materials · diagrams, tabs, and playback</summary>
        <p className="text-sm text-[var(--text-muted)] mt-3">Open a chord, scale, or song to explore it. Your place in this lesson is saved.</p>
        <div className="grid sm:grid-cols-2 gap-2 mt-3">{related.map(item => <Link key={item.id} to={`/library?item=${encodeURIComponent(item.id)}`} className="coach-recall hover:border-mint/50">
          <span className="block text-sm font-semibold">{item.title}</span><span className="block text-xs capitalize text-[var(--text-muted)] mt-1">{item.kind} · Open in library</span>
        </Link>)}</div>
      </details>}

      <LessonReflection lesson={lesson} onNext={() => go(day + 1)} />

      <details className="card lesson-disclosure p-4 md:p-5">
        <summary>Want more practice? Full session · about {pl.durationMin} minutes</summary>
        <p className="text-sm text-[var(--text-muted)] mt-3">Optional extra practice. The times are suggestions. You can repeat a section or finish early.</p>
        <nav aria-label="Full session sections" className="flex flex-wrap gap-2 mt-4">
          {segments.map((s, i) => <button key={s.id} type="button" className={i === activeSeg ? 'btn-secondary text-sm' : 'btn-ghost text-sm'} aria-pressed={i === activeSeg} onClick={() => update(day, { segment: i })}>
            {SEG_LABEL[s.id]} · {s.minutes} min
          </button>)}
        </nav>
        {seg && <div className="coach-recall mt-4 space-y-3">
          <h3 className="font-semibold">{SEG_LABEL[seg.id]}</h3>
          <p className="text-sm leading-relaxed">{seg.coach}</p>
          <ul className="space-y-3">{seg.youDo.map((instruction, i) => {
            const key = `${seg.id}-${i}`
            return <li key={key}><label className="flex items-start gap-3 cursor-pointer text-sm leading-relaxed">
              <input type="checkbox" className="accent-[var(--mint)] mt-1" checked={!!session.checked[key]} onChange={() => update(day, { checked: { ...session.checked, [key]: !session.checked[key] } })} />
              <span className={session.checked[key] ? 'text-[var(--text-muted)]' : ''}>{instruction}</span>
            </label></li>
          })}</ul>
          {seg.tip && <p className="text-sm text-mint">{seg.tip}</p>}
          <div className="flex flex-wrap gap-2 pt-2">
            <button type="button" className="btn-ghost text-sm" disabled={activeSeg === 0} onClick={() => update(day, { segment: activeSeg - 1 })}>Previous section</button>
            {activeSeg < segments.length - 1
              ? <button type="button" className="btn-secondary text-sm" onClick={() => update(day, { segment: activeSeg + 1 })}>Next section</button>
              : <a href="#lesson-check" className="btn-secondary text-sm">Return to self-check</a>}
          </div>
        </div>}
      </details>

      <details className="card lesson-disclosure p-4 md:p-5">
        <summary>Understand the idea behind this lesson</summary>
        <p className="text-sm leading-relaxed mt-3">{lesson.theoryBite}</p>
        <h3 className="text-sm font-semibold text-mint mt-4">What you are learning</h3>
        <ul className="list-disc pl-5 text-sm space-y-2 mt-2">{lesson.goals.map(goal => <li key={goal}>{goal}</li>)}</ul>
        <h3 className="text-sm font-semibold text-mint mt-4">Common problems to check</h3>
        <ul className="list-disc pl-5 text-sm space-y-2 mt-2">{pl.commonMistakes.map(m => <li key={m}>{m}</li>)}</ul>
      </details>
    </article>

    <details className="card lesson-disclosure p-4 md:p-5">
      <summary>Your progress & other lessons · {completed.length} completed</summary>
      <p className="text-sm text-[var(--text-muted)] mt-3 capitalize">{lesson.phase}: {completedInPhase} of {phase.end - phase.start + 1} complete</p>
      <div role="progressbar" aria-label="Phase completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={phasePct} className="h-2 rounded-full bg-ink/60 overflow-hidden mt-3"><div className="h-full bg-mint" style={{ width: `${phasePct}%` }} /></div>
      <div className="flex flex-wrap gap-2 mt-4">{phases.map(p => <button type="button" key={p.phase} className="btn-ghost text-sm capitalize" onClick={() => go(p.start)}>{p.phase} · {p.start}–{p.end}</button>)}</div>
      <h3 className="font-semibold text-sm mt-5 mb-2">Nearby lessons</h3>
      <div className="grid sm:grid-cols-2 gap-2">{nearby.map(d => <button type="button" key={d} onClick={() => go(d)} aria-current={d === day ? 'page' : undefined} className="coach-recall text-left text-sm hover:border-mint/50">
        <span className="text-mint">Lesson {d}{completed.includes(d) ? ' · Completed' : ''}</span><span className="block mt-1">{getLesson(d)!.title}</span>
      </button>)}</div>
    </details>
  </div>
}
