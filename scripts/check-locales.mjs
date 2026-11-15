/**
 * Locale parity check.
 * Every shipped locale must match the English key set, parse as JSON,
 * keep the same {placeholder} multiset, and not leave long strings in English.
 *
 *   node scripts/check-locales.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const LOCALES = ['es', 'fr', 'de', 'pt-BR', 'it', 'ru', 'pl', 'ja', 'ko', 'zh-CN']
const CONTENT_FILES = ['lessons-1', 'lessons-2', 'lessons-3', 'lessons-4', 'wiki', 'library', 'coach']

const PROTECTED = [
  "Hi I'm Ahmi, hope this helps!",
  "Hi — I'm Ahmi. Hope this helps you stay on the instrument.",
]

const BRANDS = [
  'GuitarRemedy',
  'Remedy',
  'ClaimIDX',
  'Ahmi',
  'GitHub',
  'Patreon',
  'Guitar Pro',
  'MusicXML',
  'MIDI',
  'HPSS',
  'CAGED',
  'DADGAD',
  'PWA',
  'BPM',
  'MIT',
]

const PLACEHOLDER = /\{[a-zA-Z0-9_]+\}/g

function readJson(path) {
  const text = readFileSync(path, 'utf8')
  try {
    const data = JSON.parse(text)
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('expected an object')
    }
    return data
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`${path}: ${message}`)
  }
}

function placeholders(value) {
  return [...String(value).matchAll(PLACEHOLDER)].map((match) => match[0]).sort()
}

function sameMultiset(a, b) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/** True when a copied English string is only brands, the Ahmi lines, or punctuation. */
function identicalAllowed(value) {
  let rest = value
  for (const line of PROTECTED) rest = rest.split(line).join('')
  for (const brand of BRANDS) rest = rest.split(brand).join('')
  rest = rest.replace(PLACEHOLDER, '')
  rest = rest.replace(/[\s\d.,;:!?—–\-–+*/()[\]{}'"“”‘’`·•/\\|&]+/gu, '')
  return rest.length === 0
}

function compareMaps(label, english, translated, errors) {
  const enKeys = Object.keys(english)
  const trKeys = Object.keys(translated)
  const enSet = new Set(enKeys)
  const trSet = new Set(trKeys)
  const missing = enKeys.filter((key) => !trSet.has(key))
  const extra = trKeys.filter((key) => !enSet.has(key))
  if (missing.length) errors.push(`${label}: missing ${missing.length} keys (e.g. ${missing.slice(0, 5).join(', ')})`)
  if (extra.length) errors.push(`${label}: extra ${extra.length} keys (e.g. ${extra.slice(0, 5).join(', ')})`)

  for (const key of enKeys) {
    if (!trSet.has(key)) continue
    const en = english[key]
    const tr = translated[key]
    if (typeof en !== 'string' || en.length === 0) errors.push(`${label}: empty English value for ${key}`)
    if (typeof tr !== 'string' || tr.length === 0) {
      errors.push(`${label}: empty value for ${key}`)
      continue
    }
    const enPh = placeholders(en)
    const trPh = placeholders(tr)
    if (!sameMultiset(enPh, trPh)) {
      errors.push(`${label}: placeholders differ for ${key} (${enPh.join(' ')} vs ${trPh.join(' ')})`)
    }
    for (const line of PROTECTED) {
      if (en.includes(line) && !tr.includes(line)) {
        errors.push(`${label}: protected Ahmi line missing in ${key}`)
      }
    }
    for (const brand of ['GuitarRemedy', 'Remedy', 'ClaimIDX', 'Ahmi']) {
      if (en.includes(brand) && !tr.includes(brand)) {
        errors.push(`${label}: brand ${brand} missing in ${key}`)
      }
    }
    if (tr === en && en.length > 24 && !identicalAllowed(en)) {
      errors.push(`${label}: untranslated long string for ${key}`)
    }
  }
}

export function checkLocales() {
  const errors = []
  let contentKeys = 0
  let messageKeys = 0

  const enMessagesPath = join(root, 'src', 'i18n', 'messages', 'en.json')
  const enMessages = readJson(enMessagesPath)
  messageKeys = Object.keys(enMessages).length

  for (const file of CONTENT_FILES) {
    const enPath = join(root, 'src', 'i18n', 'source', `${file}.json`)
    if (!existsSync(enPath)) {
      errors.push(`missing English catalog ${enPath}`)
      continue
    }
    const english = readJson(enPath)
    contentKeys += Object.keys(english).length
    for (const locale of LOCALES) {
      const path = join(root, 'src', 'i18n', 'content', locale, `${file}.json`)
      if (!existsSync(path)) {
        errors.push(`missing ${locale}/${file}.json`)
        continue
      }
      let translated
      try {
        translated = readJson(path)
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error))
        continue
      }
      compareMaps(`${locale}/${file}`, english, translated, errors)
    }
  }

  for (const locale of LOCALES) {
    const path = join(root, 'src', 'i18n', 'messages', `${locale}.json`)
    if (!existsSync(path)) {
      errors.push(`missing messages/${locale}.json`)
      continue
    }
    let translated
    try {
      translated = readJson(path)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
      continue
    }
    compareMaps(`messages/${locale}`, enMessages, translated, errors)
  }

  return { errors, contentKeys, messageKeys, locales: LOCALES.length }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isMain) {
  const result = checkLocales()
  if (result.errors.length) {
    const shown = result.errors.slice(0, 80)
    for (const error of shown) console.error(error)
    if (result.errors.length > shown.length) {
      console.error(`… ${result.errors.length - shown.length} more`)
    }
    console.error(`FAILED ${result.errors.length} problems`)
    process.exit(1)
  }
  console.log(
    `ok locales=${result.locales} contentKeys=${result.contentKeys} messageKeys=${result.messageKeys}`,
  )
}
