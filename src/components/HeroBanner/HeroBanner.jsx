// src/components/HeroBanner/HeroBanner.jsx

import { Box, Typography } from "@mui/material";

export default function HeroBanner() {
  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: "104/17",
        background: "var(--primary-gradient)",
        position: "relative",
        overflow: "hidden",
        borderRadius: {
          xs: "12px",
          sm: "16px",
          md: "24px",
        },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: { xs: "center", sm: "space-between" },
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 6, sm: 0 },
        textAlign: { xs: "center", sm: "left" },
      }}
    >
      {/* 텍스트 영역 */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: { xs: "100%", sm: "50%", md: "45%" },
          px: { xs: 1, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.25rem",
              md: "1.5rem",
            },
            fontWeight: 600,
            lineHeight: 1.5,
            color: "var(--bg-100)",
          }}
        >
          MEN:TOSS
          <br />
          재능있는 MENTOR를 TOSS하다
        </Typography>
      </Box>

      {/* 이미지 */}
      <Box
        component="img"
        src="/images/mentoss.svg"
        alt="멘토스"
        sx={{
          display: { xs: "none", sm: "block" },
          width: { sm: "30%", md: "30%" },
          height: "auto",
          objectFit: "contain",
          transform: {
            sm: "translate(-30%, 0%)",
            md: "translate(-40%, 0%)",
          },
        }}
      />
    </Box>
  );
}
