// 📄 src/components/LectureDetail/skeleton/LectureInfoSkeleton.jsx

import { Box, Skeleton } from "@mui/material";

export default function LectureInfoSkeleton() {
  return (
    <Box>
      {/* 섹션 제목 (강의 소개) */}
      <Skeleton
        variant="text"
        width={100}
        height={30}
        sx={{ mb: 2 }}
        animation="wave"
      />

      {/* 강의 소개 본문 3줄 정도 */}
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          variant="text"
          width={`${90 - i * 10}%`}
          height={20}
          sx={{ mb: 1.5 }}
          animation="wave"
        />
      ))}
    </Box>
  );
}