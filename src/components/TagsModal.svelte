<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { apiFetch } from '$lib/api';

  export let showModal = false;
  export let id: number;
  export let type: 'folder' | 'item';
  export let currentTags: number[] = [];
  
  let tags: Array<{ id: number; name: string }> = [];
  let selectedTags: number[] = [];
  let existingTagIds: number[] = [];
  let isLoading = false;
  let error: string | null = null;

  const dispatch = createEventDispatcher();

  async function fetchData() {
    try {
      // Fetch tất cả tags
      const tagsData = await apiFetch('/tags');
      tags = tagsData;

      // Fetch chi tiết item/folder để lấy tags hiện tại
      const response = await apiFetch(`/${type}s/${id}`);
      
      console.log('Response data:', response);

      // Lấy danh sách tag IDs từ response
      if (response && response.tags && Array.isArray(response.tags)) {
        // Đảm bảo lấy id từ mỗi tag
        existingTagIds = response.tags.map((tag: number | { id: number }) => 
          typeof tag === 'number' ? tag : tag.id
        );
        
        // Set selected tags từ existing tags
        selectedTags = [...existingTagIds];
        
        console.log('Matching tags:', {
          existingTagIds,
          selectedTags,
          matchedTags: tags.filter(tag => selectedTags.includes(tag.id))
        });
      } else {
        existingTagIds = [];
        selectedTags = [];
        console.warn('No tags data or invalid format received');
      }
    } catch (err) {
      error = err.message;
      console.error('Error fetching data:', err);
      existingTagIds = [];
      selectedTags = [];
    }
  }

  $: if (showModal) {
    fetchData();
  }

  // Kiểm tra tag đã được liên kết chưa
  function isTagLinked(tagId: number) {
    return existingTagIds.includes(tagId);
  }

  async function handleSubmit() {
    isLoading = true;
    try {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        
        // Thêm từng tag_id vào formData
        selectedTags.forEach(tagId => {
            formData.append('tags[]', String(tagId));
        });

        console.log('Submitting tags:', {
            endpoint: `/${type}s/${id}`,
            method: 'POST',
            selectedTags,
            selectedTagDetails: tags
              .filter(tag => selectedTags.includes(tag.id))
              .map(tag => ({ id: tag.id, name: tag.name })),
            formDataEntries: Object.fromEntries(formData)
        });
        
        const response = await apiFetch(`/${type}s/${id}`, {
            method: 'POST',
            body: formData
        });

        if (!response) {
            throw new Error('Không nhận được phản hồi từ server');
        }

        console.log('Tags updated successfully:', response);
        dispatch('success');
        showModal = false;
    } catch (err) {
        error = "Lỗi khi lưu tags: " + (err.message || 'Unknown error');
        console.error('Error submitting tags:', err);
    } finally {
        isLoading = false;
    }
  }
</script>

{#if showModal}
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-96 max-w-lg">
    <h2 class="text-xl font-bold mb-4">Chọn Tags</h2>
    
    {#if error}
      <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
        {error}
      </div>
    {/if}

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>
      <div class="border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
        <!-- Tags đã liên kết -->
        {#if existingTagIds.length > 0}
          <div class="bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
            Tags đã liên kết
          </div>
          {#each tags.filter(tag => isTagLinked(tag.id)) as tag}
            <label 
              class="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer border-b bg-blue-50"
            >
              <input 
                type="checkbox"
                value={tag.id}
                bind:group={selectedTags}
                class="mr-3 accent-blue-600"
              />
              <span>{tag.name}</span>
            </label>
          {/each}
        {/if}

        <!-- Tags chưa liên kết -->
        <div class="bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
          Tags khả dụng
        </div>
        {#each tags.filter(tag => !isTagLinked(tag.id)) as tag}
          <label 
            class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
          >
            <input 
              type="checkbox"
              value={tag.id}
              bind:group={selectedTags}
              class="mr-3"
            />
            <span>{tag.name}</span>
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