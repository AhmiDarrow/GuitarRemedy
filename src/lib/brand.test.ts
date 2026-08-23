import { describe, expect, it } from 'vitest'
import { APP_NAME, APP_VERSION, APP_VERSION_FALLBACK, resolveAppVersion } from './brand'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('brand version', () => {
  it('APP_VERSION matches package.json (no hardcoded UI drift)', () => {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
    ) as { version: string }
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+/)
    expect(APP_VERSION).toBe(pkg.version)
    expect(APP_VERSION_FALLBACK).toBe(APP_VERSION)
    expect(APP_NAME).toBe('GuitarRemedy')
  })

  it('resolveAppVersion returns a semver-ish string', async () => {
    const v = await resolveAppVersion()
    expect(v).toMatch(/^\d+\.\d+/)
    expect(v).toBe(APP_VERSION)
  })
})
