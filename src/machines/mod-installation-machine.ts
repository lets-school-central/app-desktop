import { assign, createMachine } from "xstate";

import { sleep } from "$/lib/utils";
import type { Mod, ModVersion } from "$/models/mod";
import { useModsStore } from "$/stores/modsStore";

export const modInstallationMachine = createMachine(
	{
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/consistent-type-imports
		tsTypes: {} as import("./mod-installation-machine.typegen").Typegen0,
		schema: {
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			context: {} as {
				modId: Mod["id"] | undefined;
				modVersionId: ModVersion["id"] | undefined;
				error: string | undefined;
			},
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			services: {} as {
				initialize: { data: "not-installed" | "installed" | "outdated" };
				download: { data: boolean };
				install: { data: boolean };
				clean: { data: boolean };
				uninstall: { data: boolean };
			},
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			events: {} as (
				| { type: "error.platform.(machine).selected.initializing:invocation[0]"; data: string }
				| { type: "error.platform.(machine).selected.downloading:invocation[0]"; data: string }
				| { type: "error.platform.(machine).selected.installing:invocation[0]"; data: string }
				| { type: "error.platform.(machine).selected.uninstalling:invocation[0]"; data: string }
				| { type: "error.platform.(machine).selected.cleaning:invocation[0]"; data: string }
				| { type: "INITIALIZE"; data: { modId: Mod["id"]; modVersionId: ModVersion["id"] } }
			),
		},
		initial: "idle",
		predictableActionArguments: true,
		context: {
			modId: undefined,
			modVersionId: undefined,
			error: undefined,
		},
		states: {
			idle: {},
			selected: {
				initial: "initializing",
				states: {
					initializing: {
						invoke: {
							src: "initialize",
							onDone: [
								{
									cond: "isUpdate",
									target: "uninstalling",
								},
								{
									cond: "isNoop",
									target: "#success",
								},
								{
									target: "downloading",
								},
							],
							onError: {
								target: "#error",
								actions: "assignError",
							},
						},
					},
					uninstalling: {
						invoke: {
							src: "uninstall",
							onDone: [
								{
									cond: "isTrue",
									target: "downloading",
								},
								{
									target: "#error",
								},
							],
							onError: {
								target: "#error",
								actions: "assignError",
							},
						},
					},
					downloading: {
						invoke: {
							src: "download",
							onDone: [
								{
									cond: "isTrue",
									target: "installing",
								},
								{
									target: "#error",
								},
							],
							onError: {
								target: "#error",
								actions: "assignError",
							},
						},
					},
					installing: {
						invoke: {
							src: "install",
							onDone: [
								{
									cond: "isTrue",
									target: "cleaning",
								},
								{
									target: "#error",
								},
							],
							onError: {
								target: "#error",
								actions: "assignError",
							},
						},
					},
					cleaning: {
						invoke: {
							src: "clean",
							onDone: [
								{
									cond: "isTrue",
									target: "#success",
								},
								{
									target: "#error",
								},
							],
							onError: {
								target: "#error",
								actions: "assignError",
							},
						},
					},
				},
			},
			error: {
				id: "error",
				type: "final",
			},
			success: {
				id: "success",
				after: {
					1000: "idle",
				},
			},
		},
		on: {
			INITIALIZE: {
				target: ".selected",
				actions: "assignParams",
			},
		},
	},
	{
		services: {
			async initialize({ modId, modVersionId }) {
				const { getMod, getModVersion, isModInstalled } = useModsStore.getState();

				const [mod, modVersion, installStatus] = await Promise.all([
					getMod(modId!),
					getModVersion(modVersionId!),
					isModInstalled(modId!),
				]);

				if (!mod || !modVersion || installStatus === "do-not-exists") {
					throw new Error("Mod or ModVersion not found");
				}

				return installStatus;
			},
			async download({ modId, modVersionId }) {
				if (!modId || !modVersionId) {
					return false;
				}

				const { downloadMod } = useModsStore.getState();
				return downloadMod(modId, modVersionId);
			},
			async install({ modId, modVersionId }) {
				if (!modId || !modVersionId) {
					return false;
				}

				const { installMod } = useModsStore.getState();
				await sleep(1500);
				return installMod(modId, modVersionId);
			},
			async clean({ modId, modVersionId }) {
				if (!modId || !modVersionId) {
					return false;
				}

				const { cleanModDownload } = useModsStore.getState();
				await sleep(500);
				return cleanModDownload(modId, modVersionId);
			},
			async uninstall({ modId }) {
				if (!modId) {
					return false;
				}

				const { uninstallMod } = useModsStore.getState();
				await sleep(1500);
				return uninstallMod(modId);
			},
		},
		guards: {
			isTrue: (_, { data }) => data,
			isUpdate: (_, { data: installStatus }) => installStatus === "outdated",
			isNoop: (_, { data: installStatus }) => installStatus === "installed",
		},
		actions: {
			assignError: assign((_, { data }) => ({ error: data })),
			assignParams: assign({
				modId: (_, event) => event.data.modId,
				modVersionId: (_, event) => event.data.modVersionId,
			}),
		},
	},
);
