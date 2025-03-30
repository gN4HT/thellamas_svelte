<script lang="ts">

    import {error} from "@sveltejs/kit";
    import {goto} from "$app/navigation";
    import type {AccessToken} from "../../../models/auth/accessToken";

    let email = "";
    let password = "";
    let errorMessage = "";
    export const login = async (event: SubmitEvent) => {

        event.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
                credentials: "include", //Allows cookies to be stored!
            });

            const data: AccessToken = await response.json();
            if (!response.ok) {
                return {message: data.message || "Đăng ký thất bại!"}
            }
            localStorage.setItem("token", data.access_token);
            await goto("/app");
            return {success: true};
        } catch (err) {
            error(500, "Không thể kết nối đến server!");
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

            <form class="flex flex-col" onsubmit={login}>
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
  