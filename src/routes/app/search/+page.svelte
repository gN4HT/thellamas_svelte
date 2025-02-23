<script>
    let sections = {
      folders: true,
      name: true,
      quantity: true,
      minlevel: true
    };

    let icon = [
                  { icon: 'fa-folder', title: 'Thư mục', desc: 'Lấy danh sách các mục trong các thư mục cụ thể' },
                  { icon: 'fa-sort-amount-up', title: 'Số lượng', desc: 'Lọc các mặt hàng dựa trên mức tồn kho của chúng' },
                  { icon: 'fa-balance-scale', title: 'Mức tối thiểu', desc: 'Xác định các mục dưới hoặc trên mức tối thiểu của chúng' },
                  { icon: 'fa-qrcode', title: 'Mã vạch / Mã QR', desc: 'Tìm tất cả các mục khớp với mã vạch hoặc mã QR cụ thể' },
                  { icon: 'fa-filter', title: 'Bộ lọc tùy chỉnh', desc: 'Thêm bộ lọc phù hợp với bất kỳ trường tùy chỉnh nào trong hệ thống của bạn' },
                  { icon: 'fa-list-alt', title: 'Tóm tắt', desc: 'Nhóm các mục có cùng ID Sortly' }
                ];
  
    function toggleSection(section) {
      sections[section] = !sections[section];
    }
  </script>
  
  <div class="flex w-full">
    <div class="w-[300px] bg-white p-4 shadow-md fixed h-screen border-r border-gray-300">
      <h2 class="text-lg font-bold mb-4">Bộ lọc</h2>
      
      <!-- Thư mục -->
      <div class="border-b py-4">
        <div class="flex justify-between items-center cursor-pointer" on:click={() => toggleSection('folders')}>
          <div class="flex items-center">
            <i class="fas fa-chevron-down transition-transform mr-2" class:rotate-180={sections.folders}></i>
            <span class="font-semibold">Thư mục</span>
          </div>
          <i class="fas fa-search text-blue-500"></i>
        </div>
        {#if sections.folders}
          <div class="mt-4">
            <label class="flex items-center gap-2 bg-blue-100 p-2 rounded">
              <input type="checkbox" class="w-4 h-4 text-blue-500 accent-blue-500" checked />
              Tất cả mặt hàng
            </label>
          </div>
        {/if}
      </div>
      
      <!-- Tên -->
      <div class="border-b py-4">
        <div class="flex justify-between items-center cursor-pointer" on:click={() => toggleSection('name')}>
          <div class="flex items-center">
            <i class="fas fa-chevron-down transition-transform mr-2" class:rotate-180={sections.name}></i>
            <span class="font-semibold">Tên</span>
          </div>
          <i class="fas fa-search text-blue-500"></i>
        </div>
        {#if sections.name}
          <div class="mt-4 text-gray-500 text-sm">Không có dữ liệu.</div>
        {/if}
      </div>
      
      <!-- Số lượng -->
      <div class="border-b py-4">
        <div class="flex justify-between items-center cursor-pointer" on:click={() => toggleSection('quantity')}>
          <div class="flex items-center">
            <i class="fas fa-chevron-down transition-transform mr-2" class:rotate-180={sections.quantity}></i>
            <span class="font-semibold">Số lượng</span>
          </div>
          <i class="fas fa-search text-blue-500"></i>
        </div>
        {#if sections.quantity}
          <div class="mt-4">
            <input type="text" placeholder="Bất kỳ đơn vị nào" class="w-full p-2 border rounded" />
            <div class="flex gap-2 mt-2">
              <input type="number" placeholder="Tối thiểu" class="w-1/2 p-2 border rounded" />
              <input type="number" placeholder="Tối đa" class="w-1/2 p-2 border rounded" />
            </div>
          </div>
        {/if}
      </div>
      
      <!-- Mức tối thiểu -->
      <div class="border-b py-4">
        <div class="flex justify-between items-center cursor-pointer" on:click={() => toggleSection('minlevel')}>
          <div class="flex items-center">
            <i class="fas fa-chevron-down transition-transform mr-2" class:rotate-180={sections.minlevel}></i>
            <span class="font-semibold">Mức tối thiểu</span>
          </div>
          <i class="fas fa-search text-blue-500"></i>
        </div>
        {#if sections.minlevel}
          <div class="mt-4">
            <select class="w-full p-2 border rounded bg-gray-100">
              <option>Bất cứ đơn vị nào</option>
            </select>
          </div>
        {/if}
      </div>
      
      <button class="w-full mt-4 bg-green-600 text-white py-2 rounded">Áp dụng bộ lọc</button>
    </div>
    <!-- Content -->
    <div class="ml-[300px] p-4 w-full">
        <h1 class="text-3xl font-bold border-b border-gray-300 pb-4">
          Tìm kiếm nâng cao
        </h1>
        <div class="flex justify-center items-center mt-[150px] w-full bg-gray-100">
            <div class="text-center">
              <h2 class="text-2xl font-semibold mb-6">
                Tạo danh sách các mặt hàng trong kho của bạn bằng nhiều bộ lọc
              </h2>
              <div class="grid grid-cols-3 gap-6 w-[800px] mx-auto">
                {#each icon as item}
                  <div class="flex flex-col items-center p-4 rounded-lg gap-3 bg-white shadow-md">
                    <i class="fas {item.icon} text-blue-500 text-2xl bg-blue-100 p-2 rounded-xl"></i>
                    <h3 class="font-bold">{item.title}</h3>
                    <p class="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                {/each}
              </div>
            </div>
          </div>
      </div>
  </div>
  