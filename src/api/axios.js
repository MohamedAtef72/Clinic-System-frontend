import axios from "axios";
import Cookies from "js-cookie"

// refresh token
const refreshToken = async () => {
  try {
    const accessToken = sessionStorage.getItem('token');
    const refreshToken = Cookies.get('refreshToken');

    const response = await axios.post('https://localhost:7206/api/Auth/Refresh', {
      accessToken,
      refreshToken
    });

    if (response.status === 200) {
      // Save new tokens in cookies
      sessionStorage.setItem('token', response.data.token);
      Cookies.set('refreshToken', response.data.refreshToken, { expires: 7 });
      return response.data.token;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
  }
};

// Intercepter To Auto Refresh With Custom Axios
const api = axios.create({
  baseURL: 'https://localhost:7206/api',
});

// // Adds a request interceptor that runs before every request is sent.
// api.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem('token');
//   if (token && !['/Auth/Login', '/Auth/Register'].includes(config.url)) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        sessionStorage.setItem('token', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry original request
      }
    }

    return Promise.reject(error);
  }
);

export default api;