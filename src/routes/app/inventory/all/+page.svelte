<script lang="ts">
    import { onMount } from "svelte";
  import { page } from '$app/stores';
    import { apiFetch } from "$lib/api";
    import type { Item } from "../../../../models/item";
    import type { Folder } from "../../../../models/folder";
    import Folders from "../../../../components/Folders.svelte";
    import NotFoundData from "../../../../components/NotFoundData.svelte";
    import Items from "../../../../components/Items.svelte";
    import Paginations from "../../../../components/Paginations.svelte";
    import FolderModal from "../../../../components/FolderModal.svelte";
    import ItemModal from "../../../../components/ItemModal.svelte";
  import { folderStore } from '../../../../stores/folderStore';
  import TagsModal from "../../../../components/TagsModal.svelte";
  import SupplierModal from "../../../../components/SupplierModal.svelte";
  import MoveFolder from "../../../../components/MoveFolder.svelte";
  import { userStore } from "../../../../stores/userStore";

  // State Management
    let folders: Folder[] = [];
    let items: Item[] = [];
  let isLoading = false;
  let error: string | null = null;
  let currentFolderId: number | null = null;
  let currentFolderName: string = "Tất cả mặt hàng";
  
    let folderPage = 1;
    let itemPage = 1;
    let lastFolderId: number | null = null;
    let lastItemId: number | null = null;
    let minFolderId: number | null = null;
    let maxFolderId: number | null = null;
    let minItemId: number | null = null;
    let maxItemId: number | null = null;
    let hasNextItems = false;
    let hasPreviousItems = false;
    let hasNextFolders = false;
    let hasPreviousFolders = false;

  // Thêm state cho thùng rác
  let isTrashMode = false;
  let deletedItems: Item[] = [];
  let deletedFolders: Folder[] = [];

  // Add these state variables after other state declarations
  let showMoveModal = false;
  let itemToMove: Item | null = null;
  let folderToMove: Folder | null = null;
  let moveModalType: 'folder' | 'item' = 'folder';

  // Subscribe to URL changes
  $: {
    const params = new URLSearchParams($page.url.search);
    const folderId = params.get('folder');
    
    if (folderId) { 
        currentFolderId = Number(folderId);
        console.log('URL changed, fetching data for folder:', currentFolderId);
        // Reset pagination when changing folders
        folderPage = 1;
        itemPage = 1;
        lastFolderId = null;
        lastItemId = null;
        fetchData(currentFolderId);
    } else {
        currentFolderId = null;
        currentFolderName = "Tất cả mặt hàng";
        // Reset pagination when going back to root
        folderPage = 1;
        itemPage = 1;
        lastFolderId = null;
        lastItemId = null;
        console.log('URL changed, fetching root data');
        fetchData(null);
    }
  }
  
  $: totalPrice = items.reduce((total, item) => {
      const price = Number(String(item.price).replace(/[^\d.-]/g, "")) || 0;
        return total + price;
      }, 0);
  
  // Modal cho thêm/sửa folder
 let showFolderModal = false;
  let editModeFolder = false;
  let folderForEdit: Partial<Folder> = {};

  // Modal cho thêm/sửa item
  let showItemModal = false;
  let editModeItem = false;
  let itemForEdit: Partial<Item> = {};

  // Modal cho tags
  let showTagsModal = false;
  let itemForTags: Item | null = null;
  let folderForTags: Folder | null = null;
  let currentModalType: 'folder' | 'item' = 'item';

  // Modal cho supplier
  let showSupplierModal = false;
  let itemForSupplier: Item | null = null;

  // State cho modals
  let showTagSupplierModal = false;
  let selectedItemForTags: Item | null = null;
  let selectedFolderForTags: Folder | null = null;

  // Subscribe to user store
  let canEdit = false;
  $: canEdit = $userStore ? userStore.hasPermission($userStore) : false;

  // Data Fetching
  async function fetchFolders(isPrev = false) {
    try {
        let folderUrl = '/folders';
        // Sử dụng maxId cho prev, minId cho next
        if (isPrev && maxFolderId) {
            folderUrl += `?latestId=${maxFolderId}&action=prev`;
        } else if (!isPrev && minFolderId) {
            folderUrl += `?latestId=${minFolderId}`;
        }
        const allFolders = await apiFetch(folderUrl);

        // Lọc folders theo is_deleted
        const filteredFolders = allFolders.filter(folder => folder.is_deleted !== 1);
        folders = filteredFolders;

        // Update pagination states
        hasNextFolders = folders.length > 0;
        hasPreviousFolders = folderPage > 1;

        // Lấy min và max id ngay khi có data mới
        if (folders.length > 0) {
            const folderIds = folders.map(folder => folder.id);
            minFolderId = Math.min(...folderIds);
            maxFolderId = Math.max(...folderIds);
            // lastFolderId chỉ dùng để hiển thị
            lastFolderId = isPrev ? maxFolderId : minFolderId;
        }

        console.log('Folders Length:', folders.length);
        console.log('Min Folder ID:', minFolderId);
        console.log('Max Folder ID:', maxFolderId);
        console.log('Folder URL:', folderUrl);
    } catch (err) {
        console.error("Lỗi khi tải folders:", err);
        error = err.message || "Không thể tải folders. Vui lòng thử lại sau.";
    }
  }

  async function fetchItems(folderId: number | null = null, isPrev = false) {
    try {
        let itemUrl = '/items';
        // Sử dụng maxId cho prev, minId cho next
        if (isPrev && maxItemId) {
            itemUrl += `?latestId=${maxItemId}&action=prev`;
        } else if (!isPrev && minItemId) {
            itemUrl += `?latestId=${minItemId}`;
        }
        const allItems = await apiFetch(itemUrl);

        // Lọc items theo folder_id và is_deleted
        const filteredItems = folderId 
            ? allItems.filter(item => item.folder_id === folderId && item.is_deleted !== 1)
            : allItems.filter(item => item.is_deleted !== 1);
        
        items = filteredItems;

        // Update pagination states
        hasNextItems = items.length > 0;
        hasPreviousItems = itemPage > 1;

        // Lấy min và max id ngay khi có data mới
        if (items.length > 0) {
            const itemIds = items.map(item => item.id);
            minItemId = Math.min(...itemIds);
            maxItemId = Math.max(...itemIds);
            // lastItemId chỉ dùng để hiển thị
            lastItemId = isPrev ? maxItemId : minItemId;
        }

        console.log('Items Length:', items.length);
        console.log('Min Item ID:', minItemId);
        console.log('Max Item ID:', maxItemId);
        console.log('Item URL:', itemUrl);
    } catch (err) {
        console.error("Lỗi khi tải items:", err);
        error = err.message || "Không thể tải items. Vui lòng thử lại sau.";
    }
  }

  async function fetchData(folderId: number | null = null) {
    isLoading = true;
    error = null;
    try {
        await Promise.all([
            fetchFolders(false),
            fetchItems(folderId, false)
        ]);

        // Cập nhật tên folder hiện tại
        if (folderId) {
            const currentFolder = folders.find(f => f.id === folderId);
            if (currentFolder) {
                currentFolderName = currentFolder.name;
            }
        } else {
            currentFolderName = "Tất cả mặt hàng";
        }

    } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        error = err.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.";
    } finally {
        isLoading = false;
    }
  }

  // Hàm fetch items và folders đã xóa
  async function fetchDeletedItems() {
    isLoading = true;
    try {
        const [trashFolders, trashItems] = await Promise.all([
            apiFetch("/folder_deleted"),
            apiFetch("/item_deleted")
        ]);
        deletedFolders = trashFolders;
        deletedItems = trashItems;
        console.log('Deleted folders:', deletedFolders);
        console.log('Deleted items:', deletedItems);
    } catch (err) {
        error = err.message;
        console.error("Lỗi khi tải dữ liệu thùng rác:", err);
    } finally {
        isLoading = false;
    }
  }

  // Hàm xử lý xóa vĩnh viễn
  async function handlePermanentDelete(type: 'folder' | 'item', id: number) {
    if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${type === 'folder' ? 'thư mục' : 'mặt hàng'} này không?`)) {
      return;
    }
    try {
      await apiFetch(`/${type}s/${id}`, {
        method: 'DELETE'
      });
      
      if (type === 'folder') {
        deletedFolders = deletedFolders.filter(f => f.id !== id);
      } else {
        deletedItems = deletedItems.filter(i => i.id !== id);
      }
    } catch (error) {
      console.error(`Lỗi khi xóa vĩnh viễn ${type}:`, error);
      alert(error.message || `Có lỗi xảy ra khi xóa vĩnh viễn ${type === 'folder' ? 'thư mục' : 'mặt hàng'}. Vui lòng thử lại.`);
    }
  }

  // Hàm xử lý khôi phục
  async function handleRestore(type: 'folder' | 'item', id: number) {
    try {
      await apiFetch(`/${type}s/${id}/restore`, {
        method: 'PUT'
      });
      
      if (type === 'folder') {
        deletedFolders = deletedFolders.filter(f => f.id !== id);
        // Cập nhật store khi khôi phục folder
        const allFolders = await apiFetch("/folders");
        folderStore.set(allFolders);
      } else {
        deletedItems = deletedItems.filter(i => i.id !== id);
      }
      
      // Refresh data nếu đang ở chế độ bình thường
      if (!isTrashMode) {
        await fetchData(currentFolderId);
      }
    } catch (error) {
      console.error(`Lỗi khi khôi phục ${type}:`, error);
      alert(error.message || `Có lỗi xảy ra khi khôi phục ${type === 'folder' ? 'thư mục' : 'mặt hàng'}. Vui lòng thử lại.`);
    }
  }

  // Toggle trash mode
  function toggleTrashMode() {
    isTrashMode = !isTrashMode;
    if (isTrashMode) {
      fetchDeletedItems();
    } else {
      fetchData(currentFolderId);
    }
  }

  // Modal Handlers
  function handleAddFolder() {
    editModeFolder = false;
    folderForEdit = {};
    showFolderModal = true;
  }

  function handleAddItem() {
    editModeItem = false;
    itemForEdit = {};
    showItemModal = true;
  }

  function handleEditFolder(folder: Folder) {
    editModeFolder = true;
    folderForEdit = { ...folder };
    showFolderModal = true;
  }

  function handleEditItem(item: Item) {
    editModeItem = true;
    itemForEdit = { ...item };
    showItemModal = true;
  }

  function handleOpenTagSupplier(type: 'folder' | 'item', data: Folder | Item) {
    if (type === 'folder') {
      selectedFolderForTags = data as Folder;
      selectedItemForTags = null;
    } else {
      selectedItemForTags = data as Item;
      selectedFolderForTags = null;
    }
    currentModalType = type;
    showTagSupplierModal = true;
  }

  // Handlers
  function handleOpenTags(type: 'folder' | 'item', data: Folder | Item) {
    currentModalType = type;
    if (type === 'folder') {
        folderForTags = data as Folder;
        itemForTags = null;
    } else {
        itemForTags = data as Item;
        folderForTags = null;
    }
    showTagsModal = true;
  }

  function handleOpenSupplier(item: Item) {
    itemForSupplier = item;
    showSupplierModal = true;
  }

  // API Operations
  async function handleFolderSubmit(event: CustomEvent<{ formData: FormData, isEdit: boolean, folderId: number }>) {
    try {
        const { formData, isEdit, folderId } = event.detail;
        
        console.log('Processing folder submission:', {
            isEdit,
            folderId,
            data: Object.fromEntries(formData)
        });

        let endpoint = '/folders';
        if (isEdit && folderId) {
            endpoint = `/folders/${folderId}`;
        }

        const response = await apiFetch(endpoint, {
            method: 'POST',
            body: formData,
        });

        if (!response) {
            throw new Error('Failed to save folder');
        }

        // Reset pagination values khi tạo mới
        if (!isEdit) {
            folderPage = 1;
            lastFolderId = null;
            minFolderId = null;
            maxFolderId = null;
        }

        const allFolders = await apiFetch("/folders");
        folderStore.set(allFolders);
        await fetchData(currentFolderId);
        showFolderModal = false;
    } catch (error) {
        console.error("Lỗi khi xử lý thư mục:", error);
        alert(error.message || "Có lỗi xảy ra khi lưu thư mục. Vui lòng thử lại.");
    }
}

async function handleItemSubmit(event: CustomEvent<{ formData: FormData, isEdit: boolean, itemId: number }>) {
    if (isLoading) return;
    isLoading = true;

    try {
        const { formData, isEdit, itemId } = event.detail;
        
        console.log('Processing item submission:', {
            isEdit,
            itemId,
            data: Object.fromEntries(formData)
        });

        let endpoint = '/items';
        let method = 'POST';

        if (isEdit && itemId) {
            endpoint = `/items/${itemId}`;
            method = 'PUT';
            
            // Thêm _method=PUT vào formData
            formData.append('_method', 'PUT');
        }

        const response = await apiFetch(endpoint, {
            method: 'POST', // Luôn dùng POST vì đang gửi FormData
            body: formData,
        });

        if (!response) {
            throw new Error('Failed to save item');
        }

        // Reset pagination values khi tạo mới
        if (!isEdit) {
            itemPage = 1;
            lastItemId = null;
            minItemId = null;
            maxItemId = null;
        }
        
        // Refresh data sau khi lưu thành công
        await fetchData(currentFolderId);
        
        // Đóng modal và reset form
        showItemModal = false;
        itemForEdit = {};
    } catch (error) {
        console.error("Lỗi khi xử lý mặt hàng:", error);
        alert(error.message || "Có lỗi xảy ra khi lưu mặt hàng. Vui lòng thử lại.");
    } finally {
        isLoading = false;
    }
}

  async function handleDelete(type: 'folder' | 'item', id: number) {
    if (!confirm(`Bạn có chắc chắn muốn xóa ${type === 'folder' ? 'thư mục' : 'mặt hàng'} này không?`)) {
      return;
    }

    try {
      await apiFetch(`/${type}s/${id}/delete`, {
        method: 'PUT'
      });
      
      if (type === 'folder') {
        // Cập nhật store khi xóa folder
        const allFolders = await apiFetch("/folders");
        folderStore.set(allFolders);
      }
      
      await fetchData(currentFolderId);
    } catch (error) {
      console.error(`Lỗi khi xóa ${type}:`, error);
      alert(error.message || `Có lỗi xảy ra khi xóa ${type === 'folder' ? 'thư mục' : 'mặt hàng'}. Vui lòng thử lại.`);
    }
  }

  // Add these functions after other handlers
  function handleMoveFolder(folder: Folder) {
    folderToMove = folder;
    itemToMove = null;
    moveModalType = 'folder';
    showMoveModal = true;
  }

  function handleMoveItem(item: Item) {
    itemToMove = item;
    folderToMove = null;
    moveModalType = 'item';
    showMoveModal = true;
  }

  // Add function to handle page changes
  function handlePageChange(type: 'folder' | 'item', direction: 'next' | 'prev') {
    if (type === 'folder') {
      if (direction === 'next') {
        folderPage++;
        fetchFolders(false);
      } else {
        folderPage--;
        // Reset lastId when going back to first page
        if (folderPage === 1) {
          lastFolderId = null;
          minFolderId = null;
          maxFolderId = null;
        }
        fetchFolders(true);
      }
    } else {
      if (direction === 'next') {
        itemPage++;
        fetchItems(currentFolderId, false);
      } else {
        itemPage--;
        // Reset lastId when going back to first page
        if (itemPage === 1) {
          lastItemId = null;
          minItemId = null;
          maxItemId = null;
        }
        fetchItems(currentFolderId, true);
      }
    }
  }

  onMount(() => fetchData(null));
  </script>
  
<!-- Main Layout -->
<div class="flex flex-col min-h-screen">
  <!-- Header -->
  <div class="flex items-center justify-between border-b border-gray-500 p-4">
        <div class="flex items-center gap-4">
            <h1 class="text-3xl font-bold text-gray-800">
                {isTrashMode ? "Thùng rác" : currentFolderName}
            </h1>
            <button 
                on:click={toggleTrashMode}
                class="flex items-center gap-2 px-3 py-2 rounded-lg {isTrashMode ? 'bg-gray-600' : 'bg-gray-100'} hover:bg-gray-200 transition-colors"
                title={isTrashMode ? "Quay lại" : "Xem thùng rác"}
            >
                <svg class="w-5 h-5 {isTrashMode ? 'text-white' : 'text-gray-600'}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                </svg>
                <span class={isTrashMode ? "text-white" : "text-gray-600"}>
                    {isTrashMode ? "Quay lại" : "Thùng rác"}
                </span>
            </button>
        </div>
        
        {#if !isTrashMode && canEdit}
    <div class="flex space-x-4">
                <button 
                    on:click={handleAddItem}
                    class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639] transition-colors"
                >
        Thêm mặt hàng
      </button>
                <button 
                    on:click={handleAddFolder}
                    class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639] transition-colors"
                >
        Thêm thư mục
      </button>
    </div>
        {/if}
  </div>
  
    <!-- Statistics -->
  <div class="p-4 mt-4 flex space-x-6 text-gray-700">
    <span>Thư mục: <strong>{folders.length}</strong></span>
    <span>Mặt hàng: <strong>{items.length}</strong></span>
        <span>Tổng giá trị: <strong>₫{totalPrice.toLocaleString()}</strong></span>
  </div>
  
    <!-- Main Content -->
    {#if isLoading}
        <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00205b]"></div>
        </div>
    {:else if error}
        <div class="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
            {error}
            <button 
                class="ml-2 underline"
                on:click={() => fetchData(currentFolderId)}
            >
                Thử lại
            </button>
        </div>
    {:else if isTrashMode}
        <!-- Trash Mode Content -->
        <div class="p-4">
            {#if deletedFolders.length === 0 && deletedItems.length === 0}
                <div class="text-center text-gray-500 py-8">
                    Không có mục nào trong thùng rác
                </div>
            {:else}
                {#if deletedFolders.length > 0}
                    <div class="mb-8">
                        <h2 class="text-[#00205B] text-2xl mb-4">Thư mục đã xóa:</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {#each deletedFolders as folder (folder.id)}
                                <!-- Deleted Folder Item -->
                                <div class="relative group">
                                    <Folders {folder} />
                                    <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            on:click={() => handleRestore('folder', folder.id)}
                                            class="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                            title="Khôi phục"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v13m0-13 4 4m-4-4-4 4"/>
                                            </svg>
                                        </button>
                                        <button 
                                            on:click={() => handlePermanentDelete('folder', folder.id)}
                                            class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            title="Xóa vĩnh viễn"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if deletedItems.length > 0}
                    <div>
                        <h2 class="text-[#00205B] text-2xl mb-4">Mặt hàng đã xóa:</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {#each deletedItems as item (item.id)}
                                <!-- Deleted Item -->
                                <div class="relative group">
                                    <Items {...item} />
                                    <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            on:click={() => handleRestore('item', item.id)}
                                            class="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                            title="Khôi phục"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v13m0-13 4 4m-4-4-4 4"/>
                                            </svg>
                                        </button>
                                        <button 
                                            on:click={() => handlePermanentDelete('item', item.id)}
                                            class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            title="Xóa vĩnh viễn"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            {/if}
        </div>
    {:else}
        <!-- Normal Mode Content -->
        {#if folders.length === 0 && items.length === 0}
            <NotFoundData fetchData={() => fetchData(currentFolderId)} />
        {:else}
    <div class="p-4">
                {#if folders.length > 0}
      <div class="flex flex-col gap-3">
        <h2 class="text-[#00205B] text-2xl">Thư mục:</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {#each folders as folder (folder.id)}
                                <!-- Normal Folder Item -->
                                <div class="relative group">
            <Folders {folder} />
                                    {#if canEdit}
                                    <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            on:click={() => handleEditFolder(folder)}
                                            class="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                                        >
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
              </svg>
            </button>
                                        <button 
                                            on:click={() => handleOpenTags('folder', folder)}
                                            class="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                            title="Quản lý tags"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8M3 8l8.2-7.6a1 1 0 0 1 1.6 0L21 8M3 8h18"/>
                                            </svg>
                                        </button>
                                        <button 
                                            on:click={() => handleDelete('folder', folder.id)}
                                            class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>
            </button>
                                        <button 
                                            on:click={() => handleMoveFolder(folder)}
                                            class="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                                            title="Di chuyển thư mục"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0-4-4m4 4-4 4m0 6H4m0 0 4 4m-4-4 4-4"/>
                                            </svg>
                                        </button>
                                    </div>
                                    {/if}
          </div>
          {/each}
        </div>
                        <Paginations 
                            totalItems={folders.length} 
                            bind:currentPage={folderPage}
                            latestId={lastFolderId}
                            on:next={() => handlePageChange('folder', 'next')}
                            on:prev={() => handlePageChange('folder', 'prev')}
                        />
        </div>
                {/if}
  
                {#if items.length > 0}
      <div class="flex flex-col gap-3 mt-10">
        <h2 class="text-[#00205B] text-2xl">Mặt hàng:</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {#each items as item (item.id)}
                                <!-- Normal Item -->
                                <div class="relative group">
            <Items {...item} />
                                    {#if canEdit}
                                    <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            on:click={() => handleEditItem(item)}
                                            class="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                                        >
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
              </svg>
            </button>
                                        <button 
                                            on:click={() => handleOpenTags('item', item)}
                                            class="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                            title="Quản lý tags"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8M3 8l8.2-7.6a1 1 0 0 1 1.6 0L21 8M3 8h18"/>
                                            </svg>
                                        </button>
                                        <button 
                                            on:click={() => handleOpenSupplier(item)}
                                            class="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                            title="Chọn supplier"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v13m0-13 4 4m-4-4-4 4"/>
                                            </svg>
                                        </button>
                                        <button 
                                            on:click={() => handleMoveItem(item)}
                                            class="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                                            title="Di chuyển mặt hàng"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0-4-4m4 4-4 4m0 6H4m0 0 4 4m-4-4 4-4"/>
                                            </svg>
                                        </button>
                                        <button 
                                            on:click={() => handleDelete('item', item.id)}
                                            class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>
            </button>
                                    </div>
                                    {/if}
          </div>
          {/each}
        </div>
                        <Paginations 
                            totalItems={items.length} 
                            bind:currentPage={itemPage}
                            latestId={lastItemId}
                            on:next={() => handlePageChange('item', 'next')}
                            on:prev={() => handlePageChange('item', 'prev')}
                        />
        </div>
                {/if}
      </div>
        {/if}
    {/if}
    </div>
  
<!-- Modals -->
{#if canEdit}
  <FolderModal
  bind:showModal={showFolderModal}
    bind:folder={folderForEdit}
  bind:isEditMode={editModeFolder}
    parentId={currentFolderId}
  on:submit={handleFolderSubmit}
    on:close={() => showFolderModal = false}
/>

<ItemModal
  bind:showModal={showItemModal}
    bind:item={itemForEdit}
  bind:isEditMode={editModeItem}
    folderId={currentFolderId}
  on:submit={handleItemSubmit}
    on:close={() => showItemModal = false}
/>

<TagsModal
    bind:showModal={showTagsModal}
    id={currentModalType === 'item' ? itemForTags?.id : folderForTags?.id}
    type={currentModalType}
    currentTags={currentModalType === 'item' 
        ? itemForTags?.tags?.map(t => t.id) || []
        : folderForTags?.tags?.map(t => t.id) || []
    }
    on:success={() => {
        fetchData(currentFolderId);
        showTagsModal = false;
        itemForTags = null;
        folderForTags = null;
    }}
/>

<SupplierModal
    bind:showModal={showSupplierModal}
    itemId={itemForSupplier?.id}
    currentSupplierId={itemForSupplier?.supplier_id}
    on:success={() => {
        fetchData(currentFolderId);
        showSupplierModal = false;
        itemForSupplier = null;
    }}
/>

<MoveFolder
    bind:showModal={showMoveModal}
    id={moveModalType === 'folder' ? folderToMove?.id : itemToMove?.id}
    type={moveModalType}
    currentFolderId={currentFolderId}
    on:success={async (event) => {
        // Update the folder store with new data
        if (event.detail.folders) {
            folderStore.set(event.detail.folders);
        }
        await fetchData(currentFolderId);
        showMoveModal = false;
        folderToMove = null;
        itemToMove = null;
    }}
/>
{/if}