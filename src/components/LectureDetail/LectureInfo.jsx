// 📄 src/components/LectureDetail/LectureInfo.jsx

import { Box, Typography, Alert } from "@mui/material";

export default function LectureInfo({ lecture }) {
  if (!lecture) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        강의 정보를 불러올 수 없습니다.
      </Alert>
    );
  }

  const description = lecture.description || "강의 소개 정보가 없습니다.";

  // HTML 내용을 안전하게 렌더링하는 함수
  const createMarkup = (html) => {
    if (typeof html !== "string") return { __html: "" };
    return { __html: html };
  };

  // HTML 태그가 포함된 경우 (에디터로 작성된 내용)
  const containsHtml =
    typeof description === "string" && description.includes("<");

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        강의 소개
      </Typography>

      {containsHtml ? (
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
          dangerouslySetInnerHTML={createMarkup(description)}
        />
      ) : (
        // 일반 텍스트 렌더링
        <Typography
          variant="body1"
          sx={{
            color: "var(--text-300)",
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
