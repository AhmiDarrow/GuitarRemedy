import { beforeEach, describe, expect, it, vi } from 'vitest'

const check = vi.fn()
const relaunch = vi.fn()

vi.mock('@tauri-apps/plugin-updater', () => ({
  check: (...args: unknown[]) => check(...args),
}))

vi.mock('@tauri-apps/plugin-process', () => ({
  relaunch: (...args: unknown[]) => relaunch(...args),
}))

vi.mock('./desktop', () => ({
  isTauri: () => true,
}))

import { checkForAppUpdate, downloadAndInstallUpdate } from './updater'

describe('checkForAppUpdate', () => {
  beforeEach(() => {
    check.mockReset()
    relaunch.mockReset()
  })

  it('returns up-to-date when check yields null', async () => {
    check.mockResolvedValue(null)
    await expect(checkForAppUpdate()).resolves.toEqual({ kind: 'up-to-date' })
  })

  it('returns available with version and body', async () => {
    check.mockResolvedValue({ version: '1.2.3', body: 'fixes' })
    await expect(checkForAppUpdate()).resolves.toEqual({
      kind: 'available',
      version: '1.2.3',
      body: 'fixes',
    })
  })

  it('returns error kind on failure', async () => {
    check.mockRejectedValue(new Error('network down'))
    const result = await checkForAppUpdate()
    expect(result.kind).toBe('error')
    if (result.kind === 'error') {
      expect(result.message).toMatch(/network down/)
    }
  })
})

describe('downloadAndInstallUpdate', () => {
  beforeEach(() => {
    check.mockReset()
    relaunch.mockReset()
  })

  it('returns false when no update', async () => {
    check.mockResolvedValue(null)
    await expect(downloadAndInstallUpdate()).resolves.toBe(false)
    expect(relaunch).not.toHaveBeenCalled()
  })

  it('downloads, reports progress, and relaunches', async () => {
    const downloadAndInstall = vi.fn(async (cb: (e: unknown) => void) => {
      cb({ event: 'Started', data: { contentLength: 100 } })
      cb({ event: 'Progress', data: { chunkLength: 40 } })
      cb({ event: 'Progress', data: { chunkLength: 60 } })
      cb({ event: 'Finished', data: {} })
    })
    check.mockResolvedValue({
      version: '9.9.9',
      downloadAndInstall,
    })
    relaunch.mockResolvedValue(undefined)

    const progress: Array<number | null> = []
    const ok = await downloadAndInstallUpdate((pct) => progress.push(pct))

    expect(ok).toBe(true)
    expect(downloadAndInstall).toHaveBeenCalledOnce()
    expect(relaunch).toHaveBeenCalledOnce()
    expect(progress[0]).toBe(0)
    expect(progress).toContain(40)
    expect(progress).toContain(100)
    expect(progress[progress.length - 1]).toBe(100)
  })

  it('reports null progress when contentLength unknown', async () => {
    const downloadAndInstall = vi.fn(async (cb: (e: unknown) => void) => {
      cb({ event: 'Started', data: { contentLength: undefined } })
      cb({ event: 'Progress', data: { chunkLength: 10 } })
      cb({ event: 'Finished', data: {} })
    })
    check.mockResolvedValue({ version: '1.0.1', downloadAndInstall })
    relaunch.mockResolvedValue(undefined)

    const progress: Array<number | null> = []
    await downloadAndInstallUpdate((pct) => progress.push(pct))
    expect(progress).toContain(null)
    expect(progress[progress.length - 1]).toBe(100)
  })
})
