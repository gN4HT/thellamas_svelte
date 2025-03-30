// apiFetch.js
export const apiFetch = async (
  url,
  { method = "GET", body = null, headers = {} } = {}
) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("auth");
    if (!token) {
      // Chưa đăng nhập -> chuyển trang
      window.location.href = "/web/login";
      // Dừng luôn hàm tại đây
      return;
    }

    // Cấu hình headers
    const defaultHeaders = {
      Accept: "application/json",
      Authorization: `Bearer ${token.replace(/['"]+/g, "")}`,
      ...headers,
    };

    // Nếu body không phải FormData thì set Content-Type
    if (!(body instanceof FormData)) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    // Đảm bảo URL đúng format
    const baseUrl = "http://127.0.0.1:8000";
    const apiUrl = url.startsWith("http")
      ? url
      : `${baseUrl}/api${url.startsWith("/") ? url : `/${url}`}`;

    // Cấu hình request
    const options = {
      method,
      headers: defaultHeaders,
      credentials: "include", // nếu cần gửi cookie, session
    };

    // Xử lý body
    if (body && method !== "GET") {
      if (body instanceof FormData) {
        options.body = body;
        // FormData thì xóa Content-Type để browser tự set boundary
        delete options.headers["Content-Type"];
      } else {
        options.body = typeof body === "string" ? body : JSON.stringify(body);
      }
    }

    console.log("API Request:", {
      url: apiUrl,
      method,
      headers: options.headers,
      body:
        body instanceof FormData ? Object.fromEntries(body.entries()) : body,
    });

    // Thực hiện fetch
    const response = await fetch(apiUrl, options);

    // Lấy kiểu content
    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    // Kiểm tra status code
    if (!response.ok) {
      switch (response.status) {
        case 401:
          localStorage.removeItem("auth");
          window.location.href = "/web/login";
          throw new Error("Phiên đăng nhập đã hết hạn");
        case 400:
          throw new Error(
            typeof data === "object" ? data.message : "Bad Request"
          );
        case 403:
          throw new Error("Không có quyền truy cập");
        case 404:
          throw new Error("Không tìm thấy tài nguyên");
        case 422:
          throw new Error(
            typeof data === "object" ? data.message : "Dữ liệu không hợp lệ"
          );
        default:
          throw new Error(
            typeof data === "object"
              ? data.message || JSON.stringify(data)
              : `Lỗi server: ${response.status}`
          );
      }
    }

    console.log("API Success:", {
      url: apiUrl,
      method,
      status: response.status,
      data,
    });

    return data;
  } catch (err) {
    // Xử lý lỗi mạng
    if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
      console.error("Lỗi kết nối: Vui lòng kiểm tra kết nối mạng");
      throw new Error("Lỗi kết nối: Vui lòng kiểm tra kết nối mạng");
    }

    console.error("API Error:", {
      url,
      method,
      body:
        body instanceof FormData ? Object.fromEntries(body.entries()) : body,
      error: err.message,
    });

    // Ném tiếp cho nơi gọi xử lý
    throw err;
  }
};
