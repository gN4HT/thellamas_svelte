<script lang="ts">
  import { onMount } from "svelte";
  import { apiFetch } from "$lib/api";
  import type { Item } from "../../../models/item";
  import type { Folder } from "../../../models/folder";
  import Paginations from "../../../components/Paginations.svelte";
  import Folders from "../../../components/Folders.svelte";
  import Items from "../../../components/Items.svelte";


  // Định nghĩa kiểu cho dữ liệu
  interface Tag {
    id: number;
    name: string;
    selected?: boolean;
  }


  // Các biến trạng thái với type rõ ràng
  let tags: Tag[] = [];
  let folders: Folder[] = [];
  let items: Item[] = [];
  let selectedTag = "";
  let showModal = false;
  let newTag = "";
  let isEditingTag = false;
  let editedTagName = "";
  let searchQuery = "";

  let folderPage = 1;
  let itemPage = 1;
  const itemsPerPage = 10;

  // Hàm lấy danh sách tags
  async function fetchTags(): Promise<void> {
    try {
      const data: Tag[] = await apiFetch("http://127.0.0.1:8000/api/tags");
      tags = data || [];
      if (tags.length > 0) {
        selectedTag =
          tags.find(tag => tag.selected)?.name || tags[0].name || "";
        fetchFoldersAndItems(selectedTag);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tags:", error);
    }
  }

  // Hàm lấy danh sách folders và items theo tag
  async function fetchFoldersAndItems(tagName: string): Promise<void> {
    const selectedTagObj = tags.find(tag => tag.name === tagName);
    if (!selectedTagObj) return;

    try {
      const fetchedFolders: Folder[] = await apiFetch(
        `http://127.0.0.1:8000/api/folders/tag/${selectedTagObj.id}`
      );
      folders = Array.isArray(fetchedFolders) ? fetchedFolders : [];

      const fetchedItems: Item[] = await apiFetch(
        `http://127.0.0.1:8000/api/items/tag/${selectedTagObj.id}`
      );
      items = Array.isArray(fetchedItems) ? fetchedItems : [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách folders hoặc items:", error);
      folders = [];
      items = [];
    }
  }

  // Thêm tag mới
  async function addTag(): Promise<void> {
    if (newTag.trim().length < 2) {
      alert("Tên tag phải có ít nhất 2 ký tự!");
      return;
    }

    try {
      const response = await apiFetch("http://127.0.0.1:8000/api/tags", {
        method: "POST",
        body: JSON.stringify({ name: newTag })
      });

      if (response) {
        newTag = "";
        showModal = false;
        await fetchTags(); // Cập nhật danh sách tags mới nhất
      }
    } catch (error) {
      console.error("Lỗi khi thêm tag:", error);
    }
  }

  // Cập nhật tên tag
  async function updateTagName(): Promise<void> {
    if (!selectedTag || editedTagName.trim() === "") return;

    try {
      const selectedTagObj = tags.find(tag => tag.name === selectedTag);
      if (!selectedTagObj) return;

      const updatedTag: Tag = await apiFetch(
        `http://127.0.0.1:8000/api/tags/${selectedTagObj.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ name: editedTagName })
        }
      );

      if (updatedTag) {
        selectedTag = updatedTag.name;
        await fetchTags(); // Lấy lại danh sách tags mới từ API
        isEditingTag = false;
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật tag:", error);
    }
  }

  // Xóa tag
  async function deleteTag(tagId: number): Promise<void> {
    if (!confirm("Bạn có chắc chắn muốn xóa tag này không?")) return;

    try {
      const response = await apiFetch(`http://127.0.0.1:8000/api/tags/${tagId}`, {
        method: "DELETE"
      });

      if (response) {
        await fetchTags(); // Cập nhật danh sách tags mới nhất
        selectedTag = "";
        folders = [];
        items = [];
      }
    } catch (error) {
      console.error("Lỗi khi xóa tag:", error);
    }
  }

  // Lọc danh sách tag theo search query
  function filteredTags(): Tag[] {
    return tags.filter(tag =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Chọn tag
  function selectTag(tagName: string): void {
    selectedTag = tagName;
    fetchFoldersAndItems(tagName);
  }

  // Hàm phân trang cho folders
  function paginatedFolders(): Folder[] {
    const start = (folderPage - 1) * itemsPerPage;
    return folders.slice(start, start + itemsPerPage);
  }

  // Hàm phân trang cho items
  function paginatedItems(): Item[] {
    const start = (itemPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }

  // Chuyển trang
  function goToPage(type: 'folder' | 'item', event: Event): void {
    const target = event.target as HTMLInputElement;
    let value = parseInt(target.value) || 1;
    let maxPage =
      Math.ceil(
        (type === "folder" ? folders.length : items.length) / itemsPerPage
      ) || 1;
    let pageValue = Math.max(1, Math.min(maxPage, value));
    if (type === "folder") folderPage = pageValue;
    else itemPage = pageValue;
  }

  onMount(fetchTags);
</script>

<!-- Giao diện -->
{#if tags.length > 0}
<div class="bg-gray-100 h-screen flex w-full">
  <!-- Sidebar -->
  <div class="bg-white p-4 border-r border-gray-300 overflow-y-auto small-scrollbar w-[250px]">
    <div class="flex justify-between items-center border border-gray-300 rounded p-2 mb-4">
      <i class="fa-solid fa-magnifying-glass text-gray-500"></i>
      <input
        type="text"
        placeholder="Tìm kiếm tags"
        bind:value={searchQuery}
        class="w-full outline-none border-none pl-2"
      />
    </div>

    <!-- Danh sách tags -->
    <div>
      {#each filteredTags() as tag (tag.id)}
      <div
        class="flex items-center p-2 cursor-pointer rounded {selectedTag === tag.name ? 'text-[#00205b]' : 'text-gray-500 hover:bg-gray-100'}"
        on:click={() => selectTag(tag.name)}
      >
        <span class="mr-2 text-xl"><i class="fa-solid fa-tag"></i></span>
        {#if tag.name.length > 15}
          {tag.name.slice(0, 15) + '...'}
        {:else}
          {tag.name}
        {/if}
        <span
          class="ml-auto text-red-500 cursor-pointer"
          on:click|stopPropagation={() => deleteTag(tag.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="currentColor"
          >
            <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" />
          </svg>
        </span>
      </div>
      {/each}
    </div>
  </div>

  <!-- Nội dung chính -->
  <div class="flex flex-col w-full p-3">
    <div class="flex justify-between align-center border-b border-gray-300 p-4">
      {#if isEditingTag}
        <input
          type="text"
          bind:value={editedTagName}
          on:blur={updateTagName}
          on:keydown={(e) => e.key === 'Enter' && updateTagName()}
          class="border-none outline-none text-3xl text-[#00205B]"
          autofocus
        />
      {:else}
        <h2
          class="flex items-center gap-2 text-3xl ml-3 cursor-pointer {selectedTag ? 'text-[#00205B]' : 'text-gray-500'}"
          on:click={() => { if (selectedTag) { isEditingTag = true; editedTagName = selectedTag; } }}
        >
          {#if selectedTag.length > 15}
            {selectedTag.slice(0, 15) + '...'}
          {:else}
            {selectedTag || "Chọn tag"}
          {/if}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z" />
          </svg>
        </h2>
      {/if}
      <button on:click={() => (showModal = true)} class="px-4 py-2 bg-[#00205b] text-white rounded flex items-center">
        <span class="text-xl mr-2 bg-white/10 px-2 rounded">+</span>Thêm Tag
      </button>
    </div>

    {#if folders.length > 0 || items.length > 0}
      {#if folders.length > 0}
        <h2 class="text-gray-500 text-3xl mt-10 ml-4">Thư mục</h2>
        <div class="grid grid-cols-5 gap-4 p-4">
          {#each paginatedFolders() as folder (folder.id)}
          <Folders {folder} />
          {/each}
        </div>
        <div class="flex mt-5 justify-between">
          <Paginations totalItems={folders.length} bind:currentPage={folderPage} />
        </div>
      {/if}

      {#if items.length > 0}
        <h2 class="text-gray-500 text-3xl mt-10 ml-4">Mặt hàng</h2>
        <div class="grid grid-cols-5 gap-4 p-4">
          {#each paginatedItems() as item (item.id)}
          <Items {...item} />
          {/each}
        </div>
        <div class="flex mt-5 justify-between">
          <Paginations totalItems={items.length} bind:currentPage={itemPage} />
        </div>
      {/if}
    {:else}
      <!-- Hiển thị khi không có dữ liệu -->
      <div class="flex-1 p-10 flex flex-col items-center justify-center">
        <div class="text-center flex flex-col items-center gap-4">
          <i class="fa-solid fa-tags text-gray-500 text-4xl"></i>
          <h2 class="text-gray-500 text-4xl">Không có thông tin nào trong tag này</h2>
          <p class="text-[#00205b]">Thêm thư mục hoặc sản phẩm vào tag để hiển thị chúng ở đây.</p>
        </div>
      </div>
    {/if}
  </div>
</div>
{:else}
  <div class="flex items-center justify-center h-screen bg-gray-100 m-auto">
    <div class="text-center flex flex-col items-center gap-10">
      <i class="fa-solid fa-tags text-gray-500 text-6xl"></i>
      <h2 class="text-gray-500 text-4xl">Bạn đang không có thẻ tags nào</h2>
      <button on:click={() => (showModal = true)} class="px-4 py-2 bg-[#00205b] text-white rounded flex items-center">
        <span class="text-xl mr-2 bg-white/10 px-2 rounded">+</span>Thêm Tag
      </button>
      <p class="text-[#00205b]">
        Thẻ tags là gì? Làm sao để sử dụng chúng?
      </p>
    </div>
  </div>
{/if}

<!-- Modal Thêm Tag -->
{#if showModal}
  <div class="fixed inset-0 flex items-center justify-center bg-black/40">
    <div class="bg-white rounded-lg shadow-lg w-96">
      <div class="flex justify-between items-center p-4 border-b bg-gray-200">
        <h2 class="text-lg font-semibold">Thêm Tag</h2>
        <button on:click={() => (showModal = false)} class="text-gray-600 text-xl">
          &times;
        </button>
      </div>
      <div class="p-4">
        <label class="block text-sm font-medium">Tên tag</label>
        <input
          type="text"
          bind:value={newTag}
          class="w-full p-2 border rounded mt-1"
          placeholder="Nhập tên tag"
        />
      </div>
      <div class="p-4 flex justify-end">
        <button
          on:click={addTag}
          class="px-4 py-2 bg-[#00205b] text-white rounded"
          disabled={newTag.trim().length < 2}
        >
          Thêm tag
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Custom small scrollbar */
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
