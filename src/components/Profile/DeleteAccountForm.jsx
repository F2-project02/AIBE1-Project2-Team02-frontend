// src/components/Profile/DeleteAccountForm.jsx
import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import DeleteAccountModal from "./DeleteAccountModal";
import { deleteAccount } from "../../lib/api/profileApi";
import { useUserStore } from "../../store/useUserStore";
import sadGif from "../../assets/cryingface.gif";
import warnGif from "../../assets/warn.gif";

export default function DeleteAccountForm({ showToast }) {
  const [modalOpen, setModalOpen] = useState(false);
  const logout = useUserStore((state) => state.logout);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount();
      showToast("회원 탈퇴가 완료되었습니다. 홈으로 이동합니다.", sadGif);
      logout();
      window.location.href = "/";
    } catch (error) {
      console.error("회원 탈퇴 오류:", error);
      showToast(
        "회원 탈퇴 중 오류가 발생했습니다: " + error.message,
        warnGif,
        "error"
      );
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "var(--action-red-bg)",
          p: 3,
          borderRadius: "8px",
          mb: 4,
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: "var(--action-red)", fontWeight: 500, mb: 2 }}
        >
          회원 탈퇴 시 유의사항
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--text-300)", mb: 1, lineHeight: 1.6 }}
        >
          • 모든 계정 정보가 삭제되며 복구할 수 없습니다.
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--text-300)", mb: 1, lineHeight: 1.6 }}
        >
          • 작성하신 댓글과 후기는 삭제되지 않으며, '탈퇴한 사용자'로
          표시됩니다.
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--text-300)", lineHeight: 1.6 }}
        >
          • 진행 중인 과외가 있다면 먼저 종료 후 탈퇴해 주세요.
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={handleOpenModal}
        sx={{
          width: "100%",
          py: 1.5,
          backgroundColor: "var(--action-red)",
          color: "white",
          fontWeight: 600,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(204, 105, 105, 0.9)",
          },
        }}
      >
        회원 탈퇴
      </Button>

      <DeleteAccountModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
