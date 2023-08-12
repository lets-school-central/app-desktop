use std::path::Path;
use crate::state::State;

fn validate_game_installation_path(path: &str) -> Result<(), String> {
    let game_path = Path::new(path);
    if game_path.exists() {
        Ok(())
    } else {
        Err("Game path not found".to_string())
    }
}

#[tauri::command]
pub fn check_game_installation(game_path: &str, state: tauri::State<State>) -> Result<bool, String> {
    if (validate_game_installation_path(game_path)).is_ok() {
        let mut p = state.game_path.lock().unwrap();
        *p = game_path.to_string().into();
        Ok(true)
    } else {
        Err("Game path not found".to_string())
    }
}
