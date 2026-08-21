import { useState } from 'react'
import { Guitar, Hand, Music2, Sparkles } from 'lucide-react'
import { useAppStore } from '../store/appStore'

export function Onboarding() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const [name, setName] = useState('')
  const [lefty, setLefty] = useState(false)
  const [step, setStep] = useState(0)

  const finish = () => {
    completeOnboarding(name.trim() || 'Player', lefty)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md">
      <div className="card max-w-md w-full p-6 md:p-8 animate-fade-up shadow-2xl shadow-ink/60 ring-1 ring-mint/15">
        {step === 0 && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mint to-teal flex items-center justify-center mb-5 shadow-lg shadow-mint/30">
              <Guitar className="w-7 h-7 text-ink" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Welcome to GuitarRemedy
            </h1>
            <p className="text-[var(--text-muted)] mt-2 text-sm leading-relaxed">
              Scales, tabs, a 365-day path, song upload to tabs, and a full guitar wiki — polished for
              desktop and phone. Built for real practice, not gimmicks.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex gap-3 items-start">
                <Music2 className="w-4 h-4 text-mint mt-0.5 shrink-0" />
                Interactive fretboard, modes, and play-along
              </li>
              <li className="flex gap-3 items-start">
                <Sparkles className="w-4 h-4 text-mint mt-0.5 shrink-0" />
                Drop MP3/WAV/MIDI/MusicXML — get editable tabs + scale map
              </li>
              <li className="flex gap-3 items-start">
                <Hand className="w-4 h-4 text-mint mt-0.5 shrink-0" />
                Day 1–365 private lessons with streaks
              </li>
            </ul>
            <button type="button" className="btn-primary w-full mt-6" onClick={() => setStep(1)}>
              Get started
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="font-display text-xl font-bold">Quick setup</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1 mb-5">Saved on this device only.</p>
            <label className="block text-sm font-medium mb-1.5">Your name</label>
            <input
              className="input mb-4"
              placeholder="Ahmi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] cursor-pointer">
              <input
                type="checkbox"
                checked={lefty}
                onChange={(e) => setLefty(e.target.checked)}
                className="accent-[var(--mint)] w-4 h-4"
              />
              <span className="text-sm">
                Left-handed fretboard
                <span className="block text-xs text-[var(--text-muted)]">Mirrors the neck view</span>
              </span>
            </label>
            <div className="flex gap-2 mt-6">
              <button type="button" className="btn-ghost flex-1" onClick={() => setStep(0)}>
                Back
              </button>
              <button type="button" className="btn-primary flex-1" onClick={finish}>
                Start learning
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
