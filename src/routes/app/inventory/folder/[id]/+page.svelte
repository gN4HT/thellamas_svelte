<script lang="ts">
  import { page } from '$app/stores';
  import { onDestroy } from 'svelte';
  import { apiFetch } from '$lib/api';
  import type { Item } from "../../../../../models/item";
  import type { Folder } from "../../../../../models/folder";
  import Folders from "../../../../../components/Folders.svelte";
  import NotFoundData from "../../../../../components/NotFoundData.svelte";
  import Items from "../../../../../components/Items.svelte";
  import Paginations from "../../../../../components/Paginations.svelte";

  // Khai báo biến
  let folderName: string = "Đang tải...";
  let folders: Folder[] = [...[]];
  let items: Item[] = [...[]];
  let folderPage: number = 1;
  let itemPage: number = 1;
  const itemsPerPage = 10;
  let key = 0;

  // Hàm lấy dữ liệu theo folderId
  async function fetchData(folderId: string | number) {
    try {
      console.log("Fetching data for folder ID:", folderId);

      const allFolders: Folder[] = await apiFetch("http://127.0.0.1:8000/api/folders");

      const folder = allFolders.find(f => f.id == folderId);
      folderName = folder ? folder.name : "Thư mục không tồn tại";

      // Lọc thư mục con của folder hiện tại
      folders = allFolders.filter(f => f.parent_id === Number(folderId));

      const allItems: Item[] = await apiFetch("http://127.0.0.1:8000/api/items");
      items = allItems.filter(item => item.folder_id == folderId);
      console.log("Fetched data:", items);

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  }

  // Hàm phân trang cho mặt hàng
  function paginatedItems(): Item[] {
    const start = (itemPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }

  // Hàm phân trang cho thư mục
  function paginatedFolders(): Folder[] {
    const start = (folderPage - 1) * itemsPerPage;
    return folders.slice(start, start + itemsPerPage);
  }

  // Tính tổng giá trị của các mặt hàng
  function getTotalPrice(): number {
    return items.reduce((total, item) => {
      const price = +(String(item.price).replace(/\D/g, "")) || 0;
      return total + price;
    }, 0);
  }

  let unsubscribe = page.subscribe(($page) => {
    if ($page.params.id) {
        folderPage = 1;
        itemPage = 1;
        fetchData($page.params.id);
    }
});

onDestroy(() => {
    unsubscribe();
});
</script>


<!-- Header -->
<div class="flex items-center justify-between border-b border-gray-500 p-4">
  <h1 class="text-3xl font-bold text-gray-800">{folderName}</h1>
  <div class="flex space-x-4">
    <a href="/app/inventory/additem" class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm mặt hàng</a>
    <a href="/app/inventory/addfolder" class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm thư mục</a>
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
          <Folders {folder} />
        {/each}
      </div>
      <div class="flex mt-5 justify-between">
        <Paginations totalItems={folders.length} bind:currentPage={folderPage} />
      </div>
    </div>

    <!-- Danh sách mặt hàng -->
    <div class="flex flex-col gap-3 mt-10">
      <h2 class="text-[#00205B] text-2xl">Mặt hàng:</h2>
      <div class="grid grid-cols-5 gap-4">
        {#each paginatedItems() as item (item.id)}
          <Items {...item} />
        {/each}
      </div>
      <div class="flex mt-5 justify-between">
        <Paginations totalItems={items.length} bind:currentPage={itemPage} />
      </div>
    </div>
  </div>
{:else}
  <!-- Hiển thị nếu không có mặt hàng hoặc thư mục -->
  <NotFoundData {fetchData} />
{/if}
