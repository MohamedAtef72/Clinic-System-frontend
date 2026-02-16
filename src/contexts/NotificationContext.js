import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import toast from 'react-hot-toast';
import {
    getUserNotifications,
    markAllAsRead as markAllAsReadService,
    markAsRead as markAsReadService
} from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const showNotificationToast = useCallback((data) => {
        const { title, message, type } = data;

        const toastConfig = {
            position: 'top-right',
            duration: 6000,
        };

        switch (type) {
            case 'AppointmentCancelled':
                toast.error(`${title}: ${message}`, toastConfig);
                break;
            case 'PatientCheckedIn':
            case 'AppointmentBooked':
                toast.success(`${title}: ${message}`, { ...toastConfig, icon: '📅' });
                break;
            case 'DoctorAdded':
                toast(`${title}: ${message}`, { ...toastConfig, icon: '👨‍⚕️' });
                break;
            default:
                toast(`${title}: ${message}`, toastConfig);
        }
    }, []);

    // Fetch notifications with pagination
    const fetchNotifications = useCallback(async (pageNum = 1) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await getUserNotifications(pageNum, 6); // 6 is the page size from backend

            // The backend returns { Message, PageNumber, PageSize, Data }
            // Handle both PascalCase and camelCase
            // The backend returns { Message, PageNumber, PageSize, Data }
            // Handle both PascalCase and camelCase
            const newNotifications = response.Data || response.data || [];

            // Normalize
            const normalize = (n) => ({
                id: n.id || n.Id,
                title: n.title || n.Title,
                message: n.message || n.Message,
                isRead: n.isRead !== undefined ? n.isRead : n.IsRead,
                createdAt: n.createdAt || n.CreatedAt,
                type: n.type || n.Type
            });

            const normalizedNotifications = newNotifications.map(normalize);

            setNotifications(prev => {
                // If page 1, replace. Else append.
                if (pageNum === 1) return normalizedNotifications;

                // Filter out duplicates just in case
                const existingIds = new Set(prev.map(n => n.id));
                const uniqueNew = normalizedNotifications.filter(n => !existingIds.has(n.id));
                return [...prev, ...uniqueNew];
            });

            // If we got fewer items than requested, we are done
            if (newNotifications.length < 6) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            // Update unread count based on valid latest data
            // Note: This only counts unread in *loaded* notifications. 
            // Ideally backend should return total unread count separately.
            // For now, we update based on what we have.
            // Update unread count based on valid latest data
            // Removed redundant setUnreadCount here as useEffect handles it

        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Update unread count whenever notifications change
    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.isRead).length);
    }, [notifications]);

    // Initial load
    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications(1);
        }
    }, [isAuthenticated, fetchNotifications]);

    const loadMoreNotifications = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchNotifications(nextPage);
        }
    }, [loading, hasMore, page, fetchNotifications]);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_URL}/clinicHub`, {
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets,
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to SignalR!');

                    connection.on('ReceiveNotification', (data) => {
                        const newNotification = {
                            ...data,
                            isRead: false,
                            createdAt: new Date().toISOString()
                        };

                        setNotifications(prev => {
                            const updated = [newNotification, ...prev];
                            return updated;
                        });
                        setUnreadCount(prev => prev + 1);

                        showNotificationToast(data);
                    });
                })
                .catch(e => console.error('Connection failed: ', e));
        }

        return () => {
            if (connection) connection.stop();
        };
    }, [connection, showNotificationToast]);

    const markNotificationAsRead = async (id) => {
        try {
            await markAsReadService(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            await markAllAsReadService();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all notifications as read", error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markNotificationAsRead,
            markAllNotificationsAsRead,
            refreshNotifications: () => {
                setPage(1);
                fetchNotifications(1);
            },
            loadMoreNotifications,
            hasMore,
            loading,
            connection
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);