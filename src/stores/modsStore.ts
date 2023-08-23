import { exists, readDir, readTextFile, removeFile, writeBinaryFile } from "@tauri-apps/api/fs";
import { fetch, ResponseType } from "@tauri-apps/api/http";
import { invoke } from "@tauri-apps/api/tauri";
import { cpSync } from "fs";
import { Store } from "tauri-plugin-store-api";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { MODS_LOADER_VERSION } from "$/lib/constants";
import pb from "$/lib/pocketbase";
import { MOD_VERSIONS_COLLECTION_NAME, MODS_COLLECTION_NAME } from "$/models/mod";
import type { Mod, ModVersion } from "$/models/mod";

type InstalledMod = Pick<Mod, "title" | "description"> & { version: ModVersion["version"]; versionId: ModVersion["id"] };
type InstalledMods = Record<Mod["id"], InstalledMod>;

export type ModsStoreState = {
	gamePath: string | undefined;
	isGameInstalled: boolean;
	isInstalled: boolean;
	installedMods: InstalledMods;
};

export type ModsStoreActions = {
	verifyGamePath: (gamePath: string) => Promise<boolean>;
	verifyModsLoader: () => Promise<"installed" | "outdated" | "not-installed">;
	downloadModsLoader: () => Promise<boolean>;
	installModsLoader: () => Promise<boolean>;
	cleanModsLoaderDownload: () => Promise<boolean>;
	getMod(modId: Mod["id"]): Promise<Mod | undefined>;
	getModVersion(modVersionId: ModVersion["id"]): Promise<ModVersion | undefined>;
	isModInstalled(modId: Mod["id"], modVersionId?: ModVersion["id"]): Promise<"installed" | "outdated" | "do-not-exists" | "not-installed">;
	downloadMod(modId: Mod["id"], modVersionId: ModVersion["id"]): Promise<boolean>;
	installMod(modId: Mod["id"], modVersionId: ModVersion["id"]): Promise<boolean>;
	cleanModDownload(modId: Mod["id"], modVersionId: ModVersion["id"]): Promise<boolean>;
	uninstallMod(modId: Mod["id"]): Promise<boolean>;
};

const store = new Store(".modsStore.dat");

export const useModsStore = create<ModsStoreState & ModsStoreActions>()(immer<ModsStoreState & ModsStoreActions>((set, get) => ({
	gamePath: undefined,
	isGameInstalled: false,
	isInstalled: false,
	installedMods: {},
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
	async downloadModsLoader() {
		const { gamePath } = get();
		const url = `https://github.com/LavaGang/MelonLoader/releases/download/${MODS_LOADER_VERSION}/MelonLoader.x64.zip`;
		const response = await fetch<ArrayBuffer>(url, {
			method: "GET",
			responseType: ResponseType.Binary,
		});
		await writeBinaryFile(`${gamePath}/.mods_loader.download.zip`, new Uint8Array(response.data));
		return true;
	},
	async installModsLoader() {
		const { gamePath } = get();
		await invoke("unzip", { input: `${gamePath}/.mods_loader.download.zip`, output: gamePath });
		return true;
	},
	async cleanModsLoaderDownload() {
		const { gamePath } = get();
		await removeFile(`${gamePath}/.mods_loader.download.zip`);
		return true;
	},
	async getMod(modId) {
		return (await pb.collection(MODS_COLLECTION_NAME).getOne<Mod>(modId, { $autoCancel: false })) ?? undefined;
	},
	async getModVersion(modVersionId) {
		return (await pb.collection(MOD_VERSIONS_COLLECTION_NAME).getOne<ModVersion>(modVersionId, { $autoCancel: false })) ?? undefined;
	},
	async isModInstalled(modId) {
		const { installedMods } = get();
		const installedMod = installedMods[modId];

		if (!installedMod) {
			// TODO: check on mods folder for manually installed or lost-of-track mods
			return "not-installed";
		}

		const latestModVersion = (await pb.collection(MOD_VERSIONS_COLLECTION_NAME).getList<ModVersion>(1, 1, {
			mod: modId,
			sort: "-version",
		})).items?.[0] ?? undefined;

		if (!latestModVersion) {
			return "do-not-exists";
		}

		if (latestModVersion.id !== installedMod.versionId) {
			return "outdated";
		}

		if (latestModVersion.id === installedMod.versionId) {
			return "installed";
		}

		return "not-installed";
	},
	async downloadMod(modId, modVersionId) {
		const { gamePath, getMod, getModVersion } = get();

		const [mod, modVersion] = await Promise.all([
			getMod(modId),
			getModVersion(modVersionId),
		]);

		if (!mod || !modVersion) {
			return false;
		}

		const fileUrl = pb.files.getUrl(modVersion, modVersion.file);
		const response = await fetch<ArrayBuffer>(fileUrl, {
			method: "GET",
			responseType: ResponseType.Binary,
		});
		await writeBinaryFile(`${gamePath}/Mods/.${modId}_${modVersionId}.download.zip`, new Uint8Array(response.data));
		return true;
	},
	async installMod(modId, modVersionId) {
		const { gamePath, getMod, getModVersion } = get();

		const [mod, modVersion] = await Promise.all([
			getMod(modId),
			getModVersion(modVersionId),
		]);

		if (!mod || !modVersion) {
			return false;
		}

		await invoke("unzip", { input: `${gamePath}/Mods/.${modId}_${modVersionId}.download.zip`, output: `${gamePath}/Mods` });

		set(state => {
			state.installedMods[modId] = {
				title: mod.title,
				description: mod.description,
				version: modVersion.version,
				versionId: modVersion.id,
			};
		});
		await store.set("installedMods", get().installedMods);
		await store.save();

		return true;
	},
	async cleanModDownload(modId, modVersionId) {
		const { gamePath } = get();
		await removeFile(`${gamePath}/Mods/.${modId}_${modVersionId}.download.zip`);
		return true;
	},
	async uninstallMod(modId) {
		const { gamePath, installedMods } = get();
		const installedMod = installedMods[modId];

		if (!installedMod) {
			return false;
		}

		await removeFile(`${gamePath}/Mods/${modId}_${installedMod.versionId}.dll`);

		set(state => {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete state.installedMods[modId];
		});
		await store.set("installedMods", get().installedMods);
		await store.save();

		return true;
	},
})));

(async () => {
	const [gamePath, isGameInstalled, isInstalled, installedMods] = await Promise.all([
		store.get<string>("gamePath").then(v => v ?? undefined),
		store.get<boolean>("isGameInstalled").then(v => v ?? false),
		store.get<boolean>("isInstalled").then(v => v ?? false),
		store.get<InstalledMods>("installedMods").then(v => v ?? {}),
	]);

	useModsStore.setState({ gamePath, isGameInstalled, isInstalled, installedMods });
})();
