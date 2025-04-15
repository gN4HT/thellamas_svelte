<script lang="ts">
    import {browser} from "$app/environment";
    import {goto} from "$app/navigation";

    if (browser && window.location.pathname === "/") {
        goto("/web");
    }
    let {children} = $props();
</script>

<div class="">
    {@render children()}
</div>