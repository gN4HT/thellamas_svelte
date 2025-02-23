<script>
    import { page } from "$app/stores";

    let data = {
      folders: [
        { id: 1, name: "Thư mục A", isNew: true },
        { id: 2, name: "Thư mục B", isNew: false },
          { id: 3, name: "Thư mục C", isNew: true },
          { id: 4, name: "Thư mục D", isNew: false },
          { id: 5, name: "Thư mục E", isNew: true }
      ],
    };
</script>
<div class="flex">
     <!-- Sidebar -->
  <div class="w-64 bg-white shadow-md border-r p-4 h-screen fixed">
    <div class="mb-6 flex justify-between items-center p-2 border rounded-md">
    <i class="fa-solid fa-magnifying-glass mr-2"></i>
      <input type="text" placeholder="Tìm thư mục" class="w-full border-none outline-none" />
    </div>
    <div 
  class="folder-item flex items-center space-x-2 text-gray-600 hover:text-[#00205b] font-medium p-2 bg-gray-100 cursor-pointer rounded-md 
  {($page.url.pathname === '/app/items/all') ? 'active' : ''}"
>
  <a href="/app/items/all" class="flex items-center space-x-2 w-full">
    <span class="text-lg"><i class="fa-solid fa-box"></i></span>
    <span>Tất cả mặt hàng</span>
  </a>
</div>

    {#each data.folders as folder}
    <a href="/app/items/folder/{folder.id}"
      class="folder-item flex items-center space-x-2 text-gray-600 hover:text-[#00205b] cursor-pointer block pl-6 mt-2 {($page.url.pathname === `/app/items/folder/${folder.id}`) ? 'active' : ''}"
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
  .folder-item.active{
    color: #00205b ;
  }
</style>