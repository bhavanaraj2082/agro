<script>
    export let data;

    const categories = data.records;
    import Icon from "@iconify/svelte";

    let originalCategories = categories;

    let searchTerm = "";

    $: filteredCategories = originalCategories;

    console.log(filteredCategories);

    function clearSearch() {
        searchTerm = "";
    }
</script>

<link
    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
    rel="stylesheet"
/>
<div class="w-full mb-10 lg:px-4 md:w-11/12 mx-auto max-w-7xl">
    <div class="md:pl-0">
        <h1
            class="sm:hidden block px-6 sm:px-0 mb-2 sm:mb-0 font-bold sm:text-2xl text-lg text-green-400"
        >
            Our Category
        </h1>
        <div
            class="text-center sm:flex px-6 sm:px-0 justify-between items-center mb-2"
        >
            <h1
                class="sm:block hidden px-6 sm:px-0 mb-2 sm:mb-0 font-bold sm:text-2xl text-lg text-green-400"
            >
                Our Category
            </h1>
            <div class="relative">
                <!-- <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                    <Icon icon="si:search-line" width="15" height="15" />
                </div> -->
            </div>
        </div>

        <p
            class="mt-2 md:text-base text-xs text-content p-2 lg:p-0 sm:pl-0 pl-7"
        >
            Explore our high-quality chemical products, Classified into various
            categories, each playing a vital role in innovation and
            transformation.
        </p>
    </div>

    {#if filteredCategories.length > 0}
        <div
            class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-12 mx-8 sm:mx-0"
        >
            {#each filteredCategories as category}
                <div
                    class="relative group bg-white shadow-lg rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:-translate-y-0.5"
                >
                    <div
                        class="absolute inset-0 bg-opacity-20 transition-all duration-500 ease-in-out group-hover:bg-opacity-0 z-10 pointer-events-none"
                    ></div>
                    <a
                        href="/products/{category.url}"
                        class="block relative z-10"
                    >
                        <div class="relative">
                            <img
                                src={category?.imageUrl}
                                alt=/category.webp
                                class="w-full h-60 object-cover opacity-90 transition-transform duration-1000 ease-in-out group-hover:scale-105 group-hover:opacity-100"
                            />
                        </div>
                        <div class="p-4 bg-white">
                            <div class="flex justify-between items-center">
                                <h4
                                    class="text-sm font-semibold text-green-700 group-hover:text-green-900 transition-colors duration-500 truncate"
                                    title={category.name}
                                >
                                    {category.name}
                                </h4>
                                <!-- {#if category.productCount}
                    <span
                      class="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                    >
                      {category.productCount}
                    </span>
                  {/if} -->
                            </div>
                        </div>
                    </a>
                </div>
            {/each}
        </div>
    {:else}
        <div
            class="mt-8 flex flex-col items-center bg-white shadow rounded-md justify-center p-8 text-center"
        >
            <Icon
                icon="ph:package-duotone"
                width="64"
                height="64"
                class="text-primary-400 mb-4"
            />
            <h3 class="text-xl font-medium text-gray-900 mb-2">
                No categories available
            </h3>
            <p class="text-gray-500 max-w-md">
                We couldn't find any categories matching your search criteria.
                Please try a different search term or check back later.
            </p>
        </div>
    {/if}
</div>
