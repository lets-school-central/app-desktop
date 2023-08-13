import {writable} from "svelte/store";
import {listen} from "@tauri-apps/api/event";

import type {UnlistenFn} from "@tauri-apps/api/event";

export const appStore = writable({
    initialized: false,
});

export async function waitAppInitialization() {
    let unlisten: UnlistenFn | null;
    unlisten = await listen('app-initialized', () => {
        appStore.set({initialized: true});
        if (unlisten) {
            unlisten();
            unlisten = null;
        }
    });

    return () => {
        if (unlisten) {
            unlisten();
            unlisten = null;
        }
    }
}