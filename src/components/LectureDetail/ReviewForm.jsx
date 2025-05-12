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
import { getModerationMessage } from "../../utils/moderationHelper";
import axiosInstance from "../../lib/axiosInstance";

export default function ReviewForm({
  lectureId,
  mentorId,
  onReviewSubmitted,
  showToast,
  showErrorToast,
}) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { nickname, profileImage } = useUserStore();

  const handleSubmit = async () => {
    if (!content.trim()) {
      showErrorToast("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(`/api/review`, {
        lectureId,
        mentorId,
        content,
        rating,
      });

      if (response.data?.success) {
        showToast("리뷰가 성공적으로 등록되었어요!"); 

        setContent("");
        setRating(5);
        onReviewSubmitted?.();
      } else {
        throw new Error(response.data?.message || "리뷰 작성에 실패했어요.");
      }
    } catch (err) {
      const reason = err?.response?.data?.message;
      const msg =
        getModerationMessage(reason) ||
        "리뷰 작성 중 문제가 발생했어요. 다시 시도해주세요.";
        showErrorToast(msg); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "transparent", // 배경은 그대로, 보더 없음
        p: 0,
        boxShadow: "none",
      }}
    >
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
          borderRadius: "8px",
          fontFamily: "inherit",
          fontSize: "0.875rem",
          color: "var(--text-200)",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#fefefe",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            color: "var(--text-200)",
            "& fieldset": {
              borderColor: "var(--bg-300)",
            },
            "&:hover fieldset": {
              borderColor: "var(--action-primary-bg)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--action-primary-bg)",
              borderWidth: 2,
            },
          },
        }}
      />

      {/* 등록 버튼 */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          sx={{
            background: "linear-gradient(90deg, #FFBAD0, #5B8DEF)",
            boxShadow: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: "8px",
            color: "var(--bg-100)",
            ":hover": {
              background: "linear-gradient(90deg, #F7A8C3, #4E79DA)",
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
    </Box>
  );
}
