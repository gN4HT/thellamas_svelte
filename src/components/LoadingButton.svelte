<script lang="ts">
    export let type: "submit" | "button" = "button";
    export let loading = false;
    export let disabled = false;
    export let fullWidth = true;
    export let variant: "primary" | "secondary" = "primary";
    export let size: "sm" | "md" | "lg" = "md";

    // Dynamic classes based on props
    $: buttonClasses = [
        // Base styles
        "flex items-center justify-center gap-2 rounded font-medium transition-colors",
        // Width
        fullWidth ? "w-full" : "w-auto",
        // Variants
        variant === "primary" 
            ? "bg-[#00205b] text-white hover:bg-[#001a48]" 
            : "bg-gray-200 text-gray-800 hover:bg-gray-300",
        // Sizes
        size === "sm" ? "px-3 py-2 text-sm" 
            : size === "md" ? "px-4 py-3 text-base" 
            : "px-6 py-3 text-lg",
        // Disabled state
        (disabled || loading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    ].join(" ");
</script>

<button 
    {type}
    disabled={disabled || loading}
    class={buttonClasses}
    on:click
>
    {#if loading}
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
    {/if}
    <slot>{loading ? 'Đang xử lý...' : 'Submit'}</slot>
</button> 