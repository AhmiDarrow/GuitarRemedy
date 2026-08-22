import { beforeEach, describe, expect, it } from 'vitest'
import { STANDARD_TUNING } from '../lib/theory'
import { DEFAULT_RMS_GATE } from '../lib/tuner'
import { useTunerStore } from './tunerStore'

describe('tunerStore (standalone)', () => {
  beforeEach(() => {
    useTunerStore.setState({
      a4: 440,
      tuningName: 'standard',
      customTuning: [...STANDARD_TUNING],
      steelStrings: true,
      rmsGate: DEFAULT_RMS_GATE,
    })
  })

  it('clamps A4 to 400–480', () => {
    useTunerStore.getState().setA4(300)
    expect(useTunerStore.getState().a4).toBe(440)
    useTunerStore.getState().setA4(432)
    expect(useTunerStore.getState().a4).toBe(432)
    useTunerStore.getState().setA4(500)
    expect(useTunerStore.getState().a4).toBe(440)
  })

  it('custom tuning is independent of app profile store', () => {
    const drop = [38, 45, 50, 55, 59, 64]
    useTunerStore.getState().setCustomTuning(drop)
    expect(useTunerStore.getState().tuningName).toBe('custom')
    expect(useTunerStore.getState().getTuning()).toEqual(drop)
  })

  it('preset drop_d open strings', () => {
    useTunerStore.getState().setTuningName('drop_d')
    const t = useTunerStore.getState().getTuning()
    expect(t[0]).toBe(38)
    expect(t).toHaveLength(6)
  })

  it('steel strings + rms gate clamp', () => {
    useTunerStore.getState().setSteelStrings(false)
    expect(useTunerStore.getState().steelStrings).toBe(false)
    useTunerStore.getState().setRmsGate(0)
    expect(useTunerStore.getState().rmsGate).toBe(0.0005)
    useTunerStore.getState().setRmsGate(1)
    expect(useTunerStore.getState().rmsGate).toBe(0.05)
  })
})
