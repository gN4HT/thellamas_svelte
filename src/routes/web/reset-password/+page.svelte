<script lang="ts">
    import { page } from '$app/stores';
    
    let email = $page.url.searchParams.get('email') || '';
    let otp = '';
    let newPassword = '';
    let confirmPassword = '';
    let error = '';
    let success = '';
    let isLoading = false;
    let resetToken = '';

    async function handleVerifyOtp() {
        try {
            isLoading = true;
            error = '';
            success = '';

            const response = await fetch('http://localhost:8000/api/verify-otp-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra');
            }

            resetToken = data.reset_token;
            success = data.message;
        } catch (err) {
            error = err.message;
        } finally {
            isLoading = false;
        }
    }

    async function handleResetPassword() {
        try {
            if (newPassword !== confirmPassword) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }

            isLoading = true;
            error = '';
            success = '';

            const response = await fetch('http://localhost:8000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    reset_token: resetToken,
                    password: newPassword,
                    password_confirmation: confirmPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra');
            }

            success = data.message;
            // Redirect to login page after successful password reset
            setTimeout(() => {
                window.location.href = '/web/login';
            }, 2000);
        } catch (err) {
            error = err.message;
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="flex bg-white p-10 rounded-lg shadow-lg space-x-10">
        <!-- Form Xác thực OTP và Đặt lại Mật khẩu -->
        <div class="w-96">
            <h1 class="text-2xl font-bold mb-4">Đặt lại mật khẩu</h1>
            
            {#if error}
                <div class="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            {/if}
            
            {#if success}
                <div class="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {success}
                </div>
            {/if}

            {#if !resetToken}
                <p class="text-sm text-gray-600 mb-6">Nhập mã OTP đã được gửi đến email của bạn.</p>
                <form on:submit|preventDefault={handleVerifyOtp} class="flex flex-col space-y-4">
                    <input 
                        type="email" 
                        bind:value={email}
                        placeholder="Email" 
                        required 
                        readonly
                        class="p-3 border-b border-gray-300 focus:outline-none focus:border-[#00205b] bg-gray-100">
                    <input 
                        type="text" 
                        bind:value={otp}
                        placeholder="Mã OTP" 
                        required 
                        maxlength="4"
                        class="p-3 border-b border-gray-300 focus:outline-none focus:border-[#00205b]">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        class="bg-[#00205b] text-white py-3 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {#if isLoading}
                            Đang xác thực...
                        {:else}
                            Xác thực OTP
                        {/if}
                    </button>
                </form>
            {:else}
                <p class="text-sm text-gray-600 mb-6">Nhập mật khẩu mới của bạn.</p>
                <form on:submit|preventDefault={handleResetPassword} class="flex flex-col space-y-4">
                    <input 
                        type="password" 
                        bind:value={newPassword}
                        placeholder="Mật khẩu mới" 
                        required 
                        class="p-3 border-b border-gray-300 focus:outline-none focus:border-[#00205b]">
                    <input 
                        type="password" 
                        bind:value={confirmPassword}
                        placeholder="Xác nhận mật khẩu" 
                        required 
                        class="p-3 border-b border-gray-300 focus:outline-none focus:border-[#00205b]">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        class="bg-[#00205b] text-white py-3 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {#if isLoading}
                            Đang đặt lại...
                        {:else}
                            Đặt lại mật khẩu
                        {/if}
                    </button>
                </form>
            {/if}
        </div>

        <!-- Ảnh -->
        <div class="flex items-center justify-center">
            <img src="/img/ảnh tượng trưng.png" alt="Hình minh họa" class="max-w-sm rounded-lg shadow-md">
        </div>
    </div>
</div> 