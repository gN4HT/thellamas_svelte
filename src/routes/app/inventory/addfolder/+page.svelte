<div class="container mx-auto px-6 py-8">
    <div class="mb-4 flex items-center space-x-2 text-sm text-gray-600">
        <img src="/img/package.png" alt="">
        <button class="hover:text-gray-800">Thêm Thư Mục</button>
    </div>

    <!-- Tiêu đề -->
    <h1 class="text-2xl font-bold mb-8">Tên thư mục *</h1>

    <!-- Bố cục chính -->
    <div class="grid grid-cols-2 gap-8">
        <!-- Cột trái -->
        <div>
            <!-- Tags -->
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1">Thẻ (Tags)
                    <input type="text"
                           class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"/></label>
            </div>

            <!-- Ghi chú -->
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1">Ghi chú
                    <textarea
                            class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"></textarea></label>
            </div>

            <!-- QR / Barcodes -->
            <div class="mb-4">
                <div class="block text-sm font-medium mb-1">QR / Mã vạch
                    <a href="#"
                       class="block w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 text-center focus:ring-2 focus:ring-blue-500">
                        <svg class="w-5 h-5 inline-block mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM11 7H13V12H11V7ZM11 14H13V16H11V14Z"/>
                        </svg>
                        Thêm QR / Mã vạch
                    </a></div>
            </div>

            <!-- Trường tùy chỉnh -->
            <div>
                <div class="block text-sm font-medium mb-1">TRƯỜNG TÙY CHỈNH</div>
                <div class="space-y-3">
                    <a href="#"
                       class="block w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 text-center focus:ring-2 focus:ring-blue-500">
                        + Thêm trường mới
                    </a>
                    <a href="#"
                       class="block w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 text-center focus:ring-2 focus:ring-blue-500">
                        Quản lý trường tùy chỉnh
                    </a>
                </div>
            </div>

            <!-- Thêm vào thư mục -->
            <div class="mt-4">
                <label class="block text-sm font-medium mb-1">Thêm vào thư mục
                    <select class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500">
                        <option>Tất cả mục</option>
                    </select></label>
            </div>
        </div>

        <!-- Cột phải -->
        <div>
            <!-- Ảnh -->
            <div class="block text-sm font-medium mb-1">Ảnh</div>
            <div class="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <svg class="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                     fill="currentColor">
                    <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM11 7H13V12H11V7ZM11 14H13V16H11V14Z"/>
                </svg>
                <span class="text-gray-500 text-sm mt-2">Tối đa 8 ảnh, 30 MB tổng</span>
            </div>
        </div>
    </div>

    <!-- Nút hành động -->
    <div class="mt-8 flex justify-end space-x-4">
        <div class="px-6 py-3 border border-gray-300 rounded-lg text-gray-600">Hủy</div>
        <div class="px-6 py-3 bg-blue-600 text-white rounded-lg">Thêm</div>
    </div>
</div>
  