import { isLocaleId, detectSystemLocale, type LocaleId } from './locales'

/** Same key as the zustand persist middleware in appStore. */
export const SETTINGS_KEY = 'guitar-remedy-v1'

/**
 * Read a previously saved locale from the raw persist blob.
 * Returns null when the key is missing or not a shipped locale, so first run can detect the OS language.
 * A saved `en` is a real choice and must not be replaced.
 */
export function readPersistedLocale(raw: string | null): LocaleId | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { state?: { locale?: unknown } }
    const locale = parsed?.state?.locale
    return isLocaleId(locale) ? locale : null
  } catch {
    return null
  }
}

export function localeForFirstPaint(raw: string | null): LocaleId {
  return readPersistedLocale(raw) ?? detectSystemLocale()
}
