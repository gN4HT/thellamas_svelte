<script lang="ts">
    const {fetchData} = $props();
</script>

<div class="flex flex-col items-center justify-center mt-12 text-center">
    <img src="/img/empty-product.webp" alt="Không có sản phẩm"/>
    <p class="mt-4 text-gray-700 font-medium">
        Nơi này có vẻ hơi cô đơn.<br/>
        Hãy làm cho nó trở nên thú vị hơn với một số hàng tồn kho.
    </p>

    <!-- Nút bấm -->
    <div class="mt-6 flex space-x-4">
        <button class="bg-[#00205b] text-white px-4 py-2 rounded shadow hover:bg-[#001639]" onclick={fetchData}>
            Tải lại dữ liệu
        </button>
    </div>
</div>