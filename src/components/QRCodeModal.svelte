<script lang="ts">
    import { apiFetch } from "$lib/api";
    import type { Item } from "../models/item";

    export let showModal = false;
    export let item: Item | null = null;
    export let onClose: () => void;

    let qrCodeUrl: string | null = null;
    let isLoading = false;
    let error: string | null = null;

    function generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function convertToBase64Image(data: string): string {
        // Kiểm tra xem dữ liệu đã ở dạng base64 chưa
        if (data.startsWith('data:image')) {
            return data;
        }
        
        // Nếu không, chuyển đổi thành base64
        return `data:image/png;base64,${data}`;
    }

    async function generateQRCode() {
        if (!item) return;

        isLoading = true;
        error = null;

        try {
            // Tạo dữ liệu ngẫu nhiên cho QR code
            const randomData = generateRandomString(32);
            const qrData = {
                itemId: item.id,
                itemName: item.name,
                randomCode: randomData,
                timestamp: new Date().getTime()
            };

            const formData = new FormData();
            formData.append('qr', JSON.stringify(qrData)); // Lưu dữ liệu QR dưới dạng JSON string

            const response = await apiFetch(`/items/${item.id}`, {
                method: 'PUT',
                body: formData
            });

            if (response && response.qr) {
                // Chuyển đổi dữ liệu QR thành định dạng có thể hiển thị
                qrCodeUrl = convertToBase64Image(response.qr);
            } else {
                throw new Error('Không thể tạo mã QR');
            }
        } catch (err) {
            error = err.message || 'Không thể tạo mã QR';
        } finally {
            isLoading = false;
        }
    }

    $: if (showModal && item) {
        if (item.qr) {
            // Chuyển đổi dữ liệu QR thành định dạng có thể hiển thị
            qrCodeUrl = convertToBase64Image(item.qr);
        } else {
            qrCodeUrl = null;
        }
    }
</script>

{#if showModal}
<div class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Mã QR</h2>
                <button 
                    on:click={onClose}
                    class="text-gray-500 hover:text-gray-700"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {#if error}
                <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            {/if}

            {#if isLoading}
                <div class="flex justify-center items-center h-48">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00205b]"></div>
                </div>
            {:else if qrCodeUrl}
                <div class="flex flex-col items-center">
                    <img 
                        src={qrCodeUrl} 
                        alt="Mã QR" 
                        class="w-48 h-48 object-contain mb-4"
                    />
                    <p class="text-sm text-gray-600">Quét mã QR này để xem chi tiết mặt hàng</p>
                </div>
            {:else}
                <div class="text-center py-8">
                    <p class="mb-4">Mặt hàng này chưa có mã QR.</p>
                    <button
                        on:click={generateQRCode}
                        class="bg-[#00205b] text-white px-4 py-2 rounded hover:bg-[#001639] transition-colors"
                    >
                        Tạo mã QR
                    </button>
                </div>
            {/if}
        </div>
    </div>
{/if}
