<script>
  import { onMount } from "svelte";
  import { page } from '$app/stores';


  let folders = [];

  // Fetch danh sách thư mục từ API
  const fetchFolders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/folders");
      const result = await response.json();
      folders = result.map(folder => ({
        id: folder.id,
        name: folder.name,
      }));
    } catch (error) {
      console.error("Lỗi khi fetch API:", error);
    }
  };

  onMount(() => {
    fetchFolders();
  });
</script>

<div class="flex">
  <!-- Sidebar -->
  <div class="w-64 bg-white shadow-md border-r p-4 h-screen fixed">
    <!-- Thanh tìm kiếm -->
    <div class="mb-6 flex justify-between items-center p-2 border rounded-md">
      <i class="fa-solid fa-magnifying-glass mr-2"></i>
      <input type="text" placeholder="Tìm thư mục" class="w-full border-none outline-none" />
    </div>

    <!-- Mục "Tất cả mặt hàng" -->
    <div
    class="folder-item flex items-center space-x-2 text-gray-600 hover:text-[#00205b] {($page.url.pathname === '/app/items/all') ? 'active' : ''}"
  >
      <a href="/app/items/all" class="flex items-center space-x-2 w-full">
        <span class="text-lg"><i class="fa-solid fa-box"></i></span>
        <span>Tất cả mặt hàng</span>
      </a>
    </div>

    <!-- Danh sách thư mục từ API -->
    {#each folders as folder}
      <a href="/app/items/folder/{folder.id}"
        class="folder-item flex items-center space-x-2 text-gray-600 hover:text-[#00205b] cursor-pointer block pl-6 mt-2 
        {($page.url.pathname === `/app/items/folder/${folder.id}`) ? 'active' : ''}"
      >
        <span class="text-lg"><i class="fa-solid fa-folder"></i></span>
        <span>{folder.name}</span>
      </a>
    {/each}
  </div>

  <!-- Nội dung chính -->
  <div class="p-4 w-full ml-[250px]">
    <slot />
  </div>
</div>

<style>
  .folder-item.active {
    color: #00205b;
  }
</style>
