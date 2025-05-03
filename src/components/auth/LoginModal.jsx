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
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import GoogleIcon from "@mui/icons-material/Google";
import { useLoginModalStore } from "../../store/useLoginModalStore";
import logo from "../../assets/navbar-logo.svg";

function LogoGradient() {
  return (
    <Box
      component="img"
      src={logo}
      alt="MEN:TOSS 로고"
      sx={{ width: 48, height: 48 }}
    />
  );
}

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
          zIndex: 1500,
        }}
      >
        <Box
          sx={{
            width: 360,
            p: 3,
            borderRadius: "16px",
            backgroundColor: "var(--bg-100)",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          {/* 닫기 버튼 */}
          <IconButton
            onClick={close}
            sx={{ position: "absolute", top: 12, right: 12 }}
          >
            <CloseIcon />
          </IconButton>

          {/* 로고 + 타이틀 */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={1}
            mb={2}
          >
            <LogoGradient />
            <Typography
              variant="h6"
              fontWeight="bold"
              color="var(--text-100)"
              mt={1}
            >
              MEN:TOSS
            </Typography>
            <Typography variant="body2" color="var(--text-300)" mt={1}>
              지금, 연결을 시작해볼까요? <br />
              소셜 계정 하나면 충분해요.
            </Typography>
          </Box>

          {/* 구분선 */}
          <Divider sx={{ my: 3 }}>간편 로그인</Divider>

          {/* 카카오 로그인 */}
          <Button
            fullWidth
            startIcon={<ChatBubbleIcon />}
            sx={{
              backgroundColor: "var(--action-yellow-bg)",
              color: "var(--action-yellow)",
              textTransform: "none",
              mb: 1,
              fontWeight: 500,
              borderRadius: 2,
            }}
          >
            카카오 계정으로 로그인하기
          </Button>

          {/* 구글 로그인 */}
          <Button
            fullWidth
            startIcon={<GoogleIcon />}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
            }}
          >
            구글 계정으로 로그인하기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}