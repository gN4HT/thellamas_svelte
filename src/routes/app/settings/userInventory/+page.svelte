<script>
  import { apiFetch } from "$lib/api";
  import { onMount } from "svelte";

  let listUsers = [];
  let errorMessage = "";
  let currentUserRole = "";
  let currentUserId = null;

  // Lấy thông tin người dùng
  async function fetchMe() {
    try {
      const me = await apiFetch("/me");
      currentUserId = me.id;

      const recentInventoryId = me.recent_inventory_id;
      const inventoryInfo = me.user_inventories.find(
        (i) => i.inventory_id === recentInventoryId
      );

      currentUserRole = inventoryInfo?.role ?? "viewer";
    } catch (e) {
      errorMessage = "Không thể lấy thông tin người dùng.";
    }
  }

  // Lấy danh sách người dùng
  async function fetchListUsers() {
    try {
      const data = await apiFetch("/list_users");
      listUsers = data.data;
    } catch (error) {
      errorMessage = "Lỗi khi tải danh sách người dùng.";
    }
  }

  // Cập nhật vai trò người dùng
  async function updateUserRole(userId, newRole) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        errorMessage = "Bạn cần đăng nhập trước khi thực hiện thao tác này.";
        return;
      }

      const dataToSend = {
        user_id: userId,
        role: newRole
      };

      // console.log("Dữ liệu gửi đi: ", dataToSend);

      const response = await apiFetch("/update_role_user", {
        method: "PUT",
        body: dataToSend
      });

      if (response?.message === "Cập nhật vai trò người dùng thành công.") {
        await fetchListUsers();
      } else {
        errorMessage = response?.message || "Có lỗi xảy ra khi cập nhật vai trò.";
      }
    } catch (error) {
      errorMessage = error.message;
    }
  }

  // Gọi các API khi trang được tải
  onMount(async () => {
    await fetchMe();
    await fetchListUsers();
  });
</script>


{#if errorMessage}
  <p class="text-red-500 font-medium mb-4">{errorMessage}</p>
{/if}

<div class="overflow-x-auto bg-white rounded-xl shadow-md">
  <table class="min-w-full text-sm text-gray-700">
    <thead class="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
      <tr>
        <th class="px-6 py-3 text-left font-semibold tracking-wide uppercase">Tên người dùng</th>
        <th class="px-6 py-3 text-left font-semibold tracking-wide uppercase">Vai trò</th>
        <th class="px-6 py-3 text-left font-semibold tracking-wide uppercase">Thao tác</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      {#each listUsers as item}
        <tr class="hover:bg-gray-50 transition">
          <td class="px-6 py-4 font-medium">{item.user?.name}</td>
          <td class="px-6 py-4 capitalize">{item.role}</td>
          <td class="px-6 py-4">
            {#if currentUserRole === 'owner' && item.user.id !== currentUserId}
              <select
                class="bg-white border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                on:change={(e) => updateUserRole(item.user.id, e.target.value)}
                bind:value={item.role}
              >
                <option value="owner">Owner</option>
                <option value="staff">Staff</option>
                <option value="viewer">Viewer</option>
              </select>
            {:else}
              <span class="text-gray-400 italic">Không thể chỉnh sửa</span>
            {/if}
          </td>
          
        </tr>
      {/each}
    </tbody>
  </table>
</div>
