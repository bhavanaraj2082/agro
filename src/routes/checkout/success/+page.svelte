<script>
	import { browser } from '$app/environment';
	import { cartTotalComps, authedUser } from '$lib/stores/mainStores.js';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
  import Icon from '@iconify/svelte';

</script>

<section class="bg-gray-50 flex items-center justify-center p-6">
    <div class="bg-white shadow-xl rounded-md max-w-2xl w-full p-6 md:p-8" in:fade={{ duration: 400 }}>
      <div class="flex flex-col justify-center items-center space-y-6">
        <div class="flex justify-center w-full">
          <Icon icon="mdi:success-circle-outline" class="text-5xl mb-2 text-green-500" />
        </div>
        <h1 class="text-2xl md:text-3xl text-center font-semibold text-gray-800">Thank you for your order!</h1>
        <p class="text-gray-600 mt-2 text-center font-medium md:text-sm text-xs">Your order has been placed successfully.</p> 
        <div class="my-6 p-4 bg-gray-100 flex justify-center text-center rounded w-full">
          <p class="text-gray-700 text-xs md:text-base">
            <strong class="text-red-500">Note:</strong> Our team will contact you as soon as possible for further updates.
          </p>
        </div>
      </div>
    </div>  
    </section>
    
    <style>
	      section {
      animation: fade-in 0.8s ease-out;
    }

  </style>
