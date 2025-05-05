<script lang="ts">

    import type {Item} from "../models/item";

    const item: Item = $props();
</script>

<div class="bg-white shadow rounded-lg overflow-hidden w-[360px] ">
        {#if item.images && item.images.length > 0}
            <img 
                src="{`https://tkhoa-innovation.com/invTracker_api/public/storage/${item.images[0]}`}" 
                alt={item.name} 
                class="w-full h-[120px] object-cover object-center" 
            />
        {:else}
        <div class="bg-gray-200 h-[120px] flex items-center justify-center relative">
            <span class="text-4xl text-gray-400"><i class="fa-solid fa-file"></i></span>
        </div>
        {/if}
    <div class="p-4">
        <p class="mt-2 font-semibold text-gray-700">{item.name}</p>
        <p class="text-sm text-gray-500 mt-1">{item.quantity} | ₫{item.price?.toLocaleString()}</p>
    </div>
</div>