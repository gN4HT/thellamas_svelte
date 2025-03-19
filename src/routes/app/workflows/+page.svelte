<script>
    // Dữ liệu giả lập JSON
    let workflowData = [
        {
            id: 1,
            icon: "fa-list-ul",
            title: "Danh sách chọn",
            description:
                "Dễ dàng yêu cầu các mặt hàng để lấy với Pick Lists của Sortly. Tạo danh sách, thêm mặt hàng và chỉ định cho người dùng để xem xét hoặc lấy. Số lượng tự động cập nhật sau khi mặt hàng được lấy.",
            tags: ["Beta", "Mới"],
        },
        {
            id: 2,
            icon: "fa-cart-shopping",
            title: "Đơn đặt hàng",
            description:
                "Đơn giản hóa quy trình mua sắm của bạn bằng cách dễ dàng tạo, quản lý và theo dõi đơn đặt hàng mua. Đây là trung tâm cho việc đó.",
            tags: ["Beta", "Mới"],
        }
    ];
</script>

<div class="p-4">
    <!-- Tiêu đề -->
    <div class="border-b border-gray-500">
        <h2 class="text-3xl font-semibold text-gray-800 mb-2">Quy trình làm việc</h2>
        <p class="text-gray-500 mb-4">
            Quy trình công việc là những hành động bạn có thể thực hiện trên kho
            của mình để tương tác với số lượng.
        </p>
    </div>

    <!-- Container chứa các thẻ -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        {#each workflowData as item}
            <!-- Card -->
            <div class="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4">
                <div class="flex items-center justify-between">
          <span class="text-2xl bg-gray-300 p-2 rounded-full w-12 h-12 flex items-center justify-center">
            <i class="fa-solid {item.icon} text-xl text-gray-700"></i>
          </span>
                    <div class="flex gap-2">
                        {#each item.tags as tag}
                            <span class="px-2 py-1 text-sm border border-gray-300 text-gray-700 rounded-md">{tag}</span>
                        {/each}
                    </div>
                </div>
                <span class="text-lg font-semibold text-gray-800">{item.title}</span>
                <p class="text-gray-400 text-sm">{item.description}</p>
            </div>
        {/each}
    </div>
</div>
