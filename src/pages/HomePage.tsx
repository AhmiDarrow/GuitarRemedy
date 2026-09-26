import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  AudioLines,
  BookOpen,
  Flame,
  Gauge,
  Guitar,
  Library,
  ScrollText,
  Upload,
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { useUserTabsStore } from '../store/userTabsStore'
import { CURRICULUM, getLesson } from '../data/curriculum'
import { LIBRARY } from '../data/library'
import { APP_NAME } from '../lib/brand'
import { ReviewQueue } from '../components/LessonCoach'

const PHASE_LABEL: Record<string, string> = {
  basics: 'Basics',
  chords: 'Chords',
  scales: 'Scales',
  rhythm: 'Rhythm',
  lead: 'Lead',
  repertoire: 'Repertoire',
}

const QUICK: {
  to: string
  label: string
  hint: string
  icon: typeof Guitar
  state?: Record<string, unknown>
}[] = [
  { to: '/learn', label: 'Lessons', hint: 'Day 1–365', icon: BookOpen },
  { to: '/practice', label: 'Fretboard', hint: 'Scales lab', icon: Guitar, state: { tool: 'fretboard' } },
  { to: '/practice', label: 'Metronome', hint: 'Keep time', icon: Gauge, state: { tool: 'metronome' } },
  { to: '/practice', label: 'Tuner', hint: 'Chromatic', icon: AudioLines, state: { tool: 'tuner' } },
  { to: '/library', label: 'Library', hint: 'Free tabs', icon: Library },
  { to: '/upload', label: 'Song → tabs', hint: 'Convert', icon: Upload },
  { to: '/wiki', label: 'Wiki', hint: 'Theory', icon: ScrollText },
]

export function HomePage() {
  const displayName = useAppStore((s) => s.displayName)
  const currentDay = useAppStore((s) => s.currentDay)
  const streak = useAppStore((s) => s.streak)
  const completed = useAppStore((s) => s.completedLessons)
  const favorites = useAppStore((s) => s.favorites)
  const lastPracticeDate = useAppStore((s) => s.lastPracticeDate)

  const hydrateTabs = useUserTabsStore((s) => s.hydrate)
  const userTabCount = useUserTabsStore((s) => s.tabs.length)

  useEffect(() => {
    hydrateTabs()
  }, [hydrateTabs])

  const lesson = useMemo(
    () => getLesson(currentDay) ?? getLesson(1) ?? CURRICULUM[0],
    [currentDay],
  )
  const progress = Math.round((completed.length / CURRICULUM.length) * 100)
  const phaseLabel = PHASE_LABEL[lesson?.phase ?? ''] ?? lesson?.phase ?? 'Path'
  const hello = displayName?.trim() ? displayName.trim() : 'Player'

  const featured = useMemo(() => {
    const favSet = new Set(favorites)
    const favItems = LIBRARY.filter((i) => favSet.has(i.id)).slice(0, 3)
    if (favItems.length >= 3) return favItems
    const rest = LIBRARY.filter(
      (i) =>
        !favSet.has(i.id) &&
        (i.kind === 'scale' || i.kind === 'riff' || i.kind === 'song'),
    )
    return [...favItems, ...rest].slice(0, 3)
  }, [favorites])

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-up">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#06120c] via-[#030705] to-[#020403] min-h-[220px] md:min-h-[250px]"
        aria-label="Welcome"
      >
        <img
          src="/assets/hero-dark-forest.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          loading="eager"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030705] via-[#030705]/88 to-[#030705]/35" />
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-mint/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 w-40 h-32 rounded-full bg-lime/5 blur-3xl" />
        <div className="relative p-6 md:p-8 flex flex-col justify-end min-h-[220px] md:min-h-[250px]">
          <p className="text-xs uppercase tracking-widest text-mint/80 font-semibold">
            {APP_NAME}
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-2">Welcome back, {hello}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-1 max-w-xl">
            {streak > 0 ? 'A little practice. A little progress.' : 'Your next song starts here.'}
          </h1>
          <p className="text-[var(--text-muted)] mt-2 max-w-lg text-sm md:text-base leading-relaxed">
            Tune up, find your rhythm, and learn something you can play today.
            Your next lesson is ready when you are.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-5">
            <Link to={`/learn/${currentDay}`} className="btn-primary">
              Day {currentDay}
              {lesson ? `: ${lesson.title}` : ''}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/practice" state={{ tool: 'tuner' }} className="btn-secondary">
              <AudioLines className="w-4 h-4" /> Tune up first
            </Link>
            <Link to="/upload" className="btn-secondary">
              <Upload className="w-4 h-4" /> Song → tabs
            </Link>
          </div>
        </div>
      </section>

      <ReviewQueue />

      {/* Stats + path bar */}
      <section className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Streak', value: `${streak}d`, icon: Flame, tone: 'text-mint' },
            { label: 'Path day', value: String(currentDay), icon: BookOpen, tone: 'text-lime' },
            { label: 'Completed', value: String(completed.length), icon: Library, tone: 'text-teal' },
            { label: 'Progress', value: `${progress}%`, icon: Guitar, tone: 'text-soft' },
          ].map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                  {label}
                </span>
                <Icon className={`w-3.5 h-3.5 shrink-0 ${tone}`} />
              </div>
              <div className="font-display text-2xl font-bold mt-1.5 tabular-nums">{value}</div>
            </div>
          ))}
        </div>
        <div className="card px-4 py-3 space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
            <span>
              365-day path · {phaseLabel}
              {lastPracticeDate ? ` · last practice ${lastPracticeDate}` : ''}
            </span>
            <span className="font-display font-bold text-mint tabular-nums shrink-0">
              {progress}%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full bg-black/40 border border-[var(--border)] overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Lesson path progress"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-mint/80 to-lime/70 transition-[width] duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      </section>

      {/* Today + library */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-5 flex flex-col">
          <p className="text-[10px] uppercase tracking-widest text-mint/80 font-semibold">
            Up next · Day {lesson?.day ?? currentDay}
          </p>
          <h2 className="font-display font-semibold text-lg mt-1 leading-snug">
            {lesson?.title ?? 'Open your path'}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {phaseLabel}
            {lesson?.durationMin != null ? ` · ~${lesson.durationMin} min` : ''}
          </p>
          {lesson?.theoryBite ? (
            <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed line-clamp-4">
              {lesson.theoryBite}
            </p>
          ) : null}
          {lesson?.goals?.length ? (
            <ul className="mt-3 space-y-1.5 text-sm flex-1">
              {lesson.goals.slice(0, 3).map((g) => (
                <li key={g} className="flex gap-2">
                  <span className="text-mint shrink-0">•</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-1" />
          )}
          <Link
            to={`/learn/${lesson?.day ?? currentDay}`}
            className="btn-primary mt-5 w-full sm:w-auto self-start"
          >
            Open lesson
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="card p-5 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display font-semibold text-lg">From the library</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {favorites.length > 0
                  ? `${favorites.length} favorite${favorites.length === 1 ? '' : 's'} · free-license only`
                  : 'Open scales, riffs, and songs'}
              </p>
            </div>
            <Link to="/library" className="text-xs text-mint hover:underline shrink-0">
              See all
            </Link>
          </div>
          <div className="mt-4 space-y-2.5 flex-1">
            {featured.map((item) => (
              <Link
                key={item.id}
                to={`/library?item=${encodeURIComponent(item.id)}`}
                className="block rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/70 px-4 py-3 hover:border-mint/40 transition-colors"
              >
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5 capitalize">
                  {item.kind} · {item.skill}
                  {favorites.includes(item.id) ? ' · favorite' : ''}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/library?mine=1" className="btn-secondary text-sm">
              <Library className="w-4 h-4" />
              Your tabs{userTabCount > 0 ? ` (${userTabCount})` : ''}
            </Link>
            <Link to="/upload" className="btn-secondary text-sm">
              <Upload className="w-4 h-4" /> Break down a song
            </Link>
          </div>
        </div>
      </section>

      {/* Quick launch — same mental order as logo menu */}
      <section className="card p-5 space-y-3">
        <div>
          <h2 className="font-display font-semibold">Jump in</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Everything you need for a good practice, one click away.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {QUICK.map(({ to, label, hint, icon: Icon, state }) => (
            <Link
              key={`${to}-${label}`}
              to={to}
              state={state}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-3 hover:border-mint/35 hover:bg-mint/5 transition-colors"
            >
              <span className="w-9 h-9 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-mint" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium truncate">{label}</span>
                <span className="block text-[11px] text-[var(--text-muted)] truncate">{hint}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
