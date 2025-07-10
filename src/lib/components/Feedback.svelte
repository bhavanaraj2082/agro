<script>
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import { toast, Toaster } from "svelte-sonner";
  import Icon from "@iconify/svelte";
      import { prev } from '../stores/feedStore.js'
  
    let emailIsValid = true;
    let urls='';
    export let data;
    let error;
    let err;
    let selectedRating = '';
    let showSuccesDiv = false;
    let showFailureDiv =false;
  // console.log(data, "data");
  
  let isLoadingPhone = false;
  let isEmailVerified = false;
  let loadingotp = false;
  let submitLoading = false;
  let loadingPhone = false;
  let isLoading = false;
  let ProfileEmailVerified;
  let isDataAvailable = false;
    let errors = {};
  let isEditable = false;
  // console.log(data,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  let authedUserEmailVerified = data?.profile?.isEmailVerified;
  // console.log("authedUserEmailVerified", authedUserEmailVerified);
  
  let verificationMessage = "";
  let emailSent = false;
  let displayMessage = "";
  let enteredOtp = "";
  let enteredOtpemail = "";
  let isOtpVerified = false;
  let submitting = false;
  let form3;      
  
    onMount(async () => {
        if (data && data.profile) {   
      formData.name =
        `${data.profile.firstName || ""} ${data.profile.lastName || ""}`.trim();
      formData.email = data.profile.email || "";
            
  
      isDataAvailable = true;
    } else {
      formData.name = "";
      formData.email = data?.email || "";
      
      if (data?.email) {
        email = data.email;
        const reloadFlag = sessionStorage.getItem("emailReloaded");
        if (!reloadFlag) {
          sessionStorage.setItem("emailReloaded", "true");
          location.reload(); // This will reload the page only once to prevent infinite reload
        } else {
          sessionStorage.removeItem("emailReloaded");
        }
      }
    }
          prev.subscribe(value => {
              urls = "https://chemikart.partskeys.com" + value;
        // console.log("urlsurlsurls",urls);
          });
        });
  
    let formData = {
      issue: [],
      requirement: 'Yes',
      feedback: '',
      name: '',
      email: '',
      url: '',
      rating: '',
      status:''
    };
    let successMessage = '';
    let errorMessage = '';
    let formValid = true;
    let showErrors = false;
    let showNameError = false;
    let showEmailError = false;
    let showFeedbackError = false;
    let showIssueError = false;
    let showEmailVerifyError= false;
    let showRatingError = false;
    let showNameValidError = false;
    let nameIsValid='';
      const resetForm = () => {
      formData = {
        issue: [],
        requirement: 'Yes',
        feedback: '',
        name: '',
        email: '',
        url: '',
        rating: ''
      };
      urls='';
    };
  
    const handleResendOtpemail = () => {
    if (!loadingotp) {
      form3.requestSubmit();
      // startTimer();
    }
  };
    function showMessage(message1, keywordError) {
      successMessage = message1;
      errorMessage = keywordError;
      if (keywordError === 'success') {
        setTimeout(() => {
          resetForm();
        }, 2000);
      }
    }
  
    // Function to validate email format using a regular expression
  // function isValidEmail() {
  //   const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   emailIsValid = emailPattern.test(formData.email);
  //   return emailIsValid;
  // }
  
  function isValidName() {
    const namepattern =/^[A-Za-z\s]+$/;
    nameIsValid = namepattern.test(formData.name);
    return nameIsValid;
  }
    // const handleSubmit = async (event) => {
    //   const { name, email, feedback, issue, rating } = formData;
    //   if (name.length === 0 || email.length === 0 || feedback.length === 0 || issue.length === 0 || rating.length === 0) {
    //     event.preventDefault();
    //     formValid = false;
    //     showErrors = true;
    //   }
    //   else if (!isValidEmail()) {
    //     event.preventDefault();
    //     showErrors1 = true;
    //   }
    //    else {
    //     formValid = true;
    //     showErrors = false;
    //   }
    //   if (!formValid) {
    //     event.preventDefault(); 
    //   }
    // };
  
  
  
  const handleSubmit = async (event) => {
    // Reset all error flags
    formValid = true;
    showNameError = false;
    showEmailError = false;
    showFeedbackError = false;
    showIssueError = false;
    showRatingError = false;
    showEmailVerifyError = false;
    showNameValidError = false;
  
    const { name, email, feedback, issue, rating } = formData;
  
    // Check if each required field is filled
    if (name.length === 0) {
      showNameError = true;
      formValid = false;
    }
  
    if (email.length === 0) {
      showEmailError = true;
      formValid = false;
    }
  
    if (feedback.length === 0) {
      showFeedbackError = true;
      formValid = false;
    }
  
    if (issue.length === 0) {
      showIssueError = true;
      formValid = false;
    }
  
    if (rating.length === 0) {
      showRatingError = true;
      formValid = false;
    }
  
    if (email.length === 0) {
      showEmailError = true;
      formValid = false;
    }
  
    if (!isValidName()) {
      showNameValidError = true;
      formValid = false;
    }
  
  
    // if (isOtpVerified = false){
    //   showEmailVerifyError = true;
    //   formValid = false;
    // }
  
    // If validation fails, show the general error message
    if (!formValid) {
      event.preventDefault();
      showErrors = true;
  
      // Set a timeout to hide the error message after 3 seconds (or whatever delay you prefer)
      setTimeout(() => {
        showErrors = false;
      }, 3000); // 3000ms = 3 seconds
    }
  };
  
  
  </script>
  
  <!-- {urls} -->
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  {#if showSuccesDiv}
    <div
    class="mb-4 w-full flex items-center justify-center mx-auto max-w-7xl p-4"
  >
    <div
        class="w-full lg:w-11/12 p-10 md:w-3/4 text-center bg-white rounded-lg"
    >
        <h3 class="md:text-xl text-lg font-semibold text-green-600 mb-4">
          Feedback Form Submission
        </h3>
        <p class="md:text-md text-xs text-gray-700 mt-4 mb-6">
          Thank you for submitting your Feedback! We have
          received it and we will look into that.
        </p>
        <div class="w-10/12 mx-auto my-6 border-t-1 border-green-300"></div>
        <div class="flex items-center justify-center">
            <a
                href="/"
                class="bg-white text-green-500 border-1 border-green-500 px-4 py-2 rounded-md font-medium hover:bg-green-500 hover:text-white transition-all duration-300 flex justify-center items-center"
            >
                <Icon icon="mdi:home" class="text-xl mr-2" />Back to Home
            </a>
        </div>
    </div>
  </div>
  
  {:else if showFailureDiv}
  <div
          class="pb-20 pt-20 h-4/5 w-full flex items-center justify-center bg-gray-50 mx-auto max-w-7xl mb-10 sm:text-sm text-xs"
      >
          <div
              class="w-10/12 md:w-8/12 bg-gradient-to-r from-red-100 via-red-50 to-red-100 p-8 rounded-lg shadow-lg text-center"
          >
              <p class="sm:text-md text-sm text-gray-700 mb-6">
              There was an issue with submitting the form. Please try again after a while.
              </p>
  
              <div class="w-10/12 mx-auto my-6 border-t-2 border-red-300"></div>
              <div>
                  <a
                      href="/feedback"
                      class="sm:text-sm text-xs bg-white text-green-500 border border-green-500 px-4 py-2 rounded-md hover:bg-green-500 hover:text-white transition"
                  >
                  Back to Feedback
                  </a>
              </div>
          </div>
      </div>
  {:else}
  <h1 class="font-bold text-lg md:text-2xl pl-1 pb-5 w-11/12 max-w-7xl justify-center mx-auto text-green-500">Feedback</h1>
  <section class="w-11/12 max-w-7xl flex flex-wrap justify-center mx-auto font-roboto bg-white mb-10">
      <div class="w-full border border-gray-300 rounded-lg p-2">
  <form
    method="POST"
    action="?/feedbacks"
    id="feedback-form"
    class="p-4"
    use:enhance={(event) => {
      // Check email verification first

      submitting= true;
      return async ({ result }) => {
        let message1 = '';
        let keywordError = '';
        keywordError = result.data.type;
        if (keywordError === "success") {
          message1 = result.data.data.message;
          submitting = false;
          resetForm();  
          showSuccesDiv = true;
          // setTimeout(() => {
                  // 				location.reload();
                  // 			}, 3000);
        } else if (keywordError === "error") {
          message1 = result.data.data.error;
          submitting = false;
          showFailureDiv = true;
        }
        showMessage(message1, keywordError);
      };
    }}
  >
  
    <div class="space-y-12 font-workSans">
      <div class="">
        <!-- <h2 class="text-sm font-semibold text-gray-900 mb-4"> Chemikart feedback<span class="text-red-500 text-xs font-semibold">*</span></h2> -->
        <p class="mt-1 mb-4 sm:text-sm text-xs text-gray-700">If you come across any issues on our website, let us know! We’ll work on fixing them right away.</p>
        
        <fieldset class="border-b border-gray-900/10 pb-12">
          <div class="mt-2 space-y-4 text-xs">
  
            <!-- {#if !selectedRating} -->
            {#each ['Website design & usability', 'User Experience & Website Functionality'] as rating, index}
            <div class="flex items-center gap-x-3">
              <input
                type="radio"
                id="rating-{index}" 
                class="form-radio w-3.5 h-3.5 text-green-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 cursor-pointer"
                bind:group={selectedRating} 
                value={rating}
              />
              <!-- Link the label to the input by using 'for' attribute matching the input's id -->
              <label 
                class="block sm:text-sm text-xs font-base text-gray-900 cursor-pointer" 
                for="rating-{index}"  
              >
                {rating}
              </label>
            </div>
          {/each}
          
  <!-- {/if} -->
  
  
          {#if selectedRating === 'Website design & usability'}
          <legend class="text-sm font-semibold text-gray-900">Enhancing Website Performance and Customer Satisfaction</legend>
            {#each ['Slow Website Loading Speed','Poor Mobile Responsiveness', 'Poor Search Functionality', 'Lack of Payment Options', 'Good Website design'] as issue}
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={issue}
                  name="issue"
                  value={issue}
                  class="w-4 h-4 mb-1 ml-1 form-checkbox rounded-sm text-green-400 focus:outline-none focus:ring-0"
                  bind:group={formData.issue}
                  on:change={() => showIssueError = false} 
                />
                <label for={issue} class="font-base text-gray-900 cursor-pointer">{issue}</label>
              </div>
            {/each}
  
            {:else if selectedRating === 'User Experience & Website Functionality'}
            <legend class="text-sm font-semibold text-gray-900">Report an issue</legend>
            {#each ['I can`t login to my profile' ,'Issue with Contact form submission','Issue with Quotes request submission', 'Issue with other form submission','Everything is running smoothly'] as issue}
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id={issue}
                name="issue"
                value={issue}
                class="w-4 h-4 mb-1 ml-1 form-checkbox rounded-sm text-green-400 focus:outline-none focus:ring-0"
                bind:group={formData.issue}
                on:change={() => showIssueError = false} 
              />
              <label for={issue} class="font-base text-gray-900 cursor-pointer">{issue}</label>
            </div>
          {/each}
          {/if}
          </div>
          {#if showIssueError}
          <div class="text-red-500 sm:text-xs text-2s font-medium mt-3">Please select at least one issue.</div>
        {/if}
      </fieldset>
        
        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-gray-900/10 pb-12">
          
  
         
  
          <div class="sm:col-span-2 sm:col-start-1">
            <label for="name" class="block sm:text-sm text-xs font-base text-gray-900 pb-1">User Name<span class="text-red-500 text-xs font-semibold">*</span></label>
            <input
              type="text"
              name="name"
              id="name"
              bind:value={formData.name}
              on:input={() => showNameError = false} 
              class="block w-full rounded-md focus:ring-0 focus:outline-none border border-gray-500 focus:border-green-500 bg-white px-3 py-1.5 text-sm text-gray-900"
            />
            <!-- {#if formData.name.length > 0 && !/^[a-zA-Z]+$/.test(formData.name)} -->
            {#if formData.name.length > 0 && !/^[A-Za-z\s]+$/.test(formData.name)}  
            <span class="text-red-500 text-xs font-normal">Please enter a valid user name.</span>
           {/if}{#if showNameError}
            <div class="text-red-500 sm:text-xs text-2s font-medium mt-1">Please enter your name.</div>
          {/if}
        </div>

        <div class="sm:col-span-2 sm:col-start-1">
          <label for="email" class="block sm:text-sm text-xs font-base text-gray-900 pb-1">Email<span class="text-red-500 text-xs font-semibold">*</span></label>
          <input
            type="text"
            name="email"
            id="email"
            bind:value={formData.email}
            on:input={() => showNameError = false} 
            on:input={() => {
              showEmailError = false
                formData.email = formData.email.trim();
                // validateField("email");
                errors.email = !formData.email
                    ? "*Required"
                    : !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                        formData.email,
                    ) ||
                    formData.email
                        .split("@")[1]
                        .includes("gamil")
                    ? "Please enter a valid email address"
                    : "";
               
            }}
            class="block w-full rounded-md focus:ring-0 focus:outline-none bo  border border-gray-500 focus:border-green-500  px-3 py-1.5 text-sm text-gray-900"
          />
          <!-- {#if formData.name.length > 0 && !/^[a-zA-Z]+$/.test(formData.name)} -->
          {#if formData.email.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                    formData.email)}  
          <span class="text-red-500 text-xs font-normal">Please enter a valid Email.</span>
         {/if}{#if showEmailError}
          <div class="text-red-500 sm:text-xs text-2s font-medium mt-1">Please enter Email.</div>
        {/if}
      </div>

      <div class="sm:col-span-3 sm:col-start-1">
        <label for="feedback" class="block sm:text-sm text-xs font-base text-gray-900 pb-1">Tell us what we can do better!<span class="text-red-500 text-xs font-semibold">*</span></label>

          <!-- <div class="sm:col-span-">
            <label for="feedback" class="block sm:text-sm text-xs font-base text-gray-900 pb-1">Tell us what we can do better!<span class="text-red-500 text-xs font-semibold">*</span></label> -->
            <textarea
              name="feedback"
              id="feedback"
              bind:value={formData.feedback}
              on:input={() => showFeedbackError = false} 
              rows="3"
              class="block w-full rounded-md bg-white border border-gray-500 px-3 py-1.5 text-sm text-gray-900 focus:ring-0 focus:outline-none border-1 border-gray-300 focus:border-green-500"
            ></textarea>
            {#if showFeedbackError}
      <div class="text-red-500 sm:text-xs text-2s font-medium mt-1">Please provide your feedback.</div>
    {/if}
          </div>
        </div>
  
        <div class="">
          <div class="mt-10 space-y-10">
            <fieldset>
              <legend class="text-sm font-semibold text-gray-900">Share Your Thoughts<span class="text-red-500 text-xs font-semibold">*</span></legend>
              <p class="mt-1 text-sm text-gray-600">Rate Your Experience on Our Website.</p>
              <div class="mt-6 space-y-6">
                {#each ['Excellent', 'Good', 'Average', 'Poor'] as rating}
                  <div class="flex items-center gap-x-3">
                    <input
                      type="radio"
                      id={rating}
                      name="rating"
                      class="form-radio w-3.5 h-3.5 text-green-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500"
                      value={rating}
                      bind:group={formData.rating}
                      on:input={() => showRatingError = false} 
                    />
                    
                    <label for={rating} class="block sm:text-sm text-xs font-base text-gray-900 cursor-pointer">{rating}</label>
                  </div>
                {/each}
                {#if showRatingError}
      <div class="text-red-500 sm:text-xs text-2s font-medium mt-1">Please enter a rating.</div>
    {/if}
              </div>
            </fieldset>
          </div>
        </div>
  
        <!-- <input
               type="hidden"
               name="status"
               id="status"
               bind:value={formData.status}
           /> -->
           <input type="hidden" name="status" value="unread" />
      </div>
  
      <!-- {#if showErrors}
      <div class="font-normal text-xs text-red-500">Please fill in all required fields.</div>
    {/if} -->
    {#if successMessage}
      <div class="mt-4 text-green-500">{successMessage}</div>
    {/if}
  
      <div class="flex items-center justify-end gap-x-6">
        <button type="submit" on:click={handleSubmit}                   
        class="sm:px-5 px-2 sm:py-2 py-1 bg-green-500 text-white sm:text-md text-sm rounded transition duration-300 hover:bg-green-600 sm:w-auto font-semibold"
        >
        {#if submitting}
      Submitting...
    {:else}
      Submit
    {/if}</button>
      </div>
    </div>
  
  </form>
    </div>
  </section>
  {/if}
   