# GuitarRemedy — Android (Capacitor)

Mobile-responsive **web / PWA** is the default. Capacitor wraps the same `dist/` build for a native Android shell when you want Play-style packaging or file-picker polish.

## Prerequisites

- Node **22+** (Capacitor CLI 8 requires it)
- [Android Studio](https://developer.android.com/studio) (SDK 34+, build-tools)
- **JDK 21+** (Capacitor Android compiles with source/target 21 — JDK 17 fails with `invalid source release: 21`)
- Optional: physical device with USB debugging

## One-time scaffold

```bash
cd GuitarRemedy
npm install
npm install @capacitor/core @capacitor/android @capacitor/app
npm install -D @capacitor/cli

# Produce web assets
npm run build

# Add native project (creates android/)
npx cap add android

# Copy web → native + update plugins
npx cap sync android
```

`capacitor.config.ts` already points `webDir` at `dist/` and uses:

| Key | Value |
|-----|--------|
| appId | `com.ahmidarrow.guitarremedy` |
| appName | GuitarRemedy |
| androidScheme | https |
| background | Dark Forest `#030705` |

## Day-to-day

```bash
npm run build
npm run mobile:sync      # cap sync android
npm run mobile:android   # opens Android Studio
```

Or CLI run (device/emulator):

```bash
npx cap run android
```

### Local debug APK (no Play signing)

```bash
npm run mobile:sync
cd android
# ensure local.properties has: sdk.dir=<your Android SDK>
gradlew.bat assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

Install on a device with USB debugging:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Release/Play builds need your own keystore (never commit it).

## What works on Android

| Feature | Notes |
|---------|--------|
| Learn / Library / Practice / Wiki | Full SPA |
| **Tuner (mic)** | Tap **Listen** → system mic prompt. Needs `RECORD_AUDIO` in the manifest (see below). |
| Upload audio → tabs | Uses Web Audio in WebView; prefer WAV/MP3 |
| Your tabs | `localStorage` (clearing app data wipes them) |
| PWA install | Still available in Chrome without Capacitor |
| Tauri desktop APIs | No-ops on mobile (`isTauri()` false) |

## Microphone permission (tuner)

Capacitor’s WebView grants `getUserMedia` AUDIO_CAPTURE only after **both** OS permissions succeed:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

`RECORD_AUDIO` alone is not enough: the OS can show **Microphone: Allowed** while WebView still returns `NotAllowedError` if `MODIFY_AUDIO_SETTINGS` is missing from the APK.

`android/` is generated / gitignored, so every sync must re-apply this:

```bash
npm run mobile:sync   # build + cap sync + ensure mic permission
# or after a manual cap sync:
npm run mobile:mic    # node scripts/ensure-android-mic-permission.mjs
```

Release CI runs the same script after `cap add` / `cap sync`.

**If mic is Allowed but Listen still fails:** install a build that includes both permissions, force-stop the app, reopen, Practice → Tuner → **Listen**.

If the user denied once: **App info → Permissions → Microphone → Allow**, force-stop, reopen, then **Listen** again.

## Icons & splash

1. **Brand icons** come from `public/assets/brand-mark.png` via  
   `node scripts/ensure-app-icons.mjs` (also `npm run icons` / after `mobile:sync`).
2. That script writes density mipmaps + adaptive foreground and sets the  
   launcher background to Dark Forest void (`#050a08`).
3. Release CI runs the same script after `cap add` / `cap sync`.
4. Keep status/nav bars dark to match Dark Forest.

## CI release APK

Tag `v*` runs `.github/workflows/release.yml` → **build-android** job (after Windows):

1. Node 22 · Temurin **JDK 21** · Android SDK
2. `npm ci` → `npm run build`
3. `npx cap add android` + `npx cap sync android` (fresh tree; `android/` is gitignored)
4. `node scripts/ensure-android-mic-permission.mjs` (tuner `RECORD_AUDIO`)
5. `gradlew assembleDebug`
6. Upload `GuitarRemedy_<version>-debug.apk` to the draft GitHub Release

Debug-signed only — fine for sideload testing. Play Store needs your own release keystore.

## Store / signing

- Create a release keystore **outside** the repo.
- Configure `android/app/build.gradle` signingConfigs (never commit keystore passwords).
- Play App Signing recommended for distribution.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank WebView | `npm run build` then `npx cap sync` |
| Tuner never asks for mic | `npm run mobile:mic` (or full `mobile:sync`); reinstall APK |
| Mic denied earlier | App info → Permissions → Microphone → Allow |
| Audio decode fails | Try WAV; some WebViews are picky about codecs |
| `cap` not found | `npx cap` or install `@capacitor/cli` devDep |
| Path spaces | Keep project path free of odd Unicode |

## Not in this repo by default

The generated `android/` tree is large and machine-local after `cap add`.  
`.gitignore` excludes it so CI stays web + Tauri-focused until you choose to vendor it.
