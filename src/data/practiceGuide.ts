import type { Lesson, LessonPhase } from './curriculum'
import { teachingSteps } from './teachingSteps'

interface PracticeGuide {
  example: string
  listen: string
  rescue: string
}

const FIRST_WEEK: Record<number, PracticeGuide> = {
  1: {
    example: 'Leave your fretting hand off the strings. Pluck the thickest string and say “E.” Let it ring for two counts. Continue A, D, G, B, E toward the thinnest string. Repeat once without looking at the names.',
    listen: 'Six separate, ringing notes. The last E sounds higher than the first. Keep your picking hand clear of the string after each pluck.',
    rescue: 'Work on just the thickest three strings: E, A, D. If a note stops abruptly, check that neither hand is touching the vibrating string.',
  },
  2: {
    example: 'On the thinnest E string, put your index finger just behind fret 1, on the nut side of the wire. Pick once. Repeat at fret 2 with the middle finger, 3 with the ring finger, and 4 with the little finger. Start without a click, then try one note per beat at 50 BPM.',
    listen: 'Four clear notes rising in pitch, with equal gaps. Use only enough pressure to stop the buzz; release the pressure between attempts.',
    rescue: 'Use just frets 1 and 2. Move closer to the fret wire before adding pressure. Make the reach smaller and rest if the hand feels strained.',
  },
  3: {
    example: 'Place your middle finger on string 5 (A), fret 2, and ring finger on string 4 (D), fret 2. Leave the other strings open. Pick all six separately, then strum downward on counts 1 and 3 while counting “1, 2, 3, 4.”',
    listen: 'Every string rings, including the open G next to your ring finger. Two bars give you four evenly spaced strums.',
    rescue: 'If the G is muted, curve your ring finger so its side clears that string. Recheck just A, D, and G before strumming again.',
  },
  4: {
    example: 'Build G: middle finger on low E fret 3, index on A fret 2, ring on high E fret 3; D, G, and B stay open. Play Em for eight slow counts, then G for eight. Start with a single strum at the beginning of each group.',
    listen: 'The new chord lands on count 1. Keep counting during the change, even when you need a silent beat to place the fingers.',
    rescue: 'Practice the hand move without strumming. Place G, release, and rebuild it three times, then add Em at a slower pace.',
  },
  5: {
    example: 'Build C: ring finger on A fret 3, middle on D fret 2, index on B fret 1. G and high E stay open. Pick from A toward high E, then strum those five strings. Alternate one C strum and one G strum, leaving four counts to change.',
    listen: 'The open G and high E still ring. The lowest note of your C chord is the A string at fret 3; leave the thickest E out.',
    rescue: 'Check the B string alone, then the open high E. Curve the index fingertip to clear high E. Practice starting the pick on A without changing chords.',
  },
  6: {
    example: 'Build D: index on G fret 2, ring on B fret 3, middle on high E fret 2. Leave D open and strum only strings 4 through 1. Count four slow beats each on G, C, D, and G, strumming once at each chord change.',
    listen: 'Four bright notes in D, with no low E or A. Keep the count moving through all four chords.',
    rescue: 'Stay on D and pick its four strings separately. If high E is muted, check whether the ring finger is touching it. Add only C → D before the full loop.',
  },
  7: {
    example: 'Play Em → G → C → D. Give each chord four counts and one down-strum on count 1. Repeat the loop twice. If that is comfortable, strum on counts 1 and 3. Make a short recording if you want to hear the changes back.',
    listen: 'An even count from the first chord to the last. Notice which change takes longest; that is your next practice target.',
    rescue: 'Choose only the slowest pair of chords. Give each eight counts. Practice the change three times, then return to the four-chord loop.',
  },
}

const PHASE_GUIDES: Record<LessonPhase, Omit<PracticeGuide, 'example'>> = {
  basics: { listen: 'Clear starts, notes that ring for the intended length, and a relaxed hand. Compare one attempt with the next.', rescue: 'Isolate one note or one hand movement. Remove the click until it is clear, then bring back a slow pulse.' },
  chords: { listen: 'Pick each intended string separately. Listen for missing notes, buzz, and changes that land late.', rescue: 'Choose the hardest two shapes. Rehearse the change silently, check each string, then add one strum per chord.' },
  scales: { listen: 'Even spaces between notes and a clear return to the root. Name the root before playing the pattern.', rescue: 'Use the root and two nearby scale notes. Play them slowly in both directions before rebuilding the full pattern.' },
  rhythm: { listen: 'Your count continues through rests. The next attack after a rest should line up with the pulse.', rescue: 'Put down the guitar and clap the rhythm while counting. Add muted strings, then restore the pitches.' },
  lead: { listen: 'A phrase with a clear start, space, and a deliberate ending. Compare any bend with its unbent target pitch.', rescue: 'Take two or three notes from the phrase. Keep the rhythm and rests; leave out ornaments until the phrase is steady.' },
  repertoire: { listen: 'The transition into and out of the difficult section. Keep the pulse through a mistake and recover at the next phrase.', rescue: 'Loop the last bar of the previous section and the first bar of the next. Join them slowly before adding the rest of the song.' },
}

const SECOND_WEEK: Record<number, Omit<PracticeGuide, 'example'>> = {
  8: { listen: 'Five clear strings in Am; six in E major. The open thinnest E must ring in both shapes.', rescue: 'Stay on Am. Check just B fret 1 and the open thinnest E. Curve the index fingertip so it does not silence the E. Add the change only after Am is clear.' },
  9: { listen: 'The downstrokes stay on the numbers. The two upstrokes fit halfway between beats, without making the next downstroke late.', rescue: 'Leave out the chord. Use muted strings and play only downstrokes on 1, 2, 3, 4. Add just the upstroke after 4, then the one after 2.' },
  10: { listen: 'The open A and thinnest E ring clearly. Each new chord begins on count 1, at the same slow pace.', rescue: 'Work only on A. Pick its five strings separately. Reposition the ring fingertip if the thinnest E is silent. Practice A → D before adding E.' },
  11: { listen: 'One clear note at a time, with equal gaps. Finish on A at low E fret 5 and notice the sense of arriving home.', rescue: 'Use only low E frets 5 and 8, then A string fret 5. Play these three notes forward and backward before adding more of the pattern.' },
  12: { listen: 'The notes follow the melody you hummed. Keep long notes long; do not speed up to get past a difficult change.', rescue: 'Take only the first three notes in the tab. Hum them, find them, and play them slowly. Add one more note when those three feel familiar.' },
  13: { listen: 'Similar volume and equal gaps between notes, including when you move to the next string.', rescue: 'Use frets 1 and 2 on the B string only. Make two clear notes with relaxed fingers, then try those same frets on high E.' },
  14: { listen: 'Only the two intended strings ring. G5 and A5 have the same shape, and the pulse stays even as the shape moves.', rescue: 'Stay on G5: low E fret 3 and A fret 5. Pick the pair gently four times. Practice moving the shape silently before adding A5 strums.' },
}

export function practiceGuide(lesson: Lesson): PracticeGuide {
  if (SECOND_WEEK[lesson.day]) return { ...SECOND_WEEK[lesson.day], example: teachingSteps(lesson).map(s => s.instruction).join(' ') }
  return FIRST_WEEK[lesson.day] ?? {
    ...PHASE_GUIDES[lesson.phase],
    example: `${lesson.drills[0]} First try it once slowly. Identify the smallest part that breaks down, practice that part three times, then put it back into the whole exercise.`,
  }
}
