import { Box, Skeleton, Stack } from "@mui/material";

export default function RequestedInquirySkeleton() {
  return (
    <Box
      sx={{
        border: "none",
        p: 2,
        width: 500,
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* 프로필 */}
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Skeleton variant="circular" width={32} height={32} animation="wave" />
        <Skeleton variant="text" width={80} height={20} animation="wave" />
        <Skeleton variant="text" width={30} height={20} animation="wave" />
      </Stack>

      {/* 뱃지 */}
      <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
        <Skeleton variant="rounded" width={60} height={24} animation="wave" />
        <Skeleton variant="rounded" width={80} height={24} animation="wave" />
        <Skeleton variant="rounded" width={50} height={24} animation="wave" />
      </Stack>

      {/* 제목 + 상태 Chip 위치 */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Skeleton variant="text" height={24} width="75%" animation="wave" />
        <Skeleton variant="rounded" width={70} height={30} animation="wave" />
      </Stack>

      {/* 수업료 */}
      <Skeleton variant="text" height={20} width="40%" animation="wave" />
    </Box>
  );
}
