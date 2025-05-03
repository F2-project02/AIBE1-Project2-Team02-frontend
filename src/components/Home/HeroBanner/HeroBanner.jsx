// src/components/HeroBanner/HeroBanner.jsx

import { Box, Typography, keyframes } from "@mui/material";
import bannerImage from "../../../assets/mentoss.svg";

// 텍스트 애니메이션: 왼쪽에서 서서히 등장
const textFadeSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-12px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

// 이미지 애니메이션: 오른쪽에서 서서히 등장
const imageFadeSlide = keyframes`
  0% {
    opacity: 0;
    transform: translate(30%, 0);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
`;

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
        minHeight: { sm: 128 },
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
          animation: `${textFadeSlide} 0.8s ease-out forwards`,
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
            whiteSpace: {
              xs: "normal",
              sm: "nowrap",
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
        src={bannerImage}
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
          animation: `${imageFadeSlide} 0.9s ease-out forwards`,
        }}
      />
    </Box>
  );
}
