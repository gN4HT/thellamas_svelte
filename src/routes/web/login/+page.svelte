<script lang="ts">

    import type {AccessToken} from "../../../models/auth/accessToken";

    let email = "";
    let password = "";
    let errorMessage = "";

    const login = async () => {
        errorMessage = ""; // Reset lỗi trước khi gửi request

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });

            const data: AccessToken = await response.json();

            if (response.ok) {
                console.log("Đăng nhập thành công:", data);

                // Lưu access_token vào localStorage
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("token_type", data.token_type);
                localStorage.setItem("expires_in", data.expires_in);

                // Chuyển hướng sau khi đăng nhập thành công
                window.location.href = "/app";
            } else {
                errorMessage = data.message || "Sai email hoặc mật khẩu!";
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            errorMessage = "Không thể kết nối đến server!";
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen font-sans py-20">
    <div class="flex items-center justify-between bg-white rounded-lg shadow-md p-8">
        <!-- Login Box -->
        <div class="border-2 border-gray-300 p-8 w-96 rounded-lg">
            <h1 class="text-xl font-bold text-black">CHÀO MỪNG BẠN !</h1>
            <div class="py-2 mb-6">
                <span class="text-lg text-black">Đăng nhập vào tài khoản của bạn</span>
            </div>

            {#if errorMessage}
                <p class="text-red-500 text-sm mb-4">{errorMessage}</p>
            {/if}

            <form class="flex flex-col" on:submit|preventDefault={login}>
                <input type="email" bind:value={email} placeholder="Email" required
                       class="mb-4 p-2 border border-gray-300 rounded-lg text-base">
                <input type="password" bind:value={password} placeholder="Mật khẩu" required
                       class="mb-4 p-2 border border-gray-300 rounded-lg text-base">
                <a href="quenmk" class="text-sm text-blue-500 hover:underline mb-4 text-right">Quên mật khẩu?</a>
                <button type="submit" class="bg-[#00205b] text-white py-3 rounded-lg text-sm">Đăng Nhập</button>
            </form>

            <div class="flex items-center my-4 text-gray-500">
                <span class="flex-1 border-b border-gray-300"></span>
                <span class="px-2">Hoặc</span>
                <span class="flex-1 border-b border-gray-300"></span>
            </div>

            <p class="text-center mt-4 text-gray-500 text-sm">
                Bạn là người mới? <a href="register" class="text-blue-500 hover:underline">Tạo tài khoản ngay</a>
            </p>
        </div>

        <!-- Llama Image -->
        <div class="flex-1 flex items-center justify-center">
            <img src="/img/ảnh tượng trưng.png" alt="Llama" class="max-w-full h-auto">
        </div>
    </div>
</div>
  