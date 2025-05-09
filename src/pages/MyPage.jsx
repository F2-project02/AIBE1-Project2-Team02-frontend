// src/pages/MyPage.jsx
import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import ProfileCard from "../components/Profile/ProfileCard";
import ProfileImageUploader from "../components/Profile/ProfileImageUploader";
import MyPageSidebar from "../components/Profile/MyPageSidebar";
import ProfileForm from "../components/Profile/ProfileForm";
import MentorFormView from "../components/Profile/MentorFormView";
import { fetchProfileData, fetchMentorProfile } from "../lib/api/profileApi";

export default function MyPage() {
  const [profileData, setProfileData] = useState(null);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    "/images/default-profile.svg"
  );

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const data = await fetchProfileData();
        setProfileData(data);
        setImagePreview(data.profileImage || "/images/default-profile.svg");

        // 멘토 프로필 로드
        if (data.role === "MENTOR") {
          const mentorData = await fetchMentorProfile();
          setMentorProfile(mentorData);
        }
      } catch (error) {
        console.error("프로필 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // 프로필 이미지 업데이트 함수
  const handleProfileImageUpdate = (imageUrl) => {
    setProfileData({ ...profileData, profileImage: imageUrl });
    setImagePreview(imageUrl);
  };

  // 프로필 정보 업데이트 함수
  const handleProfileUpdate = (updatedData) => {
    setProfileData({
      ...profileData,
      ...updatedData,
      regions: updatedData.regions || profileData.regions,
    });
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 현재 탭에 맞는 컴포넌트 렌더링
  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <ProfileImageUploader
              imagePreview={imagePreview}
              onImageUpdate={handleProfileImageUpdate}
            />
            {profileData && (
              <ProfileForm
                profileData={profileData}
                onProfileUpdate={handleProfileUpdate}
              />
            )}
          </>
        );
      case "mentor":
        return <MentorFormView onProfileUpdate={() => {}} />;
      case "delete":
        return;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      {/* 상단 프로필 카드 영역 */}
      <ProfileCard
        profileData={profileData}
        mentorProfile={mentorProfile}
        imagePreview={imagePreview}
      />

      {/* 하단 메뉴 및 폼 영역 - flex로 좌우 분리 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* 좌측 메뉴 영역 */}
        <MyPageSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* 우측 프로필 수정 영역 */}
        <Box sx={{ flex: 1 }}>{renderActiveTab()}</Box>
      </Box>
    </Box>
  );
}
