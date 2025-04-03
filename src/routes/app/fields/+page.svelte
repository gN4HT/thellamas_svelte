<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';

  let selectedField = 'Tên sản phẩm ';
  let fieldType = 'Text';
  let errorMessage = ''; // Thông báo lỗi khi validate

  let fieldValues = {
    'Tên sản phẩm ': '',
    'Ngày tạo': '',
    'Số điện thoại': '',
    'Website': '',
    'Email': ''
  };

  let suggestedFields = [
    {
      name: 'Tên sản phẩm ',
      type: 'Text',
      placeholder: 'Nhập tên sản phẩm ...',
      visible: true,
      validation: (value: string) => {
        if (!value) return 'Tên sản phẩm  không được để trống';
        if (value.length < 2) return 'Tên sản phẩm  phải có ít nhất 2 ký tự';
        if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) return 'Tên sản phẩm  chỉ được chứa chữ cái và khoảng trắng';
        return '';
      }
    },
    {
      name: 'Ngày tạo',
      type: 'Date',
      placeholder: 'Chọn ngày tạo...',
      visible: true,
      validation: (value: string) => {
        if (!value) return 'Ngày tạo không được để trống';
        const date = new Date(value);
        const now = new Date();
        if (date > now) return 'Ngày tạo không thể là ngày trong tương lai';
        return '';
      }
    },
    {
      name: 'Số điện thoại',
      type: 'Tel',
      placeholder: 'Nhập số điện thoại...',
      visible: true,
      validation: (value: string) => {
        if (!value) return 'Số điện thoại không được để trống';
        if (!/^[0-9]{10}$/.test(value)) return 'Số điện thoại phải có đúng 10 chữ số';
        if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(value)) return 'Số điện thoại không hợp lệ';
        return '';
      }
    },
    {
      name: 'Website',
      type: 'URL',
      placeholder: 'https://...',
      visible: true,
      validation: (value: string) => {
        if (!value) return 'Website không được để trống';
        try {
          new URL(value);
          return '';
        } catch {
          return 'URL không hợp lệ';
        }
      }
    },
    {
      name: 'Email',
      type: 'Email',
      placeholder: 'example@domain.com',
      visible: true,
      validation: (value: string) => {
        if (!value) return 'Email không được để trống';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không hợp lệ';
        return '';
      }
    }
  ];

  function handleFieldClick(field) {
    selectedField = field.name;
    fieldType = field.type;
    errorMessage = '';
  }

  function toggleVisibility(field) {
    const index = suggestedFields.findIndex(f => f.name === field.name);
    if (index !== -1) {
      suggestedFields[index].visible = !suggestedFields[index].visible;
      suggestedFields = [...suggestedFields];
    }
  }

  function validateField(value: string) {
    if (!currentField) return;
    errorMessage = currentField.validation(value);
  }

  $: currentField = suggestedFields.find(f => f.name === selectedField);
  $: {
    if (currentField) {
      validateField(fieldValues[currentField.name]);
    }
  }

  let showAddFieldModal = false;
  let customFields = [];

  async function fetchFields() {
    try {
      const result = await apiFetch("http://127.0.0.1:8000/api/fields");
      customFields = result.map(field => ({
        id: field.id,
        name: field.name,
        visible: field.is_hidden === 0,
        options: field.options,
        type: field.type,
        order: field.order
      }));
    } catch (error) {
      console.error("Lỗi khi fetch API fields:", error);
    }
  }

  onMount(() => {
    fetchFields();
  });

  function handleAddField() {
    showAddFieldModal = true;
  }

  function handleCloseModal() {
    showAddFieldModal = false;
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
    }
  }
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Trường tùy chỉnh</h1>
      <button
              class="bg-[#00307b] text-white px-4 py-2 rounded-lg hover:bg-[#002561] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00307b] flex items-center gap-2 transition-colors duration-200"
              on:click={handleAddField}
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

    <!-- Table Content: Duyệt qua customFields lấy từ API -->
    {#each customFields as field}
      <div class="grid grid-cols-4 gap-4 py-4 border-b items-center hover:bg-gray-50 transition-colors duration-150">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-medium">
            {field.name.charAt(0)}
          </div>
          <div>
            <div class="font-medium text-gray-900">{field.name}</div>
            <div class="text-sm text-gray-500">{field.type}</div>
          </div>
        </div>
        <div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" bind:checked={field.visible} class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00307b]"></div>
          </label>
        </div>
        <!-- Thay vì dùng applicableTo, ta hiển thị type của trường -->
        <div class="text-gray-700">{field.type}</div>
        <div class="flex items-center gap-2">
          <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-150" title="Chỉnh sửa">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button class="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-150" title="Xóa">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Add Field Modal -->
{#if showAddFieldModal}
  <div class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto m-6">
      <div class="p-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-semibold text-gray-900">Tạo trường tùy chỉnh</h2>
          <button
                  class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                  on:click={handleCloseModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex gap-12">
          <!-- Left side - Field selection -->
          <div class="flex-1">
            <div class="flex items-center bg-blue-50 text-[#00307b] p-4 rounded-lg mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm">Bạn có thể thêm 1 trường tùy chỉnh trong gói Miễn phí.</span>
              <a href="#" class="text-[#00307b] ml-2 hover:underline text-sm font-medium">Xem các gói</a>
            </div>

            <h3 class="text-gray-600 font-medium mb-4">TRƯỜNG GỢI Ý</h3>

            <div class="space-y-3">
              {#each suggestedFields as field}
                <div class="flex items-center gap-2">
                  <button
                          class="flex-1 p-4 border rounded-lg text-left hover:border-[#00307b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00307b] transition-all duration-200 {selectedField === field.name ? 'border-[#00307b] bg-blue-50' : 'hover:bg-gray-50'}"
                          on:click={() => handleFieldClick(field)}
                  >
                    <div class="flex items-center">
                      <span class="text-gray-700">{field.name}</span>
                    </div>
                  </button>
                  <button
                          class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                          on:click={() => toggleVisibility(field)}
                          title={field.visible ? 'Ẩn trường' : 'Hiện trường'}
                  >
                    {#if field.visible}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#00307b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    {:else}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    {/if}
                  </button>
                </div>
              {/each}
            </div>

            <div class="relative my-8">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center">
                <span class="px-4 text-sm text-gray-500 bg-white">HOẶC</span>
              </div>
            </div>

            <button class="text-[#00307b] hover:text-[#002561] font-medium transition-colors duration-150">
              Tạo trường tùy chỉnh khác
            </button>
          </div>

          <!-- Right side - Field type information -->
          <div class="w-96 border-l pl-8">
            {#if currentField?.visible}
              <div class="mb-4">
                <h3 class="text-xl font-semibold mb-2">{currentField?.name || ''}</h3>
                <p class="text-gray-600 mb-6">Loại trường: <span class="font-medium">{currentField?.type || ''}</span></p>

                {#if currentField?.type === 'Text'}
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Giá trị</label>
                    <input
                            type="text"
                            bind:value={fieldValues[currentField.name]}
                            on:input={() => validateField(fieldValues[currentField.name])}
                            placeholder={currentField.placeholder}
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200 {errorMessage ? 'border-red-500 bg-red-50' : ''}"
                    />
                  </div>
                {/if}

                {#if currentField?.type === 'Tel'}
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    <input
                            type="tel"
                            bind:value={fieldValues[currentField.name]}
                            on:input={() => validateField(fieldValues[currentField.name])}
                            on:keypress={handleKeyPress}
                            placeholder={currentField.placeholder}
                            pattern="[0-9]{10}"
                            maxlength="10"
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200 {errorMessage ? 'border-red-500 bg-red-50' : ''}"
                    />
                  </div>
                {/if}

                {#if currentField?.type === 'Email'}
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                            type="email"
                            bind:value={fieldValues[currentField.name]}
                            on:input={() => validateField(fieldValues[currentField.name])}
                            placeholder={currentField.placeholder}
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200 {errorMessage ? 'border-red-500 bg-red-50' : ''}"
                    />
                  </div>
                {/if}

                {#if currentField?.type === 'URL'}
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                            type="url"
                            bind:value={fieldValues[currentField.name]}
                            on:input={() => validateField(fieldValues[currentField.name])}
                            placeholder={currentField.placeholder}
                            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200 {errorMessage ? 'border-red-500 bg-red-50' : ''}"
                    />
                  </div>
                {/if}

                {#if currentField?.type === 'Date'}
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ngày tạo</label>
                    <div class="flex items-center">
                      <input
                              type="date"
                              bind:value={fieldValues[currentField.name]}
                              on:input={() => validateField(fieldValues[currentField.name])}
                              max={new Date().toISOString().split('T')[0]}
                              class="flex-1 p-3 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-[#00307b] focus:border-[#00307b] transition-all duration-200 {errorMessage ? 'border-red-500 bg-red-50' : ''}"
                      />
                      <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                {/if}

                {#if errorMessage}
                  <p class="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {errorMessage}
                  </p>
                {/if}
              </div>
            {:else}
              <div class="flex items-center justify-center h-full text-gray-500">
                <p>Trường này đang bị ẩn</p>
              </div>
            {/if}
          </div>
        </div>

        <div class="mt-8 flex justify-between items-center pt-6 border-t">
          <span class="text-gray-500">Bước 1/2</span>
          <button
                  class="bg-[#00307b] text-white px-8 py-3 rounded-lg hover:bg-[#002561] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00307b] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  disabled={!!errorMessage}
          >
            TIẾP THEO
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
