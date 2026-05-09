import api from "../api/axios";

// User Services
export const currentUser = async () => {
  try {
    const response = await api.get("/Auth/Me");
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};

export const userProfile = async () => {
  try {
    const response = await api.get("/User/UserProfile", {
      params: { t: new Date().getTime() }
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};

export const userUpdate = async (data) => {
  try {
    const response = await api.put("/User/UpdateProfile", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || "Update failed",
      status: error.response?.status
    }
  }
};

export const deleteProfile = async (userId) => {
  try {
    const response = await api.delete(`/User/DeleteProfile/${userId}`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};
