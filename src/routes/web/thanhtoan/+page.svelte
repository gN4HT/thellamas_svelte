<div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
    <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-4xl flex space-x-8">
      <!-- Product Information Section -->
      <div class="w-1/3 bg-gray-50 p-6 rounded-xl shadow-md">
        <h3 class="text-xl font-bold text-gray-700 mb-4">Thông tin gói thanh toán</h3>
        <div class="space-y-4">
          <div>
            <p class="text-sm font-semibold text-gray-800">Gói Premium</p>
            <p class="text-sm text-gray-500">Truy cập đầy đủ các tính năng trong 12 tháng</p>
          </div>
          <div class="border-t pt-4">
            <p class="text-sm font-bold text-gray-800">Giá:</p>
            <p class="text-lg font-extrabold text-gray-800">1,000,000 VND</p>
          </div>
        </div>
      </div>
  
      <!-- Payment Form -->
      <div class="w-2/3">
        <h2 class="text-3xl font-extrabold text-center text-gray-800 mb-8">THANH TOÁN</h2>
        <form action="#" method="POST" class="space-y-6">
          <!-- Cardholder Name -->
          <div>
            <label for="cardholder-name" class="block text-sm font-semibold text-gray-700">Tên chủ thẻ</label>
            <input
              type="text"
              id="cardholder-name"
              name="cardholder-name"
              class="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base placeholder-gray-400"
              placeholder="Nguyễn Văn A"
              required
            />
          </div>
    
          <!-- Card Number -->
          <div>
            <label for="card-number" class="block text-sm font-semibold text-gray-700">Số thẻ</label>
            <input
              type="password"
              id="card-number"
              name="card-number"
              class="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base placeholder-gray-400"
              placeholder="Nhập số thẻ của bạn"
              required
            />
          </div>
    
          <!-- Expiration Date and CVV -->
          <div class="flex space-x-4">
            <div class="flex-1">
              <label for="expiry-date" class="block text-sm font-semibold text-gray-700">Ngày hết hạn</label>
              <input
                type="text"
                id="expiry-date"
                name="expiry-date"
                class="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base placeholder-gray-400"
                placeholder="MM/YY"
                required
              />
            </div>
            <div class="flex-1">
              <label for="cvv" class="block text-sm font-semibold text-gray-700">CVV</label>
              <input
                type="password"
                id="cvv"
                name="cvv"
                class="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base placeholder-gray-400"
                placeholder="***"
                required
              />
            </div>
          </div>
    
          <!-- Billing Address -->
          <div>
            <label for="billing-address" class="block text-sm font-semibold text-gray-700">Địa chỉ thanh toán</label>
            <textarea
              id="billing-address"
              name="billing-address"
              rows="3"
              class="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base placeholder-gray-400"
              placeholder="123 Đường ABC, Phường XYZ, Thành phố HCM"
            ></textarea>
          </div>
    
          <!-- Security Note -->
          <div class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg">
            <p class="text-sm">Thông tin thanh toán của bạn được mã hóa và bảo mật tuyệt đối. Vui lòng kiểm tra kỹ thông tin trước khi gửi.</p>
          </div>
    
          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Xác nhận thanh toán
            </button>
          </div>
        </form>
    
        <p class="text-sm text-center text-gray-500 mt-6">Chúng tôi cam kết bảo mật thông tin của bạn.</p>
      </div>
    </div>
  </div>
  