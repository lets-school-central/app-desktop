import { invoke } from '@tauri-apps/api/tauri'

export const gameInstallationCommands = {
    check: function(gamePath: string): Promise<boolean> {
        return invoke('check_game_installation', { gamePath });
    }
}

export const modLoaderCommands = {
    check: function(): Promise<"installed" | "outdated" | "not-installed"> {
        return invoke('check_mod_loader');
    },
    install: function(): Promise<boolean> {
        return invoke('install_mod_loader');
    },
    download: function(): Promise<boolean> {
        return invoke('download_mod_loader');
    },
    cleanDownload: function(): Promise<boolean> {
        return invoke('clean_download_mod_loader');
    }
}
