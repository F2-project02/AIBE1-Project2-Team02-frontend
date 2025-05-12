import {
  Modal,
  Box,
  Stack,
  Skeleton,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";

export default function ApplicationDetailSkeleton({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: isMobile ? "100vw" : 500,
          maxHeight: "90vh",
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
          height={30}
          width="30%"
          sx={{ mx: "auto", mb: 4 }}
        />

        {/* 과외명 */}
        <Stack direction="row" spacing={2} mb={2}>
          <Skeleton variant="text" width={60} />
          <Skeleton variant="text" width="60%" />
        </Stack>

        {/* 멘토 정보 */}
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="60%" height={16} />
          </Box>
          <Skeleton variant="text" width={40} height={20} />
        </Stack>

        {/* 신청 시간 */}
        <Skeleton variant="text" width={80} height={24} sx={{ mt: 2, mb: 1 }} />
        <Box
          mt={1}
          sx={{
            backgroundColor: "var(--bg-100)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.5,
          }}
        >
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="70%" height={20} />
        </Box>

        {/* 닫기 버튼 자리 */}
        <Box mt={4}>
          <Skeleton
            variant="rectangular"
            height={52}
            width="100%"
            sx={{ borderRadius: "12px" }}
          />
        </Box>
      </Box>
    </Modal>
  );
}
