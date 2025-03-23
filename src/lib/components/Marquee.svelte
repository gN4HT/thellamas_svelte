<script lang="ts">
  import { cn } from "$lib/utils";

  // Các prop để tùy biến marquee
  export let pauseOnHover: boolean = false;
  export let vertical: boolean = false;
  export let repeat: number = 4;
  export let reverse: boolean = true;
  export let alternate: boolean = false;
  export let className: string = "";

  // Tạo lớp cho container bên ngoài với các biến CSS để tùy chỉnh duration và gap
  let containerClasses = cn(
          "group flex overflow-hidden p-2 [--duration:2s] [--gap:1rem] [gap:var(--gap)]",
          {
            "flex-row": !vertical,
            "flex-col": vertical,
          },
          className
  );
</script>

<div class={containerClasses}>
  {#if alternate}
    <!-- Container cho các phần tử chạy theo hướng ngược lại -->
    <div class="flex shrink-0 justify-around [gap:var(--gap)]">
      {#each { length: Math.ceil(repeat/2) } as _, i (i)}
        <div
          class={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
            "animate-marquee flex-row": !vertical,
            "animate-marquee-vertical flex-col": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": !reverse,
          })}
        >
          <slot>Default</slot>
        </div>
      {/each}
    </div>
    <!-- Container cho các phần tử chạy theo hướng ban đầu -->
    <div class="flex shrink-0 justify-around [gap:var(--gap)]">
      {#each { length: Math.floor(repeat/2) } as _, i (i)}
        <div
          class={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
            "animate-marquee flex-row": !vertical,
            "animate-marquee-vertical flex-col": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          })}
        >
          <slot>Default</slot>
        </div>
      {/each}
    </div>
  {:else}
    {#each { length: repeat } as _, i (i)}
      <div
        class={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
          "animate-marquee flex-row": !vertical,
          "animate-marquee-vertical flex-col": vertical,
          "group-hover:[animation-play-state:paused]": pauseOnHover,
          "[animation-direction:reverse]": reverse,
        })}
      >
        <slot>Default</slot>
      </div>
    {/each}
  {/if}
</div>

<style>
  /* Bạn có thể giữ lại hoặc điều chỉnh các keyframes như sau */
  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  @keyframes marquee-vertical {
    0% {
      transform: translateY(0%);
    }
    100% {
      transform: translateY(-100%);
    }
  }

  /* Các lớp animation được sử dụng ở trên */
  .animate-marquee {
    animation: marquee var(--duration, 10s) linear infinite;
  }

  .animate-marquee-vertical {
    animation: marquee-vertical var(--duration, 10s) linear infinite;
  }
</style>
