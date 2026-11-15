import { useCallback, useSyncExternalStore } from 'react'
import { useAppStore } from '../store/appStore'
import { formatDate, formatDayStamp, formatMinutes, formatNumber } from './format'
import { getI18nRevision, getLocale, subscribeI18n, t, tCount, tx, txKey, type Vars } from './runtime'

/** Re-render when the active catalog changes. `t` itself reads module state. */
export function useI18n() {
  const locale = useAppStore((s) => s.locale)
  const revision = useSyncExternalStore(subscribeI18n, getI18nRevision, getI18nRevision)
  const translate = useCallback((key: string, vars?: Vars, fallback?: string) => t(key, vars, fallback), [locale, revision])
  const count = useCallback((key: string, n: number, vars?: Vars) => tCount(key, n, vars), [locale, revision])
  const txUi = useCallback((english: string, vars?: Vars) => tx(english, vars), [locale, revision])
  const txContent = useCallback((key: string, fallback: string, vars?: Vars) => txKey(key, fallback, vars), [locale, revision])
  return {
    locale: locale || getLocale(),
    t: translate,
    tCount: count,
    tx: txUi,
    txKey: txContent,
    formatNumber,
    formatDate,
    formatDayStamp,
    formatMinutes,
  }
}
