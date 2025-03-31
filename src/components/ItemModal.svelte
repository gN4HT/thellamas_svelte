<script lang="ts">
    import { createEventDispatcher, onDestroy } from 'svelte';
    import type { Item } from '../models/item';
    import { apiFetch } from '../lib/api';

    const dispatch = createEventDispatcher();

    export let showModal: boolean;
    export let item: Partial<Item> = {};
    export let isEditMode: boolean = false;
    export let folderId: number | null = null;

    let error: string | null = null;
    let isLoading = false;
    let images: FileList | null = null;
    let imageUrls: string[] = [];
    let existingImages: string[] = [];
    let fileInput: HTMLInputElement;

    // Các biến cho form binding
    let name = '';
    let quantity = '0';
    let stock_level = '0';
    let price = '0';
    let notes = '';

    // Function để reset form
    function resetForm() {
        name = '';
        quantity = '0';
        stock_level = '0';
        price = '0';
        notes = '';
        images = null;
        imageUrls = [];
        existingImages = [];
        error = null;

        // Reset file input
        if (fileInput) {
            fileInput.value = '';
        }
    }

    // Reset khi modal đóng
    $: if (!showModal) {
        resetForm();
    }

    // Reset và set giá trị khi item thay đổi
    $: {
        if (item) {
            // Cleanup old URLs
            imageUrls.forEach(url => URL.revokeObjectURL(url));
            imageUrls = [];
            images = null;
            
            if (fileInput) {
                fileInput.value = '';
            }

            if (isEditMode) {
                name = item.name || '';
                quantity = item.quantity?.toString() || '0';
                stock_level = item.stock_level?.toString() || '0';
                price = item.price?.toString() || '0';
                notes = item.notes || '';
                existingImages = item.images || [];
            } else {
                resetForm();
            }
        }
    }

    function validateForm() {
        error = null;
        if (!name.trim()) {
            error = "Vui lòng nhập tên mặt hàng";
            return false;
        }
        return true;
    }

    function handleImageChange(event: Event) {
        const input = event.target as HTMLInputElement;
        fileInput = input;  // Store reference to file input

        // Cleanup old URLs first
        imageUrls.forEach(url => URL.revokeObjectURL(url));
        imageUrls = [];
        
        if (input.files) {
            images = input.files;
            imageUrls = Array.from(images).map(file => URL.createObjectURL(file));
        } else {
            images = null;
        }
    }

    function removeImage(index: number) {
        imageUrls = imageUrls.filter((_, i) => i !== index);
        const newImages = Array.from(images || []).filter((_, i) => i !== index);
        const dt = new DataTransfer();
        newImages.forEach(file => dt.items.add(file));
        images = dt.files;
    }

    function removeExistingImage(index: number) {
        existingImages = existingImages.filter((_, i) => i !== index);
    }

    async function handleSubmit() {
        if (!validateForm()) return;

        isLoading = true;
        try {
            const formData = new FormData();
            
            const basicData = {
                name: name.trim(),
                quantity: parseInt(quantity) || 0,
                stock_level: parseInt(stock_level) || 0,
                price: parseInt(price) || 0,
                notes: notes.trim(),
                folder_id: folderId,
                is_deleted: 0
            };

            // Thêm ID và _method nếu đang edit
            if (isEditMode && item?.id) {
                basicData.id = item.id;
                formData.append('_method', 'PUT'); // Thêm _method cho Laravel
            }

            // Thêm dữ liệu cơ bản vào FormData
            Object.entries(basicData).forEach(([key, value]) => {
                formData.append(key, value?.toString() || '');
            });

            // Thêm các file ảnh mới
            if (images) {
                Array.from(images).forEach(file => {
                    formData.append('images[]', file);
                });
            }

            // Thêm danh sách ảnh đã tồn tại
            if (existingImages && existingImages.length > 0) {
                formData.append('existing_images', JSON.stringify(existingImages));
            }

            console.log('Submitting FormData:', {
                isEdit: isEditMode,
                data: Object.fromEntries(formData),
                images: images ? Array.from(images).map(f => f.name) : [],
                existingImages
            });

            dispatch('submit', { formData, isEdit: isEditMode });
        } catch (err) {
            error = "Có lỗi xảy ra khi xử lý dữ liệu";
            console.error(err);
        } finally {
            isLoading = false;
        }
    }

    onDestroy(() => {
        // Cleanup URLs when component is destroyed
        imageUrls.forEach(url => URL.revokeObjectURL(url));
    });
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
                    bind:value={name}
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
                    bind:value={quantity}
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
                    bind:value={stock_level}
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
                    bind:value={price}
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
                    bind:value={notes}
                    disabled={isLoading}
                ></textarea>
            </div>

            <div>
                <label class="block text-gray-600 font-medium">
                    Hình ảnh
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    on:change={handleImageChange}
                    class="border rounded p-2 w-full"
                    disabled={isLoading}
                    bind:this={fileInput}
                />
            </div>

            <!-- Preview ảnh đã tồn tại -->
            {#if existingImages.length > 0}
                <div class="grid grid-cols-3 gap-4 mt-4">
                    {#each existingImages as image, index}
                        <div class="relative">
                            <img src={image} alt="Preview" class="w-full h-32 object-cover rounded"/>
                            <button
                                type="button"
                                class="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                on:click={() => removeExistingImage(index)}
                            >
                                ×
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}

            <!-- Preview ảnh mới -->
            {#if imageUrls.length > 0}
                <div class="grid grid-cols-3 gap-4 mt-4">
                    {#each imageUrls as url, index}
                        <div class="relative">
                            <img src={url} alt="Preview" class="w-full h-32 object-cover rounded"/>
                            <button
                                type="button"
                                class="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                on:click={() => removeImage(index)}
                            >
                                ×
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}

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
