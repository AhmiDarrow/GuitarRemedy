# GuitarRemedy

Polished cross-platform guitar learning app — interactive scales, tabs, a large free-license library, Day 1–365 private-lesson path, and song upload → Remedy breakdown (MIDI / MusicXML / GP best-effort / audio→MIDI→tabs).

## Stack

- React 19 + TypeScript + Vite 6 + Tailwind CSS 4 (Dark Forest theme)
- Tone.js (play-along) · Zustand (local progress + Your tabs)
- PWA (`public/manifest.webmanifest`) · Tauri 2 Windows shell (`src-tauri/`)
- Mobile: responsive UI; Capacitor packaging optional next

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm test
npm run build
npm run tauri:dev    # Windows desktop shell
npm run tauri:build  # native installer
```

## Features

| Area | What you get |
|------|----------------|
| **Practice** | Interactive fretboard, scales/modes, degrees, lefty, play-along |
| **Tabs** | Tab view with play/stop, speed control, editor (nudge, clean up, bulk keep) |
| **Library** | Open scales, chords, riffs, 60+ free-license full-length songs + **Your tabs** |
| **Learn** | Full **365** private-lesson days (warm-up → teach → jam → cool-down) |
| **Upload** | Audio (MP3/WAV/…) → MIDI → tabs · MIDI/MusicXML solid · GP best-effort · tempo override · trim seconds · progress · eternal user list + export |
| **Profile** | Handedness, tuning, A4, streak, how conversion works |
| **About** | “Hi I'm Ahmi…” · GitHub / Releases / Patreon · Check for updates (desktop) |

## Song breakdown

1. **Reliable:** drop `.mid` / MusicXML (or GP when GPIF parses) → tabs + scale map  
2. **Audio:** decode → lead emphasis → pitch track → tempo detect → MIDI → fretting → auto clean  
3. **Human loop:** Edit tab (pitch ±1, keep first N bars, confidence column) → save to **Your tabs** → export `.grtab.json` / MIDI / ASCII  

Full-band mixes are monophonic drafts — cleaner single-note leads convert best.

## Project layout

```
src/
  components/   AppShell, Fretboard, TabView, TabEditor, ScalePicker
  pages/        Home, Learn, Library, Practice, Upload, Profile
  lib/          theory, audioToMidi, midi, musicxml, guitarpro, breakdown, tabEdit, userTabs
  data/         library, freeTabs, curriculum 1–365, lessonExpand
  store/        app + userTabs (localStorage)
public/assets/  Dark Forest ComfyUI art
src-tauri/      Tauri 2 desktop wrapper
```

## Packaging

- **Web/PWA:** `npm run build` + serve `dist/`; installable via `public/manifest.webmanifest` (Dark Forest theme colors, brand-mark icons)
- **Windows (Tauri 2):** `npm run tauri:dev` / `npm run tauri:build` — requires Rust + WebView2; shell in `src-tauri/`
- **Auto-update (desktop):** signed GitHub Releases → About → Check for updates (`docs/AUTOUPDATE.md`)
- **CI (local-ready):** `.github/workflows/ci.yml` + `release.yml` — no push required to edit; push when you create the remote
- **Android:** Capacitor not wired yet — use responsive PWA / “Add to Home Screen” first
- **Verify before ship:** `npm test` && `npm run build` (and `cargo check` / `npm run test:rust` for desktop)

## Git / GitHub (ready, not pushed)

```bash
# already: local git repo on branch main
# when you want the remote:
gh repo create AhmiDarrow/GuitarRemedy --private --source=. --remote=origin
git push -u origin main
gh secret set TAURI_SIGNING_PRIVATE_KEY < %USERPROFILE%\.tauri\guitarremedy.key
git tag v0.1.0 && git push origin v0.1.0   # cuts draft release via Actions
```

## License note

Built-in songs are public-domain, traditional, or original study material only. User uploads and Your tabs stay on-device.
