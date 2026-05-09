import api from "../api/axios";

// Availability Services
export const addAvailability = async (data) => {
  try {
    const res = await api.post("/DoctorAvailability/Add", data);
    return res.data;
  } catch (error) {
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};

export const updateAvailability = async (id, data) => {
  try {
    const res = await api.put(`/DoctorAvailability/Update/${id}`, data);
    return res.data;
  } catch (error) {
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};

export const deleteAvailability = async (id) => {
  try {
    const res = await api.delete(`/DoctorAvailability/Delete/${id}`);
    return res.data;
  } catch (error) {
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};

export const getDoctorAvailabilities = async (doctorId) => {
  try {
    const res = await api.get(`/DoctorAvailability/doctor/${doctorId}`);
    return res.data;
  } catch (error) {
    if (error.response.status === 404) { return []; }
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};

export const getDoctorAvailabilityById = async (id) => {
  try {
    const response = await api.get(`/DoctorAvailability/${id}`);
    return response.data;
  } catch (error) {
    if (error.response.status === 404) { return null; }
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};
