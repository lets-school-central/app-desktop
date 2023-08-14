#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod handlers;
mod constants;
mod database;
mod events;
mod models;
mod schema;
mod state;
mod utils;

use std::env;
use tauri::Manager;
use crate::events::StateChanged;
use crate::handlers::{
    auth::{
        authenticate,
    },
    gameinstallation::{
        check_game_installation,
    },
    state::{
        get_state,
        set_initialized,
    },
    modloader::{
        download_mod_loader,
        clean_download_mod_loader,
        install_mod_loader,
        check_mod_loader
    }
};
use crate::state::ServiceAccess;

fn main() {
    tauri::Builder::default()
        .manage(state::AppState {
            is_ready: false.into(),
            is_initialized: false.into(),
            is_authenticated: false.into(),
            game_path: Default::default(),
            db: Default::default(),
            pb: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            authenticate,
            check_game_installation,
            get_state,
            set_initialized,
            download_mod_loader,
            clean_download_mod_loader,
            install_mod_loader,
            check_mod_loader
        ])
        .setup(|app| {
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            let main_window = app.get_window("main").unwrap();

            #[cfg(debug_assertions)]
            {
                main_window.open_devtools();
                main_window.close_devtools();
            }

            let app_handle = app.handle();

            tauri::async_runtime::spawn(async move {
                std::thread::sleep(std::time::Duration::from_secs(2));

                let app_state: tauri::State<state::AppState> = app_handle.state();

                let db = database::init(&app_handle);
                *app_state.db.lock().unwrap() = Some(db);

                std::thread::sleep(std::time::Duration::from_secs(2));

                splashscreen_window.close().unwrap();
                main_window.show().unwrap();

                std::thread::sleep(std::time::Duration::from_secs(2));
                *app_state.is_ready.lock().unwrap() = true;
                app_handle.emit_all("state_changed", StateChanged { new_state: app_handle.essential_state(), field: "isReady".to_string() }).unwrap();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
