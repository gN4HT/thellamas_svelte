<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
  
    if (browser && window.location.pathname === "/") {
      goto("/web");
    }
  </script>
  
  <slot />