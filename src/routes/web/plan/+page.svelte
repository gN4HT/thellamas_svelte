<script>
    import { onMount } from "svelte";

    let plans = []; // Chứa danh sách gói từ API

    // Gọi API để fetch dữ liệu
    const fetchPlans = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/plans");
            if (response.ok) {
                plans = await response.json(); // Lưu dữ liệu vào biến
            } else {
                console.error("Failed to fetch plans");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Gọi API khi component được mount
    onMount(() => {
        fetchPlans();
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
</script>

<div class="flex flex-wrap justify-center gap-10">
    {#each plans as plan}
        <div class="bg-white p-8 rounded-xl shadow-lg w-96 border-t-4 text-center" style="border-color: {getBorderColor(plan.order)};">
            <h3 class="text-2xl font-bold" style="color: {getTextColor(plan.order)};">{plan.name}</h3>
            <p class="text-3xl font-extrabold my-4">${plan.monthly_fee}/tháng</p>
            <button
                    class="w-full py-3 font-semibold rounded"
                    style="background-color: {getTextColor(plan.order)}; color: white;"
            >
                Nâng cấp
            </button>
            <p class="mt-4 font-bold">📄 {plan.features.length} tính năng</p>
            <ul class="mt-4 text-left text-gray-700 space-y-2">
                {#each plan.features as feature}
                    <li>✔️ {feature}</li>
                {/each}
            </ul>
        </div>
    {/each}
</div>
