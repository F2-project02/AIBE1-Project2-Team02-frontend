// src/components/Profile/skeletons/DeleteAccountFormSkeleton.jsx
import { Box, Skeleton } from "@mui/material";

export default function DeleteAccountFormSkeleton() {
  return (
    <Box>
      {/* 회원 탈퇴 제목 스켈레톤 */}
      <Skeleton
        variant="text"
        width={120}
        height={32}
        sx={{ mb: 3, bgcolor: "var(--bg-200)" }}
        animation="wave"
      />

      {/* 유의사항 박스 스켈레톤 */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={160}
        sx={{
          mb: 4,
          borderRadius: "8px",
          bgcolor: "var(--bg-200)",
          opacity: 0.7, // 약간 투명하게
        }}
        animation="wave"
      />

      {/* 탈퇴 버튼 스켈레톤 */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={52}
        sx={{
          borderRadius: "8px",
          bgcolor: "var(--bg-200)",
          opacity: 0.7,
        }}
        animation="wave"
      />
    </Box>
  );
}
