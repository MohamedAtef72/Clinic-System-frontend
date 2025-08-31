import api from "../api/axios";

export const login = async (data) => {
  const response = await api.post("/Auth/Login", data);
  return response.data;
};