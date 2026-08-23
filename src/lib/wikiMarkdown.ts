/**
 * Lightweight wiki body parser for GuitarRemedy encyclopedia articles.
 * Handles ## / ### headings, paragraphs, lists, tables, and fenced code.
 * Keeps list/table/code that starts on the line right under a heading
 * (no blank line) -- the old block-split renderer dropped that content.
 */

export type WikiNode =
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string; id: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; rows: string[][] }
  | { type: 'pre'; text: string }

const FENCE = String.fromCharCode(96, 96, 96) // ```

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function isBlank(line: string): boolean {
  return line.trim() === ''
}

function isUl(line: string): boolean {
  return /^\s*-\s+/.test(line)
}

function isOl(line: string): boolean {
  return /^\s*\d+\.\s+/.test(line)
}

function isTableRow(line: string): boolean {
  const t = line.trim()
  return t.startsWith('|') && t.includes('|', 1)
}

function isTableSep(line: string): boolean {
  return /^\s*\|?[\s:-]+\|/.test(line) && line.includes('-')
}

function isFence(line: string): boolean {
  return line.trimStart().startsWith(FENCE)
}

function isH2(line: string): boolean {
  return /^##\s+/.test(line) && !/^###/.test(line)
}

function isH3(line: string): boolean {
  return /^###\s+/.test(line)
}

function parseTableRows(lines: string[]): string[][] {
  return lines
    .filter((l) => isTableRow(l) && !isTableSep(l))
    .map((row) =>
      row
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((c) => c.trim()),
    )
    .filter((cells) => cells.some((c) => c.length > 0))
}

/** Parse markdown-ish wiki body into typed nodes (order preserved). */
export function parseWikiBody(body: string): WikiNode[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  const nodes: WikiNode[] = []
  const usedIds = new Set<string>()
  let i = 0

  const uniqueId = (text: string): string => {
    let base = slugifyHeading(text) || 'section'
    let id = base
    let n = 2
    while (usedIds.has(id)) {
      id = base + '-' + n
      n += 1
    }
    usedIds.add(id)
    return id
  }

  while (i < lines.length) {
    const line = lines[i]
    if (isBlank(line)) {
      i += 1
      continue
    }

    if (isH2(line)) {
      const text = line.replace(/^##\s+/, '').trim()
      nodes.push({ type: 'h2', text, id: uniqueId(text) })
      i += 1
      continue
    }

    if (isH3(line)) {
      const text = line.replace(/^###\s+/, '').trim()
      nodes.push({ type: 'h3', text, id: uniqueId(text) })
      i += 1
      continue
    }

    if (isFence(line)) {
      i += 1
      const chunk: string[] = []
      while (i < lines.length && !isFence(lines[i])) {
        chunk.push(lines[i])
        i += 1
      }
      if (i < lines.length && isFence(lines[i])) i += 1
      nodes.push({ type: 'pre', text: chunk.join('\n') })
      continue
    }

    if (isTableRow(line)) {
      const chunk: string[] = []
      while (i < lines.length && (isTableRow(lines[i]) || isTableSep(lines[i]))) {
        chunk.push(lines[i])
        i += 1
      }
      const rows = parseTableRows(chunk)
      if (rows.length) nodes.push({ type: 'table', rows })
      continue
    }

    if (isUl(line)) {
      const items: string[] = []
      while (i < lines.length && isUl(lines[i])) {
        items.push(lines[i].replace(/^\s*-\s+/, '').trim())
        i += 1
      }
      nodes.push({ type: 'ul', items })
      continue
    }

    if (isOl(line)) {
      const items: string[] = []
      while (i < lines.length && isOl(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '').trim())
        i += 1
      }
      nodes.push({ type: 'ol', items })
      continue
    }

    const chunk: string[] = []
    while (i < lines.length) {
      const L = lines[i]
      if (isBlank(L)) break
      if (isH2(L) || isH3(L) || isFence(L) || isTableRow(L) || isUl(L) || isOl(L)) break
      chunk.push(L.trim())
      i += 1
    }
    if (chunk.length) {
      nodes.push({ type: 'p', text: chunk.join(' ') })
    }
  }

  return nodes
}

/** Plain-text dump for tests -- proves section bodies are not dropped. */
export function wikiBodyPlainText(body: string): string {
  return parseWikiBody(body)
    .map((n) => {
      switch (n.type) {
        case 'h2':
        case 'h3':
          return n.text
        case 'p':
          return n.text
        case 'ul':
        case 'ol':
          return n.items.join('\n')
        case 'table':
          return n.rows.map((r) => r.join(' | ')).join('\n')
        case 'pre':
          return n.text
        default:
          return ''
      }
    })
    .join('\n')
}

export function sectionHeadingsFromBody(body: string): { text: string; id: string }[] {
  return parseWikiBody(body)
    .filter((n): n is Extract<WikiNode, { type: 'h2' }> => n.type === 'h2')
    .slice(0, 16)
    .map((n) => ({ text: n.text, id: n.id }))
}
