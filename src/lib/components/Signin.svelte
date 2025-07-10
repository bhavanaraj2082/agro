<script>
  import Icon from "@iconify/svelte";
  import { enhance, applyAction } from "$app/forms";
  import { toast, Toaster } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import { onDestroy, onMount } from "svelte";
  import { writable } from 'svelte/store';
  import { browser } from '$app/environment';
  
  // Create a user store that's safely initialized
  export const userStore = writable(null);

  let isOtpLogin = false;
  let email = "";
  let password = "";
  let validErrorpass = "";
  let otpStatus = "";
  let showPassword = false;
  let isLoading = false;
  let enteredOtp = "";
  let errors = {};
  let form4;
  let timeLeft;
  let timerInterval;
  let unsubscribe;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  onMount(() => {
    // Initialize user store from localStorage only in browser environment
    if (browser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        userStore.set(JSON.parse(storedUser));
      }
      
      // Subscribe to store changes to update localStorage
      unsubscribe = userStore.subscribe(value => {
        if (value) {
          localStorage.setItem('user', JSON.stringify(value));
        }
      });
    }
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
    if (browser && unsubscribe) unsubscribe(); // Clean up the subscription
  });

  function validateEmail() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    } else {
      delete errors.email;
    }
  }

  const handleFormSubmit = ({ cancel }) => {
    return async ({ result, update }) => {
      console.log(result);

      if (result.type === "redirect") {
        // Store the user data before redirecting
        const userData = {
          email: email,
          // You may not have access to tokens here since it's a redirect
          // You might want to store minimal info and get the rest after redirect
          loggedInAt: new Date().toISOString()
        };
        
        // Store in Svelte store
        userStore.set(userData);
        
        // Also store in localStorage but only in browser environment
        if (browser) {
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('isLoggedIn', 'true');
        }
        
        // Then proceed with the redirect
        await goto(result.location);
        await update();
        location.reload();
      }
      
      await applyAction(result);

      if (result.type === "failure") {
        toast.error(result.data.errorMsg);
      } else if (result.type === "success") {
        toast.success(result.data.errorMsg);
      }
    };
  };

  const startTimer = () => {
    clearInterval(timerInterval);
    timeLeft = 60;

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1;
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);
  };
</script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <div
    class="min-h-screen  flex items-center justify-center p-4"
  >

    <div class="w-full max-w-5xl mt-10">
      <div
        class="flex flex-col md:flex-row bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl"
      >
        <div
          class="w-full md:w-3/5 p-8 md:pb-12 md:px-12 flex flex-col justify-center relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-500/80 to-green-600/80 z-0"
          ></div>
          <div
            class="absolute top-6 md:right-10 right-4 w-20 h-20 rounded bg-green-200 animate-pulse clip-hexagon flex md:justify-center justify-end items-center"
          >
            <Icon
              icon="lets-icons:chemistry-light"
              class="text-gray-100 text-5xl"
            />
          </div>
          <div
            class="absolute md:bottom-2 md:right-0 bottom-2 left-48 sm:w-80 sm:h-80 h-20 w-20 rounded bg-green-100/10 animate-pulse clip-hexagon"
          ></div>
          <div class="relative z-10">
            <h1 class="text-2xl md:text-4xl font-bold text-green-500 mb-6">
              Welcome Back!
            </h1>
            <div class="md:w-72 w-20 h-1 bg-green-500 mb-8"></div>
           
            <div class="space-y-6 md:pr-12 hidden md:block">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 rounded-full bg-green-500/20 shadow-md flex items-center justify-center"
                >
                  <Icon icon="ph:shield-check-bold" class="text-lg text-green-500" />
                </div>
                <span class="text-green-500 md:text-lg text-xs"
                  >Secure authentication</span
                >
              </div>
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 rounded-full bg-green-50/20 shadow-md flex items-center justify-center"
                >
                  <Icon icon="ph:lightning-bold" class="text-lg text-green-500" />
                </div>
                <span class="text-green-500 md:text-lg text-xs"
                  >Fast and reliable access</span
                >
              </div>
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 rounded-full bg-green-50/20 shadow-md flex items-center justify-center"
                >
                  <Icon icon="ph:devices-bold" class="text-lg text-green-500" />
                </div>
                <span class="text-green-500 md:text-lg text-xs"
                  >Works across all your devices</span
                >
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-full md:w-2/5 bg-white md:rounded-r-xl relative z-10 p-4 md:p-10"
        >
          <div class="max-w-md mx-auto">
            <h2 class="text-2xl font-bold text-green-600 mb-2">Sign In</h2>
            <p class="mb-6 sm:text-sm text-xs text-gray-600">
              Don't have an account? <a
                href="/signup"
                class="text-green-500 hover:text-green-600 font-medium"
                >Create a new one</a
              >
            </p>
  
            <form
              method="POST"
              action="?/login"
              use:enhance={handleFormSubmit}
              class="space-y-4"
            >
              <div class="space-y-1">
                <label for="email" class="block text-sm font-medium text-gray-700"
                  >Email address</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                  >
                    <Icon icon="heroicons:envelope" class="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    bind:value={email}
                    on:input={validateEmail}
                    placeholder="username@example.com"
                    class="pl-10 w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                {#if errors.email}
                  <p class="text-red-500 text-xs mt-1">{errors.email}</p>
                {/if}
              </div>
              <div class="space-y-1">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700">Password</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                  >
                    <Icon icon="heroicons:lock-closed" class="text-gray-400" />
                  </div>
                  {#if showPassword}
                    <input
                      type="text"
                      name="password"
                      id="password"
                      placeholder="Password"
                      bind:value={password}
                      on:input={() => {
                        password = password.trim();
                        validErrorpass = !password
                          ? "Please enter a valid Password"
                          : "";
                      }}
                      class="pl-10 w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                    />
                  {:else}
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      bind:value={password}
                      on:input={() => {
                        password = password.trim();
                        validErrorpass = !password
                          ? "Please enter a valid Password"
                          : "";
                      }}
                      class="pl-10 w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                    />
                  {/if}
                  <button
                    type="button"
                    class="absolute top-3 right-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                    on:click={() => (showPassword = !showPassword)}
                  >
                    {#if showPassword}
                      <Icon icon="mdi:eye-off-outline" class="w-5 h-5" />
                    {:else}
                      <Icon icon="mdi:eye-outline" class="w-5 h-5" />
                    {/if}
                  </button>
                </div>
                {#if validErrorpass}
                  <p class="text-red-500 text-xs mt-1">{validErrorpass}</p>
                {/if}
              </div>
  
              <div class="flex justify-end">
                <a
                  href="/forgot"
                  class="md:text-sm text-xs text-green-600 hover:text-green-700 hover:underline underline-offset-2"
                  >Forgot password?</a
                >
              </div>
  
              <button
                type="submit"
                class="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-green-500 rounded-md py-2 font-medium transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center"
              >
              <Icon icon="material-symbols:open-in-phone" class="mr-2 text-white" />
              <span class="text-white">Sign In</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Toaster position="bottom-right" richColors />
  </div>
  