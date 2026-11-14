#!/usr/bin/env node
/**
 * Single source of truth for product version.
 * Bumps package.json (+ lock), src-tauri/tauri.conf.json, src-tauri/Cargo.toml (+ lock),
 * and android/app/build.gradle (versionName + versionCode) together.
 *
 * Usage: node scripts/bump-version.mjs 0.1.1
 *    or: npm run version:bump -- 0.1.1
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const ver = (process.argv[2] || '').trim()
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(ver)) {
  console.error('Usage: node scripts/bump-version.mjs X.Y.Z')
  process.exit(1)
}

function writeJsonVersion(rel, keyPath = ['version']) {
  const full = path.join(root, rel)
  const raw = fs.readFileSync(full, 'utf8')
  const data = JSON.parse(raw)
  let cur = data
  for (let i = 0; i < keyPath.length - 1; i++) cur = cur[keyPath[i]]
  const last = keyPath[keyPath.length - 1]
  const prev = cur[last]
  cur[last] = ver
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  console.log(`  ${rel}: ${prev} → ${ver}`)
}

function writeCargoToml(rel) {
  const full = path.join(root, rel)
  const raw = fs.readFileSync(full, 'utf8')
  // Match package version only (first version = "..." under [package])
  const pkgVersion = /(^\[package\][\s\S]*?^version\s*=\s*")[^"]+(")/m
  // Test for a match, not a diff: re-running with the same version is a no-op, not an error.
  if (pkgVersion.test(raw)) {
    fs.writeFileSync(full, raw.replace(pkgVersion, `$1${ver}$2`), 'utf8')
  } else {
    // Fallback: first bare version line
    const alt = raw.replace(/^version\s*=\s*"[^"]+"/m, `version = "${ver}"`)
    if (alt === raw) {
      console.error(`Could not find version = "..." in ${rel}`)
      process.exit(1)
    }
    fs.writeFileSync(full, alt, 'utf8')
  }
  console.log(`  ${rel}: → ${ver}`)
}

/** Keep the crate's own entry in Cargo.lock in step (cargo would rewrite it on the next build). */
function writeCargoLock(rel) {
  const full = path.join(root, rel)
  if (!fs.existsSync(full)) return
  const raw = fs.readFileSync(full, 'utf8')
  const next = raw.replace(
    /(\[\[package\]\]\r?\nname = "guitar-remedy"\r?\nversion = ")[^"]+(")/,
    `$1${ver}$2`,
  )
  if (next !== raw) fs.writeFileSync(full, next, 'utf8')
  console.log(`  ${rel}: → ${ver}`)
}

/** versionCode = major*10000 + minor*100 + patch (fits 0.x.y and modest growth). */
function versionCodeFromSemver(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(v)
  if (!m) return 1
  return Number(m[1]) * 10000 + Number(m[2]) * 100 + Number(m[3])
}

function writeAndroidGradle(rel) {
  const full = path.join(root, rel)
  if (!fs.existsSync(full)) {
    console.log(`  ${rel}: skip (no android tree yet)`)
    return
  }
  const raw = fs.readFileSync(full, 'utf8')
  const code = versionCodeFromSemver(ver)
  let next = raw.replace(/versionName\s+"[^"]+"/, `versionName "${ver}"`)
  next = next.replace(/versionCode\s+\d+/, `versionCode ${code}`)
  if (!/versionName\s+"[^"]+"/.test(raw) || !/versionCode\s+\d+/.test(raw)) {
    console.error(`Could not patch versionName/versionCode in ${rel}`)
    process.exit(1)
  }
  fs.writeFileSync(full, next, 'utf8')
  console.log(`  ${rel}: versionName ${ver}, versionCode ${code}`)
}

console.log(`Bumping GuitarRemedy to ${ver}`)
writeJsonVersion('package.json')
writeJsonVersion('package-lock.json')
writeJsonVersion('package-lock.json', ['packages', '', 'version'])
writeJsonVersion('src-tauri/tauri.conf.json')
writeCargoToml('src-tauri/Cargo.toml')
writeCargoLock('src-tauri/Cargo.lock')
writeAndroidGradle('android/app/build.gradle')
console.log('Done. UI picks up package.json via Vite __APP_VERSION__.')
console.log(`Next: commit, tag v${ver}, push tag to run Release.`)
