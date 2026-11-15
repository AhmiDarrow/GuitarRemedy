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
  ABOUT_HELLO,
  ABOUT_SIGN_OFF,
  APP_NAME,
  APP_VERSION,
  resolveAppVersion,
  GITHUB_ISSUES,
  GITHUB_PROFILE,
  GITHUB_RELEASES,
  GITHUB_REPO,
  PATREON_URL,
} from '../lib/brand'
import { isTauri } from '../lib/desktop'
import { checkForAppUpdate, downloadAndInstallUpdate } from '../lib/updater'
import { useI18n } from '../i18n/useI18n'

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

export function AboutPage() {
  const { tx } = useI18n()
  const [appVersion, setAppVersion] = useState(APP_VERSION)
  const [updateMsg, setUpdateMsg] = useState<string | null>(null)
  const [updateTone, setUpdateTone] = useState<'ok' | 'muted'>('muted')
  const [updateBusy, setUpdateBusy] = useState(false)
  const [pendingVersion, setPendingVersion] = useState<string | null>(null)
  const [linkError, setLinkError] = useState<string | null>(null)

  useEffect(() => {
    void resolveAppVersion().then(setAppVersion)
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
        setUpdateTone('ok')
        setUpdateMsg(tx("You're on the latest version ({version}).", { version: appVersion }))
      } else if (result.kind === 'available') {
        setPendingVersion(result.version)
        setUpdateTone('ok')
        setUpdateMsg(tx('Update {version} is ready to install.', { version: result.version }))
      } else if (result.kind === 'unsupported') {
        setUpdateTone('muted')
        setUpdateMsg(result.message)
      } else {
        setUpdateTone('muted')
        setUpdateMsg(result.message)
      }
    } finally {
      setUpdateBusy(false)
    }
  }

  const runUpdateInstall = async () => {
    setUpdateBusy(true)
    setUpdateTone('muted')
    setUpdateMsg(tx('Downloading update…'))
    try {
      const ok = await downloadAndInstallUpdate((pct) => {
        setUpdateTone('muted')
        if (pct == null) {
          setUpdateMsg(tx('Downloading update…'))
        } else {
          setUpdateMsg(tx('Downloading update… {pct}%', { pct }))
        }
      })
      if (!ok) {
        setUpdateTone('ok')
        setUpdateMsg(tx("You're on the latest version ({version}).", { version: appVersion }))
        setPendingVersion(null)
      }
      // relaunch() exits the process on success
    } catch (e) {
      setUpdateTone('muted')
      setUpdateMsg(String(e))
    } finally {
      setUpdateBusy(false)
    }
  }

  const shellLabel = isTauri() ? tx('Windows desktop') : tx('Web / PWA')
  const extLinks: ExtLink[] = [
    { label: tx('GitHub'), url: GITHUB_PROFILE, icon: Github, primary: true },
    { label: tx('Repo'), url: GITHUB_REPO, icon: ExternalLink },
    { label: tx('Releases'), url: GITHUB_RELEASES, icon: Download },
    { label: tx('Patreon'), url: PATREON_URL, icon: Heart },
    { label: tx('Issues'), url: GITHUB_ISSUES, icon: ExternalLink },
  ]

  return (
    <div className="space-y-6 max-w-xl animate-fade-up">
      {/* Hero — matches You page family */}
      <section
        className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#06120c] via-[#030705] to-[#020403]"
        aria-label={tx('About {name}', { name: APP_NAME })}
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
          <p className="text-xs uppercase tracking-widest text-mint/80 font-semibold">{tx('About')}</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="text-mint font-medium text-sm md:text-base">{ABOUT_HELLO}</p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md">
            {tx(
              'Interactive scales, full tabs, a free open library, song → tabs, and a Day 1–365 path — local-first on Windows and the web.',
            )}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] pt-1">
            {tx('v{version} · {shell} · local-first', { version: appVersion, shell: shellLabel })}
          </p>
          <a
            href={GITHUB_REPO}
            className="inline-block text-sm text-mint underline underline-offset-2 hover:text-lime"
            onClick={(event) => {
              event.preventDefault()
              void openLink(GITHUB_REPO)
            }}
          >
            {GITHUB_REPO}
          </a>
          <p className="text-sm font-medium text-soft" translate="no" data-about-signoff="">
            {ABOUT_SIGN_OFF}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(
              [
                { id: 'scales', label: tx('Scales') },
                { id: 'tabs', label: tx('Tabs') },
                { id: 'path', label: tx('365 path') },
                { id: 'song', label: tx('Song → tabs') },
                { id: 'mit', label: tx('MIT') },
              ] as const
            ).map(({ id, label }) => (
              <span
                key={id}
                className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border border-mint/20 bg-mint/5 text-soft"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Links out */}
      <section className="card p-5 space-y-3">
        <div>
          <h2 className="font-display font-semibold">{tx('Connect')}</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {tx('Source, releases, support — opens in your browser.')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {extLinks.map(({ label, url, icon: Icon, primary }) => (
            <button
              key={url}
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
            <h2 className="font-display font-semibold">{tx('Updates')}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
              {isTauri()
                ? tx('Signed installs from GitHub Releases. Check anytime; install restarts the app.')
                : tx(
                    'Auto-update runs in the Windows desktop build. On web, refresh or reinstall the PWA for the latest.',
                  )}
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
            {updateBusy && !pendingVersion ? tx('Checking…') : tx('Check for updates')}
          </button>
          {pendingVersion && (
            <button
              type="button"
              className="btn-primary text-sm px-4 py-2 rounded-xl"
              disabled={updateBusy}
              onClick={() => void runUpdateInstall()}
            >
              <Download className="w-4 h-4" />
              {updateBusy ? tx('Installing…') : tx('Install {version} & restart', { version: pendingVersion })}
            </button>
          )}
        </div>
        {updateMsg && (
          <p className={`text-xs leading-relaxed ${updateTone === 'ok' ? 'text-mint' : 'text-[var(--text-muted)]'}`}>
            {updateMsg}
          </p>
        )}
      </section>

      {/* Honest product scope */}
      <section className="card p-5 text-sm text-[var(--text-muted)] leading-relaxed space-y-3">
        <h2 className="font-display font-semibold text-[var(--text)]">{tx('How song → tabs works')}</h2>
        <p>
          <strong className="text-[var(--text)]">{tx('Solid path:')}</strong>{' '}
          {tx(
            'MIDI and MusicXML become deterministic tabs with key/scale analysis and a practice plan. Guitar Pro is best-effort (GPIF/zip often works; classic binary may stay a placeholder and never auto-saves — export MIDI/MusicXML from your DAW or GP).',
          )}
        </p>
        <p>
          <strong className="text-[var(--text)]">{tx('Audio path:')}</strong>{' '}
          {tx(
            'MP3/WAV and friends → lead-biased multipitch assist → MIDI → guitar tabs. Always editable; not multi-voice studio transcription. Use stems, tempo, trim, Clean up, and the tab editor to finish by ear.',
          )}
        </p>
        <p className="text-xs">
          {tx('Your tabs stay on this device. Export .grtab.json, ASCII, or MIDI anytime.')}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link to="/upload" className="btn-secondary text-sm px-4 py-2 rounded-xl">
            <Upload className="w-4 h-4" /> {tx('Upload a song')}
          </Link>
          <Link to="/library?mine=1" className="btn-secondary text-sm px-4 py-2 rounded-xl">
            <Library className="w-4 h-4" /> {tx('Your tabs')}
          </Link>
        </div>
      </section>

      {/* In-app destinations — no self-link to About */}
      <section className="card p-5 space-y-3">
        <div>
          <h2 className="font-display font-semibold">{tx('In the app')}</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {tx('Jump to practice surfaces — this page stays About only.')}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/learn"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-3 text-sm hover:border-mint/40 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-mint shrink-0" />
            {tx('Lessons')}
          </Link>
          <Link
            to="/wiki"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-3 text-sm hover:border-mint/40 transition-colors flex items-center gap-2"
          >
            <ScrollText className="w-4 h-4 text-lime shrink-0" />
            {tx('Wiki')}
          </Link>
          <Link
            to="/practice"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-3 text-sm hover:border-mint/40 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-teal shrink-0" />
            {tx('Practice')}
          </Link>
          <Link
            to="/profile"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 px-3 py-3 text-sm hover:border-mint/40 transition-colors flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-soft shrink-0" />
            {tx('You')}
          </Link>
        </div>
      </section>

      <p className="text-center text-[11px] text-[var(--text-muted)] pb-2">
        {tx('MIT · local-first · free-license content only · signed desktop updates via GitHub Releases')}
      </p>
    </div>
  )
}
