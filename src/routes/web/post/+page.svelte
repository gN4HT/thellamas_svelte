<script>
  export let articles = [
    { title: "Shipper tố bị đuổi việc sai luật, công ty giao hàng nói cho 1 triệu 'làm lộ phí xin việc khác'"
    , content: "Cho rằng bị đuổi việc tùy tiện, hai nam shipper gửi đơn đề nghị cơ quan chức năng hỗ trợ. Trong phiên hòa giải, các bên không tìm được tiếng nói chung."
    , image: "bv1.webp" 
    , id: 1},

    { title: "Hợp tác bảo vệ thanh niên yếu thế trước lừa đảo trên mạng"
    , content: "700 cây cà phê trưởng thành của một gia đình ở huyện Krông Nô (tỉnh Đắk Nông) bất ngờ bị chặt phá. Người nhận là chủ vườn làm đơn kêu cứu, nghi người thân..."
    , image: "bv2.jpg" 
    , id: 2 },

    { title: "Ông Putin nói cuộc gặp Nga - Mỹ đầu tiên thắp lên hy vọng"
    , content: "Tổng thống Nga cho biết nước này và Mỹ đã sẵn sàng thiết lập hợp tác, trong bối cảnh hai bên lại có thêm cuộc đàm phán ở Thổ Nhĩ Kỳ."
    , image: "bv3.jpg" 
    , id: 3 },
    
    { title: "Lừa xuất khẩu lao động đi Dubai, đến nơi ‘vào tay’ công ty người Trung Quốc"
    , content: "Các nạn nhân đóng tiền để đi xuất khẩu lao động tại Dubai nhưng không ngờ vừa xuống sân bay thì đã bị chuyển cho các công ty người Trung Quốc và bị..."
    , image: "bv4.webp" 
    , id: 4 },

    { title: "Lần đầu ra mắt bản đồ doanh nghiệp công nghệ số Việt Nam"
    , content: "Bản đồ doanh nghiệp công nghệ số Việt Nam được kỳ vọng sẽ là công cụ quan trọng giúp định vị doanh nghiệp trên thị trường, nâng cao năng lực cạnh tranh, mở rộng..."
    , image: "bv5.webp" 
    , id: 5 },

    { title: "Cao tốc Vân Phong - Nha Trang bị trộm hàng rào bảo vệ"
    , content: "Hàng rào bảo vệ trên tuyến cao tốc Vân Phong - Nha Trang bị trộm cắp, ảnh hưởng đến tiến độ bàn giao sử dụng tuyến cao tốc này."
    , image: "bv6.webp" 
    , id: 6 },
    
    { title: "‘Vua’ sữa đậu nành thu về 28 tỉ đồng bình quân mỗi ngày"
    , content: "Các thương hiệu Vinasoy, Fami… đã mang về doanh thu hơn 4.100 tỉ đồng trong năm vừa qua cho công ty đường lớn nhất tỉnh Quảng Ngãi."
    , image: "bv7.webp" 
    , id: 7 },

    { title: "Hiếu PC mách nước: Yêu cầu đối phương... nhe răng để phát hiện cuộc gọi lừa đảo"
    , content: "Chuyên gia an ninh mạng Ngô Minh Hiếu (Hiếu PC) mách nhỏ chỉ cần yêu cầu đối phương nhe răng, là biết ngay cuộc gọi deepfake lừa đảo."
    , image: "bv8.jpg" 
    , id: 8 },

    { title: "Chủ tịch Hà Nội: Không bàn lùi, quyết khởi công cầu Tứ Liên vào ngày 19-5"
    , content: "Chiều 27-2, Chủ tịch UBND TP Hà Nội Trần Sỹ Thanh đã chủ trì hội nghị nghe báo cáo kế hoạch triển khai các dự án đầu tư xây dựng cầu Tứ Liên và đường dẫn hai..."
    , image: "bv9.jpg" 
    , id: 9 }
    
  ];

  export let giaitri = [
    { title: "Rạp phim bị kiện và nhận phạt 1.500 USD vì quảng cáo 'tùm lum' 25 phút trước giờ chiếu", image: "giaitri1.webp", content: "Một người đàn ông Ấn Độ đã kiện thành công chuỗi rạp chiếu phim lớn nhất Ấn Độ vì phát quá nhiều quảng cáo" },
    { title: "Anh Tú Atus xuất hiện ngắn trong phim Anh trai say hi, fan rầu rĩ", image: "giaitri2.webp", content: "Fan buồn vì Anh Tú Atus xuất hiện 'chưa đầy 2 phút' trong phim Anh trai say hi..." },
    { title: "Bảo Quốc tham gia Vầng trăng cổ nhạc; Nhà gia tiên khuấy động rạp Việt", image: "giaitri3.webp", content: "" }
  ];
  

  export let congnghe = [
    { title: "UAE dùng AI để 'gọi mưa' cho sa mạc", image: "cn1.webp", content: "Dự án AI này hoạt động bằng cách phân tích dữ liệu từ vệ..." },
    { title: "Bybit bị trộm 1,5 tỉ USD chỉ trong vài phút, nghi do tin tặc Triều Tiên", image: "cn2.webp", content: "Sàn giao dịch tiền điện tử Bybit thông báo bị tin tặc đánh cắp 1,5 tỉ USD. Đây được xem là vụ trộm kỹ thuật số lớn nhất trong lịch sử." },
    { title: "Board game gây sốt ở Đài Loan khi người chơi phải ngăn Trung Quốc chiếm đảo", image: "cn3.webp", content: "Trò chơi board game '2045' đang gây sốt ở Đài Loan thời gian gần đây khi đưa người chơi vào bối cảnh giả định căng thẳng về cuộc xung đột ở eo biển Đài Loan." }
  ];

</script>

<div class="p-6">
  <div class="flex gap-6">
    <div class="w-2/3">
      <h1 class="text-xl font-bold mb-4">BÀI VIẾT</h1>
      {#each articles as article}
        <div class="flex gap-4 mb-6 p-4 rounded-lg shadow-md drop-shadow-md ">
          <img class="w-[260px] h-[160px] object-cover rounded-md" src={"/img/" + article.image} alt={article.title} />
          <div>
            <a href={`/web/article/${article.id}`} sveltekit:prefetch>
              <h3 class="text-lg font-semibold">{article.title}</h3>
            </a>
                        <p class="text-sm text-gray-600">{article.content}</p>
          </div>
        </div>
      {/each}
    </div>

    <div class="w-1/3">
      <h2 class="text-xl font-bold mb-4">Giải trí</h2>
      {#each giaitri as giaitri}
        <div class="flex gap-4 mb-4 p-3 rounded-lg shadow-md drop-shadow-md">
          <img class="w-[240px] h-[150px] object-cover rounded-md" src={"/img/" + giaitri.image} alt={giaitri.title} />
          <div>
            <a href=""> <h4 class="text-sm font-semibold">{giaitri.title}</h4> </a>
            <p class="text-sm text-gray-600">{giaitri.content}</p>
          </div>
        </div>
      {/each}

      <h2 class="text-xl font-bold mb-4">Công nghệ</h2>
      {#each congnghe as congnghe}
        <div class="flex gap-4 mb-4 p-3  rounded-lg shadow-md drop-shadow-md">
          <img class="w-[240px] h-[150px] object-cover rounded-md" src={"/img/" + congnghe.image} alt={congnghe.title} />
          <div>
            <a href=""> <h4 class="text-sm font-semibold">{congnghe.title}</h4> </a>
            <p class="text-sm text-gray-600">{congnghe.content}</p>
          </div>
        </div>
      {/each}


    </div>
  </div>
</div>

