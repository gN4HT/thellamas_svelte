<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let totalItems: number;
    export let currentPage: number = 1;
    export let latestId: number | null = null;

    function goToPage(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = parseInt(input.value) || 1;
        currentPage = Math.max(1, value);
    }

    $: canGoNext = latestId === null || latestId > 1;
</script>

<p class="text-sm text-gray-500 mb-2">
    Trang: {currentPage}
</p>

<div class="flex items-center gap-2">
    <!-- Prev Button -->
    <button
        on:click={() => dispatch('prev')}
        disabled={currentPage === 1}
        class="px-3 py-1.5 rounded border text-sm font-medium 
               transition-colors duration-200
               disabled:opacity-50 disabled:cursor-not-allowed
               bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
    >
        Trước
    </button>

    <!-- Page Input -->
    <input
        type="number"
        bind:value={currentPage}
        on:change={goToPage}
        class="w-16 text-center border border-gray-300 rounded 
               p-1 text-sm focus:outline-none focus:ring-2 
               focus:ring-blue-500 focus:border-blue-500"
    />

    <!-- Next Button -->
    <button
        on:click={() => dispatch('next')}
        disabled={!canGoNext || totalItems === 0}
        class="px-3 py-1.5 rounded border text-sm font-medium 
               transition-colors duration-200
               disabled:opacity-50 disabled:cursor-not-allowed
               bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
    >
        Sau
    </button>
</div>

