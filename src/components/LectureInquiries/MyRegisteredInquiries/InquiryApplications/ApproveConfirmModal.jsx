import {
  Modal,
  Box,
  Typography,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import GradientButton from "../../../Button/GradientButton";
import partyGif from "../../../../assets/party.gif";
import warnGif from "../../../../assets/warn.gif";
import thinkingGif from "../../../../assets/thinking.gif";

export default function ApproveConfirmModal({
  open,
  onClose,
  onApprove,
  showToast,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [approving, setApproving] = useState(false);

  const handleConfirm = async () => {
    if (approving) return;
    setApproving(true);
    try {
      await onApprove();
      showToast("매칭 완료! 좋은 멘토가 되어주세요!", partyGif);
      setTimeout(() => {
        onClose();
      }, 150);
    } catch (e) {
      showToast("과외 신청 수락에 문제가 생겼어요", warnGif, "error");
      setApproving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: isMobile ? "90vw" : 360,
          bgcolor: "#fefefe",
          borderRadius: "16px",
          p: isMobile ? 3 : 4,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 6,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 이미지 영역 */}
        <Box
          component="img"
          src={thinkingGif}
          alt="고민 중"
          sx={{ width: 80, height: 80, mb: 2, borderRadius: "8px" }}
        />

        {/* 타이틀 */}
        <Typography
          variant="h6"
          fontWeight={600}
          fontSize="1.1rem"
          textAlign="center"
          color="var(--text-100)"
          mb={1}
        >
          해당 신청을 수락하시겠어요?
        </Typography>

        {/* 설명문 */}
        <Typography
          variant="body2"
          fontWeight={500}
          color="var(--text-300)"
          textAlign="center"
          mb={3}
        >
          매칭은 마이페이지에서 취소할 수 있어요.
        </Typography>

        {/* 버튼 */}
        <Box display="flex" gap={2} width="100%">
          <Button
            onClick={onClose}
            fullWidth
            variant="outlined"
            sx={{
              borderRadius: "8px",
              backgroundColor: "var(--bg-100)",
              borderColor: "var(--bg-100)",
              color: "var(--text-300)",
              fontWeight: 500,
              ":hover": {
                backgroundColor: "var(--bg-200)",
              },
            }}
          >
            닫기
          </Button>

          <GradientButton
            fullWidth
            onClick={handleConfirm}
            sx={{ borderRadius: "8px", padding: 0, fontWeight: 500 }}
          >
            수락하기
          </GradientButton>
        </Box>
      </Box>
    </Modal>
  );
}
