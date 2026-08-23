/**
 * GuitarRemedy offline wiki — free MIT encyclopedia for players.
 * Original teaching text (not scraped books). Canonical for in-app /wiki.
 * Mirrored summary may live under docs/wiki/.
 *
 * Style: textbook/encyclopedia depth, easy English, practical guitar focus.
 * License: MIT with the app. Built-in music library remains PD/traditional/original only.
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
  { id: 'start', label: 'Start here', blurb: 'Orientation, conventions, license, first week' },
  { id: 'music', label: 'Music theory', blurb: 'Notes, intervals, scales, harmony, rhythm, ear' },
  { id: 'guitar', label: 'Guitar craft', blurb: 'Neck, fretting, CAGED, technique, gear, capo' },
  { id: 'practice', label: 'Practice & learning', blurb: 'Habits, metronome, songs, mindset, 365 path' },
  { id: 'app', label: 'Using GuitarRemedy', blurb: 'Home, Learn, Library, Upload, editor, desktop' },
  { id: 'facts', label: 'Guitar facts', blurb: 'History, culture, care, glossary, free music ethics' },
]

export const WIKI_ARTICLES: WikiArticle[] = [
  {
    id: 'welcome',
    title: 'Welcome to the GuitarRemedy Wiki',
    category: 'start',
    summary: 'Your free offline guitar encyclopedia — how to use it and how it pairs with the app.',
    tags: ['intro', 'orientation', 'free'],
    body: `This wiki is a **free, offline guitar encyclopedia** built into GuitarRemedy. Theory, neck craft, practice habits, gear basics, and how every part of the app works — written so a brand-new player can follow along.

Everything here is **original teaching text**, shipped under the same **MIT** license as the app. No scraped books, no paywalled course dumps, no commercial song tabs.

## Who this is for
- Absolute beginners who want one calm place to look things up
- Returning players who forgot why the B string is “weird”
- Anyone on the **Day 1–365** path who wants the “why” behind a drill

## How to use it
- Browse by **category** (chips at the top, or the chapter cards).
- **Search** for a word like Dorian, drop D, bend, or upload.
- When an article says “try this in the app,” follow the link into Learn, Practice, Library, or Upload.

## How it pairs with the app
| Want to… | Go to |
|----------|--------|
| A guided lesson today | **Learn** (Day 1–365) |
| See a scale on the neck | **Practice → Fretboard** |
| Free songs, chords, riffs | **Library** |
| Your recording → draft tabs | **Upload** (Song → tabs) |
| Fretboard tuning & lefty | **You** |
| Tuner A4 & open-string set | **Practice → Tuner → Settings** (standalone) |
| Metronome | **Practice → Metronome** |
| Credits, updates, license | **About** |

## How this book is written
Short sections. Plain words first, jargon second. Tables when a list of facts helps. We tell you when something is simplified for guitarists.

## License
GuitarRemedy and this wiki: **MIT**. Built-in library music is public-domain / traditional / original studies only — never commercial tracks.

Hi — I'm Ahmi. Hope this helps you stay on the instrument.`,
  },
  {
    id: 'how-to-read-this-wiki',
    title: 'How to read theory pages',
    category: 'start',
    summary: 'Pitch names, intervals in frets, string numbers, tab, and rhythm words used everywhere in GuitarRemedy.',
    tags: ['conventions', 'notation', 'tab'],
    body: `These conventions are shared by the wiki, the fretboard, lessons, and tab views. Learn them once; everything else gets easier.

## Pitch names
- Default spelling uses **sharps**: C C# D D# E F F# G G# A A# B.
- **Flats** appear when the key wants them (F major uses Bb, not A#).
- Same sound, two names = **enharmonic** (C# = Db).

## Octave numbers
We use scientific pitch:
- Middle C = **C4**
- Open high e (thin string) in standard tuning ≈ **E4**
- Open low E (thick string) ≈ **E2**

## MIDI numbers (app engine)
The app’s pitch engine counts like a piano keyboard. In standard tuning, open low E is about **MIDI 40**. You rarely type MIDI by hand — it matters when we talk about conversion and fretting.

## Intervals = frets on one string
| Semitones (frets) | Name | From C |
|-------------------|------|--------|
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

## String numbers in GuitarRemedy
- **Display / tab index 0** = high e (thinnest)
- **Index 5** = low E (thickest)

Classical books often say “string 1 = high e.” Same thin string — only the numbering style flips. The engine also has a **theory** index (low E = 0) for fretting math; the app converts for you.

## Tab at a glance
\'\'\'
e |--0--1--3----
B |--1--3-------
G |--0----------
D |-------------
A |-------------
E |-------------
\'\'\'
Numbers are **frets**. \'0\' means open. Time reads left → right.

## Rhythm words
- **Beat** — the pulse you tap
- **Bar / measure** — a group of beats (often 4)
- **Tempo** — beats per minute (BPM)
- **Subdivision** — splitting a beat (8ths, 16ths)
- **Time signature** — how beats group (4/4, 3/4, 6/8…)

## Degree labels on the neck
When Practice lights **1**, **b3**, **5**, those are scale degrees relative to the root you picked — not random stickers.`,
  },
  {
    id: 'first-week-on-guitar',
    title: 'Your first week on guitar',
    category: 'start',
    summary: 'A calm seven-day starter path that matches early Learn days — posture, open strings, first chords.',
    tags: ['beginner', 'roadmap', 'week-1'],
    body: `You do not need to finish the whole wiki before you touch a guitar. Use this week as a simple map; **Learn** days 1–7 walk the same ground with drills.

## Day-by-day (about 20–30 minutes)
1. **Hold and open strings** — Name E A D G B E. One clean ring per string. No buzz panic; adjust pressure.
2. **Fretting pressure** — Fret lightly on the high E; find “just enough.” Spider or one-finger taps if your hands tire.
3. **Em chord** — Two fingers, all six strings. Strum slow; fix the muddiest string only.
4. **G major** — Add G; switch Em ↔ G in free time.
5. **C major** — Shape first, then slow Em–G–C if ready.
6. **D major** — Campfire set Em G C D exists; keep changes ugly-slow.
7. **One song-shaped loop** — Four bars of any two chords you own. Smile optional, tempo steady.

## Rules that save beginners
- **Pain in joints or tendons** → stop, shake out, shorten the session.
- **Buzz** → fingertip closer behind the fret, thumb behind the neck, not crushing.
- **Speed** is optional; **clean repeats** are the win.
- Use **Practice → Metronome** only after shapes feel familiar — start without the click if the click stresses you.

## Where in the app
- Guided version: **Learn** from Day 1
- Chord pictures that match the lesson: only when that day teaches the chord
- Open-string and early chords: **Library** (search Em, G, C, D)

## After week one
Keep the 365 path, add **wiki → major scale** and **how to practice**, and learn one easy Library melody for fun — not as homework punishment.`,
  },
  {
    id: 'license-and-free-content',
    title: 'License, sources & honesty',
    category: 'start',
    summary: 'MIT app and wiki, free library rules, what song conversion is (and is not), no plagiarism policy.',
    tags: ['license', 'MIT', 'public-domain', 'honesty'],
    body: `## Software & wiki text
GuitarRemedy source, UI copy, lessons, and **this wiki** are original project materials under **MIT**. You may use, copy, and modify per that license.

## Built-in music library
Shipped songs and studies are:
- **Public domain** melodies and traditional tunes, or
- **Original** exercises written for the app

We do **not** ship commercial pop/rock recordings or licensed tab books.

## Song → tabs (Upload)
Audio conversion is a **helper**, not a magic full-band transcription studio:
- Best on clear single-note lines
- Full mixes are **lead-biased multipitch assist** — editable drafts
- Always confirm by ear before you trust a hard passage

Structured files (MIDI / MusicXML; Guitar Pro best-effort) are the more reliable import path when you have them.

## What we will not do
- Paste copyrighted lesson books or paywalled PDFs into the wiki
- Claim another author’s words as ours
- Promise perfect multi-voice tabs from a dense MP3

## Third-party code
Open-source dependencies keep their own licenses (see the repo’s third-party / package notices). Teaching explanations in this wiki are still ours.

## Corrections
Theory here is checked against the app’s pitch and chord engine where it matters (scales, open shapes, intervals). If something feels wrong, compare with **Practice** on the same root — the neck is the lab.`,
  },
  {
    id: 'notes-and-the-chromatic-scale',
    title: 'Notes & the chromatic scale',
    category: 'music',
    summary: 'Twelve pitch classes, enharmonics, octaves, and why fret 12 feels like home.',
    tags: ['notes', 'chromatic', 'octave', 'enharmonic'],
    body: `Most music you will play on guitar in Western pop, rock, folk, blues, and a lot of jazz divides the octave into **twelve equal steps**. Those twelve pitch classes are the **chromatic scale**.

## Hear the loop
Pick any string open. Play up one fret at a time. At **fret 12**, the note name matches the open string, one octave higher. That is why the 12th-fret harmonic sings like the open string.

## The twelve names (sharps)
C · C# · D · D# · E · F · F# · G · G# · A · A# · B · (then C again)

There is **no sharp between E–F or B–C**. Those pairs are already one fret apart. That single fact explains a thousand “why is this shape weird?” moments.

## Enharmonics
C# and Db are the **same fret**, different names. Choose the name that fits the key:
- G major melody → F# (not Gb)
- F major chord → Bb (not A#)

## What to memorize first (guitar order)
1. Open strings: **E A D G B E** (low → high)
2. Natural notes on **low E** and **A** (your root finders for barres and power chords)
3. “Same note, new string” **octave shapes**

## Chromatic practice (useful, not evil)
Slow chromatic finger exercises build fretting evenness. They are a **warm-up**, not a personality. Two minutes clean beats five minutes sloppy.

## In GuitarRemedy
**Practice → Fretboard** — pick a root and a scale (including chromatic ideas via full neck coloring on scale tones). Library chord/scale items light the same pitch world as this article.

## Try this
Say the open-string names out loud while you pluck them. Tomorrow, find every **E** on the low six frets of the low E and A strings.`,
  },
  {
    id: 'intervals',
    title: 'Intervals (the real alphabet)',
    category: 'music',
    summary: 'Distances between notes — how melodies and chords are built, with guitar frets as your ruler.',
    tags: ['intervals', 'harmony', 'melody'],
    body: `An **interval** is the distance between two pitches. If notes are letters, intervals are how you spell words. Melodies are intervals in a line; chords are intervals stacked from a root.

## Name + quality
Size (2nd, 3rd, 4th…) plus quality:
- **Perfect** — unison, 4th, 5th, octave (very stable)
- **Major / minor** — 2nds, 3rds, 6ths, 7ths
- **Augmented / diminished** — one semitone larger or smaller than the “normal” version

## Guitar ruler
On **one string**, one fret = one semitone. So:
- 1 fret = minor 2nd
- 2 frets = major 2nd
- 3 frets = minor 3rd
- 4 frets = major 3rd
- 5 frets = perfect 4th
- 7 frets = perfect 5th
- 12 frets = octave

Across strings, standard tuning is mostly **perfect 4ths** between strings, except **G to B is a major 3rd** (only four frets). That break is why many chord shapes “shift” on the B string.

## Intervals you will use constantly
| Interval | Sound / job | Guitar habit |
|----------|-------------|--------------|
| m3 / M3 | Sad / bright third | Chord quality |
| P4 | Suspended, folk moves | Power-chord neighbor |
| Tritone | Tension | Blues, dim chords |
| P5 | Hollow strength | Power chords |
| m7 / M7 | Bluesy vs “jazzy” | 7th chords |
| Octave | Same name, higher | Shape copies up the neck |

## Train your ear without apps first
Hum a root. Hum a fifth (think the first leap in many fanfares / “twinkle” territory of stability). Then alternate major third vs minor third. Naming can wait; **hearing the difference** cannot.

## In the app
Fretboard degree tags (**1**, **b3**, **5**, **b7**…) are intervals from the scale root. Chords in Library are stacks of those intervals.

## Common beginner mix-up
“Minor” on a chord means the **third** is minor (flattened), not that every interval inside is sad-by-law. A minor chord still has a perfect fifth.`,
  },
  {
    id: 'major-scale',
    title: 'The major scale',
    category: 'music',
    summary: 'W–W–H–W–W–W–H, scale degrees, key signatures, and why major is the home base for so much music.',
    tags: ['major', 'scales', 'degrees', 'keys'],
    body: `The **major scale** is the bright “do-re-mi” collection. A huge amount of Western melody and chord progressions is major or is described relative to major.

## The formula (from any root)
**W W H W W W H**  
(W = whole step = 2 frets, H = half step = 1 fret)

### C major (no sharps/flats)
C D E F G A B C

### G major (one sharp: F#)
G A B C D E F# G

### F major (one flat: Bb)
F G A Bb C D E F

## Scale degrees
Number the notes 1–7, then back to 1:
| Degree | In C | Role (plain English) |
|--------|------|----------------------|
| 1 | C | Home / tonic |
| 2 | D | Step above home |
| 3 | E | Bright third |
| 4 | F | “Suspended” neighbor |
| 5 | G | Strong support (dominant) |
| 6 | A | Sweet / relative minor door |
| 7 | B | Leads back to 1 |
| 8 | C | Home again (octave) |

## Why guitarists care
- Chord tones in a key come from these degrees (see **Diatonic harmony**).
- Modes are the major scale started on a different degree (see **Modes**).
- Your “major box” shapes are just this formula painted on the neck.

## Practice pattern that works
1. Pick a root on **low E** (say G at fret 3).
2. Ascend the formula slowly on one string.
3. Then play a **two-octave shape** in Practice and say degree numbers out loud: “1 2 3 4 5 6 7 1”.

## Relative minor teaser
The major scale’s degree **6** is the root of its **relative natural minor** (C major ↔ A minor share one pitch set). Same notes, different home.

## In GuitarRemedy
Practice → choose **Major** and a root. Learn path introduces major sounds after you can hold open chords. Library scale items use the same engine.`,
  },
  {
    id: 'minor-scales',
    title: 'Natural, harmonic & melodic minor',
    category: 'music',
    summary: 'Three common minor flavors — how they differ by a note or two, and when players use each.',
    tags: ['minor', 'harmonic-minor', 'melodic-minor', 'scales'],
    body: `“Minor” is a family, not one scale. Guitarists meet three names early: **natural**, **harmonic**, and **melodic** minor.

## 1) Natural minor (Aeolian)
Formula from the root: **W H W W H W W**

A natural minor: A B C D E F G A  
Same pitches as **C major** — home base is A, not C.

Sound: the everyday minor of pop ballads and sad folk. Degrees: 1 2 b3 4 5 b6 b7.

## 2) Harmonic minor
Take natural minor and **raise the 7th**.

A harmonic minor: A B C D E F **G#** A

That G# makes a strong pull to A (leading tone). It also creates an exotic step between b6 and 7 (F to G#).

Where you hear it: classical cadences, metal/neo-classical leads, some flamenco flavors, “spy” melodies.

## 3) Melodic minor (jazz / ascending form)
Raise **6 and 7** relative to natural minor.

A melodic minor (ascending): A B C D E **F# G#** A

### Honesty about classical teaching
Older classical courses teach melodic minor **ascending** with raised 6–7 and **descending** as natural minor. Modern jazz players often keep the raised form both ways. GuitarRemedy labels the **ascending / jazz** form when it says melodic minor — we say so on purpose.

## Quick chooser
| Need | Try |
|------|-----|
| Normal minor song | Natural minor / pentatonic minor |
| Strong pull to tonic in minor | Harmonic minor (careful with the big step) |
| Jazz minor / altered colors later | Melodic minor |

## Relative major reminder
A minor natural ↔ C major. If you know one shape set, you already know the other’s notes — only the **center** changes.

## In the app
Practice scales: minor, harmonic minor, melodic minor. Lessons introduce minor chords and sounds before demanding three-scale fluency.`,
  },
  {
    id: 'modes',
    title: 'Modes (Ionian to Locrian)',
    category: 'music',
    summary: 'Seven modes from the major scale — plain-English colors, note recipes, and guitar use without mysticism.',
    tags: ['modes', 'dorian', 'mixolydian', 'modal'],
    body: `Modes are **scales with a center**. Take the pitches of a major scale and treat a different degree as “home.” The notes can stay the same; the gravity changes.

## Parent: C major pitches
C D E F G A B

| Mode | Home | Plain color | Compared to major/minor |
|------|------|-------------|-------------------------|
| Ionian | C | Plain major | Major scale |
| Dorian | D | Minor but brighter | Natural minor with raised 6 |
| Phrygian | E | Minor, Spanish/dark | Natural minor with b2 |
| Lydian | F | Major, dreamy lift | Major with #4 |
| Mixolydian | G | Major, bluesy/rock | Major with b7 |
| Aeolian | A | Natural minor | Natural minor |
| Locrian | B | Unstable / tense | Minor with b2 and b5 |

## Recipes from a root (any key)
Build from the root with these degree sets:
- **Ionian:** 1 2 3 4 5 6 7
- **Dorian:** 1 2 b3 4 5 6 b7
- **Phrygian:** 1 b2 b3 4 5 b6 b7
- **Lydian:** 1 2 3 #4 5 6 7
- **Mixolydian:** 1 2 3 4 5 6 b7
- **Aeolian:** 1 2 b3 4 5 b6 b7
- **Locrian:** 1 b2 b3 4 b5 b6 b7

## What to learn first on guitar
1. **Ionian / major** and **Aeolian / natural minor** (you already need them).
2. **Dorian** (minor funk, modern rock minor vamps).
3. **Mixolydian** (dominant / blues-rock major with flat 7).
4. **Phrygian** when you want that b2 spice.
5. Lydian and Locrian when curiosity (and ears) are ready.

## Avoid mode superstition
Modes do not require incense. They require:
- A clear **root drone or vamp**
- Melodies that emphasize the characteristic note (Dorian’s 6, Mixo’s b7, Phrygian’s b2, Lydian’s #4)

## Practice tip
Loop a Dm chord, play D Dorian. Then play D natural minor and notice the B vs Bb. That one note is the lesson.

## In GuitarRemedy
Practice mode scales on the fretboard. Wiki + lessons will name modes when the day actually teaches them — not as random Day-1 scare charts.`,
  },
  {
    id: 'pentatonic-and-blues',
    title: 'Pentatonic & blues scales',
    category: 'music',
    summary: 'Five-note major/minor pentatonic boxes, the blues scale, and why guitarists live here.',
    tags: ['pentatonic', 'blues', 'boxes', 'lead'],
    body: `**Pentatonic** means five tones. On guitar, minor pentatonic is the freeway for rock, blues, pop, and a lot of improvising.

## Minor pentatonic
Degrees: **1 b3 4 5 b7**

A minor pentatonic: A C D E G  

It is natural minor **without** 2 and b6 — fewer “wrong” notes over many loops.

## Major pentatonic
Degrees: **1 2 3 5 6**

C major pentatonic: C D E G A  

Same shape family as minor pentatonic, different root emphasis (C major pent ↔ A minor pent share pitches).

## The famous box (A minor pent, low strings)
You will see a two-note-per-string box starting at A on low E (fret 5). Learn it clean **ascending and descending**, then connect a second position. Boxes are maps, not prisons.

## Blues scale
Minor pentatonic plus **#4 / b5** (the blue note):

**1 b3 4 b5 5 b7**

A blues: A C D Eb E G  

Use the blue note as spice, not the only meal — land on chord tones.

## Why this helps beginners
- Fewer notes → more confident phrasing
- Works over single-chord jams and many rock changes
- Teaches bending targets (especially b3→3 illusions and 4→5)

## Honest limits
Pentatonic alone will not outline every jazz change. Add chord tones and fuller scales when harmony gets richer.

## In the app
Library and Practice both know minor/major pentatonic and blues. Lead-phase lessons lean on these sounds after chords are comfortable. Diagrams only appear on days that actually teach them.`,
  },
  {
    id: 'chords-triads-sevenths',
    title: 'Chords: triads to sevenths',
    category: 'music',
    summary: 'How three- and four-note chords are built, named, and played as guitar shapes.',
    tags: ['chords', 'triads', 'sevenths', 'harmony'],
    body: `A **chord** is three or more notes heard as one harmony. Guitar shapes are just playable layouts of those notes.

## Triads (three notes)
From a root, stack thirds:

| Quality | Intervals from root | Example on C |
|---------|---------------------|--------------|
| Major | 1 3 5 | C E G |
| Minor | 1 b3 5 | C Eb G |
| Diminished | 1 b3 b5 | C Eb Gb |
| Augmented | 1 3 #5 | C E G# |

### Inversions
Same three notes, different lowest note. On guitar, open shapes already mix inversions across strings.

## Seventh chords (four notes)
Add a seventh above the root:

| Name | Degrees | Flavor |
|------|---------|--------|
| Major 7 | 1 3 5 7 | Soft, “dreamy” major |
| Dominant 7 | 1 3 5 b7 | Blues, V chords, tension |
| Minor 7 | 1 b3 5 b7 | Everyday minor groove |
| Minor 7b5 | 1 b3 b5 b7 | Half-diminished color |
| Dim 7 | 1 b3 b5 bb7 | Dense tension |

## Power chords
**1 and 5** (sometimes with octave). No third → not major or minor until something else paints the third. Huge in rock because they stay clear with distortion.

## Guitar naming shortcuts you will see
- **C** = C major triad
- **Cm** = C minor
- **C7** = C dominant 7
- **Cmaj7** = C major 7
- **Csus4** = 1 4 5 (3 replaced by 4)
- **Cadd9** = triad plus 9 (2 up an octave) without implying a full 7th stack unless written

## Clean chord checklist
1. Each needed string rings (or is muted on purpose).
2. Fingertips stand tall; thumb roughly opposite the neck.
3. Strum slow; fix the worst string first.
4. Only then speed up changes.

## In GuitarRemedy
Library chord items and Learn diagrams use the theory engine for open shapes. Upload fretting maps notes onto playable string/fret pairs with your session tuning.`,
  },
  {
    id: 'diatonic-harmony',
    title: 'Diatonic harmony & Roman numerals',
    category: 'music',
    summary: 'I–V–vi–IV and friends — building chords from a scale and reading progression symbols.',
    tags: ['harmony', 'progressions', 'roman-numerals', 'cadence'],
    body: `**Diatonic** means “from the scale.” If you build triads on each degree of a major scale, you get a family of chords that share one key signature.

## Chords in a major key (triads)
In **C major**:
| Numeral | Chord | Quality |
|---------|-------|---------|
| I | C | Major |
| ii | Dm | Minor |
| iii | Em | Minor |
| IV | F | Major |
| V | G | Major |
| vi | Am | Minor |
| vii° | Bdim | Diminished |

Roman numerals: **upper case** ≈ major (or dominant when we say V7), **lower case** ≈ minor, **°** ≈ diminished.

## Why I–V–vi–IV feels familiar
Those four numerals cover endless pop progressions. In C: C–G–Am–F. Same pattern in G: G–D–Em–C. **Learn the numerals, move the key.**

## Cadences (sentence endings)
- **V → I** — strong “end of sentence”
- **IV → I** — gentler amen-ish ending
- **V → vi** — deceptive (“wait, not home yet”)

## Minor keys (natural minor snapshot)
In A natural minor, triads start from A: Am, Bdim, C, Dm, Em, F, G… Harmonic minor is often used so **V becomes major/dominant** (E or E7 → Am) for a stronger pull.

## Function words (optional but useful)
- **Tonic** family — rest (I, sometimes vi)
- **Dominant** family — tension toward I (V, vii°)
- **Subdominant** family — journey away (IV, ii)

## Guitar practice
1. Pick G major: G, Am, Bm, C, D, Em, F#dim.
2. Play I–V–vi–IV in G: **G D Em C**.
3. Sing the bass roots while you change.

## In the app
Progression library items and campfire lessons live here. Wiki **circle of fifths** helps you hop keys without relearning shapes from zero.`,
  },
  {
    id: 'circle-of-fifths',
    title: 'Circle of fifths',
    category: 'music',
    summary: 'How keys relate, sharps and flats pile up, and how guitarists jump keys without panic.',
    tags: ['keys', 'fifths', 'key-signatures', 'modulation'],
    body: `The **circle of fifths** arranges keys so each step clockwise is up a perfect fifth. It is a map of **key signatures** and neighbor relationships.

## Clockwise (sharps pile up)
C → G → D → A → E → B → F# → C#  
Sharps appear in order: **F# C# G# D# A# E# B#**

## Counter-clockwise (flats pile up)
C → F → Bb → Eb → Ab → Db → Gb → Cb  
Flats appear in order: **Bb Eb Ab Db Gb Cb Fb**

## What “next door” means
Keys beside each other share almost all notes. Songwriters modulate gently by stepping one tick. Guitarists capo or shift shapes to a neighbor key and keep muscle memory.

## Relative minors
Each major has a relative minor starting on degree 6 (C major ↔ A minor). On many circle diagrams, minors sit inside the majors.

## Guitar jobs for the circle
- Find a comfortable **open-chord key** for a singer (G, C, D, A, E are friends).
- Move a progression by the same numeral pattern (I–V–vi–IV) into a new key.
- Understand why “one sharp” means G major / E minor.

## Capo vs circle
A capo raises pitch while you keep shapes. The circle tells you **what key you sound in**. Shape G with capo 2 → sounding A major territory.

## In GuitarRemedy
Theory helpers and key labels aim to stay consistent with fifths logic. When conversion spells notes, key context prefers sensible accidentals.`,
  },
  {
    id: 'rhythm-meter-groove',
    title: 'Rhythm, meter & groove',
    category: 'music',
    summary: 'Beats, bars, time signatures, subdivisions, swing, and locking to a click without losing feel.',
    tags: ['rhythm', 'meter', 'groove', 'bpm'],
    body: `Pitch without rhythm is a cloud. **Rhythm** is when notes happen. Groove is rhythm that feels intentional in a style.

## Beat, tempo, meter
- **Beat** — steady pulse
- **Tempo** — BPM (beats per minute)
- **Meter** — how beats group into bars

### Common time signatures
| Meter | Feel |
|-------|------|
| 4/4 | Four quarter pulses; default rock/pop |
| 3/4 | Waltz threes |
| 6/8 | Two big beats, each split in three |
| 2/4 | March-like twos |
| 5/4, 7/8… | Odd meters — count carefully, stay calm |

## Subdivisions
One beat can split into:
- 2 eighths
- 4 sixteenths
- 3 eighth-note triplets

Clap subdivisions while your foot keeps the quarter. If they disagree, slow down.

## Strong and weak beats
In 4/4, beat 1 is usually strongest, beat 3 medium, 2 and 4 lighter (style-dependent). Backbeat music accents **2 and 4** on purpose (snare world).

## Swing & shuffle
Straight eighths are even. Swing makes the first part of the pair longer and the second shorter (a common feel is close to a triplet long-short). Shuffle is the bluesy cousin. Your ear > math arguments.

## Guitar rhythm toolkit
- Downstrokes for weight
- Down-up eighths for motion
- Palm mute for articulation
- Rests — silence is a rhythm event
- Anticipations (playing a chord a bit early) for push

## Practice recipe
1. Metronome on quarters at a friendly BPM.
2. Strum whole notes → halves → quarters → eighths on one chord.
3. Only then change chords on barlines.
4. Record 30 seconds; listen whether the click drifts.

## In GuitarRemedy
**Practice → Metronome** shares BPM habits with tab playback ranges. Learn rhythm-phase days train feel before fancy harmony. Converted tabs store time in **beats** so tempo changes stretch correctly.`,
  },
  {
    id: 'ear-training-basics',
    title: 'Ear training basics',
    category: 'music',
    summary: 'Practical listening skills for guitarists — intervals, chord quality, and learning songs by ear in small steps.',
    tags: ['ear', 'listening', 'transcription', 'relative-pitch'],
    body: `You do not need perfect pitch. You need **relative** skills: higher/lower, same/different, major/minor, and “that leap feels like a fifth.”

## Level 1 — attention
- Match a hummed note on one string.
- Say whether note two is higher, lower, or the same.
- Stop scrolling while a chorus plays; count the bar length on your fingers.

## Level 2 — intervals
Train a few workhorses first:
- Octave
- Perfect fifth (power-chord width)
- Major vs minor third (chord quality)
- Perfect fourth

Sing them, then find them on adjacent strings.

## Level 3 — chord quality
Someone plays a chord (or you record yourself): major, minor, dominant 7, sus. Guess, then check in Library.

## Level 4 — song skeleton
1. Find the **root movement** of the progression (bass notes).
2. Decide major/minor centers.
3. Add melody contour on one string.
4. Only then fill full grips.

## Using GuitarRemedy without cheating your ears
- Upload conversion is a **draft**. Play along with the original and correct frets.
- Library melodies: hum first, then reveal tab.
- Fretboard play-along: look away and name degrees.

## Daily five-minute drill
Pick two intervals. Ten call-and-response attempts. Stop while focus is fresh.

## Myths
- “I’m tone-deaf” is rare; untrained is common.
- Slow songs teach ears faster than speed metal walls.
- Writing answers down helps more than silent guessing forever.`,
  },
  {
    id: 'key-signatures-and-transposing',
    title: 'Key signatures & transposing',
    category: 'music',
    summary: 'Reading sharps/flats at the start of a chart, and moving songs to singer-friendly keys.',
    tags: ['key-signature', 'transpose', 'capo', 'charts'],
    body: `A **key signature** is the cluster of sharps or flats at the start of written music. It tells you the default pitch set.

## Major key signatures (quick)
| Sharps | Major key | Relative minor |
|--------|-----------|----------------|
| 0 | C | A |
| 1 (F#) | G | E |
| 2 (F# C#) | D | B |
| 3 | A | F# |
| 4 | E | C# |
| Flats | | |
| 1 (Bb) | F | D |
| 2 (Bb Eb) | Bb | G |
| 3 | Eb | C |

(See **Circle of fifths** for the full walk.)

## What transposition is
Moving every note by the same interval so the song’s shape stays, but the **height** changes. Singers ask for this constantly.

## Guitar-friendly transpose tools
1. **Capo** — keep open shapes, raise sounding pitch.
2. **Move shapes** — barre or CAGED shift up the neck.
3. **Rewrite numerals** — think I–V–vi–IV, pick a new I.
4. **App session tuning** — Drop D etc. changes fingerings; transpose still starts from musical key.

## Practical singer workflow
1. Find the recorded key (or guess I chord).
2. Ask for their comfortable range.
3. Try one step down/up; test the highest chorus note.
4. Prefer keys with friendly open chords when possible (G, C, D, A, E, Em, Am).

## Tab and transposition
Tab is pitch-on-guitar, not “abstract key-free.” If you transpose the arrangement, frets change unless you capo and keep shapes.

## In GuitarRemedy
Lessons stay in friendly keys early. Library items list keys when relevant. Your converted tabs keep the pitches the engine heard — transpose by editing or re-fretting with intent.`,
  },
  {
    id: 'dynamics-articulation-expression',
    title: 'Dynamics, articulation & expression',
    category: 'music',
    summary: 'Loud/soft, staccato/legato, accents, and how right-hand touch makes the same frets musical.',
    tags: ['dynamics', 'articulation', 'expression', 'feel'],
    body: `Two players can fret the same tab and sound worlds apart. **Expression** is mostly touch, time, and silence.

## Dynamics
- **p / piano** — soft
- **m** — medium
- **f / forte** — strong
- **Crescendo / diminuendo** — gradually louder / softer

On guitar: pick distance from the bridge (near bridge = brighter/tougher), pick angle, finger flesh vs nail, and how hard you dig.

## Articulation words
| Word | Meaning | Guitar move |
|------|---------|-------------|
| Legato | Smooth connected | H/P, slides, gentle pick |
| Staccato | Short | Left mute or right palm |
| Accent | That note stands out | Stronger pick + slight time lean |
| Ghost note | Felt more than heard | Dead-string chuck |
| Vibrato | Pitch waver | Finger rock after the note is solid |

## Phrasing
Music breathes in chunks. Leave air at phrase ends. Do not fill every sixteenth because you can.

## Practice
Play a four-bar chord loop four ways: all soft, all loud, soft verse/loud chorus, and one accent on beat 2 only. Same frets — different song.

## Link to lessons
Repertoire-phase days about dynamics and arrangement are this article in drill form. Metronome work still applies; expression sits on top of steady time, not instead of it.`,
  },
  {
    id: 'anatomy-of-the-guitar',
    title: 'Anatomy of the guitar',
    category: 'guitar',
    summary: 'Headstock to strap button — parts you should be able to name and why they matter.',
    tags: ['anatomy', 'acoustic', 'electric', 'setup'],
    body: `Knowing the parts helps you ask for setups, diagnose buzz, and not panic when a tech says “truss rod.”

## Shared parts (acoustic & electric)
- **Headstock** — tuners (machine heads) live here
- **Nut** — spaced slots feed strings onto the fingerboard
- **Fingerboard / fretboard** — frets divide semitones
- **Frets** — metal strips; pitch rises as you shorten the string
- **Neck** — the whole playing stick; relief adjusted via truss rod
- **Body** — acoustic chamber or solid/semi electric body
- **Bridge / saddle** — other end of the vibrating length
- **Soundhole** (acoustic) — projects sound
- **Pickups** (electric) — magnetic sensors for string vibration
- **Output jack / controls** — volume, tone, pickup selector
- **Strap buttons** — where the strap attaches

## Scale length
Distance from nut to saddle. Longer scale → more string tension for the same pitch (feel and tone change).

## Action
String height above frets. High action = harder fretting, often cleaner acoustically if extreme; low action = easy play, risk of buzz if too low.

## What beginners should actually check
1. Strings not rusty razors
2. Tuning machines turn smoothly
3. No sharp fret ends cutting hands (common in dry winters)
4. Neck not banana-warped beyond playability (get a tech if unsure)

## In the app
We do not replace a luthier. We do give you a tuner, metronome, and lessons so a decently set-up guitar can sing.`,
  },
  {
    id: 'standard-tuning-and-beyond',
    title: 'Standard tuning & alternate tunings',
    category: 'guitar',
    summary: 'EADGBE explained, Drop D and other common alts, and how GuitarRemedy separates fretboard vs tuner tuning.',
    tags: ['tuning', 'drop-d', 'open-tunings', 'EADGBE'],
    body: `## Standard tuning (low → high)
**E A D G B E**

Intervals between strings: 4th, 4th, 4th, **major 3rd**, 4th.  
That major 3rd between G and B is why shapes shift on the top two strings.

## Why standard won
Good compromise for chords and single-note lines. Huge teaching literature assumes it.

## Drop D
Low E down to **D**: D A D G B E  

Power chords on the bottom two strings become one-finger shapes. Keep the rest of your brain in standard patterns up top.

## Other common alts (taste map)
| Tuning | Idea |
|---------|------|
| DADGAD | Modal folk / drones |
| Open G (D G D G B D) | Slide & stonesy rhythm |
| Open D | Slide and rich drones |
| Half-step down | Singer comfort, thicker feel |
| Whole-step down | Even lower; flubby without heavier strings |

## GuitarRemedy tuning model (important)
- **You (Profile)** — fretboard / play-along / library fretting session tuning
- **Tuner → Settings** — **standalone** A4, open-string set, steel bias, noise floor  
Changing one does **not** silently rewrite the other on purpose. Set both when you re-tune the room.

## Tuning workflow
1. Quiet room; open **Tuner**
2. Hit Quiet room / noise calibrate if the mic is hissy
3. Tune low E → high e (or your alt targets)
4. Stretch new strings and recheck
5. Match Profile tuning name if you want fretting advice in that tuning

## Pitch reference
Default **A4 = 440 Hz**. Some rooms use 432 or orchestral variants — set A4 in the **tuner** settings for detection and reference tones; set Profile A4 for play-along pitch when those differ by design.`,
  },
  {
    id: 'fretboard-logic',
    title: 'Fretboard logic & octave shapes',
    category: 'guitar',
    summary: 'Root finders, octaves, the B-string shift, and a simple plan to stop feeling lost past fret 5.',
    tags: ['fretboard', 'octaves', 'navigation', 'roots'],
    body: `The neck is a grid, not a mystery novel. A few relationships unlock most of it.

## Anchor strings
Learn note names on:
1. **Low E** string
2. **A** string

Those two run your barre-chord roots and many scale launches.

## Octave shapes (standard tuning)
From a note on low E:
- Up **2 strings and 2 frets** → octave (with care around B-string shifts)
- Classic patterns repeat; Practice visualization beats memorizing a poster once

From A-string roots, similar shapes shift.

## The B-string shift
Because G→B is a major 3rd, patterns that cross onto the B and high E strings move **one fret higher** than a pure-fourths mental model expects. When a shape “breaks,” check whether you crossed that boundary.

## Five-minute map drill
1. Pick a note class (only **G**).
2. Find every G up to fret 12 on all strings.
3. Play them ascending in position order.
4. Next day, only **C**.

## CAGED preview
Five chord/shape families cover the neck for a given quality. See **CAGED system**.

## In GuitarRemedy
Practice fretboard lights scale degrees so you navigate by **function** (1, 3, 5) not only dots. Library play-along animates sounding pitches. Lessons stay honest: early days do not dump full-neck pentatonics on you for decoration.`,
  },
  {
    id: 'caged-system',
    title: 'CAGED system',
    category: 'guitar',
    summary: 'Five connected major (and minor) shape families so one chord owns the whole neck.',
    tags: ['caged', 'shapes', 'barre', 'navigation'],
    body: `**CAGED** is a memory story for five open-chord **shapes** — C, A, G, E, D — moved up the neck as barres or partials. It is a map of **chord tones**, not a religion.

## The idea
An open **C** shape, slid up behind a barre, still outlines C-family tones at a new fret. Same for A, G, E, D shapes. Chain them so the next shape’s root connects to the last.

## Why players bother
- Find chord tones for fills anywhere
- Move a voicing higher without random guessing
- Link scale boxes to chord grips under your fingers

## Major shape order (ascending neck)
A common teaching order around a given pitch is C → A → G → E → D shapes (then repeat). You do not need all five on day one. **E and A shapes** carry most pop rhythm guitar.

## Minor CAGED
Minor versions exist (Em and Am shapes are the gateway). Same connect-the-roots idea.

## Pitfalls
- Memorizing shape names without hearing chord tones
- Forcing full five-shape fluency before songs
- Ignoring the B-string shift inside shapes

## Practice plan
1. Play open C, A, G, E, D cleanly.
2. Turn E and A into barres; name the root under your index.
3. Arpeggiate each shape slowly (root-3-5).
4. Only then connect two neighboring shapes.

## In the app
Later Learn days and wiki cross-links mention CAGED when the curriculum actually gets there. Practice the chord tones on the live fretboard rather than wallpaper diagrams alone.`,
  },
  {
    id: 'technique-left-hand',
    title: 'Left-hand technique',
    category: 'guitar',
    summary: 'Thumb, fretting pressure, muting, barre survival, and clean changes without death-grip tension.',
    tags: ['technique', 'fretting', 'barre', 'left-hand'],
    body: `(If you play lefty flipped, swap the hands in your head — we mean the fretting hand.)

## Thumb
Roughly behind the neck, opposite the fretting fingers for most chord work. Thumb-over is a style choice for some grips and bends later — not required on Day 1.

## Pressure
Press **just enough** for a clean tone. Excess pressure slows changes and invites pain. Place fingertips slightly behind the fret wire, not on top of it and not an inch back.

## Arch and mute
- Fingertips stand so adjacent strings can ring when you want them.
- When you do **not** want a string, mute on purpose with unused fingers or flesh — accidental open strings are arrangement choices you did not make.

## Barre chords
- Index forms a smooth shelf; not every string needs equal pain on attempt one.
- Roll the index slightly onto its side bone if the flat pad is mushy.
- Check the top string and the string under the middle of the barre first.
- Build time: four clean strums, shake out, repeat.

## Changes
Aim for **silent rehearsal**: move to the next shape without strumming, then strum when fingers arrive. Slow is skilled.

## Health
Tingling, sharp joint pain, or tendon stress → stop. Short daily sessions beat weekend heroics. Hydrate; warm hands in cold rooms.

## In lessons
Early Learn days obsess over clean rings and honest buzz-fixing. That is technique, not nitpicking.`,
  },
  {
    id: 'technique-right-hand',
    title: 'Right-hand technique',
    category: 'guitar',
    summary: 'Picking, fingerstyle basics, strum patterns, palm mute, and staying in time.',
    tags: ['picking', 'strumming', 'fingerstyle', 'right-hand'],
    body: `The fretting hand chooses pitches; the picking/strumming hand often chooses **whether the room believes you**.

## Flatpicking basics
- Hold the pick firmly enough not to drop it, loosely enough to flex.
- Start near the middle of the soundhole / over the body sweet spot on electric.
- Downstrokes for weight; add upstrokes for eighth-note flow.
- Rest-stroke vs free-stroke is classical language; electric players still benefit from efficient motion.

## Strumming
- Keep the arm moving; missing a string on purpose is how patterns breathe.
- Count “1 & 2 & 3 & 4 &” aloud.
- Accent beat 1 lightly until groove is stable, then style accents (many pop feels love 2 and 4).

## Palm mute
Edge of the palm near the bridge shortens sustain. Too hard = thud; too soft = no mute. Explore.

## Fingerstyle snapshot
Thumb handles lower strings (p); index/middle/ring (i m a) handle uppers. Pattern studies (arpeggios) teach independence slower than YouTube speedruns.

## Hybrid picking
Pick plus middle/ring fingers for country/funk color inside a simple progression.

## Timing
Right hand should agree with your foot. Use **Metronome** for short loops. If pick accuracy collapses, lower BPM before buying a new pick.

## In the app
Rhythm-phase lessons, metronome tool, and tab play-along all judge you kindly: steady > fancy.`,
  },
  {
    id: 'bends-slides-legato',
    title: 'Bends, slides, hammer-ons & pull-offs',
    category: 'guitar',
    summary: 'Expressive left-hand moves with in-tune targets and safe practice habits.',
    tags: ['bends', 'legato', 'slides', 'expression'],
    body: `These moves make guitar sound like guitar.

## Hammer-on
Fret a note, then “hammer” a higher fret on the same string without picking again. Start loud enough on the first note.

## Pull-off
Fret two notes; pick the higher, then pull the finger off sideways to sound the lower. Pull slightly across the string — not just lift straight up.

## Slide
Pick, then glide to a target fret without losing contact. Know whether you are sliding **into** a note or exiting one.

## Bends
Push or pull the string to raise pitch. On many frets, a **full bend** = +2 frets of pitch; a half bend = +1 fret.

### In-tune bends
1. Play the target fretted note first.
2. Bend the lower note up until it matches.
3. Use tuner or ear; unsupported bends go flat under distortion.

### Support
Help with extra fretting fingers behind the bending finger when needed. Wrist and arm share work; do not only squeeze one knuckle.

## Safety
Stop if fingertips or tendons complain. Build bend strength over weeks. Lighter gauge strings bend easier (with setup tradeoffs).

## In GuitarRemedy
Lead lessons introduce bends after basic fretting is stable. Tab conversion may **mark** bend/slide/hammer guesses — always verify by ear. Editor glyphs (\'b\', \'/\', \'h\', \'p\') are helpers, not perfect detection.`,
  },
  {
    id: 'reading-tab',
    title: 'How to read guitar tab',
    category: 'guitar',
    summary: 'Six-line tab, rhythms, techniques symbols, and how GuitarRemedy’s player shows frets.',
    tags: ['tab', 'notation', 'reading'],
    body: `**Tablature** shows you where to put fingers on this instrument. It does not always show rhythm as clearly as standard notation — good tab includes timing or you learn the song by ear too.

## The six lines
\'\'\'
e|----------------
B|----------------
G|----------------
D|----------------
A|----------------
E|----------------
\'\'\'
Top line = high e in most modern tab (matches GuitarRemedy display index 0).

## Numbers
The fret to press. \'0\' = open. \'-\' = empty time / placeholder.

## Common symbols (vary by publisher)
| Symbol | Often means |
|--------|-------------|
| h | Hammer-on |
| p | Pull-off |
| / or \\ | Slide |
| b | Bend |
| r | Release bend |
| ~ | Vibrato |
| x | Mute / dead note |
| <> | Harmonic |

## Rhythm
Some tab stacks stems or writes note lengths above. Others assume you know the recording. In GuitarRemedy, playback uses **beat positions** and your BPM so the cursor is a timing teacher.

## Standard notation vs tab
Notation tells pitch+rhythm abstractly; tab tells guitar geography. Together they are powerful; either alone has blind spots.

## Reading practice
1. One measure at a time
2. Name string+fret aloud
3. Tap rhythm without fretting
4. Combine at half speed

## In the app
Library songs, Your tabs, Upload results, and the tab editor all speak this language. Export formats include app JSON and ASCII views for sharing drafts.`,
  },
  {
    id: 'tone-and-gear-basics',
    title: 'Tone & gear basics',
    category: 'guitar',
    summary: ' guitars, amps, pedals, strings, picks — enough to choose without drowning in forums.',
    tags: ['gear', 'amp', 'pedals', 'strings'],
    body: `Gear should serve your hands and ears. You can learn serious music on a modest setup.

## Acoustic vs electric
- **Acoustic** — practice anywhere; dynamics are in the right hand; frets teach honesty.
- **Electric** — lower action possible; amp/pedals paint tone; headphones options help apartments.

Neither is “easier” universally. Buzz and timing problems transfer between them.

## Strings
- Light gauges = easier bends, flub risk if too light for your attack
- Heavier = tighter low end, harder fretting
- Change when dull, rusty, or won’t tune
- Fresh strings need stretch-tuning

## Picks
Thickness changes attack. Try medium first. Fingerstyle needs no pick.

## Amps (electric)
Clean channel first. Learn volume vs gain. A little reverb is gravy; mud hides mistakes.

## Pedals (order sketch)
Guitar → tuner → gain/drive → modulation → delay/reverb → amp  
(Rules break for art; this is a starter lane.)

## Cable & noise
Good cable, solid jack seating, sensible gain staging. Noise gates help; they do not fix broken technique.

## What not to buy first
A pedalboard the size of a suitcase before you can change G–C–D cleanly.

## In GuitarRemedy
We focus on playing skill. Tone tips appear as practice advice, not affiliate labyrinths.`,
  },
  {
    id: 'posture-and-ergonomics',
    title: 'Posture & ergonomics',
    category: 'guitar',
    summary: 'Sitting, standing, strap height, and avoiding preventable pain.',
    tags: ['posture', 'health', 'ergonomics', 'practice'],
    body: `Comfort is technique infrastructure.

## Sitting
- Chair without big arms if they fight the body
- Guitar body resting stably; neck slightly up
- Back long, shoulders soft
- Fretting wrist mostly straight — not cranked to extremes for long sessions

## Standing
- Strap holds the guitar where your practice posture already lives
- Ultra-low straps look cool and can wreck wrists — raise it if fretting suffers
- Balance weight; do not clamp only with fretting hand

## Session hygiene
- Warm hands
- Micro-breaks every few minutes during hard fretting
- Stretch gently; no aggressive pain stretches
- Stop for numbness or sharp pain

## Screens
If you use GuitarRemedy on a phone/laptop, raise the screen to reduce neck crane. Your cervical spine is not a third capo.

## Teachers and techs
Persistent pain → medical professional. Persistent buzz after good technique → setup tech.

## Chair and strap height
- Sitting: sit toward the front of the chair, both feet down, guitar resting on the leg that keeps the neck slightly up.
- Standing: strap so fretting hand does not climb to your ear or drop to your hip. Match sitting neck angle when you can.
- Classical footstool or cushion is optional; comfort and clean frets matter more than looking traditional.

## Tension checklist (30 seconds)
1. Drop shoulders.  
2. Unclench jaw.  
3. Soften fretting thumb.  
4. Breathing still happening? Good.

## Pain vs work
Muscle fatigue that fades overnight is normal when you ramp gently. Sharp joint pain, tingling that lingers, or numbness is a stop signal — rest and, if it returns, talk to a professional. This wiki is not medical advice.

## Practice setup
Light in front of you, phone metronome reachable, water nearby. Reduce friction so starting is easy.

## In GuitarRemedy
Early Learn days assume short sessions. If posture collapses when you speed up, slow down — tone and hands first.`,
  },
  {
    id: 'acoustic-vs-electric-learning',
    title: 'Learning on acoustic vs electric',
    category: 'guitar',
    summary: 'How the instrument choice changes feedback, practice habits, and early repertoire — without starting a war.',
    tags: ['acoustic', 'electric', 'beginner'],
    body: `You can become a real musician on either. The feedback loops differ.

## Acoustic gives you
- Instant acoustic truth (buzz is obvious)
- Built-in dynamics practice
- No amp required
- Often higher action / heavier strings on student models — builds strength, can fatigue faster

## Electric gives you
- Lower physical effort when set up well
- Sustain for bends and legato study
- Volume control / headphones paths
- Distortion that can **hide** sloppy fretting or punish it with noise — stay honest on a clean channel too

## Shared skills
Time, chord changes, fretting accuracy, listening, song form. Those transfer.

## Practical advice
- If neighbors / night practice matter, plan electric+headphone or nylon/quiet acoustic options.
- If budget is one instrument, pick the sound you will actually play daily.
- Cross-train when you can: acoustic keeps electric players honest; electric opens bends and effects vocabulary.

## In GuitarRemedy
Lessons are instrument-agnostic on purpose. Use the tuner and metronome on both. Library melodies work either way.`,
  },
  {
    id: 'how-to-practice',
    title: 'How to practice (so it sticks)',
    category: 'practice',
    summary: 'Short focused sessions, loops, goals you can finish, and ending while you still like guitar.',
    tags: ['practice', 'habits', 'deliberate-practice'],
    body: `Practice is not “touch the guitar until guilt fades.” It is **small goals with feedback**.

## A simple session template (25–40 min)
1. **Arrive (2 min)** — Tune. Shake hands. One easy groove.
2. **Warm-up (5 min)** — Chromatic or spider, slow; or open chords you own.
3. **One teach focus (10–15 min)** — A single skill from Learn today.
4. **Guided loops (8–10 min)** — Metronome or backing; fix the worst bar only.
5. **Jam / song joy (5 min)** — Something that sounds like music.
6. **Cool-down (1 min)** — Note tomorrow’s one win. Stop.

## Rules of deliberate practice
- Define the win before you start (“clean Em→G eight times”)
- Slow enough that mistakes are rare
- Repeat with attention; autopilot does not count
- Raise difficulty **one knob** (speed **or** complexity, not both)

## Feedback sources
- Your ear
- Metronome
- Recording on your phone
- GuitarRemedy tab cursor / fretboard lights
- A human teacher when you can

## What to skip
- Three-hour guilt marathons once a week
- Only playing parts you already sound good on
- Speed contests with no tone

## In the app
**Learn** is this template as a daily path. **Practice** tools are the lab. Wiki articles are the chalkboard.`,
  },
  {
    id: 'metronome-and-tempo-ladders',
    title: 'Metronome & tempo ladders',
    category: 'practice',
    summary: 'How to use a click without rage, and how to add BPM the smart way.',
    tags: ['metronome', 'bpm', 'timing'],
    body: `The metronome is a mirror. Mirrors feel rude until you need one.

## First sessions
- Start **without** click while shapes are brand new if the click panics you.
- When shapes exist, add click at a tempo where you can play **calmly**.
- Tap your foot with the machine; guitar agrees with foot.

## Tempo ladder
1. Find a BPM with ~90% clean takes.
2. Play 3–5 clean loops.
3. Add 4–8 BPM.
4. If accuracy collapses, step back down.
5. End on a tempo that still sounds like music.

## Subdivisions
If quarters feel empty, set the click to eighths — or keep quarters and play eighths against them. Know which layer is the click.

## Common traps
- Only speeding the easy bar
- Ignoring the bar before a chord change
- “I’ll fix timing later” (later never comes)

## In GuitarRemedy
**Practice → Metronome**: BPM, meter, subdivisions, accent, tap tempo, count-in, **Defaults** reset. BPM ranges align with tab playback clamps. Use Defaults when the session goes sideways.`,
  },
  {
    id: 'learning-songs',
    title: 'Learning songs efficiently',
    category: 'practice',
    summary: 'Section practice, form maps, slow sources, and finishing a tune instead of collecting riffs.',
    tags: ['songs', 'repertoire', 'form'],
    body: `Songs teach what exercises forget: memory, form, and emotion.

## Map before grind
1. Count the **form**: intro / verse / chorus / bridge / outro.
2. Find the **hardest 2 bars**.
3. Practice those bars more than the easy chorus you already like.

## Loop sizes
- 1 beat → 1 bar → 2 bars → section → whole song  
Never only whole-song runs if section 2 always breaks.

## Sources
- Official or legal charts when you have them
- GuitarRemedy **Library** free melodies and studies
- **Upload** drafts from audio you have rights to use
- Your ear

## Memory
Sleep on a song. Run it again tomorrow cold. Mental run-throughs away from the guitar count.

## Finish line definition
A finished song is one you can start, get through form, and recover from a flinch — not a flawless studio take on attempt one.

## In the app
Repertoire-phase lessons push form, dynamics, and performance habits. Your tabs store personal arrangements.`,
  },
  {
    id: 'plateaus-and-motivation',
    title: 'Plateaus, frustration & fun',
    category: 'practice',
    summary: 'Why progress hides, how to reset goals, and how to keep joy without quitting discipline.',
    tags: ['motivation', 'plateau', 'mindset'],
    body: `Plateaus are normal. Your ears improve before your hands, so you hear faults sooner — that feels like reverse progress and often is not.

## Signs you need a reset
- Same BPM wall for weeks with rising anger
- Only rage-practicing mistakes
- Avoiding the instrument

## Reset menu
- Shrink the goal (two chords, not the whole song)
- Change the song, keep the skill
- Film a 20-second before/after weekly
- Take one lighter day (musical fun only)
- Review an old Learn day you crushed — confidence is fuel

## Fun is not the enemy
If nothing is fun, discipline dies. Keep a “dessert” riff. Jam with the metronome as a drummer, not a judge.

## Comparison trap
Someone else’s year-five video is not your day-40 report card.

## In GuitarRemedy
Streaks reward showing up, not perfection. Easy mode language in lessons exists on purpose. Use it.

## Name the plateau
Write one sentence: "I am stuck at ___ because ___." Vague frustration becomes a drill. Stuck at barre buzz? That is a left-hand pressure and roll problem, not a talent problem.

## Shrink the win
Instead of "learn the song," aim for "clean bar 1–2 at 70 BPM." Small wins restart the dopamine loop that keeps you picking the guitar up tomorrow.

## Rotate focus
If lead is stale, spend three days on rhythm only. If chords bore you, learn one riff for fun. The 365 path already rotates skills — lean into the current phase instead of fighting it.

## Social fuel without pressure
Play for one friend, record a 20-second clip for yourself, or jam to a free backing track. Audience of one still counts.

## Rest is training
A light day or a day off can unlock the lick that would not come. Sleep consolidates motor skill; grinding until 2 a.m. often does not.

## In GuitarRemedy
Streaks reward showing up, not perfection. Missing a day does not erase the path — open Learn and continue.`,
  },
  {
    id: '365-path-overview',
    title: 'The Day 1–365 path',
    category: 'practice',
    summary: 'How the year-long curriculum is phased, what ‘one win a day’ means, and how to flex busy weeks.',
    tags: ['curriculum', '365', 'learning-path'],
    body: `GuitarRemedy’s **Learn** mode is a progressive path from first rings to repertoire habits.

## Phase spine (approximate)
| Days | Focus |
|------|--------|
| 1–30 | Basics — hold, open strings, campfire chords |
| 31–75 | Chords — changes, vocabulary, groove with grips |
| 76–120 | Scales — patterns with musical targets |
| 121–180 | Rhythm — time, strum, feel |
| 181–260 | Lead — phrasing, bends, vocabulary |
| 261–365 | Repertoire — songs, arrangement, performance habits |

Exact titles are day-specific; the spine keeps skills stacking.

## One win a day
Each lesson names a concrete finish line. Hit the win; optional extras are gravy. Missing a calendar day is not moral failure — resume the day number you are on.

## Private-lesson shape
Lessons expand into timed segments: arrive, warm-up, teach, guided, jam, cool-down. That is intentional coaching structure, not filler.

## Busy-week flex
- Do the teach + one drill only
- Keep tuner/metronome touch so the instrument stays familiar
- Do not binge twelve days in one night and vanish for a month

## Diagrams
Neck diagrams appear **only when the day teaches that shape**. If you do not see a chart, the day may be pure rhythm, listening, or form — that is a feature.

## Where wiki fits
When a day names Dorian or Drop D, open the matching wiki article the same session. Theory sticks to frets better that way.`,
  },
  {
    id: 'practice-journal-and-memory',
    title: 'Memory, sleep & a tiny journal',
    category: 'practice',
    summary: 'Why sleep locks skills, and a two-line journal format that actually gets used.',
    tags: ['memory', 'journal', 'sleep'],
    body: `Motor learning consolidates between sessions. Cramming five angry hours once loses to twenty focused minutes daily.

## After each session (60 seconds)
Write:
1. **Worked on:** …
2. **Tomorrow’s first bar:** …

That is enough. Novels are optional.

## Sleep
Protect sleep after heavy skill days when you can. Fatigue feels like “bad hands.”

## Spaced repeat
Return to last week’s song cold. Returning is the feature.

## In the app
Learn progress and streaks are a light journal. Your tabs list is a repertoire diary. Use both.

## Why a tiny journal works
Your brain forgets what "almost clean" felt like. Three lines after practice beat a perfect empty notebook:

1. What I practiced (song, scale, chord change).  
2. Tempo or feel note (e.g. 72 BPM, swung).  
3. One win + one snag.

## Weekly review (five minutes)
Sunday glance: which snags repeated? That becomes next week's focus. Which wins stuck? Keep a light maintenance rep so they do not evaporate.

## Sleep and spacing
New motor patterns stabilize after rest. Two focused 15-minute sessions beat one guilty hour of distracted looping. Space hard material across days (the 365 path already does this).

## Memory hooks for the neck
- Say note names out loud when you find roots.  
- Sing scale degrees while you play slowly.  
- Link a shape to a song you love ("this box is the solo feel in ___").

## What not to log
Do not write essays. Do not grade yourself harshly. The journal is a map, not a report card.

## In GuitarRemedy
Learn mastery checks are journal prompts in disguise. Your tabs list is also a history of songs you cared enough to convert — revisit them monthly.`,
  },
  {
    id: 'playing-with-others',
    title: 'Playing with others',
    category: 'practice',
    summary: 'Jam etiquette, listening, counting in, and being the guitarist people call again.',
    tags: ['jamming', 'band', 'etiquette'],
    body: `Other humans are the best metronomes and the best teachers of dynamics.

## Before the first note
- Tune to the same A
- Agree on key and form
- Count off loudly and clearly
- Know who starts

## While playing
- Leave space
- Match volume to the room
- Eye contact on endings
- If lost, simplify to roots and listen

## Etiquette
- Do not noodle full volume between songs
- Phones down during takes if you can
- Compliment specifically (“that bridge vocal”)
- Discuss feel without character attacks

## Practice alone for the band
- Play with metronome as if a drummer is judging kindly
- Practice endings and count-ins
- Learn to comp with fewer notes

## In GuitarRemedy
Rhythm and repertoire lessons build these muscles. Record yourself playing “support” only — no hero leads — for a week.

## Listen louder than you play
In a duo or band, your job is the pocket and the arrangement, not maximum notes. Leave space. Match dynamics.

## Count and cues
Agree on count-ins, endings, and who nods for the chorus. A clear "1-2-3-4" saves more jams than a flashy guitar.

## Roles
- Rhythm guitar: time, chord quality, consistent strum or pattern.  
- Lead: melody, fills in gaps, does not step on vocals.  
- If two guitars: split register (one higher voicings, one lower) or one clean / one dirty.

## Tuning and volume
Tune to the same reference (or the same GuitarRemedy tuner A4). Volume wars help no one — if you cannot hear the singer, you are too loud.

## Mistakes in public
Keep going. Smile. Rejoin on the next downbeat. Most listeners forgive a flub; they notice a stop-and-argue.

## Free jams
Use public-domain tunes and free backing tracks. Do not assume cover rights for a stream or upload — know your local rules.

## In GuitarRemedy
Metronome and tuner live under Practice. Library PD melodies are safe shared repertoire starters.`,
  },
  {
    id: 'app-home-and-shell',
    title: 'Home, navigation & streaks',
    category: 'app',
    summary: 'What the home screen shows, where the logo menu goes, and how streaks fit the path.',
    tags: ['app', 'home', 'navigation', 'streaks'],
    body: `## Home
Your landing card for **today’s lesson**, streak/progress snapshots, shortcuts into Practice tools, library highlights, and explore links. It is a dashboard, not a second lesson player.

## Main navigation
Primary tabs cover the daily loop: Home, Learn, Library, Practice, Upload, You. **Wiki** and **About** live in the logo menu and from You/Home links so the phone bar stays usable.

## Logo menu (top brand mark)
Grouped on purpose — not a random dump:
1. **Practice** — Fretboard, Metronome, Tuner  
2. **Learn** — Lessons, Library, Wiki  
3. **Create** — Song → tabs  
4. **You** — You, About  

## Streaks & progress
Streaks celebrate showing up. They are motivation, not a debt collector. Progress through Day 1–365 is stored locally on your device.

## Dark Forest
The visual theme (void greens, mint/lime accents) is intentional product identity — same family as the wider Remedy look — so long sessions feel consistent.`,
  },
  {
    id: 'app-learn',
    title: 'Learn mode (private lessons)',
    category: 'app',
    summary: 'How a day is structured, mastery wins, diagrams, easy mode, and jumping days.',
    tags: ['app', 'learn', 'lessons', '365'],
    body: `## What a day contains
- Title and phase context
- Goals and drills in plain teacher language
- Theory bite (short)
- Mastery / win check
- Optional **diagrams** when the day teaches neck shapes
- Related library links when relevant
- Expanded **private-lesson segments** (arrive → warm-up → teach → guided → jam → cool-down)

## Diagrams policy
Charts are theory-backed and only show for content the lesson text actually teaches. You should not see a random minor pentatonic wall on open-string day.

## Easy mode
Coach copy and pacing assume humans get tired. Slow clean repeats always count.

## Navigation
Jump to a day when you need review; the path is ordered but not a prison. Use week strips / jump controls in the Learn UI.

## Mastery
The win condition is concrete (“clean change eight times”), not vague vibes. If a day feels unclear, treat the mastery line as the contract.

## Offline
Lesson content ships in the app — no classroom login wall for the core path.`,
  },
  {
    id: 'app-practice',
    title: 'Practice: fretboard, metronome, tuner',
    category: 'app',
    summary: 'Three labs in one place — scales on the neck, click, and chromatic tuning.',
    tags: ['app', 'fretboard', 'metronome', 'tuner'],
    body: `## Fretboard lab
- Pick root, scale, position, direction, octaves
- **Play / Stop** walks sounding notes with highlights
- Tap lit frets to hear them
- Follows **Profile** fretting tuning and lefty toggle
- Degree colors call out roots and chord tones

## Metronome
- BPM, time signature, subdivisions, accent, tap tempo, count-in
- **Defaults** restores a known-good setup
- Shares sane BPM limits with tab playback

## Tuner (standalone settings)
- Chromatic detection with animated needle / strobe feel
- Open-string targets from **tuner** tuning (not forced to Profile)
- A4, steel-string bias, quiet-room noise calibrate live in tuner settings
- Reference tones for strings / A

## Audio honesty
Only one primary practice sound source should own the output at a time — start/stop cleanly if you hop between tab preview and metronome.

## Three tools, one room
**Practice** holds the fretboard lab, metronome, and chromatic tuner. Use the top tabs or the logo menu to jump straight to a tool.

## Fretboard lab
Pick a scale or mode, root, and position. Degrees light on the neck. Play walks the pattern; tap frets to hear single notes. Lefty and Profile tuning apply here (fretboard tuning is separate from the standalone tuner).

## Metronome
Set BPM, beat grouping, subdivisions, and accent. Tap tempo if you are matching a record. Defaults restores a sane starting point. Claim audio so it does not fight tab playback.

## Tuner
Open **Practice → Tuner**. It has its own settings (A4, tuning preset, steel compensation, quiet-room noise floor). Profile does not drive the tuner — on purpose, so stage tuning stays independent of song-practice tuning.

## Suggested loop
1. Quiet-room / tune.  
2. Two minutes metronome on open chords or a scale.  
3. Fretboard lab on today's Learn topic.  
4. Stop while it still sounds good.

## In the wiki
See metronome ladders, posture, and how-to-practice articles for the habits around these tools.`,
  },
  {
    id: 'app-library',
    title: 'Library & Your tabs',
    category: 'app',
    summary: 'Free built-in music, favorites, play/stop with animated neck, and your saved conversions.',
    tags: ['app', 'library', 'tabs', 'favorites'],
    body: `## Built-in library
Scales, chords, progressions, riffs, and **free-license** melodies/studies. Search and filter; favorite what you use.

## Playback
- Scales, chords, progressions: **Play / Stop** with fretboard animation
- Songs / tab items: tab player with speed control and **Stop that actually stops**
- Switching items auto-stops the previous sound

## Your tabs
Conversions and imports you save appear as a personal list. Open, edit, export, delete. Survives reload (local storage).

## Imports
\'.grtab.json\' style exports can come back in — round-trip your work.

## What will not appear
Commercial hit songs we do not have rights to ship. Use Upload on audio **you** have rights to use.

## What is in Library
- **Built-in** open-license scales, chords, riffs, and public-domain / traditional melodies.  
- **Your tabs** — conversions and imports you saved on this device.  
- Search and filters by kind (scale, chord, song, riff, progression).

## Playing items
Scales, chords, and progressions have **Play / Stop** with fretboard animation. Songs and riffs open the tab player with speed control. Switching items stops the previous sound.

## Your tabs
Saved from Upload or imported '.grtab.json'. Open, edit, export TXT / MIDI / JSON, or delete. Nothing leaves your device unless you export a file yourself.

## Favorites
Star items you revisit. Home and You can surface counts so your shortlist stays visible.

## Honesty
Built-in songs are free-license only. Your uploads are your responsibility. Converted audio tabs are assists — edit before you trust them on stage.

## Related
Upload article for conversion; tab editor article for cleanup; free-content license article for why the shelf looks the way it does.`,
  },
  {
    id: 'app-upload-breakdown',
    title: 'Upload & song breakdown',
    category: 'app',
    summary: 'Audio and structured files to editable tabs — engines, stems, honesty limits, and exports.',
    tags: ['app', 'upload', 'conversion', 'midi', 'audio'],
    body: `## Goal
Turn a file into a **draft guitar tab** you can play, edit, save, and export.

## Best inputs (most reliable first)
1. **MIDI** / **MusicXML** — solid structure
2. **Guitar Pro** — best-effort (some files need export to MIDI/MusicXML)
3. **Audio** — MP3, WAV, FLAC, OGG, M4A, AAC, AIFF, … browser-decodable types

## Audio pipeline (plain English)
1. Decode audio in the browser  
2. Optional stem emphasis (lead / harmonic / mix / side)  
3. Pitch assist (machine + classical DSP race)  
4. Notes → frets in your **session / profile fretting tuning**  
5. Cleanup (timing, confidence, playable grips)  
6. Optional save into **Your tabs**

## Voices & assists
- Lead-biased **multipitch** when the model finds stacked notes
- Mono / lock-lead tools when you want a single line
- Tempo detect + override, trim, swing/grid tools in editor flows
- Confidence coloring to spot weak detections

## Honesty wall
Dense full-band mixes will not become perfect multi-track studio tabs. Treat output as a **starting chart**. Your ear is final QA.

## Exports
- App tab JSON (\'.grtab.json\')
- ASCII tab text
- MIDI (tempo/meter aware on the modern path)

## Rights
Only upload material you have the right to process. The tool is a practice aid.`,
  },
  {
    id: 'app-profile-about',
    title: 'You, settings & About',
    category: 'app',
    summary: 'Profile fretting prefs vs tuner settings, progress, and the About page for updates and license.',
    tags: ['app', 'profile', 'about', 'settings'],
    body: `## You (Profile)
- Display name vibe / progress snapshot
- **Fretboard** tuning name or custom strings for practice & fretting advice
- Lefty, A4 for **play-along** pitch
- Shortcuts to lessons, library, wiki, practice
- Convert blurb stays honest and short

## Tuner settings are separate
Open **Practice → Tuner → Settings** for detection A4, tuner open-string set, steel strings, noise floor. Profile changes do not silently retune the tuner’s brain.

## About
- Who built it (Ahmi), MIT free software posture
- Links: GitHub / releases / issues / support channels when configured
- **Check for updates** on desktop builds wired to GitHub Releases
- No duplicate “link to About from About” junk — in-app exits go to Wiki, You, Home

## Versions
UI version strings come from the **package version**, not handwritten stickers in random components.

## You (Profile)
Track streak, day on the 365 path, and completion. Set **fretboard** preferences: handedness, tuning name or custom strings, play-along A4 for scales and tabs that use session pitch. These do **not** override the standalone tuner.

## Up next
A card jumps to the current Learn day so you do not hunt.

## Quick links
Practice tools, Library, Your tabs, Wiki, Upload, About — same destinations as the logo menu, grouped for thumbs.

## About
Project story, free MIT posture, links (GitHub, releases, support), and desktop update checks when the Windows build is installed. Version text comes from the package build — not a hardcoded string in the page.

## Data
Progress and Your tabs use local browser storage on web/PWA. Clearing site data clears them — export tabs you care about.

## Privacy posture
No account wall for core learning. Optional update checks contact GitHub releases only when you use that desktop feature.`,
  },
  {
    id: 'app-desktop-pwa',
    title: 'Windows desktop & PWA',
    category: 'app',
    summary: 'Tauri desktop shell, auto-update idea, and installing the web app on phones.',
    tags: ['app', 'desktop', 'pwa', 'tauri', 'android'],
    body: `## Windows desktop (Tauri)
Native window wrapping the same React app: file dialogs, updater hooks, installer packaging. Core musicianship features are the web engine; desktop adds shell powers.

## Auto-update (when published)
Desktop builds can check **GitHub Releases** for signed updates (same general idea as other Remedy desktop apps). Requires a published release pipeline and signing keys on the maintainer side — not magic on a private folder copy.

## PWA
In a supporting browser, install GuitarRemedy to the home screen for fullscreen-ish practice. Offline depth depends on what you have cached; the lesson/wiki data ships with the app bundle for local use.

## Android (Capacitor path)
Packaging docs/scripts exist for a Capacitor shell. Treat mobile audio latency as device-specific; always test on real hardware before a show.

## If something fails to launch
- One dev server / one desktop instance
- Hard-refresh after updates
- Check mic permissions for tuner
- Check file permissions for upload`,
  },
  {
    id: 'app-tab-editor',
    title: 'Tab editor & Your tabs workflow',
    category: 'app',
    summary: 'Edit frets and timing, clean up, A/B audio, lock lead, and export without losing meter.',
    tags: ['app', 'editor', 'tabs', 'export'],
    body: `## Open an editor session
From Upload (after convert) or Library → Your tabs → Edit.

## Typical cleanup order
1. Hit **Clean up** for quantize/merge/re-fret assists  
2. Fix obvious wrong octaves  
3. Nudge timing on rushed attacks  
4. Drop ghost blips (low confidence)  
5. Play along with **A/B audio** when you still have the source  
6. Save back into Your tabs  

## Tools you may see
- Lock lead / mono vs multi preference  
- Swing & grid  
- Position prefer (open vs mid neck)  
- Technique marks when detected  
- Per-stem draft picks after convert  

## Exports
Save first if you care about the edit. Export JSON for backup, ASCII for quick forum paste, MIDI for other DAWs/apps.

## Meter & tuning
Modern paths preserve time signatures through edits and respect session fretting tuning. If a tab feels “in the wrong key of hands,” check Profile tuning vs the instrument in your lap.

## When to open the editor
After any conversion, or when a saved tab has a wrong fret, extra ghost note, or bad rhythm grid. The editor is the truth loop: ears + eyes + small edits.

## What you can change
- Pitch up/down per note.  
- Delete weak notes.  
- Clean-up pass (quantize / merge blips — non-destructive until you save).  
- Lock lead (prefer monophonic line) vs keep multipitch clusters.  
- Re-fret with position preference (open / mid neck).  
- A/B the original audio under the tab when the browser still has the buffer.

## Saving
Save writes back into **Your tabs** (eternal list on this device). Export MIDI or '.grtab.json' for backup or another computer.

## What edit cannot invent
It cannot recover a missing harmony part that the converter never heard. It can make the lead line honest and playable.

## Related app pages
Upload runs the pipeline; Library opens and plays the result; Practice metronome helps you rehearse the cleaned tab at rising BPMs.`,
  },
  {
    id: 'brief-history-of-the-guitar',
    title: 'A brief history of the guitar',
    category: 'facts',
    summary: 'From ancient long-necks to vihuela, baroque guitar, romantic gut strings, and the electric boom — a friendly timeline.',
    tags: ['history', 'classical', 'electric', 'culture'],
    body: `This is a **starter timeline**, not a doctoral thesis. It is original summary writing for players.

## Deep roots
Plucked long-neck instruments appear across ancient cultures. They are ancestors in spirit (strings, frets or marked necks, plucked sound), even when they are not “guitars” by modern name.

## Renaissance & baroque Europe
Guitar-like instruments (including four- and five-course guitars) thrived alongside lutes. Courses often meant paired strings. Repertoire included dances, songs, and court entertainment.

## Six strings settle
By the classical/romantic eras, the **six-string** guitar with single strings became standard in the lineage that leads to today’s classical guitar. Gut trebles and wound basses were common before modern nylon.

## Nineteenth century
Fan bracing and modern-ish body ideas grew with makers who wanted louder parlors and early halls. Guitar accompanied song, salon music, and virtuoso solos.

## Steel string & popular song
Steel-string acoustics rose with folk, blues, country, and songwriting traditions — campfire and front-porch culture as much as concert halls.

## Electric guitar
Twentieth-century pickups and solid bodies let guitar cut through bands and invent new techniques (sustain, controlled feedback, effects languages). Popular music reorganized around that voice.

## Why it matters to you
Every time you play power chords or nylon fingerstyle, you are borrowing from different branches of this tree. None of them cancel the others.

## Further curiosity (free paths)
Public-domain scores, museum collection essays, and library books beat random social myths. This wiki stays practical; history here exists to orient, not gatekeep.`,
  },
  {
    id: 'famous-guitars-and-players',
    title: 'Famous guitars & players (starter set)',
    category: 'facts',
    summary: 'A short, respectful orientation to iconic designs and player archetypes — not a ranked list of gods.',
    tags: ['culture', 'players', 'instruments'],
    body: `Lists like this can turn into arguments. Treat it as **orientation** for new ears.

## Design archetypes (instruments)
- **Nylon classical** — wide neck, fretting-hand friendliness for polyphony
- **Steel dreadnought / OM** — songwriting workhorses
- **Solid-body electrics with bolt-on or set necks** — the modern band silhouette
- **Hollow / semi-hollow** — jazz and indie colors
- **Slide-friendly open-tuned platforms** — metal or glass on the strings

Brand myths fade; **setup and strings** often matter more than logos for learners.

## Player archetypes (skills to steal)
| Archetype | Steal this habit |
|-----------|------------------|
| Folk strummer | Steady right hand + honest dynamics |
| Blues player | Call-and-response phrasing, space |
| Classical student | Tone per note, reading patience |
| Metal rhythm | Palm-mute precision + endurance |
| Jazz comper | Chord vocabulary + listening |
| Bedroom producer | Parts that serve the track |

## Listening homework (any legal free/owned music)
Pick one song you love. Map form on paper. Learn only the backbone chords. Ignore the solo until the song stands.

## Diversity reality
Guitar history is wider than any single country, gender, or genre chart. Seek players beyond the first poster wall you saw.

## In GuitarRemedy
We teach skills, not celebrity cosplay. If a lesson names a style, it is a sound vocabulary — not a costume requirement.`,
  },
  {
    id: 'why-guitar-has-six-strings',
    title: 'Why six strings? (and more)',
    category: 'facts',
    summary: 'Why six became common, what extra strings buy you, and when fewer strings is smart.',
    tags: ['six-string', 'seven-string', 'bass', 'ukulele'],
    body: `## Six as a sweet spot
Six strings balance:
- Chord richness (triads and sevenths under the fingers)
- Scale length / tension manageable for hands
- Repertoire and teaching standards

History had four- and five-course instruments first; six singles became a dominant classical and later popular standard.

## More than six
- **Seven / eight** electrics — extended range down (or up) for modern styles
- **Twelve-string** — paired courses for shimmer (tuning patience required)
- **Bass guitars** — four is common; five/six extend range
- **Baritone** — longer scale, lower tuning

## Fewer strings
- **Ukulele** — four nylon-ish strings, friendlier stretch, transferrable theory
- **Banjo / mandolin families** — different tunings and roles
- **Power-chord practice** on bass strings alone — still valid guitar time

## Takeaway
Six is common, not sacred. Theory intervals do not care how many strings you own; shapes do.`,
  },
  {
    id: 'practice-myths',
    title: 'Guitar myths, debunked gently',
    category: 'facts',
    summary: 'Talent, age, gear, practice time, and other stories that steal instruments from living rooms.',
    tags: ['myths', 'mindset', 'beginners'],
    body: `## “I’m too old”
Adults learn differently, not never. Consistency beats birthday candles.

## “I need a better guitar first”
A playable setup matters. A luxury logo does not replace reps. Fix buzz and action before blaming your soul.

## “Practice eight hours or quit”
Focused minutes daily outperform neglected marathons. Injury risk rises when ego sets the schedule.

## “Talented people don’t need a metronome”
Talented people often internalize time early — or they hide a click. Using tools is professional.

## “Theory kills creativity”
Theory is names for sounds you can already hear. It is a map. You still choose the road trip.

## “If I skip a day my streak means I failed”
Streaks are fireworks, not courts of law. Resume.

## “Distortion will cover mistakes”
It covers some and weaponizes others. Keep a clean test.

## “Real players don’t use tabs”
Real players use ears, tab, charts, classical notation, apps, napkins — whatever tells truth faster.

## GuitarRemedy stance
We are pro-tool, pro-ear, pro-rest, pro-joy.`,
  },
  {
    id: 'care-and-longevity',
    title: 'Caring for your instrument',
    category: 'facts',
    summary: 'Humidity, strings, cleaning, cases, and when to see a tech — keep the guitar alive for decades.',
    tags: ['care', 'humidity', 'setup', 'maintenance'],
    body: `## Climate
Wood moves. Extreme dryness → fret sprout, cracks; swamps → swollen tops and high action. Room-human comfort is a decent first target; serious collectors use humidifiers/hygrometers.

## After you play
- Wipe sweat and oils from strings and neck
- Loosen only if your tech/tradition says so for storage extremes — daily players usually leave tuned

## Strings
Change when tone dies or tuning becomes a fight. Stretch new sets. Recycle metal responsibly if your area supports it.

## Cleaning
Soft cloth. Avoid soaking wood or dumping random household chemicals on finishes. When unsure, less is more.

## Truss rod & setups
Truss rods adjust **neck relief**, not “action magic” alone. If you are guessing, book a setup. A good setup teaches you what “right” feels like.

## Electronics
Crackly pots often need cleaning or replacement by someone who owns a soldering iron and patience.

## Cases
Hard case for travel; stand for daily reach if the house is safe from pets/kids/gravity ninjas.

## When to get help
- Buzz everywhere after seasonal change
- Neck looks wrong
- Cracks, open seams
- Shock damage

Play the guitar; let specialists perform surgery.`,
  },
  {
    id: 'musical-styles-map',
    title: 'Style map (where theory shows up)',
    category: 'facts',
    summary: 'How common styles borrow chords, scales, and rhythms — a tourist map for curious ears.',
    tags: ['styles', 'genre', 'listening'],
    body: `Genres are dialects. Notes overlap; **feel and vocabulary** change.

| Style-ish lane | Harmony habits | Guitar habits |
|----------------|----------------|---------------|
| Folk / singer-songwriter | I IV V vi, simple forms | Open chords, capo, strum patterns |
| Pop rock | Diatonic + borrowed chords | Cleans/drives, hooks |
| Blues | Dominant loops, I7 IV7 V7 | Minor pent/blues, call-response |
| Classic rock | Power chords, mixo flavors | Riffs, palm mute |
| Metal | Riffs, modes, extended range | Precision rhythm, tight mutes |
| Country | Story songs, I IV V, secondary dominants | Hybrid picking, tele snap |
| Jazz (starter) | ii–V–I, sevenths | Chords + chord tones |
| Funk | Vamps, dominant colors | 16th-note right hand |
| Classical guitar | Polyphonic writing | Fingerstyle tone, reading |
| Latin / specific traditions | Style-specific claves & harmony | Learn from that tradition’s teachers |

## How to use this map
1. Pick a lane you love.  
2. Learn one rhythm pattern and three songs’ backbones.  
3. Add one scale color that shows up often.  
4. Do not collect genre badges instead of repertoire.

## In GuitarRemedy
Lessons introduce tools in an order that supports many lanes. Wiki theory articles are lane-agnostic building blocks.`,
  },
  {
    id: 'glossary',
    title: 'Glossary (quick definitions)',
    category: 'facts',
    summary: 'Short definitions for words you will see in lessons, wiki articles, and the app UI.',
    tags: ['glossary', 'dictionary', 'terms'],
    body: `## How to use this glossary
Skim for a word you saw in Learn, Library, or a theory page. Short definitions only — open the matching full article when you want depth.

## A–Z
**Action** — String height above the frets.  
**Arpeggio** — Chord tones played one at a time.  
**Barre** — One finger frets multiple strings.  
**BPM** — Beats per minute.  
**Capo** — Clamp that raises open-string pitch.  
**Chord tone** — Note that belongs to the sounding chord.  
**CAGED** — Five-shape neck map from open chord families.  
**Diatonic** — Using notes from one scale/key.  
**Enharmonic** — Same pitch, different name (C#/Db).  
**Form** — Song architecture (verse/chorus/…).  
**Interval** — Distance between two pitches.  
**Intonation** — Tuning accuracy along the neck / in bends.  
**Leading tone** — 7th scale degree that pulls to 1.  
**Legato** — Smooth connected notes.  
**Meter** — How beats group into bars.  
**MIDI** — Digital note data (not audio).  
**Mode** — Scale with a specific center/color.  
**Mute** — Deadening a string on purpose.  
**Nut** — String guide at the headstock end.  
**Octave** — Twelve semitones; same name.  
**Open string** — Sounding string with no fretting finger.  
**Palm mute** — Right hand damps near the bridge.  
**Pentatonic** — Five-note scale.  
**Pickup** — Electric guitar sensor.  
**Power chord** — Root + fifth (often + octave).  
**Relative major/minor** — Share a pitch set, different home.  
**Root** — Home note of a chord or scale.  
**Semitone** — One fret; smallest step in 12-tone equal temperament here.  
**Slide** — Glide between frets.  
**Staccato** — Short separated notes.  
**Tempo** — Speed of the beat.  
**Time signature** — Notation of meter (4/4…).  
**Tonic** — Home chord/note of the key.  
**Transposition** — Moving all pitches by the same amount.  
**Tremolo** (careful) — Word used for rapid re-picks **or** (misused) whammy bars; check context.  
**Triad** — Three-note chord.  
**Vibrato** — Controlled pitch waver.  
**Whole step** — Two frets.

When a lesson uses a word not here, search the wiki — deeper articles expand these seeds.`,
  },
  {
    id: 'further-listening-practice',
    title: 'Further listening & next steps',
    category: 'facts',
    summary: 'What to do after the wiki article ends — legal listening, free practice loops, and staying inside MIT/free tools.',
    tags: ['next-steps', 'listening', 'free'],
    body: `## Inside GuitarRemedy (free with the app)
1. Finish today’s **Learn** win  
2. Open one linked **wiki** idea the same day  
3. Run the idea on **Practice → Fretboard**  
4. Learn one **Library** melody for joy  
5. When ready, **Upload** a file you have rights to use  

## Listening (legal)
Use music you own, public-domain recordings, creative-commons releases, or streaming you subscribe to legally. This wiki will not ship pirate discographies.

## Free skill multipliers
- Sing what you play (quietly counts)
- Record weekly 20-second clips
- Play with another human monthly if you can
- Read one glossary word a day

## What “done” never means
There is always another song and another clean take. The point is a lifetime loop you can live with — not a final boss credit roll.

## License reminder
App + wiki teaching text: **MIT**. Be kind when you share derivatives. Keep commercial recordings out of the built-in library.

Hi — I'm Ahmi. Go play something.`,
  },
  {
    id: 'public-domain-and-learning',
    title: 'Public domain songs & learning',
    category: 'facts',
    summary: 'Why folk and older melodies are great teachers, and how GuitarRemedy uses free music ethically.',
    tags: ['public-domain', 'folk', 'copyright', 'library'],
    body: `## Why old melodies teach well
Public-domain tunes are stable, singable, and free to arrange. You can focus on fretting and time instead of guilt.

## What public domain means (plain)
Copyright expired or never applied in your jurisdiction for that work. Rules vary by country; the app’s shipped library sticks to widely used traditional / PD teaching repertoire and original studies.

## What we still do not do
- Ship modern commercial hits “because students want them”
- Scrape licensed tab sites into the wiki
- Pretend a conversion of a hit recording grants distribution rights

## How you should use Upload
Convert recordings you may use for personal practice. Sharing converted tabs of modern commercial songs online can still be a rights problem — know your local law.

## Learning tip
Arrange a PD melody three ways: single note, simple chords, and fingerstyle arpeggio. One tune, three skills.

## In the app
Library badges and About copy stay explicit about free licensing. Trust that posture — it is a product rule, not a slogan.`,
  },
  {
    id: 'capo-and-partial-capos',
    title: 'Capo craft',
    category: 'guitar',
    summary: 'How capos transpose open shapes, intonation gotchas, and musical reasons to clamp.',
    tags: ['capo', 'transpose', 'open-chords'],
    body: `## What a capo does
Shortens all strings at a fret, raising pitch while you keep **open chord shapes**. Shape G at capo 2 sounds like A major territory.

## Why use one
- Singer range
- Brighter open-string color higher up
- Staying in easy grips while matching a recording key

## Gotchas
- Clamp hard enough to avoid buzz, not so hard you pull sharp
- Intonation can drift; check with tuner on fretted notes
- Partial capos (some strings only) are a special color — learn full capo first

## Without a capo
Barre chords and CAGED shifts transpose by moving shapes. Harder for beginners; worth learning later so you are not capo-dependent forever.

## In GuitarRemedy
Theory key labels and fretting still refer to sounding pitch when you play without a virtual capo model. If you capo in the real world, say the sounding key out loud so ear and hands agree.

## Full capo
Clamps all strings at a fret. Shapes stay the same; pitch rises. Capo 2 + G shape sounds like A major. Singers love this; so do guitarists who want open-ring in higher keys.

## Chart habit
Write **capo fret** and **shape names** (what your hands do), and optionally **concert key** (what the audience hears). Bands avoid trainwrecks when both are clear.

## Intonation and action
Cheap capos can pull sharp. Place just behind the fret, firm but not crushing. If one string chokes, check neck relief and capo quality before blaming your fingers.

## Partial / "eagle" capos
Clamp some strings only so drones stay open while others transpose. Advanced texture tool — learn full capo songs first.

## Alternate tunings + capo
Common in folk and modern acoustic. Tune first, then capo. Retune if you move the capo a lot; stretch settles.

## In GuitarRemedy
Set session/Profile tuning to match the uncapo'd guitar when studying shapes. Capo is a clamp on a physical instrument — the app will not assume a capo unless you change pitch reference yourself.

## Free repertoire
Transpose PD melodies with a capo to sit in a friendly vocal range without new chord vocabulary.`,
  },
  {
    id: 'power-chords-and-muting',
    title: 'Power chords & muting',
    category: 'guitar',
    summary: 'Root-fifth shapes, movable patterns, and left/right muting so distortion stays tight.',
    tags: ['power-chords', 'muting', 'rock'],
    body: `## The shape
Root + fifth (often + octave root). On low strings in standard tuning, index on root, ring (or pinky) on fifth two frets up, adjacent string.

## Why distortion loves them
No third → less intermodulation mud than full major/minor grips under high gain.

## Muting is the skill
- Left-hand flesh mutes unused strings
- Right palm mutes near the bridge for chugs
- Silence between hits is part of the riff

## Practice
1. One power chord, quarter notes, clean then light drive  
2. Move chromatically on frets keeping mute integrity  
3. Add rest on beat 4  
4. Only then gallops or sixteenth panic  

## Theory link
Power chords are open fifths. Add a third later when you want major/minor color.

## In lessons
Rhythm/lead rock vocabulary days lean here. Library riffs may use them — read the item description.

## The shape
Root + fifth (and often octave root). On guitar: index on root, ring (or pinky) on fifth two frets up, adjacent thicker string — or octave shapes higher. No third means major/minor is ambiguous — perfect for overdrive.

## Why punk and hard rock love them
They stay clear under distortion where full triads turn to mud. Moving power chords in parallel is a core rhythm language.

## Palm muting
Rest the side of the picking hand lightly on the strings near the bridge while you pick. Too hard = thud only; too soft = open roar. Eighth-note muted chugs against open accents create the classic pump.

## Left-hand mute
Lift fretting fingers slightly to choke rings between hits. Fret-hand mute + palm mute = tight stops.

## Common mistakes
- Buzz from lazy index finger.  
- Out-of-tune bends when you squeeze too hard.  
- Playing all six strings when you only fretted two — mute the unused ones.

## Practice
Metronome at 70: muted eighths on one power chord, accent every downbeat, then move root chromatically. Speed only after the mute is even.

## In GuitarRemedy
Rhythm-phase lessons and rock riffs in the free library use these ideas. Fretboard lab will not force power-chord shapes — apply them on the neck as root-fifth patterns.`,
  },
  {
    id: 'barre-chord-survival',
    title: 'Barre chord survival guide',
    category: 'guitar',
    summary: 'E- and A-shape barres, fatigue management, and clean checks that do not require superhero hands.',
    tags: ['barre', 'chords', 'technique'],
    body: `## Two gateways
- **E-shape barre** — index barres, remaining fingers form an E grip moved up  
- **A-shape barre** — harder for many players; partial A shapes are legal stepping stones  

## Build plan
1. Barre only the top two strings cleanly  
2. Add strings gradually  
3. Four slow strums, release, breathe  
4. Move by half steps when clean  

## Checklist when it buzzes
- Index rolled slightly onto its harder edge  
- Elbow position / wrist not collapsed  
- Thumb opposite the index  
- Action not absurdly high (setup)  
- You are not trying full-speed songs yet  

## Fatigue
Barres tire everyone. Short sets. Do not push through sharp pain.

## In GuitarRemedy
Chord-phase lessons introduce barres after open shapes. Wiki left-hand article pairs with this one. Diagrams appear when a day teaches a barre shape — not earlier as decoration.

## What a barre is
One finger (usually index) frets multiple strings at the same fret, like a movable capo. E-shape and A-shape barres unlock the neck.

## Mini progression
1. Lay index softly across strings — no chord yet.  
2. Add the other fingers for F or Bm shapes slowly.  
3. Strum two strings, then more, only as each rings.  
4. Four slow strums, release, breathe.  
5. Move by half steps when clean.

## Buzz checklist
- Index rolled onto its harder side edge.  
- Thumb roughly opposite the index, not over the top.  
- Wrist free, not collapsed.  
- Elbow exploring angles.  
- Guitar action not punishingly high.  
- Tempo humble.

## Strength vs efficiency
You need some endurance, but crushing the neck is not the goal. Economy of pressure + exact placement beats raw squeeze.

## Schedule
Short barre sets daily beat weekend marathons. Stop at sharp pain. Fatigue that fades is normal; numbness is not — rest and seek advice if needed (not medical advice from this app).

## In GuitarRemedy
Chord-phase Learn days introduce barres after open shapes. Diagrams show a barre when that day teaches it. Pair with the left-hand technique article.`,
  }
]

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getWikiArticle(idOrSlug: string): WikiArticle | undefined {
  const raw = (idOrSlug || '').trim()
  if (!raw) return undefined
  const key = raw.toLowerCase()
  const slugKey = slugify(raw)
  // Exact id first, then title slug (deep links / hand-typed titles).
  return (
    WIKI_ARTICLES.find((a) => a.id.toLowerCase() === key) ??
    WIKI_ARTICLES.find((a) => a.id.toLowerCase() === slugKey) ??
    WIKI_ARTICLES.find((a) => slugify(a.title) === key || slugify(a.title) === slugKey)
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

/** Related articles in the same category (for encyclopedia “see also”). */
export function relatedWikiArticles(id: string, limit = 4): WikiArticle[] {
  const cur = getWikiArticle(id)
  if (!cur) return []
  return WIKI_ARTICLES.filter((a) => a.category === cur.category && a.id !== cur.id).slice(0, limit)
}
