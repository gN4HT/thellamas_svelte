<script>
    import { page } from "$app/stores";
</script>

<div class="bg-gray-100 flex flex-col items-center min-h-screen">
    <div class="flex flex-col gap-3 text-center my-8">
        <h2 class="text-3xl font-bold">Các gói phù hợp với doanh nghiệp của bạn</h2>
        <p class="text-gray-600">Chọn gói phù hợp với bạn. Không hợp đồng dài hạn. Nâng cấp khi bạn phát triển.</p>

    </div>
    <div class="mt-[100px]">
        <slot />
    </div>
</div>

<style>
    .plan.active {
        background-color: #00205b;
        color: white;
    }
</style>
