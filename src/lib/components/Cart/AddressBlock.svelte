<script>
	import { countryCodes } from '$lib/data/constants.js';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import Button from './Button.svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { billingAddress, shipmentAddress } from '$lib/stores/checkoutStore.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import AddressForm from './AddressForm.svelte';
    import {taxError,taxNumber,phoneNumber,phoneError} from '$lib/stores/mainStores.js'
	import parsePhoneNumber from "libphonenumber-js/max"

	export let profile;
    // $:console.log("billingAddress",$billingAddress);
	// $:console.log("shipmentAddress",$shipmentAddress);
	export let toggle
	export let addressError

	const dispatch = createEventDispatcher()

	let secondMail = browser ? JSON.parse(localStorage.getItem("secondMail")) : null
	taxNumber.set(profile?.gstNumber)

	let email = secondMail === null ? $page.data?.authedUser?.email : secondMail
	let taxType = "GST"
	let emailError = ''
	let isForm = false
	let actionName
	let formData
	let isShowbox = true

	let regex = {
		regexGST:/^[0-9]{2}[A-Za-z]{1}/,
		regexVAT:/^[A-Za-z]{2}[0-9]{1}[0-9]{2,12}/,
	}

	let currentAddress = {
		firstname:profile?.firstname,
		lastname:profile?.lastname,
		address:profile?.address1,
		city:profile?.city,
		country:profile?.country,
		postalcode:profile?.postalcode,
		state:profile?.state,
	}

     let filteredBillingAddress
     let filteredShippingAddress
     let profileAddress = "N/A"
	 $:{
	 filteredBillingAddress = profile?.billingAddress ? profile?.billingAddress.find(x=>x.isDefault === true) : undefined
	 filteredShippingAddress = profile?.shippingAddress ? profile?.shippingAddress.find(x=>x.isDefault === true) : undefined
	 if (
			profile?.firstname ||
			profile?.lastname ||
			profile?.address1 ||
			profile?.city ||
			profile?.country ||
			profile?.state ||
			profile?.postalcode
		) {
			profileAddress = `${profile?.firstname || 'N/A'} ${profile?.lastname || ''}, ${profile?.address1 || 'N/A'}, ${profile?.city || 'N/A'}, ${profile?.country || 'N/A'}, ${profile?.state || 'N/A'}, ${profile?.postalcode || 'N/A'}`;
		}
   
	if (filteredBillingAddress !== undefined) {
		const { address, city, state, country, postalcode } =
			filteredBillingAddress;

		$billingAddress = [profile?.firstname, profile?.lastname, address, city, state, country, postalcode]
			.filter(Boolean)
			.join(', ');
	} else {
		$billingAddress = profileAddress || '';
	}

	if (filteredShippingAddress !== undefined) {
		const { address, city, state, country, postalcode } =
			filteredShippingAddress;

		$shipmentAddress = [profile?.firstname, profile?.lastname, address, city, state, country, postalcode]
			.filter(Boolean)
			.join(', ');
	} else {
		$shipmentAddress = profileAddress || '';
	}
     }
	// const validateEmail = (emailTest)=>{
	// 	if(emailTest.length < 5 ){
	// 		return
	// 	}
	// 	!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailTest) && !isFreeEmail(emailTest) && !isCompanyEmail(emailTest) ? emailError = "invalid email address" : emailError = ""
	// 	if(emailTest.length > 7 && emailError.length === 0 && $taxError.length === 0){
	// 	  toggle(false)
	//     }else{
	// 		toggle(true)
	// 	}
    //     dispatch("otherData",{email,taxNumber:$taxNumber.toUpperCase()})
	
	// }
	const validateTax = (taxNum)=>{
		if(!taxNum.length){
			$taxError = ""
			return
		}
	   if(taxNum.length < 3){
		$taxError = "invalid GST number"
          return
	   } 
	   !regex.regexGST.test(taxNum) || taxNum.length > 15 || taxNum.length< 15 ? $taxError = "invalid GST number": $taxError = ""
	   taxNumber.set(taxNum)
	}

	const validatePhone = (phone)=>{
		
	 let phonePattern
	 phonePattern = countryCodes.find((country)=>$billingAddress.toLowerCase().includes(country.name.toLowerCase()))
	 phonePattern = countryCodes.find((country)=>$shipmentAddress.toLowerCase().includes(country.name.toLowerCase()))
	 console.log(phonePattern);
	 if(!phone.length){
		$phoneError = "Phone number is required"
		return
	 } 
	 if(!/^[0-9\s\-\+]+$/.test(phone)){
		$phoneError = `Please enter a valid phone number for ${phonePattern.name}.`
		return
	 }
     const pnumber = parsePhoneNumber(phone,phonePattern.code);
	 console.log(pnumber?.isValid(),pnumber?.country,pnumber?.getType());
     if( pnumber && pnumber?.isValid() && pnumber?.country === phonePattern.code && (pnumber.getType() === 'MOBILE' || pnumber.getType() === 'FIXED_LINE_OR_MOBILE' || pnumber.getType() === 'FIXED_LINE')){
		$phoneError = ""
	 }else{
		$phoneError = `Please enter a valid phone number for ${phonePattern.name}.`

	 }
	}
	const handleDispatchEvent =(e)=>{
		console.log(e.detail,"detail");
		//if(e.detail.success){
			invalidate("data:checkout")
		//}
	}

	// const handleVerifyEmail = ()=>{
	// 	loadingEmail = true
	// 	return async({result})=>{
	// 	    console.log(result,"email");
	// 		loadingEmail = false
	// 		if(result.data.isSendMail){
	// 			isOtp = true
	// 		}
	// 	}
	// }

    let concatString,concatString2,array,array2,containsNA,containsNA2
	$:{
	  concatString = $billingAddress
	  concatString2 = $shipmentAddress

	  console.log("concatString",concatString);
	  

      array = concatString.split(',').map(item => item.trim());
      array2 = concatString2.split(',').map(item => item.trim());

      containsNA = array.some(item => item === "N/A");
      containsNA2 = array2.some(item => item === "N/A");
	  console.log("containsNA",containsNA);
	  
	}
	$:console.log(containsNA,containsNA2,addressError);

    onMount(()=>{
		dispatch("otherData",{email,taxNumber:$taxNumber?.toUpperCase()})
	})
</script>


<div class="md:flex gap-6 mt-2">
	<div class="w-full md:w-1/2 space-y-2">
		<div class=" flex items-center justify-between">
		   <h2 class=" font-semibold text-sm"><span class=" text-red-500">*</span>Billing Address</h2>
           <Button variant="hover" 
		   eventFunction={()=>{
			    formData ={}
				isForm = true
				actionName = "billingaddress"
				let address = filteredBillingAddress === undefined ? currentAddress : filteredBillingAddress
				let alter = profile?.billingAddress ? false : true
				formData = {userId:profile?._id,addAlternate:alter,...address}
				}} 
		   size="flex items-center gap-1 sm:text-xs py-0.5 px-3 font-medium">
			<Icon icon="ic:baseline-edit" class=" text-sm"/> Edit
		   </Button>
		</div>
		<textarea bind:value={$billingAddress} disabled class="w-full border border-gray-300 text-sm rounded p-3" />
		<p class="{ containsNA ? "" :"hidden"} text-xs text-red-500">Please add billing address</p>
	</div>
	<div class="w-full md:w-1/2 space-y-2">
		<div class=" flex items-center justify-between">
			<h2 class=" font-semibold text-sm"><span class=" text-red-500">*</span>Shipping Address</h2>
			<Button variant="hover"
			eventFunction={()=>{
				formData ={}
				isForm = true
				actionName = "shippingaddress"
				console.log(filteredShippingAddress,"ddd");
				let address = filteredShippingAddress === undefined ? currentAddress : filteredShippingAddress
				let alter = profile?.shippingAddress ? false : true
				formData = {userId:profile?._id,addAlternate:alter,...address}
		   }} 
			 size="flex items-center gap-1 sm:text-xs py-0.5 px-3 font-medium">
			 <Icon icon="ic:baseline-edit" class=" text-sm"/> Edit
			</Button>
		 </div>
		<textarea bind:value={$shipmentAddress} disabled class="w-full border border-gray-300 text-sm rounded p-3" />
		<p class="{ containsNA2 ? "" :"hidden"} text-xs text-red-500">Please add shipping address</p>
	</div>
</div>

<div class=" flex flex-col sm:flex-row items-start gap-4 mt-2">
	<!-- <div class=" w-full space-y-4">
	    <form method="POST" action="?/verifyemail" use:enhance={handleVerifyEmail} class=" w-full flex gap-4 items-center">
		    <label for="" class=" {profile?.email === email || secondMail === email || hideBtn ? " w-full": "w-full"}  text-sm font-semibold font-roboto">Email <br>
		    	<input type="text" name="email" bind:value={email} disabled on:input={e=>validateEmail(e.target.value)} 
		    	class=" w-full border-1 font-normal text-sm rounded border-gray-300 px-2.5 py-2 outline-none focus:ring-0 focus:border-primary-500"><br>
		    </label>
	    </form>

	</div> -->
	 <div class=" w-full md:flex">
		<label for="" class=" w-full text-sm font-semibold"><h2 class=" font-semibold text-sm"><span class=" text-red-500">*</span>Phone Number</h2>
		<input type="text" on:input={e=>validatePhone(e.target.value)} bind:value={$phoneNumber} class=" uppercase w-full font-normal text-sm border-1 rounded border-gray-300 px-2.5 py-2 outline-none focus:ring-0 focus:border-primary-500"><br>
		<p class="{$phoneError.length ? "": "hidden text-green-400"} text-xs font-normal text-red-500 ">{$phoneError}</p>
	   </label>
	</div>
    <div class=" w-full  md:flex">
	    <label for="" class=" w-full text-sm font-semibold"><h2 class=" font-semibold text-sm">{taxType} Number</h2>
	    	<input type="text" on:input={e=>validateTax(e.target.value)} bind:value={$taxNumber} class=" uppercase w-full font-normal text-sm border-1 rounded border-gray-300 px-2.5 py-2 outline-none focus:ring-0 focus:border-primary-500"><br>
	    	<p class="{$taxError.length ? "": "hidden text-green-400"} text-xs font-normal text-red-500 ">{$taxError}</p>
	    </label>
    </div>
</div>

{#if isForm}
	<AddressForm
	on:onSubmit={handleDispatchEvent}
	formdata={formData}
	handlePopupAddress = {()=>isForm = false}
	{actionName}
	email={profile?.email}
	billing={filteredBillingAddress}
	shipping={filteredShippingAddress}
	firstname={profile?.firstname} 
	lastname={profile?.lastname} 
	{isShowbox}
	/>
{/if}
