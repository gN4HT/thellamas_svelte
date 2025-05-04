<script lang="ts">
    import {browser} from "$app/environment";
    import {goto} from "$app/navigation";

    if (browser && window.location.pathname === "/") {
        setTimeout(() => {
            goto("/web");
        }, 2000);
    }
    let {children} = $props();
</script>

<div class="">
    {@render children()}
</div>