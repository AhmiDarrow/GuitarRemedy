// @vitest-environment jsdom
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { TunerPanel } from './TunerPanel'
import { startLiveTuner } from '../lib/tuner'

vi.mock('../lib/audio', () => ({ playMidiNote: vi.fn(), setPlaybackA4: vi.fn() }))
vi.mock('../lib/tuner', async (original) => ({ ...await original<typeof import('../lib/tuner')>(), startLiveTuner: vi.fn() }))
let root: Root, host: HTMLDivElement, mounted: boolean
beforeEach(async () => {
  vi.clearAllMocks()
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  host = document.createElement('div'); document.body.append(host); root = createRoot(host); mounted = true
  await act(async () => root.render(createElement(TunerPanel)))
})
afterEach(async () => { if (mounted) await act(async () => root.unmount()); host.remove(); vi.restoreAllMocks(); vi.unstubAllGlobals() })
function button(label: string) { return [...host.querySelectorAll('button')].find(b => b.textContent?.trim() === label)! }
it('releases a microphone permission result arriving after unmount', async () => {
  let resolve!: (stop: () => void) => void
  const stop = vi.fn()
  vi.mocked(startLiveTuner).mockImplementation(() => new Promise(r => { resolve = r }))
  await act(async () => button('Listen').click())
  await act(async () => root.unmount()); mounted = false
  await act(async () => resolve(stop))
  expect(stop).toHaveBeenCalledOnce()
})
it('allows cancelling a pending microphone request', async () => {
  let resolve!: (stop: () => void) => void
  const stop = vi.fn()
  vi.mocked(startLiveTuner).mockImplementation(() => new Promise(r => { resolve = r }))
  await act(async () => button('Listen').click())
  await act(async () => button('Cancel request').click())
  await act(async () => resolve(stop))
  expect(stop).toHaveBeenCalledOnce(); expect(button('Listen')).toBeTruthy()
})
it('guards two clicks before a pending request renders', async () => {
  vi.mocked(startLiveTuner).mockImplementation(() => new Promise(() => {}))
  await act(async () => { const listen = button('Listen'); listen.click(); listen.click() })
  expect(startLiveTuner).toHaveBeenCalledOnce()
})
