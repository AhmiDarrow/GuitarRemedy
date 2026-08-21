/** Tauri 2 desktop helpers — safe no-ops in the browser. */

const AUDIO_EXT = [
  'mp3',
  'wav',
  'wave',
  'm4a',
  'aac',
  'ogg',
  'oga',
  'opus',
  'flac',
  'aiff',
  'aif',
  'caf',
  'webm',
  'wma',
] as const

const TAB_EXT = ['mid', 'midi', 'xml', 'musicxml', 'gp', 'gpx', 'gpif', 'grtab', 'json'] as const

export function isTauri(): boolean {
  if (typeof window === 'undefined') return false
  const w = window as Window & { __TAURI_INTERNALS__?: unknown; __TAURI__?: unknown }
  return Boolean(w.__TAURI_INTERNALS__ || w.__TAURI__)
}

function basename(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1] || 'upload.bin'
}

/** Native open dialog → File for the existing upload pipeline. */
export async function openMusicFileNative(): Promise<File | null> {
  if (!isTauri()) return null
  try {
    const { open } = await import('@tauri-apps/plugin-dialog')
    const { readFile } = await import('@tauri-apps/plugin-fs')
    const selected = await open({
      multiple: false,
      title: 'Open song or tab',
      filters: [
        {
          name: 'Audio & tabs',
          extensions: [...AUDIO_EXT, ...TAB_EXT],
        },
        { name: 'Audio', extensions: [...AUDIO_EXT] },
        { name: 'MIDI / MusicXML / GP', extensions: [...TAB_EXT] },
      ],
    })
    if (!selected || Array.isArray(selected)) return null
    const path = typeof selected === 'string' ? selected : String(selected)
    const bytes = await readFile(path)
    const name = basename(path)
    const copy = new Uint8Array(bytes.byteLength)
    copy.set(bytes)
    return new File([copy.buffer], name)
  } catch {
    return null
  }
}

export const DESKTOP_SHELL = {
  name: 'GuitarRemedy Desktop',
  stack: 'Tauri 2',
  runDev: 'npm run tauri:dev',
  runBuild: 'npm run tauri:build',
  /** Signed updates via GitHub Releases (About → Check for updates). See docs/AUTOUPDATE.md */
  autoUpdate: 'github-releases' as const,
  pwaManifest: '/manifest.webmanifest',
} as const
