/** Product identity + About / update links (matches Ahmi app family). */

export const APP_NAME = 'GuitarRemedy'

/**
 * Build-time version from package.json (vite `define` → `__APP_VERSION__`).
 * UI must use this (or `resolveAppVersion`) — never hardcode `0.x.y` in pages.
 */
export const APP_VERSION: string =
  typeof __APP_VERSION__ === 'string' && __APP_VERSION__.length > 0
    ? __APP_VERSION__
    : '0.0.0'

/** @deprecated Use APP_VERSION — kept so older imports keep compiling. */
export const APP_VERSION_FALLBACK = APP_VERSION

export const GITHUB_PROFILE = 'https://github.com/AhmiDarrow'
export const GITHUB_REPO = 'https://github.com/AhmiDarrow/GuitarRemedy'
export const GITHUB_RELEASES = `${GITHUB_REPO}/releases`
export const GITHUB_ISSUES = `${GITHUB_REPO}/issues`
export const PATREON_URL = 'https://www.patreon.com/AhmiDarrow'

export const ABOUT_HELLO = "Hi I'm Ahmi, hope this helps!"
export const ABOUT_BLURB =
  'Interactive scales, full tabs, a free open library, song → tabs, and a Day 1–365 path — local-first on Windows and the web.'
export const ABOUT_FOOTER_META =
  'MIT · local-first · free-license content only · signed desktop updates via GitHub Releases'

/**
 * Prefer the live desktop shell version when running under Tauri;
 * otherwise the package.json build stamp.
 */
export async function resolveAppVersion(): Promise<string> {
  try {
    const { isTauri } = await import('./desktop')
    if (isTauri()) {
      const { getVersion } = await import('@tauri-apps/api/app')
      const v = await getVersion()
      if (typeof v === 'string' && v.trim()) return v.trim()
    }
  } catch {
    // web / tests / missing plugin
  }
  return APP_VERSION
}
