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
import heartsmile from "../../assets/heartsmile.gif";
import warn from "../../assets/warn.gif";

export default function ReviewForm({ lectureId, mentorId, onReviewAdded, showToast }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
       `/api/review`,
       {
         lectureId: lectureId,
         mentorId : mentorId,    // 상위 컴포넌트에서 내려야 함
         content  : content,
         rating   : rating
       }
     );

      if (response.data?.success) {
        // 성공 메시지 표시
        showToast({
          open: true,
          message: "리뷰가 성공적으로 등록되었어요!",
          type:    "info",
          iconSrc: heartsmile,
        });
        // 입력값 초기화
        setContent("");
        setRating(5);
        // 부모 컴포넌트에 리뷰 추가 알림
        if (onReviewAdded) {
          onReviewAdded({
            reviewId: response.data.data,
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
        throw new Error(response.data?.message || "리뷰 작성에 실패했어요.");
      }
    } catch (err) {
      const reason = err?.response?.data?.message;
      const friendlyMessage = getModerationMessage(reason);
      const msg = friendlyMessage || "리뷰 작성 중 문제가 발생했어요. 다시 시도해주세요.";
      showToast({
        open: true,
        message: msg,
        type:    "error",
        iconSrc: warn,
      });
    } finally {
      setLoading(false);
    }
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
    </Box>
  );
}
