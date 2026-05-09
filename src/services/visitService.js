import api from "../api/axios";

// Visit Services
export const getVisitById = async (id) => {
  try {
    const res = await api.get(`/Visit/${id}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) { return null };
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};

export const createVisit = async (data) => {
  try {
    const res = await api.post("/Visit/Create", data);
    return res.data;
  } catch (error) {
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};

export const updateVisit = async (id, data) => {
  try {
    const res = await api.put(`/Visit/Update/${id}`, data);
    return res.data;
  } catch (error) {
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};
