// src/components/Messages/MessageDeleteModal.jsx

import {
  Modal,
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import GradientButton from "../Button/GradientButton";
import warnGif from "../../assets/warn.gif";
import heartsmileGif from "../../assets/heartsmile.gif";

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
      setTimeout(() => {
        onClose();
      }, 150);
    } catch (e) {
      console.error("삭제 실패", e);
      showToast("쪽지 삭제에 실패했어요.", warnGif, "error");
      setDeleting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: isMobile ? "90vw" : 360,
          height: "auto",
          bgcolor: "#fefefe",
          borderRadius: isMobile ? 0 : "16px",
          p: isMobile ? 3 : 4.5,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 6,
          outline: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          textAlign="center"
          fontWeight={600}
          fontSize="1.1rem"
          color="var(--text-100)"
          mb={3}
        >
          쪽지 {selectedCount}개를 삭제하시겠습니까?
        </Typography>

        <Box display="flex" gap={2} sx={{ flexShrink: 0 }}>
          <Box sx={{ width: "50%", height: 44 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              fullWidth
              sx={{
                height: "100%",
                backgroundColor: "var(--bg-100)",
                borderRadius: "12px",
                borderColor: "var(--bg-300)",
                color: "var(--text-400)",
                fontWeight: 600,
                ":hover": {
                  backgroundColor: "var(--bg-200)",
                },
              }}
            >
              닫기
            </Button>
          </Box>
          <Box sx={{ width: "50%", height: 44 }}>
            <GradientButton
              fullWidth
              size="md"
              onClick={handleDelete}
              sx={{ height: "100%", borderRadius: "12px", padding: 0 }}
            >
              삭제하기
            </GradientButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
