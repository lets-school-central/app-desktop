<script lang="ts">
    import {ProgressBar} from "@skeletonlabs/skeleton";

    export let text = "Loading...";
    export let progress: number | "full" | undefined = undefined;
    export let variant: "primary" | "success" | "warning" | "error" = "primary";

    let meterVariant: string | undefined = undefined;
    let textVariant: string | undefined = undefined;
    $: {
        switch (variant) {
            case "primary":
                meterVariant = "bg-surface-900-50-token";
                textVariant = "text-surface-900-50-token";
                break;
            case "success":
                meterVariant = "bg-success-400-500-token";
                textVariant = "text-success-400-500-token";
                break;
            case "warning":
                meterVariant = "bg-warning-400-500-token";
                textVariant = "text-warning-400-500-token";
                break;
            case "error":
                meterVariant = "bg-error-400-500-token";
                textVariant = "text-error-400-500-token";
                break;
        }
    }
</script>

<div class="flex flex-col gap-0.5">
    <ProgressBar value={progress === "full" ? 100 : progress} meter={meterVariant} />
    <p class="text-left {textVariant}">{text}</p>
</div>
