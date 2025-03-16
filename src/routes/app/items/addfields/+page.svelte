<script>
  let isModalOpen = false;

  function toggleModal(state) {
    isModalOpen = state;
  }
</script>

<div class="p-8 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
  <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
    <!-- Phần Tiêu Đề -->
    <div class="p-6 bg-gradient-to-l from-indigo-500 to-blue-900 text-white">
      <h2 class="text-2xl font-semibold">Trường Tùy Chỉnh</h2>
    </div>

    <!-- Bảng -->
    <div class="p-6">
      <table class="w-full border-collapse">
        <thead>
          <tr class="text-left text-gray-600 bg-gray-50 border-b">
            <th class="py-3 px-4">Tên</th>
            <th class="py-3 px-4">Hiển thị trong danh sách</th>
            <th class="py-3 px-4">Loại</th>
            <th class="py-3 px-4">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b hover:bg-gray-100 transition duration-300">
            <td class="py-4 px-4 flex items-center">
              <span class="bg-indigo-100 text-indigo-600 rounded-full h-8 w-8 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 01-8 0m8 0v10m-8 0V7m0 0a4 4 0 018 0" />
                </svg>
              </span>
              <div>
                <p class="text-gray-900 font-medium">Tên sản phẩm</p>
              </div>
            </td>
            <td class="py-4 px-4">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
                <div class="absolute left-0.5 top-0.5 bg-white h-5 w-5 rounded-full peer-checked:translate-x-full peer-checked:border-blue-600 transition-transform"></div>
              </label>
            </td>
            <td class="py-4 px-4 text-gray-900">Số seri</td>
            <td class="py-4 px-4 flex items-center gap-8">
              <!-- Biểu tượng chỉnh sửa -->
              <a href="#" class="text-[#00205B] hover:text-blue-800 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
                  <path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path>
                </svg>
              </a>
              <!-- Biểu tượng xóa -->
              <a href="#" class="text-red-800 hover:text-red-900 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
                  <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                </svg>
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Nút thêm trường -->
      <div class="mt-6 text-right">
        <button
          class="px-5 py-2 bg-blue-900 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
          on:click={() => toggleModal(true)}
        >
          + Thêm trường tùy chỉnh
        </button>
      </div>
    </div>
  </div>

  <!-- Popup -->
  {#if isModalOpen}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-2xl">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Tạo Trường Tùy Chỉnh</h3>
          <button on:click={() => toggleModal(false)} class="text-gray-500 hover:text-gray-900">
            &times;
          </button>
        </div>
        <!-- Nội dung -->
        <div class="flex">
          <!-- Trường gợi ý -->
          <div class="w-1/2 pr-4 border-r">
            <h4 class="text-sm font-semibold mb-2 text-gray-700">Trường gợi ý</h4>
            <ul class="space-y-2">
              <li class="py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer">Số Seri</li>
              <li class="py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer">Tên sản phẩm</li>
            </ul>
          </div>
          <!-- Thông tin trường -->
          <div class="w-1/2 pl-4">
            <label class="block text-gray-700 font-medium mb-1">Tên trường</label>
            <input
              type="text"
              placeholder="Nhập tên trường"
              class="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <p class="text-sm text-gray-500">Loại trường: <span class="font-medium">Hộp văn bản nhỏ</span></p>
            <p class="text-sm text-gray-500">Giới hạn ký tự: <span class="font-medium">190</span></p>
          </div>
        </div>
        <!-- Footer -->
        <div class="mt-4 text-right">
          <button
            on:click={() => toggleModal(false)}
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 mr-2"
          >
            Hủy
          </button>
          <button class="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700">
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
