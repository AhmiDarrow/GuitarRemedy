import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLesson, type Lesson } from '../data/curriculum'
import { practiceGuide } from '../data/practiceGuide'
import { dueLessons, EMPTY_SESSION, useLessonStore, type Confidence } from '../store/lessonStore'
import { useAppStore } from '../store/appStore'
import { teachingSteps, termsForLesson } from '../data/teachingSteps'

export function LessonCoach({ lesson }: { lesson: Lesson }) {
  const guide = practiceGuide(lesson)
  const [showHelp, setShowHelp] = useState(false)
  const [showRecall, setShowRecall] = useState(false)
  const savedStep = useLessonStore(s => s.sessions[lesson.day]?.practiceStep ?? 0)
  const update = useLessonStore(s => s.update)
  const steps = teachingSteps(lesson)
  const step = Math.max(0, Math.min(steps.length - 1, Math.floor(savedStep) || 0))
  const heading = useRef<HTMLHeadingElement>(null)
  const previousStep = useRef(step)
  useEffect(() => {
    if (previousStep.current !== step) heading.current?.focus()
    previousStep.current = step
  }, [step])
  const previous = getLesson(lesson.day - 1)
  return <section className="coach-card space-y-5" aria-labelledby="practice-focus">
    <div className="flex flex-wrap justify-between gap-3 items-start">
      <div><p className="coach-eyebrow">Start here</p>
        <h3 id="practice-focus" className="text-xl font-semibold mt-1">One step at a time.</h3></div>
      <Link to="/practice" state={{ tool: 'tuner' }} className="btn-ghost text-sm">Tune up first</Link>
    </div>
    <p className="text-sm leading-relaxed">Take as long as you need on each step. You can stop and return here later. The lesson number is a place in the path, not a deadline.</p>
    <div className="practice-step-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="coach-eyebrow">Step {step + 1} of {steps.length}</p>
        <nav aria-label="Practice steps" className="flex gap-1.5">{steps.map((s, i) => <button type="button" key={s.title} aria-label={`Go to practice step ${i + 1}`} aria-current={i === step ? 'step' : undefined} className={`practice-step-dot ${i === step ? 'is-current' : ''}`} onClick={() => update(lesson.day, { practiceStep: i })}>{i + 1}</button>)}</nav>
      </div>
      <h4 ref={heading} tabIndex={-1} className="text-lg font-semibold mt-4 scroll-mt-24" id="current-practice-step">{steps[step].title}</h4>
      <p className="practice-instruction mt-2">{steps[step].instruction}</p>
      {lesson.day === 9 && step >= 2 && <div className="mt-4 overflow-x-auto">
        <table className="rhythm-count" aria-label="Strum pattern: down, down up, down, down up"><tbody>
          <tr><th scope="row">Count</th>{['1', '&', '2', '&', '3', '&', '4', '&'].map((beat, i) => <td key={i}>{beat}</td>)}</tr>
          <tr><th scope="row">Strum</th>{['↓', '–', '↓', '↑', '↓', '–', '↓', '↑'].map((stroke, i) => <td key={i}>{stroke}</td>)}</tr>
        </tbody></table><p className="text-xs text-[var(--text-muted)] mt-2">↓ down · ↑ up · – move the hand without touching the strings. & means “and.”</p>
      </div>}
      <div className="flex flex-wrap gap-2 mt-5">
        <button type="button" className="btn-ghost" disabled={step === 0} onClick={() => update(lesson.day, { practiceStep: step - 1 })}>Previous step</button>
        {step < steps.length - 1
          ? <button type="button" className="btn-primary" onClick={() => update(lesson.day, { practiceStep: step + 1 })}>Next step</button>
          : <a href="#lesson-check" className="btn-primary">Try the self-check</a>}
      </div>
    </div>
    <div><p className="coach-eyebrow">What to listen for</p><p className="text-sm leading-relaxed mt-2">{guide.listen}</p>
      <p className="text-sm text-[var(--text-muted)] mt-2">Try the exercise three times slowly. If it keeps breaking down, use the smaller step below. Clear, comfortable playing matters more than speed.</p></div>
    <div className="flex flex-wrap items-center gap-3">
      <button className="btn-secondary text-sm" type="button" aria-expanded={showHelp} onClick={() => setShowHelp(!showHelp)}>{showHelp ? 'Hide smaller step' : 'Stuck? Make it smaller'}</button>
      <Link to="/practice" state={{ tool: 'metronome' }} className="btn-ghost text-sm">Open metronome</Link>
      <a href="#lesson-check" className="btn-ghost text-sm">Jump to self-check</a>
    </div>
    {showHelp && <p className="coach-recall text-sm leading-relaxed" role="status">{guide.rescue}</p>}
    <details className="lesson-disclosure"><summary>What do these words mean?</summary><dl className="mt-3 space-y-3">{termsForLesson(lesson).map(t => <div key={t.term}><dt className="font-semibold text-sm text-mint">{t.term}</dt><dd className="text-sm leading-relaxed mt-1">{t.meaning}</dd></div>)}</dl></details>
    {previous && <details className="lesson-disclosure"><summary>Optional warm-up: revisit the previous lesson</summary><div className="mt-3">
      <p className="text-sm text-[var(--text-muted)] mt-1">If you have practiced lesson {previous.day}, try its skill from memory: {previous.title}.</p>
      <button className="text-sm text-mint mt-2 underline underline-offset-4" type="button" aria-expanded={showRecall} onClick={() => setShowRecall(!showRecall)}>{showRecall ? 'Hide recall target' : 'Reveal recall target'}</button>
      {showRecall && <p className="text-sm mt-2">{previous.masteryCheck} <Link className="text-mint underline" to={`/learn/${previous.day}`}>Revisit lesson</Link></p>}
    </div></details>}
  </section>
}

const RATINGS: { value: Confidence; title: string; detail: string }[] = [
  { value: 'building', title: 'Still building', detail: 'I need a smaller step.' },
  { value: 'steady', title: 'Getting steady', detail: 'I can do it with support.' },
  { value: 'ready', title: 'Ready to move on', detail: 'I can repeat the target on my own.' },
]

export function LessonReflection({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const session = useLessonStore(s => s.sessions[lesson.day] ?? EMPTY_SESSION)
  const update = useLessonStore(s => s.update)
  const assess = useLessonStore(s => s.assess)
  const [rating, setRating] = useState<Confidence | undefined>()
  const [saved, setSaved] = useState(false)
  const done = useAppStore(s => s.completedLessons.includes(lesson.day))
  const save = () => {
    if (!rating) return
    assess(lesson.day, rating)
    useAppStore.getState().recordPractice()
    if (rating === 'ready') useAppStore.getState().completeLesson(lesson.day)
    setSaved(true)
  }
  return <section className="coach-card space-y-4" aria-labelledby="lesson-check">
    <div><p className="coach-eyebrow">When you feel ready</p>
      <h3 id="lesson-check" tabIndex={-1} className="text-xl font-semibold mt-1 scroll-mt-24">Try it on your own.</h3></div>
    <p className="text-sm leading-relaxed">{lesson.masteryCheck}</p>
    <p className="text-sm text-[var(--text-muted)]">Try the target twice without reading the steps. Choose the answer that fits today. Every answer saves your practice; only “Ready to move on” completes the lesson. The app does not listen to or grade your playing.</p>
    <fieldset><legend className="text-sm font-medium mb-2">How did it feel?</legend>
      <div className="grid sm:grid-cols-3 gap-2">{RATINGS.map(r => <label key={r.value} className={`coach-rating ${rating === r.value ? 'is-selected' : ''}`}>
        <input type="radio" name="lesson-confidence" value={r.value} checked={rating === r.value} onChange={() => { setRating(r.value); setSaved(false) }} className="accent-[var(--mint)]" />
        <span><span className="block text-sm font-semibold">{r.title}</span><span className="block text-xs text-[var(--text-muted)] mt-1">{r.detail}</span></span>
      </label>)}</div>
    </fieldset>
    <label className="block text-sm">A note for your next practice <span className="text-[var(--text-muted)]">(optional · saved as you type)</span>
      <textarea className="coach-note mt-2" rows={2} maxLength={500} value={session.note} placeholder="e.g. The first two steps felt easier. Repeat the last step slowly next time." onChange={e => update(lesson.day, { note: e.target.value })} />
    </label>
    <div className="flex flex-wrap gap-2">
      <button className="btn-primary" type="button" disabled={!rating || saved} onClick={save}>{saved ? 'Practice saved' : rating === 'ready' ? 'Save & complete lesson' : 'Save practice'}</button>
      {done && lesson.day < 365 && <button className="btn-secondary" type="button" onClick={onNext}>Continue to day {lesson.day + 1}</button>}
    </div>
    {saved && <div role="status" className="coach-recall text-sm leading-relaxed">
      {rating === 'building' ? practiceGuide(lesson).rescue : rating === 'steady' ? 'Stay with this lesson. Try the target again with fewer prompts before moving on.' : 'Target achieved. Move on when you want, and return to this skill after a break.'}
      <p className="text-mint mt-2">Practice logged. Review scheduled for {session.reviewDue}.</p>
    </div>}
    {!saved && session.reviewDue && <p className="text-xs text-[var(--text-muted)]">Last check: {RATINGS.find(r => r.value === session.confidence)?.title} · Next review: {session.reviewDue}</p>}
  </section>
}

export function ReviewQueue() {
  const sessions = useLessonStore(s => s.sessions)
  const due = dueLessons(sessions)
  if (!due.length) return null
  return <section className="coach-card space-y-3" aria-label="Practice reviews">
    <p className="coach-eyebrow">Keep what you learned · {due.length} due for review</p>
    <h2 className="font-display text-xl font-semibold">A little recall before something new.</h2>
    <p className="text-sm text-[var(--text-muted)]">Try a previous target from memory, then save a fresh self-check to plan its next review.</p>
    <div className="grid sm:grid-cols-3 gap-2">{due.slice(0, 3).map(day => <Link key={day} className="coach-recall hover:border-mint/50" to={`/learn/${day}`}>
      <p className="text-xs text-mint">Review day {day}</p><p className="text-sm mt-1 font-medium">{getLesson(day)?.title}</p>
    </Link>)}</div>
  </section>
}
