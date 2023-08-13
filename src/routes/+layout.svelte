<script lang='ts'>
    import '@skeletonlabs/skeleton/themes/theme-modern.css';
    import '@skeletonlabs/skeleton/styles/skeleton.css';
    import '../app.postcss';

    import {computePosition, autoUpdate, offset, shift, flip, arrow} from '@floating-ui/dom';
    import {storePopup} from '@skeletonlabs/skeleton';
    import {onMount} from "svelte";
    import {page} from '$app/stores';
    import {appStore, waitAppInitialization} from "$lib/stores/app";

    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});

    onMount(waitAppInitialization);
</script>

{#if $appStore.initialized || $page.route.id === '/splashscreen'}
    <slot/>
{/if}
