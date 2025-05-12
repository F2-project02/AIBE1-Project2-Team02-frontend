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
      showToast("과외 신청 수락 되었어요!", partyGif);
      setTimeout(() => {
        onClose();
      }, 150);
    } catch (e) {
      showToast("과외 신청 수락이 실패했어요.", warnGif, "error");
      setApproving(false);
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
          해당 신청을 수락하시겠습니까?
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
              onClick={handleConfirm}
              sx={{ height: "100%", borderRadius: "12px", padding: 0 }}
            >
              수락하기
            </GradientButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
