// src/components/Profile/ProfileCard.jsx

import {
  Box,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getRatingByMentor } from "../../lib/api/reviewApi";
import StarIcon from "@mui/icons-material/Star";
import SecurityIcon from "@mui/icons-material/Security";

export default function ProfileCard({
  profileData,
  mentorProfile,
  imagePreview,
}) {
  const [rating, setRating] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (profileData?.role === "MENTOR" && mentorProfile) {
      const fetchRating = async () => {
        try {
          const mentorId = mentorProfile.mentorId;

          if (!mentorId) {
            return;
          }

          const ratingData = await getRatingByMentor({
            id: mentorId,
          });

          if (ratingData && ratingData.success && ratingData.data) {
            const averageRating = ratingData.data.averageRating;
            setRating(
              averageRating != null && !isNaN(averageRating)
                ? parseFloat(averageRating)
                : 0
            );
          }
        } catch (error) {
          setRating("0");
        }
      };

      fetchRating();
    }
  }, [profileData, mentorProfile]);

  if (!profileData) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "center", sm: "flex-start" },
        mb: 4,
        p: { xs: 2, sm: 0 },
        width: "100%",
        overflow: "visible",
      }}
    >
      {/* 프로필 이미지 */}
      <Avatar
        src={imagePreview}
        alt="프로필 이미지"
        sx={{
          width: { xs: 100, sm: 80 },
          height: { xs: 100, sm: 80 },
          mr: { xs: 0, sm: 3 },
          mb: { xs: 2, sm: 0 },
          flexShrink: 0,
        }}
      />

      <Box
        sx={{
          textAlign: { xs: "center", sm: "left" },
          flex: 3,
          whiteSpace: "nowrap",
          overflow: "visible",
        }}
      >
        {/* 닉네임과 인증 아이콘을 포함한 상단 행 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 0.5,
            justifyContent: { xs: "center", sm: "flex-start" },
            whiteSpace: "nowrap",
            width: "100%",
            overflow: "visible",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              fontSize: "1.8rem",
              whiteSpace: "nowrap",
              overflow: "visible",
            }}
          >
            {profileData?.nickname || ""}
          </Typography>

          {/* 인증 아이콘 */}
          {profileData?.role === "MENTOR" && mentorProfile?.isCertified && (
            <Box
              sx={{
                ml: 1,
                position: "relative",
                display: "inline-flex",
              }}
            >
              <svg width="0" height="0">
                <defs>
                  <linearGradient
                    id="shield-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#ffbad0" />
                    <stop offset="100%" stopColor="var(--primary-100)" />
                  </linearGradient>
                </defs>
              </svg>
              <SecurityIcon
                sx={{
                  fontSize: 20,
                  fill: "url(#shield-gradient)",
                }}
              />
            </Box>
          )}
        </Box>

        {/* 학교/지역 정보 */}
        <Typography
          variant="body2"
          color="var(--text-300)"
          sx={{
            fontSize: "0.95rem",
            whiteSpace: "nowrap",
            overflow: "visible",
          }}
        >
          {mentorProfile?.education || ""} {mentorProfile?.major || ""}
        </Typography>
      </Box>

      {/* 별점 */}
      {profileData?.role === "MENTOR" && (
        <Box
          sx={{
            ml: { xs: 0, sm: 4 },
            mt: { xs: 2, sm: 0 },
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "flex-start" },
            width: "100%",
            alignSelf: { xs: "center", sm: "center" },
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
            }}
          >
            <StarIcon
              sx={{
                color: "#FFC107",
                mr: 0.5,
                fontSize: 28,
              }}
            />
            <Typography
              variant="body1"
              fontWeight={600}
              fontSize="1.1rem"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              {rating > 0 ? rating.toFixed(1) : "아직 평점이 없습니다"}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
