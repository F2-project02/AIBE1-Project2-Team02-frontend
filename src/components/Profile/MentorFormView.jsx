// src/components/Profile/MentorFormView.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import {
  fetchMentorProfile,
  updateMentorProfile,
  applyMentorProfile,
} from "../../lib/api/profileApi";
import { useUserStore } from "../../store/useUserStore";
import MentorFormViewSkeleton from "./skeletons/MentorFormViewSkeleton";
import FormFieldWrapper from "../CreateLecture/FormFieldWrapper";
import fileUploadIcon from "../../assets/file-upload.png";
import logoImage from "../../assets/navbar-logo.svg";

export default function MentorFormView() {
  const [isLoading, setIsLoading] = useState(true);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [contentError, setContentError] = useState("");

  const { role, updateRole } = useUserStore();
  const isMentor = role === "MENTOR";

  // 멘토 프로필 로드 (멘토인 경우만)
  useEffect(() => {
    const loadMentorProfile = async () => {
      if (!isMentor) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchMentorProfile();

        setMentorProfile(data);
        setContent(data.content || "");

        if (data.appealFileUrl) {
          setFilePreview(data.appealFileUrl);
        }
      } catch (error) {
        setError(`멘토 프로필을 불러오는데 실패했습니다: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadMentorProfile();
  }, [isMentor]);

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

    // 자기소개 유효성 검사
    if (!content || content.length < 10) {
      setContentError("자기소개는 최소 10자 이상 작성해주세요.");
      return;
    } else {
      setContentError("");
    }

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (file) {
        formData.append("appealFile", file);
      }

      if (isMentor) {
        await updateMentorProfile(formData);
      } else {
        await applyMentorProfile(formData);
        updateRole("MENTOR");

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }

      setSuccess(true);
    } catch (error) {
      console.error(
        isMentor ? "멘토 프로필 업데이트 중 오류:" : "멘토 신청 중 오류:",
        error
      );
      setError(
        `${isMentor ? "멘토 프로필 업데이트" : "멘토 신청"} 실패: ${
          error.message
        }`
      );
    }
  };

  // 로딩 중 UI
  if (isLoading) {
    return <MentorFormViewSkeleton />;
  }

  // 오류 발생 시 UI
  if (error && isMentor) {
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
  if (!mentorProfile && isMentor) {
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
    <Box>
      {/* 로고 및 환영 메시지 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 5,
        }}
      >
        {/* 로고 이미지 */}
        <Box
          component="img"
          src={logoImage}
          alt="MEN:TOSS 로고"
          sx={{
            width: 100,
            height: 100,
            mb: 3,
          }}
        />

        {/* 상단 멘토 안내 메시지 */}
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          지금, 누군가의 길잡이가 되어주세요
        </Typography>
        <Typography color="var(--text-300)">
          멘토 프로필을 완성하고, 나만의 과외 수업을 시작해보세요.
        </Typography>
      </Box>

      {/* 폼 내용 */}
      <Box component="form" onSubmit={handleSubmit}>
        {/* 성공 메시지 */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {isMentor
              ? "멘토 프로필이 성공적으로 업데이트되었습니다."
              : "멘토 신청이 완료되었습니다. 페이지가 새로고침됩니다."}
          </Alert>
        )}

        {/* 학력 */}
        <FormFieldWrapper label="학력">
          <Box
            sx={{
              p: 2,
              bgcolor: "var(--bg-200)",
              borderRadius: "8px",
              border: "1px solid var(--bg-300)",
            }}
          >
            <Typography color="var(--text-300)" fontStyle="italic">
              mentoss@gmail.com으로 재학증명서 또는 졸업증명서를 제출한 후에
              인증받을 수 있어요.
            </Typography>
          </Box>
        </FormFieldWrapper>

        {/* 자기소개 */}
        <FormFieldWrapper label="자기소개" required>
          <TextField
            multiline
            rows={6}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="멘토로서의 자기소개를 작성해주세요. (최소 10자)"
            required
            error={!!contentError}
            helperText={contentError}
            sx={{
              bgcolor: "white",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </FormFieldWrapper>

        {/* 어필 파일 업로드 */}
        <FormFieldWrapper label="포트폴리오">
          {/* 파일 업로드 영역 */}
          <Box
            sx={{
              border: "2px dashed var(--bg-300)",
              borderRadius: "8px",
              py: 5,
              px: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              bgcolor: "white",
              mb: 2,
              minHeight: "180px",
            }}
          >
            <Box
              component="img"
              src={fileUploadIcon}
              alt="파일 업로드"
              sx={{
                width: 48,
                height: 48,
                mb: 2,
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("appeal-file").click()}
            />

            <Box sx={{ mb: 1.5 }}>
              <Typography
                component="span"
                sx={{
                  color: "var(--primary-100)",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
                onClick={() => document.getElementById("appeal-file").click()}
              >
                Link
              </Typography>
              <Typography component="span" color="var(--text-300)">
                {" or drag and drop"}
              </Typography>
            </Box>

            <Typography variant="body2" color="var(--text-400)">
              SVG, PNG, JPG or GIF, PDF (max. 3MB)
            </Typography>

            <input
              type="file"
              id="appeal-file"
              accept=".pdf,.jpg,.jpeg,.png,.svg,.gif"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>

          {/* 선택된 파일 표시 */}
          {filePreview && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "4px",
                mb: 2,
                py: 2,
                bgcolor: "white",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
                border: "1px solid var(--bg-200)",
              }}
            >
              <Box
                component="div"
                sx={{
                  color: "var(--primary-100)",
                  fontSize: 24,
                  mr: 2,
                  ml: 2,
                }}
              >
                📄
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={500} fontSize={14}>
                  {file ? file.name : filePreview.split("/").pop()}
                </Typography>
                <Typography variant="caption" color="var(--text-400)">
                  {file ? `${Math.round(file.size / 1024)}kb` : "100kb"} •
                  Complete
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setFile(null);
                    setFilePreview(null);
                  }}
                  sx={{ color: "var(--text-300)" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "var(--action-green)",
                    color: "white",
                  }}
                >
                  <CheckIcon fontSize="small" />
                </Box>
              </Box>
            </Box>
          )}
        </FormFieldWrapper>

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
          {isMentor ? "프로필 수정하기" : "멘토 신청하기"}
        </Button>
      </Box>
    </Box>
  );
}
