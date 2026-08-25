#!/usr/bin/env node
/**
 * Single source of truth for product version.
 * Bumps package.json, src-tauri/tauri.conf.json, and src-tauri/Cargo.toml together.
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
  const next = raw.replace(
    /^version\s*=\s*"[^"]+"/m,
    `version = "${ver}"`,
  )
  if (next === raw) {
    console.error(`Could not find version = "..." in ${rel}`)
    process.exit(1)
  }
  fs.writeFileSync(full, next, 'utf8')
  console.log(`  ${rel}: → ${ver}`)
}

console.log(`Bumping GuitarRemedy to ${ver}`)
writeJsonVersion('package.json')
writeJsonVersion('src-tauri/tauri.conf.json')
writeCargoToml('src-tauri/Cargo.toml')
console.log('Done. UI picks up package.json via Vite __APP_VERSION__.')
console.log(`Next: commit, tag v${ver}, push tag to run Release.`)
