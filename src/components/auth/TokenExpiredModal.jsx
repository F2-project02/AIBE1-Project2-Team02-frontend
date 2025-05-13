// src/components/auth/TokenExpiredModal.jsx
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
} from "@mui/material";
import warnGif from "../../assets/cryingface.gif";
import { useLoginModalStore } from "../../store/useLoginModalStore";

export default function TokenExpiredModal({ open, onClose }) {
  const { open: openLoginModal } = useLoginModalStore();

  const handleLogin = () => {
    onClose();
    openLoginModal();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          backgroundColor: "var(--bg-100)",
          px: 4,
          py: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "var(--text-100)",
          fontWeight: 600,
          fontSize: "1.2rem",
          textAlign: "center",
        }}
      >
        로그인 세션 만료
      </DialogTitle>

      <DialogContent>
        <Box
          component="img"
          src={warnGif}
          alt="경고"
          sx={{
            display: "block",
            mx: "auto",
            my: 2,
            width: 80,
            height: 80,
            borderRadius: "8px",
          }}
        />
        <DialogContentText
          sx={{
            color: "var(--text-300)",
            textAlign: "center",
            fontSize: "0.95rem",
            fontWeight: 500,
          }}
        >
          로그인 세션이 만료되었습니다. 다시 로그인해 주세요.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "var(--text-200)",
            fontWeight: 500,
            px: 3,
            borderRadius: "8px",
            "&:hover": { backgroundColor: "var(--bg-200)" },
          }}
        >
          닫기
        </Button>
        <Button
          onClick={handleLogin}
          variant="contained"
          sx={{
            backgroundColor: "var(--primary-100)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            fontWeight: 600,
            px: 3,
            borderRadius: "8px",
            color: "var(--bg-100)",
            "&:hover": { backgroundColor: "var(--primary-200)" },
          }}
        >
          로그인 페이지로
        </Button>
      </DialogActions>
    </Dialog>
  );
}
