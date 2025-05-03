// src/components/auth/LoginModal.jsx

import {
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLoginModalStore } from "../../store/useLoginModalStore";
import logo from "../../assets/navbar-logo.svg";
import kakaoIcon from "../../assets/kakao-icon.svg";
import googleIcon from "../../assets/google-icon.svg";

export default function LoginModal() {
  const { isOpen, close } = useLoginModalStore();

  return (
    <Modal open={isOpen} onClose={close}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          zIndex: 1500,
        }}
      >
        <Box
          sx={{
            width: 400,
            p: 4,
            borderRadius: "20px",
            backgroundColor: "var(--bg-100)",
            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          {/* 닫기 버튼 */}
          <IconButton
            onClick={close}
            sx={{ position: "absolute", top: 16, right: 16 }}
          >
            <CloseIcon />
          </IconButton>

          {/* 로고 + 타이틀 */}
          <Box display="flex" flexDirection="column" alignItems="center" mt={2} mb={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box component="img" src={logo} alt="MEN:TOSS 로고" sx={{ width: 40, height: 40 }} />
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#222",
                  fontFamily: "Pretendard",
                }}
              >
                MEN:TOSS
              </Typography>
            </Box>
            <Typography
              sx={{
                mt: 2,
                fontSize: 15,
                fontWeight: 500,
                lineHeight: "22px",
                color: "#555",
                fontFamily: "Pretendard",
                textAlign: "center",
              }}
            >
              지금, 연결을 시작해볼까요?
              <br />
              소셜 계정 하나면 충분해요.
            </Typography>
          </Box>

          {/* 구분선 + 텍스트 */}
          <Divider
            sx={{
              my: 3,
              display: "flex",
              alignItems: "center",
              "&::before, &::after": {
                borderColor: "#e0e0e0",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 500,
                color: "#aaa",
                fontFamily: "Pretendard",
              }}
            >
              간편 로그인
            </Typography>
          </Divider>

          {/* 카카오 로그인 */}
          <Button
            fullWidth
            startIcon={
              <Box component="img" src={kakaoIcon} alt="카카오 아이콘" sx={{ width: 20, height: 20 }} />
            }
            sx={{
              backgroundColor: "#FFDF2C",
              color: "var(--text-300)",
              fontSize: 15,
              fontWeight: 500,
              fontFamily: "Pretendard",
              textTransform: "none",
              borderRadius: "12px",
              py: "16px",
              mb: 1.5,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                backgroundColor: "#F0D228",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            카카오 계정으로 로그인하기
          </Button>

          {/* 구글 로그인 */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <Box component="img" src={googleIcon} alt="구글 아이콘" sx={{ width: 20, height: 20 }} />
            }
            sx={{
              fontSize: 15,
              fontWeight: 500,
              fontFamily: "Pretendard",
              textTransform: "none",
              borderRadius: "12px",
              py: "16px",
              color: "var(--text-300)",
              borderColor: "var(--bg-100)",
              backgroundColor: "var(--bg-100)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                backgroundColor: "var(--bg-200)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            구글 계정으로 로그인하기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}