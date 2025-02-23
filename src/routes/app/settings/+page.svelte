
    <div>
        <!-- Tiêu đề -->
        <h1 class="text-3xl font-semibold pb-6 border-b border-gray-500">Hồ Sơ Người Dùng</h1>

        <!-- Thông tin cá nhân -->
        <div class="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">Thông Tin Cá Nhân</h2>
            <form action="#" method="POST">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-600">Họ</label>
                        <input type="text" name="first_name" class="w-full border rounded-lg p-2 mt-1" placeholder="Nhập họ">
                    </div>
                    <div>
                        <label class="block text-gray-600">Tên</label>
                        <input type="text" name="last_name" class="w-full border rounded-lg p-2 mt-1" placeholder="Nhập tên">
                    </div>
                    <div>
                        <label class="block text-gray-600">Email</label>
                        <input type="email" name="email" class="w-full border rounded-lg p-2 mt-1" placeholder="Nhập email">
                    </div>
                    <div>
                        <label class="block text-gray-600">Số Điện Thoại</label>
                        <input type="text" name="phone" class="w-full border rounded-lg p-2 mt-1" placeholder="Nhập số điện thoại">
                    </div>
                    <div>
                        <label class="block text-gray-600">Chức Vụ</label>
                        <select name="job_function" class="w-full border rounded-lg p-2 mt-1">
                            <option>Chọn chức vụ</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-600">Vai Trò Nhóm</label>
                        <select name="team_role" class="w-full border rounded-lg p-2 mt-1">
                            <option>Chủ Sở Hữu</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="mt-4 bg-[#00205b] text-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#00205b] border border-[#00205b]">
                    Lưu Thay Đổi
                </button>
            </form>
        </div>

        <!-- Đổi mật khẩu -->
        <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Đổi Mật Khẩu</h2>
            <form action="#" method="POST">
                <div class="grid grid-cols-2 gap-4">
                    <div class="relative">
                        <label class="block text-gray-600">Mật Khẩu Hiện Tại</label>
                        <input type="password" name="current_password" class="w-full border rounded-lg p-2 mt-1" placeholder="Nhập mật khẩu hiện tại">
                        <span class="absolute right-3 top-9 cursor-pointer text-gray-500">👁️</span>
                    </div>
                    <div>
                        <label class="block text-gray-600">Mật Khẩu Mới</label>
                        <input type="password" name="new_password" class="w-full border rounded-lg p-2 mt-1" placeholder="Nhập mật khẩu mới">
                    </div>
                </div>
                <button type="submit" class="mt-4 bg-[#00205b] text-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#00205b] border border-[#00205b]">
                    Lưu Thay Đổi
                </button>
                <a href="#" class="text-[#00205b] ml-4">Quên mật khẩu?</a>
            </form>
        </div>
    </div>