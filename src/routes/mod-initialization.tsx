import { useNavigate } from "react-router-dom";

import MachineDisplay from "$/components/MachineDisplay";
import { Button } from "$/components/ui/button";
import { modInitializationMachine } from "$/machines/mod-initialization-machine";

export default function ModInitialization() {
	const navigate = useNavigate();
	return (
		<div className="absolute w-full h-full flex flex-col justify-center text-center">
			<MachineDisplay
				name="mod-initialization"
				machine={modInitializationMachine}
				onSuccess={() => {
					navigate("/");
				}}
				config={{
					"game-installation-checking.running": {
						type: "loading",
						variant: "primary",
					},
					"game-installation-checking.error": {
						type: "loading",
						variant: "error",
						progress: "full",
					},
					"game-installation-checking.success": {
						type: "loading",
						variant: "success",
						progress: "full",
					},
					"game-installation-checking.selectGamePath": {
						type: "custom",
						element() {
							return <>
								hello world
							</>;
						},
					},
					"mods-loader-checking.running": {
						type: "loading",
						variant: "primary",
					},
					"mods-loader-checking.outdated": {
						type: "loading",
						variant: "warning",
						progress: "full",
					},
					"mods-loader-checking.not-installed": {
						type: "loading",
						variant: "error",
						progress: "full",
					},
					"mods-loader-checking.installed": {
						type: "loading",
						variant: "success",
						progress: "full",
					},
					"mods-loader-downloading.waiting": {
						type: "custom",
						element(_, context, send) {
							if (context?.modsLoaderStatus === "not-installed") {
								return <div className="flex flex-col gap-6">
									<h2>Mods Loader is not installed, install ?</h2>
									<Button onClick={() => {
										send("INSTALL_MODS_LOADER");
									}}>Install</Button>
								</div>;
							}

							return <div className="flex flex-col gap-6">
								<h2>Mods Loader is outdated, update ?</h2>
								<Button onClick={() => {
									send("INSTALL_MODS_LOADER");
								}}>Update</Button>
							</div>;
						},
					},
					"mods-loader-downloading.running": {
						type: "loading",
						variant: "primary",
					},
					"mods-loader-downloading.error": {
						type: "loading",
						variant: "error",
						progress: "full",
					},
					"mods-loader-downloading.success": {
						type: "loading",
						variant: "success",
						progress: "full",
					},
					"mods-loader-installing.running": {
						type: "loading",
						variant: "primary",
					},
					"mods-loader-installing.error": {
						type: "loading",
						variant: "error",
						progress: "full",
					},
					"mods-loader-installing.success": {
						type: "loading",
						variant: "success",
						progress: "full",
					},
					"mods-loader-cleaning-download.running": {
						type: "loading",
						variant: "primary",
					},
					"mods-loader-cleaning-download.error": {
						type: "loading",
						variant: "error",
						progress: "full",
					},
					"mods-loader-cleaning-download.success": {
						type: "loading",
						variant: "success",
						progress: "full",
					},
					success: {
						type: "loading",
						variant: "success",
						progress: "full",
					},
				}}
			/>
		</div>
	);
}
