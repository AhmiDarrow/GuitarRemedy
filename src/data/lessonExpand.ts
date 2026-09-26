/**
 * Turns bare lesson seeds into a ~30 minute private-lesson session.
 * Research-backed: one focus, early music, short wins, mistakes OK,
 * warm-up → teach → guided → jam → cool-down, slow-is-pro.
 */
import type { LessonPhase } from './curriculum'
import type { SkillLevel } from './library'
import { sessionCoachFor, type DaySessionCoach } from './sessionCoach'

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
  const warmup = Math.round(total * 0.15)
  const teach = Math.round(total * 0.18)
  const guided = Math.round(total * 0.3)
  const cooldown = 3
  const jam = total - arrive - warmup - teach - guided - cooldown
  return { arrive, warmup, teach, guided, jam, cooldown }
}

function warmupFor(
  phase: LessonPhase,
  day: number,
  seed: LessonSeed,
  dayCoach?: DaySessionCoach,
): { coach: string; youDo: string[] } {
  const base = [
    'Open strings low→high, then high→low — name them if you can.',
    'Shake out fretting hand 10 seconds. Thumb behind the neck, not strangling it.',
  ]
  const preview = seed.drills[0]
    ? `Light preview: ${seed.drills[0]}`
    : '60 seconds of whatever felt hard yesterday — half speed.'
  switch (phase) {
    case 'basics':
      return {
        coach: dayCoach?.warmup ?? 'We start gentle. Buzz and muted notes are information, not failure.',
        youDo: [
          ...base,
          day === 1 ? 'Keep the fretting hand off the strings. Let each open note ring.' : 'Finger taps on frets 1–4 of the high E, no rush.',
          preview,
        ],
      }
    case 'chords':
      return {
        coach: dayCoach?.warmup ?? 'Warm the shapes you’ll need. Clean first — tempo later.',
        youDo: [
          ...base,
          'Form yesterday’s easiest chord, strum once per beat for 30s.',
          'Air-change to today’s first shape without fretting — muscle map first.',
          'Soft downstrokes only, tempo you can hum.',
        ],
      }
    case 'scales':
      return {
        coach: dayCoach?.warmup ?? 'Wake the fretting hand with spider motion, then touch today’s root.',
        youDo: [
          '1-2-3-4 chromatic on one string, then reverse — slow.',
          'Find today’s root note and pulse it on quarter notes for 20s.',
          preview,
        ],
      }
    case 'rhythm':
      return {
        coach: dayCoach?.warmup ?? 'Body first. If your foot isn’t steady, the right hand won’t be either.',
        youDo: [
          'Tap quarter notes with your foot for 30s (no guitar).',
          'Muted strums on open strings: down only, then down-up.',
          'Count 1 & 2 & 3 & 4 & out loud while you strum ghosts.',
        ],
      }
    case 'lead':
      return {
        coach: dayCoach?.warmup ?? 'Loose hands, singing brain. Warm vibrato and bends gently.',
        youDo: [
          'Long tones on one fretted note — try a tiny vibrato.',
          'Half-step bend on G string (careful) — match pitch if you can.',
          preview,
        ],
      }
    default:
      return {
        coach: dayCoach?.warmup ?? 'Song day warm-up: touch the key sections lightly, no hero takes yet.',
        youDo: [
          ...base,
          'Hum or sing the melody once before fretting it.',
          'Play only the intro or first phrase — soft dynamics.',
          preview,
        ],
      }
  }
}

function teachBlock(
  phase: LessonPhase,
  seed: LessonSeed,
  day: number,
  dayCoach?: DaySessionCoach,
): { coach: string; youDo: string[] } {
  // Use the full explanation; generated coach summaries can truncate the actual instruction.
  const coach = `${seed.theoryBite} Try the idea slowly, then explain what you heard in your own words.`
  return {
    coach,
    youDo: [
      'Read the idea once, then put your hands on the guitar.',
      phase === 'chords'
        ? 'Build the shape finger-by-finger; pluck strings one at a time before strumming.'
        : phase === 'scales'
          ? 'Trace the shape on the neck with your eyes before you play it.'
          : phase === 'rhythm'
            ? 'Count a bar out loud, then add the guitar on the same grid.'
            : phase === 'lead'
              ? 'Sing or hum a 3–4 note version before you fret it.'
              : phase === 'repertoire'
                ? 'Name the section you’re serving (intro, verse, chorus) before you play.'
                : 'Watch your hands 20 seconds — fix one tense spot, not ten.',
      seed.goals[0]
        ? `Hold this win in mind: ${seed.goals[0]}`
        : pick(
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

function guidedBlock(
  seed: LessonSeed,
  day: number,
  dayCoach?: DaySessionCoach,
): { coach: string; youDo: string[] } {
  const drills =
    seed.drills.length >= 3
      ? seed.drills
      : [...seed.drills, 'Repeat the cleanest take twice', 'Half-speed pass with a metronome']
  const coach = `Practice: ${seed.title}. Work through one exercise at a time. Begin with: ${seed.drills[0]} Repeat slowly and change only one thing when a note is unclear.`
  return {
    coach,
    youDo: drills,
  }
}

function jamBlock(
  phase: LessonPhase,
  seed: LessonSeed,
  day: number,
  dayCoach?: DaySessionCoach,
): { coach: string; youDo: string[]; tip: string } {
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
  const topic = seed.title.includes('—')
    ? seed.title.split('—').slice(1).join('—').trim()
    : seed.title
  return {
    coach:
      dayCoach?.jam ??
      `Jam time for "${topic}". Play something that sounds like music — not another drill checklist.`,
    youDo: [
      day === 1 ? 'Pluck low E on count 1, A on count 3, then D on the next count 1. Let the open strings ring and repeat.' : pick(ideas[phase], day),
      seed.goals[1] ? `Keep this nearby: ${seed.goals[1]}` : 'Keep your foot tapping the whole time.',
      'Last 60s: simplest clean version. Victory lap.',
    ],
    tip: 'If you freeze, one note in time until your brain comes back.',
  }
}

function cooldownBlock(seed: LessonSeed, dayCoach?: DaySessionCoach): { coach: string; youDo: string[] } {
  return {
    coach: dayCoach?.cooldown ?? 'Cool-down. Soft hands, short check, done.',
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
  14: {
    hook: 'Two weeks in — let the week’s wins land.',
    teacherIntro:
      'Fourteen days is when the first “this is actually working” moments show up. Play your easiest 30 seconds twice, clean and proud.',
    encouragement: 'Two weeks of showing up beats two months of thinking about it.',
  },
  21: {
    hook: 'Three weeks — check your before-and-after.',
    teacherIntro:
      'Three weeks in, your fingers know things they didn’t on day one. Play the first chord you ever learned and feel the difference.',
    encouragement: 'That’s real progress, not luck. Feel it.',
  },
  28: {
    hook: 'Month mark — one clean minute, no stopping.',
    teacherIntro:
      'Before tomorrow’s capstone, prove to yourself you can keep one clean minute alive. Slow is fine. Stopping is not.',
    encouragement: 'One continuous minute is a stage-shaped win.',
  },
  42: {
    hook: 'Six weeks — the chords are starting to feel like yours.',
    teacherIntro:
      'Six weeks of changes under your belt means the shapes are becoming furniture, not puzzles. Push the sticky one gently today.',
    encouragement: 'Plateaus end the day you stop fighting them.',
  },
  49: {
    hook: 'Seven weeks — small stage, full honesty.',
    teacherIntro:
      'Treat one take like a tiny performance: count-in, play, finish, breathe. Imperfect but complete beats perfect but restarted.',
    encouragement: 'Recovery is a skill, and you just practiced it.',
  },
  56: {
    hook: 'Eight weeks — your first real A/B.',
    teacherIntro:
      'Play the same four bars twice: once tense, once relaxed. Hear what soft hands buy you.',
    encouragement: 'Tone lives in the hands, and yours are learning.',
  },
  63: {
    hook: 'Nine weeks — the two-month checkpoint.',
    teacherIntro:
      'Two months is where beginners either stall or shift. Today you’re shifting: same skills, better ears, lighter hands.',
    encouragement: 'Nine weeks of clean reps is a serious foundation.',
  },
  84: {
    hook: 'Twelve weeks — quarter of the year.',
    teacherIntro:
      'Ninety days in, the guitar is part of your week, not a stranger. Play something that sounds like a song you’d keep.',
    encouragement: 'A quarter-year of practice is how habits become identity.',
  },
  91: {
    hook: 'Thirteen weeks — scales become sentences.',
    teacherIntro:
      'You’ve earned the map. Now today is about hearing the map as music, not homework.',
    encouragement: 'Fewer notes with meaning beat more notes with noise.',
  },
  100: {
    hook: 'Day 100 — triple digits, real musician energy.',
    teacherIntro:
      'A hundred days of showing up. Play a short piece you can already feel proud of, then write down what changed since day one.',
    encouragement: 'Day 100 is a milestone most people never reach. You did.',
  },
  150: {
    hook: 'Day 150 — the rhythm backbone.',
    teacherIntro:
      'Halfway through the year, the groove you can hold matters more than any single lick. Prove it with a clean 16 bars.',
    encouragement: 'Pocket is a superpower, and you’re building it.',
  },
  200: {
    hook: 'Day 200 — you have a voice now.',
    teacherIntro:
      'Two hundred days of practice means you can say something on the guitar. Say it plainly today: one idea, full sentences.',
    encouragement: 'Two hundred days in, you’re not a beginner anymore.',
  },
  250: {
    hook: 'Day 250 — the year’s back half.',
    teacherIntro:
      'Past the 200s, the fun is compounding. Play a section you struggled with in month two and feel how far you’ve come.',
    encouragement: 'The instrument is becoming part of your language.',
  },
  300: {
    hook: 'Day 300 — arrangements are arrangements.',
    teacherIntro:
      'Three hundred days in, you can shape songs instead of just playing them. Simplify one section until it’s bulletproof.',
    encouragement: 'Consistency is a feature the audience feels.',
  },
  330: {
    hook: 'Day 330 — countdown to the year.',
    teacherIntro:
      'The last month of the path. Polish, don’t panic. Choose the one thing that lifts your playing most and give it ten minutes.',
    encouragement: 'The final stretch is where the habits pay rent.',
  },
  350: {
    hook: 'Day 350 — rehearsal for the year-end set.',
    teacherIntro:
      'Two weeks from the finish. Run your set like a show: start ritual, steady pace, strong ending, one honest take.',
    encouragement: 'You’re finishing a year-shaped promise.',
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
  // Weekly checkpoints + phase gates — hand hooks so coach voice isn't 26 islands.
  35: {
    hook: 'Em–Am is family — small move, big song fuel.',
    teacherIntro:
      'Two minor shapes that share DNA. We will change between them until it feels like walking, not jumping.',
    encouragement: 'Kinship between chords is how songs get easy.',
  },
  40: {
    hook: 'C and Am — the relative pair every pop song loves.',
    teacherIntro:
      'Same neighborhood on the neck. Hear how Am sighs and C opens — then make the change boringly clean.',
  },
  50: {
    hook: 'Slash ideas — bass motion without new shapes.',
    teacherIntro:
      'Today is ear candy with old chords. Keep the top shape steady and let the bass note tell a tiny story.',
  },
  60: {
    hook: 'Speed ladder week — only as fast as clean.',
    teacherIntro:
      'We climb tempo like stairs, not an elevator. Miss a step? Stay on that floor until it rings.',
  },
  70: {
    hook: 'Soft hands day — tension is the enemy of tone.',
    teacherIntro:
      'Audit your grip. If the fretting hand is strangling the neck, everything else fights uphill. Lighten first.',
    encouragement: 'Soft hands are a skill, not a personality trait.',
  },
  77: {
    hook: 'Pent box 1 mastery — even tone, no heroics.',
    teacherIntro:
      'Same box you met early on. Today we make every note speak the same volume and land on time.',
  },
  80: {
    hook: 'Major pentatonic — the bright twin.',
    teacherIntro:
      'Same family as minor pent, sunnier color. Find the bright box and play something that smiles.',
  },
  90: {
    hook: 'Target triads over G–C–D — solo with purpose.',
    teacherIntro:
      'Stop running the box on autopilot. Aim chord tones so the solo sounds like it knows the song.',
  },
  98: {
    hook: 'Phrase gym — copy, then make it yours.',
    teacherIntro:
      'Steal one short idea cleanly, change one thing, then own the result. That is how vocabulary grows.',
  },
  105: {
    hook: 'Phrase gym round two — smaller changes, clearer voice.',
    teacherIntro:
      'Same gym, sharper ears. Copy less, vary more, keep the pocket honest.',
  },
  110: {
    hook: 'Weekly scales checkpoint — map, not marathon.',
    teacherIntro:
      'Show the shapes you own this week. Slow, named roots, one musical sentence at the end.',
  },
  112: {
    hook: 'Phrase gym — leave space on purpose.',
    teacherIntro:
      'Rests are part of the lick. If you cannot hear the silence, you are still sprinting.',
  },
  119: {
    hook: 'Phrase gym — finish the thought.',
    teacherIntro:
      'Every phrase needs a landing. Play less, resolve more, smile when the last note sits.',
  },
  126: {
    hook: 'Rest as a weapon — play less, mean more.',
    teacherIntro:
      'Groove gets cooler when you subtract. We will mute, wait, and hit only what counts.',
  },
  130: {
    hook: 'Funk chicka — tiny scratches, big pocket.',
    teacherIntro:
      'Sixteenth speckles with a soft left hand. If it is loud and stiff, lighten until it dances.',
  },
  133: {
    hook: '3 against 2 — feel both grids without panic.',
    teacherIntro:
      'Polyrhythm taste test. Count out loud, go slow, and celebrate when both layers click.',
  },
  140: {
    hook: 'Rock eighth drive — simple right hand, solid time.',
    teacherIntro:
      'Down-down energy with a locked foot. No fancy fills until the eighths feel automatic.',
  },
  147: {
    hook: 'Rock drive deepening — same engine, cleaner fuel.',
    teacherIntro:
      'Keep the eighth motor, fix the weak beat, and record eight bars you would loop.',
  },
  154: {
    hook: 'Rock drive — dynamics inside the chug.',
    teacherIntro:
      'Loud and soft still live in rock time. Whisper the verse energy, lean the chorus — without rushing.',
  },
  160: {
    hook: 'Country boom-chuck — thumb story, chord snap.',
    teacherIntro:
      'Bass on the boom, chord on the chuck. If the thumb rushes, everything sounds nervous.',
  },
  161: {
    hook: 'Genre day — commit to the feel for a full minute.',
    teacherIntro:
      'Pick the pocket and stay married to it. Switching feels mid-take is how grooves die.',
  },
  168: {
    hook: 'Genre pocket — fewer notes, clearer identity.',
    teacherIntro:
      'Today we subtract until the style is obvious from eight bars alone.',
  },
  170: {
    hook: 'Click trust — behind, on, and ahead on purpose.',
    teacherIntro:
      'The metronome is a friend. We lean around it deliberately so “human” does not mean “sloppy.”',
  },
  175: {
    hook: 'Genre day — lock it, then leave it alone.',
    teacherIntro:
      'Once the feel sits, stop decorating. Repetition is the teacher today.',
  },
  182: {
    hook: 'Bends 101 — pitch is the whole point.',
    teacherIntro:
      'Bend to a target you can sing. If the pitch is vague, slow down and hold the top longer.',
    encouragement: 'A beautiful bend beats a fast run you cannot hear.',
  },
  189: {
    hook: 'Target 3rds — the sweet notes over chords.',
    teacherIntro:
      'Thirds make solos sound “in.” Find them, sit on them, and let the chord bloom underneath.',
  },
  190: {
    hook: 'Octave melodies — simple and huge.',
    teacherIntro:
      'Same note in two places. Keep them in tune with each other and the line will sound expensive.',
  },
  196: {
    hook: 'Sequence climb — patterns that still sing.',
    teacherIntro:
      'Sequences are ladders, not machines. Shape the top of each cell so it feels like a melody.',
  },
  203: {
    hook: 'Sequences round two — cleaner cells.',
    teacherIntro:
      'Same idea, less smear between notes. If one cell is dirty, loop only that cell.',
  },
  210: {
    hook: 'Sequences — connect without panic shifts.',
    teacherIntro:
      'Position changes are part of the music. Plan the shift on a weak beat and land calm.',
  },
  217: {
    hook: 'Sequences — leave air between ideas.',
    teacherIntro:
      'Two cells and a breath beats six cells in a blur. Play like you are talking.',
  },
  220: {
    hook: 'Hybrid picking taste — pick plus fingers.',
    teacherIntro:
      'One pick stroke, one finger pluck. Keep the volume matched so it feels like one hand.',
  },
  224: {
    hook: 'Sequences — musical, not athletic.',
    teacherIntro:
      'If it only impresses you at full speed, it is not ready. Half tempo with shape wins.',
  },
  231: {
    hook: 'Sequences — target the chord change.',
    teacherIntro:
      'Aim the top of the sequence at a chord tone when the harmony moves. Instant “I meant that.”',
  },
  238: {
    hook: 'Sequences — stop on a good note.',
    teacherIntro:
      'Endings teach taste. Practice finishing as hard as you practice climbing.',
  },
  240: {
    hook: 'Economy picking seed — less motion, more line.',
    teacherIntro:
      'When two notes live on neighbor strings, let the pick continue its path. Smooth, not forced.',
  },
  245: {
    hook: 'Sequences — record and keep the best eight bars.',
    teacherIntro:
      'One honest take. Circle what worked. That is your vocabulary homework for the week.',
  },
  252: {
    hook: 'Sequences — mix with space and bends.',
    teacherIntro:
      'Pattern alone gets old. Interrupt it with a held note or a bend so it sounds human.',
  },
  259: {
    hook: 'Lead week wrap — talk in full sentences.',
    teacherIntro:
      'Bring one motif, one bend target, and silence. That is a complete lead day.',
  },
  266: {
    hook: 'Bridge day — the middle eight has a job.',
    teacherIntro:
      'Bridges contrast. Change texture, range, or rhythm so the chorus feels like home again.',
  },
  270: {
    hook: 'Dynamic architecture — soft and loud on purpose.',
    teacherIntro:
      'Map the volume of your song like a skyline. Play the shape, not just the chords.',
  },
  273: {
    hook: 'Chart cleanliness — future-you should read this.',
    teacherIntro:
      'Form labels, repeats, endings. Messy charts create messy takes. Five neat minutes now saves the set.',
  },
  280: {
    hook: 'Capo and key fit — serve the voice.',
    teacherIntro:
      'If the melody strains, move the key. Capo is a tool, not a cheat code.',
  },
  287: {
    hook: 'Performance stance — body is part of time.',
    teacherIntro:
      'Feet, shoulders, breath. We practice looking like we meant to start — because we did.',
  },
  290: {
    hook: 'Medley skills — glue without panic.',
    teacherIntro:
      'Two songs, one breath between. Plan the transition chord and tempo before you roll.',
  },
  294: {
    hook: 'Lyric cues — let words drive the guitar.',
    teacherIntro:
      'If there is a lyric, hit with the story. Guitar follows the sentence, not the other way around.',
  },
  301: {
    hook: 'Harmonic enrichment — add color without clutter.',
    teacherIntro:
      'One tasteful extension beats a jazz textbook dump. Hear it, then keep it only if the song smiles.',
  },
  308: {
    hook: 'Ballad space — leave room for the vocal.',
    teacherIntro:
      'Soft attack, fewer strums, longer rings. If you would not whisper there, do not fill it.',
  },
  310: {
    hook: 'Slow blues vehicle — feel over flash.',
    teacherIntro:
      'Long phrases, honest bends, patient time. Blues at this tempo tells on every fake note.',
  },
  315: {
    hook: 'Humanize off the click — after you can lock it.',
    teacherIntro:
      'Only lean once the pocket is trustworthy. We earn rubato; we do not start there.',
  },
  322: {
    hook: 'Phrase-by-phrase learning — no hero full-run yet.',
    teacherIntro:
      'Chunk the hard section. Link only after each chunk is boringly solid.',
  },
  329: {
    hook: 'Optional peer share — play for one kind human.',
    teacherIntro:
      'Nerves are normal. One short take for a friend teaches more than ten alone in the bedroom.',
  },
  336: {
    hook: 'Cold endings — button the last hit.',
    teacherIntro:
      'Endings are memorable. Practice stopping together with an imaginary band — clean, still, done.',
  },
  340: {
    hook: 'Stop-time section — hit, then silence.',
    teacherIntro:
      'Accent the hits, own the rests. Silence is the dramatic part.',
  },
  343: {
    hook: 'False ending fun — smile, then finish for real.',
    teacherIntro:
      'Fake the end once, catch the audience (even if it is you), then land the true button.',
  },
  357: {
    hook: 'Three-song mini set — stamina with taste.',
    teacherIntro:
      'Order the set so your hands and ears survive. Song two is where focus usually dips — watch it.',
  },
  360: {
    hook: 'Dress rehearsal energy — pretend it counts.',
    teacherIntro:
      'Full pre-show pass: tune, breath, count-in, play, finish. No mid-song do-overs.',
  },
  364: {
    hook: 'Capstone rehearsal — full story, kind notes after.',
    teacherIntro:
      'Run the arc top to bottom. Recover in character. Write three notes after — then rest.',
  },
  365: {
    hook: 'Day 365 — play a set that sounds like you.',
    teacherIntro:
      'Celebration, not a jury. Mini-set, honest take, then jot what you want next month.',
    encouragement: 'You finished a year-shaped path. That matters as much as any lick.',
    funBonus: 'Put the first practice of the next 30 days on your calendar before you put the guitar down.',
  },
  2: {
    hook: 'Day two — pressure without panic.',
    teacherIntro:
      'Yesterday was names and open strings. Today we add fretting pressure gently — buzz is information, not failure.',
  },
  4: {
    hook: 'G major — three fingers, one clear win.',
    teacherIntro:
      'We build G slowly so every string rings. No racing the shape; clean beats fast forever.',
  },
  5: {
    hook: 'C shape — the careful chord.',
    teacherIntro:
      'C asks for neat fretting and a quiet low E. We will go slow enough that neat becomes normal.',
  },
  6: {
    hook: 'D and the first three-chord loop.',
    teacherIntro:
      'G, C, and D are a campfire engine. Today we make the loop musical, not just correct.',
  },
  8: {
    hook: 'Am and E — minor color, same family skills.',
    teacherIntro:
      'New shapes, same honesty: freeze, audit strings, then change only as fast as clean.',
  },
  15: {
    hook: 'Isolation day — hard changes get their own gym.',
    teacherIntro:
      'We will not hide sticky changes inside full songs yet. Two chords, honest time, lots of kindness.',
  },
  45: {
    hook: 'CAGED peek — a map, not a mountain.',
    teacherIntro:
      'You do not need all five shapes today. See one neighborhood on the neck and breathe.',
  },
  55: {
    hook: 'Voicing choices — same chord, different story.',
    teacherIntro:
      'Where you play a chord changes the mood. We listen more than we stretch today.',
  },
  65: {
    hook: 'Record once — ears over ego.',
    teacherIntro:
      'One take, one listen, one fix. That loop teaches faster than ten ignored recordings.',
  },
  85: {
    hook: 'Dorian color — minor with a raised smile.',
    teacherIntro:
      'Hear the raised sixth against plain minor. One note changes the weather.',
  },
  95: {
    hook: 'Mode mood — name the feeling out loud.',
    teacherIntro:
      'If you cannot say bright, dark, or floaty, play slower until the color is obvious.',
  },
  115: {
    hook: 'Riff extraction — keep the accident.',
    teacherIntro:
      'When something cool falls out of your hands, freeze it, end it, and own it.',
  },
  125: {
    hook: 'Subdivision trust — the grid under the groove.',
    teacherIntro:
      'We lock smaller slices of the beat so bigger grooves stop drifting.',
  },
  135: {
    hook: 'Push and pull — human time on purpose.',
    teacherIntro:
      'Ahead and behind only count if the center still exists. Find center first.',
  },
  145: {
    hook: 'One pattern, no drift — pocket gym.',
    teacherIntro:
      'Eight bars identical on purpose. Boredom is the teacher of groove.',
  },
  155: {
    hook: 'Click in the room — honest judge day.',
    teacherIntro:
      'Audible metronome, foot locked, one marked fix after. That is a real checkpoint.',
  },
  165: {
    hook: 'Odd meter taste — count without fear.',
    teacherIntro:
      'We go slow enough that five feels like a walk, not a math test.',
  },
  185: {
    hook: 'Motif first — lead without a note salad.',
    teacherIntro:
      'Four notes you can sing beat twenty you cannot remember. Build from the motif.',
  },
  195: {
    hook: 'Blues language — call, wait, answer.',
    teacherIntro:
      'Leave space like a singer. The rest is part of the lick.',
  },
  205: {
    hook: 'Double stops — two notes, one intention.',
    teacherIntro:
      'Match volume and timing so the pair sounds like one voice.',
  },
  215: {
    hook: 'Hybrid again — thumb and pick as teammates.',
    teacherIntro:
      'Even volume between pick and fingers. If one yells, soften it.',
  },
  225: {
    hook: 'Andalusian color — let the cadence pull.',
    teacherIntro:
      'The chords already want to move. Add phrygian spice without fighting the pull.',
  },
  235: {
    hook: 'Economy picking — weak direction gets love.',
    teacherIntro:
      'Practice the sweep you avoid. Balance is the skill.',
  },
  255: {
    hook: 'Full-take hybrid — survive the whole form.',
    teacherIntro:
      'Loops lie. Today the technique has to live inside a real take.',
  },
  265: {
    hook: 'Chorus keep-take — record something kind.',
    teacherIntro:
      'One chorus you would replay. Not perfect — keepable.',
  },
  275: {
    hook: 'Arrangement ears — tone serves the section.',
    teacherIntro:
      'Brighter, darker, or cleaner: pick the tone that makes the form obvious.',
  },
  285: {
    hook: 'Kind listenback — one pencil mark only.',
    teacherIntro:
      'Shame off, specificity on. Fix the one thing that matters most.',
  },
  295: {
    hook: 'Count-in ritual — starts are performances.',
    teacherIntro:
      'Ten clean beginnings beat one heroic middle. Own the first bar.',
  },
  305: {
    hook: 'Simplify to strengthen — less is a feature.',
    teacherIntro:
      'Strip ornaments until the song stands. Then add back only what earns its place.',
  },
  325: {
    hook: 'Chunk boundaries — glue the seams.',
    teacherIntro:
      'Hard parts get context bars on both sides so the join stops surprising you.',
  },
  335: {
    hook: 'Silence into downbeat — own the entrance.',
    teacherIntro:
      'From nothing to sound without a flinch. That calm is stage skill.',
  },
  345: {
    hook: 'Journal one action — ignore the rest.',
    teacherIntro:
      'A single next step beats a guilt list. Circle it and do ten minutes.',
  },
  355: {
    hook: 'Bow and exit — finish like you meant it.',
    teacherIntro:
      'Practice the last look and the quiet after the last chord. Endings are part of the show.',
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
  const dayCoach = sessionCoachFor(day)
  const warm = warmupFor(phase, day, seed, dayCoach)
  const teach = teachBlock(phase, seed, day, dayCoach)
  const guided = guidedBlock(seed, day, dayCoach)
  const jam = jamBlock(phase, seed, day, dayCoach)
  const cool = cooldownBlock(seed, dayCoach)
  const gold = GOLD[day]

  // Unique per day without title-paste chrome in goals/drills — casual topic tag only.
  const hook =
    gold?.hook ??
    `${pick(PHASE_HOOKS[phase], day)} ${seed.title.includes('—') ? seed.title.split('—').slice(1).join('—').trim() : seed.title}.`
  const teacherIntro =
    gold?.teacherIntro ??
    `About ${durationMin} minutes together. Warm up, learn one clear thing, then play something that feels like music. First win: ${seed.goals[0] ?? 'stay relaxed and in time'}.`

  const segments: LessonSegment[] = [
    {
      id: 'arrive',
      name: 'Arrive & set intention',
      minutes: plan.arrive,
      coach: dayCoach?.arrive ?? pick(ARRIVE_LINES, day),
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
      tip: '8/10 clean reps → nudge tempo a little. If form slips, stay put.',
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
