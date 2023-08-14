<script lang="ts">
    import type {useMachine} from "@xstate/svelte";
    import {popup} from '@skeletonlabs/skeleton';

    export let send: ReturnType<typeof useMachine>['send'];
    export let context: Record<string, any>;

    let gamePath = context.gamePath;
    $: send('SET_GAME_PATH', {gamePath});
</script>

<div class="flex flex-col gap-6">
    <form class="flex flex-row gap-3" on:submit|preventDefault|once={() => send('RETRY')}>
        <input class="input" bind:value={gamePath} placeholder="Type the installation folder of your game..."/>
        <button
                type="submit"
                class="btn variant-filled"
                class:variant-filled-primary={!!gamePath}
                disabled={!gamePath}
        >
            Validate
        </button>
    </form>
    <div>
        <span
                class="chip"
                use:popup={{ event: 'hover', target: 'whereismygame', placement: 'bottom' }}
        >
            Where is my Game ?
        </span>
    </div>
</div>

<div class="card p-4 variant-ghost-primary" data-popup="whereismygame">
    <div class="text-xs max-w-lg">
        <p>
            If you don't know where your game is installed:
            right-click on the game in your Steam library,
            select "Properties",
            then "Local Files",
            and finally "Browse Local Files".
        </p>
    </div>
</div>