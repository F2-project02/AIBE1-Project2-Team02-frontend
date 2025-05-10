// src/components/Profile/skeletons/MentorFormViewSkeleton.jsx
import { Box, Skeleton } from "@mui/material";

export default function MentorFormViewSkeleton() {
  return (
    <Box>
      {/* 멘토 프로필 제목 스켈레톤 */}
      <Skeleton
        variant="text"
        width={120}
        height={32}
        sx={{ mb: 3, bgcolor: "var(--bg-200)" }}
        animation="wave"
      />

      {/* 안내 메시지 스켈레톤 */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={60}
        sx={{ mb: 3, borderRadius: "4px", bgcolor: "var(--bg-200)" }}
        animation="wave"
      />

      {/* 자기소개 필드 스켈레톤 */}
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
          height={150}
          sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
      </Box>

      {/* 포트폴리오 업로드 영역 스켈레톤 */}
      <Box sx={{ mb: 3 }}>
        <Skeleton
          variant="text"
          width={100}
          height={24}
          sx={{ mb: 1, bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={80}
          sx={{ borderRadius: "8px", mb: 2, bgcolor: "var(--bg-200)" }}
          animation="wave"
        />

        {/* 파일 미리보기 스켈레톤 */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={60}
          sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
      </Box>

      {/* 저장 버튼 스켈레톤 */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={52}
        sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
        animation="wave"
      />
    </Box>
  );
}
