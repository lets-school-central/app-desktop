<script lang="ts">
    import ContainerScreen from "$lib/components/ContainerScreen.svelte";
    import {superForm, superValidateSync} from "sveltekit-superforms/client";
    import {userLoginSchema} from "$lib/schemas/user";
    import {open} from "@tauri-apps/api/shell";
    import {authCommands} from "$lib/commands";
    import {toastStore} from "@skeletonlabs/skeleton";
    import {appStore} from "$lib/stores/app";
    import {goto} from "$app/navigation";

    $: if ($appStore.isAuthenticated) {
        goto("/");
    }

    const {
        enhance,
        submitting,
        delayed,
        timeout,
        form,
        errors,
    } = superForm(superValidateSync(userLoginSchema), {
        SPA: true,
        validators: userLoginSchema,
        multipleSubmits: "prevent",
        onUpdate: async function ({form}) {
            if (!form.valid) return;

            const {username, password} = form.data;

            if (await authCommands.authenticate(username, password)) {
                toastStore.trigger({
                    message: "Login successful",
                    background: "variant-glass-secondary shadow-xl"
                });
            } else {
                toastStore.trigger({
                    message: "Login failed",
                    background: "variant-glass-error shadow-xl"
                });
            }
        },
    });

</script>

<ContainerScreen>
    <div class="card variant-glass-surface max-w-xl w-full px-12 py-10 shadow-xl">
        <form method="POST" use:enhance>

            <div class="flex flex-col gap-6">
                <label for="username">
                    <span class="text-lg">Username</span>
                    <input
                            id="username"
                            type="text"
                            name="username"
                            title="Your username"
                            aria-invalid={$errors.username ? 'true' : undefined}
                            class="input"
                            bind:value={$form.username}
                            class:input-error={$errors.username}
                            disabled={$submitting}
                    />
                    {#if $errors.username}<span class="text-error-500-400-token">{$errors.username}</span>{/if}
                </label>

                <label class="label" for="password">
                    <span class="text-lg">Password</span>
                    <input
                            id="password"
                            type="password"
                            name="password"
                            title="Your password"
                            aria-invalid={$errors.password ? 'true' : undefined}
                            class="input"
                            bind:value={$form.password}
                            class:input-error={$errors.password}
                            disabled={$submitting}
                    />
                    {#if $errors.password}<span class="text-error-500-400-token">{$errors.password}</span>{/if}
                </label>
            </div>

            <button type="submit" class="btn variant-filled-primary w-full mt-10" disabled={$delayed}>
                Login to my account
            </button>

            {#if $timeout}
                <div class="text-xs">
                    <p>Hold on, we know the request is taking longer than expected...</p>
                    <p>It's probably just a slow connection, but you can try again if you want.</p>
                </div>
            {/if}
        </form>

        <hr class="my-10"/>

        <button
                on:click|preventDefault={() => open("https://www.lets-school-central.app/auth/register")}
                class="btn btn-sm variant-glass-surface w-full"
        >
            Don't have an account? Register here
        </button>
    </div>
</ContainerScreen>
