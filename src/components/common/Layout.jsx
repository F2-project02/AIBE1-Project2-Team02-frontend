// src/components/common/Layout.jsx

import { Box } from "@mui/material";

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#FFFEFB",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 중앙 정렬 컨테이너 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1040px",
          px: { xs: 2, sm: 3, md: 4 }, // xs(폰) 2, sm(태블릿) 3, md(PC) 4
          flexGrow: 1,
          position: "relative",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
