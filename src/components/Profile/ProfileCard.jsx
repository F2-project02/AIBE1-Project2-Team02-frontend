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

          if (!mentorId) return;

          const ratingData = await getRatingByMentor({ id: mentorId });

          if (ratingData?.success && ratingData.data) {
            const averageRating = ratingData.data.averageRating;
            setRating(
              averageRating != null && !isNaN(averageRating)
                ? parseFloat(averageRating)
                : 0
            );
          }
        } catch (error) {
          setRating(0);
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
        alignItems: "center",
        justifyContent: "space-between",
        mb: 3,
        p: { xs: 1.5, sm: 0 },
        width: "100%",
        overflow: "visible",
      }}
    >
      {/* 프로필 이미지 */}
      <Avatar
        src={imagePreview}
        alt="프로필 이미지"
        sx={{
          width: { xs: 80, sm: 72 },
          height: { xs: 80, sm: 72 },
          mr: { xs: 0, sm: 2 },
          mb: { xs: 1.5, sm: 0 },
          flexShrink: 0,
        }}
      />

      <Box
        sx={{
          textAlign: { xs: "center", sm: "left" },
          flex: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* 닉네임 + 인증 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 0.5,
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              fontSize: "1.4rem",
              whiteSpace: "nowrap",
            }}
          >
            {profileData?.nickname || ""}
          </Typography>

          {profileData?.role === "MENTOR" && mentorProfile?.isCertified && (
            <Box sx={{ ml: 0.5, display: "inline-flex" }}>
              <SecurityIcon
                sx={{
                  fontSize: 18,
                  fill: "url(#shield-gradient)",
                }}
              />
            </Box>
          )}
        </Box>

        <Typography
          variant="body2"
          color="var(--text-300)"
          sx={{ fontSize: "0.85rem" }}
        >
          {mentorProfile?.education || ""} {mentorProfile?.major || ""}
        </Typography>
      </Box>

      {/* 별점 */}
      {profileData?.role === "MENTOR" && (
        <Box
          sx={{
            ml: { xs: 0, sm: 3 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            flexShrink: 0,
          }}
        >
          <StarIcon
            sx={{
              color: "#FFC107",
              mr: 0.5,
              fontSize: 22,
            }}
          />
          <Typography
            variant="body2"
            fontWeight={600}
            fontSize="1rem"
            sx={{ whiteSpace: "nowrap" }}
          >
            {rating.toFixed(1)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}