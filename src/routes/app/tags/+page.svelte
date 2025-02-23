<script>
    import { onMount } from "svelte";
  
    // Dữ liệu giả lập về tags
     let tags = [
        { id: 1, name: "do choi", selected: true },
    { id: 2, name: "toy", selected: false },
    { id: 3, name: "quần áo", selected: false },
    { id: 4, name: "giày dép", selected: false }
  ];

  let items = [
    { name: "Gấu bông", quantity: 15, price: "150,000 VND", tag: "toy", isNew: false },
    { name: "Áo thun", quantity: 20, price: "300,000 VND", tag: "quần áo", isNew: true },
    { name: "Giày thể thao", quantity: 8, price: "700,000 VND", tag: "giày dép", isNew: false }
  ];
    // Biến lưu tag đang chọn
    let selectedTag = tags.find(tag => tag.selected)?.name || "";
  
    // Mở & đóng modal
    let showModal = false;
    let newTag = "";
  
    function addTag() {
      if (newTag.length > 1) {
        tags = [...tags, { id: tags.length + 1, name: newTag, selected: false }];
        newTag = "";
        showModal = false;
      }
    }
  
    function selectTag(tagName) {
      selectedTag = tagName;
      tags = tags.map(tag => ({ ...tag, selected: tag.name === tagName }));
    }
  </script>
{#if tags.length > 0}
<div class="bg-gray-100 h-screen flex w-full">
    <!-- Sidebar -->
    <div class="bg-white p-4 border-r border-gray-300">
      <div class="flex justify-between items-center border border-gray-300 rounded p-2 mb-4">
        <i class="fa-solid fa-magnifying-glass text-gray-500"></i>
        <input
          type="text"
          placeholder="Tìm kiếm tags"
          class="w-full outline-none border-none pl-2"
        />
      </div>
  
      <!-- Danh sách tags -->
      <div>
        {#each tags as tag}
          <div
            class="flex items-center p-2 cursor-pointer rounded {tag.selected ? 'bg-gray-100 text-[#00205B]' : 'text-gray-500 hover:bg-gray-100'}"
            on:click={() => selectTag(tag.name)}
          >
            <span class="mr-2 text-xl"><i class="fa-solid fa-tag"></i></span>
            {tag.name}
          </div>
        {/each}
      </div>
    </div>
  
    <!-- Nội dung chính -->
    <div class="flex flex-col w-full p-3">
      <div class="flex justify-between align-center border-b border-gray-300 p-4">
        <h2 class="text-gray-500 text-3xl ml-3">{selectedTag || "Chọn tag"}</h2>
        <button on:click={() => (showModal = true)} class="px-4 py-2 bg-[#00205b] text-white rounded flex items-center">
          <span class="text-xl mr-2 bg-white/10 px-2 rounded">+</span>Thêm Tag
        </button>
      </div>
  
      {#if items.filter(item => item.tag === selectedTag).length > 0}
      <div class="grid grid-cols-5 gap-4 p-4 mt-10">
        {#each items.filter(item => item.tag === selectedTag) as item}
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="bg-gray-200 p-10 flex items-center justify-center relative">
              <span class="text-4xl text-gray-400"><i class="fa-solid fa-file"></i></span>
              {#if item.isNew}
                <span class="absolute bottom-2 left-2 text-xs bg-black text-white px-2 py-1 rounded">MỚI</span>
              {/if}
            </div>
            <div class="p-4">
              <p class="mt-2 font-semibold text-gray-700">{item.name}</p>
              <p class="text-sm text-gray-500 mt-1">{item.quantity} đơn vị | {item.price}</p>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Hiển thị khi không có items -->
      <div class="flex-1 p-10 flex flex-col items-center justify-center">
        <div class="text-center flex flex-col items-center gap-4">
          <i class="fa-solid fa-tags text-gray-500 text-4xl"></i>
          <h2 class="text-gray-500 text-4xl">Không có mặt hàng nào cho tag này</h2>
          <p class="text-[#00205b]">Thêm sản phẩm vào tag để hiển thị chúng ở đây.</p>
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

    <!-- Modal -->
    <div
      id="modal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden"
    >
      <div class="bg-white rounded-lg shadow-lg w-96">
        <div
          class="flex justify-between items-center p-4 border-b bg-gray-200"
        >
          <h2 class="text-lg font-semibold">Thêm Tag</h2>
          <button id="closeModal" class="text-gray-600 text-xl">
            &times;
          </button>
        </div>
        <div class="p-4">
          <label for="tagName" class="block text-sm font-medium"
            >Tên tag</label
          >
          <input
            type="text"
            id="tagName"
            class="w-full p-2 border rounded mt-1"
            placeholder="Nhập tên tag"
          />
          <p id="errorText" class="text-red-500 text-sm hidden">
            Tên phải trên 1 ký tự
          </p>
        </div>
        <div class="p-4 flex justify-end">
          <button
            id="addTag"
            class="px-4 py-2 bg-[#00205b] text-white rounded opacity-50 cursor-not-allowed"
            disabled
          >
            Thêm tag
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
  
  <!-- Modal Thêm Tag -->
  {#if showModal}
  <div class="fixed inset-0 flex items-center justify-center bg-black/40 ">
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
          disabled={newTag.length < 2}
        >
          Thêm tag
        </button>
      </div>
    </div>
  </div>
{/if}
