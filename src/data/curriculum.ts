import type { SkillLevel } from './library'
import {
  expandPrivateLesson,
  type PrivateLessonFields,
} from './lessonExpand'

export type LessonPhase =
  | 'basics'
  | 'chords'
  | 'scales'
  | 'rhythm'
  | 'lead'
  | 'repertoire'

export interface Lesson {
  day: number
  title: string
  phase: LessonPhase
  skill: SkillLevel
  durationMin: number
  goals: string[]
  theoryBite: string
  drills: string[]
  libraryIds: string[]
  masteryCheck: string
  /** ~30 min private-lesson expansion (teacher voice + timed segments) */
  privateLesson: PrivateLessonFields
}

/**
 * Phase map — easy path (early music before abstract overload):
 * early music (chords/songs) before abstract scales overload;
 * rhythm as its own craft; lead as speech; repertoire consolidates.
 * Boundaries align with lesson titles (rhythm begins day 121).
 */
const PHASE_DAYS: { phase: LessonPhase; start: number; end: number }[] = [
  { phase: 'basics', start: 1, end: 30 },
  { phase: 'chords', start: 31, end: 75 },
  { phase: 'scales', start: 76, end: 120 },
  { phase: 'rhythm', start: 121, end: 180 },
  { phase: 'lead', start: 181, end: 260 },
  { phase: 'repertoire', start: 261, end: 365 },
]

function phaseForDay(day: number): LessonPhase {
  for (const p of PHASE_DAYS) {
    if (day >= p.start && day <= p.end) return p.phase
  }
  return 'repertoire'
}

function skillForDay(day: number): SkillLevel {
  if (day <= 60) return 'beginner'
  if (day <= 200) return 'intermediate'
  return 'advanced'
}

/** Hand-authored / generated unique seeds for all 365 days — one clear win each day. */
type DeepLessonSeed = Omit<Lesson, 'day' | 'phase' | 'skill' | 'privateLesson'> & {
  privateLesson?: PrivateLessonFields
}

const DEEP_LESSONS: Record<number, DeepLessonSeed> = {
  1: {

    title: 'Meet the Guitar — First Clean Sounds',
    durationMin: 25,
    goals: [
      'Sit so your shoulders can stay loose',
      'Name the open strings low to high: E A D G B E',
      'Get all six open strings to ring without buzz'
    ],
    theoryBite: 'Thick to thin, standard tuning is E A D G B E. Saying the names out loud while you pluck trains your ear for free.',
    drills: [
      'Get comfortable: guitar on your leg, fretting thumb behind the neck',
      'Pluck open strings low to high and say each name',
      'Hold each open string about two seconds — if it dies early, pluck again softer and cleaner'
    ],
    libraryIds: [
      'rf-spider'
    ],
    masteryCheck: 'Name and pluck all six open strings in order without peeking at the headstock.',
  },
  2: {

    title: 'Fretting Hand — Just Enough Pressure',
    durationMin: 25,
    goals: [
      'Fret with fingertips, right behind the metal fret',
      'Use the lightest press that still sounds clean',
      'Play frets 1–4 on the high E evenly'
    ],
    theoryBite: 'One fret is one half-step. Press just behind the fret wire — middle of the box makes you squeeze harder for a worse sound.',
    drills: [
      'Slow spider 1-2-3-4 on the high E around 50 BPM — stop and fix buzz before you add speed',
      'Buzz-then-add: ease off until it buzzes, then add a hair of pressure',
      'Quick mirror check — curved knuckles, wrist not collapsed'
    ],
    libraryIds: [
      'rf-spider'
    ],
    masteryCheck: 'Play frets 1–4 on the high E evenly at 60 BPM with clear tone.',
  },
  3: {

    title: 'First Chord Win — E Minor',
    durationMin: 25,
    goals: [
      'Build open Em with two fingers',
      'Strum all six strings on the beat',
      'Lift Em off and put it back ten times cleanly'
    ],
    theoryBite: 'E minor is the notes E G B. Open Em: middle finger on A string fret 2, ring on D string fret 2. Easiest full-sounding chord — we start here on purpose.',
    drills: [
      'Build Em, count to four, release — do that ten times',
      'Down-strums on beats 1 and 3 only — name what you hear on the clean reps',
      'String audit: pluck each string alone and fix anything dead'
    ],
    libraryIds: [
      'ch-em'
    ],
    masteryCheck: 'Hold Em for eight steady down-strums with every string ringing.',
  },
  4: {

    title: 'Second Chord — G Major + First Change',
    durationMin: 25,
    goals: [
      'Form a clear open G',
      'Strum from the low E string',
      'Change Em to G in slow motion'
    ],
    theoryBite: 'G major is G B D. Single shapes are nice; smooth changes are the real beginner skill. Keep shoulders soft; clean and slow today becomes easy later.',
    drills: [
      'Build G one finger at a time, then strum — fix buzz before speed',
      'Em | G at about 50 BPM, two bars each — name what you hear on the clean reps',
      'Keep the strum arm moving while your fretting hand switches'
    ],
    libraryIds: [
      'ch-g',
      'ch-em'
    ],
    masteryCheck: 'Complete four clean Em→G changes in 30 seconds. Do it twice so it was not a lucky fluke.',
  },
  5: {

    title: 'C Major — Five-String Clarity',
    durationMin: 25,
    goals: [
      'Form open C without choking the B or G strings',
      'Skip accidental bangs on the low E',
      'Connect C with G'
    ],
    theoryBite: 'C major is C E G. Open C frets A3, D2, B1. Leaving the low E out is normal — not a mistake. Keep shoulders soft; clean and slow today becomes easy later.',
    drills: [
      'Place C, then pluck strings 5 down to 1 one at a time',
      'G–C–G–C at a walking tempo until both shapes ring clean',
      'Thumb mid-neck — don’t strangle the top of the neck'
    ],
    libraryIds: [
      'ch-c',
      'ch-g'
    ],
    masteryCheck: 'Play C with five clear strings and no unwanted low-E bang.',
  },
  6: {

    title: 'D Major — Triangle + Campfire Set',
    durationMin: 25,
    goals: [
      'Form the open D triangle',
      'Strum only strings 4–1',
      'Loop G–C–D like a real song bit'
    ],
    theoryBite: 'D major is D F# A. It’s a top-four-string chord — missing the low strings is correct. Keep shoulders soft; clean and slow today becomes easy later.',
    drills: [
      'Freeze the D triangle cleanly for ten full seconds',
      'G–C–D–G loop four times — only bump tempo after every change rings',
      'Soft down-up strums on D only until every string speaks kindly'
    ],
    libraryIds: [
      'ch-d',
      'ch-g',
      'ch-c'
    ],
    masteryCheck: 'Play the G–C–D progression twice without stopping.',
  },
  7: {

    title: 'Week 1 Jam — Em G C D Music',
    durationMin: 35,
    goals: [
      'Treat Em G C D as one little vocabulary',
      'Lock a slow metronome pulse',
      'Record about 60 seconds of honest playing'
    ],
    theoryBite: 'In the key of G: G is I, C is IV, D is V, Em is vi. Four chords unlock a ton of songs — play them today, don’t just name them.',
    drills: [
      'Four bars on each chord at 70 BPM — stop and fix buzz before you add speed',
      'Two minutes of continuous changes — keep the arm moving if you flub',
      'Phone-record one kind take; listen once without cringing'
    ],
    libraryIds: [
      'ch-em',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'Play two continuous minutes moving among Em, G, C, and D in time.',
  },
  8: {

    title: 'A Minor & E Major — Shape Family',
    durationMin: 30,
    goals: [
      'Add clear Am and E shapes',
      'Notice how the shapes are cousins',
      'Color a loop Am–E–Am–E'
    ],
    theoryBite: 'Am is the relative minor of C. Shared shape families mean less to memorize — your hand already knows half the job.',
    drills: [
      'See Am as Em slid toward the floor — stop and fix buzz before you add speed',
      'Am–E changes at 60 BPM until both shapes land without a scramble',
      'Loop C–Am–E–Am four times and notice the mood shift'
    ],
    libraryIds: [
      'ch-am',
      'ch-e'
    ],
    masteryCheck: 'Eight clean strums each on Am and E with no dead notes.',
  },
  9: {

    title: 'Strum Patterns — Downs, Ups, and &s',
    durationMin: 30,
    goals: [
      'Land downstrokes on the numbered beats',
      'Put upstrokes on the & counts',
      'Run D-DU-D-DU over G–C–D'
    ],
    theoryBite: 'Count 1 & 2 & 3 & 4 &. Your right hand is the drummer; the fretting hand just changes costumes. Keep shoulders soft; clean and slow today becomes easy later.',
    drills: [
      'Muted D-D-D-D strums for 60 seconds — right hand only, loose',
      'D-DU-D-DU on G for 8 bars with the foot locked to the pulse',
      'Ghost strums: miss the strings on purpose for groove'
    ],
    libraryIds: [
      'ch-d',
      'sg-fr-re-jacques'
    ],
    masteryCheck: 'Play D-DU-D-DU on G for 8 bars without losing the count.',
  },
  10: {

    title: 'A Major — A–D–E Starter Set',
    durationMin: 30,
    goals: [
      'Form open A cleanly',
      'Loop A–D–E with steady time',
      'Toggle A vs Am so you hear the third'
    ],
    theoryBite: 'A major is A C# E. It’s a gateway to blues and rock in A. Often one finger is all that separates major from minor color.',
    drills: [
      'Freeze A and audit string by string — stop and fix buzz before you add speed',
      'A–D–E–A twice at a walking pace — mute the open strings you do not want',
      'Toggle A vs Am on a steady beat — hear major brighten and minor soften'
    ],
    libraryIds: [
      'ch-a',
      'sg-go-tell-aunt-rhody'
    ],
    masteryCheck: 'Play two full A–D–E loops with steady time. Do it twice so it was not a lucky fluke.',
  },
  11: {

    title: 'Minor Pentatonic Box 1 — First Lead Map',
    durationMin: 30,
    goals: [
      'Find the A root for box 1 on the low E string at fret 5',
      'Walk the box up and down slowly with a pulse',
      'Improvise for one minute using only three notes from the box'
    ],
    theoryBite: 'After a week of chords, five notes are enough for first lead. A minor pentatonic is A C D E G. Box 1 (root on low-E fret 5) is the common rock/blues map — fewer notes means more room for rhythm and space, which is how solos start sounding like music.',
    drills: [
      'Pulse the fret-5 root on beat 1 for 30 seconds before leaving it',
      'Ascend box 1, rest one full bar, then descend — keep the foot tapping',
      'Three-note solo rule: pick any three box notes and make rhythm do the work for 60 seconds'
    ],
    libraryIds: [
      'sc-pent-min',
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Play box 1 up and down in time at ~60 BPM and land on the A root.',
  },
  12: {

    title: 'First Melody — Twinkle in Open Position',
    durationMin: 30,
    goals: [
      'Learn the melody in short phrases',
      'Sing a phrase, then play it',
      'Connect phrases without panic stops'
    ],
    theoryBite: 'Melodies train ear and timing faster than empty shapes. Treat each phrase like a sentence — breathe between them. Singing a line before you play it is one of the fastest ways to stop guessing on the neck.',
    drills: [
      'Learn phrase 1 only until you can play it twice without stopping',
      'Call-and-response: sing the next phrase, then play it at the same speed',
      'One slow clean pass through the whole Twinkle melody with a steady foot pulse'
    ],
    libraryIds: [
      'sg-twinkle',
      'sg-ode'
    ],
    masteryCheck: 'Play Twinkle phrase-by-phrase with a steady pulse and no rushing.',
  },
  13: {

    title: 'Finger Independence — Spider Across Strings',
    durationMin: 30,
    goals: [
      'Run 1-2-3-4 moving from string to string',
      'Keep idle fingers soft',
      'Stay under tempo ego'
    ],
    theoryBite: 'Independence is coordination, not strength. Slow spiders wire clean fretting for every chord you’ll learn later.',
    drills: [
      'Spider on B and high E only — even volume, no flying fingers',
      'Add the G string only when the first two notes are already even',
      'Stop at the first real tension; shake out ten seconds'
    ],
    libraryIds: [
      'rf-spider'
    ],
    masteryCheck: 'Play a calm two-string spider for 60 seconds with even volume.',
  },
  14: {

    title: 'Power Chords Intro — Two-Finger Rock',
    durationMin: 35,
    goals: [
      'Fret a root + fifth power shape on the low strings',
      'Mute the strings you are not using',
      'Move the same grip up the neck in time'
    ],
    theoryBite: 'A power chord is root + fifth (often with the octave). No third means it is neither major nor minor — that is why it moves so easily and sounds tough. Learn the grip once; the neck becomes a map of roots.',
    drills: [
      'Build E5 (open low E + 2nd fret A), then the same shape at frets 3 and 5 — name the root each time',
      'Palm-mute eighth notes on one power chord for 60 seconds with a foot pulse',
      'Four-bar riff: two bars on frets 3/5, two bars on frets 5/7, then reverse — keep unused strings quiet'
    ],
    libraryIds: [
      'rf-power'
    ],
    masteryCheck: 'Play a four-bar power-chord riff twice with clear muting and steady time.',
  },
  15: {

    title: 'Switching Lab — Shrink the Motion',
    durationMin: 30,
    goals: [
      'Watch which fingers travel farthest',
      'Park shared fingers when you can',
      'Change G–C–D with smaller motions'
    ],
    theoryBite: 'Economy of motion beats raw finger speed. Watch the shortest path between G, C, and D — shared fingers and small lifts are the real beginner skill, not slamming shapes from scratch every time.',
    drills: [
      'G→C only for two minutes at ~50 BPM — fretting hand arrives early, strum arm stays lazy',
      'C→D only for two minutes — plant the D triangle before you leave C',
      'Full G–C–D–G loop; watch one change and shrink the biggest motion you see'
    ],
    libraryIds: [
      'ch-g',
      'ch-c',
      'ch-d',
      'pr-145'
    ],
    masteryCheck: 'Make eight G–C–D changes where each landing is clean on beat 1.',
  },
  16: {

    title: 'Ode to Joy Motif — Melody Meets Chords',
    durationMin: 30,
    goals: [
      'Learn the opening motif cleanly',
      'Alternate the motif with a C or G chord',
      'Keep the tempo humble'
    ],
    theoryBite: 'A single-note theme over open chords builds the lead-and-rhythm brain without drowning you in theory.',
    drills: [
      'Play the motif only, four times, before expanding',
      'Motif | C chord | motif | G chord — name what you hear on the clean reps',
      'Soft question, fuller answer — light dynamics — shoulders down, thumb behind the neck'
    ],
    libraryIds: [
      'sg-twinkle',
      'sg-ode'
    ],
    masteryCheck: 'Play the Ode motif twice and answer each time with a clean open chord.',
  },
  17: {

    title: 'Rhythm Guitar Feel — Pocket Over Speed',
    durationMin: 30,
    goals: [
      'Foot taps quarters the whole drill',
      'Strum arm keeps moving even when you miss a change',
      'Prefer pocket at 70 BPM over chaos at 100'
    ],
    theoryBite: 'Listeners feel time before they notice fancy chords. Pocket means your notes agree with the pulse. Keep shoulders soft; clean and slow today becomes easy later.',
    drills: [
      'Foot-only quarters for 30 seconds — stop and fix buzz before you add speed',
      'Muted groove for one minute — right hand stays in time, left hand mutes',
      'G–C–D with the foot locked; restart the bar if the foot rushes'
    ],
    libraryIds: [
      'ch-d',
      'sg-ode'
    ],
    masteryCheck: 'Two minutes of chord changes where your foot never stops the pulse.',
  },
  18: {

    title: 'D Minor & Mood — Major vs Minor Ears',
    durationMin: 30,
    goals: [
      'Form clear open Dm',
      'Toggle D major vs D minor',
      'Play a tiny sad loop Dm–C–G'
    ],
    theoryBite: 'Minor lowers the third — F instead of F# in D. Your ear learns faster when you A/B the colors on purpose.',
    drills: [
      'Pluck Dm string-by-string and fix dead notes — stop and fix buzz before you add speed',
      'D | Dm | D | Dm — feel the one-finger shift, no rush between colors',
      'Loop Dm–C–G–G four times with even strums — shoulders down, thumb behind the neck'
    ],
    libraryIds: [
      'ch-dm',
      'ch-d'
    ],
    masteryCheck: 'Show D vs Dm clearly, then play one clean Dm–C–G loop.',
  },
  19: {

    title: 'Seventh Color — G7 and D7 as Magnets',
    durationMin: 30,
    goals: [
      'Form G7 and D7',
      'Feel how V7 pulls toward I',
      'Use G7→C and D7→G resolutions'
    ],
    theoryBite: 'A dominant 7th (1–3–5–b7) creates tension that wants the home chord. Folk and blues live on that pull.',
    drills: [
      'Freeze G7 for a bar, then resolve to C like a door closing',
      'Freeze D7 for a bar, then resolve to G — hear the pull home',
      'Loop G–G7–C four times and listen for the magnet'
    ],
    libraryIds: [
      'ch-g7',
      'ch-d7'
    ],
    masteryCheck: 'Play two clear V7→I resolutions: G7→C and D7→G. Do it twice so it was not a lucky fluke.',
  },
  20: {

    title: 'Simple Fingerstyle Seed — Thumb + i',
    durationMin: 30,
    goals: [
      'Thumb plays bass on beat 1',
      'Index answers on a higher string',
      'Keep the pattern boringly steady'
    ],
    theoryBite: 'Travis-style seeds start with thumb independence. A steady bass makes sparse treble sound pro. Keep shoulders soft; clean and slow today becomes easy later.',
    drills: [
      'Thumb on open A only for one minute — stop and fix buzz before you add speed',
      'Add index on the B string on the &s — name what you hear on the clean reps',
      'Run the pattern over an Am shape for 8 bars — shoulders down, thumb behind the neck'
    ],
    libraryIds: [
      'sg-row-row-row-your-boat'
    ],
    masteryCheck: 'Play 8 bars of thumb-bass + index answer without rushing.',
  },
  21: {

    title: 'Barre Preview — One-Finger Mini F',
    durationMin: 35,
    goals: [
      'Barre high E and B at fret 1 lightly',
      'Add more of the F shape only if it stays painless',
      'Stop at fatigue — tendons first'
    ],
    theoryBite: 'Full F barre is a milestone, not a day-one law. Mini shapes and patience beat forced pain. Keep shoulders soft; clean and slow today becomes easy later.',
    drills: [
      'One-finger barre chirps, ten times — stop and fix buzz before you add speed',
      'Fmaj7 (easy version) as an alternate win — name what you hear on the clean reps',
      'Shake out both hands every 30 seconds before tension sneaks in'
    ],
    libraryIds: [
      'sg-this-old-man'
    ],
    masteryCheck: 'Sound two clean treble strings under a light fret-1 barre ten times.',
  },
  22: {

    title: 'Ear Starter — Find Melodies You Hum',
    durationMin: 30,
    goals: [
      'Hum a 3-note idea',
      'Find it starting on open B or high E',
      'Repeat until fingers match your voice'
    ],
    theoryBite: 'Voice to fret is the shortest path to owning music. Wrong notes are clues, not crimes. Keep shoulders soft; clean and slow today becomes easy later.',
    drills: [
      'Hum a note, hunt it on the neck, check — five calm rounds',
      'Change the starting pitch once and hunt the new note cleanly',
      'Don’t write it down — trust your ears — shoulders down, thumb behind the neck'
    ],
    libraryIds: [
      'sg-she-ll-be-coming-round-the-mount'
    ],
    masteryCheck: 'Match a hummed 3-note idea on the guitar twice in a row.',
  },
  23: {

    title: 'Dynamics — Soft Verse, Bigger Chorus',
    durationMin: 30,
    goals: [
      'Play the same progression at two volumes',
      'Change volume with the right hand, not a death grip',
      'Make a 16-bar mini arrangement'
    ],
    theoryBite: 'Expression is mostly right hand. Same chords, different story — instant “oh, that sounds like a song” upgrade.',
    drills: [
      'G–C–D at whisper volume with locked time — stop and fix buzz before you add speed',
      'Same progression at conversation level — name what you hear on the clean reps',
      'Eight soft bars, then eight fuller bars — shoulders down, thumb behind the neck'
    ],
    libraryIds: [
      'sg-drums'
    ],
    masteryCheck: 'Play 16 bars with a soft-to-louder lift someone else could notice.',
  },
  24: {

    title: 'Mute Craft — Left and Right Hand Silence',
    durationMin: 30,
    goals: [
      'Palm mute near the bridge',
      'Mute idle strings with the fretting hand',
      'Play rest strokes on purpose'
    ],
    theoryBite: 'Great rhythm guitar is half silence. Mutes turn strums into drums — practice the quiet as hard as the hit.',
    drills: [
      'Palm-muted open low-E eighths near the bridge — stop and fix buzz before you add speed',
      'Chuck lightly on the &s between chord hits — groove, not noise',
      'Full stop rests for one bar in every four — shoulders down, thumb behind the neck'
    ],
    libraryIds: [
      'sg-camptown-races'
    ],
    masteryCheck: 'Play 8 bars where mutes and rings are obviously on purpose.',
  },
  25: {

    title: 'Song Sketch — Combine Melody + Two Chords',
    durationMin: 30,
    goals: [
      'Pick a 4-note melody cell',
      'Answer it with Em or G',
      'Loop it as a tiny original'
    ],
    theoryBite: 'Making something tiny of your own locks skills better than drills alone. Small songs beat perfect exercises.',
    drills: [
      'Build a cell on the high strings — stop and fix buzz before you add speed',
      'Cell | Em | cell | G — leave a breath before each chord so the cell stays clear',
      'Say the sketch’s name out loud — silly names welcome'
    ],
    libraryIds: [
      'sg-twinkle',
      'sg-ode'
    ],
    masteryCheck: 'Perform your 4-bar sketch twice from memory. Do it twice so it was not a lucky fluke.',
  },
  26: {

    title: 'Timing Honesty — Metronome as Friend',
    durationMin: 30,
    goals: [
      'Play only on beat 1 of each bar for one minute',
      'Add more beats only when that feels solid',
      'Notice when you rush the easy bars'
    ],
    theoryBite: 'A metronome tells the truth kindly. Landing late or early is just data for the next rep. Keep shoulders soft; clean and slow today becomes easy later.',
    drills: [
      'Chord hits on beat 1 only for 8 bars — silence is part of the groove',
      'Hits on 1 and 3 for 8 bars; keep 2 and 4 empty on purpose',
      'Full quarters at 65 BPM with the click — every downstroke the same weight'
    ],
    libraryIds: [
      'sg-fr-re-jacques'
    ],
    masteryCheck: 'Stay with the click for 90 seconds of simple chord hits.',
  },
  27: {

    title: 'Review Web — Weakest Chord Rescue',
    durationMin: 30,
    goals: [
      'Name your messiest shape honestly',
      'Give it five focused minutes alone',
      'Drop it back into a progression'
    ],
    theoryBite: 'Fixing the weak link beats replaying what already feels good. One rescue per session adds up fast. Keep shoulders soft; clean and slow today becomes easy later.',
    drills: [
      'Rank Em G C D A Am E from cleanest to messiest — stop and fix buzz before you add speed',
      'Ugly-chord gym for five minutes — freeze shapes, then release',
      'Progression with the ugly chord on every bar 2 — shoulders down, thumb behind the neck'
    ],
    libraryIds: [
      'ch-am',
      'sg-go-tell-aunt-rhody'
    ],
    masteryCheck: 'Name your weakest chord and show ten cleaner frets of it than your usual rush job.',
  },
  28: {

    title: 'Blues Tease — E7 A7 Shuffle Feel',
    durationMin: 35,
    goals: [
      'Form E7 and A7',
      'Try a two-bar shuffle strum',
      'Keep it greasy, not fast'
    ],
    theoryBite: 'Dominant chords plus a long-short shuffle feel = instant blues flavor, even before a full 12-bar form.',
    drills: [
      'E7 for four bars, A7 for two, back again — stop and fix buzz before you add speed',
      'Long-short shuffle strum attempt — name what you hear on the clean reps',
      'Smile — feel over perfection today — shoulders down, thumb behind the neck'
    ],
    libraryIds: [
      'ch-e7',
      'ch-a7'
    ],
    masteryCheck: 'Play a slow E7/A7 groove that feels like one full blues chorus.',
  },
  29: {

    title: 'Comfort Setup — Pain Flags and Breaks',
    durationMin: 30,
    goals: [
      'Check thumb and wrist for strain signs',
      'Take a 30-second break every five minutes',
      'Fix strap or seat before you push hard'
    ],
    theoryBite: 'There’s no badge for pain. The only technique that reaches day 365 is the one you can still do next week.',
    drills: [
      'Run a quick posture checklist: thumb, wrist, shoulders, breath',
      'Play four minutes, break thirty seconds, repeat — name what you hear on the clean reps',
      'Note any hand hotspots in your phone so you do not ignore pain'
    ],
    libraryIds: [
      'sg-amazing-grace'
    ],
    masteryCheck: 'Finish today’s playing without pushing through sharp pain.',
  },
  30: {

    title: 'Basics Capstone — 3-Minute Campfire Set',
    durationMin: 30,
    goals: [
      'Medley: a progression, a tiny melody, a groove',
      'Recover from one intentional mistake',
      'End on a held final chord'
    ],
    theoryBite: 'Performance is a skill: start, keep going, recover, end. Today proves you can transfer the month — not recite trivia.',
    drills: [
      'Jot a three-minute order on paper — stop and fix buzz before you add speed',
      'Full run with no stops — restart only after the end',
      'Second run with soft and loud sections — shoulders down, thumb behind the neck'
    ],
    libraryIds: [
      'rf-spider',
      'sg-twinkle'
    ],
    masteryCheck: 'Deliver about three minutes using at least three chords and one melodic idea.',
  },
  31: {

    title: 'Chord Phase Open — Clean Changes First',
    durationMin: 30,
    goals: [
      'Name what “clean change” means for you today',
      'Keep G, C, D, and Em in the rotation without panic speed',
      'Leave with one pair of chords that improved'
    ],
    theoryBite: 'This phase is about changes that ring, not a bigger chord dictionary. Slow accurate reps beat fast sloppy ones. We keep working G, C, D, and Em — the campfire set — until switches feel boring in a good way.',
    drills: [
      'Pick your two easiest open chords and change only on beat 1 for two minutes',
      'Same pair with a metronome under 70 BPM — if buzz appears, slow down again',
      'Record 30 seconds; listen once for timing, once for muted strings'
    ],
    libraryIds: [
      'pr-145',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'Two minutes of one chord pair where most downbeats ring clean at a humble tempo.',
  },
  32: {

    title: 'G–C Highway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean G on beat 1',
      'Land clean C on beat 1',
      'Keep the right hand pulsing through the switch'
    ],
    theoryBite: 'Shared notes and a short path make G–C a high-ROI first highway. Practice the change as its own song: two chords, honest time, fretting hand arrives early, strum arm never freezes.',
    drills: [
      'Freeze G and strum eight even downstrokes — fix buzz before you move',
      'G→C in half notes ×16 — left hand early, right hand lazy and steady',
      'Four-bar groove using only G and C; smile if it is slow and clean'
    ],
    libraryIds: [
      'ch-g',
      'ch-c',
      'pr-145'
    ],
    masteryCheck: 'Sixteen controlled G→C changes with clear downbeats.',
  },
  33: {

    title: 'C–D Highway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean C on beat 1',
      'Land clean D on beat 1',
      'Keep the right hand pulsing through the switch'
    ],
    theoryBite: 'C to D is a shape jump — plant D’s triangle early so beat 1 is not a surprise. Practice the change as its own song: two chords, honest time, fretting hand arrives early, strum arm never freezes.',
    drills: [
      'Freeze C and strum eight even downstrokes — fix buzz before you move',
      'C→D in half notes ×16 — left hand early, right hand lazy and steady',
      'Four-bar groove using only C and D; smile if it is slow and clean'
    ],
    libraryIds: [
      'ch-c',
      'ch-d',
      'pr-145'
    ],
    masteryCheck: 'Sixteen controlled C→D changes with clear downbeats.',
  },
  34: {

    title: 'D–Em Highway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean D on beat 1',
      'Land clean Em on beat 1',
      'Keep the right hand pulsing through the switch'
    ],
    theoryBite: 'D to Em flips mood; keep the right hand boring so the left hand can be accurate. Practice the change as its own song: two chords, honest time, fretting hand arrives early, strum arm never freezes.',
    drills: [
      'Freeze D and strum eight even downstrokes — fix buzz before you move',
      'D→Em in half notes ×16 — left hand early, right hand lazy and steady',
      'Four-bar groove using only D and Em; smile if it is slow and clean'
    ],
    libraryIds: [
      'ch-d',
      'ch-em',
      'pr-145'
    ],
    masteryCheck: 'Sixteen controlled D→Em changes with clear downbeats.',
  },
  35: {

    title: 'Em–Am Highway — Change Lab',
    durationMin: 35,
    goals: [
      'Land clean Em on beat 1',
      'Land clean Am on beat 1',
      'Keep the right hand pulsing through the switch'
    ],
    theoryBite: 'Em–Am are kin shapes — notice what can stay close to the string. Practice the change as its own song: two chords, honest time, fretting hand arrives early, strum arm never freezes.',
    drills: [
      'Freeze Em and strum eight even downstrokes — fix buzz before you move',
      'Em→Am in half notes ×16 — left hand early, right hand lazy and steady',
      'Four-bar groove using only Em and Am; smile if it is slow and clean'
    ],
    libraryIds: [
      'ch-em',
      'ch-am',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled Em→Am changes with clear downbeats.',
  },
  36: {

    title: 'Am–E Highway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean Am on beat 1',
      'Land clean E on beat 1',
      'Keep the right hand pulsing through the switch'
    ],
    theoryBite: 'Am to E is drama in two grips; leave a hair of air if you need it, but keep the pulse. Practice the change as its own song: two chords, honest time, fretting hand arrives early, strum arm never freezes.',
    drills: [
      'Freeze Am and strum eight even downstrokes — fix buzz before you move',
      'Am→E in half notes ×16 — left hand early, right hand lazy and steady',
      'Four-bar groove using only Am and E; smile if it is slow and clean'
    ],
    libraryIds: [
      'ch-am',
      'ch-e',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled Am→E changes with clear downbeats.',
  },
  37: {

    title: 'E–A Highway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean E on beat 1',
      'Land clean A on beat 1',
      'Keep the right hand pulsing through the switch'
    ],
    theoryBite: 'E–A is a rock gate on the neck — roots move, grip logic stays related. Practice the change as its own song: two chords, honest time, fretting hand arrives early, strum arm never freezes.',
    drills: [
      'Freeze E and strum eight even downstrokes — fix buzz before you move',
      'E→A in half notes ×16 — left hand early, right hand lazy and steady',
      'Four-bar groove using only E and A; smile if it is slow and clean'
    ],
    libraryIds: [
      'ch-e',
      'ch-a',
      'pr-12bar'
    ],
    masteryCheck: 'Sixteen controlled E→A changes with clear downbeats.',
  },
  38: {

    title: 'A–D Highway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean A on beat 1',
      'Land clean D on beat 1',
      'Keep the right hand pulsing through the switch'
    ],
    theoryBite: 'A to D should feel like a bright lift; mute strings that do not belong in D. Practice the change as its own song: two chords, honest time, fretting hand arrives early, strum arm never freezes.',
    drills: [
      'Freeze A and strum eight even downstrokes — fix buzz before you move',
      'A→D in half notes ×16 — left hand early, right hand lazy and steady',
      'Four-bar groove using only A and D; smile if it is slow and clean'
    ],
    libraryIds: [
      'ch-a',
      'ch-d',
      'pr-12bar'
    ],
    masteryCheck: 'Sixteen controlled A→D changes with clear downbeats.',
  },
  39: {

    title: 'G–Em Highway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean G on beat 1',
      'Land clean Em on beat 1',
      'Keep the right hand pulsing through the switch'
    ],
    theoryBite: 'G–Em softens major to minor with a small story change — hear it, do not rush it. Practice the change as its own song: two chords, honest time, fretting hand arrives early, strum arm never freezes.',
    drills: [
      'Freeze G and strum eight even downstrokes — fix buzz before you move',
      'G→Em in half notes ×16 — left hand early, right hand lazy and steady',
      'Four-bar groove using only G and Em; smile if it is slow and clean'
    ],
    libraryIds: [
      'ch-g',
      'ch-em',
      'pr-145'
    ],
    masteryCheck: 'Sixteen controlled G→Em changes with clear downbeats.',
  },
  40: {

    title: 'C–Am Highway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean C on beat 1',
      'Land clean Am on beat 1',
      'Keep the right hand pulsing through the switch'
    ],
    theoryBite: 'C and Am are relatives — same neighborhood of notes, different home base. Practice the change as its own song: two chords, honest time, fretting hand arrives early, strum arm never freezes.',
    drills: [
      'Freeze C and strum eight even downstrokes — fix buzz before you move',
      'C→Am in half notes ×16 — left hand early, right hand lazy and steady',
      'Four-bar groove using only C and Am; smile if it is slow and clean'
    ],
    libraryIds: [
      'ch-c',
      'ch-am',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled C→Am changes with clear downbeats.',
  },
  41: {

    title: 'G–D Highway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean G on beat 1',
      'Land clean D on beat 1',
      'Keep the right hand pulsing through the switch'
    ],
    theoryBite: 'G–D is anthem fuel; big open strings still need quiet unused noise. Practice the change as its own song: two chords, honest time, fretting hand arrives early, strum arm never freezes.',
    drills: [
      'Freeze G and strum eight even downstrokes — fix buzz before you move',
      'G→D in half notes ×16 — left hand early, right hand lazy and steady',
      'Four-bar groove using only G and D; smile if it is slow and clean'
    ],
    libraryIds: [
      'ch-g',
      'ch-d',
      'pr-145'
    ],
    masteryCheck: 'Sixteen controlled G→D changes with clear downbeats.',
  },
  42: {

    title: 'F Maj7 Gateway — Barre Without Tears',
    durationMin: 35,
    goals: [
      'Play an easy F-color grip that still functions as F in a progression',
      'String-audit until every intended string rings',
      'Use that F color inside C–Am–F–G without pain'
    ],
    theoryBite: 'Full F barre is a strength project. Fmaj7 or a mini-F gives you F function in songs with less compression — successive approximation. Clarity on a few strings beats six muffled ones every time.',
    drills: [
      'Build Fmaj7 or mini-F; pluck string-by-string and fix mutes before strumming',
      'C→F-color changes for two minutes — hear the quality land before you leave',
      'Loop C–Am–Fmaj7–G at ballad tempo, four beats each chord'
    ],
    libraryIds: [
      'ch-f',
      'ch-c',
      'ch-am',
      'pr-1645'
    ],
    masteryCheck: 'Play one clean C–Am–F-color–G chorus that stays pain-free and musical.',
  },
  43: {

    title: 'Full F Attempt — Strength + Mercy',
    durationMin: 30,
    goals: [
      'Roll the barre finger for even light pressure',
      'Get melody strings (high E/B) clear before chasing all six',
      'Cap the session before joint pain — mercy is part of technique'
    ],
    theoryBite: 'Barre strength is tissue adaptation over weeks, not one heroic squeeze. Roll the index slightly, bring the elbow forward a little, and prioritize high E and B first. Sharp joint pain means stop — tired muscle is different from injury.',
    drills: [
      'Barre chirps on fret 1: light press, release before burn — about one minute total work',
      'Hold full F for four slow strums, shake out, repeat up to five times',
      'Song loop: full F for one bar, Fmaj7 for the next — still counts as F function'
    ],
    libraryIds: [
      'ch-f',
      'pr-1645'
    ],
    masteryCheck: 'Produce four consecutive F strums where the melody strings speak clearly.',
  },
  44: {

    title: 'B Minor Barre — Am Shape Moved',
    durationMin: 30,
    goals: [
      'See Bm as Am shape at fret 2',
      'Barre fret 2 with calm wrist',
      'Bm–G–D–A modern loop'
    ],
    theoryBite: 'Movable minor shapes unlock the neck. Bm is the classic first barre minor after F struggles. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Air-shape Am then slide idea to fret 2 — fretting hand early, strum arm never freezes',
      'Bm string audit low to high — fix the first dead string before moving on',
      'Bm–G–D–A half-time groove until the barre stops choking the low strings'
    ],
    libraryIds: [
      'ch-am'
    ],
    masteryCheck: 'Play Bm clear enough for a two-bar loop into G. Tempo can be slow — clarity is the pass.',
  },
  45: {

    title: 'CAGED Peek — C Shape Home',
    durationMin: 30,
    goals: [
      'Spot open C as a CAGED anchor',
      'Play C major arpeggio from the shape',
      'Connect chord tones, not only strums'
    ],
    theoryBite: 'CAGED maps five chord shapes up the neck so the same chord can live in different neighborhoods. Today is just a peek at the C-shape home.',
    drills: [
      'Open C arpeggio — one note at a time until every string speaks',
      'Library CAGED C riff once slow, then once at song tempo',
      'Chord-tone ending on every phrase — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'pr-andalu'
    ],
    masteryCheck: 'Arpeggiate open C ascending and descending cleanly twice.',
  },
  46: {

    title: 'I–vi–IV–V Pop Engine in C',
    durationMin: 30,
    goals: [
      'Own C–Am–F–G order',
      'Two strums per chord then four',
      'Sing a nonsense melody over it'
    ],
    theoryBite: 'The 50s/pop progression is ear candy and change training in one. F may be Fmaj7. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Chord order chant while fretting — fretting hand early, strum arm never freezes',
      'Loop the drill at 72 BPM with a metronome click — string-audit once if anything thuds',
      'Melody doodle on the G string only for one minute — stay calm'
    ],
    libraryIds: [
      'pr-6251'
    ],
    masteryCheck: 'Play two full C–Am–F–G choruses without stopping. Tempo can be slow — clarity is the pass.',
  },
  47: {

    title: '12-Bar Blues Form — Count the Story',
    durationMin: 30,
    goals: [
      'Memorize 12-bar map in A',
      'Play A7 D7 E7 on the form',
      'Say bar numbers as you play once'
    ],
    theoryBite: 'Form memory is musicianship. 12-bar blues is a reusable story: home, away, home, turnaround. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Air-count 12 bars of form before you touch strings',
      'One chorus chords only — no fills, just even time and clear shapes',
      'Turnaround spotlight last 4 bars — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'pr-12bar',
      'ch-a7',
      'ch-d7',
      'ch-e7',
      'rf-blues-sh'
    ],
    masteryCheck: 'Play one full 12-bar chorus in A with correct chord changes.',
  },
  48: {

    title: 'Andalusian Color — Am G F E',
    durationMin: 30,
    goals: [
      'Walk Am–G–F–E slowly',
      'Feel E as dramatic dominant',
      'Optional: add a simple top-note color on E later if easy'
    ],
    theoryBite: 'Am–G–F–E is a centuries-old descent. The E major chord is the spicy door home to Am. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Hold two bars on each chord before changing — fretting hand early, strum arm never freezes',
      'Emphasize the bass note on beat 1, then lighter strums after',
      'Build soft to strong into the E chord arrival — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'pr-12bar'
    ],
    masteryCheck: 'Play two Andalusian cycles with a deliberate dramatic E.',
  },
  49: {

    title: 'Jazz Tease — ii–V–I in C',
    durationMin: 35,
    goals: [
      'Play Dm–G7–C',
      'Hear G7 pull to C',
      'Add Am before Dm for vi–ii–V–I'
    ],
    theoryBite: 'Ii–V–I is the backbone of countless standards. Small vocabulary, huge repertoire unlock. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Dm–G7–C at ballad tempo — let G7 pull toward C — fretting hand early, strum arm never freezes',
      'Loop Am–Dm–G7–C four times with steady time — string-audit once if anything thuds',
      'Light swing optional — if it rushes, go straight eighths instead'
    ],
    libraryIds: [
      'ch-am',
      'pr-1645'
    ],
    masteryCheck: 'Play four clean ii–V–I cadences in C. Tempo can be slow — clarity is the pass.',
  },
  50: {

    title: 'Slash Ideas — Bass Motion Without New Shapes',
    durationMin: 30,
    goals: [
      'Alternate G and G/B feeling via bass focus',
      'Walk bass open strings under static shapes when possible',
      'Keep treble calm while bass moves'
    ],
    theoryBite: 'Bass motion sells a progression. Even simple open-string bass changes make campfire chords cinematic.',
    drills: [
      'G with low B emphasis if fretted — fretting hand early, strum arm never freezes',
      'C with low E drone experiments carefully — string-audit once if anything thuds',
      'Record a bass-heavy take — low strings clear, high strings polite'
    ],
    libraryIds: [
      'pr-andalu'
    ],
    masteryCheck: 'Show one progression where bass motion is obviously on purpose.',
  },
  51: {

    title: 'Dead-Note Clinic — Pluck Audit Method',
    durationMin: 30,
    goals: [
      'After each grab, pluck strings one by one',
      'Fix the worst string only',
      'Re-strum and re-audit'
    ],
    theoryBite: 'Diagnosis before speed. Pros still pluck-audit when a chord turns to mud — name the dead string, fix only that, then rejoin the shape.',
    drills: [
      'String-audit G, C, D, and Am for buzz-free frets',
      'Worst-string isolation 3 minutes — string-audit once if anything thuds',
      'Progression with audit every 4 bars — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'pr-6251'
    ],
    masteryCheck: 'Show before/after: one chord goes from muddy to clear via audit fixes.',
  },
  52: {

    title: 'Strum Vocabulary — Boom-Chuck Country Seed',
    durationMin: 30,
    goals: [
      'Bass note on beats 1 and 3',
      'Chord chuck on 2 and 4',
      'Apply to G–C–D'
    ],
    theoryBite: 'Boom-chuck separates bass and chord — instant country/folk color without learning new harmony. Thumb tells the story; chord snaps the backbeat.',
    drills: [
      'Open-G boom-chuck for 1 minute — bass note clear, chuck light',
      'Add C and D chords into the loop with clean changes',
      'Keep the strum arm loose like a soft drum — no death-grip elbow'
    ],
    libraryIds: [
      'pr-145'
    ],
    masteryCheck: 'Play 8 bars of boom-chuck G–C–D with audible bass/chord split.',
  },
  53: {

    title: 'Reggae Skank Seed — Upbeat Chops',
    durationMin: 30,
    goals: [
      'Chop chords on the &s',
      'Leave downbeats empty',
      'Tiny fret pressure for short decays'
    ],
    theoryBite: 'Space defines reggae guitar. Hitting less is the skill — upstrokes and mutes do the dance. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Muted & chops 1 minute — left hand mutes, right hand stays in time',
      'Loop C–G skank rhythm for 8 bars with muted chucks',
      'Foot still on quarters while hands play offs — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'pr-12bar'
    ],
    masteryCheck: 'Play 8 bars of upbeat chops with quiet downbeats. Tempo can be slow — clarity is the pass.',
  },
  54: {

    title: 'Fingerpicking Pattern — p-i-m-a Seed in C',
    durationMin: 30,
    goals: [
      'Thumb on C bass (A string)',
      'I-m-a on G B E strings',
      'Pattern steady before chord changes'
    ],
    theoryBite: 'Classical/folk pattern pima builds right-hand automation so left hand can think about songs. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Pima arpeggio on open strings for one minute — fretting hand early, strum arm never freezes',
      'Play p-i-m-a arpeggios on the open C shape slowly',
      'C to G change with pattern continuing — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'pr-1645'
    ],
    masteryCheck: 'Play 8 bars of steady pima on C, then 4 bars changing to G.',
  },
  55: {

    title: 'Capo Creativity — Same Shapes New Key',
    durationMin: 30,
    goals: [
      'If you own a capo, place at fret 2 and play G shapes',
      'Without capo, simulate by moving a shape up two frets mentally',
      'Notice singer-friendly pitch lift'
    ],
    theoryBite: 'Capos let beginners play in many keys with open shapes — practical musicianship over theory pride. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'G–C–D open, then with capo 2 if available — fretting hand early, strum arm never freezes',
      'Sing a higher comfortable note and find it slowly on the neck',
      'Write which fret felt good for your voice — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'pr-andalu'
    ],
    masteryCheck: 'Show the same progression in two pitch levels (capo or movable idea).',
  },
  56: {

    title: 'Chord Melody Seed — Melody on Top of C',
    durationMin: 35,
    goals: [
      'Hold C shape',
      'Move only the high E finger for melody nubs',
      'Keep lower strings as pad'
    ],
    theoryBite: 'Chord-melody starts as ‘pad + top note.’ Smallest version still sounds arranged. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Try C with high E open, fret 1, and fret 3 — pick the clearest',
      'Resolve top notes to E (chord tone) — string-audit once if anything thuds',
      'Improvise a 4-bar pad melody over the vamp — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'pr-6251'
    ],
    masteryCheck: 'Play a 4-bar idea where a C pad supports a changing top note.',
  },
  57: {

    title: 'Hybrid Review — Blues + Pop Same Day',
    durationMin: 30,
    goals: [
      'One chorus 12-bar A7 world',
      'One chorus C–Am–F–G world',
      'Notice right-hand feel shifts'
    ],
    theoryBite: 'Mixing styles in the same week builds flexible hands. Same shapes, different grooves. Keep the right hand boring and steady so the fretting hand can stay accurate.',
    drills: [
      'Play one full blues chorus with the form locked — fretting hand early, strum arm never freezes',
      'Play the pop chorus figure twice with clear accents',
      '30s rest between; no mash until both stable — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'pr-12bar',
      'ch-a7',
      'rf-blues-sh'
    ],
    masteryCheck: 'Play one solid blues chorus and one solid pop chorus back-to-back.',
  },
  58: {

    title: 'Transition Gym — Worst Two Bars Only',
    durationMin: 30,
    goals: [
      'Loop only the sticky change',
      'Add context bars after it improves',
      'Resist full-song restarts'
    ],
    theoryBite: 'Deliberate practice targets the bottleneck. Restarting from the intro wastes the reps that matter. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Identify your stickiest two chords and loop only that change',
      'Isolate the sticky bar for two focused minutes — string-audit once if anything thuds',
      'Drop the lick into a 4-bar chord bed — stop if the pocket wobbles'
    ],
    libraryIds: [
      'pr-12bar'
    ],
    masteryCheck: 'Show a sticky change that\'s cleaner after isolation than before.',
  },
  59: {

    title: 'Open-Chord Orchestra — Layer Dynamics + Strum',
    durationMin: 30,
    goals: [
      'Combine boom-chuck and full strums',
      'Arrange verse vs chorus textures',
      'End on a held ring'
    ],
    theoryBite: 'Arrangement skills turn three chords into a performance. Texture changes read as ‘more pro’ than new chords.',
    drills: [
      'Play the verse boom-chuck pattern for 8 bars — fretting hand early, strum arm never freezes',
      'Play the chorus with a fuller D-DU strum pattern',
      'Hold a fermata on the final bar, then release cleanly'
    ],
    libraryIds: [
      'pr-1645'
    ],
    masteryCheck: 'Play a 16-bar arrangement with two clear textures and a deliberate ending.',
  },
  60: {

    title: 'Change Speed Ladder — Week 5 · Focus DM/D',
    durationMin: 30,
    goals: [
      'Find the tempo where DM and D both ring clean',
      'Climb from half notes to quarters one rung at a time',
      'Keep the strum arm steady through every rung'
    ],
    theoryBite: 'Speed is a side effect of clean reps. Half notes teach your hand the shape; quarters prove it stuck.',
    drills: [
      'DM→D in half notes for 2 minutes — fretting hand early, strum arm never freezes',
      'Quarters only when 9 of 10 changes ring clean — string-audit once if anything thuds',
      'If dead notes return, drop back a rung — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Hold DM→D changes at 60 BPM with every string ringing clean.',
  },
  61: {

    title: 'Groove First — Chords as Drums',
    durationMin: 30,
    goals: [
      'Mute the strings and play the chord rhythm like a drum kit',
      'Keep the right hand steady before the fretting hand joins',
      'Tap your foot on 1 and 3 while you strum'
    ],
    theoryBite: 'The right hand is the engine. If it locks, the left hand can relax into the same pulse. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Mute all strings, strum quarters for 30 seconds — fretting hand early, strum arm never freezes',
      'Add eighth-note strums, still muted — string-audit once if anything thuds',
      'Fret Em once the groove feels automatic — tempo only rises after three clean cycles',
      'Take your hand off the strings and keep the rhythm going in your head'
    ],
    libraryIds: [
      'pr-6251'
    ],
    masteryCheck: 'Play 30 seconds of muted groove where a listener would tap along, then add Em without slowing.',
  },
  62: {

    title: 'Ear Harmony — Guess the Next Chord 5 · Focus G/AM',
    durationMin: 30,
    goals: [
      'Guess the next chord before it lands',
      'Use your ear, not your eyes',
      'Name the feeling that tipped you off'
    ],
    theoryBite: 'Ear training is prediction. When you guess right, your ear just wrote the harmony down. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Play a two-chord loop and guess the second one — fretting hand early, strum arm never freezes',
      'Close your eyes for the second pass — string-audit once if anything thuds',
      'Say the chord name out loud before you hear it — tempo only rises after three clean cycles',
      'Check yourself — were you close, right, or lost?'
    ],
    libraryIds: [
      'pr-145'
    ],
    masteryCheck: 'Predict the next chord in a two-chord loop five times in a row without looking.',
  },
  63: {

    title: 'Soft Hands Day — Tension Audit 5 · Focus D/E',
    durationMin: 35,
    goals: [
      'Rate your fretting pressure out of ten',
      'Find the least pressure that still rings',
      'Practice with softer hands than feels natural'
    ],
    theoryBite: 'Pressure is habit, not requirement. The note only needs the string to touch the fret. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Fret a D chord, squeeze, then relax until it almost buzzes',
      'Play 10 seconds at 8/10 pressure, then 10 at 5/10',
      'Check your thumb — it shouldn\'t be white-knuckled',
      'Strum and watch for dead notes from over-gripping'
    ],
    libraryIds: [
      'pr-12bar'
    ],
    masteryCheck: 'Play a D chord for 30 seconds at your new \'enough\' pressure with no buzzing.',
  },
  64: {

    title: 'Song Transfer — Chords Into a PD Melody Day 5 · Focus EM/A',
    durationMin: 30,
    goals: [
      'Fit simple chords under a melody you know',
      'Change chord only when the melody needs it',
      'Keep the melody singable above the chords'
    ],
    theoryBite: 'Melody chooses the chords, not the other way around. Fit harmony underneath what you hum. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Hum the melody once and find its resting note — fretting hand early, strum arm never freezes',
      'Try Em under the first phrase, A under the second',
      'Switch chords only at phrase boundaries — tempo only rises after three clean cycles',
      'Sing while you play the two-chord version — fretting hand early, strum arm never freezes'
    ],
    libraryIds: [
      'pr-1645'
    ],
    masteryCheck: 'Play a melody you know over two chords and sing it in tune the whole way.',
  },
  65: {

    title: 'Weekly Chord Checkpoint 5 · Focus AM/F',
    durationMin: 30,
    goals: [
      'Run this week\'s chord set as one flowing loop',
      'Change chords without lifting the whole hand',
      'Record a take you\'d keep'
    ],
    theoryBite: 'A checkpoint isn\'t a test; it\'s a photograph. You\'re comparing yourself to last week, not to anyone else.',
    drills: [
      'Am–F loop, two beats per chord, 60 seconds — fretting hand early, strum arm never freezes',
      'Change with the smallest movement possible — string-audit once if anything thuds',
      'Play the loop four times through — tempo only rises after three clean cycles',
      'Record one take and listen once — fretting hand early, strum arm never freezes'
    ],
    libraryIds: [
      'pr-andalu'
    ],
    masteryCheck: 'Am–F loop for 60 seconds with smooth changes and one keepable take.',
  },
  66: {

    title: 'Chord Color Week 6 — Suspension Taste · Focus E/BM',
    durationMin: 30,
    goals: [
      'Lift one finger to turn E into its sus color',
      'Let the third return on beat 1 so tension resolves',
      'Keep the strum steady while the color changes'
    ],
    theoryBite: 'A sus chord holds its root and fifth but floats the third — lift a finger and the song leans forward.',
    drills: [
      'Hold E, lift the first finger on & of 4 — fretting hand early, strum arm never freezes',
      'Return to E on beat 1 of the next bar — string-audit once if anything thuds',
      'Four bars steady, then try it on Bm — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'pr-6251'
    ],
    masteryCheck: 'Create three sus-and-resolve moments inside a steady E-to-Bm loop.',
  },
  67: {

    title: 'Change Speed Ladder — Week 6 · Focus A/C7',
    durationMin: 30,
    goals: [
      'Land A and C7 without hunting for the frets',
      'Lift all fingers together, then place together',
      'Two clean quarter-note changes per bar'
    ],
    theoryBite: 'C7 tucks the third finger in close. Lift everything together — the shape arrives as a block. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'A→C7 in half notes for 2 minutes — fretting hand early, strum arm never freezes',
      'Same change in quarters at 60 BPM — string-audit once if anything thuds',
      'Watch the third finger land flat, not reaching — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'ch-c7'
    ],
    masteryCheck: 'Play A→C7 clean at 60 BPM for 16 bars without a muted string.',
  },
  68: {

    title: 'Groove First — Chords as Drums (2)',
    durationMin: 30,
    goals: [
      'Turn G7 into a rhythm groove that doesn\'t need the notes to sound good',
      'Move the groove between two chords without losing the bounce',
      'Keep the mute pattern identical while the left hand changes'
    ],
    theoryBite: 'A groove lives in the right hand. Change chords underneath and the pattern can stay exactly the same.',
    drills: [
      'Muted G7 rhythm, quarters then eighths — fretting hand early, strum arm never freezes',
      'Switch to C7 mid-pattern, same right hand — string-audit once if anything thuds',
      'Alternate G7 and C7 every two bars, muted — tempo only rises after three clean cycles',
      'Let the chords ring only on beat 1, mute the rest'
    ],
    libraryIds: [
      'ch-g7'
    ],
    masteryCheck: 'Switch between G7 and C7 every two bars for 60 seconds without the groove wobbling.',
  },
  69: {

    title: 'Ear Harmony — Guess the Next Chord 6 · Focus BM/D7',
    durationMin: 30,
    goals: [
      'Guess a three-chord progression before it lands',
      'Listen for whether it goes up, down, or home',
      'Let your hand reach for the guess before you play it'
    ],
    theoryBite: 'Three-chord songs usually follow the same map. Your ear learns the exits before your brain does. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Bm to D7 loop, guess the second chord — fretting hand early, strum arm never freezes',
      'Add a third chord and guess the full path — string-audit once if anything thuds',
      'Listen with your eyes shut, hands off the strings',
      'Air-guitar the guess, then check — fretting hand early, strum arm never freezes'
    ],
    libraryIds: [
      'ch-d7'
    ],
    masteryCheck: 'Correctly predict a three-chord loop\'s path three times in a row.',
  },
  70: {

    title: 'Soft Hands Day — Tension Audit 6 · Focus C7/A7',
    durationMin: 35,
    goals: [
      'Notice where tension hides in your body',
      'Release it mid-phrase, not between phrases',
      'Keep the music flowing while hands soften'
    ],
    theoryBite: 'Tension migrates: hand, shoulder, jaw, breath. Softening any of them helps all of them. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Play A7 while checking your jaw and shoulders — fretting hand early, strum arm never freezes',
      'Exhale on beat 1 for 8 bars so the downbeat stays soft and steady',
      'Shake out your fretting hand, then play the same line',
      'Compare the sound before and after releasing — fretting hand early, strum arm never freezes'
    ],
    libraryIds: [
      'ch-a7'
    ],
    masteryCheck: 'Play A7 for 30 seconds with a relaxed jaw, shoulder, and thumb — and hear the tone open up.',
  },
  71: {

    title: 'Song Transfer — Chords Into a PD Melody Day 6 · Focus G7/E7',
    durationMin: 30,
    goals: [
      'Use G7 and E7 to pull the melody home',
      'Let the seventh chords color the ending phrases',
      'Keep the arrangement simple enough to sing over'
    ],
    theoryBite: 'Seventh chords want to resolve. Placing them at phrase ends gives the melody a push home. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Find the melody\'s last note and put G7 before it',
      'Swap in E7 for color on a repeat — string-audit once if anything thuds',
      'Play the whole tune with just two chords per phrase',
      'Record it and listen for the pull of the sevenths'
    ],
    libraryIds: [
      'ch-g7',
      'ch-e7'
    ],
    masteryCheck: 'Arranged a known melody with G7 and E7 landing on phrase ends — and it sounds finished.',
  },
  72: {

    title: 'Weekly Chord Checkpoint 6 · Focus D7/DM',
    durationMin: 30,
    goals: [
      'Checkpoint the week\'s chord changes at a steady pulse',
      'Fix the one change that still trips you',
      'Leave with a recorded before/after'
    ],
    theoryBite: 'One sticky change fixed is a full week\'s win. Slow it, loop it, then put it back in the song. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'D7–Dm loop, slow and even — hear the color flip each bar',
      'Isolate the hardest change and loop it 20 times — string-audit once if anything thuds',
      'Play the full progression at 60 BPM — tempo only rises after three clean cycles',
      'Record before and after to hear the jump — fretting hand early, strum arm never freezes'
    ],
    libraryIds: [
      'ch-d7'
    ],
    masteryCheck: 'D7–Dm clean at 60 BPM for 60 seconds, plus a recorded before/after pair.',
  },
  73: {

    title: 'Chord Color Week 7 — Suspension Taste · Focus A7/C',
    durationMin: 30,
    goals: [
      'Turn A7 into a quick sus and back without stopping',
      'Hear the pull when the third lands on beat 1',
      'Do it inside a steady four-bar loop'
    ],
    theoryBite: 'A7\'s sus hangs the third out of reach — when it lands back on beat 1, that pull is the whole trick. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'A7 shape, lift the third finger on & of 4 — fretting hand early, strum arm never freezes',
      'Land the full A7 on beat 1 after the setup — no late fingers',
      'Loop four bars; keep the strum arm moving — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'ch-a7'
    ],
    masteryCheck: 'Four bars of A7 sus-resolve that make a listener lean in, at a steady tempo.',
  },
  74: {

    title: 'Change Speed Ladder — Week 7 · Focus E7/G',
    durationMin: 30,
    goals: [
      'Shape E7 and G from memory without peeking',
      'Anchor the low E root and let the rest pivot',
      'Two steady changes per bar at 60 BPM'
    ],
    theoryBite: 'E7 and G share the same low root — anchor that finger and the whole change gets shorter. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'E7→G in half notes for 2 minutes — fretting hand early, strum arm never freezes',
      'Quarters at 60 BPM, thumb behind the neck — string-audit once if anything thuds',
      'Anchor the low E root, pivot the rest — tempo only rises after three clean cycles'
    ],
    libraryIds: [
      'ch-e7'
    ],
    masteryCheck: 'Swap E7 and G eight times clean in a row at 60 BPM.',
  },
  75: {

    title: 'Groove First — Chords as Drums (3)',
    durationMin: 30,
    goals: [
      'Play the chord groove with real notes, not just mutes',
      'Choose the strum pattern that fits the song\'s energy',
      'Keep the pocket when the fretting gets harder'
    ],
    theoryBite: 'Once a groove is in your body, the notes are decoration. The pocket is the song. Right hand stays boring and steady so the fretting hand can be accurate.',
    drills: [
      'Dm groove, downstrokes only, 30 seconds — fretting hand early, strum arm never freezes',
      'Down-up eighths with the same chord — string-audit once if anything thuds',
      'Two-bar pattern: groove, then let it ring — tempo only rises after three clean cycles',
      'Play it three times through without losing the pulse'
    ],
    libraryIds: [
      'ch-dm'
    ],
    masteryCheck: 'Play a Dm groove for 60 seconds that keeps its bounce even when you change patterns.',
  },
  76: {

    title: 'Scales Phase Open — Maps for Music',
    durationMin: 30,
    goals: [
      'Walk minor pentatonic box 1 with even tone',
      'Compare one major-scale fragment to the pent box',
      'Improvise a short phrase that sounds like music, not a drill'
    ],
    theoryBite: 'Scales are maps, not homework. Start with minor pentatonic for lead color, then touch the major scale so you hear the brighter twin. One box, steady time, then a tiny musical phrase.',
    drills: [
      'Play the focus shape once ascending while naming the root each time you hit it',
      'Eighth notes at a tempo where tone stays even — stop if you rush the click',
      'Three-note improvisation for one minute inside the shape — rests allowed and encouraged'
    ],
    libraryIds: [
      'sc-pent-min',
      'sc-major'
    ],
    masteryCheck: 'Improvise 60 seconds in box 1 that still sounds like sentences, not a drill.',
  },
  77: {

    title: 'Minor Pent Box 1 Mastery — Even Tone',
    durationMin: 35,
    goals: [
      'Even volume ascending and descending',
      'Thumb stable behind neck',
      'Metronome 60–70 BPM eighths'
    ],
    theoryBite: 'Evenness > speed. Recording yourself exposes hidden accents that fight the groove. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Box shape with the metronome — one position, no racing the click',
      'Accent only beat 1 roots; ghost everything else for one minute',
      'Quiet the notes that pop too hard — leave a rest so the phrase can breathe'
    ],
    libraryIds: [
      'sc-pent-min',
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Play two clean ascents/descents of box 1 with even tone at a steady click.',
  },
  78: {

    title: 'Box 1 Sequences — 3s and 4s',
    durationMin: 30,
    goals: [
      'Play notes in groups of 3',
      'Play notes in groups of 4',
      'Keep the click under sequences'
    ],
    theoryBite: 'Sequences teach your hands common melodic ‘rhythms of pitch’ used in real solos. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      '123 234 345 pattern slow until each finger lands without a slap',
      '1234 2345 finger pattern — even volume, no hammered leftovers',
      'Resolve to the root after each pass so the ear gets a period'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Complete one full sequence pass in 3s and one in 4s without derailing time.',
  },
  79: {

    title: 'Blues Scale — Add the Flat-5 Spice',
    durationMin: 30,
    goals: [
      'Find the blue note in box 1',
      'Use it as a short neighbor, not a home',
      'Bend or slide into chord tones'
    ],
    theoryBite: 'Blues scale = minor pent + b5. The spice note wants to resolve — tension and release in one finger. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Spot every b5 location in the box before playing',
      'Lick: chord tone → b5 → chord tone — even tone matters more than covering frets',
      'Solo 1 minute max 20% blue notes — leave a rest so the phrase can breathe'
    ],
    libraryIds: [
      'sc-blues',
      'sc-pent-min',
      'rf-blues-sh',
      'pr-12bar'
    ],
    masteryCheck: 'Play a 4-bar lick that uses the blue note and resolves cleanly.',
  },
  80: {

    title: 'Major Pentatonic — Bright Twin',
    durationMin: 30,
    goals: [
      'Play G major pentatonic shape',
      'Compare to E minor pent (relative pair)',
      'Resolve to G for major, E for minor mood'
    ],
    theoryBite: 'Relative major/minor pentatonics share notes; the home note decides the story. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'G major pent up and down — name a target note before each run',
      'Same notes resolving to E — hold the resolve long enough to mean it',
      'Call dark, answer bright — two bars each, leave a breath between'
    ],
    libraryIds: [
      'sc-pent-maj',
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play a major-pent phrase that clearly cadences to the major root.',
  },
  81: {

    title: 'Connect Boxes — Horizontal Walk',
    durationMin: 30,
    goals: [
      'Move from box 1 toward box 2 area',
      'Use a shared note as a hinge',
      'Avoid jump-cuts without a slide/step'
    ],
    theoryBite: 'Pros connect positions. Hinge notes and slides beat teleporting up the neck. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Find hinge note between positions — land on the root every four bars',
      'Ascending journey 2 octaves if possible — even tone matters more than covering frets',
      'Descend the scale on a new string path once cleanly'
    ],
    libraryIds: [
      'rf-a-blues-turnaround-study'
    ],
    masteryCheck: 'Travel between two neck areas using a deliberate hinge note twice.',
  },
  82: {

    title: 'Chord Tones Inside the Box',
    durationMin: 30,
    goals: [
      'Mark root, b3, 5 inside minor pent',
      'Land phrase endings on chord tones',
      'Play arpeggio outline then fill'
    ],
    theoryBite: 'Chord tones are gravity. Scale filler notes decorate; chord tones tell harmony where you\'re. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Pulse roots only on beats 1 and 3 for 8 bars — land on the root every four bars',
      'Outline roots and fifths through the progression',
      'Run the full box but end phrases on chord tones you can name'
    ],
    libraryIds: [
      'sc-pent-min',
      'rf-spanish-e-phrygian-study'
    ],
    masteryCheck: 'Improvise 8 bars ending every phrase on a chord tone.',
  },
  83: {

    title: 'Major Scale — Seven-Note Map in G',
    durationMin: 30,
    goals: [
      'Play one-octave G major in position',
      'Sing degree numbers 1–7 if you can',
      'Harmonize with G–C–D open chords'
    ],
    theoryBite: 'Major scale degrees explain why melodies feel finished (1,3,5) or yearn (2,4,6,7). Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Play one octave of the scale slowly with even fingers',
      'Say scale degrees on the way up — stop if the names fall behind the hands',
      'Melody doodle using only 1 2 3 5 — leave a rest so the phrase can breathe'
    ],
    libraryIds: [
      'sc-major',
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play one clean G major octave and a 4-bar melody that rests on G.',
  },
  84: {

    title: 'Natural Minor — Aeolian Mood',
    durationMin: 35,
    goals: [
      'Play A natural minor one octave',
      'Contrast with A minor pent',
      'Note the 2 and b6 colors'
    ],
    theoryBite: 'Natural minor adds degrees pentatonics omit — more pathos, more stepwise melody options. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Play A natural minor one octave slowly with even tone',
      'Remove notes down to pent and compare — which version sings more?',
      'Phrase using the b6 on purpose once — make it sound intentional'
    ],
    libraryIds: [
      'sc-pent-min',
      'sc-nat-min',
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Play A natural minor ascending/descending and one phrase that needs a non-pent note.',
  },
  85: {

    title: 'Dorian Color — Raised 6 Minor',
    durationMin: 30,
    goals: [
      'Play D Dorian essence (minor + raised 6)',
      'Compare to natural minor mood',
      'Jam idea over Dm vamp feeling'
    ],
    theoryBite: 'Dorian = natural minor with raised 6. Funk, Santana, modal jams — hopeful minor. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Find the raised 6 relative to Dm and mark it with a finger tap',
      'Side-by-side natural vs dorian lick — even tone matters more than covering frets',
      'Static Dm groove improv 1 minute — leave a rest so the phrase can breathe'
    ],
    libraryIds: [
      'rf-natural-harmonics-study'
    ],
    masteryCheck: 'Play a lick that clearly shows dorian’s raised 6 against a minor chord.',
  },
  86: {

    title: 'Mixolydian — Dominant Major',
    durationMin: 30,
    goals: [
      'Find b7 in a mixolydian map',
      'Resolve b7 with intention',
      'Play a short dominant-flavored phrase over a vamp'
    ],
    theoryBite: 'Mixolydian is major with a flat 7 — the rock dominant sound. Find b7, sit on it, then resolve so it feels like a choice. Keep major nearby so your ear hears the difference.',
    drills: [
      'Play G Mixolydian one octave ascending and down — land on the root every four bars',
      'Target the flat-7 resolving into the root on purpose',
      'Two-chord vamp G to F if comfortable — leave a rest so the phrase can breathe'
    ],
    libraryIds: [
      'sc-mixo'
    ],
    masteryCheck: 'Improvise 8 bars in a mixolydian mood landing on G.',
  },
  87: {

    title: 'Phrygian Hint — Flat 2 Drama',
    durationMin: 30,
    goals: [
      'Find flat 2 above E or Am context',
      'Use sparingly as spice',
      'Resolve to E or Am strongly'
    ],
    theoryBite: 'Phrygian’s b2 is cinematic/Spanish. A little goes far — tension wants resolution. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Play an E Phrygian fragment resolving to E or Am',
      'Practice b2 neighbor licks resolving to the root',
      'Resolve phrases to E — the last note is the point, not the run-up'
    ],
    libraryIds: [
      'rf-caged-c'
    ],
    masteryCheck: 'Play a short phrygian-flavored phrase that resolves cleanly.',
  },
  88: {

    title: 'Lydian Dream — Raised 4 Color',
    durationMin: 30,
    goals: [
      'Find the raised 4 against a major root',
      'Hold the dreamy dissonance for a beat or two',
      'Resolve to the 3rd or 5th on purpose'
    ],
    theoryBite: 'Lydian is a major scale with a raised 4th (#4). That one note makes major sound open and filmic. Hold the #4 like a color, then resolve to 3 or 5 so it feels chosen, not stuck.',
    drills: [
      'In C or F position, play root → #4 → resolve to 3 — say the job of each note once',
      'Long tone on #4 for two beats, then resolve down, in time with a click',
      'Four-bar phrase that uses #4 only once as a special color, not on every attack'
    ],
    libraryIds: [
      'sc-lydian'
    ],
    masteryCheck: 'Play one short lydian phrase that shows the #4 and resolves cleanly to a chord tone.',
  },
  89: {

    title: 'Pentatonic Call-and-Response',
    durationMin: 30,
    goals: [
      'Play a question phrase (rising)',
      'Answer lower or shorter',
      'Leave a full bar of rest between'
    ],
    theoryBite: 'Conversation beats continuous notes. Rests are musical confidence — leave a bar of air and the next phrase lands harder.',
    drills: [
      'Play a two-bar question phrase, then leave space',
      'Rest one full bar, then re-enter cleanly on beat 1',
      'Answer in 2 bars for 4 cycles — copy the rhythm, change the notes'
    ],
    libraryIds: [
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Play four clear call-response pairs with audible rests.',
  },
  90: {

    title: 'Targeting Triads — Solo Over G–C–D',
    durationMin: 30,
    goals: [
      'Know chord tones for G C D',
      'Change target notes when chords change',
      'Use pent filler between targets'
    ],
    theoryBite: 'The pro sound over changes is targeting, not denser scales. Hit the new chord’s third/root. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Roots only through the whole progression — fat and in time',
      'Play roots and thirds only through the progression',
      'Add pent connector notes between chord tones — keep the line singable'
    ],
    libraryIds: [
      'rf-am-arpeggio-cascade'
    ],
    masteryCheck: 'Solo one chorus of G–C–D hitting a chord tone on each chord’s downbeat.',
  },
  91: {

    title: 'Interval Jumps — 3rds and 4ths in the Box',
    durationMin: 35,
    goals: [
      'Practice skipping strings in-pattern',
      'Keep fretting hand calm on jumps',
      'Use jumps as motif starters'
    ],
    theoryBite: 'Intervals create melody contour. Stepwise is speech; leaps are exclamation points. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      '3rd pattern through the pent box — stop if the sequence rushes the click',
      'Practice fourth leaps carefully with a slow click',
      'Build a motif from one leap, then fill with steps'
    ],
    libraryIds: [
      'rf-natural-harmonics-study'
    ],
    masteryCheck: 'Play a motif built from a leap, repeated with variation three times.',
  },
  92: {

    title: 'Harmonic Minor Tease — Leading Tone Bite',
    durationMin: 30,
    goals: [
      'Play A harmonic minor fragment',
      'Hear raised 7 pull to A',
      'Classical/metal spice in small doses'
    ],
    theoryBite: 'Harmonic minor’s raised 7 creates a strong leading tone — drama engine for minor keys. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Build a short fragment around the leading tone, then resolve',
      'Resolve the line to A and hold a clean long tone',
      'One exotic phrase max per 4 bars — leave a rest so the phrase can breathe'
    ],
    libraryIds: [
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Show the leading-tone pull into A minor clearly twice.',
  },
  93: {

    title: 'Position Playing — Stay in a 5-Fret Cage',
    durationMin: 30,
    goals: [
      'Choose frets 5–8 area',
      'Find pent notes without open strings',
      'Build a riff that never leaves the cage'
    ],
    theoryBite: 'Caged positions teach the neck as neighborhoods. Constraints breed creativity. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Map root locations for the CAGED form in use — land on the root every four bars',
      'Riff only inside the cage for two minutes — no runaway frets',
      'Optional: shift cage up 2 frets and repeat idea — leave a rest so the phrase can breathe'
    ],
    libraryIds: [
      'rf-caged-c'
    ],
    masteryCheck: 'Write/play an 8-bar riff that stays inside one 5-fret position.',
  },
  94: {

    title: 'Scale Detox — Three Notes Only Jam',
    durationMin: 30,
    goals: [
      'Pick any three neighboring notes',
      'Make rhythm carry interest',
      'Ban additional pitches for 3 minutes'
    ],
    theoryBite: 'Limitation is a creativity tool used by great teachers. Rhythm and silence outrank note count. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Choose three strong notes and improvise only with them',
      'Groove the pattern for 8 bars without rushing — even tone matters more than covering frets',
      'Add bends/slides only on those pitches — leave a rest so the phrase can breathe'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study'
    ],
    masteryCheck: 'Jam three full minutes using only three pitches with intentional rhythm.',
  },
  95: {

    title: 'Pent Story Draft — Call, Peak, Land',
    durationMin: 30,
    goals: [
      'Plan call, develop, peak, land',
      'Use one blue note maximum section',
      'End on a long root'
    ],
    theoryBite: 'A solo is a story arc. Capstone days prove you can shape time, not only run shapes. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Sketch form on paper 1-2-3-4 sections — land on the root every four bars',
      'Play a full 16 bars without stopping to fix mistakes',
      'Second take with more space — cut half the notes on purpose'
    ],
    libraryIds: [
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Play a 16-bar pentatonic story with a clear beginning, peak, and landing.',
  },
  96: {

    title: 'Weekly Scales Checkpoint',
    durationMin: 30,
    goals: [
      'Play an 8-bar scale story that lands on the root',
      'Use one scale color over the whole loop',
      'Leave space so it sounds like music, not a drill'
    ],
    theoryBite: 'A scale is a menu, not a song. Checkpoints are where you cook with it — and the major scale is the kitchen.',
    drills: [
      'C major pentatonic, 8 bars, start and end on C — land on the root every four bars',
      'Play only 3 notes per bar — rhythm does the work',
      'Rest on bars 4 and 8 on purpose — silence is a note choice',
      'Record it and listen for the landing — land on the root every four bars'
    ],
    libraryIds: [
      'sc-major',
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'An 8-bar C major pent story that resolves home and leaves space.',
  },
  97: {

    title: 'Neck Geography — Root Finder Drill',
    durationMin: 30,
    goals: [
      'Find the same root note on three different strings',
      'Pulse each root on beat 1',
      'Connect the roots with scale steps'
    ],
    theoryBite: 'The neck repeats itself in patterns. One root note lives in dozens of places. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Find D on the A, D, and G strings — land on the root every four bars',
      'Play each one on beat 1 of a four-count — even tone matters more than covering frets',
      'Connect two of them with scale steps — leave a rest so the phrase can breathe',
      'Close your eyes and find them again — land on the root every four bars'
    ],
    libraryIds: [
      'rf-drop-d-power-study'
    ],
    masteryCheck: 'Find D on three strings without hunting, and connect two with steps.',
  },
  98: {

    title: 'Phrase Gym — Copy → Vary → Own',
    durationMin: 35,
    goals: [
      'Copy a 4-note motif exactly first',
      'Change only the rhythm, keep the notes',
      'Let the motif become your own'
    ],
    theoryBite: 'Imitation is how every player builds vocabulary. Copy it, then give it your fingerprint. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Learn a 4-note library motif note-for-note — land on the root every four bars',
      'Play the same idea with twice the rests — leave bigger holes',
      'Move the same phrase to a new string set without changing the rhythm',
      'End with your own rhythm version — land on the root every four bars'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Show the copied motif, a rhythm variant, and your own version in one take.',
  },
  99: {

    title: 'Metronome Subdivision — Scale Eighths',
    durationMin: 30,
    goals: [
      'Play scale eighths locked to a click',
      'Hear subdivisions, not just beat 1',
      'Keep quarters steady when eighths get hard'
    ],
    theoryBite: 'Subdivisions are where timing lives. Beat 1 keeps you close; eighths keep you honest. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Scale up and down in quarters first — land on the root every four bars',
      'Switch to eighths at the same tempo only if quarters were clean',
      'If you rush, drop back to quarters — leave a rest so the phrase can breathe',
      'Record 20 seconds and check the eighths — land on the root every four bars'
    ],
    libraryIds: [
      'rf-power'
    ],
    masteryCheck: 'One octave of scale in steady eighths that a kind click test would pass.',
  },
  100: {

    title: 'Mode Mood Board — A/B Day',
    durationMin: 30,
    goals: [
      'Play the same phrase in two different modes',
      'Hear the mood change between them',
      'Name one feeling for each color'
    ],
    theoryBite: 'Modes are moods with rules. Comparing two back to back teaches faster than reading about them. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Play a short phrase in the first mode — land on the root every four bars',
      'Repeat it in the second mode, same notes — even tone matters more than covering frets',
      'Name each mood out loud before you play the matching phrase',
      'Decide which fits the vamp better — land on the root every four bars'
    ],
    libraryIds: [
      'rf-blues-sh'
    ],
    masteryCheck: 'The same rhythm in two modal colors, with a name for each mood.',
  },
  101: {

    title: 'Scale → Riff Extraction',
    durationMin: 30,
    goals: [
      'Find a cool bar inside your scale run',
      'Loop that bar until it becomes a riff',
      'Leave with a riff you can repeat'
    ],
    theoryBite: 'Riffs are frozen luck. Capture the accidental cool bar, give it a clear start and end, and you own a lick instead of a blur.',
    drills: [
      'Improvise over the vamp for 1 minute — land on the root every four bars',
      'Circle the one bar that felt like something — even tone matters more than covering frets',
      'Repeat the motif 8 times exactly — only the dynamics may change',
      'Add a tiny variation on the repeat — land on the root every four bars'
    ],
    libraryIds: [
      'rf-a-blues-turnaround-study'
    ],
    masteryCheck: 'A 1- or 2-bar riff you can repeat from memory five times.',
  },
  102: {

    title: 'Chord-Scale Match Briefing',
    durationMin: 30,
    goals: [
      'Match long tones to chord tones over a Spanish E vamp',
      'Hear which notes settle and which ones pull',
      'Use passing tones only between strong notes'
    ],
    theoryBite: 'Long notes must agree with the chord; passing notes may color. That one rule is most of applied theory.',
    drills: [
      'Loop the E phrygian vamp, hold the root E — land on the root every four bars',
      'Try b2 (F) as a long tone, feel the pull — even tone matters more than covering frets',
      'Then land the b7 (D), then resolve to E like a sentence ending',
      'Solo with long tones on chord tones only — land on the root every four bars'
    ],
    libraryIds: [
      'rf-spanish-e-phrygian-study'
    ],
    masteryCheck: 'Hold three long tones over the E vamp that all sound intentional.',
  },
  103: {

    title: 'Weekly Scales Checkpoint (2)',
    durationMin: 30,
    goals: [
      'Weave a chromatic approach note into the scale story',
      'Keep the chromatic note quick, never a destination',
      'Still land the phrase on the root'
    ],
    theoryBite: 'Chromatic notes are seasoning — a half-step neighbor that slides the ear to the real note. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Add one chromatic neighbor before the root — land on the root every four bars',
      'Same 8-bar story, two approach notes max — even tone matters more than covering frets',
      'Keep them on weak beats at first — leave a rest so the phrase can breathe',
      'Land the final phrase squarely on the root — land on the root every four bars'
    ],
    libraryIds: [
      'rf-jazz-chromatic-approach-study'
    ],
    masteryCheck: '8-bar story with 2 chromatic approach notes that still resolves cleanly home.',
  },
  104: {

    title: 'Neck Geography — Root Finder Drill (2)',
    durationMin: 30,
    goals: [
      'Find roots on new strings and new frets',
      'Walk between roots using the same shape each time',
      'Keep a metronome clicking through the hunt'
    ],
    theoryBite: 'Roots are landmarks. If you know where they are, every scale and chord has a home base. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Find C on the low E and the high E strings — land on the root every four bars',
      'Play both C\'s on beat 1, in time — even tone matters more than covering frets',
      'Walk from low C to high C using scale steps — leave a rest so the phrase can breathe',
      'Do the same pass again with eyes closed — trust the frets'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Locate C on both E strings and walk between them in time.',
  },
  105: {

    title: 'Phrase Gym — Copy → Vary → Own (2)',
    durationMin: 35,
    goals: [
      'Start from the same motif, change the ending',
      'Keep the beginning recognizable',
      'Make the new ending resolve'
    ],
    theoryBite: 'A motif is a question. Changing the ending changes the answer while keeping the conversation. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Play the motif twice with the original ending — land on the root every four bars',
      'Replace the last note with a new one — even tone matters more than covering frets',
      'Make the new ending land on the root — leave a rest so the phrase can breathe',
      'Trade old ending / new ending every other bar — land on the root every four bars'
    ],
    libraryIds: [
      'rf-spider'
    ],
    masteryCheck: 'The motif with a changed ending that still feels finished.',
  },
  106: {

    title: 'Metronome Subdivision — Scale Eighths (2)',
    durationMin: 30,
    goals: [
      'Keep eighths even while adding a passing tone',
      'Let the click be the boss, not the speed',
      'Find where you tend to rush'
    ],
    theoryBite: 'Eighths are a train track. Adding scale notes does not change the rails — the click still owns the grid under every finger.',
    drills: [
      'Scale eighths with one chromatic passing note — land on the root every four bars',
      'Mark where you rushed — that\'s the fix spot — even tone matters more than covering frets',
      'Loop that spot slowly five times — leave a rest so the phrase can breathe',
      'Run the full octave again — even fingers, no rush at the top'
    ],
    libraryIds: [
      'rf-blues-sh'
    ],
    masteryCheck: 'Scale eighths with a passing tone, even and un-rushed, 20 seconds.',
  },
  107: {

    title: 'Mode Mood Board — Switch on the Root',
    durationMin: 30,
    goals: [
      'Map dorian and mixolydian roots in one area of the neck',
      'Switch modes mid-loop without stopping',
      'Hear the switch land on the root'
    ],
    theoryBite: 'Changing mode mid-loop is like changing the light in a room. Keep dorian and mixolydian in the same position, switch on the root, and listen for the mood flip without losing the pulse.',
    drills: [
      'Map both dorian and mixolydian shapes in one position — roots first',
      'Loop a simple vamp; switch mode after 4 bars on the root',
      'Keep the metronome through the change; if you rush, halve the tempo',
      'Record one A/B pass and name which mood you prefer today'
    ],
    libraryIds: [
      'sc-dorian',
      'sc-mixo'
    ],
    masteryCheck: 'Switch modes mid-loop on the root without losing the pulse for eight bars.',
  },
  108: {

    title: 'Scale → Riff Extraction (2)',
    durationMin: 30,
    goals: [
      'Extract a riff and give it an ending',
      'Make the riff loop-able back to the start',
      'Play it twice through without losing the fire'
    ],
    theoryBite: 'A riff without an ending is a loop; a riff with an ending is a statement. Practice the last note like it matters.',
    drills: [
      'Loop your existing riff four times before you change a note',
      'Add a one-note ending that leads back in — even tone matters more than covering frets',
      'Play it as: riff, riff, riff, ending — leave a rest so the phrase can breathe',
      'Record the full cycle twice; keep the take with steadier time'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'A riff with a repeatable ending, played through twice.',
  },
  109: {

    title: 'Chord-Scale Match Briefing (2)',
    durationMin: 30,
    goals: [
      'Hold long tones that agree over a funk vamp',
      'Let passing chromatic notes slide through fast',
      'Resolve every phrase on a chord tone'
    ],
    theoryBite: 'Funk lives in the short notes between strong ones. Chord tones anchor, chromatics decorate. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Loop the funk vamp, play the root on beat 1 only',
      'Add a chromatic approach note before the root — even tone matters more than covering frets',
      'Play a 3-note chord-tone arpeggio over each chord',
      'Solo 8 bars: long tones on beats 1 and 3 — land on the root every four bars'
    ],
    libraryIds: [
      'rf-funk-chicka-study'
    ],
    masteryCheck: 'Three long chord tones over the funk vamp, each resolving a chromatic approach.',
  },
  110: {

    title: 'Weekly Scales Checkpoint (3)',
    durationMin: 30,
    goals: [
      'Swap the story\'s color from major to minor pentatonic',
      'Hear the mood change over the same loop',
      'Resolve to the new root with intention'
    ],
    theoryBite: 'Same shapes, different mood. Minor pentatonic turns the same journey into a different weather. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'A minor pentatonic box for 8 bars — simple, in time, breathing',
      'Start and end on A this time so the ear hears home base',
      'Use the flat 3rd as a color on bar 6 — leave a rest so the phrase can breathe',
      'Compare with last week\'s major story — land on the root every four bars'
    ],
    libraryIds: [
      'sc-pent-min',
      'rf-am-arpeggio-cascade'
    ],
    masteryCheck: '8-bar A minor pent story with a clear mood shift from last week\'s major.',
  },
  111: {

    title: 'Neck Geography — Root Finder Drill (3)',
    durationMin: 30,
    goals: [
      'Use natural harmonics as pitch landmarks',
      'Match fretted roots to harmonic pitches',
      'Tune your ear to the ringing overtones'
    ],
    theoryBite: 'Harmonics are pure pitch beacons. They tell you exactly where a note lives without fretting. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Find the 12th-fret harmonic on each string — land on the root every four bars',
      'Fret the same note and compare the pitch — even tone matters more than covering frets',
      'Use the harmonic to find E on multiple strings — leave a rest so the phrase can breathe',
      'End by playing the root with a harmonic ring — land on the root every four bars'
    ],
    libraryIds: [
      'rf-natural-harmonics-study'
    ],
    masteryCheck: 'Match a fretted E to its harmonic and locate it on two strings.',
  },
  112: {

    title: 'Phrase Gym — Copy → Vary → Own (3)',
    durationMin: 35,
    goals: [
      'Vary the rhythm of a motif you already own',
      'Keep pitch order intact, move the time',
      'Make the rhythm swing without rushing'
    ],
    theoryBite: 'Rhythm is the fastest way to make an old idea sound new. Same notes, new heartbeat. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Take your owned motif, play it as straight eighths',
      'Then dotted rhythm, then with a rest in the middle',
      'Keep the metronome steady through all three — leave a rest so the phrase can breathe',
      'Pick your favorite rhythm and repeat it — land on the root every four bars'
    ],
    libraryIds: [
      'rf-open-am'
    ],
    masteryCheck: 'The same motif in three rhythms, in time, with one you\'d keep.',
  },
  113: {

    title: 'Metronome Subdivision — Scale Eighths (3)',
    durationMin: 30,
    goals: [
      'Play scale eighths across two octaves in time',
      'Keep the shift clean without a timing hiccup',
      'End exactly on the top note with the click'
    ],
    theoryBite: 'Two octaves doubles the distance but not the tempo. The click stays the same — you just travel further.',
    drills: [
      'Two-octave scale in quarters, hands warm — land on the root every four bars',
      'Eighths, focusing on the shift note — even tone matters more than covering frets',
      'Land the top note exactly on a click — freeze if you miss',
      'Descend the scale without dragging behind the click'
    ],
    libraryIds: [
      'rf-caged-c'
    ],
    masteryCheck: 'Two-octave scale in even eighths, clean shift, landing on the click.',
  },
  114: {

    title: 'Mode Mood Board — A/B Day (3)',
    durationMin: 30,
    goals: [
      'Place one clear #4 color tone',
      'Resolve to a chord tone on purpose',
      'Keep the line singable'
    ],
    theoryBite: 'Lydian’s raised 4 is a spice, not a whole meal. Use it once per phrase against a major backdrop, then resolve so listeners feel the dream and the landing.',
    drills: [
      'Loop a short mixolydian vamp and sit in it for a minute',
      'Start the phrase in mode A, resolve in mode B — even tone matters more than covering frets',
      'Use mode B only on the last two bars — leave a rest so the phrase can breathe',
      'Record and hear which mix you liked — land on the root every four bars'
    ],
    libraryIds: [
      'sc-lydian'
    ],
    masteryCheck: 'A single phrase that starts in one mode and resolves in another, deliberately.',
  },
  115: {

    title: 'Scale → Riff Extraction (3)',
    durationMin: 30,
    goals: [
      'Use a bass-walk feel inside the riff',
      'Let the low notes carry the motion',
      'Keep the riff simple enough to groove'
    ],
    theoryBite: 'Bass motion under a riff makes it move without adding notes on top. One walking note between repeats can feel like a whole arrangement.',
    drills: [
      'Take your riff and play only its bass notes — land on the root every four bars',
      'Add a stepwise walk between them — even tone matters more than covering frets',
      'Re-attach your riff on top of the vamp — same tempo',
      'Loop it with the walk every 4 bars — land on the root every four bars'
    ],
    libraryIds: [
      'rf-c-bass-walk-study'
    ],
    masteryCheck: 'A riff with a stepwise bass walk that still grooves.',
  },
  116: {

    title: 'Chord-Scale Match Briefing (3)',
    durationMin: 30,
    goals: [
      'Play long tones that agree over a palm-mute chug',
      'Let the riff speak while you hold the note',
      'End phrases on the root or fifth'
    ],
    theoryBite: 'Riffs and long tones are partners. The chug holds time; your notes tell the story over it. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Chug the riff loop, hold the root across 4 beats',
      'Then hold the fifth, feel it lift — even tone matters more than covering frets',
      'Alternate root and fifth every phrase — leave a rest so the phrase can breathe',
      'Write one 4-bar phrase with two long tones — land on the root every four bars'
    ],
    libraryIds: [
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'Two long tones over the chug riff that both land on chord tones.',
  },
  117: {

    title: 'Weekly Scales Checkpoint (4)',
    durationMin: 30,
    goals: [
      'Move the story across two positions on the neck',
      'Keep the pulse steady while you shift',
      'End exactly on the root of the loop'
    ],
    theoryBite: 'Position shifts are just walking to a new room. The melody should feel continuous, not relocated. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Play the story in box 1, then repeat in box 2 — land on the root every four bars',
      'Shift during a rest so the move is clean — even tone matters more than covering frets',
      'Land both boxes on the same root — leave a rest so the phrase can breathe',
      'Record and check the shift didn\'t stop the flow — land on the root every four bars'
    ],
    libraryIds: [
      'rf-drop-d-power-study'
    ],
    masteryCheck: 'The same 8-bar story played across two positions with a seamless shift.',
  },
  118: {

    title: 'Neck Geography — Root Finder Drill (4)',
    durationMin: 30,
    goals: [
      'Find roots across the whole neck in under 10 seconds',
      'Land on them in time, mid-phrase',
      'Make root-finding part of playing, not a stop'
    ],
    theoryBite: 'The fastest solos are just root-to-root flights. Know the landmarks and you\'re never lost. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Call out the root\'s string/fret before you play it',
      'Find G on five strings in 30 seconds — even tone matters more than covering frets',
      'Play a phrase that lands on G from three directions',
      'Time yourself on the checkpoint and try to beat last week kindly'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Locate G on five strings in 30 seconds and land a phrase on it.',
  },
  119: {

    title: 'Phrase Gym — Copy → Vary → Own (4)',
    durationMin: 35,
    goals: [
      'Compress and expand the motif across bars',
      'Turn it into a call-and-response with yourself',
      'End the phrase with a clear answer'
    ],
    theoryBite: 'Motifs grow by being stretched and squeezed. Space is part of the sentence. Put a pulse under the shape — maps become music when time is honest.',
    drills: [
      'Play the motif twice as fast over two bars — land on the root every four bars',
      'Then stretch the same idea across four bars with more air',
      'Call (motif), rest a bar, answer with a variation',
      'Finish with the answer on the root — land on the root every four bars'
    ],
    libraryIds: [
      'rf-power'
    ],
    masteryCheck: 'A compressed motif, an expanded motif, and a call-and-answer finish.',
  },
  120: {

    title: 'Scales Capstone — 16-Bar Pent Story',
    durationMin: 30,
    goals: [
      'Tell a 16-bar story with one pentatonic box',
      'Use rhythm and space, not just notes',
      'Land the story on the root'
    ],
    theoryBite: 'A capstone is a song you invent, not a quiz. Sixteen bars, one box, a beginning and an end. Space and rhythm tell the story — note count does not.',
    drills: [
      'Map Em or Am pentatonic box 1 and mark a low start and a higher peak note',
      'Improvise a 4-bar phrase, rest, then a different 4-bar answer',
      'String two phrases into 16 bars and end on the root — record one take'
    ],
    libraryIds: [
      'sc-pent-min',
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Play a 16-bar pentatonic story with space, a small peak, and a root landing.',
  },
  121: {

    title: 'Rhythm Phase Open — Pocket Is the Skill',
    durationMin: 30,
    goals: [
      'Lock a foot pulse before fancy patterns',
      'Strum G–C–D with boring, honest time',
      'Prefer pocket at a humble tempo over chaos faster'
    ],
    theoryBite: 'Pocket is the skill under every cool chord. Today the fretting hand stays on familiar G, C, and D while the right hand owns the groove. If the foot rushes, the chords do not matter yet.',
    drills: [
      'Foot-only quarters for 45 seconds — no guitar — foot stays on quarters the whole time',
      'Muted open-string eighths with the foot locked; restart if the foot rushes',
      'One easy chord progression at 70 BPM; if changes flop, keep the right hand going anyway'
    ],
    libraryIds: [
      'pr-145',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'Two minutes where your foot never stops and most strums agree with the pulse.',
  },
  122: {

    title: 'Subdivision Clinic — 1 e & a',
    durationMin: 30,
    goals: [
      'Speak and play the grid 1 e & a without dropping syllables',
      'Place fretting-hand changes only on chosen grid slots',
      'Keep the right hand moving even when the left hand freezes'
    ],
    theoryBite: 'Subdivision is how musicians share a clock. Naming 1 e & a externalizes the grid so fretting-hand panic can\'t steal the beat.',
    drills: [
      'Count 1 e & a aloud with foot quarters for 45 seconds',
      'Muted 16th strums (or ghost strums) matching every syllable for 60 seconds',
      'Freeze a chord shape and only move the right hand on the grid for 8 bars',
      'Change chords only on beat 1 for 8 bars, then only on the & of 2 for 8 bars'
    ],
    libraryIds: [
      'pr-1645',
      'rf-jazz-chromatic-approach-study'
    ],
    masteryCheck: 'Play 16 bars where you can point to any 1 e & a slot and land a muted click there on command.',
  },
  123: {

    title: 'Syncopation Intro — Accent the Offbeat',
    durationMin: 30,
    goals: [
      'Accent offbeats on purpose instead of by accident',
      'Feel the downbeat in your body while the hand emphasizes &s',
      'Write a 4-bar accent map and Play it twice cleanly'
    ],
    theoryBite: 'Syncopation is tension against a known downbeat. If the body loses beat 1, accents become sloppy noise — keep the foot honest.',
    drills: [
      'Foot on quarters; hand accents only on & of each beat for 60 seconds muted',
      'Accent map: circle beats 2 and the & of 4 on paper, then play it',
      'Same map with G–C–D, two bars each, at a tempo you can hum',
      'Record 8 bars and check that downbeats still feel grounded'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Play your 4-bar accent map twice in a row with steady foot quarters and clear offbeat pops.',
  },
  124: {

    title: 'Shuffle vs Straight — Feel Toggle',
    durationMin: 30,
    goals: [
      'Toggle straight eighths vs long-short shuffle on command',
      'Keep the long-short ratio even when chords change',
      'Use a blues progression as the vehicle, not the distraction'
    ],
    theoryBite: 'Shuffle is a triplet-based long-short feel, not \'sloppy straight.\' The swing ratio should stay stable across the form.',
    drills: [
      'Muted straight eighths 30s, then shuffle eighths 30s, back and forth 4 times',
      'Say long-short while playing shuffle on open strings',
      'A7–D7–E7 skeleton with shuffle strum, 12 bars slow',
      'One chorus straight, one chorus shuffle — same tempo marking'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-blues-sh',
      'ch-a7'
    ],
    masteryCheck: 'Play one 12-bar chorus straight and one shuffled at the same BPM without drifting the pulse.',
  },
  125: {

    title: 'Palm Mute Engine — Chug Control',
    durationMin: 30,
    goals: [
      'Park the palm so chugs are tight without killing pitch entirely',
      'Release mute for open hits on chosen beats',
      'Keep left-hand fretting calm while the right hand drives'
    ],
    theoryBite: 'Palm mute is a dynamic and articulation tool. Edge-of-palm near the bridge shortens sustain; too far forward kills tone.',
    drills: [
      'Find the mute sweet spot on open low E: tight thunk, still pitched',
      'Chug quarters 60s, then add release hits on beat 3 only',
      'Power-shape fretting with muted eighths for 8 bars',
      'Alternate 2 bars muted / 2 bars open at steady tempo'
    ],
    libraryIds: [
      'rf-palm-mute-chug-study',
      'rf-power'
    ],
    masteryCheck: 'Play 16 bars alternating muted chug and open hits without tempo drift or left-hand squeeze.',
  },
  126: {

    title: 'Rest as a Weapon — Play Less',
    durationMin: 35,
    goals: [
      'Treat silence as a rhythmic event you can aim',
      'Stop the strings cleanly without flinching the body pulse',
      'Leave space that makes the next hit feel bigger'
    ],
    theoryBite: 'Rests are notes with zero amplitude. Great rhythm players schedule silence; beginners fill every beat from anxiety.',
    drills: [
      'Play beat 1 only; rest 2–3–4 — 8 bars muted clicks on 1',
      'Play 1 and 3; rest 2 and 4 — keep foot on all quarters',
      'Add a chord on the hits; freeze fretting hand during rests',
      'Compose a 4-bar hit chart with at least four full beats of rest total'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Play an 8-bar hit chart that includes deliberate multi-beat rests without rushing the re-entries.',
  },
  127: {

    title: 'Accent Maps — Compose a Strum Chart',
    durationMin: 30,
    goals: [
      'Compose a strum chart with written accents',
      'Make accented strums louder without speeding up',
      'Keep unaccented strums soft and even'
    ],
    theoryBite: 'Accent is relative. If everything is loud, nothing is accented. Dynamic contrast is a timing skill as much as a volume skill.',
    drills: [
      'Write accents on a blank 4-bar grid (at least 6 accent marks)',
      'Muted performance of the chart at 75 BPM — if you rush, drop back to downstrokes only',
      'Same chart with two chords, changing only on bar lines',
      'Whisper-loud check: unaccented strokes stay clearly softer'
    ],
    libraryIds: [
      'pr-1645',
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Hand a stranger (or future you) your chart and Play it so the written accents are obvious.',
  },
  128: {

    title: 'Triplet Feel — 1 trip-let',
    durationMin: 30,
    goals: [
      'Speak 1-trip-let evenly against foot quarters',
      'Strum or pick triplet grids without collapsing to straight eighths',
      'Apply triplets as a feel color inside a simple progression'
    ],
    theoryBite: 'Triplets divide the beat into three equal parts. Even speech first — uneven speech becomes uneven hands.',
    drills: [
      'Foot quarters + voice 1-trip-let for 45 seconds — foot stays on quarters the whole time',
      'Muted triplet strums matching the voice for 60 seconds',
      'G–C–D with triplet down-up patterning on one chord only, then rotate',
      'Two bars duple, two bars triple — keep foot identical'
    ],
    libraryIds: [
      'rf-blues-sh',
      'pr-12bar'
    ],
    masteryCheck: 'Alternate 2 bars of straight eighths and 2 bars of triplets for 16 bars with a steady foot.',
  },
  129: {

    title: 'Stop-Time Blues — Hits With the Imaginary Band',
    durationMin: 30,
    goals: [
      'Hit ensemble-style stop-time figures with clean silence after',
      'Re-enter on the correct beat without a flinch rush',
      'Use stop-time as arrangement drama, not random chopping'
    ],
    theoryBite: 'Stop-time is coordinated hits and rests — a band skill you can practice alone by being strict with the click.',
    drills: [
      'Click on; play only beat 1 of each bar for 8 bars',
      'Hits on 1 and the & of 2; rest elsewhere — 8 bars',
      'Apply hits to a 12-bar blues skeleton — count out loud for one cycle, then whisper',
      'Record one chorus and verify silences are truly silent'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-blues-sh'
    ],
    masteryCheck: 'Play one 12-bar stop-time chorus where every rest is clean and every re-entry lands with the click.',
  },
  130: {

    title: 'Funk Chicka — 16th Speckles',
    durationMin: 30,
    goals: [
      'Keep 16th-note ghost motion alive in the right hand',
      'Let fretting-hand chucks create the chicka without tensing shoulders',
      'Sit behind or on the beat deliberately for 8 bars each'
    ],
    theoryBite: 'Funk rhythm is often more ghost than note. The grid never stops; pitches appear as decorations on a continuous 16th engine.',
    drills: [
      '16th ghost strums muted 60 seconds at a slow BPM',
      'Add fretting-hand left mute chucks on &s for 8 bars',
      'Two-chord funk vamp: 1 bar each, ghosts continuous',
      'Shift from on-top to slightly behind the click for 8 bars'
    ],
    libraryIds: [
      'rf-funk-chicka-study'
    ],
    masteryCheck: 'Play a 16-bar funk vamp with continuous 16th ghosts and clear pitched hits on chosen slots only.',
  },
  131: {

    title: 'Ballad Space — Slow Harmonic Rhythm',
    durationMin: 30,
    goals: [
      'Slow the harmonic rhythm without dragging the pulse into mush',
      'Use dynamics instead of extra strums to keep interest',
      'Leave air between chord changes like a singer breathes'
    ],
    theoryBite: 'Ballads punish impatience. Harmonic rhythm (how often chords change) can be slow while the inner pulse stays firm.',
    drills: [
      'One chord per two bars at 60 BPM — count every beat aloud',
      'Crescendo across 4 bars on a single chord, then release',
      'Change chords only after a full sung breath — count out loud for one cycle, then whisper',
      'Play a folk melody fragment between changes (optional hum)'
    ],
    libraryIds: [
      'sg-amazing-grace',
      'sg-danny-boy-londonderry-air'
    ],
    masteryCheck: 'Play 16 slow bars with at most one chord change every two bars, steady pulse, and audible dynamic shape.',
  },
  132: {

    title: 'Push Chords — Anticipate the Downbeat',
    durationMin: 30,
    goals: [
      'Anticipate a chord on the & before the downbeat on purpose',
      'Keep the foot on the true downbeat while the harmony pushes',
      'Use pushes sparingly so they feel like arrangement, not rushing'
    ],
    theoryBite: 'A push places a harmony early against a stable meter. The ear loves the tension only if beat 1 remains clear in the body.',
    drills: [
      'Normal changes on beat 1 for 8 bars — foot stays on quarters the whole time',
      'Same progression with each change on the & of 4 — if you rush, drop back to downstrokes only',
      'Alternate pushed and square phrases every 4 bars',
      'Mute check: foot never moves with the push — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-1645',
      'rf-caged-c'
    ],
    masteryCheck: 'Play 16 bars alternating square and pushed changes with an obviously steady foot.',
  },
  133: {

    title: 'Polyrhythm Taste — 3 Against 2 Feel',
    durationMin: 35,
    goals: [
      'Feel a 3-group against a 2-pulse without losing either layer',
      'Tap one layer in the foot and the other in the hand',
      'Bring the experiment back into a simple musical vamp'
    ],
    theoryBite: 'Polyrhythm taste training builds independence. Start loud and slow; speed is not the point — layered clarity is.',
    drills: [
      'Foot in 2s; hand taps groups of 3 for 45 seconds',
      'Swap layers: foot in 3, hand in 2 — if you rush, drop back to downstrokes only',
      'Muted guitar hand plays the 3-layer while foot keeps duple',
      'Return to a plain 8th groove for 8 bars to reset'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-d-folk-pattern-study'
    ],
    masteryCheck: 'Show 30 seconds of clear 3-against-2 with foot and hand roles identifiable.',
  },
  134: {

    title: 'Texture Arrangement Lab — Play Less on Purpose',
    durationMin: 30,
    goals: [
      'Sketch a simple density plan (sparse / medium / full) for 16–32 bars',
      'Change right-hand density without changing tempo',
      'Leave at least one section mostly empty on purpose'
    ],
    theoryBite: 'Arrangement is deciding when to play less. Sparse sections make full sections hit harder. Map density on paper first — that is a pro habit, not extra homework.',
    drills: [
      'Write bar numbers 1–16 and mark S/M/F density with a pencil',
      'Play the map with muted strums only — no chord changes until the plan feels clear',
      'Add your easiest progression on top of the map; protect the sparse bars'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645',
      'sg-drums'
    ],
    masteryCheck: 'Perform a 16-bar pass where a listener could hear your density plan without a chart.',
  },
  135: {

    title: 'Click Trust — Play Behind/On/Ahead',
    durationMin: 30,
    goals: [
      'Play on top of, with, and slightly behind the click',
      'Hear the click as a collaborator, not an enemy',
      'Return to center after exploring the edges'
    ],
    theoryBite: 'The click is a lane you can drift in. On time is the center; behind feels relaxed, ahead feels urgent.',
    drills: [
      'Chug quarters, play exactly on the click, 8 bars',
      'Lean slightly behind the click for 8 bars — if you rush, drop back to downstrokes only',
      'Push slightly ahead of the beat for 8 bars, then sit back in',
      'Return to dead-center and feel the difference — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-145',
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'Label on / behind / ahead for 8 bars each without losing the form of a simple vamp.',
  },
  136: {

    title: 'Dynamic Waves — Crescendo Strum',
    durationMin: 30,
    goals: [
      'Crescendo and decrescendo across multi-bar phrases',
      'Keep tempo flat while volume moves',
      'Use dynamics as storytelling'
    ],
    theoryBite: 'Dynamics are a wave, not a switch. Ramp volume slowly so listeners ride it with you. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Strum one chord, quiet to loud over 4 bars — foot stays on quarters the whole time',
      'Shape loud to quiet over the next 4 bars on purpose',
      'Repeat with eighths, keep the tempo locked — count out loud for one cycle, then whisper',
      'Mark the loudest bar on your chart — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-drop-d-power-study'
    ],
    masteryCheck: 'An 8-bar dynamic wave (up then down) without speeding up or collapsing the groove.',
  },
  137: {

    title: 'Odd Accent — 5/4 Taste',
    durationMin: 30,
    goals: [
      'Count a simple 5/4 or 5-beat cycle without panic',
      'Loop a short riff that makes the odd meter feel natural',
      'Return to 4/4 cleanly'
    ],
    theoryBite: 'Odd meters are just 4/4 with a secret. 5/4 = one bar of 3 plus one bar of 2, counted as one loop. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Count 1-2-3, 1-2 out loud for 30 seconds — foot stays on quarters the whole time',
      'Tap all 5 beats with your foot before you add the guitar',
      'Strum a 5-beat groove: down on every beat — count out loud for one cycle, then whisper',
      'Switch back to 4/4 and feel how square it is — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-1645',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Loop 8 cycles of a 5-beat groove you can count aloud while playing.',
  },
  138: {

    title: 'Comp Patterns — Two Rights, One Left',
    durationMin: 30,
    goals: [
      'Build a two-bar comp pattern you could hand to a singer',
      'Balance low thumps and higher scratches',
      'Leave space for an imaginary vocal'
    ],
    theoryBite: 'Comping is rhythm first, chords second. A pattern you can repeat is a gift to whoever sings over it.',
    drills: [
      'Design a 2-bar pattern on paper: mark down/up strokes and rests',
      'Mute-play it 8 times at a steady tempo without rushing the changes',
      'Add the chords underneath, keeping the pattern identical',
      'Sing a nonsense line over it and keep the pattern rock-steady'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-power'
    ],
    masteryCheck: 'Loop your 2-bar comp for 16 bars with chord changes and a pattern that never blurs.',
  },
  139: {

    title: 'Genre Day — Country Boom-Chuck Deepening',
    durationMin: 30,
    goals: [
      'Separate bass notes on 1 and 3 from chucks on 2 and 4',
      'Keep boom-chuck steady through chord changes',
      'Let it feel like a train, not a scramble'
    ],
    theoryBite: 'Bass, chord, bass, chord. The thumb and the strum hand do different jobs — that split is the skill. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Bass on open D/G strings beats 1 & 3, 60 seconds',
      'Add light muted chucks on 2 and 4 once the kick pulse is solid',
      'G-C-D boom-chuck at walking tempo — count out loud for one cycle, then whisper',
      'Remove chucks 4 bars, bring them back — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: '16 bars of boom-chuck on a three-chord loop with clear bass vs chuck roles.',
  },
  140: {

    title: 'Genre Day — Rock Eighth Drive',
    durationMin: 35,
    goals: [
      'Drive straight eighths with consistent down-up energy',
      'Lean on power shapes without tensing the fretting hand',
      'Use palm mute as a texture, not a crutch'
    ],
    theoryBite: 'Rock lives in the even eighth. Two hands work as one engine: down-up, down-up, forever. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Muted eighth strums, down-up, 30 seconds — foot stays on quarters the whole time',
      'Add a power chord, keep the same right hand — if you rush, drop back to downstrokes only',
      'Palm-mute the first half of each bar — count out loud for one cycle, then whisper',
      'Open up the second half for contrast — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'rf-power',
      'pr-145',
      'rf-a-blues-turnaround-study'
    ],
    masteryCheck: '16 bars of straight eighth drive with a clean palm-mute / open contrast.',
  },
  141: {

    title: 'Weekly Rhythm Checkpoint',
    durationMin: 30,
    goals: [
      'Combine pocket, one subdivision skill, and dynamics',
      'Record evidence rather than trusting memory',
      'Name one keep and one fix afterward'
    ],
    theoryBite: 'Checkpoints combine what you\'ve built. One take that shows groove, a subdivision, and a dynamic choice is the week\'s proof.',
    drills: [
      'Play a 16-bar take with steady pocket — foot stays on quarters the whole time',
      'Add one subdivision skill (eighths or swing) — if you rush, drop back to downstrokes only',
      'Add one dynamic choice (swell or drop) — count out loud for one cycle, then whisper',
      'Listen back and name a keep and a fix — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-spanish-e-phrygian-study'
    ],
    masteryCheck: 'Save one 16-bar take showing steady time plus one expressive choice, with a written keep and fix.',
  },
  142: {

    title: 'Click Trust — Play Behind/On/Ahead (2)',
    durationMin: 30,
    goals: [
      'Play behind the beat without dragging the band',
      'Keep the click audible while you sit back',
      'Return to center for the chorus'
    ],
    theoryBite: 'Behind the beat is a color, not a mistake. The trick is coming back to center at the right moment. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Eighth chugs, sit just behind the click, 8 bars — foot stays on quarters the whole time',
      'Come back to dead-center for 4 bars — if you rush, drop back to downstrokes only',
      'Alternate behind / center every phrase — count out loud for one cycle, then whisper',
      'Keep your foot tapping the whole time — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-1645',
      'rf-jazz-chromatic-approach-study'
    ],
    masteryCheck: '8 bars behind the beat that snap back to center for the chorus.',
  },
  143: {

    title: 'Dynamic Waves — Crescendo Strum (2)',
    durationMin: 30,
    goals: [
      'Build a whole verse with a slow crescendo',
      'Hold the peak without rushing',
      'Let the chorus land with full energy'
    ],
    theoryBite: 'A verse that grows quietly makes the chorus feel twice as big. Save something for the top. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Verse groove, start at 50% volume for the first 2 bars',
      'Gain about 10% volume every 2 bars, watching your strum size',
      'Peak at the chorus entrance, then hold the energy steady',
      'Pull back to 60% for the second verse, keep the tempo locked'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'A verse that swells into a full-volume chorus, tempo never moving.',
  },
  144: {

    title: 'Odd Accent — 5/4 Taste (2)',
    durationMin: 30,
    goals: [
      'Place an accent on the \'and\' of beat 3 in 5/4',
      'Let the odd accent drive the riff',
      'Keep the other beats soft'
    ],
    theoryBite: 'The accent is what makes odd meter feel intentional, not mistaken. Accent where the groove leans. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      '5-beat loop, all beats even, count 1-2-3-4-5 out loud',
      'Add an accent on the \'and\' of beat 3, keep the rest soft',
      'Play 8 full cycles with the accent landing every single time',
      'Try the same accent on beat 5 instead, feel how the groove shifts'
    ],
    libraryIds: [
      'pr-6251',
      'rf-spider'
    ],
    masteryCheck: 'A 5/4 riff with a deliberate odd accent that stays consistent for 8 cycles.',
  },
  145: {

    title: 'Comp Patterns — Two Rights, One Left (2)',
    durationMin: 30,
    goals: [
      'Make the low-thump / high-scratch contrast obvious',
      'Keep the bass note on beat 1 every bar',
      'Let the pattern breathe without changing shape'
    ],
    theoryBite: 'Boom and chick are two voices. The low thumb is the bassist; the scratch is the drummer. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Thumb the root on beat 1, mute-scratch beats 2-4',
      'Add a high chord scratch on beat 2 only — if you rush, drop back to downstrokes only',
      'Pattern: thump, scratch, rest, scratch — count out loud for one cycle, then whisper',
      'Play 8 bars, same shape, no drift — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-145',
      'rf-blues-sh'
    ],
    masteryCheck: 'A boom-chick comp where the bass note lands on 1 every single bar.',
  },
  146: {

    title: 'Genre Day — Country Boom-Chuck Deepening (2)',
    durationMin: 30,
    goals: [
      'Move boom-chuck between G, C, and D without stopping',
      'Keep the bass note following the chord root',
      'Add a country fill without breaking the pocket'
    ],
    theoryBite: 'Boom-chuck is a vehicle. The bass follows the root, the chuck stays fixed, and the fill is a detour that returns.',
    drills: [
      'Boom-chuck G-C-D-G, 4 bars each, bass on 1 and 3',
      'Move the bass to each new root on beat 1 of the change',
      'Add a one-beat fill on the last bar of the loop, then land',
      'Loop it 4 times clean with the foot tapping the whole way'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'G-C-D-G boom-chuck with root-following bass and one clean fill per loop.',
  },
  147: {

    title: 'Genre Day — Rock Eighth Drive (2)',
    durationMin: 35,
    goals: [
      'Lock the eighth drive to a two-chord riff',
      'Change chords without dropping the down-up',
      'Add a pickup note into the next riff'
    ],
    theoryBite: 'The down-up never stops in rock. Chords change under it; the engine just keeps turning. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Eighths on one power chord for 4 bars, engine steady',
      'Switch chords on beat 1, keep the down-up engine running',
      'Add a 1-beat pickup note into the next chord change',
      'Loop the two-chord riff 8 times without the engine dropping'
    ],
    libraryIds: [
      'rf-power',
      'pr-1645',
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'A two-chord eighth-drive riff with a clean pickup, engine never dropping.',
  },
  148: {

    title: 'Weekly Rhythm Checkpoint (2)',
    durationMin: 30,
    goals: [
      'Make the checkpoint take feel like music, not a test',
      'Keep the pocket when adding the new skill',
      'Record twice and keep the better one'
    ],
    theoryBite: 'A checkpoint is a performance, not a quiz. Two takes, keep the musical one. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Warm up 2 minutes with the week\'s groove, hands loose',
      'Take one: 16 bars with the new skill included, no stopping',
      'Take two: same 16 bars, but push the feel a little more',
      'Keep the better take and write down one thing that made it work'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-funk-chicka-study'
    ],
    masteryCheck: 'Two takes with one kept, and a written reason for the choice.',
  },
  149: {

    title: 'Click Trust — Play Behind/On/Ahead (3)',
    durationMin: 30,
    goals: [
      'Push ahead of the click on purpose',
      'Let urgency build into a phrase peak',
      'Release back to center after the push'
    ],
    theoryBite: 'Ahead of the beat reads as excitement. Use it for climbs and builds, then spend the energy. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Chug eighths slightly ahead for 8 bars — foot stays on quarters the whole time',
      'Peak the phrase with an accent at the top — if you rush, drop back to downstrokes only',
      'Drop back to center for the resolution — count out loud for one cycle, then whisper',
      'Feel how the push changes the energy — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-6251',
      'rf-am-arpeggio-cascade'
    ],
    masteryCheck: 'An 8-bar push ahead that peaks, then lands back in the pocket.',
  },
  150: {

    title: 'Rhythm Capstone Mid — 32-Bar Texture Ride',
    durationMin: 30,
    goals: [
      'Ride a 32-bar texture wave without losing tempo',
      'Let density rise and fall like a story',
      'Land the final 4 bars strong'
    ],
    theoryBite: 'Texture is volume of motion, not volume of sound. A quiet busy section can still push the song forward.',
    drills: [
      'Bars 1-8: keep it sparse, two chords per bar, light touch',
      'Bars 9-16: add eighth-note strums and start building',
      'Bars 17-24: full drive, biggest strums of the form',
      'Bars 25-32: pull back to sparse and land on the root'
    ],
    libraryIds: [
      'pr-145',
      'rf-natural-harmonics-study'
    ],
    masteryCheck: '32 bars that swell and settle at one steady tempo, ending on a held chord.',
  },
  151: {

    title: 'Groove Deepening — Pocket Variations',
    durationMin: 30,
    goals: [
      'Play the same groove with three different feels',
      'Keep the pulse identical while the feel changes',
      'Pick the feel that fits the song\'s story'
    ],
    theoryBite: 'Feel is how you bend time without breaking it. Straight, swung, and half-time all live in the same bar.',
    drills: [
      'Groove straight eighths for 8 bars — foot stays on quarters the whole time',
      'Same groove, swung eighths, 8 bars — if you rush, drop back to downstrokes only',
      'Half-time feel: two strums per bar, big space — count out loud for one cycle, then whisper',
      'Switch feels every 4 bars without changing tempo'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-open-am'
    ],
    masteryCheck: 'One groove in three feels at the same tempo, switching cleanly every 4 bars.',
  },
  152: {

    title: 'Comp Patterns — Two Rights, One Left (3)',
    durationMin: 30,
    goals: [
      'Comp in a way that leaves room for lyrics',
      'Play less when the melody is busy',
      'Accent the melody\'s pickups'
    ],
    theoryBite: 'A good comp is a road with lanes. When the melody moves, you move less — stay out of the singer\'s way and lock the pocket.',
    drills: [
      'Comp 2-bar pattern, hum the melody over it — foot stays on quarters the whole time',
      'On busy melody bars, cut to downstrokes only — if you rush, drop back to downstrokes only',
      'On held notes, add a strum on beat 4 — count out loud for one cycle, then whisper',
      'Let the pattern change with the melody — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-1645',
      'rf-caged-c'
    ],
    masteryCheck: 'A comp that thins out under busy melody and fills under held notes.',
  },
  153: {

    title: 'Genre Day — Country Boom-Chuck Deepening (3)',
    durationMin: 30,
    goals: [
      'Play boom-chuck at a faster, dancing tempo',
      'Keep the bass/chuck split clear at speed',
      'Let the pattern swing slightly without rushing'
    ],
    theoryBite: 'At tempo, boom-chuck becomes a dance. The faster you go, the more the split has to be automatic. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Boom-chuck on G-C-D at 90 BPM for 4 bars, bass and chuck split clean',
      'Push to 100 BPM and keep the bass/chuck roles distinct',
      'Let the chucks swing a touch while the bass stays on time',
      'Come back to 90 BPM and feel how much control you gained'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'Boom-chuck at 100 BPM with a clear bass/chuck split and a relaxed feel.',
  },
  154: {

    title: 'Genre Day — Rock Eighth Drive (3)',
    durationMin: 35,
    goals: [
      'Build a rock groove with dynamics',
      'Play the verse quiet and the chorus heavy',
      'Use the palm mute to make the chorus hit harder'
    ],
    theoryBite: 'Quiet verse + heavy chorus is rock\'s oldest trick. Save the palm mute for the loud part. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Verse: light eighths, no palm mute, quiet and even',
      'Chorus: full palm-muted chugs, bigger and heavier',
      'Switch at the phrase boundary without rushing the change',
      'Run the whole verse-chorus form twice end to end'
    ],
    libraryIds: [
      'pr-6251',
      'rf-c-bass-walk-study'
    ],
    masteryCheck: 'A verse/chorus rock groove whose contrast comes from the palm mute.',
  },
  155: {

    title: 'Weekly Rhythm Checkpoint (3)',
    durationMin: 30,
    goals: [
      'Checkpoint with the metronome audible',
      'Show the pocket still holds when the click stays put',
      'Fix one timing spot after listening back'
    ],
    theoryBite: 'The metronome is the honest judge. One audible-click take tells you exactly where the time bends. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Set the click to the week\'s tempo and count in — foot stays on quarters the whole time',
      'Play 16 bars with the click in the room, foot locked',
      'Mark the spot where you pushed or dragged against it',
      'Replay that exact spot slowly and fix the timing'
    ],
    libraryIds: [
      'pr-145',
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'An audible-click 16-bar take with one marked timing fix applied.',
  },
  156: {

    title: 'Click Trust — Play Behind/On/Ahead (4)',
    durationMin: 30,
    goals: [
      'Move between on, behind, and ahead within one song',
      'Choose the placement that serves the section',
      'Keep the tempo rock solid through all three'
    ],
    theoryBite: 'Placement is phrasing. Verses can sit back, choruses can lean in, and the click never changes. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      '4 bars on, 4 bars behind, 4 bars ahead — foot stays on quarters the whole time',
      'Repeat with a verse/chorus story in mind — if you rush, drop back to downstrokes only',
      'Change placement only at phrase boundaries — count out loud for one cycle, then whisper',
      'Check the click is still dead center in your ear'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-drop-d-power-study'
    ],
    masteryCheck: 'On / behind / ahead mapped to a verse-chorus story at one steady tempo.',
  },
  157: {

    title: 'Dynamic Waves — Crescendo Strum (3)',
    durationMin: 30,
    goals: [
      'Use dynamics inside a single riff',
      'Accent the riff\'s peak note',
      'Keep the groove under the volume changes'
    ],
    theoryBite: 'A riff is more than notes — it\'s where you push and where you pull. Accents give it a spine. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Play the riff at one flat volume, 4 bars — foot stays on quarters the whole time',
      'Same riff, accent the peak note louder — if you rush, drop back to downstrokes only',
      'Then swell the whole riff over 4 bars — count out loud for one cycle, then whisper',
      'Return to flat and hear the difference — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-1645',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'The same riff with accent and swell, groove intact the whole time.',
  },
  158: {

    title: 'Odd Accent — 5/4 Taste (3)',
    durationMin: 30,
    goals: [
      'Turn the odd accent into a hook',
      'Make the 5-beat pattern recognizable on its own',
      'Resolve back to 4/4 on a downbeat'
    ],
    theoryBite: 'A repeated accent becomes a riff\'s identity. The odd meter stops being math and starts being a melody.',
    drills: [
      'Build a 2-bar 5/4 riff with the accent in bar 1 — foot stays on quarters the whole time',
      'Loop it until it sounds like a song intro — if you rush, drop back to downstrokes only',
      'Add a short 4/4 release section so the odd meter can breathe',
      'Move between them at a phrase boundary — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-power'
    ],
    masteryCheck: 'A 5/4 hook with a signature accent that resolves into a 4/4 section.',
  },
  159: {

    title: 'Comp Patterns — Two Rights, One Left (4)',
    durationMin: 30,
    goals: [
      'Build a comp pattern that works in a full band',
      'Match the drummer\'s backbeat',
      'Leave the bass frequencies to the bassist'
    ],
    theoryBite: 'In a band, comp is a slot, not a solo. Play the rhythmic pocket and get out of the bass\'s way. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Comp muted eighths with the backbeat — foot stays on quarters the whole time',
      'Drop the low E string from the pattern — if you rush, drop back to downstrokes only',
      'Play only beats 2 and 4 for 8 bars — count out loud for one cycle, then whisper',
      'Then the full pattern, locked to the drum feel — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-6251',
      'rf-open-g-roll-study'
    ],
    masteryCheck: 'A band-ready comp that locks to the backbeat and stays out of the bass register.',
  },
  160: {

    title: 'Genre Day — Country Boom-Chuck Deepening (4)',
    durationMin: 30,
    goals: [
      'Comp boom-chuck under a melody',
      'Thin the pattern when the melody moves',
      'Fill the space when the melody rests'
    ],
    theoryBite: 'Boom-chuck is the road; the melody is the car. When the car turns, the road can ease up. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Boom-chuck under a simple melody on G-C-D, bass steady',
      'Cut to bass-only during the busiest melody bars — if you rush, drop back to downstrokes only',
      'Add a full chord on the melody rests for color — count out loud for one cycle, then whisper',
      'Keep the foot steady the whole time, no rubber band'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'Boom-chuck comping that follows a melody\'s busy and quiet spots.',
  },
  161: {

    title: 'Genre Day — Rock Eighth Drive (4)',
    durationMin: 35,
    goals: [
      'Play eighth drive over a 12-bar blues',
      'Change chords on the blues map',
      'Keep the drive steady through every change'
    ],
    theoryBite: 'The blues map is a train track. Eighths are the engine — they don\'t care which chord they\'re over. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Chug eighths over the I chord for 4 bars, palm-muted',
      'IV chord for 2 bars, back to I for 2, engine never stops',
      'V chord, then the turnaround back into the top — count out loud for one cycle, then whisper',
      'Loop the full 12 bars twice, marking each change'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-spanish-e-phrygian-study'
    ],
    masteryCheck: '12 bars of eighth drive over the blues map, chords landing on schedule.',
  },
  162: {

    title: 'Weekly Rhythm Checkpoint (4)',
    durationMin: 30,
    goals: [
      'Checkpoint with a dynamic arc',
      'Show the week\'s rhythm skills inside a form',
      'Keep the tempo identical through the arc'
    ],
    theoryBite: 'A rhythm checkpoint with dynamics proves you own the whole skill, not just the notes. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      '16 bars: soft start, build, peak, settle — foot stays on quarters the whole time',
      'Include the week\'s pattern in the build — if you rush, drop back to downstrokes only',
      'Keep the click steady through the whole arc — count out loud for one cycle, then whisper',
      'Listen back once and grade only the dynamic arc, not note spam'
    ],
    libraryIds: [
      'pr-1645',
      'rf-jazz-chromatic-approach-study'
    ],
    masteryCheck: 'A 16-bar dynamic-arc take with the week\'s pattern and a steady tempo.',
  },
  163: {

    title: 'Click Trust — Play Behind/On/Ahead (5)',
    durationMin: 30,
    goals: [
      'Use placement to make a groove breathe',
      'Sync placement with a band feel, not alone',
      'Keep your foot the metronome'
    ],
    theoryBite: 'Grooves breathe when placement shifts with the section. Your foot is the only metronome you carry. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Travis-style pattern, sit slightly behind on the verse',
      'Lean ahead of the click on the fill, then reset — if you rush, drop back to downstrokes only',
      'Return to dead-center timing for the chorus — count out loud for one cycle, then whisper',
      'Tap your foot the whole time and never let it stop'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'A travis-style groove whose placement breathes with the form, foot steady throughout.',
  },
  164: {

    title: 'Dynamic Waves — Crescendo Strum (4)',
    durationMin: 30,
    goals: [
      'Shape a 16-bar section with dynamics alone',
      'Make the form visible without changing chords',
      'Keep the foot tapping through every change'
    ],
    theoryBite: 'You can map a song\'s form with nothing but volume. Loud is the chorus; soft is the story. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      '16 bars: soft intro, build, loud peak, settle — foot stays on quarters the whole time',
      'Play it with one chord the whole way — if you rush, drop back to downstrokes only',
      'Listen back and mark where the form shows — count out loud for one cycle, then whisper',
      'Add the actual chords once the map works — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-6251',
      'rf-spider'
    ],
    masteryCheck: 'A 16-bar dynamic shape that reads as a form even on one chord.',
  },
  165: {

    title: 'Odd Accent — 5/4 Taste (4)',
    durationMin: 30,
    goals: [
      'Comp in 5/4 without counting aloud',
      'Let the body feel the odd cycle',
      'Keep the chord changes on the same beats each loop'
    ],
    theoryBite: 'Odd meters become body knowledge. Once your foot feels the 5, your hands can stop counting. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Feel 5 with your foot, no counting aloud, 30s — foot stays on quarters the whole time',
      'Comp one chord across the 5 beats — if you rush, drop back to downstrokes only',
      'Change chords on beat 1 of each cycle — count out loud for one cycle, then whisper',
      'Two chords per cycle, same anchor beat — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-145',
      'rf-blues-sh'
    ],
    masteryCheck: '5/4 comping with silent counting and changes that land on the same beat every cycle.',
  },
  166: {

    title: 'Comp Patterns — Two Rights, One Left (5)',
    durationMin: 30,
    goals: [
      'Vary the comp pattern without losing its identity',
      'Change one element at a time',
      'Keep the singer anchored through every change'
    ],
    theoryBite: 'Variation is one changed element, not a new pattern. The singer needs the road to stay the road. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Play your base comp pattern for 4 bars at a relaxed tempo',
      'Change only the ending strum on the last beat of bar 4',
      'Change only the bass note\'s octave, keep the rest identical',
      'Return to base and hear how the small variation landed'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Three variations of one comp pattern, each changing a single element.',
  },
  167: {

    title: 'Genre Day — Country Boom-Chuck Deepening (5)',
    durationMin: 30,
    goals: [
      'Put a country walk-up into the boom-chuck',
      'Move the bass toward the next root',
      'Return to the pattern without losing the pocket'
    ],
    theoryBite: 'A walk-up is a bass line that leans toward the next chord. One or two steps is all country needs. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Boom-chuck G to C, walking the bass G-A-B-C under it',
      'C to D, walk the bass C-D-E-D and land clean — if you rush, drop back to downstrokes only',
      'Alternate plain and walking versions every 4 bars',
      'End every loop back on G with a solid root — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'A boom-chuck loop with a clean walk-up between two chords, pocket intact.',
  },
  168: {

    title: 'Genre Day — Rock Eighth Drive (5)',
    durationMin: 35,
    goals: [
      'Build a riff from a single eighth-drive cell',
      'Repeat the cell with a variation each time',
      'Make the riff recognizable on its own'
    ],
    theoryBite: 'Riffs are cells that repeat. Same engine, small variation, and suddenly it\'s a song intro. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Write a 1-bar eighth-note cell on paper first — foot stays on quarters the whole time',
      'Repeat it exactly for 4 bars, no variation yet — if you rush, drop back to downstrokes only',
      'Change only the last beat on repeat 3, keep the rest',
      'Loop it until the variation sounds like a hook, not a mistake'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-funk-chicka-study'
    ],
    masteryCheck: 'A 1-bar cell riff with one deliberate variation that reads as a hook.',
  },
  169: {

    title: 'Weekly Rhythm Checkpoint (5)',
    durationMin: 30,
    goals: [
      'Checkpoint with a band feel, not alone',
      'Use a backing track for the take',
      'Lock into the track\'s pocket'
    ],
    theoryBite: 'A backing track is the closest thing to a band. Locking into it tests your pocket for real. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Pick a drumless or very sparse backing track — foot stays on quarters the whole time',
      'Play the week\'s groove over it, lock to the feel',
      'Match the track\'s dynamics and phrasing, not just tempo',
      'Record one take and check how tight the lock is — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-6251',
      'rf-am-arpeggio-cascade'
    ],
    masteryCheck: 'One take over a backing track that locks to its pocket.',
  },
  170: {

    title: 'Click Trust — Play Behind/On/Ahead (6)',
    durationMin: 30,
    goals: [
      'Play over the click with long tones placed by feel',
      'Let natural harmonics sit behind the pulse',
      'Return to center on the downbeat'
    ],
    theoryBite: 'Harmonics ring longer than you expect. Place them behind the beat so they bloom into the pulse. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Play a natural harmonic, let it ring a full bar — foot stays on quarters the whole time',
      'Enter slightly behind the click on each one — if you rush, drop back to downstrokes only',
      'Resolve to a fretted note on beat 1 — count out loud for one cycle, then whisper',
      'Alternate harmonic / fretted every bar — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-145',
      'rf-natural-harmonics-study'
    ],
    masteryCheck: 'Harmonics placed behind the beat that bloom and resolve on the downbeat.',
  },
  171: {

    title: 'Dynamic Waves — Crescendo Strum (5)',
    durationMin: 30,
    goals: [
      'Play dynamics as a duet partner',
      'Answer the groove\'s volume with your own',
      'Leave space for the other player'
    ],
    theoryBite: 'Dynamics are a conversation. If the groove is loud, answer loud; if it drops, drop with it. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Comp quietly under a loud groove, keep it in the pocket',
      'Trade: 4 bars loud, 4 bars soft, same pattern — if you rush, drop back to downstrokes only',
      'Match the groove\'s swell exactly when it rises — count out loud for one cycle, then whisper',
      'Then deliberately contrast it to hear the difference'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-open-am'
    ],
    masteryCheck: '4 bars matching the groove\'s volume, then 4 bars contrasting — both in time.',
  },
  172: {

    title: 'Odd Accent — 5/4 Taste (5)',
    durationMin: 30,
    goals: [
      'Layer the odd accent under a solo',
      'Let the solo breathe while the riff holds 5',
      'Land the solo\'s peak on the accent'
    ],
    theoryBite: 'The riff is the metronome when you solo in 5. Your notes can dance around it as long as the accent holds.',
    drills: [
      'Loop the 5/4 riff with its accent — foot stays on quarters the whole time',
      'Solo on one string, land on the accent beat — if you rush, drop back to downstrokes only',
      'Rest on the accent, play on the other beats — count out loud for one cycle, then whisper',
      'End the solo on the riff\'s anchor note — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-1645',
      'rf-caged-c'
    ],
    masteryCheck: 'A short solo over the 5/4 riff whose phrases land on the accent.',
  },
  173: {

    title: 'Comp Patterns — Two Rights, One Left (6)',
    durationMin: 30,
    goals: [
      'Comp with dynamics that follow the song',
      'Swell under the build, thin at the peak',
      'Keep the pattern through the whole arc'
    ],
    theoryBite: 'The comp is the song\'s pulse. It can swell and thin, but it must never stop being the pulse. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Comp the base pattern at 50% volume for the first pass',
      'Swell to 100% over 8 bars, growing strum size steadily',
      'Thin to downstrokes only at the peak for extra power',
      'Settle back to 50% for the outro, tempo never moving'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-d-folk-pattern-study'
    ],
    masteryCheck: 'A full comp arc — swell, peak, settle — with the pattern intact throughout.',
  },
  174: {

    title: 'Genre Day — Country Boom-Chuck Deepening (6)',
    durationMin: 30,
    goals: [
      'Play boom-chuck as a full song arrangement',
      'Use dynamics to shape verse and chorus',
      'Finish with a strummed outro'
    ],
    theoryBite: 'A song arrangement is boom-chuck plus a story. Verses sit back, choruses push, the outro lets it ring.',
    drills: [
      'Verse: boom-chuck on G-C-D at 60% volume, easy and warm',
      'Chorus: full boom-chuck at 100%, open it up — if you rush, drop back to downstrokes only',
      'Bridge: bass-only for 4 bars, then back in — count out loud for one cycle, then whisper',
      'Outro: final chord, let it ring out and breathe — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'A complete boom-chuck arrangement with dynamic verse/chorus contrast.',
  },
  175: {

    title: 'Genre Day — Rock Eighth Drive (6)',
    durationMin: 35,
    goals: [
      'Play a full rock song arrangement',
      'Use drive, mutes, and dynamics as the story',
      'End the song with a clear button'
    ],
    theoryBite: 'Arrangement is choosing the energy per section. Drive, drop, drive, stop — that\'s a song. If the foot rushes, the hands will too; rebuild from quarters.',
    drills: [
      'Intro: muted eighth chugs, building anticipation',
      'Verse: light drive, half the volume, keep it moving',
      'Chorus: full palm-muted power, biggest moment yet',
      'Outro: final chord, let it ring and fade naturally'
    ],
    libraryIds: [
      'pr-145',
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'A complete rock arrangement with distinct energy per section and a clear ending.',
  },
  176: {

    title: 'Weekly Rhythm Checkpoint (6)',
    durationMin: 30,
    goals: [
      'Checkpoint the full rhythm toolkit',
      'Comp, groove, and dynamic a full form',
      'End with a take worth keeping'
    ],
    theoryBite: 'The rhythm phase\'s final checkpoint is a mini-set. Comp, drive, dynamics, and a finish — that\'s the toolkit.',
    drills: [
      'Warm up: groove, comp pattern, dynamics — foot stays on quarters the whole time',
      'Take a full 32-bar form without stopping to restart bars',
      'Include every week\'s skill at least once — count out loud for one cycle, then whisper',
      'Keep the best take and write the next step — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-drop-d-power-study'
    ],
    masteryCheck: 'A 32-bar take using comp, groove, and dynamics, with a written next step.',
  },
  177: {

    title: 'Click Trust — Play Behind/On/Ahead (7)',
    durationMin: 30,
    goals: [
      'Solo with placement as your phrasing tool',
      'Sit back on long notes, push on the run',
      'Return to center on the chord change'
    ],
    theoryBite: 'Placement turns a scale into a sentence. Long notes sit back; runs lean in; the change pulls you home.',
    drills: [
      'Play a long bend, sitting behind the beat on purpose',
      'Run up the scale slightly ahead, then pull it back',
      'Land the chord change dead-center, no rushing it',
      'Repeat the whole sequence with your eyes closed — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-1645',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'A solo phrase using placement — behind on bends, ahead on runs, center on changes.',
  },
  178: {

    title: 'Dynamic Waves — Crescendo Strum (6)',
    durationMin: 30,
    goals: [
      'Put a dynamic arc on a full song section',
      'Peak exactly at the section\'s emotional top',
      'Land the resolution softly'
    ],
    theoryBite: 'The arc is the song\'s heartbeat. Build where it needs to climb, spend it at the peak, rest at the end.',
    drills: [
      'Map the section: soft / build / peak / settle — foot stays on quarters the whole time',
      'Play it through with dynamics only — if you rush, drop back to downstrokes only',
      'Move the peak one bar and hear it change — count out loud for one cycle, then whisper',
      'Perform the arc three times clean — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-power'
    ],
    masteryCheck: 'A full section with a dynamic arc that peaks where the song wants it.',
  },
  179: {

    title: 'Odd Accent — 5/4 Taste (6)',
    durationMin: 30,
    goals: [
      'Play a full 12-bar form in 5/4',
      'Keep the odd meter through the changes',
      'Finish the form without counting aloud'
    ],
    theoryBite: 'Odd meter forms are the same forms with a different ruler. 12 bars of 5 is still a blues, just leaner.',
    drills: [
      'Map 12 bars of 5/4 on paper: chord per bar, accent marked on paper: chord per bar, accent marked',
      'Play the I chord, then IV, then V on their usual bars',
      'Keep the accent pattern through every change — count out loud for one cycle, then whisper',
      'Run the whole form, foot driving — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-6251',
      'rf-open-g-roll-study'
    ],
    masteryCheck: 'A 12-bar 5/4 form with correct changes and a steady accent through every bar.',
  },
  180: {

    title: 'Rhythm Checkpoint — Bridge Toward Lead',
    durationMin: 30,
    goals: [
      'Bridge rhythm into lead with one clean groove',
      'Play the groove that will underpin next week\'s lead',
      'Leave the phase with a pocket you trust'
    ],
    theoryBite: 'Every lead you\'ll play sits on a groove. This checkpoint makes sure the floor is solid before you walk on it.',
    drills: [
      'Groove the 12-bar blues for 4 full passes, no stopping',
      'Mark each chord change without dropping the pocket',
      'Add one dynamic swell per chorus, subtle at first',
      'Record one full clean pass and listen back once — foot stays on quarters the whole time'
    ],
    libraryIds: [
      'pr-145',
      'rf-a-blues-turnaround-study'
    ],
    masteryCheck: '4 clean passes of the 12-bar groove with marked changes and one swell per chorus.',
  },
  181: {

    title: 'Lead Phase Open — Say Something, Then Listen',
    durationMin: 30,
    goals: [
      'Play a short call phrase in minor pentatonic',
      'Leave a full bar of rest on purpose',
      'Answer with fewer notes than the call'
    ],
    theoryBite: 'Lead guitar is conversation: say something, leave space, answer. Minor pentatonic is enough vocabulary for a whole honest solo if rhythm and silence do their jobs.',
    drills: [
      'Three-note motif only for two minutes — change rhythm, not note count',
      'Call two bars, rest two bars, answer two bars over a slow vamp',
      'Record one take and circle any phrase that ran from nerves instead of intention'
    ],
    libraryIds: [
      'sc-pent-min',
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Play eight bars that include intentional silence and a clear ending note.',
  },
  182: {

    title: 'Bends 101 — Target Pitch',
    durationMin: 35,
    goals: [
      'Bend a whole step up to a named target pitch',
      'Hear the target before you play it',
      'Land the bend in tune, not just in the neighborhood'
    ],
    theoryBite: 'A bend is a slide to a pitch you\'ve already heard. If you can hum it, you can land it. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Fret the target note first and play it clean — end the phrase on a chord tone when you can',
      'Bend up to that same pitch from a whole step below',
      'Match: play target, then bend, then compare — silence counts as part of the lick',
      'Hold the bend 2 beats in tune, then release — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Bend a whole step and land on the exact pitch you played a second earlier.',
  },
  183: {

    title: 'Vibrato — Controlled Wave',
    durationMin: 30,
    goals: [
      'Produce an even vibrato wave you could conduct with your hand',
      'Start vibrato after the note speaks, not as a nervous shake on attack',
      'Match vibrato width to style: narrow for ballad, wider for blues color'
    ],
    theoryBite: 'Vibrato is controlled pitch oscillation. Even rate reads as intention; chaotic shake reads as tension.',
    drills: [
      'Long tone 4 beats with no vibrato — pure — end the phrase on a chord tone when you can',
      'Same tone with slow even vibrato for 4 beats — half volume on the answer phrase',
      'Alternate straight and vibrato every 2 beats for 8 bars',
      'Apply vibrato only on the last note of each phrase'
    ],
    libraryIds: [
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Hold a 4-beat note with even vibrato that stays centered on the intended pitch.',
  },
  184: {

    title: 'Slides — Connect Positions Musically',
    durationMin: 30,
    goals: [
      'Connect positions with slides that land in time',
      'Decide whether the slide is the expression or just transport',
      'Keep fretting pressure just enough to maintain tone through the slide'
    ],
    theoryBite: 'Slides glue positions into one voice. Timed landings matter — a late slide is a rhythmic error, not only a pitch gesture.',
    drills: [
      'Slide into a target fret from 2 frets below on the beat',
      'Ascending slide phrase across 3 frets, descend with separate frets',
      'Call-response: fretted answer vs slid answer — silence counts as part of the lick',
      '8 bars using at most one slide per bar — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Play an 8-bar phrase where every slide lands on a chosen beat and target fret.',
  },
  185: {

    title: 'Hammer-ons & Pull-offs — Legato Seed',
    durationMin: 30,
    goals: [
      'Hammer-ons and pull-offs speak as loud as picked notes',
      'Keep left-hand timing even when the pick rests',
      'Mix one picked attack with two legato notes as a cell'
    ],
    theoryBite: 'Legato shifts timekeeping partly into the fretting hand. Even hammers/pulls need the same subdivision honesty as alternate picking.',
    drills: [
      'Hammer 0→2→0 on one string slowly 60s — end the phrase on a chord tone when you can',
      'Pull-off 3→1→0 with clear lower notes — half volume on the answer phrase',
      'Cell: pick, hammer, pull — loop in time — silence counts as part of the lick',
      'Apply cell inside minor pentatonic box for 8 bars'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c',
      'sg-wild-mountain-thyme'
    ],
    masteryCheck: 'Loop a pick-hammer-pull cell for 8 bars in time with audible evenness.',
  },
  186: {

    title: 'Double Stops — Two-Note Harmony',
    durationMin: 30,
    goals: [
      'Fret two notes that ring together without one choking',
      'Move a double-stop shape in time like a mini-chord melody',
      'Use double-stops as hooks, not constant thickness'
    ],
    theoryBite: 'Double-stops are portable harmony. Thirds and fourths outline chord color with less bulk than full grips.',
    drills: [
      'Find a comfortable third shape on G/B strings; ring 4 beats',
      'Move the shape up 2 frets in time — half volume on the answer phrase',
      'Alternate single-note line and double-stop hit every bar',
      '8-bar hook using only two double-stop shapes — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-open-am'
    ],
    masteryCheck: 'Play an 8-bar idea that features at least four clean double-stop hits in rhythm.',
  },
  187: {

    title: 'Call From Vocals — Sing Then Solo',
    durationMin: 30,
    goals: [
      'Sing a short phrase, then play it (approximation welcome)',
      'Let the voice set rhythm before the fingers invent complexity',
      'Prefer singable intervals over guitaristic sprawl'
    ],
    theoryBite: 'Voice-first phrasing fights finger patterns that don\'t mean anything. Even hummed contours improve melodic honesty.',
    drills: [
      'Hum 1 bar, rest 1 bar — 4 cycles — end the phrase on a chord tone when you can',
      'Play the contour on one string as close as you can',
      'Repeat on pentatonic box with the same rhythm — silence counts as part of the lick',
      'Drop any note you can\'t sing back — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-blues-sh',
      'sg-house-of-the-rising-sun'
    ],
    masteryCheck: 'Show one phrase you can both hum and play with matching rhythm.',
  },
  188: {

    title: 'Motif Development — Same Notes New Rhythms',
    durationMin: 30,
    goals: [
      'Keep pitch set stable while rhythm changes',
      'Sequence a motif up or down without losing its identity',
      'End phrases on chord tones when a vamp is present'
    ],
    theoryBite: 'Motif development is classical and rock craft alike: same DNA, new clothes. Listeners track rhythm and contour more than note count.',
    drills: [
      'Write a simple 4-note motif you can hum back immediately',
      'Play it in quarter notes, then eighths, then mixed',
      'Sequence it starting one scale degree higher, three times',
      'Resolve the last note to a chord root or third — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'sg-joshua-fit-the-battle-of-jericho',
      'sg-buffalo-gals'
    ],
    masteryCheck: 'Present one motif in three rhythms and one sequence without losing recognizability.',
  },
  189: {

    title: 'Targeting 3rds — Sweet Notes Over Chords',
    durationMin: 35,
    goals: [
      'Name chord tones 1–3–5 under a slow progression',
      'Land phrase endings on 3rds or 5ths on purpose',
      'Use non-chord tones as paths, not permanent homes'
    ],
    theoryBite: 'Targeting 3rds and 5ths makes solos sound \'inside\' the harmony. Random pentatonic running ignores the chord of the moment.',
    drills: [
      'On G–C–D, play only roots for 8 bars — end the phrase on a chord tone when you can',
      'Only 3rds for 8 bars (find them) — half volume on the answer phrase',
      'Phrase that ends on a 3rd of each chord — silence counts as part of the lick',
      'Add approach notes from a half step below the target'
    ],
    libraryIds: [
      'rf-g-caged-run-study',
      'sg-auld-lang-syne'
    ],
    masteryCheck: 'Over a 3-chord loop, end four consecutive phrases on a chord tone of the chord in force.',
  },
  190: {

    title: 'Octave Melodies — Simple & Huge',
    durationMin: 30,
    goals: [
      'Fret octave shapes cleanly with muted middle string',
      'Move a melody in octaves without flapping tempo',
      'Use octaves for climactic lines, not constant density'
    ],
    theoryBite: 'Octave melodies read as huge and simple. Mute the string between the octave frets to avoid clashing noise.',
    drills: [
      'Build an octave shape on D/G or G/e strings; mute middle',
      'Play a 3-note melody in octaves slowly — half volume on the answer phrase',
      'Alternate single-note and octave statements — silence counts as part of the lick',
      '8 bars ending with an octave hook — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-caged-c'
    ],
    masteryCheck: 'Play an 8-bar octave melody with clear muting and steady time.',
  },
  191: {

    title: 'Dynamics in Lead — Whisper to Shout',
    durationMin: 30,
    goals: [
      'Play the same lick whisper-soft and then boldly',
      'Use pick height and speed, not only fretting force, for dynamics',
      'Shape a solo paragraph soft→loud→soft'
    ],
    theoryBite: 'Lead dynamics are storytelling. Identical pitches at one volume feel flat; arcs feel composed. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'One lick pp for 4 bars, ff for 4 bars — end the phrase on a chord tone when you can',
      'Crescendo across an 8-bar soloette — half volume on the answer phrase',
      'Decrescendo ending that still stays in tune on bends',
      'Mark dynamic hairpins on paper, then obey them — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-am-arpeggio-cascade',
      'sg-sailor-s-hornpipe'
    ],
    masteryCheck: 'Play a 12-bar lead sketch with an obvious soft-loud-soft arc.',
  },
  192: {

    title: 'Space Solo Challenge — 50% Silence',
    durationMin: 30,
    goals: [
      'Aim for about half the timeline silent in a practice solo',
      'Let the band (or vamp) speak between your sentences',
      'Notice urge-to-fill and refuse it once per phrase'
    ],
    theoryBite: 'Space is a lead technique. Dense note streams often signal fear of silence more than musical abundance.',
    drills: [
      'Solo rule: maximum 2 beats of notes per bar for 8 bars',
      'Call one bar, rest one bar — strict. The rest is part of the lick',
      'Play a blues chorus leaving bars 2, 4, 6 mostly empty',
      'Listen back and celebrate the air — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-natural-harmonics-study',
      'sg-shenandoah'
    ],
    masteryCheck: 'Deliver a 12-bar soloette that\'s roughly 50% silence and still feels intentional.',
  },
  193: {

    title: 'Blues Language — Call Licks Over 12-Bar',
    durationMin: 30,
    goals: [
      'Call a lick in bar 1–2 and answer in bar 3–4',
      'Honor the 12-bar form landmarks (IV and V arrivals)',
      'Use bends and space as blues vocabulary, not only scales'
    ],
    theoryBite: 'Blues lead is language over a known form. Form awareness beats scale-shape tourism. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Speak the 12-bar form while comping simply — end the phrase on a chord tone when you can',
      'Call-lick on the I chord, then answer still on I — leave space',
      'New call on IV, answer resolving toward I — silence counts as part of the lick',
      'Full chorus with at least two clear call-response pairs'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-blues-sh',
      'rf-a-blues-turnaround-study'
    ],
    masteryCheck: 'Play one 12-bar chorus with two audible call-response pairs and clear IV/V awareness.',
  },
  194: {

    title: 'Major Key Lead — Happy Notes Over G',
    durationMin: 30,
    goals: [
      'Favor major pentatonic color over minor blues default',
      'Land on major 3rds for \'happy\' resolutions',
      'Avoid accidental minor 3rds unless you mean blues spice'
    ],
    theoryBite: 'Major-key lead needs major-side note choices. Minor pentatonic over major can work as blues, but intentional major color is a separate skill.',
    drills: [
      'Map major pentatonic box relative to G — end the phrase on a chord tone when you can',
      'Play only major pent notes for 8 bars over G–C–D',
      'Target B notes (3rd of G) on phrase endings — silence counts as part of the lick',
      'Contrast 4 bars minor pent vs 4 bars major pent — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-caged-c',
      'sg-down-by-the-riverside'
    ],
    masteryCheck: 'Solo 8 bars in a clearly major color over a G progression without defaulting to blues box clichés the whole time.',
  },
  195: {

    title: 'Lead Capstone — 24-Bar Story Solo',
    durationMin: 30,
    goals: [
      'Plan a beginning, middle, and end before you play',
      'Save higher register or denser rhythm for later',
      'End with a memorable short motif, not a random stop'
    ],
    theoryBite: 'A solo story budgets energy. Opening dense leaves nowhere to climb; opening simple lets the arc work.',
    drills: [
      'Write a 3-part plan: sparse / develop / peak — end the phrase on a chord tone when you can',
      'Play 8+8+8 bars following the plan over a vamp — half volume on the answer phrase',
      'Reuse opening motif at the end varied — silence counts as part of the lick',
      'Listen once: did the peak arrive too early? — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'sg-the-parting-glass'
    ],
    masteryCheck: 'Play a 24-bar solo sketch with an obvious arc and a related ending motif.',
  },
  196: {

    title: 'Sequence Climb — Melodic Sequences Up',
    durationMin: 35,
    goals: [
      'Move a 4-note cell up the scale in steps',
      'Keep the rhythm identical as the pitch climbs',
      'Stop before the sequence turns into noise'
    ],
    theoryBite: 'Sequences give a solo direction. The listener feels the climb coming before you arrive. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Play a 4-note cell on one string set — end the phrase on a chord tone when you can',
      'Repeat it one scale step higher, same rhythm — half volume on the answer phrase',
      'Three climbs, then a long tone on the root — silence counts as part of the lick',
      'Keep the metronome ticking under every repeat — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-c-bass-walk-study',
      'sg-the-streets-of-laredo'
    ],
    masteryCheck: 'Climb a 4-note cell three times in rhythm and resolve to the root.',
  },
  197: {

    title: 'Question Harmony — Solo Over Andalusian',
    durationMin: 30,
    goals: [
      'Map the Andalusian cadence by ear',
      'Change color as the harmony changes',
      'Resolve into E when the cadence lands'
    ],
    theoryBite: 'The Andalusian cadence walks down Am–G–F–E — the E phrygian home. Each chord is a color; E is the answer.',
    drills: [
      'Loop Am–G–F–E and hum the root each bar — end the phrase on a chord tone when you can',
      'Play one note per chord, landing on E — half volume on the answer phrase',
      'Add a second melody note on the F bar without rushing the hand',
      'Finish every phrase on E for a full pass — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'A full Andalusian pass where every phrase resolves into E.',
  },
  198: {

    title: 'Economy Picking Seed',
    durationMin: 30,
    goals: [
      'Skip strings with a single sweep, not a second stroke',
      'Feel the pick stay down through the skip',
      'Keep the notes even across the jump'
    ],
    theoryBite: 'Economy picking keeps the pick moving the same direction across a string skip — one motion, two notes.',
    drills: [
      'Two strings apart: downstroke on string A, keep down onto string B',
      'Play the pair slowly, no re-pick — half volume on the answer phrase',
      'Add a third string to the sweep only when two strings are even',
      'Alternate sweep directions and repeat until both feel honest'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'A three-string skip played with one continuous pick direction.',
  },
  199: {

    title: 'Hybrid Picking Taste',
    durationMin: 30,
    goals: [
      'Pluck with the middle finger while the pick plays',
      'Keep bass and melody separate',
      'Balance the two volumes'
    ],
    theoryBite: 'Hybrid picking is a second hand inside one — the pick takes the bass, the fingers take the melody. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Pick a low note, pluck a high note with the middle finger',
      'Same rhythm pattern, two strings apart — watch the fretting gaps',
      'Balance the volumes until they match — silence counts as part of the lick',
      'Play a two-note groove for 30 seconds — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'A two-voice pattern where pick and middle finger play balanced notes together.',
  },
  200: {

    title: 'Motif From a PD Song',
    durationMin: 30,
    goals: [
      'Take a 4-note melody from a public-domain song',
      'Turn it into a repeatable motif',
      'Quote it inside your own phrase'
    ],
    theoryBite: 'Songs are full of ready-made motifs. Borrow one, make it yours, and it becomes your voice too. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Pick 4 notes from a PD melody you already know — end the phrase on a chord tone when you can',
      'Play them as a motif with your own rhythm, not the original',
      'Repeat the motif three times, identical each pass',
      'End with a variation on the last note to close the phrase'
    ],
    libraryIds: [
      'sg-careless-love',
      'sg-auld-lang-syne'
    ],
    masteryCheck: 'A 4-note song motif played as your own idea, repeated with one variation.',
  },
  201: {

    title: 'Weekly Lead Checkpoint',
    durationMin: 30,
    goals: [
      'Assemble the week\'s lead tools into one take',
      'Include space plus one expressive tool',
      'Name one keep and one fix'
    ],
    theoryBite: 'Checkpoints collect the week into one honest take. The name of the game is assembly, not perfection.',
    drills: [
      'Warm the week\'s lead material briefly, loose hands',
      'One take: space plus one expressive tool, no heroics',
      'Listen back once, kindly, and note what worked — silence counts as part of the lick',
      'Write one keep and one fix for next week\'s session'
    ],
    libraryIds: [
      'rf-open-g-roll-study',
      'sg-greensleeves'
    ],
    masteryCheck: 'One lead take showing space plus one expressive tool, with a written keep and fix.',
  },
  202: {

    title: 'Bend Vocabulary — Release & Pre-Bend',
    durationMin: 30,
    goals: [
      'Learn the release as its own move, not the bend\'s afterthought',
      'Pre-bend a half step silently, then let the note drop in on beat',
      'Choose bend or pre-bend based on what the melody wants'
    ],
    theoryBite: 'A bend lands you high; a pre-bend lands you low and arriving. Both are words in the same sentence. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Half-step pre-bend on the G string, release on beat 1',
      'Trade: bend up, then pre-bend and release, four bars each',
      'End two phrases with a release instead of a fresh bend',
      'Keep the target note ringing through the release'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Land a pre-bend release clean, then trade bend vs release across two phrases.',
  },
  203: {

    title: 'Sequence Climb — Melodic Sequences Up (2)',
    durationMin: 35,
    goals: [
      'Climb with a cell that changes direction',
      'Sequence down as smoothly as up',
      'Let the pattern breathe before it returns'
    ],
    theoryBite: 'What goes up must come down. A downward sequence lands with just as much pull. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Run the cell up three steps of the scale, even rhythm',
      'Then down three steps, same rhythm, no accent drift',
      'Add a rest between the two directions to reset — silence counts as part of the lick',
      'Resolve on the root after the final descent — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-spanish-e-phrygian-study',
      'sg-wayfaring-stranger'
    ],
    masteryCheck: 'A cell that climbs three steps and descends three steps, resolving cleanly.',
  },
  204: {

    title: 'Question Harmony — Solo Over Andalusian (2)',
    durationMin: 30,
    goals: [
      'Use Phrygian color over the E',
      'Make the E bar feel dark, then released',
      'Keep the F bar bright in contrast'
    ],
    theoryBite: 'Phrygian\'s flat 2 makes E feel dark and tense. The F chord is the bright window in the dark room. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Play E Phrygian phrases on the E bar only — end the phrase on a chord tone when you can',
      'Switch to F-major-ish lines on the F bar — half volume on the answer phrase',
      'Contrast the two colors across two passes — silence counts as part of the lick',
      'End each pass on E and let it ring — no nervous extra notes'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'Two-bar color contrast: dark Phrygian on E, bright on F, resolving each time.',
  },
  205: {

    title: 'Economy Picking Seed (2)',
    durationMin: 30,
    goals: [
      'Sweep a five-note pattern cleanly',
      'Keep the rhythm even through the sweep',
      'Stop before speed breaks the tone'
    ],
    theoryBite: 'Sweeps are about economy of motion. Even notes matter more than fast notes. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Five-note shape across three strings, fretted cleanly',
      'One pick direction only, metronome at a relaxed 60',
      'Slow and even, then nudge one notch faster — silence counts as part of the lick',
      'Back down a notch if any note starts to disappear'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'A five-note sweep at a tempo where every note still speaks.',
  },
  206: {

    title: 'Hybrid Picking Taste (2)',
    durationMin: 30,
    goals: [
      'Play a bass-pick and finger melody line',
      'Keep the thumb steady under the fingers',
      'Make the melody sing above the bass'
    ],
    theoryBite: 'The thumb anchors the groove; the fingers float the melody. Let the thumb stay, let the fingers move.',
    drills: [
      'Thumb on the low string, steady quarters — end the phrase on a chord tone when you can',
      'Middle finger melody on the high strings — half volume on the answer phrase',
      'Keep the bass even while the melody moves — silence counts as part of the lick',
      'One 8-bar loop with a simple melody on top of the pad'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'An 8-bar loop with a steady thumb bass and a singing finger melody.',
  },
  207: {

    title: 'Motif From a PD Song (2)',
    durationMin: 30,
    goals: [
      'Use a ragtime motif from a public-domain tune',
      'Keep the syncopation intact',
      'Land the motif\'s rhythm cleanly'
    ],
    theoryBite: 'Ragtime motifs live on syncopation. The rhythm IS the character — keep it or it\'s a different song. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Learn the rag motif\'s rhythm first, clapping it — end the phrase on a chord tone when you can',
      'Add the notes once the rhythm is solid — half volume on the answer phrase',
      'Play it three times, accent the offbeats — silence counts as part of the lick',
      'Quote the lick inside a simple vamp so it feels like music'
    ],
    libraryIds: [
      'sg-maple-leaf-rag-motif-joplin-publ',
      'sg-home-on-the-range'
    ],
    masteryCheck: 'A syncopated rag motif quoted cleanly with the offbeats intact.',
  },
  208: {

    title: 'Weekly Lead Checkpoint (2)',
    durationMin: 30,
    goals: [
      'Lead over a two-chord vamp',
      'Use one new expressive tool from the week',
      'Keep the changes clean under the solo'
    ],
    theoryBite: 'Vamps are safe rooms for soloing — the harmony repeats, so you can take risks and return. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Two-chord vamp, steady rhythm, simple and solid — end the phrase on a chord tone when you can',
      'Solo with one tool only: vibrato, bend, or slide',
      'Land every phrase on a chord tone, not a passing note',
      'One take, then keep the version you\'d play again'
    ],
    libraryIds: [
      'rf-em-pentatonic-box-study',
      'sg-silent-night'
    ],
    masteryCheck: 'A vamp solo using one expressive tool, phrases landing on chord tones.',
  },
  209: {

    title: 'Bend Vocabulary — Release & Pre-Bend (2)',
    durationMin: 30,
    goals: [
      'Add the pre-bend to your bend vocabulary',
      'Release into the note, arriving from above',
      'Choose pre-bend when the melody descends'
    ],
    theoryBite: 'A pre-bend arrives from above — you\'re already bent when the note starts, then release down into it.',
    drills: [
      'Pre-bend a half step silently, release on beat 1',
      'Match: play the lower note, then the release — half volume on the answer phrase',
      'End one phrase with a release instead of a bend — silence counts as part of the lick',
      'Four bars of pre-bend phrasing — bend is ready before the hit'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'A phrase where a pre-bend release arrives in tune on the beat.',
  },
  210: {

    title: 'Sequence Climb — Melodic Sequences Up (3)',
    durationMin: 35,
    goals: [
      'Sequence a cell across string sets',
      'Keep tone even when strings change',
      'Hear the pattern as one idea, not three fragments'
    ],
    theoryBite: 'The same cell on different strings is still one idea — the ear follows the shape, not the string. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Cell on the G string, then B string — end the phrase on a chord tone when you can',
      'Repeat with identical picking direction — half volume on the answer phrase',
      'Smooth the string change with a slide — silence counts as part of the lick',
      'Three full climbs, one breath, resolve — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-funk-chicka-study',
      'sg-arkansas-traveler'
    ],
    masteryCheck: 'A cell that climbs across two string sets without breaking the rhythm.',
  },
  211: {

    title: 'Question Harmony — Solo Over Andalusian (3)',
    durationMin: 30,
    goals: [
      'Answer each chord with its own chord tone',
      'Play the 3rd of each chord as the phrase lands',
      'Hear the cadence as a conversation'
    ],
    theoryBite: 'In E phrygian, the 3rd of each chord is its personality — hit it on the downbeat and the line sounds like harmony, not scales.',
    drills: [
      'Find the 3rd of Am, G, F, and E on the neck and land each clean',
      'End each phrase on the next chord\'s 3rd — half volume on the answer phrase',
      'Loop the cadence, move with the chord changes — silence counts as part of the lick',
      'One full pass with only chord-tone endings — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'A full cadence pass where every phrase lands on the next chord\'s 3rd.',
  },
  212: {

    title: 'Economy Picking Seed (3)',
    durationMin: 30,
    goals: [
      'Mix sweep strokes with alternate picking',
      'Keep both techniques sounding alike',
      'Choose the stroke that fits the line'
    ],
    theoryBite: 'Real playing mixes both. Alternate when the line stays on a string, sweep when it skips. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Two notes on one string: alternate picking, even volume',
      'Then skip a string for a small sweep, keep it controlled',
      'Write a 6-note line that mixes both techniques — silence counts as part of the lick',
      'Loop it until the switch between them is invisible'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'A 6-note line where the pick changes technique without changing tone.',
  },
  213: {

    title: 'Hybrid Picking Taste (3)',
    durationMin: 30,
    goals: [
      'Use ring finger too, for three-note groups',
      'Keep all three voices balanced',
      'Play the group like one chord, not three notes'
    ],
    theoryBite: 'Three fingers plus the pick is a mini piano. Spread the notes and they sound like a chord. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Pick a bass note, add middle and ring together — end the phrase on a chord tone when you can',
      'Strum-roll the three into one chord shape — half volume on the answer phrase',
      'Repeat the hybrid group in rhythm until the thumb feels automatic',
      'Two bars of the hybrid pattern, steady — then rest two bars'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'A three-note hybrid group that rings together like one chord.',
  },
  214: {

    title: 'Motif From a PD Song (3)',
    durationMin: 30,
    goals: [
      'Transform a song motif into a different mood',
      'Change rhythm, keep the shape',
      'Make it sound like your own line'
    ],
    theoryBite: 'Same contour, new rhythm, new mood. That\'s how motifs become personal vocabulary. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Take your owned motif and slow it down to half speed',
      'Play it with a dotted rhythm, same notes — half volume on the answer phrase',
      'Play it with rests inserted where the pickup was',
      'Pick the version that feels most like your voice'
    ],
    libraryIds: [
      'sg-joshua-fit-the-battle-of-jericho',
      'sg-buffalo-gals'
    ],
    masteryCheck: 'The same motif in two moods, one of them clearly yours.',
  },
  215: {

    title: 'Weekly Lead Checkpoint (3)',
    durationMin: 30,
    goals: [
      'Lead with dynamics, not just notes',
      'Play quiet phrases and loud ones',
      'Let the contrast tell the story'
    ],
    theoryBite: 'Volume is a lead tool like any other. A quiet line makes the loud one mean more. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'One phrase quiet, one phrase loud, same notes — end the phrase on a chord tone when you can',
      'Alternate quiet and loud for four full phrases — half volume on the answer phrase',
      'Keep the tempo rock steady while the volume moves',
      'One take with real contrast, then listen back — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'sg-drunken-sailor'
    ],
    masteryCheck: 'A lead take with clear quiet-to-loud contrast and steady tempo.',
  },
  216: {

    title: 'Bend Vocabulary — Release & Pre-Bend (3)',
    durationMin: 30,
    goals: [
      'Use release bends at phrase endings',
      'Let the drop be the punctuation',
      'Keep the release in time'
    ],
    theoryBite: 'A release at the end of a phrase is a period — the line finishes by settling down. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'End a phrase with a held bend, sustain it out — end the phrase on a chord tone when you can',
      'Release it on beat 1 of the next bar, controlled',
      'Repeat with a different starting pitch each time',
      'Three phrases, all ending in releases, no fresh bends'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Three phrases, each ending with an in-time release.',
  },
  217: {

    title: 'Sequence Climb — Melodic Sequences Up (4)',
    durationMin: 35,
    goals: [
      'Sequence with a chromatic leading tone',
      'Make the climb pull toward the target',
      'Keep every repeat clean, even with the leaner'
    ],
    theoryBite: 'A half-step approach note makes a sequence feel inevitable — it points at where you\'re going. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Cell ending on a half-step below the next root — end the phrase on a chord tone when you can',
      'Feel the tension as it approaches — half volume on the answer phrase',
      'Resolve the whole run to a long target tone — silence counts as part of the lick',
      'Two climbs, target, breath, repeat — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-palm-mute-chug-study',
      'sg-aura-lee'
    ],
    masteryCheck: 'A chromatic-tinted sequence that lands on a clear long tone.',
  },
  218: {

    title: 'Question Harmony — Solo Over Andalusian (4)',
    durationMin: 30,
    goals: [
      'Approach each chord tone from a half step below',
      'Make every landing feel inevitable',
      'Keep the line flowing through the changes'
    ],
    theoryBite: 'A half-step approach makes a landing sing — phrygian loves leaning into E. Aim the tension note, then resolve like you meant it.',
    drills: [
      'Pick a target chord tone to land on each bar — end the phrase on a chord tone when you can',
      'Approach it from the note a half step below — half volume on the answer phrase',
      'Land it right on the downbeat, clean and confident',
      'Chain the whole cadence this way, one target per bar'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'A cadence pass where every chord tone is approached from below.',
  },
  219: {

    title: 'Economy Picking Seed (4)',
    durationMin: 30,
    goals: [
      'Sweep an arpeggio shape',
      'Hear each arpeggio note clearly',
      'Resolve the arpeggio to its root'
    ],
    theoryBite: 'Arpeggios are the natural home of the sweep — the shape was made for one fluid stroke. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Major arpeggio shape across three strings, mapped first',
      'One sweep up and one sweep down, slow and even — half volume on the answer phrase',
      'Pick the root out clearly on the landing note — silence counts as part of the lick',
      'Three clean passes, then resolve on the root — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'A three-string arpeggio sweep with every note audible and a clear root landing.',
  },
  220: {

    title: 'Hybrid Picking Taste (4)',
    durationMin: 30,
    goals: [
      'Roll a hybrid chord arpeggio',
      'Spread the notes across the beat',
      'Keep the roll even, not rushed'
    ],
    theoryBite: 'A hybrid roll is a chord broken into a tiny melody — spread it and it breathes. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Pick bass, then roll middle and ring — end the phrase on a chord tone when you can',
      'Spread the three notes across half a beat each — half volume on the answer phrase',
      'Repeat the roll four times even — silence counts as part of the lick',
      'Try it on two different chord shapes — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'An even three-note hybrid roll repeated cleanly on two chord shapes.',
  },
  221: {

    title: 'Motif From a PD Song (4)',
    durationMin: 30,
    goals: [
      'Quote a folk melody motif over a vamp',
      'Keep the quote recognizable but brief',
      'Return to your own line after'
    ],
    theoryBite: 'A quote is a wink — say a public-domain fragment once, briefly, then go back to your own story so it feels clever, not copied.',
    drills: [
      'Vamp two chords steadily, no ornament yet — end the phrase on a chord tone when you can',
      'Insert the 4-note quote on the second bar of the loop',
      'Resume your own phrase right after, seamless — silence counts as part of the lick',
      'Do it twice, keeping the quote short and clear — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'sg-greensleeves',
      'sg-barbara-allen'
    ],
    masteryCheck: 'A brief recognizable quote inside a vamp that returns to your own line.',
  },
  222: {

    title: 'Weekly Lead Checkpoint (4)',
    durationMin: 30,
    goals: [
      'Recover from a mistake mid-solo',
      'Keep the phrase going after a flub',
      'Finish the take regardless'
    ],
    theoryBite: 'Recovery is a performance skill: the audience hears the recovery, not the mistake — if you keep going.',
    drills: [
      'Start a take; when you flub, keep the groove moving',
      'Repeat the phrase from the next chord, don\'t reset',
      'Never stop for a full pass, recover in time — silence counts as part of the lick',
      'Record it and listen for how clean the recovery was'
    ],
    libraryIds: [
      'rf-a-blues-turnaround-study',
      'sg-simple-gifts'
    ],
    masteryCheck: 'A full lead take with one recovered mistake and no stopping.',
  },
  223: {

    title: 'Bend Vocabulary — Release & Pre-Bend (4)',
    durationMin: 30,
    goals: [
      'Chain a bend into a slide for one long gesture',
      'Keep the pitch continuous through both',
      'Land the gesture on a chord tone'
    ],
    theoryBite: 'Bend then slide is one continuous line — the pitch moves twice without a new attack. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Bend up, then slide to a higher fret without stopping',
      'Keep the sound continuous, no re-pick between moves',
      'Land the slide on a chord tone, not a random note',
      'Repeat the gesture inside a real musical phrase — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'A bend-to-slide gesture that stays continuous and lands on a chord tone.',
  },
  224: {

    title: 'Sequence Climb — Melodic Sequences Up (5)',
    durationMin: 35,
    goals: [
      'Sequence in a different rhythm than straight eighths',
      'Keep the cell recognizable through the change',
      'Lock it to the metronome the whole way'
    ],
    theoryBite: 'Rhythm is what makes a sequence yours. Same notes, new rhythm, different story. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Play the cell as dotted rhythm, crisp and even — end the phrase on a chord tone when you can',
      'Then as triplet rhythm, same four notes — half volume on the answer phrase',
      'Keep the climb even through both rhythms — silence counts as part of the lick',
      'Pick one rhythm and climb four steps with it — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-jazz-chromatic-approach-study',
      'sg-the-parting-glass'
    ],
    masteryCheck: 'The same cell climbed in a new rhythm, recognizable and in time.',
  },
  225: {

    title: 'Question Harmony — Solo Over Andalusian (5)',
    durationMin: 30,
    goals: [
      'Use rests to let each chord speak',
      'Play less, land more',
      'Leave space where the harmony is already moving'
    ],
    theoryBite: 'The Andalusian cadence moves on its own — let phrygian color ride the chords. Do not force extra notes where the harmony already pulls.',
    drills: [
      'Play one note, then rest a full bar of silence — end the phrase on a chord tone when you can',
      'Only play on the F and E bars, leave the rest empty',
      'Let the G bar pass completely silent — silence counts as part of the lick',
      'Two passes: one busy, one spacious, compare them'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'A spacious cadence pass where rests do half the talking.',
  },
  226: {

    title: 'Economy Picking Seed (5)',
    durationMin: 30,
    goals: [
      'Sweep inside a scale run',
      'Let the sweep appear where the music wants it',
      'Keep the run flowing past the sweep'
    ],
    theoryBite: 'A sweep inside a run is a shortcut, not a showpiece — the line keeps moving through it. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Scale run with one sweep on a string skip — end the phrase on a chord tone when you can',
      'Keep the rest of the line alternate-picked and even',
      'Loop the run, let the sweep land on a chord tone',
      'Two full runs of the line, even throughout — no sprint finish'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'A scale run that contains one clean sweep without slowing the line.',
  },
  227: {

    title: 'Hybrid Picking Taste (5)',
    durationMin: 30,
    goals: [
      'Add hybrid color to a two-chord progression',
      'Keep the changes clean under the fingers',
      'Let the color serve the song'
    ],
    theoryBite: 'Hybrid texture over simple chords is instant arrangement — same changes, richer sound. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Two-chord loop, thumb playing steady bass notes — end the phrase on a chord tone when you can',
      'Add finger melody on the second chord only — half volume on the answer phrase',
      'Full loop with both chords colored, melody on top',
      'Play it soft first, then full volume, same tempo'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'A two-chord progression colored with hybrid texture, changes still clean.',
  },
  228: {

    title: 'Motif From a PD Song (5)',
    durationMin: 30,
    goals: [
      'Develop the motif across four bars',
      'Sequence it, invert it, stretch it',
      'Keep the family resemblance clear'
    ],
    theoryBite: 'Development is showing the motif in new light — sequence, mirror, or stretch, but keep the DNA. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Bar 1: play the motif exactly as you learned it — end the phrase on a chord tone when you can',
      'Bar 2: sequence it up a step, same rhythm — half volume on the answer phrase',
      'Bar 3: invert the direction, mirror the shape — silence counts as part of the lick',
      'Bar 4: resolve down to the root and hold it — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'sg-silent-night',
      'sg-sailor-s-hornpipe'
    ],
    masteryCheck: 'A four-bar development where the motif is recognizable in every bar.',
  },
  229: {

    title: 'Weekly Lead Checkpoint (5)',
    durationMin: 30,
    goals: [
      'Lead with a clear phrase shape',
      'Start, peak, and land the phrase',
      'Make the shape audible to a listener'
    ],
    theoryBite: 'A phrase with a shape is a sentence: it starts somewhere, rises, and lands. Listeners feel that arc.',
    drills: [
      'Plan a 4-bar phrase: low start, rise, land — end the phrase on a chord tone when you can',
      'Play the line with the chord shape still in your mind\'s eye',
      'Repeat with a different peak note — silence counts as part of the lick',
      'Keep the take where the arc was clearest — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-g-caged-run-study',
      'sg-turkey-in-the-straw'
    ],
    masteryCheck: 'A four-bar phrase with an audible start-peak-land shape.',
  },
  230: {

    title: 'Bend Vocabulary — Release & Pre-Bend (5)',
    durationMin: 30,
    goals: [
      'Play bend-and-release pairs in rhythm',
      'Match the pair\'s timing to the beat',
      'Keep both notes in tune'
    ],
    theoryBite: 'A bend-release pair is a two-note rhythm figure — it has to groove, not just sound. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Bend up on the &, release on beat 1, in time — end the phrase on a chord tone when you can',
      'Repeat the bend-release pair for four bars — half volume on the answer phrase',
      'Keep the metronome strict through every pair — silence counts as part of the lick',
      'Try the pair on two different strings, same feel'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Four bars of in-time bend-release pairs, both notes in tune.',
  },
  231: {

    title: 'Sequence Climb — Melodic Sequences Up (6)',
    durationMin: 35,
    goals: [
      'Sequence with dynamics that rise with the pitch',
      'Grow the phrase as the climb grows',
      'Let the loudest note be the target'
    ],
    theoryBite: 'Pitch and volume together tell the whole story. A climb that grows is a climb that lands. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Climb the cell three steps, crescendo with each step',
      'Peak on the target tone, then hold the energy — half volume on the answer phrase',
      'Come back down, quieter on every step — silence counts as part of the lick',
      'Repeat the whole shape twice, then finish clean — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-am-arpeggio-cascade',
      'sg-red-river-valley'
    ],
    masteryCheck: 'A three-step sequence that swells to a loud target and settles quietly.',
  },
  232: {

    title: 'Question Harmony — Solo Over Andalusian (6)',
    durationMin: 30,
    goals: [
      'Extend the Andalusian line across two full cycles',
      'Build a phrase that spans the repeat',
      'Resolve the second cycle like a closing'
    ],
    theoryBite: 'Two cycles make a sentence in E phrygian: the first asks, the second answers. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'First cycle: end open, leave it hanging — end the phrase on a chord tone when you can',
      'Second cycle: answer and resolve to E — half volume on the answer phrase',
      'Keep the rhythm consistent across both — silence counts as part of the lick',
      'Record the full two-cycle phrase — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'A two-cycle Andalusian sentence with an open question and a closed answer.',
  },
  233: {

    title: 'Economy Picking Seed (6)',
    durationMin: 30,
    goals: [
      'Sweep in both directions fluently',
      'Down-sweeps and up-sweeps sound equal',
      'Change direction without a hiccup'
    ],
    theoryBite: 'Up-sweeps are usually the weak side of economy picking. Practice the direction you avoid until both ways feel equally honest.',
    drills: [
      'Down-sweep the arpeggio, letting each note ring — end the phrase on a chord tone when you can',
      'Up-sweep it back, same even spacing — half volume on the answer phrase',
      'Alternate: down, up, down, up without pausing — silence counts as part of the lick',
      'Make the up-sweep sound as strong as the down-sweep'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'An arpeggio swept both directions with equal tone.',
  },
  234: {

    title: 'Hybrid Picking Taste (6)',
    durationMin: 30,
    goals: [
      'Play hybrid lines in a higher register',
      'Keep the bass anchoring low',
      'Balance the register jump'
    ],
    theoryBite: 'High melody over low bass is the classic hybrid voice — two instruments from one guitar. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Low thumb bass with a high finger melody on top — end the phrase on a chord tone when you can',
      'Jump the melody an octave up, keep the bass put — half volume on the answer phrase',
      'Keep the bass steady through the whole jump — silence counts as part of the lick',
      'Trade registers every four bars, bass and melody swap'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'A hybrid line that spans a wide register with a steady low anchor.',
  },
  235: {

    title: 'Motif From a PD Song (6)',
    durationMin: 30,
    goals: [
      'Build a call-and-response solo from a motif',
      'Motif asks, variation answers',
      'Keep the conversation musical'
    ],
    theoryBite: 'Call and response turns a motif into dialogue — the same idea answered by a different voice. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Call: play the motif, one bar long — end the phrase on a chord tone when you can',
      'Answer: play a variation, one bar long — half volume on the answer phrase',
      'Trade four times, keeping each one short and clear',
      'End with the motif as the final word, ring it out'
    ],
    libraryIds: [
      'sg-red-river-valley',
      'sg-wild-mountain-thyme'
    ],
    masteryCheck: 'A four-bar call-and-response built from one motif.',
  },
  236: {

    title: 'Weekly Lead Checkpoint (6)',
    durationMin: 30,
    goals: [
      'Solo over a longer form without losing direction',
      'Keep the story going across multiple sections',
      'Return to the root at the turnarounds'
    ],
    theoryBite: 'Longer forms need landmarks. Return to chord tones at the changes and the solo always knows where it is.',
    drills: [
      'Play the full form once with chord-tone landings',
      'Add one new idea per section, don\'t overfill — half volume on the answer phrase',
      'Return to the root at each turnaround for anchor',
      'One full take, then keep the better of two versions'
    ],
    libraryIds: [
      'rf-c-bass-walk-study',
      'sg-joshua-fit-the-battle-of-jericho'
    ],
    masteryCheck: 'A full-form solo with root landings at the turnarounds and one idea per section.',
  },
  237: {

    title: 'Bend Vocabulary — Release & Pre-Bend (6)',
    durationMin: 30,
    goals: [
      'Use pre-bends to start a phrase silently',
      'Arrive from above as the phrase opens',
      'Make the entrance feel planned'
    ],
    theoryBite: 'Opening on a pre-bend is a dramatic entrance — the note is already in motion when we hear it. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Pre-bend silently, start the phrase on the release',
      'Let the release be the phrase\'s first note — half volume on the answer phrase',
      'Follow the bend with a short descending answer phrase',
      'Two phrase entrances in a row — both clean, no rushed pickup'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'A phrase that opens on a pre-bend release, sounding planned and in tune.',
  },
  238: {

    title: 'Sequence Climb — Melodic Sequences Up (7)',
    durationMin: 35,
    goals: [
      'Sequence a cell in a new position on the neck',
      'Hear the same shape in a different register',
      'Connect the positions without a pause'
    ],
    theoryBite: 'The same sequence in a new position is a new color. Register changes the mood of the same idea. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Climb the cell in the low position, even rhythm — end the phrase on a chord tone when you can',
      'Jump to the higher position, same shape, same feel',
      'Land the jump on a target note, not a random one',
      'Three full climbs, ending home on the root — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-drop-d-power-study',
      'sg-i-ve-been-working-on-the-railroa'
    ],
    masteryCheck: 'The same cell climbed in two neck positions, connected without a stop.',
  },
  239: {

    title: 'Question Harmony — Solo Over Andalusian (7)',
    durationMin: 30,
    goals: [
      'Improvise inside the cadence with one small motif',
      'Let the motif change with the chords',
      'Keep it recognizable through all four bars'
    ],
    theoryBite: 'A single motif through changing harmony — the phrygian color shifts underneath Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Invent a 3-note motif on Am, simple and singable',
      'Transpose it over G, F, and E chords, same shape',
      'Let only one note change per chord for color — silence counts as part of the lick',
      'Play the full cadence twice with the motif intact'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'One motif carried through the whole cadence, recognizable on every chord.',
  },
  240: {

    title: 'Economy Picking Seed (7)',
    durationMin: 30,
    goals: [
      'Sweep a minor arpeggio shape',
      'Hear the minor color in the sweep',
      'Resolve to the minor root'
    ],
    theoryBite: 'Minor arpeggios sweep with a different weight — the flat 3rd changes the whole feel. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Minor arpeggio across three strings, mapped cleanly',
      'Sweep up and hold the flat 3rd for color — half volume on the answer phrase',
      'Resolve down to the minor root, let it ring — silence counts as part of the lick',
      'Trade major and minor shapes and hear the mood shift'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'A minor arpeggio sweep that clearly colors the phrase and lands on its root.',
  },
  241: {

    title: 'Hybrid Picking Taste (7)',
    durationMin: 30,
    goals: [
      'Combine hybrid picking with a strum',
      'Switch between the two without a pause',
      'Keep the groove through the switch'
    ],
    theoryBite: 'Hybrid for the melody, strum for the hit — the switch is a dynamic move, not a gear change. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Hybrid pattern for four bars, thumb and fingers clear',
      'Full strum for one bar as a contrast color — half volume on the answer phrase',
      'Back to hybrid with no pause between patterns — silence counts as part of the lick',
      'Repeat the whole cycle four times, steady tempo — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'A hybrid-to-strum switch repeated with no gap in the groove.',
  },
  242: {

    title: 'Motif From a PD Song (7)',
    durationMin: 30,
    goals: [
      'Use a motif from a traditional tune over a drone',
      'Let the drone hold the harmony',
      'Keep the motif singing above it'
    ],
    theoryBite: 'A drone makes any motif feel ancient and modal — the harmony stands still while the idea moves. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Hold a drone on the low strings, open and ringing',
      'Play the motif above it, keeping the drone alive',
      'Vary the motif\'s rhythm while the drone holds steady',
      'Two full passes, drone never wavering — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'sg-i-ve-been-working-on-the-railroa',
      'sg-canon-in-d-pachelbel-theme-publi'
    ],
    masteryCheck: 'A motif played over a steady drone with the drone never wavering.',
  },
  243: {

    title: 'Weekly Lead Checkpoint (7)',
    durationMin: 30,
    goals: [
      'Solo with a modal color you rarely use',
      'Keep the color consistent across the phrase',
      'Resolve to the modal root'
    ],
    theoryBite: 'A modal color is a mood license — stay in the mode and the whole solo sounds intentional. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Pick a mode and map where its root sits — end the phrase on a chord tone when you can',
      'Phrase only inside the mode, no outside notes yet',
      'Avoid the one note that breaks the color on purpose',
      'Resolve every phrase to the modal root at the end'
    ],
    libraryIds: [
      'rf-spanish-e-phrygian-study',
      'sg-wild-mountain-thyme'
    ],
    masteryCheck: 'A modal solo that keeps one color and resolves to its root.',
  },
  244: {

    title: 'Bend Vocabulary — Release & Pre-Bend (7)',
    durationMin: 30,
    goals: [
      'Combine bends with vibrato on the held note',
      'Bend to pitch, then add the wave',
      'Keep the vibrato even at the top'
    ],
    theoryBite: 'Bend to pitch first, vibrato second — the wave sits on a stable note, not a wobbling one. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Bend a whole step up to pitch, ear-checked — end the phrase on a chord tone when you can',
      'Hold it steady, then add narrow vibrato on top — half volume on the answer phrase',
      'Keep the vibrato even for four full beats — silence counts as part of the lick',
      'Release and repeat, same control each time — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'A bent note held with even vibrato for four beats.',
  },
  245: {

    title: 'Sequence Climb — Melodic Sequences Up (8)',
    durationMin: 35,
    goals: [
      'Sequence against a static harmony',
      'Keep the pattern interesting over one chord',
      'Resolve the run to a chord tone'
    ],
    theoryBite: 'Over one chord, the sequence is the movement. The ear follows the climb because nothing else moves. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'One chord vamp, climb the cell four steps cleanly',
      'Vary the rhythm on the last repeat for interest — half volume on the answer phrase',
      'Land on the chord\'s root or third at each phrase end',
      'Repeat with the other direction, same discipline'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c',
      'sg-house-of-the-rising-sun'
    ],
    masteryCheck: 'A four-step sequence over one chord that resolves to a chord tone.',
  },
  246: {

    title: 'Question Harmony — Solo Over Andalusian (8)',
    durationMin: 30,
    goals: [
      'Play the cadence in a different octave',
      'Use the high register for the answer phrase',
      'Let register change the mood of the same line'
    ],
    theoryBite: 'The same phrygian line low and high is two different feelings. Register is arrangement — try both and keep the one that serves the song.',
    drills: [
      'Play the line low for two cycles, warm and clear',
      'Repeat it an octave up, same articulation — half volume on the answer phrase',
      'Mix: low question, high answer, two bars each — silence counts as part of the lick',
      'End high on E and let it ring out fully — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'The same line low then high, with the answer phrase in the upper register.',
  },
  247: {

    title: 'Economy Picking Seed (8)',
    durationMin: 30,
    goals: [
      'Use the sweep to start a phrase, not just end one',
      'Open a solo line with an arpeggio sweep',
      'Keep the sweep musical from note one'
    ],
    theoryBite: 'Starting on an arpeggio is a confident way to enter — the harmony is stated before the melody wanders.',
    drills: [
      'Open a 4-bar phrase with a sweep, confident attack',
      'Follow with a scale answer, contrasting feel — half volume on the answer phrase',
      'Two takes: one sweep-open, one scale-open — silence counts as part of the lick',
      'Keep the one that sounds stronger to your ear — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'A 4-bar phrase that opens with a clean, musical arpeggio sweep.',
  },
  248: {

    title: 'Hybrid Picking Taste (8)',
    durationMin: 30,
    goals: [
      'Write a short hybrid-arranged passage',
      'Arrange a melody with bass underneath',
      'Keep it playable and musical'
    ],
    theoryBite: 'Arranging with hybrid means deciding who plays what: bass for the thumb, melody for the fingers. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Pick a simple melody you can hum without thinking',
      'Add a thumb bass underneath it, steady pulse — half volume on the answer phrase',
      'Adjust the bass until the melody stays crystal clear',
      'Play the passage twice through, same clarity — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'A short arranged passage where melody and bass both stay clear.',
  },
  249: {

    title: 'Motif From a PD Song (8)',
    durationMin: 30,
    goals: [
      'String two motifs into one phrase',
      'Give each motif its own bar',
      'Connect them with a passing note'
    ],
    theoryBite: 'Two motifs make a phrase the way two sentences make a paragraph — connect them with a bridge. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Motif A, one bar, stated plainly — end the phrase on a chord tone when you can',
      'Motif B, one bar, contrasting shape — half volume on the answer phrase',
      'Bridge them with a single passing note, no fuss — silence counts as part of the lick',
      'Play the full four-bar phrase twice, connected — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'sg-wayfaring-stranger',
      'sg-drunken-sailor'
    ],
    masteryCheck: 'A two-motif phrase joined by one passing note, played cleanly twice.',
  },
  250: {

    title: 'Weekly Lead Checkpoint (8)',
    durationMin: 30,
    goals: [
      'Chain three lead tools into one solo',
      'Bend, then slide, then rest',
      'Make the tools feel like one voice'
    ],
    theoryBite: 'Tools chain like words — bend, slide, rest is a sentence. The voice is how they connect. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'One phrase ending with a bend, held and resolved',
      'Next phrase opening with a slide into the note — half volume on the answer phrase',
      'Next phrase ending with a rest instead of a note',
      'String all three into one solo, telling one story'
    ],
    libraryIds: [
      'rf-funk-chicka-study',
      'sg-shenandoah'
    ],
    masteryCheck: 'A solo that chains bend, slide, and rest into one flowing voice.',
  },
  251: {

    title: 'Bend Vocabulary — Release & Pre-Bend (8)',
    durationMin: 30,
    goals: [
      'Place bends where the melody breathes',
      'Bend on phrase endings, not in the middle',
      'Let the bend be a choice, not a habit'
    ],
    theoryBite: 'Bends are seasoning. Too many and nothing stands out — save them for the moments that need them. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Play a phrase with no bends at all, clean line — end the phrase on a chord tone when you can',
      'Add one bend at the very end, target pitch clear',
      'Move the bend to a different note and compare — silence counts as part of the lick',
      'Keep the version where the bend lands most naturally'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'A phrase with one well-placed bend that sounds chosen, not automatic.',
  },
  252: {

    title: 'Sequence Climb — Melodic Sequences Up (9)',
    durationMin: 35,
    goals: [
      'Sequence in a scale you rarely use',
      'Find the cell in the new color',
      'Make the climb sound intentional, not lost'
    ],
    theoryBite: 'Sequences make a new scale feel like home — the shape is familiar even where the notes are new. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Pick a scale you haven\'t climbed through before — end the phrase on a chord tone when you can',
      'Map a 4-note cell inside it, note names known — half volume on the answer phrase',
      'Climb three steps with the same rhythm — silence counts as part of the lick',
      'Resolve to the new scale\'s root, hear the color — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-natural-harmonics-study',
      'sg-down-by-the-riverside'
    ],
    masteryCheck: 'A clean three-step sequence inside a scale you rarely play.',
  },
  253: {

    title: 'Question Harmony — Solo Over Andalusian (9)',
    durationMin: 30,
    goals: [
      'Combine chord tones, approach notes, and rests',
      'Build a full solo vocabulary over the cadence',
      'Play it like a song, not a pattern'
    ],
    theoryBite: 'Chord tone + approach + rest is a complete sentence — phrygian turns it into a question. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'One bar of chord-tone only, simple and solid — end the phrase on a chord tone when you can',
      'One bar with an approach note leading in — half volume on the answer phrase',
      'One bar with a rest in the middle for breath — silence counts as part of the lick',
      'One full pass mixing all three textures together'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'A cadence solo that mixes chord tones, approaches, and rests like a real phrase.',
  },
  254: {

    title: 'Economy Picking Seed (9)',
    durationMin: 30,
    goals: [
      'Sweep in a real musical phrase over a vamp',
      'Make the technique serve the line',
      'Record a take that sounds like music'
    ],
    theoryBite: 'Technique graduates when you stop hearing it. This pass is the graduation: musical sentences first, pick mechanics invisible.',
    drills: [
      'Pick a vamp and choose a chord-tone target note — end the phrase on a chord tone when you can',
      'One phrase with a sweep toward the target — half volume on the answer phrase',
      'One phrase with a sweep away from it — silence counts as part of the lick',
      'Record the better take and note why it won — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'A vamp phrase where a sweep appears as part of the music, not as a trick.',
  },
  255: {

    title: 'Hybrid Picking Taste (9)',
    durationMin: 30,
    goals: [
      'Perform a full hybrid piece start to finish',
      'Keep balance, groove, and clarity the whole way',
      'Record a take worth keeping'
    ],
    theoryBite: 'Hybrid picking is done when it survives a full take, not a perfect two-bar loop. Today is the full-take honesty check.',
    drills: [
      'Warm the pattern twice through, slow and loose — end the phrase on a chord tone when you can',
      'One full performance pass, no stopping allowed — half volume on the answer phrase',
      'One more pass with the dynamics you rehearsed — silence counts as part of the lick',
      'End on the root and hold it, then shake out — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'A complete hybrid performance take with balanced voices and a steady groove.',
  },
  256: {

    title: 'Motif From a PD Song (9)',
    durationMin: 30,
    goals: [
      'Perform a full solo built from your PD motifs',
      'Quote, develop, and return',
      'Record a take you\'d keep'
    ],
    theoryBite: 'The motif study completes when the solo sounds like a story with a recognizable hero. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Statement: play the motif twice, confident — end the phrase on a chord tone when you can',
      'Contrast: play it an octave lower, darker color — half volume on the answer phrase',
      'Return: back to the original register to finish — silence counts as part of the lick',
      'One full pass through all three, then a keeper take'
    ],
    libraryIds: [
      'sg-arkansas-traveler',
      'sg-william-tell-motif-rossini-publi'
    ],
    masteryCheck: 'A complete solo built on one motif, opening and closing with it.',
  },
  257: {

    title: 'Weekly Lead Checkpoint (9)',
    durationMin: 30,
    goals: [
      'Perform the week\'s lead checkpoint as a take',
      'Include everything that felt good',
      'Record and keep the best version'
    ],
    theoryBite: 'The checkpoint is the whole week in one pass. Play it like you mean it, then keep the honest take. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'One take: space, one tool, and a clear ending — end the phrase on a chord tone when you can',
      'Listen back once and mark the best phrase — half volume on the answer phrase',
      'Replay only that phrase three times, polish it — silence counts as part of the lick',
      'Write one keep and one fix for the next session — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-palm-mute-chug-study',
      'sg-joy-to-the-world'
    ],
    masteryCheck: 'A keeper lead take that shows the week\'s tools in one honest pass.',
  },
  258: {

    title: 'Bend Vocabulary — Release & Pre-Bend (9)',
    durationMin: 30,
    goals: [
      'Build a short solo entirely from bend vocabulary',
      'Mix bends, pre-bends, and releases',
      'Make it sound like singing'
    ],
    theoryBite: 'Bends are the voice of the guitar. A solo made of them should sound like a singer, not a machine. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Whole-step bend on the third string, in tune — end the phrase on a chord tone when you can',
      'Hold it two beats, then release slowly down — half volume on the answer phrase',
      'Pre-bend and release on the next phrase — silence counts as part of the lick',
      'Alternate bend and pre-bend across four phrases — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'A bend-vocabulary solo that sounds like a sung melody.',
  },
  259: {

    title: 'Sequence Climb — Melodic Sequences Up (10)',
    durationMin: 35,
    goals: [
      'Sequence inside a real solo context',
      'Climb toward a phrase you actually want to say',
      'End the sequence on musical silence'
    ],
    theoryBite: 'Sequences are arrows, not destinations. Point somewhere, then say the thing you aimed at. Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Climb the cell in a new position, eyes on the neck',
      'Keep the same rhythm from last week\'s version — half volume on the answer phrase',
      'Land the top note on the click, then descend — silence counts as part of the lick',
      'Two full climbs with a rest between them — end the phrase on a chord tone when you can'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study',
      'sg-greensleeves'
    ],
    masteryCheck: 'A 4-bar solo with one intentional sequence that resolves to silence.',
  },
  260: {

    title: 'Question Harmony — Solo Over Andalusian (10)',
    durationMin: 30,
    goals: [
      'Finish the Andalusian study with a performance take',
      'Keep the line musical from start to end',
      'Record a version you\'d keep'
    ],
    theoryBite: 'The E phrygian study ends when it sounds like music. This pass is the proof Leave space; one clear target note beats a blur of almosts.',
    drills: [
      'Open with space: two beats of silence before the first note',
      'One phrase with your best expressive tool, held — half volume on the answer phrase',
      'One phrase with a bend, one with a slide — silence counts as part of the lick',
      'End the solo on the root, one take worth keeping'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'A performance take of the Andalusian cadence you\'d honestly keep.',
  },
  261: {

    title: 'Repertoire Phase Open — Songs Are the Point',
    durationMin: 30,
    goals: [
      'Choose one song or section as this week’s vehicle',
      'Map its form in plain words (intro/verse/chorus/ending)',
      'Define what “keepable take” means for you today'
    ],
    theoryBite: 'Songs are why we practice. Repertoire days turn skills into something you can finish and share. Pick material you can actually complete — finishing trains confidence more than half-learning a harder tune.',
    drills: [
      'Write the form on paper in under two minutes — boxes and arrows are fine',
      'Play only the first section until it feels friendly at a slow tempo',
      'One full pass with recovery: if you flub, keep going like a show'
    ],
    libraryIds: [
      'sg-amazing-grace',
      'sg-twinkle',
      'pr-145'
    ],
    masteryCheck: 'Name your song’s form aloud, then play one section clean enough to keep.',
  },
  262: {

    title: 'Form Mapping on Paper',
    durationMin: 30,
    goals: [
      'Write accurate bar counts for every section on one page',
      'Play each section boundary until the seam is boringly clean',
      'Speak the form while comping at practice tempo'
    ],
    theoryBite: 'A form map is a memory externalization. Eyes reduce brain load so hands can groove. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Redraw the form with bar counts per section — keep going if you flub; mark it and finish',
      'Play only section boundaries (last bar → first bar of next) 10 times',
      'Full section order spoken aloud while you comp lightly',
      'Timer: 5 minutes map cleanup, 10 minutes boundary loops'
    ],
    libraryIds: [
      'sg-drunken-sailor',
      'sg-oh-susanna',
      'pr-1645'
    ],
    masteryCheck: 'Produce a labeled form map and play every section boundary cleanly in order.',
  },
  263: {

    title: 'Intro Hook Design',
    durationMin: 30,
    goals: [
      'Compose a short intro that clearly belongs to this song',
      'Land from intro into verse without tempo scar',
      'Choose sparse vs busy intro with evidence from a quick recording'
    ],
    theoryBite: 'Intros promise the song\'s world in a few bars. A clear hook beats a long meander. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Design a 2- or 4-bar intro on paper — keep going if you flub; mark it and finish',
      'Loop the intro into verse without a hitch 8 times',
      'Try a sparser intro and a busier intro; pick one',
      'Record both and keep the clearer promise — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-house-of-the-rising-sun',
      'sg-jingle-bells',
      'pr-andalu'
    ],
    masteryCheck: 'Land the intro hook twice clean, then record one take you would keep.',
  },
  264: {

    title: 'Verse Comp Texture',
    durationMin: 30,
    goals: [
      'Keep verse texture lower than chorus on purpose',
      'Preserve pulse while thinning strums',
      'Leave imaginary space for a vocal line'
    ],
    theoryBite: 'Verses often need lower density so lyrics (or melody) can speak. Texture is arrangement. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Verse-only loop with reduced strum density 8 bars × 4',
      'Mark words or hummed syllables where strums should thin',
      'Compare high-density vs low-density verse takes — breathe on the bar line before the hard entrance',
      'Choose the version where melody would still be audible'
    ],
    libraryIds: [
      'sg-aura-lee',
      'sg-row-row-row-your-boat',
      'pr-6251'
    ],
    masteryCheck: 'Keep the verse comp steady through a full run, then record one take you would keep.',
  },
  265: {

    title: 'Chorus Lift — Make the Hook Rise',
    durationMin: 30,
    goals: [
      'Create an obvious lift into the chorus',
      'Use one primary lift lever (density, voicing, or dynamics)',
      'Make verse to chorus a rehearsed seam on a simple progression'
    ],
    theoryBite: 'Choruses lift via range, density, strum energy, or harmonic brightness — pick one primary lever. Keep the harmony simple (think G–C–D territory) so the lift is about energy, not a brand-new chord exam.',
    drills: [
      'Chorus loop with one lift lever only (density or voicing)',
      'Verse→chorus transition 10 times focusing on energy change',
      'If lift fails, raise voicing rather than only hitting harder',
      'Capture one keepable chorus take you would actually replay'
    ],
    libraryIds: [
      'pr-145',
      'ch-g',
      'sg-auld-lang-syne'
    ],
    masteryCheck: 'Make verse→chorus clearly lift with one main lever, then keep one take.',
  },
  266: {

    title: 'Bridge or Middle Eight',
    durationMin: 35,
    goals: [
      'Make the bridge contrast without losing the pulse',
      'Secure bridge chords before adding ornaments',
      'Test verse–bridge–verse as a unit'
    ],
    theoryBite: 'Bridges contrast. New chord color or rhythmic space re-engages ears before the final chorus. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Isolate bridge chords slowly until changes are early-prepared',
      'Bridge in/out transitions 8 times each — one keepable take beats five restarts',
      'Option: simplify bridge to 2 chords if unstable — breathe on the bar line before the hard entrance',
      'Play verse–bridge–verse to test contrast — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-buffalo-gals',
      'sg-she-ll-be-coming-round-the-mount',
      'pr-12bar'
    ],
    masteryCheck: 'Play the bridge eight times clean, then record one take you would keep.',
  },
  267: {

    title: 'Ending and Button',
    durationMin: 30,
    goals: [
      'Design a deliberate final gesture (button or fade)',
      'Stop string noise after the last hit',
      'Hold performance stillness for a beat after cutoff'
    ],
    theoryBite: 'Endings are remembered. A button (short final hit) or deliberate fade-out is a design choice. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Practice last 4 bars into button 15 times — keep going if you flub; mark it and finish',
      'Hold still for one full beat after the final cut-off',
      'Try fade gesture vs hard button; choose intentionally',
      'Record ending only — listen for ragged last hits'
    ],
    libraryIds: [
      'sg-sailor-s-hornpipe',
      'sg-shenandoah',
      'pr-1645'
    ],
    masteryCheck: 'Nail the ending button, then record one take you would keep.',
  },
  268: {

    title: 'Transition Glue',
    durationMin: 30,
    goals: [
      'Eliminate panic pauses between sections',
      'Use minimal glue that stays in tempo',
      'Run full form with attention only on seams'
    ],
    theoryBite: 'Transitions fail when hands panic between sections. Glue fills are short and tempo-true. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Loop the two bars around every section seam — keep going if you flub; mark it and finish',
      'Insert a 1-beat rest glue if hands need time — one keepable take beats five restarts',
      'Remove emergency pauses that break tempo — breathe on the bar line before the hard entrance',
      'Run full form focusing only on seams — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-canon-in-d-pachelbel-theme-publi',
      'sg-simple-gifts',
      'pr-andalu'
    ],
    masteryCheck: 'Make every transition glue, then record one take you would keep.',
  },
  269: {

    title: 'Tempo Honesty',
    durationMin: 30,
    goals: [
      'Choose a human practice tempo with clean changes',
      'Write the BPM on the chart and obey it',
      'Reject ego tempos that encode errors'
    ],
    theoryBite: 'The right tempo is the one where parts stay human. Ego tempo creates permanent flaws. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Find the tempo where changes stay clean for 16 bars',
      'Mark that BPM as practice tempo on the chart — one keepable take beats five restarts',
      'Play 1% faster only if error rate stays low — breathe on the bar line before the hard entrance',
      'Reject tempos that require shoulder tension — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-william-tell-motif-rossini-publi',
      'sg-down-by-the-riverside',
      'pr-6251'
    ],
    masteryCheck: 'Hold an honest tempo start to finish, then record one take you would keep.',
  },
  270: {

    title: 'Dynamic Architecture',
    durationMin: 30,
    goals: [
      'Assign dynamics to sections like a lighting plot',
      'Keep tempo flat when volume rises',
      'Make soft parts musically intentional, not timid accidents'
    ],
    theoryBite: 'Plan soft and loud regions like a lighting plot. Dynamics make form audible. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Assign soft/medium/loud to sections on the chart',
      'Play with exaggerated dynamics once — one keepable take beats five restarts',
      'Play the section with real dynamics once — soft verse energy',
      'Make sure tempo stays flat when volume rises — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-morning-mood-motif-grieg-public-',
      'sg-the-parting-glass',
      'pr-145'
    ],
    masteryCheck: 'Play the dynamics map, then record one take you would keep.',
  },
  271: {

    title: 'Memory Without Panic',
    durationMin: 30,
    goals: [
      'Memorize one section with chunk cues',
      'Use the chart only for true danger spots',
      'Build memory without panic full-speed runs'
    ],
    theoryBite: 'Memory thrives on chunks and cues, not heroic full runs on day one of recall. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Turn chart face down; play one section from memory',
      'Turn the chart face-back and play seams from memory only',
      'Add a second section to memory when the first is stable',
      'Note the exact bar where memory blinks — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-ode',
      'sg-the-streets-of-laredo',
      'pr-12bar'
    ],
    masteryCheck: 'Play the whole form from memory without stopping, then record one take you would keep.',
  },
  272: {

    title: 'Recovery Practice',
    durationMin: 30,
    goals: [
      'Rejoin the form on the next downbeat after a flub',
      'Keep foot pulse alive during mistakes',
      'Train facial calm as part of the skill'
    ],
    theoryBite: 'Pros rejoin the form after mistakes. Stopping trains fragility; recovery trains performance. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Intentionally flub a change, then rejoin on next downbeat',
      'Practice smiling through the rejoin — one keepable take beats five restarts',
      'Never stop the foot pulse during recovery drills',
      'Do 5 scripted recoveries in a row — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-oh-susanna',
      'sg-swing-low-sweet-chariot',
      'pr-1645'
    ],
    masteryCheck: 'Practice recovering from a slip mid-song, then record one take you would keep.',
  },
  273: {

    title: 'Chart Cleanliness',
    durationMin: 35,
    goals: [
      'Make the chart readable at a glance',
      'Remove confusing obsolete marks',
      'Backup the chart (photo) before big runs'
    ],
    theoryBite: 'A clean chart is future-you kindness. Marks for feels, mutes, and frets reduce reload cost. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Rewrite messy bars with larger fret numbers — keep going if you flub; mark it and finish',
      'Add feel marks (mute, accent, light) in one ink color',
      'Remove obsolete marks that confuse you — breathe on the bar line before the hard entrance',
      'Photo or export the chart so you have a backup off the stand'
    ],
    libraryIds: [
      'sg-jingle-bells',
      'sg-danny-boy-londonderry-air',
      'pr-andalu'
    ],
    masteryCheck: 'Play from a clean chart, then record one take you would keep.',
  },
  274: {

    title: 'Tone and Arrangement',
    durationMin: 30,
    goals: [
      'Match tone color to section role',
      'Prefer clarity of changes over excess gain or force',
      'A/B record to verify the arrangement reads'
    ],
    theoryBite: 'Tone is arrangement: brighter for lift, darker for verses, less gain when changes need clarity. One tone tweak can fix a muddy section.',
    drills: [
      'Verse tone: darker/softer attack for 8 bars — keep going if you flub; mark it and finish',
      'Chorus tone: clearer/brighter for 8 bars — one keepable take beats five restarts',
      'If amp available, preset two levels; if not, use hands only',
      'A/B record a single section both ways — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-row-row-row-your-boat',
      'sg-joy-to-the-world',
      'pr-6251'
    ],
    masteryCheck: 'Set the tone and arrangement, then record one take you would keep.',
  },
  275: {

    title: 'Duet With a Recording',
    durationMin: 30,
    goals: [
      'Lock pocket to a reference recording or prior take',
      'Simplify until downbeats agree',
      'Add taste only after ensemble timing is true'
    ],
    theoryBite: 'Playing along teaches ensemble timing. Match pocket before adding ornamental disagreement. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Play along with a library recording or your own prior take',
      'Match downbeats for one full section before adding fills',
      'If you rush, simplify to downbeats only — breathe on the bar line before the hard entrance',
      'Log where you pulled away from the duet pocket — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-this-old-man',
      'sg-turkey-in-the-straw',
      'pr-145'
    ],
    masteryCheck: 'Duet with the recording in time, then record one take you would keep.',
  },
  276: {

    title: 'Fingerstyle Arrangement Pass',
    durationMin: 30,
    goals: [
      'Stabilize thumb ostinato before finger complexity',
      'Carry the pattern through chord changes',
      'Collapse to thumb-only when form wobbles'
    ],
    theoryBite: 'Fingerstyle can state bass + harmony + hint of melody. Start sparse; density later. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Thumb on beat roots only for one section — keep going if you flub; mark it and finish',
      'Add simple higher-string pattern on &s — one keepable take beats five restarts',
      'Keep pattern identical across chord changes 8 bars',
      'If collapse, return to thumb-only — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-she-ll-be-coming-round-the-mount',
      'sg-twinkle',
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Play the fingerstyle pass, then record one take you would keep.',
  },
  277: {

    title: 'Strum Arrangement Pass',
    durationMin: 30,
    goals: [
      'Keep one recognizable strum DNA through the section',
      'Change chords without rewriting the right hand randomly',
      'Thin the pattern where the song needs air'
    ],
    theoryBite: 'Strum arrangements live or die on right-hand pattern consistency through changes. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Lock one strum pattern for the whole section — keep going if you flub; mark it and finish',
      'Change chords without changing the pattern DNA — one keepable take beats five restarts',
      'Mark where you must thin the pattern for breaths',
      '16-bar run with pattern recognizability intact — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-shenandoah',
      'sg-amazing-grace',
      'pr-1645'
    ],
    masteryCheck: 'Play the strum pass, then record one take you would keep.',
  },
  278: {

    title: 'Lead Break Writing',
    durationMin: 30,
    goals: [
      'Write a short break that serves the song',
      'Place the break at a form breath point',
      'Keep the break short and honest — serve the song, not the shred'
    ],
    theoryBite: 'A lead break is a short story inside the song, not a separate shred audition. Start clear, peak once, land before the vocal returns.',
    drills: [
      'Write a 2-bar break maximum on paper — keep going if you flub; mark it and finish',
      'Place it after a chorus or before a final verse — one keepable take beats five restarts',
      'Practice song with break omitted vs included — breathe on the bar line before the hard entrance',
      'Play the break under tempo until every note lands — flub, mark it, finish the form'
    ],
    libraryIds: [
      'sg-simple-gifts',
      'sg-when-the-saints-go-marching-in',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Write and play the lead break, then record one take you would keep.',
  },
  279: {

    title: 'Call and Response With Voice',
    durationMin: 30,
    goals: [
      'Leave holes for the call (voice or hummed line)',
      'Answer with a clear short guitar phrase',
      'Avoid talking over the call bar'
    ],
    theoryBite: 'Guitar answers voice (or a hummed line). Leave holes where the call lives — if you play through the singer, you are competing, not talking.',
    drills: [
      'Hum a call; answer on guitar in the next bar — keep going if you flub; mark it and finish',
      'Leave the call bar mostly empty on guitar — one keepable take beats five restarts',
      'Two call-response pairs inside one section — breathe on the bar line before the hard entrance',
      'Record to check you\'re not talking over the call'
    ],
    libraryIds: [
      'sg-down-by-the-riverside',
      'sg-mary-had-a-little-lamb',
      'pr-6251'
    ],
    masteryCheck: 'Trade call and response with your voice, then record one take you would keep.',
  },
  280: {

    title: 'Capo and Key Fit for Voice',
    durationMin: 35,
    goals: [
      'Fit key to comfortable singing/humming range',
      'Notate capo fret huge on the chart',
      'Re-secure shapes in the capoed key'
    ],
    theoryBite: 'Capo is a friend of singable range. Comfortable vowels beat theoretical purity. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Find a capo fret where singing (or humming comfortably) works',
      'Rewrite shapes if needed for the new positions — one keepable take beats five restarts',
      'Play section in new key without rushing — breathe on the bar line before the hard entrance',
      'Note capo fret on chart in large digits — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-the-parting-glass',
      'sg-london-bridge',
      'pr-145'
    ],
    masteryCheck: 'Set the capo and key for your voice, then record one take you would keep.',
  },
  281: {

    title: 'Setlist Flow Logic',
    durationMin: 30,
    goals: [
      'Order songs for energy and key kindness',
      'Plan spoken transitions briefly',
      'Time the set with buffers'
    ],
    theoryBite: 'Set order manages energy and key fatigue. Adjacent songs need intentional contrast or glue. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Order two or three songs by energy curve — keep going if you flub; mark it and finish',
      'Check keys for monotony; adjust capo plan if needed',
      'Speak transitions once as if on stage — breathe on the bar line before the hard entrance',
      'Time the mini-set roughly with a phone timer — note overruns'
    ],
    libraryIds: [
      'sg-the-streets-of-laredo',
      'sg-happy-birthday',
      'pr-12bar'
    ],
    masteryCheck: 'Order your setlist with flow logic, then record one take you would keep.',
  },
  282: {

    title: 'Stamina Building',
    durationMin: 30,
    goals: [
      'Build duration without shoulder pain',
      'Use short resets instead of grinding tension',
      'Stop at pain and adjust technique or tempo'
    ],
    theoryBite: 'Stamina is paced reps with loose shoulders. Pain is a stop sign, not a badge. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Play the hardest section 3 times with 30s shoulder drops between',
      'Full song once at practice tempo focusing on loose hands',
      'Stop at pain — adjust technique or tempo — breathe on the bar line before the hard entrance',
      'Log stamina minutes without tension — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-swing-low-sweet-chariot',
      'sg-scarborough-fair',
      'pr-1645'
    ],
    masteryCheck: 'Play the full set without dropping, then record one take you would keep.',
  },
  283: {

    title: 'Quiet Practice Day',
    durationMin: 30,
    goals: [
      'Reveal timing truth at whisper volume',
      'Keep musical lift without relying on loudness',
      'Contrast with one medium take at the end'
    ],
    theoryBite: 'Soft playing reveals timing sins volume hides. Quiet days build control and neighbor peace. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Entire session at whisper volume — keep going if you flub; mark it and finish',
      'If notes disappear, fretting is incomplete — fix gently',
      'Quiet chorus still needs lift via texture not volume',
      'End with one medium take to contrast control — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-danny-boy-londonderry-air',
      'sg-home-on-the-range',
      'pr-andalu'
    ],
    masteryCheck: 'Play a quiet practice pass, then record one take you would keep.',
  },
  284: {

    title: 'Record a Keepable Take',
    durationMin: 30,
    goals: [
      'Capture a full take under performance rules',
      'Listen before deleting',
      'Keep evidence even when imperfect'
    ],
    theoryBite: 'Recording is a mirror. One take worth keeping teaches more than five ignored ones. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'One full section or song take with performance rules',
      'No stopping mid-take unless safety issue — one keepable take beats five restarts',
      'Listen once before deleting anything — breathe on the bar line before the hard entrance',
      'Keep the take file even if imperfect — you need the evidence'
    ],
    libraryIds: [
      'sg-joy-to-the-world',
      'sg-barbara-allen',
      'pr-6251'
    ],
    masteryCheck: 'Save one take worth keeping and write a single keep/fix note.',
  },
  285: {

    title: 'Kind Listenback Critique',
    durationMin: 30,
    goals: [
      'Separate kind pass from pencil pass',
      'Choose one fix only',
      'Avoid shame spirals that kill the next loop'
    ],
    theoryBite: 'Kindness first, pencil second. Shame kills practice loops; one specific fix keeps you coming back tomorrow.',
    drills: [
      'Listen for time first, notes second — keep going if you flub; mark it and finish',
      'Write one keep sentence and one fix sentence — one keepable take beats five restarts',
      'Apply only the fix in a short loop — breathe on the bar line before the hard entrance',
      'Avoid the multi-issue spiral — fix one complaint per listen'
    ],
    libraryIds: [
      'sg-turkey-in-the-straw',
      'sg-wild-mountain-thyme',
      'pr-145'
    ],
    masteryCheck: 'Produce a kind keep sentence and one pencil fix, then apply the fix in a loop.',
  },
  286: {

    title: 'Fix One Bar Only',
    durationMin: 30,
    goals: [
      'Isolate the single highest-use sticky bar',
      'Loop it slow until boringly clean',
      'Reinsert context only after the bar is honest'
    ],
    theoryBite: 'Isolating the sticky bar is high-use practice. Context returns after the bar is honest. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Locate the single stickiest bar and put a star on the chart',
      'Loop that bar at about 70% speed twenty times, then rest',
      'Add bar before and after (context) 10 times — breathe on the bar line before the hard entrance',
      'Reinsert the fixed bar into the full section once, slowly'
    ],
    libraryIds: [
      'sg-minuet-in-g-bach-public-domain',
      'sg-drunken-sailor',
      'pr-12bar'
    ],
    masteryCheck: 'Fix just one bar, then record one take you would keep.',
  },
  287: {

    title: 'Performance Stance',
    durationMin: 35,
    goals: [
      'Find a tall soft performance stance',
      'Connect posture to tempo calm',
      'Reuse the same stance on every keep take'
    ],
    theoryBite: 'Body language affects breathing and tempo. Tall and soft beats coiled and brittle. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Check feet, shoulders, and neck angle in a mirror or camera',
      'Play hardest passage with knees soft — one keepable take beats five restarts',
      'If tempo rushes, soften knees and exhale on downbeats',
      'Choose a performance stance and reuse it every take'
    ],
    libraryIds: [
      'sg-brahms-lullaby',
      'sg-house-of-the-rising-sun',
      'pr-1645'
    ],
    masteryCheck: 'Play with performance stance, then record one take you would keep.',
  },
  288: {

    title: 'Start Strong Ritual',
    durationMin: 30,
    goals: [
      'Install a short start ritual',
      'Make first bars trustworthy',
      'Never skip the ritual after a failed start'
    ],
    theoryBite: 'First bars set trust. A start ritual (breath, count-in, shoulders) reduces flinch errors. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Design a 5-second start ritual (breath, count, shoulders)',
      'Practice ritual → first 2 bars 15 times — one keepable take beats five restarts',
      'If first bar fails, don\'t skip ritual on retry — breathe on the bar line before the hard entrance',
      'Film one clean start of the section for review — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-the-entertainer-motif-joplin-pub',
      'sg-aura-lee',
      'pr-andalu'
    ],
    masteryCheck: 'Use your start-strong ritual, then record one take you would keep.',
  },
  289: {

    title: 'Finish Strong Ritual',
    durationMin: 30,
    goals: [
      'Practice endings as hard as openings',
      'Land stillness after the last sound',
      'Remove embarrassed rushes off the neck'
    ],
    theoryBite: 'Last bars linger in memory longer than middles. Practice endings as hard as openings so the room remembers a clean finish.',
    drills: [
      'Last 4 bars + stillness 15 times — keep going if you flub; mark it and finish',
      'Decide facial/body end pose (simple) — one keepable take beats five restarts',
      'No embarrassed rushes off the neck — breathe on the bar line before the hard entrance',
      'Record the ending only until the last bar is solid'
    ],
    libraryIds: [
      'sg-st-louis-blues-motif-handy-1914-',
      'sg-auld-lang-syne',
      'pr-6251'
    ],
    masteryCheck: 'Use your finish-strong ritual, then record one take you would keep.',
  },
  290: {

    title: 'Medley Skills',
    durationMin: 30,
    goals: [
      'Plan seams before gluing songs',
      'Slow the seam until it\'s inevitable',
      'Only then raise tempo'
    ],
    theoryBite: 'Medleys need key and tempo bridges. Plan the seam on paper before you glue songs live — surprise joins are how trains wreck.',
    drills: [
      'Pick two song fragments to join and write the seam bar down',
      'Write a 2-bar seam on one chord or hit — one keepable take beats five restarts',
      'Practice A-end → seam → B-start slowly — breathe on the bar line before the hard entrance',
      'Only then attempt performance tempo — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-drums',
      'sg-buffalo-gals',
      'pr-145'
    ],
    masteryCheck: 'Stitch the medley cleanly, then record one take you would keep.',
  },
  291: {

    title: 'Style Transfer Day',
    durationMin: 30,
    goals: [
      'Transfer the song into a new right-hand dialect',
      'Keep harmony recognizable across styles',
      'Choose the dialect that serves the story'
    ],
    theoryBite: 'Same progression, new right-hand dialect (folk, rock, ballad). Style is mostly rhythm and density. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Same section at ballad density — fewer hits, more air',
      'Same section, rock eighth density — one keepable take beats five restarts',
      'Same section, boom-chuck if fits — breathe on the bar line before the hard entrance',
      'Choose the style that serves lyrics/melody best today'
    ],
    libraryIds: [
      'sg-camptown-races',
      'sg-sailor-s-hornpipe',
      'pr-12bar'
    ],
    masteryCheck: 'Play it in the new style, then record one take you would keep.',
  },
  292: {

    title: 'Acoustic Versus Amp Feel',
    durationMin: 30,
    goals: [
      'Adjust attack and muting for the playback context',
      'Notice what articulations survive louder settings',
      'Prefer arrangement clarity over volume arms races'
    ],
    theoryBite: 'Amps compress and sustain differently. Adjust attack and mute strategy per context. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Play section unplugged/very clean — keep going if you flub; mark it and finish',
      'Play with more sustain or imaginary amp compression (longer fretting)',
      'Adjust mute strategy for the louder context — breathe on the bar line before the hard entrance',
      'Note which articulations survived — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-skip-to-my-lou',
      'sg-drums',
      'pr-1645'
    ],
    masteryCheck: 'Play acoustic vs amp feel, then record one take you would keep.',
  },
  293: {

    title: 'Mute Noise Cleanup',
    durationMin: 30,
    goals: [
      'Identify and erase unwanted open-string noise',
      'Assign specific mute responsibilities',
      'Recheck the part at performance volume — soft practice lies'
    ],
    theoryBite: 'Unwanted open-string noise is arrangement dirt. Left-hand chops and right-hand palms are erasers. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Slow motion: identify noisy open strings — keep going if you flub; mark it and finish',
      'Assign left-hand mute or palm for each culprit — one keepable take beats five restarts',
      'Loop dirty bar until noise floor drops — breathe on the bar line before the hard entrance',
      'Recheck the part at performance volume — soft practice lies'
    ],
    libraryIds: [
      'sg-fr-re-jacques',
      'sg-camptown-races',
      'rf-funk-chicka-study',
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'Clean up the mute noise, then record one take you would keep.',
  },
  294: {

    title: 'Lyric Cue Awareness',
    durationMin: 35,
    goals: [
      'Use lyric landmarks as memory and dynamic cues',
      'Shape guitar around imaginary or real words',
      'Keep the shape when words are removed'
    ],
    theoryBite: 'Even instrumentalists benefit from lyric landmarks as memory cues and dynamic guides. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Write or recall key lyric fragments against bars',
      'Use a lyric word as a dynamic cue (e.g. softer on line 2)',
      'Play while speaking lyrics in rhythm once — breathe on the bar line before the hard entrance',
      'Remove lyrics; keep the dynamic shape — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-go-tell-aunt-rhody',
      'sg-skip-to-my-lou',
      'pr-6251'
    ],
    masteryCheck: 'Hit the lyric cues, then record one take you would keep.',
  },
  295: {

    title: 'Count-In Leadership',
    durationMin: 30,
    goals: [
      'Lead yourself with a clear count-in every start',
      'Put tempo in the spoken count, not the first panicked hit',
      'Practice silent count-ins too'
    ],
    theoryBite: 'A clear count-in is leadership. Tempo lives in the spoken 1-2-3-4 before the first hit. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Count-in aloud at target tempo 10 times — keep going if you flub; mark it and finish',
      'Count-in + first bar only 10 times — one keepable take beats five restarts',
      'Silent count-in (mouth the numbers) 5 times — breathe on the bar line before the hard entrance',
      'No starting without a count-in today — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-greensleeves',
      'sg-fr-re-jacques',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Lead with a count-in, then record one take you would keep.',
  },
  296: {

    title: 'Fermatas and Holds',
    durationMin: 30,
    goals: [
      'Hold cadences with intention',
      'Plan the re-entry cue',
      'Limit fermatas so they stay special'
    ],
    theoryBite: 'Holds need collective breath. Practice long notes with a planned re-entry cue. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Place a fermata on a cadence note — keep going if you flub; mark it and finish',
      'Hold with steady vibrato or clean sustain — one keepable take beats five restarts',
      'Re-enter with a whispered count or breath cue — breathe on the bar line before the hard entrance',
      'Two fermata spots max in the song today — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-red-river-valley',
      'sg-go-tell-aunt-rhody',
      'pr-12bar'
    ],
    masteryCheck: 'Place the fermatas and holds, then record one take you would keep.',
  },
  297: {

    title: 'Rallentando Control',
    durationMin: 30,
    goals: [
      'Decelerate with subdivision, not collapse',
      'Land the final hit as a group decision with yourself',
      'Prefer less slowdown if control fails'
    ],
    theoryBite: 'Slowing down is coordinated, not collapsing. Subdivide while you decelerate. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Subdivide aloud while slowing last 2 bars — keep going if you flub; mark it and finish',
      'Conduct the slow-down with your neck or foot — one keepable take beats five restarts',
      'Land final hit together with imaginary band — breathe on the bar line before the hard entrance',
      'If collapse happens, less slow-down, more control'
    ],
    libraryIds: [
      'sg-wayfaring-stranger',
      'sg-greensleeves',
      'pr-1645'
    ],
    masteryCheck: 'Control the rallentando, then record one take you would keep.',
  },
  298: {

    title: 'Double-Time Taste',
    durationMin: 30,
    goals: [
      'Increase density without breaking harmonic landmarks',
      'Return to normal feel cleanly',
      'Keep form clock-time intentional'
    ],
    theoryBite: 'Double-time is denser subdivision at the same chord pace. Keep harmonic rhythm clear. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Keep chord changes on original bars; double strum density',
      '8 bars normal, 8 bars double-time feel — one keepable take beats five restarts',
      'Make sure form length in clock time still matches intent',
      'Return to normal without speeding the click sense'
    ],
    libraryIds: [
      'sg-black-is-the-color',
      'sg-red-river-valley',
      'pr-andalu'
    ],
    masteryCheck: 'Try the double-time feel, then record one take you would keep.',
  },
  299: {

    title: 'Half-Time Taste',
    durationMin: 30,
    goals: [
      'Create heavier feel via half-time placement',
      'Keep form alignment honest',
      'Use as drama, not default mud'
    ],
    theoryBite: 'Half-time makes grooves heavier. Backbeat placement shifts while form length stays honest. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Move backbeat emphasis to create half-time feel — keep going if you flub; mark it and finish',
      'Eight bars normal feel, eight bars half-time — hard edges clean',
      'Keep chord moments aligned to form — breathe on the bar line before the hard entrance',
      'Great for final verse drama if song allows — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-molly-malone',
      'sg-wayfaring-stranger',
      'pr-6251'
    ],
    masteryCheck: 'Try the half-time feel, then record one take you would keep.',
  },
  300: {

    title: 'Harmonic Simplification',
    durationMin: 30,
    goals: [
      'Reduce harmonic load until consistency soars',
      'Compare simplified vs original for song strength',
      'Adopt the version you can Play kindly'
    ],
    theoryBite: 'Fewer chords can make a song stronger. Power and triad reductions are honest arrangements. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Rewrite one section with fewer chord changes — keep going if you flub; mark it and finish',
      'Try power-shape reduction on a busy bar — one keepable take beats five restarts',
      'A/B original vs simplified for singability — breathe on the bar line before the hard entrance',
      'Adopt simplification if consistency jumps — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-careless-love',
      'sg-black-is-the-color',
      'rf-natural-harmonics-study'
    ],
    masteryCheck: 'Play the simplified harmony, then record one take you would keep.',
  },
  301: {

    title: 'Harmonic Enrichment',
    durationMin: 35,
    goals: [
      'Add one color only on a stable skeleton',
      'Require performance-tempo success before keeping it',
      'Delete color if error rate climbs'
    ],
    theoryBite: 'Add color tones only after the simple version is stable. Ornament follows skeleton. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Add one color tone (e.g. add9 or 7) on chorus only',
      'Make sure you can still grab it in time — one keepable take beats five restarts',
      'Remove it if section error rate rises — breathe on the bar line before the hard entrance',
      'Ornaments must survive performance tempo — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-joshua-fit-the-battle-of-jericho',
      'sg-molly-malone',
      'rf-natural-harmonics-study'
    ],
    masteryCheck: 'Play the enriched harmony, then record one take you would keep.',
  },
  302: {

    title: 'Bass Motion Arrange',
    durationMin: 30,
    goals: [
      'Let bass motion explain harmony',
      'Stabilize roots before walks',
      'Reintroduce strums after bass is true'
    ],
    theoryBite: 'Moving bass lines outline harmony. A walking or stepwise bass can replace busy strums. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Play roots only on beats 1 and 3 for a section — keep going if you flub; mark it and finish',
      'Add simple stepwise bass between chords — one keepable take beats five restarts',
      'Mute higher strings while bass speaks — breathe on the bar line before the hard entrance',
      'Reintroduce light strums after bass is stable — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-silent-night',
      'sg-careless-love',
      'pr-1645'
    ],
    masteryCheck: 'Play the bass motion arrangement, then record one take you would keep.',
  },
  303: {

    title: 'Percussive Guitar',
    durationMin: 30,
    goals: [
      'Add grid-aligned percussion colors',
      'Keep them quieter than the song harmony',
      'Remove if timing suffers'
    ],
    theoryBite: 'Body hits and muted chops add drums. Keep them grid-aligned or they fight the song. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Add a muted chop on beat 2 and 4 — keep going if you flub; mark it and finish',
      'Optional body tap on &s if comfortable — one keepable take beats five restarts',
      'Keep percussion quieter than harmony — breathe on the bar line before the hard entrance',
      'Remove perc if form timing suffers — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-i-ve-been-working-on-the-railroa',
      'sg-joshua-fit-the-battle-of-jericho',
      'rf-funk-chicka-study',
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'Add the percussion colors, then record one take you would keep.',
  },
  304: {

    title: 'Open Tuning Taste (Optional)',
    durationMin: 30,
    goals: [
      'Optionally explore drones/open colors safely',
      'Always plan return to standard tuning',
      'Transfer one idea back if you retuned'
    ],
    theoryBite: 'Open tunings re-shape shapes. If you skip retuning, simulate drone strings in standard. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Optional: try a drone-friendly voicing in standard tuning',
      'If you know an open tuning safely, explore 5 minutes max',
      'Always have a retune plan back to standard — breathe on the bar line before the hard entrance',
      'Capture one idea that might transfer to standard'
    ],
    libraryIds: [
      'sg-arkansas-traveler',
      'sg-silent-night',
      'rf-natural-harmonics-study'
    ],
    masteryCheck: 'Try the open tuning taste, then record one take you would keep.',
  },
  305: {

    title: 'Drop D Power Color (Optional)',
    durationMin: 30,
    goals: [
      'Optionally taste Drop D power color',
      'Retune carefully both directions',
      'Don\'t leave the guitar in the wrong tuning overnight by accident'
    ],
    theoryBite: 'Drop D adds weight on the sixth string. Optional — explore carefully and retune back after. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Optional Drop D: retune sixth string carefully — keep going if you flub; mark it and finish',
      'Power shapes on low strings for a chorus color — one keepable take beats five restarts',
      'Play a section; note what got easier/harder — breathe on the bar line before the hard entrance',
      'Return to standard and recheck tuning of all strings'
    ],
    libraryIds: [
      'sg-f-r-elise-motif-beethoven-public',
      'sg-i-ve-been-working-on-the-railroa',
      'rf-drop-d-power-study',
      'rf-power'
    ],
    masteryCheck: 'Try the drop D power color, then record one take you would keep.',
  },
  306: {

    title: 'Travis Pattern Song Pass',
    durationMin: 30,
    goals: [
      'Ostinato thumb first',
      'Add fingers only on stable bass',
      'Apply to one real section slowly'
    ],
    theoryBite: 'Travis picking needs an ostinato thumb. Stability of bass before fancy fingers. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Thumb ostinato on roots/5ths alone 2 minutes — keep going if you flub; mark it and finish',
      'Add simple higher pattern on a single chord — one keepable take beats five restarts',
      'Carry pattern through two chord changes — breathe on the bar line before the hard entrance',
      'Apply to one song section slowly — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-blue-danube-motif-strauss-public',
      'sg-arkansas-traveler',
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Play the Travis pattern pass, then record one take you would keep.',
  },
  307: {

    title: 'Boom-Chuck Song Pass',
    durationMin: 30,
    goals: [
      'Separate boom and chuck roles clearly',
      'Hold the train feel through changes',
      'Keep chucks lighter than bass notes'
    ],
    theoryBite: 'Boom-chuck turns a song into train motion. Bass/chord roles must stay distinct. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Boom on 1 and 3, chuck on 2 and 4 for full section',
      'Keep chucks lighter than the boom bass notes so groove reads',
      'Chord change practice at boom-chuck tempo — breathe on the bar line before the hard entrance',
      'Smile-test: record 30 seconds and keep only if it feels kind'
    ],
    libraryIds: [
      'sg-maple-leaf-rag-motif-joplin-publ',
      'sg-ode',
      'rf-d-folk-pattern-study'
    ],
    masteryCheck: 'Play the boom-chuck pass, then record one take you would keep.',
  },
  308: {

    title: 'Ballad Vocal Space',
    durationMin: 35,
    goals: [
      'Prioritize air and long harmonic rhythm',
      'Use dynamics inside long chords',
      'Resist nervous extra strums'
    ],
    theoryBite: 'Ballads need air. Reduce strum density and lengthen harmonic rhythm under melody. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'One strum per bar or per two beats max — keep going if you flub; mark it and finish',
      'Leave space after each change for imaginary singer',
      'Dynamic swell inside long chords — breathe on the bar line before the hard entrance',
      'Compare to a busier take and keep the spacier if clearer'
    ],
    libraryIds: [
      'sg-twinkle',
      'sg-oh-susanna',
      'pr-andalu'
    ],
    masteryCheck: 'Leave the ballad vocal space, then record one take you would keep.',
  },
  309: {

    title: 'Up-Tempo Clarity',
    durationMin: 30,
    goals: [
      'Prepare changes earlier than you think',
      'Thin right hand to save left hand if needed',
      'Graduate tempo only on clean evidence'
    ],
    theoryBite: 'Speed exposes muddy changes. Clarity at tempo requires earlier prep motion. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Isolate fastest change at 80% tempo — keep going if you flub; mark it and finish',
      'Prepare fretting hand early on the beat before — one keepable take beats five restarts',
      'Thin right hand if needed to save left hand — breathe on the bar line before the hard entrance',
      'Build to goal tempo only after two clean slow runs'
    ],
    libraryIds: [
      'sg-amazing-grace',
      'sg-jingle-bells',
      'pr-6251'
    ],
    masteryCheck: 'Keep up-tempo clarity, then record one take you would keep.',
  },
  310: {

    title: 'Slow Blues Vehicle',
    durationMin: 30,
    goals: [
      'Commit to slow heavy time',
      'Use space as part of the language',
      'Limit fills so weight remains'
    ],
    theoryBite: 'Slow blues is space and weight. Long phrases and patient dominant chords teach taste. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      '12-bar skeleton at truly slow tempo — keep going if you flub; mark it and finish',
      'Leave space in bars 2 and 4 of each phrase — one keepable take beats five restarts',
      'Dominant chords get extra sustain and light vibrato optional',
      'One chorus comp, one chorus with tiny fills only'
    ],
    libraryIds: [
      'sg-when-the-saints-go-marching-in',
      'sg-row-row-row-your-boat',
      'pr-12bar',
      'rf-blues-sh'
    ],
    masteryCheck: 'Play the slow blues vehicle, then record one take you would keep.',
  },
  311: {

    title: 'Folk Storytelling Pace',
    durationMin: 30,
    goals: [
      'Pace like storytelling breath',
      'Keep pulse while allowing phrase ends to speak',
      'Land the last sentence cleanly'
    ],
    theoryBite: 'Folk pace follows story breath. Don\'t drag; don\'t chatty-rush between verses. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Tell the story: vary verse intensity without rushing',
      'Keep pulse while allowing phrase-end breaths — one keepable take beats five restarts',
      'Optional hummed verse to pace guitar — breathe on the bar line before the hard entrance',
      'Ending lands like a last sentence, not an accident'
    ],
    libraryIds: [
      'sg-mary-had-a-little-lamb',
      'sg-this-old-man',
      'pr-12bar'
    ],
    masteryCheck: 'Play at folk storytelling pace, then record one take you would keep.',
  },
  312: {

    title: 'Campfire Leadership',
    durationMin: 30,
    goals: [
      'Lead with clear changes and kind tempo',
      'Optimize for singalong survival not perfection',
      'Know how to jump to a safe chorus if lost'
    ],
    theoryBite: 'Lead the room with loud clear changes and friendly tempos. Perfect ornaments are optional. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Play as if others sing — louder changes, simpler ornaments',
      'Call the chord names once before starting — one keepable take beats five restarts',
      'Steady boom or strum a drunk-friendly tempo — breathe on the bar line before the hard entrance',
      'If you get lost, jump to chorus on next downbeat'
    ],
    libraryIds: [
      'sg-london-bridge',
      'sg-she-ll-be-coming-round-the-mount',
      'rf-d-folk-pattern-study'
    ],
    masteryCheck: 'Lead the campfire loop, then record one take you would keep.',
  },
  313: {

    title: 'Solo Performance Shape',
    durationMin: 30,
    goals: [
      'Design an energy arc for the set or multi-section run',
      'Practice human transitions (talk/breath)',
      'Time the arc roughly'
    ],
    theoryBite: 'A solo set needs shape: welcome, lift, rest, peak, goodbye. Plan where you breathe or talk so the set feels guided, not random.',
    drills: [
      'Write a 3-song or 3-section energy arc on paper — keep going if you flub; mark it and finish',
      'Practice speaking one sentence between sections — one keepable take beats five restarts',
      'Time the arc roughly with a phone clock — know where the lift lives',
      'Run once with performance rules — no stopping for small flubs'
    ],
    libraryIds: [
      'sg-happy-birthday',
      'sg-shenandoah',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Play the solo performance shape, then record one take you would keep.',
  },
  314: {

    title: 'With-Metronome Polish',
    durationMin: 30,
    goals: [
      'Stabilize with click where you rush',
      'Loop only the guilty bars',
      'Keep one click take as reference'
    ],
    theoryBite: 'Click polish reveals kind lies. Use it to stabilize, then graduate to human feel. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Full section with click at practice tempo — keep going if you flub; mark it and finish',
      'Note where you pull ahead of the click and circle those bars',
      'Loop only rushing bars with click — breathe on the bar line before the hard entrance',
      'One keep take with the click — stop when form is honest'
    ],
    libraryIds: [
      'sg-scarborough-fair',
      'sg-simple-gifts',
      'pr-6251'
    ],
    masteryCheck: 'Play the metronome-polished pass, then record one take you would keep.',
  },
  315: {

    title: 'Off-Metronome Humanize',
    durationMin: 35,
    goals: [
      'Humanize without losing form length',
      'Compare to click reference',
      'Tap foot honestly if form stretches'
    ],
    theoryBite: 'After click trust, practice breathing time without wandering form length. Humanize the pocket, not the bar count.',
    drills: [
      'Immediately after click work, play without click',
      'Record and compare length of section to click version',
      'If form stretches, lightly tap foot more honestly',
      'Aim human, not sloppy — small timing lean is fine; rushing is not'
    ],
    libraryIds: [
      'sg-home-on-the-range',
      'sg-down-by-the-riverside',
      'pr-145'
    ],
    masteryCheck: 'Play the humanized pass off the metronome, then record one take you would keep.',
  },
  316: {

    title: 'Nerves Simulation',
    durationMin: 30,
    goals: [
      'Practice one-take pressure safely',
      'Train recovery under mild distraction',
      'Build a ritual that calms starts'
    ],
    theoryBite: 'Simulate pressure with one-take rules and mild distraction. Recovery > perfection fantasy. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'One-take rule for a full section — keep going if you flub; mark it and finish',
      'Add mild distraction (TV low, or stand up) — one keepable take beats five restarts',
      'Practice recovery smile if error happens — breathe on the bar line before the hard entrance',
      'Debrief: what ritual helps next time? — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-barbara-allen',
      'sg-the-parting-glass',
      'pr-12bar'
    ],
    masteryCheck: 'Run the nerves simulation, then record one take you would keep.',
  },
  317: {

    title: 'Second Song Start',
    durationMin: 30,
    goals: [
      'Intake a second vehicle with form-first method',
      'Keep both songs scheduled',
      'Log practical details (BPM/capo)'
    ],
    theoryBite: 'A second vehicle prevents overfit. Intake method matters more than bravado. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Choose second vehicle easier or contrasting — keep going if you flub; mark it and finish',
      'Do intake: form map + section 1 loop — one keepable take beats five restarts',
      'Don\'t abandon song 1 — schedule both — breathe on the bar line before the hard entrance',
      'Log BPM and capo for each song so tomorrow starts faster'
    ],
    libraryIds: [
      'sg-wild-mountain-thyme',
      'sg-the-streets-of-laredo',
      'pr-1645'
    ],
    masteryCheck: 'Start the second song cleanly, then record one take you would keep.',
  },
  318: {

    title: 'Third Song Start',
    durationMin: 30,
    goals: [
      'Add a confidence third song',
      'Keep difficulty staggered in the set',
      'Sketch order early'
    ],
    theoryBite: 'Three songs begin a real mini-set. Stagger difficulty so you have a landing pad song when nerves spike.',
    drills: [
      'Third song should be a confidence piece — keep going if you flub; mark it and finish',
      'Speak a quick form map only, then play from memory',
      'Run section 1 clean five times before touching section 2',
      'Sketch a mini-set order 1–2–3 and say why that flow works'
    ],
    libraryIds: [
      'sg-drunken-sailor',
      'sg-swing-low-sweet-chariot',
      'pr-andalu'
    ],
    masteryCheck: 'Start the third song cleanly, then record one take you would keep.',
  },
  319: {

    title: 'Vehicle Swap Day',
    durationMin: 30,
    goals: [
      'Reset ears with a contrasting vehicle',
      'Transfer one skill from the previous song',
      'Avoid over-ambition on intake day'
    ],
    theoryBite: 'Swapping vehicles resets ears. Bring one skill from the old song into the new. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Park current vehicle; select a contrasting song — keep going if you flub; mark it and finish',
      'Bring one skill (e.g. dynamics plan) into the new song',
      'Short intake only — avoid over-ambition — breathe on the bar line before the hard entrance',
      'Note what feels easier than month one — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-house-of-the-rising-sun',
      'sg-danny-boy-londonderry-air',
      'pr-6251'
    ],
    masteryCheck: 'Swap vehicles, then record one take you would keep.',
  },
  320: {

    title: 'Old Song Revival',
    durationMin: 30,
    goals: [
      'Revive an older song with newer skills',
      'Measure growth with a take',
      'Avoid autopilot thrash'
    ],
    theoryBite: 'Reviving an old song with new skills proves growth. Avoid autopilot nostalgia thrash. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Revisit an early-course song and notice what feels easier now',
      'Apply a new skill (mute cleanup or dynamic arc) — one keepable take beats five restarts',
      'Record a before-memory vs after-take if possible',
      'Celebrate one measurable growth vs the first time you learned it'
    ],
    libraryIds: [
      'sg-aura-lee',
      'sg-joy-to-the-world',
      'pr-145'
    ],
    masteryCheck: 'Revive the old song, then record one take you would keep.',
  },
  321: {

    title: 'New Song Intake Method',
    durationMin: 30,
    goals: [
      'Follow form → sticky bar → ornaments order',
      'Stop before fatigue encodes errors',
      'Write the intake checklist once and reuse'
    ],
    theoryBite: 'New song intake: form, groove, sticky bar, then ornaments. Resist full-speed first passes — they encode panic.',
    drills: [
      'New song intake checklist on paper — keep going if you flub; mark it and finish',
      'Form first, sticky bar second, ornaments never first',
      'Five slow loops of section 1 before any speed attempt',
      'Stop before fatigue encodes errors — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-auld-lang-syne',
      'sg-turkey-in-the-straw',
      'pr-12bar'
    ],
    masteryCheck: 'Use the new-song intake method, then record one take you would keep.',
  },
  322: {

    title: 'Phrase-by-Phrase Learn',
    durationMin: 35,
    goals: [
      'Learn in phrase units',
      'Link only after units are solid',
      'Mark breaths between phrases'
    ],
    theoryBite: 'Phrases are memory units. Link only after each phrase is independently solid. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Slice section into phrase units of 2–4 bars — keep going if you flub; mark it and finish',
      'Master phrase A, phrase B, then A+B only — one keepable take beats five restarts',
      'Don\'t run full section until links work — breathe on the bar line before the hard entrance',
      'Mark phrase breaths on the chart where you actually inhale'
    ],
    libraryIds: [
      'sg-buffalo-gals',
      'sg-twinkle',
      'pr-1645'
    ],
    masteryCheck: 'Learn phrase by phrase, then record one take you would keep.',
  },
  323: {

    title: 'Chunk Boundary Practice',
    durationMin: 30,
    goals: [
      'Practice the boundary bars where breaks occur',
      'Slow the seam below section tempo',
      'Reintegrate only after boundary is easy'
    ],
    theoryBite: 'Practice across boundaries (last 2 beats of A into first 2 of B) where breaks happen. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Loop bars spanning the section boundary only — keep going if you flub; mark it and finish',
      'Slow the boundary 20% under section tempo — one keepable take beats five restarts',
      'Add one bar of context on each side of the sticky chunk',
      'Reintegrate the chunk into full sections at a kind tempo'
    ],
    libraryIds: [
      'sg-sailor-s-hornpipe',
      'sg-amazing-grace',
      'pr-andalu'
    ],
    masteryCheck: 'Practice the chunk boundaries, then record one take you would keep.',
  },
  324: {

    title: 'Slow–Full–Fast Ladder',
    durationMin: 30,
    goals: [
      'Use slow/medium/near-goal rungs',
      'Require clean reps to graduate',
      'Step down without drama when needed'
    ],
    theoryBite: 'Secure slow, musical medium, careful faster. Never skip the middle rung or the fast take is just a messy slow take.',
    drills: [
      'Three tempos on metronome: slow / medium / goal-1',
      'Two clean runs required to graduate a rung — one keepable take beats five restarts',
      'If fail, step down a rung without drama — breathe on the bar line before the hard entrance',
      'Log the best clean tempo you hit today — write the number down'
    ],
    libraryIds: [
      'sg-canon-in-d-pachelbel-theme-publi',
      'sg-when-the-saints-go-marching-in',
      'pr-6251'
    ],
    masteryCheck: 'Climb the slow–full–fast ladder, then record one take you would keep.',
  },
  325: {

    title: 'Hands Separate Practice',
    durationMin: 30,
    goals: [
      'Isolate each hand\'s job',
      'Marry hands under tempo control',
      'Identify the true culprit hand'
    ],
    theoryBite: 'Right hand alone, left hand alone, then marry. Isolation finds the true culprit. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Right hand pattern on open strings or muted — keep going if you flub; mark it and finish',
      'Left hand fretting silent movie (no strum) through changes',
      'Combine sections at 80% speed — only full tempo after two clean links',
      'Identify which hand caused yesterday\'s errors — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-william-tell-motif-rossini-publi',
      'sg-mary-had-a-little-lamb',
      'pr-145'
    ],
    masteryCheck: 'Practice hands separately, then record one take you would keep.',
  },
  326: {

    title: 'Mental Practice Away From Guitar',
    durationMin: 30,
    goals: [
      'Rehearse mentally with real bar counts',
      'Visualize sticky bars specifically',
      'Verify once slowly on guitar after'
    ],
    theoryBite: 'Mental rehearsal activates motor plans. Visualize frets and count form silently. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Away from guitar: visualize fretting through one section',
      'Count the form silently with eyes closed — one keepable take beats five restarts',
      'Spot the sticky bar mentally 5 times — breathe on the bar line before the hard entrance',
      'Return to guitar and play once slowly — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-morning-mood-motif-grieg-public-',
      'sg-london-bridge',
      'pr-12bar'
    ],
    masteryCheck: 'Do the mental practice, then record one take you would keep.',
  },
  327: {

    title: 'Video Self Review',
    durationMin: 30,
    goals: [
      'Catch posture and panic motion on video',
      'Separate visual review from audio review',
      'Apply one visual fix only'
    ],
    theoryBite: 'Video shows posture and panic motions audio misses. Watch once muted, once with sound. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Film one section once and note one fix afterward',
      'Watch the video muted once and only grade posture and tension',
      'Watch the video with audio once and only grade time feel',
      'Pick one visual fix only (shoulder, thumb, face) and re-film 20s'
    ],
    libraryIds: [
      'sg-ode',
      'sg-happy-birthday',
      'pr-1645'
    ],
    masteryCheck: 'Review the video take, then record one take you would keep.',
  },
  328: {

    title: 'Audio Self Review',
    durationMin: 30,
    goals: [
      'Judge time and tone without visual distraction',
      'Timestamp issues',
      'Fix timing before tone chasing'
    ],
    theoryBite: 'Audio review without a mirror focuses time and tone. Timestamp one fix only so the next loop has a job.',
    drills: [
      'Do one audio-only take and listen back once — keep going if you flub; mark it and finish',
      'Listen back without looking at your hands — ear-only critique',
      'Timestamp one timing issue and one tone issue — breathe on the bar line before the hard entrance',
      'Fix timing first in short loops before chasing tone or flash'
    ],
    libraryIds: [
      'sg-oh-susanna',
      'sg-scarborough-fair',
      'pr-andalu'
    ],
    masteryCheck: 'Review the audio take, then record one take you would keep.',
  },
  329: {

    title: 'Peer Share Optional',
    durationMin: 35,
    goals: [
      'If sharing, ask for one targeted note',
      'If solo, simulate peer with a focused question',
      'Apply at most one suggestion'
    ],
    theoryBite: 'If you share, ask for one specific feedback target, not global judgment. Clear questions get useful answers.',
    drills: [
      'Optional: share a 30–60s clip with someone kind — or just archive it',
      'Ask one question (e.g. \'does chorus lift?\') — one keepable take beats five restarts',
      'If no peer, ask future-you the same question on listenback',
      'Apply at most one suggestion today — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-jingle-bells',
      'sg-home-on-the-range',
      'pr-6251'
    ],
    masteryCheck: 'Share with a peer if you like, then record one take you would keep.',
  },
  330: {

    title: 'Teach a Section Aloud',
    durationMin: 30,
    goals: [
      'Explain the section aloud clearly',
      'Demo at a student tempo',
      'Notice understanding gains from teaching'
    ],
    theoryBite: 'Teaching forces clarity. Explain fingering and count-in as if a friend holds the guitar. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Explain section fretting aloud as if teaching — keep going if you flub; mark it and finish',
      'Give yourself a count-in and demo at student tempo',
      'Teach the sticky bar aloud twice like a patient teacher',
      'Notice what you understood better after teaching'
    ],
    libraryIds: [
      'sg-row-row-row-your-boat',
      'sg-barbara-allen',
      'pr-145'
    ],
    masteryCheck: 'Teach a section aloud, then record one take you would keep.',
  },
  331: {

    title: 'Simplify for Consistency',
    durationMin: 30,
    goals: [
      'Cut ornaments until consistency returns',
      'Re-add complexity only on evidence',
      'Value audience-facing stability'
    ],
    theoryBite: 'If error rate is high, remove ornaments. Consistency is a feature audiences feel. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Remove ornaments from highest-error section — keep going if you flub; mark it and finish',
      'Play simplified version 5 clean times — one keepable take beats five restarts',
      'Only then consider re-adding one ornament — breathe on the bar line before the hard entrance',
      'Consistency score beats complexity score — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-this-old-man',
      'sg-wild-mountain-thyme',
      'pr-12bar'
    ],
    masteryCheck: 'Play the simplified version 5 clean times, then record one take you would keep.',
  },
  332: {

    title: 'Ornament After Solid',
    durationMin: 30,
    goals: [
      'Ornament only on solid skeletons',
      'One ornament family at a time',
      'Abort if time wobbles'
    ],
    theoryBite: 'Add slides, hammers, or bass walks only on a stable skeleton. Ornaments on a wobbly form just decorate the wobble.',
    drills: [
      'Do a skeleton take first — form only, no ornaments',
      'Add one ornament type only (slide or hammer) — one keepable take beats five restarts',
      'Place ornaments on weak beats or phrase ends — breathe on the bar line before the hard entrance',
      'Abort ornaments if time wobbles — plain notes win on show week'
    ],
    libraryIds: [
      'sg-she-ll-be-coming-round-the-mount',
      'sg-drunken-sailor',
      'pr-1645'
    ],
    masteryCheck: 'Add ornaments after the solid skeleton, then record one take you would keep.',
  },
  333: {

    title: 'Signature Lick Placement',
    durationMin: 30,
    goals: [
      'Create one signature lick',
      'Place it consistently in form',
      'Keep it tempo-honest'
    ],
    theoryBite: 'One signature lick placed well beats five random fills. Put it where form breathes. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Write a 1-bar signature lick you could play half-asleep',
      'Place it in the same form location each time — one keepable take beats five restarts',
      'Practice song with lick omitted vs included — breathe on the bar line before the hard entrance',
      'Keep lick slower than surrounding ego — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-shenandoah',
      'sg-house-of-the-rising-sun',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Place the signature lick, then record one take you would keep.',
  },
  334: {

    title: 'Silence Schedule in the Song',
    durationMin: 30,
    goals: [
      'Schedule silence as arrangement',
      'Protect planned air from nervous fills',
      'Feel the lift after silence'
    ],
    theoryBite: 'Schedule rests as arrangement. Silence before a chorus can lift harder than more strums. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Schedule a one-bar near-silence before chorus — keep going if you flub; mark it and finish',
      'Protect that silence in every run — one keepable take beats five restarts',
      'No nervous fills inside the planned air — breathe on the bar line before the hard entrance',
      'Feel how chorus hits harder after air — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-simple-gifts',
      'sg-aura-lee',
      'pr-6251'
    ],
    masteryCheck: 'Play the silence schedule, then record one take you would keep.',
  },
  335: {

    title: 'Intro From Silence',
    durationMin: 30,
    goals: [
      'Start from true silence with a count-in',
      'Make the first hit intentional',
      'Eliminate pre-start noise'
    ],
    theoryBite: 'Starting from silence trains confident first hits. Count in; don\'t sneak noise. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Hands ready, true silence, then count-in — keep going if you flub; mark it and finish',
      'First hit confident mf, not accidental graze — one keepable take beats five restarts',
      'Ten reps: silence, then a clean start — no flinch on beat 1',
      'If noise creeps, freeze longer before counting — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-down-by-the-riverside',
      'sg-auld-lang-syne',
      'pr-145'
    ],
    masteryCheck: 'Start from silence, then record one take you would keep.',
  },
  336: {

    title: 'Cold Ending Practice',
    durationMin: 35,
    goals: [
      'Cut off together with yourself',
      'Zero noise after the hit',
      'Practice stillness as part of the ending'
    ],
    theoryBite: 'Cold endings stop together. Practice the final hit and the still body after. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Final hit, mute, still body — hold the quiet like part of the song',
      'No string noise after cutoff — right hand parks clean',
      'Fifteen cold endings in a row — button the last hit every time',
      'Video the stillness once after the last hit — no string noise'
    ],
    libraryIds: [
      'sg-the-parting-glass',
      'sg-buffalo-gals',
      'pr-12bar'
    ],
    masteryCheck: 'Practice the cold ending, then record one take you would keep.',
  },
  337: {

    title: 'Tag Ending Practice',
    durationMin: 30,
    goals: [
      'Decide tag length and dynamics',
      'Connect tag to button cleanly',
      'Notate so you remember under pressure'
    ],
    theoryBite: 'Tags repeat a final hook. Decide how many repeats before the button ending so you do not improvise yourself into a corner.',
    drills: [
      'Decide tag length (1 or 2 repeats) — keep going if you flub; mark it and finish',
      'Practice the tag into a firm button ending without extra hits',
      'Keep tag dynamics intentional (build or shrink) — breathe on the bar line before the hard entrance',
      'Notate the tag ending on your chart before playing'
    ],
    libraryIds: [
      'sg-the-streets-of-laredo',
      'sg-sailor-s-hornpipe',
      'pr-1645'
    ],
    masteryCheck: 'Practice the tag ending, then record one take you would keep.',
  },
  338: {

    title: 'Key Change Taste Optional',
    durationMin: 30,
    goals: [
      'Treat key lift as optional drama',
      'Require base key solidity first',
      'Allow live skip if unstable'
    ],
    theoryBite: 'A late key lift is optional drama. Only attempt if the original key is already solid. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Optional last-chorus capo or shape shift only if base key solid',
      'Practice the modulation moment 10 times slowly — one keepable take beats five restarts',
      'If unstable, postpone key change — strength first',
      'Mark optional on chart so you can skip live — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-swing-low-sweet-chariot',
      'sg-drums',
      'pr-andalu'
    ],
    masteryCheck: 'Try the key change, then record one take you would keep.',
  },
  339: {

    title: 'Modulation Walkup',
    durationMin: 30,
    goals: [
      'Make bass walk clear and slow first',
      'Connect old key area into new center',
      'Abort if tempo or pitch fails'
    ],
    theoryBite: 'Walkups into a new key need clear bass motion. Slow is mandatory at first — name the notes so the ear learns the door.',
    drills: [
      'Write bass walk into a new tonal center — keep going if you flub; mark it and finish',
      'Slow walk the modulation with named notes under your breath',
      'Connect from old chorus into walked lift — breathe on the bar line before the hard entrance',
      'Abort if intonation or tempo fails — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-danny-boy-londonderry-air',
      'sg-camptown-races',
      'pr-6251'
    ],
    masteryCheck: 'Play the modulation walkup, then record one take you would keep.',
  },
  340: {

    title: 'Stop-Time Section',
    durationMin: 30,
    goals: [
      'Place stop-time hits with strict rests',
      'Re-enter groove on the correct beat',
      'Use sparingly for theater'
    ],
    theoryBite: 'Stop-time inside a song is theater. Hits must be agreed with your own click sense. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Design 2 bars of stop-time hits inside the song — keep going if you flub; mark it and finish',
      'Practice with click and strict rests — one keepable take beats five restarts',
      'Re-enter groove cleanly after stops — breathe on the bar line before the hard entrance',
      'Use once per song unless arrangement needs more — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-joy-to-the-world',
      'sg-skip-to-my-lou',
      'pr-12bar',
      'rf-blues-sh'
    ],
    masteryCheck: 'Play the stop-time section, then record one take you would keep.',
  },
  341: {

    title: 'Breakdown Section',
    durationMin: 30,
    goals: [
      'Build a true sparse breakdown',
      'Rebuild texture with intention',
      'Make contrast obvious to a listener'
    ],
    theoryBite: 'Breakdowns strip texture. Practice the sparse version so rebuilds feel huge. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Strip section to skeleton (roots or light chops)',
      'Loop the sticky 8 bars until the hitch disappears twice in a row',
      'Rebuild to full texture over 4 bars — breathe on the bar line before the hard entrance',
      'Make the contrast obvious enough a friend would notice cold'
    ],
    libraryIds: [
      'sg-turkey-in-the-straw',
      'sg-fr-re-jacques',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Play the breakdown section, then record one take you would keep.',
  },
  342: {

    title: 'Final Chorus Plus',
    durationMin: 30,
    goals: [
      'Differentiate final chorus with one lift',
      'Keep form length true',
      'Still prepare the ending'
    ],
    theoryBite: 'Final chorus lift can be higher voicing, fuller strums, or a harmony hint — pick one, not all three at once.',
    drills: [
      'Final chorus adds one lift element only — keep going if you flub; mark it and finish',
      'Practice penultimate vs final chorus back-to-back',
      'Keep form length identical when you add the final chorus lift',
      'Practice the ending cold — last chord held, no fade-out shrug'
    ],
    libraryIds: [
      'sg-minuet-in-g-bach-public-domain',
      'sg-go-tell-aunt-rhody',
      'pr-1645'
    ],
    masteryCheck: 'Play the final chorus plus, then record one take you would keep.',
  },
  343: {

    title: 'False Ending Fun',
    durationMin: 35,
    goals: [
      'Fake ending only after real ending exists',
      'Keep the joke musically clean',
      'Notate to avoid self-traps'
    ],
    theoryBite: 'False endings play with expectation. Only funny if the real ending is secure. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Play fake ending gesture, then continue tag — keep going if you flub; mark it and finish',
      'Only if real ending is already solid — one keepable take beats five restarts',
      'Audience (imaginary) must not be confused by sloppy fake',
      'Notate clearly so you remember live — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-brahms-lullaby',
      'sg-greensleeves',
      'pr-andalu'
    ],
    masteryCheck: 'Try the false ending, then record one take you would keep.',
  },
  344: {

    title: 'Medley Bridge Writing',
    durationMin: 30,
    goals: [
      'Write a short bridge between songs',
      'Slow-practice the seam',
      'Then run real endings into real beginnings'
    ],
    theoryBite: 'Medley bridges can be a shared chord, a drum-fill feel, or a held note. The seam should feel inevitable, not clever-for-clever.',
    drills: [
      'Write 2–4 bar bridge between two repertoire songs',
      'Shared chord or drum-like hits as glue — one keepable take beats five restarts',
      'Slow seam practice ten times where the medley pieces join',
      'Then song A end → bridge → song B start — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-the-entertainer-motif-joplin-pub',
      'sg-red-river-valley',
      'pr-6251'
    ],
    masteryCheck: 'Write the medley bridge, then record one take you would keep.',
  },
  345: {

    title: 'Repertoire Journaling',
    durationMin: 30,
    goals: [
      'Externalize wins and next actions',
      'Circle one action and do it immediately',
      'Avoid endless planning loops'
    ],
    theoryBite: 'Journal what improved and what is next. Written goals outperform mood memory. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Write 5 lines: wins, sticky bar, tempo, energy, next action',
      'Circle one next action only in the journal — ignore the rest',
      'Do that one circled action for ten focused minutes — nothing else',
      'Close journal — avoid endless planning — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-st-louis-blues-motif-handy-1914-',
      'sg-wayfaring-stranger',
      'pr-145'
    ],
    masteryCheck: 'Journal the repertoire wins, then record one take you would keep.',
  },
  346: {

    title: 'Goal Tempo Decision',
    durationMin: 30,
    goals: [
      'Pick BPM from evidence not ego',
      'Write it large on the chart',
      'Test candidates with 8-bar samples'
    ],
    theoryBite: 'Choose a goal tempo with evidence — singability and clean changes — not ego. Write the number down so practice has a target.',
    drills: [
      'Candidate tempos: safe / stretch / ego — keep going if you flub; mark it and finish',
      'Test eight bars at each tempo step before speeding',
      'Pick a safe tempo or a stretch tempo — not both in one take',
      'Write BPM on chart in large numbers — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-drums',
      'sg-black-is-the-color',
      'pr-12bar'
    ],
    masteryCheck: 'Decide the goal tempo, then record one take you would keep.',
  },
  347: {

    title: 'Practice Tempo Loyalty',
    durationMin: 30,
    goals: [
      'Stay loyal to practice BPM for the session',
      'Raise only on clean evidence',
      'Log ending tempo'
    ],
    theoryBite: 'Stay at practice tempo until error rate drops. Loyalty beats random speeding. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Whole session loyal to practice BPM — keep going if you flub; mark it and finish',
      'If clean, tiny +2 BPM at end optional — one keepable take beats five restarts',
      'No random tempo jumps mid-section — finish what you started',
      'Log the ending BPM you can play cleanly today — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-camptown-races',
      'sg-molly-malone',
      'pr-1645'
    ],
    masteryCheck: 'Stay loyal to the practice tempo, then record one take you would keep.',
  },
  348: {

    title: 'Performance Tempo Courage',
    durationMin: 30,
    goals: [
      'Commit to a performance BPM before the take',
      'Count in at that speed',
      'Avoid mid-song renegotiation'
    ],
    theoryBite: 'On take day, pick a courageous-but-kind tempo and commit without mid-song renegotiation. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Choose performance BPM before the take — keep going if you flub; mark it and finish',
      'Count-in at that BPM out loud, then play — no mystery starts',
      'No mid-song tempo arguments with yourself — breathe on the bar line before the hard entrance',
      'After the take, note whether it felt kind — not only correct'
    ],
    libraryIds: [
      'sg-skip-to-my-lou',
      'sg-careless-love',
      'pr-andalu'
    ],
    masteryCheck: 'Try the performance tempo with courage, then record one take you would keep.',
  },
  349: {

    title: 'Error Budget Acceptance',
    durationMin: 30,
    goals: [
      'Allow a small error budget and finish anyway',
      'Score recovery separately from perfection',
      'Keep finished takes'
    ],
    theoryBite: 'Allow a small error budget in performance takes. Finish the story anyway; the audience remembers completion more than one flub.',
    drills: [
      'Allow up to 2 visible errors without stopping — keep going if you flub; mark it and finish',
      'Practice finishing the phrase anyway after a small mistake',
      'Score recovery quality separately from note perfection',
      'Keep a take that finished strong — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-fr-re-jacques',
      'sg-joshua-fit-the-battle-of-jericho',
      'pr-6251'
    ],
    masteryCheck: 'Accept the error budget, then record one take you would keep.',
  },
  350: {

    title: 'Smile and Breathe Reset',
    durationMin: 35,
    goals: [
      'Use exhale+smile as a reset tool',
      'Install it on the stickiest bar',
      'Notice calmer tempo with a soft jaw'
    ],
    theoryBite: 'A smile and exhale resets nervous system tempo. Build it into sticky moments. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'At sticky bar, exhale and slight smile on purpose',
      'Rehearse smile reset 10 times on that bar — one keepable take beats five restarts',
      'Notice tempo calms when jaw softens — breathe on the bar line before the hard entrance',
      'Use the smile-and-breathe reset in the next full run on purpose'
    ],
    libraryIds: [
      'sg-go-tell-aunt-rhody',
      'sg-silent-night',
      'pr-145'
    ],
    masteryCheck: 'Use the smile-and-breathe reset, then record one take you would keep.',
  },
  351: {

    title: 'Stage Plot Minimal',
    durationMin: 30,
    goals: [
      'Make a minimal repeatable stage plot',
      'Reduce friction for picks and charts',
      'Remove trip hazards'
    ],
    theoryBite: 'Know where tab/chart, pick, and water live. Minimal plots reduce panic searches. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Place chart, pick, water in consistent spots — keep going if you flub; mark it and finish',
      'Rehearse grabbing pick without looking — one keepable take beats five restarts',
      'Remove trip hazards in practice space — breathe on the bar line before the hard entrance',
      'Photo your minimal form plot — verse/chorus labels you can read at a glance'
    ],
    libraryIds: [
      'sg-greensleeves',
      'sg-i-ve-been-working-on-the-railroa',
      'pr-12bar'
    ],
    masteryCheck: 'Play the minimal stage plot, then record one take you would keep.',
  },
  352: {

    title: 'Gear Check Ritual',
    durationMin: 30,
    goals: [
      'Run a boring gear checklist',
      'Fix one friction point',
      'Never skip checklist before dress runs'
    ],
    theoryBite: 'Cable, tuning, strap, battery — boring gear rituals prevent exciting failures. Run the list aloud before the first note.',
    drills: [
      'Checklist: tuning, strap, cable/path, battery/pick reserve',
      'Run the gear checklist aloud once before you play a note',
      'Fix one gear friction today (cable, strap, stand, tuner place)',
      'Don\'t skip checklist before dress runs — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-red-river-valley',
      'sg-arkansas-traveler',
      'pr-1645'
    ],
    masteryCheck: 'Run the gear check ritual, then record one take you would keep.',
  },
  353: {

    title: 'Tuning Check Ritual',
    durationMin: 30,
    goals: [
      'Tune intentionally before keep takes',
      'Recheck after vigorous playing',
      'Know your usual drift string'
    ],
    theoryBite: 'Tune with intention before takes. Quick checks between songs save public wince. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Play the full tune once at the start as a baseline',
      'Quick check after vigorous sections — one keepable take beats five restarts',
      'Listen for the string that usually drifts — breathe on the bar line before the hard entrance',
      'Never accept \'close enough\' before a keep take — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-wayfaring-stranger',
      'sg-ode',
      'pr-andalu'
    ],
    masteryCheck: 'Run the tuning check ritual, then record one take you would keep.',
  },
  354: {

    title: 'Setlist Timing Math',
    durationMin: 30,
    goals: [
      'Estimate real set length with buffers',
      'Protect the closer from time blowups',
      'Adjust set order if math fails'
    ],
    theoryBite: 'Estimate song lengths including talk. Timing math prevents cutting the closer. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Estimate each song length at performance tempo — keep going if you flub; mark it and finish',
      'Add 10–20s talk/tune buffer between songs — one keepable take beats five restarts',
      'Play the mini-set in order and total the runtime',
      'Adjust the set if you are over time budget — cut kindly'
    ],
    libraryIds: [
      'sg-black-is-the-color',
      'sg-oh-susanna',
      'pr-6251'
    ],
    masteryCheck: 'Check the setlist timing math, then record one take you would keep.',
  },
  355: {

    title: 'Encore Decision Logic',
    durationMin: 30,
    goals: [
      'Decide encore or no encore in advance',
      'Keep encore easy if used',
      'Practice the bow either way'
    ],
    theoryBite: 'Plan encore if energy remains; otherwise bow out strong. Decided endings feel pro. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Decide encore song or decide none — keep going if you flub; mark it and finish',
      'If encore, keep it easy and beloved — one keepable take beats five restarts',
      'Practice a small bow and exit whether the take was good or messy',
      'Avoid undecided hovering endings — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-molly-malone',
      'sg-jingle-bells',
      'pr-145'
    ],
    masteryCheck: 'Apply the encore decision logic, then record one take you would keep.',
  },
  356: {

    title: 'Two-Song Mini Set',
    durationMin: 30,
    goals: [
      'Run two songs with a real reset between',
      'Notice transition friction',
      'Fix only transition issues today if songs are ready'
    ],
    theoryBite: 'Two songs back-to-back train the seams: tune, take a breath, count in, and go without freezing. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Run song A all the way through without stopping — keep going if you flub; mark it and finish',
      'Take 60 seconds to tune, breathe, and set posture',
      'Run song B all the way through without stopping — breathe on the bar line before the hard entrance',
      'Notes on transition friction only — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-careless-love',
      'sg-row-row-row-your-boat',
      'pr-12bar'
    ],
    masteryCheck: 'Play song A and song B with a controlled reset between them.',
  },
  357: {

    title: 'Three-Song Mini Set',
    durationMin: 35,
    goals: [
      'Run three songs for stamina and arc',
      'Protect song 3 with simplicity if needed',
      'Log total minutes and energy'
    ],
    theoryBite: 'Three songs reveal stamina and set arc. Keep one easy landing-pad song so the set can recover if something wobbles.',
    drills: [
      'Run three songs with short resets — keep going if you flub; mark it and finish',
      'Watch stamina on song 3 — if the hand dies, simplify the part, do not push through trash',
      'If song 3 collapses, simplify it — breathe on the bar line before the hard entrance',
      'Log total focused minutes for this session — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-joshua-fit-the-battle-of-jericho',
      'sg-this-old-man',
      'pr-1645'
    ],
    masteryCheck: 'Play a three-song mini-set with intentional order and surviving stamina.',
  },
  358: {

    title: 'Full Run With Notes',
    durationMin: 30,
    goals: [
      'Complete a full run with chart allowed',
      'Circle only true eye-dependency bars',
      'Schedule memory work on those bars'
    ],
    theoryBite: 'Full runs with chart allowed still require musical continuity and recovery. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Full song with the chart allowed — aim for musical, not heroic',
      'No stopping for anything but safety — one keepable take beats five restarts',
      'Circle only bars that truly needed eyes — breathe on the bar line before the hard entrance',
      'Schedule memory work on those bars tomorrow — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-silent-night',
      'sg-she-ll-be-coming-round-the-mount',
      'pr-andalu'
    ],
    masteryCheck: 'Play a full run with notes, then record one take you would keep.',
  },
  359: {

    title: 'Full Run No Notes',
    durationMin: 30,
    goals: [
      'Complete a memory run with recovery rules',
      'Mark danger spots afterward without shame',
      'Convert marks into loop plans'
    ],
    theoryBite: 'Memory runs expose cue gaps. Mark only the true danger spots afterward — not every imperfect bar. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Chart face down or app closed — memory run, gentle tempo',
      'Full run with recovery rules on — no shame stops mid-song',
      'Afterward, reopen chart and mark danger spots — breathe on the bar line before the hard entrance',
      'Don\'t shame rough spots — schedule loops for them tomorrow'
    ],
    libraryIds: [
      'sg-i-ve-been-working-on-the-railroa',
      'sg-shenandoah',
      'pr-6251'
    ],
    masteryCheck: 'Finish a no-chart run using recovery, then mark only true danger spots.',
  },
  360: {

    title: 'Dress Rehearsal Energy',
    durationMin: 30,
    goals: [
      'Use performance rules for a primary full take',
      'Limit retakes',
      'Value finishing energy'
    ],
    theoryBite: 'Dress rehearsal means limited stops, full recovery rules, and real tempo. Practice the show energy, not only the notes.',
    drills: [
      'Performance clothing optional; performance rules mandatory',
      'One primary full take — start to end, no stopping to fix mid-song',
      'Limited second take only if technical failure — breathe on the bar line before the hard entrance',
      'Celebrate finishing energy more than perfect note scores'
    ],
    libraryIds: [
      'sg-arkansas-traveler',
      'sg-simple-gifts',
      'pr-145'
    ],
    masteryCheck: 'Complete a dress-rehearsal take under performance rules at committed tempo.',
  },
  361: {

    title: 'Pre-Show Light Day',
    durationMin: 30,
    goals: [
      'Keep hands light and minutes short',
      'Touch starts and endings only',
      'Avoid fear-grinding sticky bars'
    ],
    theoryBite: 'Light days protect hands. Touch the starts and endings; avoid grinding mistakes. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Touch intros and endings only — leave middles for later',
      'Light hands, short minutes — protect the hands before show day',
      'Hydrate and stretch fretting hand for thirty seconds',
      'No grinding sticky bars into fear — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-f-r-elise-motif-beethoven-public',
      'sg-down-by-the-riverside',
      'pr-12bar'
    ],
    masteryCheck: 'Do the pre-show light pass, then record one take you would keep.',
  },
  362: {

    title: 'Capstone Rehearsal A — Sections',
    durationMin: 30,
    goals: [
      'Score each section honestly',
      'Invest extra loops in the lowest section',
      'Defer full-set bravado'
    ],
    theoryBite: 'Capstone A prioritizes section quality and form clarity over full-set bravado. Finish sections; recovery under light pressure is part of the skill.',
    drills: [
      'Run each section of vehicle song for quality — keep going if you flub; mark it and finish',
      'Don\'t require full set stamina yet — one keepable take beats five restarts',
      'Score sections 1–5 honestly on paper — no grade inflation',
      'Pick lowest section for extra loops — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-blue-danube-motif-strauss-public',
      'sg-the-parting-glass',
      'pr-1645'
    ],
    masteryCheck: 'Play the sections cleanly, then record one take you would keep.',
  },
  363: {

    title: 'Capstone Rehearsal B — Transitions',
    durationMin: 30,
    goals: [
      'Make seams the hero of the day',
      'Ten focused reps per dangerous seam',
      'Verify with one full song'
    ],
    theoryBite: 'Capstone B is about the seams — intros, endings, and the air between songs — not only the middle grooves.',
    drills: [
      'Only seams and transitions today — keep going if you flub; mark it and finish',
      'Intro, section links, ending, song-to-song if multi',
      'Do ten slow reps on each hard seam change — breathe on the bar line before the hard entrance',
      'Full song once to verify seams hold — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-maple-leaf-rag-motif-joplin-publ',
      'sg-the-streets-of-laredo',
      'pr-andalu'
    ],
    masteryCheck: 'Play the transitions cleanly, then record one take you would keep.',
  },
  364: {

    title: 'Capstone Rehearsal C — Full Story',
    durationMin: 35,
    goals: [
      'Tell the full story under recovery rules',
      'Capture notes kindly after',
      'Protect hands — capstone is near'
    ],
    theoryBite: 'Capstone C is a full story run with recovery rules and kind notes after. You are rehearsing the year, not hunting perfection.',
    drills: [
      'Full story run with recovery rules — keep going if you flub; mark it and finish',
      'Record the take if possible and keep the best one',
      'After the take, three kind pencil notes — one keep, one fix, one try tomorrow',
      'Protect hands after — you\'re close to capstone — keep going if you flub; mark it and finish'
    ],
    libraryIds: [
      'sg-twinkle',
      'sg-swing-low-sweet-chariot',
      'pr-6251'
    ],
    masteryCheck: 'Complete a full story run with recovery rules and kind written notes after.',
  },
  365: {

    title: 'Year Capstone — Full Path Performance',
    durationMin: 45,
    goals: [
      'Warm up with something easy that sounds like you',
      'Run a mini-set (two or three pieces/sections) with planned order',
      'Recover from at least one intentional flub without stopping the show'
    ],
    theoryBite: 'Year capstone: show a path, not perfection. Warm up kindly, run a short set with recovery skills, and leave knowing what you own. Mastery is repeatable music under light pressure — not a flawless fantasy take.',
    drills: [
      'Light warm-up: open strings or easiest song section for three minutes',
      'Full run of your set once with notes allowed, once with fewer notes',
      'Dress-rehearsal energy: stand if you can, breathe before downbeats, smile after the last chord'
    ],
    libraryIds: [
      'sg-amazing-grace',
      'sg-ode',
      'pr-145'
    ],
    masteryCheck: 'Complete a short set you would play for a friend, with recovery and a clear ending.',
  },
}

function templateLesson(day: number): Omit<Lesson, 'privateLesson'> {
  const phase = phaseForDay(day)
  const skill = skillForDay(day)
  const deep = DEEP_LESSONS[day]
  if (!deep) {
    throw new Error(`Missing DEEP_LESSONS seed for day ${day}`)
  }
  const { privateLesson: _pl, ...seed } = deep
  return { day, phase, skill, ...seed }
}

function withPrivateLesson(
  day: number,
  phase: LessonPhase,
  skill: SkillLevel,
  seed: Omit<Lesson, 'day' | 'phase' | 'skill' | 'privateLesson'>,
): Lesson {
  const privateLesson = expandPrivateLesson(day, phase, skill, {
    title: seed.title,
    durationMin: seed.durationMin,
    goals: seed.goals,
    theoryBite: seed.theoryBite,
    drills: seed.drills,
    libraryIds: seed.libraryIds,
    masteryCheck: seed.masteryCheck,
  })
  return {
    day,
    phase,
    skill,
    ...seed,
    durationMin: privateLesson.durationMin || seed.durationMin,
    privateLesson,
  }
}

/** Full 365-day curriculum — unique daily wins + private-lesson expand. */
export const CURRICULUM: Lesson[] = Array.from({ length: 365 }, (_, i) => {
  const day = i + 1
  const base = templateLesson(day)
  return withPrivateLesson(day, base.phase, base.skill, base)
})

export function getLesson(day: number): Lesson | undefined {
  if (day < 1 || day > 365) return undefined
  return CURRICULUM[day - 1]
}

export function getPhaseMeta(): { phase: LessonPhase; start: number; end: number }[] {
  return PHASE_DAYS
}
