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
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            let main_window = app.get_window("main").unwrap();

            #[cfg(debug_assertions)]
            {
                main_window.open_devtools();
                main_window.close_devtools();
            }

            let app_handle = app.handle();

            tauri::async_runtime::spawn(async move {
                println!("Initializing...");
                std::thread::sleep(std::time::Duration::from_secs(2));

                let app_state: tauri::State<state::AppState> = app_handle.state();
                let db = database::initialize_database(&app_handle).expect("error while initializing database");
                *app_state.db.lock().unwrap() = Some(db);

                std::thread::sleep(std::time::Duration::from_secs(2));
                println!("Done initializing.");

                splashscreen_window.close().unwrap();
                main_window.show().unwrap();

                app_handle.emit_all("app-initialized", ()).unwrap();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
