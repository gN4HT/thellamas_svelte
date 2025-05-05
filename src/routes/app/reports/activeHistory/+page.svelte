<script>
  import { apiFetch } from "$lib/api";
  import { onMount } from "svelte";

  let historyData = [];
  let limitRows = 3;
  let errorMessage = "";
  let searchTerm = "";


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

  function filterHistory() {
    const term = searchTerm.toLowerCase();
    return historyData.filter(item => {
      return (
        (item.user_name ?? "").toLowerCase().includes(term) ||
        (item.activity_type ?? "").toLowerCase().includes(term) ||
        (item.item_name ?? "").toLowerCase().includes(term) ||
        (item.folder_name ?? "").toLowerCase().includes(term) ||
        (item.old_folder_name ?? "").toLowerCase().includes(term) ||
        (item.new_folder_name ?? "").toLowerCase().includes(term) ||
        (item.old_price?.toString() ?? "").includes(term) ||
        (item.new_price?.toString() ?? "").includes(term)
      );
    });
  }


  onMount(fetchHistory);
</script>

<style>
  @media (max-width: 768px) {
    .table-container {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 0 -1rem;
      padding: 0 1rem;
    }

    .table-container::-webkit-scrollbar {
      height: 8px;
    }

    .table-container::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .table-container::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .search-input {
      width: 100%;
    }

    .header-container {
      flex-direction: column;
      gap: 1rem;
    }

    .export-button {
      width: 100%;
    }

    table {
      min-width: 800px;
    }

    th, td {
      padding: 0.5rem;
      font-size: 0.875rem;
    }

    th {
      white-space: nowrap;
    }

    td {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>

<!-- Hiển thị lỗi -->
{#if errorMessage}
  <p class="text-red-500">{errorMessage}</p>
{/if}

<div class="space-y-4 t-c">
  <!-- Header -->
  <div class="header-container flex justify-between items-center">
    <h1 class="text-2xl font-bold text-gray-700">Lịch Sử Hoạt Động</h1>
    <button class="export-button bg-[#00205B] text-white px-4 py-2 rounded-lg border border-[#00205B] hover:bg-white hover:text-[#00205B] transition-colors duration-200">
      <i class="fa-solid fa-file-export mr-1"></i> Xuất file
    </button>
  </div>

  <!-- Thanh tìm kiếm -->
  <input
    type="text"
    placeholder="Tìm kiếm theo tên, hoạt động, sản phẩm, folder, giá..."
    bind:value={searchTerm}
    class="search-input border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
  />

  <!-- Bảng hiển thị lịch sử hoạt động -->
  <div class="table-container">
    <table class="w-full border-collapse table-fixed min-w-[1200px]">
      <thead class="bg-gray-200 whitespace-nowrap">
        <tr class="text-gray-700 text-left uppercase">
          <th class="py-3 px-4 border w-32">Ngày</th>
          <th class="py-3 px-4 border w-40">Loại Hoạt Động</th>
          <th class="py-3 px-4 border w-64">Chi Tiết</th>
          <th class="py-3 px-4 border w-40">Người Dùng</th>
          <th class="py-3 px-4 border w-40">Sản Phẩm</th>
          <th class="py-3 px-4 border w-40">Thư Mục</th>
          <th class="py-3 px-4 border w-32">SL Cũ</th>
          <th class="py-3 px-4 border w-32">SL Mới</th>
          <th class="py-3 px-4 border w-32">Giá Cũ</th>
          <th class="py-3 px-4 border w-32">Giá Mới</th>
          <th class="py-3 px-4 border w-32">TM Cũ</th>
          <th class="py-3 px-4 border w-32">TM Mới</th>
        </tr>
      </thead>
      <tbody class="text-gray-600">
        {#if (searchTerm && filterHistory().length === 0)}
          <tr>
            <td colspan="12" class="py-4 px-4 text-center text-gray-500 italic">
              Không tìm thấy kết quả phù hợp.
            </td>
          </tr>
        {/if}
        {#each (limitRows == -1 
          ? (searchTerm ? filterHistory() : historyData) 
          : (searchTerm ? filterHistory().slice(0, limitRows) : historyData.slice(0, limitRows))) as item}      
          <tr class="border hover:bg-gray-50">
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
      <select bind:value={limitRows} class="border rounded p-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value={3}>3</option>
        <option value={6}>6</option>
        <option value={9}>9</option>
        <option value={12}>12</option>
        <option value="-1">Tất cả</option>
      </select>
    </label>
  </div>
</div>
