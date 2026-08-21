import { beforeEach, describe, expect, it } from 'vitest'
import { useAppStore } from './appStore'
import { STANDARD_TUNING } from '../lib/theory'

describe('appStore tuning + onboarding', () => {
  beforeEach(() => {
    useAppStore.setState({
      tuningName: 'standard',
      customTuning: [...STANDARD_TUNING],
      onboarded: false,
      bpm: 80,
    })
  })

  it('setCustomTuning selects custom and getTuning returns those notes', () => {
    const drop = [38, 45, 50, 55, 59, 64]
    useAppStore.getState().setCustomTuning(drop)
    expect(useAppStore.getState().tuningName).toBe('custom')
    expect(useAppStore.getState().getTuning()).toEqual(drop)
  })

  it('preset tuning still wins when not on custom', () => {
    useAppStore.getState().setTuningName('drop_d')
    const t = useAppStore.getState().getTuning()
    expect(t[0]).toBe(38)
    expect(t).toHaveLength(6)
  })

  it('setBpm clamps to 30–300', () => {
    useAppStore.getState().setBpm(10)
    expect(useAppStore.getState().bpm).toBe(30)
    useAppStore.getState().setBpm(999)
    expect(useAppStore.getState().bpm).toBe(300)
  })

  it('completeOnboarding only needs onboarded flag', () => {
    useAppStore.getState().completeOnboarding('Ahmi', false)
    expect(useAppStore.getState().onboarded).toBe(true)
    expect(useAppStore.getState().displayName).toBe('Ahmi')
    expect((useAppStore.getState() as { onboardingDone?: boolean }).onboardingDone).toBeUndefined()
  })
})
