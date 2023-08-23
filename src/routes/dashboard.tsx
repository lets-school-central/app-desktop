import Header from "$/components/Header";
import ModsManagerCard from "$/components/ModManagerCard";
import { useUserStore } from "$/stores/userStore";

export default function Dashboard() {
	const { isLoggedIn, user } = useUserStore();

	return (
		<div className="flex flex-col gap-4">
			<Header title={isLoggedIn() ? (`Welcome back, ${user?.username}!`) : ("Welcome to the LSC App !")} />
			<div className="grid grid-cols-2 px-10">
				<ModsManagerCard />
			</div>
		</div>
	);
}
