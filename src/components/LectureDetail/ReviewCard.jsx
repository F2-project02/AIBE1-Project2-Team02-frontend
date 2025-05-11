// 📄 src/components/LectureDetail/ReviewCard.jsx

import {
  Box,
  Typography,
  Avatar,
  Rating,
  Stack,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { useUserStore } from "../../store/useUserStore";
import { useState } from "react";
import axiosInstance from "../../lib/axiosInstance";

export default function ReviewCard({ review, onReviewUpdated }) {
  const { userId: currentUserId } = useUserStore();
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // 안전 체크 및 기본값
  const reviewId = review?.reviewId || 0;
  const lectureId = review?.lectureId;
  const writerId = review?.writer?.userId || review?.writerId;
  const writerNickname =
    review?.writer?.nickname || review?.writerNickname || "사용자";
  const writerImage =
    review?.writer?.profileImage || "/images/default-profile.svg";
  const content = review?.content || "";
  const rating = review?.rating || 0;

  // 날짜 처리 부분 - 여러 가능한 형식 대응
  let timeAgo = "";
  try {
    let createdAtDate;

    // 백엔드에서 다양한 형식으로 날짜가 올 수 있음
    if (Array.isArray(review?.createdAt)) {
      // [년,월,일,시,분,초] 형식인 경우 - 백엔드에서 LocalDateTime이 배열로 변환된 경우
      const [year, month, day, hour, minute, second] = review.createdAt;
      createdAtDate = new Date(year, month - 1, day, hour, minute, second);
    } else if (typeof review?.createdAt === "string") {
      // ISO 문자열 형식인 경우 ("2025-05-06T17:42:50")
      createdAtDate = new Date(review.createdAt);
    } else {
      // 기본값은 현재 시간
      createdAtDate = new Date();
    }

    // 유효한 날짜인지 확인
    if (!isNaN(createdAtDate.getTime())) {
      timeAgo = formatDistanceToNow(createdAtDate, {
        addSuffix: true,
        locale: ko,
      });
    } else {
      timeAgo = "날짜 정보 없음";
    }
  } catch (error) {
    console.error("날짜 변환 오류:", error, review?.createdAt);
    timeAgo = "날짜 정보 없음";
  }

  // 현재 로그인한 사용자의 리뷰인지 확인
  const isMyReview = writerId === currentUserId;

  // 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  // 삭제 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // 리뷰 삭제 처리
  const handleDeleteReview = async () => {
    try {
      setDeleting(true);

      // API에 삭제 요청
      const response = await axiosInstance.delete(`/api/review/${reviewId}`);

      if (response.data?.success) {
        // 성공적으로 삭제되면 목록 갱신
        setSnackbar({
          open: true,
          message: "리뷰가 성공적으로 삭제됐어요.",
          severity: "success",
        });

        // 부모 컴포넌트에 알림
        if (onReviewUpdated) {
          onReviewUpdated();
        }
      } else {
        throw new Error(response.data?.message || "리뷰 삭제에 실패했어요.");
      }
    } catch (err) {
      console.error("리뷰 삭제 오류:", err);
      setSnackbar({
        open: true,
        message: err.message || "리뷰 삭제 중 문제가 발생했어요.",
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
    <Box
      sx={{
        mb: 3,
        p: 3,
        backgroundColor: "#fefefe",
        borderRadius: "16px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* 상단: 프로필 + 별점 */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={writerImage} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography
              fontWeight={700}
              fontSize="0.95rem"
              color="var(--text-100)"
            >
              {writerNickname}
            </Typography>
            <Typography fontSize="0.8rem" color="var(--text-400)">
              {timeAgo}
            </Typography>
          </Box>
        </Stack>

        <Rating
          value={rating}
          readOnly
          size="medium"
          sx={{
            "& .MuiRating-iconFilled": { color: "#FFB400" },
            fontSize: "1.25rem",
          }}
        />
      </Stack>

      {/* 후기 본문 */}
      <Typography
        variant="body2"
        color="var(--text-200)"
        sx={{ whiteSpace: "pre-line" }}
      >
        {content}
      </Typography>

      {/* 수정/삭제 버튼 - 본인 작성 시만 보이게 */}
      {isMyReview && (
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              color: "var(--text-400)",
              borderColor: "var(--bg-300)",
              px: 3,
              ":hover": {
                backgroundColor: "var(--bg-200)",
              },
            }}
          >
            수정하기
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenDeleteDialog}
            disabled={deleting}
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              backgroundColor: "var(--primary-100)",
              px: 3,
              ":hover": {
                backgroundColor: "var(--primary-200)",
              },
            }}
          >
            {deleting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "삭제하기"
            )}
          </Button>
        </Stack>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          리뷰를 삭제하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            삭제한 리뷰는 복구할 수 없어요. 정말로 삭제하시겠어요?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            취소
          </Button>
          <Button
            onClick={handleDeleteReview}
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : null}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      {/* 스낵바 메시지 */}
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
    </Box>
  );
}
