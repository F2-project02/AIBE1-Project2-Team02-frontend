import { Box, Card, Skeleton, Stack } from "@mui/material";

export default function ApplicationItemSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.04)",
        p: 2,
      }}
    >
      {/* 프로필 */}
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box>
          <Skeleton width={80} height={18} />
          <Skeleton width={60} height={14} />
        </Box>
      </Stack>

      {/* 강의명 */}
      <Skeleton width="80%" height={24} sx={{ mb: 2 }} />

      {/* 버튼 */}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Skeleton variant="rounded" width={80} height={30} />
        <Skeleton variant="rounded" width={80} height={30} />
      </Box>
    </Card>
  );
}
