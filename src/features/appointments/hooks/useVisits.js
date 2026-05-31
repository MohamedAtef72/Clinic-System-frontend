import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVisitById, updateVisit, createVisit } from "../../../services/visitService";

export const useVisitDetails = (visitId, isEnabled = true) => {
  return useQuery({
    queryKey: ["visit", visitId],
    queryFn: async () => {
      if (!visitId) return null;
      const res = await getVisitById(visitId);
      return res?.data || null;
    },
    enabled: !!visitId && isEnabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateVisit(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["visit", variables.id]);
    },
  });
};

export const useCreateVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createVisit(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
    },
  });
};
