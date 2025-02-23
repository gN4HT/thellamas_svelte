<header>
     <!-- Top Banner -->
 <div class="bg-gray-400 text-center py-2">
    <p class="text-sm font-medium text-white">Flash Sale: 50% off yearly plans</p>
  </div>

  <!-- Navbar -->
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/">        <img src="./img/1 (1).png" alt="Logo" class="h-10">
        </a>
      </div>

      <!-- Menu Items -->
      <div class="hidden md:flex items-center space-x-6">
        <div class="relative group">
          <a href="#" class="text-gray-700 font-medium">Đặc trưng</a>
          <div class="absolute hidden group-hover:block bg-white shadow rounded-lg mt-2 w-40">
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Feature 1</a>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Feature 2</a>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Feature 3</a>
          </div>
        </div>
        <a href="#" class="text-gray-700 font-medium hover:text-blue-600">Solutions</a>
        <a href="#" class="text-gray-700 font-medium hover:text-blue-600">Enterprise</a>
        <a href="#" class="text-gray-700 font-medium hover:text-blue-600">Pricing</a>
        <a href="#" class="text-gray-700 font-medium hover:text-blue-600">Learn</a>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-4">
        <a href="/web/login" class="text-gray-700 font-medium hover:text-blue-600">Login</a>
        <a href="#" class="bg-[#00205b] text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-blue-700">Start a Free Trial</a>
      </div>
    </div>
  </nav>
</header>
<main>
    <slot />

</main>
<footer class="bg-black text-white py-10">
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Industries -->
        <div>
            <h4 class="text-lg font-bold mb-4">Industries</h4>
            <ul class="space-y-2">
                <li><img src="./img/2 2.png" alt="" class="h-10 w-auto"></li>
                <li class="cursor-pointer hover:underline">Automotive</li>
                <li class="cursor-pointer hover:underline">Dental</li>
                <li class="cursor-pointer hover:underline">Events</li>
                <li class="cursor-pointer hover:underline">Non-Profit</li>
                <li class="cursor-pointer hover:underline">Education</li>
                <li class="cursor-pointer hover:underline">Retail</li>
                <li class="cursor-pointer hover:underline">Antiques</li>
                <li class="cursor-pointer hover:underline">Government</li>
                <li class="cursor-pointer hover:underline">Aviation</li>
                <li class="cursor-pointer hover:underline">View All</li>
            </ul>
        </div>

        <!-- Uses -->
        <div>
            <h4 class="text-lg font-bold mb-4">Uses</h4>
            <ul class="space-y-2">
                <li class="cursor-pointer hover:underline">Inventory Management</li>
                <li class="cursor-pointer hover:underline">Supplies & Consumables Tracking</li>
                <li class="cursor-pointer hover:underline">Asset Tracking</li>
                <li class="cursor-pointer hover:underline">Parts Tracking</li>
                <li class="cursor-pointer hover:underline">Raw Materials Tracking</li>
                <li class="cursor-pointer hover:underline">Tool Tracking</li>
                <li class="cursor-pointer hover:underline">Equipment Tracking</li>
                <li class="cursor-pointer hover:underline">PPE Tracking</li>
                <li class="cursor-pointer hover:underline">IT Asset Tracking</li>
                <li class="cursor-pointer hover:underline">Selling & Ecommerce Inventory Tracking</li>
                <li class="cursor-pointer hover:underline">Barcode Inventory</li>
                <li class="cursor-pointer hover:underline">Inventory App</li>
            </ul>
        </div>

        <!-- Information -->
        <div>
            <h4 class="text-lg font-bold mb-4">Information</h4>
            <ul class="space-y-2">
                <li class="cursor-pointer hover:underline">Pricing</li>
                <li class="cursor-pointer hover:underline">Blog</li>
                <li class="cursor-pointer hover:underline">Glossary</li>
                <li class="cursor-pointer hover:underline">About Us</li>
                <li class="cursor-pointer hover:underline">Reviews</li>
                <li class="cursor-pointer hover:underline">Contact Us</li>
                <li class="cursor-pointer hover:underline">Careers</li>
                <li class="cursor-pointer hover:underline">Help Center</li>
                <li class="cursor-pointer hover:underline">Status</li>
                <li class="cursor-pointer hover:underline">Term of Service</li>
                <li class="cursor-pointer hover:underline">Privacy Policy</li>
            </ul>
        </div>

        <!-- Download & Subscribe -->
        <div>
            <h4 class="text-lg font-bold mb-4">Download</h4>
            <div class="flex space-x-4 mb-6">
                <img src="./img/appstore-removebg-preview 1.png" alt="App Store" class="h-10 w-auto">
                <img src="./img/ggplayne 1.png" alt="Google Play" class="h-10 w-auto">
            </div>
            <h4 class="text-lg font-bold mb-4">Become an Inventory Insider</h4>
            <p class="text-sm mb-4">
                All the inventory news & insights you need, delivered straight to your inbox every week.
            </p>
            <form class="flex flex-col space-y-2">
                <input type="email" placeholder="Email Address" class="p-2 text-black rounded-md">
                <button type="submit" class="bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-gray-200">
                    Submit
                </button>
            </form>
        </div>
    </div>
</footer>
<style>
    @import "tailwindcss";
    @font-face {
      font-family: "PoppinsRegular";
      src: url("/fonts/PoppinsRegular.eot");
      src: url("/fonts/PoppinsRegular.eot") format("embedded-opentype"),
        url("/fonts/PoppinsRegular.woff2") format("woff2"),
        url("/fonts/PoppinsRegular.woff") format("woff"),
        url("/fonts/PoppinsRegular.ttf") format("truetype"),
        url("/fonts/PoppinsRegular.svg#PoppinsRegular") format("svg");
        font-display: swap;
    }
    header, main, footer {  
      font-family: "PoppinsRegular";
      font-size: 14px;
    }
    
    </style>