<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let product = null;
  let error = null;
  let loading = true;
  let productId = null;

  onMount(async () => {
    const urlParams = $page.url.pathname.split("/"); // Lấy ID từ URL
    productId = urlParams[urlParams.length - 1];

    if (!productId) {
      error = "ID sản phẩm không hợp lệ";
      loading = false;
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/items/${productId}`);
      if (!res.ok) throw new Error("Không tìm thấy sản phẩm");

      product = await res.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100 p-4">
  <div class="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
    {#if loading}
      <p class="text-center text-gray-500">Đang tải...</p>
    {:else if error}
      <p class="text-center text-red-500 font-semibold">Lỗi: {error}</p>
    {:else}
      <h1 class="text-2xl font-bold text-gray-800">{product.name}</h1>
      <p class="text-gray-600 mt-2">Số lượng: {product.quantity}</p>
      <p class="text-gray-600">Tồn kho: {product.stock_level}</p>
      <p class="text-gray-600">Giá: {product.price} VNĐ</p>
      <p class="text-gray-600">Ghi chú: {product.notes}</p>
      <p class="text-gray-500 text-sm mt-2">Ngày tạo: {new Date(product.created_at).toLocaleString()}</p>
      <p class="text-gray-500 text-sm">Cập nhật: {new Date(product.updated_at).toLocaleString()}</p>

      {#if product.images && product.images.length > 0}
        <div class="mt-4">
          <h2 class="text-lg font-semibold text-gray-700">Hình ảnh</h2>
          <div class="grid grid-cols-2 gap-4 mt-2">
            {#each product.images as img}
            <img src="/img/{img}" alt="Hình ảnh sản phẩm" class="w-full rounded-lg shadow" />
          {/each}
          
          </div>
        </div>
      {/if}

      <a href="/app/inventory/all" class="mt-4 inline-block text-blue-500">Quay lại danh sách</a>
    {/if}
  </div>
</div>
