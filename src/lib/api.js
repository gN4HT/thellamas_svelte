import {error} from "@sveltejs/kit";

export const apiFetch = async (url, {method = "GET", body = null, headers = {}} = {}) => {
    try {
        const defaultHeaders = {
            "Content-Type": "application/json", ...headers,
        };

        const options = {
            method, headers: defaultHeaders, credentials: "include", // Ensure cookies are sent with the request
        };

        if (body && method !== "GET") {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            error(response.status`${errorData?.message || response.statusText}`);
        }

        return await response.json();
    } catch (errors) {
        error(errors.message);
    }
};

