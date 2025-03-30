<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { apiFetch } from '$lib/api';

  export let showModal = false;
  export let id: number;
  export let type: 'folder' | 'item';
  export let currentTags: number[] = [];
  
  let tags: Array<{ id: number; name: string }> = [];
  let selectedTags: number[] = [];
  let existingTagLinks: number[] = [];
  let isLoading = false;
  let error: string | null = null;

  const dispatch = createEventDispatcher();

  async function fetchData() {
    try {
      // Fetch tất cả tags
      const tagsData = await apiFetch('/tags');
      tags = tagsData;

      // Fetch danh sách tag_id đã liên kết với item/folder này
      const existingLinks = await apiFetch(`/${type}s/${id}`);
      existingTagLinks = existingLinks.map(link => link.tag_id);
      
      selectedTags = [...currentTags];
    } catch (err) {
      error = err.message;
      console.error('Error fetching data:', err);
    }
  }

  $: if (showModal) {
    fetchData();
  }

  // Kiểm tra tag đã được liên kết chưa
  function isTagLinked(tagId: number) {
    return existingTagLinks.includes(tagId);
  }

  async function handleSubmit() {
    isLoading = true;
    try {
      const formData = new FormData();
      
      // Thêm mỗi tag_id vào form data với key là 'tags'
      selectedTags.forEach(tagId => {
        formData.append('tags', tagId.toString());
      });

      await apiFetch(`/${type}s/${id}`, {
        method: 'PUT',
        body: formData
      });

      dispatch('success');
      showModal = false;
    } catch (err) {
      error = err.message;
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
        {#if existingTagLinks.length > 0}
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