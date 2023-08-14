<script lang="ts">
    import {_} from 'svelte-i18n';
    import {useMachine} from "@xstate/svelte";
    import {createEventDispatcher} from "svelte";
    import LoadingScreen from "$lib/components/LoadingScreen.svelte";

    import type {StateMachine} from "xstate";

    const dispatch = createEventDispatcher();

    type StateConfig =
        | { type: 'custom' }
        | {
        type: 'loading',
        variant: "primary" | "success" | "warning" | "error",
        progress?: number | "full" | undefined,
        text?: string,
    }

    export let name: string;
    export let machine: StateMachine<any, any, any, any, any, any, any>;
    export let config: {
        [key: string]: StateConfig;
    };

    const {state, send} = useMachine(machine);

    let actualState: string;
    let actualStateConfig: StateConfig;
    $: {
        let v = $state.value;

        if (typeof v === 'string') {
            if (v === 'success') dispatch('success');
            actualState = v;
        } else {
            let [parent, child] = Object.entries(v)[0];
            actualState = `${parent}.${child}`;
        }

        actualStateConfig = config[actualState] ?? {type: 'custom'};
    }
</script>

{#if actualStateConfig.type === 'custom'}
    <slot state={actualState} context={$state.context} send={send}/>
{:else if actualStateConfig.type === 'loading'}
    <LoadingScreen
            variant={actualStateConfig.variant}
            progress={actualStateConfig.progress}
            text={actualStateConfig.text ?? $_(`machines.${name}.states.${actualState}`)}
    />
{/if}
