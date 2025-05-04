// 📄 src/components/CourseSection/CourseCardSkeleton.jsx

import { Box, Skeleton, Stack } from "@mui/material";

export default function CourseCardSkeleton() {
  return (
    <Box
      sx={{
        border: "none",
        p: 2,
        width: 300,
      }}
    >
      {/* 상단: 프로필 라인 */}
      <Stack direction="row" alignItems="center" spacing={1} mb={1} animation="wave">
        <Skeleton variant="circular" width={32} height={32} animation="wave" />
        <Skeleton variant="text" width={80} height={20} animation="wave"/>
        <Skeleton variant="text" width={30} height={20} animation="wave"/>
      </Stack>

      {/* 중단: 뱃지 라인 */}
      <Stack direction="row" spacing={1} mb={1} animation="wave">
        <Skeleton variant="rounded" width={60} height={24} animation="wave" />
        <Skeleton variant="rounded" width={80} height={24} animation="wave" />
      </Stack>

      {/* 과외 제목 */}
      <Skeleton variant="text" height={24} width="90%" sx={{ mb: 0.5 }} animation="wave" />
      <Skeleton variant="text" height={24} width="80%" sx={{ mb: 1 }} animation="wave"/>

      {/* 수업료 */}
      <Skeleton variant="text" height={20} width="60%" animation="wave"/>
    </Box>
  );
}
