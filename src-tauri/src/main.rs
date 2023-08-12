#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod handlers;
mod utils;
mod state;

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
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .manage(state::State {
            game_path: "".to_string().into(),
        })
        .invoke_handler(tauri::generate_handler![
            check_game_installation,
            download_mod_loader,
            clean_download_mod_loader,
            install_mod_loader,
            check_mod_loader
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
