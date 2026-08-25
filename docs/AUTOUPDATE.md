# Auto-update (GitHub Releases)

GuitarRemedy desktop uses the same Tauri 2 updater pattern as SecretSticky / SecretFolder / RemedyPDF.

## How it works

1. **Release workflow** (`.github/workflows/release.yml`) on tag `v*`:
   - **Windows:** NSIS + MSI + minisign updater artifacts + `latest.json`
   - **Android:** Capacitor debug APK attached to the **same published** release
2. Artifacts are **minisign-signed** with `TAURI_SIGNING_PRIVATE_KEY` (desktop installers).
3. `latest.json` is published on the GitHub Release (via `includeUpdaterJson`).
4. Releases are **not left as drafts** — `/releases/latest/download/latest.json` only works for published releases.
5. The app polls:

   `https://github.com/AhmiDarrow/GuitarRemedy/releases/latest/download/latest.json`

6. **About → Check for updates → Install & restart** downloads and relaunches.

### In-app pieces (already wired)

| Piece | Location |
|--------|----------|
| Updater plugin | `src-tauri` + `tauri-plugin-updater` |
| Pubkey + endpoint | `src-tauri/tauri.conf.json` → `plugins.updater` |
| Capabilities | `updater:default`, `process:allow-restart` |
| UI | `src/lib/updater.ts` + About page |
| Tests | `src/lib/updater.test.ts` |

Web/PWA builds show a clear “desktop only” message — no fake update path.

## One-time setup

```bash
# Key lives locally (do not commit):
#   %USERPROFILE%\.tauri\guitarremedy.key
#   %USERPROFILE%\.tauri\guitarremedy.key.pub
# Public half is embedded in tauri.conf.json.

gh secret set TAURI_SIGNING_PRIVATE_KEY < %USERPROFILE%\.tauri\guitarremedy.key
# optional if the key has a password:
# gh secret set TAURI_SIGNING_PRIVATE_KEY_PASSWORD
```

## CI (every push / PR)

`.github/workflows/ci.yml`:

| Job | Gates |
|-----|--------|
| Frontend | `npm ci` → `npm test` (tsc + vitest) → `npm run build` |
| Rust | `cargo fmt --check` → `cargo test --all-features` |

Local mirror: `npm run ci:local`

## Version bump (all surfaces)

```bash
npm run version:bump -- 0.1.1
# updates package.json + tauri.conf.json + Cargo.toml
git commit -am "chore: bump version to 0.1.1"
git tag v0.1.1
git push origin main --tags
```

## First release

```bash
git push -u origin main          # CI must go green
git tag v0.1.0
git push origin v0.1.0           # Release workflow → published Windows + APK + latest.json
```

## Installer polish

See [`WINDOWS_INSTALLER.md`](WINDOWS_INSTALLER.md) and [`ANDROID.md`](ANDROID.md).  
Updater minisign is separate from Windows Authenticode (SmartScreen).
