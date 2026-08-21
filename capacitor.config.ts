/**
 * GuitarRemedy — Capacitor Android (optional mobile shell).
 * Web primary + PWA still work without native tooling.
 *
 * Setup (once):
 *   npm i -D @capacitor/cli @capacitor/core
 *   npm i @capacitor/android
 *   npx cap add android
 *   npm run mobile:sync
 *
 * Open in Android Studio:
 *   npm run mobile:android
 *
 * Typed as a plain object so `tsc` stays green without Capacitor installed.
 */
const config = {
  appId: 'com.ahmidarrow.guitarremedy',
  appName: 'GuitarRemedy',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#030705',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#030705',
    },
  },
}

export default config
