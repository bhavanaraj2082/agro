<script>
    export let data;
    $: subcategories = data.records;
    import Icon from "@iconify/svelte";
  
    let searchTerm = "";
  
    $: originalCategories = subcategories
    
  
    $: filteredSubcategories = originalCategories
  
    // $: console.log("filteredSubcategories :", filteredSubcategories);
  
    function clearSearch() {
      searchTerm = "";
    }
  </script>
  <link
  href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
  rel="stylesheet"
/>
  <div class="w-full mb-8 sm:px-4 md:w-11/12 mx-auto max-w-7xl">
    <div class="pl-4 md:pl-0">
      <div class="lg:flex px-2 lg:px-0 justify-between items-center mb-2">
        <p class="text-heading font-bold text-xl lg:text-2xl mb-2 lg:mb-0">
          {subcategories[0]?.category?.name}
        </p>
        <div class="relative">
          <!-- <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="si:search-line" width="20" height="20" />
          </div> -->
          <!-- <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search subcategories..."
            class="w-full pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent placeholder:text-xs text-xs p-3"
          /> -->
          {#if searchTerm}
            <button
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded bg-red-100 p-1"
              style="color: #cb1919"
              on:click={clearSearch}>
              <Icon icon="oui:cross" width="16" height="16" class="font-bold" />
            </button>
          {/if}
        </div>
      </div>
      <p class="mt-2 text-sm sm:text-base text-content p-2 lg:p-0 text-center lg:text-left">
        Precision-driven laboratory chemicals perfect for research, analysis, and
        experiments, with top-tier quality and reliability.
      </p>
    </div>
  
    {#if filteredSubcategories.length > 0}
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12 mx-8 sm:mx-0">
        {#each filteredSubcategories as subcategory}
          <div class="relative group bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-500 ease-out hover:shadow-xl transform hover:-translate-y-0.5">
            <a
              href="/products/{subcategory.category.url}/{subcategory.url}"
              class="block h-full">
              <div 
                class="relative h-64 bg-cover bg-center"
                style="background-image: url('/category/{subcategory.category.name}.webp');">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10 group-hover:from-black/80 group-hover:via-black/70 transition-all duration-500"></div>
                <img
                src="/category.webp"
                alt={subcategory.name}
                class="w-full h-60 object-cover opacity-90 transition-transform duration-1000 ease-in-out group-hover:scale-105 group-hover:opacity-100"
            />
                <div class="absolute inset-0 flex flex-col justify-center items-center p-4 text-center">
                  <span class="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-3 shadow-sm">
                    {subcategory.category.name}
                  </span>
                  <h1 class="font-bold text-2xl px-4 text-white drop-shadow-md max-w-xs">
                    {subcategory.name}
                  </h1>
                </div>
              </div>
              <div class="p-4 bg-white">
                <div class="flex justify-between items-center">
                  <h4
                    class="text-sm font-semibold text-gray-700 group-hover:text-primary-600 transition-colors duration-300 truncate"
                    title={subcategory.name}>
                    {subcategory.name}
                  </h4>
                  {#if subcategory.productCount}
                    <span class="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {subcategory?.productCount}
                    </span>
                  {/if}
                </div>
              </div>
            </a>
          </div>
        {/each}
      </div>
    {:else}
      <div class="mt-8 flex flex-col items-center bg-white shadow rounded-md justify-center p-8 text-center">
        <Icon
          icon="ph:package-duotone"
          width="64"
          height="64"
          class="text-primary-400 mb-4"/>
        <h3 class="text-xl font-medium text-gray-900 mb-2">
          No subcategories available
        </h3>
        <p class="text-gray-500 max-w-md">
          We couldn't find any subcategories matching your search criteria. Please
          try a different search term or check back later.
        </p>
      </div>
    {/if}
  </div>
  
  
  <!-- <script>
    export let data;
    $: subcategories = data.records;
    import Icon from "@iconify/svelte";
  
    let searchTerm = "";
  
    $: filteredSubcategories = subcategories.filter(
      (subcategory) =>
        subcategory.productCount > 0 &&
        subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    $: console.log("filteredSubcategories :",filteredSubcategories) 
  
    function clearSearch() {
              searchTerm =  ''
      }
  
  </script>
  
  <div class="w-full mb-8 sm:px-4 md:w-11/12 mx-auto max-w-7xl">
    <div class="pl-4 md:pl-0">
      <div class="lg:flex px-2 lg:px-0 justify-between items-center mb-2">
        <p class="text-heading font-bold text-xl lg:text-2xl mb-2 lg:mb-0">
          {subcategories[0]?.category?.name}
        </p>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="si:search-line" width="20" height="20" />
          </div>
          <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search subcategories..."
            class="w-full pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent placeholder:text-xs text-xs p-3"/>
          {#if searchTerm}
                      <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer rounded bg-red-100 p-1" style="color: #cb1919" on:click={clearSearch}>
                          <Icon icon="oui:cross" width="16" height="16" class="font-bold" />
                      </button>
                  {/if}
        </div>
      </div>
      <p class="mt-2  text-sm sm:text-base text-content p-2 lg:p-0 text-center lg:text-left">
        Precision-driven laboratory chemicals perfect for research, analysis, and
        experiments, with top-tier quality and reliability.
      </p>
    </div>
  
    {#if filteredSubcategories.length > 0}
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12 mx-8 sm:mx-0">
        {#each filteredSubcategories as subcategory}
          <div class="relative group bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 ">
            <div class="absolute inset-0 bg-opacity-20 transition-all duration-500 ease-in-out group-hover:bg-opacity-0 z-10 pointer-events-none"></div>
            <a
              href="/products/{subcategory.category
                .urlName}/{subcategory.urlName}"
              class="block relative z-10">
              <div class="relative bg-gray-100">
  
                <div class="w-full h-56 flex justify-center items-center">
                  <h1 class="font-semibold text-2xl px-2 text-gray-600">{subcategory.name}</h1>
                </div>
                <!-- <img
                  src="/category/{subcategory.category.name}.webp"
                  alt={subcategory.name}
                  class="w-full h-60 object-cover opacity-90 transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100"
                /> --
              </div>
              <div class="p-4">
                <div class="flex justify-between items-center">
                  <h4
                    class="text-sm font-semibold text-gray-500 hover:underline truncate"
                    title={subcategory.name}>
                    {subcategory.name}
                  </h4>
                  {#if subcategory.productCount}
                    <span class="text-xs text-gray-400">
                      ({subcategory.productCount})
                    </span>
                  {/if}
                </div>
              </div>
            </a>
          </div>
        {/each}
      </div>
    {:else}
      <div class="mt-8 flex flex-col items-center bg-white shadow rounded-md justify-center p-8 text-center">
        <Icon
          icon="ph:package-duotone"
          width="64"
          height="64"
          class="text-primary-400 mb-4"
        />
        <h3 class="text-xl font-medium text-gray-900 mb-2">
          No subcategories available
        </h3>
        <p class="text-gray-500 max-w-md">
          We couldn't find any subcategories matching your search criteria. Please
          try a different search term or check back later.
        </p>
      </div>
    {/if}
  </div> -->