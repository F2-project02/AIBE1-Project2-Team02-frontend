// src/components/LectureDetail/LectureEditControls.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteLecture } from "../../lib/api/lectureApi";
import CustomToast from "../common/CustomToast";
import thinkingFace from "../../assets/thinking.gif";
import successEmoji from "../../assets/heartsmile.gif";
import warningEmoji from "../../assets/warn.gif";

export default function LectureEditControls({ lecture }) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info",
    icon: null,
  });

  const handleEdit = () => {
    navigate(`/lectures/${lecture.lectureId}/edit`);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      if (!lecture || !lecture.lectureId)
        throw new Error("유효한 강의 ID가 없어요.");
      const response = await deleteLecture(lecture.lectureId);
      const isSuccess = response.success !== false;

      if (isSuccess) {
        setToast({
          open: true,
          message: "강의가 성공적으로 삭제되었어요.",
          type: "info",
          icon: successEmoji,
        });
        setTimeout(() => navigate("/"), 1500);
      } else {
        throw new Error(response?.message || "강의 삭제에 실패했어요.");
      }
    } catch (err) {
      setToast({
        open: true,
        message:
          "응답을 받지 못했지만 강의가 삭제되었을 수 있어요. 확인해주세요.",
        type: "info",
        icon: warningEmoji,
      });
      setTimeout(() => navigate("/"), 2500);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseToast = () => setToast({ ...toast, open: false });

  return (
    <>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          sx={{
            borderRadius: "8px",
            fontWeight: 600,
            color: "var(--text-300)",
            borderColor: "var(--bg-300)",
            "&:hover": {
              backgroundColor: "var(--bg-200)",
              borderColor: "var(--bg-300)",
            },
          }}
        >
          수정
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={handleOpenDeleteDialog}
          sx={{
            borderRadius: "8px",
            fontWeight: 600,
            backgroundColor: "var(--action-red)",
            color: "var(--bg-100)",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#b33e3e" },
          }}
        >
          삭제
        </Button>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            backgroundColor: "var(--bg-100)",
            px: 4,
            py: 2,
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 600, fontSize: "1.2rem", color: "var(--text-100)" }}
        >
          강의를 삭제하시겠어요?
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
            onClick={handleCloseDeleteDialog}
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
              fontWeight: 600,
              px: 3,
              borderRadius: "8px",
              color: "var(--bg-100)",
              "&:hover": { backgroundColor: "rgba(204, 105, 105, 0.9)" },
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

      <CustomToast
        open={toast.open}
        onClose={handleCloseToast}
        message={toast.message}
        type={toast.type}
        iconSrc={toast.icon}
        duration={4000}
      />
    </>
  );
}