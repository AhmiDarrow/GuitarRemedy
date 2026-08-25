# GuitarRemedy — Android (Capacitor)

Mobile-responsive **web / PWA** is the default. Capacitor wraps the same `dist/` build for a native Android shell when you want Play-style packaging or file-picker polish.

## Prerequisites

- Node 20+
- [Android Studio](https://developer.android.com/studio) (SDK 34+, build-tools)
- JDK 17+
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
| Upload audio → tabs | Uses Web Audio in WebView; prefer WAV/MP3 |
| Your tabs | `localStorage` (clearing app data wipes them) |
| PWA install | Still available in Chrome without Capacitor |
| Tauri desktop APIs | No-ops on mobile (`isTauri()` false) |

## Icons & splash

1. Replace `android/app/src/main/res/` mipmaps after `cap add`, or use  
   `@capacitor/assets` with `public/assets/brand-mark.png`.
2. Keep status/nav bars dark to match Dark Forest.

## Store / signing

- Create a release keystore **outside** the repo.
- Configure `android/app/build.gradle` signingConfigs (never commit keystore passwords).
- Play App Signing recommended for distribution.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank WebView | `npm run build` then `npx cap sync` |
| Audio decode fails | Try WAV; some WebViews are picky about codecs |
| `cap` not found | `npx cap` or install `@capacitor/cli` devDep |
| Path spaces | Keep project path free of odd Unicode |

## Not in this repo by default

The generated `android/` tree is large and machine-local after `cap add`.  
`.gitignore` excludes it so CI stays web + Tauri-focused until you choose to vendor it.
