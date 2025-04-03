<script lang="ts">
    export let totalItems: number;
    export let currentPage: number = 1;

    const itemsPerPage = 10;

    function goToPage(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = parseInt(input.value) || 1;
        let maxPage = Math.ceil(totalItems / itemsPerPage);
        currentPage = Math.max(1, Math.min(maxPage, value));
    }
</script>

<p class="text-gray-500">
    Trang: {currentPage} / {Math.ceil(totalItems / itemsPerPage)}
</p>
<div class="flex gap-2">
    <button on:click={() => currentPage = 1}>
        Trang đầu
    </button>

    <button on:click={() => currentPage--} disabled={currentPage === 1}>
        Trước
    </button>

    <input
        type="number"
        bind:value={currentPage}
        on:change={goToPage}
        class="border rounded p-1 w-16 text-center"
    />

    <button
        on:click={() => currentPage++}
        disabled={currentPage * itemsPerPage >= totalItems}
    >
        Sau
    </button>

    <button on:click={() => currentPage = Math.ceil(totalItems / itemsPerPage)}>
        Trang cuối
    </button>
</div>
