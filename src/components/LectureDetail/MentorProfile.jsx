// 📄 src/components/LectureDetail/MentorProfile.jsx

import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Divider,
  Alert,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/VerifiedUser";
import StarIcon from "@mui/icons-material/Star";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function MentorProfile({ mentor }) {
  // 멘토 정보가 없는 경우 처리
  if (!mentor) {
    return (
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          멘토 정보
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          멘토 정보를 불러올 수 없습니다.
        </Alert>
      </Box>
    );
  }

  // 안전 확인 및 기본값 설정
  const profileImage = mentor.profileImage || "/images/default-profile.svg";
  const nickname = mentor.nickname || "멘토";
  const isCertified = mentor.isCertified || false;
  const rating = mentor.rating || 0;
  const mbti = mentor.mbti || null;
  const education = mentor.education || "";
  const major = mentor.major || "";
  const regions = Array.isArray(mentor.regions) ? mentor.regions : [];
  const introduction =
    mentor.introduction || mentor.content || "멘토 소개 내용이 없습니다.";

  // HTML 내용을 안전하게 렌더링하는 함수
  const createMarkup = (html) => {
    if (typeof html !== "string") return { __html: "" };
    return { __html: html };
  };

  // 소개 내용에 HTML이 포함되어 있는지 확인
  const containsHtml =
    typeof introduction === "string" && introduction.includes("<");

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        멘토 정보
      </Typography>

      {/* 프로필 이미지 */}
      <Box display="flex" justifyContent="center" mt={2} mb={1}>
        <Avatar src={profileImage} sx={{ width: 80, height: 80 }} />
      </Box>

      {/* 닉네임 + 인증 */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
        <Typography fontWeight={600} fontSize="1rem" color="var(--text-100)">
          {nickname}
        </Typography>
        {isCertified && (
          <ShieldIcon fontSize="small" sx={{ color: "var(--primary-100)" }} />
        )}
      </Box>

      {/* 별점 + MBTI */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={1}
        mt={1}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <StarIcon sx={{ fontSize: 16, color: "#FFC107" }} />
          <Typography fontSize="0.85rem">
            {typeof rating === "number" ? rating.toFixed(1) : "0.0"}
          </Typography>
        </Box>
        {mbti && (
          <Chip
            label={mbti}
            size="small"
            sx={{
              backgroundColor: "var(--action-green-bg)",
              color: "var(--action-green)",
              fontWeight: 600,
              borderRadius: "8px",
            }}
          />
        )}
      </Box>

      {/* 학력 */}
      {(education || major) && (
        <Typography
          variant="body2"
          textAlign="center"
          mt={1}
          color="var(--text-300)"
        >
          {education} {major && `${major}`}
        </Typography>
      )}

      {/* 지역 */}
      {regions.length > 0 && (
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          gap={1}
          mt={1}
        >
          {regions.map((r, index) => (
            <Chip
              key={index}
              label={
                typeof r === "string"
                  ? r
                  : `${r.sido || ""} ${r.sigungu || ""}`.trim()
              }
              size="small"
              sx={{
                backgroundColor: "var(--action-primary-bg)",
                color: "var(--primary-200)",
                fontWeight: 500,
                borderRadius: "8px",
              }}
            />
          ))}
        </Box>
      )}

      {/* 멘토 소개 */}
      <Divider sx={{ my: 3 }} />
      <Typography color="var(--text-100)" variant="subtitle2" fontWeight={600}>
        멘토 소개
      </Typography>
      <Box
        sx={{
          mt: 1,
          backgroundColor: "var(--bg-100)",
          borderRadius: "12px",
          border: "1px solid var(--bg-300)",
          p: 2,
        }}
      >
        {/* 멘토 소개 내용 - HTML이 있으면 HTML로 렌더링, 없으면 일반 텍스트로 렌더링 */}
        {containsHtml ? (
          <Box
            sx={{
              color: "var(--text-200)",
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                margin: "16px 0",
              },
              "& p": {
                margin: "0 0 16px 0",
              },
              "& ul, & ol": {
                marginBottom: "16px",
                paddingLeft: "24px",
              },
              "& li": {
                marginBottom: "8px",
              },
            }}
            dangerouslySetInnerHTML={createMarkup(introduction)}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-line", color: "var(--text-200)" }}
          >
            {introduction}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
