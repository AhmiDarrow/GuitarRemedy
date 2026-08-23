# GuitarRemedy Wiki (encyclopedia)

**Source of truth:** `src/data/wiki.ts` (in-app at `/wiki` and `/wiki/:slug`).

This folder is a human-readable map for GitHub browsing. Edit the TypeScript catalog so the app and tests stay in sync.

## What it is

A free, offline **textbook/encyclopedia** for players getting started and leveling up:

- Music theory in plain English  
- Guitar craft (neck, CAGED, technique, gear)  
- Practice habits and the Day 1–365 path  
- How GuitarRemedy features work (honest upload limits included)  
- History, care, glossary, free-music ethics  

**License:** original teaching text ships **MIT** with the app. Not scraped from commercial method books. Built-in **songs/tabs** remain public-domain / traditional / original studies only.

## Categories

| Id | Label | Topics |
|----|--------|--------|
| `start` | Start here | Welcome, conventions, first week, free-content rules |
| `music` | Music theory | Notes, intervals, scales, modes, harmony, rhythm, ear, form |
| `guitar` | Guitar craft | Anatomy, tuning, CAGED, hands, bends, tab, gear, capo |
| `practice` | Practice & learning | Habits, metronome, songs, plateaus, 365 path |
| `app` | Using GuitarRemedy | Home, Learn, Practice, Library, Upload, editor, desktop |
| `facts` | Guitar facts | History, players, myths, care, styles, glossary, ethics |

## In the app

- Nav / logo menu → **Wiki**
- Search + chapter chips
- Article view: on-this-page outline, related reads, prev/next in chapter
- Bundled offline (no network)

## Quality bar

- Articles are multi-section (`##` headings), not stubs  
- Easy vernacular; tables where they help  
- Points into Learn / Practice / Library when useful  
- Tests in `src/data/wiki.test.ts` enforce depth, coverage, and MIT posture  

## Regenerating (optional)

If you use the helper under `.remedy-build/tmp/gen_wiki.py`, re-run it only when intentionally bulk-rewriting the catalog — then run `npm test`.
