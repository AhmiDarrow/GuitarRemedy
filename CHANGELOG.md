# Changelog — GuitarRemedy

All notable changes, grounded in `git log` (repo created 2026-08-21, `e8e497d`).
On-disk version source of truth: `package.json` · `src-tauri/tauri.conf.json` · `src-tauri/Cargo.toml` (all synced by `node scripts/bump-version.mjs`).

## [0.2.0] — 2026-09-26

- Concrete first-week demonstrations, listening cues, and smaller practice steps when a skill is difficult.
- A practice-and-feedback loop throughout the 365-day path, with recall prompts and self-assessed readiness.
- Save practice without claiming mastery; complete a lesson when its target is repeatable, then explicitly continue.
- Local lesson checkboxes, current segment, notes, and review dates survive navigation and restarts. Home shows due reviews.
- Full theory explanations, accurate session timing, completion-based progress, and robust lesson URLs.
- Home-page polish, accessible navigation and controls, reduced-motion support, and cancellable tuner startup.
- Practice dates use the local calendar; version bumps keep npm lockfile metadata in sync.

## [0.1.2] — 2026-08-25

Release tag `v0.1.2` (`31d5d8b`).

- **Updater + Android sync** — publish releases for updater, Android version sync, mic + icons ship
- **Android mic fix** — WebView mic needs `MODIFY_AUDIO_SETTINGS` + plain-audio fallback (`6503095`)
- **Android permission** — request mic permission for tuner on Listen (`0b3cf80`)
- **CI icon fix** — icon script Node fallback so CI APK build works without Pillow (`012df16`)
- **Windows fixes** — audio unlock, Player default name, update feed errors, Dark Forest scrollbars (`0cddebb`)
- **CI** — Java 21 for Capacitor Android + Node 22 on Windows job (`dbc6ac8`, `d31898a`)

## [0.1.1] — 2026-08-25

Release tag `v0.1.1` (`38c7758`).

- **Release pipeline** — Windows updater + Android APK (`ffc635b`), local NSIS + debug APK packaging scripts (`3739b40`)

## [0.1.0] — 2026-08-21

Initial release, tag `v0.1.0`. The humble start: one repo, CI + release workflows (`e8e497d`).

- **365-day curriculum** — unique research-backed private lessons, reworked to kill repertoire stencil and Day-N chrome (`57a8962`, `3a2bae4`, `9fda964`, `8c33c07`, `43af59a`)
- **Convert / audio** — HPSS lead stems, Basic Pitch assist, full-band engine race, YIN fuse, onset snap, multipitch keep, lock-lead, articulations, A/B scrub (`e00d27d`, `4a8b08a`, `da7852f`, `4da5a8c`, `2e4ee29`, `46eaf81`)
- **Theory-verified lesson diagrams** — ASCII + Dark Forest chord charts for all 365 days, gated to taught content (`afd774d`, `dd90261`, `5b0bc75`, `65719f2`, `c983bf9`)
- **Wiki** — free MIT encyclopedia, 55 deep articles + reader UI (`68d361d`, `4fd3746`)
- **UI version honesty** — version shown from `package.json`, not hardcoded strings (`b3be0d7`)
- **Metronome + tuner**, beat-based tabs, brand app menu (`e809f23`)
- **Android scaffold** — Capacitor 8 (`e00d27d`), mic + icons ship in 0.1.2

### Honest note on the "0.31.x" thread

The app's own versioning is `0.1.x` (see tags `v0.1.0` → `v0.1.2`). The `0.31.0 → 0.31.2` version gap lives in the **AhmiDarrow-Website** welcome copy, not in GuitarRemedy — that is a separate project and its own open thread. No hardcoded versions remain in GuitarRemedy UI (`b3be0d7`).

---

## How to bump

```bash
npm run version:bump -- 0.1.3
# bumps package.json, tauri.conf.json, Cargo.toml, android build.gradle
git commit -am "release: bump GuitarRemedy to 0.1.3"
git tag v0.1.3 && git push origin v0.1.3
```
