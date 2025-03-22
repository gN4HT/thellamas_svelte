<script>
  import { page } from '$app/stores';
  import { onDestroy } from 'svelte';
  import { apiFetch } from "$lib/api";


  let folderName = "Đang tải...";
  let folders = [];
  let items = [];
  let itemPage = 1;
  let folderPage = 1;
  let itemsPerPage = 10;
  let unsubscribe;

  async function fetchFolderAndItems(folderId) {
    try {
        console.log("Fetching data for folder ID:", folderId);

        // Lấy danh sách thư mục
        const allFolders = await apiFetch("http://127.0.0.1:8000/api/folders");

        // Tìm thư mục hiện tại theo folderId
        const folder = allFolders.find(f => f.id == folderId);
        folderName = folder ? folder.name : "Thư mục không tồn tại";

        // Lọc danh sách thư mục con của folderId
        folders = allFolders.filter(f => f.parent_id === Number(folderId));

        // Lấy danh sách mặt hàng và lọc theo folder_id
        const allItems = await apiFetch("http://127.0.0.1:8000/api/items");
        items = allItems.filter(item => item.folder_id == folderId);
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

  function paginatedItems() {
    const start = (itemPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }

  function paginatedFolders() {
    const start = (folderPage - 1) * itemsPerPage;
    return folders.slice(start, start + itemsPerPage);
  }

  function goToPage(event) {
    const pageNum = Number(event.target.value);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= Math.ceil(items.length / itemsPerPage)) {
      itemPage = pageNum;
    }
  }

  function getTotalPrice() {
    return items.reduce((total, item) => {
      let price = typeof item.price === "string" ? parseInt(item.price.replace(/[^\d]/g, ""), 10) : item.price;
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  }

  // Lắng nghe thay đổi của page.params.id
  unsubscribe = page.subscribe(($page) => {
    if ($page.params.id) {
      fetchFolderAndItems($page.params.id);
    }
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="p-4">



  <!-- Header -->
<div class="flex items-center justify-between border-b border-gray-500">
  <h1 class="text-3xl font-bold text-gray-800">{folderName}</h1>
  <div class="flex space-x-4">
    <a href="/app/inventory/additem" class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm mặt hàng</a>
    <a href="/app/inventory/addfolder" class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm thư mục</a>
  </div>
</div>

  <!-- Thống kê -->
  <div class="my-4 flex space-x-6 text-gray-700">
    <span>Thư mục: <strong>{folders.length}</strong></span>
    <span>Mặt hàng: <strong>{items.length}</strong></span>
    <span>Tổng giá trị: <strong>₫{getTotalPrice().toLocaleString()}</strong></span>
  </div>

<!-- Danh sách thư mục -->
<div class="flex flex-col gap-3">
  <h2 class="text-[#00205B] text-2xl">Thư mục:</h2>
  <div class="grid grid-cols-5 gap-4">
    {#each paginatedFolders() as folder}
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <a href="/app/inventory/folder/{folder.id}" class="bg-gray-500 p-10 flex items-center justify-center relative">
        <span class="text-4xl text-gray-300"><i class="fa-solid fa-folder-open"></i></span>
          {#if folder.isNew}
            <span class="absolute bottom-2 left-2 text-xs bg-black text-white px-2 py-1 rounded">MỚI</span>
          {/if}
        </a>
        <div class="p-4">
          <p class="mt-2 font-semibold text-gray-700">{folder.name}</p>
        </div>
      </div>
    {/each}
  </div>
    <div class="flex mt-5 justify-between">
        <p class="text-gray-500">Tổng số trang: {folderPage}/{Math.ceil(folders.length / itemsPerPage)}</p>
        <div class="flex gap-2">
          <button class="hover:text-[#00205B] cursor-pointer" on:click={() => folderPage = 1}>Trang đầu</button>
          <button class="hover:text-[#00205B] cursor-pointer" on:click={() => folderPage--} disabled={folderPage === 1}>Trước</button>
          <input type="number" bind:value={folderPage} on:change={(e) => goToPage('folder', e)} class="border rounded p-1 w-16 text-center" />
          <button class="hover:text-[#00205B] cursor-pointer" on:click={() => folderPage++} disabled={folderPage * itemsPerPage >= folders.length}>Sau</button>
          <button class="hover:text-[#00205B] cursor-pointer" on:click={() => folderPage = Math.ceil(folders.length / itemsPerPage)}>Trang cuối</button>
        </div>
    </div>
</div>

<!-- Danh sách mặt hàng -->
<div class="flex flex-col gap-3 mt-10">
  <h2 class="text-[#00205B] text-2xl">Mặt hàng:</h2>

  <div class="grid grid-cols-5 gap-4">
    {#each paginatedItems() as item}
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

  <!-- Phân trang -->
  <div class="flex mt-5 justify-between">
    <p class="text-gray-500">Trang {itemPage} / {Math.ceil(items.length / itemsPerPage)}</p> 
    <div class="flex gap-2">
      <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage = 1}>Trang đầu</button>
      <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage--} disabled={itemPage === 1}>Trước</button>
      <input type="number" bind:value={itemPage} on:change={goToPage} class="border rounded p-1 w-16 text-center" />
      <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage++} disabled={itemPage * itemsPerPage >= items.length}>Sau</button>
      <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage = Math.ceil(items.length / itemsPerPage)}>Trang cuối</button>
    </div>
  </div>
</div>
</div>
