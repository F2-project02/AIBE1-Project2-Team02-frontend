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
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteLecture } from "../../lib/api/lectureApi";

export default function LectureEditControls({ lecture }) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // 편집 페이지로 이동
  const handleEdit = () => {
    navigate(`/lectures/${lecture.lectureId}/edit`);
  };

  // 삭제 확인 다이얼로그 열기
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  // 삭제 확인 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // 강의 삭제 처리
  const handleDelete = async () => {
    try {
      setDeleting(true);

      // API 호출하여 강의 삭제
      const response = await deleteLecture(lecture.lectureId);

      if (response && response.success) {
        // 성공 메시지
        setSnackbar({
          open: true,
          message: "강의가 성공적으로 삭제되었습니다.",
          severity: "success",
        });

        // 삭제 후 홈으로 리다이렉트 (약간의 지연을 줘서 메시지 확인 가능하도록)
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error(response?.message || "강의 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("강의 삭제 오류:", err);
      setSnackbar({
        open: true,
        message: err.message || "강의 삭제 중 문제가 발생했습니다.",
        severity: "error",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // 스낵바 닫기
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
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
            color: "white",
            "&:hover": {
              backgroundColor: "#b33e3e",
            },
          }}
        >
          삭제
        </Button>
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          강의를 삭제하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText color="var(--text-300)">
            강의를 삭제하시면 복구할 수 없습니다.
            <br />
            정말로 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              color: "var(--text-300)",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "var(--bg-200)",
              },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            sx={{
              backgroundColor: "var(--action-red)",
              color: "white",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#b33e3e",
              },
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

      {/* 알림 메시지 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
