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
 * Phase map — research-backed easy path:
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
      'Slow spider 1-2-3-4 on the high E around 50 BPM',
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
      'Down-strums on beats 1 and 3 only',
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
    theoryBite: 'G major is G B D. Single shapes are nice; smooth changes are the real beginner skill.',
    drills: [
      'Build G one finger at a time, then strum — fix buzz before speed',
      'Em | G at about 50 BPM, two bars each',
      'Keep the strum arm moving while your fretting hand switches'
    ],
    libraryIds: [
      'ch-g',
      'ch-em'
    ],
    masteryCheck: 'Complete four clean Em→G changes in 30 seconds.',
  },
  5: {

    title: 'C Major — Five-String Clarity',
    durationMin: 25,
    goals: [
      'Form open C without choking the B or G strings',
      'Skip accidental bangs on the low E',
      'Connect C with G'
    ],
    theoryBite: 'C major is C E G. Open C frets A3, D2, B1. Leaving the low E out is normal — not a mistake.',
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
    theoryBite: 'D major is D F# A. It’s a top-four-string chord — missing the low strings is correct.',
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
      'Four bars on each chord at 70 BPM',
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
      'See Am as Em slid toward the floor',
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
    theoryBite: 'Count 1 & 2 & 3 & 4 &. Your right hand is the drummer; the fretting hand just changes costumes.',
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
      'Freeze A and audit string by string',
      'A–D–E–A twice at a walking pace — mute the open strings you do not want',
      'Toggle A vs Am on a steady beat — hear major brighten and minor soften'
    ],
    libraryIds: [
      'ch-a',
      'sg-go-tell-aunt-rhody'
    ],
    masteryCheck: 'Play two full A–D–E loops with steady time.',
  },
  11: {

    title: 'Minor Pentatonic Box 1 — First Lead Map',
    durationMin: 30,
    goals: [
      'Find the A root for box 1 (low E string, fret 5)',
      'Walk box 1 up and down slowly',
      'Improvise using only three notes'
    ],
    theoryBite: 'A minor pentatonic is A C D E G. Box 1 is the rock/blues map everyone bumps into first — fewer notes, easier music.',
    drills: [
      'Pulse the root on beat 1 for 30 seconds',
      'Ascend the box, rest one bar, then descend',
      'Three-note solo rule for a full minute'
    ],
    libraryIds: [
      'sc-pent-min',
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Play box 1 up and down in time at 60 BPM, landing on the root.',
  },
  12: {

    title: 'First Melody — Twinkle in Open Position',
    durationMin: 30,
    goals: [
      'Learn the melody in short phrases',
      'Sing a phrase, then play it',
      'Connect phrases without panic stops'
    ],
    theoryBite: 'Melodies train ear and timing faster than empty shapes. A phrase is a musical sentence — breathe between them.',
    drills: [
      'Map phrase 1 only until it feels easy',
      'Call-and-response: sing, then play',
      'One slow clean pass through the whole melody'
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
      'Fret a root + fifth power shape',
      'Mute unused strings lightly',
      'Move the shape on the low E string'
    ],
    theoryBite: 'A power chord is root + fifth (sometimes plus the octave). Movable, tough-sounding, and friendly when full barres still hurt.',
    drills: [
      'E5 at open/2, then move the shape to frets 3/5 — same grip',
      'Palm-mute downstroke eighths on the power chord — steady wrist',
      'Little riff: move the root in time'
    ],
    libraryIds: [
      'sg-mary-had-a-little-lamb'
    ],
    masteryCheck: 'Play a four-bar power-chord riff twice with muted clarity.',
  },
  15: {

    title: 'Switching Lab — Shrink the Motion',
    durationMin: 30,
    goals: [
      'Watch which fingers travel farthest',
      'Park shared fingers when you can',
      'Change G–C–D with smaller motions'
    ],
    theoryBite: 'Economy of motion beats raw finger speed. The shortest path between shapes is its own practice skill.',
    drills: [
      'Film one change in slow-mo if you can',
      'G–C isolation for two minutes — only that change, slow and kind',
      'C–D isolation for two minutes — plant each shape before leaving'
    ],
    libraryIds: [
      'sg-london-bridge'
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
      'Motif | C chord | motif | G chord',
      'Soft question, fuller answer — light dynamics'
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
    theoryBite: 'Listeners feel time before they notice fancy chords. Pocket means your notes agree with the pulse.',
    drills: [
      'Foot-only quarters for 30 seconds',
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
      'Pluck Dm string-by-string and fix dead notes',
      'D | Dm | D | Dm — feel the one-finger shift, no rush between colors',
      'Loop Dm–C–G–G four times with even strums'
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
    masteryCheck: 'Play two clear V7→I resolutions: G7→C and D7→G.',
  },
  20: {

    title: 'Simple Fingerstyle Seed — Thumb + i',
    durationMin: 30,
    goals: [
      'Thumb plays bass on beat 1',
      'Index answers on a higher string',
      'Keep the pattern boringly steady'
    ],
    theoryBite: 'Travis-style seeds start with thumb independence. A steady bass makes sparse treble sound pro.',
    drills: [
      'Thumb on open A only for one minute',
      'Add index on the B string on the &s',
      'Run the pattern over an Am shape for 8 bars'
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
    theoryBite: 'Full F barre is a milestone, not a day-one law. Mini shapes and patience beat forced pain.',
    drills: [
      'One-finger barre chirps, ten times',
      'Fmaj7 (easy version) as an alternate win',
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
    theoryBite: 'Voice to fret is the shortest path to owning music. Wrong notes are clues, not crimes.',
    drills: [
      'Hum a note, hunt it on the neck, check — five calm rounds',
      'Change the starting pitch once and hunt the new note cleanly',
      'Don’t write it down — trust your ears'
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
      'G–C–D at whisper volume with locked time',
      'Same progression at conversation level',
      'Eight soft bars, then eight fuller bars'
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
      'Palm-muted open low-E eighths near the bridge',
      'Chuck lightly on the &s between chord hits — groove, not noise',
      'Full stop rests for one bar in every four'
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
      'Build a cell on the high strings',
      'Cell | Em | cell | G — leave a breath before each chord so the cell stays clear',
      'Say the sketch’s name out loud — silly names welcome'
    ],
    libraryIds: [
      'sg-twinkle',
      'sg-ode'
    ],
    masteryCheck: 'Perform your 4-bar sketch twice from memory.',
  },
  26: {

    title: 'Timing Honesty — Metronome as Friend',
    durationMin: 30,
    goals: [
      'Play only on beat 1 of each bar for one minute',
      'Add more beats only when that feels solid',
      'Notice when you rush the easy bars'
    ],
    theoryBite: 'A metronome tells the truth kindly. Landing late or early is just data for the next rep.',
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
    theoryBite: 'Fixing the weak link beats replaying what already feels good. One rescue per session adds up fast.',
    drills: [
      'Rank Em G C D A Am E from cleanest to messiest',
      'Ugly-chord gym for five minutes — freeze shapes, then release',
      'Progression with the ugly chord on every bar 2'
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
      'E7 for four bars, A7 for two, back again',
      'Long-short shuffle strum attempt',
      'Smile — feel over perfection today'
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
      'Play four minutes, break thirty seconds, repeat',
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
      'Jot a three-minute order on paper',
      'Full run with no stops — restart only after the end',
      'Second run with soft and loud sections'
    ],
    libraryIds: [
      'rf-spider',
      'sg-twinkle'
    ],
    masteryCheck: 'Deliver about three minutes using at least three chords and one melodic idea.',
  },
  31: {

    title: 'Chord Phase Open — Clean Changes Manifesto',
    durationMin: 30,
    goals: [
      'Audit dead notes on your core six chords',
      'Pick one change to shrink this week',
      'Play music before drills finish'
    ],
    theoryBite: 'Chord changes get smoother with slow clean reps, not sloppy speed. Play something that sounds like music early so you stay hooked.',
    drills: [
      'Parade the core six: Em G C D Am E — one clean bar each',
      'Choose G–C or C–D as this week\'s change focus and write it down',
      '60s song loop before any timer ego'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Play a one-minute loop of four chords with fewer than three total dead landings.',
  },
  32: {

    title: 'G–C Highway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean G on beat 1',
      'Land clean C on beat 1',
      'Keep right hand pulsing through the switch'
    ],
    theoryBite: 'Shared notes and pivot fingers make G–C a high-ROI change. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Freeze G shape and strum eight even downstrokes',
      'G→C in half notes ×16 — fretting hand arrives early, strum stays lazy',
      'Four-bar groove using only G and C'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645',
      'ch-c'
    ],
    masteryCheck: 'Sixteen controlled G→C changes with clear downbeats.',
  },
  33: {

    title: 'C–D Doorway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean C on beat 1',
      'Land clean D on beat 1',
      'Keep right hand pulsing through the switch'
    ],
    theoryBite: 'C to D teaches top-string accuracy and intentional muting of lows. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Freeze C shape and strum eight even downstrokes',
      'C→D in half notes ×16 — watch the fretting fingers, not the pick',
      'Four-bar groove using only C and D'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled C→D changes with clear downbeats.',
  },
  34: {

    title: 'D–Em Story — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean D on beat 1',
      'Land clean Em on beat 1',
      'Keep right hand pulsing through the switch'
    ],
    theoryBite: 'Major to relative-side minor motion — pop ballad fuel. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Freeze D shape and strum eight even downstrokes',
      'D→Em in half notes ×16 until the switch is boringly reliable',
      'Four-bar groove using only D and Em'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled D→Em changes with clear downbeats.',
  },
  35: {

    title: 'Em–Am Kin — Change Lab',
    durationMin: 35,
    goals: [
      'Land clean Em on beat 1',
      'Land clean Am on beat 1',
      'Keep right hand pulsing through the switch'
    ],
    theoryBite: 'Two-finger family; great for minor mood without new pain. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Freeze Em shape and strum eight even downstrokes',
      'Em→Am in half notes ×16 — keep the shared fingers planted when you can',
      'Four-bar groove using only Em and Am'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled Em→Am changes with clear downbeats.',
  },
  36: {

    title: 'Am–E Drama — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean Am on beat 1',
      'Land clean E on beat 1',
      'Keep right hand pulsing through the switch'
    ],
    theoryBite: 'Classic tension pair in Am songs and Andalusian cousins. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Freeze Am shape and strum eight even downstrokes',
      'Am→E in half notes ×16 — plant the E shape before you strike',
      'Four-bar groove using only Am and E'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled Am→E changes with clear downbeats.',
  },
  37: {

    title: 'E–A Rock Gate — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean E on beat 1',
      'Land clean A on beat 1',
      'Keep right hand pulsing through the switch'
    ],
    theoryBite: 'Open-position rock/blues pillars on the circle of fourths. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Freeze E shape and strum eight even downstrokes',
      'E→A in half notes ×16 — big shapes, small motion',
      'Four-bar groove using only E and A'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled E→A changes with clear downbeats.',
  },
  38: {

    title: 'A–D Bright Lift — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean A on beat 1',
      'Land clean D on beat 1',
      'Keep right hand pulsing through the switch'
    ],
    theoryBite: 'I–IV color in A; keep D on four strings only. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Freeze A shape and strum eight even downstrokes',
      'A→D in half notes ×16 — do not lift the whole hand if one finger can pivot',
      'Four-bar groove using only A and D'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled A→D changes with clear downbeats.',
  },
  39: {

    title: 'G–Em Soften — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean G on beat 1',
      'Land clean Em on beat 1',
      'Keep right hand pulsing through the switch'
    ],
    theoryBite: 'I–vi motion — instant emotional turn without new shapes. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Freeze G shape and strum eight even downstrokes',
      'G→Em in half notes ×16 — pinky/index story, no panic lift',
      'Four-bar groove using only G and Em'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled G→Em changes with clear downbeats.',
  },
  40: {

    title: 'C–Am Relative — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean C on beat 1',
      'Land clean Am on beat 1',
      'Keep right hand pulsing through the switch'
    ],
    theoryBite: 'Relative major/minor toggle trains ears and fingers together. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Freeze C shape and strum eight even downstrokes',
      'C→Am in half notes ×16 — two fingers stay, one moves',
      'Four-bar groove using only C and Am'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled C→Am changes with clear downbeats.',
  },
  41: {

    title: 'G–D Anthem — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean G on beat 1',
      'Land clean D on beat 1',
      'Keep right hand pulsing through the switch'
    ],
    theoryBite: 'I–V without IV; huge for two-chord songs and drones. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Freeze G shape and strum eight even downstrokes',
      'G→D in half notes ×16 until you can chat through the change',
      'Four-bar groove using only G and D'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Sixteen controlled G→D changes with clear downbeats.',
  },
  42: {

    title: 'F Maj7 Gateway — Barre Without Tears',
    durationMin: 35,
    goals: [
      'Play Fmaj7 (easy) as musical F color',
      'Try mini barre only if pain-free',
      'Use Fmaj7 inside C–Am–Fmaj7–G'
    ],
    theoryBite: 'Fmaj7 gives ‘F function’ with less compression than full barre — successive approximation in action.',
    drills: [
      'String-audit Fmaj7 until every note rings clearly',
      'C–Fmaj7 slow changes — hear the maj7 color land before you leave',
      'Pop loop C–Am–Fmaj7–G at ballad tempo, four bars each chord first'
    ],
    libraryIds: [
      'ch-am'
    ],
    masteryCheck: 'Play one clean C–Am–Fmaj7–G chorus at practice tempo.',
  },
  43: {

    title: 'Full F Attempt — Strength + Mercy',
    durationMin: 30,
    goals: [
      'Roll barre finger lightly for even pressure',
      'Prioritize high E and B clarity first',
      'Cap sessions before joint pain'
    ],
    theoryBite: 'Barre strength is tissue adaptation over weeks. Clarity on two strings beats six muffled strings.',
    drills: [
      'Barre chirps 1 minute — light pressure, release before the hand burns',
      'Hold F for four strums, rest, repeat — shake out if it burns',
      'Swap in Fmaj7 when the full F form collapses — still counts'
    ],
    libraryIds: [
      'pr-12bar'
    ],
    masteryCheck: 'Produce four consecutive F strums where melody strings speak.',
  },
  44: {

    title: 'B Minor Barre — Am Shape Moved',
    durationMin: 30,
    goals: [
      'See Bm as Am shape at fret 2',
      'Barre fret 2 with calm wrist',
      'Bm–G–D–A modern loop'
    ],
    theoryBite: 'Movable minor shapes unlock the neck. Bm is the classic first barre minor after F struggles.',
    drills: [
      'Air-shape Am then slide idea to fret 2',
      'Bm string audit low to high — fix the first dead string before moving on',
      'Bm–G–D–A half-time groove until the barre stops choking the low strings'
    ],
    libraryIds: [
      'ch-am'
    ],
    masteryCheck: 'Play Bm clear enough for a two-bar loop into G.',
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
      'Chord-tone ending on every phrase'
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
    theoryBite: 'The 50s/pop progression is ear candy and change training in one. F may be Fmaj7.',
    drills: [
      'Chord order chant while fretting',
      'Loop the drill at 72 BPM with a metronome click',
      'Melody doodle on the G string only for one minute — stay calm'
    ],
    libraryIds: [
      'pr-6251'
    ],
    masteryCheck: 'Play two full C–Am–F–G choruses without stopping.',
  },
  47: {

    title: '12-Bar Blues Form — Count the Story',
    durationMin: 30,
    goals: [
      'Memorize 12-bar map in A',
      'Play A7 D7 E7 on the form',
      'Say bar numbers as you play once'
    ],
    theoryBite: 'Form memory is musicianship. 12-bar blues is a reusable story: home, away, home, turnaround.',
    drills: [
      'Air-count 12 bars of form before you touch strings',
      'One chorus chords only — no fills, just even time and clear shapes',
      'Turnaround spotlight last 4 bars'
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
    theoryBite: 'Am–G–F–E is a centuries-old descent. The E major chord is the spicy door home to Am.',
    drills: [
      'Hold two bars on each chord before changing',
      'Emphasize the bass note on beat 1, then lighter strums after',
      'Build soft to strong into the E chord arrival'
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
    theoryBite: 'Ii–V–I is the backbone of countless standards. Small vocabulary, huge repertoire unlock.',
    drills: [
      'Dm–G7–C at ballad tempo — let G7 pull toward C',
      'Loop Am–Dm–G7–C four times with steady time',
      'Light swing optional — if it rushes, go straight eighths instead'
    ],
    libraryIds: [
      'ch-am',
      'pr-1645'
    ],
    masteryCheck: 'Play four clean ii–V–I cadences in C.',
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
      'G with low B emphasis if fretted',
      'C with low E drone experiments carefully',
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
      'Worst-string isolation 3 minutes',
      'Progression with audit every 4 bars'
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
    theoryBite: 'Space defines reggae guitar. Hitting less is the skill — upstrokes and mutes do the dance.',
    drills: [
      'Muted & chops 1 minute — left hand mutes, right hand stays in time',
      'Loop C–G skank rhythm for 8 bars with muted chucks',
      'Foot still on quarters while hands play offs'
    ],
    libraryIds: [
      'pr-12bar'
    ],
    masteryCheck: 'Play 8 bars of upbeat chops with quiet downbeats.',
  },
  54: {

    title: 'Fingerpicking Pattern — p-i-m-a Seed in C',
    durationMin: 30,
    goals: [
      'Thumb on C bass (A string)',
      'I-m-a on G B E strings',
      'Pattern steady before chord changes'
    ],
    theoryBite: 'Classical/folk pattern pima builds right-hand automation so left hand can think about songs.',
    drills: [
      'Pima arpeggio on open strings for one minute',
      'Play p-i-m-a arpeggios on the open C shape slowly',
      'C to G change with pattern continuing'
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
    theoryBite: 'Capos let beginners play in many keys with open shapes — practical musicianship over theory pride.',
    drills: [
      'G–C–D open, then with capo 2 if available',
      'Sing a higher comfortable note and find it slowly on the neck',
      'Write which fret felt good for your voice'
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
    theoryBite: 'Chord-melody starts as ‘pad + top note.’ Smallest version still sounds arranged.',
    drills: [
      'Try C with high E open, fret 1, and fret 3 — pick the clearest',
      'Resolve top notes to E (chord tone)',
      'Improvise a 4-bar pad melody over the vamp'
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
    theoryBite: 'Interleaving styles builds flexible hands. Same week, multiple grooves — research-backed retention.',
    drills: [
      'Play one full blues chorus with the form locked',
      'Play the pop chorus figure twice with clear accents',
      '30s rest between; no mash until both stable'
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
    theoryBite: 'Deliberate practice targets the bottleneck. Restarting from the intro wastes the reps that matter.',
    drills: [
      'Identify your stickiest two chords and loop only that change',
      'Isolate the sticky bar for two focused minutes',
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
      'Play the verse boom-chuck pattern for 8 bars',
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
      'Keep the strum arm steady through every rung',
    ],
    theoryBite: 'Speed is a side effect of clean reps. Half notes teach your hand the shape; quarters prove it stuck.',
    drills: [
      'DM→D in half notes for 2 minutes',
      'Quarters only when 9 of 10 changes ring clean',
      'If dead notes return, drop back a rung',
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
      'Tap your foot on 1 and 3 while you strum',
    ],
    theoryBite: 'The right hand is the engine. If it locks, the left hand can relax into the same pulse.',
    drills: [
      'Mute all strings, strum quarters for 30 seconds',
      'Add eighth-note strums, still muted',
      'Fret Em once the groove feels automatic',
      'Take your hand off the strings and keep the rhythm going in your head',
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
      'Name the feeling that tipped you off',
    ],
    theoryBite: 'Ear training is prediction. When you guess right, your ear just wrote the harmony down.',
    drills: [
      'Play a two-chord loop and guess the second one',
      'Close your eyes for the second pass',
      'Say the chord name out loud before you hear it',
      'Check yourself — were you close, right, or lost?',
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
      'Practice with softer hands than feels natural',
    ],
    theoryBite: 'Pressure is habit, not requirement. The note only needs the string to touch the fret.',
    drills: [
      'Fret a D chord, squeeze, then relax until it almost buzzes',
      'Play 10 seconds at 8/10 pressure, then 10 at 5/10',
      'Check your thumb — it shouldn\'t be white-knuckled',
      'Strum and watch for dead notes from over-gripping',
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
      'Keep the melody singable above the chords',
    ],
    theoryBite: 'Melody chooses the chords, not the other way around. Fit harmony underneath what you hum.',
    drills: [
      'Hum the melody once and find its resting note',
      'Try Em under the first phrase, A under the second',
      'Switch chords only at phrase boundaries',
      'Sing while you play the two-chord version',
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
      'Record a take you\'d keep',
    ],
    theoryBite: 'A checkpoint isn\'t a test; it\'s a photograph. You\'re comparing yourself to last week, not to anyone else.',
    drills: [
      'Am–F loop, two beats per chord, 60 seconds',
      'Change with the smallest movement possible',
      'Play the loop four times through',
      'Record one take and listen once',
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
      'Keep the strum steady while the color changes',
    ],
    theoryBite: 'A sus chord holds its root and fifth but floats the third — lift a finger and the song leans forward.',
    drills: [
      'Hold E, lift the first finger on & of 4',
      'Return to E on beat 1 of the next bar',
      'Four bars steady, then try it on Bm',
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
      'Two clean quarter-note changes per bar',
    ],
    theoryBite: 'C7 tucks the third finger in close. Lift everything together — the shape arrives as a block.',
    drills: [
      'A→C7 in half notes for 2 minutes',
      'Same change in quarters at 60 BPM',
      'Watch the third finger land flat, not reaching',
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
      'Keep the mute pattern identical while the left hand changes',
    ],
    theoryBite: 'A groove lives in the right hand. Change chords underneath and the pattern can stay exactly the same.',
    drills: [
      'Muted G7 rhythm, quarters then eighths',
      'Switch to C7 mid-pattern, same right hand',
      'Alternate G7 and C7 every two bars, muted',
      'Let the chords ring only on beat 1, mute the rest',
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
      'Let your hand reach for the guess before you play it',
    ],
    theoryBite: 'Three-chord songs usually follow the same map. Your ear learns the exits before your brain does.',
    drills: [
      'Bm to D7 loop, guess the second chord',
      'Add a third chord and guess the full path',
      'Listen with your eyes shut, hands off the strings',
      'Air-guitar the guess, then check',
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
      'Keep the music flowing while hands soften',
    ],
    theoryBite: 'Tension migrates: hand, shoulder, jaw, breath. Softening any of them helps all of them.',
    drills: [
      'Play A7 while checking your jaw and shoulders',
      'Exhale on beat 1 for 8 bars so the downbeat stays soft and steady',
      'Shake out your fretting hand, then play the same line',
      'Compare the sound before and after releasing',
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
      'Keep the arrangement simple enough to sing over',
    ],
    theoryBite: 'Seventh chords want to resolve. Placing them at phrase ends gives the melody a push home.',
    drills: [
      'Find the melody\'s last note and put G7 before it',
      'Swap in E7 for color on a repeat',
      'Play the whole tune with just two chords per phrase',
      'Record it and listen for the pull of the sevenths',
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
      'Leave with a recorded before/after',
    ],
    theoryBite: 'One sticky change fixed is a full week\'s win. Slow it, loop it, then put it back in the song.',
    drills: [
      'D7–Dm loop, slow and even — hear the color flip each bar',
      'Isolate the hardest change and loop it 20 times',
      'Play the full progression at 60 BPM',
      'Record before and after to hear the jump',
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
      'Do it inside a steady four-bar loop',
    ],
    theoryBite: 'A7\'s sus hangs the third out of reach — when it lands back on beat 1, that pull is the whole trick.',
    drills: [
      'A7 shape, lift the third finger on & of 4',
      'Land the full A7 on beat 1 after the setup — no late fingers',
      'Loop four bars; keep the strum arm moving',
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
      'Two steady changes per bar at 60 BPM',
    ],
    theoryBite: 'E7 and G share the same low root — anchor that finger and the whole change gets shorter.',
    drills: [
      'E7→G in half notes for 2 minutes',
      'Quarters at 60 BPM, thumb behind the neck',
      'Anchor the low E root, pivot the rest',
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
      'Keep the pocket when the fretting gets harder',
    ],
    theoryBite: 'Once a groove is in your body, the notes are decoration. The pocket is the song.',
    drills: [
      'Dm groove, downstrokes only, 30 seconds',
      'Down-up eighths with the same chord',
      'Two-bar pattern: groove, then let it ring',
      'Play it three times through without losing the pulse',
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
      'Reframe scales as melody menus',
      'Play box 1 with rests on purpose',
      'Resolve phrases to the root'
    ],
    theoryBite: 'Scales aren\'t homework — they\'re GPS for riffs. Space and target notes turn boxes into actual music.',
    drills: [
      'A minor pent up/down with a rest every 4 notes',
      'End every phrase on A — hold it long enough to mean it',
      'One-minute 3-note story — space between notes counts as music'
    ],
    libraryIds: [
      'rf-palm-mute-chug-study'
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
    theoryBite: 'Evenness > speed. Recording yourself exposes hidden accents that fight the groove.',
    drills: [
      'Box shape with the metronome — one position, no racing the click',
      'Accent only beat 1 roots; ghost everything else for one minute',
      'Quiet the notes that pop too hard'
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
    theoryBite: 'Sequences teach your hands common melodic ‘rhythms of pitch’ used in real solos.',
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
    theoryBite: 'Blues scale = minor pent + b5. The spice note wants to resolve — tension and release in one finger.',
    drills: [
      'Spot every b5 location in the box before playing',
      'Lick: chord tone → b5 → chord tone',
      'Solo 1 minute max 20% blue notes'
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
    theoryBite: 'Relative major/minor pentatonics share notes; the home note decides the story.',
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
    theoryBite: 'Pros connect positions. Hinge notes and slides beat teleporting up the neck.',
    drills: [
      'Find hinge note between positions',
      'Ascending journey 2 octaves if possible',
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
    theoryBite: 'Chord tones are gravity. Scale filler notes decorate; chord tones tell harmony where you\'re.',
    drills: [
      'Pulse roots only on beats 1 and 3 for 8 bars',
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
    theoryBite: 'Major scale degrees explain why melodies feel finished (1,3,5) or yearn (2,4,6,7).',
    drills: [
      'Play one octave of the scale slowly with even fingers',
      'Say scale degrees on the way up — stop if the names fall behind the hands',
      'Melody doodle using only 1 2 3 5'
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
    theoryBite: 'Natural minor adds degrees pentatonics omit — more pathos, more stepwise melody options.',
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
    theoryBite: 'Dorian = natural minor with raised 6. Funk, Santana, modal jams — hopeful minor.',
    drills: [
      'Find the raised 6 relative to Dm and mark it with a finger tap',
      'Side-by-side natural vs dorian lick',
      'Static Dm groove improv 1 minute'
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
      'Play G mixolydian (major + b7)',
      'Resolve to G7 chord color',
      'Rock jam vibe over G–F idea'
    ],
    theoryBite: 'Mixolydian is the jam-band/rock dominant map — major happiness with bluesy b7.',
    drills: [
      'Play G Mixolydian one octave ascending and down',
      'Target the flat-7 resolving into the root on purpose',
      'Two-chord vamp G to F if comfortable'
    ],
    libraryIds: [
      'sc-mixo',
      'rf-open-am'
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
    theoryBite: 'Phrygian’s b2 is cinematic/Spanish. A little goes far — tension wants resolution.',
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

    title: 'Lydian Dream — Raised',
    durationMin: 30,
    goals: [
      'Find #4 in a major context',
      'Hold the dreamy dissonance briefly',
      'Resolve to 3 or 5'
    ],
    theoryBite: 'Lydian’s raised 4 floats above major — filmic, floating, not ‘wrong’ if resolved with taste.',
    drills: [
      'C or F lydian fragment — hear the #4, then resolve so it feels like home',
      'Hold a long tone on the raised 4 and resolve down',
      'Resolve the line downward into a chord tone'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study'
    ],
    masteryCheck: 'Show one lydian color tone and a satisfying resolution.',
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
    theoryBite: 'The pro sound over changes is targeting, not denser scales. Hit the new chord’s third/root.',
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
    theoryBite: 'Intervals create melody contour. Stepwise is speech; leaps are exclamation points.',
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
    theoryBite: 'Harmonic minor’s raised 7 creates a strong leading tone — drama engine for minor keys.',
    drills: [
      'Build a short fragment around the leading tone, then resolve',
      'Resolve the line to A and hold a clean long tone',
      'One exotic phrase max per 4 bars'
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
    theoryBite: 'Caged positions teach the neck as neighborhoods. Constraints breed creativity.',
    drills: [
      'Map root locations for the CAGED form in use',
      'Riff only inside the cage for two minutes — no runaway frets',
      'Optional: shift cage up 2 frets and repeat idea'
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
    theoryBite: 'Limitation is a creativity tool used by great teachers. Rhythm and silence outrank note count.',
    drills: [
      'Choose three strong notes and improvise only with them',
      'Groove the pattern for 8 bars without rushing',
      'Add bends/slides only on those pitches'
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
    theoryBite: 'A solo is a story arc. Capstone days prove you can shape time, not only run shapes.',
    drills: [
      'Sketch form on paper 1-2-3-4 sections',
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
      'Leave space so it sounds like music, not a drill',
    ],
    theoryBite: 'A scale is a menu, not a song. Checkpoints are where you cook with it — and the major scale is the kitchen.',
    drills: [
      'C major pentatonic, 8 bars, start and end on C',
      'Play only 3 notes per bar — rhythm does the work',
      'Rest on bars 4 and 8 on purpose — silence is a note choice',
      'Record it and listen for the landing',
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
      'Connect the roots with scale steps',
    ],
    theoryBite: 'The neck repeats itself in patterns. One root note lives in dozens of places.',
    drills: [
      'Find D on the A, D, and G strings',
      'Play each one on beat 1 of a four-count',
      'Connect two of them with scale steps',
      'Close your eyes and find them again',
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
      'Let the motif become your own',
    ],
    theoryBite: 'Imitation is how every player builds vocabulary. Copy it, then give it your fingerprint.',
    drills: [
      'Learn a 4-note library motif note-for-note',
      'Play the same idea with twice the rests — leave bigger holes',
      'Move the same phrase to a new string set without changing the rhythm',
      'End with your own rhythm version',
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
      'Keep quarters steady when eighths get hard',
    ],
    theoryBite: 'Subdivisions are where timing lives. Beat 1 keeps you close; eighths keep you honest.',
    drills: [
      'Scale up and down in quarters first',
      'Switch to eighths at the same tempo only if quarters were clean',
      'If you rush, drop back to quarters',
      'Record 20 seconds and check the eighths',
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
      'Name one feeling for each color',
    ],
    theoryBite: 'Modes are moods with rules. Comparing two back to back teaches faster than reading about them.',
    drills: [
      'Play a short phrase in the first mode',
      'Repeat it in the second mode, same notes',
      'Name each mood out loud before you play the matching phrase',
      'Decide which fits the vamp better',
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
      'Leave with a riff you can repeat',
    ],
    theoryBite: 'Riffs are frozen luck. Capture the accidental cool bar, give it a clear start and end, and you own a lick instead of a blur.',
    drills: [
      'Improvise over the vamp for 1 minute',
      'Circle the one bar that felt like something',
      'Repeat the motif 8 times exactly — only the dynamics may change',
      'Add a tiny variation on the repeat',
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
      'Use passing tones only between strong notes',
    ],
    theoryBite: 'Long notes must agree with the chord; passing notes may color. That one rule is most of applied theory.',
    drills: [
      'Loop the E phrygian vamp, hold the root E',
      'Try b2 (F) as a long tone, feel the pull',
      'Then land the b7 (D), then resolve to E like a sentence ending',
      'Solo with long tones on chord tones only',
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
      'Still land the phrase on the root',
    ],
    theoryBite: 'Chromatic notes are seasoning — a half-step neighbor that slides the ear to the real note.',
    drills: [
      'Add one chromatic neighbor before the root',
      'Same 8-bar story, two approach notes max',
      'Keep them on weak beats at first',
      'Land the final phrase squarely on the root',
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
      'Keep a metronome clicking through the hunt',
    ],
    theoryBite: 'Roots are landmarks. If you know where they are, every scale and chord has a home base.',
    drills: [
      'Find C on the low E and the high E strings',
      'Play both C\'s on beat 1, in time',
      'Walk from low C to high C using scale steps',
      'Do the same pass again with eyes closed — trust the frets',
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
      'Make the new ending resolve',
    ],
    theoryBite: 'A motif is a question. Changing the ending changes the answer while keeping the conversation.',
    drills: [
      'Play the motif twice with the original ending',
      'Replace the last note with a new one',
      'Make the new ending land on the root',
      'Trade old ending / new ending every other bar',
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
      'Find where you tend to rush',
    ],
    theoryBite: 'Eighths are a train track. Adding scale notes does not change the rails — the click still owns the grid under every finger.',
    drills: [
      'Scale eighths with one chromatic passing note',
      'Mark where you rushed — that\'s the fix spot',
      'Loop that spot slowly five times',
      'Run the full octave again — even fingers, no rush at the top',
    ],
    libraryIds: [
      'rf-blues-sh'
    ],
    masteryCheck: 'Scale eighths with a passing tone, even and un-rushed, 20 seconds.',
  },
  107: {

    title: 'Mode Mood Board — A/B Day (2)',
    durationMin: 30,
    goals: [
      'Find both modes\' roots in the same position',
      'Switch modes mid-loop without stopping',
      'Hear the switch land on the root',
    ],
    theoryBite: 'Changing mode mid-loop is like changing the light in a room — same furniture, new mood.',
    drills: [
      'Map both mode shapes in one position',
      'Loop the vamp, switch after 4 bars',
      'Make the switch on the root note',
      'Keep the metronome through the change',
    ],
    libraryIds: [
      'rf-caged-c'
    ],
    masteryCheck: 'Switch modes mid-loop on the root without losing the pulse.',
  },
  108: {

    title: 'Scale → Riff Extraction (2)',
    durationMin: 30,
    goals: [
      'Extract a riff and give it an ending',
      'Make the riff loop-able back to the start',
      'Play it twice through without losing the fire',
    ],
    theoryBite: 'A riff without an ending is a loop; a riff with an ending is a statement. Practice the last note like it matters.',
    drills: [
      'Loop your existing riff four times before you change a note',
      'Add a one-note ending that leads back in',
      'Play it as: riff, riff, riff, ending',
      'Record the full cycle twice; keep the take with steadier time',
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
      'Resolve every phrase on a chord tone',
    ],
    theoryBite: 'Funk lives in the short notes between strong ones. Chord tones anchor, chromatics decorate.',
    drills: [
      'Loop the funk vamp, play the root on beat 1 only',
      'Add a chromatic approach note before the root',
      'Play a 3-note chord-tone arpeggio over each chord',
      'Solo 8 bars: long tones on beats 1 and 3',
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
      'Resolve to the new root with intention',
    ],
    theoryBite: 'Same shapes, different mood. Minor pentatonic turns the same journey into a different weather.',
    drills: [
      'A minor pentatonic box for 8 bars — simple, in time, breathing',
      'Start and end on A this time so the ear hears home base',
      'Use the flat 3rd as a color on bar 6',
      'Compare with last week\'s major story',
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
      'Tune your ear to the ringing overtones',
    ],
    theoryBite: 'Harmonics are pure pitch beacons. They tell you exactly where a note lives without fretting.',
    drills: [
      'Find the 12th-fret harmonic on each string',
      'Fret the same note and compare the pitch',
      'Use the harmonic to find E on multiple strings',
      'End by playing the root with a harmonic ring',
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
      'Make the rhythm swing without rushing',
    ],
    theoryBite: 'Rhythm is the fastest way to make an old idea sound new. Same notes, new heartbeat.',
    drills: [
      'Take your owned motif, play it as straight eighths',
      'Then dotted rhythm, then with a rest in the middle',
      'Keep the metronome steady through all three',
      'Pick your favorite rhythm and repeat it',
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
      'End exactly on the top note with the click',
    ],
    theoryBite: 'Two octaves doubles the distance but not the tempo. The click stays the same — you just travel further.',
    drills: [
      'Two-octave scale in quarters, hands warm',
      'Eighths, focusing on the shift note',
      'Land the top note exactly on a click — freeze if you miss',
      'Descend the scale without dragging behind the click',
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
      'Use the modes over a new chord color',
      'Mix both colors in one phrase',
      'Make the mix sound intentional',
    ],
    theoryBite: 'Once you can A/B modes, you can paint with both. The mix is where your voice shows up.',
    drills: [
      'Loop a short mixolydian vamp and sit in it for a minute',
      'Start the phrase in mode A, resolve in mode B',
      'Use mode B only on the last two bars',
      'Record and hear which mix you liked',
    ],
    libraryIds: [
      'sc-mixo',
      'rf-open-g-roll-study'
    ],
    masteryCheck: 'A single phrase that starts in one mode and resolves in another, deliberately.',
  },
  115: {

    title: 'Scale → Riff Extraction (3)',
    durationMin: 30,
    goals: [
      'Use a bass-walk feel inside the riff',
      'Let the low notes carry the motion',
      'Keep the riff simple enough to groove',
    ],
    theoryBite: 'Bass motion under a riff makes it move without adding notes on top. One walking note between repeats can feel like a whole arrangement.',
    drills: [
      'Take your riff and play only its bass notes',
      'Add a stepwise walk between them',
      'Re-attach your riff on top of the vamp — same tempo',
      'Loop it with the walk every 4 bars',
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
      'End phrases on the root or fifth',
    ],
    theoryBite: 'Riffs and long tones are partners. The chug holds time; your notes tell the story over it.',
    drills: [
      'Chug the riff loop, hold the root across 4 beats',
      'Then hold the fifth, feel it lift',
      'Alternate root and fifth every phrase',
      'Write one 4-bar phrase with two long tones',
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
      'End exactly on the root of the loop',
    ],
    theoryBite: 'Position shifts are just walking to a new room. The melody should feel continuous, not relocated.',
    drills: [
      'Play the story in box 1, then repeat in box 2',
      'Shift during a rest so the move is clean',
      'Land both boxes on the same root',
      'Record and check the shift didn\'t stop the flow',
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
      'Make root-finding part of playing, not a stop',
    ],
    theoryBite: 'The fastest solos are just root-to-root flights. Know the landmarks and you\'re never lost.',
    drills: [
      'Call out the root\'s string/fret before you play it',
      'Find G on five strings in 30 seconds',
      'Play a phrase that lands on G from three directions',
      'Time yourself on the checkpoint and try to beat last week kindly',
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
      'End the phrase with a clear answer',
    ],
    theoryBite: 'Motifs grow by being stretched and squeezed. Space is part of the sentence.',
    drills: [
      'Play the motif twice as fast over two bars',
      'Then stretch the same idea across four bars with more air',
      'Call (motif), rest a bar, answer with a variation',
      'Finish with the answer on the root',
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
      'Land the story on the root',
    ],
    theoryBite: 'A capstone isn\'t a quiz — it\'s a song you invented. 16 bars, one box, a beginning and an end.',
    drills: [
      'Map the Em pentatonic box at fret 12',
      'Play a 4-bar phrase: start low, breathe',
      'Repeat it with a different rhythm',
      'String it into 16 bars, end on E',
    ],
    libraryIds: [
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'A 16-bar pentatonic story with space, a peak, and a root landing.',
  },
  121: {

    title: 'Rhythm Phase Open — Pocket Is the Skill',
    durationMin: 30,
    goals: [
      'Lock your foot to steady quarter notes',
      'Turn muted strums into a drum kit that never rushes',
      'Feel the groove before adding any fretting',
    ],
    theoryBite: 'Rhythm is the phase where the whole band agrees. Pocket beats speed, every single time.',
    drills: [
      'Tap quarters with your foot, no guitar, 30 seconds',
      'Muted strums: down on 1 and 3, up on 2 and 4',
      'Keep the pulse while counting \'1 & 2 & 3 & 4 &\' aloud',
      'Then strum a G chord with the same motion',
    ],
    libraryIds: [
      'pr-12bar',
      'rf-spanish-e-phrygian-study'
    ],
    masteryCheck: '30 seconds of muted groove where a listener could tap along without trying.',
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
      'Muted performance of the chart at 75 BPM',
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
      'Foot quarters + voice 1-trip-let for 45 seconds',
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
      'Apply hits to a 12-bar blues skeleton',
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
      'Change chords only after a full sung breath',
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
      'Normal changes on beat 1 for 8 bars',
      'Same progression with each change on the & of 4',
      'Alternate pushed and square phrases every 4 bars',
      'Mute check: foot never moves with the push'
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
      'Swap layers: foot in 3, hand in 2',
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

    title: 'Texture Arrangement Lab — 32-Bar Map',
    durationMin: 30,
    goals: [
      'Map a 32-bar texture plan on paper',
      'Change right-hand density without changing tempo',
      'Treat arrangement as a practice skill',
    ],
    theoryBite: 'Arrangement is deciding when to play less. Sparse sections make the full sections hit harder.',
    drills: [
      'Draw 32 bars: mark sparse / mid / full sections',
      'Play the sparse section with two downstrokes a bar',
      'Play the full section with driving eighths',
      'Run the whole map without stopping',
    ],
    libraryIds: [
      'pr-6251',
      'rf-c-bass-walk-study'
    ],
    masteryCheck: 'A 32-bar texture map you can play end to end with clear density changes.',
  },
  135: {

    title: 'Click Trust — Play Behind/On/Ahead',
    durationMin: 30,
    goals: [
      'Play on top of, with, and slightly behind the click',
      'Hear the click as a collaborator, not an enemy',
      'Return to center after exploring the edges',
    ],
    theoryBite: 'The click is a lane you can drift in. On time is the center; behind feels relaxed, ahead feels urgent.',
    drills: [
      'Chug quarters, play exactly on the click, 8 bars',
      'Lean slightly behind the click for 8 bars',
      'Push slightly ahead of the beat for 8 bars, then sit back in',
      'Return to dead-center and feel the difference',
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
      'Use dynamics as storytelling',
    ],
    theoryBite: 'Dynamics are a wave, not a switch. Ramp volume slowly so listeners ride it with you.',
    drills: [
      'Strum one chord, quiet to loud over 4 bars',
      'Shape loud to quiet over the next 4 bars on purpose',
      'Repeat with eighths, keep the tempo locked',
      'Mark the loudest bar on your chart',
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
      'Return to 4/4 cleanly',
    ],
    theoryBite: 'Odd meters are just 4/4 with a secret. 5/4 = one bar of 3 plus one bar of 2, counted as one loop.',
    drills: [
      'Count 1-2-3, 1-2 out loud for 30 seconds',
      'Tap all 5 beats with your foot before you add the guitar',
      'Strum a 5-beat groove: down on every beat',
      'Switch back to 4/4 and feel how square it is',
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
      'Leave space for an imaginary vocal',
    ],
    theoryBite: 'Comping is rhythm first, chords second. A pattern you can repeat is a gift to whoever sings over it.',
    drills: [
      'Design a 2-bar pattern on paper: mark down/up strokes and rests',
      'Mute-play it 8 times at a steady tempo without rushing the changes',
      'Add the chords underneath, keeping the pattern identical',
      'Sing a nonsense line over it and keep the pattern rock-steady',
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
      'Let it feel like a train, not a scramble',
    ],
    theoryBite: 'Bass, chord, bass, chord. The thumb and the strum hand do different jobs — that split is the skill.',
    drills: [
      'Bass on open D/G strings beats 1 & 3, 60 seconds',
      'Add light muted chucks on 2 and 4 once the kick pulse is solid',
      'G-C-D boom-chuck at walking tempo',
      'Remove chucks 4 bars, bring them back',
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
      'Use palm mute as a texture, not a crutch',
    ],
    theoryBite: 'Rock lives in the even eighth. Two hands work as one engine: down-up, down-up, forever.',
    drills: [
      'Muted eighth strums, down-up, 30 seconds',
      'Add a power chord, keep the same right hand',
      'Palm-mute the first half of each bar',
      'Open up the second half for contrast',
    ],
    libraryIds: [
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
      'Name one keep and one fix afterward',
    ],
    theoryBite: 'Checkpoints combine what you\'ve built. One take that shows groove, a subdivision, and a dynamic choice is the week\'s proof.',
    drills: [
      'Play a 16-bar take with steady pocket',
      'Add one subdivision skill (eighths or swing)',
      'Add one dynamic choice (swell or drop)',
      'Listen back and name a keep and a fix',
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
      'Return to center for the chorus',
    ],
    theoryBite: 'Behind the beat is a color, not a mistake. The trick is coming back to center at the right moment.',
    drills: [
      'Eighth chugs, sit just behind the click, 8 bars',
      'Come back to dead-center for 4 bars',
      'Alternate behind / center every phrase',
      'Keep your foot tapping the whole time',
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
      'Let the chorus land with full energy',
    ],
    theoryBite: 'A verse that grows quietly makes the chorus feel twice as big. Save something for the top.',
    drills: [
      'Verse groove, start at 50% volume for the first 2 bars',
      'Gain about 10% volume every 2 bars, watching your strum size',
      'Peak at the chorus entrance, then hold the energy steady',
      'Pull back to 60% for the second verse, keep the tempo locked',
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
      'Keep the other beats soft',
    ],
    theoryBite: 'The accent is what makes odd meter feel intentional, not mistaken. Accent where the groove leans.',
    drills: [
      '5-beat loop, all beats even, count 1-2-3-4-5 out loud',
      'Add an accent on the \'and\' of beat 3, keep the rest soft',
      'Play 8 full cycles with the accent landing every single time',
      'Try the same accent on beat 5 instead, feel how the groove shifts',
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
      'Let the pattern breathe without changing shape',
    ],
    theoryBite: 'Boom and chick are two voices. The low thumb is the bassist; the scratch is the drummer.',
    drills: [
      'Thumb the root on beat 1, mute-scratch beats 2-4',
      'Add a high chord scratch on beat 2 only',
      'Pattern: thump, scratch, rest, scratch',
      'Play 8 bars, same shape, no drift',
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
      'Add a country fill without breaking the pocket',
    ],
    theoryBite: 'Boom-chuck is a vehicle. The bass follows the root, the chuck stays fixed, and the fill is a detour that returns.',
    drills: [
      'Boom-chuck G-C-D-G, 4 bars each, bass on 1 and 3',
      'Move the bass to each new root on beat 1 of the change',
      'Add a one-beat fill on the last bar of the loop, then land',
      'Loop it 4 times clean with the foot tapping the whole way',
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
      'Add a pickup note into the next riff',
    ],
    theoryBite: 'The down-up never stops in rock. Chords change under it; the engine just keeps turning.',
    drills: [
      'Eighths on one power chord for 4 bars, engine steady',
      'Switch chords on beat 1, keep the down-up engine running',
      'Add a 1-beat pickup note into the next chord change',
      'Loop the two-chord riff 8 times without the engine dropping',
    ],
    libraryIds: [
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
      'Record twice and keep the better one',
    ],
    theoryBite: 'A checkpoint is a performance, not a quiz. Two takes, keep the musical one.',
    drills: [
      'Warm up 2 minutes with the week\'s groove, hands loose',
      'Take one: 16 bars with the new skill included, no stopping',
      'Take two: same 16 bars, but push the feel a little more',
      'Keep the better take and write down one thing that made it work',
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
      'Release back to center after the push',
    ],
    theoryBite: 'Ahead of the beat reads as excitement. Use it for climbs and builds, then spend the energy.',
    drills: [
      'Chug eighths slightly ahead for 8 bars',
      'Peak the phrase with an accent at the top',
      'Drop back to center for the resolution',
      'Feel how the push changes the energy',
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
      'Land the final 4 bars strong',
    ],
    theoryBite: 'Texture is volume of motion, not volume of sound. A quiet busy section can still push the song forward.',
    drills: [
      'Bars 1-8: keep it sparse, two chords per bar, light touch',
      'Bars 9-16: add eighth-note strums and start building',
      'Bars 17-24: full drive, biggest strums of the form',
      'Bars 25-32: pull back to sparse and land on the root',
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
      'Pick the feel that fits the song\'s story',
    ],
    theoryBite: 'Feel is how you bend time without breaking it. Straight, swung, and half-time all live in the same bar.',
    drills: [
      'Groove straight eighths for 8 bars',
      'Same groove, swung eighths, 8 bars',
      'Half-time feel: two strums per bar, big space',
      'Switch feels every 4 bars without changing tempo',
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
      'Accent the melody\'s pickups',
    ],
    theoryBite: 'A good comp is a road with lanes. When the melody moves, you move less — stay out of the singer\'s way and lock the pocket.',
    drills: [
      'Comp 2-bar pattern, hum the melody over it',
      'On busy melody bars, cut to downstrokes only',
      'On held notes, add a strum on beat 4',
      'Let the pattern change with the melody',
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
      'Let the pattern swing slightly without rushing',
    ],
    theoryBite: 'At tempo, boom-chuck becomes a dance. The faster you go, the more the split has to be automatic.',
    drills: [
      'Boom-chuck on G-C-D at 90 BPM for 4 bars, bass and chuck split clean',
      'Push to 100 BPM and keep the bass/chuck roles distinct',
      'Let the chucks swing a touch while the bass stays on time',
      'Come back to 90 BPM and feel how much control you gained',
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
      'Use the palm mute to make the chorus hit harder',
    ],
    theoryBite: 'Quiet verse + heavy chorus is rock\'s oldest trick. Save the palm mute for the loud part.',
    drills: [
      'Verse: light eighths, no palm mute, quiet and even',
      'Chorus: full palm-muted chugs, bigger and heavier',
      'Switch at the phrase boundary without rushing the change',
      'Run the whole verse-chorus form twice end to end',
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
      'Fix one timing spot after listening back',
    ],
    theoryBite: 'The metronome is the honest judge. One audible-click take tells you exactly where the time bends.',
    drills: [
      'Set the click to the week\'s tempo and count in',
      'Play 16 bars with the click in the room, foot locked',
      'Mark the spot where you pushed or dragged against it',
      'Replay that exact spot slowly and fix the timing',
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
      'Keep the tempo rock solid through all three',
    ],
    theoryBite: 'Placement is phrasing. Verses can sit back, choruses can lean in, and the click never changes.',
    drills: [
      '4 bars on, 4 bars behind, 4 bars ahead',
      'Repeat with a verse/chorus story in mind',
      'Change placement only at phrase boundaries',
      'Check the click is still dead center in your ear',
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
      'Keep the groove under the volume changes',
    ],
    theoryBite: 'A riff is more than notes — it\'s where you push and where you pull. Accents give it a spine.',
    drills: [
      'Play the riff at one flat volume, 4 bars',
      'Same riff, accent the peak note louder',
      'Then swell the whole riff over 4 bars',
      'Return to flat and hear the difference',
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
      'Resolve back to 4/4 on a downbeat',
    ],
    theoryBite: 'A repeated accent becomes a riff\'s identity. The odd meter stops being math and starts being a melody.',
    drills: [
      'Build a 2-bar 5/4 riff with the accent in bar 1',
      'Loop it until it sounds like a song intro',
      'Add a short 4/4 release section so the odd meter can breathe',
      'Move between them at a phrase boundary',
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
      'Leave the bass frequencies to the bassist',
    ],
    theoryBite: 'In a band, comp is a slot, not a solo. Play the rhythmic pocket and get out of the bass\'s way.',
    drills: [
      'Comp muted eighths with the backbeat',
      'Drop the low E string from the pattern',
      'Play only beats 2 and 4 for 8 bars',
      'Then the full pattern, locked to the drum feel',
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
      'Fill the space when the melody rests',
    ],
    theoryBite: 'Boom-chuck is the road; the melody is the car. When the car turns, the road can ease up.',
    drills: [
      'Boom-chuck under a simple melody on G-C-D, bass steady',
      'Cut to bass-only during the busiest melody bars',
      'Add a full chord on the melody rests for color',
      'Keep the foot steady the whole time, no rubber band',
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
      'Keep the drive steady through every change',
    ],
    theoryBite: 'The blues map is a train track. Eighths are the engine — they don\'t care which chord they\'re over.',
    drills: [
      'Chug eighths over the I chord for 4 bars, palm-muted',
      'IV chord for 2 bars, back to I for 2, engine never stops',
      'V chord, then the turnaround back into the top',
      'Loop the full 12 bars twice, marking each change',
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
      'Keep the tempo identical through the arc',
    ],
    theoryBite: 'A rhythm checkpoint with dynamics proves you own the whole skill, not just the notes.',
    drills: [
      '16 bars: soft start, build, peak, settle',
      'Include the week\'s pattern in the build',
      'Keep the click steady through the whole arc',
      'Listen back once and grade only the dynamic arc, not note spam',
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
      'Keep your foot the metronome',
    ],
    theoryBite: 'Grooves breathe when placement shifts with the section. Your foot is the only metronome you carry.',
    drills: [
      'Travis-style pattern, sit slightly behind on the verse',
      'Lean ahead of the click on the fill, then reset',
      'Return to dead-center timing for the chorus',
      'Tap your foot the whole time and never let it stop',
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
      'Keep the foot tapping through every change',
    ],
    theoryBite: 'You can map a song\'s form with nothing but volume. Loud is the chorus; soft is the story.',
    drills: [
      '16 bars: soft intro, build, loud peak, settle',
      'Play it with one chord the whole way',
      'Listen back and mark where the form shows',
      'Add the actual chords once the map works',
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
      'Keep the chord changes on the same beats each loop',
    ],
    theoryBite: 'Odd meters become body knowledge. Once your foot feels the 5, your hands can stop counting.',
    drills: [
      'Feel 5 with your foot, no counting aloud, 30s',
      'Comp one chord across the 5 beats',
      'Change chords on beat 1 of each cycle',
      'Two chords per cycle, same anchor beat',
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
      'Keep the singer anchored through every change',
    ],
    theoryBite: 'Variation is one changed element, not a new pattern. The singer needs the road to stay the road.',
    drills: [
      'Play your base comp pattern for 4 bars at a relaxed tempo',
      'Change only the ending strum on the last beat of bar 4',
      'Change only the bass note\'s octave, keep the rest identical',
      'Return to base and hear how the small variation landed',
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
      'Return to the pattern without losing the pocket',
    ],
    theoryBite: 'A walk-up is a bass line that leans toward the next chord. One or two steps is all country needs.',
    drills: [
      'Boom-chuck G to C, walking the bass G-A-B-C under it',
      'C to D, walk the bass C-D-E-D and land clean',
      'Alternate plain and walking versions every 4 bars',
      'End every loop back on G with a solid root',
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
      'Make the riff recognizable on its own',
    ],
    theoryBite: 'Riffs are cells that repeat. Same engine, small variation, and suddenly it\'s a song intro.',
    drills: [
      'Write a 1-bar eighth-note cell on paper first',
      'Repeat it exactly for 4 bars, no variation yet',
      'Change only the last beat on repeat 3, keep the rest',
      'Loop it until the variation sounds like a hook, not a mistake',
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
      'Lock into the track\'s pocket',
    ],
    theoryBite: 'A backing track is the closest thing to a band. Locking into it tests your pocket for real.',
    drills: [
      'Pick a drumless or very sparse backing track',
      'Play the week\'s groove over it, lock to the feel',
      'Match the track\'s dynamics and phrasing, not just tempo',
      'Record one take and check how tight the lock is',
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
      'Return to center on the downbeat',
    ],
    theoryBite: 'Harmonics ring longer than you expect. Place them behind the beat so they bloom into the pulse.',
    drills: [
      'Play a natural harmonic, let it ring a full bar',
      'Enter slightly behind the click on each one',
      'Resolve to a fretted note on beat 1',
      'Alternate harmonic / fretted every bar',
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
      'Leave space for the other player',
    ],
    theoryBite: 'Dynamics are a conversation. If the groove is loud, answer loud; if it drops, drop with it.',
    drills: [
      'Comp quietly under a loud groove, keep it in the pocket',
      'Trade: 4 bars loud, 4 bars soft, same pattern',
      'Match the groove\'s swell exactly when it rises',
      'Then deliberately contrast it to hear the difference',
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
      'Land the solo\'s peak on the accent',
    ],
    theoryBite: 'The riff is the metronome when you solo in 5. Your notes can dance around it as long as the accent holds.',
    drills: [
      'Loop the 5/4 riff with its accent',
      'Solo on one string, land on the accent beat',
      'Rest on the accent, play on the other beats',
      'End the solo on the riff\'s anchor note',
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
      'Keep the pattern through the whole arc',
    ],
    theoryBite: 'The comp is the song\'s pulse. It can swell and thin, but it must never stop being the pulse.',
    drills: [
      'Comp the base pattern at 50% volume for the first pass',
      'Swell to 100% over 8 bars, growing strum size steadily',
      'Thin to downstrokes only at the peak for extra power',
      'Settle back to 50% for the outro, tempo never moving',
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
      'Finish with a strummed outro',
    ],
    theoryBite: 'A song arrangement is boom-chuck plus a story. Verses sit back, choruses push, the outro lets it ring.',
    drills: [
      'Verse: boom-chuck on G-C-D at 60% volume, easy and warm',
      'Chorus: full boom-chuck at 100%, open it up',
      'Bridge: bass-only for 4 bars, then back in',
      'Outro: final chord, let it ring out and breathe',
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
      'End the song with a clear button',
    ],
    theoryBite: 'Arrangement is choosing the energy per section. Drive, drop, drive, stop — that\'s a song.',
    drills: [
      'Intro: muted eighth chugs, building anticipation',
      'Verse: light drive, half the volume, keep it moving',
      'Chorus: full palm-muted power, biggest moment yet',
      'Outro: final chord, let it ring and fade naturally',
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
      'End with a take worth keeping',
    ],
    theoryBite: 'The rhythm phase\'s final checkpoint is a mini-set. Comp, drive, dynamics, and a finish — that\'s the toolkit.',
    drills: [
      'Warm up: groove, comp pattern, dynamics',
      'Take a full 32-bar form without stopping to restart bars',
      'Include every week\'s skill at least once',
      'Keep the best take and write the next step',
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
      'Return to center on the chord change',
    ],
    theoryBite: 'Placement turns a scale into a sentence. Long notes sit back; runs lean in; the change pulls you home.',
    drills: [
      'Play a long bend, sitting behind the beat on purpose',
      'Run up the scale slightly ahead, then pull it back',
      'Land the chord change dead-center, no rushing it',
      'Repeat the whole sequence with your eyes closed',
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
      'Land the resolution softly',
    ],
    theoryBite: 'The arc is the song\'s heartbeat. Build where it needs to climb, spend it at the peak, rest at the end.',
    drills: [
      'Map the section: soft / build / peak / settle',
      'Play it through with dynamics only',
      'Move the peak one bar and hear it change',
      'Perform the arc three times clean',
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
      'Finish the form without counting aloud',
    ],
    theoryBite: 'Odd meter forms are the same forms with a different ruler. 12 bars of 5 is still a blues, just leaner.',
    drills: [
      'Map 12 bars of 5/4 on paper: chord per bar, accent marked on paper: chord per bar, accent marked',
      'Play the I chord, then IV, then V on their usual bars',
      'Keep the accent pattern through every change',
      'Run the whole form, foot driving',
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
      'Leave the phase with a pocket you trust',
    ],
    theoryBite: 'Every lead you\'ll play sits on a groove. This checkpoint makes sure the floor is solid before you walk on it.',
    drills: [
      'Groove the 12-bar blues for 4 full passes, no stopping',
      'Mark each chord change without dropping the pocket',
      'Add one dynamic swell per chorus, subtle at first',
      'Record one full clean pass and listen back once',
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
      'Play a short motif, then leave a full bar of rest',
      'Answer your own idea with a variation, not a flood of notes',
      'Prefer clear rhythm over note count'
    ],
    theoryBite: 'Lead guitar is speech. Rests make phrases feel human — your ear needs the gaps.',
    drills: [
      'Invent a 3-note motif on minor pentatonic; repeat it identically 4 times',
      'Play motif, rest a full bar, play motif again — 8 cycles',
      'Answer with the same notes in a new rhythm',
      'Record 30 seconds and count how many beats of silence you allowed'
    ],
    libraryIds: [
      'sc-pent-min',
      'rf-open-g-roll-study',
      'sg-arkansas-traveler'
    ],
    masteryCheck: 'Play eight motif/rest/answer cycles without filling every rest from panic.',
  },
  182: {

    title: 'Bends 101 — Target Pitch',
    durationMin: 35,
    goals: [
      'Bend a whole step up to a named target pitch',
      'Hear the target before you play it',
      'Land the bend in tune, not just in the neighborhood',
    ],
    theoryBite: 'A bend is a slide to a pitch you\'ve already heard. If you can hum it, you can land it.',
    drills: [
      'Fret the target note first and play it clean',
      'Bend up to that same pitch from a whole step below',
      'Match: play target, then bend, then compare',
      'Hold the bend 2 beats in tune, then release',
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
      'Long tone 4 beats with no vibrato — pure',
      'Same tone with slow even vibrato for 4 beats',
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
      'Call-response: fretted answer vs slid answer',
      '8 bars using at most one slide per bar'
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
      'Hammer 0→2→0 on one string slowly 60s',
      'Pull-off 3→1→0 with clear lower notes',
      'Cell: pick, hammer, pull — loop in time',
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
      'Move the shape up 2 frets in time',
      'Alternate single-note line and double-stop hit every bar',
      '8-bar hook using only two double-stop shapes'
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
      'Hum 1 bar, rest 1 bar — 4 cycles',
      'Play the contour on one string as close as you can',
      'Repeat on pentatonic box with the same rhythm',
      'Drop any note you can\'t sing back'
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
      'Resolve the last note to a chord root or third'
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
      'On G–C–D, play only roots for 8 bars',
      'Only 3rds for 8 bars (find them)',
      'Phrase that ends on a 3rd of each chord',
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
      'Play a 3-note melody in octaves slowly',
      'Alternate single-note and octave statements',
      '8 bars ending with an octave hook'
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
    theoryBite: 'Lead dynamics are storytelling. Identical pitches at one volume feel flat; arcs feel composed.',
    drills: [
      'One lick pp for 4 bars, ff for 4 bars',
      'Crescendo across an 8-bar soloette',
      'Decrescendo ending that still stays in tune on bends',
      'Mark dynamic hairpins on paper, then obey them'
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
      'Listen back and celebrate the air'
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
    theoryBite: 'Blues lead is language over a known form. Form awareness beats scale-shape tourism.',
    drills: [
      'Speak the 12-bar form while comping simply',
      'Call-lick on the I chord, then answer still on I — leave space',
      'New call on IV, answer resolving toward I',
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
      'Map major pentatonic box relative to G',
      'Play only major pent notes for 8 bars over G–C–D',
      'Target B notes (3rd of G) on phrase endings',
      'Contrast 4 bars minor pent vs 4 bars major pent'
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
      'Write a 3-part plan: sparse / develop / peak',
      'Play 8+8+8 bars following the plan over a vamp',
      'Reuse opening motif at the end varied',
      'Listen once: did the peak arrive too early?'
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
      'Stop before the sequence turns into noise',
    ],
    theoryBite: 'Sequences give a solo direction. The listener feels the climb coming before you arrive.',
    drills: [
      'Play a 4-note cell on one string set',
      'Repeat it one scale step higher, same rhythm',
      'Three climbs, then a long tone on the root',
      'Keep the metronome ticking under every repeat',
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
      'Resolve into E when the cadence lands',
    ],
    theoryBite: 'The Andalusian cadence walks down Am–G–F–E — the E phrygian home. Each chord is a color; E is the answer.',
    drills: [
      'Loop Am–G–F–E and hum the root each bar',
      'Play one note per chord, landing on E',
      'Add a second melody note on the F bar without rushing the hand',
      'Finish every phrase on E for a full pass',
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
      'Keep the notes even across the jump',
    ],
    theoryBite: 'Economy picking keeps the pick moving the same direction across a string skip — one motion, two notes.',
    drills: [
      'Two strings apart: downstroke on string A, keep down onto string B',
      'Play the pair slowly, no re-pick',
      'Add a third string to the sweep only when two strings are even',
      'Alternate sweep directions and repeat until both feel honest',
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
      'Balance the two volumes',
    ],
    theoryBite: 'Hybrid picking is a second hand inside one — the pick takes the bass, the fingers take the melody.',
    drills: [
      'Pick a low note, pluck a high note with the middle finger',
      'Same rhythm pattern, two strings apart — watch the fretting gaps',
      'Balance the volumes until they match',
      'Play a two-note groove for 30 seconds',
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
      'Quote it inside your own phrase',
    ],
    theoryBite: 'Songs are full of ready-made motifs. Borrow one, make it yours, and it becomes your voice too.',
    drills: [
      'Pick 4 notes from a PD melody you already know',
      'Play them as a motif with your own rhythm, not the original',
      'Repeat the motif three times, identical each pass',
      'End with a variation on the last note to close the phrase',
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
      'Name one keep and one fix',
    ],
    theoryBite: 'Checkpoints collect the week into one honest take. The name of the game is assembly, not perfection.',
    drills: [
      'Warm the week\'s lead material briefly, loose hands',
      'One take: space plus one expressive tool, no heroics',
      'Listen back once, kindly, and note what worked',
      'Write one keep and one fix for next week\'s session',
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
      'Choose bend or pre-bend based on what the melody wants',
    ],
    theoryBite: 'A bend lands you high; a pre-bend lands you low and arriving. Both are words in the same sentence.',
    drills: [
      'Half-step pre-bend on the G string, release on beat 1',
      'Trade: bend up, then pre-bend and release, four bars each',
      'End two phrases with a release instead of a fresh bend',
      'Keep the target note ringing through the release',
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
      'Let the pattern breathe before it returns',
    ],
    theoryBite: 'What goes up must come down. A downward sequence lands with just as much pull.',
    drills: [
      'Run the cell up three steps of the scale, even rhythm',
      'Then down three steps, same rhythm, no accent drift',
      'Add a rest between the two directions to reset',
      'Resolve on the root after the final descent',
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
      'Keep the F bar bright in contrast',
    ],
    theoryBite: 'Phrygian\'s flat 2 makes E feel dark and tense. The F chord is the bright window in the dark room.',
    drills: [
      'Play E Phrygian phrases on the E bar only',
      'Switch to F-major-ish lines on the F bar',
      'Contrast the two colors across two passes',
      'End each pass on E and let it ring — no nervous extra notes',
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
      'Stop before speed breaks the tone',
    ],
    theoryBite: 'Sweeps are about economy of motion. Even notes matter more than fast notes.',
    drills: [
      'Five-note shape across three strings, fretted cleanly',
      'One pick direction only, metronome at a relaxed 60',
      'Slow and even, then nudge one notch faster',
      'Back down a notch if any note starts to disappear',
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
      'Make the melody sing above the bass',
    ],
    theoryBite: 'The thumb anchors the groove; the fingers float the melody. Let the thumb stay, let the fingers move.',
    drills: [
      'Thumb on the low string, steady quarters',
      'Middle finger melody on the high strings',
      'Keep the bass even while the melody moves',
      'One 8-bar loop with a simple melody on top of the pad',
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
      'Land the motif\'s rhythm cleanly',
    ],
    theoryBite: 'Ragtime motifs live on syncopation. The rhythm IS the character — keep it or it\'s a different song.',
    drills: [
      'Learn the rag motif\'s rhythm first, clapping it',
      'Add the notes once the rhythm is solid',
      'Play it three times, accent the offbeats',
      'Quote the lick inside a simple vamp so it feels like music',
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
      'Keep the changes clean under the solo',
    ],
    theoryBite: 'Vamps are safe rooms for soloing — the harmony repeats, so you can take risks and return.',
    drills: [
      'Two-chord vamp, steady rhythm, simple and solid',
      'Solo with one tool only: vibrato, bend, or slide',
      'Land every phrase on a chord tone, not a passing note',
      'One take, then keep the version you\'d play again',
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
      'Choose pre-bend when the melody descends',
    ],
    theoryBite: 'A pre-bend arrives from above — you\'re already bent when the note starts, then release down into it.',
    drills: [
      'Pre-bend a half step silently, release on beat 1',
      'Match: play the lower note, then the release',
      'End one phrase with a release instead of a bend',
      'Four bars of pre-bend phrasing — bend is ready before the hit',
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
      'Hear the pattern as one idea, not three fragments',
    ],
    theoryBite: 'The same cell on different strings is still one idea — the ear follows the shape, not the string.',
    drills: [
      'Cell on the G string, then B string',
      'Repeat with identical picking direction',
      'Smooth the string change with a slide',
      'Three full climbs, one breath, resolve',
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
      'Hear the cadence as a conversation',
    ],
    theoryBite: 'In E phrygian, the 3rd of each chord is its personality — hit it on the downbeat and the line sounds like harmony, not scales.',
    drills: [
      'Find the 3rd of Am, G, F, and E on the neck and land each clean',
      'End each phrase on the next chord\'s 3rd',
      'Loop the cadence, move with the chord changes',
      'One full pass with only chord-tone endings',
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
      'Choose the stroke that fits the line',
    ],
    theoryBite: 'Real playing mixes both. Alternate when the line stays on a string, sweep when it skips.',
    drills: [
      'Two notes on one string: alternate picking, even volume',
      'Then skip a string for a small sweep, keep it controlled',
      'Write a 6-note line that mixes both techniques',
      'Loop it until the switch between them is invisible',
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
      'Play the group like one chord, not three notes',
    ],
    theoryBite: 'Three fingers plus the pick is a mini piano. Spread the notes and they sound like a chord.',
    drills: [
      'Pick a bass note, add middle and ring together',
      'Strum-roll the three into one chord shape',
      'Repeat the hybrid group in rhythm until the thumb feels automatic',
      'Two bars of the hybrid pattern, steady — then rest two bars',
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
      'Make it sound like your own line',
    ],
    theoryBite: 'Same contour, new rhythm, new mood. That\'s how motifs become personal vocabulary.',
    drills: [
      'Take your owned motif and slow it down to half speed',
      'Play it with a dotted rhythm, same notes',
      'Play it with rests inserted where the pickup was',
      'Pick the version that feels most like your voice',
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
      'Let the contrast tell the story',
    ],
    theoryBite: 'Volume is a lead tool like any other. A quiet line makes the loud one mean more.',
    drills: [
      'One phrase quiet, one phrase loud, same notes',
      'Alternate quiet and loud for four full phrases',
      'Keep the tempo rock steady while the volume moves',
      'One take with real contrast, then listen back',
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
      'Keep the release in time',
    ],
    theoryBite: 'A release at the end of a phrase is a period — the line finishes by settling down.',
    drills: [
      'End a phrase with a held bend, sustain it out',
      'Release it on beat 1 of the next bar, controlled',
      'Repeat with a different starting pitch each time',
      'Three phrases, all ending in releases, no fresh bends',
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
      'Keep every repeat clean, even with the leaner',
    ],
    theoryBite: 'A half-step approach note makes a sequence feel inevitable — it points at where you\'re going.',
    drills: [
      'Cell ending on a half-step below the next root',
      'Feel the tension as it approaches',
      'Resolve the whole run to a long target tone',
      'Two climbs, target, breath, repeat',
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
      'Keep the line flowing through the changes',
    ],
    theoryBite: 'A half-step approach makes a landing sing — phrygian loves leaning into E. Aim the tension note, then resolve like you meant it.',
    drills: [
      'Pick a target chord tone to land on each bar',
      'Approach it from the note a half step below',
      'Land it right on the downbeat, clean and confident',
      'Chain the whole cadence this way, one target per bar',
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
      'Resolve the arpeggio to its root',
    ],
    theoryBite: 'Arpeggios are the natural home of the sweep — the shape was made for one fluid stroke.',
    drills: [
      'Major arpeggio shape across three strings, mapped first',
      'One sweep up and one sweep down, slow and even',
      'Pick the root out clearly on the landing note',
      'Three clean passes, then resolve on the root',
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
      'Keep the roll even, not rushed',
    ],
    theoryBite: 'A hybrid roll is a chord broken into a tiny melody — spread it and it breathes.',
    drills: [
      'Pick bass, then roll middle and ring',
      'Spread the three notes across half a beat each',
      'Repeat the roll four times even',
      'Try it on two different chord shapes',
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
      'Return to your own line after',
    ],
    theoryBite: 'A quote is a wink — say a public-domain fragment once, briefly, then go back to your own story so it feels clever, not copied.',
    drills: [
      'Vamp two chords steadily, no ornament yet',
      'Insert the 4-note quote on the second bar of the loop',
      'Resume your own phrase right after, seamless',
      'Do it twice, keeping the quote short and clear',
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
      'Finish the take regardless',
    ],
    theoryBite: 'Recovery is a performance skill: the audience hears the recovery, not the mistake — if you keep going.',
    drills: [
      'Start a take; when you flub, keep the groove moving',
      'Repeat the phrase from the next chord, don\'t reset',
      'Never stop for a full pass, recover in time',
      'Record it and listen for how clean the recovery was',
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
      'Land the gesture on a chord tone',
    ],
    theoryBite: 'Bend then slide is one continuous line — the pitch moves twice without a new attack.',
    drills: [
      'Bend up, then slide to a higher fret without stopping',
      'Keep the sound continuous, no re-pick between moves',
      'Land the slide on a chord tone, not a random note',
      'Repeat the gesture inside a real musical phrase',
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
      'Lock it to the metronome the whole way',
    ],
    theoryBite: 'Rhythm is what makes a sequence yours. Same notes, new rhythm, different story.',
    drills: [
      'Play the cell as dotted rhythm, crisp and even',
      'Then as triplet rhythm, same four notes',
      'Keep the climb even through both rhythms',
      'Pick one rhythm and climb four steps with it',
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
      'Leave space where the harmony is already moving',
    ],
    theoryBite: 'The Andalusian cadence moves on its own — let phrygian color ride the chords. Do not force extra notes where the harmony already pulls.',
    drills: [
      'Play one note, then rest a full bar of silence',
      'Only play on the F and E bars, leave the rest empty',
      'Let the G bar pass completely silent',
      'Two passes: one busy, one spacious, compare them',
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
      'Keep the run flowing past the sweep',
    ],
    theoryBite: 'A sweep inside a run is a shortcut, not a showpiece — the line keeps moving through it.',
    drills: [
      'Scale run with one sweep on a string skip',
      'Keep the rest of the line alternate-picked and even',
      'Loop the run, let the sweep land on a chord tone',
      'Two full runs of the line, even throughout — no sprint finish',
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
      'Let the color serve the song',
    ],
    theoryBite: 'Hybrid texture over simple chords is instant arrangement — same changes, richer sound.',
    drills: [
      'Two-chord loop, thumb playing steady bass notes',
      'Add finger melody on the second chord only',
      'Full loop with both chords colored, melody on top',
      'Play it soft first, then full volume, same tempo',
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
      'Keep the family resemblance clear',
    ],
    theoryBite: 'Development is showing the motif in new light — sequence, mirror, or stretch, but keep the DNA.',
    drills: [
      'Bar 1: play the motif exactly as you learned it',
      'Bar 2: sequence it up a step, same rhythm',
      'Bar 3: invert the direction, mirror the shape',
      'Bar 4: resolve down to the root and hold it',
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
      'Make the shape audible to a listener',
    ],
    theoryBite: 'A phrase with a shape is a sentence: it starts somewhere, rises, and lands. Listeners feel that arc.',
    drills: [
      'Plan a 4-bar phrase: low start, rise, land',
      'Play the line with the chord shape still in your mind\'s eye',
      'Repeat with a different peak note',
      'Keep the take where the arc was clearest',
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
      'Keep both notes in tune',
    ],
    theoryBite: 'A bend-release pair is a two-note rhythm figure — it has to groove, not just sound.',
    drills: [
      'Bend up on the &, release on beat 1, in time',
      'Repeat the bend-release pair for four bars',
      'Keep the metronome strict through every pair',
      'Try the pair on two different strings, same feel',
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
      'Let the loudest note be the target',
    ],
    theoryBite: 'Pitch and volume together tell the whole story. A climb that grows is a climb that lands.',
    drills: [
      'Climb the cell three steps, crescendo with each step',
      'Peak on the target tone, then hold the energy',
      'Come back down, quieter on every step',
      'Repeat the whole shape twice, then finish clean',
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
      'Resolve the second cycle like a closing',
    ],
    theoryBite: 'Two cycles make a sentence in E phrygian: the first asks, the second answers.',
    drills: [
      'First cycle: end open, leave it hanging',
      'Second cycle: answer and resolve to E',
      'Keep the rhythm consistent across both',
      'Record the full two-cycle phrase',
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
      'Change direction without a hiccup',
    ],
    theoryBite: 'Up-sweeps are usually the weak side of economy picking. Practice the direction you avoid until both ways feel equally honest.',
    drills: [
      'Down-sweep the arpeggio, letting each note ring',
      'Up-sweep it back, same even spacing',
      'Alternate: down, up, down, up without pausing',
      'Make the up-sweep sound as strong as the down-sweep',
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
      'Balance the register jump',
    ],
    theoryBite: 'High melody over low bass is the classic hybrid voice — two instruments from one guitar.',
    drills: [
      'Low thumb bass with a high finger melody on top',
      'Jump the melody an octave up, keep the bass put',
      'Keep the bass steady through the whole jump',
      'Trade registers every four bars, bass and melody swap',
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
      'Keep the conversation musical',
    ],
    theoryBite: 'Call and response turns a motif into dialogue — the same idea answered by a different voice.',
    drills: [
      'Call: play the motif, one bar long',
      'Answer: play a variation, one bar long',
      'Trade four times, keeping each one short and clear',
      'End with the motif as the final word, ring it out',
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
      'Return to the root at the turnarounds',
    ],
    theoryBite: 'Longer forms need landmarks. Return to chord tones at the changes and the solo always knows where it is.',
    drills: [
      'Play the full form once with chord-tone landings',
      'Add one new idea per section, don\'t overfill',
      'Return to the root at each turnaround for anchor',
      'One full take, then keep the better of two versions',
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
      'Make the entrance feel planned',
    ],
    theoryBite: 'Opening on a pre-bend is a dramatic entrance — the note is already in motion when we hear it.',
    drills: [
      'Pre-bend silently, start the phrase on the release',
      'Let the release be the phrase\'s first note',
      'Follow the bend with a short descending answer phrase',
      'Two phrase entrances in a row — both clean, no rushed pickup',
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
      'Connect the positions without a pause',
    ],
    theoryBite: 'The same sequence in a new position is a new color. Register changes the mood of the same idea.',
    drills: [
      'Climb the cell in the low position, even rhythm',
      'Jump to the higher position, same shape, same feel',
      'Land the jump on a target note, not a random one',
      'Three full climbs, ending home on the root',
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
      'Keep it recognizable through all four bars',
    ],
    theoryBite: 'A single motif through changing harmony — the phrygian color shifts underneath',
    drills: [
      'Invent a 3-note motif on Am, simple and singable',
      'Transpose it over G, F, and E chords, same shape',
      'Let only one note change per chord for color',
      'Play the full cadence twice with the motif intact',
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
      'Resolve to the minor root',
    ],
    theoryBite: 'Minor arpeggios sweep with a different weight — the flat 3rd changes the whole feel.',
    drills: [
      'Minor arpeggio across three strings, mapped cleanly',
      'Sweep up and hold the flat 3rd for color',
      'Resolve down to the minor root, let it ring',
      'Trade major and minor shapes and hear the mood shift',
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
      'Keep the groove through the switch',
    ],
    theoryBite: 'Hybrid for the melody, strum for the hit — the switch is a dynamic move, not a gear change.',
    drills: [
      'Hybrid pattern for four bars, thumb and fingers clear',
      'Full strum for one bar as a contrast color',
      'Back to hybrid with no pause between patterns',
      'Repeat the whole cycle four times, steady tempo',
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
      'Keep the motif singing above it',
    ],
    theoryBite: 'A drone makes any motif feel ancient and modal — the harmony stands still while the idea moves.',
    drills: [
      'Hold a drone on the low strings, open and ringing',
      'Play the motif above it, keeping the drone alive',
      'Vary the motif\'s rhythm while the drone holds steady',
      'Two full passes, drone never wavering',
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
      'Resolve to the modal root',
    ],
    theoryBite: 'A modal color is a mood license — stay in the mode and the whole solo sounds intentional.',
    drills: [
      'Pick a mode and map where its root sits',
      'Phrase only inside the mode, no outside notes yet',
      'Avoid the one note that breaks the color on purpose',
      'Resolve every phrase to the modal root at the end',
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
      'Keep the vibrato even at the top',
    ],
    theoryBite: 'Bend to pitch first, vibrato second — the wave sits on a stable note, not a wobbling one.',
    drills: [
      'Bend a whole step up to pitch, ear-checked',
      'Hold it steady, then add narrow vibrato on top',
      'Keep the vibrato even for four full beats',
      'Release and repeat, same control each time',
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
      'Resolve the run to a chord tone',
    ],
    theoryBite: 'Over one chord, the sequence is the movement. The ear follows the climb because nothing else moves.',
    drills: [
      'One chord vamp, climb the cell four steps cleanly',
      'Vary the rhythm on the last repeat for interest',
      'Land on the chord\'s root or third at each phrase end',
      'Repeat with the other direction, same discipline',
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
      'Let register change the mood of the same line',
    ],
    theoryBite: 'The same phrygian line low and high is two different feelings. Register is arrangement — try both and keep the one that serves the song.',
    drills: [
      'Play the line low for two cycles, warm and clear',
      'Repeat it an octave up, same articulation',
      'Mix: low question, high answer, two bars each',
      'End high on E and let it ring out fully',
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
      'Keep the sweep musical from note one',
    ],
    theoryBite: 'Starting on an arpeggio is a confident way to enter — the harmony is stated before the melody wanders.',
    drills: [
      'Open a 4-bar phrase with a sweep, confident attack',
      'Follow with a scale answer, contrasting feel',
      'Two takes: one sweep-open, one scale-open',
      'Keep the one that sounds stronger to your ear',
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
      'Keep it playable and musical',
    ],
    theoryBite: 'Arranging with hybrid means deciding who plays what: bass for the thumb, melody for the fingers.',
    drills: [
      'Pick a simple melody you can hum without thinking',
      'Add a thumb bass underneath it, steady pulse',
      'Adjust the bass until the melody stays crystal clear',
      'Play the passage twice through, same clarity',
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
      'Connect them with a passing note',
    ],
    theoryBite: 'Two motifs make a phrase the way two sentences make a paragraph — connect them with a bridge.',
    drills: [
      'Motif A, one bar, stated plainly',
      'Motif B, one bar, contrasting shape',
      'Bridge them with a single passing note, no fuss',
      'Play the full four-bar phrase twice, connected',
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
      'Make the tools feel like one voice',
    ],
    theoryBite: 'Tools chain like words — bend, slide, rest is a sentence. The voice is how they connect.',
    drills: [
      'One phrase ending with a bend, held and resolved',
      'Next phrase opening with a slide into the note',
      'Next phrase ending with a rest instead of a note',
      'String all three into one solo, telling one story',
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
      'Let the bend be a choice, not a habit',
    ],
    theoryBite: 'Bends are seasoning. Too many and nothing stands out — save them for the moments that need them.',
    drills: [
      'Play a phrase with no bends at all, clean line',
      'Add one bend at the very end, target pitch clear',
      'Move the bend to a different note and compare',
      'Keep the version where the bend lands most naturally',
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
      'Make the climb sound intentional, not lost',
    ],
    theoryBite: 'Sequences make a new scale feel like home — the shape is familiar even where the notes are new.',
    drills: [
      'Pick a scale you haven\'t climbed through before',
      'Map a 4-note cell inside it, note names known',
      'Climb three steps with the same rhythm',
      'Resolve to the new scale\'s root, hear the color',
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
      'Play it like a song, not a pattern',
    ],
    theoryBite: 'Chord tone + approach + rest is a complete sentence — phrygian turns it into a question.',
    drills: [
      'One bar of chord-tone only, simple and solid',
      'One bar with an approach note leading in',
      'One bar with a rest in the middle for breath',
      'One full pass mixing all three textures together',
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
      'Record a take that sounds like music',
    ],
    theoryBite: 'Technique graduates when you stop hearing it. This pass is the graduation: musical sentences first, pick mechanics invisible.',
    drills: [
      'Pick a vamp and choose a chord-tone target note',
      'One phrase with a sweep toward the target',
      'One phrase with a sweep away from it',
      'Record the better take and note why it won',
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
      'Record a take worth keeping',
    ],
    theoryBite: 'Hybrid picking is done when it survives a full take, not a perfect two-bar loop. Today is the full-take honesty check.',
    drills: [
      'Warm the pattern twice through, slow and loose',
      'One full performance pass, no stopping allowed',
      'One more pass with the dynamics you rehearsed',
      'End on the root and hold it, then shake out',
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
      'Record a take you\'d keep',
    ],
    theoryBite: 'The motif study completes when the solo sounds like a story with a recognizable hero.',
    drills: [
      'Statement: play the motif twice, confident',
      'Contrast: play it an octave lower, darker color',
      'Return: back to the original register to finish',
      'One full pass through all three, then a keeper take',
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
      'Record and keep the best version',
    ],
    theoryBite: 'The checkpoint is the whole week in one pass. Play it like you mean it, then keep the honest take.',
    drills: [
      'One take: space, one tool, and a clear ending',
      'Listen back once and mark the best phrase',
      'Replay only that phrase three times, polish it',
      'Write one keep and one fix for the next session',
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
      'Make it sound like singing',
    ],
    theoryBite: 'Bends are the voice of the guitar. A solo made of them should sound like a singer, not a machine.',
    drills: [
      'Whole-step bend on the third string, in tune',
      'Hold it two beats, then release slowly down',
      'Pre-bend and release on the next phrase',
      'Alternate bend and pre-bend across four phrases',
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
      'End the sequence on musical silence',
    ],
    theoryBite: 'Sequences are arrows, not destinations. Point somewhere, then say the thing you aimed at.',
    drills: [
      'Climb the cell in a new position, eyes on the neck',
      'Keep the same rhythm from last week\'s version',
      'Land the top note on the click, then descend',
      'Two full climbs with a rest between them',
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
      'Record a version you\'d keep',
    ],
    theoryBite: 'The E phrygian study ends when it sounds like music. This pass is the proof',
    drills: [
      'Open with space: two beats of silence before the first note',
      'One phrase with your best expressive tool, held',
      'One phrase with a bend, one with a slide',
      'End the solo on the root, one take worth keeping',
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
      'Choose one vehicle song from the open library and stick with it this week',
      'Map intro, verse, chorus, and ending on paper before speeding up',
      'Polish one section beautifully instead of thrashing the whole tune poorly'
    ],
    theoryBite: 'Repertoire is where the skills finally feel like music. Nailing sections beats thrashing the whole song.',
    drills: [
      'Pick a vehicle and write its title at the top of a chart page',
      'Listen once (or hum) and label form sections with box outlines',
      'Loop only section 1 at a honest slow tempo ten times clean',
      'Stop while it still sounds good — protect motivation'
    ],
    libraryIds: [
      'sg-wild-mountain-thyme',
      'sg-ode',
      'pr-12bar'
    ],
    masteryCheck: 'Show a labeled form map and play one section ten times with steady time.',
  },
  262: {

    title: 'Form Mapping on Paper',
    durationMin: 30,
    goals: [
      'Write accurate bar counts for every section on one page',
      'Play each section boundary until the seam is boringly clean',
      'Speak the form while comping at practice tempo'
    ],
    theoryBite: 'A form map is a memory externalization. Eyes reduce brain load so hands can groove.',
    drills: [
      'Redraw the form with bar counts per section',
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
    theoryBite: 'Intros promise the song\'s world in a few bars. A clear hook beats a long meander.',
    drills: [
      'Design a 2- or 4-bar intro on paper',
      'Loop the intro into verse without a hitch 8 times',
      'Try a sparser intro and a busier intro; pick one',
      'Record both and keep the clearer promise'
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
    theoryBite: 'Verses often need lower density so lyrics (or melody) can speak. Texture is arrangement.',
    drills: [
      'Verse-only loop with reduced strum density 8 bars × 4',
      'Mark words or hummed syllables where strums should thin',
      'Compare high-density vs low-density verse takes',
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

    title: 'Chorus Lift',
    durationMin: 30,
    goals: [
      'Create an obvious lift into the chorus',
      'Use one primary lift lever (density, voicing, or dynamics)',
      'Make verse→chorus a rehearsed seam, not a hope'
    ],
    theoryBite: 'Choruses lift via range, density, strum energy, or harmonic brightness — pick one primary lever.',
    drills: [
      'Chorus loop with one lift lever only (density or voicing)',
      'Verse→chorus transition 10 times focusing on energy change',
      'If lift fails, raise voicing rather than only hitting harder',
      'Capture one keepable chorus take you would actually replay'
    ],
    libraryIds: [
      'sg-auld-lang-syne',
      'sg-this-old-man',
      'pr-145'
    ],
    masteryCheck: 'Make the chorus clearly lift, then record one take you would keep.',
  },
  266: {

    title: 'Bridge or Middle Eight',
    durationMin: 35,
    goals: [
      'Make the bridge contrast without losing the pulse',
      'Secure bridge chords before adding ornaments',
      'Test verse–bridge–verse as a unit'
    ],
    theoryBite: 'Bridges contrast. New chord color or rhythmic space re-engages ears before the final chorus.',
    drills: [
      'Isolate bridge chords slowly until changes are early-prepared',
      'Bridge in/out transitions 8 times each',
      'Option: simplify bridge to 2 chords if unstable',
      'Play verse–bridge–verse to test contrast'
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
    theoryBite: 'Endings are remembered. A button (short final hit) or deliberate fade-out is a design choice.',
    drills: [
      'Practice last 4 bars into button 15 times',
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
    theoryBite: 'Transitions fail when hands panic between sections. Glue fills are short and tempo-true.',
    drills: [
      'Loop the two bars around every section seam',
      'Insert a 1-beat rest glue if hands need time',
      'Remove emergency pauses that break tempo',
      'Run full form focusing only on seams'
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
    theoryBite: 'The right tempo is the one where parts stay human. Ego tempo creates permanent flaws.',
    drills: [
      'Find the tempo where changes stay clean for 16 bars',
      'Mark that BPM as practice tempo on the chart',
      'Play 1% faster only if error rate stays low',
      'Reject tempos that require shoulder tension'
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
    theoryBite: 'Plan soft and loud regions like a lighting plot. Dynamics make form audible.',
    drills: [
      'Assign soft/medium/loud to sections on the chart',
      'Play with exaggerated dynamics once',
      'Play the section with real dynamics once — soft verse energy',
      'Make sure tempo stays flat when volume rises'
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
    theoryBite: 'Memory thrives on chunks and cues, not heroic full runs on day one of recall.',
    drills: [
      'Turn chart face down; play one section from memory',
      'Turn the chart face-back and play seams from memory only',
      'Add a second section to memory when the first is stable',
      'Note the exact bar where memory blinks'
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
    theoryBite: 'Pros rejoin the form after mistakes. Stopping trains fragility; recovery trains performance.',
    drills: [
      'Intentionally flub a change, then rejoin on next downbeat',
      'Practice smiling through the rejoin',
      'Never stop the foot pulse during recovery drills',
      'Do 5 scripted recoveries in a row'
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
    theoryBite: 'A clean chart is future-you kindness. Marks for feels, mutes, and frets reduce reload cost.',
    drills: [
      'Rewrite messy bars with larger fret numbers',
      'Add feel marks (mute, accent, light) in one ink color',
      'Remove obsolete marks that confuse you',
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
      'Verse tone: darker/softer attack for 8 bars',
      'Chorus tone: clearer/brighter for 8 bars',
      'If amp available, preset two levels; if not, use hands only',
      'A/B record a single section both ways'
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
    theoryBite: 'Playing along teaches ensemble timing. Match pocket before adding ornamental disagreement.',
    drills: [
      'Play along with a library recording or your own prior take',
      'Match downbeats for one full section before adding fills',
      'If you rush, simplify to downbeats only',
      'Log where you pulled away from the duet pocket'
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
    theoryBite: 'Fingerstyle can state bass + harmony + hint of melody. Start sparse; density later.',
    drills: [
      'Thumb on beat roots only for one section',
      'Add simple higher-string pattern on &s',
      'Keep pattern identical across chord changes 8 bars',
      'If collapse, return to thumb-only'
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
    theoryBite: 'Strum arrangements live or die on right-hand pattern consistency through changes.',
    drills: [
      'Lock one strum pattern for the whole section',
      'Change chords without changing the pattern DNA',
      'Mark where you must thin the pattern for breaths',
      '16-bar run with pattern recognizability intact'
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
      'Keep break tempo honest and shorter than ego wants'
    ],
    theoryBite: 'A lead break is a short story inside the song, not a separate shred audition. Start clear, peak once, land before the vocal returns.',
    drills: [
      'Write a 2-bar break maximum on paper',
      'Place it after a chorus or before a final verse',
      'Practice song with break omitted vs included',
      'Keep break slower than your ego wants'
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
      'Hum a call; answer on guitar in the next bar',
      'Leave the call bar mostly empty on guitar',
      'Two call-response pairs inside one section',
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
    theoryBite: 'Capo is a friend of singable range. Comfortable vowels beat theoretical purity.',
    drills: [
      'Find a capo fret where singing (or humming comfortably) works',
      'Rewrite shapes if needed for the new positions',
      'Play section in new key without rushing',
      'Note capo fret on chart in large digits'
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
    theoryBite: 'Set order manages energy and key fatigue. Adjacent songs need intentional contrast or glue.',
    drills: [
      'Order two or three songs by energy curve',
      'Check keys for monotony; adjust capo plan if needed',
      'Speak transitions once as if on stage',
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
    theoryBite: 'Stamina is paced reps with loose shoulders. Pain is a stop sign, not a badge.',
    drills: [
      'Play the hardest section 3 times with 30s shoulder drops between',
      'Full song once at practice tempo focusing on loose hands',
      'Stop at pain — adjust technique or tempo',
      'Log stamina minutes without tension'
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
    theoryBite: 'Soft playing reveals timing sins volume hides. Quiet days build control and neighbor peace.',
    drills: [
      'Entire session at whisper volume',
      'If notes disappear, fretting is incomplete — fix gently',
      'Quiet chorus still needs lift via texture not volume',
      'End with one medium take to contrast control'
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
    theoryBite: 'Recording is a mirror. One take worth keeping teaches more than five ignored ones.',
    drills: [
      'One full section or song take with performance rules',
      'No stopping mid-take unless safety issue',
      'Listen once before deleting anything',
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
      'Listen for time first, notes second',
      'Write one keep sentence and one fix sentence',
      'Apply only the fix in a short loop',
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
    theoryBite: 'Isolating the sticky bar is high-use practice. Context returns after the bar is honest.',
    drills: [
      'Locate the single stickiest bar and put a star on the chart',
      'Loop that bar at about 70% speed twenty times, then rest',
      'Add bar before and after (context) 10 times',
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
    theoryBite: 'Body language affects breathing and tempo. Tall and soft beats coiled and brittle.',
    drills: [
      'Check feet, shoulders, and neck angle in a mirror or camera',
      'Play hardest passage with knees soft',
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
    theoryBite: 'First bars set trust. A start ritual (breath, count-in, shoulders) reduces flinch errors.',
    drills: [
      'Design a 5-second start ritual (breath, count, shoulders)',
      'Practice ritual → first 2 bars 15 times',
      'If first bar fails, don\'t skip ritual on retry',
      'Film one clean start of the section for review'
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
      'Last 4 bars + stillness 15 times',
      'Decide facial/body end pose (simple)',
      'No embarrassed rushes off the neck',
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
      'Write a 2-bar seam on one chord or hit',
      'Practice A-end → seam → B-start slowly',
      'Only then attempt performance tempo'
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
    theoryBite: 'Same progression, new right-hand dialect (folk, rock, ballad). Style is mostly rhythm and density.',
    drills: [
      'Same section at ballad density — fewer hits, more air',
      'Same section, rock eighth density',
      'Same section, boom-chuck if fits',
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
    theoryBite: 'Amps compress and sustain differently. Adjust attack and mute strategy per context.',
    drills: [
      'Play section unplugged/very clean',
      'Play with more sustain or imaginary amp compression (longer fretting)',
      'Adjust mute strategy for the louder context',
      'Note which articulations survived'
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
    theoryBite: 'Unwanted open-string noise is arrangement dirt. Left-hand chops and right-hand palms are erasers.',
    drills: [
      'Slow motion: identify noisy open strings',
      'Assign left-hand mute or palm for each culprit',
      'Loop dirty bar until noise floor drops',
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
    theoryBite: 'Even instrumentalists benefit from lyric landmarks as memory cues and dynamic guides.',
    drills: [
      'Write or recall key lyric fragments against bars',
      'Use a lyric word as a dynamic cue (e.g. softer on line 2)',
      'Play while speaking lyrics in rhythm once',
      'Remove lyrics; keep the dynamic shape'
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
    theoryBite: 'A clear count-in is leadership. Tempo lives in the spoken 1-2-3-4 before the first hit.',
    drills: [
      'Count-in aloud at target tempo 10 times',
      'Count-in + first bar only 10 times',
      'Silent count-in (mouth the numbers) 5 times',
      'No starting without a count-in today'
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
    theoryBite: 'Holds need collective breath. Practice long notes with a planned re-entry cue.',
    drills: [
      'Place a fermata on a cadence note',
      'Hold with steady vibrato or clean sustain',
      'Re-enter with a whispered count or breath cue',
      'Two fermata spots max in the song today'
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
    theoryBite: 'Slowing down is coordinated, not collapsing. Subdivide while you decelerate.',
    drills: [
      'Subdivide aloud while slowing last 2 bars',
      'Conduct the slow-down with your neck or foot',
      'Land final hit together with imaginary band',
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
    theoryBite: 'Double-time is denser subdivision at the same chord pace. Keep harmonic rhythm clear.',
    drills: [
      'Keep chord changes on original bars; double strum density',
      '8 bars normal, 8 bars double-time feel',
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
    theoryBite: 'Half-time makes grooves heavier. Backbeat placement shifts while form length stays honest.',
    drills: [
      'Move backbeat emphasis to create half-time feel',
      'Eight bars normal feel, eight bars half-time — hard edges clean',
      'Keep chord moments aligned to form',
      'Great for final verse drama if song allows'
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
    theoryBite: 'Fewer chords can make a song stronger. Power and triad reductions are honest arrangements.',
    drills: [
      'Rewrite one section with fewer chord changes',
      'Try power-shape reduction on a busy bar',
      'A/B original vs simplified for singability',
      'Adopt simplification if consistency jumps'
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
    theoryBite: 'Add color tones only after the simple version is stable. Ornament follows skeleton.',
    drills: [
      'Add one color tone (e.g. add9 or 7) on chorus only',
      'Make sure you can still grab it in time',
      'Remove it if section error rate rises',
      'Ornaments must survive performance tempo'
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
    theoryBite: 'Moving bass lines outline harmony. A walking or stepwise bass can replace busy strums.',
    drills: [
      'Play roots only on beats 1 and 3 for a section',
      'Add simple stepwise bass between chords',
      'Mute higher strings while bass speaks',
      'Reintroduce light strums after bass is stable'
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
    theoryBite: 'Body hits and muted chops add drums. Keep them grid-aligned or they fight the song.',
    drills: [
      'Add a muted chop on beat 2 and 4',
      'Optional body tap on &s if comfortable',
      'Keep percussion quieter than harmony',
      'Remove perc if form timing suffers'
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
    theoryBite: 'Open tunings re-shape shapes. If you skip retuning, simulate drone strings in standard.',
    drills: [
      'Optional: try a drone-friendly voicing in standard tuning',
      'If you know an open tuning safely, explore 5 minutes max',
      'Always have a retune plan back to standard',
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
    theoryBite: 'Drop D adds weight on the sixth string. Optional — explore carefully and retune back after.',
    drills: [
      'Optional Drop D: retune sixth string carefully',
      'Power shapes on low strings for a chorus color',
      'Play a section; note what got easier/harder',
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
    theoryBite: 'Travis picking needs an ostinato thumb. Stability of bass before fancy fingers.',
    drills: [
      'Thumb ostinato on roots/5ths alone 2 minutes',
      'Add simple higher pattern on a single chord',
      'Carry pattern through two chord changes',
      'Apply to one song section slowly'
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
    theoryBite: 'Boom-chuck turns a song into train motion. Bass/chord roles must stay distinct.',
    drills: [
      'Boom on 1 and 3, chuck on 2 and 4 for full section',
      'Keep chucks lighter than the boom bass notes so groove reads',
      'Chord change practice at boom-chuck tempo',
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
    theoryBite: 'Ballads need air. Reduce strum density and lengthen harmonic rhythm under melody.',
    drills: [
      'One strum per bar or per two beats max',
      'Leave space after each change for imaginary singer',
      'Dynamic swell inside long chords',
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
    theoryBite: 'Speed exposes muddy changes. Clarity at tempo requires earlier prep motion.',
    drills: [
      'Isolate fastest change at 80% tempo',
      'Prepare fretting hand early on the beat before',
      'Thin right hand if needed to save left hand',
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
    theoryBite: 'Slow blues is space and weight. Long phrases and patient dominant chords teach taste.',
    drills: [
      '12-bar skeleton at truly slow tempo',
      'Leave space in bars 2 and 4 of each phrase',
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
    theoryBite: 'Folk pace follows story breath. Don\'t drag; don\'t chatty-rush between verses.',
    drills: [
      'Tell the story: vary verse intensity without rushing',
      'Keep pulse while allowing phrase-end breaths',
      'Optional hummed verse to pace guitar',
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
    theoryBite: 'Lead the room with loud clear changes and friendly tempos. Perfect ornaments are optional.',
    drills: [
      'Play as if others sing — louder changes, simpler ornaments',
      'Call the chord names once before starting',
      'Steady boom or strum a drunk-friendly tempo',
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
      'Write a 3-song or 3-section energy arc on paper',
      'Practice speaking one sentence between sections',
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
    theoryBite: 'Click polish reveals kind lies. Use it to stabilize, then graduate to human feel.',
    drills: [
      'Full section with click at practice tempo',
      'Note where you pull ahead of the click and circle those bars',
      'Loop only rushing bars with click',
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
    theoryBite: 'Simulate pressure with one-take rules and mild distraction. Recovery > perfection fantasy.',
    drills: [
      'One-take rule for a full section',
      'Add mild distraction (TV low, or stand up)',
      'Practice recovery smile if error happens',
      'Debrief: what ritual helps next time?'
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
    theoryBite: 'A second vehicle prevents overfit. Intake method matters more than bravado.',
    drills: [
      'Choose second vehicle easier or contrasting',
      'Do intake: form map + section 1 loop',
      'Don\'t abandon song 1 — schedule both',
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
      'Third song should be a confidence piece',
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
    theoryBite: 'Swapping vehicles resets ears. Bring one skill from the old song into the new.',
    drills: [
      'Park current vehicle; select a contrasting song',
      'Bring one skill (e.g. dynamics plan) into the new song',
      'Short intake only — avoid over-ambition',
      'Note what feels easier than month one'
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
    theoryBite: 'Reviving an old song with new skills proves growth. Avoid autopilot nostalgia thrash.',
    drills: [
      'Revisit an early-course song and notice what feels easier now',
      'Apply a new skill (mute cleanup or dynamic arc)',
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
      'New song intake checklist on paper',
      'Form first, sticky bar second, ornaments never first',
      'Five slow loops of section 1 before any speed attempt',
      'Stop before fatigue encodes errors'
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
    theoryBite: 'Phrases are memory units. Link only after each phrase is independently solid.',
    drills: [
      'Slice section into phrase units of 2–4 bars',
      'Master phrase A, phrase B, then A+B only',
      'Don\'t run full section until links work',
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
    theoryBite: 'Practice across boundaries (last 2 beats of A into first 2 of B) where breaks happen.',
    drills: [
      'Loop bars spanning the section boundary only',
      'Slow the boundary 20% under section tempo',
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
      'Two clean runs required to graduate a rung',
      'If fail, step down a rung without drama',
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
    theoryBite: 'Right hand alone, left hand alone, then marry. Isolation finds the true culprit.',
    drills: [
      'Right hand pattern on open strings or muted',
      'Left hand fretting silent movie (no strum) through changes',
      'Combine sections at 80% speed — only full tempo after two clean links',
      'Identify which hand caused yesterday\'s errors'
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
    theoryBite: 'Mental rehearsal activates motor plans. Visualize frets and count form silently.',
    drills: [
      'Away from guitar: visualize fretting through one section',
      'Count the form silently with eyes closed',
      'Spot the sticky bar mentally 5 times',
      'Return to guitar and play once slowly'
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
    theoryBite: 'Video shows posture and panic motions audio misses. Watch once muted, once with sound.',
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
      'Do one audio-only take and listen back once',
      'Listen back without looking at your hands — ear-only critique',
      'Timestamp one timing issue and one tone issue',
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
      'Ask one question (e.g. \'does chorus lift?\')',
      'If no peer, ask future-you the same question on listenback',
      'Apply at most one suggestion today'
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
    theoryBite: 'Teaching forces clarity. Explain fingering and count-in as if a friend holds the guitar.',
    drills: [
      'Explain section fretting aloud as if teaching',
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
    theoryBite: 'If error rate is high, remove ornaments. Consistency is a feature audiences feel.',
    drills: [
      'Remove ornaments from highest-error section',
      'Play simplified version 5 clean times',
      'Only then consider re-adding one ornament',
      'Consistency score beats complexity score'
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
      'Add one ornament type only (slide or hammer)',
      'Place ornaments on weak beats or phrase ends',
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
    theoryBite: 'One signature lick placed well beats five random fills. Put it where form breathes.',
    drills: [
      'Write a 1-bar signature lick you could play half-asleep',
      'Place it in the same form location each time',
      'Practice song with lick omitted vs included',
      'Keep lick slower than surrounding ego'
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
    theoryBite: 'Schedule rests as arrangement. Silence before a chorus can lift harder than more strums.',
    drills: [
      'Schedule a one-bar near-silence before chorus',
      'Protect that silence in every run',
      'No nervous fills inside the planned air',
      'Feel how chorus hits harder after air'
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
    theoryBite: 'Starting from silence trains confident first hits. Count in; don\'t sneak noise.',
    drills: [
      'Hands ready, true silence, then count-in',
      'First hit confident mf, not accidental graze',
      'Ten reps: silence, then a clean start — no flinch on beat 1',
      'If noise creeps, freeze longer before counting'
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
    theoryBite: 'Cold endings stop together. Practice the final hit and the still body after.',
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
      'Decide tag length (1 or 2 repeats)',
      'Practice the tag into a firm button ending without extra hits',
      'Keep tag dynamics intentional (build or shrink)',
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
    theoryBite: 'A late key lift is optional drama. Only attempt if the original key is already solid.',
    drills: [
      'Optional last-chorus capo or shape shift only if base key solid',
      'Practice the modulation moment 10 times slowly',
      'If unstable, postpone key change — strength first',
      'Mark optional on chart so you can skip live'
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
      'Write bass walk into a new tonal center',
      'Slow walk the modulation with named notes under your breath',
      'Connect from old chorus into walked lift',
      'Abort if intonation or tempo fails'
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
    theoryBite: 'Stop-time inside a song is theater. Hits must be agreed with your own click sense.',
    drills: [
      'Design 2 bars of stop-time hits inside the song',
      'Practice with click and strict rests',
      'Re-enter groove cleanly after stops',
      'Use once per song unless arrangement needs more'
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
    theoryBite: 'Breakdowns strip texture. Practice the sparse version so rebuilds feel huge.',
    drills: [
      'Strip section to skeleton (roots or light chops)',
      'Loop the sticky 8 bars until the hitch disappears twice in a row',
      'Rebuild to full texture over 4 bars',
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
      'Final chorus adds one lift element only',
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
    theoryBite: 'False endings play with expectation. Only funny if the real ending is secure.',
    drills: [
      'Play fake ending gesture, then continue tag',
      'Only if real ending is already solid',
      'Audience (imaginary) must not be confused by sloppy fake',
      'Notate clearly so you remember live'
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
      'Shared chord or drum-like hits as glue',
      'Slow seam practice ten times where the medley pieces join',
      'Then song A end → bridge → song B start'
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
    theoryBite: 'Journal what improved and what is next. Written goals outperform mood memory.',
    drills: [
      'Write 5 lines: wins, sticky bar, tempo, energy, next action',
      'Circle one next action only in the journal — ignore the rest',
      'Do that one circled action for ten focused minutes — nothing else',
      'Close journal — avoid endless planning'
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
      'Candidate tempos: safe / stretch / ego',
      'Test eight bars at each tempo step before speeding',
      'Pick a safe tempo or a stretch tempo — not both in one take',
      'Write BPM on chart in large numbers'
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
    theoryBite: 'Stay at practice tempo until error rate drops. Loyalty beats random speeding.',
    drills: [
      'Whole session loyal to practice BPM',
      'If clean, tiny +2 BPM at end optional',
      'No random tempo jumps mid-section — finish what you started',
      'Log the ending BPM you can play cleanly today'
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
    theoryBite: 'On take day, pick a courageous-but-kind tempo and commit without mid-song renegotiation.',
    drills: [
      'Choose performance BPM before the take',
      'Count-in at that BPM out loud, then play — no mystery starts',
      'No mid-song tempo arguments with yourself',
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
      'Allow up to 2 visible errors without stopping',
      'Practice finishing the phrase anyway after a small mistake',
      'Score recovery quality separately from note perfection',
      'Keep a take that finished strong'
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
    theoryBite: 'A smile and exhale resets nervous system tempo. Build it into sticky moments.',
    drills: [
      'At sticky bar, exhale and slight smile on purpose',
      'Rehearse smile reset 10 times on that bar',
      'Notice tempo calms when jaw softens',
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
    theoryBite: 'Know where tab/chart, pick, and water live. Minimal plots reduce panic searches.',
    drills: [
      'Place chart, pick, water in consistent spots',
      'Rehearse grabbing pick without looking',
      'Remove trip hazards in practice space',
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
      'Don\'t skip checklist before dress runs'
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
    theoryBite: 'Tune with intention before takes. Quick checks between songs save public wince.',
    drills: [
      'Play the full tune once at the start as a baseline',
      'Quick check after vigorous sections',
      'Listen for the string that usually drifts',
      'Never accept \'close enough\' before a keep take'
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
    theoryBite: 'Estimate song lengths including talk. Timing math prevents cutting the closer.',
    drills: [
      'Estimate each song length at performance tempo',
      'Add 10–20s talk/tune buffer between songs',
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
    theoryBite: 'Plan encore if energy remains; otherwise bow out strong. Decided endings feel pro.',
    drills: [
      'Decide encore song or decide none',
      'If encore, keep it easy and beloved',
      'Practice a small bow and exit whether the take was good or messy',
      'Avoid undecided hovering endings'
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
    theoryBite: 'Two songs back-to-back train the seams: tune, take a breath, count in, and go without freezing.',
    drills: [
      'Run song A all the way through without stopping',
      'Take 60 seconds to tune, breathe, and set posture',
      'Run song B all the way through without stopping',
      'Notes on transition friction only'
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
      'Run three songs with short resets',
      'Watch stamina on song 3 — if the hand dies, simplify the part, do not push through trash',
      'If song 3 collapses, simplify it',
      'Log total focused minutes for this session'
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
    theoryBite: 'Full runs with chart allowed still require musical continuity and recovery.',
    drills: [
      'Full song with the chart allowed — aim for musical, not heroic',
      'No stopping for anything but safety',
      'Circle only bars that truly needed eyes',
      'Schedule memory work on those bars tomorrow'
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
    theoryBite: 'Memory runs expose cue gaps. Mark only the true danger spots afterward — not every imperfect bar.',
    drills: [
      'Chart face down or app closed — memory run, gentle tempo',
      'Full run with recovery rules on — no shame stops mid-song',
      'Afterward, reopen chart and mark danger spots',
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
      'Limited second take only if technical failure',
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
    theoryBite: 'Light days protect hands. Touch the starts and endings; avoid grinding mistakes.',
    drills: [
      'Touch intros and endings only — leave middles for later',
      'Light hands, short minutes — protect the hands before show day',
      'Hydrate and stretch fretting hand for thirty seconds',
      'No grinding sticky bars into fear'
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
    theoryBite: 'Capstone A prioritizes section quality and form clarity over full-set bravado.',
    drills: [
      'Run each section of vehicle song for quality',
      'Don\'t require full set stamina yet',
      'Score sections 1–5 honestly on paper — no grade inflation',
      'Pick lowest section for extra loops'
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
      'Only seams and transitions today',
      'Intro, section links, ending, song-to-song if multi',
      'Do ten slow reps on each hard seam change',
      'Full song once to verify seams hold'
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
      'Full story run with recovery rules',
      'Record the take if possible and keep the best one',
      'After the take, three kind pencil notes — one keep, one fix, one try tomorrow',
      'Protect hands after — you\'re close to capstone'
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
      'Play a mini-set that shows groove, lead taste, and finished song sections',
      'Recover from one mistake without stopping time',
      'Journal a kind next-30-day intention with one skill, one song, and one habit'
    ],
    theoryBite: 'This year capstone is proof you can finish something real over a long stretch — not the end of learning. Celebrate completion; plan the next arc with the same small-win method that built this year.',
    drills: [
      'Light warm-up: open strings, one easy fragment, shoulders soft',
      'Capstone mini-set take aiming keepable (performance rules)',
      'Listen once with kindness and once with a pencil',
      'Write next-arc intention: one skill, one song, one habit'
    ],
    libraryIds: [
      'sg-amazing-grace',
      'sg-danny-boy-londonderry-air',
      'pr-145'
    ],
    masteryCheck: 'Deliver a capstone mini-set showing groove, lead taste, and finished sections — then write your next 30-day intention.',
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
