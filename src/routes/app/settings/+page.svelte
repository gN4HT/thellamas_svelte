<script>
  import { apiFetch } from "$lib/api";
  import { onMount } from "svelte";

  let user = {
    id: null,
    name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    addresses: "",
    profile_picture: null,
  };

  let avatarPreview = "https://via.placeholder.com/150";
  let errorMessage = "";
  let successMessage = "";

  // Hàm tải thông tin người dùng
  async function userInf() {
    try {
      const userData = await apiFetch("/me");

      if (!userData || !userData.id) {
        throw new Error("Không tìm thấy thông tin người dùng.");
      }

      user = {
        id: userData.id,
        name: userData.name ?? "",
        email: userData.email ?? "",
        phone_number: userData.phone_number ?? "",
        date_of_birth: userData.date_of_birth ?? "",
        addresses: userData.addresses ?? "",
        profile_picture: null,
      };

      avatarPreview = `http://127.0.0.1:8000/${userData.profile_picture}` || "https://via.placeholder.com/150";
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
      errorMessage = "Lỗi khi tải thông tin người dùng: " + error.message;
    }
  }

  // Hàm xử lý thay đổi file ảnh đại diện
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      user.profile_picture = file;
      avatarPreview = URL.createObjectURL(file);
    }
  }

  // Hàm cập nhật thông tin người dùng
  async function updateUser() {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone_number", user.phone_number);
    formData.append("date_of_birth", user.date_of_birth);
    formData.append("addresses", user.addresses);

    if (user.profile_picture) {
      formData.append("profile_picture", user.profile_picture);
    }

    try {
      const response = await apiFetch(`/user/${user.id}`, {
        method: "POST",
        body: formData,
        headers: {
          "X-HTTP-Method-Override": "PUT",
        },
      });

      if (response.success) {
        successMessage = "Cập nhật thành công!";
        errorMessage = "";
      } else {
        throw new Error("Cập nhật thất bại trên server");
      }
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
      errorMessage = "Lỗi khi cập nhật: " + error.message;
      successMessage = "";
    }
  }

  // Hàm xử lý thay đổi mật khẩu
  async function changePassword(event) {
    event.preventDefault(); // Ngăn form tự động submit

    const currentPassword = document.getElementById("current_password").value;
    const newPassword = document.getElementById("new_password").value;
    const confirmPassword = document.getElementById("new_password_confirmation").value;

    // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có khớp không
    if (newPassword !== confirmPassword) {
      errorMessage = "Mật khẩu mới và mật khẩu xác nhận không khớp.";
      return;
    }

    const data = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword
    };

    try {
      const response = await apiFetch("/user/change-password", {
        method: "PUT",
        body: data
      });

      if (response && response.success) {
        successMessage = "Mật khẩu đã được thay đổi thành công!";
        errorMessage = "";  // Reset thông báo lỗi nếu thành công
        document.getElementById("current_password").value = "";
        document.getElementById("new_password").value = "";
        document.getElementById("new_password_confirmation").value = "";
      } else {
        throw new Error(response?.message || "Có lỗi xảy ra khi thay đổi mật khẩu.");
      }
    } catch (error) {
      console.error("Lỗi thay đổi mật khẩu:", error);
      errorMessage = error.message || "Có lỗi không xác định khi thay đổi mật khẩu.";
      successMessage = "";  // Reset thông báo thành công nếu có lỗi
    }
  }

  // Tải thông tin người dùng khi component mount
  onMount(() => {
    userInf();
  });
</script>


<div>
  <h1 class="text-3xl font-semibold pb-6 border-b border-gray-500">Hồ Sơ Người Dùng</h1>

  <div class="bg-white shadow-md rounded-lg p-6 mb-6">
    <h2 class="text-xl font-semibold mb-4">Thông Tin Cá Nhân</h2>

    <form on:submit|preventDefault={updateUser} enctype="multipart/form-data">
      <div class="grid grid-cols-3 gap-6">
        <!-- Cột 1: Ảnh đại diện -->
        <div class="flex flex-col items-center">
          <img src={avatarPreview} alt="Avatar" class="w-32 h-32 rounded-full object-cover mb-4" />
          <label class="block text-gray-600 mb-2">Thay ảnh đại diện</label>
          <input type="file" accept="image/*" on:change={handleFileChange} class="w-full border rounded-lg p-2" />
        </div>

        <!-- Cột 2 -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-600">Họ và tên</label>
            <input type="text" bind:value={user.name} class="w-full border rounded-lg p-2 mt-1" />
          </div>
          <div>
            <label class="block text-gray-600">Email</label>
            <input type="email" bind:value={user.email} class="w-full border rounded-lg p-2 mt-1" />
          </div>
          <div>
            <label class="block text-gray-600">Số điện thoại</label>
            <input type="text" bind:value={user.phone_number} class="w-full border rounded-lg p-2 mt-1" />
          </div>
        </div>

        <!-- Cột 3 -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-600">Ngày sinh</label>
            <input type="date" bind:value={user.date_of_birth} class="w-full border rounded-lg p-2 mt-1" />
          </div>
          <div>
            <label class="block text-gray-600">Địa chỉ</label>
            <input type="text" bind:value={user.addresses} class="w-full border rounded-lg p-2 mt-1" />
          </div>
        </div>
      </div>


      <button type="submit" class="mt-6 bg-[#00205b] text-white px-6 py-2 rounded-lg hover:bg-white hover:text-[#00205b] border border-[#00205b]">
        Lưu Thay Đổi
      </button>
    </form>
  </div>

  <!-- Đổi mật khẩu -->
  <form on:submit|preventDefault={changePassword}>
    <div class="grid grid-cols-2 gap-4">
      <div class="relative">
        <label for="current_password" class="block text-gray-600">Mật khẩu hiện tại</label>
        <input type="password" id="current_password" name="current_password" class="w-full border rounded-lg p-2 mt-1" required />
      </div>
      <div>
        <label for="new_password" class="block text-gray-600">Mật khẩu mới</label>
        <input type="password" id="new_password" name="new_password" class="w-full border rounded-lg p-2 mt-1" required />
      </div>
      <div>
        <label for="new_password_confirmation" class="block text-gray-600">Xác nhận mật khẩu mới</label>
        <input type="password" id="new_password_confirmation" name="new_password_confirmation" class="w-full border rounded-lg p-2 mt-1" required />
      </div>
    </div>
  
    <button type="submit" class="mt-4 bg-[#00205b] text-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#00205b] border border-[#00205b]">
      Lưu Thay Đổi
    </button>
  
    {#if errorMessage}
      <p class="text-red-500 mt-4">{errorMessage}</p> <!-- Thông báo lỗi màu đỏ -->
    {/if}
  
    {#if successMessage}
      <p class="text-green-500 mt-4">{successMessage}</p> <!-- Thông báo thành công màu xanh lá -->
    {/if}
  
    <a href="/web/forgotPassword" class="text-[#00205b] ml-4">Quên mật khẩu?</a>
  </form>
  
</div>
