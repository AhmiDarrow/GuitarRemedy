// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { NumberInput } from './NumberInput'

let root: Root, host: HTMLDivElement
const commits: number[] = []

function Harness() {
  const [bpm, setBpm] = useState(80)
  return (
    <>
      <NumberInput
        integer
        min={30}
        max={300}
        value={bpm}
        onCommit={(n) => {
          commits.push(n)
          setBpm(Math.max(30, Math.min(300, Math.round(n))))
        }}
      />
      <output>{bpm}</output>
    </>
  )
}

beforeEach(async () => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  commits.length = 0
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  await act(async () => root.render(<Harness />))
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})

const input = () => host.querySelector('input')!
async function type(value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
  await act(async () => {
    setter.call(input(), value)
    input().dispatchEvent(new Event('input', { bubbles: true }))
  })
}

it('lets the user clear the field and type a new tempo digit by digit', async () => {
  await act(async () => input().focus())
  await type('')
  await type('1')
  expect(input().value).toBe('1')
  await type('12')
  await type('120')
  expect(commits).toEqual([120])
  expect(host.querySelector('output')!.textContent).toBe('120')
})

it('clamps an out-of-range entry on blur and restores an empty field', async () => {
  await act(async () => input().focus())
  await type('999')
  await act(async () => input().blur())
  expect(input().value).toBe('300')
  await act(async () => input().focus())
  await type('')
  await act(async () => input().blur())
  expect(input().value).toBe('300')
})
