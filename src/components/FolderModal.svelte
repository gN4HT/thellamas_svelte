<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Folder } from '../models/folder';

    const dispatch = createEventDispatcher();

    export let showModal: boolean;
    export let folder: Partial<Folder> = {}; 
    export let isEditMode: boolean = false;
    export let parentId: number | null = null;
    
    let error: string | null = null;
    let isLoading = false;

    // Các biến cho form binding
    let name = '';
    let description = '';
    let color = '#000000';

    // Khởi tạo giá trị khi modal mở
    $: if (showModal) {
        if (isEditMode && folder) {
            name = folder.name || '';
            description = folder.description || '';
            color = folder.color || '#000000';
        } else {
            name = '';
            description = '';
            color = '#000000';
        }
    }

    function validateForm() {
        error = null;
        if (!name.trim()) {
            error = "Vui lòng nhập tên thư mục";
            return false;
        }
        return true;
    }

    function handleSubmit() {
        if (!validateForm()) return;

        isLoading = true;
        try {
            const formData = new FormData();
            
            const basicData = {
                name: name.trim(),
                description: description.trim(),
                color: color,
                parent_id: parentId,
                is_deleted: 0
            };

            // Thêm ID và _method nếu đang edit
            if (isEditMode && folder?.id) {
                basicData.id = folder.id;
                formData.append('_method', 'PUT'); // Thêm _method cho Laravel
            }

            // Thêm dữ liệu vào FormData
            Object.entries(basicData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            console.log("Submitting folder data:", {
                isEdit: isEditMode,
                folderId: folder?.id,
                data: Object.fromEntries(formData)
            });
            
            dispatch('submit', { formData, isEdit: isEditMode, folderId: folder?.id });
        } catch (err) {
            error = "Có lỗi xảy ra khi xử lý dữ liệu";
            console.error(err);
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" class:hidden={!showModal}>
    <div class="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">
            {isEditMode ? 'Chỉnh sửa thư mục' : 'Thêm thư mục mới'}
        </h2>

        {#if error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        {/if}

        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div>
                <label for="name" class="block text-gray-600 font-medium">
                    Tên thư mục <span class="text-red-500">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    class="border rounded p-2 w-full"
                    bind:value={name}
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
                    class="border rounded p-2 w-full"
                    bind:value={description}
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
                    class="border rounded p-2 w-full h-12"
                    bind:value={color}
                    disabled={isLoading}
                />
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
    </div>
</div>
  