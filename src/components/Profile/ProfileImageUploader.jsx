// src/components/Profile/ProfileImageUploader.jsx
import { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { uploadProfileImage } from "../../lib/api/profileApi";

export default function ProfileImageUploader({ imagePreview, onImageUpdate }) {
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        // 미리보기만 로컬로 업데이트하고, 실제 저장은 업로드 버튼 클릭 시
        const previewUrl = reader.result;
        onImageUpdate(previewUrl); // 부모 컴포넌트로 미리보기 이미지 URL 전달
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) return;

    setUploading(true);
    try {
      const imageUrl = await uploadProfileImage(profileImage);
      onImageUpdate(imageUrl); // 업로드 성공 시 부모 컴포넌트에 URL 전달
      alert("프로필 이미지가 성공적으로 업데이트되었습니다");
    } catch (error) {
      console.error("이미지 업로드 오류: ", error);
      alert("이미지 업로드 중 오류가 발생했습니다: " + error.message);
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
        mb: 6,
      }}
    >
      {/* 프로필 이미지 */}
      <Box
        component="div"
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          overflow: "hidden",
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

      <label htmlFor="profile-image-upload">
        <Button
          variant="outlined"
          component="span"
          size="small"
          sx={{
            mt: 2,
            fontSize: "0.8rem",
            borderRadius: "20px",
            borderColor: "var(--bg-300)",
            color: "var(--text-300)",
            px: 2,
          }}
        >
          이미지 선택
        </Button>
      </label>

      {/* 이미지 업로드 버튼 - 파일 선택 시에만 표시 */}
      {profileImage && (
        <Button
          variant="contained"
          size="small"
          onClick={handleImageUpload}
          disabled={uploading}
          sx={{
            mt: 1,
            fontSize: "0.8rem",
            borderRadius: "20px",
            background: "var(--primary-100)",
            color: "white",
            px: 2,
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
