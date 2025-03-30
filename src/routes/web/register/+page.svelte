<script lang="ts">

    export const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // ⬅️ Ensures cookies are stored
                body: JSON.stringify({name, email, password, password_confirmation}),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Đăng ký thất bại!");
            }

            return {success: true, message: data.message};
        } catch (error) {
            console.error("Register error:", error);
            return {success: false, message: "Không thể kết nối đến server!"};
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen font-sans py-20">
    <div class="flex justify-between w-full max-w-5xl">
        <!-- Left Section -->
        <div class="w-[449px]">
            <h1 class="text-4xl font-bold text-black mb-2">Không Bao Giờ Thất Lạc Hàng Lần Nào Nữa</h1>
            <div class="mb-12 max-w-[300px]">
                <p class="text-base text-black">Phần mềm quản lý hàng tồn kho hiệu quả, trực quan và mạnh mẽ giúp doanh
                    nghiệp và nhóm của bạn luôn ngăn nắp</p>
            </div>
            <a class="flex items-center w-full px-5 py-3 mb-5 text-sm font-bold text-white bg-[#00205b] gap-10 hover:bg-[#00205b]">
                <img src="/img/u_google.png" alt=""> Đăng nhập bằng Google
            </a>
            <div class="flex items-center text-sm text-gray-500 my-4">
                <div class="flex-1 border-b border-gray-300"></div>
                <span class="px-4">Hoặc</span>
                <div class="flex-1 border-b border-gray-300"></div>
            </div>
            <form class="flex flex-col w-full max-w-md p-6 bg-white shadow-lg rounded-md">
                <h1 class="text-2xl font-bold mb-6 text-center">Tạo tài khoản</h1>
                <input type="text" placeholder="Tên đầy đủ" required
                       class="mb-4 p-2 border border-gray-300 rounded text-base">
                <input type="email" placeholder="Email" required
                       class="mb-4 p-2 border border-gray-300 rounded text-base">
                <input type="password" placeholder="Password" required
                       class="mb-4 p-2 border border-gray-300 rounded text-base">
                <a href="#" class="p-3 text-lg text-white text-center bg-[#00205b] rounded hover:bg-[#001a48]">Tạo tài
                    khoản</a>
            </form>
            <div class="flex flex-col items-center text-center mt-6 gap-2">
                <p class="text-sm max-w-md">
                    Bằng cách nhấp "Tạo tài khoản", bạn sẽ đồng ý với The Llamas’s
                    <a href="#" class="font-bold text-[#00205b] hover:underline">Điều khoản & Điều kiện</a> và
                    <a href="#" class="font-bold text-[#00205b] hover:underline">Chính sách bảo mật</a>.
                </p>
                <p class="text-sm">
                    Bạn đã có tài khoản? <a href="login" class="font-bold text-blue-700 hover:underline">Đăng nhập
                    ngay</a>
                </p>
            </div>
        </div>

        <!-- Right Section -->
        <div class="flex flex-col items-center flex-1 pt-9">
            <div class="max-w-[250px] text-center mb-5 border border-gray-200 p-5 rounded-lg">
                <div class="flex justify-center mb-3">
                    <img src="/img/Star 1.png" alt="" class="h-5 w-5">
                    <img src="/img/Star 1.png" alt="" class="h-5 w-5">
                    <img src="/img/Star 1.png" alt="" class="h-5 w-5">
                    <img src="/img/Star 1.png" alt="" class="h-5 w-5">
                    <img src="/img/Star 1.png" alt="" class="h-5 w-5">
                </div>
                <p class="italic text-gray-600 text-base mb-2">
                    “Dễ dàng thêm hàng tồn kho. Dễ dàng vận hành. Dễ dàng cá nhân hóa.
                    Nhóm của tôi đã áp dụng The Llamas ngay lập tức!”
                </p>
                <p class="text-sm font-bold text-black">Khâu Văn Nam<br><span
                        class="text-xs text-gray-500">Leader</span></p>
            </div>

            <div class="text-center">
                <p class="text-sm max-w-xs mb-5">Mong muốn của chúng tôi là muốn được tiếp cận càng nhiều doanh nghiệp
                    lớn, vừa và nhỏ để phát triển và hợp lý hóa việc theo dõi, kiểm toán và quản lý hàng tồn kho.</p>
                <div class="grid grid-cols-4 gap-6">
                    <img src="/img/logo2.png" alt="" class="h-10">
                    <img src="/img/logo2.png" alt="" class="h-10">
                    <img src="/img/logo2.png" alt="" class="h-10">
                    <img src="/img/logo2.png" alt="" class="h-10">
                    <img src="/img/logo2.png" alt="" class="h-10">
                    <img src="/img/logo2.png" alt="" class="h-10">
                    <img src="/img/logo2.png" alt="" class="h-10">
                    <img src="/img/logo2.png" alt="" class="h-10">
                </div>
            </div>
        </div>
    </div>
</div>