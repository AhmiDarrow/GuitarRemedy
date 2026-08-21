# GuitarRemedy — auto-run / next-hop process

Ahmi asked for a timer or subagent to proc the next run so work does not stall on manual "proceed".

## What is armed on this machine

| Mechanism | Role | Status |
|-----------|------|--------|
| **Soul vigil** | Between-visit wakes (local-only, budgeted) | **ON** — 8 wakes/day, 30 min gap |
| **Mission** | Durable checklist + `npm test` verify | Active goal tracks remaining ship work |
| **Checkpoint** | Resume block for next agent/muscle | Latest: pre-push issue fix pass |
| **This file** | Human-readable queue of next hops | Update after each green hop |

Vigil does **not** call cloud providers at night. Daytime chat still drives product code.

## How to proc the next run

1. **You say** `continue` / `next` / `go` — take the top unchecked hop → implement → `npm test`.
2. **Vigil wake** — open threads + checkpoint resume the queue.
3. **One hop per run** when context is tight — never claim all gaps closed with open boxes below.

## Hop queue (top = next)

- [ ] **Create GitHub remote + push** when Ahmi says go (private/public choice)
- [ ] **Set GH secret** `TAURI_SIGNING_PRIVATE_KEY` from `~/.tauri/guitarremedy.key`
- [ ] **Tag `v0.1.0`** after first green CI for draft Windows installer
- [ ] **Authenticode cert** for SmartScreen (optional — needs purchased cert)
- [ ] **ML pitch model** (Basic Pitch / similar) if HPSS lead still weak on some mixes

## Done (do not re-open without a bug)

- Dark Forest theme + ComfyUI assets
- Day 1–365 private-lesson expansion + Learn UI
- Audio → MIDI → tabs (HPSS lead stem, melody band, tempo, trim, multi-format, Clean up)
- Tab editor ear-loop + eternal user tabs + `.grtab` import/export
- Free-license full-length tabs + Play/Stop
- GP best-effort path + MusicXML/MIDI solid path + unit coverage
- README + offline wiki + About (Ahmi family) + GH updater pipeline (local, no push yet)
- Mobile bottom nav trimmed (Wiki/About via rail + Profile)
- Upload pipeline labels ASCII-safe
- Capacitor Android scaffold (`capacitor.config.ts`, docs, scripts)
- Windows installer polish (NSIS metadata, timestamp URL, WebView2 bootstrapper, docs)
- `npm test` / `cargo test` / `npm run build` green

## Rule for Remedy

On every new turn that is "continue" / empty proceed / vigil resume:

1. Read this file + checkpoint  
2. Take **one** unchecked hop  
3. `npm test`  
4. Check the box here  
5. Stop or take the next hop only if context budget allows
