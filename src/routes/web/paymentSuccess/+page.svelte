<script>
    let transactionId = "#1234567890";
  
    function handleContinue() {
      alert('Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!');
    }
  </script>
  
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-teal-100">
    <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
      <div class="text-4xl font-bold text-green-500 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.293-7.707a1 1 0 011.414 0L10 11.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        Thành công!
      </div>
      <p class="text-gray-700 text-lg mb-6">
        Thanh toán của bạn đã được xử lý thành công. Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.
      </p>
  
      <div class="bg-gray-100 p-4 rounded-lg shadow-inner mb-6">
        <p class="text-sm text-gray-500">Mã giao dịch:</p>
        <p class="text-lg font-semibold text-gray-800">{transactionId}</p>
      </div>
  
      <button
        on:click={handleContinue}
        class="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        Tiếp tục mua sắm
      </button>
  
      <p class="text-sm text-gray-500 mt-6">Chúng tôi hy vọng bạn có trải nghiệm tuyệt vời.</p>
    </div>
  </div>
  