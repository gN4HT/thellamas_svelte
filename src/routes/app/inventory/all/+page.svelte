<script lang="ts">
    import {onMount} from "svelte";
    import {page} from '$app/stores';
    import {apiFetch} from "$lib/api";
    import type {Item} from "../../../../models/item";
    import type {Folder} from "../../../../models/folder";
    import Folders from "../../../../components/Folders.svelte";
    import NotFoundData from "../../../../components/NotFoundData.svelte";
    import Items from "../../../../components/Items.svelte";
    import Paginations from "../../../../components/Paginations.svelte";
    import FolderModal from "../../../../components/FolderModal.svelte";
    import ItemModal from "../../../../components/ItemModal.svelte";
    import {folderStore} from '../../../../stores/folderStore';
    import TagsModal from "../../../../components/TagsModal.svelte";
    import SupplierModal from "../../../../components/SupplierModal.svelte";

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

    // Thêm state cho thùng rác
    let isTrashMode = false;
    let deletedItems: Item[] = [];
    let deletedFolders: Folder[] = [];

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

    // Data Fetching
    async function fetchData(folderId: number | null = null) {
        isLoading = true;
        error = null;
        try {
            const [allFolders, allItems]: [Folder[], Item[]] = await Promise.all([
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
        folderForEdit = {
            parent_id: currentFolderId,
            is_deleted: 0
        };
        showFolderModal = true;
    }

    function handleAddItem() {
        editModeItem = false;
        itemForEdit = {
            folder_id: currentFolderId || 0,
            is_deleted: 0
        };
        showItemModal = true;
    }

    function handleEditFolder(folder: Folder) {
        editModeFolder = true;
        folderForEdit = {...folder};
        showFolderModal = true;
    }

    function handleEditItem(item: Item) {
        editModeItem = true;
        itemForEdit = {...item};
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
    async function handleFolderSubmit(event: CustomEvent<{ data: Partial<Folder> }>) {
        const folderData = {
            ...event.detail.data,
            parent_id: currentFolderId
        };
        try {

            if (editModeFolder) {
                await apiFetch(`/folders/${folderData.id}`, {
                    method: 'PUT',
                    body: folderData
                });
            } else {
                await apiFetch('/folders', {
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
                ...(data.id && {id: data.id}), // Chỉ thêm id nếu có
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

<!-- Main Layout -->
<div class="flex flex-col min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-500 p-4">
        <div class="flex items-center gap-4">
            <h1 class="text-3xl font-bold text-gray-800">
                {isTrashMode ? "Thùng rác" : currentFolderName}
            </h1>
            <button
                    onclick={toggleTrashMode}
                    class="flex items-center gap-2 px-3 py-2 rounded-lg {isTrashMode ? 'bg-gray-600' : 'bg-gray-100'} hover:bg-gray-200 transition-colors"
                    title={isTrashMode ? "Quay lại" : "Xem thùng rác"}
            >
                <svg class="w-5 h-5 {isTrashMode ? 'text-white' : 'text-gray-600'}" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                </svg>
                <span class={isTrashMode ? "text-white" : "text-gray-600"}>
                    {isTrashMode ? "Quay lại" : "Thùng rác"}
                </span>
            </button>
        </div>

        {#if !isTrashMode}
            <div class="flex space-x-4">
                <button
                        onclick={handleAddItem}
                        class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639] transition-colors"
                >
                    Thêm mặt hàng
                </button>
                <button
                        onclick={handleAddFolder}
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
                    onclick={() => fetchData(currentFolderId)}
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
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {#each deletedFolders as folder (folder.id)}
                                <!-- Deleted Folder Item -->
                                <div class="relative group">
                                    <Folders {folder}/>
                                    <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button aria-label="restore-folder"
                                                onclick={() => handleRestore('folder', folder.id)}
                                                class="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                                title="Khôi phục">
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                 viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M12 3v13m0-13 4 4m-4-4-4 4"/>
                                            </svg>
                                        </button>
                                        <button aria-label="permanently-delete-folder"
                                                onclick={() => handlePermanentDelete('folder', folder.id)}
                                                class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                title="Xóa vĩnh viễn"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                 viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M6 18L18 6M6 6l12 12"/>
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
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {#each deletedItems as item (item.id)}
                                <!-- Deleted Item -->
                                <div class="relative group">
                                    <Items {...item}/>
                                    <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button aria-label="restore-item"
                                                onclick={() => handleRestore('item', item.id)}
                                                class="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                                title="Khôi phục">
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                 viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M12 3v13m0-13 4 4m-4-4-4 4"/>
                                            </svg>
                                        </button>
                                        <button aria-label="permanently-delete-item"
                                                onclick={() => handlePermanentDelete('item', item.id)}
                                                class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                title="Xóa vĩnh viễn"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                 viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M6 18L18 6M6 6l12 12"/>
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
            <NotFoundData fetchData={() => fetchData(currentFolderId)}/>
        {:else}
            <div class="p-4">
                {#if folders.length > 0}
                    <div class="flex flex-col gap-3">
                        <h2 class="text-[#00205B] text-2xl">Thư mục:</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {#each paginatedFolders as folder (folder.id)}
                                <!-- Normal Folder Item -->
                                <div class="relative group">
                                    <Folders {folder}/>
                                    <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button aria-label="edit-folder"
                                                onclick={() => handleEditFolder(folder)}
                                                class="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                                        >
                                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                 fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                            </svg>
                                        </button>
                                        <button aria-label="open-tag-folder"
                                                onclick={() => handleOpenTags('folder', folder)}
                                                class="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                                title="Quản lý tags"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                 viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M3 8v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8M3 8l8.2-7.6a1 1 0 0 1 1.6 0L21 8M3 8h18"/>
                                            </svg>
                                        </button>
                                        <button aria-label="delete-folder"
                                                onclick={() => handleDelete('folder', folder.id)}
                                                class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                 fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
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
                {/if}

                {#if items.length > 0}
                    <div class="flex flex-col gap-3 mt-10">
                        <h2 class="text-[#00205B] text-2xl">Mặt hàng:</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {#each paginatedItems as item (item.id)}
                                <!-- Normal Item -->
                                <div class="relative group">
                                    <Items {...item}/>
                                    <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button aria-label="edit-item"
                                                onclick={() => handleEditItem(item)}
                                                class="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                                        >
                                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                 fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                            </svg>
                                        </button>
                                        <button aria-label="open-item"
                                                onclick={() => handleOpenTags('item', item)}
                                                class="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                                title="Quản lý tags"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                 viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M3 8v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8M3 8l8.2-7.6a1 1 0 0 1 1.6 0L21 8M3 8h18"/>
                                            </svg>
                                        </button>
                                        <button aria-label="open-supplier-item"
                                                onclick={() => handleOpenSupplier(item)}
                                                class="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                                title="Chọn supplier"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                 viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M12 6v13m0-13 4 4m-4-4-4 4"/>
                                            </svg>
                                        </button>
                                        <button
                                                aria-label="delete-item"
                                                onclick={() => handleDelete('item', item.id)}
                                                class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                 fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
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
                {/if}
            </div>
        {/if}
    {/if}
</div>

<!-- Modals -->
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