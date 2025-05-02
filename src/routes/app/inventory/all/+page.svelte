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
    import { read, utils, writeFile } from 'xlsx';
    import FieldsModal from "../../../../components/FieldsModal.svelte";

    // State Management
    let allFolders: Folder[] = [];
    let allItems: Item[] = [];
    let folders: Folder[] = [];
    let items: Item[] = [];
    let isLoading = false;
    let error: string | null = null;
    let currentFolderId: number | null = null;
    let currentFolderName: string = "Tất cả mặt hàng";
  
    let folderPage = 1;
    let itemPage = 1;
    const itemsPerPage = 8;
    let totalFolders = 0;
    let totalItems = 0;

    // Cache for API data
    let foldersCache = new Map<number | null, Folder[]>();
    let itemsCache = new Map<number | null, Item[]>();

    // Thêm state cho thùng rác
    let isTrashMode = false;
    let deletedItems: Item[] = [];
    let deletedFolders: Folder[] = [];

    // Add these state variables after other state declarations
    let showMoveModal = false;
    let itemToMove: Item | null = null;
    let folderToMove: Folder | null = null;
    let moveModalType: 'folder' | 'item' = 'folder';

    // Add new state variables
    let importFile: File | null = null;
    let importError: string | null = null;
    let isImporting = false;
    let showImportModal = false;

    // Add new state variables after other state declarations
    let showFieldsModal = false;
    let itemForFields: Item | null = null;
    let folderForFields: Folder | null = null;
    let currentModalType: 'folder' | 'item' = 'item';

    // Subscribe to URL changes
    $: {
        const params = new URLSearchParams($page.url.search);
        const folderId = params.get('folder');
        
        if (folderId) { 
            currentFolderId = Number(folderId);
            folderPage = 1;
            itemPage = 1;
            loadDataFromCache(currentFolderId);
        } else {
            currentFolderId = null;
            currentFolderName = "Tất cả mặt hàng";
            folderPage = 1;
            itemPage = 1;
            loadDataFromCache(null);
        }
    }

    // Calculate paginated data
    $: {
        const folderStart = (folderPage - 1) * itemsPerPage;
        const folderEnd = folderStart + itemsPerPage;
        folders = allFolders.slice(folderStart, folderEnd);
        totalFolders = allFolders.length;
    }

    $: {
        const itemStart = (itemPage - 1) * itemsPerPage;
        const itemEnd = itemStart + itemsPerPage;
        items = allItems.slice(itemStart, itemEnd);
        totalItems = allItems.length;
    }
  
    $: totalPrice = items.reduce((total, item) => {
        const price = Number(String(item.price).replace(/[^\d.-]/g, "")) || 0;
        return total + price;
    }, 0);

    // Cache Management
    function loadDataFromCache(folderId: number | null) {
        const cachedFolders = foldersCache.get(folderId);
        const cachedItems = itemsCache.get(folderId);

        if (cachedFolders && cachedItems) {
            allFolders = cachedFolders;
            allItems = cachedItems;
            if (folderId) {
                const folder = cachedFolders.find(f => f.id === folderId);
                if (folder) currentFolderName = folder.name;
            }
        } else {
            fetchData(folderId);
        }
    }

    function updateCache(folderId: number | null, newFolders: Folder[], newItems: Item[]) {
        foldersCache.set(folderId, newFolders);
        itemsCache.set(folderId, newItems);
    }

    function clearCache() {
        foldersCache.clear();
        itemsCache.clear();
    }

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
    async function fetchFolders(folderId: number | null = null) {
        try {
            const response = await apiFetch('/folders');
            const filteredFolders = folderId 
                ? response.filter(folder => folder.parent_id === folderId && folder.is_deleted !== 1)
                : response.filter(folder => folder.is_deleted !== 1);
            return filteredFolders;
        } catch (err) {
            error = err.message || "Không thể tải folders. Vui lòng thử lại sau.";
            return [];
        }
    }

    async function fetchItems(folderId: number | null = null) {
        try {
            const response = await apiFetch('/items');
            console.log('Raw API Response:', response); // Debug log
            
            // Transform response to ensure proper data types
            const transformedResponse = response.map(item => ({
                ...item,
                quantity: Number(item.quantity),
                stock_level: Number(item.stock_level),
                price: Number(item.price)
            }));
            
            console.log('Transformed Response:', transformedResponse); // Debug log
            
            const filteredItems = folderId 
                ? transformedResponse.filter(item => item.folder_id === folderId && item.is_deleted !== 1)
                : transformedResponse.filter(item => item.is_deleted !== 1);
                
            console.log('Filtered Items:', filteredItems); // Debug log
            return filteredItems;
        } catch (err) {
            error = err.message || "Không thể tải items. Vui lòng thử lại sau.";
            return [];
        }
    }

    async function fetchData(folderId: number | null = null) {
        isLoading = true;
        error = null;
        try {
            const [newFolders, newItems] = await Promise.all([
                fetchFolders(folderId),
                fetchItems(folderId)
            ]);

            allFolders = newFolders;
            allItems = newItems;
            updateCache(folderId, newFolders, newItems);

            if (folderId) {
                const currentFolder = newFolders.find(f => f.id === folderId);
                if (currentFolder) {
                    currentFolderName = currentFolder.name;
                }
            }
        } catch (err) {
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

            // Fetch all folders and update the store
            const allFolders = await apiFetch("/folders");
            folderStore.set(allFolders);

            // Clear cache and refresh current view
            clearCache();
            await fetchData(currentFolderId);
            showFolderModal = false;
        } catch (error) {
            alert(error.message || "Có lỗi xảy ra khi lưu thư mục. Vui lòng thử lại.");
        }
    }

    async function handleItemSubmit(event: CustomEvent<{ formData: FormData, isEdit: boolean, itemId: number }>) {
        if (isLoading) return;
        isLoading = true;

        try {
            const { formData, isEdit, itemId } = event.detail;
            
            let endpoint = '/items';
            if (isEdit && itemId) {
                endpoint = `/items/${itemId}`;
                formData.append('_method', 'PUT');
            }

            const response = await apiFetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            if (!response) {
                throw new Error('Failed to save item');
            }

            // Update only the affected folder's items in cache
            const folderId = currentFolderId;
            const newItems = await fetchItems(folderId);
            itemsCache.set(folderId, newItems);
            allItems = newItems;
            
            showItemModal = false;
            itemForEdit = {};
        } catch (error) {
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

    // Update page change handler
    function handlePageChange(type: 'folder' | 'item', direction: 'next' | 'prev') {
        if (type === 'folder') {
            if (direction === 'next' && folderPage * itemsPerPage < totalFolders) {
                folderPage++;
            } else if (direction === 'prev' && folderPage > 1) {
                folderPage--;
            }
        } else {
            if (direction === 'next' && itemPage * itemsPerPage < totalItems) {
                itemPage++;
            } else if (direction === 'prev' && itemPage > 1) {
                itemPage--;
            }
        }
    }

    // Add new functions for Excel handling
    async function handleExportExcel() {
        try {
            console.log('Items before export:', allItems); // Debug log
            
            // Prepare data for export with proper type conversion
            const exportData = allItems.map(item => {
                const stockLevel = typeof item.stock_level === 'number' ? item.stock_level : 
                                 typeof item.stock_level === 'string' ? parseInt(item.stock_level) : 0;
                                 
                console.log('Processing item:', {
                    name: item.name,
                    quantity: item.quantity,
                    stock_level: item.stock_level,
                    parsed_stock_level: stockLevel,
                    price: item.price
                });
                
                return {
                    'Tên sản phẩm': item.name || '',
                    'Số lượng': typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 0,
                    'Mức tồn kho': stockLevel,
                    'Giá': typeof item.price === 'number' ? item.price : parseInt(item.price) || 0
                };
            });

            console.log('Final export data:', exportData); // Debug log

            // Create workbook and worksheet
            const ws = utils.json_to_sheet(exportData);
            
            // Set column widths
            const wscols = [
                {wch: 30}, // Tên sản phẩm
                {wch: 10}, // Số lượng
                {wch: 12}, // Mức tồn kho
                {wch: 15}  // Giá
            ];
            ws['!cols'] = wscols;

            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, "Items");

            // Generate Excel file
            writeFile(wb, `items_export_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Error exporting Excel:', error);
            alert('Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại.');
        }
    }

    async function downloadTemplate() {
        try {
            // Create sample data for template
            const templateData = [
                {
                    'Tên sản phẩm': 'Ví dụ: Laptop Dell XPS 13',
                    'Số lượng': 10,
                    'Mức tồn kho': 5,
                    'Giá': 25000000
                }
            ];

            // Create workbook and worksheet
            const ws = utils.json_to_sheet(templateData);
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, "Mẫu");

            // Generate Excel file
            writeFile(wb, 'mau_nhap_du_lieu.xlsx');
        } catch (error) {
            console.error('Error creating template:', error);
            alert('Có lỗi xảy ra khi tạo mẫu Excel. Vui lòng thử lại.');
        }
    }

    async function handleImportExcel(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = utils.sheet_to_json<Record<string, any>>(firstSheet);

                // Validate required columns
                const requiredColumns = ['Tên sản phẩm', 'Số lượng', 'Giá', 'Mức tồn kho'];
                const firstRow = jsonData[0];
                const missingColumns = requiredColumns.filter(col => !(col in firstRow));

                if (missingColumns.length > 0) {
                    alert(`Thiếu các cột bắt buộc: ${missingColumns.join(', ')}`);
                    return;
                }

                // Process each row
                for (const row of jsonData) {
                    const formData = new FormData();
                    formData.append('name', row['Tên sản phẩm']);
                    formData.append('quantity', row['Số lượng']);
                    formData.append('price', row['Giá']);
                    formData.append('stock_level', row['Mức tồn kho']);
                    if (currentFolderId) {
                        formData.append('folder_id', currentFolderId.toString());
                    }

                    await apiFetch('/items', {
                        method: 'POST',
                        body: formData
                    });
                }

                // Refresh data after import
                await fetchData(currentFolderId);
                alert('Import thành công!');
            } catch (error) {
                console.error('Lỗi khi import:', error);
                alert('Có lỗi xảy ra khi import. Vui lòng kiểm tra lại file.');
            }
        };

        reader.readAsArrayBuffer(file);
    }

    // Add new handler function after other handlers
    function handleOpenFields(item: Item) {
        itemForFields = item;
        showFieldsModal = true;
    }

    onMount(() => {
        loadDataFromCache(null);
    });
</script>
  
<!-- Main Layout -->
<div class="flex flex-col min-h-screen">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-500 p-4 gap-4">
        <div class="flex items-center gap-4 sm:flex-wrap">
            <h1 class="text-2xl sm:text-xl font-bold text-gray-800 whitespace-nowrap sm:w-full">
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
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <button 
                    on:click={handleExportExcel}
                    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors w-full sm:w-auto"
                >
                    Xuất Excel
                </button>
                <button
                    on:click={downloadTemplate}
                    class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors w-full sm:w-auto"
                >
                    Tải mẫu Excel
                </button>
                <label class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full sm:w-auto cursor-pointer">
                    Nhập Excel
                    <input type="file" accept=".xlsx,.xls" on:change={handleImportExcel} class="hidden" />
                </label>
                <button 
                    on:click={handleAddItem}
                    class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639] transition-colors w-full sm:w-auto"
                >
                    Thêm mặt hàng
                </button>
                <button 
                    on:click={handleAddFolder}
                    class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639] transition-colors w-full sm:w-auto"
                >
                    Thêm thư mục
                </button>
            </div>
        {/if}
    </div>
    
    <!-- Statistics -->
    <div class="p-4 mt-4 flex flex-wrap gap-4 sm:gap-6 text-gray-700">
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
        <div class="p-4 bg-red-100 text-red-700 rounded-lg mb-4 mx-4">
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
                        <h2 class="text-[#00205B] text-xl sm:text-2xl mb-4">Thư mục đã xóa:</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {#each deletedFolders as folder (folder.id)}
                                <!-- Deleted Folder Item -->
                                <div class="relative group">
                                    <Folders {folder} />
                                    <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            aria-label="Khôi phục"
                                            on:click={() => handleRestore('folder', folder.id)}
                                            class="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                            title="Khôi phục"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v13m0-13 4 4m-4-4-4 4"/>
                                            </svg>
                                        </button>
                                        <button 
                                            aria-label="Xóa vĩnh viễn"
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
                        <h2 class="text-[#00205B] text-xl sm:text-2xl mb-4">Mặt hàng đã xóa:</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {#each deletedItems as item (item.id)}
                                <!-- Deleted Item -->
                                <div class="relative group">
                                    <Items {...item} />
                                    <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            aria-label="Khôi phục"
                                            on:click={() => handleRestore('item', item.id)}
                                            class="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                            title="Khôi phục"
                                        >
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v13m0-13 4 4m-4-4-4 4"/>
                                            </svg>
                                        </button>
                                        <button 
                                            aria-label="Xóa vĩnh viễn"
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
                        <h2 class="text-[#00205B] text-xl sm:text-2xl">Thư mục:</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {#each folders as folder (folder.id)}
                                <!-- Normal Folder Item -->
                                <div class="relative group">
                                    <Folders {folder} />
                                    {#if canEdit}
                                        <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                aria-label="Chỉnh sửa"
                                                on:click={() => handleEditFolder(folder)}
                                                class="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                                            >
                                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                                </svg>
                                            </button>
                                            <button 
                                                aria-label="Quản lý tags"
                                                on:click={() => handleOpenTags('folder', folder)}
                                                class="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                                title="Quản lý tags"
                                            >
                                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8M3 8l8.2-7.6a1 1 0 0 1 1.6 0L21 8M3 8h18"/>
                                                </svg>
                                            </button>
                                            <button 
                                                aria-label="Xóa"
                                                on:click={() => handleDelete('folder', folder.id)}
                                                class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                                </svg>
                                            </button>
                                            <button 
                                                aria-label="Di chuyển thư mục"
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
                            totalItems={totalFolders} 
                            bind:currentPage={folderPage}
                            itemsPerPage={itemsPerPage}
                            on:next={() => handlePageChange('folder', 'next')}
                            on:prev={() => handlePageChange('folder', 'prev')}
                        />
                    </div>
                {/if}
        
                {#if items.length > 0}
                    <div class="flex flex-col gap-3 mt-6 sm:mt-10">
                        <h2 class="text-[#00205B] text-xl sm:text-2xl">Mặt hàng:</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {#each items as item (item.id)}
                                <!-- Normal Item -->
                                <div class="relative group">
                                    <Items {...item} />
                                    {#if canEdit}
                                        <div class="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                aria-label="Chỉnh sửa"
                                                on:click={() => handleEditItem(item)}
                                                class="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                                            >
                                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                                </svg>
                                            </button>
                                            <button 
                                                aria-label="Quản lý tags"
                                                on:click={() => handleOpenTags('item', item)}
                                                class="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                                title="Quản lý tags"
                                            >
                                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8M3 8l8.2-7.6a1 1 0 0 1 1.6 0L21 8M3 8h18"/>
                                                </svg>
                                            </button>
                                            <button 
                                                aria-label="Chọn supplier"
                                                on:click={() => handleOpenSupplier(item)}
                                                class="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                                title="Chọn supplier"
                                            >
                                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v13m0-13 4 4m-4-4-4 4"/>
                                                </svg>
                                            </button>
                                            <button 
                                                aria-label="Di chuyển mặt hàng"
                                                on:click={() => handleMoveItem(item)}
                                                class="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                                                title="Di chuyển mặt hàng"
                                            >
                                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0-4-4m4 4-4 4m0 6H4m0 0 4 4m-4-4 4-4"/>
                                                </svg>
                                            </button>
                                            <button 
                                                aria-label="Quản lý fields"
                                                on:click={() => handleOpenFields(item)}
                                                class="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
                                                title="Quản lý fields"
                                            >
                                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
                                                </svg>
                                            </button>
                                            <button 
                                                aria-label="Xóa"
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
                            totalItems={totalItems}
                            bind:currentPage={itemPage}
                            itemsPerPage={itemsPerPage}
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

    <!-- Add Import Modal -->
    {#if showImportModal}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 class="text-xl font-bold mb-4">Nhập dữ liệu từ Excel</h2>
                {#if importError}
                    <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {importError}
                    </div>
                {/if}
                <p class="mb-4">File Excel phải chứa các cột sau:</p>
                <ul class="list-disc pl-4 mb-4">
                    <li>Tên sản phẩm (bắt buộc)</li>
                    <li>Số lượng (bắt buộc)</li>
                    <li>Mức tồn kho (bắt buộc)</li>
                    <li>Giá (bắt buộc)</li>
                </ul>
                <p class="text-sm text-gray-600 mb-4">
                    Bạn có thể tải mẫu Excel để xem cấu trúc file cần nhập.
                </p>
                <div class="flex justify-end gap-4">
                    <button 
                        on:click={() => {
                            showImportModal = false;
                            importError = null;
                            importFile = null;
                        }}
                        class="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Hủy
                    </button>
                    <label class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer">
                        Chọn file
                        <input type="file" accept=".xlsx,.xls" on:change={handleImportExcel} class="hidden" />
                    </label>
                </div>
            </div>
        </div>
    {/if}

    <!-- Add FieldsModal -->
    <FieldsModal
        bind:showModal={showFieldsModal}
        id={itemForFields?.id}
        type="item"
        currentFields={itemForFields?.fields?.map(f => f.id) || []}
        on:success={() => {
            fetchData(currentFolderId);
            showFieldsModal = false;
            itemForFields = null;
        }}
    />
{/if}