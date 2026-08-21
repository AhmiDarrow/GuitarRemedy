# GuitarRemedy — Windows installer polish

Desktop shell is **Tauri 2**. Release CI builds **NSIS** (`.exe` setup) + **MSI** and publishes updater metadata (`latest.json`) on GitHub Releases.

## What users install

| Artifact | Prefer when |
|----------|-------------|
| **NSIS** `GuitarRemedy_x.y.z_x64-setup.exe` | Normal desktop install (default in About / Releases) |
| **MSI** | Fleet / Group Policy / silent enterprise |
| Portable | Not shipped — use NSIS current-user install |

NSIS is configured in `src-tauri/tauri.conf.json`:

- `bundle.windows.nsis.installMode`: **currentUser** (no admin elevation for standard installs)
- `installerIcon`: brand icon
- `createUpdaterArtifacts`: **true** (signed `.sig` next to installers)
- Updater `installMode`: **passive**

## Local release build

```bash
npm ci
npm test
npm run tauri:build
# artifacts:
#   src-tauri/target/release/bundle/nsis/
#   src-tauri/target/release/bundle/msi/
```

## GitHub Release (draft)

1. Repo secret `TAURI_SIGNING_PRIVATE_KEY` = contents of `~/.tauri/guitarremedy.key`
2. Tag: `git tag v0.1.0 && git push origin v0.1.0`
3. Workflow `.github/workflows/release.yml` → draft release with NSIS + MSI + `latest.json`
4. Smoke-install the NSIS build on a clean Windows VM
5. Publish the draft when happy

See also [`docs/AUTOUPDATE.md`](./AUTOUPDATE.md).

## Code signing (Authenticode) — SmartScreen

Minisign **updater** signing ≠ Windows **Authenticode**. Without an EV/OV cert, first runs may show SmartScreen “Unknown publisher”.

### When you have a cert

1. Obtain an Authenticode certificate (OV/EV) as `.pfx` (or use cloud signing).
2. On the release machine / CI, set:

```text
TAURI_SIGNING_PRIVATE_KEY          # already used for updater (minisign)
WINDOWS_CERTIFICATE                # base64 of .pfx  (optional CI pattern)
WINDOWS_CERTIFICATE_PASSWORD       # pfx password
```

3. In `src-tauri/tauri.conf.json` → `bundle.windows`:

```json
"certificateThumbprint": "<YOUR_CERT_THUMBPRINT>",
"digestAlgorithm": "sha256",
"timestampUrl": "http://timestamp.digicert.com"
```

Or sign after build with `signtool`:

```bat
signtool sign /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 /f cert.pfx /p %PASS% GuitarRemedy_*.exe
```

4. Re-upload signed installers to the GitHub Release (and re-sign updater payloads if the binary bytes change).

### Without a cert (current default)

- Ship **draft** releases; early testers click “More info → Run anyway”.
- Reputation builds over time with consistent publisher name **Ahmi Darrow** / `com.ahmidarrow.guitarremedy`.
- Document this on the Release notes (template already mentions NSIS preference).

## Installer UX checklist

- [x] Product name **GuitarRemedy**
- [x] Dark Forest icons in `src-tauri/icons/`
- [x] currentUser NSIS (no admin for default path)
- [x] Updater endpoint + pubkey embedded
- [x] About → Check for updates → Install & restart
- [x] Short + long bundle descriptions
- [ ] Authenticode cert (when purchased)
- [ ] Optional custom NSIS license page (MIT is in repo `LICENSE`)
- [ ] Optional start-menu web link to wiki / Patreon

## Silent install (NSIS)

```bat
GuitarRemedy_0.1.0_x64-setup.exe /S
```

MSI:

```bat
msiexec /i GuitarRemedy_0.1.0_x64_en-US.msi /qn
```

## Uninstall

Windows Settings → Apps → GuitarRemedy, or the NSIS uninstaller in the install directory.

## Version bump

1. `package.json` → `version`
2. `src-tauri/tauri.conf.json` → `version`
3. `src-tauri/Cargo.toml` → `version`
4. Tag `vX.Y.Z` matching those versions
