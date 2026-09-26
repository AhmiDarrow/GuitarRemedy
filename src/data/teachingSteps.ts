import type { Lesson } from './curriculum'

export interface TeachingStep {
  title: string
  instruction: string
}

// Explicit actions for the first two weeks. No automatic sentence splitting:
// finger positions and counting instructions must stay together.
const EARLY_STEPS: Record<number, TeachingStep[]> = {
  1: [
    { title: 'Find the thickest string', instruction: 'Rest the guitar comfortably. Leave the hand that presses the strings off the neck. Pluck the thickest string once. Its name is low E.' },
    { title: 'Name the six strings', instruction: 'Move from the thickest string to the thinnest: E, A, D, G, B, E. Pluck one string at a time and say its name.' },
    { title: 'Let each note ring', instruction: 'Pluck each string again. Count “1, 2” before moving to the next. Keep both hands clear of the string while it rings.' },
    { title: 'Try without looking', instruction: 'Look away from the string names. Say each name as you pluck from thickest to thinnest. If you forget, check the names and try again.' },
  ],
  2: [
    { title: 'Place one fingertip', instruction: 'Use the thinnest E string. Place your index fingertip just before the first metal fret wire, on the side nearer the tuning pegs. Pick the string once.' },
    { title: 'Find a light touch', instruction: 'Slowly ease the pressure until the note buzzes. Add just enough pressure to make it clear again. Keep the fingertip close to the fret wire.' },
    { title: 'Add the other fingers', instruction: 'Play fret 1 with index, fret 2 with middle, fret 3 with ring, and fret 4 with little finger. Play one note at a time on the same string.' },
    { title: 'Give the notes equal time', instruction: 'Repeat 1–2–3–4 slowly with equal gaps. When that feels comfortable, use a metronome at 50 beats per minute, one note per click. Work toward the 60 BPM target later.' },
  ],
  3: [
    { title: 'Place the first finger', instruction: 'Put your middle fingertip on the A string, fret 2. The A string is the second-thickest string.' },
    { title: 'Place the second finger', instruction: 'Put your ring fingertip on the D string, fret 2. D is the next string toward the floor. Leave the other four strings open: do not press them.' },
    { title: 'Check one string at a time', instruction: 'Pick all six strings, thickest to thinnest. If one is silent or buzzy, adjust the nearby fingertip and pick that string again.' },
    { title: 'Play eight slow strums', instruction: 'Count “1, 2, 3, 4” slowly. Brush down across all six strings on 1 and 3. Repeat the count four times for eight strums. This chord is E minor, written Em.' },
  ],
  4: [
    { title: 'Build G', instruction: 'Place middle finger on low E fret 3, index on A fret 2, and ring on the thinnest E fret 3. Leave D, G, and B open.' },
    { title: 'Check the sound', instruction: 'Pick each string separately, then strum all six together. Adjust any finger that touches a neighboring open string.' },
    { title: 'Change from Em to G', instruction: 'Play one Em strum. Count eight slow beats while moving to G. Strum G on the next count 1. Give yourself another eight counts to return to Em.' },
    { title: 'Repeat the change', instruction: 'Repeat Em → G four times. Shorten the pause only when both chords ring clearly. Then try today’s target below.' },
  ],
  5: [
    { title: 'Build C', instruction: 'Place ring finger on A fret 3, middle on D fret 2, and index on B fret 1. Leave the G and thinnest E strings open.' },
    { title: 'Start on the A string', instruction: 'Pick from the A string toward the thinnest E, one string at a time. Leave out the thickest E string. You should hear five notes.' },
    { title: 'Strum five strings', instruction: 'Keep the shape and brush down from A to the thinnest E. Repeat four times slowly. Check that your index finger leaves the thinnest E free to ring.' },
    { title: 'Connect C and G', instruction: 'Strum C once, count four slow beats, then strum G. Count four more beats and return to C. Repeat twice. Take more time to change if needed.' },
  ],
  6: [
    { title: 'Build D', instruction: 'Place index on G fret 2, ring on B fret 3, and middle on the thinnest E fret 2. The D string stays open.' },
    { title: 'Use only four strings', instruction: 'Pick D, G, B, and the thinnest E separately. Then strum those four together. Leave out the thickest E and A strings.' },
    { title: 'Practice C to D', instruction: 'Strum C, then take four slow counts to form D. Strum D on the next count 1. Repeat the change three times.' },
    { title: 'Join G, C, and D', instruction: 'Play G → C → D → G. Give each chord four slow counts, with one strum on count 1. Start again after the last G.' },
  ],
  7: [
    { title: 'Choose a comfortable speed', instruction: 'Count “1, 2, 3, 4” at a pace that gives you time to change chords. A metronome is optional at first.' },
    { title: 'Play the four chords', instruction: 'Play Em → G → C → D, with four counts per chord. Strum once on count 1. Repeat the loop twice.' },
    { title: 'Fix one change', instruction: 'Choose the change that took longest. Practice just that pair three times. Give each chord eight counts if four feels rushed.' },
    { title: 'Keep the music going', instruction: 'Return to the four-chord loop. Aim for two minutes at your comfortable pace. If you miss a chord, keep counting and join again on the next count 1.' },
  ],
  8: [
    { title: 'Build A minor', instruction: 'Place index on B fret 1, middle on D fret 2, and ring on G fret 2. Strum from the open A string toward the thinnest E. Leave out low E.' },
    { title: 'Build E major', instruction: 'Move each finger one string toward the thickest string, keeping its fret: index to G fret 1, middle to A fret 2, ring to D fret 2. Strum all six strings.' },
    { title: 'Hear the difference', instruction: 'Pick every string of each chord separately. E major has a finger on G fret 1; E minor leaves that string open. Compare the sounds.' },
    { title: 'Change slowly', instruction: 'Play eight slow strums on Am, then eight on E. Next, alternate one Am strum and one E strum, leaving four counts to change.' },
  ],
  9: [
    { title: 'Say the count', instruction: 'Count “1 and 2 and 3 and 4 and” evenly. The numbers are the main beats; “and” is halfway between them.' },
    { title: 'Move the strumming hand', instruction: 'Lightly touch the strings with your fretting hand so they do not ring. Strum down on each number and move up on each “and.”' },
    { title: 'Leave two upstrokes silent', instruction: 'Keep that hand motion. Touch the strings on 1, 2, the “and” after 2, 3, 4, and the “and” after 4. Pass above the strings on the “and” after 1 and 3.' },
    { title: 'Add a G chord', instruction: 'Hold G and play the same pattern. Repeat “1 and 2 and 3 and 4 and” eight times. Each full count is one bar. Slow down if you lose the count.' },
  ],
  10: [
    { title: 'Build A major', instruction: 'Place index on D fret 2, middle on G fret 2, and ring on B fret 2. Keep open A and the thinnest E clear. Leave out low E.' },
    { title: 'Check all five strings', instruction: 'Pick from A toward the thinnest E. Adjust the fingertips until each note rings. Then strum the five strings together.' },
    { title: 'Connect A, D, and E', instruction: 'Play A → D → E → A. Give each chord four slow counts and strum once on count 1. Repeat twice.' },
    { title: 'Compare major and minor', instruction: 'Play A, then rebuild Am from lesson 8. Listen to the change in sound. The B string changes from fret 2 in A to fret 1 in Am.' },
  ],
  11: [
    { title: 'Find the starting A', instruction: 'Press the thickest E string at fret 5 and pick it. This note is A, the home note (root) of today’s scale.' },
    { title: 'Start with two strings', instruction: 'Play low E frets 5 then 8. Move to the A string and play frets 5 then 7. Use index at fret 5, ring at 7, and little finger at 8.' },
    { title: 'Finish the pattern', instruction: 'Continue toward the thinnest string: D frets 5–7, G frets 5–7, B frets 5–8, high E frets 5–8. Play one note at a time. Use the map below if you lose your place.' },
    { title: 'Return to the home note', instruction: 'Play the pattern backward until you reach low E fret 5. Pause on that A. First use equal, slow notes; try 60 BPM when the pattern feels familiar.' },
  ],
  12: [
    { title: 'Listen to one short part', instruction: 'Open Twinkle in the lesson materials below. Listen to the first short musical sentence, then hum it. You only need that small part for now.' },
    { title: 'Read the tab', instruction: 'Each line is a string; the top line is the thinnest string. A number tells you which fret to press. A 0 means play the string open.' },
    { title: 'Play the first phrase', instruction: 'Find the first few notes in the tab. Play them slowly until you can repeat them twice without stopping. Hum them again if you forget how they should sound.' },
    { title: 'Add one phrase', instruction: 'Learn the next short part the same way. Join the two parts slowly. Continue one phrase at a time, keeping the same pace.' },
  ],
  13: [
    { title: 'Use the B string', instruction: 'Find the second-thinnest string, B. Play frets 1, 2, 3, 4 with index, middle, ring, and little finger, one note at a time.' },
    { title: 'Move to high E', instruction: 'Move to the thinnest E string and repeat frets 1, 2, 3, 4. Keep the gaps between notes equal.' },
    { title: 'Keep movements small', instruction: 'Alternate those two strings. Keep unused fingertips near the strings without stiffening them. Release excess pressure after each note.' },
    { title: 'Repeat comfortably', instruction: 'Continue slowly for up to 60 seconds, keeping the notes at a similar volume. Take a break if the hand feels tired or strained.' },
  ],
  14: [
    { title: 'Play two notes together', instruction: 'Play the thickest E string open and the A string at fret 2. Sound only those two strings. This is E5, a power chord.' },
    { title: 'Move to G5', instruction: 'Place index on low E fret 3 and ring on A fret 5. Pick only those two strings together. Lightly touch unused strings to keep them quiet.' },
    { title: 'Move to A5', instruction: 'Slide both fingers two frets toward the guitar body: index to low E fret 5, ring to A fret 7. Keep the same two-string shape.' },
    { title: 'Make a four-bar pattern', instruction: 'Count four beats per bar. Play G5 once per beat for two bars, then A5 once per beat for two bars. Repeat the whole pattern twice at a comfortable speed.' },
  ],
}

export function teachingSteps(lesson: Lesson): TeachingStep[] {
  return EARLY_STEPS[lesson.day] ?? lesson.drills.map((instruction, index) => ({
    title: `Practice ${index + 1}`,
    instruction,
  }))
}

export const LESSON_TERMS = [
  { term: 'Fret', match: /fret/i, meaning: 'The metal wires across the neck mark the frets. Fret 1 is nearest the tuning pegs. Press the string just before the wire, on the side nearer the pegs.' },
  { term: 'Open string', match: /open|string names/i, meaning: 'A string you play without pressing it against a fret.' },
  { term: 'String numbers', match: /string|chord/i, meaning: 'String 1 is the thinnest E. String 6 is the thickest E. Thickest to thinnest: 6 E, 5 A, 4 D, 3 G, 2 B, 1 E.' },
  { term: 'Fretting hand', match: /fretting|finger|hand/i, meaning: 'The hand that presses the strings against the neck. Your other hand picks or strums.' },
  { term: 'Strum', match: /strum|chord/i, meaning: 'Brush across several strings in one motion. A downstroke moves from thicker strings toward thinner strings.' },
  { term: 'BPM', match: /bpm|tempo|metronome/i, meaning: 'Beats per minute: the speed of the pulse. At 60 BPM, a metronome clicks once each second. Play one note per click unless the exercise says otherwise.' },
  { term: 'Bar', match: /bar|beat|rhythm/i, meaning: 'A group of beats. In 4/4, count 1, 2, 3, 4; that is one bar. Other time signatures group beats differently.' },
  { term: 'Muted', match: /mut[ei]|quiet/i, meaning: 'A string is kept from ringing, usually by touching it lightly. Muting can be intentional; a finger accidentally touching the next string can also silence it.' },
  { term: 'Root', match: /root|scale|pentatonic/i, meaning: 'The note a chord or scale is named after. A is the root of A minor. Find it first so the pattern has a clear starting point.' },
  { term: 'Phrase', match: /phrase|melody|motif/i, meaning: 'A short musical idea, like a sentence. Learn a few notes together, pause, then learn the next group.' },
  { term: 'Pentatonic', match: /pentatonic/i, meaning: 'A scale with five different note names. A minor pentatonic uses A, C, D, E, G. A box is one area of the neck where you can play those notes.' },
  { term: 'Power chord', match: /power chord|E5|G5|A5/i, meaning: 'A chord made from a root and a fifth, sometimes with the root repeated higher. G5 means a G power chord; the 5 is not a fret number.' },
]

export function termsForLesson(lesson: Lesson) {
  const text = [lesson.title, lesson.theoryBite, ...lesson.drills, ...teachingSteps(lesson).map(s => s.instruction)].join(' ')
  return LESSON_TERMS.filter(term => term.match.test(text))
}
