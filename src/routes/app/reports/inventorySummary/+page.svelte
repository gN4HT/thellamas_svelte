<script lang="ts">
  import { onMount } from "svelte";
  import { apiFetch } from "$lib/api";

  interface Item {
    id: number;
    name: string;
    quantity: number;
    stock_level: number;
    price: number;
    notes?: string;
  }

  let items: Item[] = [];
  let isLoading = false;
  let error: string | null = null;

  async function fetchLowStockItems() {
    isLoading = true;
    error = null;
    try {
      const response = await apiFetch("items/low-stock");
      items = response;
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      error = "Không thể tải danh sách sản phẩm có tồn kho thấp.";
    } finally {
      isLoading = false;
    }
  }

  onMount(fetchLowStockItems);
</script>

<style>
  @media (max-width: 768px) {
    .table-container {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 0 -1.5rem;
      padding: 0 1.5rem;
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

    .header-container {
      flex-direction: column;
      gap: 1rem;
    }

    .view-all-button {
      width: 100%;
    }

    .table {
      min-width: 800px;
    }
  }
</style>

<div class="p-4 md:p-6 space-y-4">
  <!-- Tiêu đề và nút hành động -->
  <div class="header-container flex justify-between items-center">
    <h1 class="text-2xl font-bold text-gray-700">Sản phẩm có tồn kho thấp</h1>
    <button class="view-all-button bg-[#00205B] text-white px-4 py-2 rounded-lg border border-[#00205B] hover:bg-white hover:text-[#00205B] transition-colors duration-200">
      <i class="fa-solid fa-circle-exclamation mr-1"></i> Xem tất cả
    </button>
  </div>

  <!-- Trạng thái tải -->
  {#if isLoading}
    <div class="flex justify-center items-center h-40">
      <div class="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 text-red-700 border border-red-300 p-4 rounded-md">
      {error}
    </div>
  {:else if items.length === 0}
    <div class="text-center py-8">
      <p class="text-gray-600 italic">Không có sản phẩm nào thiếu hàng.</p>
    </div>
  {:else}
    <!-- Bảng hiển thị sản phẩm -->
    <div class="table-container">
      <table class="table w-full border-collapse table-fixed border border-gray-300">
        <thead class="bg-gray-200 text-gray-700 uppercase whitespace-nowrap">
          <tr>
            <th class="py-3 px-4 border border-gray-300 w-72 text-left">Tên</th>
            <th class="py-3 px-4 border border-gray-300 w-40 text-center">Số lượng</th>
            <th class="py-3 px-4 border border-gray-300 w-52 text-center">Ngưỡng cảnh báo</th>
            <th class="py-3 px-4 border border-gray-300 w-52 text-center">Giá</th>
            <th class="py-3 px-4 border border-gray-300 text-left">Ghi chú</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 divide-y divide-gray-300">
          {#each items as item}
            <tr class="hover:bg-gray-50">
              <td class="py-2 px-4 border border-gray-300">{item.name}</td>
              <td class="py-2 px-4 border border-gray-300 text-center font-semibold {item.quantity < item.stock_level ? 'text-red-500' : 'text-gray-700'}">
                {item.quantity}
              </td>
              <td class="py-2 px-4 border border-gray-300 text-center">{item.stock_level}</td>
              <td class="py-2 px-4 border border-gray-300 text-center">{item.price.toLocaleString()} ₫</td>
              <td class="py-2 px-4 border border-gray-300">{item.notes ?? '-'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
