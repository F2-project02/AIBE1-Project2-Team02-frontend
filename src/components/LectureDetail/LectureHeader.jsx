// 📄 src/components/LectureDetail/LectureHeader.jsx

import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Breadcrumbs,
  Link,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/VerifiedUser";
import StarIcon from "@mui/icons-material/Star";

export default function LectureHeader({ lecture }) {
  if (!lecture) {
    return null;
  }

  // 안전하게 데이터 추출
  const categorySubject = lecture?.category?.sub || "기타";
  const categoryParent = lecture?.category?.parent || "교육";
  const categoryMiddle = lecture?.category?.middle || "일반";
  const lectureTitle = lecture?.title || "강의 제목";
  const mentorNickname = lecture?.mentor?.nickname || "멘토";
  const mentorEducation = lecture?.mentor?.education || "";
  const mentorMajor = lecture?.mentor?.major || "";
  const mentorProfileImage =
    lecture?.mentor?.profileImage || "/images/default-profile.svg";
  const mentorIsCertified = lecture?.mentor?.isCertified || false;
  const mentorRating = lecture?.mentor?.rating || 0;
  const isClosed = lecture?.isClosed || false;

  return (
    <Box sx={{ mb: 6 }}>
      {/* 상단 태그 + 토글 */}
      <Stack direction="row" alignItems="center" spacing={2} mb={1.5}>
        <Stack direction="row" spacing={1}>
          <Chip
            label={categorySubject}
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
            label={isClosed ? "마감됨" : "모집중"}
            size="small"
            sx={{
              backgroundColor: isClosed
                ? "var(--action-red-bg)"
                : "var(--action-green-bg)",
              color: isClosed ? "var(--action-red)" : "var(--action-green)",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "0.75rem",
              px: 1,
            }}
          />
        </Stack>
      </Stack>

      {/* 과외 제목 */}
      <Typography variant="h5" fontWeight={600} color="var(--text-100)" mb={1}>
        {lectureTitle}
      </Typography>

      {/* 브레드크럼 */}
      <Breadcrumbs separator="›" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="var(--text-300)"
          component="button"
          onClick={() => console.log(`카테고리 ${categoryParent} 클릭`)}
        >
          {categoryParent}
        </Link>
        <Link
          underline="hover"
          color="var(--text-300)"
          component="button"
          onClick={() => console.log(`카테고리 ${categoryMiddle} 클릭`)}
        >
          {categoryMiddle}
        </Link>
        <Typography color="var(--text-100)">{categorySubject}</Typography>
      </Breadcrumbs>

      {/* 멘토 정보 + 평점 */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          src={mentorProfileImage}
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
              {mentorNickname}
            </Typography>
            {mentorIsCertified && (
              <ShieldIcon
                fontSize="small"
                sx={{ color: "var(--primary-100)" }}
              />
            )}
          </Stack>
          <Typography variant="body2" color="var(--text-400)">
            {mentorEducation}
            {mentorMajor ? ` ${mentorMajor}` : ""}
          </Typography>
        </Box>

        {/* 별점 */}
        <Stack direction="row" spacing={0.5} alignItems="center" ml="auto">
          <StarIcon sx={{ fontSize: 16, color: "#FFB400" }} />
          <Typography variant="body2" fontWeight={600} color="var(--text-100)">
            {typeof mentorRating === "number" ? mentorRating.toFixed(1) : "0.0"}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
