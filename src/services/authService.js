import api from "../api/axios";

// Auth Services
export const login = async (data) => {
  try {
    const response = await api.post("/Auth/Login", data);
    return response.data;
  } catch (error) {
          throw error;
    }
};

export const logout = async (data) => {
  try {
    const response = await api.get("/Auth/Logout", data);
    return response.data;
  } catch (error) {
      throw error;
}
};

export const doctorRegister = async (data) => {
  try {
    const response = await api.post("/Auth/DoctorRegister", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patientRegister = async (data) => {
  try {
    const response = await api.post("/Auth/PatientRegister", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const receptionistRegister = async (data) => {
  try {
    const response = await api.post("/Auth/ReceptionRegister", data);
    return response.data;
  } catch (error) {
    console.error("Error In Receptionist Registration:", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/Auth/ForgotPassword", JSON.stringify(email), {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error In Forgot Password:", error);
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.post("/Auth/ResetPassword", data);
    return response.data;
  } catch (error) {
    console.error("Error In Reset Password:", error);
    throw error;
  }
};
/////////////////////////////////////////////////////////////////////////////////

// User Services
export const currentUser = async () => {
  try {
  const response = await api.get("/Auth/Me");
  return response.data;
  } catch (error) {
    if (error.response) {
      return { success: false, message: error.response.data.message };
    }
      console.error("Error In Fetching Current User:", error);
      throw error;
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
/////////////////////////////////////////////////////////////////////////////////

// Speciality Services
export const getAllSpecialities = async () => {
  try {
    const response = await api.get("/Speciality/AllSpecialities");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching specialities:", error);
    return [];
  }
};
/////////////////////////////////////////////////////////////////////////////////

// Doctor Services
export const getAllDoctors = async (pageNumber, searchName = "") => {
  try {
    const params = new URLSearchParams();

    params.append("pageNumber", pageNumber);
    if (searchName.trim()) params.append("searchName", searchName);

    const response = await api.get(`/Doctor/AllDoctors?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await api.get(`/Doctor/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    return null;
  } 
};

export const setPrice = async (id, data) => {
  try {
    const res = await api.patch(`/Doctor/SetPrice/${id}`,data);
    return res.data;
  } catch (error) {
    console.error("Error setting price:", error);
    throw error;  
  }
};
/////////////////////////////////////////////////////////////////////////////////

// Availability Services
export const addAvailability = async (data) => {
  try {
    const res = await api.post("/DoctorAvailability/Add", data);
    return res.data;
  } catch (error) {
    console.error("Error adding availability:", error);
    throw error;
  }
};

export const updateAvailability = async (id, data) => {
  try {
    const res = await api.put(`/DoctorAvailability/Update/${id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAvailability = async (id) => {
  try {
  const res = await api.delete(`/DoctorAvailability/Delete/${id}`);
  return res.data;
  } catch (error) {
    throw error;
  }
};

export const getDoctorAvailabilities = async (doctorId) => {
  try{
    const res = await api.get(`/DoctorAvailability/doctor/${doctorId}`);
    return res.data;
  } catch (error) {
    return { data: [] };
  }
};

export const getDoctorAvailabilityById = async (id) => {
  try {
    const response = await api.get(`/DoctorAvailability/${id}`);
    return response.data.data;
  } catch (error) {
    return null;
  }
};
/////////////////////////////////////////////////////////////////////////////////

// Appointment Services
export const createAppointment = async (data) => {
  try {
    const res = await api.post("/Appointment/Create", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllApointments = async ( status="", pageNumber) => {
  try {
    const params = new URLSearchParams();

    params.append("pageNumber", pageNumber);
    if (status.trim()) params.append("status", status);

    const response = await api.get(`/Appointment/GetAll?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPatientAppointments = async (status="",patientId,pageNumber) => {
  try {
    const params = new URLSearchParams();
    params.append("pageNumber", pageNumber);
    if (status.trim()) params.append("status", status);

    const response = await api.get(`/Appointment/Patient/${patientId}?${params.toString()}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getDoctorAppointments = async (status= "",doctorId , pageNumber , startTime , endTime) => {
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
    return [];
  }
}

export const updateAppointment = async (id, data) => {
  try {
    const res = await api.put(`/Appointment/Update/${id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
////////////////////////////////////////////////////////////////////////////////

// Patient Services
export const getPatientById = async (id,pageNumber) => {
  try {
    const response = await api.get(`/Patient/${id}?pageNumber=` + pageNumber);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getAllPatients = async(pageNumber, searchName="") => {
  try
  {
      const params = new URLSearchParams();
      
      params.append("pageNumber",pageNumber);
      if (searchName.trim()) params.append("searchName",searchName);

      const res = await api.get(`/Patient/GetAll?${params.toString()}`);
      return res.data;
  }
  catch(error)
  {
    throw error;
  }
}
/////////////////////////////////////////////////////////////////////////////////

// Visit Services
export const getVisitById = async (id) => {
  try {
    const res = await api.get(`/Visit/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching visit by ID:", error);
    return null;
  }
};

export const createVisit = async (data) => {
  try {
    const res = await api.post("/Visit/Create", data);
    return res.data;
  } catch (error) {
    console.error("Error creating visit:", error);
    throw error;
  }
};

export const updateVisit = async (id, data) => {
  try {
    const res = await api.put(`/Visit/Update/${id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
/////////////////////////////////////////////////////////////////////////////////

// Rate Services
export const rateDoctor = async ( ratingData) => {
  try {
    const response = await api.post(`/Rating/Create`, ratingData);
    return response.data;
  } catch (error) {
    console.error("Error rating doctor:", error);
    throw error;
  } 
};

export const updateDoctorRate = async (id, ratingData) => {
  try {
    const response = await api.put(`/Rating/Update/${id}`, ratingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRateByAppointmentId = async (id) => {
  try {
    const response = await api.get(`/Rating/${id}`);  
    return response.data;
  } catch (error) {
    console.error("Error fetching rating by ID:", error);
    return null;
  }
};

export const getRatingByDoctorId = async (doctorId) => {
  try {
    const response = await api.get(`/Rating/Doctor/${doctorId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};
/////////////////////////////////////////////////////////////////////////////////

// Admin Services
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/Admin/Dashboard");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecentData = async () => {
  try {
    const response = await api.get("/Admin/RecentData");
    return response.data;
  } catch (error) {
    throw error;
  }
};
/////////////////////////////////////////////////////////////////////////////////
