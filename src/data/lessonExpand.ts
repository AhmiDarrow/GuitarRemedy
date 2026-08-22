/**
 * Turns bare lesson seeds into a ~30 minute private-lesson session.
 * Research-backed: one focus, early music, short wins, mistakes OK,
 * warm-up → teach → guided → jam → cool-down, slow-is-pro.
 */
import type { LessonPhase } from './curriculum'
import type { SkillLevel } from './library'

export interface LessonSegment {
  id: 'arrive' | 'warmup' | 'teach' | 'guided' | 'jam' | 'cooldown'
  name: string
  minutes: number
  /** Teacher voice — what they'd say sitting next to you */
  coach: string
  /** Concrete things you do */
  youDo: string[]
  tip?: string
}

export interface PrivateLessonFields {
  durationMin: number
  hook: string
  teacherIntro: string
  segments: LessonSegment[]
  commonMistakes: string[]
  encouragement: string
  /** Friendly restatement of mastery (game-like win) */
  winCondition: string
  /** Easy mode if hands are tired / day is hard */
  easyMode: string
  funBonus?: string
}

export type LessonSeed = {
  title: string
  durationMin: number
  goals: string[]
  theoryBite: string
  drills: string[]
  libraryIds: string[]
  masteryCheck: string
}

const PHASE_HOOKS: Record<LessonPhase, string[]> = {
  basics: [
    'Today we make the guitar feel like a friend, not a puzzle.',
    'Tiny clean sounds beat big messy ones — every time.',
    'You’re building the habits pros still use on stage.',
  ],
  chords: [
    'Chords are shapes that unlock whole songs — we add one clean win today.',
    'Slow changes that ring > fast changes that thud.',
    'Campfire energy: few chords, real music.',
  ],
  scales: [
    'Scales aren’t homework — they’re the map for riffs you already love.',
    'Today: fewer notes, better stories.',
    'Box shapes become music when we leave space.',
  ],
  rhythm: [
    'Groove is a superpower. Speed is optional; pocket is not.',
    'If it feels good at 70 BPM, you’re winning.',
    'Silence and accents make people nod their heads.',
  ],
  lead: [
    'Lead guitar is conversation — say something, then listen.',
    'One memorable phrase beats a hundred rushed notes.',
    'Bends, space, and target notes: that’s the fun stuff.',
  ],
  repertoire: [
    'Songs are why we practice. Today we serve the tune.',
    'Polish one section until it feels like “yours.”',
    'Performance skills: recover, breathe, finish strong.',
  ],
}

const ARRIVE_LINES = [
  'Sit tall, shoulders soft. Guitar on the leg that feels natural. Take one slow breath before you touch a string.',
  'Check tuning quickly if you can — in-tune practice trains your ear without trying.',
  'Phone face-down (except for the metronome). This half-hour is just you and the neck.',
]

function pick<T>(arr: T[], day: number, salt = 0): T {
  return arr[(day + salt) % arr.length]
}

function minutesForPhase(phase: LessonPhase, day: number): number {
  if (day === 365) return 45
  if (day % 7 === 0) return 35 // weekly jam / checkpoint slightly longer
  if (phase === 'basics' && day <= 7) return 25
  return 30
}

function segmentPlan(total: number): Record<LessonSegment['id'], number> {
  // ~ private lesson timing
  const arrive = 2
  const warmup = Math.max(4, Math.round(total * 0.15))
  const teach = Math.max(5, Math.round(total * 0.18))
  const guided = Math.max(8, Math.round(total * 0.3))
  const cooldown = 3
  const jam = Math.max(5, total - arrive - warmup - teach - guided - cooldown)
  return { arrive, warmup, teach, guided, jam, cooldown }
}

function warmupFor(phase: LessonPhase, day: number, seed: LessonSeed): { coach: string; youDo: string[] } {
  const base = [
    'Open strings low→high, then high→low — name them if you can.',
    'Shake out fretting hand 10 seconds. Thumb behind the neck, not strangling it.',
  ]
  switch (phase) {
    case 'basics':
      return {
        coach: 'We start gentle. Buzz and muted notes are information, not failure.',
        youDo: [
          ...base,
          'Finger taps on frets 1–4 of the high E, no rush.',
          seed.drills[0] ? `Light preview: ${seed.drills[0]}` : '60 seconds of whatever felt hard yesterday — half speed.',
        ],
      }
    case 'chords':
      return {
        coach: 'Warm the shapes you’ll need. Clean > fast.',
        youDo: [
          ...base,
          'Form yesterday’s easiest chord, strum once per beat for 30s.',
          'Air-change to today’s first shape without fretting — muscle map first.',
          'Soft downstrokes only, tempo you can hum.',
        ],
      }
    case 'scales':
      return {
        coach: 'Wake the fretting hand with spider motion, then touch today’s root.',
        youDo: [
          '1-2-3-4 chromatic on one string, then reverse — slow.',
          'Find today’s root note and pulse it on quarter notes for 20s.',
          'Ascend 4 notes of the focus shape, descend — breathe between.',
        ],
      }
    case 'rhythm':
      return {
        coach: 'Body first. If your foot isn’t steady, the right hand won’t be either.',
        youDo: [
          'Tap quarter notes with your foot for 30s (no guitar).',
          'Muted strums on open strings: down only, then down-up.',
          'Count 1 & 2 & 3 & 4 & out loud while you strum ghosts.',
        ],
      }
    case 'lead':
      return {
        coach: 'Loose hands, singing brain. Warm vibrato and bends gently.',
        youDo: [
          'Long tones on one fretted note — try a tiny vibrato.',
          'Half-step bend on G string (careful) — match pitch if you can.',
          'Play a 3-note idea, rest a full bar, repeat.',
        ],
      }
    default:
      return {
        coach: 'Song day warm-up: touch the key sections lightly, no hero takes yet.',
        youDo: [
          ...base,
          'Hum or sing the melody once before fretting it.',
          'Play only the intro or first phrase — soft dynamics.',
          'Stretch fretting hand 30s after the first run.',
        ],
      }
  }
}

function teachBlock(phase: LessonPhase, seed: LessonSeed, day: number): { coach: string; youDo: string[] } {
  return {
    coach: `${seed.theoryBite} We’ll go slower than your ego wants — that’s the pro move.`,
    youDo: [
      'Skim the theory bite once, then put your hands on the guitar.',
      phase === 'chords'
        ? 'Build the shape finger-by-finger; pluck strings one at a time before strumming.'
        : phase === 'scales'
          ? 'Trace the shape on the neck with your eyes before you play it.'
          : 'Watch your hands 20 seconds — fix one tense spot, not ten.',
      pick(
        [
          'Metronome quieter than you are.',
          'Sharp pain = stop. Tired is fine; injury is not.',
          'When one note rings clean, notice it. That’s the win.',
        ],
        day,
      ),
    ],
  }
}

function guidedBlock(seed: LessonSeed, day: number): { coach: string; youDo: string[] } {
  const drills =
    seed.drills.length >= 3
      ? seed.drills
      : [...seed.drills, 'Repeat the cleanest take twice', 'Half-speed pass with a metronome']
  return {
    coach:
      'Guided practice. Stay at a tempo where most reps are clean. Speed is a reward, not a tax.',
    youDo: drills.map((d, i) => {
      const mins = i === 0 ? '~3 min' : i === 1 ? '~3 min' : '~2 min'
      return `${mins}: ${d}`
    }),
  }
}

function jamBlock(phase: LessonPhase, seed: LessonSeed, day: number): { coach: string; youDo: string[]; tip: string } {
  const ideas: Record<LessonPhase, string[]> = {
    basics: [
      'Tiny song: 4 open-string hits, 4 fretted notes, repeat.',
      'Play, rest a bar, answer yourself.',
    ],
    chords: [
      'Campfire loop: 4 beats per chord. Miss a change? Keep the strum arm moving.',
      'Same shapes, two volumes — soft then bigger.',
    ],
    scales: [
      'Only 3 notes for a whole minute. Make rhythm do the work.',
      'Question up high, answer down low — leave rests.',
    ],
    rhythm: [
      '4 bars pattern A, 4 bars B, back to A.',
      'Drop out on bar 4 on purpose — silence counts.',
    ],
    lead: [
      'Same 4 notes, new rhythm each bar for 8 bars.',
      'End every phrase on the root or the 3rd.',
    ],
    repertoire: [
      'Full section — no stopping. Flub? Recover like a show.',
      'One phone take. Listen once kind, once with a note.',
    ],
  }
  return {
    coach: 'Jam time — this is the fun you earned. Play something that sounds like music.',
    youDo: [
      pick(ideas[phase], day),
      'Keep your foot tapping the whole time.',
      'Last 60s: simplest clean version. Victory lap.',
    ],
    tip: 'If you freeze, one note in time until your brain comes back.',
  }
}

function cooldownBlock(seed: LessonSeed): { coach: string; youDo: string[] } {
  return {
    coach: 'Cool-down. Soft hands, short check, done.',
    youDo: [
      'Soft open strings or one gentle chord for 30–45s.',
      `Quick check — could you do this yet? ${seed.masteryCheck}`,
      'Stretch fretting hand, shake the picking arm. One note to yourself: what felt good.',
    ],
  }
}

function mistakesFor(phase: LessonPhase, day: number): string[] {
  const common: Record<LessonPhase, string[]> = {
    basics: [
      'Death-grip fretting — use just enough pressure to sound the note.',
      'Looking only at fretting hand; glance at strum arm too.',
      'Skipping open-string naming — it pays rent later.',
    ],
    chords: [
      'Rushing the change and landing a mutiny of muted strings.',
      'Collapsed wrist / thumb over the top choking the neck.',
      'Strumming strings that shouldn’t ring (especially low E on C/D shapes).',
    ],
    scales: [
      'Running the box with no rhythm — always put a pulse under it.',
      'Ignoring chord tones when “improvising.”',
      'Tense pinky — let it hover relaxed when idle.',
    ],
    rhythm: [
      'Speeding up on the easy bars and dragging on the hard ones.',
      'Upstrokes weaker than downstrokes with no intention.',
      'Holding breath — breathe on bar lines.',
    ],
    lead: [
      'Too many notes because silence feels scary — silence is confident.',
      'Bending without a target pitch.',
      'No dynamics — try half the volume on the answer phrase.',
    ],
    repertoire: [
      'Restarting from the top after every mistake (practice mid-song recoveries).',
      'Only practicing the fun section; transitions need reps too.',
      'Chasing a perfect take instead of a honest keepable one.',
    ],
  }
  const list = common[phase]
  return [list[day % list.length], list[(day + 1) % list.length], list[(day + 2) % list.length]]
}

function encouragementFor(day: number, phase: LessonPhase): string {
  const lines = [
    'You showed up. That’s the whole game on hard days.',
    'Clean and slow today becomes easy and free next month.',
    'Every pro you love still practices the boring beautiful basics.',
    'Progress hides in reps you almost skipped — glad you’re here.',
    'One focused half-hour beats three distracted hours. You did the focused thing.',
  ]
  const phaseExtra: Record<LessonPhase, string> = {
    basics: 'Foundations feel small until they suddenly feel like flying.',
    chords: 'Chord changes click overnight after enough kind reps.',
    scales: 'Your ear is learning even when your fingers feel clumsy.',
    rhythm: 'If people can nod along, you’re already a musician.',
    lead: 'Say less on the guitar; mean more.',
    repertoire: 'Songs remember the players who finish them.',
  }
  return `${pick(lines, day)} ${phaseExtra[phase]}`
}

function easyModeFor(phase: LessonPhase, seed: LessonSeed): string {
  const g = seed.goals[0] ?? 'today’s main shape'
  switch (phase) {
    case 'chords':
      return `Easy mode: freeze the hardest chord for 10 clean strums, then only two-chord changes. Skip barre pressure if it’s too much — ${g} at half speed still counts.`
    case 'scales':
      return `Easy mode: only the root and two neighbor notes in time for 2 minutes. Drop sequences. ${g} is enough.`
    case 'rhythm':
      return 'Easy mode: downstrokes on beats 1 and 3 only, foot tapping. Add &s tomorrow.'
    case 'lead':
      return 'Easy mode: one motif, three notes, lots of rests. No bends required today.'
    case 'repertoire':
      return 'Easy mode: loop four bars of the sticky section. Don’t run the full form until those four feel friendly.'
    default:
      return `Easy mode: cut the jam short and repeat the warm-up + one drill. Mastery check can be “almost” — come back tomorrow sharper.`
  }
}

function funBonus(phase: LessonPhase, day: number): string {
  return pick(
    {
      basics: [
        'Fun bonus: name the strings as a silly sentence (Eddie Ate Dynamite… or make your own).',
        'Fun bonus: record 15s of open strings and pick your favorite tone position over the soundhole.',
      ],
      chords: [
        'Fun bonus: play today’s progression as if it’s a lullaby, then as if it’s a stadium chant.',
        'Fun bonus: let a roommate/pet “rate” your groove 1–5 — comedy counts.',
      ],
      scales: [
        'Fun bonus: improvise only on the high 2 strings like a tiny synth lead.',
        'Fun bonus: end every phrase on a wrong note on purpose once — then fix it. Fear leaves.',
      ],
      rhythm: [
        'Fun bonus: put a favorite drumless track on and only play muted 8ths for one chorus.',
        'Fun bonus: teach your foot a clave: tap–tap rest tap.',
      ],
      lead: [
        'Fun bonus: sing a nonsense lyric to your lick, then play the rhythm you sang.',
        'Fun bonus: call-and-response with a YouTube backing track at 80%.',
      ],
      repertoire: [
        'Fun bonus: stand up for the last take — posture changes courage.',
        'Fun bonus: dedicate the take to someone and play like they’re on the couch.',
      ],
    }[phase],
    day,
  )
}

/** Gold-standard private-lesson copy for early days (teacher-written). */
const GOLD: Partial<Record<number, Partial<PrivateLessonFields> & { teachExtra?: string }>> = {
  1: {
    hook: 'Day one: make noise that feels good. No wrong notes yet.',
    teacherIntro:
      'Hey — welcome. Today isn’t about being “good.” Hold the guitar so your hands can relax, learn the string names, and hear six clear open notes. That’s a real first win.',
    commonMistakes: [
      'Hunching over — bring the guitar up, don’t dive down.',
      'Right hand floating; rest near the bridge lightly if it helps.',
      'Skipping string names because it feels childish — it’s not.',
    ],
    encouragement: 'You made the guitar speak. That’s the start.',
    funBonus: 'Nickname each string. You’ll remember faster.',
  },
  3: {
    hook: 'First real chord: Em — two fingers, instant band energy.',
    teacherIntro:
      'Em is the friendliest full chord on the guitar. Two fingers, all six strings. We’ll build it slow, check every string, then strum like a song already started.',
    encouragement: 'If Em rings, you can learn every other open chord.',
  },
  7: {
    hook: 'Week 1 jam — party for showing up seven days.',
    teacherIntro:
      'We’ll run Em G C D, keep a pulse, and record something short. Laugh at it later when you’re better — that’s the point.',
  },
  11: {
    hook: 'Pentatonic box 1 — the shape behind a thousand rock solos.',
    teacherIntro:
      'Minor pentatonic is the “hard to mess up” scale. Find A at fret 5, walk the box like stepping stones, and leave space so it sounds like music.',
  },
  30: {
    hook: 'Basics capstone — tiny set, not an exam.',
    teacherIntro:
      'Thirty days in: you are not behind. You’re stacking clean reps. Today we play a little set and finish on a chord.',
    encouragement: 'Showing up for a month already shows in your hands.',
    funBonus: 'Text a friend 15 seconds of your favorite bars.',
  },
  75: {
    hook: 'Chord crest — smooth changes beat fancy ones.',
    teacherIntro:
      'If your changes are getting smoother, that is the whole plot. Polish the sticky one and play music through it.',
    encouragement: 'Chord comfort shows up in jumps after plateaus. Trust the slow days.',
  },
  120: {
    hook: 'Scales as stories — not a quiz.',
    teacherIntro:
      'A 16-bar pent story beats a perfect box run. Start, little peak, land on the root.',
    encouragement: 'Left space in your solo? You are already thinking like a musician.',
  },
  180: {
    hook: 'Rhythm checkpoint — pocket first.',
    teacherIntro:
      'Lock time before you chase lead notes. Honest groove makes everything you add later sit better.',
    encouragement: 'People feel your time before they notice your fretting. That is the skill.',
  },
  260: {
    hook: 'Lead checkpoint — talk, do not sprint.',
    teacherIntro:
      'Bring a short idea, a bend with a target, and some silence. That beats a hundred rushed scale runs.',
    encouragement: 'Your voice on the instrument is forming. Protect it with rests.',
  },
  365: {
    hook: 'Day 365 — play a set that sounds like you.',
    teacherIntro:
      'Celebration, not a jury. Mini-set, honest take, then jot what you want next month.',
    encouragement: 'You finished a year-shaped path. That matters as much as any lick.',
    funBonus: 'Put the first practice of the next 30 days on your calendar before you put the guitar down.',
  },
}

/**
 * Expand a curriculum seed into full private-lesson fields.
 * Always ~25–35 minutes with timed segments and teacher voice.
 */
export function expandPrivateLesson(
  day: number,
  phase: LessonPhase,
  _skill: SkillLevel,
  seed: LessonSeed,
): PrivateLessonFields {
  const durationMin = Math.max(seed.durationMin || 30, minutesForPhase(phase, day))
  const plan = segmentPlan(durationMin)
  const warm = warmupFor(phase, day, seed)
  const teach = teachBlock(phase, seed, day)
  const guided = guidedBlock(seed, day)
  const jam = jamBlock(phase, seed, day)
  const cool = cooldownBlock(seed)
  const gold = GOLD[day]

  // Unique per day without title-paste chrome in goals/drills — casual topic tag only.
  const hook =
    gold?.hook ??
    `${pick(PHASE_HOOKS[phase], day)} ${seed.title.includes('—') ? seed.title.split('—').slice(1).join('—').trim() : seed.title}.`
  const teacherIntro =
    gold?.teacherIntro ??
    `Next ${durationMin} minutes: warm up, one clear idea, small reps, then something that feels like music. Start with: ${seed.goals[0] ?? 'stay relaxed and in time'}.`

  const segments: LessonSegment[] = [
    {
      id: 'arrive',
      name: 'Arrive & set intention',
      minutes: plan.arrive,
      coach: pick(ARRIVE_LINES, day),
      youDo: [
        seed.goals[0] ?? 'One clean win today.',
        seed.goals[1] ?? 'Stay relaxed.',
        'Metronome or foot tap ready. Water nearby.',
      ],
    },
    {
      id: 'warmup',
      name: 'Warm-up',
      minutes: plan.warmup,
      coach: warm.coach,
      youDo: warm.youDo,
      tip: 'If something hurts sharply, stop. Dull fatigue = shake out and slow down.',
    },
    {
      id: 'teach',
      name: 'Teach — the idea',
      minutes: plan.teach,
      coach: teach.coach,
      youDo: teach.youDo,
      tip: 'One focus beats five half-focuses.',
    },
    {
      id: 'guided',
      name: 'Guided practice',
      minutes: plan.guided,
      coach: guided.coach,
      youDo: guided.youDo,
      tip: '8/10 clean reps → nudge tempo +4 BPM. Else stay.',
    },
    {
      id: 'jam',
      name: 'Jam / song time',
      minutes: plan.jam,
      coach: jam.coach,
      youDo: jam.youDo,
      tip: jam.tip,
    },
    {
      id: 'cooldown',
      name: 'Cool-down & win check',
      minutes: plan.cooldown,
      coach: cool.coach,
      youDo: cool.youDo,
    },
  ]

  return {
    durationMin,
    hook,
    teacherIntro,
    segments,
    commonMistakes: gold?.commonMistakes ?? mistakesFor(phase, day),
    encouragement: gold?.encouragement ?? encouragementFor(day, phase),
    winCondition: seed.masteryCheck,
    easyMode: easyModeFor(phase, seed),
    funBonus: gold?.funBonus ?? funBonus(phase, day),
  }
}
