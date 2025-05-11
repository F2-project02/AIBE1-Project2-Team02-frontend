// src/components/Profile/skeletons/ProfileCardSkeleton.jsx
import { Box, Skeleton } from "@mui/material";

export default function ProfileCardSkeleton() {
  return (
    <Box
      sx={{
        p: 3,
        mb: 3,
        borderRadius: "8px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        backgroundColor: "var(--bg-100)",
      }}
    >
      {/* 프로필 이미지 스켈레톤 */}
      <Skeleton
        variant="circular"
        width={50}
        height={50}
        sx={{ mr: 2, bgcolor: "var(--bg-200)" }}
        animation="wave"
      />

      <Box>
        {/* 닉네임 스켈레톤 */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Skeleton
            variant="text"
            width={120}
            height={24}
            sx={{ bgcolor: "var(--bg-200)" }}
            animation="wave"
          />
          {/* 인증 아이콘 스켈레톤 */}
          <Skeleton
            variant="circular"
            width={18}
            height={18}
            sx={{ ml: 1, bgcolor: "var(--bg-200)" }}
            animation="wave"
          />
        </Box>

        {/* 학교/지역 스켈레톤 */}
        <Skeleton
          variant="text"
          width={150}
          height={20}
          sx={{ mt: 0.5, bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
      </Box>

      {/* 별점 스켈레톤 */}
      <Box
        sx={{
          ml: "auto",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="text"
          width={60}
          height={24}
          sx={{ bgcolor: "var(--bg-200)" }}
          animation="wave"
        />
      </Box>
    </Box>
  );
}
