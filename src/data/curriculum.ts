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
      'Build G one finger at a time',
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
      'G–C–G–C at a walking tempo',
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
      'G–C–D–G loop four times; keep it slow and clean on Triangle + Campfire Set',
      'Soft down-up strums on D only'
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
      'Am–E changes at 60 BPM; keep it slow and clean on Shape Family',
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
      'Muted D-D-D-D for 60 seconds',
      'D-DU-D-DU on G for 8 bars',
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
      'A–D–E–A twice slowly; keep it slow and clean on A–D–E Starter Set',
      'A vs Am toggle on a steady beat'
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
      'Spider on B and high E only',
      'Add the G string when it’s even',
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
      'E5 at open/2, then at frets 3/5',
      'Palm-mute downstroke eighths',
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
      'G–C isolation for two minutes',
      'C–D isolation for two minutes'
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
      'Muted groove for one minute',
      'G–C–D with the foot locked'
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
      'D | Dm | D | Dm slow; keep it slow and clean on Major vs Minor Ears',
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
      'Freeze G7, then resolve to C',
      'Freeze D7, then resolve to G',
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
      'Shake out every 30 seconds'
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
      'Hum → hunt → check, five times',
      'Change the starting pitch once',
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
    theoryBite: 'Great rhythm guitar is half silence. Mutes turn strums into drums.',
    drills: [
      'Palm-muted open low-E eighths near the bridge',
      'Chuck on the &s between chords',
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
      'Cell | Em | cell | G; keep it slow and clean on Combine Melody + Two Chords',
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
      'Chord hits on beat 1 only',
      'Hits on 1 and 3 for 8 bars',
      'Full quarters at 65 BPM; keep it slow and clean on Metronome as Friend'
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
      'Ugly-chord gym for five minutes',
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
      'Run a quick posture checklist',
      'Play four minutes, break thirty seconds, repeat',
      'Note any hotspots in your phone'
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
      'Core six parade: Em G C D Am E',
      'Choose G–C or C–D as week focus',
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
      'G→C in half notes ×16; keep it slow and clean on Change Lab',
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
      'C→D in half notes ×16; keep it slow and clean on Change Lab',
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
      'D→Em in half notes ×16; keep it slow and clean on Change Lab',
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
      'Em→Am in half notes ×16; keep it slow and clean on Change Lab',
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
      'Am→E in half notes ×16; keep it slow and clean on Change Lab',
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
      'E→A in half notes ×16; keep it slow and clean on Change Lab',
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
      'A→D in half notes ×16; keep it slow and clean on Change Lab',
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
      'G→Em in half notes ×16; keep it slow and clean on Change Lab',
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
      'C→Am in half notes ×16; keep it slow and clean on Change Lab',
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
      'G→D in half notes ×16; keep it slow and clean on Change Lab',
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
      'C–Fmaj7 slow changes; keep it slow and clean on Barre Without Tears',
      'Pop loop C–Am–Fmaj7–G; keep it slow and clean on Barre Without Tears'
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
      'Barre chirps 1 minute; keep it slow and clean on Strength + Mercy',
      'F for 4 strums, rest, repeat',
      'Swap Fmaj7 when form collapses'
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
      'Bm string audit low to high',
      'Bm–G–D–A half-time groove'
    ],
    libraryIds: [
      'ch-em',
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
    theoryBite: 'CAGED maps five chord shapes up the neck.',
    drills: [
      'Open C arpeggio slow; keep it slow and clean on C Shape Home',
      'Library CAGED C riff once',
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
      'Melody doodle on G string only'
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
      'One chorus chords only; keep it slow and clean on Count the Story',
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
      'Bass note emphasis on beat 1',
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
      'Dm–G7–C ballad tempo; keep it slow and clean on ii–V–I in C',
      'Loop Am–Dm–G7–C four times with steady time',
      'Light swing optional; keep it slow and clean on ii–V–I in C'
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
      'Record bass-heavy take; keep it slow and clean on Bass Motion Without New Shapes'
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
    theoryBite: 'Diagnosis before speed. Pros still pluck-audit when a chord turns to mud.',
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
    theoryBite: 'Boom-chuck separates bass and chord — instant style without new harmony.',
    drills: [
      'Open-G boom-chuck 1 minute',
      'Add C and D chords into the loop with clean changes',
      'Keep arm loose like a soft drum'
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
      'Muted & chops 1 minute; keep it slow and clean on Upbeat Chops',
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
      'Sing a higher comfortable note',
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
      'C with high E open/1/3 options',
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
      'Identify stickiest two chords',
      'Isolate the sticky bar for two focused minutes',
      '4-bar context insert; keep it slow and clean on Worst Two Bars Only'
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
      'Start changes at half note pace',
      'Step to quarters only after clean',
      'Never skip the clean rung'
    ],
    theoryBite: 'Tempo ladders respect how your hands learn: accuracy is the gateway; speed is a side effect.',
    drills: [
      '2 minutes half-note changes',
      '1 minute quarters if clean',
      'Back down if dead notes return'
    ],
    libraryIds: [
      'pr-145',
      'pr-1645'
    ],
    masteryCheck: 'Show the fastest tempo today where changes stay ≥90% clean.',
  },
  61: {

    title: 'Groove First — Chords as Drums',
    durationMin: 30,
    goals: [
      'Mute progression as pure rhythm',
      'Add fretting only after groove locks',
      'Match foot to right hand'
    ],
    theoryBite: 'If the right hand is unsure, fretting hand panic rises. Groove-first order reduces brain load.',
    drills: [
      'Muted progression 1 minute',
      'Frets on, same right hand',
      'Check shoulders for climb'
    ],
    libraryIds: [
      'pr-6251'
    ],
    masteryCheck: 'Play 60 seconds where groove would still work with fretting hand removed.',
  },
  62: {

    title: 'Ear Harmony — Guess the Next Chord 5 · Focus G/AM',
    durationMin: 30,
    goals: [
      'Play I and pause',
      'Sing what you want next',
      'Find it among known shapes'
    ],
    theoryBite: 'Predicting harmony builds inner hearing — the skill behind jamming with humans.',
    drills: [
      'Play G then the mystery chord and name the color out loud',
      'Limit options to C D Em Am',
      'Confirm by consonance; keep it slow and clean on Guess the Next Chord 5'
    ],
    libraryIds: [
      'pr-145'
    ],
    masteryCheck: 'Correctly predict and play the next chord three times in a row in a simple loop.',
  },
  63: {

    title: 'Soft Hands Day — Tension Audit 5 · Focus D/E',
    durationMin: 35,
    goals: [
      'Rate fretting pressure 1–10',
      'Drop one full point and re-test tone',
      'Keep tone with less squeeze'
    ],
    theoryBite: 'Excess grip is the silent beginner tax. Tone often survives — and improves — with less force.',
    drills: [
      'Squeeze scale on one chord',
      'Find minimum viable pressure',
      'Progression at that pressure'
    ],
    libraryIds: [
      'pr-12bar'
    ],
    masteryCheck: 'Play a progression at noticeably lower grip without losing core chord tones.',
  },
  64: {

    title: 'Song Transfer — Chords Into a PD Melody Day 5 · Focus EM/A',
    durationMin: 30,
    goals: [
      'Pick a library melody you know',
      'Companion it with two chords',
      'Alternate melody and comping'
    ],
    theoryBite: 'Transfer proves learning. Melodies + chords in one sitting mirror real guitar roles.',
    drills: [
      'Play the melody phrase twice, breathing between takes',
      'Answer the melody with two chord hits on the downbeats',
      'Trade every two bars; keep it slow and clean on Chords Into a PD Melody'
    ],
    libraryIds: [
      'pr-1645'
    ],
    masteryCheck: 'Play a 8+ bar trade between melody fragments and chord answers.',
  },
  65: {

    title: 'Weekly Chord Checkpoint 5 · Focus AM/F',
    durationMin: 30,
    goals: [
      'Run core progression medley',
      'Include one stretch chord (F/Bm/7th)',
      'Record a take worth keeping'
    ],
    theoryBite: 'Weekly retrieval practice strengthens memory more than massed cramming — make it musical.',
    drills: [
      '3-minute medley plan; keep it slow and clean on Weekly Chord Checkpoint 5',
      'Record one full take without stopping mid-form',
      'Note one win + one target'
    ],
    libraryIds: [
      'pr-andalu'
    ],
    masteryCheck: 'Produce a recorded take that includes at least five different chord qualities/shapes.',
  },
  66: {

    title: 'Chord Color Week 6 — Suspension Taste · Focus E/BM',
    durationMin: 30,
    goals: [
      'Add a simple sus flavor by lifting one finger briefly',
      'Return to the triad so tension resolves',
      'Keep time while coloring'
    ],
    theoryBite: 'Suspensions delay chord tones — even a lifted finger creates pro motion without new theory charts.',
    drills: [
      'Choose one easy open chord',
      'Lift/replace a finger on & of 4',
      'Resolve on beat 1 of next bar'
    ],
    libraryIds: [
      'pr-6251'
    ],
    masteryCheck: 'Create three intentional sus-and-resolve moments inside a steady progression.',
  },
  67: {

    title: 'Change Speed Ladder — Week 6 · Focus A/C7',
    durationMin: 30,
    goals: [
      'Start changes at half note pace',
      'Step to quarters only after clean',
      'Never skip the clean rung (Change Speed Ladder — Week 6 · Focus A/C7)'
    ],
    theoryBite: 'Tempo ladders respect how your hands learn: accuracy is the gateway; speed is a side effect (Week 6).',
    drills: [
      '2 minutes half-note changes',
      '1 minute quarters if clean',
      'Back down if dead notes return (Change Speed Ladder — Week 6 · Focus A/C7)'
    ],
    libraryIds: [
      'ch-c7'
    ],
    masteryCheck: 'Show the fastest tempo today where changes stay ≥90% clean (Week 6).',
  },
  68: {

    title: 'Groove First — Chords as Drums (2)',
    durationMin: 30,
    goals: [
      'Mute progression as pure rhythm',
      'Add fretting only after groove locks',
      'Match foot to right hand (Groove First — Chords as Drums 6.2 · Focus F/G7)'
    ],
    theoryBite: 'If the right hand is unsure, fretting hand panic rises. Groove-first order reduces brain load (Chords as Drums).',
    drills: [
      'Muted progression 1 minute',
      'Frets on, same right hand',
      'Check shoulders for climb (Groove First — Chords as Drums 6.2 · Focus F/G7)'
    ],
    libraryIds: [
      'ch-g7'
    ],
    masteryCheck: 'Play 60 seconds where groove would still work with fretting hand removed (Chords as Drums).',
  },
  69: {

    title: 'Ear Harmony — Guess the Next Chord 6 · Focus BM/D7',
    durationMin: 30,
    goals: [
      'Play I and pause',
      'Sing what you want next',
      'Find it among known shapes (Ear Harmony — Guess the Next Chord 6 · Focus BM/D7)'
    ],
    theoryBite: 'Predicting harmony builds inner hearing — the skill behind jamming with humans (Guess the Next Chord 6).',
    drills: [
      'Play G then the mystery chord and name the color out loud',
      'Limit options to C D Em Am',
      'Confirm by consonance (Ear Harmony — Guess the Next Chord 6 · Focus BM/D7)'
    ],
    libraryIds: [
      'ch-d7'
    ],
    masteryCheck: 'Correctly predict and play the next chord three times in a row in a simple loop (Guess the Next Chord 6).',
  },
  70: {

    title: 'Soft Hands Day — Tension Audit 6 · Focus C7/A7',
    durationMin: 35,
    goals: [
      'Rate fretting pressure 1–10',
      'Drop one full point and re-test tone',
      'Keep tone with less squeeze (Soft Hands Day — Tension Audit 6 · Focus C7/A7)'
    ],
    theoryBite: 'Excess grip is the silent beginner tax. Tone often survives — and improves — with less force (Tension Audit 6).',
    drills: [
      'Squeeze scale on one chord',
      'Find minimum viable pressure',
      'Progression at that pressure (Soft Hands Day — Tension Audit 6 · Focus C7/A7)'
    ],
    libraryIds: [
      'ch-a7'
    ],
    masteryCheck: 'Play a progression at noticeably lower grip without losing core chord tones (Tension Audit 6).',
  },
  71: {

    title: 'Song Transfer — Chords Into a PD Melody Day 6 · Focus G7/E7',
    durationMin: 30,
    goals: [
      'Pick a library melody you know',
      'Companion it with two chords',
      'Alternate melody and comping (Song Transfer — Chords Into a PD Melody · Focus G7/E7)'
    ],
    theoryBite: 'Transfer proves learning. Melodies + chords in one sitting mirror real guitar roles (Chords Into a PD Melody).',
    drills: [
      'Play the melody phrase twice, breathing between takes',
      'Answer the melody with two chord hits on the downbeats',
      'Trade every two bars (Song Transfer — Chords Into a PD Melody · Focus G7/E7)'
    ],
    libraryIds: [
      'ch-g7',
      'ch-e7'
    ],
    masteryCheck: 'Play a 8+ bar trade between melody fragments and chord answers (Chords Into a PD Melody).',
  },
  72: {

    title: 'Weekly Chord Checkpoint 6 · Focus D7/DM',
    durationMin: 30,
    goals: [
      'Run core progression medley',
      'Include one stretch chord (F/Bm/7th)',
      'Record a take worth keeping (Weekly Chord Checkpoint 6 · Focus D7/DM)'
    ],
    theoryBite: 'Weekly retrieval practice strengthens memory more than massed cramming — make it musical (Weekly Chord Checkpoint 6).',
    drills: [
      '3-minute medley plan; keep it slow and clean on Weekly Chord Checkpoint 6',
      'Record one full take without stopping mid-form',
      'Note one win + one target (Weekly Chord Checkpoint 6 · Focus D7/DM)'
    ],
    libraryIds: [
      'ch-d7'
    ],
    masteryCheck: 'Produce a recorded take that includes at least five different chord qualities/shapes (Weekly Chord Checkpoint 6).',
  },
  73: {

    title: 'Chord Color Week 7 — Suspension Taste · Focus A7/C',
    durationMin: 30,
    goals: [
      'Add a simple sus flavor by lifting one finger briefly',
      'Return to the triad so tension resolves',
      'Keep time while coloring (Chord Color Week 7 — Suspension Taste · Focus A7/C)'
    ],
    theoryBite: 'Suspensions delay chord tones — even a lifted finger creates pro motion without new theory charts (Suspension Taste).',
    drills: [
      'Choose one easy open chord',
      'Lift/replace a finger on & of 4',
      'Resolve on beat 1 of next bar (Chord Color Week 7 — Suspension Taste · Focus A7/C)'
    ],
    libraryIds: [
      'ch-a7'
    ],
    masteryCheck: 'Create three intentional sus-and-resolve moments inside a steady progression (Suspension Taste).',
  },
  74: {

    title: 'Change Speed Ladder — Week 7 · Focus E7/G',
    durationMin: 30,
    goals: [
      'Start changes at half note pace',
      'Step to quarters only after clean',
      'Never skip the clean rung (Change Speed Ladder — Week 7 · Focus E7/G)'
    ],
    theoryBite: 'Tempo ladders respect how your hands learn: accuracy is the gateway; speed is a side effect (Week 7).',
    drills: [
      '2 minutes half-note changes',
      '1 minute quarters if clean',
      'Back down if dead notes return (Change Speed Ladder — Week 7 · Focus E7/G)'
    ],
    libraryIds: [
      'ch-e7'
    ],
    masteryCheck: 'Show the fastest tempo today where changes stay ≥90% clean (Week 7).',
  },
  75: {

    title: 'Groove First — Chords as Drums (3)',
    durationMin: 30,
    goals: [
      'Mute progression as pure rhythm',
      'Add fretting only after groove locks',
      'Match foot to right hand (Groove First — Chords as Drums 7.2 · Focus DM/D)'
    ],
    theoryBite: 'If the right hand is unsure, fretting hand panic rises. Groove-first order reduces brain load (Chords as Drums) (Chords as Drums day 3).',
    drills: [
      'Muted progression 1 minute',
      'Frets on, same right hand',
      'Check shoulders for climb (Groove First — Chords as Drums 7.2 · Focus DM/D)'
    ],
    libraryIds: [
      'ch-dm'
    ],
    masteryCheck: 'Play 60 seconds where groove would still work with fretting hand removed (Chords as Drums) (Chords as Drums day 3).',
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
      'End every phrase on A; keep it slow and clean on Maps for Music',
      'One-minute 3-note story; keep it slow and clean on Maps for Music'
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
      'Slow box with metronome; keep it slow and clean on Even Tone',
      'Accent only beat 1 roots',
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
      '123 234 345 pattern slow',
      '1234 2345 pattern slow; keep it slow and clean on 3s and 4s',
      'Resolve to root after each pass'
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
      'G major pent up/down; keep it slow and clean on Bright Twin',
      'Same notes resolving to E',
      'Call dark, answer bright'
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
      'Full box but end on chord tones'
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
      'Degrees on the way up; keep it slow and clean on Seven-Note Map in G',
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
      'Remove to pent and compare',
      'Phrase using b6 on purpose once'
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
      'Find raised 6 relative to Dm',
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
      'Resolve phrases to E; keep it slow and clean on Flat 2 Drama'
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
      'C or F lydian fragment; keep it slow and clean on Raised',
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
    theoryBite: 'Conversation beats continuous notes. Rests are musical confidence.',
    drills: [
      'Play a two-bar question phrase, then leave space',
      'Rest one full bar, then re-enter cleanly on beat 1',
      'Answer 2 bars — 4 cycles'
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
      'Roots only through progression',
      'Play roots and thirds only through the progression',
      'Add pent connector notes'
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
      '3rd pattern through pent',
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
      'Fragment around leading tone',
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
      'Riff only inside cage 2 minutes',
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
      'Second take with more space'
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
      'Pent story 8 bars',
      'One modal or major scale color',
      'Resolve everything home'
    ],
    theoryBite: 'Checkpoints retrieve multiple skills in one performance — stronger memory than isolated drills.',
    drills: [
      'Warm up with minor pentatonic box 1 slowly',
      'Play the color section once soft and once fuller',
      'Do one final landing take as if it\'s the show'
    ],
    libraryIds: [
      'sc-major',
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'Play a short multi-color take that still feels like one piece of music.',
  },
  97: {

    title: 'Neck Geography — Root Finder Drill',
    durationMin: 30,
    goals: [
      'Find today’s root on at least three strings',
      'Pulse each root on beat 1',
      'Connect roots with scale steps'
    ],
    theoryBite: 'Root awareness is the difference between wandering and soloing. Map first, decorate second.',
    drills: [
      'Root hunt low to high; keep it slow and clean on Root Finder Drill',
      'Jump root octaves cleanly on beats 1 and 3',
      'Scale path between two roots'
    ],
    libraryIds: [
      'rf-drop-d-power-study'
    ],
    masteryCheck: 'Hit three different-string roots in time within one position neighborhood.',
  },
  98: {

    title: 'Phrase Gym — Copy → Vary → Own',
    durationMin: 35,
    goals: [
      'Learn a 4-note library motif',
      'Vary rhythm only',
      'Vary ending note only'
    ],
    theoryBite: 'Imitation with constrained variation is how oral traditions and great players train vocabulary.',
    drills: [
      'Copy the motif four times before changing a note',
      'Play four rhythm variants of the same chord loop',
      'Practice the new ending four times at performance tempo'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Show the motif, one rhythm variant, and one ending variant in a single take.',
  },
  99: {

    title: 'Metronome Subdivision — Scale Eighths',
    durationMin: 30,
    goals: [
      'Align scale notes to eighths',
      'Then only quarters if rushing',
      'Record 20 seconds for honesty'
    ],
    theoryBite: 'Subdivisions expose whether fingers or time is leading. Time should lead.',
    drills: [
      'Play steady eighths with the metronome click locked',
      'Downshift the tempo immediately if notes get messy',
      'Listen back once and note one fix for next take'
    ],
    libraryIds: [
      'rf-power'
    ],
    masteryCheck: 'Play one octave in steady eighths that would pass a kind click test.',
  },
  100: {

    title: 'Mode Mood Board — A/B Day',
    durationMin: 30,
    goals: [
      'Contrast sc-lydian against sc-locrian colors',
      'Use the same rhythm skeleton',
      'Name the mood in one adjective each'
    ],
    theoryBite: 'Modes are moods with rules. Hearing two modes back to back teaches faster than reading about them.',
    drills: [
      'Rhythm skeleton on open strings',
      'Apply mode A tones over the vamp for 8 bars',
      'Apply mode B same rhythm'
    ],
    libraryIds: [
      'rf-blues-sh'
    ],
    masteryCheck: 'Play the same rhythm in two modal colors and name each mood.',
  },
  101: {

    title: 'Scale → Riff Extraction',
    durationMin: 30,
    goals: [
      'Improv 1 minute',
      'Circle one accidental cool bar',
      'Repeat that bar until it\'s a riff'
    ],
    theoryBite: 'Riffs are frozen luck. Capture and repeat — composition skill for lead players.',
    drills: [
      'Loop the riff eight times at a steady tempo',
      'Slow loop working on Scale → Riff Extraction with a metronome you trust',
      'Slow loop working on Scale → Riff Extraction with a metronome you trust'
    ],
    libraryIds: [
      'rf-a-blues-turnaround-study'
    ],
    masteryCheck: 'Leave with a 1- or 2-bar riff you can repeat from memory five times.',
  },
  102: {

    title: 'Chord-Scale Match Briefing',
    durationMin: 30,
    goals: [
      'Play ch-d7 as harmony home',
      'Choose scale notes that agree',
      'Avoid clashing long tones on purpose later'
    ],
    theoryBite: 'Matching scale to chord is applied theory. Long notes must agree; passing notes may color.',
    drills: [
      'Loop a two-chord vamp for 8 bars with steady time',
      'Hold long tones on each target note for two beats',
      'Add passing-tone runs between chord tones slowly'
    ],
    libraryIds: [
      'rf-spanish-e-phrygian-study'
    ],
    masteryCheck: 'Hold three long tones over the chord that all sound intentional.',
  },
  103: {

    title: 'Weekly Scales Checkpoint (2)',
    durationMin: 30,
    goals: [
      'Pent story 8 bars',
      'One modal or major scale color',
      'Resolve everything home (Weekly Scales Checkpoint day 103)'
    ],
    theoryBite: 'Checkpoints retrieve multiple skills in one performance — stronger memory than isolated drills (Weekly Scales Checkpoint).',
    drills: [
      'Warm up with minor pentatonic box 1 slowly',
      'Play the color section once soft and once fuller',
      'Final landing take (Weekly Scales Checkpoint day 103)'
    ],
    libraryIds: [
      'rf-jazz-chromatic-approach-study'
    ],
    masteryCheck: 'Play a short multi-color take that still feels like one piece of music (Weekly Scales Checkpoint).',
  },
  104: {

    title: 'Neck Geography — Root Finder Drill (2)',
    durationMin: 30,
    goals: [
      'Find today’s root on at least three strings',
      'Pulse each root on beat 1',
      'Connect roots with scale steps (Neck Geography — Root Finder Drill day 104)'
    ],
    theoryBite: 'Root awareness is the difference between wandering and soloing. Map first, decorate second (Root Finder Drill).',
    drills: [
      'Root hunt low to high; keep it slow and clean on Root Finder Drill day 2',
      'Jump root octaves cleanly on beats 1 and 3',
      'Scale path between two roots (Neck Geography — Root Finder Drill day 104)'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Hit three different-string roots in time within one position neighborhood (Root Finder Drill).',
  },
  105: {

    title: 'Phrase Gym — Copy → Vary → Own (2)',
    durationMin: 35,
    goals: [
      'Learn a 4-note library motif',
      'Vary rhythm only',
      'Vary ending note only (Phrase Gym — Copy → Vary → Own day 105)'
    ],
    theoryBite: 'Imitation with constrained variation is how oral traditions and great players train vocabulary (Copy → Vary → Own).',
    drills: [
      'Copy the motif four times before changing a note',
      'Play four rhythm variants of the same chord loop',
      'New ending 4× (Phrase Gym — Copy → Vary → Own day 105)'
    ],
    libraryIds: [
      'rf-spider'
    ],
    masteryCheck: 'Show the motif, one rhythm variant, and one ending variant in a single take (Copy → Vary → Own).',
  },
  106: {

    title: 'Metronome Subdivision — Scale Eighths (2)',
    durationMin: 30,
    goals: [
      'Align scale notes to eighths',
      'Then only quarters if rushing',
      'Record 20 seconds for honesty (Metronome Subdivision — Scale Eighths day 106)'
    ],
    theoryBite: 'Subdivisions expose whether fingers or time is leading. Time should lead (Scale Eighths).',
    drills: [
      'Play steady eighths with the metronome click locked',
      'Downshift the tempo immediately if notes get messy',
      'Listen back once (Metronome Subdivision — Scale Eighths day 106)'
    ],
    libraryIds: [
      'rf-blues-sh'
    ],
    masteryCheck: 'Play one octave in steady eighths that would pass a kind click test (Scale Eighths).',
  },
  107: {

    title: 'Mode Mood Board — A/B Day (2)',
    durationMin: 30,
    goals: [
      'Contrast sc-nat-min against sc-mel-min colors',
      'Use the same rhythm skeleton',
      'Name the mood in one adjective each'
    ],
    theoryBite: 'Modes are moods with rules. Hearing two modes back to back teaches faster than reading about them (A/B Day).',
    drills: [
      'Rhythm skeleton on open strings',
      'Apply mode A tones over the vamp for 8 bars',
      'Apply mode B same rhythm (Mode Mood Board — A/B Day day 107)'
    ],
    libraryIds: [
      'rf-caged-c'
    ],
    masteryCheck: 'Play the same rhythm in two modal colors and name each mood (A/B Day).',
  },
  108: {

    title: 'Scale → Riff Extraction (2)',
    durationMin: 30,
    goals: [
      'Improv 1 minute',
      'Circle one accidental cool bar',
      'Repeat that bar until it\'s a riff (Scale → Riff Extraction day 108)'
    ],
    theoryBite: 'Riffs are frozen luck. Capture and repeat — composition skill for lead players (Scale → Riff Extraction).',
    drills: [
      'Riff loop 8× (Scale → Riff Extraction day 108)',
      'Slow loop working on Scale → Riff Extraction day 108 with a metronome you trust',
      'Slow loop working on Scale → Riff Extraction day 108 with a metronome you trust'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Leave with a 1- or 2-bar riff you can repeat from memory five times (Scale → Riff Extraction).',
  },
  109: {

    title: 'Chord-Scale Match Briefing (2)',
    durationMin: 30,
    goals: [
      'Play ch-em as harmony home',
      'Choose scale notes that agree',
      'Avoid clashing long tones on purpose later'
    ],
    theoryBite: 'Matching scale to chord is applied theory. Long notes must agree; passing notes may color (Chord-Scale Match Briefing).',
    drills: [
      'Loop a two-chord vamp for 8 bars with steady time',
      'Hold long tones on each target note for two beats',
      'Passing tone runs (Chord-Scale Match Briefing day 109)'
    ],
    libraryIds: [
      'rf-funk-chicka-study'
    ],
    masteryCheck: 'Hold three long tones over the chord that all sound intentional (Chord-Scale Match Briefing).',
  },
  110: {

    title: 'Weekly Scales Checkpoint (3)',
    durationMin: 30,
    goals: [
      'Pent story 8 bars',
      'One modal or major scale color',
      'Resolve everything home (Weekly Scales Checkpoint day 110)'
    ],
    theoryBite: 'Checkpoints retrieve multiple skills in one performance — stronger memory than isolated drills (Weekly Scales Checkpoint) (Weekly Scales Checkpoint day 3).',
    drills: [
      'Warm up with minor pentatonic box 1 slowly',
      'Play the color section once soft and once fuller',
      'Final landing take (Weekly Scales Checkpoint day 110)'
    ],
    libraryIds: [
      'sc-pent-min',
      'rf-am-arpeggio-cascade'
    ],
    masteryCheck: 'Play a short multi-color take that still feels like one piece of music (Weekly Scales Checkpoint) (Weekly Scales Checkpoint day 3).',
  },
  111: {

    title: 'Neck Geography — Root Finder Drill (3)',
    durationMin: 30,
    goals: [
      'Find today’s root on at least three strings',
      'Pulse each root on beat 1',
      'Connect roots with scale steps (Neck Geography — Root Finder Drill day 111)'
    ],
    theoryBite: 'Root awareness is the difference between wandering and soloing. Map first, decorate second (Root Finder Drill) (Root Finder Drill day 3).',
    drills: [
      'Root hunt low to high; keep it slow and clean on Root Finder Drill day 3',
      'Jump root octaves cleanly on beats 1 and 3',
      'Scale path between two roots (Neck Geography — Root Finder Drill day 111)'
    ],
    libraryIds: [
      'rf-natural-harmonics-study'
    ],
    masteryCheck: 'Hit three different-string roots in time within one position neighborhood (Root Finder Drill) (Root Finder Drill day 3).',
  },
  112: {

    title: 'Phrase Gym — Copy → Vary → Own (3)',
    durationMin: 35,
    goals: [
      'Learn a 4-note library motif',
      'Vary rhythm only',
      'Vary ending note only (Phrase Gym — Copy → Vary → Own day 112)'
    ],
    theoryBite: 'Imitation with constrained variation is how oral traditions and great players train vocabulary (Copy → Vary → Own) (Copy → Vary → Own day 3).',
    drills: [
      'Copy the motif four times before changing a note',
      'Play four rhythm variants of the same chord loop',
      'New ending 4× (Phrase Gym — Copy → Vary → Own day 112)'
    ],
    libraryIds: [
      'rf-open-am'
    ],
    masteryCheck: 'Show the motif, one rhythm variant, and one ending variant in a single take (Copy → Vary → Own) (Copy → Vary → Own day 3).',
  },
  113: {

    title: 'Metronome Subdivision — Scale Eighths (3)',
    durationMin: 30,
    goals: [
      'Align scale notes to eighths',
      'Then only quarters if rushing',
      'Record 20 seconds for honesty (Metronome Subdivision — Scale Eighths day 113)'
    ],
    theoryBite: 'Subdivisions expose whether fingers or time is leading. Time should lead (Scale Eighths) (Scale Eighths day 3).',
    drills: [
      'Play steady eighths with the metronome click locked',
      'Downshift the tempo immediately if notes get messy',
      'Listen back once (Metronome Subdivision — Scale Eighths day 113)'
    ],
    libraryIds: [
      'rf-caged-c'
    ],
    masteryCheck: 'Play one octave in steady eighths that would pass a kind click test (Scale Eighths) (Scale Eighths day 3).',
  },
  114: {

    title: 'Mode Mood Board — A/B Day (3)',
    durationMin: 30,
    goals: [
      'Contrast sc-phrygian against sc-mixo colors',
      'Use the same rhythm skeleton',
      'Name the mood in one adjective each'
    ],
    theoryBite: 'Modes are moods with rules. Hearing two modes back to back teaches faster than reading about them (A/B Day) (A/B Day day 3).',
    drills: [
      'Rhythm skeleton on open strings',
      'Apply mode A tones over the vamp for 8 bars',
      'Apply mode B same rhythm (Mode Mood Board — A/B Day day 114)'
    ],
    libraryIds: [
      'sc-mixo',
      'rf-open-g-roll-study'
    ],
    masteryCheck: 'Play the same rhythm in two modal colors and name each mood (A/B Day) (A/B Day day 3).',
  },
  115: {

    title: 'Scale → Riff Extraction (3)',
    durationMin: 30,
    goals: [
      'Improv 1 minute',
      'Circle one accidental cool bar',
      'Repeat that bar until it\'s a riff (Scale → Riff Extraction day 115)'
    ],
    theoryBite: 'Riffs are frozen luck. Capture and repeat — composition skill for lead players (Scale → Riff Extraction) (Scale → Riff Extraction day 3).',
    drills: [
      'Riff loop 8× (Scale → Riff Extraction day 115)',
      'Slow loop working on Scale → Riff Extraction day 115 with a metronome you trust',
      'Slow loop working on Scale → Riff Extraction day 115 with a metronome you trust'
    ],
    libraryIds: [
      'rf-c-bass-walk-study'
    ],
    masteryCheck: 'Leave with a 1- or 2-bar riff you can repeat from memory five times (Scale → Riff Extraction) (Scale → Riff Extraction day 3).',
  },
  116: {

    title: 'Chord-Scale Match Briefing (3)',
    durationMin: 30,
    goals: [
      'Play ch-g7 as harmony home',
      'Choose scale notes that agree',
      'Avoid clashing long tones on purpose later'
    ],
    theoryBite: 'Matching scale to chord is applied theory. Long notes must agree; passing notes may color (Chord-Scale Match Briefing) (Chord-Scale Match Briefing ().',
    drills: [
      'Loop a two-chord vamp for 8 bars with steady time',
      'Hold long tones on each target note for two beats',
      'Passing tone runs (Chord-Scale Match Briefing day 116)'
    ],
    libraryIds: [
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'Hold three long tones over the chord that all sound intentional (Chord-Scale Match Briefing) (Chord-Scale Match Briefing ().',
  },
  117: {

    title: 'Weekly Scales Checkpoint (4)',
    durationMin: 30,
    goals: [
      'Pent story 8 bars',
      'One modal or major scale color',
      'Resolve everything home (Weekly Scales Checkpoint day 117)'
    ],
    theoryBite: 'Checkpoints retrieve multiple skills in one performance — stronger memory than isolated drills (Weekly Scales Checkpoint) (Weekly Scales Checkpoint day 4).',
    drills: [
      'Warm up with minor pentatonic box 1 slowly',
      'Play the color section once soft and once fuller',
      'Final landing take (Weekly Scales Checkpoint day 117)'
    ],
    libraryIds: [
      'rf-drop-d-power-study'
    ],
    masteryCheck: 'Play a short multi-color take that still feels like one piece of music (Weekly Scales Checkpoint) (Weekly Scales Checkpoint day 4).',
  },
  118: {

    title: 'Neck Geography — Root Finder Drill (4)',
    durationMin: 30,
    goals: [
      'Find today’s root on at least three strings',
      'Pulse each root on beat 1',
      'Connect roots with scale steps (Neck Geography — Root Finder Drill day 118)'
    ],
    theoryBite: 'Root awareness is the difference between wandering and soloing. Map first, decorate second (Root Finder Drill) (Root Finder Drill day 4).',
    drills: [
      'Root hunt low to high; keep it slow and clean on Root Finder Drill day 4',
      'Jump root octaves cleanly on beats 1 and 3',
      'Scale path between two roots (Neck Geography — Root Finder Drill day 118)'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Hit three different-string roots in time within one position neighborhood (Root Finder Drill) (Root Finder Drill day 4).',
  },
  119: {

    title: 'Phrase Gym — Copy → Vary → Own (4)',
    durationMin: 35,
    goals: [
      'Learn a 4-note library motif',
      'Vary rhythm only',
      'Vary ending note only (Phrase Gym — Copy → Vary → Own day 119)'
    ],
    theoryBite: 'Imitation with constrained variation is how oral traditions and great players train vocabulary (Copy → Vary → Own) (Copy → Vary → Own day 4).',
    drills: [
      'Copy the motif four times before changing a note',
      'Play four rhythm variants of the same chord loop',
      'New ending 4× (Phrase Gym — Copy → Vary → Own day 119)'
    ],
    libraryIds: [
      'rf-power'
    ],
    masteryCheck: 'Show the motif, one rhythm variant, and one ending variant in a single take (Copy → Vary → Own) (Copy → Vary → Own day 4).',
  },
  120: {

    title: 'Scales Capstone — 16-Bar Pent Story',
    durationMin: 30,
    goals: [
      'Align scale notes to eighths',
      'Then only quarters if rushing',
      'Record 20 seconds for honesty (Scales Capstone — 16-Bar Pent Story)'
    ],
    theoryBite: 'Subdivisions expose whether fingers or time is leading. Time should lead (16-Bar Pent Story).',
    drills: [
      'Play steady eighths with the metronome click locked',
      'Downshift the tempo immediately if notes get messy',
      'Listen back once (Scales Capstone — 16-Bar Pent Story)'
    ],
    libraryIds: [
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Play one octave in steady eighths that would pass a kind click test (16-Bar Pent Story).',
  },
  121: {

    title: 'Rhythm Phase Open — Pocket Is the Skill',
    durationMin: 30,
    goals: [
      'Lock your foot to steady quarter notes before the hands get fancy',
      'Turn muted strums into a drum kit that never rushes',
      'Prove the groove still feels good when you add only one chord'
    ],
    theoryBite: 'People forgive simple harmony faster than shaky time. Pocket means your notes agree with the pulse. Steady and simple beats fancy and shaky.',
    drills: [
      'Foot quarters alone for 60 seconds at 70 BPM — no guitar',
      'Muted downstrokes on open strings, one per beat, 60 seconds',
      'Muted D-DU pattern for 60 seconds while counting 1 & 2 & 3 & 4 & aloud',
      'Add a single G chord only after 8 clean muted bars; stop if the pocket slips'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-spanish-e-phrygian-study'
    ],
    masteryCheck: 'Hold 32 bars of muted groove at 70 BPM with foot and hand locked, then add one chord without rushing.',
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
      'Map a 32-bar texture plan (sparse → full → sparse)',
      'Change right-hand density without changing tempo',
      'Treat arrangement as a practice skill, not only a studio skill'
    ],
    theoryBite: 'Texture is how many layers are talking at once. Good rhythm players shape with the right hand: low density vs full strums.',
    drills: [
      'Write a 32-bar map: 8 sparse, 8 medium, 8 full, 8 sparse',
      'Play the map on one chord only',
      'Play the map on a 3-chord loop',
      'Mark one bar that got busy too early and fix it'
    ],
    libraryIds: [
      'pr-6251',
      'rf-c-bass-walk-study'
    ],
    masteryCheck: 'Play the full 32-bar texture map once with tempo flat and density changes obvious.',
  },
  135: {

    title: 'Click Trust — Play Behind/On/Ahead',
    durationMin: 30,
    goals: [
      'Play on top of, with, and slightly behind the click on command',
      'Hear the click as a collaborator, not an enemy',
      'Return to \'with\' after exploring the edges'
    ],
    theoryBite: 'Time feel is where you place the notes. Behind feels heavier; ahead feels urgent. You need a click to hear the difference.',
    drills: [
      '8 bars dead on the click (muted)',
      '8 bars intentionally late (still even)',
      '8 bars intentionally early (still even)',
      '8 bars back on center — notice body tension differences'
    ],
    libraryIds: [
      'pr-145',
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'Label and Play on / behind / ahead for 8 bars each without losing the form of a simple vamp.',
  },
  136: {

    title: 'Dynamic Waves — Crescendo Strum',
    durationMin: 30,
    goals: [
      'Crescendo and decrescendo across multi-bar phrases',
      'Keep tempo flat while volume moves',
      'Use dynamics as storytelling inside one progression'
    ],
    theoryBite: 'Separating dynamics from tempo is real right-hand control. Most of us get louder by speeding up — break that link.',
    drills: [
      '4 bars soft→loud on muted strums with a click',
      '4 bars loud→soft immediately after',
      'Repeat with chords G–Em–C–D',
      'Friend test: can someone hear the wave with eyes closed?'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-drop-d-power-study'
    ],
    masteryCheck: 'Play an 8-bar dynamic wave (up then down) without speeding up or collapsing the groove.',
  },
  137: {

    title: 'Odd Accent — 5/4 Taste',
    durationMin: 30,
    goals: [
      'Count a simple 5/4 or 5-beat cycle without panic',
      'Loop a short riff that makes the odd meter feel natural',
      'Return to 4/4 cleanly so 4/4 feels even more solid'
    ],
    theoryBite: 'Odd meters train attention. Even a little 5/4 makes your 4/4 barlines feel more solid.',
    drills: [
      'Count 1-2-3-4-5 aloud with foot for 60 seconds',
      'Muted hit on 1 and 4 only in a 5-beat cycle',
      'Two-chord idea in 5: bar of A, bar of G feeling',
      'Play 8 bars of 4/4 afterward — notice the calm'
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
    theoryBite: 'Comp patterns are right-hand patterns you can reuse. Good accompanists repeat a clear idea instead of inventing chaos.',
    drills: [
      'Design a 2-bar pattern on paper (D = down, U = up,. = rest)',
      'Mute-Play it 8 times; keep it slow and clean on Two Rights, One Left',
      'Add G and C, two bars each, pattern continuous',
      'Sing nonsense syllables over it to test space'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-power'
    ],
    masteryCheck: 'Loop your 2-bar comp for 16 bars with chord changes and still-recognizable pattern identity.',
  },
  139: {

    title: 'Genre Day — Country Boom-Chuck Deepening',
    durationMin: 30,
    goals: [
      'Separate bass notes on beats 1 and 3 from higher chucks on 2 and 4',
      'Keep boom-chuck steady through chord changes',
      'Smile test: it should feel like a train, not a scramble'
    ],
    theoryBite: 'Bass / chord / bass / chord. Thumb and strum hand doing different jobs is the skill.',
    drills: [
      'Bass on open D/G strings beats 1 & 3 only for 60s',
      'Add light chucks on 2 & 4 muted',
      'G–C–D boom-chuck at walking tempo',
      'Remove chucks for 4 bars, bring back — pocket must stay'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'Play 16 bars of boom-chuck on a three-chord loop with clear bass vs chuck roles.',
  },
  140: {

    title: 'Genre Day — Rock Eighth Drive',
    durationMin: 35,
    goals: [
      'Drive straight eighths with consistent down-up energy',
      'Lean on power shapes or open chords without tensing the fretting hand',
      'Use palm mute as a chorus/verse texture switch'
    ],
    theoryBite: 'Rock eighth drive is stamina plus evenness. The story is usually density and mute color — not fancier chords.',
    drills: [
      'Straight eighth downs-ups muted 90 seconds',
      'Power-shape fretting with eighth drive 8 bars',
      'Verse mute / chorus open for a 16-bar form',
      'Check shoulders at bar 12 — drop them if high'
    ],
    libraryIds: [
      'pr-145',
      'rf-a-blues-turnaround-study'
    ],
    masteryCheck: 'Play a 16-bar verse/chorus mute story at steady eighths without rushing the chorus open.',
  },
  141: {

    title: 'Weekly Rhythm Checkpoint',
    durationMin: 30,
    goals: [
      'Combine pocket, one subdivision skill, and dynamics in one take',
      'Record evidence rather than trusting memory',
      'Name one keep and one fix afterward'
    ],
    theoryBite: 'Checkpoints convert practice into proof. A short recorded take plus a kind note beats vague \'I practiced rhythm.\'.',
    drills: [
      '60s pocket warm-up muted',
      '8 bars subdivision or accent focus',
      '8 bars dynamic wave on a progression',
      'Record a 16-bar medley of those skills; write keep/fix'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-spanish-e-phrygian-study'
    ],
    masteryCheck: 'Save one 16-bar take that shows steady time plus one expressive rhythm choice, with a written keep and fix.',
  },
  142: {

    title: 'Click Trust — Play Behind/On/Ahead (2)',
    durationMin: 30,
    goals: [
      'Play on top of, with, and slightly behind the click on command',
      'Hear the click as a collaborator, not an enemy',
      'Return to \'with\' after exploring the edges (Click Trust — Play Behind/On/Ahead day 142)'
    ],
    theoryBite: 'Time feel is where you place the notes. Behind feels heavier; ahead feels urgent. You need a click to hear the difference (Play Behind/On/Ahead).',
    drills: [
      '8 bars dead on the click (muted)',
      '8 bars intentionally late (still even)',
      '8 bars intentionally early (still even)',
      '8 bars back on center — notice body tension differences (Click Trust — Play Behind/On/Ahead day 142)'
    ],
    libraryIds: [
      'pr-1645',
      'rf-jazz-chromatic-approach-study'
    ],
    masteryCheck: 'Label and Play on / behind / ahead for 8 bars each without losing the form of a simple vamp (Play Behind/On/Ahead).',
  },
  143: {

    title: 'Dynamic Waves — Crescendo Strum (2)',
    durationMin: 30,
    goals: [
      'Crescendo and decrescendo across multi-bar phrases',
      'Keep tempo flat while volume moves',
      'Use dynamics as storytelling inside one progression (Dynamic Waves — Crescendo Strum day 143)'
    ],
    theoryBite: 'Separating dynamics from tempo is real right-hand control. Most of us get louder by speeding up — break that link (Crescendo Strum).',
    drills: [
      '4 bars soft→loud on muted strums with a click',
      '4 bars loud→soft immediately after',
      'Repeat with chords G–Em–C–D',
      'Friend test: can someone hear the wave with eyes closed? (Dynamic Waves — Crescendo Strum day 143)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Play an 8-bar dynamic wave (up then down) without speeding up or collapsing the groove (Crescendo Strum).',
  },
  144: {

    title: 'Odd Accent — 5/4 Taste (2)',
    durationMin: 30,
    goals: [
      'Count a simple 5/4 or 5-beat cycle without panic',
      'Loop a short riff that makes the odd meter feel natural',
      'Return to 4/4 cleanly so 4/4 feels even more solid (Odd Accent — 5/4 Taste day 144)'
    ],
    theoryBite: 'Odd meters train attention. Even a little 5/4 makes your 4/4 barlines feel more solid (5/4 Taste).',
    drills: [
      'Count 1-2-3-4-5 aloud with foot for 60 seconds',
      'Muted hit on 1 and 4 only in a 5-beat cycle',
      'Two-chord idea in 5: bar of A, bar of G feeling',
      'Play 8 bars of 4/4 afterward — notice the calm (Odd Accent — 5/4 Taste day 144)'
    ],
    libraryIds: [
      'pr-6251',
      'rf-spider'
    ],
    masteryCheck: 'Loop 8 cycles of a 5-beat groove you can count aloud while playing (5/4 Taste).',
  },
  145: {

    title: 'Comp Patterns — Two Rights, One Left (2)',
    durationMin: 30,
    goals: [
      'Build a two-bar comp pattern you could hand to a singer',
      'Balance low thumps and higher scratches',
      'Leave space for an imaginary vocal (Comp Patterns — Two Rights, One Left day 145)'
    ],
    theoryBite: 'Comp patterns are right-hand patterns you can reuse. Good accompanists repeat a clear idea instead of inventing chaos (Two Rights, One Left).',
    drills: [
      'Design a 2-bar pattern on paper (D = down, U = up,. = rest)',
      'Mute-Play it 8 times; keep it slow and clean on Two Rights, One Left day 2',
      'Add G and C, two bars each, pattern continuous',
      'Sing nonsense syllables over it to test space (Comp Patterns — Two Rights, One Left day 145)'
    ],
    libraryIds: [
      'pr-145',
      'rf-blues-sh'
    ],
    masteryCheck: 'Loop your 2-bar comp for 16 bars with chord changes and still-recognizable pattern identity (Two Rights, One Left).',
  },
  146: {

    title: 'Genre Day — Country Boom-Chuck Deepening (2)',
    durationMin: 30,
    goals: [
      'Separate bass notes on beats 1 and 3 from higher chucks on 2 and 4',
      'Keep boom-chuck steady through chord changes',
      'Smile test: it should feel like a train, not a scramble (Genre Day — Country Boom-Chuck Deepening day 146)'
    ],
    theoryBite: 'Bass / chord / bass / chord. Thumb and strum hand doing different jobs is the skill (Country Boom-Chuck Deepening).',
    drills: [
      'Bass on open D/G strings beats 1 & 3 only for 60s',
      'Add light chucks on 2 & 4 muted',
      'G–C–D boom-chuck at walking tempo',
      'Remove chucks for 4 bars, bring back — pocket must stay (Genre Day — Country Boom-Chuck Deepening day 146)'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'Play 16 bars of boom-chuck on a three-chord loop with clear bass vs chuck roles (Country Boom-Chuck Deepening).',
  },
  147: {

    title: 'Genre Day — Rock Eighth Drive (2)',
    durationMin: 35,
    goals: [
      'Drive straight eighths with consistent down-up energy',
      'Lean on power shapes or open chords without tensing the fretting hand',
      'Use palm mute as a chorus/verse texture switch (Genre Day — Rock Eighth Drive day 147)'
    ],
    theoryBite: 'Rock eighth drive is stamina plus evenness. The story is usually density and mute color — not fancier chords (Rock Eighth Drive).',
    drills: [
      'Straight eighth downs-ups muted 90 seconds',
      'Power-shape fretting with eighth drive 8 bars',
      'Verse mute / chorus open for a 16-bar form',
      'Check shoulders at bar 12 — drop them if high (Genre Day — Rock Eighth Drive day 147)'
    ],
    libraryIds: [
      'pr-1645',
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play a 16-bar verse/chorus mute story at steady eighths without rushing the chorus open (Rock Eighth Drive).',
  },
  148: {

    title: 'Weekly Rhythm Checkpoint (2)',
    durationMin: 30,
    goals: [
      'Combine pocket, one subdivision skill, and dynamics in one take',
      'Record evidence rather than trusting memory',
      'Name one keep and one fix afterward (Weekly Rhythm Checkpoint day 148)'
    ],
    theoryBite: 'Checkpoints convert practice into proof. A short recorded take plus a kind note beats vague \'I practiced rhythm.\' (Weekly Rhythm Checkpoint).',
    drills: [
      '60s pocket warm-up muted',
      '8 bars subdivision or accent focus',
      '8 bars dynamic wave on a progression',
      'Record a 16-bar medley of those skills; write keep/fix (Weekly Rhythm Checkpoint day 148)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-funk-chicka-study'
    ],
    masteryCheck: 'Save one 16-bar take that shows steady time plus one expressive rhythm choice, with a written keep and fix (Weekly Rhythm Checkpoint).',
  },
  149: {

    title: 'Click Trust — Play Behind/On/Ahead (3)',
    durationMin: 30,
    goals: [
      'Play on top of, with, and slightly behind the click on command',
      'Hear the click as a collaborator, not an enemy',
      'Return to \'with\' after exploring the edges (Click Trust — Play Behind/On/Ahead day 149)'
    ],
    theoryBite: 'Time feel is where you place the notes. Behind feels heavier; ahead feels urgent. You need a click to hear the difference (Play Behind/On/Ahead) (Play Behind/On/Ahead day 3).',
    drills: [
      '8 bars dead on the click (muted)',
      '8 bars intentionally late (still even)',
      '8 bars intentionally early (still even)',
      '8 bars back on center — notice body tension differences (Click Trust — Play Behind/On/Ahead day 149)'
    ],
    libraryIds: [
      'pr-6251',
      'rf-am-arpeggio-cascade'
    ],
    masteryCheck: 'Label and Play on / behind / ahead for 8 bars each without losing the form of a simple vamp (Play Behind/On/Ahead) (Play Behind/On/Ahead day 3).',
  },
  150: {

    title: 'Rhythm Capstone Mid — 32-Bar Texture Ride',
    durationMin: 30,
    goals: [
      'Map a 32-bar texture plan (sparse → full → sparse)',
      'Change right-hand density without changing tempo',
      'Treat arrangement as a practice skill, not only a studio skill (Rhythm Capstone Mid — 32-Bar Texture Ride)'
    ],
    theoryBite: 'Texture is how many layers are talking at once. Good rhythm players shape with the right hand: low density vs full strums (32-Bar Texture Ride).',
    drills: [
      'Write a 32-bar map: 8 sparse, 8 medium, 8 full, 8 sparse',
      'Play the map on one chord only',
      'Play the map on a 3-chord loop',
      'Mark one bar that got busy too early and fix it — 32-Bar Texture Ride'
    ],
    libraryIds: [
      'pr-145',
      'rf-natural-harmonics-study'
    ],
    masteryCheck: 'Play the full 32-bar texture map once with tempo flat and density changes obvious (32-Bar Texture Ride).',
  },
  151: {

    title: 'Groove Deepening — Pocket Variations',
    durationMin: 30,
    goals: [
      'Lock your foot to steady quarter notes before the hands get fancy',
      'Turn muted strums into a drum kit that never rushes',
      'Prove the groove still feels good when you add only one chord (Groove Deepening — Pocket Variations)'
    ],
    theoryBite: 'People forgive simple harmony faster than shaky time. Pocket means your notes agree with the pulse. Steady and simple beats fancy and shaky (Pocket Variations).',
    drills: [
      'Foot quarters alone for 60 seconds at 70 BPM — no guitar',
      'Muted downstrokes on open strings, one per beat, 60 seconds',
      'Muted D-DU pattern for 60 seconds while counting 1 & 2 & 3 & 4 & aloud',
      'Add a single G chord only after 8 clean muted bars; stop if the pocket slips — Pocket Variations'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-open-am'
    ],
    masteryCheck: 'Hold 32 bars of muted groove at 70 BPM with foot and hand locked, then add one chord without rushing (Pocket Variations).',
  },
  152: {

    title: 'Comp Patterns — Two Rights, One Left (3)',
    durationMin: 30,
    goals: [
      'Build a two-bar comp pattern you could hand to a singer',
      'Balance low thumps and higher scratches',
      'Leave space for an imaginary vocal (Comp Patterns — Two Rights, One Left day 152)'
    ],
    theoryBite: 'Comp patterns are right-hand patterns you can reuse. Good accompanists repeat a clear idea instead of inventing chaos (Two Rights, One Left) (Two Rights, One Left day 3).',
    drills: [
      'Design a 2-bar pattern on paper (D = down, U = up,. = rest)',
      'Mute-Play it 8 times; keep it slow and clean on Two Rights, One Left day 3',
      'Add G and C, two bars each, pattern continuous',
      'Sing nonsense syllables over it to test space (Comp Patterns — Two Rights, One Left day 152)'
    ],
    libraryIds: [
      'pr-1645',
      'rf-caged-c'
    ],
    masteryCheck: 'Loop your 2-bar comp for 16 bars with chord changes and still-recognizable pattern identity (Two Rights, One Left) (Two Rights, One Left day 3).',
  },
  153: {

    title: 'Genre Day — Country Boom-Chuck Deepening (3)',
    durationMin: 30,
    goals: [
      'Separate bass notes on beats 1 and 3 from higher chucks on 2 and 4',
      'Keep boom-chuck steady through chord changes',
      'Smile test: it should feel like a train, not a scramble (Genre Day — Country Boom-Chuck Deepening day 153)'
    ],
    theoryBite: 'Bass / chord / bass / chord. Thumb and strum hand doing different jobs is the skill (Country Boom-Chuck Deepening) (Country Boom-Chuck Deepening).',
    drills: [
      'Bass on open D/G strings beats 1 & 3 only for 60s',
      'Add light chucks on 2 & 4 muted',
      'G–C–D boom-chuck at walking tempo',
      'Remove chucks for 4 bars, bring back — pocket must stay (Genre Day — Country Boom-Chuck Deepening day 153)'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'Play 16 bars of boom-chuck on a three-chord loop with clear bass vs chuck roles (Country Boom-Chuck Deepening) (Country Boom-Chuck Deepening).',
  },
  154: {

    title: 'Genre Day — Rock Eighth Drive (3)',
    durationMin: 35,
    goals: [
      'Drive straight eighths with consistent down-up energy',
      'Lean on power shapes or open chords without tensing the fretting hand',
      'Use palm mute as a chorus/verse texture switch (Genre Day — Rock Eighth Drive day 154)'
    ],
    theoryBite: 'Rock eighth drive is stamina plus evenness. The story is usually density and mute color — not fancier chords (Rock Eighth Drive) (Rock Eighth Drive day 3).',
    drills: [
      'Straight eighth downs-ups muted 90 seconds',
      'Power-shape fretting with eighth drive 8 bars',
      'Verse mute / chorus open for a 16-bar form',
      'Check shoulders at bar 12 — drop them if high (Genre Day — Rock Eighth Drive day 154)'
    ],
    libraryIds: [
      'pr-6251',
      'rf-c-bass-walk-study'
    ],
    masteryCheck: 'Play a 16-bar verse/chorus mute story at steady eighths without rushing the chorus open (Rock Eighth Drive) (Rock Eighth Drive day 3).',
  },
  155: {

    title: 'Weekly Rhythm Checkpoint (3)',
    durationMin: 30,
    goals: [
      'Combine pocket, one subdivision skill, and dynamics in one take',
      'Record evidence rather than trusting memory',
      'Name one keep and one fix afterward (Weekly Rhythm Checkpoint day 155)'
    ],
    theoryBite: 'Checkpoints convert practice into proof. A short recorded take plus a kind note beats vague \'I practiced rhythm.\' (Weekly Rhythm Checkpoint) (Weekly Rhythm Checkpoint day 3).',
    drills: [
      '60s pocket warm-up muted',
      '8 bars subdivision or accent focus',
      '8 bars dynamic wave on a progression',
      'Record a 16-bar medley of those skills; write keep/fix (Weekly Rhythm Checkpoint day 155)'
    ],
    libraryIds: [
      'pr-145',
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'Save one 16-bar take that shows steady time plus one expressive rhythm choice, with a written keep and fix (Weekly Rhythm Checkpoint) (Weekly Rhythm Checkpoint day 3).',
  },
  156: {

    title: 'Click Trust — Play Behind/On/Ahead (4)',
    durationMin: 30,
    goals: [
      'Play on top of, with, and slightly behind the click on command',
      'Hear the click as a collaborator, not an enemy',
      'Return to \'with\' after exploring the edges (Click Trust — Play Behind/On/Ahead day 156)'
    ],
    theoryBite: 'Time feel is where you place the notes. Behind feels heavier; ahead feels urgent. You need a click to hear the difference (Play Behind/On/Ahead) (Play Behind/On/Ahead day 4).',
    drills: [
      '8 bars dead on the click (muted)',
      '8 bars intentionally late (still even)',
      '8 bars intentionally early (still even)',
      '8 bars back on center — notice body tension differences (Click Trust — Play Behind/On/Ahead day 156)'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-drop-d-power-study'
    ],
    masteryCheck: 'Label and Play on / behind / ahead for 8 bars each without losing the form of a simple vamp (Play Behind/On/Ahead) (Play Behind/On/Ahead day 4).',
  },
  157: {

    title: 'Dynamic Waves — Crescendo Strum (3)',
    durationMin: 30,
    goals: [
      'Crescendo and decrescendo across multi-bar phrases',
      'Keep tempo flat while volume moves',
      'Use dynamics as storytelling inside one progression (Dynamic Waves — Crescendo Strum day 157)'
    ],
    theoryBite: 'Separating dynamics from tempo is real right-hand control. Most of us get louder by speeding up — break that link (Crescendo Strum) (Crescendo Strum day 3).',
    drills: [
      '4 bars soft→loud on muted strums with a click',
      '4 bars loud→soft immediately after',
      'Repeat with chords G–Em–C–D',
      'Friend test: can someone hear the wave with eyes closed? (Dynamic Waves — Crescendo Strum day 157)'
    ],
    libraryIds: [
      'pr-1645',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Play an 8-bar dynamic wave (up then down) without speeding up or collapsing the groove (Crescendo Strum) (Crescendo Strum day 3).',
  },
  158: {

    title: 'Odd Accent — 5/4 Taste (3)',
    durationMin: 30,
    goals: [
      'Count a simple 5/4 or 5-beat cycle without panic',
      'Loop a short riff that makes the odd meter feel natural',
      'Return to 4/4 cleanly so 4/4 feels even more solid (Odd Accent — 5/4 Taste day 158)'
    ],
    theoryBite: 'Odd meters train attention. Even a little 5/4 makes your 4/4 barlines feel more solid (5/4 Taste) (5/4 Taste day 3).',
    drills: [
      'Count 1-2-3-4-5 aloud with foot for 60 seconds',
      'Muted hit on 1 and 4 only in a 5-beat cycle',
      'Two-chord idea in 5: bar of A, bar of G feeling',
      'Play 8 bars of 4/4 afterward — notice the calm (Odd Accent — 5/4 Taste day 158)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-power'
    ],
    masteryCheck: 'Loop 8 cycles of a 5-beat groove you can count aloud while playing (5/4 Taste) (5/4 Taste day 3).',
  },
  159: {

    title: 'Comp Patterns — Two Rights, One Left (4)',
    durationMin: 30,
    goals: [
      'Build a two-bar comp pattern you could hand to a singer',
      'Balance low thumps and higher scratches',
      'Leave space for an imaginary vocal (Comp Patterns — Two Rights, One Left day 159)'
    ],
    theoryBite: 'Comp patterns are right-hand patterns you can reuse. Good accompanists repeat a clear idea instead of inventing chaos (Two Rights, One Left) (Two Rights, One Left day 4).',
    drills: [
      'Design a 2-bar pattern on paper (D = down, U = up,. = rest)',
      'Mute-Play it 8 times; keep it slow and clean on Two Rights, One Left day 4',
      'Add G and C, two bars each, pattern continuous',
      'Sing nonsense syllables over it to test space (Comp Patterns — Two Rights, One Left day 159)'
    ],
    libraryIds: [
      'pr-6251',
      'rf-open-g-roll-study'
    ],
    masteryCheck: 'Loop your 2-bar comp for 16 bars with chord changes and still-recognizable pattern identity (Two Rights, One Left) (Two Rights, One Left day 4).',
  },
  160: {

    title: 'Genre Day — Country Boom-Chuck Deepening (4)',
    durationMin: 30,
    goals: [
      'Separate bass notes on beats 1 and 3 from higher chucks on 2 and 4',
      'Keep boom-chuck steady through chord changes',
      'Smile test: it should feel like a train, not a scramble (Genre Day — Country Boom-Chuck Deepening day 160)'
    ],
    theoryBite: 'Bass / chord / bass / chord. Thumb and strum hand doing different jobs is the skill (Country Boom-Chuck Deepening) (Country Boom-Chuck Deepening 3).',
    drills: [
      'Bass on open D/G strings beats 1 & 3 only for 60s',
      'Add light chucks on 2 & 4 muted',
      'G–C–D boom-chuck at walking tempo',
      'Remove chucks for 4 bars, bring back — pocket must stay (Genre Day — Country Boom-Chuck Deepening day 160)'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'Play 16 bars of boom-chuck on a three-chord loop with clear bass vs chuck roles (Country Boom-Chuck Deepening) (Country Boom-Chuck Deepening 3).',
  },
  161: {

    title: 'Genre Day — Rock Eighth Drive (4)',
    durationMin: 35,
    goals: [
      'Drive straight eighths with consistent down-up energy',
      'Lean on power shapes or open chords without tensing the fretting hand',
      'Use palm mute as a chorus/verse texture switch (Genre Day — Rock Eighth Drive day 161)'
    ],
    theoryBite: 'Rock eighth drive is stamina plus evenness. The story is usually density and mute color — not fancier chords (Rock Eighth Drive) (Rock Eighth Drive day 4).',
    drills: [
      'Straight eighth downs-ups muted 90 seconds',
      'Power-shape fretting with eighth drive 8 bars',
      'Verse mute / chorus open for a 16-bar form',
      'Check shoulders at bar 12 — drop them if high (Genre Day — Rock Eighth Drive day 161)'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-spanish-e-phrygian-study'
    ],
    masteryCheck: 'Play a 16-bar verse/chorus mute story at steady eighths without rushing the chorus open (Rock Eighth Drive) (Rock Eighth Drive day 4).',
  },
  162: {

    title: 'Weekly Rhythm Checkpoint (4)',
    durationMin: 30,
    goals: [
      'Combine pocket, one subdivision skill, and dynamics in one take',
      'Record evidence rather than trusting memory',
      'Name one keep and one fix afterward (Weekly Rhythm Checkpoint day 162)'
    ],
    theoryBite: 'Checkpoints convert practice into proof. A short recorded take plus a kind note beats vague \'I practiced rhythm.\' (Weekly Rhythm Checkpoint) (Weekly Rhythm Checkpoint day 4).',
    drills: [
      '60s pocket warm-up muted',
      '8 bars subdivision or accent focus',
      '8 bars dynamic wave on a progression',
      'Record a 16-bar medley of those skills; write keep/fix (Weekly Rhythm Checkpoint day 162)'
    ],
    libraryIds: [
      'pr-1645',
      'rf-jazz-chromatic-approach-study'
    ],
    masteryCheck: 'Save one 16-bar take that shows steady time plus one expressive rhythm choice, with a written keep and fix (Weekly Rhythm Checkpoint) (Weekly Rhythm Checkpoint day 4).',
  },
  163: {

    title: 'Click Trust — Play Behind/On/Ahead (5)',
    durationMin: 30,
    goals: [
      'Play on top of, with, and slightly behind the click on command',
      'Hear the click as a collaborator, not an enemy',
      'Return to \'with\' after exploring the edges (Click Trust — Play Behind/On/Ahead day 163)'
    ],
    theoryBite: 'Time feel is where you place the notes. Behind feels heavier; ahead feels urgent. You need a click to hear the difference (Play Behind/On/Ahead) (Play Behind/On/Ahead day 5).',
    drills: [
      '8 bars dead on the click (muted)',
      '8 bars intentionally late (still even)',
      '8 bars intentionally early (still even)',
      '8 bars back on center — notice body tension differences (Click Trust — Play Behind/On/Ahead day 163)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Label and Play on / behind / ahead for 8 bars each without losing the form of a simple vamp (Play Behind/On/Ahead) (Play Behind/On/Ahead day 5).',
  },
  164: {

    title: 'Dynamic Waves — Crescendo Strum (4)',
    durationMin: 30,
    goals: [
      'Crescendo and decrescendo across multi-bar phrases',
      'Keep tempo flat while volume moves',
      'Use dynamics as storytelling inside one progression (Dynamic Waves — Crescendo Strum day 164)'
    ],
    theoryBite: 'Separating dynamics from tempo is real right-hand control. Most of us get louder by speeding up — break that link (Crescendo Strum) (Crescendo Strum day 4).',
    drills: [
      '4 bars soft→loud on muted strums with a click',
      '4 bars loud→soft immediately after',
      'Repeat with chords G–Em–C–D',
      'Friend test: can someone hear the wave with eyes closed? (Dynamic Waves — Crescendo Strum day 164)'
    ],
    libraryIds: [
      'pr-6251',
      'rf-spider'
    ],
    masteryCheck: 'Play an 8-bar dynamic wave (up then down) without speeding up or collapsing the groove (Crescendo Strum) (Crescendo Strum day 4).',
  },
  165: {

    title: 'Odd Accent — 5/4 Taste (4)',
    durationMin: 30,
    goals: [
      'Count a simple 5/4 or 5-beat cycle without panic',
      'Loop a short riff that makes the odd meter feel natural',
      'Return to 4/4 cleanly so 4/4 feels even more solid (Odd Accent — 5/4 Taste day 165)'
    ],
    theoryBite: 'Odd meters train attention. Even a little 5/4 makes your 4/4 barlines feel more solid (5/4 Taste) (5/4 Taste day 4).',
    drills: [
      'Count 1-2-3-4-5 aloud with foot for 60 seconds',
      'Muted hit on 1 and 4 only in a 5-beat cycle',
      'Two-chord idea in 5: bar of A, bar of G feeling',
      'Play 8 bars of 4/4 afterward — notice the calm (Odd Accent — 5/4 Taste day 165)'
    ],
    libraryIds: [
      'pr-145',
      'rf-blues-sh'
    ],
    masteryCheck: 'Loop 8 cycles of a 5-beat groove you can count aloud while playing (5/4 Taste) (5/4 Taste day 4).',
  },
  166: {

    title: 'Comp Patterns — Two Rights, One Left (5)',
    durationMin: 30,
    goals: [
      'Build a two-bar comp pattern you could hand to a singer',
      'Balance low thumps and higher scratches',
      'Leave space for an imaginary vocal (Comp Patterns — Two Rights, One Left day 166)'
    ],
    theoryBite: 'Comp patterns are right-hand patterns you can reuse. Good accompanists repeat a clear idea instead of inventing chaos (Two Rights, One Left) (Two Rights, One Left day 5).',
    drills: [
      'Design a 2-bar pattern on paper (D = down, U = up,. = rest)',
      'Mute-Play it 8 times; keep it slow and clean on Two Rights, One Left day 5',
      'Add G and C, two bars each, pattern continuous',
      'Sing nonsense syllables over it to test space (Comp Patterns — Two Rights, One Left day 166)'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-em-pentatonic-box-study'
    ],
    masteryCheck: 'Loop your 2-bar comp for 16 bars with chord changes and still-recognizable pattern identity (Two Rights, One Left) (Two Rights, One Left day 5).',
  },
  167: {

    title: 'Genre Day — Country Boom-Chuck Deepening (5)',
    durationMin: 30,
    goals: [
      'Separate bass notes on beats 1 and 3 from higher chucks on 2 and 4',
      'Keep boom-chuck steady through chord changes',
      'Smile test: it should feel like a train, not a scramble (Genre Day — Country Boom-Chuck Deepening day 167)'
    ],
    theoryBite: 'Bass / chord / bass / chord. Thumb and strum hand doing different jobs is the skill (Country Boom-Chuck Deepening) (Country Boom-Chuck Deepening 4).',
    drills: [
      'Bass on open D/G strings beats 1 & 3 only for 60s',
      'Add light chucks on 2 & 4 muted',
      'G–C–D boom-chuck at walking tempo',
      'Remove chucks for 4 bars, bring back — pocket must stay (Genre Day — Country Boom-Chuck Deepening day 167)'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'Play 16 bars of boom-chuck on a three-chord loop with clear bass vs chuck roles (Country Boom-Chuck Deepening) (Country Boom-Chuck Deepening 4).',
  },
  168: {

    title: 'Genre Day — Rock Eighth Drive (5)',
    durationMin: 35,
    goals: [
      'Drive straight eighths with consistent down-up energy',
      'Lean on power shapes or open chords without tensing the fretting hand',
      'Use palm mute as a chorus/verse texture switch (Genre Day — Rock Eighth Drive day 168)'
    ],
    theoryBite: 'Rock eighth drive is stamina plus evenness. The story is usually density and mute color — not fancier chords (Rock Eighth Drive) (Rock Eighth Drive day 5).',
    drills: [
      'Straight eighth downs-ups muted 90 seconds',
      'Power-shape fretting with eighth drive 8 bars',
      'Verse mute / chorus open for a 16-bar form',
      'Check shoulders at bar 12 — drop them if high (Genre Day — Rock Eighth Drive day 168)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-funk-chicka-study'
    ],
    masteryCheck: 'Play a 16-bar verse/chorus mute story at steady eighths without rushing the chorus open (Rock Eighth Drive) (Rock Eighth Drive day 5).',
  },
  169: {

    title: 'Weekly Rhythm Checkpoint (5)',
    durationMin: 30,
    goals: [
      'Combine pocket, one subdivision skill, and dynamics in one take',
      'Record evidence rather than trusting memory',
      'Name one keep and one fix afterward (Weekly Rhythm Checkpoint day 169)'
    ],
    theoryBite: 'Checkpoints convert practice into proof. A short recorded take plus a kind note beats vague \'I practiced rhythm.\' (Weekly Rhythm Checkpoint) (Weekly Rhythm Checkpoint day 5).',
    drills: [
      '60s pocket warm-up muted',
      '8 bars subdivision or accent focus',
      '8 bars dynamic wave on a progression',
      'Record a 16-bar medley of those skills; write keep/fix (Weekly Rhythm Checkpoint day 169)'
    ],
    libraryIds: [
      'pr-6251',
      'rf-am-arpeggio-cascade'
    ],
    masteryCheck: 'Save one 16-bar take that shows steady time plus one expressive rhythm choice, with a written keep and fix (Weekly Rhythm Checkpoint) (Weekly Rhythm Checkpoint day 5).',
  },
  170: {

    title: 'Click Trust — Play Behind/On/Ahead (6)',
    durationMin: 30,
    goals: [
      'Play on top of, with, and slightly behind the click on command',
      'Hear the click as a collaborator, not an enemy',
      'Return to \'with\' after exploring the edges (Click Trust — Play Behind/On/Ahead day 170)'
    ],
    theoryBite: 'Time feel is where you place the notes. Behind feels heavier; ahead feels urgent. You need a click to hear the difference (Play Behind/On/Ahead) (Play Behind/On/Ahead day 6).',
    drills: [
      '8 bars dead on the click (muted)',
      '8 bars intentionally late (still even)',
      '8 bars intentionally early (still even)',
      '8 bars back on center — notice body tension differences (Click Trust — Play Behind/On/Ahead day 170)'
    ],
    libraryIds: [
      'pr-145',
      'rf-natural-harmonics-study'
    ],
    masteryCheck: 'Label and Play on / behind / ahead for 8 bars each without losing the form of a simple vamp (Play Behind/On/Ahead) (Play Behind/On/Ahead day 6).',
  },
  171: {

    title: 'Dynamic Waves — Crescendo Strum (5)',
    durationMin: 30,
    goals: [
      'Crescendo and decrescendo across multi-bar phrases',
      'Keep tempo flat while volume moves',
      'Use dynamics as storytelling inside one progression (Dynamic Waves — Crescendo Strum day 171)'
    ],
    theoryBite: 'Separating dynamics from tempo is real right-hand control. Most of us get louder by speeding up — break that link (Crescendo Strum) (Crescendo Strum day 5).',
    drills: [
      '4 bars soft→loud on muted strums with a click',
      '4 bars loud→soft immediately after',
      'Repeat with chords G–Em–C–D',
      'Friend test: can someone hear the wave with eyes closed? (Dynamic Waves — Crescendo Strum day 171)'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-open-am'
    ],
    masteryCheck: 'Play an 8-bar dynamic wave (up then down) without speeding up or collapsing the groove (Crescendo Strum) (Crescendo Strum day 5).',
  },
  172: {

    title: 'Odd Accent — 5/4 Taste (5)',
    durationMin: 30,
    goals: [
      'Count a simple 5/4 or 5-beat cycle without panic',
      'Loop a short riff that makes the odd meter feel natural',
      'Return to 4/4 cleanly so 4/4 feels even more solid (Odd Accent — 5/4 Taste day 172)'
    ],
    theoryBite: 'Odd meters train attention. Even a little 5/4 makes your 4/4 barlines feel more solid (5/4 Taste) (5/4 Taste day 5).',
    drills: [
      'Count 1-2-3-4-5 aloud with foot for 60 seconds',
      'Muted hit on 1 and 4 only in a 5-beat cycle',
      'Two-chord idea in 5: bar of A, bar of G feeling',
      'Play 8 bars of 4/4 afterward — notice the calm (Odd Accent — 5/4 Taste day 172)'
    ],
    libraryIds: [
      'pr-1645',
      'rf-caged-c'
    ],
    masteryCheck: 'Loop 8 cycles of a 5-beat groove you can count aloud while playing (5/4 Taste) (5/4 Taste day 5).',
  },
  173: {

    title: 'Comp Patterns — Two Rights, One Left (6)',
    durationMin: 30,
    goals: [
      'Build a two-bar comp pattern you could hand to a singer',
      'Balance low thumps and higher scratches',
      'Leave space for an imaginary vocal (Comp Patterns — Two Rights, One Left day 173)'
    ],
    theoryBite: 'Comp patterns are right-hand patterns you can reuse. Good accompanists repeat a clear idea instead of inventing chaos (Two Rights, One Left) (Two Rights, One Left day 6).',
    drills: [
      'Design a 2-bar pattern on paper (D = down, U = up,. = rest)',
      'Mute-Play it 8 times; keep it slow and clean on Two Rights, One Left day 6',
      'Add G and C, two bars each, pattern continuous',
      'Sing nonsense syllables over it to test space (Comp Patterns — Two Rights, One Left day 173)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-d-folk-pattern-study'
    ],
    masteryCheck: 'Loop your 2-bar comp for 16 bars with chord changes and still-recognizable pattern identity (Two Rights, One Left) (Two Rights, One Left day 6).',
  },
  174: {

    title: 'Genre Day — Country Boom-Chuck Deepening (6)',
    durationMin: 30,
    goals: [
      'Separate bass notes on beats 1 and 3 from higher chucks on 2 and 4',
      'Keep boom-chuck steady through chord changes',
      'Smile test: it should feel like a train, not a scramble (Genre Day — Country Boom-Chuck Deepening day 174)'
    ],
    theoryBite: 'Bass / chord / bass / chord. Thumb and strum hand doing different jobs is the skill (Country Boom-Chuck Deepening) (Country Boom-Chuck Deepening 5).',
    drills: [
      'Bass on open D/G strings beats 1 & 3 only for 60s',
      'Add light chucks on 2 & 4 muted',
      'G–C–D boom-chuck at walking tempo',
      'Remove chucks for 4 bars, bring back — pocket must stay (Genre Day — Country Boom-Chuck Deepening day 174)'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'ch-g',
      'ch-c',
      'ch-d'
    ],
    masteryCheck: 'Play 16 bars of boom-chuck on a three-chord loop with clear bass vs chuck roles (Country Boom-Chuck Deepening) (Country Boom-Chuck Deepening 5).',
  },
  175: {

    title: 'Genre Day — Rock Eighth Drive (6)',
    durationMin: 35,
    goals: [
      'Drive straight eighths with consistent down-up energy',
      'Lean on power shapes or open chords without tensing the fretting hand',
      'Use palm mute as a chorus/verse texture switch (Genre Day — Rock Eighth Drive day 175)'
    ],
    theoryBite: 'Rock eighth drive is stamina plus evenness. The story is usually density and mute color — not fancier chords (Rock Eighth Drive) (Rock Eighth Drive day 6).',
    drills: [
      'Straight eighth downs-ups muted 90 seconds',
      'Power-shape fretting with eighth drive 8 bars',
      'Verse mute / chorus open for a 16-bar form',
      'Check shoulders at bar 12 — drop them if high (Genre Day — Rock Eighth Drive day 175)'
    ],
    libraryIds: [
      'pr-145',
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'Play a 16-bar verse/chorus mute story at steady eighths without rushing the chorus open (Rock Eighth Drive) (Rock Eighth Drive day 6).',
  },
  176: {

    title: 'Weekly Rhythm Checkpoint (6)',
    durationMin: 30,
    goals: [
      'Combine pocket, one subdivision skill, and dynamics in one take',
      'Record evidence rather than trusting memory',
      'Name one keep and one fix afterward (Weekly Rhythm Checkpoint day 176)'
    ],
    theoryBite: 'Checkpoints convert practice into proof. A short recorded take plus a kind note beats vague \'I practiced rhythm.\' (Weekly Rhythm Checkpoint) (Weekly Rhythm Checkpoint day 6).',
    drills: [
      '60s pocket warm-up muted',
      '8 bars subdivision or accent focus',
      '8 bars dynamic wave on a progression',
      'Record a 16-bar medley of those skills; write keep/fix (Weekly Rhythm Checkpoint day 176)'
    ],
    libraryIds: [
      'pr-12bar',
      'rf-drop-d-power-study'
    ],
    masteryCheck: 'Save one 16-bar take that shows steady time plus one expressive rhythm choice, with a written keep and fix (Weekly Rhythm Checkpoint) (Weekly Rhythm Checkpoint day 6).',
  },
  177: {

    title: 'Click Trust — Play Behind/On/Ahead (7)',
    durationMin: 30,
    goals: [
      'Play on top of, with, and slightly behind the click on command',
      'Hear the click as a collaborator, not an enemy',
      'Return to \'with\' after exploring the edges (Click Trust — Play Behind/On/Ahead day 177)'
    ],
    theoryBite: 'Time feel is where you place the notes. Behind feels heavier; ahead feels urgent. You need a click to hear the difference (Play Behind/On/Ahead) (Play Behind/On/Ahead day 7).',
    drills: [
      '8 bars dead on the click (muted)',
      '8 bars intentionally late (still even)',
      '8 bars intentionally early (still even)',
      '8 bars back on center — notice body tension differences (Click Trust — Play Behind/On/Ahead day 177)'
    ],
    libraryIds: [
      'pr-1645',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Label and Play on / behind / ahead for 8 bars each without losing the form of a simple vamp (Play Behind/On/Ahead) (Play Behind/On/Ahead day 7).',
  },
  178: {

    title: 'Dynamic Waves — Crescendo Strum (6)',
    durationMin: 30,
    goals: [
      'Crescendo and decrescendo across multi-bar phrases',
      'Keep tempo flat while volume moves',
      'Use dynamics as storytelling inside one progression (Dynamic Waves — Crescendo Strum day 178)'
    ],
    theoryBite: 'Separating dynamics from tempo is real right-hand control. Most of us get louder by speeding up — break that link (Crescendo Strum) (Crescendo Strum day 6).',
    drills: [
      '4 bars soft→loud on muted strums with a click',
      '4 bars loud→soft immediately after',
      'Repeat with chords G–Em–C–D',
      'Friend test: can someone hear the wave with eyes closed? (Dynamic Waves — Crescendo Strum day 178)'
    ],
    libraryIds: [
      'pr-andalu',
      'ch-c',
      'rf-power'
    ],
    masteryCheck: 'Play an 8-bar dynamic wave (up then down) without speeding up or collapsing the groove (Crescendo Strum) (Crescendo Strum day 6).',
  },
  179: {

    title: 'Odd Accent — 5/4 Taste (6)',
    durationMin: 30,
    goals: [
      'Count a simple 5/4 or 5-beat cycle without panic',
      'Loop a short riff that makes the odd meter feel natural',
      'Return to 4/4 cleanly so 4/4 feels even more solid (Odd Accent — 5/4 Taste day 179)'
    ],
    theoryBite: 'Odd meters train attention. Even a little 5/4 makes your 4/4 barlines feel more solid (5/4 Taste) (5/4 Taste day 6).',
    drills: [
      'Count 1-2-3-4-5 aloud with foot for 60 seconds',
      'Muted hit on 1 and 4 only in a 5-beat cycle',
      'Two-chord idea in 5: bar of A, bar of G feeling',
      'Play 8 bars of 4/4 afterward — notice the calm (Odd Accent — 5/4 Taste day 179)'
    ],
    libraryIds: [
      'pr-6251',
      'rf-open-g-roll-study'
    ],
    masteryCheck: 'Loop 8 cycles of a 5-beat groove you can count aloud while playing (5/4 Taste) (5/4 Taste day 6).',
  },
  180: {

    title: 'Rhythm Checkpoint — Bridge Toward Lead',
    durationMin: 30,
    goals: [
      'Prove rhythm skills still hold when you add a tiny lead fill',
      'Return to groove after the fill without a tempo scar',
      'Treat the fill as seasoning, not a solo audition'
    ],
    theoryBite: 'Fills should bless the groove. If the pocket dies when notes appear, simplify the fill.',
    drills: [
      '8 bars pure groove; keep it slow and clean on Bridge Toward Lead',
      '2-beat fill on beats 3–4 of bar 4, then back to groove',
      'Repeat every 4 bars for 16 bars total',
      'If rushes appear, shorten fill to one note'
    ],
    libraryIds: [
      'pr-145',
      'rf-a-blues-turnaround-study'
    ],
    masteryCheck: 'Play 16 bars of groove with a short fill every fourth bar and no lasting tempo drift.',
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
      'Invent a 3-note motif on minor pentatonic; repeat it identically 4 times — keep it about Lead Phase Open — Say Something, Then Listen',
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
      'Bend to a target pitch you can name or match',
      'Release bends as musically as you attack them',
      'Keep supporting fingers helping the bend without clamping the neck'
    ],
    theoryBite: 'A bend is a portable slur to a chord tone. Landing in tune beats bending far.',
    drills: [
      'Fret a target note, then bend from a whole step below into it — match sustain — keep it about Bends 101 — Target Pitch',
      'Pre-bend silently, then release into the lower pitch',
      'Bend-and-hold 2 beats in tune, then resolve down',
      'Use bends only on phrase endings for 8 bars over a vamp'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Land four consecutive whole-step bends on pitch (close enough that your ear is happy) at slow tempo.',
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
      'Long tone 4 beats with no vibrato — pure — keep it about Vibrato — Controlled Wave',
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
      'Slide into a target fret from 2 frets below on the beat — keep it about Slides — Connect Positions Musically',
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
      'Hammer 0→2→0 on one string slowly 60s — keep it about Hammer-ons & Pull-offs — Legato Seed',
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
      'Find a comfortable third shape on G/B strings; ring 4 beats — keep it about Double Stops — Two-Note Harmony',
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
      'Hum 1 bar, rest 1 bar — 4 cycles — keep it about Call From Vocals — Sing Then Solo',
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
      'Write a 4-note motif — keep it about Motif Development — Same Notes New Rhythms',
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
      'On G–C–D, play only roots for 8 bars — keep it about Targeting 3rds — Sweet Notes Over Chords',
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
      'Build an octave shape on D/G or G/e strings; mute middle — keep it about Octave Melodies — Simple & Huge',
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
      'One lick pp for 4 bars, ff for 4 bars — keep it about Dynamics in Lead — Whisper to Shout',
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
      'Solo rule: maximum 2 beats of notes per bar for 8 bars — keep it about Space Solo Challenge — 50% Silence',
      'Call 1 bar, rest 1 bar — strict',
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
      'Speak the 12-bar form while comping simply — keep it about Blues Language — Call Licks Over 12-Bar',
      'Call-lick on I, answer on I',
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
      'Map major pentatonic box relative to G — keep it about Major Key Lead — Happy Notes Over G',
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
      'Write a 3-part plan: sparse / develop / peak — keep it about Lead Capstone — 24-Bar Story Solo',
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
      'Move a melodic cell up or down the scale systematically',
      'Keep rhythm identical while pitch shifts',
      'Stop sequencing before it becomes mechanical noise'
    ],
    theoryBite: 'Sequences create forward motion people can feel coming — then break the pattern so it breathes.',
    drills: [
      'Cell of 4 notes; sequence up diatonically 3 times — keep it about Sequence Climb — Melodic Sequences Up',
      'Same 4-note cell descending diatonically 3 times, same tempo',
      'Break the fourth repeat with a long tone',
      'Apply over a static chord then over a change'
    ],
    libraryIds: [
      'rf-c-bass-walk-study',
      'sg-the-streets-of-laredo'
    ],
    masteryCheck: 'Play a clear ascending sequence of a 4-note cell three times and resolve with a long tone.',
  },
  197: {

    title: 'Question Harmony — Solo Over Andalusian',
    durationMin: 30,
    goals: [
      'Outline the Andalusian bass motion while soloing lightly',
      'Choose notes that respect each chord\'s color',
      'Use Phrygian/Spanish flavor without rushing'
    ],
    theoryBite: 'The Andalusian cadence (e.g. Am–G–F–E) is a little story that loops. Your lead notes should notice each chord, especially that E major tension.',
    drills: [
      'Comp the progression slowly, name each chord — keep it about Question Harmony — Solo Over Andalusian',
      'Roots-only lead through one cycle',
      'Add neighbor tones into each root',
      'One expressive cycle with space on the E chord'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'Solo one full Andalusian cycle that clearly changes color chord-to-chord, especially into E.',
  },
  198: {

    title: 'Economy Picking Seed',
    durationMin: 30,
    goals: [
      'Reduce pick motion with economy/outside-inside awareness',
      'Stay relaxed at moderate speed before chasing velocity',
      'Prefer accuracy of the grid over blur'
    ],
    theoryBite: 'Economy picking is about a smarter pick path across strings. Loose and even beats chasing speed too early.',
    drills: [
      'Two-string scale fragment focusing on efficient pick direction — keep it about Economy Picking Seed',
      'Slow 16ths on a 3-note-per-string idea (or simple box)',
      'Stop at first tension in forearm — shake out',
      '8 bars musical, not mechanical, using the efficient path'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play an 8-bar efficient-picking fragment cleanly at a tempo that stays relaxed.',
  },
  199: {

    title: 'Hybrid Picking Taste',
    durationMin: 30,
    goals: [
      'Combine pick bass notes with finger snags on higher strings',
      'Keep the pattern steady enough to be a texture',
      'Use hybrid for country/funk color inside a simple progression'
    ],
    theoryBite: 'Hybrid picking gives you more ways to attack a note. Pick/thumb on the lows, fingers on the highs — independence is the work.',
    drills: [
      'Pick low root on beats 1 and 3 — keep it about Hybrid Picking Taste',
      'Middle finger plucks a higher string on 2 and 4',
      'Combine into a rolling pattern on C or G shapes',
      '8-bar progression with hybrid texture throughout'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Maintain an 8-bar hybrid pattern with steady bass/ pick and clear finger snags.',
  },
  200: {

    title: 'Motif From a PD Song',
    durationMin: 30,
    goals: [
      'Steal a contour from a public-domain melody ethically as study',
      'Vary rhythm while keeping contour recognizable',
      'Return the motif as a hook inside your own phrasing'
    ],
    theoryBite: 'Public-domain melodies are free teachers. Borrowing a motif to study builds vocabulary without legal drama.',
    drills: [
      'Learn 2 bars of a PD tune slowly from the library tab — keep it about Motif From a PD Song',
      'Play it an octave away or in a new position',
      'Change only the rhythm, keep pitches',
      'Improv 8 bars that quote the motif once'
    ],
    libraryIds: [
      'sg-careless-love',
      'sg-auld-lang-syne'
    ],
    masteryCheck: 'Quote a PD motif once inside an 8-bar improvised phrase where the quote is recognizable.',
  },
  201: {

    title: 'Weekly Lead Checkpoint',
    durationMin: 30,
    goals: [
      'Combine motif, space, and one expression tool (bend/vibrato/slide)',
      'Record a short take as evidence',
      'Write one keep and one fix with kind wording'
    ],
    theoryBite: 'Lead checkpoints check your taste with a clock running. A short recorded solo plus a quick note beats endless noodling you forget.',
    drills: [
      'Warm-up long tones + light bends 2 minutes — keep it about Weekly Lead Checkpoint',
      'Motif/rest practice 8 cycles',
      '12-bar or 16-bar soloette over a library vamp/progression',
      'Listen once kindly, once with a pencil note'
    ],
    libraryIds: [
      'rf-open-g-roll-study',
      'sg-greensleeves'
    ],
    masteryCheck: 'Save one short lead take that shows space plus one expressive tool, with a written keep and fix.',
  },
  202: {

    title: 'Bend Vocabulary — Release & Pre-Bend',
    durationMin: 30,
    goals: [
      'Bend to a target pitch you can name or match',
      'Release bends as musically as you attack them',
      'Keep supporting fingers helping the bend without clamping the neck (Bend Vocabulary — Release & Pre-Bend)'
    ],
    theoryBite: 'A bend is a portable slur to a chord tone. Landing in tune beats bending far (Release & Pre-Bend).',
    drills: [
      'Fret a target note, then bend from a whole step below into it — match sustain — keep it about Bend Vocabulary — Release & Pre-Bend',
      'Pre-bend silently, then release into the lower pitch',
      'Bend-and-hold 2 beats in tune, then resolve down',
      'Use bends only on phrase endings for 8 bars over a vamp'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Land four consecutive whole-step bends on pitch (close enough that your ear is happy) at slow tempo (Release & Pre-Bend).',
  },
  203: {

    title: 'Sequence Climb — Melodic Sequences Up (2)',
    durationMin: 35,
    goals: [
      'Move a melodic cell up or down the scale systematically',
      'Keep rhythm identical while pitch shifts',
      'Stop sequencing before it becomes mechanical noise (Sequence Climb — Melodic Sequences Up day 203)'
    ],
    theoryBite: 'Sequences create forward motion people can feel coming — then break the pattern so it breathes (Melodic Sequences Up).',
    drills: [
      'Cell of 4 notes; sequence up diatonically 3 times — keep it about Sequence Climb — Melodic Sequences Up',
      'Same 4-note cell descending diatonically 3 times, same tempo',
      'Break the fourth repeat with a long tone',
      'Apply over a static chord then over a change (Sequence Climb — Melodic Sequences Up day 203)'
    ],
    libraryIds: [
      'rf-spanish-e-phrygian-study',
      'sg-wayfaring-stranger'
    ],
    masteryCheck: 'Play a clear ascending sequence of a 4-note cell three times and resolve with a long tone (Melodic Sequences Up).',
  },
  204: {

    title: 'Question Harmony — Solo Over Andalusian (2)',
    durationMin: 30,
    goals: [
      'Outline the Andalusian bass motion while soloing lightly',
      'Choose notes that respect each chord\'s color',
      'Use Phrygian/Spanish flavor without rushing (Question Harmony — Solo Over Andalusian day 204)'
    ],
    theoryBite: 'The Andalusian cadence (e.g. Am–G–F–E) is a little story that loops. Your lead notes should notice each chord, especially that E major tension (Solo Over Andalusian).',
    drills: [
      'Comp the progression slowly, name each chord — keep it about Question Harmony — Solo Over Andalusian',
      'Roots-only lead through one cycle',
      'Add neighbor tones into each root',
      'One expressive cycle with space on the E chord (Question Harmony — Solo Over Andalusian day 204)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'Solo one full Andalusian cycle that clearly changes color chord-to-chord, especially into E (Solo Over Andalusian).',
  },
  205: {

    title: 'Economy Picking Seed (2)',
    durationMin: 30,
    goals: [
      'Reduce pick motion with economy/outside-inside awareness',
      'Stay relaxed at moderate speed before chasing velocity',
      'Prefer accuracy of the grid over blur (Economy Picking Seed day 205)'
    ],
    theoryBite: 'Economy picking is about a smarter pick path across strings. Loose and even beats chasing speed too early (Economy Picking Seed).',
    drills: [
      'Two-string scale fragment focusing on efficient pick direction — keep it about Economy Picking Seed',
      'Slow 16ths on a 3-note-per-string idea (or simple box)',
      'Stop at first tension in forearm — shake out',
      '8 bars musical, not mechanical, using the efficient path (Economy Picking Seed day 205)'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play an 8-bar efficient-picking fragment cleanly at a tempo that stays relaxed (Economy Picking Seed).',
  },
  206: {

    title: 'Hybrid Picking Taste (2)',
    durationMin: 30,
    goals: [
      'Combine pick bass notes with finger snags on higher strings',
      'Keep the pattern steady enough to be a texture',
      'Use hybrid for country/funk color inside a simple progression (Hybrid Picking Taste day 206)'
    ],
    theoryBite: 'Hybrid picking gives you more ways to attack a note. Pick/thumb on the lows, fingers on the highs — independence is the work (Hybrid Picking Taste).',
    drills: [
      'Pick low root on beats 1 and 3 — keep it about Hybrid Picking Taste',
      'Middle finger plucks a higher string on 2 and 4',
      'Combine into a rolling pattern on C or G shapes',
      '8-bar progression with hybrid texture throughout (Hybrid Picking Taste day 206)'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Maintain an 8-bar hybrid pattern with steady bass/ pick and clear finger snags (Hybrid Picking Taste).',
  },
  207: {

    title: 'Motif From a PD Song (2)',
    durationMin: 30,
    goals: [
      'Steal a contour from a public-domain melody ethically as study',
      'Vary rhythm while keeping contour recognizable',
      'Return the motif as a hook inside your own phrasing (Motif From a PD Song day 207)'
    ],
    theoryBite: 'Public-domain melodies are free teachers. Borrowing a motif to study builds vocabulary without legal drama (Motif From a PD Song).',
    drills: [
      'Learn 2 bars of a PD tune slowly from the library tab — keep it about Motif From a PD Song',
      'Play it an octave away or in a new position',
      'Change only the rhythm, keep pitches',
      'Improv 8 bars that quote the motif once (Motif From a PD Song day 207)'
    ],
    libraryIds: [
      'sg-maple-leaf-rag-motif-joplin-publ',
      'sg-home-on-the-range'
    ],
    masteryCheck: 'Quote a PD motif once inside an 8-bar improvised phrase where the quote is recognizable (Motif From a PD Song).',
  },
  208: {

    title: 'Weekly Lead Checkpoint (2)',
    durationMin: 30,
    goals: [
      'Combine motif, space, and one expression tool (bend/vibrato/slide)',
      'Record a short take as evidence',
      'Write one keep and one fix with kind wording (Weekly Lead Checkpoint day 208)'
    ],
    theoryBite: 'Lead checkpoints check your taste with a clock running. A short recorded solo plus a quick note beats endless noodling you forget (Weekly Lead Checkpoint).',
    drills: [
      'Warm-up long tones + light bends 2 minutes — keep it about Weekly Lead Checkpoint',
      'Motif/rest practice 8 cycles',
      '12-bar or 16-bar soloette over a library vamp/progression',
      'Listen once kindly, once with a pencil note (Weekly Lead Checkpoint day 208)'
    ],
    libraryIds: [
      'rf-em-pentatonic-box-study',
      'sg-silent-night'
    ],
    masteryCheck: 'Save one short lead take that shows space plus one expressive tool, with a written keep and fix (Weekly Lead Checkpoint).',
  },
  209: {

    title: 'Bend Vocabulary — Release & Pre-Bend (2)',
    durationMin: 30,
    goals: [
      'Bend to a target pitch you can name or match',
      'Release bends as musically as you attack them',
      'Keep supporting fingers helping the bend without clamping the neck (Bend Vocabulary — Release & Pre-Bend day 209)'
    ],
    theoryBite: 'A bend is a portable slur to a chord tone. Landing in tune beats bending far (Release & Pre-Bend) (Release & Pre-Bend day 2).',
    drills: [
      'Fret a target note, then bend from a whole step below into it — match sustain — keep it about Bend Vocabulary — Release & Pre-Bend',
      'Pre-bend silently, then release into the lower pitch',
      'Bend-and-hold 2 beats in tune, then resolve down',
      'Use bends only on phrase endings for 8 bars over a vamp (Bend Vocabulary — Release & Pre-Bend day 209)'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Land four consecutive whole-step bends on pitch (close enough that your ear is happy) at slow tempo (Release & Pre-Bend) (Release & Pre-Bend day 2).',
  },
  210: {

    title: 'Sequence Climb — Melodic Sequences Up (3)',
    durationMin: 35,
    goals: [
      'Move a melodic cell up or down the scale systematically',
      'Keep rhythm identical while pitch shifts',
      'Stop sequencing before it becomes mechanical noise (Sequence Climb — Melodic Sequences Up day 210)'
    ],
    theoryBite: 'Sequences create forward motion people can feel coming — then break the pattern so it breathes (Melodic Sequences Up) (Melodic Sequences Up day 3).',
    drills: [
      'Cell of 4 notes; sequence up diatonically 3 times — keep it about Sequence Climb — Melodic Sequences Up',
      'Same 4-note cell descending diatonically 3 times, same tempo',
      'Break the fourth repeat with a long tone',
      'Apply over a static chord then over a change (Sequence Climb — Melodic Sequences Up day 210)'
    ],
    libraryIds: [
      'rf-funk-chicka-study',
      'sg-arkansas-traveler'
    ],
    masteryCheck: 'Play a clear ascending sequence of a 4-note cell three times and resolve with a long tone (Melodic Sequences Up) (Melodic Sequences Up day 3).',
  },
  211: {

    title: 'Question Harmony — Solo Over Andalusian (3)',
    durationMin: 30,
    goals: [
      'Outline the Andalusian bass motion while soloing lightly',
      'Choose notes that respect each chord\'s color',
      'Use Phrygian/Spanish flavor without rushing (Question Harmony — Solo Over Andalusian day 211)'
    ],
    theoryBite: 'The Andalusian cadence (e.g. Am–G–F–E) is a little story that loops. Your lead notes should notice each chord, especially that E major tension (Solo Over Andalusian) (Solo Over Andalusian day 3).',
    drills: [
      'Comp the progression slowly, name each chord — keep it about Question Harmony — Solo Over Andalusian',
      'Roots-only lead through one cycle',
      'Add neighbor tones into each root',
      'One expressive cycle with space on the E chord (Question Harmony — Solo Over Andalusian day 211)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'Solo one full Andalusian cycle that clearly changes color chord-to-chord, especially into E (Solo Over Andalusian) (Solo Over Andalusian day 3).',
  },
  212: {

    title: 'Economy Picking Seed (3)',
    durationMin: 30,
    goals: [
      'Reduce pick motion with economy/outside-inside awareness',
      'Stay relaxed at moderate speed before chasing velocity',
      'Prefer accuracy of the grid over blur (Economy Picking Seed day 212)'
    ],
    theoryBite: 'Economy picking is about a smarter pick path across strings. Loose and even beats chasing speed too early (Economy Picking Seed) (Economy Picking Seed day 3).',
    drills: [
      'Two-string scale fragment focusing on efficient pick direction — keep it about Economy Picking Seed',
      'Slow 16ths on a 3-note-per-string idea (or simple box)',
      'Stop at first tension in forearm — shake out',
      '8 bars musical, not mechanical, using the efficient path (Economy Picking Seed day 212)'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play an 8-bar efficient-picking fragment cleanly at a tempo that stays relaxed (Economy Picking Seed) (Economy Picking Seed day 3).',
  },
  213: {

    title: 'Hybrid Picking Taste (3)',
    durationMin: 30,
    goals: [
      'Combine pick bass notes with finger snags on higher strings',
      'Keep the pattern steady enough to be a texture',
      'Use hybrid for country/funk color inside a simple progression (Hybrid Picking Taste day 213)'
    ],
    theoryBite: 'Hybrid picking gives you more ways to attack a note. Pick/thumb on the lows, fingers on the highs — independence is the work (Hybrid Picking Taste) (Hybrid Picking Taste day 3).',
    drills: [
      'Pick low root on beats 1 and 3 — keep it about Hybrid Picking Taste',
      'Middle finger plucks a higher string on 2 and 4',
      'Combine into a rolling pattern on C or G shapes',
      '8-bar progression with hybrid texture throughout (Hybrid Picking Taste day 213)'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Maintain an 8-bar hybrid pattern with steady bass/ pick and clear finger snags (Hybrid Picking Taste) (Hybrid Picking Taste day 3).',
  },
  214: {

    title: 'Motif From a PD Song (3)',
    durationMin: 30,
    goals: [
      'Steal a contour from a public-domain melody ethically as study',
      'Vary rhythm while keeping contour recognizable',
      'Return the motif as a hook inside your own phrasing (Motif From a PD Song day 214)'
    ],
    theoryBite: 'Public-domain melodies are free teachers. Borrowing a motif to study builds vocabulary without legal drama (Motif From a PD Song) (Motif From a PD Song day 3).',
    drills: [
      'Learn 2 bars of a PD tune slowly from the library tab — keep it about Motif From a PD Song',
      'Play it an octave away or in a new position',
      'Change only the rhythm, keep pitches',
      'Improv 8 bars that quote the motif once (Motif From a PD Song day 214)'
    ],
    libraryIds: [
      'sg-joshua-fit-the-battle-of-jericho',
      'sg-buffalo-gals'
    ],
    masteryCheck: 'Quote a PD motif once inside an 8-bar improvised phrase where the quote is recognizable (Motif From a PD Song) (Motif From a PD Song day 3).',
  },
  215: {

    title: 'Weekly Lead Checkpoint (3)',
    durationMin: 30,
    goals: [
      'Combine motif, space, and one expression tool (bend/vibrato/slide)',
      'Record a short take as evidence',
      'Write one keep and one fix with kind wording (Weekly Lead Checkpoint day 215)'
    ],
    theoryBite: 'Lead checkpoints check your taste with a clock running. A short recorded solo plus a quick note beats endless noodling you forget (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 3).',
    drills: [
      'Warm-up long tones + light bends 2 minutes — keep it about Weekly Lead Checkpoint',
      'Motif/rest practice 8 cycles',
      '12-bar or 16-bar soloette over a library vamp/progression',
      'Listen once kindly, once with a pencil note (Weekly Lead Checkpoint day 215)'
    ],
    libraryIds: [
      'rf-d-folk-pattern-study',
      'sg-drunken-sailor'
    ],
    masteryCheck: 'Save one short lead take that shows space plus one expressive tool, with a written keep and fix (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 3).',
  },
  216: {

    title: 'Bend Vocabulary — Release & Pre-Bend (3)',
    durationMin: 30,
    goals: [
      'Bend to a target pitch you can name or match',
      'Release bends as musically as you attack them',
      'Keep supporting fingers helping the bend without clamping the neck (Bend Vocabulary — Release & Pre-Bend day 216)'
    ],
    theoryBite: 'A bend is a portable slur to a chord tone. Landing in tune beats bending far (Release & Pre-Bend) (Release & Pre-Bend day 3).',
    drills: [
      'Fret a target note, then bend from a whole step below into it — match sustain — keep it about Bend Vocabulary — Release & Pre-Bend',
      'Pre-bend silently, then release into the lower pitch',
      'Bend-and-hold 2 beats in tune, then resolve down',
      'Use bends only on phrase endings for 8 bars over a vamp (Bend Vocabulary — Release & Pre-Bend day 216)'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Land four consecutive whole-step bends on pitch (close enough that your ear is happy) at slow tempo (Release & Pre-Bend) (Release & Pre-Bend day 3).',
  },
  217: {

    title: 'Sequence Climb — Melodic Sequences Up (4)',
    durationMin: 35,
    goals: [
      'Move a melodic cell up or down the scale systematically',
      'Keep rhythm identical while pitch shifts',
      'Stop sequencing before it becomes mechanical noise (Sequence Climb — Melodic Sequences Up day 217)'
    ],
    theoryBite: 'Sequences create forward motion people can feel coming — then break the pattern so it breathes (Melodic Sequences Up) (Melodic Sequences Up day 4).',
    drills: [
      'Cell of 4 notes; sequence up diatonically 3 times — keep it about Sequence Climb — Melodic Sequences Up',
      'Same 4-note cell descending diatonically 3 times, same tempo',
      'Break the fourth repeat with a long tone',
      'Apply over a static chord then over a change (Sequence Climb — Melodic Sequences Up day 217)'
    ],
    libraryIds: [
      'rf-palm-mute-chug-study',
      'sg-aura-lee'
    ],
    masteryCheck: 'Play a clear ascending sequence of a 4-note cell three times and resolve with a long tone (Melodic Sequences Up) (Melodic Sequences Up day 4).',
  },
  218: {

    title: 'Question Harmony — Solo Over Andalusian (4)',
    durationMin: 30,
    goals: [
      'Outline the Andalusian bass motion while soloing lightly',
      'Choose notes that respect each chord\'s color',
      'Use Phrygian/Spanish flavor without rushing (Question Harmony — Solo Over Andalusian day 218)'
    ],
    theoryBite: 'The Andalusian cadence (e.g. Am–G–F–E) is a little story that loops. Your lead notes should notice each chord, especially that E major tension (Solo Over Andalusian) (Solo Over Andalusian day 4).',
    drills: [
      'Comp the progression slowly, name each chord — keep it about Question Harmony — Solo Over Andalusian',
      'Roots-only lead through one cycle',
      'Add neighbor tones into each root',
      'One expressive cycle with space on the E chord (Question Harmony — Solo Over Andalusian day 218)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'Solo one full Andalusian cycle that clearly changes color chord-to-chord, especially into E (Solo Over Andalusian) (Solo Over Andalusian day 4).',
  },
  219: {

    title: 'Economy Picking Seed (4)',
    durationMin: 30,
    goals: [
      'Reduce pick motion with economy/outside-inside awareness',
      'Stay relaxed at moderate speed before chasing velocity',
      'Prefer accuracy of the grid over blur (Economy Picking Seed day 219)'
    ],
    theoryBite: 'Economy picking is about a smarter pick path across strings. Loose and even beats chasing speed too early (Economy Picking Seed) (Economy Picking Seed day 4).',
    drills: [
      'Two-string scale fragment focusing on efficient pick direction — keep it about Economy Picking Seed',
      'Slow 16ths on a 3-note-per-string idea (or simple box)',
      'Stop at first tension in forearm — shake out',
      '8 bars musical, not mechanical, using the efficient path (Economy Picking Seed day 219)'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play an 8-bar efficient-picking fragment cleanly at a tempo that stays relaxed (Economy Picking Seed) (Economy Picking Seed day 4).',
  },
  220: {

    title: 'Hybrid Picking Taste (4)',
    durationMin: 30,
    goals: [
      'Combine pick bass notes with finger snags on higher strings',
      'Keep the pattern steady enough to be a texture',
      'Use hybrid for country/funk color inside a simple progression (Hybrid Picking Taste day 220)'
    ],
    theoryBite: 'Hybrid picking gives you more ways to attack a note. Pick/thumb on the lows, fingers on the highs — independence is the work (Hybrid Picking Taste) (Hybrid Picking Taste day 4).',
    drills: [
      'Pick low root on beats 1 and 3 — keep it about Hybrid Picking Taste',
      'Middle finger plucks a higher string on 2 and 4',
      'Combine into a rolling pattern on C or G shapes',
      '8-bar progression with hybrid texture throughout (Hybrid Picking Taste day 220)'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Maintain an 8-bar hybrid pattern with steady bass/ pick and clear finger snags (Hybrid Picking Taste) (Hybrid Picking Taste day 4).',
  },
  221: {

    title: 'Motif From a PD Song (4)',
    durationMin: 30,
    goals: [
      'Steal a contour from a public-domain melody ethically as study',
      'Vary rhythm while keeping contour recognizable',
      'Return the motif as a hook inside your own phrasing (Motif From a PD Song day 221)'
    ],
    theoryBite: 'Public-domain melodies are free teachers. Borrowing a motif to study builds vocabulary without legal drama (Motif From a PD Song) (Motif From a PD Song day 4).',
    drills: [
      'Learn 2 bars of a PD tune slowly from the library tab — keep it about Motif From a PD Song',
      'Play it an octave away or in a new position',
      'Change only the rhythm, keep pitches',
      'Improv 8 bars that quote the motif once (Motif From a PD Song day 221)'
    ],
    libraryIds: [
      'sg-greensleeves',
      'sg-barbara-allen'
    ],
    masteryCheck: 'Quote a PD motif once inside an 8-bar improvised phrase where the quote is recognizable (Motif From a PD Song) (Motif From a PD Song day 4).',
  },
  222: {

    title: 'Weekly Lead Checkpoint (4)',
    durationMin: 30,
    goals: [
      'Combine motif, space, and one expression tool (bend/vibrato/slide)',
      'Record a short take as evidence',
      'Write one keep and one fix with kind wording (Weekly Lead Checkpoint day 222)'
    ],
    theoryBite: 'Lead checkpoints check your taste with a clock running. A short recorded solo plus a quick note beats endless noodling you forget (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 4).',
    drills: [
      'Warm-up long tones + light bends 2 minutes — keep it about Weekly Lead Checkpoint',
      'Motif/rest practice 8 cycles',
      '12-bar or 16-bar soloette over a library vamp/progression',
      'Listen once kindly, once with a pencil note (Weekly Lead Checkpoint day 222)'
    ],
    libraryIds: [
      'rf-a-blues-turnaround-study',
      'sg-simple-gifts'
    ],
    masteryCheck: 'Save one short lead take that shows space plus one expressive tool, with a written keep and fix (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 4).',
  },
  223: {

    title: 'Bend Vocabulary — Release & Pre-Bend (4)',
    durationMin: 30,
    goals: [
      'Bend to a target pitch you can name or match',
      'Release bends as musically as you attack them',
      'Keep supporting fingers helping the bend without clamping the neck (Bend Vocabulary — Release & Pre-Bend day 223)'
    ],
    theoryBite: 'A bend is a portable slur to a chord tone. Landing in tune beats bending far (Release & Pre-Bend) (Release & Pre-Bend day 4).',
    drills: [
      'Fret a target note, then bend from a whole step below into it — match sustain — keep it about Bend Vocabulary — Release & Pre-Bend',
      'Pre-bend silently, then release into the lower pitch',
      'Bend-and-hold 2 beats in tune, then resolve down',
      'Use bends only on phrase endings for 8 bars over a vamp (Bend Vocabulary — Release & Pre-Bend day 223)'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Land four consecutive whole-step bends on pitch (close enough that your ear is happy) at slow tempo (Release & Pre-Bend) (Release & Pre-Bend day 4).',
  },
  224: {

    title: 'Sequence Climb — Melodic Sequences Up (5)',
    durationMin: 35,
    goals: [
      'Move a melodic cell up or down the scale systematically',
      'Keep rhythm identical while pitch shifts',
      'Stop sequencing before it becomes mechanical noise (Sequence Climb — Melodic Sequences Up day 224)'
    ],
    theoryBite: 'Sequences create forward motion people can feel coming — then break the pattern so it breathes (Melodic Sequences Up) (Melodic Sequences Up day 5).',
    drills: [
      'Cell of 4 notes; sequence up diatonically 3 times — keep it about Sequence Climb — Melodic Sequences Up',
      'Same 4-note cell descending diatonically 3 times, same tempo',
      'Break the fourth repeat with a long tone',
      'Apply over a static chord then over a change (Sequence Climb — Melodic Sequences Up day 224)'
    ],
    libraryIds: [
      'rf-jazz-chromatic-approach-study',
      'sg-the-parting-glass'
    ],
    masteryCheck: 'Play a clear ascending sequence of a 4-note cell three times and resolve with a long tone (Melodic Sequences Up) (Melodic Sequences Up day 5).',
  },
  225: {

    title: 'Question Harmony — Solo Over Andalusian (5)',
    durationMin: 30,
    goals: [
      'Outline the Andalusian bass motion while soloing lightly',
      'Choose notes that respect each chord\'s color',
      'Use Phrygian/Spanish flavor without rushing (Question Harmony — Solo Over Andalusian day 225)'
    ],
    theoryBite: 'The Andalusian cadence (e.g. Am–G–F–E) is a little story that loops. Your lead notes should notice each chord, especially that E major tension (Solo Over Andalusian) (Solo Over Andalusian day 5).',
    drills: [
      'Comp the progression slowly, name each chord — keep it about Question Harmony — Solo Over Andalusian',
      'Roots-only lead through one cycle',
      'Add neighbor tones into each root',
      'One expressive cycle with space on the E chord (Question Harmony — Solo Over Andalusian day 225)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'Solo one full Andalusian cycle that clearly changes color chord-to-chord, especially into E (Solo Over Andalusian) (Solo Over Andalusian day 5).',
  },
  226: {

    title: 'Economy Picking Seed (5)',
    durationMin: 30,
    goals: [
      'Reduce pick motion with economy/outside-inside awareness',
      'Stay relaxed at moderate speed before chasing velocity',
      'Prefer accuracy of the grid over blur (Economy Picking Seed day 226)'
    ],
    theoryBite: 'Economy picking is about a smarter pick path across strings. Loose and even beats chasing speed too early (Economy Picking Seed) (Economy Picking Seed day 5).',
    drills: [
      'Two-string scale fragment focusing on efficient pick direction — keep it about Economy Picking Seed',
      'Slow 16ths on a 3-note-per-string idea (or simple box)',
      'Stop at first tension in forearm — shake out',
      '8 bars musical, not mechanical, using the efficient path (Economy Picking Seed day 226)'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play an 8-bar efficient-picking fragment cleanly at a tempo that stays relaxed (Economy Picking Seed) (Economy Picking Seed day 5).',
  },
  227: {

    title: 'Hybrid Picking Taste (5)',
    durationMin: 30,
    goals: [
      'Combine pick bass notes with finger snags on higher strings',
      'Keep the pattern steady enough to be a texture',
      'Use hybrid for country/funk color inside a simple progression (Hybrid Picking Taste day 227)'
    ],
    theoryBite: 'Hybrid picking gives you more ways to attack a note. Pick/thumb on the lows, fingers on the highs — independence is the work (Hybrid Picking Taste) (Hybrid Picking Taste day 5).',
    drills: [
      'Pick low root on beats 1 and 3 — keep it about Hybrid Picking Taste',
      'Middle finger plucks a higher string on 2 and 4',
      'Combine into a rolling pattern on C or G shapes',
      '8-bar progression with hybrid texture throughout (Hybrid Picking Taste day 227)'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Maintain an 8-bar hybrid pattern with steady bass/ pick and clear finger snags (Hybrid Picking Taste) (Hybrid Picking Taste day 5).',
  },
  228: {

    title: 'Motif From a PD Song (5)',
    durationMin: 30,
    goals: [
      'Steal a contour from a public-domain melody ethically as study',
      'Vary rhythm while keeping contour recognizable',
      'Return the motif as a hook inside your own phrasing (Motif From a PD Song day 228)'
    ],
    theoryBite: 'Public-domain melodies are free teachers. Borrowing a motif to study builds vocabulary without legal drama (Motif From a PD Song) (Motif From a PD Song day 5).',
    drills: [
      'Learn 2 bars of a PD tune slowly from the library tab — keep it about Motif From a PD Song',
      'Play it an octave away or in a new position',
      'Change only the rhythm, keep pitches',
      'Improv 8 bars that quote the motif once (Motif From a PD Song day 228)'
    ],
    libraryIds: [
      'sg-silent-night',
      'sg-sailor-s-hornpipe'
    ],
    masteryCheck: 'Quote a PD motif once inside an 8-bar improvised phrase where the quote is recognizable (Motif From a PD Song) (Motif From a PD Song day 5).',
  },
  229: {

    title: 'Weekly Lead Checkpoint (5)',
    durationMin: 30,
    goals: [
      'Combine motif, space, and one expression tool (bend/vibrato/slide)',
      'Record a short take as evidence',
      'Write one keep and one fix with kind wording (Weekly Lead Checkpoint day 229)'
    ],
    theoryBite: 'Lead checkpoints check your taste with a clock running. A short recorded solo plus a quick note beats endless noodling you forget (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 5).',
    drills: [
      'Warm-up long tones + light bends 2 minutes — keep it about Weekly Lead Checkpoint',
      'Motif/rest practice 8 cycles',
      '12-bar or 16-bar soloette over a library vamp/progression',
      'Listen once kindly, once with a pencil note (Weekly Lead Checkpoint day 229)'
    ],
    libraryIds: [
      'rf-g-caged-run-study',
      'sg-turkey-in-the-straw'
    ],
    masteryCheck: 'Save one short lead take that shows space plus one expressive tool, with a written keep and fix (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 5).',
  },
  230: {

    title: 'Bend Vocabulary — Release & Pre-Bend (5)',
    durationMin: 30,
    goals: [
      'Bend to a target pitch you can name or match',
      'Release bends as musically as you attack them',
      'Keep supporting fingers helping the bend without clamping the neck (Bend Vocabulary — Release & Pre-Bend day 230)'
    ],
    theoryBite: 'A bend is a portable slur to a chord tone. Landing in tune beats bending far (Release & Pre-Bend) (Release & Pre-Bend day 5).',
    drills: [
      'Fret a target note, then bend from a whole step below into it — match sustain — keep it about Bend Vocabulary — Release & Pre-Bend',
      'Pre-bend silently, then release into the lower pitch',
      'Bend-and-hold 2 beats in tune, then resolve down',
      'Use bends only on phrase endings for 8 bars over a vamp (Bend Vocabulary — Release & Pre-Bend day 230)'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Land four consecutive whole-step bends on pitch (close enough that your ear is happy) at slow tempo (Release & Pre-Bend) (Release & Pre-Bend day 5).',
  },
  231: {

    title: 'Sequence Climb — Melodic Sequences Up (6)',
    durationMin: 35,
    goals: [
      'Move a melodic cell up or down the scale systematically',
      'Keep rhythm identical while pitch shifts',
      'Stop sequencing before it becomes mechanical noise (Sequence Climb — Melodic Sequences Up day 231)'
    ],
    theoryBite: 'Sequences create forward motion people can feel coming — then break the pattern so it breathes (Melodic Sequences Up) (Melodic Sequences Up day 6).',
    drills: [
      'Cell of 4 notes; sequence up diatonically 3 times — keep it about Sequence Climb — Melodic Sequences Up',
      'Same 4-note cell descending diatonically 3 times, same tempo',
      'Break the fourth repeat with a long tone',
      'Apply over a static chord then over a change (Sequence Climb — Melodic Sequences Up day 231)'
    ],
    libraryIds: [
      'rf-am-arpeggio-cascade',
      'sg-red-river-valley'
    ],
    masteryCheck: 'Play a clear ascending sequence of a 4-note cell three times and resolve with a long tone (Melodic Sequences Up) (Melodic Sequences Up day 6).',
  },
  232: {

    title: 'Question Harmony — Solo Over Andalusian (6)',
    durationMin: 30,
    goals: [
      'Outline the Andalusian bass motion while soloing lightly',
      'Choose notes that respect each chord\'s color',
      'Use Phrygian/Spanish flavor without rushing (Question Harmony — Solo Over Andalusian day 232)'
    ],
    theoryBite: 'The Andalusian cadence (e.g. Am–G–F–E) is a little story that loops. Your lead notes should notice each chord, especially that E major tension (Solo Over Andalusian) (Solo Over Andalusian day 6).',
    drills: [
      'Comp the progression slowly, name each chord — keep it about Question Harmony — Solo Over Andalusian',
      'Roots-only lead through one cycle',
      'Add neighbor tones into each root',
      'One expressive cycle with space on the E chord (Question Harmony — Solo Over Andalusian day 232)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'Solo one full Andalusian cycle that clearly changes color chord-to-chord, especially into E (Solo Over Andalusian) (Solo Over Andalusian day 6).',
  },
  233: {

    title: 'Economy Picking Seed (6)',
    durationMin: 30,
    goals: [
      'Reduce pick motion with economy/outside-inside awareness',
      'Stay relaxed at moderate speed before chasing velocity',
      'Prefer accuracy of the grid over blur (Economy Picking Seed day 233)'
    ],
    theoryBite: 'Economy picking is about a smarter pick path across strings. Loose and even beats chasing speed too early (Economy Picking Seed) (Economy Picking Seed day 6).',
    drills: [
      'Two-string scale fragment focusing on efficient pick direction — keep it about Economy Picking Seed',
      'Slow 16ths on a 3-note-per-string idea (or simple box)',
      'Stop at first tension in forearm — shake out',
      '8 bars musical, not mechanical, using the efficient path (Economy Picking Seed day 233)'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play an 8-bar efficient-picking fragment cleanly at a tempo that stays relaxed (Economy Picking Seed) (Economy Picking Seed day 6).',
  },
  234: {

    title: 'Hybrid Picking Taste (6)',
    durationMin: 30,
    goals: [
      'Combine pick bass notes with finger snags on higher strings',
      'Keep the pattern steady enough to be a texture',
      'Use hybrid for country/funk color inside a simple progression (Hybrid Picking Taste day 234)'
    ],
    theoryBite: 'Hybrid picking gives you more ways to attack a note. Pick/thumb on the lows, fingers on the highs — independence is the work (Hybrid Picking Taste) (Hybrid Picking Taste day 6).',
    drills: [
      'Pick low root on beats 1 and 3 — keep it about Hybrid Picking Taste',
      'Middle finger plucks a higher string on 2 and 4',
      'Combine into a rolling pattern on C or G shapes',
      '8-bar progression with hybrid texture throughout (Hybrid Picking Taste day 234)'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Maintain an 8-bar hybrid pattern with steady bass/ pick and clear finger snags (Hybrid Picking Taste) (Hybrid Picking Taste day 6).',
  },
  235: {

    title: 'Motif From a PD Song (6)',
    durationMin: 30,
    goals: [
      'Steal a contour from a public-domain melody ethically as study',
      'Vary rhythm while keeping contour recognizable',
      'Return the motif as a hook inside your own phrasing (Motif From a PD Song day 235)'
    ],
    theoryBite: 'Public-domain melodies are free teachers. Borrowing a motif to study builds vocabulary without legal drama (Motif From a PD Song) (Motif From a PD Song day 6).',
    drills: [
      'Learn 2 bars of a PD tune slowly from the library tab — keep it about Motif From a PD Song',
      'Play it an octave away or in a new position',
      'Change only the rhythm, keep pitches',
      'Improv 8 bars that quote the motif once (Motif From a PD Song day 235)'
    ],
    libraryIds: [
      'sg-red-river-valley',
      'sg-wild-mountain-thyme'
    ],
    masteryCheck: 'Quote a PD motif once inside an 8-bar improvised phrase where the quote is recognizable (Motif From a PD Song) (Motif From a PD Song day 6).',
  },
  236: {

    title: 'Weekly Lead Checkpoint (6)',
    durationMin: 30,
    goals: [
      'Combine motif, space, and one expression tool (bend/vibrato/slide)',
      'Record a short take as evidence',
      'Write one keep and one fix with kind wording (Weekly Lead Checkpoint day 236)'
    ],
    theoryBite: 'Lead checkpoints check your taste with a clock running. A short recorded solo plus a quick note beats endless noodling you forget (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 6).',
    drills: [
      'Warm-up long tones + light bends 2 minutes — keep it about Weekly Lead Checkpoint',
      'Motif/rest practice 8 cycles',
      '12-bar or 16-bar soloette over a library vamp/progression',
      'Listen once kindly, once with a pencil note (Weekly Lead Checkpoint day 236)'
    ],
    libraryIds: [
      'rf-c-bass-walk-study',
      'sg-joshua-fit-the-battle-of-jericho'
    ],
    masteryCheck: 'Save one short lead take that shows space plus one expressive tool, with a written keep and fix (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 6).',
  },
  237: {

    title: 'Bend Vocabulary — Release & Pre-Bend (6)',
    durationMin: 30,
    goals: [
      'Bend to a target pitch you can name or match',
      'Release bends as musically as you attack them',
      'Keep supporting fingers helping the bend without clamping the neck (Bend Vocabulary — Release & Pre-Bend day 237)'
    ],
    theoryBite: 'A bend is a portable slur to a chord tone. Landing in tune beats bending far (Release & Pre-Bend) (Release & Pre-Bend day 6).',
    drills: [
      'Fret a target note, then bend from a whole step below into it — match sustain — keep it about Bend Vocabulary — Release & Pre-Bend',
      'Pre-bend silently, then release into the lower pitch',
      'Bend-and-hold 2 beats in tune, then resolve down',
      'Use bends only on phrase endings for 8 bars over a vamp (Bend Vocabulary — Release & Pre-Bend day 237)'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Land four consecutive whole-step bends on pitch (close enough that your ear is happy) at slow tempo (Release & Pre-Bend) (Release & Pre-Bend day 6).',
  },
  238: {

    title: 'Sequence Climb — Melodic Sequences Up (7)',
    durationMin: 35,
    goals: [
      'Move a melodic cell up or down the scale systematically',
      'Keep rhythm identical while pitch shifts',
      'Stop sequencing before it becomes mechanical noise (Sequence Climb — Melodic Sequences Up day 238)'
    ],
    theoryBite: 'Sequences create forward motion people can feel coming — then break the pattern so it breathes (Melodic Sequences Up) (Melodic Sequences Up day 7).',
    drills: [
      'Cell of 4 notes; sequence up diatonically 3 times — keep it about Sequence Climb — Melodic Sequences Up',
      'Same 4-note cell descending diatonically 3 times, same tempo',
      'Break the fourth repeat with a long tone',
      'Apply over a static chord then over a change (Sequence Climb — Melodic Sequences Up day 238)'
    ],
    libraryIds: [
      'rf-drop-d-power-study',
      'sg-i-ve-been-working-on-the-railroa'
    ],
    masteryCheck: 'Play a clear ascending sequence of a 4-note cell three times and resolve with a long tone (Melodic Sequences Up) (Melodic Sequences Up day 7).',
  },
  239: {

    title: 'Question Harmony — Solo Over Andalusian (7)',
    durationMin: 30,
    goals: [
      'Outline the Andalusian bass motion while soloing lightly',
      'Choose notes that respect each chord\'s color',
      'Use Phrygian/Spanish flavor without rushing (Question Harmony — Solo Over Andalusian day 239)'
    ],
    theoryBite: 'The Andalusian cadence (e.g. Am–G–F–E) is a little story that loops. Your lead notes should notice each chord, especially that E major tension (Solo Over Andalusian) (Solo Over Andalusian day 7).',
    drills: [
      'Comp the progression slowly, name each chord — keep it about Question Harmony — Solo Over Andalusian',
      'Roots-only lead through one cycle',
      'Add neighbor tones into each root',
      'One expressive cycle with space on the E chord (Question Harmony — Solo Over Andalusian day 239)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'Solo one full Andalusian cycle that clearly changes color chord-to-chord, especially into E (Solo Over Andalusian) (Solo Over Andalusian day 7).',
  },
  240: {

    title: 'Economy Picking Seed (7)',
    durationMin: 30,
    goals: [
      'Reduce pick motion with economy/outside-inside awareness',
      'Stay relaxed at moderate speed before chasing velocity',
      'Prefer accuracy of the grid over blur (Economy Picking Seed day 240)'
    ],
    theoryBite: 'Economy picking is about a smarter pick path across strings. Loose and even beats chasing speed too early (Economy Picking Seed) (Economy Picking Seed day 7).',
    drills: [
      'Two-string scale fragment focusing on efficient pick direction — keep it about Economy Picking Seed',
      'Slow 16ths on a 3-note-per-string idea (or simple box)',
      'Stop at first tension in forearm — shake out',
      '8 bars musical, not mechanical, using the efficient path (Economy Picking Seed day 240)'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play an 8-bar efficient-picking fragment cleanly at a tempo that stays relaxed (Economy Picking Seed) (Economy Picking Seed day 7).',
  },
  241: {

    title: 'Hybrid Picking Taste (7)',
    durationMin: 30,
    goals: [
      'Combine pick bass notes with finger snags on higher strings',
      'Keep the pattern steady enough to be a texture',
      'Use hybrid for country/funk color inside a simple progression (Hybrid Picking Taste day 241)'
    ],
    theoryBite: 'Hybrid picking gives you more ways to attack a note. Pick/thumb on the lows, fingers on the highs — independence is the work (Hybrid Picking Taste) (Hybrid Picking Taste day 7).',
    drills: [
      'Pick low root on beats 1 and 3 — keep it about Hybrid Picking Taste',
      'Middle finger plucks a higher string on 2 and 4',
      'Combine into a rolling pattern on C or G shapes',
      '8-bar progression with hybrid texture throughout (Hybrid Picking Taste day 241)'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Maintain an 8-bar hybrid pattern with steady bass/ pick and clear finger snags (Hybrid Picking Taste) (Hybrid Picking Taste day 7).',
  },
  242: {

    title: 'Motif From a PD Song (7)',
    durationMin: 30,
    goals: [
      'Steal a contour from a public-domain melody ethically as study',
      'Vary rhythm while keeping contour recognizable',
      'Return the motif as a hook inside your own phrasing (Motif From a PD Song day 242)'
    ],
    theoryBite: 'Public-domain melodies are free teachers. Borrowing a motif to study builds vocabulary without legal drama (Motif From a PD Song) (Motif From a PD Song day 7).',
    drills: [
      'Learn 2 bars of a PD tune slowly from the library tab — keep it about Motif From a PD Song',
      'Play it an octave away or in a new position',
      'Change only the rhythm, keep pitches',
      'Improv 8 bars that quote the motif once (Motif From a PD Song day 242)'
    ],
    libraryIds: [
      'sg-i-ve-been-working-on-the-railroa',
      'sg-canon-in-d-pachelbel-theme-publi'
    ],
    masteryCheck: 'Quote a PD motif once inside an 8-bar improvised phrase where the quote is recognizable (Motif From a PD Song) (Motif From a PD Song day 7).',
  },
  243: {

    title: 'Weekly Lead Checkpoint (7)',
    durationMin: 30,
    goals: [
      'Combine motif, space, and one expression tool (bend/vibrato/slide)',
      'Record a short take as evidence',
      'Write one keep and one fix with kind wording (Weekly Lead Checkpoint day 243)'
    ],
    theoryBite: 'Lead checkpoints check your taste with a clock running. A short recorded solo plus a quick note beats endless noodling you forget (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 7).',
    drills: [
      'Warm-up long tones + light bends 2 minutes — keep it about Weekly Lead Checkpoint',
      'Motif/rest practice 8 cycles',
      '12-bar or 16-bar soloette over a library vamp/progression',
      'Listen once kindly, once with a pencil note (Weekly Lead Checkpoint day 243)'
    ],
    libraryIds: [
      'rf-spanish-e-phrygian-study',
      'sg-wild-mountain-thyme'
    ],
    masteryCheck: 'Save one short lead take that shows space plus one expressive tool, with a written keep and fix (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 7).',
  },
  244: {

    title: 'Bend Vocabulary — Release & Pre-Bend (7)',
    durationMin: 30,
    goals: [
      'Bend to a target pitch you can name or match',
      'Release bends as musically as you attack them',
      'Keep supporting fingers helping the bend without clamping the neck (Bend Vocabulary — Release & Pre-Bend day 244)'
    ],
    theoryBite: 'A bend is a portable slur to a chord tone. Landing in tune beats bending far (Release & Pre-Bend) (Release & Pre-Bend day 7).',
    drills: [
      'Fret a target note, then bend from a whole step below into it — match sustain — keep it about Bend Vocabulary — Release & Pre-Bend',
      'Pre-bend silently, then release into the lower pitch',
      'Bend-and-hold 2 beats in tune, then resolve down',
      'Use bends only on phrase endings for 8 bars over a vamp (Bend Vocabulary — Release & Pre-Bend day 244)'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Land four consecutive whole-step bends on pitch (close enough that your ear is happy) at slow tempo (Release & Pre-Bend) (Release & Pre-Bend day 7).',
  },
  245: {

    title: 'Sequence Climb — Melodic Sequences Up (8)',
    durationMin: 35,
    goals: [
      'Move a melodic cell up or down the scale systematically',
      'Keep rhythm identical while pitch shifts',
      'Stop sequencing before it becomes mechanical noise (Sequence Climb — Melodic Sequences Up day 245)'
    ],
    theoryBite: 'Sequences create forward motion people can feel coming — then break the pattern so it breathes (Melodic Sequences Up) (Melodic Sequences Up day 8).',
    drills: [
      'Cell of 4 notes; sequence up diatonically 3 times — keep it about Sequence Climb — Melodic Sequences Up',
      'Same 4-note cell descending diatonically 3 times, same tempo',
      'Break the fourth repeat with a long tone',
      'Apply over a static chord then over a change (Sequence Climb — Melodic Sequences Up day 245)'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c',
      'sg-house-of-the-rising-sun'
    ],
    masteryCheck: 'Play a clear ascending sequence of a 4-note cell three times and resolve with a long tone (Melodic Sequences Up) (Melodic Sequences Up day 8).',
  },
  246: {

    title: 'Question Harmony — Solo Over Andalusian (8)',
    durationMin: 30,
    goals: [
      'Outline the Andalusian bass motion while soloing lightly',
      'Choose notes that respect each chord\'s color',
      'Use Phrygian/Spanish flavor without rushing (Question Harmony — Solo Over Andalusian day 246)'
    ],
    theoryBite: 'The Andalusian cadence (e.g. Am–G–F–E) is a little story that loops. Your lead notes should notice each chord, especially that E major tension (Solo Over Andalusian) (Solo Over Andalusian day 8).',
    drills: [
      'Comp the progression slowly, name each chord — keep it about Question Harmony — Solo Over Andalusian',
      'Roots-only lead through one cycle',
      'Add neighbor tones into each root',
      'One expressive cycle with space on the E chord (Question Harmony — Solo Over Andalusian day 246)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'Solo one full Andalusian cycle that clearly changes color chord-to-chord, especially into E (Solo Over Andalusian) (Solo Over Andalusian day 8).',
  },
  247: {

    title: 'Economy Picking Seed (8)',
    durationMin: 30,
    goals: [
      'Reduce pick motion with economy/outside-inside awareness',
      'Stay relaxed at moderate speed before chasing velocity',
      'Prefer accuracy of the grid over blur (Economy Picking Seed day 247)'
    ],
    theoryBite: 'Economy picking is about a smarter pick path across strings. Loose and even beats chasing speed too early (Economy Picking Seed) (Economy Picking Seed day 8).',
    drills: [
      'Two-string scale fragment focusing on efficient pick direction — keep it about Economy Picking Seed',
      'Slow 16ths on a 3-note-per-string idea (or simple box)',
      'Stop at first tension in forearm — shake out',
      '8 bars musical, not mechanical, using the efficient path (Economy Picking Seed day 247)'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play an 8-bar efficient-picking fragment cleanly at a tempo that stays relaxed (Economy Picking Seed) (Economy Picking Seed day 8).',
  },
  248: {

    title: 'Hybrid Picking Taste (8)',
    durationMin: 30,
    goals: [
      'Combine pick bass notes with finger snags on higher strings',
      'Keep the pattern steady enough to be a texture',
      'Use hybrid for country/funk color inside a simple progression (Hybrid Picking Taste day 248)'
    ],
    theoryBite: 'Hybrid picking gives you more ways to attack a note. Pick/thumb on the lows, fingers on the highs — independence is the work (Hybrid Picking Taste) (Hybrid Picking Taste day 8).',
    drills: [
      'Pick low root on beats 1 and 3 — keep it about Hybrid Picking Taste',
      'Middle finger plucks a higher string on 2 and 4',
      'Combine into a rolling pattern on C or G shapes',
      '8-bar progression with hybrid texture throughout (Hybrid Picking Taste day 248)'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Maintain an 8-bar hybrid pattern with steady bass/ pick and clear finger snags (Hybrid Picking Taste) (Hybrid Picking Taste day 8).',
  },
  249: {

    title: 'Motif From a PD Song (8)',
    durationMin: 30,
    goals: [
      'Steal a contour from a public-domain melody ethically as study',
      'Vary rhythm while keeping contour recognizable',
      'Return the motif as a hook inside your own phrasing (Motif From a PD Song day 249)'
    ],
    theoryBite: 'Public-domain melodies are free teachers. Borrowing a motif to study builds vocabulary without legal drama (Motif From a PD Song) (Motif From a PD Song day 8).',
    drills: [
      'Learn 2 bars of a PD tune slowly from the library tab — keep it about Motif From a PD Song',
      'Play it an octave away or in a new position',
      'Change only the rhythm, keep pitches',
      'Improv 8 bars that quote the motif once (Motif From a PD Song day 249)'
    ],
    libraryIds: [
      'sg-wayfaring-stranger',
      'sg-drunken-sailor'
    ],
    masteryCheck: 'Quote a PD motif once inside an 8-bar improvised phrase where the quote is recognizable (Motif From a PD Song) (Motif From a PD Song day 8).',
  },
  250: {

    title: 'Weekly Lead Checkpoint (8)',
    durationMin: 30,
    goals: [
      'Combine motif, space, and one expression tool (bend/vibrato/slide)',
      'Record a short take as evidence',
      'Write one keep and one fix with kind wording (Weekly Lead Checkpoint day 250)'
    ],
    theoryBite: 'Lead checkpoints check your taste with a clock running. A short recorded solo plus a quick note beats endless noodling you forget (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 8).',
    drills: [
      'Warm-up long tones + light bends 2 minutes — keep it about Weekly Lead Checkpoint',
      'Motif/rest practice 8 cycles',
      '12-bar or 16-bar soloette over a library vamp/progression',
      'Listen once kindly, once with a pencil note (Weekly Lead Checkpoint day 250)'
    ],
    libraryIds: [
      'rf-funk-chicka-study',
      'sg-shenandoah'
    ],
    masteryCheck: 'Save one short lead take that shows space plus one expressive tool, with a written keep and fix (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 8).',
  },
  251: {

    title: 'Bend Vocabulary — Release & Pre-Bend (8)',
    durationMin: 30,
    goals: [
      'Bend to a target pitch you can name or match',
      'Release bends as musically as you attack them',
      'Keep supporting fingers helping the bend without clamping the neck (Bend Vocabulary — Release & Pre-Bend day 251)'
    ],
    theoryBite: 'A bend is a portable slur to a chord tone. Landing in tune beats bending far (Release & Pre-Bend) (Release & Pre-Bend day 8).',
    drills: [
      'Fret a target note, then bend from a whole step below into it — match sustain — keep it about Bend Vocabulary — Release & Pre-Bend',
      'Pre-bend silently, then release into the lower pitch',
      'Bend-and-hold 2 beats in tune, then resolve down',
      'Use bends only on phrase endings for 8 bars over a vamp (Bend Vocabulary — Release & Pre-Bend day 251)'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Land four consecutive whole-step bends on pitch (close enough that your ear is happy) at slow tempo (Release & Pre-Bend) (Release & Pre-Bend day 8).',
  },
  252: {

    title: 'Sequence Climb — Melodic Sequences Up (9)',
    durationMin: 35,
    goals: [
      'Move a melodic cell up or down the scale systematically',
      'Keep rhythm identical while pitch shifts',
      'Stop sequencing before it becomes mechanical noise (Sequence Climb — Melodic Sequences Up day 252)'
    ],
    theoryBite: 'Sequences create forward motion people can feel coming — then break the pattern so it breathes (Melodic Sequences Up) (Melodic Sequences Up day 9).',
    drills: [
      'Cell of 4 notes; sequence up diatonically 3 times — keep it about Sequence Climb — Melodic Sequences Up',
      'Same 4-note cell descending diatonically 3 times, same tempo',
      'Break the fourth repeat with a long tone',
      'Apply over a static chord then over a change (Sequence Climb — Melodic Sequences Up day 252)'
    ],
    libraryIds: [
      'rf-natural-harmonics-study',
      'sg-down-by-the-riverside'
    ],
    masteryCheck: 'Play a clear ascending sequence of a 4-note cell three times and resolve with a long tone (Melodic Sequences Up) (Melodic Sequences Up day 9).',
  },
  253: {

    title: 'Question Harmony — Solo Over Andalusian (9)',
    durationMin: 30,
    goals: [
      'Outline the Andalusian bass motion while soloing lightly',
      'Choose notes that respect each chord\'s color',
      'Use Phrygian/Spanish flavor without rushing (Question Harmony — Solo Over Andalusian day 253)'
    ],
    theoryBite: 'The Andalusian cadence (e.g. Am–G–F–E) is a little story that loops. Your lead notes should notice each chord, especially that E major tension (Solo Over Andalusian) (Solo Over Andalusian day 9).',
    drills: [
      'Comp the progression slowly, name each chord — keep it about Question Harmony — Solo Over Andalusian',
      'Roots-only lead through one cycle',
      'Add neighbor tones into each root',
      'One expressive cycle with space on the E chord (Question Harmony — Solo Over Andalusian day 253)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'Solo one full Andalusian cycle that clearly changes color chord-to-chord, especially into E (Solo Over Andalusian) (Solo Over Andalusian day 9).',
  },
  254: {

    title: 'Economy Picking Seed (9)',
    durationMin: 30,
    goals: [
      'Reduce pick motion with economy/outside-inside awareness',
      'Stay relaxed at moderate speed before chasing velocity',
      'Prefer accuracy of the grid over blur (Economy Picking Seed day 254)'
    ],
    theoryBite: 'Economy picking is about a smarter pick path across strings. Loose and even beats chasing speed too early (Economy Picking Seed) (Economy Picking Seed day 9).',
    drills: [
      'Two-string scale fragment focusing on efficient pick direction — keep it about Economy Picking Seed',
      'Slow 16ths on a 3-note-per-string idea (or simple box)',
      'Stop at first tension in forearm — shake out',
      '8 bars musical, not mechanical, using the efficient path (Economy Picking Seed day 254)'
    ],
    libraryIds: [
      'rf-g-caged-run-study'
    ],
    masteryCheck: 'Play an 8-bar efficient-picking fragment cleanly at a tempo that stays relaxed (Economy Picking Seed) (Economy Picking Seed day 9).',
  },
  255: {

    title: 'Hybrid Picking Taste (9)',
    durationMin: 30,
    goals: [
      'Combine pick bass notes with finger snags on higher strings',
      'Keep the pattern steady enough to be a texture',
      'Use hybrid for country/funk color inside a simple progression (Hybrid Picking Taste day 255)'
    ],
    theoryBite: 'Hybrid picking gives you more ways to attack a note. Pick/thumb on the lows, fingers on the highs — independence is the work (Hybrid Picking Taste) (Hybrid Picking Taste day 9).',
    drills: [
      'Pick low root on beats 1 and 3 — keep it about Hybrid Picking Taste',
      'Middle finger plucks a higher string on 2 and 4',
      'Combine into a rolling pattern on C or G shapes',
      '8-bar progression with hybrid texture throughout (Hybrid Picking Taste day 255)'
    ],
    libraryIds: [
      'rf-travis-pick-sketch-in-c'
    ],
    masteryCheck: 'Maintain an 8-bar hybrid pattern with steady bass/ pick and clear finger snags (Hybrid Picking Taste) (Hybrid Picking Taste day 9).',
  },
  256: {

    title: 'Motif From a PD Song (9)',
    durationMin: 30,
    goals: [
      'Steal a contour from a public-domain melody ethically as study',
      'Vary rhythm while keeping contour recognizable',
      'Return the motif as a hook inside your own phrasing (Motif From a PD Song day 256)'
    ],
    theoryBite: 'Public-domain melodies are free teachers. Borrowing a motif to study builds vocabulary without legal drama (Motif From a PD Song) (Motif From a PD Song day 9).',
    drills: [
      'Learn 2 bars of a PD tune slowly from the library tab — keep it about Motif From a PD Song',
      'Play it an octave away or in a new position',
      'Change only the rhythm, keep pitches',
      'Improv 8 bars that quote the motif once (Motif From a PD Song day 256)'
    ],
    libraryIds: [
      'sg-arkansas-traveler',
      'sg-william-tell-motif-rossini-publi'
    ],
    masteryCheck: 'Quote a PD motif once inside an 8-bar improvised phrase where the quote is recognizable (Motif From a PD Song) (Motif From a PD Song day 9).',
  },
  257: {

    title: 'Weekly Lead Checkpoint (9)',
    durationMin: 30,
    goals: [
      'Combine motif, space, and one expression tool (bend/vibrato/slide)',
      'Record a short take as evidence',
      'Write one keep and one fix with kind wording (Weekly Lead Checkpoint day 257)'
    ],
    theoryBite: 'Lead checkpoints check your taste with a clock running. A short recorded solo plus a quick note beats endless noodling you forget (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 9).',
    drills: [
      'Warm-up long tones + light bends 2 minutes — keep it about Weekly Lead Checkpoint',
      'Motif/rest practice 8 cycles',
      '12-bar or 16-bar soloette over a library vamp/progression',
      'Listen once kindly, once with a pencil note (Weekly Lead Checkpoint day 257)'
    ],
    libraryIds: [
      'rf-palm-mute-chug-study',
      'sg-joy-to-the-world'
    ],
    masteryCheck: 'Save one short lead take that shows space plus one expressive tool, with a written keep and fix (Weekly Lead Checkpoint) (Weekly Lead Checkpoint day 9).',
  },
  258: {

    title: 'Bend Vocabulary — Release & Pre-Bend (9)',
    durationMin: 30,
    goals: [
      'Bend to a target pitch you can name or match',
      'Release bends as musically as you attack them',
      'Keep supporting fingers helping the bend without clamping the neck (Bend Vocabulary — Release & Pre-Bend day 258)'
    ],
    theoryBite: 'A bend is a portable slur to a chord tone. Landing in tune beats bending far (Release & Pre-Bend) (Release & Pre-Bend day 9).',
    drills: [
      'Fret a target note, then bend from a whole step below into it — match sustain — keep it about Bend Vocabulary — Release & Pre-Bend',
      'Pre-bend silently, then release into the lower pitch',
      'Bend-and-hold 2 beats in tune, then resolve down',
      'Use bends only on phrase endings for 8 bars over a vamp (Bend Vocabulary — Release & Pre-Bend day 258)'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'Land four consecutive whole-step bends on pitch (close enough that your ear is happy) at slow tempo (Release & Pre-Bend) (Release & Pre-Bend day 9).',
  },
  259: {

    title: 'Sequence Climb — Melodic Sequences Up (10)',
    durationMin: 35,
    goals: [
      'Move a melodic cell up or down the scale systematically',
      'Keep rhythm identical while pitch shifts',
      'Stop sequencing before it becomes mechanical noise (Sequence Climb — Melodic Sequences Up day 259)'
    ],
    theoryBite: 'Sequences create forward motion people can feel coming — then break the pattern so it breathes (Melodic Sequences Up) (Melodic Sequences Up day 10).',
    drills: [
      'Cell of 4 notes; sequence up diatonically 3 times — keep it about Sequence Climb — Melodic Sequences Up',
      'Same 4-note cell descending diatonically 3 times, same tempo',
      'Break the fourth repeat with a long tone',
      'Apply over a static chord then over a change (Sequence Climb — Melodic Sequences Up day 259)'
    ],
    libraryIds: [
      'rf-minor-slide-lick-study',
      'sg-greensleeves'
    ],
    masteryCheck: 'Play a clear ascending sequence of a 4-note cell three times and resolve with a long tone (Melodic Sequences Up) (Melodic Sequences Up day 10).',
  },
  260: {

    title: 'Question Harmony — Solo Over Andalusian (10)',
    durationMin: 30,
    goals: [
      'Outline the Andalusian bass motion while soloing lightly',
      'Choose notes that respect each chord\'s color',
      'Use Phrygian/Spanish flavor without rushing (Question Harmony — Solo Over Andalusian day 260)'
    ],
    theoryBite: 'The Andalusian cadence (e.g. Am–G–F–E) is a little story that loops. Your lead notes should notice each chord, especially that E major tension (Solo Over Andalusian) (Solo Over Andalusian day 10).',
    drills: [
      'Comp the progression slowly, name each chord — keep it about Question Harmony — Solo Over Andalusian',
      'Roots-only lead through one cycle',
      'Add neighbor tones into each root',
      'One expressive cycle with space on the E chord (Question Harmony — Solo Over Andalusian day 260)'
    ],
    libraryIds: [
      'pr-andalu',
      'rf-spanish-e-phrygian-study',
      'sc-phrygian'
    ],
    masteryCheck: 'Solo one full Andalusian cycle that clearly changes color chord-to-chord, especially into E (Solo Over Andalusian) (Solo Over Andalusian day 10).',
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
    masteryCheck: 'On your song, finish the drills for intro hook design, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for verse comp texture, then one take worth keeping.',
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
      'Capture a keepable chorus take'
    ],
    libraryIds: [
      'sg-auld-lang-syne',
      'sg-this-old-man',
      'pr-145'
    ],
    masteryCheck: 'On your song, finish the drills for chorus lift, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for bridge or middle eight, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for ending and button, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for transition glue, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for tempo honesty, then one take worth keeping.',
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
      'Play with musical dynamics once',
      'Make sure tempo stays flat when volume rises'
    ],
    libraryIds: [
      'sg-morning-mood-motif-grieg-public-',
      'sg-the-parting-glass',
      'pr-145'
    ],
    masteryCheck: 'On your song, finish the drills for dynamic architecture, then one take worth keeping.',
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
      'Turn chart back for seams only',
      'Add a second section to memory when the first is stable',
      'Note the exact bar where memory blinks'
    ],
    libraryIds: [
      'sg-ode',
      'sg-the-streets-of-laredo',
      'pr-12bar'
    ],
    masteryCheck: 'On your song, finish the drills for memory without panic, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for recovery practice, then one take worth keeping.',
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
      'Photo the chart for backup'
    ],
    libraryIds: [
      'sg-jingle-bells',
      'sg-danny-boy-londonderry-air',
      'pr-andalu'
    ],
    masteryCheck: 'On your song, finish the drills for chart cleanliness, then one take worth keeping.',
  },
  274: {

    title: 'Tone and Arrangement',
    durationMin: 30,
    goals: [
      'Match tone color to section role',
      'Prefer clarity of changes over excess gain or force',
      'A/B record to verify the arrangement reads'
    ],
    theoryBite: 'Brighter for lift, darker for verses, less gain for clarity of changes.',
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
    masteryCheck: 'On your song, finish the drills for tone and arrangement, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for duet with a recording, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for fingerstyle arrangement pass, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for strum arrangement pass, then one take worth keeping.',
  },
  278: {

    title: 'Lead Break Writing',
    durationMin: 30,
    goals: [
      'Write a short break that serves the song',
      'Place the break at a form breath point',
      'Keep break tempo honest and shorter than ego wants'
    ],
    theoryBite: 'A break is a short story inside the song, not a separate shred audition.',
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
    masteryCheck: 'On your song, finish the drills for lead break writing, then one take worth keeping.',
  },
  279: {

    title: 'Call and Response With Voice',
    durationMin: 30,
    goals: [
      'Leave holes for the call (voice or hummed line)',
      'Answer with a clear short guitar phrase',
      'Avoid talking over the call bar'
    ],
    theoryBite: 'Guitar answers voice (or hummed line). Leave holes where the call lives.',
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
    masteryCheck: 'On your song, finish the drills for call and response with voice, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for capo and key fit for voice, then one take worth keeping.',
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
      'Time the mini-set roughly'
    ],
    libraryIds: [
      'sg-the-streets-of-laredo',
      'sg-happy-birthday',
      'pr-12bar'
    ],
    masteryCheck: 'On your song, finish the drills for setlist flow logic, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for stamina building, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for quiet practice day, then one take worth keeping.',
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
      'Keep the file even if imperfect'
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
    theoryBite: 'Kindness first, pencil second. Shame kills practice loops.',
    drills: [
      'Listen for time first, notes second',
      'Write one keep sentence and one fix sentence',
      'Apply only the fix in a short loop',
      'Avoid multi-issue spiral'
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
      'Locate the single stickiest bar',
      'Loop it at 70% speed 20 times',
      'Add bar before and after (context) 10 times',
      'Reinsert into full section once'
    ],
    libraryIds: [
      'sg-minuet-in-g-bach-public-domain',
      'sg-drunken-sailor',
      'pr-12bar'
    ],
    masteryCheck: 'On your song, finish the drills for fix one bar only, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for performance stance, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for start strong ritual, then one take worth keeping.',
  },
  289: {

    title: 'Finish Strong Ritual',
    durationMin: 30,
    goals: [
      'Practice endings as hard as openings',
      'Land stillness after the last sound',
      'Remove embarrassed rushes off the neck'
    ],
    theoryBite: 'Last bars linger in memory. Practice endings as hard as openings.',
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
    masteryCheck: 'On your song, finish the drills for finish strong ritual, then one take worth keeping.',
  },
  290: {

    title: 'Medley Skills',
    durationMin: 30,
    goals: [
      'Plan seams before gluing songs',
      'Slow the seam until it\'s inevitable',
      'Only then raise tempo'
    ],
    theoryBite: 'Medleys need key/tempo bridges. Plan the seam before you glue songs live.',
    drills: [
      'Pick two song fragments to join',
      'Write a 2-bar seam on one chord or hit',
      'Practice A-end → seam → B-start slowly',
      'Only then attempt performance tempo'
    ],
    libraryIds: [
      'sg-drums',
      'sg-buffalo-gals',
      'pr-145'
    ],
    masteryCheck: 'On your song, finish the drills for medley skills, then one take worth keeping.',
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
      'Same section, ballad density',
      'Same section, rock eighth density',
      'Same section, boom-chuck if fits',
      'Choose the style that serves lyrics/melody best today'
    ],
    libraryIds: [
      'sg-camptown-races',
      'sg-sailor-s-hornpipe',
      'pr-12bar'
    ],
    masteryCheck: 'On your song, finish the drills for style transfer day, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for acoustic versus amp feel, then one take worth keeping.',
  },
  293: {

    title: 'Mute Noise Cleanup',
    durationMin: 30,
    goals: [
      'Identify and erase unwanted open-string noise',
      'Assign specific mute responsibilities',
      'Recheck at performance volume'
    ],
    theoryBite: 'Unwanted open-string noise is arrangement dirt. Left-hand chops and right-hand palms are erasers.',
    drills: [
      'Slow motion: identify noisy open strings',
      'Assign left-hand mute or palm for each culprit',
      'Loop dirty bar until noise floor drops',
      'Recheck at performance volume'
    ],
    libraryIds: [
      'sg-fr-re-jacques',
      'sg-camptown-races',
      'rf-funk-chicka-study',
      'rf-palm-mute-chug-study'
    ],
    masteryCheck: 'On your song, finish the drills for mute noise cleanup, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for lyric cue awareness, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for count-in leadership, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for fermatas and holds, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for rallentando control, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for double-time taste, then one take worth keeping.',
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
      '8 bars normal, 8 bars half-time',
      'Keep chord moments aligned to form',
      'Great for final verse drama if song allows'
    ],
    libraryIds: [
      'sg-molly-malone',
      'sg-wayfaring-stranger',
      'pr-6251'
    ],
    masteryCheck: 'On your song, finish the drills for half-time taste, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for harmonic simplification, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for harmonic enrichment, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for bass motion arrange, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for percussive guitar, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for open tuning taste (optional), then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for drop d power color (optional), then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for travis pattern song pass, then one take worth keeping.',
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
      'Keep chucks lighter than booms',
      'Chord change practice at boom-chuck tempo',
      'Smile-test recording 30 seconds'
    ],
    libraryIds: [
      'sg-maple-leaf-rag-motif-joplin-publ',
      'sg-ode',
      'rf-d-folk-pattern-study'
    ],
    masteryCheck: 'On your song, finish the drills for boom-chuck song pass, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for ballad vocal space, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for up-tempo clarity, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for slow blues vehicle, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for folk storytelling pace, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for campfire leadership, then one take worth keeping.',
  },
  313: {

    title: 'Solo Performance Shape',
    durationMin: 30,
    goals: [
      'Design an energy arc for the set or multi-section run',
      'Practice human transitions (talk/breath)',
      'Time the arc roughly'
    ],
    theoryBite: 'Welcome, lift, rest, peak, goodbye. Plan talk breaks if needed.',
    drills: [
      'Write a 3-song or 3-section energy arc on paper',
      'Practice speaking one sentence between sections',
      'Time the arc roughly; keep it slow and clean on Solo Performance Shape',
      'Run once with performance rules'
    ],
    libraryIds: [
      'sg-happy-birthday',
      'sg-shenandoah',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'On your song, finish the drills for solo performance shape, then one take worth keeping.',
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
      'Note where you pull forward',
      'Loop only rushing bars with click',
      'One keep take with click'
    ],
    libraryIds: [
      'sg-scarborough-fair',
      'sg-simple-gifts',
      'pr-6251'
    ],
    masteryCheck: 'On your song, finish the drills for with-metronome polish, then one take worth keeping.',
  },
  315: {

    title: 'Off-Metronome Humanize',
    durationMin: 35,
    goals: [
      'Humanize without losing form length',
      'Compare to click reference',
      'Tap foot honestly if form stretches'
    ],
    theoryBite: 'After click trust, practice breathing time without wandering form length.',
    drills: [
      'Immediately after click work, play without click',
      'Record and compare length of section to click version',
      'If form stretches, lightly tap foot more honestly',
      'Aim human, not sloppy; keep it slow and clean on Off-Metronome Humanize'
    ],
    libraryIds: [
      'sg-home-on-the-range',
      'sg-down-by-the-riverside',
      'pr-145'
    ],
    masteryCheck: 'On your song, finish the drills for off-metronome humanize, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for nerves simulation, then one take worth keeping.',
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
      'Log BPM and capo for each'
    ],
    libraryIds: [
      'sg-wild-mountain-thyme',
      'sg-the-streets-of-laredo',
      'pr-1645'
    ],
    masteryCheck: 'On your song, finish the drills for second song start, then one take worth keeping.',
  },
  318: {

    title: 'Third Song Start',
    durationMin: 30,
    goals: [
      'Add a confidence third song',
      'Keep difficulty staggered in the set',
      'Sketch order early'
    ],
    theoryBite: 'Three songs begin a real mini-set. Keep difficulty staggered.',
    drills: [
      'Third song should be a confidence piece',
      'Speak a quick form map only, then play from memory',
      'Run section 1 clean 5 times',
      'Sketch mini-set order 1-2-3'
    ],
    libraryIds: [
      'sg-drunken-sailor',
      'sg-swing-low-sweet-chariot',
      'pr-andalu'
    ],
    masteryCheck: 'On your song, finish the drills for third song start, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for vehicle swap day, then one take worth keeping.',
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
      'Revisit an early-course song',
      'Apply a new skill (mute cleanup or dynamic arc)',
      'Record a before-memory vs after-take if possible',
      'Celebrate measurable growth'
    ],
    libraryIds: [
      'sg-aura-lee',
      'sg-joy-to-the-world',
      'pr-145'
    ],
    masteryCheck: 'On your song, finish the drills for old song revival, then one take worth keeping.',
  },
  321: {

    title: 'New Song Intake Method',
    durationMin: 30,
    goals: [
      'Follow form → sticky bar → ornaments order',
      'Stop before fatigue encodes errors',
      'Write the intake checklist once and reuse'
    ],
    theoryBite: 'Form, groove, sticky bar, then ornaments. Resist full-speed first passes.',
    drills: [
      'New song intake checklist on paper',
      'Form first, sticky bar second, ornaments never first',
      'Five slow loops of section 1',
      'Stop before fatigue encodes errors'
    ],
    libraryIds: [
      'sg-auld-lang-syne',
      'sg-turkey-in-the-straw',
      'pr-12bar'
    ],
    masteryCheck: 'On your song, finish the drills for new song intake method, then one take worth keeping.',
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
      'Mark phrase breaths on chart'
    ],
    libraryIds: [
      'sg-buffalo-gals',
      'sg-twinkle',
      'pr-1645'
    ],
    masteryCheck: 'On your song, finish the drills for phrase-by-phrase learn, then one take worth keeping.',
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
      'Add one bar context each side',
      'Reintegrate full sections'
    ],
    libraryIds: [
      'sg-sailor-s-hornpipe',
      'sg-amazing-grace',
      'pr-andalu'
    ],
    masteryCheck: 'On your song, finish the drills for chunk boundary practice, then one take worth keeping.',
  },
  324: {

    title: 'Slow–Full–Fast Ladder',
    durationMin: 30,
    goals: [
      'Use slow/medium/near-goal rungs',
      'Require clean reps to graduate',
      'Step down without drama when needed'
    ],
    theoryBite: 'Secure slow, musical medium, careful faster. Never skip the middle.',
    drills: [
      'Three tempos on metronome: slow / medium / goal-1',
      'Two clean runs required to graduate a rung',
      'If fail, step down a rung without drama',
      'Log best clean tempo today'
    ],
    libraryIds: [
      'sg-canon-in-d-pachelbel-theme-publi',
      'sg-when-the-saints-go-marching-in',
      'pr-6251'
    ],
    masteryCheck: 'On your song, finish the drills for slow–full–fast ladder, then one take worth keeping.',
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
      'Combine at 80% speed; keep it slow and clean on Hands Separate Practice',
      'Identify which hand caused yesterday\'s errors'
    ],
    libraryIds: [
      'sg-william-tell-motif-rossini-publi',
      'sg-mary-had-a-little-lamb',
      'pr-145'
    ],
    masteryCheck: 'On your song, finish the drills for hands separate practice, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for mental practice away from guitar, then one take worth keeping.',
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
      'Watch muted for posture/tension',
      'Watch with audio for time',
      'Pick one visual fix only'
    ],
    libraryIds: [
      'sg-ode',
      'sg-happy-birthday',
      'pr-1645'
    ],
    masteryCheck: 'On your song, finish the drills for video self review, then one take worth keeping.',
  },
  328: {

    title: 'Audio Self Review',
    durationMin: 30,
    goals: [
      'Judge time and tone without visual distraction',
      'Timestamp issues',
      'Fix timing before tone chasing'
    ],
    theoryBite: 'Audio review without mirrors focuses time and tone. Timestamp one fix.',
    drills: [
      'Do one audio-only take and listen back once',
      'Listen without looking at hands',
      'Timestamp one timing issue and one tone issue',
      'Fix timing first in loops'
    ],
    libraryIds: [
      'sg-oh-susanna',
      'sg-scarborough-fair',
      'pr-andalu'
    ],
    masteryCheck: 'On your song, finish the drills for audio self review, then one take worth keeping.',
  },
  329: {

    title: 'Peer Share Optional',
    durationMin: 35,
    goals: [
      'If sharing, ask for one targeted note',
      'If solo, simulate peer with a focused question',
      'Apply at most one suggestion'
    ],
    theoryBite: 'If you do, ask for one specific feedback target, not global judgment.',
    drills: [
      'Optional share of 30–60s clip',
      'Ask one question (e.g. \'does chorus lift?\')',
      'If no peer, ask future-you the same question on listenback',
      'Apply at most one suggestion today'
    ],
    libraryIds: [
      'sg-jingle-bells',
      'sg-home-on-the-range',
      'pr-6251'
    ],
    masteryCheck: 'On your song, finish the drills for peer share optional, then one take worth keeping.',
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
      'Teach the sticky bar twice',
      'Notice what you understood better after teaching'
    ],
    libraryIds: [
      'sg-row-row-row-your-boat',
      'sg-barbara-allen',
      'pr-145'
    ],
    masteryCheck: 'On your song, finish the drills for teach a section aloud, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for simplify for consistency, then one take worth keeping.',
  },
  332: {

    title: 'Ornament After Solid',
    durationMin: 30,
    goals: [
      'Ornament only on solid skeletons',
      'One ornament family at a time',
      'Abort if time wobbles'
    ],
    theoryBite: 'Add slides, hammer decoration, or bass walks only on a stable skeleton.',
    drills: [
      'Do a skeleton take first — form only, no ornaments',
      'Add one ornament type only (slide or hammer)',
      'Place ornaments on weak beats or phrase ends',
      'Abort ornaments if time wobbles'
    ],
    libraryIds: [
      'sg-she-ll-be-coming-round-the-mount',
      'sg-drunken-sailor',
      'pr-1645'
    ],
    masteryCheck: 'On your song, finish the drills for ornament after solid, then one take worth keeping.',
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
      'Write a 1-bar signature lick',
      'Place it in the same form location each time',
      'Practice song with lick omitted vs included',
      'Keep lick slower than surrounding ego'
    ],
    libraryIds: [
      'sg-shenandoah',
      'sg-house-of-the-rising-sun',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'On your song, finish the drills for signature lick placement, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for silence schedule in the song, then one take worth keeping.',
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
      'Ten reps of silence→start',
      'If noise creeps, freeze longer before counting'
    ],
    libraryIds: [
      'sg-down-by-the-riverside',
      'sg-auld-lang-syne',
      'pr-145'
    ],
    masteryCheck: 'On your song, finish the drills for intro from silence, then one take worth keeping.',
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
      'Final hit + mute + still body',
      'No string noise after cutoff',
      'Fifteen cold endings; keep it slow and clean on Cold Ending Practice',
      'Video the stillness once'
    ],
    libraryIds: [
      'sg-the-parting-glass',
      'sg-buffalo-gals',
      'pr-12bar'
    ],
    masteryCheck: 'On your song, finish the drills for cold ending practice, then one take worth keeping.',
  },
  337: {

    title: 'Tag Ending Practice',
    durationMin: 30,
    goals: [
      'Decide tag length and dynamics',
      'Connect tag to button cleanly',
      'Notate so you remember under pressure'
    ],
    theoryBite: 'Tags repeat a final hook. Decide how many repeats before the button.',
    drills: [
      'Decide tag length (1 or 2 repeats)',
      'Practice tag into button',
      'Keep tag dynamics intentional (build or shrink)',
      'Notate the tag ending on your chart before playing'
    ],
    libraryIds: [
      'sg-the-streets-of-laredo',
      'sg-sailor-s-hornpipe',
      'pr-1645'
    ],
    masteryCheck: 'On your song, finish the drills for tag ending practice, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for key change taste optional, then one take worth keeping.',
  },
  339: {

    title: 'Modulation Walkup',
    durationMin: 30,
    goals: [
      'Make bass walk clear and slow first',
      'Connect old key area into new center',
      'Abort if tempo or pitch fails'
    ],
    theoryBite: 'Walkups into a new key need clear bass motion. Slow is mandatory at first.',
    drills: [
      'Write bass walk into a new tonal center',
      'Slow walk with named notes',
      'Connect from old chorus into walked lift',
      'Abort if intonation or tempo fails'
    ],
    libraryIds: [
      'sg-danny-boy-londonderry-air',
      'sg-camptown-races',
      'pr-6251'
    ],
    masteryCheck: 'On your song, finish the drills for modulation walkup, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for stop-time section, then one take worth keeping.',
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
      'Loop breakdown 8 bars; keep it slow and clean on Breakdown Section',
      'Rebuild to full texture over 4 bars',
      'Contrast should feel obvious'
    ],
    libraryIds: [
      'sg-turkey-in-the-straw',
      'sg-fr-re-jacques',
      'rf-minor-slide-lick-study'
    ],
    masteryCheck: 'On your song, finish the drills for breakdown section, then one take worth keeping.',
  },
  342: {

    title: 'Final Chorus Plus',
    durationMin: 30,
    goals: [
      'Differentiate final chorus with one lift',
      'Keep form length true',
      'Still prepare the ending'
    ],
    theoryBite: 'Higher voicing, fuller strums, or a harmony hint.',
    drills: [
      'Final chorus adds one lift element only',
      'Practice penultimate vs final chorus back-to-back',
      'Keep form length identical',
      'Ending still prepared; keep it slow and clean on Final Chorus Plus'
    ],
    libraryIds: [
      'sg-minuet-in-g-bach-public-domain',
      'sg-go-tell-aunt-rhody',
      'pr-1645'
    ],
    masteryCheck: 'On your song, finish the drills for final chorus plus, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for false ending fun, then one take worth keeping.',
  },
  344: {

    title: 'Medley Bridge Writing',
    durationMin: 30,
    goals: [
      'Write a short bridge between songs',
      'Slow-practice the seam',
      'Then run real endings into real beginnings'
    ],
    theoryBite: 'Shared chord, drum fill feel, or held note.',
    drills: [
      'Write 2–4 bar bridge between two repertoire songs',
      'Shared chord or drum-like hits as glue',
      'Slow seam practice 10 times',
      'Then song A end → bridge → song B start'
    ],
    libraryIds: [
      'sg-the-entertainer-motif-joplin-pub',
      'sg-red-river-valley',
      'pr-6251'
    ],
    masteryCheck: 'On your song, finish the drills for medley bridge writing, then one take worth keeping.',
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
      'Circle one next action only',
      'Do that action for 10 minutes',
      'Close journal — avoid endless planning'
    ],
    libraryIds: [
      'sg-st-louis-blues-motif-handy-1914-',
      'sg-wayfaring-stranger',
      'pr-145'
    ],
    masteryCheck: 'On your song, finish the drills for repertoire journaling, then one take worth keeping.',
  },
  346: {

    title: 'Goal Tempo Decision',
    durationMin: 30,
    goals: [
      'Pick BPM from evidence not ego',
      'Write it large on the chart',
      'Test candidates with 8-bar samples'
    ],
    theoryBite: 'Choose a goal tempo with evidence (singability, clean changes), not ego.',
    drills: [
      'Candidate tempos: safe / stretch / ego',
      'Test eight bars at each tempo step before speeding',
      'Pick safe or stretch only',
      'Write BPM on chart in large numbers'
    ],
    libraryIds: [
      'sg-drums',
      'sg-black-is-the-color',
      'pr-12bar'
    ],
    masteryCheck: 'On your song, finish the drills for goal tempo decision, then one take worth keeping.',
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
      'No random jumps mid-section',
      'Log the ending BPM you can play cleanly today'
    ],
    libraryIds: [
      'sg-camptown-races',
      'sg-molly-malone',
      'pr-1645'
    ],
    masteryCheck: 'On your song, finish the drills for practice tempo loyalty, then one take worth keeping.',
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
      'Count-in at that BPM; keep it slow and clean on Performance Tempo Courage',
      'No mid-song tempo arguments with yourself',
      'Post-take note if it felt kind'
    ],
    libraryIds: [
      'sg-skip-to-my-lou',
      'sg-careless-love',
      'pr-andalu'
    ],
    masteryCheck: 'On your song, finish the drills for performance tempo courage, then one take worth keeping.',
  },
  349: {

    title: 'Error Budget Acceptance',
    durationMin: 30,
    goals: [
      'Allow a small error budget and finish anyway',
      'Score recovery separately from perfection',
      'Keep finished takes'
    ],
    theoryBite: 'Allow a small error budget in performance takes. Finish the story anyway.',
    drills: [
      'Allow up to 2 visible errors without stopping',
      'Practice finishing anyway',
      'Score recovery quality separately from note perfection',
      'Keep a take that finished strong'
    ],
    libraryIds: [
      'sg-fr-re-jacques',
      'sg-joshua-fit-the-battle-of-jericho',
      'pr-6251'
    ],
    masteryCheck: 'On your song, finish the drills for error budget acceptance, then one take worth keeping.',
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
      'Use in the next full run'
    ],
    libraryIds: [
      'sg-go-tell-aunt-rhody',
      'sg-silent-night',
      'pr-145'
    ],
    masteryCheck: 'On your song, finish the drills for smile and breathe reset, then one take worth keeping.',
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
      'Photo your minimal plot; keep it slow and clean on Stage Plot Minimal'
    ],
    libraryIds: [
      'sg-greensleeves',
      'sg-i-ve-been-working-on-the-railroa',
      'pr-12bar'
    ],
    masteryCheck: 'On your song, finish the drills for stage plot minimal, then one take worth keeping.',
  },
  352: {

    title: 'Gear Check Ritual',
    durationMin: 30,
    goals: [
      'Run a boring gear checklist',
      'Fix one friction point',
      'Never skip checklist before dress runs'
    ],
    theoryBite: 'Cable, tuning, strap, battery — boring rituals prevent exciting failures.',
    drills: [
      'Checklist: tuning, strap, cable/path, battery/pick reserve',
      'Run checklist aloud once',
      'Fix one gear friction today',
      'Don\'t skip checklist before dress runs'
    ],
    libraryIds: [
      'sg-red-river-valley',
      'sg-arkansas-traveler',
      'pr-1645'
    ],
    masteryCheck: 'On your song, finish the drills for gear check ritual, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for tuning check ritual, then one take worth keeping.',
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
      'Adjust set if over time budget'
    ],
    libraryIds: [
      'sg-black-is-the-color',
      'sg-oh-susanna',
      'pr-6251'
    ],
    masteryCheck: 'On your song, finish the drills for setlist timing math, then one take worth keeping.',
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
      'Practice bow + exit either way',
      'Avoid undecided hovering endings'
    ],
    libraryIds: [
      'sg-molly-malone',
      'sg-jingle-bells',
      'pr-145'
    ],
    masteryCheck: 'On your song, finish the drills for encore decision logic, then one take worth keeping.',
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
    theoryBite: 'Three songs reveal stamina and set arc. Keep one easy landing pad song.',
    drills: [
      'Run three songs with short resets',
      'Watch stamina on song 3; keep it slow and clean on Three-Song Mini Set',
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
      'Full song with chart allowed',
      'No stopping for anything but safety',
      'Circle only bars that truly needed eyes',
      'Schedule memory work on those bars tomorrow'
    ],
    libraryIds: [
      'sg-silent-night',
      'sg-she-ll-be-coming-round-the-mount',
      'pr-andalu'
    ],
    masteryCheck: 'On your song, finish the drills for full run with notes, then one take worth keeping.',
  },
  359: {

    title: 'Full Run No Notes',
    durationMin: 30,
    goals: [
      'Complete a memory run with recovery rules',
      'Mark danger spots afterward without shame',
      'Convert marks into loop plans'
    ],
    theoryBite: 'Memory runs expose cue gaps. Mark only the true danger spots afterward.',
    drills: [
      'Chart face down or closed app',
      'Full run recovery rules on',
      'Afterward, reopen chart and mark danger spots',
      'Don\'t shame — schedule loops'
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
    theoryBite: 'Limited stops, full recovery, real tempo.',
    drills: [
      'Performance clothing optional; performance rules mandatory',
      'One primary full take; keep it slow and clean on Dress Rehearsal Energy',
      'Limited second take only if technical failure',
      'Celebrate finishing energy'
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
      'Touch intros and endings only',
      'Light hands, short minutes',
      'Hydrate and stretch fretting hand for thirty seconds',
      'No grinding sticky bars into fear'
    ],
    libraryIds: [
      'sg-f-r-elise-motif-beethoven-public',
      'sg-down-by-the-riverside',
      'pr-12bar'
    ],
    masteryCheck: 'On your song, finish the drills for pre-show light day, then one take worth keeping.',
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
      'Score sections 1–5 honestly',
      'Pick lowest section for extra loops'
    ],
    libraryIds: [
      'sg-blue-danube-motif-strauss-public',
      'sg-the-parting-glass',
      'pr-1645'
    ],
    masteryCheck: 'On your song, finish the drills for sections, then one take worth keeping.',
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
    masteryCheck: 'On your song, finish the drills for transitions, then one take worth keeping.',
  },
  364: {

    title: 'Capstone Rehearsal C — Full Story',
    durationMin: 35,
    goals: [
      'Tell the full story under recovery rules',
      'Capture notes kindly after',
      'Protect hands — capstone is near'
    ],
    theoryBite: 'Capstone C is a full story run with recovery rules and kind notes after.',
    drills: [
      'Full story run with recovery rules',
      'Record the take if possible and keep the best one',
      'Kind pencil notes after; keep it slow and clean on Full Story',
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
