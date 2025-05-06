// 📄 src/components/LectureDetail/skeleton/LectureHeaderSkeleton.jsx

import { Box, Stack, Skeleton } from "@mui/material";

export default function LectureHeaderSkeleton() {
  return (
    <Box sx={{ mb: 6 }}>
      {/* 상단 태그 + 토글 */}
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="circular" width={36} height={20} />
      </Stack>

      {/* 과외 제목 */}
      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />

      {/* 브레드크럼 */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Skeleton variant="text" width={60} height={20} />
        <Skeleton variant="text" width={60} height={20} />
        <Skeleton variant="text" width={60} height={20} />
      </Stack>

      {/* 멘토 정보 */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box>
          <Skeleton variant="text" width={100} height={24} />
          <Skeleton variant="text" width={80} height={18} />
        </Box>
        <Skeleton variant="text" width={40} height={24} sx={{ ml: "auto" }} />
      </Stack>
    </Box>
  );
}
