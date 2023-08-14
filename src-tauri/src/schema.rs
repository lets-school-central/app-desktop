// @generated automatically by Diesel CLI.

diesel::table! {
    initialization_configs (userid) {
        userid -> Text,
        config -> Text,
    }
}
