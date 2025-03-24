<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Folder } from '../models/folder';
    import { apiFetch } from "$lib/api";

  
    export let showModal: boolean;
    export let folder: Partial<Folder> = {}; 
    export let isEditMode: boolean = false;
    
    const dispatch = createEventDispatcher();
    
    let formData: Partial<Folder> = {};
    let initialized = false;
  
    async function fetchInventoryId() {
    try {
        const data = await apiFetch("http://127.0.0.1:8000/api/me");
        return data.id; // No need for .json()
    } catch (error) {
        console.error("Error fetching inventory id:", error);
        return null;
    }
}

    async function loadDefaults() {
      const inventoryId = await fetchInventoryId();
      const currentDate = new Date().toISOString();
      return {
        name: '',
        description: '',
        color: '',
        inventory_id: inventoryId,
        created_at: currentDate,
        updated_at: currentDate,
      };
    }
  
    $: if (showModal && !initialized) {
      console.log("Modal mở, khởi tạo formData, isEditMode:", isEditMode);
      if (isEditMode) {
        formData = { ...folder, updated_at: new Date().toISOString() };
        if (!formData.inventory_id) {
          fetchInventoryId().then(id => {
            formData.inventory_id = id;
            console.log("Updated inventory_id:", formData.inventory_id);
          });
        }
      } else {
        loadDefaults().then(data => {
          formData = data;
          console.log("Loaded defaults:", formData);
        });
      }
      initialized = true;
    }
  
    $: if (!showModal && initialized) {
      formData = {};
      initialized = false;
    }
    
    function handleSubmit() {
      if (isEditMode) {
        formData.updated_at = new Date().toISOString();
      }
      console.log("Submitting form data:", formData);
      dispatch('submit', { data: { ...formData } });
    }
    
    function handleClose() {
      dispatch('close');
    }
  </script>
  
  {#if showModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-full">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">
          {isEditMode ? 'Edit Folder' : 'Add Folder'}
        </h2>
  
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          {#if isEditMode}
            <div>
              <label for="id" class="block text-gray-600 font-medium">ID</label>
              <input
                id="id"
                type="number"
                class="border rounded p-2 w-full bg-gray-200 text-gray-500 cursor-not-allowed"
                bind:value={formData.id}
                disabled
              />
            </div>
          {/if}
  
          <div>
            <label for="name" class="block text-gray-600 font-medium">Name</label>
            <input
              id="name"
              type="text"
              class="border rounded p-2 w-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              bind:value={formData.name}
              required
            />
          </div>
  
          <div>
            <label for="description" class="block text-gray-600 font-medium">Description</label>
            <input
              id="description"
              type="text"
              class="border rounded p-2 w-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              bind:value={formData.description}
            />
          </div>
  
          <div>
            <label for="color" class="block text-gray-600 font-medium">Chọn Màu</label>
            <input
              id="color"
              type="color"
              class="border rounded-lg p-2 w-full h-12 bg-gray-100 text-gray-700 
                     focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer 
                     transition duration-300 ease-in-out hover:shadow-md"
              bind:value={formData.color}
            />
            <p class="mt-2 text-gray-600">Mã màu: {formData.color}</p>
          </div>
          
  
          <input type="hidden" bind:value={formData.inventory_id} />
          <input type="hidden" bind:value={formData.created_at} />
          <input type="hidden" bind:value={formData.updated_at} />
  
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" on:click={handleClose} class="px-5 py-2 bg-red-400 text-white rounded-lg hover:bg-gray-500 transition">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 bg-[#00205B] text-white rounded-lg hover:bg-blue-700 transition">
              {isEditMode ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
  