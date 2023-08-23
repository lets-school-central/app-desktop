import { Record } from "pocketbase";

export declare class Mod extends Record {
	id: string;
	title: string;
	description: string;
	screenshots: string[];
}

export declare class ModVersion extends Record {
	id: string;
	mod: Mod;
	version: string;
	changelog: string;
	fileUrl: string;
}
