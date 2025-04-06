<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    
    let id;
    let post = null;
    let loading = false;
    let error = null;
  
    // Lấy id từ params khi trang được mount
    $: id = $page.params.id;
  
    async function fetchPostDetail(postId) {
  if (!postId) {
    console.error("Không có id bài viết");
    return;
  }

  loading = true;
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/posts/${postId}`);
    if (!res.ok) throw new Error("Lỗi khi tải chi tiết bài viết");

    const data = await res.json();
    if (!data || !data.id) {
      throw new Error("Bài viết không hợp lệ");
    }

    post = data;
  } catch (err) {
    error = err.message;
    console.error(err);
  } finally {
    loading = false;
  }
}

  
    onMount(() => {
      fetchPostDetail(id);
    });
  </script>
  
  <div class="max-w-3xl mx-auto p-6">
    {#if loading}
      <div class="text-center text-blue-500 text-lg font-semibold">Đang tải...</div>
    {:else if error}
      <div class="text-center text-red-500 font-semibold">{error}</div>
    {:else if post}
      <div class="bg-white p-6 shadow-lg rounded-lg">
        <img 
          src="http://127.0.0.1:8000/storage/{post.image}" 
          alt={post.title} 
          class="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h1 class="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <div class="text-gray-700 leading-relaxed">{@html post.content}</div>
      </div>
    {:else}
      <div class="text-center text-gray-500">Không tìm thấy bài viết.</div>
    {/if}
  </div>
  

  
  
  