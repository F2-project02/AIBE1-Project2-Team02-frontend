// src/components/Messages/MessageDeleteModal.jsx

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import thinkingFace from "../../assets/thinking.gif";
import heartsmileGif from "../../assets/heartsmile.gif";
import warnGif from "../../assets/warn.gif";

export default function MessageDeleteModal({
  open,
  onClose,
  onDelete,
  showToast,
  selectedCount = 0,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await onDelete();
      showToast("쪽지가 삭제되었어요!", heartsmileGif);
      setTimeout(() => onClose(), 150);
    } catch (e) {
      console.error("쪽지 삭제 실패", e);
      showToast("쪽지 삭제에 실패했어요.", warnGif, "error");
      setDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          backgroundColor: "var(--bg-100)",
          px: isMobile ? 3 : 4,
          py: 2,
          width: isMobile ? "90vw" : 360,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.1rem",
          textAlign: "center",
          color: "var(--text-100)",
        }}
      >
        쪽지 {selectedCount}개를 삭제하시겠어요?
      </DialogTitle>

      <DialogContent>
        <Box
          component="img"
          src={thinkingFace}
          alt="고민"
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
          정말 삭제하시려구요?
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
          onClick={handleDelete}
          disabled={deleting}
          variant="contained"
          sx={{
            backgroundColor: "var(--action-red)",
            boxShadow: "none",
            fontWeight: 500,
            px: 3,
            borderRadius: "8px",
            color: "var(--bg-100)",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: "rgba(204, 105, 105, 0.9)",
            },
          }}
        >
          {deleting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "삭제하기"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}