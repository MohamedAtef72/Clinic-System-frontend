import { useQuery } from "@tanstack/react-query";
import { getAllPatients, getPatientById } from "../../../services/patientService";

export const usePatientsList = (pageNumber = 1, searchName = "", gender = "") => {
  return useQuery({
    queryKey: ["patients", "list", pageNumber, searchName, gender],
    queryFn: async () => {
      const response = await getAllPatients(pageNumber, searchName, gender);
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePatientProfile = (id, pageNumber = 1) => {
  return useQuery({
    queryKey: ["patients", "profile", id, pageNumber],
    queryFn: async () => {
      if (!id) return null;
      const response = await getPatientById(id, pageNumber);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
