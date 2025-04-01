<script lang="ts">

    import type {Item} from "../models/item";

    const item: Item = $props();
</script>

<div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="bg-gray-200 p-10 flex items-center justify-center relative">
        <span class="text-4xl text-gray-400"><i class="fa-solid fa-file"></i></span>
    </div>
    <div class="p-4">
        <p class="mt-2 font-semibold text-gray-700">{item.name}</p>
        <p class="text-sm text-gray-500 mt-1">{item.quantity} | {item.price}</p>
    </div>
</div>