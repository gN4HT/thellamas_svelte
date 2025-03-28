<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    
    export let folders: { id: number; name: string; children?: any[] }[] = [];
    export let level: number = 1;
  
    // Trạng thái ẩn/hiện của từng thư mục
    let expanded: { [key: number]: boolean } = {};
    
    // Hàm toggle trạng thái expanded
    function toggleExpand(id: number) {
      expanded[id] = !expanded[id];
    }

    // Hàm xử lý click vào folder
    async function handleFolderClick(event: MouseEvent, folderId: number) {
        event.preventDefault();
        await goto(`/app/inventory/all?folder=${folderId}`, {
            keepfocus: true,
            noScroll: true,
            replaceState: true
        });
    }

    // Kiểm tra folder hiện tại
    $: currentFolderId = new URLSearchParams($page.url.search).get('folder');
</script>
  
{#each folders as folder}
    <div style="margin-left: {level === 1 ? '15px' : level * 10 + 'px'}" class="my-2">
        <div class="flex items-center">
            {#if folder.children && folder.children.length > 0}
                <button 
                    class="toggle-btn mr-2" 
                    on:click={() => toggleExpand(folder.id)}
                    aria-label="Toggle folder"
                >
                    {expanded[folder.id] ? '-' : '+'}
                </button>
            {/if}
            
            <button 
                class="text-[#4A5565] folder-item flex items-center w-full text-left {currentFolderId === String(folder.id) ? 'active' : ''}"
                on:click={(e) => handleFolderClick(e, folder.id)}
            >
                <i class="fa-solid fa-folder-open mr-1"></i>
                {folder.name}
            </button>
        </div>

        {#if folder.children && folder.children.length > 0 && expanded[folder.id]}
            <svelte:self folders={folder.children} level={level + 1} />
        {/if}
    </div>
{/each}
  
<style>
    .folder-item.active {
        color: #00205b;
        font-weight: bold;
    }

    .folder-item {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    .folder-item:hover {
        background-color: rgba(0, 32, 91, 0.1);
    }

    .toggle-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        color: #555;
        padding: 4px;
        border-radius: 4px;
    }

    .toggle-btn:hover {
        color: #000;
        background-color: rgba(0, 0, 0, 0.1);
    }
</style>
  