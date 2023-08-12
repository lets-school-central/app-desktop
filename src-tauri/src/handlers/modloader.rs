use std::fs::{File, remove_file};
use std::io::Write;
use std::path::Path;
use regex::Regex;
use crate::state::State;
use crate::utils::read_lines;

const MODLOADER_VERSION: &str = "v0.6.1";
const MODLOADER_ZIP_NAME: &str = "modloader.zip";

#[tauri::command]
pub fn clean_download_mod_loader(state: tauri::State<'_, State>) -> Result<bool, String> {
    let game_path_mutex = match state.game_path.lock() {
        Ok(game_path) => game_path.clone(),
        Err(_) => return Err("Internal error".to_string())
    };
    let game_path = Path::new(game_path_mutex.as_str());
    let modloader_zip_path = game_path.join(MODLOADER_ZIP_NAME);
    if modloader_zip_path.exists() {
        remove_file(modloader_zip_path).expect("Failed to remove file");
    }
    Ok(true)
}

#[tauri::command]
pub async fn download_mod_loader(state: tauri::State<'_, State>) -> Result<bool, String> {
    let url = format!("https://github.com/LavaGang/MelonLoader/releases/download/{MODLOADER_VERSION}/MelonLoader.x64.zip");
    let response = reqwest::get(url).await.unwrap();

    let game_path_mutex = match state.game_path.lock() {
        Ok(game_path) => game_path.clone(),
        Err(_) => return Err("Internal error".to_string())
    };
    let game_path = Path::new(game_path_mutex.as_str());
    let modloader_zip_path = game_path.join(MODLOADER_ZIP_NAME);
    let mut file = match File::create(modloader_zip_path) {
        Err(why) => panic!("couldn't create {}", why),
        Ok(file) => file,
    };

    let content = response.bytes().await.unwrap();
    file.write_all(&content).expect("Failed to write file");

    Ok(true)
}

#[tauri::command]
pub fn install_mod_loader(state: tauri::State<'_, State>) -> Result<bool, String> {
    let game_path_mutex = match state.game_path.lock() {
        Ok(game_path) => game_path.clone(),
        Err(_) => return Err("Internal error".to_string())
    };
    let game_path = Path::new(game_path_mutex.as_str());
    let modloader_zip_path = game_path.join(MODLOADER_ZIP_NAME);
    if !modloader_zip_path.exists() {
        return Ok(false);
    }

    let zip_file = File::open(modloader_zip_path).unwrap();
    let mut archive = zip::ZipArchive::new(zip_file).unwrap();

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).unwrap();
        let outpath = match file.enclosed_name() {
            Some(path) => path.to_owned(),
            None => continue,
        };

        let outpath = game_path.join(outpath);

        if (&*file.name()).ends_with('/') {
            std::fs::create_dir_all(&outpath).unwrap();
        } else {
            if let Some(p) = outpath.parent() {
                if !p.exists() {
                    std::fs::create_dir_all(&p).unwrap();
                }
            }
            let mut outfile = std::fs::File::create(&outpath).unwrap();
            std::io::copy(&mut file, &mut outfile).unwrap();
        }
    }

    Ok(true)
}

#[tauri::command]
pub fn check_mod_loader(state: tauri::State<'_, State>) -> Result<String, String> {
    let game_path_mutex = match state.game_path.lock() {
        Ok(game_path) => game_path.clone(),
        Err(_) => return Err("Internal error".to_string())
    };
    let game_path = Path::new(game_path_mutex.as_str());
    if !game_path.exists() {
        return Ok("not-installed".to_string());
    }

    let file_path = game_path.join("MelonLoader").join("Documentation").join("CHANGELOG.md");
    if !file_path.exists() {
        return Ok("not-installed".to_string());
    }

    if let Ok(lines) = read_lines(file_path.as_path().display().to_string().as_str()) {
        let re = Regex::new(r"\| \[(.*)\]\(.*\) \|").unwrap();
        for line in lines {
            let line = line.unwrap();
            if re.is_match(&line) {
                let caps = re.captures(&line).unwrap();
                let version = caps.get(1).unwrap().as_str();
                if version == MODLOADER_VERSION {
                    return Ok("valid".to_string());
                }
            }
        }
    }

    Ok("outdated".to_string())
}
