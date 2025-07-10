<script>
  import { onMount } from "svelte";
  import { enhance, applyAction } from "$app/forms";
  import { toast, Toaster } from "svelte-sonner";
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";
  import {
    countries,
    phoneNumberPatterns,
    countryCurrencyMap,
  } from "$lib/Data/constants.js";
  let username = "";
  let email = "";
  let country = "";
  let companyName = "";
  let jobTitle = "";
  let companyType = "";
  let lastName = "";
  let firstName = "";
  let currency = "";
  let isAccountSelected = false;
  let isTermsAccepted = false;
  let password = "";
  let passwordConfirm = "";
  let searchTerm = "";
  let phone = "";
  let form5;
  let error = {};
  let isLoading = false;
  let emailSent = false;
  let verificationMessage = "";
  let ProfileEmailVerified = false;
  let isOtpVerified = true;
  let displayMessage = "";
  let enteredOtp = "";
  let errorCount = "";
  let tanNumber = "";
  let gstNumber = "";
  let highlightedIndex = -1;
  let dropdownEl;
  let showRedirectModal = false;
  let isProcessing = false;
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  const callbackUrl = import.meta.env.VITE_LINKEDIN_CALLBACK_URL;
  const scope = import.meta.env.VITE_LINKEDIN_SCOPE;
  const baseUrl = import.meta.env.VITE_LINKEDIN_BASE_URL;
  // Google
  const GoogleclientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GooglecallbackUrl = import.meta.env.VITE_GOOGLE_CALLBACK_URL;
  const Googlescope = import.meta.env.VITE_GOOGLE_SCOPE;
  const GooglebaseUrl = import.meta.env.VITE_GOOGLE_BASE_URL;
  const googleUrl = `${GooglebaseUrl}?response_type=code&client_id=${GoogleclientId}&redirect_uri=${encodeURIComponent(GooglecallbackUrl)}&scope=${Googlescope}&access_type=offline&prompt=consent`;
  const linkedinUrl = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=${scope}`;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%_\-*])[A-Za-z\d!@#$%_\-*]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegex = /^[A-Za-z]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  function validateUsername() {
    let newErrors = { ...errors }; // Create a new object for reactivity

    if (!username) {
      newErrors.username = "Required";
    } else if (/^[^a-zA-Z]/.test(username)) {
      newErrors.username = "Username must start with a letter";
    } else if (/[^a-zA-Z0-9_]/.test(username)) {
      newErrors.username =
        "Username can include only letters, numbers, and underscore ( _ )";
    } else if (/^[0-9]+$/.test(username)) {
      newErrors.username = "Username cannot contain only numbers";
    } else if (/^[_]+$/.test(username)) {
      newErrors.username = "Username cannot contain only underscores ( _ )";
    } else if (!/^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9_]+$/.test(username.trim())) {
      newErrors.username = "Username must contain at least 3 letters";
    } else if (username.length < 3) {
      newErrors.username = "Please enter at least 3 characters";
    } else {
      delete newErrors.username;
    }

    errors = newErrors; // Reassign errors to trigger reactivity
  }

  function validateEmail() {
    let newErrors = { ...errors }; // Create a new object for reactivity

    if (!email) {
      newErrors.email = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email.";
    } else {
      delete newErrors.email;
    }

    errors = newErrors; // Reassign errors to trigger reactivity
  }

  function validateFirstName() {
    let newErrors = { ...errors }; // Ensure reactivity

    if (!firstName) {
      newErrors.firstName = "Required";
    } else if (!/^[a-zA-Z\s]+$/.test(firstName)) {
      newErrors.firstName = "First name can only contain letters and spaces";
    } else {
      delete newErrors.firstName;
    }

    errors = newErrors; // Update errors object to trigger reactivity
  }

  function validateLastName() {
    let newErrors = { ...errors }; // Ensure reactivity

    if (lastName && !/^[a-zA-Z\s]+$/.test(lastName.trim())) {
      newErrors.lastName = "Last name can only contain letters and spaces";
    } else {
      delete newErrors.lastName;
    }

    errors = newErrors; // Update errors object to trigger reactivity
  }

  let errors = {};
  let passwordStrength = 0;

  function validatePassword() {
    typing = password.length > 0;

    let newErrors = { ...errors };

    if (!password) {
      newErrors.password = "Required";
      passwordStrength = 0;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (password.toLowerCase().includes("password")) {
      newErrors.password = "Password cannot contain common or guessable text";
    } else if (/[^a-zA-Z0-9!@#$%^&*]/.test(password)) {
      newErrors.password = "Only !@#$%^&* special characters are allowed";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
        password,
      )
    ) {
      newErrors.password =
        "Ensure your password matches the format outlined below";
      passwordStrength = 50;
    } else {
      delete newErrors.password;
      passwordStrength = calculateStrength(password);
    }
    errors = newErrors;
  }

  function calculateStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[!@#$%^&*-]/.test(password)) strength += 25;
    return strength;
  }

  $: calculateStrength(password);

  function validateConfirmPassword() {
    let newErrors = { ...errors };
    if (!passwordConfirm) {
      newErrors.passwordConfirm = "Required";
    } else if (passwordConfirm !== password) {
      newErrors.passwordConfirm = "Passwords do not match";
    } else {
      delete newErrors.passwordConfirm;
    }
    errors = newErrors; // Reassign to trigger reactivity
  }

  const handleResendemailOtp = () => {
    form5.requestSubmit();
  };

  let typing = false;

  function handleInput() {
    typing = true;
    enteredOtp = enteredOtp.replace(/[^0-9]/g, "").trim();
  }

  let currencies = [
    "ALL",
    "AFN",
    "DZD",
    "EUR",
    "AOA",
    "XCD",
    "ARS",
    "AMD",
    "AUD",
    "EUR",
    "AZN",
    "BSD",
    "BHD",
    "BDT",
    "BBD",
    "BYN",
    "EUR",
    "BZD",
    "XOF",
    "BTN",
    "BOB",
    "BAM",
    "BWP",
    "BRL",
    "BND",
    "BGN",
    "XOF",
    "BIF",
    "CVE",
    "KHR",
    "XAF",
    "CAD",
    "XAF",
    "XAF",
    "CLP",
    "CNY",
    "COP",
    "KMF",
    "CDF",
    "XAF",
    "CRC",
    "HRK",
    "CUP",
    "EUR",
    "CZK",
    "DKK",
    "DJF",
    "XCD",
    "DOP",
    "USD",
    "EGP",
    "USD",
    "XAF",
    "ERN",
    "EUR",
    "SZL",
    "ETB",
    "FJD",
    "EUR",
    "EUR",
    "XAF",
    "GMD",
    "GEL",
    "EUR",
    "GHS",
    "EUR",
    "XCD",
    "GTQ",
    "GNF",
    "XOF",
    "GYD",
    "HTG",
    "HNL",
    "HUF",
    "ISK",
    "INR",
    "IDR",
    "IRR",
    "IQD",
    "EUR",
    "ILS",
    "EUR",
    "JMD",
    "JPY",
    "JOD",
    "KZT",
    "KES",
    "AUD",
    "KWD",
    "KGS",
    "LAK",
    "EUR",
    "LBP",
    "LSL",
    "LRD",
    "LYD",
    "CHF",
    "EUR",
    "EUR",
    "MGA",
    "MWK",
    "MYR",
    "MVR",
    "XOF",
    "EUR",
    "USD",
    "MRU",
    "MUR",
    "MXN",
    "USD",
    "MDL",
    "EUR",
    "MNT",
    "EUR",
    "MAD",
    "MZN",
    "MMK",
    "NAD",
    "AUD",
    "NPR",
    "EUR",
    "NZD",
    "NIO",
    "XOF",
    "NGN",
    "MKD",
    "NOK",
    "OMR",
    "PKR",
    "USD",
    "ILS",
    "PAB",
    "PGK",
    "PYG",
    "PEN",
    "PHP",
    "PLN",
    "EUR",
    "QAR",
    "RON",
    "RUB",
    "RWF",
    "XCD",
    "XCD",
    "XCD",
    "WST",
    "EUR",
    "STN",
    "SAR",
    "XOF",
    "RSD",
    "SCR",
    "SLL",
    "SGD",
    "EUR",
    "EUR",
    "SBD",
    "SOS",
    "ZAR",
    "KRW",
    "EUR",
    "LKR",
    "SDG",
    "SRD",
    "SEK",
    "CHF",
    "SYP",
    "TWD",
    "TJS",
    "TZS",
    "THB",
    "XOF",
    "TOP",
    "TTD",
    "TND",
    "TRY",
    "TMT",
    "AUD",
    "UGX",
    "UAH",
    "AED",
    "GBP",
    "USD",
    "UYU",
    "UZS",
    "VUV",
    "EUR",
    "VES",
    "VND",
    "YER",
    "ZMW",
    "ZWL",
  ];

  function updateCurrency(country) {
    const normalizedCountry = country.trim().toLowerCase();
    const selectedCurrency = Object.keys(countryCurrencyMap).find(
      (key) => key.toLowerCase() === normalizedCountry,
    );

    if (selectedCurrency) {
      currency = countryCurrencyMap[selectedCurrency];
    } else {
      currency = "";
    }
  }

  currencies = currencies.sort();

  function getCountryByCode(code) {
    const country = countries.find((c) => c.code === code || c.name === code);
    return country ? country.name : null;
  }

  function getPhonePattern(countryCode) {
    const countryName = getCountryByCode(countryCode);
    if (!countryName) return "^[0-9]+$";
    const regex = phoneNumberPatterns[countryName];
    if (!regex) return "^[0-9]+$";
    return regex.source;
  }

  function validatePhoneNumber(countryName, phone) {
    let newErrors = { ...errors };

    if (!phone) {
      newErrors.phone = "Required";
    } else if (!countryName) {
      newErrors.phone = "Select a country before entering your phone number";
    } else {
      const matchedCountry = countries.find((c) => c.name === countryName);

      if (!matchedCountry) {
        newErrors.phone = "Invalid country selected to validate phone";
        // newErrors.country = "Invalid country selected";
      } else {
        const phonePattern = getPhonePattern(matchedCountry.code);
        const phoneRegex = new RegExp(phonePattern);

        if (!phoneRegex.test(phone)) {
          newErrors.phone = `Please enter a valid phone number for ${countryName}.`;
        } else {
          delete newErrors.phone;
          delete newErrors.country;
        }
      }
    }
    errors = newErrors;
  }

  const countriesLength = countries.length;
  const phoneNumberPatternsLength = Object.keys(phoneNumberPatterns).length;
  const cur = currencies.length;
  const mapLength = Object.keys(countryCurrencyMap).length;
  const countryNames = countries.map((country) => country.name);
  const missingPatterns = countryNames.filter(
    (name) => !phoneNumberPatterns.hasOwnProperty(name),
  );

  function validateCountry() {
    if (!country || country.trim() === "") {
      errors.country = "Required";
    } else {
      const match = countries.find(
        (c) => c.name.toLowerCase() === country.toLowerCase(),
      );
      if (!match) {
        errors.country = "Invalid country selected";
      } else {
        delete errors.country;
      }
    }
  }

  let filteredCountries = countries;
  let showDropdown = false;

  function selectCountry(selectedCountry) {
    country = selectedCountry.name;
    searchTerm = selectedCountry.name;
    showDropdown = false;
    highlightedIndex = -1;
    validateCountry();
    // validatePhoneNumber(country, phone);
    updateCurrency(country);
    delete errors.country;
    localStorage.setItem("selectedCountry", JSON.stringify(selectedCountry));
  }

  function handleSearchChange() {
    filteredCountries = countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    showDropdown = filteredCountries.length > 0 && searchTerm !== "";
  }

  function handleKeyDown(event) {
    const exactCountryMatch = countries.some(
      (c) => c.name === country && c.name === searchTerm,
    );

    if (
      exactCountryMatch &&
      !(
        event.key === "Backspace" ||
        event.key === "Delete" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "Home" ||
        event.key === "End" ||
        event.key === "Tab" ||
        event.key === "Escape" ||
        event.ctrlKey ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      )
    ) {
      const input = document.querySelector('input[name="country"]');
      if (
        input &&
        (input.selectionStart !== input.selectionEnd ||
          input.selectionStart === 0)
      ) {
        return true;
      }
      event.preventDefault();
      return false;
    }

    if (showDropdown) {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (filteredCountries.length > 0) {
            highlightedIndex =
              (highlightedIndex + 1) % filteredCountries.length;
            scrollToHighlighted();
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (filteredCountries.length > 0) {
            highlightedIndex =
              highlightedIndex <= 0
                ? filteredCountries.length - 1
                : highlightedIndex - 1;
            scrollToHighlighted();
          }
          break;
      }
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      showDropdown = true;
      if (filteredCountries.length > 0) {
        highlightedIndex = 0;
      }
      event.preventDefault();
    }

    if (event.key === "Enter") {
      if (
        highlightedIndex >= 0 &&
        highlightedIndex < filteredCountries.length
      ) {
        selectCountry(filteredCountries[highlightedIndex]);
        event.preventDefault();
      } else if (filteredCountries.length > 0) {
        selectCountry(filteredCountries[0]);
        event.preventDefault();
      } else {
        errors.country = "Invalid country selected";
        showDropdown = true;
      }
    } else if (event.key === "Escape") {
      showDropdown = false;
      highlightedIndex = -1;
    }
  }

  function scrollToHighlighted() {
    if (!dropdownEl) return;
    const items = dropdownEl.querySelectorAll("li");
    if (items[highlightedIndex]) {
      items[highlightedIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }
  function toggleDropdown() {
    showDropdown = !showDropdown;
    if (showDropdown) {
      if (country.length > 0) {
        searchTerm = country;
        filterCountriesWithoutAutoSelect();
      } else {
        filteredCountries = countries;
      }
    }
  }

  function handleInputChange(event) {
    searchTerm = event.target.value;
    country = event.target.value;

    const isDeleting =
      event.inputType === "deleteContentBackward" ||
      event.inputType === "deleteContentForward";

    filterCountriesWithoutAutoSelect();
    showDropdown = true;

    const match = countries.find(
      (c) => c.name.toLowerCase() === searchTerm.toLowerCase(),
    );

    if (match) {
      delete errors.country;
    } else if (searchTerm.trim().length > 0) {
      errors.country = "Invalid country selected";
    } else {
      delete errors.country;
    }

    if (searchTerm.length > 0 && !isDeleting) {
      const codeSearch = searchTerm.replace("+", "").trim();
      if (codeSearch.length > 0) {
        const exactCodeMatches = filteredCountries.filter(
          (country) => country.code.replace("+", "") === codeSearch,
        );

        if (exactCodeMatches.length === 1) {
          selectCountry(exactCodeMatches[0]);
          return;
        }
      }

      const countriesStartingWith = filteredCountries.filter((country) =>
        country.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
      );

      if (countriesStartingWith.length === 1) {
        selectCountry(countriesStartingWith[0]);
      }
    }
  }

  function filterCountriesWithoutAutoSelect() {
    const countriesStartingWith = countries.filter((country) =>
      country.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
    );

    const countriesContaining = countries.filter(
      (country) =>
        !country.name.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
        country.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    filteredCountries = [...countriesStartingWith, ...countriesContaining];
    const codeMatches = countries.filter((country) =>
      country.code
        .replace("+", "")
        .includes(searchTerm.replace("+", "").toLowerCase()),
    );
    codeMatches.forEach((country) => {
      if (!filteredCountries.some((c) => c.name === country.name)) {
        filteredCountries.push(country);
      }
    });
  }

  function handleKeyDowncountry(event) {
    const exactCountryMatch = countries.some((c) => c.name === country);

    if (
      exactCountryMatch &&
      !(
        event.key === "Backspace" ||
        event.key === "Delete" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "Home" ||
        event.key === "End" ||
        event.key === "Tab" ||
        event.key === "Escape" ||
        event.ctrlKey
      )
    ) {
      event.preventDefault();
      return false;
    }

    if (
      event.key === "Enter" &&
      searchTerm.length >= 3 &&
      filteredCountries.length > 0
    ) {
      selectCountry(filteredCountries[0]);
      event.preventDefault();
    } else if (event.key === "Escape") {
      showDropdown = false;
    }
  }

  function filterCountries() {
    filteredCountries = countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code
          .replace("+", "")
          .includes(searchTerm.replace("+", "").toLowerCase()),
    );
    if (
      filteredCountries.length === 1 &&
      (filteredCountries[0].name.toLowerCase() === searchTerm.toLowerCase() ||
        filteredCountries[0].code.replace("+", "").toLowerCase() ===
          searchTerm.replace("+", "").toLowerCase())
    ) {
      selectCountry(filteredCountries[0]);
    } else {
      showDropdown = filteredCountries.length > 0 || searchTerm.length > 0;
    }
  }

  function validateGstNumber() {
    if (companyName && !gstNumber) {
      errors.gstNumber =
        "*GST Number is required when company name is provided.";
    } else {
      delete errors.gstNumber;
    }

    if (gstNumber) {
      if (!/^[0-9]{2}[A-Z0-9]+$/.test(gstNumber)) {
        errors.gstNumber = "Please provide a valid GST Number.";
      } else {
        delete errors.gstNumber;
      }
    } else {
      delete errors.gstNumber;
    }
  }

  function validateTanNumber() {
    if (tanNumber) {
      if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tanNumber)) {
        errors.tanNumber = "Please provide a valid TAN Number.";
      } else {
        delete errors.tanNumber;
      }
    } else {
      delete errors.tanNumber;
    }
  }

  function validateForm() {
    errors = {};
    if (companyName && !/^[a-zA-Z\s]+$/.test(companyName)) {
      errors.companyName = "Company name can only contain letters and spaces";
    } else {
      delete errors.companyName;
    }

    if (companyType && !/^[a-zA-Z\s]+$/.test(companyType)) {
      errors.companyType = "Company type can only contain letters and spaces";
    } else {
      delete errors.companyType;
    }
    if (companyName && !gstNumber) {
      errors.gstNumber =
        "*GST Number is required when company name is provided.";
    } else if (gstNumber && !/^[0-9]{2}[A-Z0-9]+$/.test(gstNumber)) {
      errors.gstNumber = "Please provide a valid GST Number.";
    } else {
      delete errors.gstNumber;
    }
    if (tanNumber) {
      if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tanNumber)) {
        errors.tanNumber = "Please provide a valid TAN Number";
      } else {
        delete errors.tanNumber;
      }
    } else {
      delete errors.tanNumber;
    }

    if (!country) {
      errors.country = "Required";
    } else {
      delete errors.country;

      const countryInput = document.querySelector('input[name="country"]');
      if (countryInput) {
        const previousDropdownState = showDropdown;
        showDropdown = false;
        handleInputChange(
          { target: countryInput, inputType: "insertText" },
          true,
        );
        showDropdown = previousDropdownState;
      }

      const countryExists = countries.some((c) => c.name === country);
      if (!countryExists) {
        errors.country = "Invalid country selected";
        errors.phone = "Invalid country selected to validate phone";
      } else {
        delete errors.country;
        delete errors.phone;
        validatePhoneNumber(country, phone);
      }
    }

    // validateUsername();
    validateEmail();
    validateFirstName();
    validateLastName();
    validatePhoneNumber(country, phone);
    validatePassword();
    validateConfirmPassword();

    const checkbox = document.querySelector('input[type="checkbox"]');
    if (!checkbox) {
      errors.termsAndConditions = "Required";
    } else if (!checkbox.checked) {
      errors.termsAndConditions =
        "You need to agree to the Terms of Service and Privacy Policy to proceed";
    } else {
      delete errors.termsAndConditions;
    }

    if (Object.keys(errors).length === 0 ) {
      // toast.error("Please verify your email to proceed");
    }

    // console.log(isOtpVerified, "isOtpVerified");
    console.log("Error object:", errors);
    errorCount = Object.keys(errors).length;
    console.log("Number of errors:", errorCount);

    return Object.keys(errors).length === 0 ;
  }

  const handleCheckboxChange = (event) => {
    isTermsAccepted = event.target.checked;
    if (isTermsAccepted) {
      delete errors.termsAndConditions;
    } else {
      errors.termsAndConditions =
        "You need to agree to the Terms of Service and Privacy Policy to proceed";
    }
  };

  async function handleFormSubmission({ cancel, formData }) {
    if (!validateForm()) {
      cancel();
      return;
    }
    // if (!validateForm()) {
    //   cancel();
    //   return;
    // }
    isProcessing = true;
    // formData.append("currency", currency);
    // formData.append("isEmailVerified", isOtpVerified);
    formData.append("email", email);
    return async ({ result, update }) => {
      console.log("result", result);
      isProcessing = false;

      if (result.type === "redirect") {
        await applyAction(result);
      }

      if (result.type === "success") {
        if (result.data.success) {
          await update();
          toast.success(result.data.message);

          await goto("/dashboard");
          location.reload();
        } else {
          const errorText = result.data.message;
          if (
            errorText !==
            "This email already exists. Please login or try with another."
          ) {
            toast.error(errorText);
          }

          if (
            errorText ===
            "This email already exists. Please login or try with another."
          ) {
            showRedirectModal = true;
          }
        }
      }
    };
  }

  let showBusinessDetails = false;
  let account;

  function toggleFields(event) {
    account = event.target.value;
    showBusinessDetails = event.target.value === "For a Business";
    showBusinessDetails = showBusinessDetails;
    isAccountSelected = true;
  }
  let passwordVisible = false;
  function togglePasswordVisibility() {
    passwordVisible = !passwordVisible;
    const input = document.getElementById("password");
    input.type = passwordVisible ? "text" : "password";
  }
  let confirmPasswordVisible = false;
  function toggleConfirmPasswordVisibility() {
    confirmPasswordVisible = !confirmPasswordVisible;
    const input = document.getElementById("passwordConfirm");
    input.type = confirmPasswordVisible ? "text" : "password";
  }
  function handleClickOutside(event) {
    if (!event.target.closest(".dropdown-container")) {
      showDropdown = false;
    }
  }
  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });

  function handleRedirectConfirm() {
    showRedirectModal = false;
    goto("/signin");
  }

  function handleRedirectCancel() {
    showRedirectModal = false;
  }

  function redirectTo(url) {
    window.location.href = url;
  }
</script>

<div
  class="flex flex-col md:flex-row justify-center z-50 items-start shadow-md my-24 rounded-lg p-10 md:p-0 max-w-5xl"
>
  <!-- <button
    on:click={() => goto("/")}
    class="absolute top-0.5 right-4 md:right-4 flex z-50 items-center justify-center py-2 px-2 sm:px-3 text-primary-500 bg-white hover:bg-primary-600 hover:text-white sm:rounded-md rounded-full transition duration-200 shadow-md"
  >
    <div class="flex items-center space-x-2">
      <Icon icon="mdi:home" class="text-xl" />
      <span class="hidden sm:inline text-sm font-medium">Back to Home</span>
    </div>
  </button> -->
  <div
    class="flex flex-col md:flex-row bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl"
  >
    <div
      class="w-full md:hidden md:w-3/5 p-8 md:pb-12 md:px-12 flex flex-col justify-center relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary-500/80 via-primary-500/80 to-primary-600/80 z-0"
      ></div>
      <div
        class="flex flex-col justify-center items-center p-4 rounded-lg z-10"
      >
        <h1 class="text-xl font-medium text-white mb-2">
          Welcome to Components2webs
        </h1>
        <p class="text-sm text-white opacity-90">
          Create a new account to get started.
        </p>
      </div>

      <div class="relative mt-16 z-10">
        <img src="/authimg/register.webp" alt="login" />
        <!-- <h1 class="text-2xl md:text-4xl font-bold text-white mb-6">
          Create Your Free Account
        </h1>
        <div class="md:w-72 w-20 h-1 bg-primary-50 mb-8"></div>
        <p class="text-white/90 sm:text-lg text-xs max-w-lg text-md mb-8">
         Join us and unlock powerful features tailored to you. Manage your
          activities, track progress, and connect with your community—all in one
          place.
        </p> -->
      </div>
    </div>

    <div
      class="content md:w-1/2 p-4 md:p-10 flex flex-col justify-center bg-white"
    >
      <h2 class="text-2xl font-bold text-primary-500 sm:pt-0 pt-2 sm:pb-2 pb-4">
        Register
      </h2>
      <p class="text-gray-500 mb-5 md:text-sm text-xs">
        Been here before? <a
          href="/login"
          class="text-primary-500 hover:text-primary-600 font-semibold"
          >Enter your account</a
        >
      </p>
      <!-- <p class="text-gray-500 mb-5">
      Already have an account? <a
        href="/login"
        class="underline text-primary-500 hover:text-primary-600">Login.</a
      >
    </p> -->

      <form
        method="POST"
        action="?/register"
        use:enhance={handleFormSubmission}
      >
        <!-- <div class="flex items-center gap-3 mx text-md mt-2 mb-5">
        <label class="flex items-center md:gap-2 font-medium">
          For a Business
          <input
            type="radio"
            name="account"
            value="For a Business"
            class="peer hidden"
            on:change={toggleFields}
          />
          <span
            class="w-4 h-4 rounded-full border border-black bg-white flex items-center justify-center peer-checked:border-primary-600 peer-checked:bg-primary-600"
          >
            <span class="w-2 h-2 rounded-full bg-white peer-checked:bg-white"
            ></span>
          </span>
        </label>
        <label class="flex items-center gap-2 font-medium">
          For Myself
          <input
            type="radio"
            name="account"
            value="For Myself"
            checked
            class="peer hidden"
            on:change={toggleFields}
          />
          <span
            class="w-4 h-4 rounded-full border border-black bg-white flex items-center justify-center peer-checked:border-primary-600 peer-checked:bg-primary-600"
          >
            <span class="w-2 h-2 rounded-full bg-white peer-checked:bg-white"
            ></span>
          </span>
        </label>
      </div> -->
        <!-- {#if showBusinessDetails} -->

        <!-- {/if} -->

        <!-- <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
        <div class="flex-1 mb-2 md:mb-0">
          <label
            for="companyname"
            class="block text-sm font-medium text-gray-600"
            >Company Name</label
          >
          <input
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
            type="text"
            name="companyname"
            bind:value={companyName}
            placeholder="Company Name"
            on:input={() => {
              errors.companyName = !companyName
                ? "*Required"
                : !/^[a-zA-Z\s]+$/.test(companyName)
                  ? "Company name can only contain letters and spaces"
                  : "";
            }}
          />
          <p class=" text-red-500 text-left text-xs">
            {errors?.companyName || ""}
          </p>
        </div>
        <div class="flex-1 mb-2 md:mb-0">
          <label
            for="companytype"
            class="block text-sm font-medium text-gray-600"
            >Company Type
          </label>
          <input
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
            type="text"
            name="companytype"
            bind:value={companyType}
            placeholder="Company Type"
            on:input={() => {
              errors.companyType = !companyType
                ? "*Required"
                : !/^[a-zA-Z\s]+$/.test(companyType)
                  ? "Company type can only contain letters and spaces"
                  : "";
            }}
          />
          <p class=" text-red-500 text-left text-xs">
            {errors?.companyType || ""}
          </p>
        </div>
      </div> -->

        <div class="mb-4 flex flex-col md:space-y-4">
          <div class="flex-1 mb-2 md:mb-0">
            <label
              for="firstName"
              class="block text-sm font-medium text-gray-600"
              ><span class="text-red-500">*</span> First Name</label
            >
            <input
              class="mt-1 block w-full p-2 border focus:outline-none border-gray-300 rounded-lg pl-5 focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
              type="text"
              name="firstName"
              maxlength="50"
              bind:value={firstName}
              placeholder="First Name"
              on:input={(e) => {
                firstName = e.target.value.trimStart();
                validateFirstName();
              }}
            />
            <p class=" text-red-500 text-left text-xs">
              {errors?.firstName || ""}
            </p>
          </div>
          <div class="flex-1 mb-2 md:mb-0">
            <label
              for="lastName"
              class="block text-sm font-medium text-gray-600"
              >Last Name
            </label>
            <input
              class="mt-1 block w-full p-2 border focus:outline-none border-gray-300 rounded-lg pl-5 focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
              type="text"
              name="lastName"
              maxlength="50"
              bind:value={lastName}
              placeholder="Last Name"
              on:input={(e) => {
                lastName = e.target.value.trimStart();
                validateLastName();
              }}
            />
            <p class=" text-red-500 text-left text-xs">
              {errors?.lastName || ""}
            </p>
          </div>
        </div>
        <div class="mb-4 flex flex-col md:space-y-4">
          <!-- <div class="flex-1 mb-2 md:mb-0">
            <label
              for="username"
              class="block text-sm font-medium text-gray-600"
              ><span class="text-red-500">*</span> Username</label
            >
            <input
              type="text"
              id="username"
              name="username"
              maxlength="50"
              bind:value={username}
              on:input={(e) => {
                username = e.target.value.trimStart();
                validateUsername();
              }}
              placeholder="Enter your username"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-lg pl-5 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-100 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
            />
            {#if errors.username}
              <div class="text-red-500 text-xs mt-1">{errors.username}</div>
            {/if}
          </div> -->
          <div class="flex-1 mb-2 md:mb-0 relative">
            <label for="email" class="block text-sm font-medium text-gray-600"
              ><span class="text-red-500">*</span> Email</label
            >
            <div class="relative">
              <!-- <form
                action="?/verifyemail"
                bind:this={form5}
                method="POST"
                use:enhance={({ formData }) => {
                  formData.append("email", email);
                  return async ({ result }) => {
                    console.log("result", result);

                    isLoading = false;
                    console.log(result);
                    if (result.data?.status === 200) {
                      toast.success(result.data.message);
                      ProfileEmailVerified = result.data.isEmailVerified;
                      verificationMessage = result.data.message;

                      if (
                        verificationMessage.includes(
                          "Verification email sent successfully. Please check your inbox.",
                        )
                      ) {
                        displayMessage = "Please check your inbox.";
                        emailSent = true;
                        isOtpVerified = false;
                      } else {
                        displayMessage = verificationMessage;
                        emailSent = false;
                        isOtpVerified = true;
                      }
                    } else {
                      ProfileEmailVerified = result.data.isEmailVerified;
                      toast.error(result.data.message);
                      emailSent = false;
                    }
                  };
                }}
                on:submit={() => {
                  isLoading = true;
                }}
              > -->
                <input
                  type="email"
                  id="email"
                  name="email"
                  maxlength="100"
                  bind:value={email}
                  on:input={() => {
                    validateEmail();
                    // ProfileEmailVerified = false;
                    // emailSent = false;
                    // isOtpVerified = false;
                  }}
                  placeholder="Enter your email"
                  class="mt-1 block w-full p-2 pr-24 border border-gray-300 rounded-lg pl-5 focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm focus:outline-none text-sm h-10"
                />

                {#if isLoading}
                  <span
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-primary-600 flex items-center"
                  >
                    <Icon
                      icon="line-md:loading-alt-loop"
                      class="w-4 h-4 mr-1"
                    />
                    Sending...
                  </span>
                {:else if !ProfileEmailVerified && !emailSent}
                  <button
                    type="submit"
                    class="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary-500 font-semibold text-2s pl-2 py-1 rounded hover:underline disabled:cursor-not-allowed"
                    disabled={!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                      email,
                    ) || email.split("@")[1].includes("gamil")}
                  >
                    Verify
                  </button>
                {:else if emailSent}
                  <span
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
                  >
                    {#if isOtpVerified}
                      Verified
                      <Icon
                        icon="material-symbols:verified-rounded"
                        class="w-4 h-4 ml-1"
                      />
                    {:else}
                      <Icon
                        icon="fluent:mail-all-read-16-filled"
                        class="w-4 h-4 mr-1"
                      />
                      Check inbox
                    {/if}
                  </span>
                {:else}
                  <span
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-2s font-semibold text-green-600 flex items-center"
                  >
                    Verified
                    <Icon
                      icon="material-symbols:verified-rounded"
                      class="w-4 h-4 ml-1"
                    />
                  </span>
                {/if}
              <!-- </form> -->
            </div>
            {#if errors.email}
              <div class="text-red-500 text-xs mt-1">{errors.email}</div>
            {/if}
          </div>
        </div>

        <div class="mt-1 mb-4">
          {#if emailSent && isOtpVerified === false}
            <form
              action="?/verifyOtp"
              method="POST"
              use:enhance={({ formData }) => {
                formData.append("email", email);
                return async ({ result }) => {
                  console.log(result);
                  isOtpVerified = result.data.isEmailVerified;
                  if (result.data?.status === 200) {
                    toast.success(result.data.message);
                    enteredOtp = "";
                    isOtpVerified = true;
                    ProfileEmailVerified = true;
                  } else if (result.data?.status === 500) {
                    toast.error(result.data.message);
                  }
                  console.log(isOtpVerified, "isOtpVerified");
                };
              }}
            >
              <div class="relative w-full">
                <label
                  for="enteredOtp"
                  class="block text-sm font-medium text-gray-600"
                  >Enter the Recieved 6-digit OTP</label
                >
                <input
                  type="text"
                  maxlength="6"
                  name="enteredOtp"
                  bind:value={enteredOtp}
                  on:input={handleInput}
                  placeholder="Enter 6-digit OTP"
                  class="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-lg pl-5
                    focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400
                    placeholder:text-sm h-10"
                />
                <button
                  type="submit"
                  class="absolute top-1/2 right-2 transform text-primary-500 font-bold text-2s py-1 rounded hover:underline"
                >
                  Verify
                </button>
              </div>
            </form>
            <p class="mt-px text-2s text-right text-gray-600">
              Didn't receive the code?
              <button
                type="button"
                on:click={handleResendemailOtp}
                class="text-primary-500 font-medium hover:underline"
              >
                Get a new code
              </button>
            </p>
          {/if}
        </div>
        <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
          <div class="w-full sm:mx-auto grid">
            <label for="country" class="block text-sm font-medium text-gray-600"
              ><span class="text-red-500">*</span> Country</label
            >
            <div class="dropdown-container">
              <div class="relative">
                <!-- Wrap input and icon in a group to control toggle behavior -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="flex items-center" on:click={toggleDropdown}>
                  <input
                    type="text"
                    name="country"
                    maxlength="50"
                    bind:value={country}
                    placeholder="Search Country"
                    on:input={handleInputChange}
                    on:keydown={handleKeyDown}
                    class="mt-1 block w-full p-2 border focus:outline-none text-sm border-gray-300 rounded-lg pl-5
                          focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400
                          placeholder:text-sm h-10 pr-8"
                  />
                  <Icon
                    icon={showDropdown
                      ? "ep:arrow-up-bold"
                      : "ep:arrow-down-bold"}
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mr-1 text-2s font-bold cursor-pointer pointer-events-none"
                  />
                </div>

                {#if showDropdown}
                  <div
                    bind:this={dropdownEl}
                    class="absolute w-full top-full mt-px bg-white border border-gray-300 rounded-md shadow-lg z-10"
                  >
                    <ul class="max-h-60 overflow-y-auto text-sm">
                      {#each filteredCountries as country, index}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                        <li
                          on:click={() => selectCountry(country)}
                          class="px-4 py-2 cursor-pointer {highlightedIndex ===
                          index
                            ? 'bg-primary-100'
                            : 'hover:bg-primary-50'}"
                        >
                          {country.name} ({country.code})
                        </li>
                      {/each}
                      {#if filteredCountries.length === 0}
                        <div class="flex items-center px-4 py-3">
                          <Icon
                            icon="tabler:info-square-rounded-filled"
                            class="text-red-500 text-base mr-2"
                          />
                          <li class="text-gray-800 text-xs">
                            No matching countries found!
                          </li>
                        </div>
                      {/if}
                    </ul>
                  </div>
                {/if}
              </div>
              {#if errors.country}
                <div class="text-red-500 text-xs mt-1">{errors.country}</div>
              {/if}
            </div>
          </div>

          <!-- <div class="w-full sm:mx-auto grid">
          <label for="currency" class="block text-sm font-medium text-gray-600"
            >Currency</label
          >
          <select
            class="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-md
                    focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400
                    placeholder:text-sm h-10"
            name="currency"
            bind:value={currency}
            id="currency-select"
            disabled
          >
            <option
              class="Currency placeholder:text-sm"
              disabled
              selected
              value="">Currency</option
            >
            {#each currencies as currency}
              <option class="bg-primary-50" value={currency}>{currency}</option>
            {/each}
          </select>
          {#if errors.country}
            <div class="text-red-500 text-xs mt-1">{errors.country}</div>
          {/if}
        </div> -->
        </div>

        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-600">
            <span class="text-red-500">*</span> Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            maxlength="20"
            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
            bind:value={phone}
            on:input={() => validatePhoneNumber(country, phone)}
            placeholder="Enter your phone number"
            class="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-lg pl-5
                    focus:border-primary-400 focus:outline-none focus:ring-0 focus:ring-primary-400 placeholder-gray-400
                    placeholder:text-sm h-10"
          />
          {#if errors.phone}
            <div class="flex items-center text-sm text-gray-700">
              <Icon
                icon="carbon:location-info-filled"
                class="text-sm inline text-primary-400"
              />
              <span class="text-2s text-gray-700"
                >Enter phone number without country code</span
              >
            </div>
          {/if}
          {#if errors.phone}
            <div class="text-red-500 text-xs mt-1">{errors.phone}</div>
          {/if}
        </div>

        <!-- <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
          <div class="flex-1 mb-2 md:mb-0">
            <label
              for="gstNumber"
              class="block text-sm font-medium text-gray-600">GST Number</label
            >
            <input
              type="text"
              id="gstNumber"
              name="gstNumber"
              placeholder="Enter your GST number"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10 text-sm"
              bind:value={gstNumber}
              on:input={validateGstNumber}
            />
            {#if errors.gstNumber}
              <div class="text-red-500 text-xs mt-1">{errors.gstNumber}</div>
            {/if}
          </div>

          <div class="flex-1 mb-2 md:mb-0 relative">
            <label
              for="tanNumber"
              class="block text-sm font-medium text-gray-600">TAN Number</label
            >
            <div class="relative">
              <input
                type="text"
                id="tanNumber"
                name="tanNumber"
                placeholder="Enter your TAN number"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm text-sm h-10"
                on:input={validateTanNumber}
                bind:value={tanNumber}
              />
              {#if errors.tanNumber}
                <div class="text-red-500 text-xs mt-1">{errors.tanNumber}</div>
              {/if}
            </div>
          </div>
        </div> -->

        <!-- <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-600"
          >Password</label
        >
        <input
          type="password"
          id="password"
          name="password"
          bind:value={password}
          on:input={() => validatePassword()}
          placeholder="Enter your password"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400 text-sm placeholder:text-sm h-10"
        />
        {#if errors.password}
          <div class="text-red-500 text-xs mt-1">{errors.password}</div>
        {/if}
        <div class="text-gray-400 text-sm mt-1">
          <p>*Contain at least 8 Characters</p>
          <p>*Cannot contain common or guessable text</p>
          <p>*Contain at least one number</p>
          <p>*Contain one of the following special characters !@#$%_-*</p>
        </div>
      </div> -->

        <div class="mb-4 relative">
          <label for="password" class="block text-sm font-medium text-gray-600">
            <span class="text-red-500">*</span> Password
          </label>
          <div class="relative">
            <input
              id="password"
              name="password"
              type="password"
              maxlength="50"
              bind:value={password}
              on:input={(e) => {
                password = e.target.value.trim();
                validatePassword();
              }}
              placeholder="Enter your password"
              class="mt-1 block focus:outline-none w-full p-2 pr-10 border border-gray-300 rounded-lg pl-5 focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400 text-sm placeholder:text-sm h-10"
            />
            <button
              type="button"
              on:click={togglePasswordVisibility}
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {#if passwordVisible}
                <Icon icon="mdi:eye-off-outline" class="w-5 h-5" />
              {:else}
                <Icon icon="mdi:eye-outline" class="w-5 h-5" />
              {/if}
            </button>
          </div>
          {#if errors.password}
            <div class="text-red-500 text-xs mt-1">{errors.password}</div>
          {/if}
        </div>
        {#if typing}
          <div
            class="bg-primary-50 px-2 mt-3 py-2 rounded-lg pl-5 border border-gray-200"
          >
            <ul class="w-full text-xs text-gray-500 text-left list-none ml-1">
              <li
                class="flex justify-start items-center sm:text-xs text-2s py-1"
              >
                {#if !password.includes("password")}
                  <span class="text-green-500">
                    <Icon icon="lets-icons:check-fill" class="w-4 h-4 mr-1" />
                  </span>
                {:else}
                  <span class="text-red-500">
                    <Icon
                      icon="lets-icons:close-ring-duotone"
                      class="w-4 h-4 mr-1"
                    />
                  </span>
                {/if}
                Cannot contain common or guessable text
              </li>
              <li
                class="flex justify-start items-center sm:text-xs text-2s py-1"
              >
                {#if password.length >= 8}
                  <span class="text-green-500">
                    <Icon icon="lets-icons:check-fill" class="w-4 h-4 mr-1" />
                  </span>
                {:else}
                  <span class="text-red-500">
                    <Icon
                      icon="lets-icons:close-ring-duotone"
                      class="w-4 h-4 mr-1"
                    />
                  </span>
                {/if}
                Contain at least 8 characters
              </li>
              <li
                class="flex justify-start items-center sm:text-xs text-2s py-1"
              >
                {#if /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)}
                  <span class="text-green-500">
                    <Icon icon="lets-icons:check-fill" class="w-4 h-4 mr-1" />
                  </span>
                {:else}
                  <span class="text-red-500">
                    <Icon
                      icon="lets-icons:close-ring-duotone"
                      class="w-4 h-4 mr-1"
                    />
                  </span>
                {/if}
                Contain at least one uppercase letter, one lowercase letter, one
                number
              </li>
              <li
                class="flex justify-start items-center sm:text-xs text-2s py-1"
              >
                {#if /[!@#$%^&*\\-]/.test(password)}
                  <span class="text-green-500">
                    <Icon icon="lets-icons:check-fill" class="w-4 h-4 mr-1" />
                  </span>
                {:else}
                  <span class="text-red-500">
                    <Icon
                      icon="lets-icons:close-ring-duotone"
                      class="w-4 h-4 mr-1"
                    />
                  </span>
                {/if}
                Contain one of the following special characters !@#$%^&*
              </li>
            </ul>
          </div>

          <div class="mt-2">
            <div class="relative pt-1">
              <div class="flex mb-2 items-center justify-between"></div>
              <div class="flex mb-2">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="h-2.5 focus:outline-none rounded-full transition-all duration-300 ease-in-out"
                    style="width: {passwordStrength}%"
                    class:bg-red-500={passwordStrength <= 33}
                    class:bg-yellow-500={passwordStrength > 33 &&
                      passwordStrength <= 66}
                    class:bg-green-500={passwordStrength > 66}
                  ></div>
                </div>
              </div>
              <div class="mt-1 md:text-xs text-2s font-medium pb-2">
                {#if passwordStrength <= 33}
                  <span class="text-red-500">Weak</span>
                {:else if passwordStrength <= 66}
                  <span class="text-yellow-500">Moderate</span>
                {:else}
                  <span class="text-green-500">Strong</span>
                {/if}
              </div>
            </div>
          </div>
        {/if}

        <div class="mb-4 relative">
          <label
            for="passwordConfirm"
            class="block text-sm font-medium text-gray-600"
          >
            <span class="text-red-500">*</span> Confirm Password</label
          >
          <div class="relative">
            <input
              id="passwordConfirm"
              name="confirmpassword"
              type="password"
              maxlength="50"
              bind:value={passwordConfirm}
              on:input={(e) => {
                passwordConfirm = e.target.value.trim();
                validateConfirmPassword();
              }}
              placeholder="Confirm your password"
              class="mt-1 focus:outline-none block w-full p-2 pr-10 border text-sm border-gray-300 rounded-lg pl-5 focus:border-primary-400 focus:ring-0 focus:ring-primary-400 placeholder-gray-400 placeholder:text-sm h-10"
            />
            <button
              type="button"
              on:click={toggleConfirmPasswordVisibility}
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              aria-label={confirmPasswordVisible
                ? "Hide confirm password"
                : "Show confirm password"}
            >
              {#if confirmPasswordVisible}
                <Icon icon="mdi:eye-off-outline" class="w-5 h-5" />
              {:else}
                <Icon icon="mdi:eye-outline" class="w-5 h-5" />
              {/if}
            </button>
          </div>

          {#if errors.passwordConfirm}
            <div class="text-red-500 text-xs mt-1">
              {errors.passwordConfirm}
            </div>
          {/if}
        </div>

        <div class="flex gap-2 {errors.termsAndConditions ? 'mb-1' : 'mb-6'}">
          <input
            type="checkbox"
            name="termsAndConditions"
            value={true}
            on:change={handleCheckboxChange}
            class="mt-0.5 text-primary-500 rounded focus:ring-0 outline-none"
          />
          <div class="text-xs">
            I have read and agreed to the
            <a
              class="font-medium text-primary-500 hover:underline"
              href="/terms"
            >
              Terms of Service
            </a>
            and
            <a
              class="font-medium text-primary-500 hover:underline"
              href="/privacy-policy">Privacy Policy</a
            >
          </div>
        </div>
        {#if !isTermsAccepted && errors.termsAndConditions}
          <div class="text-red-500 text-xs block mb-4">
            {errors.termsAndConditions}
          </div>
        {/if}
        <div
          class="w-full flex flex-col items-center justify-center px-4 sm:px-4 py-6"
        >
          <!-- Primary Button -->
          <button
            type="submit"
            class="w-full max-w-md bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition duration-200 flex items-center justify-center mb-6"
          >
            {#if isProcessing}
              <Icon icon="line-md:loading-alt-loop" class="text-lg mr-2" />
              Processing...
            {:else}
              <Icon
                icon="fluent:inprivate-account-28-filled"
                class="text-2xl mr-2"
              />
              Set Up Account
            {/if}
          </button>

          <!-- OR Divider -->
          <div
            class="flex items-center text-sm text-gray-500 font-semibold w-full max-w-md mb-6"
          >
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="px-3">OR</span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>

          <!-- Social Buttons -->
          <div class="w-full max-w-md space-y-4">
            <!-- Google Button -->
            <button
              on:click={() => redirectTo(googleUrl)}
              type="button"
              class="w-full flex items-center justify-center gap-3 py-2 px-4 text-black bg-white border border-gray-400 rounded-lg transition duration-200"
            >
              <Icon icon="flat-color-icons:google" class="text-2xl" />
              <span class="text-sm font-medium">Sign up with Google</span>
            </button>

            <!-- LinkedIn Button (Optional) -->
            <!--
    <button
      on:click={() => redirectTo(linkedinUrl)}
      type="button"
      class="w-full flex items-center justify-center gap-3 py-3 px-4 text-black bg-white border border-gray-500 rounded-3xl transition duration-200"
    >
      <Icon icon="fa:linkedin-square" class="text-2xl text-blue-600" />
      <span class="text-sm font-medium">Sign up with LinkedIn</span>
    </button>
    -->
          </div>
        </div>
      </form>
    </div>
    <div
      class="hidden md:flex w-full md:w-1/2 p-6 md:px-14 flex-col justify-center relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary-400/80 via-primary-800 to-primary-300/80 z-0"
      ></div>
      <div class=" absolute top-6 flex flex-col items-center p-4">
        <h1 class="text-2xl font-medium text-white mb-2">
          Welcome to Components2webs
        </h1>
        <p class="text-sm sm:text-base text-white opacity-90">
          Create a new account to get started.
        </p>
      </div>
      <div class="relative z-10 mt-40 md:mt-20">
        <img
          src="/authimg/register.webp"
          alt="login"
          class="w-full h-auto object-cover"
        />
      </div>
    </div>
  </div>
</div>
<Toaster position="bottom-right" richColors />
{#if showRedirectModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-800 bg-opacity-50"
    on:click={handleRedirectCancel}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="bg-white rounded-xl border border-gray-300 shadow-2xl p-8 max-w-md w-full transform transition-all ease-in-out scale-100 opacity-100"
      on:click|stopPropagation
    >
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">
        Email Already Exists
      </h2>
      <p class="mb-6 text-sm text-gray-600">
        This email is already registered. Would you like to go to the login
        page?
      </p>
      <div class="flex justify-end space-x-4">
        <button
          on:click={handleRedirectCancel}
          class="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition duration-200"
        >
          Cancel
        </button>
        <button
          on:click={handleRedirectConfirm}
          class="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition duration-200"
        >
          Go to Login
        </button>
      </div>
    </div>
  </div>
{/if}
