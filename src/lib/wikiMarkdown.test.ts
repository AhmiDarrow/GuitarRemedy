import { describe, expect, it } from 'vitest'
import { WIKI_ARTICLES } from '../data/wiki'
import {
  parseWikiBody,
  sectionHeadingsFromBody,
  wikiBodyPlainText,
} from './wikiMarkdown'

const welcomeBody = `This wiki is a **free** encyclopedia.

## Who this is for
- Absolute beginners
- Returning players

## How to use it
- Browse by category
- Search for a word

## License
GuitarRemedy and this wiki: **MIT**.

Hi — I'm Ahmi.`

describe('parseWikiBody', () => {
  it('keeps list items that sit directly under ## headings (no blank line)', () => {
    const nodes = parseWikiBody(welcomeBody)
    const types = nodes.map((n) => n.type)
    expect(types).toEqual(['p', 'h2', 'ul', 'h2', 'ul', 'h2', 'p', 'p'])

    const firstList = nodes.find((n) => n.type === 'ul')
    expect(firstList && firstList.type === 'ul' && firstList.items[0]).toMatch(/Absolute beginners/)

    const plain = wikiBodyPlainText(welcomeBody)
    expect(plain).toMatch(/Absolute beginners/)
    expect(plain).toMatch(/Browse by category/)
    expect(plain).toMatch(/MIT/)
    expect(plain).toMatch(/Ahmi/)
  })

  it('parses tables and fenced code under headings', () => {
    const body = `Intro line.

## Pairing
| Want | Go |
|------|-----|
| Lesson | Learn |
| Neck | Practice |

## Tab
\`\`\`
e |--0--
\`\`\`
`
    const nodes = parseWikiBody(body)
    expect(nodes.some((n) => n.type === 'table')).toBe(true)
    expect(nodes.some((n) => n.type === 'pre')).toBe(true)
    const table = nodes.find((n) => n.type === 'table')
    expect(table && table.type === 'table' && table.rows[0]).toEqual(['Want', 'Go'])
    expect(table && table.type === 'table' && table.rows[1]).toEqual(['Lesson', 'Learn'])
  })

  it('does not drop body content for any live wiki article', () => {
    for (const a of WIKI_ARTICLES) {
      const nodes = parseWikiBody(a.body)
      const h2 = nodes.filter((n) => n.type === 'h2')
      expect(h2.length, a.id).toBeGreaterThan(0)

      const afterHeading = nodes.some(
        (n, i) =>
          i > 0 &&
          nodes[i - 1]?.type === 'h2' &&
          (n.type === 'p' || n.type === 'ul' || n.type === 'ol' || n.type === 'table' || n.type === 'pre'),
      )
      expect(afterHeading, `${a.id} should have content under a heading`).toBe(true)

      const plain = wikiBodyPlainText(a.body)
      // Must include more than just the heading titles
      const headingTextLen = h2.reduce((s, n) => s + (n.type === 'h2' ? n.text.length : 0), 0)
      expect(plain.length, a.id).toBeGreaterThan(headingTextLen + 80)
    }
  })

  it('builds stable heading ids for on-this-page links', () => {
    const heads = sectionHeadingsFromBody(welcomeBody)
    expect(heads.map((h) => h.text)).toEqual(['Who this is for', 'How to use it', 'License'])
    expect(heads[0].id).toBe('who-this-is-for')
  })
})
