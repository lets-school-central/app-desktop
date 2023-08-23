import { Record } from "pocketbase";

import type { User } from "./user";

export declare class Mod extends Record {
	id: string;
	title: string;
	description: string;
	screenshots: string[];
	author: User["id"];
	lastVersion: ModVersion["version"];
}

export const MODS_COLLECTION_NAME = "mods";

export declare class ModVersion extends Record {
	id: string;
	mod: Mod["id"];
	version: string;
	changelog: string;
	file: string;
}

export const MOD_VERSIONS_COLLECTION_NAME = "mod_versions";
