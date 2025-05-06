// 📄 src/components/LectureDetail/skeleton/LectureInfoBoxSkeleton.jsx

import { Box, Stack, Skeleton } from "@mui/material";

export default function LectureInfoBoxSkeleton() {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 1,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        backgroundColor: "var(--bg-100)",
        minWidth: 280,
        width: "100%",
      }}
    >
      {/* 가격 */}
      <Skeleton variant="text" width={120} height={32} sx={{ mb: 3 }} />

      {/* 수업 요일 */}
      <Stack spacing={1} mb={2}>
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={140} height={20} />
      </Stack>

      {/* 수업 시간 */}
      <Stack spacing={1} mb={2}>
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={160} height={20} />
        <Skeleton variant="text" width={160} height={20} />
      </Stack>

      {/* 지역 */}
      <Stack spacing={1} mb={2}>
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={180} height={20} />
      </Stack>

      {/* 버튼 2개 */}
      <Stack spacing={1.5} mt={3}>
        <Skeleton variant="rounded" width="100%" height={48} />
        <Skeleton variant="rounded" width="100%" height={48} />
      </Stack>
    </Box>
  );
}