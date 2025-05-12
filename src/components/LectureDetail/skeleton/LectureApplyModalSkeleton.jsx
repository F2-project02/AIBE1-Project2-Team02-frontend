import {
  Modal,
  Box,
  Stack,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function LectureApplyModalSkeleton({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: isMobile ? "100vw" : 500,
          height: isMobile ? "100dvh" : "auto",
          maxHeight: isMobile ? "100dvh" : "90vh",
          overflowY: "auto",
          bgcolor: "#fefefe",
          borderRadius: isMobile ? 0 : "16px",
          p: isMobile ? 2 : 4.5,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 6,
        }}
      >
        <Skeleton
          variant="text"
          width={120}
          height={30}
          animation="wave"
          sx={{ mb: 4, mx: "auto", bgcolor: "var(--bg-200)" }}
        />

        <Stack direction="row" spacing={2} mb={2}>
          <Skeleton
            variant="text"
            width={80}
            height={20}
            animation="wave"
            sx={{ bgcolor: "var(--bg-200)" }}
          />
          <Skeleton
            variant="text"
            width={200}
            height={20}
            animation="wave"
            sx={{ bgcolor: "var(--bg-200)" }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            animation="wave"
            sx={{ bgcolor: "var(--bg-200)" }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              animation="wave"
              sx={{ bgcolor: "var(--bg-200)" }}
            />
            <Skeleton
              variant="text"
              width="40%"
              height={16}
              animation="wave"
              sx={{ bgcolor: "var(--bg-200)" }}
            />
          </Box>
          <Skeleton
            variant="text"
            width={40}
            height={20}
            animation="wave"
            sx={{ bgcolor: "var(--bg-200)" }}
          />
        </Stack>

        <Skeleton
          variant="text"
          width={80}
          height={20}
          animation="wave"
          sx={{ mt: 3, mb: 1, bgcolor: "var(--bg-200)" }}
        />
        <Stack direction="row" spacing={1} mb={2}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton
              key={idx}
              variant="rectangular"
              width={60}
              height={32}
              animation="wave"
              sx={{ borderRadius: 2, bgcolor: "var(--bg-200)" }}
            />
          ))}
        </Stack>

        <Skeleton
          variant="text"
          width={120}
          height={20}
          animation="wave"
          sx={{ mb: 1, bgcolor: "var(--bg-200)" }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={16}
          animation="wave"
          sx={{ mb: 1.5, bgcolor: "var(--bg-200)" }}
        />
        {Array.from({ length: 2 }).map((_, idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            width="100%"
            height={46}
            animation="wave"
            sx={{ borderRadius: 2, mb: 1, bgcolor: "var(--bg-200)" }}
          />
        ))}

        <Skeleton
          variant="text"
          width={100}
          height={20}
          animation="wave"
          sx={{ mt: 3, mb: 1, bgcolor: "var(--bg-200)" }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={140}
          animation="wave"
          sx={{ borderRadius: 2, bgcolor: "var(--bg-200)" }}
        />
        <Skeleton
          variant="text"
          width="30%"
          height={18}
          animation="wave"
          sx={{ ml: "auto", mt: 1, bgcolor: "var(--bg-200)" }}
        />

        <Box display="flex" gap={2} mt={4}>
          <Skeleton
            variant="rectangular"
            width="50%"
            height={52}
            animation="wave"
            sx={{ borderRadius: 2, bgcolor: "var(--bg-200)" }}
          />
          <Skeleton
            variant="rectangular"
            width="50%"
            height={52}
            animation="wave"
            sx={{ borderRadius: 2, bgcolor: "var(--bg-200)" }}
          />
        </Box>
      </Box>
    </Modal>
  );
}