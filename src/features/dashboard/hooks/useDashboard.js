import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getRecentData } from "../../../services/adminService";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await getDashboardStats();
      return response?.data || response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecentData = () => {
  return useQuery({
    queryKey: ["dashboard", "recentData"],
    queryFn: async () => {
      const response = await getRecentData();
      return response?.data || response;
    },
    staleTime: 5 * 60 * 1000,
  });
};
