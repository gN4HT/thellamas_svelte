export const apiFetch = async (
  url,
  { method = "GET", body = null, headers = {} } = {}
) => {
  try {
    // Lấy token từ localStorage
    const authData = localStorage.getItem("auth");
    let token = null;

    if (authData) {
      const auth = JSON.parse(authData);
      token = auth.access_token;
    }

    // Cấu hình headers
    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    };

    // Thêm Authorization header nếu có token
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Đảm bảo URL đúng format
    const baseUrl = "http://127.0.0.1:8000";
    const apiUrl = url.startsWith("http")
      ? url
      : `${baseUrl}/api${url.startsWith("/") ? url : `/${url}`}`;

    // Cấu hình request options
    const options = {
      method,
      headers: defaultHeaders,
      credentials: "include", // Quan trọng cho CORS
    };

    // Xử lý body request
    if (body && method !== "GET") {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    // Thực hiện request
    const response = await fetch(apiUrl, options);

    // Kiểm tra authentication
    if (response.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/web/login";
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    // Xử lý response theo content type
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Kiểm tra response status
    if (!response.ok) {
      throw new Error(
        typeof data === "object"
          ? data.message
          : `HTTP Error: ${response.status}`
      );
    }

    // Log success response để debug
    console.log("API Response:", {
      url: apiUrl,
      method,
      status: response.status,
      data,
    });

    return data;
  } catch (error) {
    // Xử lý network errors
    if (
      error.name === "TypeError" &&
      error.message.includes("Failed to fetch")
    ) {
      console.error("Lỗi kết nối: Vui lòng kiểm tra kết nối mạng");
      throw new Error("Lỗi kết nối: Vui lòng kiểm tra kết nối mạng");
    }

    // Log error để debug
    console.error("API Error:", {
      url,
      method,
      body,
      error: error.message,
    });

    throw error;
  }
};
