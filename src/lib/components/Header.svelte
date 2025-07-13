<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";
  import { cart } from "$lib/utils/cart.js";
  import { slide } from "svelte/transition";
  import { enhance } from "$app/forms";
 import { browser } from "$app/environment";
  export let brandName = "Components2webs";
  export let data;
 import { cartTotalComps } from "$lib/stores/mainStores.js";
  let form;
     let form2;
  let searchQuery = "";
  let debounceTimeout;
  let searchResults = [];
  let mobileMenuOpen = false;
  let isScrolled = false;
  let showUserOptions = false;
  let dropdown;
  let loading = false;
  let searchDropdownRef;
  let showSearchDropdown = false;
  let mobileSearchDropdownRef; // Add this for mobile search

  $: authedUser = data?.authedUser || null;
  $: userProfile = data?.profile || null;
  $: userName = authedUser?.username || authedUser?.email || "";
  $: userFirstName = userProfile?.firstName || "";
  $: userProfileImg = userProfile?.profilePicture || "";
  $: userEmail = userProfile?.email || "";
  $: isLoggedIn = !!authedUser?.id;

  const navItems = [
    { name: "Product", href: "/products" },
    { name: "Contact Us", href: "/contact" },
    { name: "About Us", href: "/about" },
    { name: "View Quotes", href: "/quotes" },
  ];

  function handleError() {
    displayProfile = "";
  }

  onMount(async () => {
    	try {
			syncLocalStorageToStore();
			const existingExpiration = localStorage.getItem('cartExpiration');

			if (!existingExpiration) {
        // console.log("in if condition");
        
				if (!authedUser?.id) {
				  let cart =
        browser && localStorage.getItem("cart")
          ? JSON.parse(localStorage.getItem("cart"))
          : [];
          //  console.log("cart",cart);
				} else {
					await submitCartForm();
				}
				const expirationTime = new Date();
				expirationTime.setHours(expirationTime.getHours() + 6);
				localStorage.setItem('cartExpiration', expirationTime.toISOString());
			} else {
          // console.log("in else condition");
				const cartExpirationTime = existingExpiration;
				const currentTime = new Date();
				const currenctISo=currentTime.toISOString()
				if (currenctISo > cartExpirationTime) {
					if (!authedUser?.id) {
            let cart =
        browser && localStorage.getItem("cart")
          ? JSON.parse(localStorage.getItem("cart"))
          : [];
          // console.log("cart",cart);
          
      //     localStorage.setItem('totalComps', totalComps);
			// syncLocalStorageToStore();	
					} else {
						await submitCartForm();	
					}
					const newExpirationTime = new Date();
					newExpirationTime.setHours(newExpirationTime.getHours() + 6);
					localStorage.setItem('cartExpiration', newExpirationTime.toISOString());
				}
			}
		} catch (error) {
			console.error('Error handling cart expiration:', error);
		}
    if (displayProfile?.trim()) {
      const img = new Image();
      img.src = displayProfile;
      img.onerror = handleError;
    }
    const handleScroll = () => {
      isScrolled = window.scrollY > 10;
    };

    // Add click outside listener for search dropdown
    const handleGlobalClick = (event) => {
      handleSearchClickOutside(event);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleGlobalClick);
    };
  });

    async function submitCartForm() {
		form2.requestSubmit();
	}
  	function handleCartData() {
		return async ({ result }) => {
      // console.log("result from enhace",result);  
			const totalComps = result?.data?.cartData?.cartItems?.length || 0;
			localStorage.setItem('totalComps', totalComps);
			syncLocalStorageToStore();	
		};
	}


  	function syncLocalStorageToStore() {
    if (typeof window !== 'undefined') {
        const storedTotalComps = localStorage.getItem('totalComps');
        if (storedTotalComps ) {
            cartTotalComps.set(Number(storedTotalComps));
        }
    }
    }


  const toggleMobileMenu = () => {
    mobileMenuOpen = !mobileMenuOpen;
  };

  const getInitial = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  function handleProfile(event) {
    event.stopPropagation();
    showUserOptions = !showUserOptions;

    if (showUserOptions) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }
  }

  function handleClickOutside(event) {
    if (dropdown && !dropdown.contains(event.target)) {
      showUserOptions = false;
      window.removeEventListener("click", handleClickOutside);
    }
  }

  function navigateTo(url) {
    goto(url);
    mobileMenuOpen = false;
    showUserOptions = false;
  }

  function handleLogout() {
    localStorage.clear();
    navigateTo("/logout");
  }

  let suggestionsRef;

  let focusedIndex = -1;

  function handleSearchSubmit() {
    form.requestSubmit();
  }

  function debounce(func, delay) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      func();
    }, delay);
  }
  let resultdata = [];
  function handleData() {
    return async ({ result }) => {
      console.log(result,"result");
      
      if (result) {
        loading = false;
      }
      resultdata = result?.data?.searchResults;
      searchResults = resultdata;
      console.log(resultdata, "resultdata");
    };
  }
  const clearSearchState = () => {
    searchQuery = "";
    searchResults = [];
    loading = false;
    focusedIndex = -1; // Reset focused index as well
    showSearchDropdown = false;
  };
  const handleSearchButtonClick = () => {
    if (searchQuery.trim()) {
      const cleanedSearchQuery = searchQuery.replace(/[^\w\s\-]/g, "");
      const searchQueryUpperCase = cleanedSearchQuery.toUpperCase();
      if (searchQueryUpperCase.trim() !== "") {
        clearSearchState();
        goto(`/search?query=${searchQueryUpperCase}`);
      }
    }
  };

  function closeSuggestions() {
    searchQuery = "";
    searchResults = [];
    showSuggestions = false;
  }

  const handleKeyDown = (e) => {
    if (!searchResults || (searchResults.length === 0 && e.key !== "Enter"))
      return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusedIndex = (focusedIndex + 1) % searchResults.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusedIndex =
        (focusedIndex - 1 + searchResults.length) % searchResults.length;
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (
        focusedIndex >= 0 &&
        focusedIndex < searchResults.length &&
        searchResults.length >= 0
      ) {
        handleSearchButtonClick();
        selectProduct(searchResults[focusedIndex]);
      } else {
        handleSearchButtonClick();
      }
    } else if (e.key === "Escape") {
      showSearchDropdown = false;
    }
  };

  function handleInput(event) {
    searchQuery = event.target.value;
    if (searchQuery.length === 0) {
      searchResults = [];
      focusedIndex = -1;
      showSearchDropdown = false;
    } else {
      showSearchDropdown = true;
    }
    if (searchQuery.length >= 3) {
      loading = true;
      debounce(handleSearchSubmit, 300);
    }
  }

  // Fixed function - now properly checks both desktop and mobile search containers
  function handleSearchClickOutside(event) {
    const isDesktopSearch =
      searchDropdownRef && searchDropdownRef.contains(event.target);
    const isMobileSearch =
      mobileSearchDropdownRef && mobileSearchDropdownRef.contains(event.target);

    // If click is outside both search containers, close dropdown and clear search
    if (!isDesktopSearch && !isMobileSearch) {
      showSearchDropdown = false;
      clearSearchState(); // This will clear the search query and results
    }
  }

  function selectProduct(product) {
    clearSearchState();
    const url = `/products/${product?.category?.url}/${product?.subcategory?.url}/${product?.product_number}`;
    goto(url);
  }

  // Add function to handle search input focus
  function handleSearchFocus() {
    if (searchQuery.trim()) {
      showSearchDropdown = true;
    }
  }

  $: displayName = userFirstName || userName || "User";
  $: displayProfile = userProfileImg;
  $: displayEmail = userEmail;
</script>

<form method="POST" action="/?/getCartValue" bind:this={form2} use:enhance={handleCartData}>
	<input type="hidden" name="loggedInUser" value={authedUser?.id} />
</form>

<header
  class="w-full bg-white shadow-sm transition-all duration-300 {isScrolled
    ? 'shadow-md'
    : ''}"
>
  <!-- Mobile Menu Overlay -->
  {#if mobileMenuOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => (mobileMenuOpen = false)}
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      role="button"
      tabindex="0"
      aria-label="Close mobile menu"
    ></div>
  {/if}

  <!-- Main Header Content -->
  <div class="max-w-6xl mx-auto sm:px-6 border-b-1">
    <div class="flex items-center justify-between py-4 lg:gap-x-40 md:gap-x-2">
      <!-- Mobile Menu Button (Left on mobile) -->
      <div class="md:hidden">
        <button
          type="button"
          class="rounded-md p-2 inline-flex items-center justify-center text-primary-700 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          aria-expanded="false"
          on:click={toggleMobileMenu}
        >
          <span class="sr-only">Open menu</span>
          <Icon icon="material-symbols:menu-rounded" width="24" height="24" />
        </button>
      </div>

      <!-- Brand Logo (Left on desktop, Center on mobile) -->
      <div class="flex-shrink-0">
        <a href="/" class="flex items-center">
          <span
            class="md:text-2xl text-xl font-black text-primary-600 whitespace-nowrap"
          >
            {brandName}
          </span>
        </a>
      </div>

      <!-- Desktop Navigation & Search -->
      <div
        class="hidden md:flex items-center flex-1 justify-start lg:gap-x-40 md:gap-x-2"
      >
        <!-- Search Bar -->
        <div class="flex-1 max-w-2xl">
          <div class="relative" bind:this={searchDropdownRef}>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <!-- <Icon icon="heroicons:magnifying-glass" class="text-gray-400" width="20" height="20" /> -->
              </div>

              <input
                type="text"
                placeholder="Search your components..."
                bind:value={searchQuery}
                name="query"
                maxlength="90"
                on:keydown={handleKeyDown}
                on:input={handleInput}
                on:focus={handleSearchFocus}
                class="block w-full pl-5 pr-12 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />

              <!-- Loading Spinner -->
              <!-- {#if loading}
                <div
                  class="absolute right-12 top-1/2 transform -translate-y-1/2"
                >
                  <Icon
                    icon="ei:spinner"
                    class="w-5 h-5 animate-spin text-primary-600"
                  />
                </div>
              {/if} -->

              <!-- Search Button - Remove duplicate click handlers -->
              <button
                type="button"
                class="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-md transition-colors"
                on:click={handleSearchButtonClick}
              >
                <Icon icon="feather:search" class="w-4 h-4" />
              </button>
            </div>

            <!-- Search Results Dropdown - Updated condition -->
            {#if showSearchDropdown && searchQuery.trim() && searchResults && searchResults.length > 0}
              <ul
                class="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto"
              >
                <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
                {#each searchResults as product, index}
                  <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <li
                    class="px-4 py-3 text-sm text-gray-800 hover:bg-primary-50 cursor-pointer border-b border-gray-100 last:border-b-0 {focusedIndex ===
                    index
                      ? 'bg-primary-100'
                      : ''}"
                    on:click={() => selectProduct(product)}
                    role="button"
                    tabindex="0"
                  >
                    <p class="font-medium text-gray-900">
                      {product?.name}
                    </p>
                    <p class="text-xs text-gray-600">
                      {product?.category?.name || ""}
                    </p>
                  </li>
                {/each}
              </ul>
            {:else if showSearchDropdown && searchQuery.trim() && loading}
              <div
                class="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50 p-4"
              >
                <div class="flex items-center text-sm text-gray-500">
                  <Icon
                    icon="ei:spinner"
                    class="w-5 h-5 animate-spin text-primary-600 mr-2"
                  />
                  <span>Loading Products...</span>
                </div>
              </div>
            {:else if showSearchDropdown && searchQuery.trim().length >= 3 && searchResults && searchResults.length === 0}
              <div
                class="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50 p-4"
              >
                <p class="text-sm text-gray-500">No products found</p>
              </div>
            {/if}
          </div>
        </div>
        <!-- Desktop Auth/Profile Section -->
        <div class="flex items-center space-x-4">
          {#if isLoggedIn}
            <!-- User Profile Dropdown -->
            <div class="relative" bind:this={dropdown}>
             <div class="group inline-flex">
  <button
    class="flex items-center space-x-2 text-primary-600 bg-white group-hover:bg-primary-700 group-hover:text-white px-3 py-2 rounded-lg transition-colors"
    on:click={handleProfile}
  >
    {#if displayProfile && displayProfile.trim() !== ""}
      <!-- svelte-ignore a11y-missing-attribute -->
      <img
        src={displayProfile}
        class="w-8 h-8 rounded-full object-cover"
        on:error={handleError}
      />
    {:else}
      <div
        class="w-8 h-8 flex items-center justify-center bg-primary-600 text-white font-semibold rounded-full text-sm group-hover:bg-white group-hover:text-primary-700 transition-colors"
      >
        {getInitial(displayName)}
      </div>
    {/if}
    <span class="text-sm font-medium hidden lg:block">
      {displayName.slice(0, 15)}
    </span>
    <Icon
      icon={showUserOptions
        ? "heroicons:chevron-up"
        : "heroicons:chevron-down"}
      class="w-4 h-4"
    />
  </button>
</div>

              {#if showUserOptions}
                <div
                  class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 border border-gray-200"
                  transition:slide
                >
                  <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center space-x-1">
                      {#if displayProfile && displayProfile.trim() !== ""}
                        <!-- svelte-ignore a11y-img-redundant-alt -->
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <img
                          src={displayProfile}
                          class="w-12 h-12 rounded-full object-cover"
                          on:error={handleError}
                        />
                      {:else}
                        <div
                          class="w-12 h-12 flex items-center justify-center bg-primary-500 text-white font-semibold rounded-full"
                        >
                          {getInitial(displayName)}
                        </div>
                      {/if}
                      <div class="flex-1 min-w-0">
                        <p
                          class="text-sm font-medium text-primary-500 truncate"
                        >
                          {displayName}
                        </p>
                        <p class="text-xs text-gray-500 truncate">
                          {displayEmail}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="py-2">
                    <a
                      href="/dashboard"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      on:click={() => (showUserOptions = false)}
                    >
                      <Icon icon="carbon:user-profile" class="w-5 h-5 mr-3" />
                      My Profile
                    </a>
                    <button
                      on:click={handleLogout}
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <Icon icon="solar:login-2-outline" class="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <!-- Login/Register Links -->
            <div class="flex items-center space-x-4 text-primary-600">
              <a
                href="/signin"
                class="text-sm font-medium hover:text-primary-800 transition-colors"
                >Login</a
              >
              <span class="text-primary-600">|</span>
              <a
                href="/signup"
                class="text-sm font-medium hover:text-primary-800 transition-colors"
                >Register</a
              >
            </div>
          {/if}

          <!-- Cart Button Desktop -->
          <div class="relative">
            <button
              class="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-colors"
              on:click={() => goto("/cart")}
            >
              <Icon
                icon="eva:shopping-cart-fill"
                width="25"
                height="25"
                class="text-primary-600 hover:text-primary-800"
              />
            </button>
            {#if $cartTotalComps > 0}
              <span
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
              >
                {$cartTotalComps}
              </span>
            {/if}
          </div>
        </div>
      </div>

      <!-- Mobile Right Section -->
      <div class="md:hidden flex items-center">
        {#if isLoggedIn}
          <!-- Mobile Profile Button -->
          <div class="relative" bind:this={dropdown}>
            <button
              class="flex items-center justify-center"
              on:click={handleProfile}
            >
              {#if displayProfile && displayProfile.trim() !== ""}
                <img
                  src={displayProfile}
                  alt="Profile"
                  class="w-8 h-8 rounded-full object-cover"
                  on:error={handleError}
                />
              {:else}
                <div
                  class="md:w-8 md:h-8 h-6 w-6 flex items-center justify-center bg-primary-600 text-white font-semibold rounded-full text-sm"
                >
                  {getInitial(displayName)}
                </div>
              {/if}
            </button>

            {#if showUserOptions}
              <div
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-200"
                transition:slide
              >
                <div class="p-4 border-b border-gray-200">
                  <div class="flex items-center space-x-3">
                    {#if displayProfile && displayProfile.trim() !== ""}
                      <img
                        src={displayProfile}
                        alt="Profile"
                        class="w-10 h-10 rounded-full object-cover"
                        on:error={handleError}
                      />
                    {:else}
                      <div
                        class="w-10 h-10 flex items-center justify-center bg-primary-500 text-white font-semibold rounded-full"
                      >
                        {getInitial(displayName)}
                      </div>
                    {/if}
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {displayName}
                      </p>
                      <p class="text-xs text-gray-500 truncate">
                        {displayEmail}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="py-2">
                  <a
                    href="/dashboard"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    on:click={() => (showUserOptions = false)}
                  >
                    <Icon icon="carbon:user-profile" class="w-5 h-5 mr-3" />
                    My Profile
                  </a>
                  <button
                    on:click={handleLogout}
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <Icon icon="solar:login-2-outline" class="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {:else}
          <!-- Mobile Login Button -->
          <div class="relative" bind:this={dropdown}>
            <button
              class="p-1 rounded-full text-primary-700 hover:bg-primary-700 hover:text-white"
              on:click={handleProfile}
            >
              <Icon icon="heroicons:user-circle-16-solid" class="w-6 h-6" />
            </button>

            {#if showUserOptions}
              <div
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200"
                transition:slide
              >
                <div class="py-2">
                  <a
                    href="/signin"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    on:click={() => (showUserOptions = false)}
                  >
                    <Icon icon="streamline:login-1" class="w-5 h-5 mr-3" />
                    Login
                  </a>
                  <a
                    href="/signup"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    on:click={() => (showUserOptions = false)}
                  >
                    <Icon icon="mdi:register-outline" class="w-5 h-5 mr-3" />
                    Register
                  </a>
                </div>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Mobile Cart -->
        <div class="relative">
          <button
            class=" ml-2 mt-0.5 p-1 text-primary-700 hover:bg-primary-700 hover:text-white rounded-full"
            on:click={() => goto("/cart")}
          >
            <Icon icon="eva:shopping-cart-fill" class="w-5 h-5" />
          </button>
          {#if $cartTotalComps > 0}
            <span
              class="absolute -top-0 -right-0 bg-red-500 text-white text-xs font-bold px-1 py-0.2 rounded-full min-w-[15px] text-center"
            >
              {$cartTotalComps}
            </span>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Search Bar -->
  <div class="md:hidden px-4 mt-2 pb-4">
    <div class="relative" bind:this={mobileSearchDropdownRef}>
      <form
        action="/?/search"
        method="post"
        bind:this={form}
        use:enhance={handleData}
      >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <!-- <Icon icon="heroicons:magnifying-glass" class="text-gray-400" width="20" height="20" /> -->
          </div>

          <input
            type="text"
            placeholder="Search your products..."
            bind:value={searchQuery}
            name="query"
            maxlength="90"
            on:keydown={handleKeyDown}
            on:input={handleInput}
            on:focus={handleSearchFocus}
            class="block w-full pl-5 pr-12 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />

          <!-- {#if loading}
            <div class="absolute right-12 top-1/2 transform -translate-y-1/2">
              <Icon
                icon="ei:spinner"
                class="w-5 h-5 animate-spin text-primary-600"
              />
            </div>
          {/if} -->

          <!-- Remove duplicate click handler -->
          <button
            type="button"
            class="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-md transition-colors"
            on:click={handleSearchButtonClick}
          >
            <Icon icon="feather:search" class="w-4 h-4" />
          </button>
        </div>

        <!-- Mobile Search Results - Updated condition -->
        {#if showSearchDropdown && searchQuery.trim() && searchResults && searchResults.length > 0}
          <ul
            class="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto"
          >
            <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
            {#each searchResults as product, index}
              <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <li
                class="px-4 py-3 text-sm text-gray-800 hover:bg-primary-50 cursor-pointer border-b border-gray-100 last:border-b-0 {focusedIndex ===
                index
                  ? 'bg-primary-100'
                  : ''}"
                on:click={() => selectProduct(product)}
                role="button"
                tabindex="0"
              >
                <p class="font-medium text-gray-900">{product?.name}</p>
                <p class="text-xs text-gray-600">
                  {product?.category?.name || ""}
                </p>
              </li>
            {/each}
          </ul>
        {:else if showSearchDropdown && searchQuery.trim() && loading}
          <div
            class="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50 p-4"
          >
            <div class="flex items-center text-sm text-gray-500">
              <Icon
                icon="ei:spinner"
                class="w-5 h-5 animate-spin text-primary-600 mr-2"
              />
              <span>Loading Products...</span>
            </div>
          </div>
        {:else if showSearchDropdown && searchQuery.trim().length >= 3 && searchResults && searchResults.length === 0}
          <div
            class="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50 p-4"
          >
            <p class="text-sm text-gray-500">No products found</p>
          </div>
        {/if}
      </form>
    </div>
  </div>

  <!-- Navigation Links -->
  <div class="w-full bg-white">
    <div class="max-w-6xl mx-auto px-5">
      <nav class="hidden md:flex space-x-8 py-2 overflow-x-auto hide-scrollbar">
        {#each navItems as item}
          <a
            href={item.href}
            class="text-base font-medium text-gray-600 hover:text-primary-700 border-b-2 border-transparent hover:border-primary-500 transition-all duration-200 whitespace-nowrap py-1 {$page
              .url.pathname === item.href
              ? 'text-primary-700 border-primary-500 font-semibold'
              : ''}"
          >
            {item.name}
          </a>
        {/each}
      </nav>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if mobileMenuOpen}
    <div
      class="fixed top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50"
    >
      <div
        class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white"
      >
        <div class="bg-primary-700 rounded-lg p-5" transition:slide>
          <!-- Mobile Menu Header -->
          <div class="flex items-center justify-between mb-6">
            <span class="text-xl font-bold text-white">{brandName}</span>
            <button
              type="button"
              class="rounded-md p-2 inline-flex items-center justify-center text-white hover:bg-primary-600 focus:outline-none"
              on:click={toggleMobileMenu}
            >
              <span class="sr-only">Close menu</span>
              <Icon icon="heroicons:x-mark" width="24" height="24" />
            </button>
          </div>

          <!-- User Info (if logged in) -->
          {#if isLoggedIn}
            <div
              class="flex items-center justify-between p-3 bg-primary-600 rounded-lg mb-4"
            >
              <div class="flex items-center">
                {#if displayProfile && displayProfile.trim() !== ""}
                  <img
                    src={displayProfile}
                    alt="Profile"
                    class="w-10 h-10 rounded-full object-cover"
                    on:error={handleError}
                  />
                {:else}
                  <div
                    class="w-10 h-10 sm:mr-10 mr-1 flex items-center justify-center bg-primary-500 text-white font-semibold rounded-full"
                  >
                    {getInitial(displayName)}
                  </div>
                {/if}
                <div>
                  <p class="text-sm  sm:ml-5 ml-0 font-medium text-white">{displayName}</p>
                  <p class="text-xs text-primary-200">Logged in</p>
                </div>
              </div>
            </div>
          {/if}

          <!-- Navigation Items -->
          <div class="space-y-2">
            {#each navItems as item}
              <a
                href={item.href}
                class="block w-full px-4 py-3 text-sm text-white font-medium hover:bg-primary-600 rounded-lg transition-colors text-left"
                on:click={() => (mobileMenuOpen = false)}
              >
                {item.name}
              </a>
            {/each}

            {#if isLoggedIn}
              <a
                href="/dashboard"
                class="block w-full px-4 py-3 text-sm text-white font-medium hover:bg-primary-600 rounded-lg transition-colors text-left"
                on:click={() => (mobileMenuOpen = false)}
              >
                My Profile
              </a>
              <button
                on:click={handleLogout}
                class="block w-full px-4 py-3 text-sm text-white font-medium hover:bg-primary-600 rounded-lg transition-colors text-left"
              >
                Logout
              </button>
              <!-- {:else}
              <a
                href="/login"
                class="block w-full px-4 py-3 text-sm text-white font-medium hover:bg-primary-600 rounded-lg transition-colors text-left"
                on:click={() => (mobileMenuOpen = false)}
              >
                Login
              </a>
              <a
                href="/register"
                class="block w-full px-4 py-3 text-sm text-white font-medium hover:bg-primary-600 rounded-lg transition-colors text-left"
                on:click={() => (mobileMenuOpen = false)}
              >
                Register
              </a> -->
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</header>

<style>
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
