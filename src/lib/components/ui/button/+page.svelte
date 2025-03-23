<script>
  import { cn } from "$lib/utils";
  export let variant = "default";
  export let size = "default";
  export let class_ = "";
</script>

<button
  class={cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-blue-600 text-white hover:bg-blue-700": variant === "default",
      "bg-white text-blue-600 hover:bg-gray-100": variant === "secondary",
      "border border-gray-200 bg-white hover:bg-gray-100": variant === "outline",
      "text-blue-600 underline-offset-4 hover:underline": variant === "link",
      "h-10 px-4 py-2": size === "default",
      "h-9 rounded-md px-3": size === "sm",
      "h-11 rounded-md px-8": size === "lg",
    },
    class_
  )}
  on:click
>
  <slot />
</button> 