<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Item } from '../models/item';
    import { apiFetch } from "$lib/api";

    export let showModal: boolean;
    export let item: Partial<Item> = {};
    export let isEditMode: boolean = false;
    export let folderId: number | null = null;


    const dispatch = createEventDispatcher();

    let formData: Partial<Item> = {};
    let initialized = false;

    async function fetchInventoryId() {
        try {
            const data = await apiFetch("http://127.0.0.1:8000/api/me");
            return data.id;
        } catch (error) {
            console.error("Error fetching inventory id:", error);
            return null;
        }
    }

    async function loadDefaults() {
        const inventoryId = await fetchInventoryId();
        const currentDate = new Date().toISOString();
        return {
            name: '',
            quantity: 0,
            stock_level: 0,
            price: 0,
            // images: [],
            notes: '',
            folder_id: folderId ?? null,
            inventory_id: inventoryId,
            created_at: currentDate,
            updated_at: currentDate,
        };
    }

    async function initializeFormData() {
        if (isEditMode) {
            formData = { ...item, updated_at: new Date().toISOString() };
            if (!formData.inventory_id) {
                const id = await fetchInventoryId();
                formData.inventory_id = id;
                console.log("Updated inventory_id:", formData.inventory_id);
            }
        } else {
            formData = await loadDefaults();
            console.log("Loaded defaults:", formData);
        }
        initialized = true;
    }

    // Reactive statement để khởi tạo formData khi mở modal
    $: if (showModal && !initialized) {
        initializeFormData();
    }

    // Reactive statement để reset formData khi đóng modal
    $: if (!showModal && initialized) {
        formData = {};
        initialized = false;
    }

    function handleSubmit() {
        if (isEditMode) {
            formData.updated_at = new Date().toISOString();
        }
        console.log("Submitting form data:", formData);
        // Kiểm tra các trường bắt buộc
        if (!formData.name || formData.quantity === undefined) {
            console.error("Thiếu thông tin bắt buộc");
            return;
        }
        dispatch('submit', { data: { ...formData } });
    }

    function handleClose() {
        dispatch('close');
    }
</script>

{#if showModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-full">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">
                {isEditMode ? 'Edit Item' : 'Add Item'}
            </h2>

            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                {#if isEditMode}
                    <div>
                        <label for="id" class="block text-gray-600 font-medium">ID</label>
                        <input
                            id="id"
                            type="number"
                            class="border rounded p-2 w-full bg-gray-200 text-gray-500 cursor-not-allowed"
                            bind:value={formData.id}
                            disabled
                        />
                    </div>
                {/if}

                <div>
                    <label for="name" class="block text-gray-600 font-medium">Name</label>
                    <input
                        id="name"
                        type="text"
                        class="border rounded p-2 w-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        bind:value={formData.name}
                        required
                    />
                </div>

                <div>
                    <label for="quantity" class="block text-gray-600 font-medium">Quantity</label>
                    <input
                        id="quantity"
                        type="number"
                        class="border rounded p-2 w-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        bind:value={formData.quantity}
                        required
                    />
                </div>

                <div>
                    <label for="stock_level" class="block text-gray-600 font-medium">Stock Level</label>
                    <input
                        id="stock_level"
                        type="number"
                        class="border rounded p-2 w-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        bind:value={formData.stock_level}
                    />
                </div>

                <div>
                    <label for="price" class="block text-gray-600 font-medium">Price</label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        class="border rounded p-2 w-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        bind:value={formData.price}
                    />
                </div>

                <!-- <div>
                    <label for="images" class="block text-gray-600 font-medium">Upload Images</label>
                    <input
                        id="images"
                        type="file"
                        multiple
                        class="border rounded p-2 w-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        on:change={(event) => {
                            const files = (event.target as HTMLInputElement).files;
                            formData.images = files ? Array.from(files) : [];
                        }}
                    />
                </div> -->
                

                <div>
                    <label for="notes" class="block text-gray-600 font-medium">Notes</label>
                    <textarea
                        id="notes"
                        class="border rounded p-2 w-full bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        bind:value={formData.notes}
                    ></textarea>
                </div>

                <input type="hidden" bind:value={formData.inventory_id} />
                <input type="hidden" bind:value={formData.created_at} />
                <input type="hidden" bind:value={formData.updated_at} />

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" on:click={handleClose} class="px-5 py-2 bg-red-400 text-white rounded-lg hover:bg-gray-500 transition">
                        Cancel
                    </button>
                    <button type="submit" class="px-5 py-2 bg-[#00205B] text-white rounded-lg hover:bg-blue-700 transition">
                        {isEditMode ? 'Update' : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
