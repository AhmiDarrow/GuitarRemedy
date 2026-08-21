fn main() {
    // Only invoke tauri-build under Cargo with the desktop feature (default).
    // Bare rustc on this file has no crate graph — keep the probe silent.
    #[cfg(feature = "desktop")]
    tauri_build::build();
}
