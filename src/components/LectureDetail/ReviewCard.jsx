import { Box, Typography, Avatar, Rating, Stack, Button } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useUserStore } from "../../store/useUserStore";

export default function ReviewCard({ review }) {
  const { userId: currentUserId } = useUserStore();
  const isMyReview = review.writer.userId === currentUserId;

  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        backgroundColor: "#fff",
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
          <Avatar
            src={review.writer.profileImage}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography
              fontWeight={700}
              fontSize="0.95rem"
              color="var(--text-100)"
            >
              {review.writer.nickname}
            </Typography>
            <Typography fontSize="0.8rem" color="var(--text-400)">
              {timeAgo}
            </Typography>
          </Box>
        </Stack>

        <Rating
          value={review.rating}
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
        {review.content}
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
            삭제하기
          </Button>
        </Stack>
      )}
    </Box>
  );
}
