<script>
    import { page } from '$app/stores';
    export let data;
    
    // Format date
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Generate slug for related news
    function generateSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Share functionality
    function shareArticle() {
        if (navigator.share) {
            navigator.share({
                title: data.article.title,
                url: window.location.href
            }).catch(console.error);
        } else {
            const shareUrl = encodeURIComponent(window.location.href);
            const shareTitle = encodeURIComponent(data.article.title);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
        }
    }
</script>

{#if data.article}
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <!-- Article Header -->
        <div class="relative h-[500px] flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0">
                <img 
                    src={data.article.image} 
                    alt={data.article.title}
                    class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
            </div>
            <div class="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <div class="flex items-center justify-center gap-4 mb-8">
                    <span class="px-4 py-2 bg-blue-600 rounded-full text-sm font-medium">{data.article.category}</span>
                    <span class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">{data.article.readTime}</span>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">{data.article.title}</h1>
                <div class="flex items-center justify-center gap-4 text-sm text-gray-200">
                    <span>{formatDate(data.article.date)}</span>
                    <span>•</span>
                    <span>Tác giả: {data.article.author}</span>
                </div>
            </div>
        </div>

        <!-- Article Content -->
        <article class="py-16">
            <div class="container mx-auto px-4 max-w-4xl">
                <div class="prose prose-lg mx-auto">
                    {@html data.article.content}
                </div>

                <!-- Tags -->
                <div class="mt-12 flex flex-wrap gap-2">
                    {#each data.article.tags as tag}
                        <span class="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                            #{tag}
                        </span>
                    {/each}
                </div>

                <!-- Share Buttons -->
                <div class="mt-12 flex items-center justify-center gap-4">
                    <button 
                        class="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        on:click={shareArticle}
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                        </svg>
                        Chia sẻ bài viết
                    </button>
                </div>
            </div>
        </article>

        <!-- Related News -->
        {#if data.article.relatedNews && data.article.relatedNews.length > 0}
            <section class="py-16 bg-gray-50">
                <div class="container mx-auto px-4 max-w-7xl">
                    <h2 class="text-3xl font-bold text-center mb-12">Bài Viết Liên Quan</h2>
                    <div class="grid md:grid-cols-2 gap-8">
                        {#each data.article.relatedNews as news}
                            <a href="/web/news/{generateSlug(news.title)}" class="group">
                                <article class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                                    <div class="relative h-64 overflow-hidden">
                                        <img 
                                            src={news.image} 
                                            alt={news.title}
                                            class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                                        />
                                    </div>
                                    <div class="p-6">
                                        <div class="flex items-center gap-4 mb-4">
                                            <span class="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">{news.category}</span>
                                            <span class="text-gray-500 text-sm">{formatDate(news.date)}</span>
                                        </div>
                                        <h3 class="text-xl font-bold group-hover:text-blue-600 transition-colors">{news.title}</h3>
                                    </div>
                                </article>
                            </a>
                        {/each}
                    </div>
                </div>
            </section>
        {/if}
    </div>
{:else}
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
            <p class="text-gray-600 mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
            <a href="/web/news" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                Quay lại trang tin tức
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
            </a>
        </div>
    </div>
{/if}

<style>
    :global(.prose) {
        max-width: none;
    }
    :global(.prose h2) {
        color: #1a365d;
        font-weight: 700;
        margin-top: 2em;
        margin-bottom: 1em;
    }
    :global(.prose p) {
        margin-bottom: 1.5em;
        line-height: 1.8;
    }
</style> 