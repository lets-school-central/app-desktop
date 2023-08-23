import { assign, createMachine } from "xstate";

import { DEFAULT_GAME_INSTALLATION_FOLDER } from "$/lib/constants";
import { sleep } from "$/lib/utils";
import { useModsStore } from "$/stores/modsStore";
import type { ModsStoreActions } from "$/stores/modsStore";

export const modInitializationMachine = createMachine(
	{
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/consistent-type-imports
		tsTypes: {} as import("./mod-initialization-machine.typegen").Typegen0,
		schema: {
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			context: {} as {
				gamePath: string;
				modsLoaderStatus: Awaited<ReturnType<ModsStoreActions["verifyModsLoader"]>> | undefined;
				error: string | undefined;
			},
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			services: {} as {
				verifyGamePath: { data: Awaited<ReturnType<ModsStoreActions["verifyGamePath"]>> };
				verifyModsLoader: { data: Awaited<ReturnType<ModsStoreActions["verifyModsLoader"]>> };
				download: { data: Awaited<ReturnType<ModsStoreActions["downloadModsLoader"]>> };
				install: { data: Awaited<ReturnType<ModsStoreActions["installModsLoader"]>> };
				cleanDownload: { data: Awaited<ReturnType<ModsStoreActions["cleanModsLoaderDownload"]>> };
			},
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			events: {} as (
				| { type: "error.platform.(machine).game-installation-checking.running:invocation[0]"; data: string }
				| { type: "error.platform.(machine).mods-loader-checking.running:invocation[0]"; data: string }
				| { type: "error.platform.(machine).mods-loader-downloading.running:invocation[0]"; data: string }
				| { type: "error.platform.(machine).mods-loader-installing.running:invocation[0]"; data: string }
				| { type: "error.platform.(machine).mods-loader-cleaning-download.running:invocation[0]"; data: string }
				| { type: "INSTALL_MODS_LOADER" }
				| { type: "SET_GAME_PATH"; data: { gamePath: string } }
				| { type: "RETRY" }),
		},
		initial: "game-installation-checking",
		predictableActionArguments: true,
		context: {
			gamePath: DEFAULT_GAME_INSTALLATION_FOLDER,
			modsLoaderStatus: undefined as "not-installed" | "installed" | "outdated" | undefined,
			error: undefined as string | undefined,
		},
		states: {
			"game-installation-checking": {
				id: "game-installation-checking",
				initial: "running",
				states: {
					running: {
						invoke: {
							src: "verifyGamePath",
							onError: [{
								actions: "assignError",
								target: "error",
							}],
							onDone: [{
								cond: "isTrue",
								target: "success",
							}],
						},
					},
					selectGamePath: {
						on: {
							RETRY: [{
								actions: "resetError",
								target: "running",
							}],
							SET_GAME_PATH: [{
								actions: "assignGamePath",
							}],
						},
					},
					error: {
						after: {
							2000: {
								target: "selectGamePath",
							},
						},
					},
					success: {
						after: {
							2000: {
								target: "#mods-loader-checking",
							},
						},
					},
				},
			},
			"mods-loader-checking": {
				id: "mods-loader-checking",
				initial: "running",
				states: {
					running: {
						invoke: {
							src: "verifyModsLoader",
							onError: [{
								actions: "assignError",
								target: "error",
							}],
							onDone: [{
								cond: "isInstalled",
								target: "installed",
								actions: "assignModsLoaderStatus",
							}, {
								cond: "isOutdated",
								target: "outdated",
								actions: "assignModsLoaderStatus",
							}, {
								cond: "isNotInstalled",
								target: "not-installed",
								actions: "assignModsLoaderStatus",
							}],
						},
					},
					error: {},
					outdated: {
						after: {
							2000: {
								target: "#mods-loader-downloading",
							},
						},
					},
					"not-installed": {
						after: {
							2000: {
								target: "#mods-loader-downloading",
							},
						},
					},
					installed: {
						after: {
							2000: {
								target: "#success",
							},
						},
					},
				},
			},
			"mods-loader-downloading": {
				id: "mods-loader-downloading",
				initial: "waiting",
				states: {
					waiting: {
						on: {
							INSTALL_MODS_LOADER: {
								target: "running",
							},
						},
					},
					running: {
						invoke: {
							src: "download",
							onError: [{
								actions: "assignError",
								target: "error",
							}],
							onDone: [{
								cond: "isTrue",
								target: "success",
							}],
						},
					},
					error: {},
					success: {
						after: {
							2000: {
								target: "#mods-loader-installing",
							},
						},
					},
				},
			},
			"mods-loader-installing": {
				id: "mods-loader-installing",
				initial: "running",
				states: {
					running: {
						invoke: {
							src: "install",
							onError: [{
								actions: "assignError",
								target: "error",
							}],
							onDone: [{
								cond: "isTrue",
								target: "success",
							}],
						},
					},
					error: {},
					success: {
						after: {
							2000: {
								target: "#mods-loader-cleaning-download",
							},
						},
					},
				},
			},
			"mods-loader-cleaning-download": {
				id: "mods-loader-cleaning-download",
				initial: "running",
				states: {
					running: {
						invoke: {
							src: "cleanDownload",
							onError: [{
								actions: "assignError",
								target: "error",
							}],
							onDone: [{
								cond: "isTrue",
								target: "success",
							}],
						},
					},
					error: {},
					success: {
						after: {
							2000: {
								target: "#mods-loader-checking",
							},
						},
					},
				},
			},
			success: {
				id: "success",
				type: "final",
			},
		},
	},
	{
		services: {
			async verifyGamePath({ gamePath }) {
				const { verifyGamePath } = useModsStore.getState();
				await sleep(1500);
				return verifyGamePath(gamePath);
			},
			async verifyModsLoader() {
				const { verifyModsLoader } = useModsStore.getState();
				await sleep(1500);
				return verifyModsLoader();
			},
			async download() {
				const { downloadModsLoader: download } = useModsStore.getState();
				return download();
			},
			async install() {
				const { installModsLoader: install } = useModsStore.getState();
				await sleep(2000);
				return install();
			},
			async cleanDownload() {
				const { cleanModsLoaderDownload: cleanDownload } = useModsStore.getState();
				await sleep(500);
				return cleanDownload();
			},
		},
		guards: {
			isTrue: (_, { data }) => data,
			isInstalled: (_, { data }) => data === "installed",
			isOutdated: (_, { data }) => data === "outdated",
			isNotInstalled: (_, { data }) => data === "not-installed",
		},
		actions: {
			resetError: assign(() => ({ error: undefined })),
			assignError: assign((_, { data }) => ({ error: data })),
			assignGamePath: assign((_, { data: { gamePath } }) => ({ gamePath })),
			assignModsLoaderStatus: assign((_, { data: modsLoaderStatus }) => ({ modsLoaderStatus })),
		},
	},
);
