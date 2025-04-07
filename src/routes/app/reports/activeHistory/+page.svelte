<script>
  import { apiFetch } from "$lib/api";
  import { onMount } from "svelte";

  let historyData = [];
  let limitRows = 3;
  let errorMessage = "";

  async function fetchHistory() {
    try {
      const data = await apiFetch("/userHistory");
      
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu không phải là một mảng!");
      }
      console.log(data);

      // Cập nhật dữ liệu lịch sử
      historyData = data;
      errorMessage = ""; // Clear any previous error message
    } catch (error) {
      console.error("Lỗi khi tải lịch sử:", error.message);
      errorMessage = error.message; // Ghi lại thông báo lỗi
    }
  }

  onMount(fetchHistory);
</script>

<div class="flex justify-between items-center mb-4">
  <h1 class="text-2xl font-bold text-gray-700">Lịch Sử Hoạt Động</h1>
  <button
    class="bg-[#00205B] text-white px-4 py-2 rounded-lg border border-[#00205B] hover:bg-white hover:text-[#00205B]"
  >
    <i class="fa-solid fa-file-export mr-1"></i> Xuất file
  </button>
</div>

<!-- Hiển thị lỗi nếu có -->
{#if errorMessage}
  <p class="text-red-500">{errorMessage}</p>
{/if}

<!-- Thanh tìm kiếm -->
<input
  type="text"
  placeholder="Tìm kiếm hoạt động..."
  class="border border-gray-300 p-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

<!-- Bảng hiển thị lịch sử hoạt động -->
<div class="mt-4 overflow-x-auto">
  <table class="w-full border-collapse table-fixed">
    <thead class="bg-gray-200 whitespace-nowrap">
      <tr class="text-gray-700 text-left uppercase">
        <th class="py-3 px-4 border w-40">Ngày</th>
        <th class="py-3 px-4 border w-52">Loại Hoạt Động</th>
        <th class="py-3 px-4 border w-96">Chi Tiết</th>
        <th class="py-3 px-4 border w-60">Người Dùng</th>
        <th class="py-3 px-4 border w-64">Sản Phẩm</th>
        <th class="py-3 px-4 border w-64">Thư Mục</th>
        <th class="py-3 px-4 border w-40">Số Lượng Cũ</th>
        <th class="py-3 px-4 border w-40">Số Lượng Mới</th>
        <th class="py-3 px-4 border w-40">Giá Cũ</th>
        <th class="py-3 px-4 border w-40">Giá Mới</th>
        <th class="py-3 px-4 border w-40">Thư Mục Cũ</th>
        <th class="py-3 px-4 border w-40">Thư Mục Mới</th>
      </tr>
    </thead>
    <tbody class="text-gray-600">
      {#each (limitRows == -1 ? historyData : historyData.slice(0, limitRows)) as item}
        <tr class="border">
          <td class="py-2 px-4 border">{item.created_at}</td>
          <td class="py-2 px-4 border">{item.activity_type}</td>
          <td class="py-2 px-4 border">{item.activity}</td>
          <td class="py-2 px-4 border">{item.user_name}</td>
          <td class="py-2 px-4 border">{item.item_name ?? "-"}</td>
          <td class="py-2 px-4 border">{item.folder_name ?? "-"}</td>
          <td class="py-2 px-4 border">{item.old_quantity ?? "-"}</td>
          <td class="py-2 px-4 border">{item.new_quantity ?? "-"}</td>
          <td class="py-2 px-4 border">{item.old_price ? item.old_price.toLocaleString() + '₫' : "-"}</td>
          <td class="py-2 px-4 border">{item.new_price ? item.new_price.toLocaleString() + '₫' : "-"}</td>
          <td class="py-2 px-4 border">{item.old_folder_name ?? "-"}</td>
          <td class="py-2 px-4 border">{item.new_folder_name ?? "-"}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Chọn số dòng hiển thị -->
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
