import {
  Modal,
  Box,
  Typography,
  Stack,
  Avatar,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function ApplicationDetailModal({ open, onClose, data }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data) return null;

  const {
    lectureTitle,
    profileImage,
    nickname,
    isCertified,
    education,
    major,
    averageRating,
    requestedTimeSlot,
  } = data;

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
        <Typography
          variant="h6"
          textAlign="center"
          fontWeight={600}
          fontSize="1.25rem"
          mb={4}
        >
          수업 신청
        </Typography>

        {/* 강의명 */}
        <Stack direction="row" spacing={2} mb={2}>
          <Typography fontWeight={600}>과외명</Typography>
          <Typography fontWeight={500}>{lectureTitle}</Typography>
        </Stack>

        {/* 멘토 정보 */}
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Avatar
            src={profileImage || "/images/default-profile.svg"}
            sx={{ width: 40, height: 40, bgcolor: "var(--bg-200)" }}
          />
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="var(--text-100)"
              >
                {nickname}
              </Typography>
              {isCertified && (
              <SecurityIcon
              sx={{
                fontSize: 16,
                fill: "url(#shield-gradient)",
              }}
            />
              )}
            </Stack>
            <Typography variant="body2" color="var(--text-400)">
              {education} {major}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} alignItems="center" ml="auto">
            <StarIcon sx={{ fontSize: 16, color: "#FFB400" }} />
            <Typography
              variant="body2"
              fontWeight={600}
              color="var(--text-100)"
            >
              {(averageRating ?? 0).toFixed(1)}
            </Typography>
          </Stack>
        </Stack>

        {/* 신청한 수업 시간 */}
        <Typography
          fontWeight={600}
          fontSize="14px"
          mt={2}
          mb={1}
          color="var(--text-200)"
        >
          신청 시간
        </Typography>
        <Box
          mt={1}
          sx={{
            backgroundColor: "var(--bg-100)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AccessTimeIcon sx={{ color: "var(--primary-300)" }} />
          <Typography fontWeight={500} color="var(--text-300)">
            {requestedTimeSlot?.dayOfWeek}요일 | {requestedTimeSlot?.startTime}{" "}
            - {requestedTimeSlot?.endTime}
          </Typography>
        </Box>

        {/* 닫기 버튼 */}
        <Box mt={4}>
          <Button
            onClick={onClose}
            fullWidth
            variant="outlined"
            sx={{
              height: 52,
              borderRadius: "12px",
              borderColor: "var(--bg-300)",
              color: "var(--text-400)",
              fontWeight: 600,
              ":hover": {
                backgroundColor: "var(--bg-200)",
              },
            }}
          >
            닫기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
