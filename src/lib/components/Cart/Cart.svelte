<script>
  import { PUBLIC_IMAGE_PATH } from "$env/static/public";
  import { authedUser, cartTotalComps } from "$lib/stores/mainStores.js";
  import { tick } from "svelte";
  import { browser } from "$app/environment";
  import { cart } from "$lib/utils/cart.js";
  import { enhance } from "$app/forms";
  import CartEmpty from "./CartEmpty.svelte";
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  import { toast, Toaster } from "svelte-sonner";
  import { goto } from "$app/navigation";
  export let data;
  console.log(data,"from page");
  
  let form;
  let form2;
  let form3;
  let imgUrl = "";
  let isImgPopup = false;
  let guestComps;
  let showMergeModal = false;
  let loginModal = false;

  // Updated totalPrice calculation for new data structure
  $: totalPrice = Array.isArray($cart)
    ? $cart.reduce((sum, item) => {
        const itemPrice = item.price || 0;
        const quantity = parseInt(item.qty) || 1;
        return sum + (itemPrice * quantity);
      }, 0)
    : 0;

  const MAX_QUANTITY = 10000000;

  function imagePopup(img) {
    imgUrl = img;
    isImgPopup = true;
  }

  function debounce(fn, delay = 300) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }

  const debouncedSubmit = debounce(() => {
    form2?.requestSubmit();
  }, 700);

  function saveToLocalStorage(cartArray) {
    const transformed = cartArray.map((item) => ({
      productId: item._id,
      qty: item.qty,
    }));

    localStorage.setItem("cart", JSON.stringify(transformed));
  }

  const increment = (id) => {
    cart.update((crt) => {
      const updated = crt.map((c) => {
        if (c._id === id) {
          c.qty = Math.min(parseInt(c.qty) + 1, MAX_QUANTITY);
        }
        return c;
      });

      if (!$authedUser?.id) {
        if (browser) saveToLocalStorage(updated);
      } else {
        debouncedSubmit();
      }

      return updated;
    });
  };

  const decrement = (id) => {
    cart.update((crt) => {
      const updated = crt.map((c) => {
        if (c._id === id) {
          const currentQty = parseInt(c.qty) || 1;
          c.qty = currentQty > 1 ? currentQty - 1 : 1;
        }
        return c;
      });

      if (!$authedUser?.id) {
        if (browser) saveToLocalStorage(updated);
      } else {
        debouncedSubmit();
      }
      return updated;
    });
  };

  onMount(() => {
    if ($authedUser?.id) {
      cart.set(data?.cartData);
      guestComps =
        browser && localStorage.getItem("cart")
          ? JSON.parse(localStorage.getItem("cart"))
          : [];
      if (guestComps.length > 0) {
        showMergeModal = true;
      }
    } else {
      guestCartFetch();
    }
  });

  async function guestCartFetch() {
    guestComps =
      browser && localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
    await tick();
    form.requestSubmit();
  }

  function closeMergeModal() {
    showMergeModal = false;
  }

  function removeMergeModal() {
    showMergeModal = false;
    localStorage.removeItem("cart");
  }

  function addedEnhance() {
    return async ({ result }) => {
      if (result.data.cartData) {
        cart.set(result?.cartData);
      } else {
      }
    };
  }

  function addedEnhance2({ formData }) {
    formData.append("cartData", JSON.stringify($cart));
    formData.append("userId", $authedUser?.id);
    return async ({ result }) => {
      console.log("result", result);
    };
  }

  function mergeEnhance() {
    return async ({ result }) => {
      if (result?.data?.status === 200) {
        cart.set(result?.data?.body?.cartData);
        browser
          ? localStorage.setItem(
              "totalComps",
              result?.cartData?.length,
            )
          : "0";
        $cartTotalComps = result?.cartData?.length;
        localStorage.setItem("cart", []);
        toast.success("Guest Cart Items Merged successfully!");
      } else {
      }

      showMergeModal = false;
    };
  }

  function mergeCart() {
    console.log("guestComps", guestComps);
    form3.requestSubmit();
  }

  const deleteOne = (id) => {
    let filtered = $cart.filter((x) => x._id !== id);
    cart.set(filtered);
    browser ? localStorage.setItem("totalComps", filtered.length) : "0";
    $cartTotalComps = filtered.length;
    toast.success("Product successfully removed from Cart!");
    if (!$authedUser?.id) {
      browser ? localStorage.setItem("cart", JSON.stringify(filtered)) : "";
    } else {
      debouncedSubmit();
    }
  };

  let qtyTimeouts = {};

  function handleQtyChange(id, newQty) {
    // Clear existing timeout for this item
    if (qtyTimeouts[id]) {
      clearTimeout(qtyTimeouts[id]);
    }

    // Allow empty input temporarily
    if (newQty === "" || newQty === null || newQty === undefined) {
      // Set a timeout to restore to 1 if input remains empty
      qtyTimeouts[id] = setTimeout(() => {
        cart.update((crt) => {
          const updated = crt.map((c) => {
            if (c._id === id) {
              c.qty = 1;
            }
            return c;
          });
          if (!$authedUser?.id) {
            if (browser) saveToLocalStorage(updated);
          } else {
            debouncedSubmit();
          }
          return updated;
        });
        delete qtyTimeouts[id];
      }, 2000); // 2 second delay
      return;
    }

    const parsedQty = parseInt(newQty);

    // If parsing fails or value is less than 1, set timeout to fix it
    if (isNaN(parsedQty) || parsedQty < 1) {
      qtyTimeouts[id] = setTimeout(() => {
        cart.update((crt) => {
          const updated = crt.map((c) => {
            if (c._id === id) {
              c.qty = 1;
            }
            return c;
          });
          if (!$authedUser?.id) {
            if (browser) saveToLocalStorage(updated);
          } else {
            debouncedSubmit();
          }
          return updated;
        });
        delete qtyTimeouts[id];
      }, 2000); // 2 second delay
      return;
    }

    // Valid quantity, apply it immediately
    const validQty = Math.min(parsedQty, MAX_QUANTITY);

    cart.update((crt) => {
      const updated = crt.map((c) => {
        if (c._id === id) {
          c.qty = validQty;
        }
        return c;
      });
      if (!$authedUser?.id) {
        if (browser) saveToLocalStorage(updated);
      } else {
        debouncedSubmit();
      }
      return updated;
    });
  }

  function handleCheckout() {
    if (!$authedUser?.id) {
      loginModal = true;
    } else {
      goto("/checkout");
    }
  }
</script>

<form
  action="?/getGuestComps"
  method="post"
  bind:this={form}
  use:enhance={addedEnhance}
>
  <input type="hidden" name="guestComps" value={JSON.stringify(guestComps)} />
</form>

<form
  action="?/updateCartData"
  method="post"
  bind:this={form2}
  use:enhance={addedEnhance2}
></form>

<form
  action="?/mergeGuestComps"
  method="post"
  bind:this={form3}
  use:enhance={mergeEnhance}
>
  <input type="hidden" name="userId" value={$authedUser?.id} />
  <input type="hidden" name="guestComps" value={JSON.stringify(guestComps)} />
</form>

{#if !$cart?.length}
  <CartEmpty />
{:else}
  <div class="max-w-5xl mx-auto px-4 py-6 shadow-sm bg-white my-6">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-2xl font-bold text-gray-900">Cart Items</h2>
    </div>
    <div
      class="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-500 h-0.5 mb-5"
    ></div>
    <div class="space-y-6 p-4 max-w-7xl mx-auto">
      {#each $cart as item}
        <div
          class="bg-white relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary-300 group"
        >
          <!-- Delete Button -->
          <button
            on:click={() => deleteOne(item._id)}
            class="absolute right-2 top-2 sm:right-4 sm:top-4 z-20 p-2 hover:bg-red-50 rounded-full transition-all duration-300 opacity-70 hover:opacity-100"
            aria-label="Remove item from cart"
          >
            <Icon
              icon="mdi:trash-can-outline"
              class="text-red-500 hover:text-red-600 text-lg sm:text-xl transition-colors duration-300"
            />
          </button>

          <div class="p-4 sm:p-6">
            <div class="block lg:hidden space-y-4">
              <div class="flex justify-center">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  on:click={() => imagePopup(item.image)}
                  class="relative cursor-pointer bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md border border-gray-100 overflow-hidden group/image"
                >
                  <div
                    class="absolute inset-0 bg-primary-500/5 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                  ></div>

                  <div
                    class="relative p-3 h-24 w-24 sm:h-32 sm:w-32 flex items-center justify-center"
                  >
                    <img
                      class="max-w-full max-h-full object-contain transition-transform duration-300 group-hover/image:scale-110"
                      src="{PUBLIC_COMPBUY_IMAGE_PATH}/{item.image}"
                      alt={item?.name}
                      onerror="this.src='/farm.jpg'"
                    />
                  </div>

                  <div
                    class="absolute bottom-1 right-1 bg-white/80 rounded-full p-1 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                  >
                    <Icon
                      icon="mdi:magnify-plus"
                      class="text-primary-600 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div class="text-center space-y-3 pr-8">
                <h3 class="text-primary-700 font-bold text-sm sm:text-base transition-colors duration-300 leading-tight">
                  {item?.name}
                </h3>

                <div class="space-y-2">
                  <p class="font-semibold text-gray-800 text-sm">
                    {item?.category?.name || 'Category'}
                  </p>
                  <p
                    class="text-gray-600 font-medium text-xs bg-gray-50 inline-block px-2 py-1 rounded-full"
                  >
                    {item?.subcategory?.name || 'Subcategory'}
                  </p>
                </div>
              </div>
              <div
                class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100"
              >
                <div class="text-center sm:text-left">
                  <p class="text-gray-600 text-xs font-medium mb-1">
                    Total Price
                  </p>
                  <p class="text-xl sm:text-2xl font-bold text-primary-700">
                    ₹{((item?.price || 0) * (parseInt(item.qty) || 1)).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    ₹{(item?.price || 0).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })} per unit
                  </p>
                </div>

                <!-- Quantity Controls - Mobile -->
                <div class="flex flex-col items-center gap-2">
                  <p class="text-xs text-gray-500 font-medium">Quantity</p>
                  <div
                    class="flex items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <button
                      on:click={() => decrement(item._id)}
                      class="px-3 py-2 text-gray-600 hover:bg-primary-100 hover:text-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={parseInt(item.qty) <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Icon icon="mdi:minus" class="text-sm" />
                    </button>

                    <input
                      type="text"
                      class="w-20 text-center py-2 text-sm font-semibold bg-transparent border-none focus:outline-none"
                      bind:value={item.qty}
                      on:input={(e) =>
                        handleQtyChange(item._id, +e.target.value)}
                    />

                    <button
                      on:click={() => increment(item._id)}
                      class="px-3 py-2 text-gray-600 hover:bg-primary-100 hover:text-primary-700 transition-all duration-300"
                      aria-label="Increase quantity"
                    >
                      <Icon icon="mdi:plus" class="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop Layout (Side by Side) -->
            <div class="hidden lg:flex gap-6 items-center">
              <!-- Image Section - Desktop -->
              <div class="flex-shrink-0">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  on:click={() => imagePopup(item.image)}
                  class="relative cursor-pointer bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md border border-gray-100 overflow-hidden group/image"
                >
                  <div
                    class="absolute inset-0 bg-primary-500/5 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                  ></div>

                  <div
                    class="relative p-4 h-36 w-36 xl:h-44 xl:w-44 flex items-center justify-center"
                  >
                    <img
                      class="max-w-full max-h-full object-contain transition-transform duration-300 group-hover/image:scale-110"
                      src="{PUBLIC_COMPBUY_IMAGE_PATH}/{item.image}"
                      alt={item?.name}
                      onerror="this.src='/farm.jpg'"
                    />
                  </div>

                  <div
                    class="absolute bottom-2 right-2 bg-white/80 rounded-full p-1.5 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                  >
                    <Icon
                      icon="mdi:magnify-plus"
                      class="text-primary-600 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div class="flex-1 min-w-0 pr-8">
                <h3 class="text-primary-700 font-bold text-lg xl:text-xl transition-colors duration-300 leading-tight mb-3">
                  {item?.name}
                </h3>

                <div class="space-y-2">
                  <p class="font-semibold text-gray-800 text-base">
                    {item?.category?.name || 'Category'}
                  </p>
                  <p
                    class="text-gray-600 font-medium text-sm bg-gray-50 inline-block px-3 py-1 rounded-full"
                  >
                    {item?.subcategory?.name || 'Subcategory'}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-8 flex-shrink-0">
                <div class="text-right">
                  <p class="text-gray-600 text-sm font-medium mb-1">
                    Total Price
                  </p>
                  <p class="text-base font-semibold text-primary-700">
                    ₹ {((item?.price || 0) * (parseInt(item.qty) || 1)).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    ₹ {(item?.price || 0).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })} each
                  </p>
                </div>

                <!-- Quantity Controls - Desktop -->
                <div class="flex flex-col items-center gap-2">
                  <p class="text-sm font-medium text-gray-600">Quantity</p>
                  <div
                    class="flex p-1 items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <button
                      on:click={() => decrement(item._id)}
                      class="px-3 py-1 text-gray-700 hover:bg-primary-100 disabled:cursor-not-allowed"
                      disabled={parseInt(item.qty) <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Icon icon="mdi:minus" class="text-lg" />
                    </button>

                    <input
                      type="text"
                      class="w-20 text-center py-2 text-sm font-semibold bg-transparent border-none focus:outline-none"
                      bind:value={item.qty}
                      on:input={(e) =>
                        handleQtyChange(item._id, +e.target.value)}
                    />

                    <button
                      on:click={() => increment(item._id)}
                      class="px-3 py-1 text-gray-700 hover:bg-primary-100"
                      aria-label="Increase quantity"
                    >
                      <Icon icon="mdi:plus" class="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="h-1 bg-gradient-to-r from-primary-500 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
          ></div>
        </div>
      {/each}
    </div>
    <div class="mt-4 border-t p-2">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="text-center sm:text-right">
          <div class="text-sm text-gray-500 mb-1">
            Total Items: {$cart.length}
          </div>
          <div class="text-xl font-bold text-primary-700">
            Total Price: ₹{totalPrice.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
        <button
          class="text-center py-2 bg-primary-500 text-white rounded mt-4 px-6"
          on:click={handleCheckout}>Checkout</button
        >
      </div>
    </div>
  </div>
{/if}

{#if isImgPopup}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    on:click={(e) => {
      if (e.target === e.currentTarget) {
        isImgPopup = false;
      }
    }}
    class="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
  >
    <div
      class="bg-white p-6 rounded flex flex-col shadow-lg w-11/12 sm:w-2/4 lg:w-2/5 2xl:w-2/6 space-y-2"
    >
      <button
        class=" self-end"
        on:click={(e) => {
          isImgPopup = false;
        }}
      >
        <Icon
          icon="si:close-duotone"
          class="text-3xl hover:bg-gray-100 rounded text-red-600 transition-all duration-300"
        />
      </button>
      <img
        src="{PUBLIC_COMPBUY_IMAGE_PATH}/{imgUrl}"
        class="w-56 h-56 md:w-96 md:h-96 object-cover mx-auto"
        alt="img"
        onerror="this.src='/farm.jpg'"
      />
    </div>
  </div>
{/if}

{#if showMergeModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex justify-center items-center bg-gray-800/30 backdrop-blur-sm z-50"
    on:click={(e) => {
      if (e.target === e.currentTarget) closeMergeModal();
    }}
  >
    <div class="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
      <h2 class="text-lg font-bold mb-4">Merge Guest Cart?</h2>
      <p class="mb-6">
        You have items in your guest cart. Do you want to add them to your
        current cart?
      </p>

      <input type="hidden" name="userId" value={$authedUser?.id} />

      <div class="flex justify-between mt-2">
        <button
          type="button"
          class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          on:click={removeMergeModal}
        >
          No, discard
        </button>

        <button
          type="submit"
          class="bg-primary-400 hover:bg-primary-500 text-white px-4 py-2 rounded"
          on:click={mergeCart}
        >
          Yes, merge
        </button>
      </div>
    </div>
  </div>
{/if}

{#if loginModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex justify-center items-center bg-gray-800/30 backdrop-blur-sm z-50"
    on:click={(e) => {
      if (e.target === e.currentTarget) loginModal = false;
    }}
  >
    <div class="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl font-bold mb-4 text-center">Sign in Required</h2>
      <p class="mb-6 text-sm text-gray-700 text-center">
        You need to log in or create an account to proceed with checkout.
      </p>

      <div class="flex justify-between gap-4">
        <button
          type="button"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          on:click={() => goto("/login")}
        >
          Login
        </button>

        <button
          type="button"
          class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          on:click={() => goto("/register")}
        >
          Register
        </button>
      </div>
    </div>
  </div>
{/if}
