// src/components/Profile/skeletons/ProfileFormSkeleton.jsx
import { Box, Skeleton, Stack } from "@mui/material";

export default function ProfileFormSkeleton() {
  return (
    <Box>
      {/* 제목 스켈레톤 */}
      <Skeleton
        variant="text"
        width={120}
        height={32}
        sx={{ mb: 3, bgcolor: "var(--bg-200)" }}
        animation="wave"
      />

      {/* 닉네임 필드 스켈레톤 */}
      <Box sx={{ mb: 3 }}>
        <Skeleton
          variant="text"
          width={80}
          height={24}
          sx={{ mb: 1, bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={56}
            sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={56}
            sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
            animation="wave"
          />
        </Box>
      </Box>

      {/* 생년월일 필드 스켈레톤 */}
      <Box sx={{ mb: 3 }}>
        <Skeleton
          variant="text"
          width={80}
          height={24}
          sx={{ mb: 1, bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={56}
          sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
      </Box>

      {/* 성별 필드 스켈레톤 */}
      <Box sx={{ mb: 3 }}>
        <Skeleton
          variant="text"
          width={80}
          height={24}
          sx={{ mb: 1, bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
        <Stack direction="row" spacing={2}>
          <Skeleton
            variant="rectangular"
            width={80}
            height={40}
            sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            width={80}
            height={40}
            sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
            animation="wave"
          />
        </Stack>
      </Box>

      {/* 지역 필드 스켈레톤 */}
      <Box sx={{ mb: 4 }}>
        <Skeleton
          variant="text"
          width={80}
          height={24}
          sx={{ mb: 1, bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          width={170}
          height={56}
          sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
          animation="wave"
        />

        {/* 선택된 지역 칩 스켈레톤 */}
        <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
          {[1, 2].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={120}
              height={32}
              sx={{ borderRadius: "50px", bgcolor: "var(--bg-200)" }}
              animation="wave"
            />
          ))}
        </Box>
      </Box>

      {/* MBTI 필드 스켈레톤 */}
      <Box sx={{ mb: 4 }}>
        <Skeleton
          variant="text"
          width={80}
          height={24}
          sx={{ mb: 1, bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={56}
          sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
      </Box>

      {/* 등록 버튼 스켈레톤 */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={56}
        sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
        animation="wave"
      />
    </Box>
  );
}
