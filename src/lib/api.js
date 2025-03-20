export const apiFetch = async (
    url,
    {method = "GET", body = null, headers = {}} = {}
) => {
    try {
        const token = localStorage.getItem("access_token");

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        };

        if (token) {
            defaultHeaders["Authorization"] = `Bearer ${token}`;
        }

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

            return new Error(
                `HTTP ${response.status}: ${errorData?.message || response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error.message);
        return null;
    }
};
