<script lang="ts">
    import {onMount} from "svelte";
    import {apiFetch} from "$lib/api";


    let data = {
        inventory_summary: [],
        recent_activities: [],
        recent_items: [],
        stock_levels: []
    };

    let currentDateTime = "";

    function updateDateTime() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        currentDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    const fetchData = async () => {
        try {
            const result = await apiFetch("/dashboard");
            // Xử lý dữ liệu nhận được từ API
            data.inventory_summary = [
                {icon: "/img/Frame 61.png", value: result.counts.items, label: "Mặt hàng"},
                {icon: "/img/Frame 61 (1).png", value: result.counts.folders, label: "Thư mục"},
                {icon: "/img/Frame 61 (2).png", value: result.counts.quantity, label: "Tổng số lượng"},
                {icon: "/img/Frame 61 (3).png", value: result.counts.price, label: "Tổng giá trị"}
            ];

            data.recent_activities = result.user_histories.map(activity => ({
                activity: activity.activity,
                time: new Date(activity.created_at).toLocaleString()
            }));

            data.recent_items = result.items.map(item => ({
                img: `${item.image}`,
                name: item.name,
                description: `Số lượng: ${item.quantity}`,
                unit: `${item.quantity} Đơn vị`,
                price: `${item.price}K`
            }));

            data.stock_levels = result.low_stock_items.map(item => ({
                img: `${item.image}`,
                name: item.name,
                unit: `${item.quantity} Đơn vị`
            }));
        } catch (error) {
            console.error("Lỗi khi fetch API:", error);
        }
    };

    onMount(() => {
        fetchData();
        updateDateTime();
        // Update every second
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval);
    });
</script>

<div class="p-4 md:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between border-b pb-4 gap-4">
        <h1 class="text-xl md:text-2xl font-semibold text-gray-900">Bảng điều khiển</h1>
    </div>

    <!-- Selected Folders -->
    <div class="flex items-center gap-4 py-4">
        <h3 class="text-sm">Ngày tháng hiện tại:</h3>
        <span class="px-4 py-1 bg-gray-600 text-white rounded-full">{currentDateTime}</span>
    </div>
    <div class="w-full max-w-5xl mx-auto">
        <!-- Inventory Summary -->
        <div class="mt-6">
            <h2 class="text-lg font-semibold mb-4">Tóm tắt hàng tồn kho</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {#each data.inventory_summary as item}
                    <div class="flex flex-col items-center p-4 md:p-8 shadow-md rounded-md bg-white">
                        <img alt="cc" src={item.icon} class="w-8 md:w-10 h-8 md:h-10"/>
                        <p class="text-xl md:text-2xl font-bold">{item.value}</p>
                        <span>{item.label}</span>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="mt-6">
            <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 class="text-lg font-semibold">Hoạt động gần đây</h2>
            </div>
            {#each data.recent_activities as activity}
                <div class="flex flex-col sm:flex-row justify-between p-4 shadow-md bg-white rounded-md mb-2 gap-2">
                    <p class="break-words">{activity.activity}</p>
                    <span class="text-sm">{activity.time}</span>
                </div>
            {/each}
        </div>

        <!-- Recent Items -->
        <div class="mt-6">
            <h2 class="text-lg font-semibold mb-4">Mặt hàng gần đây</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each data.recent_items as item}
                    <div class="shadow-md rounded-lg overflow-hidden bg-white">
                        {#if item.img && item.img !== 'null' && item.img !== 'undefined' && item.img.length > 0}
                        <img src={`https://tkhoa-innovation.com/invTracker_api/public/storage/${item.img}`} class="w-full h-48 md:h-80 object-cover"/>
                        {:else}
                            <div class="bg-gray-200 h-48 md:h-80 flex items-center justify-center">
                                <span class="text-4xl text-gray-400"><i class="fa-solid fa-file"></i></span>
                            </div>
                        {/if}
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

        <!-- Stock Level -->
        <div class="mt-6">
            <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 class="text-lg font-semibold">Mức tồn kho</h2>
            </div>
            <div class="grid grid-cols-1 gap-4 h-[500px] overflow-auto">
                {#each data.stock_levels as item}
                    <div class="flex items-center shadow-md p-4 bg-white rounded-lg">
                        {#if item.img && item.img !== 'null' && item.img !== 'undefined' && item.img.length > 0}
                        <a class="w-20 h-20 flex-shrink-0 flex justify-center items-center bg-gray-400">
                                <img src={`https://tkhoa-innovation.com/invTracker_api/public/storage/${item.img}`} class="w-20 h-20"/>
                            </a>
                        {:else}
                            <a class="w-20 h-20 flex-shrink-0 flex justify-center items-center bg-gray-200">
                                <span class="text-4xl text-gray-400"><i class="fa-solid fa-file"></i></span>
                            </a>
                        {/if}
                        <div class="flex justify-between flex-1 pl-4">
                            <p class="text-base md:text-lg font-medium">{item.name}</p>
                            <span class="text-red-600 ml-2">{item.unit}</span>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
