// src/components/Home/PopularMentorList/MentorCtaCard.jsx

import { Card, Box, Typography } from "@mui/material";
import GradientButton from "../../Button/GradientButton";

export default function MentorCtaCard() {
  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 250,
        px: 2,
        py: 3,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(225deg, rgba(91, 141, 239, 0.10) 0%, rgba(91, 141, 239, 0.02) 100%)",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
        borderRadius: 1,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          cursor: "pointer",
          transform: "translateY(-4px)",
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text-200)",
            letterSpacing: 0.46,
            fontFamily: "Pretendard",
          }}
        >
          누구나 멘토가 될 수 있어요.
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-300)",
            letterSpacing: 0.46,
            fontFamily: "Pretendard",
          }}
        >
          지식과 경험을 나누고, 의미 있는 인사이트를 전해주세요!
        </Typography>
      </Box>

      <Box>
        <GradientButton
          size="xs"
          sx={{
            borderRadius: "8px",
            px: 2,
            py: 1,
            fontSize: 12,
          }}
        >
          멘토 되기
        </GradientButton>
      </Box>
    </Card>
  );
}
