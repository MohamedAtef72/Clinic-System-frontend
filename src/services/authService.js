import api from "../api/axios";

export const login = async (data) => {
  const response = await api.post("/Auth/Login", data);
  return response.data;
};

export const logout = async (data) => {
  const response = await api.get("/Auth/Logout");
  return response.data;
};

export const currentUser = async () => {
  const response = await api.get("/Auth/Me");
  console.log(response.data);
  return response.data;
}

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

export const userProfile = async () => {
  try {
    const response = await api.get("/User/UserProfile");
    return response.data;
  } catch (error) {
    console.error("Error fetching User Data:", error);
    throw error;
  }
};

export const userUpdate = async (formData) => {
  try {
    const response = await api.put("/User/UpdateProfile", formData);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error updating User Data:", error);
    throw error;
  } 
};

export const getAllDoctors = async (pageNumber) => {
  try {
    const response = await api.get("/Doctor/AllDoctors?pageNumber=" + pageNumber);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await api.get(`/Doctor/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    return null;
  } 
};