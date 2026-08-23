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
import { useAppStore } from '../store/appStore'
import { useUserTabsStore } from '../store/userTabsStore'
import { TUNINGS, type TuningName } from '../lib/theory'
import { CURRICULUM, getLesson } from '../data/curriculum'
import {
  ABOUT_HELLO,
  APP_NAME,
  APP_VERSION_FALLBACK,
} from '../lib/brand'

const PHASE_LABEL: Record<string, string> = {
  basics: 'Basics',
  chords: 'Chords',
  scales: 'Scales',
  rhythm: 'Rhythm',
  lead: 'Lead',
  repertoire: 'Repertoire',
}

export function ProfilePage() {
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
  const tuningLabel =
    tuningName === 'custom'
      ? 'Custom'
      : (TUNINGS[tuningName]?.name ?? tuningName)
  const phaseLabel = PHASE_LABEL[lesson?.phase ?? ''] ?? lesson?.phase ?? 'Path'

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
          <p className="text-xs uppercase tracking-widest text-mint/80 font-semibold">You</p>
          <h1 className="font-display text-3xl font-bold mt-1 tracking-tight">
            {displayName?.trim() || 'Player'}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm">
            Progress, fretboard prefs, and shortcuts. Everything stays on this device.
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-3">
            {APP_NAME} · v{APP_VERSION_FALLBACK} · local-first
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Streak', value: `${streak}d`, icon: Flame, tone: 'text-mint' },
          { label: 'Day', value: String(currentDay), icon: BookOpen, tone: 'text-lime' },
          { label: 'Done', value: String(completed.length), icon: Library, tone: 'text-teal' },
          { label: 'Path', value: `${pct}%`, icon: Guitar, tone: 'text-soft' },
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

      {/* Path progress + today */}
      <div className="card p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display font-semibold">365-day path</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {completed.length} of {CURRICULUM.length} lessons · {phaseLabel}
              {lastPracticeDate ? ` · last practice ${lastPracticeDate}` : ''}
            </p>
          </div>
          <span className="text-sm font-display font-bold text-mint tabular-nums shrink-0">
            {pct}%
          </span>
        </div>
        <div
          className="h-2 rounded-full bg-black/40 border border-[var(--border)] overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Lesson path progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-mint/80 to-lime/70 transition-[width] duration-500"
            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          />
        </div>
        {lesson ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-mint/80 font-semibold">
              Up next · Day {lesson.day}
            </p>
            <p className="text-sm font-medium mt-1 leading-snug">{lesson.title}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{lesson.theoryBite}</p>
            <Link
              to={`/learn/${lesson.day}`}
              className="btn-primary mt-3 inline-flex text-sm px-4 py-2 rounded-xl"
            >
              Open lesson
            </Link>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-1">
            <Heart className="w-3 h-3 text-mint" />
            {favorites.length} favorite{favorites.length === 1 ? '' : 's'}
          </span>
          <Link
            to="/library?mine=1"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-1 hover:border-mint/40 hover:text-mint transition-colors"
          >
            <Library className="w-3 h-3 text-mint" />
            {userTabs.length} saved tab{userTabs.length === 1 ? '' : 's'}
          </Link>
        </div>
      </div>

      {/* Quick tools */}
      <div className="card p-5 space-y-3">
        <h2 className="font-display font-semibold">Shortcuts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(
            [
              { to: '/practice', state: { tool: 'metronome' }, label: 'Metronome', icon: Gauge },
              { to: '/practice', state: { tool: 'tuner' }, label: 'Tuner', icon: AudioLines },
              { to: '/practice', state: { tool: 'fretboard' }, label: 'Fretboard', icon: Guitar },
              { to: '/library', label: 'Library', icon: Library },
              { to: '/upload', label: 'Upload', icon: Upload },
              { to: '/wiki', label: 'Wiki', icon: ScrollText },
            ] as const
          ).map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                to={item.to}
                state={'state' in item ? item.state : undefined}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 px-3 py-2.5 text-sm hover:border-mint/40 hover:bg-mint/5 transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-mint" />
                </span>
                <span className="font-medium truncate">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Player */}
      <div className="card p-5 space-y-4">
        <h2 className="font-display font-semibold">Player</h2>
        <label className="block text-xs text-[var(--text-muted)]">
          Display name
          <input
            className="input mt-1"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            autoComplete="nickname"
          />
        </label>
      </div>

      {/* Instrument — fretboard / play-along only */}
      <div className="card p-5 space-y-4">
        <div>
          <h2 className="font-display font-semibold">Fretboard &amp; play-along</h2>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Scales, tabs, and Library tones. The chromatic tuner keeps its own A4 and open-string map
            under Practice → Tuner.
          </p>
        </div>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] cursor-pointer hover:border-mint/30 transition-colors">
          <input
            type="checkbox"
            checked={lefty}
            onChange={(e) => setLefty(e.target.checked)}
            className="accent-mint"
          />
          <span className="text-sm">Left-handed fretboard</span>
        </label>

        <label className="block text-xs text-[var(--text-muted)]">
          Tuning
          <select
            className="input mt-1"
            value={tuningName}
            onChange={(e) => setTuningName(e.target.value as TuningName)}
          >
            {Object.entries(TUNINGS).map(([id, t]) => (
              <option key={id} value={id}>
                {t.name}
              </option>
            ))}
          </select>
          <span className="block text-[10px] mt-1 text-[var(--text-muted)]">
            Active: {tuningLabel}
          </span>
        </label>

        {tuningName === 'custom' ? (
          <div className="space-y-2">
            <p className="text-[11px] text-[var(--text-muted)]">
              Custom open-string MIDI (low E → high e). Fretboard and play-along only — not the tuner.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {['E', 'A', 'D', 'G', 'B', 'e'].map((label, i) => (
                <label key={label} className="block text-[10px] text-[var(--text-muted)]">
                  {label}
                  <input
                    type="number"
                    className="input mt-0.5 !py-1.5 !text-sm"
                    min={28}
                    max={88}
                    value={customTuning[i] ?? getTuning()[i] ?? 40}
                    onChange={(e) => {
                      const next = [...(customTuning.length === 6 ? customTuning : getTuning())]
                      next[i] = Number(e.target.value) || next[i]
                      setCustomTuning(next)
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <label className="block text-xs text-[var(--text-muted)]">
          Play-along A4 (Hz)
          <input
            type="number"
            className="input mt-1"
            min={415}
            max={466}
            value={a4}
            onChange={(e) => setA4(Number(e.target.value) || 440)}
          />
          <span className="block text-[10px] mt-1 text-[var(--text-muted)]">
            Scales, tabs, and tones. Tuner A4 is set inside the tuner.
          </span>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] cursor-pointer hover:border-mint/30 transition-colors">
          <input
            type="checkbox"
            checked={showDegrees}
            onChange={(e) => setShowDegrees(e.target.checked)}
            className="accent-mint"
          />
          <span className="text-sm">Show scale degrees on fretboard</span>
        </label>

        <label className="block text-xs text-[var(--text-muted)]">
          Default BPM
          <input
            type="number"
            className="input mt-1"
            min={30}
            max={300}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value) || 80)}
          />
          <span className="block text-[10px] mt-1 text-[var(--text-muted)]">
            Shared by metronome, scale play, and tab playback (30–300).
          </span>
        </label>

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to="/practice"
            state={{ tool: 'tuner' }}
            className="btn-secondary inline-flex text-center text-sm px-4 py-2 rounded-xl"
          >
            Open tuner
          </Link>
          <Link
            to="/practice"
            state={{ tool: 'metronome' }}
            className="btn-secondary inline-flex text-center text-sm px-4 py-2 rounded-xl"
          >
            Open metronome
          </Link>
        </div>
      </div>

      {/* Honest convert summary — short; full detail on About */}
      <div className="card p-5 text-sm text-[var(--text-muted)] leading-relaxed space-y-2">
        <h2 className="font-display font-semibold text-[var(--text)]">Song → tabs</h2>
        <p>
          <strong className="text-[var(--text)]">MIDI / MusicXML</strong> land as solid tabs.
          Audio is a lead-biased assist you always edit by ear. Guitar Pro is best-effort and never
          auto-saves placeholders.
        </p>
        <p className="text-xs">
          Your tabs stay on this device — export .grtab.json, ASCII, or MIDI anytime.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link to="/upload" className="btn-secondary text-sm px-4 py-2 rounded-xl">
            Upload a song
          </Link>
          <Link to="/library?mine=1" className="btn-secondary text-sm px-4 py-2 rounded-xl">
            Your tabs
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
            <h2 className="font-display font-semibold">About {APP_NAME}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              {ABOUT_HELLO} Version, links, wiki, and desktop updates live on the About page.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link to="/wiki" className="btn-secondary text-center text-sm px-4 py-2 rounded-xl">
            Wiki
          </Link>
          <Link to="/about" className="btn-primary text-center text-sm px-4 py-2 rounded-xl">
            About
          </Link>
        </div>
      </div>
    </div>
  )
}
