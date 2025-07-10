<script>
	import SearchSection from '$lib/components/Search.svelte';
	import { goto } from '$app/navigation';
	import { toast, Toaster } from 'svelte-sonner';
	export let data;
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	// console.log('searchdata==>',data);
	let errorMessage = '';
	let isLoading = false;
	let successMessage = '';
	let emailSubmitted = '';
		let errors = {};
  import {PUBLIC_IMAGE_URL} from "$env/static/public"
	let verificationMessage = '';
	let email = data?.userProfile?.email || "";
	let isLoadingemail = false;
	let emailSent = false;
	let displayMessage = '';
	let enteredOtp = '';
	let enteredOtpemail = '';
	let isOtpVerified = false;
	let form3;

	let isLoadingPhone = false;
	let isEmailVerified = false;
	let loadingotp = false;
	let submitLoading = false;
	let loadingPhone = false;
	// let isLoading = false;
	let ProfileEmailVerified;
	let isDataAvailable = false;
	let isEditable = false;
	// console.log(data,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
	let authedUserEmailVerified = data?.userProfile?.isEmailVerified;
	// console.log('authedUserEmailVerified', authedUserEmailVerified);

	
	let components, categories, subcategories, manufacturers;
	$: {
		components = data?.result?.components || [];
		categories = data?.result?.categories || [];
		subcategories = data?.result?.subcategories || [];
	}
	const redirectPage = () => {
		goto(`/products`);
	};
	function formValid() {
		console.log('Errors before validation:', errors);
		if (!fieldName || fieldName === 'email') {
			if (
				!email ||
				!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email) ||
				email.split('@')[1].includes('gamil')
			) {
				errors.email = 'Please enter a valid email address ';
			} else {
				delete errors.email;
			}
		}

		const isEmailVerified = ProfileEmailVerified;

		const isValid =
			Object.keys(errors).length === 0 && (isEmailVerified || authedUserEmailVerified === true);

		return isValid;
	}
	
	const handleResendOtpemail = () => {
		if (!loadingotp) {
			form3.requestSubmit();
			// startTimer();
		}
	};

	function truncateText(text, maxLength = 25) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
</script>

<section class="mx-auto w-11/12 max-w-7xl">
	<div class="px-4 pb-8">
		{#if components?.length > 0 || categories?.length > 0 || subcategories?.length > 0 || manufacturers?.length > 0}
			<h3 class="text-2xl font-bold mb-4">Matched Results</h3>
		{:else}
		{#if !emailSubmitted}
		<div class="lg:w-8/12 w-full mx-auto md:p-5 rounded-md text-center">
			<p class="text-lg mb-2 font-semibold text-heading">
				The product you're looking for is not currently in our database.
			</p>
			<p class="text-sm mb-4 text-heading">
				Please enter your Email, and we'll contact you when it's available.
			</p>
			<form
				method="POST"
				action="?/noresults"
				class="space-y-3 w-full md:w-8/12 mx-auto"
				use:enhance={(event) => {
					if (!ProfileEmailVerified && !authedUserEmailVerified) {
						event.preventDefault();
						toast.error('Please verify your email to proceed');
						return;
					}

					return async ({ result }) => {
						console.log(result);

						isLoading = false;
						if (result.data.status === 200) {
							successMessage = 'Thank you! We will contact you once the product is available.';
							errorMessage = '';
							emailSubmitted = true;
							setTimeout(() => {
								redirectPage();
							}, 2000);
						} else {
							errorMessage = 'Something went wrong. Please try again later.';
							successMessage = '';
							setTimeout(() => {
								redirectPage();
							}, 2000);
						}
					};
				}}
				on:submit={(event) => {
					if (!ProfileEmailVerified && !authedUserEmailVerified) {
						event.preventDefault();
						toast.error('Please verify your email to proceed');
						return;
					} else {
						isLoading = true;
					}
				}}
			>
				<input type="text" hidden name="query" value={data?.result?.search} />

				<div class="mb-2 md:mb-0 md:mr-12 w-full  my-2">
					<input type="hidden" name="email" id="email" bind:value={email} required />
					<form
						action="?/verifyemail"
						bind:this={form3}
						method="POST"
						use:enhance={({}) => {
							return async ({ result }) => {
								isLoadingemail = false;
								console.log('result', result);
								if (result.data?.status === 200) {
									ProfileEmailVerified = result.data.isEmailVerified;
									if (authedUserEmailVerified === true) {
										ProfileEmailVerified = true;
									}

									verificationMessage = result.data.message;

									if (
										verificationMessage.includes(
											'Verification email sent successfully. Please check your inbox.'
										)
									) {
										displayMessage = 'Please check your inbox.';
										emailSent = true;
										enteredOtp = '';
										isOtpVerified = false;
									} else {
										displayMessage = verificationMessage;
										emailSent = false;
										isOtpVerified = false;
									}

									toast.success(verificationMessage);
								} else {
									toast.error(result.data.message);
									ProfileEmailVerified = result.data.isEmailVerified;
									emailSent = false;
								}
							};
						}}
						class="flex w-full "
						on:submit={() => {
							isLoadingemail = true;
						}}
					>
						<div class="relative w-full">
						
							<input
								type="text"
								name="email"
								id="email"
								bind:value={email}
								required
								class="w-full placeholder:text-xs text-sm px-2 py-2 rounded bg-gray-50 border border-gray-300 focus:outline-none focus:ring-0 focus:ring-primary-300 focus:border-primary-300"
								placeholder="Email"
								on:input={() => {
									errors.email = !email
										? '*Required'
										: !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email) ||
											  email.split('@')[1].includes('gamil')
											? 'Please enter a valid email address'
											: '';
									ProfileEmailVerified = false;
									emailSent = false;
									authedUserEmailVerified = false;
								}}
							/>
							{#if isLoadingemail}
								<span
									class="absolute right-2 top-1/2  transform -translate-y-1/2 text-2s font-semibold text-primary-600 flex items-center"
								>
									<Icon icon="line-md:loading-alt-loop" class="w-4 h-4 mr-1" />
									Verifying...
								</span>
								<!-- {:else if !ProfileEmailVerified && !emailSent && isEmailVerified !== true} -->
							{:else if !ProfileEmailVerified && !emailSent && authedUserEmailVerified !== true && data.isEmailVerified !== true}
								<button
									type="submit"
									class="absolute right-2 top-1/2  transform -translate-y-1/2 text-2s font-semibold text-primary-600 hover:underline cursor-pointer disabled:cursor-not-allowed"
									disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email) ||
										email.split('@')[1].includes('gamil')}
								>
									Verify
								</button>
							{:else if emailSent}
								<span
									class="absolute right-2  top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
								>
									{#if isOtpVerified}
										Verified
										<Icon icon="material-symbols:verified-rounded" class="w-4 h-4 mt-2 ml-1" />
									{:else}
										<Icon icon="fluent:mail-all-read-16-filled" class="w-4  h-4 mr-1" />
										Check your inbox
									{/if}
								</span>
							{:else}
								<span
									class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
								>
									Verified
									<Icon icon="material-symbols:verified-rounded" class="w-4 h-4 ml-1" />
								</span>
							{/if}
						</div>
					</form>
					{#if emailSent && isOtpVerified === false}
						<br />

						<form
							action="?/verifyOtpEmail"
							method="POST"
							use:enhance={() => {
								return async ({ result }) => {
									loadingotp = false;
									if (result.status === 200) {
										if (result.data.status === 200) {
											const verifiedMessage = result.data.message;
											toast.success(verifiedMessage);
											isOtpVerified = result.data.isEmailVerified;
											enteredOtpemail = '';
											ProfileEmailVerified = true;
											console.log(isOtpVerified, 'isOtpVerified');
										} else {
											const errorMessage = result.data.message || 'An unknown error occurred!';
											toast.error(errorMessage);
										}
									} else {
										const errorMessage =
											result.data.message || 'Request failed. Please try again.';
										toast.error(errorMessage);
									}
								};
							}}
							on:submit={() => {
								loadingotp = true; // Show loading message when form is submitted
							}}
						>
							<div class="relative w-full">
								<input type="hidden" name="email" id="email" bind:value={email} />
								<input
									type="text"
									name="enteredOtp"
									bind:value={enteredOtpemail}
									placeholder="Enter 6-digit OTP"
									class="flex-1 outline-none w-full border-gray-300 border rounded focus:border-primary-400 focus:ring-0 p-2 text-sm"
									on:input={() => {
										enteredOtpemail = enteredOtpemail.trim();
									}}
								/>
								<button
									type="submit"
									class="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary-600 font-bold text-2s py-1 rounded hover:underline"
									disabled={loadingotp}
								>
									<!-- {loadingotp ? 'Verifying...' : 'Verify'} -->
									{#if loadingotp}
										<span
											class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary-600 flex items-center"
										>
											<Icon icon="line-md:loading-alt-loop" class="w-4 h-4 mr-1 animate-spin" />
											Verifying...
										</span>
									{:else}
										Verify
									{/if}
								</button>
							</div>
							<div class="flex justify-end text-sm">
								<button
									type="button"
									on:click={handleResendOtpemail}
									disabled={loadingotp}
									class="text-sm text-primary-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Get a new code
								</button>
							</div>
						</form>
					{/if}
				</div>

				<button
					type="submit"
					class="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={isLoading ||
						!email ||
						!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)}
				>
					{#if isLoading}
						<Icon icon="line-md:loading-alt-loop" class="w-4 h-4 mr-2 animate-spin" />
						<span>Submitting...</span>
					{:else}
						<span>Submit</span>
					{/if}
				</button>
			</form>
		</div>
	{/if}

	{#if emailSubmitted}
		{#if successMessage}
			<div class="mt-4 p-4 bg-green-100 text-green-800 border rounded">
				{successMessage}
			</div>
		{:else if errorMessage}
			<div class="mt-4 p-4 bg-red-100 text-red-800 border rounded">
				{errorMessage}
			</div>
		{/if}
	{/if}
		{/if}

		{#if components && components.length > 0}
			<h3 class="text-xl font-bold mb-4">Products</h3>
			<section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-4 ">
				{#each components as item}
					<a href="/products/{item?.category?.urlName}/{item?.subCategory?.urlName}/{item?.productNumber}" class="block bg-white">
						<div class="flex gap-3 shadow rounded-md p-4 cursor-pointer hover:shadow-md transition-all duration-300 ease-in-out">
							<img
							    src={`${PUBLIC_IMAGE_URL}/${item?.image}`}
								class="w-20 h-20 object-cover rounded-md text-sm"
								onerror="this.src='/fallback.jpg'"
								alt={item?.productName}/>
							<div class="overflow-hidden">
								<p class="text-sm text-heading font-semibold text-justify whitespace-nowrap">{truncateText(item?.productName,30)}</p>
								<p class="text-xs pt-1">{item?.productNumber}</p>
								<p class="text-gray-500 text-sm font-medium pt-3">{item?.manufacturerName}</p>
							</div>
						</div>
					</a>
				{/each}
			</section>
		{/if}
		<SearchSection
			title="Categories"
			items={categories}
			linkPrefix="/products/"
			isSubcategory={false}/>
		<SearchSection
			title="Sub Categories"
			items={subcategories}
			linkPrefix="/products/"
			isSubcategory={true}/>
	</div>
</section>
