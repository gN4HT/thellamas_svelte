<script lang="ts">
    import {goto} from "$app/navigation";
    import {page} from "$app/stores";
    import {onMount} from "svelte";

    // Get email from URL query parameter
    const email = $page.url.searchParams.get('email');
    
    // State management
    let isLoading = false;
    let otp = '';
    let errorMessage = '';

    // Check if user came from register page with email
    onMount(() => {
        if (!email) {
            goto('/web/register');
        }
    });

    // Function to verify OTP
    async function verifyOTP() {
        if (!otp) {
            errorMessage = 'Vui lòng nhập mã OTP';
            return;
        }

        isLoading = true;
        errorMessage = '';

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('otp', otp);

            const response = await fetch("http://127.0.0.1:8000/api/verify-otp", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                errorMessage = data.message || 'Xác thực thất bại';
                return;
            }

            // Save access token to localStorage
            localStorage.setItem("token", data.access_token);
            
            // Redirect to app on success
            await goto("/app");
        } catch (error) {
            console.error('Verify error:', error);
            errorMessage = 'Không thể kết nối đến server';
        } finally {
            isLoading = false;
        }
    }
</script>

{#if email}
    <div class="flex items-center justify-center min-h-screen font-sans py-20">
        <div class="w-full max-w-md p-6 bg-white shadow-lg rounded-md">
            <h1 class="text-2xl font-bold mb-6 text-center">Xác thực tài khoản</h1>
            
            <div class="mb-6 text-center">
                <p class="text-gray-600">Mã OTP đã được gửi đến email:</p>
                <p class="font-semibold text-[#00205b]">{email}</p>
            </div>

            <form on:submit|preventDefault={verifyOTP} class="space-y-4">
                <div>
                    <label for="otp" class="block text-sm font-medium text-gray-700 mb-1">Mã OTP</label>
                    <input
                        type="text"
                        id="otp"
                        bind:value={otp}
                        placeholder="Nhập mã OTP"
                        class="w-full p-2 border border-gray-300 rounded text-base focus:ring-2 focus:ring-[#00205b] focus:border-transparent"
                        required
                    />
                </div>

                {#if errorMessage}
                    <div class="text-red-500 text-sm text-center">{errorMessage}</div>
                {/if}

                <button
                    type="submit"
                    disabled={isLoading}
                    class="w-full p-3 text-lg text-white text-center bg-[#00205b] rounded hover:bg-[#001a48] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {#if isLoading}
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {/if}
                    {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Không nhận được mã? <a href="/web/register" class="font-bold text-[#00205b] hover:underline">Đăng ký lại</a>
                </p>
            </div>
        </div>
    </div>
{:else}
    <div class="flex items-center justify-center min-h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00205b]"></div>
    </div>
{/if}
