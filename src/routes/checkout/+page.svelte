<script>
  import Checkout from "$lib/components/Cart/Checkout.svelte";
  export let data
</script>

<svelte:head>
  <title>Checkout - Component2Web</title>
  <meta
    name="description"  
    content="Complete your purchase securely with Component2Web. Review your order details, enter shipping information, and finalize your payment with confidence."
  />
</svelte:head>


<div>
    <Checkout {data}/>
</div>