import { describe, expect, it } from 'vitest'
import { parseNumberDraft, settleNumberDraft } from './NumberInput'

describe('NumberInput drafts', () => {
  it('does not commit partial values while typing toward an in-range number', () => {
    // Typing "120" into a 30–300 BPM field: "1" and "12" must not snap to 30.
    expect(parseNumberDraft('1', 30, 300, true)).toBeNull()
    expect(parseNumberDraft('12', 30, 300, true)).toBeNull()
    expect(parseNumberDraft('120', 30, 300, true)).toBe(120)
  })

  it('ignores empty and non-numeric drafts', () => {
    expect(parseNumberDraft('', 0, 24)).toBeNull()
    expect(parseNumberDraft('  ', 0, 24)).toBeNull()
    expect(parseNumberDraft('abc', 0, 24)).toBeNull()
    expect(settleNumberDraft('', 400, 480)).toBeNull()
  })

  it('clamps and rounds when the field is settled', () => {
    expect(settleNumberDraft('4', 400, 480, true)).toBe(400)
    expect(settleNumberDraft('999', 400, 480, true)).toBe(480)
    expect(settleNumberDraft('432.6', 400, 480, true)).toBe(433)
    expect(settleNumberDraft('1.25', 0, undefined)).toBe(1.25)
  })
})
