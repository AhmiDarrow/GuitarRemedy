import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Download,
  ExternalLink,
  Github,
  Heart,
  Library,
  RefreshCw,
  ScrollText,
  Upload,
} from 'lucide-react'
import {
  ABOUT_BLURB,
  ABOUT_FOOTER_META,
  ABOUT_HELLO,
  APP_NAME,
  APP_VERSION_FALLBACK,
  GITHUB_ISSUES,
  GITHUB_PROFILE,
  GITHUB_RELEASES,
  GITHUB_REPO,
  PATREON_URL,
} from '../lib/brand'
import { isTauri } from '../lib/desktop'
import { checkForAppUpdate, downloadAndInstallUpdate } from '../lib/updater'

async function openExternal(url: string): Promise<void> {
  if (isTauri()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core')
      await invoke('open_external_url', { url })
      return
    } catch {
      // fall through to window.open
    }
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

type ExtLink = {
  label: string
  url: string
  icon: typeof Github
  primary?: boolean
}

const EXT_LINKS: ExtLink[] = [
  { label: 'GitHub', url: GITHUB_PROFILE, icon: Github, primary: true },
  { label: 'Repo', url: GITHUB_REPO, icon: ExternalLink },
  { label: 'Releases', url: GITHUB_RELEASES, icon: Download },
  { label: 'Patreon', url: PATREON_URL, icon: Heart },
  { label: 'Issues', url: GITHUB_ISSUES, icon: ExternalLink },
]

export function AboutPage() {
  const [appVersion, setAppVersion] = useState(APP_VERSION_FALLBACK)
  const [updateMsg, setUpdateMsg] = useState<string | null>(null)
  const [updateBusy, setUpdateBusy] = useState(false)
  const [pendingVersion, setPendingVersion] = useState<string | null>(null)
  const [linkError, setLinkError] = useState<string | null>(null)

  useEffect(() => {
    if (!isTauri()) return
    void import('@tauri-apps/api/app')
      .then(({ getVersion }) => getVersion())
      .then(setAppVersion)
      .catch(() => setAppVersion(APP_VERSION_FALLBACK))
  }, [])

  const openLink = useCallback(async (url: string) => {
    setLinkError(null)
    try {
      await openExternal(url)
    } catch (e) {
      setLinkError(String(e))
    }
  }, [])

  const runUpdateCheck = async () => {
    setUpdateBusy(true)
    setUpdateMsg(null)
    setPendingVersion(null)
    try {
      const result = await checkForAppUpdate()
      if (result.kind === 'up-to-date') {
        setUpdateMsg(`You're on the latest version (${appVersion}).`)
      } else if (result.kind === 'available') {
        setPendingVersion(result.version)
        setUpdateMsg(`Update ${result.version} is ready to install.`)
      } else if (result.kind === 'unsupported') {
        setUpdateMsg(result.message)
      } else {
        setUpdateMsg(result.message)
      }
    } finally {
      setUpdateBusy(false)
    }
  }

  const runUpdateInstall = async () => {
    setUpdateBusy(true)
    setUpdateMsg('Downloading update…')
    try {
      const ok = await downloadAndInstallUpdate((pct) => {
        if (pct == null) {
          setUpdateMsg('Downloading update…')
        } else {
          setUpdateMsg(`Downloading update… ${pct}%`)
        }
      })
      if (!ok) {
        setUpdateMsg(`You're on the latest version (${appVersion}).`)
        setPendingVersion(null)
      }
      // relaunch() exits the process on success
    } catch (e) {
      setUpdateMsg(String(e))
    } finally {
      setUpdateBusy(false)
    }
  }

  const shellLabel = isTauri() ? 'Windows desktop' : 'Web / PWA'
  const updateOk =
    !!updateMsg &&
    (updateMsg.startsWith("You're on") || updateMsg.startsWith('Update '))

  return (
    <div className="space-y-6 max-w-xl animate-fade-up">
      {/* Hero — matches You page family */}
      <section
        className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#06120c] via-[#030705] to-[#020403]"
        aria-label={`About ${APP_NAME}`}
      >
        <img
          src="/assets/brand-mark.png"
          alt=""
          className="absolute right-0 top-0 h-full w-36 object-cover opacity-35 md:w-48"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030705] via-[#030705]/92 to-transparent" />
        <div className="absolute -left-8 -bottom-10 w-40 h-40 rounded-full bg-mint/10 blur-3xl" />
        <div className="relative p-5 md:p-6 space-y-3">
          <p className="text-xs uppercase tracking-widest text-mint/80 font-semibold">About</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="text-mint font-medium text-sm md:text-base">{ABOUT_HELLO}</p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md">
            {ABOUT_BLURB}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] pt-1">
            v{appVersion} · {shellLabel} · local-first
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Scales', 'Tabs', '365 path', 'Song → tabs', 'MIT'].map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border border-mint/20 bg-mint/5 text-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Links out */}
      <section className="card p-5 space-y-3">
        <div>
          <h2 className="font-display font-semibold">Connect</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Source, releases, support — opens in your browser.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXT_LINKS.map(({ label, url, icon: Icon, primary }) => (
            <button
              key={label}
              type="button"
              className={
                primary
                  ? 'btn-primary text-sm px-4 py-2 rounded-xl'
                  : 'btn-secondary text-sm px-4 py-2 rounded-xl'
              }
              onClick={() => void openLink(url)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
        {linkError && <p className="text-xs text-rose-400">{linkError}</p>}
      </section>

      {/* Desktop updates */}
      <section className="card p-5 space-y-3">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-mint/10 border border-mint/25 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5 text-mint" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display font-semibold">Updates</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
              {isTauri()
                ? 'Signed installs from GitHub Releases. Check anytime; install restarts the app.'
                : 'Auto-update runs in the Windows desktop build. On web, refresh or reinstall the PWA for the latest.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary text-sm px-4 py-2 rounded-xl"
            disabled={updateBusy}
            onClick={() => void runUpdateCheck()}
          >
            <RefreshCw className={`w-4 h-4 ${updateBusy && !pendingVersion ? 'animate-spin' : ''}`} />
            {updateBusy && !pendingVersion ? 'Checking…' : 'Check for updates'}
          </button>
          {pendingVersion && (
            <button
              type="button"
              className="btn-primary text-sm px-4 py-2 rounded-xl"
              disabled={updateBusy}
              onClick={() => void runUpdateInstall()}
            >
              <Download className="w-4 h-4" />
              {updateBusy ? 'Installing…' : `Install ${pendingVersion} & restart`}
            </button>
          )}
        </div>
        {updateMsg && (
          <p className={`text-xs leading-relaxed ${updateOk ? 'text-mint' : 'text-[var(--text-muted)]'}`}>
            {updateMsg}
          </p>
        )}
      </section>

      {/* Honest product scope */}
      <section className="card p-5 text-sm text-[var(--text-muted)] leading-relaxed space-y-3">
        <h2 className="font-display font-semibold text-[var(--text)]">How song → tabs works</h2>
        <p>
          <strong className="text-[var(--text)]">Solid path:</strong> MIDI and MusicXML become
          deterministic tabs with key/scale analysis and a practice plan. Guitar Pro is best-effort
          (GPIF/zip often works; classic binary may stay a placeholder and never auto-saves — export
          MIDI/MusicXML from your DAW or GP).
        </p>
        <p>
          <strong className="text-[var(--text)]">Audio path:</strong> MP3/WAV and friends →
          lead-biased multipitch assist → MIDI → guitar tabs. Always editable; not multi-voice studio
          transcription. Use stems, tempo, trim, Clean up, and the tab editor to finish by ear.
        </p>
        <p className="text-xs">
          Your tabs stay on this device. Export .grtab.json, ASCII, or MIDI anytime.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link to="/upload" className="btn-secondary text-sm px-4 py-2 rounded-xl">
            <Upload className="w-4 h-4" /> Upload a song
          </Link>
          <Link to="/library?mine=1" className="btn-secondary text-sm px-4 py-2 rounded-xl">
            <Library className="w-4 h-4" /> Your tabs
          </Link>
        </div>
      </section>

      {/* In-app destinations — no self-link to About */}
      <section className="card p-5 space-y-3">
        <div>
          <h2 className="font-display font-semibold">In the app</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Jump to practice surfaces — this page stays About only.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/learn"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-3 text-sm hover:border-mint/40 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-mint shrink-0" />
            Lessons
          </Link>
          <Link
            to="/wiki"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-3 text-sm hover:border-mint/40 transition-colors flex items-center gap-2"
          >
            <ScrollText className="w-4 h-4 text-lime shrink-0" />
            Wiki
          </Link>
          <Link
            to="/practice"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-3 text-sm hover:border-mint/40 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-teal shrink-0" />
            Practice
          </Link>
          <Link
            to="/profile"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-3 text-sm hover:border-mint/40 transition-colors flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-soft shrink-0" />
            You
          </Link>
        </div>
      </section>

      <p className="text-center text-[11px] text-[var(--text-muted)] pb-2">{ABOUT_FOOTER_META}</p>
    </div>
  )
}
