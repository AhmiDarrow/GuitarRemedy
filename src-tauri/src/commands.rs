//! Tauri commands for GuitarRemedy desktop shell.

const ALLOWED_EXTERNAL_URLS: &[&str] = &[
    "https://github.com/AhmiDarrow",
    "https://github.com/AhmiDarrow/GuitarRemedy",
    "https://github.com/AhmiDarrow/GuitarRemedy/releases",
    "https://github.com/AhmiDarrow/GuitarRemedy/issues",
    "https://www.patreon.com/AhmiDarrow",
];

#[tauri::command]
pub fn open_external_url(url: String) -> Result<(), String> {
    open_external_url_inner(&url)
}

fn open_external_url_inner(url: &str) -> Result<(), String> {
    let trimmed = url.trim();
    if !ALLOWED_EXTERNAL_URLS.contains(&trimmed) {
        return Err("url not allowed".into());
    }
    open_url_in_browser(trimmed)
}

fn open_url_in_browser(url: &str) -> Result<(), String> {
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x0800_0000;
        std::process::Command::new("cmd")
            .args(["/C", "start", "", url])
            .creation_flags(CREATE_NO_WINDOW)
            .spawn()
            .map_err(|e| format!("open url: {e}"))?;
        Ok(())
    }
    #[cfg(not(windows))]
    {
        let _ = url;
        Err("open url unsupported on this platform".into())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn allowlist_rejects_unknown() {
        let err = open_external_url_inner("https://evil.example").unwrap_err();
        assert!(err.contains("not allowed"));
    }

    #[test]
    fn allowlist_includes_repo_links() {
        for url in ALLOWED_EXTERNAL_URLS {
            assert!(ALLOWED_EXTERNAL_URLS.contains(url));
        }
    }
}
