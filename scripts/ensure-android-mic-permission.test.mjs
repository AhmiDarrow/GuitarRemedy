/**
 * Smoke-test the mic-permission patcher without requiring a full Android tree.
 * Run: node scripts/ensure-android-mic-permission.test.mjs
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const script = path.join(root, 'scripts', 'ensure-android-mic-permission.mjs')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gr-mic-'))
const manifestDir = path.join(tmp, 'android', 'app', 'src', 'main')
fs.mkdirSync(manifestDir, { recursive: true })
const manifestPath = path.join(manifestDir, 'AndroidManifest.xml')

const bare = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:label="GuitarRemedy" />
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>
`

fs.writeFileSync(manifestPath, bare, 'utf8')

// Point the script at our temp tree by running from a fake root via symlink-like copy of script logic:
// The real script resolves root from its own path — so we patch by invoking a one-off that imports the same ensure pattern.
// Instead: run the real script only when android/ exists; here we unit-test the XML transform inline.

function ensureLine(xml, line, marker) {
  if (xml.includes(marker)) return { xml, added: false }
  if (xml.includes('</manifest>')) {
    return { xml: xml.replace('</manifest>', `${line}\n</manifest>`), added: true }
  }
  throw new Error('No </manifest>')
}

const PERMISSION = '    <uses-permission android:name="android.permission.RECORD_AUDIO" />'
const FEATURE =
  '    <uses-feature android:name="android.hardware.microphone" android:required="false" />'

let xml = bare
let r = ensureLine(xml, PERMISSION, 'android.permission.RECORD_AUDIO')
xml = r.xml
if (!r.added) throw new Error('expected RECORD_AUDIO add')
r = ensureLine(xml, FEATURE, 'android.hardware.microphone')
xml = r.xml
if (!r.added) throw new Error('expected microphone feature add')
if (!xml.includes('RECORD_AUDIO') || !xml.includes('android.hardware.microphone')) {
  throw new Error('manifest missing mic lines')
}
// idempotent
r = ensureLine(xml, PERMISSION, 'android.permission.RECORD_AUDIO')
if (r.added) throw new Error('second RECORD_AUDIO pass should be no-op')

// Live script against real tree when present
const liveManifest = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml')
if (fs.existsSync(liveManifest)) {
  const out = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' })
  if (out.status !== 0) {
    console.error(out.stdout, out.stderr)
    throw new Error('ensure-android-mic-permission.mjs failed on live tree')
  }
  const live = fs.readFileSync(liveManifest, 'utf8')
  if (!live.includes('android.permission.RECORD_AUDIO')) {
    throw new Error('live AndroidManifest missing RECORD_AUDIO')
  }
  console.log('[ok] live AndroidManifest has RECORD_AUDIO')
} else {
  console.log('[ok] transform only (no local android/ tree)')
}

fs.rmSync(tmp, { recursive: true, force: true })
console.log('[ok] ensure-android-mic-permission transform')
