<script>
  import { onMount } from "svelte";
  let folders = [];
  let items = [];
  let limitFolders = 3;
  let limitItems = 5;
  let selectedItem = null;
  let showPopup = false;

  async function fetchFolders() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/folders/");
      if (!response.ok) throw new Error("Lỗi API folders");
      const data = await response.json();
      folders = data.filter(folder => folder.id >= 1 && folder.id <= 12);
    } catch (error) {
      console.error("Fetch error folders:", error);
    }
  }

  async function fetchItems() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/items/");
      if (!response.ok) throw new Error("Lỗi API items");
      const data = await response.json();
      items = data.filter(item => item.id >= 1 );
    } catch (error) {
      console.error("Fetch error items:", error);
    }
  }

  function openPopup(item) {
    selectedItem = item;
    showPopup = true;
  }

  function closePopup() {
    showPopup = false;
    selectedItem = null;
  }

  onMount(async () => {
    await fetchFolders();
    await fetchItems();
  });

  // Chạy khi component được mount
  onMount(async () => {
    await fetchFolders();
    await fetchItems();
  });

  // Tính tổng giá trị đơn hàng
  $: totalPrice = items.reduce((total, item) => {
    let price = parseInt(item.price.replace(/[^\d]/g, ""), 10);
    return total + price;
  }, 0);

  



  
</script>

<!-- Tiêu đề -->
<div class="flex items-center justify-between border-b border-gray-500 p-4">
  <h1 class="text-3xl font-bold text-gray-800">Tất cả mặt hàng</h1>
  <div class="flex space-x-4">
    <a href="/app/inventory/additem" class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm mặt hàng</a>
    <a href="/app/inventory/addfolder" class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm thư mục</a>
  </div>
</div>

<!-- Hiển thị tổng số lượng -->
<div class="p-4 mt-4 flex space-x-6 text-gray-700">
  <span>Thư mục: <strong>{folders.length}</strong></span>
  <span>Mặt hàng: <strong>{items.length}</strong></span>
  <span>Tổng giá trị: <strong>₫{totalPrice.toLocaleString()}</strong></span>
</div>

{#if folders.length > 0 || items.length > 0}
  <!-- Danh sách thư mục -->
  <div class="grid grid-cols-5 gap-4 p-4">
    {#each (limitFolders == -1 ? folders : folders.slice(0, limitFolders)) as folder}
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="bg-gray-500 p-10 flex items-center justify-center relative">
          <span class="text-4xl text-gray-300"><i class="fa-solid fa-folder-open"></i></span>
        </div>
        <div class="p-4">
          <p class="mt-2 font-semibold text-gray-700">{folder.name}</p>
        </div>
      </div>
    {/each}
  </div>




<!-- Danh sách mặt hàng -->
<div class="grid grid-cols-5 gap-4 p-4 mt-10">
  {#each (limitItems == -1 ? items : items.slice(0, limitItems)) as item}
    <div class="bg-white shadow rounded-lg overflow-hidden cursor-pointer" on:click={() => openPopup(item)}>
      <div class="bg-gray-200 p-10 flex items-center justify-center relative">
        <span class="text-4xl text-gray-400"><i class="fa-solid fa-file"></i></span>
      </div>
      <div class="p-4">
        <p class="mt-2 font-semibold text-gray-700">{item.name}</p>
        <p class="text-sm text-gray-500 mt-1">{item.quantity} | {item.price}</p>
      </div>
    </div>
  {/each}
</div>

<!-- Popup hiển thị chi tiết sản phẩm -->
{#if showPopup}
<div class="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md relative">
      <button class="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl" on:click={closePopup}>
        &times;
      </button>
      <h1 class="text-3xl font-semibold text-gray-900 text-center mb-4">{selectedItem.name}</h1>
      <div class="space-y-3 text-gray-700 text-center">
        <p class="text-lg">Số lượng: <span class="font-medium">{selectedItem.quantity}</span></p>
        <p class="text-lg">Giá: <span class="font-medium">{selectedItem.price} VNĐ</span></p>
        <p class="text-lg">Ghi chú: <span class="font-medium">{selectedItem.notes}</span></p>
      </div>
      {#if selectedItem.images && selectedItem.images.length > 0}
        <div class="mt-6">
          <h2 class="text-xl font-semibold text-gray-800 text-center">Hình ảnh</h2>
          <div class="grid grid-cols-2 gap-3 mt-4">
            {#each selectedItem.images as img}
              <img src="/img/{img}" alt="Hình ảnh sản phẩm" class="w-full h-32 object-cover rounded-lg shadow-md border border-gray-200" />
            {/each}
          </div>
        </div>
      {/if}
      <div class="mt-6 flex justify-center">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition" on:click={closePopup}>
          Đóng
        </button>
      </div>
    </div>
  </div>
{/if}






  <!-- Bộ lọc hiển thị -->
  <div class="p-4 mt-4 flex justify-between items-center">
    <label class="text-gray-600">
      Hiển thị thư mục:
      <select bind:value={limitFolders} class="border rounded p-2 ml-2">
        <option value={3}>3</option>
        <option value={6}>6</option>
        <option value={9}>9</option>
        <option value={12}>12</option>
        <option value="-1">Tất cả</option>
      </select>
    </label>

    <label class="text-gray-600">
      Hiển thị mặt hàng:
      <select bind:value={limitItems} class="border rounded p-2 ml-2">
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
        <option value="-1">Tất cả</option>
      </select>
    </label>
  </div>

{:else}
  <!-- Nếu không có dữ liệu -->
  <div class="flex flex-col items-center justify-center mt-12 text-center">
    <img src="/img/empty-product.webp" alt="Không có sản phẩm" />
    <p class="mt-4 text-gray-700 font-medium">
      Nơi này có vẻ hơi cô đơn.<br />
      Hãy làm cho nó trở nên thú vị hơn với một số hàng tồn kho.
    </p>
    <div class="mt-6 flex space-x-4">
      <button class="bg-[#00205b] text-white px-4 py-2 rounded shadow hover:bg-[#001639]">
        Thêm mặt hàng
      </button>
      <button class="bg-[#00205b] text-white px-4 py-2 rounded shadow hover:bg-[#001639]">
        Thêm thư mục
      </button>
    </div>
  </div>
{/if}
