#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;

#[tauri::command]
async fn unzip(input: &str, output: &str) -> Result<(), String> {
    let input_path = std::path::Path::new(input);
    let output_path = std::path::Path::new(output);

    let file = std::fs::File::open(input_path).map_err(|e| e.to_string())?;
    let mut archive = zip::ZipArchive::new(file).map_err(|e| e.to_string())?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        let file_output_path = match file.enclosed_name() {
            Some(path) => path.to_owned(),
            None => continue,
        };

        let file_output_path = output_path.join(file_output_path);

        if (&*file.name()).ends_with('/') {
            std::fs::create_dir_all(&file_output_path).map_err(|e| e.to_string())?;
        } else {
            if let Some(p) = file_output_path.parent() {
                if !p.exists() {
                    std::fs::create_dir_all(&p).map_err(|e| e.to_string())?;
                }
            }
            let mut file_output_path =
                std::fs::File::create(&file_output_path).map_err(|e| e.to_string())?;
            std::io::copy(&mut file, &mut file_output_path).map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
        }))
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();

            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                main_window.open_devtools();
                main_window.close_devtools();
            }

            let _ = main_window.with_webview(|webview| {
                #[cfg(windows)]
                unsafe {
                    webview.controller().SetZoomFactor(1.).unwrap();
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![unzip])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
