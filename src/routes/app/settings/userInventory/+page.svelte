<script>
  import { apiFetch } from "$lib/api";
  import { onMount } from "svelte";

  let listUsers = [];
  let errorMessage = "";
  let currentUserRole = "";
  let currentUserId = null;
  let newUserEmail = "";
  let isAdding = false;

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

  async function fetchListUsers() {
    try {
      const data = await apiFetch("/list_users");
      listUsers = data.data;
    } catch (error) {
      errorMessage = "Lỗi khi tải danh sách người dùng.";
    }
  }

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

  async function addUser() {
    try {
      isAdding = true;
      const response = await apiFetch("/user-inventory/add-by-email", {
        method: "POST",
        body: { email: newUserEmail }
      });

      if (response?.message === "Thêm người dùng thành công.") {
        await fetchListUsers();
        newUserEmail = "";
      } else {
        errorMessage = response?.message || "Lỗi khi thêm thành viên.";
      }
    } catch (error) {
      errorMessage = error.message;
    } finally {
      isAdding = false;
    }
  }

  async function removeUser(userId) {
    try {
      const confirmed = confirm("Bạn có chắc chắn muốn xóa thành viên này?");
      if (!confirmed) return;

      const me = await apiFetch("/me");
      const inventoryId = me.recent_inventory_id;

      const response = await apiFetch(`/remove_user/${userId}`, {
        method: "DELETE",
        body: JSON.stringify({ inventory_id: inventoryId }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response?.message === "Xóa người dùng thành công.") {
        await fetchListUsers();
      } else {
        errorMessage = response?.message || "Lỗi khi xóa thành viên.";
      }
    } catch (error) {
      errorMessage = error.message;
    }
  }

  onMount(async () => {
    await fetchMe();
    await fetchListUsers();
  });
</script>

<style>
  @media (max-width: 768px) {
    .table-container {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: #00205b #f1f1f1;
    }

    .table-container::-webkit-scrollbar {
      height: 6px;
    }

    .table-container::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .table-container::-webkit-scrollbar-thumb {
      background: #00205b;
      border-radius: 3px;
    }

    .add-user-form {
      flex-direction: column;
      gap: 1rem;
    }

    .add-user-input {
      width: 100%;
    }

    .add-user-button {
      width: 100%;
    }

    .user-actions {
      flex-direction: column;
      gap: 0.5rem;
    }

    .user-actions select {
      width: 100%;
    }

    .user-actions button {
      width: 100%;
      text-align: center;
    }
  }
</style>

<div class="space-y-6">
  {#if errorMessage}
    <div class="bg-red-100 text-red-700 border border-red-300 p-4 rounded-md">
      {errorMessage}
    </div>
  {/if}

  {#if currentUserRole === 'owner'}
    <div class="add-user-form flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      <input
        type="email"
        bind:value={newUserEmail}
        placeholder="Nhập email thành viên"
        class="add-user-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        on:click={addUser}
        class="add-user-button bg-[#00205b] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#00205b] border border-[#00205b] transition-colors duration-200"
        disabled={isAdding}
      >
        {isAdding ? "Đang thêm..." : "Thêm thành viên"}
      </button>
    </div>
  {/if}

  <div class="table-container">
    <table class="min-w-[800px] w-full text-sm text-gray-700">
      <thead class="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <tr>
          <th class="px-4 md:px-6 py-3 text-left font-semibold tracking-wide uppercase">Tên người dùng</th>
          <th class="px-4 md:px-6 py-3 text-left font-semibold tracking-wide uppercase">Vai trò</th>
          <th class="px-4 md:px-6 py-3 text-left font-semibold tracking-wide uppercase">Thao tác</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        {#each listUsers as item}
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 md:px-6 py-4 font-medium">{item.user?.name}</td>
            <td class="px-4 md:px-6 py-4 capitalize">{item.role}</td>
            <td class="px-4 md:px-6 py-4">
              {#if currentUserRole === 'owner' && item.user.id !== currentUserId}
                <div class="user-actions flex items-center gap-2">
                  <select
                    class="bg-white border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    on:change={(e) => updateUserRole(item.user.id, e.target.value)}
                    bind:value={item.role}
                  >
                    <option value="staff">Staff</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    on:click={() => removeUser(item.user.id)}
                    class="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    Xóa
                  </button>
                </div>
              {:else}
                <span class="text-gray-400 italic">Không thể chỉnh sửa</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
