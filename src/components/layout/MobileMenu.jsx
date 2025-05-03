// src/components/layout/MobileMenu.jsx

import { Box, Button, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { useLoginModalStore } from "../../store/useLoginModalStore";
import menuItems from "./menuItems";

export default function MobileMenu({ onClose }) {
  const { isLoggedIn, profileImage } = useUserStore();
  const { open } = useLoginModalStore();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    open();
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
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
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src={profileImage}
              alt="프로필"
              style={{ width: 36, height: 36, borderRadius: "50%" }}
            />
            <Typography variant="body1" fontWeight={500}>
              프로필
            </Typography>
          </Box>
          <Button
            onClick={() => {
              alert("로그아웃 로직 필요!");
              onClose();
            }}
            {...menuButtonStyle}
            sx={{
              ...menuButtonStyle.sx,
              color: "var(--text-300)",
            }}
          >
            로그아웃
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {menuItems.map(({ label, path }) => (
        <Button
          key={path}
          onClick={() => handleNavigate(path)}
          {...menuButtonStyle}
        >
          {label}
        </Button>
      ))}
    </Box>
  );
}
