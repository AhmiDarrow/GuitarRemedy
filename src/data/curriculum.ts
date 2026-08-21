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
      'Hold the guitar so shoulders stay soft (focus: Meet the Guitar)',
      'Name open strings low→high E A D G B E — day 1 step 2',
      'Make six open strings ring without buzz — day 1 step 3'
    ],
    theoryBite: 'Day 1 focus — Meet the Guitar — First Clean Sounds: Standard tuning thick→thin: E A D G B E. In-tune strings train your ear for free.',
    drills: [
      'Sit tall, guitar on leg, fretting thumb behind neck [Meet the Guitar]',
      'Pluck open strings low→high naming each (D1.2)',
      'Sustain check: each string rings ~2 seconds (D1.3)'
    ],
    libraryIds: ['sc-pent-min', 'rf-spider'],
    masteryCheck: 'Day 1: Name and pluck all six open strings in order without looking at the headstock.',
  },
  2: {
    title: 'Fretting Hand — Just Enough Pressure',
    durationMin: 25,
    goals: [
      'Fret with fingertips behind the fretwire (focus: Fretting Hand)',
      'Use minimum pressure that still sounds clean — day 2 step 2',
      'Play frets 1–4 on high E evenly — day 2 step 3'
    ],
    theoryBite: 'Day 2 focus — Fretting Hand — Just Enough Pressure: One fret ≈ one semitone. Press just behind the metal fret — not the middle of the box.',
    drills: [
      'Spider 1-2-3-4 on high E at 50 BPM [Fretting Hand]',
      'Buzz-then-add: release until buzz, add a hair of pressure (D2.2)',
      'Mirror check: knuckles curved, wrist neutral (D2.3)'
    ],
    libraryIds: ['rf-spider', 'sc-pent-min'],
    masteryCheck: 'Day 2: Play frets 1–4 on the high E string evenly at 60 BPM with clear tone.',
  },
  3: {
    title: 'First Chord Win — E Minor',
    durationMin: 25,
    goals: [
      'Form open Em with two fingers (focus: First Chord Win)',
      'Strum all six strings on the beat — day 3 step 2',
      'Lift and replace Em ten times cleanly — day 3 step 3'
    ],
    theoryBite: 'Day 3 focus — First Chord Win — E Minor: E minor = E G B. Open Em: middle on A2, ring on D2. Easiest full-sounding chord — early win on purpose.',
    drills: [
      'Build Em, count to 4, release ×10 [First Chord Win]',
      'Down-strums on beats 1 and 3 only (D3.2)',
      'String audit: pluck each string alone (D3.3)'
    ],
    libraryIds: ['ch-em', 'rf-open-am'],
    masteryCheck: 'Day 3: Hold Em for 8 steady down-strums with every string ringing.',
  },
  4: {
    title: 'Second Chord — G Major + First Change',
    durationMin: 25,
    goals: [
      'Form a clear open G (focus: Second Chord)',
      'Strum from the low E — day 4 step 2',
      'Change Em→G in slow motion — day 4 step 3'
    ],
    theoryBite: 'Day 4 focus — Second Chord — G Major + First Change: G major = G B D. Changes — not single shapes — are the real beginner skill.',
    drills: [
      'Build G one finger at a time [Second Chord]',
      'Em | G at 50 BPM, two bars each (D4.2)',
      'Keep the strum arm moving during the change (D4.3)'
    ],
    libraryIds: ['ch-g', 'ch-em'],
    masteryCheck: 'Day 4: Complete four clean Em→G changes in 30 seconds.',
  },
  5: {
    title: 'C Major — Five-String Clarity',
    durationMin: 25,
    goals: [
      'Form open C without choking B or G (focus: C Major)',
      'Avoid accidental low-E clashes — day 5 step 2',
      'Connect C with G — day 5 step 3'
    ],
    theoryBite: 'Day 5 focus — C Major — Five-String Clarity: C major = C E G. Open C frets A3, D2, B1; low E is often omitted on purpose.',
    drills: [
      'Place C, pluck strings 5→1 individually [C Major]',
      'G–C–G–C at walking tempo (D5.2)',
      'Thumb mid-neck — not strangling the top (D5.3)'
    ],
    libraryIds: ['ch-c', 'ch-g'],
    masteryCheck: 'Day 5: Play C with five clear strings and no unwanted low-E bang.',
  },
  6: {
    title: 'D Major — Triangle + Campfire Set',
    durationMin: 25,
    goals: [
      'Form the open D triangle (focus: D Major)',
      'Strum only strings 4–1 — day 6 step 2',
      'Loop G–C–D as real music — day 6 step 3'
    ],
    theoryBite: 'Day 6 focus — D Major — Triangle + Campfire Set: D major = D F♯ A. Top-four-string chord — missing lows is correct, not a mistake.',
    drills: [
      'D freeze 10 seconds [D Major]',
      'G–C–D–G loop four times (D6.2)',
      'Soft down-up strums on D only (D6.3)'
    ],
    libraryIds: ['ch-d', 'ch-g', 'ch-c', 'pr-145'],
    masteryCheck: 'Day 6: Play the G–C–D progression twice without stopping.',
  },
  7: {
    title: 'Week 1 Jam — Em G C D Music',
    durationMin: 35,
    goals: [
      'Review Em G C D as one vocabulary (focus: Week 1 Jam)',
      'Lock a slow metronome pulse — day 7 step 2',
      'Record 60 seconds of honest music — day 7 step 3'
    ],
    theoryBite: 'Day 7 focus — Week 1 Jam — Em G C D Music: In G: G=I, C=IV, D=V, Em=vi. Four chords unlock thousands of songs — play them today.',
    drills: [
      '4 bars each chord at 70 BPM [Week 1 Jam]',
      'Two-minute continuous change loop (D7.2)',
      'Phone-record one kind take; listen once (D7.3)'
    ],
    libraryIds: ['pr-145', 'ch-em', 'ch-g', 'ch-c', 'ch-d'],
    masteryCheck: 'Day 7: Play two continuous minutes moving among Em, G, C, and D in time.',
  },
  8: {
    title: 'A Minor & E Major — Shape Family',
    durationMin: 30,
    goals: [
      'Add clear Am and E shapes (focus: A Minor & E Major)',
      'Notice kinship between shapes — day 8 step 2',
      'Color a loop Am–E–Am–E — day 8 step 3'
    ],
    theoryBite: 'Day 8 focus — A Minor & E Major — Shape Family: Am is the relative minor of C. Shared shape families shrink the learning load.',
    drills: [
      'Visualize Am as Em moved toward the floor [A Minor & E Major]',
      'Am–E changes at 60 BPM (D8.2)',
      'C–Am–E–Am mood loop (D8.3)'
    ],
    libraryIds: ['ch-am', 'ch-e', 'ch-c'],
    masteryCheck: 'Day 8: Eight clean strums each on Am and E with no dead notes.',
  },
  9: {
    title: 'Strum Patterns — Downs, Ups, and &s',
    durationMin: 30,
    goals: [
      'Downstrokes land on numbered beats (focus: Strum Patterns)',
      'Upstrokes on the & counts — day 9 step 2',
      'Apply D-DU-D-DU to G–C–D — day 9 step 3'
    ],
    theoryBite: 'Day 9 focus — Strum Patterns — Downs, Ups, and &s: Count 1 & 2 & 3 & 4 &. Right hand is the drummer; fretting hand only changes costumes.',
    drills: [
      'Muted D-D-D-D for 60 seconds [Strum Patterns]',
      'D-DU-D-DU on G for 8 bars (D9.2)',
      'Ghost strums: miss strings on purpose for groove (D9.3)'
    ],
    libraryIds: ['pr-145', 'ch-g'],
    masteryCheck: 'Day 9: Play D-DU-D-DU on G for 8 bars without losing the count.',
  },
  10: {
    title: 'A Major — A–D–E Starter Set',
    durationMin: 30,
    goals: [
      'Form open A cleanly (focus: A Major)',
      'Loop A–D–E with steady time — day 10 step 2',
      'Toggle A vs Am to hear the third — day 10 step 3'
    ],
    theoryBite: 'Day 10 focus — A Major — A–D–E Starter Set: A major = A C♯ E. Gateway to blues and rock in A. One finger often separates major/minor color.',
    drills: [
      'A freeze + string-by-string audit [A Major]',
      'A–D–E–A twice slowly (D10.2)',
      'A vs Am toggle on a drone beat (D10.3)'
    ],
    libraryIds: ['ch-a', 'ch-d', 'ch-e', 'pr-12bar'],
    masteryCheck: 'Day 10: Play two full A–D–E loops with steady time.',
  },
  11: {
    title: 'Minor Pentatonic Box 1 — First Lead Map',
    durationMin: 30,
    goals: [
      'Find A root on string 5 fret 5 (focus: Minor Pentatonic Box 1)',
      'Ascend and descend box 1 slowly — day 11 step 2',
      'Improvise using only three notes — day 11 step 3'
    ],
    theoryBite: 'Day 11 focus — Minor Pentatonic Box 1 — First Lead Map: A minor pentatonic: A C D E G. Box 1 is the most used rock/blues map — fewer notes, more music.',
    drills: [
      'Root pulses on beat 1 for 30 seconds [Minor Pentatonic Box 1]',
      'Ascend box, rest one bar, descend (D11.2)',
      '3-note solo rule for a full minute (D11.3)'
    ],
    libraryIds: ['sc-pent-min', 'rf-open-am', 'ch-am'],
    masteryCheck: 'Day 11: Play box 1 up and down in time at 60 BPM, landing on the root.',
  },
  12: {
    title: 'First Melody — Twinkle in Open Position',
    durationMin: 30,
    goals: [
      'Learn the melody in short phrases (focus: First Melody)',
      'Sing a phrase, then play it — day 12 step 2',
      'Connect phrases without panic stops — day 12 step 3'
    ],
    theoryBite: 'Day 12 focus — First Melody — Twinkle in Open Position: Melodies train ear and timing faster than empty shapes. A phrase is a musical sentence — breathe between them.',
    drills: [
      'Map phrase 1 only until easy [First Melody]',
      'Call-and-response: sing then play (D12.2)',
      'One slow clean full melody (D12.3)'
    ],
    libraryIds: ['sg-twinkle', 'ch-c'],
    masteryCheck: 'Day 12: Play Twinkle phrase-by-phrase with a steady pulse and no rushing.',
  },
  13: {
    title: 'Finger Independence — Spider Across Strings',
    durationMin: 30,
    goals: [
      'Run 1-2-3-4 moving string to string (focus: Finger Independence)',
      'Keep idle fingers soft — day 13 step 2',
      'Stay under tempo ego — day 13 step 3'
    ],
    theoryBite: 'Day 13 focus — Finger Independence — Spider Across Strings: Independence is coordination, not strength. Slow spiders wire clean fretting for every future chord.',
    drills: [
      'Spider on B and high E only [Finger Independence]',
      'Add G string when even (D13.2)',
      'Stop at first tension; shake out 10 seconds (D13.3)'
    ],
    libraryIds: ['rf-spider', 'sg-twinkle'],
    masteryCheck: 'Day 13: Play a calm two-string spider for 60 seconds with even volume.',
  },
  14: {
    title: 'Power Chords Intro — Two-Finger Rock',
    durationMin: 35,
    goals: [
      'Fret root + fifth power shape (focus: Power Chords Intro)',
      'Mute unused strings lightly — day 14 step 2',
      'Move the shape on the E string — day 14 step 3'
    ],
    theoryBite: 'Day 14 focus — Power Chords Intro — Two-Finger Rock: Power chord = root + fifth (sometimes + octave). Movable, tough-sounding, beginner-friendly harmony.',
    drills: [
      'E5 at frets 0/2 then 3/5 [Power Chords Intro]',
      'Palm-mute downstrokes eighths (D14.2)',
      'Riff: root movement in time (D14.3)'
    ],
    libraryIds: ['rf-power', 'ch-e'],
    masteryCheck: 'Day 14: Play a four-bar power-chord riff twice with muted clarity.',
  },
  15: {
    title: 'Switching Lab — Shrink the Motion',
    durationMin: 30,
    goals: [
      'Watch which fingers travel farthest (focus: Switching Lab)',
      'Park shared fingers when possible — day 15 step 2',
      'Change G–C–D with smaller motions — day 15 step 3'
    ],
    theoryBite: 'Day 15 focus — Switching Lab — Shrink the Motion: Economy of motion beats finger speed. The shortest path between shapes is a practice skill of its own.',
    drills: [
      'Film one change in slow-mo if you can [Switching Lab]',
      'G–C isolation 2 minutes (D15.2)',
      'C–D isolation 2 minutes (D15.3)'
    ],
    libraryIds: ['ch-g', 'ch-c', 'ch-d', 'pr-145'],
    masteryCheck: 'Day 15: Make eight G–C–D changes where each landing is clean on beat 1.',
  },
  16: {
    title: 'Ode to Joy Motif — Melody Meets Chords',
    durationMin: 30,
    goals: [
      'Learn the opening motif cleanly (focus: Ode to Joy Motif)',
      'Alternate motif and a C or G chord — day 16 step 2',
      'Keep tempo humble — day 16 step 3'
    ],
    theoryBite: 'Day 16 focus — Ode to Joy Motif — Melody Meets Chords: Single-note themes over open chords build the lead+rhythm brain without theory overload.',
    drills: [
      'Motif only, 4 times [Ode to Joy Motif]',
      'Motif | C chord | motif | G chord (D16.2)',
      'Light dynamics: soft question, fuller answer (D16.3)'
    ],
    libraryIds: ['sg-ode', 'ch-c', 'ch-g'],
    masteryCheck: 'Day 16: Play the Ode motif twice and answer each time with a clean open chord.',
  },
  17: {
    title: 'Rhythm Guitar Feel — Pocket Over Speed',
    durationMin: 30,
    goals: [
      'Foot taps quarters the whole drill (focus: Rhythm Guitar Feel)',
      'Strum arm stays fluid on misses — day 17 step 2',
      'Prefer pocket at 70 BPM over chaos at 100 — day 17 step 3'
    ],
    theoryBite: 'Day 17 focus — Rhythm Guitar Feel — Pocket Over Speed: Listeners feel time before they notice fancy chords. Pocket = notes agreeing with the pulse.',
    drills: [
      'Foot-only quarters 30 seconds [Rhythm Guitar Feel]',
      'Muted groove 1 minute (D17.2)',
      'G–C–D with foot locked (D17.3)'
    ],
    libraryIds: ['pr-145', 'ch-g'],
    masteryCheck: 'Day 17: Two minutes of chord changes where your foot never stops the pulse.',
  },
  18: {
    title: 'D Minor & Mood — Major vs Minor Ears',
    durationMin: 30,
    goals: [
      'Form clear open Dm (focus: D Minor & Mood)',
      'Toggle D major vs D minor — day 18 step 2',
      'Play a tiny sad-loop Dm–C–G — day 18 step 3'
    ],
    theoryBite: 'Day 18 focus — D Minor & Mood — Major vs Minor Ears: Minor lowers the third (F vs F♯ in D). Your ear learns faster when you A/B colors on purpose.',
    drills: [
      'Dm string audit [D Minor & Mood]',
      'D | Dm | D | Dm slow (D18.2)',
      'Dm–C–G–G loop (D18.3)'
    ],
    libraryIds: ['ch-dm', 'ch-d', 'ch-c', 'ch-g'],
    masteryCheck: 'Day 18: Demonstrate D vs Dm and play one clean Dm–C–G loop.',
  },
  19: {
    title: 'Seventh Color — G7 and D7 as Magnets',
    durationMin: 30,
    goals: [
      'Form G7 and D7 (focus: Seventh Color)',
      'Feel how V7 pulls to I — day 19 step 2',
      'Use G7→C and D7→G resolutions — day 19 step 3'
    ],
    theoryBite: 'Day 19 focus — Seventh Color — G7 and D7 as Magnets: Dominant 7th (1–3–5–b7) creates tension that wants the tonic. Folk and blues live here.',
    drills: [
      'G7 freeze + resolve to C [Seventh Color]',
      'D7 freeze + resolve to G (D19.2)',
      'G–G7–C progression (D19.3)'
    ],
    libraryIds: ['ch-g7', 'ch-d7', 'ch-c', 'ch-g'],
    masteryCheck: 'Day 19: Play two clear V7→I resolutions (G7→C and D7→G).',
  },
  20: {
    title: 'Simple Fingerstyle Seed — Thumb + i',
    durationMin: 30,
    goals: [
      'Thumb plays bass on beat 1 (focus: Simple Fingerstyle Seed)',
      'Index answers on a higher string — day 20 step 2',
      'Keep pattern boringly steady — day 20 step 3'
    ],
    theoryBite: 'Day 20 focus — Simple Fingerstyle Seed — Thumb + i: Travis seeds start with thumb independence. Steady bass makes sparse treble sound pro.',
    drills: [
      'Thumb on open A only for 1 minute [Simple Fingerstyle Seed]',
      'Add index on B string &s (D20.2)',
      'Apply over Am shape (D20.3)'
    ],
    libraryIds: ['rf-open-am', 'ch-am'],
    masteryCheck: 'Day 20: Play 8 bars of thumb-bass + index answer without rushing.',
  },
  21: {
    title: 'Barre Preview — One-Finger Mini F',
    durationMin: 35,
    goals: [
      'Barre high E+B at fret 1 lightly (focus: Barre Preview)',
      'Add F shape pieces only if painless — day 21 step 2',
      'Stop at fatigue — tendons first — day 21 step 3'
    ],
    theoryBite: 'Day 21 focus — Barre Preview — One-Finger Mini F: Full F barre is a milestone, not day-one law. Mini shapes and strength build beat forced pain.',
    drills: [
      '1-finger barre chirps 10× [Barre Preview]',
      'Fmaj7 (easy) as alternate win (D21.2)',
      'Shake out every 30 seconds (D21.3)'
    ],
    libraryIds: ['ch-f', 'ch-c'],
    masteryCheck: 'Day 21: Sound two clean treble strings under a light fret-1 barre ten times.',
  },
  22: {
    title: 'Ear Starter — Find Melodies You Hum',
    durationMin: 30,
    goals: [
      'Hum a 3-note idea (focus: Ear Starter)',
      'Find it starting on open B or high E — day 22 step 2',
      'Repeat until fingers match voice — day 22 step 3'
    ],
    theoryBite: 'Day 22 focus — Ear Starter — Find Melodies You Hum: Voice→fret is the shortest path to musical ownership. Wrong notes are clues, not crimes.',
    drills: [
      'Hum → hunt → verify ×5 [Ear Starter]',
      'Change starting pitch once (D22.2)',
      'Write nothing; trust ears (D22.3)'
    ],
    libraryIds: ['sg-twinkle', 'sc-pent-maj'],
    masteryCheck: 'Day 22: Match a hummed 3-note idea on the guitar twice in a row.',
  },
  23: {
    title: 'Dynamics — Soft Verse, Bigger Chorus',
    durationMin: 30,
    goals: [
      'Play the same progression two volumes (focus: Dynamics)',
      'Use right-hand height/speed, not fretting squeeze — day 23 step 2',
      'Make a 16-bar mini arrangement — day 23 step 3'
    ],
    theoryBite: 'Day 23 focus — Dynamics — Soft Verse, Bigger Chorus: Expression is mostly right hand. Same chords, different story — instant ‘pro’ upgrade.',
    drills: [
      'G–C–D whisper level [Dynamics]',
      'Same progression conversation level (D23.2)',
      '8 soft + 8 fuller bars (D23.3)'
    ],
    libraryIds: ['pr-145', 'ch-g', 'ch-c', 'ch-d'],
    masteryCheck: 'Day 23: Perform 16 bars with a clear soft-to-louder lift listeners could notice.',
  },
  24: {
    title: 'Mute Craft — Left and Right Hand Silence',
    durationMin: 30,
    goals: [
      'Palm mute near the bridge (focus: Mute Craft)',
      'Fret-hand mute idle strings — day 24 step 2',
      'Play rest strokes on purpose — day 24 step 3'
    ],
    theoryBite: 'Day 24 focus — Mute Craft — Left and Right Hand Silence: Great rhythm guitar is half silence. Mutes turn strums into drums.',
    drills: [
      'Palm-muted E5 eighths [Mute Craft]',
      'Chuck on &s between chords (D24.2)',
      'Full stop rests for one bar in four (D24.3)'
    ],
    libraryIds: ['rf-power', 'ch-e'],
    masteryCheck: 'Day 24: Play 8 bars where mutes and rings are obviously intentional.',
  },
  25: {
    title: 'Song Sketch — Combine Melody + Two Chords',
    durationMin: 30,
    goals: [
      'Pick a 4-note melody cell (focus: Song Sketch)',
      'Answer with Em or G — day 25 step 2',
      'Loop as a tiny original — day 25 step 3'
    ],
    theoryBite: 'Day 25 focus — Song Sketch — Combine Melody + Two Chords: Creative ownership locks skills better than drills alone. Tiny songs beat perfect exercises.',
    drills: [
      'Compose cell on high strings [Song Sketch]',
      'Cell | Em | cell | G (D25.2)',
      'Name your sketch out loud (D25.3)'
    ],
    libraryIds: ['ch-em', 'ch-g', 'sc-pent-min'],
    masteryCheck: 'Day 25: Perform your 4-bar sketch twice from memory.',
  },
  26: {
    title: 'Timing Honesty — Metronome as Friend',
    durationMin: 30,
    goals: [
      'Play only on beat 1 of each bar for 1 minute (focus: Timing Honesty)',
      'Fill quarters only when solid — day 26 step 2',
      'Notice rush on easy bars — day 26 step 3'
    ],
    theoryBite: 'Day 26 focus — Timing Honesty — Metronome as Friend: Metronomes expose truth kindly. Landing late/early is data for the next rep.',
    drills: [
      'Chord hits on 1 only [Timing Honesty]',
      'Add beats 1 and 3 (D26.2)',
      'Full quarters at 65 BPM (D26.3)'
    ],
    libraryIds: ['pr-145', 'ch-g'],
    masteryCheck: 'Day 26: Stay with the click for 90 seconds of simple chord hits.',
  },
  27: {
    title: 'Review Web — Weakest Chord Rescue',
    durationMin: 30,
    goals: [
      'Identify your messiest shape (focus: Review Web)',
      'Isolate it for 5 focused minutes — day 27 step 2',
      'Reinsert into a progression — day 27 step 3'
    ],
    theoryBite: 'Day 27 focus — Review Web — Weakest Chord Rescue: Spaced repair beats random replay. Weak links define the chain — fix one per session.',
    drills: [
      'Honest ranking of Em G C D A Am E [Review Web]',
      'Ugly-chord gym 5 minutes (D27.2)',
      'Progression with ugly chord every bar 2 (D27.3)'
    ],
    libraryIds: ['ch-c', 'ch-d', 'ch-a', 'ch-f'],
    masteryCheck: 'Day 27: Name your weakest chord and show 10 cleaner frets of it than yesterday’s average.',
  },
  28: {
    title: 'Blues Tease — E7 A7 Shuffle Feel',
    durationMin: 35,
    goals: [
      'Form E7 and A7 (focus: Blues Tease)',
      'Two-bar shuffle strums — day 28 step 2',
      'Keep it greasy, not fast — day 28 step 3'
    ],
    theoryBite: 'Day 28 focus — Blues Tease — E7 A7 Shuffle Feel: Dominant chords + swing/shuffle hint = instant blues flavor without full 12-bar yet.',
    drills: [
      'E7 for 4 bars, A7 for 2, back [Blues Tease]',
      'Long-short shuffle strum try (D28.2)',
      'Smile — feel over perfection (D28.3)'
    ],
    libraryIds: ['ch-e7', 'ch-a7', 'pr-12bar'],
    masteryCheck: 'Day 28: Play a 12-bar-ish E7/A7 groove slowly for one full chorus feel.',
  },
  29: {
    title: 'Comfort Setup — Pain Flags and Breaks',
    durationMin: 30,
    goals: [
      'Check thumb/wrist for strain signs (focus: Comfort Setup)',
      'Schedule 30s breaks each 5 minutes — day 29 step 2',
      'Adjust strap/seat before pushing hard — day 29 step 3'
    ],
    theoryBite: 'Day 29 focus — Comfort Setup — Pain Flags and Breaks: No badge for pain. Sustainable technique is the only technique that reaches day 365.',
    drills: [
      'Posture reset checklist [Comfort Setup]',
      'Play 4 minutes, break 30s, repeat (D29.2)',
      'Note any hotspots in a phone memo (D29.3)'
    ],
    libraryIds: ['rf-spider', 'ch-em'],
    masteryCheck: 'Day 29: Complete today’s playing with zero ‘push through sharp pain’ moments.',
  },
  30: {
    title: 'Basics Capstone — 3-Minute Campfire Set',
    durationMin: 30,
    goals: [
      'Medley: progression + tiny melody + groove (focus: Basics Capstone)',
      'Recover from one intentional mistake — day 30 step 2',
      'End with a held final chord — day 30 step 3'
    ],
    theoryBite: 'Day 30 focus — Basics Capstone — 3-Minute Campfire Set: Performance is a skill: start, continue, recover, end. Capstones prove transfer, not trivia.',
    drills: [
      'Plan 3-minute order on paper [Basics Capstone]',
      'Full run no stops (D30.2)',
      'Second run with dynamics (D30.3)'
    ],
    libraryIds: ['pr-145', 'sg-twinkle', 'ch-em', 'ch-g', 'ch-c'],
    masteryCheck: 'Day 30: Deliver a ~3-minute mini-set using at least three chords and one melodic idea.',
  },
  31: {
    title: 'Chord Phase Open — Clean Changes Manifesto',
    durationMin: 30,
    goals: [
      'Audit dead notes on your core six chords (focus: Chord Phase Open)',
      'Pick one change to shrink this week — day 31 step 2',
      'Play music before drills finish — day 31 step 3'
    ],
    theoryBite: 'Day 31 focus — Chord Phase Open — Clean Changes Manifesto: Chord fluency is motor learning: slow, accurate reps beat sloppy speed. Music first keeps dopamine on board.',
    drills: [
      'Core six parade: Em G C D Am E [Chord Phase Open]',
      'Choose G–C or C–D as week focus (D31.2)',
      '60s song loop before any timer ego (D31.3)'
    ],
    libraryIds: ['ch-g', 'ch-c', 'ch-d', 'ch-em', 'ch-am'],
    masteryCheck: 'Day 31: Play a one-minute loop of four chords with fewer than three total dead landings.',
  },
  32: {
    title: 'G–C Highway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean G on beat 1 (focus: G–C Highway)',
      'Land clean C on beat 1 — day 32 step 2',
      'Keep right hand pulsing through the switch — day 32 step 3'
    ],
    theoryBite: 'Day 32 focus — G–C Highway — Change Lab: Shared notes and pivot fingers make G–C a high-ROI change. Practice the change as its own song: two chords, honest time.',
    drills: [
      'G freeze 8 strums [G–C Highway]',
      'G→C in half notes ×16 (D32.2)',
      'Four-bar groove using only G and C (D32.3)'
    ],
    libraryIds: ['ch-g', 'ch-c', 'pr-145'],
    masteryCheck: 'Day 32: Sixteen controlled G→C changes with clear downbeats.',
  },
  33: {
    title: 'C–D Doorway — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean C on beat 1 (focus: C–D Doorway)',
      'Land clean D on beat 1 — day 33 step 2',
      'Keep right hand pulsing through the switch — day 33 step 3'
    ],
    theoryBite: 'Day 33 focus — C–D Doorway — Change Lab: C to D teaches top-string accuracy and intentional muting of lows. Practice the change as its own song: two chords, honest time.',
    drills: [
      'C freeze 8 strums [C–D Doorway]',
      'C→D in half notes ×16 (D33.2)',
      'Four-bar groove using only C and D (D33.3)'
    ],
    libraryIds: ['ch-c', 'ch-d', 'pr-145'],
    masteryCheck: 'Day 33: Sixteen controlled C→D changes with clear downbeats.',
  },
  34: {
    title: 'D–Em Story — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean D on beat 1 (focus: D–Em Story)',
      'Land clean Em on beat 1 — day 34 step 2',
      'Keep right hand pulsing through the switch — day 34 step 3'
    ],
    theoryBite: 'Day 34 focus — D–Em Story — Change Lab: Major to relative-side minor motion — pop ballad fuel. Practice the change as its own song: two chords, honest time.',
    drills: [
      'D freeze 8 strums [D–Em Story]',
      'D→Em in half notes ×16 (D34.2)',
      'Four-bar groove using only D and Em (D34.3)'
    ],
    libraryIds: ['ch-d', 'ch-em', 'pr-145'],
    masteryCheck: 'Day 34: Sixteen controlled D→Em changes with clear downbeats.',
  },
  35: {
    title: 'Em–Am Kin — Change Lab',
    durationMin: 35,
    goals: [
      'Land clean Em on beat 1 (focus: Em–Am Kin)',
      'Land clean Am on beat 1 — day 35 step 2',
      'Keep right hand pulsing through the switch — day 35 step 3'
    ],
    theoryBite: 'Day 35 focus — Em–Am Kin — Change Lab: Two-finger family; great for minor mood without new pain. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Em freeze 8 strums [Em–Am Kin]',
      'Em→Am in half notes ×16 (D35.2)',
      'Four-bar groove using only Em and Am (D35.3)'
    ],
    libraryIds: ['ch-em', 'ch-am', 'pr-145'],
    masteryCheck: 'Day 35: Sixteen controlled Em→Am changes with clear downbeats.',
  },
  36: {
    title: 'Am–E Drama — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean Am on beat 1 (focus: Am–E Drama)',
      'Land clean E on beat 1 — day 36 step 2',
      'Keep right hand pulsing through the switch — day 36 step 3'
    ],
    theoryBite: 'Day 36 focus — Am–E Drama — Change Lab: Classic tension pair in Am songs and Andalusian cousins. Practice the change as its own song: two chords, honest time.',
    drills: [
      'Am freeze 8 strums [Am–E Drama]',
      'Am→E in half notes ×16 (D36.2)',
      'Four-bar groove using only Am and E (D36.3)'
    ],
    libraryIds: ['ch-am', 'ch-e', 'pr-145'],
    masteryCheck: 'Day 36: Sixteen controlled Am→E changes with clear downbeats.',
  },
  37: {
    title: 'E–A Rock Gate — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean E on beat 1 (focus: E–A Rock Gate)',
      'Land clean A on beat 1 — day 37 step 2',
      'Keep right hand pulsing through the switch — day 37 step 3'
    ],
    theoryBite: 'Day 37 focus — E–A Rock Gate — Change Lab: Open-position rock/blues pillars on the circle of fourths. Practice the change as its own song: two chords, honest time.',
    drills: [
      'E freeze 8 strums [E–A Rock Gate]',
      'E→A in half notes ×16 (D37.2)',
      'Four-bar groove using only E and A (D37.3)'
    ],
    libraryIds: ['ch-e', 'ch-a', 'pr-145'],
    masteryCheck: 'Day 37: Sixteen controlled E→A changes with clear downbeats.',
  },
  38: {
    title: 'A–D Bright Lift — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean A on beat 1 (focus: A–D Bright Lift)',
      'Land clean D on beat 1 — day 38 step 2',
      'Keep right hand pulsing through the switch — day 38 step 3'
    ],
    theoryBite: 'Day 38 focus — A–D Bright Lift — Change Lab: I–IV color in A; keep D on four strings only. Practice the change as its own song: two chords, honest time.',
    drills: [
      'A freeze 8 strums [A–D Bright Lift]',
      'A→D in half notes ×16 (D38.2)',
      'Four-bar groove using only A and D (D38.3)'
    ],
    libraryIds: ['ch-a', 'ch-d', 'pr-145'],
    masteryCheck: 'Day 38: Sixteen controlled A→D changes with clear downbeats.',
  },
  39: {
    title: 'G–Em Soften — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean G on beat 1 (focus: G–Em Soften)',
      'Land clean Em on beat 1 — day 39 step 2',
      'Keep right hand pulsing through the switch — day 39 step 3'
    ],
    theoryBite: 'Day 39 focus — G–Em Soften — Change Lab: I–vi motion — instant emotional turn without new shapes. Practice the change as its own song: two chords, honest time.',
    drills: [
      'G freeze 8 strums [G–Em Soften]',
      'G→Em in half notes ×16 (D39.2)',
      'Four-bar groove using only G and Em (D39.3)'
    ],
    libraryIds: ['ch-g', 'ch-em', 'pr-145'],
    masteryCheck: 'Day 39: Sixteen controlled G→Em changes with clear downbeats.',
  },
  40: {
    title: 'C–Am Relative — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean C on beat 1 (focus: C–Am Relative)',
      'Land clean Am on beat 1 — day 40 step 2',
      'Keep right hand pulsing through the switch — day 40 step 3'
    ],
    theoryBite: 'Day 40 focus — C–Am Relative — Change Lab: Relative major/minor toggle trains ears and fingers together. Practice the change as its own song: two chords, honest time.',
    drills: [
      'C freeze 8 strums [C–Am Relative]',
      'C→Am in half notes ×16 (D40.2)',
      'Four-bar groove using only C and Am (D40.3)'
    ],
    libraryIds: ['ch-c', 'ch-am', 'pr-145'],
    masteryCheck: 'Day 40: Sixteen controlled C→Am changes with clear downbeats.',
  },
  41: {
    title: 'G–D Anthem — Change Lab',
    durationMin: 30,
    goals: [
      'Land clean G on beat 1 (focus: G–D Anthem)',
      'Land clean D on beat 1 — day 41 step 2',
      'Keep right hand pulsing through the switch — day 41 step 3'
    ],
    theoryBite: 'Day 41 focus — G–D Anthem — Change Lab: I–V without IV; huge for two-chord songs and drones. Practice the change as its own song: two chords, honest time.',
    drills: [
      'G freeze 8 strums [G–D Anthem]',
      'G→D in half notes ×16 (D41.2)',
      'Four-bar groove using only G and D (D41.3)'
    ],
    libraryIds: ['ch-g', 'ch-d', 'pr-145'],
    masteryCheck: 'Day 41: Sixteen controlled G→D changes with clear downbeats.',
  },
  42: {
    title: 'F Maj7 Gateway — Barre Without Tears',
    durationMin: 35,
    goals: [
      'Play Fmaj7 (easy) as musical F color (focus: F Maj7 Gateway)',
      'Try mini barre only if pain-free — day 42 step 2',
      'Use Fmaj7 inside C–Am–Fmaj7–G — day 42 step 3'
    ],
    theoryBite: 'Day 42 focus — F Maj7 Gateway — Barre Without Tears: Fmaj7 gives ‘F function’ with less compression than full barre — successive approximation in action.',
    drills: [
      'Fmaj7 string audit [F Maj7 Gateway]',
      'C–Fmaj7 slow changes (D42.2)',
      'Pop loop C–Am–Fmaj7–G (D42.3)'
    ],
    libraryIds: ['ch-f', 'ch-c', 'ch-am', 'ch-g', 'pr-1645'],
    masteryCheck: 'Day 42: Play one clean C–Am–Fmaj7–G chorus at practice tempo.',
  },
  43: {
    title: 'Full F Attempt — Strength + Mercy',
    durationMin: 30,
    goals: [
      'Roll barre finger lightly for even pressure (focus: Full F Attempt)',
      'Prioritize high E and B clarity first — day 43 step 2',
      'Cap sessions before joint pain — day 43 step 3'
    ],
    theoryBite: 'Day 43 focus — Full F Attempt — Strength + Mercy: Barre strength is tissue adaptation over weeks. Clarity on two strings beats six muffled strings.',
    drills: [
      'Barre chirps 1 minute [Full F Attempt]',
      'F for 4 strums, rest, repeat (D43.2)',
      'Swap Fmaj7 when form collapses (D43.3)'
    ],
    libraryIds: ['ch-f', 'ch-c'],
    masteryCheck: 'Day 43: Produce four consecutive F strums where melody strings speak.',
  },
  44: {
    title: 'B Minor Barre — Am Shape Moved',
    durationMin: 30,
    goals: [
      'See Bm as Am shape at fret 2 (focus: B Minor Barre)',
      'Barre fret 2 with calm wrist — day 44 step 2',
      'Bm–G–D–A modern loop — day 44 step 3'
    ],
    theoryBite: 'Day 44 focus — B Minor Barre — Am Shape Moved: Movable minor shapes unlock the neck. Bm is the classic first barre minor after F struggles.',
    drills: [
      'Air-shape Am then slide idea to fret 2 [B Minor Barre]',
      'Bm string audit low to high (D44.2)',
      'Bm–G–D–A half-time groove (D44.3)'
    ],
    libraryIds: ['ch-bm', 'ch-g', 'ch-d', 'ch-a'],
    masteryCheck: 'Day 44: Play Bm clear enough for a two-bar loop into G.',
  },
  45: {
    title: 'CAGED Peek — C Shape Home',
    durationMin: 30,
    goals: [
      'Spot open C as a CAGED anchor (focus: CAGED Peek)',
      'Play C major arpeggio from the shape — day 45 step 2',
      'Connect chord tones, not only strums — day 45 step 3'
    ],
    theoryBite: 'Day 45 focus — CAGED Peek — C Shape Home: CAGED maps five chord shapes up the neck. Today: hear C as tones, not a grip only.',
    drills: [
      'Open C arpeggio slow [CAGED Peek]',
      'Library CAGED C riff once (D45.2)',
      'Chord-tone ending on every phrase (D45.3)'
    ],
    libraryIds: ['rf-caged-c', 'ch-c', 'sc-major'],
    masteryCheck: 'Day 45: Arpeggiate open C ascending and descending cleanly twice.',
  },
  46: {
    title: 'I–vi–IV–V Pop Engine in C',
    durationMin: 30,
    goals: [
      'Own C–Am–F–G order (focus: I–vi–IV–V Pop Engine in C)',
      'Two strums per chord then four — day 46 step 2',
      'Sing a nonsense melody over it — day 46 step 3'
    ],
    theoryBite: 'Day 46 focus — I–vi–IV–V Pop Engine in C: The 50s/pop progression is ear candy and change training in one. F may be Fmaj7.',
    drills: [
      'Chord order chant while fretting [I–vi–IV–V Pop Engine in C]',
      'Loop at 72 BPM (D46.2)',
      'Melody doodle on G string only (D46.3)'
    ],
    libraryIds: ['pr-1645', 'ch-c', 'ch-am', 'ch-f', 'ch-g'],
    masteryCheck: 'Day 46: Play two full C–Am–F–G choruses without stopping.',
  },
  47: {
    title: '12-Bar Blues Form — Count the Story',
    durationMin: 30,
    goals: [
      'Memorize 12-bar map in A (focus: 12-Bar Blues Form)',
      'Play A7 D7 E7 on the form — day 47 step 2',
      'Say bar numbers as you play once — day 47 step 3'
    ],
    theoryBite: 'Day 47 focus — 12-Bar Blues Form — Count the Story: Form memory is musicianship. 12-bar blues is a reusable story: home, away, home, turnaround.',
    drills: [
      'Air-count 12 bars [12-Bar Blues Form]',
      'One chorus chords only (D47.2)',
      'Turnaround spotlight last 4 bars (D47.3)'
    ],
    libraryIds: ['pr-12bar', 'ch-a7', 'ch-d7', 'ch-e7'],
    masteryCheck: 'Day 47: Play one full 12-bar chorus in A with correct chord changes.',
  },
  48: {
    title: 'Andalusian Color — Am G F E',
    durationMin: 30,
    goals: [
      'Walk Am–G–F–E slowly (focus: Andalusian Color)',
      'Feel E as dramatic dominant — day 48 step 2',
      'Add simple phrygian-ish top notes later if easy — day 48 step 3'
    ],
    theoryBite: 'Day 48 focus — Andalusian Color — Am G F E: Am–G–F–E is a centuries-old descent. The E major chord is the spicy door home to Am.',
    drills: [
      'Two bars each chord [Andalusian Color]',
      'Bass note emphasis on beat 1 (D48.2)',
      'Soft→strong into E (D48.3)'
    ],
    libraryIds: ['pr-andalu', 'ch-am', 'ch-g', 'ch-f', 'ch-e'],
    masteryCheck: 'Day 48: Play two Andalusian cycles with a deliberate dramatic E.',
  },
  49: {
    title: 'Jazz Tease — ii–V–I in C',
    durationMin: 35,
    goals: [
      'Play Dm–G7–C (focus: Jazz Tease)',
      'Hear G7 pull to C — day 49 step 2',
      'Add Am before Dm for vi–ii–V–I — day 49 step 3'
    ],
    theoryBite: 'Day 49 focus — Jazz Tease — ii–V–I in C: ii–V–I is the backbone of countless standards. Small vocabulary, huge repertoire unlock.',
    drills: [
      'Dm–G7–C ballad tempo [Jazz Tease]',
      'Am–Dm–G7–C loop (D49.2)',
      'Light swing optional (D49.3)'
    ],
    libraryIds: ['pr-6251', 'ch-dm', 'ch-g7', 'ch-c', 'ch-am'],
    masteryCheck: 'Day 49: Play four clean ii–V–I cadences in C.',
  },
  50: {
    title: 'Slash Ideas — Bass Motion Without New Shapes',
    durationMin: 30,
    goals: [
      'Alternate G and G/B feeling via bass focus (focus: Slash Ideas)',
      'Walk bass open strings under static shapes when possible — day 50 step 2',
      'Keep treble calm while bass moves — day 50 step 3'
    ],
    theoryBite: 'Day 50 focus — Slash Ideas — Bass Motion Without New Shapes: Bass motion sells progressions. Even simple open-string bass changes make campfire chords cinematic.',
    drills: [
      'G with low B emphasis if fretted [Slash Ideas]',
      'C with low E drone experiments carefully (D50.2)',
      'Record bass-heavy take (D50.3)'
    ],
    libraryIds: ['ch-g', 'ch-c', 'ch-am'],
    masteryCheck: 'Day 50: Demonstrate one progression where bass motion is obviously intentional.',
  },
  51: {
    title: 'Dead-Note Clinic — Pluck Audit Method',
    durationMin: 30,
    goals: [
      'After each grab, pluck strings one by one (focus: Dead-Note Clinic)',
      'Fix the worst string only — day 51 step 2',
      'Re-strum and re-audit — day 51 step 3'
    ],
    theoryBite: 'Day 51 focus — Dead-Note Clinic — Pluck Audit Method: Diagnosis before speed. Pros still pluck-audit when a chord turns to mud.',
    drills: [
      'Audit G C D Am [Dead-Note Clinic]',
      'Worst-string isolation 3 minutes (D51.2)',
      'Progression with audit every 4 bars (D51.3)'
    ],
    libraryIds: ['ch-g', 'ch-c', 'ch-d', 'ch-am'],
    masteryCheck: 'Day 51: Show before/after: one chord goes from muddy to clear via audit fixes.',
  },
  52: {
    title: 'Strum Vocabulary — Boom-Chuck Country Seed',
    durationMin: 30,
    goals: [
      'Bass note on beats 1 and 3 (focus: Strum Vocabulary)',
      'Chord chuck on 2 and 4 — day 52 step 2',
      'Apply to G–C–D — day 52 step 3'
    ],
    theoryBite: 'Day 52 focus — Strum Vocabulary — Boom-Chuck Country Seed: Boom-chuck separates bass and chord — instant style without new harmony.',
    drills: [
      'Open-G boom-chuck 1 minute [Strum Vocabulary]',
      'Add C and D (D52.2)',
      'Keep arm loose like a soft drum (D52.3)'
    ],
    libraryIds: ['pr-145', 'ch-g', 'ch-c', 'ch-d'],
    masteryCheck: 'Day 52: Play 8 bars of boom-chuck G–C–D with audible bass/chord split.',
  },
  53: {
    title: 'Reggae Skank Seed — Upbeat Chops',
    durationMin: 30,
    goals: [
      'Chop chords on the &s (focus: Reggae Skank Seed)',
      'Leave downbeats empty — day 53 step 2',
      'Tiny fret pressure for short decays — day 53 step 3'
    ],
    theoryBite: 'Day 53 focus — Reggae Skank Seed — Upbeat Chops: Space defines reggae guitar. Hitting less is the skill — upstrokes and mutes do the dance.',
    drills: [
      'Muted & chops 1 minute [Reggae Skank Seed]',
      'C–G skank loop (D53.2)',
      'Foot still on quarters while hands play offs (D53.3)'
    ],
    libraryIds: ['ch-c', 'ch-g', 'ch-am'],
    masteryCheck: 'Day 53: Play 8 bars of upbeat chops with quiet downbeats.',
  },
  54: {
    title: 'Fingerpicking Pattern — p-i-m-a Seed in C',
    durationMin: 30,
    goals: [
      'Thumb on C bass (A string) (focus: Fingerpicking Pattern)',
      'i-m-a on G B E strings — day 54 step 2',
      'Pattern steady before chord changes — day 54 step 3'
    ],
    theoryBite: 'Day 54 focus — Fingerpicking Pattern — p-i-m-a Seed in C: Classical/folk pattern pima builds right-hand automation so left hand can think about songs.',
    drills: [
      'Open strings pima [Fingerpicking Pattern]',
      'Pima on C shape (D54.2)',
      'C to G change with pattern continuing (D54.3)'
    ],
    libraryIds: ['ch-c', 'ch-g', 'rf-open-am'],
    masteryCheck: 'Day 54: Play 8 bars of steady pima on C, then 4 bars changing to G.',
  },
  55: {
    title: 'Capo Creativity — Same Shapes New Key',
    durationMin: 30,
    goals: [
      'If you own a capo, place at fret 2 and play G shapes (focus: Capo Creativity)',
      'Without capo, simulate by moving a shape up two frets mentally — day 55 step 2',
      'Notice singer-friendly pitch lift — day 55 step 3'
    ],
    theoryBite: 'Day 55 focus — Capo Creativity — Same Shapes New Key: Capos let beginners play in many keys with open shapes — practical musicianship over theory pride.',
    drills: [
      'G–C–D open, then with capo 2 if available [Capo Creativity]',
      'Sing a higher comfortable note (D55.2)',
      'Write which fret felt good for your voice (D55.3)'
    ],
    libraryIds: ['pr-145', 'ch-g', 'ch-c', 'ch-d'],
    masteryCheck: 'Day 55: Demonstrate the same progression in two pitch levels (capo or movable idea).',
  },
  56: {
    title: 'Chord Melody Seed — Melody on Top of C',
    durationMin: 35,
    goals: [
      'Hold C shape (focus: Chord Melody Seed)',
      'Move only the high E finger for melody nubs — day 56 step 2',
      'Keep lower strings as pad — day 56 step 3'
    ],
    theoryBite: 'Day 56 focus — Chord Melody Seed — Melody on Top of C: Chord-melody starts as ‘pad + top note.’ Smallest version still sounds arranged.',
    drills: [
      'C with high E open/1/3 options [Chord Melody Seed]',
      'Resolve top notes to E (chord tone) (D56.2)',
      '4-bar pad melody (D56.3)'
    ],
    libraryIds: ['ch-c', 'sg-ode'],
    masteryCheck: 'Day 56: Play a 4-bar idea where a C pad supports a changing top note.',
  },
  57: {
    title: 'Hybrid Review — Blues + Pop Same Day',
    durationMin: 30,
    goals: [
      'One chorus 12-bar A7 world (focus: Hybrid Review)',
      'One chorus C–Am–F–G world — day 57 step 2',
      'Notice right-hand feel shifts — day 57 step 3'
    ],
    theoryBite: 'Day 57 focus — Hybrid Review — Blues + Pop Same Day: Interleaving styles builds flexible hands. Same week, multiple grooves — research-backed retention.',
    drills: [
      'Blues chorus [Hybrid Review]',
      'Pop chorus (D57.2)',
      '30s rest between; no mash until both stable (D57.3)'
    ],
    libraryIds: ['pr-12bar', 'pr-1645', 'ch-a7', 'ch-c'],
    masteryCheck: 'Day 57: Play one solid blues chorus and one solid pop chorus back-to-back.',
  },
  58: {
    title: 'Transition Gym — Worst Two Bars Only',
    durationMin: 30,
    goals: [
      'Loop only the sticky change (focus: Transition Gym)',
      'Add context bars after it improves — day 58 step 2',
      'Resist full-song restarts — day 58 step 3'
    ],
    theoryBite: 'Day 58 focus — Transition Gym — Worst Two Bars Only: Deliberate practice targets the bottleneck. Restarting from the intro wastes the reps that matter.',
    drills: [
      'Identify stickiest two chords [Transition Gym]',
      '2-minute isolation (D58.2)',
      '4-bar context insert (D58.3)'
    ],
    libraryIds: ['ch-f', 'ch-c', 'ch-bm', 'ch-g'],
    masteryCheck: 'Day 58: Show a sticky change that is cleaner after isolation than before.',
  },
  59: {
    title: 'Open-Chord Orchestra — Layer Dynamics + Strum',
    durationMin: 30,
    goals: [
      'Combine boom-chuck and full strums (focus: Open-Chord Orchestra)',
      'Arrange verse vs chorus textures — day 59 step 2',
      'End on a held ring — day 59 step 3'
    ],
    theoryBite: 'Day 59 focus — Open-Chord Orchestra — Layer Dynamics + Strum: Arrangement skills turn three chords into a performance. Texture changes read as ‘more pro’ than new chords.',
    drills: [
      'Verse: boom-chuck [Open-Chord Orchestra]',
      'Chorus: fuller D-DU (D59.2)',
      'Final bar fermata (D59.3)'
    ],
    libraryIds: ['pr-145', 'ch-g', 'ch-c', 'ch-d'],
    masteryCheck: 'Day 59: Perform a 16-bar arrangement with two clear textures and a deliberate ending.',
  },
  60: {
    title: 'Change Speed Ladder — Week 5 · Focus DM/D',
    durationMin: 30,
    goals: [
      'Start changes at half note pace (focus: Change Speed Ladder)',
      'Step to quarters only after clean — day 60 step 2',
      'Never skip the clean rung — day 60 step 3'
    ],
    theoryBite: 'Day 60 focus — Change Speed Ladder — Week 5 · Focus DM/D: Tempo ladders respect motor learning: accuracy is the gateway; speed is a side effect.',
    drills: [
      '2 minutes half-note changes [Change Speed Ladder]',
      '1 minute quarters if clean (D60.2)',
      'Back down if dead notes return (D60.3)'
    ],
    libraryIds: ['ch-dm', 'ch-d', 'pr-andalu', 'sg-shenandoah', 'rf-g-caged-run-study'],
    masteryCheck: 'Day 60: Show the fastest tempo today where changes stay ≥90% clean.',
  },
  61: {
    title: 'Groove First — Chords as Drums 5.2 · Focus C/EM',
    durationMin: 30,
    goals: [
      'Mute progression as pure rhythm (focus: Groove First)',
      'Add fretting only after groove locks — day 61 step 2',
      'Match foot to right hand — day 61 step 3'
    ],
    theoryBite: 'Day 61 focus — Groove First — Chords as Drums 5.2 · Focus C/EM: If the right hand is unsure, fretting hand panic rises. Groove-first order reduces cognitive load.',
    drills: [
      'Muted progression 1 minute [Groove First]',
      'Frets on, same right hand (D61.2)',
      'Check shoulders for climb (D61.3)'
    ],
    libraryIds: ['ch-c', 'ch-em', 'pr-145', 'sg-red-river-valley', 'rf-c-bass-walk-study'],
    masteryCheck: 'Day 61: Play 60 seconds where groove would still work with fretting hand removed.',
  },
  62: {
    title: 'Ear Harmony — Guess the Next Chord 5 · Focus G/AM',
    durationMin: 30,
    goals: [
      'Play I and pause (focus: Ear Harmony)',
      'Sing what you want next — day 62 step 2',
      'Find it among known shapes — day 62 step 3'
    ],
    theoryBite: 'Day 62 focus — Ear Harmony — Guess the Next Chord 5 · Focus G/AM: Predicting harmony builds inner hearing — the skill behind jamming with humans.',
    drills: [
      'G then mystery [Ear Harmony]',
      'Limit options to C D Em Am (D62.2)',
      'Confirm by consonance (D62.3)'
    ],
    libraryIds: ['ch-g', 'ch-am', 'pr-1645', 'sg-home-on-the-range', 'rf-spanish-e-phrygian-study'],
    masteryCheck: 'Day 62: Correctly predict and play the next chord three times in a row in a simple loop.',
  },
  63: {
    title: 'Soft Hands Day — Tension Audit 5 · Focus D/E',
    durationMin: 35,
    goals: [
      'Rate fretting pressure 1–10 (focus: Soft Hands Day)',
      'Drop one full point and re-test tone — day 63 step 2',
      'Keep tone with less squeeze — day 63 step 3'
    ],
    theoryBite: 'Day 63 focus — Soft Hands Day — Tension Audit 5 · Focus D/E: Excess grip is the silent beginner tax. Tone often survives — and improves — with less force.',
    drills: [
      'Squeeze scale on one chord [Soft Hands Day]',
      'Find minimum viable pressure (D63.2)',
      'Progression at that pressure (D63.3)'
    ],
    libraryIds: ['ch-d', 'ch-e', 'pr-6251', 'sg-turkey-in-the-straw', 'rf-funk-chicka-study'],
    masteryCheck: 'Day 63: Play a progression at noticeably lower grip without losing core chord tones.',
  },
  64: {
    title: 'Song Transfer — Chords Into a PD Melody Day 5 · Focus EM/A',
    durationMin: 30,
    goals: [
      'Pick a library melody you know (focus: Song Transfer)',
      'Companion it with two chords — day 64 step 2',
      'Alternate melody and comping — day 64 step 3'
    ],
    theoryBite: 'Day 64 focus — Song Transfer — Chords Into a PD Melody Day 5 · Focus EM/A: Transfer proves learning. Melodies + chords in one sitting mirror real guitar roles.',
    drills: [
      'Melody phrase [Song Transfer]',
      'Chord answer (D64.2)',
      'Trade every two bars (D64.3)'
    ],
    libraryIds: ['ch-em', 'ch-a', 'pr-12bar', 'sg-arkansas-traveler', 'rf-palm-mute-chug-study'],
    masteryCheck: 'Day 64: Perform a 8+ bar trade between melody fragments and chord answers.',
  },
  65: {
    title: 'Weekly Chord Checkpoint 5 · Focus AM/F',
    durationMin: 30,
    goals: [
      'Run core progression medley (focus: Weekly Chord Checkpoint 5 · Focus AM/F)',
      'Include one stretch chord (F/Bm/7th) — day 65 step 2',
      'Record a keepable take — day 65 step 3'
    ],
    theoryBite: 'Day 65 focus — Weekly Chord Checkpoint 5 · Focus AM/F: Weekly retrieval practice strengthens memory more than massed cramming — make it musical.',
    drills: [
      '3-minute medley plan [Weekly Chord Checkpoint 5 · Focus AM/F]',
      'One take record (D65.2)',
      'Note one win + one target (D65.3)'
    ],
    libraryIds: ['ch-am', 'ch-f', 'pr-andalu', 'sg-sailor-s-hornpipe', 'rf-jazz-chromatic-approach-study'],
    masteryCheck: 'Day 65: Produce a recorded take that includes at least five different chord qualities/shapes.',
  },
  66: {
    title: 'Chord Color Week 6 — Suspension Taste · Focus E/BM',
    durationMin: 30,
    goals: [
      'Add a simple sus flavor by lifting one finger briefly (focus: Chord Color Week 6)',
      'Return to the triad so tension resolves — day 66 step 2',
      'Keep time while coloring — day 66 step 3'
    ],
    theoryBite: 'Day 66 focus — Chord Color Week 6 — Suspension Taste · Focus E/BM: Suspensions delay chord tones — even a lifted finger creates pro motion without new theory charts.',
    drills: [
      'Choose one easy open chord [Chord Color Week 6]',
      'Lift/replace a finger on & of 4 (D66.2)',
      'Resolve on beat 1 of next bar (D66.3)'
    ],
    libraryIds: ['ch-e', 'ch-bm', 'pr-145', 'sg-drunken-sailor', 'rf-am-arpeggio-cascade'],
    masteryCheck: 'Day 66: Create three intentional sus-and-resolve moments inside a steady progression.',
  },
  67: {
    title: 'Change Speed Ladder — Week 6 · Focus A/C7',
    durationMin: 30,
    goals: [
      'Start changes at half note pace (focus: Change Speed Ladder)',
      'Step to quarters only after clean — day 67 step 2',
      'Never skip the clean rung — day 67 step 3'
    ],
    theoryBite: 'Day 67 focus — Change Speed Ladder — Week 6 · Focus A/C7: Tempo ladders respect motor learning: accuracy is the gateway; speed is a side effect.',
    drills: [
      '2 minutes half-note changes [Change Speed Ladder]',
      '1 minute quarters if clean (D67.2)',
      'Back down if dead notes return (D67.3)'
    ],
    libraryIds: ['ch-a', 'ch-c7', 'pr-1645', 'sg-molly-malone', 'rf-drop-d-power-study'],
    masteryCheck: 'Day 67: Show the fastest tempo today where changes stay ≥90% clean.',
  },
  68: {
    title: 'Groove First — Chords as Drums 6.2 · Focus F/G7',
    durationMin: 30,
    goals: [
      'Mute progression as pure rhythm (focus: Groove First)',
      'Add fretting only after groove locks — day 68 step 2',
      'Match foot to right hand — day 68 step 3'
    ],
    theoryBite: 'Day 68 focus — Groove First — Chords as Drums 6.2 · Focus F/G7: If the right hand is unsure, fretting hand panic rises. Groove-first order reduces cognitive load.',
    drills: [
      'Muted progression 1 minute [Groove First]',
      'Frets on, same right hand (D68.2)',
      'Check shoulders for climb (D68.3)'
    ],
    libraryIds: ['ch-f', 'ch-g7', 'pr-6251', 'sg-the-parting-glass', 'rf-travis-pick-sketch-in-c'],
    masteryCheck: 'Day 68: Play 60 seconds where groove would still work with fretting hand removed.',
  },
  69: {
    title: 'Ear Harmony — Guess the Next Chord 6 · Focus BM/D7',
    durationMin: 30,
    goals: [
      'Play I and pause (focus: Ear Harmony)',
      'Sing what you want next — day 69 step 2',
      'Find it among known shapes — day 69 step 3'
    ],
    theoryBite: 'Day 69 focus — Ear Harmony — Guess the Next Chord 6 · Focus BM/D7: Predicting harmony builds inner hearing — the skill behind jamming with humans.',
    drills: [
      'G then mystery [Ear Harmony]',
      'Limit options to C D Em Am (D69.2)',
      'Confirm by consonance (D69.3)'
    ],
    libraryIds: ['ch-bm', 'ch-d7', 'pr-12bar', 'sg-simple-gifts', 'rf-natural-harmonics-study'],
    masteryCheck: 'Day 69: Correctly predict and play the next chord three times in a row in a simple loop.',
  },
  70: {
    title: 'Soft Hands Day — Tension Audit 6 · Focus C7/A7',
    durationMin: 35,
    goals: [
      'Rate fretting pressure 1–10 (focus: Soft Hands Day)',
      'Drop one full point and re-test tone — day 70 step 2',
      'Keep tone with less squeeze — day 70 step 3'
    ],
    theoryBite: 'Day 70 focus — Soft Hands Day — Tension Audit 6 · Focus C7/A7: Excess grip is the silent beginner tax. Tone often survives — and improves — with less force.',
    drills: [
      'Squeeze scale on one chord [Soft Hands Day]',
      'Find minimum viable pressure (D70.2)',
      'Progression at that pressure (D70.3)'
    ],
    libraryIds: ['ch-c7', 'ch-a7', 'pr-andalu', 'sg-wayfaring-stranger', 'rf-minor-slide-lick-study'],
    masteryCheck: 'Day 70: Play a progression at noticeably lower grip without losing core chord tones.',
  },
  71: {
    title: 'Song Transfer — Chords Into a PD Melody Day 6 · Focus G7/E7',
    durationMin: 30,
    goals: [
      'Pick a library melody you know (focus: Song Transfer)',
      'Companion it with two chords — day 71 step 2',
      'Alternate melody and comping — day 71 step 3'
    ],
    theoryBite: 'Day 71 focus — Song Transfer — Chords Into a PD Melody Day 6 · Focus G7/E7: Transfer proves learning. Melodies + chords in one sitting mirror real guitar roles.',
    drills: [
      'Melody phrase [Song Transfer]',
      'Chord answer (D71.2)',
      'Trade every two bars (D71.3)'
    ],
    libraryIds: ['ch-g7', 'ch-e7', 'pr-145', 'sg-barbara-allen', 'rf-open-am'],
    masteryCheck: 'Day 71: Perform a 8+ bar trade between melody fragments and chord answers.',
  },
  72: {
    title: 'Weekly Chord Checkpoint 6 · Focus D7/DM',
    durationMin: 30,
    goals: [
      'Run core progression medley (focus: Weekly Chord Checkpoint 6 · Focus D7/DM)',
      'Include one stretch chord (F/Bm/7th) — day 72 step 2',
      'Record a keepable take — day 72 step 3'
    ],
    theoryBite: 'Day 72 focus — Weekly Chord Checkpoint 6 · Focus D7/DM: Weekly retrieval practice strengthens memory more than massed cramming — make it musical.',
    drills: [
      '3-minute medley plan [Weekly Chord Checkpoint 6 · Focus D7/DM]',
      'One take record (D72.2)',
      'Note one win + one target (D72.3)'
    ],
    libraryIds: ['ch-d7', 'ch-dm', 'pr-1645', 'sg-down-by-the-riverside', 'rf-power'],
    masteryCheck: 'Day 72: Produce a recorded take that includes at least five different chord qualities/shapes.',
  },
  73: {
    title: 'Chord Color Week 7 — Suspension Taste · Focus A7/C',
    durationMin: 30,
    goals: [
      'Add a simple sus flavor by lifting one finger briefly (focus: Chord Color Week 7)',
      'Return to the triad so tension resolves — day 73 step 2',
      'Keep time while coloring — day 73 step 3'
    ],
    theoryBite: 'Day 73 focus — Chord Color Week 7 — Suspension Taste · Focus A7/C: Suspensions delay chord tones — even a lifted finger creates pro motion without new theory charts.',
    drills: [
      'Choose one easy open chord [Chord Color Week 7]',
      'Lift/replace a finger on & of 4 (D73.2)',
      'Resolve on beat 1 of next bar (D73.3)'
    ],
    libraryIds: ['ch-a7', 'ch-c', 'pr-6251', 'sg-skip-to-my-lou', 'rf-blues-sh'],
    masteryCheck: 'Day 73: Create three intentional sus-and-resolve moments inside a steady progression.',
  },
  74: {
    title: 'Change Speed Ladder — Week 7 · Focus E7/G',
    durationMin: 30,
    goals: [
      'Start changes at half note pace (focus: Change Speed Ladder)',
      'Step to quarters only after clean — day 74 step 2',
      'Never skip the clean rung — day 74 step 3'
    ],
    theoryBite: 'Day 74 focus — Change Speed Ladder — Week 7 · Focus E7/G: Tempo ladders respect motor learning: accuracy is the gateway; speed is a side effect.',
    drills: [
      '2 minutes half-note changes [Change Speed Ladder]',
      '1 minute quarters if clean (D74.2)',
      'Back down if dead notes return (D74.3)'
    ],
    libraryIds: ['ch-e7', 'ch-g', 'pr-12bar', 'sg-i-ve-been-working-on-the-railroa', 'rf-spider'],
    masteryCheck: 'Day 74: Show the fastest tempo today where changes stay ≥90% clean.',
  },
  75: {
    title: 'Groove First — Chords as Drums 7.2 · Focus DM/D',
    durationMin: 30,
    goals: [
      'Mute progression as pure rhythm (focus: Groove First)',
      'Add fretting only after groove locks — day 75 step 2',
      'Match foot to right hand — day 75 step 3'
    ],
    theoryBite: 'Day 75 focus — Groove First — Chords as Drums 7.2 · Focus DM/D: If the right hand is unsure, fretting hand panic rises. Groove-first order reduces cognitive load.',
    drills: [
      'Muted progression 1 minute [Groove First]',
      'Frets on, same right hand (D75.2)',
      'Check shoulders for climb (D75.3)'
    ],
    libraryIds: ['ch-dm', 'ch-d', 'pr-andalu', 'sg-she-ll-be-coming-round-the-mount', 'rf-caged-c'],
    masteryCheck: 'Day 75: Play 60 seconds where groove would still work with fretting hand removed.',
  },
  76: {
    title: 'Scales Phase Open — Maps for Music',
    durationMin: 30,
    goals: [
      'Reframe scales as melody menus (focus: Scales Phase Open)',
      'Play box 1 with rests on purpose — day 76 step 2',
      'Resolve phrases to the root — day 76 step 3'
    ],
    theoryBite: 'Day 76 focus — Scales Phase Open — Maps for Music: Scales are not homework; they are GPS for riffs. Space and target notes turn boxes into language.',
    drills: [
      'A minor pent up/down with a rest every 4 notes [Scales Phase Open]',
      'End every phrase on A (D76.2)',
      'One-minute 3-note story (D76.3)'
    ],
    libraryIds: ['sc-pent-min', 'ch-am'],
    masteryCheck: 'Day 76: Improvise 60 seconds in box 1 that still sounds like sentences, not a drill.',
  },
  77: {
    title: 'Minor Pent Box 1 Mastery — Even Tone',
    durationMin: 35,
    goals: [
      'Even volume ascending and descending (focus: Minor Pent Box 1 Mastery)',
      'Thumb stable behind neck — day 77 step 2',
      'Metronome 60–70 BPM eighths — day 77 step 3'
    ],
    theoryBite: 'Day 77 focus — Minor Pent Box 1 Mastery — Even Tone: Evenness > speed. Recording yourself exposes hidden accents that fight the groove.',
    drills: [
      'Slow box with metronome [Minor Pent Box 1 Mastery]',
      'Accent only beat 1 roots (D77.2)',
      'Quiet the notes that pop too hard (D77.3)'
    ],
    libraryIds: ['sc-pent-min', 'rf-open-am'],
    masteryCheck: 'Day 77: Play two clean ascents/descents of box 1 with even tone at a steady click.',
  },
  78: {
    title: 'Box 1 Sequences — 3s and 4s',
    durationMin: 30,
    goals: [
      'Play notes in groups of 3 (focus: Box 1 Sequences)',
      'Play notes in groups of 4 — day 78 step 2',
      'Keep the click under sequences — day 78 step 3'
    ],
    theoryBite: 'Day 78 focus — Box 1 Sequences — 3s and 4s: Sequences teach your hands common melodic ‘rhythms of pitch’ used in real solos.',
    drills: [
      '123 234 345 pattern slow [Box 1 Sequences]',
      '1234 2345 pattern slow (D78.2)',
      'Resolve to root after each pass (D78.3)'
    ],
    libraryIds: ['sc-pent-min', 'sc-blues'],
    masteryCheck: 'Day 78: Complete one full sequence pass in 3s and one in 4s without derailing time.',
  },
  79: {
    title: 'Blues Scale — Add the Flat-5 Spice',
    durationMin: 30,
    goals: [
      'Find the blue note in box 1 (focus: Blues Scale)',
      'Use it as a short neighbor, not a home — day 79 step 2',
      'Bend or slide into chord tones — day 79 step 3'
    ],
    theoryBite: 'Day 79 focus — Blues Scale — Add the Flat-5 Spice: Blues scale = minor pent + b5. The spice note wants to resolve — tension and release in one finger.',
    drills: [
      'Spot b5 locations [Blues Scale]',
      'Lick: chord tone → b5 → chord tone (D79.2)',
      'Solo 1 minute max 20% blue notes (D79.3)'
    ],
    libraryIds: ['sc-blues', 'pr-12bar', 'ch-a7'],
    masteryCheck: 'Day 79: Play a 4-bar lick that uses the blue note and resolves cleanly.',
  },
  80: {
    title: 'Major Pentatonic — Bright Twin',
    durationMin: 30,
    goals: [
      'Play G major pentatonic shape (focus: Major Pentatonic)',
      'Compare to E minor pent (relative pair) — day 80 step 2',
      'Resolve to G for major, E for minor mood — day 80 step 3'
    ],
    theoryBite: 'Day 80 focus — Major Pentatonic — Bright Twin: Relative major/minor pentatonics share notes; the home note decides the story.',
    drills: [
      'G major pent up/down [Major Pentatonic]',
      'Same notes resolving to E (D80.2)',
      'Call dark, answer bright (D80.3)'
    ],
    libraryIds: ['sc-pent-maj', 'sc-pent-min', 'ch-g'],
    masteryCheck: 'Day 80: Play a major-pent phrase that clearly cadences to the major root.',
  },
  81: {
    title: 'Connect Boxes — Horizontal Walk',
    durationMin: 30,
    goals: [
      'Move from box 1 toward box 2 area (focus: Connect Boxes)',
      'Use a shared note as a hinge — day 81 step 2',
      'Avoid jump-cuts without a slide/step — day 81 step 3'
    ],
    theoryBite: 'Day 81 focus — Connect Boxes — Horizontal Walk: Pros connect positions. Hinge notes and slides beat teleporting up the neck.',
    drills: [
      'Find hinge note between positions [Connect Boxes]',
      'Ascending journey 2 octaves if possible (D81.2)',
      'Descend a new path (D81.3)'
    ],
    libraryIds: ['sc-pent-min', 'rf-caged-c'],
    masteryCheck: 'Day 81: Travel between two neck areas using a deliberate hinge note twice.',
  },
  82: {
    title: 'Chord Tones Inside the Box',
    durationMin: 30,
    goals: [
      'Mark root, b3, 5 inside minor pent (focus: Chord Tones Inside the Box)',
      'Land phrase endings on chord tones — day 82 step 2',
      'Play arpeggio outline then fill — day 82 step 3'
    ],
    theoryBite: 'Day 82 focus — Chord Tones Inside the Box: Chord tones are gravity. Scale filler notes decorate; chord tones tell harmony where you are.',
    drills: [
      'Pulse roots only [Chord Tones Inside the Box]',
      'Roots + 5ths (D82.2)',
      'Full box but end on chord tones (D82.3)'
    ],
    libraryIds: ['sc-pent-min', 'ch-am', 'ch-em'],
    masteryCheck: 'Day 82: Improvise 8 bars ending every phrase on a chord tone.',
  },
  83: {
    title: 'Major Scale — Seven-Note Map in G',
    durationMin: 30,
    goals: [
      'Play one-octave G major in position (focus: Major Scale)',
      'Sing degree numbers 1–7 if you can — day 83 step 2',
      'Harmonize with G–C–D open chords — day 83 step 3'
    ],
    theoryBite: 'Day 83 focus — Major Scale — Seven-Note Map in G: Major scale degrees explain why melodies feel finished (1,3,5) or yearn (2,4,6,7).',
    drills: [
      'One octave slow [Major Scale]',
      'Degrees on the way up (D83.2)',
      'Melody doodle using only 1 2 3 5 (D83.3)'
    ],
    libraryIds: ['sc-major', 'ch-g', 'pr-145'],
    masteryCheck: 'Day 83: Play one clean G major octave and a 4-bar melody that rests on G.',
  },
  84: {
    title: 'Natural Minor — Aeolian Mood',
    durationMin: 35,
    goals: [
      'Play A natural minor one octave (focus: Natural Minor)',
      'Contrast with A minor pent — day 84 step 2',
      'Note the 2 and b6 colors — day 84 step 3'
    ],
    theoryBite: 'Day 84 focus — Natural Minor — Aeolian Mood: Natural minor adds degrees pentatonics omit — more pathos, more stepwise melody options.',
    drills: [
      'A minor scale slow [Natural Minor]',
      'Remove to pent and compare (D84.2)',
      'Phrase using b6 on purpose once (D84.3)'
    ],
    libraryIds: ['sc-nat-min', 'sc-pent-min', 'ch-am'],
    masteryCheck: 'Day 84: Play A natural minor ascending/descending and one phrase that needs a non-pent note.',
  },
  85: {
    title: 'Dorian Color — Raised 6 Minor',
    durationMin: 30,
    goals: [
      'Play D Dorian essence (minor + raised 6) (focus: Dorian Color)',
      'Compare to natural minor mood — day 85 step 2',
      'Jam idea over Dm vamp feeling — day 85 step 3'
    ],
    theoryBite: 'Day 85 focus — Dorian Color — Raised 6 Minor: Dorian = natural minor with raised 6. Funk, Santana, modal jams — hopeful minor.',
    drills: [
      'Find raised 6 relative to Dm [Dorian Color]',
      'Side-by-side natural vs dorian lick (D85.2)',
      'Static Dm groove improv 1 minute (D85.3)'
    ],
    libraryIds: ['sc-dorian', 'ch-dm', 'sc-nat-min'],
    masteryCheck: 'Day 85: Play a lick that clearly shows dorian’s raised 6 against a minor chord.',
  },
  86: {
    title: 'Mixolydian — Dominant Major',
    durationMin: 30,
    goals: [
      'Play G mixolydian (major + b7) (focus: Mixolydian)',
      'Resolve to G7 chord color — day 86 step 2',
      'Rock jam vibe over G–F idea — day 86 step 3'
    ],
    theoryBite: 'Day 86 focus — Mixolydian — Dominant Major: Mixolydian is the jam-band/rock dominant map — major happiness with bluesy b7.',
    drills: [
      'G mixo one octave [Mixolydian]',
      'Target b7→root (D86.2)',
      'Two-chord vamp G to F if comfortable (D86.3)'
    ],
    libraryIds: ['sc-mixo', 'ch-g7', 'ch-g'],
    masteryCheck: 'Day 86: Improvise 8 bars in a mixolydian mood landing on G.',
  },
  87: {
    title: 'Phrygian Hint — Flat 2 Drama',
    durationMin: 30,
    goals: [
      'Find flat 2 above E or Am context (focus: Phrygian Hint)',
      'Use sparingly as spice — day 87 step 2',
      'Resolve to E or Am strongly — day 87 step 3'
    ],
    theoryBite: 'Day 87 focus — Phrygian Hint — Flat 2 Drama: Phrygian’s b2 is cinematic/Spanish. A little goes far — tension wants resolution.',
    drills: [
      'E phrygian fragment [Phrygian Hint]',
      'b2 neighbor licks (D87.2)',
      'Resolve phrases to E (D87.3)'
    ],
    libraryIds: ['sc-phrygian', 'pr-andalu', 'ch-e'],
    masteryCheck: 'Day 87: Play a short phrygian-flavored phrase that resolves cleanly.',
  },
  88: {
    title: 'Lydian Dream — Raised 4',
    durationMin: 30,
    goals: [
      'Find #4 in a major context (focus: Lydian Dream)',
      'Hold the dreamy dissonance briefly — day 88 step 2',
      'Resolve to 3 or 5 — day 88 step 3'
    ],
    theoryBite: 'Day 88 focus — Lydian Dream — Raised 4: Lydian’s raised 4 floats above major — filmic, floating, not ‘wrong’ if resolved with taste.',
    drills: [
      'C or F lydian fragment [Lydian Dream]',
      'Long tone on #4 (D88.2)',
      'Resolve downward (D88.3)'
    ],
    libraryIds: ['sc-lydian', 'ch-c', 'sc-major'],
    masteryCheck: 'Day 88: Demonstrate one lydian color tone and a satisfying resolution.',
  },
  89: {
    title: 'Pentatonic Call-and-Response',
    durationMin: 30,
    goals: [
      'Play a question phrase (rising) (focus: Pentatonic Call-and-Response)',
      'Answer lower or shorter — day 89 step 2',
      'Leave a full bar of rest between — day 89 step 3'
    ],
    theoryBite: 'Day 89 focus — Pentatonic Call-and-Response: Conversation beats continuous notes. Rests are musical confidence.',
    drills: [
      'Question 2 bars [Pentatonic Call-and-Response]',
      'Rest 1 bar (D89.2)',
      'Answer 2 bars — 4 cycles (D89.3)'
    ],
    libraryIds: ['sc-pent-min', 'sc-pent-maj'],
    masteryCheck: 'Day 89: Perform four clear call-response pairs with audible rests.',
  },
  90: {
    title: 'Targeting Triads — Solo Over G–C–D',
    durationMin: 30,
    goals: [
      'Know chord tones for G C D (focus: Targeting Triads)',
      'Change target notes when chords change — day 90 step 2',
      'Use pent filler between targets — day 90 step 3'
    ],
    theoryBite: 'Day 90 focus — Targeting Triads — Solo Over G–C–D: The pro sound over changes is targeting, not denser scales. Hit the new chord’s third/root.',
    drills: [
      'Roots only through progression [Targeting Triads]',
      'Roots+thirds (D90.2)',
      'Add pent connector notes (D90.3)'
    ],
    libraryIds: ['pr-145', 'sc-pent-maj', 'ch-g', 'ch-c', 'ch-d'],
    masteryCheck: 'Day 90: Solo one chorus of G–C–D hitting a chord tone on each chord’s downbeat.',
  },
  91: {
    title: 'Interval Jumps — 3rds and 4ths in the Box',
    durationMin: 35,
    goals: [
      'Practice skipping strings in-pattern (focus: Interval Jumps)',
      'Keep fretting hand calm on jumps — day 91 step 2',
      'Use jumps as motif starters — day 91 step 3'
    ],
    theoryBite: 'Day 91 focus — Interval Jumps — 3rds and 4ths in the Box: Intervals create melody contour. Stepwise is speech; leaps are exclamation points.',
    drills: [
      '3rd pattern through pent [Interval Jumps]',
      '4th leaps carefully (D91.2)',
      'Motif from one leap (D91.3)'
    ],
    libraryIds: ['sc-pent-min', 'sc-major'],
    masteryCheck: 'Day 91: Play a motif built from a leap, repeated with variation three times.',
  },
  92: {
    title: 'Harmonic Minor Tease — Leading Tone Bite',
    durationMin: 30,
    goals: [
      'Play A harmonic minor fragment (focus: Harmonic Minor Tease)',
      'Hear raised 7 pull to A — day 92 step 2',
      'Classical/metal spice in small doses — day 92 step 3'
    ],
    theoryBite: 'Day 92 focus — Harmonic Minor Tease — Leading Tone Bite: Harmonic minor’s raised 7 creates a strong leading tone — drama engine for minor keys.',
    drills: [
      'Fragment around leading tone [Harmonic Minor Tease]',
      'Resolve to A (D92.2)',
      'One exotic phrase max per 4 bars (D92.3)'
    ],
    libraryIds: ['sc-harm-min', 'ch-am', 'ch-e'],
    masteryCheck: 'Day 92: Show the leading-tone pull into A minor clearly twice.',
  },
  93: {
    title: 'Position Playing — Stay in a 5-Fret Cage',
    durationMin: 30,
    goals: [
      'Choose frets 5–8 area (focus: Position Playing)',
      'Find pent notes without open strings — day 93 step 2',
      'Build a riff that never leaves the cage — day 93 step 3'
    ],
    theoryBite: 'Day 93 focus — Position Playing — Stay in a 5-Fret Cage: Caged positions teach the neck as neighborhoods. Constraints breed creativity.',
    drills: [
      'Map roots in cage [Position Playing]',
      'Riff only inside cage 2 minutes (D93.2)',
      'Optional: shift cage up 2 frets and repeat idea (D93.3)'
    ],
    libraryIds: ['sc-pent-min', 'rf-caged-c'],
    masteryCheck: 'Day 93: Write/play an 8-bar riff that stays inside one 5-fret position.',
  },
  94: {
    title: 'Scale Detox — Three Notes Only Jam',
    durationMin: 30,
    goals: [
      'Pick any three neighboring notes (focus: Scale Detox)',
      'Make rhythm carry interest — day 94 step 2',
      'Ban additional pitches for 3 minutes — day 94 step 3'
    ],
    theoryBite: 'Day 94 focus — Scale Detox — Three Notes Only Jam: Limitation is a creativity tool used by great teachers. Rhythm and silence outrank note count.',
    drills: [
      'Choose 3 notes [Scale Detox]',
      'Groove them (D94.2)',
      'Add bends/slides only on those pitches (D94.3)'
    ],
    libraryIds: ['sc-pent-min', 'sc-blues'],
    masteryCheck: 'Day 94: Jam three full minutes using only three pitches with intentional rhythm.',
  },
  95: {
    title: 'Pent Story Draft — Call, Peak, Land',
    durationMin: 30,
    goals: [
      'Plan call, develop, peak, land (focus: Pent Story Draft)',
      'Use one blue note maximum section — day 95 step 2',
      'End on a long root — day 95 step 3'
    ],
    theoryBite: 'Day 95 focus — Pent Story Draft — Call, Peak, Land: A solo is a story arc. Capstone days prove you can shape time, not only run shapes.',
    drills: [
      'Sketch form on paper 1-2-3-4 sections [Pent Story Draft]',
      'Play full 16 bars (D95.2)',
      'Second take with more space (D95.3)'
    ],
    libraryIds: ['sc-pent-min', 'sc-blues', 'pr-12bar', 'ch-am'],
    masteryCheck: 'Day 95: Perform a 16-bar pentatonic story with a clear beginning, peak, and landing.',
  },
  96: {
    title: 'Weekly Scales Checkpoint 3',
    durationMin: 30,
    goals: [
      'Pent story 8 bars (focus: Weekly Scales Checkpoint 3)',
      'One modal or major scale color — day 96 step 2',
      'Resolve everything home — day 96 step 3'
    ],
    theoryBite: 'Day 96 focus — Weekly Scales Checkpoint 3: Checkpoints retrieve multiple skills in one performance — stronger memory than isolated drills.',
    drills: [
      'Warm pent [Weekly Scales Checkpoint 3]',
      'Color section (D96.2)',
      'Final landing take (D96.3)'
    ],
    libraryIds: ['sc-pent-min', 'sc-dorian', 'ch-e', 'rf-open-am', 'sg-this-old-man'],
    masteryCheck: 'Day 96: Perform a short multi-color take that still feels like one piece of music.',
  },
  97: {
    title: 'Neck Geography — Root Finder Drill 21',
    durationMin: 30,
    goals: [
      'Find today’s root on at least three strings (focus: Neck Geography)',
      'Pulse each root on beat 1 — day 97 step 2',
      'Connect roots with scale steps — day 97 step 3'
    ],
    theoryBite: 'Day 97 focus — Neck Geography — Root Finder Drill 21: Root awareness is the difference between wandering and soloing. Map first, decorate second.',
    drills: [
      'Root hunt low to high [Neck Geography]',
      'Root octave jumps (D97.2)',
      'Scale path between two roots (D97.3)'
    ],
    libraryIds: ['sc-blues', 'sc-phrygian', 'ch-a', 'rf-power', 'sg-happy-birthday'],
    masteryCheck: 'Day 97: Hit three different-string roots in time within one position neighborhood.',
  },
  98: {
    title: 'Phrase Gym — Copy → Vary → Own 22',
    durationMin: 35,
    goals: [
      'Learn a 4-note library motif (focus: Phrase Gym)',
      'Vary rhythm only — day 98 step 2',
      'Vary ending note only — day 98 step 3'
    ],
    theoryBite: 'Day 98 focus — Phrase Gym — Copy → Vary → Own 22: Imitation with constrained variation is how oral traditions and great players train vocabulary.',
    drills: [
      'Copy motif 4× [Phrase Gym]',
      'Rhythm variants 4× (D98.2)',
      'New ending 4× (D98.3)'
    ],
    libraryIds: ['sc-dorian', 'sc-lydian', 'ch-f', 'rf-blues-sh', 'sg-minuet-in-g-bach-public-domain'],
    masteryCheck: 'Day 98: Show the motif, one rhythm variant, and one ending variant in a single take.',
  },
  99: {
    title: 'Metronome Subdivision — Scale Eighths 23',
    durationMin: 30,
    goals: [
      'Align scale notes to eighths (focus: Metronome Subdivision)',
      'Then only quarters if rushing — day 99 step 2',
      'Record 20 seconds for honesty — day 99 step 3'
    ],
    theoryBite: 'Day 99 focus — Metronome Subdivision — Scale Eighths 23: Subdivisions expose whether fingers or time is leading. Time should lead.',
    drills: [
      'Eighths with click [Metronome Subdivision]',
      'Downshift if messy (D99.2)',
      'Listen back once (D99.3)'
    ],
    libraryIds: ['sc-phrygian', 'sc-mixo', 'ch-bm', 'rf-spider', 'sg-f-r-elise-motif-beethoven-public'],
    masteryCheck: 'Day 99: Play one octave in steady eighths that would pass a kind click test.',
  },
  100: {
    title: 'Mode Mood Board — A/B Day 24',
    durationMin: 30,
    goals: [
      'Contrast sc-lydian against sc-locrian colors (focus: Mode Mood Board)',
      'Use the same rhythm skeleton — day 100 step 2',
      'Name the mood in one adjective each — day 100 step 3'
    ],
    theoryBite: 'Day 100 focus — Mode Mood Board — A/B Day 24: Modes are moods with rules. A/B listening teaches faster than definitions alone.',
    drills: [
      'Rhythm skeleton on open strings [Mode Mood Board]',
      'Apply mode A (D100.2)',
      'Apply mode B same rhythm (D100.3)'
    ],
    libraryIds: ['sc-lydian', 'sc-locrian', 'ch-c7', 'rf-caged-c', 'sg-canon-in-d-pachelbel-theme-publi'],
    masteryCheck: 'Day 100: Play the same rhythm in two modal colors and name each mood.',
  },
  101: {
    title: 'Scale → Riff Extraction 25',
    durationMin: 30,
    goals: [
      'Improv 1 minute (focus: Scale → Riff Extraction 25)',
      'Circle one accidental cool bar — day 101 step 2',
      'Repeat that bar until it is a riff — day 101 step 3'
    ],
    theoryBite: 'Day 101 focus — Scale → Riff Extraction 25: Riffs are frozen luck. Capture and repeat — composition skill for lead players.',
    drills: [
      'Improv [Scale → Riff Extraction 25]',
      'Extract (D101.2)',
      'Riff loop 8× (D101.3)'
    ],
    libraryIds: ['sc-mixo', 'sc-whole', 'ch-g7', 'rf-open-g-roll-study', 'sg-brahms-lullaby'],
    masteryCheck: 'Day 101: Leave with a 1- or 2-bar riff you can repeat from memory five times.',
  },
  102: {
    title: 'Chord-Scale Match Briefing 26',
    durationMin: 30,
    goals: [
      'Play ch-d7 as harmony home (focus: Chord-Scale Match Briefing 26)',
      'Choose scale notes that agree — day 102 step 2',
      'Avoid clashing long tones on purpose later — day 102 step 3'
    ],
    theoryBite: 'Day 102 focus — Chord-Scale Match Briefing 26: Matching scale to chord is applied theory. Long notes must agree; passing notes may color.',
    drills: [
      'Chord vamp [Chord-Scale Match Briefing 26]',
      'Long tones test (D102.2)',
      'Passing tone runs (D102.3)'
    ],
    libraryIds: ['sc-locrian', 'sc-hwh', 'ch-d7', 'rf-em-pentatonic-box-study', 'sg-blue-danube-motif-strauss-public'],
    masteryCheck: 'Day 102: Hold three long tones over the chord that all sound intentional.',
  },
  103: {
    title: 'Weekly Scales Checkpoint 4',
    durationMin: 30,
    goals: [
      'Pent story 8 bars (focus: Weekly Scales Checkpoint 4)',
      'One modal or major scale color — day 103 step 2',
      'Resolve everything home — day 103 step 3'
    ],
    theoryBite: 'Day 103 focus — Weekly Scales Checkpoint 4: Checkpoints retrieve multiple skills in one performance — stronger memory than isolated drills.',
    drills: [
      'Warm pent [Weekly Scales Checkpoint 4]',
      'Color section (D103.2)',
      'Final landing take (D103.3)'
    ],
    libraryIds: ['sc-whole', 'sc-whh', 'ch-a7', 'rf-d-folk-pattern-study', 'sg-william-tell-motif-rossini-publi'],
    masteryCheck: 'Day 103: Perform a short multi-color take that still feels like one piece of music.',
  },
  104: {
    title: 'Neck Geography — Root Finder Drill 28',
    durationMin: 30,
    goals: [
      'Find today’s root on at least three strings (focus: Neck Geography)',
      'Pulse each root on beat 1 — day 104 step 2',
      'Connect roots with scale steps — day 104 step 3'
    ],
    theoryBite: 'Day 104 focus — Neck Geography — Root Finder Drill 28: Root awareness is the difference between wandering and soloing. Map first, decorate second.',
    drills: [
      'Root hunt low to high [Neck Geography]',
      'Root octave jumps (D104.2)',
      'Scale path between two roots (D104.3)'
    ],
    libraryIds: ['sc-hwh', 'sc-major', 'ch-e7', 'rf-a-blues-turnaround-study', 'sg-the-entertainer-motif-joplin-pub'],
    masteryCheck: 'Day 104: Hit three different-string roots in time within one position neighborhood.',
  },
  105: {
    title: 'Phrase Gym — Copy → Vary → Own 29',
    durationMin: 35,
    goals: [
      'Learn a 4-note library motif (focus: Phrase Gym)',
      'Vary rhythm only — day 105 step 2',
      'Vary ending note only — day 105 step 3'
    ],
    theoryBite: 'Day 105 focus — Phrase Gym — Copy → Vary → Own 29: Imitation with constrained variation is how oral traditions and great players train vocabulary.',
    drills: [
      'Copy motif 4× [Phrase Gym]',
      'Rhythm variants 4× (D105.2)',
      'New ending 4× (D105.3)'
    ],
    libraryIds: ['sc-whh', 'sc-nat-min', 'ch-dm', 'rf-g-caged-run-study', 'sg-shenandoah'],
    masteryCheck: 'Day 105: Show the motif, one rhythm variant, and one ending variant in a single take.',
  },
  106: {
    title: 'Metronome Subdivision — Scale Eighths 30',
    durationMin: 30,
    goals: [
      'Align scale notes to eighths (focus: Metronome Subdivision)',
      'Then only quarters if rushing — day 106 step 2',
      'Record 20 seconds for honesty — day 106 step 3'
    ],
    theoryBite: 'Day 106 focus — Metronome Subdivision — Scale Eighths 30: Subdivisions expose whether fingers or time is leading. Time should lead.',
    drills: [
      'Eighths with click [Metronome Subdivision]',
      'Downshift if messy (D106.2)',
      'Listen back once (D106.3)'
    ],
    libraryIds: ['sc-major', 'sc-harm-min', 'ch-c', 'rf-c-bass-walk-study', 'sg-red-river-valley'],
    masteryCheck: 'Day 106: Play one octave in steady eighths that would pass a kind click test.',
  },
  107: {
    title: 'Mode Mood Board — A/B Day 31',
    durationMin: 30,
    goals: [
      'Contrast sc-nat-min against sc-mel-min colors (focus: Mode Mood Board)',
      'Use the same rhythm skeleton — day 107 step 2',
      'Name the mood in one adjective each — day 107 step 3'
    ],
    theoryBite: 'Day 107 focus — Mode Mood Board — A/B Day 31: Modes are moods with rules. A/B listening teaches faster than definitions alone.',
    drills: [
      'Rhythm skeleton on open strings [Mode Mood Board]',
      'Apply mode A (D107.2)',
      'Apply mode B same rhythm (D107.3)'
    ],
    libraryIds: ['sc-nat-min', 'sc-mel-min', 'ch-g', 'rf-spanish-e-phrygian-study', 'sg-home-on-the-range'],
    masteryCheck: 'Day 107: Play the same rhythm in two modal colors and name each mood.',
  },
  108: {
    title: 'Scale → Riff Extraction 32',
    durationMin: 30,
    goals: [
      'Improv 1 minute (focus: Scale → Riff Extraction 32)',
      'Circle one accidental cool bar — day 108 step 2',
      'Repeat that bar until it is a riff — day 108 step 3'
    ],
    theoryBite: 'Day 108 focus — Scale → Riff Extraction 32: Riffs are frozen luck. Capture and repeat — composition skill for lead players.',
    drills: [
      'Improv [Scale → Riff Extraction 32]',
      'Extract (D108.2)',
      'Riff loop 8× (D108.3)'
    ],
    libraryIds: ['sc-harm-min', 'sc-pent-maj', 'ch-d', 'rf-funk-chicka-study', 'sg-turkey-in-the-straw'],
    masteryCheck: 'Day 108: Leave with a 1- or 2-bar riff you can repeat from memory five times.',
  },
  109: {
    title: 'Chord-Scale Match Briefing 33',
    durationMin: 30,
    goals: [
      'Play ch-em as harmony home (focus: Chord-Scale Match Briefing 33)',
      'Choose scale notes that agree — day 109 step 2',
      'Avoid clashing long tones on purpose later — day 109 step 3'
    ],
    theoryBite: 'Day 109 focus — Chord-Scale Match Briefing 33: Matching scale to chord is applied theory. Long notes must agree; passing notes may color.',
    drills: [
      'Chord vamp [Chord-Scale Match Briefing 33]',
      'Long tones test (D109.2)',
      'Passing tone runs (D109.3)'
    ],
    libraryIds: ['sc-mel-min', 'sc-pent-min', 'ch-em', 'rf-palm-mute-chug-study', 'sg-arkansas-traveler'],
    masteryCheck: 'Day 109: Hold three long tones over the chord that all sound intentional.',
  },
  110: {
    title: 'Weekly Scales Checkpoint 5',
    durationMin: 30,
    goals: [
      'Pent story 8 bars (focus: Weekly Scales Checkpoint 5)',
      'One modal or major scale color — day 110 step 2',
      'Resolve everything home — day 110 step 3'
    ],
    theoryBite: 'Day 110 focus — Weekly Scales Checkpoint 5: Checkpoints retrieve multiple skills in one performance — stronger memory than isolated drills.',
    drills: [
      'Warm pent [Weekly Scales Checkpoint 5]',
      'Color section (D110.2)',
      'Final landing take (D110.3)'
    ],
    libraryIds: ['sc-pent-maj', 'sc-blues', 'ch-am', 'rf-jazz-chromatic-approach-study', 'sg-sailor-s-hornpipe'],
    masteryCheck: 'Day 110: Perform a short multi-color take that still feels like one piece of music.',
  },
  111: {
    title: 'Neck Geography — Root Finder Drill 35',
    durationMin: 30,
    goals: [
      'Find today’s root on at least three strings (focus: Neck Geography)',
      'Pulse each root on beat 1 — day 111 step 2',
      'Connect roots with scale steps — day 111 step 3'
    ],
    theoryBite: 'Day 111 focus — Neck Geography — Root Finder Drill 35: Root awareness is the difference between wandering and soloing. Map first, decorate second.',
    drills: [
      'Root hunt low to high [Neck Geography]',
      'Root octave jumps (D111.2)',
      'Scale path between two roots (D111.3)'
    ],
    libraryIds: ['sc-pent-min', 'sc-dorian', 'ch-e', 'rf-am-arpeggio-cascade', 'sg-drunken-sailor'],
    masteryCheck: 'Day 111: Hit three different-string roots in time within one position neighborhood.',
  },
  112: {
    title: 'Phrase Gym — Copy → Vary → Own 36',
    durationMin: 35,
    goals: [
      'Learn a 4-note library motif (focus: Phrase Gym)',
      'Vary rhythm only — day 112 step 2',
      'Vary ending note only — day 112 step 3'
    ],
    theoryBite: 'Day 112 focus — Phrase Gym — Copy → Vary → Own 36: Imitation with constrained variation is how oral traditions and great players train vocabulary.',
    drills: [
      'Copy motif 4× [Phrase Gym]',
      'Rhythm variants 4× (D112.2)',
      'New ending 4× (D112.3)'
    ],
    libraryIds: ['sc-blues', 'sc-phrygian', 'ch-a', 'rf-drop-d-power-study', 'sg-molly-malone'],
    masteryCheck: 'Day 112: Show the motif, one rhythm variant, and one ending variant in a single take.',
  },
  113: {
    title: 'Metronome Subdivision — Scale Eighths 37',
    durationMin: 30,
    goals: [
      'Align scale notes to eighths (focus: Metronome Subdivision)',
      'Then only quarters if rushing — day 113 step 2',
      'Record 20 seconds for honesty — day 113 step 3'
    ],
    theoryBite: 'Day 113 focus — Metronome Subdivision — Scale Eighths 37: Subdivisions expose whether fingers or time is leading. Time should lead.',
    drills: [
      'Eighths with click [Metronome Subdivision]',
      'Downshift if messy (D113.2)',
      'Listen back once (D113.3)'
    ],
    libraryIds: ['sc-dorian', 'sc-lydian', 'ch-f', 'rf-travis-pick-sketch-in-c', 'sg-the-parting-glass'],
    masteryCheck: 'Day 113: Play one octave in steady eighths that would pass a kind click test.',
  },
  114: {
    title: 'Mode Mood Board — A/B Day 38',
    durationMin: 30,
    goals: [
      'Contrast sc-phrygian against sc-mixo colors (focus: Mode Mood Board)',
      'Use the same rhythm skeleton — day 114 step 2',
      'Name the mood in one adjective each — day 114 step 3'
    ],
    theoryBite: 'Day 114 focus — Mode Mood Board — A/B Day 38: Modes are moods with rules. A/B listening teaches faster than definitions alone.',
    drills: [
      'Rhythm skeleton on open strings [Mode Mood Board]',
      'Apply mode A (D114.2)',
      'Apply mode B same rhythm (D114.3)'
    ],
    libraryIds: ['sc-phrygian', 'sc-mixo', 'ch-bm', 'rf-natural-harmonics-study', 'sg-simple-gifts'],
    masteryCheck: 'Day 114: Play the same rhythm in two modal colors and name each mood.',
  },
  115: {
    title: 'Scale → Riff Extraction 39',
    durationMin: 30,
    goals: [
      'Improv 1 minute (focus: Scale → Riff Extraction 39)',
      'Circle one accidental cool bar — day 115 step 2',
      'Repeat that bar until it is a riff — day 115 step 3'
    ],
    theoryBite: 'Day 115 focus — Scale → Riff Extraction 39: Riffs are frozen luck. Capture and repeat — composition skill for lead players.',
    drills: [
      'Improv [Scale → Riff Extraction 39]',
      'Extract (D115.2)',
      'Riff loop 8× (D115.3)'
    ],
    libraryIds: ['sc-lydian', 'sc-locrian', 'ch-c7', 'rf-minor-slide-lick-study', 'sg-wayfaring-stranger'],
    masteryCheck: 'Day 115: Leave with a 1- or 2-bar riff you can repeat from memory five times.',
  },
  116: {
    title: 'Chord-Scale Match Briefing 40',
    durationMin: 30,
    goals: [
      'Play ch-g7 as harmony home (focus: Chord-Scale Match Briefing 40)',
      'Choose scale notes that agree — day 116 step 2',
      'Avoid clashing long tones on purpose later — day 116 step 3'
    ],
    theoryBite: 'Day 116 focus — Chord-Scale Match Briefing 40: Matching scale to chord is applied theory. Long notes must agree; passing notes may color.',
    drills: [
      'Chord vamp [Chord-Scale Match Briefing 40]',
      'Long tones test (D116.2)',
      'Passing tone runs (D116.3)'
    ],
    libraryIds: ['sc-mixo', 'sc-whole', 'ch-g7', 'rf-open-am', 'sg-barbara-allen'],
    masteryCheck: 'Day 116: Hold three long tones over the chord that all sound intentional.',
  },
  117: {
    title: 'Weekly Scales Checkpoint 6',
    durationMin: 30,
    goals: [
      'Pent story 8 bars (focus: Weekly Scales Checkpoint 6)',
      'One modal or major scale color — day 117 step 2',
      'Resolve everything home — day 117 step 3'
    ],
    theoryBite: 'Day 117 focus — Weekly Scales Checkpoint 6: Checkpoints retrieve multiple skills in one performance — stronger memory than isolated drills.',
    drills: [
      'Warm pent [Weekly Scales Checkpoint 6]',
      'Color section (D117.2)',
      'Final landing take (D117.3)'
    ],
    libraryIds: ['sc-locrian', 'sc-hwh', 'ch-d7', 'rf-power', 'sg-down-by-the-riverside'],
    masteryCheck: 'Day 117: Perform a short multi-color take that still feels like one piece of music.',
  },
  118: {
    title: 'Neck Geography — Root Finder Drill 42',
    durationMin: 30,
    goals: [
      'Find today’s root on at least three strings (focus: Neck Geography)',
      'Pulse each root on beat 1 — day 118 step 2',
      'Connect roots with scale steps — day 118 step 3'
    ],
    theoryBite: 'Day 118 focus — Neck Geography — Root Finder Drill 42: Root awareness is the difference between wandering and soloing. Map first, decorate second.',
    drills: [
      'Root hunt low to high [Neck Geography]',
      'Root octave jumps (D118.2)',
      'Scale path between two roots (D118.3)'
    ],
    libraryIds: ['sc-whole', 'sc-whh', 'ch-a7', 'rf-blues-sh', 'sg-skip-to-my-lou'],
    masteryCheck: 'Day 118: Hit three different-string roots in time within one position neighborhood.',
  },
  119: {
    title: 'Phrase Gym — Copy → Vary → Own 43',
    durationMin: 35,
    goals: [
      'Learn a 4-note library motif (focus: Phrase Gym)',
      'Vary rhythm only — day 119 step 2',
      'Vary ending note only — day 119 step 3'
    ],
    theoryBite: 'Day 119 focus — Phrase Gym — Copy → Vary → Own 43: Imitation with constrained variation is how oral traditions and great players train vocabulary.',
    drills: [
      'Copy motif 4× [Phrase Gym]',
      'Rhythm variants 4× (D119.2)',
      'New ending 4× (D119.3)'
    ],
    libraryIds: ['sc-hwh', 'sc-major', 'ch-e7', 'rf-spider', 'sg-i-ve-been-working-on-the-railroa'],
    masteryCheck: 'Day 119: Show the motif, one rhythm variant, and one ending variant in a single take.',
  },
  120: {
    title: 'Scales Capstone — 16-Bar Pent Story',
    durationMin: 30,
    goals: [
      'Align scale notes to eighths (focus: Scales Capstone)',
      'Then only quarters if rushing — day 120 step 2',
      'Record 20 seconds for honesty — day 120 step 3'
    ],
    theoryBite: 'Day 120 focus — Scales Capstone — 16-Bar Pent Story: Subdivisions expose whether fingers or time is leading. Time should lead.',
    drills: [
      'Eighths with click [Scales Capstone]',
      'Downshift if messy (D120.2)',
      'Listen back once (D120.3)'
    ],
    libraryIds: ['sc-whh', 'sc-nat-min', 'ch-dm', 'rf-caged-c', 'sg-she-ll-be-coming-round-the-mount'],
    masteryCheck: 'Day 120: Play one octave in steady eighths that would pass a kind click test.',
  },
  121: {
    title: 'Rhythm Phase Open — Pocket Is the Skill',
    durationMin: 30,
    goals: [
      'Foot locks quarters before hands fancy up (focus: Rhythm Phase Open)',
      'Muted strum becomes a drum kit — day 121 step 2',
      'Speed is optional; agreement with pulse is not — day 121 step 3'
    ],
    theoryBite: 'Day 121 focus — Rhythm Phase Open — Pocket Is the Skill: Groove research and ensemble practice agree: tight time > ornamental complexity for listener joy.',
    drills: [
      'Foot quarters 60s [Rhythm Phase Open]',
      'Muted D-DU 60s (D121.2)',
      'Add one chord only when pocket holds (D121.3)'
    ],
    libraryIds: ['pr-145', 'ch-g'],
    masteryCheck: 'Day 121: Hold a muted groove 90 seconds that a friend could nod along to.',
  },
  122: {
    title: 'Subdivision Clinic — 1 e & a',
    durationMin: 30,
    goals: [
      'Count 1 e & a aloud (focus: Subdivision Clinic)',
      'Strum only on assigned syllables — day 122 step 2',
      'Switch patterns every 4 bars — day 122 step 3'
    ],
    theoryBite: 'Day 122 focus — Subdivision Clinic — 1 e & a: Named subdivisions make rhythm teachable. If you can count it, you can place it.',
    drills: [
      'Count only [Subdivision Clinic]',
      'Down on 1 and 3 (D122.2)',
      'Add &s (D122.3)',
      'Try e and a lightly (D122.4)'
    ],
    libraryIds: ['rf-power', 'ch-e'],
    masteryCheck: 'Day 122: Play 8 bars while counting subdivisions aloud accurately.',
  },
  123: {
    title: 'Syncopation Intro — Accent the Offbeat',
    durationMin: 30,
    goals: [
      'Accent & of 2 and & of 4 (focus: Syncopation Intro)',
      'Keep downbeats soft — day 123 step 2',
      'Apply to a two-chord vamp — day 123 step 3'
    ],
    theoryBite: 'Day 123 focus — Syncopation Intro — Accent the Offbeat: Syncopation surprises by emphasizing weak beats. Soft downbeats make offbeats speak.',
    drills: [
      'Mute pattern accents [Syncopation Intro]',
      'Chord pattern accents (D123.2)',
      'Overdo then taste-reduce (D123.3)'
    ],
    libraryIds: ['ch-am', 'ch-g', 'pr-andalu'],
    masteryCheck: 'Day 123: Play a vamp with clearly audible offbeat accents for 8 bars.',
  },
  124: {
    title: 'Shuffle vs Straight — Feel Toggle',
    durationMin: 30,
    goals: [
      'Play eighths straight (focus: Shuffle vs Straight)',
      'Play long-short shuffle — day 124 step 2',
      'Keep chord progression identical — day 124 step 3'
    ],
    theoryBite: 'Day 124 focus — Shuffle vs Straight — Feel Toggle: Feel is a right-hand decision. Same chart, new genre — critical rhythm guitar skill.',
    drills: [
      'Straight G–C–D [Shuffle vs Straight]',
      'Shuffle G–C–D (D124.2)',
      'A/B take recording (D124.3)'
    ],
    libraryIds: ['pr-145', 'pr-12bar', 'ch-g'],
    masteryCheck: 'Day 124: Demonstrate the same progression in straight and shuffle feels.',
  },
  125: {
    title: 'Palm Mute Engine — Chug Control',
    durationMin: 30,
    goals: [
      'Mute near bridge for chunk (focus: Palm Mute Engine)',
      'Release mute for open rings on purpose — day 125 step 2',
      'Write a mute/ring pattern — day 125 step 3'
    ],
    theoryBite: 'Day 125 focus — Palm Mute Engine — Chug Control: Palm mute dynamics are rhythmic articulation. Control the gate like a producer.',
    drills: [
      'All mute eighths [Palm Mute Engine]',
      'Mute mute ring ring (D125.2)',
      'Apply to power chords (D125.3)'
    ],
    libraryIds: ['rf-power', 'ch-e', 'ch-a'],
    masteryCheck: 'Day 125: Perform an 8-bar mute/ring arrangement that is repeatable.',
  },
  126: {
    title: 'Rest as a Weapon — Play Less',
    durationMin: 35,
    goals: [
      'Leave beat 4 empty every bar (focus: Rest as a Weapon)',
      'Leave full bars empty on purpose — day 126 step 2',
      'Notice tension created by space — day 126 step 3'
    ],
    theoryBite: 'Day 126 focus — Rest as a Weapon — Play Less: Silence structures music. Beginners overplay; taste often means deleting notes.',
    drills: [
      'Pattern with holes [Rest as a Weapon]',
      'Stop-time hits on 1 (D126.2)',
      'Band-in-a-box imaginary fill space (D126.3)'
    ],
    libraryIds: ['ch-em', 'ch-g', 'pr-145'],
    masteryCheck: 'Day 126: Play 8 bars where at least one beat per bar is intentional silence.',
  },
  127: {
    title: 'Accent Maps — Compose a Strum Chart',
    durationMin: 30,
    goals: [
      'Write accents on paper for 4 bars (focus: Accent Maps)',
      'Perform exactly the map — day 127 step 2',
      'Swap maps with a second idea — day 127 step 3'
    ],
    theoryBite: 'Day 127 focus — Accent Maps — Compose a Strum Chart: Externalizing rhythm to paper reduces working-memory load — then hands learn the plan.',
    drills: [
      'Notate D and U with accents [Accent Maps]',
      'Perform (D127.2)',
      'New map (D127.3)'
    ],
    libraryIds: ['ch-c', 'ch-g', 'ch-am'],
    masteryCheck: 'Day 127: Perform a 4-bar accent map twice identically.',
  },
  128: {
    title: 'Triplet Feel — 1 trip-let',
    durationMin: 30,
    goals: [
      'Count triplets (focus: Triplet Feel)',
      'Strum triplet downs softly — day 128 step 2',
      'Place a melody note on triplet starts — day 128 step 3'
    ],
    theoryBite: 'Day 128 focus — Triplet Feel — 1 trip-let: Triplets bridge straight and swing worlds. Counting prevents accidental rushing into them.',
    drills: [
      'Count 1 trip-let [Triplet Feel]',
      'Muted triplet groove (D128.2)',
      'Chord hits on 1 of each triplet (D128.3)'
    ],
    libraryIds: ['ch-a7', 'pr-12bar'],
    masteryCheck: 'Day 128: Play 4 bars of controlled triplets with voice counting.',
  },
  129: {
    title: 'Stop-Time Blues — Hits With the Imaginary Band',
    durationMin: 30,
    goals: [
      'Play hits on bar 1 of each 4 (focus: Stop-Time Blues)',
      'Leave space for ‘solos’ — day 129 step 2',
      'Re-enter tightly — day 129 step 3'
    ],
    theoryBite: 'Day 129 focus — Stop-Time Blues — Hits With the Imaginary Band: Stop-time teaches ensemble awareness even alone — enterances are rhythm skills.',
    drills: [
      '12-bar with stop hits [Stop-Time Blues]',
      'Fill space by foot only (D129.2)',
      'Re-enter on the one (D129.3)'
    ],
    libraryIds: ['pr-12bar', 'ch-a7', 'ch-d7', 'ch-e7'],
    masteryCheck: 'Day 129: Navigate one 12-bar with clear stop-time hits and confident re-entries.',
  },
  130: {
    title: 'Funk Chicka — 16th Speckles',
    durationMin: 30,
    goals: [
      'Loose wrist 16th ghost motion (focus: Funk Chicka)',
      'Fret-hand chuck on selected 16ths — day 130 step 2',
      'Keep it quiet and hypnotic — day 130 step 3'
    ],
    theoryBite: 'Day 130 focus — Funk Chicka — 16th Speckles: Funk guitar is often more mute than ring. The ghost motion keeps time alive.',
    drills: [
      'Air 16ths [Funk Chicka]',
      'Chicka on single chord (D130.2)',
      'Two-chord funk loop (D130.3)'
    ],
    libraryIds: ['ch-e7', 'ch-a7', 'rf-power'],
    masteryCheck: 'Day 130: Hold a funk chicka groove 45 seconds without tensing shoulders.',
  },
  131: {
    title: 'Ballad Space — Slow Harmonic Rhythm',
    durationMin: 30,
    goals: [
      'Two bars per chord minimum (focus: Ballad Space)',
      'Add ornaments only on bar 2 — day 131 step 2',
      'Breathe with the barline — day 131 step 3'
    ],
    theoryBite: 'Day 131 focus — Ballad Space — Slow Harmonic Rhythm: Harmonic rhythm (how often chords change) shapes emotion. Slow changes need confident sustain.',
    drills: [
      'C–Am–F–G at 2 bars each [Ballad Space]',
      'Ornament last beat before change (D131.2)',
      'No early jumps (D131.3)'
    ],
    libraryIds: ['pr-1645', 'ch-c', 'ch-am', 'ch-f', 'ch-g'],
    masteryCheck: 'Day 131: Play a ballad loop with patient two-bar harmonic rhythm.',
  },
  132: {
    title: 'Push Chords — Anticipate the Downbeat',
    durationMin: 30,
    goals: [
      'Play a chord on the & of 4 (focus: Push Chords)',
      'Sustain into the next bar — day 132 step 2',
      'Use sparingly for lift — day 132 step 3'
    ],
    theoryBite: 'Day 132 focus — Push Chords — Anticipate the Downbeat: Pushes create forward motion used in pop/country. Anticipation is a rhythmic choice, not a mistake.',
    drills: [
      'Normal changes [Push Chords]',
      'Push into chorus chord (D132.2)',
      'A/B feel (D132.3)'
    ],
    libraryIds: ['pr-145', 'ch-g', 'ch-c'],
    masteryCheck: 'Day 132: Execute four clean push-into-downbeat chord entries.',
  },
  133: {
    title: 'Polyrhythm Taste — 3 Against 2 Feel',
    durationMin: 35,
    goals: [
      'Foot in 2 (focus: Polyrhythm Taste)',
      'Hand accents in 3 — day 133 step 2',
      'Smile when it clicks briefly — day 133 step 3'
    ],
    theoryBite: 'Day 133 focus — Polyrhythm Taste — 3 Against 2 Feel: Light polyrhythm training boosts independence. Keep doses small to avoid frustration spirals.',
    drills: [
      'Foot quarters [Polyrhythm Taste]',
      'Accent every 3 strums (D133.2)',
      '10 successful cycles > perfection (D133.3)'
    ],
    libraryIds: ['ch-em', 'sc-pent-min'],
    masteryCheck: 'Day 133: Achieve ten cycles where 3-against-2 accents are intentional.',
  },
  134: {
    title: 'Texture Arrangement Lab — 32-Bar Map',
    durationMin: 30,
    goals: [
      'Arrange 32 bars with ≥3 textures (focus: Texture Arrangement Lab)',
      'Include planned rests — day 134 step 2',
      'End cold or with ring — choose — day 134 step 3'
    ],
    theoryBite: 'Day 134 focus — Texture Arrangement Lab — 32-Bar Map: Longer forms train stamina and memory of plan — essential for real songs.',
    drills: [
      'Write texture map [Texture Arrangement Lab]',
      'Full run (D134.2)',
      'Fix one weak bar only (D134.3)'
    ],
    libraryIds: ['pr-145', 'pr-1645', 'ch-g', 'ch-c', 'ch-am'],
    masteryCheck: 'Day 134: Perform a 32-bar rhythmic arrangement with three textures and clear architecture.',
  },
  135: {
    title: 'Click Trust — Play Behind/On/Ahead 14',
    durationMin: 30,
    goals: [
      'Play slightly behind the click (focus: Click Trust)',
      'Play on top of the click — day 135 step 2',
      'Avoid rushing fills — day 135 step 3'
    ],
    theoryBite: 'Day 135 focus — Click Trust — Play Behind/On/Ahead 14: Time feel is placeable. Studio players choose behind/on/ahead intentionally.',
    drills: [
      'Behind take [Click Trust]',
      'On-top take (D135.2)',
      'Compare (D135.3)'
    ],
    libraryIds: ['pr-andalu', 'ch-dm', 'rf-jazz-chromatic-approach-study', 'sg-auld-lang-syne'],
    masteryCheck: 'Day 135: Demonstrate on-the-click and behind-the-click feels on the same pattern.',
  },
  136: {
    title: 'Dynamic Waves — Crescendo Strum 15',
    durationMin: 30,
    goals: [
      '4 bars soft to loud (focus: Dynamic Waves)',
      '4 bars loud to soft — day 136 step 2',
      'Keep tempo flat while volume moves — day 136 step 3'
    ],
    theoryBite: 'Day 136 focus — Dynamic Waves — Crescendo Strum 15: Separating dynamics from tempo is elite right-hand control.',
    drills: [
      'Crescendo [Dynamic Waves]',
      'Decrescendo (D136.2)',
      'Flat tempo check (D136.3)'
    ],
    libraryIds: ['pr-145', 'ch-c', 'rf-am-arpeggio-cascade', 'sg-swing-low-sweet-chariot'],
    masteryCheck: 'Day 136: Perform an 8-bar dynamic wave without speeding up.',
  },
  137: {
    title: 'Odd Accent — 5/4 Taste 16',
    durationMin: 30,
    goals: [
      'Count 1 2 3 4 5 (focus: Odd Accent)',
      'Accent 1 and 4 — day 137 step 2',
      'Return to 4/4 relieved — day 137 step 3'
    ],
    theoryBite: 'Day 137 focus — Odd Accent — 5/4 Taste 16: Small odd-meter tastes expand rhythmic confidence without derailing the year’s 4/4 core.',
    drills: [
      'Count [Odd Accent]',
      'Muted 5/4 (D137.2)',
      'Song back in 4 (D137.3)'
    ],
    libraryIds: ['pr-1645', 'ch-g', 'rf-drop-d-power-study', 'sg-mary-had-a-little-lamb'],
    masteryCheck: 'Day 137: Play 4 bars of intentional 5/4 accents, then settle into 4/4.',
  },
  138: {
    title: 'Comp Patterns — Two Rights, One Left 17',
    durationMin: 30,
    goals: [
      'Right hand pattern A (focus: Comp Patterns)',
      'Right hand pattern B — day 138 step 2',
      'Left hand chord change on barlines only — day 138 step 3'
    ],
    theoryBite: 'Day 138 focus — Comp Patterns — Two Rights, One Left 17: Decoupling hands reduces freeze at changes — a core easy-teaching tactic.',
    drills: [
      'A only [Comp Patterns]',
      'B only (D138.2)',
      'A/B with changes (D138.3)'
    ],
    libraryIds: ['pr-6251', 'ch-d', 'rf-travis-pick-sketch-in-c', 'sg-row-row-row-your-boat'],
    masteryCheck: 'Day 138: Change chords on barlines while right hand keeps a unbroken pattern.',
  },
  139: {
    title: 'Genre Day — Country Boom-Chuck Deepening 18',
    durationMin: 30,
    goals: [
      'Bass/chord split clarity (focus: Genre Day)',
      'Walk bass if ready between chords — day 139 step 2',
      'Keep it friendly, not frantic — day 139 step 3'
    ],
    theoryBite: 'Day 139 focus — Genre Day — Country Boom-Chuck Deepening 18: Style days encode patterns into long-term memory via distinctive hooks.',
    drills: [
      'Boom-chuck [Genre Day]',
      'Add walk (D139.2)',
      'Song loop (D139.3)'
    ],
    libraryIds: ['pr-12bar', 'ch-em', 'rf-natural-harmonics-study', 'sg-fr-re-jacques'],
    masteryCheck: 'Day 139: Play 16 bars of convincing boom-chuck time.',
  },
  140: {
    title: 'Genre Day — Rock Eighth Drive 19',
    durationMin: 35,
    goals: [
      'Steady eighth downs (focus: Genre Day)',
      'Snare-like accents on 2 and 4 — day 140 step 2',
      'Power or open chords — day 140 step 3'
    ],
    theoryBite: 'Day 140 focus — Genre Day — Rock Eighth Drive 19: Rock drive is relentless eighths with backbeat awareness — body first.',
    drills: [
      'Eighths mute [Genre Day]',
      'Accent 2/4 (D140.2)',
      'Chord drive (D140.3)'
    ],
    libraryIds: ['pr-andalu', 'ch-am', 'rf-minor-slide-lick-study', 'sg-london-bridge'],
    masteryCheck: 'Day 140: Drive 16 bars of rock eighths with clear 2 and 4.',
  },
  141: {
    title: 'Weekly Rhythm Checkpoint 3',
    durationMin: 30,
    goals: [
      'Straight vs shuffle demo (focus: Weekly Rhythm Checkpoint 3)',
      'One syncopated pattern — day 141 step 2',
      'One arranged texture ride — day 141 step 3'
    ],
    theoryBite: 'Day 141 focus — Weekly Rhythm Checkpoint 3: Multi-skill retrieval in performance conditions cements rhythm vocabulary.',
    drills: [
      'Demo feels [Weekly Rhythm Checkpoint 3]',
      'Syncopation (D141.2)',
      'Arrange (D141.3)'
    ],
    libraryIds: ['pr-145', 'ch-e', 'rf-open-am', 'sg-this-old-man'],
    masteryCheck: 'Day 141: In one take, show two feels and one syncopated idea cleanly.',
  },
  142: {
    title: 'Click Trust — Play Behind/On/Ahead 21',
    durationMin: 30,
    goals: [
      'Play slightly behind the click (focus: Click Trust)',
      'Play on top of the click — day 142 step 2',
      'Avoid rushing fills — day 142 step 3'
    ],
    theoryBite: 'Day 142 focus — Click Trust — Play Behind/On/Ahead 21: Time feel is placeable. Studio players choose behind/on/ahead intentionally.',
    drills: [
      'Behind take [Click Trust]',
      'On-top take (D142.2)',
      'Compare (D142.3)'
    ],
    libraryIds: ['pr-1645', 'ch-a', 'rf-power', 'sg-happy-birthday'],
    masteryCheck: 'Day 142: Demonstrate on-the-click and behind-the-click feels on the same pattern.',
  },
  143: {
    title: 'Dynamic Waves — Crescendo Strum 22',
    durationMin: 30,
    goals: [
      '4 bars soft to loud (focus: Dynamic Waves)',
      '4 bars loud to soft — day 143 step 2',
      'Keep tempo flat while volume moves — day 143 step 3'
    ],
    theoryBite: 'Day 143 focus — Dynamic Waves — Crescendo Strum 22: Separating dynamics from tempo is elite right-hand control.',
    drills: [
      'Crescendo [Dynamic Waves]',
      'Decrescendo (D143.2)',
      'Flat tempo check (D143.3)'
    ],
    libraryIds: ['pr-6251', 'ch-f', 'rf-blues-sh', 'sg-minuet-in-g-bach-public-domain'],
    masteryCheck: 'Day 143: Perform an 8-bar dynamic wave without speeding up.',
  },
  144: {
    title: 'Odd Accent — 5/4 Taste 23',
    durationMin: 30,
    goals: [
      'Count 1 2 3 4 5 (focus: Odd Accent)',
      'Accent 1 and 4 — day 144 step 2',
      'Return to 4/4 relieved — day 144 step 3'
    ],
    theoryBite: 'Day 144 focus — Odd Accent — 5/4 Taste 23: Small odd-meter tastes expand rhythmic confidence without derailing the year’s 4/4 core.',
    drills: [
      'Count [Odd Accent]',
      'Muted 5/4 (D144.2)',
      'Song back in 4 (D144.3)'
    ],
    libraryIds: ['pr-12bar', 'ch-bm', 'rf-spider', 'sg-f-r-elise-motif-beethoven-public'],
    masteryCheck: 'Day 144: Play 4 bars of intentional 5/4 accents, then settle into 4/4.',
  },
  145: {
    title: 'Comp Patterns — Two Rights, One Left 24',
    durationMin: 30,
    goals: [
      'Right hand pattern A (focus: Comp Patterns)',
      'Right hand pattern B — day 145 step 2',
      'Left hand chord change on barlines only — day 145 step 3'
    ],
    theoryBite: 'Day 145 focus — Comp Patterns — Two Rights, One Left 24: Decoupling hands reduces freeze at changes — a core easy-teaching tactic.',
    drills: [
      'A only [Comp Patterns]',
      'B only (D145.2)',
      'A/B with changes (D145.3)'
    ],
    libraryIds: ['pr-andalu', 'ch-c7', 'rf-caged-c', 'sg-canon-in-d-pachelbel-theme-publi'],
    masteryCheck: 'Day 145: Change chords on barlines while right hand keeps a unbroken pattern.',
  },
  146: {
    title: 'Genre Day — Country Boom-Chuck Deepening 25',
    durationMin: 30,
    goals: [
      'Bass/chord split clarity (focus: Genre Day)',
      'Walk bass if ready between chords — day 146 step 2',
      'Keep it friendly, not frantic — day 146 step 3'
    ],
    theoryBite: 'Day 146 focus — Genre Day — Country Boom-Chuck Deepening 25: Style days encode patterns into long-term memory via distinctive hooks.',
    drills: [
      'Boom-chuck [Genre Day]',
      'Add walk (D146.2)',
      'Song loop (D146.3)'
    ],
    libraryIds: ['pr-145', 'ch-g7', 'rf-open-g-roll-study', 'sg-brahms-lullaby'],
    masteryCheck: 'Day 146: Play 16 bars of convincing boom-chuck time.',
  },
  147: {
    title: 'Genre Day — Rock Eighth Drive 26',
    durationMin: 35,
    goals: [
      'Steady eighth downs (focus: Genre Day)',
      'Snare-like accents on 2 and 4 — day 147 step 2',
      'Power or open chords — day 147 step 3'
    ],
    theoryBite: 'Day 147 focus — Genre Day — Rock Eighth Drive 26: Rock drive is relentless eighths with backbeat awareness — body first.',
    drills: [
      'Eighths mute [Genre Day]',
      'Accent 2/4 (D147.2)',
      'Chord drive (D147.3)'
    ],
    libraryIds: ['pr-1645', 'ch-d7', 'rf-em-pentatonic-box-study', 'sg-blue-danube-motif-strauss-public'],
    masteryCheck: 'Day 147: Drive 16 bars of rock eighths with clear 2 and 4.',
  },
  148: {
    title: 'Weekly Rhythm Checkpoint 4',
    durationMin: 30,
    goals: [
      'Straight vs shuffle demo (focus: Weekly Rhythm Checkpoint 4)',
      'One syncopated pattern — day 148 step 2',
      'One arranged texture ride — day 148 step 3'
    ],
    theoryBite: 'Day 148 focus — Weekly Rhythm Checkpoint 4: Multi-skill retrieval in performance conditions cements rhythm vocabulary.',
    drills: [
      'Demo feels [Weekly Rhythm Checkpoint 4]',
      'Syncopation (D148.2)',
      'Arrange (D148.3)'
    ],
    libraryIds: ['pr-6251', 'ch-a7', 'rf-d-folk-pattern-study', 'sg-william-tell-motif-rossini-publi'],
    masteryCheck: 'Day 148: In one take, show two feels and one syncopated idea cleanly.',
  },
  149: {
    title: 'Click Trust — Play Behind/On/Ahead 28',
    durationMin: 30,
    goals: [
      'Play slightly behind the click (focus: Click Trust)',
      'Play on top of the click — day 149 step 2',
      'Avoid rushing fills — day 149 step 3'
    ],
    theoryBite: 'Day 149 focus — Click Trust — Play Behind/On/Ahead 28: Time feel is placeable. Studio players choose behind/on/ahead intentionally.',
    drills: [
      'Behind take [Click Trust]',
      'On-top take (D149.2)',
      'Compare (D149.3)'
    ],
    libraryIds: ['pr-12bar', 'ch-e7', 'rf-a-blues-turnaround-study', 'sg-the-entertainer-motif-joplin-pub'],
    masteryCheck: 'Day 149: Demonstrate on-the-click and behind-the-click feels on the same pattern.',
  },
  150: {
    title: 'Rhythm Capstone Mid — 32-Bar Texture Ride',
    durationMin: 30,
    goals: [
      '4 bars soft to loud (focus: Rhythm Capstone Mid)',
      '4 bars loud to soft — day 150 step 2',
      'Keep tempo flat while volume moves — day 150 step 3'
    ],
    theoryBite: 'Day 150 focus — Rhythm Capstone Mid — 32-Bar Texture Ride: Separating dynamics from tempo is elite right-hand control.',
    drills: [
      'Crescendo [Rhythm Capstone Mid]',
      'Decrescendo (D150.2)',
      'Flat tempo check (D150.3)'
    ],
    libraryIds: ['pr-andalu', 'ch-dm', 'rf-g-caged-run-study', 'sg-shenandoah'],
    masteryCheck: 'Day 150: Perform an 8-bar dynamic wave without speeding up.',
  },
  151: {
    title: 'Groove Deepening — Pocket Variations',
    durationMin: 30,
    goals: [
      'Count 1 2 3 4 5 (focus: Groove Deepening)',
      'Accent 1 and 4 — day 151 step 2',
      'Return to 4/4 relieved — day 151 step 3'
    ],
    theoryBite: 'Day 151 focus — Groove Deepening — Pocket Variations: Small odd-meter tastes expand rhythmic confidence without derailing the year’s 4/4 core.',
    drills: [
      'Count [Groove Deepening]',
      'Muted 5/4 (D151.2)',
      'Song back in 4 (D151.3)'
    ],
    libraryIds: ['pr-145', 'ch-c', 'rf-c-bass-walk-study', 'sg-red-river-valley'],
    masteryCheck: 'Day 151: Play 4 bars of intentional 5/4 accents, then settle into 4/4.',
  },
  152: {
    title: 'Comp Patterns — Two Rights, One Left 31',
    durationMin: 30,
    goals: [
      'Right hand pattern A (focus: Comp Patterns)',
      'Right hand pattern B — day 152 step 2',
      'Left hand chord change on barlines only — day 152 step 3'
    ],
    theoryBite: 'Day 152 focus — Comp Patterns — Two Rights, One Left 31: Decoupling hands reduces freeze at changes — a core easy-teaching tactic.',
    drills: [
      'A only [Comp Patterns]',
      'B only (D152.2)',
      'A/B with changes (D152.3)'
    ],
    libraryIds: ['pr-1645', 'ch-g', 'rf-spanish-e-phrygian-study', 'sg-home-on-the-range'],
    masteryCheck: 'Day 152: Change chords on barlines while right hand keeps a unbroken pattern.',
  },
  153: {
    title: 'Genre Day — Country Boom-Chuck Deepening 32',
    durationMin: 30,
    goals: [
      'Bass/chord split clarity (focus: Genre Day)',
      'Walk bass if ready between chords — day 153 step 2',
      'Keep it friendly, not frantic — day 153 step 3'
    ],
    theoryBite: 'Day 153 focus — Genre Day — Country Boom-Chuck Deepening 32: Style days encode patterns into long-term memory via distinctive hooks.',
    drills: [
      'Boom-chuck [Genre Day]',
      'Add walk (D153.2)',
      'Song loop (D153.3)'
    ],
    libraryIds: ['pr-6251', 'ch-d', 'rf-funk-chicka-study', 'sg-turkey-in-the-straw'],
    masteryCheck: 'Day 153: Play 16 bars of convincing boom-chuck time.',
  },
  154: {
    title: 'Genre Day — Rock Eighth Drive 33',
    durationMin: 35,
    goals: [
      'Steady eighth downs (focus: Genre Day)',
      'Snare-like accents on 2 and 4 — day 154 step 2',
      'Power or open chords — day 154 step 3'
    ],
    theoryBite: 'Day 154 focus — Genre Day — Rock Eighth Drive 33: Rock drive is relentless eighths with backbeat awareness — body first.',
    drills: [
      'Eighths mute [Genre Day]',
      'Accent 2/4 (D154.2)',
      'Chord drive (D154.3)'
    ],
    libraryIds: ['pr-12bar', 'ch-em', 'rf-palm-mute-chug-study', 'sg-arkansas-traveler'],
    masteryCheck: 'Day 154: Drive 16 bars of rock eighths with clear 2 and 4.',
  },
  155: {
    title: 'Weekly Rhythm Checkpoint 5',
    durationMin: 30,
    goals: [
      'Straight vs shuffle demo (focus: Weekly Rhythm Checkpoint 5)',
      'One syncopated pattern — day 155 step 2',
      'One arranged texture ride — day 155 step 3'
    ],
    theoryBite: 'Day 155 focus — Weekly Rhythm Checkpoint 5: Multi-skill retrieval in performance conditions cements rhythm vocabulary.',
    drills: [
      'Demo feels [Weekly Rhythm Checkpoint 5]',
      'Syncopation (D155.2)',
      'Arrange (D155.3)'
    ],
    libraryIds: ['pr-andalu', 'ch-am', 'rf-jazz-chromatic-approach-study', 'sg-sailor-s-hornpipe'],
    masteryCheck: 'Day 155: In one take, show two feels and one syncopated idea cleanly.',
  },
  156: {
    title: 'Click Trust — Play Behind/On/Ahead 35',
    durationMin: 30,
    goals: [
      'Play slightly behind the click (focus: Click Trust)',
      'Play on top of the click — day 156 step 2',
      'Avoid rushing fills — day 156 step 3'
    ],
    theoryBite: 'Day 156 focus — Click Trust — Play Behind/On/Ahead 35: Time feel is placeable. Studio players choose behind/on/ahead intentionally.',
    drills: [
      'Behind take [Click Trust]',
      'On-top take (D156.2)',
      'Compare (D156.3)'
    ],
    libraryIds: ['pr-145', 'ch-e', 'rf-am-arpeggio-cascade', 'sg-drunken-sailor'],
    masteryCheck: 'Day 156: Demonstrate on-the-click and behind-the-click feels on the same pattern.',
  },
  157: {
    title: 'Dynamic Waves — Crescendo Strum 36',
    durationMin: 30,
    goals: [
      '4 bars soft to loud (focus: Dynamic Waves)',
      '4 bars loud to soft — day 157 step 2',
      'Keep tempo flat while volume moves — day 157 step 3'
    ],
    theoryBite: 'Day 157 focus — Dynamic Waves — Crescendo Strum 36: Separating dynamics from tempo is elite right-hand control.',
    drills: [
      'Crescendo [Dynamic Waves]',
      'Decrescendo (D157.2)',
      'Flat tempo check (D157.3)'
    ],
    libraryIds: ['pr-1645', 'ch-a', 'rf-drop-d-power-study', 'sg-molly-malone'],
    masteryCheck: 'Day 157: Perform an 8-bar dynamic wave without speeding up.',
  },
  158: {
    title: 'Odd Accent — 5/4 Taste 37',
    durationMin: 30,
    goals: [
      'Count 1 2 3 4 5 (focus: Odd Accent)',
      'Accent 1 and 4 — day 158 step 2',
      'Return to 4/4 relieved — day 158 step 3'
    ],
    theoryBite: 'Day 158 focus — Odd Accent — 5/4 Taste 37: Small odd-meter tastes expand rhythmic confidence without derailing the year’s 4/4 core.',
    drills: [
      'Count [Odd Accent]',
      'Muted 5/4 (D158.2)',
      'Song back in 4 (D158.3)'
    ],
    libraryIds: ['pr-6251', 'ch-f', 'rf-travis-pick-sketch-in-c', 'sg-the-parting-glass'],
    masteryCheck: 'Day 158: Play 4 bars of intentional 5/4 accents, then settle into 4/4.',
  },
  159: {
    title: 'Comp Patterns — Two Rights, One Left 38',
    durationMin: 30,
    goals: [
      'Right hand pattern A (focus: Comp Patterns)',
      'Right hand pattern B — day 159 step 2',
      'Left hand chord change on barlines only — day 159 step 3'
    ],
    theoryBite: 'Day 159 focus — Comp Patterns — Two Rights, One Left 38: Decoupling hands reduces freeze at changes — a core easy-teaching tactic.',
    drills: [
      'A only [Comp Patterns]',
      'B only (D159.2)',
      'A/B with changes (D159.3)'
    ],
    libraryIds: ['pr-12bar', 'ch-bm', 'rf-natural-harmonics-study', 'sg-simple-gifts'],
    masteryCheck: 'Day 159: Change chords on barlines while right hand keeps a unbroken pattern.',
  },
  160: {
    title: 'Genre Day — Country Boom-Chuck Deepening 39',
    durationMin: 30,
    goals: [
      'Bass/chord split clarity (focus: Genre Day)',
      'Walk bass if ready between chords — day 160 step 2',
      'Keep it friendly, not frantic — day 160 step 3'
    ],
    theoryBite: 'Day 160 focus — Genre Day — Country Boom-Chuck Deepening 39: Style days encode patterns into long-term memory via distinctive hooks.',
    drills: [
      'Boom-chuck [Genre Day]',
      'Add walk (D160.2)',
      'Song loop (D160.3)'
    ],
    libraryIds: ['pr-andalu', 'ch-c7', 'rf-minor-slide-lick-study', 'sg-wayfaring-stranger'],
    masteryCheck: 'Day 160: Play 16 bars of convincing boom-chuck time.',
  },
  161: {
    title: 'Genre Day — Rock Eighth Drive 40',
    durationMin: 35,
    goals: [
      'Steady eighth downs (focus: Genre Day)',
      'Snare-like accents on 2 and 4 — day 161 step 2',
      'Power or open chords — day 161 step 3'
    ],
    theoryBite: 'Day 161 focus — Genre Day — Rock Eighth Drive 40: Rock drive is relentless eighths with backbeat awareness — body first.',
    drills: [
      'Eighths mute [Genre Day]',
      'Accent 2/4 (D161.2)',
      'Chord drive (D161.3)'
    ],
    libraryIds: ['pr-145', 'ch-g7', 'rf-open-am', 'sg-barbara-allen'],
    masteryCheck: 'Day 161: Drive 16 bars of rock eighths with clear 2 and 4.',
  },
  162: {
    title: 'Weekly Rhythm Checkpoint 6',
    durationMin: 30,
    goals: [
      'Straight vs shuffle demo (focus: Weekly Rhythm Checkpoint 6)',
      'One syncopated pattern — day 162 step 2',
      'One arranged texture ride — day 162 step 3'
    ],
    theoryBite: 'Day 162 focus — Weekly Rhythm Checkpoint 6: Multi-skill retrieval in performance conditions cements rhythm vocabulary.',
    drills: [
      'Demo feels [Weekly Rhythm Checkpoint 6]',
      'Syncopation (D162.2)',
      'Arrange (D162.3)'
    ],
    libraryIds: ['pr-1645', 'ch-d7', 'rf-power', 'sg-down-by-the-riverside'],
    masteryCheck: 'Day 162: In one take, show two feels and one syncopated idea cleanly.',
  },
  163: {
    title: 'Click Trust — Play Behind/On/Ahead 42',
    durationMin: 30,
    goals: [
      'Play slightly behind the click (focus: Click Trust)',
      'Play on top of the click — day 163 step 2',
      'Avoid rushing fills — day 163 step 3'
    ],
    theoryBite: 'Day 163 focus — Click Trust — Play Behind/On/Ahead 42: Time feel is placeable. Studio players choose behind/on/ahead intentionally.',
    drills: [
      'Behind take [Click Trust]',
      'On-top take (D163.2)',
      'Compare (D163.3)'
    ],
    libraryIds: ['pr-6251', 'ch-a7', 'rf-blues-sh', 'sg-skip-to-my-lou'],
    masteryCheck: 'Day 163: Demonstrate on-the-click and behind-the-click feels on the same pattern.',
  },
  164: {
    title: 'Dynamic Waves — Crescendo Strum 43',
    durationMin: 30,
    goals: [
      '4 bars soft to loud (focus: Dynamic Waves)',
      '4 bars loud to soft — day 164 step 2',
      'Keep tempo flat while volume moves — day 164 step 3'
    ],
    theoryBite: 'Day 164 focus — Dynamic Waves — Crescendo Strum 43: Separating dynamics from tempo is elite right-hand control.',
    drills: [
      'Crescendo [Dynamic Waves]',
      'Decrescendo (D164.2)',
      'Flat tempo check (D164.3)'
    ],
    libraryIds: ['pr-12bar', 'ch-e7', 'rf-spider', 'sg-i-ve-been-working-on-the-railroa'],
    masteryCheck: 'Day 164: Perform an 8-bar dynamic wave without speeding up.',
  },
  165: {
    title: 'Odd Accent — 5/4 Taste 44',
    durationMin: 30,
    goals: [
      'Count 1 2 3 4 5 (focus: Odd Accent)',
      'Accent 1 and 4 — day 165 step 2',
      'Return to 4/4 relieved — day 165 step 3'
    ],
    theoryBite: 'Day 165 focus — Odd Accent — 5/4 Taste 44: Small odd-meter tastes expand rhythmic confidence without derailing the year’s 4/4 core.',
    drills: [
      'Count [Odd Accent]',
      'Muted 5/4 (D165.2)',
      'Song back in 4 (D165.3)'
    ],
    libraryIds: ['pr-andalu', 'ch-dm', 'rf-caged-c', 'sg-she-ll-be-coming-round-the-mount'],
    masteryCheck: 'Day 165: Play 4 bars of intentional 5/4 accents, then settle into 4/4.',
  },
  166: {
    title: 'Comp Patterns — Two Rights, One Left 45',
    durationMin: 30,
    goals: [
      'Right hand pattern A (focus: Comp Patterns)',
      'Right hand pattern B — day 166 step 2',
      'Left hand chord change on barlines only — day 166 step 3'
    ],
    theoryBite: 'Day 166 focus — Comp Patterns — Two Rights, One Left 45: Decoupling hands reduces freeze at changes — a core easy-teaching tactic.',
    drills: [
      'A only [Comp Patterns]',
      'B only (D166.2)',
      'A/B with changes (D166.3)'
    ],
    libraryIds: ['pr-145', 'ch-c', 'rf-open-g-roll-study', 'sg-house-of-the-rising-sun'],
    masteryCheck: 'Day 166: Change chords on barlines while right hand keeps a unbroken pattern.',
  },
  167: {
    title: 'Genre Day — Country Boom-Chuck Deepening 46',
    durationMin: 30,
    goals: [
      'Bass/chord split clarity (focus: Genre Day)',
      'Walk bass if ready between chords — day 167 step 2',
      'Keep it friendly, not frantic — day 167 step 3'
    ],
    theoryBite: 'Day 167 focus — Genre Day — Country Boom-Chuck Deepening 46: Style days encode patterns into long-term memory via distinctive hooks.',
    drills: [
      'Boom-chuck [Genre Day]',
      'Add walk (D167.2)',
      'Song loop (D167.3)'
    ],
    libraryIds: ['pr-1645', 'ch-g', 'rf-em-pentatonic-box-study', 'sg-black-is-the-color'],
    masteryCheck: 'Day 167: Play 16 bars of convincing boom-chuck time.',
  },
  168: {
    title: 'Genre Day — Rock Eighth Drive 47',
    durationMin: 35,
    goals: [
      'Steady eighth downs (focus: Genre Day)',
      'Snare-like accents on 2 and 4 — day 168 step 2',
      'Power or open chords — day 168 step 3'
    ],
    theoryBite: 'Day 168 focus — Genre Day — Rock Eighth Drive 47: Rock drive is relentless eighths with backbeat awareness — body first.',
    drills: [
      'Eighths mute [Genre Day]',
      'Accent 2/4 (D168.2)',
      'Chord drive (D168.3)'
    ],
    libraryIds: ['pr-6251', 'ch-d', 'rf-d-folk-pattern-study', 'sg-wild-mountain-thyme'],
    masteryCheck: 'Day 168: Drive 16 bars of rock eighths with clear 2 and 4.',
  },
  169: {
    title: 'Weekly Rhythm Checkpoint 7',
    durationMin: 30,
    goals: [
      'Straight vs shuffle demo (focus: Weekly Rhythm Checkpoint 7)',
      'One syncopated pattern — day 169 step 2',
      'One arranged texture ride — day 169 step 3'
    ],
    theoryBite: 'Day 169 focus — Weekly Rhythm Checkpoint 7: Multi-skill retrieval in performance conditions cements rhythm vocabulary.',
    drills: [
      'Demo feels [Weekly Rhythm Checkpoint 7]',
      'Syncopation (D169.2)',
      'Arrange (D169.3)'
    ],
    libraryIds: ['pr-12bar', 'ch-em', 'rf-a-blues-turnaround-study', 'sg-go-tell-aunt-rhody'],
    masteryCheck: 'Day 169: In one take, show two feels and one syncopated idea cleanly.',
  },
  170: {
    title: 'Click Trust — Play Behind/On/Ahead 49',
    durationMin: 30,
    goals: [
      'Play slightly behind the click (focus: Click Trust)',
      'Play on top of the click — day 170 step 2',
      'Avoid rushing fills — day 170 step 3'
    ],
    theoryBite: 'Day 170 focus — Click Trust — Play Behind/On/Ahead 49: Time feel is placeable. Studio players choose behind/on/ahead intentionally.',
    drills: [
      'Behind take [Click Trust]',
      'On-top take (D170.2)',
      'Compare (D170.3)'
    ],
    libraryIds: ['pr-andalu', 'ch-am', 'rf-g-caged-run-study', 'sg-buffalo-gals'],
    masteryCheck: 'Day 170: Demonstrate on-the-click and behind-the-click feels on the same pattern.',
  },
  171: {
    title: 'Dynamic Waves — Crescendo Strum 50',
    durationMin: 30,
    goals: [
      '4 bars soft to loud (focus: Dynamic Waves)',
      '4 bars loud to soft — day 171 step 2',
      'Keep tempo flat while volume moves — day 171 step 3'
    ],
    theoryBite: 'Day 171 focus — Dynamic Waves — Crescendo Strum 50: Separating dynamics from tempo is elite right-hand control.',
    drills: [
      'Crescendo [Dynamic Waves]',
      'Decrescendo (D171.2)',
      'Flat tempo check (D171.3)'
    ],
    libraryIds: ['pr-145', 'ch-e', 'rf-c-bass-walk-study', 'sg-joshua-fit-the-battle-of-jericho'],
    masteryCheck: 'Day 171: Perform an 8-bar dynamic wave without speeding up.',
  },
  172: {
    title: 'Odd Accent — 5/4 Taste 51',
    durationMin: 30,
    goals: [
      'Count 1 2 3 4 5 (focus: Odd Accent)',
      'Accent 1 and 4 — day 172 step 2',
      'Return to 4/4 relieved — day 172 step 3'
    ],
    theoryBite: 'Day 172 focus — Odd Accent — 5/4 Taste 51: Small odd-meter tastes expand rhythmic confidence without derailing the year’s 4/4 core.',
    drills: [
      'Count [Odd Accent]',
      'Muted 5/4 (D172.2)',
      'Song back in 4 (D172.3)'
    ],
    libraryIds: ['pr-1645', 'ch-a', 'rf-spanish-e-phrygian-study', 'sg-the-streets-of-laredo'],
    masteryCheck: 'Day 172: Play 4 bars of intentional 5/4 accents, then settle into 4/4.',
  },
  173: {
    title: 'Comp Patterns — Two Rights, One Left 52',
    durationMin: 30,
    goals: [
      'Right hand pattern A (focus: Comp Patterns)',
      'Right hand pattern B — day 173 step 2',
      'Left hand chord change on barlines only — day 173 step 3'
    ],
    theoryBite: 'Day 173 focus — Comp Patterns — Two Rights, One Left 52: Decoupling hands reduces freeze at changes — a core easy-teaching tactic.',
    drills: [
      'A only [Comp Patterns]',
      'B only (D173.2)',
      'A/B with changes (D173.3)'
    ],
    libraryIds: ['pr-6251', 'ch-f', 'rf-funk-chicka-study', 'sg-careless-love'],
    masteryCheck: 'Day 173: Change chords on barlines while right hand keeps a unbroken pattern.',
  },
  174: {
    title: 'Genre Day — Country Boom-Chuck Deepening 53',
    durationMin: 30,
    goals: [
      'Bass/chord split clarity (focus: Genre Day)',
      'Walk bass if ready between chords — day 174 step 2',
      'Keep it friendly, not frantic — day 174 step 3'
    ],
    theoryBite: 'Day 174 focus — Genre Day — Country Boom-Chuck Deepening 53: Style days encode patterns into long-term memory via distinctive hooks.',
    drills: [
      'Boom-chuck [Genre Day]',
      'Add walk (D174.2)',
      'Song loop (D174.3)'
    ],
    libraryIds: ['pr-12bar', 'ch-bm', 'rf-palm-mute-chug-study', 'sg-st-louis-blues-motif-handy-1914-'],
    masteryCheck: 'Day 174: Play 16 bars of convincing boom-chuck time.',
  },
  175: {
    title: 'Genre Day — Rock Eighth Drive 54',
    durationMin: 35,
    goals: [
      'Steady eighth downs (focus: Genre Day)',
      'Snare-like accents on 2 and 4 — day 175 step 2',
      'Power or open chords — day 175 step 3'
    ],
    theoryBite: 'Day 175 focus — Genre Day — Rock Eighth Drive 54: Rock drive is relentless eighths with backbeat awareness — body first.',
    drills: [
      'Eighths mute [Genre Day]',
      'Accent 2/4 (D175.2)',
      'Chord drive (D175.3)'
    ],
    libraryIds: ['pr-andalu', 'ch-c7', 'rf-jazz-chromatic-approach-study', 'sg-maple-leaf-rag-motif-joplin-publ'],
    masteryCheck: 'Day 175: Drive 16 bars of rock eighths with clear 2 and 4.',
  },
  176: {
    title: 'Weekly Rhythm Checkpoint 8',
    durationMin: 30,
    goals: [
      'Straight vs shuffle demo (focus: Weekly Rhythm Checkpoint 8)',
      'One syncopated pattern — day 176 step 2',
      'One arranged texture ride — day 176 step 3'
    ],
    theoryBite: 'Day 176 focus — Weekly Rhythm Checkpoint 8: Multi-skill retrieval in performance conditions cements rhythm vocabulary.',
    drills: [
      'Demo feels [Weekly Rhythm Checkpoint 8]',
      'Syncopation (D176.2)',
      'Arrange (D176.3)'
    ],
    libraryIds: ['pr-145', 'ch-g7', 'rf-am-arpeggio-cascade', 'sg-morning-mood-motif-grieg-public-'],
    masteryCheck: 'Day 176: In one take, show two feels and one syncopated idea cleanly.',
  },
  177: {
    title: 'Click Trust — Play Behind/On/Ahead 56',
    durationMin: 30,
    goals: [
      'Play slightly behind the click (focus: Click Trust)',
      'Play on top of the click — day 177 step 2',
      'Avoid rushing fills — day 177 step 3'
    ],
    theoryBite: 'Day 177 focus — Click Trust — Play Behind/On/Ahead 56: Time feel is placeable. Studio players choose behind/on/ahead intentionally.',
    drills: [
      'Behind take [Click Trust]',
      'On-top take (D177.2)',
      'Compare (D177.3)'
    ],
    libraryIds: ['pr-1645', 'ch-d7', 'rf-drop-d-power-study', 'sg-twinkle'],
    masteryCheck: 'Day 177: Demonstrate on-the-click and behind-the-click feels on the same pattern.',
  },
  178: {
    title: 'Dynamic Waves — Crescendo Strum 57',
    durationMin: 30,
    goals: [
      '4 bars soft to loud (focus: Dynamic Waves)',
      '4 bars loud to soft — day 178 step 2',
      'Keep tempo flat while volume moves — day 178 step 3'
    ],
    theoryBite: 'Day 178 focus — Dynamic Waves — Crescendo Strum 57: Separating dynamics from tempo is elite right-hand control.',
    drills: [
      'Crescendo [Dynamic Waves]',
      'Decrescendo (D178.2)',
      'Flat tempo check (D178.3)'
    ],
    libraryIds: ['pr-6251', 'ch-a7', 'rf-travis-pick-sketch-in-c', 'sg-ode'],
    masteryCheck: 'Day 178: Perform an 8-bar dynamic wave without speeding up.',
  },
  179: {
    title: 'Odd Accent — 5/4 Taste 58',
    durationMin: 30,
    goals: [
      'Count 1 2 3 4 5 (focus: Odd Accent)',
      'Accent 1 and 4 — day 179 step 2',
      'Return to 4/4 relieved — day 179 step 3'
    ],
    theoryBite: 'Day 179 focus — Odd Accent — 5/4 Taste 58: Small odd-meter tastes expand rhythmic confidence without derailing the year’s 4/4 core.',
    drills: [
      'Count [Odd Accent]',
      'Muted 5/4 (D179.2)',
      'Song back in 4 (D179.3)'
    ],
    libraryIds: ['pr-12bar', 'ch-e7', 'rf-natural-harmonics-study', 'sg-drums'],
    masteryCheck: 'Day 179: Play 4 bars of intentional 5/4 accents, then settle into 4/4.',
  },
  180: {
    title: 'Rhythm Checkpoint — Bridge Toward Lead',
    durationMin: 30,
    goals: [
      'Right hand pattern A (focus: Rhythm Checkpoint)',
      'Right hand pattern B — day 180 step 2',
      'Left hand chord change on barlines only — day 180 step 3'
    ],
    theoryBite: 'Day 180 focus — Rhythm Checkpoint — Bridge Toward Lead: Decoupling hands reduces freeze at changes — a core easy-teaching tactic.',
    drills: [
      'A only [Rhythm Checkpoint]',
      'B only (D180.2)',
      'A/B with changes (D180.3)'
    ],
    libraryIds: ['pr-andalu', 'ch-dm', 'rf-minor-slide-lick-study', 'sg-amazing-grace'],
    masteryCheck: 'Day 180: Change chords on barlines while right hand keeps a unbroken pattern.',
  },
  181: {
    title: 'Lead Phase Open — Say Something, Then Listen',
    durationMin: 30,
    goals: [
      'Play a 3-note motif (focus: Lead Phase Open)',
      'Rest a full bar — day 181 step 2',
      'Answer yourself — day 181 step 3'
    ],
    theoryBite: 'Day 181 focus — Lead Phase Open — Say Something, Then Listen: Lead guitar is speech. Breath (rest) makes phrases human — research on chunking matches how ears parse music.',
    drills: [
      'Motif [Lead Phase Open]',
      'Rest (D181.2)',
      'Answer variation (D181.3)',
      'Repeat cycle 8× (D181.4)'
    ],
    libraryIds: ['sc-pent-min', 'ch-am'],
    masteryCheck: 'Day 181: Perform eight motif/rest/answer cycles without filling every hole.',
  },
  182: {
    title: 'Bends 101 — Target Pitch',
    durationMin: 35,
    goals: [
      'Half-step bend to a known fretted target (focus: Bends 101)',
      'Match pitch with ear — day 182 step 2',
      'Release in time — day 182 step 3'
    ],
    theoryBite: 'Day 182 focus — Bends 101 — Target Pitch: Bends without targets are out-of-tune by definition. Always know the destination pitch.',
    drills: [
      'Fret target, then bend into it from below [Bends 101]',
      'Hold 2 beats in tune (D182.2)',
      'Release on a subdivision (D182.3)'
    ],
    libraryIds: ['sc-pent-min', 'sc-blues', 'rf-blues-sh'],
    masteryCheck: 'Day 182: Execute four bends that clearly match a fretted target pitch.',
  },
  183: {
    title: 'Vibrato — Controlled Wave',
    durationMin: 30,
    goals: [
      'Even vibrato width (focus: Vibrato)',
      'Even vibrato speed — day 183 step 2',
      'Apply to phrase endings — day 183 step 3'
    ],
    theoryBite: 'Day 183 focus — Vibrato — Controlled Wave: Vibrato is a signature. Even and intentional beats fast and nervous.',
    drills: [
      'Long tone no vib [Vibrato]',
      'Slow wide vib (D183.2)',
      'Faster narrow vib (D183.3)',
      'Choose one for endings today (D183.4)'
    ],
    libraryIds: ['sc-pent-min', 'sg-ode'],
    masteryCheck: 'Day 183: End four phrases with controlled vibrato you could describe (wide/slow or tight/fast).',
  },
  184: {
    title: 'Slides — Connect Positions Musically',
    durationMin: 30,
    goals: [
      'Slide into chord tones (focus: Slides)',
      'Keep contact light enough to travel — day 184 step 2',
      'Land in time — day 184 step 3'
    ],
    theoryBite: 'Day 184 focus — Slides — Connect Positions Musically: Slides glue positions and sound vocal. Timing the landing matters more than distance.',
    drills: [
      'Short slides [Slides]',
      'Longer position slides (D184.2)',
      'Slide-in licks only today (D184.3)'
    ],
    libraryIds: ['sc-pent-min', 'rf-caged-c'],
    masteryCheck: 'Day 184: Play six licks that begin with a purposeful slide into a target note.',
  },
  185: {
    title: 'Hammer-ons & Pull-offs — Legato Seed',
    durationMin: 30,
    goals: [
      'Hammer cleanly from open or fretted (focus: Hammer-ons & Pull-offs)',
      'Pull-off with a tiny pluck downward — day 185 step 2',
      'Keep volume comparable to picked notes — day 185 step 3'
    ],
    theoryBite: 'Day 185 focus — Hammer-ons & Pull-offs — Legato Seed: Legato smooths lines and reduces pick traffic. Even volume is the hard part.',
    drills: [
      'Hammer pairs [Hammer-ons & Pull-offs]',
      'Pull pairs (D185.2)',
      'Mix with picked notes (D185.3)'
    ],
    libraryIds: ['rf-spider', 'sc-pent-min'],
    masteryCheck: 'Day 185: Play a 4-bar legato-leaning line with audible hammers/pulls.',
  },
  186: {
    title: 'Double Stops — Two-Note Harmony',
    durationMin: 30,
    goals: [
      'Play sixths or thirds on adjacent/non-adjacent strings (focus: Double Stops)',
      'Slide double stops — day 186 step 2',
      'Use as chorus hooks — day 186 step 3'
    ],
    theoryBite: 'Day 186 focus — Double Stops — Two-Note Harmony: Double stops sound ‘expensive’ with little technique — harmony in the lead hand.',
    drills: [
      'Find a sweet sixth shape [Double Stops]',
      'Move diatonically (D186.2)',
      'Hook riff 4 bars (D186.3)'
    ],
    libraryIds: ['sc-major', 'sc-pent-maj', 'ch-g'],
    masteryCheck: 'Day 186: Perform an 8-bar idea featuring double stops as the main character.',
  },
  187: {
    title: 'Call From Vocals — Sing Then Solo',
    durationMin: 30,
    goals: [
      'Sing a phrase (focus: Call From Vocals)',
      'Replicate approximate contour on guitar — day 187 step 2',
      'Prefer contour over perfect pitches first — day 187 step 3'
    ],
    theoryBite: 'Day 187 focus — Call From Vocals — Sing Then Solo: Voice-leading your solos via singing is a proven shortcut to musical (not athletic) lines.',
    drills: [
      'Sing 4 phrases [Call From Vocals]',
      'Play them (D187.2)',
      'Fix only cringe notes (D187.3)'
    ],
    libraryIds: ['sg-twinkle', 'sg-ode', 'sc-pent-maj'],
    masteryCheck: 'Day 187: Match three sung contours on the guitar closely enough to recognize the tune.',
  },
  188: {
    title: 'Motif Development — Same Notes New Rhythms',
    durationMin: 30,
    goals: [
      'Freeze pitch set (focus: Motif Development)',
      'Change only rhythm for 8 bars — day 188 step 2',
      'Then change ending — day 188 step 3'
    ],
    theoryBite: 'Day 188 focus — Motif Development — Same Notes New Rhythms: Development is how short ideas become solos. Rhythm variation is the easiest developer.',
    drills: [
      'Pitch freeze [Motif Development]',
      'Rhythm catalog (D188.2)',
      'Ending catalog (D188.3)'
    ],
    libraryIds: ['sc-blues', 'pr-12bar'],
    masteryCheck: 'Day 188: Develop one motif across 12 bars without abandoning its identity.',
  },
  189: {
    title: 'Targeting 3rds — Sweet Notes Over Chords',
    durationMin: 35,
    goals: [
      'Find 3rds of G C D (focus: Targeting 3rds)',
      'Land on 3rds when chords change — day 189 step 2',
      'Approach from a scale neighbor — day 189 step 3'
    ],
    theoryBite: 'Day 189 focus — Targeting 3rds — Sweet Notes Over Chords: Thirds announce chord quality (major/minor). Targeting them makes solos sound ‘in.’',
    drills: [
      'Map 3rds [Targeting 3rds]',
      'Change hits (D189.2)',
      'Neighbor approach (D189.3)'
    ],
    libraryIds: ['pr-145', 'sc-major', 'ch-g', 'ch-c', 'ch-d'],
    masteryCheck: 'Day 189: Over a G–C–D loop, land on each chord’s 3rd on at least the first downbeat of the chord.',
  },
  190: {
    title: 'Octave Melodies — Simple & Huge',
    durationMin: 30,
    goals: [
      'Play a melody in octaves (focus: Octave Melodies)',
      'Mute string in between — day 190 step 2',
      'Keep fretting hand shape stable — day 190 step 3'
    ],
    theoryBite: 'Day 190 focus — Octave Melodies — Simple & Huge: Octaves thicken lines like a classic soul/rock move. Muting the middle string is the secret.',
    drills: [
      'Shape grip [Octave Melodies]',
      'Simple melody in octaves (D190.2)',
      'Rhythmic octave hooks (D190.3)'
    ],
    libraryIds: ['sc-pent-maj', 'sg-ode'],
    masteryCheck: 'Day 190: Play an 8-bar octave melody with clean mutes between the octave strings.',
  },
  191: {
    title: 'Dynamics in Lead — Whisper to Shout',
    durationMin: 30,
    goals: [
      'Same lick pp then ff (focus: Dynamics in Lead)',
      'Crescendo across a phrase — day 191 step 2',
      'Leave headroom — not always max — day 191 step 3'
    ],
    theoryBite: 'Day 191 focus — Dynamics in Lead — Whisper to Shout: Lead expression mirrors speech volume. Constant forte is shouting every word.',
    drills: [
      'pp lick [Dynamics in Lead]',
      'ff lick (D191.2)',
      'Crescendo lick (D191.3)'
    ],
    libraryIds: ['sc-pent-min', 'rf-blues-sh'],
    masteryCheck: 'Day 191: Play one lick three ways: soft, loud, and rising.',
  },
  192: {
    title: 'Space Solo Challenge — 50% Silence',
    durationMin: 30,
    goals: [
      'Solo with a timer (focus: Space Solo Challenge)',
      'Aim for half the time silent — day 192 step 2',
      'Make entries count — day 192 step 3'
    ],
    theoryBite: 'Day 192 focus — Space Solo Challenge — 50% Silence: Constraints create style. Silence percentage is a measurable taste trainer.',
    drills: [
      '60s solo ~50% rest [Space Solo Challenge]',
      'Listen back (D192.2)',
      'Adjust (D192.3)'
    ],
    libraryIds: ['sc-pent-min', 'ch-am', 'pr-andalu'],
    masteryCheck: 'Day 192: Deliver a 60-second solo that is roughly half silence and still musical.',
  },
  193: {
    title: 'Blues Language — Call Licks Over 12-Bar',
    durationMin: 30,
    goals: [
      'Learn 2 stock moves (focus: Blues Language)',
      'Place them on bars 1–4 and 5–8 — day 193 step 2',
      'Turnaround simplicity on 9–12 — day 193 step 3'
    ],
    theoryBite: 'Day 193 focus — Blues Language — Call Licks Over 12-Bar: Lick libraries + form awareness = blues fluency. Stock moves are features, not cheating.',
    drills: [
      'Lick A [Blues Language]',
      'Lick B (D193.2)',
      'Full chorus placement (D193.3)'
    ],
    libraryIds: ['pr-12bar', 'sc-blues', 'rf-blues-sh', 'ch-a7'],
    masteryCheck: 'Day 193: Play one 12-bar chorus using at least two distinct lick ideas in the right sections.',
  },
  194: {
    title: 'Major Key Lead — Happy Notes Over G',
    durationMin: 30,
    goals: [
      'Major pent over G–C–D (focus: Major Key Lead)',
      'Avoid accidental minor thirds on landings — day 194 step 2',
      'End phrases on G B D — day 194 step 3'
    ],
    theoryBite: 'Day 194 focus — Major Key Lead — Happy Notes Over G: Major lead is a different gravity set. Landing on major thirds keeps sunshine honest.',
    drills: [
      'Major pent only [Major Key Lead]',
      'Chord tone endings (D194.2)',
      'One chorus (D194.3)'
    ],
    libraryIds: ['sc-pent-maj', 'pr-145', 'ch-g'],
    masteryCheck: 'Day 194: Solo a bright chorus that never accidentally cadences minor.',
  },
  195: {
    title: 'Lead Capstone — 24-Bar Story Solo',
    durationMin: 30,
    goals: [
      'Motif establish (focus: Lead Capstone)',
      'Develop + peak — day 195 step 2',
      'Land and don’t overstay — day 195 step 3'
    ],
    theoryBite: 'Day 195 focus — Lead Capstone — 24-Bar Story Solo: Longer solos need architecture. Peak placement matters more than max notes per second.',
    drills: [
      'Outline on paper [Lead Capstone]',
      'Take 1 (D195.2)',
      'Take 2 with more space (D195.3)'
    ],
    libraryIds: ['sc-pent-min', 'sc-blues', 'pr-12bar', 'ch-am'],
    masteryCheck: 'Day 195: Perform a 24-bar solo with an obvious peak and a calm landing.',
  },
  196: {
    title: 'Sequence Climb — Melodic Sequences Up 15',
    durationMin: 35,
    goals: [
      'Sequence a 4-note cell upward (focus: Sequence Climb)',
      'Keep rhythmic identity — day 196 step 2',
      'Stop before it becomes sport only — day 196 step 3'
    ],
    theoryBite: 'Day 196 focus — Sequence Climb — Melodic Sequences Up 15: Sequences are classic development tools from Bach to rock — recognizable motion.',
    drills: [
      'Cell [Sequence Climb]',
      'Climb (D196.2)',
      'Land (D196.3)'
    ],
    libraryIds: ['sc-major', 'rf-am-arpeggio-cascade', 'pr-145', 'ch-c', 'sg-swing-low-sweet-chariot'],
    masteryCheck: 'Day 196: Climb a sequence through a position and land on a chord tone.',
  },
  197: {
    title: 'Question Harmony — Solo Over Andalusian 16',
    durationMin: 30,
    goals: [
      'Note each chord in Am G F E (focus: Question Harmony)',
      'Change color tones on E — day 197 step 2',
      'Keep phrases short — day 197 step 3'
    ],
    theoryBite: 'Day 197 focus — Question Harmony — Solo Over Andalusian 16: Modal progressions teach ear-led targeting under shifting gravity.',
    drills: [
      'Chord tones [Question Harmony]',
      'Short lines (D197.2)',
      'E drama (D197.3)'
    ],
    libraryIds: ['sc-nat-min', 'rf-drop-d-power-study', 'pr-1645', 'ch-g', 'sg-mary-had-a-little-lamb'],
    masteryCheck: 'Day 197: Solo one Andalusian cycle with intentional color on E.',
  },
  198: {
    title: 'Economy Picking Seed 17',
    durationMin: 30,
    goals: [
      'Down when moving to lower string (focus: Economy Picking Seed 17)',
      'Up when moving to higher string if comfortable — day 198 step 2',
      'Prefer clean to dogma — day 198 step 3'
    ],
    theoryBite: 'Day 198 focus — Economy Picking Seed 17: Economy picking is optional efficiency. Tone and time outrank ideology.',
    drills: [
      'Slow scale [Economy Picking Seed 17]',
      'Direction awareness (D198.2)',
      'Revert to alternate if tense (D198.3)'
    ],
    libraryIds: ['sc-harm-min', 'rf-travis-pick-sketch-in-c', 'pr-6251', 'ch-d', 'sg-row-row-row-your-boat'],
    masteryCheck: 'Day 198: Play one position scale with intentional pick direction choices and relaxed hand.',
  },
  199: {
    title: 'Hybrid Picking Taste 18',
    durationMin: 30,
    goals: [
      'Pick bass note (focus: Hybrid Picking Taste 18)',
      'Middle finger snags higher string — day 199 step 2',
      'Chicken-pickin’ light — day 199 step 3'
    ],
    theoryBite: 'Day 199 focus — Hybrid Picking Taste 18: Hybrid picking unlocks country/funk textures and chord-melody helpers.',
    drills: [
      'Open hybrid [Hybrid Picking Taste 18]',
      'Simple pattern (D199.2)',
      'Lick (D199.3)'
    ],
    libraryIds: ['sc-mel-min', 'rf-natural-harmonics-study', 'pr-12bar', 'ch-em', 'sg-fr-re-jacques'],
    masteryCheck: 'Day 199: Play an 8-bar hybrid-picking pattern that stays steady.',
  },
  200: {
    title: 'Motif From a PD Song 19',
    durationMin: 30,
    goals: [
      'Steal 5 notes from a library melody (focus: Motif From a PD Song 19)',
      'Displace rhythm — day 200 step 2',
      'Sequence it — day 200 step 3'
    ],
    theoryBite: 'Day 200 focus — Motif From a PD Song 19: Borrowing from strong melodies teaches taste faster than random fretting.',
    drills: [
      'Extract [Motif From a PD Song 19]',
      'Displace (D200.2)',
      'Develop (D200.3)'
    ],
    libraryIds: ['sc-pent-maj', 'rf-minor-slide-lick-study', 'pr-andalu', 'ch-am', 'sg-london-bridge'],
    masteryCheck: 'Day 200: Build a 8-bar lead idea clearly descended from a known melody contour.',
  },
  201: {
    title: 'Weekly Lead Checkpoint 3',
    durationMin: 30,
    goals: [
      'Motif + bend + space (focus: Weekly Lead Checkpoint 3)',
      'One double stop or octave — day 201 step 2',
      'Story arc over a known form — day 201 step 3'
    ],
    theoryBite: 'Day 201 focus — Weekly Lead Checkpoint 3: Checkpoints assemble techniques into music — the only metric that matters.',
    drills: [
      'Assemble [Weekly Lead Checkpoint 3]',
      'Record (D201.2)',
      'Keep best take (D201.3)'
    ],
    libraryIds: ['sc-pent-min', 'rf-open-am', 'pr-145', 'ch-e', 'sg-this-old-man'],
    masteryCheck: 'Day 201: Record a keepable chorus using motif, expression, and space.',
  },
  202: {
    title: 'Bend Vocabulary — Release & Pre-Bend 21',
    durationMin: 30,
    goals: [
      'Pre-bend then release (focus: Bend Vocabulary)',
      'Bend-release-bend drama — day 202 step 2',
      'Keep intonation honest — day 202 step 3'
    ],
    theoryBite: 'Day 202 focus — Bend Vocabulary — Release & Pre-Bend 21: Pre-bends create vocal sighs. Intonation remains non-negotiable.',
    drills: [
      'Pre-bend [Bend Vocabulary]',
      'Release (D202.2)',
      'Phrase (D202.3)'
    ],
    libraryIds: ['sc-blues', 'rf-power', 'pr-1645', 'ch-a', 'sg-happy-birthday'],
    masteryCheck: 'Day 202: Use two pre-bend releases in tune inside a short phrase.',
  },
  203: {
    title: 'Sequence Climb — Melodic Sequences Up 22',
    durationMin: 35,
    goals: [
      'Sequence a 4-note cell upward (focus: Sequence Climb)',
      'Keep rhythmic identity — day 203 step 2',
      'Stop before it becomes sport only — day 203 step 3'
    ],
    theoryBite: 'Day 203 focus — Sequence Climb — Melodic Sequences Up 22: Sequences are classic development tools from Bach to rock — recognizable motion.',
    drills: [
      'Cell [Sequence Climb]',
      'Climb (D203.2)',
      'Land (D203.3)'
    ],
    libraryIds: ['sc-dorian', 'rf-blues-sh', 'pr-6251', 'ch-f', 'sg-minuet-in-g-bach-public-domain'],
    masteryCheck: 'Day 203: Climb a sequence through a position and land on a chord tone.',
  },
  204: {
    title: 'Question Harmony — Solo Over Andalusian 23',
    durationMin: 30,
    goals: [
      'Note each chord in Am G F E (focus: Question Harmony)',
      'Change color tones on E — day 204 step 2',
      'Keep phrases short — day 204 step 3'
    ],
    theoryBite: 'Day 204 focus — Question Harmony — Solo Over Andalusian 23: Modal progressions teach ear-led targeting under shifting gravity.',
    drills: [
      'Chord tones [Question Harmony]',
      'Short lines (D204.2)',
      'E drama (D204.3)'
    ],
    libraryIds: ['sc-phrygian', 'rf-spider', 'pr-12bar', 'ch-bm', 'sg-f-r-elise-motif-beethoven-public'],
    masteryCheck: 'Day 204: Solo one Andalusian cycle with intentional color on E.',
  },
  205: {
    title: 'Economy Picking Seed 24',
    durationMin: 30,
    goals: [
      'Down when moving to lower string (focus: Economy Picking Seed 24)',
      'Up when moving to higher string if comfortable — day 205 step 2',
      'Prefer clean to dogma — day 205 step 3'
    ],
    theoryBite: 'Day 205 focus — Economy Picking Seed 24: Economy picking is optional efficiency. Tone and time outrank ideology.',
    drills: [
      'Slow scale [Economy Picking Seed 24]',
      'Direction awareness (D205.2)',
      'Revert to alternate if tense (D205.3)'
    ],
    libraryIds: ['sc-lydian', 'rf-caged-c', 'pr-andalu', 'ch-c7', 'sg-canon-in-d-pachelbel-theme-publi'],
    masteryCheck: 'Day 205: Play one position scale with intentional pick direction choices and relaxed hand.',
  },
  206: {
    title: 'Hybrid Picking Taste 25',
    durationMin: 30,
    goals: [
      'Pick bass note (focus: Hybrid Picking Taste 25)',
      'Middle finger snags higher string — day 206 step 2',
      'Chicken-pickin’ light — day 206 step 3'
    ],
    theoryBite: 'Day 206 focus — Hybrid Picking Taste 25: Hybrid picking unlocks country/funk textures and chord-melody helpers.',
    drills: [
      'Open hybrid [Hybrid Picking Taste 25]',
      'Simple pattern (D206.2)',
      'Lick (D206.3)'
    ],
    libraryIds: ['sc-mixo', 'rf-open-g-roll-study', 'pr-145', 'ch-g7', 'sg-brahms-lullaby'],
    masteryCheck: 'Day 206: Play an 8-bar hybrid-picking pattern that stays steady.',
  },
  207: {
    title: 'Motif From a PD Song 26',
    durationMin: 30,
    goals: [
      'Steal 5 notes from a library melody (focus: Motif From a PD Song 26)',
      'Displace rhythm — day 207 step 2',
      'Sequence it — day 207 step 3'
    ],
    theoryBite: 'Day 207 focus — Motif From a PD Song 26: Borrowing from strong melodies teaches taste faster than random fretting.',
    drills: [
      'Extract [Motif From a PD Song 26]',
      'Displace (D207.2)',
      'Develop (D207.3)'
    ],
    libraryIds: ['sc-locrian', 'rf-em-pentatonic-box-study', 'pr-1645', 'ch-d7', 'sg-blue-danube-motif-strauss-public'],
    masteryCheck: 'Day 207: Build a 8-bar lead idea clearly descended from a known melody contour.',
  },
  208: {
    title: 'Weekly Lead Checkpoint 4',
    durationMin: 30,
    goals: [
      'Motif + bend + space (focus: Weekly Lead Checkpoint 4)',
      'One double stop or octave — day 208 step 2',
      'Story arc over a known form — day 208 step 3'
    ],
    theoryBite: 'Day 208 focus — Weekly Lead Checkpoint 4: Checkpoints assemble techniques into music — the only metric that matters.',
    drills: [
      'Assemble [Weekly Lead Checkpoint 4]',
      'Record (D208.2)',
      'Keep best take (D208.3)'
    ],
    libraryIds: ['sc-whole', 'rf-d-folk-pattern-study', 'pr-6251', 'ch-a7', 'sg-william-tell-motif-rossini-publi'],
    masteryCheck: 'Day 208: Record a keepable chorus using motif, expression, and space.',
  },
  209: {
    title: 'Bend Vocabulary — Release & Pre-Bend 28',
    durationMin: 30,
    goals: [
      'Pre-bend then release (focus: Bend Vocabulary)',
      'Bend-release-bend drama — day 209 step 2',
      'Keep intonation honest — day 209 step 3'
    ],
    theoryBite: 'Day 209 focus — Bend Vocabulary — Release & Pre-Bend 28: Pre-bends create vocal sighs. Intonation remains non-negotiable.',
    drills: [
      'Pre-bend [Bend Vocabulary]',
      'Release (D209.2)',
      'Phrase (D209.3)'
    ],
    libraryIds: ['sc-hwh', 'rf-a-blues-turnaround-study', 'pr-12bar', 'ch-e7', 'sg-the-entertainer-motif-joplin-pub'],
    masteryCheck: 'Day 209: Use two pre-bend releases in tune inside a short phrase.',
  },
  210: {
    title: 'Sequence Climb — Melodic Sequences Up 29',
    durationMin: 35,
    goals: [
      'Sequence a 4-note cell upward (focus: Sequence Climb)',
      'Keep rhythmic identity — day 210 step 2',
      'Stop before it becomes sport only — day 210 step 3'
    ],
    theoryBite: 'Day 210 focus — Sequence Climb — Melodic Sequences Up 29: Sequences are classic development tools from Bach to rock — recognizable motion.',
    drills: [
      'Cell [Sequence Climb]',
      'Climb (D210.2)',
      'Land (D210.3)'
    ],
    libraryIds: ['sc-whh', 'rf-g-caged-run-study', 'pr-andalu', 'ch-dm', 'sg-shenandoah'],
    masteryCheck: 'Day 210: Climb a sequence through a position and land on a chord tone.',
  },
  211: {
    title: 'Question Harmony — Solo Over Andalusian 30',
    durationMin: 30,
    goals: [
      'Note each chord in Am G F E (focus: Question Harmony)',
      'Change color tones on E — day 211 step 2',
      'Keep phrases short — day 211 step 3'
    ],
    theoryBite: 'Day 211 focus — Question Harmony — Solo Over Andalusian 30: Modal progressions teach ear-led targeting under shifting gravity.',
    drills: [
      'Chord tones [Question Harmony]',
      'Short lines (D211.2)',
      'E drama (D211.3)'
    ],
    libraryIds: ['sc-major', 'rf-c-bass-walk-study', 'pr-145', 'ch-c', 'sg-red-river-valley'],
    masteryCheck: 'Day 211: Solo one Andalusian cycle with intentional color on E.',
  },
  212: {
    title: 'Economy Picking Seed 31',
    durationMin: 30,
    goals: [
      'Down when moving to lower string (focus: Economy Picking Seed 31)',
      'Up when moving to higher string if comfortable — day 212 step 2',
      'Prefer clean to dogma — day 212 step 3'
    ],
    theoryBite: 'Day 212 focus — Economy Picking Seed 31: Economy picking is optional efficiency. Tone and time outrank ideology.',
    drills: [
      'Slow scale [Economy Picking Seed 31]',
      'Direction awareness (D212.2)',
      'Revert to alternate if tense (D212.3)'
    ],
    libraryIds: ['sc-nat-min', 'rf-spanish-e-phrygian-study', 'pr-1645', 'ch-g', 'sg-home-on-the-range'],
    masteryCheck: 'Day 212: Play one position scale with intentional pick direction choices and relaxed hand.',
  },
  213: {
    title: 'Hybrid Picking Taste 32',
    durationMin: 30,
    goals: [
      'Pick bass note (focus: Hybrid Picking Taste 32)',
      'Middle finger snags higher string — day 213 step 2',
      'Chicken-pickin’ light — day 213 step 3'
    ],
    theoryBite: 'Day 213 focus — Hybrid Picking Taste 32: Hybrid picking unlocks country/funk textures and chord-melody helpers.',
    drills: [
      'Open hybrid [Hybrid Picking Taste 32]',
      'Simple pattern (D213.2)',
      'Lick (D213.3)'
    ],
    libraryIds: ['sc-harm-min', 'rf-funk-chicka-study', 'pr-6251', 'ch-d', 'sg-turkey-in-the-straw'],
    masteryCheck: 'Day 213: Play an 8-bar hybrid-picking pattern that stays steady.',
  },
  214: {
    title: 'Motif From a PD Song 33',
    durationMin: 30,
    goals: [
      'Steal 5 notes from a library melody (focus: Motif From a PD Song 33)',
      'Displace rhythm — day 214 step 2',
      'Sequence it — day 214 step 3'
    ],
    theoryBite: 'Day 214 focus — Motif From a PD Song 33: Borrowing from strong melodies teaches taste faster than random fretting.',
    drills: [
      'Extract [Motif From a PD Song 33]',
      'Displace (D214.2)',
      'Develop (D214.3)'
    ],
    libraryIds: ['sc-mel-min', 'rf-palm-mute-chug-study', 'pr-12bar', 'ch-em', 'sg-arkansas-traveler'],
    masteryCheck: 'Day 214: Build a 8-bar lead idea clearly descended from a known melody contour.',
  },
  215: {
    title: 'Weekly Lead Checkpoint 5',
    durationMin: 30,
    goals: [
      'Motif + bend + space (focus: Weekly Lead Checkpoint 5)',
      'One double stop or octave — day 215 step 2',
      'Story arc over a known form — day 215 step 3'
    ],
    theoryBite: 'Day 215 focus — Weekly Lead Checkpoint 5: Checkpoints assemble techniques into music — the only metric that matters.',
    drills: [
      'Assemble [Weekly Lead Checkpoint 5]',
      'Record (D215.2)',
      'Keep best take (D215.3)'
    ],
    libraryIds: ['sc-pent-maj', 'rf-jazz-chromatic-approach-study', 'pr-andalu', 'ch-am', 'sg-sailor-s-hornpipe'],
    masteryCheck: 'Day 215: Record a keepable chorus using motif, expression, and space.',
  },
  216: {
    title: 'Bend Vocabulary — Release & Pre-Bend 35',
    durationMin: 30,
    goals: [
      'Pre-bend then release (focus: Bend Vocabulary)',
      'Bend-release-bend drama — day 216 step 2',
      'Keep intonation honest — day 216 step 3'
    ],
    theoryBite: 'Day 216 focus — Bend Vocabulary — Release & Pre-Bend 35: Pre-bends create vocal sighs. Intonation remains non-negotiable.',
    drills: [
      'Pre-bend [Bend Vocabulary]',
      'Release (D216.2)',
      'Phrase (D216.3)'
    ],
    libraryIds: ['sc-pent-min', 'rf-am-arpeggio-cascade', 'pr-145', 'ch-e', 'sg-drunken-sailor'],
    masteryCheck: 'Day 216: Use two pre-bend releases in tune inside a short phrase.',
  },
  217: {
    title: 'Sequence Climb — Melodic Sequences Up 36',
    durationMin: 35,
    goals: [
      'Sequence a 4-note cell upward (focus: Sequence Climb)',
      'Keep rhythmic identity — day 217 step 2',
      'Stop before it becomes sport only — day 217 step 3'
    ],
    theoryBite: 'Day 217 focus — Sequence Climb — Melodic Sequences Up 36: Sequences are classic development tools from Bach to rock — recognizable motion.',
    drills: [
      'Cell [Sequence Climb]',
      'Climb (D217.2)',
      'Land (D217.3)'
    ],
    libraryIds: ['sc-blues', 'rf-drop-d-power-study', 'pr-1645', 'ch-a', 'sg-molly-malone'],
    masteryCheck: 'Day 217: Climb a sequence through a position and land on a chord tone.',
  },
  218: {
    title: 'Question Harmony — Solo Over Andalusian 37',
    durationMin: 30,
    goals: [
      'Note each chord in Am G F E (focus: Question Harmony)',
      'Change color tones on E — day 218 step 2',
      'Keep phrases short — day 218 step 3'
    ],
    theoryBite: 'Day 218 focus — Question Harmony — Solo Over Andalusian 37: Modal progressions teach ear-led targeting under shifting gravity.',
    drills: [
      'Chord tones [Question Harmony]',
      'Short lines (D218.2)',
      'E drama (D218.3)'
    ],
    libraryIds: ['sc-dorian', 'rf-travis-pick-sketch-in-c', 'pr-6251', 'ch-f', 'sg-the-parting-glass'],
    masteryCheck: 'Day 218: Solo one Andalusian cycle with intentional color on E.',
  },
  219: {
    title: 'Economy Picking Seed 38',
    durationMin: 30,
    goals: [
      'Down when moving to lower string (focus: Economy Picking Seed 38)',
      'Up when moving to higher string if comfortable — day 219 step 2',
      'Prefer clean to dogma — day 219 step 3'
    ],
    theoryBite: 'Day 219 focus — Economy Picking Seed 38: Economy picking is optional efficiency. Tone and time outrank ideology.',
    drills: [
      'Slow scale [Economy Picking Seed 38]',
      'Direction awareness (D219.2)',
      'Revert to alternate if tense (D219.3)'
    ],
    libraryIds: ['sc-phrygian', 'rf-natural-harmonics-study', 'pr-12bar', 'ch-bm', 'sg-simple-gifts'],
    masteryCheck: 'Day 219: Play one position scale with intentional pick direction choices and relaxed hand.',
  },
  220: {
    title: 'Hybrid Picking Taste 39',
    durationMin: 30,
    goals: [
      'Pick bass note (focus: Hybrid Picking Taste 39)',
      'Middle finger snags higher string — day 220 step 2',
      'Chicken-pickin’ light — day 220 step 3'
    ],
    theoryBite: 'Day 220 focus — Hybrid Picking Taste 39: Hybrid picking unlocks country/funk textures and chord-melody helpers.',
    drills: [
      'Open hybrid [Hybrid Picking Taste 39]',
      'Simple pattern (D220.2)',
      'Lick (D220.3)'
    ],
    libraryIds: ['sc-lydian', 'rf-minor-slide-lick-study', 'pr-andalu', 'ch-c7', 'sg-wayfaring-stranger'],
    masteryCheck: 'Day 220: Play an 8-bar hybrid-picking pattern that stays steady.',
  },
  221: {
    title: 'Motif From a PD Song 40',
    durationMin: 30,
    goals: [
      'Steal 5 notes from a library melody (focus: Motif From a PD Song 40)',
      'Displace rhythm — day 221 step 2',
      'Sequence it — day 221 step 3'
    ],
    theoryBite: 'Day 221 focus — Motif From a PD Song 40: Borrowing from strong melodies teaches taste faster than random fretting.',
    drills: [
      'Extract [Motif From a PD Song 40]',
      'Displace (D221.2)',
      'Develop (D221.3)'
    ],
    libraryIds: ['sc-mixo', 'rf-open-am', 'pr-145', 'ch-g7', 'sg-barbara-allen'],
    masteryCheck: 'Day 221: Build a 8-bar lead idea clearly descended from a known melody contour.',
  },
  222: {
    title: 'Weekly Lead Checkpoint 6',
    durationMin: 30,
    goals: [
      'Motif + bend + space (focus: Weekly Lead Checkpoint 6)',
      'One double stop or octave — day 222 step 2',
      'Story arc over a known form — day 222 step 3'
    ],
    theoryBite: 'Day 222 focus — Weekly Lead Checkpoint 6: Checkpoints assemble techniques into music — the only metric that matters.',
    drills: [
      'Assemble [Weekly Lead Checkpoint 6]',
      'Record (D222.2)',
      'Keep best take (D222.3)'
    ],
    libraryIds: ['sc-locrian', 'rf-power', 'pr-1645', 'ch-d7', 'sg-down-by-the-riverside'],
    masteryCheck: 'Day 222: Record a keepable chorus using motif, expression, and space.',
  },
  223: {
    title: 'Bend Vocabulary — Release & Pre-Bend 42',
    durationMin: 30,
    goals: [
      'Pre-bend then release (focus: Bend Vocabulary)',
      'Bend-release-bend drama — day 223 step 2',
      'Keep intonation honest — day 223 step 3'
    ],
    theoryBite: 'Day 223 focus — Bend Vocabulary — Release & Pre-Bend 42: Pre-bends create vocal sighs. Intonation remains non-negotiable.',
    drills: [
      'Pre-bend [Bend Vocabulary]',
      'Release (D223.2)',
      'Phrase (D223.3)'
    ],
    libraryIds: ['sc-whole', 'rf-blues-sh', 'pr-6251', 'ch-a7', 'sg-skip-to-my-lou'],
    masteryCheck: 'Day 223: Use two pre-bend releases in tune inside a short phrase.',
  },
  224: {
    title: 'Sequence Climb — Melodic Sequences Up 43',
    durationMin: 35,
    goals: [
      'Sequence a 4-note cell upward (focus: Sequence Climb)',
      'Keep rhythmic identity — day 224 step 2',
      'Stop before it becomes sport only — day 224 step 3'
    ],
    theoryBite: 'Day 224 focus — Sequence Climb — Melodic Sequences Up 43: Sequences are classic development tools from Bach to rock — recognizable motion.',
    drills: [
      'Cell [Sequence Climb]',
      'Climb (D224.2)',
      'Land (D224.3)'
    ],
    libraryIds: ['sc-hwh', 'rf-spider', 'pr-12bar', 'ch-e7', 'sg-i-ve-been-working-on-the-railroa'],
    masteryCheck: 'Day 224: Climb a sequence through a position and land on a chord tone.',
  },
  225: {
    title: 'Question Harmony — Solo Over Andalusian 44',
    durationMin: 30,
    goals: [
      'Note each chord in Am G F E (focus: Question Harmony)',
      'Change color tones on E — day 225 step 2',
      'Keep phrases short — day 225 step 3'
    ],
    theoryBite: 'Day 225 focus — Question Harmony — Solo Over Andalusian 44: Modal progressions teach ear-led targeting under shifting gravity.',
    drills: [
      'Chord tones [Question Harmony]',
      'Short lines (D225.2)',
      'E drama (D225.3)'
    ],
    libraryIds: ['sc-whh', 'rf-caged-c', 'pr-andalu', 'ch-dm', 'sg-she-ll-be-coming-round-the-mount'],
    masteryCheck: 'Day 225: Solo one Andalusian cycle with intentional color on E.',
  },
  226: {
    title: 'Economy Picking Seed 45',
    durationMin: 30,
    goals: [
      'Down when moving to lower string (focus: Economy Picking Seed 45)',
      'Up when moving to higher string if comfortable — day 226 step 2',
      'Prefer clean to dogma — day 226 step 3'
    ],
    theoryBite: 'Day 226 focus — Economy Picking Seed 45: Economy picking is optional efficiency. Tone and time outrank ideology.',
    drills: [
      'Slow scale [Economy Picking Seed 45]',
      'Direction awareness (D226.2)',
      'Revert to alternate if tense (D226.3)'
    ],
    libraryIds: ['sc-major', 'rf-open-g-roll-study', 'pr-145', 'ch-c', 'sg-house-of-the-rising-sun'],
    masteryCheck: 'Day 226: Play one position scale with intentional pick direction choices and relaxed hand.',
  },
  227: {
    title: 'Hybrid Picking Taste 46',
    durationMin: 30,
    goals: [
      'Pick bass note (focus: Hybrid Picking Taste 46)',
      'Middle finger snags higher string — day 227 step 2',
      'Chicken-pickin’ light — day 227 step 3'
    ],
    theoryBite: 'Day 227 focus — Hybrid Picking Taste 46: Hybrid picking unlocks country/funk textures and chord-melody helpers.',
    drills: [
      'Open hybrid [Hybrid Picking Taste 46]',
      'Simple pattern (D227.2)',
      'Lick (D227.3)'
    ],
    libraryIds: ['sc-nat-min', 'rf-em-pentatonic-box-study', 'pr-1645', 'ch-g', 'sg-black-is-the-color'],
    masteryCheck: 'Day 227: Play an 8-bar hybrid-picking pattern that stays steady.',
  },
  228: {
    title: 'Motif From a PD Song 47',
    durationMin: 30,
    goals: [
      'Steal 5 notes from a library melody (focus: Motif From a PD Song 47)',
      'Displace rhythm — day 228 step 2',
      'Sequence it — day 228 step 3'
    ],
    theoryBite: 'Day 228 focus — Motif From a PD Song 47: Borrowing from strong melodies teaches taste faster than random fretting.',
    drills: [
      'Extract [Motif From a PD Song 47]',
      'Displace (D228.2)',
      'Develop (D228.3)'
    ],
    libraryIds: ['sc-harm-min', 'rf-d-folk-pattern-study', 'pr-6251', 'ch-d', 'sg-wild-mountain-thyme'],
    masteryCheck: 'Day 228: Build a 8-bar lead idea clearly descended from a known melody contour.',
  },
  229: {
    title: 'Weekly Lead Checkpoint 7',
    durationMin: 30,
    goals: [
      'Motif + bend + space (focus: Weekly Lead Checkpoint 7)',
      'One double stop or octave — day 229 step 2',
      'Story arc over a known form — day 229 step 3'
    ],
    theoryBite: 'Day 229 focus — Weekly Lead Checkpoint 7: Checkpoints assemble techniques into music — the only metric that matters.',
    drills: [
      'Assemble [Weekly Lead Checkpoint 7]',
      'Record (D229.2)',
      'Keep best take (D229.3)'
    ],
    libraryIds: ['sc-mel-min', 'rf-a-blues-turnaround-study', 'pr-12bar', 'ch-em', 'sg-go-tell-aunt-rhody'],
    masteryCheck: 'Day 229: Record a keepable chorus using motif, expression, and space.',
  },
  230: {
    title: 'Bend Vocabulary — Release & Pre-Bend 49',
    durationMin: 30,
    goals: [
      'Pre-bend then release (focus: Bend Vocabulary)',
      'Bend-release-bend drama — day 230 step 2',
      'Keep intonation honest — day 230 step 3'
    ],
    theoryBite: 'Day 230 focus — Bend Vocabulary — Release & Pre-Bend 49: Pre-bends create vocal sighs. Intonation remains non-negotiable.',
    drills: [
      'Pre-bend [Bend Vocabulary]',
      'Release (D230.2)',
      'Phrase (D230.3)'
    ],
    libraryIds: ['sc-pent-maj', 'rf-g-caged-run-study', 'pr-andalu', 'ch-am', 'sg-buffalo-gals'],
    masteryCheck: 'Day 230: Use two pre-bend releases in tune inside a short phrase.',
  },
  231: {
    title: 'Sequence Climb — Melodic Sequences Up 50',
    durationMin: 35,
    goals: [
      'Sequence a 4-note cell upward (focus: Sequence Climb)',
      'Keep rhythmic identity — day 231 step 2',
      'Stop before it becomes sport only — day 231 step 3'
    ],
    theoryBite: 'Day 231 focus — Sequence Climb — Melodic Sequences Up 50: Sequences are classic development tools from Bach to rock — recognizable motion.',
    drills: [
      'Cell [Sequence Climb]',
      'Climb (D231.2)',
      'Land (D231.3)'
    ],
    libraryIds: ['sc-pent-min', 'rf-c-bass-walk-study', 'pr-145', 'ch-e', 'sg-joshua-fit-the-battle-of-jericho'],
    masteryCheck: 'Day 231: Climb a sequence through a position and land on a chord tone.',
  },
  232: {
    title: 'Question Harmony — Solo Over Andalusian 51',
    durationMin: 30,
    goals: [
      'Note each chord in Am G F E (focus: Question Harmony)',
      'Change color tones on E — day 232 step 2',
      'Keep phrases short — day 232 step 3'
    ],
    theoryBite: 'Day 232 focus — Question Harmony — Solo Over Andalusian 51: Modal progressions teach ear-led targeting under shifting gravity.',
    drills: [
      'Chord tones [Question Harmony]',
      'Short lines (D232.2)',
      'E drama (D232.3)'
    ],
    libraryIds: ['sc-blues', 'rf-spanish-e-phrygian-study', 'pr-1645', 'ch-a', 'sg-the-streets-of-laredo'],
    masteryCheck: 'Day 232: Solo one Andalusian cycle with intentional color on E.',
  },
  233: {
    title: 'Economy Picking Seed 52',
    durationMin: 30,
    goals: [
      'Down when moving to lower string (focus: Economy Picking Seed 52)',
      'Up when moving to higher string if comfortable — day 233 step 2',
      'Prefer clean to dogma — day 233 step 3'
    ],
    theoryBite: 'Day 233 focus — Economy Picking Seed 52: Economy picking is optional efficiency. Tone and time outrank ideology.',
    drills: [
      'Slow scale [Economy Picking Seed 52]',
      'Direction awareness (D233.2)',
      'Revert to alternate if tense (D233.3)'
    ],
    libraryIds: ['sc-dorian', 'rf-funk-chicka-study', 'pr-6251', 'ch-f', 'sg-careless-love'],
    masteryCheck: 'Day 233: Play one position scale with intentional pick direction choices and relaxed hand.',
  },
  234: {
    title: 'Hybrid Picking Taste 53',
    durationMin: 30,
    goals: [
      'Pick bass note (focus: Hybrid Picking Taste 53)',
      'Middle finger snags higher string — day 234 step 2',
      'Chicken-pickin’ light — day 234 step 3'
    ],
    theoryBite: 'Day 234 focus — Hybrid Picking Taste 53: Hybrid picking unlocks country/funk textures and chord-melody helpers.',
    drills: [
      'Open hybrid [Hybrid Picking Taste 53]',
      'Simple pattern (D234.2)',
      'Lick (D234.3)'
    ],
    libraryIds: ['sc-phrygian', 'rf-palm-mute-chug-study', 'pr-12bar', 'ch-bm', 'sg-st-louis-blues-motif-handy-1914-'],
    masteryCheck: 'Day 234: Play an 8-bar hybrid-picking pattern that stays steady.',
  },
  235: {
    title: 'Motif From a PD Song 54',
    durationMin: 30,
    goals: [
      'Steal 5 notes from a library melody (focus: Motif From a PD Song 54)',
      'Displace rhythm — day 235 step 2',
      'Sequence it — day 235 step 3'
    ],
    theoryBite: 'Day 235 focus — Motif From a PD Song 54: Borrowing from strong melodies teaches taste faster than random fretting.',
    drills: [
      'Extract [Motif From a PD Song 54]',
      'Displace (D235.2)',
      'Develop (D235.3)'
    ],
    libraryIds: ['sc-lydian', 'rf-jazz-chromatic-approach-study', 'pr-andalu', 'ch-c7', 'sg-maple-leaf-rag-motif-joplin-publ'],
    masteryCheck: 'Day 235: Build a 8-bar lead idea clearly descended from a known melody contour.',
  },
  236: {
    title: 'Weekly Lead Checkpoint 8',
    durationMin: 30,
    goals: [
      'Motif + bend + space (focus: Weekly Lead Checkpoint 8)',
      'One double stop or octave — day 236 step 2',
      'Story arc over a known form — day 236 step 3'
    ],
    theoryBite: 'Day 236 focus — Weekly Lead Checkpoint 8: Checkpoints assemble techniques into music — the only metric that matters.',
    drills: [
      'Assemble [Weekly Lead Checkpoint 8]',
      'Record (D236.2)',
      'Keep best take (D236.3)'
    ],
    libraryIds: ['sc-mixo', 'rf-am-arpeggio-cascade', 'pr-145', 'ch-g7', 'sg-morning-mood-motif-grieg-public-'],
    masteryCheck: 'Day 236: Record a keepable chorus using motif, expression, and space.',
  },
  237: {
    title: 'Bend Vocabulary — Release & Pre-Bend 56',
    durationMin: 30,
    goals: [
      'Pre-bend then release (focus: Bend Vocabulary)',
      'Bend-release-bend drama — day 237 step 2',
      'Keep intonation honest — day 237 step 3'
    ],
    theoryBite: 'Day 237 focus — Bend Vocabulary — Release & Pre-Bend 56: Pre-bends create vocal sighs. Intonation remains non-negotiable.',
    drills: [
      'Pre-bend [Bend Vocabulary]',
      'Release (D237.2)',
      'Phrase (D237.3)'
    ],
    libraryIds: ['sc-locrian', 'rf-drop-d-power-study', 'pr-1645', 'ch-d7', 'sg-twinkle'],
    masteryCheck: 'Day 237: Use two pre-bend releases in tune inside a short phrase.',
  },
  238: {
    title: 'Sequence Climb — Melodic Sequences Up 57',
    durationMin: 35,
    goals: [
      'Sequence a 4-note cell upward (focus: Sequence Climb)',
      'Keep rhythmic identity — day 238 step 2',
      'Stop before it becomes sport only — day 238 step 3'
    ],
    theoryBite: 'Day 238 focus — Sequence Climb — Melodic Sequences Up 57: Sequences are classic development tools from Bach to rock — recognizable motion.',
    drills: [
      'Cell [Sequence Climb]',
      'Climb (D238.2)',
      'Land (D238.3)'
    ],
    libraryIds: ['sc-whole', 'rf-travis-pick-sketch-in-c', 'pr-6251', 'ch-a7', 'sg-ode'],
    masteryCheck: 'Day 238: Climb a sequence through a position and land on a chord tone.',
  },
  239: {
    title: 'Question Harmony — Solo Over Andalusian 58',
    durationMin: 30,
    goals: [
      'Note each chord in Am G F E (focus: Question Harmony)',
      'Change color tones on E — day 239 step 2',
      'Keep phrases short — day 239 step 3'
    ],
    theoryBite: 'Day 239 focus — Question Harmony — Solo Over Andalusian 58: Modal progressions teach ear-led targeting under shifting gravity.',
    drills: [
      'Chord tones [Question Harmony]',
      'Short lines (D239.2)',
      'E drama (D239.3)'
    ],
    libraryIds: ['sc-hwh', 'rf-natural-harmonics-study', 'pr-12bar', 'ch-e7', 'sg-drums'],
    masteryCheck: 'Day 239: Solo one Andalusian cycle with intentional color on E.',
  },
  240: {
    title: 'Economy Picking Seed 59',
    durationMin: 30,
    goals: [
      'Down when moving to lower string (focus: Economy Picking Seed 59)',
      'Up when moving to higher string if comfortable — day 240 step 2',
      'Prefer clean to dogma — day 240 step 3'
    ],
    theoryBite: 'Day 240 focus — Economy Picking Seed 59: Economy picking is optional efficiency. Tone and time outrank ideology.',
    drills: [
      'Slow scale [Economy Picking Seed 59]',
      'Direction awareness (D240.2)',
      'Revert to alternate if tense (D240.3)'
    ],
    libraryIds: ['sc-whh', 'rf-minor-slide-lick-study', 'pr-andalu', 'ch-dm', 'sg-amazing-grace'],
    masteryCheck: 'Day 240: Play one position scale with intentional pick direction choices and relaxed hand.',
  },
  241: {
    title: 'Hybrid Picking Taste 60',
    durationMin: 30,
    goals: [
      'Pick bass note (focus: Hybrid Picking Taste 60)',
      'Middle finger snags higher string — day 241 step 2',
      'Chicken-pickin’ light — day 241 step 3'
    ],
    theoryBite: 'Day 241 focus — Hybrid Picking Taste 60: Hybrid picking unlocks country/funk textures and chord-melody helpers.',
    drills: [
      'Open hybrid [Hybrid Picking Taste 60]',
      'Simple pattern (D241.2)',
      'Lick (D241.3)'
    ],
    libraryIds: ['sc-major', 'rf-open-am', 'pr-145', 'ch-c', 'sg-greensleeves'],
    masteryCheck: 'Day 241: Play an 8-bar hybrid-picking pattern that stays steady.',
  },
  242: {
    title: 'Motif From a PD Song 61',
    durationMin: 30,
    goals: [
      'Steal 5 notes from a library melody (focus: Motif From a PD Song 61)',
      'Displace rhythm — day 242 step 2',
      'Sequence it — day 242 step 3'
    ],
    theoryBite: 'Day 242 focus — Motif From a PD Song 61: Borrowing from strong melodies teaches taste faster than random fretting.',
    drills: [
      'Extract [Motif From a PD Song 61]',
      'Displace (D242.2)',
      'Develop (D242.3)'
    ],
    libraryIds: ['sc-nat-min', 'rf-power', 'pr-1645', 'ch-g', 'sg-scarborough-fair'],
    masteryCheck: 'Day 242: Build a 8-bar lead idea clearly descended from a known melody contour.',
  },
  243: {
    title: 'Weekly Lead Checkpoint 9',
    durationMin: 30,
    goals: [
      'Motif + bend + space (focus: Weekly Lead Checkpoint 9)',
      'One double stop or octave — day 243 step 2',
      'Story arc over a known form — day 243 step 3'
    ],
    theoryBite: 'Day 243 focus — Weekly Lead Checkpoint 9: Checkpoints assemble techniques into music — the only metric that matters.',
    drills: [
      'Assemble [Weekly Lead Checkpoint 9]',
      'Record (D243.2)',
      'Keep best take (D243.3)'
    ],
    libraryIds: ['sc-harm-min', 'rf-blues-sh', 'pr-6251', 'ch-d', 'sg-aura-lee'],
    masteryCheck: 'Day 243: Record a keepable chorus using motif, expression, and space.',
  },
  244: {
    title: 'Bend Vocabulary — Release & Pre-Bend 63',
    durationMin: 30,
    goals: [
      'Pre-bend then release (focus: Bend Vocabulary)',
      'Bend-release-bend drama — day 244 step 2',
      'Keep intonation honest — day 244 step 3'
    ],
    theoryBite: 'Day 244 focus — Bend Vocabulary — Release & Pre-Bend 63: Pre-bends create vocal sighs. Intonation remains non-negotiable.',
    drills: [
      'Pre-bend [Bend Vocabulary]',
      'Release (D244.2)',
      'Phrase (D244.3)'
    ],
    libraryIds: ['sc-mel-min', 'rf-spider', 'pr-12bar', 'ch-em', 'sg-oh-susanna'],
    masteryCheck: 'Day 244: Use two pre-bend releases in tune inside a short phrase.',
  },
  245: {
    title: 'Sequence Climb — Melodic Sequences Up 64',
    durationMin: 35,
    goals: [
      'Sequence a 4-note cell upward (focus: Sequence Climb)',
      'Keep rhythmic identity — day 245 step 2',
      'Stop before it becomes sport only — day 245 step 3'
    ],
    theoryBite: 'Day 245 focus — Sequence Climb — Melodic Sequences Up 64: Sequences are classic development tools from Bach to rock — recognizable motion.',
    drills: [
      'Cell [Sequence Climb]',
      'Climb (D245.2)',
      'Land (D245.3)'
    ],
    libraryIds: ['sc-pent-maj', 'rf-caged-c', 'pr-andalu', 'ch-am', 'sg-camptown-races'],
    masteryCheck: 'Day 245: Climb a sequence through a position and land on a chord tone.',
  },
  246: {
    title: 'Question Harmony — Solo Over Andalusian 65',
    durationMin: 30,
    goals: [
      'Note each chord in Am G F E (focus: Question Harmony)',
      'Change color tones on E — day 246 step 2',
      'Keep phrases short — day 246 step 3'
    ],
    theoryBite: 'Day 246 focus — Question Harmony — Solo Over Andalusian 65: Modal progressions teach ear-led targeting under shifting gravity.',
    drills: [
      'Chord tones [Question Harmony]',
      'Short lines (D246.2)',
      'E drama (D246.3)'
    ],
    libraryIds: ['sc-pent-min', 'rf-open-g-roll-study', 'pr-145', 'ch-e', 'sg-when-the-saints-go-marching-in'],
    masteryCheck: 'Day 246: Solo one Andalusian cycle with intentional color on E.',
  },
  247: {
    title: 'Economy Picking Seed 66',
    durationMin: 30,
    goals: [
      'Down when moving to lower string (focus: Economy Picking Seed 66)',
      'Up when moving to higher string if comfortable — day 247 step 2',
      'Prefer clean to dogma — day 247 step 3'
    ],
    theoryBite: 'Day 247 focus — Economy Picking Seed 66: Economy picking is optional efficiency. Tone and time outrank ideology.',
    drills: [
      'Slow scale [Economy Picking Seed 66]',
      'Direction awareness (D247.2)',
      'Revert to alternate if tense (D247.3)'
    ],
    libraryIds: ['sc-blues', 'rf-em-pentatonic-box-study', 'pr-1645', 'ch-a', 'sg-danny-boy-londonderry-air'],
    masteryCheck: 'Day 247: Play one position scale with intentional pick direction choices and relaxed hand.',
  },
  248: {
    title: 'Hybrid Picking Taste 67',
    durationMin: 30,
    goals: [
      'Pick bass note (focus: Hybrid Picking Taste 67)',
      'Middle finger snags higher string — day 248 step 2',
      'Chicken-pickin’ light — day 248 step 3'
    ],
    theoryBite: 'Day 248 focus — Hybrid Picking Taste 67: Hybrid picking unlocks country/funk textures and chord-melody helpers.',
    drills: [
      'Open hybrid [Hybrid Picking Taste 67]',
      'Simple pattern (D248.2)',
      'Lick (D248.3)'
    ],
    libraryIds: ['sc-dorian', 'rf-d-folk-pattern-study', 'pr-6251', 'ch-f', 'sg-silent-night'],
    masteryCheck: 'Day 248: Play an 8-bar hybrid-picking pattern that stays steady.',
  },
  249: {
    title: 'Motif From a PD Song 68',
    durationMin: 30,
    goals: [
      'Steal 5 notes from a library melody (focus: Motif From a PD Song 68)',
      'Displace rhythm — day 249 step 2',
      'Sequence it — day 249 step 3'
    ],
    theoryBite: 'Day 249 focus — Motif From a PD Song 68: Borrowing from strong melodies teaches taste faster than random fretting.',
    drills: [
      'Extract [Motif From a PD Song 68]',
      'Displace (D249.2)',
      'Develop (D249.3)'
    ],
    libraryIds: ['sc-phrygian', 'rf-a-blues-turnaround-study', 'pr-12bar', 'ch-bm', 'sg-jingle-bells'],
    masteryCheck: 'Day 249: Build a 8-bar lead idea clearly descended from a known melody contour.',
  },
  250: {
    title: 'Weekly Lead Checkpoint 10',
    durationMin: 30,
    goals: [
      'Motif + bend + space (focus: Weekly Lead Checkpoint 10)',
      'One double stop or octave — day 250 step 2',
      'Story arc over a known form — day 250 step 3'
    ],
    theoryBite: 'Day 250 focus — Weekly Lead Checkpoint 10: Checkpoints assemble techniques into music — the only metric that matters.',
    drills: [
      'Assemble [Weekly Lead Checkpoint 10]',
      'Record (D250.2)',
      'Keep best take (D250.3)'
    ],
    libraryIds: ['sc-lydian', 'rf-g-caged-run-study', 'pr-andalu', 'ch-c7', 'sg-joy-to-the-world'],
    masteryCheck: 'Day 250: Record a keepable chorus using motif, expression, and space.',
  },
  251: {
    title: 'Bend Vocabulary — Release & Pre-Bend 70',
    durationMin: 30,
    goals: [
      'Pre-bend then release (focus: Bend Vocabulary)',
      'Bend-release-bend drama — day 251 step 2',
      'Keep intonation honest — day 251 step 3'
    ],
    theoryBite: 'Day 251 focus — Bend Vocabulary — Release & Pre-Bend 70: Pre-bends create vocal sighs. Intonation remains non-negotiable.',
    drills: [
      'Pre-bend [Bend Vocabulary]',
      'Release (D251.2)',
      'Phrase (D251.3)'
    ],
    libraryIds: ['sc-mixo', 'rf-c-bass-walk-study', 'pr-145', 'ch-g7', 'sg-auld-lang-syne'],
    masteryCheck: 'Day 251: Use two pre-bend releases in tune inside a short phrase.',
  },
  252: {
    title: 'Sequence Climb — Melodic Sequences Up 71',
    durationMin: 35,
    goals: [
      'Sequence a 4-note cell upward (focus: Sequence Climb)',
      'Keep rhythmic identity — day 252 step 2',
      'Stop before it becomes sport only — day 252 step 3'
    ],
    theoryBite: 'Day 252 focus — Sequence Climb — Melodic Sequences Up 71: Sequences are classic development tools from Bach to rock — recognizable motion.',
    drills: [
      'Cell [Sequence Climb]',
      'Climb (D252.2)',
      'Land (D252.3)'
    ],
    libraryIds: ['sc-locrian', 'rf-spanish-e-phrygian-study', 'pr-1645', 'ch-d7', 'sg-swing-low-sweet-chariot'],
    masteryCheck: 'Day 252: Climb a sequence through a position and land on a chord tone.',
  },
  253: {
    title: 'Question Harmony — Solo Over Andalusian 72',
    durationMin: 30,
    goals: [
      'Note each chord in Am G F E (focus: Question Harmony)',
      'Change color tones on E — day 253 step 2',
      'Keep phrases short — day 253 step 3'
    ],
    theoryBite: 'Day 253 focus — Question Harmony — Solo Over Andalusian 72: Modal progressions teach ear-led targeting under shifting gravity.',
    drills: [
      'Chord tones [Question Harmony]',
      'Short lines (D253.2)',
      'E drama (D253.3)'
    ],
    libraryIds: ['sc-whole', 'rf-funk-chicka-study', 'pr-6251', 'ch-a7', 'sg-mary-had-a-little-lamb'],
    masteryCheck: 'Day 253: Solo one Andalusian cycle with intentional color on E.',
  },
  254: {
    title: 'Economy Picking Seed 73',
    durationMin: 30,
    goals: [
      'Down when moving to lower string (focus: Economy Picking Seed 73)',
      'Up when moving to higher string if comfortable — day 254 step 2',
      'Prefer clean to dogma — day 254 step 3'
    ],
    theoryBite: 'Day 254 focus — Economy Picking Seed 73: Economy picking is optional efficiency. Tone and time outrank ideology.',
    drills: [
      'Slow scale [Economy Picking Seed 73]',
      'Direction awareness (D254.2)',
      'Revert to alternate if tense (D254.3)'
    ],
    libraryIds: ['sc-hwh', 'rf-palm-mute-chug-study', 'pr-12bar', 'ch-e7', 'sg-row-row-row-your-boat'],
    masteryCheck: 'Day 254: Play one position scale with intentional pick direction choices and relaxed hand.',
  },
  255: {
    title: 'Hybrid Picking Taste 74',
    durationMin: 30,
    goals: [
      'Pick bass note (focus: Hybrid Picking Taste 74)',
      'Middle finger snags higher string — day 255 step 2',
      'Chicken-pickin’ light — day 255 step 3'
    ],
    theoryBite: 'Day 255 focus — Hybrid Picking Taste 74: Hybrid picking unlocks country/funk textures and chord-melody helpers.',
    drills: [
      'Open hybrid [Hybrid Picking Taste 74]',
      'Simple pattern (D255.2)',
      'Lick (D255.3)'
    ],
    libraryIds: ['sc-whh', 'rf-jazz-chromatic-approach-study', 'pr-andalu', 'ch-dm', 'sg-fr-re-jacques'],
    masteryCheck: 'Day 255: Play an 8-bar hybrid-picking pattern that stays steady.',
  },
  256: {
    title: 'Motif From a PD Song 75',
    durationMin: 30,
    goals: [
      'Steal 5 notes from a library melody (focus: Motif From a PD Song 75)',
      'Displace rhythm — day 256 step 2',
      'Sequence it — day 256 step 3'
    ],
    theoryBite: 'Day 256 focus — Motif From a PD Song 75: Borrowing from strong melodies teaches taste faster than random fretting.',
    drills: [
      'Extract [Motif From a PD Song 75]',
      'Displace (D256.2)',
      'Develop (D256.3)'
    ],
    libraryIds: ['sc-major', 'rf-am-arpeggio-cascade', 'pr-145', 'ch-c', 'sg-london-bridge'],
    masteryCheck: 'Day 256: Build a 8-bar lead idea clearly descended from a known melody contour.',
  },
  257: {
    title: 'Weekly Lead Checkpoint 11',
    durationMin: 30,
    goals: [
      'Motif + bend + space (focus: Weekly Lead Checkpoint 11)',
      'One double stop or octave — day 257 step 2',
      'Story arc over a known form — day 257 step 3'
    ],
    theoryBite: 'Day 257 focus — Weekly Lead Checkpoint 11: Checkpoints assemble techniques into music — the only metric that matters.',
    drills: [
      'Assemble [Weekly Lead Checkpoint 11]',
      'Record (D257.2)',
      'Keep best take (D257.3)'
    ],
    libraryIds: ['sc-nat-min', 'rf-drop-d-power-study', 'pr-1645', 'ch-g', 'sg-this-old-man'],
    masteryCheck: 'Day 257: Record a keepable chorus using motif, expression, and space.',
  },
  258: {
    title: 'Bend Vocabulary — Release & Pre-Bend 77',
    durationMin: 30,
    goals: [
      'Pre-bend then release (focus: Bend Vocabulary)',
      'Bend-release-bend drama — day 258 step 2',
      'Keep intonation honest — day 258 step 3'
    ],
    theoryBite: 'Day 258 focus — Bend Vocabulary — Release & Pre-Bend 77: Pre-bends create vocal sighs. Intonation remains non-negotiable.',
    drills: [
      'Pre-bend [Bend Vocabulary]',
      'Release (D258.2)',
      'Phrase (D258.3)'
    ],
    libraryIds: ['sc-harm-min', 'rf-travis-pick-sketch-in-c', 'pr-6251', 'ch-d', 'sg-happy-birthday'],
    masteryCheck: 'Day 258: Use two pre-bend releases in tune inside a short phrase.',
  },
  259: {
    title: 'Sequence Climb — Melodic Sequences Up 78',
    durationMin: 35,
    goals: [
      'Sequence a 4-note cell upward (focus: Sequence Climb)',
      'Keep rhythmic identity — day 259 step 2',
      'Stop before it becomes sport only — day 259 step 3'
    ],
    theoryBite: 'Day 259 focus — Sequence Climb — Melodic Sequences Up 78: Sequences are classic development tools from Bach to rock — recognizable motion.',
    drills: [
      'Cell [Sequence Climb]',
      'Climb (D259.2)',
      'Land (D259.3)'
    ],
    libraryIds: ['sc-mel-min', 'rf-natural-harmonics-study', 'pr-12bar', 'ch-em', 'sg-minuet-in-g-bach-public-domain'],
    masteryCheck: 'Day 259: Climb a sequence through a position and land on a chord tone.',
  },
  260: {
    title: 'Question Harmony — Solo Over Andalusian 79',
    durationMin: 30,
    goals: [
      'Note each chord in Am G F E (focus: Question Harmony)',
      'Change color tones on E — day 260 step 2',
      'Keep phrases short — day 260 step 3'
    ],
    theoryBite: 'Day 260 focus — Question Harmony — Solo Over Andalusian 79: Modal progressions teach ear-led targeting under shifting gravity.',
    drills: [
      'Chord tones [Question Harmony]',
      'Short lines (D260.2)',
      'E drama (D260.3)'
    ],
    libraryIds: ['sc-pent-maj', 'rf-minor-slide-lick-study', 'pr-andalu', 'ch-am', 'sg-f-r-elise-motif-beethoven-public'],
    masteryCheck: 'Day 260: Solo one Andalusian cycle with intentional color on E.',
  },
  261: {
    title: 'Repertoire Phase Open — Songs Are the Point',
    durationMin: 30,
    goals: [
      'Pick a vehicle song from the library (focus: Repertoire Phase Open)',
      'Map its form on paper (intro/verse/chorus/ending) — day 261 step 2',
      'Play one section beautifully rather than all sections poorly — day 261 step 3'
    ],
    theoryBite: 'Day 261 focus — Repertoire Phase Open — Songs Are the Point: Repertoire consolidates skills under meaningful goals. Section mastery beats vague full-song thrash.',
    drills: [
      'Choose vehicle [Repertoire Phase Open]',
      'Form map (D261.2)',
      'Section 1 loop 10× clean (D261.3)'
    ],
    libraryIds: ['sg-twinkle', 'sg-ode', 'ch-g', 'ch-c'],
    masteryCheck: 'Day 261: Show a form map and one section of your vehicle song played cleanly three times.',
  },
  262: {
    title: 'Form Mapping — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Form Mapping (focus: Form Mapping)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 262 step 2',
      'End the session with a performance-shaped take, not only drills — day 262 step 3'
    ],
    theoryBite: 'Day 262 focus — Form Mapping — Repertoire Day: Repertoire focus — Form Mapping. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Form Mapping (5–8 focused minutes) [Form Mapping]',
      'Context: play the bar before and after the sticky spot (D262.2)',
      'One full pass of today’s form slice at honest tempo (D262.3)',
      'Optional: mark the chart with one pencil improvement (D262.4)'
    ],
    libraryIds: ['sg-twinkle', 'sg-ode', 'rf-open-am', 'ch-c', 'ch-am'],
    masteryCheck: 'Day 262: Prove today’s repertoire step (Form Mapping) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-twinkle.',
  },
  263: {
    title: 'Intro Hook Design — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Intro Hook Design (focus: Intro Hook Design)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 263 step 2',
      'End the session with a performance-shaped take, not only drills — day 263 step 3'
    ],
    theoryBite: 'Day 263 focus — Intro Hook Design — Repertoire Day: Repertoire focus — Intro Hook Design. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Intro Hook Design (5–8 focused minutes) [Intro Hook Design]',
      'Context: play the bar before and after the sticky spot (D263.2)',
      'One full pass of today’s form slice at honest tempo (D263.3)',
      'Optional: mark the chart with one pencil improvement (D263.4)'
    ],
    libraryIds: ['sg-ode', 'pr-1645', 'ch-g', 'rf-power', 'sg-drums'],
    masteryCheck: 'Day 263: Prove today’s repertoire step (Intro Hook Design) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-ode.',
  },
  264: {
    title: 'Verse Comp Texture — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Verse Comp Texture (focus: Verse Comp Texture)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 264 step 2',
      'End the session with a performance-shaped take, not only drills — day 264 step 3'
    ],
    theoryBite: 'Day 264 focus — Verse Comp Texture — Repertoire Day: Repertoire focus — Verse Comp Texture. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Verse Comp Texture (5–8 focused minutes) [Verse Comp Texture]',
      'Context: play the bar before and after the sticky spot (D264.2)',
      'One full pass of today’s form slice at honest tempo (D264.3)',
      'Optional: mark the chart with one pencil improvement (D264.4)'
    ],
    libraryIds: ['sg-drums', 'sg-amazing-grace', 'rf-blues-sh', 'ch-d', 'ch-a'],
    masteryCheck: 'Day 264: Prove today’s repertoire step (Verse Comp Texture) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-drums.',
  },
  265: {
    title: 'Chorus Lift — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Chorus Lift (focus: Chorus Lift)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 265 step 2',
      'End the session with a performance-shaped take, not only drills — day 265 step 3'
    ],
    theoryBite: 'Day 265 focus — Chorus Lift — Repertoire Day: Repertoire focus — Chorus Lift. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Chorus Lift (5–8 focused minutes) [Chorus Lift]',
      'Context: play the bar before and after the sticky spot (D265.2)',
      'One full pass of today’s form slice at honest tempo (D265.3)',
      'Optional: mark the chart with one pencil improvement (D265.4)'
    ],
    libraryIds: ['sg-amazing-grace', 'pr-12bar', 'ch-em', 'rf-spider', 'sg-greensleeves'],
    masteryCheck: 'Day 265: Prove today’s repertoire step (Chorus Lift) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-amazing-grace.',
  },
  266: {
    title: 'Bridge or Middle Eight — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Bridge or Middle Eight (focus: Bridge or Middle Eight)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 266 step 2',
      'End the session with a performance-shaped take, not only drills — day 266 step 3'
    ],
    theoryBite: 'Day 266 focus — Bridge or Middle Eight — Repertoire Day: Repertoire focus — Bridge or Middle Eight. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Bridge or Middle Eight (5–8 focused minutes) [Bridge or Middle Eight]',
      'Context: play the bar before and after the sticky spot (D266.2)',
      'One full pass of today’s form slice at honest tempo (D266.3)',
      'Optional: mark the chart with one pencil improvement (D266.4)'
    ],
    libraryIds: ['sg-greensleeves', 'sg-scarborough-fair', 'rf-caged-c', 'ch-am', 'ch-bm'],
    masteryCheck: 'Day 266: Prove today’s repertoire step (Bridge or Middle Eight) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-greensleeves.',
  },
  267: {
    title: 'Ending & Button — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Ending & Button (focus: Ending & Button)',
      'Run a mini-set slice (2 sections minimum) — day 267 step 2',
      'Record and note one keep + one fix — day 267 step 3'
    ],
    theoryBite: 'Day 267 focus — Ending & Button — Repertoire Day: Repertoire focus — Ending & Button. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Ending & Button (5–8 focused minutes) [Ending & Button]',
      'Context: play the bar before and after the sticky spot (D267.2)',
      'One full pass of today’s form slice at honest tempo (D267.3)',
      'Optional: mark the chart with one pencil improvement (D267.4)'
    ],
    libraryIds: ['sg-scarborough-fair', 'pr-145', 'ch-e', 'rf-open-g-roll-study', 'sg-aura-lee'],
    masteryCheck: 'Day 267: Weekly checkpoint: perform a multi-section slice showing progress on Ending & Button, with one recorded take and a written keep/fix note.',
  },
  268: {
    title: 'Transition Glue — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Transition Glue (focus: Transition Glue)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 268 step 2',
      'End the session with a performance-shaped take, not only drills — day 268 step 3'
    ],
    theoryBite: 'Day 268 focus — Transition Glue — Repertoire Day: Repertoire focus — Transition Glue. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Transition Glue (5–8 focused minutes) [Transition Glue]',
      'Context: play the bar before and after the sticky spot (D268.2)',
      'One full pass of today’s form slice at honest tempo (D268.3)',
      'Optional: mark the chart with one pencil improvement (D268.4)'
    ],
    libraryIds: ['sg-aura-lee', 'sg-oh-susanna', 'rf-em-pentatonic-box-study', 'ch-a', 'ch-g7'],
    masteryCheck: 'Day 268: Prove today’s repertoire step (Transition Glue) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-aura-lee.',
  },
  269: {
    title: 'Tempo Honesty — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Tempo Honesty (focus: Tempo Honesty)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 269 step 2',
      'End the session with a performance-shaped take, not only drills — day 269 step 3'
    ],
    theoryBite: 'Day 269 focus — Tempo Honesty — Repertoire Day: Repertoire focus — Tempo Honesty. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Tempo Honesty (5–8 focused minutes) [Tempo Honesty]',
      'Context: play the bar before and after the sticky spot (D269.2)',
      'One full pass of today’s form slice at honest tempo (D269.3)',
      'Optional: mark the chart with one pencil improvement (D269.4)'
    ],
    libraryIds: ['sg-oh-susanna', 'pr-6251', 'ch-f', 'rf-d-folk-pattern-study', 'sg-camptown-races'],
    masteryCheck: 'Day 269: Prove today’s repertoire step (Tempo Honesty) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-oh-susanna.',
  },
  270: {
    title: 'Dynamic Architecture — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Dynamic Architecture (focus: Dynamic Architecture)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 270 step 2',
      'End the session with a performance-shaped take, not only drills — day 270 step 3'
    ],
    theoryBite: 'Day 270 focus — Dynamic Architecture — Repertoire Day: Repertoire focus — Dynamic Architecture. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Dynamic Architecture (5–8 focused minutes) [Dynamic Architecture]',
      'Context: play the bar before and after the sticky spot (D270.2)',
      'One full pass of today’s form slice at honest tempo (D270.3)',
      'Optional: mark the chart with one pencil improvement (D270.4)'
    ],
    libraryIds: ['sg-camptown-races', 'sg-when-the-saints-go-marching-in', 'rf-a-blues-turnaround-study', 'ch-bm', 'ch-a7'],
    masteryCheck: 'Day 270: Prove today’s repertoire step (Dynamic Architecture) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-camptown-races.',
  },
  271: {
    title: 'Memory Without Panic — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Memory Without Panic (focus: Memory Without Panic)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 271 step 2',
      'End the session with a performance-shaped take, not only drills — day 271 step 3'
    ],
    theoryBite: 'Day 271 focus — Memory Without Panic — Repertoire Day: Repertoire focus — Memory Without Panic. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Memory Without Panic (5–8 focused minutes) [Memory Without Panic]',
      'Context: play the bar before and after the sticky spot (D271.2)',
      'One full pass of today’s form slice at honest tempo (D271.3)',
      'Optional: mark the chart with one pencil improvement (D271.4)'
    ],
    libraryIds: ['sg-when-the-saints-go-marching-in', 'pr-andalu', 'ch-c7', 'rf-g-caged-run-study', 'sg-danny-boy-londonderry-air'],
    masteryCheck: 'Day 271: Prove today’s repertoire step (Memory Without Panic) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-when-the-saints-go-marching-in.',
  },
  272: {
    title: 'Recovery Practice — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Recovery Practice (focus: Recovery Practice)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 272 step 2',
      'End the session with a performance-shaped take, not only drills — day 272 step 3'
    ],
    theoryBite: 'Day 272 focus — Recovery Practice — Repertoire Day: Repertoire focus — Recovery Practice. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Recovery Practice (5–8 focused minutes) [Recovery Practice]',
      'Context: play the bar before and after the sticky spot (D272.2)',
      'One full pass of today’s form slice at honest tempo (D272.3)',
      'Optional: mark the chart with one pencil improvement (D272.4)'
    ],
    libraryIds: ['sg-danny-boy-londonderry-air', 'sg-silent-night', 'rf-c-bass-walk-study', 'ch-g7', 'ch-dm'],
    masteryCheck: 'Day 272: Prove today’s repertoire step (Recovery Practice) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-danny-boy-londonderry-air.',
  },
  273: {
    title: 'Chart Cleanliness — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Chart Cleanliness (focus: Chart Cleanliness)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 273 step 2',
      'End the session with a performance-shaped take, not only drills — day 273 step 3'
    ],
    theoryBite: 'Day 273 focus — Chart Cleanliness — Repertoire Day: Repertoire focus — Chart Cleanliness. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Chart Cleanliness (5–8 focused minutes) [Chart Cleanliness]',
      'Context: play the bar before and after the sticky spot (D273.2)',
      'One full pass of today’s form slice at honest tempo (D273.3)',
      'Optional: mark the chart with one pencil improvement (D273.4)'
    ],
    libraryIds: ['sg-silent-night', 'pr-1645', 'ch-d7', 'rf-spanish-e-phrygian-study', 'sg-jingle-bells'],
    masteryCheck: 'Day 273: Prove today’s repertoire step (Chart Cleanliness) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-silent-night.',
  },
  274: {
    title: 'Tone & Arrangement — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Tone & Arrangement (focus: Tone & Arrangement)',
      'Run a mini-set slice (2 sections minimum) — day 274 step 2',
      'Record and note one keep + one fix — day 274 step 3'
    ],
    theoryBite: 'Day 274 focus — Tone & Arrangement — Repertoire Day: Repertoire focus — Tone & Arrangement. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Tone & Arrangement (5–8 focused minutes) [Tone & Arrangement]',
      'Context: play the bar before and after the sticky spot (D274.2)',
      'One full pass of today’s form slice at honest tempo (D274.3)',
      'Optional: mark the chart with one pencil improvement (D274.4)'
    ],
    libraryIds: ['sg-jingle-bells', 'sg-joy-to-the-world', 'rf-funk-chicka-study', 'ch-a7', 'ch-g'],
    masteryCheck: 'Day 274: Weekly checkpoint: perform a multi-section slice showing progress on Tone & Arrangement, with one recorded take and a written keep/fix note.',
  },
  275: {
    title: 'Duet With Recording — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Duet With Recording (focus: Duet With Recording)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 275 step 2',
      'End the session with a performance-shaped take, not only drills — day 275 step 3'
    ],
    theoryBite: 'Day 275 focus — Duet With Recording — Repertoire Day: Repertoire focus — Duet With Recording. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Duet With Recording (5–8 focused minutes) [Duet With Recording]',
      'Context: play the bar before and after the sticky spot (D275.2)',
      'One full pass of today’s form slice at honest tempo (D275.3)',
      'Optional: mark the chart with one pencil improvement (D275.4)'
    ],
    libraryIds: ['sg-joy-to-the-world', 'pr-12bar', 'ch-e7', 'rf-palm-mute-chug-study', 'sg-auld-lang-syne'],
    masteryCheck: 'Day 275: Prove today’s repertoire step (Duet With Recording) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-joy-to-the-world.',
  },
  276: {
    title: 'Fingerstyle Arrangement Pass — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Fingerstyle Arrangement Pass (focus: Fingerstyle Arrangement Pass)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 276 step 2',
      'End the session with a performance-shaped take, not only drills — day 276 step 3'
    ],
    theoryBite: 'Day 276 focus — Fingerstyle Arrangement Pass — Repertoire Day: Repertoire focus — Fingerstyle Arrangement Pass. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Fingerstyle Arrangement Pass (5–8 focused minutes) [Fingerstyle Arrangement Pass]',
      'Context: play the bar before and after the sticky spot (D276.2)',
      'One full pass of today’s form slice at honest tempo (D276.3)',
      'Optional: mark the chart with one pencil improvement (D276.4)'
    ],
    libraryIds: ['sg-auld-lang-syne', 'sg-swing-low-sweet-chariot', 'rf-jazz-chromatic-approach-study', 'ch-dm', 'ch-em'],
    masteryCheck: 'Day 276: Prove today’s repertoire step (Fingerstyle Arrangement Pass) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-auld-lang-syne.',
  },
  277: {
    title: 'Strum Arrangement Pass — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Strum Arrangement Pass (focus: Strum Arrangement Pass)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 277 step 2',
      'End the session with a performance-shaped take, not only drills — day 277 step 3'
    ],
    theoryBite: 'Day 277 focus — Strum Arrangement Pass — Repertoire Day: Repertoire focus — Strum Arrangement Pass. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Strum Arrangement Pass (5–8 focused minutes) [Strum Arrangement Pass]',
      'Context: play the bar before and after the sticky spot (D277.2)',
      'One full pass of today’s form slice at honest tempo (D277.3)',
      'Optional: mark the chart with one pencil improvement (D277.4)'
    ],
    libraryIds: ['sg-swing-low-sweet-chariot', 'pr-145', 'ch-c', 'rf-am-arpeggio-cascade', 'sg-mary-had-a-little-lamb'],
    masteryCheck: 'Day 277: Prove today’s repertoire step (Strum Arrangement Pass) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-swing-low-sweet-chariot.',
  },
  278: {
    title: 'Lead Break Writing — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Lead Break Writing (focus: Lead Break Writing)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 278 step 2',
      'End the session with a performance-shaped take, not only drills — day 278 step 3'
    ],
    theoryBite: 'Day 278 focus — Lead Break Writing — Repertoire Day: Repertoire focus — Lead Break Writing. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Lead Break Writing (5–8 focused minutes) [Lead Break Writing]',
      'Context: play the bar before and after the sticky spot (D278.2)',
      'One full pass of today’s form slice at honest tempo (D278.3)',
      'Optional: mark the chart with one pencil improvement (D278.4)'
    ],
    libraryIds: ['sg-mary-had-a-little-lamb', 'sg-row-row-row-your-boat', 'rf-drop-d-power-study', 'ch-g', 'ch-e'],
    masteryCheck: 'Day 278: Prove today’s repertoire step (Lead Break Writing) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-mary-had-a-little-lamb.',
  },
  279: {
    title: 'Call-Response With Voice — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Call-Response With Voice (focus: Call-Response With Voice)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 279 step 2',
      'End the session with a performance-shaped take, not only drills — day 279 step 3'
    ],
    theoryBite: 'Day 279 focus — Call-Response With Voice — Repertoire Day: Repertoire focus — Call-Response With Voice. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Call-Response With Voice (5–8 focused minutes) [Call-Response With Voice]',
      'Context: play the bar before and after the sticky spot (D279.2)',
      'One full pass of today’s form slice at honest tempo (D279.3)',
      'Optional: mark the chart with one pencil improvement (D279.4)'
    ],
    libraryIds: ['sg-row-row-row-your-boat', 'pr-6251', 'ch-d', 'rf-travis-pick-sketch-in-c', 'sg-fr-re-jacques'],
    masteryCheck: 'Day 279: Prove today’s repertoire step (Call-Response With Voice) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-row-row-row-your-boat.',
  },
  280: {
    title: 'Capo/Key Fit for Voice — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Capo/Key Fit for Voice (focus: Capo/Key Fit for Voice)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 280 step 2',
      'End the session with a performance-shaped take, not only drills — day 280 step 3'
    ],
    theoryBite: 'Day 280 focus — Capo/Key Fit for Voice — Repertoire Day: Repertoire focus — Capo/Key Fit for Voice. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Capo/Key Fit for Voice (5–8 focused minutes) [Capo/Key Fit for Voice]',
      'Context: play the bar before and after the sticky spot (D280.2)',
      'One full pass of today’s form slice at honest tempo (D280.3)',
      'Optional: mark the chart with one pencil improvement (D280.4)'
    ],
    libraryIds: ['sg-fr-re-jacques', 'sg-london-bridge', 'rf-natural-harmonics-study', 'ch-em', 'ch-f'],
    masteryCheck: 'Day 280: Prove today’s repertoire step (Capo/Key Fit for Voice) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-fr-re-jacques.',
  },
  281: {
    title: 'Setlist Flow Logic — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Setlist Flow Logic (focus: Setlist Flow Logic)',
      'Run a mini-set slice (2 sections minimum) — day 281 step 2',
      'Record and note one keep + one fix — day 281 step 3'
    ],
    theoryBite: 'Day 281 focus — Setlist Flow Logic — Repertoire Day: Repertoire focus — Setlist Flow Logic. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Setlist Flow Logic (5–8 focused minutes) [Setlist Flow Logic]',
      'Context: play the bar before and after the sticky spot (D281.2)',
      'One full pass of today’s form slice at honest tempo (D281.3)',
      'Optional: mark the chart with one pencil improvement (D281.4)'
    ],
    libraryIds: ['sg-london-bridge', 'pr-andalu', 'ch-am', 'rf-minor-slide-lick-study', 'sg-this-old-man'],
    masteryCheck: 'Day 281: Weekly checkpoint: perform a multi-section slice showing progress on Setlist Flow Logic, with one recorded take and a written keep/fix note.',
  },
  282: {
    title: 'Stamina Building — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Stamina Building (focus: Stamina Building)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 282 step 2',
      'End the session with a performance-shaped take, not only drills — day 282 step 3'
    ],
    theoryBite: 'Day 282 focus — Stamina Building — Repertoire Day: Repertoire focus — Stamina Building. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Stamina Building (5–8 focused minutes) [Stamina Building]',
      'Context: play the bar before and after the sticky spot (D282.2)',
      'One full pass of today’s form slice at honest tempo (D282.3)',
      'Optional: mark the chart with one pencil improvement (D282.4)'
    ],
    libraryIds: ['sg-this-old-man', 'sg-happy-birthday', 'rf-open-am', 'ch-e', 'ch-c7'],
    masteryCheck: 'Day 282: Prove today’s repertoire step (Stamina Building) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-this-old-man.',
  },
  283: {
    title: 'Quiet Practice Day — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Quiet Practice Day (focus: Quiet Practice Day)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 283 step 2',
      'End the session with a performance-shaped take, not only drills — day 283 step 3'
    ],
    theoryBite: 'Day 283 focus — Quiet Practice Day — Repertoire Day: Repertoire focus — Quiet Practice Day. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Quiet Practice Day (5–8 focused minutes) [Quiet Practice Day]',
      'Context: play the bar before and after the sticky spot (D283.2)',
      'One full pass of today’s form slice at honest tempo (D283.3)',
      'Optional: mark the chart with one pencil improvement (D283.4)'
    ],
    libraryIds: ['sg-happy-birthday', 'pr-1645', 'ch-a', 'rf-power', 'sg-minuet-in-g-bach-public-domain'],
    masteryCheck: 'Day 283: Prove today’s repertoire step (Quiet Practice Day) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-happy-birthday.',
  },
  284: {
    title: 'Record Keepable Take — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Record Keepable Take (focus: Record Keepable Take)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 284 step 2',
      'End the session with a performance-shaped take, not only drills — day 284 step 3'
    ],
    theoryBite: 'Day 284 focus — Record Keepable Take — Repertoire Day: Repertoire focus — Record Keepable Take. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Record Keepable Take (5–8 focused minutes) [Record Keepable Take]',
      'Context: play the bar before and after the sticky spot (D284.2)',
      'One full pass of today’s form slice at honest tempo (D284.3)',
      'Optional: mark the chart with one pencil improvement (D284.4)'
    ],
    libraryIds: ['sg-minuet-in-g-bach-public-domain', 'sg-f-r-elise-motif-beethoven-public', 'rf-blues-sh', 'ch-f', 'ch-d7'],
    masteryCheck: 'Day 284: Prove today’s repertoire step (Record Keepable Take) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-minuet-in-g-bach-public-domain.',
  },
  285: {
    title: 'Listenback Critique Kind — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Listenback Critique Kind (focus: Listenback Critique Kind)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 285 step 2',
      'End the session with a performance-shaped take, not only drills — day 285 step 3'
    ],
    theoryBite: 'Day 285 focus — Listenback Critique Kind — Repertoire Day: Repertoire focus — Listenback Critique Kind. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Listenback Critique Kind (5–8 focused minutes) [Listenback Critique Kind]',
      'Context: play the bar before and after the sticky spot (D285.2)',
      'One full pass of today’s form slice at honest tempo (D285.3)',
      'Optional: mark the chart with one pencil improvement (D285.4)'
    ],
    libraryIds: ['sg-f-r-elise-motif-beethoven-public', 'pr-12bar', 'ch-bm', 'rf-spider', 'sg-canon-in-d-pachelbel-theme-publi'],
    masteryCheck: 'Day 285: Prove today’s repertoire step (Listenback Critique Kind) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-f-r-elise-motif-beethoven-public.',
  },
  286: {
    title: 'Fix One Bar Only — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Fix One Bar Only (focus: Fix One Bar Only)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 286 step 2',
      'End the session with a performance-shaped take, not only drills — day 286 step 3'
    ],
    theoryBite: 'Day 286 focus — Fix One Bar Only — Repertoire Day: Repertoire focus — Fix One Bar Only. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Fix One Bar Only (5–8 focused minutes) [Fix One Bar Only]',
      'Context: play the bar before and after the sticky spot (D286.2)',
      'One full pass of today’s form slice at honest tempo (D286.3)',
      'Optional: mark the chart with one pencil improvement (D286.4)'
    ],
    libraryIds: ['sg-canon-in-d-pachelbel-theme-publi', 'sg-brahms-lullaby', 'rf-caged-c', 'ch-c7', 'ch-e7'],
    masteryCheck: 'Day 286: Prove today’s repertoire step (Fix One Bar Only) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-canon-in-d-pachelbel-theme-publi.',
  },
  287: {
    title: 'Performance Stance — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Performance Stance (focus: Performance Stance)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 287 step 2',
      'End the session with a performance-shaped take, not only drills — day 287 step 3'
    ],
    theoryBite: 'Day 287 focus — Performance Stance — Repertoire Day: Repertoire focus — Performance Stance. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Performance Stance (5–8 focused minutes) [Performance Stance]',
      'Context: play the bar before and after the sticky spot (D287.2)',
      'One full pass of today’s form slice at honest tempo (D287.3)',
      'Optional: mark the chart with one pencil improvement (D287.4)'
    ],
    libraryIds: ['sg-brahms-lullaby', 'pr-145', 'ch-g7', 'rf-open-g-roll-study', 'sg-blue-danube-motif-strauss-public'],
    masteryCheck: 'Day 287: Prove today’s repertoire step (Performance Stance) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-brahms-lullaby.',
  },
  288: {
    title: 'Start Strong Ritual — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Start Strong Ritual (focus: Start Strong Ritual)',
      'Run a mini-set slice (2 sections minimum) — day 288 step 2',
      'Record and note one keep + one fix — day 288 step 3'
    ],
    theoryBite: 'Day 288 focus — Start Strong Ritual — Repertoire Day: Repertoire focus — Start Strong Ritual. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Start Strong Ritual (5–8 focused minutes) [Start Strong Ritual]',
      'Context: play the bar before and after the sticky spot (D288.2)',
      'One full pass of today’s form slice at honest tempo (D288.3)',
      'Optional: mark the chart with one pencil improvement (D288.4)'
    ],
    libraryIds: ['sg-blue-danube-motif-strauss-public', 'sg-william-tell-motif-rossini-publi', 'rf-em-pentatonic-box-study', 'ch-d7', 'ch-c'],
    masteryCheck: 'Day 288: Weekly checkpoint: perform a multi-section slice showing progress on Start Strong Ritual, with one recorded take and a written keep/fix note.',
  },
  289: {
    title: 'Finish Strong Ritual — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Finish Strong Ritual (focus: Finish Strong Ritual)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 289 step 2',
      'End the session with a performance-shaped take, not only drills — day 289 step 3'
    ],
    theoryBite: 'Day 289 focus — Finish Strong Ritual — Repertoire Day: Repertoire focus — Finish Strong Ritual. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Finish Strong Ritual (5–8 focused minutes) [Finish Strong Ritual]',
      'Context: play the bar before and after the sticky spot (D289.2)',
      'One full pass of today’s form slice at honest tempo (D289.3)',
      'Optional: mark the chart with one pencil improvement (D289.4)'
    ],
    libraryIds: ['sg-william-tell-motif-rossini-publi', 'pr-6251', 'ch-a7', 'rf-d-folk-pattern-study', 'sg-the-entertainer-motif-joplin-pub'],
    masteryCheck: 'Day 289: Prove today’s repertoire step (Finish Strong Ritual) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-william-tell-motif-rossini-publi.',
  },
  290: {
    title: 'Medley Skills — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Medley Skills (focus: Medley Skills)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 290 step 2',
      'End the session with a performance-shaped take, not only drills — day 290 step 3'
    ],
    theoryBite: 'Day 290 focus — Medley Skills — Repertoire Day: Repertoire focus — Medley Skills. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Medley Skills (5–8 focused minutes) [Medley Skills]',
      'Context: play the bar before and after the sticky spot (D290.2)',
      'One full pass of today’s form slice at honest tempo (D290.3)',
      'Optional: mark the chart with one pencil improvement (D290.4)'
    ],
    libraryIds: ['sg-the-entertainer-motif-joplin-pub', 'sg-shenandoah', 'rf-a-blues-turnaround-study', 'ch-e7', 'ch-d'],
    masteryCheck: 'Day 290: Prove today’s repertoire step (Medley Skills) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-the-entertainer-motif-joplin-pub.',
  },
  291: {
    title: 'Style Transfer Day — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Style Transfer Day (focus: Style Transfer Day)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 291 step 2',
      'End the session with a performance-shaped take, not only drills — day 291 step 3'
    ],
    theoryBite: 'Day 291 focus — Style Transfer Day — Repertoire Day: Repertoire focus — Style Transfer Day. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Style Transfer Day (5–8 focused minutes) [Style Transfer Day]',
      'Context: play the bar before and after the sticky spot (D291.2)',
      'One full pass of today’s form slice at honest tempo (D291.3)',
      'Optional: mark the chart with one pencil improvement (D291.4)'
    ],
    libraryIds: ['sg-shenandoah', 'pr-andalu', 'ch-dm', 'rf-g-caged-run-study', 'sg-red-river-valley'],
    masteryCheck: 'Day 291: Prove today’s repertoire step (Style Transfer Day) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-shenandoah.',
  },
  292: {
    title: 'Acoustic vs Amp Feel — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Acoustic vs Amp Feel (focus: Acoustic vs Amp Feel)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 292 step 2',
      'End the session with a performance-shaped take, not only drills — day 292 step 3'
    ],
    theoryBite: 'Day 292 focus — Acoustic vs Amp Feel — Repertoire Day: Repertoire focus — Acoustic vs Amp Feel. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Acoustic vs Amp Feel (5–8 focused minutes) [Acoustic vs Amp Feel]',
      'Context: play the bar before and after the sticky spot (D292.2)',
      'One full pass of today’s form slice at honest tempo (D292.3)',
      'Optional: mark the chart with one pencil improvement (D292.4)'
    ],
    libraryIds: ['sg-red-river-valley', 'sg-home-on-the-range', 'rf-c-bass-walk-study', 'ch-c', 'ch-am'],
    masteryCheck: 'Day 292: Prove today’s repertoire step (Acoustic vs Amp Feel) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-red-river-valley.',
  },
  293: {
    title: 'Mute Noise Cleanup — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Mute Noise Cleanup (focus: Mute Noise Cleanup)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 293 step 2',
      'End the session with a performance-shaped take, not only drills — day 293 step 3'
    ],
    theoryBite: 'Day 293 focus — Mute Noise Cleanup — Repertoire Day: Repertoire focus — Mute Noise Cleanup. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Mute Noise Cleanup (5–8 focused minutes) [Mute Noise Cleanup]',
      'Context: play the bar before and after the sticky spot (D293.2)',
      'One full pass of today’s form slice at honest tempo (D293.3)',
      'Optional: mark the chart with one pencil improvement (D293.4)'
    ],
    libraryIds: ['sg-home-on-the-range', 'pr-1645', 'ch-g', 'rf-spanish-e-phrygian-study', 'sg-turkey-in-the-straw'],
    masteryCheck: 'Day 293: Prove today’s repertoire step (Mute Noise Cleanup) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-home-on-the-range.',
  },
  294: {
    title: 'Lyric Cue Awareness — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Lyric Cue Awareness (focus: Lyric Cue Awareness)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 294 step 2',
      'End the session with a performance-shaped take, not only drills — day 294 step 3'
    ],
    theoryBite: 'Day 294 focus — Lyric Cue Awareness — Repertoire Day: Repertoire focus — Lyric Cue Awareness. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Lyric Cue Awareness (5–8 focused minutes) [Lyric Cue Awareness]',
      'Context: play the bar before and after the sticky spot (D294.2)',
      'One full pass of today’s form slice at honest tempo (D294.3)',
      'Optional: mark the chart with one pencil improvement (D294.4)'
    ],
    libraryIds: ['sg-turkey-in-the-straw', 'sg-arkansas-traveler', 'rf-funk-chicka-study', 'ch-d', 'ch-a'],
    masteryCheck: 'Day 294: Prove today’s repertoire step (Lyric Cue Awareness) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-turkey-in-the-straw.',
  },
  295: {
    title: 'Count-In Leadership — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Count-In Leadership (focus: Count-In Leadership)',
      'Run a mini-set slice (2 sections minimum) — day 295 step 2',
      'Record and note one keep + one fix — day 295 step 3'
    ],
    theoryBite: 'Day 295 focus — Count-In Leadership — Repertoire Day: Repertoire focus — Count-In Leadership. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Count-In Leadership (5–8 focused minutes) [Count-In Leadership]',
      'Context: play the bar before and after the sticky spot (D295.2)',
      'One full pass of today’s form slice at honest tempo (D295.3)',
      'Optional: mark the chart with one pencil improvement (D295.4)'
    ],
    libraryIds: ['sg-arkansas-traveler', 'pr-12bar', 'ch-em', 'rf-palm-mute-chug-study', 'sg-sailor-s-hornpipe'],
    masteryCheck: 'Day 295: Weekly checkpoint: perform a multi-section slice showing progress on Count-In Leadership, with one recorded take and a written keep/fix note.',
  },
  296: {
    title: 'Fermatas & Holds — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Fermatas & Holds (focus: Fermatas & Holds)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 296 step 2',
      'End the session with a performance-shaped take, not only drills — day 296 step 3'
    ],
    theoryBite: 'Day 296 focus — Fermatas & Holds — Repertoire Day: Repertoire focus — Fermatas & Holds. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Fermatas & Holds (5–8 focused minutes) [Fermatas & Holds]',
      'Context: play the bar before and after the sticky spot (D296.2)',
      'One full pass of today’s form slice at honest tempo (D296.3)',
      'Optional: mark the chart with one pencil improvement (D296.4)'
    ],
    libraryIds: ['sg-sailor-s-hornpipe', 'sg-drunken-sailor', 'rf-jazz-chromatic-approach-study', 'ch-am', 'ch-bm'],
    masteryCheck: 'Day 296: Prove today’s repertoire step (Fermatas & Holds) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-sailor-s-hornpipe.',
  },
  297: {
    title: 'Rallentando Control — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Rallentando Control (focus: Rallentando Control)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 297 step 2',
      'End the session with a performance-shaped take, not only drills — day 297 step 3'
    ],
    theoryBite: 'Day 297 focus — Rallentando Control — Repertoire Day: Repertoire focus — Rallentando Control. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Rallentando Control (5–8 focused minutes) [Rallentando Control]',
      'Context: play the bar before and after the sticky spot (D297.2)',
      'One full pass of today’s form slice at honest tempo (D297.3)',
      'Optional: mark the chart with one pencil improvement (D297.4)'
    ],
    libraryIds: ['sg-drunken-sailor', 'pr-145', 'ch-e', 'rf-am-arpeggio-cascade', 'sg-molly-malone'],
    masteryCheck: 'Day 297: Prove today’s repertoire step (Rallentando Control) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-drunken-sailor.',
  },
  298: {
    title: 'Double-Time Taste — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Double-Time Taste (focus: Double-Time Taste)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 298 step 2',
      'End the session with a performance-shaped take, not only drills — day 298 step 3'
    ],
    theoryBite: 'Day 298 focus — Double-Time Taste — Repertoire Day: Repertoire focus — Double-Time Taste. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Double-Time Taste (5–8 focused minutes) [Double-Time Taste]',
      'Context: play the bar before and after the sticky spot (D298.2)',
      'One full pass of today’s form slice at honest tempo (D298.3)',
      'Optional: mark the chart with one pencil improvement (D298.4)'
    ],
    libraryIds: ['sg-molly-malone', 'sg-the-parting-glass', 'rf-drop-d-power-study', 'ch-a', 'ch-g7'],
    masteryCheck: 'Day 298: Prove today’s repertoire step (Double-Time Taste) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-molly-malone.',
  },
  299: {
    title: 'Half-Time Taste — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Half-Time Taste (focus: Half-Time Taste)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 299 step 2',
      'End the session with a performance-shaped take, not only drills — day 299 step 3'
    ],
    theoryBite: 'Day 299 focus — Half-Time Taste — Repertoire Day: Repertoire focus — Half-Time Taste. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Half-Time Taste (5–8 focused minutes) [Half-Time Taste]',
      'Context: play the bar before and after the sticky spot (D299.2)',
      'One full pass of today’s form slice at honest tempo (D299.3)',
      'Optional: mark the chart with one pencil improvement (D299.4)'
    ],
    libraryIds: ['sg-the-parting-glass', 'pr-6251', 'ch-f', 'rf-travis-pick-sketch-in-c', 'sg-simple-gifts'],
    masteryCheck: 'Day 299: Prove today’s repertoire step (Half-Time Taste) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-the-parting-glass.',
  },
  300: {
    title: 'Harmonic Simplification — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Harmonic Simplification (focus: Harmonic Simplification)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 300 step 2',
      'End the session with a performance-shaped take, not only drills — day 300 step 3'
    ],
    theoryBite: 'Day 300 focus — Harmonic Simplification — Repertoire Day: Repertoire focus — Harmonic Simplification. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Harmonic Simplification (5–8 focused minutes) [Harmonic Simplification]',
      'Context: play the bar before and after the sticky spot (D300.2)',
      'One full pass of today’s form slice at honest tempo (D300.3)',
      'Optional: mark the chart with one pencil improvement (D300.4)'
    ],
    libraryIds: ['sg-simple-gifts', 'sg-wayfaring-stranger', 'rf-natural-harmonics-study', 'ch-bm', 'ch-a7'],
    masteryCheck: 'Day 300: Prove today’s repertoire step (Harmonic Simplification) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-simple-gifts.',
  },
  301: {
    title: 'Harmonic Enrichment — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Harmonic Enrichment (focus: Harmonic Enrichment)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 301 step 2',
      'End the session with a performance-shaped take, not only drills — day 301 step 3'
    ],
    theoryBite: 'Day 301 focus — Harmonic Enrichment — Repertoire Day: Repertoire focus — Harmonic Enrichment. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Harmonic Enrichment (5–8 focused minutes) [Harmonic Enrichment]',
      'Context: play the bar before and after the sticky spot (D301.2)',
      'One full pass of today’s form slice at honest tempo (D301.3)',
      'Optional: mark the chart with one pencil improvement (D301.4)'
    ],
    libraryIds: ['sg-wayfaring-stranger', 'pr-andalu', 'ch-c7', 'rf-minor-slide-lick-study', 'sg-barbara-allen'],
    masteryCheck: 'Day 301: Prove today’s repertoire step (Harmonic Enrichment) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-wayfaring-stranger.',
  },
  302: {
    title: 'Bass Motion Arrange — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Bass Motion Arrange (focus: Bass Motion Arrange)',
      'Run a mini-set slice (2 sections minimum) — day 302 step 2',
      'Record and note one keep + one fix — day 302 step 3'
    ],
    theoryBite: 'Day 302 focus — Bass Motion Arrange — Repertoire Day: Repertoire focus — Bass Motion Arrange. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Bass Motion Arrange (5–8 focused minutes) [Bass Motion Arrange]',
      'Context: play the bar before and after the sticky spot (D302.2)',
      'One full pass of today’s form slice at honest tempo (D302.3)',
      'Optional: mark the chart with one pencil improvement (D302.4)'
    ],
    libraryIds: ['sg-barbara-allen', 'sg-down-by-the-riverside', 'rf-open-am', 'ch-g7', 'ch-dm'],
    masteryCheck: 'Day 302: Weekly checkpoint: perform a multi-section slice showing progress on Bass Motion Arrange, with one recorded take and a written keep/fix note.',
  },
  303: {
    title: 'Percussive Guitar — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Percussive Guitar (focus: Percussive Guitar)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 303 step 2',
      'End the session with a performance-shaped take, not only drills — day 303 step 3'
    ],
    theoryBite: 'Day 303 focus — Percussive Guitar — Repertoire Day: Repertoire focus — Percussive Guitar. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Percussive Guitar (5–8 focused minutes) [Percussive Guitar]',
      'Context: play the bar before and after the sticky spot (D303.2)',
      'One full pass of today’s form slice at honest tempo (D303.3)',
      'Optional: mark the chart with one pencil improvement (D303.4)'
    ],
    libraryIds: ['sg-down-by-the-riverside', 'pr-1645', 'ch-d7', 'rf-power', 'sg-skip-to-my-lou'],
    masteryCheck: 'Day 303: Prove today’s repertoire step (Percussive Guitar) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-down-by-the-riverside.',
  },
  304: {
    title: 'Open Tuning Taste Optional — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Open Tuning Taste Optional (focus: Open Tuning Taste Optional)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 304 step 2',
      'End the session with a performance-shaped take, not only drills — day 304 step 3'
    ],
    theoryBite: 'Day 304 focus — Open Tuning Taste Optional — Repertoire Day: Repertoire focus — Open Tuning Taste Optional. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Open Tuning Taste Optional (5–8 focused minutes) [Open Tuning Taste Optional]',
      'Context: play the bar before and after the sticky spot (D304.2)',
      'One full pass of today’s form slice at honest tempo (D304.3)',
      'Optional: mark the chart with one pencil improvement (D304.4)'
    ],
    libraryIds: ['sg-skip-to-my-lou', 'sg-i-ve-been-working-on-the-railroa', 'rf-blues-sh', 'ch-a7', 'ch-g'],
    masteryCheck: 'Day 304: Prove today’s repertoire step (Open Tuning Taste Optional) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-skip-to-my-lou.',
  },
  305: {
    title: 'Drop D Power Color Optional — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Drop D Power Color Optional (focus: Drop D Power Color Optional)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 305 step 2',
      'End the session with a performance-shaped take, not only drills — day 305 step 3'
    ],
    theoryBite: 'Day 305 focus — Drop D Power Color Optional — Repertoire Day: Repertoire focus — Drop D Power Color Optional. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Drop D Power Color Optional (5–8 focused minutes) [Drop D Power Color Optional]',
      'Context: play the bar before and after the sticky spot (D305.2)',
      'One full pass of today’s form slice at honest tempo (D305.3)',
      'Optional: mark the chart with one pencil improvement (D305.4)'
    ],
    libraryIds: ['sg-i-ve-been-working-on-the-railroa', 'pr-12bar', 'ch-e7', 'rf-spider', 'sg-she-ll-be-coming-round-the-mount'],
    masteryCheck: 'Day 305: Prove today’s repertoire step (Drop D Power Color Optional) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-i-ve-been-working-on-the-railroa.',
  },
  306: {
    title: 'Travis Pattern Song Pass — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Travis Pattern Song Pass (focus: Travis Pattern Song Pass)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 306 step 2',
      'End the session with a performance-shaped take, not only drills — day 306 step 3'
    ],
    theoryBite: 'Day 306 focus — Travis Pattern Song Pass — Repertoire Day: Repertoire focus — Travis Pattern Song Pass. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Travis Pattern Song Pass (5–8 focused minutes) [Travis Pattern Song Pass]',
      'Context: play the bar before and after the sticky spot (D306.2)',
      'One full pass of today’s form slice at honest tempo (D306.3)',
      'Optional: mark the chart with one pencil improvement (D306.4)'
    ],
    libraryIds: ['sg-she-ll-be-coming-round-the-mount', 'sg-house-of-the-rising-sun', 'rf-caged-c', 'ch-dm', 'ch-em'],
    masteryCheck: 'Day 306: Prove today’s repertoire step (Travis Pattern Song Pass) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-she-ll-be-coming-round-the-mount.',
  },
  307: {
    title: 'Boom-Chuck Song Pass — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Boom-Chuck Song Pass (focus: Boom-Chuck Song Pass)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 307 step 2',
      'End the session with a performance-shaped take, not only drills — day 307 step 3'
    ],
    theoryBite: 'Day 307 focus — Boom-Chuck Song Pass — Repertoire Day: Repertoire focus — Boom-Chuck Song Pass. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Boom-Chuck Song Pass (5–8 focused minutes) [Boom-Chuck Song Pass]',
      'Context: play the bar before and after the sticky spot (D307.2)',
      'One full pass of today’s form slice at honest tempo (D307.3)',
      'Optional: mark the chart with one pencil improvement (D307.4)'
    ],
    libraryIds: ['sg-house-of-the-rising-sun', 'pr-145', 'ch-c', 'rf-open-g-roll-study', 'sg-black-is-the-color'],
    masteryCheck: 'Day 307: Prove today’s repertoire step (Boom-Chuck Song Pass) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-house-of-the-rising-sun.',
  },
  308: {
    title: 'Ballad Vocal Space — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Ballad Vocal Space (focus: Ballad Vocal Space)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 308 step 2',
      'End the session with a performance-shaped take, not only drills — day 308 step 3'
    ],
    theoryBite: 'Day 308 focus — Ballad Vocal Space — Repertoire Day: Repertoire focus — Ballad Vocal Space. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Ballad Vocal Space (5–8 focused minutes) [Ballad Vocal Space]',
      'Context: play the bar before and after the sticky spot (D308.2)',
      'One full pass of today’s form slice at honest tempo (D308.3)',
      'Optional: mark the chart with one pencil improvement (D308.4)'
    ],
    libraryIds: ['sg-black-is-the-color', 'sg-wild-mountain-thyme', 'rf-em-pentatonic-box-study', 'ch-g', 'ch-e'],
    masteryCheck: 'Day 308: Prove today’s repertoire step (Ballad Vocal Space) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-black-is-the-color.',
  },
  309: {
    title: 'Up-Tempo Clarity — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Up-Tempo Clarity (focus: Up-Tempo Clarity)',
      'Run a mini-set slice (2 sections minimum) — day 309 step 2',
      'Record and note one keep + one fix — day 309 step 3'
    ],
    theoryBite: 'Day 309 focus — Up-Tempo Clarity — Repertoire Day: Repertoire focus — Up-Tempo Clarity. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Up-Tempo Clarity (5–8 focused minutes) [Up-Tempo Clarity]',
      'Context: play the bar before and after the sticky spot (D309.2)',
      'One full pass of today’s form slice at honest tempo (D309.3)',
      'Optional: mark the chart with one pencil improvement (D309.4)'
    ],
    libraryIds: ['sg-wild-mountain-thyme', 'pr-6251', 'ch-d', 'rf-d-folk-pattern-study', 'sg-go-tell-aunt-rhody'],
    masteryCheck: 'Day 309: Weekly checkpoint: perform a multi-section slice showing progress on Up-Tempo Clarity, with one recorded take and a written keep/fix note.',
  },
  310: {
    title: 'Slow Blues Vehicle — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Slow Blues Vehicle (focus: Slow Blues Vehicle)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 310 step 2',
      'End the session with a performance-shaped take, not only drills — day 310 step 3'
    ],
    theoryBite: 'Day 310 focus — Slow Blues Vehicle — Repertoire Day: Repertoire focus — Slow Blues Vehicle. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Slow Blues Vehicle (5–8 focused minutes) [Slow Blues Vehicle]',
      'Context: play the bar before and after the sticky spot (D310.2)',
      'One full pass of today’s form slice at honest tempo (D310.3)',
      'Optional: mark the chart with one pencil improvement (D310.4)'
    ],
    libraryIds: ['sg-go-tell-aunt-rhody', 'sg-buffalo-gals', 'rf-a-blues-turnaround-study', 'ch-em', 'ch-f'],
    masteryCheck: 'Day 310: Prove today’s repertoire step (Slow Blues Vehicle) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-go-tell-aunt-rhody.',
  },
  311: {
    title: 'Folk Storytelling Pace — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Folk Storytelling Pace (focus: Folk Storytelling Pace)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 311 step 2',
      'End the session with a performance-shaped take, not only drills — day 311 step 3'
    ],
    theoryBite: 'Day 311 focus — Folk Storytelling Pace — Repertoire Day: Repertoire focus — Folk Storytelling Pace. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Folk Storytelling Pace (5–8 focused minutes) [Folk Storytelling Pace]',
      'Context: play the bar before and after the sticky spot (D311.2)',
      'One full pass of today’s form slice at honest tempo (D311.3)',
      'Optional: mark the chart with one pencil improvement (D311.4)'
    ],
    libraryIds: ['sg-buffalo-gals', 'pr-andalu', 'ch-am', 'rf-g-caged-run-study', 'sg-joshua-fit-the-battle-of-jericho'],
    masteryCheck: 'Day 311: Prove today’s repertoire step (Folk Storytelling Pace) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-buffalo-gals.',
  },
  312: {
    title: 'Campfire Leadership — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Campfire Leadership (focus: Campfire Leadership)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 312 step 2',
      'End the session with a performance-shaped take, not only drills — day 312 step 3'
    ],
    theoryBite: 'Day 312 focus — Campfire Leadership — Repertoire Day: Repertoire focus — Campfire Leadership. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Campfire Leadership (5–8 focused minutes) [Campfire Leadership]',
      'Context: play the bar before and after the sticky spot (D312.2)',
      'One full pass of today’s form slice at honest tempo (D312.3)',
      'Optional: mark the chart with one pencil improvement (D312.4)'
    ],
    libraryIds: ['sg-joshua-fit-the-battle-of-jericho', 'sg-the-streets-of-laredo', 'rf-c-bass-walk-study', 'ch-e', 'ch-c7'],
    masteryCheck: 'Day 312: Prove today’s repertoire step (Campfire Leadership) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-joshua-fit-the-battle-of-jericho.',
  },
  313: {
    title: 'Solo Performance Shape — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Solo Performance Shape (focus: Solo Performance Shape)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 313 step 2',
      'End the session with a performance-shaped take, not only drills — day 313 step 3'
    ],
    theoryBite: 'Day 313 focus — Solo Performance Shape — Repertoire Day: Repertoire focus — Solo Performance Shape. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Solo Performance Shape (5–8 focused minutes) [Solo Performance Shape]',
      'Context: play the bar before and after the sticky spot (D313.2)',
      'One full pass of today’s form slice at honest tempo (D313.3)',
      'Optional: mark the chart with one pencil improvement (D313.4)'
    ],
    libraryIds: ['sg-the-streets-of-laredo', 'pr-1645', 'ch-a', 'rf-spanish-e-phrygian-study', 'sg-careless-love'],
    masteryCheck: 'Day 313: Prove today’s repertoire step (Solo Performance Shape) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-the-streets-of-laredo.',
  },
  314: {
    title: 'With-Metronome Polish — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: With-Metronome Polish (focus: With-Metronome Polish)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 314 step 2',
      'End the session with a performance-shaped take, not only drills — day 314 step 3'
    ],
    theoryBite: 'Day 314 focus — With-Metronome Polish — Repertoire Day: Repertoire focus — With-Metronome Polish. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at With-Metronome Polish (5–8 focused minutes) [With-Metronome Polish]',
      'Context: play the bar before and after the sticky spot (D314.2)',
      'One full pass of today’s form slice at honest tempo (D314.3)',
      'Optional: mark the chart with one pencil improvement (D314.4)'
    ],
    libraryIds: ['sg-careless-love', 'sg-st-louis-blues-motif-handy-1914-', 'rf-funk-chicka-study', 'ch-f', 'ch-d7'],
    masteryCheck: 'Day 314: Prove today’s repertoire step (With-Metronome Polish) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-careless-love.',
  },
  315: {
    title: 'Off-Metronome Humanize — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Off-Metronome Humanize (focus: Off-Metronome Humanize)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 315 step 2',
      'End the session with a performance-shaped take, not only drills — day 315 step 3'
    ],
    theoryBite: 'Day 315 focus — Off-Metronome Humanize — Repertoire Day: Repertoire focus — Off-Metronome Humanize. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Off-Metronome Humanize (5–8 focused minutes) [Off-Metronome Humanize]',
      'Context: play the bar before and after the sticky spot (D315.2)',
      'One full pass of today’s form slice at honest tempo (D315.3)',
      'Optional: mark the chart with one pencil improvement (D315.4)'
    ],
    libraryIds: ['sg-st-louis-blues-motif-handy-1914-', 'pr-12bar', 'ch-bm', 'rf-palm-mute-chug-study', 'sg-maple-leaf-rag-motif-joplin-publ'],
    masteryCheck: 'Day 315: Prove today’s repertoire step (Off-Metronome Humanize) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-st-louis-blues-motif-handy-1914-.',
  },
  316: {
    title: 'Nerves Simulation — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Nerves Simulation (focus: Nerves Simulation)',
      'Run a mini-set slice (2 sections minimum) — day 316 step 2',
      'Record and note one keep + one fix — day 316 step 3'
    ],
    theoryBite: 'Day 316 focus — Nerves Simulation — Repertoire Day: Repertoire focus — Nerves Simulation. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Nerves Simulation (5–8 focused minutes) [Nerves Simulation]',
      'Context: play the bar before and after the sticky spot (D316.2)',
      'One full pass of today’s form slice at honest tempo (D316.3)',
      'Optional: mark the chart with one pencil improvement (D316.4)'
    ],
    libraryIds: ['sg-maple-leaf-rag-motif-joplin-publ', 'sg-morning-mood-motif-grieg-public-', 'rf-jazz-chromatic-approach-study', 'ch-c7', 'ch-e7'],
    masteryCheck: 'Day 316: Weekly checkpoint: perform a multi-section slice showing progress on Nerves Simulation, with one recorded take and a written keep/fix note.',
  },
  317: {
    title: 'Second Song Start — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Second Song Start (focus: Second Song Start)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 317 step 2',
      'End the session with a performance-shaped take, not only drills — day 317 step 3'
    ],
    theoryBite: 'Day 317 focus — Second Song Start — Repertoire Day: Repertoire focus — Second Song Start. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Second Song Start (5–8 focused minutes) [Second Song Start]',
      'Context: play the bar before and after the sticky spot (D317.2)',
      'One full pass of today’s form slice at honest tempo (D317.3)',
      'Optional: mark the chart with one pencil improvement (D317.4)'
    ],
    libraryIds: ['sg-morning-mood-motif-grieg-public-', 'pr-145', 'ch-g7', 'rf-am-arpeggio-cascade', 'sg-twinkle'],
    masteryCheck: 'Day 317: Prove today’s repertoire step (Second Song Start) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-morning-mood-motif-grieg-public-.',
  },
  318: {
    title: 'Third Song Start — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Third Song Start (focus: Third Song Start)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 318 step 2',
      'End the session with a performance-shaped take, not only drills — day 318 step 3'
    ],
    theoryBite: 'Day 318 focus — Third Song Start — Repertoire Day: Repertoire focus — Third Song Start. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Third Song Start (5–8 focused minutes) [Third Song Start]',
      'Context: play the bar before and after the sticky spot (D318.2)',
      'One full pass of today’s form slice at honest tempo (D318.3)',
      'Optional: mark the chart with one pencil improvement (D318.4)'
    ],
    libraryIds: ['sg-twinkle', 'sg-ode', 'rf-drop-d-power-study', 'ch-d7', 'ch-c'],
    masteryCheck: 'Day 318: Prove today’s repertoire step (Third Song Start) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-twinkle.',
  },
  319: {
    title: 'Vehicle Swap Day — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Vehicle Swap Day (focus: Vehicle Swap Day)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 319 step 2',
      'End the session with a performance-shaped take, not only drills — day 319 step 3'
    ],
    theoryBite: 'Day 319 focus — Vehicle Swap Day — Repertoire Day: Repertoire focus — Vehicle Swap Day. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Vehicle Swap Day (5–8 focused minutes) [Vehicle Swap Day]',
      'Context: play the bar before and after the sticky spot (D319.2)',
      'One full pass of today’s form slice at honest tempo (D319.3)',
      'Optional: mark the chart with one pencil improvement (D319.4)'
    ],
    libraryIds: ['sg-ode', 'pr-6251', 'ch-a7', 'rf-travis-pick-sketch-in-c', 'sg-drums'],
    masteryCheck: 'Day 319: Prove today’s repertoire step (Vehicle Swap Day) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-ode.',
  },
  320: {
    title: 'Old Song Revival — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Old Song Revival (focus: Old Song Revival)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 320 step 2',
      'End the session with a performance-shaped take, not only drills — day 320 step 3'
    ],
    theoryBite: 'Day 320 focus — Old Song Revival — Repertoire Day: Repertoire focus — Old Song Revival. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Old Song Revival (5–8 focused minutes) [Old Song Revival]',
      'Context: play the bar before and after the sticky spot (D320.2)',
      'One full pass of today’s form slice at honest tempo (D320.3)',
      'Optional: mark the chart with one pencil improvement (D320.4)'
    ],
    libraryIds: ['sg-drums', 'sg-amazing-grace', 'rf-natural-harmonics-study', 'ch-e7', 'ch-d'],
    masteryCheck: 'Day 320: Prove today’s repertoire step (Old Song Revival) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-drums.',
  },
  321: {
    title: 'New Song Intake Method — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: New Song Intake Method (focus: New Song Intake Method)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 321 step 2',
      'End the session with a performance-shaped take, not only drills — day 321 step 3'
    ],
    theoryBite: 'Day 321 focus — New Song Intake Method — Repertoire Day: Repertoire focus — New Song Intake Method. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at New Song Intake Method (5–8 focused minutes) [New Song Intake Method]',
      'Context: play the bar before and after the sticky spot (D321.2)',
      'One full pass of today’s form slice at honest tempo (D321.3)',
      'Optional: mark the chart with one pencil improvement (D321.4)'
    ],
    libraryIds: ['sg-amazing-grace', 'pr-andalu', 'ch-dm', 'rf-minor-slide-lick-study', 'sg-greensleeves'],
    masteryCheck: 'Day 321: Prove today’s repertoire step (New Song Intake Method) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-amazing-grace.',
  },
  322: {
    title: 'Phrase-by-Phrase Learn — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Phrase-by-Phrase Learn (focus: Phrase-by-Phrase Learn)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 322 step 2',
      'End the session with a performance-shaped take, not only drills — day 322 step 3'
    ],
    theoryBite: 'Day 322 focus — Phrase-by-Phrase Learn — Repertoire Day: Repertoire focus — Phrase-by-Phrase Learn. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Phrase-by-Phrase Learn (5–8 focused minutes) [Phrase-by-Phrase Learn]',
      'Context: play the bar before and after the sticky spot (D322.2)',
      'One full pass of today’s form slice at honest tempo (D322.3)',
      'Optional: mark the chart with one pencil improvement (D322.4)'
    ],
    libraryIds: ['sg-greensleeves', 'sg-scarborough-fair', 'rf-open-am', 'ch-c', 'ch-am'],
    masteryCheck: 'Day 322: Prove today’s repertoire step (Phrase-by-Phrase Learn) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-greensleeves.',
  },
  323: {
    title: 'Chunk Boundary Practice — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Chunk Boundary Practice (focus: Chunk Boundary Practice)',
      'Run a mini-set slice (2 sections minimum) — day 323 step 2',
      'Record and note one keep + one fix — day 323 step 3'
    ],
    theoryBite: 'Day 323 focus — Chunk Boundary Practice — Repertoire Day: Repertoire focus — Chunk Boundary Practice. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Chunk Boundary Practice (5–8 focused minutes) [Chunk Boundary Practice]',
      'Context: play the bar before and after the sticky spot (D323.2)',
      'One full pass of today’s form slice at honest tempo (D323.3)',
      'Optional: mark the chart with one pencil improvement (D323.4)'
    ],
    libraryIds: ['sg-scarborough-fair', 'pr-1645', 'ch-g', 'rf-power', 'sg-aura-lee'],
    masteryCheck: 'Day 323: Weekly checkpoint: perform a multi-section slice showing progress on Chunk Boundary Practice, with one recorded take and a written keep/fix note.',
  },
  324: {
    title: 'Slow-Full-Fast Ladder — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Slow-Full-Fast Ladder (focus: Slow-Full-Fast Ladder)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 324 step 2',
      'End the session with a performance-shaped take, not only drills — day 324 step 3'
    ],
    theoryBite: 'Day 324 focus — Slow-Full-Fast Ladder — Repertoire Day: Repertoire focus — Slow-Full-Fast Ladder. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Slow-Full-Fast Ladder (5–8 focused minutes) [Slow-Full-Fast Ladder]',
      'Context: play the bar before and after the sticky spot (D324.2)',
      'One full pass of today’s form slice at honest tempo (D324.3)',
      'Optional: mark the chart with one pencil improvement (D324.4)'
    ],
    libraryIds: ['sg-aura-lee', 'sg-oh-susanna', 'rf-blues-sh', 'ch-d', 'ch-a'],
    masteryCheck: 'Day 324: Prove today’s repertoire step (Slow-Full-Fast Ladder) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-aura-lee.',
  },
  325: {
    title: 'Hands Separate Practice — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Hands Separate Practice (focus: Hands Separate Practice)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 325 step 2',
      'End the session with a performance-shaped take, not only drills — day 325 step 3'
    ],
    theoryBite: 'Day 325 focus — Hands Separate Practice — Repertoire Day: Repertoire focus — Hands Separate Practice. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Hands Separate Practice (5–8 focused minutes) [Hands Separate Practice]',
      'Context: play the bar before and after the sticky spot (D325.2)',
      'One full pass of today’s form slice at honest tempo (D325.3)',
      'Optional: mark the chart with one pencil improvement (D325.4)'
    ],
    libraryIds: ['sg-oh-susanna', 'pr-12bar', 'ch-em', 'rf-spider', 'sg-camptown-races'],
    masteryCheck: 'Day 325: Prove today’s repertoire step (Hands Separate Practice) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-oh-susanna.',
  },
  326: {
    title: 'Mental Practice Away From Guitar — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Mental Practice Away From Guitar (focus: Mental Practice Away From Guitar)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 326 step 2',
      'End the session with a performance-shaped take, not only drills — day 326 step 3'
    ],
    theoryBite: 'Day 326 focus — Mental Practice Away From Guitar — Repertoire Day: Repertoire focus — Mental Practice Away From Guitar. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Mental Practice Away From Guitar (5–8 focused minutes) [Mental Practice Away From Guitar]',
      'Context: play the bar before and after the sticky spot (D326.2)',
      'One full pass of today’s form slice at honest tempo (D326.3)',
      'Optional: mark the chart with one pencil improvement (D326.4)'
    ],
    libraryIds: ['sg-camptown-races', 'sg-when-the-saints-go-marching-in', 'rf-caged-c', 'ch-am', 'ch-bm'],
    masteryCheck: 'Day 326: Prove today’s repertoire step (Mental Practice Away From Guitar) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-camptown-races.',
  },
  327: {
    title: 'Video Self Review — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Video Self Review (focus: Video Self Review)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 327 step 2',
      'End the session with a performance-shaped take, not only drills — day 327 step 3'
    ],
    theoryBite: 'Day 327 focus — Video Self Review — Repertoire Day: Repertoire focus — Video Self Review. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Video Self Review (5–8 focused minutes) [Video Self Review]',
      'Context: play the bar before and after the sticky spot (D327.2)',
      'One full pass of today’s form slice at honest tempo (D327.3)',
      'Optional: mark the chart with one pencil improvement (D327.4)'
    ],
    libraryIds: ['sg-when-the-saints-go-marching-in', 'pr-145', 'ch-e', 'rf-open-g-roll-study', 'sg-danny-boy-londonderry-air'],
    masteryCheck: 'Day 327: Prove today’s repertoire step (Video Self Review) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-when-the-saints-go-marching-in.',
  },
  328: {
    title: 'Audio Self Review — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Audio Self Review (focus: Audio Self Review)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 328 step 2',
      'End the session with a performance-shaped take, not only drills — day 328 step 3'
    ],
    theoryBite: 'Day 328 focus — Audio Self Review — Repertoire Day: Repertoire focus — Audio Self Review. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Audio Self Review (5–8 focused minutes) [Audio Self Review]',
      'Context: play the bar before and after the sticky spot (D328.2)',
      'One full pass of today’s form slice at honest tempo (D328.3)',
      'Optional: mark the chart with one pencil improvement (D328.4)'
    ],
    libraryIds: ['sg-danny-boy-londonderry-air', 'sg-silent-night', 'rf-em-pentatonic-box-study', 'ch-a', 'ch-g7'],
    masteryCheck: 'Day 328: Prove today’s repertoire step (Audio Self Review) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-danny-boy-londonderry-air.',
  },
  329: {
    title: 'Peer Share Optional — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Peer Share Optional (focus: Peer Share Optional)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 329 step 2',
      'End the session with a performance-shaped take, not only drills — day 329 step 3'
    ],
    theoryBite: 'Day 329 focus — Peer Share Optional — Repertoire Day: Repertoire focus — Peer Share Optional. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Peer Share Optional (5–8 focused minutes) [Peer Share Optional]',
      'Context: play the bar before and after the sticky spot (D329.2)',
      'One full pass of today’s form slice at honest tempo (D329.3)',
      'Optional: mark the chart with one pencil improvement (D329.4)'
    ],
    libraryIds: ['sg-silent-night', 'pr-6251', 'ch-f', 'rf-d-folk-pattern-study', 'sg-jingle-bells'],
    masteryCheck: 'Day 329: Prove today’s repertoire step (Peer Share Optional) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-silent-night.',
  },
  330: {
    title: 'Teach a Section Aloud — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Teach a Section Aloud (focus: Teach a Section Aloud)',
      'Run a mini-set slice (2 sections minimum) — day 330 step 2',
      'Record and note one keep + one fix — day 330 step 3'
    ],
    theoryBite: 'Day 330 focus — Teach a Section Aloud — Repertoire Day: Repertoire focus — Teach a Section Aloud. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Teach a Section Aloud (5–8 focused minutes) [Teach a Section Aloud]',
      'Context: play the bar before and after the sticky spot (D330.2)',
      'One full pass of today’s form slice at honest tempo (D330.3)',
      'Optional: mark the chart with one pencil improvement (D330.4)'
    ],
    libraryIds: ['sg-jingle-bells', 'sg-joy-to-the-world', 'rf-a-blues-turnaround-study', 'ch-bm', 'ch-a7'],
    masteryCheck: 'Day 330: Weekly checkpoint: perform a multi-section slice showing progress on Teach a Section Aloud, with one recorded take and a written keep/fix note.',
  },
  331: {
    title: 'Simplify for Consistency — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Simplify for Consistency (focus: Simplify for Consistency)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 331 step 2',
      'End the session with a performance-shaped take, not only drills — day 331 step 3'
    ],
    theoryBite: 'Day 331 focus — Simplify for Consistency — Repertoire Day: Repertoire focus — Simplify for Consistency. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Simplify for Consistency (5–8 focused minutes) [Simplify for Consistency]',
      'Context: play the bar before and after the sticky spot (D331.2)',
      'One full pass of today’s form slice at honest tempo (D331.3)',
      'Optional: mark the chart with one pencil improvement (D331.4)'
    ],
    libraryIds: ['sg-joy-to-the-world', 'pr-andalu', 'ch-c7', 'rf-g-caged-run-study', 'sg-auld-lang-syne'],
    masteryCheck: 'Day 331: Prove today’s repertoire step (Simplify for Consistency) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-joy-to-the-world.',
  },
  332: {
    title: 'Ornament After Solid — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Ornament After Solid (focus: Ornament After Solid)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 332 step 2',
      'End the session with a performance-shaped take, not only drills — day 332 step 3'
    ],
    theoryBite: 'Day 332 focus — Ornament After Solid — Repertoire Day: Repertoire focus — Ornament After Solid. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Ornament After Solid (5–8 focused minutes) [Ornament After Solid]',
      'Context: play the bar before and after the sticky spot (D332.2)',
      'One full pass of today’s form slice at honest tempo (D332.3)',
      'Optional: mark the chart with one pencil improvement (D332.4)'
    ],
    libraryIds: ['sg-auld-lang-syne', 'sg-swing-low-sweet-chariot', 'rf-c-bass-walk-study', 'ch-g7', 'ch-dm'],
    masteryCheck: 'Day 332: Prove today’s repertoire step (Ornament After Solid) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-auld-lang-syne.',
  },
  333: {
    title: 'Signature Lick Placement — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Signature Lick Placement (focus: Signature Lick Placement)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 333 step 2',
      'End the session with a performance-shaped take, not only drills — day 333 step 3'
    ],
    theoryBite: 'Day 333 focus — Signature Lick Placement — Repertoire Day: Repertoire focus — Signature Lick Placement. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Signature Lick Placement (5–8 focused minutes) [Signature Lick Placement]',
      'Context: play the bar before and after the sticky spot (D333.2)',
      'One full pass of today’s form slice at honest tempo (D333.3)',
      'Optional: mark the chart with one pencil improvement (D333.4)'
    ],
    libraryIds: ['sg-swing-low-sweet-chariot', 'pr-1645', 'ch-d7', 'rf-spanish-e-phrygian-study', 'sg-mary-had-a-little-lamb'],
    masteryCheck: 'Day 333: Prove today’s repertoire step (Signature Lick Placement) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-swing-low-sweet-chariot.',
  },
  334: {
    title: 'Silence Schedule in Song — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Silence Schedule in Song (focus: Silence Schedule in Song)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 334 step 2',
      'End the session with a performance-shaped take, not only drills — day 334 step 3'
    ],
    theoryBite: 'Day 334 focus — Silence Schedule in Song — Repertoire Day: Repertoire focus — Silence Schedule in Song. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Silence Schedule in Song (5–8 focused minutes) [Silence Schedule in Song]',
      'Context: play the bar before and after the sticky spot (D334.2)',
      'One full pass of today’s form slice at honest tempo (D334.3)',
      'Optional: mark the chart with one pencil improvement (D334.4)'
    ],
    libraryIds: ['sg-mary-had-a-little-lamb', 'sg-row-row-row-your-boat', 'rf-funk-chicka-study', 'ch-a7', 'ch-g'],
    masteryCheck: 'Day 334: Prove today’s repertoire step (Silence Schedule in Song) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-mary-had-a-little-lamb.',
  },
  335: {
    title: 'Intro From Silence — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Intro From Silence (focus: Intro From Silence)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 335 step 2',
      'End the session with a performance-shaped take, not only drills — day 335 step 3'
    ],
    theoryBite: 'Day 335 focus — Intro From Silence — Repertoire Day: Repertoire focus — Intro From Silence. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Intro From Silence (5–8 focused minutes) [Intro From Silence]',
      'Context: play the bar before and after the sticky spot (D335.2)',
      'One full pass of today’s form slice at honest tempo (D335.3)',
      'Optional: mark the chart with one pencil improvement (D335.4)'
    ],
    libraryIds: ['sg-row-row-row-your-boat', 'pr-12bar', 'ch-e7', 'rf-palm-mute-chug-study', 'sg-fr-re-jacques'],
    masteryCheck: 'Day 335: Prove today’s repertoire step (Intro From Silence) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-row-row-row-your-boat.',
  },
  336: {
    title: 'Cold Ending Practice — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Cold Ending Practice (focus: Cold Ending Practice)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 336 step 2',
      'End the session with a performance-shaped take, not only drills — day 336 step 3'
    ],
    theoryBite: 'Day 336 focus — Cold Ending Practice — Repertoire Day: Repertoire focus — Cold Ending Practice. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Cold Ending Practice (5–8 focused minutes) [Cold Ending Practice]',
      'Context: play the bar before and after the sticky spot (D336.2)',
      'One full pass of today’s form slice at honest tempo (D336.3)',
      'Optional: mark the chart with one pencil improvement (D336.4)'
    ],
    libraryIds: ['sg-fr-re-jacques', 'sg-london-bridge', 'rf-jazz-chromatic-approach-study', 'ch-dm', 'ch-em'],
    masteryCheck: 'Day 336: Prove today’s repertoire step (Cold Ending Practice) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-fr-re-jacques.',
  },
  337: {
    title: 'Tag Ending Practice — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Tag Ending Practice (focus: Tag Ending Practice)',
      'Run a mini-set slice (2 sections minimum) — day 337 step 2',
      'Record and note one keep + one fix — day 337 step 3'
    ],
    theoryBite: 'Day 337 focus — Tag Ending Practice — Repertoire Day: Repertoire focus — Tag Ending Practice. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Tag Ending Practice (5–8 focused minutes) [Tag Ending Practice]',
      'Context: play the bar before and after the sticky spot (D337.2)',
      'One full pass of today’s form slice at honest tempo (D337.3)',
      'Optional: mark the chart with one pencil improvement (D337.4)'
    ],
    libraryIds: ['sg-london-bridge', 'pr-145', 'ch-c', 'rf-am-arpeggio-cascade', 'sg-this-old-man'],
    masteryCheck: 'Day 337: Weekly checkpoint: perform a multi-section slice showing progress on Tag Ending Practice, with one recorded take and a written keep/fix note.',
  },
  338: {
    title: 'Key Change Taste Optional — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Key Change Taste Optional (focus: Key Change Taste Optional)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 338 step 2',
      'End the session with a performance-shaped take, not only drills — day 338 step 3'
    ],
    theoryBite: 'Day 338 focus — Key Change Taste Optional — Repertoire Day: Repertoire focus — Key Change Taste Optional. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Key Change Taste Optional (5–8 focused minutes) [Key Change Taste Optional]',
      'Context: play the bar before and after the sticky spot (D338.2)',
      'One full pass of today’s form slice at honest tempo (D338.3)',
      'Optional: mark the chart with one pencil improvement (D338.4)'
    ],
    libraryIds: ['sg-this-old-man', 'sg-happy-birthday', 'rf-drop-d-power-study', 'ch-g', 'ch-e'],
    masteryCheck: 'Day 338: Prove today’s repertoire step (Key Change Taste Optional) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-this-old-man.',
  },
  339: {
    title: 'Modulation Walkup — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Modulation Walkup (focus: Modulation Walkup)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 339 step 2',
      'End the session with a performance-shaped take, not only drills — day 339 step 3'
    ],
    theoryBite: 'Day 339 focus — Modulation Walkup — Repertoire Day: Repertoire focus — Modulation Walkup. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Modulation Walkup (5–8 focused minutes) [Modulation Walkup]',
      'Context: play the bar before and after the sticky spot (D339.2)',
      'One full pass of today’s form slice at honest tempo (D339.3)',
      'Optional: mark the chart with one pencil improvement (D339.4)'
    ],
    libraryIds: ['sg-happy-birthday', 'pr-6251', 'ch-d', 'rf-travis-pick-sketch-in-c', 'sg-minuet-in-g-bach-public-domain'],
    masteryCheck: 'Day 339: Prove today’s repertoire step (Modulation Walkup) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-happy-birthday.',
  },
  340: {
    title: 'Stop-Time Section — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Stop-Time Section (focus: Stop-Time Section)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 340 step 2',
      'End the session with a performance-shaped take, not only drills — day 340 step 3'
    ],
    theoryBite: 'Day 340 focus — Stop-Time Section — Repertoire Day: Repertoire focus — Stop-Time Section. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Stop-Time Section (5–8 focused minutes) [Stop-Time Section]',
      'Context: play the bar before and after the sticky spot (D340.2)',
      'One full pass of today’s form slice at honest tempo (D340.3)',
      'Optional: mark the chart with one pencil improvement (D340.4)'
    ],
    libraryIds: ['sg-minuet-in-g-bach-public-domain', 'sg-f-r-elise-motif-beethoven-public', 'rf-natural-harmonics-study', 'ch-em', 'ch-f'],
    masteryCheck: 'Day 340: Prove today’s repertoire step (Stop-Time Section) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-minuet-in-g-bach-public-domain.',
  },
  341: {
    title: 'Breakdown Section — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Breakdown Section (focus: Breakdown Section)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 341 step 2',
      'End the session with a performance-shaped take, not only drills — day 341 step 3'
    ],
    theoryBite: 'Day 341 focus — Breakdown Section — Repertoire Day: Repertoire focus — Breakdown Section. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Breakdown Section (5–8 focused minutes) [Breakdown Section]',
      'Context: play the bar before and after the sticky spot (D341.2)',
      'One full pass of today’s form slice at honest tempo (D341.3)',
      'Optional: mark the chart with one pencil improvement (D341.4)'
    ],
    libraryIds: ['sg-f-r-elise-motif-beethoven-public', 'pr-andalu', 'ch-am', 'rf-minor-slide-lick-study', 'sg-canon-in-d-pachelbel-theme-publi'],
    masteryCheck: 'Day 341: Prove today’s repertoire step (Breakdown Section) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-f-r-elise-motif-beethoven-public.',
  },
  342: {
    title: 'Final Chorus Plus — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Final Chorus Plus (focus: Final Chorus Plus)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 342 step 2',
      'End the session with a performance-shaped take, not only drills — day 342 step 3'
    ],
    theoryBite: 'Day 342 focus — Final Chorus Plus — Repertoire Day: Repertoire focus — Final Chorus Plus. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Final Chorus Plus (5–8 focused minutes) [Final Chorus Plus]',
      'Context: play the bar before and after the sticky spot (D342.2)',
      'One full pass of today’s form slice at honest tempo (D342.3)',
      'Optional: mark the chart with one pencil improvement (D342.4)'
    ],
    libraryIds: ['sg-canon-in-d-pachelbel-theme-publi', 'sg-brahms-lullaby', 'rf-open-am', 'ch-e', 'ch-c7'],
    masteryCheck: 'Day 342: Prove today’s repertoire step (Final Chorus Plus) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-canon-in-d-pachelbel-theme-publi.',
  },
  343: {
    title: 'False Ending Fun — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: False Ending Fun (focus: False Ending Fun)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 343 step 2',
      'End the session with a performance-shaped take, not only drills — day 343 step 3'
    ],
    theoryBite: 'Day 343 focus — False Ending Fun — Repertoire Day: Repertoire focus — False Ending Fun. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at False Ending Fun (5–8 focused minutes) [False Ending Fun]',
      'Context: play the bar before and after the sticky spot (D343.2)',
      'One full pass of today’s form slice at honest tempo (D343.3)',
      'Optional: mark the chart with one pencil improvement (D343.4)'
    ],
    libraryIds: ['sg-brahms-lullaby', 'pr-1645', 'ch-a', 'rf-power', 'sg-blue-danube-motif-strauss-public'],
    masteryCheck: 'Day 343: Prove today’s repertoire step (False Ending Fun) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-brahms-lullaby.',
  },
  344: {
    title: 'Medley Bridge Writing — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Medley Bridge Writing (focus: Medley Bridge Writing)',
      'Run a mini-set slice (2 sections minimum) — day 344 step 2',
      'Record and note one keep + one fix — day 344 step 3'
    ],
    theoryBite: 'Day 344 focus — Medley Bridge Writing — Repertoire Day: Repertoire focus — Medley Bridge Writing. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Medley Bridge Writing (5–8 focused minutes) [Medley Bridge Writing]',
      'Context: play the bar before and after the sticky spot (D344.2)',
      'One full pass of today’s form slice at honest tempo (D344.3)',
      'Optional: mark the chart with one pencil improvement (D344.4)'
    ],
    libraryIds: ['sg-blue-danube-motif-strauss-public', 'sg-william-tell-motif-rossini-publi', 'rf-blues-sh', 'ch-f', 'ch-d7'],
    masteryCheck: 'Day 344: Weekly checkpoint: perform a multi-section slice showing progress on Medley Bridge Writing, with one recorded take and a written keep/fix note.',
  },
  345: {
    title: 'Repertoire Journaling — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Repertoire Journaling (focus: Repertoire Journaling)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 345 step 2',
      'End the session with a performance-shaped take, not only drills — day 345 step 3'
    ],
    theoryBite: 'Day 345 focus — Repertoire Journaling — Repertoire Day: Repertoire focus — Repertoire Journaling. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Repertoire Journaling (5–8 focused minutes) [Repertoire Journaling]',
      'Context: play the bar before and after the sticky spot (D345.2)',
      'One full pass of today’s form slice at honest tempo (D345.3)',
      'Optional: mark the chart with one pencil improvement (D345.4)'
    ],
    libraryIds: ['sg-william-tell-motif-rossini-publi', 'pr-12bar', 'ch-bm', 'rf-spider', 'sg-the-entertainer-motif-joplin-pub'],
    masteryCheck: 'Day 345: Prove today’s repertoire step (Repertoire Journaling) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-william-tell-motif-rossini-publi.',
  },
  346: {
    title: 'Goal Tempo Decision — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Goal Tempo Decision (focus: Goal Tempo Decision)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 346 step 2',
      'End the session with a performance-shaped take, not only drills — day 346 step 3'
    ],
    theoryBite: 'Day 346 focus — Goal Tempo Decision — Repertoire Day: Repertoire focus — Goal Tempo Decision. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Goal Tempo Decision (5–8 focused minutes) [Goal Tempo Decision]',
      'Context: play the bar before and after the sticky spot (D346.2)',
      'One full pass of today’s form slice at honest tempo (D346.3)',
      'Optional: mark the chart with one pencil improvement (D346.4)'
    ],
    libraryIds: ['sg-the-entertainer-motif-joplin-pub', 'sg-shenandoah', 'rf-caged-c', 'ch-c7', 'ch-e7'],
    masteryCheck: 'Day 346: Prove today’s repertoire step (Goal Tempo Decision) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-the-entertainer-motif-joplin-pub.',
  },
  347: {
    title: 'Practice Tempo Loyalty — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Practice Tempo Loyalty (focus: Practice Tempo Loyalty)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 347 step 2',
      'End the session with a performance-shaped take, not only drills — day 347 step 3'
    ],
    theoryBite: 'Day 347 focus — Practice Tempo Loyalty — Repertoire Day: Repertoire focus — Practice Tempo Loyalty. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Practice Tempo Loyalty (5–8 focused minutes) [Practice Tempo Loyalty]',
      'Context: play the bar before and after the sticky spot (D347.2)',
      'One full pass of today’s form slice at honest tempo (D347.3)',
      'Optional: mark the chart with one pencil improvement (D347.4)'
    ],
    libraryIds: ['sg-shenandoah', 'pr-145', 'ch-g7', 'rf-open-g-roll-study', 'sg-red-river-valley'],
    masteryCheck: 'Day 347: Prove today’s repertoire step (Practice Tempo Loyalty) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-shenandoah.',
  },
  348: {
    title: 'Performance Tempo Courage — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Performance Tempo Courage (focus: Performance Tempo Courage)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 348 step 2',
      'End the session with a performance-shaped take, not only drills — day 348 step 3'
    ],
    theoryBite: 'Day 348 focus — Performance Tempo Courage — Repertoire Day: Repertoire focus — Performance Tempo Courage. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Performance Tempo Courage (5–8 focused minutes) [Performance Tempo Courage]',
      'Context: play the bar before and after the sticky spot (D348.2)',
      'One full pass of today’s form slice at honest tempo (D348.3)',
      'Optional: mark the chart with one pencil improvement (D348.4)'
    ],
    libraryIds: ['sg-red-river-valley', 'sg-home-on-the-range', 'rf-em-pentatonic-box-study', 'ch-d7', 'ch-c'],
    masteryCheck: 'Day 348: Prove today’s repertoire step (Performance Tempo Courage) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-red-river-valley.',
  },
  349: {
    title: 'Error Budget Acceptance — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Error Budget Acceptance (focus: Error Budget Acceptance)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 349 step 2',
      'End the session with a performance-shaped take, not only drills — day 349 step 3'
    ],
    theoryBite: 'Day 349 focus — Error Budget Acceptance — Repertoire Day: Repertoire focus — Error Budget Acceptance. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Error Budget Acceptance (5–8 focused minutes) [Error Budget Acceptance]',
      'Context: play the bar before and after the sticky spot (D349.2)',
      'One full pass of today’s form slice at honest tempo (D349.3)',
      'Optional: mark the chart with one pencil improvement (D349.4)'
    ],
    libraryIds: ['sg-home-on-the-range', 'pr-6251', 'ch-a7', 'rf-d-folk-pattern-study', 'sg-turkey-in-the-straw'],
    masteryCheck: 'Day 349: Prove today’s repertoire step (Error Budget Acceptance) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-home-on-the-range.',
  },
  350: {
    title: 'Smile & Breathe Reset — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Smile & Breathe Reset (focus: Smile & Breathe Reset)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 350 step 2',
      'End the session with a performance-shaped take, not only drills — day 350 step 3'
    ],
    theoryBite: 'Day 350 focus — Smile & Breathe Reset — Repertoire Day: Repertoire focus — Smile & Breathe Reset. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Smile & Breathe Reset (5–8 focused minutes) [Smile & Breathe Reset]',
      'Context: play the bar before and after the sticky spot (D350.2)',
      'One full pass of today’s form slice at honest tempo (D350.3)',
      'Optional: mark the chart with one pencil improvement (D350.4)'
    ],
    libraryIds: ['sg-turkey-in-the-straw', 'sg-arkansas-traveler', 'rf-a-blues-turnaround-study', 'ch-e7', 'ch-d'],
    masteryCheck: 'Day 350: Prove today’s repertoire step (Smile & Breathe Reset) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-turkey-in-the-straw.',
  },
  351: {
    title: 'Stage Plot Minimal — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Stage Plot Minimal (focus: Stage Plot Minimal)',
      'Run a mini-set slice (2 sections minimum) — day 351 step 2',
      'Record and note one keep + one fix — day 351 step 3'
    ],
    theoryBite: 'Day 351 focus — Stage Plot Minimal — Repertoire Day: Repertoire focus — Stage Plot Minimal. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Stage Plot Minimal (5–8 focused minutes) [Stage Plot Minimal]',
      'Context: play the bar before and after the sticky spot (D351.2)',
      'One full pass of today’s form slice at honest tempo (D351.3)',
      'Optional: mark the chart with one pencil improvement (D351.4)'
    ],
    libraryIds: ['sg-arkansas-traveler', 'pr-andalu', 'ch-dm', 'rf-g-caged-run-study', 'sg-sailor-s-hornpipe'],
    masteryCheck: 'Day 351: Weekly checkpoint: perform a multi-section slice showing progress on Stage Plot Minimal, with one recorded take and a written keep/fix note.',
  },
  352: {
    title: 'Gear Check Ritual — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Gear Check Ritual (focus: Gear Check Ritual)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 352 step 2',
      'End the session with a performance-shaped take, not only drills — day 352 step 3'
    ],
    theoryBite: 'Day 352 focus — Gear Check Ritual — Repertoire Day: Repertoire focus — Gear Check Ritual. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Gear Check Ritual (5–8 focused minutes) [Gear Check Ritual]',
      'Context: play the bar before and after the sticky spot (D352.2)',
      'One full pass of today’s form slice at honest tempo (D352.3)',
      'Optional: mark the chart with one pencil improvement (D352.4)'
    ],
    libraryIds: ['sg-sailor-s-hornpipe', 'sg-drunken-sailor', 'rf-c-bass-walk-study', 'ch-c', 'ch-am'],
    masteryCheck: 'Day 352: Prove today’s repertoire step (Gear Check Ritual) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-sailor-s-hornpipe.',
  },
  353: {
    title: 'Tuning Check Ritual — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Tuning Check Ritual (focus: Tuning Check Ritual)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 353 step 2',
      'End the session with a performance-shaped take, not only drills — day 353 step 3'
    ],
    theoryBite: 'Day 353 focus — Tuning Check Ritual — Repertoire Day: Repertoire focus — Tuning Check Ritual. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Tuning Check Ritual (5–8 focused minutes) [Tuning Check Ritual]',
      'Context: play the bar before and after the sticky spot (D353.2)',
      'One full pass of today’s form slice at honest tempo (D353.3)',
      'Optional: mark the chart with one pencil improvement (D353.4)'
    ],
    libraryIds: ['sg-drunken-sailor', 'pr-1645', 'ch-g', 'rf-spanish-e-phrygian-study', 'sg-molly-malone'],
    masteryCheck: 'Day 353: Prove today’s repertoire step (Tuning Check Ritual) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-drunken-sailor.',
  },
  354: {
    title: 'Setlist Timing Math — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Setlist Timing Math (focus: Setlist Timing Math)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 354 step 2',
      'End the session with a performance-shaped take, not only drills — day 354 step 3'
    ],
    theoryBite: 'Day 354 focus — Setlist Timing Math — Repertoire Day: Repertoire focus — Setlist Timing Math. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Setlist Timing Math (5–8 focused minutes) [Setlist Timing Math]',
      'Context: play the bar before and after the sticky spot (D354.2)',
      'One full pass of today’s form slice at honest tempo (D354.3)',
      'Optional: mark the chart with one pencil improvement (D354.4)'
    ],
    libraryIds: ['sg-molly-malone', 'sg-the-parting-glass', 'rf-funk-chicka-study', 'ch-d', 'ch-a'],
    masteryCheck: 'Day 354: Prove today’s repertoire step (Setlist Timing Math) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-molly-malone.',
  },
  355: {
    title: 'Encore Decision Logic — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Encore Decision Logic (focus: Encore Decision Logic)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 355 step 2',
      'End the session with a performance-shaped take, not only drills — day 355 step 3'
    ],
    theoryBite: 'Day 355 focus — Encore Decision Logic — Repertoire Day: Repertoire focus — Encore Decision Logic. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Encore Decision Logic (5–8 focused minutes) [Encore Decision Logic]',
      'Context: play the bar before and after the sticky spot (D355.2)',
      'One full pass of today’s form slice at honest tempo (D355.3)',
      'Optional: mark the chart with one pencil improvement (D355.4)'
    ],
    libraryIds: ['sg-the-parting-glass', 'pr-12bar', 'ch-em', 'rf-palm-mute-chug-study', 'sg-simple-gifts'],
    masteryCheck: 'Day 355: Prove today’s repertoire step (Encore Decision Logic) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-the-parting-glass.',
  },
  356: {
    title: 'Two-Song Mini Set — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Two-Song Mini Set (focus: Two-Song Mini Set)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 356 step 2',
      'End the session with a performance-shaped take, not only drills — day 356 step 3'
    ],
    theoryBite: 'Day 356 focus — Two-Song Mini Set — Repertoire Day: Repertoire focus — Two-Song Mini Set. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Two-Song Mini Set (5–8 focused minutes) [Two-Song Mini Set]',
      'Context: play the bar before and after the sticky spot (D356.2)',
      'One full pass of today’s form slice at honest tempo (D356.3)',
      'Optional: mark the chart with one pencil improvement (D356.4)'
    ],
    libraryIds: ['sg-simple-gifts', 'sg-wayfaring-stranger', 'rf-jazz-chromatic-approach-study', 'ch-am', 'ch-bm'],
    masteryCheck: 'Day 356: Prove today’s repertoire step (Two-Song Mini Set) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-simple-gifts.',
  },
  357: {
    title: 'Three-Song Mini Set — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Three-Song Mini Set (focus: Three-Song Mini Set)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 357 step 2',
      'End the session with a performance-shaped take, not only drills — day 357 step 3'
    ],
    theoryBite: 'Day 357 focus — Three-Song Mini Set — Repertoire Day: Repertoire focus — Three-Song Mini Set. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Three-Song Mini Set (5–8 focused minutes) [Three-Song Mini Set]',
      'Context: play the bar before and after the sticky spot (D357.2)',
      'One full pass of today’s form slice at honest tempo (D357.3)',
      'Optional: mark the chart with one pencil improvement (D357.4)'
    ],
    libraryIds: ['sg-wayfaring-stranger', 'pr-145', 'ch-e', 'rf-am-arpeggio-cascade', 'sg-barbara-allen'],
    masteryCheck: 'Day 357: Prove today’s repertoire step (Three-Song Mini Set) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-wayfaring-stranger.',
  },
  358: {
    title: 'Full Run With Notes — Repertoire Day',
    durationMin: 30,
    goals: [
      'Weekly repertoire checkpoint emphasizing Full Run With Notes (focus: Full Run With Notes)',
      'Run a mini-set slice (2 sections minimum) — day 358 step 2',
      'Record and note one keep + one fix — day 358 step 3'
    ],
    theoryBite: 'Day 358 focus — Full Run With Notes — Repertoire Day: Repertoire focus — Full Run With Notes. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Full Run With Notes (5–8 focused minutes) [Full Run With Notes]',
      'Context: play the bar before and after the sticky spot (D358.2)',
      'One full pass of today’s form slice at honest tempo (D358.3)',
      'Optional: mark the chart with one pencil improvement (D358.4)'
    ],
    libraryIds: ['sg-barbara-allen', 'sg-down-by-the-riverside', 'rf-drop-d-power-study', 'ch-a', 'ch-g7'],
    masteryCheck: 'Day 358: Weekly checkpoint: perform a multi-section slice showing progress on Full Run With Notes, with one recorded take and a written keep/fix note.',
  },
  359: {
    title: 'Full Run No Notes — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Full Run No Notes (focus: Full Run No Notes)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 359 step 2',
      'End the session with a performance-shaped take, not only drills — day 359 step 3'
    ],
    theoryBite: 'Day 359 focus — Full Run No Notes — Repertoire Day: Repertoire focus — Full Run No Notes. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Full Run No Notes (5–8 focused minutes) [Full Run No Notes]',
      'Context: play the bar before and after the sticky spot (D359.2)',
      'One full pass of today’s form slice at honest tempo (D359.3)',
      'Optional: mark the chart with one pencil improvement (D359.4)'
    ],
    libraryIds: ['sg-down-by-the-riverside', 'pr-6251', 'ch-f', 'rf-travis-pick-sketch-in-c', 'sg-skip-to-my-lou'],
    masteryCheck: 'Day 359: Prove today’s repertoire step (Full Run No Notes) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-down-by-the-riverside.',
  },
  360: {
    title: 'Dress Rehearsal Energy — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Dress Rehearsal Energy (focus: Dress Rehearsal Energy)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 360 step 2',
      'End the session with a performance-shaped take, not only drills — day 360 step 3'
    ],
    theoryBite: 'Day 360 focus — Dress Rehearsal Energy — Repertoire Day: Repertoire focus — Dress Rehearsal Energy. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Dress Rehearsal Energy (5–8 focused minutes) [Dress Rehearsal Energy]',
      'Context: play the bar before and after the sticky spot (D360.2)',
      'One full pass of today’s form slice at honest tempo (D360.3)',
      'Optional: mark the chart with one pencil improvement (D360.4)'
    ],
    libraryIds: ['sg-skip-to-my-lou', 'sg-i-ve-been-working-on-the-railroa', 'rf-natural-harmonics-study', 'ch-bm', 'ch-a7'],
    masteryCheck: 'Day 360: Prove today’s repertoire step (Dress Rehearsal Energy) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-skip-to-my-lou.',
  },
  361: {
    title: 'Pre-Show Light Day — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Pre-Show Light Day (focus: Pre-Show Light Day)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 361 step 2',
      'End the session with a performance-shaped take, not only drills — day 361 step 3'
    ],
    theoryBite: 'Day 361 focus — Pre-Show Light Day — Repertoire Day: Repertoire focus — Pre-Show Light Day. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Pre-Show Light Day (5–8 focused minutes) [Pre-Show Light Day]',
      'Context: play the bar before and after the sticky spot (D361.2)',
      'One full pass of today’s form slice at honest tempo (D361.3)',
      'Optional: mark the chart with one pencil improvement (D361.4)'
    ],
    libraryIds: ['sg-i-ve-been-working-on-the-railroa', 'pr-andalu', 'ch-c7', 'rf-minor-slide-lick-study', 'sg-she-ll-be-coming-round-the-mount'],
    masteryCheck: 'Day 361: Prove today’s repertoire step (Pre-Show Light Day) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-i-ve-been-working-on-the-railroa.',
  },
  362: {
    title: 'Capstone Rehearsal A — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Capstone Rehearsal A (focus: Capstone Rehearsal A)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 362 step 2',
      'End the session with a performance-shaped take, not only drills — day 362 step 3'
    ],
    theoryBite: 'Day 362 focus — Capstone Rehearsal A — Repertoire Day: Repertoire focus — Capstone Rehearsal A. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Capstone Rehearsal A (5–8 focused minutes) [Capstone Rehearsal A]',
      'Context: play the bar before and after the sticky spot (D362.2)',
      'One full pass of today’s form slice at honest tempo (D362.3)',
      'Optional: mark the chart with one pencil improvement (D362.4)'
    ],
    libraryIds: ['sg-she-ll-be-coming-round-the-mount', 'sg-house-of-the-rising-sun', 'rf-open-am', 'ch-g7', 'ch-dm'],
    masteryCheck: 'Day 362: Prove today’s repertoire step (Capstone Rehearsal A) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-she-ll-be-coming-round-the-mount.',
  },
  363: {
    title: 'Capstone Rehearsal B — Repertoire Day',
    durationMin: 30,
    goals: [
      'Advance your vehicle song through: Capstone Rehearsal B (focus: Capstone Rehearsal B)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 363 step 2',
      'End the session with a performance-shaped take, not only drills — day 363 step 3'
    ],
    theoryBite: 'Day 363 focus — Capstone Rehearsal B — Repertoire Day: Repertoire focus — Capstone Rehearsal B. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Capstone Rehearsal B (5–8 focused minutes) [Capstone Rehearsal B]',
      'Context: play the bar before and after the sticky spot (D363.2)',
      'One full pass of today’s form slice at honest tempo (D363.3)',
      'Optional: mark the chart with one pencil improvement (D363.4)'
    ],
    libraryIds: ['sg-house-of-the-rising-sun', 'pr-1645', 'ch-d7', 'rf-power', 'sg-black-is-the-color'],
    masteryCheck: 'Day 363: Prove today’s repertoire step (Capstone Rehearsal B) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-house-of-the-rising-sun.',
  },
  364: {
    title: 'Capstone Rehearsal C — Repertoire Day',
    durationMin: 35,
    goals: [
      'Advance your vehicle song through: Capstone Rehearsal C (focus: Capstone Rehearsal C)',
      'Keep one measurable win (cleaner bar, stabler tempo, or clearer form) — day 364 step 2',
      'End the session with a performance-shaped take, not only drills — day 364 step 3'
    ],
    theoryBite: 'Day 364 focus — Capstone Rehearsal C — Repertoire Day: Repertoire focus — Capstone Rehearsal C. Motor learning favors slow accurate loops of the sticky bar, then context. Performance practice includes recovery: when you flub, keep time and rejoin.',
    drills: [
      'Section work aimed at Capstone Rehearsal C (5–8 focused minutes) [Capstone Rehearsal C]',
      'Context: play the bar before and after the sticky spot (D364.2)',
      'One full pass of today’s form slice at honest tempo (D364.3)',
      'Optional: mark the chart with one pencil improvement (D364.4)'
    ],
    libraryIds: ['sg-black-is-the-color', 'sg-wild-mountain-thyme', 'rf-blues-sh', 'ch-a7', 'ch-g'],
    masteryCheck: 'Day 364: Prove today’s repertoire step (Capstone Rehearsal C) with a tangible outcome: a cleaner target section, a stabler tempo map, or a keepable take slice on sg-black-is-the-color.',
  },
  365: {
    title: 'Day 365 — Full Path Capstone Performance',
    durationMin: 45,
    goals: [
      'Perform a mini-set proving rhythm, lead taste, and song craft (focus: Day 365)',
      'Include recovery from one mistake without stopping time — day 365 step 2',
      'Journal a kind next-30-day intention — day 365 step 3'
    ],
    theoryBite: 'Day 365 focus — Day 365 — Full Path Capstone Performance: Day 365 is evidence you can finish art across a long horizon — not the end of learning. Celebrate completion; plan the next arc.',
    drills: [
      'Light warm-up (hands + one easy song fragment) [Day 365]',
      'Capstone mini-set take (aim keepable) (D365.2)',
      'Listen once with kindness and once with a pencil (D365.3)',
      'Write next-arc intention: one skill, one song, one habit (D365.4)'
    ],
    libraryIds: ['pr-andalu', 'ch-am', 'ch-g', 'ch-f', 'ch-e'],
    masteryCheck: 'Day 365: Deliver a capstone mini-set that shows groove, lead taste, and finished song sections — then write your next 30-day intention.',
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
