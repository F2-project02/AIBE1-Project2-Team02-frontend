// src/components/LectureDetail/ReviewCard.jsx

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
  TextField,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useUserStore } from "../../store/useUserStore";
import { useState } from "react";
import axiosInstance from "../../lib/axiosInstance";
import CustomToast from "../common/CustomToast";
import thinking from "../../assets/thinking.gif";

export default function ReviewCard({
  review,
  onReviewUpdated,
  showToast,
  showErrorToast,
}) {
  const { userId: currentUserId } = useUserStore();

  // useState는 무조건 상단에서 호출
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [editContent, setEditContent] = useState(review?.content || "");
  const [editRating, setEditRating] = useState(review?.rating || 0);

  // useState 밑에서 return null 처리
  if (!review?.reviewId) return null;
  const reviewId = review.reviewId;

  const writerId = review?.writer?.userId || review?.writerId;
  const writerNickname =
    review.writerNickname || review.writer?.nickname || "사용자";
  const writerImage =
    review.writerProfileImage ||
    review.writer?.profileImage ||
    "/images/default-profile.svg";
  const content = review?.content || "";
  const rating = review?.rating || 0;

  const isMyReview = writerId === currentUserId;

  let timeAgo = "날짜 정보 없음";
  try {
    const updatedAt = review.updatedAt;
    let date = Array.isArray(updatedAt)
      ? new Date(...[updatedAt[0], updatedAt[1] - 1, ...updatedAt.slice(2)])
      : new Date(updatedAt);
    if (!isNaN(date)) {
      timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: ko });
    }
  } catch (_) {
    // Intentionally left empty to handle errors silently
  }

  const handleEditClose = () => {
    setEditOpen(false);
    setEditContent(content);
    setEditRating(rating);
  };

  const handleEditSave = async () => {
    try {
      await axiosInstance.patch(`/api/review/${reviewId}`, {
        content: editContent,
        rating: editRating,
      });
      showToast("리뷰를 성공적으로 수정했어요!");
      onReviewUpdated?.();
    } catch {
      showErrorToast("수정에 실패했어요. 다시 시도해보실래요?");
    } finally {
      setEditOpen(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      setDeleting(true);
      const res = await axiosInstance.delete(`/api/review/${reviewId}`);
      if (res.data?.success) {
        showToast("리뷰가 성공적으로 삭제되었어요.");
        onReviewUpdated?.();
      } else {
        throw new Error(res.data?.message || "리뷰 삭제에 실패했어요.");
      }
    } catch (err) {
      showErrorToast(err.message || "리뷰 삭제 중 문제가 발생했어요.");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
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
      {/* 상단 */}
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
          value={editOpen ? editRating : rating}
          readOnly={!editOpen}
          size="medium"
          onChange={(e, v) => setEditRating(v)}
          sx={{
            "& .MuiRating-iconFilled": { color: "#FFB400" },
            fontSize: "1.25rem",
          }}
        />
      </Stack>

      {/* 본문 */}
      {editOpen ? (
        <>
          <TextField
            fullWidth
            multiline
            minRows={3}
            variant="standard"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: {
                borderRadius: "12px",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                color: "var(--text-200)",
              },
            }}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={handleEditClose}
              sx={{
                color: "var(--text-300)",
                fontWeight: 500,
                px: 3,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "var(--bg-200)" },
              }}
            >
              취소
            </Button>
            <Button
              onClick={handleEditSave}
              sx={{
                background: "linear-gradient(90deg, #FFBAD0, #5B8DEF)",
                boxShadow: "none",
                fontWeight: 500,
                px: 3,
                borderRadius: "8px",
                color: "var(--bg-100)",
                "&:hover": {
                  background: "linear-gradient(90deg, #F7A8C3, #4E79DA)",
                },
              }}
            >
              저장
            </Button>
          </Stack>
        </>
      ) : (
        <Typography
          variant="body2"
          color="var(--text-200)"
          sx={{ whiteSpace: "pre-line" }}
        >
          {content}
        </Typography>
      )}

      {/* 버튼 */}
      {isMyReview && !editOpen && (
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button
            variant="outlined"
            onClick={() => setEditOpen(true)}
            sx={{
              borderRadius: "8px",
              fontWeight: 500,
              color: "var(--text-300)",
              border: "none",
              px: 3,
              ":hover": { backgroundColor: "var(--bg-200)" },
            }}
          >
            수정하기
          </Button>
          <Button
            variant="contained"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={deleting}
            sx={{
              backgroundColor: "var(--action-red)",
              color: "var(--bg-100)",
              fontWeight: 500,
              px: 3,
              borderRadius: "8px",
              boxShadow: "none",
              ":hover": { backgroundColor: "#b33e3e" },
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

      {/* 삭제 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            px: 4,
            py: 3,
            backgroundColor: "var(--bg-100)",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 600, fontSize: "1.1rem", textAlign: "center" }}
        >
          정말 삭제하시겠어요?
        </DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={thinking}
            alt="삭제 경고"
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
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "var(--text-300)",
              fontWeight: 600,
              px: 3,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "var(--bg-200)" },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleDeleteReview}
            variant="contained"
            disabled={deleting}
            sx={{
              backgroundColor: "var(--action-red)",
              boxShadow: "none",
              fontWeight: 600,
              px: 3,
              borderRadius: "8px",
              color: "var(--bg-100)",
              "&:hover": { backgroundColor: "#b33e3e" },
            }}
          >
            삭제하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
