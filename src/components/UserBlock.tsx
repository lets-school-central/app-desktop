import { Link } from "react-router-dom";

import { Button } from "$/components/ui/button";
import { useUserStore } from "$/stores/userStore";

export default function UserBlock() {
	const { isLoggedIn, logout, user } = useUserStore();

	return (
		<div className="flex flex-col gap-2">
			{isLoggedIn() ? (
				<div className="flex justify-between">
					<div className="">
						Connected as <u>{user?.username}</u>
					</div>
					<div className="flex flex-col w-64">
						<Button onClick={logout}>Logout</Button>
					</div>
				</div>
			) : (

				<div className="flex justify-between">
					<div className="">
						Not connected
					</div>
					<div className="flex flex-col w-64">
						<Button asChild>
							<Link to="/login">
								Login
							</Link>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
