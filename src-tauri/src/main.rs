#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod handlers;
mod utils;
mod state;
mod database;
mod constants;

use handlers::{
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
            game_path: Default::default(),
            db: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            check_game_installation,
            download_mod_loader,
            clean_download_mod_loader,
            install_mod_loader,
            check_mod_loader
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }

            let handle = app.handle();

            let app_state: tauri::State<state::AppState> = handle.state();
            let db = database::initialize_database(&handle).expect("error while initializing database");
            *app_state.db.lock().unwrap() = Some(db);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
