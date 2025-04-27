<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { apiFetch } from '$lib/api';
    import { goto } from '$app/navigation';

    let selectedPlan = null;
    let loading = false;
    let error = null;
    let userId = null;

    // Form data
    let formData = {
        amount: 0,
        user_billing_address: ''
    };

    // Hàm tạo order code ngẫu nhiên
    const generateOrderCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = 10;
        const timestamp = new Date().getTime().toString().slice(-4);
        let result = '';
        
        // Tạo chuỗi ngẫu nhiên
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        // Kết hợp với timestamp để đảm bảo unique
        return `ORD${result}${timestamp}`;
    };

    // Hàm lấy thông tin user
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const userData = await response.json();
            userId = userData.id;
            console.log('User ID:', userId);
        } catch (err) {
            console.error('Error fetching user info:', err);
            error = "Không thể lấy thông tin người dùng";
        }
    };

    // Hàm tính ngày bắt đầu và kết thúc
    const calculateDates = (amountTime) => {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + amountTime);
        
        return {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
        };
    };

    onMount(async () => {
        await fetchUserInfo(); // Lấy user_id trước
        
        const planId = $page.url.searchParams.get('plan');
        console.log('Plan ID:', planId);
        
        if (planId) {
            try {
                loading = true;
                const response = await fetch(`http://127.0.0.1:8000/api/plans/${planId}`);
                console.log('Raw Response:', response);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const jsonData = await response.json();
                console.log('Response Data:', jsonData);

                selectedPlan = {
                    id: jsonData.id,
                    name: jsonData.name,
                    description: jsonData.description,
                    price: jsonData.price,
                    amount_time: jsonData.amount_time || 1
                };
                console.log('Selected Plan:', selectedPlan);
                formData.amount = selectedPlan.price || 0;
            } catch (err) {
                error = "Không thể tải thông tin gói: " + (err.message || "Lỗi không xác định");
                console.error('Error in onMount:', err);
            } finally {
                loading = false;
            }
        } else {
            error = "Không tìm thấy ID gói đăng ký";
        }
    });

    const handleSubmit = async () => {
        if (!selectedPlan) {
            error = "Vui lòng chọn gói đăng ký";
            return;
        }

        if (!userId) {
            error = "Không tìm thấy thông tin người dùng";
            return;
        }

        if (!formData.user_billing_address.trim()) {
            error = "Vui lòng nhập địa chỉ thanh toán";
            return;
        }

        try {
            loading = true;
            const planId = $page.url.searchParams.get('plan');
            console.log('Submitting order for plan:', planId);
            
            // Tính toán ngày bắt đầu và kết thúc
            const dates = calculateDates(selectedPlan.amount_time);
            
            const orderData = {
                plan_id: planId,
                user_id: userId,
                amount: selectedPlan.price,
                start_date: dates.start_date,
                end_date: dates.end_date,
                order_code: generateOrderCode(),
                status: 'pending',
                user_billing_address: formData.user_billing_address
            };
            console.log('Order Data:', orderData);

            // 1. Tạo order
            const orderResponse = await apiFetch('orders', {
                method: 'POST',
                body: orderData
            });
            console.log('Order Response:', orderResponse);

            // Kiểm tra response chi tiết hơn
            if (!orderResponse) {
                throw new Error('Không nhận được phản hồi từ server');
            }

            console.log('Full order response:', orderResponse);
            
            // Kiểm tra ID từ response
            const orderId = orderResponse.id;
            if (!orderId) {
                throw new Error('Không tìm thấy ID đơn hàng trong phản hồi');
            }

            console.log('Order ID:', orderId);

            // 2. Lấy payment URL
            const paymentResponse = await fetch(`http://127.0.0.1:8000/api/payments/${orderId}/zalopay/payment-url`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!paymentResponse.ok) {
                const errorData = await paymentResponse.json();
                throw new Error(errorData.message || 'Không thể tạo URL thanh toán');
            }

            const paymentData = await paymentResponse.json();
            console.log('Payment URL Response:', paymentData);
            
            if (paymentData && paymentData.payment_url) {
                // 3. Chuyển hướng đến trang thanh toán VNPay
                window.location.href = paymentData.payment_url;
            } else {
                throw new Error('Không nhận được URL thanh toán');
            }

        } catch (err) {
            error = err.message || "Có lỗi xảy ra khi tạo đơn hàng";
            console.error('Error in handleSubmit:', err);
        } finally {
            loading = false;
        }
    };
</script>

<div class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Đặt hàng</h1>

    {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
        </div>
    {/if}

    {#if loading}
        <div class="text-center py-8">
            <p class="text-gray-600">Đang tải thông tin...</p>
        </div>
    {:else if selectedPlan}
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-semibold mb-4">Thông tin gói đăng ký</h2>
            <div class="space-y-2">
                <p><span class="font-medium">Tên gói:</span> {selectedPlan.name || 'N/A'}</p>
                <p><span class="font-medium">Mô tả:</span> {selectedPlan.description || 'Không có mô tả'}</p>
                <p><span class="font-medium">Giá:</span> {selectedPlan.price || 0} VNĐ/tháng</p>
            </div>
        </div>

        <form on:submit|preventDefault={handleSubmit} class="bg-white p-6 rounded-lg shadow-md">
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2">
                    Địa chỉ thanh toán
                </label>
                <textarea
                    bind:value={formData.user_billing_address}
                    class="w-full p-2 border rounded"
                    rows="3"
                    placeholder="Nhập địa chỉ thanh toán đầy đủ"
                    required
                ></textarea>
            </div>

            <div class="mb-6">
                <p class="text-center text-gray-600 mb-4">
                    Thanh toán qua VNPay - Cổng thanh toán trực tuyến an toàn và bảo mật
                </p>
                <img src="/vnpay-logo.png" alt="VNPay Logo" class="h-12 mx-auto mb-4">
            </div>

            <button
                type="submit"
                class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Đang xử lý...' : 'Tiến hành thanh toán qua VNPay'}
            </button>
        </form>
    {:else}
        <div class="text-center py-8">
            <p class="text-gray-600">Không tìm thấy thông tin gói đăng ký</p>
        </div>
    {/if}
</div>
