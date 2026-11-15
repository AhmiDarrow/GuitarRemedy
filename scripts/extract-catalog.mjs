/**
 * Build English i18n catalogs from source data and tx() literals.
 * English values are the source of truth. Does not call a translation API.
 *
 *   node scripts/extract-catalog.mjs
 *   node scripts/extract-catalog.mjs --content-only
 *   node scripts/extract-catalog.mjs --messages-only
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { createServer } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(root, 'src', 'i18n', 'source')
const messagesDir = join(root, 'src', 'i18n', 'messages')
const args = new Set(process.argv.slice(2))
const contentOnly = args.has('--content-only')
const messagesOnly = args.has('--messages-only')

function sortObject(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b, 'en')))
}

function writeJson(path, obj) {
  mkdirSync(dirname(path), { recursive: true })
  const sorted = sortObject(obj)
  writeFileSync(path, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8')
  const keys = Object.keys(sorted)
  const empty = keys.filter((key) => sorted[key] === '')
  if (empty.length) {
    throw new Error(`${relative(root, path)} has empty values: ${empty.slice(0, 5).join(', ')}`)
  }
  return { file: relative(root, path), keys: keys.length, bytes: Buffer.byteLength(JSON.stringify(sorted)) }
}

function termSlug(term) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function put(bag, key, value) {
  if (typeof value !== 'string' || value.length === 0) return
  if (bag[key] !== undefined && bag[key] !== value) {
    throw new Error(`Key conflict ${key}`)
  }
  bag[key] = value
}

function isTemplateDiagramTitle(title) {
  return /^Power chord (.+)$/.test(title)
}

function isTemplateDiagramCaption(caption, spec) {
  if (!caption) return true
  if (/^.+ open shape · standard tuning\.$/.test(caption)) return true
  if (spec?.scaleId && /^[A-G][#b]? .+ — roots marked R\.$/.test(caption)) return true
  return false
}

function walkTs(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === 'source') continue
    const path = join(dir, name)
    const stat = statSync(path)
    if (stat.isDirectory()) {
      if (name === 'messages' || name === 'content') continue
      walkTs(path, out)
    } else if (/\.(ts|tsx)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name)) {
      out.push(path)
    }
  }
  return out
}

function literalText(node) {
  if (!node) return null
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
    return literalText(node.expression)
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = literalText(node.left)
    const right = literalText(node.right)
    if (left == null || right == null) return null
    return left + right
  }
  return null
}

function calleeName(expr) {
  if (ts.isIdentifier(expr)) return expr.text
  if (ts.isPropertyAccessExpression(expr)) return expr.name.text
  return null
}

function collectTxLiterals() {
  const ui = new Map()
  const missed = []
  for (const file of walkTs(join(root, 'src'))) {
    const text = readFileSync(file, 'utf8')
    const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind)
    const visit = (node) => {
      if (ts.isCallExpression(node)) {
        const name = calleeName(node.expression)
        if (name === 'tx') {
          const value = literalText(node.arguments[0])
          if (value == null) {
            const start = source.getLineAndCharacterOfPosition(node.getStart(source))
            missed.push(`${relative(root, file)}:${start.line + 1}`)
          } else if (value.length > 0) {
            ui.set(value, value)
          }
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
  }
  return { ui, missed }
}

async function loadData() {
  const server = await createServer({
    root,
    configFile: join(root, 'vite.config.ts'),
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  })
  try {
    const [curriculum, wiki, library, theory, steps, guide, imagery] = await Promise.all([
      server.ssrLoadModule('/src/data/curriculum.ts'),
      server.ssrLoadModule('/src/data/wiki.ts'),
      server.ssrLoadModule('/src/data/library.ts'),
      server.ssrLoadModule('/src/lib/theory.ts'),
      server.ssrLoadModule('/src/data/teachingSteps.ts'),
      server.ssrLoadModule('/src/data/practiceGuide.ts'),
      server.ssrLoadModule('/src/data/lessonImagery.ts'),
    ])
    return { curriculum, wiki, library, theory, steps, guide, imagery }
  } finally {
    await server.close()
  }
}

function buildContent(data) {
  const lessons = {}
  const coach = {}
  const wikiBag = {}
  const libraryBag = {}
  const diagramUi = []

  for (const lesson of data.curriculum.CURRICULUM) {
    const day = lesson.day
    put(lessons, `lesson.${day}.title`, lesson.title)
    put(lessons, `lesson.${day}.theory`, lesson.theoryBite)
    put(lessons, `lesson.${day}.mastery`, lesson.masteryCheck)
    lesson.goals.forEach((goal, index) => put(lessons, `lesson.${day}.goal.${index}`, goal))
    lesson.drills.forEach((drill, index) => put(lessons, `lesson.${day}.drill.${index}`, drill))

    if (day <= 14) {
      const early = data.steps.teachingSteps(lesson)
      early.forEach((step, index) => {
        put(coach, `step.${day}.${index}.title`, step.title)
        put(coach, `step.${day}.${index}.instruction`, step.instruction)
      })
      const practice = data.guide.practiceGuide(lesson)
      if (day <= 7) put(coach, `guide.${day}.example`, practice.example)
      put(coach, `guide.${day}.listen`, practice.listen)
      put(coach, `guide.${day}.rescue`, practice.rescue)
    }

    for (const spec of data.imagery.diagramsForLesson(lesson)) {
      if (spec.title && !isTemplateDiagramTitle(spec.title)) diagramUi.push(spec.title)
      if (spec.caption && !isTemplateDiagramCaption(spec.caption, spec)) diagramUi.push(spec.caption)
    }
  }

  for (const phase of ['basics', 'chords', 'scales', 'rhythm', 'lead', 'repertoire']) {
    const sample = data.curriculum.CURRICULUM.find((lesson) => lesson.phase === phase && lesson.day > 14)
    if (!sample) continue
    const practice = data.guide.practiceGuide(sample)
    put(coach, `guide.phase.${phase}.listen`, practice.listen)
    put(coach, `guide.phase.${phase}.rescue`, practice.rescue)
  }

  for (const term of data.steps.LESSON_TERMS) {
    const slug = termSlug(term.term)
    put(coach, `term.${slug}.term`, term.term)
    put(coach, `term.${slug}.meaning`, term.meaning)
  }

  for (const article of data.wiki.WIKI_ARTICLES) {
    put(wikiBag, `wiki.${article.id}.title`, article.title)
    put(wikiBag, `wiki.${article.id}.summary`, article.summary)
    put(wikiBag, `wiki.${article.id}.body`, article.body)
  }
  for (const category of data.wiki.WIKI_CATEGORIES) {
    put(wikiBag, `wiki.cat.${category.id}.label`, category.label)
    put(wikiBag, `wiki.cat.${category.id}.blurb`, category.blurb)
  }

  for (const item of data.library.LIBRARY) {
    put(libraryBag, `lib.${item.id}.title`, item.title)
    put(libraryBag, `lib.${item.id}.description`, item.description)
    if (item.tab?.title && item.tab.title !== item.title) {
      put(libraryBag, `lib.${item.id}.tab`, item.tab.title)
    }
  }
  for (const scale of data.theory.SCALE_LIST) {
    put(libraryBag, `scale.${scale.id}.name`, scale.name)
  }
  for (const chord of Object.values(data.theory.CHORDS)) {
    put(libraryBag, `chord.${chord.id}.name`, chord.name)
  }
  for (const [id, tuning] of Object.entries(data.theory.TUNINGS)) {
    put(libraryBag, `tuning.${id}.name`, tuning.name)
  }
  for (let semitone = 0; semitone < 12; semitone += 1) {
    diagramUi.push(data.theory.intervalName(semitone))
  }

  return { lessons, coach, wikiBag, libraryBag, diagramUi }
}

function splitLessons(lessons) {
  const parts = { 1: {}, 2: {}, 3: {}, 4: {} }
  for (const [key, value] of Object.entries(lessons)) {
    const day = Number(/^lesson\.(\d+)\./.exec(key)?.[1] ?? 0)
    const bucket = day <= 90 ? 1 : day <= 180 ? 2 : day <= 270 ? 3 : 4
    parts[bucket][key] = value
  }
  return parts
}

const reports = []

if (!messagesOnly) {
  const data = await loadData()
  const built = buildContent(data)
  const parts = splitLessons(built.lessons)
  reports.push(writeJson(join(sourceDir, 'lessons-1.json'), parts[1]))
  reports.push(writeJson(join(sourceDir, 'lessons-2.json'), parts[2]))
  reports.push(writeJson(join(sourceDir, 'lessons-3.json'), parts[3]))
  reports.push(writeJson(join(sourceDir, 'lessons-4.json'), parts[4]))
  reports.push(writeJson(join(sourceDir, 'wiki.json'), built.wikiBag))
  reports.push(writeJson(join(sourceDir, 'library.json'), built.libraryBag))
  reports.push(writeJson(join(sourceDir, 'coach.json'), built.coach))
  const diagramPath = join(sourceDir, 'diagram-ui.json')
  reports.push(writeJson(diagramPath, Object.fromEntries(built.diagramUi.map((text) => [text, text]))))
}

if (!contentOnly) {
  const { ui, missed } = collectTxLiterals()
  const diagramPath = join(sourceDir, 'diagram-ui.json')
  let diagram = {}
  try {
    diagram = JSON.parse(readFileSync(diagramPath, 'utf8'))
  } catch {
    diagram = {}
  }
  const previous = JSON.parse(readFileSync(join(messagesDir, 'en.json'), 'utf8'))
  const messages = {}
  for (const [key, value] of Object.entries(previous)) {
    if (/\.(one|two|few|many|other)$/.test(key)) messages[key] = value
  }
  for (const [key, value] of ui) messages[key] = value
  for (const [key, value] of Object.entries(diagram)) messages[key] = value
  reports.push(writeJson(join(messagesDir, 'en.json'), messages))
  if (missed.length) {
    console.log(`tx() calls without a literal (${missed.length}):`)
    for (const line of missed) console.log(`  ${line}`)
  }
}

let totalKeys = 0
for (const report of reports) {
  totalKeys += report.keys
  console.log(`${report.file}\t${report.keys}\t${report.bytes}`)
}
console.log(`total\t${totalKeys}`)
