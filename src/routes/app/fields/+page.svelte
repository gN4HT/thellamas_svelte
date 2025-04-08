<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';

  // Biến trạng thái
  let fields = [];
  let showModal = false;
  let selectedField = null;
  let isEditMode = false;
  let fieldForm = {
    name: "",
    is_hidden: false,
    value: [], // Đối với checkbox, value sẽ là mảng các tùy chọn (sẽ chuyển thành HTML khi lưu)
    type: "text"
  };

  // Các loại trường gợi ý (đã thêm Checkbox)
  const suggestedTypes = [
    { name: "Văn bản", type: "text" },
    { name: "Email", type: "email" },
    { name: "Số điện thoại", type: "tel" },
    { name: "URL", type: "url" },
    { name: "Ngày tháng", type: "date" },
    { name: "Checkbox", type: "checkbox" }
  ];

  const getToken = () => localStorage.getItem("token");

  // Lấy danh sách trường từ API
  const fetchFields = async () => {
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const result = await apiFetch("/fields", { headers });
      fields = result.map(field => ({
        id: field.id,
        name: field.name,
        is_hidden: field.is_hidden === 1,
        value: field.value || [],
        type: field.type || "text"
      }));
    } catch (error) {
      console.error("Lỗi khi fetch API fields:", error);
    }
  };

  // Hàm tạo HTML cho trường checkbox từ mảng các tùy chọn
  function generateCheckboxHTML(options) {
    return options
            .map(option => `<label><input type="checkbox" value="${option}"> ${option}</label>`)
            .join(' ');
  }

  // Xử lý tạo mới hoặc cập nhật trường
  const handleSubmit = async () => {
    try {
      const url = isEditMode && selectedField
              ? `/fields/${selectedField.id}`
              : "/fields";
      const method = isEditMode ? "PUT" : "POST";
      // Chuyển is_hidden từ boolean sang số (1/0)
      let formData = {
        ...fieldForm,
        is_hidden: fieldForm.is_hidden ? 1 : 0
      };

      // Nếu loại trường là checkbox, chuyển mảng giá trị thành chuỗi HTML
      if (formData.type === 'checkbox' && Array.isArray(formData.value)) {
        formData.value = generateCheckboxHTML(formData.value);
      }

      await apiFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });
      closeModal();
      fetchFields();
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
    }
  };

  // Xử lý xóa trường
  const handleDelete = async (field) => {
    const confirmDelete = confirm(`Bạn có chắc muốn xóa trường: ${field.name}?`);
    if (!confirmDelete) return;
    try {
      const url = `/fields/${field.id}`;
      await apiFetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchFields();
    } catch (error) {
      console.error("Lỗi khi xóa trường:", error);
    }
  };

  // Các hàm điều khiển modal
  function openModal(field = null) {
    isEditMode = !!field;
    selectedField = field;
    if (field) {
      fieldForm = {
        name: field.name,
        is_hidden: field.is_hidden,
        value: field.value,
        type: field.type
      };
    } else {
      fieldForm = {
        name: "",
        is_hidden: false,
        value: fieldForm.type === 'checkbox' ? [] : [],
        type: "text"
      };
    }
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedField = null;
  }

  // Thêm / xoá và cập nhật tùy chọn cho các trường có giá trị kiểu select/checkbox
  function addValueOption() {
    if (!Array.isArray(fieldForm.value)) {
      fieldForm.value = [];
    }
    fieldForm.value = [...fieldForm.value, ""];
  }

  function removeValueOption(index) {
    fieldForm.value = fieldForm.value.filter((_, i) => i !== index);
  }

  function updateValueOption(index, newValue) {
    const newValues = [...fieldForm.value];
    newValues[index] = newValue;
    fieldForm.value = newValues;
  }

  // Validation cho các giá trị nhập vào
  let errorMessage = '';

  function validateField(value) {
    errorMessage = '';
    if (!value) return;
    if (fieldForm.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Email không hợp lệ';
      }
    } else if (fieldForm.type === 'tel') {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) {
        errorMessage = 'Số điện thoại phải có 10 chữ số';
      }
    } else if (fieldForm.type === 'url') {
      try {
        new URL(value);
      } catch (_) {
        errorMessage = 'URL không hợp lệ';
      }
    }
  }

  // Khi chọn loại trường, cập nhật type (và giá trị mặc định nếu cần)
  function handleFieldTypeSelect(type) {
    fieldForm.type = type;
    // Nếu là checkbox, khởi tạo value là mảng rỗng để nhập các tùy chọn
    if (type === 'checkbox') {
      fieldForm.value = [];
    } else {
      fieldForm.value = [];
    }
  }

  // Chỉ cho phép nhập số trong trường SĐT
  function handleKeyPress(event) {
    const keyCode = event.which || event.keyCode;
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  }

  onMount(fetchFields);
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Trường tùy chỉnh</h1>
      <button
              class="bg-[#00307b] text-white px-4 py-2 rounded-lg hover:bg-[#002561] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00307b] flex items-center gap-2 transition-colors duration-200"
              on:click={() => openModal()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        THÊM TRƯỜNG MỚI
      </button>
    </div>

    <!-- Tiêu đề bảng -->
    <div class="grid grid-cols-4 gap-4 py-3 border-b text-sm font-medium text-gray-500">
      <div>TÊN</div>
      <div class="flex items-center gap-1">
        HIỂN THỊ TRONG DANH SÁCH
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      <div>LOẠI</div>
      <div>THAO TÁC</div>
    </div>

    <!-- Nội dung bảng -->
    {#each fields as field}
      <div class="grid grid-cols-4 gap-4 py-4 border-b items-center hover:bg-gray-50 transition-colors duration-150">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-medium">
            {field.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="font-medium text-gray-900">{field.name}</div>
            <div class="text-sm text-gray-500">{field.type}</div>
          </div>
        </div>
        <div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
                    type="checkbox"
                    checked={!field.is_hidden}
                    class="sr-only peer"
                    on:change={() => {
                const updatedField = { ...field, is_hidden: !field.is_hidden };
                selectedField = updatedField;
                fieldForm = { ...updatedField };
                handleSubmit();
              }}
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00307b]"></div>
          </label>
        </div>
        <div class="text-gray-700">{field.type}</div>
        <div class="flex items-center gap-2">
        
          <button
                  aria-label="Chỉnh sửa"
                  class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                  title="Chỉnh sửa"
                  on:click={() => openModal(field)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
                  aria-label="Xóa"
                  class="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-150"
                  title="Xóa"
                  on:click={() => handleDelete(field)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    {/each}

    {#if fields.length === 0}
      <div class="py-8 text-center text-gray-500">
        Chưa có trường tùy chỉnh nào. Hãy thêm trường mới.
      </div>
    {/if}
  </div>
</div>

<!-- Modal thêm/chỉnh sửa trường -->
{#if showModal}
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto m-6">
      <div class="p-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Chỉnh sửa trường tùy chỉnh' : 'Tạo trường tùy chỉnh'}
          </h2>
          <button
                  aria-label="Đóng"
                  class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                  on:click={closeModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex gap-12">
          <!-- Bên trái: Lựa chọn loại trường (chỉ khi tạo mới) -->
          <div class="flex-1">
            {#if !isEditMode}
              <div class="flex items-center bg-blue-50 text-[#00307b] p-4 rounded-lg mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm">Bạn có thể thêm 1 trường tùy chỉnh trong gói Miễn phí.</span>
                <a href="/" class="text-[#00307b] ml-2 hover:underline text-sm font-medium">Xem các gói</a>
              </div>

              <h3 class="text-gray-600 font-medium mb-4">LOẠI TRƯỜNG</h3>
              <div class="space-y-3">
                {#each suggestedTypes as type}
                  <div class="flex items-center">
                    <button
                            class="flex-1 p-4 border rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00307b] {fieldForm.type === type.type ? 'border-[#00307b] bg-blue-50' : 'hover:border-[#00307b] hover:bg-gray-50'}"
                            on:click={() => handleFieldTypeSelect(type.type)}
                    >
                      <div class="flex items-center">
                        <span class="text-gray-700">{type.name}</span>
                      </div>
                    </button>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="p-4 border rounded-lg mb-6">
                <h3 class="font-medium text-gray-900 mb-2">Loại trường hiện tại</h3>
                <p class="text-gray-600">{fieldForm.type}</p>
                <p class="text-sm text-gray-500 mt-2">Không thể thay đổi loại trường sau khi đã tạo.</p>
              </div>
            {/if}
          </div>

          <!-- Bên phải: Cấu hình trường -->
          <div class="w-96 border-l pl-8 space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Tên trường</label>
              <input
                      name="name"
                      type="text"
                      bind:value={fieldForm.name}
                      placeholder="Nhập tên trường..."
                      class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200"
              />
            </div>

            <div>
              <label for="is_hidden" class="block text-sm font-medium text-gray-700 mb-2">Hiển thị trong danh sách</label>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                        name="is_hidden"
                        type="checkbox"
                        checked={!fieldForm.is_hidden}
                        class="sr-only peer"
                        on:change={() => fieldForm.is_hidden = !fieldForm.is_hidden}
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00307b]"></div>
              </label>
            </div>

            <!-- Các tùy chọn cho trường kiểu select/checkbox -->
            {#if fieldForm.type === 'select' || fieldForm.type === 'checkbox'}
              <div>
                <label for="value" class="block text-sm font-medium text-gray-700 mb-2">Tùy chọn</label>
                {#each fieldForm.value as option, index}
                  <div class="flex items-center mb-2">
                    <input
                            name="value"
                            type="text"
                            value={option}
                            on:input={(e) => updateValueOption(index, e.target.value)}
                            placeholder="Nhập tùy chọn..."
                            class="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200"
                    />
                    <button
                            aria-label="Xóa tùy chọn"
                            name="remove_value"
                            class="ml-2 p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                            on:click={() => removeValueOption(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                {/each}
                <button
                        class="mt-2 flex items-center text-[#00307b] hover:text-[#002561] font-medium"
                        on:click={addValueOption}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  Thêm tùy chọn
                </button>
              </div>
            {/if}

            <!-- Xem trước giao diện trường -->
            {#if fieldForm.type && !isEditMode}
              <div class="mt-6 border-t pt-6">
                <h3 class="text-lg font-medium mb-2">Xem trước</h3>
                {#if fieldForm.type === 'text'}
                  <div>
                    <label for="text" class="block text-sm font-medium text-gray-700 mb-2">{fieldForm.name || 'Văn bản'}</label>
                    <input
                            name="text"
                            type="text"
                            placeholder="Nhập văn bản..."
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200"
                    />
                  </div>
                {/if}
                {#if fieldForm.type === 'tel'}
                  <div>
                    <label for="tel" class="block text-sm font-medium text-gray-700 mb-2">{fieldForm.name || 'Số điện thoại'}</label>
                    <input
                            name="tel"
                            type="tel"
                            placeholder="Nhập số điện thoại..."
                            on:keypress={handleKeyPress}
                            pattern="[0-9]{10}"
                            maxlength="10"
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200"
                    />
                  </div>
                {/if}
                {#if fieldForm.type === 'email'}
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">{fieldForm.name || 'Email'}</label>
                    <input
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200"
                    />
                  </div>
                {/if}
                {#if fieldForm.type === 'url'}
                  <div>
                    <label for="url" class="block text-sm font-medium text-gray-700 mb-2">{fieldForm.name || 'Website'}</label>
                    <input
                            name="url"
                            type="url"
                            placeholder="https://example.com"
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200"
                    />
                  </div>
                {/if}
                {#if fieldForm.type === 'date'}
                  <div>
                    <label for="date" class="block text-sm font-medium text-gray-700 mb-2">{fieldForm.name || 'Ngày tháng'}</label>
                    <div class="flex items-center">
                      <input
                              type="date"
                              name="date"
                              class="flex-1 p-3 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200"
                      />
                      <button aria-label="Chọn ngày" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                {/if}
                {#if fieldForm.type === 'select'}
                  <div>
                    <label for="select" class="block text-sm font-medium text-gray-700 mb-2">{fieldForm.name || 'Lựa chọn'}</label>
                    <select
                            name="select"
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200"
                    >
                      <option value="" disabled selected>Chọn một tùy chọn...</option>
                      {#each fieldForm.value as option}
                        <option value={option}>{option}</option>
                      {/each}
                    </select>
                  </div>
                {/if}
                {#if fieldForm.type === 'checkbox'}
                  <div>
                    <label for="checkbox" class="block text-sm font-medium text-gray-700 mb-2">{fieldForm.name || 'Tùy chọn'}</label>
                    <div class="space-y-2">
                      {#each fieldForm.value as option}
                        <div class="flex items-center">
                          <input
                                  type="checkbox"
                                  name="checkbox"
                                  class="h-4 w-4 text-[#00307b] focus:ring-[#00307b] border-gray-300 rounded"
                          />
                          <label for="checkbox" class="ml-2 text-gray-700">{option}</label>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/if}

            {#if errorMessage}
              <p class="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {errorMessage}
              </p>
            {/if}
          </div>
        </div>

        <div class="mt-8 flex justify-end pt-6 border-t">
          <button
                  class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg mr-3 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-200"
                  on:click={closeModal}
          >
            HỦY
          </button>
          <button
                  class="bg-[#00307b] text-white px-8 py-3 rounded-lg hover:bg-[#002561] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00307b] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  on:click={handleSubmit}
                  disabled={!fieldForm.name || errorMessage}
          >
            {isEditMode ? 'LƯU' : 'TẠO'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}