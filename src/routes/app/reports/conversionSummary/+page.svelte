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

