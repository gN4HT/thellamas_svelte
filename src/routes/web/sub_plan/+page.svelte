<script>
    import { onMount } from "svelte";
    import { apiFetch } from "$lib/api";
    import { goto } from "$app/navigation";

    let plans = []; // Chứa danh sách gói từ API
    let userPlanId = 0; // Lưu plan_id của user

    // Gọi API để fetch dữ liệu user
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('https://tkhoa-innovation.com/invTracker_api/public/api/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const userData = await response.json();
            userPlanId = userData.plan_id || 0;
        } catch (err) {
            console.error('Error fetching user info:', err);
        }
    };

    // Gọi API để fetch dữ liệu plans
    const fetchPlans = async () => {
        try {
            const data = await apiFetch("/plans");
            console.log('Plans API Response:', data);
            plans = data.data; // Lưu dữ liệu vào biến từ key `data`
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Gọi API khi component được mount
    onMount(async () => {
        await fetchUserInfo();
        await fetchPlans();
        
        const token = localStorage.getItem('token');
    if (!token) {
        goto('/web/login');
        return;
    }
    await fetchUserInfo();
    await fetchPlans();
    });

    // Hàm đổi màu dựa vào thứ tự gói
    function getBorderColor(order) {
        const colors = ["#4CAF50", "#9C27B0", "#2196F3"]; // Màu viền
        return colors[(order - 1) % colors.length];
    }

    function getTextColor(order) {
        const colors = ["#4CAF50", "#9C27B0", "#2196F3"]; // Màu text
        return colors[(order - 1) % colors.length];
    }

    // Hàm kiểm tra xem gói có thể mua được không
    function canUpgrade(planId) {
        return planId > userPlanId;
    }

    // Hàm xử lý khi click nút nâng cấp
    const handleUpgrade = (planId) => {
        if (canUpgrade(planId)) {
            goto(`/web/order?plan=${planId}`);
        }
    };
</script>

<div class="flex flex-wrap justify-center gap-10">
    {#each plans as plan, index}
        <div class="bg-white p-8 rounded-xl shadow-lg w-96 border-t-4 text-center relative" style="border-color: {getBorderColor(index + 1)};">
            {#if !canUpgrade(plan.id)}
                <div class="absolute top-0 left-0 w-full h-full bg-gray-100 opacity-50 flex items-center justify-center">
                    <span class="text-gray-600 font-bold text-xl">Không thể nâng cấp</span>
                </div>
            {/if}
            <h3 class="text-2xl font-bold" style="color: {getTextColor(index + 1)};">{plan.name}</h3>
            <p class="text-gray-600 mt-2">{plan.description}</p>
            <p class="text-3xl font-extrabold my-4">{plan.price} <span></span> VNĐ /tháng</p>

            <button
                class="w-full py-3 font-semibold rounded"
                style="background-color: {canUpgrade(plan.id) ? getTextColor(index + 1) : '#cccccc'}; color: white;"
                on:click={() => handleUpgrade(plan.id)}
                disabled={!canUpgrade(plan.id)}
            >
                {canUpgrade(plan.id) ? 'Nâng cấp' : 'Không thể nâng cấp'}
            </button>
            <p class="mt-4 font-bold">📄 Giới hạn tính năng:</p>
            <ul class="mt-4 text-left text-gray-700 space-y-2">
                <li>✔️ Người dùng: {plan.features_amount_limit.users}</li>
                <li>✔️ Mặt hàng: {plan.features_amount_limit.items}</li>
                <li>✔️ Thư mục: {plan.features_amount_limit.folders}</li>
                <li>✔️ Trường tuỳ chỉnh: {plan.features_amount_limit.custom_fields}</li>
            </ul>
            <p class="mt-4 font-bold">🚀 Tính năng nổi bật:</p>
            <ul class="mt-4 text-left text-gray-700 space-y-2">
                {#if plan.enabled_features}
                    {#each Object.entries(plan.enabled_features) as [feature, value]}
                        <li>✔️ {feature.replace(/_/g, ' ')}: {typeof value === 'boolean' ? (value ? 'Có' : 'Không') : value}</li>
                    {/each}
                {:else}
                    <li>Không có thông tin tính năng nổi bật.</li>
                {/if}
            </ul>
        </div>
    {/each}
</div>