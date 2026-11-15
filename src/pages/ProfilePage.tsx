import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AudioLines,
  BookOpen,
  Flame,
  Gauge,
  Guitar,
  Heart,
  Info,
  Library,
  ScrollText,
  Upload,
} from 'lucide-react'
import { LanguagePicker } from '../components/LanguagePicker'
import { NoteSpellingPicker } from '../components/NoteSpellingPicker'
import { NumberInput } from '../components/NumberInput'
import { useAppStore } from '../store/appStore'
import { useUserTabsStore } from '../store/userTabsStore'
import { TUNINGS, type TuningName } from '../lib/theory'
import { CURRICULUM, getLesson } from '../data/curriculum'
import { ABOUT_HELLO, APP_NAME, APP_VERSION } from '../lib/brand'
import { phaseLabel, presentLesson, presentTuningName } from '../i18n/present'
import { useI18n } from '../i18n/useI18n'

export function ProfilePage() {
  const { tx, tCount, formatDayStamp } = useI18n()
  const displayName = useAppStore((s) => s.displayName)
  const setDisplayName = useAppStore((s) => s.setDisplayName)
  const lefty = useAppStore((s) => s.lefty)
  const setLefty = useAppStore((s) => s.setLefty)
  const tuningName = useAppStore((s) => s.tuningName)
  const setTuningName = useAppStore((s) => s.setTuningName)
  const customTuning = useAppStore((s) => s.customTuning)
  const setCustomTuning = useAppStore((s) => s.setCustomTuning)
  const getTuning = useAppStore((s) => s.getTuning)
  const a4 = useAppStore((s) => s.a4)
  const setA4 = useAppStore((s) => s.setA4)
  const showDegrees = useAppStore((s) => s.showDegrees)
  const setShowDegrees = useAppStore((s) => s.setShowDegrees)
  const bpm = useAppStore((s) => s.bpm)
  const setBpm = useAppStore((s) => s.setBpm)
  const streak = useAppStore((s) => s.streak)
  const completed = useAppStore((s) => s.completedLessons)
  const currentDay = useAppStore((s) => s.currentDay)
  const favorites = useAppStore((s) => s.favorites)
  const lastPracticeDate = useAppStore((s) => s.lastPracticeDate)

  const hydrateTabs = useUserTabsStore((s) => s.hydrate)
  const userTabs = useUserTabsStore((s) => s.tabs)

  useEffect(() => {
    hydrateTabs()
  }, [hydrateTabs])

  const lesson = useMemo(
    () => getLesson(currentDay) ?? getLesson(1) ?? CURRICULUM[0],
    [currentDay],
  )
  const pct = Math.round((completed.length / CURRICULUM.length) * 100)
  const tuningLabel = presentTuningName(tuningName, TUNINGS[tuningName]?.name ?? tuningName)
  const phaseText = lesson ? phaseLabel(lesson.phase) : tx('Path')
  const shownLesson = lesson ? presentLesson(lesson) : null

  return (
    <div className="space-y-6 max-w-xl animate-fade-up">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#06120c] via-[#030705] to-[#020403]">
        <img
          src="/assets/brand-mark.png"
          alt=""
          className="absolute right-0 top-0 h-full w-36 object-cover opacity-35 md:w-48"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030705] via-[#030705]/92 to-transparent" />
        <div className="relative p-5 md:p-6">
          <p className="text-xs uppercase tracking-widest text-mint/80 font-semibold">{tx('You')}</p>
          <h1 className="font-display text-3xl font-bold mt-1 tracking-tight">
            {displayName?.trim() || tx('Player')}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm">
            {tx('Progress, fretboard prefs, and shortcuts. Everything stays on this device.')}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-3">
            {tx('{name} · v{version} · local-first', { name: APP_NAME, version: APP_VERSION })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'streak', label: tx('Streak'), value: tx('{n}d', { n: streak }), icon: Flame, tone: 'text-mint' },
          { id: 'day', label: tx('Day'), value: String(currentDay), icon: BookOpen, tone: 'text-lime' },
          { id: 'done', label: tx('Done'), value: String(completed.length), icon: Library, tone: 'text-teal' },
          { id: 'path', label: tx('Path'), value: tx('{n}%', { n: pct }), icon: Guitar, tone: 'text-soft' },
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

      {/* Path progress + today */}
      <div className="card p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display font-semibold">{tx('365-day path')}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {lastPracticeDate
                ? tx('{done} of {total} lessons · {phase} · last practice {date}', {
                    done: completed.length,
                    total: CURRICULUM.length,
                    phase: phaseText,
                    date: formatDayStamp(lastPracticeDate),
                  })
                : tx('{done} of {total} lessons · {phase}', {
                    done: completed.length,
                    total: CURRICULUM.length,
                    phase: phaseText,
                  })}
            </p>
          </div>
          <span className="text-sm font-display font-bold text-mint tabular-nums shrink-0">
            {tx('{n}%', { n: pct })}
          </span>
        </div>
        <div
          className="h-2 rounded-full bg-black/40 border border-[var(--border)] overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={tx('Lesson path progress')}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-mint/80 to-lime/70 transition-[width] duration-500"
            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          />
        </div>
        {shownLesson ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-mint/80 font-semibold">
              {tx('Up next · Day {day}', { day: shownLesson.day })}
            </p>
            <p className="text-sm font-medium mt-1 leading-snug">{shownLesson.title}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{shownLesson.theoryBite}</p>
            <Link
              to={`/learn/${shownLesson.day}`}
              className="btn-primary mt-3 inline-flex text-sm px-4 py-2 rounded-xl"
            >
              {tx('Open lesson')}
            </Link>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-1">
            <Heart className="w-3 h-3 text-mint" />
            {tCount('favorites', favorites.length)}
          </span>
          <Link
            to="/library?mine=1"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-1 hover:border-mint/40 hover:text-mint transition-colors"
          >
            <Library className="w-3 h-3 text-mint" />
            {tCount('savedTabs', userTabs.length)}
          </Link>
        </div>
      </div>

      {/* Quick tools */}
      <div className="card p-5 space-y-3">
        <h2 className="font-display font-semibold">{tx('Shortcuts')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(
            [
              { to: '/practice', state: { tool: 'metronome' }, label: tx('Metronome'), icon: Gauge },
              { to: '/practice', state: { tool: 'tuner' }, label: tx('Tuner'), icon: AudioLines },
              { to: '/practice', state: { tool: 'fretboard' }, label: tx('Fretboard'), icon: Guitar },
              { to: '/library', label: tx('Library'), icon: Library },
              { to: '/upload', label: tx('Upload'), icon: Upload },
              { to: '/wiki', label: tx('Wiki'), icon: ScrollText },
            ] as const
          ).map((item) => {
            const Icon = item.icon
            const routeKey = 'state' in item ? `${item.to}:${item.state.tool}` : item.to
            return (
              <Link
                key={routeKey}
                to={item.to}
                state={'state' in item ? item.state : undefined}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm hover:border-mint/40 hover:bg-mint/5 transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-mint" />
                </span>
                <span className="font-medium break-words">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Player */}
      <div className="card p-5 space-y-4">
        <h2 className="font-display font-semibold">{tx('Player')}</h2>
        <LanguagePicker id="profile-language" />
        <NoteSpellingPicker id="profile-note-names" />
        <label className="block text-xs text-[var(--text-muted)]">
          {tx('Display name')}
          <input
            className="input mt-1"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={tx('Your name')}
            autoComplete="nickname"
          />
        </label>
      </div>

      {/* Instrument — fretboard / play-along only */}
      <div className="card p-5 space-y-4">
        <div>
          <h2 className="font-display font-semibold">{tx('Fretboard & play-along')}</h2>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {tx(
              'Scales, tabs, and Library tones. The chromatic tuner keeps its own A4 and open-string map under Practice → Tuner.',
            )}
          </p>
        </div>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] cursor-pointer hover:border-mint/30 transition-colors">
          <input
            type="checkbox"
            checked={lefty}
            onChange={(e) => setLefty(e.target.checked)}
            className="accent-mint"
          />
          <span className="text-sm">{tx('Left-handed fretboard')}</span>
        </label>

        <label className="block text-xs text-[var(--text-muted)]">
          {tx('Tuning')}
          <select
            className="input mt-1"
            value={tuningName}
            onChange={(e) => setTuningName(e.target.value as TuningName)}
          >
            {Object.entries(TUNINGS).map(([id, t]) => (
              <option key={id} value={id}>
                {presentTuningName(id, t.name)}
              </option>
            ))}
          </select>
          <span className="block text-[10px] mt-1 text-[var(--text-muted)]">
            {tx('Active: {tuning}', { tuning: tuningLabel })}
          </span>
        </label>

        {tuningName === 'custom' ? (
          <div className="space-y-2">
            <p className="text-[11px] text-[var(--text-muted)]">
              {tx('Custom open-string MIDI (low E → high e). Fretboard and play-along only — not the tuner.')}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {['E', 'A', 'D', 'G', 'B', 'e'].map((label, i) => (
                <label key={label} className="block text-[10px] text-[var(--text-muted)]">
                  {label}
                  <NumberInput
                    integer
                    className="input mt-0.5 !py-1.5 !text-sm"
                    min={28}
                    max={88}
                    value={customTuning[i] ?? getTuning()[i] ?? 40}
                    onCommit={(n) => {
                      const next = [...(customTuning.length === 6 ? customTuning : getTuning())]
                      next[i] = n
                      setCustomTuning(next)
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <label className="block text-xs text-[var(--text-muted)]">
          {tx('Play-along A4 (Hz)')}
          <NumberInput
            integer
            className="input mt-1"
            min={400}
            max={480}
            value={a4}
            onCommit={setA4}
          />
          <span className="block text-[10px] mt-1 text-[var(--text-muted)]">
            {tx('Scales, tabs, and tones. Tuner A4 is set inside the tuner.')}
          </span>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] cursor-pointer hover:border-mint/30 transition-colors">
          <input
            type="checkbox"
            checked={showDegrees}
            onChange={(e) => setShowDegrees(e.target.checked)}
            className="accent-mint"
          />
          <span className="text-sm">{tx('Show scale degrees on fretboard')}</span>
        </label>

        <label className="block text-xs text-[var(--text-muted)]">
          {tx('Default BPM')}
          <NumberInput
            integer
            className="input mt-1"
            min={30}
            max={300}
            value={bpm}
            onCommit={setBpm}
          />
          <span className="block text-[10px] mt-1 text-[var(--text-muted)]">
            {tx('Shared by metronome, scale play, and tab playback (30–300).')}
          </span>
        </label>

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to="/practice"
            state={{ tool: 'tuner' }}
            className="btn-secondary inline-flex text-center text-sm px-4 py-2 rounded-xl"
          >
            {tx('Open tuner')}
          </Link>
          <Link
            to="/practice"
            state={{ tool: 'metronome' }}
            className="btn-secondary inline-flex text-center text-sm px-4 py-2 rounded-xl"
          >
            {tx('Open metronome')}
          </Link>
        </div>
      </div>

      {/* Honest convert summary — short; full detail on About */}
      <div className="card p-5 text-sm text-[var(--text-muted)] leading-relaxed space-y-2">
        <h2 className="font-display font-semibold text-[var(--text)]">{tx('Song → tabs')}</h2>
        <p>
          <strong className="text-[var(--text)]">{tx('MIDI / MusicXML')}</strong>{' '}
          {tx(
            'land as solid tabs. Audio is a lead-biased assist you always edit by ear. Guitar Pro is best-effort and never auto-saves placeholders.',
          )}
        </p>
        <p className="text-xs">
          {tx('Your tabs stay on this device — export .grtab.json, ASCII, or MIDI anytime.')}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link to="/upload" className="btn-secondary text-sm px-4 py-2 rounded-xl">
            {tx('Upload a song')}
          </Link>
          <Link to="/library?mine=1" className="btn-secondary text-sm px-4 py-2 rounded-xl">
            {tx('Your tabs')}
          </Link>
        </div>
      </div>

      {/* About — single clear exit, no self-link clutter */}
      <div className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex gap-3 items-start">
          <span className="w-10 h-10 rounded-xl bg-mint/10 border border-mint/25 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-mint" />
          </span>
          <div>
            <h2 className="font-display font-semibold">{tx('About {name}', { name: APP_NAME })}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              {ABOUT_HELLO} {tx('Version, links, wiki, and desktop updates live on the About page.')}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link to="/wiki" className="btn-secondary text-center text-sm px-4 py-2 rounded-xl">
            {tx('Wiki')}
          </Link>
          <Link to="/about" className="btn-primary text-center text-sm px-4 py-2 rounded-xl">
            {tx('About')}
          </Link>
        </div>
      </div>
    </div>
  )
}
