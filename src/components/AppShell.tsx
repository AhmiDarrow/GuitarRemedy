import { NavLink, Outlet } from 'react-router-dom'
import {
  BookOpen,
  Guitar,
  Home,
  Library,
  Upload,
  User,
  Flame,
  ScrollText,
  Info,
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import clsx from 'clsx'

const nav = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/practice', label: 'Practice', icon: Guitar },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/wiki', label: 'Wiki', icon: ScrollText },
  { to: '/profile', label: 'You', icon: User },
  { to: '/about', label: 'About', icon: Info },
]

export function AppShell() {
  const streak = useAppStore((s) => s.streak)
  const displayName = useAppStore((s) => s.displayName)

  return (
    <div className="min-h-dvh flex flex-col md:flex-row">
      <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)]/80 backdrop-blur-xl sticky top-0 h-dvh">
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/brand-mark.png"
              alt=""
              className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-mint/20 ring-1 ring-mint/30"
            />
            <div>
              <div className="font-display font-bold text-lg tracking-tight leading-none">
                Guitar<span className="text-mint">Remedy</span>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Day path · scales · tabs
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx('nav-link', isActive && 'active')
              }
            >
              <Icon className="w-4.5 h-4.5 opacity-80" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 m-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
          <div className="flex items-center gap-2 text-mint text-sm font-medium">
            <Flame className="w-4 h-4" />
            {streak} day streak
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
            {displayName || 'Player'}
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <header className="md:hidden sticky top-0 z-30 glass border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/assets/brand-mark.png"
              alt=""
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-mint/30"
            />
            <span className="font-display font-bold">
              Guitar<span className="text-mint">Remedy</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-mint text-sm font-medium">
            <Flame className="w-3.5 h-3.5" />
            {streak}
          </div>
        </header>

        <main className="flex-1 px-4 py-5 md:px-8 md:py-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-[var(--border)] safe-bottom">
        <div className="flex justify-around items-stretch px-1 py-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center gap-0.5 py-2 px-2 min-w-[3.25rem] rounded-xl text-[10px] font-medium transition-colors',
                  isActive
                    ? 'text-mint'
                    : 'text-[var(--text-muted)]',
                )
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
