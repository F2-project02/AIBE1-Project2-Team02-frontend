import { Menu, Typography, Avatar, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRecentNotifications,
  markAllAsRead,
} from "../../lib/api/notificationApi";
import formatNotificationDate from "../../utils/formatNotificationDate";
import NotificationSkeleton from "./NotificationSkeleton";

export default function NotificationDropdown({ anchorEl, onClose, open }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setLoading(true);
      getRecentNotifications()
        .then(setNotifications)
        .finally(() => {
          setLoading(false);
          markAllAsRead();
        });
    }
  }, [open]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          mt: 1,
          borderRadius: "12px",
          width: 360,
          minHeight: 570,
          maxHeight: 570,
          bgcolor: "var(--bg-200)",
          overflowY: "auto",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        },
      }}
      MenuListProps={{
        disablePadding: true,
      }}
    >
      <Box
        sx={{
          bgcolor: "var(--bg-100)",
          px: 2,
          py: 1.5,
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          borderBottom: "1px solid var(--bg-200)",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          fontSize="15px"
          color="var(--text-100)"
        >
          알림
        </Typography>
      </Box>

      {loading ? (
        Array(4)
          .fill(null)
          .map((_, i) => <NotificationSkeleton key={i} />)
      ) : notifications.length === 0 ? (
        <Box px={2} py={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            알림이 없습니다.
          </Typography>
        </Box>
      ) : (
        notifications.map((n) => (
          <Box
            key={n.notificationId}
            sx={{
              bgcolor: "var(--bg-100)",
              m: 2,
              px: 2,
              py: 2,
              borderRadius: "12px",
              cursor: "pointer",
            }}
            onClick={() => {
              onClose();
              navigate(n.targetUrl);
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                src={n.profileImage || "/images/default-profile.svg"}
                sx={{ width: 32, height: 32 }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: "-5px" }}
                >
                  {n.nickname}
                </Typography>
                <Typography variant="caption" color="var(--text-300)">
                  {formatNotificationDate(n.createdAt)}
                </Typography>
              </Box>
            </Box>

            <Box mt={1.5}>
              <Typography variant="body2">{n.content}</Typography>
            </Box>
          </Box>
        ))
      )}
    </Menu>
  );
}
