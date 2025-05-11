// 📄 components/Search/SearchLayout.jsx
import { Box } from "@mui/material";

export default function SearchLayout({ sidebar, content }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 6,
        mt: 4,
        mb: 8,
      }}
    >
      {/* 왼쪽 필터 영역 */}
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: "none", md: "block" }, // 모바일에서는 안보이게
        }}
      >
        {sidebar}
      </Box>

      {/* 오른쪽 결과 콘텐츠 */}
      <Box sx={{ flex: 1 }}>{content}</Box>
    </Box>
  );
}
