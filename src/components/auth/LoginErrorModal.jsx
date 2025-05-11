// src/components/auth/LoginErrorModal.jsx
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
} from "@mui/material";
import warnGif from "../../assets/warn.gif";

export default function LoginErrorModal({ open, onClose, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          backgroundColor: "var(--bg-100)",
          px: 3,
          py: 2,
          maxWidth: "400px",
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
        로그인 오류
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
            mb: 2,
          }}
        >
          {message}
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
      </DialogActions>
    </Dialog>
  );
}
