export const apiFetch = async (
  url,
  { method = "GET", body = null, headers = {} } = {}
) => {
  try {
    const authData = localStorage.getItem("auth");
    let token = null;

    if (authData) {
      const auth = JSON.parse(authData);
      token = auth.access_token;
    }

    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    };

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Đảm bảo URL đúng format
    const baseUrl = "http://127.0.0.1:8000";
    const apiUrl = url.startsWith("http")
      ? url
      : `${baseUrl}/api${url.startsWith("/") ? url : `/${url}`}`;

    const options = {
      method,
      headers: defaultHeaders,
      credentials: "include", // Quan trọng cho CORS
    };

    if (body && method !== "GET") {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const response = await fetch(apiUrl, options);

    // Kiểm tra response status
    if (response.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    // Xử lý response
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        typeof data === "object"
          ? data.message
          : `HTTP Error: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    if (
      error.name === "TypeError" &&
      error.message.includes("Failed to fetch")
    ) {
      console.error("Lỗi kết nối: Vui lòng kiểm tra kết nối mạng");
      throw new Error("Lỗi kết nối: Vui lòng kiểm tra kết nối mạng");
    }

    console.error("API Error:", error);
    throw error;
  }
};
