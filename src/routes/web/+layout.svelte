<header>
  <!-- Banner trên cùng -->
  <div class="bg-gray-400 text-center py-2">
    <p class="text-sm font-medium text-white">Giảm giá sốc: Giảm 50% cho gói hàng năm</p>
  </div>

  <!-- Thanh điều hướng -->
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" sveltekit:navigate>        
          <img src="/img/1 (1).png" alt="Logo" class="h-10">
        </a>
      </div>

      <!-- Mục menu -->
      <div class="hidden md:flex items-center space-x-6">
        <div class="relative group">
          <a href="#" class="text-gray-700 font-medium">Đặc trưng</a>
          <div class="absolute hidden group-hover:block bg-white shadow rounded-lg mt-2 w-40">
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tính năng 1</a>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tính năng 2</a>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tính năng 3</a>
          </div>
        </div>
        <a href="#" class="text-gray-700 font-medium hover:text-blue-600">Giải pháp</a>
        <a href="#" class="text-gray-700 font-medium hover:text-blue-600">Doanh nghiệp</a>
        <a href="/web/plan" sveltekit:navigate class="text-gray-700 font-medium hover:text-blue-600">Bảng giá</a>
        <a href="#" class="text-gray-700 font-medium hover:text-blue-600">Học hỏi</a>
        <a href="/web/post" sveltekit:navigate class="text-gray-700 font-medium hover:text-blue-600">Bài viết</a>
      </div>

      <!-- Hành động -->
      <div class="flex items-center space-x-4">
        <a href="/web/login" sveltekit:navigate class="text-gray-700 font-medium hover:text-blue-600">Đăng nhập</a>
        <a href="#" class="bg-[#00205b] text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700">Dùng thử miễn phí</a>
      </div>
    </div>
  </nav>
</header>


<main>
  <slot />
</main>

<footer class="bg-black text-white py-10">
  <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Ngành công nghiệp -->
    <div>
      <h4 class="text-lg font-bold mb-4">Ngành công nghiệp</h4>
      <ul class="space-y-2">
        <li><img src="./img/2 2.png" alt="" class="h-10 w-auto"></li>
        <li class="cursor-pointer hover:underline">Ô tô</li>
        <li class="cursor-pointer hover:underline">Nha khoa</li>
        <li class="cursor-pointer hover:underline">Sự kiện</li>
        <li class="cursor-pointer hover:underline">Giáo dục</li>
        <li class="cursor-pointer hover:underline">Bán lẻ</li>
        <li class="cursor-pointer hover:underline">Đồ cổ</li>
        <li class="cursor-pointer hover:underline">Chính phủ</li>
        <li class="cursor-pointer hover:underline">Hàng không</li>
      
      </ul>
    </div>

    <!-- Ứng dụng -->
    <div>
      <h4 class="text-lg font-bold mb-4">Ứng dụng</h4>
      <ul class="space-y-2">
        <li class="cursor-pointer hover:underline">Quản lý tồn kho</li>
        <li class="cursor-pointer hover:underline">Theo dõi vật tư</li>
        <li class="cursor-pointer hover:underline">Theo dõi tài sản</li>
        <li class="cursor-pointer hover:underline">Theo dõi phụ tùng</li>
        <li class="cursor-pointer hover:underline">Theo dõi nguyên vật liệu</li>
        <li class="cursor-pointer hover:underline">Theo dõi công cụ</li>
        <li class="cursor-pointer hover:underline">Theo dõi thiết bị</li>
        <li class="cursor-pointer hover:underline">Theo dõi thiết bị bảo hộ cá nhân</li>
        <li class="cursor-pointer hover:underline">Theo dõi hàng tồn kho bán hàng</li>
        <li class="cursor-pointer hover:underline">Mã vạch tồn kho</li>
        <li class="cursor-pointer hover:underline">Ứng dụng tồn kho</li>
      </ul>
    </div>

    <!-- Thông tin -->
    <div>
      <h4 class="text-lg font-bold mb-4">Thông tin</h4>
      <ul class="space-y-2">
        <li class="cursor-pointer hover:underline">Bảng giá</li>
        <li class="cursor-pointer hover:underline">Blog</li>
        <li class="cursor-pointer hover:underline">Về chúng tôi</li>
        <li class="cursor-pointer hover:underline">Đánh giá</li>
        <li class="cursor-pointer hover:underline">Liên hệ</li>
        <li class="cursor-pointer hover:underline">Trung tâm trợ giúp</li>
        <li class="cursor-pointer hover:underline">Điều khoản dịch vụ</li>
      </ul>
    </div>

    <!-- Tải xuống & Đăng ký -->
    <div>
      <h4 class="text-lg font-bold mb-4">Liên lạc</h4>
      
      <h4 class="text-lg font-bold mb-4">Nhận tin tức</h4>
      <p class="text-sm mb-4">
        Tất cả thông tin về hàng tồn kho & kiến thức bạn cần, gửi thẳng đến hộp thư của bạn.
      </p>
      <form class="flex flex-col space-y-2">
        <input type="email" placeholder="Địa chỉ email" class="p-2 text-black rounded-md">
        <button type="submit" class="bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-gray-200">
          Gửi
        </button>
      </form>
    </div>
  </div>
</footer>

<style>
    @import "tailwindcss";
    @font-face {
      font-family: "PoppinsRegular";
      src: url("/fonts/PoppinsRegular.eot");
      src: url("/fonts/PoppinsRegular.eot") format("embedded-opentype"),
        url("/fonts/PoppinsRegular.woff2") format("woff2"),
        url("/fonts/PoppinsRegular.woff") format("woff"),
        url("/fonts/PoppinsRegular.ttf") format("truetype"),
        url("/fonts/PoppinsRegular.svg#PoppinsRegular") format("svg");
        font-display: swap;
    }
    header, main, footer {  
      font-family: "PoppinsRegular";
      font-size: 14px;
    }
    
    </style>