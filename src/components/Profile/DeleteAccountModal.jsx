// src/components/Profile/DeleteAccountModal.jsx
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

export default function DeleteAccountModal({ open, onClose, onConfirm }) {
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
        sx={{ color: "var(--text-100)", fontWeight: 600, fontSize: "1.2rem" }}
      >
        정말로 탈퇴하시겠습니까?
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
          탈퇴하시면 계정 정보가 모두 삭제되며 복구할 수 없어요.
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
          취소
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: "var(--action-red)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            fontWeight: 600,
            px: 3,
            borderRadius: "8px",
            color: "var(--bg-100)",
            "&:hover": { backgroundColor: "rgba(204, 105, 105, 0.9)" },
          }}
        >
          탈퇴하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
