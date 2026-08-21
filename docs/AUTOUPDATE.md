# Auto-update (GitHub Releases)

GuitarRemedy desktop uses the same Tauri 2 updater pattern as SecretSticky / SecretFolder / RemedyPDF.

## How it works

1. **Release workflow** (`.github/workflows/release.yml`) builds Windows NSIS + MSI on tag `v*`.
2. Artifacts are **minisign-signed** with `TAURI_SIGNING_PRIVATE_KEY`.
3. `latest.json` is published on the GitHub Release (via `includeUpdaterJson`).
4. The app polls:

   `https://github.com/AhmiDarrow/GuitarRemedy/releases/latest/download/latest.json`

5. **About → Check for updates → Install & restart** downloads and relaunches.

## One-time setup (before first push / release)

```bash
# Key already generated locally (do not commit):
#   C:\Users\Administrator\.tauri\guitarremedy.key
#   C:\Users\Administrator\.tauri\guitarremedy.key.pub

# After the GitHub repo exists:
gh secret set TAURI_SIGNING_PRIVATE_KEY < %USERPROFILE%\.tauri\guitarremedy.key
# optional if you set a password on the key:
# gh secret set TAURI_SIGNING_PRIVATE_KEY_PASSWORD
```

Public key is embedded in `src-tauri/tauri.conf.json` → `plugins.updater.pubkey`.

## CI (no release)

`.github/workflows/ci.yml` on `main` / PRs:

| Job | Gates |
|-----|--------|
| Frontend | `npm ci` → `npm test` (tsc + vitest) → `npm run build` |
| Rust | `cargo fmt --check` → `cargo test --all-features` |

## Local git ready / no push yet

This tree is prepared as a local git repo. **Do not push** until you create `AhmiDarrow/GuitarRemedy` and set the signing secret.

```bash
# later:
gh repo create AhmiDarrow/GuitarRemedy --private --source=. --remote=origin
git push -u origin main
git tag v0.1.0 && git push origin v0.1.0
```
