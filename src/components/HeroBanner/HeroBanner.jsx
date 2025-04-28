// src/components/HeroBanner/HeroBanner.jsx

import { Box, Typography } from "@mui/material";

export default function HeroBanner() {
  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: "104/17",
        background: "linear-gradient(90deg, #FFBAD0 0%, #5B8DEF 100%)",
        position: "relative",
        overflow: "hidden",
        borderRadius: {
          xs: "12px", // 모바일
          sm: "16px", // 태블릿
          md: "24px", // 데스크탑
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: {
          xs: 2,
          sm: 4,
          md: 6,
        },
      }}
    >
      {/* 텍스트 */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "left",
          maxWidth: { xs: "55%", sm: "50%", md: "45%" },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: {
              xs: "0.5rem", // 모바일
              sm: "1.25rem", // 태블릿
              md: "1.5rem",  // 데스크탑
            },
            color: "#FFFEFB",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          MEN:TOSS
          <br />
          재능있는 MENTOR를 TOSS하다
        </Typography>
      </Box>

      {/* 도넛 이미지 */}
      <Box
        component="img"
        src="/images/mentos.svg"
        alt="멘토스"
        sx={{
          width: {
            xs: "35%",  // 모바일
            sm: "30%",  // 태블릿
            md: "30%",  // 데스크탑
          },
          height: "auto",
          objectFit: "contain",
          transform: {
            xs: "translate(-20%, 0%)",
            sm: "translate(-30%, 0%)",
            md: "translate(-40%, 0%)",
          },
        }}
      />
    </Box>
  );
}
