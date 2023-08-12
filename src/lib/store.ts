import {writable} from "svelte/store";

type Store = {
    isLoading: boolean;
    modLoaderIsInstalled: boolean;
    modLoaderIsInstalling: boolean;
    gameInstallationFolder?: string;
}

export default writable<Store>({
    isLoading: true,
    modLoaderIsInstalled: false,
    modLoaderIsInstalling: false,
});
