<script>
  import { onMount } from "svelte";
  import { page } from '$app/stores';

  let folders = [];

  // Hàm đệ quy để xây dựng cây thư mục nhiều cấp
  function buildFolderTree(folders, parentId = null) {
    return folders
      .filter(folder => folder.parent_id === parentId)
      .map(folder => ({
        ...folder,
        children: buildFolderTree(folders, folder.id) // Đệ quy lấy danh sách con
      }));
  }

  // Fetch danh sách thư mục từ API
  const fetchFolders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/folders");
      const result = await response.json();

      // Xây dựng cây thư mục
      folders = buildFolderTree(result);
    } catch (error) {
      console.error("Lỗi khi fetch API:", error);
    }
  };

  onMount(fetchFolders);
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
      class="folder-item flex items-center space-x-2 text-gray-600 hover:text-[#00205b] {($page.url.pathname === '/app/inventory/all') ? 'active' : ''}"
    >
      <a href="/app/inventory/all" class="flex items-center space-x-2 w-full">
        <span class="text-lg"><i class="fa-solid fa-box"></i></span>
        <span>Tất cả mặt hàng</span>
      </a>
    </div>

    <!-- Danh sách thư mục dạng bậc thang -->
    {#each folders as folder}
      <a href="/app/inventory/folder/{folder.id}"
        class="folder-item flex items-center space-x-2 text-gray-600 hover:text-[#00205b] cursor-pointer block mt-2 ml-3
        {($page.url.pathname === `/app/inventory/folder/${folder.id}`) ? 'active' : ''}"
      >
        <span class="text-lg"><i class="fa-solid fa-folder"></i></span>
        <span>{folder.name}</span>
      </a>

      <!-- Hiển thị thư mục con -->
      {#each folder.children as child}
  <div class="ml-4">
    <a href="/app/inventory/folder/{child.id}"
      class="folder-item flex items-center space-x-2 text-gray-500 hover:text-[#00205b] cursor-pointer block pl-6 mt-1 
      {($page.url.pathname === `/app/inventory/folder/${child.id}`) ? 'active' : ''}"
    >
      <span class="text-lg"><i class="fa-regular fa-folder"></i></span>
      <span>{child.name}</span>
    </a>

    <!-- Gọi lại chính nó để hiển thị các thư mục con sâu hơn -->
    {#if child.children.length > 0}
      <div class="ml-6">
        {#each child.children as subChild}
          <div class="ml-4">
            <a href="/app/inventory/folder/{subChild.id}"
              class="folder-item flex items-center space-x-2 text-gray-500 hover:text-[#00205b] cursor-pointer block pl-6 mt-1 
              {($page.url.pathname === `/app/inventory/folder/${subChild.id}`) ? 'active' : ''}"
            >
              <span class="text-lg"><i class="fa-regular fa-folder"></i></span>
              <span>{subChild.name}</span>
            </a>

            <!-- Tiếp tục hiển thị thư mục con -->
            {#if subChild.children.length > 0}
              <div class="ml-6">
                {#each subChild.children as deepChild}
                  <div class="ml-4">
                    <a href="/app/inventory/folder/{deepChild.id}"
                      class="folder-item flex items-center space-x-2 text-gray-500 hover:text-[#00205b] cursor-pointer block pl-6 mt-1 
                      {($page.url.pathname === `/app/inventory/folder/${deepChild.id}`) ? 'active' : ''}"
                    >
                      <span class="text-lg"><i class="fa-regular fa-folder"></i></span>
                      <span>{deepChild.name}</span>
                    </a>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/each}

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
    font-weight: bold;
  }
</style>
