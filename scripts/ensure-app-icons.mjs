/**
 * Generate Windows (Tauri) + Android launcher icons from public/assets/brand-mark.png.
 * Idempotent. Safe after `cap add` / `cap sync` (fresh android/ trees).
 *
 * Prefers Python+Pillow when available (high-quality resize).
 * Falls back to pure Node copy + adaptive XML so CI never fails without Pillow.
 *
 * Usage: node scripts/ensure-app-icons.mjs
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const brandPath = path.join(root, 'public', 'assets', 'brand-mark.png')
const DF_BG = '#050A08'

function die(msg) {
  console.error(`[ensure-app-icons] ${msg}`)
  process.exit(1)
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest))
  fs.copyFileSync(src, dest)
}

if (!fs.existsSync(brandPath)) {
  die(`missing brand mark: ${brandPath}`)
}

const py = `
from __future__ import annotations
import struct
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError as e:
    raise SystemExit(f"Pillow required: {e}")

ROOT = Path(r${JSON.stringify(root)})
BRAND = Path(r${JSON.stringify(brandPath)})
DF = (5, 10, 8, 255)  # #050a08

def load_brand() -> Image.Image:
    im = Image.open(BRAND).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            if r < 18 and g < 22 and b < 20:
                px[x, y] = (r, g, b, 0)
    return im

def fit_on_canvas(src: Image.Image, size: int, scale: float = 0.72, bg=None) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg if bg is not None else (0, 0, 0, 0))
    side = max(1, int(size * scale))
    art = src.copy()
    art.thumbnail((side, side), Image.Resampling.LANCZOS)
    x = (size - art.width) // 2
    y = (size - art.height) // 2
    canvas.alpha_composite(art, (x, y))
    return canvas

def circle_mask(size: int) -> Image.Image:
    m = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(m)
    d.ellipse((0, 0, size - 1, size - 1), fill=255)
    return m

def save(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, format="PNG")

def write_ico(images: list, path: Path) -> None:
    entries = []
    blobs = []
    offset = 6 + 16 * len(images)
    for im in images:
        buf = __import__("io").BytesIO()
        im.save(buf, format="PNG")
        data = buf.getvalue()
        w, h = im.size
        entries.append((w if w < 256 else 0, h if h < 256 else 0, len(data), offset))
        blobs.append(data)
        offset += len(data)
    out = bytearray()
    out += struct.pack("<HHH", 0, 1, len(images))
    for w, h, size, off in entries:
        out += struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, size, off)
    for b in blobs:
        out += b
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(bytes(out))

brand = load_brand()

icons = ROOT / "src-tauri" / "icons"
full = fit_on_canvas(brand, 512, scale=0.92, bg=DF)
save(full, icons / "icon.png")
save(fit_on_canvas(brand, 32, scale=0.92, bg=DF), icons / "32x32.png")
save(fit_on_canvas(brand, 128, scale=0.92, bg=DF), icons / "128x128.png")
save(fit_on_canvas(brand, 256, scale=0.92, bg=DF), icons / "128x128@2x.png")
write_ico(
    [
        fit_on_canvas(brand, 16, scale=0.92, bg=DF),
        fit_on_canvas(brand, 24, scale=0.92, bg=DF),
        fit_on_canvas(brand, 32, scale=0.92, bg=DF),
        fit_on_canvas(brand, 48, scale=0.92, bg=DF),
        fit_on_canvas(brand, 64, scale=0.92, bg=DF),
        fit_on_canvas(brand, 128, scale=0.92, bg=DF),
        fit_on_canvas(brand, 256, scale=0.92, bg=DF),
    ],
    icons / "icon.ico",
)

pub = ROOT / "public"
save(fit_on_canvas(brand, 192, scale=0.92, bg=DF), pub / "icon-192.png")
save(fit_on_canvas(brand, 512, scale=0.92, bg=DF), pub / "icon-512.png")

android_res = ROOT / "android" / "app" / "src" / "main" / "res"
if android_res.is_dir():
    dens = [
        ("mipmap-mdpi", 48, 108),
        ("mipmap-hdpi", 72, 162),
        ("mipmap-xhdpi", 96, 216),
        ("mipmap-xxhdpi", 144, 324),
        ("mipmap-xxxhdpi", 192, 432),
    ]
    for folder, legacy, fg in dens:
        d = android_res / folder
        fg_im = fit_on_canvas(brand, fg, scale=0.66, bg=None)
        save(fg_im, d / "ic_launcher_foreground.png")
        leg = fit_on_canvas(brand, legacy, scale=0.78, bg=DF)
        save(leg, d / "ic_launcher.png")
        base = Image.new("RGBA", (legacy, legacy), (0, 0, 0, 0))
        base.paste(leg, (0, 0))
        base.putalpha(circle_mask(legacy))
        save(base, d / "ic_launcher_round.png")

    values = android_res / "values"
    values.mkdir(parents=True, exist_ok=True)
    (values / "ic_launcher_background.xml").write_text(
        '''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${DF_BG}</color>
</resources>
''',
        encoding="utf-8",
    )

    anydpi = android_res / "mipmap-anydpi-v26"
    anydpi.mkdir(parents=True, exist_ok=True)
    for name in ("ic_launcher.xml", "ic_launcher_round.xml"):
        (anydpi / name).write_text(
            '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
''',
            encoding="utf-8",
        )
    print("android icons: ok")
else:
    print("android/: skip (not present)")

print("tauri icons: ok")
print("done")
`

function writeAndroidXml(androidRes) {
  const values = path.join(androidRes, 'values')
  ensureDir(values)
  fs.writeFileSync(
    path.join(values, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${DF_BG}</color>
</resources>
`,
    'utf8',
  )

  const anydpi = path.join(androidRes, 'mipmap-anydpi-v26')
  ensureDir(anydpi)
  const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`
  for (const name of ['ic_launcher.xml', 'ic_launcher_round.xml']) {
    fs.writeFileSync(path.join(anydpi, name), adaptive, 'utf8')
  }
}

/** Pure Node fallback — no Python/Pillow. Copies brand art into required slots. */
function nodeFallback() {
  const brand = brandPath
  const icons = path.join(root, 'src-tauri', 'icons')
  ensureDir(icons)

  // Prefer already-generated Tauri icons when present; otherwise seed from brand-mark.
  const tauriTargets = [
    ['icon.png', brand],
    ['32x32.png', path.join(icons, '32x32.png')],
    ['128x128.png', path.join(icons, '128x128.png')],
    ['128x128@2x.png', path.join(icons, '128x128@2x.png')],
    ['icon.ico', path.join(icons, 'icon.ico')],
  ]
  for (const [name, preferred] of tauriTargets) {
    const dest = path.join(icons, name)
    if (fs.existsSync(preferred) && preferred !== dest) {
      // keep existing sized asset
      continue
    }
    if (!fs.existsSync(dest)) {
      if (name.endsWith('.ico') && fs.existsSync(path.join(icons, 'icon.ico'))) continue
      if (name.endsWith('.ico')) {
        // ICO needs a real file — skip if missing; Tauri may already have one committed
        if (!fs.existsSync(dest)) {
          console.warn(`[ensure-app-icons] missing ${name}; commit icons or install Pillow for generation`)
        }
        continue
      }
      copyFile(brand, dest)
    }
  }
  // Always refresh main icon.png from brand for consistency when no pillow
  if (!fs.existsSync(path.join(icons, 'icon.png'))) copyFile(brand, path.join(icons, 'icon.png'))

  const pub = path.join(root, 'public')
  if (!fs.existsSync(path.join(pub, 'icon-192.png'))) copyFile(brand, path.join(pub, 'icon-192.png'))
  if (!fs.existsSync(path.join(pub, 'icon-512.png'))) copyFile(brand, path.join(pub, 'icon-512.png'))

  const androidRes = path.join(root, 'android', 'app', 'src', 'main', 'res')
  if (fs.existsSync(androidRes)) {
    const dens = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi']
    for (const folder of dens) {
      const d = path.join(androidRes, folder)
      ensureDir(d)
      // Brand mark as launcher + foreground (Android scales; better than default Capacitor icon)
      copyFile(brand, path.join(d, 'ic_launcher.png'))
      copyFile(brand, path.join(d, 'ic_launcher_round.png'))
      copyFile(brand, path.join(d, 'ic_launcher_foreground.png'))
    }
    writeAndroidXml(androidRes)
    console.log('android icons: ok (node fallback)')
  } else {
    console.log('android/: skip (not present)')
  }

  console.log('tauri icons: ok (node fallback)')
  console.log('done')
  console.log('[ensure-app-icons] brand-mark → Windows + Android icons (node fallback)')
}

function tryPython() {
  const tmp = path.join(root, '.remedy-build', 'tmp', 'ensure_app_icons.py')
  ensureDir(path.dirname(tmp))
  // Inject DF_BG into the python template (used in XML write)
  const body = py.replaceAll('${DF_BG}', DF_BG)
  fs.writeFileSync(tmp, body, 'utf8')

  const candidates =
    process.platform === 'win32' ? ['python', 'py', 'python3'] : ['python3', 'python']
  for (const cmd of candidates) {
    const r = spawnSync(cmd, [tmp], { encoding: 'utf8', cwd: root })
    if (r.error && r.error.code === 'ENOENT') continue
    if (r.status === 0) {
      process.stdout.write(r.stdout || '')
      if (r.stderr) process.stderr.write(r.stderr)
      console.log('[ensure-app-icons] brand-mark → Windows + Android icons')
      return true
    }
    // Pillow missing or other failure — try next / fall through
    const err = `${r.stdout || ''}\n${r.stderr || ''}`.trim()
    if (err) console.warn(`[ensure-app-icons] ${cmd} failed:\n${err}`)
  }
  return false
}

if (!tryPython()) {
  console.warn('[ensure-app-icons] Python/Pillow unavailable — using pure Node fallback')
  nodeFallback()
}
