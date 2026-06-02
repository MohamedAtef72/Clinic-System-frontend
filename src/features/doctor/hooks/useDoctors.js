import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllDoctors, getDoctorById } from "../../../services/doctorService";
import { getRatingByDoctorId, rateDoctor, updateDoctorRate } from "../../../services/ratingService";

export const useDoctorsList = (pageNumber = 1, searchName = "", gender = "", speciality = "") => {
  return useQuery({
    queryKey: ["doctors", "list", pageNumber, searchName, gender, speciality],
    queryFn: async () => {
      const response = await getAllDoctors(pageNumber, searchName, gender, speciality);
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useDoctorProfile = (id) => {
  return useQuery({
    queryKey: ["doctors", "profile", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await getDoctorById(id);
      return response;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useDoctorRating = (id) => {
  return useQuery({
    queryKey: ["doctors", "rating", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await getRatingByDoctorId(id);
      return response;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useRateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ratingData) => rateDoctor(ratingData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctors", "rating", variables.doctorId] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });
};

export const useUpdateRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ratingData }) => updateDoctorRate(id, ratingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors", "rating"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });
};
