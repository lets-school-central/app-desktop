use serde::Serialize;
use crate::state::EssentialState;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StateChanged {
    pub new_state: EssentialState,
    pub field: String,
}