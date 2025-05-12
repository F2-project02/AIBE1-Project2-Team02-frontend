import { Box, Stack, Skeleton } from "@mui/material";

export default function LectureHeaderSkeleton() {
  return (
    <Box sx={{ mb: 6 }}>
      {/* 상단 태그 + 토글 */}
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Skeleton
          variant="rounded"
          width={60}
          height={24}
          animation="wave"
          sx={{ bgcolor: "var(--bg-200)" }}
        />
        <Skeleton
          variant="rounded"
          width={60}
          height={24}
          animation="wave"
          sx={{ bgcolor: "var(--bg-200)" }}
        />
        <Skeleton
          variant="circular"
          width={36}
          height={20}
          animation="wave"
          sx={{ bgcolor: "var(--bg-200)" }}
        />
      </Stack>

      {/* 과외 제목 */}
      <Skeleton
        variant="text"
        width="80%"
        height={32}
        animation="wave"
        sx={{ mb: 2, bgcolor: "var(--bg-200)" }}
      />

      {/* 브레드크럼 */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Skeleton
          variant="text"
          width={60}
          height={20}
          animation="wave"
          sx={{ bgcolor: "var(--bg-200)" }}
        />
        <Skeleton
          variant="text"
          width={60}
          height={20}
          animation="wave"
          sx={{ bgcolor: "var(--bg-200)" }}
        />
        <Skeleton
          variant="text"
          width={60}
          height={20}
          animation="wave"
          sx={{ bgcolor: "var(--bg-200)" }}
        />
      </Stack>

      {/* 멘토 정보 */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          animation="wave"
          sx={{ bgcolor: "var(--bg-200)" }}
        />
        <Box>
          <Skeleton
            variant="text"
            width={100}
            height={24}
            animation="wave"
            sx={{ bgcolor: "var(--bg-200)" }}
          />
          <Skeleton
            variant="text"
            width={80}
            height={18}
            animation="wave"
            sx={{ bgcolor: "var(--bg-200)" }}
          />
        </Box>
        <Skeleton
          variant="text"
          width={40}
          height={24}
          animation="wave"
          sx={{ ml: "auto", bgcolor: "var(--bg-200)" }}
        />
      </Stack>
    </Box>
  );
}