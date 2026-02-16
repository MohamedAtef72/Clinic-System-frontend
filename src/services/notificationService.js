import api from "../api/axios";

export const getUserNotifications = async (pageNumber = 1, pageSize = 6) => {
    try {
        const response = await api.get(`/Notification/User?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user notifications:", error);
        throw error;
    }
};

export const markAsRead = async (notificationId) => {
    try {
        const response = await api.post(`/Notification/MarkAsRead/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

export const markAllAsRead = async () => {
    try {
        const response = await api.post("/Notification/MarkAllAsRead");
        return response.data;
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
};
