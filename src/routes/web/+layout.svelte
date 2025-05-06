<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from "$app/navigation";

  
  let {children} = $props();
  let isMenuOpen = $state(false);
  let logoUrl = $state('/img/1 (1).png'); // Default logo
  let footerLogoUrl = $state('/img/2 2.png'); // Default footer logo
  let isAuthenticated = $state(false);

  function toggleMenu() {
      isMenuOpen = !isMenuOpen;
  }
  function logout() {
      if (browser) {
        localStorage.removeItem("token");
      }
      isAuthenticated = false;
      goto("/web/login");
  }

  function checkAuth() {
    if (browser) {
      try {
        const token = localStorage.getItem('token');
        isAuthenticated = !!token;
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        isAuthenticated = false;
      }
    }
  }

  // Close menu after navigation & check auth
  afterNavigate(() => {
      isMenuOpen = false;
      checkAuth();
  });

  onMount(async () => {
    checkAuth();

    // Fetch logo
    try {
      const backendUrl = 'https://tkhoa-innovation.com/invTracker_api/public';
      const response = await fetch(`${backendUrl}/api/logo`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && data.logo_url) {
        logoUrl = data.logo_url.startsWith('/') ? `${backendUrl}${data.logo_url}` : data.logo_url;
        footerLogoUrl = logoUrl;
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  });
</script>

<header>
<!-- Banner trên cùng -->
<div class="bg-[#00205b] text-center py-1 sm:py-2">
  <p class="text-xs sm:text-sm font-medium text-white px-2"><a href="/web/plan">Giảm giá sốc:</a> Giảm 50% cho gói hàng năm</p>
</div>

<!-- Thanh điều hướng -->
<nav class="bg-white shadow relative">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-3 sm:py-4">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/web">        
          <img src={logoUrl} alt="Logo" class="w-[100px] h-[100px]">
        </a>
      </div>

      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button 
          class="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
          on:click={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {#if isMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            {/if}
          </svg>
        </button>
      </div>

      <!-- Desktop menu -->
      <div class="hidden md:flex items-center space-x-6">
        <a href="/web/about" class="text-gray-700 text-base
hover:text-[#00205b]">Giới thiệu</a>
        <a href="/web/solution" class="text-gray-700 text-base
hover:text-[#00205b]">Giải pháp</a>
        <a href="/web/sub_plan" class="text-gray-700 text-base
hover:text-[#00205b]">Bảng giá</a>
        <a href="/web/tutorial" class="text-gray-700 text-base
hover:text-[#00205b]">Hướng dẫn</a>
        <a href="/web/post" class="text-gray-700 text-base
hover:text-[#00205b]">Tin tức</a>
      </div>

      <!-- Desktop actions -->
      <div class="hidden md:flex items-center space-x-4">
        {#if isAuthenticated}
          <a href="/app/" class="bg-[#00205b] text-white px-4 py-2 rounded-lg text-base shadow hover:bg-white  border border-[#00205b]  hover:text-[#00205b]">Vào kho</a>
          <button on:click={logout} class="bg-red-500 text-white px-4 py-2 rounded-lg text-base shadow hover:bg-white  border border-red-500  hover:text-red-500">Đăng xuất</button>
          {:else}
          <a href="/web/login" class="text-gray-700 text-base hover:text-[#00205b]">Đăng nhập</a>
          <a href="/web/register" class="bg-[#00205b] text-white px-4 py-2 rounded-lg text-base shadow  border border-[#00205b]  hover:bg-white hover:text-[#00205b]">Dùng thử miễn phí</a>
        {/if}
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="md:hidden">
      <div class="absolute left-0 right-0 top-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out transform {isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a href="/web/about" class="block px-3 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200">Giới thiệu</a>
          <a href="/web/solution" class="block px-3 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200">Giải pháp</a>
          <a href="/web/sub_plan" class="block px-3 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200">Bảng giá</a>
          <a href="/web/tutorial" class="block px-3 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200">Hướng dẫn</a>
          <a href="/web/post" class="block px-3 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200">Tin tức</a>
          <div class="border-t border-gray-200 my-2"></div>
          <a href="/web/login" class="block px-3 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200">Đăng nhập</a>
          <a href="/web/register" class="block px-3 py-2 bg-[#00205b] text-white font-medium hover:bg-blue-700 rounded-md transition-colors duration-200">Dùng thử miễn phí</a>
        </div>
      </div>
    </div>
  </div>
</nav>
</header>


<main>
  {@render children()}
</main>

<footer class="bg-black text-white py-4 sm:py-8">
<div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
    <!-- Logo và Giới thiệu -->
    <div class="space-y-4 w-full">
      <img src={footerLogoUrl} alt="Logo" class="w-[100px] h-[100px]">
      <p class="text-gray-400 text-sm sm:text-base">
        Giải pháp quản lý kho hàng thông minh cho doanh nghiệp của bạn
      </p>
    </div>

    <!-- Giải pháp -->
    <div class="w-full">
      <h4 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Giải pháp</h4>
      <ul class="space-y-2 sm:space-y-3">
        <li><a href="/web/solution" class="text-gray-400 hover:text-white transition-colors duration-200">Ô tô</a></li>
        <li><a href="/web/solution" class="text-gray-400 hover:text-white transition-colors duration-200">Nha khoa</a></li>
        <li><a href="/web/solution" class="text-gray-400 hover:text-white transition-colors duration-200">Sự kiện</a></li>
        <li><a href="/web/solution" class="text-gray-400 hover:text-white transition-colors duration-200">Giáo dục</a></li>
        <li><a href="/web/solution" class="text-gray-400 hover:text-white transition-colors duration-200">Bán lẻ</a></li>
        <li><a href="/web/solution" class="text-gray-400 hover:text-white transition-colors duration-200">Đồ cổ</a></li>
        <li><a href="/web/solution" class="text-gray-400 hover:text-white transition-colors duration-200">Chính phủ</a></li>
        <li><a href="/web/solution" class="text-gray-400 hover:text-white transition-colors duration-200">Hàng không</a></li>
      </ul>
    </div>

    <!-- Tin tức -->
    <div class="w-full">
      <h4 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Tin tức</h4>
      <ul class="space-y-2 sm:space-y-3">
        <li><a href="/web/post" class="text-gray-400 hover:text-white transition-colors duration-200">Quản lý tồn kho</a></li>
        <li><a href="/web/post" class="text-gray-400 hover:text-white transition-colors duration-200">Theo dõi vật tư</a></li>
        <li><a href="/web/post" class="text-gray-400 hover:text-white transition-colors duration-200">Theo dõi tài sản</a></li>
        <li><a href="/web/post" class="text-gray-400 hover:text-white transition-colors duration-200">Theo dõi phụ tùng</a></li>
        <li><a href="/web/post" class="text-gray-400 hover:text-white transition-colors duration-200">Theo dõi nguyên vật liệu</a></li>
        <li><a href="/web/post" class="text-gray-400 hover:text-white transition-colors duration-200">Mã vạch tồn kho</a></li>
        <li><a href="/web/post" class="text-gray-400 hover:text-white transition-colors duration-200">Ứng dụng tồn kho</a></li>
      </ul>
    </div>

    <!-- Thông tin -->
    <div class="w-full">
      <h4 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Thông tin</h4>
      <ul class="space-y-2 sm:space-y-3">
        <li><a href="/web/about" class="text-gray-400 hover:text-white transition-colors duration-200">Giới thiệu</a></li>
        <li><a href="/web/solution" class="text-gray-400 hover:text-white transition-colors duration-200">Giải pháp</a></li>
        <li><a href="/web/sub_plan" class="text-gray-400 hover:text-white transition-colors duration-200">Bảng giá</a></li>
        <li><a href="/web/tutorial" class="text-gray-400 hover:text-white transition-colors duration-200">Hướng dẫn</a></li>
        <li><a href="/web/post  " class="text-gray-400 hover:text-white transition-colors duration-200">Tin tức</a></li>
      </ul>
    </div>
  </div>

  <!-- Copyright -->
  <div class="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
    <p class="text-center text-gray-400 text-sm sm:text-base">
      © 2024 The Llamas. All rights reserved.
    </p>
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

