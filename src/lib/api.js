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

    // Chỉ set Authorization header
    const defaultHeaders = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

    return await response.json();
  } catch (errors) {
    console.error("API Error:", errors.message);
    throw errors;
  }
};
