<script>
  import { onMount } from "svelte";

  let isOpen = false;
  let selectedField = "";

  let fieldDetails = {
    "Ngày": "Loại trường: Chọn ngày",
    "Check": "Loại trường: Check",
    "Email": "Loại trường: Nhập email",
    "Số điện thoại": "Loại trường: Nhập số điện thoại",
    "Liên kết web": "Loại trường: Nhập liên kết web",
    " Văn bản": "Loại trường:  Văn bản, Giới hạn ký tự: 190",
  };
</script>

<div class="p-8 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
  <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
    <!-- Header Section -->
    <div class="p-6 bg-gradient-to-l from-indigo-500 to-blue-900 text-white">
      <h2 class="text-2xl font-semibold">Trường Tùy Chỉnh</h2>
    </div>

    <!-- Table Section -->
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
                📦
              </span>
              <div>
                <p class="text-gray-900 font-medium">Tên sản phẩm</p>
              </div>
            </td>
            <td class="py-4 px-4">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
                <div class="absolute left-0.5 top-0.5 bg-white h-5 w-5 rounded-full peer-checked:translate-x-full peer-checked:border-blue-600 transition-transform"></div>
              </label>
            </td>
            <td class="py-4 px-4 text-gray-900">Số seri</td>
            <td class="py-4 px-4 flex items-center gap-8">
              <a href="#" class="text-[#00205B] hover:text-blue-800 transition"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
                <path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path>
              </svg>
</a>
<a href="#" class="text-red-800 hover:text-red-900 transition">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
</td>
          </tr>
        </tbody>
      </table>

      <!-- Add Custom Field Button -->
      <div class="mt-6 text-right">
        <button
          class="px-5 py-2 bg-blue-900 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
          on:click={() => (isOpen = true)}
        >
          + Thêm trường tùy chỉnh
        </button>
      </div>
    </div>
  </div>
</div>

{#if isOpen}
  <div class="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/20 z-50">
    <div class="bg-white w-3/4 max-w-4xl rounded-3xl shadow-xl overflow-hidden">
      <div class="flex">
        <!-- Phần bên trái -->
        <div class="w-1/2 bg-gradient-to-b from-gray-100 to-gray-50 p-8">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Tạo Trường Tùy Chỉnh</h2>
          <p class="text-sm text-gray-600 mb-6">
            Bạn có thể thêm 1 trường tùy chỉnh trên gói Miễn phí. 
            <a href="#" class="text-blue-600 underline font-medium">Xem các gói</a>
          </p>

          <div class="grid grid-cols-2 gap-4">
            {#each Object.keys(fieldDetails) as field}
              <button
                class="flex flex-col items-center justify-center bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 transition duration-300"
                on:click={() => (selectedField = field)}
              >
                <span class="text-xl font-medium text-gray-700">{field}</span>
              </button>
            {/each}
          </div>

          <p class="text-center text-sm text-gray-500 mt-6">HOẶC</p>
          <a href="#" class="block text-center text-red-500 text-sm mt-2 underline">Tạo trường riêng của bạn</a>
        </div>

        <!-- Phần bên phải -->
        <div class="w-1/2 bg-white p-8 border-l border-gray-200 flex items-center justify-center">
          {#if selectedField}
            <div class="p-6 bg-gray-50 rounded-2xl shadow-lg transition duration-300 w-full">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">{selectedField}</h3>
              <p class="text-sm text-gray-600 mb-6">{fieldDetails[selectedField]}</p>

              {#if selectedField === 'Ngày'}
                <input type="date" class="w-full p-3 border rounded-lg shadow-sm focus:outline-none" />
              {/if}

              {#if selectedField === 'Check'}
                <div class="flex items-center space-x-4">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" class="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                  </label>
                  <input type="text" class="w-full p-3 border rounded-lg shadow-sm" placeholder="Nhập dữ liệu liên quan" />
                </div>
              {/if}

              {#if selectedField === 'Email'}
                <input type="email" class="w-full p-3 border rounded-lg shadow-sm" placeholder="Nhập email của bạn" />
              {/if}

              {#if selectedField === 'Số điện thoại'}
                <input type="tel" class="w-full p-3 border rounded-lg shadow-sm" placeholder="Nhập số điện thoại" />
              {/if}

              {#if selectedField === 'Liên kết web'}
                <input type="url" class="w-full p-3 border rounded-lg shadow-sm" placeholder="Nhập URL" />
              {/if}

              {#if selectedField === ' Văn bản'}
                <textarea class="w-full p-3 border rounded-lg shadow-sm" rows="4" placeholder="Nhập văn bản tại đây"></textarea>
              {/if}

              <button class="mt-4 px-5 py-2 bg-blue-900 text-white rounded-lg" on:click={() => (isOpen = false)}>Lưu</button>
            </div>
          {:else}
            <p class="text-gray-500 text-center">Chọn một trường để cấu hình chi tiết</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
