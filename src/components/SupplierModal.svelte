<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { apiFetch } from '$lib/api';

  export let showModal = false;
  export let itemId: number;
  export let currentSupplierId: number | null = null;
  
  let suppliers: Array<{ id: number; name: string }> = [];
  let selectedSupplierId: number | null = null;
  let isLoading = false;
  let error: string | null = null;

  const dispatch = createEventDispatcher();

  async function fetchData() {
    try {
      const suppliersData = await apiFetch('/suppliers');
      suppliers = suppliersData;
      selectedSupplierId = currentSupplierId;
    } catch (err) {
      error = err.message;
      console.error('Error fetching suppliers:', err);
    }
  }

  $: if (showModal) {
    fetchData();
  }

  async function handleSubmit() {
    isLoading = true;
    try {
      await apiFetch(`/items/${itemId}`, {
        method: 'PUT',
        body: { supplier_id: selectedSupplierId }
      });

      dispatch('success');
      showModal = false;
    } catch (err) {
      error = err.message;
      console.error('Error submitting supplier:', err);
    } finally {
      isLoading = false;
    }
  }
</script>

{#if showModal}
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-96 max-w-lg">
    <h2 class="text-xl font-bold mb-4">Chọn Supplier</h2>
    
    {#if error}
      <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
        {error}
      </div>
    {/if}

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Supplier
      </label>
      <select 
        bind:value={selectedSupplierId}
        class="w-full border rounded-md p-2"
      >
        <option value={null}>-- Chọn supplier --</option>
        {#each suppliers as supplier}
          <option value={supplier.id}>{supplier.name}</option>
        {/each}
      </select>
    </div>

    <div class="flex justify-end space-x-2">
      <button
        on:click={() => showModal = false}
        class="px-4 py-2 border rounded hover:bg-gray-100"
        disabled={isLoading}
      >
        Hủy
      </button>
      <button
        on:click={handleSubmit}
        class="px-4 py-2 bg-[#00205b] text-white rounded hover:bg-[#001639]"
        disabled={isLoading}
      >
        {isLoading ? 'Đang lưu...' : 'Lưu'}
      </button>
    </div>
  </div>
</div>
{/if}