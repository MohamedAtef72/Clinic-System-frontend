import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
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
    const { isAuthenticated } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // Use a ref so the SignalR effect can access latest value without re-subscribing
    const connectionRef = useRef(null);

    // ─── Helpers ────────────────────────────────────────────────────────────────

    const normalize = (n) => ({
        id: n.id ?? n.Id,
        title: n.title ?? n.Title,
        message: n.message ?? n.Message,
        isRead: n.isRead !== undefined ? n.isRead : n.IsRead,
        createdAt: n.createdAt ?? n.CreatedAt,
        type: n.type ?? n.Type,
    });

    const showNotificationToast = useCallback((data) => {
        const { title, message, type } = data;
        const cfg = { position: 'top-right', duration: 6000 };

        switch (type) {
            case 'AppointmentCancelled':
                toast.error(`${title}: ${message}`, cfg);
                break;
            case 'PatientCheckedIn':
            case 'AppointmentBooked':
                toast.success(`${title}: ${message}`, { ...cfg, icon: '📅' });
                break;
            case 'DoctorAdded':
                toast(`${title}: ${message}`, { ...cfg, icon: '👨‍⚕️' });
                break;
            default:
                toast(`${title}: ${message}`, cfg);
        }
    }, []);

    // ─── Fetch with pagination ───────────────────────────────────────────────────

    // Use a ref to guard against concurrent fetches without adding `loading` to
    // useCallback deps (which would cause the function to be recreated on every
    // render while loading is true, breaking callers that captured the old ref).
    const loadingRef = useRef(false);

    const fetchNotifications = useCallback(async (pageNum = 1) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);

        try {
            const response = await getUserNotifications(pageNum, 6);
            const raw = response?.Data ?? response?.data ?? [];
            const normalized = raw.map(normalize);

            setNotifications((prev) => {
                if (pageNum === 1) return normalized;
                const existingIds = new Set(prev.map((n) => n.id));
                return [...prev, ...normalized.filter((n) => !existingIds.has(n.id))];
            });

            setHasMore(raw.length >= 6);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, []); // stable reference – safe because we use loadingRef for the guard

    // ─── Derive unread count from notifications array (single source of truth) ──

    useEffect(() => {
        setUnreadCount(notifications.filter((n) => !n.isRead).length);
    }, [notifications]);

    // ─── Initial load (only when authenticated) ──────────────────────────────────

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications(1);
        } else {
            // Reset state on logout
            setNotifications([]);
            setUnreadCount(0);
            setPage(1);
            setHasMore(true);
        }
    }, [isAuthenticated, fetchNotifications]);

    // ─── Load more (infinite scroll) ────────────────────────────────────────────

    const loadMoreNotifications = useCallback(() => {
        if (!loadingRef.current && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchNotifications(nextPage);
        }
    }, [hasMore, page, fetchNotifications]);

    // ─── SignalR connection (only when authenticated) ────────────────────────────

    useEffect(() => {
        if (!isAuthenticated) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_URL}/clinicHub`, {
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets,
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .build();

        connectionRef.current = connection;

        connection
            .start()
            .then(() => {
                console.log('Connected to SignalR!');

                connection.on('ReceiveNotification', (data) => {
                    const incoming = normalize({
                        ...data,
                        isRead: false,
                        createdAt: data.createdAt ?? new Date().toISOString(),
                    });

                    // Prepend; unreadCount will update via the notifications useEffect
                    setNotifications((prev) => [incoming, ...prev]);
                    showNotificationToast(data);
                });
            })
            .catch((e) => console.error('SignalR connection failed:', e));

        return () => {
            connection.stop();
            connectionRef.current = null;
        };
    }, [isAuthenticated, showNotificationToast]);

    // ─── Actions ─────────────────────────────────────────────────────────────────

    const markNotificationAsRead = async (id) => {
        try {
            await markAsReadService(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            await markAllAsReadService();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all notifications as read', error);
        }
    };

    const refreshNotifications = useCallback(() => {
        if (!isAuthenticated) return;
        setPage(1);
        setHasMore(true);
        fetchNotifications(1);
    }, [isAuthenticated, fetchNotifications]);

    // ─── Context value ───────────────────────────────────────────────────────────

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markNotificationAsRead,
                markAllNotificationsAsRead,
                refreshNotifications,
                loadMoreNotifications,
                hasMore,
                loading,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);