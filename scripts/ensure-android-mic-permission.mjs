/**
 * Ensure Capacitor Android manifests declare microphone access for the tuner.
 * Safe to re-run after `npx cap add android` / `npx cap sync` (CI regenerates android/).
 *
 * Capacitor BridgeWebChromeClient.onPermissionRequest asks for BOTH
 * RECORD_AUDIO and MODIFY_AUDIO_SETTINGS when WebView getUserMedia wants
 * AUDIO_CAPTURE. If MODIFY_AUDIO_SETTINGS is missing, the launcher can fail
 * the whole grant → NotAllowedError even when the user already allowed Mic.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml')

/** Lines the live AndroidManifest must contain (marker → full XML line). */
export const MIC_MANIFEST_LINES = [
  {
    marker: 'android.permission.RECORD_AUDIO',
    line: '    <uses-permission android:name="android.permission.RECORD_AUDIO" />',
    label: 'RECORD_AUDIO',
  },
  {
    marker: 'android.permission.MODIFY_AUDIO_SETTINGS',
    line: '    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />',
    label: 'MODIFY_AUDIO_SETTINGS',
  },
  {
    marker: 'android.hardware.microphone',
    line: '    <uses-feature android:name="android.hardware.microphone" android:required="false" />',
    label: 'microphone feature',
  },
]

export function ensureLine(xml, line, marker) {
  if (xml.includes(marker)) return { xml, added: false }
  if (xml.includes('</manifest>')) {
    return {
      xml: xml.replace('</manifest>', `${line}\n</manifest>`),
      added: true,
    }
  }
  throw new Error(`No </manifest> in manifest`)
}

export function ensureMicPermissions(xml) {
  const added = []
  let next = xml
  for (const item of MIC_MANIFEST_LINES) {
    const r = ensureLine(next, item.line, item.marker)
    next = r.xml
    if (r.added) added.push(item.label)
  }
  return { xml: next, added }
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  if (!fs.existsSync(manifestPath)) {
    console.error(
      `[mic-permission] Missing ${path.relative(root, manifestPath)} — run cap add/sync first.`,
    )
    process.exit(1)
  }

  const before = fs.readFileSync(manifestPath, 'utf8')
  const { xml, added } = ensureMicPermissions(before)

  if (added.length === 0) {
    console.log(
      '[mic-permission] AndroidManifest already has RECORD_AUDIO + MODIFY_AUDIO_SETTINGS.',
    )
    process.exit(0)
  }

  fs.writeFileSync(manifestPath, xml, 'utf8')
  console.log(
    `[mic-permission] Updated AndroidManifest.xml (+${added.join(', ')})`,
  )
}
