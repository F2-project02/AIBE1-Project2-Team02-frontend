// src/components/LectureDetail/skeleton/ReviewSectionSkeleton.jsx

import { Box, Skeleton, Stack, Typography } from "@mui/material";

export default function ReviewSectionSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        borderRadius: "16px",
        backgroundColor: "var(--bg-100)",
        border: "none",
      }}
    >
      {/* 작성자 정보 */}
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          animation="wave"
          sx={{ bgcolor: "var(--bg-200)" }}
        />
        <Typography
          fontWeight={600}
          fontSize="0.95rem"
          color="var(--text-100)"
          sx={{ opacity: 0.5 }}
        ></Typography>
        <Skeleton
          variant="rounded"
          width={100}
          height={24}
          animation="wave"
          sx={{ ml: "auto", bgcolor: "var(--bg-200)" }}
        />
      </Stack>

      {/* 텍스트 입력칸 */}
      <Skeleton
        variant="rounded"
        height={96}
        animation="wave"
        sx={{ borderRadius: "8px", mb: 2, bgcolor: "var(--bg-200)" }}
      />
    </Box>
  );
}
