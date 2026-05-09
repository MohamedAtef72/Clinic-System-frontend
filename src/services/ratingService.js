import api from "../api/axios";

// Rate Services
export const rateDoctor = async (ratingData) => {
  try {
    const response = await api.post(`/Rating/Create`, ratingData);
    return response.data;
  } catch (error) {
    if (error.response?.status == 404) { return null };
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};

export const updateDoctorRate = async (id, ratingData) => {
  try {
    const response = await api.put(`/Rating/Update/${id}`, ratingData);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};

export const getRateByAppointmentId = async (id) => {
  try {
    const response = await api.get(`/Rating/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status == 404) { return null };
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};

export const getRatingByDoctorId = async (doctorId) => {
  try {
    const response = await api.get(`/Rating/Doctor/${doctorId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status == 404) { return null };
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};
