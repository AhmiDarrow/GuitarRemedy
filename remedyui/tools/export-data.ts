// Exports the shipped app's built-in content (the 365-day curriculum with every derived
// view the Learn page shows, the library with its free tabs, the wiki) as JSON for the
// RemedyUI app. The TypeScript in src/data stays the source of truth: edit it there, then
// run `npx vite-node remedyui/tools/export-data.ts` from the repo root.
//
// GR_SRC (optional) points at another checkout's src folder, e.g. one with newer edits.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const src = process.env.GR_SRC ? resolve(process.env.GR_SRC) : join(here, '..', '..', 'src')
const out = join(here, '..', 'core', 'data')
mkdirSync(out, { recursive: true })

const { CURRICULUM, getPhaseMeta } = await import(join(src, 'data', 'curriculum.ts'))
const { practiceGuide } = await import(join(src, 'data', 'practiceGuide.ts'))
const { teachingSteps, termsForLesson } = await import(join(src, 'data', 'teachingSteps.ts'))
const { diagramsForLesson, resolveLessonDiagram } = await import(join(src, 'data', 'lessonImagery.ts'))
const { sessionCoachFor } = await import(join(src, 'data', 'sessionCoach.ts'))
const { LIBRARY } = await import(join(src, 'data', 'library.ts'))
const { WIKI_ARTICLES, WIKI_CATEGORIES } = await import(join(src, 'data', 'wiki.ts'))

const write = (name: string, value: unknown) => {
  const text = JSON.stringify(value)
  writeFileSync(join(out, name), text)
  console.log(`${name}: ${(text.length / 1024).toFixed(0)} KiB`)
}

// Undefined optional fields are dropped by JSON.stringify, as the Rust side expects.
write('curriculum.json', {
  phases: getPhaseMeta(),
  lessons: CURRICULUM.map((lesson: any) => ({
    ...lesson,
    guide: practiceGuide(lesson),
    steps: teachingSteps(lesson),
    terms: termsForLesson(lesson).map((t: any) => ({ term: t.term, meaning: t.meaning })),
    diagrams: diagramsForLesson(lesson).map((spec: any) => {
      const { license: _l, verifiedBy: _v, ...shown } = spec
      const r = resolveLessonDiagram(spec)
      return { ...r, spec: shown }
    }),
    coach: sessionCoachFor(lesson.day) ?? null,
  })),
})
write('library.json', LIBRARY)
write('wiki.json', { categories: WIKI_CATEGORIES, articles: WIKI_ARTICLES })
