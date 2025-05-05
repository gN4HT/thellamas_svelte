<script lang="ts">
    let email = '';
    let error = '';
    let success = '';
    let isLoading = false;

    async function handleSubmit() {
        try {
            isLoading = true;
            error = '';
            success = '';

            const response = await fetch('https://tkhoa-innovation.com/invTracker_api/public/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra');
            }

            success = data.message;
            // Redirect to reset password page after 2 seconds
            setTimeout(() => {
                window.location.href = `/web/reset-password?email=${encodeURIComponent(email)}`;
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
        <!-- Form Đặt Lại Mật Khẩu -->
        <div class="w-96">
            <h1 class="text-2xl font-bold mb-4">Đặt lại mật khẩu</h1>
            <p class="text-sm text-gray-600 mb-6">Nhập địa chỉ email liên kết với tài khoản của bạn và chúng tôi sẽ gửi một mã OTP để đặt lại mật khẩu.</p>
            
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

            <form on:submit|preventDefault={handleSubmit} class="flex flex-col space-y-4">
                <input 
                    type="email" 
                    id="email" 
                    bind:value={email}
                    placeholder="Email" 
                    required 
                    class="p-3 border-b border-gray-300 focus:outline-none focus:border-[#00205b]">
                <button 
                    type="submit" 
                    disabled={isLoading}
                    class="bg-[#00205b] text-white py-3 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {#if isLoading}
                        Đang gửi...
                    {:else}
                        Gửi mã OTP
                    {/if}
                </button>
            </form>
            <p class="text-sm text-center mt-4">Mới sử dụng? <a href="/web/register" class="text-blue-500 hover:underline">Tạo tài khoản</a></p>
        </div>

        <!-- Ảnh -->
        <div class="flex items-center justify-center">
            <img src="/img/ảnh tượng trưng.png" alt="Hình minh họa" class="max-w-sm rounded-lg shadow-md">
        </div>
    </div>
</div>
