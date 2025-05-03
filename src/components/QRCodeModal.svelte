<script lang="ts">
    import { apiFetch } from "$lib/api";
    import type { Item } from "../models/item";
    import QRCode from 'qrcode';
    import Items from "./Items.svelte";

    export let showModal = false;
    export let item: Item | null = null;
    export let onClose: () => void;

    let qrCodeUrl: string | null = null;
    let isLoading = false;
    let error: string | null = null;

    async function generateQRCode() {
        if (!item) return;

        isLoading = true;
        error = null;

        try {
            // Tạo dữ liệu sản phẩm cho QR code
            const productData = {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                stock_level: item.stock_level
            };
            
            // Chuyển đổi dữ liệu thành JSON string
            const qrData = JSON.stringify(productData);
            
            // Tạo QR code từ dữ liệu sản phẩm
            const qrDataUrl = await QRCode.toDataURL(qrData, {
                width: 400,
                margin: 1,
                color: {
                    dark: '#00205b',
                    light: '#ffffff'
                }
            });

            // Lưu QR code vào database
            const response = await apiFetch(`/items/${item.id}`, {
                method: 'PUT',
                body: { qr: qrDataUrl }
            });

            if (response && response.qr) {
                qrCodeUrl = response.qr;
                // Cập nhật item.qr để hiển thị ngay lập tức
                if (item) {
                    item.qr = response.qr;
                }
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
            qrCodeUrl = item.qr;
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
