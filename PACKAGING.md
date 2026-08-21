# GuitarRemedy packaging

## Web / PWA (primary)

```bash
npm install
npm run build          # tsc + vite → dist/
npx serve dist         # or any static host
```

- Manifest: `public/manifest.webmanifest` (standalone, Dark Forest colors, brand-mark icons)
- Install: browser “Install app” / Add to Home Screen on mobile
- **Updates:** redeploy `dist/`; clients pick up on next visit (no native updater required)

## Windows desktop (Tauri 2)

Prereqs: Rust toolchain, WebView2 (Windows 10/11 usually present).

```bash
npm run tauri:dev      # dev shell + Vite
npm run tauri:build    # MSI/NSIS under src-tauri/target/release/bundle/
```

- Shell code: `src-tauri/`
- Native open dialog for audio/MIDI/GP via `src/lib/desktop.ts`
- **Auto-update:** Tauri updater + process plugins; endpoint `…/releases/latest/download/latest.json`; minisign pubkey in `tauri.conf.json`
- **CI:** `.github/workflows/ci.yml` (frontend + rust on push/PR)
- **Release:** `.github/workflows/release.yml` on `v*` tags (draft GH release + updater JSON)
- **Installer polish:** NSIS current-user, DigiCert timestamp URL, WebView2 bootstrapper, publisher metadata — see [`docs/WINDOWS_INSTALLER.md`](docs/WINDOWS_INSTALLER.md)
- **Before first live update:** create `AhmiDarrow/GuitarRemedy` on GitHub, then  
  `gh secret set TAURI_SIGNING_PRIVATE_KEY < %USERPROFILE%\.tauri\guitarremedy.key`  
  and tag `v0.1.0` (do **not** commit the private key). See `docs/AUTOUPDATE.md`.

### Optional Authenticode (SmartScreen)

Set `bundle.windows.certificateThumbprint` in `tauri.conf.json` when you have a code-signing cert. Until then, minisign updater signatures still protect in-app updates; first-run SmartScreen may warn on unsigned NSIS.

## Android (Capacitor)

Scaffold is ready: `capacitor.config.ts`, `docs/ANDROID.md`, npm scripts.

```bash
npm i -D @capacitor/cli @capacitor/core
npm i @capacitor/android
npm run mobile:add          # once — creates ./android (gitignored)
npm run mobile:sync         # build web → cap sync
npm run mobile:android      # Android Studio
```

PWA install remains the zero-native path for phones.

## Song → tabs (quality path)

Full-band audio uses **median HPSS lead stem** → melody band → pitch → tempo → MIDI → fretting → auto-clean. Upload UI: stem picker (Lead / Harmonic / Mix), tempo override, trim seconds.

## Ship checklist

1. `npm test`
2. `npm run build`
3. Desktop: `cargo check` in `src-tauri` (or full `tauri build`)
4. Smoke Upload: MP3 → tabs → Your tabs → export `.grtab.json`
5. Smoke Learn day 1 + Library play/stop
6. (Optional) `npm run mobile:sync` after Capacitor install

## Pre-push readiness (local → GitHub)

Code can ship without a remote. When you are ready:

| Step | Command / note |
|------|----------------|
| Create repo | `gh repo create AhmiDarrow/GuitarRemedy --private --source=. --remote=origin` |
| First push | `git push -u origin main` — watch **CI** go green |
| Updater secret | `gh secret set TAURI_SIGNING_PRIVATE_KEY < %USERPROFILE%\.tauri\guitarremedy.key` |
| First release | Tag `v0.1.0` after CI green (draft Windows installer + `latest.json`) |

**Do not** commit `.tauri/*.key` or large full-band sample audio. Authenticode cert is optional (SmartScreen); minisign still protects in-app updates.
