<script lang="ts">

    let {children} = $props();
</script>

<header>
  <!-- Banner trên cùng -->
  <div class="bg-[#00205b] text-center py-2">
    <p class="text-sm font-medium text-white"><a href="/">Giảm giá sốc:</a> Giảm 50% cho gói hàng năm</p>
  </div>

  <!-- Thanh điều hướng -->
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4  flex justify-between items-center py-4">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/">        
          <img src="/img/1 (1).png" alt="Logo" class="h-10">
        </a>
      </div>

      <!-- Mục menu -->
      <div class="hidden md:flex items-center space-x-6">
      
          <a href="/" class="text-gray-700 font-medium">Giới thiệu</a>
        <a href="/" class="text-gray-700 font-medium hover:text-blue-600">Giải pháp</a>
        <a href="/" class="text-gray-700 font-medium hover:text-blue-600">Bảng giá</a>
        <a href="web/plan" class="text-gray-700 font-medium hover:text-blue-600">Hướng dẫn</a>
        <a href="/" class="text-gray-700 font-medium hover:text-blue-600">Tin tức</a>
      </div>

      <!-- Hành động -->
      <div class="hidden md:flex items-center space-x-4">
        <a href="/web/login" class="text-gray-700 font-medium hover:text-blue-600">Đăng nhập</a>
        <a href="/" class="bg-[#00205b] text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700">Dùng thử miễn phí</a>
      </div>
      
  </nav>
</header>


<main>
    {@render children()}
</main>

<footer class="sm:px-20 bg-black text-white py-10">
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
      <!-- Giới thiệu -->
      <div>
        <h4 class="text-lg font-bold mb-4">Giới thiệu</h4>
        <ul class="space-y-2">
          <li>
            <img src="./img/2 2.png" alt="Logo" class="h-10 sm:mx-0">
          </li>
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
  
      <!-- Tin tức -->
      <div>
        <h4 class="text-lg font-bold mb-4">Tin tức</h4>
        <ul class="space-y-2">
          <li class="cursor-pointer hover:underline">Quản lý tồn kho</li>
          <li class="cursor-pointer hover:underline">Theo dõi vật tư</li>
          <li class="cursor-pointer hover:underline">Theo dõi tài sản</li>
          <li class="cursor-pointer hover:underline">Theo dõi phụ tùng</li>
          <li class="cursor-pointer hover:underline">Theo dõi nguyên vật liệu</li>
          <li class="cursor-pointer hover:underline">Mã vạch tồn kho</li>
          <li class="cursor-pointer hover:underline">Ứng dụng tồn kho</li>
        </ul>
      </div>
  
      <!-- Thông tin -->
      <div>
        <h4 class="text-lg font-bold mb-4">Thông tin</h4>
        <ul class="space-y-2">
          <li class="cursor-pointer hover:underline">Về chúng tôi</li>
          <li class="cursor-pointer hover:underline">Giải pháp</li>
          <li class="cursor-pointer hover:underline">Bảng giá</li>
          <li class="cursor-pointer hover:underline">Hướng dẫn</li>
          <li class="cursor-pointer hover:underline">Tin tức</li>
        </ul>
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
        font-family: "PoppinsRegular", serif;
        font-size: 14px;
    }

</style>