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

  // Constants
  const ITEMS_PER_PAGE = 10;

  // State Management
  let folders: Folder[] = [];
  let items: Item[] = [];
  let isLoading = false;
  let error: string | null = null;
  let currentFolderId: number | null = null;
  let currentFolderName: string = "Tất cả mặt hàng";
  
  let folderPage = 1;
  let itemPage = 1;

  // Subscribe to URL changes
  $: {
    const params = new URLSearchParams($page.url.search);
    const folderId = params.get('folder');
    
    if (folderId) {
        currentFolderId = Number(folderId);
        console.log('URL changed, fetching data for folder:', currentFolderId);
        fetchData(currentFolderId);
    } else {
        currentFolderId = null;
        currentFolderName = "Tất cả mặt hàng";
        console.log('URL changed, fetching root data');
        fetchData(null);
    }
  }

  // Computed Properties
  $: paginatedFolders = folders.slice(
      (folderPage - 1) * ITEMS_PER_PAGE,
      folderPage * ITEMS_PER_PAGE
  );

  $: paginatedItems = items.slice(
      (itemPage - 1) * ITEMS_PER_PAGE,
      itemPage * ITEMS_PER_PAGE
  );

  $: totalPrice = items.reduce((total, item) => {
      const price = Number(String(item.price).replace(/[^\d.-]/g, "")) || 0;
      return total + price;
  }, 0);

  // Modal State
  let showFolderModal = false;
  let editModeFolder = false;
  let selectedFolder: Partial<Folder> = {};

  let showItemModal = false;
  let editModeItem = false;
  let selectedItem: Partial<Item> = {};

  // Data Fetching
  async function fetchData(folderId: number | null = null) {
    isLoading = true;
    error = null;
    try {
        const [allFolders, allItems] = await Promise.all([
            apiFetch("/folders"),
            apiFetch("/items")
        ]);

        // Lọc folders và items dựa trên folderId
        if (folderId) {
            // Lọc folders có parent_id trùng với folderId hiện tại
            folders = allFolders.filter(folder => 
                folder.parent_id === folderId && 
                folder.is_deleted !== 1
            );

            // Lọc items thuộc folder hiện tại
            items = allItems.filter(item => 
                item.folder_id === folderId && 
                item.is_deleted !== 1
            );
            
            // Cập nhật tên folder hiện tại
            const currentFolder = allFolders.find(f => f.id === folderId);
            if (currentFolder) {
                currentFolderName = currentFolder.name;
            }
        } else {
            // Hiển thị folders gốc (không có parent)
            folders = allFolders.filter(folder => 
                folder.parent_id === null && 
                folder.is_deleted !== 1
            );

            // Hiển thị tất cả items khi ở trang chủ
            items = allItems.filter(item => 
                item.is_deleted !== 1
            );
            currentFolderName = "Tất cả mặt hàng";
        }

        console.log('Current Folder ID:', folderId);
        console.log('Total Items:', items.length);

    } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        error = err.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.";
    } finally {
        isLoading = false;
    }
  }

  // Modal Handlers
  function handleAddFolder() {
    editModeFolder = false;
    selectedFolder = {
      parent_id: currentFolderId,
      is_deleted: 0
    };
    showFolderModal = true;
  }

  function handleAddItem() {
    editModeItem = false;
    selectedItem = {
      folder_id: currentFolderId || 0,
      is_deleted: 0
    };
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

  // API Operations
  async function handleFolderSubmit(event: CustomEvent<{ data: Partial<Folder> }>) {
    const folderData = {
      ...event.detail.data,
      parent_id: currentFolderId
    };
    try {
      let response;
      if (editModeFolder) {
        response = await apiFetch(`/folders/${folderData.id}`, {
          method: 'PUT',
          body: folderData
        });
      } else {
        response = await apiFetch('/folders', {
          method: 'POST',
          body: folderData
        });
      }
      
      // Fetch lại toàn bộ folders và cập nhật store
      const allFolders = await apiFetch("/folders");
      folderStore.set(allFolders);
      
      // Cập nhật local data
      await fetchData(currentFolderId);
      showFolderModal = false;
    } catch (error) {
      console.error("Lỗi khi xử lý thư mục:", error);
      alert(error.message || "Có lỗi xảy ra khi lưu thư mục. Vui lòng thử lại.");
    }
  }

  async function handleItemSubmit(event: CustomEvent<{ data: Partial<Item> }>) {
    if (isLoading) return;
    isLoading = true;

    try {
        const data = event.detail.data;
        console.log('Received data:', data, 'Edit mode:', editModeItem);
        
        if (!data.name?.trim()) {
            throw new Error("Tên mặt hàng không được để trống");
        }

        const submitData = {
            ...(data.id && { id: data.id }), // Chỉ thêm id nếu có
            name: data.name.trim(),
            quantity: Number(data.quantity) || 0,
            stock_level: Number(data.stock_level) || 0,
            price: Number(data.price) || 0,
            images: '[]',
            notes: data.notes || '',
            qr: data.qr || '',
            is_deleted: 0,
            supplier_id: null,
            folder_id: currentFolderId || null,
        };

        console.log('Submitting to API:', submitData, 'Edit mode:', editModeItem);

        if (editModeItem && data.id) {
            await apiFetch(`/items/${data.id}`, {
                method: 'PUT',
                body: submitData
            });
        } else {
            await apiFetch('/items', {
                method: 'POST',
                body: submitData
            });
        }
        
        await fetchData(currentFolderId);
        showItemModal = false;
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

  onMount(() => fetchData(null));
</script>

<!-- Loading State -->
{#if isLoading}
    <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00205b]"></div>
    </div>
{:else}
    <!-- Error State -->
    {#if error}
        <div class="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
            {error}
            <button 
                class="ml-2 underline"
                on:click={() => fetchData(currentFolderId)}
            >
                Thử lại
            </button>
        </div>
    {/if}

    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-500 p-4">
        <h1 class="text-3xl font-bold text-gray-800">{currentFolderName}</h1>
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
    </div>

    <!-- Statistics -->
    <div class="p-4 mt-4 flex space-x-6 text-gray-700">
        <span>Thư mục: <strong>{folders.length}</strong></span>
        <span>Mặt hàng: <strong>{items.length}</strong></span>
        <span>Tổng giá trị: <strong>₫{totalPrice.toLocaleString()}</strong></span>
    </div>

    {#if folders.length > 0 || items.length > 0}
        <div class="p-4">
            <!-- Folders List -->
            <div class="flex flex-col gap-3">
                <h2 class="text-[#00205B] text-2xl">Thư mục:</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {#each paginatedFolders as folder (folder.id)}
                        <div class="relative group">
                            <Folders {folder} />
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
                                    on:click={() => handleDelete('folder', folder.id)}
                                    class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                              </svg>
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
                <Paginations 
                    totalItems={folders.length} 
                    bind:currentPage={folderPage} 
                />
            </div>

            <!-- Items List -->
            <div class="flex flex-col gap-3 mt-10">
                <h2 class="text-[#00205B] text-2xl">Mặt hàng:</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {#each paginatedItems as item (item.id)}
                        <div class="relative group">
                            <Items {...item} />
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
                                    on:click={() => handleDelete('item', item.id)}
                                    class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                              </svg>
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
                <Paginations 
                    totalItems={items.length} 
                    bind:currentPage={itemPage} 
                />
            </div>
        </div>
    {:else}
        <NotFoundData fetchData={() => fetchData(currentFolderId)} />
    {/if}
{/if}

<FolderModal
    bind:showModal={showFolderModal}
    bind:folder={selectedFolder}
    bind:isEditMode={editModeFolder}
    parentId={currentFolderId}
    on:submit={handleFolderSubmit}
    on:close={() => showFolderModal = false}
/>

<ItemModal
    bind:showModal={showItemModal}
    bind:item={selectedItem}
    bind:isEditMode={editModeItem}
    folderId={currentFolderId}
    on:submit={handleItemSubmit}
    on:close={() => showItemModal = false}
/>