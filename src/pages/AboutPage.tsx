import { useCallback, useEffect, useState } from 'react'
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

  return (
    <div className="space-y-6 max-w-xl animate-fade-up">
      <section className="card p-5 about-panel" aria-label={`About ${APP_NAME}`}>
        <div className="flex gap-4 items-start">
          <img
            className="w-11 h-11 rounded-xl object-cover ring-1 ring-mint/30 shadow-lg shadow-mint/15 shrink-0"
            src="/assets/brand-mark.png"
            width={44}
            height={44}
            alt={APP_NAME}
            draggable={false}
          />
          <div className="min-w-0 flex-1 space-y-2">
            <h1 className="font-display text-2xl font-bold">About</h1>
            <p className="text-mint font-medium">{ABOUT_HELLO}</p>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{ABOUT_BLURB}</p>
            <p className="text-xs text-[var(--text-muted)]">
              Version {appVersion}
              {isTauri() ? ' · Windows desktop' : ' · Web / PWA'}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button type="button" className="btn primary sm" onClick={() => void openLink(GITHUB_PROFILE)}>
                GitHub
              </button>
              <button type="button" className="btn sm" onClick={() => void openLink(GITHUB_REPO)}>
                Repo
              </button>
              <button type="button" className="btn sm" onClick={() => void openLink(GITHUB_RELEASES)}>
                Releases
              </button>
              <button type="button" className="btn sm" onClick={() => void openLink(PATREON_URL)}>
                Patreon
              </button>
              <button type="button" className="btn sm" onClick={() => void openLink(GITHUB_ISSUES)}>
                Issues
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-3">
              <button
                type="button"
                className="btn sm"
                disabled={updateBusy}
                onClick={() => void runUpdateCheck()}
              >
                {updateBusy && !pendingVersion ? 'Checking…' : 'Check for updates'}
              </button>
              {pendingVersion && (
                <button
                  type="button"
                  className="btn primary sm"
                  disabled={updateBusy}
                  onClick={() => void runUpdateInstall()}
                >
                  {updateBusy ? 'Installing…' : `Install ${pendingVersion} & restart`}
                </button>
              )}
            </div>

            {updateMsg && (
              <p
                className={
                  updateMsg.startsWith("You're on") || updateMsg.startsWith('Update ')
                    ? 'text-xs text-mint'
                    : 'text-xs text-[var(--text-muted)]'
                }
              >
                {updateMsg}
              </p>
            )}
            {linkError && <p className="text-xs text-red-400">{linkError}</p>}

            <div className="pt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              <span className="px-2 py-0.5 rounded-full border border-[var(--border)]">Windows</span>
              <span className="px-2 py-0.5 rounded-full border border-[var(--border)]">PWA</span>
              <span className="px-2 py-0.5 rounded-full border border-[var(--border)]">Tabs · MIDI</span>
              <span className="px-2 py-0.5 rounded-full border border-[var(--border)]">Auto-update</span>
              <span className="px-2 py-0.5 rounded-full border border-[var(--border)]">MIT</span>
            </div>

            <p className="text-[11px] text-[var(--text-muted)] pt-2">{ABOUT_FOOTER_META}</p>
          </div>
        </div>
      </section>

      <section className="card p-5 text-sm text-[var(--text-muted)] leading-relaxed space-y-2">
        <h2 className="font-display font-semibold text-[var(--text)] mb-2">How song breakdown works</h2>
        <p>
          <strong className="text-[var(--text)]">Solid path:</strong> MIDI and MusicXML → deterministic
          tabs + key/scale analysis + practice plan. Guitar Pro is best-effort (GPIF/zip often
          works; classic binary may be a placeholder that never auto-saves — export MIDI/MusicXML).
        </p>
        <p>
          <strong className="text-[var(--text)]">Audio path:</strong> MP3/WAV and friends → lead-oriented
          pitch track → MIDI → guitar tabs. Monophonic assist — always editable; not multi-voice studio
          transcription. Use tempo override, trim length, Clean up, and the tab editor to finish by ear.
        </p>
        <p className="text-xs">Your tabs stay on this device. Export .grtab.json, ASCII, or MIDI anytime.</p>
      </section>
    </div>
  )
}
