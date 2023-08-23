import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

import { Button } from "$/components/ui/button";
import { Card, CardContent, CardHeader } from "$/components/ui/card";
import { useModsStore } from "$/stores/modsStore";

export default function ModManagerCard() {
	const isInstalled = useModsStore(state => state.isInstalled);

	return (
		<Card>
			<CardHeader className="flex flex-row gap-2">
				<span>
                    Mod Manager
				</span>
				{isInstalled ? <CheckCircledIcon className="text-primary" /> : <CrossCircledIcon className="text-destructive" />}
			</CardHeader>
			<CardContent>
				{isInstalled
					? <>
						<Button asChild>
							<Link to="/mods">
								Browse mods
							</Link>
						</Button>
					</>
					: <>
						<Button asChild>
							<Link to="/mod-initialization">
								Install
							</Link>
						</Button>
					</>
				}
			</CardContent>
		</Card>
	);
}
