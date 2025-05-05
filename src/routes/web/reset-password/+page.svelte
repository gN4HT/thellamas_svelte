<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    
    let email = $page.url.searchParams.get('email') || '';
    let otp = '';
    let newPassword = '';
    let confirmPassword = '';
    let error = '';
    let success = '';
    let isLoading = false;
    let resetToken = localStorage.getItem('resetToken') || '';

    // Kiểm tra email hợp lệ
    function isValidEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Kiểm tra email khi component mount
    $: {
        if (email && !isValidEmail(email)) {
            error = 'Email không hợp lệ';
            email = '';
        }
    }

    async function handleVerifyOtp() {
        try {
            if (!isValidEmail(email)) {
                throw new Error('Email không hợp lệ');
            }

            isLoading = true;
            error = '';
            success = '';

            const response = await fetch('https://tkhoa-innovation.com/invTracker_api/public/api/verify-otp-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra khi xác thực OTP');
            }

            resetToken = data.reset_token;
            localStorage.setItem('resetToken', resetToken);
            success = data.message;
        } catch (err) {
            error = err.message;
            console.error('Error in handleVerifyOtp:', err);
        } finally {
            isLoading = false;
        }
    }

    async function handleResetPassword() {
        try {
            if (!resetToken) {
                throw new Error('Vui lòng xác thực OTP trước');
            }

            if (newPassword !== confirmPassword) {
                throw new Error('Mật khẩu xác nhận không khớp');
            }

            if (newPassword.length < 6) {
                throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
            }

            isLoading = true;
            error = '';
            success = '';

            const response = await fetch('https://tkhoa-innovation.com/invTracker_api/public/api/reset-password', {
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
                throw new Error(data.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
            }

            success = data.message;
            // Clear the token after successful password reset
            localStorage.removeItem('resetToken');
            // Redirect to login page after successful password reset
            setTimeout(() => {
                goto('/web/login');
            }, 2000);
        } catch (err) {
            error = err.message;
            console.error('Error in handleResetPassword:', err);
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="flex flex-col md:flex-row bg-white p-6 md:p-10 rounded-lg shadow-lg space-y-6 md:space-y-0 md:space-x-10">
        <!-- Form Xác thực OTP và Đặt lại Mật khẩu -->
        <div class="w-full md:w-96">
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
                        disabled={isLoading || !email}
                        class="bg-[#00205b] text-white py-3 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {#if isLoading}
                            <span class="flex items-center justify-center">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xác thực...
                            </span>
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
                        minlength="6"
                        class="p-3 border-b border-gray-300 focus:outline-none focus:border-[#00205b]">
                    <input 
                        type="password" 
                        bind:value={confirmPassword}
                        placeholder="Xác nhận mật khẩu" 
                        required 
                        minlength="6"
                        class="p-3 border-b border-gray-300 focus:outline-none focus:border-[#00205b]">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        class="bg-[#00205b] text-white py-3 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {#if isLoading}
                            <span class="flex items-center justify-center">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang đặt lại...
                            </span>
                        {:else}
                            Đặt lại mật khẩu
                        {/if}
                    </button>
                </form>
            {/if}
        </div>

        <!-- Ảnh -->
        <div class="hidden md:flex items-center justify-center">
            <img src="/img/ảnh tượng trưng.png" alt="Hình minh họa" class="max-w-sm rounded-lg shadow-md">
        </div>
    </div>
</div> 