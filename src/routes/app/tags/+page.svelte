<script lang="ts">
  import { onMount } from "svelte";
  import { apiFetch } from "$lib/api";
  import type { Item } from "../../../models/item";
  import type { Folder } from "../../../models/folder";
  import Paginations from "../../../components/Paginations.svelte";
  import Folders from "../../../components/Folders.svelte";
  import Items from "../../../components/Items.svelte";
  import type { Tag } from "../../../models/tag";
  interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
  }

  // State Management
  let tags: Tag[] = [];
  let folders: Folder[] = [];
  let items: Item[] = [];
  let selectedTag: Tag | null = null;
  let isLoading = false;
  let error: string | null = null;

  // UI State
  let showModal = false;
  let newTag = "";
  let isEditingTag = false;
  let editedTagName = "";
  let searchQuery = "";

  // Pagination
  let folderPage = 1;
  let itemPage = 1;
  const ITEMS_PER_PAGE = 10;

  // Computed Properties
  $: filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  $: paginatedFolders = folders.slice(
    (folderPage - 1) * ITEMS_PER_PAGE,
    folderPage * ITEMS_PER_PAGE
  );

  $: paginatedItems = items.slice(
    (itemPage - 1) * ITEMS_PER_PAGE,
    itemPage * ITEMS_PER_PAGE
  );

  // API Functions
  async function fetchTags() {
    isLoading = true;
    error = null;
    try {
      const response = await apiFetch("tags");
      console.log('Tags response:', response);
      
      // Xử lý response theo cấu trúc API
      if (response && Array.isArray(response)) {
        tags = response;
        if (tags.length > 0 && !selectedTag) {
          selectTag(tags[0]);
        }
      } else {
        throw new Error('Invalid tags response format');
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tags:", err);
      error = "Không thể tải danh sách tags";
      tags = [];
    } finally {
      isLoading = false;
    }
  }

  async function fetchFoldersAndItems(tagId: number) {
    if (!tagId) return;
    
    isLoading = true;
    error = null;
    
    try {
        // Tách riêng 2 request để xử lý độc lập
        try {
            const foldersRes = await apiFetch(`folders/tag/${tagId}`);
            folders = Array.isArray(foldersRes) ? foldersRes : [];
        } catch (folderErr) {
            console.log('Không có folders:', folderErr);
            folders = [];
        }

        try {
            const itemsRes = await apiFetch(`items/tag/${tagId}`);
            items = Array.isArray(itemsRes) ? itemsRes : [];
        } catch (itemErr) {
            console.log('Không có items:', itemErr);
            items = [];
        }

        // Reset pagination
        folderPage = 1;
        itemPage = 1;

    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        error = "Không thể tải dữ liệu";
    } finally {
        isLoading = false;
    }
  }

  async function addTag() {
    if (newTag.trim().length < 2) {
      error = "Tên tag phải có ít nhất 2 ký tự!";
      return;
    }

    isLoading = true;
    error = null;
    try {
      const response = await apiFetch("tags", {
        method: "POST",
        body: { name: newTag.trim() }
      });

      if (response) {
        newTag = "";
        showModal = false;
        await fetchTags();
      }
    } catch (err) {
      console.error("Lỗi khi thêm tag:", err);
      error = "Không thể thêm tag mới";
    } finally {
      isLoading = false;
    }
  }

  async function updateTagName() {
    if (!selectedTag || editedTagName.trim() === "") return;

    isLoading = true;
    error = null;
    try {
      const response = await apiFetch(`tags/${selectedTag.id}`, {
        method: "PUT",
        body: { name: editedTagName.trim() }
      });

      if (response) {
        selectedTag.name = editedTagName;
        isEditingTag = false;
        await fetchTags();
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật tag:", err);
      error = "Không thể cập nhật tên tag";
    } finally {
      isLoading = false;
    }
  }

  async function deleteTag(tag: Tag) {
    if (!confirm(`Bạn có chắc chắn muốn xóa tag "${tag.name}" không?`)) return;

    isLoading = true;
    error = null;
    try {
      await apiFetch(`tags/${tag.id}`, {
        method: "DELETE"
      });

      tags = tags.filter(t => t.id !== tag.id);
      if (selectedTag?.id === tag.id) {
        selectedTag = tags[0] || null;
        folders = [];
        items = [];
      }
    } catch (err) {
      console.error("Lỗi khi xóa tag:", err);
      error = "Không thể xóa tag";
    } finally {
      isLoading = false;
    }
  }

  // UI Functions
  function selectTag(tag: Tag) {
    if (!tag || !tag.id) {
      console.error('Invalid tag:', tag);
      return;
    }
    console.log('Selecting tag:', tag);
    selectedTag = tag;
    fetchFoldersAndItems(tag.id);
  }

  function startEditingTag() {
    if (selectedTag) {
      isEditingTag = true;
      editedTagName = selectedTag.name;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (isEditingTag) {
        updateTagName();
      } else if (showModal) {
        addTag();
      }
    } else if (event.key === 'Escape') {
      if (isEditingTag) {
        isEditingTag = false;
      } else if (showModal) {
        showModal = false;
      }
    }
  }

  onMount(() => {
    fetchTags();
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });
</script>

<!-- Loading Overlay -->
{#if isLoading}
  <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00205b]"></div>
  </div>
{/if}

<!-- Error Message -->
{#if error}
  <div class="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
    {error}
    <button class="ml-4 underline" on:click={() => error = null}>Đóng</button>
  </div>
{/if}

<!-- Main Content -->
<div class="bg-gray-100 h-screen flex w-full">
  <!-- Sidebar -->
  <div class="bg-white p-4 border-r border-gray-300 overflow-y-auto small-scrollbar w-[250px]">
    <!-- Search Box -->
    <div class="flex items-center border border-gray-300 rounded p-2 mb-4">
      <i class="fa-solid fa-magnifying-glass text-gray-500"></i>
      <input
        type="text"
        placeholder="Tìm kiếm tags"
        bind:value={searchQuery}
        class="w-full outline-none border-none pl-2"
      />
    </div>

    <!-- Tags List -->
    <div class="space-y-1">
      {#each filteredTags as tag (tag.id)}
        <div
          class="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer {selectedTag?.id === tag.id ? 'bg-gray-100 text-[#00205b]' : 'text-gray-500'}"
          on:click={() => selectTag(tag)}
        >
          <i class="fa-solid fa-tag mr-2 text-xl"></i>
          <span class="truncate flex-1" title={tag.name}>
            {tag.name}
          </span>
          <button
            class="opacity-0 group-hover:opacity-100 text-red-500 p-1 hover:bg-red-50 rounded"
            on:click|stopPropagation={() => deleteTag(tag)}
            title="Xóa tag"
          >
            <i class="fa-solid fa-trash-can text-sm"></i>
          </button>
        </div>
      {/each}
    </div>
  </div>

  <!-- Main Area -->
  <div class="flex-1 overflow-y-auto">
    <!-- Header -->
    <div class="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
      {#if isEditingTag}
        <input
          type="text"
          bind:value={editedTagName}
          on:blur={updateTagName}
          class="text-2xl font-semibold outline-none border-b border-[#00205b] px-2"
          autofocus
        />
      {:else}
        <h1 
          class="text-2xl font-semibold flex items-center gap-2 cursor-pointer"
          on:click={startEditingTag}
        >
          {selectedTag?.name || "Chọn tag"}
          {#if selectedTag}
            <i class="fa-solid fa-pen text-sm text-gray-400"></i>
          {/if}
        </h1>
      {/if}

      <button
        on:click={() => showModal = true}
        class="bg-[#00205b] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#001639]"
      >
        <i class="fa-solid fa-plus"></i>
        Thêm Tag
      </button>
    </div>

    <!-- Content -->
    <div class="p-4">
        {#if !selectedTag}
            <!-- Chưa chọn tag nào -->
            <div class="text-center py-16">
                <i class="fa-solid fa-tag text-4xl text-gray-400 mb-4"></i>
                <h2 class="text-xl text-gray-500 mb-2">Vui lòng chọn một tag</h2>
            </div>
        {:else if folders.length === 0 && items.length === 0}
            <!-- Không có dữ liệu -->
            <div class="text-center py-16">
                <i class="fa-solid fa-tag text-4xl text-gray-400 mb-4"></i>
                <h2 class="text-xl text-gray-500 mb-2">Không có dữ liệu</h2>
                <p class="text-gray-400">
                    Thêm thư mục hoặc mặt hàng vào tag này để hiển thị chúng ở đây
                </p>
            </div>
        {:else}
            <!-- Hiển thị folders nếu có -->
            {#if folders.length > 0}
                <section class="mb-8">
                    <h2 class="text-xl font-semibold mb-4">Thư mục ({folders.length})</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {#each paginatedFolders as folder (folder.id)}
                            <Folders {folder} />
                        {/each}
                    </div>
                    <div class="mt-4">
                        <Paginations 
                            totalItems={folders.length} 
                            bind:currentPage={folderPage} 
                        />
                    </div>
                </section>
            {/if}

            <!-- Hiển thị items nếu có -->
            {#if items.length > 0}
                <section>
                    <h2 class="text-xl font-semibold mb-4">Mặt hàng ({items.length})</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {#each paginatedItems as item (item.id)}
                            <Items {...item} />
                        {/each}
                    </div>
                    <div class="mt-4">
                        <Paginations 
                            totalItems={items.length} 
                            bind:currentPage={itemPage} 
                        />
                    </div>
                </section>
            {/if}
        {/if}
    </div>
  </div>
</div>

<!-- Add Tag Modal -->
{#if showModal}
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-96">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">Thêm Tag Mới</h2>
        <button 
          on:click={() => showModal = false}
          class="text-gray-400 hover:text-gray-600"
        >
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      
      <div class="p-4">
        <label class="block text-sm font-medium mb-2">Tên tag</label>
        <input
          type="text"
          bind:value={newTag}
          placeholder="Nhập tên tag"
          class="w-full p-2 border rounded focus:border-[#00205b] outline-none"
        />
      </div>

      <div class="flex justify-end gap-2 p-4 bg-gray-50 rounded-b-lg">
        <button
          on:click={() => showModal = false}
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          Hủy
        </button>
        <button
          on:click={addTag}
          disabled={newTag.trim().length < 2 || isLoading}
          class="px-4 py-2 bg-[#00205b] text-white rounded hover:bg-[#001639] disabled:opacity-50"
        >
          {isLoading ? 'Đang thêm...' : 'Thêm tag'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .small-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .small-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  .small-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
</style>