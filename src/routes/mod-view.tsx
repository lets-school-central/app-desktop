import { useEffect, useState } from "react";

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Link, useParams } from "react-router-dom";

import Header from "$/components/Header";
import { Badge } from "$/components/ui/badge";
import { Button } from "$/components/ui/button";
import { Card, CardContent, CardHeader } from "$/components/ui/card";
import pb from "$/lib/pocketbase";
import type { Mod, ModVersion } from "$/models/mod";
import type { User } from "$/models/user";

export function ModView() {
	const { id } = useParams();
	const [mod, setMod] = useState<Mod & { expand: { author: User } }>();
	const [versions, setVersions] = useState<ModVersion[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!id) {
			return;
		}

		(async () => {
			const mod = await pb.collection("mods").getOne<Mod & { expand: { author: User } }>(id, {
				expand: "author",
			});
			console.log(mod);
			setMod(mod);
			setIsLoading(false);
		})();
	}, [id]);

	useEffect(() => {
		if (!mod) {
			return;
		}

		(async () => {
			const versions = await pb.collection("mod_versions").getList<ModVersion>(1, 20, {
				mod: mod.id,
				sort: "-version",
			});
			setVersions(versions.items);
		})();
	}, [mod]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!id || !mod) {
		return <div>404</div>;
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
					<CardContent className="flex flex-col gap-3 divide-y [&>_:not(:first-child)]:pt-3">
						<p>Author: <b>@{mod.expand.author.username}</b></p>
						<div>
							<p>Versions:
								<ul className="list-disc pl-5">
									{versions.map(version => (
										<li key={version.id} className="[&:not(:first-child)]:marker:text-secondary [&:not(:first-child)]:text-secondary">
											{version.version}
										</li>
									))}
								</ul>
							</p>
						</div>
					</CardContent>
				</Card>
				<Button>
                    Install
				</Button>
			</div>
		</div>
	</div>;
}
