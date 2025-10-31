import axios from "axios";

// Create custom Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, 
});

// Request interceptor (for debugging/logging)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handles refresh token logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for Login or Refresh endpoints themselves
    if (
      originalRequest?.url?.includes("/Auth/Login") ||
      originalRequest?.url?.includes("/Auth/Refresh")
    ) {
      return Promise.reject(error);
    }

    // Handle 401 (Unauthorized) and try silent refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh endpoint
        const refreshResponse = await api.post(
          "/Auth/Refresh",
          {},
          { withCredentials: true }
        );

        // Retry the original failed request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Silent refresh failed:", refreshError);
        console.error("Refresh error details:", {
          status: refreshError.response?.status,
          message: refreshError.response?.data?.message,
        });

        // Redirect to login page
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Return the error if not handled
    return Promise.reject(error);
  }
);

export default api;
