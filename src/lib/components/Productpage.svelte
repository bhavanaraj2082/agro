<script>
  import { writable } from "svelte/store";
  // import { getCart } from "$lib/utils/cart.js";
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";
  import { toast, Toaster } from "svelte-sonner";
  import { authedUser, cartTotalComps } from "$lib/stores/mainStores.js";
  
  export let data;
  console.log(data, "from +page.svelte");
  const { records } = data;
  
  let form;
  let showImagePopup = false;
  let showQuoteModal = false;
  let productQuote = null;
  let showTooltip = false;
  let form5;
  let showPopup = false;
  let showCartPopup = false;
  let showLikedPopup = false;
  let orderMultiple = 1; 
  let quantity = writable(1);
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  let copyToastIndex = null;
  let copyToastID = false;
  let addedQuantity = 1;
  const productName = data?.name;

  let productStock = data.records;
  let index = 0;
  let selectedStockId = productStock?.[0]?.stockId?.[0] || "NA";

  const updateQuantity = (newQuantity) => {
    console.log("Updating quantity:", newQuantity);
    quantity.set(newQuantity);
  };

  const increaseQuantity = () => {
    quantity.update((q) => {
      let newQuantity = q + orderMultiple;
      return newQuantity > 999 ? 999 : newQuantity;
    });
  };

  const decreaseQuantity = () => {
    quantity.update((q) => {
      let newQuantity = q - orderMultiple;
      return newQuantity < orderMultiple ? orderMultiple : newQuantity;
    });
  };

  function addToCart(item) {
    console.log("Adding item to cart:", item);
    
    if ($authedUser?.id) {
      // Set the current product for form submission BEFORE submitting
      productQuote = {
        ...item,
        // Ensure we have the correct property names based on your data structure
        _id: item.productId, // Use productId from your data
        stockQuantity: item.stockQuantity || item.availableStock || 0
      };
      
      // Validate required data
      if (!item.productId) {
        toast.error("Product ID is missing");
        return;
      }
      
      // Log what will be sent
      console.log("Submitting form with data:", {
        userId: $authedUser.id,
        productId: item.productId, // Use productId directly
        stockQuantity: item.stockQuantity || item.availableStock || 0,
        qty: $quantity,
        price: item.price
      });
      
      // Wait for next tick to ensure productQuote is set, then submit
      setTimeout(() => {
        form.requestSubmit();
      }, 0);
      
    } else {
      // For non-authenticated users, use localStorage
      let cart = browser && localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
      
      let search = cart.find((x) => x.productId === item.productId);
      let currentQuantity;
      quantity.subscribe(q => currentQuantity = q)();
      
      if (search === undefined) {
        const newItem = { 
          ...item,
          _id: item.productId, // Ensure _id is set for localStorage compatibility
          quantity: currentQuantity,
          price: parseFloat((item.price * 83.5).toFixed(2))
        };
        cart.push(newItem);
      } else {
        search.quantity = currentQuantity;
      }
      
      let totalItems = cart.length;
      $cartTotalComps = totalItems;
      browser ? localStorage.setItem("cart", JSON.stringify(cart)) : "";
      browser ? localStorage.setItem("totalComps", totalItems) : "0";
      
      toast.success(`${currentQuantity} item(s) successfully added to Cart!`);
      quantity.set(1);
    }
  }

  function addedEnhance() {
    return async ({ result, formData }) => {
      console.log("Form submission result:", result);
      console.log("Form data sent:", Object.fromEntries(formData));
      
      if (result.type === 'success' && result.data?.res) {
        $cartTotalComps = result.data.res.cartItems?.length || 0;
        browser ? localStorage.setItem("totalComps", $cartTotalComps) : "0";
        toast.success("Component successfully added to Cart!");
        quantity.set(1);
        productQuote = null; // Reset after successful submission
      } else {
        console.error("Add to cart failed:", result);
        toast.error("Failed adding Component to Cart!");
        quantity.set(1);
      }
    };
  }
</script>

<!-- Updated form with correct field names -->
<form
  action="?/addItemToCart"
  method="post"
  bind:this={form}
  use:enhance={addedEnhance}
>
  <input type="hidden" name="userId" value={$authedUser?.id || ''} />
  <input type="hidden" name="productId" value={productQuote?.productId || ''} />
  <input type="hidden" name="stockQuantity" value={productQuote?.stockQuantity || productQuote?.availableStock || 0} />
  <input type="hidden" name="qty" value={$quantity} />
  <input type="hidden" name="price" value={productQuote?.price || 0} />
</form>

{#if records && records.length > 0}
  {#each records as product, index}
    <div
      class="group relative md:w-11/12 max-w-7xl md:flex lg:flex mx-auto bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 backdrop-blur-sm shadow-lg hover:shadow-2xl shadow-green-100/50 hover:shadow-green-200/60 rounded-2xl w-full p-8 mb-8 space-x-6 border border-green-100/50 hover:border-green-200/60 transition-all duration-500 ease-out hover:-translate-y-1 overflow-hidden"
      style="animation-delay: {index * 100}ms"
    >
      <!-- Animated background gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-green-400/5 via-emerald-400/5 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      ></div>

      <!-- Floating particles effect -->
      <div
        class="absolute top-4 right-4 w-2 h-2 bg-green-400/20 rounded-full animate-pulse"
      ></div>
      <div
        class="absolute bottom-8 left-8 w-1 h-1 bg-emerald-400/30 rounded-full animate-bounce"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute top-1/2 right-12 w-1.5 h-1.5 bg-teal-400/25 rounded-full animate-pulse"
        style="animation-delay: 2s"
      ></div>

      <div class="relative z-10 md:w-1/3 lg:w-1/4">
        {#if product.imageSrc}
          <div
            class="relative overflow-hidden rounded-2xl group-hover:rounded-3xl transition-all duration-500"
          >
            <img
              src={product.imageSrc}
              alt={product.productName}
              class="w-full object-cover h-72 transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>

            <!-- Image overlay effects -->
            <div
              class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-700 opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-500"
            >
              Premium Quality
            </div>
          </div>
        {:else}
          <div
            class="w-full rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 h-72 flex items-center justify-center text-gray-400 relative overflow-hidden group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-500"
          >
            <div class="text-center">
              <div
                class="w-16 h-16 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-500"
              >
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                  />
                </svg>
              </div>
              <p class="text-sm font-medium">No Image Available</p>
            </div>
          </div>
        {/if}
      </div>

      <div class="relative z-10 md:w-2/3 lg:w-3/4 mt-6 md:mt-0">
        <div class="mb-4">
          <h2
            class="text-3xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent mb-2 group-hover:from-green-700 group-hover:via-emerald-600 group-hover:to-green-700 transition-all duration-500"
          >
            {product.productName}
          </h2>

          <div class="flex flex-wrap gap-3 mb-4">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 group-hover:bg-green-200 group-hover:border-green-300 transition-all duration-300"
            >
              #{product.productNumber}
            </span>

            {#if product?.category?.name}
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 group-hover:bg-blue-200 group-hover:border-blue-300 transition-all duration-300"
              >
                {product.category.name}
              </span>
            {/if}

            {#if product?.subcategory?.name}
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 group-hover:bg-purple-200 group-hover:border-purple-300 transition-all duration-300"
              >
                {product.subcategory.name}
              </span>
            {/if}

            <!-- Stock Status Badge -->
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium {product.stockQuantity > 0 ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'} transition-all duration-300"
            >
              {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
            </span>
          </div>
        </div>

        <p
          class="text-gray-600 mb-6 leading-relaxed text-base group-hover:text-gray-700 transition-colors duration-300"
        >
          {product.description}
        </p>

        <div class="mb-6">
          <div class="inline-flex items-baseline">
            <span
              class="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent"
            >
              ₹{(product.price * 83.5).toFixed(2)}
            </span>
            <span class="ml-2 text-sm text-gray-500 line-through">
              ₹{(product.price * 83.5 * 1.2).toFixed(2)}
            </span>
            <span
              class="ml-3 px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full"
            >
              Save 20%
            </span>
          </div>
        </div>

        {#if product.properties && Object.keys(product.properties).length > 0}
          <div class="mb-6">
            <h3
              class="text-lg font-semibold mb-4 text-gray-800 group-hover:text-green-700 transition-colors duration-300"
            >
              Product Specifications
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each Object.entries(product.properties) as [key, value], propIndex}
                <div
                  class="flex items-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 group-hover:border-green-200 group-hover:bg-white/80 transition-all duration-300"
                  style="animation-delay: {index * 100 + propIndex * 50}ms"
                >
                  <div
                    class="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-green-500 transition-colors duration-300"
                  ></div>
                  <div class="flex-1">
                    <span
                      class="font-medium text-gray-700 capitalize text-sm block"
                    >
                      {key.replace("_", " ")}
                    </span>
                    <span class="text-gray-900 font-semibold text-sm">
                      {value}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Quantity Controls Section -->
        <div class="mb-6">
          <div class="flex items-center gap-6">
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-700 mr-4">Quantity:</span>
              <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  on:click={decreaseQuantity}
                  class="px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-200"
                  disabled={$quantity <= 1}
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                  </svg>
                </button>
                
                <div class="px-4 py-2 border-x border-gray-200 bg-gray-50 min-w-[60px] text-center">
                  <span class="font-semibold text-gray-800">{$quantity}</span>
                </div>
                
                <button
                  on:click={increaseQuantity}
                  class="px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-200"
                  disabled={$quantity >= 999}
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Total Price Display -->
            <div class="items-center sm:block hidden">
              <span class="text-sm font-medium text-gray-700 mr-2">Total:</span>
              <span class="text-xl font-bold text-green-600">
                ₹{(product.price * 83.5 * $quantity).toFixed(2)}
              </span>
            </div>
          </div>
          <div class="flex mt-2 items-center md:hidden">
            <span class="text-sm font-medium text-gray-700 mr-2">Total:</span>
            <span class="text-xl font-bold text-green-600">
              ₹{(product.price * 83.5 * $quantity).toFixed(2)}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            on:click={() => addToCart(product)} 
            
            class="group/btn relative overflow-hidden bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl shadow-green-200 hover:shadow-green-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-50"
          >
            <span class="relative z-10 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"/>
              </svg>
              Add to Cart
            </span>
            <div
              class="absolute inset-0 bg-gradient-to-r from-green-600 to-green-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left"
            ></div>
          </button>
        </div>
      </div>
    </div>
  {/each}
{:else}
  <div
    class="text-center p-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl mx-auto max-w-2xl shadow-lg border border-gray-100"
  >
    <div
      class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center"
    >
      <svg
        class="w-12 h-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    </div>
    <h3 class="text-2xl font-bold text-gray-800 mb-3">No Products Found</h3>
    <p class="text-gray-600 mb-6">
      We couldn't find any products matching your criteria. Try adjusting your
      search or browse our categories.
    </p>
    <button
      class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
    >
      Browse All Products
    </button>
    </div>
{/if}
<Toaster position="bottom-right" richColors />

<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .group {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
  }

  .group:nth-child(1) {
    animation-delay: 0s;
  }
  .group:nth-child(2) {
    animation-delay: 0.1s;
  }
  .group:nth-child(3) {
    animation-delay: 0.2s;
  }
  .group:nth-child(4) {
    animation-delay: 0.3s;
  }
  .group:nth-child(5) {
    animation-delay: 0.4s;
  }
</style>