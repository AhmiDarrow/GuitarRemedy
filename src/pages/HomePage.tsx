import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Flame, Guitar, Library, Upload } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { getLesson } from '../data/curriculum'
import { LIBRARY } from '../data/library'

export function HomePage() {
  const displayName = useAppStore((s) => s.displayName)
  const currentDay = useAppStore((s) => s.currentDay)
  const streak = useAppStore((s) => s.streak)
  const completed = useAppStore((s) => s.completedLessons)
  const lesson = getLesson(currentDay) ?? getLesson(1)!
  const progress = Math.round((completed.length / 365) * 100)
  const featured = LIBRARY.filter((i) => i.kind === 'scale' || i.kind === 'riff').slice(0, 3)

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#06120c] via-[#030705] to-[#020403] p-6 md:p-8 min-h-[220px] md:min-h-[260px]">
        <img
          src="/assets/hero-dark-forest.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030705] via-[#030705]/85 to-transparent" />
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-mint/10 blur-3xl" />
        <div className="relative">
          <p className="text-sm text-[var(--text-muted)]">Welcome back, {displayName}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-1">
            Keep the streak alive
          </h1>
          <p className="text-[var(--text-muted)] mt-2 max-w-xl text-sm md:text-base">
            Scales, tabs, a 365-day path, and Option A song breakdown — MIDI, MusicXML, and light audio assist.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to={`/learn/${currentDay}`} className="btn-primary">
              Day {currentDay}: {lesson.title}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/practice" className="btn-secondary">
              <Guitar className="w-4 h-4" /> Practice
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Streak', value: `${streak}d`, icon: Flame, tone: 'text-mint' },
          { label: 'Path day', value: String(currentDay), icon: BookOpen, tone: 'text-sky-400' },
          { label: 'Completed', value: String(completed.length), icon: Library, tone: 'text-emerald-400' },
          { label: 'Progress', value: `${progress}%`, icon: Upload, tone: 'text-violet-400' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">{label}</span>
              <Icon className={`w-4 h-4 ${tone}`} />
            </div>
            <div className="font-display text-2xl font-bold mt-2">{value}</div>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-display font-semibold text-lg">Today&apos;s lesson</h2>
          <p className="text-sm text-mint/90 mt-1">Day {lesson.day} · {lesson.phase} · ~{lesson.durationMin} min</p>
          <h3 className="font-medium mt-3">{lesson.title}</h3>
          <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">{lesson.theoryBite}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {lesson.goals.slice(0, 3).map((g) => (
              <li key={g} className="flex gap-2">
                <span className="text-mint">•</span> {g}
              </li>
            ))}
          </ul>
          <Link to={`/learn/${lesson.day}`} className="btn-primary mt-5 w-full sm:w-auto">
            Open lesson
          </Link>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg">From the library</h2>
            <Link to="/library" className="text-xs text-mint hover:underline">See all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {featured.map((item) => (
              <Link
                key={item.id}
                to="/library"
                className="block rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 hover:border-mint/40 transition-colors"
              >
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5 capitalize">
                  {item.kind} · {item.skill}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/upload" className="btn-secondary text-sm">
              <Upload className="w-4 h-4" /> Break down a song
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
