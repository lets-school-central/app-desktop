use std::path::PathBuf;
use rusqlite::Connection;
use std::sync::Mutex;
use tauri::{AppHandle, State, Manager};

pub struct AppState {
    pub game_path: Mutex<Option<String>>,
    pub db: Mutex<Option<Connection>>,
}

pub trait ServiceAccess {
    fn db<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&Connection) -> TResult;
    fn get_game_path(&self) -> PathBuf;
    fn set_game_path(&self, path: String);
}

impl ServiceAccess for AppHandle {
    fn db<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&Connection) -> TResult {
        let app_state: State<AppState> = self.state();
        let db_connection_guard = app_state.db.lock().unwrap();
        let db = db_connection_guard.as_ref().unwrap();

        operation(db)
    }

    fn get_game_path(&self) -> PathBuf {
        let app_state: State<AppState> = self.state();
        let game_path_guard = app_state.game_path.lock().unwrap();
        let game_path = game_path_guard.as_ref().unwrap();

        PathBuf::from(game_path.as_str())
    }

    fn set_game_path(&self, path: String) {
        let app_state: State<AppState> = self.state();
        *app_state.game_path.lock().unwrap() = Some(path);
    }
}