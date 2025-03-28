<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Folder } from '../models/folder';
    import { apiFetch } from "$lib/api";

    export let showModal: boolean;
    export let folder: Partial<Folder> = {}; 
    export let isEditMode: boolean = false;
    export let parentId: number | null = null;
    
    const dispatch = createEventDispatcher();
    
    let formData: Partial<Folder> = {};
    let initialized = false;
    let error: string | null = null;
    let isLoading = false;
  
    async function fetchInventoryId() {
        try {
            const data = await apiFetch("/me");
            return data.id;
        } catch (error) {
            console.error("Error fetching inventory id:", error);
            throw new Error("Không thể lấy thông tin người dùng");
        }
    }

    async function initializeForm() {
        isLoading = true;
        try {
            const inventoryId = await fetchInventoryId();
            const currentDate = new Date().toISOString();

            if (isEditMode && folder) {
                formData = {
                    ...folder,
                    updated_at: currentDate,
                    inventory_id: folder.inventory_id || inventoryId
                };
            } else {
                formData = {
                    name: '',
                    description: '',
                    color: '#000000',
                    parent_id: parentId,
                    inventory_id: inventoryId,
                    created_at: currentDate,
                    updated_at: currentDate,
                    is_deleted: 0
                };
            }
            initialized = true;
        } catch (err) {
            error = err.message;
            console.error("Lỗi khởi tạo form:", err);
        } finally {
            isLoading = false;
        }
    }
  
    $: if (showModal && !initialized) {
        initializeForm();
    }
  
    $: if (!showModal && initialized) {
        formData = {};
        initialized = false;
        error = null;
    }
    
    function validateForm() {
        error = null;
        if (!formData.name?.trim()) {
            error = "Vui lòng nhập tên thư mục";
            return false;
        }
        return true;
    }

    function handleSubmit() {
        if (!validateForm()) return;

        isLoading = true;
        try {
            const submitData = {
                ...formData,
                name: formData.name.trim(),
                description: formData.description?.trim(),
                parent_id: parentId,
                updated_at: new Date().toISOString()
            };

            console.log("Submitting folder data:", submitData);
            dispatch('submit', { data: submitData });
        } catch (err) {
            error = "Có lỗi xảy ra khi xử lý dữ liệu";
            console.error(err);
        } finally {
            isLoading = false;
        }
    }
</script>

{#if showModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">
                {isEditMode ? 'Chỉnh sửa thư mục' : 'Thêm thư mục mới'}
            </h2>

            {#if error}
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            {/if}

            {#if isLoading}
                <div class="flex justify-center items-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00205b]"></div>
                </div>
            {:else}
                <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                    <div>
                        <label for="name" class="block text-gray-600 font-medium">
                            Tên thư mục <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            class="border rounded p-2 w-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            bind:value={formData.name}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label for="description" class="block text-gray-600 font-medium">
                            Mô tả
                        </label>
                        <input
                            id="description"
                            type="text"
                            class="border rounded p-2 w-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            bind:value={formData.description}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label for="color" class="block text-gray-600 font-medium">
                            Màu sắc
                        </label>
                        <input
                            id="color"
                            type="color"
                            class="border rounded p-2 w-full h-12 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            bind:value={formData.color}
                            disabled={isLoading}
                        />
                        <p class="mt-2 text-sm text-gray-500">Mã màu: {formData.color}</p>
                    </div>

                    <div class="flex justify-end gap-3 mt-6">
                        <button 
                            type="button"
                            on:click={() => dispatch('close')}
                            class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit"
                            class="px-4 py-2 bg-[#00205B] text-white rounded hover:bg-blue-700 transition-colors"
                            disabled={isLoading}
                        >
                            {#if isLoading}
                                <span class="inline-block animate-spin mr-2">⌛</span>
                            {/if}
                            {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            {/if}
        </div>
    </div>
{/if}
  