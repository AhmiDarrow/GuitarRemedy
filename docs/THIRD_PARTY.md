# Third-party licenses (free / open only)

GuitarRemedy ships **only free and open licenses** for code, models, and built-in content.

## Application

| Component | License |
|-----------|---------|
| GuitarRemedy source | MIT © Ahmi Darrow |

## Runtime dependencies (npm)

All production deps are OSI-friendly (MIT, Apache-2.0, BSD, ISC, 0BSD, MPL-2.0, etc.). No proprietary SDKs.

Notable:

| Package | License | Role |
|---------|---------|------|
| `@spotify/basic-pitch` | Apache-2.0 | Multipitch audio→MIDI assist |
| `@tensorflow/tfjs` (transitive) | Apache-2.0 | Runs Basic Pitch in-browser |
| `tone` | MIT | Audio playback |
| `react` / `react-dom` / `react-router-dom` | MIT | UI |
| `@tauri-apps/*` | Apache-2.0 OR MIT | Desktop shell |
| `zustand` / `clsx` / `lucide-react` | MIT | State / icons |

## ML model

| Asset | License | Path |
|-------|---------|------|
| Spotify Basic Pitch TFJS weights | Apache-2.0 | `public/models/basic-pitch/` |

When the model cannot load, the app **falls back** to the built-in autocorrelation pitch path (no network required).

## Built-in music content

Public-domain, traditional, or original study material only. No commercial copyrighted tracks in the library.

## Policy

If a dependency or asset is not free/open, it must not ship in GuitarRemedy.
