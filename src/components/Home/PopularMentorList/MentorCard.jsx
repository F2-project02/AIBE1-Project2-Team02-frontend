// src/components/Home/PopularMentorList/MentorCard.jsx

import { Box, Avatar, Typography, Chip, Card, Tooltip } from "@mui/material";
import ShieldIcon from "@mui/icons-material/VerifiedUser";
import StarIcon from "@mui/icons-material/Star";

export default function MentorCard({
  nickname,
  isCertified,
  profileImage,
  mbti,
  rating,
  education,
  major,
  topCategories,
}) {
  return (
    <Card
      sx={{
        minWidth: 220,
        height: "100%",
        px: 2,
        py: 3,
        borderRadius: 1,
        backgroundColor: "#fefefe",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
        flexShrink: 0,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          cursor: "pointer",
          transform: "translateY(-4px)",
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Avatar
        src={profileImage || "/images/default-profile.svg"}
        sx={{ width: 72, height: 72, mb: 2 }}
      />
      <Box display="flex" alignItems="center" gap={0.5}>
        <Typography variant="subtitle2" fontWeight={600}>
          {nickname}
        </Typography>
        {isCertified && (
          <ShieldIcon sx={{ fontSize: 16, color: "var(--primary-100)" }} />
        )}
      </Box>
      <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
        <StarIcon sx={{ fontSize: 16, color: "#FFC107" }} />
        <Typography variant="body2" fontWeight={500}>
          {rating.toFixed(1)}
        </Typography>
        <Chip
          label={mbti}
          size="small"
          sx={{
            ml: 1,
            backgroundColor: "var(--action-green-bg)",
            color: "var(--action-green)",
            fontWeight: 500,
            borderRadius: "8px",
          }}
        />
      </Box>
      <Typography variant="body2" mt={1} color="var(--text-300)">
        {education} {major}
      </Typography>

      <Box mt={1.5} display="flex" flexWrap="wrap" gap={0.5}>
        {topCategories.slice(0, 2).map((cat) => (
          <Chip
            key={cat}
            label={cat}
            size="small"
            sx={{
              backgroundColor: "var(--action-primary-bg)",
              color: "var(--primary-200)",
              fontWeight: 500,
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
        ))}

        {topCategories.length > 2 && (
          <Tooltip
            title={topCategories.slice(2).join(", ")}
            arrow
            placement="top"
          >
            <Chip
              label={`+${topCategories.length - 2}`}
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
    </Card>
  );
}
