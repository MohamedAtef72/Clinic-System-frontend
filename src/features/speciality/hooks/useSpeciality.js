import { useQuery } from "@tanstack/react-query";
import { getAllSpecialities } from "../../../services/specialityService";

export const useAllSpecialities = () => {
  return useQuery({
    queryKey: ["specialities", "all"],
    queryFn: async () => {
      const response = await getAllSpecialities();
      return response || [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour (rarely changes)
  });
};
