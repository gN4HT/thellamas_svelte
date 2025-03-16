<script>
  let name = "";
  let quantity = "";
  let alert = "";
  let price = "";
  let images = "";
  let notes = "";
  let folder_id = "";
  let supplier_id = "";
  let tags = "";
  let fields = "";

  async function addProduct() {
    const productData = {
      name,
      quantity: Number(quantity),
      alert: Number(alert),
      price: Number(price),
      images: images.split(","), // Chuyển chuỗi thành mảng (URL ảnh cách nhau bởi dấu ",")
      notes,
      folder_id: Number(folder_id),
      supplier_id: Number(supplier_id),
      tags: tags.split(","),
      fields: fields.split(",")
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/items/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_ACCESS_TOKEN" // Nếu API cần token
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();
      console.log(result);
      alert(result.message);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  }
</script>

<div class="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg">
  <h2 class="text-2xl font-semibold text-gray-800 mb-4">Thêm Sản Phẩm</h2>
  
  <form on:submit|preventDefault={addProduct} class="space-y-4">
    <div>
      <label class="block text-gray-600">Tên sản phẩm</label>
      <input type="text" placeholder="Tên sản phẩm" required 
        class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        on:input={(e) => name = e.target.value}>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-gray-600">Số lượng</label>
        <input type="number" placeholder="Số lượng" required 
          class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          on:input={(e) => quantity = e.target.value}>
      </div>
      <div>
        <label class="block text-gray-600">Mức độ cảnh báo</label>
        <input type="number" placeholder="Số lượng cảnh báo" required 
          class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          on:input={(e) => alert = e.target.value}>
      </div>
    </div>

    <div>
      <label class="block text-gray-600">Giá</label>
      <input type="number" step="0.01" placeholder="Giá" required 
        class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        on:input={(e) => price = e.target.value}>
    </div>

    <div>
      <label class="block text-gray-600">Danh sách ảnh (cách nhau bởi dấu phẩy)</label>
      <input type="text" placeholder="URL ảnh" 
        class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        on:input={(e) => images = e.target.value}>
    </div>

    <div>
      <label class="block text-gray-600">Ghi chú</label>
      <textarea placeholder="Ghi chú" rows="3"
        class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        on:input={(e) => notes = e.target.value}></textarea>
    </div>

    <!-- <div>
      <label class="block text-gray-600">ID thư mục</label>
      <input type="number" placeholder="ID thư mục" required 
        class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        on:input={(e) => folder_id = e.target.value}>
    </div>

    <div>
      <label class="block text-gray-600">ID nhà cung cấp</label>
      <input type="number" placeholder="ID nhà cung cấp" required 
        class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        on:input={(e) => supplier_id = e.target.value}>
    </div>

    <div>
      <label class="block text-gray-600">Tags (cách nhau bởi dấu phẩy)</label>
      <input type="text" placeholder="Tags" 
        class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        on:input={(e) => tags = e.target.value}>
    </div>

    <div>
      <label class="block text-gray-600">Fields (cách nhau bởi dấu phẩy)</label>
      <input type="text" placeholder="Fields" 
        class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        on:input={(e) => fields = e.target.value}>
    </div> -->

    <button type="submit" 
      class="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition">
      Thêm sản phẩm
    </button>
  </form>
</div>
