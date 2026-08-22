import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  ChevronDown,
  Gauge,
  Guitar,
  Info,
  Library,
  ScrollText,
  Settings2,
  Upload,
  User,
  AudioLines,
} from 'lucide-react'
import clsx from 'clsx'

type MenuItem = {
  to: string
  label: string
  hint?: string
  icon: typeof Guitar
  state?: Record<string, unknown>
}

const MENU: MenuItem[] = [
  { to: '/practice', label: 'Metronome', hint: 'Keep time', icon: Gauge, state: { tool: 'metronome' } },
  { to: '/practice', label: 'Tuner', hint: 'Standalone · own A4 & tuning', icon: AudioLines, state: { tool: 'tuner' } },
  { to: '/practice', label: 'Fretboard', hint: 'Scales lab', icon: Guitar, state: { tool: 'fretboard' } },
  { to: '/wiki', label: 'Wiki', hint: 'Theory & craft', icon: ScrollText },
  { to: '/learn', label: 'Lessons', hint: 'Day 1–365', icon: BookOpen },
  { to: '/library', label: 'Library', hint: 'Songs & riffs', icon: Library },
  { to: '/upload', label: 'Upload', hint: 'Song → tabs', icon: Upload },
  { to: '/profile', label: 'Settings', hint: 'You · fretboard · BPM', icon: Settings2 },
  { to: '/profile', label: 'Profile', hint: 'Progress & prefs', icon: User },
  { to: '/about', label: 'About', hint: 'Ahmi · updates', icon: Info },
]

type Props = {
  /** Larger mark for desktop rail */
  size?: 'sm' | 'md'
  className?: string
  showTitle?: boolean
}

export function AppMenu({ size = 'md', className, showTitle = true }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const mark = size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-10 h-10 rounded-xl'

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (item: MenuItem) => {
    setOpen(false)
    navigate(item.to, item.state ? { state: item.state } : undefined)
  }

  return (
    <div ref={rootRef} className={clsx('relative', className)}>
      <button
        type="button"
        className="flex items-center gap-2.5 rounded-xl text-left hover:bg-white/5 transition-colors pr-1.5 -ml-1 pl-1 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint/50"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open app menu"
        onClick={() => setOpen((v) => !v)}
      >
        <img
          src="/assets/brand-mark.png"
          alt=""
          className={clsx(mark, 'object-cover shadow-lg shadow-mint/20 ring-1 ring-mint/30')}
        />
        {showTitle ? (
          <span className="min-w-0">
            <span className="font-display font-bold text-lg tracking-tight leading-none flex items-center gap-1">
              Guitar<span className="text-mint">Remedy</span>
              <ChevronDown
                className={clsx(
                  'w-3.5 h-3.5 text-[var(--text-muted)] transition-transform',
                  open && 'rotate-180',
                )}
              />
            </span>
            <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">
              Menu · tools · wiki
            </span>
          </span>
        ) : (
          <ChevronDown
            className={clsx(
              'w-3.5 h-3.5 text-[var(--text-muted)] transition-transform',
              open && 'rotate-180',
            )}
          />
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-full mt-2 z-50 w-64 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-1.5 animate-fade-up"
        >
          <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold">
            App
          </p>
          {MENU.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={`${item.to}-${item.label}`}
                type="button"
                role="menuitem"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-mint/10 transition-colors"
                onClick={() => go(item)}
              >
                <span className="w-8 h-8 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-mint" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-[var(--text)]">{item.label}</span>
                  {item.hint ? (
                    <span className="block text-[11px] text-[var(--text-muted)] truncate">
                      {item.hint}
                    </span>
                  ) : null}
                </span>
              </button>
            )
          })}
          <div className="my-1 border-t border-[var(--border)]" />
          <Link
            to="/about"
            role="menuitem"
            className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-muted)] hover:text-mint rounded-xl"
            onClick={() => setOpen(false)}
          >
            Check for updates · About
          </Link>
        </div>
      ) : null}
    </div>
  )
}
