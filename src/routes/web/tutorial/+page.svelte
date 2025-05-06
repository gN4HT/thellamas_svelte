<script>
    import { fade } from 'svelte/transition';
  </script>
  
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white" in:fade>
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Hướng dẫn sử dụng</h1>
        <p class="text-gray-600 text-lg">Khám phá tất cả các tính năng của ứng dụng</p>
      </div>
  
      <div class="space-y-8">
        <!-- Section 1: Getting Started -->
        <section class="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-transform duration-300">
          <div class="flex items-center mb-6">
            <div class="bg-blue-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-900">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-800">1. Bắt đầu sử dụng</h2>
          </div>
          <div class="space-y-4">
            <p class="text-gray-700">Chào mừng bạn đến với ứng dụng của chúng tôi! Để bắt đầu sử dụng, bạn cần:</p>
            <ul class="space-y-3">
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-700 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Đăng ký tài khoản mới hoặc đăng nhập nếu đã có tài khoản</span>
              </li>
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-700 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Hoàn thiện thông tin cá nhân trong phần hồ sơ</span>
              </li>
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-700 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Làm quen với giao diện chính của ứng dụng</span>
              </li>
            </ul>
          </div>
        </section>
  
        <!-- Section 2: Main Features -->
        <section class="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-transform duration-300">
          <div class="flex items-center mb-6">
            <div class="bg-purple-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-900">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-800">2. Các tính năng chính</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
              <div class="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-700 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
                <h3 class="font-semibold text-lg">Quản lý dự án</h3>
              </div>
              <p class="text-gray-600">Tạo và quản lý các dự án của bạn một cách hiệu quả</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border border-purple-100 hover:shadow-md transition-shadow">
              <div class="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-700 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <h3 class="font-semibold text-lg">Cộng tác nhóm</h3>
              </div>
              <p class="text-gray-600">Làm việc cùng với các thành viên trong nhóm</p>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border border-green-100 hover:shadow-md transition-shadow">
              <div class="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-700 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                <h3 class="font-semibold text-lg">Báo cáo và thống kê</h3>
              </div>
              <p class="text-gray-600">Theo dõi tiến độ và hiệu suất công việc</p>
            </div>
            <div class="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border border-orange-100 hover:shadow-md transition-shadow">
              <div class="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-700 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
                <h3 class="font-semibold text-lg">Tích hợp công cụ</h3>
              </div>
              <p class="text-gray-600">Kết nối với các công cụ phát triển khác</p>
            </div>
          </div>
        </section>
  
   
        <!-- Section 4: Support -->
        <section class="py-24 bg-gradient-to-r from-[#00205b] to-[#001a4a] text-white">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
              <h2 class="text-4xl font-bold mb-8">Sẵn Sàng Tối Ưu Hóa Quản Lý Kho?</h2>
              <p class="text-xl mb-12 text-white/90">
                Hãy để chúng tôi giúp doanh nghiệp của bạn phát triển với giải pháp quản lý kho thông minh
              </p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div class="bg-white/10 p-6 rounded-xl backdrop-blur-sm flex flex-col items-center text-center">
                  <div class="w-12 h-12 mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <p class="text-lg">Email</p>
                  <p class="text-white/80">support@thellamas.com</p>
                </div>
                <div class="bg-white/10 p-6 rounded-xl backdrop-blur-sm flex flex-col items-center text-center">
                  <div class="w-12 h-12 mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </div>
                  <p class="text-lg">Điện Thoại</p>
                  <p class="text-white/80">(84) 708-957-718</p>
                </div>
                <div class="bg-white/10 p-6 rounded-xl backdrop-blur-sm flex flex-col items-center text-center">
                  <div class="w-12 h-12 mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <p class="text-lg">Địa Chỉ</p>
                  <p class="text-white/80">Số 07 Đường số 11 – Cityland Park Hills, Phường 10, Gò Vấp, TP. HCM</p>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row justify-center gap-6">
                <a 
                  href="/web/login" 
                  class="bg-white text-[#00205b] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300"
                >
                  Gửi Yêu Cầu
                </a>
                <a 
                  href="/web/sub_plan" 
                  class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#00205b] transition-all duration-300"
                >
                  Xem Bảng Giá
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
  
  <style>
    /* Add any custom styles here */
  </style>