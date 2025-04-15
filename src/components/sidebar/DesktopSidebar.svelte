<script>
    import SidebarLink from './SidebarLink.svelte';
  </script>
  
  <div
    class="hidden md:flex flex-col w-20 hover:w-64 duration-300
           bg-white dark:bg-gray-800 min-h-screen overflow-hidden"
  >
    <div class="p-4 text-xl font-bold whitespace-nowrap">
      My Sidebar
    </div>
    <nav class="flex-1 space-y-1">
      <SidebarLink href="/app" title="Dashboard" />
      <SidebarLink href="/app/inventory" title="Inventory" />
      <SidebarLink href="/app/help" title="Help" />
    </nav>
  </div>
  