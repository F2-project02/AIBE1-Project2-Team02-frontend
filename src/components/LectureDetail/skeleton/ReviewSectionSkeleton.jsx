// 📄 src/components/LectureDetail/skeleton/ReviewSectionSkeleton.jsx

import { Box, Skeleton, Stack } from "@mui/material";

export default function ReviewSectionSkeleton() {
  return (
    <Box>
      {/* 후기 작성 폼 스켈레톤 */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={80} height={24} />
          </Stack>
          <Skeleton variant="rounded" width={120} height={32} />
        </Stack>
        <Skeleton variant="rounded" height={96} />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Skeleton variant="rounded" width={100} height={36} />
        </Box>
      </Box>

      {/* 후기 카드 스켈레톤 2개 */}
      {[1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            mb: 3,
            p: 3,
            backgroundColor: "#fefefe",
            borderRadius: "16px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Box>
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton variant="text" width={60} height={18} />
              </Box>
            </Stack>
            <Skeleton variant="text" width={80} height={20} />
          </Stack>
          <Skeleton variant="text" height={20} width="100%" />
          <Skeleton variant="text" height={20} width="90%" />
        </Box>
      ))}
    </Box>
  );
}