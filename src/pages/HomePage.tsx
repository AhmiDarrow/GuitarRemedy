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
import { useI18n } from '../i18n/useI18n'
import { kindLabel, phaseLabel, presentLesson, presentLibraryItem, skillLabel } from '../i18n/present'

export function HomePage() {
  const { tx, tCount, formatDayStamp, locale } = useI18n()
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

  const lesson = useMemo(() => {
    const source = getLesson(currentDay) ?? getLesson(1) ?? CURRICULUM[0]
    return source ? presentLesson(source) : source
  }, [currentDay, locale, tx])
  const progress = Math.round((completed.length / CURRICULUM.length) * 100)
  const phaseText = lesson?.phase ? phaseLabel(lesson.phase) : tx('Path')
  const hello = displayName?.trim() ? displayName.trim() : tx('Player')
  const quick: {
    to: string
    label: string
    hint: string
    icon: typeof Guitar
    state?: Record<string, unknown>
  }[] = [
    { to: '/learn', label: tx('Lessons'), hint: tx('Day 1–365'), icon: BookOpen },
    { to: '/practice', label: tx('Fretboard'), hint: tx('Scales lab'), icon: Guitar, state: { tool: 'fretboard' } },
    { to: '/practice', label: tx('Metronome'), hint: tx('Keep time'), icon: Gauge, state: { tool: 'metronome' } },
    { to: '/practice', label: tx('Tuner'), hint: tx('Chromatic'), icon: AudioLines, state: { tool: 'tuner' } },
    { to: '/library', label: tx('Library'), hint: tx('Free tabs'), icon: Library },
    { to: '/upload', label: tx('Song → tabs'), hint: tx('Convert'), icon: Upload },
    { to: '/wiki', label: tx('Wiki'), hint: tx('Theory'), icon: ScrollText },
  ]

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
        aria-label={tx('Welcome')}
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
          <p className="text-sm text-[var(--text-muted)] mt-2">{tx('Welcome back, {name}', { name: hello })}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-1 max-w-xl">
            {streak > 0 ? tx('A little practice. A little progress.') : tx('Your next song starts here.')}
          </h1>
          <p className="text-[var(--text-muted)] mt-2 max-w-lg text-sm md:text-base leading-relaxed">
            {tx('Tune up, find your rhythm, and learn something you can play today. Your next lesson is ready when you are.')}
          </p>
          <div className="flex flex-wrap gap-2.5 mt-5">
            <Link to={`/learn/${currentDay}`} className="btn-primary">
              {lesson
                ? tx('Day {day}: {title}', { day: currentDay, title: lesson.title })
                : tx('Day {day}', { day: currentDay })}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/practice" state={{ tool: 'tuner' }} className="btn-secondary">
              <AudioLines className="w-4 h-4" /> {tx('Tune up first')}
            </Link>
            <Link to="/upload" className="btn-secondary">
              <Upload className="w-4 h-4" /> {tx('Song → tabs')}
            </Link>
          </div>
        </div>
      </section>

      <ReviewQueue />

      {/* Stats + path bar */}
      <section className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'streak', label: tx('Streak'), value: tx('{n}d', { n: streak }), icon: Flame, tone: 'text-mint' },
            { id: 'path', label: tx('Path day'), value: String(currentDay), icon: BookOpen, tone: 'text-lime' },
            { id: 'done', label: tx('Completed'), value: String(completed.length), icon: Library, tone: 'text-teal' },
            { id: 'progress', label: tx('Progress'), value: tx('{n}%', { n: progress }), icon: Guitar, tone: 'text-soft' },
          ].map(({ id, label, value, icon: Icon, tone }) => (
            <div key={id} className="card p-4">
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
              {tx('365-day path · {phase}', { phase: phaseText })}
              {lastPracticeDate ? tx(' · last practice {date}', { date: formatDayStamp(lastPracticeDate) }) : ''}
            </span>
            <span className="font-display font-bold text-mint tabular-nums shrink-0">
              {tx('{n}%', { n: progress })}
            </span>
          </div>
          <div
            className="h-1.5 rounded-full bg-black/40 border border-[var(--border)] overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={tx('Lesson path progress')}
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
            {tx('Up next · Day {day}', { day: lesson?.day ?? currentDay })}
          </p>
          <h2 className="font-display font-semibold text-lg mt-1 leading-snug">
            {lesson?.title ?? tx('Open your path')}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {phaseText}
            {lesson?.durationMin != null ? tx(' · ~{n} min', { n: lesson.durationMin }) : ''}
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
            {tx('Open lesson')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="card p-5 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display font-semibold text-lg">{tx('From the library')}</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {favorites.length > 0
                  ? tx('{favorites} · free-license only', { favorites: tCount('favorites', favorites.length) })
                  : tx('Open scales, riffs, and songs')}
              </p>
            </div>
            <Link to="/library" className="text-xs text-mint hover:underline shrink-0">
              {tx('See all')}
            </Link>
          </div>
          <div className="mt-4 space-y-2.5 flex-1">
            {featured.map((source) => {
              const item = presentLibraryItem(source)
              const kind = kindLabel(item.kind)
              const skill = skillLabel(item.skill)
              return (
              <Link
                key={item.id}
                to={`/library?item=${encodeURIComponent(item.id)}`}
                className="block rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/70 px-4 py-3 hover:border-mint/40 transition-colors"
              >
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5 capitalize">
                  {favorites.includes(item.id)
                    ? tx('{kind} · {skill} · favorite', { kind, skill })
                    : tx('{kind} · {skill}', { kind, skill })}
                </div>
              </Link>
              )
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/library?mine=1" className="btn-secondary text-sm">
              <Library className="w-4 h-4" />
              {userTabCount > 0 ? tx('Your tabs ({n})', { n: userTabCount }) : tx('Your tabs')}
            </Link>
            <Link to="/upload" className="btn-secondary text-sm">
              <Upload className="w-4 h-4" /> {tx('Break down a song')}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick launch — same mental order as logo menu */}
      <section className="card p-5 space-y-3">
        <div>
          <h2 className="font-display font-semibold">{tx('Jump in')}</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {tx('Everything you need for a good practice, one click away.')}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {quick.map(({ to, label, hint, icon: Icon, state }) => (
            <Link
              key={state?.tool ? `${to}-${String(state.tool)}` : to}
              to={to}
              state={state}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-3 hover:border-mint/35 hover:bg-mint/5 transition-colors"
            >
              <span className="w-9 h-9 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-mint" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium break-words">{label}</span>
                <span className="block text-[11px] text-[var(--text-muted)] break-words">{hint}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
