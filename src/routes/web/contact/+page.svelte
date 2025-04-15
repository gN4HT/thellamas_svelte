<div class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="bg-white shadow-lg rounded-lg p-10 w-full max-w-2xl">
        <h1 class="text-3xl font-bold mb-8 text-gray-800">Gửi yêu cầu</h1>
        <form action="#" method="POST" enctype="multipart/form-data">
            <!-- Email -->
            <div class="mb-6">
                <label for="email" class="block text-lg font-medium text-gray-700">Địa chỉ email của bạn <span class="text-red-500">*</span></label>
                <input type="email" id="email" name="email" class="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base" required>
            </div>

            <!-- Môn học -->
            <div class="mb-6">
                <label for="subject" class="block text-lg font-medium text-gray-700">Môn học <span class="text-red-500">*</span></label>
                <input type="text" id="subject" name="subject" class="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base" required>
            </div>

            <!-- Sự miêu tả -->
            <div class="mb-6">
                <label for="description" class="block text-lg font-medium text-gray-700">Sự miêu tả <span class="text-red-500">*</span></label>
                <textarea id="description" name="description" rows="6" class="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base" placeholder="Vui lòng nhập các chi tiết của yêu cầu của bạn..." required></textarea>
            </div>

            <!-- Loại khách hàng -->
            <div class="mb-6">
                <label for="customer-type" class="block text-lg font-medium text-gray-700">Loại khách hàng</label>
                <select id="customer-type" name="customer-type" class="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base">
                    <option value="">-</option>
                    <option value="personal">Cá nhân</option>
                    <option value="organization">Tổ chức</option>
                </select>
                <p class="mt-2 text-sm text-gray-500">Vui lòng chọn loại kế hoạch sắp xếp của bạn</p>
            </div>

            <!-- Tài liệu đính kèm -->
            <div class="mb-8">
                <label for="attachments" class="block text-lg font-medium text-gray-700">Tài liệu đính kèm</label>
                <div class="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
                    <input type="file" id="attachments" name="attachments" class="hidden">
                    <label for="attachments" class="text-indigo-600 cursor-pointer">Thêm tập tin hoặc thả tập tin ở đây</label>
                </div>
            </div>

            <!-- Submit button -->
            <button type="submit" class="w-full bg-indigo-600 text-white py-3 px-4 text-lg rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Gửi</button>
        </form>
    </div>
</div>
