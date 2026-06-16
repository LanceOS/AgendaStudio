mod database;

use std::sync::Mutex;
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use tauri::{State, Manager};

struct AppState {
    db: Mutex<Connection>,
}

#[derive(Serialize, Deserialize)]
struct Event {
    id: i64,
    title: String,
    start: String,
    end: String,
}

#[tauri::command]
fn create_event(title: String, start: String, end: String, state: State<'_, AppState>) -> Result<Event, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    
    conn.execute(
        "INSERT INTO events (title, start_date, end_date) VALUES (?1, ?2, ?3)",
        (&title, &start, &end),
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    Ok(Event {
        id,
        title,
        start,
        end,
    })
}

#[tauri::command]
fn get_events_by_range(start: String, end: String, state: State<'_, AppState>) -> Result<Vec<Event>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare("SELECT id, title, start_date, end_date FROM events WHERE (start_date <= ?2 AND end_date >= ?1)").map_err(|e| e.to_string())?;
    
    let event_iter = stmt.query_map([&start, &end], |row| {
        Ok(Event {
            id: row.get(0)?,
            title: row.get(1)?,
            start: row.get(2)?,
            end: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut events = Vec::new();
    for event in event_iter {
        events.push(event.map_err(|e| e.to_string())?);
    }

    Ok(events)
}

#[tauri::command]
fn delete_event(id: i64, state: State<'_, AppState>) -> Result<bool, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    
    let rows_affected = conn.execute("DELETE FROM events WHERE id = ?1", [id]).map_err(|e| e.to_string())?;
    
    Ok(rows_affected > 0)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir().expect("failed to get app data dir");
            let conn = database::initialize_database(&app_data_dir).expect("failed to initialize database");
            
            app.manage(AppState {
                db: Mutex::new(conn),
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![create_event, get_events_by_range, delete_event])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
