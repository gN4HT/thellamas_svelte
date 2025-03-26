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
    import ItemModal from "../../../../components/ItemModal.svelte";

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
        folders = allFolders.filter(folder => folder.parent_id === null && folder.is_deleted !== 1);
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
  
 // Quản lý modal cho thư mục và mặt hàng
 let showFolderModal = false;
  let editModeFolder = false;
  let selectedFolder: Partial<Folder> = {};

  let showItemModal = false;
  let editModeItem = false;
  let selectedItem: Partial<Item> = {};

  function handleAddFolder() {
    editModeFolder = false;
    selectedFolder = {};
    showFolderModal = true;
  }

  function handleAddItem() {
    editModeItem = false;
    selectedItem = {};
    showItemModal = true;
  }

  function handleEditFolder(folder: Folder) {
    editModeFolder = true;
    selectedFolder = { ...folder };
    showFolderModal = true;
  }

  function handleEditItem(item: Item) {
    editModeItem = true;
    selectedItem = { ...item };
    showItemModal = true;
  }

  // Xử lý sự kiện submit từ FolderModal
  async function handleFolderSubmit(event: CustomEvent<{ data: Partial<Folder> }>) {
    const folderData = event.detail.data;
    try {
      if (editModeFolder) {
        // Cập nhật folder theo ID
        await apiFetch(`http://127.0.0.1:8000/api/folders/${folderData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(folderData)
        });
      } else {
        // Thêm mới folder
        await apiFetch(`http://127.0.0.1:8000/api/folders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(folderData)
        });
      }
      await fetchData();
    } catch (error) {
      console.error("Error updating/creating folder", error);
    }
    showFolderModal = false;
  }

  // Xử lý sự kiện submit từ ItemModal
  async function handleItemSubmit(event: CustomEvent<{ data: Partial<Item> }>) {
    const itemData = event.detail.data;

    try {
      if (editModeItem) {
        // Cập nhật item theo ID
        await apiFetch(`http://127.0.0.1:8000/api/items/${itemData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData) 
        });
      } else {
        // Thêm mới item (sử dụng endpoint items)
        await apiFetch(`http://127.0.0.1:8000/api/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData) 
        });
      }
      await fetchData();
    } catch (error) {
      console.error("Error updating/creating item", error);
    }
    showItemModal = false;
  }

  function handleFolderClose() {
    showFolderModal = false;
  }

  function handleItemClose() {
    showItemModal = false;
  }

  async function handleDeleteFolder(folderId: number) {
    if (!confirm("Bạn có chắc chắn muốn xóa thư mục này không?")) {
      return;
    }
    try {
      await apiFetch(`http://127.0.0.1:8000/api/folders/${folderId}/delete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      await fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa thư mục:", error);
    }
  }

  async function handleDeleteItem(itemId: number) {
    if (!confirm("Bạn có chắc chắn muốn xóa mặt hàng này không?")) {
      return;
    }
    try {
      await apiFetch(`http://127.0.0.1:8000/api/items/${itemId}/delete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      await fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa mặt hàng:", error);
    }
  }


  
    onMount(fetchData);
  </script>
  
  <!-- Header -->
  <div class="flex items-center justify-between border-b border-gray-500 p-4">
    <h1 class="text-3xl font-bold text-gray-800">Tất cả mặt hàng</h1>
    <div class="flex space-x-4">
      <button on:click={handleAddItem} class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">
        Thêm mặt hàng
      </button>
      <button on:click={handleAddFolder} class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">
        Thêm thư mục
      </button>
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
          <div class="relative">
            <Folders {folder} />
            <button on:click={() => handleEditFolder(folder)} class="absolute top-[40px] right-2 p-2 bg-yellow-500 text-white rounded-full">
              <!-- Icon chỉnh sửa -->
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
              </svg>
            </button>
            <button on:click={() => handleDeleteFolder(folder.id)} class="absolute top-[80px] right-2 p-2 bg-red-500 text-white rounded-full">
              <!-- Icon xóa -->
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>
            </button>
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
          <div class="relative">
            <Items {...item} />
            <button on:click={() => handleEditItem(item)} class="absolute top-[40px] right-2 p-2 bg-yellow-500 text-white rounded-full">
              <!-- Icon chỉnh sửa -->
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
              </svg>
            </button>
            <button on:click={() => handleDeleteItem(item.id)} class="absolute top-[80px] right-2 p-2 bg-red-500 text-white rounded-full">
              <!-- Icon xóa -->
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>
            </button>
          </div>
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

<ItemModal
  bind:showModal={showItemModal}
  bind:item={selectedItem}
  bind:isEditMode={editModeItem}
  on:submit={handleItemSubmit}
  on:close={handleItemClose}
/>

  