import { describe, expect, it } from 'vitest'
import { DESKTOP_SHELL, isTauri, openMusicFileNative } from './desktop'

describe('desktop shell helpers', () => {
  it('reports non-Tauri in node test env', () => {
    expect(isTauri()).toBe(false)
  })

  it('native open is a no-op outside Tauri', async () => {
    await expect(openMusicFileNative()).resolves.toBeNull()
  })

  it('exposes run scripts for packaging', () => {
    expect(DESKTOP_SHELL.stack).toContain('Tauri')
    expect(DESKTOP_SHELL.runDev).toBe('npm run tauri:dev')
    expect(DESKTOP_SHELL.runBuild).toBe('npm run tauri:build')
    expect(DESKTOP_SHELL.pwaManifest).toContain('manifest')
    expect(DESKTOP_SHELL.autoUpdate).toBe('github-releases')
  })
})
