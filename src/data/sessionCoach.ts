/**
 * Per-day private-lesson session coach copy (days 1-365).
 * Built from each lesson title, goals, theory, and drills — not a global stencil.
 * MIT - GuitarRemedy original.
 */

export type DaySessionCoach = {
  arrive: string
  warmup: string
  teach: string
  guided: string
  jam: string
  cooldown: string
}

const SESSION_COACH_JSON = {
  "1": {
    "arrive": "Day 1. You are here. That already counts. Intention next: Sit so your shoulders can stay loose.",
    "warmup": "Day 1. We wake the specific muscles you will need. Light preview — Get comfortable: guitar on your leg, fretting thumb behind the neck.",
    "teach": "Let me put this simply: Thick to thin, standard tuning is E A D G B E. Saying the names out loud while you pluck trains your ear for free. First win to aim at: Sit so your shoulders can stay loose. Feel it in the hands before you chase neatness.",
    "guided": "Reps with intention for day 1 — Meet the Guitar — First Clean Sounds. Start with: Get comfortable: guitar on your leg, fretting thumb behind the neck. Then: Pluck open strings low to high and say each name. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Jam: stop drilling, start saying something. Day 1 jam on Meet the Guitar — First Clean Sounds — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 1. Soft landing. Win check: Name and pluck all six open strings in order without peeking at the headstock."
  },
  "2": {
    "arrive": "Day 2. Land in the chair. One breath. Here is today's aim: Fret with fingertips, right behind the metal fret.",
    "warmup": "Day 2. Easy blood-flow first. Light preview — Slow spider 1-2-3-4 on the high E around 50 BPM — stop and fix buzz before you add speed.",
    "teach": "Before we grind reps: One fret is one half-step. Press just behind the fret wire — middle of the box makes you squeeze harder for a worse sound. First win to aim at: Fret with fingertips, right behind the metal fret. Feel it in the hands before you chase neatness.",
    "guided": "Practice loop time for day 2 — Fretting Hand — Just Enough Pressure. Start with: Slow spider 1-2-3-4 on the high E around 50 BPM — stop and fix buzz before you add speed. Then: Buzz-then-add: ease off until it buzzes, then add a hair of pressure. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Music time — put the lesson inside something that grooves. Day 2 jam on Fretting Hand — Just Enough Pressure — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 2. Ease out so tomorrow's hands forgive you. Win check: Play frets 1–4 on the high E evenly at 60 BPM with clear tone."
  },
  "3": {
    "arrive": "Day 3. Arrive: tune if you can, then read the win out loud: Build open Em with two fingers.",
    "warmup": "Day 3. Warm the hands for what this day actually asks. Light preview — Build Em, count to four, release — do that ten times.",
    "teach": "Park the hands a second — idea first: E minor is the notes E G B. Open Em: middle finger on A string fret 2, ring on D string fret 2. Easiest full-sounding chord — we start here... First win to aim at: Build open Em with two fingers. Feel it in the hands before you chase neatness.",
    "guided": "Guided block — your drills, my pacing for day 3 — First Chord Win — E Minor. Start with: Build Em, count to four, release — do that ten times. Then: Down-strums on beats 1 and 3 only — name what you hear on the clean reps. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Loose on purpose — still in time. Day 3 jam on First Chord Win — E Minor — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 3. Session close. Win check: Hold Em for eight steady down-strums with every string ringing."
  },
  "4": {
    "arrive": "Day 4. Settle in — shoulders soft, phone down: Form a clear open G.",
    "warmup": "Day 4. Shake out, then touch today's material lightly. Light preview — Build G one finger at a time, then strum — fix buzz before speed.",
    "teach": "This is the bit that unlocks the rest: G major is G B D. Single shapes are nice; smooth changes are the real beginner skill. Keep shoulders soft; clean and slow today becomes... First win to aim at: Form a clear open G. Feel it in the hands before you chase neatness.",
    "guided": "This is the gym section for day 4 — Second Chord — G Major + First Change. Start with: Build G one finger at a time, then strum — fix buzz before speed. Then: Em | G at about 50 BPM, two bars each — name what you hear on the clean reps. Stay kind when it buzzes — adjust and repeat.",
    "jam": "This is the part you came for. Day 4 jam on Second Chord — G Major + First Change — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 4. Wind down: one gentle sound, then the win question. Win check: Complete four clean Em→G changes in 30 seconds. Do it twice so it was not a lucky fluke."
  },
  "5": {
    "arrive": "Day 5. Two minutes to show up fully: Form open C without choking the B or G strings.",
    "warmup": "Day 5. No hero warm-up — just honest prep. Light preview — Place C, then pluck strings 5 down to 1 one at a time.",
    "teach": "Teacher hat on for a minute: C major is C E G. Open C frets A3, D2, B1. Leaving the low E out is normal — not a mistake. Keep shoulders soft; clean and slow today... First win to aim at: Form open C without choking the B or G strings. Feel it in the hands before you chase neatness.",
    "guided": "Hands-on stretch for day 5 — C Major — Five-String Clarity. Start with: Place C, then pluck strings 5 down to 1 one at a time. Then: G–C–G–C at a walking tempo until both shapes ring clean. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Song-shaped minutes. Day 5 jam on C Major — Five-String Clarity — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 5. Cool-down — soft hands, honest check. Win check: Play C with five clear strings and no unwanted low-E bang."
  },
  "6": {
    "arrive": "Day 6. Check posture, then lock the intention: Form the open D triangle.",
    "warmup": "Day 6. Gentle start, then today's shapes. Light preview — Freeze the D triangle cleanly for ten full seconds.",
    "teach": "One clear idea today: D major is D F# A. It’s a top-four-string chord — missing the low strings is correct. Keep shoulders soft; clean and slow today becomes... First win to aim at: Form the open D triangle. Feel it in the hands before you chase neatness.",
    "guided": "Slow enough that form stays honest for day 6 — D Major — Triangle + Campfire Set. Start with: Freeze the D triangle cleanly for ten full seconds. Then: G–C–D–G loop four times — only bump tempo after every change rings. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Let the hands make a little story. Day 6 jam on D Major — Triangle + Campfire Set — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 6. Leave the guitar friendlier than you found it. Win check: Play the G–C–D progression twice without stopping."
  },
  "7": {
    "arrive": "Day 7. You are here. That already counts. Intention next: Treat Em G C D as one little vocabulary.",
    "warmup": "Day 7. We wake the specific muscles you will need. Light preview — Four bars on each chord at 70 BPM — stop and fix buzz before you add speed.",
    "teach": "Think of it like this: In the key of G: G is I, C is IV, D is V, Em is vi. Four chords unlock a ton of songs — play them today, don’t just name them. First win to aim at: Treat Em G C D as one little vocabulary. Feel it in the hands before you chase neatness.",
    "guided": "We will work the list in order for day 7 — Week 1 Jam — Em G C D Music. Start with: Four bars on each chord at 70 BPM — stop and fix buzz before you add speed. Then: Two minutes of continuous changes — keep the arm moving if you flub. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Fun pass: same skills, less judgment. Day 7 jam on Week 1 Jam — Em G C D Music — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 7. Soft landing. Win check: Play two continuous minutes moving among Em, G, C, and D in time."
  },
  "8": {
    "arrive": "Day 8. Land in the chair. One breath. Here is today's aim: Add clear Am and E shapes.",
    "warmup": "Day 8. Easy blood-flow first. Light preview — See Am as Em slid toward the floor — stop and fix buzz before you add speed.",
    "teach": "Here is the heart of it: Am is the relative minor of C. Shared shape families mean less to memorize — your hand already knows half the job. First win to aim at: Add clear Am and E shapes. Feel it in the hands before you chase neatness.",
    "guided": "Now we earn it with clean reps for day 8 — A Minor & E Major — Shape Family. Start with: See Am as Em slid toward the floor — stop and fix buzz before you add speed. Then: Am–E changes at 60 BPM until both shapes land without a scramble. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Play window — make it sound like a song fragment. Day 8 jam on A Minor & E Major — Shape Family — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 8. Ease out so tomorrow's hands forgive you. Win check: Eight clean strums each on Am and E with no dead notes."
  },
  "9": {
    "arrive": "Day 9. Arrive: tune if you can, then read the win out loud: Land downstrokes on the numbered beats.",
    "warmup": "Day 9. Warm the hands for what this day actually asks. Light preview — Muted D-D-D-D strums for 60 seconds — right hand only, loose.",
    "teach": "Let me put this simply: Count 1 & 2 & 3 & 4 &. Your right hand is the drummer; the fretting hand just changes costumes. Keep shoulders soft; clean and slow today... First win to aim at: Land downstrokes on the numbered beats. Feel it in the hands before you chase neatness.",
    "guided": "Reps with intention for day 9 — Strum Patterns — Downs, Ups, and &s. Start with: Muted D-D-D-D strums for 60 seconds — right hand only, loose. Then: D-DU-D-DU on G for 8 bars with the foot locked to the pulse. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Jam: stop drilling, start saying something. Day 9 jam on Strum Patterns — Downs, Ups, and &s — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 9. Session close. Win check: Play D-DU-D-DU on G for 8 bars without losing the count."
  },
  "10": {
    "arrive": "Day 10. Settle in — shoulders soft, phone down: Form open A cleanly.",
    "warmup": "Day 10. Shake out, then touch today's material lightly. Light preview — Freeze A and audit string by string — stop and fix buzz before you add speed.",
    "teach": "Before we grind reps: A major is A C# E. It’s a gateway to blues and rock in A. Often one finger is all that separates major from minor color. First win to aim at: Form open A cleanly. Feel it in the hands before you chase neatness.",
    "guided": "Practice loop time for day 10 — A Major — A–D–E Starter Set. Start with: Freeze A and audit string by string — stop and fix buzz before you add speed. Then: A–D–E–A twice at a walking pace — mute the open strings you do not want. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Music time — put the lesson inside something that grooves. Day 10 jam on A Major — A–D–E Starter Set — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 10. Wind down: one gentle sound, then the win question. Win check: Play two full A–D–E loops with steady time. Do it twice so it was not a lucky fluke."
  },
  "11": {
    "arrive": "Day 11. Two minutes to show up fully: Find the A root for box 1 on the low E string at fret 5.",
    "warmup": "Day 11. No hero warm-up — just honest prep. Light preview — Pulse the fret-5 root on beat 1 for 30 seconds before leaving it.",
    "teach": "Park the hands a second — idea first: After a week of chords, five notes are enough for first lead. A minor pentatonic is A C D E G. Box 1 (root on low-E fret 5) is the common... First win to aim at: Find the A root for box 1 on the low E string at fret 5. Feel it in the hands before you chase neatness.",
    "guided": "Guided block — your drills, my pacing for day 11 — Minor Pentatonic Box 1 — First Lead Map. Start with: Pulse the fret-5 root on beat 1 for 30 seconds before leaving it. Then: Ascend box 1, rest one full bar, then descend — keep the foot tapping. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Loose on purpose — still in time. Day 11 jam on Minor Pentatonic Box 1 — First Lead Map — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 11. Cool-down — soft hands, honest check. Win check: Play box 1 up and down in time at ~60 BPM and land on the A root."
  },
  "12": {
    "arrive": "Day 12. Check posture, then lock the intention: Learn the melody in short phrases.",
    "warmup": "Day 12. Gentle start, then today's shapes. Light preview — Learn phrase 1 only until you can play it twice without stopping.",
    "teach": "This is the bit that unlocks the rest: Melodies train ear and timing faster than empty shapes. Treat each phrase like a sentence — breathe between them. Singing a line before you... First win to aim at: Learn the melody in short phrases. Feel it in the hands before you chase neatness.",
    "guided": "This is the gym section for day 12 — First Melody — Twinkle in Open Position. Start with: Learn phrase 1 only until you can play it twice without stopping. Then: Call-and-response: sing the next phrase, then play it at the same speed. Stay kind when it buzzes — adjust and repeat.",
    "jam": "This is the part you came for. Day 12 jam on First Melody — Twinkle in Open Position — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 12. Leave the guitar friendlier than you found it. Win check: Play Twinkle phrase-by-phrase with a steady pulse and no rushing."
  },
  "13": {
    "arrive": "Day 13. You are here. That already counts. Intention next: Run 1-2-3-4 moving from string to string.",
    "warmup": "Day 13. We wake the specific muscles you will need. Light preview — Spider on B and high E only — even volume, no flying fingers.",
    "teach": "Teacher hat on for a minute: Independence is coordination, not strength. Slow spiders wire clean fretting for every chord you’ll learn later. First win to aim at: Run 1-2-3-4 moving from string to string. Feel it in the hands before you chase neatness.",
    "guided": "Hands-on stretch for day 13 — Finger Independence — Spider Across Strings. Start with: Spider on B and high E only — even volume, no flying fingers. Then: Add the G string only when the first two notes are already even. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Song-shaped minutes. Day 13 jam on Finger Independence — Spider Across Strings — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 13. Soft landing. Win check: Play a calm two-string spider for 60 seconds with even volume."
  },
  "14": {
    "arrive": "Day 14. Land in the chair. One breath. Here is today's aim: Fret a root + fifth power shape on the low strings.",
    "warmup": "Day 14. Easy blood-flow first. Light preview — Build E5 (open low E + 2nd fret A), then the same shape at frets 3 and 5 — name the root each time.",
    "teach": "One clear idea today: A power chord is root + fifth (often with the octave). No third means it is neither major nor minor — that is why it moves so easily and... First win to aim at: Fret a root + fifth power shape on the low strings. Feel it in the hands before you chase neatness.",
    "guided": "Slow enough that form stays honest for day 14 — Power Chords Intro — Two-Finger Rock. Start with: Build E5 (open low E + 2nd fret A), then the same shape at frets 3 and 5 — name the root each time. Then: Palm-mute eighth notes on one power chord for 60 seconds with a foot pulse. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Let the hands make a little story. Day 14 jam on Power Chords Intro — Two-Finger Rock — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 14. Ease out so tomorrow's hands forgive you. Win check: Play a four-bar power-chord riff twice with clear muting and steady time."
  },
  "15": {
    "arrive": "Day 15. Arrive: tune if you can, then read the win out loud: Watch which fingers travel farthest.",
    "warmup": "Day 15. Warm the hands for what this day actually asks. Light preview — G→C only for two minutes at ~50 BPM — fretting hand arrives early, strum arm stays lazy.",
    "teach": "Think of it like this: Economy of motion beats raw finger speed. Watch the shortest path between G, C, and D — shared fingers and small lifts are the real... First win to aim at: Watch which fingers travel farthest. Feel it in the hands before you chase neatness.",
    "guided": "We will work the list in order for day 15 — Switching Lab — Shrink the Motion. Start with: G→C only for two minutes at ~50 BPM — fretting hand arrives early, strum arm stays lazy. Then: C→D only for two minutes — plant the D triangle before you leave C. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Fun pass: same skills, less judgment. Day 15 jam on Switching Lab — Shrink the Motion — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 15. Session close. Win check: Make eight G–C–D changes where each landing is clean on beat 1."
  },
  "16": {
    "arrive": "Day 16. Settle in — shoulders soft, phone down: Learn the opening motif cleanly.",
    "warmup": "Day 16. Shake out, then touch today's material lightly. Light preview — Play the motif only, four times, before expanding.",
    "teach": "Here is the heart of it: A single-note theme over open chords builds the lead-and-rhythm brain without drowning you in theory. First win to aim at: Learn the opening motif cleanly. Feel it in the hands before you chase neatness.",
    "guided": "Now we earn it with clean reps for day 16 — Ode to Joy Motif — Melody Meets Chords. Start with: Play the motif only, four times, before expanding. Then: Motif | C chord | motif | G chord — name what you hear on the clean reps. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Play window — make it sound like a song fragment. Day 16 jam on Ode to Joy Motif — Melody Meets Chords — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 16. Wind down: one gentle sound, then the win question. Win check: Play the Ode motif twice and answer each time with a clean open chord."
  },
  "17": {
    "arrive": "Day 17. Two minutes to show up fully: Foot taps quarters the whole drill.",
    "warmup": "Day 17. No hero warm-up — just honest prep. Light preview — Foot-only quarters for 30 seconds — stop and fix buzz before you add speed.",
    "teach": "Let me put this simply: Listeners feel time before they notice fancy chords. Pocket means your notes agree with the pulse. Keep shoulders soft; clean and slow... First win to aim at: Foot taps quarters the whole drill. Feel it in the hands before you chase neatness.",
    "guided": "Reps with intention for day 17 — Rhythm Guitar Feel — Pocket Over Speed. Start with: Foot-only quarters for 30 seconds — stop and fix buzz before you add speed. Then: Muted groove for one minute — right hand stays in time, left hand mutes. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Jam: stop drilling, start saying something. Day 17 jam on Rhythm Guitar Feel — Pocket Over Speed — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 17. Cool-down — soft hands, honest check. Win check: Two minutes of chord changes where your foot never stops the pulse."
  },
  "18": {
    "arrive": "Day 18. Check posture, then lock the intention: Form clear open Dm.",
    "warmup": "Day 18. Gentle start, then today's shapes. Light preview — Pluck Dm string-by-string and fix dead notes — stop and fix buzz before you add speed.",
    "teach": "Before we grind reps: Minor lowers the third — F instead of F# in D. Your ear learns faster when you A/B the colors on purpose. First win to aim at: Form clear open Dm. Feel it in the hands before you chase neatness.",
    "guided": "Practice loop time for day 18 — D Minor & Mood — Major vs Minor Ears. Start with: Pluck Dm string-by-string and fix dead notes — stop and fix buzz before you add speed. Then: D | Dm | D | Dm — feel the one-finger shift, no rush between colors. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Music time — put the lesson inside something that grooves. Day 18 jam on D Minor & Mood — Major vs Minor Ears — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 18. Leave the guitar friendlier than you found it. Win check: Show D vs Dm clearly, then play one clean Dm–C–G loop."
  },
  "19": {
    "arrive": "Day 19. You are here. That already counts. Intention next: Form G7 and D7.",
    "warmup": "Day 19. We wake the specific muscles you will need. Light preview — Freeze G7 for a bar, then resolve to C like a door closing.",
    "teach": "Park the hands a second — idea first: A dominant 7th (1–3–5–b7) creates tension that wants the home chord. Folk and blues live on that pull. First win to aim at: Form G7 and D7. Feel it in the hands before you chase neatness.",
    "guided": "Guided block — your drills, my pacing for day 19 — Seventh Color — G7 and D7 as Magnets. Start with: Freeze G7 for a bar, then resolve to C like a door closing. Then: Freeze D7 for a bar, then resolve to G — hear the pull home. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Loose on purpose — still in time. Day 19 jam on Seventh Color — G7 and D7 as Magnets — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 19. Soft landing. Win check: Play two clear V7→I resolutions: G7→C and D7→G. Do it twice so it was not a lucky fluke."
  },
  "20": {
    "arrive": "Day 20. Land in the chair. One breath. Here is today's aim: Thumb plays bass on beat 1.",
    "warmup": "Day 20. Easy blood-flow first. Light preview — Thumb on open A only for one minute — stop and fix buzz before you add speed.",
    "teach": "This is the bit that unlocks the rest: Travis-style seeds start with thumb independence. A steady bass makes sparse treble sound pro. Keep shoulders soft; clean and slow today... First win to aim at: Thumb plays bass on beat 1. Feel it in the hands before you chase neatness.",
    "guided": "This is the gym section for day 20 — Simple Fingerstyle Seed — Thumb + i. Start with: Thumb on open A only for one minute — stop and fix buzz before you add speed. Then: Add index on the B string on the &s — name what you hear on the clean reps. Stay kind when it buzzes — adjust and repeat.",
    "jam": "This is the part you came for. Day 20 jam on Simple Fingerstyle Seed — Thumb + i — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 20. Ease out so tomorrow's hands forgive you. Win check: Play 8 bars of thumb-bass + index answer without rushing."
  },
  "21": {
    "arrive": "Day 21. Arrive: tune if you can, then read the win out loud: Barre high E and B at fret 1 lightly.",
    "warmup": "Day 21. Warm the hands for what this day actually asks. Light preview — One-finger barre chirps, ten times — stop and fix buzz before you add speed.",
    "teach": "Teacher hat on for a minute: Full F barre is a milestone, not a day-one law. Mini shapes and patience beat forced pain. Keep shoulders soft; clean and slow today... First win to aim at: Barre high E and B at fret 1 lightly. Feel it in the hands before you chase neatness.",
    "guided": "Hands-on stretch for day 21 — Barre Preview — One-Finger Mini F. Start with: One-finger barre chirps, ten times — stop and fix buzz before you add speed. Then: Fmaj7 (easy version) as an alternate win — name what you hear on the clean reps. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Song-shaped minutes. Day 21 jam on Barre Preview — One-Finger Mini F — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 21. Session close. Win check: Sound two clean treble strings under a light fret-1 barre ten times."
  },
  "22": {
    "arrive": "Day 22. Settle in — shoulders soft, phone down: Hum a 3-note idea.",
    "warmup": "Day 22. Shake out, then touch today's material lightly. Light preview — Hum a note, hunt it on the neck, check — five calm rounds.",
    "teach": "One clear idea today: Voice to fret is the shortest path to owning music. Wrong notes are clues, not crimes. Keep shoulders soft; clean and slow today becomes... First win to aim at: Hum a 3-note idea. Feel it in the hands before you chase neatness.",
    "guided": "Slow enough that form stays honest for day 22 — Ear Starter — Find Melodies You Hum. Start with: Hum a note, hunt it on the neck, check — five calm rounds. Then: Change the starting pitch once and hunt the new note cleanly. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Let the hands make a little story. Day 22 jam on Ear Starter — Find Melodies You Hum — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 22. Wind down: one gentle sound, then the win question. Win check: Match a hummed 3-note idea on the guitar twice in a row."
  },
  "23": {
    "arrive": "Day 23. Two minutes to show up fully: Play the same progression at two volumes.",
    "warmup": "Day 23. No hero warm-up — just honest prep. Light preview — G–C–D at whisper volume with locked time — stop and fix buzz before you add speed.",
    "teach": "Think of it like this: Expression is mostly right hand. Same chords, different story — instant “oh, that sounds like a song” upgrade. First win to aim at: Play the same progression at two volumes. Feel it in the hands before you chase neatness.",
    "guided": "We will work the list in order for day 23 — Dynamics — Soft Verse, Bigger Chorus. Start with: G–C–D at whisper volume with locked time — stop and fix buzz before you add speed. Then: Same progression at conversation level — name what you hear on the clean reps. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Fun pass: same skills, less judgment. Day 23 jam on Dynamics — Soft Verse, Bigger Chorus — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 23. Cool-down — soft hands, honest check. Win check: Play 16 bars with a soft-to-louder lift someone else could notice."
  },
  "24": {
    "arrive": "Day 24. Check posture, then lock the intention: Palm mute near the bridge.",
    "warmup": "Day 24. Gentle start, then today's shapes. Light preview — Palm-muted open low-E eighths near the bridge — stop and fix buzz before you add speed.",
    "teach": "Here is the heart of it: Great rhythm guitar is half silence. Mutes turn strums into drums — practice the quiet as hard as the hit. First win to aim at: Palm mute near the bridge. Feel it in the hands before you chase neatness.",
    "guided": "Now we earn it with clean reps for day 24 — Mute Craft — Left and Right Hand Silence. Start with: Palm-muted open low-E eighths near the bridge — stop and fix buzz before you add speed. Then: Chuck lightly on the &s between chord hits — groove, not noise. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Play window — make it sound like a song fragment. Day 24 jam on Mute Craft — Left and Right Hand Silence — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 24. Leave the guitar friendlier than you found it. Win check: Play 8 bars where mutes and rings are obviously on purpose."
  },
  "25": {
    "arrive": "Day 25. You are here. That already counts. Intention next: Pick a 4-note melody cell.",
    "warmup": "Day 25. We wake the specific muscles you will need. Light preview — Build a cell on the high strings — stop and fix buzz before you add speed.",
    "teach": "Let me put this simply: Making something tiny of your own locks skills better than drills alone. Small songs beat perfect exercises. First win to aim at: Pick a 4-note melody cell. Feel it in the hands before you chase neatness.",
    "guided": "Reps with intention for day 25 — Song Sketch — Combine Melody + Two Chords. Start with: Build a cell on the high strings — stop and fix buzz before you add speed. Then: Cell | Em | cell | G — leave a breath before each chord so the cell stays clear. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Jam: stop drilling, start saying something. Day 25 jam on Song Sketch — Combine Melody + Two Chords — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 25. Soft landing. Win check: Perform your 4-bar sketch twice from memory. Do it twice so it was not a lucky fluke."
  },
  "26": {
    "arrive": "Day 26. Land in the chair. One breath. Here is today's aim: Play only on beat 1 of each bar for one minute.",
    "warmup": "Day 26. Easy blood-flow first. Light preview — Chord hits on beat 1 only for 8 bars — silence is part of the groove.",
    "teach": "Before we grind reps: A metronome tells the truth kindly. Landing late or early is just data for the next rep. Keep shoulders soft; clean and slow today becomes... First win to aim at: Play only on beat 1 of each bar for one minute. Feel it in the hands before you chase neatness.",
    "guided": "Practice loop time for day 26 — Timing Honesty — Metronome as Friend. Start with: Chord hits on beat 1 only for 8 bars — silence is part of the groove. Then: Hits on 1 and 3 for 8 bars; keep 2 and 4 empty on purpose. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Music time — put the lesson inside something that grooves. Day 26 jam on Timing Honesty — Metronome as Friend — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 26. Ease out so tomorrow's hands forgive you. Win check: Stay with the click for 90 seconds of simple chord hits."
  },
  "27": {
    "arrive": "Day 27. Arrive: tune if you can, then read the win out loud: Name your messiest shape honestly.",
    "warmup": "Day 27. Warm the hands for what this day actually asks. Light preview — Rank Em G C D A Am E from cleanest to messiest — stop and fix buzz before you add speed.",
    "teach": "Park the hands a second — idea first: Fixing the weak link beats replaying what already feels good. One rescue per session adds up fast. Keep shoulders soft; clean and slow... First win to aim at: Name your messiest shape honestly. Feel it in the hands before you chase neatness.",
    "guided": "Guided block — your drills, my pacing for day 27 — Review Web — Weakest Chord Rescue. Start with: Rank Em G C D A Am E from cleanest to messiest — stop and fix buzz before you add speed. Then: Ugly-chord gym for five minutes — freeze shapes, then release. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Loose on purpose — still in time. Day 27 jam on Review Web — Weakest Chord Rescue — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 27. Session close. Win check: Name your weakest chord and show ten cleaner frets of it than your usual rush job."
  },
  "28": {
    "arrive": "Day 28. Settle in — shoulders soft, phone down: Form E7 and A7.",
    "warmup": "Day 28. Shake out, then touch today's material lightly. Light preview — E7 for four bars, A7 for two, back again — stop and fix buzz before you add speed.",
    "teach": "This is the bit that unlocks the rest: Dominant chords plus a long-short shuffle feel = instant blues flavor, even before a full 12-bar form. First win to aim at: Form E7 and A7. Feel it in the hands before you chase neatness.",
    "guided": "This is the gym section for day 28 — Blues Tease — E7 A7 Shuffle Feel. Start with: E7 for four bars, A7 for two, back again — stop and fix buzz before you add speed. Then: Long-short shuffle strum attempt — name what you hear on the clean reps. Stay kind when it buzzes — adjust and repeat.",
    "jam": "This is the part you came for. Day 28 jam on Blues Tease — E7 A7 Shuffle Feel — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 28. Wind down: one gentle sound, then the win question. Win check: Play a slow E7/A7 groove that feels like one full blues chorus."
  },
  "29": {
    "arrive": "Day 29. Two minutes to show up fully: Check thumb and wrist for strain signs.",
    "warmup": "Day 29. No hero warm-up — just honest prep. Light preview — Run a quick posture checklist: thumb, wrist, shoulders, breath.",
    "teach": "Teacher hat on for a minute: There’s no badge for pain. The only technique that reaches day 365 is the one you can still do next week. First win to aim at: Check thumb and wrist for strain signs. Feel it in the hands before you chase neatness.",
    "guided": "Hands-on stretch for day 29 — Comfort Setup — Pain Flags and Breaks. Start with: Run a quick posture checklist: thumb, wrist, shoulders, breath. Then: Play four minutes, break thirty seconds, repeat — name what you hear on the clean reps. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Song-shaped minutes. Day 29 jam on Comfort Setup — Pain Flags and Breaks — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 29. Cool-down — soft hands, honest check. Win check: Finish today’s playing without pushing through sharp pain."
  },
  "30": {
    "arrive": "Day 30. Check posture, then lock the intention: Medley: a progression, a tiny melody, a groove.",
    "warmup": "Day 30. Gentle start, then today's shapes. Light preview — Jot a three-minute order on paper — stop and fix buzz before you add speed.",
    "teach": "One clear idea today: Performance is a skill: start, keep going, recover, end. Today proves you can transfer the month — not recite trivia. First win to aim at: Medley: a progression, a tiny melody, a groove. Feel it in the hands before you chase neatness.",
    "guided": "Slow enough that form stays honest for day 30 — Basics Capstone — 3-Minute Campfire Set. Start with: Jot a three-minute order on paper — stop and fix buzz before you add speed. Then: Full run with no stops — restart only after the end. Stay kind when it buzzes — adjust and repeat.",
    "jam": "Let the hands make a little story. Day 30 jam on Basics Capstone — 3-Minute Campfire Set — Tiny song energy: few notes, steady pulse, done.",
    "cooldown": "Day 30. Leave the guitar friendlier than you found it. Win check: Deliver about three minutes using at least three chords and one melodic idea."
  },
  "31": {
    "arrive": "Day 31. You are here. That already counts. Intention next: Name what “clean change” means for you today.",
    "warmup": "Day 31. We wake the specific muscles you will need. Light preview — Pick your two easiest open chords and change only on beat 1 for two minutes.",
    "teach": "Think of it like this: This phase is about changes that ring, not a bigger chord dictionary. Slow accurate reps beat fast sloppy ones. We keep working G, C, D... First win to aim at: Name what “clean change” means for you today. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "We will work the list in order for day 31 — Chord Phase Open — Clean Changes First. Start with: Pick your two easiest open chords and change only on beat 1 for two minutes. Then: Same pair with a metronome under 70 BPM — if buzz appears, slow down again. Change only as fast as both shapes still ring.",
    "jam": "Fun pass: same skills, less judgment. Day 31 jam on Chord Phase Open — Clean Changes First — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 31. Soft landing. Win check: Two minutes of one chord pair where most downbeats ring clean at a humble tempo."
  },
  "32": {
    "arrive": "Day 32. Land in the chair. One breath. Here is today's aim: Land clean G on beat 1.",
    "warmup": "Day 32. Easy blood-flow first. Light preview — Freeze G and strum eight even downstrokes — fix buzz before you move.",
    "teach": "Here is the heart of it: Shared notes and a short path make G–C a high-ROI first highway. Practice the change as its own song: two chords, honest time, fretting... First win to aim at: Land clean G on beat 1. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Now we earn it with clean reps for day 32 — G–C Highway — Change Lab. Start with: Freeze G and strum eight even downstrokes — fix buzz before you move. Then: G→C in half notes ×16 — left hand early, right hand lazy and steady. Change only as fast as both shapes still ring.",
    "jam": "Play window — make it sound like a song fragment. Day 32 jam on G–C Highway — Change Lab — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 32. Ease out so tomorrow's hands forgive you. Win check: Sixteen controlled G→C changes with clear downbeats."
  },
  "33": {
    "arrive": "Day 33. Arrive: tune if you can, then read the win out loud: Land clean C on beat 1.",
    "warmup": "Day 33. Warm the hands for what this day actually asks. Light preview — Freeze C and strum eight even downstrokes — fix buzz before you move.",
    "teach": "Let me put this simply: C to D is a shape jump — plant D’s triangle early so beat 1 is not a surprise. Practice the change as its own song: two chords, honest... First win to aim at: Land clean C on beat 1. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Reps with intention for day 33 — C–D Highway — Change Lab. Start with: Freeze C and strum eight even downstrokes — fix buzz before you move. Then: C→D in half notes ×16 — left hand early, right hand lazy and steady. Change only as fast as both shapes still ring.",
    "jam": "Jam: stop drilling, start saying something. Day 33 jam on C–D Highway — Change Lab — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 33. Session close. Win check: Sixteen controlled C→D changes with clear downbeats."
  },
  "34": {
    "arrive": "Day 34. Settle in — shoulders soft, phone down: Land clean D on beat 1.",
    "warmup": "Day 34. Shake out, then touch today's material lightly. Light preview — Freeze D and strum eight even downstrokes — fix buzz before you move.",
    "teach": "Before we grind reps: D to Em flips mood; keep the right hand boring so the left hand can be accurate. Practice the change as its own song: two chords, honest... First win to aim at: Land clean D on beat 1. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Practice loop time for day 34 — D–Em Highway — Change Lab. Start with: Freeze D and strum eight even downstrokes — fix buzz before you move. Then: D→Em in half notes ×16 — left hand early, right hand lazy and steady. Change only as fast as both shapes still ring.",
    "jam": "Music time — put the lesson inside something that grooves. Day 34 jam on D–Em Highway — Change Lab — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 34. Wind down: one gentle sound, then the win question. Win check: Sixteen controlled D→Em changes with clear downbeats."
  },
  "35": {
    "arrive": "Day 35. Two minutes to show up fully: Land clean Em on beat 1.",
    "warmup": "Day 35. No hero warm-up — just honest prep. Light preview — Freeze Em and strum eight even downstrokes — fix buzz before you move.",
    "teach": "Park the hands a second — idea first: Em–Am are kin shapes — notice what can stay close to the string. Practice the change as its own song: two chords, honest time, fretting... First win to aim at: Land clean Em on beat 1. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Guided block — your drills, my pacing for day 35 — Em–Am Highway — Change Lab. Start with: Freeze Em and strum eight even downstrokes — fix buzz before you move. Then: Em→Am in half notes ×16 — left hand early, right hand lazy and steady. Change only as fast as both shapes still ring.",
    "jam": "Loose on purpose — still in time. Day 35 jam on Em–Am Highway — Change Lab — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 35. Cool-down — soft hands, honest check. Win check: Sixteen controlled Em→Am changes with clear downbeats."
  },
  "36": {
    "arrive": "Day 36. Check posture, then lock the intention: Land clean Am on beat 1.",
    "warmup": "Day 36. Gentle start, then today's shapes. Light preview — Freeze Am and strum eight even downstrokes — fix buzz before you move.",
    "teach": "This is the bit that unlocks the rest: Am to E is drama in two grips; leave a hair of air if you need it, but keep the pulse. Practice the change as its own song: two chords... First win to aim at: Land clean Am on beat 1. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "This is the gym section for day 36 — Am–E Highway — Change Lab. Start with: Freeze Am and strum eight even downstrokes — fix buzz before you move. Then: Am→E in half notes ×16 — left hand early, right hand lazy and steady. Change only as fast as both shapes still ring.",
    "jam": "This is the part you came for. Day 36 jam on Am–E Highway — Change Lab — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 36. Leave the guitar friendlier than you found it. Win check: Sixteen controlled Am→E changes with clear downbeats."
  },
  "37": {
    "arrive": "Day 37. You are here. That already counts. Intention next: Land clean E on beat 1.",
    "warmup": "Day 37. We wake the specific muscles you will need. Light preview — Freeze E and strum eight even downstrokes — fix buzz before you move.",
    "teach": "Teacher hat on for a minute: E–A is a rock gate on the neck — roots move, grip logic stays related. Practice the change as its own song: two chords, honest time... First win to aim at: Land clean E on beat 1. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Hands-on stretch for day 37 — E–A Highway — Change Lab. Start with: Freeze E and strum eight even downstrokes — fix buzz before you move. Then: E→A in half notes ×16 — left hand early, right hand lazy and steady. Change only as fast as both shapes still ring.",
    "jam": "Song-shaped minutes. Day 37 jam on E–A Highway — Change Lab — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 37. Soft landing. Win check: Sixteen controlled E→A changes with clear downbeats."
  },
  "38": {
    "arrive": "Day 38. Land in the chair. One breath. Here is today's aim: Land clean A on beat 1.",
    "warmup": "Day 38. Easy blood-flow first. Light preview — Freeze A and strum eight even downstrokes — fix buzz before you move.",
    "teach": "One clear idea today: A to D should feel like a bright lift; mute strings that do not belong in D. Practice the change as its own song: two chords, honest time... First win to aim at: Land clean A on beat 1. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Slow enough that form stays honest for day 38 — A–D Highway — Change Lab. Start with: Freeze A and strum eight even downstrokes — fix buzz before you move. Then: A→D in half notes ×16 — left hand early, right hand lazy and steady. Change only as fast as both shapes still ring.",
    "jam": "Let the hands make a little story. Day 38 jam on A–D Highway — Change Lab — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 38. Ease out so tomorrow's hands forgive you. Win check: Sixteen controlled A→D changes with clear downbeats."
  },
  "39": {
    "arrive": "Day 39. Arrive: tune if you can, then read the win out loud: Land clean G on beat 1.",
    "warmup": "Day 39. Warm the hands for what this day actually asks. Light preview — Freeze G and strum eight even downstrokes — fix buzz before you move.",
    "teach": "Think of it like this: G–Em softens major to minor with a small story change — hear it, do not rush it. Practice the change as its own song: two chords, honest... First win to aim at: Land clean G on beat 1. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "We will work the list in order for day 39 — G–Em Highway — Change Lab. Start with: Freeze G and strum eight even downstrokes — fix buzz before you move. Then: G→Em in half notes ×16 — left hand early, right hand lazy and steady. Change only as fast as both shapes still ring.",
    "jam": "Fun pass: same skills, less judgment. Day 39 jam on G–Em Highway — Change Lab — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 39. Session close. Win check: Sixteen controlled G→Em changes with clear downbeats."
  },
  "40": {
    "arrive": "Day 40. Settle in — shoulders soft, phone down: Land clean C on beat 1.",
    "warmup": "Day 40. Shake out, then touch today's material lightly. Light preview — Freeze C and strum eight even downstrokes — fix buzz before you move.",
    "teach": "Here is the heart of it: C and Am are relatives — same neighborhood of notes, different home base. Practice the change as its own song: two chords, honest time... First win to aim at: Land clean C on beat 1. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Now we earn it with clean reps for day 40 — C–Am Highway — Change Lab. Start with: Freeze C and strum eight even downstrokes — fix buzz before you move. Then: C→Am in half notes ×16 — left hand early, right hand lazy and steady. Change only as fast as both shapes still ring.",
    "jam": "Play window — make it sound like a song fragment. Day 40 jam on C–Am Highway — Change Lab — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 40. Wind down: one gentle sound, then the win question. Win check: Sixteen controlled C→Am changes with clear downbeats."
  },
  "41": {
    "arrive": "Day 41. Two minutes to show up fully: Land clean G on beat 1.",
    "warmup": "Day 41. No hero warm-up — just honest prep. Light preview — Freeze G and strum eight even downstrokes — fix buzz before you move.",
    "teach": "Let me put this simply: G–D is anthem fuel; big open strings still need quiet unused noise. Practice the change as its own song: two chords, honest time, fretting... First win to aim at: Land clean G on beat 1. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Reps with intention for day 41 — G–D Highway — Change Lab. Start with: Freeze G and strum eight even downstrokes — fix buzz before you move. Then: G→D in half notes ×16 — left hand early, right hand lazy and steady. Change only as fast as both shapes still ring.",
    "jam": "Jam: stop drilling, start saying something. Day 41 jam on G–D Highway — Change Lab — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 41. Cool-down — soft hands, honest check. Win check: Sixteen controlled G→D changes with clear downbeats."
  },
  "42": {
    "arrive": "Day 42. Check posture, then lock the intention: Play an easy F-color grip that still functions as F in a progression.",
    "warmup": "Day 42. Gentle start, then today's shapes. Light preview — Build Fmaj7 or mini-F; pluck string-by-string and fix mutes before strumming.",
    "teach": "Before we grind reps: Full F barre is a strength project. Fmaj7 or a mini-F gives you F function in songs with less compression — successive approximation... First win to aim at: Play an easy F-color grip that still functions as F in a progression. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Practice loop time for day 42 — F Maj7 Gateway — Barre Without Tears. Start with: Build Fmaj7 or mini-F; pluck string-by-string and fix mutes before strumming. Then: C→F-color changes for two minutes — hear the quality land before you leave. Change only as fast as both shapes still ring.",
    "jam": "Music time — put the lesson inside something that grooves. Day 42 jam on F Maj7 Gateway — Barre Without Tears — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 42. Leave the guitar friendlier than you found it. Win check: Play one clean C–Am–F-color–G chorus that stays pain-free and musical."
  },
  "43": {
    "arrive": "Day 43. You are here. That already counts. Intention next: Roll the barre finger for even light pressure.",
    "warmup": "Day 43. We wake the specific muscles you will need. Light preview — Barre chirps on fret 1: light press, release before burn — about one minute total work.",
    "teach": "Park the hands a second — idea first: Barre strength is tissue adaptation over weeks, not one heroic squeeze. Roll the index slightly, bring the elbow forward a little, and... First win to aim at: Roll the barre finger for even light pressure. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Guided block — your drills, my pacing for day 43 — Full F Attempt — Strength + Mercy. Start with: Barre chirps on fret 1: light press, release before burn — about one minute total work. Then: Hold full F for four slow strums, shake out, repeat up to five times. Change only as fast as both shapes still ring.",
    "jam": "Loose on purpose — still in time. Day 43 jam on Full F Attempt — Strength + Mercy — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 43. Soft landing. Win check: Produce four consecutive F strums where the melody strings speak clearly."
  },
  "44": {
    "arrive": "Day 44. Land in the chair. One breath. Here is today's aim: See Bm as Am shape at fret 2.",
    "warmup": "Day 44. Easy blood-flow first. Light preview — Air-shape Am then slide idea to fret 2 — fretting hand early, strum arm never freezes.",
    "teach": "This is the bit that unlocks the rest: Movable minor shapes unlock the neck. Bm is the classic first barre minor after F struggles. Right hand stays boring and steady so the... First win to aim at: See Bm as Am shape at fret 2. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "This is the gym section for day 44 — B Minor Barre — Am Shape Moved. Start with: Air-shape Am then slide idea to fret 2 — fretting hand early, strum arm never freezes. Then: Bm string audit low to high — fix the first dead string before moving on. Change only as fast as both shapes still ring.",
    "jam": "This is the part you came for. Day 44 jam on B Minor Barre — Am Shape Moved — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 44. Ease out so tomorrow's hands forgive you. Win check: Play Bm clear enough for a two-bar loop into G. Tempo can be slow — clarity is the pass."
  },
  "45": {
    "arrive": "Day 45. Arrive: tune if you can, then read the win out loud: Spot open C as a CAGED anchor.",
    "warmup": "Day 45. Warm the hands for what this day actually asks. Light preview — Open C arpeggio — one note at a time until every string speaks.",
    "teach": "Teacher hat on for a minute: CAGED maps five chord shapes up the neck so the same chord can live in different neighborhoods. Today is just a peek at the C-shape home. First win to aim at: Spot open C as a CAGED anchor. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Hands-on stretch for day 45 — CAGED Peek — C Shape Home. Start with: Open C arpeggio — one note at a time until every string speaks. Then: Library CAGED C riff once slow, then once at song tempo. Change only as fast as both shapes still ring.",
    "jam": "Song-shaped minutes. Day 45 jam on CAGED Peek — C Shape Home — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 45. Session close. Win check: Arpeggiate open C ascending and descending cleanly twice."
  },
  "46": {
    "arrive": "Day 46. Settle in — shoulders soft, phone down: Own C–Am–F–G order.",
    "warmup": "Day 46. Shake out, then touch today's material lightly. Light preview — Chord order chant while fretting — fretting hand early, strum arm never freezes.",
    "teach": "One clear idea today: The 50s/pop progression is ear candy and change training in one. F may be Fmaj7. Right hand stays boring and steady so the fretting hand... First win to aim at: Own C–Am–F–G order. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Slow enough that form stays honest for day 46 — I–vi–IV–V Pop Engine in C. Start with: Chord order chant while fretting — fretting hand early, strum arm never freezes. Then: Loop the drill at 72 BPM with a metronome click — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Let the hands make a little story. Day 46 jam on I–vi–IV–V Pop Engine in C — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 46. Wind down: one gentle sound, then the win question. Win check: Play two full C–Am–F–G choruses without stopping. Tempo can be slow — clarity is the pass."
  },
  "47": {
    "arrive": "Day 47. Two minutes to show up fully: Memorize 12-bar map in A.",
    "warmup": "Day 47. No hero warm-up — just honest prep. Light preview — Air-count 12 bars of form before you touch strings.",
    "teach": "Think of it like this: Form memory is musicianship. 12-bar blues is a reusable story: home, away, home, turnaround. Right hand stays boring and steady so the... First win to aim at: Memorize 12-bar map in A. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "We will work the list in order for day 47 — 12-Bar Blues Form — Count the Story. Start with: Air-count 12 bars of form before you touch strings. Then: One chorus chords only — no fills, just even time and clear shapes. Change only as fast as both shapes still ring.",
    "jam": "Fun pass: same skills, less judgment. Day 47 jam on 12-Bar Blues Form — Count the Story — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 47. Cool-down — soft hands, honest check. Win check: Play one full 12-bar chorus in A with correct chord changes."
  },
  "48": {
    "arrive": "Day 48. Check posture, then lock the intention: Walk Am–G–F–E slowly.",
    "warmup": "Day 48. Gentle start, then today's shapes. Light preview — Hold two bars on each chord before changing — fretting hand early, strum arm never freezes.",
    "teach": "Here is the heart of it: Am–G–F–E is a centuries-old descent. The E major chord is the spicy door home to Am. Right hand stays boring and steady so the fretting... First win to aim at: Walk Am–G–F–E slowly. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Now we earn it with clean reps for day 48 — Andalusian Color — Am G F E. Start with: Hold two bars on each chord before changing — fretting hand early, strum arm never freezes. Then: Emphasize the bass note on beat 1, then lighter strums after. Change only as fast as both shapes still ring.",
    "jam": "Play window — make it sound like a song fragment. Day 48 jam on Andalusian Color — Am G F E — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 48. Leave the guitar friendlier than you found it. Win check: Play two Andalusian cycles with a deliberate dramatic E."
  },
  "49": {
    "arrive": "Day 49. You are here. That already counts. Intention next: Play Dm–G7–C.",
    "warmup": "Day 49. We wake the specific muscles you will need. Light preview — Dm–G7–C at ballad tempo — let G7 pull toward C — fretting hand early, strum arm never freezes.",
    "teach": "Let me put this simply: Ii–V–I is the backbone of countless standards. Small vocabulary, huge repertoire unlock. Right hand stays boring and steady so the fretting... First win to aim at: Play Dm–G7–C. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Reps with intention for day 49 — Jazz Tease — ii–V–I in C. Start with: Dm–G7–C at ballad tempo — let G7 pull toward C — fretting hand early, strum arm never freezes. Then: Loop Am–Dm–G7–C four times with steady time — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Jam: stop drilling, start saying something. Day 49 jam on Jazz Tease — ii–V–I in C — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 49. Soft landing. Win check: Play four clean ii–V–I cadences in C. Tempo can be slow — clarity is the pass."
  },
  "50": {
    "arrive": "Day 50. Land in the chair. One breath. Here is today's aim: Alternate G and G/B feeling via bass focus.",
    "warmup": "Day 50. Easy blood-flow first. Light preview — G with low B emphasis if fretted — fretting hand early, strum arm never freezes.",
    "teach": "Before we grind reps: Bass motion sells a progression. Even simple open-string bass changes make campfire chords cinematic. First win to aim at: Alternate G and G/B feeling via bass focus. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Practice loop time for day 50 — Slash Ideas — Bass Motion Without New Shapes. Start with: G with low B emphasis if fretted — fretting hand early, strum arm never freezes. Then: C with low E drone experiments carefully — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Music time — put the lesson inside something that grooves. Day 50 jam on Slash Ideas — Bass Motion Without New Shapes — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 50. Ease out so tomorrow's hands forgive you. Win check: Show one progression where bass motion is obviously on purpose."
  },
  "51": {
    "arrive": "Day 51. Arrive: tune if you can, then read the win out loud: After each grab, pluck strings one by one.",
    "warmup": "Day 51. Warm the hands for what this day actually asks. Light preview — String-audit G, C, D, and Am for buzz-free frets.",
    "teach": "Park the hands a second — idea first: Diagnosis before speed. Pros still pluck-audit when a chord turns to mud — name the dead string, fix only that, then rejoin the shape. First win to aim at: After each grab, pluck strings one by one. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Guided block — your drills, my pacing for day 51 — Dead-Note Clinic — Pluck Audit Method. Start with: String-audit G, C, D, and Am for buzz-free frets. Then: Worst-string isolation 3 minutes — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Loose on purpose — still in time. Day 51 jam on Dead-Note Clinic — Pluck Audit Method — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 51. Session close. Win check: Show before/after: one chord goes from muddy to clear via audit fixes."
  },
  "52": {
    "arrive": "Day 52. Settle in — shoulders soft, phone down: Bass note on beats 1 and 3.",
    "warmup": "Day 52. Shake out, then touch today's material lightly. Light preview — Open-G boom-chuck for 1 minute — bass note clear, chuck light.",
    "teach": "This is the bit that unlocks the rest: Boom-chuck separates bass and chord — instant country/folk color without learning new harmony. Thumb tells the story; chord snaps the... First win to aim at: Bass note on beats 1 and 3. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "This is the gym section for day 52 — Strum Vocabulary — Boom-Chuck Country Seed. Start with: Open-G boom-chuck for 1 minute — bass note clear, chuck light. Then: Add C and D chords into the loop with clean changes. Change only as fast as both shapes still ring.",
    "jam": "This is the part you came for. Day 52 jam on Strum Vocabulary — Boom-Chuck Country Seed — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 52. Wind down: one gentle sound, then the win question. Win check: Play 8 bars of boom-chuck G–C–D with audible bass/chord split."
  },
  "53": {
    "arrive": "Day 53. Two minutes to show up fully: Chop chords on the &s.",
    "warmup": "Day 53. No hero warm-up — just honest prep. Light preview — Muted & chops 1 minute — left hand mutes, right hand stays in time.",
    "teach": "Teacher hat on for a minute: Space defines reggae guitar. Hitting less is the skill — upstrokes and mutes do the dance. Right hand stays boring and steady so the... First win to aim at: Chop chords on the &s. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Hands-on stretch for day 53 — Reggae Skank Seed — Upbeat Chops. Start with: Muted & chops 1 minute — left hand mutes, right hand stays in time. Then: Loop C–G skank rhythm for 8 bars with muted chucks. Change only as fast as both shapes still ring.",
    "jam": "Song-shaped minutes. Day 53 jam on Reggae Skank Seed — Upbeat Chops — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 53. Cool-down — soft hands, honest check. Win check: Play 8 bars of upbeat chops with quiet downbeats. Tempo can be slow — clarity is the pass."
  },
  "54": {
    "arrive": "Day 54. Check posture, then lock the intention: Thumb on C bass (A string).",
    "warmup": "Day 54. Gentle start, then today's shapes. Light preview — Pima arpeggio on open strings for one minute — fretting hand early, strum arm never freezes.",
    "teach": "One clear idea today: Classical/folk pattern pima builds right-hand automation so left hand can think about songs. Right hand stays boring and steady so the... First win to aim at: Thumb on C bass (A string). Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Slow enough that form stays honest for day 54 — Fingerpicking Pattern — p-i-m-a Seed in C. Start with: Pima arpeggio on open strings for one minute — fretting hand early, strum arm never freezes. Then: Play p-i-m-a arpeggios on the open C shape slowly. Change only as fast as both shapes still ring.",
    "jam": "Let the hands make a little story. Day 54 jam on Fingerpicking Pattern — p-i-m-a Seed in C — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 54. Leave the guitar friendlier than you found it. Win check: Play 8 bars of steady pima on C, then 4 bars changing to G."
  },
  "55": {
    "arrive": "Day 55. You are here. That already counts. Intention next: If you own a capo, place at fret 2 and play G shapes.",
    "warmup": "Day 55. We wake the specific muscles you will need. Light preview — G–C–D open, then with capo 2 if available — fretting hand early, strum arm never freezes.",
    "teach": "Think of it like this: Capos let beginners play in many keys with open shapes — practical musicianship over theory pride. Right hand stays boring and steady so... First win to aim at: If you own a capo, place at fret 2 and play G shapes. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "We will work the list in order for day 55 — Capo Creativity — Same Shapes New Key. Start with: G–C–D open, then with capo 2 if available — fretting hand early, strum arm never freezes. Then: Sing a higher comfortable note and find it slowly on the neck. Change only as fast as both shapes still ring.",
    "jam": "Fun pass: same skills, less judgment. Day 55 jam on Capo Creativity — Same Shapes New Key — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 55. Soft landing. Win check: Show the same progression in two pitch levels (capo or movable idea)."
  },
  "56": {
    "arrive": "Day 56. Land in the chair. One breath. Here is today's aim: Hold C shape.",
    "warmup": "Day 56. Easy blood-flow first. Light preview — Try C with high E open, fret 1, and fret 3 — pick the clearest.",
    "teach": "Here is the heart of it: Chord-melody starts as ‘pad + top note.’ Smallest version still sounds arranged. Right hand stays boring and steady so the fretting hand... First win to aim at: Hold C shape. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Now we earn it with clean reps for day 56 — Chord Melody Seed — Melody on Top of C. Start with: Try C with high E open, fret 1, and fret 3 — pick the clearest. Then: Resolve top notes to E (chord tone) — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Play window — make it sound like a song fragment. Day 56 jam on Chord Melody Seed — Melody on Top of C — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 56. Ease out so tomorrow's hands forgive you. Win check: Play a 4-bar idea where a C pad supports a changing top note."
  },
  "57": {
    "arrive": "Day 57. Arrive: tune if you can, then read the win out loud: One chorus 12-bar A7 world.",
    "warmup": "Day 57. Warm the hands for what this day actually asks. Light preview — Play one full blues chorus with the form locked — fretting hand early, strum arm never freezes.",
    "teach": "Let me put this simply: Mixing styles in the same week builds flexible hands. Same shapes, different grooves. Keep the right hand boring and steady so the fretting... First win to aim at: One chorus 12-bar A7 world. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Reps with intention for day 57 — Hybrid Review — Blues + Pop Same Day. Start with: Play one full blues chorus with the form locked — fretting hand early, strum arm never freezes. Then: Play the pop chorus figure twice with clear accents. Change only as fast as both shapes still ring.",
    "jam": "Jam: stop drilling, start saying something. Day 57 jam on Hybrid Review — Blues + Pop Same Day — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 57. Session close. Win check: Play one solid blues chorus and one solid pop chorus back-to-back."
  },
  "58": {
    "arrive": "Day 58. Settle in — shoulders soft, phone down: Loop only the sticky change.",
    "warmup": "Day 58. Shake out, then touch today's material lightly. Light preview — Identify your stickiest two chords and loop only that change.",
    "teach": "Before we grind reps: Deliberate practice targets the bottleneck. Restarting from the intro wastes the reps that matter. Right hand stays boring and steady so... First win to aim at: Loop only the sticky change. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Practice loop time for day 58 — Transition Gym — Worst Two Bars Only. Start with: Identify your stickiest two chords and loop only that change. Then: Isolate the sticky bar for two focused minutes — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Music time — put the lesson inside something that grooves. Day 58 jam on Transition Gym — Worst Two Bars Only — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 58. Wind down: one gentle sound, then the win question. Win check: Show a sticky change that's cleaner after isolation than before."
  },
  "59": {
    "arrive": "Day 59. Two minutes to show up fully: Combine boom-chuck and full strums.",
    "warmup": "Day 59. No hero warm-up — just honest prep. Light preview — Play the verse boom-chuck pattern for 8 bars — fretting hand early, strum arm never freezes.",
    "teach": "Park the hands a second — idea first: Arrangement skills turn three chords into a performance. Texture changes read as ‘more pro’ than new chords. First win to aim at: Combine boom-chuck and full strums. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Guided block — your drills, my pacing for day 59 — Open-Chord Orchestra — Layer Dynamics + Strum. Start with: Play the verse boom-chuck pattern for 8 bars — fretting hand early, strum arm never freezes. Then: Play the chorus with a fuller D-DU strum pattern. Change only as fast as both shapes still ring.",
    "jam": "Loose on purpose — still in time. Day 59 jam on Open-Chord Orchestra — Layer Dynamics + Strum — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 59. Cool-down — soft hands, honest check. Win check: Play a 16-bar arrangement with two clear textures and a deliberate ending."
  },
  "60": {
    "arrive": "Day 60. Check posture, then lock the intention: Find the tempo where DM and D both ring clean.",
    "warmup": "Day 60. Gentle start, then today's shapes. Light preview — DM→D in half notes for 2 minutes — fretting hand early, strum arm never freezes.",
    "teach": "This is the bit that unlocks the rest: Speed is a side effect of clean reps. Half notes teach your hand the shape; quarters prove it stuck. First win to aim at: Find the tempo where DM and D both ring clean. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "This is the gym section for day 60 — Change Speed Ladder — Week 5 · Focus DM/D. Start with: DM→D in half notes for 2 minutes — fretting hand early, strum arm never freezes. Then: Quarters only when 9 of 10 changes ring clean — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "This is the part you came for. Day 60 jam on Change Speed Ladder — Week 5 · Focus DM/D — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 60. Leave the guitar friendlier than you found it. Win check: Hold DM→D changes at 60 BPM with every string ringing clean."
  },
  "61": {
    "arrive": "Day 61. You are here. That already counts. Intention next: Mute the strings and play the chord rhythm like a drum kit.",
    "warmup": "Day 61. We wake the specific muscles you will need. Light preview — Mute all strings, strum quarters for 30 seconds — fretting hand early, strum arm never freezes.",
    "teach": "Teacher hat on for a minute: The right hand is the engine. If it locks, the left hand can relax into the same pulse. Right hand stays boring and steady so the fretting... First win to aim at: Mute the strings and play the chord rhythm like a drum kit. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Hands-on stretch for day 61 — Groove First — Chords as Drums. Start with: Mute all strings, strum quarters for 30 seconds — fretting hand early, strum arm never freezes. Then: Add eighth-note strums, still muted — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Song-shaped minutes. Day 61 jam on Groove First — Chords as Drums — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 61. Soft landing. Win check: Play 30 seconds of muted groove where a listener would tap along, then add Em without slowing."
  },
  "62": {
    "arrive": "Day 62. Land in the chair. One breath. Here is today's aim: Guess the next chord before it lands.",
    "warmup": "Day 62. Easy blood-flow first. Light preview — Play a two-chord loop and guess the second one — fretting hand early, strum arm never freezes.",
    "teach": "One clear idea today: Ear training is prediction. When you guess right, your ear just wrote the harmony down. Right hand stays boring and steady so the fretting... First win to aim at: Guess the next chord before it lands. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Slow enough that form stays honest for day 62 — Ear Harmony — Guess the Next Chord 5 · Focus G/AM. Start with: Play a two-chord loop and guess the second one — fretting hand early, strum arm never freezes. Then: Close your eyes for the second pass — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Let the hands make a little story. Day 62 jam on Ear Harmony — Guess the Next Chord 5 · Focus G/AM — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 62. Ease out so tomorrow's hands forgive you. Win check: Predict the next chord in a two-chord loop five times in a row without looking."
  },
  "63": {
    "arrive": "Day 63. Arrive: tune if you can, then read the win out loud: Rate your fretting pressure out of ten.",
    "warmup": "Day 63. Warm the hands for what this day actually asks. Light preview — Fret a D chord, squeeze, then relax until it almost buzzes.",
    "teach": "Think of it like this: Pressure is habit, not requirement. The note only needs the string to touch the fret. Right hand stays boring and steady so the fretting... First win to aim at: Rate your fretting pressure out of ten. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "We will work the list in order for day 63 — Soft Hands Day — Tension Audit 5 · Focus D/E. Start with: Fret a D chord, squeeze, then relax until it almost buzzes. Then: Play 10 seconds at 8/10 pressure, then 10 at 5/10. Change only as fast as both shapes still ring.",
    "jam": "Fun pass: same skills, less judgment. Day 63 jam on Soft Hands Day — Tension Audit 5 · Focus D/E — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 63. Session close. Win check: Play a D chord for 30 seconds at your new 'enough' pressure with no buzzing."
  },
  "64": {
    "arrive": "Day 64. Settle in — shoulders soft, phone down: Fit simple chords under a melody you know.",
    "warmup": "Day 64. Shake out, then touch today's material lightly. Light preview — Hum the melody once and find its resting note — fretting hand early, strum arm never freezes.",
    "teach": "Here is the heart of it: Melody chooses the chords, not the other way around. Fit harmony underneath what you hum. Right hand stays boring and steady so the... First win to aim at: Fit simple chords under a melody you know. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Now we earn it with clean reps for day 64 — Song Transfer — Chords Into a PD Melody Day 5 · Focus EM/A. Start with: Hum the melody once and find its resting note — fretting hand early, strum arm never freezes. Then: Try Em under the first phrase, A under the second. Change only as fast as both shapes still ring.",
    "jam": "Play window — make it sound like a song fragment. Day 64 jam on Song Transfer — Chords Into a PD Melody Day 5 · Focus EM/A — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 64. Wind down: one gentle sound, then the win question. Win check: Play a melody you know over two chords and sing it in tune the whole way."
  },
  "65": {
    "arrive": "Day 65. Two minutes to show up fully: Run this week's chord set as one flowing loop.",
    "warmup": "Day 65. No hero warm-up — just honest prep. Light preview — Am–F loop, two beats per chord, 60 seconds — fretting hand early, strum arm never freezes.",
    "teach": "Let me put this simply: A checkpoint isn't a test; it's a photograph. You're comparing yourself to last week, not to anyone else. First win to aim at: Run this week's chord set as one flowing loop. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Reps with intention for day 65 — Weekly Chord Checkpoint 5 · Focus AM/F. Start with: Am–F loop, two beats per chord, 60 seconds — fretting hand early, strum arm never freezes. Then: Change with the smallest movement possible — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Jam: stop drilling, start saying something. Day 65 jam on Weekly Chord Checkpoint 5 · Focus AM/F — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 65. Cool-down — soft hands, honest check. Win check: Am–F loop for 60 seconds with smooth changes and one keepable take."
  },
  "66": {
    "arrive": "Day 66. Check posture, then lock the intention: Lift one finger to turn E into its sus color.",
    "warmup": "Day 66. Gentle start, then today's shapes. Light preview — Hold E, lift the first finger on & of 4 — fretting hand early, strum arm never freezes.",
    "teach": "Before we grind reps: A sus chord holds its root and fifth but floats the third — lift a finger and the song leans forward. First win to aim at: Lift one finger to turn E into its sus color. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Practice loop time for day 66 — Chord Color Week 6 — Suspension Taste · Focus E/BM. Start with: Hold E, lift the first finger on & of 4 — fretting hand early, strum arm never freezes. Then: Return to E on beat 1 of the next bar — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Music time — put the lesson inside something that grooves. Day 66 jam on Chord Color Week 6 — Suspension Taste · Focus E/BM — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 66. Leave the guitar friendlier than you found it. Win check: Create three sus-and-resolve moments inside a steady E-to-Bm loop."
  },
  "67": {
    "arrive": "Day 67. You are here. That already counts. Intention next: Land A and C7 without hunting for the frets.",
    "warmup": "Day 67. We wake the specific muscles you will need. Light preview — A→C7 in half notes for 2 minutes — fretting hand early, strum arm never freezes.",
    "teach": "Park the hands a second — idea first: C7 tucks the third finger in close. Lift everything together — the shape arrives as a block. Right hand stays boring and steady so the... First win to aim at: Land A and C7 without hunting for the frets. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Guided block — your drills, my pacing for day 67 — Change Speed Ladder — Week 6 · Focus A/C7. Start with: A→C7 in half notes for 2 minutes — fretting hand early, strum arm never freezes. Then: Same change in quarters at 60 BPM — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Loose on purpose — still in time. Day 67 jam on Change Speed Ladder — Week 6 · Focus A/C7 — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 67. Soft landing. Win check: Play A→C7 clean at 60 BPM for 16 bars without a muted string."
  },
  "68": {
    "arrive": "Day 68. Land in the chair. One breath. Here is today's aim: Turn G7 into a rhythm groove that doesn't need the notes to sound good.",
    "warmup": "Day 68. Easy blood-flow first. Light preview — Muted G7 rhythm, quarters then eighths — fretting hand early, strum arm never freezes.",
    "teach": "This is the bit that unlocks the rest: A groove lives in the right hand. Change chords underneath and the pattern can stay exactly the same. First win to aim at: Turn G7 into a rhythm groove that doesn't need the notes to sound good. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "This is the gym section for day 68 — Groove First — Chords as Drums (2). Start with: Muted G7 rhythm, quarters then eighths — fretting hand early, strum arm never freezes. Then: Switch to C7 mid-pattern, same right hand — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "This is the part you came for. Day 68 jam on Groove First — Chords as Drums (2) — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 68. Ease out so tomorrow's hands forgive you. Win check: Switch between G7 and C7 every two bars for 60 seconds without the groove wobbling."
  },
  "69": {
    "arrive": "Day 69. Arrive: tune if you can, then read the win out loud: Guess a three-chord progression before it lands.",
    "warmup": "Day 69. Warm the hands for what this day actually asks. Light preview — Bm to D7 loop, guess the second chord — fretting hand early, strum arm never freezes.",
    "teach": "Teacher hat on for a minute: Three-chord songs usually follow the same map. Your ear learns the exits before your brain does. Right hand stays boring and steady so the... First win to aim at: Guess a three-chord progression before it lands. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Hands-on stretch for day 69 — Ear Harmony — Guess the Next Chord 6 · Focus BM/D7. Start with: Bm to D7 loop, guess the second chord — fretting hand early, strum arm never freezes. Then: Add a third chord and guess the full path — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Song-shaped minutes. Day 69 jam on Ear Harmony — Guess the Next Chord 6 · Focus BM/D7 — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 69. Session close. Win check: Correctly predict a three-chord loop's path three times in a row."
  },
  "70": {
    "arrive": "Day 70. Settle in — shoulders soft, phone down: Notice where tension hides in your body.",
    "warmup": "Day 70. Shake out, then touch today's material lightly. Light preview — Play A7 while checking your jaw and shoulders — fretting hand early, strum arm never freezes.",
    "teach": "One clear idea today: Tension migrates: hand, shoulder, jaw, breath. Softening any of them helps all of them. Right hand stays boring and steady so the fretting... First win to aim at: Notice where tension hides in your body. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Slow enough that form stays honest for day 70 — Soft Hands Day — Tension Audit 6 · Focus C7/A7. Start with: Play A7 while checking your jaw and shoulders — fretting hand early, strum arm never freezes. Then: Exhale on beat 1 for 8 bars so the downbeat stays soft and steady. Change only as fast as both shapes still ring.",
    "jam": "Let the hands make a little story. Day 70 jam on Soft Hands Day — Tension Audit 6 · Focus C7/A7 — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 70. Wind down: one gentle sound, then the win question. Win check: Play A7 for 30 seconds with a relaxed jaw, shoulder, and thumb — and hear the tone open up."
  },
  "71": {
    "arrive": "Day 71. Two minutes to show up fully: Use G7 and E7 to pull the melody home.",
    "warmup": "Day 71. No hero warm-up — just honest prep. Light preview — Find the melody's last note and put G7 before it.",
    "teach": "Think of it like this: Seventh chords want to resolve. Placing them at phrase ends gives the melody a push home. Right hand stays boring and steady so the... First win to aim at: Use G7 and E7 to pull the melody home. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "We will work the list in order for day 71 — Song Transfer — Chords Into a PD Melody Day 6 · Focus G7/E7. Start with: Find the melody's last note and put G7 before it. Then: Swap in E7 for color on a repeat — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Fun pass: same skills, less judgment. Day 71 jam on Song Transfer — Chords Into a PD Melody Day 6 · Focus G7/E7 — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 71. Cool-down — soft hands, honest check. Win check: Arranged a known melody with G7 and E7 landing on phrase ends — and it sounds finished."
  },
  "72": {
    "arrive": "Day 72. Check posture, then lock the intention: Checkpoint the week's chord changes at a steady pulse.",
    "warmup": "Day 72. Gentle start, then today's shapes. Light preview — D7–Dm loop, slow and even — hear the color flip each bar.",
    "teach": "Here is the heart of it: One sticky change fixed is a full week's win. Slow it, loop it, then put it back in the song. Right hand stays boring and steady so the... First win to aim at: Checkpoint the week's chord changes at a steady pulse. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Now we earn it with clean reps for day 72 — Weekly Chord Checkpoint 6 · Focus D7/DM. Start with: D7–Dm loop, slow and even — hear the color flip each bar. Then: Isolate the hardest change and loop it 20 times — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Play window — make it sound like a song fragment. Day 72 jam on Weekly Chord Checkpoint 6 · Focus D7/DM — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 72. Leave the guitar friendlier than you found it. Win check: D7–Dm clean at 60 BPM for 60 seconds, plus a recorded before/after pair."
  },
  "73": {
    "arrive": "Day 73. You are here. That already counts. Intention next: Turn A7 into a quick sus and back without stopping.",
    "warmup": "Day 73. We wake the specific muscles you will need. Light preview — A7 shape, lift the third finger on & of 4 — fretting hand early, strum arm never freezes.",
    "teach": "Let me put this simply: A7's sus hangs the third out of reach — when it lands back on beat 1, that pull is the whole trick. Right hand stays boring and steady so... First win to aim at: Turn A7 into a quick sus and back without stopping. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Reps with intention for day 73 — Chord Color Week 7 — Suspension Taste · Focus A7/C. Start with: A7 shape, lift the third finger on & of 4 — fretting hand early, strum arm never freezes. Then: Land the full A7 on beat 1 after the setup — no late fingers. Change only as fast as both shapes still ring.",
    "jam": "Jam: stop drilling, start saying something. Day 73 jam on Chord Color Week 7 — Suspension Taste · Focus A7/C — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 73. Soft landing. Win check: Four bars of A7 sus-resolve that make a listener lean in, at a steady tempo."
  },
  "74": {
    "arrive": "Day 74. Land in the chair. One breath. Here is today's aim: Shape E7 and G from memory without peeking.",
    "warmup": "Day 74. Easy blood-flow first. Light preview — E7→G in half notes for 2 minutes — fretting hand early, strum arm never freezes.",
    "teach": "Before we grind reps: E7 and G share the same low root — anchor that finger and the whole change gets shorter. Right hand stays boring and steady so the fretting... First win to aim at: Shape E7 and G from memory without peeking. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Practice loop time for day 74 — Change Speed Ladder — Week 7 · Focus E7/G. Start with: E7→G in half notes for 2 minutes — fretting hand early, strum arm never freezes. Then: Quarters at 60 BPM, thumb behind the neck — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Music time — put the lesson inside something that grooves. Day 74 jam on Change Speed Ladder — Week 7 · Focus E7/G — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 74. Ease out so tomorrow's hands forgive you. Win check: Swap E7 and G eight times clean in a row at 60 BPM."
  },
  "75": {
    "arrive": "Day 75. Arrive: tune if you can, then read the win out loud: Play the chord groove with real notes, not just mutes.",
    "warmup": "Day 75. Warm the hands for what this day actually asks. Light preview — Dm groove, downstrokes only, 30 seconds — fretting hand early, strum arm never freezes.",
    "teach": "Park the hands a second — idea first: Once a groove is in your body, the notes are decoration. The pocket is the song. Right hand stays boring and steady so the fretting hand... First win to aim at: Play the chord groove with real notes, not just mutes. Build the shape slow; ring strings one at a time before you strum.",
    "guided": "Guided block — your drills, my pacing for day 75 — Groove First — Chords as Drums (3). Start with: Dm groove, downstrokes only, 30 seconds — fretting hand early, strum arm never freezes. Then: Down-up eighths with the same chord — string-audit once if anything thuds. Change only as fast as both shapes still ring.",
    "jam": "Loose on purpose — still in time. Day 75 jam on Groove First — Chords as Drums (3) — Campfire loop — miss a change, keep the strum arm moving.",
    "cooldown": "Day 75. Session close. Win check: Play a Dm groove for 60 seconds that keeps its bounce even when you change patterns."
  },
  "76": {
    "arrive": "Day 76. Settle in — shoulders soft, phone down: Walk minor pentatonic box 1 with even tone.",
    "warmup": "Day 76. Shake out, then touch today's material lightly. Light preview — Play the focus shape once ascending while naming the root each time you hit it.",
    "teach": "This is the bit that unlocks the rest: Scales are maps, not homework. Start with minor pentatonic for lead color, then touch the major scale so you hear the brighter twin. One... First win to aim at: Walk minor pentatonic box 1 with even tone. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "This is the gym section for day 76 — Scales Phase Open — Maps for Music. Start with: Play the focus shape once ascending while naming the root each time you hit it. Then: Eighth notes at a tempo where tone stays even — stop if you rush the click. Pulse under every run; naked notes without time do not count today.",
    "jam": "This is the part you came for. Day 76 jam on Scales Phase Open — Maps for Music — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 76. Wind down: one gentle sound, then the win question. Win check: Improvise 60 seconds in box 1 that still sounds like sentences, not a drill."
  },
  "77": {
    "arrive": "Day 77. Two minutes to show up fully: Even volume ascending and descending.",
    "warmup": "Day 77. No hero warm-up — just honest prep. Light preview — Box shape with the metronome — one position, no racing the click.",
    "teach": "Teacher hat on for a minute: Evenness > speed. Recording yourself exposes hidden accents that fight the groove. Put a pulse under the shape — maps become music when... First win to aim at: Even volume ascending and descending. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Hands-on stretch for day 77 — Minor Pent Box 1 Mastery — Even Tone. Start with: Box shape with the metronome — one position, no racing the click. Then: Accent only beat 1 roots; ghost everything else for one minute. Pulse under every run; naked notes without time do not count today.",
    "jam": "Song-shaped minutes. Day 77 jam on Minor Pent Box 1 Mastery — Even Tone — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 77. Cool-down — soft hands, honest check. Win check: Play two clean ascents/descents of box 1 with even tone at a steady click."
  },
  "78": {
    "arrive": "Day 78. Check posture, then lock the intention: Play notes in groups of 3.",
    "warmup": "Day 78. Gentle start, then today's shapes. Light preview — 123 234 345 pattern slow until each finger lands without a slap.",
    "teach": "One clear idea today: Sequences teach your hands common melodic ‘rhythms of pitch’ used in real solos. Put a pulse under the shape — maps become music when time... First win to aim at: Play notes in groups of 3. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Slow enough that form stays honest for day 78 — Box 1 Sequences — 3s and 4s. Start with: 123 234 345 pattern slow until each finger lands without a slap. Then: 1234 2345 finger pattern — even volume, no hammered leftovers. Pulse under every run; naked notes without time do not count today.",
    "jam": "Let the hands make a little story. Day 78 jam on Box 1 Sequences — 3s and 4s — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 78. Leave the guitar friendlier than you found it. Win check: Complete one full sequence pass in 3s and one in 4s without derailing time."
  },
  "79": {
    "arrive": "Day 79. You are here. That already counts. Intention next: Find the blue note in box 1.",
    "warmup": "Day 79. We wake the specific muscles you will need. Light preview — Spot every b5 location in the box before playing.",
    "teach": "Think of it like this: Blues scale = minor pent + b5. The spice note wants to resolve — tension and release in one finger. Put a pulse under the shape — maps... First win to aim at: Find the blue note in box 1. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "We will work the list in order for day 79 — Blues Scale — Add the Flat-5 Spice. Start with: Spot every b5 location in the box before playing. Then: Lick: chord tone → b5 → chord tone — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Fun pass: same skills, less judgment. Day 79 jam on Blues Scale — Add the Flat-5 Spice — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 79. Soft landing. Win check: Play a 4-bar lick that uses the blue note and resolves cleanly."
  },
  "80": {
    "arrive": "Day 80. Land in the chair. One breath. Here is today's aim: Play G major pentatonic shape.",
    "warmup": "Day 80. Easy blood-flow first. Light preview — G major pent up and down — name a target note before each run.",
    "teach": "Here is the heart of it: Relative major/minor pentatonics share notes; the home note decides the story. Put a pulse under the shape — maps become music when time is... First win to aim at: Play G major pentatonic shape. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Now we earn it with clean reps for day 80 — Major Pentatonic — Bright Twin. Start with: G major pent up and down — name a target note before each run. Then: Same notes resolving to E — hold the resolve long enough to mean it. Pulse under every run; naked notes without time do not count today.",
    "jam": "Play window — make it sound like a song fragment. Day 80 jam on Major Pentatonic — Bright Twin — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 80. Ease out so tomorrow's hands forgive you. Win check: Play a major-pent phrase that clearly cadences to the major root."
  },
  "81": {
    "arrive": "Day 81. Arrive: tune if you can, then read the win out loud: Move from box 1 toward box 2 area.",
    "warmup": "Day 81. Warm the hands for what this day actually asks. Light preview — Find hinge note between positions — land on the root every four bars.",
    "teach": "Let me put this simply: Pros connect positions. Hinge notes and slides beat teleporting up the neck. Put a pulse under the shape — maps become music when time is... First win to aim at: Move from box 1 toward box 2 area. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Reps with intention for day 81 — Connect Boxes — Horizontal Walk. Start with: Find hinge note between positions — land on the root every four bars. Then: Ascending journey 2 octaves if possible — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Jam: stop drilling, start saying something. Day 81 jam on Connect Boxes — Horizontal Walk — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 81. Session close. Win check: Travel between two neck areas using a deliberate hinge note twice."
  },
  "82": {
    "arrive": "Day 82. Settle in — shoulders soft, phone down: Mark root, b3, 5 inside minor pent.",
    "warmup": "Day 82. Shake out, then touch today's material lightly. Light preview — Pulse roots only on beats 1 and 3 for 8 bars — land on the root every four bars.",
    "teach": "Before we grind reps: Chord tones are gravity. Scale filler notes decorate; chord tones tell harmony where you're. Put a pulse under the shape — maps become... First win to aim at: Mark root, b3, 5 inside minor pent. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Practice loop time for day 82 — Chord Tones Inside the Box. Start with: Pulse roots only on beats 1 and 3 for 8 bars — land on the root every four bars. Then: Outline roots and fifths through the progression. Pulse under every run; naked notes without time do not count today.",
    "jam": "Music time — put the lesson inside something that grooves. Day 82 jam on Chord Tones Inside the Box — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 82. Wind down: one gentle sound, then the win question. Win check: Improvise 8 bars ending every phrase on a chord tone."
  },
  "83": {
    "arrive": "Day 83. Two minutes to show up fully: Play one-octave G major in position.",
    "warmup": "Day 83. No hero warm-up — just honest prep. Light preview — Play one octave of the scale slowly with even fingers.",
    "teach": "Park the hands a second — idea first: Major scale degrees explain why melodies feel finished (1,3,5) or yearn (2,4,6,7). Put a pulse under the shape — maps become music when... First win to aim at: Play one-octave G major in position. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Guided block — your drills, my pacing for day 83 — Major Scale — Seven-Note Map in G. Start with: Play one octave of the scale slowly with even fingers. Then: Say scale degrees on the way up — stop if the names fall behind the hands. Pulse under every run; naked notes without time do not count today.",
    "jam": "Loose on purpose — still in time. Day 83 jam on Major Scale — Seven-Note Map in G — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 83. Cool-down — soft hands, honest check. Win check: Play one clean G major octave and a 4-bar melody that rests on G."
  },
  "84": {
    "arrive": "Day 84. Check posture, then lock the intention: Play A natural minor one octave.",
    "warmup": "Day 84. Gentle start, then today's shapes. Light preview — Play A natural minor one octave slowly with even tone.",
    "teach": "This is the bit that unlocks the rest: Natural minor adds degrees pentatonics omit — more pathos, more stepwise melody options. Put a pulse under the shape — maps become music... First win to aim at: Play A natural minor one octave. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "This is the gym section for day 84 — Natural Minor — Aeolian Mood. Start with: Play A natural minor one octave slowly with even tone. Then: Remove notes down to pent and compare — which version sings more?. Pulse under every run; naked notes without time do not count today.",
    "jam": "This is the part you came for. Day 84 jam on Natural Minor — Aeolian Mood — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 84. Leave the guitar friendlier than you found it. Win check: Play A natural minor ascending/descending and one phrase that needs a non-pent note."
  },
  "85": {
    "arrive": "Day 85. You are here. That already counts. Intention next: Play D Dorian essence (minor + raised 6).",
    "warmup": "Day 85. We wake the specific muscles you will need. Light preview — Find the raised 6 relative to Dm and mark it with a finger tap.",
    "teach": "Teacher hat on for a minute: Dorian = natural minor with raised 6. Funk, Santana, modal jams — hopeful minor. Put a pulse under the shape — maps become music when time... First win to aim at: Play D Dorian essence (minor + raised 6). See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Hands-on stretch for day 85 — Dorian Color — Raised 6 Minor. Start with: Find the raised 6 relative to Dm and mark it with a finger tap. Then: Side-by-side natural vs dorian lick — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Song-shaped minutes. Day 85 jam on Dorian Color — Raised 6 Minor — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 85. Soft landing. Win check: Play a lick that clearly shows dorian’s raised 6 against a minor chord."
  },
  "86": {
    "arrive": "Day 86. Land in the chair. One breath. Here is today's aim: Find b7 in a mixolydian map.",
    "warmup": "Day 86. Easy blood-flow first. Light preview — Play G Mixolydian one octave ascending and down — land on the root every four bars.",
    "teach": "One clear idea today: Mixolydian is major with a flat 7 — the rock dominant sound. Find b7, sit on it, then resolve so it feels like a choice. Keep major nearby... First win to aim at: Find b7 in a mixolydian map. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Slow enough that form stays honest for day 86 — Mixolydian — Dominant Major. Start with: Play G Mixolydian one octave ascending and down — land on the root every four bars. Then: Target the flat-7 resolving into the root on purpose. Pulse under every run; naked notes without time do not count today.",
    "jam": "Let the hands make a little story. Day 86 jam on Mixolydian — Dominant Major — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 86. Ease out so tomorrow's hands forgive you. Win check: Improvise 8 bars in a mixolydian mood landing on G."
  },
  "87": {
    "arrive": "Day 87. Arrive: tune if you can, then read the win out loud: Find flat 2 above E or Am context.",
    "warmup": "Day 87. Warm the hands for what this day actually asks. Light preview — Play an E Phrygian fragment resolving to E or Am.",
    "teach": "Think of it like this: Phrygian’s b2 is cinematic/Spanish. A little goes far — tension wants resolution. Put a pulse under the shape — maps become music when time... First win to aim at: Find flat 2 above E or Am context. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "We will work the list in order for day 87 — Phrygian Hint — Flat 2 Drama. Start with: Play an E Phrygian fragment resolving to E or Am. Then: Practice b2 neighbor licks resolving to the root. Pulse under every run; naked notes without time do not count today.",
    "jam": "Fun pass: same skills, less judgment. Day 87 jam on Phrygian Hint — Flat 2 Drama — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 87. Session close. Win check: Play a short phrygian-flavored phrase that resolves cleanly."
  },
  "88": {
    "arrive": "Day 88. Settle in — shoulders soft, phone down: Find the raised 4 against a major root.",
    "warmup": "Day 88. Shake out, then touch today's material lightly. Light preview — In C or F position, play root → #4 → resolve to 3 — say the job of each note once.",
    "teach": "Here is the heart of it: Lydian is a major scale with a raised 4th (#4). That one note makes major sound open and filmic. Hold the #4 like a color, then resolve to... First win to aim at: Find the raised 4 against a major root. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Now we earn it with clean reps for day 88 — Lydian Dream — Raised 4 Color. Start with: In C or F position, play root → #4 → resolve to 3 — say the job of each note once. Then: Long tone on #4 for two beats, then resolve down, in time with a click. Pulse under every run; naked notes without time do not count today.",
    "jam": "Play window — make it sound like a song fragment. Day 88 jam on Lydian Dream — Raised 4 Color — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 88. Wind down: one gentle sound, then the win question. Win check: Play one short lydian phrase that shows the #4 and resolves cleanly to a chord tone."
  },
  "89": {
    "arrive": "Day 89. Two minutes to show up fully: Play a question phrase (rising).",
    "warmup": "Day 89. No hero warm-up — just honest prep. Light preview — Play a two-bar question phrase, then leave space.",
    "teach": "Let me put this simply: Conversation beats continuous notes. Rests are musical confidence — leave a bar of air and the next phrase lands harder. First win to aim at: Play a question phrase (rising). See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Reps with intention for day 89 — Pentatonic Call-and-Response. Start with: Play a two-bar question phrase, then leave space. Then: Rest one full bar, then re-enter cleanly on beat 1. Pulse under every run; naked notes without time do not count today.",
    "jam": "Jam: stop drilling, start saying something. Day 89 jam on Pentatonic Call-and-Response — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 89. Cool-down — soft hands, honest check. Win check: Play four clear call-response pairs with audible rests."
  },
  "90": {
    "arrive": "Day 90. Check posture, then lock the intention: Know chord tones for G C D.",
    "warmup": "Day 90. Gentle start, then today's shapes. Light preview — Roots only through the whole progression — fat and in time.",
    "teach": "Before we grind reps: The pro sound over changes is targeting, not denser scales. Hit the new chord’s third/root. Put a pulse under the shape — maps become music... First win to aim at: Know chord tones for G C D. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Practice loop time for day 90 — Targeting Triads — Solo Over G–C–D. Start with: Roots only through the whole progression — fat and in time. Then: Play roots and thirds only through the progression. Pulse under every run; naked notes without time do not count today.",
    "jam": "Music time — put the lesson inside something that grooves. Day 90 jam on Targeting Triads — Solo Over G–C–D — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 90. Leave the guitar friendlier than you found it. Win check: Solo one chorus of G–C–D hitting a chord tone on each chord’s downbeat."
  },
  "91": {
    "arrive": "Day 91. You are here. That already counts. Intention next: Practice skipping strings in-pattern.",
    "warmup": "Day 91. We wake the specific muscles you will need. Light preview — 3rd pattern through the pent box — stop if the sequence rushes the click.",
    "teach": "Park the hands a second — idea first: Intervals create melody contour. Stepwise is speech; leaps are exclamation points. Put a pulse under the shape — maps become music when... First win to aim at: Practice skipping strings in-pattern. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Guided block — your drills, my pacing for day 91 — Interval Jumps — 3rds and 4ths in the Box. Start with: 3rd pattern through the pent box — stop if the sequence rushes the click. Then: Practice fourth leaps carefully with a slow click. Pulse under every run; naked notes without time do not count today.",
    "jam": "Loose on purpose — still in time. Day 91 jam on Interval Jumps — 3rds and 4ths in the Box — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 91. Soft landing. Win check: Play a motif built from a leap, repeated with variation three times."
  },
  "92": {
    "arrive": "Day 92. Land in the chair. One breath. Here is today's aim: Play A harmonic minor fragment.",
    "warmup": "Day 92. Easy blood-flow first. Light preview — Build a short fragment around the leading tone, then resolve.",
    "teach": "This is the bit that unlocks the rest: Harmonic minor’s raised 7 creates a strong leading tone — drama engine for minor keys. Put a pulse under the shape — maps become music when... First win to aim at: Play A harmonic minor fragment. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "This is the gym section for day 92 — Harmonic Minor Tease — Leading Tone Bite. Start with: Build a short fragment around the leading tone, then resolve. Then: Resolve the line to A and hold a clean long tone. Pulse under every run; naked notes without time do not count today.",
    "jam": "This is the part you came for. Day 92 jam on Harmonic Minor Tease — Leading Tone Bite — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 92. Ease out so tomorrow's hands forgive you. Win check: Show the leading-tone pull into A minor clearly twice."
  },
  "93": {
    "arrive": "Day 93. Arrive: tune if you can, then read the win out loud: Choose frets 5–8 area.",
    "warmup": "Day 93. Warm the hands for what this day actually asks. Light preview — Map root locations for the CAGED form in use — land on the root every four bars.",
    "teach": "Teacher hat on for a minute: Caged positions teach the neck as neighborhoods. Constraints breed creativity. Put a pulse under the shape — maps become music when time is... First win to aim at: Choose frets 5–8 area. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Hands-on stretch for day 93 — Position Playing — Stay in a 5-Fret Cage. Start with: Map root locations for the CAGED form in use — land on the root every four bars. Then: Riff only inside the cage for two minutes — no runaway frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Song-shaped minutes. Day 93 jam on Position Playing — Stay in a 5-Fret Cage — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 93. Session close. Win check: Write/play an 8-bar riff that stays inside one 5-fret position."
  },
  "94": {
    "arrive": "Day 94. Settle in — shoulders soft, phone down: Pick any three neighboring notes.",
    "warmup": "Day 94. Shake out, then touch today's material lightly. Light preview — Choose three strong notes and improvise only with them.",
    "teach": "One clear idea today: Limitation is a creativity tool used by great teachers. Rhythm and silence outrank note count. Put a pulse under the shape — maps become... First win to aim at: Pick any three neighboring notes. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Slow enough that form stays honest for day 94 — Scale Detox — Three Notes Only Jam. Start with: Choose three strong notes and improvise only with them. Then: Groove the pattern for 8 bars without rushing — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Let the hands make a little story. Day 94 jam on Scale Detox — Three Notes Only Jam — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 94. Wind down: one gentle sound, then the win question. Win check: Jam three full minutes using only three pitches with intentional rhythm."
  },
  "95": {
    "arrive": "Day 95. Two minutes to show up fully: Plan call, develop, peak, land.",
    "warmup": "Day 95. No hero warm-up — just honest prep. Light preview — Sketch form on paper 1-2-3-4 sections — land on the root every four bars.",
    "teach": "Think of it like this: A solo is a story arc. Capstone days prove you can shape time, not only run shapes. Put a pulse under the shape — maps become music when... First win to aim at: Plan call, develop, peak, land. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "We will work the list in order for day 95 — Pent Story Draft — Call, Peak, Land. Start with: Sketch form on paper 1-2-3-4 sections — land on the root every four bars. Then: Play a full 16 bars without stopping to fix mistakes. Pulse under every run; naked notes without time do not count today.",
    "jam": "Fun pass: same skills, less judgment. Day 95 jam on Pent Story Draft — Call, Peak, Land — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 95. Cool-down — soft hands, honest check. Win check: Play a 16-bar pentatonic story with a clear beginning, peak, and landing."
  },
  "96": {
    "arrive": "Day 96. Check posture, then lock the intention: Play an 8-bar scale story that lands on the root.",
    "warmup": "Day 96. Gentle start, then today's shapes. Light preview — C major pentatonic, 8 bars, start and end on C — land on the root every four bars.",
    "teach": "Here is the heart of it: A scale is a menu, not a song. Checkpoints are where you cook with it — and the major scale is the kitchen. First win to aim at: Play an 8-bar scale story that lands on the root. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Now we earn it with clean reps for day 96 — Weekly Scales Checkpoint. Start with: C major pentatonic, 8 bars, start and end on C — land on the root every four bars. Then: Play only 3 notes per bar — rhythm does the work. Pulse under every run; naked notes without time do not count today.",
    "jam": "Play window — make it sound like a song fragment. Day 96 jam on Weekly Scales Checkpoint — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 96. Leave the guitar friendlier than you found it. Win check: An 8-bar C major pent story that resolves home and leaves space."
  },
  "97": {
    "arrive": "Day 97. You are here. That already counts. Intention next: Find the same root note on three different strings.",
    "warmup": "Day 97. We wake the specific muscles you will need. Light preview — Find D on the A, D, and G strings — land on the root every four bars.",
    "teach": "Let me put this simply: The neck repeats itself in patterns. One root note lives in dozens of places. Put a pulse under the shape — maps become music when time is... First win to aim at: Find the same root note on three different strings. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Reps with intention for day 97 — Neck Geography — Root Finder Drill. Start with: Find D on the A, D, and G strings — land on the root every four bars. Then: Play each one on beat 1 of a four-count — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Jam: stop drilling, start saying something. Day 97 jam on Neck Geography — Root Finder Drill — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 97. Soft landing. Win check: Find D on three strings without hunting, and connect two with steps."
  },
  "98": {
    "arrive": "Day 98. Land in the chair. One breath. Here is today's aim: Copy a 4-note motif exactly first.",
    "warmup": "Day 98. Easy blood-flow first. Light preview — Learn a 4-note library motif note-for-note — land on the root every four bars.",
    "teach": "Before we grind reps: Imitation is how every player builds vocabulary. Copy it, then give it your fingerprint. Put a pulse under the shape — maps become music... First win to aim at: Copy a 4-note motif exactly first. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Practice loop time for day 98 — Phrase Gym — Copy → Vary → Own. Start with: Learn a 4-note library motif note-for-note — land on the root every four bars. Then: Play the same idea with twice the rests — leave bigger holes. Pulse under every run; naked notes without time do not count today.",
    "jam": "Music time — put the lesson inside something that grooves. Day 98 jam on Phrase Gym — Copy → Vary → Own — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 98. Ease out so tomorrow's hands forgive you. Win check: Show the copied motif, a rhythm variant, and your own version in one take."
  },
  "99": {
    "arrive": "Day 99. Arrive: tune if you can, then read the win out loud: Play scale eighths locked to a click.",
    "warmup": "Day 99. Warm the hands for what this day actually asks. Light preview — Scale up and down in quarters first — land on the root every four bars.",
    "teach": "Park the hands a second — idea first: Subdivisions are where timing lives. Beat 1 keeps you close; eighths keep you honest. Put a pulse under the shape — maps become music when... First win to aim at: Play scale eighths locked to a click. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Guided block — your drills, my pacing for day 99 — Metronome Subdivision — Scale Eighths. Start with: Scale up and down in quarters first — land on the root every four bars. Then: Switch to eighths at the same tempo only if quarters were clean. Pulse under every run; naked notes without time do not count today.",
    "jam": "Loose on purpose — still in time. Day 99 jam on Metronome Subdivision — Scale Eighths — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 99. Session close. Win check: One octave of scale in steady eighths that a kind click test would pass."
  },
  "100": {
    "arrive": "Day 100. Settle in — shoulders soft, phone down: Play the same phrase in two different modes.",
    "warmup": "Day 100. Shake out, then touch today's material lightly. Light preview — Play a short phrase in the first mode — land on the root every four bars.",
    "teach": "This is the bit that unlocks the rest: Modes are moods with rules. Comparing two back to back teaches faster than reading about them. Put a pulse under the shape — maps become... First win to aim at: Play the same phrase in two different modes. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "This is the gym section for day 100 — Mode Mood Board — A/B Day. Start with: Play a short phrase in the first mode — land on the root every four bars. Then: Repeat it in the second mode, same notes — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "This is the part you came for. Day 100 jam on Mode Mood Board — A/B Day — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 100. Wind down: one gentle sound, then the win question. Win check: The same rhythm in two modal colors, with a name for each mood."
  },
  "101": {
    "arrive": "Day 101. Two minutes to show up fully: Find a cool bar inside your scale run.",
    "warmup": "Day 101. No hero warm-up — just honest prep. Light preview — Improvise over the vamp for 1 minute — land on the root every four bars.",
    "teach": "Teacher hat on for a minute: Riffs are frozen luck. Capture the accidental cool bar, give it a clear start and end, and you own a lick instead of a blur. First win to aim at: Find a cool bar inside your scale run. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Hands-on stretch for day 101 — Scale → Riff Extraction. Start with: Improvise over the vamp for 1 minute — land on the root every four bars. Then: Circle the one bar that felt like something — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Song-shaped minutes. Day 101 jam on Scale → Riff Extraction — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 101. Cool-down — soft hands, honest check. Win check: A 1- or 2-bar riff you can repeat from memory five times."
  },
  "102": {
    "arrive": "Day 102. Check posture, then lock the intention: Match long tones to chord tones over a Spanish E vamp.",
    "warmup": "Day 102. Gentle start, then today's shapes. Light preview — Loop the E phrygian vamp, hold the root E — land on the root every four bars.",
    "teach": "One clear idea today: Long notes must agree with the chord; passing notes may color. That one rule is most of applied theory. First win to aim at: Match long tones to chord tones over a Spanish E vamp. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Slow enough that form stays honest for day 102 — Chord-Scale Match Briefing. Start with: Loop the E phrygian vamp, hold the root E — land on the root every four bars. Then: Try b2 (F) as a long tone, feel the pull — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Let the hands make a little story. Day 102 jam on Chord-Scale Match Briefing — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 102. Leave the guitar friendlier than you found it. Win check: Hold three long tones over the E vamp that all sound intentional."
  },
  "103": {
    "arrive": "Day 103. You are here. That already counts. Intention next: Weave a chromatic approach note into the scale story.",
    "warmup": "Day 103. We wake the specific muscles you will need. Light preview — Add one chromatic neighbor before the root — land on the root every four bars.",
    "teach": "Think of it like this: Chromatic notes are seasoning — a half-step neighbor that slides the ear to the real note. Put a pulse under the shape — maps become music... First win to aim at: Weave a chromatic approach note into the scale story. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "We will work the list in order for day 103 — Weekly Scales Checkpoint (2). Start with: Add one chromatic neighbor before the root — land on the root every four bars. Then: Same 8-bar story, two approach notes max — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Fun pass: same skills, less judgment. Day 103 jam on Weekly Scales Checkpoint (2) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 103. Soft landing. Win check: 8-bar story with 2 chromatic approach notes that still resolves cleanly home."
  },
  "104": {
    "arrive": "Day 104. Land in the chair. One breath. Here is today's aim: Find roots on new strings and new frets.",
    "warmup": "Day 104. Easy blood-flow first. Light preview — Find C on the low E and the high E strings — land on the root every four bars.",
    "teach": "Here is the heart of it: Roots are landmarks. If you know where they are, every scale and chord has a home base. Put a pulse under the shape — maps become music... First win to aim at: Find roots on new strings and new frets. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Now we earn it with clean reps for day 104 — Neck Geography — Root Finder Drill (2). Start with: Find C on the low E and the high E strings — land on the root every four bars. Then: Play both C's on beat 1, in time — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Play window — make it sound like a song fragment. Day 104 jam on Neck Geography — Root Finder Drill (2) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 104. Ease out so tomorrow's hands forgive you. Win check: Locate C on both E strings and walk between them in time."
  },
  "105": {
    "arrive": "Day 105. Arrive: tune if you can, then read the win out loud: Start from the same motif, change the ending.",
    "warmup": "Day 105. Warm the hands for what this day actually asks. Light preview — Play the motif twice with the original ending — land on the root every four bars.",
    "teach": "Let me put this simply: A motif is a question. Changing the ending changes the answer while keeping the conversation. Put a pulse under the shape — maps become... First win to aim at: Start from the same motif, change the ending. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Reps with intention for day 105 — Phrase Gym — Copy → Vary → Own (2). Start with: Play the motif twice with the original ending — land on the root every four bars. Then: Replace the last note with a new one — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Jam: stop drilling, start saying something. Day 105 jam on Phrase Gym — Copy → Vary → Own (2) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 105. Session close. Win check: The motif with a changed ending that still feels finished."
  },
  "106": {
    "arrive": "Day 106. Settle in — shoulders soft, phone down: Keep eighths even while adding a passing tone.",
    "warmup": "Day 106. Shake out, then touch today's material lightly. Light preview — Scale eighths with one chromatic passing note — land on the root every four bars.",
    "teach": "Before we grind reps: Eighths are a train track. Adding scale notes does not change the rails — the click still owns the grid under every finger. First win to aim at: Keep eighths even while adding a passing tone. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Practice loop time for day 106 — Metronome Subdivision — Scale Eighths (2). Start with: Scale eighths with one chromatic passing note — land on the root every four bars. Then: Mark where you rushed — that's the fix spot — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Music time — put the lesson inside something that grooves. Day 106 jam on Metronome Subdivision — Scale Eighths (2) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 106. Wind down: one gentle sound, then the win question. Win check: Scale eighths with a passing tone, even and un-rushed, 20 seconds."
  },
  "107": {
    "arrive": "Day 107. Two minutes to show up fully: Map dorian and mixolydian roots in one area of the neck.",
    "warmup": "Day 107. No hero warm-up — just honest prep. Light preview — Map both dorian and mixolydian shapes in one position — roots first.",
    "teach": "Park the hands a second — idea first: Changing mode mid-loop is like changing the light in a room. Keep dorian and mixolydian in the same position, switch on the root, and... First win to aim at: Map dorian and mixolydian roots in one area of the neck. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Guided block — your drills, my pacing for day 107 — Mode Mood Board — Switch on the Root. Start with: Map both dorian and mixolydian shapes in one position — roots first. Then: Loop a simple vamp; switch mode after 4 bars on the root. Pulse under every run; naked notes without time do not count today.",
    "jam": "Loose on purpose — still in time. Day 107 jam on Mode Mood Board — Switch on the Root — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 107. Cool-down — soft hands, honest check. Win check: Switch modes mid-loop on the root without losing the pulse for eight bars."
  },
  "108": {
    "arrive": "Day 108. Check posture, then lock the intention: Extract a riff and give it an ending.",
    "warmup": "Day 108. Gentle start, then today's shapes. Light preview — Loop your existing riff four times before you change a note.",
    "teach": "This is the bit that unlocks the rest: A riff without an ending is a loop; a riff with an ending is a statement. Practice the last note like it matters. First win to aim at: Extract a riff and give it an ending. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "This is the gym section for day 108 — Scale → Riff Extraction (2). Start with: Loop your existing riff four times before you change a note. Then: Add a one-note ending that leads back in — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "This is the part you came for. Day 108 jam on Scale → Riff Extraction (2) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 108. Leave the guitar friendlier than you found it. Win check: A riff with a repeatable ending, played through twice."
  },
  "109": {
    "arrive": "Day 109. You are here. That already counts. Intention next: Hold long tones that agree over a funk vamp.",
    "warmup": "Day 109. We wake the specific muscles you will need. Light preview — Loop the funk vamp, play the root on beat 1 only.",
    "teach": "Teacher hat on for a minute: Funk lives in the short notes between strong ones. Chord tones anchor, chromatics decorate. Put a pulse under the shape — maps become music... First win to aim at: Hold long tones that agree over a funk vamp. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Hands-on stretch for day 109 — Chord-Scale Match Briefing (2). Start with: Loop the funk vamp, play the root on beat 1 only. Then: Add a chromatic approach note before the root — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Song-shaped minutes. Day 109 jam on Chord-Scale Match Briefing (2) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 109. Soft landing. Win check: Three long chord tones over the funk vamp, each resolving a chromatic approach."
  },
  "110": {
    "arrive": "Day 110. Land in the chair. One breath. Here is today's aim: Swap the story's color from major to minor pentatonic.",
    "warmup": "Day 110. Easy blood-flow first. Light preview — A minor pentatonic box for 8 bars — simple, in time, breathing.",
    "teach": "One clear idea today: Same shapes, different mood. Minor pentatonic turns the same journey into a different weather. Put a pulse under the shape — maps become... First win to aim at: Swap the story's color from major to minor pentatonic. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Slow enough that form stays honest for day 110 — Weekly Scales Checkpoint (3). Start with: A minor pentatonic box for 8 bars — simple, in time, breathing. Then: Start and end on A this time so the ear hears home base. Pulse under every run; naked notes without time do not count today.",
    "jam": "Let the hands make a little story. Day 110 jam on Weekly Scales Checkpoint (3) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 110. Ease out so tomorrow's hands forgive you. Win check: 8-bar A minor pent story with a clear mood shift from last week's major."
  },
  "111": {
    "arrive": "Day 111. Arrive: tune if you can, then read the win out loud: Use natural harmonics as pitch landmarks.",
    "warmup": "Day 111. Warm the hands for what this day actually asks. Light preview — Find the 12th-fret harmonic on each string — land on the root every four bars.",
    "teach": "Think of it like this: Harmonics are pure pitch beacons. They tell you exactly where a note lives without fretting. Put a pulse under the shape — maps become... First win to aim at: Use natural harmonics as pitch landmarks. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "We will work the list in order for day 111 — Neck Geography — Root Finder Drill (3). Start with: Find the 12th-fret harmonic on each string — land on the root every four bars. Then: Fret the same note and compare the pitch — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Fun pass: same skills, less judgment. Day 111 jam on Neck Geography — Root Finder Drill (3) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 111. Session close. Win check: Match a fretted E to its harmonic and locate it on two strings."
  },
  "112": {
    "arrive": "Day 112. Settle in — shoulders soft, phone down: Vary the rhythm of a motif you already own.",
    "warmup": "Day 112. Shake out, then touch today's material lightly. Light preview — Take your owned motif, play it as straight eighths.",
    "teach": "Here is the heart of it: Rhythm is the fastest way to make an old idea sound new. Same notes, new heartbeat. Put a pulse under the shape — maps become music when... First win to aim at: Vary the rhythm of a motif you already own. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Now we earn it with clean reps for day 112 — Phrase Gym — Copy → Vary → Own (3). Start with: Take your owned motif, play it as straight eighths. Then: Then dotted rhythm, then with a rest in the middle. Pulse under every run; naked notes without time do not count today.",
    "jam": "Play window — make it sound like a song fragment. Day 112 jam on Phrase Gym — Copy → Vary → Own (3) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 112. Wind down: one gentle sound, then the win question. Win check: The same motif in three rhythms, in time, with one you'd keep."
  },
  "113": {
    "arrive": "Day 113. Two minutes to show up fully: Play scale eighths across two octaves in time.",
    "warmup": "Day 113. No hero warm-up — just honest prep. Light preview — Two-octave scale in quarters, hands warm — land on the root every four bars.",
    "teach": "Let me put this simply: Two octaves doubles the distance but not the tempo. The click stays the same — you just travel further. First win to aim at: Play scale eighths across two octaves in time. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Reps with intention for day 113 — Metronome Subdivision — Scale Eighths (3). Start with: Two-octave scale in quarters, hands warm — land on the root every four bars. Then: Eighths, focusing on the shift note — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Jam: stop drilling, start saying something. Day 113 jam on Metronome Subdivision — Scale Eighths (3) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 113. Cool-down — soft hands, honest check. Win check: Two-octave scale in even eighths, clean shift, landing on the click."
  },
  "114": {
    "arrive": "Day 114. Check posture, then lock the intention: Place one clear #4 color tone.",
    "warmup": "Day 114. Gentle start, then today's shapes. Light preview — Loop a short mixolydian vamp and sit in it for a minute.",
    "teach": "Before we grind reps: Lydian’s raised 4 is a spice, not a whole meal. Use it once per phrase against a major backdrop, then resolve so listeners feel the dream... First win to aim at: Place one clear #4 color tone. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Practice loop time for day 114 — Mode Mood Board — A/B Day (3). Start with: Loop a short mixolydian vamp and sit in it for a minute. Then: Start the phrase in mode A, resolve in mode B — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Music time — put the lesson inside something that grooves. Day 114 jam on Mode Mood Board — A/B Day (3) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 114. Leave the guitar friendlier than you found it. Win check: A single phrase that starts in one mode and resolves in another, deliberately."
  },
  "115": {
    "arrive": "Day 115. You are here. That already counts. Intention next: Use a bass-walk feel inside the riff.",
    "warmup": "Day 115. We wake the specific muscles you will need. Light preview — Take your riff and play only its bass notes — land on the root every four bars.",
    "teach": "Park the hands a second — idea first: Bass motion under a riff makes it move without adding notes on top. One walking note between repeats can feel like a whole arrangement. First win to aim at: Use a bass-walk feel inside the riff. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Guided block — your drills, my pacing for day 115 — Scale → Riff Extraction (3). Start with: Take your riff and play only its bass notes — land on the root every four bars. Then: Add a stepwise walk between them — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Loose on purpose — still in time. Day 115 jam on Scale → Riff Extraction (3) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 115. Soft landing. Win check: A riff with a stepwise bass walk that still grooves."
  },
  "116": {
    "arrive": "Day 116. Land in the chair. One breath. Here is today's aim: Play long tones that agree over a palm-mute chug.",
    "warmup": "Day 116. Easy blood-flow first. Light preview — Chug the riff loop, hold the root across 4 beats.",
    "teach": "This is the bit that unlocks the rest: Riffs and long tones are partners. The chug holds time; your notes tell the story over it. Put a pulse under the shape — maps become music... First win to aim at: Play long tones that agree over a palm-mute chug. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "This is the gym section for day 116 — Chord-Scale Match Briefing (3). Start with: Chug the riff loop, hold the root across 4 beats. Then: Then hold the fifth, feel it lift — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "This is the part you came for. Day 116 jam on Chord-Scale Match Briefing (3) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 116. Ease out so tomorrow's hands forgive you. Win check: Two long tones over the chug riff that both land on chord tones."
  },
  "117": {
    "arrive": "Day 117. Arrive: tune if you can, then read the win out loud: Move the story across two positions on the neck.",
    "warmup": "Day 117. Warm the hands for what this day actually asks. Light preview — Play the story in box 1, then repeat in box 2 — land on the root every four bars.",
    "teach": "Teacher hat on for a minute: Position shifts are just walking to a new room. The melody should feel continuous, not relocated. Put a pulse under the shape — maps become... First win to aim at: Move the story across two positions on the neck. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Hands-on stretch for day 117 — Weekly Scales Checkpoint (4). Start with: Play the story in box 1, then repeat in box 2 — land on the root every four bars. Then: Shift during a rest so the move is clean — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Song-shaped minutes. Day 117 jam on Weekly Scales Checkpoint (4) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 117. Session close. Win check: The same 8-bar story played across two positions with a seamless shift."
  },
  "118": {
    "arrive": "Day 118. Settle in — shoulders soft, phone down: Find roots across the whole neck in under 10 seconds.",
    "warmup": "Day 118. Shake out, then touch today's material lightly. Light preview — Call out the root's string/fret before you play it.",
    "teach": "One clear idea today: The fastest solos are just root-to-root flights. Know the landmarks and you're never lost. Put a pulse under the shape — maps become music... First win to aim at: Find roots across the whole neck in under 10 seconds. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Slow enough that form stays honest for day 118 — Neck Geography — Root Finder Drill (4). Start with: Call out the root's string/fret before you play it. Then: Find G on five strings in 30 seconds — even tone matters more than covering frets. Pulse under every run; naked notes without time do not count today.",
    "jam": "Let the hands make a little story. Day 118 jam on Neck Geography — Root Finder Drill (4) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 118. Wind down: one gentle sound, then the win question. Win check: Locate G on five strings in 30 seconds and land a phrase on it."
  },
  "119": {
    "arrive": "Day 119. Two minutes to show up fully: Compress and expand the motif across bars.",
    "warmup": "Day 119. No hero warm-up — just honest prep. Light preview — Play the motif twice as fast over two bars — land on the root every four bars.",
    "teach": "Think of it like this: Motifs grow by being stretched and squeezed. Space is part of the sentence. Put a pulse under the shape — maps become music when time is... First win to aim at: Compress and expand the motif across bars. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "We will work the list in order for day 119 — Phrase Gym — Copy → Vary → Own (4). Start with: Play the motif twice as fast over two bars — land on the root every four bars. Then: Then stretch the same idea across four bars with more air. Pulse under every run; naked notes without time do not count today.",
    "jam": "Fun pass: same skills, less judgment. Day 119 jam on Phrase Gym — Copy → Vary → Own (4) — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 119. Cool-down — soft hands, honest check. Win check: A compressed motif, an expanded motif, and a call-and-answer finish."
  },
  "120": {
    "arrive": "Day 120. Check posture, then lock the intention: Tell a 16-bar story with one pentatonic box.",
    "warmup": "Day 120. Gentle start, then today's shapes. Light preview — Map Em or Am pentatonic box 1 and mark a low start and a higher peak note.",
    "teach": "Here is the heart of it: A capstone is a song you invent, not a quiz. Sixteen bars, one box, a beginning and an end. Space and rhythm tell the story — note count... First win to aim at: Tell a 16-bar story with one pentatonic box. See the shape on the neck, then play it like a phrase — not a barcode.",
    "guided": "Now we earn it with clean reps for day 120 — Scales Capstone — 16-Bar Pent Story. Start with: Map Em or Am pentatonic box 1 and mark a low start and a higher peak note. Then: Improvise a 4-bar phrase, rest, then a different 4-bar answer. Pulse under every run; naked notes without time do not count today.",
    "jam": "Play window — make it sound like a song fragment. Day 120 jam on Scales Capstone — 16-Bar Pent Story — Three-to-five notes max for a minute; rhythm does the talking.",
    "cooldown": "Day 120. Leave the guitar friendlier than you found it. Win check: Play a 16-bar pentatonic story with space, a small peak, and a root landing."
  },
  "121": {
    "arrive": "Day 121. You are here. That already counts. Intention next: Lock a foot pulse before fancy patterns.",
    "warmup": "Day 121. We wake the specific muscles you will need. Light preview — Foot-only quarters for 45 seconds — no guitar — foot stays on quarters the whole time.",
    "teach": "Let me put this simply: Pocket is the skill under every cool chord. Today the fretting hand stays on familiar G, C, and D while the right hand owns the groove. If... First win to aim at: Lock a foot pulse before fancy patterns. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Reps with intention for day 121 — Rhythm Phase Open — Pocket Is the Skill. Start with: Foot-only quarters for 45 seconds — no guitar — foot stays on quarters the whole time. Then: Muted open-string eighths with the foot locked; restart if the foot rushes. Mark the bar where you rush — that is the real drill.",
    "jam": "Jam: stop drilling, start saying something. Day 121 jam on Rhythm Phase Open — Pocket Is the Skill — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 121. Soft landing. Win check: Two minutes where your foot never stops and most strums agree with the pulse."
  },
  "122": {
    "arrive": "Day 122. Land in the chair. One breath. Here is today's aim: Speak and play the grid 1 e & a without dropping syllables.",
    "warmup": "Day 122. Easy blood-flow first. Light preview — Count 1 e & a aloud with foot quarters for 45 seconds.",
    "teach": "Before we grind reps: Subdivision is how musicians share a clock. Naming 1 e & a externalizes the grid so fretting-hand panic can't steal the beat. First win to aim at: Speak and play the grid 1 e & a without dropping syllables. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Practice loop time for day 122 — Subdivision Clinic — 1 e & a. Start with: Count 1 e & a aloud with foot quarters for 45 seconds. Then: Muted 16th strums (or ghost strums) matching every syllable for 60 seconds. Mark the bar where you rush — that is the real drill.",
    "jam": "Music time — put the lesson inside something that grooves. Day 122 jam on Subdivision Clinic — 1 e & a — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 122. Ease out so tomorrow's hands forgive you. Win check: Play 16 bars where you can point to any 1 e & a slot and land a muted click there on command."
  },
  "123": {
    "arrive": "Day 123. Arrive: tune if you can, then read the win out loud: Accent offbeats on purpose instead of by accident.",
    "warmup": "Day 123. Warm the hands for what this day actually asks. Light preview — Foot on quarters; hand accents only on & of each beat for 60 seconds muted.",
    "teach": "Park the hands a second — idea first: Syncopation is tension against a known downbeat. If the body loses beat 1, accents become sloppy noise — keep the foot honest. First win to aim at: Accent offbeats on purpose instead of by accident. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Guided block — your drills, my pacing for day 123 — Syncopation Intro — Accent the Offbeat. Start with: Foot on quarters; hand accents only on & of each beat for 60 seconds muted. Then: Accent map: circle beats 2 and the & of 4 on paper, then play it. Mark the bar where you rush — that is the real drill.",
    "jam": "Loose on purpose — still in time. Day 123 jam on Syncopation Intro — Accent the Offbeat — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 123. Session close. Win check: Play your 4-bar accent map twice in a row with steady foot quarters and clear offbeat pops."
  },
  "124": {
    "arrive": "Day 124. Settle in — shoulders soft, phone down: Toggle straight eighths vs long-short shuffle on command.",
    "warmup": "Day 124. Shake out, then touch today's material lightly. Light preview — Muted straight eighths 30s, then shuffle eighths 30s, back and forth 4 times.",
    "teach": "This is the bit that unlocks the rest: Shuffle is a triplet-based long-short feel, not 'sloppy straight.' The swing ratio should stay stable across the form. First win to aim at: Toggle straight eighths vs long-short shuffle on command. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "This is the gym section for day 124 — Shuffle vs Straight — Feel Toggle. Start with: Muted straight eighths 30s, then shuffle eighths 30s, back and forth 4 times. Then: Say long-short while playing shuffle on open strings. Mark the bar where you rush — that is the real drill.",
    "jam": "This is the part you came for. Day 124 jam on Shuffle vs Straight — Feel Toggle — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 124. Wind down: one gentle sound, then the win question. Win check: Play one 12-bar chorus straight and one shuffled at the same BPM without drifting the pulse."
  },
  "125": {
    "arrive": "Day 125. Two minutes to show up fully: Park the palm so chugs are tight without killing pitch entirely.",
    "warmup": "Day 125. No hero warm-up — just honest prep. Light preview — Find the mute sweet spot on open low E: tight thunk, still pitched.",
    "teach": "Teacher hat on for a minute: Palm mute is a dynamic and articulation tool. Edge-of-palm near the bridge shortens sustain; too far forward kills tone. First win to aim at: Park the palm so chugs are tight without killing pitch entirely. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Hands-on stretch for day 125 — Palm Mute Engine — Chug Control. Start with: Find the mute sweet spot on open low E: tight thunk, still pitched. Then: Chug quarters 60s, then add release hits on beat 3 only. Mark the bar where you rush — that is the real drill.",
    "jam": "Song-shaped minutes. Day 125 jam on Palm Mute Engine — Chug Control — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 125. Cool-down — soft hands, honest check. Win check: Play 16 bars alternating muted chug and open hits without tempo drift or left-hand squeeze."
  },
  "126": {
    "arrive": "Day 126. Check posture, then lock the intention: Treat silence as a rhythmic event you can aim.",
    "warmup": "Day 126. Gentle start, then today's shapes. Light preview — Play beat 1 only; rest 2–3–4 — 8 bars muted clicks on 1.",
    "teach": "One clear idea today: Rests are notes with zero amplitude. Great rhythm players schedule silence; beginners fill every beat from anxiety. First win to aim at: Treat silence as a rhythmic event you can aim. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Slow enough that form stays honest for day 126 — Rest as a Weapon — Play Less. Start with: Play beat 1 only; rest 2–3–4 — 8 bars muted clicks on 1. Then: Play 1 and 3; rest 2 and 4 — keep foot on all quarters. Mark the bar where you rush — that is the real drill.",
    "jam": "Let the hands make a little story. Day 126 jam on Rest as a Weapon — Play Less — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 126. Leave the guitar friendlier than you found it. Win check: Play an 8-bar hit chart that includes deliberate multi-beat rests without rushing the re-entries."
  },
  "127": {
    "arrive": "Day 127. You are here. That already counts. Intention next: Compose a strum chart with written accents.",
    "warmup": "Day 127. We wake the specific muscles you will need. Light preview — Write accents on a blank 4-bar grid (at least 6 accent marks).",
    "teach": "Think of it like this: Accent is relative. If everything is loud, nothing is accented. Dynamic contrast is a timing skill as much as a volume skill. First win to aim at: Compose a strum chart with written accents. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "We will work the list in order for day 127 — Accent Maps — Compose a Strum Chart. Start with: Write accents on a blank 4-bar grid (at least 6 accent marks). Then: Muted performance of the chart at 75 BPM — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Fun pass: same skills, less judgment. Day 127 jam on Accent Maps — Compose a Strum Chart — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 127. Soft landing. Win check: Hand a stranger (or future you) your chart and Play it so the written accents are obvious."
  },
  "128": {
    "arrive": "Day 128. Land in the chair. One breath. Here is today's aim: Speak 1-trip-let evenly against foot quarters.",
    "warmup": "Day 128. Easy blood-flow first. Light preview — Foot quarters + voice 1-trip-let for 45 seconds — foot stays on quarters the whole time.",
    "teach": "Here is the heart of it: Triplets divide the beat into three equal parts. Even speech first — uneven speech becomes uneven hands. First win to aim at: Speak 1-trip-let evenly against foot quarters. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Now we earn it with clean reps for day 128 — Triplet Feel — 1 trip-let. Start with: Foot quarters + voice 1-trip-let for 45 seconds — foot stays on quarters the whole time. Then: Muted triplet strums matching the voice for 60 seconds. Mark the bar where you rush — that is the real drill.",
    "jam": "Play window — make it sound like a song fragment. Day 128 jam on Triplet Feel — 1 trip-let — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 128. Ease out so tomorrow's hands forgive you. Win check: Alternate 2 bars of straight eighths and 2 bars of triplets for 16 bars with a steady foot."
  },
  "129": {
    "arrive": "Day 129. Arrive: tune if you can, then read the win out loud: Hit ensemble-style stop-time figures with clean silence after.",
    "warmup": "Day 129. Warm the hands for what this day actually asks. Light preview — Click on; play only beat 1 of each bar for 8 bars.",
    "teach": "Let me put this simply: Stop-time is coordinated hits and rests — a band skill you can practice alone by being strict with the click. First win to aim at: Hit ensemble-style stop-time figures with clean silence after. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Reps with intention for day 129 — Stop-Time Blues — Hits With the Imaginary Band. Start with: Click on; play only beat 1 of each bar for 8 bars. Then: Hits on 1 and the & of 2; rest elsewhere — 8 bars. Mark the bar where you rush — that is the real drill.",
    "jam": "Jam: stop drilling, start saying something. Day 129 jam on Stop-Time Blues — Hits With the Imaginary Band — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 129. Session close. Win check: Play one 12-bar stop-time chorus where every rest is clean and every re-entry lands with the click."
  },
  "130": {
    "arrive": "Day 130. Settle in — shoulders soft, phone down: Keep 16th-note ghost motion alive in the right hand.",
    "warmup": "Day 130. Shake out, then touch today's material lightly. Light preview — 16th ghost strums muted 60 seconds at a slow BPM.",
    "teach": "Before we grind reps: Funk rhythm is often more ghost than note. The grid never stops; pitches appear as decorations on a continuous 16th engine. First win to aim at: Keep 16th-note ghost motion alive in the right hand. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Practice loop time for day 130 — Funk Chicka — 16th Speckles. Start with: 16th ghost strums muted 60 seconds at a slow BPM. Then: Add fretting-hand left mute chucks on &s for 8 bars. Mark the bar where you rush — that is the real drill.",
    "jam": "Music time — put the lesson inside something that grooves. Day 130 jam on Funk Chicka — 16th Speckles — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 130. Wind down: one gentle sound, then the win question. Win check: Play a 16-bar funk vamp with continuous 16th ghosts and clear pitched hits on chosen slots only."
  },
  "131": {
    "arrive": "Day 131. Two minutes to show up fully: Slow the harmonic rhythm without dragging the pulse into mush.",
    "warmup": "Day 131. No hero warm-up — just honest prep. Light preview — One chord per two bars at 60 BPM — count every beat aloud.",
    "teach": "Park the hands a second — idea first: Ballads punish impatience. Harmonic rhythm (how often chords change) can be slow while the inner pulse stays firm. First win to aim at: Slow the harmonic rhythm without dragging the pulse into mush. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Guided block — your drills, my pacing for day 131 — Ballad Space — Slow Harmonic Rhythm. Start with: One chord per two bars at 60 BPM — count every beat aloud. Then: Crescendo across 4 bars on a single chord, then release. Mark the bar where you rush — that is the real drill.",
    "jam": "Loose on purpose — still in time. Day 131 jam on Ballad Space — Slow Harmonic Rhythm — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 131. Cool-down — soft hands, honest check. Win check: Play 16 slow bars with at most one chord change every two bars, steady pulse, and audible dynamic shape."
  },
  "132": {
    "arrive": "Day 132. Check posture, then lock the intention: Anticipate a chord on the & before the downbeat on purpose.",
    "warmup": "Day 132. Gentle start, then today's shapes. Light preview — Normal changes on beat 1 for 8 bars — foot stays on quarters the whole time.",
    "teach": "This is the bit that unlocks the rest: A push places a harmony early against a stable meter. The ear loves the tension only if beat 1 remains clear in the body. First win to aim at: Anticipate a chord on the & before the downbeat on purpose. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "This is the gym section for day 132 — Push Chords — Anticipate the Downbeat. Start with: Normal changes on beat 1 for 8 bars — foot stays on quarters the whole time. Then: Same progression with each change on the & of 4 — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "This is the part you came for. Day 132 jam on Push Chords — Anticipate the Downbeat — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 132. Leave the guitar friendlier than you found it. Win check: Play 16 bars alternating square and pushed changes with an obviously steady foot."
  },
  "133": {
    "arrive": "Day 133. You are here. That already counts. Intention next: Feel a 3-group against a 2-pulse without losing either layer.",
    "warmup": "Day 133. We wake the specific muscles you will need. Light preview — Foot in 2s; hand taps groups of 3 for 45 seconds.",
    "teach": "Teacher hat on for a minute: Polyrhythm taste training builds independence. Start loud and slow; speed is not the point — layered clarity is. First win to aim at: Feel a 3-group against a 2-pulse without losing either layer. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Hands-on stretch for day 133 — Polyrhythm Taste — 3 Against 2 Feel. Start with: Foot in 2s; hand taps groups of 3 for 45 seconds. Then: Swap layers: foot in 3, hand in 2 — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Song-shaped minutes. Day 133 jam on Polyrhythm Taste — 3 Against 2 Feel — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 133. Soft landing. Win check: Show 30 seconds of clear 3-against-2 with foot and hand roles identifiable."
  },
  "134": {
    "arrive": "Day 134. Land in the chair. One breath. Here is today's aim: Sketch a simple density plan (sparse / medium / full) for 16–32 bars.",
    "warmup": "Day 134. Easy blood-flow first. Light preview — Write bar numbers 1–16 and mark S/M/F density with a pencil.",
    "teach": "One clear idea today: Arrangement is deciding when to play less. Sparse sections make full sections hit harder. Map density on paper first — that is a pro habit... First win to aim at: Sketch a simple density plan (sparse / medium / full) for 16–32 bars. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Slow enough that form stays honest for day 134 — Texture Arrangement Lab — Play Less on Purpose. Start with: Write bar numbers 1–16 and mark S/M/F density with a pencil. Then: Play the map with muted strums only — no chord changes until the plan feels clear. Mark the bar where you rush — that is the real drill.",
    "jam": "Let the hands make a little story. Day 134 jam on Texture Arrangement Lab — Play Less on Purpose — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 134. Ease out so tomorrow's hands forgive you. Win check: Perform a 16-bar pass where a listener could hear your density plan without a chart."
  },
  "135": {
    "arrive": "Day 135. Arrive: tune if you can, then read the win out loud: Play on top of, with, and slightly behind the click.",
    "warmup": "Day 135. Warm the hands for what this day actually asks. Light preview — Chug quarters, play exactly on the click, 8 bars.",
    "teach": "Think of it like this: The click is a lane you can drift in. On time is the center; behind feels relaxed, ahead feels urgent. First win to aim at: Play on top of, with, and slightly behind the click. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "We will work the list in order for day 135 — Click Trust — Play Behind/On/Ahead. Start with: Chug quarters, play exactly on the click, 8 bars. Then: Lean slightly behind the click for 8 bars — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Fun pass: same skills, less judgment. Day 135 jam on Click Trust — Play Behind/On/Ahead — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 135. Session close. Win check: Label on / behind / ahead for 8 bars each without losing the form of a simple vamp."
  },
  "136": {
    "arrive": "Day 136. Settle in — shoulders soft, phone down: Crescendo and decrescendo across multi-bar phrases.",
    "warmup": "Day 136. Shake out, then touch today's material lightly. Light preview — Strum one chord, quiet to loud over 4 bars — foot stays on quarters the whole time.",
    "teach": "Here is the heart of it: Dynamics are a wave, not a switch. Ramp volume slowly so listeners ride it with you. If the foot rushes, the hands will too; rebuild from... First win to aim at: Crescendo and decrescendo across multi-bar phrases. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Now we earn it with clean reps for day 136 — Dynamic Waves — Crescendo Strum. Start with: Strum one chord, quiet to loud over 4 bars — foot stays on quarters the whole time. Then: Shape loud to quiet over the next 4 bars on purpose. Mark the bar where you rush — that is the real drill.",
    "jam": "Play window — make it sound like a song fragment. Day 136 jam on Dynamic Waves — Crescendo Strum — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 136. Wind down: one gentle sound, then the win question. Win check: An 8-bar dynamic wave (up then down) without speeding up or collapsing the groove."
  },
  "137": {
    "arrive": "Day 137. Two minutes to show up fully: Count a simple 5/4 or 5-beat cycle without panic.",
    "warmup": "Day 137. No hero warm-up — just honest prep. Light preview — Count 1-2-3, 1-2 out loud for 30 seconds — foot stays on quarters the whole time.",
    "teach": "Let me put this simply: Odd meters are just 4/4 with a secret. 5/4 = one bar of 3 plus one bar of 2, counted as one loop. If the foot rushes, the hands will too... First win to aim at: Count a simple 5/4 or 5-beat cycle without panic. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Reps with intention for day 137 — Odd Accent — 5/4 Taste. Start with: Count 1-2-3, 1-2 out loud for 30 seconds — foot stays on quarters the whole time. Then: Tap all 5 beats with your foot before you add the guitar. Mark the bar where you rush — that is the real drill.",
    "jam": "Jam: stop drilling, start saying something. Day 137 jam on Odd Accent — 5/4 Taste — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 137. Cool-down — soft hands, honest check. Win check: Loop 8 cycles of a 5-beat groove you can count aloud while playing."
  },
  "138": {
    "arrive": "Day 138. Check posture, then lock the intention: Build a two-bar comp pattern you could hand to a singer.",
    "warmup": "Day 138. Gentle start, then today's shapes. Light preview — Design a 2-bar pattern on paper: mark down/up strokes and rests.",
    "teach": "Before we grind reps: Comping is rhythm first, chords second. A pattern you can repeat is a gift to whoever sings over it. First win to aim at: Build a two-bar comp pattern you could hand to a singer. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Practice loop time for day 138 — Comp Patterns — Two Rights, One Left. Start with: Design a 2-bar pattern on paper: mark down/up strokes and rests. Then: Mute-play it 8 times at a steady tempo without rushing the changes. Mark the bar where you rush — that is the real drill.",
    "jam": "Music time — put the lesson inside something that grooves. Day 138 jam on Comp Patterns — Two Rights, One Left — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 138. Leave the guitar friendlier than you found it. Win check: Loop your 2-bar comp for 16 bars with chord changes and a pattern that never blurs."
  },
  "139": {
    "arrive": "Day 139. You are here. That already counts. Intention next: Separate bass notes on 1 and 3 from chucks on 2 and 4.",
    "warmup": "Day 139. We wake the specific muscles you will need. Light preview — Bass on open D/G strings beats 1 & 3, 60 seconds.",
    "teach": "Park the hands a second — idea first: Bass, chord, bass, chord. The thumb and the strum hand do different jobs — that split is the skill. If the foot rushes, the hands will too... First win to aim at: Separate bass notes on 1 and 3 from chucks on 2 and 4. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Guided block — your drills, my pacing for day 139 — Genre Day — Country Boom-Chuck Deepening. Start with: Bass on open D/G strings beats 1 & 3, 60 seconds. Then: Add light muted chucks on 2 and 4 once the kick pulse is solid. Mark the bar where you rush — that is the real drill.",
    "jam": "Loose on purpose — still in time. Day 139 jam on Genre Day — Country Boom-Chuck Deepening — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 139. Soft landing. Win check: 16 bars of boom-chuck on a three-chord loop with clear bass vs chuck roles."
  },
  "140": {
    "arrive": "Day 140. Land in the chair. One breath. Here is today's aim: Drive straight eighths with consistent down-up energy.",
    "warmup": "Day 140. Easy blood-flow first. Light preview — Muted eighth strums, down-up, 30 seconds — foot stays on quarters the whole time.",
    "teach": "This is the bit that unlocks the rest: Rock lives in the even eighth. Two hands work as one engine: down-up, down-up, forever. If the foot rushes, the hands will too; rebuild... First win to aim at: Drive straight eighths with consistent down-up energy. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "This is the gym section for day 140 — Genre Day — Rock Eighth Drive. Start with: Muted eighth strums, down-up, 30 seconds — foot stays on quarters the whole time. Then: Add a power chord, keep the same right hand — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "This is the part you came for. Day 140 jam on Genre Day — Rock Eighth Drive — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 140. Ease out so tomorrow's hands forgive you. Win check: 16 bars of straight eighth drive with a clean palm-mute / open contrast."
  },
  "141": {
    "arrive": "Day 141. Arrive: tune if you can, then read the win out loud: Combine pocket, one subdivision skill, and dynamics.",
    "warmup": "Day 141. Warm the hands for what this day actually asks. Light preview — Play a 16-bar take with steady pocket — foot stays on quarters the whole time.",
    "teach": "Teacher hat on for a minute: Checkpoints combine what you've built. One take that shows groove, a subdivision, and a dynamic choice is the week's proof. First win to aim at: Combine pocket, one subdivision skill, and dynamics. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Hands-on stretch for day 141 — Weekly Rhythm Checkpoint. Start with: Play a 16-bar take with steady pocket — foot stays on quarters the whole time. Then: Add one subdivision skill (eighths or swing) — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Song-shaped minutes. Day 141 jam on Weekly Rhythm Checkpoint — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 141. Session close. Win check: Save one 16-bar take showing steady time plus one expressive choice, with a written keep and fix."
  },
  "142": {
    "arrive": "Day 142. Settle in — shoulders soft, phone down: Play behind the beat without dragging the band.",
    "warmup": "Day 142. Shake out, then touch today's material lightly. Light preview — Eighth chugs, sit just behind the click, 8 bars — foot stays on quarters the whole time.",
    "teach": "One clear idea today: Behind the beat is a color, not a mistake. The trick is coming back to center at the right moment. If the foot rushes, the hands will too... First win to aim at: Play behind the beat without dragging the band. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Slow enough that form stays honest for day 142 — Click Trust — Play Behind/On/Ahead (2). Start with: Eighth chugs, sit just behind the click, 8 bars — foot stays on quarters the whole time. Then: Come back to dead-center for 4 bars — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Let the hands make a little story. Day 142 jam on Click Trust — Play Behind/On/Ahead (2) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 142. Wind down: one gentle sound, then the win question. Win check: 8 bars behind the beat that snap back to center for the chorus."
  },
  "143": {
    "arrive": "Day 143. Two minutes to show up fully: Build a whole verse with a slow crescendo.",
    "warmup": "Day 143. No hero warm-up — just honest prep. Light preview — Verse groove, start at 50% volume for the first 2 bars.",
    "teach": "Think of it like this: A verse that grows quietly makes the chorus feel twice as big. Save something for the top. If the foot rushes, the hands will too; rebuild... First win to aim at: Build a whole verse with a slow crescendo. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "We will work the list in order for day 143 — Dynamic Waves — Crescendo Strum (2). Start with: Verse groove, start at 50% volume for the first 2 bars. Then: Gain about 10% volume every 2 bars, watching your strum size. Mark the bar where you rush — that is the real drill.",
    "jam": "Fun pass: same skills, less judgment. Day 143 jam on Dynamic Waves — Crescendo Strum (2) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 143. Cool-down — soft hands, honest check. Win check: A verse that swells into a full-volume chorus, tempo never moving."
  },
  "144": {
    "arrive": "Day 144. Check posture, then lock the intention: Place an accent on the 'and' of beat 3 in 5/4.",
    "warmup": "Day 144. Gentle start, then today's shapes. Light preview — 5-beat loop, all beats even, count 1-2-3-4-5 out loud.",
    "teach": "Here is the heart of it: The accent is what makes odd meter feel intentional, not mistaken. Accent where the groove leans. If the foot rushes, the hands will too... First win to aim at: Place an accent on the 'and' of beat 3 in 5/4. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Now we earn it with clean reps for day 144 — Odd Accent — 5/4 Taste (2). Start with: 5-beat loop, all beats even, count 1-2-3-4-5 out loud. Then: Add an accent on the 'and' of beat 3, keep the rest soft. Mark the bar where you rush — that is the real drill.",
    "jam": "Play window — make it sound like a song fragment. Day 144 jam on Odd Accent — 5/4 Taste (2) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 144. Leave the guitar friendlier than you found it. Win check: A 5/4 riff with a deliberate odd accent that stays consistent for 8 cycles."
  },
  "145": {
    "arrive": "Day 145. You are here. That already counts. Intention next: Make the low-thump / high-scratch contrast obvious.",
    "warmup": "Day 145. We wake the specific muscles you will need. Light preview — Thumb the root on beat 1, mute-scratch beats 2-4.",
    "teach": "Let me put this simply: Boom and chick are two voices. The low thumb is the bassist; the scratch is the drummer. If the foot rushes, the hands will too; rebuild... First win to aim at: Make the low-thump / high-scratch contrast obvious. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Reps with intention for day 145 — Comp Patterns — Two Rights, One Left (2). Start with: Thumb the root on beat 1, mute-scratch beats 2-4. Then: Add a high chord scratch on beat 2 only — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Jam: stop drilling, start saying something. Day 145 jam on Comp Patterns — Two Rights, One Left (2) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 145. Soft landing. Win check: A boom-chick comp where the bass note lands on 1 every single bar."
  },
  "146": {
    "arrive": "Day 146. Land in the chair. One breath. Here is today's aim: Move boom-chuck between G, C, and D without stopping.",
    "warmup": "Day 146. Easy blood-flow first. Light preview — Boom-chuck G-C-D-G, 4 bars each, bass on 1 and 3.",
    "teach": "Before we grind reps: Boom-chuck is a vehicle. The bass follows the root, the chuck stays fixed, and the fill is a detour that returns. First win to aim at: Move boom-chuck between G, C, and D without stopping. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Practice loop time for day 146 — Genre Day — Country Boom-Chuck Deepening (2). Start with: Boom-chuck G-C-D-G, 4 bars each, bass on 1 and 3. Then: Move the bass to each new root on beat 1 of the change. Mark the bar where you rush — that is the real drill.",
    "jam": "Music time — put the lesson inside something that grooves. Day 146 jam on Genre Day — Country Boom-Chuck Deepening (2) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 146. Ease out so tomorrow's hands forgive you. Win check: G-C-D-G boom-chuck with root-following bass and one clean fill per loop."
  },
  "147": {
    "arrive": "Day 147. Arrive: tune if you can, then read the win out loud: Lock the eighth drive to a two-chord riff.",
    "warmup": "Day 147. Warm the hands for what this day actually asks. Light preview — Eighths on one power chord for 4 bars, engine steady.",
    "teach": "Park the hands a second — idea first: The down-up never stops in rock. Chords change under it; the engine just keeps turning. If the foot rushes, the hands will too; rebuild... First win to aim at: Lock the eighth drive to a two-chord riff. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Guided block — your drills, my pacing for day 147 — Genre Day — Rock Eighth Drive (2). Start with: Eighths on one power chord for 4 bars, engine steady. Then: Switch chords on beat 1, keep the down-up engine running. Mark the bar where you rush — that is the real drill.",
    "jam": "Loose on purpose — still in time. Day 147 jam on Genre Day — Rock Eighth Drive (2) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 147. Session close. Win check: A two-chord eighth-drive riff with a clean pickup, engine never dropping."
  },
  "148": {
    "arrive": "Day 148. Settle in — shoulders soft, phone down: Make the checkpoint take feel like music, not a test.",
    "warmup": "Day 148. Shake out, then touch today's material lightly. Light preview — Warm up 2 minutes with the week's groove, hands loose.",
    "teach": "This is the bit that unlocks the rest: A checkpoint is a performance, not a quiz. Two takes, keep the musical one. If the foot rushes, the hands will too; rebuild from quarters. First win to aim at: Make the checkpoint take feel like music, not a test. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "This is the gym section for day 148 — Weekly Rhythm Checkpoint (2). Start with: Warm up 2 minutes with the week's groove, hands loose. Then: Take one: 16 bars with the new skill included, no stopping. Mark the bar where you rush — that is the real drill.",
    "jam": "This is the part you came for. Day 148 jam on Weekly Rhythm Checkpoint (2) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 148. Wind down: one gentle sound, then the win question. Win check: Two takes with one kept, and a written reason for the choice."
  },
  "149": {
    "arrive": "Day 149. Two minutes to show up fully: Push ahead of the click on purpose.",
    "warmup": "Day 149. No hero warm-up — just honest prep. Light preview — Chug eighths slightly ahead for 8 bars — foot stays on quarters the whole time.",
    "teach": "Teacher hat on for a minute: Ahead of the beat reads as excitement. Use it for climbs and builds, then spend the energy. If the foot rushes, the hands will too; rebuild... First win to aim at: Push ahead of the click on purpose. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Hands-on stretch for day 149 — Click Trust — Play Behind/On/Ahead (3). Start with: Chug eighths slightly ahead for 8 bars — foot stays on quarters the whole time. Then: Peak the phrase with an accent at the top — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Song-shaped minutes. Day 149 jam on Click Trust — Play Behind/On/Ahead (3) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 149. Cool-down — soft hands, honest check. Win check: An 8-bar push ahead that peaks, then lands back in the pocket."
  },
  "150": {
    "arrive": "Day 150. Check posture, then lock the intention: Ride a 32-bar texture wave without losing tempo.",
    "warmup": "Day 150. Gentle start, then today's shapes. Light preview — Bars 1-8: keep it sparse, two chords per bar, light touch.",
    "teach": "One clear idea today: Texture is volume of motion, not volume of sound. A quiet busy section can still push the song forward. First win to aim at: Ride a 32-bar texture wave without losing tempo. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Slow enough that form stays honest for day 150 — Rhythm Capstone Mid — 32-Bar Texture Ride. Start with: Bars 1-8: keep it sparse, two chords per bar, light touch. Then: Bars 9-16: add eighth-note strums and start building. Mark the bar where you rush — that is the real drill.",
    "jam": "Let the hands make a little story. Day 150 jam on Rhythm Capstone Mid — 32-Bar Texture Ride — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 150. Leave the guitar friendlier than you found it. Win check: 32 bars that swell and settle at one steady tempo, ending on a held chord."
  },
  "151": {
    "arrive": "Day 151. You are here. That already counts. Intention next: Play the same groove with three different feels.",
    "warmup": "Day 151. We wake the specific muscles you will need. Light preview — Groove straight eighths for 8 bars — foot stays on quarters the whole time.",
    "teach": "Think of it like this: Feel is how you bend time without breaking it. Straight, swung, and half-time all live in the same bar. First win to aim at: Play the same groove with three different feels. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "We will work the list in order for day 151 — Groove Deepening — Pocket Variations. Start with: Groove straight eighths for 8 bars — foot stays on quarters the whole time. Then: Same groove, swung eighths, 8 bars — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Fun pass: same skills, less judgment. Day 151 jam on Groove Deepening — Pocket Variations — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 151. Soft landing. Win check: One groove in three feels at the same tempo, switching cleanly every 4 bars."
  },
  "152": {
    "arrive": "Day 152. Land in the chair. One breath. Here is today's aim: Comp in a way that leaves room for lyrics.",
    "warmup": "Day 152. Easy blood-flow first. Light preview — Comp 2-bar pattern, hum the melody over it — foot stays on quarters the whole time.",
    "teach": "Here is the heart of it: A good comp is a road with lanes. When the melody moves, you move less — stay out of the singer's way and lock the pocket. First win to aim at: Comp in a way that leaves room for lyrics. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Now we earn it with clean reps for day 152 — Comp Patterns — Two Rights, One Left (3). Start with: Comp 2-bar pattern, hum the melody over it — foot stays on quarters the whole time. Then: On busy melody bars, cut to downstrokes only — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Play window — make it sound like a song fragment. Day 152 jam on Comp Patterns — Two Rights, One Left (3) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 152. Ease out so tomorrow's hands forgive you. Win check: A comp that thins out under busy melody and fills under held notes."
  },
  "153": {
    "arrive": "Day 153. Arrive: tune if you can, then read the win out loud: Play boom-chuck at a faster, dancing tempo.",
    "warmup": "Day 153. Warm the hands for what this day actually asks. Light preview — Boom-chuck on G-C-D at 90 BPM for 4 bars, bass and chuck split clean.",
    "teach": "Let me put this simply: At tempo, boom-chuck becomes a dance. The faster you go, the more the split has to be automatic. If the foot rushes, the hands will too... First win to aim at: Play boom-chuck at a faster, dancing tempo. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Reps with intention for day 153 — Genre Day — Country Boom-Chuck Deepening (3). Start with: Boom-chuck on G-C-D at 90 BPM for 4 bars, bass and chuck split clean. Then: Push to 100 BPM and keep the bass/chuck roles distinct. Mark the bar where you rush — that is the real drill.",
    "jam": "Jam: stop drilling, start saying something. Day 153 jam on Genre Day — Country Boom-Chuck Deepening (3) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 153. Session close. Win check: Boom-chuck at 100 BPM with a clear bass/chuck split and a relaxed feel."
  },
  "154": {
    "arrive": "Day 154. Settle in — shoulders soft, phone down: Build a rock groove with dynamics.",
    "warmup": "Day 154. Shake out, then touch today's material lightly. Light preview — Verse: light eighths, no palm mute, quiet and even.",
    "teach": "Before we grind reps: Quiet verse + heavy chorus is rock's oldest trick. Save the palm mute for the loud part. If the foot rushes, the hands will too; rebuild... First win to aim at: Build a rock groove with dynamics. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Practice loop time for day 154 — Genre Day — Rock Eighth Drive (3). Start with: Verse: light eighths, no palm mute, quiet and even. Then: Chorus: full palm-muted chugs, bigger and heavier. Mark the bar where you rush — that is the real drill.",
    "jam": "Music time — put the lesson inside something that grooves. Day 154 jam on Genre Day — Rock Eighth Drive (3) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 154. Wind down: one gentle sound, then the win question. Win check: A verse/chorus rock groove whose contrast comes from the palm mute."
  },
  "155": {
    "arrive": "Day 155. Two minutes to show up fully: Checkpoint with the metronome audible.",
    "warmup": "Day 155. No hero warm-up — just honest prep. Light preview — Set the click to the week's tempo and count in — foot stays on quarters the whole time.",
    "teach": "Park the hands a second — idea first: The metronome is the honest judge. One audible-click take tells you exactly where the time bends. If the foot rushes, the hands will too... First win to aim at: Checkpoint with the metronome audible. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Guided block — your drills, my pacing for day 155 — Weekly Rhythm Checkpoint (3). Start with: Set the click to the week's tempo and count in — foot stays on quarters the whole time. Then: Play 16 bars with the click in the room, foot locked. Mark the bar where you rush — that is the real drill.",
    "jam": "Loose on purpose — still in time. Day 155 jam on Weekly Rhythm Checkpoint (3) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 155. Cool-down — soft hands, honest check. Win check: An audible-click 16-bar take with one marked timing fix applied."
  },
  "156": {
    "arrive": "Day 156. Check posture, then lock the intention: Move between on, behind, and ahead within one song.",
    "warmup": "Day 156. Gentle start, then today's shapes. Light preview — 4 bars on, 4 bars behind, 4 bars ahead — foot stays on quarters the whole time.",
    "teach": "This is the bit that unlocks the rest: Placement is phrasing. Verses can sit back, choruses can lean in, and the click never changes. If the foot rushes, the hands will too... First win to aim at: Move between on, behind, and ahead within one song. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "This is the gym section for day 156 — Click Trust — Play Behind/On/Ahead (4). Start with: 4 bars on, 4 bars behind, 4 bars ahead — foot stays on quarters the whole time. Then: Repeat with a verse/chorus story in mind — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "This is the part you came for. Day 156 jam on Click Trust — Play Behind/On/Ahead (4) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 156. Leave the guitar friendlier than you found it. Win check: On / behind / ahead mapped to a verse-chorus story at one steady tempo."
  },
  "157": {
    "arrive": "Day 157. You are here. That already counts. Intention next: Use dynamics inside a single riff.",
    "warmup": "Day 157. We wake the specific muscles you will need. Light preview — Play the riff at one flat volume, 4 bars — foot stays on quarters the whole time.",
    "teach": "Teacher hat on for a minute: A riff is more than notes — it's where you push and where you pull. Accents give it a spine. If the foot rushes, the hands will too... First win to aim at: Use dynamics inside a single riff. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Hands-on stretch for day 157 — Dynamic Waves — Crescendo Strum (3). Start with: Play the riff at one flat volume, 4 bars — foot stays on quarters the whole time. Then: Same riff, accent the peak note louder — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Song-shaped minutes. Day 157 jam on Dynamic Waves — Crescendo Strum (3) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 157. Soft landing. Win check: The same riff with accent and swell, groove intact the whole time."
  },
  "158": {
    "arrive": "Day 158. Land in the chair. One breath. Here is today's aim: Turn the odd accent into a hook.",
    "warmup": "Day 158. Easy blood-flow first. Light preview — Build a 2-bar 5/4 riff with the accent in bar 1 — foot stays on quarters the whole time.",
    "teach": "One clear idea today: A repeated accent becomes a riff's identity. The odd meter stops being math and starts being a melody. First win to aim at: Turn the odd accent into a hook. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Slow enough that form stays honest for day 158 — Odd Accent — 5/4 Taste (3). Start with: Build a 2-bar 5/4 riff with the accent in bar 1 — foot stays on quarters the whole time. Then: Loop it until it sounds like a song intro — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Let the hands make a little story. Day 158 jam on Odd Accent — 5/4 Taste (3) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 158. Ease out so tomorrow's hands forgive you. Win check: A 5/4 hook with a signature accent that resolves into a 4/4 section."
  },
  "159": {
    "arrive": "Day 159. Arrive: tune if you can, then read the win out loud: Build a comp pattern that works in a full band.",
    "warmup": "Day 159. Warm the hands for what this day actually asks. Light preview — Comp muted eighths with the backbeat — foot stays on quarters the whole time.",
    "teach": "Think of it like this: In a band, comp is a slot, not a solo. Play the rhythmic pocket and get out of the bass's way. If the foot rushes, the hands will too... First win to aim at: Build a comp pattern that works in a full band. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "We will work the list in order for day 159 — Comp Patterns — Two Rights, One Left (4). Start with: Comp muted eighths with the backbeat — foot stays on quarters the whole time. Then: Drop the low E string from the pattern — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Fun pass: same skills, less judgment. Day 159 jam on Comp Patterns — Two Rights, One Left (4) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 159. Session close. Win check: A band-ready comp that locks to the backbeat and stays out of the bass register."
  },
  "160": {
    "arrive": "Day 160. Settle in — shoulders soft, phone down: Comp boom-chuck under a melody.",
    "warmup": "Day 160. Shake out, then touch today's material lightly. Light preview — Boom-chuck under a simple melody on G-C-D, bass steady.",
    "teach": "Here is the heart of it: Boom-chuck is the road; the melody is the car. When the car turns, the road can ease up. If the foot rushes, the hands will too; rebuild... First win to aim at: Comp boom-chuck under a melody. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Now we earn it with clean reps for day 160 — Genre Day — Country Boom-Chuck Deepening (4). Start with: Boom-chuck under a simple melody on G-C-D, bass steady. Then: Cut to bass-only during the busiest melody bars — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Play window — make it sound like a song fragment. Day 160 jam on Genre Day — Country Boom-Chuck Deepening (4) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 160. Wind down: one gentle sound, then the win question. Win check: Boom-chuck comping that follows a melody's busy and quiet spots."
  },
  "161": {
    "arrive": "Day 161. Two minutes to show up fully: Play eighth drive over a 12-bar blues.",
    "warmup": "Day 161. No hero warm-up — just honest prep. Light preview — Chug eighths over the I chord for 4 bars, palm-muted.",
    "teach": "Let me put this simply: The blues map is a train track. Eighths are the engine — they don't care which chord they're over. If the foot rushes, the hands will too... First win to aim at: Play eighth drive over a 12-bar blues. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Reps with intention for day 161 — Genre Day — Rock Eighth Drive (4). Start with: Chug eighths over the I chord for 4 bars, palm-muted. Then: IV chord for 2 bars, back to I for 2, engine never stops. Mark the bar where you rush — that is the real drill.",
    "jam": "Jam: stop drilling, start saying something. Day 161 jam on Genre Day — Rock Eighth Drive (4) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 161. Cool-down — soft hands, honest check. Win check: 12 bars of eighth drive over the blues map, chords landing on schedule."
  },
  "162": {
    "arrive": "Day 162. Check posture, then lock the intention: Checkpoint with a dynamic arc.",
    "warmup": "Day 162. Gentle start, then today's shapes. Light preview — 16 bars: soft start, build, peak, settle — foot stays on quarters the whole time.",
    "teach": "Before we grind reps: A rhythm checkpoint with dynamics proves you own the whole skill, not just the notes. If the foot rushes, the hands will too; rebuild from... First win to aim at: Checkpoint with a dynamic arc. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Practice loop time for day 162 — Weekly Rhythm Checkpoint (4). Start with: 16 bars: soft start, build, peak, settle — foot stays on quarters the whole time. Then: Include the week's pattern in the build — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Music time — put the lesson inside something that grooves. Day 162 jam on Weekly Rhythm Checkpoint (4) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 162. Leave the guitar friendlier than you found it. Win check: A 16-bar dynamic-arc take with the week's pattern and a steady tempo."
  },
  "163": {
    "arrive": "Day 163. You are here. That already counts. Intention next: Use placement to make a groove breathe.",
    "warmup": "Day 163. We wake the specific muscles you will need. Light preview — Travis-style pattern, sit slightly behind on the verse.",
    "teach": "Park the hands a second — idea first: Grooves breathe when placement shifts with the section. Your foot is the only metronome you carry. If the foot rushes, the hands will too... First win to aim at: Use placement to make a groove breathe. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Guided block — your drills, my pacing for day 163 — Click Trust — Play Behind/On/Ahead (5). Start with: Travis-style pattern, sit slightly behind on the verse. Then: Lean ahead of the click on the fill, then reset — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Loose on purpose — still in time. Day 163 jam on Click Trust — Play Behind/On/Ahead (5) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 163. Soft landing. Win check: A travis-style groove whose placement breathes with the form, foot steady throughout."
  },
  "164": {
    "arrive": "Day 164. Land in the chair. One breath. Here is today's aim: Shape a 16-bar section with dynamics alone.",
    "warmup": "Day 164. Easy blood-flow first. Light preview — 16 bars: soft intro, build, loud peak, settle — foot stays on quarters the whole time.",
    "teach": "This is the bit that unlocks the rest: You can map a song's form with nothing but volume. Loud is the chorus; soft is the story. If the foot rushes, the hands will too; rebuild... First win to aim at: Shape a 16-bar section with dynamics alone. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "This is the gym section for day 164 — Dynamic Waves — Crescendo Strum (4). Start with: 16 bars: soft intro, build, loud peak, settle — foot stays on quarters the whole time. Then: Play it with one chord the whole way — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "This is the part you came for. Day 164 jam on Dynamic Waves — Crescendo Strum (4) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 164. Ease out so tomorrow's hands forgive you. Win check: A 16-bar dynamic shape that reads as a form even on one chord."
  },
  "165": {
    "arrive": "Day 165. Arrive: tune if you can, then read the win out loud: Comp in 5/4 without counting aloud.",
    "warmup": "Day 165. Warm the hands for what this day actually asks. Light preview — Feel 5 with your foot, no counting aloud, 30s — foot stays on quarters the whole time.",
    "teach": "Teacher hat on for a minute: Odd meters become body knowledge. Once your foot feels the 5, your hands can stop counting. If the foot rushes, the hands will too; rebuild... First win to aim at: Comp in 5/4 without counting aloud. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Hands-on stretch for day 165 — Odd Accent — 5/4 Taste (4). Start with: Feel 5 with your foot, no counting aloud, 30s — foot stays on quarters the whole time. Then: Comp one chord across the 5 beats — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Song-shaped minutes. Day 165 jam on Odd Accent — 5/4 Taste (4) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 165. Session close. Win check: 5/4 comping with silent counting and changes that land on the same beat every cycle."
  },
  "166": {
    "arrive": "Day 166. Settle in — shoulders soft, phone down: Vary the comp pattern without losing its identity.",
    "warmup": "Day 166. Shake out, then touch today's material lightly. Light preview — Play your base comp pattern for 4 bars at a relaxed tempo.",
    "teach": "One clear idea today: Variation is one changed element, not a new pattern. The singer needs the road to stay the road. If the foot rushes, the hands will too... First win to aim at: Vary the comp pattern without losing its identity. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Slow enough that form stays honest for day 166 — Comp Patterns — Two Rights, One Left (5). Start with: Play your base comp pattern for 4 bars at a relaxed tempo. Then: Change only the ending strum on the last beat of bar 4. Mark the bar where you rush — that is the real drill.",
    "jam": "Let the hands make a little story. Day 166 jam on Comp Patterns — Two Rights, One Left (5) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 166. Wind down: one gentle sound, then the win question. Win check: Three variations of one comp pattern, each changing a single element."
  },
  "167": {
    "arrive": "Day 167. Two minutes to show up fully: Put a country walk-up into the boom-chuck.",
    "warmup": "Day 167. No hero warm-up — just honest prep. Light preview — Boom-chuck G to C, walking the bass G-A-B-C under it.",
    "teach": "Think of it like this: A walk-up is a bass line that leans toward the next chord. One or two steps is all country needs. If the foot rushes, the hands will too... First win to aim at: Put a country walk-up into the boom-chuck. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "We will work the list in order for day 167 — Genre Day — Country Boom-Chuck Deepening (5). Start with: Boom-chuck G to C, walking the bass G-A-B-C under it. Then: C to D, walk the bass C-D-E-D and land clean — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Fun pass: same skills, less judgment. Day 167 jam on Genre Day — Country Boom-Chuck Deepening (5) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 167. Cool-down — soft hands, honest check. Win check: A boom-chuck loop with a clean walk-up between two chords, pocket intact."
  },
  "168": {
    "arrive": "Day 168. Check posture, then lock the intention: Build a riff from a single eighth-drive cell.",
    "warmup": "Day 168. Gentle start, then today's shapes. Light preview — Write a 1-bar eighth-note cell on paper first — foot stays on quarters the whole time.",
    "teach": "Here is the heart of it: Riffs are cells that repeat. Same engine, small variation, and suddenly it's a song intro. If the foot rushes, the hands will too; rebuild... First win to aim at: Build a riff from a single eighth-drive cell. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Now we earn it with clean reps for day 168 — Genre Day — Rock Eighth Drive (5). Start with: Write a 1-bar eighth-note cell on paper first — foot stays on quarters the whole time. Then: Repeat it exactly for 4 bars, no variation yet — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Play window — make it sound like a song fragment. Day 168 jam on Genre Day — Rock Eighth Drive (5) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 168. Leave the guitar friendlier than you found it. Win check: A 1-bar cell riff with one deliberate variation that reads as a hook."
  },
  "169": {
    "arrive": "Day 169. You are here. That already counts. Intention next: Checkpoint with a band feel, not alone.",
    "warmup": "Day 169. We wake the specific muscles you will need. Light preview — Pick a drumless or very sparse backing track — foot stays on quarters the whole time.",
    "teach": "Let me put this simply: A backing track is the closest thing to a band. Locking into it tests your pocket for real. If the foot rushes, the hands will too; rebuild... First win to aim at: Checkpoint with a band feel, not alone. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Reps with intention for day 169 — Weekly Rhythm Checkpoint (5). Start with: Pick a drumless or very sparse backing track — foot stays on quarters the whole time. Then: Play the week's groove over it, lock to the feel. Mark the bar where you rush — that is the real drill.",
    "jam": "Jam: stop drilling, start saying something. Day 169 jam on Weekly Rhythm Checkpoint (5) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 169. Soft landing. Win check: One take over a backing track that locks to its pocket."
  },
  "170": {
    "arrive": "Day 170. Land in the chair. One breath. Here is today's aim: Play over the click with long tones placed by feel.",
    "warmup": "Day 170. Easy blood-flow first. Light preview — Play a natural harmonic, let it ring a full bar — foot stays on quarters the whole time.",
    "teach": "Before we grind reps: Harmonics ring longer than you expect. Place them behind the beat so they bloom into the pulse. If the foot rushes, the hands will too... First win to aim at: Play over the click with long tones placed by feel. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Practice loop time for day 170 — Click Trust — Play Behind/On/Ahead (6). Start with: Play a natural harmonic, let it ring a full bar — foot stays on quarters the whole time. Then: Enter slightly behind the click on each one — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Music time — put the lesson inside something that grooves. Day 170 jam on Click Trust — Play Behind/On/Ahead (6) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 170. Ease out so tomorrow's hands forgive you. Win check: Harmonics placed behind the beat that bloom and resolve on the downbeat."
  },
  "171": {
    "arrive": "Day 171. Arrive: tune if you can, then read the win out loud: Play dynamics as a duet partner.",
    "warmup": "Day 171. Warm the hands for what this day actually asks. Light preview — Comp quietly under a loud groove, keep it in the pocket.",
    "teach": "Park the hands a second — idea first: Dynamics are a conversation. If the groove is loud, answer loud; if it drops, drop with it. If the foot rushes, the hands will too; rebuild... First win to aim at: Play dynamics as a duet partner. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Guided block — your drills, my pacing for day 171 — Dynamic Waves — Crescendo Strum (5). Start with: Comp quietly under a loud groove, keep it in the pocket. Then: Trade: 4 bars loud, 4 bars soft, same pattern — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Loose on purpose — still in time. Day 171 jam on Dynamic Waves — Crescendo Strum (5) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 171. Session close. Win check: 4 bars matching the groove's volume, then 4 bars contrasting — both in time."
  },
  "172": {
    "arrive": "Day 172. Settle in — shoulders soft, phone down: Layer the odd accent under a solo.",
    "warmup": "Day 172. Shake out, then touch today's material lightly. Light preview — Loop the 5/4 riff with its accent — foot stays on quarters the whole time.",
    "teach": "This is the bit that unlocks the rest: The riff is the metronome when you solo in 5. Your notes can dance around it as long as the accent holds. First win to aim at: Layer the odd accent under a solo. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "This is the gym section for day 172 — Odd Accent — 5/4 Taste (5). Start with: Loop the 5/4 riff with its accent — foot stays on quarters the whole time. Then: Solo on one string, land on the accent beat — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "This is the part you came for. Day 172 jam on Odd Accent — 5/4 Taste (5) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 172. Wind down: one gentle sound, then the win question. Win check: A short solo over the 5/4 riff whose phrases land on the accent."
  },
  "173": {
    "arrive": "Day 173. Two minutes to show up fully: Comp with dynamics that follow the song.",
    "warmup": "Day 173. No hero warm-up — just honest prep. Light preview — Comp the base pattern at 50% volume for the first pass.",
    "teach": "Teacher hat on for a minute: The comp is the song's pulse. It can swell and thin, but it must never stop being the pulse. If the foot rushes, the hands will too... First win to aim at: Comp with dynamics that follow the song. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Hands-on stretch for day 173 — Comp Patterns — Two Rights, One Left (6). Start with: Comp the base pattern at 50% volume for the first pass. Then: Swell to 100% over 8 bars, growing strum size steadily. Mark the bar where you rush — that is the real drill.",
    "jam": "Song-shaped minutes. Day 173 jam on Comp Patterns — Two Rights, One Left (6) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 173. Cool-down — soft hands, honest check. Win check: A full comp arc — swell, peak, settle — with the pattern intact throughout."
  },
  "174": {
    "arrive": "Day 174. Check posture, then lock the intention: Play boom-chuck as a full song arrangement.",
    "warmup": "Day 174. Gentle start, then today's shapes. Light preview — Verse: boom-chuck on G-C-D at 60% volume, easy and warm.",
    "teach": "One clear idea today: A song arrangement is boom-chuck plus a story. Verses sit back, choruses push, the outro lets it ring. First win to aim at: Play boom-chuck as a full song arrangement. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Slow enough that form stays honest for day 174 — Genre Day — Country Boom-Chuck Deepening (6). Start with: Verse: boom-chuck on G-C-D at 60% volume, easy and warm. Then: Chorus: full boom-chuck at 100%, open it up — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Let the hands make a little story. Day 174 jam on Genre Day — Country Boom-Chuck Deepening (6) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 174. Leave the guitar friendlier than you found it. Win check: A complete boom-chuck arrangement with dynamic verse/chorus contrast."
  },
  "175": {
    "arrive": "Day 175. You are here. That already counts. Intention next: Play a full rock song arrangement.",
    "warmup": "Day 175. We wake the specific muscles you will need. Light preview — Intro: muted eighth chugs, building anticipation.",
    "teach": "Think of it like this: Arrangement is choosing the energy per section. Drive, drop, drive, stop — that's a song. If the foot rushes, the hands will too; rebuild... First win to aim at: Play a full rock song arrangement. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "We will work the list in order for day 175 — Genre Day — Rock Eighth Drive (6). Start with: Intro: muted eighth chugs, building anticipation. Then: Verse: light drive, half the volume, keep it moving. Mark the bar where you rush — that is the real drill.",
    "jam": "Fun pass: same skills, less judgment. Day 175 jam on Genre Day — Rock Eighth Drive (6) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 175. Soft landing. Win check: A complete rock arrangement with distinct energy per section and a clear ending."
  },
  "176": {
    "arrive": "Day 176. Land in the chair. One breath. Here is today's aim: Checkpoint the full rhythm toolkit.",
    "warmup": "Day 176. Easy blood-flow first. Light preview — Warm up: groove, comp pattern, dynamics — foot stays on quarters the whole time.",
    "teach": "Here is the heart of it: The rhythm phase's final checkpoint is a mini-set. Comp, drive, dynamics, and a finish — that's the toolkit. First win to aim at: Checkpoint the full rhythm toolkit. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Now we earn it with clean reps for day 176 — Weekly Rhythm Checkpoint (6). Start with: Warm up: groove, comp pattern, dynamics — foot stays on quarters the whole time. Then: Take a full 32-bar form without stopping to restart bars. Mark the bar where you rush — that is the real drill.",
    "jam": "Play window — make it sound like a song fragment. Day 176 jam on Weekly Rhythm Checkpoint (6) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 176. Ease out so tomorrow's hands forgive you. Win check: A 32-bar take using comp, groove, and dynamics, with a written next step."
  },
  "177": {
    "arrive": "Day 177. Arrive: tune if you can, then read the win out loud: Solo with placement as your phrasing tool.",
    "warmup": "Day 177. Warm the hands for what this day actually asks. Light preview — Play a long bend, sitting behind the beat on purpose.",
    "teach": "Let me put this simply: Placement turns a scale into a sentence. Long notes sit back; runs lean in; the change pulls you home. First win to aim at: Solo with placement as your phrasing tool. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Reps with intention for day 177 — Click Trust — Play Behind/On/Ahead (7). Start with: Play a long bend, sitting behind the beat on purpose. Then: Run up the scale slightly ahead, then pull it back. Mark the bar where you rush — that is the real drill.",
    "jam": "Jam: stop drilling, start saying something. Day 177 jam on Click Trust — Play Behind/On/Ahead (7) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 177. Session close. Win check: A solo phrase using placement — behind on bends, ahead on runs, center on changes."
  },
  "178": {
    "arrive": "Day 178. Settle in — shoulders soft, phone down: Put a dynamic arc on a full song section.",
    "warmup": "Day 178. Shake out, then touch today's material lightly. Light preview — Map the section: soft / build / peak / settle — foot stays on quarters the whole time.",
    "teach": "Before we grind reps: The arc is the song's heartbeat. Build where it needs to climb, spend it at the peak, rest at the end. First win to aim at: Put a dynamic arc on a full song section. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Practice loop time for day 178 — Dynamic Waves — Crescendo Strum (6). Start with: Map the section: soft / build / peak / settle — foot stays on quarters the whole time. Then: Play it through with dynamics only — if you rush, drop back to downstrokes only. Mark the bar where you rush — that is the real drill.",
    "jam": "Music time — put the lesson inside something that grooves. Day 178 jam on Dynamic Waves — Crescendo Strum (6) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 178. Wind down: one gentle sound, then the win question. Win check: A full section with a dynamic arc that peaks where the song wants it."
  },
  "179": {
    "arrive": "Day 179. Two minutes to show up fully: Play a full 12-bar form in 5/4.",
    "warmup": "Day 179. No hero warm-up — just honest prep. Light preview — Map 12 bars of 5/4 on paper: chord per bar, accent marked on paper: chord per bar, accent marked.",
    "teach": "Park the hands a second — idea first: Odd meter forms are the same forms with a different ruler. 12 bars of 5 is still a blues, just leaner. First win to aim at: Play a full 12-bar form in 5/4. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "Guided block — your drills, my pacing for day 179 — Odd Accent — 5/4 Taste (6). Start with: Map 12 bars of 5/4 on paper: chord per bar, accent marked on paper: chord per bar, accent marked. Then: Play the I chord, then IV, then V on their usual bars. Mark the bar where you rush — that is the real drill.",
    "jam": "Loose on purpose — still in time. Day 179 jam on Odd Accent — 5/4 Taste (6) — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 179. Cool-down — soft hands, honest check. Win check: A 12-bar 5/4 form with correct changes and a steady accent through every bar."
  },
  "180": {
    "arrive": "Day 180. Check posture, then lock the intention: Bridge rhythm into lead with one clean groove.",
    "warmup": "Day 180. Gentle start, then today's shapes. Light preview — Groove the 12-bar blues for 4 full passes, no stopping.",
    "teach": "This is the bit that unlocks the rest: Every lead you'll play sits on a groove. This checkpoint makes sure the floor is solid before you walk on it. First win to aim at: Bridge rhythm into lead with one clean groove. If the foot is not steady, the hands do not get a vote yet.",
    "guided": "This is the gym section for day 180 — Rhythm Checkpoint — Bridge Toward Lead. Start with: Groove the 12-bar blues for 4 full passes, no stopping. Then: Mark each chord change without dropping the pocket. Mark the bar where you rush — that is the real drill.",
    "jam": "This is the part you came for. Day 180 jam on Rhythm Checkpoint — Bridge Toward Lead — Pattern, space, pattern — silence is part of the groove.",
    "cooldown": "Day 180. Leave the guitar friendlier than you found it. Win check: 4 clean passes of the 12-bar groove with marked changes and one swell per chorus."
  },
  "181": {
    "arrive": "Day 181. You are here. That already counts. Intention next: Play a short call phrase in minor pentatonic.",
    "warmup": "Day 181. We wake the specific muscles you will need. Light preview — Three-note motif only for two minutes — change rhythm, not note count.",
    "teach": "Teacher hat on for a minute: Lead guitar is conversation: say something, leave space, answer. Minor pentatonic is enough vocabulary for a whole honest solo if rhythm... First win to aim at: Play a short call phrase in minor pentatonic. Leave air. One clear idea beats a blur of notes.",
    "guided": "Hands-on stretch for day 181 — Lead Phase Open — Say Something, Then Listen. Start with: Three-note motif only for two minutes — change rhythm, not note count. Then: Call two bars, rest two bars, answer two bars over a slow vamp. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Song-shaped minutes. Day 181 jam on Lead Phase Open — Say Something, Then Listen — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 181. Soft landing. Win check: Play eight bars that include intentional silence and a clear ending note."
  },
  "182": {
    "arrive": "Day 182. Land in the chair. One breath. Here is today's aim: Bend a whole step up to a named target pitch.",
    "warmup": "Day 182. Easy blood-flow first. Light preview — Fret the target note first and play it clean — end the phrase on a chord tone when you can.",
    "teach": "One clear idea today: A bend is a slide to a pitch you've already heard. If you can hum it, you can land it. Leave space; one clear target note beats a blur of... First win to aim at: Bend a whole step up to a named target pitch. Leave air. One clear idea beats a blur of notes.",
    "guided": "Slow enough that form stays honest for day 182 — Bends 101 — Target Pitch. Start with: Fret the target note first and play it clean — end the phrase on a chord tone when you can. Then: Bend up to that same pitch from a whole step below. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Let the hands make a little story. Day 182 jam on Bends 101 — Target Pitch — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 182. Ease out so tomorrow's hands forgive you. Win check: Bend a whole step and land on the exact pitch you played a second earlier."
  },
  "183": {
    "arrive": "Day 183. Arrive: tune if you can, then read the win out loud: Produce an even vibrato wave you could conduct with your hand.",
    "warmup": "Day 183. Warm the hands for what this day actually asks. Light preview — Long tone 4 beats with no vibrato — pure — end the phrase on a chord tone when you can.",
    "teach": "Think of it like this: Vibrato is controlled pitch oscillation. Even rate reads as intention; chaotic shake reads as tension. First win to aim at: Produce an even vibrato wave you could conduct with your hand. Leave air. One clear idea beats a blur of notes.",
    "guided": "We will work the list in order for day 183 — Vibrato — Controlled Wave. Start with: Long tone 4 beats with no vibrato — pure — end the phrase on a chord tone when you can. Then: Same tone with slow even vibrato for 4 beats — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Fun pass: same skills, less judgment. Day 183 jam on Vibrato — Controlled Wave — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 183. Session close. Win check: Hold a 4-beat note with even vibrato that stays centered on the intended pitch."
  },
  "184": {
    "arrive": "Day 184. Settle in — shoulders soft, phone down: Connect positions with slides that land in time.",
    "warmup": "Day 184. Shake out, then touch today's material lightly. Light preview — Slide into a target fret from 2 frets below on the beat.",
    "teach": "Here is the heart of it: Slides glue positions into one voice. Timed landings matter — a late slide is a rhythmic error, not only a pitch gesture. First win to aim at: Connect positions with slides that land in time. Leave air. One clear idea beats a blur of notes.",
    "guided": "Now we earn it with clean reps for day 184 — Slides — Connect Positions Musically. Start with: Slide into a target fret from 2 frets below on the beat. Then: Ascending slide phrase across 3 frets, descend with separate frets. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Play window — make it sound like a song fragment. Day 184 jam on Slides — Connect Positions Musically — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 184. Wind down: one gentle sound, then the win question. Win check: Play an 8-bar phrase where every slide lands on a chosen beat and target fret."
  },
  "185": {
    "arrive": "Day 185. Two minutes to show up fully: Hammer-ons and pull-offs speak as loud as picked notes.",
    "warmup": "Day 185. No hero warm-up — just honest prep. Light preview — Hammer 0→2→0 on one string slowly 60s — end the phrase on a chord tone when you can.",
    "teach": "Let me put this simply: Legato shifts timekeeping partly into the fretting hand. Even hammers/pulls need the same subdivision honesty as alternate picking. First win to aim at: Hammer-ons and pull-offs speak as loud as picked notes. Leave air. One clear idea beats a blur of notes.",
    "guided": "Reps with intention for day 185 — Hammer-ons & Pull-offs — Legato Seed. Start with: Hammer 0→2→0 on one string slowly 60s — end the phrase on a chord tone when you can. Then: Pull-off 3→1→0 with clear lower notes — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Jam: stop drilling, start saying something. Day 185 jam on Hammer-ons & Pull-offs — Legato Seed — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 185. Cool-down — soft hands, honest check. Win check: Loop a pick-hammer-pull cell for 8 bars in time with audible evenness."
  },
  "186": {
    "arrive": "Day 186. Check posture, then lock the intention: Fret two notes that ring together without one choking.",
    "warmup": "Day 186. Gentle start, then today's shapes. Light preview — Find a comfortable third shape on G/B strings; ring 4 beats.",
    "teach": "Before we grind reps: Double-stops are portable harmony. Thirds and fourths outline chord color with less bulk than full grips. First win to aim at: Fret two notes that ring together without one choking. Leave air. One clear idea beats a blur of notes.",
    "guided": "Practice loop time for day 186 — Double Stops — Two-Note Harmony. Start with: Find a comfortable third shape on G/B strings; ring 4 beats. Then: Move the shape up 2 frets in time — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Music time — put the lesson inside something that grooves. Day 186 jam on Double Stops — Two-Note Harmony — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 186. Leave the guitar friendlier than you found it. Win check: Play an 8-bar idea that features at least four clean double-stop hits in rhythm."
  },
  "187": {
    "arrive": "Day 187. You are here. That already counts. Intention next: Sing a short phrase, then play it (approximation welcome).",
    "warmup": "Day 187. We wake the specific muscles you will need. Light preview — Hum 1 bar, rest 1 bar — 4 cycles — end the phrase on a chord tone when you can.",
    "teach": "Park the hands a second — idea first: Voice-first phrasing fights finger patterns that don't mean anything. Even hummed contours improve melodic honesty. First win to aim at: Sing a short phrase, then play it (approximation welcome). Leave air. One clear idea beats a blur of notes.",
    "guided": "Guided block — your drills, my pacing for day 187 — Call From Vocals — Sing Then Solo. Start with: Hum 1 bar, rest 1 bar — 4 cycles — end the phrase on a chord tone when you can. Then: Play the contour on one string as close as you can. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Loose on purpose — still in time. Day 187 jam on Call From Vocals — Sing Then Solo — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 187. Soft landing. Win check: Show one phrase you can both hum and play with matching rhythm."
  },
  "188": {
    "arrive": "Day 188. Land in the chair. One breath. Here is today's aim: Keep pitch set stable while rhythm changes.",
    "warmup": "Day 188. Easy blood-flow first. Light preview — Write a simple 4-note motif you can hum back immediately.",
    "teach": "This is the bit that unlocks the rest: Motif development is classical and rock craft alike: same DNA, new clothes. Listeners track rhythm and contour more than note count. First win to aim at: Keep pitch set stable while rhythm changes. Leave air. One clear idea beats a blur of notes.",
    "guided": "This is the gym section for day 188 — Motif Development — Same Notes New Rhythms. Start with: Write a simple 4-note motif you can hum back immediately. Then: Play it in quarter notes, then eighths, then mixed. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "This is the part you came for. Day 188 jam on Motif Development — Same Notes New Rhythms — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 188. Ease out so tomorrow's hands forgive you. Win check: Present one motif in three rhythms and one sequence without losing recognizability."
  },
  "189": {
    "arrive": "Day 189. Arrive: tune if you can, then read the win out loud: Name chord tones 1–3–5 under a slow progression.",
    "warmup": "Day 189. Warm the hands for what this day actually asks. Light preview — On G–C–D, play only roots for 8 bars — end the phrase on a chord tone when you can.",
    "teach": "Teacher hat on for a minute: Targeting 3rds and 5ths makes solos sound 'inside' the harmony. Random pentatonic running ignores the chord of the moment. First win to aim at: Name chord tones 1–3–5 under a slow progression. Leave air. One clear idea beats a blur of notes.",
    "guided": "Hands-on stretch for day 189 — Targeting 3rds — Sweet Notes Over Chords. Start with: On G–C–D, play only roots for 8 bars — end the phrase on a chord tone when you can. Then: Only 3rds for 8 bars (find them) — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Song-shaped minutes. Day 189 jam on Targeting 3rds — Sweet Notes Over Chords — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 189. Session close. Win check: Over a 3-chord loop, end four consecutive phrases on a chord tone of the chord in force."
  },
  "190": {
    "arrive": "Day 190. Settle in — shoulders soft, phone down: Fret octave shapes cleanly with muted middle string.",
    "warmup": "Day 190. Shake out, then touch today's material lightly. Light preview — Build an octave shape on D/G or G/e strings; mute middle.",
    "teach": "One clear idea today: Octave melodies read as huge and simple. Mute the string between the octave frets to avoid clashing noise. First win to aim at: Fret octave shapes cleanly with muted middle string. Leave air. One clear idea beats a blur of notes.",
    "guided": "Slow enough that form stays honest for day 190 — Octave Melodies — Simple & Huge. Start with: Build an octave shape on D/G or G/e strings; mute middle. Then: Play a 3-note melody in octaves slowly — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Let the hands make a little story. Day 190 jam on Octave Melodies — Simple & Huge — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 190. Wind down: one gentle sound, then the win question. Win check: Play an 8-bar octave melody with clear muting and steady time."
  },
  "191": {
    "arrive": "Day 191. Two minutes to show up fully: Play the same lick whisper-soft and then boldly.",
    "warmup": "Day 191. No hero warm-up — just honest prep. Light preview — One lick pp for 4 bars, ff for 4 bars — end the phrase on a chord tone when you can.",
    "teach": "Think of it like this: Lead dynamics are storytelling. Identical pitches at one volume feel flat; arcs feel composed. Leave space; one clear target note beats a... First win to aim at: Play the same lick whisper-soft and then boldly. Leave air. One clear idea beats a blur of notes.",
    "guided": "We will work the list in order for day 191 — Dynamics in Lead — Whisper to Shout. Start with: One lick pp for 4 bars, ff for 4 bars — end the phrase on a chord tone when you can. Then: Crescendo across an 8-bar soloette — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Fun pass: same skills, less judgment. Day 191 jam on Dynamics in Lead — Whisper to Shout — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 191. Cool-down — soft hands, honest check. Win check: Play a 12-bar lead sketch with an obvious soft-loud-soft arc."
  },
  "192": {
    "arrive": "Day 192. Check posture, then lock the intention: Aim for about half the timeline silent in a practice solo.",
    "warmup": "Day 192. Gentle start, then today's shapes. Light preview — Solo rule: maximum 2 beats of notes per bar for 8 bars.",
    "teach": "Here is the heart of it: Space is a lead technique. Dense note streams often signal fear of silence more than musical abundance. First win to aim at: Aim for about half the timeline silent in a practice solo. Leave air. One clear idea beats a blur of notes.",
    "guided": "Now we earn it with clean reps for day 192 — Space Solo Challenge — 50% Silence. Start with: Solo rule: maximum 2 beats of notes per bar for 8 bars. Then: Call one bar, rest one bar — strict. The rest is part of the lick. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Play window — make it sound like a song fragment. Day 192 jam on Space Solo Challenge — 50% Silence — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 192. Leave the guitar friendlier than you found it. Win check: Deliver a 12-bar soloette that's roughly 50% silence and still feels intentional."
  },
  "193": {
    "arrive": "Day 193. You are here. That already counts. Intention next: Call a lick in bar 1–2 and answer in bar 3–4.",
    "warmup": "Day 193. We wake the specific muscles you will need. Light preview — Speak the 12-bar form while comping simply — end the phrase on a chord tone when you can.",
    "teach": "Let me put this simply: Blues lead is language over a known form. Form awareness beats scale-shape tourism. Leave space; one clear target note beats a blur of... First win to aim at: Call a lick in bar 1–2 and answer in bar 3–4. Leave air. One clear idea beats a blur of notes.",
    "guided": "Reps with intention for day 193 — Blues Language — Call Licks Over 12-Bar. Start with: Speak the 12-bar form while comping simply — end the phrase on a chord tone when you can. Then: Call-lick on the I chord, then answer still on I — leave space. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Jam: stop drilling, start saying something. Day 193 jam on Blues Language — Call Licks Over 12-Bar — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 193. Soft landing. Win check: Play one 12-bar chorus with two audible call-response pairs and clear IV/V awareness."
  },
  "194": {
    "arrive": "Day 194. Land in the chair. One breath. Here is today's aim: Favor major pentatonic color over minor blues default.",
    "warmup": "Day 194. Easy blood-flow first. Light preview — Map major pentatonic box relative to G — end the phrase on a chord tone when you can.",
    "teach": "Before we grind reps: Major-key lead needs major-side note choices. Minor pentatonic over major can work as blues, but intentional major color is a separate... First win to aim at: Favor major pentatonic color over minor blues default. Leave air. One clear idea beats a blur of notes.",
    "guided": "Practice loop time for day 194 — Major Key Lead — Happy Notes Over G. Start with: Map major pentatonic box relative to G — end the phrase on a chord tone when you can. Then: Play only major pent notes for 8 bars over G–C–D. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Music time — put the lesson inside something that grooves. Day 194 jam on Major Key Lead — Happy Notes Over G — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 194. Ease out so tomorrow's hands forgive you. Win check: Solo 8 bars in a clearly major color over a G progression without defaulting to blues box clichés the whole time."
  },
  "195": {
    "arrive": "Day 195. Arrive: tune if you can, then read the win out loud: Plan a beginning, middle, and end before you play.",
    "warmup": "Day 195. Warm the hands for what this day actually asks. Light preview — Write a 3-part plan: sparse / develop / peak — end the phrase on a chord tone when you can.",
    "teach": "Park the hands a second — idea first: A solo story budgets energy. Opening dense leaves nowhere to climb; opening simple lets the arc work. First win to aim at: Plan a beginning, middle, and end before you play. Leave air. One clear idea beats a blur of notes.",
    "guided": "Guided block — your drills, my pacing for day 195 — Lead Capstone — 24-Bar Story Solo. Start with: Write a 3-part plan: sparse / develop / peak — end the phrase on a chord tone when you can. Then: Play 8+8+8 bars following the plan over a vamp — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Loose on purpose — still in time. Day 195 jam on Lead Capstone — 24-Bar Story Solo — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 195. Session close. Win check: Play a 24-bar solo sketch with an obvious arc and a related ending motif."
  },
  "196": {
    "arrive": "Day 196. Settle in — shoulders soft, phone down: Move a 4-note cell up the scale in steps.",
    "warmup": "Day 196. Shake out, then touch today's material lightly. Light preview — Play a 4-note cell on one string set — end the phrase on a chord tone when you can.",
    "teach": "This is the bit that unlocks the rest: Sequences give a solo direction. The listener feels the climb coming before you arrive. Leave space; one clear target note beats a blur of... First win to aim at: Move a 4-note cell up the scale in steps. Leave air. One clear idea beats a blur of notes.",
    "guided": "This is the gym section for day 196 — Sequence Climb — Melodic Sequences Up. Start with: Play a 4-note cell on one string set — end the phrase on a chord tone when you can. Then: Repeat it one scale step higher, same rhythm — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "This is the part you came for. Day 196 jam on Sequence Climb — Melodic Sequences Up — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 196. Wind down: one gentle sound, then the win question. Win check: Climb a 4-note cell three times in rhythm and resolve to the root."
  },
  "197": {
    "arrive": "Day 197. Two minutes to show up fully: Map the Andalusian cadence by ear.",
    "warmup": "Day 197. No hero warm-up — just honest prep. Light preview — Loop Am–G–F–E and hum the root each bar — end the phrase on a chord tone when you can.",
    "teach": "Teacher hat on for a minute: The Andalusian cadence walks down Am–G–F–E — the E phrygian home. Each chord is a color; E is the answer. First win to aim at: Map the Andalusian cadence by ear. Leave air. One clear idea beats a blur of notes.",
    "guided": "Hands-on stretch for day 197 — Question Harmony — Solo Over Andalusian. Start with: Loop Am–G–F–E and hum the root each bar — end the phrase on a chord tone when you can. Then: Play one note per chord, landing on E — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Song-shaped minutes. Day 197 jam on Question Harmony — Solo Over Andalusian — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 197. Cool-down — soft hands, honest check. Win check: A full Andalusian pass where every phrase resolves into E."
  },
  "198": {
    "arrive": "Day 198. Check posture, then lock the intention: Skip strings with a single sweep, not a second stroke.",
    "warmup": "Day 198. Gentle start, then today's shapes. Light preview — Two strings apart: downstroke on string A, keep down onto string B.",
    "teach": "One clear idea today: Economy picking keeps the pick moving the same direction across a string skip — one motion, two notes. First win to aim at: Skip strings with a single sweep, not a second stroke. Leave air. One clear idea beats a blur of notes.",
    "guided": "Slow enough that form stays honest for day 198 — Economy Picking Seed. Start with: Two strings apart: downstroke on string A, keep down onto string B. Then: Play the pair slowly, no re-pick — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Let the hands make a little story. Day 198 jam on Economy Picking Seed — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 198. Leave the guitar friendlier than you found it. Win check: A three-string skip played with one continuous pick direction."
  },
  "199": {
    "arrive": "Day 199. You are here. That already counts. Intention next: Pluck with the middle finger while the pick plays.",
    "warmup": "Day 199. We wake the specific muscles you will need. Light preview — Pick a low note, pluck a high note with the middle finger.",
    "teach": "Think of it like this: Hybrid picking is a second hand inside one — the pick takes the bass, the fingers take the melody. Leave space; one clear target note beats... First win to aim at: Pluck with the middle finger while the pick plays. Leave air. One clear idea beats a blur of notes.",
    "guided": "We will work the list in order for day 199 — Hybrid Picking Taste. Start with: Pick a low note, pluck a high note with the middle finger. Then: Same rhythm pattern, two strings apart — watch the fretting gaps. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Fun pass: same skills, less judgment. Day 199 jam on Hybrid Picking Taste — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 199. Soft landing. Win check: A two-voice pattern where pick and middle finger play balanced notes together."
  },
  "200": {
    "arrive": "Day 200. Land in the chair. One breath. Here is today's aim: Take a 4-note melody from a public-domain song.",
    "warmup": "Day 200. Easy blood-flow first. Light preview — Pick 4 notes from a PD melody you already know — end the phrase on a chord tone when you can.",
    "teach": "Here is the heart of it: Songs are full of ready-made motifs. Borrow one, make it yours, and it becomes your voice too. Leave space; one clear target note beats a... First win to aim at: Take a 4-note melody from a public-domain song. Leave air. One clear idea beats a blur of notes.",
    "guided": "Now we earn it with clean reps for day 200 — Motif From a PD Song. Start with: Pick 4 notes from a PD melody you already know — end the phrase on a chord tone when you can. Then: Play them as a motif with your own rhythm, not the original. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Play window — make it sound like a song fragment. Day 200 jam on Motif From a PD Song — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 200. Ease out so tomorrow's hands forgive you. Win check: A 4-note song motif played as your own idea, repeated with one variation."
  },
  "201": {
    "arrive": "Day 201. Arrive: tune if you can, then read the win out loud: Assemble the week's lead tools into one take.",
    "warmup": "Day 201. Warm the hands for what this day actually asks. Light preview — Warm the week's lead material briefly, loose hands.",
    "teach": "Let me put this simply: Checkpoints collect the week into one honest take. The name of the game is assembly, not perfection. First win to aim at: Assemble the week's lead tools into one take. Leave air. One clear idea beats a blur of notes.",
    "guided": "Reps with intention for day 201 — Weekly Lead Checkpoint. Start with: Warm the week's lead material briefly, loose hands. Then: One take: space plus one expressive tool, no heroics. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Jam: stop drilling, start saying something. Day 201 jam on Weekly Lead Checkpoint — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 201. Session close. Win check: One lead take showing space plus one expressive tool, with a written keep and fix."
  },
  "202": {
    "arrive": "Day 202. Settle in — shoulders soft, phone down: Learn the release as its own move, not the bend's afterthought.",
    "warmup": "Day 202. Shake out, then touch today's material lightly. Light preview — Half-step pre-bend on the G string, release on beat 1.",
    "teach": "Before we grind reps: A bend lands you high; a pre-bend lands you low and arriving. Both are words in the same sentence. Leave space; one clear target note beats... First win to aim at: Learn the release as its own move, not the bend's afterthought. Leave air. One clear idea beats a blur of notes.",
    "guided": "Practice loop time for day 202 — Bend Vocabulary — Release & Pre-Bend. Start with: Half-step pre-bend on the G string, release on beat 1. Then: Trade: bend up, then pre-bend and release, four bars each. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Music time — put the lesson inside something that grooves. Day 202 jam on Bend Vocabulary — Release & Pre-Bend — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 202. Wind down: one gentle sound, then the win question. Win check: Land a pre-bend release clean, then trade bend vs release across two phrases."
  },
  "203": {
    "arrive": "Day 203. Two minutes to show up fully: Climb with a cell that changes direction.",
    "warmup": "Day 203. No hero warm-up — just honest prep. Light preview — Run the cell up three steps of the scale, even rhythm.",
    "teach": "Park the hands a second — idea first: What goes up must come down. A downward sequence lands with just as much pull. Leave space; one clear target note beats a blur of almosts. First win to aim at: Climb with a cell that changes direction. Leave air. One clear idea beats a blur of notes.",
    "guided": "Guided block — your drills, my pacing for day 203 — Sequence Climb — Melodic Sequences Up (2). Start with: Run the cell up three steps of the scale, even rhythm. Then: Then down three steps, same rhythm, no accent drift. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Loose on purpose — still in time. Day 203 jam on Sequence Climb — Melodic Sequences Up (2) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 203. Cool-down — soft hands, honest check. Win check: A cell that climbs three steps and descends three steps, resolving cleanly."
  },
  "204": {
    "arrive": "Day 204. Check posture, then lock the intention: Use Phrygian color over the E.",
    "warmup": "Day 204. Gentle start, then today's shapes. Light preview — Play E Phrygian phrases on the E bar only — end the phrase on a chord tone when you can.",
    "teach": "This is the bit that unlocks the rest: Phrygian's flat 2 makes E feel dark and tense. The F chord is the bright window in the dark room. Leave space; one clear target note beats... First win to aim at: Use Phrygian color over the E. Leave air. One clear idea beats a blur of notes.",
    "guided": "This is the gym section for day 204 — Question Harmony — Solo Over Andalusian (2). Start with: Play E Phrygian phrases on the E bar only — end the phrase on a chord tone when you can. Then: Switch to F-major-ish lines on the F bar — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "This is the part you came for. Day 204 jam on Question Harmony — Solo Over Andalusian (2) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 204. Leave the guitar friendlier than you found it. Win check: Two-bar color contrast: dark Phrygian on E, bright on F, resolving each time."
  },
  "205": {
    "arrive": "Day 205. You are here. That already counts. Intention next: Sweep a five-note pattern cleanly.",
    "warmup": "Day 205. We wake the specific muscles you will need. Light preview — Five-note shape across three strings, fretted cleanly.",
    "teach": "Teacher hat on for a minute: Sweeps are about economy of motion. Even notes matter more than fast notes. Leave space; one clear target note beats a blur of almosts. First win to aim at: Sweep a five-note pattern cleanly. Leave air. One clear idea beats a blur of notes.",
    "guided": "Hands-on stretch for day 205 — Economy Picking Seed (2). Start with: Five-note shape across three strings, fretted cleanly. Then: One pick direction only, metronome at a relaxed 60. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Song-shaped minutes. Day 205 jam on Economy Picking Seed (2) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 205. Soft landing. Win check: A five-note sweep at a tempo where every note still speaks."
  },
  "206": {
    "arrive": "Day 206. Land in the chair. One breath. Here is today's aim: Play a bass-pick and finger melody line.",
    "warmup": "Day 206. Easy blood-flow first. Light preview — Thumb on the low string, steady quarters — end the phrase on a chord tone when you can.",
    "teach": "One clear idea today: The thumb anchors the groove; the fingers float the melody. Let the thumb stay, let the fingers move. First win to aim at: Play a bass-pick and finger melody line. Leave air. One clear idea beats a blur of notes.",
    "guided": "Slow enough that form stays honest for day 206 — Hybrid Picking Taste (2). Start with: Thumb on the low string, steady quarters — end the phrase on a chord tone when you can. Then: Middle finger melody on the high strings — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Let the hands make a little story. Day 206 jam on Hybrid Picking Taste (2) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 206. Ease out so tomorrow's hands forgive you. Win check: An 8-bar loop with a steady thumb bass and a singing finger melody."
  },
  "207": {
    "arrive": "Day 207. Arrive: tune if you can, then read the win out loud: Use a ragtime motif from a public-domain tune.",
    "warmup": "Day 207. Warm the hands for what this day actually asks. Light preview — Learn the rag motif's rhythm first, clapping it — end the phrase on a chord tone when you can.",
    "teach": "Think of it like this: Ragtime motifs live on syncopation. The rhythm IS the character — keep it or it's a different song. Leave space; one clear target note... First win to aim at: Use a ragtime motif from a public-domain tune. Leave air. One clear idea beats a blur of notes.",
    "guided": "We will work the list in order for day 207 — Motif From a PD Song (2). Start with: Learn the rag motif's rhythm first, clapping it — end the phrase on a chord tone when you can. Then: Add the notes once the rhythm is solid — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Fun pass: same skills, less judgment. Day 207 jam on Motif From a PD Song (2) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 207. Session close. Win check: A syncopated rag motif quoted cleanly with the offbeats intact."
  },
  "208": {
    "arrive": "Day 208. Settle in — shoulders soft, phone down: Lead over a two-chord vamp.",
    "warmup": "Day 208. Shake out, then touch today's material lightly. Light preview — Two-chord vamp, steady rhythm, simple and solid — end the phrase on a chord tone when you can.",
    "teach": "Here is the heart of it: Vamps are safe rooms for soloing — the harmony repeats, so you can take risks and return. Leave space; one clear target note beats a blur... First win to aim at: Lead over a two-chord vamp. Leave air. One clear idea beats a blur of notes.",
    "guided": "Now we earn it with clean reps for day 208 — Weekly Lead Checkpoint (2). Start with: Two-chord vamp, steady rhythm, simple and solid — end the phrase on a chord tone when you can. Then: Solo with one tool only: vibrato, bend, or slide. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Play window — make it sound like a song fragment. Day 208 jam on Weekly Lead Checkpoint (2) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 208. Wind down: one gentle sound, then the win question. Win check: A vamp solo using one expressive tool, phrases landing on chord tones."
  },
  "209": {
    "arrive": "Day 209. Two minutes to show up fully: Add the pre-bend to your bend vocabulary.",
    "warmup": "Day 209. No hero warm-up — just honest prep. Light preview — Pre-bend a half step silently, release on beat 1.",
    "teach": "Let me put this simply: A pre-bend arrives from above — you're already bent when the note starts, then release down into it. First win to aim at: Add the pre-bend to your bend vocabulary. Leave air. One clear idea beats a blur of notes.",
    "guided": "Reps with intention for day 209 — Bend Vocabulary — Release & Pre-Bend (2). Start with: Pre-bend a half step silently, release on beat 1. Then: Match: play the lower note, then the release — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Jam: stop drilling, start saying something. Day 209 jam on Bend Vocabulary — Release & Pre-Bend (2) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 209. Cool-down — soft hands, honest check. Win check: A phrase where a pre-bend release arrives in tune on the beat."
  },
  "210": {
    "arrive": "Day 210. Check posture, then lock the intention: Sequence a cell across string sets.",
    "warmup": "Day 210. Gentle start, then today's shapes. Light preview — Cell on the G string, then B string — end the phrase on a chord tone when you can.",
    "teach": "Before we grind reps: The same cell on different strings is still one idea — the ear follows the shape, not the string. Leave space; one clear target note beats... First win to aim at: Sequence a cell across string sets. Leave air. One clear idea beats a blur of notes.",
    "guided": "Practice loop time for day 210 — Sequence Climb — Melodic Sequences Up (3). Start with: Cell on the G string, then B string — end the phrase on a chord tone when you can. Then: Repeat with identical picking direction — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Music time — put the lesson inside something that grooves. Day 210 jam on Sequence Climb — Melodic Sequences Up (3) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 210. Leave the guitar friendlier than you found it. Win check: A cell that climbs across two string sets without breaking the rhythm."
  },
  "211": {
    "arrive": "Day 211. You are here. That already counts. Intention next: Answer each chord with its own chord tone.",
    "warmup": "Day 211. We wake the specific muscles you will need. Light preview — Find the 3rd of Am, G, F, and E on the neck and land each clean.",
    "teach": "Park the hands a second — idea first: In E phrygian, the 3rd of each chord is its personality — hit it on the downbeat and the line sounds like harmony, not scales. First win to aim at: Answer each chord with its own chord tone. Leave air. One clear idea beats a blur of notes.",
    "guided": "Guided block — your drills, my pacing for day 211 — Question Harmony — Solo Over Andalusian (3). Start with: Find the 3rd of Am, G, F, and E on the neck and land each clean. Then: End each phrase on the next chord's 3rd — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Loose on purpose — still in time. Day 211 jam on Question Harmony — Solo Over Andalusian (3) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 211. Soft landing. Win check: A full cadence pass where every phrase lands on the next chord's 3rd."
  },
  "212": {
    "arrive": "Day 212. Land in the chair. One breath. Here is today's aim: Mix sweep strokes with alternate picking.",
    "warmup": "Day 212. Easy blood-flow first. Light preview — Two notes on one string: alternate picking, even volume.",
    "teach": "This is the bit that unlocks the rest: Real playing mixes both. Alternate when the line stays on a string, sweep when it skips. Leave space; one clear target note beats a blur of... First win to aim at: Mix sweep strokes with alternate picking. Leave air. One clear idea beats a blur of notes.",
    "guided": "This is the gym section for day 212 — Economy Picking Seed (3). Start with: Two notes on one string: alternate picking, even volume. Then: Then skip a string for a small sweep, keep it controlled. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "This is the part you came for. Day 212 jam on Economy Picking Seed (3) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 212. Ease out so tomorrow's hands forgive you. Win check: A 6-note line where the pick changes technique without changing tone."
  },
  "213": {
    "arrive": "Day 213. Arrive: tune if you can, then read the win out loud: Use ring finger too, for three-note groups.",
    "warmup": "Day 213. Warm the hands for what this day actually asks. Light preview — Pick a bass note, add middle and ring together — end the phrase on a chord tone when you can.",
    "teach": "Teacher hat on for a minute: Three fingers plus the pick is a mini piano. Spread the notes and they sound like a chord. Leave space; one clear target note beats a blur... First win to aim at: Use ring finger too, for three-note groups. Leave air. One clear idea beats a blur of notes.",
    "guided": "Hands-on stretch for day 213 — Hybrid Picking Taste (3). Start with: Pick a bass note, add middle and ring together — end the phrase on a chord tone when you can. Then: Strum-roll the three into one chord shape — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Song-shaped minutes. Day 213 jam on Hybrid Picking Taste (3) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 213. Session close. Win check: A three-note hybrid group that rings together like one chord."
  },
  "214": {
    "arrive": "Day 214. Settle in — shoulders soft, phone down: Transform a song motif into a different mood.",
    "warmup": "Day 214. Shake out, then touch today's material lightly. Light preview — Take your owned motif and slow it down to half speed.",
    "teach": "One clear idea today: Same contour, new rhythm, new mood. That's how motifs become personal vocabulary. Leave space; one clear target note beats a blur of... First win to aim at: Transform a song motif into a different mood. Leave air. One clear idea beats a blur of notes.",
    "guided": "Slow enough that form stays honest for day 214 — Motif From a PD Song (3). Start with: Take your owned motif and slow it down to half speed. Then: Play it with a dotted rhythm, same notes — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Let the hands make a little story. Day 214 jam on Motif From a PD Song (3) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 214. Wind down: one gentle sound, then the win question. Win check: The same motif in two moods, one of them clearly yours."
  },
  "215": {
    "arrive": "Day 215. Two minutes to show up fully: Lead with dynamics, not just notes.",
    "warmup": "Day 215. No hero warm-up — just honest prep. Light preview — One phrase quiet, one phrase loud, same notes — end the phrase on a chord tone when you can.",
    "teach": "Think of it like this: Volume is a lead tool like any other. A quiet line makes the loud one mean more. Leave space; one clear target note beats a blur of almosts. First win to aim at: Lead with dynamics, not just notes. Leave air. One clear idea beats a blur of notes.",
    "guided": "We will work the list in order for day 215 — Weekly Lead Checkpoint (3). Start with: One phrase quiet, one phrase loud, same notes — end the phrase on a chord tone when you can. Then: Alternate quiet and loud for four full phrases — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Fun pass: same skills, less judgment. Day 215 jam on Weekly Lead Checkpoint (3) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 215. Cool-down — soft hands, honest check. Win check: A lead take with clear quiet-to-loud contrast and steady tempo."
  },
  "216": {
    "arrive": "Day 216. Check posture, then lock the intention: Use release bends at phrase endings.",
    "warmup": "Day 216. Gentle start, then today's shapes. Light preview — End a phrase with a held bend, sustain it out — end the phrase on a chord tone when you can.",
    "teach": "Here is the heart of it: A release at the end of a phrase is a period — the line finishes by settling down. Leave space; one clear target note beats a blur of... First win to aim at: Use release bends at phrase endings. Leave air. One clear idea beats a blur of notes.",
    "guided": "Now we earn it with clean reps for day 216 — Bend Vocabulary — Release & Pre-Bend (3). Start with: End a phrase with a held bend, sustain it out — end the phrase on a chord tone when you can. Then: Release it on beat 1 of the next bar, controlled. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Play window — make it sound like a song fragment. Day 216 jam on Bend Vocabulary — Release & Pre-Bend (3) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 216. Leave the guitar friendlier than you found it. Win check: Three phrases, each ending with an in-time release."
  },
  "217": {
    "arrive": "Day 217. You are here. That already counts. Intention next: Sequence with a chromatic leading tone.",
    "warmup": "Day 217. We wake the specific muscles you will need. Light preview — Cell ending on a half-step below the next root — end the phrase on a chord tone when you can.",
    "teach": "Let me put this simply: A half-step approach note makes a sequence feel inevitable — it points at where you're going. Leave space; one clear target note beats a... First win to aim at: Sequence with a chromatic leading tone. Leave air. One clear idea beats a blur of notes.",
    "guided": "Reps with intention for day 217 — Sequence Climb — Melodic Sequences Up (4). Start with: Cell ending on a half-step below the next root — end the phrase on a chord tone when you can. Then: Feel the tension as it approaches — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Jam: stop drilling, start saying something. Day 217 jam on Sequence Climb — Melodic Sequences Up (4) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 217. Soft landing. Win check: A chromatic-tinted sequence that lands on a clear long tone."
  },
  "218": {
    "arrive": "Day 218. Land in the chair. One breath. Here is today's aim: Approach each chord tone from a half step below.",
    "warmup": "Day 218. Easy blood-flow first. Light preview — Pick a target chord tone to land on each bar — end the phrase on a chord tone when you can.",
    "teach": "Before we grind reps: A half-step approach makes a landing sing — phrygian loves leaning into E. Aim the tension note, then resolve like you meant it. First win to aim at: Approach each chord tone from a half step below. Leave air. One clear idea beats a blur of notes.",
    "guided": "Practice loop time for day 218 — Question Harmony — Solo Over Andalusian (4). Start with: Pick a target chord tone to land on each bar — end the phrase on a chord tone when you can. Then: Approach it from the note a half step below — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Music time — put the lesson inside something that grooves. Day 218 jam on Question Harmony — Solo Over Andalusian (4) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 218. Ease out so tomorrow's hands forgive you. Win check: A cadence pass where every chord tone is approached from below."
  },
  "219": {
    "arrive": "Day 219. Arrive: tune if you can, then read the win out loud: Sweep an arpeggio shape.",
    "warmup": "Day 219. Warm the hands for what this day actually asks. Light preview — Major arpeggio shape across three strings, mapped first.",
    "teach": "Park the hands a second — idea first: Arpeggios are the natural home of the sweep — the shape was made for one fluid stroke. Leave space; one clear target note beats a blur of... First win to aim at: Sweep an arpeggio shape. Leave air. One clear idea beats a blur of notes.",
    "guided": "Guided block — your drills, my pacing for day 219 — Economy Picking Seed (4). Start with: Major arpeggio shape across three strings, mapped first. Then: One sweep up and one sweep down, slow and even — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Loose on purpose — still in time. Day 219 jam on Economy Picking Seed (4) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 219. Session close. Win check: A three-string arpeggio sweep with every note audible and a clear root landing."
  },
  "220": {
    "arrive": "Day 220. Settle in — shoulders soft, phone down: Roll a hybrid chord arpeggio.",
    "warmup": "Day 220. Shake out, then touch today's material lightly. Light preview — Pick bass, then roll middle and ring — end the phrase on a chord tone when you can.",
    "teach": "This is the bit that unlocks the rest: A hybrid roll is a chord broken into a tiny melody — spread it and it breathes. Leave space; one clear target note beats a blur of almosts. First win to aim at: Roll a hybrid chord arpeggio. Leave air. One clear idea beats a blur of notes.",
    "guided": "This is the gym section for day 220 — Hybrid Picking Taste (4). Start with: Pick bass, then roll middle and ring — end the phrase on a chord tone when you can. Then: Spread the three notes across half a beat each — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "This is the part you came for. Day 220 jam on Hybrid Picking Taste (4) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 220. Wind down: one gentle sound, then the win question. Win check: An even three-note hybrid roll repeated cleanly on two chord shapes."
  },
  "221": {
    "arrive": "Day 221. Two minutes to show up fully: Quote a folk melody motif over a vamp.",
    "warmup": "Day 221. No hero warm-up — just honest prep. Light preview — Vamp two chords steadily, no ornament yet — end the phrase on a chord tone when you can.",
    "teach": "Teacher hat on for a minute: A quote is a wink — say a public-domain fragment once, briefly, then go back to your own story so it feels clever, not copied. First win to aim at: Quote a folk melody motif over a vamp. Leave air. One clear idea beats a blur of notes.",
    "guided": "Hands-on stretch for day 221 — Motif From a PD Song (4). Start with: Vamp two chords steadily, no ornament yet — end the phrase on a chord tone when you can. Then: Insert the 4-note quote on the second bar of the loop. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Song-shaped minutes. Day 221 jam on Motif From a PD Song (4) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 221. Cool-down — soft hands, honest check. Win check: A brief recognizable quote inside a vamp that returns to your own line."
  },
  "222": {
    "arrive": "Day 222. Check posture, then lock the intention: Recover from a mistake mid-solo.",
    "warmup": "Day 222. Gentle start, then today's shapes. Light preview — Start a take; when you flub, keep the groove moving.",
    "teach": "One clear idea today: Recovery is a performance skill: the audience hears the recovery, not the mistake — if you keep going. First win to aim at: Recover from a mistake mid-solo. Leave air. One clear idea beats a blur of notes.",
    "guided": "Slow enough that form stays honest for day 222 — Weekly Lead Checkpoint (4). Start with: Start a take; when you flub, keep the groove moving. Then: Repeat the phrase from the next chord, don't reset. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Let the hands make a little story. Day 222 jam on Weekly Lead Checkpoint (4) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 222. Leave the guitar friendlier than you found it. Win check: A full lead take with one recovered mistake and no stopping."
  },
  "223": {
    "arrive": "Day 223. You are here. That already counts. Intention next: Chain a bend into a slide for one long gesture.",
    "warmup": "Day 223. We wake the specific muscles you will need. Light preview — Bend up, then slide to a higher fret without stopping.",
    "teach": "Think of it like this: Bend then slide is one continuous line — the pitch moves twice without a new attack. Leave space; one clear target note beats a blur of... First win to aim at: Chain a bend into a slide for one long gesture. Leave air. One clear idea beats a blur of notes.",
    "guided": "We will work the list in order for day 223 — Bend Vocabulary — Release & Pre-Bend (4). Start with: Bend up, then slide to a higher fret without stopping. Then: Keep the sound continuous, no re-pick between moves. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Fun pass: same skills, less judgment. Day 223 jam on Bend Vocabulary — Release & Pre-Bend (4) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 223. Soft landing. Win check: A bend-to-slide gesture that stays continuous and lands on a chord tone."
  },
  "224": {
    "arrive": "Day 224. Land in the chair. One breath. Here is today's aim: Sequence in a different rhythm than straight eighths.",
    "warmup": "Day 224. Easy blood-flow first. Light preview — Play the cell as dotted rhythm, crisp and even — end the phrase on a chord tone when you can.",
    "teach": "Here is the heart of it: Rhythm is what makes a sequence yours. Same notes, new rhythm, different story. Leave space; one clear target note beats a blur of almosts. First win to aim at: Sequence in a different rhythm than straight eighths. Leave air. One clear idea beats a blur of notes.",
    "guided": "Now we earn it with clean reps for day 224 — Sequence Climb — Melodic Sequences Up (5). Start with: Play the cell as dotted rhythm, crisp and even — end the phrase on a chord tone when you can. Then: Then as triplet rhythm, same four notes — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Play window — make it sound like a song fragment. Day 224 jam on Sequence Climb — Melodic Sequences Up (5) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 224. Ease out so tomorrow's hands forgive you. Win check: The same cell climbed in a new rhythm, recognizable and in time."
  },
  "225": {
    "arrive": "Day 225. Arrive: tune if you can, then read the win out loud: Use rests to let each chord speak.",
    "warmup": "Day 225. Warm the hands for what this day actually asks. Light preview — Play one note, then rest a full bar of silence — end the phrase on a chord tone when you can.",
    "teach": "Let me put this simply: The Andalusian cadence moves on its own — let phrygian color ride the chords. Do not force extra notes where the harmony already pulls. First win to aim at: Use rests to let each chord speak. Leave air. One clear idea beats a blur of notes.",
    "guided": "Reps with intention for day 225 — Question Harmony — Solo Over Andalusian (5). Start with: Play one note, then rest a full bar of silence — end the phrase on a chord tone when you can. Then: Only play on the F and E bars, leave the rest empty. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Jam: stop drilling, start saying something. Day 225 jam on Question Harmony — Solo Over Andalusian (5) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 225. Session close. Win check: A spacious cadence pass where rests do half the talking."
  },
  "226": {
    "arrive": "Day 226. Settle in — shoulders soft, phone down: Sweep inside a scale run.",
    "warmup": "Day 226. Shake out, then touch today's material lightly. Light preview — Scale run with one sweep on a string skip — end the phrase on a chord tone when you can.",
    "teach": "Before we grind reps: A sweep inside a run is a shortcut, not a showpiece — the line keeps moving through it. Leave space; one clear target note beats a blur of... First win to aim at: Sweep inside a scale run. Leave air. One clear idea beats a blur of notes.",
    "guided": "Practice loop time for day 226 — Economy Picking Seed (5). Start with: Scale run with one sweep on a string skip — end the phrase on a chord tone when you can. Then: Keep the rest of the line alternate-picked and even. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Music time — put the lesson inside something that grooves. Day 226 jam on Economy Picking Seed (5) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 226. Wind down: one gentle sound, then the win question. Win check: A scale run that contains one clean sweep without slowing the line."
  },
  "227": {
    "arrive": "Day 227. Two minutes to show up fully: Add hybrid color to a two-chord progression.",
    "warmup": "Day 227. No hero warm-up — just honest prep. Light preview — Two-chord loop, thumb playing steady bass notes — end the phrase on a chord tone when you can.",
    "teach": "Park the hands a second — idea first: Hybrid texture over simple chords is instant arrangement — same changes, richer sound. Leave space; one clear target note beats a blur of... First win to aim at: Add hybrid color to a two-chord progression. Leave air. One clear idea beats a blur of notes.",
    "guided": "Guided block — your drills, my pacing for day 227 — Hybrid Picking Taste (5). Start with: Two-chord loop, thumb playing steady bass notes — end the phrase on a chord tone when you can. Then: Add finger melody on the second chord only — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Loose on purpose — still in time. Day 227 jam on Hybrid Picking Taste (5) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 227. Cool-down — soft hands, honest check. Win check: A two-chord progression colored with hybrid texture, changes still clean."
  },
  "228": {
    "arrive": "Day 228. Check posture, then lock the intention: Develop the motif across four bars.",
    "warmup": "Day 228. Gentle start, then today's shapes. Light preview — Bar 1: play the motif exactly as you learned it — end the phrase on a chord tone when you can.",
    "teach": "This is the bit that unlocks the rest: Development is showing the motif in new light — sequence, mirror, or stretch, but keep the DNA. Leave space; one clear target note beats a... First win to aim at: Develop the motif across four bars. Leave air. One clear idea beats a blur of notes.",
    "guided": "This is the gym section for day 228 — Motif From a PD Song (5). Start with: Bar 1: play the motif exactly as you learned it — end the phrase on a chord tone when you can. Then: Bar 2: sequence it up a step, same rhythm — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "This is the part you came for. Day 228 jam on Motif From a PD Song (5) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 228. Leave the guitar friendlier than you found it. Win check: A four-bar development where the motif is recognizable in every bar."
  },
  "229": {
    "arrive": "Day 229. You are here. That already counts. Intention next: Lead with a clear phrase shape.",
    "warmup": "Day 229. We wake the specific muscles you will need. Light preview — Plan a 4-bar phrase: low start, rise, land — end the phrase on a chord tone when you can.",
    "teach": "Teacher hat on for a minute: A phrase with a shape is a sentence: it starts somewhere, rises, and lands. Listeners feel that arc. First win to aim at: Lead with a clear phrase shape. Leave air. One clear idea beats a blur of notes.",
    "guided": "Hands-on stretch for day 229 — Weekly Lead Checkpoint (5). Start with: Plan a 4-bar phrase: low start, rise, land — end the phrase on a chord tone when you can. Then: Play the line with the chord shape still in your mind's eye. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Song-shaped minutes. Day 229 jam on Weekly Lead Checkpoint (5) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 229. Soft landing. Win check: A four-bar phrase with an audible start-peak-land shape."
  },
  "230": {
    "arrive": "Day 230. Land in the chair. One breath. Here is today's aim: Play bend-and-release pairs in rhythm.",
    "warmup": "Day 230. Easy blood-flow first. Light preview — Bend up on the &, release on beat 1, in time — end the phrase on a chord tone when you can.",
    "teach": "One clear idea today: A bend-release pair is a two-note rhythm figure — it has to groove, not just sound. Leave space; one clear target note beats a blur of... First win to aim at: Play bend-and-release pairs in rhythm. Leave air. One clear idea beats a blur of notes.",
    "guided": "Slow enough that form stays honest for day 230 — Bend Vocabulary — Release & Pre-Bend (5). Start with: Bend up on the &, release on beat 1, in time — end the phrase on a chord tone when you can. Then: Repeat the bend-release pair for four bars — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Let the hands make a little story. Day 230 jam on Bend Vocabulary — Release & Pre-Bend (5) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 230. Ease out so tomorrow's hands forgive you. Win check: Four bars of in-time bend-release pairs, both notes in tune."
  },
  "231": {
    "arrive": "Day 231. Arrive: tune if you can, then read the win out loud: Sequence with dynamics that rise with the pitch.",
    "warmup": "Day 231. Warm the hands for what this day actually asks. Light preview — Climb the cell three steps, crescendo with each step.",
    "teach": "Think of it like this: Pitch and volume together tell the whole story. A climb that grows is a climb that lands. Leave space; one clear target note beats a blur... First win to aim at: Sequence with dynamics that rise with the pitch. Leave air. One clear idea beats a blur of notes.",
    "guided": "We will work the list in order for day 231 — Sequence Climb — Melodic Sequences Up (6). Start with: Climb the cell three steps, crescendo with each step. Then: Peak on the target tone, then hold the energy — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Fun pass: same skills, less judgment. Day 231 jam on Sequence Climb — Melodic Sequences Up (6) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 231. Session close. Win check: A three-step sequence that swells to a loud target and settles quietly."
  },
  "232": {
    "arrive": "Day 232. Settle in — shoulders soft, phone down: Extend the Andalusian line across two full cycles.",
    "warmup": "Day 232. Shake out, then touch today's material lightly. Light preview — First cycle: end open, leave it hanging — end the phrase on a chord tone when you can.",
    "teach": "Here is the heart of it: Two cycles make a sentence in E phrygian: the first asks, the second answers. Leave space; one clear target note beats a blur of almosts. First win to aim at: Extend the Andalusian line across two full cycles. Leave air. One clear idea beats a blur of notes.",
    "guided": "Now we earn it with clean reps for day 232 — Question Harmony — Solo Over Andalusian (6). Start with: First cycle: end open, leave it hanging — end the phrase on a chord tone when you can. Then: Second cycle: answer and resolve to E — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Play window — make it sound like a song fragment. Day 232 jam on Question Harmony — Solo Over Andalusian (6) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 232. Wind down: one gentle sound, then the win question. Win check: A two-cycle Andalusian sentence with an open question and a closed answer."
  },
  "233": {
    "arrive": "Day 233. Two minutes to show up fully: Sweep in both directions fluently.",
    "warmup": "Day 233. No hero warm-up — just honest prep. Light preview — Down-sweep the arpeggio, letting each note ring — end the phrase on a chord tone when you can.",
    "teach": "Let me put this simply: Up-sweeps are usually the weak side of economy picking. Practice the direction you avoid until both ways feel equally honest. First win to aim at: Sweep in both directions fluently. Leave air. One clear idea beats a blur of notes.",
    "guided": "Reps with intention for day 233 — Economy Picking Seed (6). Start with: Down-sweep the arpeggio, letting each note ring — end the phrase on a chord tone when you can. Then: Up-sweep it back, same even spacing — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Jam: stop drilling, start saying something. Day 233 jam on Economy Picking Seed (6) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 233. Cool-down — soft hands, honest check. Win check: An arpeggio swept both directions with equal tone."
  },
  "234": {
    "arrive": "Day 234. Check posture, then lock the intention: Play hybrid lines in a higher register.",
    "warmup": "Day 234. Gentle start, then today's shapes. Light preview — Low thumb bass with a high finger melody on top — end the phrase on a chord tone when you can.",
    "teach": "Before we grind reps: High melody over low bass is the classic hybrid voice — two instruments from one guitar. Leave space; one clear target note beats a blur of... First win to aim at: Play hybrid lines in a higher register. Leave air. One clear idea beats a blur of notes.",
    "guided": "Practice loop time for day 234 — Hybrid Picking Taste (6). Start with: Low thumb bass with a high finger melody on top — end the phrase on a chord tone when you can. Then: Jump the melody an octave up, keep the bass put — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Music time — put the lesson inside something that grooves. Day 234 jam on Hybrid Picking Taste (6) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 234. Leave the guitar friendlier than you found it. Win check: A hybrid line that spans a wide register with a steady low anchor."
  },
  "235": {
    "arrive": "Day 235. You are here. That already counts. Intention next: Build a call-and-response solo from a motif.",
    "warmup": "Day 235. We wake the specific muscles you will need. Light preview — Call: play the motif, one bar long — end the phrase on a chord tone when you can.",
    "teach": "Park the hands a second — idea first: Call and response turns a motif into dialogue — the same idea answered by a different voice. Leave space; one clear target note beats a... First win to aim at: Build a call-and-response solo from a motif. Leave air. One clear idea beats a blur of notes.",
    "guided": "Guided block — your drills, my pacing for day 235 — Motif From a PD Song (6). Start with: Call: play the motif, one bar long — end the phrase on a chord tone when you can. Then: Answer: play a variation, one bar long — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Loose on purpose — still in time. Day 235 jam on Motif From a PD Song (6) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 235. Soft landing. Win check: A four-bar call-and-response built from one motif."
  },
  "236": {
    "arrive": "Day 236. Land in the chair. One breath. Here is today's aim: Solo over a longer form without losing direction.",
    "warmup": "Day 236. Easy blood-flow first. Light preview — Play the full form once with chord-tone landings.",
    "teach": "This is the bit that unlocks the rest: Longer forms need landmarks. Return to chord tones at the changes and the solo always knows where it is. First win to aim at: Solo over a longer form without losing direction. Leave air. One clear idea beats a blur of notes.",
    "guided": "This is the gym section for day 236 — Weekly Lead Checkpoint (6). Start with: Play the full form once with chord-tone landings. Then: Add one new idea per section, don't overfill — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "This is the part you came for. Day 236 jam on Weekly Lead Checkpoint (6) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 236. Ease out so tomorrow's hands forgive you. Win check: A full-form solo with root landings at the turnarounds and one idea per section."
  },
  "237": {
    "arrive": "Day 237. Arrive: tune if you can, then read the win out loud: Use pre-bends to start a phrase silently.",
    "warmup": "Day 237. Warm the hands for what this day actually asks. Light preview — Pre-bend silently, start the phrase on the release.",
    "teach": "Teacher hat on for a minute: Opening on a pre-bend is a dramatic entrance — the note is already in motion when we hear it. Leave space; one clear target note beats a... First win to aim at: Use pre-bends to start a phrase silently. Leave air. One clear idea beats a blur of notes.",
    "guided": "Hands-on stretch for day 237 — Bend Vocabulary — Release & Pre-Bend (6). Start with: Pre-bend silently, start the phrase on the release. Then: Let the release be the phrase's first note — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Song-shaped minutes. Day 237 jam on Bend Vocabulary — Release & Pre-Bend (6) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 237. Session close. Win check: A phrase that opens on a pre-bend release, sounding planned and in tune."
  },
  "238": {
    "arrive": "Day 238. Settle in — shoulders soft, phone down: Sequence a cell in a new position on the neck.",
    "warmup": "Day 238. Shake out, then touch today's material lightly. Light preview — Climb the cell in the low position, even rhythm — end the phrase on a chord tone when you can.",
    "teach": "One clear idea today: The same sequence in a new position is a new color. Register changes the mood of the same idea. Leave space; one clear target note beats a... First win to aim at: Sequence a cell in a new position on the neck. Leave air. One clear idea beats a blur of notes.",
    "guided": "Slow enough that form stays honest for day 238 — Sequence Climb — Melodic Sequences Up (7). Start with: Climb the cell in the low position, even rhythm — end the phrase on a chord tone when you can. Then: Jump to the higher position, same shape, same feel. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Let the hands make a little story. Day 238 jam on Sequence Climb — Melodic Sequences Up (7) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 238. Wind down: one gentle sound, then the win question. Win check: The same cell climbed in two neck positions, connected without a stop."
  },
  "239": {
    "arrive": "Day 239. Two minutes to show up fully: Improvise inside the cadence with one small motif.",
    "warmup": "Day 239. No hero warm-up — just honest prep. Light preview — Invent a 3-note motif on Am, simple and singable.",
    "teach": "Think of it like this: A single motif through changing harmony — the phrygian color shifts underneath Leave space; one clear target note beats a blur of almosts. First win to aim at: Improvise inside the cadence with one small motif. Leave air. One clear idea beats a blur of notes.",
    "guided": "We will work the list in order for day 239 — Question Harmony — Solo Over Andalusian (7). Start with: Invent a 3-note motif on Am, simple and singable. Then: Transpose it over G, F, and E chords, same shape. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Fun pass: same skills, less judgment. Day 239 jam on Question Harmony — Solo Over Andalusian (7) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 239. Cool-down — soft hands, honest check. Win check: One motif carried through the whole cadence, recognizable on every chord."
  },
  "240": {
    "arrive": "Day 240. Check posture, then lock the intention: Sweep a minor arpeggio shape.",
    "warmup": "Day 240. Gentle start, then today's shapes. Light preview — Minor arpeggio across three strings, mapped cleanly.",
    "teach": "Here is the heart of it: Minor arpeggios sweep with a different weight — the flat 3rd changes the whole feel. Leave space; one clear target note beats a blur of... First win to aim at: Sweep a minor arpeggio shape. Leave air. One clear idea beats a blur of notes.",
    "guided": "Now we earn it with clean reps for day 240 — Economy Picking Seed (7). Start with: Minor arpeggio across three strings, mapped cleanly. Then: Sweep up and hold the flat 3rd for color — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Play window — make it sound like a song fragment. Day 240 jam on Economy Picking Seed (7) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 240. Leave the guitar friendlier than you found it. Win check: A minor arpeggio sweep that clearly colors the phrase and lands on its root."
  },
  "241": {
    "arrive": "Day 241. You are here. That already counts. Intention next: Combine hybrid picking with a strum.",
    "warmup": "Day 241. We wake the specific muscles you will need. Light preview — Hybrid pattern for four bars, thumb and fingers clear.",
    "teach": "Let me put this simply: Hybrid for the melody, strum for the hit — the switch is a dynamic move, not a gear change. Leave space; one clear target note beats a blur... First win to aim at: Combine hybrid picking with a strum. Leave air. One clear idea beats a blur of notes.",
    "guided": "Reps with intention for day 241 — Hybrid Picking Taste (7). Start with: Hybrid pattern for four bars, thumb and fingers clear. Then: Full strum for one bar as a contrast color — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Jam: stop drilling, start saying something. Day 241 jam on Hybrid Picking Taste (7) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 241. Soft landing. Win check: A hybrid-to-strum switch repeated with no gap in the groove."
  },
  "242": {
    "arrive": "Day 242. Land in the chair. One breath. Here is today's aim: Use a motif from a traditional tune over a drone.",
    "warmup": "Day 242. Easy blood-flow first. Light preview — Hold a drone on the low strings, open and ringing.",
    "teach": "Before we grind reps: A drone makes any motif feel ancient and modal — the harmony stands still while the idea moves. Leave space; one clear target note beats a... First win to aim at: Use a motif from a traditional tune over a drone. Leave air. One clear idea beats a blur of notes.",
    "guided": "Practice loop time for day 242 — Motif From a PD Song (7). Start with: Hold a drone on the low strings, open and ringing. Then: Play the motif above it, keeping the drone alive. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Music time — put the lesson inside something that grooves. Day 242 jam on Motif From a PD Song (7) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 242. Ease out so tomorrow's hands forgive you. Win check: A motif played over a steady drone with the drone never wavering."
  },
  "243": {
    "arrive": "Day 243. Arrive: tune if you can, then read the win out loud: Solo with a modal color you rarely use.",
    "warmup": "Day 243. Warm the hands for what this day actually asks. Light preview — Pick a mode and map where its root sits — end the phrase on a chord tone when you can.",
    "teach": "Park the hands a second — idea first: A modal color is a mood license — stay in the mode and the whole solo sounds intentional. Leave space; one clear target note beats a blur... First win to aim at: Solo with a modal color you rarely use. Leave air. One clear idea beats a blur of notes.",
    "guided": "Guided block — your drills, my pacing for day 243 — Weekly Lead Checkpoint (7). Start with: Pick a mode and map where its root sits — end the phrase on a chord tone when you can. Then: Phrase only inside the mode, no outside notes yet. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Loose on purpose — still in time. Day 243 jam on Weekly Lead Checkpoint (7) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 243. Session close. Win check: A modal solo that keeps one color and resolves to its root."
  },
  "244": {
    "arrive": "Day 244. Settle in — shoulders soft, phone down: Combine bends with vibrato on the held note.",
    "warmup": "Day 244. Shake out, then touch today's material lightly. Light preview — Bend a whole step up to pitch, ear-checked — end the phrase on a chord tone when you can.",
    "teach": "This is the bit that unlocks the rest: Bend to pitch first, vibrato second — the wave sits on a stable note, not a wobbling one. Leave space; one clear target note beats a blur... First win to aim at: Combine bends with vibrato on the held note. Leave air. One clear idea beats a blur of notes.",
    "guided": "This is the gym section for day 244 — Bend Vocabulary — Release & Pre-Bend (7). Start with: Bend a whole step up to pitch, ear-checked — end the phrase on a chord tone when you can. Then: Hold it steady, then add narrow vibrato on top — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "This is the part you came for. Day 244 jam on Bend Vocabulary — Release & Pre-Bend (7) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 244. Wind down: one gentle sound, then the win question. Win check: A bent note held with even vibrato for four beats."
  },
  "245": {
    "arrive": "Day 245. Two minutes to show up fully: Sequence against a static harmony.",
    "warmup": "Day 245. No hero warm-up — just honest prep. Light preview — One chord vamp, climb the cell four steps cleanly.",
    "teach": "Teacher hat on for a minute: Over one chord, the sequence is the movement. The ear follows the climb because nothing else moves. Leave space; one clear target note... First win to aim at: Sequence against a static harmony. Leave air. One clear idea beats a blur of notes.",
    "guided": "Hands-on stretch for day 245 — Sequence Climb — Melodic Sequences Up (8). Start with: One chord vamp, climb the cell four steps cleanly. Then: Vary the rhythm on the last repeat for interest — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Song-shaped minutes. Day 245 jam on Sequence Climb — Melodic Sequences Up (8) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 245. Cool-down — soft hands, honest check. Win check: A four-step sequence over one chord that resolves to a chord tone."
  },
  "246": {
    "arrive": "Day 246. Check posture, then lock the intention: Play the cadence in a different octave.",
    "warmup": "Day 246. Gentle start, then today's shapes. Light preview — Play the line low for two cycles, warm and clear.",
    "teach": "One clear idea today: The same phrygian line low and high is two different feelings. Register is arrangement — try both and keep the one that serves the song. First win to aim at: Play the cadence in a different octave. Leave air. One clear idea beats a blur of notes.",
    "guided": "Slow enough that form stays honest for day 246 — Question Harmony — Solo Over Andalusian (8). Start with: Play the line low for two cycles, warm and clear. Then: Repeat it an octave up, same articulation — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Let the hands make a little story. Day 246 jam on Question Harmony — Solo Over Andalusian (8) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 246. Leave the guitar friendlier than you found it. Win check: The same line low then high, with the answer phrase in the upper register."
  },
  "247": {
    "arrive": "Day 247. You are here. That already counts. Intention next: Use the sweep to start a phrase, not just end one.",
    "warmup": "Day 247. We wake the specific muscles you will need. Light preview — Open a 4-bar phrase with a sweep, confident attack.",
    "teach": "Think of it like this: Starting on an arpeggio is a confident way to enter — the harmony is stated before the melody wanders. First win to aim at: Use the sweep to start a phrase, not just end one. Leave air. One clear idea beats a blur of notes.",
    "guided": "We will work the list in order for day 247 — Economy Picking Seed (8). Start with: Open a 4-bar phrase with a sweep, confident attack. Then: Follow with a scale answer, contrasting feel — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Fun pass: same skills, less judgment. Day 247 jam on Economy Picking Seed (8) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 247. Soft landing. Win check: A 4-bar phrase that opens with a clean, musical arpeggio sweep."
  },
  "248": {
    "arrive": "Day 248. Land in the chair. One breath. Here is today's aim: Write a short hybrid-arranged passage.",
    "warmup": "Day 248. Easy blood-flow first. Light preview — Pick a simple melody you can hum without thinking.",
    "teach": "Here is the heart of it: Arranging with hybrid means deciding who plays what: bass for the thumb, melody for the fingers. Leave space; one clear target note beats a... First win to aim at: Write a short hybrid-arranged passage. Leave air. One clear idea beats a blur of notes.",
    "guided": "Now we earn it with clean reps for day 248 — Hybrid Picking Taste (8). Start with: Pick a simple melody you can hum without thinking. Then: Add a thumb bass underneath it, steady pulse — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Play window — make it sound like a song fragment. Day 248 jam on Hybrid Picking Taste (8) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 248. Ease out so tomorrow's hands forgive you. Win check: A short arranged passage where melody and bass both stay clear."
  },
  "249": {
    "arrive": "Day 249. Arrive: tune if you can, then read the win out loud: String two motifs into one phrase.",
    "warmup": "Day 249. Warm the hands for what this day actually asks. Light preview — Motif A, one bar, stated plainly — end the phrase on a chord tone when you can.",
    "teach": "Let me put this simply: Two motifs make a phrase the way two sentences make a paragraph — connect them with a bridge. Leave space; one clear target note beats a... First win to aim at: String two motifs into one phrase. Leave air. One clear idea beats a blur of notes.",
    "guided": "Reps with intention for day 249 — Motif From a PD Song (8). Start with: Motif A, one bar, stated plainly — end the phrase on a chord tone when you can. Then: Motif B, one bar, contrasting shape — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Jam: stop drilling, start saying something. Day 249 jam on Motif From a PD Song (8) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 249. Session close. Win check: A two-motif phrase joined by one passing note, played cleanly twice."
  },
  "250": {
    "arrive": "Day 250. Settle in — shoulders soft, phone down: Chain three lead tools into one solo.",
    "warmup": "Day 250. Shake out, then touch today's material lightly. Light preview — One phrase ending with a bend, held and resolved.",
    "teach": "Before we grind reps: Tools chain like words — bend, slide, rest is a sentence. The voice is how they connect. Leave space; one clear target note beats a blur of... First win to aim at: Chain three lead tools into one solo. Leave air. One clear idea beats a blur of notes.",
    "guided": "Practice loop time for day 250 — Weekly Lead Checkpoint (8). Start with: One phrase ending with a bend, held and resolved. Then: Next phrase opening with a slide into the note — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Music time — put the lesson inside something that grooves. Day 250 jam on Weekly Lead Checkpoint (8) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 250. Wind down: one gentle sound, then the win question. Win check: A solo that chains bend, slide, and rest into one flowing voice."
  },
  "251": {
    "arrive": "Day 251. Two minutes to show up fully: Place bends where the melody breathes.",
    "warmup": "Day 251. No hero warm-up — just honest prep. Light preview — Play a phrase with no bends at all, clean line — end the phrase on a chord tone when you can.",
    "teach": "Park the hands a second — idea first: Bends are seasoning. Too many and nothing stands out — save them for the moments that need them. Leave space; one clear target note beats a... First win to aim at: Place bends where the melody breathes. Leave air. One clear idea beats a blur of notes.",
    "guided": "Guided block — your drills, my pacing for day 251 — Bend Vocabulary — Release & Pre-Bend (8). Start with: Play a phrase with no bends at all, clean line — end the phrase on a chord tone when you can. Then: Add one bend at the very end, target pitch clear. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Loose on purpose — still in time. Day 251 jam on Bend Vocabulary — Release & Pre-Bend (8) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 251. Cool-down — soft hands, honest check. Win check: A phrase with one well-placed bend that sounds chosen, not automatic."
  },
  "252": {
    "arrive": "Day 252. Check posture, then lock the intention: Sequence in a scale you rarely use.",
    "warmup": "Day 252. Gentle start, then today's shapes. Light preview — Pick a scale you haven't climbed through before — end the phrase on a chord tone when you can.",
    "teach": "This is the bit that unlocks the rest: Sequences make a new scale feel like home — the shape is familiar even where the notes are new. Leave space; one clear target note beats a... First win to aim at: Sequence in a scale you rarely use. Leave air. One clear idea beats a blur of notes.",
    "guided": "This is the gym section for day 252 — Sequence Climb — Melodic Sequences Up (9). Start with: Pick a scale you haven't climbed through before — end the phrase on a chord tone when you can. Then: Map a 4-note cell inside it, note names known — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "This is the part you came for. Day 252 jam on Sequence Climb — Melodic Sequences Up (9) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 252. Leave the guitar friendlier than you found it. Win check: A clean three-step sequence inside a scale you rarely play."
  },
  "253": {
    "arrive": "Day 253. You are here. That already counts. Intention next: Combine chord tones, approach notes, and rests.",
    "warmup": "Day 253. We wake the specific muscles you will need. Light preview — One bar of chord-tone only, simple and solid — end the phrase on a chord tone when you can.",
    "teach": "Teacher hat on for a minute: Chord tone + approach + rest is a complete sentence — phrygian turns it into a question. Leave space; one clear target note beats a blur of... First win to aim at: Combine chord tones, approach notes, and rests. Leave air. One clear idea beats a blur of notes.",
    "guided": "Hands-on stretch for day 253 — Question Harmony — Solo Over Andalusian (9). Start with: One bar of chord-tone only, simple and solid — end the phrase on a chord tone when you can. Then: One bar with an approach note leading in — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Song-shaped minutes. Day 253 jam on Question Harmony — Solo Over Andalusian (9) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 253. Soft landing. Win check: A cadence solo that mixes chord tones, approaches, and rests like a real phrase."
  },
  "254": {
    "arrive": "Day 254. Land in the chair. One breath. Here is today's aim: Sweep in a real musical phrase over a vamp.",
    "warmup": "Day 254. Easy blood-flow first. Light preview — Pick a vamp and choose a chord-tone target note — end the phrase on a chord tone when you can.",
    "teach": "One clear idea today: Technique graduates when you stop hearing it. This pass is the graduation: musical sentences first, pick mechanics invisible. First win to aim at: Sweep in a real musical phrase over a vamp. Leave air. One clear idea beats a blur of notes.",
    "guided": "Slow enough that form stays honest for day 254 — Economy Picking Seed (9). Start with: Pick a vamp and choose a chord-tone target note — end the phrase on a chord tone when you can. Then: One phrase with a sweep toward the target — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Let the hands make a little story. Day 254 jam on Economy Picking Seed (9) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 254. Ease out so tomorrow's hands forgive you. Win check: A vamp phrase where a sweep appears as part of the music, not as a trick."
  },
  "255": {
    "arrive": "Day 255. Arrive: tune if you can, then read the win out loud: Perform a full hybrid piece start to finish.",
    "warmup": "Day 255. Warm the hands for what this day actually asks. Light preview — Warm the pattern twice through, slow and loose — end the phrase on a chord tone when you can.",
    "teach": "Think of it like this: Hybrid picking is done when it survives a full take, not a perfect two-bar loop. Today is the full-take honesty check. First win to aim at: Perform a full hybrid piece start to finish. Leave air. One clear idea beats a blur of notes.",
    "guided": "We will work the list in order for day 255 — Hybrid Picking Taste (9). Start with: Warm the pattern twice through, slow and loose — end the phrase on a chord tone when you can. Then: One full performance pass, no stopping allowed — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Fun pass: same skills, less judgment. Day 255 jam on Hybrid Picking Taste (9) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 255. Session close. Win check: A complete hybrid performance take with balanced voices and a steady groove."
  },
  "256": {
    "arrive": "Day 256. Settle in — shoulders soft, phone down: Perform a full solo built from your PD motifs.",
    "warmup": "Day 256. Shake out, then touch today's material lightly. Light preview — Statement: play the motif twice, confident — end the phrase on a chord tone when you can.",
    "teach": "Here is the heart of it: The motif study completes when the solo sounds like a story with a recognizable hero. Leave space; one clear target note beats a blur of... First win to aim at: Perform a full solo built from your PD motifs. Leave air. One clear idea beats a blur of notes.",
    "guided": "Now we earn it with clean reps for day 256 — Motif From a PD Song (9). Start with: Statement: play the motif twice, confident — end the phrase on a chord tone when you can. Then: Contrast: play it an octave lower, darker color — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Play window — make it sound like a song fragment. Day 256 jam on Motif From a PD Song (9) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 256. Wind down: one gentle sound, then the win question. Win check: A complete solo built on one motif, opening and closing with it."
  },
  "257": {
    "arrive": "Day 257. Two minutes to show up fully: Perform the week's lead checkpoint as a take.",
    "warmup": "Day 257. No hero warm-up — just honest prep. Light preview — One take: space, one tool, and a clear ending — end the phrase on a chord tone when you can.",
    "teach": "Let me put this simply: The checkpoint is the whole week in one pass. Play it like you mean it, then keep the honest take. Leave space; one clear target note beats... First win to aim at: Perform the week's lead checkpoint as a take. Leave air. One clear idea beats a blur of notes.",
    "guided": "Reps with intention for day 257 — Weekly Lead Checkpoint (9). Start with: One take: space, one tool, and a clear ending — end the phrase on a chord tone when you can. Then: Listen back once and mark the best phrase — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Jam: stop drilling, start saying something. Day 257 jam on Weekly Lead Checkpoint (9) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 257. Cool-down — soft hands, honest check. Win check: A keeper lead take that shows the week's tools in one honest pass."
  },
  "258": {
    "arrive": "Day 258. Check posture, then lock the intention: Build a short solo entirely from bend vocabulary.",
    "warmup": "Day 258. Gentle start, then today's shapes. Light preview — Whole-step bend on the third string, in tune — end the phrase on a chord tone when you can.",
    "teach": "Before we grind reps: Bends are the voice of the guitar. A solo made of them should sound like a singer, not a machine. Leave space; one clear target note beats... First win to aim at: Build a short solo entirely from bend vocabulary. Leave air. One clear idea beats a blur of notes.",
    "guided": "Practice loop time for day 258 — Bend Vocabulary — Release & Pre-Bend (9). Start with: Whole-step bend on the third string, in tune — end the phrase on a chord tone when you can. Then: Hold it two beats, then release slowly down — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Music time — put the lesson inside something that grooves. Day 258 jam on Bend Vocabulary — Release & Pre-Bend (9) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 258. Leave the guitar friendlier than you found it. Win check: A bend-vocabulary solo that sounds like a sung melody."
  },
  "259": {
    "arrive": "Day 259. You are here. That already counts. Intention next: Sequence inside a real solo context.",
    "warmup": "Day 259. We wake the specific muscles you will need. Light preview — Climb the cell in a new position, eyes on the neck.",
    "teach": "Park the hands a second — idea first: Sequences are arrows, not destinations. Point somewhere, then say the thing you aimed at. Leave space; one clear target note beats a blur... First win to aim at: Sequence inside a real solo context. Leave air. One clear idea beats a blur of notes.",
    "guided": "Guided block — your drills, my pacing for day 259 — Sequence Climb — Melodic Sequences Up (10). Start with: Climb the cell in a new position, eyes on the neck. Then: Keep the same rhythm from last week's version — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "Loose on purpose — still in time. Day 259 jam on Sequence Climb — Melodic Sequences Up (10) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 259. Soft landing. Win check: A 4-bar solo with one intentional sequence that resolves to silence."
  },
  "260": {
    "arrive": "Day 260. Land in the chair. One breath. Here is today's aim: Finish the Andalusian study with a performance take.",
    "warmup": "Day 260. Easy blood-flow first. Light preview — Open with space: two beats of silence before the first note.",
    "teach": "This is the bit that unlocks the rest: The E phrygian study ends when it sounds like music. This pass is the proof Leave space; one clear target note beats a blur of almosts. First win to aim at: Finish the Andalusian study with a performance take. Leave air. One clear idea beats a blur of notes.",
    "guided": "This is the gym section for day 260 — Question Harmony — Solo Over Andalusian (10). Start with: Open with space: two beats of silence before the first note. Then: One phrase with your best expressive tool, held — half volume on the answer phrase. If it gets sloppy, halve the note count before you touch the dial.",
    "jam": "This is the part you came for. Day 260 jam on Question Harmony — Solo Over Andalusian (10) — Call, rest, answer. End on a chord tone you can hum.",
    "cooldown": "Day 260. Ease out so tomorrow's hands forgive you. Win check: A performance take of the Andalusian cadence you'd honestly keep."
  },
  "261": {
    "arrive": "Day 261. Arrive: tune if you can, then read the win out loud: Choose one song or section as this week’s vehicle.",
    "warmup": "Day 261. Warm the hands for what this day actually asks. Light preview — Write the form on paper in under two minutes — boxes and arrows are fine.",
    "teach": "Teacher hat on for a minute: Songs are why we practice. Repertoire days turn skills into something you can finish and share. Pick material you can actually complete —... First win to aim at: Choose one song or section as this week’s vehicle. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 261 — Repertoire Phase Open — Songs Are the Point. Start with: Write the form on paper in under two minutes — boxes and arrows are fine. Then: Play only the first section until it feels friendly at a slow tempo. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 261 jam on Repertoire Phase Open — Songs Are the Point — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 261. Session close. Win check: Name your song’s form aloud, then play one section clean enough to keep."
  },
  "262": {
    "arrive": "Day 262. Settle in — shoulders soft, phone down: Write accurate bar counts for every section on one page.",
    "warmup": "Day 262. Shake out, then touch today's material lightly. Light preview — Redraw the form with bar counts per section — keep going if you flub; mark it and finish.",
    "teach": "One clear idea today: A form map is a memory externalization. Eyes reduce brain load so hands can groove. Finish sections; recovery under light pressure is part... First win to aim at: Write accurate bar counts for every section on one page. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 262 — Form Mapping on Paper. Start with: Redraw the form with bar counts per section — keep going if you flub; mark it and finish. Then: Play only section boundaries (last bar → first bar of next) 10 times. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 262 jam on Form Mapping on Paper — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 262. Wind down: one gentle sound, then the win question. Win check: Produce a labeled form map and play every section boundary cleanly in order."
  },
  "263": {
    "arrive": "Day 263. Two minutes to show up fully: Compose a short intro that clearly belongs to this song.",
    "warmup": "Day 263. No hero warm-up — just honest prep. Light preview — Design a 2- or 4-bar intro on paper — keep going if you flub; mark it and finish.",
    "teach": "Think of it like this: Intros promise the song's world in a few bars. A clear hook beats a long meander. Finish sections; recovery under light pressure is part of... First win to aim at: Compose a short intro that clearly belongs to this song. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 263 — Intro Hook Design. Start with: Design a 2- or 4-bar intro on paper — keep going if you flub; mark it and finish. Then: Loop the intro into verse without a hitch 8 times. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 263 jam on Intro Hook Design — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 263. Cool-down — soft hands, honest check. Win check: Land the intro hook twice clean, then record one take you would keep."
  },
  "264": {
    "arrive": "Day 264. Check posture, then lock the intention: Keep verse texture lower than chorus on purpose.",
    "warmup": "Day 264. Gentle start, then today's shapes. Light preview — Verse-only loop with reduced strum density 8 bars × 4.",
    "teach": "Here is the heart of it: Verses often need lower density so lyrics (or melody) can speak. Texture is arrangement. Finish sections; recovery under light pressure is... First win to aim at: Keep verse texture lower than chorus on purpose. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 264 — Verse Comp Texture. Start with: Verse-only loop with reduced strum density 8 bars × 4. Then: Mark words or hummed syllables where strums should thin. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 264 jam on Verse Comp Texture — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 264. Leave the guitar friendlier than you found it. Win check: Keep the verse comp steady through a full run, then record one take you would keep."
  },
  "265": {
    "arrive": "Day 265. You are here. That already counts. Intention next: Create an obvious lift into the chorus.",
    "warmup": "Day 265. We wake the specific muscles you will need. Light preview — Chorus loop with one lift lever only (density or voicing).",
    "teach": "Let me put this simply: Choruses lift via range, density, strum energy, or harmonic brightness — pick one primary lever. Keep the harmony simple (think G–C–D... First win to aim at: Create an obvious lift into the chorus. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 265 — Chorus Lift — Make the Hook Rise. Start with: Chorus loop with one lift lever only (density or voicing). Then: Verse→chorus transition 10 times focusing on energy change. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 265 jam on Chorus Lift — Make the Hook Rise — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 265. Soft landing. Win check: Make verse→chorus clearly lift with one main lever, then keep one take."
  },
  "266": {
    "arrive": "Day 266. Land in the chair. One breath. Here is today's aim: Make the bridge contrast without losing the pulse.",
    "warmup": "Day 266. Easy blood-flow first. Light preview — Isolate bridge chords slowly until changes are early-prepared.",
    "teach": "Before we grind reps: Bridges contrast. New chord color or rhythmic space re-engages ears before the final chorus. Finish sections; recovery under light pressure... First win to aim at: Make the bridge contrast without losing the pulse. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 266 — Bridge or Middle Eight. Start with: Isolate bridge chords slowly until changes are early-prepared. Then: Bridge in/out transitions 8 times each — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 266 jam on Bridge or Middle Eight — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 266. Ease out so tomorrow's hands forgive you. Win check: Play the bridge eight times clean, then record one take you would keep."
  },
  "267": {
    "arrive": "Day 267. Arrive: tune if you can, then read the win out loud: Design a deliberate final gesture (button or fade).",
    "warmup": "Day 267. Warm the hands for what this day actually asks. Light preview — Practice last 4 bars into button 15 times — keep going if you flub; mark it and finish.",
    "teach": "Park the hands a second — idea first: Endings are remembered. A button (short final hit) or deliberate fade-out is a design choice. Finish sections; recovery under light... First win to aim at: Design a deliberate final gesture (button or fade). Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 267 — Ending and Button. Start with: Practice last 4 bars into button 15 times — keep going if you flub; mark it and finish. Then: Hold still for one full beat after the final cut-off. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 267 jam on Ending and Button — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 267. Session close. Win check: Nail the ending button, then record one take you would keep."
  },
  "268": {
    "arrive": "Day 268. Settle in — shoulders soft, phone down: Eliminate panic pauses between sections.",
    "warmup": "Day 268. Shake out, then touch today's material lightly. Light preview — Loop the two bars around every section seam — keep going if you flub; mark it and finish.",
    "teach": "This is the bit that unlocks the rest: Transitions fail when hands panic between sections. Glue fills are short and tempo-true. Finish sections; recovery under light pressure is... First win to aim at: Eliminate panic pauses between sections. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 268 — Transition Glue. Start with: Loop the two bars around every section seam — keep going if you flub; mark it and finish. Then: Insert a 1-beat rest glue if hands need time — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 268 jam on Transition Glue — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 268. Wind down: one gentle sound, then the win question. Win check: Make every transition glue, then record one take you would keep."
  },
  "269": {
    "arrive": "Day 269. Two minutes to show up fully: Choose a human practice tempo with clean changes.",
    "warmup": "Day 269. No hero warm-up — just honest prep. Light preview — Find the tempo where changes stay clean for 16 bars.",
    "teach": "Teacher hat on for a minute: The right tempo is the one where parts stay human. Ego tempo creates permanent flaws. Finish sections; recovery under light pressure is... First win to aim at: Choose a human practice tempo with clean changes. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 269 — Tempo Honesty. Start with: Find the tempo where changes stay clean for 16 bars. Then: Mark that BPM as practice tempo on the chart — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 269 jam on Tempo Honesty — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 269. Cool-down — soft hands, honest check. Win check: Hold an honest tempo start to finish, then record one take you would keep."
  },
  "270": {
    "arrive": "Day 270. Check posture, then lock the intention: Assign dynamics to sections like a lighting plot.",
    "warmup": "Day 270. Gentle start, then today's shapes. Light preview — Assign soft/medium/loud to sections on the chart.",
    "teach": "One clear idea today: Plan soft and loud regions like a lighting plot. Dynamics make form audible. Finish sections; recovery under light pressure is part of the... First win to aim at: Assign dynamics to sections like a lighting plot. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 270 — Dynamic Architecture. Start with: Assign soft/medium/loud to sections on the chart. Then: Play with exaggerated dynamics once — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 270 jam on Dynamic Architecture — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 270. Leave the guitar friendlier than you found it. Win check: Play the dynamics map, then record one take you would keep."
  },
  "271": {
    "arrive": "Day 271. You are here. That already counts. Intention next: Memorize one section with chunk cues.",
    "warmup": "Day 271. We wake the specific muscles you will need. Light preview — Turn chart face down; play one section from memory.",
    "teach": "Think of it like this: Memory thrives on chunks and cues, not heroic full runs on day one of recall. Finish sections; recovery under light pressure is part of the... First win to aim at: Memorize one section with chunk cues. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 271 — Memory Without Panic. Start with: Turn chart face down; play one section from memory. Then: Turn the chart face-back and play seams from memory only. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 271 jam on Memory Without Panic — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 271. Soft landing. Win check: Play the whole form from memory without stopping, then record one take you would keep."
  },
  "272": {
    "arrive": "Day 272. Land in the chair. One breath. Here is today's aim: Rejoin the form on the next downbeat after a flub.",
    "warmup": "Day 272. Easy blood-flow first. Light preview — Intentionally flub a change, then rejoin on next downbeat.",
    "teach": "Here is the heart of it: Pros rejoin the form after mistakes. Stopping trains fragility; recovery trains performance. Finish sections; recovery under light pressure... First win to aim at: Rejoin the form on the next downbeat after a flub. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 272 — Recovery Practice. Start with: Intentionally flub a change, then rejoin on next downbeat. Then: Practice smiling through the rejoin — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 272 jam on Recovery Practice — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 272. Ease out so tomorrow's hands forgive you. Win check: Practice recovering from a slip mid-song, then record one take you would keep."
  },
  "273": {
    "arrive": "Day 273. Arrive: tune if you can, then read the win out loud: Make the chart readable at a glance.",
    "warmup": "Day 273. Warm the hands for what this day actually asks. Light preview — Rewrite messy bars with larger fret numbers — keep going if you flub; mark it and finish.",
    "teach": "Let me put this simply: A clean chart is future-you kindness. Marks for feels, mutes, and frets reduce reload cost. Finish sections; recovery under light pressure... First win to aim at: Make the chart readable at a glance. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 273 — Chart Cleanliness. Start with: Rewrite messy bars with larger fret numbers — keep going if you flub; mark it and finish. Then: Add feel marks (mute, accent, light) in one ink color. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 273 jam on Chart Cleanliness — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 273. Session close. Win check: Play from a clean chart, then record one take you would keep."
  },
  "274": {
    "arrive": "Day 274. Settle in — shoulders soft, phone down: Match tone color to section role.",
    "warmup": "Day 274. Shake out, then touch today's material lightly. Light preview — Verse tone: darker/softer attack for 8 bars — keep going if you flub; mark it and finish.",
    "teach": "Before we grind reps: Tone is arrangement: brighter for lift, darker for verses, less gain when changes need clarity. One tone tweak can fix a muddy section. First win to aim at: Match tone color to section role. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 274 — Tone and Arrangement. Start with: Verse tone: darker/softer attack for 8 bars — keep going if you flub; mark it and finish. Then: Chorus tone: clearer/brighter for 8 bars — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 274 jam on Tone and Arrangement — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 274. Wind down: one gentle sound, then the win question. Win check: Set the tone and arrangement, then record one take you would keep."
  },
  "275": {
    "arrive": "Day 275. Two minutes to show up fully: Lock pocket to a reference recording or prior take.",
    "warmup": "Day 275. No hero warm-up — just honest prep. Light preview — Play along with a library recording or your own prior take.",
    "teach": "Park the hands a second — idea first: Playing along teaches ensemble timing. Match pocket before adding ornamental disagreement. Finish sections; recovery under light pressure... First win to aim at: Lock pocket to a reference recording or prior take. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 275 — Duet With a Recording. Start with: Play along with a library recording or your own prior take. Then: Match downbeats for one full section before adding fills. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 275 jam on Duet With a Recording — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 275. Cool-down — soft hands, honest check. Win check: Duet with the recording in time, then record one take you would keep."
  },
  "276": {
    "arrive": "Day 276. Check posture, then lock the intention: Stabilize thumb ostinato before finger complexity.",
    "warmup": "Day 276. Gentle start, then today's shapes. Light preview — Thumb on beat roots only for one section — keep going if you flub; mark it and finish.",
    "teach": "This is the bit that unlocks the rest: Fingerstyle can state bass + harmony + hint of melody. Start sparse; density later. Finish sections; recovery under light pressure is part... First win to aim at: Stabilize thumb ostinato before finger complexity. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 276 — Fingerstyle Arrangement Pass. Start with: Thumb on beat roots only for one section — keep going if you flub; mark it and finish. Then: Add simple higher-string pattern on &s — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 276 jam on Fingerstyle Arrangement Pass — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 276. Leave the guitar friendlier than you found it. Win check: Play the fingerstyle pass, then record one take you would keep."
  },
  "277": {
    "arrive": "Day 277. You are here. That already counts. Intention next: Keep one recognizable strum DNA through the section.",
    "warmup": "Day 277. We wake the specific muscles you will need. Light preview — Lock one strum pattern for the whole section — keep going if you flub; mark it and finish.",
    "teach": "Teacher hat on for a minute: Strum arrangements live or die on right-hand pattern consistency through changes. Finish sections; recovery under light pressure is part of... First win to aim at: Keep one recognizable strum DNA through the section. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 277 — Strum Arrangement Pass. Start with: Lock one strum pattern for the whole section — keep going if you flub; mark it and finish. Then: Change chords without changing the pattern DNA — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 277 jam on Strum Arrangement Pass — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 277. Soft landing. Win check: Play the strum pass, then record one take you would keep."
  },
  "278": {
    "arrive": "Day 278. Land in the chair. One breath. Here is today's aim: Write a short break that serves the song.",
    "warmup": "Day 278. Easy blood-flow first. Light preview — Write a 2-bar break maximum on paper — keep going if you flub; mark it and finish.",
    "teach": "One clear idea today: A lead break is a short story inside the song, not a separate shred audition. Start clear, peak once, land before the vocal returns. First win to aim at: Write a short break that serves the song. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 278 — Lead Break Writing. Start with: Write a 2-bar break maximum on paper — keep going if you flub; mark it and finish. Then: Place it after a chorus or before a final verse — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 278 jam on Lead Break Writing — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 278. Ease out so tomorrow's hands forgive you. Win check: Write and play the lead break, then record one take you would keep."
  },
  "279": {
    "arrive": "Day 279. Arrive: tune if you can, then read the win out loud: Leave holes for the call (voice or hummed line).",
    "warmup": "Day 279. Warm the hands for what this day actually asks. Light preview — Hum a call; answer on guitar in the next bar — keep going if you flub; mark it and finish.",
    "teach": "Think of it like this: Guitar answers voice (or a hummed line). Leave holes where the call lives — if you play through the singer, you are competing, not talking. First win to aim at: Leave holes for the call (voice or hummed line). Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 279 — Call and Response With Voice. Start with: Hum a call; answer on guitar in the next bar — keep going if you flub; mark it and finish. Then: Leave the call bar mostly empty on guitar — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 279 jam on Call and Response With Voice — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 279. Session close. Win check: Trade call and response with your voice, then record one take you would keep."
  },
  "280": {
    "arrive": "Day 280. Settle in — shoulders soft, phone down: Fit key to comfortable singing/humming range.",
    "warmup": "Day 280. Shake out, then touch today's material lightly. Light preview — Find a capo fret where singing (or humming comfortably) works.",
    "teach": "Here is the heart of it: Capo is a friend of singable range. Comfortable vowels beat theoretical purity. Finish sections; recovery under light pressure is part of... First win to aim at: Fit key to comfortable singing/humming range. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 280 — Capo and Key Fit for Voice. Start with: Find a capo fret where singing (or humming comfortably) works. Then: Rewrite shapes if needed for the new positions — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 280 jam on Capo and Key Fit for Voice — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 280. Wind down: one gentle sound, then the win question. Win check: Set the capo and key for your voice, then record one take you would keep."
  },
  "281": {
    "arrive": "Day 281. Two minutes to show up fully: Order songs for energy and key kindness.",
    "warmup": "Day 281. No hero warm-up — just honest prep. Light preview — Order two or three songs by energy curve — keep going if you flub; mark it and finish.",
    "teach": "Let me put this simply: Set order manages energy and key fatigue. Adjacent songs need intentional contrast or glue. Finish sections; recovery under light pressure... First win to aim at: Order songs for energy and key kindness. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 281 — Setlist Flow Logic. Start with: Order two or three songs by energy curve — keep going if you flub; mark it and finish. Then: Check keys for monotony; adjust capo plan if needed. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 281 jam on Setlist Flow Logic — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 281. Cool-down — soft hands, honest check. Win check: Order your setlist with flow logic, then record one take you would keep."
  },
  "282": {
    "arrive": "Day 282. Check posture, then lock the intention: Build duration without shoulder pain.",
    "warmup": "Day 282. Gentle start, then today's shapes. Light preview — Play the hardest section 3 times with 30s shoulder drops between.",
    "teach": "Before we grind reps: Stamina is paced reps with loose shoulders. Pain is a stop sign, not a badge. Finish sections; recovery under light pressure is part of the... First win to aim at: Build duration without shoulder pain. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 282 — Stamina Building. Start with: Play the hardest section 3 times with 30s shoulder drops between. Then: Full song once at practice tempo focusing on loose hands. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 282 jam on Stamina Building — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 282. Leave the guitar friendlier than you found it. Win check: Play the full set without dropping, then record one take you would keep."
  },
  "283": {
    "arrive": "Day 283. You are here. That already counts. Intention next: Reveal timing truth at whisper volume.",
    "warmup": "Day 283. We wake the specific muscles you will need. Light preview — Entire session at whisper volume — keep going if you flub; mark it and finish.",
    "teach": "Park the hands a second — idea first: Soft playing reveals timing sins volume hides. Quiet days build control and neighbor peace. Finish sections; recovery under light pressure... First win to aim at: Reveal timing truth at whisper volume. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 283 — Quiet Practice Day. Start with: Entire session at whisper volume — keep going if you flub; mark it and finish. Then: If notes disappear, fretting is incomplete — fix gently. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 283 jam on Quiet Practice Day — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 283. Soft landing. Win check: Play a quiet practice pass, then record one take you would keep."
  },
  "284": {
    "arrive": "Day 284. Land in the chair. One breath. Here is today's aim: Capture a full take under performance rules.",
    "warmup": "Day 284. Easy blood-flow first. Light preview — One full section or song take with performance rules.",
    "teach": "This is the bit that unlocks the rest: Recording is a mirror. One take worth keeping teaches more than five ignored ones. Finish sections; recovery under light pressure is part... First win to aim at: Capture a full take under performance rules. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 284 — Record a Keepable Take. Start with: One full section or song take with performance rules. Then: No stopping mid-take unless safety issue — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 284 jam on Record a Keepable Take — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 284. Ease out so tomorrow's hands forgive you. Win check: Save one take worth keeping and write a single keep/fix note."
  },
  "285": {
    "arrive": "Day 285. Arrive: tune if you can, then read the win out loud: Separate kind pass from pencil pass.",
    "warmup": "Day 285. Warm the hands for what this day actually asks. Light preview — Listen for time first, notes second — keep going if you flub; mark it and finish.",
    "teach": "Teacher hat on for a minute: Kindness first, pencil second. Shame kills practice loops; one specific fix keeps you coming back tomorrow. First win to aim at: Separate kind pass from pencil pass. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 285 — Kind Listenback Critique. Start with: Listen for time first, notes second — keep going if you flub; mark it and finish. Then: Write one keep sentence and one fix sentence — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 285 jam on Kind Listenback Critique — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 285. Session close. Win check: Produce a kind keep sentence and one pencil fix, then apply the fix in a loop."
  },
  "286": {
    "arrive": "Day 286. Settle in — shoulders soft, phone down: Isolate the single highest-use sticky bar.",
    "warmup": "Day 286. Shake out, then touch today's material lightly. Light preview — Locate the single stickiest bar and put a star on the chart.",
    "teach": "One clear idea today: Isolating the sticky bar is high-use practice. Context returns after the bar is honest. Finish sections; recovery under light pressure is... First win to aim at: Isolate the single highest-use sticky bar. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 286 — Fix One Bar Only. Start with: Locate the single stickiest bar and put a star on the chart. Then: Loop that bar at about 70% speed twenty times, then rest. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 286 jam on Fix One Bar Only — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 286. Wind down: one gentle sound, then the win question. Win check: Fix just one bar, then record one take you would keep."
  },
  "287": {
    "arrive": "Day 287. Two minutes to show up fully: Find a tall soft performance stance.",
    "warmup": "Day 287. No hero warm-up — just honest prep. Light preview — Check feet, shoulders, and neck angle in a mirror or camera.",
    "teach": "Think of it like this: Body language affects breathing and tempo. Tall and soft beats coiled and brittle. Finish sections; recovery under light pressure is part... First win to aim at: Find a tall soft performance stance. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 287 — Performance Stance. Start with: Check feet, shoulders, and neck angle in a mirror or camera. Then: Play hardest passage with knees soft — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 287 jam on Performance Stance — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 287. Cool-down — soft hands, honest check. Win check: Play with performance stance, then record one take you would keep."
  },
  "288": {
    "arrive": "Day 288. Check posture, then lock the intention: Install a short start ritual.",
    "warmup": "Day 288. Gentle start, then today's shapes. Light preview — Design a 5-second start ritual (breath, count, shoulders).",
    "teach": "Here is the heart of it: First bars set trust. A start ritual (breath, count-in, shoulders) reduces flinch errors. Finish sections; recovery under light pressure is... First win to aim at: Install a short start ritual. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 288 — Start Strong Ritual. Start with: Design a 5-second start ritual (breath, count, shoulders). Then: Practice ritual → first 2 bars 15 times — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 288 jam on Start Strong Ritual — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 288. Leave the guitar friendlier than you found it. Win check: Use your start-strong ritual, then record one take you would keep."
  },
  "289": {
    "arrive": "Day 289. You are here. That already counts. Intention next: Practice endings as hard as openings.",
    "warmup": "Day 289. We wake the specific muscles you will need. Light preview — Last 4 bars + stillness 15 times — keep going if you flub; mark it and finish.",
    "teach": "Let me put this simply: Last bars linger in memory longer than middles. Practice endings as hard as openings so the room remembers a clean finish. First win to aim at: Practice endings as hard as openings. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 289 — Finish Strong Ritual. Start with: Last 4 bars + stillness 15 times — keep going if you flub; mark it and finish. Then: Decide facial/body end pose (simple) — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 289 jam on Finish Strong Ritual — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 289. Soft landing. Win check: Use your finish-strong ritual, then record one take you would keep."
  },
  "290": {
    "arrive": "Day 290. Land in the chair. One breath. Here is today's aim: Plan seams before gluing songs.",
    "warmup": "Day 290. Easy blood-flow first. Light preview — Pick two song fragments to join and write the seam bar down.",
    "teach": "Before we grind reps: Medleys need key and tempo bridges. Plan the seam on paper before you glue songs live — surprise joins are how trains wreck. First win to aim at: Plan seams before gluing songs. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 290 — Medley Skills. Start with: Pick two song fragments to join and write the seam bar down. Then: Write a 2-bar seam on one chord or hit — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 290 jam on Medley Skills — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 290. Ease out so tomorrow's hands forgive you. Win check: Stitch the medley cleanly, then record one take you would keep."
  },
  "291": {
    "arrive": "Day 291. Arrive: tune if you can, then read the win out loud: Transfer the song into a new right-hand dialect.",
    "warmup": "Day 291. Warm the hands for what this day actually asks. Light preview — Same section at ballad density — fewer hits, more air.",
    "teach": "Park the hands a second — idea first: Same progression, new right-hand dialect (folk, rock, ballad). Style is mostly rhythm and density. Finish sections; recovery under light... First win to aim at: Transfer the song into a new right-hand dialect. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 291 — Style Transfer Day. Start with: Same section at ballad density — fewer hits, more air. Then: Same section, rock eighth density — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 291 jam on Style Transfer Day — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 291. Session close. Win check: Play it in the new style, then record one take you would keep."
  },
  "292": {
    "arrive": "Day 292. Settle in — shoulders soft, phone down: Adjust attack and muting for the playback context.",
    "warmup": "Day 292. Shake out, then touch today's material lightly. Light preview — Play section unplugged/very clean — keep going if you flub; mark it and finish.",
    "teach": "This is the bit that unlocks the rest: Amps compress and sustain differently. Adjust attack and mute strategy per context. Finish sections; recovery under light pressure is part... First win to aim at: Adjust attack and muting for the playback context. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 292 — Acoustic Versus Amp Feel. Start with: Play section unplugged/very clean — keep going if you flub; mark it and finish. Then: Play with more sustain or imaginary amp compression (longer fretting). Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 292 jam on Acoustic Versus Amp Feel — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 292. Wind down: one gentle sound, then the win question. Win check: Play acoustic vs amp feel, then record one take you would keep."
  },
  "293": {
    "arrive": "Day 293. Two minutes to show up fully: Identify and erase unwanted open-string noise.",
    "warmup": "Day 293. No hero warm-up — just honest prep. Light preview — Slow motion: identify noisy open strings — keep going if you flub; mark it and finish.",
    "teach": "Teacher hat on for a minute: Unwanted open-string noise is arrangement dirt. Left-hand chops and right-hand palms are erasers. Finish sections; recovery under light... First win to aim at: Identify and erase unwanted open-string noise. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 293 — Mute Noise Cleanup. Start with: Slow motion: identify noisy open strings — keep going if you flub; mark it and finish. Then: Assign left-hand mute or palm for each culprit — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 293 jam on Mute Noise Cleanup — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 293. Cool-down — soft hands, honest check. Win check: Clean up the mute noise, then record one take you would keep."
  },
  "294": {
    "arrive": "Day 294. Check posture, then lock the intention: Use lyric landmarks as memory and dynamic cues.",
    "warmup": "Day 294. Gentle start, then today's shapes. Light preview — Write or recall key lyric fragments against bars.",
    "teach": "One clear idea today: Even instrumentalists benefit from lyric landmarks as memory cues and dynamic guides. Finish sections; recovery under light pressure is... First win to aim at: Use lyric landmarks as memory and dynamic cues. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 294 — Lyric Cue Awareness. Start with: Write or recall key lyric fragments against bars. Then: Use a lyric word as a dynamic cue (e.g. softer on line 2). Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 294 jam on Lyric Cue Awareness — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 294. Leave the guitar friendlier than you found it. Win check: Hit the lyric cues, then record one take you would keep."
  },
  "295": {
    "arrive": "Day 295. You are here. That already counts. Intention next: Lead yourself with a clear count-in every start.",
    "warmup": "Day 295. We wake the specific muscles you will need. Light preview — Count-in aloud at target tempo 10 times — keep going if you flub; mark it and finish.",
    "teach": "Think of it like this: A clear count-in is leadership. Tempo lives in the spoken 1-2-3-4 before the first hit. Finish sections; recovery under light pressure is... First win to aim at: Lead yourself with a clear count-in every start. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 295 — Count-In Leadership. Start with: Count-in aloud at target tempo 10 times — keep going if you flub; mark it and finish. Then: Count-in + first bar only 10 times — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 295 jam on Count-In Leadership — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 295. Soft landing. Win check: Lead with a count-in, then record one take you would keep."
  },
  "296": {
    "arrive": "Day 296. Land in the chair. One breath. Here is today's aim: Hold cadences with intention.",
    "warmup": "Day 296. Easy blood-flow first. Light preview — Place a fermata on a cadence note — keep going if you flub; mark it and finish.",
    "teach": "Here is the heart of it: Holds need collective breath. Practice long notes with a planned re-entry cue. Finish sections; recovery under light pressure is part of... First win to aim at: Hold cadences with intention. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 296 — Fermatas and Holds. Start with: Place a fermata on a cadence note — keep going if you flub; mark it and finish. Then: Hold with steady vibrato or clean sustain — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 296 jam on Fermatas and Holds — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 296. Ease out so tomorrow's hands forgive you. Win check: Place the fermatas and holds, then record one take you would keep."
  },
  "297": {
    "arrive": "Day 297. Arrive: tune if you can, then read the win out loud: Decelerate with subdivision, not collapse.",
    "warmup": "Day 297. Warm the hands for what this day actually asks. Light preview — Subdivide aloud while slowing last 2 bars — keep going if you flub; mark it and finish.",
    "teach": "Let me put this simply: Slowing down is coordinated, not collapsing. Subdivide while you decelerate. Finish sections; recovery under light pressure is part of the... First win to aim at: Decelerate with subdivision, not collapse. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 297 — Rallentando Control. Start with: Subdivide aloud while slowing last 2 bars — keep going if you flub; mark it and finish. Then: Conduct the slow-down with your neck or foot — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 297 jam on Rallentando Control — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 297. Session close. Win check: Control the rallentando, then record one take you would keep."
  },
  "298": {
    "arrive": "Day 298. Settle in — shoulders soft, phone down: Increase density without breaking harmonic landmarks.",
    "warmup": "Day 298. Shake out, then touch today's material lightly. Light preview — Keep chord changes on original bars; double strum density.",
    "teach": "Before we grind reps: Double-time is denser subdivision at the same chord pace. Keep harmonic rhythm clear. Finish sections; recovery under light pressure is... First win to aim at: Increase density without breaking harmonic landmarks. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 298 — Double-Time Taste. Start with: Keep chord changes on original bars; double strum density. Then: 8 bars normal, 8 bars double-time feel — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 298 jam on Double-Time Taste — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 298. Wind down: one gentle sound, then the win question. Win check: Try the double-time feel, then record one take you would keep."
  },
  "299": {
    "arrive": "Day 299. Two minutes to show up fully: Create heavier feel via half-time placement.",
    "warmup": "Day 299. No hero warm-up — just honest prep. Light preview — Move backbeat emphasis to create half-time feel — keep going if you flub; mark it and finish.",
    "teach": "Park the hands a second — idea first: Half-time makes grooves heavier. Backbeat placement shifts while form length stays honest. Finish sections; recovery under light pressure... First win to aim at: Create heavier feel via half-time placement. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 299 — Half-Time Taste. Start with: Move backbeat emphasis to create half-time feel — keep going if you flub; mark it and finish. Then: Eight bars normal feel, eight bars half-time — hard edges clean. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 299 jam on Half-Time Taste — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 299. Cool-down — soft hands, honest check. Win check: Try the half-time feel, then record one take you would keep."
  },
  "300": {
    "arrive": "Day 300. Check posture, then lock the intention: Reduce harmonic load until consistency soars.",
    "warmup": "Day 300. Gentle start, then today's shapes. Light preview — Rewrite one section with fewer chord changes — keep going if you flub; mark it and finish.",
    "teach": "This is the bit that unlocks the rest: Fewer chords can make a song stronger. Power and triad reductions are honest arrangements. Finish sections; recovery under light pressure... First win to aim at: Reduce harmonic load until consistency soars. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 300 — Harmonic Simplification. Start with: Rewrite one section with fewer chord changes — keep going if you flub; mark it and finish. Then: Try power-shape reduction on a busy bar — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 300 jam on Harmonic Simplification — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 300. Leave the guitar friendlier than you found it. Win check: Play the simplified harmony, then record one take you would keep."
  },
  "301": {
    "arrive": "Day 301. You are here. That already counts. Intention next: Add one color only on a stable skeleton.",
    "warmup": "Day 301. We wake the specific muscles you will need. Light preview — Add one color tone (e.g. add9 or 7) on chorus only.",
    "teach": "Teacher hat on for a minute: Add color tones only after the simple version is stable. Ornament follows skeleton. Finish sections; recovery under light pressure is part... First win to aim at: Add one color only on a stable skeleton. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 301 — Harmonic Enrichment. Start with: Add one color tone (e.g. add9 or 7) on chorus only. Then: Make sure you can still grab it in time — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 301 jam on Harmonic Enrichment — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 301. Soft landing. Win check: Play the enriched harmony, then record one take you would keep."
  },
  "302": {
    "arrive": "Day 302. Land in the chair. One breath. Here is today's aim: Let bass motion explain harmony.",
    "warmup": "Day 302. Easy blood-flow first. Light preview — Play roots only on beats 1 and 3 for a section — keep going if you flub; mark it and finish.",
    "teach": "One clear idea today: Moving bass lines outline harmony. A walking or stepwise bass can replace busy strums. Finish sections; recovery under light pressure is... First win to aim at: Let bass motion explain harmony. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 302 — Bass Motion Arrange. Start with: Play roots only on beats 1 and 3 for a section — keep going if you flub; mark it and finish. Then: Add simple stepwise bass between chords — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 302 jam on Bass Motion Arrange — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 302. Ease out so tomorrow's hands forgive you. Win check: Play the bass motion arrangement, then record one take you would keep."
  },
  "303": {
    "arrive": "Day 303. Arrive: tune if you can, then read the win out loud: Add grid-aligned percussion colors.",
    "warmup": "Day 303. Warm the hands for what this day actually asks. Light preview — Add a muted chop on beat 2 and 4 — keep going if you flub; mark it and finish.",
    "teach": "Think of it like this: Body hits and muted chops add drums. Keep them grid-aligned or they fight the song. Finish sections; recovery under light pressure is part... First win to aim at: Add grid-aligned percussion colors. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 303 — Percussive Guitar. Start with: Add a muted chop on beat 2 and 4 — keep going if you flub; mark it and finish. Then: Optional body tap on &s if comfortable — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 303 jam on Percussive Guitar — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 303. Session close. Win check: Add the percussion colors, then record one take you would keep."
  },
  "304": {
    "arrive": "Day 304. Settle in — shoulders soft, phone down: Optionally explore drones/open colors safely.",
    "warmup": "Day 304. Shake out, then touch today's material lightly. Light preview — Optional: try a drone-friendly voicing in standard tuning.",
    "teach": "Here is the heart of it: Open tunings re-shape shapes. If you skip retuning, simulate drone strings in standard. Finish sections; recovery under light pressure is... First win to aim at: Optionally explore drones/open colors safely. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 304 — Open Tuning Taste (Optional). Start with: Optional: try a drone-friendly voicing in standard tuning. Then: If you know an open tuning safely, explore 5 minutes max. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 304 jam on Open Tuning Taste (Optional) — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 304. Wind down: one gentle sound, then the win question. Win check: Try the open tuning taste, then record one take you would keep."
  },
  "305": {
    "arrive": "Day 305. Two minutes to show up fully: Optionally taste Drop D power color.",
    "warmup": "Day 305. No hero warm-up — just honest prep. Light preview — Optional Drop D: retune sixth string carefully — keep going if you flub; mark it and finish.",
    "teach": "Let me put this simply: Drop D adds weight on the sixth string. Optional — explore carefully and retune back after. Finish sections; recovery under light pressure... First win to aim at: Optionally taste Drop D power color. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 305 — Drop D Power Color (Optional). Start with: Optional Drop D: retune sixth string carefully — keep going if you flub; mark it and finish. Then: Power shapes on low strings for a chorus color — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 305 jam on Drop D Power Color (Optional) — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 305. Cool-down — soft hands, honest check. Win check: Try the drop D power color, then record one take you would keep."
  },
  "306": {
    "arrive": "Day 306. Check posture, then lock the intention: Ostinato thumb first.",
    "warmup": "Day 306. Gentle start, then today's shapes. Light preview — Thumb ostinato on roots/5ths alone 2 minutes — keep going if you flub; mark it and finish.",
    "teach": "Before we grind reps: Travis picking needs an ostinato thumb. Stability of bass before fancy fingers. Finish sections; recovery under light pressure is part of... First win to aim at: Ostinato thumb first. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 306 — Travis Pattern Song Pass. Start with: Thumb ostinato on roots/5ths alone 2 minutes — keep going if you flub; mark it and finish. Then: Add simple higher pattern on a single chord — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 306 jam on Travis Pattern Song Pass — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 306. Leave the guitar friendlier than you found it. Win check: Play the Travis pattern pass, then record one take you would keep."
  },
  "307": {
    "arrive": "Day 307. You are here. That already counts. Intention next: Separate boom and chuck roles clearly.",
    "warmup": "Day 307. We wake the specific muscles you will need. Light preview — Boom on 1 and 3, chuck on 2 and 4 for full section.",
    "teach": "Park the hands a second — idea first: Boom-chuck turns a song into train motion. Bass/chord roles must stay distinct. Finish sections; recovery under light pressure is part of... First win to aim at: Separate boom and chuck roles clearly. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 307 — Boom-Chuck Song Pass. Start with: Boom on 1 and 3, chuck on 2 and 4 for full section. Then: Keep chucks lighter than the boom bass notes so groove reads. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 307 jam on Boom-Chuck Song Pass — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 307. Soft landing. Win check: Play the boom-chuck pass, then record one take you would keep."
  },
  "308": {
    "arrive": "Day 308. Land in the chair. One breath. Here is today's aim: Prioritize air and long harmonic rhythm.",
    "warmup": "Day 308. Easy blood-flow first. Light preview — One strum per bar or per two beats max — keep going if you flub; mark it and finish.",
    "teach": "This is the bit that unlocks the rest: Ballads need air. Reduce strum density and lengthen harmonic rhythm under melody. Finish sections; recovery under light pressure is part of... First win to aim at: Prioritize air and long harmonic rhythm. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 308 — Ballad Vocal Space. Start with: One strum per bar or per two beats max — keep going if you flub; mark it and finish. Then: Leave space after each change for imaginary singer. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 308 jam on Ballad Vocal Space — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 308. Ease out so tomorrow's hands forgive you. Win check: Leave the ballad vocal space, then record one take you would keep."
  },
  "309": {
    "arrive": "Day 309. Arrive: tune if you can, then read the win out loud: Prepare changes earlier than you think.",
    "warmup": "Day 309. Warm the hands for what this day actually asks. Light preview — Isolate fastest change at 80% tempo — keep going if you flub; mark it and finish.",
    "teach": "Teacher hat on for a minute: Speed exposes muddy changes. Clarity at tempo requires earlier prep motion. Finish sections; recovery under light pressure is part of the... First win to aim at: Prepare changes earlier than you think. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 309 — Up-Tempo Clarity. Start with: Isolate fastest change at 80% tempo — keep going if you flub; mark it and finish. Then: Prepare fretting hand early on the beat before — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 309 jam on Up-Tempo Clarity — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 309. Session close. Win check: Keep up-tempo clarity, then record one take you would keep."
  },
  "310": {
    "arrive": "Day 310. Settle in — shoulders soft, phone down: Commit to slow heavy time.",
    "warmup": "Day 310. Shake out, then touch today's material lightly. Light preview — 12-bar skeleton at truly slow tempo — keep going if you flub; mark it and finish.",
    "teach": "One clear idea today: Slow blues is space and weight. Long phrases and patient dominant chords teach taste. Finish sections; recovery under light pressure is... First win to aim at: Commit to slow heavy time. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 310 — Slow Blues Vehicle. Start with: 12-bar skeleton at truly slow tempo — keep going if you flub; mark it and finish. Then: Leave space in bars 2 and 4 of each phrase — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 310 jam on Slow Blues Vehicle — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 310. Wind down: one gentle sound, then the win question. Win check: Play the slow blues vehicle, then record one take you would keep."
  },
  "311": {
    "arrive": "Day 311. Two minutes to show up fully: Pace like storytelling breath.",
    "warmup": "Day 311. No hero warm-up — just honest prep. Light preview — Tell the story: vary verse intensity without rushing.",
    "teach": "Think of it like this: Folk pace follows story breath. Don't drag; don't chatty-rush between verses. Finish sections; recovery under light pressure is part of the... First win to aim at: Pace like storytelling breath. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 311 — Folk Storytelling Pace. Start with: Tell the story: vary verse intensity without rushing. Then: Keep pulse while allowing phrase-end breaths — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 311 jam on Folk Storytelling Pace — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 311. Cool-down — soft hands, honest check. Win check: Play at folk storytelling pace, then record one take you would keep."
  },
  "312": {
    "arrive": "Day 312. Check posture, then lock the intention: Lead with clear changes and kind tempo.",
    "warmup": "Day 312. Gentle start, then today's shapes. Light preview — Play as if others sing — louder changes, simpler ornaments.",
    "teach": "Here is the heart of it: Lead the room with loud clear changes and friendly tempos. Perfect ornaments are optional. Finish sections; recovery under light pressure... First win to aim at: Lead with clear changes and kind tempo. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 312 — Campfire Leadership. Start with: Play as if others sing — louder changes, simpler ornaments. Then: Call the chord names once before starting — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 312 jam on Campfire Leadership — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 312. Leave the guitar friendlier than you found it. Win check: Lead the campfire loop, then record one take you would keep."
  },
  "313": {
    "arrive": "Day 313. You are here. That already counts. Intention next: Design an energy arc for the set or multi-section run.",
    "warmup": "Day 313. We wake the specific muscles you will need. Light preview — Write a 3-song or 3-section energy arc on paper — keep going if you flub; mark it and finish.",
    "teach": "Let me put this simply: A solo set needs shape: welcome, lift, rest, peak, goodbye. Plan where you breathe or talk so the set feels guided, not random. First win to aim at: Design an energy arc for the set or multi-section run. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 313 — Solo Performance Shape. Start with: Write a 3-song or 3-section energy arc on paper — keep going if you flub; mark it and finish. Then: Practice speaking one sentence between sections — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 313 jam on Solo Performance Shape — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 313. Soft landing. Win check: Play the solo performance shape, then record one take you would keep."
  },
  "314": {
    "arrive": "Day 314. Land in the chair. One breath. Here is today's aim: Stabilize with click where you rush.",
    "warmup": "Day 314. Easy blood-flow first. Light preview — Full section with click at practice tempo — keep going if you flub; mark it and finish.",
    "teach": "Before we grind reps: Click polish reveals kind lies. Use it to stabilize, then graduate to human feel. Finish sections; recovery under light pressure is part of... First win to aim at: Stabilize with click where you rush. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 314 — With-Metronome Polish. Start with: Full section with click at practice tempo — keep going if you flub; mark it and finish. Then: Note where you pull ahead of the click and circle those bars. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 314 jam on With-Metronome Polish — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 314. Ease out so tomorrow's hands forgive you. Win check: Play the metronome-polished pass, then record one take you would keep."
  },
  "315": {
    "arrive": "Day 315. Arrive: tune if you can, then read the win out loud: Humanize without losing form length.",
    "warmup": "Day 315. Warm the hands for what this day actually asks. Light preview — Immediately after click work, play without click.",
    "teach": "Park the hands a second — idea first: After click trust, practice breathing time without wandering form length. Humanize the pocket, not the bar count. First win to aim at: Humanize without losing form length. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 315 — Off-Metronome Humanize. Start with: Immediately after click work, play without click. Then: Record and compare length of section to click version. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 315 jam on Off-Metronome Humanize — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 315. Session close. Win check: Play the humanized pass off the metronome, then record one take you would keep."
  },
  "316": {
    "arrive": "Day 316. Settle in — shoulders soft, phone down: Practice one-take pressure safely.",
    "warmup": "Day 316. Shake out, then touch today's material lightly. Light preview — One-take rule for a full section — keep going if you flub; mark it and finish.",
    "teach": "This is the bit that unlocks the rest: Simulate pressure with one-take rules and mild distraction. Recovery > perfection fantasy. Finish sections; recovery under light pressure... First win to aim at: Practice one-take pressure safely. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 316 — Nerves Simulation. Start with: One-take rule for a full section — keep going if you flub; mark it and finish. Then: Add mild distraction (TV low, or stand up) — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 316 jam on Nerves Simulation — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 316. Wind down: one gentle sound, then the win question. Win check: Run the nerves simulation, then record one take you would keep."
  },
  "317": {
    "arrive": "Day 317. Two minutes to show up fully: Intake a second vehicle with form-first method.",
    "warmup": "Day 317. No hero warm-up — just honest prep. Light preview — Choose second vehicle easier or contrasting — keep going if you flub; mark it and finish.",
    "teach": "Teacher hat on for a minute: A second vehicle prevents overfit. Intake method matters more than bravado. Finish sections; recovery under light pressure is part of the... First win to aim at: Intake a second vehicle with form-first method. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 317 — Second Song Start. Start with: Choose second vehicle easier or contrasting — keep going if you flub; mark it and finish. Then: Do intake: form map + section 1 loop — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 317 jam on Second Song Start — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 317. Cool-down — soft hands, honest check. Win check: Start the second song cleanly, then record one take you would keep."
  },
  "318": {
    "arrive": "Day 318. Check posture, then lock the intention: Add a confidence third song.",
    "warmup": "Day 318. Gentle start, then today's shapes. Light preview — Third song should be a confidence piece — keep going if you flub; mark it and finish.",
    "teach": "One clear idea today: Three songs begin a real mini-set. Stagger difficulty so you have a landing pad song when nerves spike. First win to aim at: Add a confidence third song. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 318 — Third Song Start. Start with: Third song should be a confidence piece — keep going if you flub; mark it and finish. Then: Speak a quick form map only, then play from memory. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 318 jam on Third Song Start — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 318. Leave the guitar friendlier than you found it. Win check: Start the third song cleanly, then record one take you would keep."
  },
  "319": {
    "arrive": "Day 319. You are here. That already counts. Intention next: Reset ears with a contrasting vehicle.",
    "warmup": "Day 319. We wake the specific muscles you will need. Light preview — Park current vehicle; select a contrasting song — keep going if you flub; mark it and finish.",
    "teach": "Think of it like this: Swapping vehicles resets ears. Bring one skill from the old song into the new. Finish sections; recovery under light pressure is part of... First win to aim at: Reset ears with a contrasting vehicle. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 319 — Vehicle Swap Day. Start with: Park current vehicle; select a contrasting song — keep going if you flub; mark it and finish. Then: Bring one skill (e.g. dynamics plan) into the new song. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 319 jam on Vehicle Swap Day — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 319. Soft landing. Win check: Swap vehicles, then record one take you would keep."
  },
  "320": {
    "arrive": "Day 320. Land in the chair. One breath. Here is today's aim: Revive an older song with newer skills.",
    "warmup": "Day 320. Easy blood-flow first. Light preview — Revisit an early-course song and notice what feels easier now.",
    "teach": "Here is the heart of it: Reviving an old song with new skills proves growth. Avoid autopilot nostalgia thrash. Finish sections; recovery under light pressure is... First win to aim at: Revive an older song with newer skills. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 320 — Old Song Revival. Start with: Revisit an early-course song and notice what feels easier now. Then: Apply a new skill (mute cleanup or dynamic arc) — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 320 jam on Old Song Revival — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 320. Ease out so tomorrow's hands forgive you. Win check: Revive the old song, then record one take you would keep."
  },
  "321": {
    "arrive": "Day 321. Arrive: tune if you can, then read the win out loud: Follow form → sticky bar → ornaments order.",
    "warmup": "Day 321. Warm the hands for what this day actually asks. Light preview — New song intake checklist on paper — keep going if you flub; mark it and finish.",
    "teach": "Let me put this simply: New song intake: form, groove, sticky bar, then ornaments. Resist full-speed first passes — they encode panic. First win to aim at: Follow form → sticky bar → ornaments order. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 321 — New Song Intake Method. Start with: New song intake checklist on paper — keep going if you flub; mark it and finish. Then: Form first, sticky bar second, ornaments never first. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 321 jam on New Song Intake Method — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 321. Session close. Win check: Use the new-song intake method, then record one take you would keep."
  },
  "322": {
    "arrive": "Day 322. Settle in — shoulders soft, phone down: Learn in phrase units.",
    "warmup": "Day 322. Shake out, then touch today's material lightly. Light preview — Slice section into phrase units of 2–4 bars — keep going if you flub; mark it and finish.",
    "teach": "Before we grind reps: Phrases are memory units. Link only after each phrase is independently solid. Finish sections; recovery under light pressure is part of the... First win to aim at: Learn in phrase units. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 322 — Phrase-by-Phrase Learn. Start with: Slice section into phrase units of 2–4 bars — keep going if you flub; mark it and finish. Then: Master phrase A, phrase B, then A+B only — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 322 jam on Phrase-by-Phrase Learn — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 322. Wind down: one gentle sound, then the win question. Win check: Learn phrase by phrase, then record one take you would keep."
  },
  "323": {
    "arrive": "Day 323. Two minutes to show up fully: Practice the boundary bars where breaks occur.",
    "warmup": "Day 323. No hero warm-up — just honest prep. Light preview — Loop bars spanning the section boundary only — keep going if you flub; mark it and finish.",
    "teach": "Park the hands a second — idea first: Practice across boundaries (last 2 beats of A into first 2 of B) where breaks happen. Finish sections; recovery under light pressure is... First win to aim at: Practice the boundary bars where breaks occur. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 323 — Chunk Boundary Practice. Start with: Loop bars spanning the section boundary only — keep going if you flub; mark it and finish. Then: Slow the boundary 20% under section tempo — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 323 jam on Chunk Boundary Practice — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 323. Cool-down — soft hands, honest check. Win check: Practice the chunk boundaries, then record one take you would keep."
  },
  "324": {
    "arrive": "Day 324. Check posture, then lock the intention: Use slow/medium/near-goal rungs.",
    "warmup": "Day 324. Gentle start, then today's shapes. Light preview — Three tempos on metronome: slow / medium / goal-1.",
    "teach": "This is the bit that unlocks the rest: Secure slow, musical medium, careful faster. Never skip the middle rung or the fast take is just a messy slow take. First win to aim at: Use slow/medium/near-goal rungs. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 324 — Slow–Full–Fast Ladder. Start with: Three tempos on metronome: slow / medium / goal-1. Then: Two clean runs required to graduate a rung — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 324 jam on Slow–Full–Fast Ladder — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 324. Leave the guitar friendlier than you found it. Win check: Climb the slow–full–fast ladder, then record one take you would keep."
  },
  "325": {
    "arrive": "Day 325. You are here. That already counts. Intention next: Isolate each hand's job.",
    "warmup": "Day 325. We wake the specific muscles you will need. Light preview — Right hand pattern on open strings or muted — keep going if you flub; mark it and finish.",
    "teach": "Teacher hat on for a minute: Right hand alone, left hand alone, then marry. Isolation finds the true culprit. Finish sections; recovery under light pressure is part of... First win to aim at: Isolate each hand's job. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 325 — Hands Separate Practice. Start with: Right hand pattern on open strings or muted — keep going if you flub; mark it and finish. Then: Left hand fretting silent movie (no strum) through changes. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 325 jam on Hands Separate Practice — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 325. Soft landing. Win check: Practice hands separately, then record one take you would keep."
  },
  "326": {
    "arrive": "Day 326. Land in the chair. One breath. Here is today's aim: Rehearse mentally with real bar counts.",
    "warmup": "Day 326. Easy blood-flow first. Light preview — Away from guitar: visualize fretting through one section.",
    "teach": "One clear idea today: Mental rehearsal activates motor plans. Visualize frets and count form silently. Finish sections; recovery under light pressure is part of... First win to aim at: Rehearse mentally with real bar counts. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 326 — Mental Practice Away From Guitar. Start with: Away from guitar: visualize fretting through one section. Then: Count the form silently with eyes closed — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 326 jam on Mental Practice Away From Guitar — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 326. Ease out so tomorrow's hands forgive you. Win check: Do the mental practice, then record one take you would keep."
  },
  "327": {
    "arrive": "Day 327. Arrive: tune if you can, then read the win out loud: Catch posture and panic motion on video.",
    "warmup": "Day 327. Warm the hands for what this day actually asks. Light preview — Film one section once and note one fix afterward.",
    "teach": "Think of it like this: Video shows posture and panic motions audio misses. Watch once muted, once with sound. Finish sections; recovery under light pressure is... First win to aim at: Catch posture and panic motion on video. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 327 — Video Self Review. Start with: Film one section once and note one fix afterward. Then: Watch the video muted once and only grade posture and tension. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 327 jam on Video Self Review — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 327. Session close. Win check: Review the video take, then record one take you would keep."
  },
  "328": {
    "arrive": "Day 328. Settle in — shoulders soft, phone down: Judge time and tone without visual distraction.",
    "warmup": "Day 328. Shake out, then touch today's material lightly. Light preview — Do one audio-only take and listen back once — keep going if you flub; mark it and finish.",
    "teach": "Here is the heart of it: Audio review without a mirror focuses time and tone. Timestamp one fix only so the next loop has a job. First win to aim at: Judge time and tone without visual distraction. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 328 — Audio Self Review. Start with: Do one audio-only take and listen back once — keep going if you flub; mark it and finish. Then: Listen back without looking at your hands — ear-only critique. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 328 jam on Audio Self Review — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 328. Wind down: one gentle sound, then the win question. Win check: Review the audio take, then record one take you would keep."
  },
  "329": {
    "arrive": "Day 329. Two minutes to show up fully: If sharing, ask for one targeted note.",
    "warmup": "Day 329. No hero warm-up — just honest prep. Light preview — Optional: share a 30–60s clip with someone kind — or just archive it.",
    "teach": "Let me put this simply: If you share, ask for one specific feedback target, not global judgment. Clear questions get useful answers. First win to aim at: If sharing, ask for one targeted note. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 329 — Peer Share Optional. Start with: Optional: share a 30–60s clip with someone kind — or just archive it. Then: Ask one question (e.g. 'does chorus lift?') — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 329 jam on Peer Share Optional — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 329. Cool-down — soft hands, honest check. Win check: Share with a peer if you like, then record one take you would keep."
  },
  "330": {
    "arrive": "Day 330. Check posture, then lock the intention: Explain the section aloud clearly.",
    "warmup": "Day 330. Gentle start, then today's shapes. Light preview — Explain section fretting aloud as if teaching — keep going if you flub; mark it and finish.",
    "teach": "Before we grind reps: Teaching forces clarity. Explain fingering and count-in as if a friend holds the guitar. Finish sections; recovery under light pressure is... First win to aim at: Explain the section aloud clearly. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 330 — Teach a Section Aloud. Start with: Explain section fretting aloud as if teaching — keep going if you flub; mark it and finish. Then: Give yourself a count-in and demo at student tempo. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 330 jam on Teach a Section Aloud — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 330. Leave the guitar friendlier than you found it. Win check: Teach a section aloud, then record one take you would keep."
  },
  "331": {
    "arrive": "Day 331. You are here. That already counts. Intention next: Cut ornaments until consistency returns.",
    "warmup": "Day 331. We wake the specific muscles you will need. Light preview — Remove ornaments from highest-error section — keep going if you flub; mark it and finish.",
    "teach": "Park the hands a second — idea first: If error rate is high, remove ornaments. Consistency is a feature audiences feel. Finish sections; recovery under light pressure is part of... First win to aim at: Cut ornaments until consistency returns. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 331 — Simplify for Consistency. Start with: Remove ornaments from highest-error section — keep going if you flub; mark it and finish. Then: Play simplified version 5 clean times — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 331 jam on Simplify for Consistency — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 331. Soft landing. Win check: Play the simplified version 5 clean times, then record one take you would keep."
  },
  "332": {
    "arrive": "Day 332. Land in the chair. One breath. Here is today's aim: Ornament only on solid skeletons.",
    "warmup": "Day 332. Easy blood-flow first. Light preview — Do a skeleton take first — form only, no ornaments.",
    "teach": "This is the bit that unlocks the rest: Add slides, hammers, or bass walks only on a stable skeleton. Ornaments on a wobbly form just decorate the wobble. First win to aim at: Ornament only on solid skeletons. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 332 — Ornament After Solid. Start with: Do a skeleton take first — form only, no ornaments. Then: Add one ornament type only (slide or hammer) — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 332 jam on Ornament After Solid — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 332. Ease out so tomorrow's hands forgive you. Win check: Add ornaments after the solid skeleton, then record one take you would keep."
  },
  "333": {
    "arrive": "Day 333. Arrive: tune if you can, then read the win out loud: Create one signature lick.",
    "warmup": "Day 333. Warm the hands for what this day actually asks. Light preview — Write a 1-bar signature lick you could play half-asleep.",
    "teach": "Teacher hat on for a minute: One signature lick placed well beats five random fills. Put it where form breathes. Finish sections; recovery under light pressure is part... First win to aim at: Create one signature lick. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 333 — Signature Lick Placement. Start with: Write a 1-bar signature lick you could play half-asleep. Then: Place it in the same form location each time — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 333 jam on Signature Lick Placement — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 333. Session close. Win check: Place the signature lick, then record one take you would keep."
  },
  "334": {
    "arrive": "Day 334. Settle in — shoulders soft, phone down: Schedule silence as arrangement.",
    "warmup": "Day 334. Shake out, then touch today's material lightly. Light preview — Schedule a one-bar near-silence before chorus — keep going if you flub; mark it and finish.",
    "teach": "One clear idea today: Schedule rests as arrangement. Silence before a chorus can lift harder than more strums. Finish sections; recovery under light pressure is... First win to aim at: Schedule silence as arrangement. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 334 — Silence Schedule in the Song. Start with: Schedule a one-bar near-silence before chorus — keep going if you flub; mark it and finish. Then: Protect that silence in every run — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 334 jam on Silence Schedule in the Song — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 334. Wind down: one gentle sound, then the win question. Win check: Play the silence schedule, then record one take you would keep."
  },
  "335": {
    "arrive": "Day 335. Two minutes to show up fully: Start from true silence with a count-in.",
    "warmup": "Day 335. No hero warm-up — just honest prep. Light preview — Hands ready, true silence, then count-in — keep going if you flub; mark it and finish.",
    "teach": "Think of it like this: Starting from silence trains confident first hits. Count in; don't sneak noise. Finish sections; recovery under light pressure is part of... First win to aim at: Start from true silence with a count-in. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 335 — Intro From Silence. Start with: Hands ready, true silence, then count-in — keep going if you flub; mark it and finish. Then: First hit confident mf, not accidental graze — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 335 jam on Intro From Silence — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 335. Cool-down — soft hands, honest check. Win check: Start from silence, then record one take you would keep."
  },
  "336": {
    "arrive": "Day 336. Check posture, then lock the intention: Cut off together with yourself.",
    "warmup": "Day 336. Gentle start, then today's shapes. Light preview — Final hit, mute, still body — hold the quiet like part of the song.",
    "teach": "Here is the heart of it: Cold endings stop together. Practice the final hit and the still body after. Finish sections; recovery under light pressure is part of the... First win to aim at: Cut off together with yourself. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 336 — Cold Ending Practice. Start with: Final hit, mute, still body — hold the quiet like part of the song. Then: No string noise after cutoff — right hand parks clean. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 336 jam on Cold Ending Practice — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 336. Leave the guitar friendlier than you found it. Win check: Practice the cold ending, then record one take you would keep."
  },
  "337": {
    "arrive": "Day 337. You are here. That already counts. Intention next: Decide tag length and dynamics.",
    "warmup": "Day 337. We wake the specific muscles you will need. Light preview — Decide tag length (1 or 2 repeats) — keep going if you flub; mark it and finish.",
    "teach": "Let me put this simply: Tags repeat a final hook. Decide how many repeats before the button ending so you do not improvise yourself into a corner. First win to aim at: Decide tag length and dynamics. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 337 — Tag Ending Practice. Start with: Decide tag length (1 or 2 repeats) — keep going if you flub; mark it and finish. Then: Practice the tag into a firm button ending without extra hits. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 337 jam on Tag Ending Practice — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 337. Soft landing. Win check: Practice the tag ending, then record one take you would keep."
  },
  "338": {
    "arrive": "Day 338. Land in the chair. One breath. Here is today's aim: Treat key lift as optional drama.",
    "warmup": "Day 338. Easy blood-flow first. Light preview — Optional last-chorus capo or shape shift only if base key solid.",
    "teach": "Before we grind reps: A late key lift is optional drama. Only attempt if the original key is already solid. Finish sections; recovery under light pressure is... First win to aim at: Treat key lift as optional drama. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 338 — Key Change Taste Optional. Start with: Optional last-chorus capo or shape shift only if base key solid. Then: Practice the modulation moment 10 times slowly — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 338 jam on Key Change Taste Optional — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 338. Ease out so tomorrow's hands forgive you. Win check: Try the key change, then record one take you would keep."
  },
  "339": {
    "arrive": "Day 339. Arrive: tune if you can, then read the win out loud: Make bass walk clear and slow first.",
    "warmup": "Day 339. Warm the hands for what this day actually asks. Light preview — Write bass walk into a new tonal center — keep going if you flub; mark it and finish.",
    "teach": "Park the hands a second — idea first: Walkups into a new key need clear bass motion. Slow is mandatory at first — name the notes so the ear learns the door. First win to aim at: Make bass walk clear and slow first. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 339 — Modulation Walkup. Start with: Write bass walk into a new tonal center — keep going if you flub; mark it and finish. Then: Slow walk the modulation with named notes under your breath. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 339 jam on Modulation Walkup — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 339. Session close. Win check: Play the modulation walkup, then record one take you would keep."
  },
  "340": {
    "arrive": "Day 340. Settle in — shoulders soft, phone down: Place stop-time hits with strict rests.",
    "warmup": "Day 340. Shake out, then touch today's material lightly. Light preview — Design 2 bars of stop-time hits inside the song — keep going if you flub; mark it and finish.",
    "teach": "This is the bit that unlocks the rest: Stop-time inside a song is theater. Hits must be agreed with your own click sense. Finish sections; recovery under light pressure is part... First win to aim at: Place stop-time hits with strict rests. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 340 — Stop-Time Section. Start with: Design 2 bars of stop-time hits inside the song — keep going if you flub; mark it and finish. Then: Practice with click and strict rests — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 340 jam on Stop-Time Section — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 340. Wind down: one gentle sound, then the win question. Win check: Play the stop-time section, then record one take you would keep."
  },
  "341": {
    "arrive": "Day 341. Two minutes to show up fully: Build a true sparse breakdown.",
    "warmup": "Day 341. No hero warm-up — just honest prep. Light preview — Strip section to skeleton (roots or light chops).",
    "teach": "Teacher hat on for a minute: Breakdowns strip texture. Practice the sparse version so rebuilds feel huge. Finish sections; recovery under light pressure is part of the... First win to aim at: Build a true sparse breakdown. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 341 — Breakdown Section. Start with: Strip section to skeleton (roots or light chops). Then: Loop the sticky 8 bars until the hitch disappears twice in a row. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 341 jam on Breakdown Section — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 341. Cool-down — soft hands, honest check. Win check: Play the breakdown section, then record one take you would keep."
  },
  "342": {
    "arrive": "Day 342. Check posture, then lock the intention: Differentiate final chorus with one lift.",
    "warmup": "Day 342. Gentle start, then today's shapes. Light preview — Final chorus adds one lift element only — keep going if you flub; mark it and finish.",
    "teach": "One clear idea today: Final chorus lift can be higher voicing, fuller strums, or a harmony hint — pick one, not all three at once. First win to aim at: Differentiate final chorus with one lift. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 342 — Final Chorus Plus. Start with: Final chorus adds one lift element only — keep going if you flub; mark it and finish. Then: Practice penultimate vs final chorus back-to-back. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 342 jam on Final Chorus Plus — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 342. Leave the guitar friendlier than you found it. Win check: Play the final chorus plus, then record one take you would keep."
  },
  "343": {
    "arrive": "Day 343. You are here. That already counts. Intention next: Fake ending only after real ending exists.",
    "warmup": "Day 343. We wake the specific muscles you will need. Light preview — Play fake ending gesture, then continue tag — keep going if you flub; mark it and finish.",
    "teach": "Think of it like this: False endings play with expectation. Only funny if the real ending is secure. Finish sections; recovery under light pressure is part of the... First win to aim at: Fake ending only after real ending exists. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 343 — False Ending Fun. Start with: Play fake ending gesture, then continue tag — keep going if you flub; mark it and finish. Then: Only if real ending is already solid — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 343 jam on False Ending Fun — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 343. Soft landing. Win check: Try the false ending, then record one take you would keep."
  },
  "344": {
    "arrive": "Day 344. Land in the chair. One breath. Here is today's aim: Write a short bridge between songs.",
    "warmup": "Day 344. Easy blood-flow first. Light preview — Write 2–4 bar bridge between two repertoire songs.",
    "teach": "Here is the heart of it: Medley bridges can be a shared chord, a drum-fill feel, or a held note. The seam should feel inevitable, not clever-for-clever. First win to aim at: Write a short bridge between songs. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 344 — Medley Bridge Writing. Start with: Write 2–4 bar bridge between two repertoire songs. Then: Shared chord or drum-like hits as glue — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 344 jam on Medley Bridge Writing — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 344. Ease out so tomorrow's hands forgive you. Win check: Write the medley bridge, then record one take you would keep."
  },
  "345": {
    "arrive": "Day 345. Arrive: tune if you can, then read the win out loud: Externalize wins and next actions.",
    "warmup": "Day 345. Warm the hands for what this day actually asks. Light preview — Write 5 lines: wins, sticky bar, tempo, energy, next action.",
    "teach": "Let me put this simply: Journal what improved and what is next. Written goals outperform mood memory. Finish sections; recovery under light pressure is part of the... First win to aim at: Externalize wins and next actions. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 345 — Repertoire Journaling. Start with: Write 5 lines: wins, sticky bar, tempo, energy, next action. Then: Circle one next action only in the journal — ignore the rest. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 345 jam on Repertoire Journaling — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 345. Session close. Win check: Journal the repertoire wins, then record one take you would keep."
  },
  "346": {
    "arrive": "Day 346. Settle in — shoulders soft, phone down: Pick BPM from evidence not ego.",
    "warmup": "Day 346. Shake out, then touch today's material lightly. Light preview — Candidate tempos: safe / stretch / ego — keep going if you flub; mark it and finish.",
    "teach": "Before we grind reps: Choose a goal tempo with evidence — singability and clean changes — not ego. Write the number down so practice has a target. First win to aim at: Pick BPM from evidence not ego. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 346 — Goal Tempo Decision. Start with: Candidate tempos: safe / stretch / ego — keep going if you flub; mark it and finish. Then: Test eight bars at each tempo step before speeding. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 346 jam on Goal Tempo Decision — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 346. Wind down: one gentle sound, then the win question. Win check: Decide the goal tempo, then record one take you would keep."
  },
  "347": {
    "arrive": "Day 347. Two minutes to show up fully: Stay loyal to practice BPM for the session.",
    "warmup": "Day 347. No hero warm-up — just honest prep. Light preview — Whole session loyal to practice BPM — keep going if you flub; mark it and finish.",
    "teach": "Park the hands a second — idea first: Stay at practice tempo until error rate drops. Loyalty beats random speeding. Finish sections; recovery under light pressure is part of the... First win to aim at: Stay loyal to practice BPM for the session. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 347 — Practice Tempo Loyalty. Start with: Whole session loyal to practice BPM — keep going if you flub; mark it and finish. Then: If clean, tiny +2 BPM at end optional — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 347 jam on Practice Tempo Loyalty — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 347. Cool-down — soft hands, honest check. Win check: Stay loyal to the practice tempo, then record one take you would keep."
  },
  "348": {
    "arrive": "Day 348. Check posture, then lock the intention: Commit to a performance BPM before the take.",
    "warmup": "Day 348. Gentle start, then today's shapes. Light preview — Choose performance BPM before the take — keep going if you flub; mark it and finish.",
    "teach": "This is the bit that unlocks the rest: On take day, pick a courageous-but-kind tempo and commit without mid-song renegotiation. Finish sections; recovery under light pressure is... First win to aim at: Commit to a performance BPM before the take. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 348 — Performance Tempo Courage. Start with: Choose performance BPM before the take — keep going if you flub; mark it and finish. Then: Count-in at that BPM out loud, then play — no mystery starts. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 348 jam on Performance Tempo Courage — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 348. Leave the guitar friendlier than you found it. Win check: Try the performance tempo with courage, then record one take you would keep."
  },
  "349": {
    "arrive": "Day 349. You are here. That already counts. Intention next: Allow a small error budget and finish anyway.",
    "warmup": "Day 349. We wake the specific muscles you will need. Light preview — Allow up to 2 visible errors without stopping — keep going if you flub; mark it and finish.",
    "teach": "Teacher hat on for a minute: Allow a small error budget in performance takes. Finish the story anyway; the audience remembers completion more than one flub. First win to aim at: Allow a small error budget and finish anyway. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 349 — Error Budget Acceptance. Start with: Allow up to 2 visible errors without stopping — keep going if you flub; mark it and finish. Then: Practice finishing the phrase anyway after a small mistake. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 349 jam on Error Budget Acceptance — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 349. Soft landing. Win check: Accept the error budget, then record one take you would keep."
  },
  "350": {
    "arrive": "Day 350. Land in the chair. One breath. Here is today's aim: Use exhale+smile as a reset tool.",
    "warmup": "Day 350. Easy blood-flow first. Light preview — At sticky bar, exhale and slight smile on purpose.",
    "teach": "One clear idea today: A smile and exhale resets nervous system tempo. Build it into sticky moments. Finish sections; recovery under light pressure is part of the... First win to aim at: Use exhale+smile as a reset tool. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 350 — Smile and Breathe Reset. Start with: At sticky bar, exhale and slight smile on purpose. Then: Rehearse smile reset 10 times on that bar — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 350 jam on Smile and Breathe Reset — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 350. Ease out so tomorrow's hands forgive you. Win check: Use the smile-and-breathe reset, then record one take you would keep."
  },
  "351": {
    "arrive": "Day 351. Arrive: tune if you can, then read the win out loud: Make a minimal repeatable stage plot.",
    "warmup": "Day 351. Warm the hands for what this day actually asks. Light preview — Place chart, pick, water in consistent spots — keep going if you flub; mark it and finish.",
    "teach": "Think of it like this: Know where tab/chart, pick, and water live. Minimal plots reduce panic searches. Finish sections; recovery under light pressure is part of... First win to aim at: Make a minimal repeatable stage plot. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 351 — Stage Plot Minimal. Start with: Place chart, pick, water in consistent spots — keep going if you flub; mark it and finish. Then: Rehearse grabbing pick without looking — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 351 jam on Stage Plot Minimal — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 351. Session close. Win check: Play the minimal stage plot, then record one take you would keep."
  },
  "352": {
    "arrive": "Day 352. Settle in — shoulders soft, phone down: Run a boring gear checklist.",
    "warmup": "Day 352. Shake out, then touch today's material lightly. Light preview — Checklist: tuning, strap, cable/path, battery/pick reserve.",
    "teach": "Here is the heart of it: Cable, tuning, strap, battery — boring gear rituals prevent exciting failures. Run the list aloud before the first note. First win to aim at: Run a boring gear checklist. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 352 — Gear Check Ritual. Start with: Checklist: tuning, strap, cable/path, battery/pick reserve. Then: Run the gear checklist aloud once before you play a note. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 352 jam on Gear Check Ritual — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 352. Wind down: one gentle sound, then the win question. Win check: Run the gear check ritual, then record one take you would keep."
  },
  "353": {
    "arrive": "Day 353. Two minutes to show up fully: Tune intentionally before keep takes.",
    "warmup": "Day 353. No hero warm-up — just honest prep. Light preview — Play the full tune once at the start as a baseline.",
    "teach": "Let me put this simply: Tune with intention before takes. Quick checks between songs save public wince. Finish sections; recovery under light pressure is part of... First win to aim at: Tune intentionally before keep takes. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 353 — Tuning Check Ritual. Start with: Play the full tune once at the start as a baseline. Then: Quick check after vigorous sections — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 353 jam on Tuning Check Ritual — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 353. Cool-down — soft hands, honest check. Win check: Run the tuning check ritual, then record one take you would keep."
  },
  "354": {
    "arrive": "Day 354. Check posture, then lock the intention: Estimate real set length with buffers.",
    "warmup": "Day 354. Gentle start, then today's shapes. Light preview — Estimate each song length at performance tempo — keep going if you flub; mark it and finish.",
    "teach": "Before we grind reps: Estimate song lengths including talk. Timing math prevents cutting the closer. Finish sections; recovery under light pressure is part of... First win to aim at: Estimate real set length with buffers. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 354 — Setlist Timing Math. Start with: Estimate each song length at performance tempo — keep going if you flub; mark it and finish. Then: Add 10–20s talk/tune buffer between songs — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 354 jam on Setlist Timing Math — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 354. Leave the guitar friendlier than you found it. Win check: Check the setlist timing math, then record one take you would keep."
  },
  "355": {
    "arrive": "Day 355. You are here. That already counts. Intention next: Decide encore or no encore in advance.",
    "warmup": "Day 355. We wake the specific muscles you will need. Light preview — Decide encore song or decide none — keep going if you flub; mark it and finish.",
    "teach": "Park the hands a second — idea first: Plan encore if energy remains; otherwise bow out strong. Decided endings feel pro. Finish sections; recovery under light pressure is part... First win to aim at: Decide encore or no encore in advance. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 355 — Encore Decision Logic. Start with: Decide encore song or decide none — keep going if you flub; mark it and finish. Then: If encore, keep it easy and beloved — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 355 jam on Encore Decision Logic — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 355. Soft landing. Win check: Apply the encore decision logic, then record one take you would keep."
  },
  "356": {
    "arrive": "Day 356. Land in the chair. One breath. Here is today's aim: Run two songs with a real reset between.",
    "warmup": "Day 356. Easy blood-flow first. Light preview — Run song A all the way through without stopping — keep going if you flub; mark it and finish.",
    "teach": "This is the bit that unlocks the rest: Two songs back-to-back train the seams: tune, take a breath, count in, and go without freezing. Finish sections; recovery under light... First win to aim at: Run two songs with a real reset between. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 356 — Two-Song Mini Set. Start with: Run song A all the way through without stopping — keep going if you flub; mark it and finish. Then: Take 60 seconds to tune, breathe, and set posture. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 356 jam on Two-Song Mini Set — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 356. Ease out so tomorrow's hands forgive you. Win check: Play song A and song B with a controlled reset between them."
  },
  "357": {
    "arrive": "Day 357. Arrive: tune if you can, then read the win out loud: Run three songs for stamina and arc.",
    "warmup": "Day 357. Warm the hands for what this day actually asks. Light preview — Run three songs with short resets — keep going if you flub; mark it and finish.",
    "teach": "Teacher hat on for a minute: Three songs reveal stamina and set arc. Keep one easy landing-pad song so the set can recover if something wobbles. First win to aim at: Run three songs for stamina and arc. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 357 — Three-Song Mini Set. Start with: Run three songs with short resets — keep going if you flub; mark it and finish. Then: Watch stamina on song 3 — if the hand dies, simplify the part, do not push through trash. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 357 jam on Three-Song Mini Set — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 357. Session close. Win check: Play a three-song mini-set with intentional order and surviving stamina."
  },
  "358": {
    "arrive": "Day 358. Settle in — shoulders soft, phone down: Complete a full run with chart allowed.",
    "warmup": "Day 358. Shake out, then touch today's material lightly. Light preview — Full song with the chart allowed — aim for musical, not heroic.",
    "teach": "One clear idea today: Full runs with chart allowed still require musical continuity and recovery. Finish sections; recovery under light pressure is part of the... First win to aim at: Complete a full run with chart allowed. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Slow enough that form stays honest for day 358 — Full Run With Notes. Start with: Full song with the chart allowed — aim for musical, not heroic. Then: No stopping for anything but safety — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Let the hands make a little story. Day 358 jam on Full Run With Notes — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 358. Wind down: one gentle sound, then the win question. Win check: Play a full run with notes, then record one take you would keep."
  },
  "359": {
    "arrive": "Day 359. Two minutes to show up fully: Complete a memory run with recovery rules.",
    "warmup": "Day 359. No hero warm-up — just honest prep. Light preview — Chart face down or app closed — memory run, gentle tempo.",
    "teach": "Think of it like this: Memory runs expose cue gaps. Mark only the true danger spots afterward — not every imperfect bar. Finish sections; recovery under light... First win to aim at: Complete a memory run with recovery rules. Serve the song section — polish the join, not just the fun bar.",
    "guided": "We will work the list in order for day 359 — Full Run No Notes. Start with: Chart face down or app closed — memory run, gentle tempo. Then: Full run with recovery rules on — no shame stops mid-song. Full-section passes beat restarting the first bar forever.",
    "jam": "Fun pass: same skills, less judgment. Day 359 jam on Full Run No Notes — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 359. Cool-down — soft hands, honest check. Win check: Finish a no-chart run using recovery, then mark only true danger spots."
  },
  "360": {
    "arrive": "Day 360. Check posture, then lock the intention: Use performance rules for a primary full take.",
    "warmup": "Day 360. Gentle start, then today's shapes. Light preview — Performance clothing optional; performance rules mandatory.",
    "teach": "Here is the heart of it: Dress rehearsal means limited stops, full recovery rules, and real tempo. Practice the show energy, not only the notes. First win to aim at: Use performance rules for a primary full take. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Now we earn it with clean reps for day 360 — Dress Rehearsal Energy. Start with: Performance clothing optional; performance rules mandatory. Then: One primary full take — start to end, no stopping to fix mid-song. Full-section passes beat restarting the first bar forever.",
    "jam": "Play window — make it sound like a song fragment. Day 360 jam on Dress Rehearsal Energy — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 360. Leave the guitar friendlier than you found it. Win check: Complete a dress-rehearsal take under performance rules at committed tempo."
  },
  "361": {
    "arrive": "Day 361. You are here. That already counts. Intention next: Keep hands light and minutes short.",
    "warmup": "Day 361. We wake the specific muscles you will need. Light preview — Touch intros and endings only — leave middles for later.",
    "teach": "Let me put this simply: Light days protect hands. Touch the starts and endings; avoid grinding mistakes. Finish sections; recovery under light pressure is part of... First win to aim at: Keep hands light and minutes short. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Reps with intention for day 361 — Pre-Show Light Day. Start with: Touch intros and endings only — leave middles for later. Then: Light hands, short minutes — protect the hands before show day. Full-section passes beat restarting the first bar forever.",
    "jam": "Jam: stop drilling, start saying something. Day 361 jam on Pre-Show Light Day — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 361. Soft landing. Win check: Do the pre-show light pass, then record one take you would keep."
  },
  "362": {
    "arrive": "Day 362. Land in the chair. One breath. Here is today's aim: Score each section honestly.",
    "warmup": "Day 362. Easy blood-flow first. Light preview — Run each section of vehicle song for quality — keep going if you flub; mark it and finish.",
    "teach": "Before we grind reps: Capstone A prioritizes section quality and form clarity over full-set bravado. Finish sections; recovery under light pressure is part of... First win to aim at: Score each section honestly. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Practice loop time for day 362 — Capstone Rehearsal A — Sections. Start with: Run each section of vehicle song for quality — keep going if you flub; mark it and finish. Then: Don't require full set stamina yet — one keepable take beats five restarts. Full-section passes beat restarting the first bar forever.",
    "jam": "Music time — put the lesson inside something that grooves. Day 362 jam on Capstone Rehearsal A — Sections — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 362. Ease out so tomorrow's hands forgive you. Win check: Play the sections cleanly, then record one take you would keep."
  },
  "363": {
    "arrive": "Day 363. Arrive: tune if you can, then read the win out loud: Make seams the hero of the day.",
    "warmup": "Day 363. Warm the hands for what this day actually asks. Light preview — Only seams and transitions today — keep going if you flub; mark it and finish.",
    "teach": "Park the hands a second — idea first: Capstone B is about the seams — intros, endings, and the air between songs — not only the middle grooves. First win to aim at: Make seams the hero of the day. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Guided block — your drills, my pacing for day 363 — Capstone Rehearsal B — Transitions. Start with: Only seams and transitions today — keep going if you flub; mark it and finish. Then: Intro, section links, ending, song-to-song if multi. Full-section passes beat restarting the first bar forever.",
    "jam": "Loose on purpose — still in time. Day 363 jam on Capstone Rehearsal B — Transitions — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 363. Session close. Win check: Play the transitions cleanly, then record one take you would keep."
  },
  "364": {
    "arrive": "Day 364. Settle in — shoulders soft, phone down: Tell the full story under recovery rules.",
    "warmup": "Day 364. Shake out, then touch today's material lightly. Light preview — Full story run with recovery rules — keep going if you flub; mark it and finish.",
    "teach": "This is the bit that unlocks the rest: Capstone C is a full story run with recovery rules and kind notes after. You are rehearsing the year, not hunting perfection. First win to aim at: Tell the full story under recovery rules. Serve the song section — polish the join, not just the fun bar.",
    "guided": "This is the gym section for day 364 — Capstone Rehearsal C — Full Story. Start with: Full story run with recovery rules — keep going if you flub; mark it and finish. Then: Record the take if possible and keep the best one. Full-section passes beat restarting the first bar forever.",
    "jam": "This is the part you came for. Day 364 jam on Capstone Rehearsal C — Full Story — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 364. Wind down: one gentle sound, then the win question. Win check: Complete a full story run with recovery rules and kind written notes after."
  },
  "365": {
    "arrive": "Day 365. Two minutes to show up fully: Warm up with something easy that sounds like you.",
    "warmup": "Day 365. No hero warm-up — just honest prep. Light preview — Light warm-up: open strings or easiest song section for three minutes.",
    "teach": "Teacher hat on for a minute: Year capstone: show a path, not perfection. Warm up kindly, run a short set with recovery skills, and leave knowing what you own. Mastery... First win to aim at: Warm up with something easy that sounds like you. Serve the song section — polish the join, not just the fun bar.",
    "guided": "Hands-on stretch for day 365 — Year Capstone — Full Path Performance. Start with: Light warm-up: open strings or easiest song section for three minutes. Then: Full run of your set once with notes allowed, once with fewer notes. Full-section passes beat restarting the first bar forever.",
    "jam": "Song-shaped minutes. Day 365 jam on Year Capstone — Full Path Performance — One keep-take mindset: recover in character if you flub.",
    "cooldown": "Day 365. Cool-down — soft hands, honest check. Win check: Complete a short set you would play for a friend, with recovery and a clear ending."
  }
} as const

export const SESSION_COACH: Record<number, DaySessionCoach> = Object.fromEntries(
  Object.entries(SESSION_COACH_JSON).map(([k, v]) => [Number(k), v]),
) as Record<number, DaySessionCoach>

export function sessionCoachFor(day: number): DaySessionCoach | undefined {
  return SESSION_COACH[day]
}
