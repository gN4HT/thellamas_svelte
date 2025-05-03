<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { apiFetch } from '$lib/api';

  export let showModal = false;
  export let id: number;
  export let currentFields: number[] = [];
  
  let fields: Array<{ id: number; name: string }> = [];
  let selectedFields: number[] = [];
  let existingFieldIds: number[] = [];
  let isLoading = false;
  let error: string | null = null;

  const dispatch = createEventDispatcher();

  async function fetchData() {
    try {
      // Fetch tất cả fields
      const fieldsData = await apiFetch('/fields');
      fields = fieldsData;

      // Fetch chi tiết item để lấy fields hiện tại
      const response = await apiFetch(`/items/${id}`);
      

      // Lấy danh sách field IDs từ response
      if (response && response.fields && Array.isArray(response.fields)) {
        // Đảm bảo lấy id từ mỗi field
        existingFieldIds = response.fields.map((field: number | { id: number }) => 
          typeof field === 'number' ? field : field.id
        );
        
        // Set selected fields từ existing fields
        selectedFields = [...existingFieldIds];
        
      } else {
        existingFieldIds = [];
        selectedFields = [];
        console.warn('No fields data or invalid format received');
      }
    } catch (err) {
      error = err.message;
      console.error('Error fetching data:', err);
      existingFieldIds = [];
      selectedFields = [];
    }
  }

  $: if (showModal) {
    fetchData();
  }

  // Kiểm tra field đã được liên kết chưa
  function isFieldLinked(fieldId: number) {
    return existingFieldIds.includes(fieldId);
  }

  async function handleSubmit() {
    isLoading = true;
    try {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        
        // Thêm từng field_id vào formData
        selectedFields.forEach(fieldId => {
            formData.append('fields[]', String(fieldId));
        });
        
        const response = await apiFetch(`/items/${id}`, {
            method: 'POST',
            body: formData,
            type: 'items'
        });

        if (!response) {
            throw new Error('Không nhận được phản hồi từ server');
        }
        dispatch('success');
        showModal = false;
    } catch (err) {
        error = "Lỗi khi lưu fields: " + (err.message || 'Unknown error');
        console.error('Error submitting fields:', err);
    } finally {
        isLoading = false;
    }
  }
</script>

{#if showModal}
<div class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-96 max-w-lg">
    <h2 class="text-xl font-bold mb-4 text-[#00205b]">Chọn Trường</h2>
    
    {#if error}
      <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
        {error}
      </div>
    {/if}

    <div class="mb-4">
      <label for="fields" class="block text-sm font-medium text-gray-700 mb-2">
        Trường
      </label>
      <div class="border border-[#DADCFF] rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
        <!-- Trường đã liên kết -->
        {#if existingFieldIds.length > 0}
          <div class="bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
            Trường đã liên kết
          </div>
          {#each fields.filter(field => isFieldLinked(field.id)) as field}
            <label 
              class="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-[#DADCFF] bg-blue-50"
            >
              <input 
                type="checkbox"
                value={field.id}
                bind:group={selectedFields}
                class="mr-3 accent-blue-600 border border-[#DADCFF]"
              />
              <span>{field.name}</span>
            </label>
          {/each}
        {/if}

        <!-- Trường chưa liên kết -->
        <div class="bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
          Trường khả dụng
        </div>
        {#each fields.filter(field => !isFieldLinked(field.id)) as field}
          <label 
            class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-[#DADCFF] last:border-b-0"
          >
            <input 
              type="checkbox"
              value={field.id}
              bind:group={selectedFields}
              class="mr-3"
            />
            <span>{field.name}</span>
          </label>
        {/each}
      </div>
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

<style>
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 2px solid #d1d5db;
    cursor: pointer;
  }

  input[type="checkbox"]:checked {
    background-color: #00205b;
    border-color: #00205b;
  }

  /* Custom scrollbar */
  div::-webkit-scrollbar {
    width: 6px;
  }

  div::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  div::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  div::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
