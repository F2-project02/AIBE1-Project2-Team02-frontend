import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import GradientButton from "../../../Button/GradientButton";
import { rejectApplication } from "../../../../lib/api/inquiryApi";
import CustomToast from "../../../common/CustomToast";
import warnGif from "../../../../assets/warn.gif";
import cryingfaceGif from "../../../../assets/cryingface.gif";

export default function RejectReasonModal({
  applicationId,
  menteeNickname,
  onClose,
  onRejectSubmitted,
  open,
}) {
  const [reason, setReason] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const textFieldRef = useRef(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      showToast("반려 사유를 입력해주세요.", warnGif, "error");
      return;
    }
    try {
      await rejectApplication({ applicationId, reason });
      showToast("반려 되었어요.", cryingfaceGif);
      setTimeout(() => {
        onRejectSubmitted?.(applicationId);
      }, 2000);
    } catch (error) {
      showToast("반려 실패했어요.", warnGif, "error");
      console.error("신청 반려 실패", error);
    }
  };

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [open]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            width: isMobile ? "100vw" : 500,
            height: isMobile ? "100dvh" : "auto",
            maxHeight: isMobile ? "100dvh" : "90vh",
            bgcolor: "#fefefe",
            borderRadius: isMobile ? 0 : "16px",
            p: isMobile ? 2 : 4.5,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 6,
          }}
        >
          {/* 타이틀 */}
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight={600}
            fontSize="1.25rem"
            mb={4}
          >
            반려 사유
          </Typography>

          {/* 받는 사람 */}
          <Stack direction="row" spacing={2.5} mb={3}>
            <Typography fontWeight={600}>받는 사람</Typography>
            <Typography fontWeight={500}>{menteeNickname}</Typography>
          </Stack>

          {/* 반려 사유 */}
          <Stack spacing={1} mb={2}>
            <Typography fontWeight={600} fontSize="14px">
              쪽지 내용
            </Typography>
            <TextField
              multiline
              fullWidth
              minRows={11}
              maxRows={11}
              placeholder="반려 사유를 입력하세요..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  padding: "12px",
                  borderRadius: "12px",
                },
                "& textarea": {
                  fontSize: "15px",
                  fontWeight: 500,
                },
              }}
              inputRef={textFieldRef}
            />
          </Stack>

          {/* 버튼 영역 */}
          <Box display="flex" gap={2} sx={{ flexShrink: 0 }}>
            <Box sx={{ width: "50%", height: "52px" }}>
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

            <Box sx={{ width: "50%", height: "52px" }}>
              <GradientButton
                fullWidth
                size="md"
                onClick={handleSubmit}
                sx={{
                  height: "100%",
                  borderRadius: "12px",
                  padding: 0,
                }}
              >
                보내기
              </GradientButton>
            </Box>
          </Box>
        </Box>
      </Modal>
      <CustomToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        iconSrc={toastIcon}
        type={toastType}
      />
    </>
  );
}
