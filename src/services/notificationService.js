import api from "../api/axios";

export const getUserNotifications = async (pageNumber) => {
    try {
        const response = await api.get(`/Notification/User?pageNumber=${pageNumber}`);
        return response.data;
    } catch (error) {
        if (error.response.status == 404) { return []; }
        throw {
            message: error.response?.data?.message,
            status: error.response?.status
        }
    }
};

export const markAsRead = async (notificationId) => {
    try {
        const response = await api.post(`/Notification/MarkAsRead/${notificationId}`);
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.message,
            status: error.response?.status
        }
    }
};

export const markAllAsRead = async () => {
    try {
        const response = await api.post("/Notification/MarkAllAsRead");
        return response.data;
    } catch (error) {
        throw {
            message: error.response?.data?.message,
            status: error.response?.status
        }
    }
};
