// 📄 src/components/LectureDetail/CurriculumSection.jsx

import { Box, Typography } from "@mui/material";

export default function CurriculumSection({ curriculum }) {
  // Add safety check and fallback
  const curriculumContent = curriculum || "커리큘럼 정보가 없습니다.";

  const curriculumList = curriculumContent
    .split("\n")
    .filter((line) => line.trim() !== "");

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        color="var(--text-100)"
      >
        커리큘럼
      </Typography>

      {curriculumList.length > 0 ? (
        curriculumList.map((line, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              color: "var(--text-300)",
              mb: 1.5,
              lineHeight: 1.6,
            }}
          >
            {line}
          </Typography>
        ))
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: "var(--text-300)",
            mb: 1.5,
            lineHeight: 1.6,
          }}
        >
          커리큘럼 정보가 없습니다.
        </Typography>
      )}
    </Box>
  );
}
