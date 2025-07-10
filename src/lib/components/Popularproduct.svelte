<script>
  import PopularProducts from '$lib/data/popularproducts.json';
  // import {PUBLIC_IMAGE_URL} from "$env/static/public"
</script>
<div
class="my-4 grid grid-cols-1 container mx-auto px-6 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center max-w-7xl">
{#each PopularProducts as product}
<div class="shadow flex flex-col justify-between gap-2 bg-white rounded-lg px-5 py-5 lg:px-10 overflow-hidden hover:shadow-md">
  <img
    src="/farm.jpg"
    alt={product.name}
    class="w-44 h-44 mx-auto object-contain rounded-t-lg"
  />
  <div class="grow space-y-1 mt-4">
    <h3 class="text-sm font-semibold">{product.name}</h3>
    <!-- <h3 class="text-sm text-gray-600">Product Number : {product.product_number}</h3> -->
    <!-- <h3 class="text-gray-600 text-sm ">Price: {product.price}</h3> -->
    <h3 class="text-gray-600 text-sm">
      Price: ₹{(product.price * 83.5).toFixed(2)}
    </h3>
  </div>
  <a
    href={product.product_number
      ? `products/${product.category?.url}/${product.subcategory?.url}/${product.product_number}`
      : '#'}
    class="bg-green-400 text-white md:w-full w-10/12 mx-auto text-sm font-medium py-2 rounded-md hover:bg-primary-500 md:mb-2.5 mb-2 transition-all duration-300">
    View Details
  </a>
</div>
{/each}
</div>