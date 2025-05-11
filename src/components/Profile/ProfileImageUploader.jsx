// src/components/Profile/ProfileImageUploader.jsx
import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { uploadProfileImage } from "../../lib/api/profileApi";

export default function ProfileImageUploader({ imagePreview, onImageUpdate }) {
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result;
        onImageUpdate(previewUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) return;

    setUploading(true);
    try {
      const imageUrl = await uploadProfileImage(profileImage);
      onImageUpdate(imageUrl);
      alert("프로필 이미지가 성공적으로 업데이트되었습니다");
    } catch (error) {
      console.error("이미지 업로드 오류: ", error);
      alert("이미지 업로드 중 오류가 발생했어요: " + error.message);
    } finally {
      setUploading(false);
      setProfileImage(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        mb: { xs: 4, md: 6 },
      }}
    >
      {/* 프로필 이미지 */}
      <Box
        component="div"
        sx={{
          width: { xs: 100, sm: 120 },
          height: { xs: 100, sm: 120 },
          borderRadius: "50%",
          bgcolor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          overflow: "hidden",
          border: "1px solid var(--bg-200)",
        }}
      >
        <img
          src={imagePreview}
          alt="프로필 이미지"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <input
        type="file"
        id="profile-image-upload"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {/* 버튼 스타일 변경 */}
      <label htmlFor="profile-image-upload">
        <Button
          variant="outlined"
          component="span"
          sx={{
            mt: 2,
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            borderRadius: "8px",
            borderColor: "var(--text-400)",
            color: "var(--text-400)",
            px: { xs: 2, sm: 3 },
            py: 1,
            minWidth: { xs: "160px", sm: "180px" },
            fontWeight: 500,
            "&:hover": {
              borderColor: "var(--text-300)",
              backgroundColor: "var(--bg-200)",
            },
          }}
        >
          프로필 이미지 변경
        </Button>
      </label>

      {/* 이미지 업로드 버튼 */}
      {profileImage && (
        <Button
          variant="contained"
          onClick={handleImageUpload}
          disabled={uploading}
          sx={{
            mt: 1,
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            borderRadius: "8px",
            backgroundColor: "var(--primary-100)",
            color: "white",
            px: { xs: 2, sm: 3 },
            py: 1,
            minWidth: { xs: "160px", sm: "180px" },
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "var(--primary-200)",
            },
          }}
        >
          {uploading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            "업로드"
          )}
        </Button>
      )}
    </Box>
  );
}
