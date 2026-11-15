// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { AboutPage } from './AboutPage'
import { ABOUT_HELLO, ABOUT_SIGN_OFF, APP_NAME, APP_VERSION, GITHUB_REPO } from '../lib/brand'
import { initI18n } from '../i18n/runtime'
import { useAppStore } from '../store/appStore'

vi.mock('../lib/audio', () => ({ setPlaybackA4: vi.fn(), bindAudioUnlock: vi.fn() }))

let root: Root
let host: HTMLDivElement

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  useAppStore.setState({ locale: 'en' })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  await initI18n('en')
  useAppStore.setState({ locale: 'en' })
})

async function render() {
  await act(async () => {
    root.render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )
  })
}

it('shows the name, runtime version, repo link, greeting, and exact sign-off', async () => {
  await initI18n('en')
  await render()
  const text = host.textContent ?? ''
  expect(text).toContain(APP_NAME)
  expect(text).toContain(ABOUT_HELLO)
  expect(text).toContain(`v${APP_VERSION}`)
  expect(text).toContain(ABOUT_SIGN_OFF)
  expect(ABOUT_SIGN_OFF).toBe('"Hope this helps" - Ahmi')
  const link = host.querySelector(`a[href="${GITHUB_REPO}"]`)
  expect(link?.textContent).toBe(GITHUB_REPO)
  const signoff = host.querySelector('[data-about-signoff]')
  expect(signoff?.textContent).toBe('"Hope this helps" - Ahmi')
  expect(signoff?.getAttribute('translate')).toBe('no')
})

it('keeps the sign-off identical when the UI language changes', async () => {
  await initI18n('ja')
  useAppStore.setState({ locale: 'ja' })
  await render()
  const text = host.textContent ?? ''
  expect(text).toContain('概要')
  expect(text).toContain(ABOUT_HELLO)
  expect(text).toContain('"Hope this helps" - Ahmi')
  expect(host.querySelector('[data-about-signoff]')?.textContent).toBe('"Hope this helps" - Ahmi')
})
