<script>
    import {page} from '$app/stores';
    import {goto} from "$app/navigation";
    import {onMount, onDestroy} from "svelte";

    // Danh sách menu
    const menuItems = [
        {path: "/app/settings", icon: "fa-user", label: "Hồ sơ người dùng"},
        {path: "/app/settings/userInventory", icon: "fa-user", label: "Quản lý thành viên"},
    ];

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
    });

    onDestroy(() => {
        window.removeEventListener('resize', checkMobile);
    });

    function logout() {
        localStorage.removeItem("token");
        goto("/web/login");
    }

    function goToWeb() {
        goto("/web");
    }
</script>

<style>
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

        .main-content {
            margin-left: 0;
            width: 100%;
        }
    }

    .setting-item.active {
        color: #00205b;
    }
</style>

<div class="flex">
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
    <div class="sidebar w-[250px] h-screen bg-white shadow-lg rounded-lg p-4 fixed border-r border-gray-300" class:open={isSidebarOpen}>
        <h2 class="text-2xl font-semibold pb-3 border-b border-gray-300">Cài đặt</h2>
        <ul class="space-y-6 mt-8">
            {#each menuItems as item}
                <li>
                    <a href="{item.path}"
                       class="flex items-center space-x-2 text-gray-700 hover:text-[#00205b] text-base setting-item {($page.url.pathname === item.path) ? 'active' : ''}"
                       on:click={() => isMobile && (isSidebarOpen = false)}>
                        <i class="fa-solid {item.icon}"></i>
                        <span>{item.label}</span>
                    </a>
                </li>
            {/each}
            <li>
                <button on:click={goToWeb} class="w-full bg-[#00205b] text-white px-4 py-2 rounded hover:bg-white hover:text-[#00205b] border border-[#00205b] transition-colors duration-200">
                    <i class="fa-solid fa-globe mr-2"></i>
                    Quay lại trang web
                </button>
            </li>
            <li>
                <button on:click={logout} class="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-white hover:text-red-500 border border-red-500 transition-colors duration-200">
                    Đăng xuất
                </button>
            </li>
        </ul>
    </div>

    <!-- Nội dung -->
    <div class="main-content ml-[250px] w-full p-4 md:p-6 transition-all duration-300">
        <slot/>
    </div>
</div>
