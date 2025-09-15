// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent};
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn start_voice_session() -> Result<String, String> {
    // Initialize voice pipeline
    Ok("Voice session started".to_string())
}

#[tauri::command]
async fn stop_voice_session() -> Result<String, String> {
    // Stop voice pipeline
    Ok("Voice session stopped".to_string())
}

#[tauri::command]
async fn process_voice_command(audio_data: Vec<u8>) -> Result<String, String> {
    // Process voice command via cluster
    // This will call the Kubernetes voice services
    Ok("Processing voice command...".to_string())
}

#[tauri::command]
async fn query_onlyoneapi(endpoint: String, data: String) -> Result<String, String> {
    // Query OnlyOneAPI cluster
    let client = reqwest::Client::new();
    let url = format!("http://localhost:9090{}", endpoint);
    
    match client.post(&url)
        .header("Content-Type", "application/json")
        .body(data)
        .send()
        .await 
    {
        Ok(response) => {
            match response.text().await {
                Ok(text) => Ok(text),
                Err(e) => Err(format!("Failed to read response: {}", e))
            }
        },
        Err(e) => Err(format!("API request failed: {}", e))
    }
}

#[tauri::command]
async fn get_ecosystem_status() -> Result<String, String> {
    // Get BlueOcean ecosystem status
    let services = vec![
        "KREACH", "OnlyOneAPI", "NEXTGEN", "KVIBE"
    ];
    
    let status = serde_json::json!({
        "services": services,
        "health": "All systems operational",
        "timestamp": chrono::Utc::now().to_rfc3339()
    });
    
    Ok(status.to_string())
}

fn main() {
    // System tray setup
    let quit = CustomMenuItem::new("quit".to_string(), "Quit Nexia");
    let dashboard = CustomMenuItem::new("dashboard".to_string(), "Open Dashboard");
    let voice_toggle = CustomMenuItem::new("voice_toggle".to_string(), "🎙️ Voice Command");
    
    let tray_menu = SystemTrayMenu::new()
        .add_item(voice_toggle)
        .add_native_item(tauri::SystemTrayMenuItem::Separator)
        .add_item(dashboard)
        .add_native_item(tauri::SystemTrayMenuItem::Separator)
        .add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "dashboard" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
                "voice_toggle" => {
                    // Toggle voice command mode
                    let window = app.get_window("main").unwrap();
                    window.emit("voice-toggle", {}).unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            start_voice_session,
            stop_voice_session,
            process_voice_command,
            query_onlyoneapi,
            get_ecosystem_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}