use std::fs;
use std::path::PathBuf;

use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use tauri::AppHandle;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn init(app_handle: &AppHandle) -> SqliteConnection {
    let db_path = get_db_path(app_handle);

    if !db_path.exists() {
        create_db_file(db_path.clone());
    }

    let mut connection = establish_db_connection(app_handle);
    connection.run_pending_migrations(MIGRATIONS).unwrap();

    connection
}

pub fn establish_db_connection(app_handle: &AppHandle) -> SqliteConnection {
    let db_path = "sqlite://".to_string() + get_db_path(app_handle).to_str().unwrap();

    SqliteConnection::establish(&db_path)
        .unwrap_or_else(|_| panic!("Error connecting to {}", db_path))
}

fn create_db_file(db_path: PathBuf) {
    let db_dir = db_path.parent().unwrap();

    if !db_dir.exists() {
        fs::create_dir_all(db_dir).unwrap();
    }

    fs::File::create(db_path).unwrap();
}

fn get_db_path(app_handle: &AppHandle) -> PathBuf {
    let app_dir = app_handle.path_resolver().app_data_dir().expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    app_dir.join("data.db")
}
