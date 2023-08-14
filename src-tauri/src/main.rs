#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod handlers;
mod constants;
mod database;
mod state;
mod utils;

use handlers::{
    initialization::{
        is_app_initialized,
    },
    gameinstallation::{
        check_game_installation,
    },
    modloader::{
        download_mod_loader,
        clean_download_mod_loader,
        install_mod_loader,
        check_mod_loader
    }
};

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .manage(state::AppState {
            initialized: false.into(),
            game_path: Default::default(),
            db: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            is_app_initialized,
            check_game_installation,
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
                let db = database::initialize_database(&app_handle).expect("error while initializing database");
                *app_state.db.lock().unwrap() = Some(db);

                std::thread::sleep(std::time::Duration::from_secs(2));

                splashscreen_window.close().unwrap();
                main_window.show().unwrap();

                std::thread::sleep(std::time::Duration::from_secs(2));
                *app_state.initialized.lock().unwrap() = true;
                app_handle.emit_all("app_initialized", ()).unwrap();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
