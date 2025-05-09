// src/components/Profile/MentorFormView.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  fetchMentorProfile,
  updateMentorProfile,
} from "../../lib/api/profileApi";

export default function MentorFormView() {
  const [isLoading, setIsLoading] = useState(true);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 멘토 프로필 로드
  useEffect(() => {
    const loadMentorProfile = async () => {
      console.log("멘토 프로필 로드 시작");
      setIsLoading(true);
      try {
        const data = await fetchMentorProfile();
        console.log("멘토 프로필 데이터 수신:", data);

        setMentorProfile(data);
        console.log("MentorProfile 상태 업데이트:", data);

        // 컨텐츠 설정
        console.log("content 설정 전:", data.content);
        setContent(data.content || "");
        console.log("content 설정 후:", data.content);

        // 파일 미리보기 설정
        if (data.appealFileUrl) {
          console.log("파일 URL:", data.appealFileUrl);
          setFilePreview(data.appealFileUrl);
        }

        // 모든 데이터 처리 완료
        console.log("데이터 처리 완료");
      } catch (error) {
        console.error("멘토 프로필 로드 중 오류 발생:", error);
        setError(`멘토 프로필을 불러오는데 실패했습니다: ${error.message}`);
      } finally {
        setIsLoading(false);
        console.log("로딩 상태 종료");
      }
    };

    loadMentorProfile();
  }, []);

  // 컴포넌트 상태 디버깅
  console.log("컴포넌트 렌더링:", {
    isLoading,
    mentorProfile,
    content,
    filePreview,
    error,
  });

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("폼 제출 시작");

    if (!content || content.length < 10) {
      setError("자기소개는 최소 10자 이상 작성해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (file) {
        formData.append("appealFile", file);
      }

      console.log("멘토 프로필 업데이트 요청");
      await updateMentorProfile(formData);
      console.log("멘토 프로필 업데이트 성공");

      setSuccess(true);
    } catch (error) {
      console.error("멘토 프로필 업데이트 중 오류:", error);
      setError(`멘토 프로필 업데이트 실패: ${error.message}`);
    }
  };

  // 로딩 중 UI
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

  // 오류 발생 시 UI
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

  // 데이터 유효성 검사
  if (!mentorProfile) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "var(--bg-200)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="warning.main" gutterBottom>
          멘토 프로필 데이터가 없습니다
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          데이터를 불러왔지만 프로필 정보가 존재하지 않습니다.
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
            {filePreview.includes("data:image") ||
            filePreview.includes("http") ? (
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
                <Typography>
                  {file ? file.name : "현재 업로드된 파일"}
                </Typography>
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
