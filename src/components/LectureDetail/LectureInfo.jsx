// 📄 src/components/LectureDetail/LectureInfo.jsx

import { Box, Typography } from "@mui/material";

export default function LectureInfo({ description }) {
  // Add safety check and fallback
  const descriptionContent = description || "강의 소개 정보가 없습니다.";

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        강의 소개
      </Typography>
      <Typography
        variant="body1"
        sx={{ whiteSpace: "pre-line", color: "text.secondary" }}
      >
        {descriptionContent}
      </Typography>
    </Box>
  );
}
