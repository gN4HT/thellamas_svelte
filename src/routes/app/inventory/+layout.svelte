<script lang="ts">
    import {onMount} from "svelte";
    import {page} from '$app/state';
    import {apiFetch} from "$lib/api";
    import FolderTree from "../../../components/FolderTree.svelte";
    import type {Folder} from "../../../models/folder";

    let folders = $state<Folder[]>([]);

    function buildFolderTree(folders, parentId = null) {
        return folders
            .filter(folder => folder.parent_id === parentId)
            .map(folder => ({
            ...folder,
            children: buildFolderTree(folders, folder.id)
            }));
     }
    async function fetchData() {
        try {
            const allFolders: Folder[] = await apiFetch("http://127.0.0.1:8000/api/folders");
            folders = buildFolderTree(allFolders);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    }

    onMount(fetchData);
</script>


<div class="flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-md border-r p-4 overflow-y-auto min-h-[1260px] max-h-[1260px] custom-scrollbar">
        <!-- Thanh tìm kiếm -->
        <div class="mb-6 flex justify-between items-center p-2 border rounded-md">
            <i class="fa-solid fa-magnifying-glass mr-2"></i>
            <input type="text" placeholder="Tìm thư mục" class="w-full border-none outline-none"/>
        </div>

        <!-- Mục "Tất cả mặt hàng" -->
        <div
                class="folder-item flex items-center space-x-2 text-gray-600 hover:text-[#00205b] {(page.url.pathname === '/app/inventory/all') ? 'active' : ''}"
        >
            <a href="/app/inventory/all" class="flex items-center space-x-2 w-full">
                <span class="text-lg"><i class="fa-solid fa-box"></i></span>
                <span>Tất cả mặt hàng</span>
            </a>
        </div>

        <!-- Danh sách thư mục dạng bậc thang -->
            <FolderTree {folders} />
    </div>

    <!-- Nội dung chính -->
    <div class="p-4 w-full">
        <slot/>
    </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
    .folder-item.active {
        color: #00205b;
        font-weight: bold;
    }
</style>
