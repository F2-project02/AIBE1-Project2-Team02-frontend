// 📄 src/components/LectureDetail/MentorProfile.jsx

import {
  Box,
  Typography,
  Chip,
  Avatar,
  Divider,
  Alert,
  Tooltip,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import StarIcon from "@mui/icons-material/Star";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useState } from "react";
import { getRatingByMentor } from "../../lib/api/reviewApi";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function MentorProfile({ mentor }) {
  const [mentorRating, setMentorRating] = useState({
    averageRating: mentor?.rating || 0,
    count: 0,
  });

  useEffect(() => {
    const fetchMentorRating = async () => {
      if (!mentor?.mentorId) return;
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

  const {
    profileImage = "/images/default-profile.svg",
    nickname = "멘토",
    isCertified = false,
    mbti,
    sex,
    age,
    education = "",
    major = "",
    appealFileUrl,
    content = "멘토 소개를 작성하지 않았어요.",
    tag,
    regions = [],
  } = mentor;

  const rating = mentorRating.averageRating;
  const reviewCount = mentorRating.count;
  const containsHtml = typeof content === "string" && content.includes("<");
  const createMarkup = (html) => ({ __html: html });

  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={600}
        textAlign="center"
        mb={2}
        fontSize="1.25rem"
      >
        멘토 프로필
      </Typography>

      <Box display="flex" justifyContent="center">
        <Avatar src={profileImage} sx={{ width: 80, height: 80 }} />
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={1}
        mt={2}
      >
        <Typography fontWeight={600}>{nickname}</Typography>
        {isCertified && (
          <SecurityIcon sx={{ fontSize: 16, fill: "url(#shield-gradient)" }} />
        )}
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={1}
        mt={1}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <StarIcon sx={{ fontSize: 16, color: "#FFC107" }} />
          <Typography variant="body2">{rating.toFixed(1)}</Typography>
          {reviewCount > 0 && (
            <Typography variant="body2" color="var(--text-300)">
              ({reviewCount})
            </Typography>
          )}
        </Box>
        {mbti && (
          <Chip
            label={mbti}
            size="small"
            sx={{
              fontWeight: 600,
              backgroundColor: "var(--action-green-bg)",
              color: "var(--action-green)",
              borderRadius: "8px",
            }}
          />
        )}
      </Box>

      {(education || major) && (
        <Typography
          variant="body2"
          textAlign="center"
          mt={1}
          color="var(--text-300)"
        >
          {education} {major}
        </Typography>
      )}

      {(age || sex) && (
        <Typography
          variant="body2"
          textAlign="center"
          mt={0.5}
          color="var(--text-300)"
        >
          {age ? `${age}세` : ""}
          {age && sex ? " · " : ""}
          {sex || ""}
        </Typography>
      )}

      {regions.length > 0 && (
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          gap={1}
          mt={1}
        >
          {/* 최대 3개까지 Chip 렌더링 */}
          {regions.slice(0, 3).map((r, idx) => (
            <Chip
              key={`region-${idx}`}
              label={
                r.displayName ||
                [r.sido, r.sigungu, r.dong].filter(Boolean).join(" ")
              }
              icon={
                <LocationOnIcon
                  sx={{ fontSize: 14, color: "var(--action-yellow)" }}
                />
              }
              size="small"
              sx={{
                backgroundColor: "var(--action-yellow-bg)",
                color: "var(--action-yellow)",
                fontWeight: 500,
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
          ))}

          {/* 초과된 지역은 +N Chip + Tooltip */}
          {regions.length > 3 && (
            <Tooltip
              arrow
              placement="top"
              title={
                <Box display="flex" flexDirection="column">
                  {regions.slice(3).map((r, i) => (
                    <Typography
                      key={`hidden-region-${i}`}
                      variant="body2"
                      sx={{ fontSize: 13, color: "white" }}
                    >
                      {r.displayName ||
                        [r.sido, r.sigungu, r.dong].filter(Boolean).join(" ")}
                    </Typography>
                  ))}
                </Box>
              }
            >
              <Chip
                label={`+${regions.length - 3}`}
                size="small"
                sx={{
                  backgroundColor: "var(--bg-200)",
                  color: "var(--text-300)",
                  fontWeight: 500,
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
            </Tooltip>
          )}
        </Box>
      )}

      <Box
        mt={3}
        p={2}
        borderRadius="8px"
        sx={{
          background:
            "linear-gradient(90deg, rgba(255, 186, 208, 0.2) 0%, rgba(91, 141, 239, 0.2) 100%)",
          color: "var(--text-200)",
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <InfoOutlinedIcon fontSize="small" />
          <Typography fontWeight={600} fontSize={14}>
            AI 멘토 분석
          </Typography>
        </Box>
        <Typography fontSize={13} fontWeight={400}>
          {tag || "아직 후기가 많이 쌓이지 않아 분석할 수 없어요."}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />
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
        {containsHtml ? (
          <Box
            sx={{
              color: "var(--text-200)",
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                my: 2,
              },
              "& p": { mb: 2 },
              "& ul, & ol": { mb: 2, pl: 3 },
              "& li": { mb: 1 },
            }}
            dangerouslySetInnerHTML={createMarkup(content)}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-line", color: "var(--text-200)" }}
          >
            {content}
          </Typography>
        )}
      </Box>

      {appealFileUrl && (
        <Box mt={3}>
          <Box
            component="a"
            href={appealFileUrl}
            target="_blank"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.2,
              px: 3,
              py: 2,
              backgroundColor: "var(--bg-100)",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              textDecoration: "none",
              color: "inherit",
              fontWeight: 500,
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "var(--bg-200)",
              },
            }}
          >
            <InsertDriveFileIcon sx={{ color: "var(--primary-100)" }} />
            <Typography
              color={"var(--text-300)"}
              fontSize={14}
              fontWeight={600}
            >
              멘토가 등록한 포트폴리오 보러가기
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
