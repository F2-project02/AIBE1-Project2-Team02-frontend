// src/components/layout/MobileMenu.jsx

import { Box, Button, Divider, Typography } from "@mui/material";
import { useUserStore } from "../../store/useUserStore";
import { useLoginModalStore } from "../../store/useLoginModalStore";

export default function MobileMenu({ onClose }) {
  const { isLoggedIn, profileImage } = useUserStore();
  const { open } = useLoginModalStore();

  const handleLoginClick = () => {
    onClose(); // 드로어 닫기
    open();    // 로그인 모달 열기
  };

  return (
    <Box sx={{ width: 260, p: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        MENU
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {!isLoggedIn ? (
        <Button
          variant="text"
          fullWidth
          onClick={handleLoginClick}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            color: "var(--text-100)",
            justifyContent: "flex-start",
            px: 0,
          }}
        >
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
            variant="text"
            fullWidth
            onClick={() => {
              alert("로그아웃 로직 필요!");
              onClose();
            }}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: "var(--text-300)",
              justifyContent: "flex-start",
              px: 0,
            }}
          >
            로그아웃
          </Button>
        </Box>
      )}
    </Box>
  );
}
