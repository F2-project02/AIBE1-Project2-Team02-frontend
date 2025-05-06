// 📄 src/components/LectureDetail/LectureHeader.jsx

import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Switch,
  Tooltip,
  Breadcrumbs,
  Link,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/VerifiedUser";
import StarIcon from "@mui/icons-material/Star";
import { useUserStore } from "../../store/useUserStore";

export default function LectureHeader({ lecture }) {
  const { userId, role, myLectureIds } = useUserStore();
  const isOwner = myLectureIds.includes(lecture.lectureId);
  const isMentor = role === "MENTOR";

  const handleToggleChange = () => {
    console.log("과외 모집 마감 토글");
  };

  return (
    <Box sx={{ mb: 6 }}>
      {/* 상단 태그 + 토글 */}
      <Stack direction="row" alignItems="center" spacing={2} mb={1.5}>
        <Stack direction="row" spacing={1}>
          <Chip
            label={lecture.category?.sub}
            size="small"
            sx={{
              backgroundColor: "var(--action-primary-bg)",
              color: "var(--primary-300)",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "0.75rem",
              px: 1,
            }}
          />
          <Chip
            label="모집중"
            size="small"
            sx={{
              backgroundColor: "var(--action-green-bg)",
              color: "var(--action-green)",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "0.75rem",
              px: 1,
            }}
          />
        </Stack>

        {isMentor && isOwner && (
          <Tooltip
            title="토글을 눌러 과외 모집을 마감할 수 있어요"
            placement="right"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "var(--bg-300)",
                  color: "var(--text-300)",
                  fontSize: "12px",
                  borderRadius: "8px",
                  fontWeight: 500,
                },
              },
              arrow: {
                sx: {
                  color: "var(--bg-200)",
                },
              },
            }}
            arrow
          >
            <Switch
              onChange={handleToggleChange}
              sx={{
                color: "var(--primary-100)",
                "& .MuiSwitch-thumb": {
                  backgroundColor: "var(--primary-100)",
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "var(--primary-100)",
                  opacity: 0.2,
                },
              }}
            />
          </Tooltip>
        )}
      </Stack>

      {/* 과외 제목 */}
      <Typography variant="h5" fontWeight={600} color="var(--text-100)" mb={1}>
        {lecture.title}
      </Typography>

      {/* 브레드크럼 */}
      <Breadcrumbs separator="›" sx={{ mb: 2 }}>
        <Link underline="hover" color="var(--text-300)">
          {lecture.category?.parent}
        </Link>
        <Link underline="hover" color="var(--text-300)">
          {lecture.category?.middle}
        </Link>
        <Typography color="var(--text-100)">{lecture.category?.sub}</Typography>
      </Breadcrumbs>

      {/* 멘토 정보 + 평점 */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          src={lecture.mentor.profileImage || "/images/default-profile.svg"}
          sx={{ width: 40, height: 40, bgcolor: "var(--bg-200)" }}
        />
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              flexWrap: "nowrap",
              minWidth: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="var(--text-100)"
            >
              {lecture.mentor.nickname}
            </Typography>
            {lecture.mentor.isCertified && (
              <ShieldIcon
                fontSize="small"
                sx={{ color: "var(--primary-100)" }}
              />
            )}
          </Stack>
          <Typography variant="body2" color="var(--text-400)">
            {lecture.mentor.education}
            {lecture.mentor.major ? ` ${lecture.mentor.major}` : ""}
          </Typography>
        </Box>

        {/* 별점 */}
        <Stack direction="row" spacing={0.5} alignItems="center" ml="auto">
          <StarIcon sx={{ fontSize: 16, color: "#FFB400" }} />
          <Typography variant="body2" fontWeight={600} color="var(--text-100)">
            {lecture.mentor.rating.toFixed(1)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
