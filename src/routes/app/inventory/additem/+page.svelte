<div class="container mx-auto ">
  <div class="flex flex-col items-start">
    <div class="mb-4 flex items-center space-x-2 text-sm text-gray-600 p-7">
      <img src="/img/package.png" alt="">
      <a href="#" class="hover:text-gray-800">Thêm Thư Mục</a>
    </div>
  
    <!-- Tiêu đề -->
    <h1 class="text-2xl font-bold mb-6 px-6">Thêm Mặt Hàng *</h1>

    <!-- Form -->
    <div class="w-full bg-white rounded-lg shadow-md p-6">
      <!-- Mục: Chi tiết sản phẩm -->
      <h2 class="text-lg font-semibold  pb-4 mb-6">CHI TIẾT MẶT HÀNG</h2>
      <div class="grid grid-cols-2 gap-8">
        <!-- Cột trái -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Số lượng *</label>
            <input type="number" value="1" class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Mức tối thiểu</label>
            <input type="number" class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Giá *</label>
            <input type="text" class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Thẻ (Tags)</label>
            <input type="text" class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Nhà cung cấp</label>
            <input type="text" class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Ghi chú</label>
            <textarea class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
        </div>

        <!-- Cột phải -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Đơn vị đo lường</label>
            <select class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500">
              <option>Đơn vị</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Cài đặt cảnh báo</label>
            <a href="#" class="w-full flex items-center justify-center border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500">
              <svg class="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C7.58 2 4 5.58 4 10V15L2 17V18H22V17L20 15V10C20 5.58 16.42 2 12 2Z" />
              </svg>
              Cài đặt cảnh báo
            </a>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Hình ảnh</label>
            <div class="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              <svg class="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM11 7H13V12H11V7ZM11 14H13V16H11V14Z" />
              </svg>
              <span class="text-gray-500 text-sm mt-2">Tối đa 8 ảnh, 30 MB</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mục: QR / Mã vạch -->
      <div class="mt-8">
        <h2 class="text-lg font-semibold  pb-4 mb-6">QR / MÃ VẠCH</h2>
        <a href="#" class="w-full block border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 text-center">THÊM QR / MÃ VẠCH</a>
        <div class="flex items-center mt-4">
          <label class="text-sm font-medium">Mặt hàng này có nhiều phiên bản</label>
          <input type="checkbox" class="ml-2" />
        </div>
      </div>

      <!-- Mục: Trường tùy chỉnh -->
      <div class="mt-8">
        <h2 class="text-lg font-semibold  pb-4 mb-6">TRƯỜNG TÙY CHỈNH</h2>
        <a href="#" class="w-full block border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 text-center">+ Thêm trường mới</a>
        <a href="#" class="w-full block border border-gray-300 rounded-lg p-3 text-sm text-gray-700 mt-3 focus:ring-2 focus:ring-blue-500 text-center">Quản lý trường tùy chỉnh</a>
        <div class="mt-4">
          <label class="block text-sm font-medium mb-1">Thêm vào thư mục</label>
          <select class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500">
            <option>Tất cả mặt hàng</option>
          </select>
        </div>
      </div>

      <!-- Nút -->
      <div class="mt-8 flex justify-end space-x-4">
        <a href="#" class="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 text-center">Hủy</a>
        <a href="#" class="px-6 py-3 bg-blue-600 text-white rounded-lg text-center">Thêm</a>
      </div>
    </div>
  </div>
</div>
