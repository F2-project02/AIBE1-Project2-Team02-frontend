import { Box, Typography, Avatar, Rating, Stack } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export default function ReviewCard({ review }) {
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
        {/* 유저 정보 */}
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

        {/* 별점 */}
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
    </Box>
  );
}