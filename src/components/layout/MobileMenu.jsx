// src/components/layout/MobileMenu.jsx

import { Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { useLoginModalStore } from "../../store/useLoginModalStore";
import LogoutConfirmDialog from "../common/LogoutConfirmDialog";
import CustomToast from "../common/CustomToast";
import menuItems from "./menuItems";
import warnGif from "../../assets/warn.gif";

export default function MobileMenu({ onClose, onLogoutWithToast }) {
  const { isLoggedIn, profileImage, nickname, logout } = useUserStore();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { open } = useLoginModalStore();
  const navigate = useNavigate();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  const handleLoginClick = () => {
    onClose();
    open();
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onLogoutWithToast?.();
    onClose?.();
    navigate("/");
  };

  const handleMenuClick = (path, requiresLogin) => {
    if (requiresLogin && !isLoggedIn) {
      showToast("로그인이 필요한 서비스예요!", warnGif, "info");
    } else {
      handleNavigate(path);
    }
  };

  const menuButtonStyle = {
    variant: "text",
    fullWidth: true,
    disableRipple: true,
    sx: {
      textTransform: "none",
      fontWeight: 500,
      justifyContent: "flex-start",
      px: 1.5,
      py: 1,
      borderRadius: 1,
      color: "var(--text-100)",
      transition: "background-color 0.2s ease",
      "&:active": {
        backgroundColor: "var(--bg-200)",
      },
    },
  };

  return (
    <Box sx={{ width: 260, p: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        MENU
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {!isLoggedIn ? (
        <Button onClick={handleLoginClick} {...menuButtonStyle}>
          로그인/회원가입
        </Button>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <img
              src={profileImage}
              alt="프로필"
              style={{ width: 32, height: 32, borderRadius: "50%" }}
            />
            <Typography variant="body2" fontWeight={500}>
              {nickname}
            </Typography>
          </Box>

          <Button
            onClick={() => handleNavigate("/mypage")}
            {...menuButtonStyle}
          >
            마이페이지
          </Button>

          <Button
            onClick={() => setLogoutDialogOpen(true)}
            {...menuButtonStyle}
            sx={{
              ...menuButtonStyle.sx,
              color: "var(--action-red)",
            }}
          >
            로그아웃
          </Button>

          <LogoutConfirmDialog
            open={logoutDialogOpen}
            onClose={() => setLogoutDialogOpen(false)}
            onConfirm={handleLogout}
          />
        </Box>
      )}

      <Divider sx={{ my: 2 }} />
      {menuItems.map(({ label, path, requiresLogin }) => {
        const isAccessible = !requiresLogin || isLoggedIn;

        return (
          <Button
            key={path}
            onClick={() => handleMenuClick(path, requiresLogin)}
            {...menuButtonStyle}
            sx={{
              ...menuButtonStyle.sx,
              color: isAccessible ? "var(--text-100)" : "var(--text-300)",
              opacity: isAccessible ? 1 : 0.7,
              cursor: isAccessible ? "pointer" : "default",
            }}
          >
            {label}
          </Button>
        );
      })}

      {/* 비활성화 탭 경고 토스트 */}
      <CustomToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        iconSrc={toastIcon}
        type={toastType}
      />
    </Box>
  );
}
