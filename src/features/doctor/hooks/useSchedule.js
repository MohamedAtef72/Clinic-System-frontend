import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDoctorAvailabilities, addAvailability, updateAvailability, deleteAvailability } from "../../../services/availabilityService";

export const useDoctorSchedule = (doctorId) => {
  return useQuery({
    queryKey: ["schedule", doctorId],
    queryFn: async () => {
      if (!doctorId) return [];
      const res = await getDoctorAvailabilities(doctorId);
      return res?.Data || res?.data || [];
    },
    enabled: !!doctorId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAddSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => addAvailability(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["schedule", variables.doctorId]);
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAvailability(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["schedule"]);
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["schedule"]);
    },
  });
};
