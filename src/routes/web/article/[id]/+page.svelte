<script>
    export let data;
    let { article, giaitri, congnghe } = data;
</script>

<main>
    <div class="p-6">
        <div class="flex gap-6">
          <!-- Phần nội dung chính -->
          <div class="w-2/3">
            <h1 class="text-xl font-bold mb-4">{article.title}</h1>
            <div class="p-4 rounded-lg shadow-md drop-shadow-md">
                <img class="w-full aspect-[3/2] object-cover rounded-md" 
                src={"/img/" + article.image} 
                alt={article.title} />
           
              <p class="text-sm text-gray-600">{article.content}</p>
            </div>
          </div>
          
          <!-- Sidebar -->
          <aside class="w-1/3 p-4 bg-gray-100 rounded-lg shadow-md drop-shadow-md">
            <h2 class="text-xl font-bold mb-4">Bài viết liên quan</h2>
            
            <!-- Hiển thị danh sách bài viết Giải trí -->
            {#each giaitri as item}
              <div class="mb-4">
                <img class="w-full aspect-[16/9] object-cover rounded-md mb-2" 
                     src={"/img/" + item.image} 
                     alt={item.title} />
                <a href={`/web/article/${item.id}`}> 
                  <h4 class="text-sm font-semibold">{item.title}</h4> 
                </a>
                <p class="text-sm text-gray-600">{item.content}</p>
              </div>
            {/each}

            <!-- Hiển thị danh sách bài viết Công nghệ -->
            {#each congnghe as item}
              <div class="mb-4">
                <img class="w-full aspect-[16/9] object-cover rounded-md mb-2" 
                     src={"/img/" + item.image} 
                     alt={item.title} />
                <a href={`/web/article/${item.id}`}> 
                  <h4 class="text-sm font-semibold">{item.title}</h4> 
                </a>
                <p class="text-sm text-gray-600">{item.content}</p>
              </div>
            {/each}

          </aside>
        </div>
      </div>
</main>
