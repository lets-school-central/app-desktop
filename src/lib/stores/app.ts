import {writable} from "svelte/store";
import {listen} from "@tauri-apps/api/event";

import type {UnlistenFn} from "@tauri-apps/api/event";
import {invoke} from "@tauri-apps/api/tauri";

export const appStore = writable({
    initialized: false,
});

export async function waitAppInitialization() {
    let unlisten: UnlistenFn | null;
    unlisten = await listen('app_initialized', () => {
        appStore.set({initialized: true});
        if (unlisten) {
            unlisten();
            unlisten = null;
        }
    });

    if (await invoke<boolean>('is_app_initialized')) {
        appStore.set({initialized: true});
        if (unlisten) {
            unlisten();
            unlisten = null;
        }
    }

    return () => {
        if (unlisten) {
            unlisten();
            unlisten = null;
        }
    }
}