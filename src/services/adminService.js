import api from "../api/axios";

// Admin Services
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/Admin/Dashboard");
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};

export const getRecentData = async () => {
  try {
    const response = await api.get("/Admin/RecentData");
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};
