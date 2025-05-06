// 📄 src/components/LectureDetail/CurriculumSection.jsx

import { Box, Typography } from "@mui/material";

export default function CurriculumSection({ curriculum }) {
  const curriculumList = curriculum
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

      {curriculumList.map((line, index) => (
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
      ))}
    </Box>
  );
}