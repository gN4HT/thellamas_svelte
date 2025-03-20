<script lang="ts">
    import {onMount} from "svelte";
    import {apiFetch} from "$lib/api";
    import type {Item} from "../../../../models/item";
    import type {Folder} from "../../../../models/folder";
    import Folders from "../../../../components/Folders.svelte";
    import NotFoundData from "../../../../components/NotFoundData.svelte";


    let folders = $state<Folder[]>([]);
    let items = $state<Item[]>([]);

    let [folderPage, itemPage] = $state([1, 1]);
    const itemsPerPage = 10;

    function paginatedFolders() {
        const start = (folderPage - 1) * itemsPerPage;
        return folders.slice(start, start + itemsPerPage);
    }

    function paginatedItems() {
        const start = (itemPage - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    }

    function goToPage(type: 'folder' | 'item', event): void {
        let value = parseInt(event.target.value) || 1;
        let maxPage = Math.ceil((type === 'folder' ? folders.length : items.length) / itemsPerPage);
        let pageValue = Math.max(1, Math.min(maxPage, value));
        if (type === 'folder') {
            folderPage = pageValue;
            return;
        }
        itemPage = pageValue;
    }


    async function fetchData() {
        try {
            const allFolders: Folder[] = await apiFetch("http://127.0.0.1:8000/api/folders");

            folders = allFolders.filter(folder => folder.parent_id === null);

            items = await apiFetch("http://127.0.0.1:8000/api/items");
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    }

    function getTotalPrice() {
        return items.reduce((total, item) => {
            let price = +(String(item.price).replace(/\D/g, "")) || 0;
            return total + price;
        }, 0);
    }

    onMount(fetchData);
</script>

<!-- Header -->
<div class="flex items-center justify-between border-b border-gray-500 p-4">
    <h1 class="text-3xl font-bold text-gray-800">Tất cả mặt hàng</h1>
    <div class="flex space-x-4">
        <a href="/app/inventory/additem" class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm mặt
            hàng</a>
        <a href="/app/inventory/addfolder" class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm thư
            mục</a>
    </div>
</div>

<!-- Thống kê -->
<div class="p-4 mt-4 flex space-x-6 text-gray-700">
    <span>Thư mục: <strong>{folders.length}</strong></span>
    <span>Mặt hàng: <strong>{items.length}</strong></span>
    <span>Tổng giá trị: <strong>₫{getTotalPrice().toLocaleString()}</strong></span>
</div>


{#if folders.length > 0 || items.length > 0}
    <div class="p-4">
        <!-- Danh sách thư mục -->
        <div class="flex flex-col gap-3">
            <h2 class="text-[#00205B] text-2xl">Thư mục:</h2>
            <div class="grid grid-cols-5 gap-4">
                {#each paginatedFolders() as folder (folder.id)}
                    <Folders {folder}/>
                {/each}
            </div>
            <div class="flex mt-5 justify-between">
                <p class="text-gray-500">Tổng số trang: {folderPage}/{Math.ceil(folders.length / itemsPerPage)}</p>
                <div class="flex gap-2">
                    <button class="hover:text-[#00205B] cursor-pointer" onclick={() => folderPage = 1}>Trang đầu
                    </button>
                    <button class="hover:text-[#00205B] cursor-pointer" onclick={() => folderPage--}
                            disabled={folderPage === 1}>Trước
                    </button>
                    <input type="number" bind:value={folderPage} onchange={(e) => goToPage('folder', e)}
                           class="border rounded p-1 w-16 text-center"/>
                    <button class="hover:text-[#00205B] cursor-pointer" onclick={() => folderPage++}
                            disabled={folderPage * itemsPerPage >= folders.length}>Sau
                    </button>
                    <button class="hover:text-[#00205B] cursor-pointer"
                            onclick={() => folderPage = Math.ceil(folders.length / itemsPerPage)}>Trang cuối
                    </button>
                </div>
            </div>
        </div>


        <!-- Danh sách mặt hàng -->
        <div class="flex flex-col gap-3 mt-10">
            <h2 class="text-[#00205B] text-2xl">Mặt hàng:</h2>

            <div class="grid grid-cols-5 gap-4">
                {#each paginatedItems() as item (item.id)}
                    <div class="bg-white shadow rounded-lg overflow-hidden">
                        <div class="bg-gray-200 p-10 flex items-center justify-center relative">
                            <span class="text-4xl text-gray-400"><i class="fa-solid fa-file"></i></span>
                            {#if item.isNew}
                                <span class="absolute bottom-2 left-2 text-xs bg-black text-white px-2 py-1 rounded">MỚI</span>
                            {/if}
                        </div>
                        <div class="p-4">
                            <p class="mt-2 font-semibold text-gray-700">{item.name}</p>
                            <p class="text-sm text-gray-500 mt-1">{item.quantity} | {item.price}</p>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="flex mt-5 justify-between">
                <p class="text-gray-500">Tổng số trang: {itemPage}/{Math.ceil(items.length / itemsPerPage)}</p>
                <div class="flex gap-2">
                    <button class="hover:text-[#00205B] cursor-pointer" onclick={() => itemPage = 1}>Trang đầu</button>
                    <button class="hover:text-[#00205B] cursor-pointer" onclick={() => itemPage--}
                            disabled={itemPage === 1}>Trước
                    </button>
                    <input type="number" bind:value={itemPage} onchange={(e) => goToPage('item', e)}
                           class="border rounded p-1 w-16 text-center"/>
                    <button class="hover:text-[#00205B] cursor-pointer" onclick={() => itemPage++}
                            disabled={itemPage * itemsPerPage >= items.length}>Sau
                    </button>
                    <button class="hover:text-[#00205B] cursor-pointer"
                            onclick={() => itemPage = Math.ceil(items.length / itemsPerPage)}>Trang cuối
                    </button>
                </div>
            </div>
        </div>
    </div>

{:else}
    <!-- Hiển thị nếu không có mặt hàng hoặc thư mục -->
    <NotFoundData {fetchData}/>
{/if}
