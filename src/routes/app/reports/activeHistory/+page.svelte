<script>
    let historyData = [
        {
            date: "21/01/2025 9:05 AM",
            type: "Tạo Thư Mục",
            details: "Trần Văn Thắng đã tạo thư mục <strong>test</strong> trong <strong>Hạng Mục</strong>",
            user: "Trần Văn Thắng",
            item: "test",
            quantityChange: "-",
            remaining: "-",
            moved: "-",
            sourceFolder: "-",
            destinationFolder: "-"
        },
        {
            date: "21/01/2025 9:05 AM",
            type: "Thêm Nhãn",
            details: "Trần Văn Thắng đã thêm nhãn <strong>Test</strong>",
            user: "Trần Văn Thắng",
            item: "-",
            quantityChange: "-",
            remaining: "-",
            moved: "-",
            sourceFolder: "-",
            destinationFolder: "-"
        },
        {
            date: "21/01/2025 9:05 AM",
            type: "Chỉnh Sửa Hạng Mục",
            details: "Trần Văn Thắng đã thêm ảnh vào <strong>test</strong>",
            user: "Trần Văn Thắng",
            item: "test",
            quantityChange: "-",
            remaining: "-",
            moved: "-",
            sourceFolder: "-",
            destinationFolder: "-"
        }
    ];
    let limitRows = 3;
</script>


<div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold text-gray-700">
        Lịch Sử Hoạt Động
    </h1>
    <button
            class="bg-[#00205B] text-white px-4 py-2 rounded-lg border border-[#00205B] hover:bg-white hover:text-[#00205B]"
    >
        <i class="fa-solid fa-file-export mr-1"></i> Xuất file
    </button>
</div>
<!-- Thanh tìm kiếm và bộ lọc -->
<input
        type="text"
        placeholder="Tìm kiếm hoạt động..."
        class="border border-gray-300 p-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

<!-- Bảng có thể cuộn ngang -->
<div class="mt-4 overflow-x-auto">
    <table class="w-full border-collapse table-fixed">
        <thead class="bg-gray-200 whitespace-nowrap">
        <tr class="text-gray-700 text-left uppercase">
            <th class="py-3 px-4 border w-40">Ngày</th>
            <th class="py-3 px-4 border w-52">Loại Hoạt Động</th>
            <th class="py-3 px-4 border w-96">Chi Tiết</th>
            <th class="py-3 px-4 border w-60">Người Dùng</th>
            <th class="py-3 px-4 border w-64">Mục Hoặc Thư Mục</th>
            <th class="py-3 px-4 border w-40">Số Lượng Thay Đổi</th>
            <th class="py-3 px-4 border w-40">Số Lượng Còn</th>
            <th class="py-3 px-4 border w-40">Số Lượng Di Chuyển</th>
            <th class="py-3 px-4 border w-64">Thư Mục Nguồn</th>
            <th class="py-3 px-4 border w-64">Thư Mục Đích</th>
        </tr>
        </thead>
        <tbody class="text-gray-600">
        {#each (limitRows == -1 ? historyData : historyData.slice(0, limitRows)) as item}
            <tr class="border">
                <td class="py-2 px-4 border">{item.date}</td>
                <td class="py-2 px-4 border">{item.type}</td>
                <td class="py-2 px-4 border">{@html item.details}</td>
                <td class="py-2 px-4 border">{item.user}</td>
                <td class="py-2 px-4 border">{item.item}</td>
                <td class="py-2 px-4 border">{item.quantityChange}</td>
                <td class="py-2 px-4 border">{item.remaining}</td>
                <td class="py-2 px-4 border">{item.moved}</td>
                <td class="py-2 px-4 border">{item.sourceFolder}</td>
                <td class="py-2 px-4 border">{item.destinationFolder}</td>
            </tr>
        {/each}
        </tbody>

    </table>
</div>

<!-- Số lượng hiển thị -->
<div class="p-4 mt-4 flex justify-between items-center">
    <label class="text-gray-600">
        Hiển thị số dòng:
        <select bind:value={limitRows} class="border rounded p-2 ml-2">
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value="-1">Tất cả</option>
        </select>
    </label>
</div>
