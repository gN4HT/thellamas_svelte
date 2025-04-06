<script lang="ts">
    import {page} from "$app/state";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import { apiFetch } from "$lib/api";

    let {children} = $props();
    let showInventoryMenu = $state(false);
    let inventories = $state([]);
    let isLoading = $state(false);

    function getRoleInVietnamese(role: string): string {
        switch (role) {
            case 'owner':
                return 'Chủ kho';
            case 'staff':
                return 'Nhân viên';
            case 'viewer':
                return 'Khách';
            default:
                return role;
        }
    }

    onMount(async () => {
        if (!localStorage.getItem("token")) {
            goto('/web/login');
        }
        await fetchInventories();
    });

    async function fetchInventories() {
        try {
            const response = await apiFetch('/list_inventories');
            console.log('Response:', response);
            inventories = response.data;
            console.log('Inventories:', inventories);
        } catch (error) {
            console.error('Error fetching inventories:', error);
        }
    }

    async function switchInventory(inventoryId: number) {
        isLoading = true;
        try {
            const formData = new FormData();
            formData.append('new_inventory_id', String(inventoryId));
            
            const response = await apiFetch('/inventories/switch', {
                method: 'POST',
                body: formData
            });

            // Lưu token mới vào localStorage
            if (response.access_token) {
                localStorage.setItem('token', response.access_token);
            }

            // Reload page after switching
            window.location.reload();
        } catch (error) {
            console.error('Error switching inventory:', error);
            alert('Không thể chuyển đổi kho. Vui lòng thử lại.');
        } finally {
            isLoading = false;
            showInventoryMenu = false;
        }
    }
</script>

<div class="relative flex">
    <!-- Sidebar -->
    <aside
      class="
        group
        w-[90px] hover:w-[230px]   
        bg-[#00205b]
        h-screen
        transition-all duration-300
        overflow-hidden
        flex-none                
      "
    >
      <div class="flex justify-center items-center py-5">
        <img src="/img/2.png" alt="Logo" />
      </div>
      <div class="px-2 pb-5 space-y-2">
        <a
        href="/app"
        class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item transition-colors hover:bg-[#00307b]/50"
        class:active={page.url.pathname === "/app"}
      >
        <img src="/img/Items.png" alt="Dashboard Icon"/>
        <span
          class="ml-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          Bảng điều khiển
        </span>
      </a>
  
      <a
        href="/app/inventory/all"
        class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item transition-colors hover:bg-[#00307b]/50"
        class:active={page.url.pathname.startsWith("/app/inventory")}
      >
        <img src="/img/Items (1).png" alt="Items Icon"/>
        <span
          class="ml-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          Mặt hàng
        </span>
      </a>
  
      <a
        href="/app/search"
        class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item transition-colors hover:bg-[#00307b]/50"
        class:active={page.url.pathname === "/app/search"}
      >
        <img src="/img/Items (2).png" alt="Search Icon"/>
        <span
          class="ml-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          Tìm kiếm
        </span>
      </a>
  
      <a
        href="/app/tags"
        class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item transition-colors hover:bg-[#00307b]/50"
        class:active={page.url.pathname === "/app/tags"}
      >
        <img src="/img/Items (3).png" alt="Tags Icon"/>
        <span
          class="ml-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          Các thẻ Tag
        </span>
      </a>
  
      <a
        href="/app/suppliers"
        class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item transition-colors hover:bg-[#00307b]/50"
        class:active={page.url.pathname === "/app/suppliers"}
      >
        <img src="/img/Frame 87.png" alt="suppliers Icon" class="ml-1"/>    
        <span
          class="ml-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          Nhà cung cấp
        </span>

      </a>

        <a
                href="/app/fields"
                class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item transition-colors hover:bg-[#00307b]/50"
                class:active={page.url.pathname === "/app/fields"}
        >
          <img src="/img/Frame 87.png" alt="fields Icon" class="ml-1"/>
          <span
                  class="ml-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
          >
          Thuộc tính
        </span>
        </a>
  
      <a
        href="/app/reports/activeHistory"
        class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item transition-colors hover:bg-[#00307b]/50"
        class:active={page.url.pathname.startsWith("/app/reports")}
      >
        <img src="/img/Items (4).png" alt="Reports Icon"/>
        <span
          class="ml-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          Báo cáo
        </span>
      </a>
  
      <div class="pb-[120px]"></div>
  
      <a
        href="/app/productnews"
        class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item transition-colors hover:bg-[#00307b]/50"
        class:active={page.url.pathname === "/app/productnews"}
      >
        <img src="/img/Items (5).png" alt="Product News Icon"/>
        <span
          class="ml-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          Tin tức sản phẩm
        </span>
      </a>
  
      <a
        href="/app/help"
        class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item transition-colors hover:bg-[#00307b]/50"
        class:active={page.url.pathname === "/app/help"}
      >
        <img src="/img/Items (6).png" alt="Help Icon"/>
        <span
          class="ml-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          Trợ giúp
        </span>
      </a>
  
      <a
        href="/app/notification"
        class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item transition-colors hover:bg-[#00307b]/50"
        class:active={page.url.pathname === "/app/notification"}
      >
        <img src="/img/Items (7).png" alt="Notifications Icon"/>
        <span
          class="ml-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          Thông báo
        </span>
      </a>
  
      <a
        href="/app/settings"
        class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item transition-colors hover:bg-[#00307b]/50"
        class:active={page.url.pathname.startsWith("/app/settings")}
      >
        <img src="/img/Items (8).png" alt="Settings Icon"/>
        <span
          class="ml-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        >
          Thiết lập
        </span>
      </a>
      </div>
    </aside>
  
    <!-- Main Content -->

    
    <main
    class="
      flex-1                    
      transition-all duration-300 h-screen overflow-y-auto
      relative
    "
  >
    {@render children()}

<!-- Floating Action Button -->
<div class="fixed bottom-6 right-6 z-50">
  <!-- Inventory Menu -->
  {#if showInventoryMenu}
    <div
      class="absolute bottom-1 right-16 space-y-3 transform transition-all duration-300 ease-out origin-right scale-100 opacity-100"
    >
      {#each inventories as inventory}
        <button
          class="w-[250px] bg-[#00205b] text-white px-4 py-2 rounded-full shadow-lg flex flex-col items-center gap-1 hover:bg-[#001639] transition-colors"
          onclick={() => switchInventory(inventory.inventory_id)}
          disabled={isLoading}
        >
          <span class="text-sm font-medium">Mã kho: {inventory.inventory.code}</span>
          <span class="text-xs text-gray-300">Vị trí: {getRoleInVietnamese(inventory.role)}</span>
        </button>
      {/each}
    </div>
  {/if}

  <!-- Main FAB Button -->
  <button
    class="bg-[#00205b] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#001639] transition duration-300"
    onclick={() => showInventoryMenu = !showInventoryMenu}
    disabled={isLoading}
  >
    {#if isLoading}
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    {/if}
  </button>
</div>


  </main>

    
  </div>


<style>
    @import "tailwindcss";

    @font-face {
        font-family: "PoppinsRegular";
        src: url("/fonts/PoppinsRegular.eot");
        src: url("/fonts/PoppinsRegular.eot") format("embedded-opentype"),
        url("/fonts/PoppinsRegular.woff2") format("woff2"),
        url("/fonts/PoppinsRegular.woff") format("woff"),
        url("/fonts/PoppinsRegular.ttf") format("truetype"),
        url("/fonts/PoppinsRegular.svg#PoppinsRegular") format("svg");
        font-display: swap;
    }

    aside, main {
        font-family: "PoppinsRegular", serif;
        font-size: 14px;
    }

    .sidebar-item.active, .sidebar-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .sidebar-item:hover {
        cursor: pointer;
    }
</style>