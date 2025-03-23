<script>
    import { page } from '$app/stores';
</script>

<div class="error-container">
    <div class="error-content">
        <h1>{$page.status}</h1>
        <h2>{$page.error?.message || 'Không tìm thấy trang'}</h2>
        <p>Xin lỗi! Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
        <a href="/" class="home-button">Về trang chủ</a>
    </div>
</div>

<style>
    .error-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8f9fa;
        padding: 2rem;
    }

    .error-content {
        text-align: center;
        max-width: 600px;
        padding: 3rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h1 {
        font-size: 8rem;
        margin: 0;
        color: #e74c3c;
        line-height: 1;
    }

    h2 {
        font-size: 2rem;
        margin: 1rem 0;
        color: #2c3e50;
    }

    p {
        color: #7f8c8d;
        margin-bottom: 2rem;
    }

    .home-button {
        display: inline-block;
        padding: 1rem 2rem;
        background-color: #3498db;
        color: white;
        text-decoration: none;
        border-radius: 0.5rem;
        transition: background-color 0.3s ease;
    }

    .home-button:hover {
        background-color: #2980b9;
    }
</style> 