<script>
  import Cart from "$lib/components/Cart/Cart.svelte";
  export let data
  console.log(data,"dataaa");
  
</script>



<div>
    <Cart {data}/>
</div>