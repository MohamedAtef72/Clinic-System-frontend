// api.js - Fixed configuration
import axios from "axios";

// Custom Axios instance
const api = axios.create({
  baseURL: "https://localhost:7206/api",
  withCredentials: true,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor with refresh retry logic
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("=== Response Error ===");
    console.log("Status:", error.response?.status);
    console.log("Error message:", error.response?.data?.message || error.message);
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("401 detected, trying silent refresh...");
      
      try {
        // Make refresh request
        const refreshResponse = await axios.post(
          "https://localhost:7206/api/Auth/Refresh", 
          {}, // Empty body
          {
            withCredentials: true,
            // headers: {
            //   'Content-Type': 'application/json',
            //   'Accept': 'application/json'
            // }
          }
        );
        
        console.log("Refresh successful:", refreshResponse.data);
        
        // Retry the original request
        return api(originalRequest); 
      } catch (refreshError) {
        console.error("Silent refresh failed:", refreshError);
        console.error("Refresh error details:", {
          status: refreshError.response?.status,
          message: refreshError.response?.data?.message,
          headers: refreshError.response?.headers
        });
        
        // Clear any remaining auth state
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        // Redirect to login
        window.location.href = "/login"; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;