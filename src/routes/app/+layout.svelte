<script>
  import { page } from "$app/stores";
</script>

<!-- Sidebar -->
<aside
  class="w-[230px] bg-[#00205b] fixed top-0 left-0 h-screen transition-all duration-300"
>
  <div class="flex justify-center items-center py-5">
    <img src="/img/2.png" alt="Logo" />
  </div>
  <div class="px-2 pb-5 space-y-2">
    <a
      href="dashboard"
      class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item" class:active={$page.url.pathname === "/app/dashboard"}
    >
      <img src="/img/Items.png" alt="Dashboard Icon" />
      <span class="ml-3 text-white text-sm">Bảng điều khiển</span>
    </a>
    <a
      href="items"
      class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item" class:active={$page.url.pathname === "/app/items"}
    >
      <img src="/img/Items (1).png" alt="Items Icon" />
      <span class="ml-3 text-white text-sm">Mặt hàng</span>
    </a>
    <a
      href="search"
      class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item" class:active={$page.url.pathname === "/app/search"}
    >
      <img src="/img/Items (2).png" alt="Search Icon" />
      <span class="ml-3 text-white text-sm">Tìm kiếm</span>
    </a>
    <a
      href="tags"
      class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item" class:active={$page.url.pathname === "/app/tags"}
    >
      <img src="/img/Items (3).png" alt="Tags Icon" />
      <span class="ml-3 text-white text-sm">Các thẻ Tag</span>
    </a>
    <a
      href="workflows"
      class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item" class:active={$page.url.pathname === "/app/workflows"}
    >
      <img src="/img/Frame 87.png" alt="Workflows Icon" class="ml-1" />
      <span class="ml-3 text-white text-sm">Quy trình làm việc</span>
    </a>

    <a
      href="reports"
      class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item" class:active={$page.url.pathname === "/app/reports"}
    >
      <img src="/img/Items (4).png" alt="Reports Icon" />
      <span class="ml-3 text-white text-sm">Báo cáo</span>
    </a>
    <div class="pb-[180px]"></div>
    <a
      href="productnews"
      class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item" class:active={$page.url.pathname === "/app/productnews"}
    >
      <img src="/img/Items (5).png" alt="Product News Icon" />
      <span class="ml-3 text-white text-sm">Tin tức sản phẩm</span>
    </a>
    <a
      href="help"
      class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item" class:active={$page.url.pathname === "/app/help"}
    >
      <img src="/img/Items (6).png" alt="Help Icon" />
      <span class="ml-3 text-white text-sm">Trợ giúp</span>
    </a>
    <a
      href="notification"
      class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item" class:active={$page.url.pathname === "/app/notification"}
    >
      <img src="/img/Items (7).png" alt="Notifications Icon" />
      <span class="ml-3 text-white text-sm">Thông báo</span>
    </a>
    <a
      href="settings"
      class="flex items-center px-3 py-2 rounded-xl cursor-pointer sidebar-item" class:active={$page.url.pathname === "/app/settings"}
    >
      <img src="/img/Items (8).png" alt="Settings Icon" />
      <span class="ml-3 text-white text-sm">Thiết lập</span>
    </a>
  </div>
</aside>

<!-- Main content -->
<main class="ml-[240px]">
    <slot />
</main>

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
  font-family: "PoppinsRegular";
  font-size: 14px;
}
.sidebar-item.active {
    background-color: rgba(255, 255, 255, 0.1);
  }
</style>