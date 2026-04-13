// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080", // Backend Spring Boot URL
//   // headers: { "Content-Type": "application/json" },
//   withCredentials: true, // MANDATORY: This tells axios to send/receive cookies
// });

// // // Interceptor to add Access Token to every request
// // api.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("accessToken");
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // // Interceptor to handle 401 (Expired Token)
// // // Response Interceptor: Handle 403/401 errors
// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;
// //     // If error is 401 or 403 and haven't tried refreshing yet
// //     if (
// //       error.response &&
// //       (error.response.status === 401 || error.response.status === 403) &&
// //       !originalRequest._retry
// //     ) {
// //       originalRequest._retry = true;
// //       const refreshToken = localStorage.getItem("refreshToken");

// //       if (refreshToken) {
// //         try {
// //           // Call the refresh endpoint
// //           const res = await axios.post("http://localhost:8080/auth/refresh", {
// //             refreshToken,
// //           });

// //           // Save the new access token
// //           const newAccessToken = res.data.accessToken;
// //           localStorage.setItem("accessToken", newAccessToken);
// //           // Update the header and retry the original request
// //           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
// //           return api(originalRequest); // Retry the original request
// //         } catch (err) {
// //           console.log(err);
// //           localStorage.clear();
// //           window.location.href = "/login";
// //         }
// //       }
// //     }
// //     return Promise.reject(error);
// //   },
// // );

// export default api;

import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080",
//   // Optional Does not require in modern Axios
//   // headers: { "Content-Type": "application/json" },
//   withCredentials: true, // MANDATORY: This allows cookies to be sent/received
// });

const api = axios.create({
  baseURL: "http://172.20.1.225:8080", // Use the server's IP
  //   // Optional Does not require in modern Axios
  //   // headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Response Interceptor: Handle Token Refresh automatically
api.interceptors.response.use(
  (response) => response, // If request is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 or 403, it means the Access Token Cookie is likely expired
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        /* IMPORTANT: We don't need to pass a 'refreshToken' string here anymore.
          The browser will automatically attach the 'refreshToken' cookie 
          to this POST request because withCredentials is true.
        */
        await axios.post(
          // "http://localhost:8080/auth/refresh",
          "http://172.20.1.225:8080/auth/refresh",
          {},
          { withCredentials: true },
        );

        // If the refresh call succeeds, the backend sent a new 'accessToken' cookie.
        // Now we retry the original request.
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token cookie is also expired or invalid:
        console.error("Session expired. Logging out...");
        localStorage.clear(); // Clear any UI-only items like 'username'
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
