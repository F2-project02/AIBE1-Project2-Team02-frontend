// src/components/Profile/ProfileCard.jsx

import { Box, Typography, Avatar } from "@mui/material";
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

  // useEffect 추가
  useEffect(() => {
    // profileData와 mentorProfile 둘 다 존재하는지 확인
    if (profileData?.role === "MENTOR" && mentorProfile) {
      const fetchRating = async () => {
        try {
          // mentorProfile.mentorId가 정확한 필드인지 확인
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
        alignItems: "center",
        mb: 4,
        p: 0,
        width: "100%",
      }}
    >
      {/* 프로필 이미지 */}
      <Avatar
        src={imagePreview}
        alt="프로필 이미지"
        sx={{
          width: 80,
          height: 80,
          mr: 3,
        }}
      />

      <Box>
        {/* 닉네임과 인증 아이콘을 포함한 상단 행 */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: "1.2rem" }}>
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
          sx={{ fontSize: "0.95rem" }}
        >
          {mentorProfile?.education || ""} {mentorProfile?.major || ""}
        </Typography>
      </Box>

      {/* 별점 */}
      {profileData?.role === "MENTOR" && (
        <Box
          sx={{
            ml: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          <StarIcon
            sx={{
              color: "#FFC107",
              mr: 0.5,
              fontSize: 28,
            }}
          />
          <Typography variant="body2" fontWeight={500}>
            {rating > 0 ? rating.toFixed(1) : "아직 평점이 없어요."}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
