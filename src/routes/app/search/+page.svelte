<script>
    import { apiFetch } from '$lib/api';
    import { onMount } from 'svelte';
    import ItemResource from "../../../components/ItemResource.svelte";

    let filters = {
        folder_name: '',
        name: '',
        min_quantity: '',
        max_quantity: '',
        min_price: '',
        max_price: '',
        stock_level: '', // 'below' | 'above'
    };

    let toggles = {
        folder: true,
        name: true,
        quantity: true,
        price: true,
        stock: true,
    };

    let isLoading = false;
    let error = null;
    let results = [];

    const ICONS = [
        { icon: 'fa-folder', title: 'Thư mục', desc: 'Lọc các mục trong thư mục cụ thể' },
        { icon: 'fa-sort-amount-up', title: 'Số lượng', desc: 'Lọc dựa theo tồn kho' },
        { icon: 'fa-balance-scale', title: 'Mức tối thiểu', desc: 'Lọc theo ngưỡng tồn kho' },
        { icon: 'fa-tag', title: 'Giá', desc: 'Lọc theo khoảng giá' },
        { icon: 'fa-qrcode', title: 'Mã vạch / QR', desc: 'Tìm theo mã cụ thể' },
        { icon: 'fa-filter', title: 'Bộ lọc tuỳ chỉnh', desc: 'Thêm điều kiện lọc nâng cao' }
    ];

    function toggle(section) {
        toggles[section] = !toggles[section];
    }
    const getToken = () => localStorage.getItem("token");


    async function search() {
        isLoading = true;
        error = null;

        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            const headers = { Authorization: `Bearer ${getToken()}` };
            const res = await apiFetch(`http://127.0.0.1:8000/api/item_search?${params}`, { headers });
            results = res.data || [];
        } catch (e) {
            error = e.message;
            console.error(e);
        } finally {
            isLoading = false;
        }
    }
</script>

<style>
    .rotate-180 {
        transform: rotate(180deg);
    }
</style>

<div class="flex w-full">
    <aside class="w-[300px] fixed h-screen bg-white border-r p-4 shadow-md overflow-y-auto">
        <h2 class="text-lg font-bold mb-4">Bộ lọc</h2>
        <!-- Filter Sections -->
        {#each Object.keys(toggles) as key}
            <div class="mb-4 border-b pb-4">
                <div class="flex justify-between items-center cursor-pointer" on:click={() => toggle(key)}>
                    <div class="flex items-center">
                        <i class="fas fa-chevron-down mr-2 transition-transform" class:rotate-180={!toggles[key]}></i>
                        <span class="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    </div>
                </div>
                {#if toggles[key]}
                    {#if key === 'quantity' || key === 'price'}
                        <div class="flex gap-2 mt-2">
                            <input type="number" class="w-1/2 p-2 border rounded" bind:value={filters[`min_${key}`]} placeholder={`Tối thiểu ${key}`} />
                            <input type="number" class="w-1/2 p-2 border rounded" bind:value={filters[`max_${key}`]} placeholder={`Tối đa ${key}`} />
                        </div>
                    {:else if key === 'stock'}
                        <select class="w-full mt-2 p-2 border rounded" bind:value={filters.stock_level}>
                            <option value="">Bất kỳ</option>
                            <option value="below">Dưới mức tối thiểu</option>
                            <option value="above">Trên mức tối thiểu</option>
                        </select>
                    {:else}
                        <input class="w-full mt-2 p-2 border rounded" bind:value={filters[key]} placeholder={`Nhập ${key}`} />
                    {/if}
                {/if}
            </div>
        {/each}

        <button on:click={search} class="w-full mt-4 bg-[#00205b] text-white py-2 rounded hover:bg-white hover:text-[#00205b] border transition-colors duration-200">
            Áp dụng bộ lọc
        </button>
    </aside>

    <main class="ml-[300px] w-full p-6">
        <h1 class="text-2xl font-bold mb-6 border-b pb-4">Kết quả tìm kiếm</h1>

        {#if isLoading}
            <div class="flex justify-center items-center">
                <div class="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        {:else if error}
            <div class="text-red-600 bg-red-100 border border-red-300 p-4 rounded">{error}</div>
        {:else if results.length === 0}
            <div class="text-center mt-10">
                <h2 class="text-xl font-semibold mb-4">Không có kết quả</h2>
                <div class="grid grid-cols-3 gap-6 max-w-[800px] mx-auto">
                    {#each ICONS as icon}
                        <div class="bg-white p-4 rounded-lg shadow text-center">
                            <i class="fas {icon.icon} text-blue-500 text-xl bg-blue-100 p-3 rounded-full"></i>
                            <h3 class="mt-2 font-semibold">{icon.title}</h3>
                            <p class="text-sm text-gray-600">{icon.desc}</p>
                        </div>
                    {/each}
                </div>
            </div>
        {:else}
            <div class="grid grid-cols-1 gap-6">
                {#each results as item}
                    <ItemResource {item} />
                {/each}
            </div>
        {/if}
    </main>
</div>
