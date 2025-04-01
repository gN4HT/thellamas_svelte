<script>
    import { onMount } from "svelte";
    import { apiFetch } from "$lib/api";

    let suppliers = [];
    let showModal = false;
    let selectedSupplier = null;
    let isEditMode = false;

    // Form data
    let supplierForm = {
        name: "",
        phone: "",
        email: "",
        address: "",
    };

    // Lấy token từ localStorage
    const getToken = () => localStorage.getItem("token");

    const fetchSuppliers = async () => {
        try {
            const result = await apiFetch('/suppliers');
            suppliers = result.map((supplier) => ({
                id: supplier.id,
                name: supplier.name,
                phone: supplier.phone || "Chưa có số",
                email: supplier.email || "Chưa có email",
                address: supplier.address || "Chưa có địa chỉ",
                details: `Nhà cung cấp ID: ${supplier.id}`,
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

            console.log(isEditMode ? "Cập nhật thành công" : "Thêm nhà cung cấp thành công");
            closeModal();
            fetchSuppliers();
        } catch (error) {
            console.error("Lỗi khi gửi form:", error);
        }
    };

    function openModal(supplier = null) {
        isEditMode = !!supplier;
        selectedSupplier = supplier;

        // Reset form
        supplierForm = supplier
            ? {
                name: supplier.name,
                phone: supplier.phone,
                email: supplier.email,
                address: supplier.address,
            }
            : {
                name: "",
                phone: "",
                email: "",
                address: "",
            };

        showModal = true;
    }

    function closeModal() {
        showModal = false;
        selectedSupplier = null;
    }

    onMount(() => {
        fetchSuppliers();
    });
</script>

<!-- Hiển thị danh sách nhà cung cấp -->
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
                <div
                        on:click={() => openModal(supplier)}
                        class="bg-gray-100 text-black p-6 rounded-lg shadow-md text-center cursor-pointer"
                >
                    <h2 class="text-lg font-semibold mb-2">{supplier.name}</h2>
                    <p><strong>📞</strong> {supplier.phone}</p>
                    <p><strong>📧</strong> {supplier.email}</p>
                    <p><strong>🏠</strong> {supplier.address}</p>
                    <p class="mt-2">{supplier.details}</p>
                </div>
            {/each}
        </div>
    </div>
</div>

<!-- Modal -->
{#if showModal}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded shadow-lg w-96 p-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">
                    {isEditMode ? `Chỉnh sửa: ${selectedSupplier.name}` : "Thêm Nhà cung cấp"}
                </h2>
                <button on:click={closeModal} class="text-gray-600 text-2xl">&times;</button>
            </div>
            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                <input
                        bind:value={supplierForm.name}
                        placeholder="Tên nhà cung cấp"
                        required
                        class="border w-full p-2 rounded"
                />
                <input
                        bind:value={supplierForm.phone}
                        placeholder="Số điện thoại"
                        class="border w-full p-2 rounded"
                />
                <input
                        bind:value={supplierForm.email}
                        placeholder="Email"
                        type="email"
                        class="border w-full p-2 rounded"
                />
                <input
                        bind:value={supplierForm.address}
                        placeholder="Địa chỉ"
                        class="border w-full p-2 rounded"
                />
                <div class="flex justify-end mt-4">
                    <button
                            type="button"
                            on:click={closeModal}
                            class="mr-2 px-4 py-2 border rounded"
                    >
                        Hủy
                    </button>
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                        {isEditMode ? "Cập nhật" : "Thêm mới"}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
