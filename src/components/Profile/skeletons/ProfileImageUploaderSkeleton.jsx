// src/components/Profile/ProfileImageUploaderSkeleton.jsx
import { Box, Skeleton } from "@mui/material";

export default function ProfileImageUploaderSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        mb: 6,
      }}
    >
      {/* 프로필 이미지 스켈레톤 */}
      <Skeleton
        variant="circular"
        width={120}
        height={120}
        animation="wave"
        sx={{
          mb: 2,
          bgcolor: "var(--bg-200)",
        }}
      />

      {/* 이미지 변경 버튼 스켈레톤 */}
      <Skeleton
        variant="rectangular"
        width={180}
        height={38}
        animation="wave"
        sx={{
          mt: 2,
          borderRadius: "8px",
          bgcolor: "var(--bg-200)",
        }}
      />
    </Box>
  );
}
