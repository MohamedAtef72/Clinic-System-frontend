import api from "../api/axios";

// Speciality Services
export const getAllSpecialities = async () => {
  try {
    const response = await api.get("/Speciality/AllSpecialities");
    return response.data.data;
  } catch (error) {
    if (error.response.status == 404) {
      return [];
    } else {
      throw {
        message: error.response?.data?.message,
        status: error.response?.status
      }
    }
  }
};

export const addSpeciality = async (data) => {
  try {
    const response = await api.post("/Speciality", data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};
