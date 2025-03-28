<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Item } from '../models/item';
    import { apiFetch } from "$lib/api";

    const dispatch = createEventDispatcher();

    export let showModal: boolean;
    export let item: Partial<Item> = {};
    export let isEditMode: boolean = false;
    export let folderId: number | null = null;

    let error: string | null = null;
    let isLoading = false;
    
    // Khởi tạo formData với giá trị mặc định theo cấu trúc database
    let formData = {
        name: '',
        quantity: 0,
        stock_level: 0,
        price: 0,
        images: '[]',
        notes: '',
        qr: '',
        is_deleted: 0,
        supplier_id: 1,
        folder_id: folderId || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    // Reset form khi modal đóng
    $: if (!showModal) {
        resetForm();
    }

    // Cập nhật formData khi edit hoặc khi folderId thay đổi
    $: if (showModal) {
        if (isEditMode && item) {
            formData = {
                ...formData,
                ...item,
                updated_at: new Date().toISOString()
            };
        } else {
            formData = {
                ...formData,
                folder_id: folderId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
        }
    }

    function resetForm() {
        formData = {
            name: '',
            quantity: 0,
            stock_level: 0,
            price: 0,
            images: '[]',
            notes: '',
            qr: '',
            is_deleted: 0,
            supplier_id: 1,
            folder_id: folderId || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        error = null;
    }

    function validateForm() {
        error = null;

        if (!formData.name?.trim()) {
            error = "Vui lòng nhập tên mặt hàng";
            return false;
        }

        if (typeof formData.quantity !== 'number' || formData.quantity < 0) {
            error = "Số lượng không hợp lệ";
            return false;
        }

        if (typeof formData.price !== 'number' || formData.price < 0) {
            error = "Giá không hợp lệ";
            return false;
        }

        if (typeof formData.stock_level !== 'number' || formData.stock_level < 0) {
            error = "Mức tồn kho không hợp lệ";
            return false;
        }

        return true;
    }

    async function handleSubmit() {
        if (!validateForm()) return;

        isLoading = true;
        try {
            // Đảm bảo name không null và được trim
            if (!formData.name?.trim()) {
                error = "Tên mặt hàng không được để trống";
                return;
            }

            const submitData = {
                name: formData.name.trim(),
                quantity: Number(formData.quantity) || 0,
                stock_level: Number(formData.stock_level) || 0,
                price: Number(formData.price) || 0,
                images: null,
                notes: formData.notes?.trim() || null,
                qr: formData.qr || null,
                is_deleted: 0,
                supplier_id: Number(formData.supplier_id) || 1,
                folder_id: formData.folder_id || null,
                created_at: formData.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Log để debug
            console.log('Submitting data:', submitData);

            dispatch('submit', { data: submitData });
        } catch (err) {
            error = "Có lỗi xảy ra khi xử lý dữ liệu";
            console.error(err);
        } finally {
            isLoading = false;
        }
    }
</script>

<!-- Template -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" class:hidden={!showModal}>
    <div class="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">
            {isEditMode ? 'Chỉnh sửa mặt hàng' : 'Thêm mặt hàng mới'}
        </h2>

        {#if error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        {/if}

        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div>
                <label for="name" class="block text-gray-600 font-medium">
                    Tên mặt hàng <span class="text-red-500">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    class="border rounded p-2 w-full"
                    bind:value={formData.name}
                    required
                    disabled={isLoading}
                />
            </div>

            <div>
                <label for="quantity" class="block text-gray-600 font-medium">
                    Số lượng <span class="text-red-500">*</span>
                </label>
                <input
                    id="quantity"
                    type="number"
                    min="0"
                    class="border rounded p-2 w-full"
                    bind:value={formData.quantity}
                    required
                    disabled={isLoading}
                />
            </div>

            <div>
                <label for="stock_level" class="block text-gray-600 font-medium">
                    Mức tồn kho
                </label>
                <input
                    id="stock_level"
                    type="number"
                    min="0"
                    class="border rounded p-2 w-full"
                    bind:value={formData.stock_level}
                    disabled={isLoading}
                />
            </div>

            <div>
                <label for="price" class="block text-gray-600 font-medium">
                    Giá <span class="text-red-500">*</span>
                </label>
                <input
                    id="price"
                    type="number"
                    min="0"
                    class="border rounded p-2 w-full"
                    bind:value={formData.price}
                    required
                    disabled={isLoading}
                />
            </div>

            <div>
                <label for="notes" class="block text-gray-600 font-medium">
                    Ghi chú
                </label>
                <textarea
                    id="notes"
                    class="border rounded p-2 w-full"
                    bind:value={formData.notes}
                    disabled={isLoading}
                ></textarea>
            </div>

            <div class="flex justify-end gap-3 mt-6">
                <button 
                    type="button"
                    on:click={() => dispatch('close')}
                    class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                    disabled={isLoading}
                >
                    Hủy
                </button>
                <button 
                    type="submit"
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
