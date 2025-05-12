// src/components/Messages/ReportModal.jsx

import {
  Modal,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import GradientButton from "../Button/GradientButton";
import { reportUser } from "../../lib/api/reportApi";
import messageGif from "../../assets/message.gif";
import warnGif from "../../assets/warn.gif";

export default function MessageReportModal({
  open,
  onClose,
  message,
  showToast,
}) {
  const [reason, setReason] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);
  const handleSubmit = async () => {
    if (!reason.trim()) {
      showToast("신고 사유를 입력해주세요.", warnGif, "warning");
      return;
    }
    console.log(message);
    try {
      await reportUser({
        targetType: "USER",
        targetId: message?.senderId,
        reason,
        reasonType: "MESSAGE_CONTENT",
      });
      showToast("신고가 접수되었습니다.", messageGif, "success");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (e) {
      const serverMessage = e?.response?.data?.message;
      const isDuplicate =
        serverMessage?.includes("이미 이 대상을 신고하셨습니다.");

      const errorMessage = isDuplicate
        ? serverMessage
        : "신고 중 오류가 발생했습니다.";

      showToast(errorMessage, warnGif, "error");
    }
  };

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: isMobile ? "100vw" : 500,
          height: isMobile ? "100dvh" : "auto",
          maxHeight: isMobile ? "100dvh" : "90vh",
          bgcolor: "#fefefe",
          borderRadius: isMobile ? 0 : "16px",
          p: 4.5,
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
          fontSize="1.25rem"
          color="var(--text-100)"
          mb={4}
        >
          사용자 신고하기
        </Typography>

        <Stack spacing={1.5} mb={2}>
          <Typography fontWeight={500} fontSize="14px" color="var(--text-300)">
            신고 사유
          </Typography>
          <TextField
            multiline
            fullWidth
            minRows={8}
            maxRows={8}
            placeholder="신고 사유를 입력해주세요..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            inputRef={inputRef}
            inputProps={{ maxLength: 200 }}
          />
          <Typography
            textAlign="right"
            fontSize="13px"
            color="var(--text-400)"
            mt={2}
          >
            {reason.length} / 200자
          </Typography>
        </Stack>

        <Box display="flex" gap={2}>
          <Box sx={{ width: "50%", height: 52 }}>
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
          <Box sx={{ width: "50%", height: 52 }}>
            <GradientButton
              fullWidth
              size="md"
              onClick={handleSubmit}
              sx={{ height: "100%", borderRadius: "12px", padding: 0 }}
            >
              제출
            </GradientButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
