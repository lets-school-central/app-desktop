use std::path::PathBuf;
use std::sync::Mutex;
use diesel::sqlite::SqliteConnection;
use pocketbase_sdk::client::{Auth, Client};
use serde::Serialize;
use tauri::{AppHandle, State, Manager};

pub struct AppState {
    pub is_ready: Mutex<bool>,
    pub is_initialized: Mutex<bool>,
    pub is_authenticated: Mutex<bool>,
    pub game_path: Mutex<Option<String>>,
    pub db: Mutex<Option<SqliteConnection>>,
    pub pb: Mutex<Option<Client<Auth>>>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EssentialState {
    pub is_ready: bool,
    pub is_initialized: bool,
    pub is_authenticated: bool,
}

pub trait ServiceAccess {
    fn pb<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&mut Client<Auth>) -> TResult;
    fn db<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&mut SqliteConnection) -> TResult;
    fn get_game_path(&self) -> PathBuf;
    fn set_game_path(&self, path: String);
    fn essential_state(&self) -> EssentialState;
}

impl ServiceAccess for AppHandle {
    fn pb<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&mut Client<Auth>) -> TResult {
        let app_state: State<AppState> = self.state();
        let mut pb_client_guard = app_state.pb.lock().unwrap();
        let pb = pb_client_guard.as_mut().unwrap();

        operation(pb)
    }

    fn db<F, TResult>(&self, operation: F) -> TResult where F: FnOnce(&mut SqliteConnection) -> TResult {
        let app_state: State<AppState> = self.state();
        let mut db_connection_guard = app_state.db.lock().unwrap();
        let db = db_connection_guard.as_mut().unwrap();

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

    fn essential_state(&self) -> EssentialState {
        let app_state: State<AppState> = self.state();
        let is_ready = app_state.is_ready.lock().unwrap().clone();
        let is_initialized = app_state.is_initialized.lock().unwrap().clone();
        let is_authenticated = app_state.is_authenticated.lock().unwrap().clone();

        EssentialState {
            is_ready,
            is_initialized,
            is_authenticated,
        }
    }
}