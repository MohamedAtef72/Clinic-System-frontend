import api from "../api/axios";

// Appointment Services
export const createAppointment = async (data) => {
  try {
    const res = await api.post("/Appointment/Create", data);
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) { return [] };
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};

export const getAllAppointments = async (status = "", pageNumber) => {
  try {
    const params = new URLSearchParams();

    params.append("pageNumber", pageNumber);
    if (status.trim()) params.append("status", status);

    const response = await api.get(`/Appointment/GetAll?${params.toString()}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) { return [] };
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};

export const getPatientAppointments = async (status = "", patientId, pageNumber) => {
  try {
    const params = new URLSearchParams();
    params.append("pageNumber", pageNumber);
    if (status.trim()) params.append("status", status);

    const response = await api.get(`/Appointment/Patient/${patientId}?${params.toString()}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) { return [] };
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};

export const getDoctorAppointments = async (status = "", doctorId, pageNumber, startTime, endTime) => {
  try {
    const params = new URLSearchParams();
    params.append("pageNumber", pageNumber);
    if (status.trim()) params.append("status", status);
    if (startTime) params.append("startTime", startTime);
    if (endTime) params.append("endTime", endTime);
    const response = await api.get(`/Appointment/Doctor/${doctorId}?${params.toString()}`);
    return response.data;
  }
  catch (error) {
    if (error.response?.status === 404) { return [] };
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
}

export const updateAppointment = async (id, data) => {
  try {
    const res = await api.put(`/Appointment/Update/${id}`, data);
    return res.data;
  } catch (error) {
    throw Object.assign(new Error(), {
      message: error.response?.data?.message,
      status: error.response?.status
    });
  }
};
