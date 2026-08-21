<p align="center">
  <img src="public/assets/brand-mark.png" alt="GuitarRemedy" width="96" height="96" />
</p>

<h1 align="center">GuitarRemedy</h1>

<p align="center">
  <strong>Learn guitar in the Dark Forest.</strong><br />
  Interactive scales · full tabs · free library · song → tabs · Day 1–365 private lessons
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
  <a href="#features">Features</a> ·
  <a href="docs/wiki/README.md">Wiki</a> ·
  <a href="#desktop--updates">Desktop</a> ·
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="public/assets/hero-dark-forest.png" alt="GuitarRemedy Dark Forest hero" width="720" />
</p>

---

**Hi I'm Ahmi, hope this helps!**

GuitarRemedy is a local-first guitar school you can actually practice in — not a wall of PDFs. Open a scale on the fretboard, play a free-license song in tab, walk a guided 30‑minute lesson every day for a year, or drop an MP3 and get a candidate tab you can clean up and keep forever.

| | |
|---|---|
| **Platforms** | Windows (Tauri 2) · Web / PWA · Android (Capacitor scaffold) |
| **Theme** | Dark Forest (mint · lime · void green) |
| **Data** | On-device progress, favorites, **Your tabs** |
| **Content** | Public-domain / traditional / original study only |

---

## Features

| Surface | What you get |
|---------|----------------|
| **Practice** | Interactive fretboard · scales & modes · degrees · lefty · Tone.js play-along |
| **Library** | Scales, chords, riffs, 60+ free full-length songs · search & filters · **Your tabs** |
| **Learn** | **365** private-lesson days — warm-up → teach → guided → jam → cool-down |
| **Upload** | Audio → MIDI → tabs · MIDI / MusicXML solid · GP best-effort · editor · export |
| **Wiki** | In-app guitar & music theory encyclopedia (also under `docs/wiki/`) |
| **About** | Ahmi blurb · GitHub · Releases · Patreon · Check for updates (desktop) |

### Song → tabs (honest path)

1. **Solid:** `.mid` / MusicXML (Guitar Pro when GPIF parses) → tabs + scale map  
2. **Audio:** decode → **HPSS lead stem** → melody band → pitch → tempo → MIDI → fretting → auto-clean  
3. **Human loop:** Edit (pitch ±1, keep first N bars, Clean up) → save to **Your tabs** → `.grtab.json` / MIDI / ASCII  

Full-band mixes use a **lead stem** (median HPSS) before pitch track — still monophonic drafts. Clean single-note leads convert best. Always confirm by ear. Stem picker on Upload: Lead / Harmonic / Mix.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm test
npm run build
```

**Desktop shell (Windows):**

```bash
npm run tauri:dev
npm run tauri:build
```

Requires [Rust](https://rustup.rs/) + WebView2.

---

## Wiki

Deep theory and how-to live in two places:

| Place | Path |
|-------|------|
| **GitHub / offline markdown** | [`docs/wiki/`](docs/wiki/README.md) |
| **In the app** | **Wiki** in the nav (searchable) |

Topics include notes & intervals, scales & modes, chords & progressions, rhythm, the fretboard & CAGED, tunings, technique, tab reading, guitar facts, the 365 path, and the upload pipeline.

---

## Project layout

```
src/
  components/   AppShell, Fretboard, TabView, TabEditor, ScalePicker, …
  pages/        Home, Learn, Library, Practice, Upload, Profile, About, Wiki
  lib/          theory, audioToMidi, midi, musicxml, guitarpro, breakdown, tabEdit, …
  data/         library, freeTabs, curriculum 1–365, lessonExpand, wiki
  store/        app + userTabs (localStorage)
public/assets/  Dark Forest art (ComfyUI)
docs/wiki/      Full markdown encyclopedia
src-tauri/      Tauri 2 · signed updater
.github/        ci.yml · release.yml
```

---

## Desktop & updates

- **About → Check for updates** (desktop) uses the Tauri updater against GitHub Releases + `latest.json`
- Signing key lives outside the repo (`~/.tauri/guitarremedy.key`) — see [`docs/AUTOUPDATE.md`](docs/AUTOUPDATE.md)
- Packaging notes: [`PACKAGING.md`](PACKAGING.md)

```bash
# when you're ready to publish (not done until you say so)
gh repo create AhmiDarrow/GuitarRemedy --private --source=. --remote=origin
git push -u origin main
gh secret set TAURI_SIGNING_PRIVATE_KEY < %USERPROFILE%\.tauri\guitarremedy.key
git tag v0.1.0 && git push origin v0.1.0
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm test` | Typecheck + Vitest |
| `npm run build` | Production web build |
| `npm run test:rust` | Tauri crate tests |
| `npm run tauri:dev` / `tauri:build` | Desktop shell |
| `npm run mobile:sync` / `mobile:android` | Capacitor Android (after `cap add`) |

---

## Stack

React 19 · TypeScript · Vite 6 · Tailwind 4 · Tone.js · Zustand · Tauri 2 · Vitest

---

## License

MIT © Ahmi Darrow  

Built-in songs are **public-domain, traditional, or original study** material only. User uploads and **Your tabs** stay on your machine.

<p align="center">
  <sub>GitHub · Releases · <a href="https://www.patreon.com/AhmiDarrow">Patreon</a></sub>
</p>
