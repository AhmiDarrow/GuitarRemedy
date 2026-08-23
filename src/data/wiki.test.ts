import { describe, expect, it } from 'vitest'
import {
  WIKI_ARTICLES,
  WIKI_CATEGORIES,
  getWikiArticle,
  listWikiByCategory,
  searchWiki,
} from './wiki'

/** Encyclopedia depth: not stubs. */
const MIN_BODY = 900
const MIN_ARTICLES = 50

describe('wiki encyclopedia catalog', () => {
  it('has unique ids, every category used, and deep bodies', () => {
    const ids = WIKI_ARTICLES.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(WIKI_ARTICLES.length).toBeGreaterThanOrEqual(MIN_ARTICLES)

    for (const c of WIKI_CATEGORIES) {
      expect(listWikiByCategory(c.id).length).toBeGreaterThan(0)
    }

    for (const a of WIKI_ARTICLES) {
      expect(a.title.length).toBeGreaterThan(2)
      expect(a.summary.trim().length).toBeGreaterThan(24)
      expect(a.tags.length).toBeGreaterThan(0)
      expect(a.body.trim().length).toBeGreaterThan(MIN_BODY)
      expect(a.body).toMatch(/^## /m)
      expect(WIKI_CATEGORIES.some((c) => c.id === a.category)).toBe(true)
    }
  })

  it('resolves id and title slug; search finds core topics', () => {
    expect(getWikiArticle('notes-and-the-chromatic-scale')?.title).toMatch(/note/i)
    expect(getWikiArticle('Notes & the chromatic scale')?.id).toBe('notes-and-the-chromatic-scale')
    expect(getWikiArticle('missing-slug')).toBeUndefined()

    expect(searchWiki('caged').some((h) => h.id.includes('caged'))).toBe(true)
    expect(searchWiki('upload').some((h) => h.id.includes('upload'))).toBe(true)
    expect(searchWiki('license').length).toBeGreaterThan(0)
  })

  it('states free MIT / original teaching posture in orientation articles', () => {
    const welcome = getWikiArticle('welcome')!
    const license = getWikiArticle('license-and-free-content')!
    const blob = `${welcome.body} ${license.body}`.toLowerCase()
    expect(blob).toMatch(/mit/)
    expect(blob).toMatch(/original|not copied|not scraped/)
    expect(blob).not.toMatch(/option a/)
  })

  it('covers one-stop starter topics a new player needs', () => {
    const must = [
      'welcome',
      'how-to-read-this-wiki',
      'first-week-on-guitar',
      'notes-and-the-chromatic-scale',
      'intervals',
      'major-scale',
      'minor-scales',
      'modes',
      'pentatonic-and-blues',
      'chords-triads-sevenths',
      'diatonic-harmony',
      'circle-of-fifths',
      'rhythm-meter-groove',
      'caged-system',
      'reading-tab',
      'how-to-practice',
      'app-upload-breakdown',
      'glossary',
      'license-and-free-content',
    ]
    for (const id of must) {
      expect(getWikiArticle(id), id).toBeTruthy()
    }
  })
})
