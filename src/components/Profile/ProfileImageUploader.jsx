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
          width: 120,
          height: 120,
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
            fontSize: "0.9rem",
            borderRadius: "8px",
            borderColor: "var(--text-400)",
            color: "var(--text-400)",
            px: 3,
            py: 1,
            minWidth: "180px",
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

      {/* 이미지 업로드 버튼 - 파일 선택 시에만 표시 */}
      {profileImage && (
        <Button
          variant="contained"
          onClick={handleImageUpload}
          disabled={uploading}
          sx={{
            mt: 1,
            fontSize: "0.9rem",
            borderRadius: "8px", // 각진 모서리
            backgroundColor: "var(--primary-100)", // 색상 변경
            color: "white",
            px: 3,
            py: 1, // 버튼 크기 증가
            minWidth: "180px", // 버튼 너비 증가
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
