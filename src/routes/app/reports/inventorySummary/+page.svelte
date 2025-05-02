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

<div class="p-6">
  <!-- Tiêu đề và nút hành động -->
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold text-gray-700">Sản phẩm có tồn kho thấp</h1>
    <button class="bg-[#00205B] text-white px-4 py-2 rounded-lg border border-[#00205B] hover:bg-white hover:text-[#00205B] transition-colors">
      <i class="fa-solid fa-circle-exclamation mr-1"></i> Xem tất cả
    </button>
  </div>

  <!-- Trạng thái tải -->
  {#if isLoading}
    <p class="text-gray-600">Đang tải dữ liệu...</p>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else if items.length === 0}
    <p class="text-gray-600 italic">Không có sản phẩm nào thiếu hàng.</p>
  {:else}
    <!-- Bảng hiển thị sản phẩm -->
    <div class="mt-4 overflow-x-auto">
      <table class="w-full border-collapse table-fixed border border-gray-300">
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
