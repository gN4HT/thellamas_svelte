<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";

    let suppliers = [];
    let items = [];
    let searchQuery = "";
    let selectedSupplier = null;
    let show = false;
    let isEditing = false;
    let supplier = { name: "", email: "", phone: "", address: "", status: "" };
    const dispatch = createEventDispatcher();

    let itemPage = 1;
    const itemsPerPage = 10;
    function paginatedItems() {
        const start = (itemPage - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    }
    function goToPage(type, event) {
        let value = parseInt(event.target.value) || 1;
        let maxPage = Math.ceil((type === 'folder' ? folders.length : items.length) / itemsPerPage);
        let pageValue = Math.max(1, Math.min(maxPage, value));
        if (type === 'folder') folderPage = pageValue;
        else itemPage = pageValue;
    }

    async function fetchSuppliers() {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/suppliers");
            if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu suppliers");
            suppliers = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchItems(supplierId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/items`);
            if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu items");
            const allItems = await response.json();
            
            // Lọc items theo supplier_id
            items = allItems.filter(item => item.supplier_id === supplierId);
        } catch (error) {
            console.error(error);
        }
    }

    function filteredSuppliers() {
        return suppliers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    function selectSupplier(supplier) {
    selectedSupplier = supplier;
    fetchItems(supplier.id);
}

async function deleteSupplier(id) {
    if (!confirm("Bạn có chắc muốn xóa supplier này?")) return;

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/suppliers/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Xóa không thành công");

        suppliers = suppliers.filter(s => s.id !== id);
        if (selectedSupplier && selectedSupplier.id === id) {
            selectedSupplier = null;
            items = [];
        }
    } catch (error) {
        console.error(error);
    }
}

function openModal(editMode = false, data = null) {
        isEditing = editMode;
        show = true;
        supplier = data ? { ...data } : { name: "", email: "", phone: "", address: "", status: "" };
    }

    function closeModal() {
        show = false;
    }

    async function saveSupplier() {
        if (!supplier.name.trim()) {
            alert("Tên supplier là bắt buộc");
            return;
        }

        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing 
                ? `http://127.0.0.1:8000/api/suppliers/${supplier.id}` 
                : "http://127.0.0.1:8000/api/suppliers";
            
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(supplier),
            });

            if (!response.ok) throw new Error("Lưu không thành công");
            dispatch("refresh"); // Gửi sự kiện để cập nhật danh sách
            closeModal();
        } catch (error) {
            console.error(error);
        }
    }


    onMount(fetchSuppliers);
</script>

{#if suppliers.length > 0}
<div class="bg-gray-100 h-screen flex w-full">
    <div class="bg-white p-4 border-r border-gray-300 overflow-y-auto small-scrollbar w-[300px]">
        <div class="flex justify-between items-center border border-gray-300 rounded p-2 mb-4">
            <i class="fa-solid fa-magnifying-glass text-gray-500"></i>
            <input 
                type="text" 
                placeholder="Tìm kiếm suppliers" 
                bind:value={searchQuery}
                class="w-full outline-none border-none pl-2"
            />
        </div>

        <div>
            {#each filteredSuppliers() as supplier}
            <div 
            class="flex items-center justify-between p-2 cursor-pointer rounded {selectedSupplier && selectedSupplier.id === supplier.id ? 'text-[#00205b]' : 'text-gray-500 hover:bg-gray-100'}"
            on:click={() => selectSupplier(supplier)}
        >
                <div class="flex items-center gap-1">
                    <span class="mr-2 text-xl"><i class="fa-solid fa-box"></i></span>
                {supplier.name.length > 15 ? `${supplier.name.slice(0, 15)}...` : supplier.name}
                </div>
                <div class="flex items-center gap-1">
                    <a href="#" on:click={(e) => { e.preventDefault(); openModal(true, supplier); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                            <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
                        </svg>
                    </a>
                    <span class="ml-auto text-red-500 cursor-pointer" on:click={(e) => { e.stopPropagation(); deleteSupplier(supplier.id); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                            <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                        </svg>
                    </span>
                </div>
            </div>
            {/each}
        </div>
    </div>

    <div class="flex flex-col w-full p-3">
        <div class="flex justify-between align-center border-b border-gray-300 p-4">
            <h2 class="flex items-center gap-2 text-3xl ml-3 cursor-pointer {selectedSupplier ? 'text-[#00205B]' : 'text-gray-500'}">
                {selectedSupplier ? (selectedSupplier.name.length > 30 ? selectedSupplier.name.slice(0, 30) + "..." : selectedSupplier.name) : "Chọn supplier"}
            </h2>
            <button class="px-4 py-2 bg-[#00205b] text-white rounded flex items-center" on:click={() => openModal(false)}>
                <span class="text-xl mr-2 bg-white/10 px-2 rounded">+</span>Thêm supplier
            </button>
        </div>

        {#if items.length > 0}
        <h2 class="text-gray-500 text-3xl mt-10 ml-4">Mặt hàng</h2>
        <div class="grid grid-cols-5 gap-4 p-4">
            {#each paginatedItems() as item}
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
        <div class="flex mt-5 justify-between">
            <p class="text-gray-500">Tổng số trang: {itemPage}/{Math.ceil(items.length / itemsPerPage)}</p> 
          <div class="flex gap-2">
          <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage = 1}>Trang đầu</button>
          <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage--} disabled={itemPage === 1}>Trước</button>
          <input type="number" bind:value={itemPage} on:change={(e) => goToPage('item', e)} class="border rounded p-1 w-16 text-center" />
          <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage++} disabled={itemPage * itemsPerPage >= items.length}>Sau</button>
          <button class="hover:text-[#00205B] cursor-pointer" on:click={() => itemPage = Math.ceil(items.length / itemsPerPage)}>Trang cuối</button>
        </div>
        </div>
        {:else}
        <div class="flex-1 p-10 flex flex-col items-center justify-center">
        <div class="text-center flex flex-col items-center gap-4">
            <i class="fa-solid fa-box text-gray-500 text-4xl"></i>
            <h2 class="text-gray-500 text-4xl">Không có mặt hàng nào</h2>
            <p class="text-[#00205b]">Thêm sản phẩm vào supplier để hiển thị chúng ở đây.</p>
        </div>
        </div>
        {/if}
    </div>
</div>
{:else}
<div class="flex items-center justify-center h-screen bg-gray-100 m-auto">
    <div class="text-center flex flex-col items-center gap-10">
        <i class="fa-solid fa-boxes text-gray-500 text-6xl"></i>
        <h2 class="text-gray-500 text-4xl">Bạn chưa có supplier nào</h2>
        <button class="px-4 py-2 bg-[#00205b] text-white rounded flex items-center" on:click={() => openModal(false)}>
            <span class="text-xl mr-2 bg-white/10 px-2 rounded">+</span>Thêm supplier
        </button>
        <p class="text-[#00205b]">Thẻ suppliers là gì? Làm sao để sử dụng chúng?</p>
    </div>
</div>
{/if}


{#if show}
<div class="fixed inset-0 bg-white/20 backdrop-blur-sm flex justify-center items-center">
    <div class="bg-white p-6 rounded shadow-lg w-96 border border-gray-500">
        <h2 class="text-xl font-bold mb-4">{isEditing ? `Chỉnh sửa "${supplier.name}"` : "Thêm Supplier"}</h2>
        <div class="space-y-3">
            <input type="text" bind:value={supplier.name} placeholder="Tên supplier *" class="w-full p-2 border rounded" required>
            <input type="email" bind:value={supplier.email} placeholder="Email" class="w-full p-2 border rounded">
            <input type="text" bind:value={supplier.phone} placeholder="Số điện thoại" class="w-full p-2 border rounded">
            <input type="text" bind:value={supplier.address} placeholder="Địa chỉ" class="w-full p-2 border rounded">
            <select bind:value={supplier.status} class="w-full p-2 border rounded">
                <option value="">Chọn trạng thái</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
        </div>
        <div class="flex justify-end mt-4 space-x-2">
            <button on:click={closeModal} class="px-4 py-2 bg-gray-300 rounded">Hủy</button>
            <button on:click={saveSupplier} class="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
        </div>
    </div>
</div>
{/if}

<style>
/* Custom small scrollbar */
.small-scrollbar::-webkit-scrollbar {
  width: 6px; /* Adjust the scrollbar width */
}

.small-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* Thumb color */
  border-radius: 4px;
}

.small-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; /* Track color */
}
</style>