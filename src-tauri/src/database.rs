use rusqlite::{Connection, Result};
use std::fs;
use std::path::PathBuf;

pub fn initialize_database(app_data_dir: &PathBuf) -> Result<Connection> {
    if !app_data_dir.exists() {
        fs::create_dir_all(app_data_dir).expect("Failed to create app data directory");
    }

    let db_path = app_data_dir.join("db.sqlite");
    let conn = Connection::open(db_path)?;

    conn.execute_batch(
        "
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL
        );
        ",
    )?;

    Ok(conn)
}
