#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{
    atomic::{AtomicUsize, Ordering},
    Arc,
};

use tauri::{
    menu::{CheckMenuItem, Menu, MenuItemKind, Submenu},
    webview::{NewWindowResponse, WebviewWindowBuilder},
    AppHandle, Manager, Runtime, WebviewUrl,
};
use tauri_plugin_global_shortcut::{Builder as GlobalShortcutBuilder, ShortcutState};
use tauri_plugin_opener::OpenerExt;
use url::Url;

const APP_URL: &str = "https://xtiles.app";
const LOGIN_URL: &str = "https://xtiles.app/user/login";
const USER_AGENT: &str = "Chrome";
const MENU_SHORTCUT: &str = "Alt+Backslash";
const MENU_SHORTCUT_LABEL: &str = "Alt+\\";
const MENU_ITEM_ID: &str = "toggle-menu-bar";
const MAIN_WINDOW_LABEL: &str = "main";

fn trusted_app_url() -> Url {
    Url::parse(APP_URL).expect("APP_URL must be a valid URL")
}

fn is_trusted_app_url(candidate: &Url) -> bool {
    let trusted = trusted_app_url();

    candidate.scheme() == trusted.scheme()
        && candidate.host_str() == trusted.host_str()
        && candidate.port() == trusted.port()
}

fn is_about_blank_url(candidate: &Url) -> bool {
    candidate.as_str() == "about:blank"
}

fn build_menu<R: Runtime, M: Manager<R>>(manager: &M) -> tauri::Result<Menu<R>> {
    let menu_item = CheckMenuItem::with_id(
        manager,
        MENU_ITEM_ID,
        format!("Show menu bar with {MENU_SHORTCUT_LABEL}"),
        true,
        false,
        None::<&str>,
    )?;
    let window_menu = Submenu::with_items(manager, "Window", true, &[&menu_item])?;
    Menu::with_items(manager, &[&window_menu])
}

fn toggle_menu<R: Runtime>(app: &AppHandle<R>) {
    let Some(window) = app.get_webview_window(MAIN_WINDOW_LABEL) else {
        return;
    };

    match window.is_menu_visible() {
        Ok(true) => {
            let _ = app.hide_menu();
        }
        Ok(false) => {
            let _ = app.show_menu();
        }
        Err(error) => eprintln!("Unable to read menu visibility: {error}"),
    }
}

fn next_window_label(counter: &AtomicUsize) -> String {
    format!("popup-{}", counter.fetch_add(1, Ordering::Relaxed))
}

fn create_webview<R: Runtime>(
    app: &AppHandle<R>,
    label: String,
    url: Url,
    counter: Arc<AtomicUsize>,
) -> tauri::Result<tauri::WebviewWindow<R>> {
    let child_app = app.clone();
    let child_counter = counter.clone();

    let mut builder = WebviewWindowBuilder::new(app, label, WebviewUrl::External(url))
        .title("xTiles")
        .user_agent(USER_AGENT);

    if let Some(icon) = app.default_window_icon().cloned() {
        builder = builder.icon(icon)?;
    }

    builder
        .on_new_window(move |url, _features| {
            if is_about_blank_url(&url) {
                return NewWindowResponse::Allow;
            }

            if !is_trusted_app_url(&url) {
                if let Err(error) = child_app.opener().open_url(url.as_str(), None::<&str>) {
                    eprintln!("Unable to open external URL {url}: {error}");
                }
                return NewWindowResponse::Deny;
            }

            match create_webview(
                &child_app,
                next_window_label(&child_counter),
                url,
                child_counter.clone(),
            ) {
                Ok(window) => NewWindowResponse::Create { window },
                Err(error) => {
                    eprintln!("Unable to create popup window: {error}");
                    NewWindowResponse::Deny
                }
            }
        })
        .build()
}

pub fn run() {
    tauri::Builder::default()
        .plugin(
            GlobalShortcutBuilder::new()
                .with_shortcut(MENU_SHORTCUT)
                .expect("MENU_SHORTCUT must be valid")
                .with_handler(|app, _shortcut, event| {
                    if event.state == ShortcutState::Pressed {
                        toggle_menu(app);
                    }
                })
                .build(),
        )
        .plugin(
            tauri_plugin_opener::Builder::new()
                .open_js_links_on_click(false)
                .build(),
        )
        .setup(|app| {
            let menu = build_menu(app)?;
            app.set_menu(menu)?;

            let counter = Arc::new(AtomicUsize::new(1));
            let window = create_webview(
                &app.handle().clone(),
                MAIN_WINDOW_LABEL.to_owned(),
                Url::parse(LOGIN_URL).expect("LOGIN_URL must be a valid URL"),
                counter,
            )?;

            if std::env::var("CI").as_deref() != Ok("true") {
                window.maximize()?;
            }

            window.hide_menu()?;
            Ok(())
        })
        .on_menu_event(|app, event| {
            if event.id() != MENU_ITEM_ID {
                return;
            }

            if let Some(MenuItemKind::Check(item)) =
                app.menu().and_then(|menu| menu.get(MENU_ITEM_ID))
            {
                let _ = item.set_checked(false);
            }
            let _ = app.hide_menu();
        })
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}

#[cfg(test)]
mod tests {
    use super::{is_about_blank_url, is_trusted_app_url};
    use url::Url;

    #[test]
    fn trusts_only_xtiles_app_urls() {
        assert!(is_trusted_app_url(
            &Url::parse("https://xtiles.app/workspace").unwrap()
        ));
        assert!(!is_trusted_app_url(
            &Url::parse("https://www.xtiles.app/workspace").unwrap()
        ));
        assert!(!is_trusted_app_url(
            &Url::parse("https://xtiles.app:8443/workspace").unwrap()
        ));
        assert!(!is_trusted_app_url(
            &Url::parse("https://example.com").unwrap()
        ));
        assert!(!is_trusted_app_url(
            &Url::parse("http://xtiles.app").unwrap()
        ));
    }

    #[test]
    fn allows_only_about_blank_bootstrap_windows() {
        assert!(is_about_blank_url(&Url::parse("about:blank").unwrap()));
        assert!(!is_about_blank_url(
            &Url::parse("https://example.com").unwrap()
        ));
    }
}
