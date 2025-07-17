<script>
  let searchQuery = "";
  const categories = [
    {
      title: "Account & Billing",
      faqs: [
        {
          question: "How do I reset my password?",
          answer:
            'To reset your password, visit the login page and click the "Forgot Password" link. Follow the instructions sent to your registered email address.',
        },
        {
          question: "How can I check the details of my quotes?",
          answer:
            "On the Quotes page, enter your Quote ID and email address to access the quote details. If you are logged in, you can also view your quotes directly in the dashboard.",
        },

        {
          question: "Can I change my billing address?",
          answer:
            "Yes, you can update your billing address under Dashboard > Address Management.",
        },
      ],
    },
    {
      title: "Using the Service",
      faqs: [
        {
          question: "Can I use the app on multiple devices?",
          answer:
            "Yes, you can log in and use your account on multiple devices simultaneously.",
        },
        {
          question: "Is there a desktop version of the app?",
          answer:
            "Yes, our service is available both as a desktop application and a mobile app.",
        },
        {
          question: "Does the app support offline usage?",
          answer:
            "Certain features are available offline and will sync automatically when you reconnect to the internet.",
        },
      ],
    },
    {
      title: "Technical Support",
      faqs: [
        {
          question: "How do I report a bug or issue?",
          answer:
            'Please email us at <a href="mailto:sales@components2webs.com" class="text-blue-600 hover:text-blue-700 ">sales@components2webs.com</a> with a detailed description of the problem.',
        },
        {
          question: "Why am I not receiving notifications?",
          answer:
            "Check your notification preferences both within the app and your device settings to ensure notifications are enabled.",
        },
        {
          question: "The app is running slowly. How can I improve performance?",
          answer:
            "Try clearing the app cache, closing other background apps, or restarting your device to enhance performance.",
        },
      ],
    },
  ];
</script>

<div class="max-w-6xl mx-auto px-4 py-10">
  <div class="text-center mb-10">
    <h1 class="text-2xl lg:text-3xl font-bold mb-4">Help Center</h1>
    <!-- <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search for help articles..."
      class="w-full max-w-xl mx-auto p-3 border rounded-xl shadow-sm"
    /> -->
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each categories as category}
      <div class="bg-white p-6 rounded-2xl shadow-md">
        <h2 class="text-base lg:text-xl font-semibold mb-4">
          {category.title}
        </h2>
        <ul class="space-y-3">
          {#each category.faqs as faq}
            <li>
              <details class="group">
                <summary
                  class="cursor-pointer text-primary-500 text-sm lg:text-sm"
                >
                  {faq.question}
                </summary>
                <p class="mt-2 text-gray-700 text-sm lg:text-sm">
                  {@html faq.answer}
                </p>
              </details>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>

  <div class="mt-16 text-center">
    <h2 class="text-xl lg:text-2xl font-semibold mb-2 mt-10">
      Still Need Help?
    </h2>
    <p class="mb-4 text-gray-600 text-sm lg:text-base">
      Our team is here to help, feel free to get in touch. We aim to respond
      within 24 hours.
    </p>
    <div class="flex flex-col md:flex-row justify-center items-center gap-4">
      <a
        href="/contact"
 class="px-6 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-primary-500 hover:to-primary-600 transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300"
        >Contact Us</a
      >
    </div>
  </div>
</div>

<style>
  details summary::-webkit-details-marker {
    display: none;
  }
</style>
