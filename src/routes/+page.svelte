<script lang="ts">
    import {appStore} from "$lib/stores/app";
    import {goto} from "$app/navigation";

    $: {
        const s = $appStore;
        if (s.isAuthenticated && s.isInitialized) {
            goto('/mods');
        } else if (s.isAuthenticated) {
            goto('/initialization');
        } else {
            goto('/login');
        }
    }
</script>