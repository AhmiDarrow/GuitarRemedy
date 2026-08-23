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
import { APP_NAME } from '../lib/brand'
import { parseWikiBody, sectionHeadingsFromBody, type WikiNode } from '../lib/wikiMarkdown'
import clsx from 'clsx'

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const key = `${keyBase}-${i}`
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={key}
          className="px-1.5 py-0.5 rounded-md bg-[var(--bg-elevated)] text-mint text-[0.9em] border border-[var(--border)] font-mono"
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

function renderNode(node: WikiNode, index: number): React.ReactNode {
  const key = `n-${index}`
  switch (node.type) {
    case 'h2':
      return (
        <h2
          key={key}
          id={node.id}
          className="font-display text-lg md:text-xl font-bold text-mint pt-4 border-t border-[var(--border)] first:border-0 first:pt-0 scroll-mt-24"
        >
          {node.text}
        </h2>
      )
    case 'h3':
      return (
        <h3
          key={key}
          id={node.id}
          className="font-display text-base font-semibold text-[var(--text)] pt-2 tracking-tight scroll-mt-24"
        >
          {node.text}
        </h3>
      )
    case 'p':
      return (
        <p key={key} className="text-[15px] leading-relaxed text-soft">
          {renderInline(node.text, key)}
        </p>
      )
    case 'ul':
      return (
        <ul key={key} className="list-disc pl-5 space-y-1.5 marker:text-mint text-[15px] leading-relaxed text-soft">
          {node.items.map((item, li) => (
            <li key={li}>{renderInline(item, `${key}-u${li}`)}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={key} className="list-decimal pl-5 space-y-1.5 marker:text-mint text-[15px] leading-relaxed text-soft">
          {node.items.map((item, li) => (
            <li key={li}>{renderInline(item, `${key}-o${li}`)}</li>
          ))}
        </ol>
      )
    case 'table':
      return (
        <div
          key={key}
          className="overflow-x-auto rounded-xl border border-[var(--border)] shadow-[inset_0_1px_0_rgba(93,255,176,0.06)]"
        >
          <table className="w-full text-left text-xs md:text-sm">
            <tbody>
              {node.rows.map((row, ri) => {
                const Tag = ri === 0 ? 'th' : 'td'
                return (
                  <tr
                    key={ri}
                    className={
                      ri === 0
                        ? 'bg-[var(--bg-elevated)] text-[var(--text)]'
                        : ri % 2 === 0
                          ? 'bg-black/20'
                          : undefined
                    }
                  >
                    {row.map((cell, ci) => (
                      <Tag
                        key={ci}
                        className="px-3 py-2.5 border-t border-[var(--border)] align-top first:font-semibold text-soft"
                      >
                        {renderInline(cell, `${key}-t${ri}-${ci}`)}
                      </Tag>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    case 'pre':
      return (
        <pre
          key={key}
          className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 md:p-4 text-xs md:text-sm font-mono text-mint leading-relaxed"
        >
          {node.text}
        </pre>
      )
    default:
      return null
  }
}

function WikiBody({ body }: { body: string }) {
  const nodes = useMemo(() => parseWikiBody(body), [body])
  return (
    <div className="wiki-prose space-y-4 text-[15px] leading-relaxed text-soft">
      {nodes.map((node, i) => renderNode(node, i))}
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

function sectionHeadings(body: string): { text: string; id: string }[] {
  return sectionHeadingsFromBody(body)
}

function chipClass(active: boolean): string {
  return clsx(
    'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
    active
      ? 'border-mint/40 bg-mint/15 text-mint'
      : 'border-[var(--border)] bg-[var(--bg-elevated)]/50 text-[var(--text-muted)] hover:border-mint/30 hover:text-soft',
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
          className="btn-ghost text-sm"
          onClick={() => navigate('/wiki')}
        >
          <ArrowLeft className="w-4 h-4" />
          Encyclopedia home
        </button>

        <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#06120c] via-[#030705] to-[#020403]">
          <img
            src="/assets/brand-mark.png"
            alt=""
            className="absolute right-0 top-0 h-full w-32 object-cover opacity-30 md:w-44"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030705] via-[#030705]/90 to-transparent" />
          <div className="absolute -left-8 -bottom-10 w-40 h-40 rounded-full bg-mint/10 blur-3xl" />
          <div className="relative p-5 md:p-7 space-y-2">
            <p className="text-xs uppercase tracking-widest text-mint/80 font-semibold">
              {catMeta?.label ?? article.category}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              {article.title}
            </h1>
            <p className="text-sm md:text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
              {article.summary}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {article.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-mint/20 bg-mint/5 text-soft"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </header>

        {heads.length > 2 && (
          <nav className="card p-4 md:p-5" aria-label="On this page">
            <p className="section-title mb-2">On this page</p>
            <ol className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-soft list-decimal pl-5">
              {heads.map((h) => (
                <li key={h.id} className="marker:text-mint/70">
                  <a href={`#${h.id}`} className="hover:text-mint transition-colors">
                    {h.text}
                  </a>
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
            <h2 className="section-title">Keep reading</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {related.map((a) => (
                <li key={a.id}>
                  <Link
                    to={`/wiki/${a.id}`}
                    className="card p-3.5 block h-full hover:border-mint/40 transition-colors"
                  >
                    <span className="font-medium text-[var(--text)] text-sm">{a.title}</span>
                    <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{a.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          {prev ? (
            <Link to={`/wiki/${prev.id}`} className="btn-secondary text-sm text-left">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/wiki/${next.id}`} className="btn-secondary text-sm text-right sm:ml-auto">
              {next.title} →
            </Link>
          ) : null}
        </div>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Free MIT teaching text — original for {APP_NAME}, not scraped textbooks. Prefer drills?{' '}
          <Link className="text-mint hover:underline" to="/learn">
            Learn
          </Link>
          ,{' '}
          <Link className="text-mint hover:underline" to="/practice">
            Practice
          </Link>
          , or{' '}
          <Link className="text-mint hover:underline" to="/library">
            Library
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-up pb-8">
      <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#06120c] via-[#030705] to-[#020403]">
        <img
          src="/assets/hero-dark-forest.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030705] via-[#030705]/90 to-[#030705]/45" />
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-mint/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 w-40 h-32 rounded-full bg-lime/5 blur-3xl" />
        <div className="relative p-5 md:p-8 flex flex-col md:flex-row md:items-end gap-5 justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-mint">
              <BookMarked className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">
                Free encyclopedia
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              {APP_NAME} Wiki
            </h1>
            <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed">
              One-stop theory, neck craft, practice habits, and app guides — textbook depth in plain
              English. Offline, searchable, MIT-licensed original teaching text. No paywall, no
              scraped books.
            </p>
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 pt-1">
              <Library className="w-3.5 h-3.5 text-mint" />
              {WIKI_ARTICLES.length} articles · {WIKI_CATEGORIES.length} chapters · free forever
            </p>
          </div>
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search modes, CAGED, upload…"
              className="input w-full pl-9 pr-3 py-2.5"
              aria-label="Search wiki"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={chipClass(cat === 'all')} onClick={() => setCat('all')}>
          All chapters
        </button>
        {WIKI_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={chipClass(cat === c.id)}
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
                className="card p-4 text-left hover:border-mint/40 transition-colors group"
              >
                <h2 className="font-display font-semibold text-[var(--text)] group-hover:text-mint transition-colors">
                  {c.label}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{c.blurb}</p>
                <p className="text-[10px] text-mint mt-3 uppercase tracking-wider font-semibold">
                  {n} article{n === 1 ? '' : 's'}
                </p>
              </button>
            )
          })}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs text-[var(--text-muted)]">
          {results.length} article{results.length === 1 ? '' : 's'}
          {query
            ? ` matching “${query}”`
            : cat !== 'all'
              ? ` in ${WIKI_CATEGORIES.find((c) => c.id === cat)?.label}`
              : ''}
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
                  <span className="text-xs text-mint shrink-0 font-medium">Read →</span>
                </Link>
              </li>
            )
          })}
        </ul>
        {results.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] py-8 text-center">
            No articles matched. Try “scale”, “CAGED”, “capo”, or “practice”.
          </p>
        )}
      </div>
    </div>
  )
}
