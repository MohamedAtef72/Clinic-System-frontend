import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar, Badge, Box, Button, Chip, CircularProgress,
  Container, Divider, IconButton, List, Stack, Tooltip, Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RefreshIcon from "@mui/icons-material/Refresh";

import { getUserNotifications } from "../../../services/notificationService";
import { useNotifications } from "../../../contexts/NotificationContext";
import NotificationCard from "../components/NotificationCard";
import NotificationsPagination from "../components/NotificationsPagination";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
// ── Tokens ──
const normalize = (n) => ({
  id: n.id ?? n.Id,
  title: n.title ?? n.Title,
  message: n.message ?? n.Message,
  isRead: n.isRead !== undefined ? n.isRead : n.IsRead,
  createdAt: n.createdAt ?? n.CreatedAt,
  type: n.type ?? n.Type,
});

export default function NotificationsPage() {
  const { markNotificationAsRead, markAllNotificationsAsRead } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [totalCount, setTotalCount]       = useState(0);
  const [markingAll, setMarkingAll]       = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchPage = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const response = await getUserNotifications(pageNum);
      const raw      = response?.Data ?? response?.data ?? [];
      const count    = response?.totalCount ?? response?.TotalCount ?? raw.length;
      const pageSize = response?.pageSize ?? response?.PageSize ?? 6;
      const pages    = Math.ceil(count / pageSize) || 1;

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

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
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

  return (
    <>
<Box sx={{ minHeight: "100vh", background: "#f9f8f5", pt: 5, pb: 8, fontFamily: "'Inter', sans-serif" }}>
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Badge 
                badgeContent={unreadCount || null} 
                sx={{ 
                  "& .MuiBadge-badge": { bgcolor: "#ef4444", color: "white", fontWeight: 700 }
                }}
              >
                <Avatar sx={{ width: 46, height: 46, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, boxShadow: `0 4px 14px ${GOLD}50` }}>
                  <NotificationsIcon sx={{ color: "white" }} />
                </Avatar>
              </Badge>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px" }}>
                  Notifications
                </Typography>
                <Typography variant="caption" sx={{ color: TEXT_MID, fontSize: "0.85rem" }}>
                  {totalCount > 0 ? `${totalCount} total · ${unreadCount} unread` : "No notifications yet"}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Refresh">
                <IconButton onClick={() => fetchPage(page)} size="small" sx={{ color: TEXT_MID, "&:hover": { color: GOLD, bgcolor: GOLD_BG } }}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {unreadCount > 0 && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={markingAll ? <CircularProgress size={14} color="inherit" /> : <DoneAllIcon />}
                  disabled={markingAll}
                  onClick={handleMarkAllRead}
                  sx={{
                    borderColor: `${GOLD}60`, color: GOLD_DARK, textTransform: "none", fontWeight: 600, borderRadius: 50, px: 2,
                    "&:hover": { borderColor: GOLD, bgcolor: GOLD_BG }
                  }}
                >
                  Mark all as read
                </Button>
              )}
            </Stack>
          </Box>

          {/* List Card */}
          <Box sx={{ background: "#ffffff", border: `1px solid rgba(184,151,42,0.15)`, borderRadius: 4, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.04)" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}>
                <CircularProgress sx={{ color: GOLD }} />
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 10, gap: 2 }}>
                <NotificationsIcon sx={{ fontSize: 56, color: `${GOLD}40` }} />
                <Typography sx={{ color: TEXT_DARK, fontWeight: 600 }}>You're all caught up!</Typography>
                <Typography sx={{ color: TEXT_MID, fontSize: "0.85rem" }}>No notifications on this page.</Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ px: 3, pt: 2.5, pb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafaf7" }}>
                  <Typography sx={{ color: TEXT_MID, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    Page {page} of {totalPages}
                  </Typography>
                  {unreadCount > 0 && (
                    <Chip label={`${unreadCount} unread`} size="small" sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700, bgcolor: GOLD_BG, color: GOLD_DARK, border: `1px solid ${GOLD}40` }} />
                  )}
                </Box>
                <Divider sx={{ borderColor: `rgba(184,151,42,0.1)` }} />
                <List sx={{ px: 2, py: 2 }}>
                  {notifications.map((n) => (
                    <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} />
                  ))}
                </List>
              </>
            )}
          </Box>

          <NotificationsPagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </Container>
      </Box>
    </>
  );
}
