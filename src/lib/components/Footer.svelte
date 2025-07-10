<script>
	import Icon from '@iconify/svelte';
	// import CookiesPopup from "$lib/components/CookiesPopup.svelte";
	// import Scroller from '$lib/components/Scroller.svelte';
	// import Helpsection from '$lib/components/Helpsection.svelte';
	// import Helpsection1 from '$lib/components/Helpsection1.svelte';
	// import Helpsection2 from '$lib/components/Helpsection2.svelte';
	import { page } from '$app/stores';
	let currentUrl;
	$: {
  currentUrl = $page.url.pathname;
//   console.log("currentUrl",currentUrl);
}

	let isPopupOpen = false;

	const togglePopup = (event) => {
		event.preventDefault();  
		isPopupOpen = !isPopupOpen; 
	};

	const closePopup = () => {
		isPopupOpen = false;
	};

	const currentYear = new Date().getFullYear();
	let footer;

	const excludedUrls = [
  "/ecom-solutions",
  "/safety/understanding-product-labels",
  "/safety/globally-harmonized-system",
  "/safety/tsca-8-notification",
  "/safety/hazard-and-precautionary-statements",
  "/products",
  "/terms/site-and-terms",
  "/terms/privacy-notice"
];
</script>
<!-- {#if currentUrl !== "/feedback"}
<Helpsection1 />
<Helpsection2 />
{/if} -->
<footer class="w-full bg-green-400 p-6 font-workSans" bind:this={footer}>
	<!-- {#if currentUrl !== "/feedback" && currentUrl !== "/order-status" && currentUrl !== "/dashboard/myfavourite" && currentUrl !== "/safety/tsca-8-notification" && currentUrl !== "/documents" && currentUrl !== "/quick-order"}
	<Helpsection {footer} />
	{/if} -->

	<div class="mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-4 w-11/12 mx-auto max-w-7xl">
			<div class="md:block hidden">
			<div class="flex flex-col items-center md:items-start text-center md:text-left">
				<a href="/" aria-label="Go to homepage" class="text-white font-bold sm:text-xl text-lg uppercase">
					Chemikart
				</a>
				<div class="mt-2 font-medium sm:text-sm text-xs text-gray-50">
					No. 206, Vinni Arcade 100<br />
					Feet Ring Road, Kathriguppe<br /> 
					Main Rd, Bengaluru,<br />
					Karnataka 560085
				</div>
			
			</div>
		</div>
			<div class="flex flex-col items-center md:items-start text-center md:text-left">
				<p class="text-white font-semibold sm:text-lg text-md uppercase">Information</p>
				<ul class="mt-2 space-y-2 text-sm text-gray-50 underline-offset-2">
					<li><a href="/about-us" class="font-medium sm:text-sm text-xs hover:underline">About Us</a></li>
					<li><a href="/sitemap" class="font-medium sm:text-sm text-xs hover:underline">Site Map</a></li>
					<li><a href="/newsroom" class="font-medium sm:text-sm text-xs hover:underline">Newsroom</a></li>
					<li><a href="/copy-consent" class="font-medium sm:text-sm text-xs hover:underline">Copyright Consent</a></li>
				</ul>
			</div>
			<div class="flex flex-col items-center md:items-start text-center md:text-left">
				<p class="text-white font-semibold sm:text-lg text-md uppercase">Help & Support</p>
				<ul class="mt-2 space-y-2 text-sm text-gray-50 underline-offset-2">
					<li><a href="/contact-us" class="font-medium sm:text-sm text-xs hover:underline">Contact Us</a></li>
					<li><a href="/help-support" class="font-medium sm:text-sm text-xs hover:underline">Customer Support</a></li>
					<li><a href="/faq" class="font-medium sm:text-sm text-xs hover:underline">FAQs</a></li>
					<li><a href="/ecom-solutions" class="font-medium sm:text-sm text-xs hover:underline">Chemikart Solutions</a></li>
				</ul>
			</div>
			<div class="flex flex-col items-center md:items-start text-center md:text-left lg:mr-12">
				<p class="text-white font-semibold sm:text-lg text-md uppercase">Orders</p>
				<ul class="mt-2 space-y-2 text-sm text-gray-50 underline-offset-2">
					<li><a href="/quick-order" class="font-medium sm:text-sm text-xs hover:underline">Quick Order</a></li>
					<li><a href="/order-status" class="font-medium sm:text-sm text-xs hover:underline">Order Status</a></li>
					<li><a href="/quotes" class="font-medium sm:text-sm text-xs hover:underline">Quotes</a></li>
					<li><a href="/returns" class="font-medium sm:text-sm text-xs hover:underline">Returns & its Status</a></li>
				</ul>
				<div class="sm:mt-14 md:mt-0 lg:mt-14">
					<!-- {#if !excludedUrls.includes(currentUrl)}					
					<Scroller />
					{/if} -->
				</div>
				<div class="sm:mt-14 md:mt-0 lg:mt-14 sm:hidden block">
					<!-- {#if !excludedUrls.includes(currentUrl)}					 -->
					<!-- <Scroller /> -->
					<!-- {/if} -->
				</div>
			</div>
			<div class="md:hidden block">
				<div class="flex flex-col items-center md:items-start text-center md:text-left">
					<a href="/" aria-label="Go to homepage" class="text-white font-bold sm:text-xl text-lg uppercase">
						Chemikart
					</a>
					<div class="mt-2 font-medium sm:text-sm text-xs text-gray-50">
						No. 206, Vinni Arcade 100<br />
						Feet Ring Road, Kathriguppe<br /> 
						Main Rd, Bengaluru,<br />
						Karnataka 560085
					</div>
				
				</div>
				<!-- <Scroller /> -->
			</div>
			

			
		</div>
		<div class="w-full">
			<hr class="border-gray-50 m-4 border-1" />
			<div
				class="flex flex-col md:flex-row justify-center md:justify-between items-center text-gray-50 mx-auto w-11/12 mt-4 max-w-7xl">
				<p class="text-xs text-start font-medium">
					&copy; {currentYear} Agriconnect. <span class="md:block lg:inline">All Rights Reserved.</span>
				</p>
				
			</div>
		</div>
	</div>	
	<!-- {#if isPopupOpen}
		<CookiesPopup isOpen={isPopupOpen} closePopup={closePopup} />
	{/if} -->
</footer>
