<script lang="ts">
    import { onMount } from "svelte";
    import { page } from '$app/stores';
    import { apiFetch } from "$lib/api";
    import FolderTree from "../../../components/FolderTree.svelte";
    import type { Folder } from "../../../models/folder";
    import { folderStore } from '../../../stores/folderStore';

    let folders: Folder[] = [];

    function buildFolderTree(folders: Folder[], parentId = null) {
        return folders
            .filter(folder => folder.parent_id === parentId && folder.is_deleted !== 1)
            .map(folder => ({
                ...folder,
                children: buildFolderTree(folders, folder.id)
            }));
    }

    async function fetchData() {
        try {
            const allFolders = await apiFetch("/folders");
            const treeData = buildFolderTree(allFolders);
            folders = treeData;
            folderStore.set(allFolders); // Cập nhật store
            console.log('Fetched folders:', folders);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    }

    // Subscribe to folderStore changes
    folderStore.subscribe(allFolders => {
        if (allFolders.length > 0) {
            folders = buildFolderTree(allFolders);
        }
    });

    $: currentPath = $page.url.pathname;
    $: currentFolderId = new URLSearchParams($page.url.search).get('folder');

    onMount(() => {
        fetchData();
    });
</script>

<div class="flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-md border-r p-4 overflow-auto min-h-[1260px] max-h-[1260px] custom-scrollbar">
        <!-- Thanh tìm kiếm -->
        <div class="mb-6 flex justify-between items-center p-2 border rounded-md">
            <i class="fa-solid fa-magnifying-glass mr-2"></i>
            <input 
                type="text" 
                placeholder="Tìm thư mục" 
                class="w-full border-none outline-none"
            />
        </div>

        <!-- Mục "Tất cả mặt hàng" -->
        <div class="folder-item flex items-center space-x-2 text-gray-600 hover:text-[#00205b] {currentPath === '/app/inventory/all' && !currentFolderId ? 'active' : ''}">
            <a href="/app/inventory/all" class="flex items-center space-x-2 w-full p-1 rounded hover:bg-gray-100">
                <span class="text-lg"><i class="fa-solid fa-box"></i></span>
                <span>Tất cả mặt hàng</span>
            </a>
        </div>

        <!-- Danh sách thư mục -->
        {#if folders.length > 0}
            <FolderTree {folders} />
        {:else}
            <div class="text-gray-500 text-center py-4">
                Chưa có thư mục nào
            </div>
        {/if}
    </div>

    <!-- Nội dung chính -->
    <div class="flex-1 p-4 bg-gray-50">
        <slot/>
    </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 5px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    .folder-item.active {
        color: #00205b;
        font-weight: bold;
    }

    .folder-item a {
        text-decoration: none;
        transition: all 0.2s;
    }

    .folder-item a:hover {
        background-color: rgba(0, 32, 91, 0.1);
    }
</style>
