import enMessages from './messages/en.json'
import { localeMeta, type LocaleId, isLocaleId } from './locales'

export type Vars = Record<string, string | number | undefined>

type Dict = Record<string, string>

const enPack: Dict = enMessages as Dict
let locale: LocaleId = 'en'
let pack: Dict = enPack
let revision = 0
const listeners = new Set<() => void>()

/** Other UI catalogs. English is imported statically. Missing files are skipped. */
const messageModules = import.meta.glob('./messages/*.json')

/** Translated content packs. English content stays in source data (and i18n/source for parity). */
const contentModules = import.meta.glob('./content/*/*.json')

const CONTENT_FILES = ['lessons-1', 'lessons-2', 'lessons-3', 'lessons-4', 'wiki', 'library', 'coach'] as const

async function loadModule(loader: () => Promise<unknown>): Promise<Dict> {
  try {
    const mod = (await loader()) as { default?: Dict }
    const data = mod?.default ?? (mod as Dict)
    if (!data || typeof data !== 'object') return {}
    return data
  } catch {
    return {}
  }
}

async function loadMessages(id: LocaleId): Promise<Dict> {
  if (id === 'en') return enPack
  const loader = messageModules[`./messages/${id}.json`]
  if (!loader) return {}
  return loadModule(loader)
}

async function loadContent(id: Exclude<LocaleId, 'en'>): Promise<Dict> {
  const parts = await Promise.all(
    CONTENT_FILES.map((name) => {
      const loader = contentModules[`./content/${id}/${name}.json`]
      return loader ? loadModule(loader) : Promise.resolve({} as Dict)
    }),
  )
  return Object.assign({}, ...parts)
}

export function getLocale(): LocaleId {
  return locale
}

export function getI18nRevision(): number {
  return revision
}

export function subscribeI18n(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notify() {
  revision += 1
  for (const listener of listeners) listener()
}

function lookup(key: string, fallback?: string): string {
  const current = pack[key]
  if (typeof current === 'string' && current.length > 0) return current
  const english = enPack[key]
  if (typeof english === 'string' && english.length > 0) return english
  if (typeof fallback === 'string' && fallback.length > 0) return fallback
  return key
}

/** Translate `key`. Missing keys fall back to English, then `fallback`, then the key. Never blank. */
export function t(key: string, vars?: Vars, fallback?: string): string {
  return interpolate(lookup(key, fallback), vars)
}

/**
 * UI chrome. The English source string is the key.
 * Locale `en` returns that string unchanged (aside from `{placeholders}`) so tests stay exact.
 */
export function tx(english: string, vars?: Vars): string {
  if (typeof english !== 'string') return ''
  if (english.length === 0) return ''
  if (locale === 'en') return interpolate(english, vars)
  return t(english, vars, english)
}

/**
 * Long content. `key` is semantic (`lesson.1.title`). `fallback` is the English source sentence.
 * Locale `en` returns `fallback` so curriculum tests keep the original objects' text.
 */
export function txKey(key: string, fallback: string, vars?: Vars): string {
  const fb = typeof fallback === 'string' && fallback.length > 0 ? fallback : key
  if (locale === 'en') return interpolate(fb, vars)
  return t(key, vars, fb)
}

const PLURAL_ORDER = ['one', 'two', 'few', 'many', 'other'] as const

/** `{key}.one|few|many|other` via Intl.PluralRules. `{n}` and `{count}` are filled. */
export function tCount(key: string, n: number, vars?: Vars): string {
  let category = 'other'
  try {
    category = new Intl.PluralRules(localeMeta(locale).bcp47).select(n)
  } catch {
    category = 'other'
  }
  const order = [category, ...PLURAL_ORDER]
  const merged = { ...vars, n, count: n }
  for (const cat of order) {
    const pluralKey = `${key}.${cat}`
    if (pack[pluralKey] || enPack[pluralKey]) return t(pluralKey, merged)
  }
  return t(key, merged, String(n))
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (token, name: string) => {
    const value = vars[name]
    return value === undefined ? token : String(value)
  })
}

export function applyDocumentLang(id: LocaleId = locale) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = localeMeta(id).bcp47
}

let loadToken = 0

/** Load UI + content catalogs. English content stays in source data and is the fallback. */
export async function initI18n(next: LocaleId): Promise<void> {
  if (!isLocaleId(next)) next = 'en'
  if (next === 'en') {
    loadToken += 1
    pack = enPack
    locale = 'en'
    applyDocumentLang('en')
    notify()
    return
  }
  const token = ++loadToken
  let messages: Dict = {}
  let content: Dict = {}
  try {
    const loaded = await Promise.all([loadMessages(next), loadContent(next)])
    messages = loaded[0]
    content = loaded[1]
  } catch {
    messages = {}
    content = {}
  }
  if (token !== loadToken) return
  pack = { ...enPack, ...messages, ...content }
  locale = next
  applyDocumentLang(next)
  notify()
}
