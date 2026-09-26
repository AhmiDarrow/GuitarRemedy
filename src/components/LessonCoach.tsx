import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getLesson, type Lesson } from '../data/curriculum'
import { practiceGuide } from '../data/practiceGuide'
import { dueLessons, EMPTY_SESSION, useLessonStore, type Confidence } from '../store/lessonStore'
import { useAppStore } from '../store/appStore'

export function LessonCoach({ lesson }: { lesson: Lesson }) {
  const guide = practiceGuide(lesson)
  const [showHelp, setShowHelp] = useState(false)
  const [showRecall, setShowRecall] = useState(false)
  const previous = getLesson(lesson.day - 1)
  return <section className="coach-card space-y-5" aria-labelledby="practice-focus">
    <div className="flex flex-wrap justify-between gap-3 items-start">
      <div><p className="coach-eyebrow">Today’s practice focus</p>
        <h3 id="practice-focus" className="font-display text-xl font-semibold mt-1">One clear win, at your pace.</h3></div>
      <Link to="/practice" state={{ tool: 'tuner' }} className="btn-ghost text-sm">Tune up first</Link>
    </div>
    <p className="text-sm text-mint leading-relaxed">{lesson.masteryCheck}</p>
    {previous && <div className="coach-recall">
      <p className="text-sm font-semibold">Before you start · 60-second recall</p>
      <p className="text-sm text-[var(--text-muted)] mt-1">Try yesterday’s skill from memory: {previous.title}. Then check the target.</p>
      <button className="text-sm text-mint mt-2 underline underline-offset-4" type="button" aria-expanded={showRecall} onClick={() => setShowRecall(!showRecall)}>{showRecall ? 'Hide recall target' : 'Reveal recall target'}</button>
      {showRecall && <p className="text-sm mt-2">{previous.masteryCheck} <Link className="text-mint underline" to={`/learn/${previous.day}`}>Revisit lesson</Link></p>}
    </div>}
    <div className="grid md:grid-cols-2 gap-5">
      <div><p className="coach-eyebrow">01 · Try it on your guitar</p><p className="text-sm leading-relaxed mt-2">{guide.example}</p></div>
      <div><p className="coach-eyebrow">02 · Listen and adjust</p><p className="text-sm leading-relaxed mt-2">{guide.listen}</p>
        <p className="text-sm text-[var(--text-muted)] mt-2">Repeat three times. If two attempts break down, simplify. If all three feel controlled, try a small tempo increase.</p></div>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <button className="btn-secondary text-sm" type="button" aria-expanded={showHelp} onClick={() => setShowHelp(!showHelp)}>{showHelp ? 'Hide smaller step' : 'Stuck? Make it smaller'}</button>
      <Link to="/practice" state={{ tool: 'metronome' }} className="btn-ghost text-sm">Open metronome</Link>
      <a href="#lesson-check" className="btn-ghost text-sm">Jump to self-check</a>
      <span className="text-xs text-[var(--text-muted)]">Lesson checkboxes and notes save on this device.</span>
    </div>
    {showHelp && <p className="coach-recall text-sm leading-relaxed" role="status">{guide.rescue}</p>}
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
    <div><p className="coach-eyebrow">03 · Check without the instructions</p>
      <h3 id="lesson-check" tabIndex={-1} className="font-display text-xl font-semibold mt-1 scroll-mt-6">What can you repeat?</h3></div>
    <p className="text-sm leading-relaxed">{lesson.masteryCheck}</p>
    <p className="text-sm text-[var(--text-muted)]">Try the target twice without reading the steps. This is your own assessment; the app is not listening or grading your playing. Repeating a lesson is part of learning.</p>
    <fieldset><legend className="text-sm font-medium mb-2">How did it feel?</legend>
      <div className="grid sm:grid-cols-3 gap-2">{RATINGS.map(r => <label key={r.value} className={`coach-rating ${rating === r.value ? 'is-selected' : ''}`}>
        <input type="radio" name="lesson-confidence" value={r.value} checked={rating === r.value} onChange={() => { setRating(r.value); setSaved(false) }} className="accent-[var(--mint)]" />
        <span><span className="block text-sm font-semibold">{r.title}</span><span className="block text-xs text-[var(--text-muted)] mt-1">{r.detail}</span></span>
      </label>)}</div>
    </fieldset>
    <label className="block text-sm">A note for your next practice <span className="text-[var(--text-muted)]">(optional · saved as you type)</span>
      <textarea className="coach-note mt-2" rows={2} maxLength={500} value={session.note} placeholder="e.g. C → D was clean at 50 BPM. Try the change again tomorrow." onChange={e => update(lesson.day, { note: e.target.value })} />
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
