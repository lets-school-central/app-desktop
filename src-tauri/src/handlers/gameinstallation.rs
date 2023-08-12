use std::path::Path;
use tauri::AppHandle;
use crate::state::ServiceAccess;

fn validate_game_installation_path(path: &str) -> Result<(), String> {
    let game_path = Path::new(path);
    if game_path.exists() {
        Ok(())
    } else {
        Err("Game path not found".to_string())
    }
}

#[tauri::command]
pub fn check_game_installation(app_handle: AppHandle, game_path: &str) -> Result<bool, String> {
    if (validate_game_installation_path(game_path)).is_ok() {
        app_handle.set_game_path(game_path.to_string());
        Ok(true)
    } else {
        Err("Game path not found".to_string())
    }
}
