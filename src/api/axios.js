import axios from "axios";
import Cookies from "js-cookie";

// Refresh token function with better error handling
const refreshToken = async () => {
  try {
    const accessToken = sessionStorage.getItem("token");
    const refreshToken = Cookies.get("refreshToken");

    if (!accessToken || !refreshToken) {
      console.log("No tokens found, redirecting to login");
      // Redirect to login or handle no tokens
      window.location.href = "/login";
      return null;
    }

    console.log("Attempting token refresh...");
    
    const response = await axios.post("https://localhost:7206/api/Auth/Refresh", {
      accessToken,
      refreshToken,
    });

    if (response.status === 200 && response.data) {
      // Handle both possible response formats
      const newAccessToken = response.data.accessToken || response.data.token;
      const newRefreshToken = response.data.refreshToken;

      if (newAccessToken && newRefreshToken) {
        sessionStorage.setItem("token", newAccessToken);
        Cookies.set("refreshToken", newRefreshToken, { expires: 7 });
        console.log("Tokens refreshed successfully");
        return newAccessToken;
      } else {
        throw new Error("Invalid response format from refresh endpoint");
      }
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      console.error("Bad request - possibly invalid tokens");
    } else if (error.response?.status === 401) {
      console.error("Unauthorized - refresh token expired");
    }
    
    // Clear invalid tokens and redirect to login
    sessionStorage.removeItem("token");
    Cookies.remove("refreshToken");
    window.location.href = "/login";
    return null;
  }
};

// Custom Axios instance
const api = axios.create({
  baseURL: "https://localhost:7206/api",
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Improved response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("401 error detected, attempting token refresh...");
      
      const newAccessToken = await refreshToken();
      
      if (newAccessToken) {
        // Update the authorization header for the retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("Retrying original request with new token");
        return api(originalRequest);
      }
      
      // If refresh failed, the user will be redirected to login
      // by the refreshToken function, so we can just reject here
      return Promise.reject(new Error("Authentication failed"));
    }

    return Promise.reject(error);
  }
);

export default api;