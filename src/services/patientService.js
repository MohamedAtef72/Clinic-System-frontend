import api from "../api/axios";

// Patient Services
export const getPatientById = async (id, pageNumber) => {
  try {
    const response = await api.get(`/Patient/${id}?pageNumber=` + pageNumber);
    return response.data;
  } catch (error) {
    if (error.response?.status == 404) { return null };
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};

export const getAllPatients = async (pageNumber, searchName = "", gender = "") => {
  try {
    const params = new URLSearchParams();

    params.append("pageNumber", pageNumber);
    if (searchName.trim()) params.append("searchName", searchName);
    if (gender.trim()) params.append("gender", gender);

    const res = await api.get(`/Patient/GetAll?${params.toString()}`);
    return res.data;
  }
  catch (error) {
    if (error.response?.status == 404) { return [] };
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
}
