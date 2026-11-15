/** Supported UI locales. English is the source catalog and the runtime fallback. */

export const LOCALES = [
  { id: 'en', native: 'English', bcp47: 'en' },
  { id: 'es', native: 'Español', bcp47: 'es' },
  { id: 'fr', native: 'Français', bcp47: 'fr' },
  { id: 'de', native: 'Deutsch', bcp47: 'de' },
  { id: 'pt-BR', native: 'Português (Brasil)', bcp47: 'pt-BR' },
  { id: 'it', native: 'Italiano', bcp47: 'it' },
  { id: 'ru', native: 'Русский', bcp47: 'ru' },
  { id: 'pl', native: 'Polski', bcp47: 'pl' },
  { id: 'ja', native: '日本語', bcp47: 'ja' },
  { id: 'ko', native: '한국어', bcp47: 'ko' },
  { id: 'zh-CN', native: '简体中文', bcp47: 'zh-CN' },
] as const

export type LocaleId = (typeof LOCALES)[number]['id']

export const LOCALE_IDS: LocaleId[] = LOCALES.map((l) => l.id)

export function isLocaleId(value: unknown): value is LocaleId {
  return typeof value === 'string' && LOCALES.some((l) => l.id === value)
}

export function localeMeta(id: LocaleId) {
  return LOCALES.find((l) => l.id === id) ?? LOCALES[0]
}

/** Map a BCP 47 tag to a shipped locale. Traditional Chinese stays unsupported (null). */
export function matchLocale(tag: string): LocaleId | null {
  const lower = tag.trim().replace(/_/g, '-').toLowerCase()
  if (!lower) return null
  if (lower === 'pt' || lower.startsWith('pt-br')) return 'pt-BR'
  if (
    lower.startsWith('zh-hant') ||
    lower === 'zh-tw' ||
    lower === 'zh-hk' ||
    lower === 'zh-mo'
  ) {
    return null
  }
  if (lower === 'zh' || lower.startsWith('zh-hans') || lower.startsWith('zh-cn')) return 'zh-CN'
  const base = lower.split('-')[0]
  const byBase: Record<string, LocaleId> = {
    en: 'en',
    es: 'es',
    fr: 'fr',
    de: 'de',
    it: 'it',
    ru: 'ru',
    pl: 'pl',
    ja: 'ja',
    ko: 'ko',
  }
  return byBase[base] ?? null
}

function systemLanguageTags(): string[] {
  try {
    const nav = (globalThis as { navigator?: { languages?: readonly string[]; language?: string } })
      .navigator
    if (nav?.languages?.length) return [...nav.languages]
    if (nav?.language) return [nav.language]
  } catch {
    /* node / restricted */
  }
  try {
    const loc = Intl.DateTimeFormat().resolvedOptions().locale
    if (loc) return [loc]
  } catch {
    /* ignore */
  }
  return []
}

/** First-run language: OS / browser list, else English. */
export function detectSystemLocale(): LocaleId {
  for (const tag of systemLanguageTags()) {
    const match = matchLocale(tag)
    if (match) return match
  }
  return 'en'
}
