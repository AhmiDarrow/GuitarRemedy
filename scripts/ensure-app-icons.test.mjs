import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const script = path.join(root, 'scripts', 'ensure-app-icons.mjs')

describe('ensure-app-icons', () => {
  it('script exists and brand mark is present', () => {
    expect(fs.existsSync(script)).toBe(true)
    expect(fs.existsSync(path.join(root, 'public', 'assets', 'brand-mark.png'))).toBe(true)
  })

  it('generates tauri icons from brand-mark', () => {
    const r = spawnSync(process.execPath, [script], { encoding: 'utf8', cwd: root })
    expect(r.status, r.stderr || r.stdout).toBe(0)
    for (const rel of [
      'src-tauri/icons/icon.png',
      'src-tauri/icons/icon.ico',
      'src-tauri/icons/32x32.png',
      'src-tauri/icons/128x128.png',
      'public/icon-192.png',
      'public/icon-512.png',
    ]) {
      const p = path.join(root, rel)
      expect(fs.existsSync(p), rel).toBe(true)
      expect(fs.statSync(p).size).toBeGreaterThan(200)
    }
  })

  it('node fallback still writes android launcher icons when present', () => {
    const androidRes = path.join(root, 'android', 'app', 'src', 'main', 'res')
    if (!fs.existsSync(androidRes)) return
    const r = spawnSync(process.execPath, [script], { encoding: 'utf8', cwd: root })
    expect(r.status, r.stderr || r.stdout).toBe(0)
    const launcher = path.join(androidRes, 'mipmap-xxxhdpi', 'ic_launcher.png')
    expect(fs.existsSync(launcher)).toBe(true)
    expect(fs.statSync(launcher).size).toBeGreaterThan(200)
    const adaptive = path.join(androidRes, 'mipmap-anydpi-v26', 'ic_launcher.xml')
    expect(fs.existsSync(adaptive)).toBe(true)
  })
})
