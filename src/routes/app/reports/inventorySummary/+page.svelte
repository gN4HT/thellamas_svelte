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
    <h1 class="text-2xl font-semibold mb-4">Sản phẩm có tồn kho thấp</h1>
  
    {#if isLoading}
      <p class="text-gray-600">Đang tải dữ liệu...</p>
    {:else if error}
      <p class="text-red-500">{error}</p>
    {:else if items.length === 0}
      <p class="text-gray-600">Không có sản phẩm nào thiếu hàng.</p>
    {:else}
      <div class="overflow-auto">
        <table class="min-w-full border rounded-lg shadow text-sm">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-2 text-left">Tên</th>
              <th class="px-4 py-2 text-center">Số lượng</th>
              <th class="px-4 py-2 text-center">Ngưỡng cảnh báo</th>
              <th class="px-4 py-2 text-center">Giá</th>
              <th class="px-4 py-2">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {#each items as item}
              <tr class="border-t hover:bg-gray-50">
                <td class="px-4 py-2">{item.name}</td>
                <td class="px-4 py-2 text-center text-red-500">{item.quantity}</td>
                <td class="px-4 py-2 text-center">{item.stock_level}</td>
                <td class="px-4 py-2 text-center">{item.price.toLocaleString()} ₫</td>
                <td class="px-4 py-2">{item.notes ?? '-'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
  
  <style>
    table th, table td {
      border-bottom: 1px solid #e5e7eb;
    }
  </style>
  