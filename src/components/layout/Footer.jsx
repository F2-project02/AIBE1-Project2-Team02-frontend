// src/components/layout/Footer.jsx

import { Box, Typography, Divider, Button } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "var(--bg-200)",
        color: "var(--text-300)",
        fontFamily: "Pretendard",
        fontSize: 14,
        lineHeight: 1.6,
        py: 4,
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: "1040px",
          mx: "auto",
        }}
      >
        {/* 상단 메뉴 링크 */}
        <Box display="flex" gap={3} flexWrap="wrap" mb={2}>
          {[
            { label: "멘토스 소개", to: "/about" },
            { label: "이용약관", to: "/terms" },
            { label: "개인정보 처리방침", to: "/privacy" },
          ].map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              style={{
                textDecoration: "none",
                color: "var(--text-300)",
                fontWeight: 500,
              }}
            >
              <Typography variant="body2">{label}</Typography>
            </NavLink>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 고객센터 */}
        <Typography variant="subtitle2" fontWeight={600} mb={1} color="var(--text-100)">
          고객센터
        </Typography>

        <a href="mailto:mentoss.hwa2@gmail.com" style={{ textDecoration: "none" }}>
        <Button
          aria-label="이메일로 문의하기"
          startIcon={<EmailIcon />}
          sx={{
            mb: 2,
            px: 2,
            py: 0.75,
            backgroundColor: "var(--bg-300)",
            borderRadius: "8px",
            color: "var(--text-300)",
            fontWeight: 500,
            fontSize: 14,
            textTransform: "none",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            "&:hover": {
              backgroundColor: "var(--text-400)",
            },
          }}
        >
          이메일로 문의하기
        </Button>
        </a>

        <Typography variant="body2" mb={0.5}>
          멘토스 고객센터는 이메일로 운영 중입니다.
        </Typography>
        <Typography variant="body2" mb={2}>
          평일(월~금) : 10:00 ~ 17:00 / 주말(토요일) : 13:00 ~ 17:00 (일요일, 공휴일 제외) |  mentoss.hwa2@gmail.com
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* 저작권 표시 */}
        <Typography variant="caption" color="var(--text-300)">
          © 2025 MEN:TOSS. ALL RIGHTS RESERVED.
        </Typography>
      </Box>
    </Box>
  );
}
