import { Box, Skeleton } from "@mui/material";

export default function MessageRowMobileSkeleton() {
  const skeletonSx = { bgcolor: "var(--bg-200)", animation: "wave" };

  return (
    <Box
      display="flex"
      flexDirection="column"
      px={2}
      py={2}
      borderBottom="1px solid var(--bg-200)"
      bgcolor="var(--bg-100)"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <Skeleton variant="circular" width={18} height={18} sx={skeletonSx} />
          <Skeleton variant="text" width={80} height={20} sx={skeletonSx} />
        </Box>
        <Skeleton variant="text" width={60} height={20} sx={skeletonSx} />
      </Box>
      <Skeleton
        variant="text"
        width="100%"
        height={20}
        sx={{ mt: 1, skeletonSx }}
      />
    </Box>
  );
}
