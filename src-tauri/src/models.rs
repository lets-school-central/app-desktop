use diesel::prelude::*;

#[derive(Queryable, Selectable, Debug)]
#[diesel(table_name = crate::schema::initialization_configs)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct InitializationConfigs {
    pub userid: String,
    pub config: String,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::initialization_configs)]
pub struct NewInitializationConfigs<'a> {
    pub userid: &'a str,
    pub config: &'a str,
}