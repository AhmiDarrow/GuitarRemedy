import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookMarked, Library, Search } from 'lucide-react'
import {
  WIKI_ARTICLES,
  WIKI_CATEGORIES,
  getWikiArticle,
  searchWiki,
  type WikiArticle,
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
          className="px-1.5 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--accent)] text-[0.9em] border border-[var(--line)]"
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
    <div className="wiki-prose space-y-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
      {blocks.map((block, bi) => {
        const lines = block.split('\n')
        if (lines.every((l) => l.trim().startsWith('- '))) {
          return (
            <ul key={bi} className="list-disc pl-5 space-y-1.5 marker:text-[var(--accent)]">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\s*-\s*/, ''), `l-${bi}-${li}`)}</li>
              ))}
            </ul>
          )
        }
        if (lines.every((l) => /^\d+\.\s/.test(l.trim()))) {
          return (
            <ol key={bi} className="list-decimal pl-5 space-y-1.5 marker:text-[var(--accent)]">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\s*\d+\.\s*/, ''), `o-${bi}-${li}`)}</li>
              ))}
            </ol>
          )
        }
        if (lines[0]?.startsWith('|') && lines.some((l) => l.includes('---'))) {
          const rows = lines.filter((l) => l.trim().startsWith('|') && !l.includes('---'))
          return (
            <div
              key={bi}
              className="overflow-x-auto rounded-xl border border-[var(--line)] shadow-[inset_0_1px_0_rgba(93,255,176,0.06)]"
            >
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
                        className={
                          ri === 0
                            ? 'bg-[var(--bg-elevated)] text-[var(--text)]'
                            : ri % 2 === 0
                              ? 'bg-[var(--bg-soft)]/40'
                              : undefined
                        }
                      >
                        {cells.map((cell, ci) => (
                          <Tag
                            key={ci}
                            className="px-3 py-2.5 border-t border-[var(--line)] align-top first:font-semibold"
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
              <h3 className="font-display text-base font-semibold text-[var(--text)] pt-1 tracking-tight">
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
            <h2
              key={bi}
              className="font-display text-lg md:text-xl font-bold text-[var(--accent)] pt-3 border-t border-[var(--line)] first:border-0 first:pt-0"
            >
              {lines[0].replace(/^##\s+/, '')}
            </h2>
          )
        }
        return <p key={bi}>{renderInline(block.replace(/\n/g, ' '), `p-${bi}`)}</p>
      })}
    </div>
  )
}

function relatedArticles(article: WikiArticle, limit = 6): WikiArticle[] {
  const tagSet = new Set(article.tags.map((t) => t.toLowerCase()))
  const scored = WIKI_ARTICLES.filter((a) => a.id !== article.id)
    .map((a) => {
      let score = 0
      if (a.category === article.category) score += 3
      for (const t of a.tags) {
        if (tagSet.has(t.toLowerCase())) score += 2
      }
      const titleHit = article.tags.some((t) => a.title.toLowerCase().includes(t.toLowerCase()))
      if (titleHit) score += 1
      return { a, score }
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || x.a.title.localeCompare(y.a.title))
  return scored.slice(0, limit).map((x) => x.a)
}

function sectionHeadings(body: string): string[] {
  return body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('## '))
    .map((l) => l.replace(/^##\s+/, ''))
    .slice(0, 12)
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
    const related = relatedArticles(article)
    const heads = sectionHeadings(article.body)
    const sameCat = WIKI_ARTICLES.filter((a) => a.category === article.category)
    const idx = sameCat.findIndex((a) => a.id === article.id)
    const prev = idx > 0 ? sameCat[idx - 1] : undefined
    const next = idx >= 0 && idx < sameCat.length - 1 ? sameCat[idx + 1] : undefined

    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-fade-up pb-8">
        <button
          type="button"
          className="btn sm inline-flex items-center gap-2"
          onClick={() => navigate('/wiki')}
        >
          <ArrowLeft className="w-4 h-4" />
          Encyclopedia home
        </button>

        <header className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 md:p-7 shadow-[var(--shadow)]">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
          />
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)] font-semibold relative">
            {catMeta?.label ?? article.category}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-1 relative">
            {article.title}
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 max-w-2xl relative">{article.summary}</p>
          <div className="flex flex-wrap gap-1.5 pt-3 relative">
            {article.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-[var(--line)] text-[var(--muted)] bg-[var(--bg-elevated)]/60"
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        {heads.length > 2 && (
          <nav className="card p-4 md:p-5" aria-label="On this page">
            <p className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-semibold mb-2">
              On this page
            </p>
            <ol className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-[var(--text-secondary)] list-decimal pl-5">
              {heads.map((h) => (
                <li key={h} className="marker:text-[var(--muted)]">
                  {h}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <article className="card p-5 md:p-8">
          <WikiBody body={article.body} />
        </article>

        {related.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display text-sm font-semibold text-[var(--text)] uppercase tracking-wider">
              Keep reading
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {related.map((a) => (
                <li key={a.id}>
                  <Link
                    to={`/wiki/${a.id}`}
                    className="card p-3.5 block h-full hover:border-[var(--accent)]/40 transition-colors"
                  >
                    <span className="font-medium text-[var(--text)] text-sm">{a.title}</span>
                    <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{a.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          {prev ? (
            <Link to={`/wiki/${prev.id}`} className="btn sm text-left">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/wiki/${next.id}`} className="btn sm text-right sm:ml-auto">
              {next.title} →
            </Link>
          ) : null}
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Free MIT teaching text — original for GuitarRemedy, not scraped textbooks. Prefer drills?{' '}
          <Link className="text-[var(--accent)] hover:underline" to="/learn">
            Learn
          </Link>
          ,{' '}
          <Link className="text-[var(--accent)] hover:underline" to="/practice">
            Practice
          </Link>
          , or{' '}
          <Link className="text-[var(--accent)] hover:underline" to="/library">
            Library
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-up pb-8">
      <header className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 md:p-8 shadow-[var(--shadow)]">
        <div
          className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--accent-2), transparent 70%)' }}
        />
        <div className="relative flex flex-col md:flex-row md:items-end gap-4 justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <BookMarked className="w-5 h-5" />
              <span className="text-xs uppercase tracking-[0.16em] font-semibold">
                Free encyclopedia
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              GuitarRemedy Wiki
            </h1>
            <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
              One-stop theory, neck craft, practice habits, and app guides — textbook depth in plain
              English. Offline, searchable, MIT-licensed original teaching text. No paywall, no
              scraped books.
            </p>
            <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
              <Library className="w-3.5 h-3.5 text-[var(--accent)]" />
              {WIKI_ARTICLES.length} articles · {WIKI_CATEGORIES.length} chapters · free forever
            </p>
          </div>
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search modes, CAGED, upload…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/35"
              aria-label="Search wiki"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={clsx('btn sm', cat === 'all' && 'primary')}
          onClick={() => setCat('all')}
        >
          All chapters
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
          {WIKI_CATEGORIES.map((c) => {
            const n = WIKI_ARTICLES.filter((a) => a.category === c.id).length
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className="card p-4 text-left hover:border-[var(--accent)]/40 transition-colors group"
              >
                <h2 className="font-display font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {c.label}
                </h2>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{c.blurb}</p>
                <p className="text-[10px] text-[var(--accent)] mt-3 uppercase tracking-wider font-semibold">
                  {n} article{n === 1 ? '' : 's'}
                </p>
              </button>
            )
          })}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs text-[var(--muted)]">
          {results.length} article{results.length === 1 ? '' : 's'}
          {query ? ` matching “${query}”` : cat !== 'all' ? ` in ${WIKI_CATEGORIES.find((c) => c.id === cat)?.label}` : ''}
        </p>
        <ul className="grid gap-2">
          {results.map((a) => {
            const catMeta = WIKI_CATEGORIES.find((c) => c.id === a.category)
            return (
              <li key={a.id}>
                <Link
                  to={`/wiki/${a.id}`}
                  className="card p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:border-[var(--accent)]/35 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[var(--text)]">{a.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--accent)]">
                        {catMeta?.label}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)] mt-0.5 line-clamp-2">{a.summary}</p>
                  </div>
                  <span className="text-xs text-[var(--accent)] shrink-0">Read →</span>
                </Link>
              </li>
            )
          })}
        </ul>
        {results.length === 0 && (
          <p className="text-sm text-[var(--muted)] py-8 text-center">
            No articles matched. Try “scale”, “CAGED”, “capo”, or “practice”.
          </p>
        )}
      </div>
    </div>
  )
}
