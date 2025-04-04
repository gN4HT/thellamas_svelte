<script>
    import { apiFetch } from '$lib/api';

    let sections = {
        folders: true,
        name: true,
        quantity: true,
        minlevel: true,
        price: true
    };

    let icon = [
        { icon: 'fa-folder', title: 'Thư mục', desc: 'Lấy danh sách các mục trong các thư mục cụ thể' },
        { icon: 'fa-sort-amount-up', title: 'Số lượng', desc: 'Lọc các mặt hàng dựa trên mức tồn kho của chúng' },
        { icon: 'fa-balance-scale', title: 'Mức tối thiểu', desc: 'Xác định các mục dưới hoặc trên mức tối thiểu của chúng' },
        { icon: 'fa-tag', title: 'Giá', desc: 'Lọc các mặt hàng theo khoảng giá' },
        { icon: 'fa-qrcode', title: 'Mã vạch / Mã QR', desc: 'Tìm tất cả các mục khớp với mã vạch hoặc mã QR cụ thể' },
        { icon: 'fa-filter', title: 'Bộ lọc tùy chỉnh', desc: 'Thêm bộ lọc phù hợp với bất kỳ trường tùy chỉnh nào trong hệ thống của bạn' }
    ];

    let searchResults = [];
    let isLoading = false;
    let error = null;

    // Hàm toggle section của bộ lọc
    function toggleSection(section) {
        sections[section] = !sections[section];
    }

    async function performSearch() {
        isLoading = true;
        error = null;
        updateUI();

        try {
            // Thu thập dữ liệu từ form
            const params = new URLSearchParams();

            const name = document.getElementById('item-name')?.value;
            const minQuantity = document.getElementById('min-quantity')?.value;
            const maxQuantity = document.getElementById('max-quantity')?.value;
            const minPrice = document.getElementById('min-price')?.value;
            const maxPrice = document.getElementById('max-price')?.value;
            const stockLevel = document.getElementById('stock-level')?.value;
            const folderName = document.getElementById('folder-name')?.value;

            if (name) params.append('name', name);
            if (minQuantity) params.append('min_quantity', minQuantity);
            if (maxQuantity) params.append('max_quantity', maxQuantity);
            if (minPrice) params.append('min_price', minPrice);
            if (maxPrice) params.append('max_price', maxPrice);
            if (folderName) params.append('folder_name', folderName);

            // Xử lý riêng cho stock level (1: below, 2: above)
            const stockLevelMap = { '1': 'below', '2': 'above' };
            if (stockLevel && stockLevelMap[stockLevel]) {
                params.append('stock_level', stockLevelMap[stockLevel]);
            }

            // Xây dựng URL với query string
            const baseUrl = 'http://127.0.0.1:8000/api/item_search';
            const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

            // Gọi API sử dụng apiFetch (đã tích hợp token từ localStorage)
            const data = await apiFetch(url, { method: 'GET' });
            searchResults = data.data || [];

            // Hiển thị kết quả tìm kiếm
            document.getElementById('search-results').style.display = 'block';
            document.getElementById('search-intro').style.display = 'none';
        } catch (err) {
            error = err.message;
            console.error('Search error:', err);
        } finally {
            isLoading = false;
            updateUI();
        }
    }

    // Cập nhật giao diện dựa trên trạng thái hiện tại
    function updateUI() {
        // Cập nhật trạng thái loading
        document.getElementById('loading-indicator').style.display = isLoading ? 'flex' : 'none';

        // Hiển thị lỗi nếu có
        const errorEl = document.getElementById('error-message');
        if (error) {
            errorEl.textContent = `Lỗi: ${error}`;
            errorEl.style.display = 'block';
        } else {
            errorEl.style.display = 'none';
        }

        renderSearchResults();
    }

    // Render kết quả tìm kiếm
    function renderSearchResults() {
        const container = document.getElementById('results-container');
        const noResults = document.getElementById('no-results');

        // Xóa các kết quả cũ
        container.innerHTML = '';

        if (searchResults.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        // Thêm từng kết quả vào bảng
        searchResults.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.name || '—'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.quantity || '0'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price || '—'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.folder_name || '—'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" class="text-blue-600 hover:text-blue-900">Chi tiết</a>
                </td>
            `;
            container.appendChild(row);
        });
    }
</script>


<div class="flex w-full">
    <div class="w-[300px] bg-white p-4 shadow-md fixed h-screen border-r border-gray-300 overflow-y-auto">
        <h2 class="text-lg font-bold mb-4">Bộ lọc</h2>

        <!-- Thư mục -->
        <div class="border-b py-4">
            <div class="flex justify-between items-center cursor-pointer" on:click={() => toggleSection('folders')}>
                <div class="flex items-center">
                    <i class="fas fa-chevron-down transition-transform mr-2" class:rotate-180={!sections.folders}></i>
                    <span class="font-semibold">Thư mục</span>
                </div>
                <i class="fas fa-search text-blue-500"></i>
            </div>
            {#if sections.folders}
                <div class="mt-4">
                    <input
                            type="text"
                            id="folder-name"
                            placeholder="Nhập tên thư mục..."
                            class="w-full p-2 border rounded"
                    />
                </div>
            {/if}
        </div>
        <!-- Tên -->
        <div class="border-b py-4">
            <div class="flex justify-between items-center cursor-pointer" on:click={() => toggleSection('name')}>
                <div class="flex items-center">
                    <i class="fas fa-chevron-down transition-transform mr-2" class:rotate-180={!sections.name}></i>
                    <span class="font-semibold">Tên</span>
                </div>
                <i class="fas fa-search text-blue-500"></i>
            </div>
            {#if sections.name}
                <div class="mt-4">
                    <input type="text" id="item-name" placeholder="Tìm kiếm theo tên..." class="w-full p-2 border rounded"/>
                </div>
            {/if}
        </div>

        <!-- Số lượng -->
        <div class="border-b py-4">
            <div class="flex justify-between items-center cursor-pointer" on:click={() => toggleSection('quantity')}>
                <div class="flex items-center">
                    <i class="fas fa-chevron-down transition-transform mr-2" class:rotate-180={!sections.quantity}></i>
                    <span class="font-semibold">Số lượng</span>
                </div>
                <i class="fas fa-search text-blue-500"></i>
            </div>
            {#if sections.quantity}
                <div class="mt-4">
                    <select id="quantity-unit" class="w-full p-2 border rounded mb-2">
                        <option>Bất kỳ đơn vị nào</option>
                    </select>
                    <div class="flex gap-2 mt-2">
                        <input type="number" id="min-quantity" placeholder="Tối thiểu" class="w-1/2 p-2 border rounded"/>
                        <input type="number" id="max-quantity" placeholder="Tối đa" class="w-1/2 p-2 border rounded"/>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Giá -->
        <div class="border-b py-4">
            <div class="flex justify-between items-center cursor-pointer" on:click={() => toggleSection('price')}>
                <div class="flex items-center">
                    <i class="fas fa-chevron-down transition-transform mr-2" class:rotate-180={!sections.price}></i>
                    <span class="font-semibold">Giá</span>
                </div>
                <i class="fas fa-search text-blue-500"></i>
            </div>
            {#if sections.price}
                <div class="mt-4">
                    <div class="flex gap-2">
                        <input type="number" id="min-price" placeholder="Giá tối thiểu" class="w-1/2 p-2 border rounded"/>
                        <input type="number" id="max-price" placeholder="Giá tối đa" class="w-1/2 p-2 border rounded"/>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Mức tối thiểu -->
        <div class="border-b py-4">
            <div class="flex justify-between items-center cursor-pointer" on:click={() => toggleSection('minlevel')}>
                <div class="flex items-center">
                    <i class="fas fa-chevron-down transition-transform mr-2" class:rotate-180={!sections.minlevel}></i>
                    <span class="font-semibold">Mức tồn kho tối thiểu</span>
                </div>
                <i class="fas fa-search text-blue-500"></i>
            </div>
            {#if sections.minlevel}
                <div class="mt-4">
                    <select id="stock-level" class="w-full p-2 border rounded">
                        <option value="">Bất cứ mức nào</option>
                        <option value="1">Dưới mức tối thiểu</option>
                        <option value="2">Trên mức tối thiểu</option>
                    </select>
                </div>
            {/if}
        </div>

        <button on:click={performSearch} class="w-full mt-4 bg-[#00205b] text-white py-2 rounded cursor-pointer border border-[#00205b] hover:bg-white hover:text-blue-900 transition-colors duration-200">
            Áp dụng bộ lọc
        </button>
    </div>

    <!-- Content -->
    <div class="ml-[300px] p-4 w-full">
        <h1 class="text-3xl font-bold border-b border-gray-300 pb-4">
            Tìm kiếm nâng cao
        </h1>

        <!-- Loading Indicator -->
        <div id="loading-indicator" style="display: none;" class="flex justify-center items-center mt-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <!-- Error Display -->
        <div id="error-message" style="display: none;" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"></div>

        <!-- Search Introduction -->
        <div id="search-intro" class="flex justify-center items-center mt-[150px] w-full bg-gray-100">
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

        <!-- Search Results -->
        <div id="search-results" style="display: none;" class="mt-6">
            <h2 class="text-xl font-semibold mb-4">Kết quả tìm kiếm</h2>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thư mục</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200" id="results-container">
                    <!-- Results will be inserted here dynamically -->
                    </tbody>
                </table>
                <div id="no-results" class="p-4 text-center text-gray-500" style="display: none;">
                    Không tìm thấy kết quả phù hợp với bộ lọc của bạn.
                </div>
            </div>
        </div>
    </div>

</div>
