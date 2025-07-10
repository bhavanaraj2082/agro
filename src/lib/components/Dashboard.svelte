<script>
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";
  import { invalidate } from "$app/navigation";
  import { toast, Toaster } from "svelte-sonner";
  import { onMount } from "svelte";
  import { countries, phoneNumberPatterns, indianStates, postalCodePatterns } from "$lib/Data/constants.js";

  export let data;
  $: console.log("Dashboard-->", data);

  let customerid = data?.customerQuotes?.customerId || "N/A";

  let user =  data?.authedUser || { firstname: "",  phone: "",  email: ""};

  let needsPasswordSetup = "";
  let dropdownEl;
  let highlightedIndex = -1;
  let modalContent;

  user.addresses = data?.profile?.addresses || [];

  user.emailContacts = user?.emailContacts || [];

  let showEditProfile = false;
  let showAddAddress = false;
  let currentAddress = null;
  let addressType = null;
  let isLoading = true;
  let formError = "";
  let formSuccess = "";

  let selectedCountryEdit = "";
  let selectedCountryAddress = "";
  let dynamicPostalPattern = postalCodePatterns["IN"];
  let dynamicPhonePattern = phoneNumberPatterns["IN"];



  let mobileError = "";
  let searchTerm = "";
  let formErrors = {};

  function handleInputChange(event) {
    searchTerm = event.target.value.trim();
    const searchLower = searchTerm.toLowerCase();
    const normalizedSearch = searchTerm.replace(/^\+/, "");
    country = searchTerm;

    filteredCountries = countries
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.code.replace(/^\+/, "").includes(normalizedSearch)
      )
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aCode = a.code.replace(/^\+/, "");
        const bCode = b.code.replace(/^\+/, "");

        const aExact = aName === searchLower || aCode === normalizedSearch;
        const bExact = bName === searchLower || bCode === normalizedSearch;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        const aStarts =
          aName.startsWith(searchLower) || aCode.startsWith(normalizedSearch);
        const bStarts =
          bName.startsWith(searchLower) || bCode.startsWith(normalizedSearch);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return a.name.localeCompare(b.name);
      });

    if (
      filteredCountries.length > 0 &&
      (filteredCountries[0].name.toLowerCase() === searchLower ||
        filteredCountries[0].code.replace(/^\+/, "") === normalizedSearch)
    ) {
      selectCountry(filteredCountries[0]);
      showDropdown = false;
      highlightedIndex = -1;
      return;
    }

    showDropdown = true;
    highlightedIndex = -1;

    validateCountry();
  }

  function toggleDropdown() {
    showDropdown = !showDropdown;
    if (showDropdown) {
      filteredCountries = countries;
      highlightedIndex = -1;
    }
  }

  function handleKeyDown(event) {
    if (!showDropdown) return;

    if (event.key === "ArrowDown") {
      highlightedIndex = (highlightedIndex + 1) % filteredCountries.length;
      scrollToHighlighted();
    } else if (event.key === "ArrowUp") {
      highlightedIndex =
        (highlightedIndex - 1 + filteredCountries.length) %
        filteredCountries.length;
      scrollToHighlighted();
    } else if (event.key === "Enter") {
      if (highlightedIndex >= 0) {
        selectCountry(filteredCountries[highlightedIndex]);
      } else if (filteredCountries.length > 0) {
        selectCountry(filteredCountries[0]);
      }
    }
  }

  function scrollToHighlighted() {
    setTimeout(() => {
      const list = dropdownEl?.querySelectorAll("li");
      if (list && list[highlightedIndex]) {
        list[highlightedIndex].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }, 0);
  }

  function selectCountry(selectedCountry) {
    country = selectedCountry.name;
    searchTerm = selectedCountry.name;
    validateCountry();
    // validatePhoneNumber(country, phone);
    showDropdown = false;
  }

  let filteredCountries = countries;
  let showDropdown = false;

  function getCountryByCode(code) {
    const country = countries.find((c) => c.code === code || c.name === code);
    return country ? country.name : null;
  }

  function getPhonePattern(countryCode) {
    const countryName = getCountryByCode(countryCode);
    if (!countryName) return "^[0-9]+$";
    const regex = phoneNumberPatterns[countryName];
    return regex ? regex.source : "^[0-9]+$";
  }

  function validatePhoneNumber(countryName, phone) {
    let newErrors = { ...formErrors };

    if (!phone) {
      newErrors.phone = "*Required";
    } else if (!countryName) {
      newErrors.phone = "Select a country before entering your phone number";
    } else {
      const matchedCountry = countries.find((c) => c.name === countryName);
      if (!matchedCountry) {
        newErrors.phone = "Invalid country selected to validate phone";
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
    formErrors = newErrors;
  }

  function validateCountry() {
    if (!country || country.trim() === "") {
      formErrors.country = "*Required";
    } else {
      const match = countries.find(
        (c) => c.name.toLowerCase() === country.toLowerCase()
      );
      if (!match) {
        formErrors.country = "Invalid country selected";
      } else {
        delete formErrors.country;
      }
    }
  }

  $: isRegistrationComplete = data?.authedUser?.firstname && data?.authedUser?.phone ;
console.log(isRegistrationComplete,"isRegistrationComplete");

  $: {
    if (selectedCountryEdit) {
      const countryCode = getCountryCodeByName(selectedCountryEdit);
      dynamicPhonePattern =
        phoneNumberPatterns[countryCode] || phoneNumberPatterns["IN"];
    }
  }

  $: {
    if (selectedCountryAddress) {
      const countryCode = getCountryCodeByName(selectedCountryAddress);
      dynamicPostalPattern =
        postalCodePatterns[countryCode] || postalCodePatterns["IN"];
      dynamicPhonePattern =
        phoneNumberPatterns[countryCode] || phoneNumberPatterns["IN"];
    }
  }

  $: if (typeof window !== "undefined") {
    const mobileInput = document.querySelector('input[name="mobileNr"]');
    if (mobileInput) {
      mobileInput.addEventListener("input", (e) => {
        const countryCode = getCountryCodeByName(
          selectedCountryEdit || selectedCountryAddress,
        );
        mobileError = getFieldError("mobileNr", e.target.value, countryCode);
      });
    }
  }

  let expandedQuotes = new Set();

  $: {
    if (
      data?.customerQuotes?.quotes &&
      Array.isArray(data.customerQuotes.quotes)
    ) {
      quotes = data.customerQuotes.quotes;
    } else {
      quotes = [];
    }
  }

  $: recentQuotes = quotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 2);

  function formatQuoteDate(dateString) {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  }

  function calculateQuoteTotal(products) {
    if (!products || !Array.isArray(products)) return 0;

    const total = products.reduce((sum, product) => {
      const productTotal =
        product?.total || product?.price * product?.quantity || 0;
      return sum + productTotal;
    }, 0);

    return total;
  }

  function formatCurrency(amount) {
    if (typeof amount !== "number") return "₹0.00";
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function getQuoteStatus(quote) {
    if (!quote) return "Unknown";

    if (quote.orderStatus === true) {
      return "Approved";
    } else if (quote.orderStatus === false) {
      return "Pending";
    }

    return "Unknown";
  }

  function getValidUntilDate(createdAt) {
    if (!createdAt) return "N/A";

    try {
      const created = new Date(createdAt);
      const validUntil = new Date(created);
      validUntil.setDate(created.getDate() + 30);

      return validUntil.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  }

  function toggleQuoteDetails(quoteId) {
    if (expandedQuotes.has(quoteId)) {
      expandedQuotes.delete(quoteId);
    } else {
      expandedQuotes.add(quoteId);
    }
    expandedQuotes = expandedQuotes;
  }

  function getOrderTypeLabel(orderType) {
    if (!orderType) return "Unknown";
    return orderType.charAt(0).toUpperCase() + orderType.slice(1);
  }

  onMount(() => {
    isLoading = false;
  });

  function validateMobileNumber(number, countryCode = "IN") {
    if (!number) return true;
    const cleanNumber = number.toString().replace(/[^0-9]/g, "");
    const pattern = phoneNumberPatterns[countryCode];
    return pattern ? pattern.test(cleanNumber) : /^[0-9]{10}$/.test(cleanNumber);
  }

  function validateRequiredMobileNumber(number, countryCode = "IN") {
    if (!number) return false;
    return validateMobileNumber(number, countryCode);
  }

  function validatePostalCode(pincode, countryCode = "IN") {
    if (!pincode) return false;
    const cleanCode = pincode.toString().trim();
    const pattern = postalCodePatterns[countryCode];
    return pattern ? pattern.test(cleanCode) : /^[0-9]{6}$/.test(cleanCode);
  }

  function sanitizeInput(input) {
    if (!input) return "";
    return input.toString().trim().replace(/[<>]/g, "").replace(/\s+/g, " ");
  }

  function sanitizePhoneNumber(number) {
    if (!number) return "";
    return number.toString().replace(/[^0-9+\-\s()]/g, "").trim();
  }

  function sanitizeUrl(url) {
    if (!url) return "";
    const cleaned = url.toString().trim();
    if (cleaned && !cleaned.match(/^https?:\/\//i)) {
      return "https://";
    }
    return cleaned;
  }

  function getpincodePattern(countryName) {
    if (!countryName) return "^[0-9]+$";
    const regex = postalCodePatterns[countryName];
    return regex ? regex.source || regex : "^[0-9]+$";
  }

  function validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }

  function validateRequiredField(value) {
    return value && value.trim() !== "";
  }

  function openEditProfile() {
    formError = "";
    formSuccess = "";
    selectedCountryEdit = user.country;
    showEditProfile = true;
  }

  function closeEditProfile() {
    formError = "";
    formSuccess = "";
    showEditProfile = false;
  }

  let fullName = user?.fullName || "";
  let companyName = user.companyName || currentAddress?.companyName || "";
  let mobileNr = user?.mobileNr || user?.cellPhone || currentAddress?.mobileNr || "";
  let countrypro = countries;
  let addressLine1 = "";
  let addressLine2 = "";
  let pinCode = "";
  let city = "";
  let district = "";
  let state = "";
  let companyWebUrl = "";
  let alternateNr = "";
  console.log(data?.profile?.country,"country********")
  let country = data?.profile?.country || "";
  let phone = data?.profile?.mobileNr || data?.profile?.cellPhone || currentAddress?.mobileNr || "";
  let fullNamepro = data?.profile?.firstName || "";
  let mobileNrpro =
    data?.profile?.mobileNr || data?.profile?.cellPhone || currentAddress?.mobileNr || "";
  let companyNamepro = data?.profile?.companyName || currentAddress?.companyName || "";
  let addressErrors = {};
  let profileErrors = {};
  let isAddressFormValid = false;
  let isProfileFormValid = false;

  function openAddAddress(type = null, address = null) {
    if (address) {
      currentAddress = { ...address };
      fullName = sanitizeInput(address.fullName || "");
      companyName = sanitizeInput(address.companyName || "");
      mobileNr = sanitizePhoneNumber(
        address.mobileNr || address.cellPhone || "",
      );
      country = address.country || "";
      addressLine1 = sanitizeInput(address.addressLine1 || "");
      addressLine2 = sanitizeInput(address.addressLine2 || "");
      pinCode = address.pinCode || "";
      city = sanitizeInput(address.city || "");
      district = sanitizeInput(address.district || "");
      state = address.state || "";
      companyWebUrl = sanitizeInput(address.companyWebUrl || "");
      addressType = type || address.type;
      selectedCountryAddress = address.country || "";
    } else {
      currentAddress = null;
      fullName = sanitizeInput(user.fullName || "");
      companyName = sanitizeInput(user.companyName || "");
      mobileNr = sanitizePhoneNumber(user.mobileNr || user.cellPhone || "");
      country = "";
      addressLine1 = "";
      addressLine2 = "";
      pinCode = "";
      city = "";
      district = "";
      state = "";
      companyWebUrl = "";
      addressType = type;
      selectedCountryAddress = "";
    }
    addressErrors = {};
    showAddAddress = true;
  }

  function validateAddressField(fieldName) {
    const countryCode = getCountryCodeByName(selectedCountryAddress || "");

    if (!fieldName || fieldName === "fullName") {
      if (!fullName || !fullName.trim()) {
        addressErrors.fullName = "*Required";
      } else if (fullName.trim().length < 2) {
        addressErrors.fullName = "Full name must be at least 2 characters";
      } else if (fullName.trim().length > 50) {
        addressErrors.fullName = "Full name cannot exceed 50 characters";
      } else if (!/^[A-Za-z\s]+$/.test(fullName.trim())) {
        addressErrors.fullName =
          "Please enter a valid name (letters and spaces only)";
      } else {
        delete addressErrors.fullName;
      }
    }

    if (!fieldName || fieldName === "companyName") {
      if (!companyName || !companyName.trim()) {
        addressErrors.companyName = "*Required";
      } else if (companyName.trim().length < 2) {
        addressErrors.companyName =
          "Company name must be at least 2 characters";
      } else if (companyName.trim().length > 100) {
        addressErrors.companyName = "Company name cannot exceed 100 characters";
      } else if (!/^[A-Za-z0-9@.,\s&()-]+$/.test(companyName.trim())) {
        addressErrors.companyName = "Please enter a valid company name";
      } else if (/^\d+$/.test(companyName.trim())) {
        addressErrors.companyName = "Company name cannot contain only numbers";
      } else {
        delete addressErrors.companyName;
      }
    }

    if (!fieldName || fieldName === "mobileNr") {
      if (!mobileNr || !mobileNr.trim()) {
        addressErrors.mobileNr = "*Required";
        return;
      }
      if (!selectedCountryAddress) {
        // Use selectedCountryAddress instead of country
        addressErrors.mobileNr =
          "Please select the country before entering the phone number";
        return;
      }

      const countryDetails = getCountryByCode(selectedCountryAddress); // Use selectedCountryAddress
      if (!countryDetails) {
        addressErrors.mobileNr = "Invalid country selected";
      } else {
        const phonePattern = getPhonePattern(selectedCountryAddress); // Use selectedCountryAddress
        if (!phonePattern) {
          addressErrors.mobileNr = "Phone number pattern for country not found";
        } else {
          const phoneRegex = new RegExp(phonePattern);
          const cleanMobileNr = mobileNr.replace(/[^0-9]/g, "");
          if (!phoneRegex.test(cleanMobileNr)) {
            addressErrors.mobileNr = `Please enter a valid phone number for ${countryDetails}.`;
          } else {
            delete addressErrors.mobileNr;
          }
        }
      }
    }

    if (!fieldName || fieldName === "country") {
      if (!selectedCountryAddress || selectedCountryAddress === "") {
        addressErrors.country = "*Required";
      } else {
        delete addressErrors.country;
      }
    }

    if (!fieldName || fieldName === "addressLine1") {
      if (!addressLine1 || !addressLine1.trim()) {
        addressErrors.addressLine1 = "*Required";
      } else if (addressLine1.trim().length < 5) {
        addressErrors.addressLine1 = "Address must be at least 5 characters";
      } else if (addressLine1.trim().length > 100) {
        addressErrors.addressLine1 = "Address cannot exceed 100 characters";
      } else {
        delete addressErrors.addressLine1;
      }
    }

    if (!fieldName || fieldName === "addressLine2") {
      if (addressLine2 && addressLine2.trim().length > 100) {
        addressErrors.addressLine2 =
          "Address Line 2 cannot exceed 100 characters";
      } else {
        delete addressErrors.addressLine2;
      }
    }

    if (!fieldName || fieldName === "pinCode") {
      if (!pinCode || !pinCode.trim()) {
        addressErrors.pinCode = "*Required";
        return;
      }
      if (!selectedCountryAddress) {
        addressErrors.pinCode =
          "Please select the country before entering the pin code";
        return;
      }
      const countryDetails = getCountryByCode(selectedCountryAddress); // Use selectedCountryAddress
      if (!countryDetails) {
        addressErrors.pinCode = "Invalid country selected"; // Fix the error assignment
      } else {
        const pincodepattern = getpincodePattern(selectedCountryAddress); // Use selectedCountryAddress
        if (!pincodepattern) {
          addressErrors.pinCode = "Pin Code pattern for country not found";
        } else {
          const pincodeRegex = new RegExp(pincodepattern);
          const cleanpincode = pinCode.replace(/[^0-9]/g, "");
          if (!pincodeRegex.test(cleanpincode)) {
            addressErrors.pinCode = `Please enter a valid pincode for ${countryDetails}.`;
          } else {
            delete addressErrors.pinCode;
          }
        }
      }
    }

    if (!fieldName || fieldName === "city") {
      if (city && city.trim()) {
        if (city.trim().length > 50) {
          addressErrors.city = "City name cannot exceed 50 characters";
        } else if (!/^[A-Za-z\s]+$/.test(city.trim())) {
          addressErrors.city =
            "Please enter a valid city name (letters and spaces only)";
        } else {
          delete addressErrors.city;
        }
      } else {
        delete addressErrors.city;
      }
    }

    if (!fieldName || fieldName === "district") {
      if (!district || !district.trim()) {
        addressErrors.district = "*Required";
      } else if (district.trim().length < 2) {
        addressErrors.district = "District must be at least 2 characters";
      } else if (district.trim().length > 50) {
        addressErrors.district = "District cannot exceed 50 characters";
      } else if (!/^[A-Za-z\s]+$/.test(district.trim())) {
        addressErrors.district =
          "Please enter a valid district name (letters and spaces only)";
      } else {
        delete addressErrors.district;
      }
    }

    if (!fieldName || fieldName === "state") {
      if (!state || state === "" || state === "Select State") {
        addressErrors.state = "*Required";
      } else {
        const hasScriptTags =
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(state);
        const isOnlyNumbers = /^\d+$/.test(state.trim());
        const hasLetters = /[a-zA-Z]/.test(state);

        if (hasScriptTags) {
          addressErrors.state = "*Script tags are not allowed";
        } else if (isOnlyNumbers) {
          addressErrors.state = "*Numbers only are not allowed";
        } else if (!hasLetters) {
          addressErrors.state = "*Must contain at least one letter";
        } else {
          delete addressErrors.state;
        }
      }
    }

    if (!fieldName || fieldName === "companyWebUrl") {
      if (companyWebUrl && companyWebUrl.trim()) {
        const urlPattern =
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(companyWebUrl.trim())) {
          addressErrors.companyWebUrl = "Please enter a valid website URL";
        } else {
          delete addressErrors.companyWebUrl;
        }
      } else {
        delete addressErrors.companyWebUrl;
      }
    }

    addressErrors = { ...addressErrors };
    isAddressFormValid = Object.keys(addressErrors).length === 0 && Object.keys(formErrors).length === 0;
  }

  function validateprofileField(fieldName) {

    if (!fieldName || fieldName === "fullName") {
      if (!fullNamepro || !fullNamepro.trim()) {
        profileErrors.fullName = "*Required";
      } else if (fullNamepro.trim().length < 2) {
        profileErrors.fullName = "Full name must be at least 2 characters";
      } else if (fullNamepro.trim().length > 50) {
        profileErrors.fullName = "Full name cannot exceed 50 characters";
      } else if (!/^[A-Za-z\s]+$/.test(fullNamepro.trim())) {
        profileErrors.fullName =
          "Please enter a valid name (letters and spaces only)";
      } else {
        delete profileErrors.fullName;
      }
    }

    if (!fieldName || fieldName === "companyName") {
      if (!companyNamepro || !companyNamepro.trim()) {
        profileErrors.companyName = "*Required";
      } else if (companyNamepro.trim().length < 2) {
        profileErrors.companyName =
          "Company name must be at least 2 characters";
      } else if (companyNamepro.trim().length > 100) {
        profileErrors.companyName = "Company name cannot exceed 100 characters";
      } else if (!/^[A-Za-z0-9@.,\s&()-]+$/.test(companyNamepro.trim())) {
        profileErrors.companyName = "Please enter a valid company name";
      } else if (/^\d+$/.test(companyNamepro.trim())) {
        profileErrors.companyName = "Company name cannot contain only numbers";
      } else {
        delete profileErrors.companyName;
      }
    }

    if (!fieldName || fieldName === "mobileNr") {
      if (!mobileNrpro || !mobileNrpro.trim()) {
        profileErrors.mobileNr = "*Required";
        return;
      }
      if (!selectedCountryEdit) {
        profileErrors.mobileNr =
          "Please select the country before entering the phone number";
        return;
      }

      const countryDetails = getCountryByCode(selectedCountryEdit);
      if (!countryDetails) {
        profileErrors.mobileNr = "Invalid country selected";
      } else {
        const phonePattern = getPhonePattern(selectedCountryEdit);
        if (!phonePattern) {
          profileErrors.mobileNr = "Phone number pattern for country not found";
        } else {
          const phoneRegex = new RegExp(phonePattern);
          const cleanMobileNr = mobileNrpro.replace(/[^0-9]/g, "");
          if (!phoneRegex.test(cleanMobileNr)) {
            profileErrors.mobileNr = `Please enter a valid phone number for ${countryDetails}.`;
          } else {
            delete profileErrors.mobileNr;
          }
        }
      }
    }

    if (!fieldName || fieldName === "email") {
      if (!user.email || !user.email.trim()) {
        profileErrors.email = "*Required";
      } else if (!validateEmail(user.email)) {
        profileErrors.email = "Please enter a valid email address";
      } else {
        delete profileErrors.email;
      }
    }

    if (!fieldName || fieldName === "country") {
      if (!selectedCountryEdit || selectedCountryEdit === "") {
        profileErrors.country = "*Required";
      } else {
        delete profileErrors.country;
      }
    }

    profileErrors = { ...profileErrors };
    isProfileFormValid = Object.keys(profileErrors).length === 0;
  }

  // Add this reactive statement to handle country changes for profile
  $: {
    if (selectedCountryEdit) {
      const countryCode = getCountryCodeByName(selectedCountryEdit);
      dynamicPhonePattern =
        phoneNumberPatterns[countryCode] || phoneNumberPatterns["IN"];

      if (mobileNrpro) validateprofileField("mobileNr");
    }
  }
  function validateProfileForm() {
    // Validate all fields
    validateprofileField("fullName");
    // validateprofileField("companyName");
    // validateprofileField("mobileNr");
    validateprofileField("email");
    // validateprofileField("country");
    validateCountry();
    validatePhoneNumber(country, phone);

    console.log(Object.keys(formErrors).length)
    console.log(Object.keys(profileErrors).length === 0,"profghjk")
    return Object.keys(profileErrors).length === 0 && Object.keys(formErrors).length === 0;
  }
  $: {
    if (selectedCountryAddress) {
      country = selectedCountryAddress;
      const countryCode = getCountryCodeByName(selectedCountryAddress);
      dynamicPostalPattern =
        postalCodePatterns[countryCode] || postalCodePatterns["IN"];
      dynamicPhonePattern =
        phoneNumberPatterns[countryCode] || phoneNumberPatterns["IN"];

      if (mobileNr) validateAddressField("mobileNr");
      if (pinCode) validateAddressField("pinCode");
    }
  }

  $: {
    if (selectedCountryEdit) {
      country = selectedCountryEdit;
      const countryCode = getCountryCodeByName(selectedCountryEdit);
      dynamicPostalPattern =
        postalCodePatterns[countryCode] || postalCodePatterns["IN"];
      dynamicPhonePattern =
        phoneNumberPatterns[countryCode] || phoneNumberPatterns["IN"];
      if (mobileNr) validateprofileField("mobileNr");
    }
  }

  function closeAddAddress() {
    showAddAddress = false;
    currentAddress = null;
  }

  function handleEditAddress(address, type) {
    // console.log("handleEditAddress called with:", { address, type });
    if (!address) {
      console.error("No address provided to handleEditAddress");
      return;
    }
    openAddAddress(type, address);
  }

  function handleFormSubmission() {
    return async ({ result }) => {
      if (result.type === "success") {
        if (result.data?.success) {
          toast.success(
            result.data.message || "Operation completed successfully",
          );
          await invalidate("app:profile");

          if (showAddAddress) setTimeout(() => closeAddAddress(), 500);
        } else {
          toast.error(result.data?.message || "Operation failed");
        }
      } else {
        toast.error("Operation failed. Please try again.");
      }
    };
  }

  function validateAddressForm(form) {
    const formData = new FormData(form);
    const fullName = sanitizeInput(formData.get("fullName"));
    const companyName = sanitizeInput(formData.get("companyName"));
    const addressLine1 = sanitizeInput(formData.get("addressLine1"));
    const addressLine2 = sanitizeInput(formData.get("addressLine2"));
    const pinCode = sanitizeInput(formData.get("pinCode"));
    const city = sanitizeInput(formData.get("city"));
    const district = sanitizeInput(formData.get("district"));
    const state = formData.get("state");
    const mobileNr = sanitizePhoneNumber(formData.get("mobileNr"));
    const country = formData.get("country") || "";
    const companyWebUrl = sanitizeUrl(formData.get("companyWebUrl"));
    const countryCode = getCountryCodeByName(country);

    // Clear previous errors
    addressErrors = {};

    if (!validateRequiredField(fullName)) {
      addressErrors.fullName = "*Required";
      // return false;
    } else if (fullName.length < 2) {
      addressErrors.fullName = "Full name must be at least 2 characters long";
      // return false;
    }

    if (!validateRequiredField(companyName)) {
      addressErrors.companyName = "*Required";
      // return false;
    } else if (companyName.length < 2) {
      addressErrors.companyName =
        "Company name must be at least 2 characters long";
      // return false;
    }

    if (!validateRequiredField(addressLine1)) {
      addressErrors.addressLine1 = "*Required";
      // return false;
    } else if (addressLine1.length < 5) {
      addressErrors.addressLine1 =
        "Address Line 1 must be at least 5 characters long";
      // return false;
    }

    if (!validatePostalCode(pinCode, countryCode)) {
      addressErrors.pinCode = `Please enter a valid postal code for ${country}`;
      // return false;
    }

    if (!validateRequiredField(district)) {
      addressErrors.district = "*Required";
      // return false;
    } else if (district.length < 2) {
      addressErrors.district = "District must be at least 2 characters long"; // Fix error message
      // return false;
    }

    if (!validateRequiredField(state)) {
      addressErrors.state = "Please select a state";
      // return false;
    }

    // if (!validateRequiredMobileNumber(mobileNr, countryCode)) {
    //   addressErrors.mobileNr = `Please enter a valid mobile number for ${country}`;
    //   // return false;
    // }

    if (companyWebUrl && !isValidUrl(companyWebUrl)) {
      addressErrors.companyWebUrl =
        "Please enter a valid website URL (e.g., example.com)";
      // return false;
    }

    validateCountry();
    validatePhoneNumber(country, phone);

    // Update the reactive addressErrors object
    addressErrors = { ...addressErrors };

    // Return true if no errors, false if there are errors
    return Object.keys(addressErrors).length === 0 && Object.keys(formErrors).length === 0;
  }
  function debugFormState() {
    console.log("Form validation state:", {
      selectedCountryAddress,
      country,
      isAddressFormValid,
      addressErrors,
      mobileNr,
      pinCode,
    });
  }
  function isValidUrl(string) {
    if (!string) return true;
    try {
      const url = new URL(
        string.startsWith("http") ? string : "https://" + string,
      );
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  function getCountryCodeByName(countryName) {
    const country = countries.find((c) => c.name === countryName);
    return country ? country.code : "IN";
  }

  function validateFieldOnInput(field, value, countryCode = "IN") {
    switch (field) {
      case "mobileNr":
        return validateRequiredMobileNumber(value, countryCode);
      case "alternateNr":
        return !value || validateMobileNumber(value, countryCode);
      case "email":
        return validateEmail(value);
      case "pinCode":
        return validatePostalCode(value, countryCode);
      case "fullName":
      case "companyName":
        return validateRequiredField(value) && value.length >= 2;
      case "addressLine1":
        return validateRequiredField(value) && value.length >= 5;
      case "district":
        return validateRequiredField(value) && value.length >= 2;
      case "url":
        return !value || isValidUrl(value);
      default:
        return true;
    }
  }

  function getFieldError(field, value, countryCode = "IN") {
    if (!validateFieldOnInput(field, value, countryCode)) {
      switch (field) {
        case "mobileNr":
          return `Invalid mobile number for selected country`;
        case "alternateNr":
          return `Invalid alternate number for selected country`;
        case "email":
          return "Invalid email format";
        case "pinCode":
          return `Invalid postal code for selected country`;
        case "fullName":
          return "Name must be at least 2 characters";
        case "companyName":
          return "Company name must be at least 2 characters";
        case "addressLine1":
          return "Address must be at least 5 characters";
        case "district":
          return "District must be at least 2 characters";
        case "url":
          return "Invalid URL format";
        default:
          return "Invalid input";
      }
    }
    return "";
  }

  let quotes = [];

  function getStatusColor(status) {
    const colors = {
      Delivered: "bg-green-100 text-green-800",
      Processing: "bg-yellow-100 text-yellow-800",
      Shipped: "bg-blue-100 text-blue-800",
      Pending: "bg-orange-100 text-orange-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }
  let showEmailTooltip = false;
  let showPhoneTooltip = false;
  let tooltipTimeout;

  function showTooltip(type) {
    clearTimeout(tooltipTimeout);
    if (type === "email") {
      showEmailTooltip = true;
    } else if (type === "phone") {
      showPhoneTooltip = true;
    }
  }

  function hideTooltip(type) {
    tooltipTimeout = setTimeout(() => {
      if (type === "email") {
        showEmailTooltip = false;
      } else if (type === "phone") {
        showPhoneTooltip = false;
      }
    }, 200);
  }
</script>

<div class="mx-auto py-6 lg:w-11/12 max-w-7xl">
  <div class="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden border border-primary-100">
    <div class=" bg-primary-500 sm:p-4 p-2">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {#if isLoading}
          <div class="animate-pulse flex-1">
            <div class="h-10 bg-white/20 rounded-xl w-72 mb-3"></div>
            <div class="h-5 bg-white/20 rounded-lg w-56"></div>
          </div>
        {:else}
          <div class="text-white flex-1">
            <h1 class="text-xl md:text-2xl font-bold mb-4 text-white">
              Welcome back, <span class="text-primary-100 capitalize">
                {data?.authedUser?.firstname || data?.user?.firstname || data?.user?.username || "User"}
              </span>
            </h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-primary-50">
              <div class="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
                <div class="bg-white/20 p-2 rounded-lg">
                  <Icon icon="mdi:email" class="text-lg text-white" />
                </div>
                <div class="min-w-0 flex-1 relative">
                  <p class="text-primary-100 text-xs font-medium">Email</p>
                  <p class="text-white font-medium truncate cursor-pointer relative" on:mouseenter={() => showTooltip("email")} on:mouseleave={() => hideTooltip("email")}>
                    {data?.authedUser?.email || "email@example.com"}
                  </p>
                  {#if showEmailTooltip}
                    <div class="absolute z-50 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg -top-12 left-0 whitespace-nowrap border border-gray-700">
                      {data?.authedUser?.email || "email@example.com"}
                      <div class="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  {/if}
                </div>
              </div>
              <div class="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
                <div class="bg-white/20 p-2 rounded-lg">
                  <Icon icon="mdi:phone" class="text-lg text-white" />
                </div>
                <div class="min-w-0 flex-1 relative">
                  <p class="text-primary-100 text-xs font-medium">Phone</p>
                  <p class="text-white font-medium truncate relative">
                    {data?.authedUser.phone || data?.user?.mobileNr || "Not provided"}
                  </p>
                </div>
              </div>
              <div class="sm:col-span-2 lg:col-span-1">
                {#if needsPasswordSetup}
                  <div class="bg-primary-700/50 border border-primary-400 rounded-lg p-4 backdrop-blur-sm">
                    <p class="text-sm text-primary-100 leading-relaxed">
                      Complete your account setup by creating a secure password.
                      <a href="/reset-password" class="text-white font-semibold hover:text-primary-200 transition-colors duration-200 underline decoration-primary-300">
                        Setup Password →
                      </a>
                    </p>
                  </div>
                {:else}
                  <div class="flex justify-start">
                    <a href="/reset-password" class="bg-white/20 mt-2 hover:bg-white/30 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30">
                      Reset Password
                    </a>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/if}
        <div class="flex flex-col sm:flex-row gap-4 items-center">
          {#if !isRegistrationComplete}
            <div class="bg-primary-700/80 border border-primary-400 rounded-xl px-4 py-3 flex items-center gap-3 text-primary-100 backdrop-blur-sm">
              <div class="bg-primary-500 p-1.5 rounded-lg">
                <Icon icon="mdi:alert-circle" class="text-lg text-white" />
              </div>
              <span class="font-medium">Complete Profile</span>
            </div>
          {/if}
          <button class="bg-white text-primary-700 px-11 py-3 rounded-xl font-semibold hover:bg-primary-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 shadow-lg" on:click={openEditProfile}>
            <Icon icon="mdi:account-edit" class="text-xl" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
    <!-- Stats Section -->
   
  </div>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
  
    <!-- Address Management Section -->
    <div class="space-y-4">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-primary-100">
        <div class="bg-primary-500 px-6 py-6 border-b border-primary-200">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-4">
              <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Icon icon="mdi:map-marker-multiple" class="text-xl text-white"/>
              </div>
              <div>
                <h2 class="text-base font-semibold text-white">Address Management</h2>
              </div>
            </div>
            <button class="bg-white text-primary-700 p-2 rounded-xl hover:bg-primary-50 transition-all duration-300 flex items-center gap-2 shadow-lg font-semibold" on:click={() => openAddAddress()}>
              <Icon icon="mdi:plus" />
              Add 
            </button>
          </div>
        </div>
        <div class="p-4">
          {#if data?.profile?.addresses && data?.profile.addresses.length > 0}
            <div class="space-y-6">
              {#each data?.profile?.addresses as address, i}
                <div class="border border-primary-200 rounded-xl transition-all duration-300 p-4">
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                      <div class="bg-primary-500 p-1 rounded-xl">
                        <Icon icon={address?.type === "Invoice" ? "mdi:receipt" : "mdi:truck-delivery"} class="text-lg  text-white"/>
                      </div>
                      <h3 class="font-bold text-primary-800 text-lg">
                        {address?.type || "Address"}
                      </h3>
                    </div>
                    <div class="flex gap-2">
                      <button class="bg-primary-500 text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors shadow-md" on:click={() => handleEditAddress(address, address.type)}>
                        <Icon icon="mdi:pencil" class="text-sm" />
                      </button>
                      <form method="POST" action="?/deleteAddress" use:enhance={handleFormSubmission}>
                        <input type="hidden" name="addressId" value={address._id?.$oid || address._id || i}/>
                        <button class="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-white hover:text-red-600 transition-colors shadow-md" type="submit">
                          <Icon icon="mdi:delete" class="text-sm" />
                        </button>
                      </form>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="bg-white rounded-lg">
                      <p class="font-bold text-primary-800 text-base mb-2">
                        {address?.fullName || data?.user?.fullName}
                      </p>
                      <p class="text-primary-700 font-medium mb-2">
                        {address?.companyName || data?.user?.companyName}
                      </p>
                      <div class="text-primary-600 space-y-1">
                        <p>
                          {address.addressLine1 || ""}
                            {#if address.addressLine2} {address?.addressLine2}
                          {/if}
                        </p>
                        <p>
                          {#if address?.city && address?.district}
                              {address?.city || ""} {address?.district || ""}
                          {/if}
                        </p>
                        <p>
                          {address?.state || ""}, {address?.country || ""} - {address?.pinCode || ""}
                        </p>
                      </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3">
                      <div class="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg flex-1">
                        <Icon icon="mdi:phone" class="text-sm" />
                        <span class="text-sm font-medium">
                          {address.mobileNr || data?.user?.mobileNr || user?.cellPhone}
                        </span>
                      </div>
                      {#if address.companyWebUrl}
                        <div class="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg flex-1">
                          <Icon icon="mdi:web" class="text-sm" />
                          <a href={address?.companyWebUrl} class="text-sm font-medium hover:text-primary-200 truncate" target="_blank">
                            Website
                          </a>
                        </div>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-6">
              <div class="bg-primary-100 p-5 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center" >
                <Icon icon="mdi:map-marker-off" class="text-5xl text-primary-600"/>
              </div>
              <h3 class="text-xl font-bold text-primary-800 mb-3">
                No addresses added yet
              </h3>
              <p class="text-primary-600 mb-6">
                Add your first address to get started with orders
              </p>
              <button class="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1" on:click={() => openAddAddress()}>
                Add Your First Address
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
<Toaster position="bottom-right" richColors />

{#if showEditProfile}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed inset-0 bg-gray-400 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50" on:click={closeEditProfile}>
    <div class="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" on:click|stopPropagation >
      <h2 class="text-lg font-semibold mb-4">Edit Profile</h2>
      {#if formError}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {formError}
        </div>
      {/if}
      {#if formSuccess}
        <div class="bg-primary-100 border border-primary-400 text-primary-700 px-4 py-3 rounded mb-4">
          {formSuccess}
        </div>
      {/if}
      <form method="POST" action="?/updateProfile" novalidate
        use:enhance={({ formData, formElement, cancel }) => {
          if (!validateProfileForm()) {
            // toast.error("Please fix all validation errors before submitting");
            cancel();
            return;
          }
          return async ({ result }) => {
            if (result.type === "success") {
              if (result.data?.success) {
                toast.success("Profile updated successfully");
                await invalidate("app:profile");
                showEditProfile = false;
              } else {
                toast.error(result.data?.message || "Update failed");
              }
            } else {
              toast.error("Update failed. Please try again.");
            }
          };
        }} >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="block text-sm font-medium mb-1">
              Full Name <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Icon icon="mdi:account" width="20" height="20" />
              </span>
              <input type="text" name="fullName" required minlength="2" maxlength="50"
                class="pl-10 pr-3 py-2 w-full placeholder:text-sm text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                bind:value={fullNamepro}
                on:input={(e) => {
                  fullNamepro = sanitizeInput(e.target.value);
                  validateprofileField("fullName");
                }}
                on:blur={() => validateprofileField("fullName")}/>
            </div>
            {#if profileErrors.fullName}
              <p class="text-red-500 text-xs mt-1">{profileErrors.fullName}</p>
            {/if}
          </div>
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="block text-sm font-medium mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Icon icon="mdi:email" width="20" height="20" />
              </span>
              <input type="email" name="email" readonly value={user.email || ""} 
                class="pl-10 pr-3 py-2 w-full placeholder:text-sm text-sm border rounded-lg bg-gray-50 cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"/>
            </div>
            {#if profileErrors.email}
              <p class="text-red-500 text-xs mt-1">{profileErrors.email}</p>
            {/if}
          </div>
      <div class="">
        <label for="country" class="block text-sm font-medium text-gray-700">Country <span class="text-red-500">*</span></label >
        <div class="relative">
          <input type="text" name="country" bind:value={country} placeholder="Search Country"
            on:input={handleInputChange}  on:click={toggleDropdown} on:keydown={handleKeyDown}
            class="w-full px-4 py-2 border border-gray-200 rounded-md mt-1 placeholder:text-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"/>
          <Icon icon={showDropdown ? "ep:arrow-up-bold" : "ep:arrow-down-bold"} class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs mr-1"/>
          {#if showDropdown}
            <ul bind:this={dropdownEl} class="absolute bg-white border w-full mt-px z-10 max-h-52 overflow-y-auto rounded-md shadow" >
              {#each filteredCountries as countryItem, index}
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <li class="px-4 py-2 text-sm cursor-pointer hover:bg-primary-50 
                  {highlightedIndex === index ? 'bg-primary-50' : ''}"
                  on:click={() => selectCountry(countryItem)}>
                  {countryItem.name} ({countryItem.code})
                </li>
              {/each}
              {#if filteredCountries.length === 0}
                <div class="flex items-center px-4 py-3">
                  <Icon icon="tabler:info-square-rounded-filled" class="text-red-500 text-base mr-2" />
                  <li class="text-gray-800 text-xs">
                    No matching countries found!
                  </li>
                </div>
              {/if}
            </ul>
          {/if}
        </div>
        {#if formErrors.country}
          <p class="text-red-500 text-xs mt-0.5">{formErrors.country}</p>
        {/if}
      </div>
      <div class="">
        <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number <span class="text-red-500">*</span></label>
        <input id="phone" type="tel" name="mobileNr" maxlength="16" placeholder="Enter phone number without country code"
          bind:value={phone}
          on:input={() => validatePhoneNumber(country, phone)}
          oninput="this.value = this.value.replace(/[^0-9]/g, '')"
          class="w-full px-4 py-2 border border-gray-200 rounded-md mt-1 placeholder:text-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"/>
        {#if formErrors.phone}
        <div class="text-base">
          <Icon icon="icon-park-twotone:info" class="inline-block text-xs text-primary-400"/>
          <span class="text-2s text-gray-600">Enter phone number without country code</span>
        </div>
        {/if}
        {#if formErrors.phone}
          <p class="text-red-500 text-xs">{formErrors.phone}</p>
        {/if}
      </div>
       
        </div>
        <div class="flex justify-between">
          <button type="button" class="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50" on:click={closeEditProfile}>
            Close
          </button>
          <button type="submit" class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
{#if showAddAddress}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed inset-0 bg-gray-400 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50" on:click={closeAddAddress}>
    <div class="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" on:click|stopPropagation>
      <h2 class="text-lg font-semibold mb-4">
        {#if currentAddress}
          Edit {addressType} Address
        {:else if addressType}
          Add {addressType} Address
        {:else}
          Add New Address
        {/if}
      </h2>
      <form method="POST" novalidate action={currentAddress ? "?/updateAddress" : "?/addAddress"}
        use:enhance={({ formData, formElement, cancel }) => {
          if (!validateAddressForm(formElement)) {
            cancel();
          }
          return async ({ result }) => {
            invalidate("app:profile");
            toast.success("Address added sucessfully");
            showAddAddress = false;
          };
        }}>
        {#if currentAddress}
          <input type="hidden" name="addressId" value={currentAddress._id?.$oid || currentAddress._id}/>
        {/if}
        <div class="mb-4 flex gap-4">
          <label class="flex items-center space-x-2">
            <input type="radio" name="addressType" value="Delivery" checked={addressType === "Delivery" || (!addressType && !currentAddress)}
              class="accent-primary-500" />
            <span>Delivery Address</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" name="addressType" value="Invoice" checked={addressType === "Invoice"} class="accent-primary-500"/>
            <span>Invoice Address</span>
          </label>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="block text-sm font-medium mb-1">Full Name <span class="text-red-500">*</span></label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Icon icon="mdi:account" width="20" height="20" />
              </span>
              <input type="text" name="fullName" bind:value={fullName} minlength="2" maxlength="50" placeholder="Enter your full name"
                class="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 
                {addressErrors.fullName ? 'border-red-500' : ''}"
                on:input={(e) => {
                  fullName = sanitizeInput(e.target.value);
                  validateAddressField("fullName");
                }}
                on:blur={() => validateAddressField("fullName")} />
            </div>
            {#if addressErrors.fullName}
              <p class="text-red-500 text-xs mt-1">{addressErrors.fullName}</p>
            {/if}
          </div>
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="block text-sm font-medium mb-1" >Company Name <span class="text-red-500">*</span></label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Icon icon="mdi:domain" width="20" height="20" />
              </span>
              <input type="text" name="companyName" placeholder="Enter company name" requird minlength="2" maxlength="100"
                bind:value={companyName}
                class="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 
                {addressErrors.companyName ? 'border-red-500' : ''}"
                on:input={(e) => {
                  companyName = sanitizeInput(e.target.value);
                  validateAddressField("companyName");
                }}
                on:blur={() => validateAddressField("companyName")}/>
            </div>
            {#if addressErrors.companyName}
              <p class="text-red-500 text-xs mt-1">
                {addressErrors.companyName}
              </p>
            {/if}
          </div>
      <div class="">
        <label for="country" class="block text-sm font-medium text-gray-700" >Country<span class="text-red-500">*</span></label>
        <div class="relative">
          <input type="text" name="country" placeholder="Search Country"
            bind:value={country}
            on:input={handleInputChange}
            on:click={toggleDropdown}
            on:keydown={handleKeyDown}
            class="w-full px-4 py-2 border border-gray-200 rounded-md mt-1 placeholder:text-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"/>
          <Icon icon={showDropdown ? "ep:arrow-up-bold" : "ep:arrow-down-bold"} class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs mr-1"/>
          {#if showDropdown}
            <ul bind:this={dropdownEl} class="absolute bg-white border w-full mt-px z-10 max-h-52 overflow-y-auto rounded-md shadow">
              {#each filteredCountries as countryItem, index}
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <li class="px-4 py-2 text-sm cursor-pointer hover:bg-primary-50 {highlightedIndex === index ? 'bg-primary-50' : ''}"
                  on:click={() => selectCountry(countryItem)}>
                  {countryItem.name} ({countryItem.code})
                </li>
              {/each}
              {#if filteredCountries.length === 0}
                <div class="flex items-center px-4 py-3">
                  <Icon icon="tabler:info-square-rounded-filled" class="text-red-500 text-base mr-2"/>
                  <li class="text-gray-800 text-xs">
                    No matching countries found!
                  </li>
                </div>
              {/if}
            </ul>
          {/if}
        </div>
        {#if formErrors.country}
          <p class="text-red-500 text-xs mt-0.5">{formErrors.country}</p>
        {/if}
      </div>
      <div class="">
        <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number<span class="text-red-500">*</span></label>
        <input id="phone" type="tel" name="mobileNr" bind:value={phone} maxlength="16" placeholder="Enter phone number without country code"
          on:input={() => validatePhoneNumber(country, phone)}
          oninput="this.value = this.value.replace(/[^0-9]/g, '')"
          class="w-full px-4 py-2 border border-gray-200 rounded-md mt-1 placeholder:text-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"/>
        {#if formErrors.phone}
        <div class="text-base">
          <Icon icon="icon-park-twotone:info" class="inline-block text-xs text-primary-400"/>
          <span class="text-2s text-gray-600">Enter phone number without country code</span>
        </div>
        {/if}
        {#if formErrors.phone}
          <p class="text-red-500 text-xs">{formErrors.phone}</p>
        {/if}
      </div>
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="block text-sm font-medium mb-1">Address Line 1 <span class="text-red-500">*</span></label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Icon icon="mdi:map-marker" width="20" height="20" />
              </span>
              <input type="text" name="addressLine1" bind:value={addressLine1} minlength="5" maxlength="100" placeholder="Enter Address Line 1"
                class="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 {addressErrors.addressLine1
                  ? 'border-red-500'
                  : ''}"
                on:input={(e) => {
                  addressLine1 = sanitizeInput(e.target.value);
                  validateAddressField("addressLine1");
                }}
                on:blur={() => validateAddressField("addressLine1")}/>
            </div>
            {#if addressErrors.addressLine1}
              <p class="text-red-500 text-xs mt-1">
                {addressErrors.addressLine1}
              </p>
            {/if}
          </div>
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="block text-sm font-medium mb-1">Address Line 2</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Icon icon="mdi:map-marker-outline" width="20" height="20" />
              </span>
              <input type="text" name="addressLine2" bind:value={addressLine2} placeholder="Enter Address Line 2 (Optional)" maxlength="100"
                class="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                {addressErrors.addressLine2 ? 'border-red-500' : ''}"
                on:input={(e) => {
                  addressLine2 = sanitizeInput(e.target.value);
                  validateAddressField("addressLine2");
                }}
                on:blur={() => validateAddressField("addressLine2")}/>
            </div>
            {#if addressErrors.addressLine2}
              <p class="text-red-500 text-xs mt-1">
                {addressErrors.addressLine2}
              </p>
            {/if}
          </div>
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="block text-sm font-medium mb-1">Pin Code <span class="text-red-500">*</span></label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Icon icon="mdi:pin" width="20" height="20" />
              </span>
              <input type="text" name="pinCode" maxlength="10" placeholder="Enter your pin code" bind:value={pinCode}
                class="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 {addressErrors.pinCode
                  ? 'border-red-500'
                  : ''}"
                on:input={(e) => {
                  pinCode = e.target.value.replace(/[^0-9A-Za-z\s-]/g, "");
                  validateAddressField("pinCode");
                }}
                on:blur={() => validateAddressField("pinCode")}/>
            </div>
            {#if addressErrors.pinCode}
              <p class="text-red-500 text-xs mt-1">{addressErrors.pinCode}</p>
            {/if}
          </div>
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="block text-sm font-medium mb-1">City</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Icon icon="mdi:city" width="20" height="20" />
              </span>
              <input type="text" name="city" bind:value={city} placeholder="Enter your city" maxlength="50"
                class="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                {addressErrors.city ? 'border-red-500' : ''}"
                on:blur={() => validateAddressField("city")}
                on:input={(e) => {
                  city = sanitizeInput(e.target.value);
                  validateAddressField("city");
                }}/>
            </div>
            {#if addressErrors.city}
              <p class="text-red-500 text-xs mt-1">{addressErrors.city}</p>
            {/if}
          </div>
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="block text-sm font-medium mb-1" >District <span class="text-red-500">*</span></label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Icon icon="mdi:map" width="20" height="20" />
              </span>
              <input type="text" name="district" placeholder="Enter your district" minlength="2" maxlength="50"
                class="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                {addressErrors.district ? 'border-red-500' : ''}"
                bind:value={district}
                on:blur={() => validateAddressField("district")}
                on:input={(e) => {
                  district = sanitizeInput(e.target.value);
                  validateAddressField("district");
                }}/>
            </div>
            {#if addressErrors.district}
              <p class="text-red-500 text-xs mt-1">{addressErrors.district}</p>
            {/if}
          </div>
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="block text-sm font-medium mb-1">State <span class="text-red-500">*</span></label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Icon icon="mdi:map-outline" width="20" height="20" />
              </span>
              {#if selectedCountryAddress === ""}
                <select name="state" bind:value={state}
                  class="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 
                  {addressErrors.state ? 'border-red-500' : ''}"
                  required
                  on:change={() => validateAddressField("state")}>
                  <option value="" disabled>Select State</option>
                  {#each indianStates as stateOption}
                    <option value={stateOption}>
                      {stateOption}
                    </option>
                  {/each}
                </select>
              {:else}
                <input type="text" name="state" bind:value={state} placeholder="Enter State/Province"
                  class="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 
                  {addressErrors.state ? 'border-red-500' : ''}"
                  required
                  on:input={() => validateAddressField("state")}/>
              {/if}
            </div>
            {#if addressErrors.state}
              <p class="text-red-500 text-xs mt-1">{addressErrors.state}</p>
            {/if}
          </div>
          <div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="block text-sm font-medium mb-1">Company Web URL</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Icon icon="mdi:web" width="20" height="20" />
              </span>
              <input type="url" name="companyWebUrl" bind:value={companyWebUrl} placeholder="https://example.com"
                class="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                {addressErrors.companyWebUrl ? 'border-red-500' : ''}"
                on:input={(e) => {
                  companyWebUrl = sanitizeUrl(e.target.value);
                  validateAddressField("companyWebUrl");
                }}
                on:blur={(e) => {
                  if (companyWebUrl && !companyWebUrl.match(/^https?:\/\//i)) {
                    companyWebUrl = "https://" + companyWebUrl;
                  }
                  validateAddressField("companyWebUrl");
                }}/>
            </div>
            {#if addressErrors.companyWebUrl}
              <p class="text-red-500 text-xs mt-1">
                {addressErrors.companyWebUrl}
              </p>
            {/if}
          </div>
        </div>
        <div class="flex justify-between mt-6">
          <button type="button" class="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg" on:click={closeAddAddress}>
            Close
          </button>
          <button type="submit" class="bg-primary-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" on:click={() => debugFormState()}>
            {currentAddress ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}