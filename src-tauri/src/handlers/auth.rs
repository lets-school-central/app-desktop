use pocketbase_sdk::client::Client;
use tauri::{AppHandle, Manager, State};
use crate::events::StateChanged;
use crate::state::{AppState, ServiceAccess};

#[tauri::command]
pub fn authenticate(app_handle: AppHandle, username: &str, password: &str) -> Result<bool, ()> {
    let app_state: State<AppState> = app_handle.state();

    let client = Client::new("https://backend.lets-school-central.app");
    let r = client.auth_with_password("users", username, password);

    match r {
        Ok(pb) => {
            *app_state.pb.lock().unwrap() = Some(pb);
            *app_state.is_authenticated.lock().unwrap() = true;

            app_handle.emit_all("state_changed", StateChanged { new_state: app_handle.essential_state(), field: "isAuthenticated".to_string() }).unwrap();

            Ok(true)
        }
        Err(_) => Ok(false)
    }
}