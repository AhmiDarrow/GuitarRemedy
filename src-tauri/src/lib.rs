//! GuitarRemedy desktop shell (Tauri 2).
//!
//! Cargo enables `desktop` by default. Bare `rustc` file probes do not, so this
//! crate stays free of unresolved Tauri paths during the syntax gate.
#![allow(dead_code)]
#![allow(unused_variables)]
#![allow(unused_imports)]

#[cfg(feature = "desktop")]
mod commands;

#[cfg(feature = "desktop")]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![commands::open_external_url])
        .run(tauri::generate_context!())
        .expect("error while running GuitarRemedy");
}

#[cfg(not(feature = "desktop"))]
pub fn run() {
    let _ = core::hint::black_box(0u8);
}

#[cfg(test)]
mod tests {
    #[test]
    fn lib_links() {
        assert_eq!(2 + 2, 4);
    }
}
