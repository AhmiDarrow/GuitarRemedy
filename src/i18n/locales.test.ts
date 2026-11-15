import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('locale catalogs', () => {
  it('matches the English key set, placeholders, and protected lines', () => {
    const out = execFileSync(process.execPath, ['scripts/check-locales.mjs'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    })
    expect(out).toContain('ok locales=10 contentKeys=4185 messageKeys=937')
  })
})
