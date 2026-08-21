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
  const goalLine = seed.goals.slice(0, 2).join(' · ')
  return {
    coach: `${seed.theoryBite} Today’s focus: ${goalLine}. We’ll go slower than your ego wants — that’s the pro move.`,
    youDo: [
      'Read the idea once out loud (seriously — it sticks).',
      `Picture success: ${seed.masteryCheck}`,
      phase === 'chords'
        ? 'Build the shape finger-by-finger; pluck strings one at a time before strumming.'
        : phase === 'scales'
          ? 'Trace the shape visually on the neck before you play it.'
          : 'Watch your hands in a mirror or phone camera for 20s — fix one tension spot.',
      pick(
        [
          'Set a metronome quieter than your playing.',
          'If anything hurts (sharp pain), stop and loosen — fatigue ≠ injury.',
          'Smile when one note rings clean. That’s the dopamine we want.',
        ],
        day,
      ),
    ],
  }
}

function guidedBlock(seed: LessonSeed, day: number): { coach: string; youDo: string[] } {
  const drills = seed.drills.length >= 3 ? seed.drills : [...seed.drills, 'Repeat the cleanest take twice', 'Half-speed pass with a metronome']
  return {
    coach:
      'Guided practice — I’m metaphorically pointing at the sticky spot. Stay at a tempo where 8 of 10 reps are clean. Speed is a reward, not a tax.',
    youDo: drills.map((d, i) => {
      const mins = i === 0 ? '~3 min' : i === 1 ? '~3 min' : '~2 min'
      return `${mins}: ${d}`
    }),
  }
}

function jamBlock(phase: LessonPhase, seed: LessonSeed, day: number): { coach: string; youDo: string[]; tip: string } {
  const lib = seed.libraryIds[0]
  const libHint = lib ? `Open library item “${lib}” when you want sound under you.` : 'Loop a simple open-string groove if you need a bed.'
  const ideas: Record<LessonPhase, string[]> = {
    basics: [
      'Make a tiny “song”: 4 open-string hits, 4 fretted notes, repeat.',
      'Call-and-response with yourself — play, rest, answer.',
    ],
    chords: [
      'Campfire loop: 4 beats per chord through today’s set. Miss a change? Keep the strum arm going.',
      'Dynamics game: verse soft, chorus bigger — same shapes.',
    ],
    scales: [
      'Improv rule: only 3 notes for a whole minute. Make them funky with rhythm.',
      'Question phrase up high, answer down low — leave rests.',
    ],
    rhythm: [
      'Groove sandwich: 4 bars pattern A, 4 bars pattern B, back to A.',
      'Drop out on bar 4 on purpose — silence is musical.',
    ],
    lead: [
      'Motif gym: same 4 notes, new rhythm each bar for 8 bars.',
      'Target game: end every phrase on the root or 3rd.',
    ],
    repertoire: [
      'Full section take — no stopping. If you flub, recover like a show.',
      'Record one phone take; listen once with kindness, once with a pencil.',
    ],
  }
  return {
    coach: `Jam / song time — this is the fun you earned. ${libHint}`,
    youDo: [
      pick(ideas[phase], day),
      seed.goals[2] ? `Sneak this goal into the jam: ${seed.goals[2]}` : 'Keep your foot tapping the whole time.',
      'Last 60s: play the cleanest, simplest version — that’s your victory lap.',
    ],
    tip: 'If you freeze, play one note in time until the brain comes back online.',
  }
}

function cooldownBlock(seed: LessonSeed): { coach: string; youDo: string[] } {
  return {
    coach: 'Cool-down protects your hands and locks the memory. Pros don’t skip this.',
    youDo: [
      'Soft open strings or a gentle chord for 30–45s.',
      `Mastery mirror: could you claim this? “${seed.masteryCheck}” — if not, note one sticky bar for tomorrow.`,
      'Stretch fretting hand + shake out picking arm. One sentence in a notes app: what felt good.',
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
    hook: 'Day one energy: make noise that feels good — no wrong notes yet.',
    teacherIntro:
      'Hey — welcome. Today isn’t about being “good.” It’s about holding the guitar so your hands can relax, learning the string names, and hearing six clear open notes. That’s a real musician’s first win.',
    commonMistakes: [
      'Hunching over the guitar — bring the guitar up, don’t dive down.',
      'Right hand floating randomly; rest near the bridge lightly if it helps.',
      'Skipping string names because it feels childish — it’s not.',
    ],
    encouragement: 'You made the guitar speak. That’s the start of everything cool later.',
    funBonus: 'Give each string a nickname. You’ll remember faster.',
  },
  3: {
    hook: 'Your first real chord: Em — two fingers, instant band energy.',
    teacherIntro:
      'Em is the friendliest full chord on the guitar. Two fingers, all six strings, moody and strong. We’ll build it slow, check every string, then strum like a song already started.',
    encouragement: 'If Em rings, you can learn every other open chord. Serious.',
  },
  7: {
    hook: 'Week 1 jam — this is the party for showing up seven days.',
    teacherIntro:
      'Checkpoints are celebrations with a clipboard. We’ll run Em G C D, keep a pulse, and record something short you can laugh at later when you’re shredding.',
  },
  11: {
    hook: 'Pentatonic box 1 — the shape behind a thousand rock solos.',
    teacherIntro:
      'Minor pentatonic is the “can’t mess it up too bad” scale. We’ll find A at fret 5, walk the box like stepping stones, and leave space so it sounds like music, not an elevator.',
  },

  // Weekly-ish anchors get richer teacher voice (research: spaced retrieval + celebration)
  30: {
    hook: 'Basics capstone — prove the campfire core with kindness.',
    teacherIntro:
      'Thirty days in: you are not “behind.” You are collecting clean reps. Today we perform a tiny set, not a exam.',
    encouragement: 'Foundations compound. Showing up for a month is already rare — and it shows in your hands.',
    funBonus: 'Text a friend a 15s clip of your favorite 8 bars. Witnesses make wins real.',
  },
  75: {
    hook: 'Chord phase crest — fluency over fancy.',
    teacherIntro:
      'If changes are getting smoother, that is the whole plot. We polish the sticky door today and play music through it.',
    encouragement: 'Chord comfort arrives in jumps after plateaus. Trust the slow days.',
  },
  120: {
    hook: 'Scales become stories today — not exams.',
    teacherIntro:
      'A 16-bar pent story beats a perfect box run. Shape a beginning, a little peak, and a landing on the root.',
    encouragement: 'If you left space in your solo, you are already thinking like a musician.',
  },
  180: {
    hook: 'Rhythm checkpoint — pocket is a superpower.',
    teacherIntro:
      'We bridge toward lead by locking time. If the groove is honest, notes you add later will sit like furniture on a good floor.',
    encouragement: 'People feel your time before they admire your fretting. You are training what listeners love first.',
  },
  260: {
    hook: 'Lead checkpoint — speech, not sport.',
    teacherIntro:
      'Bring a motif, a bend with a target, and silence. That trio outperforms a hundred rushed scale runs on stage.',
    encouragement: 'Your voice on the instrument is forming. Protect it with rests.',
  },
  365: {
    hook: 'Day 365 — finish art on a long horizon.',
    teacherIntro:
      'This is a celebration performance, not a jury. Play a mini-set that sounds like you. Then write the next arc with kindness.',
    encouragement: 'You finished a year-shaped path. That identity shift matters as much as any lick.',
    funBonus: 'Schedule the first practice of the next 30 days on your calendar before you put the guitar down.',
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

  const hook = gold?.hook ?? `${pick(PHASE_HOOKS[phase], day)} · ${seed.title}`
  const teacherIntro =
    gold?.teacherIntro ??
    `Private lesson — Day ${day}. We’ll treat the next ${durationMin} minutes like I’m here: warm up, learn one clear idea, practice it in small reps, then play something that feels like music. Focus: ${seed.goals[0] ?? seed.title}.`

  const segments: LessonSegment[] = [
    {
      id: 'arrive',
      name: 'Arrive & set intention',
      minutes: plan.arrive,
      coach: pick(ARRIVE_LINES, day),
      youDo: [
        `Today’s win: ${seed.goals[0] ?? seed.title}`,
        `Secondary: ${seed.goals[1] ?? 'stay relaxed'}`,
        'Metronome ready (or foot tap). Water nearby.',
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
