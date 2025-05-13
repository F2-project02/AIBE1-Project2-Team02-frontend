// src/components/Messages/ReportModal.jsx

import {
  Modal,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { reportUser } from "../../lib/api/reportApi";
import GradientButton from "../Button/GradientButton";
import messageGif from "../../assets/message.gif";
import warnGif from "../../assets/warn.gif";
import thinkingFace from "../../assets/thinking.gif";

export default function MessageReportModal({
  open,
  onClose,
  message,
  showToast,
}) {
  const [reason, setReason] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleTrySubmit = () => {
    if (!reason.trim()) {
      showToast("신고 사유를 입력해주세요.", warnGif, "warning");
      return;
    }
    setConfirmOpen(true); // 확인 다이얼로그 열기
  };

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    try {
      await reportUser({
        targetType: "USER",
        targetId: message?.senderId,
        reason,
        reasonType: "MESSAGE_CONTENT",
      });
      showToast(
        "신고가 접수되었어요. 운영팀이 검토 후 처리할게요!",
        messageGif,
        "success"
      );
      setTimeout(() => {
        setConfirmOpen(false);
        onClose();
      }, 1500);
    } catch (e) {
      const status = e?.response?.status;

      let errorMessage = "신고 중 문제가 발생했어요.";

      if (status === 409) {
        errorMessage = "이미 신고한 사용자는 또 신고할 수 없어요.";
      } else if (status === 404) {
        errorMessage = "신고할 대상을 찾을 수 없어요.";
      } else if (status === 403) {
        errorMessage = "신고할 수 없는 대상이에요.";
      } else if (status === 400) {
        errorMessage = "신고 양식이 올바르지 않아요.";
      }

      showToast(errorMessage, warnGif, "error");
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* 본 신고 입력 모달 */}
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
            <Typography
              fontWeight={500}
              fontSize="14px"
              color="var(--text-300)"
            >
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
                  fontWeight: 500,
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
                onClick={handleTrySubmit}
                sx={{
                  height: "100%",
                  borderRadius: "12px",
                  padding: 0,
                  fontWeight: 500,
                }}
              >
                제출
              </GradientButton>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* 확인 다이얼로그 */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            backgroundColor: "var(--bg-100)",
            px: 3,
            py: 2,
            width: isMobile ? "90vw" : 360,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "1.2rem",
            color: "var(--text-100)",
            textAlign: "center",
          }}
        >
          정말 신고하시겠어요?
        </DialogTitle>

        <DialogContent>
          <Box
            component="img"
            src={thinkingFace}
            alt="thinking"
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
            신고 내용은 운영팀이 검토 후 조치해요. 허위 신고 시 이용에 제한이
            있을 수 있어요.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
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
            onClick={handleConfirmSubmit}
            disabled={submitting}
            variant="contained"
            sx={{
              backgroundColor: "transparent",
              border: "1px solid var(--action-yellow)",
              boxShadow: "none",
              fontWeight: 500,
              px: 3,
              borderRadius: "8px",
              color: "var(--action-yellow)",
              "&:hover": {
                boxShadow: "none",
                backgroundColor: "var(--action-yellow-bg)",
              },
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "신고하기"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
