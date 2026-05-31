import { useQuery } from "@tanstack/react-query";
import { getUserNotifications } from "../../../services/notificationService";

export const useNotificationsList = (pageNumber = 1) => {
  return useQuery({
    queryKey: ["notifications", "list", pageNumber],
    queryFn: async () => {
      const response = await getUserNotifications(pageNumber);
      return response;
    },
    staleTime: 60 * 1000,
  });
};
