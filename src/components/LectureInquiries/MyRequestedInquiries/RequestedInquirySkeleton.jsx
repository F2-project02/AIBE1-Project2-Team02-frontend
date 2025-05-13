import { Box, Skeleton, Stack } from "@mui/material";

export default function RequestedInquirySkeleton() {
  const skeletonStyle = {
    backgroundColor: "var(--bg-200)",
  };

  return (
    <Box
      sx={{
        border: "none",
        p: 2,
        width: "100%",
        maxWidth: 400,
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* 프로필 */}
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          animation="wave"
          sx={skeletonStyle}
        />
        <Skeleton
          variant="text"
          width={80}
          height={20}
          animation="wave"
          sx={skeletonStyle}
        />
        <Skeleton
          variant="text"
          width={30}
          height={20}
          animation="wave"
          sx={skeletonStyle}
        />
      </Stack>

      {/* 뱃지 */}
      <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
        <Skeleton
          variant="rounded"
          width={60}
          height={24}
          animation="wave"
          sx={skeletonStyle}
        />
        <Skeleton
          variant="rounded"
          width={80}
          height={24}
          animation="wave"
          sx={skeletonStyle}
        />
        <Skeleton
          variant="rounded"
          width={50}
          height={24}
          animation="wave"
          sx={skeletonStyle}
        />
      </Stack>

      {/* 제목 + 상태 Chip 위치 */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        width="100%"
      >
        {/* 제목 Skeleton (좌측) */}
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <Skeleton
            variant="text"
            height={24}
            animation="wave"
            sx={{
              ...skeletonStyle,
              width: "100%", // Box 기준
            }}
          />
        </Box>

        {/* 상태 Chip Skeleton (우측) */}
        <Skeleton
          variant="rounded"
          width={70}
          height={30}
          animation="wave"
          sx={skeletonStyle}
        />
      </Stack>

      {/* 수업료 */}
      <Skeleton
        variant="text"
        height={20}
        width="40%"
        animation="wave"
        sx={skeletonStyle}
      />
    </Box>
  );
}
