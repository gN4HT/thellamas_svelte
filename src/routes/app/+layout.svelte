<script lang="ts">
    import {page} from "$app/state";
    import {onMount} from "svelte";

    import {goto} from "$app/navigation";

    let {children} = $props();

    onMount(() => {
        if (!localStorage.getItem("token")) {
            goto('/web/login');
        }
    });
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
          Quy trình làm việc
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
  
      <div class="pb-[180px]"></div>
  
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
    "
  >
    {@render children()}
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