import { Store } from "tauri-plugin-store-api";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import pb from "$/lib/pocketbase";
import { sleep } from "$/lib/utils";
import type { User } from "$/models/user";

export type UserStoreState = {
	user: User | undefined;
	initialized: boolean;
};

type UserStoreActions = {
	isLoggedIn: () => boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
};

const store = new Store(".userStore.dat");

export const useUserStore = create<UserStoreState & UserStoreActions>()(immer<UserStoreState & UserStoreActions>((set, get) => ({
	user: undefined,
	initialized: false,
	store: undefined,
	isLoggedIn() {
		return Boolean(get().user);
	},
	async login(username: string, password: string) {
		const data = await pb.collection("users").authWithPassword<User>(username, password);

		if (!data) {
			return;
		}

		const { record: user, token } = data;

		set({ user });

		await store.set("token", token);
		await store.set("user", user);
		await store.save();
	},
	async logout() {
		pb.authStore.clear();

		set({ user: undefined });

		await store.clear();
	},
})));

(async () => {
	await sleep(1000);

	const user = await store.get<User>("user");
	const token = await store.get<string>("token");
	if (user && token) {
		pb.authStore.save(token, user);

		if (!pb.authStore.isValid) {
			await store.clear();
			useUserStore.setState({ initialized: true });
			return;
		}
	}

	try {
		const data = await pb.collection("users").authRefresh<User>();
		if (!data) {
			return;
		}

		const { record: user, token } = data;

		useUserStore.setState({ user, initialized: true });

		await store.set("token", token);
		await store.set("user", user);
		await store.save();
	} catch (e) {
		useUserStore.setState({ initialized: true });
	}
})();
