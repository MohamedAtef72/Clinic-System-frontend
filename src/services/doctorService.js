import api from "../api/axios";

// Doctor Services
export const getAllDoctors = async (pageNumber, searchName = "", gender = "", speciality = "") => {
  try {
    const params = new URLSearchParams();

    params.append("pageNumber", pageNumber);
    if (searchName.trim()) params.append("searchName", searchName);
    if (gender.trim()) params.append("gender", gender);
    if (speciality) params.append("speciality", speciality);

    const response = await api.get(`/Doctor/AllDoctors?${params.toString()}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) { return [] };
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await api.get(`/Doctor/${id}`);
    return response.data;
  } catch (error) {
    if (error.response.status === 404) { return null; }
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};

export const setPrice = async (id, data) => {
  try {
    const res = await api.patch(`/Doctor/SetPrice/${id}`, data);
    return res.data;
  } catch (error) {
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};
