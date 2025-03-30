export const apiFetch = async (url, {method = "GET", body = null, headers = {}} = {}) => {
    try {
        // Retrieve token from localStorage
        const token = localStorage.getItem("token");

        // Set default headers and include Authorization if token exists
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
            ...headers,
        };

        const options = {
            method,
            headers: defaultHeaders,
        };

        if (body && method !== "GET") {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            console.error(errorData?.message || response.statusText);
        }

        return await response.json();
    } catch (errors) {
        console.error(errors.message);
    }
};
