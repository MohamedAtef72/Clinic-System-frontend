import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  List,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RefreshIcon from "@mui/icons-material/Refresh";

import { getUserNotifications } from "../../../services/notificationService";
import { useNotifications } from "../../../contexts/NotificationContext";
import NotificationCard from "../components/NotificationCard";
import NotificationsPagination from "../components/NotificationsPagination";

// ─── Normalize API shape ──────────────────────────────────────────────────────

const normalize = (n) => ({
  id: n.id ?? n.Id,
  title: n.title ?? n.Title,
  message: n.message ?? n.Message,
  isRead: n.isRead !== undefined ? n.isRead : n.IsRead,
  createdAt: n.createdAt ?? n.CreatedAt,
  type: n.type ?? n.Type,
});

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const {
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadCount: contextUnreadCount,
  } = useNotifications();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);

  // local unread derived from page state; context drives the navbar badge
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ─── Fetch ──────────────────────────────────────────────────────────────────

  const fetchPage = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const response = await getUserNotifications(pageNum);
      // API returns PascalCase for Data array, camelCase for meta fields
      const raw = response?.Data ?? response?.data ?? [];
      const count = response?.totalCount ?? response?.TotalCount ?? raw.length;
      const pageSize = response?.pageSize ?? response?.PageSize ?? 6;
      const pages = Math.ceil(count / pageSize) || 1;

      setNotifications(raw.map(normalize));
      setTotalCount(count);
      setTotalPages(pages);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const handleMarkRead = async (id) => {
    try {
      // update context (→ navbar badge) AND local page state
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      // update context (→ navbar badge) AND local page state
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #f0f4f8 0%, #e8eef5 50%, #f0f4f8 100%)",
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="md">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Badge badgeContent={unreadCount || null} color="error" overlap="circular">
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                  boxShadow: "0 4px 14px rgba(25,118,210,0.3)",
                }}
              >
                <NotificationsIcon />
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h5" fontWeight={700} color="#1e293b">
                Notifications
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {totalCount > 0
                  ? `${totalCount} total · ${unreadCount} unread`
                  : "No notifications yet"}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Refresh">
              <IconButton
                id="refresh-notifications-btn"
                onClick={() => fetchPage(page)}
                size="small"
                sx={{ color: "#64748b", "&:hover": { color: "#1976d2" } }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {unreadCount > 0 && (
              <Button
                id="mark-all-read-btn"
                size="small"
                variant="outlined"
                startIcon={
                  markingAll ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <DoneAllIcon />
                  )
                }
                disabled={markingAll}
                onClick={handleMarkAllRead}
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "#1565c0",
                    background: "rgba(25,118,210,0.06)",
                  },
                }}
              >
                Mark all as read
              </Button>
            )}
          </Stack>
        </Box>

        {/* ── Notification list card ──────────────────────────────────────── */}
        <Box
          sx={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          {loading ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}
            >
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 10,
                gap: 2,
                color: "text.secondary",
              }}
            >
              <NotificationsIcon sx={{ fontSize: 56, opacity: 0.3 }} />
              <Typography variant="body1">You're all caught up!</Typography>
              <Typography variant="caption">No notifications on this page.</Typography>
            </Box>
          ) : (
            <>
              {/* Page info bar */}
              <Box
                sx={{
                  px: 2,
                  pt: 2,
                  pb: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}
                >
                  Page {page} of {totalPages}
                </Typography>
                {unreadCount > 0 && (
                  <Chip
                    label={`${unreadCount} unread`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ height: 20, fontSize: "0.65rem" }}
                  />
                )}
              </Box>

              <Divider sx={{ borderColor: "#f1f5f9", mx: 2 }} />

              <List sx={{ px: 1, pt: 1 }}>
                {notifications.map((n) => (
                  <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} />
                ))}
              </List>
            </>
          )}
        </Box>

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        <NotificationsPagination
          page={page}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      </Container>
    </Box>
  );
}
