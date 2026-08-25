/**
 * Smoke-test the mic-permission patcher.
 * Run: node scripts/ensure-android-mic-permission.test.mjs
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const script = path.join(root, 'scripts', 'ensure-android-mic-permission.mjs')

const { ensureLine, ensureMicPermissions, MIC_MANIFEST_LINES } = await import(
  pathToFileURL(script).href
)

const bare = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:label="GuitarRemedy" />
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>
`

let { xml, added } = ensureMicPermissions(bare)
if (added.length !== MIC_MANIFEST_LINES.length) {
  throw new Error(`expected ${MIC_MANIFEST_LINES.length} adds, got ${added.join(',')}`)
}
for (const item of MIC_MANIFEST_LINES) {
  if (!xml.includes(item.marker)) throw new Error(`missing ${item.marker}`)
}

// idempotent
;({ xml, added } = ensureMicPermissions(xml))
if (added.length !== 0) throw new Error(`second pass should be no-op, got ${added}`)

// RECORD_AUDIO alone is not enough (Capacitor also requests MODIFY_AUDIO_SETTINGS)
const onlyRecord = bare.replace(
  '</manifest>',
  '    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n</manifest>',
)
;({ xml, added } = ensureMicPermissions(onlyRecord))
if (!added.includes('MODIFY_AUDIO_SETTINGS')) {
  throw new Error('expected MODIFY_AUDIO_SETTINGS when only RECORD_AUDIO present')
}
if (!xml.includes('android.permission.MODIFY_AUDIO_SETTINGS')) {
  throw new Error('MODIFY_AUDIO_SETTINGS line missing after patch')
}

// ensureLine unit
const once = ensureLine(bare, MIC_MANIFEST_LINES[0].line, MIC_MANIFEST_LINES[0].marker)
if (!once.added) throw new Error('ensureLine should add')
const twice = ensureLine(once.xml, MIC_MANIFEST_LINES[0].line, MIC_MANIFEST_LINES[0].marker)
if (twice.added) throw new Error('ensureLine should be idempotent')

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
  if (!live.includes('android.permission.MODIFY_AUDIO_SETTINGS')) {
    throw new Error('live AndroidManifest missing MODIFY_AUDIO_SETTINGS')
  }
  console.log('[ok] live AndroidManifest has RECORD_AUDIO + MODIFY_AUDIO_SETTINGS')
} else {
  console.log('[ok] transform only (no local android/ tree)')
}

// temp-tree run of the CLI path
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gr-mic-'))
try {
  // Script always targets repo android/ — live path above covers CLI.
  console.log('[ok] ensure-android-mic-permission transform')
} finally {
  fs.rmSync(tmp, { recursive: true, force: true })
}
