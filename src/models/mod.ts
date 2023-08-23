import { Record } from "pocketbase";

import type { User } from "./user";

export declare class Mod extends Record {
	id: string;
	title: string;
	description: string;
	screenshots: string[];
	author: User["id"];
}

export declare class ModVersion extends Record {
	id: string;
	mod: Mod["id"];
	version: string;
	changelog: string;
	fileUrl: string;
}
