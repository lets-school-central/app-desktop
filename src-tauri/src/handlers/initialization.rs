use tauri::{AppHandle, Manager, State};
use crate::state::AppState;

#[tauri::command]
pub fn is_app_initialized(app_handle: AppHandle) -> bool {
    let app_state: State<AppState> = app_handle.state();
    let b = app_state.initialized.lock().unwrap().clone();
    b
}
