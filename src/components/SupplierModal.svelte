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
      // Fetch suppliers
      const suppliersData = await apiFetch('/suppliers');
      suppliers = suppliersData;

      // Fetch item để lấy supplier_id hiện tại
      const itemData = await apiFetch(`/items/${itemId}`);
      console.log('Item data:', itemData);

      // Set selected supplier từ item data
      selectedSupplierId = itemData.supplier_id || null;
      console.log('Selected supplier:', selectedSupplierId);
    } catch (err) {
      error = err.message;
      console.error('Error fetching data:', err);
    }
  }

  $: if (showModal) {
    fetchData();
  }

  async function handleSubmit() {
    isLoading = true;
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('supplier_id', selectedSupplierId ? String(selectedSupplierId) : '');

      console.log('Submitting supplier:', {
        itemId,
        supplierId: selectedSupplierId,
        formData: Object.fromEntries(formData)
      });

      const response = await apiFetch(`/items/${itemId}`, {
        method: 'POST',
        body: formData
      });

      if (!response) {
        throw new Error('Không nhận được phản hồi từ server');
      }

      console.log('Supplier updated successfully:', response);
      dispatch('success');
      showModal = false;
    } catch (err) {
      error = "Lỗi khi cập nhật supplier: " + (err.message || 'Unknown error');
      console.error('Error submitting supplier:', err);
    } finally {
      isLoading = false;
    }
  }

  // Lấy tên supplier từ ID
  function getSupplierName(id: number | null): string {
    if (!id) return '-- Chọn supplier --';
    const supplier = suppliers.find(s => s.id === id);
    return supplier ? supplier.name : '-- Chọn supplier --';
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
        Supplier {#if selectedSupplierId}(Hiện tại: {getSupplierName(selectedSupplierId)}){/if}
      </label>
      <select 
        bind:value={selectedSupplierId}
        class="w-full border rounded-md p-2"
      >
        <option value={null}>-- Chọn supplier --</option>
        {#each suppliers as supplier}
          <option 
            value={supplier.id}
            selected={supplier.id === selectedSupplierId}
          >
            {supplier.name}
          </option>
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