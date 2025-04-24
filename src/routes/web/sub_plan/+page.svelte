<script>
    import { onMount } from "svelte";

    let plans = []; 
    const fetchPlans = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/plans");
            if (response.ok) {
                const data = await response.json();
                plans = data.data; 
            } else {
                console.error("Failed to fetch plans");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    onMount(() => {
        fetchPlans();
    });

    function getBorderColor(order) {
        const colors = ["#4CAF50", "#9C27B0", "#2196F3"]; 
        return colors[(order - 1) % colors.length];
    }

    function getTextColor(order) {
        const colors = ["#4CAF50", "#9C27B0", "#2196F3"]; 
        return colors[(order - 1) % colors.length];
    }
</script>

<div class="flex flex-wrap justify-center gap-10">
    {#each plans as plan, index}
        <div class="bg-white p-8 rounded-xl shadow-lg w-96 border-t-4 text-center" style="border-color: {getBorderColor(index + 1)};">
            <h3 class="text-2xl font-bold" style="color: {getTextColor(index + 1)};">{plan.name}</h3>
            <p class="text-gray-600 mt-2">{plan.description}</p>
            <p class="text-3xl font-extrabold my-4">{plan.price} <span></span> VNĐ /tháng</p>

            <button
                    class="w-full py-3 font-semibold rounded"
                    style="background-color: {getTextColor(index + 1)}; color: white;"
            >
                Nâng cấp
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
                {#each Object.entries(plan.enabled_features) as [feature, value]}
                    <li>✔️ {feature.replace(/_/g, ' ')}: {typeof value === 'boolean' ? (value ? 'Có' : 'Không') : value}</li>
                {/each}
            </ul>
        </div>
    {/each}
</div>