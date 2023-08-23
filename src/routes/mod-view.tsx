import { useEffect, useMemo, useState } from "react";

import { useMachine } from "@xstate/react";
import { use } from "i18next";
import { useParams } from "react-router-dom";

import Header from "$/components/Header";
import LoadingScreen from "$/components/LoadingScreen";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "$/components/ui/accordion";
import { Button } from "$/components/ui/button";
import { Card, CardContent, CardHeader } from "$/components/ui/card";
import pb from "$/lib/pocketbase";
import { modInstallationMachine } from "$/machines/mod-installation-machine";
import { type Mod, MOD_VERSIONS_COLLECTION_NAME, MODS_COLLECTION_NAME, type ModVersion } from "$/models/mod";
import type { User } from "$/models/user";
import type { ModsStoreActions } from "$/stores/modsStore";
import { useModsStore } from "$/stores/modsStore";

export function ModView() {
	const { isModInstalled, uninstallMod, installedMods } = useModsStore();
	const { id } = useParams();
	const [mod, setMod] = useState<Mod & { expand: { author: User } }>();
	const [versions, setVersions] = useState<ModVersion[]>();
	const [isLoading, setIsLoading] = useState(true);
	const [installationStatus, setInstallationStatus] = useState<Awaited<ReturnType<ModsStoreActions["isModInstalled"]>>>();
	const [isInstalling, setIsInstalling] = useState(false);
	const [current, send] = useMachine(modInstallationMachine);
	const text = useMemo(() => {
		if (typeof current.value === "object") {
			const { selected } = current.value;
			switch (selected) {
				case "uninstalling":
					return "Uninstalling...";
				case "downloading":
					return "Downloading...";
				case "installing":
					return "Installing...";
				case "cleaning":
					return "Cleaning...";
				default:
					return JSON.stringify(current.value);
			}
		}

		switch (current.value) {
			case "success":
				return "Success";
			case "error":
				return "Error: " + current.context.error;
			default:
				return JSON.stringify(current.value);
		}
	}, [current]);

	useEffect(() => {
		if (!id) {
			return;
		}

		setVersions(undefined);

		(async () => {
			const mod = await pb.collection(MODS_COLLECTION_NAME).getOne<Mod & { expand: { author: User } }>(id, {
				expand: "author",
				$cancelKey: "mod-view",
			});

			setMod(mod);
			setIsLoading(false);
		})();
	}, [id]);

	useEffect(() => {
		if (!mod) {
			return;
		}

		(async () => {
			const versions = await pb.collection(MOD_VERSIONS_COLLECTION_NAME).getList<ModVersion>(1, 20, {
				mod: mod.id,
				sort: "-version",
				$cancelKey: "mod-view",
			});
			setVersions(versions.items);
		})();
	}, [mod]);

	useEffect(() => {
		if (!isInstalling || !mod || !versions?.[0]) {
			return;
		}

		send({ type: "INITIALIZE", data: { modId: mod.id, modVersionId: versions[0].id } });
	}, [isInstalling]);

	useEffect(() => {
		if (current.matches("success")) {
			setIsInstalling(false);
		}
	}, [current]);

	useEffect(() => {
		if (!mod) {
			return;
		}

		(async () => {
			setInstallationStatus(await isModInstalled(mod.id));
		})();
	}, [mod, installedMods]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!id || !mod) {
		return <div>404</div>;
	}

	if (isInstalling) {
		return (
			<div className="absolute w-full h-full flex flex-col justify-center text-center">
				<LoadingScreen text={text} progress={undefined} />
			</div>
		);
	}

	return <div className="flex flex-col items-center gap-8">
		<Header title={mod.title} back="/mods" />
		<div className="grid grid-cols-5 w-full px-10 gap-x-6">
			<div className="col-span-3 flex flex-col gap-2">
				<div className="border-b pb-1">Description</div>
				<div className="text-sm">{mod.description}</div>
			</div>
			<div className="col-span-2 flex flex-col gap-4">
				<Card>
					<CardHeader>
						<h3 className="text-xl">Details</h3>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						<p>Author: <b>@{mod.expand.author.username}</b></p>
						<div>
							<p>Versions:</p>
							{!versions && (<p>Loading</p>)}
							{(versions && versions.length === 0) && (<p>No versions</p>)}
							{(versions && versions.length > 0)
								&& (
									<Accordion type="single" collapsible defaultValue={versions[0].id}>
										{versions.map(version => (
											<AccordionItem value={version.id} key={version.id}>
												<AccordionTrigger>{version.version}</AccordionTrigger>
												<AccordionContent>
													{version.changelog}
												</AccordionContent>
											</AccordionItem>
										))}
									</Accordion>
								)}
						</div>
					</CardContent>
				</Card>
				{installationStatus === "installed" && (
					<Button
						onClick={() => {
							if (mod) {
								uninstallMod(mod.id);
							}
						}}
					>
						Uninstall
					</Button>
				)}
				{installationStatus === "not-installed" && (
					<Button
						onClick={() => {
							setIsInstalling(true);
						}}
					>
					Install
					</Button>
				)}
				{installationStatus === "outdated" && (
					<Button
						onClick={() => {
							setIsInstalling(true);
						}}
					>
						Update
					</Button>
				)}
			</div>
		</div>
	</div>;
}
