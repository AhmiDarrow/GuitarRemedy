# GuitarRemedy wiki (source of truth)

In-app wiki lives at **`src/data/wiki.ts`** and renders at **`/wiki`** (and `/wiki/:slug`).

This folder is the human-readable mirror for GitHub browsing. Prefer editing `src/data/wiki.ts` so the app and tests stay in sync; then refresh any exported markdown here if you keep dual copies.

## Categories

| Id | Topic |
|----|--------|
| `fundamentals` | Pitch, rhythm, intervals, keys |
| `scales-modes` | Major/minor, modes, pentatonics, blues |
| `chords-harmony` | Triads, sevenths, progressions, CAGED harmony |
| `fretboard` | Tunings, CAGED, positions, lefty |
| `technique` | Hands, picking, bends, vibrato |
| `practice` | Habits, metronome, ear, 365 path |
| `tabs-gear` | Reading tab, song upload, gear basics |
| `app` | How GuitarRemedy features map to theory |

## In the app

- Nav: **Wiki**
- Search + category chips
- Related links between articles
- Offline — bundled with the build (no network)

## License note

Theory explanations are original teaching text for GuitarRemedy. Song examples in the app library remain public-domain / traditional / original studies only.
