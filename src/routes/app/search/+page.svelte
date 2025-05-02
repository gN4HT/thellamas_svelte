<script lang="ts">
    import { apiFetch } from '$lib/api';
    import { onMount } from 'svelte';
    import Items from "../../../components/Items.svelte";
    import Paginations from "../../../components/Paginations.svelte";
    import type { Folder } from "../../../models/folder";

    let filters = {
        folder_name: '',
        name: '',
        min_quantity: '',
        max_quantity: '',
        min_price: '',
        max_price: '',
        stock_level: '', // 'below' | 'above'
    };

    const labels = {
        folder: 'Thư mục',
        name: 'Tên mặt hàng',
        quantity: 'Số lượng',
        price: 'Giá',
        stock: 'Tồn kho',
    };

    let toggleStates = {
        folder: true,
        name: true,
        quantity: true,
        price: true,
        stock: true,
    };

    let folders: Folder[] = [];
    let isLoading = false;
    let error = null;
    let results = [];
    let currentPage = 1;
    let totalItems = 0;
    const itemsPerPage = 12;

    // Add function to check if any filter has value
    function hasAnyFilter() {
        return Object.values(filters).some(value => {
            // Check for non-empty strings and non-zero numbers
            if (typeof value === 'string') {
                return value.trim() !== '';
            }
            return !!value;
        });
    }

    function toggle(section) {
        toggleStates[section] = !toggleStates[section];
    }

    // Fetch folders on mount
    onMount(async () => {
        try {
            const response = await apiFetch("/folders");
            folders = response.filter(folder => folder.is_deleted !== 1);
        } catch (err) {
            console.error("Error fetching folders:", err);
            error = err.message;
        }
    });

    async function search() {
        isLoading = true;
        error = null;

        try {
            const params = new URLSearchParams();
            
            // Add all non-empty filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });

            const response = await apiFetch(`/item_search?${params.toString()}`);
            results = response || [];
            totalItems = results.length;
            console.log('Search results:', results);
        } catch (err) {
            error = err.message;
            console.error("Search error:", err);
        } finally {
            isLoading = false;
        }
    }

    function handlePageChange(event: CustomEvent) {
        if (event.detail === 'next') {
            if (currentPage * itemsPerPage < totalItems) {
                currentPage++;
            }
        } else if (event.detail === 'prev') {
            if (currentPage > 1) {
                currentPage--;
            }
        }
    }

    // Calculate paginated data
    $: {
        if (results.length > 0) {
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            paginatedResults = results.slice(start, end);
        } else {
            paginatedResults = [];
        }
    }

    let paginatedResults = [];
</script>

<style>
    .rotate-180 {
        transform: rotate(180deg);
    }
</style>

<div class="flex w-full min-h-screen bg-gray-50">
    <!-- Sidebar Filter -->
    <aside class="w-[300px] fixed h-full bg-white border-r border-gray-200 p-6 shadow-lg overflow-y-auto">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Bộ lọc</h2>

        {#each Object.keys(labels) as key}
            <div class="mb-6 border-b border-gray-200 pb-4">
                <!-- Toggle Header -->
                <button
                    aria-label="Tắt/Mở bộ lọc"
                    class="flex justify-between items-center cursor-pointer group" 
                    on:click={() => toggle(key)}
                >
                    <div class="flex items-center">
                        <i 
                            class="fas fa-chevron-down mr-2 transform transition-transform duration-300 group-hover:scale-110" 
                            class:rotate-180={!toggleStates[key]}
                        ></i>
                        <span class="font-medium text-gray-700">{labels[key]}</span>
                    </div>
                </button>

                <!-- Toggle Body -->
                {#if toggleStates[key]}
                    <!-- Quantity & Price -->
                    {#if key === 'quantity' || key === 'price'}
                        <div class="flex gap-3 mt-4">
                            <input 
                                type="number" 
                                class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                bind:value={filters[`min_${key}`]} 
                                placeholder={`Tối thiểu`} 
                            />
                            <input 
                                type="number" 
                                class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                bind:value={filters[`max_${key}`]} 
                                placeholder={`Tối đa`} 
                            />
                        </div>

                    <!-- Stock -->
                    {:else if key === 'stock'}
                        <select 
                            class="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            bind:value={filters.stock_level}
                        >
                            <option value="">Tất cả</option>
                            <option value="low">Dưới mức tồn kho tối thiểu</option>
                            <option value="high">Trên mức tồn kho tối thiểu</option>
                        </select>

                    <!-- Folder Radio -->
                    {:else if key === 'folder'}
                        <div class="mt-4 space-y-3">
                            <label class="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="folder"
                                    value=""
                                    bind:group={filters.folder_name}
                                    class="text-blue-600 focus:ring-blue-500"
                                />
                                <span class="text-gray-700 text-sm">Tất cả thư mục</span>
                            </label>

                            {#each folders as folder}
                                <label class="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="folder"
                                        value={folder.name}
                                        bind:group={filters.folder_name}
                                        class="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span class="text-gray-700 text-sm">{folder.name}</span>
                                </label>
                            {/each}
                        </div>

                    <!-- Default Input -->
                    {:else}
                        <input 
                            class="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            bind:value={filters[key]} 
                            placeholder={`Nhập ${labels[key].toLowerCase()}`} 
                        />
                    {/if}
                {/if}
            </div>
        {/each}

        <!-- Apply Filter Button -->
        <button 
            on:click={search} 
            class="w-full mt-6 bg-[#00205B] text-white py-2.5 rounded-lg font-semibold hover:bg-white hover:text-blue-900 border border-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !hasAnyFilter()}
        >
            {#if isLoading}
                Đang tìm kiếm...
            {:else if !hasAnyFilter()}
                Vui lòng chọn bộ lọc
            {:else}
                Áp dụng bộ lọc
            {/if}
        </button>
    </aside>

    <!-- Main Content -->
    <main class="ml-[300px] flex-1 p-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">Kết quả tìm kiếm</h1>

        {#if isLoading}
            <div class="flex justify-center items-center h-40">
                <div class="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        {:else if error}
            <div class="bg-red-100 text-red-700 border border-red-300 p-4 rounded-md">
                {error}
            </div>
        {:else if results.length === 0}
            <div class="text-center mt-16">
                <h2 class="text-xl font-semibold text-gray-600 mb-2">Không có kết quả</h2>
            </div>
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {#each paginatedResults as item (item.id)}
                    <Items {...item} />
                {/each}
            </div>
            <div class="mt-8">
                <Paginations 
                    {totalItems}
                    bind:currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    on:prev={handlePageChange}
                    on:next={handlePageChange}
                />
            </div>
        {/if}
    </main>
</div>

