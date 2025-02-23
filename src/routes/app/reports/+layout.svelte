<script>
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  // Danh sách báo cáo
  let reports = [
    { name: "Lịch sử hoạt động", icon: "fa-clock-rotate-left", path: "/app/reports/activeHistory" },
    { name: "Tóm tắt hàng tồn kho", icon: "fa-layer-group", path: "/app/reports/inventorySummary" },
    { name: "Giao dịch", icon: "fa-repeat", path: "/app/reports/transactions" },
    { name: "Quá trình xử lý sản phẩm", icon: "fa-chart-simple", path: "/app/reports/productProcessing" },
    { name: "Tổng kết chuyển đổi", icon: "fa-folder-tree", path: "/app/reports/conversionSummary" },
    { name: "Tóm tắt hoạt động của người dùng", icon: "fa-users", path: "/app/reports/userActivity" }
  ];

  // Đường dẫn hiện tại (reactive)
  let currentPath = derived(page, $page => $page.url.pathname);
</script>

<style>
  .report-item.active {
    background-color: #f3f4f6;
    color: #00205B;
    font-weight: bold;
  }
</style>

<div class="flex w-full h-screen bg-gray-100">
  <!-- Sidebar -->
  <div class="w-[250px] bg-white p-4 border-r border-gray-300">
    <div class="flex justify-between items-center border border-gray-300 rounded p-2 mb-4">
      <i class="fa-solid fa-magnifying-glass text-gray-500"></i>
      <input
        type="text"
        placeholder="Tìm kiếm báo cáo"
        class="w-full outline-none border-none pl-2"
      />
    </div>

    <!-- Danh sách báo cáo -->
    <div>
      {#each reports as report}
        <a
          href="{report.path}"
          class="flex items-center p-2 rounded cursor-pointer report-item"
          class:active={$currentPath === report.path}
        >
          <span class="mr-2 text-xl"><i class="fa-solid {report.icon}"></i></span>
          {report.name}
        </a>
      {/each}
    </div>
  </div>

  <!-- Nội dung chính -->
  <div class="flex-1 p-6">
    <div class="max-w-[1350px] bg-white p-6 rounded-lg shadow">
      <slot /> 
    </div>
  </div>
</div>
