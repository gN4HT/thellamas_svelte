<script lang="ts">
    import {cn} from "$lib/utils";
    import type {ComponentType} from "svelte";
    import {Motion, AnimatePresence, AnimateSharedLayout} from "svelte-motion";



    type Card = {
        id: number;
        content: string | ComponentType;
        body: string | ComponentType;
        class: string;
        thumbnail: string;
    };
    let selected: Card | null = null;
    let lastSelected: Card | null = null;

    let handleClick = (card: Card) => {
        lastSelected = selected;
        selected = card;
    };

    let handleOutsideClick = () => {
        lastSelected = selected;
        selected = null;
    };
    export let cards: Card[] = [];

</script>



<div
        class="w-full h-full pb-[30px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full sm:w-[90%] lg:w-[85%] max-w-[1500px] mx-auto gap-4 sm:gap-6 relative"
>
    <AnimateSharedLayout type='crossfade'>
        {#each cards as card, i}
            <div class={cn(card.class)}>
                <Motion layoutId={`card-${card.id}`} let:motion>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div
                            on:click={() => {
              handleClick(card);
            }}
                            class={cn(
              card.class,
              "relative overflow-hidden transition-all duration-500 group min-h-[300px] sm:min-h-[200px]",
              selected?.id === card.id
                ? "rounded-lg cursor-pointer absolute inset-0 h-1/2 w-[95%] sm:w-[85%] md:w-[75%] m-auto z-50 flex justify-center items-center flex-wrap flex-col"
                : lastSelected?.id === card.id
                  ? "z-40 bg-white rounded-xl h-full w-full"
                  : "bg-white rounded-xl h-full w-full"
            )}
                            use:motion
                    >
                        <!-- Content overlay - always visible on mobile, hover on desktop -->
                        <div class={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex flex-col justify-end p-6 z-20 transition-opacity duration-300",
                            selected?.id === card.id
                                ? "opacity-100"
                                : "sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                        )}>
                            <h3 class="text-white text-xl font-bold transform transition-transform duration-300">{card.content}</h3>
                            <p class="text-white/90 text-sm mt-2 transform transition-transform duration-300">{card.body}</p>
                        </div>
                        <!-- Image with hover effect -->
                        <Motion layoutId={`image-${card.id}-image`} let:motion>
                            <img
                                    use:motion
                                    src={card.thumbnail}
                                    alt="thumbnail"
                                    height="500"
                                    width="500"
                                    class="object-cover object-center absolute inset-0 h-full w-full transition-all duration-500 sm:group-hover:scale-110 scale-125 sm:scale-100"
                            />
                        </Motion>
                    </div>
                </Motion>
            </div>
        {/each}
    </AnimateSharedLayout>
    <Motion 
        animate={{ 
            opacity: selected?.id ? 0.3 : 0,
            scale: selected?.id ? 1 : 0.95
        }}
        transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
        }}
        let:motion
    >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
                use:motion
                on:click={handleOutsideClick}
                class={cn(
        "absolute h-full w-full left-0 top-0 bg-black  z-10",
        selected?.id ? "pointer-events-auto" : "pointer-events-none"
      )}
        ></div>
    </Motion>
</div>
