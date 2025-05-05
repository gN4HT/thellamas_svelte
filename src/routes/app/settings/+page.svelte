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

      avatarPreview = `https://tkhoa-innovation.com/invTracker_api/public/storage/${userData.profile_picture}` || "https://via.placeholder.com/150";
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
    event.preventDefault();

    const currentPassword = document.getElementById("current_password").value;
    const newPassword = document.getElementById("new_password").value;
    const confirmPassword = document.getElementById("new_password_confirmation").value;

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
        errorMessage = "";
        document.getElementById("current_password").value = "";
        document.getElementById("new_password").value = "";
        document.getElementById("new_password_confirmation").value = "";
      } else {
        throw new Error(response?.message || "Có lỗi xảy ra khi thay đổi mật khẩu.");
      }
    } catch (error) {
      console.error("Lỗi thay đổi mật khẩu:", error);
      errorMessage = error.message || "Có lỗi không xác định khi thay đổi mật khẩu.";
      successMessage = "";
    }
  }

  onMount(() => {
    userInf();
  });
</script>

<style>
  @media (max-width: 768px) {
    .profile-grid {
      grid-template-columns: 1fr;
    }

    .password-grid {
      grid-template-columns: 1fr;
    }

    .avatar-section {
      margin-bottom: 2rem;
    }

    .form-input {
      width: 100%;
    }

    .button-group {
      flex-direction: column;
      gap: 1rem;
    }

    .forgot-password {
      margin-left: 0;
      margin-top: 1rem;
    }
  }
</style>

<div class="space-y-6">
  <h1 class="text-2xl md:text-3xl font-semibold pb-4 md:pb-6 border-b border-gray-300">Hồ Sơ Người Dùng</h1>

  <!-- Thông tin cá nhân -->
  <div class="bg-white shadow-md rounded-lg p-4 md:p-6">
    <h2 class="text-xl font-semibold mb-4">Thông Tin Cá Nhân</h2>

    <form on:submit|preventDefault={updateUser} enctype="multipart/form-data">
      <div class="profile-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Cột 1: Ảnh đại diện -->
        <div class="avatar-section flex flex-col items-center">
          <img src={avatarPreview} alt="Avatar" class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-4" />
          <label class="block text-gray-600 mb-2">Thay ảnh đại diện</label>
          <input 
            type="file" 
            accept="image/*" 
            on:change={handleFileChange} 
            class="form-input border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
        </div>

        <!-- Cột 2 -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-600">Họ và tên</label>
            <input 
              type="text" 
              bind:value={user.name} 
              class="form-input border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>
          <div>
            <label class="block text-gray-600">Email</label>
            <input 
              type="email" 
              bind:value={user.email} 
              class="form-input border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>
          <div>
            <label class="block text-gray-600">Số điện thoại</label>
            <input 
              type="text" 
              bind:value={user.phone_number} 
              class="form-input border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>
        </div>

        <!-- Cột 3 -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-600">Ngày sinh</label>
            <input 
              type="date" 
              bind:value={user.date_of_birth} 
              class="form-input border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>
          <div>
            <label class="block text-gray-600">Địa chỉ</label>
            <input 
              type="text" 
              bind:value={user.addresses} 
              class="form-input border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        class="mt-6 bg-[#00205b] text-white px-6 py-2 rounded-lg hover:bg-white hover:text-[#00205b] border border-[#00205b] transition-colors duration-200"
      >
        Lưu Thay Đổi
      </button>
    </form>
  </div>

  <!-- Đổi mật khẩu -->
  <div class="bg-white shadow-md rounded-lg p-4 md:p-6">
    <h2 class="text-xl font-semibold mb-4">Đổi Mật Khẩu</h2>
    
    <form on:submit|preventDefault={changePassword}>
      <div class="password-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="current_password" class="block text-gray-600">Mật khẩu hiện tại</label>
          <input 
            type="password" 
            id="current_password" 
            name="current_password" 
            class="form-input border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            required 
          />
        </div>
        <div>
          <label for="new_password" class="block text-gray-600">Mật khẩu mới</label>
          <input 
            type="password" 
            id="new_password" 
            name="new_password" 
            class="form-input border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            required 
          />
        </div>
        <div>
          <label for="new_password_confirmation" class="block text-gray-600">Xác nhận mật khẩu mới</label>
          <input 
            type="password" 
            id="new_password_confirmation" 
            name="new_password_confirmation" 
            class="form-input border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            required 
          />
        </div>
      </div>
    
      <div class="button-group flex items-center mt-4">
        <button 
          type="submit" 
          class="bg-[#00205b] text-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#00205b] border border-[#00205b] transition-colors duration-200"
        >
          Lưu Thay Đổi
        </button>
        <a 
          href="/web/forgotPassword" 
          class="forgot-password text-[#00205b] hover:text-blue-700 transition-colors duration-200"
        >
          Quên mật khẩu?
        </a>
      </div>
    
      {#if errorMessage}
        <div class="mt-4 bg-red-100 text-red-700 border border-red-300 p-4 rounded-md">
          {errorMessage}
        </div>
      {/if}
    
      {#if successMessage}
        <div class="mt-4 bg-green-100 text-green-700 border border-green-300 p-4 rounded-md">
          {successMessage}
        </div>
      {/if}
    </form>
  </div>
</div>
