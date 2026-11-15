import { describe, expect, it } from 'vitest'
import {
  ABOUT_HELLO,
  ABOUT_SIGN_OFF,
  APP_NAME,
  APP_VERSION,
  APP_VERSION_FALLBACK,
  resolveAppVersion,
} from './brand'
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

  it('keeps the greeting and ships the exact Ahmi sign-off', () => {
    expect(ABOUT_HELLO).toBe("Hi I'm Ahmi, hope this helps!")
    expect(ABOUT_SIGN_OFF).toBe('"Hope this helps" - Ahmi')
    const about = readFileSync(join(process.cwd(), 'src/pages/AboutPage.tsx'), 'utf8')
    expect(about).toContain('ABOUT_HELLO')
    expect(about).toContain('ABOUT_SIGN_OFF')
    expect(about).not.toContain('tx(ABOUT_SIGN_OFF')
    const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8')
    expect(readme).toContain('"Hope this helps" - Ahmi')
  })
})
