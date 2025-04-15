<script>
    import SidebarLink from './SidebarLink.svelte';
    let isOpen = false;  // Trạng thái sidebar mobile
  </script>
  
  <!-- Nút toggle, chỉ hiển thị trên mobile -->
  <button
    class="md:hidden p-2 bg-gray-800 text-white"
    on:click={() => (isOpen = !isOpen)}
  >
    Toggle Menu
  </button>
  
  {#if isOpen}
    <!-- Sidebar trượt ra khi isOpen = true -->
    <div
      class="md:hidden fixed top-0 left-0 w-64 h-screen bg-white
             dark:bg-gray-800 p-4 z-50"
    >
      <!-- Nút đóng -->
      <button
        class="text-gray-700 dark:text-gray-200 mb-2"
        on:click={() => (isOpen = false)}
      >
        Close
      </button>
      <nav>
        <SidebarLink href="/app" title="Dashboard" />
        <SidebarLink href="/app/inventory" title="Inventory" />
        <SidebarLink href="/app/help" title="Help" />
      </nav>
    </div>
  {/if}
  