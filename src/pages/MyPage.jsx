// src/pages/MyPage.jsx
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ProfileCard from "../components/Profile/ProfileCard";
import ProfileImageUploader from "../components/Profile/ProfileImageUploader";
import MyPageSidebar from "../components/Profile/MyPageSidebar";
import ProfileForm from "../components/Profile/ProfileForm";
import MentorFormView from "../components/Profile/MentorFormView";
import DeleteAccountForm from "../components/Profile/DeleteAccountForm";
import { fetchProfileData, fetchMentorProfile } from "../lib/api/profileApi";
import { useLocation } from "react-router-dom";

import ProfileCardSkeleton from "../components/Profile/skeletons/ProfileCardSkeleton";
import ProfileFormSkeleton from "../components/Profile/skeletons/ProfileFormSkeleton";
import MyPageSidebarSkeleton from "../components/Profile/skeletons/MyPageSidebarSkeleton";
import MentorFormViewSkeleton from "../components/Profile/skeletons/MentorFormViewSkeleton";
import DeleteAccountFormSkeleton from "../components/Profile/skeletons/DeleteAccountFormSkeleton";
import ProfileImageUploaderSkeleton from "../components/Profile/skeletons/ProfileImageUploaderSkeleton";

export default function MyPage() {
  const [profileData, setProfileData] = useState(null);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    "/images/default-profile.svg"
  );

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "profile"
  );

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
    setTabLoading(true);
    setActiveTab(tabName);

    setTimeout(() => {
      setTabLoading(false);
    }, 300);
  };

  const renderActiveTabContent = () => {
    if (loading || tabLoading) {
      switch (activeTab) {
        case "profile":
          return (
            <>
              <ProfileImageUploaderSkeleton />
              <ProfileFormSkeleton />
            </>
          );
        case "mentor":
          return <MentorFormViewSkeleton />;
        case "delete":
          return <DeleteAccountFormSkeleton />;
        default:
          return <ProfileFormSkeleton />;
      }
    }

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
        return <DeleteAccountForm />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      {/* 상단 프로필 카드 영역 */}
      {loading ? (
        <ProfileCardSkeleton />
      ) : (
        <ProfileCard
          profileData={profileData}
          mentorProfile={mentorProfile}
          imagePreview={imagePreview}
        />
      )}

      {/* 하단 메뉴 및 폼 영역 - flex로 좌우 분리 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        {loading ? (
          <MyPageSidebarSkeleton />
        ) : (
          <MyPageSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isLoading={tabLoading}
          />
        )}
        <Box sx={{ flex: 1 }}>{renderActiveTabContent()}</Box>
      </Box>
    </Box>
  );
}
