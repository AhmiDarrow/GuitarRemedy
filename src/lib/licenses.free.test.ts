import { describe, expect, it } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Guardrail: GuitarRemedy ships free/open licenses only.
 * Fails if package.json pulls a known non-free production dep name,
 * or if the Basic Pitch model / THIRD_PARTY doc is missing.
 */
describe('free license policy', () => {
  const root = process.cwd()

  it('documents third-party free licenses', () => {
    const doc = join(root, 'docs', 'THIRD_PARTY.md')
    expect(existsSync(doc)).toBe(true)
    const body = readFileSync(doc, 'utf8')
    expect(body).toMatch(/Apache-2\.0/)
    expect(body).toMatch(/Basic Pitch/i)
    expect(body).toMatch(/MIT/)
  })

  it('bundles free Basic Pitch model weights', () => {
    expect(existsSync(join(root, 'public', 'models', 'basic-pitch', 'model.json'))).toBe(true)
    expect(existsSync(join(root, 'public', 'models', 'basic-pitch', 'group1-shard1of1.bin'))).toBe(
      true,
    )
  })

  it('depends on @spotify/basic-pitch (Apache-2.0) and not proprietary audio SDKs', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>
      license?: string
    }
    expect(pkg.license).toMatch(/MIT/i)
    expect(pkg.dependencies?.['@spotify/basic-pitch']).toBeTruthy()
    const deps = Object.keys(pkg.dependencies ?? {})
    // Block obvious proprietary / non-free SDKs if ever added
    const banned = [/splice/i, /landr/i, /antares/i, /izotope/i, /output\.com/i]
    for (const name of deps) {
      for (const re of banned) {
        expect(re.test(name)).toBe(false)
      }
    }
  })

  it('lockfile production licenses stay OSI-friendly', () => {
    const lock = readFileSync(join(root, 'package-lock.json'), 'utf8')
    // Spot-check: no explicit UNLICENSED production marker in lock meta we care about
    expect(lock).not.toMatch(/"license":\s*"UNLICENSED"/)
    expect(lock).toMatch(/Apache-2\.0/)
    expect(lock).toMatch(/"@spotify\/basic-pitch"/)
  })
})
