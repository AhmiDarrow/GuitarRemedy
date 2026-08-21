import { describe, expect, it } from 'vitest'
import {
  WIKI_ARTICLES,
  WIKI_CATEGORIES,
  getWikiArticle,
  searchWiki,
} from './wiki'

describe('wiki catalog', () => {
  it('has unique article ids and non-empty bodies', () => {
    const ids = WIKI_ARTICLES.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(WIKI_ARTICLES.length).toBeGreaterThanOrEqual(20)
    for (const a of WIKI_ARTICLES) {
      expect(a.title.length).toBeGreaterThan(2)
      expect(a.body.trim().length).toBeGreaterThan(80)
      expect(WIKI_CATEGORIES.some((c) => c.id === a.category)).toBe(true)
    }
  })

  it('resolves known slugs and searches', () => {
    expect(getWikiArticle('notes-and-the-chromatic-scale')?.title).toMatch(/note/i)
    expect(getWikiArticle('missing-slug')).toBeUndefined()
    const hits = searchWiki('caged')
    expect(hits.some((h) => h.id.includes('caged') || h.title.toLowerCase().includes('caged'))).toBe(
      true,
    )
  })
})
