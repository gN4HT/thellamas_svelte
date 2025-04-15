<script>
    export let item = {};
</script>

<div class="item-resource p-4 border-b bg-white hover:bg-gray-50 transition duration-200">
    <div class="font-semibold text-lg text-gray-800">
        {item.name || 'Chưa đặt tên'}
    </div>
    <div class="text-sm text-gray-600 mt-1">
        Số lượng: {item.quantity ?? 0}
    </div>
    <div class="text-sm text-gray-600 mt-1">
        Giá: {item.price ? `$${item.price}` : '—'}
    </div>
    {#if item.folder_name}
        <div class="text-sm text-gray-600 mt-1">
            Thư mục: {item.folder_name}
        </div>
    {/if}
    {#if item.tags && item.tags.length > 0}
        <div class="text-sm text-gray-600 mt-1">
            Tags:
            <ul>
                {#each item.tags as tag}
                    <li>{tag.name}</li>
                {/each}
            </ul>
        </div>
    {/if}
    {#if item.fields && item.fields.length > 0}
        <div class="text-sm text-gray-600 mt-1">
            Fields:
            <ul>
                {#each item.fields as field}
                    <li>{field.name}</li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
