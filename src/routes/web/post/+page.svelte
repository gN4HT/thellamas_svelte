<script>
  import { onMount } from "svelte";

  let displayedPosts = [];
  let categories = [];
  let selectedCategory = "";
  let currentPage = 1;
  let totalPages = 1;
  let loading = false;
  let error = null;
  let selectedPost = null; // Lưu bài viết khi xem chi tiết

  async function fetchPosts(page = 1) {
  loading = true;
  error = null;

  try {
    let url = `https://tkhoa-innovation.com/invTracker_api/public/api/posts?page=${page}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status} - ${res.statusText}`);

    const data = await res.json();
    displayedPosts = data.data || [];
    currentPage = data.current_page || 1;
    totalPages = data.last_page || 1;
  } catch (err) {
    error = "Không thể tải bài viết. Vui lòng thử lại!";
    console.error("Lỗi khi fetch API:", err);
  } finally {
    loading = false;
  }
}


async function fetchCategories() {
  try {
    const res = await fetch("https://tkhoa-innovation.com/invTracker_api/public/api/post-categories");
    if (!res.ok) throw new Error("Lỗi khi tải danh mục bài viết");

    categories = await res.json();
  } catch (err) {
    console.error("Lỗi danh mục:", err);
  }
}


  async function fetchPostDetail(postId) {
    try {
      const res = await fetch(`https://tkhoa-innovation.com/invTracker_api/public/api/posts/${postId}`);
      if (!res.ok) throw new Error("Lỗi khi tải chi tiết bài viết");

      selectedPost = await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  function nextPage() {
    if (currentPage < totalPages) fetchPosts(currentPage + 1, selectedCategory);
  }

  function prevPage() {
    if (currentPage > 1) fetchPosts(currentPage - 1, selectedCategory);
  }

  onMount(() => {
    fetchPosts();
    fetchCategories();
  });
</script>

<div class="max-w-5xl mx-auto p-6 flex gap-6">
  <!-- Danh sách bài viết -->
  <div class="w-2/3">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Danh sách bài viết</h1>

    {#if loading}
      <div class="text-center text-blue-500 text-lg font-semibold">Đang tải...</div>
    {:else if error}
      <div class="text-center text-red-500 font-semibold">{error}</div>
    {:else if displayedPosts.length === 0}
      <div class="text-center text-gray-500">Không có bài viết nào.</div>
    {:else}
      {#each displayedPosts as post}
      <button
      aria-label="Xem chi tiết"
      class="bg-white p-4 shadow-md rounded-lg mb-4 cursor-pointer hover:bg-gray-100 w-[650px] mx-auto"
      on:click={() => fetchPostDetail(post.id)}
    >
    
        <a href={`post/${post.id}`}>
          <img 
          src="https://tkhoa-innovation.com/invTracker_api/public/storage/{post.image}"  
          alt={post.title} 
          class="w-full h-48 object-cover rounded-lg mb-3 h-[250px]"
          />
        </a>

        <a href={`post/${post.id}`}><h2 class="text-lg font-semibold text-gray-700">{post.title}</h2></a>
          <p class="text-gray-600 mt-2">{post.description}...</p>
        </button>
      {/each}

      <div class="flex justify-between items-center mt-6">
        <button 
          on:click={prevPage} 
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        <span class="text-gray-700">Page {currentPage} of {totalPages}</span>

        <button 
          on:click={nextPage} 
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    {/if}
  </div>

  <!-- Danh mục bài viết -->
  <div class="w-1/3">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Danh mục bài viết</h2>
    <select bind:value={selectedCategory} on:change={() => fetchPosts(1, selectedCategory)} class="w-full p-2 border rounded-md">
      <option value="">Tất cả danh mục</option>
      {#each categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
    </select>    
  </div>
</div>
