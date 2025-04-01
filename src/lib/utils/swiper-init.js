import Swiper, { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/swiper-bundle.css";

export function initializeSwiper(selector) {
  return new Swiper(selector, {
    slidesPerView: 1, // Hiển thị 1 slide mỗi lần
    spaceBetween: 10, // Khoảng cách giữa các slide
    loop: true, // Vòng lặp slide
    autoplay: {
      delay: 3000, // Tự động chuyển slide sau 3 giây
      disableOnInteraction: false, // Tiếp tục autoplay khi người dùng tương tác
    },
    navigation: {
      nextEl: ".swiper-button-next", // Nút "Next"
      prevEl: ".swiper-button-prev", // Nút "Previous"
    },
    pagination: {
      el: ".swiper-pagination", // Vị trí hiển thị pagination
      clickable: true, // Cho phép click để chuyển slide
    },
    modules: [Navigation, Pagination, Autoplay], // Các module cần thiết
  });
}
