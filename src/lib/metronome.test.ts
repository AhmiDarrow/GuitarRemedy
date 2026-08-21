import { describe, expect, it } from 'vitest'
import {
  beatInBar,
  bpmFromTaps,
  clampBpm,
  clickKind,
  countInClickCount,
  isDownbeat,
  subBeatDurationSec,
} from './metronome'

describe('metronome', () => {
  it('clamps BPM to a playable range', () => {
    expect(clampBpm(10)).toBe(30)
    expect(clampBpm(400)).toBe(300)
    expect(clampBpm(120.4)).toBe(120)
  })

  it('marks downbeats in 4/4 with eighths', () => {
    // subdivision 2: clicks 0,2,4,6 are beat pulses; 0 is downbeat
    expect(isDownbeat(0, 4, 2)).toBe(true)
    expect(isDownbeat(1, 4, 2)).toBe(false)
    expect(isDownbeat(2, 4, 2)).toBe(false)
    expect(isDownbeat(8, 4, 2)).toBe(true)
  })

  it('computes beat-in-bar', () => {
    expect(beatInBar(0, 4, 1)).toBe(0)
    expect(beatInBar(3, 4, 1)).toBe(3)
    expect(beatInBar(4, 4, 1)).toBe(0)
    expect(beatInBar(5, 4, 2)).toBe(2)
  })

  it('labels accent / beat / sub clicks', () => {
    expect(clickKind(0, { beatsPerBar: 4, subdivision: 2, accent: true })).toBe('accent')
    expect(clickKind(2, { beatsPerBar: 4, subdivision: 2, accent: true })).toBe('beat')
    expect(clickKind(1, { beatsPerBar: 4, subdivision: 2, accent: true })).toBe('sub')
  })

  it('sub-beat duration tracks BPM and subdivision', () => {
    expect(subBeatDurationSec(60, 1)).toBeCloseTo(1, 5)
    expect(subBeatDurationSec(60, 2)).toBeCloseTo(0.5, 5)
    expect(subBeatDurationSec(120, 4)).toBeCloseTo(0.125, 5)
  })

  it('estimates BPM from tap gaps', () => {
    const t0 = 1000
    // 500ms gaps → 120 BPM
    const taps = [t0, t0 + 500, t0 + 1000, t0 + 1500]
    expect(bpmFromTaps(taps)).toBe(120)
    expect(bpmFromTaps([1000])).toBeNull()
  })

  it('count-in click budget matches bars × beats × subdivision', () => {
    expect(countInClickCount(1, 4, 1)).toBe(4)
    expect(countInClickCount(2, 4, 2)).toBe(16)
    expect(countInClickCount(0, 4, 1)).toBe(0)
  })
})
