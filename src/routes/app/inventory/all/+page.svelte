<script>
  import { onMount } from "svelte";

  let folders = [];
  let items = [];

  let folderPage = 1;
  let itemPage = 1;
  const itemsPerPage = 10;

  function paginatedFolders() {
        const start = (folderPage - 1) * itemsPerPage;
        return folders.slice(start, start + itemsPerPage);
    }

    function paginatedItems() {
        const start = (itemPage - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    }
    function goToPage(type, event) {
        let value = parseInt(event.target.value) || 1;
        let maxPage = Math.ceil((type === 'folder' ? folders.length : items.length) / itemsPerPage);
        let pageValue = Math.max(1, Math.min(maxPage, value));
        if (type === 'folder') folderPage = pageValue;
        else itemPage = pageValue;
    }


  async function fetchData() {
    try {
     // Fetch danh sách thư mục
    const foldersRes = await fetch("http://127.0.0.1:8000/api/folders");
    if (!foldersRes.ok) throw new Error("Lỗi khi lấy dữ liệu folders");
    
    const allFolders = await foldersRes.json();
    
    // Lọc thư mục có parent_id = null
    folders = allFolders.filter(folder => folder.parent_id === null);

      // Fetch danh sách mặt hàng
      const itemsRes = await fetch("http://127.0.0.1:8000/api/items");
      if (!itemsRes.ok) throw new Error("Lỗi khi lấy dữ liệu items");
      items = await itemsRes.json();
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  }

  function getTotalPrice() {
    return items.reduce((total, item) => {
      let price = parseInt(item.price.replace(/[^\d]/g, ""), 10);
      return total + price;
    }, 0);
  }

  onMount(fetchData);
</script>

    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-500 p-4">
      <h1 class="text-3xl font-bold text-gray-800">Tất cả mặt hàng</h1>
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
    <div class="flex mt-5 justify-between">
      <p class="text-gray-500">Tổng số trang: {itemPage}/{Math.ceil(items.length / itemsPerPage)}</p> 
      <div class="flex gap-2">
        <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage = 1}>Trang đầu</button>
        <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage--} disabled={itemPage === 1}>Trước</button>
        <input type="number" bind:value={itemPage} on:change={(e) => goToPage('item', e)} class="border rounded p-1 w-16 text-center" />
        <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage++} disabled={itemPage * itemsPerPage >= items.length}>Sau</button>
        <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage = Math.ceil(items.length / itemsPerPage)}>Trang cuối</button>
      </div>
    </div>
  </div>
</div>

{:else}
  <!-- Hiển thị nếu không có mặt hàng hoặc thư mục -->
  <div class="flex flex-col items-center justify-center mt-12 text-center">
    <img src="/img/empty-product.webp" alt="Không có sản phẩm" />
    <p class="mt-4 text-gray-700 font-medium">
      Nơi này có vẻ hơi cô đơn.<br />
      Hãy làm cho nó trở nên thú vị hơn với một số hàng tồn kho.
    </p>
<<<<<<< HEAD
    <div class="mt-6 flex space-x-4">
      <button class="bg-[#00205b] text-white px-4 py-2 rounded shadow hover:bg-[#001639]">
        Thêm mặt hàng
      </button>
      <button class="bg-[#00205b] text-white px-4 py-2 rounded shadow hover:bg-[#001639]">
        Thêm thư mục
=======

    <!-- Nút bấm -->
    <div class="mt-6 flex space-x-4">
      <button class="bg-[#00205b] text-white px-4 py-2 rounded shadow hover:bg-[#001639]" on:click={fetchData}>
        Tải lại dữ liệu
>>>>>>> f427221b1fd70328566191166837e5d58fdf1ddd
      </button>
    </div>
  </div>
{/if}
