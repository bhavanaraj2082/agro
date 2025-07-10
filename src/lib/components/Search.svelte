<script>
    export let title;
    export let items = [];
    export let isSubcategory = false;
    export let linkPrefix;
  </script>
  
  {#if items.length > 0}
    <div class="pb-4">
      <h3 class="text-xl font-bold mb-4">{title}</h3>
      <section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each items as item}
          <a
            href="{linkPrefix}{isSubcategory
              ? item?.category?.urlName + '/' + item?.urlName
              : item?.urlName}"
            class="block group transform transition-all ease-in-out duration-700">
            <div class="flex bg-white rounded-md shadow overflow-hidden transition-all group-hover:shadow-md">
              {#if title === "Categories"}
                <img
                  src="/category/{item.name}.webp"
                  alt={item?.name}
                  class="w-28 h-28 object-cover opacity-90 transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100" />
              {:else}
                <img
                  src="/category/{item.category.name}.webp"
                  alt={item?.name}
                  class="w-28 h-28 object-cover opacity-90 transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100"/>
              {/if}
              <div class="flex flex-col justify-center items-center rounded-r-md h-28 w-full gap-4 shadow-md p-6 cursor-pointer transform transition-all ease-in-out group-hover:shadow-md group-hover:text-primary-500 bg-white" >
                <p class="text-lg font-semibold text-gray-700 group-hover:text-primary-600 text-center transition-all duration-300">
                  {item?.name}
                </p>
              </div>
            </div>
          </a>
        {/each}
      </section>
    </div>
  {/if}