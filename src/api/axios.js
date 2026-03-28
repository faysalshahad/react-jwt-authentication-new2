import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Backend Spring Boot URL
  headers: { "Content-Type": "application/json" },
});

// Interceptor to add Access Token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401 (Expired Token)
// Response Interceptor: Handle 403/401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error is 401 or 403 and haven't tried refreshing yet
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Call the refresh endpoint
          const res = await axios.post("http://localhost:8080/auth/refresh", {
            refreshToken,
          });

          // Save the new access token
          const newAccessToken = res.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          // Update the header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Retry the original request
        } catch (err) {
          console.log(err);
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
