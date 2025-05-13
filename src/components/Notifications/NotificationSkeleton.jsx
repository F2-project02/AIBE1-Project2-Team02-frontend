import { Box, Skeleton, Stack } from "@mui/material";

export default function NotificationSkeleton() {
  const skeletonStyle = {
    backgroundColor: "var(--bg-200)",
  };

  return (
    <Box
      sx={{
        bgcolor: "var(--bg-100)",
        m: 2,
        px: 2,
        py: 2,
        borderRadius: "12px",
        minHeight: 130,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* 프로필 영역 */}
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          animation="wave"
          sx={skeletonStyle}
        />
        <Box>
          <Skeleton
            variant="text"
            width={80}
            height={18}
            animation="wave"
            sx={skeletonStyle}
          />
          <Skeleton
            variant="text"
            width={50}
            height={14}
            animation="wave"
            sx={{ ...skeletonStyle, mt: 0.5 }}
          />
        </Box>
      </Stack>

      {/* 알림 메시지 영역 */}
      <Skeleton
        variant="text"
        width="90%"
        height={18}
        animation="wave"
        sx={skeletonStyle}
      />
      <Skeleton
        variant="text"
        width="75%"
        height={18}
        animation="wave"
        sx={{ ...skeletonStyle, mt: 1 }}
      />
    </Box>
  );
}
