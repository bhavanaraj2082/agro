<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { authedUser } from '$lib/stores/mainStores.js';

	export let data;
	// console.log(data,"data");
	
    $authedUser = data?.authedUser;

</script>

 <Header {data}/>
<Breadcrumb/> 

<div class="flex-grow sm:px-0 mx-auto ">
<slot />
</div>

<Footer />
