<script>
    import { onMount } from 'svelte';
    
    let loading = true;
    
    onMount(() => {
        // Simulate loading time (you can remove this and use your actual loading logic)
        setTimeout(() => {
            loading = false;
        }, 2000);
    });
</script>

<svelte:head>
    <style>
        .loading-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease-out;
        }

        .loading-container.hidden {
            opacity: 0;
            pointer-events: none;
        }

        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #00205B;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-text {
            margin-top: 20px;
            font-family: Arial, sans-serif;
            color: #333;
            font-size: 18px;
            animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
    </style>
</svelte:head>

<div class="loading-container" class:hidden={!loading}>
    <div class="loading-content">
        <div class="loading-spinner"></div>
    </div>
</div>
