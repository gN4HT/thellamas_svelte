<script lang="ts">
    import { onMount } from "svelte";
    import { apiFetch } from "$lib/api";
    import type { Item } from "../../../../models/item";
    import type { Folder } from "../../../../models/folder";
    import Folders from "../../../../components/Folders.svelte";
    import NotFoundData from "../../../../components/NotFoundData.svelte";
    import Items from "../../../../components/Items.svelte";
    import Paginations from "../../../../components/Paginations.svelte";
    import FolderModal from "../../../../components/FolderModal.svelte";
  
    let folders: Folder[] = [];
    let items: Item[] = [];
  
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
  
    async function fetchData() {
      try {
        const allFolders: Folder[] = await apiFetch("http://127.0.0.1:8000/api/folders");
        // Lọc ra các thư mục có parent_id === null
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
  
    // Quản lý modal thư mục
    let showFolderModal = false;
    let editModeFolder = false;
    let selectedFolder: Partial<Folder> = {};
  
    function handleAddFolder() {
      editModeFolder = false;
      selectedFolder = {};
      showFolderModal = true;
    }
  
    // Ví dụ: chỉnh sửa thư mục
    function handleEditFolder(folder: Folder) {
  editModeFolder = true;
  selectedFolder = {}; 
  Object.assign(selectedFolder, folder); 
  showFolderModal = true;
}
  
    // Nhận dữ liệu thư mục cập nhật từ FolderModal
    async function handleFolderSubmit(event: CustomEvent<{ data: Partial<Folder> }>) {
    const folderData = event.detail.data;
    try {
      if (editModeFolder) {
        // Update folder theo id
        await apiFetch(`http://127.0.0.1:8000/api/folders/${folderData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: folderData
        });
      } else {
        // Thêm mới folder
        await apiFetch(`http://127.0.0.1:8000/api/folders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: folderData
        });
      }
      await fetchData();
    } catch (error) {
      console.error("Error updating/creating folder", error);
    }
    showFolderModal = false;
  }
  
    function handleFolderClose() {
      showFolderModal = false;
    }
  
    onMount(fetchData);
  </script>
  
  <!-- Header -->
  <div class="flex items-center justify-between border-b border-gray-500 p-4">
    <h1 class="text-3xl font-bold text-gray-800">Tất cả mặt hàng</h1>
    <div class="flex space-x-4">
      <button class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm mặt hàng</button>
      <button on:click={handleAddFolder} class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm thư mục</button>
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
            <div>
              <Folders {folder} />
              <button on:click={() => handleEditFolder(folder)} class="mt-2 px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
            </div>
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
  
  <FolderModal
    bind:showModal={showFolderModal}
    bind:folder={selectedFolder}
    bind:isEditMode={editModeFolder}
    on:submit={handleFolderSubmit}
    on:close={handleFolderClose}
  />
  