<script lang="ts">
    import { page } from '$app/state';
    
    export let folders: { id: number; name: string; children?: any[] }[] = [];
    export let level: number = 1;
  
    // Trạng thái ẩn/hiện của từng thư mục
    let expanded: { [key: number]: boolean } = {};
    
    // Hàm toggle trạng thái expanded
    function toggleExpand(id: number) {
      expanded[id] = !expanded[id];
    }
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
        
        <a href="/app/inventory/folder/{folder.id}" class="text-[#4A5565] folder-item flex items-center w-full {(page.url.pathname === '/app/inventory/folder/' + folder.id) ? 'active' : ''}">
          <i class="fa-solid fa-folder-open mr-1"></i>
          {folder.name}
        </a>
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
  
    .toggle-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: #555;
    }
  
    .toggle-btn:hover {
      color: #000;
    }
  </style>
  