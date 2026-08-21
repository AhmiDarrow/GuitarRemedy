# GuitarRemedy — auto-run / next-hop process

Ahmi asked for a timer or subagent to proc the next run so work does not stall on manual "proceed".

## What is armed on this machine

| Mechanism | Role | Status |
|-----------|------|--------|
| **Soul vigil** | Between-visit wakes (local-only, budgeted) | **ON** — 8 wakes/day, 30 min gap |
| **Mission** | Durable checklist + `npm test` verify | Active goal tracks remaining ship work |
| **Checkpoint** | Resume block for next agent/muscle | Latest: fixes 1–10 closeout |
| **This file** | Human-readable queue of next hops | Update after each green hop |

Vigil does **not** call cloud providers at night. Daytime chat still drives product code.

## How to proc the next run

1. **You say** `continue` / `next` / `go` — take the top unchecked hop → implement → `npm test`.
2. **Vigil wake** — open threads + checkpoint resume the queue.
3. **One hop per run** when context is tight — never claim all gaps closed with open boxes below.

## Hop queue (top = next)

- [ ] **Stronger full-band audio** — optional stems / ML pitch (Basic Pitch-class) when ready
- [ ] **Capacitor Android** packaging (optional)
- [ ] **Windows installer polish** — signed `tauri build` artifacts + update channel notes

## Done (do not re-open without a bug)

- Dark Forest theme + ComfyUI assets
- Day 1–365 private-lesson expansion + Learn UI + late-day mastery variety
- Audio → MIDI → tabs (lead emphasis / HPSS-lite, tempo detect, trim, multi-format)
- Convert UX: tempo override, trim seconds, progress %, confidence, Clean up
- Tab editor ear-loop (source scrub, ±1 nudge, bulk keep)
- Eternal user tabs + `.grtab.json` export/import
- Free-license full-length tabs + Play/Stop
- GP best-effort path (GPIF/zip + honest MIDI/MusicXML fallback) — no “Option A” codename
- README + PWA manifest + Tauri scripts
- Theory scale id aliases consolidated via `resolveScaleId` / `getScale`
- Full-band sample smoke (`Born Between the Smoke and the Sky`)
- `npm test` green

## Rule for Remedy

On every new turn that is "continue" / empty proceed / vigil resume:

1. Read this file + checkpoint  
2. Take **one** unchecked hop  
3. `npm test`  
4. Check the box here  
5. Stop or take the next hop only if context budget allows
