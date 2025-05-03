// src/components/common/Layout.jsx

import { Box } from "@mui/material";

/**
 * 전체 페이지 공통 레이아웃 컴포넌트
 * - 배경색: var(--bg-100)
 * - 콘텐츠 최대 너비: 1040px
 * - 좌우 여백: 자동 (mx: auto)
 * - 내부 여백: 반응형 padding (xs~md)
 */
export default function Layout({ children }) {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--bg-100)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 중앙 콘텐츠 컨테이너 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1040px",     // 콘텐츠 최대 너비 제한
          px: { xs: 2, sm: 3, md: 4 }, // 작은 화면 내부 여백
          mx: "auto",             // 큰 화면에서 중앙 정렬
          flexGrow: 1,
          position: "relative",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}