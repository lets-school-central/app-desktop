use std::sync::Mutex;

pub struct State {
    pub game_path: Mutex<String>
}
