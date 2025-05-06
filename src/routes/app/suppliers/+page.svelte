<script lang="ts">
    import { onMount } from "svelte";
    import { userStore } from "../../../stores/userStore";
    import { apiFetch } from "$lib/api";

    interface Supplier {
        id: string;
        name: string;
        email: string;
        phone: string;
        address?: string;
    }

    let suppliers: Supplier[] = [];
    let selectedSupplier: Supplier | null = null;
    let showModal = false;
    let isEditMode = false;
    let isLoading = false;
    let error: string | null = null;
    let searchQuery = "";
    let isSidebarOpen = true;
    let isMobile = false;

    // Subscribe to user store
    let canEdit = false;
    $: canEdit = $userStore ? userStore.hasPermission($userStore) : false;

    // Filtered suppliers based on search
    $: filteredSuppliers = suppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    async function fetchSuppliers() {
        isLoading = true;
        try {
            const response = await apiFetch("suppliers");
            suppliers = response;
        } catch (err) {
            console.error("Error fetching suppliers:", err);
            error = "Không thể tải danh sách nhà cung cấp";
        } finally {
            isLoading = false;
        }
    }

    function handleOpenModal(event: Event | null, supplier: Supplier | null = null) {
        if (!canEdit) return;
        if (event) event.preventDefault();
        if (event?.stopPropagation) event.stopPropagation();
        selectedSupplier = supplier;
        isEditMode = !!supplier;
        showModal = true;
    }

    function handleSelectSupplier(supplier: Supplier) {
        selectedSupplier = supplier;
    }

    async function handleDelete(event: Event, supplierId: string) {
        if (!canEdit) return;
        event.preventDefault();
        event.stopPropagation();
        if (confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này không?")) {
            isLoading = true;
            try {
                await apiFetch(`suppliers/${supplierId}`, {
                    method: "DELETE"
                });
                if (selectedSupplier?.id === supplierId) {
                    selectedSupplier = null;
                }
                await fetchSuppliers();
            } catch (err) {
                console.error("Error deleting supplier:", err);
                error = "Không thể xóa nhà cung cấp";
            } finally {
                isLoading = false;
            }
        }
    }

    async function handleSubmit(event: SubmitEvent) {
        if (!canEdit) return;
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const supplierData = Object.fromEntries(formData);
        
        const endpoint = isEditMode && selectedSupplier 
            ? `suppliers/${selectedSupplier.id}` 
            : "suppliers";
        const method = isEditMode ? "PUT" : "POST";

        isLoading = true;
        try {
            await apiFetch(endpoint, {
                method,
                body: supplierData,
                headers: method === "POST" ? { 'x-type': 'suppliers' } : undefined
            });
            showModal = false;
            await fetchSuppliers();
        } catch (err) {
            console.error("Error saving supplier:", err);
            error = "Không thể lưu thông tin nhà cung cấp";
        } finally {
            isLoading = false;
        }
    }

    function checkMobile() {
        isMobile = window.innerWidth < 768;
        if (isMobile) {
            isSidebarOpen = false;
        }
    }

    onMount(() => {
        fetchSuppliers();
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    });
</script>

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

    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 30;
        }

        .sidebar.open {
            transform: translateX(0);
        }

        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 25;
        }

        .overlay.open {
            display: block;
        }
    }
</style>

<!-- Loading Overlay -->
{#if isLoading}
<div class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00205b]"></div>
  </div>
{/if}

<!-- Error Message -->
{#if error}
  <div class="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
    {error}
    <button class="ml-4 underline" on:click={() => error = null}>Đóng</button>
  </div>
{/if}

<div class="bg-gray-100 h-screen flex w-full">
    <!-- Mobile Toggle Button -->
    <button 
        class="fixed top-4 left-[110px] z-40 md:hidden bg-white p-2 rounded-lg shadow-lg"
        on:click={() => isSidebarOpen = !isSidebarOpen}
    >
        <i class="fas fa-bars text-gray-700"></i>
    </button>

    <!-- Overlay for mobile -->
    <div class="overlay" class:open={isSidebarOpen && isMobile}></div>

    <!-- Sidebar -->
    <div class="sidebar bg-white p-4 border-r border-gray-300 overflow-y-auto small-scrollbar w-[300px] fixed h-full" class:open={isSidebarOpen}>
        <div class="flex justify-between items-center border border-gray-300 rounded p-2 mb-4">
            <i class="fa-solid fa-magnifying-glass text-gray-500"></i>
            <input 
                type="text" 
                bind:value={searchQuery}
                placeholder="Tìm kiếm suppliers" 
                class="w-full outline-none border-none pl-2"
            />
        </div>

        <div>
            {#each filteredSuppliers as supplier (supplier.id)}
                <button
                    aria-label="Chọn supplier"
                    class="flex items-center justify-between p-2 cursor-pointer rounded
                    {selectedSupplier?.id === supplier.id ? 'text-[#00205b] bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}"
                    on:click={() => handleSelectSupplier(supplier)}
                >
                    <div class="flex items-center gap-1">
                        <span class="mr-2 text-xl"><i class="fa-solid fa-box"></i></span>
                        <span title={supplier.name}>
                            {supplier.name.length > 15 ? supplier.name.slice(0, 15) + '...' : supplier.name}
                        </span>
                    </div>
                    <div class="flex items-center gap-1">
                        {#if canEdit}
                            <button 
                                aria-label="Chỉnh sửa"
                                class="text-blue-600 hover:text-blue-800" 
                                on:click={(e) => handleOpenModal(e, supplier)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                    <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
                                </svg>
                            </button>
                            
                            <button
                                aria-label="Xóa"
                                class="text-red-500 hover:text-red-700 ml-2" 
                                on:click={(e) => handleDelete(e, supplier.id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                                </svg>
                            </button>
                        {/if}
                    </div>
                </button>
            {/each}
        </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col w-full p-3 md:ml-[300px] transition-all duration-300">
        <div class="flex justify-between align-center border-b border-gray-300 p-4">
            <h2 class="flex items-center gap-2 text-3xl ml-3 {selectedSupplier ? 'text-[#00205B]' : 'text-gray-500'}">
                {selectedSupplier ? (selectedSupplier.name.length > 30 ? selectedSupplier.name.slice(0, 30) + "..." : selectedSupplier.name) : "Chọn supplier"}
            </h2>
            {#if canEdit}
                <button 
                    on:click={(e) => handleOpenModal(e)}
                    class="bg-[#00205B] text-white px-4 py-2 rounded hover:[#00205B]"
                >
                    Thêm nhà cung cấp
                </button>
            {/if}
        </div>
        {#if selectedSupplier}
            <div class="p-6">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-xl font-semibold mb-4">Thông tin chi tiết</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p class="text-gray-600">Email</p>
                            <p class="font-medium">{selectedSupplier.email || 'Chưa có'}</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Số điện thoại</p>
                            <p class="font-medium">{selectedSupplier.phone || 'Chưa có'}</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Địa chỉ</p>
                            <p class="font-medium">{selectedSupplier.address || 'Chưa có'}</p>
                        </div>

                    </div>
                    {#if canEdit}
                        <div class="mt-6 flex justify-end space-x-3">
                            <button
                                on:click={(e) => handleOpenModal(e, selectedSupplier)}
                                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                on:click={(e) => handleDelete(e, selectedSupplier.id)}
                                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Xóa
                            </button>
                        </div>
                    {/if}
                </div>
            </div>
        {:else}
            <div class="flex items-center justify-center h-full text-gray-500">
                <p>Chọn một nhà cung cấp để xem chi tiết</p>
            </div>
        {/if}
    </div>
</div>

<!-- Modal -->
{#if showModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">
                {isEditMode ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
            </h2>
            <form on:submit={handleSubmit}>
                <div class="space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Tên</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={selectedSupplier?.name || ''}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={selectedSupplier?.email || ''}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            value={selectedSupplier?.phone || ''}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label for="address" class="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input
                            type="text"
                            name="address"
                            value={selectedSupplier?.address || ''}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div class="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        on:click={() => showModal = false}
                        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {isEditMode ? 'Cập nhật' : 'Thêm'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}