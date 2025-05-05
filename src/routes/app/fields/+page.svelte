<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';

  // State variables
  let fields = [];
  let showModal = false;
  let selectedField = null;
  let isEditMode = false;
  let fieldForm = {
    name: "",
    is_hidden: false,
    value: [],
    type: "text",
    inventory_id: null
  };


  const getToken = () => localStorage.getItem("token");

  // Fetch fields from API
  const fetchFields = async () => {
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const result = await apiFetch("fields", { headers });
      fields = result.map(field => ({
        id: field.id,
        name: field.name,
        is_hidden: field.is_hidden === 1,
        value: field.value || [],
        type: field.type || "text",
        inventory_id: field.inventory_id
      }));
    } catch (error) {
      console.error("Lỗi khi fetch API fields:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const endpoint = isEditMode && selectedField
        ? `fields/${selectedField.id}`
        : "fields";
      const method = isEditMode ? "PUT" : "POST";

      let requestData;
      if (isEditMode) {
        // Use JSON for editing
        requestData = {
          name: fieldForm.name,
          is_hidden: fieldForm.is_hidden ? 1 : 0,
          type: fieldForm.type,
          inventory_id: fieldForm.inventory_id || null,
          value: fieldForm.type === 'checkbox' ? fieldForm.value : [String(fieldForm.value)]
        };
      } else {
        // Use FormData for creating new fields
        const formData = new FormData();
        formData.append('name', fieldForm.name);
        formData.append('is_hidden', fieldForm.is_hidden ? '1' : '0');
        formData.append('type', fieldForm.type);
        formData.append('inventory_id', fieldForm.inventory_id || '');

        if (fieldForm.type === 'checkbox') {
          fieldForm.value.forEach((val, index) => {
            formData.append(`value[${index}]`, val);
          });
        } else {
          formData.append('value[]', String(fieldForm.value));
        }
        requestData = formData;
      }

      await apiFetch(endpoint, { 
        method, 
        body: requestData,
        headers: isEditMode ? { 'Content-Type': 'application/json' } : undefined
      });

      closeModal();
      fetchFields();
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
    }
  };


  // Handle field deletion
  const handleDelete = async (field) => {
    const confirmDelete = confirm(`Bạn có chắc muốn xóa trường: ${field.name}?`);
    if (!confirmDelete) return;
    try {
      await apiFetch(`fields/${field.id}`, { method: "DELETE" });
      fetchFields();
    } catch (error) {
      console.error("Lỗi khi xóa trường:", error);
    }
  };

  // Modal control functions
  function openModal(field = null) {
    isEditMode = !!field;
    selectedField = field;
    if (field) {
      fieldForm = {
        name: field.name,
        is_hidden: field.is_hidden,
        value: field.value,
        type: field.type,
        inventory_id: field.inventory_id
      };
    } else {
      fieldForm = {
        name: "",
        is_hidden: false,
        value: [],
        type: "text",
        inventory_id: null
      };
    }
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedField = null;
  }

  // Add/Remove value options for select/checkbox fields
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

  // Validation for field values
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

  function handleFieldTypeSelect(type) {
    fieldForm.type = type;
  }

  // For tel input - only allow numbers
  function handleKeyPress(event) {
    const keyCode = event.which || event.keyCode;
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  }

  // Check if value is boolean
  function isBoolean(value) {
    return typeof value === 'boolean';
  }

  onMount(fetchFields);
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-8xl mx-auto bg-white rounded-lg shadow-sm p-6">
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

    <!-- Table Header -->
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

    <!-- Table Content -->
    {#each fields as field}
      <div class="grid grid-cols-4 gap-4 py-4 border-b items-center hover:bg-gray-50 transition-colors duration-150">
        <div class="flex items-center gap-3">
          <div class="w-15 h-8 bg-gray-100 rounded-lg flex items-center justify-start text-gray-500 font-medium">
            {field.name.toUpperCase()}
          </div>
        </div>
        <div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
                    type="checkbox"
                    checked={!field.is_hidden}
                    class="sr-only peer"
                    on:change={() => {
                const updatedField = {...field, is_hidden: !field.is_hidden};
                selectedField = updatedField;
                fieldForm = {...updatedField};
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

<!-- Add/Edit Field Modal -->

{#if showModal}
<div class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
  <div class="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
      <h2 class="text-xl font-bold mb-4">{isEditMode ? 'Sửa trường' : 'Thêm trường mới'}</h2>

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
            <label class="block font-medium">Tên trường:</label>
            <input class="w-full border px-3 py-2 rounded" bind:value={fieldForm.name} required />
        </div>
    
        <div>
            <label class="block font-medium">Ẩn trường?</label>
            <input type="checkbox" bind:checked={fieldForm.is_hidden} />
        </div>
    
        <div>
            <label class="block font-medium">Kiểu trường:</label>
            <select class="w-full border px-3 py-2 rounded" bind:value={fieldForm.type}>
                <option value="text">Văn bản</option>
                <option value="email">Email</option>
                <option value="phone">Số điện thoại</option>
                <option value="web_url">URL</option>
                <option value="date">Ngày</option>
                <option value="checkbox">Checkbox</option>
            </select>
        </div>
    
        <!-- Phần điền giá trị cho checkbox -->
        <div>
            <label class="block font-medium">Giá trị (cho checkbox):</label>
            {#if fieldForm.type === 'checkbox'}
                {#each fieldForm.value as val, index}
                    <div class="flex gap-2 items-center mb-2">
                        <input class="border px-2 py-1 flex-1" bind:value={fieldForm.value[index]} />
                        <button type="button" class="text-red-500" on:click={() => removeValueOption(index)}>✖</button>
                    </div>
                {/each}
                <button type="button" class="bg-green-500 text-white px-2 py-1 rounded" on:click={addValueOption}>+ Thêm giá trị</button>
            {/if}
        </div>
    
        <!-- Phần điền giá trị cho các kiểu trường khác -->
        {#if fieldForm.type !== 'checkbox'}
            <div>
                <label class="block font-medium">Giá trị:</label>
                <input class="w-full border px-3 py-2 rounded" bind:value={fieldForm.value} />
            </div>
        {/if}
    

    
        {#if errorMessage}
            <p class="text-red-500 text-sm">{errorMessage}</p>
        {/if}
    
        <div class="flex justify-end gap-2 mt-4">
            <button type="button" class="px-4 py-2 bg-gray-300 rounded" on:click={closeModal}>Hủy</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">{isEditMode ? 'Lưu' : 'Tạo'}</button>
        </div>
    </form>
    
    </div>
  </div>
{/if}