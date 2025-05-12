// 📄 src/components/LectureDetail/skeleton/LectureInfoSkeleton.jsx

import { Box, Skeleton } from "@mui/material";

export default function LectureInfoSkeleton() {
  return (
    <Box>
      {/* 센스젠 제목 (강의 소개) */}
      <Skeleton
        variant="text"
        width={100}
        height={30}
        animation="wave"
        sx={{ mb: 2, bgcolor: "var(--bg-200)" }}
      />

      {/* 강의 소개 본문 3줄 정도 */}
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          variant="text"
          width={`${90 - i * 10}%`}
          height={20}
          animation="wave"
          sx={{ mb: 1.5, bgcolor: "var(--bg-200)" }}
        />
      ))}
    </Box>
  );
}