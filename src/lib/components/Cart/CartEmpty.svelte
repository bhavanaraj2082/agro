<script>
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";

  const goToShop = () => {
    goto("/");
  };
</script>

<div
  class="flex flex-col items-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-4 text-center relative overflow-hidden"
>
  <div class="bg-white mt-5 p-8 rounded-full shadow-md mb-6">
    <Icon icon="garden:shopping-cart-fill-16" width="46" height="46" />
  </div>

  <div class="space-y-4 mb-10">
    <h2 class="text-4xl font-bold text-gray-800 mb-3 tracking-tight">
      Your cart is empty
    </h2>
    <p class="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">
      Looks like you haven't added anything to your cart yet.
    </p>
  </div>
  <button
    class="bg-primary-500 relative z-10 max-w-sm w-full hover:bg-primary-600 text-white px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg transform hover:scale-105 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50 overflow-hidden group"
    on:click={goToShop}
  >
    <span class="relative z-10 flex items-center justify-center gap-2">
      Continue Shopping
      <Icon
        icon="mdi:arrow-right"
        width="20"
        height="20"
        class="group-hover:translate-x-1 transition-transform duration-200"
      />
    </span>
    <div
      class="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    ></div>
  </button>
  <div class="flex justify-center mt-8 space-x-2">
    <div class="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
    <div class="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-200"></div>
    <div class="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-400"></div>
  </div>
</div>
