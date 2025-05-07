// src/components/CourseSection/CourseCard.jsx - Fixed version

import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Card,
  Tooltip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ShieldIcon from "@mui/icons-material/VerifiedUser";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function CourseCard({ data }) {
  const navigate = useNavigate();

  // Ensure data has all required properties or provide defaults
  const {
    lectureId = 0,
    title = "",
    price = 0,
    mentorName = "",
    profileImage = "/images/default-profile.svg",
    isCertified = false,
    rating = 0,
    subcategory = [],
    region = [],
  } = data || {};

  const handleClick = () => {
    navigate(`/lectures/${lectureId}`);
  };

  // Ensure subcategory and region are arrays of strings
  const safeSubcategory = Array.isArray(subcategory)
    ? subcategory.map((cat) => String(cat))
    : subcategory
    ? [String(subcategory)]
    : [];

  const safeRegion = Array.isArray(region)
    ? region.map((r) =>
        typeof r === "string"
          ? r
          : r && typeof r === "object"
          ? JSON.stringify(r)
          : ""
      )
    : region
    ? [String(region)]
    : [];

  // Create display chips
  const sortedChips = [
    ...safeSubcategory
      .filter(Boolean)
      .map((label) => ({ label, type: "category" })),
    ...safeRegion.filter(Boolean).map((label) => ({ label, type: "region" })),
  ];

  const visibleChips = sortedChips.slice(0, 3);
  const hiddenChips = sortedChips.slice(3);

  function formatPriceKRW(price) {
    return `${Math.floor(price / 10000)}만원`;
  }

  return (
    <Card
      onClick={handleClick}
      sx={{
        width: 300,
        minHeight: 220,
        px: 2,
        py: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0,
        borderRadius: 0,
        backgroundColor: "unset",
        boxShadow: "none",
        transition: "transform 0.2s ease",
        "&:hover": {
          cursor: "pointer",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* 프로필 영역 */}
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Avatar
          src={profileImage || "/images/default-profile.svg"}
          sx={{ width: 32, height: 32 }}
        />
        <Typography variant="subtitle2" fontWeight={600}>
          {mentorName}
        </Typography>
        {isCertified && (
          <ShieldIcon sx={{ fontSize: 16, color: "var(--primary-100)" }} />
        )}
        <StarIcon sx={{ fontSize: 16, color: "#FFC107" }} />
        <Typography variant="body2" fontWeight={500}>
          {rating?.toFixed(1)}
        </Typography>
      </Stack>

      {/* 뱃지 */}
      <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
        {visibleChips.map((chip, i) => (
          <Chip
            key={`chip-${i}`}
            label={chip.label}
            icon={
              chip.type === "region" ? (
                <LocationOnIcon
                  sx={{ fontSize: 14, color: "var(--action-yellow)" }}
                />
              ) : undefined
            }
            size="small"
            sx={{
              backgroundColor:
                chip.type === "region"
                  ? "var(--action-yellow-bg)"
                  : "var(--action-primary-bg)",
              color:
                chip.type === "region"
                  ? "var(--action-yellow)"
                  : "var(--primary-200)",
              fontWeight: 500,
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
        ))}

        {hiddenChips.length > 0 && (
          <Tooltip
            title={
              <Box display="flex" flexDirection="column">
                {hiddenChips.map((chip, i) => (
                  <Typography key={`hidden-${i}`} variant="body2">
                    {chip.label}
                  </Typography>
                ))}
              </Box>
            }
            arrow
          >
            <Chip
              label={`+${hiddenChips.length}`}
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

      {/* 제목 */}
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          height: "3rem",
        }}
        mb={1}
      >
        {title}
      </Typography>

      {/* 가격 */}
      <Typography variant="body2" color="var(--text-300)">
        수업료 | 1회 {formatPriceKRW(price)}
      </Typography>
    </Card>
  );
}
