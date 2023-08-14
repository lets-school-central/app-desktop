import {get, writable} from "svelte/store";
import {listen} from "@tauri-apps/api/event";

import type {UnlistenFn} from "@tauri-apps/api/event";
import {invoke} from "@tauri-apps/api/tauri";
import {goto} from "$app/navigation";

export type AppStore = {
    isReady: boolean;
    isInitialized: boolean;
    isAuthenticated: boolean;
}

export const appStore = writable<AppStore>({
    isReady: false,
    isInitialized: false,
    isAuthenticated: false,
});

export async function waitAppInitialization() {
    const {
        isReady,
        isInitialized,
        isAuthenticated,
    } = await invoke<AppStore>('get_state');

    appStore.update((s) => ({
        ...s,
        isReady: isReady ?? s.isReady,
        isInitialized: isInitialized ?? s.isInitialized,
        isAuthenticated: isAuthenticated ?? s.isAuthenticated,
    }));

    console.log('state', get(appStore));

    return await listen<{ field: keyof AppStore, newState: AppStore }>('state_changed', (event) => {
        console.log('state_changed', event);

        const {payload: {newState: {isReady, isAuthenticated, isInitialized}}} = event;
        appStore.update((s) => ({...s, isReady, isAuthenticated, isInitialized}));

        console.log('state', get(appStore));
    });
}