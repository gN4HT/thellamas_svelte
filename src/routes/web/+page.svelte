<div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <section class="text-center bg-white p-8 rounded shadow-md">
      <h1 class="text-4xl font-bold text-[#00205b] mb-4">Website quản lý hàng tồn kho </h1>
      <p class="text-lg text-gray-600 mb-6">
       Website quản lý kho dành cho các doanh nghiệp nhỏ để quản lý hàng tồn kho thực tế, bao gồm vật tư, nguyên vật liệu, công cụ và thiết bị.
      </p>
      <div class="flex justify-center gap-4">
        <a href="#" class="bg-[#00205b] text-white font-bold py-2 px-4 rounded">Hãy thử The Llamas miễn phí</a>
        <a href="#" class="border border-[#00205b] text-[#00205b] font-bold py-2 px-4 rounded">Xem tất cả dịch vụ &#8250;</a>
      </div>
    </section>

    <!-- Slide Section -->
    <section class="my-8 bg-gray-50 p-8 rounded shadow-md">
      <div class="h-72 relative overflow-hidden rounded">
        {#each slides as slide, index}
          <img
            src={slide.image}
            alt={`Slide ${slide.id}`}
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style="opacity: {index === currentSlide ? 1 : 0};"
          />
        {/each}
    
        <!-- Navigation buttons -->
        <button on:click={prevSlide} class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full shadow p-2">
          ❮
        </button>
        <button on:click={nextSlide} class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full shadow p-2">
          ❯
        </button>
      </div>
    </section>

    <!-- Description Section -->
    <section class="text-center bg-white p-8 rounded shadow-md">
      <p class="text-xl font-bold text-gray-800">
        Mong muốn của chúng tôi là được hợp tác nhiều doanh nghiệp hơn để phát triển việc quản lý, kiểm toán kho hàng
      </p>
    </section>

    <!-- Icons Section -->
    <section class="my-8 bg-gray-50 p-8 rounded shadow-md">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <img src="./img/1 (1).png" alt="Icon 1" class="w-24 h-24 mx-auto">
        <img src="./img/1 (1).png" alt="Icon 2" class="w-24 h-24 mx-auto">
        <img src="./img/1 (1).png" alt="Icon 3" class="w-24 h-24 mx-auto">
        <img src="./img/1 (1).png" alt="Icon 4" class="w-24 h-24 mx-auto">
      </div>
    </section>

    <!-- Organization Section -->
    <section class="my-8 bg-white p-8 rounded shadow-md">
      <div class="flex flex-wrap gap-8 items-center">
        <!-- Description -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-[#00205b] mb-4">
            Tổ chức và tự động hóa kho hàng của bạn chỉ với một nút bấm.
          </h2>
          <ul class="space-y-4">
            <li class="flex items-center">
              <img src="./img/Folder1.png" alt="Folder Icon" class="w-6 h-6 mr-4">
              Dễ dàng tải danh sách hàng tồn kho hiện có của bạn lên The Llamas.
            </li>
            <li class="flex items-center">
              <img src="./img/Folder1.png" alt="Folder Icon" class="w-6 h-6 mr-4">
              Sắp xếp các thư mục hàng tồn kho theo vị trí, loại và nhiều tiêu chí khác.
            </li>
            <li class="flex items-center">
              <img src="./img/Folder1.png" alt="Folder Icon" class="w-6 h-6 mr-4">
              Thêm thông tin chi tiết về mục quan trọng bằng các trường tùy chỉnh.
            </li>
          </ul>
          <div class="flex gap-4 mt-6">
            <button class="bg-[#00205b] text-white font-bold py-2 px-4 rounded">Hãy thử The Llamas miễn phí</button>
            <button class="border border-[#00205b] text-[#00205b] font-bold py-2 px-4 rounded">Xem tất cả dịch vụ</button>
          </div>
        </div>

        <!-- Image -->
        <div class="flex-1">
          <img src="./img/Main-after-login 1.png" alt="Hình sản phẩm" class="rounded shadow-md">
        </div>
      </div>
    </section>
    <section class="my-8 bg-white p-8 rounded shadow-md">
      <div class="flex flex-wrap gap-8 items-center">

          <!-- Image -->
          <div class="flex-1">
            <img src="./img/Main-after-login 1.png" alt="Hình sản phẩm" class="rounded shadow-md">
          </div>
        <!-- Description -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-[#00205b] mb-4">
            Tổ chức và tự động hóa kho hàng của bạn chỉ với một nút bấm.
          </h2>
          <ul class="space-y-4">
            <li class="flex items-center">
              <img src="./img/Folder1.png" alt="Folder Icon" class="w-6 h-6 mr-4">
              Dễ dàng tải danh sách hàng tồn kho hiện có của bạn lên The Llamas.
            </li>
            <li class="flex items-center">
              <img src="./img/Folder1.png" alt="Folder Icon" class="w-6 h-6 mr-4">
              Sắp xếp các thư mục hàng tồn kho theo vị trí, loại và nhiều tiêu chí khác.
            </li>
            <li class="flex items-center">
              <img src="./img/Folder1.png" alt="Folder Icon" class="w-6 h-6 mr-4">
              Thêm thông tin chi tiết về mục quan trọng bằng các trường tùy chỉnh.
            </li>
          </ul>
          <div class="flex gap-4 mt-6">
            <button class="bg-[#00205b] text-white font-bold py-2 px-4 rounded">Hãy thử The Llamas miễn phí</button>
            <button class="border border-[#00205b] text-[#00205b] font-bold py-2 px-4 rounded">Xem tất cả dịch vụ</button>
          </div>
        </div>

      
      </div>
    </section>
    <section class="my-8 bg-white p-8 rounded shadow-md">
      <div class="flex flex-wrap gap-8 items-center">
        <!-- Description -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-[#00205b] mb-4">
            Tổ chức và tự động hóa kho hàng của bạn chỉ với một nút bấm.
          </h2>
          <ul class="space-y-4">
            <li class="flex items-center">
              <img src="./img/Folder1.png" alt="Folder Icon" class="w-6 h-6 mr-4">
              Dễ dàng tải danh sách hàng tồn kho hiện có của bạn lên The Llamas.
            </li>
            <li class="flex items-center">
              <img src="./img/Folder1.png" alt="Folder Icon" class="w-6 h-6 mr-4">
              Sắp xếp các thư mục hàng tồn kho theo vị trí, loại và nhiều tiêu chí khác.
            </li>
            <li class="flex items-center">
              <img src="./img/Folder1.png" alt="Folder Icon" class="w-6 h-6 mr-4">
              Thêm thông tin chi tiết về mục quan trọng bằng các trường tùy chỉnh.
            </li>
          </ul>
          <div class="flex gap-4 mt-6">
            <button class="bg-[#00205b] text-white font-bold py-2 px-4 rounded">Hãy thử The Llamas miễn phí</button>
            <button class="border border-[#00205b] text-[#00205b] font-bold py-2 px-4 rounded">Xem tất cả dịch vụ</button>
          </div>
        </div>

        <!-- Image -->
        <div class="flex-1">
          <img src="./img/Main-after-login 1.png" alt="Hình sản phẩm" class="rounded shadow-md">
        </div>
      </div>
    </section>
  </div>

  <script>
    import { onMount } from 'svelte';
  
    let currentSlide = 0;
    const slides = [
      { id: 1, image: './static/img/slide.png/800x400?text=Slide+1' },
      { id: 2, image: './static/img/slide.png/800x400?text=Slide+2' },
      { id: 3, image: './static/img/slide.png/800x400?text=Slide+3' },
      { id: 4, image: './static/img/slide.png/800x400?text=Slide+4' },
      { id: 5, image: './static/img/slide.png/800x400?text=Slide+5' },
    ];
  
    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
    };
  
    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    };
  
    const visibleSlides = () => {
      const totalSlides = slides.length;
      return [
        slides[(currentSlide - 1 + totalSlides) % totalSlides],
        slides[currentSlide],
        slides[(currentSlide + 1) % totalSlides],
      ];
    };
  
    // Auto-play setup
    onMount(() => {
      const interval = setInterval(nextSlide, 2000); // Chuyển slide mỗi 3 giây
      return () => clearInterval(interval); // Dọn dẹp khi component bị hủy
    });
    
  </script>
  