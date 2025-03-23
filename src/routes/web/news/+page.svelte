<script>
    import { onMount } from 'svelte';
    
    // Sample news data with Unsplash images
    const featuredNews = {
        title: "Đội The Llamas Đoạt Chức Vô Địch",
        excerpt: "Đội của chúng ta đã đạt được chiến thắng tuyệt vời trong giải đấu vô địch gần đây...",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-20",
        category: "Thành Tích",
        readTime: "5 phút đọc"
    };

    const allNewsItems = [
        {
            title: "Ra Mắt Chương Trình Huấn Luyện Mới",
            excerpt: "Chúng tôi vui mừng thông báo về chương trình huấn luyện toàn diện mới...",
            image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
            date: "2024-03-18",
            category: "Huấn Luyện",
            readTime: "4 phút đọc"
        },
        {
            title: "Sự Kiện Cộng Đồng Thành Công",
            excerpt: "Sự kiện cộng đồng cuối tuần trước đã thu hút hơn 500 người tham gia...",
            image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
            date: "2024-03-15",
            category: "Sự Kiện",
            readTime: "3 phút đọc"
        },
        {
            title: "Điểm Sáng: Cầu Thủ John Doe",
            excerpt: "Tìm hiểu về một trong những ngôi sao đang lên và hành trình thành công của họ...",
            image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
            date: "2024-03-12",
            category: "Cầu Thủ",
            readTime: "6 phút đọc"
        },
        {
            title: "Chiến Thắng Trận Đấu Quan Trọng",
            excerpt: "Đội của chúng ta đã có chiến thắng ấn tượng trước đối thủ mạnh...",
            image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
            date: "2024-03-10",
            category: "Thành Tích",
            readTime: "4 phút đọc"
        },
        {
            title: "Buổi Tập Luyện Đặc Biệt",
            excerpt: "Các cầu thủ đã có buổi tập luyện đặc biệt với huấn luyện viên nổi tiếng...",
            image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
            date: "2024-03-08",
            category: "Huấn Luyện",
            readTime: "3 phút đọc"
        },
        {
            title: "Gặp Gỡ Các Fan Hâm Mộ",
            excerpt: "Đội bóng đã có buổi gặp gỡ thân mật với các fan hâm mộ trung thành...",
            image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
            date: "2024-03-05",
            category: "Sự Kiện",
            readTime: "5 phút đọc"
        }
    ];

    const categories = [
        { name: "Tất Cả", count: allNewsItems.length },
        { name: "Thành Tích", count: allNewsItems.filter(item => item.category === "Thành Tích").length },
        { name: "Huấn Luyện", count: allNewsItems.filter(item => item.category === "Huấn Luyện").length },
        { name: "Sự Kiện", count: allNewsItems.filter(item => item.category === "Sự Kiện").length },
        { name: "Cầu Thủ", count: allNewsItems.filter(item => item.category === "Cầu Thủ").length }
    ];

    let currentPage = 1;
    const itemsPerPage = 6;
    let selectedCategory = "Tất Cả";
    let email = "";
    let newsletterStatus = "";

    // Add slug generation function
    function generateSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Add search functionality
    let searchQuery = "";
    $: filteredNews = selectedCategory === "Tất Cả" 
        ? allNewsItems.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : allNewsItems.filter(item => 
            item.category === selectedCategory &&
            (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    // Calculate pagination
    $: totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    $: paginatedNews = filteredNews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle category change
    function handleCategoryChange(category) {
        selectedCategory = category;
        currentPage = 1; // Reset to first page when changing category
    }

    // Handle pagination
    function handlePageChange(page) {
        currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle newsletter submission
    function handleNewsletterSubmit(e) {
        e.preventDefault();
        if (!email) {
            newsletterStatus = "Vui lòng nhập email của bạn";
            return;
        }
        // Here you would typically send the email to your backend
        newsletterStatus = "Cảm ơn bạn đã đăng ký nhận tin tức!";
        email = "";
    }

    // Add share functionality
    function shareArticle(title, url) {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).catch(console.error);
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareUrl = encodeURIComponent(window.location.origin + url);
            const shareTitle = encodeURIComponent(title);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <section class="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop" 
                alt="Hình nền"
                class="w-full h-full object-cover transform scale-105 animate-slow-zoom"
            />
            <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
        </div>
        <div class="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div class="flex items-center justify-center gap-4 mb-8">
                <span class="px-4 py-2 bg-blue-600 rounded-full text-sm font-medium">Tin Tức Mới Nhất</span>
                <span class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">Cập Nhật Hàng Ngày</span>
            </div>
            <h1 class="text-6xl md:text-7xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                Tin Tức & Cập Nhật Mới Nhất
            </h1>
            <p class="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                Cập nhật những sự kiện mới nhất trong cộng đồng của chúng ta
            </p>
            <div class="mt-12 flex justify-center gap-4">
                <a href="#featured" class="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors">
                    Xem Tin Nổi Bật
                </a>
                <a href="#news" class="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full font-medium transition-colors">
                    Tất Cả Tin Tức
                </a>
            </div>
        </div>
    </section>

    <!-- Categories -->
    <section class="py-12 bg-white border-b border-gray-100">
        <div class="container mx-auto px-4 max-w-7xl">
            <div class="flex flex-wrap justify-center gap-4">
                {#each categories as category}
                    <button 
                        class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                            {selectedCategory === category.name 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                        on:click={() => handleCategoryChange(category.name)}
                    >
                        {category.name}
                        <span class="ml-2 text-xs opacity-75">({category.count})</span>
                    </button>
                {/each}
            </div>
        </div>
    </section>

  
    <!-- Featured News -->
    <section id="featured" class="py-24 bg-white">
        <div class="container mx-auto px-4 max-w-7xl">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Tin Tức Nổi Bật</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">Khám phá những câu chuyện đặc biệt từ đội bóng của chúng ta</p>
            </div>
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <a href="/web/news/{generateSlug(featuredNews.title)}" class="relative group">
                    <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div class="relative rounded-2xl overflow-hidden">
                        <img 
                            src={featuredNews.image} 
                            alt={featuredNews.title}
                            class="w-full h-[600px] object-cover transform group-hover:scale-105 transition duration-500"
                        />
                    </div>
                </a>
                <div class="space-y-8">
                    <div class="flex items-center gap-4">
                        <span class="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">{featuredNews.category}</span>
                        <span class="text-gray-500 text-sm">{new Date(featuredNews.date).toLocaleDateString('vi-VN')}</span>
                        <span class="text-gray-500 text-sm flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {featuredNews.readTime}
                        </span>
                    </div>
                    <h2 class="text-4xl font-bold leading-tight">{featuredNews.title}</h2>
                    <p class="text-gray-600 text-lg leading-relaxed">{featuredNews.excerpt}</p>
                    <div class="flex items-center gap-4">
                        <a href="/web/news/{generateSlug(featuredNews.title)}" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group">
                            Xem Thêm
                            <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </a>
                        <button 
                            class="inline-flex items-center text-gray-600 hover:text-gray-800"
                            on:click={() => shareArticle(featuredNews.title, `/web/news/${generateSlug(featuredNews.title)}`)}
                        >
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                            </svg>
                            Chia sẻ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- News Grid -->
    <section id="news" class="py-24 bg-gray-50">
        <div class="container mx-auto px-4 max-w-7xl">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Tin Tức Khác</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">Khám phá thêm những câu chuyện thú vị từ cộng đồng của chúng ta</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each paginatedNews as item}
                    <article class="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                        <a href="/web/news/{generateSlug(item.title)}" class="block">
                            <div class="relative h-64 overflow-hidden">
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                                />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div class="absolute top-4 left-4">
                                    <span class="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">{item.category}</span>
                                </div>
                            </div>
                            <div class="p-8">
                                <div class="flex items-center gap-4 mb-4">
                                    <span class="text-gray-500 text-sm">{new Date(item.date).toLocaleDateString('vi-VN')}</span>
                                    <span class="text-gray-500 text-sm flex items-center gap-1">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        {item.readTime}
                                    </span>
                                </div>
                                <h3 class="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                <p class="text-gray-600 mb-6 line-clamp-2">{item.excerpt}</p>
                                <div class="flex items-center justify-between">
                                    <span class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group">
                                        Xem Thêm
                                        <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                        </svg>
                                    </span>
                                    <button 
                                        class="inline-flex items-center text-gray-600 hover:text-gray-800"
                                        on:click|stopPropagation={() => shareArticle(item.title, `/web/news/${generateSlug(item.title)}`)}
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </a>
                    </article>
                {/each}
            </div>

            <!-- Pagination -->
            {#if totalPages > 1}
                <div class="mt-12 flex justify-center gap-2">
                    <button 
                        class="px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage === 1}
                        on:click={() => handlePageChange(currentPage - 1)}
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    
                    {#each Array(totalPages) as _, i}
                        <button 
                            class="px-4 py-2 rounded-lg transition-colors
                                {currentPage === i + 1 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100'}"
                            on:click={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    {/each}

                    <button 
                        class="px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={currentPage === totalPages}
                        on:click={() => handlePageChange(currentPage + 1)}
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            {/if}
        </div>
    </section>

 
</div>

<style>
    @keyframes slow-zoom {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(1.1);
        }
    }

    .animate-slow-zoom {
        animation: slow-zoom 20s infinite alternate;
    }
</style>
