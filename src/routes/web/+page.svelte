<script lang="ts">
  import { Motion } from "svelte-motion";
  import Marquee from '../../lib/components/Marquee.svelte';
  import Reviewcard from '../../lib/components/Reviewcard.svelte';
  import LayoutGrid from "../../lib/components/LayoutGrid.svelte";
  import { onMount } from 'svelte';

  export let text: string = "";
  export let duration = 0.3;
  let _class: string = "";
  export { _class as class };

  const reviews = [
    {
      name: "Minh Hoàng",
      username: "@MinhHoang",
      body: "Dịch vụ rất tuyệt vời. Tôi rất hài lòng, cảm ơn các bạn!",
      img: "https://avatar.vercel.sh/hoang",
    },
    {
      name: "Thu Hà",
      username: "@ThuHa",
      body: "Đúng như mong đợi của tôi. Rất đáng để trải nghiệm!",
      img: "https://avatar.vercel.sh/ha",
    },
    {
      name: "Anh Tuấn",
      username: "@AnhTuan",
      body: "Giao diện dễ dùng và hiệu quả. Cảm ơn đội ngũ hỗ trợ nhiệt tình.",
      img: "https://avatar.vercel.sh/tuan",
    },
    {
      name: "Mai Lan",
      username: "@MaiLan",
      body: "Dịch vụ quá tuyệt, đã thêm vào danh sách yêu thích của tôi!",
      img: "https://avatar.vercel.sh/lan",
    },
    {
      name: "Ngọc Bích",
      username: "@NgocBich",
      body: "Rất chuyên nghiệp và tận tâm. Tôi sẽ giới thiệu cho bạn bè.",
      img: "https://avatar.vercel.sh/bich",
    },
    {
      name: "Hải Đăng",
      username: "@HaiDang",
      body: "Những tính năng này giúp công việc của tôi dễ dàng hơn rất nhiều. Cảm ơn các bạn!",
      img: "https://avatar.vercel.sh/dang",
    },
  ];

  let firstRow = reviews.slice(0, reviews.length / 2);
  let secondRow = reviews.slice(reviews.length / 2);

  let cards = [
    {
      id: 1,
      content: "Quản lý hàng tồn kho",
      body: "Theo dõi, sắp xếp và quản lý tất cả hàng tồn kho của doanh nghiệp bạn.",
      class: "md:col-span-2",
      thumbnail:
              "https://i.pinimg.com/736x/fe/48/a1/fe48a154f8578c2fd8ba0226bbb9a272.jpg",
    },
    {
      id: 2,
      content: "Mã vạch",
      body: "Theo dõi tài sản của doanh nghiệp bạn, bao gồm thiết bị, công cụ, máy móc, phương tiện, v.v.",
      class: "col-span-1",
      thumbnail:
              "https://i.pinimg.com/564x/a8/86/86/a88686f3c6a17621f65561d2a94d6768.jpg",
    },
    {
      id: 3,
      content: "Theo dõi tài sản",
      body: "Theo dõi sản phẩm và hàng hóa bạn bán cho khách hàng.",
      class: "col-span-1",
      thumbnail:
              "https://i.pinimg.com/564x/22/27/4a/22274a50da113c7c6b7323e0e7a96c50.jpg",
    },
    {
      id: 4,
      content: "Vật tư & Vật tư tiêu hao",
      body: "Theo dõi nguồn cung cấp và nguyên liệu thô mà doanh nghiệp của bạn tiêu thụ để cung cấp dịch vụ của mình.",
      class: "md:col-span-2",
      thumbnail:
              "https://i.pinimg.com/564x/e4/0d/8b/e40d8bbbb4deb19c9f0fcf2009dd3559.jpg",
    },
   
  ];

  const slides = [
    {
      image: "/img/slide1.jpg",
      title: "Quản lý hàng tồn kho thông minh",
      description: "Giải pháp toàn diện cho doanh nghiệp của bạn"
    },
    {
      image: "/img/slide2.jpg",
      title: "Theo dõi tài sản hiệu quả",
      description: "Quản lý tài sản doanh nghiệp dễ dàng"
    },
    {
      image: "/img/slide1.jpg",
      title: "Báo cáo chi tiết",
      description: "Phân tích dữ liệu chuyên sâu"
    }
  ];

  let currentSlide = 0;
  let slideInterval: ReturnType<typeof setInterval>;

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  }

  function goToSlide(index: number) {
    currentSlide = index;
  }

  onMount(() => {
    slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  });

  const icons = [
    { src: "./img/1 (1).png", alt: "Icon 1" },
    { src: "./img/1 (1).png", alt: "Icon 2" },
    { src: "./img/1 (1).png", alt: "Icon 3" },
    { src: "./img/1 (1).png", alt: "Icon 4" },
    { src: "./img/1 (1).png", alt: "Icon 5" },
    { src: "./img/1 (1).png", alt: "Icon 6" },
    { src: "./img/1 (1).png", alt: "Icon 7" },
    { src: "./img/1 (1).png", alt: "Icon 8" }
  ];

  let currentIconIndex = 0;
  let iconInterval: ReturnType<typeof setInterval>;

  function nextIcon() {
    currentIconIndex = (currentIconIndex + 1) % (icons.length - 3);
  }

  function prevIcon() {
    currentIconIndex = (currentIconIndex - 1 + (icons.length - 4)) % (icons.length - 3);
  }

  onMount(() => {
    iconInterval = setInterval(nextIcon, 3000);
    return () => clearInterval(iconInterval);
  });

  $: maxIndex = icons.length - 4;

  const gridIcons = [
    { src: "./img/logo3.png", alt: "Icon 1" },
    { src: "./img/logo4.png", alt: "Icon 2" },
    { src: "./img/logo5.png", alt: "Icon 3" },
    { src: "./img/logo6.png", alt: "Icon 4" },
    { src: "./img/logo3.png", alt: "Icon 5" },
    { src: "./img/logo4.png", alt: "Icon 6" },
    { src: "./img/logo5.png", alt: "Icon 7" },
    { src: "./img/logo6.png", alt: "Icon 8" }
  ];

  // Duplicate icons for infinite scroll effect
  $: displayIcons = [...gridIcons, ...gridIcons];

  let currentGridIndex = 0;
  let gridInterval: ReturnType<typeof setInterval>;

  function nextGridIcon() {
    currentGridIndex++;
    if (currentGridIndex >= gridIcons.length) {
      currentGridIndex = 0;
    }
  }

  function prevGridIcon() {
    currentGridIndex--;
    if (currentGridIndex < 0) {
      currentGridIndex = gridIcons.length - 1;
    }
  }

  onMount(() => {
    gridInterval = setInterval(nextGridIcon, 3000);
    return () => clearInterval(gridInterval);
  });

  $: maxGridIndex = gridIcons.length - 1;
</script>

<div class="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-[1500px] overflow-hidden">
  <!-- Hero Section -->
  <section class="text-center bg-white p-4 sm:p-6 md:p-8 rounded shadow-md">
    <div class="max-w-full overflow-hidden">
      <div class="mb-4">
        <!-- Animated Heading -->
        <Motion
          initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
          transition={{
            ease: "easeOut",
            duration: 0.5
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            y: 0
          }}
          let:motion
        >
          <h1
            use:motion
            class="text-[#00205b] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl"
          >
            Phần mềm quản lý hàng tồn kho đơn giản.
          </h1>
        </Motion>
      </div>

      <div class="mb-6">
        <!-- Animated Paragraph -->
        <Motion
          initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
          transition={{
            ease: "easeOut",
            duration: 0.5,
            delay: 0.5
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            y: 0
          }}
          let:motion
        >
          <p
            use:motion
            class="text-gray-600 text-sm sm:text-base md:text-lg"
          >
            Phần mềm quản lý kho tốt nhất dành cho các doanh nghiệp nhỏ để quản lý hàng tồn kho thực tế, bao gồm vật tư, nguyên vật liệu, công cụ và thiết bị.
          </p>
        </Motion>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col sm:flex-row justify-center gap-4">
      <a href="/web/register" class="bg-[#00205b] text-white font-bold py-2 px-4 rounded text-sm sm:text-base">
        Hãy thử The Llamas miễn phí
      </a>
      <a href="/web/about" class="border border-[#00205b] text-[#00205b] font-bold py-2 px-4 rounded text-sm sm:text-base">
        Xem tất cả dịch vụ &#8250;
      </a>
    </div>
  </section>

  <!-- Custom Slider -->
  <section class="my-4 sm:my-6 md:my-8 bg-gray-50 p-4 sm:p-6 md:p-8 rounded shadow-md">
    <div class="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden">
      {#each slides as slide, i}
        <div 
          class="absolute w-full h-full transition-transform duration-700 ease-in-out"
          style="transform: translateX({(i - currentSlide) * 100}%)"
        >
          <div class="relative w-full h-full">
            <img 
              src={slide.image} 
              alt={slide.title} 
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-white p-4 sm:p-6 md:p-8">
              <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-center text-white drop-shadow-lg">{slide.title}</h2>
              <p class="text-sm sm:text-base md:text-xl text-center text-white drop-shadow-lg">{slide.description}</p>
            </div>
          </div>
        </div>
      {/each}

      <!-- Navigation Buttons -->
      <button 
        class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 sm:p-2"
        on:click={prevSlide}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 sm:p-2"
        on:click={nextSlide}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Dots Navigation -->
      <div class="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {#each slides as _, i}
          <button 
            class="w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 {i === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}"
            on:click={() => goToSlide(i)}
          ></button>
        {/each}
      </div>
    </div>
  </section>

  <section class="text-center bg-white p-4 sm:p-6 md:p-8 rounded shadow-md">
    <div class="max-w-full overflow-hidden">
      <Motion
        initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
          delay: 0.5

        }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
          y: 0
        }}
        let:motion
      >
        <h2
          use:motion
          class="text-gray-800 font-bold text-base sm:text-lg md:text-xl lg:text-2xl"
        >
          Mong muốn của chúng tôi là được hợp tác nhiều doanh nghiệp hơn để phát triển việc quản lý, kiểm toán kho hàng
        </h2>
      </Motion>
    </div>
  </section>

  <section class="my-4 sm:my-6 md:my-8 bg-white p-4 sm:p-6 md:p-8 rounded shadow-md">
    <div class="relative">
      <div class="overflow-hidden">
        <div 
          class="flex transition-transform duration-500 ease-in-out"
          style="transform: translateX(-{currentGridIndex * 25}%)"
        >
          {#each displayIcons as icon, i}
            <div class="w-1/4 flex-shrink-0 px-1 sm:px-2">
              <img 
                src={icon.src} 
                alt={icon.alt} 
                class="w-26 h-26 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto object-contain transition-all duration-300 hover:scale-110"
              >
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <section class="my-4 sm:my-6 md:my-8 bg-white p-4 sm:p-6 md:p-8 rounded shadow-md">
    <div class="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-center">
      <!-- Description -->
      <div class="flex-1">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-[#00205b] mb-4">
          Tổ chức và tự động hóa kho hàng của bạn chỉ với một nút bấm.
        </h2>
        <ul class="space-y-3 sm:space-y-4">
          <li class="flex items-center">
            <img src="./img/Folder1.png" alt="Folder Icon" class="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4">
            <span class="text-sm sm:text-base">Dễ dàng tải danh sách hàng tồn kho hiện có của bạn lên The Llamas.</span>
          </li>
          <li class="flex items-center">
            <img src="./img/Folder1.png" alt="Folder Icon" class="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4">
            <span class="text-sm sm:text-base">Sắp xếp các thư mục hàng tồn kho theo vị trí, loại và nhiều tiêu chí khác.</span>
          </li>
          <li class="flex items-center">
            <img src="./img/Folder1.png" alt="Folder Icon" class="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4">
            <span class="text-sm sm:text-base">Thêm thông tin chi tiết về mục quan trọng bằng các trường tùy chỉnh.</span>
          </li>
        </ul>
        <div class="flex flex-col sm:flex-row gap-4 mt-6">
          <a href="/web/register" class="bg-[#00205b] text-white font-bold py-2 px-4 rounded text-sm sm:text-base">Hãy thử The Llamas miễn phí</a>
          <a href="/web/about" class="border border-[#00205b] text-[#00205b] font-bold py-2 px-4 rounded text-sm sm:text-base">Xem tất cả dịch vụ</a>
        </div>
      </div>

      <!-- Image -->
      <div class="flex-1 w-full max-w-lg mx-auto">
        <img src="./img/Main-after-login 1.png" alt="Hình sản phẩm" class="w-full rounded shadow-md">
      </div>
    </div>
  </section>
  <div class="flex flex-col items-center">
    <h2 class="text-center text-2xl font-bold mb-4">
     GIẢI PHÁP
    </h2>
    <div class="flex justify-center items-center w-64 md:h-[40rem] md:w-[1500px]">
      <LayoutGrid {cards} />
    </div>
  </div>
  <div class="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-4"><h2>Ý KIẾN KHÁCH HÀNG</h2></div>

  <div class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border-blue-500 bg-background py-12 sm:py-16 md:py-20">
    <Marquee pauseOnHover className="[--duration:20s]">
      {#each firstRow as item}
        <Reviewcard {...item} />
      {/each}
    </Marquee>
    <Marquee reverse pauseOnHover className="[--duration:20s]">
      {#each secondRow as item}
        <Reviewcard {...item} />
      {/each}
    </Marquee>
    <div class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
    <div class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
  </div>
</div>

<style>
  .custom-marquee {
    --duration: 20s;
  }
</style>


