<script lang="ts">
    import { goto } from '$app/navigation';

    // Constants
    const API_URL = 'http://127.0.0.1:8000/api';
    
    // State management
    let email = "";
    let password = "";
    let errorMessage = "";
    let isLoading = false;

    // Form validation
    const validateForm = () => {
        if (!email.trim()) {
            errorMessage = "Vui lòng nhập email";
            return false;
        }
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            errorMessage = "Email không hợp lệ";
            return false;
        }
        if (!password) {
            errorMessage = "Vui lòng nhập mật khẩu";
            return false;
        }
        if (password.length < 6) {
            errorMessage = "Mật khẩu phải có ít nhất 6 ký tự";
            return false;
        }
        return true;
    };

    // Handle input change
    const handleInput = () => {
        errorMessage = "";
    };

    // Handle login
    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        
        if (!validateForm()) return;
        
        isLoading = true;
        errorMessage = "";

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Sai email hoặc mật khẩu!");
            }

            // Lưu token vào localStorage
            localStorage.setItem('auth', JSON.stringify({
                access_token: data.access_token,
                user: data.user
            }));

            // Chuyển hướng sau khi đăng nhập thành công
            await goto('/app/inventory/all');

        } catch (err) {
            console.error("Login error:", err);
            errorMessage = err.message || "Không thể kết nối đến server!";
        } finally {
            isLoading = false;
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen font-sans py-20">
    <div class="flex items-center justify-between bg-white rounded-lg shadow-md p-8">
        <!-- Login Box -->
        <div class="border-2 border-gray-300 p-8 w-96 rounded-lg">
            <h1 class="text-xl font-bold text-black">CHÀO MỪNG BẠN!</h1>
            <div class="py-2 mb-6">
                <span class="text-lg text-black">Đăng nhập vào tài khoản của bạn</span>
            </div>

            {#if errorMessage}
                <p class="text-red-500 text-sm mb-4" role="alert">{errorMessage}</p>
            {/if}

            <form class="flex flex-col" on:submit={handleSubmit}>
                <input 
                    type="email" 
                    bind:value={email} 
                    on:input={handleInput}
                    placeholder="Email" 
                    required
                    disabled={isLoading}
                    class="mb-4 p-2 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                    autocomplete="email"
                >
                <input 
                    type="password" 
                    bind:value={password} 
                    on:input={handleInput}
                    placeholder="Mật khẩu" 
                    required
                    disabled={isLoading}
                    class="mb-4 p-2 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                    autocomplete="current-password"
                >
                <a 
                    href="quenmk" 
                    class="text-sm text-blue-500 hover:underline mb-4 text-right transition-colors"
                >
                    Quên mật khẩu?
                </a>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    class="bg-[#00205b] text-white py-3 rounded-lg text-sm flex items-center justify-center
                           hover:bg-[#003080] transition-colors disabled:opacity-50"
                >
                    {#if isLoading}
                        <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Đang xử lý...
                    {:else}
                        Đăng Nhập
                    {/if}
                </button>
            </form>

            <div class="flex items-center my-4 text-gray-500">
                <span class="flex-1 border-b border-gray-300"></span>
                <span class="px-2">Hoặc</span>
                <span class="flex-1 border-b border-gray-300"></span>
            </div>

            <p class="text-center mt-4 text-gray-500 text-sm">
                Bạn là người mới? 
                <a href="register" class="text-blue-500 hover:underline transition-colors">
                    Tạo tài khoản ngay
                </a>
            </p>
        </div>

        <!-- Llama Image -->
        <div class="flex-1 flex items-center justify-center">
            <img 
                src="/img/ảnh tượng trưng.png" 
                alt="Llama" 
                class="max-w-full h-auto"
                loading="lazy"
            >
        </div>
    </div>
</div>
  