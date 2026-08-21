import { create } from 'zustand'
import {
  breakdownToUserTab,
  loadUserTabs,
  saveUserTabs,
  type UserTab,
  upsertUserTab,
  removeUserTab,
  parseImportedTabFile,
} from '../lib/userTabs'
import type { RemedyBreakdown } from '../lib/breakdown'

interface UserTabsState {
  tabs: UserTab[]
  hydrated: boolean
  activeTabId: string | null
  hydrate: () => void
  upsertTab: (tab: UserTab) => void
  saveFromBreakdown: (
    b: RemedyBreakdown,
    opts?: string | { sourceName?: string; replaceId?: string },
  ) => UserTab | null
  removeTab: (id: string) => void
  setActiveTabId: (id: string | null) => void
  importGrTabJson: (text: string) => UserTab | null
  getById: (id: string) => UserTab | undefined
}

function ensureHydrated(
  get: () => UserTabsState,
  set: (p: Partial<UserTabsState>) => void,
): UserTab[] {
  if (!get().hydrated) {
    const tabs = loadUserTabs()
    set({ tabs, hydrated: true })
    return tabs
  }
  return get().tabs
}

export const useUserTabsStore = create<UserTabsState>((set, get) => ({
  tabs: [],
  hydrated: false,
  activeTabId: null,
  hydrate: () => {
    ensureHydrated(get, set)
  },
  upsertTab: (tab) => {
    const cur = ensureHydrated(get, set)
    const next = upsertUserTab(cur, tab)
    saveUserTabs(next)
    set({ tabs: next, hydrated: true, activeTabId: tab.id })
  },
  saveFromBreakdown: (b, opts) => {
    const sourceName = typeof opts === 'string' ? opts : opts?.sourceName
    const replaceId = typeof opts === 'string' ? undefined : opts?.replaceId
    const tab = breakdownToUserTab(b, { sourceName, id: replaceId })
    if (!tab) return null
    if (replaceId) tab.id = replaceId
    get().upsertTab(tab)
    return tab
  },
  removeTab: (id) => {
    const cur = ensureHydrated(get, set)
    const next = removeUserTab(cur, id)
    saveUserTabs(next)
    const active = get().activeTabId === id ? null : get().activeTabId
    set({ tabs: next, activeTabId: active })
  },
  setActiveTabId: (id) => set({ activeTabId: id }),
  importGrTabJson: (text) => {
    const tab = parseImportedTabFile(text)
    if (!tab) return null
    get().upsertTab(tab)
    return tab
  },
  getById: (id) => {
    const cur = ensureHydrated(get, set)
    return cur.find((t) => t.id === id)
  },
}))

// hydrate on module load (browser)
if (typeof window !== 'undefined') {
  try {
    useUserTabsStore.getState().hydrate()
  } catch {
    /* ignore */
  }
}
