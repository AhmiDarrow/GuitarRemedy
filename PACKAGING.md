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
- **Before first live update:** create `AhmiDarrow/GuitarRemedy` on GitHub, then  
  `gh secret set TAURI_SIGNING_PRIVATE_KEY < %USERPROFILE%\.tauri\guitarremedy.key`  
  and tag `v0.1.0` (do **not** commit the private key). See `docs/AUTOUPDATE.md`.

## Android

Capacitor is **not** wired yet. Use the responsive PWA, or add Capacitor later:

1. `npm run build`
2. `npx cap add android` (when you choose to)
3. Point `webDir` at `dist/`

## Ship checklist

1. `npm test`
2. `npm run build`
3. Desktop: `cargo check` in `src-tauri` (or full `tauri build`)
4. Smoke Upload: MP3 → tabs → Your tabs → export `.grtab.json`
5. Smoke Learn day 1 + Library play/stop
