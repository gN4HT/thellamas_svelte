<script>
    export let href = '#';   // Đường dẫn
    export let title = '';   // Tiêu đề hiển thị
  </script>
  
  <a
    href={href}
    class="block px-4 py-2 text-gray-700 hover:bg-gray-200
           dark:text-gray-200 dark:hover:bg-gray-700"
  >
    {title}
  </a>
  