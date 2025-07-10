<script>
    import { authedUser,currencyState,cartTotalComps } from '$lib/stores/mainStores.js';
        import { onMount } from 'svelte';
        import Icon from '@iconify/svelte';
        import Cartrightside from '$lib/components/HeaderDropDownCart/Cartrightside.svelte';//
        import menusdata from '$lib/data/chemicalProducts.json';//
        import { enhance } from '$app/forms';
        import { goto,invalidate } from '$app/navigation';
        import { slide, fade } from 'svelte/transition';
        import { toast, Toaster } from 'svelte-sonner';	
        import { guestCart } from '$lib/stores/cart.js';//
        import { page } from '$app/stores';//
        export let data;
        // console.log(data,"data");
        let fullyReg='';
    
        if (data?.profile?.firstName) {
        fullyReg=true;
        // console.log(fullyReg);
    
    
    } else {
        fullyReg=false;
        // console.log(fullyReg);
    
    }
        let isFavoritePage = false;
    
        $: {
              let currentUrl = $page.url.pathname;
             isFavoritePage = currentUrl === "/dashboard/myfavourite"; 
            //console.log("isFavoritePage", isFavoritePage);
        }
    
        $:cartId = data?.cart?.cart[0]?.cartId || ""
    
        
    
        let menus = [];
        let submenuLeaveTimeoutId;
        let subSubmenuLeaveTimeoutId;
        let activeMenu = null;
        let activeSubmenu = null;
        let hoveredSubSubmenu = null;
        let form;
        let searchQuery = '';
        let debounceTimeout;
        let isLoading = false;
        let searchResults = [];
        let isLiked = false;
        const heartOutline = 'mdi:heart-outline';
        const heartFilled = 'mdi:heart';
        // $authedUser.email="rukhiyasameen@gmail.com"
        // $authedUser.username="Sameena"
        // let userEmail = $authedUser?.email;
        // let userName = $authedUser?.username;
        let form2;
        let submitGuestForm;
        $: showUserOptions = false;
      let dropdown; 
      function handleProfile(event) {
            event.stopPropagation(); 
            showUserOptions = !showUserOptions;
    
            if (showUserOptions) {
                window.addEventListener('click', handleClickOutside);
            } else {
                window.removeEventListener('click', handleClickOutside);
            }
        }
    
        function handleClickOutside(event) {
            if (dropdown && !dropdown.contains(event.target)) {
                showUserOptions = false;
                window.removeEventListener('click', handleClickOutside);
            }
        }
        const getInitial = (name) => name.charAt(0).toUpperCase();
    
    
        let suggestionsRef;
        let showSuggestions;
    
        function closeSuggestions() {
            searchQuery = '';
            showSuggestions = false;
        }
    
        function handleClick(event) {
            if (suggestionsRef && !suggestionsRef.contains(event.target)) {
                closeSuggestions();
            }
        }
    
        // onMount(async () => {
        // 	try {
        // 		menus = menusdata.menus;
        // 		syncLocalStorageToStore();
        // 		const existingExpiration = localStorage.getItem('cartExpirationChemi');
        // 		const currency = localStorage.getItem('currency')
        // 		if (!currency) {
        // 			localStorage.setItem('currency', "inr");
        // 			currencyState.set('inr')
        // 		}
        // 		if (!existingExpiration) {
        // 			if (!$authedUser?.id) {
        // 				await submitAlternateForm();
                        
        // 			} else {
        // 				const formdata = new FormData()
        // 				sendMessage("/?/getFavorites",formdata,async(result)=>{
        // 					console.log(result.favorite);
        // 					myFavorites.set(result.favorite)
        // 					localStorage.setItem("myfavorites",JSON.stringify(result.favorite))
        // 				})
        // 				await submitForm();
        // 			}
        // 			const expirationTime = new Date();
        // 			expirationTime.setHours(expirationTime.getHours() + 6);
        // 			localStorage.setItem('cartExpirationChemi', expirationTime.toISOString());
        // 		} else {
        // 			const cartExpirationTime = existingExpiration;
        // 			const currentTime = new Date();
        // 			const currenctISo=currentTime.toISOString()
        // 			if (currenctISo > cartExpirationTime) {
        // 				if (!$authedUser?.id) {
        // 					await submitAlternateForm();
        // 				} else {
        // 					const formdata = new FormData()
        // 				sendMessage("/?/getFavorites",formdata,async(result)=>{
        // 					console.log(result.favorite);
        // 					myFavorites.set(result.favorite)
        // 					localStorage.setItem("myfavorites",JSON.stringify(result.favorite))
        // 				})
        // 					await submitForm();	
        // 				}
        // 				const newExpirationTime = new Date();
        // 				newExpirationTime.setHours(newExpirationTime.getHours() + 6);
        // 				localStorage.setItem('cartExpirationChemi', newExpirationTime.toISOString());
        // 			}
        // 		}
        // 		window.addEventListener('click', handleClick);
        // 		return () => {
        // 		window.removeEventListener('click', handleClick);
        // 	};
        // 	} catch (error) {
        // 		console.error('Error fetching menus:', error);
        // 	}
        // 	isLiked = false;
        // });
        function syncLocalStorageToStore() {
        // Check if we are in the browser
        if (typeof window !== 'undefined') {
            const storedTotalComps = localStorage.getItem('totalCompsChemi');
            const storedCurrency = localStorage.getItem('currency')
            if (storedCurrency) {
                currencyState.set(storedCurrency)
            }
            if (storedTotalComps ) {
                cartTotalComps.set(Number(storedTotalComps));
            }
        }
    }
    async function submitForm() {
            form2.requestSubmit();
        }
        async function submitAlternateForm() {
            // submitGuestForm.requestSubmit();
            const storedTotalComps = JSON.parse(localStorage.getItem('cart')) || []
            localStorage.setItem('totalCompsChemi', storedTotalComps.length);
            syncLocalStorageToStore();	
        }
    
        function handleDataCart() {
            return async ({ result }) => {
                // console.log("result from page server for carat data",result);
                
                const totalComps  = result?.data?.cartData?.cartItems.length 
                // console.log("totalComps",totalComps);
                localStorage.setItem('totalCompsChemi', totalComps);
                syncLocalStorageToStore();	
            };
        }
        // function handleGuestData() {
        // 	return async ({ result }) => {
        // 		// console.log(result);
                
        // 		const { totalLength } = result.data;
        // 		// console.log("totalComps in handl  guest data ",result.data);
        // 		localStorage.setItem('totalComps', totalLength);
        // 		syncLocalStorageToStore();
        // 	};
        // }
        function handleMouseEnter(subSubmenu) {
            clearTimeout(subSubmenuLeaveTimeoutId);
            hoveredSubSubmenu = subSubmenu;
        }
    
        function handleMouseLeave() {
            subSubmenuLeaveTimeoutId = setTimeout(() => {
                hoveredSubSubmenu = null;
            }, 5000);
        }
        let menuTimeoutId;
        function toggleMenu(menu) {
            activeMenu = activeMenu === menu ? null : menu;
            if (activeMenu) activeSubmenu = null;
        }
    
        function handleMouseEnterMenu(menu) {
            clearTimeout(menuTimeoutId);
            activeMenu = menu;
            activeSubmenu = null;
        }
    
        function handleMouseLeaveMenu() {
            menuTimeoutId = setTimeout(() => {
                activeMenu = null;
                activeSubmenu = null;
            }, 300);
        }
    
        function handleMouseEnterSubmenu(submenu) {
            clearTimeout(submenuLeaveTimeoutId);
            activeSubmenu = submenu;
        }
        function handleMouseLeaveSubmenu() {
            submenuLeaveTimeoutId = setTimeout(() => {
                activeSubmenu = null;
            }, 50000);
        }
        let isOpen = false;
    
        function navigateTo (url) {
            //invalidate("data:cat")
            goto(url);
            handleMouseLeaveMenu();
            handleMouseLeaveSubmenu();
            // const newUrl = new URL(window.location.href)
            // newUrl.searchParams.set('/',url)
    
            // window.location.href = url;
        // 	isLiked = false;
            isOpen = false;
    
        // 	if (url.includes('products') || url.includes('applications')) {
        //     window.location.href = url;
        //    } else {
        // 	goto(url)
        //    }
           
        }
    
        function toggleLogoMenu() {
            isOpen = !isOpen;
        }
    
        function toggleLike() {
            isLiked = !isLiked;
        }
        
        function closeSidebar() {
        isOpen = false; 
      }
    
        function debounce(func, delay) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                func();
            }, delay);
        }
    
        function selectProduct() {
            searchQuery = '';
        }
    
        function handleSearchSubmit() {
            form.requestSubmit();
        }
    
        function handleInput(event) {
            searchQuery = event.target.value;
            if (searchQuery.length >= 3) {
            isLoading = true;
            debounce(handleSearchSubmit, 300);
            }
        }
    
        function handleData() {
            return async ({ result }) => {
                if (result) {
                    isLoading = false;
                }
                searchResults = result?.data?.responce;
                console.log(searchResults);
                
            };
        }
        // const handleSubmitBtn = () => {
        // 	if (searchQuery !== '') {
        // 		const cleanedSearchQuery = searchQuery.replace(/[^\w\s\-]/g, '');
        // 		const searchQueryUpperCase = cleanedSearchQuery.toUpperCase();
        // 		if (searchQueryUpperCase.trim() !== '') {
        // 			let url = `/search?query=${searchQueryUpperCase}`;
        // 			if ($authedUser && $authedUser?.id) {
        // 			url += `&userId=${$authedUser.id}`;
        // 		}
        // 		goto(url);
        // 	}
        // 		searchQuery = '';
        // 	}
        // };
    
        // function closeSearch(event) {
        // 	if (form && !form.contains(event.target)) {
        // 		searchQuery = ""; 
        // 		searchResults = []; 
        // 	}
        // }
    
        // onMount(() => {
        // 	window.addEventListener("click", closeSearch);
        // });
    
        // onDestroy(() => {
        // 	window.removeEventListener("click", closeSearch);
        // });
    
      let showTooltip = false;
        let hoveredCurrency = null;
        function handleMouseEnter1(currency) {
            hoveredCurrency = currency;
            showTooltip = true;
        }
        function handleMouseLeave1() {
            hoveredCurrency = null;
            showTooltip = false;
        }
        function toggleCurrency() {
        currencyState.update(current => {
          const newCurrency = current === 'inr' ? 'usd' : 'inr';
          if (newCurrency === 'inr') {
            toast.success("Currency changed to INR successfully");
          } else {
            toast.success("Currency changed to USD successfully");
          }
          return newCurrency; 
        });
      }
    </script>
    <form method="POST" action="/?/getCartValue" bind:this={form2} use:enhance={handleDataCart}>
        <!-- <input type="hidden" name="loggedInUser" value={$authedUser?.id} /> -->
    </form>
    <!-- <form
        method="POST"
        action="/cart?/guestCart"
        bind:this={submitGuestForm}
        use:enhance={handleGuestData}
    >
        <input type="hidden" name="guestCart" value={JSON.stringify($guestCart)} />
    </form> -->
    <nav class="bg-primary-400 font-workSans px-0.5">
        <Toaster position="bottom-right" richColors />
        {#if isOpen}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={closeSidebar} class="fixed md:hidden block top-0 left-0 w-full h-full bg-gray-300/60 z-40 backdrop-blur-sm"></div>
    {/if}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class={`fixed top-0 left-0 h-full bg-primary-400 bg-opacity-70 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden z-50 w-9/12 overflow-y-auto`}
            on:click={(e) => e.stopPropagation()}>
            

            <div class="flex flex-col h-full p-10 font-medium text-gray-600">
                <div class="flex justify-between mb-2">
                    <button
                    on:click={() => {
                        navigateTo('/');
                    }}
                    class="text-xl text-white font-semibold">
                    Chemikart
                </button>
                    <button
                        on:click={toggleLogoMenu}
                        class="self-end text-primary-400 text-2xl hover:text-primary-400 transition duration-200">
                        <Icon icon="cuida:x-outline" class="w-10 h-5 hover:text-primary-600 text-white mb-1" />
                    </button>
                </div>
                {#if activeMenu === null}
                {#each menus as menu}
                <span class="flex flex-row hover:bg-primary-400 transition rounded transform hover:scale-105 duration-200">
                    <button
                    on:click={() =>
                         navigateTo(menu.href)}
                    class="flex justify-between text-left text-white w-full py-2 px-2 ml-2">
                    {menu.title}
                    
                </button>
                {#if menu.submenus && menu.submenus.length > 0}
                <button on:click={()=> toggleMenu(menu)}>
                    <Icon icon="prime:chevron-down" class="w-5 h-5 mr-2 text-white "/>
                </button>
                    {/if}
                </span>
                
                {/each}
                <div class="flex flex-col font-semibold">
                    <!-- <button
                        on:click={() => navigateTo('/quick-order')}
                        class="text-left text-white text-md transition duration-200 w-full py-2 px-4 font-medium">
                        Quick Order
                    </button> -->
                    <!-- <button
                        on:click={() => navigateTo('/order-status')}
                        class="text-left text-white text-md w-full py-2 px-4 font-medium hover:bg-primary-400 transition rounded transform hover:scale-105 duration-200 ">
                        Order Status
                    </button> -->
                    <button
                        on:click={() => navigateTo('/quotes')}
                        class="text-left text-white text-md w-full py-2 px-4 font-medium hover:bg-primary-400 transition rounded transform hover:scale-105 duration-200 ">
                        Quotes
                    </button>
                </div>
            {:else}
                <button
                    on:click={() => toggleMenu(null)}
                    class="text-white flex items-center gap-3 text-left font-semibold py-2 px-0 rounded transition duration-200">
                    <Icon icon="material-symbols:chevron-backward" class="w-5 h-5" />
                    Back
                </button>
                {#if activeMenu.submenus && activeMenu.submenus.length > 0}
                    <div class="mt-2 pb-2">
                        {#each activeMenu.submenus as submenu}
                            <button
                                on:click={() => navigateTo(`${activeMenu.href}${submenu.href}`)}
                                class="block text-white p-2 hover:bg-primary-50 hover:text-primary-400 w-full text-left rounded transition-all duration-300 text-sm">
                                {submenu.title}
                            </button>
                        {/each}
                    </div>
                {/if}
            {/if} 
            </div>
        </div>
        
        <div class="flex items-center justify-between w-11/12 py-0 sm:py-4 mx-auto max-w-7xl flex-wrap">
            <div class="flex gap-3 md:hidden">
                <button
                    on:click={toggleLogoMenu}
                    class="flex items-center text-gray-600 focus:outline-none">
                    <Icon icon="fa6-solid:bars" class=" text-xl text-white" />
                </button>
                
            </div>
            <div class="text-center pl-3 w-1/10">
                <button
                    on:click={() => {
                        navigateTo('/');
                    }}
                    class="flex items-center text-white text-lg sm:text-3xl font-poppins md:mb-0 py-2 font-roboto font-bold">
                    Chemikart
                </button>
            </div>
            <!-- SMALL -->
            <div class="md:hidden flex items-center gap-0.5">
                {#if $authedUser?.email}
                            <div class="relative " bind:this={dropdown}>
                    <button
                            class="sm:w-6 sm:h-6 w-4 h-4 flex items-center justify-center bg-white text-primary-400 font-semibold rounded-full text-sm sm:text-lg"
                            on:click={handleProfile}>
                            {getInitial(userName)}
                    </button>
                    {#if showUserOptions}
                    <div class="relative">
                        <div class="absolute right-0 top-2 w-32 bg-white rounded-md shadow-lg z-20 pb-1 pt-1" transition:fade>
                          <!-- Triangle -->
                          <div class="absolute top-[-7px] right-1 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white transform rotate-180"></div>
                          <button
                            on:click={() => navigateTo('/dashboard')}
                            class="block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left whitespace-nowrap font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
                            My Dashboard
                          </button>
                          <button
                          on:click={() => navigateTo('/dashboard/mycart')}
                          class="block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left whitespace-nowrap font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50"
                          class:hidden={!fullyReg}
                        >
                          My Carts
                        </button>
                        
                          <button
                            on:click={() => navigateTo('/dashboard/myorders')}
                            class="block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left whitespace-nowrap font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50" class:hidden={!fullyReg}>
                            My Orders
                          </button>
                          <button
                            on:click={() => navigateTo('/dashboard/myquotes')}
                            class="block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left whitespace-nowrap font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50" class:hidden={!fullyReg}>
                            My Quotes
                          </button>
                          <button
                            on:click={() =>{
                                 localStorage.clear()
                                 authedUser.set({})
                                 cartTotalComps.set(0)
                                 navigateTo('/logout')
                            }}
                            class="loginbtn block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
                            Logout
                          </button>
                        </div>
                      </div>
                    {/if}
            </div>
            {:else}
                <div class="flex items-center justify-between">
                    <div class="relative bg-primary-400" bind:this={dropdown}>
                            <button class="w-5 h-5 flex items-center justify-center text-primary-400 bg-white rounded-full" on:click={handleProfile}>
                            <Icon icon="tdesign:user-filled" class="w-5 h-5 flex items-center justify-center bg-white text-primary-400 rounded-full p-1"/>
                        </button>
                        {#if showUserOptions}
                        <div class="relative">
                            <div class="absolute right-0 top-2 w-32 bg-white rounded-md shadow-lg z-20 pb-1 pt-1" transition:fade>
                              <!-- Triangle -->
                              <div class="absolute top-[-7px] right-1 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white transform rotate-180"></div>
                          
                              <!-- <button
                                on:click={() => navigateTo('/login')}
                                class="block px-4 font-workSans py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
                                Login
                              </button> -->
                              <button
                                on:click={() => navigateTo('/signin')}
                                class="block px-4 font-workSans py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
                                Sign In
                              </button>
                              <button
                                on:click={() => navigateTo('/signup')}
                                class="loginbtn block px-4 font-workSans py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
                                Sign Up
                              </button>
                            </div>
                          </div>
                        {/if}
                    </div>
                </div>
                {/if}
                <a href="/dashboard/myfavourite">
                    <button
                        on:click={toggleLike}
                        aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                        class="py-2 ml-1.5 md:ml-0 rounded-full transition-all duration-300 ease-in-out relative overflow-hidden ${isLiked ? 'heartFilled' : 'heartOutline'}">
                        <Icon icon={heartFilled } class="text-2xl sm:text-2xl transition-colors duration-300 hover:text-primary-100 hover:scale-105 text-white ease-in-out" />
                    </button>
                </a>
                <Cartrightside {cartId}/>	
            </div>
            <!-- Searchbar functionality -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div on:click|stopPropagation class="relative sm:max-w-3xl md:max-w-sm lg:max-w-md xl:max-w-xl  sm:mt-2 w-full sm:pb-0 pb-2 mx-auto" bind:this={suggestionsRef}>
    
                <form action="/?/search" method="post" bind:this={form} use:enhance={handleData}>
                    <div class=" w-full flex items-center">
                        <input
                            type="text"
                            placeholder="Search for Product Names, Numbers, or CAS Numbers"
                            bind:value={searchQuery}
                            name="query"
                            on:input={handleInput}
                            class=" border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 w-full px-3 py-2 md:py-3 text-sm placeholder:text-xs truncate pr-12 sm:pr-10"/>
                        {#if isLoading}
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Icon icon="ei:spinner" class="w-8 h-8 animate-spin text-primary-600 opacity-75 text-5xl"/>
                            </div>
                        {/if}
                        <button
                            class="absolute right-0.5 md:right-1 sm:top-1/2 top-[42%] transform -translate-y-1/2 bg-primary-400 text-white p-2 flex items-center justify-center rounded-md"
                            on:click={handleSubmitBtn}>
                            <Icon icon="feather:search" class=" text-md md:text-xl" />
                        </button>
                    </div>
                    {#if searchQuery.trim() && searchResults && searchResults.length > 0}
                        <ul class="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                            {#each searchResults as product}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                                <li class="px-0 py-0 text-sm text-gray-800 hover:bg-primary-200 cursor-pointer" on:click={() => selectProduct(product)}>
                                    <a href={`/products/${product?.category?.urlName}/${product?.subCategory?.urlName}/${product?.productNumber}`}
                                        class="block w-full text-sm text-gray-900 px-4 py-2">
                                        <p class="text-md ">{product?.productName}</p>
                                        <p class="text-md text-gray-900 ">{product?.productNumber}   <span class="text-sm text-gray-700 italic pl-2"> - {product?.manufacturerName}</span> </p>
                                    </a>
                                </li>
                                <!-- <hr class=""> -->
                            {/each}
                        </ul>
                    {:else if searchQuery.trim() && isLoading}
                        <p class="absolute w-full bg-white text-sm text-gray-500 py-2 px-4 mt-1 border border-gray-300 z-50 rounded flex items-center justify-start">
                            <Icon icon="ei:spinner" class="w-8 h-8 animate-spin-slow text-primary-600 mx-2 text-5xl"/>
                            <span>Loading Products...</span>
                        </p>
                        {:else if searchQuery.trim().length >= 3 && searchResults && searchResults.length === 0}
                        <p class="absolute w-full bg-white text-sm text-gray-500 py-2 px-4 mt-1 border border-gray-300 z-50 rounded">
                            No products found
                        </p>
                    {/if}
                </form>
            </div>
        
            <!-- big-->
            <div class="md:flex hidden w-1/10">
                {#if $authedUser?.email}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="relative p-2 text-white hidden md:block cursor-pointer rounded-md hover:bg-primary-300 transition-all" on:click={handleProfile} bind:this={dropdown}>
                    <button
                            class="mr-2 flex flex-row justify-center cursor-pointer z-10 gap-2 m-1">
                            <p class="w-7 h-7 flex items-center justify-center bg-white text-primary-400 rounded-full font-semibold text-lg">{getInitial(userName)}
                        </p>
                            <h2 class="text-sm text-white mt-1 capitalize">{$authedUser.firstname || userName}</h2>
                            <button on:click={handleProfile}>
                                <Icon
                                    icon={showUserOptions ? 'ion:chevron-up' : 'ion:chevron-down'}
                                    class="text-white mt-0.5"/>
                        </button>
                    </button>
            
                    {#if showUserOptions}
                    <div class="relative">
                        <div class="absolute right-0 top-3 w-32 bg-white rounded-md shadow-lg z-20 pb-1 pt-1" transition:fade>
                          <!-- Triangle -->
                          <div class="absolute top-[-7px] right-1 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white transform rotate-180"></div>
                          <button
                            on:click={() => navigateTo('/dashboard')}
                            class="block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50 whitespace-nowrap">
                            My Dashboard
                          </button>
                          <button
                            on:click={() => navigateTo('/dashboard/mycart')}
                            class="block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left whitespace-nowrap font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50" class:hidden={!fullyReg}>
                            My Carts
                          </button>
                          <button
                            on:click={() => navigateTo('/dashboard/myorders')}
                            class="block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left whitespace-nowrap font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50" class:hidden={!fullyReg}>
                            My Orders
                          </button>
                          <button
                            on:click={() => navigateTo('/dashboard/myquotes')}
                            class="block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left whitespace-nowrap font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50" class:hidden={!fullyReg}>
                            My Quotes
                          </button>
                          <button
                            on:click={() =>{
                                localStorage.clear()
                                authedUser.set({})
                                cartTotalComps.set(0)
                                navigateTo('/logout')
                            }}
                            class="loginbtn block px-4 py-2 sm:text-sm text-xs text-gray-700 hover:text-primary-500 w-full text-left font-medium border-l-4 border-transparent hover:border-primary-600 hover:bg-primary-50">
                            Logout
                          </button>
                        </div>
                      </div>
                    {/if}
                </div>
                {:else}
                    <div class="flex items-center justify-between">
                        <!-- <button
                            on:click={() => {
                                navigateTo('/login');
                            }}
                            class="loginbtn  font-workSans text-md font-medium border-b-2 border-b-transparent hover:text-primary-100 hover:scale-105 text-white"
                            >Login</button> -->
                        <button
                            on:click={() => {
                                navigateTo('/signin');
                            }}
                            class="loginbtn font-medium sm:text-sm text-xs lg:text-base font-workSans text-md border-b-2 border-b-transparent hover:text-primary-100 hover:scale-105 text-white"
                            >Sign In</button>
                        <Icon icon="vaadin:line-v" class="mr-0 text-white font-semibold" />
                        <button
                            on:click={() => {
                                navigateTo('/signup');
                            }}
                            class=" registerbtn font-medium sm:text-sm text-xs lg:text-base font-workSans pr-2  text-md border-b-2 border-b-transparent hover:text-primary-100 hover:scale-105 text-white"
                            >Sign Up</button>
                    </div>
                {/if}
            </div>
        </div>
        <div class="hidden md:flex mx-auto w-full">
            <!-- Menu Section -->
            <div class="md:flex mx-auto justify-between w-11/12 max-w-7xl">
                <div class="md:flex justify-around items-center lg:gap-2 hidden">
                    {#each menus as menu, index}
                        <!-- svelte-ignore a11y-interactive-supports-focus -->
                        <div
                            class="group"
                            role="menu"
                            on:mouseenter={() => handleMouseEnterMenu(menu)}
                            on:mouseleave={handleMouseLeaveMenu}>
                            <div class={`py-0 pr-2 pl-3 ${activeMenu === menu ? 'text-orange-500' : 'text-gray-600'}`}>
                                <button
                                    on:click={() => navigateTo(menu.href)}
                                    class={`flex items-center hover:bg-gray-200/25 p-2 cursor-pointer rounded-t-md text-nowrap sm:text-sm text-xs lg:text-base font-medium text-left w-full ${activeMenu === menu ? 'text-white scale-105' : 'text-white'}`}
                                    role="menuitem">
                                    {menu.title}
                                    {#if index < 5 && menu.title !== 'Documents' && menu.title !== 'Quotes' && menu.title !== 'Quick Order'}
                                        <Icon icon="prime:chevron-down" class="ml-1 w-5 h-5 " />
                                    {/if}
                                </button>
                            </div>
                            {#if menu.submenus && menu.submenus.length > 0}
                                <div
                                    class={`absolute shadow-md z-50 rounded-sm mt-0 ml-2 bg-white transition-opacity duration-200 w-60 ${activeMenu === menu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                    role="menu">
                                    {#each menu.submenus as submenu}
                                        <!-- svelte-ignore a11y-interactive-supports-focus -->
                                        <div
                                            class="relative group hover:text-primary-950"
                                            role="menu"
                                            on:mouseenter={() => handleMouseEnterSubmenu(submenu)}
                                            on:mouseleave={handleMouseLeaveSubmenu}>
                                            <button
                                                on:click={() => navigateTo(`${menu.href}${submenu.href}`)}
                                                class="flex relative text-left mr-24 pl-4 py-1 px-4 md:text-xs lg:text-sm hover:bg-primary-50 w-full"
                                                role="menuitem">
                                                <span class={`absolute left-0 top-0 h-full w-1 bg-primary-400 transition-all duration-200 ${activeSubmenu === submenu ? 'opacity-100 text-gray-800' : 'opacity-0'}`}></span>
                                                {submenu.title}
                                                <Icon icon="material-symbols:chevron-right" class={`absolute right-2 w-5 h-5 transition-colors duration-200 ${activeSubmenu === submenu ? 'text-primary-600' : 'text-gray-300'}`}/>
                                            </button>
                                        </div>
                                        {#if submenu.subSubmenus && submenu.subSubmenus.length > 0}
                                            <div class={`mt-0 ml-0 border-gray-300 border-l h-full overflow-y-scroll scroll absolute left-full rounded-sm pb-2 top-0 z-30 w-full bg-white shadow-sm transition-opacity duration-200 ${activeSubmenu === submenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                                role="menu">
                                                <ul>
                                                    {#each submenu.subSubmenus as subSubmenu}
                                                        <li class="hover:bg-primary-50 relative"
                                                            on:mouseenter={() => handleMouseEnter(subSubmenu)}
                                                            on:mouseleave={handleMouseLeave}>
                                                            <button
                                                                on:click={() =>
                                                                    navigateTo(`${menu.href}${submenu.href}${subSubmenu.href}`)}
                                                                class="title block text-left py-1 pl-4 md:text-xs lg:text-sm text-gray-700 w-full"
                                                                role="menuitem">
                                                                {#if hoveredSubSubmenu === subSubmenu}
                                                                    <span
                                                                        class="absolute left-0 top-0 h-full w-1 transition-opacity duration-200"
                                                                    ></span>
                                                                {/if}
                                                                {subSubmenu.title}
                                                            </button>
                                                        </li>
                                                    {/each}
                                                </ul>
                                            </div>
                                        {/if}
                                    {/each}
                                    
                                    
                                </div>
                                
                            {/if}
                        </div>
                    {/each}
                    <!-- <a href="/quotes"> -->
                        <div class="group" role="menu"><div class="py-0 pr-2 pl-3 text-gray-600">
                        <button on:click={() => goto('/quotes')} class="flex items-center hover:bg-gray-200/25 p-2 cursor-pointer hover:scale-105 rounded-t-md text-nowrap sm:text-sm text-xs lg:text-base font-medium text-left w-full text-white">
                            <span class="text-white font-medium sm:text-sm text-xs lg:text-base">
                                Quotes
                            </span>
                        </button>
                    </div>
                </div>
                    <!-- </a> -->
                </div>
                    
                <div class="flex gap-1 text-gray-600 items-center ">
    
                    <!-- <a href="/quick-order">
                        <button 
                        class="hover:bg-gray-200/25 p-2 cursor-pointer rounded-t-md text-nowrap text-xs lg:text-base font-medium">
                            <span class="text-white font-medium text-xs lg:text-sm">
                                Quick Order
                            </span>
                        </button>
                    </a> -->
                    <!-- <a href="/order-status">
                        <button class="hover:bg-gray-200/25 p-2 cursor-pointer rounded-t-md text-nowrap text-xs lg:text-base font-medium">
                            <span class="text-white font-medium text-xs lg:text-sm">
                                Order Status
                            </span>
                        </button>
                    </a> -->
                    
                    <div class="relative flex items-center justify-center lg:space-x-2 lg:pr-4">
                                <div class="relative flex items-center justify-between bg-primary-400 border-2 border-white w-16 lg:w-32 h-7 bottom-0.5 rounded-md cursor-pointer">
                                    <div class="absolute flex items-center justify-between w-full h-full transition-all duration-300 ease-in-out">
                                        <button 
                                            class="w-1/2 h-full flex items-center justify-center bg-white text-gray-400 z-10 text-xs"
                                            on:click={setINR} >
                                            <span class="text-2s lg:text-xs">₹</span>
                                            <span class="text-2s ml-1 font-medium hidden lg:inline">INR</span>
                                        </button>
                                        <button 
                                            class="w-1/2 h-full flex items-center justify-center bg-white text-gray-400 z-10 text-xs"
                                            on:click={setUSD} >
                                            <span class="text-2s lg:text-xs">$</span>
                                            <span class="text-2s ml-1 font-medium hidden lg:inline">USD</span>
                                        </button>
                                </div>
                                
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <div 
                                    class="absolute w-1/2 h-full rounded bg-primary-500 transition-all duration-300 ease-in-out flex items-center justify-center"
                                    style="top: 50%; left: {$currencyState === 'inr' ? '25%' : '75%'}; transform: translate(-50%, -50%); z-index: 10;"
                                on:click={toggleCurrency}>
                                    <button class="text-white lg:text-2s text-1s font-medium whitespace-nowrap">{$currencyState === 'inr' ? '₹ INR' : '$ USD'}
                                    </button>
                                </div>
                            </div>
                        {#if showTooltip}
                          <div class="absolute bottom-7 left-1/4 transform -translate-x-1/2 mb-2 z-50 whitespace-nowrap bg-white
                           text-xs font-medium py-1 px-4 rounded shadow-lg leading-snug">
                            {#if hoveredCurrency === 'inr' && $currencyState === 'inr'}
                              Current currency is INR
                            {:else if hoveredCurrency === 'inr'}
                              Click to view prices in Indian Rupees (INR)
                            {:else if hoveredCurrency === 'usd' && $currencyState === 'usd'}
                              Current currency is USD
                            {:else}
                              Click to view prices in US Dollars (USD)
                            {/if}
                          </div>
                        {/if}
                      </div>
                    <div class="md:flex hidden items-center justify-center">
                        <a href="/dashboard/myfavourite">
                            <button
                                on:click={toggleLike}
                                aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                                class=" rounded-full transition-all duration-300 ease-in-out relative overflow-hidden ${isLiked ? 'heartFilled' : 'heartFilled'}">
                                <Icon icon={isFavoritePage ? heartFilled : heartFilled} class="text-3xl transition-colors duration-300 hover:text-primary-100 hover:scale-105 text-white ease-in-out"/>
                            </button>
                        </a>
                    </div>
                    <Cartrightside {cartId} />
                </div>
            </div>
        </div>
    </nav>