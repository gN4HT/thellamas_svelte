<script>
  import {page} from '$app/stores';
  import {derived} from 'svelte/store';
  import {onMount} from 'svelte';

  // Danh sách báo cáo
  let reports = [
      {name: "Lịch sử hoạt động", icon: "fa-clock-rotate-left", path: "/app/reports/activeHistory"},
      {name: "Tóm tắt hàng tồn kho", icon: "fa-layer-group", path: "/app/reports/inventorySummary"},
      {name: "Quá trình xử lý sản phẩm", icon: "fa-chart-simple", path: "/app/reports/productProcessing"},
  ];

  // Đường dẫn hiện tại (reactive)
  let currentPath = derived(page, $page => $page.url.pathname);

  // Responsive state
  let isSidebarOpen = true;
  let isMobile = false;

  function checkMobile() {
    isMobile = window.innerWidth < 768;
    if (isMobile) {
      isSidebarOpen = false;
    }
  }

  onMount(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });
</script>

<style>
    .report-item.active {
        background-color: #f3f4f6;
        color: #00205B;
        font-weight: bold;
    }

    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 30;
        }

        .sidebar.open {
            transform: translateX(0);
        }

        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 25;
        }

        .overlay.open {
            display: block;
        }
    }
</style>

<div class="flex w-full h-screen bg-gray-100">
    <!-- Mobile Toggle Button -->
    <button 
        class="fixed top-4 left-[110px] z-40 md:hidden bg-white p-2 rounded-lg shadow-lg"
        on:click={() => isSidebarOpen = !isSidebarOpen}
    >
        <i class="fas fa-bars text-gray-700"></i>
    </button>

    <!-- Overlay for mobile -->
    <div class="overlay" class:open={isSidebarOpen && isMobile}></div>

    <!-- Sidebar -->
    <div class="sidebar w-[250px] bg-white p-4 border-r border-gray-300 fixed h-full" class:open={isSidebarOpen}>
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
                        on:click={() => isMobile && (isSidebarOpen = false)}
                >
                    <span class="mr-2 text-xl"><i class="fa-solid {report.icon}"></i></span>
                    {report.name}
                </a>
            {/each}
        </div>
    </div>

    <!-- Nội dung chính -->
    <div class="flex-1 p-4 md:p-6 md:ml-[250px] transition-all duration-300">
        <div class="max-w-[1350px] bg-white p-4 md:p-6 rounded-lg shadow">
            <slot/>
        </div>
    </div>
</div>
