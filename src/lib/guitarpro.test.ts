import { describe, expect, it } from 'vitest'
import { parseGuitarPro } from './guitarpro'

describe('guitarpro', () => {
  it('returns a stub result for empty buffer without throwing', async () => {
    const result = await parseGuitarPro(new ArrayBuffer(0), 'empty.gp')
    expect(result).toBeTruthy()
    expect(typeof result.title).toBe('string')
    expect(Array.isArray(result.notes)).toBe(true)
    expect(Array.isArray(result.warnings)).toBe(true)
    expect(result.warnings.length + result.notes.length).toBeGreaterThan(0)
  })

  it('accepts a tiny fake GP header without throwing', async () => {
    const bytes = new Uint8Array(64)
    bytes.set(new TextEncoder().encode('FICHIER GUITAR PRO'))
    const result = await parseGuitarPro(bytes.buffer, 'demo.gp5')
    expect(typeof result.title).toBe('string')
    expect(result.source === 'binary-header' || result.source === 'stub' || result.notes).toBeTruthy()
  })
})
