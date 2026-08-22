/**
 * GuitarRemedy offline wiki — music theory, guitar craft, and app guides.
 * Canonical source for in-app /wiki and mirrored under docs/wiki/.
 */

export type WikiCategory =
  | 'start'
  | 'music'
  | 'guitar'
  | 'practice'
  | 'app'
  | 'facts'

export interface WikiArticle {
  id: string
  title: string
  category: WikiCategory
  summary: string
  tags: string[]
  /** Markdown-ish body (paragraphs, lists, tables as plain text blocks). */
  body: string
}

export const WIKI_CATEGORIES: { id: WikiCategory; label: string; blurb: string }[] = [
  { id: 'start', label: 'Start here', blurb: 'Orientation and how to use this book' },
  { id: 'music', label: 'Music theory', blurb: 'Notes, intervals, scales, harmony, rhythm' },
  { id: 'guitar', label: 'Guitar craft', blurb: 'Neck, fretting, CAGED, technique, gear' },
  { id: 'practice', label: 'Practice & learning', blurb: 'How to get better without burning out' },
  { id: 'app', label: 'Using GuitarRemedy', blurb: 'Lessons, library, upload, tabs, desktop' },
  { id: 'facts', label: 'Guitar facts', blurb: 'History, culture, trivia, famous necks' },
]

export const WIKI_ARTICLES: WikiArticle[] = [
  // ── Start ──────────────────────────────────────────────
  {
    id: 'welcome',
    title: 'Welcome to the GuitarRemedy Wiki',
    category: 'start',
    summary: 'What this wiki is, how to navigate, and how it pairs with the app.',
    tags: ['intro', 'orientation'],
    body: `This is your offline guitar companion — music theory, neck craft, practice habits, and how GuitarRemedy works.

## How to use it
- Browse by **category** in the sidebar (or filters on mobile).
- Use **search** for a term like “Dorian”, “drop D”, or “upload”.
- Open related Practice / Learn / Library tools when an article points you there.

## How it pairs with the app
| Want to… | Go to |
|----------|--------|
| Daily guided lesson | **Learn** (Day 1–365) |
| Scales on the neck | **Practice** |
| Songs & riffs | **Library** |
| Your own song → tabs | **Upload** |
| Handedness, tuning, A4 | **You** (Profile) |
| Updates & links | **About** |

## Tone of this wiki
Clear, practical, and a little fun. Theory exists to make frets make sense — not to trap you in worksheets. When something is simplified for guitarists, we say so.

Hi I'm Ahmi — hope this helps.`,
  },
  {
    id: 'how-to-read-this-wiki',
    title: 'How to read theory pages',
    category: 'start',
    summary: 'Intervals in semitones, string numbering, and tab conventions used here.',
    tags: ['conventions', 'notation'],
    body: `## Pitch
- **Note names:** C C# D D# E F F# G G# A A# B (we use sharps by default; flats appear when harmony wants them).
- **Octave:** scientific pitch — middle C is **C4**, open high E on guitar is **E4**, open low E is **E2**.
- **MIDI number:** piano-style counting; open low E ≈ MIDI 40 in standard tuning (GuitarRemedy’s engine).

## Intervals
Counted in **semitones** (frets on one string):
| Semitones | Name | Example from C |
|-----------|------|----------------|
| 0 | Unison | C |
| 1 | Minor 2nd | C# / Db |
| 2 | Major 2nd | D |
| 3 | Minor 3rd | Eb |
| 4 | Major 3rd | E |
| 5 | Perfect 4th | F |
| 6 | Tritone | F# / Gb |
| 7 | Perfect 5th | G |
| 8 | Minor 6th | Ab |
| 9 | Major 6th | A |
| 10 | Minor 7th | Bb |
| 11 | Major 7th | B |
| 12 | Octave | C |

## Guitar string numbers in this app
Tab and fretting use **string 0 = high e** (thinnest), up to **string 5 = low E** (thickest). That matches many modern tab UIs. Classical “string 1 = high e” is the same physical string — only the index flips.

## Rhythm words
- **Beat** — pulse you tap your foot to.
- **Bar / measure** — group of beats (often 4 in 4/4).
- **Tempo** — beats per minute (BPM).
- **Subdivision** — splitting a beat (8ths, 16ths).`,
  },

  // ── Music theory ───────────────────────────────────────
  {
    id: 'notes-and-the-chromatic-scale',
    title: 'Notes & the chromatic scale',
    category: 'music',
    summary: 'Twelve pitch classes, enharmonics, and why the guitar repeats every 12 frets.',
    tags: ['notes', 'chromatic', 'octave'],
    body: `Western fretted music (for most of what you’ll play) divides the octave into **12 equal semitones**. That set of pitch classes is the **chromatic scale**.

## The loop
After 12 frets on one string you return to the same note name, one octave higher. That’s why a 12th-fret harmonic rings like the open string.

## Enharmonics
Same pitch, two names: C# = Db, F# = Gb, etc. Which name you use depends on **key and spelling** (a G major scale wants F#, not Gb).

## Guitar-friendly mental model
You don’t need to memorize 100 note names on day one. Learn:
1. Open string names (E A D G B E).
2. Natural notes on the low E and A strings (root finders).
3. Octave shapes (same note, different string/fret).

Practice → pick **Chromatic** or any scale and watch degrees light up on the neck.`,
  },
  {
    id: 'intervals',
    title: 'Intervals (the real alphabet)',
    category: 'music',
    summary: 'Why intervals matter more than note names for chords and melodies.',
    tags: ['intervals', 'harmony'],
    body: `An **interval** is the distance between two pitches. Melodies are strings of intervals; chords are intervals stacked from a root.

## Quality words
- **Perfect** — 4ths, 5ths, octaves (stable).
- **Major / minor** — 2nds, 3rds, 6ths, 7ths.
- **Augmented / diminished** — stretched or squeezed versions.

## Guitar shapes beat math
On one string, frets = semitones. Across strings, the tuning pattern (mostly 5 frets / perfect 4ths, with a 4-fret major 3rd between G and B) creates the famous chord and scale shapes.

## Sing it
Hum a root, then a fifth (power-chord distance). Then a minor third vs major third. Your ear learns faster than flashcards.

## In the app
Scale degrees on the fretboard (**1**, **b3**, **5**…) are interval labels relative to the scale root.`,
  },
  {
    id: 'major-scale',
    title: 'The major scale',
    category: 'music',
    summary: 'W-W-H-W-W-W-H — the home base for keys, modes, and happy melodies.',
    tags: ['scales', 'major', 'ionian'],
    body: `The **major scale** (Ionian mode) is the reference ruler. Formula in whole (W) and half (H) steps:

\`W W H W W W H\`

From C: C D E F G A B C  
Intervals from root: 0 2 4 5 7 9 11

## Degrees
| Degree | Role (simple) |
|--------|----------------|
| 1 | Tonic — home |
| 2 | Step above home |
| 3 | Major color (bright) |
| 4 | Subdominant flavor |
| 5 | Dominant — wants to resolve |
| 6 | Sweet / relative minor link |
| 7 | Leading tone — pulls to 1 |

## Why guitarists care
Almost every “happy” pop progression and CAGED major shape hangs on this scale. Modes are the major scale started on different degrees.

Open **Practice**, root C, scale Major — play ascending/descending slowly with a metronome.`,
  },
  {
    id: 'minor-scales',
    title: 'Natural, harmonic & melodic minor',
    category: 'music',
    summary: 'Three minor flavors and when guitarists actually use each.',
    tags: ['scales', 'minor', 'harmonic', 'melodic'],
    body: `## Natural minor (Aeolian)
Formula relative to major: flatten 3, 6, 7.  
Intervals: 0 2 3 5 7 8 10  
Sound: sad, modal folk, lots of rock verses.

## Harmonic minor
Raise the 7th of natural minor → **leading tone**.  
Intervals: 0 2 3 5 7 8 11  
Sound: classical cadences, metal/neoclassical, “exotic” step between b6 and 7.

## Melodic minor (jazz / ascending classical)
Natural minor with raised 6 and 7 (in modern/jazz use, often both directions).  
Intervals: 0 2 3 5 7 9 11  
Sound: smooth jazz lines, fusion, altered dominant cousins.

## Relative major/minor
A minor shares notes with C major. Same pool, different home base (tonic).

Try all three on **Practice** with root A and compare the 6th and 7th degrees on the neck.`,
  },
  {
    id: 'modes',
    title: 'Modes (Dorian to Locrian)',
    category: 'music',
    summary: 'Seven moods from one parent major scale — and how to hear each.',
    tags: ['modes', 'dorian', 'mixolydian', 'lydian'],
    body: `Modes are scales with the **same notes as a parent major**, but a different tonic.

| Mode | From major degree | Bright/dark hook | Signature color |
|------|-------------------|------------------|-----------------|
| Ionian | 1 | Bright home | Major 3 & 7 |
| Dorian | 2 | Minor but hopeful | b3 + natural 6 |
| Phrygian | 3 | Dark / Spanish | b2 |
| Lydian | 4 | Dreamy bright | #4 |
| Mixolydian | 5 | Bluesy major | b7 |
| Aeolian | 6 | Natural minor | b3 b6 b7 |
| Locrian | 7 | Unstable | b2 + b5 |

## Guitarist shortcuts
- **Dorian** — minor pentatonic + natural 6 (Dorian jam over static minor chords).
- **Mixolydian** — major with b7 (dominant grooves, classic rock).
- **Lydian** — major with #4 (film / dreamy leads).
- **Phrygian** — flat 2 (metal, flamenco flavor).

## Don’t get lost
Pick **one chord vamp** (e.g. Am for A Dorian) and improvise only that mode. Ear first, names second.`,
  },
  {
    id: 'pentatonic-and-blues',
    title: 'Pentatonic & blues scales',
    category: 'music',
    summary: 'Five-note freedom and the blue note that changed popular music.',
    tags: ['pentatonic', 'blues', 'rock'],
    body: `## Minor pentatonic
Intervals: 0 3 5 7 10 — degrees 1 b3 4 5 b7  
The backbone of rock, blues, and countless solos. Five notes = fewer “wrong” clashes.

## Major pentatonic
Intervals: 0 2 4 7 9 — degrees 1 2 3 5 6  
Country, classic rock melodies, “happy” fills. Same shape as minor pentatonic moved relative to a different root (C major pent ≈ A minor pent notes).

## Blues scale
Minor pentatonic + **b5** (the blue note): 0 3 5 6 7 10  
That chromatic bite between 4 and 5 is expressive — bend into it, don’t machine-gun it.

## Box shapes
Guitar culture teaches pentatonics as movable boxes. Learn one box perfectly (rhythm + phrasing), then connect boxes up the neck.

Library and Practice both spotlight these — they’re day-one friendly and lifetime deep.`,
  },
  {
    id: 'chords-triads-sevenths',
    title: 'Chords: triads to sevenths',
    category: 'music',
    summary: 'Stack thirds, name qualities, and hear maj / min / dim / aug / 7ths.',
    tags: ['chords', 'triads', 'sevenths'],
    body: `A **chord** is three or more notes heard as one harmony. The basic stack is **thirds** from a root.

## Triads
| Quality | Intervals from root | Sound |
|---------|---------------------|--------|
| Major | 0 4 7 | Stable, bright |
| Minor | 0 3 7 | Stable, dark |
| Diminished | 0 3 6 | Tense, wants to move |
| Augmented | 0 4 8 | Dreamy / unstable |
| Sus2 | 0 2 7 | Open, no 3rd |
| Sus4 | 0 5 7 | Open, unresolved 3rd |
| Power (5) | 0 7 | Root + fifth (rock) |

## Seventh chords (add another third)
| Quality | Intervals | Use |
|---------|-----------|-----|
| Dominant 7 | 0 4 7 10 | Blues, V chords |
| Major 7 | 0 4 7 11 | Jazz ballads, dreamy pop |
| Minor 7 | 0 3 7 10 | Soul, jazz, neo-soul |
| Half-dim m7b5 | 0 3 6 10 | Minor ii chords |
| Dim7 | 0 3 6 9 | Classical / transition spice |

## Inversions
Same notes, different bass note. Guitar voicings are full of partial chords and inversions — that’s a feature.

GuitarRemedy’s chord catalog matches these qualities in the theory engine.`,
  },
  {
    id: 'diatonic-harmony',
    title: 'Diatonic harmony & Roman numerals',
    category: 'music',
    summary: 'I–V–vi–IV and friends: functional harmony in plain language.',
    tags: ['harmony', 'progressions', 'roman numerals'],
    body: `In a major key, stack triads on each scale degree:

| Degree | In C | Quality | Function (simple) |
|--------|------|---------|-------------------|
| I | C | maj | Home |
| ii | Dm | min | Pre-dominant |
| iii | Em | min | Color / weak |
| IV | F | maj | Away, still open |
| V | G | maj | Tension → wants I |
| vi | Am | min | Relative minor home |
| vii° | Bdim | dim | Tension toward I |

## Famous loops
- **I–V–vi–IV** — endless pop.
- **I–IV–V** — blues/rock basic.
- **ii–V–I** — jazz cadence.
- **vi–IV–I–V** — emotional pop variant.

## Minor keys
Natural minor gives i ii° bIII iv v bVI bVII — but songs often borrow V major (from harmonic minor) for a stronger cadence.

## Guitar tip
Learn progressions as **shapes in a key**, then transpose by moving the whole grip up or down the neck (capo optional).`,
  },
  {
    id: 'circle-of-fifths',
    title: 'Circle of fifths',
    category: 'music',
    summary: 'Key signatures, closely related keys, and modulation without panic.',
    tags: ['keys', 'fifths', 'modulation'],
    body: `The **circle of fifths** arranges keys so neighbors share almost all notes.

Going **clockwise**: each step adds a sharp (or is a fifth up).  
Going **counter-clockwise**: each step adds a flat (fourth up / fifth down).

## Why it matters
- **Closely related keys** = easy modulations and borrowed chords.
- Relative majors/minors sit together (C maj / A min).
- Guitar: moving a shape up 7 frets is a fifth — same idea under your hand.

## Practical use
Writing a bridge? Try the key of the V or IV.  
Improvising? Know the IV and V of your home key cold.

You don’t need to draw the circle daily — you need to feel that G is “next door” to C, and D is next to G.`,
  },
  {
    id: 'rhythm-meter-groove',
    title: 'Rhythm, meter & groove',
    category: 'music',
    summary: 'Time signatures, subdivision, swing, and why rhythm beats speed.',
    tags: ['rhythm', 'tempo', 'groove'],
    body: `## Meter
- **4/4** — four quarter notes per bar (most popular music).
- **3/4** — waltz feel.
- **6/8** — two big beats, each split in three.
- **12/8** — blues shuffle cousin.

## Subdivision
Count **1 e & a** for sixteenths. If you can’t subdivide slowly, fast runs will rush.

## Swing & shuffle
Straight 8ths are even; swing delays the off-beat (long-short). Blues shuffles live here.

## Groove checklist
1. Tap foot on the pulse.
2. Record yourself — rushing is the silent enemy.
3. Leave space. Silence is rhythmic.

## In GuitarRemedy
Lessons build rhythm deliberately; tab playback respects tempo. When converting audio, set **tempo override** if detect drifts.`,
  },
  {
    id: 'ear-training-basics',
    title: 'Ear training basics',
    category: 'music',
    summary: 'Functional listening: intervals, chord quality, and singing what you play.',
    tags: ['ear', 'listening'],
    body: `Reading is optional. **Hearing** is not.

## Daily 5-minute drills
1. Play a root; sing a fifth; check on the guitar.
2. Coin-flip major vs minor triad — name it before looking.
3. Hum a simple melody, find it on one string.
4. Transcribe one bar of a song you love (even wrong drafts teach).

## Functional hearing
Don’t only name “major third” — hear it as **bright tonic color** vs minor’s darker third.

## App loop
Play a scale on Practice → sing degrees → play again. Upload a clean melody → compare tab to what you hear → edit with ±1 pitch.

Ear is a muscle. Short daily reps beat weekend cramming.`,
  },

  // ── Guitar craft ───────────────────────────────────────
  {
    id: 'anatomy-of-the-guitar',
    title: 'Anatomy of the guitar',
    category: 'guitar',
    summary: 'Body, neck, frets, hardware — what each part does for your hands and tone.',
    tags: ['gear', 'anatomy', 'setup'],
    body: `## Main parts
- **Headstock** — tuners; broken angle affects tension.
- **Nut** — spacing and height at fret 0; bad nut = buzz or high action.
- **Frets** — metal frets define semitones; wear creates buzz/intonation issues.
- **Fretboard / radius** — curve affects chording comfort and bends.
- **Neck relief** — tiny bow; adjusted via truss rod.
- **Body** — acoustic chamber or electric solid/semi; pickups on electrics.
- **Bridge / saddles** — intonation and action.
- **Pickups / electronics** — magnetic translators (electric).

## Setup basics (when to see a tech)
High action, fret buzz everywhere, strings slipping out of tune, sharp frets — a proper setup is not cheating; it’s hygiene.

## Acoustic vs electric
Acoustic rewards right-hand nuance and projection. Electric rewards sustain, effects, and lower action for speed — but still needs time feel.`,
  },
  {
    id: 'standard-tuning-and-beyond',
    title: 'Standard tuning & alternate tunings',
    category: 'guitar',
    summary: 'EADGBE logic, Drop D, open tunings, DADGAD — when and why.',
    tags: ['tuning', 'drop-d', 'open-g', 'dadgad'],
    body: `## Standard — E A D G B E
Mostly perfect fourths between strings, **except** G→B is a major third. That “kink” creates friendly chord shapes and the asymmetry of the neck.

Low to high: E2 A2 D3 G3 B3 E4 (approx).

## Common alternates in GuitarRemedy
| Tuning | Idea |
|--------|------|
| **Drop D** | Low E → D; instant power-chord shapes with one finger |
| **Half step down** | Darker, slinkier tension; matches many recordings |
| **Open G** | G-B-D-G-B-D family; stonesy/slide heaven |
| **Open D** | D-A-D-F#-A-D; resonators & slide |
| **DADGAD** | Modal folk / Celtic drone beauty |

## Safety
Retune gently. Big drops can rattle frets; big ups can stress necks — use appropriate string gauges.

Set tuning in **Profile / Practice** so the fretboard engine matches your hands.`,
  },
  {
    id: 'fretboard-logic',
    title: 'Fretboard logic & octave shapes',
    category: 'guitar',
    summary: 'Same notes everywhere — octaves, unisons, and finding roots fast.',
    tags: ['fretboard', 'octaves', 'navigation'],
    body: `The neck is a **grid of pitch classes**. Mastery is navigation, not memorizing every label at once.

## Root finders
1. Learn natural notes on **low E** and **A** strings.
2. Octave pattern: from a note on E string, same note is two strings down and two frets up (with the G–B quirk adjustments when crossing).
3. Unison: same pitch on adjacent strings differs by 5 frets (4 across G–B).

## CAGED preview
Five major chord “worlds” link into a complete neck map. See the CAGED article.

## Practice game
Pick a note (e.g. G). Find it on every string. Time yourself weekly — speed of finding roots predicts soloing confidence.

Use Practice with degree labels on; turn them off later and retest.`,
  },
  {
    id: 'caged-system',
    title: 'CAGED system',
    category: 'guitar',
    summary: 'Five open-chord shapes that unlock the whole neck for chords and scales.',
    tags: ['caged', 'chords', 'neck'],
    body: `**CAGED** = five open major shapes: **C, A, G, E, D**. Move them up the neck with a barre or partial barre and you can play any major triad anywhere.

## Why it works
Those shapes already contain the major triad tones. Sliding the shape moves the root — the quality stays major.

## Scale connection
Each CAGED chord shape has a matching major-scale pattern around it. Learn chord tone targets inside the shape first (1–3–5), then passing notes.

## Minor CAGED
Swap major thirds for minor thirds — five minor worlds appear.

## Don’t freeze
CAGED is a map, not a prison. Combine with triad inversions and pentatonic boxes as you grow.

Lessons in the middle of the 365 path revisit CAGED as “box escape routes.”`,
  },
  {
    id: 'technique-left-hand',
    title: 'Left-hand technique',
    category: 'guitar',
    summary: 'Fretting cleanly: thumb, arch, muting, barre survival.',
    tags: ['technique', 'fretting', 'barre'],
    body: `## Thumb
Behind the neck for classical clarity; over the top is fine for blues bends and thumb-fretted bass notes. Choose intentionally.

## Fingertips & arch
Come down just behind the fret wire (toward the bridge), not in the middle of the fret cell. Collapse = buzz.

## Economy
Don’t squeeze death-grip. Minimum pressure that speaks cleanly. Tension is the enemy of speed.

## Barres
Roll slightly onto the bony side of the index; align elbow; check each string. Build barre endurance in short sets.

## Muting
Idle fingers lightly kill unused strings. Clean rhythm guitar is 50% muting.

## Lefty
GuitarRemedy mirrors the neck when lefty mode is on — technique principles are the same.`,
  },
  {
    id: 'technique-right-hand',
    title: 'Right-hand technique',
    category: 'guitar',
    summary: 'Pick, fingers, hybrid — attack, dynamics, and string crossing.',
    tags: ['picking', 'fingerstyle', 'hybrid'],
    body: `## Flatpicking
- **Alternate picking** — down-up default for evenness.
- **Economy / directional** — sliding across strings with fewer motions (advanced).
- **Dynamics** — play soft on purpose; loud is easy, control is skill.

## Anchor or float
Some players plant pinky; others float. Consistency matters more than dogma.

## Fingerstyle
p-i-m-a classical assignment; Travis picking patterns; modern percussive ideas. Nails vs flesh changes tone.

## Hybrid
Pick + middle/ring fingers — country, fusion, modern acoustic.

## Strumming
Loose wrist, fretting-hand mutes for chucks, accent counts 2 and 4 for rock backbeat.

Record a simple open-chord song weekly — right hand quality shows up immediately.`,
  },
  {
    id: 'bends-slides-legato',
    title: 'Bends, slides, hammer-ons & pull-offs',
    category: 'guitar',
    summary: 'Expressive techniques that make scales sound like music.',
    tags: ['expression', 'bends', 'legato'],
    body: `## Bends
Push/pull the string to raise pitch. Target pitch must be in tune — match a fretted target note. Support with multiple fingers.

## Vibrato
Controlled pitch wobble after a note. Slow and wide vs fast and tight — style choice. Even vibrato > nervous shake.

## Slides
Shift into a target fret. Arrive in tune; don’t smear past forever unless that’s the effect.

## Hammer-on / pull-off
Legato without a new pick attack. Pull-offs need a tiny pluck downward. Even volume is the drill.

## Phrasing
Technique serves sentences. Play a pentatonic box as questions and answers, not a scale exam.

Blues and rock lessons in Learn lean hard on these.`,
  },
  {
    id: 'reading-tab',
    title: 'How to read guitar tab',
    category: 'guitar',
    summary: 'Tab lines, rhythm caveats, and how GuitarRemedy tab JSON maps to the neck.',
    tags: ['tab', 'notation'],
    body: `## Classic ASCII tab
Six lines = six strings. Numbers = frets. Usually high e on top:

\`\`\`
e|--0--2--3--|
B|--0--3--0--|
G|--0--2--0--|
D|--2--0--0--|
A|--2-----2--|
E|--0-----3--|
\`\`\`

## Rhythm
Plain tab often omits precise rhythm — listen to the reference or use a player with durations (GuitarRemedy stores duration in beats).

## Symbols you’ll meet
h = hammer-on, p = pull-off, b = bend, / \\ = slides, x = mute, ~ = vibrato.

## In this app
- Library & Your tabs render interactive tab.
- Editor lets you nudge pitch, clean up timing, keep first N bars.
- Export \`.grtab.json\`, ASCII, or MIDI.

## Standard notation
Optional later skill. Tab gets you playing; notation teaches pitch independent of guitar shape.`,
  },
  {
    id: 'tone-and-gear-basics',
    title: 'Tone & gear basics',
    category: 'guitar',
    summary: 'Hands first, then strings, amp, pedals — a sane order of operations.',
    tags: ['tone', 'amp', 'pedals', 'strings'],
    body: `## Order of impact (honest)
1. **Hands & dynamics**
2. **Strings & setup**
3. **Guitar + pickups**
4. **Amp / IR / modeler**
5. **Pedals / FX chain**

Buying another overdrive rarely fixes timing.

## Strings
Lighter = easier bends, flabbier low end. Heavier = tighter, harder fretting. Match gauge to tuning.

## Amp mental model
Gain stages stack. Power-amp crunch ≠ preamp distortion. Bedroom volumes lie — use attenuators/modelers wisely.

## FX starter chain
Guitar → tuner → gain → modulation → delay/reverb → amp  
(or amp first in the room; modelers vary).

## Acoustic
Mic position and room matter more than most preamps.`,
  },

  // ── Practice ───────────────────────────────────────────
  {
    id: 'how-to-practice',
    title: 'How to practice (so it sticks)',
    category: 'practice',
    summary: 'Short focused sessions beat marathon noodling — a simple weekly template.',
    tags: ['practice', 'habits', 'metronome'],
    body: `## The 25–40 minute template
1. **Warm-up** (3–5 min) — chromatic or easy finger moves, slow.
2. **Technique focus** (8–10) — one skill (barre, alternate picking, bend intonation).
3. **Lesson / repertoire** (10–15) — Learn path or a song section.
4. **Creative** (5) — improvise or write a riff.
5. **Cool-down** (2) — play something you love softly.

## Rules that work
- **Metronome is truth.** Speed is a side effect of accuracy.
- **One bottleneck at a time.** Don’t fix timing and fretting and tone simultaneously.
- **Stop while focused.** Exhausted reps teach slop.
- **Sleep consolidates.** Daily > heroic Sunday.

## GuitarRemedy loop
Open **Learn** for structure → **Practice** for the scale under the lesson → **Library** to apply → streak on Home keeps the chain visible.`,
  },
  {
    id: 'metronome-and-tempo-ladders',
    title: 'Metronome & tempo ladders',
    category: 'practice',
    summary: 'Raise BPM only after clean reps — the ladder method.',
    tags: ['metronome', 'speed'],
    body: `## Ladder method
1. Find the fastest tempo you can play **perfectly** (no tension, no mistakes for 3 reps).
2. Bump **+4–8 BPM**.
3. If you fail twice, drop back.
4. End a session on a clean success.

## Subdivide
At slow tempos, feel 8ths or 16ths so the pulse doesn’t wobble.

## Groove > click slavery
Eventually practice with drum loops and backing tracks — but the click builds the internal clock first.

Tab playback speed control is a ladder tool — use it.`,
  },
  {
    id: 'learning-songs',
    title: 'Learning songs efficiently',
    category: 'practice',
    summary: 'Sectioning, chunking, and when to use tabs vs your ear.',
    tags: ['songs', 'repertoire'],
    body: `## Chunking
Learn **one phrase** until automatic, then glue. Whole-song run-throughs too early encode panic.

## Layers
1. Rhythm & form (when do chords change?)
2. Right-hand pattern
3. Fills / riffs
4. Dynamics & vocal cues

## Tab vs ear
Tab accelerates; ear owns the music. Hybrid: tab for roadmap, ear for articulation and swing.

## In-app
Library free songs are full-length study pieces. Your uploads land in **Your tabs** — edit until they match what you hear, then practice with Play/Stop and speed.`,
  },
  {
    id: 'plateaus-and-motivation',
    title: 'Plateaus, frustration & fun',
    category: 'practice',
    summary: 'Why progress feels stuck — and how to make practice addictive again.',
    tags: ['mindset', 'motivation'],
    body: `Plateaus are normal. Your ears improve before your hands, so you hear flaws you couldn’t detect last month — that’s growth wearing a disguise.

## Unstick moves
- Change repertoire style for a week.
- Drop tempo 20% and perfect tone.
- Film a 30-second clip; compare in two weeks.
- Play with another human or a backing track.

## Fun is fuel
If every session is spinach, you’ll quit. Keep a “dessert” riff. GuitarRemedy’s jam segments in lessons exist on purpose.

## Body
Stretch wrists/shoulders. Pain ≠ virtue. Adjust posture and take breaks.`,
  },
  {
    id: '365-path-overview',
    title: 'The Day 1–365 path',
    category: 'practice',
    summary: 'How the private-lesson curriculum is phased across a year.',
    tags: ['curriculum', 'learn'],
    body: `GuitarRemedy’s Learn mode is structured like a **year of private lessons**, not a random drill dump.

## Phases (approx.)
| Days | Focus |
|------|--------|
| 1–30 | Posture, open chords, strumming, first songs |
| 31–60 | Barres emerging, rhythm vocabulary |
| 61–90 | Pentatonics & simple lead |
| 91–120 | Scale worlds & modes intro |
| 121–150 | Rhythm guitar depth |
| 151–180 | Lead phrasing |
| 181–240 | Integration & style studies |
| 241–300 | Repertoire & musicality |
| 301–365 | Capstone projects & lifelong habits |

Each day aims at a ~30-minute arc: arrive → warm-up → teach → guided play → jam → cool-down.

Skip ahead if a day is easy; repeat if it isn’t. The streak is a nudge, not a judge.`,
  },

  // ── App guides ─────────────────────────────────────────
  {
    id: 'app-home-and-shell',
    title: 'Home, navigation & streaks',
    category: 'app',
    summary: 'Getting around GuitarRemedy on desktop and phone layouts.',
    tags: ['ui', 'home'],
    body: `## Navigation
- **Desktop:** left rail — Home, Learn, Library, Practice, Upload, You, About, Wiki.
- **Mobile:** bottom bar + top brand strip.

## Home
Jump back into today’s lesson, see streak, and peek at what the app offers. Dark Forest theme and custom art set the mood — calm focus, not neon chaos.

## Streak
Stored locally. Practice or complete lesson check-ins to keep it alive. Missing a day isn’t failure; restarting is the skill.`,
  },
  {
    id: 'app-learn',
    title: 'Learn mode (private lessons)',
    category: 'app',
    summary: 'Day picker, segments, easy mode, and linking drills to the neck.',
    tags: ['learn', 'lessons'],
    body: `Open **Learn** for the guided path.

## Features
- Jump to any day 1–365.
- Phase progress awareness.
- Private-lesson segments with coach notes.
- Easy mode when a day feels heavy.
- Drills you can check off; library cards deep-link related material.

## Tips
- Keep the guitar on your body before reading the whole page.
- Do the jam even if it’s silly — ownership beats perfection.
- Revisit early days after month 6; you’ll play them differently.`,
  },
  {
    id: 'app-practice',
    title: 'Practice fretboard',
    category: 'app',
    summary: 'Scales, degrees, lefty, tunings, and play-along.',
    tags: ['practice', 'fretboard', 'scales'],
    body: `**Practice** is the interactive neck.

## Try this
1. Pick root **A**, scale **minor pentatonic**.
2. Turn on degree labels.
3. Play-along slowly.
4. Switch to **Dorian** and listen for the natural 6.
5. Toggle lefty if needed; set tuning to match your guitar.

## Goals
Map ears ↔ shapes. Five focused minutes here before a song session pays rent.`,
  },
  {
    id: 'app-library',
    title: 'Library & Your tabs',
    category: 'app',
    summary: 'Free-license songs, filters, favorites, import/export.',
    tags: ['library', 'tabs'],
    body: `## Built-in library
Scales, chords, riffs, and **60+ free-license / public-domain / original study** pieces. No commercial copyrighted tracks shipped.

## Your tabs
Eternal on-device list of conversions and edits. Import \`.grtab.json\`, export MIDI / ASCII / grtab, edit, delete.

## Filters
Skill, kind, search, favorites. Open a song → Play/Stop → Edit when it’s yours.

License note: respect copyright for anything you upload; built-ins are cleared for redistribution as study material.`,
  },
  {
    id: 'app-upload-breakdown',
    title: 'Upload & song breakdown',
    category: 'app',
    summary: 'Audio → MIDI → tabs, solid MIDI/MusicXML/GP paths, editor loop.',
    tags: ['upload', 'audio', 'midi', 'conversion'],
    body: `## Best inputs (quality order)
1. **MIDI / MusicXML** — solid, deterministic tabs + analysis.
2. **Guitar Pro** — best-effort (GPIF/zip often works; old binary may ask you to export MIDI/MusicXML).
3. **Audio** — MP3, WAV, M4A, OGG, FLAC, etc. → lead-oriented pitch track → MIDI → fretting → auto clean.

## Audio tips that actually help
- Prefer **single-note melody** or isolated lead.
- Full-band mixes are monophonic **drafts** — drums/bass confuse pitch.
- Use **trim seconds** for long files.
- Check **detected tempo**; override if the grid feels wrong.
- Hit **Clean up** in the editor; nudge pitch ±1; keep first N bars if the tail is noise.
- Save to **Your tabs**; export if you want a backup.

## Pipeline honesty
This is assisted transcription, not a studio goblin that perfects every Stevie solo. Your ear is the final authority — that’s why the editor exists.`,
  },
  {
    id: 'app-profile-about',
    title: 'Profile, About & updates',
    category: 'app',
    summary: 'Local settings, Ahmi’s About page, and desktop auto-update.',
    tags: ['profile', 'about', 'updater'],
    body: `## Profile (You)
Display name, lefty, tuning preference, A4 reference, streak stats, short “how conversion works.”

## About
Same family style as Ahmi’s other apps: **“Hi I'm Ahmi, hope this helps!”**, GitHub, Releases, Patreon, Issues.

## Desktop updates (Tauri)
**Check for updates** → download signed release from GitHub → **Install & restart**.  
See \`docs/AUTOUPDATE.md\` for the signing/CI pipeline. Web/PWA builds don’t use that button the same way.`,
  },
  {
    id: 'app-desktop-pwa',
    title: 'Windows desktop & PWA',
    category: 'app',
    summary: 'Tauri shell, WebView, and installable web app.',
    tags: ['tauri', 'pwa', 'windows'],
    body: `## Web / PWA
\`npm run dev\` for daily work. \`npm run build\` + serve \`dist/\`. Install via browser “install app” using the Dark Forest manifest.

## Windows (Tauri 2)
\`npm run tauri:dev\` / \`npm run tauri:build\`. Needs Rust toolchain + WebView2. Native window, file dialogs, signed updater hooks.

## Data
Progress and Your tabs live in **localStorage** in the webview — local-first. Back up exports of tabs you care about.`,
  },

  // ── Facts ──────────────────────────────────────────────
  {
    id: 'brief-history-of-the-guitar',
    title: 'A brief history of the guitar',
    category: 'facts',
    summary: 'From ancient long-necks to Torres classics to Les Pauls and Stratocasters.',
    tags: ['history', 'culture'],
    body: `Plucked long-necked instruments are ancient. The **guitar** lineage runs through Renaissance and Baroque guitars, then the romantic six-string.

## Classical modern shape
19th-century luthier **Antonio de Torres** helped fix the modern classical body proportions and fan bracing — still the DNA of nylon-string guitars.

## Steel string & popular music
Orville Gibson, C.F. Martin, and others pushed flat-tops and archtops. Steel strings got louder for ensembles before mics were everywhere.

## Electric revolution
Early 20th-century experiments → Rickenbacker “frying pan” → hollow electrics → **Les Paul** / Gibson solids → **Fender Telecaster & Stratocaster**. Amplification rewrote technique, tone, and culture.

## Today
Modelers, extended-range guitars, bedroom production — the neck is still twelve frets per octave. History changes fashion; physics stays.`,
  },
  {
    id: 'famous-guitars-and-players',
    title: 'Famous guitars & players (starter set)',
    category: 'facts',
    summary: 'A tiny hall of fame to steal ideas from — not a complete list.',
    tags: ['players', 'icons'],
    body: `Steal with love — learn *why* they sound like themselves.

| Player | Listen for |
|--------|------------|
| Andrés Segovia | Classical tone and repertoire legitimacy |
| Django Reinhardt | Hot club virtuosity with unconventional fretting hand |
| Charlie Christian | Early electric single-note language |
| Sister Rosetta Tharpe | Gospel fire + distortion attitude |
| Chuck Berry | Showmanship riffs that built rock vocabulary |
| Wes Montgomery | Octave melodies, velvet attack |
| Jimi Hendrix | Feedback, colors, extreme expression |
| B.B. King | Vocal bends, sparse perfect phrases |
| Jimmy Page | Riff architecture, textures |
| Eddie Van Halen | Tapping, harmonics, aggressive precision |
| Prince | Rhythm comping as lead |
| John Mayer (live blues eras) | Modern SRV-informed touch |
| Tom Morello | FX as composition |
| Mato Nanji / many modern roots players | Taste over clutter |

When you copy a lick, also copy the **space** they leave.`,
  },
  {
    id: 'why-guitar-has-six-strings',
    title: 'Why six strings? (and more)',
    category: 'facts',
    summary: 'History of string count, 7/8-strings, and bass cousins.',
    tags: ['trivia', 'extended-range'],
    body: `Baroque guitars often had **five courses** (paired strings). Six single strings became standard as repertoire and construction evolved.

## Extended range
- **7-string** — extra low B (jazz, metal).
- **8/9-string** — modern progressive low end.
- **12-string** — courses doubled in octaves/unisons for shimmer.

## Bass
Four-string bass is tuned like the bottom four of a guitar an octave down (E A D G) — transfer skills carefully; touch and role differ.

GuitarRemedy’s fretting engine is six-string first; theory still applies when you add strings.`,
  },
  {
    id: 'practice-myths',
    title: 'Guitar myths, debunked gently',
    category: 'facts',
    summary: 'Natural talent, huge hands, expensive guitars, and other traps.',
    tags: ['myths', 'mindset'],
    body: `**“I’m too old.”** Adults learn fine — consistency beats age.

**“I need huge hands.”** Countless great players have smaller hands; setup and technique adapt.

**“Talent or nothing.”** Deliberate practice predicts outcomes better than mystique.

**“Cheap guitars can’t sound good.”** A well-setup modest guitar outplays a neglected boutique one.

**“Tabs are cheating.”** Tabs are a tool. Ear + tab + rhythm = adult learning.

**“I must practice 4 hours.”** Thirty honest minutes daily compounds harder than occasional marathons.

**“Distortion hides mistakes.”** It often reveals timing and muting flaws. Clean is a teacher.`,
  },
  {
    id: 'care-and-longevity',
    title: 'Caring for your instrument',
    category: 'facts',
    summary: 'Humidity, strings, cleaning, and travel without heartbreak.',
    tags: ['care', 'humidity', 'strings'],
    body: `## Climate
Wood moves. Aim for moderate humidity (roughly 40–55% RH for many guitars). Cracks and high action love dry winters — use a case humidifier when needed.

## Strings
Wipe down after playing. Change when tone dies or tuning becomes a fight. Stretch new strings gently.

## Cleaning
Soft cloth for body; appropriate fretboard care for rosewood vs sealed maple. Avoid kitchen chemicals.

## Storage
Stand or case away from heaters and direct sun. Loose tension for long storage is debated — consistent moderate tuning is fine for most players.

## When to get help
Neck relief issues, electronics crackle, structural cracks — luthiers exist so you don’t invent repairs with a butter knife.`,
  },
  {
    id: 'musical-styles-map',
    title: 'Style map (where theory shows up)',
    category: 'facts',
    summary: 'Blues, rock, folk, jazz, metal, bedroom pop — theory costumes.',
    tags: ['styles', 'genres'],
    body: `| Style | Theory costumes | Guitar habits |
|-------|-----------------|---------------|
| Blues | Minor pent, blues scale, I–IV–V, dominant 7s | Bends, call-response, swing |
| Rock | Power chords, pentatonics, modes light | Riffs, drive, hooks |
| Folk / singer-songwriter | Diatonic I–V–vi–IV, capos, DADGAD | Strum patterns, story |
| Country | Major pent, hybrid picking, mixolydian | Twang, chicken pickin’ |
| Jazz | 7th chords, ii–V–I, melodic minor | Chord melody, swing feel |
| Metal | Modes, harmonic minor, low tunings | Palm mute, precision rhythm |
| Bedroom pop / indie | Simple loops, color chords (maj7 add9) | Texture, space |
| Classical | Notation, tone production | Position playing, right-hand letters |

Learn one style deep; steal seasoning from others.`,
  },
  {
    id: 'glossary',
    title: 'Glossary (quick definitions)',
    category: 'facts',
    summary: 'A–Z pocket definitions for terms used across the wiki and app.',
    tags: ['glossary', 'reference'],
    body: `**Action** — string height above frets.  
**Arpeggio** — chord tones played separately.  
**BPM** — beats per minute.  
**Barre** — one finger frets multiple strings.  
**Blue note** — expressive chromatic (often b5) outside strict scale.  
**Capo** — clamp that raises open-string pitch.  
**Chord tone** — note belonging to the sounding chord.  
**Diad** — two-note chord.  
**Enharmonic** — same pitch, different name.  
**Form** — song structure (verse/chorus/bridge).  
**Intonation** — whether fretted notes are in tune up the neck.  
**Lead** — melodic / solo role.  
**Lick** — short distinctive phrase.  
**Nut** — slotted guide at headstock end of board.  
**Open string** — fretting hand not shortening the string.  
**Palm mute** — right hand damps near bridge.  
**Pentatonic** — five-note scale.  
**Pitch class** — note name ignoring octave.  
**Position** — hand location on the neck.  
**Riff** — repeated foundational figure.  
**Root** — home pitch of a chord or scale.  
**Setup** — tech adjustment of relief, action, intonation.  
**Stems** — separated audio parts (vocals/bass/drums…).  
**Syncopation** — emphasis off the expected beat.  
**Timbre** — tone color.  
**Tonic** — home scale degree / key center.  
**Voicing** — specific arrangement of chord tones.  
**Whole step** — two frets / two semitones.`,
  },
  {
    id: 'further-listening-practice',
    title: 'Further listening & next steps',
    category: 'facts',
    summary: 'How to keep growing after the wiki — ears, people, and the 365 path.',
    tags: ['listening', 'next'],
    body: `## Listening homework (any genre you love)
1. One song — chart the form on paper.
2. Hum the bass motion.
3. Find the tonic on guitar.
4. Steal one lick by ear; write it in Your tabs if you want.

## People
Teachers, jams, choirs, online communities — feedback accelerates. Be kind; everyone buzzed a barre chord once.

## Inside GuitarRemedy
- Follow **Learn** when you want a guide.
- Use **Wiki** when you want the why.
- Use **Upload** to pull your world into tabs.
- Use **Practice** as the mirror.

## Closing
Theory is a map. The territory is vibration under your fingers. Touch the guitar more than you touch the settings menu.

Hi I'm Ahmi — hope this helps you stay on the path.`,
  },
]

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getWikiArticle(idOrSlug: string): WikiArticle | undefined {
  const key = (idOrSlug || '').trim().toLowerCase()
  if (!key) return undefined
  // Exact id first (canonical), then title-derived slug (deep links / hand-typed URLs).
  return (
    WIKI_ARTICLES.find((a) => a.id.toLowerCase() === key) ??
    WIKI_ARTICLES.find((a) => slugify(a.title) === key)
  )
}

export function listWikiByCategory(category: WikiCategory | 'all'): WikiArticle[] {
  if (category === 'all') return WIKI_ARTICLES
  return WIKI_ARTICLES.filter((a) => a.category === category)
}

export function searchWiki(query: string): WikiArticle[] {
  const q = query.trim().toLowerCase()
  if (!q) return WIKI_ARTICLES
  return WIKI_ARTICLES.filter((a) => {
    const hay = `${a.title} ${a.summary} ${a.tags.join(' ')} ${a.body}`.toLowerCase()
    return hay.includes(q)
  })
}
