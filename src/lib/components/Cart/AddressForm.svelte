<script>
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";
    import { Toaster } from "svelte-sonner";
    import { createEventDispatcher } from "svelte";
    import { authedUser, cartTotalComps } from "$lib/stores/mainStores.js";
    import { invalidate } from "$app/navigation";
    import { countries, zipCodePatterns } from "$lib/data/constants.js";
    const dispatch = createEventDispatcher();
    export let formdata;
    export let actionName;
    export let isShowbox;
    export let handlePopupAddress;
    export let email;
    export let billing;
    export let shipping;
    console.log(billing, shipping);
    let message = "At least one address must be default";
    let showErrors = false;
    let phone = "";
    let postalcode = "";
    let address = "";
    let city = "";
    let state = "";
    let country = "";
    let errors = {};
    let prevCountry = "";

    $: if (country !== prevCountry) {
        if (!formdata?.state) {
            state = "";
        }
        prevCountry = country;
    }

    const states = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
    ];

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handleAddress = (type, checked) => {
        if (checked === true) {
            if (type === "billing") {
                (email = billing?.email || email),
                    (phone = billing?.phone || phone),
                    (postalcode = billing?.postalcode || postalcode),
                    (city = billing?.city || city),
                    (address = billing?.address || address),
                    (state = billing?.state || state),
                    (country = capitalize(billing?.country) || country);
            } else if (type === "shipping") {
                (email = shipping?.email || email),
                    (phone = shipping?.phone || phone),
                    (postalcode = shipping?.postalcode || postalcode),
                    (city = shipping?.city || city),
                    (address = shipping?.address || address),
                    (state = shipping?.state || state),
                    (country = capitalize(shipping?.country) || country);
            } else {
                (email = formdata?.email || email),
                    (phone = formdata?.phone || phone),
                    (postalcode = formdata?.postalcode || postalcode),
                    (city = formdata?.city || city),
                    (state = formdata?.state || state),
                    (street = formdata?.street || street),
                    (country = formdata?.country
                        ? capitalize(formdata?.country)
                        : country);
            }
        } else {
            (email = formdata?.email || email),
                (phone = formdata?.phone || phone),
                (postalcode = formdata?.postalcode || postalcode),
                (city = formdata?.city || city),
                (state = formdata?.state || state),
                (address = formdata?.address || address),
                (country = formdata?.country
                    ? capitalize(formdata?.country)
                    : country);
        }
    };
    handleAddress();
    $: if (country.toLowerCase() === "india") {
        handleAddress();
    }

    let name;
    let errorMessage = "";
    actionName == "billingaddress" ? (name = "Billing") : (name = "Shipping");
    console.log(formdata, "isdefalt");
    const handleCheckbox = (checked, Default) => {
        if (Default === true) {
            if (checked !== Default) {
                errorMessage = "One address has to be Default";
            }
            if (checked === Default) {
                errorMessage = "";
            }
            console.log(errorMessage);
        } else {
            formdata.isDefault = true;
        }
    };

    let filteredCountries = countries;
    let showDropdown = false;
    let autoSelectedOnce = false;
    let countryDropdownRef;

    function selectCountry(selectedCountry) {
        country = selectedCountry.name;
        filteredCountries = countries;
        showDropdown = false;
        validateForm("country");
        validatePhoneNumber(country, phone);
        validatePostalCode(country, postalcode);
        delete errors.country;
        autoSelectedOnce = false;
    }

    function toggleDropdown() {
        showDropdown = !showDropdown;
    }

    function handleFormClick(event) {
        const isInCountry = countryDropdownRef?.contains(event.target);
        if (!isInCountry) {
            showDropdown = false;
        }
    }

    function filterCountries(event) {
        const searchTerm = event.target.value.toLowerCase();
        const isDialCode = /^\d+$/.test(searchTerm);
        showDropdown = true;
        autoSelectedOnce = searchTerm.length < 3 ? false : autoSelectedOnce;

        if (isDialCode) {
            filteredCountries = countries.filter(
                (country) => country.code.replace("+", "") === searchTerm,
            );
            if (filteredCountries.length === 0) {
                filteredCountries = countries.filter(
                    (country) =>
                        country.code.replace("+", "").endsWith(searchTerm) &&
                        country.code.replace("+", "").length ===
                            searchTerm.length + 1,
                );
            }
        } else {
            // Filter countries by name or code
            filteredCountries = countries.filter(
                (country) =>
                    country.name.toLowerCase().includes(searchTerm) ||
                    country.code.toLowerCase().includes(searchTerm),
            );

            // Sort so that those starting with the search term come first
            filteredCountries.sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();

                const aStarts = aName.startsWith(searchTerm);
                const bStarts = bName.startsWith(searchTerm);

                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return aName.localeCompare(bName); // fallback alphabetical sort
            });
        }

        // Auto-select if only one match and length is enough
        if (
            filteredCountries.length === 1 &&
            searchTerm.length >= 2 &&
            !autoSelectedOnce
        ) {
            const autoSelectedCountry = filteredCountries[0];
            setTimeout(() => {
                country = autoSelectedCountry.name;
                selectCountry(autoSelectedCountry);
                autoSelectedOnce = true;
            }, 200);
        } else {
            country = searchTerm;
        }
    }

    function validatePhoneNumber(countryCode, phone) {
        if (!countryCode) {
            const { phone, ...rest } = errors;
            errors = { ...rest };
            return true;
        }

        const country = getCountryByCode(countryCode);
        if (!country) {
            errors = {
                ...errors,
                phone: "Invalid country selected",
                country: "Invalid country selected",
            };
            return false;
        }
    }

    function getCountryByCode(name) {
        const country = countries.find((c) => c.name === name);
        return country ? country.name : null;
    }

    function validateZipCode() {
        if (!country || country === "Select...") {
            errors = {
                ...errors,
                postalcode: "Please select the country first",
            };
            return;
        }

        const pattern = zipCodePatterns[country] || zipCodePatterns.Default;

        if (!postalcode) {
            errors = { ...errors, postalcode: "Postal code is required" };
        } else if (!pattern.test(postalcode)) {
            errors = {
                ...errors,
                postalcode: `Please enter a valid postal code for ${country}.`,
            };
        } else {
            const { postalcode, ...rest } = errors;
            errors = { ...rest };
        }
    }

    function validateForm(fieldName) {
        if (!fieldName || fieldName === "address") {
            if (!address || !/^[a-zA-Z0-9\s,.'\-/#()]*$/.test(address)) {
                errors.address =
                    "Address is required and can contain only letters, numbers, and a few special characters.";
            } else {
                delete errors.address;
            }
        }

        if (!fieldName || fieldName === "country") {
            //console.log('sksksksksksks3',actionName,country,billing.country);
            if (!country || country === "country") {
                if (!country || country === "") {
                    errors.country = "Please select a country";
                } else {
                    delete errors.country;
                }
            }
        }

        if (!fieldName || fieldName === "state") {
            const trimmedState = state?.trim();
            const trimmedCountry = country?.trim();

            if (!trimmedCountry && state.length !== 0) {
                errors = {
                    ...errors,
                    state: "Please select the country before filling the state",
                };
            } else if (!trimmedState) {
                errors = { ...errors, state: "State is required" };
            } else if (state && !/^[a-zA-Z\s.'-]+$/.test(trimmedState)) {
                errors = {
                    ...errors,
                    state: "Please enter a valid state name",
                };
            } else {
                const { state, ...rest } = errors;
                errors = { ...rest }; // remove state error
            }
        }

        const pattern = zipCodePatterns[country] || zipCodePatterns.Default;

        if (!fieldName || fieldName === "postalcode") {
            if (!postalcode) {
                errors.postalcode = "Postal code is required";
            } else if (!pattern.test(postalcode)) {
                errors.postalcode = `Please enter a valid postal code for ${country}.`;
            } else {
                delete errors.postalcode;
            }
        }

        if (Object.keys(errors).length > 0) {
            return false;
        }

        return true;
    }
    function validatePostalCode(countryCode, postalcode) {
        const selectedCountry = countries.find(
            (country) => country.name === countryCode,
        );
        if (selectedCountry && selectedCountry.postalRegex && postalcode) {
            const regex = selectedCountry.postalRegex;
            if (!regex.test(postalcode)) {
                errors.postalcode =
                    "Please enter a valid postal code for the selected country";
            } else {
                delete errors.postalcode;
            }
        }
    }

    function otherstr() {
        const found = countries.find(
            (c) => c.name.toLowerCase().trim() === country.toLowerCase().trim(),
        );

        if (!found && country.length !== 0) {
            errors.country = "Please select a valid country from the dropdown";
            return false;
        } else {
            delete errors.country;
            return true;
        }
    }

    function handleSubmit(event) {
        const isCountryValid = otherstr();
        console.log("isCountryValid", isCountryValid);

        if (!isCountryValid || !validateForm()) {
            showErrors = true;
            event.preventDefault();
        }
    }
    $: show = isShowbox ? `Edit ${name} Address` : `Add ${name} Address`;
    $: {
        if (country.trim()) {
            const exactMatch = countries.find(
                (c) => c.name.toLowerCase() === country.toLowerCase(),
            );
            if (exactMatch) {
                country = exactMatch.name;
                filteredCountries = [exactMatch];
                showDropdown = false;
            }
        }
    }

    function handleKeyDown(event) {
        if (
            event.key === "Enter" &&
            country.length >= 3 &&
            filteredCountries.length > 0
        ) {
            selectCountry(filteredCountries[0]);
            event.preventDefault();
        }
    }
    $: if (country) {
        validateForm("state");
    }
    $: if (state) {
        validateForm("state");
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class=" w-full h-screen fixed top-0 left-0 z-50 modal-wrapper"
    on:click={handlePopupAddress}
>
    <div
        class=" absolute w-full inset-0 backdrop-blur-sm bg-gray-500 bg-opacity-50 h-screen"
    ></div>
    <div class=" relative w-full h-full">
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <form
            method="POST"
            on:click={handleFormClick}
            action={`?/${actionName}`}
            on:click|stopPropagation
            use:enhance={() => {
                return async ({ result, update }) => {
                    console.log("result",result);
                    if (result.type === "success") {
                        invalidate()
                        handlePopupAddress();
                        await update();
                        dispatch("onSubmit", result.data);
                    }
                };
            }}
            on:keydown={(event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                }
            }}
            class=" bg-white max-w-96 sm:max-w-96 md:max-w-md lg:max-w-lg h-5/6 md:h-5/6 overflow-y-scroll scroll rounded mx-auto my-12 px-5 pb-6 sm:px-6 md:px-8 lg:px-10"
        >
            <h1
                class="text-center text-md sm:text-lg md:text-xl lg:text-2xl font-bold pt-6 md:pt-8 bg-white sticky top-0 z-20"
            >
                {show}
            </h1>
            <input type="hidden" name="userId" value={$authedUser.id} />
            <input type="hidden" name="actionType" value={actionName} />
            <input type="hidden" name="addressId" value={formdata.addressId} />
            <input
                type="hidden"
                name="addAlternate"
                value={formdata.addAlternate}
            />
            <input
                type="hidden"
                name="firstname"
                value={formdata.firstname || ""}
            />
            <input
                type="hidden"
                name="lastname"
                value={formdata.lastname || ""}
            />
            <div class=" text-sm flex items-center gap-2 py-1">
                {#if actionName === "billingaddress"}
                    {#if shipping}
                        <input
                            class=" focus:ring-0 outline-none text-primary-500"
                            on:change={(e) => {
                                handleAddress("shipping", e.target.checked);
                                setTimeout(() => {
                                    handleAddress("shipping", e.target.checked);
                                }, 400);
                            }}
                            type="checkbox"
                        /> same as shipping address
                    {/if}
                {:else if billing}
                    <input
                        class=" focus:ring-0 outline-none text-primary-500"
                        on:change={(e) => {
                            handleAddress("billing", e.target.checked);
                            setTimeout(() => {
                                handleAddress("billing", e.target.checked);
                            }, 400);
                        }}
                        type="checkbox"
                    /> same as billing address
                {/if}
            </div>
            <label
                class="w-full text-xs md:text-sm font-medium mt-1"
                for="country">Country</label
            >
            <div class="relative z-10" bind:this={countryDropdownRef}>
                <div
                    class="flex items-center border-1 border-gray-300 rounded my-1 overflow-hidden"
                >
                    <input
                        type="text"
                        name="country"
                        maxlength="30"
                        bind:value={country}
                        placeholder="Search Country"
                        on:input={toggleDropdown}
                        on:click={toggleDropdown}
                        on:input={filterCountries}
                        on:input={delete errors.country}
                        on:keydown={handleKeyDown}
                        on:input={otherstr}
                        on:input={() => {
                            country = country.trimStart();
                        }}
                        class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-none"
                        required
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-500 transition-transform duration-200 cursor-pointer mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                        style:transform={showDropdown
                            ? "rotate(180deg)"
                            : "rotate(0deg)"}
                        on:click={toggleDropdown}
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
                {#if showDropdown}
                    <ul
                        class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto"
                    >
                        {#each filteredCountries as { name, code }}
                            <li
                                on:click|stopPropagation={() =>
                                    selectCountry({ name, code })}
                                class="cursor-pointer px-1 py-0 sm:text-sm text-xs hover:bg-gray-200"
                            >
                                <option value={code}>{name} ({code})</option>
                            </li>
                        {/each}
                        {#if filteredCountries.length === 0}
                            <li class="px-2 py-1 text-gray-500">
                                No results found
                            </li>
                        {/if}
                    </ul>
                {/if}
            </div>

            {#if errors?.country}
                <p class="text-red-500 text-xs mt-1">{errors.country}</p>
            {/if}
            <label
                class="w-full hidden text-xs md:text-sm font-medium mt-1"
                for="phone">Phone</label
            >
            <input
                class="w-full hidden focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
                type="tel"
                name="phone"
                bind:value={phone}
                title="Please enter a valid phone number"
                on:input={() => {
                    validateForm("phone");
                    validatePhoneNumber(country, phone);
                    phone = phone.trimStart();
                }}
            />
            {#if errors?.phone}
                <p class="text-red-500 text-xs mt-1">{errors.phone}</p>
            {/if}
            <!-- {#if showErrors && phone.length === 0}
				<span class="text-red-500 text-xs block">Phone is required</span>
		{/if} -->
            <label
                class="w-full text-xs md:text-sm font-medium mt-1 block"
                for="address">Address</label
            >
            <input
                class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
                type="text"
                name="address"
                maxlength="160"
                bind:value={address}
                on:input={() => {
                    address = address.trimStart();
                }}
            />
            {#if address.length > 0 && !/^[a-zA-Z0-9\s,.'\-/#()]*$/.test(address)}
                <span class="text-red-500 text-xs block"
                    >Please enter a valid address</span
                >
            {/if}
            {#if showErrors && address.length === 0}
                <span class="text-red-500 text-xs block"
                    >Address is required</span
                >
            {/if}
            <label class="w-full text-xs md:text-sm font-medium mt-1" for="city"
                >City</label
            >
            <input
                class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
                type="text"
                name="city"
                maxlength="30"
                bind:value={city}
                on:input={() => {
                    city = city.trimStart();
                }}
            />
            {#if city.length > 0 && !/^[a-zA-Z\s.'-]+$/.test(city)}
                <span class="text-red-500 text-xs block"
                    >Please enter a valid city Name</span
                >
            {/if}
            {#if showErrors && city.length === 0}
                <span class="text-red-500 text-xs block">City is required</span>
            {/if}
            <label
                class="w-full text-xs md:text-sm font-medium mt-1"
                for="state">State</label
            >

            {#if country === "India" || country === "india"}
                <select
                    class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
                    name="state"
                    bind:value={state}
                    on:input={() => {
                        state = state.trimStart();
                    }}
                >
                    <option value="" disabled selected>Select a State</option>
                    {#each states as s}
                        <option value={s}>{s}</option>
                    {/each}
                </select>
                {#if state.length > 0 && !/^[a-zA-Z\s.'-]+$/.test(state)}
                    <span class="text-red-500 text-xs block"
                        >Please enter a valid state Name</span
                    >
                {/if}
            {:else}
                <input
                    class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
                    type="text"
                    name="state"
                    maxlength="30"
                    bind:value={state}
                    on:input={() => {
                        validateForm("state");
                        state = state.trimStart();
                    }}
                />
                <!-- {#if showErrors && !state}
      <span class="text-red-500 text-xs block">state is required</span>
      {/if} -->
            {/if}
            {#if errors.state}
                <span class="text-red-500 text-xs block">{errors.state}</span>
            {/if}

            <label
                class="w-full text-xs md:text-sm font-medium mt-1"
                for="postalcode">Postal code</label
            >
            <input
                class="w-full focus:ring-0 focus:border-primary-400 px-2 py-1.5 md:py-2 text-xs md:text-sm border-1 rounded my-1 border-gray-300"
                bind:value={postalcode}
                type="text"
                id="postalcode"
                name="postalcode"
                maxlength="15"
                placeholder="Postal Code"
                on:input={() => {
                    postalcode = event.target.value.replace(/[^0-9]/g, "");
                    validateZipCode(postalcode, country);
                    postalcode = postalcode.trimStart();
                }}
            />
            {#if errors?.postalcode}
                <p class="text-red-500 text-xs mt-1">{errors.postalcode}</p>
            {/if}
            {#if showErrors && postalcode.length === 0 && !errors.postalcode}
                <span class="text-red-500 text-xs block"
                    >Postalcode is required</span
                >
            {/if}
            <div class=" flex items-center mt-4 mb-2">
                <input
                    type="checkbox"
                    name="isDefault"
                    class="focus:ring-0 text-primary-400"
                    on:change={(e) => {
                        if (!e.target.checked) {
                            e.preventDefault();
                            e.target.checked = true;
                            e.target.style.cursor = "not-allowed";
                            e.target.style.borderColor = "red";
                            toast.error(message);
                        } else {
                            handleCheckbox(true, formdata.isDefault);
                        }
                    }}
                    checked={formdata.isDefault}
                    value={formdata.isDefault}
                    id=""
                />
                <label
                    class="w-full text-xs md:text-sm font-medium ml-2"
                    for="isDefault">Set this address as default</label
                >
            </div>
            <div class="my-2 flex flex-row gap-2">
                <button
                    on:click={handlePopupAddress}
                    type="button"
                    class="px-4 py-2 bg-gray-200 text-description rounded hover:bg-gray-300 focus:outline-none focus:ring-0 w-1/2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="font-roboto font-medium py-2 px-2 w-1/2 text-xs sm:text-sm rounded bg-primary-600 hover:bg-primary-800 text-white"
                    on:click={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </form>
    </div>
</div>
<Toaster position="bottom-right" richColors />
