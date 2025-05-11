// src/components/Profile/skeletons/MentorFormViewSkeleton.jsx
import { Box, Skeleton } from "@mui/material";

export default function MentorFormViewSkeleton() {
  return (
    <Box>
      {/* 로고 및 환영 메시지 스켈레톤 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 5,
        }}
      >
        {/* 로고 스켈레톤 */}
        <Skeleton
          variant="circular"
          width={100}
          height={100}
          sx={{ mb: 3, bgcolor: "var(--bg-200)" }}
          animation="wave"
        />

        {/* 제목 스켈레톤 */}
        <Skeleton
          variant="text"
          width={300}
          height={38}
          sx={{ mb: 2, bgcolor: "var(--bg-200)" }}
          animation="wave"
        />

        {/* 부제목 스켈레톤 */}
        <Skeleton
          variant="text"
          width={350}
          height={24}
          sx={{ bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
      </Box>

      {/* 학력 필드 스켈레톤 */}
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
          height={60}
          sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
      </Box>

      {/* 자기소개 필드 스켈레톤 */}
      <Box sx={{ mb: 4 }}>
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
          height={150}
          sx={{ borderRadius: "8px", bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
      </Box>

      {/* 포트폴리오 업로드 영역 스켈레톤 */}
      <Box sx={{ mb: 4 }}>
        <Skeleton
          variant="text"
          width={120}
          height={24}
          sx={{ mb: 1, bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={180}
          sx={{
            borderRadius: "8px",
            mb: 2,
            bgcolor: "var(--bg-200)",
            borderStyle: "dashed",
            borderWidth: 2,
            borderColor: "var(--bg-300)",
          }}
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
