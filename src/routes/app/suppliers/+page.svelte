<script>
    import { onMount } from "svelte";
    import { apiFetch } from "$lib/api";

    let suppliers = [];
    let showModal = false;
    let selectedSupplier = null;
    let isEditMode = false;

    let supplierForm = {
        name: "",
        phone: "",
        email: "",
        address: "",
        description: ""
    };

<<<<<<< HEAD
    const getToken = () => localStorage.getItem("token");
=======
    // Pagination
    let itemPage = 1;
    const itemsPerPage = 10;
    function paginatedItems() {
        const start = (itemPage - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    }
    function goToPage(type, event) {
        let value = parseInt(event.target.value) || 1;
        let maxPage = Math.ceil((items.length) / itemsPerPage);
        let pageValue = Math.max(1, Math.min(maxPage, value));
        itemPage = pageValue;
    }
>>>>>>> origin/tringuyen

    const fetchSuppliers = async () => {
        try {
            const headers = { Authorization: `Bearer ${getToken()}` };
            const result = await apiFetch("/suppliers", { headers });
            suppliers = result.map(supplier => ({
                id: supplier.id,
                name: supplier.name,
                phone: supplier.phone || "Chưa có số",
                email: supplier.email || "Chưa có email",
                address: supplier.address || "Chưa có địa chỉ",
                description: supplier.description || "Không có mô tả",
            }));
        } catch (error) {
            console.error("Lỗi khi fetch API nhà cung cấp:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            const endpoint = isEditMode 
                ? `/suppliers/${selectedSupplier.id}`
                : '/suppliers';
            
            await apiFetch(endpoint, {
                method: isEditMode ? 'PUT' : 'POST',
                body: supplierForm 
            });

            const response = await fetch(url, { method, headers, body });
            if (response.ok) {
                closeModal();
                fetchSuppliers();
            } else {
                console.error("Lỗi:", await response.json());
            }
        } catch (error) {
            console.error("Lỗi khi gửi form:", error);
        }
    };

    const handleDelete = async (supplier) => {
        const confirmDelete = confirm(`Bạn có chắc muốn xóa nhà cung cấp: ${supplier.name}?`);
        if (!confirmDelete) return;

        try {
            const url = `http://127.0.0.1:8000/api/suppliers/${supplier.id}`;
            const headers = { Authorization: `Bearer ${getToken()}` };
            const response = await fetch(url, { method: "DELETE", headers });

            if (response.ok) {
                fetchSuppliers();
            } else {
                console.error("Lỗi khi xóa:", await response.json());
            }
        } catch (error) {
            console.error("Lỗi khi xóa nhà cung cấp:", error);
        }
    };

    function openModal(supplier = null) {
        isEditMode = !!supplier;
        selectedSupplier = supplier;
        supplierForm = supplier ? { ...supplier } : {
            name: "", phone: "", email: "", address: "", description: ""
        };
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        selectedSupplier = null;
    }

    onMount(fetchSuppliers);
</script>

<<<<<<< HEAD
<div class="flex flex-col items-center min-h-screen bg-white p-4">
    <div class="w-full max-w-5xl">
        <div class="border-b-2 border-gray-300 pb-4 mb-6 flex justify-between items-center">
            <h1 class="text-2xl font-bold">Danh sách Nhà cung cấp</h1>
            <button on:click={() => openModal()} class="bg-blue-500 text-white px-4 py-2 rounded">
                + Thêm Nhà cung cấp
=======
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
            {#each filteredSuppliers() as supplier (supplier.id)}
                <div
                        class="flex items-center justify-between p-2 cursor-pointer rounded
                {selectedSupplier && selectedSupplier.id === supplier.id ? 'text-[#00205b]' : 'text-gray-500 hover:bg-gray-100'}"
                        on:click={() => selectSupplier(supplier)}
                >
                    <div class="flex items-center gap-1">
                        <span class="mr-2 text-xl"><i class="fa-solid fa-box"></i></span>
                        <span title={supplier.name}>
                    {supplier.name.length > 15 ? ${supplier.name.slice(0, 15)}... : supplier.name}
                </span>
                    </div>
                    <div class="flex items-center gap-1">
                        <a href="#" on:click={event => handleOpenModal(event, supplier)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
                            </svg>
                        </a>
                        <span class="ml-auto text-red-500 cursor-pointer" on:click={event => handleDelete(event, supplier.id)}>
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
>>>>>>> origin/tringuyen
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each suppliers as supplier}
                <div class="relative bg-gray-100 text-black p-6 rounded-lg shadow-md text-center">
                    <button on:click={() => handleDelete(supplier)} class="absolute top-2 right-2 bg-gray-500 text-white p-1 rounded-full text-xs"><svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                    </svg></button>
                    <h2 class="text-lg font-semibold mb-2 cursor-pointer" on:click={() => openModal(supplier)}>{supplier.name}</h2>
                    <p><strong>📞</strong> {supplier.phone}</p>
                    <p><strong>📧</strong> {supplier.email}</p>
                    <p><strong>🏠</strong> {supplier.address}</p>
                    <p><strong>📜</strong> {supplier.description}</p>
                </div>
            {/each}
        </div>
    </div>
</div>

{#if showModal}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded shadow-lg w-96 p-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">{isEditMode ? `Chỉnh sửa: ${selectedSupplier.name}` : "Thêm Nhà cung cấp"}</h2>
                <button on:click={closeModal} class="text-gray-600 text-2xl">&times;</button>
            </div>
            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                <input bind:value={supplierForm.name} placeholder="Tên nhà cung cấp" required class="border w-full p-2 rounded" />
                <input bind:value={supplierForm.phone} placeholder="Số điện thoại" class="border w-full p-2 rounded" />
                <input bind:value={supplierForm.email} placeholder="Email" type="email" class="border w-full p-2 rounded" />
                <input bind:value={supplierForm.address} placeholder="Địa chỉ" class="border w-full p-2 rounded" />
                <input bind:value={supplierForm.description} placeholder="Mô tả" class="border w-full p-2 rounded" />
                <div class="flex justify-end mt-4">
                    <button type="button" on:click={closeModal} class="mr-2 px-4 py-2 border rounded">Hủy</button>
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">{isEditMode ? "Cập nhật" : "Thêm mới"}</button>
                </div>
            </form>
        </div>
    </div>
{/if}