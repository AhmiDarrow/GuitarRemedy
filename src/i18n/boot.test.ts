import { describe, expect, it } from 'vitest'
import { localeForFirstPaint, readPersistedLocale } from './boot'
import { isLocaleId, matchLocale } from './locales'

describe('matchLocale', () => {
  it('maps shipped language tags and leaves Traditional Chinese unsupported', () => {
    expect(matchLocale('es-MX')).toBe('es')
    expect(matchLocale('ES')).toBe('es')
    expect(matchLocale('pt')).toBe('pt-BR')
    expect(matchLocale('pt-BR')).toBe('pt-BR')
    expect(matchLocale('pt_br')).toBe('pt-BR')
    expect(matchLocale('zh')).toBe('zh-CN')
    expect(matchLocale('zh-Hans-CN')).toBe('zh-CN')
    expect(matchLocale('zh-CN')).toBe('zh-CN')
    expect(matchLocale('zh-TW')).toBeNull()
    expect(matchLocale('zh-Hant')).toBeNull()
    expect(matchLocale('zh-HK')).toBeNull()
    expect(matchLocale('zh-MO')).toBeNull()
    expect(matchLocale('de-DE')).toBe('de')
    expect(matchLocale('ja-JP')).toBe('ja')
    expect(matchLocale('fr')).toBe('fr')
    expect(matchLocale('ko-KR')).toBe('ko')
    expect(matchLocale('pl')).toBe('pl')
    expect(matchLocale('ru-RU')).toBe('ru')
    expect(matchLocale('it-IT')).toBe('it')
    expect(matchLocale('en-US')).toBe('en')
    expect(matchLocale('')).toBeNull()
    expect(matchLocale('xx')).toBeNull()
  })
})

describe('readPersistedLocale', () => {
  it('keeps a saved locale, including explicit English, and ignores junk', () => {
    expect(readPersistedLocale(null)).toBeNull()
    expect(readPersistedLocale('not json')).toBeNull()
    expect(readPersistedLocale(JSON.stringify({ state: { locale: 'en', displayName: 'Ahmi' } }))).toBe('en')
    expect(readPersistedLocale(JSON.stringify({ state: { locale: 'de', bpm: 90 } }))).toBe('de')
    expect(readPersistedLocale(JSON.stringify({ state: { locale: 'zh-TW' } }))).toBeNull()
    expect(readPersistedLocale(JSON.stringify({ state: { displayName: 'Ahmi' } }))).toBeNull()
    const picked = localeForFirstPaint(JSON.stringify({ state: { locale: 'ja' } }))
    expect(picked).toBe('ja')
    expect(isLocaleId(localeForFirstPaint(null))).toBe(true)
  })
})
