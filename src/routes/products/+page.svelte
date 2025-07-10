<script>
    import Category from "$lib/components/Category.svelte";
    export let data;
    console.log(data,"category");
    
</script>
<Category {data} />