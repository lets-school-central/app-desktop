<script lang="ts">
    import MachineDisplay from "$lib/components/MachineDisplay.svelte";
    import {initializationMachine} from "$lib/machines/initialization-machine";
    import ContainerScreen from "$lib/components/ContainerScreen.svelte";
    import SelectGamePath from "./SelectGamePath.svelte";
    import {invoke} from "@tauri-apps/api/tauri";
    import {appStore} from "$lib/stores/app";
    import {goto} from "$app/navigation";

    $: if ($appStore.isInitialized) {
        goto("/");
    }

    async function onSuccess() {
        await invoke("set_initialized", {isInitialized: true});
    }
</script>

<ContainerScreen>
    <MachineDisplay
            name="initialization"
            machine={initializationMachine}
            config={{
                "game-installation-checking.running": {
                    type: "loading",
                    variant: "primary",
                },
                "game-installation-checking.error": {
                    type: "loading",
                    variant: "error",
                    progress: "full"
                },
                "game-installation-checking.success": {
                    type: "loading",
                    variant: "success",
                    progress: "full"
                },
                "mods-loader-checking.running": {
                    type: "loading",
                    variant: "primary",
                },
                "mods-loader-checking.outdated": {
                    type: "loading",
                    variant: "warning",
                    progress: "full"
                },
                "mods-loader-checking.not-installed": {
                    type: "loading",
                    variant: "error",
                    progress: "full"
                },
                "mods-loader-checking.installed": {
                    type: "loading",
                    variant: "success",
                    progress: "full"
                },
                "mods-loader-downloading.running": {
                    type: "loading",
                    variant: "primary",
                },
                "mods-loader-downloading.error": {
                    type: "loading",
                    variant: "error",
                    progress: "full"
                },
                "mods-loader-downloading.success": {
                    type: "loading",
                    variant: "success",
                    progress: "full"
                },
                "mods-loader-installing.running": {
                    type: "loading",
                    variant: "primary",
                },
                "mods-loader-installing.error": {
                    type: "loading",
                    variant: "error",
                    progress: "full"
                },
                "mods-loader-installing.success": {
                    type: "loading",
                    variant: "success",
                    progress: "full"
                },
                "mods-loader-cleaning-download.running": {
                    type: "loading",
                    variant: "primary"
                },
                "mods-loader-cleaning-download.error": {
                    type: "loading",
                    variant: "error",
                    progress: "full"
                },
                "mods-loader-cleaning-download.success": {
                    type: "loading",
                    variant: "success",
                    progress: "full"
                },
                "success": {
                    type: "loading",
                    variant: "success",
                    progress: "full"
                },
            }}
            on:success={onSuccess}
            let:state
            let:send
            let:context
    >
        {#if state === "game-installation-checking.selectGamePath"}
            <SelectGamePath send={send} context={context}/>
        {:else if state === "mods-loader-downloading.waiting" && context.modsLoaderStatus === "outdated"}
            <div class="flex flex-col gap-6">
                <h2 class="text-2xl">Mod loader outdated, update ?</h2>
                <div class="flex flex-row gap-6 px-16">
                    <button class="flex-1 btn btn-sm variant-filled-primary"
                            on:click|once={() => send("INSTALL_MODS_LOADER")}>Update
                    </button>
                    <button class="flex-1 btn btn-sm variant-filled-warning"
                            on:click|once={() => send("CANCEL_MODS_LOADER_INSTALL")}>Ignore
                    </button>
                </div>
            </div>
        {:else if state === "mods-loader-downloading.waiting" && context.modsLoaderStatus === "not-installed"}
            <div class="flex flex-col gap-6">
                <h2 class="text-2xl">Mod loader not installed, install ?</h2>
                <div class="flex flex-row gap-6 px-16">
                    <button class="flex-1 btn btn-sm variant-filled-primary"
                            on:click|once={() => send("INSTALL_MODS_LOADER")}>Install
                    </button>
                </div>
            </div>
        {/if}
    </MachineDisplay>
</ContainerScreen>
