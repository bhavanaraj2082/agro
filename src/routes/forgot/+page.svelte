<script>
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";
    import { applyAction } from "$app/forms";
    import { goto } from '$app/navigation';
    import { Toaster } from "svelte-sonner";
    import { authedUser } from "$lib/stores/mainStores.js";

    let form;
    let email = "";
    let emailError = "";
    let token = "";
    let loading = false;

    const dispatch = createEventDispatcher();

    function handleSubmit() {
        const emailaddress = form.resetrequest.record.email;
        dispatch("email", emailaddress);
    }

    let heading = "Request";
    if (form) {
        heading = "Validate";
    }

    $: successMessage = "";
    $: errorMessage = "";
</script>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<main class="my-10 z-10">
   
    <div class="max-w-80 sm:max-w-xs md:max-w-sm lg:max-w-sm rounded-lg shadow-xl mx-auto mt-20 border border-gray-200 overflow-hidden">
        {#if !successMessage}
            <div class="bg-primary-400 text-green-500 p-6 flex flex-col items-center justify-center">
                <Icon icon="mdi:lock-reset" class="text-4xl mb-2" />
                <h1 class="text-center text-xl text-green-500 lg:text-2xl font-semibold">
                    Forgot your Password?
                </h1>
                <p class="text-center text-green-500 text-opacity-80 text-sm mt-2">
                    We'll help you reset it in just a few steps
                </p>
            </div>
        {/if}

        <div class="bg-green-500 p-6">
            {#if successMessage}
                <div
                    class="my-4 p-6 text-sm rounded-md flex flex-col items-center"
                >
                    <Icon
                        icon="mdi:email-check"
                        class="text-primary-400 text-3xl mb-3"
                    />
                    <h2 class="text-lg font-semibold mb-2 text-primary-400">
                        Email Sent!
                    </h2>
                    <p class="text-center text-gray-700">{successMessage}</p>
                    <div class="mt-4 w-full">
                        <a
                            href="/signin"
                            class="block w-full py-2 text-center text-sm rounded-md font-medium border border-primary-400 text-primary-400 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
                        >
                            Return to SignIn
                        </a>
                    </div>
                    <!-- <div class="mt-4 w-full">
                        <a
                            href="/login"
                            class="block w-full py-2 text-center text-sm rounded-md font-medium border border-primary-400 text-primary-400 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
                        >
                            Return to Login
                        </a>
                    </div> -->
                </div>
            {/if}

            {#if errorMessage}
                <div
                    class="mb-6 p-4 text-sm bg-red-100 text-red-800 rounded-md border border-red-200 flex items-center"
                >
                    <Icon
                        icon="mdi:alert-circle"
                        class="text-red-500 mr-2 text-lg"
                    />
                    {errorMessage}
                </div>
            {/if}

            {#if !form && !successMessage}
                <div>
                    <form
                        use:enhance={() => {
                            return async ({ result }) => {
                                loading = false;
                                if (result.data.success === true) {
                                    successMessage =
                                        "Password reset link sent successfully! Please check your email to proceed.";
                                    toast.success(result.data.message);
                                    email = "";
                                    emailError = "";
                                    form = true;
                                    heading = "Validate";
                                } else {
                                    successMessage = "";
                                    toast.error(result.data.message);
                                }
                                await applyAction(result);
                            };
                        }}
                        method="POST"
                        action="?/resetrequestStep1"
                        on:submit={() => {
                            loading = true;
                        }}
                    >
                        <div class="mb-6">
                            <label
                                for="email"
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email Address
                            </label>
                            <div class="relative">
                                <div
                                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                                >
                                    <Icon
                                        icon="mdi:email-outline"
                                        class="text-gray-400 text-lg"
                                    />
                                </div>
                                {#if $authedUser?.email}
                                    <input
                                        id="email"
                                        class="w-full text-sm border border-gray-300 p-3 pl-10 rounded-md  focus:ring-0 shadow-sm focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
                                        name="email"
                                        placeholder="your@email.com"
                                        type="email"
                                        value={$authedUser.email}
                                        readonly
                                    />
                                {:else}
                                    <input
                                        id="email"
                                        class="w-full text-sm border border-gray-300 p-3 pl-10 rounded-md shadow-sm focus:ring-0 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
                                        name="email"
                                        placeholder="your@email.com"
                                        type="email"
                                        bind:value={email}
                                        on:input={() => {
                                            const emailRegex = /^\S+@\S+.\S+$/;
                                            emailError =
                                                !email ||
                                                !emailRegex.test(email)
                                                    ? "Please enter a valid email address"
                                                    : "";
                                        }}
                                    />
                                {/if}
                            </div>
                            {#if emailError}
                                <p
                                    class="mt-2 text-red-600 text-xs flex items-center"
                                >
                                    <Icon
                                        icon="mdi:alert-circle"
                                        class="mr-1"
                                    />
                                    {emailError}
                                </p>
                            {/if}
                            {#if form?.invalid}
                                <p
                                    class="mt-2 text-red-600 text-xs flex items-center"
                                >
                                    <Icon icon="typcn:warning" class="mr-1" />
                                    {form.invalid}
                                </p>
                            {/if}
                            <p class="mt-2 text-xs text-white">
                                We'll send a secure link to reset your password
                            </p>
                        </div>

                        <div class="mt-6">
                            <button
                                type="submit"
                                class="w-full py-3 text-sm rounded-md font-medium bg-white text-green-500 hover:bg-white-500 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                disabled={loading}
                            >
                                {#if loading}
                                    <Icon
                                        icon="svg-spinners:pulse-rings-3"
                                        class="text-2xl animate-spin"
                                    />
                                    <span>Sending Link...</span>
                                {:else}
                                    <Icon icon="mdi:send" class="text-lg bg-white text-green-500" />
                                    <span>Send Reset Link</span>
                                {/if}
                            </button>
                        </div>
                        <div class="mt-4 text-center">
                            <a
                                href="/signin"
                                class="text-sm text-white hover:underline flex items-center justify-center gap-1"
                            >
                                <Icon icon="mdi:arrow-left" />
                                <span>Back to SignIn</span>
                            </a>
                        </div>

                        <!-- <div class="mt-4 text-center">
                            <a
                                href="/login"
                                class="text-sm text-primary-400 hover:text-primary-500 flex items-center justify-center gap-1"
                            >
                                <Icon icon="mdi:arrow-left" />
                                <span>Back to Login</span>
                            </a>
                        </div> -->
                    </form>
                </div>
            {/if}
        </div>
    </div>
</main>

<Toaster position="bottom-right" richColors />
