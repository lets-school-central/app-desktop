use tauri::{AppHandle, Manager, State};
use crate::events::StateChanged;
use crate::state::{AppState, EssentialState, ServiceAccess};

#[tauri::command]
pub fn get_state(app_handle: AppHandle) -> EssentialState {
    app_handle.essential_state()
}

#[tauri::command]
pub fn set_initialized(app_handle: AppHandle, is_initialized: bool) {
    let state: State<AppState> = app_handle.state();
    *state.is_initialized.lock().unwrap() = is_initialized;
    app_handle.emit_all("state_changed", StateChanged { new_state: app_handle.essential_state(), field: "isInitialized".to_string() }).unwrap();
}