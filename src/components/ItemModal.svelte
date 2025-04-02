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

    // Khai báo biến với giá trị mặc định
    let name = '';
    let quantity = '0';
    let stock_level = '0';
    let price = '0';
    let notes = '';

    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/storage/';

    // Thêm hàm để lấy dữ liệu item khi edit
    async function fetchItemData() {
        if (isEditMode && item.id) {
            try {
                const itemData = await apiFetch(`/items/${item.id}`);
                console.log('Fetched item data:', itemData);
                
                // Gán giá trị từ API
                name = itemData.name || '';
                quantity = String(itemData.quantity || 0);
                stock_level = String(itemData.stock_level || 0);
                price = String(itemData.price || 0);
                notes = itemData.notes || '';
                
                existingImages = Array.isArray(itemData.images) 
                    ? itemData.images.map(img => 
                        img.startsWith('http') ? img : `${IMAGE_BASE_URL}${img}`
                    )
                    : [];

                console.log('Set form values:', {
                    name,
                    quantity,
                    stock_level,
                    price,
                    notes,
                    existingImages,
                    rawImages: itemData.images
                });
            } catch (err) {
                console.error('Error fetching item:', err);
                error = 'Không thể tải dữ liệu mặt hàng';
            }
        }
    }

    // Reactive statement khi modal mở
    $: if (showModal) {
        if (isEditMode && item.id) {
            fetchItemData();
        } else {
            resetAll();
        }
    }

    function resetAll() {
        console.log('Resetting form...');
        name = '';
        quantity = '0';
        stock_level = '0';
        price = '0';
        notes = '';
        images = null;
        imageUrls = [];
        existingImages = [];
        error = null;
        isLoading = false;

        if (fileInput) {
            fileInput.value = '';
        }

        imageUrls.forEach(url => URL.revokeObjectURL(url));
        
        console.log('Form reset values:', {
            name,
            quantity,
            stock_level,
            price,
            notes
        });
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
        event.preventDefault();  // Ngăn chặn form submit
        const input = event.target as HTMLInputElement;
        fileInput = input;

        if (input.files) {
            // Chỉ xử lý ảnh mới, không động đến ảnh cũ
            images = input.files;
            // Tạo URLs mới cho preview
            const newImageUrls = Array.from(images).map(file => URL.createObjectURL(file));
            // Cleanup old preview URLs
            imageUrls.forEach(url => URL.revokeObjectURL(url));
            // Set URLs mới
            imageUrls = newImageUrls;
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
            
            // Append all form fields
            formData.append('name', name.trim());
            formData.append('quantity', quantity);
            formData.append('stock_level', stock_level);
            formData.append('price', price);
            formData.append('notes', notes);
            
            if (folderId !== null) {
                formData.append('folder_id', String(folderId));
            }

            // Append images if any
            if (images && images.length > 0) {
                Array.from(images).forEach(file => {
                    formData.append('images[]', file);
                });
            }

            // Log form data before submission
            console.log('Submitting form data:', {
                name: name.trim(),
                quantity,
                stock_level,
                price,
                notes,
                folderId,
                isEditMode,
                images: images ? Array.from(images).map(f => f.name) : []
            });

            dispatch('submit', { 
                formData, 
                isEdit: isEditMode,
                resetForm: resetAll
            });
            
        } catch (err) {
            error = "Có lỗi xảy ra khi xử lý dữ liệu: " + (err.message || 'Unknown error');
            console.error('Submit error:', err);
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
                    class="border rounded p-2 w-full h-24"
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
                    {#each existingImages as imageUrl, index}
                        <div class="relative">
                            <img src={imageUrl} alt="Preview" class="w-full h-32 object-cover rounded"/>
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
