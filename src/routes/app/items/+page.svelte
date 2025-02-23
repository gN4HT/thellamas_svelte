<script>

  let data = {
    folders: [
      { id: 1, name: "Thư mục A", isNew: true },
      { id: 2, name: "Thư mục B", isNew: false },
        { id: 3, name: "Thư mục C", isNew: true },
        { id: 4, name: "Thư mục D", isNew: false },
        { id: 5, name: "Thư mục E", isNew: true }
    ],
    items: [
      { id: 1, name: "Mặt hàng 1", quantity: "1 đơn vị", price: "₫100,000", isNew: true },
      { id: 2, name: "Mặt hàng 2", quantity: "2 đơn vị", price: "₫200,000", isNew: false },
      { id: 3, name: "Mặt hàng 1", quantity: "1 đơn vị", price: "₫100,000", isNew: true },
      { id: 4, name: "Mặt hàng 2", quantity: "2 đơn vị", price: "₫200,000", isNew: false },
      { id: 5, name: "Mặt hàng 1", quantity: "1 đơn vị", price: "₫100,000", isNew: true },
      { id: 6, name: "Mặt hàng 2", quantity: "2 đơn vị", price: "₫200,000", isNew: false }
    ]
  };
  let limitFolders = 3;
  let limitItems = 5;

  function getTotalPrice() {
    return data.items.reduce((total, item) => {
      let price = parseInt(item.price.replace(/[^\d]/g, ""), 10); // Chuyển đổi giá thành số
      return total + price;
    }, 0);
  }
</script>

<div class="flex">
  <!-- Sidebar -->
  <div class="w-64 bg-white shadow-md border-r p-4 h-screen fixed">
    <div class="mb-6 flex justify-between items-center p-2 border rounded-md">
    <i class="fa-solid fa-magnifying-glass mr-2"></i>
      <input type="text" placeholder="Tìm thư mục" class="w-full border-none outline-none" />
    </div>
    <div class="flex items-center space-x-2 text-[#00205b] font-medium p-2 bg-gray-100 cursor-pointer rounded-md">
      <span class="text-lg"><i class="fa-solid fa-box"></i></span>
      <span>Tất cả mặt hàng</span>
    </div>
    {#each data.folders as folder}
      <div class="pl-6 mt-2">
        <div class="flex items-center space-x-2 text-gray-600 hover:text-[#00205b] cursor-pointer">
          <span class="text-lg"><i class="fa-solid fa-folder"></i></span>
          <span>{folder.name}</span>
        </div>
      </div>
    {/each}
  </div>

  <!-- Nội dung chính -->
  <div class="p-4 w-full ml-[250px]">
    <div class="flex items-center justify-between border-b border-gray-500 p-4">
      <h1 class="text-3xl font-bold text-gray-800">Tất cả mặt hàng</h1>
      <div class="flex space-x-4">
        <a href="items/additem" class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm mặt hàng</a>
        <a href="items/addfolder" class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639]">Thêm thư mục</a>
      </div>
    </div>

    <div class="flex justify-between p-4">
        <!-- Ô tìm kiếm -->
        <div class="mt-4 relative">
          <input
            type="text"
            placeholder="Tìm mặt hàng"
            class="p-2 pl-8 border rounded-md shadow-sm focus:ring-[#00205b] focus:border-[#00205b]"
          />
          <span class="absolute left-2 top-2 text-gray-500"
            ><i class="fa-solid fa-magnifying-glass"></i
          ></span>
          <span
            class="absolute right-2 top-2 bg-black text-white px-1 rounded-md"
            ><i class="fa-solid fa-qrcode"></i
          ></span>
        </div>
        <!-- Thanh công cụ phải -->
        <div class="mt-4 flex justify-between items-center gap-4">
          <div class="flex items-center space-x-2">
            <span class="text-gray-700">Gộp mặt hàng</span>
            <input type="checkbox" class="toggle-checkbox hidden" />
            <label
              class="w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer"
            >
              <div
                class="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-0 transition-transform duration-300"
              ></div>
            </label>
          </div>

          <div class="flex items-center space-x-2 text-gray-700">
            <!-- Custom Dropdown -->
            <div class="relative w-40">
              <select
                class="block w-full appearance-none bg-transparent text-gray-700 px-3 py-2 pr-8 focus:outline-none focus:text-[#00205b]"
              >
                <option>Theo tên</option>
                <option>Theo giá</option>
                <option>Theo số lượng</option>
              </select>
              <!-- Custom Arrow -->
              <div
                class="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-500"
              >
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>
          <div
            class="px-1 border border-gray-500 rounded-md text-gray-500"
          >
            <i class="fa-solid fa-bars-staggered"></i>
          </div>
        </div>
      </div>

    <div class="p-4 mt-4 flex space-x-6 text-gray-700">
      <span>Thư mục: <strong>{data.folders.length}</strong></span>
      <span>Mặt hàng: <strong>{data.items.length}</strong></span>
      <span>Tổng số lượng: <strong>{data.items.length}</strong> đơn vị</span>
      <span>Tổng giá trị: <strong>₫{getTotalPrice().toLocaleString()}</strong></span>
    </div>
    
    {#if data.folders.length > 0 || data.items.length > 0}
    <!-- Danh sách thư mục -->
    <div class="grid grid-cols-5 gap-4 p-4">
        {#each (limitFolders == -1 ? data.folders : data.folders.slice(0, limitFolders)) as folder}
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="bg-gray-500 p-10 flex items-center justify-center relative">
            <span class="text-4xl text-gray-300"><i class="fa-solid fa-folder-open"></i></span>
            {#if folder.isNew}
              <span class="absolute bottom-2 left-2 text-xs bg-black text-white px-2 py-1 rounded">MỚI</span>
            {/if}
          </div>
          <div class="p-4">
            <p class="mt-2 font-semibold text-gray-700">{folder.name}</p>
          </div>
        </div>
      {/each}
    </div>

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
      </div>

    <!-- Danh sách mặt hàng -->
    <div class="grid grid-cols-5 gap-4 p-4 mt-10">
        {#each (limitItems == -1 ? data.items : data.items.slice(0, limitItems)) as item}
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="bg-gray-200 p-10 flex items-center justify-center relative">
            <span class="text-4xl text-gray-400"><i class="fa-solid fa-file"></i></span>
            {#if item.isNew}
              <span class="absolute bottom-2 left-2 text-xs bg-black text-white px-2 py-1 rounded">MỚI</span>
            {/if}
          </div>
          <div class="p-4">
            <p class="mt-2 font-semibold text-gray-700">{item.name}</p>
            <p class="text-sm text-gray-500 mt-1">{item.quantity} | {item.price}</p>
          </div>
        </div>
      {/each}
    </div>

    <div class="p-4 mt-4 flex justify-between items-center">
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
  <!-- Hiển thị nếu không có mặt hàng hoặc thư mục -->
  <div class="flex flex-col items-center justify-center mt-12 text-center">
    <img src="/img/empty-product.webp" alt="Không có sản phẩm" />
    <p class="mt-4 text-gray-700 font-medium">
      Nơi này có vẻ hơi cô đơn.<br />
      Hãy làm cho nó trở nên thú vị hơn với một số hàng tồn kho.
    </p>

    <!-- Nút bấm -->
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
  </div>
</div>
