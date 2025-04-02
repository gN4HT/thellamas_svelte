<script lang="ts">
    import type {Folder} from "../models/folder";

    let props: { folder: Folder } = $props();
</script>

<div class="bg-white shadow rounded-lg overflow-hidden">
    <a href="/app/inventory/all?folder={props.folder.id}"
       class="p-10 flex items-center justify-center relative" style="background-color: {props.folder.color || '#6A7282'}">
        <span class="text-4xl text-gray-300"><i class="fa-solid fa-folder-open"></i></span>
        {#if props.folder.isNew}
            <span class="absolute bottom-2 left-2 text-xs bg-black text-white px-2 py-1 rounded">MỚI</span>
        {/if}
    </a>
    <div class="p-4">
        <p class="mt-2 font-semibold text-gray-700">{props.folder.name}</p>
    </div>
</div>