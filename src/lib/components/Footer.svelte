<script>
  import Icon from "@iconify/svelte";
  export let companyAddress = "51/31, 1st Main Marenahalli, Vijayanagar";
  function toggleHelp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  let showTooltip = false;

  function handleMouseEnter(){
    showTooltip = true;
  }

  function handleMouseLeave(){
    showTooltip = false;
  }

  const footerLinks = {
    product: [
      { name: "Landing Page", href: "#" },
      { name: "Popup Builder", href: "#" },
      { name: "Web-design", href: "#" },
      { name: "Content", href: "#" },
      { name: "Integrations", href: "#" },
    ],
    usecases: [
      { name: "View Cart", href: "/cart" },
      { name: "Help", href: "/help" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "Terms", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: "iconoir:facebook",
      href: "https://facebook.com/agroconnect",
    },
    {
      name: "Instagram",
      icon: "fa6-brands:instagram",
      href: "https://instagram.com/agroconnect",
    },
    {
      name: "YouTube",
      icon: "hugeicons:youtube",
      href: "https://youtube.com/agroconnect",
    },
    {
      name: "LinkedIn",
      icon: "uit:linkedin-alt",
      href: "https://linkedin.com/company/agroconnect",
    },
     {
      name: "scrollup",
      icon: "fluent-emoji:up-arrow",
      action: "scrollToTop",
    }
  ];
</script>

<footer class="bg-gradient-to-b from-primary-400 to-primary-700 w-full">
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:w-11/12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-black">
      <div class="text-center md:text-left">
        <div class="mb-4">
          <a href="/" class="text-xl font-bold text-white">
            Agro<span class="text-white">Connect</span>
          </a>
        </div>
        <div
          onclick="window.open('https://www.google.com/maps/place/51,+31,+1st+Main+Rd,+Kaveri+Layout,+Marenahalli,+Vijayanagar,+Bengaluru,+Karnataka+560040/@12.969821,77.532692,16z/data=!4m6!3m5!1s0x3bae3dd957daed27:0x5e1bcc409e939142!8m2!3d12.9698209!4d77.5326915!16s%2Fg%2F11q3_74mjm?hl=en&entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D', '_blank')"
          class="cursor-pointer hover:underline text-white"
        >
          <p class="text-white">{companyAddress}</p>
          <span>Bangalore - 560040</span>
        </div>
      </div>

      <!-- Company Links -->
      <div class="text-center md:text-left">
        <h5 class="font-semibold mb-4 text-white text-xl">
          Help & Information
        </h5>
        <ul class="space-y-3">
          {#each footerLinks.company as link}
            <li>
              <a href={link.href} class="text-white hover:underline">
                {link.name}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <div class="text-center md:text-left">
        <div>
          <h2 class="font-semibold mb-4 text-white text-xl">Social Media</h2>

          <div
            class="flex justify-center md:justify-start space-x-4 items-center mb-5"
          >
      {#each socialLinks as social}
  {#if social.href}
    <!-- Normal social link -->
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      class="w-8 h-8 border rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary-600 hover:border-primary-200 transition-colors"
      aria-label={social.name}
    >
      <Icon icon={social.icon} width="16" height="16" />
    </a>
  {:else if social.action === "scrollToTop"}
    <!-- Scroll to top icon with tooltip -->
     <button
    on:click={toggleHelp}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    class="ml-20 w-12 h-12 flex items-center justify-center  transition-colors relative"
    aria-label={social.name}
  >
    <Icon icon={social.icon} class="w-7 h-7 ml-5" />
    
    {#if showTooltip}
<div class="absolute bottom-10 left-2 transform -translate-x-1/2 z-50 whitespace-nowrap bg-black text-white font-medium rounded-md shadow mb-1 text-2s px-3 py-1">
    Return to Top
      <div class="absolute top-full right-1 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black"></div>
    </div>
    {/if}
  </button>
  {/if}
{/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Line -->
    <div
      class="mt-12 pt-8 border-t border-gray-200 text-center text-white text-sm"
    >
      <div class="sm:inline-block block">
        &copy; {new Date().getFullYear()} Agro Connect.
      </div>
      <div class="sm:inline-block block sm:ml-2 mt-1 sm:mt-0">
        All rights reserved.
      </div>
    </div>
  </div>
</footer>
