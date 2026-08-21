// Prevents additional console window on Windows in release.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Bare `rustc` probes (build-engine syntax gate) do not link Cargo deps.
// Real desktop builds use Cargo default features → `desktop` → lib entry.
fn main() {
    #[cfg(feature = "desktop")]
    guitar_remedy_lib::run();

    #[cfg(not(feature = "desktop"))]
    {
        // Intentionally empty: syntax-gate / non-Cargo compile path.
    }
}
