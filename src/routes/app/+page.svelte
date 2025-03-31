<script lang="ts">
    import { onMount } from "svelte";
    import { apiFetch } from "$lib/api";

    // Định nghĩa interface cho dữ liệu
    interface DashboardData {
        inventory_summary: Array<{
            icon: string;
            value: number;
            label: string;
        }>;
        recent_activities: Array<{
            activity: string;
            time: string;
        }>;
        recent_items: Array<{
            img: string;
            name: string;
            description: string;
            unit: string;
            price: string;
        }>;
        stock_levels: Array<{
            img: string;
            name: string;
            unit: string;
        }>;
    }

    // Khởi tạo state
    let data: DashboardData = {
        inventory_summary: [],
        recent_activities: [],
        recent_items: [],
        stock_levels: []
    };

    let isLoading = false;
    let error: string | null = null;

    const fetchData = async () => {
        isLoading = true;
        error = null;

        try {
            // Sử dụng đường dẫn tương đối
            const result = await apiFetch("/dashboard");

            // Xử lý dữ liệu inventory summary
            data.inventory_summary = [
                { 
                    icon: "/img/Frame 61.png", 
                    value: result.counts?.items || 0, 
                    label: "Mặt hàng" 
                },
                { 
                    icon: "/img/Frame 61 (1).png", 
                    value: result.counts?.folders || 0, 
                    label: "Thư mục" 
                },
                { 
                    icon: "/img/Frame 61 (2).png", 
                    value: result.counts?.quantity || 0, 
                    label: "Tổng số lượng" 
                },
                { 
                    icon: "/img/Frame 61 (3).png", 
                    value: result.counts?.price || 0, 
                    label: "Tổng giá trị" 
                }
            ];

            // Xử lý dữ liệu recent activities
            data.recent_activities = (result.user_histories || []).map(activity => ({
                activity: activity.activity || 'Hoạt động không xác định',
                time: new Date(activity.created_at).toLocaleString('vi-VN')
            }));

            data.recent_items = result.items.map(item => ({
                img: `/img/${item.image}`,
                name: item.name,
                description: `Số lượng: ${item.quantity}`,
                unit: `${item.quantity} Đơn vị`,
                price: `${item.price}K`
            }));

            data.stock_levels = result.low_stock_items.map(item => ({
                img: `/img/${item.image}`,
                name: item.name,
                unit: `${item.quantity} Đơn vị`
            }));

        } catch (err) {
            console.error("Lỗi khi tải dữ liệu:", err);
            error = "Không thể tải dữ liệu. Vui lòng thử lại sau.";
        } finally {
            isLoading = false;
        }
    };

    onMount(() => {
        fetchData();
    });
</script>

<div class="p-6">
    <!-- Header -->
    <div class="flex justify-between border-b pb-4">
        <h1 class="text-2xl font-semibold text-gray-900">Bảng điều khiển</h1>
        <button class="flex items-center bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M16 18V20H5V18H16ZM21 11V13H3V11H21ZM19 4V6H8V4H19Z"></path>
            </svg>
            <span class="ml-2 uppercase text-sm tracking-wide">Cài đặt thư mục</span>
        </button>
    </div>

    {#if isLoading}
        <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
    {:else if error}
        <div class="p-4 bg-red-100 text-red-700 rounded-lg mt-4">
            {error}
            <button class="ml-2 underline" on:click={fetchData}>Thử lại</button>
        </div>
    {:else}
        <!-- Selected Folders -->
        <div class="flex items-center gap-4 py-4">
            <h3 class="text-sm">Thư mục được chọn:</h3>
            <span class="px-4 py-1 bg-gray-600 text-white rounded-full">Tất cả thư mục</span>
        </div>

        <div class="max-w-5xl mx-auto">
            <!-- Inventory Summary -->
            <div class="mt-6">
                <h2 class="text-lg font-semibold mb-4">Tóm tắt hàng tồn kho</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {#each data.inventory_summary as item}
                        <div class="flex flex-col items-center p-8 shadow-md rounded-md bg-white hover:shadow-lg transition-shadow">
                            <img src={item.icon} alt={item.label} class="w-10 h-10"/>
                            <p class="text-2xl font-bold mt-2">{item.value.toLocaleString('vi-VN')}</p>
                            <span class="text-gray-600">{item.label}</span>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Recent Activities -->
            <div class="mt-6">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-lg font-semibold">Hoạt động gần đây</h2>
                    <div class="flex items-center gap-2">
                        <span class="text-gray-600 text-sm">Tất cả hoạt động</span>
                        <a href="#" class="hover:opacity-80 transition-opacity">
                            <img src="/img/dashboard-icon.png" alt="Dashboard" class="w-6 h-6"/>
                        </a>
                    </div>
                </div>
                {#if data.recent_activities.length > 0}
                    {#each data.recent_activities as activity}
                        <div class="flex justify-between p-4 shadow-md bg-white rounded-md mb-2 hover:shadow-lg transition-shadow">
                            <p class="text-gray-800">{activity.activity}</p>
                            <span class="text-sm text-gray-500">{activity.time}</span>
                        </div>
                    {/each}
                {:else}
                    <div class="text-center py-8 text-gray-500">
                        Chưa có hoạt động nào
                    </div>
                {/if}
            </div>

            <!-- Recent Items -->
            <div class="mt-6">
                <h2 class="text-lg font-semibold mb-4">Mặt hàng gần đây</h2>
                <div class="grid grid-cols-3 gap-6">
                    {#each data.recent_items as item}
                        <div class="shadow-md rounded-lg overflow-hidden bg-white">
                            <a href="#"><img src={item.img} alt={item.name} class="w-full h-80"/></a>
                            <div class="p-4">
                                <h3 class="font-semibold">{item.name}</h3>
                                <p class="text-gray-500 py-2">{item.description}</p>
                                <div class="text-red-600 flex items-center">
                                    <span class="text-black">{item.unit}</span>
                                    <span class="mx-2">|</span>
                                    <span>{item.price}</span>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Stock Level -->
        <div class="mt-6">
            <div class="mb-6 flex justify-between items-center">
                <h2 class="text-lg font-semibold">Mức tồn kho</h2>
                <div class="flex items-center gap-2">
                    <span class="text-gray-600 text-sm">Ở hoặc Dưới Mức Tối Thiểu</span>
                    <div><img src="/img/dashboard-icon.png" class="w-6 h-6" alt=""/></div>
                </div>
            </div>

            <!-- Stock Level -->
            <div class="mt-6">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-lg font-semibold">Mức tồn kho</h2>
                    <div class="flex items-center gap-2">
                        <span class="text-gray-600 text-sm">Ở hoặc Dưới Mức Tối Thiểu</span>
                        <a href="#"
                        ><img src="/img/dashboard-icon.png" class="w-6 h-6"
                        /></a>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-4">
                    {#each data.stock_levels as item}
                        <div class="flex items-center shadow-md p-4 bg-white rounded-lg">
                            <a href="#" class="w-10 h-10 flex justify-center items-center bg-gray-400">
                                <img src={item.img} class="w-10 h-10"/>
                            </a>
                            <div class="flex justify-between flex-1 pl-4">
                                <p class="text-lg font-medium">{item.name}</p>
                                <span class="text-red-600">{item.unit}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Add any additional styles here */
</style>
