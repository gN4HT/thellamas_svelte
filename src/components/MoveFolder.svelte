<script lang="ts">
    import { apiFetch } from "$lib/api";
    import type { Folder } from "../models/folder";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let showModal = false;
    export let id: number;
    export let type: 'folder' | 'item';
    export let currentFolderId: number | null = null;

    let folders: Folder[] = [];
    let selectedFolderId: number | null = null;
    let isLoading = false;
    let error: string | null = null;
    let currentFolderName: string = "";
    let itemOrFolderCurrentLocation: string = "";

    async function fetchFolders() {
        isLoading = true;
        try {
            const response = await apiFetch("/folders");
            folders = response.filter((folder: Folder) => folder.id !== id);
            
            if (type === 'folder') {
                // For folders, also filter out children of the current folder
                folders = folders.filter((folder: Folder) => {
                    let parentId = folder.parent_id;
                    while (parentId !== null) {
                        if (parentId === id) return false;
                        const parent = response.find((f: Folder) => f.id === parentId);
                        parentId = parent ? parent.parent_id : null;
                    }
                    return true;
                });

                // Get parent folder name for the folder being moved
                const folderToMove = response.find(f => f.id === id);
                if (folderToMove) {
                    if (folderToMove.parent_id) {
                        const parentFolder = response.find(f => f.id === folderToMove.parent_id);
                        itemOrFolderCurrentLocation = parentFolder ? `Thư mục đang ở trong: ${parentFolder.name}` : 'Thư mục gốc';
                    } else {
                        itemOrFolderCurrentLocation = 'Thư mục đang ở: Thư mục gốc';
                    }
                }
            } else {
                // For items, get current folder info
                const [itemResponse] = await Promise.all([
                    apiFetch(`/items/${id}`)
                ]);
                
                if (itemResponse && itemResponse.folder_id) {
                    const itemFolder = response.find(f => f.id === itemResponse.folder_id);
                    itemOrFolderCurrentLocation = itemFolder ? `Mặt hàng đang ở trong: ${itemFolder.name}` : 'Thư mục gốc';
                } else {
                    itemOrFolderCurrentLocation = 'Mặt hàng đang ở: Thư mục gốc';
                }
            }

            // Get current folder name if currentFolderId exists
            if (currentFolderId) {
                const currentFolder = response.find((f: Folder) => f.id === currentFolderId);
                if (currentFolder) {
                    currentFolderName = currentFolder.name;
                }
            }
        } catch (err) {
            error = err.message;
        } finally {
            isLoading = false;
        }
    }

    async function handleMove() {
        if (!selectedFolderId) return;

        isLoading = true;
        try {
            const endpoint = type === 'folder' 
                ? `/folders/move/${id}`
                : `/items/move/${id}`;
            
            const body = type === 'folder'
                ? { new_parent_id: selectedFolderId }
                : { folder_id: selectedFolderId };

            await apiFetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            // Fetch updated folders after successful move
            const updatedFolders = await apiFetch("/folders");
            
            // Dispatch success with updated folders
            dispatch('success', { folders: updatedFolders });
            showModal = false;
        } catch (err) {
            console.error('Move error:', err);
            error = err.message;
        } finally {
            isLoading = false;
        }
    }

    $: if (showModal) {
        fetchFolders();
    }
</script>

{#if showModal}
<div class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4 text-[#00205b]">Di chuyển {type === 'folder' ? 'thư mục' : 'mặt hàng'}</h2>
        
        {#if error}
            <div class="bg-red-100 text-red-700 p-2 rounded mb-4">
                {error}
            </div>
        {/if}

        {#if itemOrFolderCurrentLocation}
            <div class="mb-2 text-gray-600">
                {itemOrFolderCurrentLocation}
            </div>
        {/if}

        {#if currentFolderName}
            <div class="mb-4 text-gray-600">
                Đang xem thư mục: <span class="font-medium">{currentFolderName}</span>
            </div>
        {/if}

        {#if isLoading}
            <div class="flex justify-center items-center h-32">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00205b]"></div>
            </div>
        {:else}
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Chọn thư mục đích:
                </label>
                <select 
                    bind:value={selectedFolderId}
                    class="w-full p-2 border border-[#DADCFF] rounded"
                >
                    <option value={null}>-- Chọn thư mục --</option>
                    {#each folders as folder}
                        <option value={folder.id}>
                            {folder.name}
                        </option>
                    {/each}
                </select>
            </div>

            <div class="flex justify-end gap-2">
                <button
                    on:click={() => showModal = false}
                    class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                    Hủy
                </button>
                <button
                    on:click={handleMove}
                    disabled={!selectedFolderId || isLoading}
                    class="px-4 py-2 bg-[#00205b] text-white rounded hover:bg-[#001639] disabled:opacity-50"
                >
                    Di chuyển
                </button>
            </div>
        {/if}
    </div>
</div>
{/if}
