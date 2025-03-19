<div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="flex bg-white p-10 rounded-lg shadow-lg space-x-10">
        <!-- Form Đặt Lại Mật Khẩu -->
        <div class="w-96">
            <h1 class="text-2xl font-bold mb-4">Đặt lại mật khẩu</h1>
            <p class="text-sm text-gray-600 mb-6">Nhập địa chỉ email liên kết với tài khoản của bạn và chúng tôi sẽ gửi một liên kết để đặt lại mật khẩu.</p>
            <form class="flex flex-col space-y-4">
                <input 
                    type="email" 
                    id="email" 
                    placeholder="Email" 
                    required 
                    class="p-3 border-b border-gray-300 focus:outline-none focus:border-[#00205b]">
                <button 
                    type="submit" 
                    class="bg-[#00205b] text-white py-3 rounded-lg hover:bg-red-600 transition duration-200">
                    Gửi liên kết
                </button>
            </form>
            <p class="text-sm text-center mt-4">Mới sử dụng? <a href="quenmk" class="text-blue-500 hover:underline">Tạo tài khoản</a></p>
        </div>

        <!-- Ảnh -->
        <div class="flex items-center justify-center">
            <img src="/img/ảnh tượng trưng.png" alt="Hình minh họa" class="max-w-sm rounded-lg shadow-md">
        </div>
    </div>
</div>
