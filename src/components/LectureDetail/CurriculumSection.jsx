// 📄 src/components/LectureDetail/CurriculumSection.jsx

import { Box, Typography, Alert } from "@mui/material";

export default function CurriculumSection({
  curriculum: propsCurriculum,
  lecture,
}) {
  // 커리큘럼 데이터 확인 - props 또는 lecture 객체에서 가져옴
  const curriculum = propsCurriculum || lecture?.curriculum || "";

  // HTML 내용을 안전하게 렌더링하는 함수
  const createMarkup = (html) => {
    if (typeof html !== "string") return { __html: "" };
    return { __html: html };
  };

  // HTML 태그가 포함된 경우 (에디터로 작성된 내용)
  const containsHtml =
    typeof curriculum === "string" && curriculum.includes("<");

  return (
    <Box sx={{ mt: 0 }}>
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        color="var(--text-100)"
      >
        커리큘럼
      </Typography>

      {curriculum ? (
        containsHtml ? (
          // HTML 콘텐츠 렌더링
          <Box
            sx={{
              color: "var(--text-300)",
              lineHeight: 1.6,
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                margin: "16px 0",
              },
              "& p": {
                margin: "0 0 16px 0",
              },
              "& ul, & ol": {
                marginBottom: "16px",
                paddingLeft: "24px",
              },
              "& li": {
                marginBottom: "8px",
              },
              "& h1, & h2, & h3, & h4": {
                color: "var(--text-100)",
                margin: "24px 0 16px 0",
              },
            }}
            dangerouslySetInnerHTML={createMarkup(curriculum)}
          />
        ) : (
          // 일반 텍스트 (줄바꿈이 있을 수 있음)
          <Box>
            {curriculum.split("\n").map((line, index) => (
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
        )
      ) : (
        // 데이터가 없는 경우
        <Alert severity="info" sx={{ mt: 2 }}>
          커리큘럼 정보가 없어요
        </Alert>
      )}
    </Box>
  );
}
