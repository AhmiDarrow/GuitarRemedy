import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Search, BookMarked } from 'lucide-react'
import {
  WIKI_ARTICLES,
  WIKI_CATEGORIES,
  getWikiArticle,
  searchWiki,
  type WikiCategory,
} from '../data/wiki'
import clsx from 'clsx'

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const key = `${keyBase}-${i}`
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={key}
          className="px-1.5 py-0.5 rounded-md bg-[var(--bg-elevated)] text-mint text-[0.9em] border border-[var(--border)]"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="text-[var(--text)] font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={key}>{part}</span>
  })
}

function WikiBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\n+/)
  return (
    <div className="space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]">
      {blocks.map((block, bi) => {
        const lines = block.split('\n')
        if (lines.every((l) => l.trim().startsWith('- '))) {
          return (
            <ul key={bi} className="list-disc pl-5 space-y-1.5">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\s*-\s*/, ''), `l-${bi}-${li}`)}</li>
              ))}
            </ul>
          )
        }
        if (lines.every((l) => /^\d+\.\s/.test(l.trim()))) {
          return (
            <ol key={bi} className="list-decimal pl-5 space-y-1.5">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\s*\d+\.\s*/, ''), `o-${bi}-${li}`)}</li>
              ))}
            </ol>
          )
        }
        if (lines[0]?.startsWith('|') && lines.some((l) => l.includes('---'))) {
          const rows = lines.filter((l) => l.trim().startsWith('|') && !l.includes('---'))
          return (
            <div key={bi} className="overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full text-left text-xs md:text-sm">
                <tbody>
                  {rows.map((row, ri) => {
                    const cells = row
                      .split('|')
                      .map((c) => c.trim())
                      .filter(Boolean)
                    const Tag = ri === 0 ? 'th' : 'td'
                    return (
                      <tr
                        key={ri}
                        className={ri === 0 ? 'bg-[var(--bg-elevated)] text-[var(--text)]' : ''}
                      >
                        {cells.map((cell, ci) => (
                          <Tag
                            key={ci}
                            className="px-3 py-2 border-t border-[var(--border)] font-medium first:font-semibold"
                          >
                            {renderInline(cell, `t-${bi}-${ri}-${ci}`)}
                          </Tag>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        }
        if (lines[0]?.startsWith('### ')) {
          return (
            <div key={bi} className="space-y-2">
              <h3 className="font-display text-base font-semibold text-[var(--text)] pt-1">
                {lines[0].replace(/^###\s+/, '')}
              </h3>
              {lines.slice(1).join('\n').trim() && (
                <p>{renderInline(lines.slice(1).join(' '), `h-${bi}`)}</p>
              )}
            </div>
          )
        }
        if (lines[0]?.startsWith('## ')) {
          return (
            <h2 key={bi} className="font-display text-lg font-bold text-mint pt-2">
              {lines[0].replace(/^##\s+/, '')}
            </h2>
          )
        }
        return <p key={bi}>{renderInline(block.replace(/\n/g, ' '), `p-${bi}`)}</p>
      })}
    </div>
  )
}

export function WikiPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<WikiCategory | 'all'>('all')

  const article = slug ? getWikiArticle(slug) : undefined
  const results = useMemo(() => {
    let list = query.trim() ? searchWiki(query) : WIKI_ARTICLES
    if (cat !== 'all') list = list.filter((a) => a.category === cat)
    return list
  }, [query, cat])

  if (article) {
    const catMeta = WIKI_CATEGORIES.find((c) => c.id === article.category)
    return (
      <div className="space-y-6 max-w-3xl animate-fade-up">
        <button
          type="button"
          className="btn sm inline-flex items-center gap-2"
          onClick={() => navigate('/wiki')}
        >
          <ArrowLeft className="w-4 h-4" />
          All articles
        </button>
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-mint font-medium">
            {catMeta?.label ?? article.category}
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight">{article.title}</h1>
          <p className="text-[var(--text-muted)]">{article.summary}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {article.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-muted)]"
              >
                {t}
              </span>
            ))}
          </div>
        </header>
        <article className="card p-5 md:p-6">
          <WikiBody body={article.body} />
        </article>
        {null}
        <p className="text-xs text-[var(--text-muted)]">
          Prefer drills? Jump to{' '}
          <Link className="text-mint hover:underline" to="/learn">
            Learn
          </Link>{' '}
          or{' '}
          <Link className="text-mint hover:underline" to="/practice">
            Practice
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-mint">
            <BookMarked className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-semibold">Field manual</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Guitar wiki</h1>
          <p className="text-[var(--text-muted)] max-w-xl">
            Music theory, fretboard craft, practice habits, and how GuitarRemedy works — offline,
            searchable, built for the path.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search theory, CAGED, tabs…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-mint/40"
            aria-label="Search wiki"
          />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={clsx('btn sm', cat === 'all' && 'primary')}
          onClick={() => setCat('all')}
        >
          All
        </button>
        {WIKI_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={clsx('btn sm', cat === c.id && 'primary')}
            onClick={() => setCat(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {!query && cat === 'all' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WIKI_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              className="card p-4 text-left hover:border-mint/40 transition-colors"
            >
              <h2 className="font-display font-semibold text-[var(--text)]">{c.label}</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">{c.blurb}</p>
              <p className="text-[10px] text-mint mt-3 uppercase tracking-wider">
                {WIKI_ARTICLES.filter((a) => a.category === c.id).length} articles
              </p>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs text-[var(--text-muted)]">
          {results.length} article{results.length === 1 ? '' : 's'}
          {query ? ` matching “${query}”` : ''}
        </p>
        <ul className="grid gap-2">
          {results.map((a) => {
            const catMeta = WIKI_CATEGORIES.find((c) => c.id === a.category)
            return (
              <li key={a.id}>
                <Link
                  to={`/wiki/${a.id}`}
                  className="card p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:border-mint/35 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[var(--text)]">{a.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-mint">
                        {catMeta?.label}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5 line-clamp-2">{a.summary}</p>
                  </div>
                  <span className="text-xs text-mint shrink-0">Read →</span>
                </Link>
              </li>
            )
          })}
        </ul>
        {results.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] py-8 text-center">
            No articles matched. Try “scale”, “CAGED”, or “practice”.
          </p>
        )}
      </div>
    </div>
  )
}
