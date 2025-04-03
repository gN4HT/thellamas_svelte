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

    const getToken = () => localStorage.getItem("token");

    const fetchSuppliers = async () => {
        try {
            const headers = { Authorization: `Bearer ${getToken()}` };
            const result = await apiFetch("http://127.0.0.1:8000/api/suppliers", { headers });
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
            const url = isEditMode
                ? `http://127.0.0.1:8000/api/suppliers/${selectedSupplier.id}`
                : "http://127.0.0.1:8000/api/suppliers";
            const method = isEditMode ? "PUT" : "POST";
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            };
            const body = JSON.stringify(supplierForm);

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

<div class="flex flex-col items-center min-h-screen bg-white p-4">
    <div class="w-full max-w-5xl">
        <div class="border-b-2 border-gray-300 pb-4 mb-6 flex justify-between items-center">
            <h1 class="text-2xl font-bold">Danh sách Nhà cung cấp</h1>
            <button on:click={() => openModal()} class="bg-blue-500 text-white px-4 py-2 rounded">
                + Thêm Nhà cung cấp
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