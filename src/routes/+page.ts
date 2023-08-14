import {appStore} from "$lib/stores/app";
import {get} from "svelte/store";

import type {PageLoad} from "./$types";
import {goto} from "$app/navigation";

export const load = (async (event) => {
    if (event.url.pathname === '/') {
        const s = get(appStore);
        if (s.isAuthenticated && s.isInitialized) {
            await goto('/mods');
        } else if (s.isAuthenticated) {
            await goto('/initialization');
        } else {
            await goto('/login');
        }
    }
}) satisfies PageLoad;
