<script>

	import { browser } from '$app/environment';
	import { cartTotalComps, authedUser } from '$lib/stores/mainStores.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
  
	// Handle form errors and redirects
	// onMount(() => {
	//   if (form?.msg === 'Success') {
	//     $checkoutError = 'Failed to checkout. Try again.';
	//     goto(`/cart`);
	//     setTimeout(() => {
	//       $checkoutError = '';
	//     }, 3000);
	//   }
	// });

</script>

<section class="bg-gray-50 flex items-center justify-center p-6">
    <div class="bg-white shadow-xl rounded-md max-w-lg w-full p-6 md:p-8" in:fade={{ duration: 400 }}>
      <div class="flex flex-col justify-center items-center space-y-4">
        <div class="flex justify-center w-full">
          <Icon icon="carbon:close-outline" class="text-5xl mb-4 text-red-500 cursor-pointer" />
        </div>
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 text-center">Oops! Something Went Wrong</h1>
        <p class="text-gray-600 mt-2 text-center">We encountered an issue while processing your order.</p>
        <p class="text-gray-600 my-2 text-center font-medium text-sm">We apologize for the inconvenience and are working to fix it.</p>
        <p class="text-gray-600 mb-6 text-center">Please try again later.</p>
        <button 
          class="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded px-4 py-2 mt-4 w-1/2 max-w-xs transition ease-in-out duration-300" 
          on:click={() => goto('/cart')} 
          in:fly={{ y: 10, duration: 600 }}>
          Go to Cart
        </button>
      </div>
    </div>
  </section>
  
  <style>
    section {
      animation: fade-in 0.8s ease-out;
    }
    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    button:hover {
      transform: translateY(-3px);
    }
    button:active {
      transform: translateY(0);
    }
  </style>
