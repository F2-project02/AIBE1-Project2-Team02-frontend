// 📄 src/components/LectureDetail/skeleton/CurriculumSectionSkeleton.jsx

import { Box, Skeleton, Typography } from "@mui/material";

export default function CurriculumSectionSkeleton() {
  return (
    <Box sx={{ mt: 4 }}>
      {/* 섹션 제목 */}
      <Skeleton
        variant="text"
        width={100}
        height={30}
        animation="wave"
        sx={{ mb:2, bgcolor: "var(--bg-200)" }}
      />

      {/* 커리큘럼 항목 4줄 정도 */}
      {[1, 2, 3, 4].map((i) => (
        <Skeleton
          key={i}
          variant="text"
          width="80%"
          height={22}
          animation="wave"
          sx={{ mb: 1.5, bgcolor: "var(--bg-200)" }}
        />
      ))}
    </Box>
  );
}