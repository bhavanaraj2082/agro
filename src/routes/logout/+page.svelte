<script>
    import { authedUser } from "$lib/stores/mainStores.js";
    import { onMount } from "svelte";

    onMount(() => {
        authedUser.set({ username: "", email: "", userId: "" });
    });
    cartTotalComps.set(0);
    localStorage.setItem("totalComps", 0);
    localStorage.removeItem("cartExpiration");
</script>
