import { isTauri } from './desktop'

export type UpdateCheckResult =
  | { kind: 'up-to-date' }
  | { kind: 'available'; version: string; body?: string | null }
  | { kind: 'unsupported'; message: string }
  | { kind: 'error'; message: string }

/** Map raw plugin / network errors into something a player can act on. */
export function friendlyUpdaterError(raw: string): string {
  const msg = (raw || '').trim() || 'Update check failed.'
  const lower = msg.toLowerCase()
  if (
    lower.includes('not valid') ||
    lower.includes('invalid') ||
    lower.includes('could not fetch') ||
    lower.includes('error decoding response body') ||
    lower.includes('unexpected end') ||
    lower.includes('eof while parsing') ||
    lower.includes('404') ||
    lower.includes('not found') ||
    lower.includes('json')
  ) {
    return (
      'No published update feed yet (latest.json missing or draft release). ' +
      'Publish a non-draft GitHub Release that includes latest.json, ' +
      'or you are already on the only public build.'
    )
  }
  if (lower.includes('signature') || lower.includes('minisign')) {
    return 'Update signature check failed. Re-download from the official GitHub Releases page.'
  }
  if (lower.includes('network') || lower.includes('timed out') || lower.includes('dns')) {
    return 'Could not reach GitHub Releases. Check your network and try again.'
  }
  return msg
}

/** Probe GitHub Releases for a newer signed build (no download yet). */
export async function checkForAppUpdate(): Promise<UpdateCheckResult> {
  if (!isTauri()) {
    return {
      kind: 'unsupported',
      message: 'Auto-update runs in the Windows desktop build. Web/PWA refreshes on redeploy.',
    }
  }
  try {
    const { check } = await import('@tauri-apps/plugin-updater')
    const update = await check()
    if (!update) {
      return { kind: 'up-to-date' }
    }
    return {
      kind: 'available',
      version: update.version,
      body: update.body,
    }
  } catch (e) {
    const raw = e instanceof Error ? e.message : String(e)
    return { kind: 'error', message: friendlyUpdaterError(raw) }
  }
}

/**
 * Download + install the available update, then relaunch.
 * Returns false if nothing to install.
 */
export async function downloadAndInstallUpdate(
  onProgress?: (pct: number | null) => void,
): Promise<boolean> {
  if (!isTauri()) {
    throw new Error('Updates require the desktop app')
  }
  const { check } = await import('@tauri-apps/plugin-updater')
  const { relaunch } = await import('@tauri-apps/plugin-process')
  const update = await check()
  if (!update) {
    return false
  }

  let downloaded = 0
  let contentLength: number | undefined

  await update.downloadAndInstall((event) => {
    switch (event.event) {
      case 'Started':
        contentLength = event.data.contentLength
        onProgress?.(0)
        break
      case 'Progress':
        downloaded += event.data.chunkLength
        if (contentLength && contentLength > 0) {
          onProgress?.(Math.min(100, Math.round((downloaded / contentLength) * 100)))
        } else {
          onProgress?.(null)
        }
        break
      case 'Finished':
        onProgress?.(100)
        break
    }
  })

  await relaunch()
  return true
}
