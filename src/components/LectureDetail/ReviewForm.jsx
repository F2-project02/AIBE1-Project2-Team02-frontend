// 📄 src/components/LectureDetail/ReviewForm.jsx

import {
  Box,
  TextField,
  Button,
  Rating,
  Stack,
  Avatar,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import axiosInstance from "../../lib/axiosInstance";

export default function ReviewForm({ lectureId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { nickname, profileImage, userId } = useUserStore();

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 리뷰 작성 API 호출
      const response = await axiosInstance.post(
        `/api/lectures/${lectureId}/reviews`,
        {
          content: content,
          rating: rating,
        }
      );

      if (response.data?.success) {
        // 성공 메시지 표시
        setSuccess(true);
        // 입력값 초기화
        setContent("");
        setRating(5);
        // 부모 컴포넌트에 리뷰 추가 알림
        if (onReviewAdded) {
          onReviewAdded({
            content,
            rating,
            createdAt: new Date().toISOString(),
            writer: {
              userId,
              nickname,
              profileImage,
            },
          });
        }
      } else {
        throw new Error(response.data?.message || "리뷰 작성에 실패했습니다.");
      }
    } catch (err) {
      console.error("리뷰 작성 오류:", err);
      setError(
        err.message || "리뷰 작성 중 문제가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  // 성공 메시지 닫기
  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  // 에러 메시지 닫기
  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box>
      {/* 유저 정보 + 별점 */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={profileImage} sx={{ width: 40, height: 40 }} />
          <Typography
            fontWeight={600}
            fontSize="0.95rem"
            color="var(--text-100)"
          >
            {nickname}
          </Typography>
        </Stack>

        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          sx={{
            "& .MuiRating-iconFilled": { color: "#FFB400" },
            fontSize: "1.25rem",
          }}
        />
      </Stack>

      {/* 후기 입력창 */}
      <TextField
        fullWidth
        multiline
        minRows={3}
        placeholder="여러분의 수업 후기를 남겨주세요!"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        sx={{
          backgroundColor: "#fefefe",
          borderColor: "var(--bg-200)",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
      />

      {/* 등록 버튼 */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          sx={{
            backgroundColor: "var(--primary-100)",
            borderRadius: "8px",
            color: "var(--bg-100)",
            px: 3,
            py: 1,
            fontWeight: 600,
            ":hover": {
              backgroundColor: "var(--primary-200)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "등록하기"
          )}
        </Button>
      </Box>

      {/* 성공 메시지 Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          리뷰가 성공적으로 등록되었습니다!
        </Alert>
      </Snackbar>

      {/* 에러 메시지 Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
