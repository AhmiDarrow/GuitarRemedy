import type { Lesson, LessonPhase } from '../data/curriculum'
import type { LessonDiagramSpec } from '../data/lessonImagery'
import type { LibraryItem, LibraryKind, SkillLevel } from '../data/library'
import { practiceGuide } from '../data/practiceGuide'
import { teachingSteps, termsForLesson, type TeachingStep } from '../data/teachingSteps'
import type { WikiArticle, WikiCategory } from '../data/wiki'
import { getLocale, tx, txKey } from './runtime'

/**
 * Display overlay. Locale `en` returns the source objects so tests stay exact.
 * Other locales compose visible lesson text from translated seeds plus shared templates.
 * Session-coach prose is not translated; those days use the templates below.
 */

function pick<T>(arr: T[], day: number): T {
  return arr[(day + arr.length) % arr.length]
}

export function termSlug(term: string): string {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function phaseLabel(phase: LessonPhase): string {
  switch (phase) {
    case 'basics':
      return tx('Basics')
    case 'chords':
      return tx('Chords')
    case 'scales':
      return tx('Scales')
    case 'rhythm':
      return tx('Rhythm')
    case 'lead':
      return tx('Lead')
    case 'repertoire':
      return tx('Repertoire')
    default:
      return tx(phase)
  }
}

export function kindLabel(kind: LibraryKind | string): string {
  switch (kind) {
    case 'scale':
      return tx('Scale')
    case 'chord':
      return tx('Chord')
    case 'riff':
      return tx('Riff')
    case 'song':
      return tx('Song')
    case 'progression':
      return tx('Progression')
    default:
      return tx(String(kind))
  }
}

export function skillLabel(skill: SkillLevel | string): string {
  switch (skill) {
    case 'beginner':
      return tx('Beginner')
    case 'intermediate':
      return tx('Intermediate')
    case 'advanced':
      return tx('Advanced')
    default:
      return tx(String(skill))
  }
}

export function presentScaleName(id: string, name: string): string {
  return txKey(`scale.${id}.name`, name)
}

export function presentChordName(id: string, name: string): string {
  return txKey(`chord.${id}.name`, name)
}

export function presentTuningName(id: string, name: string): string {
  return txKey(`tuning.${id}.name`, name)
}

export interface PresentedSeed {
  title: string
  goals: string[]
  drills: string[]
  theory: string
  mastery: string
}

export function presentSeed(lesson: Lesson): PresentedSeed {
  const day = lesson.day
  return {
    title: txKey(`lesson.${day}.title`, lesson.title),
    goals: lesson.goals.map((goal, index) => txKey(`lesson.${day}.goal.${index}`, goal)),
    drills: lesson.drills.map((drill, index) => txKey(`lesson.${day}.drill.${index}`, drill)),
    theory: txKey(`lesson.${day}.theory`, lesson.theoryBite),
    mastery: txKey(`lesson.${day}.mastery`, lesson.masteryCheck),
  }
}

function topicFromTitle(title: string): string {
  return title.includes('—') ? title.split('—').slice(1).join('—').trim() : title
}

function previewLine(drills: string[]): string {
  return drills[0]
    ? tx('Light preview: {drill}', { drill: drills[0] })
    : tx('60 seconds of whatever felt hard yesterday — half speed.')
}

function warmupBlock(phase: LessonPhase, day: number, drills: string[]): { coach: string; youDo: string[] } {
  const base = [
    tx('Open strings low→high, then high→low — name them if you can.'),
    tx('Shake out fretting hand 10 seconds. Thumb behind the neck, not strangling it.'),
  ]
  const preview = previewLine(drills)
  switch (phase) {
    case 'basics':
      return {
        coach: tx('We start gentle. Buzz and muted notes are information, not failure.'),
        youDo: [
          ...base,
          day === 1
            ? tx('Keep the fretting hand off the strings. Let each open note ring.')
            : tx('Finger taps on frets 1–4 of the high E, no rush.'),
          preview,
        ],
      }
    case 'chords':
      return {
        coach: tx('Warm the shapes you’ll need. Clean first — tempo later.'),
        youDo: [
          ...base,
          tx('Form yesterday’s easiest chord, strum once per beat for 30s.'),
          tx('Air-change to today’s first shape without fretting — muscle map first.'),
          tx('Soft downstrokes only, tempo you can hum.'),
        ],
      }
    case 'scales':
      return {
        coach: tx('Wake the fretting hand with spider motion, then touch today’s root.'),
        youDo: [
          tx('1-2-3-4 chromatic on one string, then reverse — slow.'),
          tx('Find today’s root note and pulse it on quarter notes for 20s.'),
          preview,
        ],
      }
    case 'rhythm':
      return {
        coach: tx('Body first. If your foot isn’t steady, the right hand won’t be either.'),
        youDo: [
          tx('Tap quarter notes with your foot for 30s (no guitar).'),
          tx('Muted strums on open strings: down only, then down-up.'),
          tx('Count 1 & 2 & 3 & 4 & out loud while you strum ghosts.'),
        ],
      }
    case 'lead':
      return {
        coach: tx('Loose hands, singing brain. Warm vibrato and bends gently.'),
        youDo: [
          tx('Long tones on one fretted note — try a tiny vibrato.'),
          tx('Half-step bend on G string (careful) — match pitch if you can.'),
          preview,
        ],
      }
    default:
      return {
        coach: tx('Song day warm-up: touch the key sections lightly, no hero takes yet.'),
        youDo: [
          ...base,
          tx('Hum or sing the melody once before fretting it.'),
          tx('Play only the intro or first phrase — soft dynamics.'),
          preview,
        ],
      }
  }
}

function teachYouDo(phase: LessonPhase, day: number, goals: string[]): string[] {
  const focus =
    phase === 'chords'
      ? tx('Build the shape finger-by-finger; pluck strings one at a time before strumming.')
      : phase === 'scales'
        ? tx('Trace the shape on the neck with your eyes before you play it.')
        : phase === 'rhythm'
          ? tx('Count a bar out loud, then add the guitar on the same grid.')
          : phase === 'lead'
            ? tx('Sing or hum a 3–4 note version before you fret it.')
            : phase === 'repertoire'
              ? tx('Name the section you’re serving (intro, verse, chorus) before you play.')
              : tx('Watch your hands 20 seconds — fix one tense spot, not ten.')
  const win = goals[0]
    ? tx('Hold this win in mind: {goal}', { goal: goals[0] })
    : pick(
        [
          tx('Metronome quieter than you are.'),
          tx('Sharp pain = stop. Tired is fine; injury is not.'),
          tx('When one note rings clean, notice it. That’s the win.'),
        ],
        day,
      )
  return [tx('Read the idea once, then put your hands on the guitar.'), focus, win]
}

function jamIdeas(phase: LessonPhase): string[] {
  switch (phase) {
    case 'basics':
      return [
        tx('Tiny song: 4 open-string hits, 4 fretted notes, repeat.'),
        tx('Play, rest a bar, answer yourself.'),
      ]
    case 'chords':
      return [
        tx('Campfire loop: 4 beats per chord. Miss a change? Keep the strum arm moving.'),
        tx('Same shapes, two volumes — soft then bigger.'),
      ]
    case 'scales':
      return [
        tx('Only 3 notes for a whole minute. Make rhythm do the work.'),
        tx('Question up high, answer down low — leave rests.'),
      ]
    case 'rhythm':
      return [
        tx('4 bars pattern A, 4 bars B, back to A.'),
        tx('Drop out on bar 4 on purpose — silence counts.'),
      ]
    case 'lead':
      return [
        tx('Same 4 notes, new rhythm each bar for 8 bars.'),
        tx('End every phrase on the root or the 3rd.'),
      ]
    default:
      return [
        tx('Full section — no stopping. Flub? Recover like a show.'),
        tx('One phone take. Listen once kind, once with a note.'),
      ]
  }
}

function arriveCoach(day: number): string {
  return pick(
    [
      tx('Sit tall, shoulders soft. Guitar on the leg that feels natural. Take one slow breath before you touch a string.'),
      tx('Check tuning quickly if you can — in-tune practice trains your ear without trying.'),
      tx('Phone face-down (except for the metronome). This half-hour is just you and the neck.'),
    ],
    day,
  )
}

function mistakeList(phase: LessonPhase, day: number): string[] {
  if (day === 1) {
    return [
      tx('Hunching over — bring the guitar up, don’t dive down.'),
      tx('Right hand floating; rest near the bridge lightly if it helps.'),
      tx('Skipping string names because it feels childish — it’s not.'),
    ]
  }
  const lists: Record<LessonPhase, string[]> = {
    basics: [
      tx('Death-grip fretting — use just enough pressure to sound the note.'),
      tx('Looking only at fretting hand; glance at strum arm too.'),
      tx('Skipping open-string naming — it pays rent later.'),
    ],
    chords: [
      tx('Rushing the change and landing a mutiny of muted strings.'),
      tx('Collapsed wrist / thumb over the top choking the neck.'),
      tx('Strumming strings that shouldn’t ring (especially low E on C/D shapes).'),
    ],
    scales: [
      tx('Running the box with no rhythm — always put a pulse under it.'),
      tx('Ignoring chord tones when “improvising.”'),
      tx('Tense pinky — let it hover relaxed when idle.'),
    ],
    rhythm: [
      tx('Speeding up on the easy bars and dragging on the hard ones.'),
      tx('Upstrokes weaker than downstrokes with no intention.'),
      tx('Holding breath — breathe on bar lines.'),
    ],
    lead: [
      tx('Too many notes because silence feels scary — silence is confident.'),
      tx('Bending without a target pitch.'),
      tx('No dynamics — try half the volume on the answer phrase.'),
    ],
    repertoire: [
      tx('Restarting from the top after every mistake (practice mid-song recoveries).'),
      tx('Only practicing the fun section; transitions need reps too.'),
      tx('Chasing a perfect take instead of a honest keepable one.'),
    ],
  }
  const list = lists[phase]
  return [pick(list, day), pick(list, day + 1), pick(list, day + 2)]
}

function minutesFor(lesson: Lesson, id: string): number {
  return lesson.privateLesson.segments.find((segment) => segment.id === id)?.minutes ?? 0
}

/** English returns the same lesson. Other locales rebuild the fields Learn actually shows. */
export function presentLesson(lesson: Lesson): Lesson {
  if (getLocale() === 'en') return lesson
  const seed = presentSeed(lesson)
  const day = lesson.day
  const warm = warmupBlock(lesson.phase, day, seed.drills)
  const guidedDrills =
    seed.drills.length >= 3
      ? seed.drills
      : [...seed.drills, tx('Repeat the cleanest take twice'), tx('Half-speed pass with a metronome')]
  const topic = topicFromTitle(seed.title)
  const segments = [
    {
      id: 'arrive' as const,
      name: 'Arrive & set intention',
      minutes: minutesFor(lesson, 'arrive'),
      coach: arriveCoach(day),
      youDo: [
        seed.goals[0] ?? tx('One clean win today.'),
        seed.goals[1] ?? tx('Stay relaxed.'),
        tx('Metronome or foot tap ready. Water nearby.'),
      ],
    },
    {
      id: 'warmup' as const,
      name: 'Warm-up',
      minutes: minutesFor(lesson, 'warmup'),
      coach: warm.coach,
      youDo: warm.youDo,
      tip: tx('If something hurts sharply, stop. Dull fatigue = shake out and slow down.'),
    },
    {
      id: 'teach' as const,
      name: 'Teach — the idea',
      minutes: minutesFor(lesson, 'teach'),
      coach: tx('{theory} Try the idea slowly, then explain what you heard in your own words.', { theory: seed.theory }),
      youDo: teachYouDo(lesson.phase, day, seed.goals),
      tip: tx('One focus beats five half-focuses.'),
    },
    {
      id: 'guided' as const,
      name: 'Guided practice',
      minutes: minutesFor(lesson, 'guided'),
      coach: tx(
        'Practice: {title}. Work through one exercise at a time. Begin with: {drill} Repeat slowly and change only one thing when a note is unclear.',
        { title: seed.title, drill: seed.drills[0] ?? '' },
      ),
      youDo: guidedDrills,
      tip: tx('8/10 clean reps → nudge tempo a little. If form slips, stay put.'),
    },
    {
      id: 'jam' as const,
      name: 'Jam / song time',
      minutes: minutesFor(lesson, 'jam'),
      coach: tx('Jam time for "{topic}". Play something that sounds like music — not another drill checklist.', { topic }),
      youDo: [
        day === 1
          ? tx('Pluck low E on count 1, A on count 3, then D on the next count 1. Let the open strings ring and repeat.')
          : pick(jamIdeas(lesson.phase), day),
        seed.goals[1] ? tx('Keep this nearby: {goal}', { goal: seed.goals[1] }) : tx('Keep your foot tapping the whole time.'),
        tx('Last 60s: simplest clean version. Victory lap.'),
      ],
      tip: tx('If you freeze, one note in time until your brain comes back.'),
    },
    {
      id: 'cooldown' as const,
      name: 'Cool-down & win check',
      minutes: minutesFor(lesson, 'cooldown'),
      coach: tx('Cool-down. Soft hands, short check, done.'),
      youDo: [
        tx('Soft open strings or one gentle chord for 30–45s.'),
        tx('Quick check — could you do this yet? {mastery}', { mastery: seed.mastery }),
        tx('Stretch fretting hand, shake the picking arm. One note to yourself: what felt good.'),
      ],
    },
  ]
  return {
    ...lesson,
    title: seed.title,
    goals: seed.goals,
    drills: seed.drills,
    theoryBite: seed.theory,
    masteryCheck: seed.mastery,
    privateLesson: {
      ...lesson.privateLesson,
      segments,
      commonMistakes: mistakeList(lesson.phase, day),
      winCondition: seed.mastery,
    },
  }
}

export function presentSteps(lesson: Lesson): TeachingStep[] {
  const steps = teachingSteps(lesson)
  if (getLocale() === 'en') return steps
  if (lesson.day <= 14) {
    return steps.map((step, index) => ({
      title: txKey(`step.${lesson.day}.${index}.title`, step.title),
      instruction: txKey(`step.${lesson.day}.${index}.instruction`, step.instruction),
    }))
  }
  return steps.map((step, index) => ({
    title: tx('Practice {n}', { n: index + 1 }),
    instruction: txKey(`lesson.${lesson.day}.drill.${index}`, step.instruction),
  }))
}

export function presentGuide(lesson: Lesson): { example: string; listen: string; rescue: string } {
  const guide = practiceGuide(lesson)
  if (getLocale() === 'en') return guide
  const day = lesson.day
  if (day <= 14) {
    const example =
      day <= 7
        ? txKey(`guide.${day}.example`, guide.example)
        : presentSteps(lesson).map((step) => step.instruction).join(' ')
    return {
      example,
      listen: txKey(`guide.${day}.listen`, guide.listen),
      rescue: txKey(`guide.${day}.rescue`, guide.rescue),
    }
  }
  const drill = presentSeed(lesson).drills[0] ?? ''
  return {
    example: tx(
      '{drill} First try it once slowly. Identify the smallest part that breaks down, practice that part three times, then put it back into the whole exercise.',
      { drill },
    ),
    listen: txKey(`guide.phase.${lesson.phase}.listen`, guide.listen),
    rescue: txKey(`guide.phase.${lesson.phase}.rescue`, guide.rescue),
  }
}

export function presentTerms(lesson: Lesson) {
  const terms = termsForLesson(lesson)
  if (getLocale() === 'en') return terms
  return terms.map((term) => ({
    ...term,
    term: txKey(`term.${termSlug(term.term)}.term`, term.term),
    meaning: txKey(`term.${termSlug(term.term)}.meaning`, term.meaning),
  }))
}

export function presentArticle(article: WikiArticle): WikiArticle {
  if (getLocale() === 'en') return article
  return {
    ...article,
    title: txKey(`wiki.${article.id}.title`, article.title),
    summary: txKey(`wiki.${article.id}.summary`, article.summary),
    body: txKey(`wiki.${article.id}.body`, article.body),
  }
}

export function presentCategory(id: WikiCategory, label: string, blurb: string): { label: string; blurb: string } {
  if (getLocale() === 'en') return { label, blurb }
  return {
    label: txKey(`wiki.cat.${id}.label`, label),
    blurb: txKey(`wiki.cat.${id}.blurb`, blurb),
  }
}

export function presentLibraryItem(item: LibraryItem): LibraryItem {
  if (getLocale() === 'en') return item
  const title = txKey(`lib.${item.id}.title`, item.title)
  const description = txKey(`lib.${item.id}.description`, item.description)
  const tab = item.tab
    ? {
        ...item.tab,
        title: item.tab.title === item.title ? title : txKey(`lib.${item.id}.tab`, item.tab.title),
      }
    : item.tab
  return { ...item, title, description, tab }
}

/** Titles and captions only. Diagram notes and fret marks stay in notation. */
export function presentDiagram(spec: LessonDiagramSpec): LessonDiagramSpec {
  if (getLocale() === 'en') return spec
  let title = spec.title
  let caption = spec.caption
  const power = /^Power chord (.+)$/.exec(spec.title)
  if (power) title = tx('Power chord {name}', { name: power[1] })
  else title = tx(spec.title)
  if (caption) {
    const open = /^(.+) open shape · standard tuning\.$/.exec(caption)
    const scaleCap = /^([A-G][#b]?) (.+) — roots marked R\.$/.exec(caption)
    if (open) caption = tx('{chord} open shape · standard tuning.', { chord: open[1] })
    else if (scaleCap && spec.scaleId) {
      caption = tx('{root} {scale} — roots marked R.', {
        root: scaleCap[1],
        scale: txKey(`scale.${spec.scaleId}.name`, scaleCap[2]),
      })
    } else caption = tx(caption)
  }
  if (title === spec.title && caption === spec.caption) return spec
  return { ...spec, title, caption }
}
