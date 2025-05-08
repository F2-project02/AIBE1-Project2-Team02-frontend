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
import { useRef, useEffect, useState } from "react";
import GradientButton from "../Button/GradientButton";
import { sendMessage } from "../../lib/api/messageApi";
import CustomToast from "../common/CustomToast";
import messageGif from "../../assets/message.gif";
import warnGif from "../../assets/warn.gif";

export default function MessageReplyModal({
  senderId,
  senderNickname,
  onClose,
  onReplySent,
  open,
}) {
  const [content, setContent] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const textFieldRef = useRef(null);

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  const handleSend = async () => {
    if (!content.trim()) {
      showToast("쪽지 내용을 입력해주세요.", warnGif, "error");
      return;
    }

    try {
      await sendMessage({ receiverId: senderId, content });
      showToast("쪽지가 잘 전달되었어요!", messageGif);
      setTimeout(() => {
        onReplySent?.();
      }, 2000);
    } catch (e) {
      console.error("쪽지 전송 실패", e);
      showToast("이런, 쪽지 전송에 실패했어요.", warnGif, "error");
    }
  };

  useEffect(() => {
    if (textFieldRef.current) textFieldRef.current.focus();
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
          {/* 타이틀 */}
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight={600}
            fontSize="1.25rem"
            color="var(--text-100)"
            mb={4}
          >
            쪽지 보내기
          </Typography>

          {/* 받는 사람 */}
          <Stack direction="row" spacing={2.5} mb={3}>
            <Typography fontWeight={600} color="var(--text-300)">
              받는 사람
            </Typography>
            <Typography fontWeight={500} color="var(--text-200)">
              {senderNickname}
            </Typography>
          </Stack>

          {/* 쪽지 내용 */}
          <Stack spacing={1.5} mb={2}>
            <Typography
              fontWeight={500}
              fontSize="14px"
              color="var(--text-300)"
            >
              쪽지 내용
            </Typography>
            <TextField
              multiline
              fullWidth
              minRows={11}
              maxRows={11}
              placeholder="메시지를 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              inputRef={textFieldRef}
              inputProps={{ maxLength: 200 }} // 최대 글자 수 제한
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",

                  // 기본 상태
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--bg-300)",
                  },

                  // hover 상태
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--primary-100)", // 예: 호버 시 파란색
                  },

                  // focus 상태
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--primary-100)", // 예: 포커스 시 더 진한 파란색
                  },
                },

                "& textarea": {
                  fontSize: "15px",
                  color: "var(--text-200)",
                  fontWeight: 500,
                },
              }}
            />
            {/* 최대 글자 수 표시 */}
            <Typography
              textAlign="right"
              fontSize="13px"
              color="var(--text-400)"
              mt={2}
            >
              {content.length} / 200자
            </Typography>
          </Stack>

          {/* 버튼 영역 */}
          <Box display="flex" gap={2} sx={{ flexShrink: 0 }}>
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
                onClick={handleSend}
                sx={{ height: "100%", borderRadius: "12px", padding: 0 }}
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
