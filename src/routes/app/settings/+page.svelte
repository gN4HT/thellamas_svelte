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

  async function userInf() {
    try {
      const data = await apiFetch("/user"); 
      const firstUser = data[0];

      user = {
        id: firstUser.id,
        name: firstUser.name ?? "",
        email: firstUser.email ?? "",
        phone_number: firstUser.phone_number ?? "",
        date_of_birth: firstUser.date_of_birth ?? "",
        addresses: firstUser.addresses ?? "",
        profile_picture: null,
      };

      avatarPreview = firstUser.profile_picture ?? avatarPreview;
    } catch (error) {
      errorMessage = "Lỗi khi tải thông tin người dùng: " + error.message;
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      user.profile_picture = file;
      avatarPreview = URL.createObjectURL(file);
    }
  }

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


  onMount(userInf);
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
          
            {#if errorMessage}
              <p class="text-red-500 mt-4">{errorMessage}</p>
            {/if}
            {#if successMessage}
              <p class="text-green-500 mt-4">{successMessage}</p>
            {/if}
          
            <button type="submit" class="mt-6 bg-[#00205b] text-white px-6 py-2 rounded-lg hover:bg-white hover:text-[#00205b] border border-[#00205b]">
              Lưu Thay Đổi
            </button>
          </form>
          
          
    </div>

    <!-- Đổi mật khẩu -->
    <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Đổi Mật Khẩu</h2>
        <form action="#" method="POST">
            <div class="grid grid-cols-2 gap-4">
                <div class="relative">
                    <label for="current_password" class="block text-gray-600">Mật khẩu hiện tại</label>
                    <input type="password" name="current_password" class="w-full border rounded-lg p-2 mt-1" placeholder="Nhập mật khẩu hiện tại">
                    <span class="absolute right-3 top-9 cursor-pointer text-gray-500">👁️</span>
                </div>
                <div>
                    <label for="new_password" class="block text-gray-600">Mật khẩu mới</label>
                    <input type="password" name="new_password" class="w-full border rounded-lg p-2 mt-1" placeholder="Nhập mật khẩu mới">
                </div>
            </div>
            <button type="submit" class="mt-4 bg-[#00205b] text-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#00205b] border border-[#00205b]">
                Lưu Thay Đổi
            </button>
            <a href="/forgot-password" class="text-[#00205b] ml-4">Quên mật khẩu?</a>
        </form>
    </div>
</div>
