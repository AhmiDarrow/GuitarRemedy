/**
 * Ensure Capacitor Android manifests declare microphone access for the tuner.
 * Safe to re-run after `npx cap add android` / `npx cap sync` (CI regenerates android/).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml')

const PERMISSION =
  '    <uses-permission android:name="android.permission.RECORD_AUDIO" />'
const FEATURE =
  '    <uses-feature android:name="android.hardware.microphone" android:required="false" />'

function ensureLine(xml, line, marker) {
  if (xml.includes(marker)) return { xml, added: false }
  if (xml.includes('</manifest>')) {
    return {
      xml: xml.replace('</manifest>', `${line}\n</manifest>`),
      added: true,
    }
  }
  throw new Error(`No </manifest> in ${manifestPath}`)
}

if (!fs.existsSync(manifestPath)) {
  console.error(
    `[mic-permission] Missing ${path.relative(root, manifestPath)} — run cap add/sync first.`,
  )
  process.exit(1)
}

let xml = fs.readFileSync(manifestPath, 'utf8')
const before = xml

let r = ensureLine(xml, PERMISSION, 'android.permission.RECORD_AUDIO')
xml = r.xml
const permAdded = r.added

r = ensureLine(xml, FEATURE, 'android.hardware.microphone')
xml = r.xml
const featAdded = r.added

if (xml === before) {
  console.log('[mic-permission] AndroidManifest already has microphone permission.')
  process.exit(0)
}

fs.writeFileSync(manifestPath, xml, 'utf8')
console.log(
  `[mic-permission] Updated AndroidManifest.xml` +
    (permAdded ? ' (+RECORD_AUDIO)' : '') +
    (featAdded ? ' (+microphone feature)' : ''),
)
