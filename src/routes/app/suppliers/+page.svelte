<script lang="ts">
    import { onMount } from "svelte";
    import { apiFetch } from "$lib/api";
    import Paginations from "../../../components/Paginations.svelte";
    import Items from "../../../components/Items.svelte";
    import type { Item } from "../../../models/item";
    import type { Supplier } from "../../../models/supplier";

    // State Management
    let suppliers: Supplier[] = [];
    let items: Item[] = [];
    let selectedSupplier: Supplier | null = null;
    let isLoading = false;
    let error: string | null = null;
    let searchQuery = "";

    // Modal State
    let showModal = false;
    let isEditing = false;
    let supplierForm: Supplier = {
        name: "",
        email: null,
        phone: null,
        address: null,
        status: 0,
        created_at: null,
        updated_at: null
    };

    // Pagination
    let itemPage = 1;
    const ITEMS_PER_PAGE = 10;

    // Computed Properties
    $: filteredSuppliers = suppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    $: paginatedItems = items.slice(
        (itemPage - 1) * ITEMS_PER_PAGE,
        itemPage * ITEMS_PER_PAGE
    );

    // API Functions
    async function fetchSuppliers() {
        isLoading = true;
        error = null;
        try {
            const response = await apiFetch("suppliers");
            console.log('Suppliers response:', response);
            suppliers = Array.isArray(response) ? response : [];
            
            if (suppliers.length > 0 && !selectedSupplier) {
                selectSupplier(suppliers[0]);
            }
        } catch (err) {
            console.error("Lỗi khi lấy danh sách suppliers:", err);
            error = "Không thể tải danh sách suppliers";
            suppliers = [];
        } finally {
            isLoading = false;
        }
    }

    async function fetchItems(supplierId: number) {
        if (!supplierId) return;
        
        isLoading = true;
        error = null;
        try {
            const response = await apiFetch(`suppliers/${supplierId}/items`);
            console.log('Items response:', response);
            items = Array.isArray(response) ? response : [];
            itemPage = 1;
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu items:", err);
            error = "Không thể tải danh sách items";
            items = [];
        } finally {
            isLoading = false;
        }
    }

    async function saveSupplier() {
        if (!supplierForm.name.trim()) {
            error = "Tên supplier là bắt buộc";
            return;
        }

        isLoading = true;
        error = null;
        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing ? `suppliers/${selectedSupplier?.id}` : "suppliers";
            
            // Chuẩn bị dữ liệu trước khi gửi
            const payload = {
                name: supplierForm.name.trim(),
                email: supplierForm.email || null,
                phone: supplierForm.phone || null,
                address: supplierForm.address || null,
                status: Number(supplierForm.status) // Đảm bảo status là number
            };

            console.log('Sending payload:', payload); // Log để debug

            await apiFetch(url, {
                method,
                body: payload
            });

            await fetchSuppliers();
            closeModal();
        } catch (err) {
            console.error("Lỗi khi lưu supplier:", err);
            error = "Không thể lưu supplier";
        } finally {
            isLoading = false;
        }
    }

    async function deleteSupplier(supplier: Supplier) {
        if (!confirm(`Bạn có chắc muốn xóa supplier "${supplier.name}"?`)) return;

        isLoading = true;
        error = null;
        try {
            await apiFetch(`suppliers/${supplier.id}`, {
                method: "DELETE"
            });

            if (selectedSupplier?.id === supplier.id) {
                selectedSupplier = null;
                items = [];
            }
            await fetchSuppliers();
        } catch (err) {
            console.error("Lỗi khi xóa supplier:", err);
            error = "Không thể xóa supplier";
        } finally {
            isLoading = false;
        }
    }

    // UI Functions
    function selectSupplier(supplier: Supplier) {
        if (!supplier || !supplier.id) {
            console.error('Invalid supplier:', supplier);
            return;
        }
        console.log('Selecting supplier:', supplier);
        selectedSupplier = supplier;
        fetchItems(supplier.id);
    }

    function openModal(editMode = false, data: Supplier | null = null) {
        isEditing = editMode;
        if (data) {
            const { id, inventory_id, ...rest } = data;
            supplierForm = {
                ...rest,
                status: typeof rest.status === 'string' ? parseInt(rest.status) : rest.status
            };
        } else {
            supplierForm = {
                name: "",
                email: null,
                phone: null,
                address: null,
                status: 0,
                created_at: null,
                updated_at: null
            };
        }
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        error = null;
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            if (showModal) closeModal();
        }
    }

    onMount(() => {
        fetchSuppliers();
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    });
</script>

<!-- Loading Overlay -->
{#if isLoading}
    <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00205b]"></div>
    </div>
{/if}

<!-- Error Message -->
{#if error}
    <div class="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50">
        {error}
        <button class="ml-4 underline" on:click={() => error = null}>Đóng</button>
    </div>
{/if}

<!-- Main Content -->
<div class="bg-gray-100 h-screen flex w-full">
    <!-- Sidebar -->
    <div class="bg-white p-4 border-r border-gray-300 overflow-y-auto small-scrollbar w-[300px]">
        <!-- Search Box -->
        <div class="flex items-center border border-gray-300 rounded p-2 mb-4">
            <i class="fa-solid fa-magnifying-glass text-gray-500"></i>
            <input 
                type="text" 
                placeholder="Tìm kiếm suppliers" 
                bind:value={searchQuery}
                class="w-full outline-none border-none pl-2"
            />
        </div>

        <!-- Suppliers List -->
        <div class="space-y-1">
            {#each filteredSuppliers as supplier (supplier.id)}
                <div 
                    class="flex items-center justify-between p-2 rounded cursor-pointer group
                    {selectedSupplier?.id === supplier.id ? 'bg-gray-100 text-[#00205b]' : 'text-gray-500 hover:bg-gray-100'}"
                    on:click={() => selectSupplier(supplier)}
                >
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-box text-xl"></i>
                        <span class="truncate" title={supplier.name}>
                            {supplier.name}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                            class="p-1 hover:bg-gray-200 rounded"
                            on:click|stopPropagation={() => openModal(true, supplier)}
                            title="Sửa supplier"
                        >
                            <i class="fa-solid fa-pen text-sm"></i>
                        </button>
                        <button
                            class="p-1 hover:bg-red-100 rounded text-red-500"
                            on:click|stopPropagation={() => deleteSupplier(supplier)}
                            title="Xóa supplier"
                        >
                            <i class="fa-solid fa-trash-can text-sm"></i>
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Main Area -->
    <div class="flex-1 overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
            <h1 class="text-2xl font-semibold">
                {selectedSupplier?.name || "Chọn supplier"}
            </h1>
            <button
                class="bg-[#00205b] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#001639]"
                on:click={() => openModal(false)}
            >
                <i class="fa-solid fa-plus"></i>
                Thêm Supplier
            </button>
        </div>

        <!-- Content -->
        <div class="p-4">
            {#if !selectedSupplier}
                <div class="text-center py-16">
                    <i class="fa-solid fa-box text-4xl text-gray-400 mb-4"></i>
                    <h2 class="text-xl text-gray-500 mb-2">Vui lòng chọn một supplier</h2>
                </div>
            {:else if items.length === 0}
                <div class="text-center py-16">
                    <i class="fa-solid fa-box text-4xl text-gray-400 mb-4"></i>
                    <h2 class="text-xl text-gray-500 mb-2">Không có mặt hàng nào</h2>
                    <p class="text-gray-400">
                        Thêm mặt hàng vào supplier này để hiển thị chúng ở đây
                    </p>
                </div>
            {:else}
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {#each paginatedItems as item (item.id)}
                        <Items {...item} />
                    {/each}
                </div>
                <div class="mt-4">
                    <Paginations 
                        totalItems={items.length} 
                        bind:currentPage={itemPage}
                    />
                </div>
            {/if}
        </div>
    </div>
</div>

<!-- Add/Edit Supplier Modal -->
{#if showModal}
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
            <div class="flex justify-between items-center p-4 border-b">
                <h2 class="text-lg font-semibold">
                    {isEditing ? `Chỉnh sửa "${supplierForm.name}"` : "Thêm Supplier"}
                </h2>
                <button 
                    class="text-gray-400 hover:text-gray-600"
                    on:click={closeModal}
                >
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            
            <div class="p-4 space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Tên supplier *</label>
                    <input
                        type="text"
                        bind:value={supplierForm.name}
                        class="w-full p-2 border rounded focus:border-[#00205b] outline-none"
                        placeholder="Nhập tên supplier"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        bind:value={supplierForm.email}
                        class="w-full p-2 border rounded focus:border-[#00205b] outline-none"
                        placeholder="Nhập email"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Số điện thoại</label>
                    <input
                        type="text"
                        bind:value={supplierForm.phone}
                        class="w-full p-2 border rounded focus:border-[#00205b] outline-none"
                        placeholder="Nhập số điện thoại"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Địa chỉ</label>
                    <input
                        type="text"
                        bind:value={supplierForm.address}
                        class="w-full p-2 border rounded focus:border-[#00205b] outline-none"
                        placeholder="Nhập địa chỉ"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Trạng thái</label>
                    <select 
                        bind:value={supplierForm.status}
                        class="w-full p-2 border rounded focus:border-[#00205b] outline-none"
                        on:change={(e) => {
                            supplierForm.status = parseInt(e.currentTarget.value);
                        }}
                    >
                        <option value="0">Inactive</option>
                        <option value="1">Active</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-end gap-2 p-4 bg-gray-50 rounded-b-lg">
                <button
                    class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    on:click={closeModal}
                >
                    Hủy
                </button>
                <button
                    class="px-4 py-2 bg-[#00205b] text-white rounded hover:bg-[#001639] disabled:opacity-50"
                    on:click={saveSupplier}
                    disabled={!supplierForm.name.trim() || isLoading}
                >
                    {isLoading ? 'Đang lưu...' : 'Lưu'}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .small-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .small-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
    }
    .small-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
    }
</style>