<script lang="ts">
    import {useMachine} from "@xstate/svelte";
    import {popup} from '@skeletonlabs/skeleton';
    import {gameMachine} from "$lib/machines/game-machine";
    import LoadingScreen from "$lib/components/LoadingScreen.svelte";
    import ContainerScreen from "$lib/components/ContainerScreen.svelte";

    const {state, send} = useMachine(gameMachine);

    let gamePath = $state.context.gamePath;
    $: send('SET_GAME_PATH', {gamePath});
</script>

{#if $state.value === 'checking'}
    <LoadingScreen text="Checking game installation..."/>
{:else if $state.value === 'errorLoading'}
    <LoadingScreen text={`Error: ${$state.context.error}`} variant="error"/>
{:else if $state.value === 'error'}
    <button class="absolute z-10" on:click={() => send('RETRY')}>Retry</button>

    <ContainerScreen>
        <div class="flex flex-col gap-6">
            <form class="flex flex-row gap-3" on:submit|preventDefault={() => send('RETRY')}>
                <input class="input" bind:value={gamePath} placeholder="Type the installation folder of your game..."/>
                <button type="submit" class="btn variant-filled" class:variant-filled-primary={!!gamePath}
                        disabled={!gamePath}>Validate
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
    </ContainerScreen>
{:else if $state.value === 'successLoading'}
    <LoadingScreen text="Game installation found!" variant="success"/>
{/if}

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