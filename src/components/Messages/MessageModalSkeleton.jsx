// src/components/Messages/MessageModalSkeleton.jsx

import {
  Box,
  Typography,
  Skeleton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function MessageModalSkeleton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const skeletonSx = { bgcolor: "var(--bg-200)", animation: "wave" };

  return (
    <Box
      sx={{
        width: isMobile ? "100vw" : 500,
        height: isMobile ? "100dvh" : "auto",
        maxHeight: isMobile ? "100dvh" : "80vh",
        overflowY: "auto",
        bgcolor: "var(--bg-100)",
        borderRadius: isMobile ? 0 : "16px",
        p: 4.5,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: 6,
        outline: "none",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* 제목 */}
      <Skeleton
        width="40%"
        height={32}
        sx={{ skeletonSx, mx: "auto", mb: 4 }}
      />

      {/* 보낸 사람/시간 */}
      <Stack spacing={2} mb={3}>
        <Skeleton variant="text" width="60%" height={24} sx={skeletonSx} />
        <Skeleton variant="text" width="40%" height={24} sx={skeletonSx} />
      </Stack>

      {/* 내용 */}
      <Skeleton
        variant="rectangular"
        height={200}
        sx={{ borderRadius: 2, mb: 3, skeletonSx }}
      />

      {/* 버튼 */}
      <Skeleton
        variant="rectangular"
        height={52}
        sx={{ borderRadius: 2, skeletonSx }}
      />
    </Box>
  );
}
