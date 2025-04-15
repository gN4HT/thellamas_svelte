// Thêm BASE_URL làm hằng số
const BASE_URL = "http://127.0.0.1:8000/api";

export const apiFetch = async (
  endpoint,
  { method = "GET", body = null, headers = {} } = {}
) => {
  try {
    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    // Đảm bảo endpoint bắt đầu bằng dấu /
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    // Tạo URL đầy đủ bằng cách kết hợp BASE_URL và endpoint
    const fullUrl = `${BASE_URL}${normalizedEndpoint}`;

    // Set default headers including Content-Type for JSON
    const defaultHeaders = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    };

    const options = {
      method,
      headers: defaultHeaders,
    };

    if (body && method !== "GET") {
      options.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    console.log("API Request:", {
      url: fullUrl,
      method,
      headers: defaultHeaders,
      bodyType: body instanceof FormData ? "FormData" : typeof body,
    });

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || response.statusText);
    }

    // Check if there's content before trying to parse JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }

    // Return null for empty responses (like DELETE operations)
    return null;
  } catch (errors) {
    console.error("API Error:", errors.message);
    throw errors;
  }
};
