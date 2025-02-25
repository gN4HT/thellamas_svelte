<script>
  let data = {
    inventory_summary: [
      { icon: "/img/Frame 61.png", value: "3", label: "Mặt hàng" },
      { icon: "/img/Frame 61 (1).png", value: "1", label: "Thư mục" },
      { icon: "/img/Frame 61 (2).png", value: "1.3K", label: "Tổng số lượng" },
      { icon: "/img/Frame 61 (3).png", value: "162.7K", label: "Tổng giá trị" }
    ],
    recent_activities: [
      { user: "Đoàn Nhật Trường", item: "Xe đạp", from: "Items", to: "Test", time: "3:06 AM" },
      { user: "Đoàn Nhật Trường", item: "Xe máy", from: "Kho A", to: "Kho B", time: "5:30 PM" }
    ],
    recent_items: [
      { img: "/img/kho hàng.png", name: "Item 1", description: "Đây là mô tả", unit: "1 Đơn vị", price: "100,000K" },
      { img: "/img/kho hàng.png", name: "Item 2", description: "Đây là mô tả", unit: "1 Đơn vị", price: "200,000K" }
    ],
    stock_levels: [
      { img: "/img/file1.png", name: "Item 1", unit: "1 Đơn vị" },
      { img: "/img/file1.png", name: "Item 2", unit: "2 Đơn vị" }
    ]
  };
</script>

<div class="p-6">
  <!-- Header -->
  <div class="flex justify-between border-b pb-4">
    <h1 class="text-2xl font-semibold text-gray-900">Bảng điều khiển</h1>
    <button class="flex items-center bg-blue-900 text-white px-4 py-2 rounded-md">
      <img src="/img/Frame 55.png" alt="Set Folders Icon" class="w-6 h-6" />
      <span class="ml-2 uppercase text-sm tracking-wide">Cài đặt thư mục</span>
    </button>
  </div>

  <!-- Selected Folders -->
  <div class="flex items-center gap-4 py-4">
    <h3 class="text-sm">Thư mục được chọn:</h3>
    <span class="px-4 py-1 bg-gray-600 text-white rounded-full">Tất cả thư mục</span>
  </div>
  <div class=" max-w-5xl mx-auto">
    <!-- Inventory Summary -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold mb-4">Tóm tắt hàng tồn kho</h2>
      <div class="grid grid-cols-4 gap-4">
        {#each data.inventory_summary as item}
          <div class="flex flex-col items-center p-8 shadow-md rounded-md bg-white">
            <img src={item.icon} class="w-10 h-10" />
            <p class="text-2xl font-bold">{item.value}</p>
            <span>{item.label}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="mt-6">
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-lg font-semibold">Hoạt động gần đây</h2>
        <div class="flex items-center gap-2">
          <span class="text-gray-600 text-sm">Tất cả hoạt động</span>
          <a href="#"
            ><img src="/img/dashboard-icon.png" class="w-6 h-6"
          /></a>
        </div>
      </div>
      {#each data.recent_activities as activity}
        <div class="flex justify-between p-4 shadow-md bg-white rounded-md mb-2">
          <p>
            {activity.user} di chuyển 1 đơn vị <span class="text-blue-700">{activity.item}</span> từ 
            <span class="text-red-600">{activity.from}</span> sang 
            <span class="text-red-600">{activity.to}</span>
          </p>
          <span class="text-sm">{activity.time}</span>
        </div>
      {/each}
    </div>

    <!-- Recent Items -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold mb-4">Mặt hàng gần đây</h2>
      <div class="grid grid-cols-3 gap-6">
        {#each data.recent_items as item}
          <div class="shadow-md rounded-lg overflow-hidden bg-white">
            <a href="#"><img src={item.img} class="w-full" /></a>
            <div class="p-4">
              <h3 class="font-semibold">{item.name}</h3>
              <p class="text-gray-500 py-2">{item.description}</p>
              <div class="text-red-600 flex items-center">
                <span class="text-black">{item.unit}</span>
                <span class="mx-2">|</span>
                <span>{item.price}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Stock Level -->
    <div class="mt-6">
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-lg font-semibold">Mức tồn kho (0 kết quả)</h2>
        <div class="flex items-center gap-2">
          <span class="text-gray-600 text-sm">Ở hoặc Dưới Mức Tối Thiểu</span>
          <a href="#"
            ><img src="/img/dashboard-icon.png" class="w-6 h-6"
          /></a>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4">
        {#each data.stock_levels as item}
          <div class="flex items-center shadow-md p-4 bg-white rounded-lg">
            <a href="#" class="w-10 h-10 flex justify-center items-center bg-gray-400">
              <img src={item.img} class="w-10 h-10" />
            </a>
            <div class="flex justify-between flex-1 pl-4">
              <p class="text-lg font-medium">{item.name}</p>
              <span class="text-red-600">{item.unit}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
