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

  // 강의 삭제 처리 - 응답 처리 개선
  const handleDelete = async () => {
    try {
      setDeleting(true);

      // 강의 ID 확인
      if (!lecture || !lecture.lectureId) {
        throw new Error("유효한 강의 ID가 없습니다.");
      }

      console.log(`강의 삭제 시도: ID ${lecture.lectureId}`);

      // API 호출하여 강의 삭제
      const response = await deleteLecture(lecture.lectureId);

      console.log("삭제 응답:", response);

      // 응답 상태가 없더라도 성공 처리 (백엔드 이슈 우회)
      // HTTP 상태가 2xx이면 성공으로 간주
      const isSuccess = response.success !== false;

      if (isSuccess) {
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
        // 백엔드에서 명시적인 실패 응답이 온 경우
        throw new Error(response?.message || "강의 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("강의 삭제 오류:", err);

      // 하지만 실제로는 삭제가 되었을 수 있으므로 더 중립적인 메시지 표시
      setSnackbar({
        open: true,
        message:
          "응답을 받지 못했지만 강의가 삭제되었을 수 있습니다. 확인해주세요.",
        severity: "warning",
      });

      // 실패 시에도 홈으로 리다이렉트 (실제로는 삭제가 성공했을 가능성)
      setTimeout(() => {
        navigate("/");
      }, 2500);
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
            {lecture?.lectureTitle || "이 강의"}를 삭제하시면 복구할 수
            없습니다.
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
            variant="contained"
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
