// src/components/Profile/MentorFormView.jsx

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function MentorFormView() {
  const [content, setContent] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // 파일 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // 로딩 중
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
          멘토 프로필 불러오는 중...
        </Typography>
      </Box>
    );
  }

  // 오류 발생 시
  if (error) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "var(--bg-200)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          멘토 정보를 불러올 수 없습니다
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, whiteSpace: "pre-wrap" }}
        >
          {error}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => window.location.reload()}
        >
          다시 시도하기
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        멘토 프로필
      </Typography>

      {/* 성공 메시지 */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          멘토 프로필이 성공적으로 업데이트되었습니다.
        </Alert>
      )}

      {/* 자기소개 */}
      <Box sx={{ mb: 3 }}>
        <Typography fontWeight={600} sx={{ mb: 1 }}>
          자기소개
          <Box component="span" sx={{ color: "red" }}>
            *
          </Box>
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="본인의 경력, 역량 등을 자세히 소개해주세요. (최소 10자)"
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* 어필 파일 업로드 */}
      <Box sx={{ mb: 3 }}>
        <Typography fontWeight={600} sx={{ mb: 1 }}>
          포트폴리오
        </Typography>
        <Box
          sx={{
            border: "1px dashed #ccc",
            borderRadius: "8px",
            p: 3,
            textAlign: "center",
            bgcolor: "var(--bg-200)",
            mb: 2,
          }}
        >
          <input
            type="file"
            id="appeal-file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="appeal-file">
            <Button
              variant="outlined"
              component="span"
              sx={{
                borderRadius: "8px",
                bgcolor: "white",
                borderColor: "var(--bg-300)",
                color: "var(--text-300)",
                mb: 1,
              }}
            >
              파일 선택
            </Button>
          </label>
          <Typography variant="body2" color="var(--text-400)">
            SVG, PNG, JPG, GIF, PDF (최대 3MB)
          </Typography>
        </Box>

        {/* 파일 미리보기 */}
        {filePreview && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
              선택된 파일:
            </Typography>
            {filePreview.includes("data:image") ? (
              <img
                src={filePreview}
                alt="미리보기"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  bgcolor: "var(--bg-200)",
                  borderRadius: "4px",
                }}
              >
                <Typography>선택된 파일</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* 저장 버튼 */}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        sx={{
          py: 1.5,
          background: "linear-gradient(90deg, #ffbad0 0%, #5b8def 100%)",
          borderRadius: "8px",
          color: "white",
          fontWeight: 600,
        }}
      >
        프로필 수정하기
      </Button>
    </Box>
  );
}
