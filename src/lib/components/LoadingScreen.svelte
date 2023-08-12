<script lang="ts">
    import {ProgressBar} from "@skeletonlabs/skeleton";
    import Container from "$lib/components/ContainerScreen.svelte";

    export let text = "Loading...";
    export let value: number | undefined = undefined;
    export let variant: "primary" | "success" | "error" = "primary";

    let meterVariant: string | undefined = undefined;
    let textVariant: string | undefined = undefined;
    $: {
        switch (variant) {
            case "success":
                meterVariant = "bg-success-400-500-token";
                textVariant = "text-success-400-500-token";
                break;
            case "error":
                meterVariant = "bg-error-400-500-token";
                textVariant = "text-error-400-500-token";
                break;
        }
    }
</script>

<Container>
    <div class="flex flex-col gap-0.5">
        <ProgressBar value={variant !== "primary" ? 100 : value} meter={meterVariant} />
        <p class="text-left {textVariant}">{text}</p>
    </div>
</Container>
