import api from "../api/axios";

// Auth Services
export const login = async (data) => {
  try {
    const response = await api.post("/Auth/Login", data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};

export const logout = async (data) => {
  try {
    const response = await api.get("/Auth/Logout", data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};

export const doctorRegister = async (data) => {
  try {
    const response = await api.post("/Auth/DoctorRegister", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || "Registration failed",
      status: error.response?.status
    }
  }
};

export const patientRegister = async (data) => {
  try {
    const response = await api.post("/Auth/PatientRegister", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || "Registration failed",
      status: error.response?.status
    }
  }
};

export const receptionistRegister = async (data) => {
  try {
    const response = await api.post("/Auth/ReceptionRegister", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || "Registration failed",
      status: error.response?.status
    }
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/Auth/ForgotPassword", JSON.stringify(email), {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.post("/Auth/ResetPassword", data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};

export const getUploadSignature = async (folder = "clinic_app_images") => {
  try {
    const response = await api.get(`/Auth/GetUploadSignature?folder=${folder}`);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message,
      status: error.response?.status
    }
  }
};
