import { Link } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { TUNINGS, type TuningName } from '../lib/theory'
import { CURRICULUM } from '../data/curriculum'

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

  const pct = Math.round((completed.length / CURRICULUM.length) * 100)

  return (
    <div className="space-y-6 max-w-xl animate-fade-up">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)]">
        <img
          src="/assets/brand-mark.png"
          alt=""
          className="absolute right-0 top-0 h-full w-40 object-cover opacity-40 md:w-52"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-card)]/95 to-transparent" />
        <div className="relative p-5 md:p-6">
          <p className="text-xs uppercase tracking-widest text-mint/80 font-semibold">You</p>
          <h1 className="font-display text-3xl font-bold mt-1">Profile & settings</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Local-only. Nothing leaves this device.</p>
        </div>
      </div>

      <div className="card p-5 grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-2xl font-display font-bold text-mint">{streak}</div>
          <div className="text-[11px] text-[var(--text-muted)]">Streak</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold">{completed.length}</div>
          <div className="text-[11px] text-[var(--text-muted)]">Lessons</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold">{pct}%</div>
          <div className="text-[11px] text-[var(--text-muted)]">Path</div>
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h2 className="font-display font-semibold">Player</h2>
        <label className="block text-xs text-[var(--text-muted)]">
          Display name
          <input
            className="input mt-1"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
        <p className="text-xs text-[var(--text-muted)]">Current day on path: {currentDay} · Favorites: {favorites.length}</p>
      </div>

      <div className="card p-5 space-y-4">
        <h2 className="font-display font-semibold">Instrument</h2>
        <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] cursor-pointer">
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
              <option key={id} value={id}>{t.name}</option>
            ))}
          </select>
        </label>
        {tuningName === 'custom' ? (
          <div className="space-y-2">
            <p className="text-[11px] text-[var(--text-muted)]">
              Custom open-string MIDI (low E → high e). Applied to fretboard &amp; play-along.
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
          A4 reference (Hz)
          <input
            type="number"
            className="input mt-1"
            min={415}
            max={466}
            value={a4}
            onChange={(e) => setA4(Number(e.target.value) || 440)}
          />
        </label>
        <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] cursor-pointer">
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
        </label>
      </div>

      <div className="card p-5 text-sm text-[var(--text-muted)] leading-relaxed space-y-2">
        <h2 className="font-display font-semibold text-[var(--text)] mb-2">How song breakdown works</h2>
        <p>
          <strong className="text-[var(--text)]">Solid path:</strong> MIDI, MusicXML, and Guitar Pro
          (best-effort) → deterministic tabs + key/scale analysis + practice plan.
        </p>
        <p>
          <strong className="text-[var(--text)]">Audio path:</strong> MP3/WAV and friends → lead-oriented
          pitch track → MIDI → guitar tabs. Monophonic assist — always editable; not multi-voice studio
          transcription. Use tempo override, trim length, Clean up, and the tab editor to finish by ear.
        </p>
        <p className="text-xs">
          Your tabs stay on this device. Export .grtab.json, ASCII, or MIDI anytime.
        </p>
      </div>

      <div className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display font-semibold">About, wiki & updates</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Hi I&apos;m Ahmi — theory wiki, links, version, and Check for updates (desktop).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/wiki" className="btn-secondary text-center text-sm px-4 py-2 rounded-xl">
            Open wiki
          </Link>
          <Link to="/about" className="btn-primary text-center text-sm px-4 py-2 rounded-xl">
            Open About
          </Link>
        </div>
      </div>
    </div>
  )
}
