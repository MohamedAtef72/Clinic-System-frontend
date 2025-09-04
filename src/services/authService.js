import api from "../api/axios";

export const login = async (data) => {
  const response = await api.post("/Auth/Login", data);
  return response.data;
};

export const doctorRegister = async (data) => {
  const response = await api.post("/Auth/DoctorRegister", data);
  return response.data;
};

export const patientRegister = async (data) => {
  const response = await api.post("/Auth/PatientRegister", data);
  return response.data;
};

export const receptionistRegister = async (data) => {
  const response = await api.post("/Auth/ReceptionRegister", data);
  return response.data;
};

export const getAllSpecialities = async () => {
  try {
    const response = await api.get("/Speciality/AllSpecialities");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching specialities:", error);
    return [];
  }
};
