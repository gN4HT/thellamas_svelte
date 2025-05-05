<script>
    import { onMount } from "svelte";

    let plans = []; // Chứa danh sách gói từ API

    // Gọi API để fetch dữ liệu
    const fetchPlans = async () => {
        try {
            const response = await fetch("https://tkhoa-innovation.com/invTracker_api/public/api/plans");
            if (response.ok) {
                const data = await response.json();
                plans = data.data; // Lưu dữ liệu vào biến từ key `data`
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
    
    <div class="bg-white p-8 rounded-xl shadow-lg w-96 border-t-4 border-purple-400 text-center">
        <h3 class="text-purple-500 text-2xl font-bold">Advanced</h3>
        <p class="text-3xl font-extrabold my-4">699.000 VNĐĐ/năm</p>
        <button class="bg-purple-500 text-white w-full py-3 font-semibold rounded">Nâng cấp</button>
        <p class="mt-4 font-bold">📄 5 giấy phép người dùng</p>
        <ul class="mt-4 text-left text-gray-700 space-y-2">
            <li>✔️ Tất cả tính năng miễn phí TheLlamas</li>
            <li>✔️ 2.000 mặt hàng</li>
            <li>✔️ 10 trường tùy chỉnh</li>
            <li>➕ Báo cáo đã lưu</li>
            <li>➕ Cảnh báo theo ngày</li>
            <li>➕ Tạo mã vạch không giới hạn</li>
            <li>➕ Báo cáo tóm tắt hoạt động người dùng</li>
            <li>➕ Báo cáo tổng quan di chuyển</li>
            <li>➕ Báo cáo luồng mặt hàng (x6)</li>
        </ul>
    </div>
    <div class="bg-white p-8 rounded-xl shadow-lg w-96 border-t-4 border-blue-400 text-center">
        <h3 class="text-blue-500 text-2xl font-bold">Ultra</h3>
        <p class="text-3xl font-extrabold my-4">999.000 VNĐ/năm</p>
        <button class="bg-blue-500 text-white w-full py-3 font-semibold rounded">Nâng cấp</button>
        <p class="mt-4 font-bold">📄 8 giấy phép người dùng</p>
        <ul class="mt-4 text-left text-gray-700 space-y-2">
            <li>✔️ Tất cả tính năng miễn phí TheLlamas</li>
            <li>✔️ 5.000 mặt hàng</li>
            <li>✔️ 20 trường tùy chỉnh</li>
            <li>➕ Tích hợp QuickBooks Online</li>
            <li>➕ Đăng ký báo cáo</li>
            <li>➕ Quyền tùy chỉnh vai trò</li>
            <li>➕ Buổi đào tạo hướng dẫn</li>
            <li>➕ Hỗ trợ email ưu tiên</li>
        </ul>
    </div>
</div>