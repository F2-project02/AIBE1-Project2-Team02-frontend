// 📄 src/components/LectureDetail/MentorProfile.jsx

import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Divider,
  Alert,
  Button,
  Link,
  Tooltip,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import StarIcon from "@mui/icons-material/Star";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SchoolIcon from "@mui/icons-material/School";
import TagIcon from "@mui/icons-material/Tag";
import { useState, useEffect } from "react";
import { getRatingByMentor } from "../../lib/api/reviewApi";

export default function MentorProfile({ mentor }) {
  const [mentorRating, setMentorRating] = useState({
    averageRating: mentor?.rating || 0,
    count: 0,
  });

  // 멘토 ID가 있으면 평점 정보를 가져옴
  useEffect(() => {
    const fetchMentorRating = async () => {
      if (!mentor || !mentor.mentorId) return;

      try {
        const response = await getRatingByMentor({ id: mentor.mentorId });
        if (response.success && response.data) {
          setMentorRating({
            averageRating: response.data.averageRating || 0,
            count: response.data.count || 0,
          });
        }
      } catch (error) {
        console.error("멘토 평점 조회 에러:", error);
      }
    };

    fetchMentorRating();
  }, [mentor]);

  // 멘토 정보가 없는 경우 처리
  if (!mentor) {
    return (
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          멘토 정보
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          멘토 정보를 불러올 수 없어요.
        </Alert>
      </Box>
    );
  }

  // 안전 확인 및 기본값 설정
  const profileImage = mentor.profileImage || "/images/default-profile.svg";
  const nickname = mentor.nickname || "멘토";
  const isCertified = mentor.isCertified || false;
  const rating = mentorRating.averageRating || 0;
  const reviewCount = mentorRating.count || 0;
  const mbti = mentor.mbti || null;
  const sex = mentor.sex || null;
  const education = mentor.education || "";
  const major = mentor.major || "";
  const tag = mentor.tag || null;
  const appealFileUrl = mentor.appealFileUrl || null;
  const regions = Array.isArray(mentor.regions) ? mentor.regions : [];
  const introduction =
    mentor.introduction || mentor.content || "멘토 소개 내용이 없어요.";

  // HTML 내용을 안전하게 렌더링하는 함수
  const createMarkup = (html) => {
    if (typeof html !== "string") return { __html: "" };
    return { __html: html };
  };

  // 소개 내용에 HTML이 포함되어 있는지 확인
  const containsHtml =
    typeof introduction === "string" && introduction.includes("<");

  // 태그 처리 - 한 문장 전체를 하나의 태그로 사용
  const hasTag = tag && typeof tag === "string" && tag.trim().length > 0;

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
          <Tooltip title="인증된 멘토입니다">
              <SecurityIcon
                sx={{
                  fontSize: 16,
                  fill: "url(#shield-gradient)",
                }}
              />
          </Tooltip>
        )}
      </Box>

      {/* 성별, MBTI, 별점 */}
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        mt={1}
      >
        {sex && (
          <Chip
            label={sex}
            size="small"
            sx={{
              backgroundColor: "var(--action-primary-bg)",
              color: "var(--primary-200)",
              fontWeight: 500,
              borderRadius: "8px",
            }}
          />
        )}

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

        <Box display="flex" alignItems="center" gap={0.5}>
          <StarIcon sx={{ fontSize: 16, color: "#FFC107" }} />
          <Typography fontSize="0.85rem">
            {typeof rating === "number" ? rating.toFixed(1) : "0.0"}
          </Typography>
          {reviewCount > 0 && (
            <Typography fontSize="0.75rem" color="var(--text-300)">
              ({reviewCount})
            </Typography>
          )}
        </Box>
      </Stack>

      {/* 학력 및 전공 */}
      {(education || major) && (
        <Box
          mt={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
        >
          <SchoolIcon fontSize="small" sx={{ color: "var(--text-300)" }} />
          <Typography
            variant="body2"
            textAlign="center"
            color="var(--text-200)"
          >
            {education} {major && `${major}`}
          </Typography>
        </Box>
      )}

      {/* 포트폴리오 파일 */}
      {appealFileUrl && (
        <Box mt={3} textAlign="center">
          <Button
            component={Link}
            href={appealFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<AttachFileIcon />}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              color: "var(--primary-200)",
              borderColor: "var(--primary-100)",
              "&:hover": {
                borderColor: "var(--primary-200)",
                backgroundColor: "var(--action-primary-bg)",
              },
            }}
          >
            포트폴리오 보기
          </Button>
        </Box>
      )}

      {/* 멘토 소개 */}
      <Divider sx={{ my: 3 }} />
      <Typography color="var(--text-100)" variant="subtitle2" fontWeight={600}>
        멘토 소개
      </Typography>
      <Box
        sx={{
          mt: 2,
          backgroundColor: "var(--bg-100)",
          borderRadius: "12px",
          border: "1px solid var(--bg-300)",
          p: 3,
        }}
      >
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

      {/* 태그 (한 문장) */}
      {hasTag && (
        <Box mt={3}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <TagIcon fontSize="small" sx={{ color: "var(--text-300)" }} />
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="var(--text-300)"
            >
              멘토 태그
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "var(--action-primary-bg)",
              color: "var(--primary-200)",
              borderRadius: "12px",
              py: 2,
              px: 3,
              fontWeight: 500,
              fontSize: "0.95rem",
              lineHeight: 1.5,
              border: "1px solid var(--primary-50)",
            }}
          >
            {tag}
          </Box>
        </Box>
      )}
    </Box>
  );
}
