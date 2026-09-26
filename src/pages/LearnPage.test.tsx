// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { LearnPage } from './LearnPage'
import { useAppStore } from '../store/appStore'
import { useLessonStore } from '../store/lessonStore'

vi.mock('../components/LessonDiagram', () => ({ LessonDiagramGallery: () => null }))
vi.mock('../lib/audio', () => ({ setPlaybackA4: vi.fn() }))
let root: Root, host: HTMLDivElement
beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  useAppStore.setState({ currentDay: 1, completedLessons: [], lastPracticeDate: null, streak: 0 })
  useLessonStore.setState({ sessions: {} })
  host = document.createElement('div'); document.body.append(host); root = createRoot(host)
})
afterEach(async () => { await act(async () => root.unmount()); host.remove() })
async function render(path = '/learn') {
  await act(async () => root.render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/learn" element={<LearnPage />} /><Route path="/learn/:day" element={<LearnPage />} />
  </Routes></MemoryRouter>))
}
function button(text: string) { return [...host.querySelectorAll('button')].find(b => b.textContent?.trim() === text)! }
async function click(element: HTMLElement) { await act(async () => element.click()) }

it('logs a developing skill without completing it or advancing the path', async () => {
  await render()
  expect(button('Save practice').disabled).toBe(true)
  await click(host.querySelector<HTMLInputElement>('input[value="building"]')!)
  await click(button('Save practice'))
  expect(useAppStore.getState().completedLessons).toEqual([])
  expect(useAppStore.getState().currentDay).toBe(1)
  expect(useAppStore.getState().lastPracticeDate).toBeTruthy()
  expect(useLessonStore.getState().sessions[1].confidence).toBe('building')
  expect(host.textContent).toContain('Review scheduled')
})

it('completes the assessed lesson without changing the page until Continue', async () => {
  await render()
  await click(host.querySelector<HTMLInputElement>('input[value="ready"]')!)
  await click(button('Save & complete lesson'))
  expect(useAppStore.getState().completedLessons).toEqual([1])
  expect(useAppStore.getState().currentDay).toBe(2)
  expect(host.querySelector('h2')?.textContent).toContain('Meet the Guitar')
  await click(button('Continue to day 2'))
  expect(host.querySelector('h2')?.textContent).toContain('Fretting Hand')
  expect(host.querySelector<HTMLInputElement>('input[value="ready"]')!.checked).toBe(false)
})

it('restores checkboxes when returning to a lesson and resets its temporary help', async () => {
  await render('/learn/3')
  await click(host.querySelector<HTMLInputElement>('input[type="checkbox"]')!)
  await click(button('Stuck? Make it smaller'))
  await click(host.querySelector<HTMLButtonElement>('button[aria-label="Next lesson"]')!)
  expect(host.querySelector<HTMLInputElement>('input[type="checkbox"]')!.checked).toBe(false)
  await click(host.querySelector<HTMLButtonElement>('button[aria-label="Previous lesson"]')!)
  expect(host.querySelector<HTMLInputElement>('input[type="checkbox"]')!.checked).toBe(true)
  expect(button('Stuck? Make it smaller')).toBeTruthy()
})

it('normalizes fractional lesson URLs and shows actual completion rather than page position', async () => {
  await render('/learn/3.5')
  expect(host.querySelector('h2')?.textContent).toContain('E Minor')
  expect(host.querySelector('[aria-label="Phase completion"]')?.getAttribute('aria-valuenow')).toBe('0')
})

it('shows one practice step, saves its place, and focuses the next instruction', async () => {
  await render('/learn/3')
  expect(host.querySelector('.practice-instruction')?.textContent).toContain('middle fingertip')
  await click(button('Next step'))
  expect(host.querySelector('.practice-instruction')?.textContent).toContain('ring fingertip')
  expect(document.activeElement?.id).toBe('current-practice-step')
  expect(useLessonStore.getState().sessions[3].practiceStep).toBe(1)
  await click(host.querySelector<HTMLButtonElement>('button[aria-label="Next lesson"]')!)
  expect(host.querySelector('#current-practice-step')?.textContent).toBe('Build G')
  await click(host.querySelector<HTMLButtonElement>('button[aria-label="Previous lesson"]')!)
  expect(host.querySelector('#current-practice-step')?.textContent).toBe('Place the second finger')
  expect(useAppStore.getState().completedLessons).toEqual([])
})

it('keeps optional reading collapsed and brings the self-check before the long plan', async () => {
  await render('/learn/9')
  const details = [...host.querySelectorAll('details')]
  expect(details.every(d => !d.open)).toBe(true)
  const full = details.find(d => d.querySelector('summary')?.textContent?.includes('Full session'))!
  expect(host.querySelector('#lesson-check')!.compareDocumentPosition(full) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  await click(host.querySelector<HTMLButtonElement>('button[aria-label="Go to practice step 3"]')!)
  expect(host.querySelector('table')?.getAttribute('aria-label')).toContain('down, down up')
})
