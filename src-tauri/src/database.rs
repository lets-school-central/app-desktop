use rusqlite::Connection;
use tauri::AppHandle;
use std::fs;

pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle.path_resolver().app_data_dir().expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("data.db");

    Ok(Connection::open(sqlite_path)?)
}
