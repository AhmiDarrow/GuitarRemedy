/**
 * Merge partial locale JSON objects into one catalog in English key order.
 *
 *   node scripts/merge-locale-parts.mjs src/i18n/source/lessons-1.json out.json part-a.json part-b.json
 *
 * Every English key must be present in some part. Extra keys are rejected.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const [enPath, outPath, ...parts] = process.argv.slice(2)
if (!enPath || !outPath || parts.length === 0) {
  console.error('usage: node scripts/merge-locale-parts.mjs <english.json> <out.json> <part.json>...')
  process.exit(2)
}

const english = JSON.parse(readFileSync(enPath, 'utf8'))
const merged = {}
for (const part of parts) {
  const data = JSON.parse(readFileSync(part, 'utf8'))
  for (const [key, value] of Object.entries(data)) {
    if (!Object.prototype.hasOwnProperty.call(english, key)) {
      console.error(`extra key ${key} in ${part}`)
      process.exit(1)
    }
    if (typeof value !== 'string' || value.length === 0) {
      console.error(`empty ${key} in ${part}`)
      process.exit(1)
    }
    merged[key] = value
  }
}

const ordered = {}
const missing = []
for (const key of Object.keys(english)) {
  if (!Object.prototype.hasOwnProperty.call(merged, key)) missing.push(key)
  else ordered[key] = merged[key]
}
if (missing.length) {
  console.error(`missing ${missing.length} keys, first: ${missing.slice(0, 8).join(', ')}`)
  process.exit(1)
}

writeFileSync(outPath, `${JSON.stringify(ordered, null, 2)}\n`, 'utf8')
console.log(`wrote ${outPath} keys=${Object.keys(ordered).length}`)
