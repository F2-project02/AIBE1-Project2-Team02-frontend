import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { dummyReceivedMessages } from "../../constants/mock/dummyReceivedMessages";
import { dummySentMessages } from "../../constants/mock/dummySentMessages";
import GradientButton from "../Button/GradientButton";
import MessageReplyModal from "./MessageReplyModal";

export default function MessageModal({ messageId, tab, onClose }) {
  const [message, setMessage] = useState(null);
  const [openReply, setOpenReply] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleReplySent = () => {
    setOpenReply(false);
    onClose();
  };

  useEffect(() => {
    const data = tab === 0 ? dummyReceivedMessages : dummySentMessages;
    const found = data.find((msg) => msg.messageId === messageId);
    setMessage(found || null);
  }, [messageId, tab]);

  if (!message) return null;

  const { nickname, content, createdAt } = message;
  const isReceived = tab === 0;

  return (
    <>
      <Modal open onClose={onClose}>
        <Box
          sx={{
            width: isMobile ? "100vw" : 500,
            height: isMobile ? "100dvh" : "auto",
            maxHeight: isMobile ? "100dvh" : "80vh",
            overflowY: "auto",
            bgcolor: "#fefefe",
            borderRadius: isMobile ? 0 : "16px",
            p: isMobile ? 2 : 4.5,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 6,
            outline: "none",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
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
            {isReceived ? "받은 쪽지" : "보낸 쪽지"}
          </Typography>

          {/* 보낸 사람 / 보낸 시간 */}
          <Stack spacing={1.5} mb={3} sx={{ flexShrink: 0 }}>
            <Stack direction="row" spacing={2.5}>
              <Typography fontWeight={600}>
                {isReceived ? "보낸 사람" : "받는 사람"}
              </Typography>
              <Typography fontWeight={500}>{nickname}</Typography>
            </Stack>
            <Stack direction="row" spacing={2.5}>
              <Typography fontWeight={600}>보낸 시간</Typography>
              <Typography fontWeight={500}>{createdAt}</Typography>
            </Stack>
          </Stack>
          {/* 쪽지 내용 - 스크롤 적용 */}
          <Box
            sx={{
              minHeight: isMobile ? 100 : 216,
              maxHeight: "calc(80vh - 280px)",
              borderRadius: "12px",
              bgcolor: "#fafafa",
              p: 2,
              mb: isMobile ? 2 : 3,
              overflowY: "auto",
              flexGrow: 1,
            }}
          >
            <Typography
              fontWeight={500}
              fontSize={isMobile ? "0.9rem" : "1rem"}
            >
              {content}
            </Typography>
          </Box>

          {/* 버튼 영역 */}
          <Box sx={{ flexShrink: 0 }}>
            {" "}
            {/* 버튼 영역은 크기 고정 */}
            {isReceived ? (
              <Box display="flex" gap={2}>
                <Box sx={{ width: "50%" }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      backgroundColor: "var(--bg-100)",
                      borderRadius: "12px",
                      borderColor: "var(--bg-300)",
                      color: "var(--text-400)",
                      fontWeight: 600,
                      height: 52,
                      p: 1.5,
                      ":hover": {
                        backgroundColor: "var(--bg-200)",
                      },
                    }}
                    onClick={onClose}
                  >
                    닫기
                  </Button>
                </Box>

                <Box sx={{ width: "50%" }}>
                  <GradientButton
                    fullWidth
                    size="md"
                    onClick={() => setOpenReply(true)}
                    sx={{
                      height: 52,
                      borderRadius: "12px",
                      padding: 0,
                    }}
                  >
                    답장하기
                  </GradientButton>
                </Box>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  backgroundColor: "var(--bg-100)",
                  borderRadius: "12px",
                  borderColor: "var(--bg-300)",
                  color: "var(--text-400)",
                  fontWeight: 600,
                  height: 52,
                  p: 1.5,
                  ":hover": {
                    backgroundColor: "var(--bg-200)",
                  },
                }}
                onClick={onClose}
              >
                닫기
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      {/* 답장 모달 */}
      {openReply && (
        <MessageReplyModal
          receiverNickname={nickname}
          onClose={() => setOpenReply(false)}
          onReplySent={handleReplySent}
          open={openReply}
        />
      )}
    </>
  );
}
