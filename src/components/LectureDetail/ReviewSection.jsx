// 📄 src/components/LectureDetail/ReviewSection.jsx

import { Box, Typography, Divider } from "@mui/material";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { useUserStore } from "../../store/useUserStore";

export default function ReviewSection({ reviews }) {
  const { role } = useUserStore();
  const isMentee = role === "MENTEE";

  // Add safety check for reviews
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <Box>
      {/* 후기 작성 영역 */}
      {isMentee && (
        <Box
          sx={{
            mt: 4,
            mb: 4,
          }}
        >
          <ReviewForm />
        </Box>
      )}

      {/* 후기 리스트 */}
      <Box>
        {safeReviews.length > 0 ? (
          safeReviews.map((review) => (
            <ReviewCard key={review.reviewId} review={review} />
          ))
        ) : (
          <Typography variant="body2" color="var(--text-300)">
            아직 등록된 후기가 없습니다.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
