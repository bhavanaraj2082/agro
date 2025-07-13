<script>
    import { PUBLIC_COMPBUY_IMAGE_PATH } from "$env/static/public";
    import { authedUser, cartTotalComps } from "$lib/stores/mainStores.js";
    import {
        billingAddress,
        shipmentAddress,
    } from "$lib/stores/checkoutStore.js";
    import { tick } from "svelte";
    import { browser } from "$app/environment";
    import { cart } from "$lib/utils/cart.js";
    import { enhance } from "$app/forms";
    import CartEmpty from "./CartEmpty.svelte";
    import { onMount } from "svelte";
    import Icon from "@iconify/svelte";
    import { toast, Toaster } from "svelte-sonner";
    import { goto } from "$app/navigation";
    import AddressBlock from "./AddressBlock.svelte";
    import { taxError, phoneError, taxNumber, phoneNumber } from "$lib/stores/mainStores.js";
    
    export let data;
    console.log(data, "data");
   
    $: profile = data?.profile || {};
    
    let imgUrl = "";
    let isImgPopup = false;
    let guestComps = [];
    let showMergeModal = false;
    let loginModal = false;
    
    // Debug statements
    $: console.log("Cart store length:", $cart?.length);
    $: console.log("Cart store contents:", $cart);
    $: console.log("Raw cart data:", data?.cartData);
    $: console.log("Cart total comps:", $cartTotalComps);
    
$: if (data?.cartData && Array.isArray(data.cartData) && data.cartData.length > 0) {
    const processedCart = data.cartData.map((item) => {
        const unitPrice = getPriceFromBreaks(
            item?.stock?.pricing,
            item.qty,
        );
        return { ...item, unitPrice };
    });
    
    // Always update the cart when data changes
    cart.set(processedCart);
    cartTotalComps.set(processedCart.length);
    console.log("Cart updated via reactive statement:", processedCart);
} else if (data?.cartData && Array.isArray(data.cartData) && data.cartData.length === 0) {
    // Handle empty cart case
    cart.set([]);
    cartTotalComps.set(0);
    console.log("Cart cleared - empty data");
}
    
    // Safe check for profile mobile number
    $: if (profile?.mobileNr) {
        phoneNumber.set(profile.mobileNr);
    }
    
    function imagePopup(img) {
        imgUrl = img;
        isImgPopup = true;
    }
    
    const scrollToTop = () => {
        if (browser) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
function refreshCart() {
    console.log("Raw data.cartData:", data?.cartData);
    console.log("Current cart store:", $cart);
    
    // Force clear first
    cart.set([]);
    cartTotalComps.set(0);
    
    if (data?.cartData && Array.isArray(data.cartData) && data.cartData.length > 0) {
        const processedCart = data.cartData.map((item) => {
            const unitPrice = getPriceFromBreaks(
                item?.stock?.pricing,
                item.qty,
            );
            return { ...item, unitPrice };
        });
        cart.set(processedCart);
        cartTotalComps.set(processedCart.length);
        console.log("Cart manually refreshed:", processedCart);
    } else {
        console.log("No data to refresh cart with");
    }
}

    
onMount(() => {
    console.log("onMount called with data:", data);
    
    // Force reset cart store first
    cart.set([]);
    cartTotalComps.set(0);
    
    // Then initialize with fresh data
    const cartData = data?.cartData;
    console.log("cartData in onMount:", cartData);
    
    if (Array.isArray(cartData) && cartData.length > 0) {
        const processedCart = cartData.map((item) => {
            const unitPrice = getPriceFromBreaks(
                item?.stock?.pricing,
                item.qty,
            );
            return { ...item, unitPrice };
        });
        
        cart.set(processedCart);
        cartTotalComps.set(processedCart.length);
        console.log("Cart set with processed data:", processedCart);
    } else {
        console.log("No cart data available or empty array");
    }
    
    // Handle guest cart merge only if user is authenticated
    if ($authedUser?.id) {
        try {
            guestComps = browser && localStorage.getItem("cart")
                ? JSON.parse(localStorage.getItem("cart"))
                : [];
        } catch (error) {
            console.error("Error parsing localStorage cart:", error);
            guestComps = [];
        }
        
        if (guestComps.length > 0) {
            showMergeModal = true;
        }
    }
});
    // Safe calculation of total price
    $: totalPrice = $cart.reduce((sum, item) => {
        try {
            const itemPrice = getPriceFromBreaks(item?.stock?.pricing, item.qty);
            return sum + itemPrice * item.qty;
        } catch (error) {
            console.error("Error calculating item price:", error);
            return sum;
        }
    }, 0);
    
    function getPriceFromBreaks(pricing = [], qty = 1) {
        if (!Array.isArray(pricing) || pricing.length === 0) return 0;
        
        try {
            const sorted = pricing.slice().sort((a, b) => a.break - b.break);
            let selectedPrice = sorted[0]?.inr || 0;
            
            for (const tier of sorted) {
                if (qty >= tier.break) {
                    selectedPrice = tier.inr || 0;
                } else {
                    break;
                }
            }
            
            return selectedPrice;
        } catch (error) {
            console.error("Error in getPriceFromBreaks:", error);
            return 0;
        }
    }
    
    function handleCheckout() {
        if (!$authedUser?.id) {
            loginModal = true;
        }
    }
</script>

<Toaster position="bottom-right" richColors />

<!-- Debug button - remove this after fixing -->
{#if data?.cartData && Array.isArray(data.cartData) && data.cartData.length > 0}
    <button 
        class="bg-red-500 text-white px-4 py-2 rounded mb-4"
        on:click={refreshCart}
    >
        Force Refresh Cart (Debug)
    </button>
{/if}

<!-- Image popup modal -->
{#if isImgPopup}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-4 rounded-lg max-w-md max-h-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Product Image</h3>
                <button 
                    class="text-gray-500 hover:text-gray-700"
                    on:click={() => isImgPopup = false}
                >
                    ✕
                </button>
            </div>
            <img src={imgUrl} alt="Product" class="max-w-full max-h-full" />
        </div>
    </div>
{/if}

{#if !$cart?.length}
    <CartEmpty />
{:else}
    <div class="max-w-6xl mx-auto px-4 py-6 shadow-sm bg-white my-6">
        <h2 class="md:text-2xl text-md font-bold border-b pb-3 text-gray-800">
            Checkout
        </h2>
        <div
            class="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-200 h-0.5 mb-5"
        ></div>
        <AddressBlock {profile} />
        <!-- Product Card -->

        <div class=" space-y-3 mt-6">
            {#each $cart as item}
                <div
                    class="bg-white relative p-4 flex border flex-col md:flex-row md:items-center gap-6 transition-all"
                >
                    <div class="w-full md:w-1/3 flex justify-center">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div
                            class="flex items-center justify-center border-1 h-26 w-24 rounded cursor-pointer"
                            on:click={() => imagePopup(item.image)}
                        >
                            <img
                                class="w-24 h-24"
                                src={`${PUBLIC_COMPBUY_IMAGE_PATH}/${item.image}`}
                                alt=""
                                onerror="this.src='/farm.jpg'"
                            />
                        </div>
                    </div>

                    <!-- Info Section -->
                    <div
                        class="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-2"
                    >
                        <a
                            href="/product/{item.manufacturerHref}/{item.partUrl}"
                            class="text-primary-500 font-bold hover:underline"
                            >{item.productName}</a
                        >
                        <p class="font-bold text-sm">
                            {item?.manufacturerName}
                        </p>
                        <p class="text-gray-600 font-semibold text-sm">
                            {item?.subCategory?.name}
                        </p>

                        {#if item.dataSheet}
                            <div class="mt-2">
                                <Icon
                                    icon="vscode-icons:file-type-pdf2"
                                    class="text-3xl hover:bg-gray-100 rounded text-red-600 transition-all duration-300"
                                />
                            </div>
                        {/if}
                    </div>

                    <!-- Action Buttons -->
                    <div
                        class="flex flex-col items-center gap-2 w-full md:w-auto"
                    >
                        <div class="flex flex-col items-start gap-2 mt-4">
                            <div class="lg:w-[250px] w-[160px]">
                                <p class="text-gray-800 text-sm">
                                    Price In
                                    <span
                                        class="font-bold block overflow-hidden text-ellipsis whitespace-nowrap"
                                    >
                                        ₹ {item?.unitPrice?.toLocaleString(
                                            "en-IN",
                                            {
                                                maximumFractionDigits: 2,
                                                minimumFractionDigits: 2,
                                            },
                                        )}
                                    </span>
                                </p>
                                <p>Qty: {item.qty}</p>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        <div class="flex justify-end gap-6">
            <div class="text-right mt-6 text-lg font-semibold text-gray-800">
                Total: ₹ {totalPrice.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                })}
            </div>
            <form
                action="?/getHash"
                method="post"
                use:enhance={({ formData, cancel }) => {
                    // Check if "N/A" is present in billing or shipping address
                    const billing = $billingAddress;
                    const shipping = $shipmentAddress;

                    if (billing.includes("N/A") || shipping.includes("N/A")) {
                        toast.warning(
                            "Please update your Billing and Shipping address before placing the order!",
                        );
                        cancel(); // This prevents the form submission
                        return;
                    }
                    if(!$phoneNumber.length){
                        $phoneError = "Phone number is required"
                        scrollToTop()
                        cancel()
                    }
                    if($taxError.length || $phoneError.length){
                        scrollToTop()
                        cancel()
                    }
                    formData.append("orderdetails", JSON.stringify($cart));
                    formData.append("firstname", data.profile.firstName);
                    formData.append("lastname", data.profile.lastName);
                    formData.append("billingAddress", $billingAddress);
                    formData.append("shipmentAddress", $shipmentAddress);
                    formData.append("phoneNumber", $phoneNumber);
                    formData.append("totalprice", totalPrice);
                    formData.append("taxNumber", $taxNumber);
                    return async ({ result }) => {
                        console.log("result", result);

                        if (result.data) {
                            console.log("jhsadsahdgj");
                            cartTotalComps.set(0);
                            localStorage.setItem("totalComps", 0);
                            goto("checkout/success");
                        } else {
                            goto("checkout/failure");
                        }
                    };
                }}
            >
                <button
                    type="submit"
                    class="text-center py-2 bg-primary-500 text-white rounded mt-4 px-6"
                    >Place Order</button
                >
            </form>
        </div>
    </div>
{/if}