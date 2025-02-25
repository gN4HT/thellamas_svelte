<script>
    import { page } from '$app/stores';

    // Danh sách menu
    const menuItems = [
        { path: "/app/settings", icon: "fa-user", label: "Hồ sơ người dùng" },
        { path: "/app/settings/preferences", icon: "fa-gear", label: "Cài đặt" },
        { path: "/app/settings/company", icon: "fa-briefcase", label: "Thông tin công ty" },
        { path: "/app/settings/planBill", icon: "fa-credit-card", label: "Kế hoạch & Thanh toán" }
    ];
</script>

<div class="flex">
    <!-- Sidebar -->
    <div class="w-[250px] h-screen bg-white shadow-lg rounded-lg p-4 fixed border-r border-gray-300">
        <h2 class="text-2xl font-semibold pb-3 border-b border-gray-300">Cài đặt</h2>
        <ul class="space-y-6 mt-8">
            {#each menuItems as item}
                <li>
                    <a href="{item.path}" 
                        class="flex items-center space-x-2 text-gray-700 hover:text-[#00205b] text-base setting-item {($page.url.pathname === item.path) ? 'active' : ''}">
                        <i class="fa-solid {item.icon}"></i>
                        <span>{item.label}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </div>

    <!-- Nội dung -->
    <div class="ml-[250px] w-full p-6">
        <slot />
    </div>
</div>

<style>
    .setting-item.active {
        color: #00205b;
        }
</style>
