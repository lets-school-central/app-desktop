import { useEffect, useState } from "react";

import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

import Header from "$/components/Header";
import { Badge } from "$/components/ui/badge";
import { Button } from "$/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "$/components/ui/card";
import pb from "$/lib/pocketbase";
import type { Mod } from "$/models/mod";
import { useModsStore } from "$/stores/modsStore";

export function Mods() {
	const navigate = useNavigate();
	const [mods, setMods] = useState<Mod[]>([]);
	const installedMods = useModsStore(state => state.installedMods);

	useEffect(() => {
		(async () => {
			const mods = await pb.collection("mods").getList<Mod>(1, 20, { sort: "-updated" });
			setMods(mods.items);
		})();
	}, []);

	return <div className="flex flex-col items-center gap-8">
		<Header title="Mods" back="/" />
		<div className="grid grid-cols-2 px-10">
			{mods.map(mod => (
				<Card key={mod.id} className="hover:bg-primary/10 cursor-pointer" onClick={() => {
					navigate(`/mods/${mod.id}`);
				}}>
					<CardHeader>
						<CardTitle className="flex items-center justify-between"><div>{mod.title} <span className="text-sm">{mod.lastVersion}</span></div> {Boolean(installedMods[mod.id]) && <Badge className="flex gap-1"><CheckCircledIcon /> installed</Badge> }</CardTitle>
						<CardDescription>{mod.description}</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button>
							View
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	</div>;
}
