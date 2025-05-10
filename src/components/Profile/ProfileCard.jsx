// src/components/Profile/ProfileCard.jsx

import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getRatingByMentor } from "../../lib/api/reviewApi";

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
        p: 3,
        mb: 3,
        borderRadius: "8px",
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* 프로필 이미지 */}
      <Box
        component="div"
        sx={{
          width: 50,
          height: 50,
          mr: 2,
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <img
          src={imagePreview}
          alt="프로필 이미지"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Box>
        {/* 닉네임 */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" fontWeight={600}>
            {profileData?.nickname || "가나다라마바사아자차카타"}
          </Typography>

          {/* 인증 아이콘 (멘토 + 인증된 사용자만 표시) */}
          {profileData?.role === "MENTOR" && mentorProfile?.isCertified && (
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "18px",
                height: "18px",
                ml: 1,
                borderRadius: "50%",
                bgcolor: "var(--primary-100)",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              ✓
            </Box>
          )}
        </Box>

        {/* 학교/지역 - 멘토일 때만 표시 */}
        {profileData?.role === "MENTOR" && mentorProfile && (
          <Typography
            variant="body2"
            color="var(--text-300)"
            fontSize="0.85rem"
          >
            {mentorProfile.education} {mentorProfile.major}
          </Typography>
        )}
      </Box>

      {/* 별점 (오른쪽에 표시) - 멘토일 때만 표시 */}
      {profileData?.role === "MENTOR" && (
        <Box
          sx={{
            ml: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              color: "#FFC107",
              mr: 0.5,
              fontSize: "16px",
            }}
          >
            ★
          </Box>
          <Typography variant="body2" fontWeight={500}>
            {rating > 0 ? rating.toFixed(1) : "아직 평점이 없습니다"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
