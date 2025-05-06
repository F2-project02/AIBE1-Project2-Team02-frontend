// 📄 src/components/Home/ReviewSection/ReviewCardSkeleton.jsx

import { Card, Skeleton, Box } from "@mui/material";

export default function ReviewCardSkeleton() {
  return (
    <Card
      sx={{
        width: 419,
        height: 220,
        backgroundColor: "#FEFEFE",
        borderRadius: "16px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
        outline: "1px solid var(--bg-200)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 3,
      }}
    >
      {/* 상단: 아바타 + 닉네임 + 날짜 + 별점 */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={2}>
          <Skeleton
            variant="circular"
            width={36}
            height={36}
            animation="wave"
            sx={{ bgcolor: "var(--bg-200)" }}
          />
          <Box>
            <Skeleton
              variant="text"
              width={80}
              height={20}
              animation="wave"
              sx={{ bgcolor: "var(--bg-200)" }}
            />
            <Skeleton
              variant="text"
              width={40}
              height={10}
              animation="wave"
              sx={{ bgcolor: "var(--bg-200)", mt: 0.5 }}
            />
          </Box>
        </Box>
        <Skeleton
          variant="text"
          width={80}
          height={20}
          animation="wave"
          sx={{ bgcolor: "var(--bg-200)" }}
        />
      </Box>

      {/* 후기 본문 (3줄 제한 효과 포함) */}
      <Box sx={{ mt: 1.5, mb: 1.5 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="text"
            height={18}
            width={`${90 - i * 10}%`}
            animation="wave"
            sx={{ bgcolor: "var(--bg-200)" }}
          />
        ))}
      </Box>

      {/* 하단: 과외명 + 멘토명 */}
      <Box>
        <Skeleton
          variant="text"
          width={160}
          height={16}
          animation="wave"
          sx={{ bgcolor: "var(--bg-200)", mb: 0.5 }}
        />
        <Skeleton
          variant="text"
          width={100}
          height={14}
          animation="wave"
          sx={{ bgcolor: "var(--bg-200)" }}
        />
      </Box>
    </Card>
  );
}
