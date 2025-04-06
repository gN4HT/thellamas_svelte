<script lang="ts">
    import {createEventDispatcher, onDestroy} from 'svelte';
    import LoadingButton from './LoadingButton.svelte';

    export let email: string;
    export let isOpen = false;

    const dispatch = createEventDispatcher();

    // State management
    let isLoading = false;
    let otp = ['', '', '', ''];
    let errorMessage = '';
    let errorCount = 0;
    let canResend = true;
    let countdown = 60;
    let countdownInterval: ReturnType<typeof setInterval>;

    // Function to handle input change
    function handleInput(e: Event, index: number) {
        const input = e.target as HTMLInputElement;
        const value = input.value;
        
        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            input.value = '';
            return;
        }

        // Update OTP array
        otp[index] = value;

        // Move to next input if current input is filled
        if (value && index < 3) {
            const nextInput = input.nextElementSibling as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
            }
        }
    }

    // Function to handle backspace
    function handleKeyDown(e: KeyboardEvent, index: number) {
        const input = e.target as HTMLInputElement;
        
        if (e.key === 'Backspace' && !input.value && index > 0) {
            const prevInput = input.previousElementSibling as HTMLInputElement;
            if (prevInput) {
                prevInput.focus();
            }
        }
    }

    // Function to start countdown
    function startCountdown() {
        canResend = false;
        countdown = 60;
        countdownInterval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                canResend = true;
            }
        }, 1000);
    }

    // Function to resend OTP
    async function resendOTP() {
        if (!canResend) return;
        
        // Lock button immediately
        canResend = false;
        countdown = 60;

        try {
            const formData = new FormData();
            formData.append('email', email);

            const response = await fetch("http://127.0.0.1:8000/api/resend-otp", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const data = await response.json();
                errorMessage = data.message || 'Gửi lại mã thất bại';
                // Reset if failed
                canResend = true;
                countdown = 0;
                return;
            }

            // Start countdown after successful API call
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            
            countdownInterval = setInterval(() => {
                countdown--;
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    canResend = true;
                }
            }, 1000);
            
            // Show success message
            errorMessage = 'Mã OTP mới đã được gửi đến email của bạn';
            setTimeout(() => {
                if (errorMessage === 'Mã OTP mới đã được gửi đến email của bạn') {
                    errorMessage = '';
                }
            }, 3000);
        } catch (error) {
            console.error('Resend error:', error);
            errorMessage = 'Không thể kết nối đến server';
            // Reset if failed
            canResend = true;
            countdown = 0;
        }
    }

    // Function to verify OTP
    async function verifyOTP(e: Event) {
        e.preventDefault();
        
        const otpString = otp.join('');
        if (!otpString) {
            errorMessage = 'Vui lòng nhập mã OTP';
            return;
        }

        // Validate OTP format
        if (!/^\d{4}$/.test(otpString)) {
            errorMessage = 'Mã OTP phải là 4 chữ số';
            return;
        }

        isLoading = true;
        errorMessage = '';

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('otp', otpString);

            const response = await fetch("http://127.0.0.1:8000/api/verify-otp", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                errorMessage = data.message || 'Xác thực thất bại';
                // Only increment error count for OTP validation errors
                if (data.message?.includes('OTP') || data.message?.includes('mã xác thực')) {
                    errorCount++;
                    
                    // Close popup if too many errors
                    if (errorCount >= 5) {
                        dispatch('close');
                        return;
                    }
                }
                return;
            }

            // Save access token to localStorage
            localStorage.setItem("token", data.access_token);
            
            // Emit success event
            dispatch('success');
        } catch (error) {
            console.error('Verify error:', error);
            errorMessage = 'Không thể kết nối đến server';
        } finally {
            isLoading = false;
        }
    }

    // Close popup when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains('popup-overlay')) {
            dispatch('close');
        }
    }

    // Cleanup interval on component destroy
    onDestroy(() => {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    });
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center popup-overlay" on:click={handleClickOutside}>
    <div class="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button 
            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            on:click={() => dispatch('close')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <h1 class="text-2xl font-bold mb-6 text-center">Xác thực tài khoản</h1>
        
        <div class="mb-6 text-center">
            <p class="text-gray-600">Mã OTP đã được gửi đến email:</p>
            <p class="font-semibold text-[#00205b]">{email}</p>
        </div>

        <form on:submit={verifyOTP} class="space-y-4">
            <div>
                <label for="otp" class="block text-lg font-medium text-gray-700 mb-3 text-center">Mã OTP</label>
                <div class="flex gap-2 justify-center">
                    {#each otp as _, i}
                        <input
                            type="text"
                            bind:value={otp[i]}
                            on:input={(e) => handleInput(e, i)}
                            on:keydown={(e) => handleKeyDown(e, i)}
                            class="w-18 h-18 text-center text-xl border border-gray-300 rounded focus:ring-2 focus:ring-[#00205b] focus:border-transparent"
                            maxlength="1"
                            pattern="\d"
                            inputmode="numeric"
                        />
                    {/each}
                </div>
            </div>

            {#if errorMessage}
                <div class="text-red-500 text-sm text-center">
                    {errorMessage}
                    {#if errorCount > 0}
                        <div class="mt-1">Số lần nhập sai còn lại: {5 - errorCount}</div>
                    {/if}
                </div>
            {/if}

            <LoadingButton 
                type="submit"
                loading={isLoading}
                size="lg"
            >
                {isLoading ? 'Đang xác thực...' : 'Xác thực'}
            </LoadingButton>
        </form>

        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
                Không nhận được mã? 
                <button 
                    on:click={resendOTP} 
                    disabled={!canResend}
                    class="font-bold text-[#00205b] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {canResend ? 'Gửi lại mã' : `Gửi lại sau ${countdown}s`}
                </button>
            </p>
        </div>
    </div>
</div> 