import { describe, expect, it } from 'vitest'
import { beatDurationSec, beatsToSeconds } from './tabScore'

describe('tabScore', () => {
  it('beatDurationSec at 60 BPM is 1 second', () => {
    expect(beatDurationSec(60, 1)).toBeCloseTo(1, 5)
  })

  it('beatDurationSec at 120 BPM is 0.5 seconds', () => {
    expect(beatDurationSec(120, 1)).toBeCloseTo(0.5, 5)
  })

  it('speed 2 halves duration', () => {
    expect(beatDurationSec(60, 2)).toBeCloseTo(0.5, 5)
  })

  it('beatsToSeconds scales linearly', () => {
    expect(beatsToSeconds(4, 120, 1)).toBeCloseTo(2, 5)
  })
})
