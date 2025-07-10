<script>
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { getCart } from "$lib/utils/cart.js";
  import { browser } from "$app/environment";
  import { toast } from "svelte-sonner";
  import { page } from "$app/stores";
  import { sendMessage } from "$lib/utils.js";
  import { enhance } from "$app/forms";

  // Initialize variables FIRST
  let isLoggedIn = false;
  let userEmail = null;
  let form;
  let quantity = 1;
  export let data;

  import {
    authedUser,
    currencyState,
    cartTotalComps,
  } from "$lib/stores/mainStores.js";

  import { goto, invalidateAll } from "$app/navigation";
  import { addItemToCart, cart, guestCart } from "$lib/stores/cart.js";

  let productData = data; // Changed from data.products to just data
  console.log(productData, "product length");

  // Initialize these variables EARLY
  let specifications = {};
  let selectedValues = {};
  let products = [];
  let count = productData?.productCount;
  console.log(count, "count");

  // Check if productData exists and has products array before mapping
  if (productData && Array.isArray(productData.products)) {
    products = productData.products.map((product) => {
      return {
        ...product,
        quantity: product.quantity || 1,
        totalPrice: product.price,
      };
    });
  }

  // Now safely process specifications after selectedValues is declared
  if (products.length > 0) {
    // Extract all unique properties from all products
    const allProperties = {};

    products.forEach((product) => {
      if (product.properties) {
        Object.entries(product.properties).forEach(([key, value]) => {
          if (!allProperties[key]) {
            allProperties[key] = new Set();
          }
          if (value !== null && value !== undefined && value !== "") {
            allProperties[key].add(String(value));
          }
        });
      }
    });

    // Convert Sets to Arrays for the specifications object
    Object.entries(allProperties).forEach(([key, valueSet]) => {
      if (valueSet.size > 0) {
        specifications[key] = Array.from(valueSet);
      }
    });
  }

  // Default values that won't cause errors if data is missing
  let productCount = products?.length;
  console.log(productCount, "priduct count");

  let subCategoryDetails = productData?.subCategoryDetails || {
    subCatName: "",
    subCatUrlName: "",
    catName: "",
    catUrlName: "",
  };

  let CategoryDetails = productData?.categoryDetails || {
    name: "",
    url: "",
  };
  console.log(CategoryDetails, "CategoryDetails");

  // UI state variables
  let hoveredItem = null;
  let showimage = false;
  let selectedImage = null;
  let toggleFilter = false;
  let showSortByDropdown = false;
  let showMfrDropdown = false;
  let currentPage = 1;
  let itemsPerPage = 5;
  let totalPages = Math.ceil(count / itemsPerPage);
  console.log(totalPages, "totalPages");

  let selectedManufacturer = null;
  let search = null;
  let searchManufacture = [];
  let selectedSort = "";

  let arr = null;
  let showAllForIndex = false;
  let maxItems = 5;
  let searchLoading = false;
  let loading = false;
  let tog = null;

  $: paginatedProducts = products?.length ? products.map((x) => x) : [];

  let categoryName = CategoryDetails?.url;
  let subCategoryName = subCategoryDetails.subCatUrlName;
  let subCatName = subCategoryDetails.subCatName;
  let catName = subCategoryDetails.catName;

  function handleMouseEnter(imageSrc, index) {
    hoveredItem = { imageSrc, index };
  }

  function handleMouseLeave() {
    hoveredItem = null;
  }

  function imagemodal(imageSrc) {
    selectedImage = imageSrc;
    showimage = true;
  }

  function closePopup() {
    showimage = false;
    selectedImage = null;
  }

  function handleQty(id, quantity) {
    if (isNaN(quantity)) {
      quantity = 1;
    }
    quantity = Math.abs(quantity);
    if (quantity > 10000000) quantity = 10000000;
    if (quantity === 0) quantity = 1;

    products = products.map((product) => {
      if (product._id === id) {
        let selectedQty =
          Math.ceil(quantity / (product.orderMultiple || 1)) *
          (product.orderMultiple || 1);

        return {
          ...product,
          quantity: selectedQty,
          totalPrice: product?.price,
        };
      }
      return product;
    });
    tog = null;
  }

  function decrementQuantity(id) {
    products = products.map((product) => {
      if (product._id === id) {
        // Only decrement if quantity is greater than 1
        if (product.quantity > 1) {
          const newQuantity = product.quantity - 1;

          return {
            ...product,
            quantity: newQuantity,
            totalPrice: product.price * newQuantity,
          };
        }
      }
      return product;
    });
  }

  function incrementQuantity(id) {
    products = products.map((product) => {
      if (product._id === id) {
        // Increment the quantity by 1
        const newQuantity = product.quantity + 1;

        return {
          ...product,
          quantity: newQuantity,
          totalPrice: product.price * newQuantity,
        };
      }
      return product;
    });
  }

  // function goToPage(page) {
  //   if (page > 0 && page <= totalPages) {
  //     currentPage = page;
  //   }
  // }

  // function getPageNumbers() {
  //   let pageNumbers = [];
  //   const startPage = Math.max(1, currentPage - 2);
  //   const endPage = Math.min(totalPages, currentPage + 2);

  //   for (let i = startPage; i <= endPage; i++) {
  //     pageNumbers.push(i);
  //   }

  //   return pageNumbers;
  // }

    const goToPage = async (page) => {
    if (page > 0 && page <= totalPages) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('page', page.toString());
        if (selectedManufacturer) {
            newUrl.searchParams.set('manufacturer', selectedManufacturer);
        }
        if(search){
            newUrl.searchParams.set('search', search);
        }
        currentPage = page
        await goto(newUrl.toString());
    }
};
  
  const getPageNumbers = () => {
    let pageNumbers = [];
  
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  // Add pages to the array
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
  };


  function handleSearch(searchName) {
    if (/<\/?script\b[^>]*>/.test(searchName)) return;

    searchLoading = true;
    search = searchName.length >= 3 ? searchName : null;

    if (search) {
      selectedManufacturer = null;
      selectedValues = {};
    }

    filterProducts();
    currentPage = 1;
    searchLoading = false;
  }

  function handlePrice(checked, price) {
    selectedSort = checked ? price : "";
    sortProducts();
    currentPage = 1;
  }

  function handleFilters(num) {
    arr = arr === num ? null : num;
  }

  function handleCheckboxChange(index, value, key, event) {
    if (event.target.checked) {
      if (!selectedValues[key]) {
        selectedValues[key] = [value];
      } else {
        selectedValues[key].push(value);
      }
    } else {
      selectedValues[key] = selectedValues[key].filter(
        (item) => item !== value,
      );
    }

    for (let key in selectedValues) {
      if (
        Array.isArray(selectedValues[key]) &&
        selectedValues[key].length === 0
      ) {
        delete selectedValues[key];
      }
    }

    filterProducts();
    currentPage = 1;
  }

  function handleShowMore() {
    showAllForIndex = !showAllForIndex;
  }

  function filterProducts() {
    if (productData && Array.isArray(productData.products)) {
      products = productData.products.map((product) => {
        return {
          ...product,
          quantity: product.quantity || 1,
          totalPrice: product.price,
        };
      });

      if (selectedManufacturer) {
        products = products.filter(
          (product) =>
            product.manufacturerDetails &&
            product.manufacturerDetails.name === selectedManufacturer,
        );
      }
      if (search) {
        const searchLower = search.toLowerCase();
        products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            (product.product_number &&
              product.product_number.toLowerCase().includes(searchLower)),
        );
      }

      for (const [filterKey, selectedValuesArray] of Object.entries(
        selectedValues,
      )) {
        if (selectedValuesArray && selectedValuesArray.length > 0) {
          products = products.filter((product) => {
            if (product.properties && product.properties[filterKey]) {
              const productValue = String(product.properties[filterKey]);
              return selectedValuesArray.some(
                (selectedValue) =>
                  productValue.toLowerCase() === selectedValue.toLowerCase(),
              );
            }
            return false;
          });
        }
      }

      productCount = products.length;
      totalPages = Math.ceil(count / 5) || 1;
      sortProducts();
    }
  }

  function sortProducts() {
    if (selectedSort === "asc") {
      products = products.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (selectedSort === "desc") {
      products = products.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
  }

  // Toggle quote modal
  let showQuoteModal = false;
  let productQuote = null;

  onMount(() => {
    if (browser) {
      isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      userEmail = isLoggedIn ? localStorage.getItem("userEmail") : null;
    }

    if (productData && Array.isArray(productData.products)) {
      products = productData.products.map((product) => {
        return {
          ...product,
          quantity: product.quantity || 1,
          totalPrice: product.price,
        };
      });

      const allProperties = {};

      products.forEach((product) => {
        if (product.properties) {
          Object.entries(product.properties).forEach(([key, value]) => {
            if (!allProperties[key]) {
              allProperties[key] = new Set();
            }
            if (value !== null && value !== undefined && value !== "") {
              allProperties[key].add(String(value));
            }
          });
        }
      });

      Object.entries(allProperties).forEach(([key, valueSet]) => {
        if (valueSet.size > 0) {
          specifications[key] = Array.from(valueSet);
        }
      });

      console.log("Extracted specifications:", specifications);
    }
  });

  function addToCart(item) {
    let cart =
      browser && localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [];

    let search = cart.find((x) => x.productId === item._id);

    if (search === undefined) {
      // Create new cart item with proper field mapping
      const cartItem = {
        productId: item._id,
        productName: item.name,
        productNumber: item.product_number || "",
        description: item.description || "",
        price: (item.price * 83.5).toFixed(2),
        imageSrc: item.imageSrc || "",
        stockQuantity: item.stockQuantity || 0,
        availableStock: item.availableStock || 0,
        category: item.category || {},
        subcategory: item.subcategory || {},
        quantity: item.quantity || 1,
        proto: item.proto || {},
      };
      cart.push(cartItem);
    } else {
      search.quantity = item.quantity || 1;
    }

    browser ? localStorage.setItem("cart", JSON.stringify(cart)) : "";
    getCart();

    toast.success("Component successfully added to Cart!");

    products = products.map((product) => {
      if (product._id === item._id) {
        return {
          ...product,
          quantity: 1,
          totalPrice: product.price,
        };
      }
      return product;
    });
  }
</script>

<section class="space-y-4 p-4 bg-gray-50 lg:flex items-start gap-6">
  <div class="w-full h-fit sticky top-0 z-20 lg:w-1/4">
    <div
      class="p-4 bg-white shadow-md rounded-lg space-y-3 mt-3 border border-gray-100"
    >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        on:click={() => (toggleFilter = !toggleFilter)}
        class="flex items-center justify-between text-lg font-semibold font-montserrat cursor-pointer"
      >
        <div class="flex gap-2 items-center">
          <Icon icon="ic:sharp-segment" class="text-2xl text-green-600" />
          <h1 class="text-gray-800">Filter</h1>
          <p class="lg:hidden font-normal text-xs text-gray-500">
            <span class="font-semibold text-sm">{productCount}</span> Products
          </p>
          <button
            on:click={() => {
              localStorage.removeItem("specs");
              selectedValues = {};
              selectedSort = "";
              selectedManufacturer = null;
              goto(`/products/${categoryName}/${subCategoryName}`);
            }}
            class="{Object.entries(selectedValues).length > 0 ||
            selectedManufacturer !== null ||
            selectedSort.length
              ? ''
              : 'hidden'} lg:hidden bg-green-600 hover:bg-green-700 text-xs px-2 py-1 rounded-md text-white font-normal transition duration-200"
            >Clear All</button
          >
        </div>
        <Icon
          icon={toggleFilter
            ? "iconamoon:arrow-up-2-duotone"
            : "iconamoon:arrow-down-2-duotone"}
          class="text-3xl p-0.5 rounded-full hover:bg-gray-100 lg:hidden text-gray-600"
        />
      </div>

      <div class="hidden lg:flex justify-between items-center">
        <p class="text-xs text-gray-500">
          <span class="font-semibold text-sm text-gray-700">{productCount}</span
          > Products
        </p>
        <button
          on:click={() => {
            localStorage.removeItem("specs");
            selectedValues = {};
            selectedSort = "";
            selectedManufacturer = null;
            goto(`/products/${categoryName}/${subCategoryName}`);
          }}
          class="{Object.entries(selectedValues).length > 0 ||
          selectedManufacturer !== null ||
          selectedSort.length
            ? ''
            : 'hidden'} bg-green-600 hover:bg-green-700 text-[11px] px-2 py-1 rounded-md text-white font-normal transition duration-200"
          >Clear All</button
        >
      </div>

      <div
        class="max-h-[80vh] overflow-y-auto scroll-smooth pr-1 space-y-3 {toggleFilter
          ? 'block'
          : 'hidden lg:block'}"
      >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          on:click={() => (showSortByDropdown = !showSortByDropdown)}
          class="cursor-pointer font-semibold text-xs flex items-center justify-between p-2 rounded-md border border-gray-300 hover:border-green-500 transition duration-200"
        >
          <span class="ml-1 text-gray-700">Sort By</span>
          <Icon
            icon={showSortByDropdown
              ? "iconamoon:arrow-up-2-duotone"
              : "iconamoon:arrow-down-2-duotone"}
            class="text-2xl text-gray-500"
          />
        </div>
        <div
          class="p-3 border rounded-md {showSortByDropdown
            ? 'block'
            : 'hidden'} bg-white shadow-sm"
        >
          <div class="space-y-3 py-1">
            <label
              for="asc"
              class="cursor-pointer flex items-center gap-2 text-xs font-medium hover:text-green-600 transition duration-200"
            >
              <input
                type="checkbox"
                id="asc"
                on:change={(e) => handlePrice(e.target.checked, "asc")}
                checked={selectedSort === "asc"}
                class="cursor-pointer outline-none rounded text-green-600 focus:ring-1 focus:ring-green-500"
              />
              <p>Price Ascending</p>
            </label>
            <label
              for="desc"
              class="cursor-pointer flex items-center gap-2 text-xs font-medium hover:text-green-600 transition duration-200"
            >
              <input
                type="checkbox"
                id="desc"
                on:change={(e) => handlePrice(e.target.checked, "desc")}
                checked={selectedSort === "desc"}
                class="cursor-pointer outline-none rounded text-green-600 focus:ring-1 focus:ring-green-500"
              />
              <p>Price Descending</p>
            </label>
          </div>
        </div>

        <!-- Specifications Filters -->
        {#if Object.entries(specifications).length > 0}
          <div class="flex flex-col space-y-2">
            {#each Object.entries(specifications).slice(0, showAllForIndex ? Object.entries(specifications).length : maxItems) as [key, values], index}
              <button
                on:click={() => handleFilters(index)}
                class="cursor-pointer w-full font-semibold text-xs flex items-center justify-between p-2 rounded-md border border-gray-300 hover:border-green-500 transition duration-200"
              >
                <div class="ml-1 flex items-center gap-1.5 text-gray-700">
                  {key}
                  {#if selectedValues[key] && selectedValues[key].length > 0}
                    <Icon
                      icon="icomoon-free:checkbox-checked"
                      class="text-sm text-green-600"
                    />
                  {/if}
                </div>
                <Icon
                  icon={arr === index
                    ? "iconamoon:arrow-up-2-duotone"
                    : "iconamoon:arrow-down-2-duotone"}
                  class="text-2xl text-gray-500"
                />
              </button>
              <div
                class="p-3 border rounded-md {arr === index
                  ? 'block'
                  : 'hidden'} bg-white shadow-sm"
              >
                {#each values.sort((a, b) => a.localeCompare(b)) as value}
                  <div class="py-1.5">
                    <label
                      for={value.replaceAll(" ", "-")}
                      class="cursor-pointer flex items-center gap-2 text-xs font-medium hover:text-green-600 transition duration-200"
                    >
                      <input
                        type="checkbox"
                        id={value.replaceAll(" ", "-")}
                        on:change={(e) =>
                          handleCheckboxChange(index, value, key, e)}
                        checked={selectedValues[key] &&
                          selectedValues[key].includes(value)}
                        class="cursor-pointer outline-none rounded text-green-600 focus:ring-1 focus:ring-green-500"
                      />
                      <p>{value}</p>
                    </label>
                  </div>
                {/each}
              </div>
            {/each}
            <button
              on:click={() => handleShowMore()}
              class="text-xs xl:hidden w-full text-right text-green-600 hover:text-green-700 mt-2 font-medium transition duration-200"
            >
              {showAllForIndex ? "- Show Less" : "+ Show More"}
            </button>
          </div>
        {/if}
      </div>

      <!-- Show More/Less Button (Desktop) -->
      <button
        on:click={() => handleShowMore()}
        class="text-xs hidden xl:block w-full text-right text-green-600 hover:text-green-700 mt-2 font-medium transition duration-200"
      >
        {showAllForIndex ? "- Show Less" : "+ Show More"}
      </button>
    </div>
  </div>

  <!-- Product Listing -->
  <div class="w-full h-auto space-y-4 lg:w-3/4">
    {#if paginatedProducts.length === 0}
      <div class="bg-white shadow-md rounded-lg p-12">
        <p class="text-center font-medium text-gray-600">No Products Found</p>
      </div>
    {:else}
      {#each paginatedProducts as product, index}
        <div
          class="relative bg-white shadow-md hover:shadow-lg p-3 sm:p-4 md:px-6 space-y-3 rounded-lg border border-gray-100 transition duration-200"
        >
          <div class="w-full sm:w-10/12">
            <a
              href={`/products/${categoryName}/${subCategoryName}/${product?.productNumber}`}
              class="text-sm sm:text-base font-semibold text-green-600 hover:text-green-700 hover:underline transition duration-200 block"
              >{product?.productName || ""}</a
            >
          </div>

          <!-- Mobile Layout (< 640px) -->
          <div class="block sm:hidden space-y-4">
            <!-- Image Section -->
            <div class="flex justify-center">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <img
                src="/farm.jpg"
                loading="lazy"
                class="cursor-pointer w-24 h-24 xs:w-28 xs:h-28 object-contain rounded-md border border-gray-200 p-2 hover:border-green-300 transition duration-200"
                alt=""
                on:click={() => imagemodal(product?.image)}
                on:mouseenter={() => handleMouseEnter(product?.image, index)}
                on:mouseleave={handleMouseLeave}
              />
            </div>

            <!-- Product Details -->
            <div class="text-xs space-y-2">
              <p class="text-gray-700">
                Product Number: <a
                  href={`/products/${categoryName}/${subCategoryName}/${product?.product_number}`}
                  class="font-semibold hover:text-green-600 hover:underline transition duration-200 break-all"
                  >{product?.product_number || ""}</a
                >
              </p>

              <p class="text-gray-700">
                Product Name: <span class="font-semibold text-gray-800"
                  >{product?.name || "N/A"}</span
                >
              </p>

              <div class="mb-3">
                <span class="text-gray-700">
                  Price:
                  <span class="font-semibold text-green-600 text-sm">
                    ₹{(product.price * 83.5).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </span>
              </div>
            </div>

            <!-- Mobile Quantity and Cart Controls -->
            <div class="flex flex-col space-y-3">
              <!-- Quantity Control -->
              <div class="flex justify-center">
                <input
                  type="number"
                  bind:value={product.quantity}
                  on:input={(e) =>
                    handleQty(product._id, parseInt(e.target.value))}
                  class="{tog === index
                    ? ''
                    : 'hidden'} border border-gray-300 rounded-md outline-none text-xs p-2 font-medium focus:ring-1 focus:border-green-500 focus:ring-green-500 w-20"
                  min="1"
                  max="10000000"
                />

                <div
                  class="{tog === index
                    ? 'hidden'
                    : ''} flex items-center border border-green-400 rounded-md overflow-hidden"
                >
                  <button
                    on:click={() => decrementQuantity(product._id)}
                    class="p-2 disabled:bg-gray-200 disabled:text-gray-400 text-green-600 hover:bg-green-50 transition duration-200"
                    ><Icon icon="rivet-icons:minus" class="text-xs" /></button
                  >

                  <button
                    on:click={async () => {
                      tog = index;
                    }}
                    class="w-10 px-2 py-1.5 text-xs font-medium outline-none text-center text-gray-800 hover:bg-green-50 transition duration-200"
                  >
                    {product.quantity}
                  </button>

                  <button
                    on:click={() => incrementQuantity(product._id)}
                    class="p-2 disabled:bg-gray-200 disabled:text-gray-400 text-green-600 hover:bg-green-50 transition duration-200"
                  >
                    <Icon icon="rivet-icons:plus" class="text-xs" />
                  </button>
                </div>
              </div>

              <!-- Add to Cart Button -->
              <button
                type="button"
                on:click={() => addToCart(product)}
                class="text-xs flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-green-600 text-white bg-green-600 font-medium hover:bg-green-700 hover:border-green-700 rounded-md transition duration-200"
              >
                <Icon icon="mdi:cart" class="text-base" />
                Add to Cart
              </button>
            </div>
          </div>

          <!-- Desktop/Tablet Layout (>= 640px) -->
          <div class="hidden sm:flex items-start gap-4 md:gap-8">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="relative flex-shrink-0">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <img
                src="/farm.jpg"
                loading="lazy"
                class="cursor-pointer w-32 h-32 md:w-40 md:h-40 object-contain rounded-md border border-gray-200 p-2 hover:border-green-300 transition duration-200"
                alt=""
                on:click={() => imagemodal(product?.image)}
                on:mouseenter={() => handleMouseEnter(product?.image, index)}
                on:mouseleave={handleMouseLeave}
              />
            </div>

            <div class="text-xs md:text-sm space-y-2 flex-grow min-w-0">
              <p class="text-gray-700">
                Product Number: <a
                  href={`/products/${categoryName}/${subCategoryName}/${product?.product_number}`}
                  class="font-semibold hover:text-green-600 hover:underline transition duration-200"
                  >{product?.product_number || ""}</a
                >
              </p>

              <p class="text-gray-700">
                Product Name: <span class="font-semibold text-gray-800"
                  >{product?.name || "N/A"}</span
                >
              </p>

              <div class="mb-4">
                <span class="text-gray-700">
                  Price:
                  <span class="font-semibold text-green-600">
                    ₹{(product.price * 83.5).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </span>
              </div>

              <!-- Desktop Quantity Control and Add to Cart -->
              <div
                class="flex flex-col sm:flex-row items-start sm:items-end gap-3 mt-4"
              >
                <div class="flex items-end">
                  <input
                    type="number"
                    bind:value={product.quantity}
                    on:input={(e) =>
                      handleQty(product._id, parseInt(e.target.value))}
                    class="{tog === index
                      ? ''
                      : 'hidden'} border border-gray-300 rounded-md outline-none text-xs p-2 font-medium focus:ring-1 focus:border-green-500 focus:ring-green-500 w-20"
                    min="1"
                    max="10000000"
                  />

                  <div
                    class="{tog === index
                      ? 'hidden'
                      : ''} flex items-center border border-green-400 rounded-md overflow-hidden"
                  >
                    <button
                      on:click={() => decrementQuantity(product._id)}
                      class="p-2.5 disabled:bg-gray-200 disabled:text-gray-400 text-green-600 hover:bg-green-50 transition duration-200"
                      ><Icon icon="rivet-icons:minus" class="text-xs" /></button
                    >

                    <button
                      on:click={async () => {
                        tog = index;
                      }}
                      class="w-12 px-3 py-1.5 text-sm font-medium outline-none text-center text-gray-800 hover:bg-green-50 transition duration-200"
                    >
                      {product.quantity}
                    </button>

                    <button
                      on:click={() => incrementQuantity(product._id)}
                      class="p-2.5 disabled:bg-gray-200 disabled:text-gray-400 text-green-600 hover:bg-green-50 transition duration-200"
                    >
                      <Icon icon="rivet-icons:plus" class="text-xs" />
                    </button>
                  </div>
                </div>

                <!-- Add to Cart Button -->
                <button
                  type="button"
                  on:click={() => addToCart(product)}
                  class="text-xs sm:text-sm flex items-center gap-2 px-4 py-2 sm:py-2 sm:px-5 border border-green-600 text-white bg-green-600 font-medium hover:bg-green-700 hover:border-green-700 rounded-md transition duration-200 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <Icon icon="mdi:cart" class="text-xl" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}

      <div
        class="w-fit gap-1.5 mx-auto {totalPages <= 1 || count <= 5
          ? 'hidden'
          : 'flex'}"
      >
        <button
          class="border shadow-md bg-white border-gray-300 hover:bg-gray-100 rounded-md text-gray-500 disabled:border-gray-200 disabled:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition duration-200"
          on:click={() => goToPage(1)}
          disabled={currentPage == 1}
        >
          <Icon
            icon="charm:chevrons-left"
            class="p-1 sm:p-2 text-2xl sm:text-3xl rounded-md disabled:text-gray-300"
          />
        </button>

        <button
          class="border shadow-md bg-white border-gray-300 hover:bg-gray-100 rounded-md text-gray-500 disabled:border-gray-200 disabled:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition duration-200"
          on:click={() => goToPage(currentPage - 1)}
          disabled={currentPage == 1}
        >
          <Icon
            icon="ic:round-chevron-left"
            class="p-1 sm:p-2 text-2xl sm:text-3xl rounded-md disabled:text-gray-300"
          />
        </button>

        {#each getPageNumbers(currentPage, totalPages) as page}
          <button
            on:click={() => goToPage(page)}
            class="{page === currentPage
              ? 'text-white bg-green-600 border-green-600 hover:bg-green-700'
              : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-700'} border shadow-md rounded-md px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition duration-200"
          >
            {page}
          </button>
        {/each}

        <button
          class="border shadow-md bg-white border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 disabled:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition duration-200"
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage == totalPages}
        >
          <Icon
            icon="charm:chevron-right"
            class="p-1 sm:p-2 text-2xl sm:text-3xl rounded-md disabled:text-gray-300"
          />
        </button>

        <button
          class="border shadow-md bg-white border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 disabled:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition duration-200"
          on:click={() => goToPage(totalPages)}
          disabled={currentPage == totalPages}
        >
          <Icon
            icon="charm:chevrons-right"
            class="p-1 sm:p-2 text-2xl sm:text-3xl rounded-md disabled:text-gray-300"
          />
        </button>
      </div>
    {/if}

    <!-- Pagination -->
  </div>
</section>
