import { exists, readDir, readTextFile, removeFile, writeBinaryFile } from "@tauri-apps/api/fs";
import { fetch, ResponseType } from "@tauri-apps/api/http";
import { invoke } from "@tauri-apps/api/tauri";
import { Store } from "tauri-plugin-store-api";
import { create } from "zustand";

import { MODS_LOADER_VERSION } from "$/lib/constants";

export type ModsStoreState = {
	gamePath: string | undefined;
	isGameInstalled: boolean;
	isInstalled: boolean;
};

export type ModsStoreActions = {
	verifyGamePath: (gamePath: string) => Promise<boolean>;
	verifyModsLoader: () => Promise<"installed" | "outdated" | "not-installed">;
	download: () => Promise<boolean>;
	install: () => Promise<boolean>;
	cleanDownload: () => Promise<boolean>;
};

const store = new Store(".modsStore.dat");

export const useModsStore = create<ModsStoreState & ModsStoreActions>()((set, get) => ({
	gamePath: undefined,
	isGameInstalled: false,
	isInstalled: false,
	async verifyGamePath(gamePath: string) {
		const { isGameInstalled } = get();
		if (isGameInstalled) {
			return true;
		}

		const entries = await readDir(gamePath, { recursive: false });
		const binaryExists = entries.find(e => e.name === "LetsSchool.exe");
		const dataFolderExists = entries.find(e => e.name === "LetsSchool_Data");

		if (!binaryExists || !dataFolderExists) {
			return false;
		}

		set({ gamePath, isGameInstalled: true });
		await store.set("gamePath", gamePath);
		await store.save();

		return true;
	},
	async verifyModsLoader() {
		const { isGameInstalled, gamePath } = get();
		if (!isGameInstalled) {
			return "not-installed";
		}

		const modsLoaderPath = `${gamePath}/MelonLoader/`;

		const modsLoaderDirectoryExists = await exists(modsLoaderPath);
		if (!modsLoaderDirectoryExists) {
			return "not-installed";
		}

		try {
			const modsLoaderChangelogFileContent = await readTextFile(`${modsLoaderPath}/Documentation/CHANGELOG.md`);
			const modsLoaderVersion = modsLoaderChangelogFileContent.split("\n")[2];

			const modsLoaderVersionMatch = (/\| \[(.*)\]\(.*\) \|/).exec(modsLoaderVersion);
			if (!modsLoaderVersionMatch) {
				return "not-installed";
			}

			const modsLoaderVersionNumber = modsLoaderVersionMatch[1];
			if (modsLoaderVersionNumber !== MODS_LOADER_VERSION) {
				return "outdated";
			}

			set({ isInstalled: true });
			await store.set("isInstalled", true);
			await store.save();
		} catch (_) {
			return "not-installed";
		}

		return "installed";
	},
	async download() {
		const { gamePath } = get();
		const url = `https://github.com/LavaGang/MelonLoader/releases/download/${MODS_LOADER_VERSION}/MelonLoader.x64.zip`;
		const response = await fetch<ArrayBuffer>(url, {
			method: "GET",
			responseType: ResponseType.Binary,
		});
		await writeBinaryFile(`${gamePath}/.mods_loader.download.zip`, new Uint8Array(response.data));
		return true;
	},
	async install() {
		const { gamePath } = get();
		await invoke("unzip", { input: `${gamePath}/.mods_loader.download.zip`, output: gamePath });
		return true;
	},
	async cleanDownload() {
		const { gamePath } = get();
		await removeFile(`${gamePath}/.mods_loader.download.zip`);
		return true;
	},
}));

(async () => {
	const [gamePath, isGameInstalled, isInstalled] = await Promise.all([
		store.get<string>("gamePath").then(v => v ?? undefined),
		store.get<boolean>("isGameInstalled").then(v => v ?? false),
		store.get<boolean>("isInstalled").then(v => v ?? false),
	]);

	useModsStore.setState({ gamePath, isGameInstalled, isInstalled });
})();
